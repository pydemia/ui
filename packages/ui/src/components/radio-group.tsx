import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import type { ComponentProps } from "react";
import { cn } from "./utils";

function RadioGroup({
    className,
    ...props
}: ComponentProps<typeof RadioGroupPrimitive.Root>) {
    return (
        <RadioGroupPrimitive.Root
            className={cn("grid gap-2", className)}
            {...props}
        />
    );
}

function RadioGroupItem({
    className,
    ...props
}: ComponentProps<typeof RadioGroupPrimitive.Item>) {
    return (
        <RadioGroupPrimitive.Item
            className={cn(
                "relative inline-flex size-5 shrink-0 items-center " +
                "justify-center rounded-full border border-border bg-surface " +
                "after:absolute after:-inset-1 " +
                "data-[state=checked]:border-accent " +
                "aria-invalid:border-danger disabled:cursor-not-allowed " +
                "disabled:opacity-50",
                className,
            )}
            {...props}
        >
            <RadioGroupPrimitive.Indicator
                className="size-2.5 rounded-full bg-accent"
            />
        </RadioGroupPrimitive.Item>
    );
}

export { RadioGroup, RadioGroupItem };
