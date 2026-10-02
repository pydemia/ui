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

type DashboardMetricsProps = DashboardSectionProps & {
    columns?: 2 | 3 | 4;
};

const metricColumns = {
    2: "@3xl:grid-cols-2",
    3: "@3xl:grid-cols-3",
    4: "@3xl:grid-cols-4",
} as const;

function DashboardMetrics({
    columns = 4, className, ...props
}: DashboardMetricsProps) {
    if (!Object.hasOwn(metricColumns, columns)) {
        throw new RangeError("DashboardMetrics columns is not supported.");
    }

    return (
        <section
            data-columns={columns}
            className={cn(
                "grid min-w-0 grid-cols-1 gap-[var(--space-4)] " +
                "@sm:grid-cols-2",
                metricColumns[columns],
                className,
            )}
            {...props}
        />
    );
}

type DashboardPanelsProps = DashboardSectionProps & {
    layout?: "balanced" | "primary";
};

const panelLayouts = {
    balanced: "@3xl:grid-cols-2",
    primary: "@3xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]",
} as const;

function DashboardPanels({
    layout = "balanced", className, ...props
}: DashboardPanelsProps) {
    if (!Object.hasOwn(panelLayouts, layout)) {
        throw new RangeError("DashboardPanels layout is not supported.");
    }

    return (
        <section
            data-layout={layout}
            className={cn(
                "grid min-w-0 grid-cols-1 items-start " +
                "gap-[var(--space-4)]",
                panelLayouts[layout],
                className,
            )}
            {...props}
        />
    );
}

export { Dashboard, DashboardMetrics, DashboardPanels };
export type {
    DashboardSectionProps, DashboardMetricsProps, DashboardPanelsProps,
};
