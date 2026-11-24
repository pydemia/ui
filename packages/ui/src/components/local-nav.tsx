import type { ComponentProps } from "react";
import { cn } from "./utils";
import { GlobalNavLink } from "./global-nav";

type NamedNavProps = ComponentProps<"nav"> & { "aria-label": string };

function LocalNav({ className, ...props }: NamedNavProps) {
    return (
        <nav
            className={cn(
                "flex min-w-0 items-center gap-1 overflow-x-auto " +
                "border-b border-border px-[var(--space-3)]",
                className,
            )}
            {...props}
            data-ui="local-nav"
        />
    );
}

function LocalNavLink({ className, ...props }: ComponentProps<"a">) {
    return <GlobalNavLink {...props} variant="underline"
        className={cn("whitespace-nowrap", className)} />;
}

export { LocalNav, LocalNavLink };
