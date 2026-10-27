import {
    useEffect, useId, useRef, useState,
    type ComponentProps, type PointerEvent,
} from "react";
import { cn } from "./utils";

type ColorPickerProps = Omit<ComponentProps<"div">, "onChange" | "defaultValue"> & {
    label: string;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    name?: string;
    disabled?: boolean;
    readOnly?: boolean;
    swatches?: readonly string[];
    showEyeDropper?: boolean;
};

type Rgba = { r: number; g: number; b: number; a: number };
type Hsv = { h: number; s: number; v: number };
const hexColor = /^#[\da-fA-F]{6}(?:[\da-fA-F]{2})?$/;

function parseColor(value: string): Rgba {
    if (!hexColor.test(value)) {
        throw new RangeError("ColorPicker requires #RRGGBB or #RRGGBBAA colors.");
    }
    return {
        r: parseInt(value.slice(1, 3), 16),
        g: parseInt(value.slice(3, 5), 16),
        b: parseInt(value.slice(5, 7), 16),
        a: value.length === 9 ? parseInt(value.slice(7, 9), 16) : 255,
    };
}

function toHex({ r, g, b, a }: Rgba): string {
    const byte = (value: number) => Math.round(value).toString(16).padStart(2, "0");
    return `#${byte(r)}${byte(g)}${byte(b)}${a < 255 ? byte(a) : ""}`;
}

function toHsv({ r, g, b }: Rgba): Hsv {
    const red = r / 255;
    const green = g / 255;
    const blue = b / 255;
    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    const delta = max - min;
    let h = 0;
    if (delta > 0) {
        if (max === red) h = ((green - blue) / delta) % 6;
        else if (max === green) h = (blue - red) / delta + 2;
        else h = (red - green) / delta + 4;
        h = (h * 60 + 360) % 360;
    }
    return { h, s: max === 0 ? 0 : delta / max, v: max };
}

function fromHsv({ h, s, v }: Hsv, a: number): Rgba {
    const chroma = v * s;
    const secondary = chroma * (1 - Math.abs((h / 60) % 2 - 1));
    const offset = v - chroma;
    const rgb = h < 60 ? [chroma, secondary, 0]
        : h < 120 ? [secondary, chroma, 0]
            : h < 180 ? [0, chroma, secondary]
                : h < 240 ? [0, secondary, chroma]
                    : h < 300 ? [secondary, 0, chroma]
                        : [chroma, 0, secondary];
    return {
        r: Math.round((rgb[0] + offset) * 255),
        g: Math.round((rgb[1] + offset) * 255),
        b: Math.round((rgb[2] + offset) * 255),
        a,
    };
}

type EyeDropperConstructor = new () => {
    open: () => Promise<{ sRGBHex: string }>;
};

function ColorPicker({
    label,
    value,
    defaultValue = "#000000",
    onValueChange,
    name,
    disabled = false,
    readOnly = false,
    swatches = [],
    showEyeDropper = true,
    id,
    className,
    ...props
}: ColorPickerProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const alphaHintId = `${inputId}-alpha-hint`;
    const [internalValue, setInternalValue] = useState(() =>
        toHex(parseColor(defaultValue)));
    const [draft, setDraft] = useState<string | null>(null);
    const [eyeDropperError, setEyeDropperError] = useState("");
    const [retainedHue, setRetainedHue] = useState(() =>
        toHsv(parseColor(value ?? defaultValue)).h);
    const pointerId = useRef<number | null>(null);
    const selected = value === undefined
        ? internalValue : toHex(parseColor(value));
    const rgba = parseColor(selected);
    const hsv = toHsv(rgba);
    const hue = hsv.s > 0 ? hsv.h : retainedHue;
    const opaque = toHex({ ...rgba, a: 255 });
    const canEdit = !disabled && !readOnly;
    const canPickScreen = showEyeDropper && canEdit && typeof window !== "undefined" &&
        Boolean((window as Window & { EyeDropper?: EyeDropperConstructor }).EyeDropper);

    useEffect(() => { setDraft(null); }, [selected]);

    if (!label.trim()) throw new Error("ColorPicker requires a label.");
    parseColor(defaultValue);
    if (value !== undefined && !onValueChange && canEdit) {
        throw new Error("Controlled ColorPicker requires onValueChange.");
    }
    for (const swatch of swatches) parseColor(swatch);

    function apply(next: Rgba | string) {
        if (!canEdit) return;
        const normalized = typeof next === "string"
            ? toHex(parseColor(next)) : toHex(next);
        const nextHsv = toHsv(parseColor(normalized));
        if (nextHsv.s > 0) setRetainedHue(nextHsv.h);
        setDraft(null);
        setEyeDropperError("");
        if (value === undefined) setInternalValue(normalized);
        if (normalized !== selected) onValueChange?.(normalized);
    }

    function updateArea(event: PointerEvent<HTMLDivElement>) {
        const bounds = event.currentTarget.getBoundingClientRect();
        if (!bounds.width || !bounds.height) return;
        const s = Math.max(0, Math.min(1,
            (event.clientX - bounds.left) / bounds.width));
        const v = 1 - Math.max(0, Math.min(1,
            (event.clientY - bounds.top) / bounds.height));
        apply(fromHsv({ h: hue, s, v }, rgba.a));
    }

    async function pickScreenColor() {
        const EyeDropper = (window as Window & {
            EyeDropper?: EyeDropperConstructor;
        }).EyeDropper;
        if (!EyeDropper || !canEdit) return;
        try {
            const picked = await new EyeDropper().open();
            const color = parseColor(picked.sRGBHex);
            apply({ ...color, a: rgba.a });
        } catch (reason) {
            if (reason instanceof Error && reason.name === "AbortError") return;
            setEyeDropperError("화면 색상을 선택하지 못했습니다.");
        }
    }

    return (
        <div data-ui="color-picker" className={cn(
            "grid min-w-0 max-w-xs gap-3 rounded-sm border border-border " +
            "bg-surface p-[var(--space-3)] text-foreground", className,
        )} {...props}>
            <label htmlFor={inputId} className="text-sm font-medium">{label}</label>
            <div aria-hidden="true" data-slot="color-area"
                onPointerDown={(event) => {
                    if (!canEdit || event.button !== 0) return;
                    pointerId.current = event.pointerId;
                    event.currentTarget.setPointerCapture?.(event.pointerId);
                    updateArea(event);
                }}
                onPointerMove={(event) => {
                    if (pointerId.current === event.pointerId) updateArea(event);
                }}
                onPointerUp={(event) => {
                    if (pointerId.current !== event.pointerId) return;
                    updateArea(event);
                    pointerId.current = null;
                }}
                onPointerCancel={() => { pointerId.current = null; }}
                className={cn(
                    "relative h-36 rounded-sm border border-border touch-none",
                    canEdit ? "cursor-crosshair" : "opacity-60",
                )}
                style={{
                    backgroundColor: `hsl(${hue} 100% 50%)`,
                    backgroundImage: "linear-gradient(to top, #000, transparent), " +
                        "linear-gradient(to right, #fff, transparent)",
                }}>
                <span className={
                    "pointer-events-none absolute size-3 -translate-x-1/2 " +
                    "-translate-y-1/2 rounded-full border-2 border-white shadow-sm"
                }
                    style={{ left: `${hsv.s * 100}%`, top: `${(1 - hsv.v) * 100}%` }} />
            </div>
            <div className="grid gap-2 text-xs">
                <label className="grid gap-1">색조
                    <input type="range" min="0" max="359" step="1"
                        value={Math.round(hue)} disabled={!canEdit}
                        className={
                            "h-3 w-full cursor-pointer appearance-none rounded-full " +
                            "disabled:cursor-not-allowed disabled:opacity-60 " +
                            "[&::-webkit-slider-thumb]:size-4 " +
                            "[&::-webkit-slider-thumb]:appearance-none " +
                            "[&::-webkit-slider-thumb]:rounded-full " +
                            "[&::-webkit-slider-thumb]:border-2 " +
                            "[&::-webkit-slider-thumb]:border-white " +
                            "[&::-webkit-slider-thumb]:bg-foreground " +
                            "[&::-moz-range-thumb]:size-3 " +
                            "[&::-moz-range-thumb]:rounded-full " +
                            "[&::-moz-range-thumb]:border-2 " +
                            "[&::-moz-range-thumb]:border-white " +
                            "[&::-moz-range-thumb]:bg-foreground"
                        }
                        onChange={(event) => {
                            const h = Number(event.target.value);
                            setRetainedHue(h);
                            apply(fromHsv({ ...hsv, h }, rgba.a));
                        }}
                        style={{ background: "linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)" }} />
                </label>
                <label className="grid gap-1">채도
                    <input type="range" min="0" max="100" step="1"
                        value={Math.round(hsv.s * 100)} disabled={!canEdit}
                        style={{ accentColor: "var(--accent)" }}
                        onChange={(event) => apply(fromHsv({
                            h: hue, s: Number(event.target.value) / 100, v: hsv.v,
                        }, rgba.a))} />
                </label>
                <label className="grid gap-1">밝기
                    <input type="range" min="0" max="100" step="1"
                        value={Math.round(hsv.v * 100)} disabled={!canEdit}
                        style={{ accentColor: "var(--accent)" }}
                        onChange={(event) => apply(fromHsv({
                            h: hue, s: hsv.s, v: Number(event.target.value) / 100,
                        }, rgba.a))} />
                </label>
                <label className="grid gap-1">불투명도
                    <input type="range" min="0" max="255" step="1"
                        value={rgba.a} disabled={!canEdit}
                        style={{ accentColor: "var(--accent)" }}
                        aria-describedby={alphaHintId}
                        aria-valuetext={`${Math.round(rgba.a / 255 * 100)}%`}
                        onChange={(event) => apply({
                            ...rgba, a: Number(event.target.value),
                        })} />
                </label>
            </div>
            <p id={alphaHintId} className="sr-only">
                0은 완전 투명, 255는 완전 불투명입니다.
            </p>
            <div className="flex items-center gap-2">
                <span aria-hidden="true" className={
                    "size-8 shrink-0 rounded-sm border border-border"
                } style={{ backgroundColor: selected }} />
                <input id={inputId} type="text" inputMode="text"
                    value={draft ?? selected} maxLength={9} spellCheck={false}
                    disabled={disabled} readOnly={readOnly}
                    aria-invalid={draft !== null && !hexColor.test(draft) || undefined}
                    aria-describedby={draft !== null && !hexColor.test(draft)
                        ? errorId : undefined}
                    onChange={(event) => {
                        const next = event.target.value;
                        if (hexColor.test(next)) apply(next);
                        else setDraft(next);
                    }}
                    onBlur={() => setDraft(null)}
                    className={
                        "h-8 min-w-0 flex-1 rounded-sm border border-border " +
                        "bg-background px-2 font-mono text-xs text-foreground " +
                        "aria-invalid:border-danger"
                    } />
                {canPickScreen && <button type="button"
                    onClick={() => void pickScreenColor()}
                    className={
                        "rounded-sm border border-border px-2 py-1.5 text-xs " +
                        "hover:bg-surface-subtle focus-visible:outline-2 " +
                        "focus-visible:outline-focus"
                    }>스포이드</button>}
            </div>
            {draft !== null && !hexColor.test(draft) &&
                <p id={errorId} role="alert" className="m-0 text-xs text-danger">
                    색상은 #RRGGBB 또는 #RRGGBBAA 형식으로 입력하세요.
                </p>}
            {eyeDropperError && <p role="alert" className="m-0 text-xs text-danger">
                {eyeDropperError}
            </p>}
            {swatches.length > 0 && <div role="group" aria-label="미리 정한 색상"
                className="flex flex-wrap gap-2">
                {swatches.map((swatch, index) => {
                    const normalized = toHex(parseColor(swatch));
                    return <button key={`${normalized}:${index}`} type="button"
                        disabled={!canEdit} onClick={() => apply(normalized)}
                        aria-label={`${normalized} 선택`}
                        aria-pressed={selected === normalized}
                        className={
                            "size-7 rounded-sm border border-border " +
                            "focus-visible:outline-2 focus-visible:outline-focus " +
                            "disabled:opacity-60"
                        }
                        style={{ backgroundColor: normalized }} />;
                })}
            </div>}
            {name && <input type="hidden" name={name} value={selected}
                disabled={disabled} />}
        </div>
    );
}

export { ColorPicker };
export type { ColorPickerProps };
