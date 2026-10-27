import { useReducer } from "react";

type FlowDocument<Node, Edge> = {
    nodes: Node[];
    edges: Edge[];
};

type FlowHistoryState<Node, Edge> = {
    present: FlowDocument<Node, Edge>;
    past: FlowDocument<Node, Edge>[];
    future: FlowDocument<Node, Edge>[];
    gestureStart: FlowDocument<Node, Edge> | null;
};

type FlowHistoryAction<Node, Edge> =
    | { type: "commit" | "transient";
        update: (document: FlowDocument<Node, Edge>) => FlowDocument<Node, Edge> }
    | { type: "begin-gesture" | "end-gesture" | "undo" | "redo" }
    | { type: "reset"; document: FlowDocument<Node, Edge> };

const historyLimit = 50;

type FlowShortcut = "undo" | "redo" | "copy" | "cut" | "paste";
type FlowShortcutEvent = {
    key: string;
    ctrlKey: boolean;
    metaKey: boolean;
    altKey?: boolean;
    shiftKey: boolean;
    target: { tagName: string; isContentEditable?: boolean };
};

function resolveFlowShortcut(event: FlowShortcutEvent): FlowShortcut | null {
    if ((!event.ctrlKey && !event.metaKey) || event.altKey ||
        event.target.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(
            event.target.tagName.toUpperCase())) return null;
    switch (event.key.toLowerCase()) {
        case "z": return event.shiftKey ? "redo" : "undo";
        case "y": return "redo";
        case "c": return "copy";
        case "x": return "cut";
        case "v": return "paste";
        default: return null;
    }
}

function contentSignature<Node, Edge>(document: FlowDocument<Node, Edge>) {
    return JSON.stringify({
        nodes: document.nodes.map((node) => {
            const { selected: _selected, dragging: _dragging,
                measured: _measured, ...content } = node as Record<string, unknown>;
            return content;
        }),
        edges: document.edges.map((edge) => {
            const { selected: _selected, ...content } =
                edge as Record<string, unknown>;
            return content;
        }),
    });
}

function createFlowHistory<Node, Edge>(document: FlowDocument<Node, Edge>):
    FlowHistoryState<Node, Edge> {
    return { present: document, past: [], future: [], gestureStart: null };
}

function reduceFlowHistory<Node, Edge>(
    state: FlowHistoryState<Node, Edge>, action: FlowHistoryAction<Node, Edge>,
): FlowHistoryState<Node, Edge> {
    if (action.type === "reset") return createFlowHistory(action.document);
    if (action.type === "begin-gesture") {
        return state.gestureStart ? state :
            { ...state, gestureStart: state.present };
    }
    if (action.type === "end-gesture") {
        if (!state.gestureStart) return state;
        if (contentSignature(state.gestureStart) ===
            contentSignature(state.present)) {
            return { ...state, gestureStart: null };
        }
        return {
            ...state,
            past: [...state.past, state.gestureStart].slice(-historyLimit),
            future: [], gestureStart: null,
        };
    }
    if (action.type === "undo") {
        if (state.past.length === 0) return state;
        const previous = state.past[state.past.length - 1];
        return {
            present: previous,
            past: state.past.slice(0, -1),
            future: [state.present, ...state.future].slice(0, historyLimit),
            gestureStart: null,
        };
    }
    if (action.type === "redo") {
        if (state.future.length === 0) return state;
        const [next, ...future] = state.future;
        return {
            present: next,
            past: [...state.past, state.present].slice(-historyLimit),
            future, gestureStart: null,
        };
    }
    if (action.type !== "commit" && action.type !== "transient") {
        return state;
    }
    const next = action.update(state.present);
    if (next === state.present) return state;
    if (action.type === "transient") return { ...state, present: next };
    if (contentSignature(next) === contentSignature(state.present)) {
        return { ...state, present: next };
    }
    return {
        present: next,
        past: [...state.past, state.present].slice(-historyLimit),
        future: [], gestureStart: null,
    };
}

function useFlowHistory<Node, Edge>(initial: FlowDocument<Node, Edge>) {
    return useReducer(reduceFlowHistory<Node, Edge>, initial,
        createFlowHistory<Node, Edge>);
}

export { createFlowHistory, reduceFlowHistory, resolveFlowShortcut,
    useFlowHistory };
export type { FlowDocument, FlowHistoryAction, FlowHistoryState,
    FlowShortcut, FlowShortcutEvent };
