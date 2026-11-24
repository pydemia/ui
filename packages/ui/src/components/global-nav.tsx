import type { ComponentProps } from "react";
import { cn } from "./utils";

type NamedNavProps = ComponentProps<"nav"> & { "aria-label": string };

function GlobalNav({ className, ...props }: NamedNavProps) {
    return (
        <nav
            className={cn(
                "flex min-w-0 items-center gap-1 overflow-x-auto",
                className,
            )}
            {...props}
            data-ui="global-nav"
        />
    );
}

type GlobalNavLinkProps = ComponentProps<"a"> & {
    variant?: "surface" | "underline";
};

function GlobalNavLink({
    variant = "surface",
    className,
    ...props
}: GlobalNavLinkProps) {
    return (
        <a
            className={cn(
                "shrink-0 px-[var(--space-3)] py-[var(--space-2)] " +
                "text-sm text-muted hover:text-foreground " +
                "aria-[current=page]:font-semibold",
                variant === "surface"
                    ? "rounded-sm hover:bg-surface-subtle " +
                      "aria-[current=page]:bg-surface-subtle " +
                      "aria-[current=page]:text-foreground"
                    : "border-b-2 border-transparent " +
                      "aria-[current=page]:border-accent " +
                      "aria-[current=page]:text-accent",
                className,
            )}
            data-variant={variant}
            {...props}
            data-slot="nav-link"
        />
    );
}

export { GlobalNav, GlobalNavLink };
export type { GlobalNavLinkProps };
