import { useId, type ComponentProps, type ReactNode } from "react";
import { Button } from "./button";
import {
    Empty, EmptyContent, EmptyDescription, EmptyMedia, EmptyTitle,
} from "./empty";
import { Spinner } from "./spinner";
import { cn } from "./utils";

type ResultStatus = "pending" | "success" | "error";

type ResultStateProps = Omit<
    ComponentProps<"div">,
    "children" | "role" | "tabIndex" | "aria-labelledby" |
        "aria-describedby"
> & {
    status: ResultStatus;
    title: string;
    description?: string;
    appearance?: "panel" | "plain";
    actions?: ReactNode;
    onRetry?: () => void;
    retryLabel?: string;
};

const statusLabels: Record<ResultStatus, string> = {
    pending: "진행 중",
    success: "완료",
    error: "실패",
};

function ResultState({
    status,
    title,
    description,
    appearance = "panel",
    actions,
    onRetry,
    retryLabel = "다시 시도",
    className,
    ...props
}: ResultStateProps) {
    const statusId = useId();
    const titleId = useId();
    const descriptionId = useId();

    if (!Object.hasOwn(statusLabels, status)) {
        throw new RangeError("ResultState status is not supported.");
    }
    if (typeof title !== "string" || !title.trim()) {
        throw new Error("ResultState requires a title.");
    }
    if (appearance !== "panel" && appearance !== "plain") {
        throw new RangeError("ResultState appearance is not supported.");
    }
    if (onRetry !== undefined && typeof onRetry !== "function") {
        throw new TypeError("ResultState onRetry must be a function.");
    }
    if (onRetry && !retryLabel.trim()) {
        throw new Error("ResultState retryLabel must not be empty.");
    }

    return (
        <Empty
            {...props}
            role={status === "error" ? "alert" : "status"}
            aria-labelledby={`${statusId} ${titleId}`}
            aria-describedby={description ? descriptionId : undefined}
            data-status={status}
            tabIndex={-1}
            appearance={appearance}
            className={cn("gap-2", className)}
        >
            <EmptyMedia className={cn(
                status === "success" && "text-success",
                status === "error" && "text-danger",
            )}>
                {status === "pending" ? (
                    <Spinner variant="ring" aria-hidden="true" />
                ) : (
                    <svg viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2"
                        strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="9" />
                        {status === "success" ? (
                            <path d="m8 12 3 3 5-6" />
                        ) : (
                            <path d="m9 9 6 6m0-6-6 6" />
                        )}
                    </svg>
                )}
            </EmptyMedia>
            <p id={statusId} className={cn(
                "m-0 text-xs font-medium",
                status === "pending" && "text-accent",
                status === "success" && "text-success",
                status === "error" && "text-danger",
            )}>
                {statusLabels[status]}
            </p>
            <EmptyTitle id={titleId}>{title}</EmptyTitle>
            {description && (
                <EmptyDescription id={descriptionId}>
                    {description}
                </EmptyDescription>
            )}
            {(actions || (status === "error" && onRetry)) && (
                <EmptyContent>
                    {status === "error" && onRetry && (
                        <Button variant="outline" type="button"
                            onClick={(event) => {
                                if (event.detail === 0) {
                                    event.currentTarget
                                        .closest<HTMLElement>("[data-status]")
                                        ?.focus({ preventScroll: true });
                                }
                                onRetry();
                            }}>
                            {retryLabel}
                        </Button>
                    )}
                    {actions}
                </EmptyContent>
            )}
        </Empty>
    );
}

export { ResultState };
export type { ResultStateProps, ResultStatus };
