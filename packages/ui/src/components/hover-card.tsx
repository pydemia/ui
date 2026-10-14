import * as HoverCardPrimitive from "@radix-ui/react-hover-card";
import type { ComponentProps } from "react";
import { cn } from "./utils";
import { usePortalContainer } from "./foundation/portal-scope";

const HoverCard = HoverCardPrimitive.Root;
const HoverCardTrigger = HoverCardPrimitive.Trigger;

function HoverCardContent({
    container,
    className,
    align = "center",
    sideOffset = 6,
    ...props
}: ComponentProps<typeof HoverCardPrimitive.Content> &
    Pick<ComponentProps<typeof HoverCardPrimitive.Portal>, "container">) {
    const portalContainer = usePortalContainer(container);
    return (
        <HoverCardPrimitive.Portal container={portalContainer}>
            <HoverCardPrimitive.Content
                data-ui="overlay-panel"
                align={align}
                sideOffset={sideOffset}
                className={cn(
                    "z-50 w-72 max-w-[calc(100vw-2rem)] rounded-sm " +
                    "border border-border bg-surface p-[var(--space-4)] " +
                    "text-foreground shadow-[var(--shadow-float)]",
                    className,
                )}
                {...props}
            />
        </HoverCardPrimitive.Portal>
    );
}

export { HoverCard, HoverCardTrigger, HoverCardContent };
