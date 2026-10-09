import { useRef, useState } from "react";
import { PrismProfileMemoCollection, PrismProfileMemoComposer, PrismSelect, type PrismProfileMemoItem, type PrismMemoMutationContext } from "@pydemia/prism";
import type { FixtureState } from "./catalog";

export const syntheticMemos: PrismProfileMemoItem[] = [
    { id: "memo-one", content: "협업 사례와 후속 확인 사항을 기록한 가상 메모입니다.", createdAt: "2026-10-08", updatedAt: "2026-10-09", isMine: true },
    { id: "memo-two", content: "추가 면담에서 확인할 항목입니다. 실제 후보자의 정보가 아닙니다.", createdAt: "2026-10-09", isMine: true },
];
async function waitForMutation({ signal }: PrismMemoMutationContext) {
    await new Promise<void>((resolve, reject) => {
        const abort = () => { clearTimeout(timer); reject(signal.reason); };
        const timer = setTimeout(() => { signal.removeEventListener("abort", abort); resolve(); }, 500);
        if (signal.aborted) abort(); else signal.addEventListener("abort", abort, { once: true });
    });
}
export function MemoDemo({ state }: { state: FixtureState }) {
    const [items, setItems] = useState<PrismProfileMemoItem[]>(state === "empty" ? [] : state === "long" ? Array.from({ length: 16 }, (_, index) => ({ ...syntheticMemos[index % 2], id: `long-${index}`, content: `${index + 1}. ${"긴 메모와 여러 줄의 후속 확인 사항을 포함한 가상 예시입니다. ".repeat(5)}\n다음 줄의 확인 사항도 그대로 표시합니다.` })) : syntheticMemos);
    const [editingId, setEditingId] = useState<string | null>(null), [draft, setDraft] = useState("");
    const nextId = useRef(0);
    const [width, setWidth] = useState(440), [height, setHeight] = useState(520), [retried, setRetried] = useState(false);
    const [outcome, setOutcome] = useState(state === "error" ? "error" : "success"), [result, setResult] = useState("");
    const status = state === "loading" ? "loading" : state === "error" && !retried ? "error" : "ready";
    const readOnly = state === "readonly";
    const mutate = async (context: PrismMemoMutationContext) => { await waitForMutation(context); if (outcome === "error") throw new Error("Synthetic memo mutation failure"); };
    return <div className="prism-demo-stack">
        <div className="prism-sizing-controls"><label>메모 너비 <input type="number" aria-label="메모 너비" min={140} max={1000} value={width} onChange={event => setWidth(Math.max(140, Math.min(1000, Number(event.target.value) || 140)))}/></label>
            <label>메모 높이 <input type="number" aria-label="메모 높이" min={240} max={1000} value={height} onChange={event => setHeight(Math.max(240, Math.min(1000, Number(event.target.value) || 240)))}/></label></div>
        <PrismSelect label="처리 결과" value={outcome} onValueChange={setOutcome} options={[{ value: "success", label: "성공" }, { value: "error", label: "오류 재현" }]}/>
        <div style={{ width: "100%", maxWidth: width }}><PrismProfileMemoCollection items={items} editingId={editingId} onEditingChange={setEditingId} height={height} status={status} readOnly={readOnly} onRetry={() => setRetried(true)}
            onSave={async (id, content, context) => { await mutate(context); setItems(current => current.map(memo => memo.id === id ? { ...memo, content, updatedAt: "2026-10-09T17:30:00+09:00" } : memo)); setResult("수정 의도 처리 완료"); }}
            onDelete={async (id, context) => { await mutate(context); setItems(current => current.filter(memo => memo.id !== id)); setResult("삭제 의도 처리 완료"); }}
            composer={<PrismProfileMemoComposer value={draft} onValueChange={setDraft} busy={status === "loading"} readOnly={readOnly}
                onSubmit={async (content, context) => { await mutate(context); const id = `new-${++nextId.current}`; setItems(current => [...current, { id, content, createdAt: "2026-10-09", isMine: true }]); setDraft(current => current === content ? "" : current); setResult("등록 의도 처리 완료"); }}/>} /></div>
        <p role="status">{result}</p>
    </div>;
}
