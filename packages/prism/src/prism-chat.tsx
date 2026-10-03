import { useId, type ReactNode } from "react";
import { PrismIcon } from "./prism-icon";
import { PrismButton } from "./prism-button";

export type PrismChatInputProps = { value: string; onValueChange: (value: string) => void; onSubmit: (value: string) => void;
    onStop?: () => void; busy?: boolean; disabled?: boolean; maxLength?: number; placeholder?: string; attachments?: ReactNode; onAttach?: () => void };
export function PrismChatInput({ value, onValueChange, onSubmit, onStop, busy = false, disabled = false, maxLength = 2000,
    placeholder = "궁금한 내용을 입력해 주세요.", attachments, onAttach }: PrismChatInputProps) {
    const id = useId(); const invalid = value.length > maxLength;
    const send = () => { if (!busy && !disabled && !invalid && value.trim()) onSubmit(value.trim()); };
    return <form className="prism-chat-input" aria-label="대화 입력" onSubmit={e => { e.preventDefault(); send(); }}>
        {attachments && <div className="prism-chat-attachments">{attachments}</div>}
        <label htmlFor={id} className="prism-sr-only">메시지</label>
        <textarea id={id} value={value} onChange={e => onValueChange(e.target.value)} disabled={disabled || busy}
            placeholder={placeholder} rows={2} aria-invalid={invalid || undefined} aria-describedby={`${id}-count`}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); send(); } }} />
        <div className="prism-chat-actions">{onAttach && <PrismButton variant="shape" iconOnly aria-label="파일 첨부" icon={<PrismIcon name="PlusIcon" size={20}/>} disabled={disabled || busy} onClick={onAttach}/>}<span id={`${id}-count`} className={invalid ? "prism-error" : ""}>{value.length} / {maxLength}</span>
            {busy ? <PrismButton iconOnly aria-label="생성 중단" disabled={!onStop} icon={<PrismIcon name="StopCircleIcon" size={28} />} onClick={onStop} />
                : <PrismButton type="submit" iconOnly aria-label="메시지 전송" icon={<PrismIcon name="SendIcon" size={28} />} disabled={disabled || invalid || !value.trim()} />}</div>
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
