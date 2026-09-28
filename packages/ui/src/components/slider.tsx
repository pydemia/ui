import * as SliderPrimitive from "@radix-ui/react-slider";
import type { ComponentProps } from "react";
import { cn } from "./utils";

type SliderProps = ComponentProps<typeof SliderPrimitive.Root> & {
    "aria-label": string;
};

function Slider({
    className,
    defaultValue,
    value,
    min = 0,
    "aria-label": label,
    ...props
}: SliderProps) {
    const values = value ?? defaultValue ?? [min];

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
                    aria-label={values.length > 1 ? `${label} ${index + 1}` : label}
                    className={"block size-5 rounded-full border border-accent " +
                        "bg-surface shadow-[var(--shadow-float)] " +
                        "disabled:pointer-events-none"}
                />
            ))}
        </SliderPrimitive.Root>
    );
}

export { Slider };
