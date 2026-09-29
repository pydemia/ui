import { LoaderCircle } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "./utils";

type SpinnerProps = ComponentProps<typeof LoaderCircle> & {
    variant?: "icon" | "ring" | "dots" | "bars" | "orbit";
};

function Spinner({
    variant = "icon",
    className,
    ...props
}: SpinnerProps) {
    if (!["icon", "ring", "dots", "bars", "orbit"].includes(variant)) {
        throw new RangeError("Spinner variant is not supported.");
    }

    if (variant === "icon") {
        return (
            <LoaderCircle
                role="status"
                aria-label="Loading"
                data-variant={variant}
                className={cn(
                    "size-4 animate-spin text-accent motion-reduce:animate-none",
                    className,
                )}
                {...props}
            />
        );
    }

    return (
        <svg
            viewBox="0 0 24 24"
            role="status"
            aria-label="Loading"
            data-variant={variant}
            className={cn(
                "size-4 text-accent",
                (variant === "ring" || variant === "orbit") &&
                    "animate-spin motion-reduce:animate-none",
                className,
            )}
            {...props}
        >
            {variant === "ring" ? (
                <>
                    <circle cx="12" cy="12" r="9" fill="none"
                        stroke="currentColor" strokeWidth="2.5" opacity="0.2" />
                    <path d="M 12 3 A 9 9 0 0 1 21 12" fill="none"
                        stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" />
                </>
            ) : variant === "dots" ? [5, 12, 19].map((x, index) => (
                <circle key={x} cx={x} cy="12" r="2.5"
                    fill="currentColor"
                    className="animate-pulse motion-reduce:animate-none"
                    style={{ animationDelay: `${index * 180}ms` }} />
            )) : variant === "bars" ? [
                { x: 3, y: 8, height: 8 },
                { x: 10, y: 4, height: 16 },
                { x: 17, y: 6, height: 12 },
            ].map((bar, index) => (
                <rect key={bar.x} x={bar.x} y={bar.y} width="4"
                    height={bar.height} rx="2" fill="currentColor"
                    className="animate-pulse motion-reduce:animate-none"
                    style={{ animationDelay: `${index * 180}ms` }} />
            )) : (
                <>
                    <circle cx="12" cy="12" r="2" fill="currentColor" />
                    <circle cx="12" cy="3" r="2.5" fill="currentColor" />
                    <circle cx="21" cy="12" r="1.8" fill="currentColor"
                        opacity="0.75" />
                    <circle cx="12" cy="21" r="1.3" fill="currentColor"
                        opacity="0.5" />
                    <circle cx="3" cy="12" r="0.9" fill="currentColor"
                        opacity="0.3" />
                </>
            )}
        </svg>
    );
}

export { Spinner };
export type { SpinnerProps };
