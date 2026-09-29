import type { ComponentProps } from "react";
import { cn } from "./utils";

function AppShell({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cn(
                "@container relative flex min-h-0 w-full flex-col overflow-hidden " +
                "rounded-sm border border-border bg-background text-foreground",
                className,
            )}
            {...props}
        />
    );
}

function AppHeader({ className, ...props }: ComponentProps<"header">) {
    return (
        <header
            className={cn(
                "flex min-h-12 items-center gap-[var(--space-3)] " +
                "border-b border-border bg-surface px-[var(--space-4)]",
                className,
            )}
            {...props}
        />
    );
}

function AppBody({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cn("flex min-h-0 flex-1 flex-col @3xl:flex-row", className)}
            {...props}
        />
    );
}

type AppSidebarProps = ComponentProps<"aside"> & {
    "aria-label": string;
    side?: "left" | "right";
};

function AppSidebar({
    side = "left",
    className,
    ...props
}: AppSidebarProps) {
    return (
        <aside
            className={cn(
                "min-w-0 border-b border-border bg-surface-subtle " +
                "p-[var(--space-3)] @3xl:w-52 @3xl:shrink-0 " +
                "@3xl:border-b-0",
                side === "left" ? "@3xl:border-r" : "@3xl:border-l",
                className,
            )}
            {...props}
        />
    );
}

type AppMainProps = Omit<ComponentProps<"main">, "ref"> & {
    as?: "main" | "div";
};

function AppMain({ as: Element = "main", className, ...props }: AppMainProps) {
    return (
        <Element
            className={cn("min-w-0 flex-1 p-[var(--space-4)]", className)}
            {...props}
        />
    );
}

type NamedSectionProps = ComponentProps<"section"> & {
    "aria-label": string;
};

function AppBottomPanel({ className, ...props }: NamedSectionProps) {
    return (
        <section
            className={cn(
                "min-w-0 border-t border-border bg-surface " +
                "p-[var(--space-3)]",
                className,
            )}
            {...props}
        />
    );
}

type AppFloatingPanelProps = NamedSectionProps & {
    side?: "left" | "right";
};

function AppFloatingPanel({
    side = "right",
    className,
    ...props
}: AppFloatingPanelProps) {
    return (
        <section
            className={cn(
                "absolute bottom-[var(--space-4)] z-10 max-w-[calc(100%-2rem)] " +
                "rounded-sm border border-border bg-surface " +
                "p-[var(--space-3)] shadow-[var(--shadow-float)]",
                side === "left" ? "left-[var(--space-4)]" : "right-[var(--space-4)]",
                className,
            )}
            {...props}
        />
    );
}

type AppFloatingBubbleProps = ComponentProps<"button"> & {
    "aria-label": string;
    side?: "left" | "right";
};

function AppFloatingBubble({
    side = "right",
    type = "button",
    className,
    ...props
}: AppFloatingBubbleProps) {
    return (
        <button
            type={type}
            className={cn(
                "absolute bottom-[var(--space-4)] z-10 grid size-10 " +
                "place-items-center rounded-full border border-border " +
                "bg-accent text-accent-foreground " +
                "shadow-[var(--shadow-float)]",
                side === "left" ? "left-[var(--space-4)]" : "right-[var(--space-4)]",
                className,
            )}
            {...props}
        />
    );
}

export {
    AppShell, AppHeader, AppBody, AppSidebar, AppMain, AppBottomPanel,
    AppFloatingPanel, AppFloatingBubble,
};
export type {
    AppMainProps, AppSidebarProps, AppFloatingPanelProps,
    AppFloatingBubbleProps,
};
