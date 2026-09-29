import { useId, useState, type ComponentProps } from "react";
import { Slider } from "./slider";
import { cn } from "./utils";

type RangeValue = readonly [number, number];

type RangeSliderProps = Omit<
    ComponentProps<"div">,
    "children" | "defaultValue" | "onChange" | "aria-label" |
    "aria-labelledby"
> & {
    label: string;
    minLabel: string;
    maxLabel: string;
    minName: string;
    maxName: string;
    value?: RangeValue;
    defaultValue?: RangeValue;
    onValueChange?: (value: RangeValue) => void;
    min?: number;
    max?: number;
    step?: number;
    minStepsBetweenThumbs?: number;
    disabled?: boolean;
    form?: string;
    dir?: "ltr" | "rtl";
    formatValue?: (value: number) => string;
};

function RangeSlider({
    label,
    minLabel,
    maxLabel,
    minName,
    maxName,
    value,
    defaultValue,
    onValueChange,
    min = 0,
    max = 100,
    step = 1,
    minStepsBetweenThumbs = 0,
    disabled = false,
    form,
    dir,
    formatValue = String,
    id,
    className,
    ...props
}: RangeSliderProps) {
    const generatedId = useId();
    const labelId = `${id ?? generatedId}-label`;
    const [internalValue, setInternalValue] = useState<RangeValue>(() =>
        defaultValue ? [...defaultValue] : [min, max],
    );
    const selected = value ?? internalValue;

    if (![label, minLabel, maxLabel, minName, maxName]
        .every((text) => text.trim())) {
        throw new Error("RangeSlider needs labels and both form names.");
    }
    if (minLabel.trim() === maxLabel.trim() ||
        minName.trim() === maxName.trim()) {
        throw new Error("RangeSlider thumb labels and form names must differ.");
    }
    if (!Number.isFinite(min) || !Number.isFinite(max) || min >= max) {
        throw new RangeError("RangeSlider bounds must be finite and ordered.");
    }
    if (!Number.isFinite(step) || step <= 0 ||
        !Number.isInteger(minStepsBetweenThumbs) ||
        minStepsBetweenThumbs < 0 ||
        minStepsBetweenThumbs * step > max - min) {
        throw new RangeError("RangeSlider step or thumb gap is invalid.");
    }
    if (value !== undefined && defaultValue !== undefined) {
        throw new Error("RangeSlider cannot have value and defaultValue.");
    }
    for (const candidate of [selected, defaultValue]) {
        if (!candidate) continue;
        if (candidate.length !== 2 ||
            !candidate.every(Number.isFinite) ||
            candidate[0] < min || candidate[1] > max ||
            candidate[1] - candidate[0] < minStepsBetweenThumbs * step) {
            throw new RangeError("RangeSlider value is outside its range.");
        }
    }
    if (value !== undefined && !onValueChange && !disabled) {
        throw new Error("Controlled RangeSlider requires onValueChange.");
    }

    function change(next: number[]) {
        if (next.length !== 2) {
            throw new Error("RangeSlider expected two thumb values.");
        }
        const range: RangeValue = [next[0], next[1]];
        if (value === undefined) setInternalValue(range);
        onValueChange?.(range);
    }

    return (
        <div
            {...props}
            id={id}
            role="group"
            aria-labelledby={labelId}
            data-slot="range-slider"
            className={cn("grid min-w-0 gap-[var(--space-3)]", className)}
        >
            <span id={labelId} className="text-sm font-medium">{label}</span>
            <Slider
                aria-label={label}
                thumbLabels={[minLabel, maxLabel]}
                value={[...selected]}
                onValueChange={change}
                min={min}
                max={max}
                step={step}
                minStepsBetweenThumbs={minStepsBetweenThumbs}
                disabled={disabled}
                form={form}
                dir={dir}
            />
            <div className="flex justify-between gap-[var(--space-3)] text-xs text-muted">
                <span>{minLabel}: {formatValue(selected[0])}</span>
                <span>{maxLabel}: {formatValue(selected[1])}</span>
            </div>
            <input type="hidden" name={minName} value={selected[0]}
                disabled={disabled} form={form} />
            <input type="hidden" name={maxName} value={selected[1]}
                disabled={disabled} form={form} />
        </div>
    );
}

export { RangeSlider };
export type { RangeSliderProps, RangeValue };
