import type { ComponentProps } from "react";
import { cn } from "./utils";

type DonutSegment = { label: string; value: number };

type DonutChartProps = Omit<ComponentProps<"figure">, "children" | "title"> & {
    title: string;
    description?: string;
    segments: readonly DonutSegment[];
    unit?: string;
    totalLabel?: string;
    formatValue?: (value: number) => string;
};

const colors = [
    "var(--accent)",
    "color-mix(in srgb, var(--accent) 65%, var(--foreground))",
    "color-mix(in srgb, var(--accent) 65%, var(--surface))",
    "color-mix(in srgb, var(--foreground) 55%, var(--surface))",
    "color-mix(in srgb, var(--accent) 40%, var(--foreground))",
    "color-mix(in srgb, var(--accent) 35%, var(--surface))",
];

function DonutChart({
    title,
    description,
    segments,
    unit = "",
    totalLabel = "Total",
    formatValue = String,
    className,
    ...props
}: DonutChartProps) {
    if (segments.some(({ label, value }) =>
        !label.trim() || !Number.isFinite(value) || value < 0
    )) {
        throw new RangeError(
            "DonutChart requires labels and finite, nonnegative values.",
        );
    }
    const total = segments.reduce((sum, segment) => sum + segment.value, 0);
    if (!Number.isFinite(total)) {
        throw new RangeError("DonutChart total must be finite.");
    }

    const circumference = 2 * Math.PI * 72;
    let offset = 0;

    return (
        <figure
            className={cn(
                "@container m-0 min-w-0 rounded-sm border border-border " +
                "bg-surface p-[var(--space-4)] text-foreground",
                className,
            )}
            {...props}
        >
            <figcaption className="mb-[var(--space-3)]">
                <strong className="text-sm font-semibold">{title}</strong>
                {description && (
                    <span className="mt-1 block text-xs text-muted">
                        {description}
                    </span>
                )}
            </figcaption>
            {total === 0 ? (
                <p role="status" className="m-0 py-12 text-center text-sm text-muted">
                    표시할 데이터가 없습니다.
                </p>
            ) : (
                <div className={
                    "grid items-center gap-[var(--space-4)] " +
                    "@md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)]"
                }>
                    <div className="relative mx-auto size-48">
                        <svg viewBox="0 0 200 200" aria-hidden="true"
                            className="size-full">
                            <circle cx="100" cy="100" r="72" fill="none"
                                stroke="var(--surface-subtle)"
                                strokeWidth="24" />
                            {segments.map((segment, index) => {
                                const length = segment.value / total * circumference;
                                const start = offset;
                                offset += length;
                                if (segment.value === 0) return null;
                                return (
                                    <circle key={index} cx="100" cy="100" r="72"
                                        fill="none" stroke={colors[index % colors.length]}
                                        strokeWidth="24"
                                        strokeDasharray={`${length} ${circumference - length}`}
                                        strokeDashoffset={-start}
                                        transform="rotate(-90 100 100)" />
                                );
                            })}
                        </svg>
                        <div className={
                            "absolute inset-0 flex flex-col items-center " +
                            "justify-center px-8 text-center"
                        }>
                            <span className="text-xs text-muted">{totalLabel}</span>
                            <strong className="max-w-full truncate text-lg">
                                {formatValue(total)}{unit}
                            </strong>
                        </div>
                    </div>
                    <ul className="m-0 grid min-w-0 list-none gap-2 p-0">
                        {segments.map((segment, index) => {
                            const share = segment.value / total * 100;
                            const percent = share > 0 && share < 0.05
                                ? "<0.1" : String(
                                    Math.round(segment.value / total * 1000) / 10,
                                );
                            return (
                                <li key={index} className={
                                    "grid min-w-0 grid-cols-[auto_minmax(0,1fr)_auto] " +
                                    "items-center gap-2 text-sm"
                                }>
                                    <span aria-hidden="true"
                                        className="size-2.5 rounded-full"
                                        style={{ background: colors[index % colors.length] }} />
                                    <span className="min-w-0 truncate"
                                        title={segment.label}>
                                        {segment.label}
                                    </span>
                                    <span className="text-right tabular-nums">
                                        {formatValue(segment.value)}{unit}
                                        <span className="ml-1 text-xs text-muted">
                                            ({percent}%)
                                        </span>
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </figure>
    );
}

export { DonutChart };
export type { DonutSegment, DonutChartProps };
