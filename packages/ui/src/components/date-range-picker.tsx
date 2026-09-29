import { CalendarRange } from "lucide-react";
import { useState, type ComponentProps } from "react";
import { Calendar } from "./calendar";
import { formatCalendarDate, parseCalendarDate } from "./calendar-date";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "./utils";

type DateRangeValue = { from: string; to: string | null } | null;

type DateRangePickerProps = Omit<
    ComponentProps<"button">,
    "children" | "defaultValue" | "name" | "onChange" | "required" | "type" | "value"
> & {
    value: DateRangeValue;
    onValueChange: (value: DateRangeValue) => void;
    startName?: string;
    endName?: string;
    minDate?: string;
    maxDate?: string;
    minNights?: number;
    maxNights?: number;
    placeholder?: string;
    calendarLocale?: ComponentProps<typeof Calendar>["locale"];
};

function DateRangePicker({
    value,
    onValueChange,
    startName,
    endName,
    minDate,
    maxDate,
    minNights = 0,
    maxNights,
    placeholder = "기간 선택",
    calendarLocale,
    disabled,
    className,
    ...triggerProps
}: DateRangePickerProps) {
    const [open, setOpen] = useState(false);
    const firstAllowed = minDate ? parseCalendarDate(minDate) : undefined;
    const lastAllowed = maxDate ? parseCalendarDate(maxDate) : undefined;
    const selected = value ? {
        from: parseCalendarDate(value.from),
        to: value.to ? parseCalendarDate(value.to) : undefined,
    } : undefined;
    const today = new Date();
    const initialMonth = selected?.from ?? (
        firstAllowed && today < firstAllowed ? firstAllowed :
            lastAllowed && today > lastAllowed ? lastAllowed : today
    );

    if (minDate && maxDate && minDate > maxDate) {
        throw new RangeError(`DateRangePicker minDate exceeds maxDate: ${minDate} > ${maxDate}`);
    }
    if (!Number.isInteger(minNights) || minNights < 0) {
        throw new RangeError("DateRangePicker minNights must be a nonnegative integer");
    }
    if (maxNights !== undefined && (
        !Number.isInteger(maxNights) || maxNights < 1 || maxNights < minNights
    )) {
        throw new RangeError("DateRangePicker maxNights must be a positive integer not below minNights");
    }
    if (value && (
        (value.to !== null && value.from > value.to) ||
        (minDate !== undefined && value.from < minDate) ||
        (maxDate !== undefined && (value.to ?? value.from) > maxDate)
    )) {
        throw new RangeError("DateRangePicker value is outside its allowed range");
    }
    if (selected?.to) {
        const nights = Math.round(
            (selected.to.getTime() - selected.from.getTime()) / 86_400_000,
        );
        if (nights < minNights || (
            maxNights !== undefined && nights > maxNights
        )) {
            throw new RangeError("DateRangePicker value violates its night limits");
        }
    }
    if (startName && endName && startName === endName) {
        throw new RangeError("DateRangePicker startName and endName must differ");
    }

    const label = value === null
        ? placeholder
        : `${value.from} — ${value.to ?? "종료일 선택"}`;

    return (
        <>
            {startName && (
                <input type="hidden" name={startName} value={value?.from ?? ""}
                    disabled={disabled} />
            )}
            {endName && (
                <input type="hidden" name={endName} value={value?.to ?? ""}
                    disabled={disabled} />
            )}
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <button
                        type="button"
                        disabled={disabled}
                        className={cn(
                            "flex h-[var(--control-height)] w-full items-center " +
                            "justify-between gap-2 rounded-sm border border-border " +
                            "bg-surface px-[var(--space-3)] text-left text-sm " +
                            "text-foreground disabled:cursor-not-allowed " +
                            "disabled:opacity-50 aria-invalid:border-danger",
                            className,
                        )}
                        {...triggerProps}
                    >
                        <span className={value === null ? "text-muted" : undefined}>
                            {label}
                        </span>
                        <CalendarRange aria-hidden="true" className="size-4 shrink-0" />
                    </button>
                </PopoverTrigger>
                <PopoverContent align="start" aria-label={placeholder}
                    className="w-auto p-0">
                    <Calendar
                        mode="range"
                        locale={calendarLocale}
                        selected={selected}
                        defaultMonth={initialMonth}
                        min={minNights}
                        max={maxNights}
                        resetOnSelect
                        excludeDisabled
                        disabled={[
                            ...(firstAllowed ? [{ before: firstAllowed }] : []),
                            ...(lastAllowed ? [{ after: lastAllowed }] : []),
                        ]}
                        onSelect={(range) => {
                            if (!range?.from) {
                                onValueChange(null);
                                return;
                            }
                            onValueChange({
                                from: formatCalendarDate(range.from),
                                to: range.to ? formatCalendarDate(range.to) : null,
                            });
                            if (range.to) setOpen(false);
                        }}
                    />
                    <div className={
                        "flex items-center justify-between gap-3 " +
                        "border-t border-border px-3 py-2 text-xs text-muted"
                    }>
                        <p role="status" className="m-0">
                            {value?.to ? "기간 선택 완료" :
                                value ? "종료일을 선택하세요." :
                                    "시작일을 선택하세요."}
                        </p>
                        {value && (
                            <button type="button"
                                className={
                                    "rounded-sm px-2 py-1 text-foreground " +
                                    "hover:bg-surface-subtle focus-visible:outline-2 " +
                                    "focus-visible:outline-focus"
                                }
                                onClick={() => {
                                    onValueChange(null);
                                    setOpen(false);
                                }}>
                                선택 지우기
                            </button>
                        )}
                    </div>
                </PopoverContent>
            </Popover>
        </>
    );
}

export { DateRangePicker };
export type { DateRangePickerProps, DateRangeValue };
