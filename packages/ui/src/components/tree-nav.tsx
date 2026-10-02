import { useEffect, useId, useRef, useState } from "react";
import { cn } from "./utils";

type TreeNavItem = {
    id: string;
    label: string;
    href?: string;
    children?: readonly TreeNavItem[];
};

type TreeNavProps = {
    label: string;
    items: readonly TreeNavItem[];
    currentId?: string | null;
    variant?: "rail" | "filled";
    expandedIds?: readonly string[];
    defaultExpandedIds?: readonly string[];
    onExpandedIdsChange?: (ids: string[]) => void;
    onNavigate?: (id: string) => void;
    className?: string;
};

function TreeNav({
    label, items, currentId = null, variant = "rail", expandedIds,
    defaultExpandedIds = [], onExpandedIdsChange, onNavigate, className,
}: TreeNavProps) {
    const idPrefix = useId();
    const entries = new Map<string, {
        item: TreeNavItem;
        ancestors: readonly string[];
        index: number;
    }>();
    const parentIds: string[] = [];
    const path = new Set<TreeNavItem>();

    if (typeof label !== "string" || !label.trim() ||
        !Array.isArray(items) || items.length === 0) {
        throw new Error("TreeNav requires a label and pages.");
    }
    if (variant !== "rail" && variant !== "filled") {
        throw new RangeError("TreeNav variant is not supported.");
    }
    if (expandedIds !== undefined && (
        defaultExpandedIds.length > 0 || !onExpandedIdsChange
    )) {
        throw new Error(
            "Controlled TreeNav expansion requires a callback and no defaults.",
        );
    }

    function collect(nodes: readonly TreeNavItem[], ancestors: string[]) {
        for (const item of nodes) {
            if (!item || typeof item.id !== "string" || !item.id.trim() ||
                typeof item.label !== "string" || !item.label.trim() ||
                (item.href !== undefined && (
                    typeof item.href !== "string" || !item.href.trim()
                )) || (item.children !== undefined &&
                    !Array.isArray(item.children))) {
                throw new Error("TreeNav pages need IDs, labels, and links.");
            }
            if (path.has(item)) {
                throw new Error("TreeNav pages cannot contain a cycle.");
            }
            if (entries.has(item.id)) {
                throw new Error(`TreeNav page ID must be unique: ${item.id}`);
            }
            if (item.href) {
                let protocol: string;
                try {
                    protocol = new URL(item.href,
                        "https://pydemia.invalid/").protocol;
                } catch {
                    throw new Error(`TreeNav link is invalid: ${item.id}`);
                }
                if (protocol !== "http:" && protocol !== "https:" &&
                    protocol !== "mailto:" && protocol !== "tel:") {
                    throw new Error(`TreeNav link is unsupported: ${item.id}`);
                }
            }
            const hasChildren = Boolean(item.children?.length);
            if (!item.href && !hasChildren) {
                throw new Error(
                    `TreeNav page needs a link or child pages: ${item.id}`,
                );
            }
            entries.set(item.id, {
                item, ancestors, index: entries.size,
            });
            if (hasChildren) {
                parentIds.push(item.id);
                path.add(item);
                collect(item.children!, [...ancestors, item.id]);
                path.delete(item);
            }
        }
    }

    collect(items, []);
    if (currentId !== null && (
        typeof currentId !== "string" || !entries.get(currentId)?.item.href
    )) {
        throw new Error("TreeNav currentId must name a linked page.");
    }
    for (const list of [expandedIds, defaultExpandedIds]) {
        if (list === undefined) continue;
        if (!Array.isArray(list) ||
            new Set(list).size !== list.length ||
            list.some((id) => !parentIds.includes(id))) {
            throw new Error("TreeNav expanded IDs must name unique branches.");
        }
    }

    const currentAncestors = currentId
        ? entries.get(currentId)!.ancestors : [];
    const [internalExpandedIds, setInternalExpandedIds] = useState(() =>
        parentIds.filter((id) =>
            defaultExpandedIds.includes(id) || currentAncestors.includes(id)),
    );
    const previousCurrentId = useRef(currentId);
    const openIds = expandedIds ?? internalExpandedIds;
    const open = new Set(openIds);

    useEffect(() => {
        if (previousCurrentId.current === currentId) return;
        previousCurrentId.current = currentId;
        if (expandedIds !== undefined || currentAncestors.length === 0) return;
        setInternalExpandedIds((previous) => {
            const next = parentIds.filter((id) =>
                previous.includes(id) || currentAncestors.includes(id));
            return next.length === previous.length ? previous : next;
        });
    }, [currentId, expandedIds, items]);

    function toggle(id: string) {
        const next = new Set(openIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        const ordered = parentIds.filter((entryId) => next.has(entryId));
        if (expandedIds === undefined) setInternalExpandedIds(ordered);
        onExpandedIdsChange?.(ordered);
    }

    function renderItems(nodes: readonly TreeNavItem[]) {
        return nodes.map((item) => {
            const entry = entries.get(item.id)!;
            const hasChildren = Boolean(item.children?.length);
            const isOpen = open.has(item.id);
            const childId = `${idPrefix}-branch-${entry.index}`;
            const onCurrentPath = currentAncestors.includes(item.id);
            const linkClass = cn(
                "block min-w-0 flex-1 truncate rounded-sm px-3 py-2 " +
                "text-muted hover:bg-surface-subtle hover:text-foreground " +
                "focus-visible:outline-2 focus-visible:outline-focus",
                variant === "rail"
                    ? "border-l-2 border-transparent " +
                      "aria-[current=page]:border-accent " +
                      "aria-[current=page]:font-semibold " +
                      "aria-[current=page]:text-accent"
                    : "aria-[current=page]:bg-accent " +
                      "aria-[current=page]:font-semibold " +
                      "aria-[current=page]:text-accent-foreground",
                onCurrentPath && "font-semibold text-foreground",
            );
            return (
                <li key={item.id} className="min-w-0">
                    <div className="flex min-w-0 items-center gap-1">
                        {item.href ? (
                            <a href={item.href}
                                aria-current={currentId === item.id
                                    ? "page" : undefined}
                                className={linkClass}
                                onClick={() => onNavigate?.(item.id)}>
                                {item.label}
                            </a>
                        ) : (
                            <button type="button"
                                aria-expanded={isOpen}
                                aria-controls={childId}
                                onClick={() => toggle(item.id)}
                                className={cn(linkClass, "flex items-center " +
                                    "justify-between text-left")}>
                                <span className="truncate">{item.label}</span>
                                <span aria-hidden="true">
                                    {isOpen ? "⌄" : "›"}
                                </span>
                            </button>
                        )}
                        {item.href && hasChildren && (
                            <button type="button"
                                aria-label={`${item.label} 하위 페이지 ` +
                                    (isOpen ? "접기" : "펼치기")}
                                aria-expanded={isOpen}
                                aria-controls={childId}
                                onClick={() => toggle(item.id)}
                                className={
                                    "grid size-9 shrink-0 place-items-center " +
                                    "rounded-sm text-muted " +
                                    "hover:bg-surface-subtle " +
                                    "focus-visible:outline-2 " +
                                    "focus-visible:outline-focus"
                                }>
                                <span aria-hidden="true">
                                    {isOpen ? "⌄" : "›"}
                                </span>
                            </button>
                        )}
                    </div>
                    {hasChildren && (
                        <ul id={childId}
                            className={isOpen
                                ? "ml-3 grid list-none gap-1 border-l " +
                                  "border-border pl-2"
                                : "hidden"}
                            hidden={!isOpen}>
                            {renderItems(item.children!)}
                        </ul>
                    )}
                </li>
            );
        });
    }

    return (
        <nav aria-label={label} data-variant={variant}
            className={cn("min-w-0 text-sm", className)}>
            <ul className="grid min-w-0 list-none gap-1 p-0">
                {renderItems(items)}
            </ul>
        </nav>
    );
}

export { TreeNav };
export type { TreeNavItem, TreeNavProps };
