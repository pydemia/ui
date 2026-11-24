import { useEffect, useId, useRef, useState } from "react";
import type { KeyboardEvent, MouseEvent } from "react";
import { cn } from "../utils";

type ClockDialProps = {
    hour: number;
    minute: number;
    onHourChange: (hour: number) => void;
    onMinuteChange: (minute: number) => void;
    minuteStep?: number;
    duration?: boolean;
    disabled?: boolean;
    hourLabel?: string;
    minuteLabel?: string;
};

const hours = Array.from({ length: 25 }, (_, hour) => hour);
const formatNumber = (value: number) => String(value).padStart(2, "0");
const angle = (index: number, positions: number) => index * Math.PI * 2 / positions;

function dialPosition(index: number, positions: number, radius: number) {
    const radians = angle(index, positions);
    return { left: `${50 + Math.sin(radians) * radius}%`, top: `${50 - Math.cos(radians) * radius}%` };
}

function ClockDial({
    hour, minute, onHourChange, onMinuteChange, minuteStep = 1,
    duration = false, disabled = false, hourLabel = "시", minuteLabel = "분",
}: ClockDialProps) {
    const [part, setPart] = useState<"hour" | "minute">("hour");
    const [hourFocus, setHourFocus] = useState(hour);
    const pendingFocus = useRef(false);
    const dialRef = useRef<HTMLDivElement>(null);
    const dialId = useId();
    const minuteMode = part === "minute";
    const selectedMinute = minute % 60;
    const labelInterval = Math.max(5, minuteStep);
    const minuteMarks = Array.from({ length: 60 / minuteStep }, (_, index) => index * minuteStep)
        .filter(value => value % labelInterval === 0 || value === selectedMinute);

    useEffect(() => {
        if (pendingFocus.current) {
            pendingFocus.current = false;
            dialRef.current?.querySelector<HTMLButtonElement>("[tabindex='0']")?.focus();
        }
    }, [part, hourFocus, selectedMinute]);

    function chooseHour(value: number) {
        onHourChange(value);
        pendingFocus.current = true;
        setPart("minute");
    }

    function moveDial(event: KeyboardEvent<HTMLButtonElement>, value: number) {
        const offsets = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 };
        const offset = offsets[event.key as keyof typeof offsets];
        if (offset === undefined && event.key !== "Home" && event.key !== "End") return;
        event.preventDefault();
        event.stopPropagation();
        const count = minuteMode ? 60 / minuteStep : hours.length;
        const current = minuteMode ? value / minuteStep : value;
        const next = event.key === "Home" ? 0 : event.key === "End" ? count - 1 : (current + (offset ?? 0) + count) % count;
        if (next === current) return;
        pendingFocus.current = true;
        if (minuteMode) onMinuteChange(next * minuteStep);
        else setHourFocus(next);
    }

    function chooseMinuteOnFace(event: MouseEvent<HTMLButtonElement>) {
        const box = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - box.left - box.width / 2;
        const y = event.clientY - box.top - box.height / 2;
        if (Math.hypot(x, y) < box.width * 0.15) return;
        const turns = (Math.atan2(x, -y) / (2 * Math.PI) + 1) % 1;
        const steps = 60 / minuteStep;
        onMinuteChange(Math.round(turns * steps) % steps * minuteStep);
    }

    const handIndex = minuteMode ? selectedMinute : hour % 12;
    const shortHand = minuteMode ? selectedMinute % labelInterval !== 0 : hour > 12;
    const handRadius = shortHand ? 25 : 40;

    return <div className="mx-auto grid w-full max-w-68 min-w-0 justify-items-center gap-2" data-ui="clock-dial">
        <div className="flex items-center gap-2 tabular-nums">
            <button type="button" disabled={disabled} aria-pressed={!minuteMode} aria-controls={dialId}
                className="rounded-sm border border-border px-3 py-1 text-sm aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-accent-foreground"
                onClick={() => { setHourFocus(hour); setPart("hour"); }}>{formatNumber(hour)} {hourLabel}</button>
            <span aria-hidden="true">:</span>
            <button type="button" disabled={disabled} aria-pressed={minuteMode} aria-controls={dialId}
                className="rounded-sm border border-border px-3 py-1 text-sm aria-pressed:border-accent aria-pressed:bg-accent aria-pressed:text-accent-foreground"
                onClick={() => setPart("minute")}>{formatNumber(minute)} {minuteLabel}</button>
        </div>
        <div ref={dialRef} id={dialId} role="group" aria-label={minuteMode ? minuteLabel : hourLabel}
            className="relative aspect-square w-full rounded-full bg-surface-subtle text-foreground tabular-nums">
            {minuteMode && <span aria-hidden="true" className="pointer-events-none absolute inset-0 rounded-full text-muted/60"
                style={{ background: `repeating-conic-gradient(currentColor 0deg 0.6deg, transparent 0.6deg ${minuteStep * 6}deg)`,
                    maskImage: "radial-gradient(transparent 66%, black 66% 69%, transparent 69%)" }} />}
            {minuteMode && <button type="button" tabIndex={-1} aria-hidden="true" disabled={disabled}
                className="absolute inset-0 size-full rounded-full" onMouseDown={event => event.preventDefault()}
                onClick={chooseMinuteOnFace} />}
            {(minuteMode || hour !== 0) && <span aria-hidden="true" className="pointer-events-none absolute bottom-1/2 left-1/2 w-px origin-bottom bg-accent"
                style={{ height: `${handRadius}%`, transform: `rotate(${handIndex * (minuteMode ? 6 : 30)}deg)` }} />}
            {minuteMode && <span aria-hidden="true" className="pointer-events-none absolute top-1/2 left-1/2 size-2 -translate-1/2 rounded-full bg-accent" />}
            {(minuteMode ? minuteMarks : hours).map(value => {
                const selected = value === (minuteMode ? selectedMinute : hour);
                const inner = minuteMode ? value % labelInterval !== 0 : value >= 13;
                const position = !minuteMode && value === 0 ? { left: "50%", top: "50%" }
                    : dialPosition(minuteMode ? value : value % 12, minuteMode ? 60 : 12, inner ? 25 : 40);
                return <button key={value} type="button" style={position} disabled={disabled}
                    tabIndex={value === (minuteMode ? selectedMinute : hourFocus) ? 0 : -1}
                    aria-label={`${formatNumber(value)} ${minuteMode ? minuteLabel : hourLabel}`}
                    aria-pressed={selected} onFocus={() => { if (!minuteMode) setHourFocus(value); }}
                    data-clock-hour={minuteMode ? undefined : value} data-clock-minute={minuteMode ? value : undefined}
                    onClick={() => minuteMode ? onMinuteChange(value) : chooseHour(value)}
                    onKeyDown={event => moveDial(event, value)}
                    className={cn("absolute -translate-1/2 rounded-full leading-none focus-visible:z-10",
                        inner ? "size-[12%] text-xs" : "size-[14%] text-sm",
                        selected ? "bg-accent text-accent-foreground" : "bg-surface-subtle hover:bg-surface")}>{formatNumber(value)}</button>;
            })}
        </div>
        {minuteMode && (duration
            ? <button type="button" disabled={disabled} className="rounded-sm border border-border px-3 py-1 text-sm hover:bg-surface-subtle"
                onClick={() => onMinuteChange(60)}>60 {minuteLabel}</button>
            : <span className="text-xs text-muted">00 / 60 {minuteLabel}</span>)}
    </div>;
}

export { ClockDial };
