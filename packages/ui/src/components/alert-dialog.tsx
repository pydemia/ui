import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import type { ComponentProps } from "react";
import { cn } from "./utils";

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;
const AlertDialogAction = AlertDialogPrimitive.Action;
const AlertDialogCancel = AlertDialogPrimitive.Cancel;

function AlertDialogContent({
    className,
    ...props
}: ComponentProps<typeof AlertDialogPrimitive.Content>) {
    return (
        <AlertDialogPrimitive.Portal>
            <AlertDialogPrimitive.Overlay
                className="fixed inset-0 z-50 bg-[var(--overlay)]"
            />
            <AlertDialogPrimitive.Content
                className={cn(
                    "fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] " +
                    "w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 " +
                    "-translate-y-1/2 overflow-y-auto rounded-sm border " +
                    "border-border bg-surface p-[var(--space-6)] " +
                    "text-foreground shadow-[var(--shadow-float)]",
                    className,
                )}
                {...props}
            />
        </AlertDialogPrimitive.Portal>
    );
}

function AlertDialogHeader({ className, ...props }: ComponentProps<"div">) {
    return <div className={cn("grid gap-2", className)} {...props} />;
}

function AlertDialogFooter({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cn("mt-6 flex flex-wrap justify-end gap-2", className)}
            {...props}
        />
    );
}

function AlertDialogTitle({
    className,
    ...props
}: ComponentProps<typeof AlertDialogPrimitive.Title>) {
    return (
        <AlertDialogPrimitive.Title
            className={cn("text-base font-semibold", className)}
            {...props}
        />
    );
}

function AlertDialogDescription({
    className,
    ...props
}: ComponentProps<typeof AlertDialogPrimitive.Description>) {
    return (
        <AlertDialogPrimitive.Description
            className={cn("text-sm text-muted", className)}
            {...props}
        />
    );
}

export {
    AlertDialog, AlertDialogTrigger, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogHeader, AlertDialogFooter,
    AlertDialogTitle, AlertDialogDescription,
};
