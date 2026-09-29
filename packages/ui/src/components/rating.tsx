import { useId, useState } from "react";
import { cn } from "./utils";

type RatingProps = {
    label: string;
    name?: string;
    id?: string;
    className?: string;
    max?: number;
    value?: number;
    defaultValue?: number;
    onValueChange?: (value: number) => void;
    variant?: "stars" | "segments";
    disabled?: boolean;
    required?: boolean;
    readOnly?: boolean;
    "aria-describedby"?: string;
};

function RatingMark({
    score, selected, variant,
}: {
    score: number;
    selected: boolean;
    variant: "stars" | "segments";
}) {
    if (variant === "segments") {
        return <span aria-hidden="true" className={cn(
            "flex size-8 items-center justify-center rounded-sm " +
            "border border-border text-sm",
            selected
                ? "border-accent bg-accent text-accent-foreground"
                : "bg-surface text-muted",
        )}>{score}</span>;
    }

    return <svg aria-hidden="true" viewBox="0 0 24 24"
        className={cn("size-7", selected ? "text-accent" : "text-muted")}
        fill={selected ? "currentColor" : "none"}
        stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
        <path d="m12 2 3.1 6.3 7 1-5.1 5 .9 7-5.9-3.3-5.9 3.3.9-7-5.1-5 7-1z" />
    </svg>;
}

function Rating({
    label,
    name,
    id,
    className,
    max = 5,
    value,
    defaultValue = 0,
    onValueChange,
    variant = "stars",
    disabled = false,
    required = false,
    readOnly = false,
    "aria-describedby": describedBy,
}: RatingProps) {
    const generatedId = useId();
    const groupId = id ?? generatedId;
    const radioName = name ?? `${groupId}-rating`;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const rating = value === undefined ? internalValue : value;

    if (!label.trim()) throw new Error("Rating requires a label.");
    if (!Number.isInteger(max) || max < 1 || max > 10) {
        throw new RangeError("Rating max must be an integer from 1 to 10.");
    }
    for (const candidate of [rating, defaultValue]) {
        if (!Number.isInteger(candidate) || candidate < 0 ||
            candidate > max) {
            throw new RangeError("Rating value must be an integer from 0 to max.");
        }
    }
    if (value !== undefined && !onValueChange && !readOnly && !disabled) {
        throw new Error("Controlled Rating requires onValueChange.");
    }
    if (readOnly && (name !== undefined || required)) {
        throw new Error("Read-only Rating does not submit a form value.");
    }

    if (readOnly) {
        return <div id={groupId} className={cn("grid gap-2", className)}>
            <span className="text-sm font-medium">{label}</span>
            <div role="img" aria-label={`${label}: ${rating}/${max}점`}
                aria-describedby={describedBy}
                className="flex items-center gap-1">
                {Array.from({ length: max }, (_, index) => {
                    const score = index + 1;
                    return <RatingMark key={score} score={score}
                        selected={score <= rating} variant={variant} />;
                })}
                <span aria-hidden="true" className="ml-2 text-sm text-muted">
                    {rating}/{max}점
                </span>
            </div>
        </div>;
    }

    return <fieldset id={groupId} disabled={disabled}
        aria-describedby={describedBy}
        className={cn("min-w-0 border-0 p-0", className)}>
        <legend className="mb-2 text-sm font-medium">
            {label}{required && <span aria-hidden="true"> *</span>}
        </legend>
        <div className="flex flex-wrap items-center gap-1">
            {Array.from({ length: max }, (_, index) => {
                const score = index + 1;
                const inputId = `${groupId}-${score}`;
                return <span key={score} className="relative">
                    <input id={inputId} type="radio" name={radioName}
                        value={score} checked={rating === score}
                        required={required} disabled={disabled}
                        className="peer sr-only"
                        onChange={() => {
                            if (value === undefined) setInternalValue(score);
                            onValueChange?.(score);
                        }} />
                    <label htmlFor={inputId} className={cn(
                        "flex size-9 cursor-pointer items-center " +
                        "justify-center rounded-sm hover:bg-surface-subtle " +
                        "peer-focus-visible:outline-2 " +
                        "peer-focus-visible:outline-focus " +
                        "peer-focus-visible:outline-offset-2",
                        disabled && "cursor-not-allowed opacity-50",
                    )}>
                        <span className="sr-only">{score}점</span>
                        <RatingMark score={score}
                            selected={score <= rating} variant={variant} />
                    </label>
                </span>;
            })}
            <span aria-hidden="true" className="ml-2 text-sm text-muted">
                {rating}/{max}점
            </span>
        </div>
    </fieldset>;
}

export { Rating };
export type { RatingProps };
