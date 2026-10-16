import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import type { ComponentProps } from "react";
import { cn } from "./utils";
import { usePortalContainer } from "./foundation/portal-scope";

function TooltipProvider({
    delayDuration = 300,
    ...props
}: ComponentProps<typeof TooltipPrimitive.Provider>) {
    return <TooltipPrimitive.Provider delayDuration={delayDuration} {...props} />;
}

const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;

function TooltipContent({
    container,
    className,
    sideOffset = 6,
    ...props
}: ComponentProps<typeof TooltipPrimitive.Content> &
    Pick<ComponentProps<typeof TooltipPrimitive.Portal>, "container">) {
    const portalContainer = usePortalContainer(container);
    return (
        <TooltipPrimitive.Portal container={portalContainer}>
            <TooltipPrimitive.Content
                sideOffset={sideOffset}
                className={cn(
                    "z-50 max-w-[min(20rem,calc(100vw-2rem))] rounded-sm bg-foreground " +
                    "[overflow-wrap:anywhere] " +
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
