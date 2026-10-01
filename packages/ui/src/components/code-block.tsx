import { useId, type ComponentProps } from "react";
import { CopyButton } from "./copy-button";
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
                    <CopyButton value={code} label={`${label} 복사`}
                        appearance="text" disabled={!code}
                        successMessage="코드를 복사했습니다"
                        errorMessage="코드를 복사하지 못했습니다" />
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
