import {
    useEffect, useId, useMemo, useRef, useState, type ReactNode,
} from "react";
import { ActionBar } from "./action-bar";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import { Input } from "./input";
import { NativeSelect } from "./native-select";
import { Pagination } from "./pagination";
import { Table, TableCell, TableHead } from "./table";
import { cn } from "./utils";

type DataTableColumn<Row> = {
    id: string;
    header: string;
    cell: (row: Row) => ReactNode;
    sortValue?: (row: Row) => string | number | null | undefined;
    className?: string;
};

type DataTableFilter<Row> = {
    label: string;
    getValue: (row: Row) => string;
    options: readonly { value: string; label: string }[];
};

type DataTableProps<Row> = {
    caption: string;
    rows: readonly Row[];
    columns: readonly DataTableColumn<Row>[];
    getRowId: (row: Row) => string;
    getRowLabel?: (row: Row) => string;
    getSearchText?: (row: Row) => string;
    searchPlaceholder?: string;
    filter?: DataTableFilter<Row>;
    defaultPageSize?: number;
    pageSizeOptions?: readonly number[];
    selectable?: boolean;
    renderActions?: (
        selectedRows: readonly Row[], clearSelection: () => void,
    ) => ReactNode;
    emptyMessage?: string;
    className?: string;
};

type SortState = { id: string; direction: "ascending" | "descending" };

function compareSortValues(
    first: string | number | null | undefined,
    second: string | number | null | undefined,
) {
    const a = typeof first === "number" && !Number.isFinite(first)
        ? null : first;
    const b = typeof second === "number" && !Number.isFinite(second)
        ? null : second;
    if (a == null) return b == null ? 0 : 1;
    if (b == null) return -1;
    if (typeof a === "number" && typeof b === "number") return a - b;
    const aText = String(a).toLowerCase();
    const bText = String(b).toLowerCase();
    return aText < bText ? -1 : aText > bText ? 1 : 0;
}

function DataTable<Row>({
    caption, rows, columns, getRowId, getRowLabel, getSearchText,
    searchPlaceholder = "검색", filter, defaultPageSize = 10,
    pageSizeOptions = [10, 25, 50], selectable = false,
    renderActions, emptyMessage = "표시할 항목이 없습니다.", className,
}: DataTableProps<Row>) {
    const searchId = useId();
    const filterId = useId();
    const [query, setQuery] = useState("");
    const [filterValue, setFilterValue] = useState("");
    const [sort, setSort] = useState<SortState | null>(null);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(defaultPageSize);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(
        () => new Set(),
    );
    const tableRegion = useRef<HTMLDivElement>(null);
    const activeFilterValue = filterValue && filter?.options.some(
        (option) => option.value === filterValue,
    ) ? filterValue : "";

    useEffect(() => {
        if (filterValue && !activeFilterValue) setFilterValue("");
    }, [filterValue, activeFilterValue]);

    useEffect(() => {
        const availableIds = new Set(rows.map(getRowId));
        setSelectedIds((current) => {
            const next = new Set(
                [...current].filter((id) => availableIds.has(id)),
            );
            return next.size === current.size ? current : next;
        });
    }, [rows, getRowId]);

    const visibleRows = useMemo(() => {
        const needle = query.trim().toLowerCase();
        const matches = rows
            .map((row, index) => ({ row, index }))
            .filter(({ row }) =>
                (!needle || !getSearchText ||
                    getSearchText(row).toLowerCase().includes(needle)) &&
                (!activeFilterValue || !filter ||
                    filter.getValue(row) === activeFilterValue),
            );
        const column = columns.find((item) => item.id === sort?.id);
        if (column?.sortValue) {
            matches.sort((a, b) => {
                const first = column.sortValue?.(a.row);
                const second = column.sortValue?.(b.row);
                const compared = compareSortValues(first, second);
                const missingFirst = first == null ||
                    (typeof first === "number" && !Number.isFinite(first));
                const missingSecond = second == null ||
                    (typeof second === "number" && !Number.isFinite(second));
                if (missingFirst || missingSecond) {
                    return compared || a.index - b.index;
                }
                const directed = sort?.direction === "descending"
                    ? -compared : compared;
                return directed || a.index - b.index;
            });
        }
        return matches.map(({ row }) => row);
    }, [rows, query, activeFilterValue, getSearchText, filter, columns, sort]);

    const validPageSize = Number.isInteger(pageSize) && pageSize > 0
        ? pageSize : 1;
    const pageCount = Math.max(
        1, Math.ceil(visibleRows.length / validPageSize),
    );
    useEffect(() => {
        setPage((current) => Math.min(current, pageCount));
    }, [pageCount]);
    const currentPage = Math.min(page, pageCount);
    const pageRows = visibleRows.slice(
        (currentPage - 1) * validPageSize, currentPage * validPageSize,
    );
    const selectedRows = rows.filter((row) => selectedIds.has(getRowId(row)));
    const selectedOnPage = pageRows.filter(
        (row) => selectedIds.has(getRowId(row)),
    ).length;

    function togglePage(checked: boolean) {
        setSelectedIds((current) => {
            const next = new Set(current);
            pageRows.forEach((row) => {
                if (checked) next.add(getRowId(row));
                else next.delete(getRowId(row));
            });
            return next;
        });
    }

    function resetView() {
        setQuery("");
        setFilterValue("");
        setSort(null);
        setPage(1);
    }

    function clearSelection() {
        setSelectedIds(new Set());
        tableRegion.current?.focus();
    }

    return (
        <div className={cn("grid min-w-0 gap-3", className)}>
            <div className="flex flex-wrap items-end gap-2">
                {getSearchText && (
                    <div className="min-w-40 flex-1">
                        <label className="sr-only" htmlFor={searchId}>
                            {caption} 검색
                        </label>
                        <Input
                            id={searchId}
                            type="search"
                            placeholder={searchPlaceholder}
                            value={query}
                            onChange={(event) => {
                                setQuery(event.target.value);
                                setPage(1);
                            }}
                        />
                    </div>
                )}
                {filter && (
                    <div className="min-w-32">
                        <label className="sr-only" htmlFor={filterId}>
                            {filter.label}
                        </label>
                        <NativeSelect
                            id={filterId}
                            value={activeFilterValue}
                            onChange={(event) => {
                                setFilterValue(event.target.value);
                                setPage(1);
                            }}
                        >
                            <option value="">{filter.label}: 전체</option>
                            {filter.options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </NativeSelect>
                    </div>
                )}
                {(getSearchText || filter || sort) && (
                    <Button variant="ghost" onClick={resetView}>
                        보기 초기화
                    </Button>
                )}
            </div>
            {selectable && selectedRows.length > 0 && (
                <ActionBar
                    aria-label="선택한 행 작업"
                    selectedCount={selectedRows.length}
                    onClear={clearSelection}
                >
                    {renderActions?.(selectedRows, clearSelection)}
                </ActionBar>
            )}
            <div role="region" aria-label={`${caption} 가로 스크롤`}
                ref={tableRegion}
                tabIndex={0}
                className={
                    "min-w-0 overflow-x-auto rounded-sm " +
                    "focus-visible:outline-2 focus-visible:outline-focus"
                }>
                <Table className="min-w-max">
                    <caption className="sr-only">{caption}</caption>
                    <thead>
                        <tr>
                            {selectable && (
                                <TableHead scope="col" className="w-10">
                                    <Checkbox
                                        aria-label="현재 페이지의 행 모두 선택"
                                        disabled={pageRows.length === 0}
                                        checked={selectedOnPage === 0
                                            ? false
                                            : selectedOnPage === pageRows.length
                                                ? true : "indeterminate"}
                                        onCheckedChange={(checked) =>
                                            togglePage(checked === true)}
                                    />
                                </TableHead>
                            )}
                            {columns.map((column) => (
                                <TableHead
                                    key={column.id}
                                    scope="col"
                                    aria-sort={sort?.id === column.id
                                        ? sort.direction : undefined}
                                    className={column.className}
                                >
                                    {column.sortValue ? (
                                        <button
                                            type="button"
                                            className={
                                                "inline-flex items-center " +
                                                "gap-1 text-left text-foreground"
                                            }
                                            onClick={() => {
                                                setSort((current) => {
                                                    if (current?.id !== column.id) {
                                                        return { id: column.id,
                                                            direction: "ascending" };
                                                    }
                                                    if (current.direction === "ascending") {
                                                        return { id: column.id,
                                                            direction: "descending" };
                                                    }
                                                    return null;
                                                });
                                                setPage(1);
                                            }}
                                        >
                                            {column.header}
                                            <span aria-hidden="true">
                                                {sort?.id !== column.id ? "↕"
                                                    : sort.direction === "ascending"
                                                        ? "↑" : "↓"}
                                            </span>
                                        </button>
                                    ) : column.header}
                                </TableHead>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {pageRows.length === 0 ? (
                            <tr>
                                <TableCell
                                    colSpan={columns.length + (selectable ? 1 : 0)}
                                    className="py-8 text-center text-muted"
                                >
                                    {emptyMessage}
                                </TableCell>
                            </tr>
                        ) : pageRows.map((row) => {
                            const id = getRowId(row);
                            return (
                                <tr key={id}>
                                    {selectable && (
                                        <TableCell>
                                            <Checkbox
                                                aria-label={`${getRowLabel?.(row) ?? id} 선택`}
                                                checked={selectedIds.has(id)}
                                                onCheckedChange={(checked) => {
                                                    setSelectedIds((current) => {
                                                        const next = new Set(current);
                                                        if (checked === true) next.add(id);
                                                        else next.delete(id);
                                                        return next;
                                                    });
                                                }}
                                            />
                                        </TableCell>
                                    )}
                                    {columns.map((column) => (
                                        <TableCell
                                            key={column.id}
                                            className={column.className}
                                        >
                                            {column.cell(row)}
                                        </TableCell>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>
            <Pagination
                page={currentPage}
                pageSize={validPageSize}
                totalItems={visibleRows.length}
                onPageChange={setPage}
                pageSizeOptions={pageSizeOptions}
                onPageSizeChange={(size) => {
                    setPageSize(size);
                    setPage(1);
                }}
            />
        </div>
    );
}

export { DataTable };
export type { DataTableProps, DataTableColumn, DataTableFilter };
