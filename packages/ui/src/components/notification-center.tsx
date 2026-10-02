import { useId, useRef, useState, type ComponentProps } from "react";
import { cn } from "./utils";

type NotificationItem = {
    id: string;
    title: string;
    message?: string;
    timestamp: string;
    dateTime?: string;
    read: boolean;
    href?: string;
};

type NotificationCenterProps = Omit<
    ComponentProps<"section">, "children"
> & {
    label: string;
    notifications: readonly NotificationItem[];
    onReadChange: (id: string, read: boolean) => void;
    onMarkAllRead?: () => void;
    onOpen?: (id: string) => void;
    appearance?: "panel" | "plain";
    emptyMessage?: string;
};

function NotificationCenter({
    label,
    notifications,
    onReadChange,
    onMarkAllRead,
    onOpen,
    appearance = "panel",
    emptyMessage = "알림이 없습니다.",
    className,
    ...props
}: NotificationCenterProps) {
    const titleId = useId();
    const unreadFilterRef = useRef<HTMLButtonElement>(null);
    const [filter, setFilter] = useState<"all" | "unread">("all");

    if (!label.trim() || !Array.isArray(notifications) ||
        typeof onReadChange !== "function") {
        throw new Error(
            "NotificationCenter requires a label, notifications, " +
            "and onReadChange.",
        );
    }
    if (appearance !== "panel" && appearance !== "plain") {
        throw new RangeError("NotificationCenter appearance is not supported.");
    }
    const ids = new Set<string>();
    for (const item of notifications) {
        if (!item || typeof item.id !== "string" ||
            typeof item.title !== "string" ||
            typeof item.timestamp !== "string" ||
            !item.id.trim() || !item.title.trim() ||
            !item.timestamp.trim() || typeof item.read !== "boolean" ||
            (item.dateTime !== undefined &&
                (typeof item.dateTime !== "string" ||
                    !item.dateTime.trim())) ||
            (item.href !== undefined &&
                (typeof item.href !== "string" || !item.href.trim())) ||
            ids.has(item.id)) {
            throw new Error(
                "NotificationCenter items need unique IDs and " +
                "complete text and read state.",
            );
        }
        ids.add(item.id);
    }

    const unreadCount = notifications.filter((item) => !item.read).length;
    const visible = filter === "unread"
        ? notifications.filter((item) => !item.read)
        : notifications;

    return (
        <section {...props} aria-labelledby={titleId} className={cn(
            "min-w-0 bg-surface text-foreground",
            appearance === "panel" &&
                "overflow-hidden rounded-sm border border-border",
            className,
        )}>
            <div className={cn(
                "flex flex-wrap items-start justify-between gap-2 " +
                "pb-[var(--space-3)]",
                appearance === "panel" &&
                    "border-b border-border p-[var(--space-3)]",
            )}>
                <div className="min-w-0">
                    <h3 id={titleId} className="m-0 text-base font-semibold">
                        {label}
                    </h3>
                    <p className="m-0 mt-1 text-xs text-muted"
                        aria-live="polite">
                        읽지 않음 {unreadCount}건
                    </p>
                </div>
                {onMarkAllRead && unreadCount > 0 && (
                    <button type="button" onClick={() => {
                        if (filter === "unread") {
                            unreadFilterRef.current?.focus();
                        }
                        onMarkAllRead();
                    }} className={
                        "rounded-sm px-2 py-1 text-xs text-accent " +
                        "hover:bg-surface-subtle focus-visible:outline-2 " +
                        "focus-visible:outline-focus"
                    }>
                        모두 읽음으로 표시
                    </button>
                )}
            </div>
            <div role="group" aria-label="알림 필터" className={cn(
                "flex gap-1 py-[var(--space-2)]",
                appearance === "panel" && "px-[var(--space-3)]",
            )}>
                <button type="button" aria-pressed={filter === "all"}
                    onClick={() => setFilter("all")}
                    className={cn(
                        "rounded-sm px-3 py-1 text-sm " +
                        "focus-visible:outline-2 focus-visible:outline-focus",
                        filter === "all" ? "bg-accent text-accent-foreground"
                            : "text-muted hover:bg-surface-subtle",
                    )}>
                    전체
                </button>
                <button ref={unreadFilterRef} type="button"
                    aria-pressed={filter === "unread"}
                    onClick={() => setFilter("unread")}
                    className={cn(
                        "rounded-sm px-3 py-1 text-sm " +
                        "focus-visible:outline-2 focus-visible:outline-focus",
                        filter === "unread"
                            ? "bg-accent text-accent-foreground"
                            : "text-muted hover:bg-surface-subtle",
                    )}>
                    읽지 않음
                </button>
            </div>
            {visible.length === 0 ? (
                <p className={cn(
                    "m-0 py-[var(--space-4)] text-sm text-muted",
                    appearance === "panel" && "px-[var(--space-3)]",
                )}>
                    {filter === "unread" && notifications.length > 0
                        ? "읽지 않은 알림이 없습니다." : emptyMessage}
                </p>
            ) : (
                <ul className="m-0 list-none divide-y divide-border p-0">
                    {visible.map((item) => (
                        <li key={item.id} className={cn(
                            "min-w-0 border-l-2 py-[var(--space-3)]",
                            appearance === "panel" &&
                                "pl-[var(--space-3)] pr-[var(--space-4)]",
                            item.read ? "border-l-transparent"
                                : "border-l-accent bg-accent/5",
                        )}>
                            <div className={
                                "flex min-w-0 items-start justify-between gap-3"
                            }>
                                <div className="min-w-0 flex-1">
                                    {item.href ? (
                                        <a href={item.href}
                                            onClick={() => onOpen?.(item.id)}
                                            className={
                                                "break-words text-sm font-semibold " +
                                                "text-foreground underline-offset-2 " +
                                                "hover:underline focus-visible:" +
                                                "outline-2 focus-visible:outline-focus"
                                            }>
                                            {item.title}
                                        </a>
                                    ) : onOpen ? (
                                        <button type="button"
                                            onClick={() => onOpen(item.id)}
                                            className={
                                                "break-words rounded-sm p-0 text-left " +
                                                "text-sm font-semibold " +
                                                "hover:underline focus-visible:" +
                                                "outline-2 focus-visible:outline-focus"
                                            }>
                                            {item.title}
                                        </button>
                                    ) : (
                                        <strong className={
                                            "break-words text-sm font-semibold"
                                        }>{item.title}</strong>
                                    )}
                                    {item.message && (
                                        <p className={
                                            "m-0 mt-1 break-words text-sm text-muted"
                                        }>{item.message}</p>
                                    )}
                                    <div className={
                                        "mt-2 flex flex-wrap items-center gap-2 " +
                                        "text-xs text-muted"
                                    }>
                                        {item.dateTime ? (
                                            <time dateTime={item.dateTime}>
                                                {item.timestamp}
                                            </time>
                                        ) : <span>{item.timestamp}</span>}
                                        {!item.read && (
                                            <span className="font-medium text-accent">
                                                새 알림
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <button type="button"
                                    aria-label={
                                        `${item.title} ${item.read
                                            ? "읽지 않음" : "읽음"}으로 표시`
                                    }
                                    onClick={() => {
                                        if (filter === "unread" && !item.read) {
                                            unreadFilterRef.current?.focus();
                                        }
                                        onReadChange(item.id, !item.read);
                                    }}
                                    className={
                                        "shrink-0 rounded-sm border border-border " +
                                        "px-2 py-1 text-xs text-muted " +
                                        "hover:bg-surface-subtle focus-visible:" +
                                        "outline-2 focus-visible:outline-focus"
                                    }>
                                    {item.read ? "읽지 않음" : "읽음"}
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export { NotificationCenter };
export type { NotificationCenterProps, NotificationItem };
