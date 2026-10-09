import { useId, type ReactNode, type CSSProperties } from "react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@pydemia/ui";
import { PrismChevronDownGlyph as ChevronDown, PrismXGlyph as X, PrismIcon } from "./prism-icon";
import { PrismButton } from "./prism-button";
import { PrismTextarea } from "./prism-field";
import { PrismTag } from "./prism-badge";
import { PrismCheckbox } from "./prism-selection";

export type PrismContextOption = { value: string; label: string; description?: string };
export type PrismContextField = { key: string; label: string; description?: string; required?: boolean } & (
    { type: "textarea"; minLength?: number; maxLength?: number; rows?: number; placeholder?: string } |
    { type: "options"; options: readonly PrismContextOption[]; maxSelections?: number });
export type PrismContextValues = Readonly<Record<string, string | readonly string[]>>;
export type PrismContextAction = { value: string; label: string };
export type PrismContextResponseOption = { value: string; label: string; description: string };
export type PrismContextResponse = { action: "submit"; values: Record<string, string | PrismContextResponseOption[]> } | { action: "cancel"; label: string };
export type PrismContextSectionProps = { number: number; title: string; description?: ReactNode; required?: boolean; maxSelections?: number;
    open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; reduceMotion?: boolean; children: ReactNode };

export function PrismContextSection({ number, title, description, required = false, maxSelections, open, defaultOpen = false, onOpenChange, reduceMotion = false, children }: PrismContextSectionProps) {
    const id = useId();
    return <Collapsible className="prism-context-section" data-reduce-motion={reduceMotion || undefined} open={open} defaultOpen={defaultOpen} onOpenChange={onOpenChange}>
        <h3><CollapsibleTrigger className="prism-context-section-header" aria-labelledby={id}>
            <span className="prism-context-heading"><span className="prism-context-number">{number}</span><span className="prism-context-heading-text">
                <strong id={id}>{title}<span className="prism-context-requirement" data-required={required}>{required ? "필수" : "선택"}</span></strong>
                {description && <span className="prism-context-description">{description}</span>}
            </span></span>
            {maxSelections !== undefined && <PrismTag className="prism-context-limit" variant="blue">최대 {maxSelections}개 선택</PrismTag>}
            <ChevronDown aria-hidden="true"/>
        </CollapsibleTrigger></h3>
        <CollapsibleContent className="prism-context-collapse"><div className="prism-context-section-body">{children}</div></CollapsibleContent>
    </Collapsible>;
}
export function PrismContextOptionCard({ option, checked, disabled, onCheckedChange }: { option: PrismContextOption; checked: boolean; disabled?: boolean; onCheckedChange: (checked: boolean) => void }) {
    const id = useId();
    return <div className="prism-context-option" data-checked={checked || undefined} data-disabled={disabled || undefined} onClick={event => {
        if (disabled || (event.target as Element).closest(".prism-choice")) return;
        onCheckedChange(!checked);
    }}>
        <PrismCheckbox label={option.label} checked={checked} disabled={disabled} aria-describedby={option.description ? id : undefined} onCheckedChange={value => onCheckedChange(value === true)}/>
        {option.description && <p id={id}>{option.description}</p>}
    </div>;
}

export const prismContextPlaceholder = "이 포지션이 우선적으로 해결해야 할 중점 현안 2~3가지에 대해, 해당 임원이 당면한 이 일을 어떤 방향으로 어떻게 진행해야 하며, 그 결과 회사나 조직이 어떻게 달라지기를 기대하는지 서술해주세요. 또한, 이 외에 해당 포지션의 후보자가 갖추어야 할 요구 사항이나 제약 조건이 있다면 추가로 서술해주세요.";
/** Projects declared fields only and returns selected options in service-defined order. */
export function createPrismContextResponse(fields: readonly PrismContextField[], values: PrismContextValues): Extract<PrismContextResponse, { action: "submit" }> {
    const result: Record<string, string | PrismContextResponseOption[]> = {};
    for (const field of fields) {
        const value = values[field.key];
        result[field.key] = field.type === "textarea" ? typeof value === "string" && value.trim() ? value : "" :
            field.options.filter(option => Array.isArray(value) && value.includes(option.value)).map(option => ({ value: option.value, label: option.label, description: option.description ?? "" }));
    }
    return { action: "submit", values: result };
}
type ContextCallbacks = { onSubmit: (values: PrismContextValues) => void; onAction?: never } | { onAction: (response: PrismContextResponse, label: string) => void; onSubmit?: never };
export type PrismContextFormProps = ContextCallbacks & { fields: readonly PrismContextField[]; values: PrismContextValues; onValueChange: (values: PrismContextValues) => void;
    onCancel?: () => void; actions?: readonly PrismContextAction[]; busy?: boolean; readOnly?: boolean; defaultOpenFields?: readonly string[]; reduceMotion?: boolean; error?: string };
function limits(field: Extract<PrismContextField, { type: "textarea" }>) {
    const minimum = field.minLength ?? 50, maximum = field.maxLength ?? 800, rows = field.rows ?? 11;
    if (!Number.isSafeInteger(minimum) || minimum < 0 || !Number.isSafeInteger(maximum) || maximum < minimum || maximum < 1 || !Number.isSafeInteger(rows) || rows < 1) throw new RangeError("Context text limits and rows must be valid positive ranges.");
    return { minimum, maximum, rows };
}
function ContextTextField({ field, value, onChange, busy, readOnly }: { field: Extract<PrismContextField, { type: "textarea" }>; value: string; onChange: (value: string) => void; busy: boolean; readOnly: boolean }) {
    const id = useId(), { minimum, maximum, rows } = limits(field), length = value.trim().length;
    const message = length > 0 && length < minimum ? `최소 ${minimum}글자를 입력해주세요.` : value.length >= maximum ? `${maximum}자 이내로 입력해 주세요.` : undefined;
    return <div className="prism-context-text">
        <PrismTextarea label={field.label} required={field.required} rows={rows} value={value} maxLength={maximum} placeholder={field.placeholder ?? prismContextPlaceholder} disabled={busy} readOnly={readOnly}
            className="prism-context-textarea" style={{ "--prism-context-rows": rows } as CSSProperties} aria-invalid={!!message} aria-describedby={`${id}-count${message ? ` ${id}-error` : ""}`} onChange={event => onChange(event.target.value)}/>
        <div className="prism-context-text-footer" data-error={!!message || undefined}>
            <span id={`${id}-count`} className="prism-context-char-count">{value.length} / {maximum}</span>
            {message && <span id={`${id}-error`} className="prism-context-text-error" role="alert"><PrismIcon name="ToastErrorIcon" size={12}/>{message}</span>}
        </div>
    </div>;
}
export function PrismContextForm({ fields, values, onValueChange, onSubmit, onAction, onCancel, actions: suppliedActions, busy = false, readOnly = false, defaultOpenFields = [], reduceMotion = false, error }: PrismContextFormProps) {
    for (const field of fields) if (field.type === "textarea") limits(field);
    const missing = fields.some(field => field.required && (field.type === "textarea" ? typeof values[field.key] !== "string" || (values[field.key] as string).trim().length < (field.minLength ?? 50) || !(values[field.key] as string).trim() : !Array.isArray(values[field.key]) || !values[field.key].length));
    const invalid = fields.some(field => { const value = values[field.key]; return field.type === "textarea" ? value !== undefined && (typeof value !== "string" || value.length > (field.maxLength ?? 800)) : value !== undefined && (!Array.isArray(value) || value.length > (field.maxSelections ?? field.options.length) || value.some(entry => !field.options.some(option => option.value === entry))); });
    const actions = suppliedActions ?? [...(onCancel || onAction ? [{ value: "cancel", label: "취소" }] : []), { value: "submit", label: "등록" }];
    const cancel = actions.find(action => action.value === "cancel");
    const invoke = (action: PrismContextAction) => {
        if (busy || action.value === "submit" && (readOnly || missing || invalid)) return;
        if (onAction) onAction(action.value === "submit" ? createPrismContextResponse(fields, values) : { action: "cancel", label: action.label }, action.label);
        else if (action.value === "submit") onSubmit?.(values); else onCancel?.();
    };
    return <form className="prism-context" onSubmit={event => {
        event.preventDefault();
        const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
        const index = submitter?.getAttribute("data-context-action-index");
        const submit = index !== null && index !== undefined ? actions[Number(index)] : actions.find(action => action.value === "submit");
        if (submit) invoke(submit);
    }}>
        <header><div><h2>맥락 정보 추가하기</h2><p>아래 항목 중 필요한 내용만 선택하여 입력해 주세요.</p></div>{cancel && <PrismButton iconOnly variant="shape" className="prism-context-close" aria-label="맥락 정보 닫기" icon={<X size={24}/>} disabled={busy} onClick={() => invoke(cancel)}/>}</header>
        <div className="prism-context-body">{fields.map((field, index) => <PrismContextSection key={field.key} number={index + 1} title={field.label} description={field.description} required={field.required} defaultOpen={defaultOpenFields.includes(field.key)} reduceMotion={reduceMotion} maxSelections={field.type === "options" ? field.maxSelections : undefined}>
            {field.type === "textarea" ? <ContextTextField field={field} value={typeof values[field.key] === "string" ? values[field.key] as string : ""} busy={busy} readOnly={readOnly} onChange={value => onValueChange({ ...values, [field.key]: value })}/> :
                <div className="prism-context-options" data-grid={field.options.length > 3 || undefined}>{field.options.map(option => {
                    const selected = Array.isArray(values[field.key]) ? values[field.key] as readonly string[] : [], checked = selected.includes(option.value);
                    return <PrismContextOptionCard key={option.value} option={option} checked={checked} disabled={busy || readOnly || !checked && selected.length >= (field.maxSelections ?? field.options.length)} onCheckedChange={next => onValueChange({ ...values, [field.key]: next ? [...new Set([...selected, option.value])] : selected.filter(value => value !== option.value) })}/>;
                })}</div>}
        </PrismContextSection>)}</div>
        {(invalid || error) && <p role="alert" className="prism-error">{error ?? "입력 길이와 선택 가능한 항목·개수를 확인해 주세요."}</p>}
        <footer>{actions.map((action, index) => <PrismButton key={`${action.value}-${index}`} data-context-action-index={index} type={action.value === "submit" ? "submit" : "button"} variant={action.value === "submit" ? "solid" : "line"} size="small" disabled={busy || action.value === "submit" && (readOnly || missing || invalid)} onClick={action.value === "submit" ? undefined : () => invoke(action)}>{busy && action.value === "submit" ? "등록 중" : action.label}</PrismButton>)}</footer>
    </form>;
}
