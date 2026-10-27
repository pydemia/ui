import assert from "node:assert/strict";
import test from "node:test";
import {
    alignFlowNode, copyFlowSelection, createFlowHistory, cutFlowSelection,
    groupFlowSelection, layoutFlowGraph, pasteFlowSelection,
    reduceFlowHistory, resolveFlowShortcut, translateFlowControls,
    ungroupFlowSelection,
} from "../dist/index.js";

function sampleGraph() {
    return {
        nodes: [
            { id: "start", type: "pyd-flow-node", selected: true,
                position: { x: 10, y: 20 }, data: { title: "시작" } },
            { id: "review", type: "pyd-flow-node", selected: true,
                position: { x: 110, y: 20 }, data: { title: "검토" } },
            { id: "done", type: "pyd-flow-node",
                position: { x: 210, y: 20 }, data: { title: "완료" } },
        ],
        edges: [
            { id: "a", type: "pyd-flow-edge", source: "start",
                target: "review" },
            { id: "b", type: "pyd-flow-edge", source: "review",
                target: "done" },
        ],
    };
}

test("history restores one committed graph edit and drops redo after a new edit", () => {
    const initial = sampleGraph();
    let state = createFlowHistory(initial);
    state = reduceFlowHistory(state, { type: "commit", update: (graph) => ({
        ...graph, nodes: graph.nodes.slice(0, 2), edges: graph.edges.slice(0, 1),
    }) });
    assert.equal(state.past.length, 1);
    assert.equal(state.present.nodes.length, 2);
    state = reduceFlowHistory(state, { type: "undo" });
    assert.deepEqual(state.present, initial);
    assert.equal(state.future.length, 1);
    state = reduceFlowHistory(state, { type: "redo" });
    assert.equal(state.present.nodes.length, 2);
    state = reduceFlowHistory(state, { type: "undo" });
    state = reduceFlowHistory(state, { type: "commit", update: (graph) => ({
        ...graph, nodes: graph.nodes.map((node) => node.id === "start"
            ? { ...node, data: { title: "새 시작" } } : node),
    }) });
    assert.equal(state.future.length, 0);
    assert.equal(state.present.nodes[0].data.title, "새 시작");
});

test("gesture writes one history item for many positions and skips no-op gestures", () => {
    let state = createFlowHistory(sampleGraph());
    state = reduceFlowHistory(state, { type: "begin-gesture" });
    for (const x of [20, 30, 40]) {
        state = reduceFlowHistory(state, { type: "transient",
            update: (graph) => ({ ...graph,
                nodes: graph.nodes.map((node) => node.id === "start"
                    ? { ...node, position: { x, y: 20 } } : node),
            }),
        });
    }
    state = reduceFlowHistory(state, { type: "end-gesture" });
    assert.equal(state.past.length, 1);
    assert.equal(state.present.nodes[0].position.x, 40);
    state = reduceFlowHistory(state, { type: "undo" });
    assert.equal(state.present.nodes[0].position.x, 10);
    state = reduceFlowHistory(state, { type: "begin-gesture" });
    state = reduceFlowHistory(state, { type: "end-gesture" });
    assert.equal(state.past.length, 0);
});

test("clipboard keeps only internal edges and regenerates IDs on repeat paste", () => {
    const graph = sampleGraph();
    const copied = copyFlowSelection(graph);
    assert.deepEqual(copied.nodes.map((node) => node.id), ["start", "review"]);
    assert.deepEqual(copied.edges.map((edge) => edge.id), ["a"]);
    const first = pasteFlowSelection(graph, copied);
    const second = pasteFlowSelection(first, copied, { x: 64, y: 64 });
    assert.equal(new Set(second.nodes.map((node) => node.id)).size,
        second.nodes.length);
    assert.equal(new Set(second.edges.map((edge) => edge.id)).size,
        second.edges.length);
    assert.deepEqual(first.nodes.slice(-2).map((node) => node.position), [
        { x: 42, y: 52 }, { x: 142, y: 52 },
    ]);
    assert.equal(first.edges.at(-1).source, first.nodes.at(-2).id);
    assert.equal(first.edges.at(-1).target, first.nodes.at(-1).id);
    assert.equal(graph.nodes.length, 3);
});

test("cutting one selected edge keeps its endpoints, and groups copy children", () => {
    const edgeGraph = sampleGraph();
    edgeGraph.nodes.forEach((node) => { node.selected = false; });
    edgeGraph.edges[0].selected = true;
    const cut = cutFlowSelection(edgeGraph);
    assert.equal(cut.graph.nodes.length, 3);
    assert.deepEqual(cut.graph.edges.map((edge) => edge.id), ["b"]);
    assert.deepEqual(cut.clipboard.nodes.map((node) => node.id),
        ["start", "review"]);

    const grouped = sampleGraph();
    grouped.nodes[0].selected = true;
    grouped.nodes[1].selected = false;
    grouped.nodes[1].parentId = "start";
    grouped.nodes[1].position = { x: 15, y: 5 };
    grouped.nodes[2].selected = false;
    const copied = copyFlowSelection(grouped);
    const pasted = pasteFlowSelection(grouped, copied);
    assert.equal(copied.nodes.length, 2);
    assert.equal(pasted.nodes.at(-1).parentId, pasted.nodes.at(-2).id);
    assert.deepEqual(pasted.nodes.at(-1).position, { x: 15, y: 5 });
});

test("grouping preserves screen positions and ungrouping restores them", () => {
    const graph = sampleGraph();
    const grouped = groupFlowSelection(graph, "bundle");
    assert.equal(grouped.nodes[0].type, "pyd-flow-group");
    assert.deepEqual(grouped.nodes.slice(1, 3).map((node) => node.parentId),
        ["bundle", "bundle"]);
    assert.deepEqual(grouped.nodes.slice(1, 3).map((node) => ({
        x: node.position.x + grouped.nodes[0].position.x,
        y: node.position.y + grouped.nodes[0].position.y,
    })), graph.nodes.slice(0, 2).map((node) => node.position));
    assert.deepEqual(grouped.edges, graph.edges);
    const restored = ungroupFlowSelection(grouped);
    assert.deepEqual(restored.nodes.map((node) => node.position),
        graph.nodes.map((node) => node.position));
    assert(restored.nodes.every((node) => !node.parentId));
});

test("layout is stable for branches and cycles and keeps group children relative", () => {
    const graph = sampleGraph();
    graph.edges.push({ id: "c", source: "review", target: "start" });
    const once = layoutFlowGraph(graph);
    const twice = layoutFlowGraph(once);
    assert.deepEqual(once, twice);
    assert(once.nodes.every((node) => Number.isFinite(node.position.x) &&
        Number.isFinite(node.position.y)));
    assert.deepEqual(layoutFlowGraph({ nodes: [], edges: [] }),
        { nodes: [], edges: [] });
    const grouped = groupFlowSelection(graph, "bundle");
    const laidOut = layoutFlowGraph(grouped);
    assert.deepEqual(laidOut.nodes.filter((node) => node.parentId)
        .map((node) => node.position),
    grouped.nodes.filter((node) => node.parentId)
        .map((node) => node.position));
});

test("alignment guide and snap share the same coordinate at each zoom", () => {
    const graph = sampleGraph();
    const moving = { ...graph.nodes[1],
        position: { x: 16, y: 20 } };
    const aligned = alignFlowNode(moving, [graph.nodes[0]], 1);
    assert.equal(aligned.position.x, 10);
    assert.deepEqual(aligned.guides, [
        { axis: "x", value: 10 }, { axis: "y", value: 20 },
    ]);
    const farther = { ...moving, position: { x: 20, y: 20 } };
    assert.equal(alignFlowNode(farther, [graph.nodes[0]], 1)
        .position.x, 20);
    assert.equal(alignFlowNode(farther, [graph.nodes[0]], 0.5)
        .position.x, 10);
});

test("edge control point follows group movement, layout and pasted nodes", () => {
    const graph = sampleGraph();
    graph.edges[0].data = { controlPoint: { x: 80, y: 10 } };
    const grouped = groupFlowSelection(graph, "bundle");
    const moved = translateFlowControls(grouped,
        grouped.nodes.map((node) => node.id === "bundle" ? {
            ...node, position: { x: node.position.x + 40,
                y: node.position.y + 20 },
        } : node));
    assert.deepEqual(moved.edges[0].data.controlPoint, { x: 120, y: 30 });
    const laidOut = layoutFlowGraph(moved);
    assert(Number.isFinite(laidOut.edges[0].data.controlPoint.x));
    const copied = copyFlowSelection(grouped);
    const pasted = pasteFlowSelection(grouped, copied, { x: 32, y: 32 });
    assert.deepEqual(pasted.edges.at(-1).data.controlPoint,
        { x: 112, y: 42 });
});

test("keyboard commands stay scoped and preserve native text editing", () => {
    const event = { ctrlKey: true, metaKey: false, altKey: false,
        shiftKey: false, target: { tagName: "BUTTON" } };
    assert.equal(resolveFlowShortcut({ ...event, key: "c" }), "copy");
    assert.equal(resolveFlowShortcut({ ...event, key: "x" }), "cut");
    assert.equal(resolveFlowShortcut({ ...event, key: "v" }), "paste");
    assert.equal(resolveFlowShortcut({ ...event, key: "z" }), "undo");
    assert.equal(resolveFlowShortcut({ ...event, key: "z",
        shiftKey: true }), "redo");
    assert.equal(resolveFlowShortcut({ ...event, key: "c",
        target: { tagName: "INPUT" } }), null);
    assert.equal(resolveFlowShortcut({ ...event, key: "c",
        target: { tagName: "DIV", isContentEditable: true } }), null);
    assert.equal(resolveFlowShortcut({ ...event, key: "c",
        ctrlKey: false }), null);
});
