import type { FlowGraph } from "./flow-clipboard";
import type { FlowNode } from "./flow-canvas";
import { flowNodeSize } from "./flow-alignment";

const padding = 28;
const headerHeight = 34;

function groupFlowSelection(graph: FlowGraph, groupId: string): FlowGraph {
    if (graph.nodes.some((node) => node.id === groupId)) return graph;
    const selected = graph.nodes.filter((node) => node.selected);
    if (selected.length < 2 || selected.some((node) =>
        node.parentId !== selected[0].parentId)) return graph;
    const left = Math.min(...selected.map((node) => node.position.x));
    const top = Math.min(...selected.map((node) => node.position.y));
    const right = Math.max(...selected.map((node) =>
        node.position.x + flowNodeSize(node).width));
    const bottom = Math.max(...selected.map((node) =>
        node.position.y + flowNodeSize(node).height));
    const origin = { x: left - padding, y: top - padding - headerHeight };
    const group: FlowNode = {
        id: groupId, type: "pyd-flow-group", position: origin,
        width: right - left + padding * 2,
        height: bottom - top + padding * 2 + headerHeight,
        data: { title: "새 그룹" }, selected: true,
        parentId: selected[0].parentId,
        extent: selected[0].parentId ? "parent" : undefined,
    };
    const children = new Set(selected.map((node) => node.id));
    const first = graph.nodes.findIndex((node) => children.has(node.id));
    const nodes = graph.nodes.flatMap((node, index) => {
        const entry = children.has(node.id) ? {
            ...node, parentId: groupId, extent: "parent" as const,
            position: {
                x: node.position.x - origin.x,
                y: node.position.y - origin.y,
            }, selected: false,
        } : { ...node, selected: false };
        return index === first ? [group, entry] : [entry];
    });
    return { nodes, edges: graph.edges };
}

function ungroupFlowSelection(graph: FlowGraph): FlowGraph {
    const candidates = new Map(graph.nodes.filter((node) =>
        node.selected && node.type === "pyd-flow-group")
        .map((node) => [node.id, node]));
    const groups = new Map([...candidates].filter(([, node]) => {
        let ancestor = node.parentId;
        while (ancestor) {
            if (candidates.has(ancestor)) return false;
            ancestor = graph.nodes.find((entry) => entry.id === ancestor)?.parentId;
        }
        return true;
    }));
    if (groups.size === 0) return graph;
    const nodes = graph.nodes.flatMap((node) => {
        if (groups.has(node.id)) return [];
        const parent = node.parentId && groups.get(node.parentId);
        if (!parent) return [{ ...node, selected: false }];
        const next: FlowNode = {
            ...node,
            parentId: parent.parentId,
            position: {
                x: node.position.x + parent.position.x,
                y: node.position.y + parent.position.y,
            },
            selected: true,
        };
        if (!next.parentId) delete next.extent;
        return [next];
    });
    return { nodes, edges: graph.edges };
}

export { groupFlowSelection, ungroupFlowSelection };
