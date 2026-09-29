import type { ComponentProps } from "react";
import { cn } from "./utils";

type StepperStep = {
    id: string;
    label: string;
    description?: string;
};

type StepperProps = Omit<ComponentProps<"ol">, "children"> & {
    "aria-label": string;
    steps: readonly StepperStep[];
    currentIndex: number;
    completedStepIds?: readonly string[];
    errorStepIds?: readonly string[];
    orientation?: "horizontal" | "vertical";
    navigation?: "none" | "completed" | "all";
    onStepChange?: (index: number) => void;
};

function Stepper({
    steps,
    currentIndex,
    completedStepIds,
    errorStepIds = [],
    orientation = "horizontal",
    navigation = "none",
    onStepChange,
    className,
    "aria-label": ariaLabel,
    ...props
}: StepperProps) {
    if (!ariaLabel.trim() || steps.some((step) =>
        !step.id.trim() || !step.label.trim()
    )) {
        throw new Error("Stepper requires a name and named steps.");
    }
    if (!steps.length || !Number.isInteger(currentIndex) ||
        currentIndex < 0 || currentIndex >= steps.length) {
        throw new RangeError("Stepper currentIndex must identify a step.");
    }
    const ids = new Set(steps.map((step) => step.id));
    if (ids.size !== steps.length ||
        completedStepIds?.some((id) => !ids.has(id)) ||
        (completedStepIds &&
            new Set(completedStepIds).size !== completedStepIds.length) ||
        errorStepIds.some((id) => !ids.has(id)) ||
        new Set(errorStepIds).size !== errorStepIds.length ||
        errorStepIds.some((id) => completedStepIds?.includes(id))) {
        throw new Error(
            "Stepper state ids must be unique, known and noncontradictory.",
        );
    }
    if (navigation !== "none" && !onStepChange) {
        throw new Error("Stepper navigation requires onStepChange.");
    }

    const errors = new Set(errorStepIds);
    const completed = completedStepIds && new Set(completedStepIds);
    const horizontal = orientation === "horizontal";

    return (
        <ol
            aria-label={ariaLabel}
            className={cn(
                "m-0 list-none p-0 text-foreground",
                horizontal
                    ? "flex min-w-0 gap-3 overflow-x-auto pb-2"
                    : "grid",
                className,
            )}
            {...props}
        >
            {steps.map((step, index) => {
                const current = index === currentIndex;
                const complete = completed
                    ? completed.has(step.id)
                    : index < currentIndex;
                const error = errors.has(step.id);
                const canNavigate = !!onStepChange && !current && (
                    navigation === "all" ||
                    (navigation === "completed" && (
                        complete || (error && index < currentIndex)
                    ))
                );
                const status = error
                    ? current ? "현재 단계 · 오류" : "오류"
                    : current ? "현재 단계"
                        : complete ? "완료" : "예정";
                const content = (
                    <>
                        <span aria-hidden="true" className={cn(
                            "relative z-10 grid size-6 shrink-0 place-items-center " +
                            "rounded-full border text-xs font-semibold",
                            error && "border-danger bg-surface text-danger",
                            !error && (current || complete) &&
                                "border-accent bg-accent text-accent-foreground",
                            !error && !current && !complete &&
                                "border-border bg-surface text-muted",
                        )}>
                            {error ? "!" : complete ? "✓" : index + 1}
                        </span>
                        <span className="min-w-0">
                            <strong className="block text-sm font-semibold">
                                {step.label}
                            </strong>
                            <span className={cn(
                                "block text-xs",
                                error ? "text-danger" : "text-muted",
                            )}>{status}</span>
                            {step.description && (
                                <span className="mt-1 block text-xs text-muted">
                                    {step.description}
                                </span>
                            )}
                        </span>
                    </>
                );

                return (
                    <li key={step.id} className={cn(
                        "relative min-w-0",
                        horizontal ? "min-w-32 flex-1" : "pb-5 last:pb-0",
                    )}>
                        {index < steps.length - 1 && (
                            <span aria-hidden="true" className={cn(
                                "absolute bg-border",
                                horizontal
                                    ? "left-7 right-[-0.75rem] top-3 h-px"
                                    : "bottom-0 left-[11px] top-7 w-px",
                            )} />
                        )}
                        {canNavigate ? (
                            <button type="button" aria-current={
                                current ? "step" : undefined
                            } onClick={() => onStepChange(index)}
                                className={cn(
                                    "relative z-10 flex w-full rounded-sm text-left " +
                                    "hover:text-accent focus-visible:outline-none " +
                                    "focus-visible:ring-2 focus-visible:ring-focus",
                                    horizontal
                                        ? "flex-col gap-2"
                                        : "items-start gap-3",
                                )}>
                                {content}
                            </button>
                        ) : (
                            <div aria-current={current ? "step" : undefined}
                                className={cn(
                                    "relative z-10 flex min-w-0",
                                    horizontal
                                        ? "flex-col gap-2"
                                        : "items-start gap-3",
                                )}>
                                {content}
                            </div>
                        )}
                    </li>
                );
            })}
        </ol>
    );
}

export { Stepper };
export type { StepperProps, StepperStep };
