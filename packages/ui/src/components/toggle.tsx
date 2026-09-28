import * as TogglePrimitive from "@radix-ui/react-toggle";
import type { ComponentProps } from "react";
import { cn } from "./utils";

function Toggle({
    className,
    ...props
}: ComponentProps<typeof TogglePrimitive.Root>) {
    return (
        <TogglePrimitive.Root
            className={cn(
                "inline-flex min-h-[var(--control-height)] min-w-[var(--control-height)] " +
                "items-center justify-center rounded-sm border border-border " +
                "bg-surface px-[var(--space-2)] text-sm " +
                "data-[state=on]:border-accent data-[state=on]:bg-accent " +
                "data-[state=on]:text-accent-foreground " +
                "disabled:pointer-events-none disabled:opacity-50",
                className,
            )}
            {...props}
        />
    );
}

export { Toggle };
