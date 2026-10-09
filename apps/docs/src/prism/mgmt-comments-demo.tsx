import { useRef, useState } from "react";
import { PrismButton, PrismMgmtComments, PrismSummaryBadge, prismCeoCommentDraftFromItem,
    type PrismCeoCommentContext, type PrismCeoCommentItem, type PrismCeoCommentPayload } from "@pydemia/prism";
import type { FixtureState } from "./catalog";

export function MgmtCommentsDemo({ state }: { state: FixtureState }) {
    const initial: PrismCeoCommentItem[] = state === "empty" ? [] : [
        { id: "own", year: 2026, category: state === "long" ? "가상회의체".repeat(20) : "가상 인재 육성 회의", author: state === "long" ? "가상발화자".repeat(20) : "가상 CEO 김작성",
            comment: state === "long" ? "긴가상논평과육성과제를표시합니다".repeat(70) : "가상 프로젝트에서 협업 사례를 확인했습니다.\n다음 회의에서 육성 과제를 논의합니다.", isMine: true },
        { id: "other", year: null, category: null, author: null, comment: "다른 작성자의 코멘트입니다. 수정과 삭제는 표시하지 않습니다.", isMine: false },
    ];
    const store = useRef(new Map<string, PrismCeoCommentItem[]>([["candidate-a", initial], ["candidate-b", []]]));
    const [subject, setSubject] = useState("candidate-a"), [items, setItems] = useState(initial), [width, setWidth] = useState(800);
    const [pause, setPause] = useState(false), waiting = useRef(new Set<() => void>()), [pending, setPending] = useState(false), [automaticWait, setAutomaticWait] = useState(false);
    const [failure, setFailure] = useState("none"), [reloadFailure, setReloadFailure] = useState(false), [error, setError] = useState(state === "error");
    const [shown, setShown] = useState(true), [autoSize, setAutoSize] = useState(true), [bounded, setBounded] = useState(false), [lockFields, setLockFields] = useState(true);
    const [result, setResult] = useState(""), sequence = useRef(0);
    const prepare = async (kind: string, context: PrismCeoCommentContext) => {
        setResult(`${context.subjectId}: ${kind}`);
        if (pause) await new Promise<void>((resolve, reject) => {
            let timer: number | undefined;
            const finish = () => { window.clearTimeout(timer); context.signal.removeEventListener("abort", abort); waiting.current.delete(finish); setPending(waiting.current.size > 0); resolve(); };
            const abort = () => { window.clearTimeout(timer); waiting.current.delete(finish); setPending(waiting.current.size > 0); reject(new DOMException("Aborted", "AbortError")); };
            waiting.current.add(finish); context.signal.addEventListener("abort", abort, { once: true }); setPending(true);
            const automatic = kind === "delete" || kind === "reload"; setAutomaticWait(automatic);
            // A modal transaction must finish without an inaccessible background control.
            if (automatic) timer = window.setTimeout(finish, 5000);
            if (context.signal.aborted) abort();
        });
        context.signal.throwIfAborted();
        if (failure === kind || kind === "reload" && reloadFailure) throw new Error("Synthetic comment failure");
    };
    const record = (payload: PrismCeoCommentPayload, id: string): PrismCeoCommentItem => ({ id, ...payload, isMine: true });
    return <div className="prism-demo-stack">
        <div className="prism-demo-row"><label>코멘트 너비 <input type="number" aria-label="코멘트 너비" min={140} max={1280} value={width} onChange={event => setWidth(Math.max(140, Math.min(1280, Number(event.target.value) || 140)))}/></label>
            <label><input type="checkbox" checked={autoSize} onChange={event => setAutoSize(event.target.checked)}/> 입력창 자동 높이</label>
            <label><input type="checkbox" checked={bounded} onChange={event => setBounded(event.target.checked)}/> 입력창 높이 180px 제한</label></div>
        <div className="prism-demo-row"><label><input type="checkbox" checked={pause} onChange={event => setPause(event.target.checked)}/> 요청 대기</label>
            <label><input type="checkbox" checked={lockFields} onChange={event => setLockFields(event.target.checked)}/> 저장 중 입력 잠금</label>
            <label>요청 실패 <select aria-label="요청 실패" value={failure} onChange={event => setFailure(event.target.value)}><option value="none">없음</option><option value="detail">상세 조회</option><option value="save">저장</option><option value="delete">삭제</option></select></label>
            <label><input type="checkbox" checked={reloadFailure} onChange={event => setReloadFailure(event.target.checked)}/> 목록 갱신 실패</label>
            {pending && !automaticWait && <PrismButton onClick={() => waiting.current.forEach(resolve => resolve())}>요청 계속</PrismButton>}</div>
        <div className="prism-demo-row"><PrismButton variant="line" onClick={() => { const next = subject === "candidate-a" ? "candidate-b" : "candidate-a"; setSubject(next); setItems(store.current.get(next)!); }}>다른 가상 후보</PrismButton>
            <label><input type="checkbox" checked={shown} onChange={event => setShown(event.target.checked)}/> 코멘트 표시</label></div>
        <div style={{ width: "100%", maxWidth: width }}>
            <PrismSummaryBadge label="가상 유형" summary="요약 표시와 도움말의 크기 조절 예시입니다." note={"도움말은 소비자가 제공한 설명입니다.\n글꼴과 안쪽 여백을 조절할 수 있습니다."}
                tooltipClassName="prism-demo-mgmt-note" tooltipStyle={{ padding: 12, fontSize: 12, maxWidth: 280, whiteSpace: "pre-line" }}/>
            {shown && <PrismMgmtComments subjectId={subject} ceoComments={items} elpComments={state === "empty" ? [] : [{ id: "elp", year: 2025, category: "가상 ELP 선발 과정", author: "가상 평가위원", comment: "ELP 선발 및 육성 과정의 가상 기록입니다.\n호출자가 제공한 내용만 표시합니다." }]}
                status={error ? "error" : state === "loading" ? "loading" : "ready"} onRetry={() => setError(false)} readOnly={state === "readonly"}
                autoSize={autoSize} maxEditorHeight={bounded ? 180 : undefined} lockInputsWhileSubmitting={lockFields}
                loadDetail={async (id, context) => { await prepare("detail", context); const item = store.current.get(context.subjectId)!.find(item => item.id === id); if (!item) throw new Error("Missing synthetic record"); return prismCeoCommentDraftFromItem(item); }}
                onCreate={async (payload, context) => { await prepare("save", context); store.current.set(context.subjectId, [record(payload, `new-${++sequence.current}`), ...store.current.get(context.subjectId)!]); setResult(JSON.stringify(payload)); }}
                onUpdate={async (id, payload, context) => { await prepare("save", context); store.current.set(context.subjectId, store.current.get(context.subjectId)!.map(item => item.id === id ? record(payload, id) : item)); setResult(JSON.stringify(payload)); }}
                onDelete={async (id, context) => { await prepare("delete", context); store.current.set(context.subjectId, store.current.get(context.subjectId)!.filter(item => item.id !== id)); }}
                onReload={async context => { await prepare("reload", context); setItems([...store.current.get(context.subjectId)!]); }}/>}</div>
        <p role="status">{result}</p>
    </div>;
}
