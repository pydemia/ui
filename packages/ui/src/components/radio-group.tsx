import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { useId, type ComponentProps } from "react";
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

type RadioGroupItemProps = ComponentProps<typeof RadioGroupPrimitive.Item> & (
    | { variant?: "default"; label?: never; description?: never }
    | { variant: "card"; label: string; description?: string }
);

function RadioGroupItem({
    className, variant = "default", label, description, ...props
}: RadioGroupItemProps) {
    const generatedId = useId();
    const card = variant === "card";
    if (card && (typeof label !== "string" || !label.trim())) {
        throw new Error("RadioGroupItem card requires a label.");
    }
    const labelId = `${generatedId}-label`;
    const descriptionId = `${generatedId}-description`;
    const describedBy = card && description
        ? [props["aria-describedby"], descriptionId].filter(Boolean).join(" ")
        : props["aria-describedby"];
    const indicator = <RadioGroupPrimitive.Indicator
        className="size-2.5 rounded-full bg-accent" />;

    return (
        <RadioGroupPrimitive.Item
            {...props}
            className={cn(
                "relative inline-flex shrink-0 items-center border border-border " +
                "bg-surface data-[state=checked]:border-accent " +
                "aria-invalid:border-danger disabled:cursor-not-allowed " +
                "disabled:opacity-50 focus-visible:outline-2 " +
                "focus-visible:outline-offset-2 focus-visible:outline-focus",
                card
                    ? "min-h-16 w-full justify-start gap-3 rounded-sm " +
                      "p-[var(--space-3)] text-left text-sm text-foreground " +
                      "data-[state=checked]:bg-surface-subtle"
                    : "size-5 justify-center rounded-full " +
                      "after:absolute after:-inset-1",
                className,
            )}
            aria-labelledby={card && !props["aria-label"]
                ? props["aria-labelledby"] ?? labelId
                : props["aria-labelledby"]}
            aria-describedby={describedBy}
        >
            {card ? <span aria-hidden="true"
                className="grid size-5 shrink-0 place-items-center rounded-full border border-border bg-surface">
                {indicator}
            </span> : indicator}
            {card && <span className="grid min-w-0 gap-1">
                <span id={labelId} className="font-medium">{label}</span>
                {description && <span id={descriptionId}
                    className="text-xs text-muted">{description}</span>}
            </span>}
        </RadioGroupPrimitive.Item>
    );
}

export { RadioGroup, RadioGroupItem };
export type { RadioGroupItemProps };
