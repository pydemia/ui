import {
    useId, useRef, useState, type ComponentProps,
} from "react";
import { cn } from "./utils";

type PinInputProps = Omit<
    ComponentProps<"input">,
    "type" | "value" | "defaultValue" | "onChange" | "maxLength" |
    "minLength" | "pattern" | "children" | "ref"
> & {
    label: string;
    length?: number;
    groupSize?: number;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    variant?: "outline" | "soft";
};

function PinInput({
    label,
    length = 6,
    groupSize,
    value,
    defaultValue = "",
    onValueChange,
    variant = "outline",
    id,
    name,
    className,
    disabled = false,
    readOnly = false,
    required = false,
    autoComplete = "one-time-code",
    onFocus,
    onBlur,
    onSelect,
    onKeyDown,
    ...props
}: PinInputProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const inputRef = useRef<HTMLInputElement>(null);
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [focused, setFocused] = useState(false);
    const [cursor, setCursor] = useState(0);
    const code = value === undefined ? internalValue : value;

    if (!label.trim()) throw new Error("PinInput requires a label.");
    if (!Number.isInteger(length) || length < 1) {
        throw new RangeError("PinInput length must be a positive integer.");
    }
    if (groupSize !== undefined &&
        (!Number.isInteger(groupSize) || groupSize < 1 ||
            groupSize > length)) {
        throw new RangeError("PinInput groupSize must fit within length.");
    }
    for (const candidate of [code, defaultValue]) {
        if (!/^[0-9]*$/.test(candidate) || candidate.length > length) {
            throw new Error("PinInput value must contain up to length digits.");
        }
    }
    if (value !== undefined && !onValueChange && !readOnly && !disabled) {
        throw new Error("Controlled PinInput requires onValueChange.");
    }

    function focusSlot(index: number) {
        if (disabled) return;
        const input = inputRef.current;
        if (!input) return;
        input.focus();
        const position = Math.min(index, code.length);
        const end = code.length === length ? position + 1 : position;
        input.setSelectionRange(position, end);
        setCursor(position);
        requestAnimationFrame(() => {
            if (document.activeElement === input) {
                input.setSelectionRange(position, end);
            }
        });
    }

    return (
        <div className={cn("grid min-w-0 gap-2", className)}>
            <label htmlFor={inputId} className="text-sm font-medium">
                {label}{required && <span aria-hidden="true"> *</span>}
            </label>
            <div className="relative w-fit max-w-full">
                <div aria-hidden="true" className="flex max-w-full flex-wrap gap-1">
                    {Array.from({ length }, (_, index) => (
                        <span
                            key={index}
                            data-slot-index={index}
                            onClick={() => focusSlot(index)}
                            className={cn(
                                "inline-flex size-[var(--control-height)] " +
                                "shrink-0 items-center justify-center " +
                                "rounded-sm border border-border font-mono " +
                                "text-sm text-foreground",
                                variant === "soft"
                                    ? "bg-surface-subtle" : "bg-surface",
                                groupSize && index > 0 &&
                                    index % groupSize === 0 &&
                                    "ms-[var(--space-2)]",
                                focused && Math.min(cursor, length - 1) ===
                                    index &&
                                    "border-focus outline-2 outline-focus " +
                                    "outline-offset-2",
                                disabled && "opacity-50",
                            )}
                        >
                            {code[index] ?? "\u00a0"}
                        </span>
                    ))}
                </div>
                <input
                    ref={inputRef}
                    id={inputId}
                    name={name}
                    type="text"
                    inputMode="numeric"
                    autoComplete={autoComplete}
                    pattern={`[0-9]{${length}}`}
                    value={code}
                    required={required}
                    disabled={disabled}
                    readOnly={readOnly}
                    className="pointer-events-none absolute inset-0 h-full w-full opacity-0"
                    onChange={(event) => {
                        const input = event.currentTarget;
                        const raw = input.value;
                        const selection = input.selectionStart ?? raw.length;
                        const next = raw
                            .replace(/[^0-9]/g, "").slice(0, length);
                        const nextCursor = raw.slice(0, selection)
                            .replace(/[^0-9]/g, "").slice(0, length).length;
                        if (raw !== next) {
                            input.value = next;
                            input.setSelectionRange(nextCursor, nextCursor);
                        }
                        if (value === undefined) setInternalValue(next);
                        onValueChange?.(next);
                        setCursor(nextCursor);
                    }}
                    onFocus={(event) => {
                        setFocused(true);
                        setCursor(event.currentTarget.selectionStart ?? 0);
                        onFocus?.(event);
                    }}
                    onBlur={(event) => {
                        setFocused(false);
                        onBlur?.(event);
                    }}
                    onSelect={(event) => {
                        setCursor(event.currentTarget.selectionStart ?? 0);
                        onSelect?.(event);
                    }}
                    onKeyDown={(event) => {
                        const input = event.currentTarget;
                        if (!event.nativeEvent.isComposing &&
                            !event.ctrlKey && !event.metaKey && !event.altKey &&
                            event.key.length === 1 && /^[0-9]$/.test(event.key) &&
                            code.length === length && cursor < length &&
                            input.selectionStart === input.selectionEnd &&
                            !readOnly && !disabled) {
                            event.preventDefault();
                            const next = code.slice(0, cursor) + event.key +
                                code.slice(cursor + 1);
                            if (value === undefined) setInternalValue(next);
                            onValueChange?.(next);
                            setCursor(cursor + 1);
                            input.setSelectionRange(cursor + 1, cursor + 1);
                        }
                        if (!event.nativeEvent.isComposing &&
                            event.key.length === 1 &&
                            !/^[0-9]$/.test(event.key) &&
                            !event.ctrlKey && !event.metaKey &&
                            !event.altKey) {
                            event.preventDefault();
                        }
                        onKeyDown?.(event);
                    }}
                    {...props}
                />
            </div>
        </div>
    );
}

export { PinInput };
export type { PinInputProps };
