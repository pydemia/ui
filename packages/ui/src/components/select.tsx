import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "./utils";

const Select = SelectPrimitive.Root;
const SelectValue = SelectPrimitive.Value;
const SelectGroup = SelectPrimitive.Group;

type SelectTriggerProps = ComponentProps<typeof SelectPrimitive.Trigger> & {
    appearance?: "outline" | "filled" | "underline";
};

function SelectTrigger({
    appearance = "outline",
    className,
    children,
    ...props
}: SelectTriggerProps) {
    if (!["outline", "filled", "underline"].includes(appearance)) {
        throw new RangeError("SelectTrigger appearance is not supported.");
    }

    return (
        <SelectPrimitive.Trigger
            data-appearance={appearance}
            className={cn(
                "flex h-[var(--control-height)] w-full items-center " +
                "justify-between gap-2 rounded-sm border border-border " +
                "bg-surface px-[var(--space-3)] text-sm text-foreground " +
                "data-[placeholder]:text-muted disabled:cursor-not-allowed " +
                "disabled:opacity-50 aria-invalid:border-danger",
                appearance === "filled" &&
                    "border-transparent bg-surface-subtle",
                appearance === "underline" &&
                    "rounded-none border-x-0 border-t-0 bg-transparent px-0",
                className,
            )}
            {...props}
        >
            {children}
            <SelectPrimitive.Icon asChild>
                <ChevronDown aria-hidden="true" className="size-4 shrink-0" />
            </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
    );
}

function SelectContent({
    className,
    children,
    position = "popper",
    sideOffset = 4,
    ...props
}: ComponentProps<typeof SelectPrimitive.Content>) {
    return (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Content
                position={position}
                sideOffset={sideOffset}
                className={cn(
                    "z-50 max-h-64 min-w-[var(--radix-select-trigger-width)] " +
                    "overflow-hidden rounded-sm border border-border bg-surface " +
                    "text-foreground shadow-[var(--shadow-float)]",
                    className,
                )}
                {...props}
            >
                <SelectPrimitive.Viewport className="p-1">
                    {children}
                </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
    );
}

function SelectItem({
    className,
    children,
    ...props
}: ComponentProps<typeof SelectPrimitive.Item>) {
    return (
        <SelectPrimitive.Item
            className={cn(
                "relative flex min-h-9 cursor-default select-none items-center " +
                "rounded-sm py-2 pl-8 pr-2 text-sm outline-none " +
                "data-[highlighted]:bg-surface-subtle " +
                "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                className,
            )}
            {...props}
        >
            <span className="absolute left-2 flex size-4 items-center justify-center">
                <SelectPrimitive.ItemIndicator>
                    <Check aria-hidden="true" className="size-4" />
                </SelectPrimitive.ItemIndicator>
            </span>
            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        </SelectPrimitive.Item>
    );
}

export { Select, SelectValue, SelectGroup, SelectTrigger, SelectContent, SelectItem };
export type { SelectTriggerProps };
