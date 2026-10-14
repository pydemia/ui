import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { PrismPanel, type PrismPanelProps } from "./prism-panel";
import { PrismIcon } from "./prism-icon";
import { PrismConfirmDialog, type PrismConfirmDialogProps } from "./prism-dialog";

export type PrismPanelLeaveIntent = "back" | "close";
export type PrismPanelLeaveContext = { subjectId: string; signal: AbortSignal };
export type PrismPanelLeaveGuard = {
    /** The host checks its own unsaved draft and opens its own confirmation UI. */
    beforeLeave?: (intent: PrismPanelLeaveIntent, context: PrismPanelLeaveContext) => boolean | Promise<boolean>;
    onLeaveError?: (error: unknown) => void;
};
export type PrismPanelRecipeProps = Omit<PrismPanelProps, "title" | "children" | "onCloseRequest">;
export type PrismExpandablePanelRecipeProps = PrismPanelRecipeProps & { defaultExpanded?: boolean };
export type PrismMemoLeaveDialogProps = Pick<PrismConfirmDialogProps, "open" | "onOpenChange" | "onConfirm" | "onCancel" | "busy" | "error">;
export function PrismMemoLeaveDialog(props: PrismMemoLeaveDialogProps) {
    return <PrismConfirmDialog {...props} type="error" title="메모 작성 중" content={<>작성 중인 메모가 있습니다.<br/>지금 나가면 작성한 내용은 저장되지 않습니다.</>}
        cancelLabel="계속 작성" confirmLabel="나가기" confirmTone="danger" contentMinHeight={123}/>;
}

function useExpansion({ expanded, defaultExpanded = false, onExpandedChange }: PrismExpandablePanelRecipeProps) {
    const [internal, setInternal] = useState(defaultExpanded);
    return [expanded ?? internal, (next: boolean) => {
        if (expanded === undefined) setInternal(next);
        onExpandedChange?.(next);
    }] as const;
}

function useLeaveGuard(open: boolean, subjectId: string, { beforeLeave, onLeaveError }: PrismPanelLeaveGuard) {
    const current = useRef({ open, subjectId });
    current.current = { open, subjectId };
    const request = useRef<AbortController | null>(null);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    useLayoutEffect(() => {
        request.current?.abort();
        request.current = null;
        setPending(false);
        setError(null);
        return () => { request.current?.abort(); request.current = null; };
    }, [open, subjectId]);
    const leave = (intent: PrismPanelLeaveIntent, commit: () => void) => {
        if (!open || request.current) return;
        const controller = new AbortController();
        request.current = controller;
        setError(null);
        setPending(true);
        const active = () => request.current === controller && !controller.signal.aborted
            && current.current.open && current.current.subjectId === subjectId;
        void (async () => {
            try {
                const allowed = beforeLeave ? await beforeLeave(intent, { subjectId, signal: controller.signal }) : true;
                if (active() && allowed === true) commit();
            } catch (cause) {
                if (active()) {
                    setError("메모 이탈 여부를 확인하지 못했습니다. 다시 시도해 주세요.");
                    onLeaveError?.(cause);
                }
            } finally {
                if (request.current === controller) { request.current = null; setPending(false); }
            }
        })();
    };
    return { leave, pending, error };
}

function LeaveStatus({ pending, error }: { pending: boolean; error: string | null }) {
    return <>{pending && <span className="prism-sr-only" role="status">메모 이탈 여부를 확인하고 있습니다.</span>}
        {error && <p className="prism-error prism-panel-leave-error" role="alert">{error}</p>}</>;
}

export type PrismProfilePanelProps = PrismExpandablePanelRecipeProps & PrismPanelLeaveGuard & {
    subjectId: string;
    profile: (showMemo: () => void) => ReactNode;
    memo: ReactNode;
};
/** Memo stays mounted when hidden; a different subject gets a fresh content boundary. */
export function PrismProfilePanel({ subjectId, profile, memo, beforeLeave, onLeaveError, defaultExpanded,
    expanded, onExpandedChange, className = "", contentClassName = "", ...props }: PrismProfilePanelProps) {
    const [view, setView] = useState({ subjectId, memo: false });
    const showMemo = props.open && view.subjectId === subjectId && view.memo;
    useLayoutEffect(() => {
        setView(previous => !props.open || previous.subjectId !== subjectId ? { subjectId, memo: false } : previous);
    }, [props.open, subjectId]);
    const [isExpanded, changeExpansion] = useExpansion({ ...props, expanded, defaultExpanded, onExpandedChange });
    const guard = useLeaveGuard(props.open, subjectId, { beforeLeave, onLeaveError });
    const back = () => guard.leave("back", () => setView({ subjectId, memo: false }));
    const close = () => {
        const commit = () => { setView({ subjectId, memo: false }); props.onOpenChange(false); };
        if (showMemo) guard.leave("close", commit); else commit();
    };
    return <PrismPanel {...props} title={<h4 className="prism-panel-recipe-title">{showMemo
        ? <><button type="button" className="prism-panel-icon-button" aria-label="뒤로" disabled={guard.pending} onClick={back}><PrismIcon name="BackIcon" size={24}/></button>프로필 메모</>
        : "프로필 정보"}</h4>} className={`prism-profile-panel ${className}`} contentClassName={`prism-profile-panel-content ${contentClassName}`}
        expanded={isExpanded} onExpandedChange={changeExpansion} onCloseRequest={close}>
        <LeaveStatus pending={guard.pending} error={guard.error}/>
        <div key={subjectId} className="prism-profile-panel-views" aria-busy={guard.pending || undefined}>
            <div className="prism-profile-panel-memo" hidden={!showMemo}>{memo}</div>
            {!showMemo && <div className="prism-profile-panel-profile">{profile(() => setView({ subjectId, memo: true }))}</div>}
        </div>
    </PrismPanel>;
}

export type PrismMemoPanelProps = PrismExpandablePanelRecipeProps & PrismPanelLeaveGuard & {
    subjectId: string; children: ReactNode;
};
export function PrismMemoPanel({ subjectId, children, beforeLeave, onLeaveError, defaultExpanded, expanded,
    onExpandedChange, className = "", contentClassName = "", ...props }: PrismMemoPanelProps) {
    const [isExpanded, changeExpansion] = useExpansion({ ...props, expanded, defaultExpanded, onExpandedChange });
    const guard = useLeaveGuard(props.open, subjectId, { beforeLeave, onLeaveError });
    return <PrismPanel {...props} title={<h4>프로필 메모</h4>} className={`prism-memo-panel ${className}`}
        contentClassName={`prism-memo-panel-content ${contentClassName}`} expanded={isExpanded} onExpandedChange={changeExpansion}
        onCloseRequest={() => guard.leave("close", () => props.onOpenChange(false))}>
        <LeaveStatus pending={guard.pending} error={guard.error}/>
        <div key={subjectId} className="prism-memo-panel-body" aria-busy={guard.pending || undefined}>{children}</div>
    </PrismPanel>;
}

export type PrismPositionPanelProps = Omit<PrismPanelRecipeProps, "expanded" | "onExpandedChange"> & { children: ReactNode };
export function PrismPositionPanel({ children, className = "", ...props }: PrismPositionPanelProps) {
    return <PrismPanel {...props} className={`prism-position-panel ${className}`} title={<h4>포지션 정보</h4>}>{children}</PrismPanel>;
}

export type PrismChatPanelProps = Omit<PrismPanelRecipeProps, "expanded" | "onExpandedChange"> & {
    messages: ReactNode; composer: ReactNode;
    atBottom?: boolean; onScrollToBottom?: () => void;
};
/** The host owns chat/stream state. Like the source, closed chat content is unmounted. */
export function PrismChatPanel({ messages, composer, atBottom = true, onScrollToBottom,
    className = "", contentClassName = "", ...props }: PrismChatPanelProps) {
    return <PrismPanel {...props} className={`prism-chat-panel ${className}`} contentClassName={`prism-chat-panel-content ${contentClassName}`}
        title={<h4 className="prism-panel-recipe-title"><PrismIcon name="SymbolBgIcon" size={22}/>AI 채팅</h4>}>
        {props.open && <><div className="prism-chat-panel-messages">{messages}</div><div className="prism-chat-panel-composer">
            {!atBottom && onScrollToBottom && <div className="prism-chat-panel-scroll-bottom"><button type="button" aria-label="대화 아래로 이동" onClick={onScrollToBottom}><PrismIcon name="DownArrowIcon" size={16}/></button></div>}
            {composer}
        </div></>}
    </PrismPanel>;
}
