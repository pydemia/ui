import { useId, type ComponentProps } from "react";
import { Button } from "./button";
import { cn } from "./utils";

type AppliedFilter = {
    id: string;
    label: string;
    value: string;
};

type FilterBarProps = Omit<
    ComponentProps<"form">,
    "aria-label" | "aria-labelledby" | "onReset" | "onSubmit"
> & {
    label: string;
    appliedFilters?: readonly AppliedFilter[];
    dirty?: boolean;
    pending?: boolean;
    variant?: "bar" | "panel";
    onApply: (values: FormData) => void;
    onClear: () => void;
};

function FilterBar({
    label,
    appliedFilters = [],
    dirty,
    pending = false,
    variant = "bar",
    onApply,
    onClear,
    className,
    children,
    ...props
}: FilterBarProps) {
    const labelId = useId();
    const ids = new Set<string>();
    if (!label.trim()) throw new Error("FilterBar requires a label.");
    for (const filter of appliedFilters) {
        if (!filter.id.trim() || !filter.label.trim() ||
            !filter.value.trim() || ids.has(filter.id)) {
            throw new Error("FilterBar applied filters must be named and unique.");
        }
        ids.add(filter.id);
    }

    const status = pending ? "필터 적용 중" : dirty
        ? "변경 사항 미적용" : appliedFilters.length
            ? `${appliedFilters.length}개 필터 적용` : "적용된 필터 없음";

    return (
        <form aria-labelledby={labelId}
            data-variant={variant}
            onSubmit={(event) => {
                event.preventDefault();
                onApply(new FormData(event.currentTarget));
            }}
            className={cn(
                "min-w-0 text-sm text-foreground",
                variant === "panel" &&
                    "rounded-sm border border-border bg-surface " +
                    "p-[var(--space-4)]",
                className,
            )} {...props}>
            <div className="flex flex-wrap items-end gap-[var(--space-3)]">
                <div className="min-w-0 flex-1">
                    <p id={labelId} className={
                        "mb-[var(--space-2)] mt-0 font-semibold"
                    }>{label}</p>
                    <div className={
                        "flex min-w-0 flex-wrap items-end gap-[var(--space-3)] " +
                        "[&>*]:min-w-40 [&>*]:flex-1"
                    }>{children}</div>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                    <Button type="submit" disabled={pending || dirty === false}>
                        {pending ? "적용 중" : "필터 적용"}
                    </Button>
                    <Button type="button" variant="outline" disabled={pending ||
                        (dirty === false && appliedFilters.length === 0)}
                        onClick={(event) => {
                            onClear();
                            event.currentTarget.form?.reset();
                        }}>
                        초기화
                    </Button>
                </div>
            </div>
            <div className="mt-[var(--space-3)] flex flex-wrap items-center gap-2">
                <span role="status" className="text-xs text-muted">
                    {status}
                </span>
                {appliedFilters.length > 0 && (
                    <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                        {appliedFilters.map((filter) => (
                            <li key={filter.id} className={
                                "rounded-full border border-border " +
                                "bg-surface-subtle px-[var(--space-2)] " +
                                "py-1 text-xs"
                            }>
                                {filter.label}: {filter.value}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </form>
    );
}

export { FilterBar };
export type { AppliedFilter, FilterBarProps };
