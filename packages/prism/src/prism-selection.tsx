import { useEffect, useId, useRef, useState, type ComponentProps } from "react";
import { Combobox, Calendar, Popover, PopoverAnchor, PopoverContent, PopoverTrigger, Checkbox, type ComboboxOption } from "@pydemia/ui";
import { enUS } from "date-fns/locale";
import { PrismIcon, PrismCalendarDaysGlyph as CalendarDays, PrismChevronDownGlyph as ChevronDown, PrismXGlyph as X, PrismChevronLeftGlyph as ChevronLeft, PrismChevronRightGlyph as ChevronRight, PrismChevronsLeftGlyph as ChevronsLeft, PrismChevronsRightGlyph as ChevronsRight } from "./prism-icon";
import { PrismTag } from "./prism-badge";

export type PrismOption = ComboboxOption;

export type PrismAutocompleteProps = Omit<ComponentProps<typeof Combobox>, "size"> & {
    label: string; size?: "medium" | "small"; freeSolo?: boolean; disableClearable?: boolean;
};
export function PrismAutocomplete({ label, options, selectedOption: retained, value: controlled, defaultValue = null,
    onValueChange, onQueryChange, filterOptions = true, loading, loadingMessage = "항목을 불러오는 중입니다.",
    errorMessage, emptyMessage = "검색 결과가 없습니다.", requiredMessage = "목록에서 항목을 선택하세요.",
    name, size = "medium", freeSolo = false, disableClearable, id: suppliedId, className = "", containerClassName = "",
    disabled, readOnly, required, ref, onFocus, onBlur, onKeyDown, placeholder = "선택하세요", ...props }: PrismAutocompleteProps) {
    const generatedId = useId(); const id = suppliedId ?? generatedId; const input = useRef<HTMLInputElement>(null);
    const [internal,setInternal] = useState<string|null>(defaultValue); const value = controlled === undefined ? internal : controlled;
    const [query,setQuery] = useState<string|null>(null); const [open,setOpen] = useState(false); const [active,setActive] = useState(-1);
    const selected = options.find(o => o.value === value) ?? (retained?.value === value ? retained : undefined);
    const filtered = loading || errorMessage ? [] : options.filter(o => !filterOptions || o.label.toLocaleLowerCase().includes((query ?? "").toLocaleLowerCase()));
    const change = (next:string|null) => {if(controlled===undefined)setInternal(next);if(next!==value)onValueChange?.(next);};
    const choose = (option:ComboboxOption) => {if(option.disabled||disabled||readOnly)return;change(option.value);setQuery(null);setOpen(false);setActive(-1);input.current?.focus();};
    const move = (direction:1|-1) => {setOpen(true);let next=open ? active : direction===1 ? -1 : 0;for(let i=0;i<filtered.length;i++){next=(next+direction+filtered.length)%filtered.length;if(!filtered[next].disabled){setActive(next);break;}}};
    useEffect(()=>{input.current?.setCustomValidity(required&&!disabled&&value===null ? requiredMessage : "");},[required,disabled,value,requiredMessage]);
    useEffect(()=>{if(controlled!==undefined)return;const form=input.current?.form;const reset=()=>{setInternal(defaultValue);setQuery(null);setOpen(false);setActive(-1);};form?.addEventListener("reset",reset);return()=>form?.removeEventListener("reset",reset);},[controlled,defaultValue]);
    return <div className={`prism-field prism-autocomplete ${containerClassName}`} data-size={size}><label htmlFor={id}>{label}</label>
        <div className="prism-autocomplete-control" data-disabled={disabled||readOnly||undefined} data-invalid={!!errorMessage||undefined}>
            <input {...props} ref={node=>{input.current=node;if(typeof ref==="function")ref(node);else if(ref)ref.current=node;}} id={id} role="combobox" autoComplete="off" aria-autocomplete="list" aria-expanded={open&&!disabled&&!readOnly}
                aria-controls={`${id}-options`} aria-activedescendant={open&&active>=0&&filtered[active] ? `${id}-option-${active}` : undefined}
                aria-invalid={!!errorMessage} aria-describedby={[props["aria-describedby"],errorMessage&&`${id}-error`].filter(Boolean).join(" ")||undefined}
                className={className} value={query??selected?.label??(freeSolo ? value??"" : "")} placeholder={placeholder} disabled={disabled} readOnly={readOnly} required={required}
                onFocus={e=>{onFocus?.(e);if(!e.defaultPrevented&&!disabled&&!readOnly){setOpen(true);setActive(-1);}}}
                onClick={()=>{if(!disabled&&!readOnly)setOpen(true);}}
                onBlur={e=>{onBlur?.(e);if(freeSolo&&query!==null)change(query.trim()||null);setOpen(false);setQuery(null);setActive(-1);}}
                onChange={e=>{setQuery(e.target.value);onQueryChange?.(e.target.value);change(null);setOpen(true);setActive(-1);}}
                onKeyDown={e=>{onKeyDown?.(e);if(e.defaultPrevented||disabled||readOnly||e.nativeEvent.isComposing)return;
                    if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();move(e.key==="ArrowDown" ? 1 : -1);}
                    else if(e.key==="Escape"){e.preventDefault();setOpen(false);setQuery(null);setActive(-1);}
                    else if(e.key==="Enter"&&open){e.preventDefault();if(active>=0&&filtered[active])choose(filtered[active]);else if(freeSolo&&query?.trim()){change(query.trim());setQuery(null);setOpen(false);}}
                }}/>
            {!disableClearable&&!disabled&&!readOnly&&(value!==null||!!query)&&<button type="button" aria-label={`${label} 지우기`} onMouseDown={e=>e.preventDefault()} onClick={()=>{change(null);setQuery("");onQueryChange?.("");setActive(-1);input.current?.focus();}}><PrismIcon name="CloseCircleIcon" size={16}/></button>}
            <PrismIcon name="SearchIcon" size={size==="small" ? 16 : 20}/>
        </div>
        {open&&!disabled&&!readOnly&&<div className="prism-autocomplete-options" role="listbox" id={`${id}-options`} aria-label={`${label} 검색 결과`} aria-busy={loading||undefined}>
            {filtered.map((option,index)=><div role="option" id={`${id}-option-${index}`} key={option.value} data-active={index===active||undefined} aria-selected={option.value===value} aria-disabled={option.disabled||undefined} onMouseDown={e=>e.preventDefault()} onClick={()=>choose(option)}>{option.label}</div>)}
            {!filtered.length&&<p role="status">{loading ? loadingMessage : errorMessage??emptyMessage}</p>}</div>}
        {name&&<input type="hidden" name={name} value={value??""} disabled={disabled}/>}
        {errorMessage&&<p className="prism-error" role="alert" id={`${id}-error`}>{errorMessage}</p>}
    </div>;
}
export function PrismMultiSelect({ label, options, value, onValueChange, disabled, readOnly, error, searchable = true, size = "medium", allLabel = "전체", allToggleClearsSelection = false }: {
    label: string; options: readonly ComboboxOption[]; value: readonly string[]; onValueChange: (value: string[]) => void;
    disabled?: boolean; readOnly?: boolean; error?: string; searchable?: boolean; size?: "large" | "medium" | "small"; allLabel?: string; allToggleClearsSelection?: boolean;
}) {
    const id = useId(); const [open,setOpen] = useState(false); const [query,setQuery] = useState("");
    const eligible=options.filter(o => !o.disabled); const all=eligible.length>0 && eligible.every(o => value.includes(o.value));
    const filtered=options.filter(o => o.label.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
    const toggle=(key:string) => {if (!disabled && !readOnly) onValueChange(value.includes(key) ? value.filter(v => v!==key) : [...value,key]);};
    const first=value[0]; const summary=all ? allLabel : options.find(o => o.value===first)?.label ?? first;
    return <div className="prism-field prism-multi-select"><label htmlFor={id}>{label}</label><div className="prism-multi-anchor"><Popover open={open} onOpenChange={next => {setOpen(next);setQuery("");}}>
        <PopoverTrigger asChild><button id={id} className="prism-select-trigger" data-size={size} type="button" disabled={disabled || readOnly} role="combobox" aria-expanded={open} aria-controls={`${id}-options`} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} onKeyDown={e=>{if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();setOpen(true);}}}>
            <span className={value.length ? "prism-sr-only" : undefined}>{value.length ? `${summary}${!all && value.length>1 ? ` 외 ${value.length-1}개` : ""}` : "선택하세요"}</span><ChevronDown aria-hidden="true" size={20} /></button></PopoverTrigger>
        <PopoverContent data-prism="light" className="prism-dropdown" align="start" id={`${id}-options`} aria-label={`${label} 선택 메뉴`} onKeyDown={e=>{
            const choices=Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('button[role="checkbox"]:not(:disabled)'));
            const index=choices.indexOf(document.activeElement as HTMLButtonElement);let next:number|undefined;
            if(e.key==="ArrowDown")next=(index+1)%choices.length;if(e.key==="ArrowUp")next=(index<0 ? choices.length-1 : index-1+choices.length)%choices.length;
            if(e.key==="Home")next=0;if(e.key==="End")next=choices.length-1;
            if(next!==undefined&&choices.length){e.preventDefault();choices[next].focus();}
        }}>
            {searchable && <div className="prism-dropdown-search"><PrismIcon name="SearchIcon" size={16}/><input aria-label={`${label} 항목 검색`} placeholder="검색" value={query} onChange={e => setQuery(e.target.value)} /></div>}
            {!query.trim() && <><PrismCheckbox label={allLabel} checked={all ? true : value.length ? "indeterminate" : false} onCheckedChange={() => onValueChange(all || (allToggleClearsSelection && value.length>0) ? value.filter(v => !eligible.some(o => o.value===v)) : [...new Set([...value,...eligible.map(o => o.value)])])} disabled={!eligible.length} /><hr /></>}
            {filtered.map(o => <PrismCheckbox key={o.value} label={o.label} checked={value.includes(o.value)} disabled={o.disabled} onCheckedChange={() => toggle(o.value)} />)}
            {!filtered.length && <p role="status">검색 결과가 없습니다.</p>}</PopoverContent></Popover>
        {value.length>0 && <span className="prism-multi-summary"><span className="prism-multi-chip"><span aria-hidden="true">{summary}</span>{!disabled&&!readOnly&&<button type="button" aria-label={all ? `${label} 전체 선택 해제` : `${summary} 선택 해제`} onClick={() => onValueChange(all ? [] : value.filter(v => v!==first))}><X size={14}/></button>}</span>{!all&&value.length>1&&<span className="prism-multi-count" aria-hidden="true">+{value.length-1}</span>}</span>}</div>
        {error && <p className="prism-error" id={`${id}-error`}>{error}</p>}</div>;
}
export function PrismCheckbox({ label, hideLabel, size = "medium", ...props }: Omit<ComponentProps<typeof Checkbox>, "variant" | "label" | "description"> & { label: string; hideLabel?: boolean; size?: "medium" | "small" }) {
    const id = useId(); return <label className="prism-choice" data-size={size} data-disabled={props.disabled||undefined} htmlFor={props.id ?? id}><Checkbox {...props} id={props.id ?? id} className="prism-checkbox" data-size={size} /><span className="prism-check-art" data-size={size} aria-hidden="true"><span data-glyph="unchecked"><PrismIcon name={props.disabled ? "CheckBoxUncheckedDisabledIcon" : "CheckBoxUncheckedIcon"} size={size==="small" ? 16 : 20}/></span><span data-glyph="checked"><PrismIcon name={props.disabled ? "CheckBoxCheckedDisabledIcon" : "CheckBoxCheckedIcon"} size={size==="small" ? 16 : 20}/></span><span data-glyph="indeterminate"><PrismIcon name="CheckBoxIndeterminateIcon" size={size==="small" ? 16 : 20}/></span></span><span className={hideLabel ? "prism-sr-only" : undefined}>{label}</span></label>;
}
export function PrismRadioGroup({ label, options, value, onValueChange, disabled, size="medium" }: { label: string; options: readonly ComboboxOption[];
    value: string; onValueChange: (value: string) => void; disabled?: boolean;size?:"medium"|"small" }) {
    const name = useId(); return <fieldset className="prism-radio-group"><legend>{label}</legend>{options.map(option => <label className="prism-choice" data-size={size} data-disabled={disabled||option.disabled||undefined} key={option.value}>
        <input type="radio" name={name} value={option.value} checked={value === option.value} disabled={disabled || option.disabled}
            onChange={() => onValueChange(option.value)} /><PrismIcon name={disabled || option.disabled ? value===option.value ? "RadioCheckedDisabledIcon" : "RadioUncheckedDisabledIcon" : value===option.value ? "RadioCheckedIcon" : "RadioUncheckedIcon"} size={size==="small" ? 16 : 20}/>{option.label}</label>)}</fieldset>;
}
function parseDate(value: string): Date | undefined {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return undefined;
    const [year,month,day] = value.split("-").map(Number); const date = new Date(year,month-1,day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : undefined;
}
export function PrismDatePicker({ label, value, onValueChange, size = "medium", disabled, readOnly, error, min, max, inputEditable = false }: {
    label: string; value: string | null; onValueChange: (value: string | null) => void;
    size?: "large" | "medium" | "small"; disabled?: boolean; readOnly?: boolean; error?: string; min?: string; max?: string; inputEditable?: boolean;
}) {
    if((min&&!parseDate(min))||(max&&!parseDate(max))||(min&&max&&min>max))throw new RangeError("Date bounds must be valid YYYY-MM-DD values with min <= max.");
    const id = useId(); const [draft,setDraft] = useState(value ?? ""); const [open,setOpen] = useState(false); const [invalid,setInvalid] = useState(false);
    const [month,setMonth] = useState(value ? parseDate(value) ?? new Date() : new Date()); const [yearView,setYearView] = useState(false); const yearGrid=useRef<HTMLDivElement>(null);
    const firstYear=min ? parseDate(min)?.getFullYear() ?? 1900 : 1900;const lastYear=max ? parseDate(max)?.getFullYear() ?? 2099 : 2099;
    const setCalendarOpen=(next:boolean)=>{if(next&&(disabled||readOnly))return;setOpen(next);if(next){setMonth(value ? parseDate(value) ?? new Date() : new Date());setYearView(false);}};
    useEffect(()=>{if(!yearView)return;const grid=yearGrid.current;const button=grid?.querySelector<HTMLButtonElement>(`[data-year="${month.getFullYear()}"]`);if(grid&&button){grid.scrollTop=button.offsetTop-grid.offsetTop-grid.clientHeight/2+18;button.focus({preventScroll:true});}},[yearView,month]);
    const chooseYear=(year:number)=>{const base=value ? parseDate(value) ?? new Date() : new Date();const day=Math.min(base.getDate(),new Date(year,base.getMonth()+1,0).getDate());let date=new Date(year,base.getMonth(),day);if(min&&date<parseDate(min)!)date=parseDate(min)!;if(max&&date>parseDate(max)!)date=parseDate(max)!;setMonth(date);onValueChange(`${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`);setYearView(false);};
    useEffect(() => { setDraft(value ?? ""); setInvalid(false); },[value]);
    const commit = () => { if (!inputEditable) return; if (!draft) { setInvalid(false); onValueChange(null); return; }
        if (!parseDate(draft) || (min && draft < min) || (max && draft > max)) { setInvalid(true); return; }
        setInvalid(false); onValueChange(draft); };
    return <div className="prism-field"><label htmlFor={id}>{label}</label><Popover open={open} onOpenChange={setCalendarOpen}>
        <PopoverAnchor asChild><div className="prism-date-input" data-size={size} data-calendar-only={!inputEditable||undefined} data-invalid={!!error || invalid || undefined} data-disabled={disabled || readOnly || undefined}>
            <input id={id} aria-invalid={!!error || invalid} aria-describedby={error || invalid ? `${id}-error` : undefined} placeholder="YYYY-MM-DD"
                value={draft} disabled={disabled} readOnly={readOnly||!inputEditable} inputMode="numeric" aria-haspopup="dialog" aria-expanded={open} aria-controls={`${id}-calendar`} onClick={()=>{if(!inputEditable)setCalendarOpen(true);}} onChange={e => setDraft(e.target.value)} onBlur={commit}
                onKeyDown={e => { if (e.key === "Enter" && !e.nativeEvent.isComposing) { e.preventDefault(); if(inputEditable)commit();else setCalendarOpen(true); }if(e.key==="ArrowDown"&&e.altKey){e.preventDefault();setCalendarOpen(true);} }} />
            <PopoverTrigger asChild><button type="button" aria-label={`${label} 달력 열기`} disabled={disabled || readOnly}><CalendarDays aria-hidden="true" size={size==="small" ? 16 : 20}/></button></PopoverTrigger></div></PopoverAnchor>
        <PopoverContent data-prism="light" className="prism-calendar-popover" align="start" sideOffset={0} id={`${id}-calendar`} aria-label={`${label} 달력`}>
            <div className="prism-calendar-header"><button type="button" aria-label="이전 달" hidden={yearView} disabled={yearView||new Date(month.getFullYear(),month.getMonth()-1,1)<new Date(firstYear,min ? parseDate(min)!.getMonth() : 0,1)} onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()-1,1))}><ChevronLeft size={16}/></button>
                <button type="button" className="prism-calendar-year-toggle" aria-label={yearView ? "날짜 선택으로 돌아가기" : "연도 선택"} aria-expanded={yearView} onClick={()=>setYearView(!yearView)}>{month.toLocaleDateString("en-US",{month:"long",year:"numeric"})}<PrismIcon name="CalendarDropdownIcon" size={16} style={{transform:yearView ? "rotate(180deg)" : undefined}}/></button>
                <button type="button" aria-label="다음 달" hidden={yearView} disabled={yearView||new Date(month.getFullYear(),month.getMonth()+1,1)>new Date(lastYear,max ? parseDate(max)!.getMonth() : 11,1)} onClick={()=>setMonth(new Date(month.getFullYear(),month.getMonth()+1,1))}><ChevronRight size={16}/></button></div>
            {yearView ? <div ref={yearGrid} className="prism-calendar-years" role="radiogroup" aria-label="연도" onKeyDown={e=>{const buttons=Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('button'));const index=buttons.indexOf(document.activeElement as HTMLButtonElement);let next=index;if(e.key==="ArrowLeft")next=index-1;if(e.key==="ArrowRight")next=index+1;if(e.key==="ArrowUp")next=index-3;if(e.key==="ArrowDown")next=index+3;if(e.key==="Home")next=0;if(e.key==="End")next=buttons.length-1;if(next!==index){e.preventDefault();buttons[Math.max(0,Math.min(buttons.length-1,next))]?.focus();}}}>
                {Array.from({length:Math.max(0,lastYear-firstYear+1)},(_,i)=>firstYear+i).map(year=><button type="button" key={year} role="radio" aria-checked={month.getFullYear()===year} tabIndex={month.getFullYear()===year ? 0 : -1} data-year={year} onClick={()=>chooseYear(year)}>{year}</button>)}</div> :
            <Calendar className="prism-calendar" locale={enUS} hideNavigation components={{MonthCaption:()=> <></>}} formatters={{formatWeekdayName:date=>date.toLocaleDateString("en-US",{weekday:"short"})}} month={month} onMonthChange={setMonth} mode="single" required autoFocus selected={value ? parseDate(value) : undefined}
                startMonth={new Date(firstYear,0,1)} endMonth={new Date(lastYear,11,1)}
                disabled={[...(min && parseDate(min) ? [{ before: parseDate(min)! }] : []),...(max && parseDate(max) ? [{ after: parseDate(max)! }] : [])]}
                onSelect={date => { const next = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,"0")}-${String(date.getDate()).padStart(2,"0")}`;
                    setDraft(next); setInvalid(false); onValueChange(next); setOpen(false); }} />}</PopoverContent></Popover>
        {(error || invalid) && <p className="prism-error" id={`${id}-error`}>{error ?? "올바른 날짜를 YYYY-MM-DD로 입력해 주세요."}</p>}</div>;
}
export function PrismDateRange({ label, start, end, onValueChange, disabled, readOnly, inputEditable }: { label: string; start: string | null; end: string | null;
    onValueChange: (range: { start: string | null; end: string | null }) => void; disabled?: boolean; readOnly?: boolean; inputEditable?: boolean }) {
    const id = useId(); const invalid = !!start && !!end && start > end;
    return <fieldset className="prism-date-range"><legend>{label}</legend>{readOnly ? <p>{start ?? "시작일 없음"} ~ {end ?? "종료일 없음"}</p> : <>
        <div className="prism-date-fields"><PrismDatePicker label={`${label} 시작일`} value={start} disabled={disabled} inputEditable={inputEditable}
            onValueChange={next => onValueChange({ start: next, end })} />
            <span>~</span><PrismDatePicker label={`${label} 종료일`} value={end} disabled={disabled} inputEditable={inputEditable}
                onValueChange={next => onValueChange({ start, end: next })} error={invalid ? "종료일은 시작일 이후여야 합니다." : undefined} /></div>
        {invalid && <p id={id} className="prism-error">종료일은 시작일 이후여야 합니다.</p>}</>}</fieldset>;
}
export function PrismPagination({ page, pageCount, onPageChange, disabled }: { page: number; pageCount: number;
    onPageChange: (page: number) => void; disabled?: boolean }) {
    if (!Number.isInteger(pageCount) || pageCount < 1 || !Number.isInteger(page) || page < 1 || page > pageCount) throw new RangeError("Pagination requires 1 <= page <= pageCount.");
    const first = Math.max(1, Math.min(page - 2, pageCount - 4));
    const pages = Array.from({ length: Math.min(5, pageCount) }, (_, i) => first + i);
    return <nav className="prism-pagination" aria-label="페이지 이동">{[[1,"첫 페이지",ChevronsLeft],[page - 1,"이전 페이지",ChevronLeft]].map(([next,label,Icon]) => {
        const Glyph = Icon as typeof ChevronLeft; return <button type="button" key={String(label)} aria-label={String(label)} disabled={disabled || page === 1} onClick={() => onPageChange(Number(next))}><Glyph aria-hidden="true" /></button>;
    })}{pages.map(next => <button type="button" key={next} aria-current={next === page ? "page" : undefined} disabled={disabled} onClick={() => onPageChange(next)}>{next}</button>)}
        <button type="button" aria-label="다음 페이지" disabled={disabled || page === pageCount} onClick={() => onPageChange(page + 1)}><ChevronRight aria-hidden="true" /></button>
        <button type="button" aria-label="마지막 페이지" disabled={disabled || page === pageCount} onClick={() => onPageChange(pageCount)}><ChevronsRight aria-hidden="true" /></button></nav>;
}

export function PrismChipAutocomplete({label,options,value,onValueChange,minSearchLength=3,disabled,readOnly,placeholder="검색",error}: {
    label:string;options:readonly ComboboxOption[];value:string|null;onValueChange:(value:string|null)=>void;minSearchLength?:number;disabled?:boolean;readOnly?:boolean;placeholder?:string;error?:string;
}) {
    const id=useId();const input=useRef<HTMLInputElement>(null);const clearFocus=useRef(false);const [query,setQuery]=useState("");const [focused,setFocused]=useState(false);const [active,setActive]=useState(-1);
    const keyword=query.trim().toLocaleLowerCase();const selected=options.find(o=>o.value===value);const filtered=options.filter(o=>o.label.toLocaleLowerCase().includes(keyword));
    const open=focused&&!disabled&&!readOnly&&!selected&&keyword.length>=minSearchLength;
    const choose=(option:ComboboxOption)=>{if(option.disabled||disabled||readOnly)return;onValueChange(option.value);setQuery("");setFocused(false);setActive(-1);};
    useEffect(()=>{if(!selected&&clearFocus.current){clearFocus.current=false;input.current?.focus();}},[selected]);
    return <div className="prism-field prism-chip-autocomplete"><label id={`${id}-label`} htmlFor={selected ? undefined : id}>{label}</label><div className="prism-chip-autocomplete-control" role={selected ? "group" : undefined} aria-labelledby={selected ? `${id}-label` : undefined} data-disabled={disabled||readOnly||undefined}>
        {selected ? readOnly ? <span>{selected.label}</span> : <span className="prism-multi-chip"><span>{selected.label}</span><button type="button" disabled={disabled} aria-label={`${selected.label} 선택 해제`} onClick={()=>{clearFocus.current=true;onValueChange(null);}}><X size={14}/></button></span> : <input ref={input} id={id} role="combobox" autoComplete="off" aria-autocomplete="list" aria-expanded={open} aria-controls={`${id}-options`} aria-activedescendant={open&&active>=0 ? `${id}-option-${active}` : undefined} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} placeholder={placeholder} value={query} disabled={disabled} readOnly={readOnly}
            onFocus={()=>setFocused(true)} onBlur={()=>{setFocused(false);setActive(-1);}} onChange={e=>{setQuery(e.target.value);setActive(-1);}} onKeyDown={e=>{
                if(e.key==="Escape"){setFocused(false);setActive(-1);return;}if(!open)return;
                if(e.key==="ArrowDown"||e.key==="ArrowUp"){e.preventDefault();const direction=e.key==="ArrowDown" ? 1 : -1;let next=active;for(let i=0;i<filtered.length;i++){next=(next+direction+filtered.length)%filtered.length;if(!filtered[next].disabled){setActive(next);break;}}}
                if(e.key==="Enter"&&!e.nativeEvent.isComposing&&active>=0&&filtered[active]){e.preventDefault();choose(filtered[active]);}
            }}/>}
        {!selected&&query&&!readOnly&&<button type="button" disabled={disabled} aria-label={`${label} 검색 지우기`} onClick={()=>{setQuery("");setActive(-1);}}><PrismIcon name="CloseCircleIcon" size={20}/></button>}</div>
        {open&&<div className="prism-chip-autocomplete-options" role="listbox" id={`${id}-options`} aria-label={`${label} 검색 결과`}>{filtered.length ? filtered.map((option,index)=>{const start=option.label.toLocaleLowerCase().indexOf(keyword);return <div role="option" id={`${id}-option-${index}`} key={option.value} aria-selected={active===index} aria-disabled={option.disabled||undefined} onMouseDown={e=>e.preventDefault()} onClick={()=>choose(option)}>{start<0 ? option.label : <>{option.label.slice(0,start)}<mark>{option.label.slice(start,start+keyword.length)}</mark>{option.label.slice(start+keyword.length)}</>}</div>;}) : <p role="status">검색 결과가 없습니다.</p>}</div>}
        {error&&<p role="alert" className="prism-error" id={`${id}-error`}>{error}</p>}</div>;
}
