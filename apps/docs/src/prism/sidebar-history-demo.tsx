import { useLayoutEffect, useRef, useState } from "react";
import { PrismSidebar, PrismConfirmDialog, PrismIcon, createPrismAdminMenu, getPrismHistoryDeletionAction } from "@pydemia/prism";

type Mode = "default" | "loading" | "empty" | "restricted";
const records = [{ id: "current", title: "현재 합성 대화" }, { id: "other", title: "다른 합성 대화" }];
type Context = { routeConversationId: string | null; activeConversationId: string | null; view: string };

/** Host-owned synthetic deletion and route state; no service or browser history is changed. */
export function SidebarHistoryExample({ initialMode = "default" }: { initialMode?: Mode }) {
    const [collapsed, setCollapsed] = useState(false), [history, setHistory] = useState(records);
    const [context, setContext] = useState<Context>({ routeConversationId: "current", activeConversationId: "current", view: "current" });
    const latest = useRef(context), pending = useRef<AbortController | null>(null), mounted = useRef(false);
    const [session, setSession] = useState(0), [deleting, setDeleting] = useState<string | null>(null), [busy, setBusy] = useState(false);
    const [failNext, setFailNext] = useState(false), [error, setError] = useState<string | undefined>(), [result, setResult] = useState("");
    useLayoutEffect(() => { latest.current = context; }, [context]);
    useLayoutEffect(() => { mounted.current = true; return () => { mounted.current = false; pending.current?.abort(); }; }, []);
    const intro = () => setContext({ routeConversationId: null, activeConversationId: null, view: "intro" });
    const remove = async () => {
        if (!deleting || pending.current) return;
        const id = deleting, controller = new AbortController(), failure = failNext;
        pending.current = controller; setBusy(true); setError(undefined);
        try {
            await new Promise(resolve => setTimeout(resolve, 40));
            if (controller.signal.aborted || !mounted.current) return;
            if (failure) { setFailNext(false); throw new Error("Synthetic deletion failure"); }
            setHistory(items => items.filter(item => item.id !== id));
            const action = getPrismHistoryDeletionAction(id, latest.current);
            if (action === "navigate-intro") intro();
            else if (action === "reset-intro-session") { intro(); setSession(value => value + 1); }
            setDeleting(null); setResult(`합성 기록 ${id} 삭제 · ${action}`);
        } catch {
            if (mounted.current && !controller.signal.aborted) setError("합성 삭제에 실패했습니다. 기록은 유지됩니다.");
        } finally {
            if (mounted.current && pending.current === controller) { pending.current = null; setBusy(false); }
        }
    };
    return <div data-prism="light" className="prism-sidebar-demo">
        <PrismSidebar collapsed={collapsed} onCollapsedChange={setCollapsed} activeId={context.view}
            onNavigate={id => setContext(history.some(item => item.id === id) ? { routeConversationId: id, activeConversationId: id, view: id } : { routeConversationId: null, activeConversationId: null, view: id })}
            onNewChat={() => { intro(); setSession(value => value + 1); }}
            items={[{ id: "favorites", label: "후보자 즐겨찾기", icon: <PrismIcon name="FavoriteLargeIcon" size={24}/> }, ...(initialMode === "restricted" ? [] : [createPrismAdminMenu(true)!])]}
            history={initialMode === "empty" ? [] : history.map(item => ({ ...item, generating: initialMode === "loading" }))}
            onHistoryRename={(id, title) => setHistory(items => items.map(item => item.id === id ? { ...item, title } : item))}
            onHistoryDeleteRequest={id => { setError(undefined); setDeleting(id); }}
            user={{ name: "demo-user", description: "demo@example.com", team: "가상 전략팀" }}
            profileActions={[{ id: "notice", label: "공지사항" }, { id: "logout", label: "로그아웃", tone: "muted" }]}
            onProfileAction={id => setResult(`${id} 의도 전달`)} onPrivacyPolicy={() => setResult("방침 열기 의도 전달")} copyright="© 가상기업"/>
        <div className="prism-sidebar-demo-main">
            <p>합성 기록만 삭제합니다. 경로와 세션 키는 이 예제 안의 표시 값입니다.</p>
            <label>현재 대화 위치 <select aria-label="현재 대화 위치" value={context.view === "intro" ? "intro" : context.view === "other" ? "other" : context.routeConversationId ? "linked" : "root"}
                onChange={event => { const value = event.target.value; if (value === "intro") intro(); else setContext({ routeConversationId: value === "root" ? null : value === "other" ? "other" : "current", activeConversationId: value === "other" ? "other" : "current", view: value === "other" ? "other" : "current" }); }}>
                <option value="linked">URL에 ID가 있는 현재 대화</option><option value="root">기본 경로의 현재 대화</option><option value="other">다른 대화 조회 중</option><option value="intro">초기 화면</option>
            </select></label>
            <label><input type="checkbox" checked={failNext} disabled={busy} onChange={event => setFailNext(event.target.checked)}/> 다음 합성 삭제 실패</label>
            <p role="status">선택한 화면: {context.view} · 세션 키: {session}</p><p role="status">{result}</p>
        </div>
        <PrismConfirmDialog open={deleting !== null} onOpenChange={open => { if (!open && !pending.current) setDeleting(null); }}
            title="가상 대화를 삭제하시겠습니까?" content="삭제 성공 후 현재 경로와 대화 ID를 확인합니다." type="error" confirmTone="danger" confirmLabel="삭제"
            busy={busy} error={error} onConfirm={() => { void remove(); }}/>
    </div>;
}
