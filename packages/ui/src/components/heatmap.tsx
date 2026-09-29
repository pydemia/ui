import type { ComponentProps } from "react";
import { cn } from "./utils";

type HeatmapRow = {
    id: string;
    label: string;
    values: readonly (number | null)[];
};

type HeatmapProps = Omit<ComponentProps<"div">, "children" | "title"> & {
    title: string;
    description?: string;
    columns: readonly string[];
    rows: readonly HeatmapRow[];
    density?: "compact" | "comfortable";
    unit?: string;
    formatValue?: (value: number) => string;
    emptyMessage?: string;
    minValue?: number;
    maxValue?: number;
};

function Heatmap({
    title,
    description,
    columns,
    rows,
    density = "compact",
    unit = "",
    formatValue = String,
    emptyMessage = "표시할 데이터가 없습니다.",
    minValue,
    maxValue,
    className,
    ...props
}: HeatmapProps) {
    if (!title.trim() || !Array.isArray(columns) || !Array.isArray(rows)) {
        throw new Error("Heatmap requires a title, columns, and rows.");
    }
    const dataRows: readonly HeatmapRow[] = rows;
    if (!["compact", "comfortable"].includes(density)) {
        throw new RangeError("Heatmap density is not supported.");
    }
    if (columns.some((label) => !label.trim()) ||
        new Set(columns).size !== columns.length) {
        throw new Error("Heatmap columns need unique, nonempty labels.");
    }
    if (dataRows.length > 0 && columns.length === 0) {
        throw new Error("Heatmap rows require columns.");
    }
    const rowIds = new Set<string>();
    const rowLabels = new Set<string>();
    let observedMin = 0;
    let observedMax = 0;
    let hasValue = false;
    for (const row of dataRows) {
        if (!row.id.trim() || !row.label.trim() ||
            rowIds.has(row.id) || rowLabels.has(row.label) ||
            !Array.isArray(row.values) ||
            row.values.length !== columns.length) {
            throw new Error(
                "Heatmap rows need unique IDs and labels and one " +
                "value per column.",
            );
        }
        rowIds.add(row.id);
        rowLabels.add(row.label);
        for (const value of row.values) {
            if (value === null) continue;
            if (!Number.isFinite(value)) {
                throw new RangeError(
                    "Heatmap values must be finite numbers or null.",
                );
            }
            observedMin = Math.min(observedMin, value);
            observedMax = Math.max(observedMax, value);
            hasValue = true;
        }
    }
    if ((minValue === undefined) !== (maxValue === undefined) ||
        (minValue !== undefined && maxValue !== undefined &&
            (!Number.isFinite(minValue) || !Number.isFinite(maxValue) ||
                minValue >= maxValue))) {
        throw new RangeError(
            "Heatmap requires a finite minValue below maxValue.",
        );
    }
    const minimum = minValue ?? observedMin;
    const maximum = maxValue ?? (observedMax || 1);
    if (dataRows.some((row) => row.values.some((value) =>
        value !== null && (value < minimum || value > maximum)
    ))) {
        throw new RangeError("Heatmap value is outside the range.");
    }
    const display = (value: number) => `${formatValue(value)}${unit}`;
    const intensity = (value: number) => {
        const span = maximum - minimum;
        const ratio = Number.isFinite(span)
            ? (value - minimum) / span
            : ((value / 2) - (minimum / 2)) /
                ((maximum / 2) - (minimum / 2));
        return Math.max(0, Math.min(1, ratio));
    };

    return (
        <div className={cn(
            "@container min-w-0 rounded-sm border border-border " +
            "bg-surface p-[var(--space-4)] text-foreground",
            className,
        )} {...props}>
            <div className="mb-[var(--space-3)]">
                <strong className="text-sm font-semibold">{title}</strong>
                {description && <p className="mb-0 mt-1 text-xs text-muted">
                    {description}
                </p>}
            </div>
            {dataRows.length === 0 ? (
                <p role="status" className="m-0 py-12 text-center text-sm text-muted">
                    {emptyMessage}
                </p>
            ) : (
                <>
                    <div role="region" aria-label={`${title} 데이터 표`}
                        tabIndex={0} className="max-w-full overflow-x-auto">
                        <table className="w-full border-separate border-spacing-1 text-xs">
                            <caption className="sr-only">{title}</caption>
                            <thead><tr>
                                <th scope="col" className={
                                    "sticky left-0 z-10 bg-surface p-1"
                                } />
                                {columns.map((label) => (
                                    <th key={label} scope="col" className={
                                        "whitespace-nowrap px-2 pb-1 " +
                                        "text-center font-medium text-muted"
                                    }>{label}</th>
                                ))}
                            </tr></thead>
                            <tbody>{dataRows.map((row) => (
                                <tr key={row.id}>
                                    <th scope="row" className={
                                        "sticky left-0 z-10 bg-surface " +
                                        "whitespace-nowrap pr-2 text-left " +
                                        "font-medium text-muted"
                                    }>{row.label}</th>
                                    {row.values.map((value, index) => {
                                        const ratio = value === null ? null :
                                            intensity(value);
                                        return <td key={columns[index]}
                                            data-value={value ?? undefined}
                                            data-missing={value === null || undefined}
                                            className={cn(
                                                "rounded-sm border border-border " +
                                                "text-center tabular-nums",
                                                density === "compact"
                                                    ? "h-9 min-w-9 px-1"
                                                    : "h-12 min-w-14 px-2",
                                                value === null &&
                                                    "bg-surface-subtle text-muted",
                                            )}
                                            style={ratio === null ? undefined : {
                                                backgroundColor:
                                                    `color-mix(in srgb, var(--accent) ${Math.round(8 + ratio * 44)}%, var(--surface-subtle))`,
                                            }}>
                                            {value === null ? "—" : display(value)}
                                        </td>;
                                    })}
                                </tr>
                            ))}</tbody>
                        </table>
                    </div>
                    <div className="mt-[var(--space-3)] flex flex-wrap items-center gap-2 text-xs text-muted">
                        {hasValue ? <>
                            <span>{display(minimum)}</span>
                            {[0, 1, 2, 3, 4].map((step) => (
                                <span key={step} aria-hidden="true"
                                    className="size-3 rounded-sm border border-border"
                                    style={{ backgroundColor:
                                        `color-mix(in srgb, var(--accent) ${Math.round(8 + step * 11)}%, var(--surface-subtle))`,
                                    }} />
                            ))}
                            <span>{display(maximum)}</span>
                        </> : <span>값 없음</span>}
                    </div>
                </>
            )}
        </div>
    );
}

export { Heatmap };
export type { HeatmapProps, HeatmapRow };
