import { useId, useState, type ComponentProps } from "react";
import { Button } from "./button";
import { cn } from "./utils";

type CodeBlockProps = Omit<
    ComponentProps<"figure">, "children" | "aria-labelledby"
> & {
    label: string;
    code: string;
    language?: string;
    wrap?: boolean;
    copyable?: boolean;
};

function CodeBlock({
    label,
    code,
    language,
    wrap = false,
    copyable = true,
    className,
    ...props
}: CodeBlockProps) {
    const labelId = useId();
    const [feedback, setFeedback] = useState<{
        code: string;
        message: string;
    } | null>(null);
    const message = feedback?.code === code ? feedback.message : "";

    if (typeof label !== "string" || !label.trim()) {
        throw new Error("CodeBlock requires a label.");
    }
    if (typeof code !== "string") {
        throw new TypeError("CodeBlock code must be a string.");
    }
    if (language !== undefined && (
        typeof language !== "string" || !language.trim()
    )) {
        throw new Error("CodeBlock language must not be empty.");
    }

    async function copyCode() {
        try {
            await navigator.clipboard.writeText(code);
            setFeedback({ code, message: "코드를 복사했습니다" });
        } catch {
            setFeedback({ code, message: "코드를 복사하지 못했습니다" });
        }
    }

    return (
        <figure {...props} aria-labelledby={labelId}
            className={cn(
                "m-0 min-w-0 overflow-hidden rounded-sm border " +
                "border-border bg-surface",
                className,
            )}>
            <figcaption id={labelId}
                className={
                    "flex min-w-0 items-center gap-2 border-b " +
                    "border-border bg-surface-subtle px-[var(--space-3)] " +
                    "py-[var(--space-1)] text-sm text-foreground"
                }>
                <span className="min-w-0 flex-1 truncate font-medium">
                    {label}
                </span>
                {language && (
                    <span className="text-xs text-muted">{language}</span>
                )}
                {copyable && (
                    <>
                        <span role="status" className="text-xs text-muted">
                            {message}
                        </span>
                        <Button variant="ghost" disabled={!code}
                            onClick={copyCode} aria-label={`${label} 복사`}>
                            복사
                        </Button>
                    </>
                )}
            </figcaption>
            <pre tabIndex={0} aria-label={`${label} 코드`}
                className={cn(
                    "m-0 max-w-full overflow-auto p-[var(--space-4)] " +
                    "text-xs leading-6 text-foreground",
                    wrap ? "whitespace-pre-wrap break-words" :
                        "whitespace-pre",
                )}>
                <code>{code}</code>
            </pre>
        </figure>
    );
}

export { CodeBlock };
export type { CodeBlockProps };
