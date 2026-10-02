import type { ComponentProps } from "react";
import { cn } from "./utils";

type FunnelStage = {
    id: string;
    label: string;
    value: number | null;
};

type FunnelChartProps = Omit<ComponentProps<"figure">, "children" | "title"> & {
    title: string;
    stages: readonly FunnelStage[];
    description?: string;
    unit?: string;
    formatValue?: (value: number) => string;
    variant?: "panel" | "plain";
    emptyText?: string;
    missingText?: string;
};

function FunnelChart({
    title,
    stages,
    description,
    unit = "",
    formatValue = String,
    variant = "panel",
    emptyText = "표시할 단계가 없습니다.",
    missingText = "값 없음",
    className,
    ...props
}: FunnelChartProps) {
    if (typeof title !== "string" || !title.trim()) {
        throw new Error("FunnelChart requires a title.");
    }
    if (!Array.isArray(stages)) {
        throw new TypeError("FunnelChart stages must be an array.");
    }
    if (variant !== "panel" && variant !== "plain") {
        throw new RangeError("FunnelChart variant is not supported.");
    }
    if (typeof formatValue !== "function") {
        throw new TypeError("FunnelChart formatValue must be a function.");
    }
    if ([emptyText, missingText].some((text) =>
        typeof text !== "string" || !text.trim()
    )) {
        throw new Error("FunnelChart requires empty and missing text.");
    }

    const ids = new Set<string>();
    let previous: number | null = null;
    for (const stage of stages) {
        if (!stage || typeof stage.id !== "string" || !stage.id.trim() ||
            typeof stage.label !== "string" || !stage.label.trim() ||
            (stage.value !== null &&
                (!Number.isFinite(stage.value) || stage.value < 0))) {
            throw new RangeError(
                "FunnelChart stages need an id, label and nonnegative value.",
            );
        }
        if (ids.has(stage.id)) {
            throw new Error(`FunnelChart id is duplicated: ${stage.id}`);
        }
        ids.add(stage.id);
        if (stage.value !== null) {
            if (previous !== null && stage.value > previous) {
                throw new RangeError(
                    "FunnelChart stage values must not increase.",
                );
            }
            previous = stage.value;
        }
    }

    const baseline = stages[0]?.value;
    const values = stages.map((stage) => {
        if (stage.value === null) {
            return { text: missingText, rate: null };
        }
        const formatted = formatValue(stage.value);
        if (typeof formatted !== "string" || !formatted.trim()) {
            throw new Error("FunnelChart formatted values must be text.");
        }
        const text = formatted + unit;
        const rate = baseline != null && baseline > 0
            ? Math.round(stage.value / baseline * 1000) / 10
            : null;
        return { text, rate };
    });

    return (
        <figure {...props} data-variant={variant} className={cn(
            "@container m-0 min-w-0 text-foreground",
            variant === "panel" &&
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
            {stages.length === 0 ? (
                <p className="m-0 text-sm text-muted">{emptyText}</p>
            ) : (
                <ol className={
                    "m-0 grid min-w-0 list-none gap-[var(--space-3)] p-0"
                }>
                    {stages.map((stage, index) => (
                        <li key={stage.id} className="min-w-0">
                            <div className={
                                "flex min-w-0 flex-wrap items-baseline " +
                                "justify-between gap-x-3 text-sm"
                            }>
                                <span className="min-w-0 break-words">
                                    <span aria-hidden="true">{index + 1}. </span>
                                    {stage.label}
                                </span>
                                <span className="font-medium tabular-nums">
                                    {values[index].text}
                                </span>
                            </div>
                            <div aria-hidden="true" className={
                                "mt-[var(--space-1)] h-2.5 overflow-hidden " +
                                "rounded-full bg-surface-subtle"
                            }>
                                {values[index].rate !== null && (
                                    <div className="h-full rounded-full bg-accent"
                                        style={{ width:
                                            `${values[index].rate}%` }} />
                                )}
                            </div>
                            <p className="m-0 mt-1 text-xs text-muted">
                                첫 단계 대비: {values[index].rate === null
                                    ? "비율 없음"
                                    : `${values[index].rate}%`}
                            </p>
                        </li>
                    ))}
                </ol>
            )}
        </figure>
    );
}

export { FunnelChart };
export type { FunnelChartProps, FunnelStage };
