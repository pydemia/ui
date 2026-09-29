import * as SliderPrimitive from "@radix-ui/react-slider";
import type { ComponentProps } from "react";
import { cn } from "./utils";

type SliderProps = ComponentProps<typeof SliderPrimitive.Root> & {
    "aria-label": string;
    thumbLabels?: readonly string[];
};

function Slider({
    className,
    defaultValue,
    value,
    min = 0,
    "aria-label": label,
    thumbLabels,
    ...props
}: SliderProps) {
    const values = value ?? defaultValue ?? [min];
    if (thumbLabels && (
        thumbLabels.length !== values.length ||
        thumbLabels.some((name) => !name.trim())
    )) {
        throw new Error("Slider needs one non-empty label per thumb.");
    }

    return (
        <SliderPrimitive.Root
            defaultValue={defaultValue}
            value={value}
            min={min}
            className={cn(
                "relative flex w-full touch-none items-center select-none " +
                "data-[orientation=vertical]:h-40 " +
                "data-[orientation=vertical]:w-auto " +
                "data-[orientation=vertical]:flex-col " +
                "data-[disabled]:opacity-50",
                className,
            )}
            {...props}
        >
            <SliderPrimitive.Track
                className={"relative h-2 w-full grow overflow-hidden rounded-full " +
                    "bg-surface-subtle data-[orientation=vertical]:w-2"}
            >
                <SliderPrimitive.Range
                    className={"absolute h-full bg-accent " +
                        "data-[orientation=vertical]:w-full"}
                />
            </SliderPrimitive.Track>
            {values.map((_, index) => (
                <SliderPrimitive.Thumb
                    key={index}
                    aria-label={thumbLabels?.[index] ?? (
                        values.length > 1 ? `${label} ${index + 1}` : label
                    )}
                    className={"block size-5 rounded-full border border-accent " +
                        "bg-surface shadow-[var(--shadow-float)] " +
                        "focus-visible:outline-2 focus-visible:outline-focus " +
                        "focus-visible:outline-offset-2 " +
                        "disabled:pointer-events-none"}
                />
            ))}
        </SliderPrimitive.Root>
    );
}

export { Slider };
export type { SliderProps };
