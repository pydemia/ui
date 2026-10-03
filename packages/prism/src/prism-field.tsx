import { Children, isValidElement, useEffect, useId, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { Input, Textarea, Popover, PopoverContent, PopoverTrigger } from "@pydemia/ui";
import { PrismChevronDownGlyph, PrismIcon } from "./prism-icon";

type FieldProps = { label: string; description?: string; error?: string; required?: boolean };
function FieldFrame({ id, label, description, error, required, children }: FieldProps & { id: string; children: ReactNode }) {
    return <div className="prism-field"><label htmlFor={id}>{label}{required && <span aria-hidden="true" className="prism-required"> *</span>}</label>
        {children}{description && <p id={`${id}-description`} className="prism-help">{description}</p>}
        {error && <p id={`${id}-error`} role="alert" className="prism-error">{error}</p>}</div>;
}
function describedBy(id: string, props: FieldProps, extra?: string) {
    return [extra, props.description && `${id}-description`, props.error && `${id}-error`].filter(Boolean).join(" ") || undefined;
}
export type PrismInputProps = FieldProps & Omit<ComponentProps<typeof Input>, "size"> & { size?: "large" | "medium" | "small"; onClear?: () => void; endAdornment?: ReactNode };
export function PrismInput({ label, description, error, size = "medium", id: suppliedId, className = "", onClear, endAdornment, ...props }: PrismInputProps) {
    const generatedId = useId(); const id = suppliedId ?? generatedId;
    const field = { label, description, error, required: props.required };
    const input = <Input {...props} id={id} className={`prism-input ${className}`} data-size={size}
        aria-invalid={error ? true : props["aria-invalid"]} aria-describedby={describedBy(id, field, props["aria-describedby"])} />;
    return <FieldFrame id={id} {...field}>{onClear || endAdornment ? <div className="prism-input-control" data-size={size} data-invalid={!!error||props["aria-invalid"]||undefined} data-disabled={props.disabled||undefined} data-readonly={props.readOnly||undefined}>
        {input}<div className="prism-input-adornment">{onClear && String(props.value ?? "").length > 0 && !props.disabled && !props.readOnly && <button type="button" aria-label={`${label} 지우기`} onClick={e=>{onClear();e.currentTarget.closest('.prism-input-control')?.querySelector('input')?.focus();}}><PrismIcon name="CloseCircleIcon" size={16}/></button>}{endAdornment}</div>
        </div> : input}</FieldFrame>;
}
export type PrismTextareaProps = FieldProps & ComponentProps<typeof Textarea>;
export function PrismTextarea({ label, description, error, id: suppliedId, className = "", ...props }: PrismTextareaProps) {
    const generatedId = useId(); const id = suppliedId ?? generatedId;
    const field = { label, description, error, required: props.required };
    return <FieldFrame id={id} {...field}><Textarea {...props} id={id} className={`prism-textarea ${className}`}
        aria-invalid={error ? true : props["aria-invalid"]} aria-describedby={describedBy(id, field, props["aria-describedby"])} /></FieldFrame>;
}
export type PrismSelectProps = FieldProps & {
    children?: ReactNode; options?: readonly { value: string; label: string; disabled?: boolean }[];
    value?: string; defaultValue?: string; onValueChange?: (value: string) => void;
    onChange?: (event: { target: { value: string } }) => void;
    size?: "large" | "medium" | "small"; searchable?: boolean; placeholder?: string; searchPlaceholder?: string;
    disabled?: boolean; readOnly?: boolean; name?: string; id?: string; className?: string; requiredMessage?: string;
};
export function PrismSelect({ label, description, error, required, size = "medium", id: suppliedId, className = "", children, options: suppliedOptions,
    value: controlledValue, defaultValue = "", onValueChange, onChange, searchable, placeholder = "선택해 주세요.", searchPlaceholder = "검색", requiredMessage = "목록에서 항목을 선택해 주세요.", disabled, readOnly, name }: PrismSelectProps) {
    const generatedId = useId(); const id = suppliedId ?? generatedId; const [internalValue,setInternalValue] = useState(defaultValue);
    const [open,setOpen] = useState(false); const [query,setQuery] = useState(""); const trigger = useRef<HTMLButtonElement>(null); const native = useRef<HTMLSelectElement>(null);
    const [nativeInvalid,setNativeInvalid]=useState(false);
    const typeahead = useRef({text:"",at:0});
    const options = suppliedOptions ?? Children.toArray(children).flatMap(child => isValidElement<{value?: string; children?: ReactNode; disabled?: boolean}>(child) ? [{
        value: child.props.value ?? String(child.props.children ?? ""), label: String(child.props.children ?? ""), disabled: child.props.disabled }] : []);
    const value = controlledValue ?? internalValue; const filtered = options.filter(o => o.label.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
    const select = (next: string) => { if (disabled || readOnly) return; if (controlledValue === undefined) setInternalValue(next); onValueChange?.(next); onChange?.({target:{value:next}}); setOpen(false); };
    useEffect(()=>{const control=native.current;if(!control)return;const resetValue=controlledValue===undefined ? defaultValue : value;for(const option of control.options)option.defaultSelected=option.value===resetValue;},[controlledValue,defaultValue,value]);
    useEffect(()=>{if(value)setNativeInvalid(false);},[value]);
    useEffect(()=>{const form=native.current?.form;const reset=()=>{if(controlledValue===undefined)setInternalValue(defaultValue);setNativeInvalid(false);setOpen(false);setQuery("");};form?.addEventListener("reset",reset);return()=>form?.removeEventListener("reset",reset);},[controlledValue,defaultValue]);
    const field = {label,description,error:error??(nativeInvalid ? requiredMessage : undefined),required};
    return <FieldFrame id={id} {...field}><Popover open={open&&!disabled&&!readOnly} onOpenChange={next => {setOpen(next&&!disabled&&!readOnly);setQuery("");typeahead.current={text:"",at:0};}}><PopoverTrigger asChild>
        <button ref={trigger} id={id} type="button" className={`prism-select-trigger ${className}`} data-size={size} data-readonly={readOnly||undefined} disabled={disabled} role="combobox" aria-readonly={readOnly||undefined} aria-expanded={open&&!disabled&&!readOnly}
            aria-controls={`${id}-options`} aria-required={required} aria-invalid={!!field.error} aria-describedby={describedBy(id,field)} data-placeholder={!options.some(o => o.value === value) || undefined}
            onClick={e=>{if(readOnly)e.preventDefault();}} onKeyDown={e=>{if(readOnly)return;if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();setOpen(true);}}}>
            <span>{options.find(o => o.value === value)?.label ?? placeholder}</span><PrismChevronDownGlyph size={size==="small" ? 16 : 20}/></button></PopoverTrigger>
        <PopoverContent data-prism="light" className="prism-dropdown" align="start" role="listbox" id={`${id}-options`} aria-label={label}
            onKeyDown={e => { const buttons = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('button[role="option"]:not(:disabled)'));
                const index = buttons.indexOf(document.activeElement as HTMLButtonElement); let next: number | undefined;
                if(e.nativeEvent.isComposing)return;
                if (e.key === "ArrowDown") next=(index+1)%buttons.length; if (e.key === "ArrowUp") next=index<0 ? buttons.length-1 : (index-1+buttons.length)%buttons.length;
                if(e.key === "Home") next=0; if(e.key === "End") next=buttons.length-1;
                if(next !== undefined && buttons.length) {e.preventDefault();buttons[next].focus();}
                else if(e.target instanceof HTMLButtonElement&&e.key.length===1&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&e.key!==" "){
                    const now=Date.now();const previous=typeahead.current;const text=now-previous.at>600 ? e.key : previous.text+e.key;typeahead.current={text,at:now};
                    const prefix=[...text].every(c=>c===text[0]) ? text[0] : text;
                    for(let step=1;step<=buttons.length;step++){const candidate=buttons[(index+step)%buttons.length];if(candidate.textContent?.toLocaleLowerCase().startsWith(prefix.toLocaleLowerCase())){e.preventDefault();candidate.focus();break;}}
                } }}>
            {searchable && <div className="prism-dropdown-search"><PrismIcon name="SearchIcon" size={16}/><input aria-label={`${label} 항목 검색`} placeholder={searchPlaceholder} value={query} onChange={e => setQuery(e.target.value)} /></div>}
            {filtered.map(o => <button type="button" role="option" aria-selected={o.value === value} disabled={o.disabled} key={o.value} onClick={() => select(o.value)}>{o.label}</button>)}
            {!filtered.length && <p role="status">검색 결과가 없습니다.</p>}</PopoverContent></Popover>
        {(name||required)&&<select ref={native} className="prism-sr-only" aria-hidden="true" tabIndex={-1} name={name} value={value} required={required} disabled={disabled}
            onChange={()=>{}} onInvalid={e=>{e.preventDefault();setNativeInvalid(true);trigger.current?.focus();}}><option value=""/>{options.filter(o=>o.value!=="").map(o=><option key={o.value} value={o.value} disabled={o.disabled}>{o.label}</option>)}</select>}</FieldFrame>;
}
