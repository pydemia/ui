import type { ComponentProps } from "react";
import { cn } from "./utils";

type TreemapLeaf = {
    id: string;
    label: string;
    value: number;
    children?: never;
};

type TreemapGroup = {
    id: string;
    label: string;
    children: readonly TreemapNode[];
    value?: never;
};

type TreemapNode = TreemapLeaf | TreemapGroup;

type TreemapChartProps = Omit<
    ComponentProps<"figure">, "children" | "title"
> & {
    title: string;
    nodes: readonly TreemapNode[];
    description?: string;
    unit?: string;
    formatValue?: (value: number) => string;
    appearance?: "panel" | "plain";
};

type ResolvedNode = {
    key: string;
    label: string;
    path: string;
    value: number;
    children: readonly ResolvedNode[] | null;
};

type Rectangle = {
    x: number;
    y: number;
    width: number;
    height: number;
};

type Tile = { node: ResolvedNode; rectangle: Rectangle };

const fills = [
    "color-mix(in srgb, var(--accent) 22%, var(--surface))",
    "color-mix(in srgb, var(--accent) 34%, var(--surface))",
    "color-mix(in srgb, var(--foreground) 12%, var(--surface))",
    "color-mix(in srgb, var(--accent) 26%, var(--surface-subtle))",
];

function resolveNodes(
    nodes: readonly TreemapNode[],
    ids: readonly string[] = [],
    labels: readonly string[] = [],
    ancestors = new Set<TreemapNode>(),
): ResolvedNode[] {
    const siblingIds = new Set<string>();
    return nodes.map((node) => {
        if (!node || typeof node.id !== "string" ||
            !node.id.trim() || typeof node.label !== "string" ||
            !node.label.trim() || siblingIds.has(node.id)) {
            throw new Error(
                "TreemapChart requires named nodes with unique sibling IDs.",
            );
        }
        if (ancestors.has(node)) {
            throw new Error("TreemapChart nodes cannot contain a cycle.");
        }
        siblingIds.add(node.id);
        const pathIds = [...ids, node.id];
        const pathLabels = [...labels, node.label];
        const hasChildren = Object.hasOwn(node, "children");
        if (hasChildren) {
            if (!Array.isArray(node.children) ||
                Object.hasOwn(node, "value")) {
                throw new TypeError(
                    "TreemapChart groups require children and no value.",
                );
            }
            ancestors.add(node);
            const children = resolveNodes(
                node.children, pathIds, pathLabels, ancestors,
            );
            ancestors.delete(node);
            const value = children.reduce(
                (sum, child) => sum + child.value, 0,
            );
            if (!Number.isFinite(value)) {
                throw new RangeError("TreemapChart total must be finite.");
            }
            return {
                key: JSON.stringify(pathIds),
                label: node.label,
                path: pathLabels.join(" › "),
                value,
                children,
            };
        }
        const value = node.value;
        if (typeof value !== "number" ||
            !Number.isFinite(value) || value < 0) {
            throw new RangeError(
                "TreemapChart values must be finite and non-negative.",
            );
        }
        return {
            key: JSON.stringify(pathIds),
            label: node.label,
            path: pathLabels.join(" › "),
            value,
            children: null,
        };
    });
}

function layoutNodes(
    nodes: readonly ResolvedNode[],
    rectangle: Rectangle,
    tiles: Tile[],
) {
    const positive = nodes.filter((node) => node.value > 0);
    if (positive.length === 0) return;
    if (positive.length === 1) {
        const node = positive[0];
        tiles.push({ node, rectangle });
        if (node.children) layoutNodes(node.children, rectangle, tiles);
        return;
    }

    const total = positive.reduce((sum, node) => sum + node.value, 0);
    let leftTotal = positive[0].value;
    let split = 1;
    let difference = Math.abs(total - 2 * leftTotal);
    let running = leftTotal;
    for (let index = 2; index < positive.length; index++) {
        running += positive[index - 1].value;
        const candidate = Math.abs(total - 2 * running);
        if (candidate < difference) {
            split = index;
            leftTotal = running;
            difference = candidate;
        }
    }

    const ratio = leftTotal / total;
    if (rectangle.width >= rectangle.height) {
        const firstWidth = rectangle.width * ratio;
        layoutNodes(positive.slice(0, split), {
            ...rectangle, width: firstWidth,
        }, tiles);
        layoutNodes(positive.slice(split), {
            ...rectangle,
            x: rectangle.x + firstWidth,
            width: rectangle.width - firstWidth,
        }, tiles);
    } else {
        const firstHeight = rectangle.height * ratio;
        layoutNodes(positive.slice(0, split), {
            ...rectangle, height: firstHeight,
        }, tiles);
        layoutNodes(positive.slice(split), {
            ...rectangle,
            y: rectangle.y + firstHeight,
            height: rectangle.height - firstHeight,
        }, tiles);
    }
}

function TreemapChart({
    title,
    nodes,
    description,
    unit = "",
    formatValue = String,
    appearance = "panel",
    className,
    ...props
}: TreemapChartProps) {
    if (typeof title !== "string" || !title.trim()) {
        throw new Error("TreemapChart requires a title.");
    }
    if (!Array.isArray(nodes)) {
        throw new TypeError("TreemapChart nodes must be an array.");
    }
    if (appearance !== "panel" && appearance !== "plain") {
        throw new RangeError("TreemapChart appearance is not supported.");
    }
    if (typeof formatValue !== "function") {
        throw new TypeError("TreemapChart formatValue must be a function.");
    }

    const resolved = resolveNodes(nodes);
    const total = resolved.reduce((sum, node) => sum + node.value, 0);
    if (!Number.isFinite(total)) {
        throw new RangeError("TreemapChart total must be finite.");
    }
    const formatted = (value: number) => {
        const text = formatValue(value);
        if (typeof text !== "string" || !text.trim()) {
            throw new Error("TreemapChart formatted values must be text.");
        }
        return text + unit;
    };
    const tiles: Tile[] = [];
    layoutNodes(resolved, { x: 0, y: 0, width: 100, height: 100 }, tiles);
    const leaves = tiles.filter((tile) => tile.node.children === null);
    const groups = tiles.filter((tile) => tile.node.children !== null);
    const rows: ResolvedNode[] = [];
    const collect = (items: readonly ResolvedNode[]) => {
        for (const node of items) {
            rows.push(node);
            if (node.children) collect(node.children);
        }
    };
    collect(resolved);
    const values = new Map(rows.map((node) => [
        node.key, formatted(node.value),
    ]));
    const position = ({ x, y, width, height }: Rectangle) => ({
        left: `${x}%`, top: `${y}%`,
        width: `${width}%`, height: `${height}%`,
    });
    const share = (value: number) => {
        if (value === 0 || total === 0) return "0%";
        const percent = value / total * 100;
        return percent < 0.05 ? "<0.1%" : `${Math.round(percent * 10) / 10}%`;
    };

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
            {nodes.length === 0 ? (
                <p className="m-0 text-sm text-muted">
                    표시할 항목이 없습니다.
                </p>
            ) : <>
                <p className="mb-[var(--space-3)] mt-0 text-xs text-muted">
                    전체 {formatted(total)}
                    {total === 0 && " · 모든 항목의 값이 0입니다."}
                </p>
                {total > 0 && <div aria-hidden="true" className={
                    "relative h-56 w-full overflow-hidden rounded-sm " +
                    "bg-surface-subtle @md:h-72"
                }>
                    {leaves.map((tile, index) => <div
                        key={tile.node.key}
                        title={`${tile.node.path}: ` +
                            `${values.get(tile.node.key)}`}
                        style={{
                            ...position(tile.rectangle),
                            background: fills[index % fills.length],
                        }}
                        className={
                            "absolute box-border flex flex-col " +
                            "justify-end overflow-hidden border " +
                            "border-surface p-2"
                        }>
                        <span className={
                            "block truncate text-xs font-semibold"
                        }>{tile.node.label}</span>
                        <span className="block truncate text-xs">
                            {values.get(tile.node.key)}
                        </span>
                    </div>)}
                    {groups.map((tile) => <div key={tile.node.key}
                        style={position(tile.rectangle)}
                        className={
                            "pointer-events-none absolute box-border " +
                            "overflow-hidden border-2 border-surface"
                        }>
                        <span className={
                            "inline-block max-w-full truncate rounded-br-sm " +
                            "bg-surface px-1 text-xs font-semibold"
                        }>{tile.node.label}</span>
                    </div>)}
                </div>}
                <div className="mt-[var(--space-4)] overflow-x-auto">
                    <table className="w-full min-w-[18rem] text-left text-xs">
                        <caption className="sr-only">
                            {title} 계층별 값과 전체 대비 비율
                        </caption>
                        <thead><tr className={
                            "border-b border-border text-muted"
                        }>
                            <th scope="col" className="py-2 pr-3 font-medium">
                                항목 경로
                            </th>
                            <th scope="col" className="py-2 pr-3 font-medium">
                                값
                            </th>
                            <th scope="col" className="py-2 font-medium">
                                전체 대비
                            </th>
                        </tr></thead>
                        <tbody>{rows.map((node) => <tr key={node.key}
                            className={
                                "border-b border-border last:border-0"
                            }>
                            <th scope="row" className={
                                "py-2 pr-3 font-medium"
                            }>{node.path}</th>
                            <td className="py-2 pr-3 tabular-nums">
                                {values.get(node.key)}
                            </td>
                            <td className="py-2 tabular-nums">
                                {share(node.value)}
                            </td>
                        </tr>)}</tbody>
                    </table>
                </div>
            </>}
        </figure>
    );
}

export { TreemapChart };
export type { TreemapChartProps, TreemapNode, TreemapLeaf, TreemapGroup };
