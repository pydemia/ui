import { addEdge, applyEdgeChanges, applyNodeChanges,
    type Connection, type EdgeChange, type NodeChange } from "@xyflow/react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AlignHorizontalJustifyCenter, ArrowRight, Copy, Group, Plus,
    Redo2, RotateCcw, Scissors, Ungroup,
    Trash2, Undo2 } from "lucide-react";
import {
    Badge, Button, FlowCanvas, copyFlowSelection, cutFlowSelection,
    groupFlowSelection, layoutFlowGraph, pasteFlowSelection,
    resolveFlowShortcut,
    translateFlowControls, ungroupFlowSelection, useFlowHistory,
    type FlowClipboard, type FlowEdge, type FlowNode, type FlowNodeData,
} from "@pydemia/ui";
import "./flow-workspace.css";

const initialNodes: FlowNode[] = [
    { id: "request", type: "pyd-flow-node", position: { x: 60, y: 90 },
        data: { title: "요청 접수", description: "입력값과 요청 맥락 수집",
            kind: "trigger", status: "complete" } },
    { id: "review", type: "pyd-flow-node", selected: true,
        position: { x: 350, y: 90 },
        data: { title: "내용 검토", description: "담당자 확인 및 수정",
            kind: "action", status: "running" } },
    { id: "decision", type: "pyd-flow-node", position: { x: 640, y: 90 },
        data: { title: "승인 판단", description: "승인 또는 재검토 분기",
            kind: "condition", status: "idle" } },
    { id: "publish", type: "pyd-flow-node", position: { x: 940, y: 10 },
        data: { title: "공개", description: "승인된 결과 게시",
            kind: "result", status: "idle" } },
    { id: "revise", type: "pyd-flow-node", position: { x: 940, y: 210 },
        data: { title: "재검토", description: "수정 사항 반영",
            kind: "action", status: "idle" } },
];

const initialEdges: FlowEdge[] = [
    { id: "e-request-review", type: "pyd-flow-edge",
        source: "request", target: "review", label: "접수" },
    { id: "e-review-decision", type: "pyd-flow-edge",
        source: "review", target: "decision", label: "검토 완료",
        data: { controlPoint: { x: 605, y: 40 } } },
    { id: "e-decision-publish", type: "pyd-flow-edge",
        source: "decision", target: "publish", label: "승인" },
    { id: "e-decision-revise", type: "pyd-flow-edge",
        source: "decision", target: "revise", label: "수정 요청" },
];

const kindLabels: Record<NonNullable<FlowNodeData["kind"]>, string> = {
    trigger: "시작", action: "작업", condition: "조건", result: "결과",
};
const statusLabels: Record<NonNullable<FlowNodeData["status"]>, string> = {
    idle: "대기", running: "진행", complete: "완료", error: "오류",
};

const usage = `import { useEdgesState, useNodesState, addEdge } from "@xyflow/react";
import { FlowCanvas, type FlowNode, type FlowEdge } from "@pydemia/ui";
import "@pydemia/ui/styles.css";
import "@xyflow/react/dist/style.css";
import "@pydemia/ui/flow-canvas.css";

const initialNodes: FlowNode[] = [
  { id: "start", type: "pyd-flow-node", position: { x: 40, y: 80 },
    data: { title: "시작", kind: "trigger" } },
  { id: "done", type: "pyd-flow-node", position: { x: 340, y: 80 },
    data: { title: "완료", kind: "result" } },
];

function Example() {
  const [nodes, setNodes, onNodesChange] = useNodesState<FlowNode>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<FlowEdge>([]);
  return <FlowCanvas label="처리 흐름" nodes={nodes} edges={edges}
    onNodesChange={onNodesChange} onEdgesChange={onEdgesChange}
    onConnect={(connection) => setEdges((current) => addEdge({
      ...connection, type: "pyd-flow-edge",
    }, current))} />;
}`;

function FlowWorkspace() {
    const [compact, setCompact] = useState(() =>
        window.matchMedia("(max-width: 670px)").matches);
    const [history, dispatch] = useFlowHistory<FlowNode, FlowEdge>({
        nodes: initialNodes, edges: initialEdges,
    });
    const { nodes, edges } = history.present;
    const clipboard = useRef<FlowClipboard | null>(null);
    const dragging = useRef(false);
    const [pasteCount, setPasteCount] = useState(0);
    const [selectedId, setSelectedId] = useState("review");
    const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
    const [sourceId, setSourceId] = useState("review");
    const [targetId, setTargetId] = useState("publish");
    const [notice, setNotice] = useState("");
    const [counter, setCounter] = useState(1);
    const selected = nodes.find((node) => node.id === selectedId);
    const selectedEdge = edges.find((edge) => edge.id === selectedEdgeId);
    const connectableNodes = nodes.filter((node) =>
        node.type !== "pyd-flow-group");
    const source = connectableNodes.some((node) => node.id === sourceId)
        ? sourceId : connectableNodes[0]?.id ?? "";
    const target = connectableNodes.some((node) => node.id === targetId)
        ? targetId : connectableNodes.find((node) =>
            node.id !== source)?.id ?? "";

    useEffect(() => {
        const previous = document.title;
        document.title = "Flows — pydemia UI";
        return () => { document.title = previous; };
    }, []);

    useEffect(() => {
        const query = window.matchMedia("(max-width: 670px)");
        const update = () => setCompact(query.matches);
        query.addEventListener("change", update);
        return () => query.removeEventListener("change", update);
    }, []);

    useEffect(() => {
        if (selectedId && !nodes.some((node) => node.id === selectedId)) {
            setSelectedId("");
        }
        if (selectedEdgeId && !edges.some((edge) => edge.id === selectedEdgeId)) {
            setSelectedEdgeId(null);
        }
    }, [nodes, edges, selectedId, selectedEdgeId]);

    function selectNode(id: string, additive = false) {
        setSelectedId(id);
        setSelectedEdgeId(null);
        dispatch({ type: "transient", update: (current) => ({
            nodes: current.nodes.map((node) => ({
                ...node, selected: additive ?
                    (node.id === id ? !node.selected : node.selected) :
                    node.id === id,
            })),
            edges: current.edges.map((edge) => ({
                ...edge, selected: false,
            })),
        }) });
    }

    function selectEdge(id: string) {
        setSelectedEdgeId(id);
        setSelectedId("");
        dispatch({ type: "transient", update: (current) => ({
            nodes: current.nodes.map((node) => ({
                ...node, selected: false,
            })),
            edges: current.edges.map((edge) => ({
                ...edge, selected: edge.id === id,
            })),
        }) });
    }

    function updateNode(patch: Partial<FlowNodeData>, transient = false) {
        dispatch({ type: transient ? "transient" : "commit",
            update: (current) => ({ ...current,
                nodes: current.nodes.map((node) => node.id === selectedId
                    ? { ...node, data: { ...node.data, ...patch } } : node),
            }),
        });
    }

    function connect(connection: Connection) {
        if (!connection.source || !connection.target ||
            !connectableNodes.some((node) => node.id === connection.source) ||
            !connectableNodes.some((node) => node.id === connection.target) ||
            connection.source === connection.target ||
            edges.some((edge) => edge.source === connection.source &&
                edge.target === connection.target)) {
            setNotice("자기 연결과 중복 연결은 추가할 수 없습니다.");
            return;
        }
        dispatch({ type: "commit", update: (current) => ({
            ...current,
            edges: addEdge<FlowEdge>({
                ...connection, type: "pyd-flow-edge", label: "다음 단계",
            }, current.edges),
        }) });
        setNotice("연결을 추가했습니다.");
    }

    function addNode() {
        const id = `new-${counter}`;
        dispatch({ type: "commit", update: (current) => ({
            ...current,
            nodes: [...current.nodes, {
                id, type: "pyd-flow-node",
                position: { x: 80 + (counter % 3) * 60,
                    y: 330 + Math.floor((counter - 1) / 3) * 120 },
                data: { title: `새 단계 ${counter}`,
                    description: "설명을 입력하세요",
                    kind: "action", status: "idle" },
            }],
        }) });
        setCounter((current) => current + 1);
        selectNode(id);
        setNotice("새 노드를 추가했습니다.");
    }

    function deleteNode() {
        if (!selected) return;
        onNodesChange([{ type: "remove", id: selected.id }]);
        setSelectedId("");
        setNotice(`${selected.data.title} 노드와 연결을 제거했습니다.`);
    }

    function reset() {
        dispatch({ type: "reset", document: {
            nodes: initialNodes, edges: initialEdges,
        } });
        setSelectedId("review");
        setSelectedEdgeId(null);
        setCounter(1);
        setPasteCount(0);
        setNotice("예시를 초기 상태로 돌렸습니다.");
    }

    function onNodesChange(changes: NodeChange<FlowNode>[]) {
        const changesContent = changes.some((change) =>
            change.type === "remove" || change.type === "add" ||
            change.type === "replace" ||
            (change.type === "position" && !dragging.current));
        dispatch({ type: changesContent ? "commit" : "transient",
            update: (current) => {
                const next = applyNodeChanges(changes, current.nodes);
                const remaining = new Set(next.map((node) => node.id));
                const removed = new Set(current.nodes.filter((node) =>
                    !remaining.has(node.id)).map((node) => node.id));
                let changed = true;
                while (changed) {
                    changed = false;
                    for (const node of current.nodes) {
                        if (node.parentId && removed.has(node.parentId) &&
                            !removed.has(node.id)) {
                            removed.add(node.id);
                            changed = true;
                        }
                    }
                }
                const graph = translateFlowControls(current,
                    next.filter((node) => !removed.has(node.id)));
                return removed.size ? { ...graph,
                    edges: graph.edges.filter((edge) =>
                        !removed.has(edge.source) &&
                        !removed.has(edge.target)),
                } : graph;
            },
        });
    }

    function onEdgesChange(changes: EdgeChange<FlowEdge>[]) {
        const changesContent = changes.some((change) =>
            change.type !== "select");
        dispatch({ type: changesContent ? "commit" : "transient",
            update: (current) => ({ ...current,
                edges: applyEdgeChanges(changes, current.edges),
            }),
        });
    }

    function undo() {
        if (history.past.length === 0) return;
        dispatch({ type: "undo" });
        setSelectedId("");
        setSelectedEdgeId(null);
        setNotice("이전 편집 상태로 되돌렸습니다.");
    }

    function redo() {
        if (history.future.length === 0) return;
        dispatch({ type: "redo" });
        setSelectedId("");
        setSelectedEdgeId(null);
        setNotice("편집을 다시 적용했습니다.");
    }

    function copySelection() {
        const copied = copyFlowSelection(history.present);
        if (!copied) {
            setNotice("복사할 노드나 연결을 선택하세요.");
            return;
        }
        clipboard.current = copied;
        setPasteCount(0);
        setNotice(`${copied.nodes.length}개 노드와 ${copied.edges.length}개 연결을 복사했습니다.`);
    }

    function cutSelection() {
        const result = cutFlowSelection(history.present);
        if (!result.clipboard) {
            setNotice("잘라낼 노드나 연결을 선택하세요.");
            return;
        }
        clipboard.current = result.clipboard;
        dispatch({ type: "commit", update: () => result.graph });
        setSelectedId("");
        setSelectedEdgeId(null);
        setPasteCount(0);
        setNotice("선택한 항목을 잘라냈습니다.");
    }

    function pasteSelection() {
        if (!clipboard.current) return;
        const next = pasteFlowSelection(history.present,
            clipboard.current, { x: 32 * (pasteCount + 1),
                y: 32 * (pasteCount + 1) });
        dispatch({ type: "commit", update: () => next });
        setSelectedId(next.nodes.find((node) => node.selected)?.id ?? "");
        setSelectedEdgeId(null);
        setPasteCount((current) => current + 1);
        setNotice("복사한 흐름을 새 ID로 붙여넣었습니다.");
    }

    function groupSelection() {
        const id = `group-${counter}`;
        const next = groupFlowSelection(history.present, id);
        if (next === history.present) {
            setNotice("같은 부모에 속한 노드 두 개 이상을 선택하세요.");
            return;
        }
        dispatch({ type: "commit", update: () => next });
        setCounter((current) => current + 1);
        setSelectedId(id);
        setSelectedEdgeId(null);
        setNotice("선택한 노드를 그룹으로 묶었습니다.");
    }

    function ungroupSelection() {
        const next = ungroupFlowSelection(history.present);
        if (next === history.present) return;
        dispatch({ type: "commit", update: () => next });
        setSelectedId("");
        setNotice("선택한 그룹을 해제했습니다.");
    }

    function autoLayout() {
        dispatch({ type: "commit", update: layoutFlowGraph });
        setNotice("연결 순서에 따라 노드를 자동 배치했습니다.");
    }

    function updateEdgeControl(id: string, point: { x: number; y: number },
        transient = false) {
        dispatch({ type: transient ? "transient" : "commit",
            update: (current) => ({ ...current,
                edges: current.edges.map((edge) => edge.id === id ? {
                    ...edge, data: { ...edge.data, controlPoint: point },
                } : edge),
            }),
        });
    }

    function onEditorKeyDown(event: KeyboardEvent<HTMLElement>) {
        const command = resolveFlowShortcut({
            key: event.key, ctrlKey: event.ctrlKey, metaKey: event.metaKey,
            altKey: event.altKey, shiftKey: event.shiftKey,
            target: event.target as HTMLElement });
        if (!command) return;
        if ((command === "copy" || command === "cut") &&
            !copyFlowSelection(history.present)) return;
        if (command === "paste" && !clipboard.current) return;
        event.preventDefault();
        if (command === "undo") undo();
        else if (command === "redo") redo();
        else if (command === "copy") copySelection();
        else if (command === "cut") cutSelection();
        else pasteSelection();
    }

    return <main id="flow-main" className="flow-page">
        <div className="flow-page-heading">
            <div>
                <p className="section-index">NODE + EDGE UI</p>
                <h1>Flows</h1>
                <p>분기와 연결이 있는 작업을 조립하고 검토하는 화면입니다.
                    노드와 엣지를 직접 바꿔 보며 컴포넌트의 동작을 확인하세요.</p>
            </div>
            <a href="/?component=node-canvas#components" className="flow-legacy-link">
                기존 NodeCanvas 보기 <ArrowRight size={16} aria-hidden="true" />
            </a>
        </div>

        <section aria-labelledby="flow-example-heading" className="flow-example"
            onKeyDown={onEditorKeyDown}>
            <div className="flow-example-topline">
                <div>
                    <h2 id="flow-example-heading">요청 처리 흐름</h2>
                    <p>노드·연결을 편집하고 실행 취소, 그룹화, 자동 배치를 시험하세요.
                        Shift를 누르고 노드 목록을 선택하면 여러 노드를 묶을 수 있습니다.</p>
                </div>
                <div className="flow-example-actions">
                    <Button type="button" variant="outline" onClick={undo}
                        disabled={history.past.length === 0} aria-keyshortcuts="Control+Z Meta+Z">
                        <Undo2 size={15} aria-hidden="true" /> 실행 취소
                    </Button>
                    <Button type="button" variant="outline" onClick={redo}
                        disabled={history.future.length === 0}
                        aria-keyshortcuts="Control+Shift+Z Meta+Shift+Z">
                        <Redo2 size={15} aria-hidden="true" /> 다시 실행
                    </Button>
                    <Button type="button" variant="outline" onClick={copySelection}
                        aria-keyshortcuts="Control+C Meta+C">
                        <Copy size={15} aria-hidden="true" /> 복사
                    </Button>
                    <Button type="button" variant="outline" onClick={cutSelection}
                        aria-keyshortcuts="Control+X Meta+X">
                        <Scissors size={15} aria-hidden="true" /> 잘라내기
                    </Button>
                    <Button type="button" variant="outline" onClick={pasteSelection}
                        disabled={!clipboard.current}
                        aria-keyshortcuts="Control+V Meta+V">
                        붙여넣기
                    </Button>
                    <Button type="button" variant="outline" onClick={groupSelection}
                        disabled={nodes.filter((node) => node.selected).length < 2 ||
                            nodes.filter((node) => node.selected).some((node) =>
                                node.parentId !== nodes.find((item) =>
                                    item.selected)?.parentId)}>
                        <Group size={15} aria-hidden="true" /> 그룹화
                    </Button>
                    <Button type="button" variant="outline" onClick={ungroupSelection}
                        disabled={!nodes.some((node) => node.selected &&
                            node.type === "pyd-flow-group")}>
                        <Ungroup size={15} aria-hidden="true" /> 그룹 해제
                    </Button>
                    <Button type="button" variant="outline" onClick={autoLayout}>
                        <AlignHorizontalJustifyCenter size={15} aria-hidden="true" /> 자동 배치
                    </Button>
                    <Button type="button" variant="outline" onClick={reset}>
                        <RotateCcw size={15} aria-hidden="true" /> 초기화
                    </Button>
                    <Button type="button" onClick={addNode}>
                        <Plus size={16} aria-hidden="true" /> 노드 추가
                    </Button>
                </div>
            </div>
            <div className="flow-editor">
                <aside className="flow-node-list" aria-label="노드 목록">
                    <h3>노드 <span>{nodes.length}</span></h3>
                    <ul>{nodes.map((node) => <li key={node.id}>
                        <button type="button" onClick={(event) =>
                            selectNode(node.id, event.shiftKey)}
                            aria-current={node.id === selectedId ? "true" : undefined}>
                            <span>{node.parentId ? "↳ " : ""}{node.data.title}</span>
                            <small>{node.type === "pyd-flow-group" ? "그룹" :
                                kindLabels[node.data.kind ?? "action"]}</small>
                        </button>
                    </li>)}</ul>
                </aside>
                <div className="flow-stage">
                    <FlowCanvas key={compact ? "compact" : "wide"}
                        label="요청 처리 흐름" nodes={nodes} edges={edges}
                        height="100%" onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange} onConnect={connect}
                        onNodeDragStart={() => {
                            dragging.current = true;
                            dispatch({ type: "begin-gesture" });
                        }}
                        onNodeDragStop={() => {
                            dragging.current = false;
                            dispatch({ type: "end-gesture" });
                        }}
                        onNodeSnap={(id, position) => dispatch({
                            type: "transient", update: (current) =>
                                translateFlowControls(current,
                                    current.nodes.map((node) => node.id === id
                                    ? { ...node, position } : node),
                                ),
                        })}
                        onEdgeControlChange={(id, point, phase) => {
                            if (phase === "start") {
                                dispatch({ type: "begin-gesture" });
                            } else if (phase === "move") {
                                updateEdgeControl(id, point, true);
                            } else {
                                dispatch({ type: "end-gesture" });
                            }
                        }}
                        showMiniMap={!compact}
                        fitView={!compact}
                        defaultViewport={compact ? { x: 22, y: 24, zoom: 0.85 } : undefined}
                        onNodeClick={(id, event) =>
                            selectNode(id, event.shiftKey)} onEdgeClick={selectEdge}
                        onSelectionChange={({ nodes: selectedNodes, edges: selectedEdges }) => {
                            if (selectedNodes[0]) {
                                setSelectedId(selectedNodes[0].id);
                                setSelectedEdgeId(null);
                            } else if (selectedEdges[0]) {
                                setSelectedEdgeId(selectedEdges[0].id);
                                setSelectedId("");
                            } else {
                                setSelectedId("");
                                setSelectedEdgeId(null);
                            }
                        }} />
                </div>
                <aside className="flow-inspector" aria-label="선택 상세와 연결 편집">
                    {selected ? <div className="flow-inspector-section">
                        <div className="flow-inspector-heading">
                            <h3>노드 상세</h3><Badge>{selected.id}</Badge>
                        </div>
                        <label>이름<input value={selected.data.title}
                            onFocus={() => dispatch({ type: "begin-gesture" })}
                            onChange={(event) => updateNode({
                                title: event.target.value,
                            }, true)}
                            onBlur={() => dispatch({ type: "end-gesture" })}
                            maxLength={60} /></label>
                        <label>설명<textarea value={selected.data.description ?? ""}
                            onFocus={() => dispatch({ type: "begin-gesture" })}
                            onChange={(event) => updateNode({
                                description: event.target.value,
                            }, true)}
                            onBlur={() => dispatch({ type: "end-gesture" })}
                            rows={3} maxLength={180} /></label>
                        <div className="flow-fields">
                            {(["x", "y"] as const).map((axis) =>
                                <label key={axis}>위치 {axis.toUpperCase()}
                                    <input type="number" step="1"
                                        value={Math.round(selected.position[axis])}
                                        onFocus={() => dispatch({ type: "begin-gesture" })}
                                        onChange={(event) => {
                                            const value = Number(event.target.value);
                                            if (!Number.isFinite(value)) return;
                                            dispatch({ type: "transient", update: (current) =>
                                                translateFlowControls(current,
                                                    current.nodes.map((node) =>
                                                        node.id === selected.id ? {
                                                        ...node,
                                                        position: { ...node.position,
                                                            [axis]: value },
                                                        } : node),
                                                ) });
                                        }}
                                        onBlur={() => dispatch({ type: "end-gesture" })} />
                                </label>)}</div>
                        {selected.type !== "pyd-flow-group" && <div className="flow-fields">
                            <label>유형<select value={selected.data.kind ?? "action"}
                                onChange={(event) => updateNode({
                                    kind: event.target.value as FlowNodeData["kind"],
                                })}>
                                {Object.entries(kindLabels).map(([key, value]) =>
                                    <option key={key} value={key}>{value}</option>)}</select></label>
                            <label>상태<select value={selected.data.status ?? "idle"}
                                onChange={(event) => updateNode({
                                    status: event.target.value as FlowNodeData["status"],
                                })}>
                                {Object.entries(statusLabels).map(([key, value]) =>
                                    <option key={key} value={key}>{value}</option>)}</select></label>
                        </div>}
                        <Button variant="outline" type="button" onClick={deleteNode}>
                            <Trash2 size={14} aria-hidden="true" /> 노드 삭제
                        </Button>
                    </div> : selectedEdge ? <div className="flow-inspector-section">
                        <h3>연결 상세</h3>
                        <p>{nodes.find((node) => node.id === selectedEdge.source)?.data.title}
                            {" → "}{nodes.find((node) => node.id === selectedEdge.target)?.data.title}</p>
                        <label>레이블<input value={String(selectedEdge.label ?? "")}
                            onFocus={() => dispatch({ type: "begin-gesture" })}
                            onChange={(event) => {
                                const label = event.target.value;
                                dispatch({ type: "transient",
                                    update: (current) => ({ ...current,
                                        edges: current.edges.map((edge) =>
                                            edge.id === selectedEdge.id ? {
                                                ...edge, label,
                                            } : edge),
                                    }),
                                });
                            }}
                            onBlur={() => dispatch({ type: "end-gesture" })}
                            /></label>
                        {selectedEdge.data?.controlPoint ? <div className="flow-fields">
                            {(["x", "y"] as const).map((axis) =>
                                <label key={axis}>제어점 {axis.toUpperCase()}
                                    <input type="number" step="1"
                                        value={Math.round(selectedEdge.data!.controlPoint![axis])}
                                        onFocus={() => dispatch({ type: "begin-gesture" })}
                                        onChange={(event) => {
                                            const value = Number(event.target.value);
                                            if (!Number.isFinite(value)) return;
                                            updateEdgeControl(selectedEdge.id, {
                                                ...selectedEdge.data!.controlPoint!,
                                                [axis]: value,
                                            }, true);
                                        }}
                                        onBlur={() => dispatch({ type: "end-gesture" })} />
                                </label>)}</div> : null}
                        <Button variant="outline" type="button" onClick={() => {
                            if (selectedEdge.data?.controlPoint) {
                                dispatch({ type: "commit", update: (current) => ({
                                    ...current,
                                    edges: current.edges.map((edge) =>
                                        edge.id === selectedEdge.id ? {
                                            ...edge, data: {},
                                        } : edge),
                                }) });
                            } else {
                                const from = nodes.find((node) =>
                                    node.id === selectedEdge.source)!;
                                const to = nodes.find((node) =>
                                    node.id === selectedEdge.target)!;
                                updateEdgeControl(selectedEdge.id, {
                                    x: (from.position.x + to.position.x) / 2 + 112,
                                    y: (from.position.y + to.position.y) / 2 + 52,
                                });
                            }
                        }}>
                            {selectedEdge.data?.controlPoint ? "제어점 제거" : "제어점 추가"}
                        </Button>
                        <Button variant="outline" type="button" onClick={() => {
                            dispatch({ type: "commit", update: (current) => ({
                                ...current,
                                edges: current.edges.filter((edge) =>
                                    edge.id !== selectedEdge.id),
                            }) });
                            setSelectedEdgeId(null);
                            setNotice("연결을 제거했습니다.");
                        }}><Trash2 size={14} aria-hidden="true" /> 연결 삭제</Button>
                    </div> : <div className="flow-inspector-section">
                        <h3>선택 상세</h3>
                        <p>노드나 엣지를 선택하면 속성을 편집할 수 있습니다.</p>
                    </div>}

                    <div className="flow-inspector-section flow-connect-section">
                        <h3>연결 추가</h3>
                        <p>포트를 드래그하거나 아래 목록으로 두 노드를 연결합니다.</p>
                        <div className="flow-fields">
                            <label>시작<select value={source} onChange={(event) =>
                                setSourceId(event.target.value)}>
                                {connectableNodes.map((node) => <option key={node.id} value={node.id}>
                                    {node.data.title}</option>)}</select></label>
                            <label>도착<select value={target} onChange={(event) =>
                                setTargetId(event.target.value)}>
                                {connectableNodes.map((node) => <option key={node.id} value={node.id}>
                                    {node.data.title}</option>)}</select></label>
                        </div>
                        <Button type="button" variant="outline"
                            disabled={connectableNodes.length < 2}
                            onClick={() => connect({ source,
                                target,
                                sourceHandle: null, targetHandle: null })}>
                            연결하기
                        </Button>
                    </div>
                    <div className="flow-inspector-section flow-edge-list">
                        <h3>연결 <span>{edges.length}</span></h3>
                        <ul>{edges.map((edge) => <li key={edge.id}>
                            <button type="button" onClick={() => selectEdge(edge.id)}
                                aria-current={edge.id === selectedEdgeId ? "true" : undefined}>
                                {nodes.find((node) => node.id === edge.source)?.data.title}
                                {" → "}
                                {nodes.find((node) => node.id === edge.target)?.data.title}
                                {edge.label && <small> · {edge.label}</small>}
                            </button>
                        </li>)}</ul>
                    </div>
                </aside>
            </div>
            <p className="flow-notice" role="status" aria-live="polite">{notice ||
                "이 예시는 브라우저 메모리에서만 편집됩니다."}</p>
        </section>

        <section className="flow-reference" aria-labelledby="flow-components-heading">
            <div>
                <p className="section-index">COMPONENTS / API</p>
                <h2 id="flow-components-heading">재사용 가능한 구성</h2>
                <p>React Flow가 그래프의 이동·연결·탐색을 맡고,
                    pydemia 컴포넌트가 토큰과 노드·엣지 표현을 맡습니다.</p>
                <dl>
                    <div><dt>FlowCanvas</dt><dd>제어형 nodes·edges, 컨트롤과 미니맵</dd></div>
                    <div><dt>FlowNodeCard</dt><dd>유형·상태·입출력 포트가 있는 노드</dd></div>
                    <div><dt>FlowGroupCard</dt><dd>부모·자식 관계를 표시하는 그룹 노드</dd></div>
                    <div><dt>FlowEdgePath</dt><dd>레이블과 선택적 제어점이 있는 연결선</dd></div>
                    <div><dt>Flow History / Clipboard</dt><dd>편집 기록과 선택 집합 복사·붙여넣기</dd></div>
                    <div><dt>Flow Alignment / Grouping / Layout</dt><dd>정렬·그룹 관계·결정적 좌우 배치</dd></div>
                </dl>
                <p>설치: <code>npx shadcn@latest add {`${location.origin}/r/pyd-flow-canvas.json`}</code>
                    <br />registry 소비자는 <code>@xyflow/react/dist/style.css</code>,
                    설치된 <code>flow-canvas.css</code>, pydemia 토큰 CSS를 함께 불러옵니다.</p>
                <p>고급 편집 기능은 카탈로그의 Flow History, Clipboard, Grouping,
                    Layout 항목을 함께 설치합니다. 데모 상태는 브라우저 메모리에만 있으며,
                    실제 저장·실행·공동 편집은 사용하는 앱이 구현합니다.</p>
                <p>기존 <a href="/?component=node-canvas#components">NodeCanvas</a>는
                    의존성 없이 간단한 흐름을 편집할 때 사용할 수 있습니다.</p>
            </div>
            <div className="flow-code">
                <div className="panel-caption"><span>REACT / TSX</span><span>CONTROLLED STATE</span></div>
                <pre><code>{usage}</code></pre>
            </div>
        </section>
    </main>;
}

export { FlowWorkspace };
