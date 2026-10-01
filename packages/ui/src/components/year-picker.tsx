import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, type ComponentProps } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "./utils";

type YearPickerProps = Omit<
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
};

function parseYear(value: string, label: string) {
    if (!/^\d{4}$/.test(value) || value === "0000") {
        throw new RangeError(`${label} must use YYYY (0001 to 9999)`);
    }
    return Number(value);
}

function YearPicker({
    value,
    onValueChange,
    name,
    required = false,
    min,
    max,
    placeholder = "연도 선택",
    disabled,
    className,
    ...triggerProps
}: YearPickerProps) {
    const selectedYear = value === null ? null : parseYear(value, "value");
    const minYear = min === undefined ? 1 : parseYear(min, "min");
    const maxYear = max === undefined ? 9999 : parseYear(max, "max");
    if (minYear > maxYear) {
        throw new RangeError(`YearPicker min exceeds max: ${min} > ${max}`);
    }
    if (selectedYear !== null &&
        (selectedYear < minYear || selectedYear > maxYear)) {
        throw new RangeError(`YearPicker value is outside min/max: ${value}`);
    }

    const [open, setOpen] = useState(false);
    const [viewStart, setViewStart] = useState(() => Math.floor(
        (selectedYear ?? Math.min(maxYear,
            Math.max(minYear, new Date().getFullYear()))) / 10,
    ) * 10);
    const pageStart = Math.floor(Math.min(maxYear,
        Math.max(minYear, viewStart)) / 10) * 10;
    const pageEnd = Math.min(9999, pageStart + 9);
    const years = Array.from({ length: 10 }, (_, index) => pageStart + index)
        .filter((year) => year >= 1 && year <= 9999);

    return (
        <>
            {name && <input type="hidden" name={name} value={value ?? ""}
                disabled={disabled} />}
            <Popover open={open} onOpenChange={(next) => {
                if (next) {
                    const initialYear = selectedYear ?? Math.min(maxYear,
                        Math.max(minYear, new Date().getFullYear()));
                    setViewStart(Math.floor(initialYear / 10) * 10);
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
                            "disabled:opacity-50 aria-invalid:border-danger " +
                            "focus-visible:outline-2 focus-visible:outline-offset-2 " +
                            "focus-visible:outline-focus",
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
                        <button type="button" aria-label="이전 10년"
                            disabled={pageStart === 0 || pageStart - 1 < minYear}
                            onClick={() => setViewStart(pageStart - 10)}
                            className={"grid size-9 place-items-center rounded-sm " +
                                "hover:bg-surface-subtle disabled:opacity-50 " +
                                "focus-visible:outline-2 focus-visible:outline-focus"}>
                            <ChevronLeft aria-hidden="true" className="size-4" />
                        </button>
                        <span className="text-sm font-medium" aria-live="polite">
                            {String(Math.max(1, pageStart)).padStart(4, "0")}
                            {"–"}{String(pageEnd).padStart(4, "0")}
                        </span>
                        <button type="button" aria-label="다음 10년"
                            disabled={pageStart + 10 > maxYear}
                            onClick={() => setViewStart(pageStart + 10)}
                            className={"grid size-9 place-items-center rounded-sm " +
                                "hover:bg-surface-subtle disabled:opacity-50 " +
                                "focus-visible:outline-2 focus-visible:outline-focus"}>
                            <ChevronRight aria-hidden="true" className="size-4" />
                        </button>
                    </div>
                    <div role="group"
                        aria-label={`${Math.max(1, pageStart)}년부터 ${pageEnd}년까지`}
                        className="grid grid-cols-5 gap-1">
                        {years.map((year) => {
                            const yearValue = String(year).padStart(4, "0");
                            return <button key={yearValue} type="button"
                                disabled={year < minYear || year > maxYear}
                                aria-label={`${yearValue}년`}
                                aria-pressed={value === yearValue}
                                onClick={() => {
                                    onValueChange(value === yearValue &&
                                        !required ? null : yearValue);
                                    setOpen(false);
                                }}
                                className={cn(
                                    "min-h-10 rounded-sm px-1 text-sm " +
                                    "hover:bg-surface-subtle disabled:opacity-40 " +
                                    "focus-visible:outline-2 focus-visible:outline-focus",
                                    value === yearValue &&
                                    "bg-accent text-accent-foreground " +
                                    "hover:bg-accent",
                                )}>
                                {yearValue}
                            </button>;
                        })}
                    </div>
                </PopoverContent>
            </Popover>
        </>
    );
}

export { YearPicker };
export type { YearPickerProps };
