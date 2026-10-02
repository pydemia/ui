import {
    useEffect, useId, useRef, useState,
    type KeyboardEvent, type PointerEvent,
} from "react";
import { Button } from "./button";
import { cn } from "./utils";

type NodeCanvasNode = {
    id: string;
    title: string;
    description?: string;
    x: number;
    y: number;
};

type NodeCanvasEdge = {
    id: string;
    from: string;
    to: string;
    label?: string;
};

type NodeCanvasMove = {
    nodeId: string;
    x: number;
    y: number;
    source: "pointer" | "keyboard" | "coordinates";
};

type NodeCanvasProps = {
    label: string;
    nodes: readonly NodeCanvasNode[];
    edges: readonly NodeCanvasEdge[];
    width?: number;
    height?: number;
    variant?: "grid" | "plain";
    onNodesChange?: (
        nodes: NodeCanvasNode[], move: NodeCanvasMove,
    ) => void;
    onConnect?: (fromId: string, toId: string) => void;
    onDisconnect?: (edgeId: string) => void;
    onSelectionChange?: (nodeId: string) => void;
    className?: string;
};

const nodeWidth = 176;
const nodeHeight = 96;
const zoomLevels = [0.75, 1, 1.25, 1.5] as const;

function validateGraph(
    nodes: readonly NodeCanvasNode[],
    edges: readonly NodeCanvasEdge[],
    width: number,
    height: number,
) {
    if (!Number.isInteger(width) || !Number.isInteger(height) ||
        width < 320 || height < 240 || width > 5000 || height > 5000) {
        throw new RangeError("NodeCanvas dimensions must be 320–5000px.");
    }
    if (!Array.isArray(nodes) || !Array.isArray(edges)) {
        throw new TypeError("NodeCanvas nodes and edges must be arrays.");
    }
    const nodeIds = new Set<string>();
    for (const node of nodes) {
        if (!node || typeof node.id !== "string" || !node.id.trim() ||
            nodeIds.has(node.id) || typeof node.title !== "string" ||
            !node.title.trim() ||
            (node.description !== undefined &&
                typeof node.description !== "string") ||
            !Number.isFinite(node.x) ||
            !Number.isFinite(node.y) || node.x < 0 || node.y < 0 ||
            node.x > width - nodeWidth ||
            node.y > height - nodeHeight) {
            throw new Error(
                "NodeCanvas nodes need unique IDs, titles and " +
                "positions inside the canvas.",
            );
        }
        nodeIds.add(node.id);
    }
    const edgeIds = new Set<string>();
    for (const edge of edges) {
        if (!edge || typeof edge.id !== "string" || !edge.id.trim() ||
            edgeIds.has(edge.id) || !nodeIds.has(edge.from) ||
            !nodeIds.has(edge.to) || edge.from === edge.to ||
            (edge.label !== undefined &&
                typeof edge.label !== "string")) {
            throw new Error(
                "NodeCanvas edges need unique IDs and distinct nodes.",
            );
        }
        edgeIds.add(edge.id);
    }
}

function clamp(value: number, maximum: number) {
    return Math.max(0, Math.min(maximum, Math.round(value)));
}

function edgePath(from: NodeCanvasNode, to: NodeCanvasNode) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    if (Math.abs(dx) >= Math.abs(dy)) {
        const direction = dx >= 0 ? 1 : -1;
        const startX = from.x + (direction > 0 ? nodeWidth : 0);
        const endX = to.x + (direction > 0 ? 0 : nodeWidth);
        const startY = from.y + nodeHeight / 2;
        const endY = to.y + nodeHeight / 2;
        const bend = Math.max(32, Math.abs(endX - startX) / 2);
        return `M ${startX} ${startY} C ${startX + bend * direction} ` +
            `${startY}, ${endX - bend * direction} ${endY}, ` +
            `${endX} ${endY}`;
    }
    const direction = dy >= 0 ? 1 : -1;
    const startX = from.x + nodeWidth / 2;
    const endX = to.x + nodeWidth / 2;
    const startY = from.y + (direction > 0 ? nodeHeight : 0);
    const endY = to.y + (direction > 0 ? 0 : nodeHeight);
    const bend = Math.max(32, Math.abs(endY - startY) / 2);
    return `M ${startX} ${startY} C ${startX} ` +
        `${startY + bend * direction}, ${endX} ` +
        `${endY - bend * direction}, ${endX} ${endY}`;
}

function NodeCanvas({
    label, nodes, edges, width = 960, height = 560,
    variant = "grid", onNodesChange, onConnect, onDisconnect,
    onSelectionChange, className,
}: NodeCanvasProps) {
    if (typeof label !== "string" || !label.trim()) {
        throw new Error("NodeCanvas requires a label.");
    }
    if (variant !== "grid" && variant !== "plain") {
        throw new RangeError("NodeCanvas variant is not supported.");
    }
    validateGraph(nodes, edges, width, height);

    const markerId = useId().replace(/:/g, "");
    const coordinatesId = useId();
    const [selectedId, setSelectedId] = useState<string | null>(
        nodes[0]?.id ?? null,
    );
    const [targetId, setTargetId] = useState("");
    const [zoomIndex, setZoomIndex] = useState(1);
    const [preview, setPreview] = useState<{
        id: string; x: number; y: number;
    } | null>(null);
    const [draft, setDraft] = useState({ x: "", y: "" });
    const [announcement, setAnnouncement] = useState("");
    const drag = useRef<{
        id: string; pointerId: number; clientX: number; clientY: number;
        x: number; y: number; moved: boolean;
    } | null>(null);
    const selected = nodes.find((node) => node.id === selectedId) ??
        nodes[0] ?? null;
    const zoom = zoomLevels[zoomIndex];
    const positioned = nodes.map((node) => preview?.id === node.id
        ? { ...node, x: preview.x, y: preview.y } : node);
    const nodeById = new Map(positioned.map((node) => [node.id, node]));
    const destinations = nodes.filter((node) => node.id !== selected?.id);
    const destination = destinations.find((node) =>
        node.id === targetId) ?? destinations[0] ?? null;
    const connectionExists = edges.some((edge) =>
        edge.from === selected?.id && edge.to === destination?.id);

    useEffect(() => {
        setDraft({
            x: selected ? String(selected.x) : "",
            y: selected ? String(selected.y) : "",
        });
    }, [selected?.id, selected?.x, selected?.y]);

    function selectNode(node: NodeCanvasNode) {
        setSelectedId(node.id);
        onSelectionChange?.(node.id);
        setAnnouncement(`${node.title} 노드를 선택했습니다.`);
    }

    function moveNode(
        node: NodeCanvasNode, x: number, y: number,
        source: NodeCanvasMove["source"],
    ) {
        if (!onNodesChange) return;
        const nextX = clamp(x, width - nodeWidth);
        const nextY = clamp(y, height - nodeHeight);
        if (nextX === node.x && nextY === node.y) return;
        onNodesChange(nodes.map((item) => item.id === node.id
            ? { ...item, x: nextX, y: nextY } : item), {
            nodeId: node.id, x: nextX, y: nextY, source,
        });
        setAnnouncement(
            `${node.title}: X ${nextX}, Y ${nextY}로 이동했습니다.`,
        );
    }

    function moveWithKeyboard(
        event: KeyboardEvent<HTMLButtonElement>, node: NodeCanvasNode,
    ) {
        if (!onNodesChange) return;
        const step = event.shiftKey ? 1 : 10;
        const offset = {
            ArrowLeft: [-step, 0],
            ArrowRight: [step, 0],
            ArrowUp: [0, -step],
            ArrowDown: [0, step],
        }[event.key];
        if (!offset) return;
        event.preventDefault();
        selectNode(node);
        moveNode(node, node.x + offset[0], node.y + offset[1],
            "keyboard");
    }

    function beginDrag(
        event: PointerEvent<HTMLButtonElement>, node: NodeCanvasNode,
    ) {
        if (event.button !== 0) return;
        selectNode(node);
        if (!onNodesChange) return;
        drag.current = {
            id: node.id, pointerId: event.pointerId,
            clientX: event.clientX, clientY: event.clientY,
            x: node.x, y: node.y, moved: false,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
    }

    function dragTo(event: PointerEvent<HTMLButtonElement>) {
        const current = drag.current;
        if (!current || current.pointerId !== event.pointerId) return;
        const deltaX = (event.clientX - current.clientX) / zoom;
        const deltaY = (event.clientY - current.clientY) / zoom;
        if (!current.moved &&
            Math.abs(deltaX) < 3 && Math.abs(deltaY) < 3) return;
        current.moved = true;
        setPreview({
            id: current.id,
            x: clamp(current.x + deltaX, width - nodeWidth),
            y: clamp(current.y + deltaY, height - nodeHeight),
        });
    }

    function endDrag(event: PointerEvent<HTMLButtonElement>) {
        const current = drag.current;
        if (!current || current.pointerId !== event.pointerId) return;
        drag.current = null;
        setPreview(null);
        if (!current.moved) return;
        const node = nodes.find((item) => item.id === current.id);
        if (node) {
            moveNode(node,
                current.x + (event.clientX - current.clientX) / zoom,
                current.y + (event.clientY - current.clientY) / zoom,
                "pointer");
        }
    }

    function applyCoordinates() {
        if (!selected) return;
        if (!/^\d+$/.test(draft.x) || !/^\d+$/.test(draft.y) ||
            Number(draft.x) > width - nodeWidth ||
            Number(draft.y) > height - nodeHeight) {
            setAnnouncement("캔버스 안의 X·Y 정수를 입력해 주세요.");
            return;
        }
        moveNode(selected, Number(draft.x), Number(draft.y),
            "coordinates");
    }

    return (
        <section aria-label={label}
            className={cn(
                "grid min-w-0 overflow-hidden rounded-sm border " +
                "border-border bg-surface text-foreground",
                className,
            )}>
            <div className={"flex flex-wrap items-center justify-between " +
                "gap-2 border-b border-border px-3 py-2"}>
                <div>
                    <h3 className="m-0 text-sm font-semibold">{label}</h3>
                    <p className="m-0 text-xs text-muted">
                        {nodes.length}개 노드 · {edges.length}개 연결
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button type="button" variant="outline" size="icon"
                        aria-label="축소" disabled={zoomIndex === 0}
                        onClick={() => setZoomIndex(zoomIndex - 1)}>
                        −
                    </Button>
                    <span className="min-w-10 text-center text-xs tabular-nums">
                        {Math.round(zoom * 100)}%
                    </span>
                    <Button type="button" variant="outline" size="icon"
                        aria-label="확대"
                        disabled={zoomIndex === zoomLevels.length - 1}
                        onClick={() => setZoomIndex(zoomIndex + 1)}>
                        +
                    </Button>
                </div>
            </div>
            <div role="region" aria-label={`${label} 작업 영역`}
                tabIndex={0}
                className="min-h-64 max-h-[30rem] overflow-auto bg-surface-subtle">
                <div style={{
                    width: width * zoom, height: height * zoom,
                    position: "relative",
                }}>
                    <div style={{
                        width, height, position: "absolute", inset: 0,
                        transform: `scale(${zoom})`,
                        transformOrigin: "top left",
                        backgroundImage: variant === "grid"
                            ? "linear-gradient(to right, var(--border) 1px, " +
                                "transparent 1px), linear-gradient(" +
                                "to bottom, var(--border) 1px, " +
                                "transparent 1px)"
                            : undefined,
                        backgroundSize: "20px 20px",
                    }}>
                        <svg aria-hidden="true" width={width} height={height}
                            className="absolute inset-0 overflow-visible text-muted">
                            <defs>
                                <marker id={markerId} markerWidth="8"
                                    markerHeight="8" refX="7" refY="4"
                                    orient="auto" markerUnits="userSpaceOnUse">
                                    <path d="M 0 0 L 8 4 L 0 8 Z"
                                        fill="currentColor" />
                                </marker>
                            </defs>
                            {edges.map((edge) => (
                                <path key={edge.id}
                                    d={edgePath(
                                        nodeById.get(edge.from)!,
                                        nodeById.get(edge.to)!,
                                    )}
                                    fill="none" stroke="currentColor"
                                    strokeWidth="2"
                                    markerEnd={`url(#${markerId})`} />
                            ))}
                        </svg>
                        {nodes.length === 0 && (
                            <p className="absolute left-4 top-4 text-sm text-muted">
                                노드가 없습니다.
                            </p>
                        )}
                        {positioned.map((node) => (
                            <div key={node.id} data-node-id={node.id}
                                style={{
                                    left: node.x, top: node.y,
                                    width: nodeWidth, height: nodeHeight,
                                }}
                                className={cn(
                                    "absolute overflow-hidden rounded-sm " +
                                    "border bg-surface shadow-sm",
                                    selected?.id === node.id
                                        ? "border-accent ring-2 ring-accent"
                                        : "border-border",
                                )}>
                                <button type="button"
                                    aria-pressed={selected?.id === node.id}
                                    aria-label={`${node.title} 노드 선택`}
                                    aria-describedby={coordinatesId}
                                    className={cn(
                                        "w-full cursor-grab touch-none " +
                                        "border-0 border-b border-border " +
                                        "bg-surface-subtle px-3 py-2 " +
                                        "text-left text-sm font-medium " +
                                        "text-foreground " +
                                        "focus-visible:outline-2 " +
                                        "focus-visible:outline-offset-[-2px] " +
                                        "focus-visible:outline-accent " +
                                        "active:cursor-grabbing",
                                    )}
                                    onClick={(event) => {
                                        if (event.detail === 0) {
                                            selectNode(node);
                                        }
                                    }}
                                    onKeyDown={(event) =>
                                        moveWithKeyboard(event, node)}
                                    onPointerDown={(event) =>
                                        beginDrag(event, node)}
                                    onPointerMove={dragTo}
                                    onPointerUp={endDrag}
                                    onPointerCancel={() => {
                                        drag.current = null;
                                        setPreview(null);
                                    }}>
                                    {node.title}
                                </button>
                                <p className={"m-0 line-clamp-2 px-3 py-2 " +
                                    "text-xs text-muted"}>
                                    {node.description ?? node.id}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <p id={coordinatesId}
                className="m-0 border-t border-border px-3 py-2 text-xs text-muted">
                노드를 선택합니다. 편집 가능하면 방향키로 10px,
                Shift+방향키로 1px 이동하거나 아래 좌표를 입력합니다.
            </p>
            {selected && (
                <div className="grid gap-3 border-t border-border p-3">
                    <strong className="text-sm">{selected.title}</strong>
                    {onNodesChange && (
                        <div className="flex flex-wrap items-end gap-2">
                            <label className="grid gap-1 text-xs">
                                X 좌표
                                <input type="number" min={0}
                                    max={width - nodeWidth} step={1}
                                    value={draft.x}
                                    onChange={(event) => setDraft({
                                        ...draft, x: event.target.value,
                                    })}
                                    className={"w-24 rounded-sm border " +
                                        "border-border bg-surface px-2 py-1 " +
                                        "text-foreground"} />
                            </label>
                            <label className="grid gap-1 text-xs">
                                Y 좌표
                                <input type="number" min={0}
                                    max={height - nodeHeight} step={1}
                                    value={draft.y}
                                    onChange={(event) => setDraft({
                                        ...draft, y: event.target.value,
                                    })}
                                    className={"w-24 rounded-sm border " +
                                        "border-border bg-surface px-2 py-1 " +
                                        "text-foreground"} />
                            </label>
                            <Button type="button" variant="outline"
                                onClick={applyCoordinates}>
                                좌표 적용
                            </Button>
                        </div>
                    )}
                    {onConnect && destinations.length > 0 && (
                        <div className="flex flex-wrap items-end gap-2">
                            <label className="grid gap-1 text-xs">
                                연결 대상
                                <select value={destination?.id}
                                    onChange={(event) =>
                                        setTargetId(event.target.value)}
                                    className={"min-w-40 rounded-sm border " +
                                        "border-border bg-surface px-2 py-1 " +
                                        "text-foreground"}>
                                    {destinations.map((node) => (
                                        <option key={node.id} value={node.id}>
                                            {node.title}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <Button type="button" variant="outline"
                                disabled={connectionExists}
                                onClick={() => {
                                    if (!destination || connectionExists) {
                                        return;
                                    }
                                    onConnect(selected.id, destination.id);
                                    setAnnouncement(
                                        `${selected.title}에서 ` +
                                        `${destination.title}로 연결을 요청했습니다.`,
                                    );
                                }}>
                                {connectionExists ? "이미 연결됨" : "연결 추가"}
                            </Button>
                        </div>
                    )}
                </div>
            )}
            {edges.length > 0 && (
                <div className="border-t border-border px-3 py-2">
                    <h4 className="m-0 text-xs font-semibold">연결 목록</h4>
                    <ul className="mt-2 grid gap-1">
                        {edges.map((edge) => {
                            const from = nodeById.get(edge.from)!;
                            const to = nodeById.get(edge.to)!;
                            return (
                                <li key={edge.id}
                                    className={"flex items-center " +
                                        "justify-between gap-2 text-xs"}>
                                    <span>
                                        {from.title} → {to.title}
                                        {edge.label && ` · ${edge.label}`}
                                    </span>
                                    {onDisconnect && (
                                        <Button type="button"
                                            variant="ghost"
                                            onClick={() =>
                                                onDisconnect(edge.id)}>
                                            {from.title} → {to.title} 연결 제거
                                        </Button>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
            <p role="status" aria-live="polite"
                className="sr-only">{announcement}</p>
        </section>
    );
}

export { NodeCanvas };
export type {
    NodeCanvasNode, NodeCanvasEdge, NodeCanvasMove, NodeCanvasProps,
};
