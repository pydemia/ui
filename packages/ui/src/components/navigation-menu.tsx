import * as MenuPrimitive from "@radix-ui/react-navigation-menu";
import * as PopperPrimitive from "@radix-ui/react-popper";
import * as PortalPrimitive from "@radix-ui/react-portal";
import { ChevronDown } from "lucide-react";
import { createContext, useCallback, useContext, useRef, type ComponentProps, type RefObject } from "react";
import { cn } from "./utils";
import { usePortalContainer } from "./foundation/portal-scope";

type NavigationMenuProps =
    Omit<ComponentProps<typeof MenuPrimitive.Root>, "orientation"> & {
        "aria-label": string;
    };
const NavigationMenuContainerContext = createContext<RefObject<HTMLElement | null> | null>(null);

function NavigationMenu({
    className,
    children,
    ref,
    "aria-label": label,
    ...props
}: NavigationMenuProps) {
    const rootRef = useRef<HTMLElement | null>(null);
    const composedRef = useCallback((node: HTMLElement | null) => {
        rootRef.current = node;
        const cleanup = typeof ref === "function" ? ref(node) : undefined;
        if (ref && typeof ref !== "function") ref.current = node;
        return () => {
            rootRef.current = null;
            if (typeof cleanup === "function") cleanup();
            else if (typeof ref === "function") ref(null);
            else if (ref) ref.current = null;
        };
    }, [ref]);
    if (!label?.trim()) {
        throw new Error("NavigationMenu requires an accessible name.");
    }

    return (
        <NavigationMenuContainerContext.Provider value={rootRef}>
            <MenuPrimitive.Root
                ref={composedRef}
                aria-label={label}
                orientation="horizontal"
                className={cn(
                    "relative z-10 flex max-w-max items-center",
                    className,
                )}
                {...props}
                data-ui="navigation-menu"
            >
                {children}
            </MenuPrimitive.Root>
        </NavigationMenuContainerContext.Provider>
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
        <PopperPrimitive.Root>
            <MenuPrimitive.Item
                className={cn("relative", className)}
                {...props}
            />
        </PopperPrimitive.Root>
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
        <PopperPrimitive.Anchor asChild>
            <MenuPrimitive.Trigger
                className={cn(triggerStyle, className)}
                {...props}
                data-slot="nav-trigger"
            >
                {children}
                <ChevronDown aria-hidden="true"
                    className="size-4 shrink-0 text-muted" />
            </MenuPrimitive.Trigger>
        </PopperPrimitive.Anchor>
    );
}

function NavigationMenuContent({
    container,
    className,
    ...props
}: ComponentProps<typeof MenuPrimitive.Content> &
    Pick<ComponentProps<typeof PortalPrimitive.Root>, "container">) {
    const navigationRoot = useContext(NavigationMenuContainerContext);
    // Keep menu links inside an enclosing modal's focus and accessibility boundary.
    const modalContainer = navigationRoot?.current?.closest(
        '[role="dialog"], [role="alertdialog"]',
    );
    const portalContainer = usePortalContainer(container === undefined
        ? modalContainer ?? undefined : container);
    return (
        <PortalPrimitive.Root container={portalContainer}>
            <PopperPrimitive.Content asChild align="start" sideOffset={6}
                collisionPadding={12}>
                <MenuPrimitive.Content
                    data-ui="overlay-panel"
                    className={cn(
                        "z-50 grid min-w-[min(16rem,var(--radix-popper-available-width))] gap-1 " +
                        "max-w-[var(--radix-popper-available-width)] " +
                        "max-h-[var(--radix-popper-available-height)] overflow-y-auto " +
                        "rounded-sm border border-border bg-surface p-2 " +
                        "text-foreground shadow-[var(--shadow-float)]",
                        className,
                    )}
                    {...props}
                />
            </PopperPrimitive.Content>
        </PortalPrimitive.Root>
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
                    : "block min-w-0 rounded-sm px-3 py-2 text-sm text-foreground " +
                      "[overflow-wrap:anywhere] " +
                      "outline-none hover:bg-surface-subtle " +
                      "focus-visible:ring-2 focus-visible:ring-focus " +
                      "data-[active]:bg-surface-subtle " +
                      "data-[active]:font-semibold",
                className,
            )}
            {...props}
            data-slot={variant === "trigger" ? "nav-trigger" : "nav-menu-link"}
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
