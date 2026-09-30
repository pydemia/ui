import { ThumbsDown, ThumbsUp } from "lucide-react";
import { useId, type ComponentProps } from "react";
import { Button } from "./button";
import { cn } from "./utils";

type ResponseFeedbackValue = "up" | "down" | null;
type ResponseFeedbackCounts = { up: number; down: number };
type ResponseFeedbackProps = Omit<ComponentProps<"div">, "children"> & {
    label: string;
    value: ResponseFeedbackValue;
    onValueChange: (value: ResponseFeedbackValue) => void;
    counts?: ResponseFeedbackCounts;
    disabled?: boolean;
    pending?: boolean;
};

function ResponseFeedback({
    label, value, onValueChange, counts, disabled = false,
    pending = false, className, ...props
}: ResponseFeedbackProps) {
    const countId = useId();
    if (!label.trim()) throw new Error("ResponseFeedback requires a label.");
    if (value !== null && value !== "up" && value !== "down") {
        throw new RangeError("ResponseFeedback value must be up, down or null.");
    }
    if (counts && [counts.up, counts.down].some(
        (count) => !Number.isSafeInteger(count) || count < 0,
    )) {
        throw new RangeError("ResponseFeedback counts must be nonnegative integers.");
    }

    return (
        <div role="group" aria-label={label} aria-busy={pending}
            className={cn("inline-flex flex-wrap items-center gap-2", className)}
            {...props}>
            <Button variant="outline" type="button" aria-pressed={value === "up"}
                aria-label="도움이 됨" disabled={disabled || pending}
                aria-describedby={counts ? `${countId}-up` : undefined}
                className={cn("gap-2", value === "up" &&
                    "border-accent bg-accent text-accent-foreground")}
                onClick={() => onValueChange(value === "up" ? null : "up")}>
                <ThumbsUp aria-hidden="true" className="size-4" />
                <span>좋아요</span>
                {counts && <span id={`${countId}-up`}>
                    {counts.up}명 선택
                </span>}
            </Button>
            <Button variant="outline" type="button"
                aria-pressed={value === "down"}
                aria-label="도움이 되지 않음" disabled={disabled || pending}
                aria-describedby={counts ? `${countId}-down` : undefined}
                className={cn("gap-2", value === "down" &&
                    "border-accent bg-accent text-accent-foreground")}
                onClick={() => onValueChange(value === "down" ? null : "down")}>
                <ThumbsDown aria-hidden="true" className="size-4" />
                <span>싫어요</span>
                {counts && <span id={`${countId}-down`}>
                    {counts.down}명 선택
                </span>}
            </Button>
        </div>
    );
}

export { ResponseFeedback };
export type { ResponseFeedbackValue, ResponseFeedbackCounts,
    ResponseFeedbackProps };
