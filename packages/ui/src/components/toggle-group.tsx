import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import type { ComponentProps } from "react";
import { cn } from "./utils";

function ToggleGroup({
    className,
    orientation = "horizontal",
    ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Root>) {
    return (
        <ToggleGroupPrimitive.Root
            orientation={orientation}
            className={cn(
                "inline-flex max-w-full items-center gap-1 rounded-sm " +
                "border border-border bg-surface-subtle p-1 " +
                (orientation === "vertical"
                    ? "flex-col items-stretch"
                    : "flex-row overflow-x-auto"),
                className,
            )}
            {...props}
        />
    );
}

function ToggleGroupItem({
    className,
    ...props
}: ComponentProps<typeof ToggleGroupPrimitive.Item>) {
    return (
        <ToggleGroupPrimitive.Item
            className={cn(
                "inline-flex min-h-[var(--control-height)] shrink-0 " +
                "items-center justify-center rounded-sm px-[var(--space-3)] " +
                "text-sm text-foreground hover:bg-surface " +
                "data-[state=on]:bg-accent " +
                "data-[state=on]:text-accent-foreground " +
                "disabled:pointer-events-none disabled:opacity-50",
                className,
            )}
            {...props}
        />
    );
}

export { ToggleGroup, ToggleGroupItem };
