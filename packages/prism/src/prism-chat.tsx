import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { PrismIcon } from "./prism-icon";
import { PrismButton } from "./prism-button";

export type PrismChatInputProps = { value: string; onValueChange: (value: string) => void; onSubmit: (value: string) => void;
    onStop?: () => void; busy?: boolean; disabled?: boolean; maxLength?: number; placeholder?: string; attachments?: ReactNode; onAttach?: () => void };
export function PrismChatInput({ value, onValueChange, onSubmit, onStop, busy = false, disabled = false, maxLength = 2000,
    placeholder = "찾으시려는 조건을 입력해 주세요.", attachments, onAttach }: PrismChatInputProps) {
    const id = useId(); const area = useRef<HTMLTextAreaElement>(null); const composing = useRef(false); const invalid = value.length > maxLength;
    useLayoutEffect(() => {
        const input = area.current; const field = input?.parentElement;
        if (!input || !field) return;
        const fit = () => {
            const lineHeight = Number.parseFloat(input.ownerDocument.defaultView?.getComputedStyle(input).lineHeight ?? "") || 20;
            input.style.height = "0px";
            const contentHeight = input.scrollHeight;
            input.style.height = `${Math.ceil(Math.min(Math.max(lineHeight, contentHeight), lineHeight * 5))}px`;
            input.style.overflowY = contentHeight > lineHeight * 5 ? "auto" : "hidden";
        };
        fit();
        if (typeof ResizeObserver === "undefined") { const view = input.ownerDocument.defaultView; view?.addEventListener("resize", fit); return () => view?.removeEventListener("resize", fit); }
        let width = field.clientWidth;
        const observer = new ResizeObserver(() => { if (field.clientWidth !== width) { width = field.clientWidth; fit(); } });
        observer.observe(field);
        return () => observer.disconnect();
    }, [value]);
    const send = () => { if (!busy && !disabled && !invalid && value.trim()) onSubmit(value.trim()); };
    return <form className="prism-chat-input" aria-label="대화 입력" onSubmit={e => { e.preventDefault(); send(); }}>
        <div className="prism-chat-input-field">
            {attachments && <div className="prism-chat-attachments">{attachments}</div>}
            <label htmlFor={id} className="prism-sr-only">메시지</label>
            <textarea ref={area} id={id} value={value} onChange={e => onValueChange(e.target.value.slice(0, maxLength))} disabled={disabled || busy}
                maxLength={maxLength} placeholder={busy ? "답변 생성 중입니다. 잠시만 기다려 주세요." : placeholder} rows={1}
                aria-invalid={invalid || undefined} aria-describedby={value.length ? `${id}-count` : undefined}
                onCompositionStart={() => { composing.current = true; }} onCompositionEnd={e => { composing.current = false; onValueChange(e.currentTarget.value.slice(0, maxLength)); }}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !composing.current && !e.nativeEvent.isComposing) { e.preventDefault(); send(); } }} />
            {busy && <span className="prism-chat-loading-spinner" aria-hidden="true"><PrismIcon name="GeneratingSpinnerIcon" size={20}/></span>}
        </div>
        <div className="prism-chat-actions">
            {onAttach && <PrismButton type="button" variant="shape" size="small" className="prism-chat-attach" iconOnly aria-label="파일 첨부" icon={<PrismIcon name="PlusIcon" size={20}/>} disabled={disabled || busy} onClick={onAttach}/>}
            <div className="prism-chat-actions-right">
                {value.length > 0 && <span id={`${id}-count`} className={invalid ? "prism-error" : ""}>{value.length}/{maxLength}자</span>}
                {busy ? <PrismButton type="button" size="small" className="prism-chat-stop" iconOnly aria-label="생성 중단" disabled={!onStop} icon={<span className="prism-chat-stop-icon" />} onClick={onStop} />
                    : <PrismButton type="button" size="small" className="prism-chat-send" iconOnly aria-label="메시지 전송" icon={<PrismIcon name="SendIcon" size={20} />} disabled={disabled || invalid || !value.trim()} onClick={send} />}
            </div>
        </div>
    </form>;
}
async function copyMessageText(text: string): Promise<void> {
    if (navigator.clipboard?.writeText && window.isSecureContext) { await navigator.clipboard.writeText(text); return; }
    const temporary = document.createElement("textarea");
    const previousFocus = document.activeElement;
    temporary.value = text;
    temporary.readOnly = true;
    temporary.style.position = "fixed";
    temporary.style.left = "-9999px";
    document.body.appendChild(temporary);
    try {
        temporary.select();
        if (!document.execCommand?.("copy")) throw new Error("Clipboard copy failed");
    } finally {
        temporary.remove();
        if (previousFocus instanceof HTMLElement) previousFocus.focus();
    }
}
export type PrismMessageProps = { role: "user" | "assistant"; children: ReactNode;
    status?: "generating" | "complete" | "error"; actions?: ReactNode;
    /** User-question text to copy. Plain string children are copied by default. */
    copyText?: string; onCopy?: (text: string) => void | Promise<void> };
export function PrismMessage({ role, children, status, actions, copyText, onCopy }: PrismMessageProps) {
    const [copiedText, setCopiedText] = useState<string | null>(null);
    const pendingCopy = useRef(false);
    const resetCopy = useRef<ReturnType<typeof setTimeout> | null>(null);
    const questionText = copyText ?? (typeof children === "string" ? children : undefined);
    const copied = questionText !== undefined && copiedText === questionText;
    useEffect(() => () => { if (resetCopy.current) clearTimeout(resetCopy.current); }, []);
    const copyQuestion = async () => {
        if (questionText === undefined || copied || pendingCopy.current) return;
        pendingCopy.current = true;
        try {
            await (onCopy ? onCopy(questionText) : copyMessageText(questionText));
            setCopiedText(questionText);
            if (resetCopy.current) clearTimeout(resetCopy.current);
            resetCopy.current = setTimeout(() => setCopiedText(null), 3000);
        } catch { /* A failed copy must not be reported as complete. */ }
        finally { pendingCopy.current = false; }
    };
    return <article className="prism-message" data-role={role} aria-label={role === "user" ? "사용자 메시지" : "PRISM 답변"}>
        <div className="prism-message-content">{children}</div>
        {role === "user" && questionText !== undefined && <div className="prism-message-actions">
            <button type="button" className="prism-message-copy" data-copied={copied || undefined} aria-label={copied ? "복사 완료" : "질문 복사"} title={copied ? "복사 완료" : "복사"} onClick={() => { void copyQuestion(); }}>
                <PrismIcon name={copied ? "CheckLineIcon" : "CopyIcon"} size={20}/>
            </button>
        </div>}
        {status && <p className="prism-answer-status" role={status === "error" ? "alert" : "status"}>
            {status === "generating" ? "답변 생성 중" : status === "error" ? "답변을 생성하지 못했습니다." : "답변 완료"}</p>}{actions}</article>;
}
function formatCriteriaText(text: string): ReactNode {
    const heading = text.match(/^#{1,6}\s+(.+)/);
    if (heading) return <strong>{heading[1]}</strong>;
    return text.split(/(\*{2,}[^*]+\*{2,})/g).map((part, index) => {
        const bold = part.match(/^\*{2,}([^*]+)\*{2,}$/);
        return bold ? <strong key={index}>{bold[1]}</strong> : part;
    });
}
export function PrismCriteria({ items, panelMode = false }: { items: readonly string[]; panelMode?: boolean }) {
    return <section className="prism-criteria" data-panel={panelMode || undefined} aria-label="판단 기준"><ol>{items.map((item, index) => <li key={index}>{formatCriteriaText(item)}</li>)}</ol></section>;
}
