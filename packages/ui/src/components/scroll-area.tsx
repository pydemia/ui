import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import type { ComponentProps, Ref } from "react";
import { cn } from "./utils";

type ScrollbarAppearance = "solid" | "subtle" | "minimal";

type ScrollAreaProps = ComponentProps<typeof ScrollAreaPrimitive.Root> & {
    label: string;
    orientation?: "vertical" | "horizontal" | "both";
    viewportRef?: Ref<HTMLDivElement>;
    scrollbarAppearance?: ScrollbarAppearance;
};

function ScrollArea({
    label,
    orientation = "vertical",
    viewportRef,
    type = "auto",
    scrollbarAppearance = "solid",
    className,
    children,
    ...props
}: ScrollAreaProps) {
    if (!label.trim()) throw new Error("ScrollArea requires a label.");
    if (!["vertical", "horizontal", "both"].includes(orientation)) {
        throw new RangeError("ScrollArea orientation is not supported.");
    }

    if (!["solid", "subtle", "minimal"].includes(scrollbarAppearance)) {
        throw new RangeError("ScrollArea scrollbar appearance is not supported.");
    }

    return (
        <ScrollAreaPrimitive.Root
            data-ui="scroll-area"
            type={type}
            className={cn("relative", className)}
            {...props}
        >
            <ScrollAreaPrimitive.Viewport
                data-slot="scroll-viewport"
                ref={viewportRef}
                role="region"
                aria-label={label}
                tabIndex={0}
                className="size-full rounded-[inherit]"
            >
                {children}
            </ScrollAreaPrimitive.Viewport>
            {(orientation === "vertical" || orientation === "both") && (
                <ScrollBar orientation="vertical" appearance={scrollbarAppearance} />
            )}
            {(orientation === "horizontal" || orientation === "both") && (
                <ScrollBar orientation="horizontal" appearance={scrollbarAppearance} />
            )}
            {orientation === "both" && <ScrollAreaPrimitive.Corner />}
        </ScrollAreaPrimitive.Root>
    );
}

function ScrollBar({
    orientation,
    appearance,
}: { orientation: "vertical" | "horizontal"; appearance: ScrollbarAppearance }) {
    return (
        <ScrollAreaPrimitive.Scrollbar
            orientation={orientation}
            data-slot="scrollbar"
            data-scrollbar-appearance={appearance}
            className={cn(
                "group/scrollbar flex touch-none select-none p-px",
                orientation === "vertical"
                    ? "h-full w-2.5"
                    : "h-2.5 flex-col",
            )}
        >
            <ScrollAreaPrimitive.Thumb
                data-slot="scroll-thumb"
                className={cn(
                    "relative flex-1 rounded-full bg-muted",
                    appearance !== "solid" &&
                        "opacity-65 group-hover/scrollbar:opacity-100 group-active/scrollbar:opacity-100 motion-safe:transition-opacity forced-colors:opacity-100",
                    appearance === "minimal" && cn(
                        "border-solid border-transparent bg-clip-padding forced-colors:border-0",
                        orientation === "vertical" ? "border-x-2" : "border-y-2",
                    ),
                )}
            />
        </ScrollAreaPrimitive.Scrollbar>
    );
}

export { ScrollArea };
export type { ScrollAreaProps };
