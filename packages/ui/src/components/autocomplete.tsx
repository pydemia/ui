import {
    useEffect, useId, useRef, useState,
    type ComponentProps,
} from "react";
import { Input } from "./input";
import { cn } from "./utils";

type AutocompleteProps = Omit<
    ComponentProps<"input">,
    "value" | "defaultValue" | "onChange" | "children" | "type" |
    "role" | "autoComplete"
> & {
    label: string;
    suggestions: readonly string[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    onSuggestionSelect?: (value: string) => void;
    filterSuggestions?: boolean;
    loading?: boolean;
    loadingMessage?: string;
    errorMessage?: string | null;
    emptyMessage?: string;
    containerClassName?: string;
};

function Autocomplete({
    label,
    suggestions,
    value,
    defaultValue = "",
    onValueChange,
    onSuggestionSelect,
    filterSuggestions = true,
    loading = false,
    loadingMessage = "추천어를 불러오는 중입니다.",
    errorMessage = null,
    emptyMessage = "일치하는 추천어가 없습니다.",
    containerClassName,
    className,
    id,
    disabled,
    readOnly,
    onFocus,
    onBlur,
    onKeyDown,
    ref,
    ...props
}: AutocompleteProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const listId = `${generatedId}-listbox`;
    const inputRef = useRef<HTMLInputElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [open, setOpen] = useState(false);
    const [activeSuggestion, setActiveSuggestion] = useState<string | null>(null);
    const inputValue = value === undefined ? internalValue : value;

    if (typeof label !== "string" || !label.trim()) {
        throw new Error("Autocomplete requires a visible label.");
    }
    if (typeof defaultValue !== "string" || typeof inputValue !== "string") {
        throw new TypeError("Autocomplete value must be a string.");
    }
    if (value !== undefined && !onValueChange && !disabled && !readOnly) {
        throw new Error("Controlled Autocomplete requires onValueChange.");
    }
    if (!Array.isArray(suggestions) || suggestions.some((item) =>
        typeof item !== "string" || !item.trim()
    ) || new Set(suggestions).size !== suggestions.length) {
        throw new RangeError("Autocomplete suggestions must be unique text.");
    }
    if (loading && errorMessage) {
        throw new Error("Autocomplete cannot load and show an error together.");
    }

    const needle = inputValue.trim().toLocaleLowerCase();
    const visibleSuggestions = loading || errorMessage ? [] :
        suggestions.filter((item) => !filterSuggestions ||
            item.toLocaleLowerCase().includes(needle));
    const activeIndex = activeSuggestion === null ? -1 :
        visibleSuggestions.indexOf(activeSuggestion);
    const popupOpen = open && !disabled && !readOnly && (
        loading || Boolean(errorMessage) || visibleSuggestions.length > 0 ||
        inputValue.length > 0
    );

    useEffect(() => {
        if (value !== undefined) return;
        const form = inputRef.current?.form;
        const reset = () => {
            setInternalValue(defaultValue);
            setActiveSuggestion(null);
            setOpen(false);
        };
        form?.addEventListener("reset", reset);
        return () => form?.removeEventListener("reset", reset);
    }, [defaultValue, value]);

    useEffect(() => {
        if (!open) return;
        const closeOutside = (event: PointerEvent) => {
            if (containerRef.current?.contains(event.target as Node)) return;
            setOpen(false);
            setActiveSuggestion(null);
        };
        document.addEventListener("pointerdown", closeOutside);
        return () => document.removeEventListener("pointerdown", closeOutside);
    }, [open]);

    function changeValue(next: string) {
        if (value === undefined) setInternalValue(next);
        if (next !== inputValue) onValueChange?.(next);
    }

    function choose(suggestion: string) {
        if (disabled || readOnly) return;
        changeValue(suggestion);
        onSuggestionSelect?.(suggestion);
        setActiveSuggestion(null);
        setOpen(false);
    }

    function move(direction: 1 | -1) {
        if (visibleSuggestions.length === 0) return;
        const nextIndex = activeIndex < 0 ?
            direction === 1 ? 0 : visibleSuggestions.length - 1 :
            (activeIndex + direction + visibleSuggestions.length) %
                visibleSuggestions.length;
        setActiveSuggestion(visibleSuggestions[nextIndex]);
        setOpen(true);
    }

    return (
        <div ref={containerRef}
            className={cn("relative grid w-full gap-2", containerClassName)}>
            <label htmlFor={inputId} className="text-sm font-medium">
                {label}
            </label>
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
                aria-expanded={popupOpen}
                aria-controls={popupOpen ? listId : undefined}
                aria-activedescendant={popupOpen && activeIndex >= 0
                    ? `${generatedId}-option-${activeIndex}` : undefined}
                value={inputValue}
                disabled={disabled}
                readOnly={readOnly}
                className={className}
                onFocus={(event) => {
                    onFocus?.(event);
                    if (!event.defaultPrevented && !disabled && !readOnly) {
                        setOpen(true);
                    }
                }}
                onBlur={(event) => {
                    onBlur?.(event);
                    setOpen(false);
                    setActiveSuggestion(null);
                }}
                onChange={(event) => {
                    changeValue(event.currentTarget.value);
                    setActiveSuggestion(null);
                    setOpen(true);
                }}
                onKeyDown={(event) => {
                    onKeyDown?.(event);
                    if (event.defaultPrevented || event.nativeEvent.isComposing) {
                        return;
                    }
                    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
                        if (!visibleSuggestions.length) return;
                        event.preventDefault();
                        move(event.key === "ArrowDown" ? 1 : -1);
                    } else if (event.key === "Escape" && popupOpen) {
                        event.preventDefault();
                        setOpen(false);
                        setActiveSuggestion(null);
                    } else if (event.key === "Enter" && popupOpen &&
                        activeIndex >= 0) {
                        event.preventDefault();
                        choose(visibleSuggestions[activeIndex]);
                    }
                }}
            />
            {popupOpen && (
                <div className={
                    "absolute inset-x-0 top-full z-30 mt-1 max-h-56 " +
                    "overflow-y-auto rounded-sm border border-border " +
                    "bg-surface p-1 text-foreground " +
                    "shadow-[var(--shadow-float)]"
                }>
                    <ul id={listId} role="listbox"
                        aria-busy={loading || undefined}
                        className="m-0 list-none p-0">
                        {visibleSuggestions.map((suggestion, index) => (
                            <li key={suggestion}
                                id={`${generatedId}-option-${index}`}
                                role="option"
                                aria-selected={index === activeIndex}
                                data-active={index === activeIndex || undefined}
                                className={
                                    "cursor-default rounded-sm px-3 py-2 text-sm " +
                                    "data-[active=true]:bg-surface-subtle"
                                }
                                onPointerDown={(event) => {
                                    if (event.pointerType === "mouse") {
                                        event.preventDefault();
                                    } else {
                                        choose(suggestion);
                                    }
                                }}
                                onClick={() => choose(suggestion)}
                                onMouseEnter={() => setActiveSuggestion(suggestion)}
                            >{suggestion}</li>
                        ))}
                    </ul>
                    {loading && <p role="status"
                        className="m-0 px-3 py-2 text-sm text-muted">
                        {loadingMessage}
                    </p>}
                    {!loading && errorMessage && <p role="alert"
                        className="m-0 px-3 py-2 text-sm text-danger">
                        {errorMessage}
                    </p>}
                    {!loading && !errorMessage &&
                        visibleSuggestions.length === 0 && <p role="status"
                            className="m-0 px-3 py-2 text-sm text-muted">
                            {emptyMessage}
                        </p>}
                </div>
            )}
        </div>
    );
}

export { Autocomplete };
export type { AutocompleteProps };
