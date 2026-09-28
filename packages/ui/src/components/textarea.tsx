import type { ComponentProps } from "react";
import { cn } from "./utils";

function Textarea({ className, ...props }: ComponentProps<"textarea">) {
    return (
        <textarea
            className={cn(
                "min-h-24 w-full min-w-0 rounded-sm border border-border " +
                "bg-surface px-[var(--space-3)] py-[var(--space-2)] " +
                "text-sm text-foreground placeholder:text-muted " +
                "disabled:cursor-not-allowed disabled:opacity-50 " +
                "aria-invalid:border-danger",
                className,
            )}
            {...props}
        />
    );
}

export { Textarea };
