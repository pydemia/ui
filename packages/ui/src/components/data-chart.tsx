import { useId, useState, type ComponentProps } from "react";
import { cn } from "./utils";

type ChartPoint = { label: string; value: number | null };
type ChartSeries = {
    id: string;
    label: string;
    values: readonly (number | null)[];
};

type DataChartBaseProps = Omit<
    ComponentProps<"figure">, "children" | "title"
> & {
    title: string;
    description?: string;
    variant?: "line" | "bar" | "area" | "stacked-bar" |
        "stacked-area";
    inspectable?: boolean;
    unit?: string;
    formatValue?: (value: number) => string;
};

type DataChartProps = DataChartBaseProps & (
    | {
        points: readonly ChartPoint[];
        categories?: never;
        series?: never;
        toggleableSeries?: never;
    }
    | {
        points?: never;
        categories: readonly string[];
        series: readonly ChartSeries[];
        toggleableSeries?: boolean;
    }
);

const colors = [
    "var(--accent)",
    "color-mix(in srgb, var(--accent) 45%, var(--danger))",
    "color-mix(in srgb, var(--accent) 52%, var(--surface))",
    "color-mix(in srgb, var(--foreground) 65%, var(--surface))",
];
const dashPatterns = [undefined, "7 4", "2 3", "10 3 2 3"];

function DataChart({
    title,
    description,
    points,
    categories,
    series,
    toggleableSeries = false,
    variant = "line",
    inspectable = false,
    unit = "",
    formatValue = String,
    className,
    ...props
}: DataChartProps) {
    const inspectorId = useId();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [hiddenSeriesIds, setHiddenSeriesIds] = useState<Set<string>>(
        () => new Set(),
    );

    if (!["line", "bar", "area", "stacked-bar", "stacked-area"]
        .includes(variant)) {
        throw new RangeError("DataChart variant is not supported.");
    }
    const inputPoints = points;
    if (points === undefined) {
        if (!Array.isArray(categories) || !Array.isArray(series)) {
            throw new Error(
                "DataChart requires points or categories and series.",
            );
        }
    } else if (!Array.isArray(points) || categories !== undefined ||
        series !== undefined) {
        throw new Error(
            "DataChart accepts points or categories and series, not both.",
        );
    }
    const labels = inputPoints?.map((point) => point.label) ?? categories ?? [];
    const inspectedIndex = Math.min(
        selectedIndex, Math.max(0, labels.length - 1),
    );
    const inspectedLabel = labels[inspectedIndex]?.trim() ||
        `구간 ${inspectedIndex + 1}`;
    const allSeries: readonly ChartSeries[] = series ?? [{
        id: "value", label: "값",
        values: inputPoints?.map((point) => point.value) ?? [],
    }];
    if (series) {
        if (labels.some((label) => !label.trim()) ||
            (labels.length > 0 && series.length === 0)) {
            throw new Error("DataChart requires named categories and series.");
        }
        const ids = new Set<string>();
        for (const item of series) {
            if (!item.id.trim() || !item.label.trim() ||
                ids.has(item.id) || item.values.length !== labels.length) {
                throw new Error(
                    "DataChart series require unique IDs, labels, " +
                    "and one value per category.",
                );
            }
            ids.add(item.id);
        }
    }
    const allValues = allSeries.flatMap((item) => item.values);
    if (allValues.some((value) =>
        value !== null && !Number.isFinite(value)
    )) {
        throw new RangeError("DataChart values must be finite numbers or null.");
    }
    if (variant === "stacked-area" && allValues.some((value) =>
        value !== null && value < 0
    )) {
        throw new RangeError(
            "DataChart stacked area values must be non-negative.",
        );
    }
    const chartSeries = allSeries.filter((item) =>
        !toggleableSeries || !hiddenSeriesIds.has(item.id),
    );
    const colorIndexBySeries = chartSeries.map((item) =>
        allSeries.indexOf(item),
    );
    const seriesColors = colorIndexBySeries.map((index) =>
        colors[index % colors.length],
    );
    const seriesDashPatterns = colorIndexBySeries.map((index) =>
        dashPatterns[index % dashPatterns.length],
    );
    const values = chartSeries.flatMap((item) => item.values);

    const positiveTotals = labels.map(() => 0);
    const negativeTotals = labels.map(() => 0);
    const stackedBars = variant === "stacked-bar"
        ? chartSeries.map((item) => item.values.map((value, index) => {
            if (value === null) return null;
            const totals = value >= 0 ? positiveTotals : negativeTotals;
            const start = totals[index];
            const end = start + value;
            totals[index] = end;
            return { start, end, value };
        }))
        : [];
    if ([...positiveTotals, ...negativeTotals].some((total) =>
        !Number.isFinite(total)
    )) {
        throw new RangeError("DataChart stacked totals must be finite.");
    }

    const stackedAreaLevels = variant === "stacked-area"
        ? labels.map((_, index) => {
            const levels = [0];
            for (const item of chartSeries) {
                const value = item.values[index];
                if (value === null) return null;
                const total = levels[levels.length - 1] + value;
                if (!Number.isFinite(total)) {
                    throw new RangeError(
                        "DataChart stacked totals must be finite.",
                    );
                }
                levels.push(total);
            }
            return levels;
        })
        : [];
    const stackedAreaTotals = stackedAreaLevels.map((levels) =>
        levels === null ? null : levels[levels.length - 1],
    );

    const present = values.filter((value): value is number => value !== null);
    let minimum = Infinity;
    let maximum = -Infinity;
    for (const value of present) {
        minimum = Math.min(minimum, value);
        maximum = Math.max(maximum, value);
    }
    if (present.length === 0) {
        minimum = 0;
        maximum = 0;
    }
    if (variant === "stacked-bar") {
        minimum = 0;
        maximum = 0;
        for (const total of negativeTotals) {
            minimum = Math.min(minimum, total);
        }
        for (const total of positiveTotals) {
            maximum = Math.max(maximum, total);
        }
    } else if (variant === "stacked-area") {
        minimum = 0;
        maximum = 1;
        for (const total of stackedAreaTotals) {
            if (total !== null) maximum = Math.max(maximum, total);
        }
    } else if (variant === "bar" || variant === "area") {
        minimum = Math.min(0, minimum);
        maximum = Math.max(0, maximum);
    }
    if (minimum === maximum) {
        const padding = Math.max(1, Math.abs(minimum) * 0.1);
        const paddedMinimum = minimum - padding;
        const paddedMaximum = maximum + padding;
        if (Number.isFinite(paddedMinimum) &&
            Number.isFinite(paddedMaximum)) {
            minimum = paddedMinimum;
            maximum = paddedMaximum;
        }
    }

    const slotWidth = variant === "stacked-bar"
        ? 64 : Math.max(56, chartSeries.length * 22);
    const width = Math.max(360, labels.length * slotWidth + 64);
    const left = 48;
    const right = width - 16;
    const top = 20;
    const bottom = 210;
    const plotWidth = right - left;
    const x = (index: number) =>
        left + (index + 0.5) * plotWidth / labels.length;
    const range = maximum - minimum;
    const halfRange = maximum / 2 - minimum / 2;
    const y = (value: number) => {
        if (minimum === maximum) return (top + bottom) / 2;
        const fraction = Number.isFinite(range)
            ? (value - minimum) / range
            : (value / 2 - minimum / 2) / halfRange;
        return bottom - fraction * (bottom - top);
    };
    const zeroY = y(0);
    const groupWidth = Math.min(
        plotWidth / labels.length * 0.72,
        chartSeries.length * 32,
    );
    const barSlot = groupWidth / Math.max(1, chartSeries.length);
    const stackWidth = Math.min(plotWidth / labels.length * 0.62, 44);
    const labelStep = Math.max(1, Math.ceil(labels.length / 8));
    const paths = chartSeries.map((item) => {
        let line = "";
        let drawing = false;
        let segmentStart = -1;
        let segment = "";
        const areas: string[] = [];
        for (let index = 0; index < item.values.length; index += 1) {
            const value = item.values[index];
            if (value === null) {
                if (segmentStart >= 0) {
                    areas.push(
                        `${segment} L${x(index - 1)} ${zeroY} ` +
                        `L${x(segmentStart)} ${zeroY} Z`,
                    );
                    segmentStart = -1;
                    segment = "";
                }
                drawing = false;
                continue;
            }
            line += `${drawing ? " L" : " M"}${x(index)} ${y(value)}`;
            if (segmentStart < 0) segmentStart = index;
            segment += `${index === segmentStart ? "M" : " L"}` +
                `${x(index)} ${y(value)}`;
            drawing = true;
        }
        if (segmentStart >= 0) {
            areas.push(
                `${segment} L${x(item.values.length - 1)} ${zeroY} ` +
                `L${x(segmentStart)} ${zeroY} Z`,
            );
        }
        return { line, areas };
    });
    const stackedAreaRuns = variant === "stacked-area"
        ? chartSeries.map((_, seriesIndex) => {
            const runs: {
                start: number;
                end: number;
                area: string;
                line: string;
            }[] = [];
            let index = 0;
            while (index < labels.length) {
                if (stackedAreaLevels[index] === null) {
                    index += 1;
                    continue;
                }
                const start = index;
                while (index < labels.length &&
                    stackedAreaLevels[index] !== null) {
                    index += 1;
                }
                const end = index - 1;
                if (end === start) continue;
                const upper = Array.from(
                    { length: end - start + 1 },
                    (_, offset) => {
                        const category = start + offset;
                        return `${x(category)} ${y(
                            stackedAreaLevels[category]![seriesIndex + 1],
                        )}`;
                    },
                );
                const lower = Array.from(
                    { length: end - start + 1 },
                    (_, offset) => {
                        const category = end - offset;
                        return `${x(category)} ${y(
                            stackedAreaLevels[category]![seriesIndex],
                        )}`;
                    },
                );
                runs.push({
                    start, end,
                    area: `M${upper.join(" L")} L${lower.join(" L")} Z`,
                    line: `M${upper.join(" L")}`,
                });
            }
            return runs;
        })
        : [];
    const hasRenderableData = chartSeries.length > 0 && (
        variant === "stacked-area"
        ? stackedAreaLevels.some((levels) => levels !== null)
        : present.length > 0
    );

    return (
        <figure
            className={cn(
                "m-0 min-w-0 rounded-sm border border-border " +
                "bg-surface p-[var(--space-4)] text-foreground",
                className,
            )}
            {...props}
        >
            <figcaption className="mb-[var(--space-3)]">
                <div className="flex items-baseline justify-between gap-2">
                    <strong className="text-sm font-semibold">{title}</strong>
                    {unit && <span className="text-xs text-muted">{unit}</span>}
                </div>
                {description && (
                    <span className="mt-1 block text-xs text-muted">
                        {description}
                    </span>
                )}
            </figcaption>
            {!hasRenderableData ? (
                <p role="status" className="m-0 py-12 text-center text-sm text-muted">
                    {chartSeries.length === 0 && series?.length
                        ? "표시할 계열을 선택하세요."
                        : variant === "stacked-area" && present.length > 0
                        ? "누적 영역을 표시할 완전한 구간이 없습니다."
                        : "표시할 데이터가 없습니다."}
                </p>
            ) : (
                <>
                    <div className="min-w-0 overflow-x-auto">
                        <svg
                            viewBox={`0 0 ${width} 260`}
                            aria-hidden="true"
                            className="block h-auto w-full"
                            style={{ minWidth: width }}
                        >
                            {[0, 0.5, 1].map((fraction) => {
                                const value = minimum * (1 - fraction) +
                                    maximum * fraction;
                                const rowY = y(value);
                                return (
                                    <g key={fraction}>
                                        <line x1={left} x2={right}
                                            y1={rowY} y2={rowY}
                                            stroke="var(--border)" />
                                        <text x={left - 8} y={rowY + 4}
                                            textAnchor="end" fontSize="11"
                                            fill="var(--muted)">
                                            {formatValue(value)}
                                        </text>
                                    </g>
                                );
                            })}
                            {inspectable && labels.length > 0 && (
                                <line x1={x(inspectedIndex)}
                                    x2={x(inspectedIndex)} y1={top} y2={bottom}
                                    stroke="var(--focus)" strokeOpacity="0.55"
                                    strokeDasharray="4 4" />
                            )}
                            {variant === "area" && chartSeries.map(
                                (item, seriesIndex) => paths[seriesIndex].areas.map(
                                    (path, segmentIndex) => (
                                        <path key={`${item.id}-${segmentIndex}`}
                                            d={path}
                                            fill={seriesColors[seriesIndex]}
                                            fillOpacity="0.13" />
                                    ),
                                ),
                            )}
                            {variant === "stacked-area" && chartSeries.map(
                                (item, seriesIndex) => (
                                    <g key={item.id} data-series={item.id}>
                                        {stackedAreaRuns[seriesIndex].map(
                                            (run) => (
                                                <g key={run.start}>
                                                    <path
                                                        data-start-category={
                                                            labels[run.start]}
                                                        data-end-category={
                                                            labels[run.end]}
                                                        d={run.area}
                                                        fill={seriesColors[
                                                            seriesIndex]}
                                                        fillOpacity="0.52" />
                                                    <path d={run.line}
                                                        fill="none"
                                                        stroke={seriesColors[
                                                            seriesIndex]}
                                                        strokeWidth="2" />
                                                </g>
                                            ),
                                        )}
                                        {stackedAreaLevels.map((levels, index) =>
                                            levels === null ? null : (
                                                <circle key={index}
                                                    data-category={labels[index]}
                                                    cx={x(index)}
                                                    cy={y(levels[
                                                        seriesIndex + 1])}
                                                    r="3"
                                                    fill={seriesColors[
                                                        seriesIndex]} />
                                            ))}
                                    </g>
                                ),
                            )}
                            {(variant === "line" || variant === "area") &&
                                chartSeries.map((item, seriesIndex) => (
                                    <g key={item.id} data-series={item.id}>
                                        <path d={paths[seriesIndex].line}
                                            fill="none"
                                            stroke={seriesColors[seriesIndex]}
                                            strokeWidth="2.5"
                                            strokeDasharray={seriesDashPatterns[
                                                seriesIndex]}
                                            strokeLinejoin="round" />
                                        {item.values.map((value, index) =>
                                            value === null ? null : (
                                                <circle key={index}
                                                    cx={x(index)} cy={y(value)}
                                                    r="3.5"
                                                    fill={seriesColors[
                                                        seriesIndex]} />
                                            ))}
                                    </g>
                                ))}
                            {variant === "bar" && chartSeries.map(
                                (item, seriesIndex) => (
                                    <g key={item.id} data-series={item.id}>
                                        {item.values.map((value, index) => {
                                            if (value === null) return null;
                                            const valueY = y(value);
                                            return (
                                                <rect key={index}
                                                    x={x(index) - groupWidth / 2 +
                                                        barSlot * seriesIndex + 1}
                                                    y={Math.min(valueY, zeroY)}
                                                    width={Math.max(1,
                                                        barSlot - 2)}
                                                    height={Math.max(1,
                                                        Math.abs(zeroY - valueY))}
                                                    rx="2"
                                                    fill={seriesColors[
                                                        seriesIndex]} />
                                            );
                                        })}
                                    </g>
                                ),
                            )}
                            {variant === "stacked-bar" && chartSeries.map(
                                (item, seriesIndex) => (
                                    <g key={item.id} data-series={item.id}>
                                        {stackedBars[seriesIndex].map(
                                            (segment, index) => {
                                                if (!segment || segment.value === 0) {
                                                    return null;
                                                }
                                                const startY = y(segment.start);
                                                const endY = y(segment.end);
                                                return (
                                                    <rect key={index}
                                                        data-category={labels[index]}
                                                        data-value={segment.value}
                                                        x={x(index) - stackWidth / 2}
                                                        y={Math.min(startY, endY)}
                                                        width={stackWidth}
                                                        height={Math.abs(startY - endY)}
                                                        rx="2"
                                                        fill={seriesColors[
                                                            seriesIndex]} />
                                                );
                                            },
                                        )}
                                    </g>
                                ),
                            )}
                            {labels.map((label, index) =>
                                index % labelStep === 0 ||
                                index === labels.length - 1 ? (
                                    <text key={index} x={x(index)} y="238"
                                        textAnchor="middle" fontSize="11"
                                        fill="var(--muted)">
                                        {label}
                                    </text>
                                ) : null)}
                            {inspectable && labels.map((_, index) => (
                                <rect key={index}
                                    data-category-index={index}
                                    className="cursor-crosshair"
                                    x={left + index * plotWidth / labels.length}
                                    y={top}
                                    width={plotWidth / labels.length}
                                    height={bottom - top}
                                    fill="transparent"
                                    onPointerEnter={() => setSelectedIndex(index)}
                                    onClick={() => setSelectedIndex(index)} />
                            ))}
                        </svg>
                    </div>
                </>
            )}
            {series && series.length > 0 &&
                (toggleableSeries || hasRenderableData) && (
                <ul aria-label={toggleableSeries ? "계열 표시" : "계열"}
                    className={
                        "m-0 mt-[var(--space-3)] flex list-none " +
                        "flex-wrap gap-x-4 gap-y-2 p-0 text-xs"
                    }>
                    {series.map((item, index) => {
                        const marker = variant === "bar" ||
                            variant === "stacked-bar" ||
                            variant === "stacked-area" ? (
                            <span aria-hidden="true"
                                className="inline-block size-3 shrink-0"
                                style={{ background: colors[index %
                                    colors.length] }} />
                        ) : (
                            <svg aria-hidden="true" width="20"
                                height="8" viewBox="0 0 20 8">
                                <line x1="0" x2="20" y1="4" y2="4"
                                    stroke={colors[index % colors.length]}
                                    strokeWidth="3"
                                    strokeDasharray={dashPatterns[
                                        index % dashPatterns.length
                                    ]} />
                            </svg>
                        );
                        return (
                            <li key={item.id}>
                                {toggleableSeries ? (
                                    <label className={
                                        "flex min-w-0 cursor-pointer " +
                                        "items-center gap-2"
                                    }>
                                        <input type="checkbox"
                                            checked={!hiddenSeriesIds.has(
                                                item.id,
                                            )}
                                            onChange={() => {
                                                setHiddenSeriesIds((current) => {
                                                    const next = new Set(current);
                                                    if (next.has(item.id)) {
                                                        next.delete(item.id);
                                                    } else {
                                                        next.add(item.id);
                                                    }
                                                    return next;
                                                });
                                            }}
                                            className={
                                                "size-4 shrink-0 " +
                                                "accent-[var(--accent)]"
                                            } />
                                        {marker}
                                        <span>{item.label}</span>
                                    </label>
                                ) : (
                                    <span className={
                                        "flex min-w-0 items-center gap-2"
                                    }>
                                        {marker}
                                        <span>{item.label}</span>
                                    </span>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
            {inspectable && labels.length > 0 &&
                chartSeries.length > 0 && (
                <div className={
                    "mt-[var(--space-3)] border-t border-border " +
                    "pt-[var(--space-3)]"
                }>
                    <div className="flex flex-wrap items-center gap-2">
                        <label htmlFor={inspectorId}
                            className="text-xs font-medium text-muted">
                            구간 확인
                        </label>
                        <select id={inspectorId} value={inspectedIndex}
                            onChange={(event) => setSelectedIndex(
                                Number(event.target.value),
                            )}
                            className={
                                "h-[var(--control-height)] min-w-28 " +
                                "rounded-sm border border-border bg-surface " +
                                "px-[var(--space-2)] text-sm text-foreground " +
                                "focus-visible:outline-2 " +
                                "focus-visible:outline-focus"
                            }>
                            {labels.map((label, index) => (
                                <option key={index} value={index}>
                                    {label.trim() || `구간 ${index + 1}`}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div role="group" aria-label={`${inspectedLabel} 값`}>
                        <dl className={
                            "m-0 mt-[var(--space-3)] grid gap-2 " +
                            "text-sm sm:grid-cols-2"
                        }>
                            {chartSeries.map((item) => {
                                const value = item.values[inspectedIndex];
                                return (
                                    <div key={item.id}
                                        className="flex justify-between gap-3">
                                        <dt className="min-w-0 text-muted">
                                            {item.label}
                                        </dt>
                                        <dd className={
                                            "m-0 shrink-0 font-medium " +
                                            "tabular-nums"
                                        }>
                                            {value === null
                                                ? "데이터 없음"
                                                : `${formatValue(value)}${unit}`}
                                        </dd>
                                    </div>
                                );
                            })}
                            {variant === "stacked-area" &&
                                chartSeries.length > 0 && (
                                <div className="flex justify-between gap-3">
                                    <dt className="min-w-0 text-muted">
                                        합계
                                    </dt>
                                    <dd className={
                                        "m-0 shrink-0 font-medium tabular-nums"
                                    }>
                                        {stackedAreaTotals[inspectedIndex] ===
                                            null
                                            ? "데이터 없음"
                                            : `${formatValue(
                                                stackedAreaTotals[
                                                    inspectedIndex] as number,
                                            )}${unit}`}
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>
                </div>
            )}
            {labels.length > 0 && chartSeries.length > 0 && (
                <table className="sr-only">
                    <caption>{title} 데이터</caption>
                    <thead><tr><th scope="col">구간</th>
                        {chartSeries.map((item) => (
                            <th key={item.id} scope="col">{item.label}</th>
                        ))}
                        {variant === "stacked-area" &&
                            chartSeries.length > 0 && (
                            <th scope="col">합계</th>
                        )}
                    </tr></thead>
                    <tbody>
                        {labels.map((label, index) => (
                            <tr key={index}>
                                <th scope="row">
                                    {label.trim() || `구간 ${index + 1}`}
                                </th>
                                {chartSeries.map((item) => (
                                    <td key={item.id}>
                                        {item.values[index] === null
                                            ? "데이터 없음"
                                            : `${formatValue(
                                                item.values[index] as number,
                                            )}${unit}`}
                                    </td>
                                ))}
                                {variant === "stacked-area" &&
                                    chartSeries.length > 0 && (
                                    <td>
                                        {stackedAreaTotals[index] === null
                                            ? "데이터 없음"
                                            : `${formatValue(
                                                stackedAreaTotals[
                                                    index] as number,
                                            )}${unit}`}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </figure>
    );
}

export { DataChart };
export type { DataChartProps, ChartPoint, ChartSeries };
