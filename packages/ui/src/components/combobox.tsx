import {
    useEffect, useId, useRef, useState,
    type ComponentProps,
} from "react";
import { Input } from "./input";
import { cn } from "./utils";

type ComboboxOption = {
    value: string;
    label: string;
    disabled?: boolean;
};

type ComboboxProps = Omit<
    ComponentProps<"input">,
    "value" | "defaultValue" | "onChange" | "children" | "type" |
    "role" | "autoComplete" | "name"
> & {
    options: readonly ComboboxOption[];
    value?: string | null;
    defaultValue?: string | null;
    onValueChange?: (value: string | null) => void;
    onQueryChange?: (query: string) => void;
    name?: string;
    emptyMessage?: string;
    requiredMessage?: string;
    containerClassName?: string;
};

function Combobox({
    options,
    value,
    defaultValue = null,
    onValueChange,
    onQueryChange,
    name,
    id,
    disabled,
    readOnly,
    required,
    requiredMessage = "목록에서 항목을 선택하세요.",
    emptyMessage = "일치하는 항목이 없습니다.",
    className,
    containerClassName,
    onFocus,
    onBlur,
    onKeyDown,
    ref,
    ...props
}: ComboboxProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const listId = `${inputId}-listbox`;
    const inputRef = useRef<HTMLInputElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [internalValue, setInternalValue] = useState<string | null>(
        defaultValue,
    );
    const [query, setQuery] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const selectedValue = value === undefined ? internalValue : value;

    const knownValues = new Set<string>();
    for (const option of options) {
        if (!option.value || knownValues.has(option.value)) {
            throw new RangeError(
                "Combobox option values must be unique, nonempty strings.",
            );
        }
        knownValues.add(option.value);
    }
    if (selectedValue !== null && !knownValues.has(selectedValue)) {
        throw new RangeError("Combobox value must match an option.");
    }

    const selectedOption = options.find(
        (option) => option.value === selectedValue,
    );
    const filtered = options.filter((option) =>
        option.label.toLocaleLowerCase().includes(
            (query ?? "").toLocaleLowerCase(),
        ),
    );
    const firstEnabled = filtered.findIndex((option) => !option.disabled);
    let lastEnabled = -1;
    for (let index = 0; index < filtered.length; index += 1) {
        if (!filtered[index].disabled) lastEnabled = index;
    }
    const currentIndex = activeIndex >= 0 &&
        activeIndex < filtered.length && !filtered[activeIndex].disabled
        ? activeIndex : -1;

    useEffect(() => {
        const input = inputRef.current;
        if (!input) return;
        input.setCustomValidity(
            required && !disabled && selectedValue === null
                ? requiredMessage : "",
        );
    }, [disabled, required, requiredMessage, selectedValue]);

    useEffect(() => {
        if (value !== undefined) return;
        const form = inputRef.current?.form;
        const reset = () => {
            setInternalValue(defaultValue);
            setQuery(null);
            setOpen(false);
            setActiveIndex(-1);
        };
        form?.addEventListener("reset", reset);
        return () => form?.removeEventListener("reset", reset);
    }, [defaultValue, value]);

    useEffect(() => {
        if (!open) return;
        const closeOutside = (event: PointerEvent) => {
            if (containerRef.current?.contains(event.target as Node)) return;
            setOpen(false);
            setQuery(null);
        };
        document.addEventListener("pointerdown", closeOutside);
        return () => document.removeEventListener("pointerdown", closeOutside);
    }, [open]);

    function changeValue(next: string | null) {
        if (value === undefined) setInternalValue(next);
        if (next !== selectedValue) onValueChange?.(next);
    }

    function choose(option: ComboboxOption) {
        if (option.disabled || disabled || readOnly) return;
        changeValue(option.value);
        setQuery(null);
        setOpen(false);
        setActiveIndex(-1);
        inputRef.current?.focus();
    }

    function move(direction: 1 | -1) {
        if (disabled || readOnly) return;
        if (!open) {
            setOpen(true);
            setActiveIndex(direction === 1 ? firstEnabled : lastEnabled);
            return;
        }
        if (filtered.length === 0 || firstEnabled < 0) return;
        if (currentIndex < 0) {
            setActiveIndex(direction === 1 ? firstEnabled : lastEnabled);
            return;
        }
        let index = currentIndex;
        for (let count = 0; count < filtered.length; count += 1) {
            index = (index + direction + filtered.length) % filtered.length;
            if (!filtered[index].disabled) {
                setActiveIndex(index);
                return;
            }
        }
    }

    return (
        <div ref={containerRef}
            className={cn("relative w-full", containerClassName)}>
            <Input
                {...props}
                ref={(node) => {
                    inputRef.current = node;
                    if (typeof ref === "function") ref(node);
                    else if (ref) ref.current = node;
                }}
                id={inputId}
                type="text"
                role="combobox"
                autoComplete="off"
                aria-autocomplete="list"
                aria-expanded={open}
                aria-controls={listId}
                aria-activedescendant={open && currentIndex >= 0
                    ? `${inputId}-option-${currentIndex}` : undefined}
                name={undefined}
                value={query ?? selectedOption?.label ?? ""}
                disabled={disabled}
                readOnly={readOnly}
                required={required}
                className={className}
                onFocus={(event) => {
                    onFocus?.(event);
                    if (event.defaultPrevented || disabled || readOnly) return;
                    setOpen(true);
                    setActiveIndex(-1);
                    event.currentTarget.select();
                }}
                onClick={() => {
                    if (!disabled && !readOnly) setOpen(true);
                }}
                onBlur={(event) => {
                    onBlur?.(event);
                    setOpen(false);
                    setQuery(null);
                }}
                onChange={(event) => {
                    const nextQuery = event.currentTarget.value;
                    setQuery(nextQuery);
                    setOpen(true);
                    setActiveIndex(options.filter((option) =>
                        option.label.toLocaleLowerCase().includes(
                            nextQuery.toLocaleLowerCase(),
                        ),
                    ).findIndex((option) => !option.disabled));
                    changeValue(null);
                    onQueryChange?.(nextQuery);
                }}
                onKeyDown={(event) => {
                    onKeyDown?.(event);
                    if (event.defaultPrevented) return;
                    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                        event.preventDefault();
                        move(event.key === "ArrowDown" ? 1 : -1);
                    } else if (event.key === "Escape" && open) {
                        event.preventDefault();
                        setOpen(false);
                        setQuery(null);
                    } else if (event.key === "Enter" && open) {
                        event.preventDefault();
                        if (currentIndex >= 0) choose(filtered[currentIndex]);
                    }
                }}
            />
            {name && <input type="hidden" name={name}
                value={selectedValue ?? ""} disabled={disabled} />}
            <div hidden={!open || disabled || readOnly}
                className={
                    "absolute inset-x-0 top-full z-30 mt-1 max-h-56 " +
                    "overflow-y-auto rounded-sm border border-border " +
                    "bg-surface p-1 text-foreground " +
                    "shadow-[var(--shadow-float)]"
                }>
                    <ul id={listId} role="listbox"
                        className="m-0 list-none p-0">
                        {filtered.map((option, index) => (
                            <li key={option.value}
                                id={`${inputId}-option-${index}`}
                                role="option"
                                aria-selected={option.value === selectedValue}
                                aria-disabled={option.disabled || undefined}
                                data-active={index === currentIndex || undefined}
                                className={
                                    "cursor-default rounded-sm px-3 py-2 text-sm " +
                                    "data-[active=true]:bg-surface-subtle " +
                                    "aria-disabled:opacity-50"
                                }
                                onPointerDown={(event) => {
                                    if (event.pointerType === "mouse") {
                                        event.preventDefault();
                                    } else {
                                        choose(option);
                                    }
                                }}
                                onClick={() => choose(option)}
                                onMouseEnter={() => {
                                    if (!option.disabled) setActiveIndex(index);
                                }}
                            >{option.label}</li>
                        ))}
                    </ul>
                    {filtered.length === 0 && (
                        <p role="status" className="m-0 px-3 py-2 text-sm text-muted">
                            {emptyMessage}
                        </p>
                    )}
                </div>
        </div>
    );
}

export { Combobox };
export type { ComboboxOption, ComboboxProps };
