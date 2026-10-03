import type { ComponentProps } from "react";
import { cn } from "./utils";

type RadarAxis = { id: string; label: string };
type RadarSeries = {
    id: string;
    label: string;
    values: readonly (number | null)[];
};

type RadarChartProps = Omit<
    ComponentProps<"figure">, "children" | "title"
> & {
    title: string;
    axes: readonly RadarAxis[];
    series: readonly RadarSeries[];
    description?: string;
    max?: number;
    unit?: string;
    formatValue?: (value: number) => string;
    variant?: "line" | "filled";
    appearance?: "panel" | "plain";
};

const colors = [
    "var(--accent)",
    "color-mix(in srgb, var(--accent) 45%, var(--danger))",
    "color-mix(in srgb, var(--accent) 52%, var(--surface))",
    "color-mix(in srgb, var(--foreground) 65%, var(--surface))",
];
const dashes = [undefined, "7 4", "2 3", "10 3 2 3"];
const centerX = 200;
const centerY = 190;
const radius = 126;

function RadarChart({
    title,
    axes,
    series,
    description,
    max = 5,
    unit = "",
    formatValue = String,
    variant = "line",
    appearance = "panel",
    className,
    ...props
}: RadarChartProps) {
    if (typeof title !== "string" || !title.trim()) {
        throw new Error("RadarChart requires a title.");
    }
    if (!Array.isArray(axes) || !Array.isArray(series)) {
        throw new TypeError("RadarChart axes and series must be arrays.");
    }
    if (axes.length > 0 && axes.length < 3) {
        throw new RangeError("RadarChart requires at least three axes.");
    }
    if (typeof max !== "number" || !Number.isFinite(max) || max <= 0) {
        throw new RangeError("RadarChart max must be finite and positive.");
    }
    if (variant !== "line" && variant !== "filled") {
        throw new RangeError("RadarChart variant is not supported.");
    }
    if (appearance !== "panel" && appearance !== "plain") {
        throw new RangeError("RadarChart appearance is not supported.");
    }
    if (typeof formatValue !== "function") {
        throw new TypeError("RadarChart formatValue must be a function.");
    }
    const chartSeries: readonly RadarSeries[] = series;

    const axisIds = new Set<string>();
    for (const axis of axes) {
        if (!axis || typeof axis.id !== "string" || !axis.id.trim() ||
            typeof axis.label !== "string" || !axis.label.trim() ||
            axisIds.has(axis.id)) {
            throw new Error("RadarChart axes need unique IDs and labels.");
        }
        axisIds.add(axis.id);
    }
    const seriesIds = new Set<string>();
    for (const item of chartSeries) {
        if (!item || typeof item.id !== "string" || !item.id.trim() ||
            typeof item.label !== "string" || !item.label.trim() ||
            seriesIds.has(item.id)) {
            throw new Error("RadarChart series need unique IDs and labels.");
        }
        if (!Array.isArray(item.values) ||
            item.values.length !== axes.length) {
            throw new Error("RadarChart values must match the axes.");
        }
        const values: readonly (number | null)[] = item.values;
        if (values.some((value) => value !== null &&
            (typeof value !== "number" || !Number.isFinite(value) ||
                value < 0 || value > max))) {
            throw new RangeError(
                "RadarChart values must be finite, in range, or null.",
            );
        }
        seriesIds.add(item.id);
    }

    const formatted = (value: number) => {
        const text = formatValue(value);
        if (typeof text !== "string" || !text.trim()) {
            throw new Error("RadarChart formatted values must be text.");
        }
        return text + unit;
    };
    const formattedValues = chartSeries.map((item) => item.values.map(
        (value) => value === null ? "데이터 없음" : formatted(value),
    ));
    const hasValues = chartSeries.some((item) => item.values.some(
        (value) => value !== null,
    ));
    const angle = (index: number) =>
        -Math.PI / 2 + index * 2 * Math.PI / axes.length;
    const point = (index: number, fraction: number) => ({
        x: centerX + Math.cos(angle(index)) * radius * fraction,
        y: centerY + Math.sin(angle(index)) * radius * fraction,
    });
    const coordinates = (fraction: number) => axes.map((_, index) => {
        const { x, y } = point(index, fraction);
        return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(" ");

    return <figure {...props} data-appearance={appearance}
        data-variant={variant} className={cn(
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
        {axes.length === 0 || chartSeries.length === 0 ? (
            <p className="m-0 text-sm text-muted">
                표시할 {axes.length === 0 ? "차원" : "계열"}이 없습니다.
            </p>
        ) : <>
            <p className="mb-[var(--space-3)] mt-0 text-xs text-muted">
                0–{formatted(max)} 범위 · {axes.length}개 차원
                {!hasValues && " · 측정값이 없습니다."}
            </p>
            <svg aria-hidden="true" viewBox="0 0 400 380"
                className="mx-auto block h-auto w-full max-w-[25rem]">
                {[0.25, 0.5, 0.75, 1].map((fraction) =>
                    <polygon key={fraction} points={coordinates(fraction)}
                        fill="none" stroke="var(--border)" />
                )}
                {axes.map((axis, index) => {
                    const end = point(index, 1);
                    const label = point(index, 1.18);
                    return <g key={axis.id}>
                        <line x1={centerX} y1={centerY}
                            x2={end.x} y2={end.y}
                            stroke="var(--border)" />
                        <text x={Math.max(75, Math.min(325, label.x))}
                            y={label.y} textAnchor="middle"
                            dominantBaseline="middle" fontSize="12"
                            fill="var(--muted)">
                            {axis.label.length > 10
                                ? `${axis.label.slice(0, 9)}…`
                                : axis.label}
                        </text>
                    </g>;
                })}
                {chartSeries.map((item, seriesIndex) => {
                    const color = colors[seriesIndex % colors.length];
                    const dash = dashes[seriesIndex % dashes.length];
                    const positions = item.values.map((value, index) =>
                        value === null ? null : point(index, value / max),
                    );
                    const complete = positions.every((position) =>
                        position !== null,
                    );
                    return <g key={item.id} data-series-id={item.id}>
                        {complete ? <polygon
                            points={positions.map((position) =>
                                `${position!.x.toFixed(2)},` +
                                position!.y.toFixed(2),
                            ).join(" ")}
                            fill={variant === "filled"
                                ? `color-mix(in srgb, ${color} 18%, ` +
                                    "transparent)"
                                : "none"}
                            stroke={color} strokeWidth="2.5"
                            strokeDasharray={dash} /> :
                            positions.map((position, index) => {
                                const next = positions[
                                    (index + 1) % positions.length
                                ];
                                return position && next ? <line key={index}
                                    x1={position.x} y1={position.y}
                                    x2={next.x} y2={next.y}
                                    stroke={color} strokeWidth="2.5"
                                    strokeDasharray={dash} /> : null;
                            })}
                        {positions.map((position, index) => position &&
                            <circle key={axes[index].id}
                                cx={position.x} cy={position.y} r="4"
                                fill={color} stroke="var(--surface)"
                                strokeWidth="1.5" />)}
                    </g>;
                })}
            </svg>
            <div className="mt-[var(--space-3)] flex flex-wrap gap-x-4 gap-y-2">
                {chartSeries.map((item, index) =>
                    <span key={item.id} className={
                        "inline-flex items-center gap-2 text-xs"
                    }>
                        <svg aria-hidden="true" width="22" height="10">
                            <line x1="1" y1="5" x2="21" y2="5"
                                stroke={colors[index % colors.length]}
                                strokeWidth="2.5"
                                strokeDasharray={
                                    dashes[index % dashes.length]
                                } />
                        </svg>
                        {item.label}
                    </span>
                )}
            </div>
            <div className="mt-[var(--space-4)] overflow-x-auto">
                <table className="w-full min-w-[20rem] text-left text-xs">
                    <caption className="sr-only">
                        {title} 차원별 정확한 값
                    </caption>
                    <thead><tr className="border-b border-border text-muted">
                        <th scope="col" className="py-2 pr-3 font-medium">
                            차원
                        </th>
                        {chartSeries.map((item) => <th key={item.id} scope="col"
                            className="py-2 pr-3 font-medium">
                            {item.label}
                        </th>)}
                    </tr></thead>
                    <tbody>{axes.map((axis, index) =>
                        <tr key={axis.id} className={
                            "border-b border-border last:border-0"
                        }>
                            <th scope="row" className={
                                "py-2 pr-3 font-medium"
                            }>{axis.label}</th>
                            {chartSeries.map((item, seriesIndex) =>
                                <td key={item.id}
                                    className="py-2 pr-3 tabular-nums">
                                    {formattedValues[seriesIndex][index]}
                                </td>)}
                        </tr>)}
                    </tbody>
                </table>
            </div>
        </>}
    </figure>;
}

export { RadarChart };
export type { RadarChartProps, RadarAxis, RadarSeries };
