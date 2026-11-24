import { CalendarDays } from "lucide-react";
import { useEffect, useId, useRef, useState, type ComponentProps } from "react";
import { ko } from "react-day-picker/locale";
import { Calendar } from "../calendar";
import { formatCalendarDate, parseCalendarDate } from "../calendar-date";
import { Input } from "../input";
import { Popover, PopoverAnchor, PopoverContent } from "../popover";

type DateInputProps = Omit<ComponentProps<typeof Input>, "type" | "value" | "defaultValue" | "onChange" | "min" | "max"> & {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    min?: string;
    max?: string;
    inlineCalendar?: boolean;
    calendarLocale?: ComponentProps<typeof Calendar>["locale"];
};

function readDate(value: string | undefined): Date | undefined {
    if (!value) return undefined;
    try { return parseCalendarDate(value); } catch { return undefined; }
}

function DateInput({
    value, defaultValue = "", onValueChange, inlineCalendar = false, calendarLocale = ko,
    min, max, disabled, readOnly, required, onFocus, onClick, onKeyDown, ...inputProps
}: DateInputProps) {
    const [localValue, setLocalValue] = useState(defaultValue);
    const [open, setOpen] = useState(false);
    const [month, setMonth] = useState<Date>();
    const input = useRef<HTMLInputElement>(null);
    const anchor = useRef<HTMLDivElement>(null);
    const calendarElement = useRef<HTMLDivElement>(null);
    const focusOnOpen = useRef(false);
    const dismissing = useRef(false);
    const calendarId = useId();
    const currentValue = value ?? localValue;
    const selected = readDate(currentValue);
    const minDate = readDate(min);
    const maxDate = readDate(max);
    const editable = !disabled && !readOnly;

    function focusCalendar() {
        const day = calendarElement.current?.querySelector<HTMLButtonElement>("[data-day] button[tabindex='0']");
        (day ?? calendarElement.current?.querySelector<HTMLButtonElement>("button:not(:disabled)"))?.focus();
    }

    useEffect(() => {
        if (open && focusOnOpen.current) {
            focusOnOpen.current = false;
            focusCalendar();
        }
    }, [open]);

    function reveal() {
        if (editable && !inlineCalendar && !open && !dismissing.current) {
            setMonth(selected ?? new Date());
            setOpen(true);
        }
    }

    function change(next: string) {
        if (value === undefined) setLocalValue(next);
        onValueChange?.(next);
        const date = readDate(next);
        if (date) setMonth(date);
    }

    function close(restoreFocus: boolean) {
        if (restoreFocus) {
            dismissing.current = true;
            input.current?.focus();
            dismissing.current = false;
        }
        setOpen(false);
    }

    const control = <div ref={anchor} className="relative min-w-0" data-ui="date-input">
        <Input {...inputProps} ref={input} type="date" value={currentValue} min={min} max={max}
            disabled={disabled} readOnly={readOnly} required={required}
            className={`pr-9 [&::-webkit-calendar-picker-indicator]:pointer-events-none [&::-webkit-calendar-picker-indicator]:opacity-0 ${inputProps.className ?? ""}`}
            aria-haspopup={inlineCalendar ? undefined : "dialog"}
            aria-controls={editable && (open || inlineCalendar) ? calendarId : undefined}
            onChange={event => change(event.target.value)}
            onFocus={event => { onFocus?.(event); if (!event.defaultPrevented) reveal(); }}
            onClick={event => { onClick?.(event); if (!event.defaultPrevented) reveal(); }}
            onKeyDown={event => {
                onKeyDown?.(event);
                if (event.defaultPrevented) return;
                if (event.key === "Escape" && open) {
                    event.preventDefault();
                    event.stopPropagation();
                    close(false);
                } else if (event.altKey && event.key === "ArrowDown") {
                    event.preventDefault();
                    if (open || inlineCalendar) focusCalendar();
                    else if (editable) { focusOnOpen.current = true; reveal(); }
                }
            }} />
        <CalendarDays aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted" />
    </div>;

    function select(date: Date | undefined) {
        change(date ? formatCalendarDate(date) : "");
        if (!inlineCalendar) close(true);
    }

    const calendar = <div ref={calendarElement} id={calendarId} inert={!editable} className="grid justify-items-center">
        <Calendar mode="single" locale={calendarLocale} selected={selected} required={required}
            month={month ?? selected ?? new Date()} onMonthChange={setMonth}
            disabled={[
                ...(minDate ? [{ before: minDate }] : []),
                ...(maxDate ? [{ after: maxDate }] : []),
            ]}
            className="border-0"
            classNames={{ nav: "absolute inset-x-3 top-3 flex h-9 items-center justify-between" }}
            onSelect={select} />
        {currentValue && !required && <button type="button" onClick={() => select(undefined)}
            className="mb-1 rounded-sm px-2 py-1 text-sm text-muted hover:bg-surface-subtle">날짜 지우기</button>}
    </div>;

    if (inlineCalendar) return <div className="grid min-w-0 gap-2">{control}{calendar}</div>;

    return <Popover open={editable && open} onOpenChange={setOpen}>
        <PopoverAnchor asChild>{control}</PopoverAnchor>
        <PopoverContent align="start" side="bottom" aria-label="날짜 선택" className="w-max p-0"
            onOpenAutoFocus={event => event.preventDefault()}
            onCloseAutoFocus={event => event.preventDefault()}
            onEscapeKeyDown={event => { event.preventDefault(); close(true); }}
            onInteractOutside={event => {
                if (event.target instanceof Node && anchor.current?.contains(event.target)) event.preventDefault();
            }}>
            {calendar}
        </PopoverContent>
    </Popover>;
}

export { DateInput };
export type { DateInputProps };
