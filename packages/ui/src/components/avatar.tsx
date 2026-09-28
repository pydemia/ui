import * as AvatarPrimitive from "@radix-ui/react-avatar";
import type { ComponentProps } from "react";
import { cn } from "./utils";

function Avatar({ className, ...props }: ComponentProps<typeof AvatarPrimitive.Root>) {
    return (
        <AvatarPrimitive.Root
            className={cn(
                "relative flex size-9 shrink-0 overflow-hidden rounded-full " +
                "border border-border bg-surface-subtle",
                className,
            )}
            {...props}
        />
    );
}

function AvatarImage({
    className,
    ...props
}: ComponentProps<typeof AvatarPrimitive.Image>) {
    return (
        <AvatarPrimitive.Image
            className={cn("size-full object-cover", className)}
            {...props}
        />
    );
}

function AvatarFallback({
    className,
    ...props
}: ComponentProps<typeof AvatarPrimitive.Fallback>) {
    return (
        <AvatarPrimitive.Fallback
            className={cn(
                "flex size-full items-center justify-center text-xs font-medium",
                className,
            )}
            {...props}
        />
    );
}

export { Avatar, AvatarImage, AvatarFallback };
