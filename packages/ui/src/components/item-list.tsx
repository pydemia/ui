import { useId, type ComponentProps, type ReactNode } from "react";
import { cn } from "./utils";

type ItemListItem = {
    id: string;
    title: string;
    description?: string;
    meta?: string;
    href?: string;
    leading?: ReactNode;
    trailing?: ReactNode;
};

type ItemListProps = Omit<
    ComponentProps<"section">, "children" | "aria-label" | "aria-labelledby"
> & {
    label: string;
    items: readonly ItemListItem[];
    appearance?: "panel" | "plain";
    density?: "comfortable" | "compact";
    emptyText?: string;
};

function ItemList({
    label,
    items,
    appearance = "panel",
    density = "comfortable",
    emptyText = "표시할 항목이 없습니다.",
    className,
    ...props
}: ItemListProps) {
    const labelId = useId();
    if (typeof label !== "string" || !label.trim() ||
        typeof emptyText !== "string" || !emptyText.trim()) {
        throw new Error("ItemList requires a label and empty text.");
    }
    if (!Array.isArray(items)) {
        throw new TypeError("ItemList items must be an array.");
    }
    if (appearance !== "panel" && appearance !== "plain") {
        throw new RangeError("ItemList appearance is not supported.");
    }
    if (density !== "comfortable" && density !== "compact") {
        throw new RangeError("ItemList density is not supported.");
    }

    const ids = new Set<string>();
    const entries = items.map((item) => {
        if (!item || typeof item.id !== "string" || !item.id.trim() ||
            typeof item.title !== "string" || !item.title.trim() ||
            [item.description, item.meta].some((value) =>
                value !== undefined &&
                (typeof value !== "string" || !value.trim())) ||
            ids.has(item.id)) {
            throw new Error("ItemList items need unique IDs and text.");
        }
        ids.add(item.id);
        if (item.href === undefined) return item;
        if (typeof item.href !== "string" || !item.href.trim()) {
            throw new RangeError("ItemList href must be a nonempty URL.");
        }
        const href = item.href.trim();
        let url: URL;
        try {
            url = new URL(href, "https://pydemia.invalid");
        } catch {
            throw new RangeError("ItemList href must be a valid URL.");
        }
        if (url.protocol !== "http:" && url.protocol !== "https:") {
            throw new RangeError("ItemList href must use HTTP(S).");
        }
        return { ...item, href };
    });

    return (
        <section {...props} aria-labelledby={labelId}
            data-appearance={appearance} data-density={density}
            className={cn(
                "@container min-w-0 text-foreground",
                appearance === "panel" &&
                    "overflow-hidden rounded-sm border border-border bg-surface",
                className,
            )}>
            <h3 id={labelId} className={cn(
                "m-0 text-sm font-semibold",
                appearance === "panel"
                    ? "border-b border-border p-[var(--space-3)]"
                    : "mb-[var(--space-2)]",
            )}>{label}</h3>
            {entries.length === 0 ? (
                <p className={cn(
                    "m-0 text-sm text-muted",
                    appearance === "panel" && "p-[var(--space-4)]",
                )}>{emptyText}</p>
            ) : (
                <ul className="m-0 list-none divide-y divide-border p-0">
                    {entries.map((item) => (
                        <li key={item.id} className={cn(
                            "flex min-w-0 flex-wrap items-start gap-3",
                            density === "compact"
                                ? "py-[var(--space-2)]"
                                : "py-[var(--space-3)]",
                            appearance === "panel" &&
                                "px-[var(--space-3)]",
                        )}>
                            {item.leading !== undefined &&
                                item.leading !== null && (
                                <span className="mt-0.5 shrink-0 text-muted">
                                    {item.leading}
                                </span>
                            )}
                            <div className="min-w-0 flex-[1_1_12rem]">
                                {item.href ? (
                                    <a href={item.href} className={
                                        "break-words rounded-sm text-sm " +
                                        "font-semibold text-foreground " +
                                        "underline-offset-2 hover:underline " +
                                        "focus-visible:outline-2 " +
                                        "focus-visible:outline-focus"
                                    }>{item.title}</a>
                                ) : (
                                    <p className="m-0 break-words text-sm font-semibold">
                                        {item.title}
                                    </p>
                                )}
                                {item.description && (
                                    <p className={cn(
                                        "m-0 break-words text-muted",
                                        density === "compact"
                                            ? "text-xs" : "mt-1 text-sm",
                                    )}>{item.description}</p>
                                )}
                                {item.meta && (
                                    <p className="mb-0 mt-1 text-xs text-muted">
                                        {item.meta}
                                    </p>
                                )}
                            </div>
                            {item.trailing !== undefined &&
                                item.trailing !== null && (
                                <div className="ml-auto shrink-0 self-center">
                                    {item.trailing}
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export { ItemList };
export type { ItemListItem, ItemListProps };
