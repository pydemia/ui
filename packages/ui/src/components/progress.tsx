import * as ProgressPrimitive from "@radix-ui/react-progress";
import type { ComponentProps } from "react";
import { cn } from "./utils";

type ProgressProps = ComponentProps<typeof ProgressPrimitive.Root> & {
    variant?: "linear" | "circular";
    showValue?: boolean;
};

function Progress({
    className,
    value = 0,
    max = 100,
    variant = "linear",
    showValue = false,
    ...props
}: ProgressProps) {
    let percentage = 100;
    if (value !== null) {
        percentage = max > 0
            ? Math.max(0, Math.min(100, (value / max) * 100))
            : 0;
    }

    if (variant === "circular") {
        const circumference = 2 * Math.PI * 20;
        return (
            <ProgressPrimitive.Root
                value={value}
                max={max}
                className={cn(
                    "group relative inline-grid size-12 shrink-0 " +
                    "place-items-center text-accent",
                    className,
                )}
                {...props}
            >
                <ProgressPrimitive.Indicator className="absolute inset-0">
                    <svg viewBox="0 0 48 48" aria-hidden="true"
                        className={cn(
                            "size-full -rotate-90",
                            value === null && "motion-safe:animate-spin",
                        )}>
                        <circle cx="24" cy="24" r="20" fill="none"
                            stroke="var(--surface-subtle)" strokeWidth="6" />
                        <circle cx="24" cy="24" r="20" fill="none"
                            stroke="currentColor" strokeWidth="6"
                            strokeLinecap="round"
                            strokeDasharray={value === null
                                ? `${circumference / 4} ${circumference}`
                                : circumference}
                            strokeDashoffset={value === null
                                ? 0
                                : circumference * (1 - percentage / 100)}
                            className="transition-[stroke-dashoffset] duration-[var(--motion-fast)]" />
                    </svg>
                </ProgressPrimitive.Indicator>
                {showValue && value !== null && (
                    <span aria-hidden="true" className="text-[10px] font-semibold">
                        {Math.round(percentage)}%
                    </span>
                )}
            </ProgressPrimitive.Root>
        );
    }

    return (
        <ProgressPrimitive.Root
            value={value}
            max={max}
            className={cn(
                "group h-2 w-full overflow-hidden rounded-full bg-surface-subtle",
                className,
            )}
            {...props}
        >
            <ProgressPrimitive.Indicator
                className={"block h-full rounded-full bg-accent " +
                    "transition-[width] duration-[var(--motion-fast)] " +
                    "group-data-[state=indeterminate]:animate-pulse"}
                style={{ width: `${percentage}%` }}
            />
        </ProgressPrimitive.Root>
    );
}

export { Progress };
export type { ProgressProps };
