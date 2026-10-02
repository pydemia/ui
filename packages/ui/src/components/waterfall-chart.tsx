import type { ComponentProps } from "react";
import { cn } from "./utils";

type WaterfallChange = {
    id: string;
    label: string;
    value: number;
};

type WaterfallChartProps = Omit<
    ComponentProps<"figure">, "children" | "title"
> & {
    title: string;
    startValue: number;
    changes: readonly WaterfallChange[];
    description?: string;
    startLabel?: string;
    endLabel?: string;
    unit?: string;
    formatValue?: (value: number) => string;
    variant?: "panel" | "plain";
    emptyText?: string;
};

type WaterfallBar = {
    id: string;
    label: string;
    from: number;
    to: number;
    value: number | null;
    kind: "total" | "increase" | "decrease" | "unchanged";
};

function WaterfallChart({
    title,
    startValue,
    changes,
    description,
    startLabel = "시작",
    endLabel = "최종",
    unit = "",
    formatValue = String,
    variant = "panel",
    emptyText = "표시할 변화 항목이 없습니다.",
    className,
    ...props
}: WaterfallChartProps) {
    if (typeof title !== "string" || !title.trim()) {
        throw new Error("WaterfallChart requires a title.");
    }
    if (!Number.isFinite(startValue)) {
        throw new RangeError("WaterfallChart startValue must be finite.");
    }
    if (!Array.isArray(changes)) {
        throw new TypeError("WaterfallChart changes must be an array.");
    }
    if (typeof formatValue !== "function") {
        throw new TypeError("WaterfallChart formatValue must be a function.");
    }
    if ([startLabel, endLabel, emptyText].some((value) =>
        typeof value !== "string" || !value.trim()
    )) {
        throw new Error("WaterfallChart requires labels and empty text.");
    }
    if (variant !== "panel" && variant !== "plain") {
        throw new RangeError("WaterfallChart variant is not supported.");
    }

    const ids = new Set<string>();
    const bars: WaterfallBar[] = [{
        id: "start", label: startLabel, from: 0, to: startValue,
        value: null, kind: "total",
    }];
    let running = startValue;
    for (const change of changes) {
        if (!change || typeof change.id !== "string" ||
            !change.id.trim() || typeof change.label !== "string" ||
            !change.label.trim() || !Number.isFinite(change.value)) {
            throw new Error(
                "WaterfallChart changes need an id, label and finite value.",
            );
        }
        if (ids.has(change.id)) {
            throw new Error(`WaterfallChart id is duplicated: ${change.id}`);
        }
        ids.add(change.id);
        const next = running + change.value;
        if (!Number.isFinite(next)) {
            throw new RangeError("WaterfallChart cumulative value overflowed.");
        }
        bars.push({
            id: change.id, label: change.label, from: running, to: next,
            value: change.value,
            kind: change.value > 0 ? "increase" :
                change.value < 0 ? "decrease" : "unchanged",
        });
        running = next;
    }
    bars.push({
        id: "end", label: endLabel, from: 0, to: running,
        value: null, kind: "total",
    });

    function formatted(value: number) {
        const text = formatValue(value);
        if (typeof text !== "string" || !text.trim()) {
            throw new Error("WaterfallChart formatted values must be text.");
        }
        return text + unit;
    }
    const rows = bars.map((bar) => ({
        ...bar,
        changeText: bar.value === null ? "—" :
            `${bar.value > 0 ? "+" : ""}${formatted(bar.value)}`,
        totalText: formatted(bar.to),
    }));

    let low = 0;
    let high = 0;
    for (const bar of bars) {
        low = Math.min(low, bar.from, bar.to);
        high = Math.max(high, bar.from, bar.to);
    }
    const span = high - low;
    const padding = span === 0 ? 1 : span * 0.08;
    const minimum = low - padding;
    const maximum = high + padding;
    const range = maximum - minimum;
    if (!Number.isFinite(range) || range <= 0) {
        throw new RangeError("WaterfallChart range is not finite.");
    }

    const plotTop = 12;
    const plotHeight = 148;
    const columnWidth = 88;
    const barWidth = 38;
    const width = Math.max(360, bars.length * columnWidth + 32);
    const y = (value: number) =>
        plotTop + (maximum - value) / range * plotHeight;
    const x = (index: number) => 28 + index * columnWidth;
    const color = {
        total: "var(--accent)",
        increase: "var(--success)",
        decrease: "var(--danger)",
        unchanged: "var(--muted)",
    } as const;

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
                {description && <span className="mt-1 block text-xs text-muted">
                    {description}
                </span>}
            </figcaption>
            {changes.length === 0 ? (
                <p className="m-0 text-sm text-muted">{emptyText}</p>
            ) : <>
                <div className="overflow-x-auto" aria-hidden="true">
                    <svg viewBox={`0 0 ${width} 204`} width={width}
                        height="204" className="block min-w-full">
                        <line x1="16" x2={width - 16} y1={y(0)} y2={y(0)}
                            stroke="var(--border)" strokeDasharray="4 3" />
                        {bars.map((bar, index) => {
                            const upper = Math.min(y(bar.from), y(bar.to));
                            const height = Math.max(
                                2, Math.abs(y(bar.from) - y(bar.to)),
                            );
                            return <g key={`${bar.kind}-${bar.id}`}>
                                <rect x={x(index)} y={upper} width={barWidth}
                                    height={height} rx="2"
                                    fill={color[bar.kind]} />
                                {index < bars.length - 1 && <line
                                    x1={x(index) + barWidth}
                                    x2={x(index + 1)} y1={y(bar.to)}
                                    y2={y(bar.to)} stroke="var(--border)" />}
                                <text x={x(index) + barWidth / 2} y="188"
                                    textAnchor="middle" fill="var(--muted)"
                                    fontSize="11">
                                    {Array.from(bar.label).length > 7
                                        ? `${Array.from(bar.label)
                                            .slice(0, 6).join("")}…`
                                        : bar.label}
                                </text>
                            </g>;
                        })}
                    </svg>
                </div>
                <div className={
                    "mt-[var(--space-2)] flex flex-wrap gap-x-4 gap-y-1 " +
                    "text-xs text-muted"
                }>
                    {([
                        ["총계", "bg-accent"],
                        ["증가", "bg-success"],
                        ["감소", "bg-danger"],
                        ["변화 없음", "bg-muted"],
                    ] as const).map(([label, colorClass]) => (
                        <span key={label} className="inline-flex items-center gap-1">
                            <span aria-hidden="true" className={cn(
                                "size-2 rounded-sm", colorClass,
                            )} />
                            {label}
                        </span>
                    ))}
                </div>
                <div className="mt-[var(--space-3)] overflow-x-auto">
                    <table className="w-full min-w-72 text-left text-xs">
                        <caption className="sr-only">{title} 상세 값</caption>
                        <thead>
                            <tr className="border-b border-border text-muted">
                                <th scope="col" className="py-2 pr-3">항목</th>
                                <th scope="col" className="py-2 pr-3">증감</th>
                                <th scope="col" className="py-2">누적</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row) => <tr key={
                                `${row.kind}-${row.id}`
                            } className="border-b border-border last:border-0">
                                <th scope="row" className={
                                    "break-words py-2 pr-3 font-medium"
                                }>{row.label}</th>
                                <td className="py-2 pr-3 tabular-nums">
                                    {row.changeText}
                                </td>
                                <td className="py-2 tabular-nums">
                                    {row.totalText}
                                </td>
                            </tr>)}
                        </tbody>
                    </table>
                </div>
            </>}
        </figure>
    );
}

export { WaterfallChart };
export type { WaterfallChange, WaterfallChartProps };
