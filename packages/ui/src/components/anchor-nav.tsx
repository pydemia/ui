import { useEffect, useRef, useState } from "react";
import { cn } from "./utils";

type AnchorNavItem = {
    id: string;
    label: string;
    depth?: 1 | 2;
};

type AnchorNavProps = {
    label: string;
    items: readonly AnchorNavItem[];
    variant?: "rail" | "inline";
    scrollRootId?: string;
    offset?: number;
    onCurrentIdChange?: (id: string | null) => void;
    className?: string;
};

function AnchorNav({
    label, items, variant = "rail", scrollRootId, offset = 24,
    onCurrentIdChange, className,
}: AnchorNavProps) {
    const [currentId, setCurrentId] = useState<string | null>(null);
    const reportedId = useRef<string | null>(null);

    if (typeof label !== "string" || !label.trim()) {
        throw new Error("AnchorNav requires a navigation label.");
    }
    if (!Array.isArray(items)) {
        throw new Error("AnchorNav requires a section list.");
    }
    if (variant !== "rail" && variant !== "inline") {
        throw new RangeError("AnchorNav variant is not supported.");
    }
    if (scrollRootId !== undefined && (
        typeof scrollRootId !== "string" || !scrollRootId.trim()
    )) {
        throw new Error("AnchorNav scrollRootId must name an element.");
    }
    if (!Number.isFinite(offset) || offset < 0) {
        throw new RangeError("AnchorNav offset must be nonnegative.");
    }
    if (onCurrentIdChange !== undefined &&
        typeof onCurrentIdChange !== "function") {
        throw new Error("AnchorNav onCurrentIdChange must be a callback.");
    }
    const ids = new Set<string>();
    for (const item of items) {
        if (!item || typeof item.id !== "string" ||
            !item.id.trim() || /\s|#/.test(item.id) || ids.has(item.id) ||
            typeof item.label !== "string" || !item.label.trim() ||
            (item.depth !== undefined && item.depth !== 1 && item.depth !== 2)
        ) {
            throw new Error(
                "AnchorNav sections need unique IDs, labels, and depth 1 or 2.",
            );
        }
        ids.add(item.id);
    }

    useEffect(() => {
        const root = scrollRootId
            ? document.getElementById(scrollRootId) : window;
        if (!root) {
            throw new Error(`AnchorNav scroll root not found: ${scrollRootId}`);
        }
        const container = root instanceof HTMLElement ? root : null;
        let frame = 0;

        function report(id: string | null) {
            setCurrentId((previous) => previous === id ? previous : id);
            if (reportedId.current !== id) {
                reportedId.current = id;
                onCurrentIdChange?.(id);
            }
        }

        function update() {
            frame = 0;
            const threshold = (container
                ? container.getBoundingClientRect().top : 0) + offset + 2;
            let before: { id: string; top: number } | null = null;
            let after: { id: string; top: number } | null = null;
            let last: string | null = null;
            for (const item of items) {
                const target = document.getElementById(item.id);
                if (!target || container && !container.contains(target)) {
                    continue;
                }
                const top = target.getBoundingClientRect().top;
                last = item.id;
                if (top <= threshold && (!before || top > before.top)) {
                    before = { id: item.id, top };
                } else if (top > threshold && (!after || top < after.top)) {
                    after = { id: item.id, top };
                }
            }
            const atEnd = container
                ? container.scrollHeight > container.clientHeight + 2 &&
                    container.scrollTop + container.clientHeight >=
                        container.scrollHeight - 2
                : document.documentElement.scrollHeight >
                    window.innerHeight + 2 &&
                    window.scrollY + window.innerHeight >=
                        document.documentElement.scrollHeight - 2;
            report(atEnd ? last : before?.id ?? after?.id ?? null);
        }

        function schedule() {
            if (!frame) frame = window.requestAnimationFrame(update);
        }

        function followHash() {
            if (!container) {
                schedule();
                return;
            }
            const item = items.find((entry) =>
                window.location.hash === `#${encodeURIComponent(entry.id)}`,
            );
            const target = item && document.getElementById(item.id);
            if (target && container.contains(target)) {
                container.scrollTop +=
                    target.getBoundingClientRect().top -
                    container.getBoundingClientRect().top - offset;
            }
            schedule();
        }

        root.addEventListener("scroll", schedule, { passive: true });
        window.addEventListener("resize", schedule);
        window.addEventListener("hashchange", followHash);
        window.addEventListener("popstate", followHash);
        followHash();
        return () => {
            root.removeEventListener("scroll", schedule);
            window.removeEventListener("resize", schedule);
            window.removeEventListener("hashchange", followHash);
            window.removeEventListener("popstate", followHash);
            if (frame) window.cancelAnimationFrame(frame);
        };
    }, [items, scrollRootId, offset, onCurrentIdChange]);

    return (
        <nav aria-label={label} data-variant={variant}
            className={cn(
                "min-w-0 text-sm",
                variant === "rail"
                    ? "grid gap-1 border-l border-border"
                    : "flex gap-1 overflow-x-auto pb-1",
                className,
            )}>
            {items.map((item) => (
                <a key={item.id} href={`#${encodeURIComponent(item.id)}`}
                    aria-current={currentId === item.id
                        ? "location" : undefined}
                    onClick={(event) => {
                        const target = document.getElementById(item.id);
                        if (!target) return;
                        if (scrollRootId) {
                            const root = document.getElementById(scrollRootId);
                            if (root?.contains(target)) {
                                event.preventDefault();
                                root.scrollTop +=
                                    target.getBoundingClientRect().top -
                                    root.getBoundingClientRect().top - offset;
                                window.history.pushState(
                                    null, "", `#${encodeURIComponent(item.id)}`,
                                );
                            }
                        }
                        setCurrentId(item.id);
                        if (reportedId.current !== item.id) {
                            reportedId.current = item.id;
                            onCurrentIdChange?.(item.id);
                        }
                    }}
                    className={cn(
                        "text-muted hover:text-foreground " +
                        "focus-visible:outline-2 focus-visible:outline-focus",
                        variant === "rail"
                            ? "-ml-px border-l-2 border-transparent " +
                                "py-2 pr-3 pl-3 " +
                                "aria-[current=location]:border-accent " +
                                "aria-[current=location]:font-semibold " +
                                "aria-[current=location]:text-accent"
                            : "shrink-0 rounded-sm px-3 py-2 " +
                                "hover:bg-surface-subtle " +
                                "aria-[current=location]:bg-accent " +
                                "aria-[current=location]:font-semibold " +
                                "aria-[current=location]:text-accent-foreground",
                        variant === "rail" && item.depth === 2 && "pl-6",
                    )}>
                    {item.label}
                </a>
            ))}
        </nav>
    );
}

export { AnchorNav };
export type { AnchorNavItem, AnchorNavProps };
