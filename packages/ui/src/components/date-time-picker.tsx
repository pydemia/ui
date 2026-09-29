import { useId, type ComponentProps } from "react";
import { parseCalendarDate } from "./calendar-date";
import { DatePicker } from "./date-picker";
import { TimePicker } from "./time-picker";
import { cn } from "./utils";

type DateTimeSelection = {
    date: string | null;
    time: string | null;
};

type DateTimePickerProps = {
    label: string;
    value: DateTimeSelection;
    onValueChange: (value: DateTimeSelection) => void;
    timeZone: string;
    name?: string;
    timeZoneName?: string;
    minDate?: string;
    maxDate?: string;
    minuteStep?: number;
    locale?: string;
    hourCycle?: "h12" | "h23";
    calendarLocale?: ComponentProps<typeof DatePicker>["calendarLocale"];
    disabled?: boolean;
    className?: string;
};

function DateTimePicker({
    label,
    value,
    onValueChange,
    timeZone,
    name,
    timeZoneName = name ? `${name}TimeZone` : undefined,
    minDate,
    maxDate,
    minuteStep,
    locale,
    hourCycle,
    calendarLocale,
    disabled = false,
    className,
}: DateTimePickerProps) {
    const labelId = useId();
    if (typeof label !== "string" || !label.trim()) {
        throw new Error("DateTimePicker requires a label.");
    }
    if (typeof onValueChange !== "function") {
        throw new Error("DateTimePicker requires onValueChange.");
    }
    if (!value || typeof value !== "object" ||
        !Object.hasOwn(value, "date") || !Object.hasOwn(value, "time") ||
        (value.date !== null && typeof value.date !== "string") ||
        (value.time !== null && typeof value.time !== "string")) {
        throw new Error("DateTimePicker requires date and time values.");
    }
    if (name !== undefined && (typeof name !== "string" || !name.trim())) {
        throw new Error("DateTimePicker name must not be empty.");
    }
    if (timeZoneName !== undefined && (
        typeof timeZoneName !== "string" || !timeZoneName.trim() ||
        name === undefined ||
        timeZoneName === name
    )) {
        throw new Error("DateTimePicker requires distinct form names.");
    }
    if (typeof timeZone !== "string" || !timeZone.trim()) {
        throw new RangeError("DateTimePicker requires a time zone.");
    }
    try {
        new Intl.DateTimeFormat("en-US", { timeZone });
    } catch {
        throw new RangeError("DateTimePicker timeZone is not supported.");
    }
    if (minDate) parseCalendarDate(minDate);
    if (maxDate) parseCalendarDate(maxDate);
    if (minDate && maxDate && minDate > maxDate) {
        throw new RangeError("DateTimePicker minDate exceeds maxDate.");
    }
    if (value.date !== null) {
        parseCalendarDate(value.date);
        if ((minDate && value.date < minDate) ||
            (maxDate && value.date > maxDate)) {
            throw new RangeError(
                "DateTimePicker date is outside its allowed range.",
            );
        }
    }
    const complete = value.date !== null && value.time !== null;
    const localDateTime = complete ? `${value.date}T${value.time}` : "";

    return (
        <div role="group" aria-labelledby={labelId}
            className={cn("@container grid min-w-0 gap-2", className)}>
            <p id={labelId} className="m-0 text-sm font-medium text-foreground">
                {label}
            </p>
            {name && (
                <>
                    <input type="hidden" name={name} value={localDateTime}
                        disabled={disabled} />
                    <input type="hidden" name={timeZoneName}
                        value={complete ? timeZone : ""}
                        disabled={disabled} />
                </>
            )}
            <div className="grid min-w-0 gap-3 @lg:grid-cols-2">
                <div className="grid min-w-0 content-start gap-2">
                    <span className="text-sm font-medium text-foreground">
                        날짜
                    </span>
                    <DatePicker aria-label={`${label} 날짜`}
                        value={value.date}
                        onValueChange={(date) => onValueChange({
                            date, time: value.time,
                        })}
                        min={minDate} max={maxDate}
                        calendarLocale={calendarLocale}
                        disabled={disabled} />
                </div>
                <TimePicker label={`${label} 시간`}
                    value={value.time}
                    onValueChange={(time) => onValueChange({
                        date: value.date, time,
                    })}
                    minuteStep={minuteStep} locale={locale}
                    hourCycle={hourCycle} disabled={disabled} />
            </div>
            <p className="m-0 text-xs text-muted">시간대: {timeZone}</p>
        </div>
    );
}

export { DateTimePicker };
export type { DateTimePickerProps, DateTimeSelection };
