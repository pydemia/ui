import type { ComponentProps } from "react";
import { cn } from "./utils";

function Input({ className, type = "text", ...props }: ComponentProps<"input">) {
    return (
        <input
            type={type}
            className={cn(
                "h-[var(--control-height)] w-full min-w-0 rounded-sm border " +
                "border-border bg-surface px-[var(--space-3)] text-sm text-foreground " +
                "placeholder:text-muted disabled:cursor-not-allowed " +
                "disabled:opacity-50 aria-invalid:border-danger",
                className,
            )}
            {...props}
        />
    );
}

export { Input };
