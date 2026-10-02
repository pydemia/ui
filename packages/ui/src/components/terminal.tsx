import { useId, useState, type FormEvent, type KeyboardEvent } from "react";
import { Button } from "./button";
import { cn } from "./utils";

type TerminalLine = {
    id: string;
    kind: "command" | "output" | "error" | "notice";
    text: string;
};

type TerminalProps = {
    label: string;
    lines: readonly TerminalLine[];
    onCommand: (command: string) => void;
    prompt?: string;
    placeholder?: string;
    emptyMessage?: string;
    pending?: boolean;
    disabled?: boolean;
    live?: "off" | "polite";
    variant?: "panel" | "flat";
    className?: string;
};

function Terminal({
    label, lines, onCommand, prompt = "›", placeholder = "명령 입력",
    emptyMessage = "실행 기록이 없습니다.", pending = false,
    disabled = false, live = "off", variant = "panel", className,
}: TerminalProps) {
    if (typeof label !== "string" || !label.trim()) {
        throw new Error("Terminal requires a label.");
    }
    if (!Array.isArray(lines)) {
        throw new TypeError("Terminal lines must be an array.");
    }
    if (typeof onCommand !== "function") {
        throw new TypeError("Terminal requires onCommand.");
    }
    if (typeof prompt !== "string" || !prompt.trim()) {
        throw new Error("Terminal prompt must not be empty.");
    }
    if (variant !== "panel" && variant !== "flat") {
        throw new RangeError("Terminal variant is not supported.");
    }
    if (live !== "off" && live !== "polite") {
        throw new RangeError("Terminal live setting is not supported.");
    }

    const ids = new Set<string>();
    for (const line of lines) {
        if (!line || typeof line.id !== "string" || !line.id.trim() ||
            ids.has(line.id) || typeof line.text !== "string" ||
            !["command", "output", "error", "notice"].includes(line.kind)) {
            throw new Error("Terminal lines need unique IDs, text and a kind.");
        }
        ids.add(line.id);
    }

    const inputId = useId();
    const [draft, setDraft] = useState("");
    const [historyIndex, setHistoryIndex] = useState<number | null>(null);
    const [savedDraft, setSavedDraft] = useState("");
    const history = lines.filter((line) => line.kind === "command")
        .map((line) => line.text);

    function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (disabled || pending || !draft.trim()) return;
        onCommand(draft);
        setDraft("");
        setHistoryIndex(null);
        setSavedDraft("");
    }

    function navigateHistory(event: KeyboardEvent<HTMLInputElement>) {
        if (event.nativeEvent.isComposing) {
            if (event.key === "Enter") event.preventDefault();
            return;
        }
        if (event.key === "ArrowUp" && history.length > 0) {
            event.preventDefault();
            if (historyIndex === null) setSavedDraft(draft);
            const next = historyIndex === null ? history.length - 1 :
                Math.max(0, Math.min(historyIndex - 1, history.length - 1));
            setHistoryIndex(next);
            setDraft(history[next]);
        } else if (event.key === "ArrowDown" && historyIndex !== null) {
            event.preventDefault();
            const next = historyIndex + 1;
            if (next >= history.length) {
                setHistoryIndex(null);
                setDraft(savedDraft);
            } else {
                setHistoryIndex(next);
                setDraft(history[next]);
            }
        }
    }

    return (
        <section aria-label={label} data-variant={variant}
            className={cn(
                "grid min-w-0 overflow-hidden text-foreground",
                variant === "panel" &&
                    "rounded-sm border border-border bg-surface",
                variant === "flat" && "border-b border-border bg-transparent",
                className,
            )}>
            <div className={cn(
                "flex items-center justify-between gap-3 px-3 py-2",
                variant === "panel" &&
                    "border-b border-border bg-surface-subtle",
            )}>
                <span className="text-sm font-medium">{label}</span>
                {pending && <span role="status" className="text-xs text-muted">
                    실행 중
                </span>}
            </div>
            <div role="log" aria-label={`${label} 출력`} aria-live={live}
                aria-busy={pending} aria-relevant="additions text"
                className={
                    "max-h-80 min-h-40 min-w-0 overflow-auto px-3 py-2 " +
                    "font-mono text-xs"
                }>
                {lines.length === 0 ? (
                    <p className="m-0 text-muted">{emptyMessage}</p>
                ) : (
                    <ol className="m-0 grid list-none gap-1 p-0">
                        {lines.map((line) => (
                            <li key={line.id} data-kind={line.kind}
                                className={cn(
                                    "min-w-0 whitespace-pre-wrap break-words",
                                    line.kind === "error" && "text-danger",
                                    line.kind === "notice" && "text-muted",
                                )}>
                                {line.kind === "command" && (
                                    <span aria-hidden="true" className="mr-2 text-accent">
                                        {prompt}
                                    </span>
                                )}
                                {line.kind === "error" && "오류: "}
                                {line.text}
                            </li>
                        ))}
                    </ol>
                )}
            </div>
            <form onSubmit={submit}
                className="flex min-w-0 items-center gap-2 border-t border-border px-3 py-2">
                <label htmlFor={inputId} className="sr-only">
                    {label} 입력
                </label>
                <span aria-hidden="true" className="font-mono text-accent">
                    {prompt}
                </span>
                <input id={inputId} type="text" value={draft}
                    autoComplete="off" spellCheck={false} disabled={disabled}
                    placeholder={placeholder} onKeyDown={navigateHistory}
                    onChange={(event) => {
                        setDraft(event.currentTarget.value);
                        setHistoryIndex(null);
                        setSavedDraft("");
                    }}
                    className={
                        "min-w-0 flex-1 bg-transparent font-mono text-sm " +
                        "text-foreground outline-none placeholder:text-muted " +
                        "focus-visible:ring-2 focus-visible:ring-focus"
                    } />
                <Button type="submit"
                    disabled={disabled || pending || !draft.trim()}>
                    실행
                </Button>
            </form>
        </section>
    );
}

export { Terminal };
export type { TerminalLine, TerminalProps };
