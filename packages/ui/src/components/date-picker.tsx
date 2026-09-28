import { CalendarDays } from "lucide-react";
import { useState, type ComponentProps } from "react";
import { Calendar } from "./calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "./utils";

type DatePickerProps = Omit<
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
    calendarLocale?: ComponentProps<typeof Calendar>["locale"];
};

function parseCalendarDate(value: string): Date {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) throw new RangeError(`Invalid calendar date: ${value}`);

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);
    const date = new Date(0);
    date.setFullYear(year, month - 1, day);
    date.setHours(12, 0, 0, 0);
    if (
        date.getFullYear() !== year ||
        date.getMonth() !== month - 1 ||
        date.getDate() !== day
    ) {
        throw new RangeError(`Invalid calendar date: ${value}`);
    }
    return date;
}

function formatCalendarDate(date: Date): string {
    const year = String(date.getFullYear()).padStart(4, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function DatePicker({
    value,
    onValueChange,
    name,
    required = false,
    min,
    max,
    placeholder = "날짜 선택",
    calendarLocale,
    disabled,
    className,
    ...triggerProps
}: DatePickerProps) {
    const [open, setOpen] = useState(false);
    const selected = value === null ? undefined : parseCalendarDate(value);
    const minDate = min ? parseCalendarDate(min) : undefined;
    const maxDate = max ? parseCalendarDate(max) : undefined;
    if (min && max && min > max) {
        throw new RangeError(`DatePicker min exceeds max: ${min} > ${max}`);
    }

    return (
        <>
            {name && (
                <input
                    type="hidden"
                    name={name}
                    value={value ?? ""}
                    disabled={disabled}
                />
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
                            {value ?? placeholder}
                        </span>
                        <CalendarDays aria-hidden="true" className="size-4 shrink-0" />
                    </button>
                </PopoverTrigger>
                <PopoverContent
                    align="start"
                    aria-label={placeholder}
                    className="w-auto p-0"
                >
                    <Calendar
                        mode="single"
                        locale={calendarLocale}
                        selected={selected}
                        required={required}
                        disabled={[
                            ...(minDate ? [{ before: minDate }] : []),
                            ...(maxDate ? [{ after: maxDate }] : []),
                        ]}
                        onSelect={(date: Date | undefined) => {
                            onValueChange(date ? formatCalendarDate(date) : null);
                            setOpen(false);
                        }}
                    />
                </PopoverContent>
            </Popover>
        </>
    );
}

export { DatePicker };
export type { DatePickerProps };
