import {
    useId, useState, type ComponentProps, type PointerEvent, type ReactNode,
} from "react";
import { cn } from "./utils";

type ResizablePanelsProps = Omit<ComponentProps<"div">, "children"> & {
    first: ReactNode;
    second: ReactNode;
    firstLabel: string;
    secondLabel: string;
    orientation?: "horizontal" | "vertical";
    size?: number;
    defaultSize?: number;
    minSize?: number;
    maxSize?: number;
    onSizeChange?: (size: number) => void;
    disabled?: boolean;
};

function ResizablePanels({
    first,
    second,
    firstLabel,
    secondLabel,
    orientation = "horizontal",
    size,
    defaultSize,
    minSize = 20,
    maxSize = 80,
    onSizeChange,
    disabled = false,
    className,
    style,
    ...props
}: ResizablePanelsProps) {
    if (
        !Number.isFinite(minSize) || !Number.isFinite(maxSize) ||
        minSize < 0 || maxSize > 100 || minSize > maxSize ||
        (defaultSize !== undefined && (
            !Number.isFinite(defaultSize) ||
            defaultSize < minSize || defaultSize > maxSize
        )) ||
        (size !== undefined && (
            !Number.isFinite(size) || size < minSize || size > maxSize
        ))
    ) {
        throw new RangeError(
            "ResizablePanels sizes must be finite and within the min/max range.",
        );
    }
    if (!firstLabel.trim() || !secondLabel.trim()) {
        throw new Error("ResizablePanels requires both panel labels.");
    }

    const [uncontrolledSize, setUncontrolledSize] = useState(
        defaultSize ?? Math.max(minSize, Math.min(maxSize, 50)),
    );
    const firstId = useId();
    const currentSize = Math.max(
        minSize, Math.min(maxSize, size ?? uncontrolledSize),
    );
    const horizontal = orientation === "horizontal";

    function changeSize(nextSize: number) {
        const clamped = Math.max(minSize, Math.min(maxSize, nextSize));
        if (clamped === currentSize) return;
        if (size === undefined) setUncontrolledSize(clamped);
        onSizeChange?.(clamped);
    }

    function changeFromPointer(event: PointerEvent<HTMLDivElement>) {
        const container = event.currentTarget.parentElement;
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const span = (horizontal ? rect.width : rect.height) - 8;
        if (span <= 0) return;
        const rtl = horizontal && getComputedStyle(container).direction === "rtl";
        const position = horizontal
            ? rtl ? rect.right - event.clientX : event.clientX - rect.left
            : event.clientY - rect.top;
        changeSize(Math.round((position - 4) / span * 1000) / 10);
    }

    return (
        <div
            className={cn(
                "grid min-h-48 min-w-0 w-full overflow-hidden rounded-sm " +
                "border border-border bg-surface text-foreground",
                !horizontal && "h-64",
                className,
            )}
            style={{
                ...style,
                gridTemplateColumns: horizontal
                    ? `minmax(0, ${currentSize}fr) 8px minmax(0, ${100 - currentSize}fr)`
                    : undefined,
                gridTemplateRows: horizontal
                    ? undefined
                    : `minmax(0, ${currentSize}fr) 8px minmax(0, ${100 - currentSize}fr)`,
            }}
            {...props}
        >
            <section id={firstId} role="region" aria-label={firstLabel}
                className="min-h-0 min-w-0 overflow-auto p-[var(--space-3)]">
                {first}
            </section>
            <div
                role="separator"
                aria-label={firstLabel}
                aria-controls={firstId}
                aria-orientation={horizontal ? "vertical" : "horizontal"}
                aria-valuemin={minSize}
                aria-valuemax={maxSize}
                aria-valuenow={currentSize}
                aria-valuetext={`${currentSize}%`}
                aria-disabled={disabled || undefined}
                tabIndex={disabled ? -1 : 0}
                className={cn(
                    "relative grid place-items-center bg-surface-subtle " +
                    "touch-none select-none " +
                    "focus-visible:outline-none focus-visible:ring-2 " +
                    "focus-visible:ring-inset focus-visible:ring-focus",
                    horizontal ? "cursor-col-resize" : "cursor-row-resize",
                    disabled
                        ? "cursor-default opacity-50"
                        : "hover:bg-border",
                )}
                onPointerDown={(event) => {
                    if (disabled || event.button !== 0) return;
                    event.currentTarget.setPointerCapture(event.pointerId);
                    changeFromPointer(event);
                }}
                onPointerMove={(event) => {
                    if (!disabled &&
                        event.currentTarget.hasPointerCapture(event.pointerId)) {
                        changeFromPointer(event);
                    }
                }}
                onPointerUp={(event) => {
                    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                        event.currentTarget.releasePointerCapture(event.pointerId);
                    }
                }}
                onPointerCancel={(event) => {
                    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                        event.currentTarget.releasePointerCapture(event.pointerId);
                    }
                }}
                onKeyDown={(event) => {
                    if (disabled) return;
                    const step = event.shiftKey ? 10 : 2;
                    const rtl = horizontal &&
                        getComputedStyle(event.currentTarget.parentElement!).direction === "rtl";
                    let nextSize: number;
                    switch (event.key) {
                        case "ArrowLeft":
                            if (!horizontal) return;
                            nextSize = currentSize + (rtl ? step : -step);
                            break;
                        case "ArrowRight":
                            if (!horizontal) return;
                            nextSize = currentSize + (rtl ? -step : step);
                            break;
                        case "ArrowUp":
                            if (horizontal) return;
                            nextSize = currentSize - step;
                            break;
                        case "ArrowDown":
                            if (horizontal) return;
                            nextSize = currentSize + step;
                            break;
                        case "Home":
                            nextSize = minSize;
                            break;
                        case "End":
                            nextSize = maxSize;
                            break;
                        default:
                            return;
                    }
                    event.preventDefault();
                    changeSize(nextSize);
                }}
            >
                <span aria-hidden="true" className={cn(
                    "rounded-full bg-muted",
                    horizontal ? "h-7 w-1" : "h-1 w-7",
                )} />
            </div>
            <section role="region" aria-label={secondLabel}
                className="min-h-0 min-w-0 overflow-auto p-[var(--space-3)]">
                {second}
            </section>
        </div>
    );
}

export { ResizablePanels };
export type { ResizablePanelsProps };
