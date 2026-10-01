import { useId, useRef, type ComponentProps, type ReactNode } from "react";
import { Textarea } from "./textarea";
import { cn } from "./utils";

type CodeEditorShellProps = Omit<
    ComponentProps<"div">, "children" | "defaultValue" | "onChange"
> & {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    language?: string;
    description?: string;
    error?: string;
    actions?: ReactNode;
    name?: string;
    rows?: number;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    placeholder?: string;
    variant?: "panel" | "flat";
    showLineNumbers?: boolean;
};

function CodeEditorShell({
    label,
    value,
    onValueChange,
    language,
    description,
    error,
    actions,
    name,
    rows = 8,
    required = false,
    disabled = false,
    readOnly = false,
    placeholder,
    variant = "panel",
    showLineNumbers = true,
    className,
    ...props
}: CodeEditorShellProps) {
    const inputId = useId();
    const descriptionId = useId();
    const errorId = useId();
    const gutterRef = useRef<HTMLDivElement>(null);

    if (typeof label !== "string" || !label.trim()) {
        throw new Error("CodeEditorShell requires a label.");
    }
    if (typeof value !== "string") {
        throw new TypeError("CodeEditorShell value must be a string.");
    }
    if (typeof onValueChange !== "function") {
        throw new TypeError("CodeEditorShell requires onValueChange.");
    }
    if (language !== undefined &&
        (typeof language !== "string" || !language.trim())) {
        throw new Error("CodeEditorShell language must not be empty.");
    }
    if (!Number.isInteger(rows) || rows < 1) {
        throw new RangeError("CodeEditorShell rows must be a positive integer.");
    }
    if (variant !== "panel" && variant !== "flat") {
        throw new RangeError("CodeEditorShell variant is not supported.");
    }
    if (name !== undefined &&
        (typeof name !== "string" || !name.trim())) {
        throw new Error("CodeEditorShell name must not be empty.");
    }

    const lineCount = value.split("\n").length;
    const describedBy = [
        description ? descriptionId : null,
        error ? errorId : null,
    ].filter(Boolean).join(" ") || undefined;

    return (
        <div {...props} data-variant={variant} data-disabled={disabled || undefined}
            className={cn(
                "min-w-0 overflow-hidden text-foreground",
                variant === "panel" &&
                    "rounded-sm border border-border bg-surface",
                variant === "flat" && "border-b border-border bg-transparent",
                className,
            )}>
            <div className={cn(
                "flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 " +
                "px-[var(--space-3)] py-[var(--space-2)]",
                variant === "panel" &&
                    "border-b border-border bg-surface-subtle",
            )}>
                <label htmlFor={inputId}
                    className="min-w-0 flex-1 text-sm font-medium">
                    {label}
                </label>
                {language && <span className="text-xs text-muted">
                    {language}
                </span>}
                {actions && <div className="flex items-center gap-2">
                    {actions}
                </div>}
            </div>
            <div className={cn(
                "flex min-w-0 overflow-hidden focus-within:ring-2 " +
                "focus-within:ring-inset focus-within:ring-accent",
                error && "ring-1 ring-inset ring-danger " +
                    "focus-within:ring-danger",
            )} style={{ height: `calc(${rows} * 1.5rem + 1rem)` }}>
                {showLineNumbers && (
                    <div ref={gutterRef} aria-hidden="true"
                        className={
                            "w-12 shrink-0 select-none overflow-hidden " +
                            "border-r border-border bg-surface-subtle " +
                            "px-2 py-2 text-right font-mono text-xs " +
                            "leading-6 text-muted"
                        }>
                        {Array.from({ length: lineCount }, (_, index) => (
                            <span key={index} className="block">
                                {index + 1}
                            </span>
                        ))}
                    </div>
                )}
                <Textarea id={inputId} name={name} rows={rows}
                    value={value} required={required} disabled={disabled}
                    readOnly={readOnly} placeholder={placeholder}
                    aria-describedby={describedBy} aria-invalid={!!error}
                    spellCheck={false} wrap="off" dir="ltr"
                    onChange={(event) =>
                        onValueChange(event.currentTarget.value)}
                    onScroll={(event) => {
                        if (gutterRef.current) {
                            gutterRef.current.scrollTop =
                                event.currentTarget.scrollTop;
                        }
                    }}
                    className={
                        "m-0 h-full min-h-0 min-w-0 flex-1 resize-none " +
                        "rounded-none border-0 bg-transparent px-3 py-2 " +
                        "font-mono " +
                        "text-xs leading-6 shadow-none focus:outline-none " +
                        "focus-visible:outline-none"
                    } />
            </div>
            {(description || error) && (
                <div className="grid gap-1 px-[var(--space-3)] py-2">
                    {description && <p id={descriptionId}
                        className="m-0 text-xs text-muted">
                        {description}
                    </p>}
                    {error && <p id={errorId} role="alert"
                        className="m-0 text-xs text-danger">
                        {error}
                    </p>}
                </div>
            )}
        </div>
    );
}

export { CodeEditorShell };
export type { CodeEditorShellProps };
