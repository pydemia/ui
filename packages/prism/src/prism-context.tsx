import { useId, type ReactNode } from "react";
import { PrismChevronDownGlyph as ChevronDown, PrismXGlyph as X } from "./prism-icon";
import { PrismButton } from "./prism-button";
import { PrismTextarea } from "./prism-field";
import { PrismTag } from "./prism-badge";
import { PrismCheckbox } from "./prism-selection";

export type PrismContextOption = { value: string; label: string; description?: string };
export type PrismContextField = { key: string; label: string; description?: string; required?: boolean } & (
    { type: "textarea"; maxLength?: number; placeholder?: string } |
    { type: "options"; options: readonly PrismContextOption[]; maxSelections?: number });
export type PrismContextValues = Readonly<Record<string, string | readonly string[]>>;
export function PrismContextSection({ number, title, description, maxSelections, children }: { number: number; title: string; description?: ReactNode; maxSelections?: number; children: ReactNode }) {
    const id = useId();
    return <details className="prism-context-section"><summary aria-labelledby={id}><span className="prism-context-number">{number}</span><span><strong id={id}>{title}</strong>{description && <p>{description}</p>}</span>
        {maxSelections !== undefined && <PrismTag variant="blue">최대 {maxSelections}개 선택</PrismTag>}<ChevronDown aria-hidden="true" /></summary><div>{children}</div></details>;
}
export function PrismContextOptionCard({ option, checked, disabled, onCheckedChange }: { option: PrismContextOption; checked: boolean; disabled?: boolean; onCheckedChange: (checked: boolean) => void }) {
    return <div className="prism-context-option" data-checked={checked || undefined} data-disabled={disabled || undefined}>
        <PrismCheckbox label={option.label} checked={checked} disabled={disabled} onCheckedChange={value => onCheckedChange(value === true)} />{option.description && <p>{option.description}</p>}</div>;
}
export function PrismContextForm({ fields, values, onValueChange, onSubmit, onCancel, busy = false }: { fields: readonly PrismContextField[]; values: PrismContextValues;
    onValueChange: (values: PrismContextValues) => void; onSubmit: (values: PrismContextValues) => void; onCancel?: () => void; busy?: boolean }) {
    const missing = fields.some(f => f.required && (f.type === "textarea" ? !String(values[f.key] ?? "").trim() : !Array.isArray(values[f.key]) || !values[f.key].length));
    const invalid = fields.some(f => { const value=values[f.key]; return f.type === "textarea" ? String(value ?? "").length > (f.maxLength ?? 800) : Array.isArray(value) && (value.length > (f.maxSelections ?? f.options.length) || value.some(v => !f.options.some(o => o.value === v))); });
    return <form className="prism-context" onSubmit={e => { e.preventDefault(); if (!missing && !invalid && !busy) onSubmit(values); }}>
        <header><div><h2>맥락 정보 추가하기</h2><p>아래 항목 중 필요한 내용만 선택하여 입력해 주세요.</p></div>{onCancel && <PrismButton iconOnly variant="shape" aria-label="맥락 정보 닫기" icon={<X />} disabled={busy} onClick={onCancel} />}</header>
        <div className="prism-context-body">{fields.map((field,index) => <PrismContextSection key={field.key} number={index+1} title={field.label} description={field.description} maxSelections={field.type === "options" ? field.maxSelections : undefined}>
            {field.type === "textarea" ? <><PrismTextarea label={field.label} required={field.required} value={typeof values[field.key] === "string" ? values[field.key] as string : ""} maxLength={field.maxLength ?? 800}
                placeholder={field.placeholder} disabled={busy} onChange={e => onValueChange({...values,[field.key]:e.target.value})} /><small>{String(values[field.key] ?? "").length} / {field.maxLength ?? 800}</small></> :
                <div className="prism-context-options" data-grid={field.options.length > 3 || undefined}>{field.options.map(option => { const selected = Array.isArray(values[field.key]) ? values[field.key] as readonly string[] : [];
                    const checked = selected.includes(option.value); return <PrismContextOptionCard key={option.value} option={option} checked={checked}
                        disabled={busy || (!checked && selected.length >= (field.maxSelections ?? field.options.length))} onCheckedChange={next => onValueChange({...values,[field.key]:next ? [...new Set([...selected,option.value])] : selected.filter(v => v !== option.value)})} />; })}</div>}
        </PrismContextSection>)}</div>{invalid && <p role="alert" className="prism-error">입력 길이와 선택 가능한 항목·개수를 확인해 주세요.</p>}<footer>{onCancel && <PrismButton variant="line" size="small" disabled={busy} onClick={onCancel}>취소</PrismButton>}<PrismButton type="submit" size="small" disabled={busy || missing || invalid}>{busy ? "등록 중" : "등록"}</PrismButton></footer>
    </form>;
}
