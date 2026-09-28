import type { ComponentProps } from "react";
import { cn } from "./utils";

function Card({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "rounded-sm border border-border bg-surface text-foreground",
                className,
            )}
            {...props}
        />
    );
}

function CardHeader({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cn("grid gap-1 px-[var(--space-4)] pt-[var(--space-4)]", className)}
            {...props}
        />
    );
}

function CardTitle({ className, ...props }: ComponentProps<"div">) {
    return <div className={cn("font-semibold", className)} {...props} />;
}

function CardDescription({ className, ...props }: ComponentProps<"div">) {
    return <div className={cn("text-sm text-muted", className)} {...props} />;
}

function CardContent({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cn("px-[var(--space-4)] py-[var(--space-4)]", className)}
            {...props}
        />
    );
}

function CardFooter({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "flex items-center gap-2 px-[var(--space-4)] " +
                "pb-[var(--space-4)]",
                className,
            )}
            {...props}
        />
    );
}

export {
    Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter,
};
