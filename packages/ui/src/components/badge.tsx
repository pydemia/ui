import type { ComponentProps } from "react";
import { cn } from "./utils";

function Badge({ className, ...props }: ComponentProps<"span">) {
    return (
        <span
            className={cn(
                "inline-flex items-center rounded-sm border border-border " +
                "bg-surface-subtle px-2 py-0.5 text-xs font-medium text-foreground",
                className,
            )}
            {...props}
        />
    );
}

export { Badge };
