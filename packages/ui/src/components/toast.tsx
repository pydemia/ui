import {
    useCallback, useEffect, useRef, useState,
    type ComponentProps, type ReactNode,
} from "react";
import { cn } from "./utils";

type ToastRegionProps = ComponentProps<"div"> & {
    placement?: "top-right" | "bottom-right" | "bottom-left";
};

function ToastRegion({
    placement = "bottom-right",
    className,
    ...props
}: ToastRegionProps) {
    return (
        <div
            className={cn(
                "pointer-events-none fixed z-50 grid w-[min(24rem,calc(100vw-2rem))] " +
                "gap-[var(--space-2)]",
                placement === "top-right" && "right-4 top-4",
                placement === "bottom-right" && "bottom-4 right-4",
                placement === "bottom-left" && "bottom-4 left-4",
                className,
            )}
            {...props}
        />
    );
}

type ToastProps = Omit<ComponentProps<"div">, "title"> & {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: ReactNode;
    action?: ReactNode;
    variant?: "info" | "success" | "warning" | "error";
    statusLabel?: string;
    closeLabel?: string;
};

const variantLabel = {
    info: "Info",
    success: "Success",
    warning: "Warning",
    error: "Error",
} as const;

function Toast({
    open,
    onOpenChange,
    title,
    description,
    action,
    variant = "info",
    statusLabel,
    closeLabel = "Dismiss notification",
    className,
    ...props
}: ToastProps) {
    const returnFocus = useRef<HTMLElement | null>(null);
    useEffect(() => {
        if (open && document.activeElement instanceof HTMLElement) {
            returnFocus.current = document.activeElement;
        }
    }, [open]);

    if (!open) return null;

    return (
        <div
            className={cn(
                "pointer-events-auto min-w-0 rounded-sm border border-border " +
                "border-l-4 bg-surface p-[var(--space-4)] text-foreground " +
                "shadow-[var(--shadow-float)]",
                variant === "error" ? "border-l-danger" : "border-l-accent",
                className,
            )}
            {...props}
        >
            <div className="flex items-start gap-[var(--space-3)]">
                <div className="min-w-0 flex-1"
                    role={variant === "error" ? "alert" : "status"}
                    aria-atomic="true">
                    <span className="text-xs font-semibold uppercase text-muted">
                        {statusLabel ?? variantLabel[variant]}
                    </span>
                    <p className="m-0 mt-1 text-sm font-semibold">{title}</p>
                    {description && (
                        <p className="mb-0 mt-1 text-sm text-muted">
                            {description}
                        </p>
                    )}
                </div>
                <button
                    type="button"
                    aria-label={closeLabel}
                    className={
                        "-mr-1 -mt-1 rounded-sm p-1 text-muted " +
                        "hover:bg-surface-subtle hover:text-foreground " +
                        "focus-visible:outline-2 focus-visible:outline-focus"
                    }
                    onClick={() => {
                        onOpenChange(false);
                        returnFocus.current?.focus();
                    }}
                >
                    <span aria-hidden="true">×</span>
                </button>
            </div>
            {action && <div className="mt-[var(--space-3)]">{action}</div>}
        </div>
    );
}

type ToastDraft = Pick<
    ToastProps,
    "title" | "description" | "action" | "variant" | "statusLabel" |
    "closeLabel"
> & {
    dedupeKey?: string;
};

type ToastNotice = ToastDraft & { id: number };

function useToastQueue(maxVisible = 3) {
    if (!Number.isInteger(maxVisible) || maxVisible < 1) {
        throw new RangeError("Toast queue maxVisible must be a positive integer.");
    }

    const [notices, setNotices] = useState<ToastNotice[]>([]);
    const nextId = useRef(0);

    const enqueue = useCallback((draft: ToastDraft) => {
        const id = ++nextId.current;
        setNotices((current) => {
            if (draft.dedupeKey !== undefined && current.some(
                (notice) => notice.dedupeKey === draft.dedupeKey,
            )) {
                return current;
            }
            return [...current, { ...draft, id }];
        });
    }, []);

    const dismiss = useCallback((id: number) => {
        setNotices((current) => current.filter((notice) => notice.id !== id));
    }, []);

    return {
        visible: notices.slice(0, maxVisible),
        pendingCount: Math.max(0, notices.length - maxVisible),
        enqueue,
        dismiss,
    };
}

type ToastQueueProps = Omit<ToastRegionProps, "children"> & {
    notices: readonly ToastNotice[];
    onDismiss: (id: number) => void;
};

function ToastQueue({
    notices,
    onDismiss,
    ...props
}: ToastQueueProps) {
    return (
        <ToastRegion {...props}>
            {notices.map((notice) => (
                <Toast
                    key={notice.id}
                    open
                    onOpenChange={(open) => {
                        if (!open) onDismiss(notice.id);
                    }}
                    title={notice.title}
                    description={notice.description}
                    action={notice.action}
                    variant={notice.variant}
                    statusLabel={notice.statusLabel}
                    closeLabel={notice.closeLabel}
                />
            ))}
        </ToastRegion>
    );
}

export { ToastRegion, Toast, ToastQueue, useToastQueue };
export type {
    ToastRegionProps, ToastProps, ToastDraft, ToastNotice,
    ToastQueueProps,
};
