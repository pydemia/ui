import type { ComponentProps } from "react";
import { cn } from "./utils";

type SkeletonProps = ComponentProps<"div"> & {
    shape?: "rectangle" | "line" | "circle";
};

function Skeleton({
    shape = "rectangle", className, ...props
}: SkeletonProps) {
    if (!["rectangle", "line", "circle"].includes(shape)) {
        throw new RangeError("Skeleton shape is not supported.");
    }

    return (
        <div
            aria-hidden="true"
            data-shape={shape}
            className={cn(
                "animate-pulse bg-border/60 motion-reduce:animate-none",
                shape === "rectangle" && "rounded-sm",
                shape === "line" && "h-3 w-full rounded-full",
                shape === "circle" && "size-10 rounded-full",
                className,
            )}
            {...props}
        />
    );
}

export { Skeleton };
export type { SkeletonProps };
