import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import type { ComponentProps } from "react";
import { Check, Minus } from "lucide-react";
import { cn } from "./utils";

function Checkbox({
    className,
    ...props
}: ComponentProps<typeof CheckboxPrimitive.Root>) {
    return (
        <CheckboxPrimitive.Root
            className={cn(
                "group relative inline-flex size-5 shrink-0 items-center " +
                "justify-center after:absolute after:-inset-1 " +
                "rounded-sm border border-border bg-surface text-accent-foreground " +
                "data-[state=checked]:border-accent data-[state=checked]:bg-accent " +
                "data-[state=indeterminate]:border-accent " +
                "data-[state=indeterminate]:bg-accent " +
                "aria-invalid:border-danger disabled:cursor-not-allowed " +
                "disabled:opacity-50",
                className,
            )}
            {...props}
        >
            <CheckboxPrimitive.Indicator>
                <Check
                    aria-hidden="true"
                    className="size-3 group-data-[state=indeterminate]:hidden"
                />
                <Minus
                    aria-hidden="true"
                    className="hidden size-3 group-data-[state=indeterminate]:block"
                />
            </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
    );
}

export { Checkbox };
