import * as MenubarPrimitive from "@radix-ui/react-menubar";
import { Check, ChevronRight, Dot } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "./utils";

type MenubarProps = ComponentProps<typeof MenubarPrimitive.Root> & {
    "aria-label": string;
};

function Menubar({
    className,
    "aria-label": label,
    ...props
}: MenubarProps) {
    if (!label?.trim()) {
        throw new Error("Menubar requires an accessible name.");
    }

    return (
        <MenubarPrimitive.Root
            aria-label={label}
            className={cn(
                "flex max-w-full items-center gap-1 overflow-x-auto " +
                "rounded-sm border border-border bg-surface p-1",
                className,
            )}
            {...props}
        />
    );
}

const MenubarMenu = MenubarPrimitive.Menu;
const MenubarGroup = MenubarPrimitive.Group;
const MenubarRadioGroup = MenubarPrimitive.RadioGroup;
const MenubarSub = MenubarPrimitive.Sub;

function MenubarTrigger({
    className,
    ...props
}: ComponentProps<typeof MenubarPrimitive.Trigger>) {
    return (
        <MenubarPrimitive.Trigger
            className={cn(
                "inline-flex h-9 shrink-0 cursor-default items-center " +
                "rounded-sm px-3 text-sm font-medium text-foreground " +
                "outline-none hover:bg-surface-subtle " +
                "focus-visible:ring-2 focus-visible:ring-focus " +
                "data-[state=open]:bg-surface-subtle " +
                "data-[disabled]:pointer-events-none " +
                "data-[disabled]:opacity-50",
                className,
            )}
            {...props}
        />
    );
}

const contentStyle =
    "z-50 min-w-44 max-h-[var(--radix-menubar-content-available-height)] " +
    "overflow-y-auto rounded-sm border border-border bg-surface " +
    "p-1 text-foreground shadow-[var(--shadow-float)]";

function MenubarContent({
    className,
    sideOffset = 4,
    ...props
}: ComponentProps<typeof MenubarPrimitive.Content>) {
    return (
        <MenubarPrimitive.Portal>
            <MenubarPrimitive.Content
                align="start"
                sideOffset={sideOffset}
                className={cn(contentStyle, className)}
                {...props}
            />
        </MenubarPrimitive.Portal>
    );
}

const itemStyle =
    "relative flex cursor-default select-none items-center gap-2 " +
    "rounded-sm px-[var(--space-3)] py-2 text-sm outline-none " +
    "data-[highlighted]:bg-surface-subtle " +
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-50";

type MenubarItemProps =
    ComponentProps<typeof MenubarPrimitive.Item> & {
        variant?: "default" | "danger";
    };

function MenubarItem({
    className,
    variant = "default",
    ...props
}: MenubarItemProps) {
    return (
        <MenubarPrimitive.Item
            className={cn(
                itemStyle,
                variant === "danger" && "text-danger",
                className,
            )}
            {...props}
        />
    );
}

function MenubarLabel({
    className,
    ...props
}: ComponentProps<typeof MenubarPrimitive.Label>) {
    return (
        <MenubarPrimitive.Label
            className={cn(
                "px-[var(--space-3)] py-2 text-xs font-semibold text-muted",
                className,
            )}
            {...props}
        />
    );
}

function MenubarSeparator({
    className,
    ...props
}: ComponentProps<typeof MenubarPrimitive.Separator>) {
    return (
        <MenubarPrimitive.Separator
            className={cn("my-1 h-px bg-border", className)}
            {...props}
        />
    );
}

function MenubarCheckboxItem({
    className,
    children,
    ...props
}: ComponentProps<typeof MenubarPrimitive.CheckboxItem>) {
    return (
        <MenubarPrimitive.CheckboxItem
            className={cn(itemStyle, "pl-8", className)}
            {...props}
        >
            <span className="absolute left-2 inline-flex size-4 items-center">
                <MenubarPrimitive.ItemIndicator>
                    <Check aria-hidden="true" className="size-4" />
                </MenubarPrimitive.ItemIndicator>
            </span>
            {children}
        </MenubarPrimitive.CheckboxItem>
    );
}

function MenubarRadioItem({
    className,
    children,
    ...props
}: ComponentProps<typeof MenubarPrimitive.RadioItem>) {
    return (
        <MenubarPrimitive.RadioItem
            className={cn(itemStyle, "pl-8", className)}
            {...props}
        >
            <span className="absolute left-2 inline-flex size-4 items-center">
                <MenubarPrimitive.ItemIndicator>
                    <Dot aria-hidden="true" className="size-4" />
                </MenubarPrimitive.ItemIndicator>
            </span>
            {children}
        </MenubarPrimitive.RadioItem>
    );
}

function MenubarSubTrigger({
    className,
    children,
    ...props
}: ComponentProps<typeof MenubarPrimitive.SubTrigger>) {
    return (
        <MenubarPrimitive.SubTrigger
            className={cn(itemStyle, className)}
            {...props}
        >
            {children}
            <ChevronRight aria-hidden="true"
                className="ml-auto size-4 rtl:rotate-180" />
        </MenubarPrimitive.SubTrigger>
    );
}

function MenubarSubContent({
    className,
    sideOffset = 4,
    ...props
}: ComponentProps<typeof MenubarPrimitive.SubContent>) {
    return (
        <MenubarPrimitive.Portal>
            <MenubarPrimitive.SubContent
                sideOffset={sideOffset}
                className={cn(contentStyle, className)}
                {...props}
            />
        </MenubarPrimitive.Portal>
    );
}

export {
    Menubar, MenubarMenu, MenubarGroup, MenubarRadioGroup,
    MenubarSub, MenubarTrigger, MenubarContent, MenubarItem,
    MenubarLabel, MenubarSeparator, MenubarCheckboxItem,
    MenubarRadioItem, MenubarSubTrigger, MenubarSubContent,
};
export type { MenubarProps, MenubarItemProps };
