import type { ComponentProps } from "react";
import { cn } from "./utils";

type HistogramBin = {
    start: number;
    end: number;
    count: number;
};

type HistogramChartProps = Omit<
    ComponentProps<"figure">, "children" | "title"
> & {
    title: string;
    bins: readonly HistogramBin[];
    description?: string;
    unit?: string;
    countUnit?: string;
    formatBoundary?: (value: number) => string;
    appearance?: "panel" | "plain";
    emptyText?: string;
};

function HistogramChart({
    title,
    bins,
    description,
    unit = "",
    countUnit = "",
    formatBoundary = String,
    appearance = "panel",
    emptyText = "표시할 구간이 없습니다.",
    className,
    ...props
}: HistogramChartProps) {
    if (typeof title !== "string" || !title.trim()) {
        throw new Error("HistogramChart requires a title.");
    }
    if (!Array.isArray(bins)) {
        throw new TypeError("HistogramChart bins must be an array.");
    }
    if (typeof formatBoundary !== "function") {
        throw new TypeError(
            "HistogramChart formatBoundary must be a function.",
        );
    }
    if (typeof emptyText !== "string" || !emptyText.trim()) {
        throw new Error("HistogramChart requires empty text.");
    }
    if (appearance !== "panel" && appearance !== "plain") {
        throw new RangeError("HistogramChart appearance is not supported.");
    }

    let width = 0;
    let total = 0;
    let maximum = 0;
    for (const [index, bin] of bins.entries()) {
        if (!bin || !Number.isFinite(bin.start) ||
            !Number.isFinite(bin.end) || bin.end <= bin.start ||
            !Number.isSafeInteger(bin.count) || bin.count < 0) {
            throw new RangeError(
                "HistogramChart bins need finite bounds and " +
                "non-negative integer counts.",
            );
        }
        const currentWidth = bin.end - bin.start;
        if (!Number.isFinite(currentWidth)) {
            throw new RangeError("HistogramChart bin width is not finite.");
        }
        if (index === 0) {
            width = currentWidth;
        } else {
            const previous = bins[index - 1];
            const tolerance = width * 1e-9;
            if (Math.abs(bin.start - previous.end) > tolerance ||
                Math.abs(currentWidth - width) > tolerance) {
                throw new RangeError(
                    "HistogramChart bins must be contiguous " +
                    "and equal width.",
                );
            }
        }
        total += bin.count;
        if (!Number.isSafeInteger(total)) {
            throw new RangeError("HistogramChart total count is too large.");
        }
        maximum = Math.max(maximum, bin.count);
    }

    function boundary(value: number) {
        const text = formatBoundary(value);
        if (typeof text !== "string" || !text.trim()) {
            throw new Error(
                "HistogramChart formatted boundaries must be text.",
            );
        }
        return text + unit;
    }

    const intervals = bins.map((bin, index) => {
        const last = index === bins.length - 1;
        return {
            ...bin,
            label: `${boundary(bin.start)} 이상 ` +
                `${boundary(bin.end)} ${last ? "이하" : "미만"}`,
            height: `${(bin.count / (maximum || 1) * 100).toFixed(4)}%`,
        };
    });

    return (
        <figure {...props} data-appearance={appearance} className={cn(
            "m-0 min-w-0 text-foreground",
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
            {intervals.length === 0 ? (
                <p className="m-0 text-sm text-muted">{emptyText}</p>
            ) : <>
                <p className="mb-[var(--space-3)] mt-0 text-xs text-muted">
                    총 {total}{countUnit}
                    {total === 0 && " · 모든 구간의 빈도 0"}
                </p>
                <div className="overflow-x-auto">
                    <div style={{
                        minWidth: Math.max(240, bins.length * 28),
                    }}>
                        <div aria-hidden="true"
                            className={
                                "relative h-44 border-b border-border"
                            }>
                            <span className={
                                "absolute left-0 top-0 text-xs " +
                                "text-muted tabular-nums"
                            }>빈도 {maximum}{countUnit}</span>
                            <div className={
                                "absolute inset-x-0 bottom-0 top-5 grid " +
                                "items-end"
                            } style={{
                                gridTemplateColumns:
                                    `repeat(${bins.length}, minmax(0, 1fr))`,
                            }}>
                                {intervals.map((bin) => <span
                                    key={`${bin.start}:${bin.end}`}
                                    title={`${bin.label}: ` +
                                        `${bin.count}${countUnit}`}
                                    style={{ height: bin.height }}
                                    className={
                                        "min-w-0 bg-accent " +
                                        "border-r border-surface"
                                    } />)}
                            </div>
                        </div>
                        <div className={
                            "mt-1 flex justify-between gap-2 " +
                            "text-xs text-muted tabular-nums"
                        }>
                            <span>{boundary(bins[0].start)}</span>
                            <span>{boundary(bins[bins.length - 1].end)}</span>
                        </div>
                    </div>
                </div>
                <div className="mt-[var(--space-4)] overflow-x-auto">
                    <table className="w-full min-w-[15rem] text-left text-xs">
                        <caption className="sr-only">
                            {title} 구간별 빈도
                        </caption>
                        <thead>
                            <tr className="border-b border-border text-muted">
                                <th scope="col" className="py-2 pr-3 font-medium">
                                    구간
                                </th>
                                <th scope="col" className="py-2 font-medium">
                                    빈도
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {intervals.map((bin) => <tr
                                key={`${bin.start}:${bin.end}`}
                                className={
                                    "border-b border-border last:border-0"
                                }>
                                <th scope="row"
                                    className="py-2 pr-3 font-medium">
                                    {bin.label}
                                </th>
                                <td className="py-2 tabular-nums">
                                    {bin.count}{countUnit}
                                </td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            </>}
        </figure>
    );
}

export { HistogramChart };
export type { HistogramBin, HistogramChartProps };
