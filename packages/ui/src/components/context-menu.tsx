import * as MenuPrimitive from "@radix-ui/react-context-menu";
import { Check, ChevronRight, Dot } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "./utils";

const ContextMenu = MenuPrimitive.Root;
const ContextMenuTrigger = MenuPrimitive.Trigger;
const ContextMenuGroup = MenuPrimitive.Group;
const ContextMenuSub = MenuPrimitive.Sub;
const ContextMenuRadioGroup = MenuPrimitive.RadioGroup;

const itemStyle =
    "relative flex cursor-default select-none items-center gap-2 " +
    "rounded-sm px-[var(--space-3)] py-2 text-sm outline-none " +
    "data-[highlighted]:bg-surface-subtle " +
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50";

const contentStyle =
    "z-50 min-w-40 max-h-[var(--radix-context-menu-content-available-height)] " +
    "overflow-y-auto rounded-sm border border-border bg-surface " +
    "p-1 text-foreground shadow-[var(--shadow-float)]";

function ContextMenuContent({
    className, ...props
}: ComponentProps<typeof MenuPrimitive.Content>) {
    return (
        <MenuPrimitive.Portal>
            <MenuPrimitive.Content
                className={cn(contentStyle, className)}
                {...props}
            />
        </MenuPrimitive.Portal>
    );
}

type ContextMenuItemProps =
    ComponentProps<typeof MenuPrimitive.Item> & {
        variant?: "default" | "danger";
    };

function ContextMenuItem({
    className, variant = "default", ...props
}: ContextMenuItemProps) {
    return (
        <MenuPrimitive.Item
            className={cn(
                itemStyle,
                variant === "danger" && "text-danger",
                className,
            )}
            {...props}
        />
    );
}

function ContextMenuLabel({
    className, ...props
}: ComponentProps<typeof MenuPrimitive.Label>) {
    return (
        <MenuPrimitive.Label
            className={cn(
                "px-[var(--space-3)] py-2 text-xs font-semibold text-muted",
                className,
            )}
            {...props}
        />
    );
}

function ContextMenuSeparator({
    className, ...props
}: ComponentProps<typeof MenuPrimitive.Separator>) {
    return (
        <MenuPrimitive.Separator
            className={cn("my-1 h-px bg-border", className)}
            {...props}
        />
    );
}

function ContextMenuCheckboxItem({
    className, children, ...props
}: ComponentProps<typeof MenuPrimitive.CheckboxItem>) {
    return (
        <MenuPrimitive.CheckboxItem
            className={cn(itemStyle, "pl-8", className)}
            {...props}
        >
            <span className="absolute left-2 inline-flex size-4 items-center">
                <MenuPrimitive.ItemIndicator>
                    <Check aria-hidden="true" className="size-4" />
                </MenuPrimitive.ItemIndicator>
            </span>
            {children}
        </MenuPrimitive.CheckboxItem>
    );
}

function ContextMenuRadioItem({
    className, children, ...props
}: ComponentProps<typeof MenuPrimitive.RadioItem>) {
    return (
        <MenuPrimitive.RadioItem
            className={cn(itemStyle, "pl-8", className)}
            {...props}
        >
            <span className="absolute left-2 inline-flex size-4 items-center">
                <MenuPrimitive.ItemIndicator>
                    <Dot aria-hidden="true" className="size-4" />
                </MenuPrimitive.ItemIndicator>
            </span>
            {children}
        </MenuPrimitive.RadioItem>
    );
}

function ContextMenuSubTrigger({
    className, children, ...props
}: ComponentProps<typeof MenuPrimitive.SubTrigger>) {
    return (
        <MenuPrimitive.SubTrigger
            className={cn(itemStyle, className)}
            {...props}
        >
            {children}
            <ChevronRight aria-hidden="true"
                className="ml-auto size-4 rtl:rotate-180" />
        </MenuPrimitive.SubTrigger>
    );
}

function ContextMenuSubContent({
    className, sideOffset = 4, ...props
}: ComponentProps<typeof MenuPrimitive.SubContent>) {
    return (
        <MenuPrimitive.Portal>
            <MenuPrimitive.SubContent
                sideOffset={sideOffset}
                className={cn(contentStyle, className)}
                {...props}
            />
        </MenuPrimitive.Portal>
    );
}

export {
    ContextMenu, ContextMenuTrigger, ContextMenuContent,
    ContextMenuItem, ContextMenuLabel, ContextMenuSeparator,
    ContextMenuGroup, ContextMenuCheckboxItem, ContextMenuRadioGroup,
    ContextMenuRadioItem, ContextMenuSub, ContextMenuSubTrigger,
    ContextMenuSubContent,
};
export type { ContextMenuItemProps };
