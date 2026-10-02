import type { ComponentProps } from "react";
import { Button } from "./button";
import { cn } from "./utils";

type AgentRunStatus =
    "queued" | "running" | "completed" | "failed" | "cancelled";

type AgentStageStatus =
    "pending" | "running" | "completed" | "failed" | "skipped";

type AgentStage = {
    id: string;
    label: string;
    status: AgentStageStatus;
    detail?: string;
};

type AgentStatusProps = Omit<
    ComponentProps<"section">,
    "aria-label" | "aria-labelledby" | "children"
> & {
    label: string;
    status: AgentRunStatus;
    stages: readonly AgentStage[];
    variant?: "panel" | "compact";
    onCancelTask?: () => void;
    onRetryTask?: () => void;
    actionPending?: boolean;
};

const runLabels: Record<AgentRunStatus, string> = {
    queued: "대기",
    running: "진행 중",
    completed: "완료",
    failed: "실패",
    cancelled: "취소됨",
};

const stageLabels: Record<AgentStageStatus, string> = {
    pending: "대기",
    running: "실행 중",
    completed: "완료",
    failed: "실패",
    skipped: "건너뜀",
};

function AgentStatus({
    label, status, stages, variant = "panel", onCancelTask,
    onRetryTask, actionPending = false, className, ...props
}: AgentStatusProps) {
    if (!label.trim() || !Object.hasOwn(runLabels, status)) {
        throw new Error("AgentStatus requires a name and valid run status.");
    }
    if (variant !== "panel" && variant !== "compact") {
        throw new Error("AgentStatus has an unsupported variant.");
    }
    if (stages.length === 0) {
        throw new Error("AgentStatus requires at least one stage.");
    }
    const ids = new Set<string>();
    for (const stage of stages) {
        if (!stage.id.trim() || !stage.label.trim() ||
            ids.has(stage.id) || !Object.hasOwn(stageLabels, stage.status)) {
            throw new Error(
                "AgentStatus stages need unique IDs, names and statuses.",
            );
        }
        ids.add(stage.id);
    }

    const processed = stages.filter((stage) =>
        stage.status === "completed" || stage.status === "skipped"
    ).length;
    const canCancel = onCancelTask &&
        (status === "queued" || status === "running");
    const canRetry = onRetryTask &&
        (status === "failed" || status === "cancelled");

    return (
        <section aria-label={label} data-status={status}
            data-variant={variant} className={cn(
                "min-w-0 text-foreground",
                variant === "panel"
                    ? "rounded-sm border border-border bg-surface " +
                        "p-[var(--space-4)]"
                    : "border-l-2 border-border pl-[var(--space-3)]",
                className,
            )} {...props}>
            <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                    <strong className="block text-sm font-semibold">
                        {label}
                    </strong>
                    <p role="status" className={cn(
                        "m-0 text-xs",
                        status === "failed" ? "text-danger" :
                            status === "running" ? "text-accent" :
                                "text-muted",
                    )}>
                        {runLabels[status]} · {processed}/{stages.length}단계 처리
                    </p>
                </div>
                {(canCancel || canRetry) && (
                    <div className="flex flex-wrap gap-1">
                        {canCancel && (
                            <Button type="button" variant="outline"
                                disabled={actionPending}
                                onClick={onCancelTask}>작업 취소</Button>
                        )}
                        {canRetry && (
                            <Button type="button" variant="outline"
                                disabled={actionPending}
                                onClick={onRetryTask}>다시 시도</Button>
                        )}
                    </div>
                )}
            </div>
            <progress value={processed} max={stages.length}
                aria-label={`${label} 처리한 단계`}
                aria-valuetext={`${processed}/${stages.length}단계 처리`}
                className={
                    "mt-[var(--space-3)] h-2 w-full " +
                    "[&::-webkit-progress-bar]:rounded-full " +
                    "[&::-webkit-progress-bar]:bg-surface-subtle " +
                    "[&::-webkit-progress-value]:rounded-full " +
                    "[&::-webkit-progress-value]:bg-accent " +
                    "[&::-moz-progress-bar]:bg-accent"
                } />
            <ol aria-label={`${label} 단계`}
                className={cn(
                    "m-0 list-none p-0",
                    variant === "panel"
                        ? "mt-[var(--space-3)] grid gap-2"
                        : "mt-[var(--space-2)] grid gap-1",
                )}>
                {stages.map((stage, index) => (
                    <li key={stage.id} data-status={stage.status}
                        className={cn(
                            "flex min-w-0 items-start gap-2 text-sm",
                            stage.status === "failed"
                                ? "text-danger" : "text-foreground",
                        )}>
                        <span aria-hidden="true"
                            className="w-5 shrink-0 text-right text-muted">
                            {index + 1}.
                        </span>
                        <span className="min-w-0 flex-1">
                            <span className="font-medium">{stage.label}</span>
                            {stage.detail && (
                                <span className="block text-xs text-muted">
                                    {stage.detail}
                                </span>
                            )}
                        </span>
                        <span className={cn(
                            "shrink-0 text-xs",
                            stage.status === "failed" && "text-danger",
                            stage.status === "running" && "text-accent",
                            (stage.status === "pending" ||
                                stage.status === "skipped") && "text-muted",
                        )}>
                            {stageLabels[stage.status]}
                        </span>
                    </li>
                ))}
            </ol>
        </section>
    );
}

export { AgentStatus };
export type {
    AgentStage, AgentStageStatus, AgentRunStatus, AgentStatusProps,
};
