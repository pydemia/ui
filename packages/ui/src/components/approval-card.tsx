import { useId, useRef, useState,
    type ComponentProps, type ReactNode } from "react";
import { Button } from "./button";
import { cn } from "./utils";

type ApprovalStatus = "requested" | "approved" | "rejected" | "expired";
type ApprovalDecision = "approve" | "reject";

type ApprovalCardProps = Omit<ComponentProps<"section">, "children" | "title"> & {
    requestId: string;
    title: string;
    description: ReactNode;
    status: ApprovalStatus;
    onDecision: (decision: ApprovalDecision, requestId: string) =>
        void | Promise<void>;
    decisionErrorMessage?: string;
};

const statusLabel: Record<ApprovalStatus, string> = {
    requested: "승인 요청",
    approved: "승인됨",
    rejected: "거절됨",
    expired: "요청 만료",
};

function ApprovalCard({
    requestId, title, description, status, onDecision,
    decisionErrorMessage = "결정을 전달하지 못했습니다. 다시 시도하세요.",
    className, ...props
}: ApprovalCardProps) {
    const titleId = useId();
    const descriptionId = useId();
    const pendingIds = useRef(new Set<string>());
    const submittedIds = useRef(new Set<string>());
    const [submission, setSubmission] = useState<{
        requestId: string;
        phase: "pending" | "sent" | "error";
    } | null>(null);

    if (!requestId.trim()) {
        throw new Error("ApprovalCard requires a requestId.");
    }
    if (!title.trim()) {
        throw new Error("ApprovalCard requires a title.");
    }
    if (description == null || description === "") {
        throw new Error("ApprovalCard requires a description.");
    }
    if (!Object.hasOwn(statusLabel, status)) {
        throw new Error("ApprovalCard received an unsupported status.");
    }

    const pending = pendingIds.current.has(requestId);
    const sent = submittedIds.current.has(requestId);
    const failed = submission?.requestId === requestId &&
        submission.phase === "error" && !pending && !sent;

    async function decide(decision: ApprovalDecision) {
        if (status !== "requested" || pendingIds.current.has(requestId) ||
            submittedIds.current.has(requestId)) return;
        pendingIds.current.add(requestId);
        setSubmission({ requestId, phase: "pending" });
        try {
            await onDecision(decision, requestId);
            pendingIds.current.delete(requestId);
            submittedIds.current.add(requestId);
            setSubmission({ requestId, phase: "sent" });
        } catch {
            pendingIds.current.delete(requestId);
            setSubmission({ requestId, phase: "error" });
        }
    }

    return (
        <section {...props} aria-labelledby={titleId}
            aria-describedby={descriptionId}
            aria-busy={pending}
            data-status={status}
            className={cn(
                "min-w-0 rounded-sm border border-border bg-surface " +
                "p-[var(--space-3)] text-foreground",
                className,
            )}>
            <div className="flex flex-wrap items-start justify-between gap-2">
                <h3 id={titleId} className="m-0 text-sm font-semibold">
                    {title}
                </h3>
                <span role="status" className={cn(
                    "text-xs",
                    status === "rejected" || status === "expired"
                        ? "text-muted" : "text-accent",
                )}>
                    {status === "requested" && pending ? "결정 전달 중…"
                        : status === "requested" && sent ? "결정 전달됨"
                            : statusLabel[status]}
                </span>
            </div>
            <div id={descriptionId}
                className="mt-[var(--space-2)] min-w-0 break-words text-sm text-muted">
                {description}
            </div>
            {status === "requested" && !sent && (
                <div className="mt-[var(--space-3)] flex flex-wrap gap-2">
                    <Button disabled={pending} onClick={() => void decide("approve")}>
                        승인
                    </Button>
                    <Button variant="outline" disabled={pending}
                        onClick={() => void decide("reject")}>
                        거절
                    </Button>
                </div>
            )}
            {status === "requested" && failed && (
                <p role="alert" className={
                    "m-0 mt-[var(--space-2)] text-sm text-danger"
                }>
                    {decisionErrorMessage}
                </p>
            )}
        </section>
    );
}

export { ApprovalCard };
export type { ApprovalCardProps, ApprovalDecision, ApprovalStatus };
