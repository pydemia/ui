import { useId, useState, type ComponentProps } from "react";
import { cn } from "./utils";

type ScatterPoint = {
    id: string;
    label: string;
    x: number | null;
    y: number | null;
};

type ScatterChartProps = Omit<
    ComponentProps<"figure">, "children" | "title" | "onSelect"
> & {
    title: string;
    description?: string;
    xLabel: string;
    yLabel: string;
    xUnit?: string;
    yUnit?: string;
    points: readonly ScatterPoint[];
    xDomain?: readonly [number, number];
    yDomain?: readonly [number, number];
    selectedId?: string | null;
    onPointSelect?: (point: ScatterPoint) => void;
    formatX?: (value: number) => string;
    formatY?: (value: number) => string;
};

const plotLeft = 70;
const plotRight = 530;
const plotTop = 22;
const plotBottom = 254;

function axisDomain(
    values: readonly number[],
    supplied: readonly [number, number] | undefined,
    name: string,
): readonly [number, number] {
    if (supplied !== undefined) {
        if (!Array.isArray(supplied) || supplied.length !== 2 ||
            !Number.isFinite(supplied[0]) ||
            !Number.isFinite(supplied[1]) ||
            supplied[0] >= supplied[1]) {
            throw new RangeError(
                `ScatterChart ${name} must have two increasing finite values.`,
            );
        }
        if (values.some((value) =>
            value < supplied[0] || value > supplied[1]
        )) {
            throw new RangeError(
                `ScatterChart points must fit the ${name}.`,
            );
        }
        return supplied;
    }
    if (values.length === 0) return [0, 1];
    let minimum = Infinity;
    let maximum = -Infinity;
    for (const value of values) {
        minimum = Math.min(minimum, value);
        maximum = Math.max(maximum, value);
    }
    if (minimum === maximum) {
        const padding = minimum === 0 ? 1 : Math.abs(minimum) * 0.1;
        if (padding > 0 &&
            Number.isFinite(minimum - padding) &&
            Number.isFinite(maximum + padding) &&
            minimum - padding < maximum + padding) {
            minimum -= padding;
            maximum += padding;
        } else if (minimum > 0) {
            minimum /= 2;
        } else {
            maximum /= 2;
        }
    }
    return [minimum, maximum];
}

function axisFraction(value: number, domain: readonly [number, number]) {
    const [minimum, maximum] = domain;
    const span = maximum - minimum;
    return Number.isFinite(span)
        ? (value - minimum) / span
        : (value / 2 - minimum / 2) /
            (maximum / 2 - minimum / 2);
}

function axisTick(domain: readonly [number, number], fraction: number) {
    return domain[0] * (1 - fraction) + domain[1] * fraction;
}

function ScatterChart({
    title,
    description,
    xLabel,
    yLabel,
    xUnit = "",
    yUnit = "",
    points,
    xDomain,
    yDomain,
    selectedId,
    onPointSelect,
    formatX = String,
    formatY = String,
    className,
    ...props
}: ScatterChartProps) {
    const selectId = useId();
    const [localSelectedId, setLocalSelectedId] = useState<string | null>(null);

    if (![title, xLabel, yLabel].every((value) =>
        typeof value === "string" && value.trim()
    )) {
        throw new Error("ScatterChart needs a title and both axis labels.");
    }
    if (!Array.isArray(points)) {
        throw new Error("ScatterChart points must be a list.");
    }
    if (selectedId !== undefined && !onPointSelect) {
        throw new Error(
            "ScatterChart controlled selection needs onPointSelect.",
        );
    }
    const ids = new Set<string>();
    for (const point of points) {
        if (!point || typeof point !== "object" ||
            typeof point.id !== "string" || !point.id.trim() ||
            typeof point.label !== "string" || !point.label.trim() ||
            ids.has(point.id)) {
            throw new Error(
                "ScatterChart points need unique IDs and labels.",
            );
        }
        if ((point.x !== null && !Number.isFinite(point.x)) ||
            (point.y !== null && !Number.isFinite(point.y))) {
            throw new RangeError(
                "ScatterChart coordinates must be finite numbers or null.",
            );
        }
        ids.add(point.id);
    }
    const plotted = points.filter((point): point is ScatterPoint & {
        x: number; y: number;
    } => point.x !== null && point.y !== null);
    const xRange = axisDomain(plotted.map((point) => point.x),
        xDomain, "xDomain");
    const yRange = axisDomain(plotted.map((point) => point.y),
        yDomain, "yDomain");
    if (selectedId !== undefined && selectedId !== null &&
        !plotted.some((point) => point.id === selectedId)) {
        throw new Error(
            "ScatterChart selectedId must name a plotted point.",
        );
    }
    const activeId = selectedId === undefined
        ? plotted.some((point) => point.id === localSelectedId)
            ? localSelectedId : plotted[0]?.id
        : selectedId;
    const selected = plotted.find((point) => point.id === activeId);
    const xPosition = (value: number) => plotLeft +
        axisFraction(value, xRange) * (plotRight - plotLeft);
    const yPosition = (value: number) => plotBottom -
        axisFraction(value, yRange) * (plotBottom - plotTop);

    function selectPoint(point: ScatterPoint) {
        if (selectedId === undefined) setLocalSelectedId(point.id);
        onPointSelect?.(point);
    }

    return (
        <figure className={cn(
            "m-0 min-w-0 rounded-sm border border-border bg-surface " +
            "p-[var(--space-4)] text-foreground",
            className,
        )} {...props}>
            <figcaption className="mb-[var(--space-3)]">
                <strong className="text-sm font-semibold">{title}</strong>
                {description && <span className="mt-1 block text-xs text-muted">
                    {description}
                </span>}
            </figcaption>
            {plotted.length === 0 ? (
                <p role="status"
                    className="m-0 py-12 text-center text-sm text-muted">
                    {points.length === 0
                        ? "표시할 데이터가 없습니다."
                        : "두 좌표가 모두 있는 데이터가 없습니다."}
                </p>
            ) : (
                <>
                    <div className="min-w-0 overflow-x-auto">
                        <svg viewBox="0 0 560 310" aria-hidden="true"
                            className="block h-auto w-full"
                            style={{ minWidth: 560 }}>
                            {[0, 0.5, 1].map((fraction) => {
                                const x = plotLeft + fraction *
                                    (plotRight - plotLeft);
                                const y = plotBottom - fraction *
                                    (plotBottom - plotTop);
                                return <g key={fraction}>
                                    <line x1={x} x2={x} y1={plotTop}
                                        y2={plotBottom}
                                        stroke="var(--border)" />
                                    <line x1={plotLeft} x2={plotRight}
                                        y1={y} y2={y}
                                        stroke="var(--border)" />
                                    <text x={x} y="273" textAnchor="middle"
                                        fontSize="11" fill="var(--muted)">
                                        {formatX(axisTick(xRange, fraction))}
                                    </text>
                                    <text x="60" y={y + 4} textAnchor="end"
                                        fontSize="11" fill="var(--muted)">
                                        {formatY(axisTick(yRange, fraction))}
                                    </text>
                                </g>;
                            })}
                            {selected && <g stroke="var(--focus)"
                                strokeDasharray="4 4" opacity="0.7">
                                <line x1={xPosition(selected.x)}
                                    x2={xPosition(selected.x)}
                                    y1={plotTop} y2={plotBottom} />
                                <line x1={plotLeft} x2={plotRight}
                                    y1={yPosition(selected.y)}
                                    y2={yPosition(selected.y)} />
                            </g>}
                            {plotted.map((point) => <g key={point.id}
                                data-point-id={point.id}>
                                <circle cx={xPosition(point.x)}
                                    cy={yPosition(point.y)}
                                    r={point.id === activeId ? 7 : 5}
                                    fill="var(--accent)"
                                    stroke="var(--surface)" strokeWidth="2" />
                                <circle cx={xPosition(point.x)}
                                    cy={yPosition(point.y)} r="13"
                                    fill="transparent"
                                    className="cursor-pointer"
                                    onClick={() => selectPoint(point)}>
                                    <title>{`${point.label}: ` +
                                        `${formatX(point.x)}${xUnit}, ` +
                                        `${formatY(point.y)}${yUnit}`}</title>
                                </circle>
                            </g>)}
                            <text x="300" y="302" textAnchor="middle"
                                fontSize="12" fill="var(--foreground)">
                                {xLabel}{xUnit && ` (${xUnit})`}
                            </text>
                            <text x="15" y="138" textAnchor="middle"
                                transform="rotate(-90 15 138)" fontSize="12"
                                fill="var(--foreground)">
                                {yLabel}{yUnit && ` (${yUnit})`}
                            </text>
                        </svg>
                    </div>
                    <div className="mt-[var(--space-3)] border-t border-border
                        pt-[var(--space-3)]">
                        <label htmlFor={selectId}
                            className="text-xs font-medium text-muted">
                            데이터 확인
                        </label>
                        <select id={selectId} value={selected?.id ?? ""}
                            onChange={(event) => {
                                const point = plotted.find((item) =>
                                    item.id === event.target.value);
                                if (point) selectPoint(point);
                            }}
                            className="ml-2 h-[var(--control-height)] min-w-28
                                max-w-full rounded-sm border border-border
                                bg-surface px-[var(--space-2)] text-sm
                                text-foreground focus-visible:outline-2
                                focus-visible:outline-focus">
                            {selectedId === null &&
                                <option value="">점 선택</option>}
                            {plotted.map((point) =>
                                <option key={point.id} value={point.id}>
                                    {point.label} · {formatX(point.x)}{xUnit} /
                                    {" "}{formatY(point.y)}{yUnit}
                                </option>)}
                        </select>
                        {selected && <dl
                            aria-label={`${selected.label} 값`}
                            className="mt-[var(--space-3)] grid gap-2 text-sm
                                sm:grid-cols-2">
                            <div className="flex justify-between gap-3">
                                <dt className="text-muted">{xLabel}</dt>
                                <dd className="m-0 font-medium tabular-nums">
                                    {formatX(selected.x)}{xUnit}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-3">
                                <dt className="text-muted">{yLabel}</dt>
                                <dd className="m-0 font-medium tabular-nums">
                                    {formatY(selected.y)}{yUnit}
                                </dd>
                            </div>
                        </dl>}
                    </div>
                </>
            )}
            {points.length > 0 && <details className="mt-[var(--space-3)]">
                <summary className="cursor-pointer text-xs text-muted
                    focus-visible:outline-2 focus-visible:outline-focus">
                    데이터 표 보기
                </summary>
                <div className="mt-2 min-w-0 overflow-x-auto">
                    <table className="w-full min-w-72 text-left text-xs">
                        <caption className="sr-only">{title} 데이터</caption>
                        <thead><tr className="border-b border-border">
                            <th scope="col" className="py-2 pr-3">항목</th>
                            <th scope="col" className="py-2 pr-3">
                                {xLabel}{xUnit && ` (${xUnit})`}
                            </th>
                            <th scope="col" className="py-2">
                                {yLabel}{yUnit && ` (${yUnit})`}
                            </th>
                        </tr></thead>
                        <tbody>{points.map((point) => <tr key={point.id}
                            className="border-b border-border/60">
                            <th scope="row" className="py-2 pr-3 font-medium">
                                {point.label}
                            </th>
                            <td className="py-2 pr-3 tabular-nums">
                                {point.x === null
                                    ? "데이터 없음" : formatX(point.x)}
                            </td>
                            <td className="py-2 tabular-nums">
                                {point.y === null
                                    ? "데이터 없음" : formatY(point.y)}
                            </td>
                        </tr>)}</tbody>
                    </table>
                </div>
            </details>}
        </figure>
    );
}

export { ScatterChart };
export type { ScatterChartProps, ScatterPoint };
