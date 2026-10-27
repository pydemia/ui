import type { FlowEdge, FlowNode } from "./flow-canvas";

type FlowClipboard = { nodes: FlowNode[]; edges: FlowEdge[] };
type FlowGraph = { nodes: FlowNode[]; edges: FlowEdge[] };

function absolutePosition(node: FlowNode, byId: Map<string, FlowNode>) {
    let x = node.position.x;
    let y = node.position.y;
    let parent = node.parentId;
    const seen = new Set([node.id]);
    while (parent && !seen.has(parent)) {
        const ancestor = byId.get(parent);
        if (!ancestor) break;
        seen.add(parent);
        x += ancestor.position.x;
        y += ancestor.position.y;
        parent = ancestor.parentId;
    }
    return { x, y };
}

function copyFlowSelection(graph: FlowGraph): FlowClipboard | null {
    const byId = new Map(graph.nodes.map((node) => [node.id, node]));
    const selected = new Set(graph.nodes.filter((node) => node.selected)
        .map((node) => node.id));
    for (const edge of graph.edges) {
        if (edge.selected) {
            selected.add(edge.source);
            selected.add(edge.target);
        }
    }
    let changed = true;
    while (changed) {
        changed = false;
        for (const node of graph.nodes) {
            if (node.parentId && selected.has(node.parentId) &&
                !selected.has(node.id)) {
                selected.add(node.id);
                changed = true;
            }
        }
    }
    if (selected.size === 0) return null;
    const nodes = graph.nodes.filter((node) => selected.has(node.id))
        .map((node) => {
            const copy = structuredClone(node);
            if (copy.parentId && !selected.has(copy.parentId)) {
                copy.position = absolutePosition(node, byId);
                delete copy.parentId;
                delete copy.extent;
            }
            return copy;
        });
    const edges = graph.edges.filter((edge) =>
        selected.has(edge.source) && selected.has(edge.target))
        .map((edge) => structuredClone(edge));
    return { nodes, edges };
}

function cutFlowSelection(graph: FlowGraph) {
    const clipboard = copyFlowSelection(graph);
    if (!clipboard) return { graph, clipboard: null };
    const removed = new Set(graph.nodes.filter((node) => node.selected)
        .map((node) => node.id));
    let changed = true;
    while (changed) {
        changed = false;
        for (const node of graph.nodes) {
            if (node.parentId && removed.has(node.parentId) &&
                !removed.has(node.id)) {
                removed.add(node.id);
                changed = true;
            }
        }
    }
    const nodes = graph.nodes.filter((node) => !removed.has(node.id));
    const edges = graph.edges.filter((edge) =>
        !edge.selected && !removed.has(edge.source) &&
        !removed.has(edge.target));
    return { graph: { nodes, edges }, clipboard };
}

function nextId(original: string, used: Set<string>) {
    const base = `${original}-copy`;
    let candidate = base;
    let suffix = 2;
    while (used.has(candidate)) candidate = `${base}-${suffix++}`;
    used.add(candidate);
    return candidate;
}

function pasteFlowSelection(
    graph: FlowGraph, clipboard: FlowClipboard,
    offset = { x: 32, y: 32 },
): FlowGraph {
    if (clipboard.nodes.length === 0) return graph;
    const nodeIds = new Set(graph.nodes.map((node) => node.id));
    const edgeIds = new Set(graph.edges.map((edge) => edge.id));
    const remap = new Map(clipboard.nodes.map((node) =>
        [node.id, nextId(node.id, nodeIds)]));
    const nodes = clipboard.nodes.map((node) => {
        const copy = structuredClone(node);
        copy.id = remap.get(node.id)!;
        copy.parentId = node.parentId ? remap.get(node.parentId) : undefined;
        if (!copy.parentId) {
            copy.position = {
                x: node.position.x + offset.x,
                y: node.position.y + offset.y,
            };
        }
        copy.selected = true;
        return copy;
    });
    const edges = clipboard.edges.flatMap((edge) => {
        const source = remap.get(edge.source);
        const target = remap.get(edge.target);
        if (!source || !target) return [];
        return [{ ...structuredClone(edge),
            id: nextId(edge.id, edgeIds), source, target,
            selected: true,
            data: edge.data?.controlPoint ? { ...edge.data,
                controlPoint: {
                    x: edge.data.controlPoint.x + offset.x,
                    y: edge.data.controlPoint.y + offset.y,
                } } : edge.data }];
    });
    return {
        nodes: [...graph.nodes.map((node) => ({ ...node, selected: false })),
            ...nodes],
        edges: [...graph.edges.map((edge) => ({ ...edge, selected: false })),
            ...edges],
    };
}

export { copyFlowSelection, cutFlowSelection, pasteFlowSelection };
export type { FlowClipboard, FlowGraph };
