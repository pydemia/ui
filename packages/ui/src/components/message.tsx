import type { ComponentProps } from "react";
import { cn } from "./utils";

type MessageProps = ComponentProps<"div"> & {
    from: "user" | "assistant" | "system";
};

function Message({ from, className, ...props }: MessageProps) {
    const label = from === "user" ? "사용자" : from === "assistant" ? "응답" : "시스템";

    return (
        <div
            role="group"
            aria-label={`${label} 메시지`}
            data-from={from}
            className={cn(
                "group flex max-w-[92%] flex-col gap-1 text-sm " +
                "data-[from=user]:ml-auto data-[from=user]:items-end",
                className,
            )}
            {...props}
        />
    );
}

function MessageContent({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "min-w-0 rounded-sm border border-border bg-surface " +
                "p-[var(--space-3)] [overflow-wrap:anywhere] " +
                "group-data-[from=user]:border-message-user " +
                "group-data-[from=user]:bg-message-user " +
                "group-data-[from=user]:text-message-user-foreground",
                className,
            )}
            {...props}
        />
    );
}

export { Message, MessageContent };
export type { MessageProps };
