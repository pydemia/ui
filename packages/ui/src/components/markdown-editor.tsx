import { useId, useState, type ComponentProps } from "react";
import { Markdown } from "./markdown";
import { Textarea } from "./textarea";
import { cn } from "./utils";

type MarkdownEditorProps = Omit<
    ComponentProps<"section">, "children" | "defaultValue" | "onChange"
> & {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    name?: string;
    description?: string;
    error?: string;
    placeholder?: string;
    rows?: number;
    required?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    defaultShowPreview?: boolean;
};

function MarkdownEditor({
    label,
    value,
    onValueChange,
    name,
    description,
    error,
    placeholder,
    rows = 10,
    required = false,
    disabled = false,
    readOnly = false,
    defaultShowPreview = true,
    className,
    ...props
}: MarkdownEditorProps) {
    const inputId = useId();
    const descriptionId = useId();
    const errorId = useId();
    const previewId = useId();
    const previewTitleId = useId();
    const [showPreview, setShowPreview] = useState(defaultShowPreview);

    if (typeof label !== "string" || !label.trim()) {
        throw new Error("MarkdownEditor requires a label.");
    }
    if (typeof value !== "string") {
        throw new TypeError("MarkdownEditor value must be a string.");
    }
    if (typeof onValueChange !== "function") {
        throw new TypeError("MarkdownEditor requires onValueChange.");
    }
    if (!Number.isInteger(rows) || rows < 1) {
        throw new RangeError("MarkdownEditor rows must be a positive integer.");
    }
    if (name !== undefined &&
        (typeof name !== "string" || !name.trim())) {
        throw new Error("MarkdownEditor name must not be empty.");
    }

    const describedBy = [
        description ? descriptionId : null,
        error ? errorId : null,
    ].filter(Boolean).join(" ") || undefined;

    return (
        <section {...props} className={cn(
            "min-w-0 overflow-hidden rounded-sm border border-border " +
            "bg-surface text-foreground",
            className,
        )}>
            <div className={
                "flex flex-wrap items-center justify-between gap-2 " +
                "border-b border-border bg-surface-subtle " +
                "px-[var(--space-3)] py-[var(--space-2)]"
            }>
                <label htmlFor={inputId} className="text-sm font-medium">
                    {label}
                </label>
                <button type="button" aria-controls={previewId}
                    aria-expanded={showPreview}
                    onClick={() => setShowPreview((current) => !current)}
                    className={
                        "rounded-sm border border-border bg-surface " +
                        "px-3 py-1 text-xs hover:bg-surface-subtle " +
                        "focus-visible:outline-2 focus-visible:outline-focus"
                    }>
                    {showPreview ? "미리보기 숨기기" : "미리보기 표시"}
                </button>
            </div>
            <div className={cn(
                "grid min-w-0",
                showPreview && "lg:grid-cols-2",
            )}>
                <div className={cn(
                    "min-w-0 p-[var(--space-3)]",
                    showPreview && "border-b border-border lg:border-b-0 " +
                        "lg:border-r",
                )}>
                    <Textarea id={inputId} name={name} value={value}
                        rows={rows} required={required} disabled={disabled}
                        readOnly={readOnly} placeholder={placeholder}
                        aria-describedby={describedBy}
                        aria-invalid={!!error}
                        onChange={(event) =>
                            onValueChange(event.currentTarget.value)}
                        className={
                            "block min-h-0 resize-y font-mono text-xs " +
                            "leading-6"
                        } />
                </div>
                <div id={previewId} hidden={!showPreview}
                    role="region" aria-labelledby={previewTitleId}
                    className="min-w-0 p-[var(--space-3)]">
                    <h3 id={previewTitleId}
                        className="mb-3 mt-0 text-xs font-medium text-muted">
                        미리보기
                    </h3>
                    {value.trim()
                        ? <Markdown source={value} />
                        : <p className="m-0 text-sm text-muted">
                            입력한 내용이 여기에 표시됩니다.
                        </p>}
                </div>
            </div>
            {(description || error) && (
                <div className={
                    "grid gap-1 border-t border-border " +
                    "px-[var(--space-3)] py-[var(--space-2)]"
                }>
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
        </section>
    );
}

export { MarkdownEditor };
export type { MarkdownEditorProps };
