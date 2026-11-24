import type { ComponentProps } from "react";
import { cn } from "./utils";

type NamedNavProps = ComponentProps<"nav"> & { "aria-label": string };

function FooterNav({ className, ...props }: NamedNavProps) {
    return (
        <nav
            className={cn(
                "flex min-w-0 flex-wrap items-center gap-x-4 gap-y-1 " +
                "px-[var(--space-4)] py-[var(--space-2)]",
                className,
            )}
            {...props}
            data-ui="footer-nav"
        />
    );
}

function FooterNavLink({ className, ...props }: ComponentProps<"a">) {
    return (
        <a className={cn(
            "rounded-sm py-1 text-sm text-muted hover:text-foreground " +
            "focus-visible:outline-2 focus-visible:outline-focus " +
            "aria-[current=page]:font-semibold aria-[current=page]:text-foreground",
            className,
        )} {...props} />
    );
}

export { FooterNav, FooterNavLink };
