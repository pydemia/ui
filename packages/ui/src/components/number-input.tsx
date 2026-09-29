import {
    useId, useRef, useState, useEffect, type ComponentProps,
} from "react";
import { Input } from "./input";
import { cn } from "./utils";

type NumberInputProps = Omit<
    ComponentProps<"div">, "children" | "defaultValue" | "onChange"
> & {
    label: string;
    name?: string;
    value?: number | null;
    defaultValue?: number | null;
    onValueChange?: (value: number | null) => void;
    min?: number;
    max?: number;
    step?: number;
    locale?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    variant?: "field" | "stepper";
};

type ParsedNumber =
    | { status: "empty"; value: null }
    | { status: "invalid" }
    | { status: "valid"; value: number };

function parseNumber(
    text: string,
    decimal: string,
    group: string | undefined,
    minus: string,
    formatter: Intl.NumberFormat,
): ParsedNumber {
    const trimmed = text.trim();
    if (!trimmed) return { status: "empty", value: null };
    let ascii = trimmed.replaceAll(minus, "-");
    if (group && ascii.includes(group)) {
        const [integer, fraction, extra] = ascii.split(decimal);
        const unsigned = integer.replace(/^[+-]/, "");
        if (extra !== undefined || fraction?.includes(group)) {
            return { status: "invalid" };
        }
        const digits = unsigned.replaceAll(group, "");
        const expected = formatter.formatToParts(Number(digits))
            .filter((part) => part.type === "integer" ||
                part.type === "group")
            .map((part) => part.value).join("");
        if (unsigned !== expected) return { status: "invalid" };
        ascii = ascii.replaceAll(group, "");
    }
    if (decimal !== "." && ascii.includes(".")) {
        return { status: "invalid" };
    }
    ascii = ascii.replace(decimal, ".");
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(ascii)) {
        return { status: "invalid" };
    }
    const number = Number(ascii);
    return Number.isFinite(number)
        ? { status: "valid", value: number }
        : { status: "invalid" };
}

function NumberInput({
    label,
    name,
    value,
    defaultValue = null,
    onValueChange,
    min,
    max,
    step = 1,
    locale = "ko-KR",
    placeholder,
    required = false,
    disabled = false,
    variant = "stepper",
    id,
    className,
    ...props
}: NumberInputProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;
    const inputRef = useRef<HTMLInputElement>(null);
    const [internalValue, setInternalValue] = useState<number | null>(
        defaultValue,
    );
    const [draft, setDraft] = useState<{
        base: number | null;
        text: string;
    } | null>(null);
    const selected = value === undefined ? internalValue : value;
    const activeDraft = draft?.base === selected ? draft.text : null;
    const formatter = new Intl.NumberFormat(locale, {
        numberingSystem: "latn",
        maximumFractionDigits: 20,
    });
    const parts = formatter.formatToParts(-12345.6);
    const decimal = parts.find((part) => part.type === "decimal")?.value ?? ".";
    const group = parts.find((part) => part.type === "group")?.value;
    const minus = parts.find((part) => part.type === "minusSign")?.value ?? "-";
    let parsed: ParsedNumber;
    if (activeDraft !== null) {
        parsed = parseNumber(activeDraft, decimal, group, minus, formatter);
    } else if (selected === null) {
        parsed = { status: "empty", value: null };
    } else {
        parsed = { status: "valid", value: selected };
    }
    let error: string | null = null;
    if (parsed.status === "invalid") {
        error = "숫자를 입력하세요.";
    } else if (parsed.status === "empty") {
        if (required && activeDraft !== null) error = "값을 입력하세요.";
    } else if (min !== undefined && parsed.value < min) {
        error = `${formatter.format(min)} 이상 입력하세요.`;
    } else if (max !== undefined && parsed.value > max) {
        error = `${formatter.format(max)} 이하 입력하세요.`;
    }
    const current = parsed.status === "valid" && !error
        ? parsed.value : null;
    const hiddenValue = error ? "" : parsed.status === "valid"
        ? String(parsed.value) : "";

    useEffect(() => {
        inputRef.current?.setCustomValidity(error ?? "");
    }, [error]);

    if (!label.trim()) throw new Error("NumberInput requires a label.");
    if (min !== undefined && !Number.isFinite(min)) {
        throw new RangeError("NumberInput min must be finite.");
    }
    if (max !== undefined && !Number.isFinite(max)) {
        throw new RangeError("NumberInput max must be finite.");
    }
    if (min !== undefined && max !== undefined && min > max) {
        throw new RangeError("NumberInput min must not exceed max.");
    }
    if (!Number.isFinite(step) || step <= 0) {
        throw new RangeError("NumberInput step must be positive and finite.");
    }
    for (const candidate of [selected, defaultValue]) {
        if (candidate !== null && (
            !Number.isFinite(candidate) ||
            (min !== undefined && candidate < min) ||
            (max !== undefined && candidate > max)
        )) {
            throw new RangeError("NumberInput value is outside its range.");
        }
    }
    if (value !== undefined && !onValueChange && !disabled) {
        throw new Error("Controlled NumberInput requires onValueChange.");
    }

    function commit(next: number | null) {
        setDraft(null);
        if (next === selected) return;
        if (value === undefined) setInternalValue(next);
        onValueChange?.(next);
    }

    function move(direction: -1 | 1) {
        if (disabled || error) return;
        let next: number;
        if (current === null) {
            next = direction === 1 ? min ?? step : max ?? -step;
        } else {
            next = Number((current + direction * step).toPrecision(15));
        }
        if (min !== undefined) next = Math.max(min, next);
        if (max !== undefined) next = Math.min(max, next);
        commit(next);
    }

    const text = activeDraft ?? (
        selected === null ? "" : formatter.format(selected)
    );
    const field = (
        <Input
            ref={inputRef}
            id={inputId}
            type="text"
            role="spinbutton"
            inputMode="decimal"
            autoComplete="off"
            placeholder={placeholder}
            value={text}
            required={required}
            disabled={disabled}
            aria-valuenow={current ?? undefined}
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuetext={current === null
                ? undefined : formatter.format(current)}
            aria-invalid={!!error || undefined}
            aria-describedby={error ? errorId : undefined}
            onChange={(event) => setDraft({
                base: selected,
                text: event.target.value,
            })}
            onBlur={() => {
                if (activeDraft !== null && !error) {
                    commit(parsed.status === "valid" ? parsed.value : null);
                }
            }}
            onKeyDown={(event) => {
                if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                    event.preventDefault();
                    move(event.key === "ArrowUp" ? 1 : -1);
                } else if (event.key === "Home" &&
                    min !== undefined && !error) {
                    event.preventDefault();
                    commit(min);
                } else if (event.key === "End" &&
                    max !== undefined && !error) {
                    event.preventDefault();
                    commit(max);
                } else if (event.key === "Enter" &&
                    activeDraft !== null && !error) {
                    commit(parsed.status === "valid" ? parsed.value : null);
                }
            }}
            className={variant === "stepper"
                ? "h-full flex-1 rounded-none border-0 bg-transparent " +
                    "focus-visible:outline-none"
                : undefined}
        />
    );

    return (
        <div className={cn("grid min-w-0 gap-2", className)} {...props}>
            <label htmlFor={inputId} className="text-sm font-medium">
                {label}
            </label>
            {variant === "stepper" ? (
                <div className={
                    "flex h-[var(--control-height)] overflow-hidden rounded-sm " +
                    "border border-border bg-surface focus-within:outline-2 " +
                    "focus-within:outline-focus focus-within:outline-offset-2"
                }>
                    <button type="button" disabled={disabled || !!error ||
                        (current !== null && min !== undefined &&
                            current <= min)}
                        aria-label={`${label} 감소`}
                        onClick={() => move(-1)}
                        className={
                            "w-9 border-r border-border text-sm " +
                            "hover:bg-surface-subtle disabled:opacity-50"
                        }>
                        −
                    </button>
                    {field}
                    <button type="button" disabled={disabled || !!error ||
                        (current !== null && max !== undefined &&
                            current >= max)}
                        aria-label={`${label} 증가`}
                        onClick={() => move(1)}
                        className={
                            "w-9 border-l border-border text-sm " +
                            "hover:bg-surface-subtle disabled:opacity-50"
                        }>
                        +
                    </button>
                </div>
            ) : field}
            {name && <input type="hidden" name={name}
                value={hiddenValue} disabled={disabled} />}
            {error && <p id={errorId} role="alert"
                className="m-0 text-xs text-danger">{error}</p>}
        </div>
    );
}

export { NumberInput };
export type { NumberInputProps };
