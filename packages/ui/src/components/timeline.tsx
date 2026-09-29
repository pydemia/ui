import type { ReactNode } from "react";
import { cn } from "./utils";

type TimelineStatus = {
    label: string;
    tone?: "neutral" | "accent" | "danger";
};

type TimelineEntry = {
    id: string;
    title: string;
    timestamp: string;
    dateTime?: string;
    description?: ReactNode;
    status?: TimelineStatus;
    href?: string;
};

type TimelineProps = {
    "aria-label": string;
    entries: readonly TimelineEntry[];
    emptyMessage?: string;
    className?: string;
};

function Timeline({
    entries,
    emptyMessage = "표시할 활동이 없습니다.",
    className,
    "aria-label": ariaLabel,
}: TimelineProps) {
    if (!ariaLabel.trim() || entries.some((entry) =>
        !entry.id.trim() || !entry.title.trim() ||
        !entry.timestamp.trim() ||
        (entry.dateTime !== undefined && !entry.dateTime.trim()) ||
        (entry.href !== undefined && !entry.href.trim()) ||
        (entry.status !== undefined && !entry.status.label.trim())
    )) {
        throw new Error("Timeline requires a name and complete entries.");
    }
    if (new Set(entries.map((entry) => entry.id)).size !== entries.length) {
        throw new Error("Timeline entry ids must be unique.");
    }

    if (!entries.length) {
        return <p role="status" className={cn(
            "m-0 rounded-sm border border-border bg-surface " +
            "p-[var(--space-4)] text-sm text-muted",
            className,
        )}>{emptyMessage}</p>;
    }

    return (
        <ol aria-label={ariaLabel} className={cn(
            "m-0 list-none space-y-0 p-0 text-foreground",
            className,
        )}>
            {entries.map((entry, index) => {
                const tone = entry.status?.tone ?? "neutral";
                return (
                    <li key={entry.id} className={
                        "relative flex min-w-0 gap-3 pb-5 last:pb-0"
                    }>
                        {index < entries.length - 1 && (
                            <span aria-hidden="true" className={
                                "absolute bottom-0 left-[5px] top-4 w-px " +
                                "bg-border"
                            } />
                        )}
                        <span aria-hidden="true" className={cn(
                            "relative z-10 mt-1 size-3 shrink-0 rounded-full " +
                            "border-2 border-surface",
                            tone === "neutral" && "bg-muted",
                            tone === "accent" && "bg-accent",
                            tone === "danger" && "bg-danger",
                        )} />
                        <div className="min-w-0 flex-1">
                            <div className={
                                "flex flex-wrap items-baseline justify-between " +
                                "gap-x-3 gap-y-1"
                            }>
                                {entry.href ? (
                                    <a href={entry.href} className={
                                        "text-sm font-semibold text-foreground " +
                                        "underline-offset-2 hover:underline"
                                    }>{entry.title}</a>
                                ) : (
                                    <strong className="text-sm font-semibold">
                                        {entry.title}
                                    </strong>
                                )}
                                {entry.dateTime ? (
                                    <time dateTime={entry.dateTime}
                                        className="text-xs text-muted">
                                        {entry.timestamp}
                                    </time>
                                ) : (
                                    <span className="text-xs text-muted">
                                        {entry.timestamp}
                                    </span>
                                )}
                            </div>
                            {entry.description && (
                                <div className="mt-1 text-sm text-muted">
                                    {entry.description}
                                </div>
                            )}
                            {entry.status && (
                                <span className={cn(
                                    "mt-2 inline-flex rounded-sm border px-2 " +
                                    "py-0.5 text-xs font-medium",
                                    tone === "neutral" &&
                                        "border-border text-muted",
                                    tone === "accent" &&
                                        "border-accent text-accent",
                                    tone === "danger" &&
                                        "border-danger text-danger",
                                )}>
                                    {entry.status.label}
                                </span>
                            )}
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}

export { Timeline };
export type { TimelineProps, TimelineEntry, TimelineStatus };
