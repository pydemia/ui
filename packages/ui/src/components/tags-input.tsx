import {
    useEffect, useId, useRef, useState, type ComponentProps,
} from "react";
import { cn } from "./utils";

type TagsInputProps = Omit<
    ComponentProps<"div">, "children" | "defaultValue" | "onChange"
> & {
    label: string;
    name?: string;
    value?: readonly string[];
    defaultValue?: readonly string[];
    onValueChange?: (value: string[]) => void;
    maxTags?: number;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    variant?: "outline" | "soft";
};

function duplicateKey(tag: string) {
    return tag.toLowerCase();
}

function TagsInput({
    label,
    name,
    value,
    defaultValue = [],
    onValueChange,
    maxTags,
    placeholder,
    required = false,
    disabled = false,
    variant = "outline",
    id,
    className,
    ...props
}: TagsInputProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const helpId = `${inputId}-help`;
    const errorId = `${inputId}-error`;
    const inputRef = useRef<HTMLInputElement>(null);
    const [internalValue, setInternalValue] = useState<string[]>(
        [...defaultValue],
    );
    const [draft, setDraft] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [showRequired, setShowRequired] = useState(false);
    const [announcement, setAnnouncement] = useState("");
    const tags = value === undefined ? internalValue : value;
    const requiredError = required && tags.length === 0 && showRequired
        ? "태그를 하나 이상 추가하세요." : null;
    const displayedError = error ?? requiredError;

    useEffect(() => {
        inputRef.current?.setCustomValidity(
            draft.trim() ? "Enter 또는 쉼표로 태그를 추가하세요."
                : required && tags.length === 0
                    ? "태그를 하나 이상 추가하세요." : "",
        );
    }, [draft, required, tags.length]);

    if (!label.trim()) throw new Error("TagsInput requires a label.");
    if (name !== undefined && !name.trim()) {
        throw new Error("TagsInput name must not be empty.");
    }
    if (maxTags !== undefined && (!Number.isInteger(maxTags) || maxTags < 1)) {
        throw new RangeError("TagsInput maxTags must be a positive integer.");
    }
    for (const candidates of [tags, defaultValue]) {
        if (!Array.isArray(candidates)) {
            throw new TypeError("TagsInput value must be an array.");
        }
        if (maxTags !== undefined && candidates.length > maxTags) {
            throw new RangeError("TagsInput value exceeds maxTags.");
        }
        const seen = new Set<string>();
        for (const tag of candidates) {
            if (typeof tag !== "string" || !tag.trim() || tag !== tag.trim()) {
                throw new TypeError("TagsInput tags must be nonempty and trimmed.");
            }
            const key = duplicateKey(tag);
            if (seen.has(key)) {
                throw new Error("TagsInput value contains duplicate tags.");
            }
            seen.add(key);
        }
    }
    if (value !== undefined && !onValueChange && !disabled) {
        throw new Error("Controlled TagsInput requires onValueChange.");
    }

    function commit(next: string[]) {
        if (value === undefined) setInternalValue(next);
        onValueChange?.(next);
    }

    function addTags(candidates: string[]) {
        const next = [...tags];
        const seen = new Set(tags.map(duplicateKey));
        for (const candidate of candidates) {
            const tag = candidate.trim();
            if (!tag) continue;
            if (seen.has(duplicateKey(tag))) {
                setError(`이미 추가한 태그입니다: ${tag}`);
                return;
            }
            if (maxTags !== undefined && next.length >= maxTags) {
                setError(`태그는 최대 ${maxTags}개까지 추가할 수 있습니다.`);
                return;
            }
            next.push(tag);
            seen.add(duplicateKey(tag));
        }
        if (next.length === tags.length) return;
        commit(next);
        setDraft("");
        setError(null);
        setShowRequired(false);
        setAnnouncement(`${next.length - tags.length}개 태그를 추가했습니다.`);
    }

    function removeTag(index: number) {
        const next = tags.filter((_, position) => position !== index);
        commit(next);
        setError(null);
        setShowRequired(required && next.length === 0);
        setAnnouncement(`${tags[index]} 태그를 삭제했습니다.`);
        inputRef.current?.focus();
    }

    return (
        <div className={cn("grid min-w-0 gap-2", className)} {...props}>
            <label htmlFor={inputId} className="text-sm font-medium">
                {label}{required && <span aria-hidden="true"> *</span>}
            </label>
            <div
                className={cn(
                    "flex min-h-[var(--control-height)] flex-wrap items-center " +
                    "gap-1.5 rounded-sm border border-border px-2 py-1 " +
                    "focus-within:outline-2 focus-within:outline-focus " +
                    "focus-within:outline-offset-2",
                    variant === "soft" ? "bg-surface-subtle" : "bg-surface",
                    displayedError && "border-danger",
                    disabled && "opacity-50",
                )}
                onClick={() => inputRef.current?.focus()}
            >
                {tags.length > 0 && (
                    <ul aria-label={`${label} 목록`}
                        className="m-0 flex list-none flex-wrap gap-1.5 p-0">
                        {tags.map((tag, index) => (
                            <li key={duplicateKey(tag)}
                                className={
                                    "inline-flex items-center gap-1 rounded-sm " +
                                    "bg-surface-subtle px-2 py-0.5 text-sm " +
                                    "text-foreground"
                                }>
                                <span>{tag}</span>
                                <button type="button" disabled={disabled}
                                    aria-label={`${tag} 삭제`}
                                    onClick={() => removeTag(index)}
                                    className={
                                        "rounded-sm px-0.5 text-muted " +
                                        "hover:text-foreground"
                                    }>×</button>
                            </li>
                        ))}
                    </ul>
                )}
                <input
                    ref={inputRef}
                    id={inputId}
                    type="text"
                    value={draft}
                    disabled={disabled}
                    placeholder={tags.length === 0 ? placeholder : undefined}
                    aria-required={required || undefined}
                    aria-invalid={!!displayedError || undefined}
                    aria-describedby={displayedError
                        ? `${helpId} ${errorId}` : helpId}
                    className={
                        "min-w-24 flex-1 border-0 bg-transparent py-1 " +
                        "text-sm text-foreground outline-none " +
                        "focus-visible:!outline-none " +
                        "placeholder:text-muted"
                    }
                    onChange={(event) => {
                        setDraft(event.target.value);
                        setError(null);
                    }}
                    onInvalid={() => {
                        if (draft.trim()) {
                            setError("Enter 또는 쉼표로 태그를 추가하세요.");
                        } else {
                            setShowRequired(true);
                        }
                    }}
                    onKeyDown={(event) => {
                        if (event.nativeEvent.isComposing) return;
                        if (event.key === ",") {
                            event.preventDefault();
                            if (draft.trim()) addTags([draft]);
                        } else if (event.key === "Enter" && draft.trim()) {
                            event.preventDefault();
                            addTags([draft]);
                        } else if (event.key === "Backspace" && !draft &&
                            tags.length > 0) {
                            event.preventDefault();
                            removeTag(tags.length - 1);
                        }
                    }}
                    onPaste={(event) => {
                        const pasted = event.clipboardData.getData("text");
                        if (!/[,\r\n]/.test(pasted)) return;
                        event.preventDefault();
                        addTags((draft + pasted).split(/[,\r\n]+/));
                    }}
                />
            </div>
            <p id={helpId} className="m-0 text-xs text-muted">
                Enter 또는 쉼표로 추가하고, 빈 입력에서 Backspace로
                마지막 태그를 삭제합니다.
            </p>
            {displayedError && <p id={errorId} role="alert"
                className="m-0 text-xs text-danger">{displayedError}</p>}
            <output aria-live="polite" className="sr-only">
                {announcement}
            </output>
            {name && tags.map((tag) => (
                <input key={duplicateKey(tag)} type="hidden" name={name}
                    value={tag} disabled={disabled} />
            ))}
        </div>
    );
}

export { TagsInput };
export type { TagsInputProps };
