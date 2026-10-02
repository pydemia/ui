import type { ComponentProps } from "react";
import { cn } from "./utils";

type LogEntry = {
    id: string;
    level: "debug" | "info" | "warn" | "error";
    message: string;
    timestamp?: string;
};

type LogConsoleProps = Omit<ComponentProps<"div">, "children"> & {
    entries: readonly LogEntry[];
    label: string;
    emptyMessage?: string;
    live?: "off" | "polite";
    variant?: "panel" | "flat";
};

const levelColor: Record<LogEntry["level"], string> = {
    debug: "text-muted",
    info: "text-foreground",
    warn: "text-accent",
    error: "text-danger",
};

function LogConsole({
    entries,
    label,
    emptyMessage = "No log entries",
    live = "off",
    variant = "panel",
    className,
    ...props
}: LogConsoleProps) {
    if (variant !== "panel" && variant !== "flat") {
        throw new RangeError("LogConsole variant is not supported.");
    }

    return (
        <div
            role="log"
            aria-label={label}
            aria-live={live}
            data-variant={variant}
            className={cn(
                "max-h-64 min-w-0 overflow-auto p-[var(--space-3)] " +
                "font-mono text-xs text-foreground",
                variant === "panel" &&
                    "rounded-sm border border-border bg-surface-subtle",
                variant === "flat" && "bg-transparent",
                className,
            )}
            {...props}
        >
            {entries.length === 0 ? (
                <p className="m-0 text-muted">{emptyMessage}</p>
            ) : entries.map((entry) => (
                <div
                    key={entry.id}
                    data-level={entry.level}
                    className="flex min-w-0 gap-[var(--space-2)] py-1"
                >
                    {entry.timestamp && (
                        <time className="shrink-0 text-muted">
                            {entry.timestamp}
                        </time>
                    )}
                    <span
                        className={cn(
                            "w-12 shrink-0 uppercase", levelColor[entry.level],
                        )}
                    >
                        {entry.level}
                    </span>
                    <span className="min-w-0 whitespace-pre-wrap break-words">
                        {entry.message}
                    </span>
                </div>
            ))}
        </div>
    );
}

export { LogConsole };
export type { LogConsoleProps, LogEntry };
