import type { ComponentProps } from "react";
import { cn } from "./utils";

type ButtonGroupProps = Omit<ComponentProps<"div">, "aria-label"> & {
    label: string;
    orientation?: "horizontal" | "vertical";
};

function ButtonGroup({
    label,
    orientation = "horizontal",
    className,
    ...props
}: ButtonGroupProps) {
    if (typeof label !== "string" || !label.trim()) {
        throw new Error("ButtonGroup requires a label.");
    }
    if (orientation !== "horizontal" && orientation !== "vertical") {
        throw new RangeError("ButtonGroup orientation is not supported.");
    }

    return (
        <div
            {...props}
            role="group"
            aria-label={label}
            data-orientation={orientation}
            className={cn(
                "inline-flex w-fit max-w-full items-stretch " +
                "[&>button]:relative [&>button:focus-visible]:z-10",
                orientation === "horizontal"
                    ? "flex-row [&>button]:rounded-none " +
                      "[&>button:first-child]:rounded-s-sm " +
                      "[&>button:last-child]:rounded-e-sm " +
                      "[&>button:not(:first-child)]:border-s-0 " +
                      "[&>[data-slot=button-group-separator]]:w-px " +
                      "[&>[data-slot=button-group-separator]]:self-stretch"
                    : "flex-col [&>button]:rounded-none " +
                      "[&>button:first-child]:rounded-t-sm " +
                      "[&>button:last-child]:rounded-b-sm " +
                      "[&>button:not(:first-child)]:border-t-0 " +
                      "[&>[data-slot=button-group-separator]]:h-px " +
                      "[&>[data-slot=button-group-separator]]:self-stretch",
                className,
            )}
        />
    );
}

function ButtonGroupSeparator({
    className,
    ...props
}: Omit<ComponentProps<"span">, "aria-hidden">) {
    return (
        <span
            {...props}
            aria-hidden="true"
            data-slot="button-group-separator"
            className={cn("shrink-0 bg-border", className)}
        />
    );
}

export { ButtonGroup, ButtonGroupSeparator };
export type { ButtonGroupProps };
