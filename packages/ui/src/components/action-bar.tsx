import type { ComponentProps, ReactNode } from "react";
import { Button } from "./button";
import { cn } from "./utils";

type ActionBarProps = Omit<ComponentProps<"div">, "children"> & {
    "aria-label": string;
    selectedCount: number;
    onClear: () => void;
    children?: ReactNode;
    placement?: "inline" | "floating";
    countText?: string;
    clearLabel?: string;
};

function ActionBar({
    selectedCount,
    onClear,
    children,
    placement = "inline",
    countText = `${selectedCount}건 선택`,
    clearLabel = "선택 해제",
    className,
    ...props
}: ActionBarProps) {
    if (!props["aria-label"]?.trim()) {
        throw new Error("ActionBar requires an accessible label.");
    }
    if (!Number.isInteger(selectedCount) || selectedCount < 0) {
        throw new RangeError("ActionBar selectedCount must be non-negative.");
    }
    if (placement !== "inline" && placement !== "floating") {
        throw new RangeError("ActionBar placement is not supported.");
    }

    return (
        <div
            {...props}
            role="group"
            className={cn(
                "flex max-w-full flex-wrap items-center gap-2 rounded-sm " +
                "border border-border bg-surface p-[var(--space-3)] " +
                "text-sm text-foreground",
                placement === "floating" &&
                    "sticky bottom-[var(--space-3)] z-20 mx-auto w-fit " +
                    "shadow-[var(--shadow-float)]",
                className,
            )}
        >
            <span role="status" className="mr-auto font-medium">
                {countText}
            </span>
            {children}
            <Button variant="ghost" disabled={selectedCount === 0}
                onClick={onClear}>{clearLabel}</Button>
        </div>
    );
}

export { ActionBar };
export type { ActionBarProps };
