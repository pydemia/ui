import type { ComponentProps, ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import {
    Collapsible, CollapsibleContent, CollapsibleTrigger,
} from "./collapsible";
import { cn } from "./utils";

type ReasoningStatus = "streaming" | "complete" | "failed";

type ReasoningProps = Omit<
    ComponentProps<typeof Collapsible>, "children"
> & {
    label: string;
    status?: ReasoningStatus;
    variant?: "inline" | "card";
    children?: ReactNode;
};

const statusLabel: Record<ReasoningStatus, string> = {
    streaming: "작성 중",
    complete: "완료",
    failed: "중단됨",
};

function Reasoning({
    label,
    status,
    variant = "inline",
    className,
    children,
    ...props
}: ReasoningProps) {
    if (!label.trim()) throw new Error("Reasoning requires a label.");

    return (
        <Collapsible className={cn(
            "group min-w-0 text-sm text-foreground",
            variant === "card"
                ? "rounded-sm border border-border bg-surface"
                : "border-l-2 border-border pl-[var(--space-3)]",
            className,
        )} {...props}>
            <div className={cn(
                "flex min-w-0 items-center gap-[var(--space-2)]",
                variant === "card" && "px-[var(--space-3)] py-[var(--space-2)]",
            )}>
                <CollapsibleTrigger className={
                    "flex min-w-0 flex-1 items-center gap-1 text-left " +
                    "font-medium hover:text-accent focus-visible:outline-2 " +
                    "focus-visible:outline-focus"
                }>
                    <ChevronRight aria-hidden="true" className={
                        "size-4 shrink-0 transition-transform " +
                        "group-data-[state=open]:rotate-90"
                    } />
                    <span className="truncate">{label}</span>
                </CollapsibleTrigger>
                {status && (
                    <span role="status" className={cn(
                        "shrink-0 text-xs",
                        status === "failed" ? "text-danger" : "text-muted",
                    )}>
                        {statusLabel[status]}
                    </span>
                )}
            </div>
            <CollapsibleContent aria-busy={status === "streaming"}
                className={cn(
                    "min-w-0 whitespace-pre-wrap break-words " +
                    "text-sm leading-relaxed text-muted",
                    variant === "card"
                        ? "border-t border-border px-[var(--space-3)] " +
                        "py-[var(--space-2)]"
                        : "pb-[var(--space-2)] pl-5 pt-1",
                )}>
                {children ?? (status === "streaming"
                    ? "내용을 작성하고 있습니다." : null)}
            </CollapsibleContent>
        </Collapsible>
    );
}

export { Reasoning };
export type { ReasoningProps, ReasoningStatus };
