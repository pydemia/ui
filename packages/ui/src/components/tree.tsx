import { useRef, useState, type ComponentProps, type KeyboardEvent } from "react";
import { cn } from "./utils";

type TreeNode = {
    id: string;
    label: string;
    children?: readonly TreeNode[];
    disabled?: boolean;
};

type TreeProps = Omit<
    ComponentProps<"div">,
    "aria-label" | "children" | "onSelect" | "role"
> & {
    label: string;
    items: readonly TreeNode[];
    selectedId?: string | null;
    defaultSelectedId?: string | null;
    onSelectedIdChange?: (id: string) => void;
    expandedIds?: readonly string[];
    defaultExpandedIds?: readonly string[];
    onExpandedIdsChange?: (ids: string[]) => void;
    emptyMessage?: string;
};

type TreeEntry = {
    node: TreeNode;
    parentId: string | null;
    level: number;
    position: number;
    setSize: number;
};

function Tree({
    label,
    items,
    selectedId,
    defaultSelectedId = null,
    onSelectedIdChange,
    expandedIds,
    defaultExpandedIds = [],
    onExpandedIdsChange,
    emptyMessage = "표시할 항목이 없습니다.",
    className,
    ...props
}: TreeProps) {
    const [internalSelectedId, setInternalSelectedId] = useState(defaultSelectedId);
    const [internalExpandedIds, setInternalExpandedIds] = useState(
        [...defaultExpandedIds],
    );
    const [focusedId, setFocusedId] = useState<string | null>(null);
    const typeahead = useRef({ query: "", at: 0 });
    const treeRef = useRef<HTMLDivElement>(null);
    const currentSelectedId = selectedId === undefined
        ? internalSelectedId : selectedId;
    const currentExpandedIds = expandedIds ?? internalExpandedIds;
    const expanded = new Set(currentExpandedIds);
    const entries = new Map<string, TreeEntry>();
    const visible: TreeEntry[] = [];

    if (!label.trim()) throw new Error("Tree requires a label.");

    function collect(nodes: readonly TreeNode[], parentId: string | null,
        level: number, parentDisabled: boolean) {
        nodes.forEach((node, index) => {
            if (!node.id.trim() || !node.label.trim()) {
                throw new Error("Tree nodes require nonempty ids and labels.");
            }
            if (entries.has(node.id)) {
                throw new Error(`Tree node id must be unique: ${node.id}`);
            }
            const entry = {
                node, parentId, level, position: index + 1,
                setSize: nodes.length,
            };
            entries.set(node.id, entry);
            if (!parentDisabled) visible.push(entry);
            if (node.children?.length) {
                const hidden = parentDisabled || node.disabled ||
                    !expanded.has(node.id);
                collect(node.children, node.id, level + 1, hidden);
            }
        });
    }

    collect(items, null, 1, false);
    const focusable = visible.filter((entry) => !entry.node.disabled);
    let currentFocusedId = focusedId;
    while (currentFocusedId && !focusable.some((entry) =>
        entry.node.id === currentFocusedId
    )) {
        currentFocusedId = entries.get(currentFocusedId)?.parentId ?? null;
    }
    currentFocusedId ??= focusable.find((entry) =>
        entry.node.id === currentSelectedId
    )?.node.id ?? focusable[0]?.node.id ?? null;

    function focusItem(id: string) {
        setFocusedId(id);
        const element = Array.from(
            treeRef.current?.querySelectorAll<HTMLElement>("[role='treeitem']") ?? [],
        ).find((item) => item.dataset.treeId === id);
        element?.focus();
    }

    function changeExpanded(id: string) {
        const next = new Set(currentExpandedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        const ordered = Array.from(entries.keys()).filter((key) => next.has(key));
        if (expandedIds === undefined) setInternalExpandedIds(ordered);
        onExpandedIdsChange?.(ordered);
    }

    function changeSelected(id: string) {
        if (selectedId === undefined) setInternalSelectedId(id);
        onSelectedIdChange?.(id);
    }

    function handleKeyDown(event: KeyboardEvent<HTMLDivElement>,
        entry: TreeEntry) {
        const { node } = entry;
        const index = focusable.findIndex((item) => item.node.id === node.id);
        let next: string | undefined;
        switch (event.key) {
            case "ArrowDown":
                next = focusable[index + 1]?.node.id;
                break;
            case "ArrowUp":
                next = focusable[index - 1]?.node.id;
                break;
            case "Home":
                next = focusable[0]?.node.id;
                break;
            case "End":
                next = focusable.at(-1)?.node.id;
                break;
            case "ArrowRight":
                if (node.children?.length) {
                    if (!expanded.has(node.id)) changeExpanded(node.id);
                    else next = focusable.find((item) =>
                        item.parentId === node.id
                    )?.node.id;
                }
                break;
            case "ArrowLeft":
                if (node.children?.length && expanded.has(node.id)) {
                    changeExpanded(node.id);
                } else if (entry.parentId) {
                    next = entry.parentId;
                }
                break;
            case "Enter":
            case " ":
                changeSelected(node.id);
                break;
            default:
                if (event.key.length !== 1 || event.altKey || event.ctrlKey ||
                    event.metaKey) return;
                const char = event.key.toLocaleLowerCase();
                const query = event.timeStamp - typeahead.current.at < 700
                    ? typeahead.current.query + char : char;
                const after = [...focusable.slice(index + 1),
                    ...focusable.slice(0, index + 1)];
                const match = (text: string) => after.find((item) =>
                    item.node.label.toLocaleLowerCase().startsWith(text)
                );
                next = (match(query) ?? match(char))?.node.id;
                typeahead.current = { query: next ? query : char,
                    at: event.timeStamp };
                if (!next) return;
        }
        event.preventDefault();
        event.stopPropagation();
        if (next) focusItem(next);
    }

    function renderNodes(nodes: readonly TreeNode[], level: number) {
        return nodes.map((node) => {
            const entry = entries.get(node.id)!;
            const hasChildren = Boolean(node.children?.length);
            const isExpanded = hasChildren && expanded.has(node.id);
            return (
                <div key={node.id} role="treeitem" data-tree-id={node.id}
                    aria-label={node.label}
                    aria-level={entry.level}
                    aria-posinset={entry.position}
                    aria-setsize={entry.setSize}
                    aria-expanded={hasChildren ? !node.disabled && isExpanded
                        : undefined}
                    aria-selected={node.disabled ? undefined :
                        currentSelectedId === node.id}
                    aria-disabled={node.disabled || undefined}
                    tabIndex={!node.disabled && currentFocusedId === node.id
                        ? 0 : -1}
                    className={
                        "outline-none [&:focus-visible>div:first-child]:outline-2 " +
                        "[&:focus-visible>div:first-child]:outline-focus"
                    }
                    onFocus={(event) => {
                        event.stopPropagation();
                        if (!node.disabled) setFocusedId(node.id);
                    }}
                    onKeyDown={(event) => {
                        if (!node.disabled) handleKeyDown(event, entry);
                    }}
                >
                    <div
                        style={{ paddingInlineStart: `calc(var(--space-2) + ${
                            level - 1
                        }rem)` }}
                        className={cn(
                            "flex min-h-9 items-center gap-2 rounded-sm " +
                            "px-[var(--space-2)] py-1 text-sm text-foreground",
                            !node.disabled && "cursor-pointer hover:bg-surface-subtle",
                            node.disabled && "cursor-not-allowed opacity-50",
                            currentSelectedId === node.id && !node.disabled &&
                                "bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] " +
                                "font-medium text-accent",
                        )}
                        onClick={(event) => {
                            event.stopPropagation();
                            if (node.disabled) return;
                            focusItem(node.id);
                            changeSelected(node.id);
                        }}
                    >
                        <span aria-hidden="true" className={cn(
                            "grid size-4 shrink-0 place-items-center text-xs",
                            hasChildren && !node.disabled && "cursor-pointer",
                        )} onClick={(event) => {
                            if (!hasChildren || node.disabled) return;
                            event.stopPropagation();
                            focusItem(node.id);
                            changeExpanded(node.id);
                        }}>
                            {hasChildren ? isExpanded ? "▾" : "▸" : ""}
                        </span>
                        <span className="truncate">{node.label}</span>
                    </div>
                    {isExpanded && !node.disabled && (
                        <div role="group">
                            {renderNodes(node.children!, level + 1)}
                        </div>
                    )}
                </div>
            );
        });
    }

    return (
        <div ref={treeRef} role="tree" aria-label={label}
            className={cn("min-w-0 rounded-sm border border-border " +
                "bg-surface p-[var(--space-2)] text-foreground", className)}
            {...props}
        >
            {items.length ? renderNodes(items, 1) : (
                <p role="status" className="m-0 p-[var(--space-3)] text-sm text-muted">
                    {emptyMessage}
                </p>
            )}
        </div>
    );
}

export { Tree };
export type { TreeNode, TreeProps };
