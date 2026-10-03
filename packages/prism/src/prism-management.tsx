import { useState, type ReactNode } from "react";
import { Sparkles } from "lucide-react";
import { PrismInput, PrismTextarea, PrismSelect } from "./prism-field";
import { PrismMultiSelect, PrismDatePicker } from "./prism-selection";
import { PrismSwitch } from "./prism-utility";
import { PrismTag } from "./prism-badge";
import { PrismButton } from "./prism-button";
import { PrismOutline } from "./prism-profile";
import { PrismTable } from "./prism-display";

type FieldBase = { id: string; label: string; required?: boolean; description?: string; fullWidth?: boolean; readOnly?: boolean };
export type PrismManagementField = FieldBase & (
    { kind: "text" | "email" | "textarea" | "date" | "switch" } |
    { kind: "select" | "multi"; options: readonly { value: string; label: string }[] }
);
export type PrismManagementValue = string | boolean | readonly string[] | null;
export function PrismManagementForm({ title, fields, values, onValueChange, onSubmit, onCancel, busy, readOnly, error, children }: {
    title: string; fields: readonly PrismManagementField[]; values: Readonly<Record<string,PrismManagementValue>>;
    onValueChange: (id: string, value: PrismManagementValue) => void; onSubmit: (values: Readonly<Record<string,PrismManagementValue>>) => void;
    onCancel?: () => void; busy?: boolean; readOnly?: boolean; error?: string; children?: ReactNode;
}) {
    const [errors,setErrors] = useState<Record<string,string>>({});
    const submit = () => { const next: Record<string,string> = {}; for (const field of fields) {
        const value = values[field.id]; if (field.required && (value == null || (typeof value === "string" && !value.trim()) || (Array.isArray(value) && !value.length))) next[field.id]=`${field.label}을 입력해 주세요.`;
    } setErrors(next); if (!Object.keys(next).length && !busy && !readOnly) onSubmit(values); };
    return <form className="prism-management-form" onSubmit={e => { e.preventDefault(); submit(); }}>
        <PrismOutline title={title}><div className="prism-management-fields">{fields.map(field => {
            const locked = readOnly || field.readOnly; const value = values[field.id]; const update = (next: PrismManagementValue) => { onValueChange(field.id,next); setErrors(previous => ({...previous,[field.id]:""})); };
            return <div key={field.id} data-full-width={field.fullWidth || undefined}>
                {field.kind === "textarea" ? <PrismTextarea label={field.label} value={typeof value === "string" ? value : ""} required={field.required} description={field.description} error={errors[field.id]} readOnly={locked} disabled={busy} onChange={e => update(e.target.value)} /> :
                field.kind === "select" ? <PrismSelect label={field.label} value={typeof value === "string" ? value : ""} required={field.required} description={field.description} error={errors[field.id]} disabled={busy || locked} onChange={e => update(e.target.value)}><option value="">선택해 주세요.</option>{field.options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</PrismSelect> :
                field.kind === "multi" ? <PrismMultiSelect label={field.label} options={field.options} value={Array.isArray(value) ? value : []} onValueChange={update} disabled={busy} readOnly={locked} error={errors[field.id]} /> :
                field.kind === "switch" ? <PrismSwitch label={field.label} checked={value === true} onCheckedChange={update} disabled={busy || locked} /> :
                field.kind === "date" ? <PrismDatePicker label={field.label} value={typeof value === "string" ? value : null} onValueChange={update} disabled={busy} readOnly={locked} error={errors[field.id]} /> :
                <PrismInput label={field.label} type={field.kind === "email" ? "email" : "text"} value={typeof value === "string" ? value : ""} required={field.required} description={field.description} error={errors[field.id]} disabled={busy} readOnly={locked} onChange={e => update(e.target.value)} />}</div>;
        })}</div>{children}</PrismOutline>{error && <p role="alert" className="prism-error">{error}</p>}
        {!readOnly && <footer>{onCancel && <PrismButton variant="line" disabled={busy} onClick={onCancel}>취소</PrismButton>}<PrismButton type="submit" disabled={busy}>{busy ? "저장 중" : "저장"}</PrismButton></footer>}</form>;
}
export function PrismAiGenerateButton({ label, busy, disabled, onGenerate }: { label: string; busy?: boolean; disabled?: boolean; onGenerate: () => void }) {
    return <PrismButton variant="line" size="small" icon={<Sparkles />} disabled={disabled || busy} aria-busy={busy} onClick={onGenerate}>{busy ? "생성 중" : label}</PrismButton>;
}
export function PrismCriteriaSection({ title, items, onAdd, onEdit, onRemove }: { title: string; items: readonly { id: string; label: string; description?: string }[];
    onAdd?: () => void; onEdit?: (id: string) => void; onRemove?: (id: string) => void }) {
    return <PrismOutline title={title} actions={onAdd && <PrismButton variant="line" size="small" onClick={onAdd}>추가</PrismButton>}><ul className="prism-management-criteria">
        {items.length ? items.map(item => <li key={item.id}><PrismTag label={item.label} onRemove={onRemove ? () => onRemove(item.id) : undefined}>{item.label}</PrismTag>
            {item.description && <p>{item.description}</p>}{onEdit && <PrismButton variant="shape" size="small" aria-label={`${item.label} 편집`} onClick={() => onEdit(item.id)}>편집</PrismButton>}</li>) : <li>등록된 기준이 없습니다.</li>}</ul></PrismOutline>;
}
export function PrismAffectedPositions({ positions }: { positions: readonly { id: string; name: string; company: string }[] }) {
    return <PrismTable caption={`영향을 받는 포지션 ${positions.length}건`}><thead><tr><th scope="col">포지션 명</th><th scope="col">회사</th></tr></thead><tbody>{positions.length ? positions.map(position => <tr key={position.id}><td>{position.name}</td><td>{position.company}</td></tr>) : <tr><td colSpan={2}>영향을 받는 포지션이 없습니다.</td></tr>}</tbody></PrismTable>;
}
