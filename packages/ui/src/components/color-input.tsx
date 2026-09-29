import {
    useEffect, useId, useState, type ComponentProps,
} from "react";
import { cn } from "./utils";

type ColorInputProps = Omit<ComponentProps<"div">, "onChange"> & {
    label: string;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    name?: string;
    disabled?: boolean;
    variant?: "card" | "inline";
};

const hexColor = /^#[0-9a-fA-F]{6}$/;

function ColorInput({
    label,
    value,
    defaultValue = "#000000",
    onValueChange,
    name,
    disabled = false,
    variant = "card",
    id,
    className,
    children,
    ...props
}: ColorInputProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [draft, setDraft] = useState<{
        base: string;
        text: string;
    } | null>(null);
    const selected = value === undefined ? internalValue : value;
    const text = draft?.base === selected ? draft.text : selected;
    const invalid = !hexColor.test(text);

    useEffect(() => {
        setDraft(null);
    }, [selected]);

    if (!label.trim()) {
        throw new Error("ColorInput requires a label.");
    }
    if (!hexColor.test(selected) || !hexColor.test(defaultValue)) {
        throw new RangeError("ColorInput requires #RRGGBB color values.");
    }
    if (value !== undefined && !onValueChange && !disabled) {
        throw new Error("Controlled ColorInput requires onValueChange.");
    }

    function applyColor(next: string) {
        const normalized = next.toLowerCase();
        setDraft(null);
        if (value === undefined) setInternalValue(normalized);
        onValueChange?.(normalized);
    }

    return (
        <div
            className={cn(
                "grid min-w-0 grid-cols-[32px_minmax(0,1fr)] " +
                "gap-x-2 gap-y-1 bg-surface text-foreground",
                variant === "card" &&
                    "rounded-sm border border-border p-[var(--space-3)]",
                className,
            )}
            {...props}
        >
            <label htmlFor={inputId}
                className="col-span-2 text-sm font-medium">
                {label}
            </label>
            <input
                type="color"
                aria-label={`${label} 색상 선택`}
                value={selected}
                disabled={disabled}
                onChange={(event) => applyColor(event.target.value)}
                className={
                    "size-8 rounded-sm border border-border bg-surface " +
                    "p-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                }
            />
            <input
                id={inputId}
                name={name}
                type="text"
                inputMode="text"
                spellCheck={false}
                maxLength={7}
                pattern="#[0-9A-Fa-f]{6}"
                required
                value={text}
                disabled={disabled}
                aria-invalid={invalid || undefined}
                aria-describedby={invalid ? errorId : undefined}
                onChange={(event) => {
                    const next = event.target.value;
                    if (hexColor.test(next)) applyColor(next);
                    else setDraft({ base: selected, text: next });
                }}
                onBlur={() => setDraft(null)}
                className={
                    "h-8 min-w-0 rounded-sm border border-border " +
                    "bg-background px-2 font-mono text-xs text-foreground " +
                    "aria-invalid:border-danger " +
                    "disabled:cursor-not-allowed disabled:opacity-50"
                }
            />
            {invalid && (
                <p id={errorId} role="alert"
                    className="col-span-2 m-0 text-xs text-danger">
                    색상은 #RRGGBB 형식으로 입력하세요.
                </p>
            )}
            {children}
        </div>
    );
}

export { ColorInput };
export type { ColorInputProps };
