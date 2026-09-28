import * as ProgressPrimitive from "@radix-ui/react-progress";
import type { ComponentProps } from "react";
import { cn } from "./utils";

function Progress({
    className,
    value = 0,
    max = 100,
    ...props
}: ComponentProps<typeof ProgressPrimitive.Root>) {
    let percentage = 100;
    if (value !== null) {
        percentage = max > 0
            ? Math.max(0, Math.min(100, (value / max) * 100))
            : 0;
    }

    return (
        <ProgressPrimitive.Root
            value={value}
            max={max}
            className={cn(
                "group h-2 w-full overflow-hidden rounded-full bg-surface-subtle",
                className,
            )}
            {...props}
        >
            <ProgressPrimitive.Indicator
                className={"block h-full rounded-full bg-accent " +
                    "transition-[width] duration-[var(--motion-fast)] " +
                    "group-data-[state=indeterminate]:animate-pulse"}
                style={{ width: `${percentage}%` }}
            />
        </ProgressPrimitive.Root>
    );
}

export { Progress };
