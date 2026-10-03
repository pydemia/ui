import type { ComponentProps } from "react";
import { cn } from "./utils";

type PivotAxisItem = { id: string; label: string };
type PivotRecord = {
    rowId: string;
    columnId: string;
    value: number | null;
};

type PivotTableProps = Omit<
    ComponentProps<"figure">, "children" | "title"
> & {
    title: string;
    rowLabel: string;
    columnLabel: string;
    rows: readonly PivotAxisItem[];
    columns: readonly PivotAxisItem[];
    records: readonly PivotRecord[];
    description?: string;
    unit?: string;
    formatValue?: (value: number) => string;
    appearance?: "panel" | "plain";
};

function axisIndex(items: readonly PivotAxisItem[], axis: string) {
    const ids = new Map<string, number>();
    const labels = new Set<string>();
    items.forEach((item, index) => {
        if (!item || typeof item.id !== "string" || !item.id.trim() ||
            typeof item.label !== "string" || !item.label.trim() ||
            ids.has(item.id) || labels.has(item.label)) {
            throw new Error(
                `PivotTable ${axis} need unique IDs and labels.`,
            );
        }
        ids.set(item.id, index);
        labels.add(item.label);
    });
    return ids;
}

function PivotTable({
    title,
    rowLabel,
    columnLabel,
    rows,
    columns,
    records,
    description,
    unit = "",
    formatValue = String,
    appearance = "panel",
    className,
    ...props
}: PivotTableProps) {
    if (typeof title !== "string" || !title.trim() ||
        typeof rowLabel !== "string" || !rowLabel.trim() ||
        typeof columnLabel !== "string" || !columnLabel.trim()) {
        throw new Error("PivotTable needs title and axis labels.");
    }
    if (!Array.isArray(rows) || !Array.isArray(columns) ||
        !Array.isArray(records)) {
        throw new TypeError("PivotTable axes and records must be arrays.");
    }
    if (appearance !== "panel" && appearance !== "plain") {
        throw new RangeError("PivotTable appearance is not supported.");
    }
    if ((rows.length === 0 || columns.length === 0) &&
        (rows.length !== columns.length || records.length > 0)) {
        throw new Error("PivotTable empty axes cannot contain data.");
    }

    const rowIndex = axisIndex(rows, "rows");
    const columnIndex = axisIndex(columns, "columns");
    const cells = rows.map(() => columns.map(() => 0));
    const missing = rows.map(() => columns.map(() => false));
    for (const record of records) {
        const row = rowIndex.get(record?.rowId);
        const column = columnIndex.get(record?.columnId);
        if (row === undefined || column === undefined) {
            throw new Error("PivotTable record references an unknown axis ID.");
        }
        if (record.value === null) {
            missing[row][column] = true;
        } else if (typeof record.value !== "number" ||
            !Number.isFinite(record.value)) {
            throw new RangeError(
                "PivotTable record values must be finite numbers or null.",
            );
        } else {
            cells[row][column] += record.value;
            if (!Number.isFinite(cells[row][column])) {
                throw new RangeError("PivotTable cell total must be finite.");
            }
        }
    }

    const total = (values: readonly (number | null)[]) => {
        let sum = 0;
        for (const value of values) {
            if (value === null) return null;
            sum += value;
        }
        if (!Number.isFinite(sum)) {
            throw new RangeError("PivotTable total must be finite.");
        }
        return sum;
    };
    const values = cells.map((row, rowIndex) => row.map((value, colIndex) =>
        missing[rowIndex][colIndex] ? null : value
    ));
    const rowTotals = values.map(total);
    const columnTotals = columns.map((_, column) =>
        total(values.map((row) => row[column]))
    );
    const grandTotal = total(rowTotals);
    const display = (value: number | null) => {
        if (value === null) return "미수집";
        const formatted = formatValue(value);
        if (typeof formatted !== "string" || !formatted.trim()) {
            throw new Error("PivotTable formatted values must be text.");
        }
        return `${formatted}${unit}`;
    };

    return (
        <figure {...props} data-appearance={appearance}
            className={cn(
                "min-w-0 text-foreground",
                appearance === "panel" &&
                    "rounded-sm border border-border bg-surface " +
                    "p-[var(--space-4)]",
                className,
            )}>
            <figcaption className="mb-[var(--space-3)]">
                <strong className="text-sm font-semibold">{title}</strong>
                {description && <p className="mb-0 mt-1 text-xs text-muted">
                    {description}
                </p>}
            </figcaption>
            {rows.length === 0 ? (
                <p role="status" className="m-0 py-12 text-center text-sm text-muted">
                    표시할 데이터가 없습니다.
                </p>
            ) : (
                <div role="region" aria-label={`${title} 데이터 표`}
                    tabIndex={0} className="max-w-full overflow-x-auto">
                    <table className="w-max min-w-full border-collapse text-sm">
                        <caption className="sr-only">
                            {title}. 행: {rowLabel}. 열: {columnLabel}.
                            미수집 값이 있으면 해당 합계도 미수집입니다.
                        </caption>
                        <thead><tr className="border-b border-border">
                            <th scope="col" className={
                                "sticky left-0 bg-surface px-3 py-2 " +
                                "text-left font-medium text-muted"
                            }>{rowLabel} / {columnLabel}</th>
                            {columns.map((column) => (
                                <th key={column.id} scope="col" className={
                                    "whitespace-nowrap px-3 py-2 text-right " +
                                    "font-medium text-muted"
                                }>{column.label}</th>
                            ))}
                            <th scope="col" className={
                                "bg-surface-subtle px-3 py-2 text-right " +
                                "font-semibold"
                            }>합계</th>
                        </tr></thead>
                        <tbody>{rows.map((row, index) => (
                            <tr key={row.id} className="border-b border-border">
                                <th scope="row" className={
                                    "sticky left-0 bg-surface px-3 py-2 " +
                                    "text-left font-medium"
                                }>{row.label}</th>
                                {values[index].map((value, column) => (
                                    <td key={columns[column].id}
                                        data-missing={value === null || undefined}
                                        className={cn(
                                            "whitespace-nowrap px-3 py-2 " +
                                            "text-right tabular-nums",
                                            value === null && "text-muted",
                                        )}>{display(value)}</td>
                                ))}
                                <td className={
                                    "whitespace-nowrap bg-surface-subtle " +
                                    "px-3 py-2 text-right font-semibold " +
                                    "tabular-nums"
                                }>{display(rowTotals[index])}</td>
                            </tr>
                        ))}</tbody>
                        <tfoot><tr className="bg-surface-subtle font-semibold">
                            <th scope="row" className={
                                "sticky left-0 bg-surface-subtle " +
                                "px-3 py-2 text-left"
                            }>합계</th>
                            {columnTotals.map((value, index) => (
                                <td key={columns[index].id} className={
                                    "whitespace-nowrap px-3 py-2 " +
                                    "text-right tabular-nums"
                                }>{display(value)}</td>
                            ))}
                            <td className={
                                "whitespace-nowrap px-3 py-2 text-right " +
                                "tabular-nums"
                            }>{display(grandTotal)}</td>
                        </tr></tfoot>
                    </table>
                </div>
            )}
        </figure>
    );
}

export { PivotTable };
export type { PivotAxisItem, PivotRecord, PivotTableProps };
