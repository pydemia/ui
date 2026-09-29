import {
    useEffect, useLayoutEffect, useRef, useState,
    type ComponentProps, type ReactNode,
} from "react";
import { Message, MessageContent, type MessageProps } from "./message";
import { cn } from "./utils";

type ConversationMessage = {
    id: string;
    from: MessageProps["from"];
    content: ReactNode;
};

type ConversationProps = Omit<
    ComponentProps<"div">,
    "aria-label" | "children" | "onScroll" | "role"
> & {
    label: string;
    messages: readonly ConversationMessage[];
    emptyMessage?: string;
    busy?: boolean;
    live?: "off" | "polite";
};

function Conversation({
    label,
    messages,
    emptyMessage = "아직 메시지가 없습니다.",
    busy = false,
    live = "polite",
    className,
    ...props
}: ConversationProps) {
    const viewportRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const followingRef = useRef(true);
    const previousRef = useRef<{ count: number; lastId: string | null } | null>(
        null,
    );
    const [unreadCount, setUnreadCount] = useState(0);
    const ids = new Set<string>();

    if (!label.trim()) throw new Error("Conversation requires a label.");
    for (const message of messages) {
        if (!message.id.trim() || ids.has(message.id)) {
            throw new Error("Conversation message ids must be nonempty and unique.");
        }
        ids.add(message.id);
    }

    useLayoutEffect(() => {
        const viewport = viewportRef.current;
        if (!viewport) return;

        const previous = previousRef.current;
        const lastId = messages.at(-1)?.id ?? null;
        const appended = previous !== null &&
            messages.length > previous.count &&
            (previous.count === 0 ||
                messages[previous.count - 1]?.id === previous.lastId);

        if (previous === null || !appended && (
            previous.count !== messages.length || previous.lastId !== lastId
        )) {
            followingRef.current = true;
            setUnreadCount(0);
            viewport.scrollTop = viewport.scrollHeight;
        } else if (appended) {
            if (followingRef.current) {
                viewport.scrollTop = viewport.scrollHeight;
            } else {
                setUnreadCount((count) =>
                    count + messages.length - previous.count
                );
            }
        }
        previousRef.current = { count: messages.length, lastId };
    }, [messages]);

    useEffect(() => {
        const content = contentRef.current;
        const viewport = viewportRef.current;
        if (!content || !viewport || typeof ResizeObserver === "undefined") {
            return;
        }
        const observer = new ResizeObserver(() => {
            if (followingRef.current) viewport.scrollTop = viewport.scrollHeight;
        });
        observer.observe(content);
        return () => observer.disconnect();
    }, []);

    return (
        <div className={cn(
            "relative flex h-80 min-h-0 min-w-0 flex-col overflow-hidden " +
            "rounded-sm border border-border bg-surface text-foreground",
            className,
        )} {...props}>
            <div ref={viewportRef} role="log" aria-label={label}
                aria-live={live} aria-relevant="additions" aria-busy={busy}
                tabIndex={0}
                onScroll={(event) => {
                    const viewport = event.currentTarget;
                    const atEnd = viewport.scrollHeight - viewport.clientHeight -
                        viewport.scrollTop <= 48;
                    followingRef.current = atEnd;
                    if (atEnd) setUnreadCount(0);
                }}
                className={
                    "min-h-0 flex-1 overflow-y-auto p-[var(--space-4)] " +
                    "outline-none focus-visible:outline-2 " +
                    "focus-visible:outline-focus"
                }
            >
                <div ref={contentRef} className="flex flex-col gap-[var(--space-3)]">
                    {messages.length === 0 ? (
                        <p className="m-0 text-sm text-muted">{emptyMessage}</p>
                    ) : messages.map((message) => (
                        <Message key={message.id} from={message.from}>
                            <MessageContent>{message.content}</MessageContent>
                        </Message>
                    ))}
                </div>
            </div>
            {unreadCount > 0 && (
                <button type="button"
                    className={
                        "absolute bottom-[var(--space-3)] left-1/2 " +
                        "-translate-x-1/2 rounded-full border border-border " +
                        "bg-accent px-[var(--space-3)] py-[var(--space-2)] " +
                        "text-xs font-medium text-accent-foreground " +
                        "shadow-[var(--shadow-float)] " +
                        "focus-visible:outline-2 focus-visible:outline-focus"
                    }
                    onClick={() => {
                        const viewport = viewportRef.current;
                        if (!viewport) return;
                        followingRef.current = true;
                        viewport.scrollTop = viewport.scrollHeight;
                        setUnreadCount(0);
                        viewport.focus({ preventScroll: true });
                    }}
                >
                    새 메시지 {unreadCount}개 보기
                </button>
            )}
        </div>
    );
}

export { Conversation };
export type { ConversationMessage, ConversationProps };
