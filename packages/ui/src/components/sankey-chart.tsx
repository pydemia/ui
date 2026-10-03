import type { ComponentProps } from "react";
import { cn } from "./utils";

type SankeyNode = { id: string; label: string; stage: number };
type SankeyLink = {
    id: string;
    source: string;
    target: string;
    value: number | null;
};

type SankeyChartProps = Omit<
    ComponentProps<"figure">, "children" | "title"
> & {
    title: string;
    stages: readonly string[];
    nodes: readonly SankeyNode[];
    links: readonly SankeyLink[];
    description?: string;
    unit?: string;
    formatValue?: (value: number) => string;
    variant?: "ribbon" | "line";
    appearance?: "panel" | "plain";
};

type PositionedNode = SankeyNode & {
    x: number;
    y: number;
    height: number;
    color: string;
};
type PositionedLink = SankeyLink & {
    path: string;
    thickness: number;
    color: string;
};

const colors = [
    "var(--accent)",
    "color-mix(in srgb, var(--accent) 55%, var(--success))",
    "color-mix(in srgb, var(--accent) 45%, var(--danger))",
    "color-mix(in srgb, var(--accent) 60%, var(--foreground))",
];
const chartWidth = 800;
const nodeWidth = 14;
const nodeGap = 18;

function SankeyChart({
    title, stages, nodes, links, description, unit = "",
    formatValue = String, variant = "ribbon", appearance = "panel",
    className, ...props
}: SankeyChartProps) {
    if (typeof title !== "string" || !title.trim()) {
        throw new Error("SankeyChart requires a title.");
    }
    if (!Array.isArray(stages) || stages.length < 2 || stages.length > 6 ||
        stages.some((stage) => typeof stage !== "string" || !stage.trim())) {
        throw new Error("SankeyChart needs two to six named stages.");
    }
    if (!Array.isArray(nodes) || !Array.isArray(links)) {
        throw new TypeError("SankeyChart nodes and links must be arrays.");
    }
    if (variant !== "ribbon" && variant !== "line") {
        throw new RangeError("SankeyChart variant is not supported.");
    }
    if (appearance !== "panel" && appearance !== "plain") {
        throw new RangeError("SankeyChart appearance is not supported.");
    }
    if (typeof formatValue !== "function") {
        throw new TypeError("SankeyChart formatValue must be a function.");
    }

    const nodeById = new Map<string, SankeyNode>();
    const stageNodes = stages.map(() => [] as SankeyNode[]);
    for (const node of nodes) {
        if (!node || typeof node.id !== "string" || !node.id.trim() ||
            typeof node.label !== "string" || !node.label.trim() ||
            !Number.isInteger(node.stage) || node.stage < 0 ||
            node.stage >= stages.length || nodeById.has(node.id)) {
            throw new Error(
                "SankeyChart nodes need unique IDs, labels and valid stages.",
            );
        }
        nodeById.set(node.id, node);
        stageNodes[node.stage].push(node);
    }

    const linkIds = new Set<string>();
    const incoming = new Map(nodes.map((node) => [node.id, 0]));
    const outgoing = new Map(nodes.map((node) => [node.id, 0]));
    let hasMissing = false;
    let hasPositive = false;
    const formattedLinks = links.map((link) => {
        const source = nodeById.get(link?.source);
        const target = nodeById.get(link?.target);
        if (!link || typeof link.id !== "string" || !link.id.trim() ||
            linkIds.has(link.id) || !source || !target ||
            target.stage !== source.stage + 1) {
            throw new Error(
                "SankeyChart links need unique IDs and adjacent stages.",
            );
        }
        linkIds.add(link.id);
        if (link.value === null) {
            hasMissing = true;
            return "데이터 없음";
        }
        if (typeof link.value !== "number" ||
            !Number.isFinite(link.value) || link.value < 0) {
            throw new RangeError(
                "SankeyChart values must be finite, nonnegative or null.",
            );
        }
        const nextOut = outgoing.get(source.id)! + link.value;
        const nextIn = incoming.get(target.id)! + link.value;
        if (!Number.isFinite(nextOut) || !Number.isFinite(nextIn)) {
            throw new RangeError("SankeyChart flow totals must be finite.");
        }
        outgoing.set(source.id, nextOut);
        incoming.set(target.id, nextIn);
        hasPositive ||= link.value > 0;
        const text = formatValue(link.value);
        if (typeof text !== "string" || !text.trim()) {
            throw new Error("SankeyChart formatted values must be text.");
        }
        return text + unit;
    });

    const maxNodes = Math.max(1, ...stageNodes.map((group) => group.length));
    const chartHeight = Math.max(320, 80 + maxNodes * 44);
    const plotHeight = chartHeight - 80;
    const nodeColors = new Map(nodes.map((node, index) => [
        node.id, colors[index % colors.length],
    ]));
    const weights = new Map(nodes.map((node) => [
        node.id,
        Math.max(incoming.get(node.id)!, outgoing.get(node.id)!),
    ]));
    const stageTotals = stageNodes.map((group) => {
        const total = group.reduce((sum, node) =>
            sum + weights.get(node.id)!, 0);
        if (!Number.isFinite(total)) {
            throw new RangeError("SankeyChart stage totals must be finite.");
        }
        return total;
    });
    const largestTotal = Math.max(0, ...stageTotals);
    let unitHeight = Infinity;
    stageNodes.forEach((group, index) => {
        const total = stageTotals[index];
        if (total > 0) {
            unitHeight = Math.min(unitHeight, (
                plotHeight - 10 * group.length -
                nodeGap * Math.max(0, group.length - 1)
            ) / (total / largestTotal));
        }
    });
    if (!Number.isFinite(unitHeight)) unitHeight = 0;
    const scaled = (value: number) => largestTotal === 0 ? 0 :
        value / largestTotal * unitHeight;

    const positioned = new Map<string, PositionedNode>();
    stageNodes.forEach((group, stage) => {
        const heights = group.map((node) =>
            Math.max(10, scaled(weights.get(node.id)!)));
        const totalHeight = heights.reduce((sum, height) =>
            sum + height, 0) + nodeGap * Math.max(0, group.length - 1);
        let y = 50 + (plotHeight - totalHeight) / 2;
        group.forEach((node, index) => {
            positioned.set(node.id, {
                ...node,
                x: 70 + stage * 630 / (stages.length - 1),
                y,
                height: heights[index],
                color: nodeColors.get(node.id)!,
            });
            y += heights[index] + nodeGap;
        });
    });

    const sourceOffset = new Map(nodes.map((node) => [node.id, 0]));
    const targetOffset = new Map(nodes.map((node) => [node.id, 0]));
    const positionedLinks: PositionedLink[] = [];
    for (const link of links) {
        if (link.value === null || link.value === 0) continue;
        const source = positioned.get(link.source)!;
        const target = positioned.get(link.target)!;
        const thickness = scaled(link.value);
        const sourceY = source.y + (
            source.height - scaled(outgoing.get(source.id)!)
        ) / 2 + sourceOffset.get(source.id)!;
        const targetY = target.y + (
            target.height - scaled(incoming.get(target.id)!)
        ) / 2 + targetOffset.get(target.id)!;
        sourceOffset.set(source.id, sourceOffset.get(source.id)! + thickness);
        targetOffset.set(target.id, targetOffset.get(target.id)! + thickness);
        const startX = source.x + nodeWidth;
        const endX = target.x;
        const bendX = (startX + endX) / 2;
        const path = variant === "ribbon"
            ? `M ${startX} ${sourceY} C ${bendX} ${sourceY}, ` +
                `${bendX} ${targetY}, ${endX} ${targetY} ` +
                `L ${endX} ${targetY + thickness} ` +
                `C ${bendX} ${targetY + thickness}, ` +
                `${bendX} ${sourceY + thickness}, ` +
                `${startX} ${sourceY + thickness} Z`
            : `M ${startX} ${sourceY + thickness / 2} ` +
                `C ${bendX} ${sourceY + thickness / 2}, ` +
                `${bendX} ${targetY + thickness / 2}, ` +
                `${endX} ${targetY + thickness / 2}`;
        positionedLinks.push({
            ...link, path, thickness, color: source.color,
        });
    }

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
        {links.length === 0 ? <p className="m-0 text-sm text-muted">
            표시할 경로가 없습니다.
        </p> : <>
            <p className="mb-[var(--space-3)] mt-0 text-xs text-muted">
                {stages.length}개 단계 · {links.length}개 경로
                {!hasPositive && " · 수량 있는 경로가 없습니다."}
                {hasMissing && " · 미수집 경로는 그림에서 생략했습니다."}
            </p>
            <div className="overflow-x-auto" role="region"
                aria-label={`${title} 흐름 그림`} tabIndex={0}>
                <svg aria-hidden="true"
                    viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                    className="block h-auto w-full min-w-[42rem]">
                    {stages.map((stage, index) =>
                        <text key={index} x={77 + index * 630 /
                            (stages.length - 1)} y="25"
                            textAnchor="middle" fontSize="13"
                            fontWeight="600" fill="var(--foreground)">
                            {stage.length > 15
                                ? `${stage.slice(0, 14)}…` : stage}
                        </text>)}
                    {positionedLinks.map((link) =>
                        <path key={link.id} data-link-id={link.id}
                            d={link.path} fill={variant === "ribbon"
                                ? link.color : "none"}
                            stroke={variant === "line"
                                ? link.color : "none"}
                            strokeWidth={variant === "line"
                                ? link.thickness : undefined}
                            opacity="0.55" />)}
                    {nodes.map((node) => {
                        const item = positioned.get(node.id)!;
                        return <g key={node.id} data-node-id={node.id}>
                            <rect x={item.x} y={item.y}
                                width={nodeWidth} height={item.height}
                                rx="3" fill={item.color} />
                            <text x={node.stage === stages.length - 1
                                ? item.x - 6 : item.x + nodeWidth + 6}
                                y={item.y + item.height / 2}
                                textAnchor={node.stage === stages.length - 1
                                    ? "end" : "start"}
                                dominantBaseline="middle" fontSize="11"
                                fill="var(--foreground)"
                                stroke="var(--surface)" strokeWidth="3"
                                paintOrder="stroke">
                                {node.label.length > 13
                                    ? `${node.label.slice(0, 12)}…`
                                    : node.label}
                            </text>
                        </g>;
                    })}
                </svg>
            </div>
            <div className="mt-[var(--space-4)] overflow-x-auto">
                <table className="w-full min-w-[24rem] text-left text-xs">
                    <caption className="sr-only">
                        {title} 경로별 정확한 값
                    </caption>
                    <thead><tr className="border-b border-border text-muted">
                        <th scope="col" className="py-2 pr-3 font-medium">
                            출발 단계·항목
                        </th>
                        <th scope="col" className="py-2 pr-3 font-medium">
                            도착 단계·항목
                        </th>
                        <th scope="col" className="py-2 font-medium">
                            수량
                        </th>
                    </tr></thead>
                    <tbody>{links.map((link, index) => {
                        const source = nodeById.get(link.source)!;
                        const target = nodeById.get(link.target)!;
                        return <tr key={link.id} className={
                            "border-b border-border last:border-0"
                        }>
                            <th scope="row" className="py-2 pr-3 font-medium">
                                {stages[source.stage]} · {source.label}
                            </th>
                            <td className="py-2 pr-3">
                                {stages[target.stage]} · {target.label}
                            </td>
                            <td className="py-2 tabular-nums">
                                {formattedLinks[index]}
                            </td>
                        </tr>;
                    })}</tbody>
                </table>
            </div>
        </>}
    </figure>;
}

export { SankeyChart };
export type { SankeyChartProps, SankeyNode, SankeyLink };
