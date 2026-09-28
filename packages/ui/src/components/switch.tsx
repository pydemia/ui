import * as SwitchPrimitive from "@radix-ui/react-switch";
import type { ComponentProps } from "react";
import { cn } from "./utils";

function Switch({ className, ...props }: ComponentProps<typeof SwitchPrimitive.Root>) {
    return (
        <SwitchPrimitive.Root
            className={cn(
                "relative inline-flex h-5 w-9 shrink-0 items-center " +
                "rounded-full border border-border bg-surface-subtle " +
                "transition-colors duration-[var(--motion-fast)] " +
                "after:absolute after:-inset-1 " +
                "data-[state=checked]:border-accent " +
                "data-[state=checked]:bg-accent disabled:cursor-not-allowed " +
                "disabled:opacity-50",
                className,
            )}
            {...props}
        >
            <SwitchPrimitive.Thumb
                className={"block size-4 translate-x-0.5 rounded-full " +
                    "bg-surface shadow-sm transition-transform " +
                    "duration-[var(--motion-fast)] " +
                    "data-[state=checked]:translate-x-4"}
            />
        </SwitchPrimitive.Root>
    );
}

export { Switch };
