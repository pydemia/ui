import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { PrismButton } from "./prism-button";
import { PrismInput, PrismTextarea } from "./prism-field";
import { PrismIcon } from "./prism-icon";
import { PrismConfirmDialog } from "./prism-dialog";
import { PrismNoData } from "./prism-assessment";
import { PrismRequestState, PrismToast } from "./prism-feedback";
import { PrismSkeletonGroup } from "./prism-primitives";

export type PrismCeoCommentDraft = { year: string; meeting: string; speaker: string; content: string };
export type PrismCeoCommentPayload = { year: number; category: string; author: string; comment: string };
export type PrismMgmtCommentItem = { id: string; year: number | null; category: string | null; author: string | null; comment: string };
export type PrismCeoCommentItem = PrismMgmtCommentItem & { isMine: boolean };
export type PrismCeoCommentContext = { subjectId: string; signal: AbortSignal };
export const emptyPrismCeoCommentDraft: Readonly<PrismCeoCommentDraft> = Object.freeze({ year: "", meeting: "", speaker: "", content: "" });
export function isPrismCeoCommentDraftValid(value: PrismCeoCommentDraft) {
    const year = value.year.trim(), meeting = value.meeting.trim(), speaker = value.speaker.trim(), content = value.content.trim();
    return /^\d+$/.test(year) && Number.isInteger(Number(year)) && meeting.length >= 1 && meeting.length <= 100 && speaker.length >= 1 && speaker.length <= 100 && content.length >= 1 && content.length <= 2000;
}
export function createPrismCeoCommentPayload(value: PrismCeoCommentDraft): PrismCeoCommentPayload {
    if (!isPrismCeoCommentDraftValid(value)) throw new RangeError("CEO comment fields do not satisfy the source input rules.");
    return Object.freeze({ year: Number(value.year.trim()), category: value.meeting.trim(), author: value.speaker.trim(), comment: value.content.trim() });
}
export function prismCeoCommentDraftFromItem(item: PrismMgmtCommentItem): PrismCeoCommentDraft {
    return { year: item.year === null ? "" : String(item.year), meeting: item.category ?? "", speaker: item.author ?? "", content: item.comment };
}
function useCommentAutoSize(value: string, enabled: boolean, maxHeight?: number) {
    const textarea = useRef<HTMLTextAreaElement>(null);
    useLayoutEffect(() => {
        if (!enabled) return;
        const field = textarea.current; if (!field) return;
        const resize = () => {
            const minimum = parseFloat(getComputedStyle(field).minHeight) || 112.625;
            field.style.height = "0px";
            const desired = Math.max(minimum, field.scrollHeight + 2);
            field.style.height = `${maxHeight === undefined ? desired : Math.min(Math.max(minimum, maxHeight), desired)}px`;
        };
        resize(); let width = field.parentElement?.getBoundingClientRect().width;
        const observer = new ResizeObserver(() => { const next = field.parentElement?.getBoundingClientRect().width; if (next !== width) { width = next; resize(); } });
        if (field.parentElement) observer.observe(field.parentElement);
        let active = true; document.fonts?.ready.then(() => { if (active) resize(); }); document.fonts?.addEventListener("loadingdone", resize);
        return () => { active = false; observer.disconnect(); document.fonts?.removeEventListener("loadingdone", resize); };
    }, [value, enabled, maxHeight]);
    return textarea;
}
export type PrismCeoCommentFormProps = { title?: string; submitLabel?: string; value: PrismCeoCommentDraft; onValueChange: (value: PrismCeoCommentDraft) => void;
    onSubmit: (payload: PrismCeoCommentPayload) => void; submitting?: boolean; disabled?: boolean; readOnly?: boolean; error?: string;
    autoSize?: boolean; maxEditorHeight?: number; submitOnEnter?: boolean };
export function PrismCeoCommentForm({ title = "CEO Comment 추가", submitLabel = "등록", value, onValueChange, onSubmit, submitting = false, disabled = false,
    readOnly = false, error, autoSize = true, maxEditorHeight, submitOnEnter = false }: PrismCeoCommentFormProps) {
    if (maxEditorHeight !== undefined && (!Number.isFinite(maxEditorHeight) || maxEditorHeight <= 0)) throw new RangeError("Comment editor maximum height must be positive.");
    const textarea = useCommentAutoSize(value.content, autoSize, maxEditorHeight), locked = disabled || readOnly;
    const change = (key: keyof PrismCeoCommentDraft, next: string) => { if (!locked) onValueChange({ ...value, [key]: next }); };
    return <form className="prism-ceo-form" onKeyDown={event => { if (event.key === "Enter" && event.target instanceof HTMLInputElement && (!submitOnEnter || event.nativeEvent.isComposing)) event.preventDefault(); }}
        onSubmit={event => { event.preventDefault(); if (!locked && !submitting && isPrismCeoCommentDraftValid(value)) onSubmit(createPrismCeoCommentPayload(value)); }}>
        <p className="prism-ceo-form-title">{title}</p><div className="prism-ceo-form-grid">
            <div className="prism-ceo-field"><span className="prism-ceo-label" aria-hidden="true">연도</span><PrismInput label="연도" size="small" inputMode="numeric" value={value.year} placeholder="연도 입력" disabled={disabled} readOnly={readOnly}
                onChange={event => change("year", event.target.value.replace(/\D/g, "").slice(0, 4))}/></div>
            <div className="prism-ceo-field"><span className="prism-ceo-label" aria-hidden="true">회의체</span><PrismInput label="회의체" size="small" value={value.meeting} maxLength={100} placeholder="회의체 이름 입력" disabled={disabled} readOnly={readOnly}
                onChange={event => change("meeting", event.target.value)}/></div>
            <div className="prism-ceo-field" data-wide><span className="prism-ceo-label" aria-hidden="true">발화자</span><PrismInput label="발화자" size="small" value={value.speaker} maxLength={100} placeholder="직책, 이름 입력 (예: CEO 홍길동)" disabled={disabled} readOnly={readOnly}
                onChange={event => change("speaker", event.target.value)}/></div>
            <div className="prism-ceo-field" data-wide data-top><span className="prism-ceo-label" aria-hidden="true">논평</span><PrismTextarea ref={textarea} label="논평" rows={5} value={value.content} maxLength={2000} placeholder="Comment 내용을 입력해 주세요" disabled={disabled} readOnly={readOnly}
                data-auto-size={autoSize || undefined} style={maxEditorHeight === undefined ? undefined : { maxHeight: maxEditorHeight }} className="prism-ceo-textarea" onChange={event => change("content", event.target.value)}/></div>
        </div>{error && <p className="prism-error" role="alert">{error}</p>}<div className="prism-ceo-form-footer"><PrismButton type="submit" size="small" disabled={locked || submitting || !isPrismCeoCommentDraftValid(value)}>{submitLabel}</PrismButton></div>
    </form>;
}
function metadataText(value: string | null) { return value?.trim() || null; }
export function PrismMgmtCommentCard({ item, actions }: { item: PrismMgmtCommentItem; actions?: ReactNode }) {
    const title = metadataText(item.category), author = metadataText(item.author), header = item.year !== null || !!title;
    return <article className="prism-mgmt-card">{header && <header>{item.year !== null && <span className="prism-mgmt-year">{item.year}년</span>}{title && <h4>{title}</h4>}</header>}
        {author && <p className="prism-mgmt-author">{author}</p>}<p className="prism-mgmt-text">{item.comment}</p>{actions}
    </article>;
}
export type PrismMgmtCommentsProps = { subjectId?: string; ceoComments: readonly PrismCeoCommentItem[]; elpComments: readonly PrismMgmtCommentItem[];
    status?: "ready" | "loading" | "error"; onRetry?: () => void; readOnly?: boolean;
    loadDetail?: (id: string, context: PrismCeoCommentContext) => Promise<PrismCeoCommentDraft>;
    onCreate?: (payload: PrismCeoCommentPayload, context: PrismCeoCommentContext) => Promise<void>;
    onUpdate?: (id: string, payload: PrismCeoCommentPayload, context: PrismCeoCommentContext) => Promise<void>;
    onDelete?: (id: string, context: PrismCeoCommentContext) => Promise<void>;
    onReload?: (context: PrismCeoCommentContext) => Promise<void>; getErrorMessage?: (error: unknown, fallback: string) => string;
    autoSize?: boolean; maxEditorHeight?: number; lockInputsWhileSubmitting?: boolean; className?: string; style?: CSSProperties };
type Editor = { mode: "add"; draft: PrismCeoCommentDraft } | { mode: "edit"; id: string; draft: PrismCeoCommentDraft };
type Operation = { subjectId: string; controller: AbortController; kind: "detail" | "save" | "delete" | "reload" };
type Feedback = { text: string; reload?: boolean };
export function PrismMgmtComments({ subjectId, ceoComments, elpComments, status = "ready", onRetry, readOnly = false, loadDetail, onCreate, onUpdate,
    onDelete, onReload, getErrorMessage, autoSize = true, maxEditorHeight, lockInputsWhileSubmitting = true, className = "", style }: PrismMgmtCommentsProps) {
    const [editor, setEditor] = useState<Editor | null>(null), [deleting, setDeleting] = useState<PrismCeoCommentItem | null>(null);
    const [operation, setOperation] = useState<Operation["kind"] | null>(null), [feedback, setFeedback] = useState<Feedback | null>(null), [deleteError, setDeleteError] = useState<string>();
    const current = useRef<Operation | null>(null), mounted = useRef(false), subject = useRef(subjectId);
    useLayoutEffect(() => { subject.current = subjectId; current.current?.controller.abort(); current.current = null; setEditor(null); setDeleting(null); setOperation(null); setFeedback(null); setDeleteError(undefined); }, [subjectId]);
    useEffect(() => { mounted.current = true; return () => { mounted.current = false; current.current?.controller.abort(); current.current = null; }; }, []);
    useEffect(() => { if (status === "ready" && !operation && editor?.mode === "edit" && !ceoComments.some(item => item.id === editor.id && item.isMine)) setEditor(null); }, [ceoComments, editor, operation, status]);
    useEffect(() => { if (status === "ready" && !operation && deleting && !ceoComments.some(item => item.id === deleting.id && item.isMine)) setDeleting(null); }, [ceoComments, deleting, operation, status]);
    const active = (job: Operation) => mounted.current && current.current === job && subject.current === job.subjectId && !job.controller.signal.aborted;
    const begin = (kind: Operation["kind"]) => {
        if (!subjectId || current.current) return null;
        const job: Operation = { subjectId, controller: new AbortController(), kind }; current.current = job; setOperation(kind); setFeedback(null); return job;
    };
    const finish = (job: Operation) => { if (active(job)) { current.current = null; setOperation(null); } };
    const context = (job: Operation): PrismCeoCommentContext => ({ subjectId: job.subjectId, signal: job.controller.signal });
    const errorText = (error: unknown, fallback: string) => getErrorMessage?.(error, fallback) || fallback;
    const reload = async (job: Operation) => {
        if (!onReload || !active(job)) return;
        try { await onReload(context(job)); } catch (error) { if (active(job)) setFeedback({ text: errorText(error, "목록을 다시 불러오지 못했습니다."), reload: true }); }
    };
    const retryReload = async () => { const job = begin("reload"); if (!job) return; try { await reload(job); } finally { finish(job); } };
    const startEdit = async (item: PrismCeoCommentItem) => {
        if (!item.isMine || readOnly || editor || !onUpdate || !subjectId || current.current) return;
        if (!loadDetail) { setEditor({ mode: "edit", id: item.id, draft: prismCeoCommentDraftFromItem(item) }); return; }
        const job = begin("detail"); if (!job) return;
        try { const draft = await loadDetail(item.id, context(job));
            if (["year", "meeting", "speaker", "content"].some(key => typeof draft[key as keyof PrismCeoCommentDraft] !== "string")) throw new Error("Invalid detail draft");
            if (active(job)) setEditor({ mode: "edit", id: item.id, draft: { ...draft } });
        } catch (error) { if (active(job)) setFeedback({ text: errorText(error, "코멘트를 불러오지 못했습니다.") }); } finally { finish(job); }
    };
    const save = async (payload: PrismCeoCommentPayload) => {
        if (!editor || readOnly || !isPrismCeoCommentDraftValid(editor.draft)) return;
        if (editor.mode === "edit" && !ceoComments.some(item => item.id === editor.id && item.isMine)) return;
        const snapshot = editor, callback = snapshot.mode === "add" ? onCreate : onUpdate;
        if (!callback) return; const job = begin("save"); if (!job) return;
        try {
            try { if (snapshot.mode === "add") await onCreate!(payload, context(job)); else await onUpdate!(snapshot.id, payload, context(job)); }
            catch (error) { if (active(job)) setFeedback({ text: errorText(error, snapshot.mode === "add" ? "코멘트를 등록하지 못했습니다." : "코멘트를 수정하지 못했습니다.") }); return; }
            if (!active(job)) return; await reload(job); if (active(job)) setEditor(null);
        } finally { finish(job); }
    };
    const remove = async () => {
        if (!deleting?.isMine || readOnly || !onDelete || !ceoComments.some(item => item.id === deleting.id && item.isMine)) return; const snapshot = deleting, job = begin("delete"); if (!job) return; setDeleteError(undefined);
        try {
            try { await onDelete(snapshot.id, context(job)); } catch (error) { if (active(job)) setDeleteError(errorText(error, "코멘트를 삭제하지 못했습니다.")); return; }
            if (!active(job)) return; await reload(job); if (active(job)) setDeleting(null);
        } finally { finish(job); }
    };
    const locked = !!editor || !!deleting || !!operation || readOnly;
    const emptyCard = <article className="prism-mgmt-card"><div className="prism-mgmt-empty"><PrismNoData/></div></article>;
    if (status === "loading") return <PrismSkeletonGroup/>;
    if (status === "error") return <PrismRequestState status="error" onRetry={onRetry}/>;
    return <div className={`prism-mgmt-comments ${className}`} style={style}>
        {feedback && <PrismToast tone="error" title={feedback.text} onClose={() => setFeedback(null)}>{feedback.reload && onReload && <PrismButton variant="shape" size="small" disabled={!!operation} onClick={() => void retryReload()}>목록 다시 불러오기</PrismButton>}</PrismToast>}
        <section><header className="prism-mgmt-section-header"><h3>CEO Comments <span>{ceoComments.length}</span></h3>{(onCreate && !readOnly || editor) && <PrismButton variant="line" size="small" disabled={!subjectId || !!operation || !!deleting} onClick={() => setEditor(value => value ? null : { mode: "add", draft: { ...emptyPrismCeoCommentDraft } })}>{editor ? "취소" : "추가"}</PrismButton>}</header>
            <div className="prism-mgmt-card-list">{editor?.mode === "add" && <PrismCeoCommentForm value={editor.draft} onValueChange={draft => setEditor({ ...editor, draft })} onSubmit={payload => void save(payload)} submitting={operation === "save"}
                disabled={operation === "save" && lockInputsWhileSubmitting} readOnly={readOnly} autoSize={autoSize} maxEditorHeight={maxEditorHeight}/>}
                {!ceoComments.length && editor?.mode !== "add" && emptyCard}
                {ceoComments.map(item => <div key={item.id} className="prism-mgmt-record">{editor?.mode === "edit" && editor.id === item.id && <PrismCeoCommentForm title="CEO Comment 수정" submitLabel="수정" value={editor.draft}
                    onValueChange={draft => setEditor({ ...editor, draft })} onSubmit={payload => void save(payload)} submitting={operation === "save"} disabled={operation === "save" && lockInputsWhileSubmitting} readOnly={readOnly} autoSize={autoSize} maxEditorHeight={maxEditorHeight}/>}
                    <PrismMgmtCommentCard item={item} actions={item.isMine && !readOnly && (onUpdate || onDelete) ? <div className="prism-mgmt-actions">
                        {onUpdate && <button type="button" aria-label="코멘트 수정" disabled={locked || !subjectId} onClick={() => void startEdit(item)}><PrismIcon name="EditIcon" size={20}/></button>}
                        {onDelete && <button type="button" aria-label="코멘트 삭제" disabled={locked || !subjectId} onClick={() => { setDeleteError(undefined); setDeleting(item); }}><PrismIcon name="TrashIcon" size={20}/></button>}
                    </div> : undefined}/>
                </div>)}
            </div>
        </section><section><header className="prism-mgmt-section-header"><h3>ELP 선발 및 육성 과정 Comments</h3></header><div className="prism-mgmt-card-list">{elpComments.length ? elpComments.map(item => <PrismMgmtCommentCard key={item.id} item={item}/>) : emptyCard}</div></section>
        <PrismConfirmDialog open={!!deleting} onOpenChange={open => { if (!open && operation !== "delete") setDeleting(null); }} onConfirm={() => void remove()} title="코멘트 삭제" type="error" confirmLabel="삭제" confirmTone="danger" busy={operation === "delete"} error={deleteError}
            content={<>해당 코멘트를 삭제합니다.<br/>삭제한 내역은 되돌릴 수 없습니다.</>} contentMinHeight={123}/>
    </div>;
}
