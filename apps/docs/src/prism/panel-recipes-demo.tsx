import { useRef, useState } from "react";
import { PrismChatPanel, PrismProfilePanel, PrismMemoPanel, PrismPositionPanel, PrismMemoLeaveDialog,
    PrismProfile, PrismProfileMemoCollection, PrismProfileMemoComposer, PrismPositionDetail, PrismMessage, PrismChatInput,
    type PrismPanelLeaveContext, type PrismProfileTab } from "@pydemia/prism";
import type { FixtureState } from "./catalog";

export function PanelRecipesDemo({ state }: { state: FixtureState }) {
    type Kind = "profile" | "memo" | "position" | "chat";
    const [kind, setKind] = useState<Kind>(state === "memo" || state === "chat" || state === "position" ? state
        : state === "loading" || state === "error" ? "position" : "profile");
    const [open, setOpen] = useState(state !== "closed"), [expanded, setExpanded] = useState(state === "expanded");
    const [draft, setDraft] = useState(""), [question, setQuestion] = useState(""), [tab, setTab] = useState<PrismProfileTab>("total");
    const [confirm, setConfirm] = useState(false), [editing, setEditing] = useState<string | null>(null), [retried, setRetried] = useState(false);
    const [atBottom, setAtBottom] = useState(state !== "long");
    const decision = useRef<((allowed: boolean) => void) | null>(null), content = useRef<HTMLDivElement>(null);
    const [memos, setMemos] = useState([{ id: "synthetic-memo", content: "합성 메모 예시입니다. 실제 사용자 정보는 포함하지 않습니다.", createdAt: "2026-10-12T00:00:00Z", isMine: true }]);
    const beforeLeave = (_intent: "back" | "close", { signal }: PrismPanelLeaveContext) => {
        if (!draft.trim() && !editing) return true;
        return new Promise<boolean>(resolve => {
            let finished = false;
            const finish = (allowed: boolean) => {
                if (finished) return;
                finished = true;
                signal.removeEventListener("abort", abort);
                decision.current = null;
                setConfirm(false);
                if (allowed) { setDraft(""); setEditing(null); }
                resolve(allowed);
            };
            const abort = () => finish(false);
            if (signal.aborted) { finish(false); return; }
            signal.addEventListener("abort", abort, { once: true });
            decision.current = finish;
            setConfirm(true);
        });
    };
    const shared = { open, onOpenChange: setOpen, resizable: true };
    const text = state === "long" ? "좁은 패널에서 긴 합성 근거를 확인하고 마지막 항목까지 이동하는 예시입니다.\n".repeat(18) : "합성 후보의 전문성과 성공경험을 표시합니다.";
    const memo = <PrismProfileMemoCollection items={memos} editingId={editing} onEditingChange={setEditing} height="100%"
        onSave={(id, value) => setMemos(items => items.map(item => item.id === id ? { ...item, content: value } : item))}
        onDelete={id => setMemos(items => items.filter(item => item.id !== id))}
        composer={<PrismProfileMemoComposer value={draft} onValueChange={setDraft} onSubmit={value => {
            setMemos(items => [...items, { id: `synthetic-${Date.now()}`, content: value, createdAt: "2026-10-12T00:00:00Z", isMine: true }]); setDraft("");
        }}/>} />;
    const profile = (showMemo: () => void) => <PrismProfile candidate={{ id: "synthetic-candidate", name: "김가상", company: "가상전자", position: "기술전략담당" }}
        activeTab={tab} onTabChange={setTab} sections={{ total: <p style={{ whiteSpace: "pre-line", overflowWrap: "anywhere" }}>{text}</p> }} onComments={showMemo} commentCount={memos.length}/>;
    return <div className="prism-demo-stack"><label>패널 종류 <select aria-label="패널 종류" value={kind} onChange={event => {
        decision.current?.(false); setKind(event.target.value as Kind); setExpanded(false); setOpen(true);
    }}><option value="profile">프로필 정보</option><option value="memo">프로필 메모</option><option value="position">포지션 정보</option><option value="chat">AI 채팅</option></select></label>
        <div style={{ position: "relative", display: "flex", height: state === "long" ? 320 : 520, width: "100%", minWidth: 0 }}>
            <main style={{ flex: 1, minWidth: 0, overflow: "hidden" }}><button type="button" onClick={() => setOpen(true)}>패널 열기</button></main>
            {kind === "profile" && <PrismProfilePanel {...shared} subjectId="synthetic-candidate" profile={profile} memo={memo} beforeLeave={beforeLeave} expanded={expanded} onExpandedChange={setExpanded}/>}
            {kind === "memo" && <PrismMemoPanel {...shared} subjectId="synthetic-candidate" beforeLeave={beforeLeave} expanded={expanded} onExpandedChange={setExpanded}>{memo}</PrismMemoPanel>}
            {kind === "position" && <PrismPositionPanel {...shared}><PrismPositionDetail company="가상전자" role="기술전략담당"
                items={[{ label: "산업", value: "전자" }, { label: "직무", value: "연구개발" }, { label: "직책", value: "담당" }]}
                definition="가상 조직의 기술전략을 수립합니다." businessContext={text}
                groups={[{ id: "expertise", title: "전문성", items: [{ id: "expertise-1", content: "기술·연구개발 경험" }] }, { id: "experience", title: "성공경험", items: [] }]}
                status={!retried && (state === "loading" || state === "error") ? state : "ready"} onRetry={() => setRetried(true)}/></PrismPositionPanel>}
            {kind === "chat" && <PrismChatPanel {...shared} contentRef={content} atBottom={atBottom} onScrollToBottom={() => {
                content.current?.scrollTo({ top: content.current.scrollHeight, behavior: "smooth" }); setAtBottom(true);
            }} messages={<><PrismMessage role="user">가상 후보의 전문성을 설명해 주세요.</PrismMessage><PrismMessage role="assistant">{text}</PrismMessage></>}
                composer={<PrismChatInput value={question} onValueChange={setQuestion} onSubmit={() => setQuestion("")}/>}/>}
        </div>
        <PrismMemoLeaveDialog open={confirm} onOpenChange={value => { if (!value) decision.current?.(false); }} onConfirm={() => decision.current?.(true)}/>
    </div>;
}
