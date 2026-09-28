import type { ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "./utils";

function NativeSelect({ className, ...props }: ComponentProps<"select">) {
    return (
        <div className="relative w-full">
            <select
                className={cn(
                    "h-[var(--control-height)] w-full appearance-none rounded-sm " +
                    "border border-border bg-surface px-[var(--space-3)] " +
                    "pr-9 text-sm text-foreground disabled:cursor-not-allowed " +
                    "disabled:opacity-50 aria-invalid:border-danger",
                    className,
                )}
                {...props}
            />
            <ChevronDown
                aria-hidden="true"
                className={
                    "pointer-events-none absolute right-3 top-1/2 size-4 " +
                    "-translate-y-1/2 text-muted"
                }
            />
        </div>
    );
}

export { NativeSelect };
