import type { ComponentProps, ReactNode } from "react";
import { Card } from "./card";
import { cn } from "./utils";

type MetricCardProps = Omit<ComponentProps<typeof Card>, "children"> & {
    label: string;
    value: ReactNode;
    change?: string;
    detail?: string;
};

function MetricCard({
    className,
    label,
    value,
    change,
    detail,
    ...props
}: MetricCardProps) {
    return (
        <Card
            role="group"
            aria-label={label}
            className={cn("min-w-0 p-[var(--space-4)]", className)}
            {...props}
        >
            <p className="text-sm text-muted">{label}</p>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
            {(change || detail) && (
                <p className="mt-2 text-xs text-muted">
                    {change && <span className="font-medium text-foreground">{change}</span>}
                    {change && detail && " · "}
                    {detail}
                </p>
            )}
        </Card>
    );
}

export { MetricCard };
export type { MetricCardProps };
