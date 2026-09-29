import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import type { ComponentProps, Ref } from "react";
import { cn } from "./utils";

type ScrollAreaProps = ComponentProps<typeof ScrollAreaPrimitive.Root> & {
    label: string;
    orientation?: "vertical" | "horizontal" | "both";
    viewportRef?: Ref<HTMLDivElement>;
};

function ScrollArea({
    label,
    orientation = "vertical",
    viewportRef,
    type = "auto",
    className,
    children,
    ...props
}: ScrollAreaProps) {
    if (!label.trim()) throw new Error("ScrollArea requires a label.");
    if (!["vertical", "horizontal", "both"].includes(orientation)) {
        throw new RangeError("ScrollArea orientation is not supported.");
    }

    return (
        <ScrollAreaPrimitive.Root
            type={type}
            className={cn("relative", className)}
            {...props}
        >
            <ScrollAreaPrimitive.Viewport
                ref={viewportRef}
                role="region"
                aria-label={label}
                tabIndex={0}
                className="size-full rounded-[inherit]"
            >
                {children}
            </ScrollAreaPrimitive.Viewport>
            {(orientation === "vertical" || orientation === "both") && (
                <ScrollBar orientation="vertical" />
            )}
            {(orientation === "horizontal" || orientation === "both") && (
                <ScrollBar orientation="horizontal" />
            )}
            {orientation === "both" && <ScrollAreaPrimitive.Corner />}
        </ScrollAreaPrimitive.Root>
    );
}

function ScrollBar({
    orientation,
}: { orientation: "vertical" | "horizontal" }) {
    return (
        <ScrollAreaPrimitive.Scrollbar
            orientation={orientation}
            className={cn(
                "flex touch-none select-none p-px transition-colors",
                orientation === "vertical"
                    ? "h-full w-2.5"
                    : "h-2.5 flex-col",
            )}
        >
            <ScrollAreaPrimitive.Thumb
                className="relative flex-1 rounded-full bg-muted"
            />
        </ScrollAreaPrimitive.Scrollbar>
    );
}

export { ScrollArea };
export type { ScrollAreaProps };
