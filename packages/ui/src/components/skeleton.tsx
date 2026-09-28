import type { ComponentProps } from "react";
import { cn } from "./utils";

function Skeleton({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            aria-hidden="true"
            className={cn("animate-pulse rounded-sm bg-border/60", className)}
            {...props}
        />
    );
}

export { Skeleton };
