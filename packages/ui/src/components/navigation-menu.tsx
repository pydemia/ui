import * as MenuPrimitive from "@radix-ui/react-navigation-menu";
import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "./utils";

type NavigationMenuProps =
    Omit<ComponentProps<typeof MenuPrimitive.Root>, "orientation"> & {
        "aria-label": string;
    };

function NavigationMenu({
    className,
    children,
    "aria-label": label,
    ...props
}: NavigationMenuProps) {
    if (!label?.trim()) {
        throw new Error("NavigationMenu requires an accessible name.");
    }

    return (
        <MenuPrimitive.Root
            aria-label={label}
            orientation="horizontal"
            className={cn(
                "relative z-10 flex max-w-max items-center",
                className,
            )}
            {...props}
        >
            {children}
        </MenuPrimitive.Root>
    );
}

function NavigationMenuList({
    className,
    ...props
}: ComponentProps<typeof MenuPrimitive.List>) {
    return (
        <MenuPrimitive.List
            className={cn("flex list-none items-center gap-1 p-0", className)}
            {...props}
        />
    );
}

function NavigationMenuItem({
    className,
    ...props
}: ComponentProps<typeof MenuPrimitive.Item>) {
    return (
        <MenuPrimitive.Item
            className={cn("relative", className)}
            {...props}
        />
    );
}

const triggerStyle =
    "inline-flex h-9 items-center gap-1 rounded-sm px-3 text-sm " +
    "font-medium text-foreground outline-none " +
    "hover:bg-surface-subtle focus-visible:ring-2 focus-visible:ring-focus " +
    "data-[state=open]:bg-surface-subtle " +
    "disabled:pointer-events-none disabled:opacity-50";

function NavigationMenuTrigger({
    className,
    children,
    ...props
}: ComponentProps<typeof MenuPrimitive.Trigger>) {
    return (
        <MenuPrimitive.Trigger
            className={cn(triggerStyle, className)}
            {...props}
        >
            {children}
            <ChevronDown aria-hidden="true"
                className="size-4 shrink-0 text-muted" />
        </MenuPrimitive.Trigger>
    );
}

function NavigationMenuContent({
    className,
    ...props
}: ComponentProps<typeof MenuPrimitive.Content>) {
    return (
        <MenuPrimitive.Content
            className={cn(
                "absolute left-0 top-full z-50 mt-2 grid min-w-64 gap-1 " +
                "rounded-sm border border-border bg-surface p-2 " +
                "text-foreground shadow-[var(--shadow-float)]",
                className,
            )}
            {...props}
        />
    );
}

type NavigationMenuLinkProps =
    ComponentProps<typeof MenuPrimitive.Link> & {
        variant?: "trigger" | "content";
    };

function NavigationMenuLink({
    className,
    variant = "content",
    ...props
}: NavigationMenuLinkProps) {
    return (
        <MenuPrimitive.Link
            className={cn(
                variant === "trigger"
                    ? triggerStyle
                    : "block rounded-sm px-3 py-2 text-sm text-foreground " +
                      "outline-none hover:bg-surface-subtle " +
                      "focus-visible:ring-2 focus-visible:ring-focus " +
                      "data-[active]:bg-surface-subtle " +
                      "data-[active]:font-semibold",
                className,
            )}
            {...props}
        />
    );
}

export {
    NavigationMenu,
    NavigationMenuList,
    NavigationMenuItem,
    NavigationMenuTrigger,
    NavigationMenuContent,
    NavigationMenuLink,
};
export type { NavigationMenuProps, NavigationMenuLinkProps };
