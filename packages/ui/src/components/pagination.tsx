import type { ComponentProps } from "react";
import { Button } from "./button";
import { NativeSelect } from "./native-select";
import { cn } from "./utils";

type PaginationProps = Omit<ComponentProps<"nav">, "onChange"> & {
    page: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    pageSizeOptions?: readonly number[];
    onPageSizeChange?: (pageSize: number) => void;
};

function Pagination({
    page, pageSize, totalItems, onPageChange, pageSizeOptions,
    onPageSizeChange, className, "aria-label": label = "페이지 이동",
    ...props
}: PaginationProps) {
    const size = Number.isFinite(pageSize) && pageSize > 0
        ? Math.trunc(pageSize) : 1;
    const total = Number.isFinite(totalItems) && totalItems > 0
        ? Math.trunc(totalItems) : 0;
    const pageCount = Math.max(1, Math.ceil(total / size));
    const currentPage = Number.isFinite(page)
        ? Math.min(pageCount, Math.max(1, Math.trunc(page))) : 1;
    const first = total === 0 ? 0 : (currentPage - 1) * size + 1;
    const last = Math.min(total, currentPage * size);
    const sizes = [...new Set([size, ...(pageSizeOptions ?? [])])]
        .filter((option) => Number.isInteger(option) && option > 0)
        .sort((a, b) => a - b);

    return (
        <nav
            aria-label={label}
            className={cn(
                "flex flex-wrap items-center justify-between gap-3 text-sm",
                className,
            )}
            {...props}
        >
            <span className="text-muted">
                {first}–{last} / {total}건
            </span>
            <div className="flex flex-wrap items-center gap-2">
                {onPageSizeChange && sizes.length > 1 && (
                    <label className="flex items-center gap-2 text-muted">
                        페이지당
                        <span className="w-20">
                            <NativeSelect
                                aria-label="페이지당 항목 수"
                                value={size}
                                onChange={(event) => {
                                    onPageSizeChange(Number(event.target.value));
                                    onPageChange(1);
                                }}
                            >
                                {sizes.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </NativeSelect>
                        </span>
                    </label>
                )}
                <Button
                    variant="outline"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    이전
                </Button>
                <span aria-live="polite" className="min-w-12 text-center">
                    {currentPage} / {pageCount}
                </span>
                <Button
                    variant="outline"
                    disabled={currentPage === pageCount}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    다음
                </Button>
            </div>
        </nav>
    );
}

export { Pagination };
export type { PaginationProps };
