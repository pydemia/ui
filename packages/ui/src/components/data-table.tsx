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
    sortable?: boolean;
    className?: string;
};

type DataTableFilter<Row> = {
    label: string;
    getValue: (row: Row) => string;
    options: readonly { value: string; label: string }[];
};

type DataTableRemoteFilter = Pick<DataTableFilter<unknown>,
    "label" | "options">;

type DataTableBaseProps<Row> = {
    caption: string;
    rows: readonly Row[];
    columns: readonly DataTableColumn<Row>[];
    getRowId: (row: Row) => string;
    getRowLabel?: (row: Row) => string;
    getSearchText?: (row: Row) => string;
    searchPlaceholder?: string;
    defaultPageSize?: number;
    pageSizeOptions?: readonly number[];
    selectable?: boolean;
    renderActions?: (
        selectedRows: readonly Row[], clearSelection: () => void,
    ) => ReactNode;
    emptyMessage?: string;
    className?: string;
};

type DataTableProps<Row> = DataTableBaseProps<Row> & (
    { filter?: DataTableFilter<Row>; remote?: undefined } |
    { filter?: DataTableRemoteFilter; remote: DataTableRemote }
);

type DataTableSort = { id: string; direction: "ascending" | "descending" };

type DataTableView = {
    query: string;
    filterValue: string;
    sort: DataTableSort | null;
    page: number;
    pageSize: number;
};

type DataTableRemote = {
    view: DataTableView;
    totalItems: number;
    onViewChange: (view: DataTableView) => void;
    searchable?: boolean;
    status?: "ready" | "loading" | "error";
    errorMessage?: string;
    onRetry?: () => void;
};

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
    renderActions, emptyMessage = "표시할 항목이 없습니다.", remote,
    className,
}: DataTableProps<Row>) {
    const searchId = useId();
    const filterId = useId();
    const [localView, setLocalView] = useState<DataTableView>(() => ({
        query: "", filterValue: "", sort: null,
        page: 1, pageSize: defaultPageSize,
    }));
    const remoteView = useRef(remote?.view);
    remoteView.current = remote?.view;
    const isRemote = remote !== undefined;
    const { query, filterValue, sort, page, pageSize } =
        remote?.view ?? localView;
    if (remote && (!Number.isSafeInteger(remote.totalItems) ||
        remote.totalItems < 0 || !Number.isSafeInteger(page) || page < 1 ||
        !Number.isSafeInteger(pageSize) || pageSize < 1)) {
        throw new Error("DataTable remote view requires valid page, " +
            "pageSize, and totalItems values");
    }
    const [selectedIds, setSelectedIds] = useState<Set<string>>(
        () => new Set(),
    );
    const tableRegion = useRef<HTMLDivElement>(null);
    const activeFilterValue = filterValue && filter?.options.some(
        (option) => option.value === filterValue,
    ) ? filterValue : "";

    useEffect(() => {
        if (!isRemote && filterValue && !activeFilterValue) {
            setLocalView((current) => ({ ...current, filterValue: "" }));
        }
    }, [isRemote, filterValue, activeFilterValue]);

    const remoteViewKey = remote ? JSON.stringify([
        query, filterValue, sort?.id, sort?.direction, page, pageSize,
    ]) : null;
    useEffect(() => {
        if (remoteViewKey !== null ||
            remote?.status === "loading" || remote?.status === "error") {
            setSelectedIds((current) => current.size > 0
                ? new Set() : current);
        }
    }, [remoteViewKey, remote?.status]);

    function changeView(patch: Partial<DataTableView>) {
        if (remote) {
            const next = { ...(remoteView.current ?? remote.view), ...patch };
            remoteView.current = next;
            remote.onViewChange(next);
        } else {
            setLocalView((current) => ({ ...current, ...patch }));
        }
    }

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
        if (isRemote) return rows;
        const needle = query.trim().toLowerCase();
        const matches = rows
            .map((row, index) => ({ row, index }))
            .filter(({ row }) =>
                (!needle || !getSearchText ||
                    getSearchText(row).toLowerCase().includes(needle)) &&
                (!activeFilterValue || !filter ||
                    ("getValue" in filter &&
                        filter.getValue(row) === activeFilterValue)),
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
    }, [rows, query, activeFilterValue, getSearchText, filter, columns,
        sort, isRemote]);

    const validPageSize = Number.isInteger(pageSize) && pageSize > 0
        ? pageSize : 1;
    const pageCount = Math.max(
        1, Math.ceil((remote?.totalItems ?? visibleRows.length) /
            validPageSize),
    );
    useEffect(() => {
        if (!isRemote) {
            setLocalView((current) => current.page > pageCount
                ? { ...current, page: pageCount } : current);
        }
    }, [pageCount, isRemote]);
    const currentPage = Math.min(page, pageCount);
    const pageRows = remote
        ? remote.status === "loading" || remote.status === "error"
            ? [] : visibleRows
        : visibleRows.slice(
            (currentPage - 1) * validPageSize, currentPage * validPageSize,
        );
    const selectedRows = (remote ? pageRows : rows).filter(
        (row) => selectedIds.has(getRowId(row)),
    );
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
        changeView({ query: "", filterValue: "", sort: null, page: 1 });
    }

    function clearSelection() {
        setSelectedIds(new Set());
        tableRegion.current?.focus();
    }

    return (
        <div className={cn("grid min-w-0 gap-3", className)}>
            <div className="flex flex-wrap items-end gap-2">
                {(getSearchText || remote?.searchable) && (
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
                                changeView({ query: event.target.value,
                                    page: 1 });
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
                                changeView({ filterValue: event.target.value,
                                    page: 1 });
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
                {(getSearchText || remote?.searchable || filter || sort) && (
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
                aria-busy={remote?.status === "loading" || undefined}
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
                                    {(column.sortValue ||
                                        (remote && column.sortable)) ? (
                                        <button
                                            type="button"
                                            className={
                                                "inline-flex items-center " +
                                                "gap-1 text-left text-foreground"
                                            }
                                            onClick={() => {
                                                const next = sort?.id !== column.id
                                                    ? { id: column.id,
                                                        direction: "ascending" as const }
                                                    : sort.direction === "ascending"
                                                        ? { id: column.id,
                                                            direction: "descending" as const }
                                                        : null;
                                                changeView({ sort: next, page: 1 });
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
                        {(remote?.status === "loading" ||
                            remote?.status === "error" ||
                            pageRows.length === 0) ? (
                            <tr>
                                <TableCell
                                    colSpan={columns.length + (selectable ? 1 : 0)}
                                    className="py-8 text-center text-muted"
                                >
                                    {remote?.status === "loading" ? (
                                        <span role="status">불러오는 중…</span>
                                    ) : remote?.status === "error" ? (
                                        <span role="alert">
                                            {remote.errorMessage ??
                                                "데이터를 불러오지 못했습니다."}
                                            {remote.onRetry && (
                                                <Button variant="outline"
                                                    className="ml-2"
                                                    onClick={remote.onRetry}>
                                                    다시 시도
                                                </Button>
                                            )}
                                        </span>
                                    ) : emptyMessage}
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
                totalItems={remote?.totalItems ?? visibleRows.length}
                onPageChange={(next) => changeView({ page: next })}
                pageSizeOptions={pageSizeOptions}
                onPageSizeChange={(size) => {
                    changeView({ pageSize: size, page: 1 });
                }}
            />
        </div>
    );
}

export { DataTable };
export type {
    DataTableProps, DataTableColumn, DataTableFilter,
    DataTableRemoteFilter,
    DataTableView, DataTableSort, DataTableRemote,
};
