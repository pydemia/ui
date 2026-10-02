import { useEffect, useId, useRef, useState, type ComponentProps } from "react";
import { Input } from "./input";
import { LogConsole, type LogEntry } from "./log-console";
import { NativeSelect } from "./native-select";
import { cn } from "./utils";

type LogViewerProps = Omit<ComponentProps<"div">, "children"> & {
    entries: readonly LogEntry[];
    label: string;
    variant?: "panel" | "flat";
    followTail?: boolean;
    emptyMessage?: string;
    noMatchesMessage?: string;
};

function LogViewer({
    entries,
    label,
    variant = "panel",
    followTail = false,
    emptyMessage = "표시할 로그가 없습니다.",
    noMatchesMessage = "일치하는 로그가 없습니다.",
    className,
    ...props
}: LogViewerProps) {
    const titleId = useId();
    const searchId = useId();
    const levelId = useId();
    const logId = useId();
    const [query, setQuery] = useState("");
    const [level, setLevel] = useState("all");
    const [following, setFollowing] = useState(true);
    const logRef = useRef<HTMLDivElement>(null);

    if (typeof label !== "string" || !label.trim()) {
        throw new Error("LogViewer requires a label.");
    }
    if (!Array.isArray(entries)) {
        throw new TypeError("LogViewer entries must be an array.");
    }
    if (variant !== "panel" && variant !== "flat") {
        throw new RangeError("LogViewer variant is not supported.");
    }
    const ids = new Set<string>();
    for (const entry of entries) {
        if (!entry || typeof entry.id !== "string" || !entry.id.trim() ||
            ids.has(entry.id) || typeof entry.message !== "string" ||
            (entry.timestamp !== undefined &&
                typeof entry.timestamp !== "string") ||
            !["debug", "info", "warn", "error"].includes(entry.level)) {
            throw new Error(
                "LogViewer entries need unique IDs, text and a level.",
            );
        }
        ids.add(entry.id);
    }

    const term = query.trim().toLowerCase();
    const visibleEntries = entries.filter((entry) =>
        (level === "all" || entry.level === level) &&
        `${entry.timestamp ?? ""} ${entry.level} ${entry.message}`
            .toLowerCase().includes(term),
    );
    const latest = visibleEntries.at(-1);

    useEffect(() => {
        if (followTail && following && logRef.current) {
            logRef.current.scrollTop = logRef.current.scrollHeight;
        }
    }, [
        followTail, following, visibleEntries.length,
        latest?.id, latest?.message, latest?.timestamp, latest?.level,
        term, level,
    ]);

    return (
        <div
            {...props}
            role="group"
            aria-labelledby={titleId}
            data-variant={variant}
            className={cn(
                "@container min-w-0 overflow-hidden text-foreground",
                variant === "panel" &&
                    "rounded-sm border border-border bg-surface",
                className,
            )}
        >
            <div className={cn(
                "flex flex-wrap items-center justify-between " +
                "gap-[var(--space-2)] px-[var(--space-3)] py-[var(--space-2)]",
                variant === "panel" && "border-b border-border",
            )}>
                <span id={titleId} className="text-sm font-medium">
                    {label}
                </span>
                <div className="flex flex-wrap items-center gap-2">
                    <span role="status" className="text-xs text-muted">
                        {visibleEntries.length} / {entries.length}건
                    </span>
                    {followTail && (
                        <button type="button" aria-pressed={following}
                            aria-controls={logId}
                            className={cn(
                                "rounded-sm px-2 py-1 text-xs " +
                                "hover:bg-surface-subtle " +
                                "focus-visible:outline-2 " +
                                "focus-visible:outline-focus",
                                following ? "text-accent" : "text-muted",
                            )}
                            onClick={() => setFollowing((current) => !current)}>
                            최신 로그 따라가기
                        </button>
                    )}
                </div>
            </div>
            <div className={
                "grid gap-[var(--space-2)] px-[var(--space-3)] " +
                "py-[var(--space-2)] @sm:grid-cols-[minmax(0,1fr)_10rem]"
            }>
                <div className="min-w-0">
                    <label htmlFor={searchId} className="mb-1 block text-xs">
                        로그 검색
                    </label>
                    <Input id={searchId} type="search" value={query}
                        aria-controls={logId}
                        onChange={(event) => setQuery(event.target.value)} />
                </div>
                <div className="min-w-0">
                    <label htmlFor={levelId} className="mb-1 block text-xs">
                        수준
                    </label>
                    <NativeSelect id={levelId} value={level}
                        aria-controls={logId}
                        onChange={(event) => setLevel(event.target.value)}>
                        <option value="all">전체</option>
                        <option value="debug">Debug</option>
                        <option value="info">Info</option>
                        <option value="warn">Warn</option>
                        <option value="error">Error</option>
                    </NativeSelect>
                </div>
            </div>
            <LogConsole ref={logRef} id={logId} label={`${label} 항목`}
                entries={visibleEntries} variant="flat"
                emptyMessage={entries.length === 0
                    ? emptyMessage : noMatchesMessage} />
        </div>
    );
}

export { LogViewer };
export type { LogViewerProps };
