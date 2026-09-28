import { useId, useState, type FormEvent, type KeyboardEvent } from "react";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { cn } from "./utils";

type PromptInputProps = {
    onSend: (text: string) => void;
    label?: string;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
};

function PromptInput({
    onSend,
    label = "메시지",
    placeholder = "메시지를 입력하세요",
    disabled,
    className,
}: PromptInputProps) {
    const inputId = useId();
    const [text, setText] = useState("");

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const value = text.trim();
        if (!value || disabled) return;
        onSend(value);
        setText("");
    }

    function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key !== "Enter" || event.shiftKey || event.nativeEvent.isComposing) {
            return;
        }
        event.preventDefault();
        event.currentTarget.form?.requestSubmit();
    }

    return (
        <form
            onSubmit={submit}
            className={cn(
                "flex min-w-0 flex-col gap-2 rounded-sm border border-border " +
                "bg-surface p-[var(--space-3)]",
                className,
            )}
        >
            <label className="sr-only" htmlFor={inputId}>{label}</label>
            <Textarea
                id={inputId}
                value={text}
                onChange={(event) => setText(event.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
                rows={2}
            />
            <div className="flex justify-end">
                <Button type="submit" disabled={disabled || !text.trim()}>
                    보내기
                </Button>
            </div>
        </form>
    );
}

export { PromptInput };
export type { PromptInputProps };
