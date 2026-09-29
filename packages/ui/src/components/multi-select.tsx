import {
    useEffect, useId, useRef, useState,
    type ComponentProps,
} from "react";
import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "./utils";

type MultiSelectOption = {
    value: string;
    label: string;
    disabled?: boolean;
};

type MultiSelectProps = Omit<
    ComponentProps<"button">,
    "children" | "value" | "defaultValue" | "name" | "onChange" |
    "ref" | "type"
> & {
    "aria-label": string;
    options: readonly MultiSelectOption[];
    value?: readonly string[];
    defaultValue?: readonly string[];
    onValueChange?: (values: string[]) => void;
    name?: string;
    required?: boolean;
    requiredMessage?: string;
    maxSelections?: number;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyMessage?: string;
    containerClassName?: string;
};

const emptySelection: readonly string[] = [];

function MultiSelect({
    options,
    value,
    defaultValue = emptySelection,
    onValueChange,
    name,
    required = false,
    requiredMessage = "항목을 하나 이상 선택하세요.",
    maxSelections,
    placeholder = "항목 선택",
    searchPlaceholder = "항목 검색",
    emptyMessage = "일치하는 항목이 없습니다.",
    containerClassName,
    className,
    disabled = false,
    id,
    "aria-label": ariaLabel,
    "aria-describedby": describedBy,
    "aria-invalid": ariaInvalid,
    "aria-required": ariaRequired,
    ...buttonProps
}: MultiSelectProps) {
    const generatedId = useId();
    const triggerId = id ?? generatedId;
    const selectionId = `${triggerId}-selection`;
    const errorId = `${triggerId}-required-error`;
    const triggerRef = useRef<HTMLButtonElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);
    const [internalValue, setInternalValue] = useState<readonly string[]>(
        defaultValue,
    );
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [requiredError, setRequiredError] = useState(false);
    const selected = value === undefined ? internalValue : value;
    const known = new Set(options.map((option) => option.value));

    if (!ariaLabel.trim() || options.some((option) =>
        !option.value.trim() || !option.label.trim()
    ) || known.size !== options.length) {
        throw new Error("MultiSelect requires an accessible label and unique named options.");
    }
    if (new Set(selected).size !== selected.length ||
        selected.some((item) => !known.has(item)) ||
        (maxSelections !== undefined && (
            !Number.isInteger(maxSelections) || maxSelections < 1 ||
            selected.length > maxSelections
        ))) {
        throw new Error("MultiSelect values or selection limit are invalid.");
    }

    useEffect(() => {
        if (value !== undefined) return;
        const form = selectRef.current?.form;
        const reset = () => {
            setInternalValue(defaultValue);
            setQuery("");
            setOpen(false);
            setRequiredError(false);
        };
        form?.addEventListener("reset", reset);
        return () => form?.removeEventListener("reset", reset);
    }, [defaultValue, value]);

    function changeSelection(next: string[]) {
        if (value === undefined) setInternalValue(next);
        setRequiredError(false);
        onValueChange?.(next);
    }

    function toggle(item: string) {
        if (disabled) return;
        if (selected.includes(item)) {
            changeSelection(selected.filter((entry) => entry !== item));
        } else if (maxSelections === undefined ||
            selected.length < maxSelections) {
            changeSelection([...selected, item]);
        }
    }

    const filtered = options.filter((option) =>
        option.label.toLocaleLowerCase().includes(query.toLocaleLowerCase()),
    );
    const selectedOptions = selected.map((item) =>
        options.find((option) => option.value === item)!,
    );

    return (
        <div className={cn("grid min-w-0 gap-2", containerClassName)}>
            <Popover open={open} onOpenChange={(next) => {
                setOpen(next);
                if (!next) setQuery("");
            }}>
                <PopoverTrigger asChild>
                    <button
                        {...buttonProps}
                        ref={triggerRef}
                        id={triggerId}
                        type="button"
                        disabled={disabled}
                        aria-label={ariaLabel}
                        aria-describedby={[
                            describedBy, selectionId,
                            requiredError ? errorId : undefined,
                        ].filter(Boolean).join(" ")}
                        aria-invalid={requiredError || ariaInvalid || undefined}
                        aria-required={required || ariaRequired || undefined}
                        className={cn(
                            "flex min-h-[var(--control-height)] w-full " +
                            "items-center justify-between gap-2 rounded-sm " +
                            "border border-border bg-surface " +
                            "px-[var(--space-3)] text-left text-sm " +
                            "text-foreground focus-visible:outline-2 " +
                            "focus-visible:outline-focus " +
                            "aria-invalid:border-danger disabled:opacity-50",
                            className,
                        )}
                    >
                        <span className={selected.length ? undefined :
                            "text-muted"}>
                            {selected.length
                                ? `${selected.length}개 선택`
                                : placeholder}
                        </span>
                        <span aria-hidden="true">⌄</span>
                    </button>
                </PopoverTrigger>
                <PopoverContent align="start" aria-label={
                    `${ariaLabel} 선택`
                } className="w-[var(--radix-popover-trigger-width)] p-3">
                    <Input type="search" aria-label={`${ariaLabel} 검색`}
                        placeholder={searchPlaceholder}
                        value={query}
                        onChange={(event) => setQuery(event.target.value)} />
                    <fieldset className="m-0 mt-3 min-w-0 border-0 p-0">
                        <legend className="mb-2 text-xs font-medium text-muted">
                            {ariaLabel}
                        </legend>
                        <div className="max-h-56 overflow-y-auto">
                            {filtered.length ? filtered.map((option) => {
                                const checked = selected.includes(option.value);
                                const limitReached = maxSelections !== undefined &&
                                    selected.length >= maxSelections;
                                return (
                                    <label key={option.value} className={
                                        "flex min-h-9 cursor-pointer " +
                                        "items-center gap-2 rounded-sm " +
                                        "px-2 text-sm hover:bg-surface-subtle " +
                                        "has-[:disabled]:cursor-not-allowed " +
                                        "has-[:disabled]:opacity-50"
                                    }>
                                        <input type="checkbox"
                                            checked={checked}
                                            disabled={disabled ||
                                                option.disabled ||
                                                (limitReached && !checked)}
                                            onChange={() => toggle(option.value)}
                                            className="size-4 accent-accent" />
                                        <span>{option.label}</span>
                                    </label>
                                );
                            }) : (
                                <p role="status"
                                    className="m-0 px-2 py-2 text-sm text-muted">
                                    {emptyMessage}
                                </p>
                            )}
                        </div>
                    </fieldset>
                </PopoverContent>
            </Popover>
            <span id={selectionId} className="sr-only">
                {selectedOptions.length
                    ? `선택됨: ${selectedOptions.map((option) =>
                        option.label).join(", ")}`
                    : "선택된 항목 없음"}
            </span>
            <select ref={selectRef} multiple tabIndex={-1}
                aria-hidden="true" className="sr-only" name={name}
                value={[...selected]} required={required} disabled={disabled}
                onChange={() => {}}
                onInvalid={(event) => {
                    event.preventDefault();
                    setRequiredError(true);
                    setOpen(true);
                    triggerRef.current?.focus();
                }}>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {requiredError && (
                <p id={errorId} role="alert"
                    className="m-0 text-xs text-danger">
                    {requiredMessage}
                </p>
            )}
            {selectedOptions.length > 0 && (
                <ul aria-label={`${ariaLabel} 선택됨`}
                    className="m-0 flex list-none flex-wrap gap-1 p-0">
                    {selectedOptions.map((option) => (
                        <li key={option.value}>
                            <button type="button" disabled={disabled}
                                aria-label={`${option.label} 제거`}
                                onClick={() => {
                                    toggle(option.value);
                                    triggerRef.current?.focus();
                                }}
                                className={
                                    "rounded-sm border border-border " +
                                    "bg-surface-subtle px-2 py-1 text-xs " +
                                    "text-foreground hover:bg-surface " +
                                    "focus-visible:outline-2 " +
                                    "focus-visible:outline-focus " +
                                    "disabled:opacity-50"
                                }>
                                {option.label} <span aria-hidden="true">×</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export { MultiSelect };
export type { MultiSelectOption, MultiSelectProps };
