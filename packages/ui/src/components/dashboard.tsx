import type { ComponentProps } from "react";
import { cn } from "./utils";

function Dashboard({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            className={cn("@container grid min-w-0 gap-[var(--space-6)]", className)}
            {...props}
        />
    );
}

type DashboardSectionProps = ComponentProps<"section"> & {
    "aria-label": string;
};

function DashboardMetrics({ className, ...props }: DashboardSectionProps) {
    return (
        <section
            className={cn(
                "grid min-w-0 grid-cols-1 gap-[var(--space-4)] " +
                "@sm:grid-cols-2 @3xl:grid-cols-4",
                className,
            )}
            {...props}
        />
    );
}

function DashboardPanels({ className, ...props }: DashboardSectionProps) {
    return (
        <section
            className={cn(
                "grid min-w-0 grid-cols-1 items-start " +
                "gap-[var(--space-4)] @3xl:grid-cols-2",
                className,
            )}
            {...props}
        />
    );
}

export { Dashboard, DashboardMetrics, DashboardPanels };
export type { DashboardSectionProps };
