import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { ComponentProps } from "react";
import { cn } from "./utils";

function TooltipProvider({
    delayDuration = 300,
    ...props
}: ComponentProps<typeof TooltipPrimitive.Provider>) {
    return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />;
}

const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

function TooltipContent({
    className,
    sideOffset = 6,
    ...props
}: ComponentProps<typeof TooltipPrimitive.Content>) {
    return (
        <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
                sideOffset={sideOffset}
                className={cn(
                    "z-50 max-w-xs rounded-sm bg-foreground " +
                    "px-[var(--space-2)] py-[var(--space-1)] " +
                    "text-xs text-background shadow-[var(--shadow-float)]",
                    className,
                )}
                {...props}
            />
        </TooltipPrimitive.Portal>
    );
}

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent };
