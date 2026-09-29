import { useState } from "react";
import { NativeSelect } from "./native-select";
import { cn } from "./utils";

type TimeSegments = {
    hour: string;
    minute: string;
    period: string;
};

type TimePickerProps = {
    label: string;
    value: string | null;
    onValueChange: (value: string | null) => void;
    name?: string;
    required?: boolean;
    disabled?: boolean;
    minuteStep?: number;
    locale?: string;
    hourCycle?: "h12" | "h23";
    segmentLabels?: {
        hour: string;
        minute: string;
        period: string;
    };
    className?: string;
};

function readTime(value: string | null, minuteStep: number): number | null {
    if (value === null) return null;
    if (!/^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)) {
        throw new RangeError("TimePicker value must be HH:mm or null.");
    }
    const [hour, minute] = value.split(":").map(Number);
    if (minute % minuteStep !== 0) {
        throw new RangeError("TimePicker value must match minuteStep.");
    }
    return hour * 60 + minute;
}

function TimePicker({
    label,
    value,
    onValueChange,
    name,
    required = false,
    disabled = false,
    minuteStep = 5,
    locale = "ko-KR",
    hourCycle,
    segmentLabels,
    className,
}: TimePickerProps) {
    if (!label.trim()) throw new Error("TimePicker requires a label.");
    if (typeof onValueChange !== "function") {
        throw new Error("TimePicker requires onValueChange.");
    }
    if (!Number.isInteger(minuteStep) || minuteStep < 1 ||
        60 % minuteStep !== 0) {
        throw new RangeError("TimePicker minuteStep must divide 60.");
    }
    if (hourCycle !== undefined && hourCycle !== "h12" &&
        hourCycle !== "h23") {
        throw new RangeError("TimePicker hourCycle is not supported.");
    }
    if (segmentLabels && [
        segmentLabels.hour, segmentLabels.minute, segmentLabels.period,
    ].some((text) => typeof text !== "string" || !text.trim())) {
        throw new Error("TimePicker segment labels must not be empty.");
    }
    const minutes = readTime(value, minuteStep);
    const resolvedCycle = hourCycle ?? (
        new Intl.DateTimeFormat(locale, { hour: "numeric" })
            .resolvedOptions().hourCycle?.startsWith("h1")
            ? "h12" : "h23"
    );
    const labels = segmentLabels ?? (locale.toLowerCase().startsWith("ko")
        ? { hour: "시", minute: "분", period: "오전/오후" }
        : { hour: "Hour", minute: "Minute", period: "AM/PM" });
    const digits = new Intl.NumberFormat(locale, {
        useGrouping: false, minimumIntegerDigits: 2,
    });
    const periodFormatter = new Intl.DateTimeFormat(locale, {
        hour: "numeric", hour12: true, timeZone: "UTC",
    });
    const periodLabel = (hour: number, fallback: string) =>
        periodFormatter.formatToParts(new Date(Date.UTC(2020, 0, 1, hour)))
            .find((part) => part.type === "dayPeriod")?.value ?? fallback;
    const periodOptions = [
        { value: "am", label: periodLabel(9, "AM") },
        { value: "pm", label: periodLabel(21, "PM") },
    ];
    const selected: TimeSegments = minutes === null
        ? { hour: "", minute: "", period: "" }
        : {
            hour: String(resolvedCycle === "h12"
                ? Math.floor(minutes / 60) % 12 || 12
                : Math.floor(minutes / 60)).padStart(2, "0"),
            minute: String(minutes % 60).padStart(2, "0"),
            period: minutes < 12 * 60 ? "am" : "pm",
        };
    const [draft, setDraft] = useState<{
        source: string | null;
        cycle: "h12" | "h23";
        segments: TimeSegments;
    } | null>(null);
    const segments = draft?.source === value && draft.cycle === resolvedCycle
        ? draft.segments : selected;
    const hasPartial = Object.values(segments).some(Boolean);

    function change(part: keyof TimeSegments, nextValue: string) {
        const next = { ...segments, [part]: nextValue };
        const complete = next.hour !== "" && next.minute !== "" &&
            (resolvedCycle === "h23" || next.period !== "");
        if (!complete) {
            if (value !== null) onValueChange(null);
            setDraft({ source: null, cycle: resolvedCycle, segments: next });
            return;
        }
        const hour = resolvedCycle === "h12"
            ? Number(next.hour) % 12 + (next.period === "pm" ? 12 : 0)
            : Number(next.hour);
        setDraft(null);
        onValueChange(
            `${String(hour).padStart(2, "0")}:${next.minute}`,
        );
    }

    const hours = resolvedCycle === "h12"
        ? [12, ...Array.from({ length: 11 }, (_, index) => index + 1)]
        : Array.from({ length: 24 }, (_, index) => index);

    return (
        <fieldset className={cn("m-0 min-w-0 border-0 p-0", className)}
            disabled={disabled}>
            <legend className="mb-2 text-sm font-medium text-foreground">
                {label}{required && <span aria-hidden="true"> *</span>}
            </legend>
            {name && <input type="hidden" name={name} value={value ?? ""}
                disabled={disabled} />}
            <div className={cn("grid min-w-0 gap-2",
                resolvedCycle === "h12" ? "grid-cols-3" : "grid-cols-2")}
            >
                <NativeSelect value={segments.hour} disabled={disabled}
                    required={required || hasPartial}
                    aria-label={`${label} · ${labels.hour}`}
                    onChange={(event) => change("hour", event.target.value)}
                    className="min-w-0 px-2 pr-7">
                    <option value="">{labels.hour}</option>
                    {hours.map((hour) => {
                        const text = String(hour).padStart(2, "0");
                        return <option key={text} value={text}>
                            {digits.format(hour)}
                        </option>;
                    })}
                </NativeSelect>
                <NativeSelect value={segments.minute} disabled={disabled}
                    required={required || hasPartial}
                    aria-label={`${label} · ${labels.minute}`}
                    onChange={(event) => change("minute", event.target.value)}
                    className="min-w-0 px-2 pr-7">
                    <option value="">{labels.minute}</option>
                    {Array.from({ length: 60 / minuteStep }, (_, index) => {
                        const minute = index * minuteStep;
                        const text = String(minute).padStart(2, "0");
                        return <option key={text} value={text}>
                            {digits.format(minute)}
                        </option>;
                    })}
                </NativeSelect>
                {resolvedCycle === "h12" && (
                    <NativeSelect value={segments.period} disabled={disabled}
                        required={required || hasPartial}
                        aria-label={`${label} · ${labels.period}`}
                        onChange={(event) => change(
                            "period", event.target.value,
                        )}
                        className="min-w-0 px-2 pr-7">
                        <option value="">{labels.period}</option>
                        {periodOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </NativeSelect>
                )}
            </div>
        </fieldset>
    );
}

export { TimePicker };
export type { TimePickerProps };
