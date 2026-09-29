import type { ComponentProps } from "react";
import { Button, type ButtonProps } from "./button";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { cn } from "./utils";

function InputGroup({ className, ...props }: ComponentProps<"div">) {
    return (
        <div
            data-slot="input-group"
            className={cn(
                "flex min-h-[var(--control-height)] w-full min-w-0 " +
                "items-stretch rounded-sm border border-border bg-surface " +
                "text-foreground focus-within:outline-2 " +
                "focus-within:outline-focus focus-within:outline-offset-2 " +
                "has-[textarea]:flex-wrap " +
                "has-[[aria-invalid=true]]:border-danger",
                className,
            )}
            {...props}
        />
    );
}

function InputGroupInput({ className, ...props }: ComponentProps<"input">) {
    return (
        <Input
            data-slot="input-group-control"
            className={cn(
                "min-w-0 flex-1 rounded-none border-0 bg-transparent " +
                "focus-visible:outline-none",
                className,
            )}
            {...props}
        />
    );
}

function InputGroupTextarea({
    className,
    ...props
}: ComponentProps<"textarea">) {
    return (
        <Textarea
            data-slot="input-group-control"
            className={cn(
                "min-h-24 w-full flex-[1_1_100%] resize-y rounded-none " +
                "border-0 bg-transparent focus-visible:outline-none",
                className,
            )}
            {...props}
        />
    );
}

type InputGroupAddonProps = ComponentProps<"div"> & {
    align?: "inline-start" | "inline-end" | "block-start" | "block-end";
};

const addonAlignment = {
    "inline-start": "order-first border-r border-border",
    "inline-end": "order-last border-l border-border",
    "block-start": "order-first w-full justify-start border-b border-border",
    "block-end": "order-last w-full justify-end border-t border-border",
} as const;

function InputGroupAddon({
    align = "inline-start",
    className,
    ...props
}: InputGroupAddonProps) {
    if (!Object.prototype.hasOwnProperty.call(addonAlignment, align)) {
        throw new RangeError("InputGroup addon alignment is not supported.");
    }

    return (
        <div
            data-slot="input-group-addon"
            data-align={align}
            className={cn(
                "flex shrink-0 items-center gap-2 px-[var(--space-3)] " +
                "text-sm text-muted",
                addonAlignment[align],
                className,
            )}
            {...props}
        />
    );
}

function InputGroupText({ className, ...props }: ComponentProps<"span">) {
    return <span className={cn("whitespace-nowrap", className)} {...props} />;
}

function InputGroupButton({
    className,
    variant = "ghost",
    type = "button",
    ...props
}: ButtonProps) {
    return (
        <Button
            type={type}
            variant={variant}
            className={cn(
                "h-8 shrink-0 rounded-sm px-[var(--space-2)] text-xs",
                className,
            )}
            {...props}
        />
    );
}

export {
    InputGroup, InputGroupInput, InputGroupTextarea,
    InputGroupAddon, InputGroupText, InputGroupButton,
};
export type { InputGroupAddonProps };
