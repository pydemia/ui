import { useId, type ComponentProps } from "react";
import { cn } from "./utils";

type CitationSource = {
    id: string;
    title: string;
    href: string;
    location?: string;
    excerpt?: string;
};

type CitationListProps = Omit<
    ComponentProps<"section">, "children" | "aria-label" | "aria-labelledby"
> & {
    label: string;
    sources: readonly CitationSource[];
    variant?: "compact" | "card";
    emptyText?: string;
};

function CitationList({
    label,
    sources,
    variant = "compact",
    emptyText = "표시할 출처가 없습니다.",
    className,
    ...props
}: CitationListProps) {
    const labelId = useId();
    if (!label.trim()) throw new Error("CitationList requires a label.");
    if (!Array.isArray(sources)) {
        throw new TypeError("CitationList sources must be an array.");
    }
    if (variant !== "compact" && variant !== "card") {
        throw new RangeError("CitationList variant is not supported.");
    }

    const ids = new Set<string>();
    const links = sources.map((source) => {
        if (!source.id.trim() || !source.title.trim() ||
            source.location !== undefined && !source.location.trim() ||
            ids.has(source.id)) {
            throw new Error(
                "CitationList sources need unique IDs and nonempty text.",
            );
        }
        ids.add(source.id);
        let url: URL;
        try {
            url = new URL(source.href);
        } catch {
            throw new RangeError("CitationList source URL must be absolute.");
        }
        if (url.protocol !== "https:" && url.protocol !== "http:") {
            throw new RangeError("CitationList source URL must use HTTP(S).");
        }
        return { ...source, href: url.href };
    });

    return (
        <section aria-labelledby={labelId}
            className={cn("min-w-0 text-sm text-foreground", className)}
            {...props}>
            <p id={labelId} className="mb-[var(--space-2)] mt-0 font-semibold">
                {label}
            </p>
            {links.length === 0 ? (
                <p className="m-0 text-muted">{emptyText}</p>
            ) : (
                <ol className="m-0 grid list-decimal gap-[var(--space-2)] pl-5">
                    {links.map((source) => (
                        <li key={source.id} className={cn(
                            "min-w-0 marker:text-muted",
                            variant === "card" &&
                                "rounded-sm border border-border " +
                                "bg-surface p-[var(--space-3)]",
                        )}>
                            <a href={source.href} target="_blank"
                                rel="noopener noreferrer"
                                className={
                                    "inline-flex max-w-full flex-wrap items-baseline " +
                                    "gap-x-2 gap-y-1 rounded-sm text-accent " +
                                    "underline-offset-2 hover:underline " +
                                    "focus-visible:outline-2 " +
                                    "focus-visible:outline-focus"
                                }>
                                <span className="font-medium [overflow-wrap:anywhere]">
                                    {source.title}
                                </span>
                                {source.location && (
                                    <span className="text-xs text-muted">
                                        {source.location}
                                    </span>
                                )}
                                <span className="text-xs text-muted">새 탭</span>
                            </a>
                            {source.excerpt && (
                                <p className={cn(
                                    "mb-0 mt-1 [overflow-wrap:anywhere] " +
                                    "text-xs text-muted",
                                    variant === "compact" && "line-clamp-2",
                                )}>{source.excerpt}</p>
                            )}
                        </li>
                    ))}
                </ol>
            )}
        </section>
    );
}

export { CitationList };
export type { CitationListProps, CitationSource };
