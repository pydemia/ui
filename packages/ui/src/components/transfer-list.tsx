import { useState, type ComponentProps } from "react";
import { Button } from "./button";
import { cn } from "./utils";

type TransferListItem = {
    value: string;
    label: string;
    description?: string;
    disabled?: boolean;
};

type TransferListProps = Omit<ComponentProps<"div">, "children" | "onChange"> & {
    label: string;
    items: readonly TransferListItem[];
    value: readonly string[];
    onValueChange: (value: string[]) => void;
    name?: string;
    availableLabel?: string;
    assignedLabel?: string;
    disabled?: boolean;
    appearance?: "panel" | "plain";
};

function TransferList({
    label,
    items,
    value,
    onValueChange,
    name,
    availableLabel = "사용 가능",
    assignedLabel = "배정됨",
    disabled = false,
    appearance = "panel",
    className,
    ...props
}: TransferListProps) {
    const [checked, setChecked] = useState<string[]>([]);
    const values = new Set(items.map((item) => item.value));
    const assigned = new Set(value);

    if (!label.trim() || !availableLabel.trim() || !assignedLabel.trim() ||
        items.some((item) => !item.value.trim() || !item.label.trim()) ||
        values.size !== items.length) {
        throw new Error("TransferList requires labels and unique named items.");
    }
    if (assigned.size !== value.length ||
        value.some((item) => !values.has(item))) {
        throw new Error("TransferList value contains unknown or duplicate items.");
    }
    if (appearance !== "panel" && appearance !== "plain") {
        throw new Error("TransferList appearance is unsupported.");
    }

    const availableItems = items.filter((item) => !assigned.has(item.value));
    const assignedItems = value.map((item) =>
        items.find((candidate) => candidate.value === item)!,
    );
    const movable = (item: TransferListItem) =>
        !disabled && !item.disabled && checked.includes(item.value);
    const canAdd = availableItems.some(movable);
    const canRemove = assignedItems.some(movable);

    function toggle(item: string) {
        setChecked((current) => current.includes(item)
            ? current.filter((entry) => entry !== item)
            : [...current, item]);
    }

    function move(direction: "add" | "remove") {
        const source = direction === "add" ? availableItems : assignedItems;
        const moved = source.filter(movable).map((item) => item.value);
        if (!moved.length) return;
        const next = direction === "add"
            ? [...value, ...moved]
            : value.filter((item) => !moved.includes(item));
        setChecked((current) => current.filter((item) => !moved.includes(item)));
        onValueChange(next);
    }

    function list(
        legend: string,
        entries: TransferListItem[],
    ) {
        return (
            <fieldset className={cn(
                "m-0 min-w-0 rounded-sm p-3",
                appearance === "panel"
                    ? "border border-border bg-surface"
                    : "border-0 bg-surface-subtle",
            )} disabled={disabled}>
                <legend className="px-1 text-sm font-medium text-foreground">
                    {legend} ({entries.length})
                </legend>
                <div className="max-h-60 min-h-24 overflow-y-auto">
                    {entries.length ? entries.map((item) => (
                        <label key={item.value} className={
                            "flex min-h-10 cursor-pointer items-start gap-2 " +
                            "rounded-sm px-2 py-2 text-sm hover:bg-surface-subtle " +
                            "has-[:disabled]:cursor-not-allowed " +
                            "has-[:disabled]:opacity-50"
                        }>
                            <input type="checkbox"
                                checked={checked.includes(item.value)}
                                disabled={item.disabled}
                                onChange={() => toggle(item.value)}
                                className="mt-0.5 size-4 accent-accent" />
                            <span className="grid gap-0.5">
                                <span>{item.label}</span>
                                {item.description && <span className=
                                    "text-xs text-muted">{item.description}</span>}
                            </span>
                        </label>
                    )) : <p className="m-0 px-2 py-2 text-sm text-muted">
                        항목이 없습니다.
                    </p>}
                </div>
            </fieldset>
        );
    }

    return (
        <div {...props} role="group" aria-label={label}
            className={cn("min-w-0", className)}
            data-appearance={appearance}>
            <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
                {list(availableLabel, availableItems)}
                <div className="flex gap-2 sm:flex-col">
                    <Button variant="outline" disabled={!canAdd}
                        aria-label={`${availableLabel}에서 ${assignedLabel}으로 추가`}
                        onClick={() => move("add")}>추가 →</Button>
                    <Button variant="outline" disabled={!canRemove}
                        aria-label={`${assignedLabel}에서 ${availableLabel}으로 제거`}
                        onClick={() => move("remove")}>← 제거</Button>
                </div>
                {list(assignedLabel, assignedItems)}
            </div>
            {name && !disabled && value.map((item) => (
                <input key={item} type="hidden" name={name} value={item} />
            ))}
        </div>
    );
}

export { TransferList };
export type { TransferListItem, TransferListProps };
