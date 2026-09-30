import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, type ComponentProps } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "./utils";

type MonthPickerProps = Omit<
    ComponentProps<"button">,
    "children" | "defaultValue" | "name" | "onChange" | "required" | "type" | "value"
> & {
    value: string | null;
    onValueChange: (value: string | null) => void;
    name?: string;
    required?: boolean;
    min?: string;
    max?: string;
    placeholder?: string;
    locale?: string;
};

function parseMonth(value: string, label: string) {
    const match = /^(\d{4})-(0[1-9]|1[0-2])$/.exec(value);
    if (!match || match[1] === "0000") {
        throw new RangeError(`${label} must use YYYY-MM (0001-01 to 9999-12)`);
    }
    return Number(match[1]);
}

function MonthPicker({
    value,
    onValueChange,
    name,
    required = false,
    min,
    max,
    placeholder = "월 선택",
    locale = "ko-KR",
    disabled,
    className,
    ...triggerProps
}: MonthPickerProps) {
    const selectedYear = value === null ? null : parseMonth(value, "value");
    const minYear = min === undefined ? 1 : parseMonth(min, "min");
    const maxYear = max === undefined ? 9999 : parseMonth(max, "max");
    if (min && max && min > max) {
        throw new RangeError(`MonthPicker min exceeds max: ${min} > ${max}`);
    }
    if (value !== null && ((min && value < min) || (max && value > max))) {
        throw new RangeError(`MonthPicker value is outside min/max: ${value}`);
    }

    const [open, setOpen] = useState(false);
    const [viewYear, setViewYear] = useState(() => selectedYear ??
        Math.min(maxYear, Math.max(minYear, new Date().getFullYear())));
    const year = Math.min(maxYear, Math.max(minYear, viewYear));
    const formatter = new Intl.DateTimeFormat(locale, {
        month: "short", timeZone: "UTC",
    });
    const months = Array.from({ length: 12 }, (_, index) => {
        const month = String(index + 1).padStart(2, "0");
        const monthValue = `${String(year).padStart(4, "0")}-${month}`;
        return {
            value: monthValue,
            label: formatter.format(new Date(Date.UTC(2020, index, 1))),
            disabled: (min !== undefined && monthValue < min) ||
                (max !== undefined && monthValue > max),
        };
    });

    return (
        <>
            {name && <input type="hidden" name={name} value={value ?? ""}
                disabled={disabled} />}
            <Popover open={open} onOpenChange={(next) => {
                if (next) {
                    setViewYear(selectedYear ?? Math.min(maxYear,
                        Math.max(minYear, new Date().getFullYear())));
                }
                setOpen(next);
            }}>
                <PopoverTrigger asChild>
                    <button type="button" disabled={disabled}
                        className={cn(
                            "flex h-[var(--control-height)] w-full items-center " +
                            "justify-between gap-2 rounded-sm border border-border " +
                            "bg-surface px-[var(--space-3)] text-left text-sm " +
                            "text-foreground disabled:cursor-not-allowed " +
                            "disabled:opacity-50 aria-invalid:border-danger",
                            className,
                        )} {...triggerProps}>
                        <span className={value === null ? "text-muted" : undefined}>
                            {value ?? placeholder}
                        </span>
                        <CalendarDays aria-hidden="true" className="size-4 shrink-0" />
                    </button>
                </PopoverTrigger>
                <PopoverContent align="start" aria-label={placeholder}
                    className="w-[min(18rem,calc(100vw-2rem))] p-3">
                    <div className="mb-3 flex items-center justify-between gap-2">
                        <button type="button" aria-label="이전 연도"
                            disabled={year <= minYear}
                            onClick={() => setViewYear(year - 1)}
                            className={"flex size-9 items-center justify-center " +
                                "rounded-sm hover:bg-surface-subtle " +
                                "disabled:opacity-50"}>
                            <ChevronLeft aria-hidden="true" className="size-4" />
                        </button>
                        <span className="text-sm font-medium" aria-live="polite">
                            {year}
                        </span>
                        <button type="button" aria-label="다음 연도"
                            disabled={year >= maxYear}
                            onClick={() => setViewYear(year + 1)}
                            className={"flex size-9 items-center justify-center " +
                                "rounded-sm hover:bg-surface-subtle " +
                                "disabled:opacity-50"}>
                            <ChevronRight aria-hidden="true" className="size-4" />
                        </button>
                    </div>
                    <div role="group" aria-label={`${year}년 월 선택`}
                        className="grid grid-cols-3 gap-1">
                        {months.map((month) => (
                            <button key={month.value} type="button"
                                disabled={month.disabled}
                                aria-label={`${month.value} ${month.label}`}
                                aria-pressed={value === month.value}
                                onClick={() => {
                                    onValueChange(value === month.value &&
                                        !required ? null : month.value);
                                    setOpen(false);
                                }}
                                className={cn(
                                    "min-h-10 rounded-sm px-2 text-sm " +
                                    "hover:bg-surface-subtle disabled:opacity-40",
                                    value === month.value &&
                                    "bg-accent text-accent-foreground " +
                                    "hover:bg-accent",
                                )}>
                                {month.label}
                            </button>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
        </>
    );
}

export { MonthPicker };
export type { MonthPickerProps };
