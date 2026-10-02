import type { ComponentProps } from "react";
import { cn } from "./utils";

type BulletChartProps = Omit<ComponentProps<"figure">, "children" | "title"> & {
    title: string;
    value: number | null;
    target: number;
    max: number;
    description?: string;
    unit?: string;
    formatValue?: (value: number) => string;
    valueLabel?: string;
    targetLabel?: string;
    maxLabel?: string;
    missingText?: string;
    appearance?: "panel" | "plain";
};

function BulletChart({
    title,
    value,
    target,
    max,
    description,
    unit = "",
    formatValue = String,
    valueLabel = "현재",
    targetLabel = "목표",
    maxLabel = "최대",
    missingText = "값 없음",
    appearance = "panel",
    className,
    ...props
}: BulletChartProps) {
    if (typeof title !== "string" || !title.trim()) {
        throw new Error("BulletChart requires a title.");
    }
    if (!Number.isFinite(max) || max <= 0 ||
        !Number.isFinite(target) || target < 0 || target > max ||
        (value !== null &&
            (!Number.isFinite(value) || value < 0 || value > max))) {
        throw new RangeError(
            "BulletChart requires values between zero and a positive max.",
        );
    }
    if (typeof formatValue !== "function") {
        throw new TypeError("BulletChart formatValue must be a function.");
    }
    if ([valueLabel, targetLabel, maxLabel, missingText].some((label) =>
        typeof label !== "string" || !label.trim()
    ) || new Set([valueLabel, targetLabel, maxLabel]).size !== 3) {
        throw new Error("BulletChart requires value and range labels.");
    }
    if (appearance !== "panel" && appearance !== "plain") {
        throw new RangeError("BulletChart appearance is not supported.");
    }

    const actualText = value === null ? missingText : formatValue(value) + unit;
    const targetText = formatValue(target) + unit;
    const maxText = formatValue(max) + unit;
    if (![actualText, targetText, maxText].every((text) =>
        typeof text === "string" && text.trim()
    )) {
        throw new Error("BulletChart formatted values must be text.");
    }

    return (
        <figure {...props} data-appearance={appearance}
            className={cn(
                "@container m-0 min-w-0 text-foreground",
                appearance === "panel" &&
                    "rounded-sm border border-border bg-surface " +
                    "p-[var(--space-4)]",
                className,
            )}>
            <figcaption className="mb-[var(--space-4)]">
                <strong className="text-sm font-semibold">{title}</strong>
                {description && (
                    <span className="mt-1 block text-xs text-muted">
                        {description}
                    </span>
                )}
            </figcaption>
            <div aria-hidden="true" className={
                "relative mb-[var(--space-3)] h-3 rounded-full " +
                "bg-surface-subtle"
            }>
                {value !== null && (
                    <div className="absolute inset-y-0 left-0 rounded-full bg-accent"
                        style={{ width: `${value / max * 100}%` }} />
                )}
                <div className={
                    "absolute -top-1 -bottom-1 w-0.5 " +
                    "-translate-x-1/2 rounded-full bg-foreground"
                } style={{ left: `${target / max * 100}%` }} />
            </div>
            <dl className={
                "m-0 grid grid-cols-3 gap-[var(--space-2)] " +
                "text-xs"
            }>
                {([
                    [valueLabel, actualText],
                    [targetLabel, targetText],
                    [maxLabel, maxText],
                ] as const).map(([label, text]) => (
                    <div key={label} className="min-w-0">
                        <dt className="text-muted">{label}</dt>
                        <dd className={
                            "m-0 break-words font-medium tabular-nums"
                        }>{text}</dd>
                    </div>
                ))}
            </dl>
        </figure>
    );
}

export { BulletChart };
export type { BulletChartProps };
