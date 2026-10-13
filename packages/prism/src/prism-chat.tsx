import { useId, useLayoutEffect, useRef, type ReactNode } from "react";
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
export function PrismMessage({ role, children, status, actions }: { role: "user" | "assistant"; children: ReactNode;
    status?: "generating" | "complete" | "error"; actions?: ReactNode }) {
    return <article className="prism-message" data-role={role} aria-label={role === "user" ? "사용자 메시지" : "PRISM 답변"}>
        <div className="prism-message-content">{children}</div>
        {status && <p className="prism-answer-status" role={status === "error" ? "alert" : "status"}>
            {status === "generating" ? "답변 생성 중" : status === "error" ? "답변을 생성하지 못했습니다." : "답변 완료"}</p>}{actions}</article>;
}
export function PrismCriteria({ items }: { items: readonly string[] }) {
    return <section className="prism-criteria" aria-label="판단 기준"><ul>{items.map((item, index) => <li key={index}>{item}</li>)}</ul></section>;
}
