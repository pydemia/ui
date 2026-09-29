import type { ComponentProps, ReactNode } from "react";
import { cn } from "./utils";

type ToolCallStatus = "pending" | "running" | "succeeded" | "failed";

type ToolCallProps = Omit<ComponentProps<"section">, "children"> & {
    name: string;
    status: ToolCallStatus;
    input?: ReactNode;
    output?: ReactNode;
    error?: ReactNode;
    variant?: "card" | "compact";
};

const statusLabel: Record<ToolCallStatus, string> = {
    pending: "대기",
    running: "실행 중",
    succeeded: "완료",
    failed: "실패",
};

function ToolCall({
    name,
    status,
    input,
    output,
    error,
    variant = "card",
    className,
    ...props
}: ToolCallProps) {
    if (!name.trim()) throw new Error("ToolCall requires a name.");
    if (status === "failed" ? error == null || error === "" : error != null) {
        throw new Error("ToolCall error must match failed status.");
    }
    if (status !== "succeeded" && output != null) {
        throw new Error("ToolCall output requires succeeded status.");
    }

    return (
        <section aria-label={`도구 실행: ${name}`}
            data-status={status}
            className={cn(
                "min-w-0 text-sm text-foreground",
                variant === "card"
                    ? "rounded-sm border border-border bg-surface " +
                    "p-[var(--space-3)]"
                    : "border-l-2 border-border pl-[var(--space-3)]",
                className,
            )} {...props}>
            <div className="flex min-w-0 items-center justify-between gap-2">
                <code className="min-w-0 truncate font-medium">{name}</code>
                <span role="status" className={cn(
                    "shrink-0 text-xs",
                    status === "failed" ? "text-danger" :
                        status === "succeeded" ? "text-accent" : "text-muted",
                )}>
                    {statusLabel[status]}
                </span>
            </div>
            {input != null && (
                <details className="mt-[var(--space-2)] text-muted">
                    <summary className={
                        "cursor-pointer rounded-sm text-xs " +
                        "focus-visible:outline-2 focus-visible:outline-focus"
                    }>입력 보기</summary>
                    <div className={
                        "mt-1 min-w-0 whitespace-pre-wrap break-words " +
                        "font-mono text-xs"
                    }>{input}</div>
                </details>
            )}
            {status === "succeeded" && output != null && (
                <div className="mt-[var(--space-2)] min-w-0">
                    <p className="m-0 text-xs font-medium text-muted">결과</p>
                    <div className="mt-1 whitespace-pre-wrap break-words">
                        {output}
                    </div>
                </div>
            )}
            {status === "failed" && (
                <div className="mt-[var(--space-2)] min-w-0">
                    <p className="m-0 text-xs font-medium text-danger">오류</p>
                    <div className="mt-1 whitespace-pre-wrap break-words">
                        {error}
                    </div>
                </div>
            )}
        </section>
    );
}

export { ToolCall };
export type { ToolCallProps, ToolCallStatus };
