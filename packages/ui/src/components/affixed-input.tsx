import { useId, type ComponentProps } from "react";
import { Input } from "./input";
import { Label } from "./label";
import { cn } from "./utils";

type AffixedInputProps = Omit<
    ComponentProps<typeof Input>, "type" | "appearance"
> & {
    label: string;
    prefix?: string;
    suffix?: string;
};

function AffixedInput({
    label,
    prefix,
    suffix,
    id,
    className,
    ...props
}: AffixedInputProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const leading = prefix ? (
        <span
            aria-hidden="true"
            className="flex items-center border-r border-border bg-surface-subtle px-[var(--space-3)] text-sm text-muted"
        >
            {prefix}
        </span>
    ) : null;
    const trailing = suffix ? (
        <span
            aria-hidden="true"
            className="flex items-center border-l border-border bg-surface-subtle px-[var(--space-3)] text-sm text-muted"
        >
            {suffix}
        </span>
    ) : null;

    return (
        <div className="grid gap-2">
            <Label htmlFor={inputId}>{label}</Label>
            <div className="flex h-[var(--control-height)] items-stretch overflow-hidden rounded-sm border border-border bg-surface focus-within:outline-2 focus-within:outline-focus focus-within:outline-offset-2">
                {leading}
                <Input
                    id={inputId}
                    className={cn("h-full flex-1 rounded-none border-0 bg-transparent focus-visible:outline-none", className)}
                    {...props}
                />
                {trailing}
            </div>
        </div>
    );
}

export { AffixedInput };
export type { AffixedInputProps };
