import { useEffect, useId, useRef, useState,
    type ComponentProps } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { cn } from "./utils";

type EditableProps = Omit<
    ComponentProps<"div">, "children" | "role" | "aria-label"
> & {
    label: string;
    value: string;
    onSave: (value: string) => void | Promise<void>;
    validate?: (value: string) => string | null;
    required?: boolean;
    disabled?: boolean;
    maxLength?: number;
    placeholder?: string;
    saveErrorMessage?: string;
};

function Editable({
    label, value, onSave, validate, required = false,
    disabled = false, maxLength, placeholder = "값 없음",
    saveErrorMessage = "저장하지 못했습니다. 다시 시도하세요.",
    className, ...props
}: EditableProps) {
    const errorId = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    const editButtonRef = useRef<HTMLButtonElement>(null);
    const pendingRef = useRef(false);
    const [editing, setEditing] = useState(false);
    const [draft, setDraft] = useState(value);
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!label.trim()) throw new Error("Editable requires a label.");

    useEffect(() => {
        if (!editing) return;
        inputRef.current?.focus();
        inputRef.current?.select();
    }, [editing]);

    function returnToPreview() {
        setEditing(false);
        requestAnimationFrame(() => editButtonRef.current?.focus());
    }

    function cancel() {
        if (pendingRef.current) return;
        setDraft(value);
        setError(null);
        returnToPreview();
    }

    async function save() {
        if (pendingRef.current || disabled) return;
        const validationError = required && !draft.trim()
            ? "값을 입력하세요."
            : validate?.(draft) || null;
        if (validationError) {
            setError(validationError);
            inputRef.current?.focus();
            return;
        }
        if (draft === value) {
            setError(null);
            returnToPreview();
            return;
        }
        pendingRef.current = true;
        setPending(true);
        setError(null);
        try {
            await onSave(draft);
            returnToPreview();
        } catch {
            setError(saveErrorMessage);
            inputRef.current?.focus();
        } finally {
            pendingRef.current = false;
            setPending(false);
        }
    }

    return (
        <div {...props} role="group" aria-label={label}
            aria-busy={pending} className={cn("grid gap-2", className)}>
            {editing ? (
                <>
                    <Input ref={inputRef} aria-label={label}
                        aria-invalid={!!error}
                        aria-describedby={error ? errorId : undefined}
                        required={required} maxLength={maxLength}
                        disabled={disabled} readOnly={pending} value={draft}
                        onChange={(event) => {
                            setDraft(event.target.value);
                            setError(null);
                        }}
                        onKeyDown={(event) => {
                            if (event.key === "Escape" && !pendingRef.current) {
                                event.preventDefault();
                                cancel();
                            } else if (event.key === "Enter") {
                                event.preventDefault();
                                void save();
                            }
                        }} />
                    <div className="flex flex-wrap gap-2">
                        <Button type="button" disabled={disabled || pending}
                            onClick={() => void save()}>
                            {pending ? "저장 중…" : "저장"}
                        </Button>
                        <Button type="button" variant="outline"
                            disabled={pending} onClick={cancel}>
                            취소
                        </Button>
                    </div>
                    {error && <p id={errorId} role="alert"
                        className="m-0 text-sm text-danger">{error}</p>}
                </>
            ) : (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="min-w-0 break-words text-foreground">
                        {value || <span className="text-muted">{placeholder}</span>}
                    </span>
                    <Button ref={editButtonRef} type="button"
                        variant="outline" disabled={disabled}
                        aria-label={`${label} 수정`}
                        onClick={() => {
                            setDraft(value);
                            setError(null);
                            setEditing(true);
                        }}>수정</Button>
                </div>
            )}
        </div>
    );
}

export { Editable };
export type { EditableProps };
