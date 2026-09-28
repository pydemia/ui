import type { ComponentProps } from "react";
import { cn } from "./utils";

function Empty({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "flex min-w-0 flex-col items-center gap-3 rounded-sm border " +
                "border-dashed border-border bg-surface-subtle " +
                "p-[var(--space-6)] text-center",
                className,
            )}
            {...props}
        />
    );
}

function EmptyMedia({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            aria-hidden="true"
            className={cn("text-muted [&_svg]:size-6", className)}
            {...props}
        />
    );
}

function EmptyTitle({ className, ...props }: ComponentProps<"h3">) {
    return <h3 className={cn("font-semibold", className)} {...props} />;
}

function EmptyDescription({ className, ...props }: ComponentProps<"p">) {
    return <p className={cn("text-sm text-muted", className)} {...props} />;
}

function EmptyContent({ className, ...props }: ComponentProps<"div">) {
    return <div className={cn("flex flex-wrap justify-center gap-2", className)} {...props} />;
}

export { Empty, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent };
