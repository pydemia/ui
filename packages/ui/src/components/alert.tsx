import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const alertVariants = cva(
    "grid gap-1 rounded-sm border bg-surface p-[var(--space-4)] text-sm",
    {
        variants: {
            variant: {
                default: "border-border text-foreground",
                info: "border-accent text-accent",
                success: "border-success text-success",
                warning: "border-warning text-warning",
                destructive: "border-danger text-danger",
            },
        },
        defaultVariants: { variant: "default" },
    },
);

type AlertProps = ComponentProps<"div"> & VariantProps<typeof alertVariants>;

function Alert({ className, variant, ...props }: AlertProps) {
    return (
        <div
            role={variant === "destructive" ? "alert" : "status"}
            className={cn(alertVariants({ variant }), className)}
            {...props}
        />
    );
}

function AlertTitle({ className, ...props }: ComponentProps<"div">) {
    return <div className={cn("font-semibold", className)} {...props} />;
}

function AlertDescription({ className, ...props }: ComponentProps<"div">) {
    return <div className={cn("leading-relaxed", className)} {...props} />;
}

export { Alert, AlertTitle, AlertDescription };
export type { AlertProps };
