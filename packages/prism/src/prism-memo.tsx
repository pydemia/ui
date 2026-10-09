import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { PrismButton } from "./prism-button";
import { PrismConfirmDialog } from "./prism-dialog";
import { PrismIcon } from "./prism-icon";
import { PrismEmptyState, PrismRequestState } from "./prism-feedback";

export type PrismProfileMemoItem = {
    id: string;
    content: string;
    createdAt?: string;
    updatedAt?: string;
    /** Supplied from authenticated service data; this flag is not an authorization mechanism. */
    isMine: boolean;
};
export type PrismMemoMutationContext = { signal: AbortSignal };
export type PrismMemoDateFormatter = (value: string) => string;

function memoDate(value: string): { label: string; dateTime?: string } {
    const calendar = /^(\d{4})[-.](\d{2})[-.](\d{2})$/.exec(value);
    if (calendar) {
        const [, year, month, day] = calendar;
        const date = new Date(Number(year), Number(month) - 1, Number(day));
        if (date.getFullYear() === Number(year) && date.getMonth() === Number(month) - 1 && date.getDate() === Number(day)) return { label: `${year}.${month}.${day}`, dateTime: `${year}-${month}-${day}` };
        return { label: value };
    }
    const date = new Date(value);
    return Number.isFinite(date.getTime()) ? { label: `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`, dateTime: date.toISOString() } : { label: value };
}
const displayDate = (value: string) => memoDate(value).label;

function useMemoMutation(resetKey: string, onError?: (error: unknown) => void) {
    const [busy, setBusy] = useState(false), [error, setError] = useState<string>();
    const request = useRef<AbortController | null>(null), mounted = useRef(false), errorHandler = useRef(onError);
    errorHandler.current = onError;
    useEffect(() => {
        mounted.current = true;
        setBusy(false); setError(undefined);
        return () => { mounted.current = false; request.current?.abort(); request.current = null; };
    }, [resetKey]);
    const run = async (operation: (context: PrismMemoMutationContext) => void | Promise<void>, message: string, onSuccess?: () => void) => {
        if (request.current) return;
        const controller = new AbortController(); request.current = controller;
        setBusy(true); setError(undefined);
        try {
            await operation({ signal: controller.signal });
            if (mounted.current && !controller.signal.aborted) onSuccess?.();
        } catch (error) {
            if (mounted.current && !controller.signal.aborted) { setError(message); errorHandler.current?.(error); }
        } finally {
            if (request.current === controller) {
                request.current = null;
                if (mounted.current) setBusy(false);
            }
        }
    };
    return { busy, error, run, clearError: () => setError(undefined) };
}

export type PrismProfileMemoCardProps = {
    memo: PrismProfileMemoItem;
    editing: boolean;
    onEditStart: () => void;
    onEditCancel: () => void;
    onSave?: (content: string, context: PrismMemoMutationContext) => void | Promise<void>;
    onDelete?: (context: PrismMemoMutationContext) => void | Promise<void>;
    onMutationError?: (error: unknown) => void;
    disabled?: boolean;
    busy?: boolean;
    readOnly?: boolean;
    dateFormatter?: PrismMemoDateFormatter;
};

export function PrismProfileMemoCard({ memo, editing, onEditStart, onEditCancel, onSave, onDelete, onMutationError, disabled = false, busy = false, readOnly = false, dateFormatter = displayDate }: PrismProfileMemoCardProps) {
    const contentId = useId(), editorId = useId();
    const [draft, setDraft] = useState(memo.content), [confirmDelete, setConfirmDelete] = useState(false);
    const allowed = memo.isMine === true && !readOnly, inEditor = editing && allowed && !!onSave;
    const mutation = useMemoMutation(`${memo.id}:${inEditor}`, onMutationError);
    const callbacks = useRef({ onEditCancel }); callbacks.current = { onEditCancel };
    useEffect(() => { if (inEditor) setDraft(memo.content); }, [memo.id, inEditor]);
    useEffect(() => { setConfirmDelete(false); }, [memo.id]);
    const locked = disabled || busy || mutation.busy;
    const edited = !!memo.createdAt && !!memo.updatedAt && memo.updatedAt !== memo.createdAt;
    const date = edited ? memo.updatedAt : memo.createdAt;
    const machineDate = date ? memoDate(date).dateTime : undefined;
    const save = () => {
        if (locked || !inEditor || !onSave) return;
        const content = draft;
        void mutation.run(context => onSave(content, context), "메모를 저장하지 못했습니다. 다시 시도해 주세요.", () => callbacks.current.onEditCancel());
    };
    const remove = () => {
        if (locked || !allowed || !onDelete) return;
        void mutation.run(onDelete, "메모를 삭제하지 못했습니다. 다시 시도해 주세요.", () => setConfirmDelete(false));
    };
    return <article className="prism-profile-memo" aria-labelledby={inEditor ? editorId : contentId} aria-busy={busy || mutation.busy || undefined}>
        {inEditor ? <><label id={editorId} htmlFor={`${editorId}-input`} className="prism-sr-only">메모 수정</label>
            <textarea id={`${editorId}-input`} className="prism-textarea prism-profile-memo-editor" rows={3} value={draft} disabled={locked}
                onChange={event => setDraft(event.target.value)} /></> : <div id={contentId} className="prism-profile-memo-content">{memo.content}</div>}
        <footer className="prism-profile-memo-footer">
            {date && <span className="prism-profile-memo-date">{machineDate ? <time dateTime={machineDate}>{dateFormatter(date)}</time> : <span>{dateFormatter(date)}</span>}{edited && <><span className="prism-profile-memo-dot" aria-hidden="true"/>수정됨</>}</span>}
            {allowed && <div className="prism-profile-memo-actions">
                {inEditor ? <><PrismButton variant="line" size="small" disabled={locked} onClick={onEditCancel}>취소</PrismButton>
                    <PrismButton size="small" disabled={locked} onClick={save}>{mutation.busy ? "등록 중" : "등록"}</PrismButton></> : <>
                    {onSave && <PrismButton variant="shape" size="x-small" iconOnly className="prism-profile-memo-icon-action" aria-label="메모 수정" disabled={locked}
                        icon={<PrismIcon name="EditIcon" size={20}/>} onClick={() => { setDraft(memo.content); mutation.clearError(); onEditStart(); }} />}
                    {onDelete && <PrismButton variant="shape" size="x-small" iconOnly className="prism-profile-memo-icon-action" aria-label="메모 삭제" disabled={locked}
                        icon={<PrismIcon name="TrashIcon" size={20}/>} onClick={() => { mutation.clearError(); setConfirmDelete(true); }} />}
                </>}
            </div>}
        </footer>
        {!confirmDelete && mutation.error && <p className="prism-error" role="alert">{mutation.error}</p>}
        <PrismConfirmDialog open={confirmDelete && allowed} onOpenChange={open => { if (!locked) setConfirmDelete(open); }} title="메모 삭제" type="error" confirmTone="danger"
            content={"선택한 메모를 삭제합니다.\n삭제한 내역은 되돌릴 수 없습니다."} contentMinHeight={123} confirmLabel="삭제" busy={busy || mutation.busy} error={mutation.error} onConfirm={remove}/>
    </article>;
}

export type PrismProfileMemoComposerProps = {
    value: string;
    onValueChange: (value: string) => void;
    onSubmit: (content: string, context: PrismMemoMutationContext) => void | Promise<void>;
    onMutationError?: (error: unknown) => void;
    busy?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    placeholder?: string;
};
export function PrismProfileMemoComposer({ value, onValueChange, onSubmit, onMutationError, busy = false, disabled = false, readOnly = false, placeholder = "메모를 입력해 주세요." }: PrismProfileMemoComposerProps) {
    const inputId = useId(), mutation = useMemoMutation("composer", onMutationError);
    const locked = busy || disabled || readOnly || mutation.busy;
    const submit = () => {
        if (locked || !value.trim()) return;
        const content = value;
        void mutation.run(context => onSubmit(content, context), "메모를 등록하지 못했습니다. 다시 시도해 주세요.");
    };
    return <form className="prism-profile-memo-composer" aria-label="메모 작성" aria-busy={busy || mutation.busy || undefined} onSubmit={event => { event.preventDefault(); submit(); }}>
        <label className="prism-sr-only" htmlFor={inputId}>메모</label>
        <textarea id={inputId} value={value} disabled={busy || disabled || mutation.busy} readOnly={readOnly} placeholder={placeholder} onChange={event => onValueChange(event.target.value)}
            onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); submit(); } }}/>
        <div className="prism-profile-memo-submit"><PrismButton type="submit" disabled={locked || !value.trim()}>{busy || mutation.busy ? "등록 중" : "등록"}</PrismButton></div>
        {mutation.error && <p className="prism-error" role="alert">{mutation.error}</p>}
    </form>;
}

function MemoSkeleton() {
    return <div className="prism-profile-memo-skeleton" role="status" aria-label="메모를 불러오고 있습니다.">{[0, 1, 2].map(index => <div key={index} aria-hidden="true">
        <header><span className="prism-profile-memo-skeleton-avatar"/><div><span style={{ width: "20%" }}/><span style={{ width: "30%" }}/></div></header>
        <div><span/><span style={{ width: "85%" }}/></div>
    </div>)}</div>;
}
export type PrismProfileMemoCollectionProps = {
    /** Load only the authenticated user's permitted memo records at the service boundary. */
    items: readonly PrismProfileMemoItem[];
    editingId: string | null;
    onEditingChange: (id: string | null) => void;
    onSave?: (id: string, content: string, context: PrismMemoMutationContext) => void | Promise<void>;
    onDelete?: (id: string, context: PrismMemoMutationContext) => void | Promise<void>;
    onMutationError?: (error: unknown) => void;
    composer?: ReactNode;
    status?: "ready" | "loading" | "error";
    onRetry?: () => void;
    readOnly?: boolean;
    height?: CSSProperties["height"];
    className?: string;
    style?: CSSProperties;
    dateFormatter?: PrismMemoDateFormatter;
};
export function PrismProfileMemoCollection({ items, editingId, onEditingChange, onSave, onDelete, onMutationError, composer, status = "ready", onRetry, readOnly, height, className = "", style, dateFormatter }: PrismProfileMemoCollectionProps) {
    const visible = items.filter(item => item.isMine === true);
    const container = useRef<HTMLElement>(null), specifiedHeight = style?.height ?? height;
    const bounded = specifiedHeight !== undefined && specifiedHeight !== "auto";
    useLayoutEffect(() => {
        const root = container.current;
        if (!root) return;
        if (!bounded) { root.style.removeProperty("--prism-memo-editor-max-height"); return; }
        const composeArea = root.querySelector<HTMLElement>(".prism-profile-memo-compose-area");
        if (!composeArea) return;
        const measure = () => {
            const input = composeArea.querySelector<HTMLTextAreaElement>(".prism-profile-memo-composer>textarea");
            if (!input) return;
            const total = root.querySelector<HTMLElement>(".prism-profile-memo-total")!.getBoundingClientRect().height;
            const fixed = composeArea.getBoundingClientRect().height - input.getBoundingClientRect().height;
            // Preserve room for the list; a taller caller container permits a larger editor.
            const maximum = Math.max(60, Math.min(200, root.getBoundingClientRect().height - total - fixed - 24));
            root.style.setProperty("--prism-memo-editor-max-height", `${maximum}px`);
        };
        measure();
        const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(measure);
        observer?.observe(root); observer?.observe(composeArea);
        window.addEventListener("resize", measure);
        return () => { observer?.disconnect(); window.removeEventListener("resize", measure); };
    }, [bounded, specifiedHeight, !!composer]);
    if (new Set(items.map(item => item.id)).size !== items.length) throw new Error("Memo IDs must be unique.");
    const activeExists = visible.some(item => item.id === editingId), change = useRef(onEditingChange); change.current = onEditingChange;
    useEffect(() => { if (status === "ready" && editingId !== null && !activeExists) change.current(null); }, [status, editingId, activeExists]);
    return <section ref={container} className={`prism-profile-memo-collection ${className}`} style={{ height, ...style }} aria-label="프로필 메모" data-bounded={bounded || undefined}>
        <header className="prism-profile-memo-total">전체 <span>{visible.length}</span></header>
        <div className="prism-profile-memo-scroll" role="region" aria-label="메모 목록" tabIndex={0}>
            {status === "loading" ? <MemoSkeleton/> : status === "error" ? <PrismRequestState status="error" onRetry={onRetry}/> : !visible.length ? <div className="prism-profile-memo-empty"><PrismEmptyState panel icon={<PrismIcon name="NoMemoIcon" size={140}/>} title="등록된 프로필 메모가 없습니다." description="후보자에 대한 의견이나 참고사항을 기록해보세요."/></div> :
                visible.map(memo => <PrismProfileMemoCard key={memo.id} memo={memo} editing={editingId === memo.id} disabled={editingId !== null && editingId !== memo.id} readOnly={readOnly} dateFormatter={dateFormatter}
                    onEditStart={() => onEditingChange(memo.id)} onEditCancel={() => onEditingChange(null)} onSave={onSave ? (content, context) => onSave(memo.id, content, context) : undefined}
                    onDelete={onDelete ? context => onDelete(memo.id, context) : undefined} onMutationError={onMutationError}/>) }
        </div>
        {composer && <div className="prism-profile-memo-compose-area">{composer}</div>}
    </section>;
}
