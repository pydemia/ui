import {
    useEffect, useId, useRef, useState, type ComponentProps,
    type FormEvent, type ReactNode,
} from "react";
import { Button } from "./button";
import { Stepper } from "./stepper";
import { cn } from "./utils";

type FormWizardStep = {
    id: string;
    label: string;
    description?: string;
    content: ReactNode;
};

type FormWizardProps = Omit<
    ComponentProps<"form">, "children" | "onSubmit"
> & {
    label: string;
    steps: readonly FormWizardStep[];
    currentIndex: number;
    onStepChange: (index: number) => void;
    onFinish: () => void;
    validateStep?: (index: number) => boolean | Promise<boolean>;
    orientation?: "horizontal" | "vertical";
    appearance?: "panel" | "plain";
    disabled?: boolean;
    submitting?: boolean;
    error?: string;
    backLabel?: string;
    nextLabel?: string;
    finishLabel?: string;
};

function FormWizard({
    label,
    steps,
    currentIndex,
    onStepChange,
    onFinish,
    validateStep,
    orientation = "vertical",
    appearance = "panel",
    submitting = false,
    disabled = false,
    error,
    backLabel = "이전",
    nextLabel = "다음",
    finishLabel = "완료",
    className,
    ...props
}: FormWizardProps) {
    const headingId = useId();
    const errorId = useId();
    const heading = useRef<HTMLHeadingElement>(null);
    const previousIndex = useRef(currentIndex);
    const attempt = useRef(0);
    const pendingNow = useRef(false);
    const [pending, setPending] = useState(false);
    const [validationMessage, setValidationMessage] = useState<string | null>(
        null,
    );

    if (!label.trim() || !steps.length ||
        !Number.isInteger(currentIndex) || currentIndex < 0 ||
        currentIndex >= steps.length) {
        throw new Error("FormWizard needs a name and a current step.");
    }
    if (typeof onStepChange !== "function" ||
        typeof onFinish !== "function" ||
        (validateStep !== undefined && typeof validateStep !== "function")) {
        throw new TypeError("FormWizard needs step and finish callbacks.");
    }

    useEffect(() => {
        if (previousIndex.current === currentIndex) return;
        previousIndex.current = currentIndex;
        attempt.current += 1;
        pendingNow.current = false;
        setPending(false);
        setValidationMessage(null);
        heading.current?.focus({ preventScroll: true });
    }, [currentIndex]);

    useEffect(() => () => {
        attempt.current += 1;
    }, []);

    const busy = disabled || submitting || pending;
    const lastStep = currentIndex === steps.length - 1;
    const shownError = error || validationMessage;

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (busy || pendingNow.current) return;
        if (lastStep) {
            onFinish();
            return;
        }
        if (!validateStep) {
            onStepChange(currentIndex + 1);
            return;
        }

        const currentAttempt = ++attempt.current;
        pendingNow.current = true;
        setPending(true);
        setValidationMessage(null);
        try {
            const valid = await validateStep(currentIndex);
            if (attempt.current !== currentAttempt) return;
            if (valid === true) onStepChange(currentIndex + 1);
            else setValidationMessage("입력 내용을 확인하세요.");
        } catch (failure) {
            if (attempt.current !== currentAttempt) return;
            setValidationMessage(failure instanceof Error && failure.message
                ? failure.message : "단계를 확인하지 못했습니다.");
        } finally {
            if (attempt.current === currentAttempt) {
                pendingNow.current = false;
                setPending(false);
            }
        }
    }

    return (
        <form {...props} aria-label={label} onSubmit={handleSubmit}
            className={cn(
                "grid min-w-0 gap-4 text-foreground",
                appearance === "panel" &&
                    "rounded-sm border border-border bg-surface " +
                    "p-[var(--space-4)]",
                className,
            )}>
            <Stepper aria-label={`${label} 단계`} steps={steps}
                currentIndex={currentIndex} orientation={orientation} />
            <div className="grid min-w-0 gap-2">
                <h2 ref={heading} id={headingId} tabIndex={-1}
                    className="m-0 text-lg font-semibold">
                    {steps[currentIndex].label}
                </h2>
                {steps[currentIndex].description && (
                    <p className="m-0 text-sm text-muted">
                        {steps[currentIndex].description}
                    </p>
                )}
                <fieldset disabled={busy}
                    className="m-0 min-w-0 border-0 p-0">
                    <div aria-labelledby={headingId}
                        className="grid min-w-0 gap-3">
                        {steps[currentIndex].content}
                    </div>
                </fieldset>
            </div>
            {shownError && <p id={errorId} role="alert"
                className="m-0 text-sm text-danger">{shownError}</p>}
            <div className="flex flex-wrap justify-end gap-2">
                <Button type="button" variant="outline"
                    disabled={busy || currentIndex === 0}
                    onClick={() => onStepChange(currentIndex - 1)}>
                    {backLabel}
                </Button>
                <Button type="submit" disabled={busy}
                    aria-describedby={shownError ? errorId : undefined}>
                    {pending ? "확인 중…" : lastStep
                        ? finishLabel : nextLabel}
                </Button>
            </div>
        </form>
    );
}

export { FormWizard };
export type { FormWizardProps, FormWizardStep };
