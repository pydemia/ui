import { useId, useRef, useState, type ComponentProps } from "react";
import { Button } from "./button";
import { parseCalendarDate } from "./calendar-date";
import { Input } from "./input";
import { NativeSelect } from "./native-select";
import { cn } from "./utils";

type QueryField = {
    id: string;
    label: string;
    type: "text" | "number" | "date" | "select";
    options?: readonly { value: string; label: string }[];
};

type QueryOperator =
    "equals" | "not-equals" | "contains" | "greater-than" |
    "less-than" | "is-empty" | "is-not-empty";

type QueryCondition = {
    kind: "condition";
    id: string;
    fieldId: string;
    operator: QueryOperator;
    value: string;
};

type QueryGroup = {
    kind: "group";
    id: string;
    combinator: "all" | "any";
    children: readonly QueryNode[];
};

type QueryNode = QueryCondition | QueryGroup;

type QueryBuilderProps = Omit<
    ComponentProps<"form">,
    "aria-label" | "aria-labelledby" | "children" | "onChange" |
    "onSubmit" | "defaultValue"
> & {
    label: string;
    fields: readonly QueryField[];
    value: QueryGroup;
    onValueChange: (next: QueryGroup) => void;
    onApply?: (query: QueryGroup) => void;
    variant?: "plain" | "panel";
    maxDepth?: number;
    disabled?: boolean;
};

const operatorLabels: Record<QueryOperator, string> = {
    equals: "같음",
    "not-equals": "다름",
    contains: "포함",
    "greater-than": "초과",
    "less-than": "미만",
    "is-empty": "비어 있음",
    "is-not-empty": "비어 있지 않음",
};

const operatorsByType: Record<QueryField["type"],
    readonly QueryOperator[]> = {
    text: ["contains", "equals", "not-equals", "is-empty",
        "is-not-empty"],
    number: ["equals", "not-equals", "greater-than", "less-than",
        "is-empty", "is-not-empty"],
    date: ["equals", "not-equals", "greater-than", "less-than",
        "is-empty", "is-not-empty"],
    select: ["equals", "not-equals", "is-empty", "is-not-empty"],
};

function hasValue(operator: QueryOperator) {
    return operator !== "is-empty" && operator !== "is-not-empty";
}

function isCalendarDate(value: string) {
    try {
        parseCalendarDate(value);
        return true;
    } catch (error) {
        if (error instanceof RangeError) return false;
        throw error;
    }
}

function conditionError(
    condition: QueryCondition, fields: Map<string, QueryField>,
) {
    if (!condition.fieldId) return "필드를 선택하세요.";
    const field = fields.get(condition.fieldId);
    if (!field) return "사용할 수 없는 필드입니다.";
    if (!operatorsByType[field.type].includes(condition.operator)) {
        return "이 필드에 맞는 연산자를 선택하세요.";
    }
    if (!hasValue(condition.operator)) {
        return condition.value === "" ? null :
            "값이 없는 연산자는 값을 받지 않습니다.";
    }
    if (!condition.value.trim()) return "값을 입력하세요.";
    if (field.type === "select" && !field.options?.some(
        (option) => option.value === condition.value,
    )) return "선택지에 없는 값입니다.";
    if (field.type === "number" && (!/^-?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/.test(
        condition.value.trim(),
    ) || !Number.isFinite(Number(condition.value)))) {
        return "유한한 숫자를 입력하세요.";
    }
    if (field.type === "date" && !isCalendarDate(condition.value)) {
        return "올바른 날짜를 입력하세요.";
    }
    return null;
}

function inspectQuery(
    root: QueryGroup, fields: Map<string, QueryField>, maxDepth: number,
) {
    if (!root || root.kind !== "group") {
        throw new Error("QueryBuilder requires a root group.");
    }
    const errors = new Map<string, string>();
    const ids = new Set<string>();
    const stack: { node: QueryNode; depth: number }[] = [
        { node: root, depth: 1 },
    ];
    let conditionCount = 0;
    while (stack.length) {
        const { node, depth } = stack.pop()!;
        if (!node || typeof node.id !== "string" || !node.id.trim() ||
            ids.has(node.id)) {
            throw new Error("QueryBuilder nodes need unique, nonempty IDs.");
        }
        ids.add(node.id);
        if (node.kind === "group") {
            if (depth > maxDepth || !Array.isArray(node.children) ||
                (node.combinator !== "all" && node.combinator !== "any")) {
                throw new Error("QueryBuilder has an invalid group.");
            }
            if (depth > 1 && node.children.length === 0) {
                errors.set(node.id, "빈 그룹에는 조건을 추가하거나 그룹을 제거하세요.");
            }
            for (let index = node.children.length - 1; index >= 0; index--) {
                stack.push({ node: node.children[index], depth: depth + 1 });
            }
        } else if (node.kind === "condition") {
            if (typeof node.fieldId !== "string" ||
                typeof node.value !== "string" ||
                !Object.hasOwn(operatorLabels, node.operator)) {
                throw new Error("QueryBuilder has an invalid condition.");
            }
            conditionCount++;
            const error = conditionError(node, fields);
            if (error) errors.set(node.id, error);
        } else {
            throw new Error("QueryBuilder has an unsupported node.");
        }
    }
    return { errors, ids, conditionCount };
}

function replaceQueryNode(
    group: QueryGroup, id: string, replacement: QueryNode | null,
): QueryGroup {
    if (group.id === id) {
        if (replacement?.kind !== "group") {
            throw new Error("QueryBuilder cannot remove the root group.");
        }
        return replacement;
    }
    let changed = false;
    const children = group.children.flatMap((child) => {
        if (child.id === id) {
            changed = true;
            return replacement ? [replacement] : [];
        }
        if (child.kind === "group") {
            const next = replaceQueryNode(child, id, replacement);
            if (next !== child) changed = true;
            return [next];
        }
        return [child];
    });
    return changed ? { ...group, children } : group;
}

function QueryBuilder({
    label, fields, value, onValueChange, onApply, variant = "panel",
    maxDepth = 4, disabled = false, className, ...props
}: QueryBuilderProps) {
    const instanceId = useId().replace(/[^a-zA-Z0-9]/g, "");
    const nextNumber = useRef(0);
    const [attempted, setAttempted] = useState(false);
    if (!label.trim()) throw new Error("QueryBuilder requires a label.");
    if (variant !== "plain" && variant !== "panel") {
        throw new Error("QueryBuilder has an unsupported variant.");
    }
    if (!Number.isInteger(maxDepth) || maxDepth < 1 || maxDepth > 8) {
        throw new Error("QueryBuilder maxDepth must be between 1 and 8.");
    }
    const fieldById = new Map<string, QueryField>();
    for (const field of fields) {
        if (!field.id.trim() || !field.label.trim() ||
            fieldById.has(field.id) ||
            !Object.hasOwn(operatorsByType, field.type)) {
            throw new Error("QueryBuilder fields need unique IDs and types.");
        }
        if (field.type === "select") {
            const options = field.options ?? [];
            const optionIds = new Set<string>();
            if (!options.length || options.some((option) => {
                if (!option.value.trim() || !option.label.trim() ||
                    optionIds.has(option.value)) return true;
                optionIds.add(option.value);
                return false;
            })) {
                throw new Error("QueryBuilder select fields need unique options.");
            }
        }
        fieldById.set(field.id, field);
    }
    if (fieldById.size === 0) {
        throw new Error("QueryBuilder requires at least one field.");
    }
    const { errors, ids, conditionCount } = inspectQuery(
        value, fieldById, maxDepth,
    );

    function newId() {
        let id: string;
        do {
            id = `query-${instanceId}-${++nextNumber.current}`;
        } while (ids.has(id));
        return id;
    }

    function replace(id: string, next: QueryNode | null) {
        const updated = replaceQueryNode(value, id, next);
        if (updated !== value) onValueChange(updated);
    }

    function addCondition(group: QueryGroup) {
        replace(group.id, { ...group, children: [...group.children, {
            kind: "condition", id: newId(), fieldId: "",
            operator: "equals", value: "",
        }] });
    }

    function addGroup(group: QueryGroup) {
        replace(group.id, { ...group, children: [...group.children, {
            kind: "group", id: newId(), combinator: "all",
            children: [{ kind: "condition", id: newId(), fieldId: "",
                operator: "equals", value: "" }],
        }] });
    }

    function move(group: QueryGroup, index: number, direction: -1 | 1) {
        const children = [...group.children];
        const next = index + direction;
        if (next < 0 || next >= children.length) return;
        [children[index], children[next]] = [children[next], children[index]];
        replace(group.id, { ...group, children });
    }

    function renderCondition(
        condition: QueryCondition, group: QueryGroup,
        index: number, path: string,
    ) {
        const field = fieldById.get(condition.fieldId);
        const operators = field ? operatorsByType[field.type] : [];
        const validOperator = operators.includes(condition.operator);
        const error = errors.get(condition.id);
        const errorId = `${instanceId}-query-error-${path.replaceAll(".", "-")}`;
        const describedBy = attempted && error ? errorId : undefined;
        const invalid = attempted && Boolean(error);
        return (
            <div key={condition.id} className={
                "grid min-w-0 gap-2 rounded-sm border " +
                "border-border bg-surface p-[var(--space-2)]"
            }>
                <NativeSelect aria-label={`${path} 필드`}
                    aria-invalid={invalid} aria-describedby={describedBy}
                    value={field ? condition.fieldId : ""}
                    disabled={disabled}
                    onChange={(event) => {
                        const selected = fieldById.get(event.target.value);
                        replace(condition.id, { ...condition,
                            fieldId: selected?.id ?? "",
                            operator: selected
                                ? operatorsByType[selected.type][0] : "equals",
                            value: "",
                        });
                    }}>
                    <option value="">필드 선택</option>
                    {fields.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.label}
                        </option>
                    ))}
                </NativeSelect>
                <NativeSelect aria-label={`${path} 연산자`}
                    aria-invalid={invalid} aria-describedby={describedBy}
                    value={validOperator ? condition.operator : ""}
                    disabled={disabled || !field}
                    onChange={(event) => replace(condition.id, {
                        ...condition, operator: event.target.value as QueryOperator,
                        value: "",
                    })}>
                    {!validOperator && <option value="">연산자 선택</option>}
                    {operators.map((operator) => (
                        <option key={operator} value={operator}>
                            {operatorLabels[operator]}
                        </option>
                    ))}
                </NativeSelect>
                {!field || !validOperator || hasValue(condition.operator) ?
                    field?.type === "select" && validOperator ? (
                        <NativeSelect aria-label={`${path} 값`}
                            aria-invalid={invalid}
                            aria-describedby={describedBy}
                            value={field.options?.some((option) =>
                                option.value === condition.value,
                            ) ? condition.value : ""}
                            disabled={disabled || !field || !validOperator}
                            onChange={(event) => replace(condition.id, {
                                ...condition, value: event.target.value,
                            })}>
                            <option value="">값 선택</option>
                            {field.options?.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </NativeSelect>
                    ) : (
                        <Input aria-label={`${path} 값`}
                            aria-invalid={invalid}
                            aria-describedby={describedBy}
                            type={field?.type === "date" ? "date" : "text"}
                            inputMode={field?.type === "number"
                                ? "decimal" : undefined}
                            value={condition.value}
                            disabled={disabled || !field || !validOperator}
                            onChange={(event) => replace(condition.id, {
                                ...condition, value: event.target.value,
                            })}
                        />
                    ) : (
                        <span className="flex items-center gap-2 text-sm text-muted">
                            값 입력 없음
                            {condition.value !== "" && (
                                <Button type="button" variant="outline"
                                    onClick={() => replace(condition.id, {
                                        ...condition, value: "",
                                    })}>
                                    값 지우기
                                </Button>
                            )}
                        </span>
                    )}
                <div className="flex w-full flex-wrap items-center gap-1">
                    <Button type="button" variant="ghost"
                        aria-label={`${path} 위로 이동`}
                        disabled={disabled || index === 0}
                        onClick={() => move(group, index, -1)}>
                        위로
                    </Button>
                    <Button type="button" variant="ghost"
                        aria-label={`${path} 아래로 이동`}
                        disabled={disabled || index === group.children.length - 1}
                        onClick={() => move(group, index, 1)}>
                        아래로
                    </Button>
                    <Button type="button" variant="ghost"
                        aria-label={`${path} 제거`}
                        disabled={disabled}
                        onClick={() => replace(condition.id, null)}>
                        제거
                    </Button>
                </div>
                {attempted && error && (
                    <p id={errorId} role="alert"
                        className="m-0 w-full text-xs text-danger">
                        {path}: {error}
                    </p>
                )}
            </div>
        );
    }

    function renderGroup(
        group: QueryGroup, depth: number, path: string,
        parent?: QueryGroup, index = 0,
    ) {
        const groupError = errors.get(group.id);
        return (
            <fieldset key={group.id} disabled={disabled}
                className={cn(
                    "min-w-0 space-y-[var(--space-3)] rounded-sm",
                    variant === "panel"
                        ? "border border-border bg-surface-subtle " +
                            "p-[var(--space-3)]"
                        : "border-l-2 border-border pl-[var(--space-3)]",
                )}>
                <legend className="px-1 text-sm font-medium">
                    {depth === 1 ? "조건 규칙" : `${path} 그룹`}
                </legend>
                <div className="flex flex-wrap items-center gap-2">
                    <label className="flex min-w-40 flex-1 items-center gap-2">
                        <span className="shrink-0 text-sm text-muted">결합</span>
                        <NativeSelect aria-label={`${path} 결합 방식`}
                            value={group.combinator}
                            onChange={(event) => replace(group.id, {
                                ...group,
                                combinator: event.target.value as "all" | "any",
                            })}>
                            <option value="all">모든 조건 충족 (AND)</option>
                            <option value="any">하나 이상 충족 (OR)</option>
                        </NativeSelect>
                    </label>
                    {parent && (
                        <div className="flex flex-wrap gap-1">
                            <Button type="button" variant="ghost"
                                aria-label={`${path} 그룹 위로 이동`}
                                disabled={index === 0}
                                onClick={() => move(parent, index, -1)}>
                                그룹 위로
                            </Button>
                            <Button type="button" variant="ghost"
                                aria-label={`${path} 그룹 아래로 이동`}
                                disabled={index === parent.children.length - 1}
                                onClick={() => move(parent, index, 1)}>
                                그룹 아래로
                            </Button>
                            <Button type="button" variant="ghost"
                                aria-label={`${path} 그룹 제거`}
                                onClick={() => replace(group.id, null)}>
                                그룹 제거
                            </Button>
                        </div>
                    )}
                </div>
                <div className="grid gap-2">
                    {group.children.length === 0 && (
                        <p className="m-0 text-sm text-muted">
                            조건이 없습니다. 조건을 추가하세요.
                        </p>
                    )}
                    {group.children.map((child, childIndex) => {
                        const childPath = depth === 1
                            ? `조건 ${childIndex + 1}`
                            : `${path}.${childIndex + 1}`;
                        return child.kind === "group"
                            ? renderGroup(child, depth + 1, childPath,
                                group, childIndex)
                            : renderCondition(child, group, childIndex,
                                childPath);
                    })}
                </div>
                {attempted && groupError && (
                    <p role="alert" className="m-0 text-xs text-danger">
                        {groupError}
                    </p>
                )}
                <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline"
                        aria-label={`${path}에 조건 추가`}
                        onClick={() => addCondition(group)}>
                        조건 추가
                    </Button>
                    {depth < maxDepth && (
                        <Button type="button" variant="outline"
                            aria-label={`${path}에 그룹 추가`}
                            onClick={() => addGroup(group)}>
                            그룹 추가
                        </Button>
                    )}
                </div>
            </fieldset>
        );
    }

    return (
        <form {...props} aria-label={label} data-variant={variant}
            className={cn("grid min-w-0 gap-[var(--space-3)] text-foreground",
                className)}
            onSubmit={(event) => {
                event.preventDefault();
                setAttempted(true);
                if (errors.size === 0) onApply?.(value);
            }}>
            {renderGroup(value, 1, "조건")}
            <div className="flex flex-wrap items-center gap-3">
                {onApply && <Button type="submit" disabled={disabled}>
                    조건 적용
                </Button>}
                <span role="status" className="text-sm text-muted">
                    {conditionCount === 0 ? "조건 없음" :
                        `${conditionCount}개 조건`}
                    {errors.size > 0 && attempted &&
                        ` · ${errors.size}개 미완료`}
                </span>
            </div>
        </form>
    );
}

export { QueryBuilder };
export type {
    QueryBuilderProps, QueryField, QueryCondition, QueryGroup,
    QueryNode, QueryOperator,
};
