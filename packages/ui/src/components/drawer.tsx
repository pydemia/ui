import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { ComponentProps } from "react";
import { cn } from "./utils";

const Drawer = DialogPrimitive.Root;
const DrawerTrigger = DialogPrimitive.Trigger;
const DrawerClose = DialogPrimitive.Close;
const DrawerTitle = DialogPrimitive.Title;
const DrawerDescription = DialogPrimitive.Description;

type DrawerContentProps = ComponentProps<typeof DialogPrimitive.Content> & {
    side?: "left" | "right" | "bottom";
};

function DrawerContent({
    side = "right", className, children, ...props
}: DrawerContentProps) {
    const position = {
        left: "inset-y-0 left-0 w-[min(26rem,calc(100vw-2rem))]",
        right: "inset-y-0 right-0 w-[min(26rem,calc(100vw-2rem))]",
        bottom: "inset-x-0 bottom-0 max-h-[80dvh] w-full",
    }[side];

    return (
        <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay
                className="fixed inset-0 z-50 bg-[var(--overlay)]"
            />
            <DialogPrimitive.Content
                className={cn(
                    "fixed z-50 overflow-y-auto border border-border " +
                    "bg-surface p-[var(--space-6)] text-foreground " +
                    "shadow-[var(--shadow-float)] focus-visible:outline-none " +
                    "focus-visible:ring-2 focus-visible:ring-accent",
                    position,
                    className,
                )}
                {...props}
            >
                {children}
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    );
}

function DrawerHeader({ className, ...props }: ComponentProps<"div">) {
    return <div className={cn("grid gap-2", className)} {...props} />;
}

function DrawerFooter({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cn("mt-6 flex flex-wrap justify-end gap-2", className)}
            {...props}
        />
    );
}

export {
    Drawer, DrawerTrigger, DrawerClose, DrawerContent,
    DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription,
};
export type { DrawerContentProps };
