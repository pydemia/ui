import type { ComponentProps } from "react";
import { cn } from "./utils";

type BoxPlotSummary = {
    id: string;
    label: string;
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
};

type BoxPlotChartProps = Omit<
    ComponentProps<"figure">, "children" | "title"
> & {
    title: string;
    summaries: readonly BoxPlotSummary[];
    description?: string;
    unit?: string;
    formatValue?: (value: number) => string;
    appearance?: "panel" | "plain";
    emptyText?: string;
};

function BoxPlotChart({
    title,
    summaries,
    description,
    unit = "",
    formatValue = String,
    appearance = "panel",
    emptyText = "표시할 분포가 없습니다.",
    className,
    ...props
}: BoxPlotChartProps) {
    if (typeof title !== "string" || !title.trim()) {
        throw new Error("BoxPlotChart requires a title.");
    }
    if (!Array.isArray(summaries)) {
        throw new TypeError("BoxPlotChart summaries must be an array.");
    }
    if (typeof formatValue !== "function") {
        throw new TypeError("BoxPlotChart formatValue must be a function.");
    }
    if (typeof emptyText !== "string" || !emptyText.trim()) {
        throw new Error("BoxPlotChart requires empty text.");
    }
    if (appearance !== "panel" && appearance !== "plain") {
        throw new RangeError("BoxPlotChart appearance is not supported.");
    }

    const ids = new Set<string>();
    for (const summary of summaries) {
        if (!summary || typeof summary.id !== "string" ||
            !summary.id.trim() || typeof summary.label !== "string" ||
            !summary.label.trim()) {
            throw new Error("BoxPlotChart summaries need an id and label.");
        }
        if (ids.has(summary.id)) {
            throw new Error(`BoxPlotChart id is duplicated: ${summary.id}`);
        }
        ids.add(summary.id);
        const values = [
            summary.min, summary.q1, summary.median,
            summary.q3, summary.max,
        ];
        if (values.some((value) => !Number.isFinite(value)) ||
            values.some((value, index) =>
                index > 0 && value < values[index - 1]
            )) {
            throw new RangeError(
                "BoxPlotChart values must be finite and ordered " +
                "from min to max.",
            );
        }
    }

    function formatted(value: number) {
        const text = formatValue(value);
        if (typeof text !== "string" || !text.trim()) {
            throw new Error("BoxPlotChart formatted values must be text.");
        }
        return text + unit;
    }

    let minimum = summaries[0]?.min ?? 0;
    let maximum = summaries[0]?.max ?? 0;
    for (const summary of summaries) {
        minimum = Math.min(minimum, summary.min);
        maximum = Math.max(maximum, summary.max);
    }
    const range = maximum - minimum;
    if (summaries.length > 0 && !Number.isFinite(range)) {
        throw new RangeError("BoxPlotChart range is not finite.");
    }
    const position = (value: number) => range === 0
        ? 50 : (value - minimum) / range * 100;
    const percent = (value: number) => `${position(value).toFixed(4)}%`;
    const widthPercent = (start: number, end: number) =>
        `${(position(end) - position(start)).toFixed(4)}%`;
    const rows = summaries.map((item: BoxPlotSummary) => ({
        ...item,
        values: [item.min, item.q1, item.median, item.q3, item.max]
            .map(formatted),
    }));

    return (
        <figure {...props} data-appearance={appearance} className={cn(
            "@container m-0 min-w-0 text-foreground",
            appearance === "panel" &&
                "rounded-sm border border-border bg-surface " +
                "p-[var(--space-4)]",
            className,
        )}>
            <figcaption className="mb-[var(--space-4)]">
                <strong className="text-sm font-semibold">{title}</strong>
                {description && <span className="mt-1 block text-xs text-muted">
                    {description}
                </span>}
            </figcaption>
            {rows.length === 0 ? (
                <p className="m-0 text-sm text-muted">{emptyText}</p>
            ) : <>
                <div className="grid gap-[var(--space-3)]">
                    {rows.map((row) => <div key={row.id} className={
                        "grid min-w-0 gap-x-[var(--space-3)] gap-y-1 " +
                        "@md:grid-cols-[minmax(0,9rem)_minmax(0,1fr)] " +
                        "@md:items-center"
                    }>
                        <span className="break-words text-xs font-medium">
                            {row.label}
                        </span>
                        <div aria-hidden="true"
                            className="relative mx-1 h-8 min-w-0">
                            <span className={
                                "absolute top-1/2 h-px bg-accent"
                            } style={{
                                left: percent(row.min),
                                width: widthPercent(row.min, row.max),
                            }} />
                            {[row.min, row.max].map((value, index) => (
                                <span key={index} className={
                                    "absolute bottom-1.5 top-1.5 w-px " +
                                    "-translate-x-1/2 bg-accent"
                                } style={{ left: percent(value) }} />
                            ))}
                            <span className={
                                "absolute bottom-1 top-1 border " +
                                "border-accent bg-surface-subtle"
                            } style={{
                                left: percent(row.q1),
                                width: widthPercent(row.q1, row.q3),
                            }} />
                            <span className={
                                "absolute bottom-0.5 top-0.5 w-0.5 " +
                                "-translate-x-1/2 bg-foreground"
                            } style={{ left: percent(row.median) }} />
                        </div>
                    </div>)}
                </div>
                <div className={cn(
                    "mt-[var(--space-2)] flex justify-between gap-2 " +
                    "text-xs text-muted tabular-nums",
                    range === 0 && "justify-center",
                )}>
                    <span>{formatted(minimum)}</span>
                    {range !== 0 && <span>{formatted(maximum)}</span>}
                </div>
                <div className="mt-[var(--space-4)] overflow-x-auto">
                    <table className="w-full min-w-[34rem] text-left text-xs">
                        <caption className="sr-only">{title} 상세 값</caption>
                        <thead>
                            <tr className="border-b border-border text-muted">
                                {[
                                    "그룹", "최솟값", "1사분위", "중앙값",
                                    "3사분위", "최댓값",
                                ].map((label) => <th key={label} scope="col"
                                    className="py-2 pr-3 font-medium">
                                    {label}
                                </th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => <tr key={row.id}
                                className={
                                    "border-b border-border last:border-0"
                                }>
                                <th scope="row" className={
                                    "break-words py-2 pr-3 font-medium"
                                }>{row.label}</th>
                                {row.values.map((value, index) => (
                                    <td key={index} className={
                                        "py-2 pr-3 tabular-nums"
                                    }>{value}</td>
                                ))}
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            </>}
        </figure>
    );
}

export { BoxPlotChart };
export type { BoxPlotChartProps, BoxPlotSummary };
