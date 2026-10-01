import { Check, Copy } from "lucide-react";
import { useId, useState } from "react";
import { Button, type ButtonProps } from "./button";
import { cn } from "./utils";

type CopyButtonProps = Omit<
    ButtonProps, "aria-label" | "children" | "onClick"
> & {
    value: string;
    label: string;
    appearance?: "icon" | "text";
    buttonText?: string;
    successMessage?: string;
    errorMessage?: string;
};

function CopyButton({
    value,
    label,
    appearance = "icon",
    buttonText = "복사",
    successMessage = "복사되었습니다",
    errorMessage = "복사하지 못했습니다",
    variant = "ghost",
    size,
    className,
    "aria-describedby": describedBy,
    ...props
}: CopyButtonProps) {
    const statusId = useId();
    const [feedback, setFeedback] = useState<{
        value: string;
        success: boolean;
    } | null>(null);

    if (typeof value !== "string") {
        throw new TypeError("CopyButton value must be a string.");
    }
    if (typeof label !== "string" || !label.trim()) {
        throw new Error("CopyButton requires a label.");
    }
    if (appearance !== "icon" && appearance !== "text") {
        throw new RangeError("CopyButton appearance is not supported.");
    }

    const currentFeedback = feedback?.value === value ? feedback : null;
    const message = currentFeedback
        ? currentFeedback.success ? successMessage : errorMessage
        : "";
    const description = [describedBy, message ? statusId : undefined]
        .filter(Boolean).join(" ") || undefined;

    async function copyValue() {
        try {
            await navigator.clipboard.writeText(value);
            setFeedback({ value, success: true });
        } catch {
            setFeedback({ value, success: false });
        }
    }

    return (
        <span className="inline-flex items-center gap-2">
            <span id={statusId} role="status"
                className="text-xs text-muted">{message}</span>
            <Button
                {...props}
                variant={variant}
                size={size ?? (appearance === "icon" ? "icon" : "default")}
                className={cn("shrink-0", className)}
                aria-label={label}
                aria-describedby={description}
                onClick={copyValue}
            >
                {appearance === "icon"
                    ? currentFeedback?.success
                        ? <Check aria-hidden="true" size={16} />
                        : <Copy aria-hidden="true" size={16} />
                    : buttonText}
            </Button>
        </span>
    );
}

export { CopyButton };
export type { CopyButtonProps };
