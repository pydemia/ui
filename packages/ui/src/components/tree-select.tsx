import { ChevronDown, X } from "lucide-react";
import {
    useEffect, useId, useRef, useState,
    type ComponentProps,
} from "react";
import {
    Popover, PopoverContent, PopoverTrigger,
} from "./popover";
import { Tree } from "./tree";
import { cn } from "./utils";

type TreeSelectItem = {
    id: string;
    label: string;
    disabled?: boolean;
    children?: readonly TreeSelectItem[];
};

type TreeSelectProps = Omit<
    ComponentProps<"button">,
    "children" | "value" | "defaultValue" | "onChange" | "name" |
    "required" | "type"
> & {
    label: string;
    items: readonly TreeSelectItem[];
    value?: string | null;
    defaultValue?: string | null;
    onValueChange?: (value: string | null) => void;
    name?: string;
    required?: boolean;
    requiredMessage?: string;
    placeholder?: string;
    emptyMessage?: string;
    clearable?: boolean;
    containerClassName?: string;
};

function TreeSelect({
    label, items, value, defaultValue = null, onValueChange,
    name, required = false, requiredMessage = "항목을 선택하세요.",
    placeholder = "항목 선택", emptyMessage, clearable = true,
    containerClassName, className, disabled, form, id, ref, ...props
}: TreeSelectProps) {
    const generatedId = useId();
    const triggerId = id ?? generatedId;
    const errorId = `${triggerId}-error`;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const [open, setOpen] = useState(false);
    const [invalid, setInvalid] = useState(false);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);
    const selectRef = useRef<HTMLSelectElement | null>(null);
    const selectedId = value === undefined ? internalValue : value;
    const entries = new Map<string, {
        label: string;
        path: string;
        parentIds: string[];
        disabled: boolean;
    }>();

    if (typeof label !== "string" || !label.trim()) {
        throw new Error("TreeSelect requires a label.");
    }

    function collect(nodes: readonly TreeSelectItem[], labels: string[],
        parentIds: string[], parentDisabled: boolean) {
        for (const node of nodes) {
            if (typeof node.id !== "string" || !node.id.trim() ||
                typeof node.label !== "string" || !node.label.trim()) {
                throw new Error("TreeSelect items need nonempty ids and labels.");
            }
            if (entries.has(node.id)) {
                throw new Error(`TreeSelect item id must be unique: ${node.id}`);
            }
            const itemDisabled = parentDisabled || Boolean(node.disabled);
            entries.set(node.id, {
                label: node.label,
                path: [...labels, node.label].join(" / "),
                parentIds,
                disabled: itemDisabled,
            });
            if (node.children) {
                collect(node.children, [...labels, node.label],
                    [...parentIds, node.id], itemDisabled);
            }
        }
    }

    collect(items, [], [], false);
    if (selectedId !== null && (
        typeof selectedId !== "string" ||
        !entries.has(selectedId) || entries.get(selectedId)?.disabled
    )) {
        throw new RangeError("TreeSelect value must match an enabled item.");
    }
    const selected = selectedId === null ? undefined : entries.get(selectedId);

    useEffect(() => {
        if (value !== undefined) return;
        const formElement = selectRef.current?.form;
        const reset = () => {
            setInternalValue(defaultValue);
            setOpen(false);
            setInvalid(false);
        };
        formElement?.addEventListener("reset", reset);
        return () => formElement?.removeEventListener("reset", reset);
    }, [defaultValue, value]);

    function choose(next: string | null) {
        if (value === undefined) setInternalValue(next);
        setInvalid(false);
        setOpen(false);
        onValueChange?.(next);
    }

    return (
        <div className={cn("min-w-0", containerClassName)}>
            <label htmlFor={triggerId}
                className="mb-1 block text-sm font-medium text-foreground">
                {label}{required && <span aria-hidden="true"
                    className="ml-1 text-danger">*</span>}
            </label>
            <Popover open={open} onOpenChange={setOpen}>
                <div className="flex min-w-0 items-center gap-1">
                    <PopoverTrigger asChild>
                        <button {...props} type="button" id={triggerId}
                            form={form} disabled={disabled}
                            ref={(element) => {
                                triggerRef.current = element;
                                if (typeof ref === "function") ref(element);
                                else if (ref) ref.current = element;
                            }}
                            aria-label={`${label}${required ? " (필수)" : ""}: ${
                                selected?.path ?? placeholder
                            }`}
                            aria-invalid={invalid || undefined}
                            aria-describedby={invalid ? errorId : undefined}
                            className={cn(
                                "flex h-[var(--control-height)] min-w-0 flex-1 " +
                                "items-center justify-between gap-2 rounded-sm " +
                                "border border-border bg-surface px-[var(--space-3)] " +
                                "text-left text-sm text-foreground " +
                                "disabled:cursor-not-allowed disabled:opacity-50 " +
                                "aria-invalid:border-danger",
                                className,
                            )}>
                            <span className={cn("min-w-0 truncate",
                                !selected && "text-muted")}
                                title={selected?.path}>
                                {selected?.path ?? placeholder}
                            </span>
                            <ChevronDown aria-hidden="true"
                                className="size-4 shrink-0" />
                        </button>
                    </PopoverTrigger>
                    {clearable && !required && selected && (
                        <button type="button" disabled={disabled}
                            aria-label={`${label} 선택 지우기`}
                            onClick={() => choose(null)}
                            className="grid size-[var(--control-height)] shrink-0 place-items-center rounded-sm border border-border text-muted hover:bg-surface-subtle disabled:opacity-50">
                            <X aria-hidden="true" className="size-4" />
                        </button>
                    )}
                </div>
                <PopoverContent ref={contentRef} align="start"
                    className="max-h-80 w-[var(--radix-popover-trigger-width)] min-w-64 max-w-[calc(100vw-2rem)] overflow-y-auto p-1"
                    onOpenAutoFocus={(event) => {
                        event.preventDefault();
                        contentRef.current?.querySelector<HTMLElement>(
                            '[role="treeitem"][tabindex="0"]',
                        )?.focus();
                    }}>
                    <Tree label={`${label} 선택`} items={items}
                        selectedId={selectedId}
                        defaultExpandedIds={selected?.parentIds}
                        onSelectedIdChange={choose}
                        emptyMessage={emptyMessage}
                        className="border-0 p-0" />
                </PopoverContent>
            </Popover>
            <select ref={selectRef} name={name} form={form}
                value={selectedId ?? ""} required={required}
                disabled={disabled} tabIndex={-1}
                aria-hidden="true"
                className="sr-only"
                onChange={(event) => {
                    choose(event.currentTarget.value || null);
                }}
                onInvalid={(event) => {
                    event.preventDefault();
                    setInvalid(true);
                    triggerRef.current?.focus();
                }}>
                <option value="">{placeholder}</option>
                {Array.from(entries).filter(([, item]) => !item.disabled)
                    .map(([itemId, item]) => (
                        <option key={itemId} value={itemId}>
                            {item.path}
                        </option>
                    ))}
            </select>
            {invalid && <p id={errorId} role="alert"
                className="mt-1 text-xs text-danger">
                {requiredMessage}
            </p>}
        </div>
    );
}

export { TreeSelect };
export type { TreeSelectItem, TreeSelectProps };
