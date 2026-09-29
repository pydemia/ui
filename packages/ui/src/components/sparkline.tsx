import type { ComponentProps } from "react";
import { cn } from "./utils";

type SparklineProps = Omit<ComponentProps<"svg">, "children" | "values"> & {
    label: string;
    values: readonly (number | null)[];
    unit?: string;
};

function Sparkline({
    label,
    values,
    unit = "",
    className,
    ...props
}: SparklineProps) {
    if (values.some((value) => value !== null && !Number.isFinite(value))) {
        throw new RangeError("Sparkline values must be finite numbers or null.");
    }

    const present = values.filter((value): value is number => value !== null);
    const empty = present.length === 0;
    let minimum = Infinity;
    let maximum = -Infinity;
    for (const value of present) {
        minimum = Math.min(minimum, value);
        maximum = Math.max(maximum, value);
    }
    if (empty) {
        minimum = 0;
        maximum = 0;
    }
    const spread = maximum - minimum;
    let drawing = false;
    let path = "";
    let lastPoint: { x: number; y: number } | null = null;

    for (let index = 0; index < values.length; index += 1) {
        const value = values[index];
        if (value === null) {
            drawing = false;
            continue;
        }
        const x = values.length === 1 ? 80 : 4 + index * 152 / (values.length - 1);
        const y = spread === 0 ? 24 : 44 - (value - minimum) * 40 / spread;
        path += `${drawing ? " L" : " M"}${x.toFixed(2)} ${y.toFixed(2)}`;
        drawing = true;
        lastPoint = { x, y };
    }

    const description = empty
        ? `${label}: 데이터 없음`
        : `${label}: 시작 ${present[0]}${unit}, 마지막 ` +
          `${present[present.length - 1]}${unit}, 최저 ${minimum}${unit}, ` +
          `최고 ${maximum}${unit}`;

    return (
        <svg
            viewBox="0 0 160 48"
            role="img"
            aria-label={description}
            className={cn("h-12 w-full text-accent", className)}
            {...props}
        >
            {empty ? (
                <text x="80" y="27" textAnchor="middle" fill="currentColor"
                    className="text-xs">
                    데이터 없음
                </text>
            ) : (
                <>
                    <path
                        d={path}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        vectorEffect="non-scaling-stroke"
                    />
                    {lastPoint && (
                        <circle cx={lastPoint.x} cy={lastPoint.y}
                            r="2.5" fill="currentColor" />
                    )}
                </>
            )}
        </svg>
    );
}

export { Sparkline };
export type { SparklineProps };
