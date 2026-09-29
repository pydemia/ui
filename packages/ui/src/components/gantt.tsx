import { useId, useState, type ComponentProps } from "react";
import { cn } from "./utils";

type GanttTask = {
    id: string;
    title: string;
    startDate: string;
    endDate: string;
    progress?: number;
    dependsOn?: readonly string[];
};

type GanttOperation = "move-earlier" | "move-later" | "extend" | "shrink";

type GanttChange = {
    taskId: string;
    operation: GanttOperation;
    startDate: string;
    endDate: string;
};

type GanttProps = Omit<
    ComponentProps<"div">,
    "children" | "role" | "aria-label" | "tabIndex"
> & {
    label: string;
    rangeStart: string;
    rangeEnd: string;
    tasks: readonly GanttTask[];
    scale?: "day" | "week";
    emptyMessage?: string;
    onTasksChange?: (
        tasks: GanttTask[], change: GanttChange,
    ) => void;
};

const dayMs = 86_400_000;
const rowHeight = 56;

function parseDay(value: string, name: string) {
    if (typeof value !== "string" ||
        !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new RangeError(`${name} must be a YYYY-MM-DD date.`);
    }
    const date = new Date(`${value}T00:00:00Z`);
    if (!Number.isFinite(date.getTime()) ||
        date.toISOString().slice(0, 10) !== value) {
        throw new RangeError(`${name} must be a real calendar date.`);
    }
    return date.getTime() / dayMs;
}

function dateFromDay(day: number) {
    return new Date(day * dayMs).toISOString().slice(0, 10);
}

function validateGanttPlan(
    rangeStart: string,
    rangeEnd: string,
    tasks: readonly GanttTask[],
) {
    const first = parseDay(rangeStart, "Gantt rangeStart");
    const last = parseDay(rangeEnd, "Gantt rangeEnd");
    if (first > last || last - first > 365) {
        throw new RangeError("Gantt range must span 1 to 366 days.");
    }

    const dates = new Map<string, { start: number; end: number }>();
    const titles = new Map<string, string>();
    for (const task of tasks) {
        if (typeof task.id !== "string" || !task.id.trim() ||
            typeof task.title !== "string" || !task.title.trim() ||
            dates.has(task.id)) {
            throw new Error("Gantt tasks need unique IDs and titles.");
        }
        const start = parseDay(task.startDate, `${task.id} startDate`);
        const end = parseDay(task.endDate, `${task.id} endDate`);
        if (start > end || start < first || end > last) {
            throw new RangeError(
                "Gantt tasks must fit the visible range with ordered dates.",
            );
        }
        if (task.progress !== undefined &&
            (typeof task.progress !== "number" ||
                !Number.isFinite(task.progress) ||
                task.progress < 0 || task.progress > 100)) {
            throw new RangeError("Gantt progress must be from 0 to 100.");
        }
        dates.set(task.id, { start, end });
        titles.set(task.id, task.title);
    }

    for (const task of tasks) {
        if (task.dependsOn !== undefined &&
            !Array.isArray(task.dependsOn)) {
            throw new Error("Gantt dependsOn must be a list of task IDs.");
        }
        const predecessors = new Set<string>();
        for (const predecessorId of task.dependsOn ?? []) {
            const predecessor = dates.get(predecessorId);
            if (!predecessor || predecessorId === task.id ||
                predecessors.has(predecessorId)) {
                throw new Error(
                    "Gantt dependencies need distinct existing task IDs.",
                );
            }
            predecessors.add(predecessorId);
            if (predecessor.end >= dates.get(task.id)!.start) {
                throw new RangeError(
                    "Gantt dependencies must finish before the next task starts.",
                );
            }
        }
    }
    return { first, last, dates, titles };
}

function changeGanttTask(
    tasks: readonly GanttTask[],
    rangeStart: string,
    rangeEnd: string,
    taskId: string,
    operation: GanttOperation,
): { tasks: GanttTask[]; change: GanttChange } | null {
    const plan = validateGanttPlan(rangeStart, rangeEnd, tasks);
    const current = plan.dates.get(taskId);
    if (!current) throw new RangeError("Gantt task was not found.");

    let start = current.start;
    let end = current.end;
    switch (operation) {
        case "move-earlier": start--; end--; break;
        case "move-later": start++; end++; break;
        case "extend": end++; break;
        case "shrink": end--; break;
        default: throw new RangeError("Unsupported Gantt operation.");
    }
    if (start < plan.first || end > plan.last || end < start) return null;
    const task = tasks.find((item) => item.id === taskId)!;
    if ((task.dependsOn ?? []).some((id) =>
        plan.dates.get(id)!.end >= start)) return null;
    if (tasks.some((item) => item.dependsOn?.includes(taskId) &&
        end >= plan.dates.get(item.id)!.start)) return null;

    const change = {
        taskId, operation,
        startDate: dateFromDay(start),
        endDate: dateFromDay(end),
    };
    return {
        tasks: tasks.map((item) => item.id === taskId
            ? { ...item, startDate: change.startDate,
                endDate: change.endDate }
            : item),
        change,
    };
}

const operations: { id: GanttOperation; label: string }[] = [
    { id: "move-earlier", label: "1일 앞당기기" },
    { id: "move-later", label: "1일 미루기" },
    { id: "extend", label: "기간 1일 늘리기" },
    { id: "shrink", label: "기간 1일 줄이기" },
];

function Gantt({
    label,
    rangeStart,
    rangeEnd,
    tasks,
    scale = "day",
    emptyMessage = "표시할 작업이 없습니다.",
    onTasksChange,
    className,
    ...props
}: GanttProps) {
    if (typeof label !== "string" || !label.trim()) {
        throw new Error("Gantt needs a chart label.");
    }
    if (scale !== "day" && scale !== "week") {
        throw new RangeError("Gantt scale must be day or week.");
    }
    const plan = validateGanttPlan(rangeStart, rangeEnd, tasks);
    const [selectedId, setSelectedId] = useState<string | null>(
        tasks[0]?.id ?? null,
    );
    const [announcement, setAnnouncement] = useState("");
    const connectorId = useId();
    const selected = tasks.find((task) => task.id === selectedId) ??
        tasks[0] ?? null;
    const dayWidth = scale === "day" ? 42 : 14;
    const tickDays = scale === "day" ? 1 : 7;
    const dayCount = plan.last - plan.first + 1;
    const chartWidth = dayCount * dayWidth;
    const ticks = Array.from({ length: Math.ceil(dayCount / tickDays) },
        (_, index) => {
            const start = plan.first + index * tickDays;
            const end = Math.min(start + tickDays - 1, plan.last);
            const startLabel = dateFromDay(start).slice(5).replace("-", "/");
            const endLabel = dateFromDay(end).slice(5).replace("-", "/");
            return {
                id: start,
                label: scale === "day"
                    ? startLabel : `${startLabel}–${endLabel}`,
                width: (end - start + 1) * dayWidth,
            };
        });
    const proposals = selected && onTasksChange
        ? Object.fromEntries(operations.map(({ id }) => [
            id, changeGanttTask(
                tasks, rangeStart, rangeEnd, selected.id, id,
            ),
        ])) as Record<GanttOperation,
            ReturnType<typeof changeGanttTask>>
        : null;

    function applyChange(operation: GanttOperation) {
        const proposal = proposals?.[operation];
        if (!proposal || !selected || !onTasksChange) return;
        onTasksChange(proposal.tasks, proposal.change);
        setAnnouncement(
            `${selected.title}: ${proposal.change.startDate}부터 ` +
            `${proposal.change.endDate}까지 일정 변경을 요청했습니다.`,
        );
    }

    return (
        <div {...props} role="region" aria-label={label}
            className={cn("min-w-0 rounded-sm border border-border " +
                "bg-surface text-foreground", className)}>
            <div className={"flex flex-wrap items-center justify-between gap-2 " +
                "border-b border-border px-4 py-3"}>
                <strong className="text-sm">{label}</strong>
                <span className="text-xs text-muted">
                    {rangeStart} – {rangeEnd} · {scale === "day"
                        ? "일 단위" : "7일 단위"}
                </span>
            </div>
            {tasks.length === 0 ? (
                <p role="status" className="m-0 p-4 text-sm text-muted">
                    {emptyMessage}
                </p>
            ) : <>
                {selected && (
                    <div className="border-b border-border px-4 py-3">
                        <p className="m-0 text-xs text-muted">
                            선택: <strong className="text-foreground">
                                {selected.title}
                            </strong> · {selected.startDate} – {selected.endDate}
                            {selected.progress !== undefined &&
                                ` · 진행 ${selected.progress}%`}
                        </p>
                        {onTasksChange && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {operations.map(({ id, label: action }) => (
                                    <button key={id} type="button"
                                        disabled={!proposals?.[id]}
                                        onClick={() => applyChange(id)}
                                        className={"rounded-sm border border-border " +
                                            "bg-surface px-2 py-1 text-xs " +
                                            "hover:bg-surface-subtle " +
                                            "focus-visible:outline-2 " +
                                            "focus-visible:outline-focus " +
                                            "disabled:cursor-not-allowed " +
                                            "disabled:opacity-50"}>
                                        {action}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                <p className="sr-only" role="status" aria-live="polite">
                    {announcement}
                </p>
                <div tabIndex={0} role="group"
                    aria-label={`${label} 시간축`}
                    className="min-w-0 overflow-x-auto">
                    <div style={{ width: 180 + chartWidth }}>
                        <div className={"flex h-9 border-b border-border " +
                            "bg-surface-subtle text-[10px] text-muted"}>
                            <span className={"sticky left-0 z-30 flex w-[180px] " +
                                "shrink-0 items-center border-r border-border " +
                                "bg-surface-subtle px-3 font-semibold"}>
                                작업 / 진행률
                            </span>
                            <div className="flex" aria-hidden="true">
                                {ticks.map((tick) => (
                                    <span key={tick.id}
                                        style={{ width: tick.width }}
                                        className={"flex shrink-0 items-center " +
                                            "border-r border-border px-1"}>
                                        {tick.label}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="relative">
                            <svg aria-hidden="true"
                                className={"pointer-events-none absolute " +
                                    "left-[180px] top-0 z-10"}
                                width={chartWidth}
                                height={tasks.length * rowHeight}>
                                <defs>
                                    <marker id={connectorId} markerWidth="5"
                                        markerHeight="5" refX="4" refY="2.5"
                                        orient="auto">
                                        <path d="M0 0 L5 2.5 L0 5"
                                            fill="none" stroke="var(--muted)" />
                                    </marker>
                                </defs>
                                {tasks.flatMap((task, index) =>
                                    (task.dependsOn ?? []).map((id) => {
                                        const before = plan.dates.get(id)!;
                                        const current = plan.dates.get(task.id)!;
                                        const beforeIndex = tasks.findIndex(
                                            (item) => item.id === id,
                                        );
                                        const x1 = (before.end - plan.first + 1)
                                            * dayWidth;
                                        const x2 = (current.start - plan.first)
                                            * dayWidth;
                                        const y1 = beforeIndex * rowHeight +
                                            rowHeight / 2;
                                        const y2 = index * rowHeight +
                                            rowHeight / 2;
                                        const elbow = Math.min(x1 + 8, x2);
                                        return <path key={`${id}-${task.id}`}
                                            d={`M${x1} ${y1} H${elbow} ` +
                                                `V${y2} H${x2}`}
                                            fill="none"
                                            stroke="var(--muted)"
                                            strokeWidth="1.5"
                                            strokeDasharray="3 3"
                                            markerEnd={`url(#${connectorId})`} />;
                                    }),
                                )}
                            </svg>
                            <ol aria-label={`${label} 작업`}
                                className="m-0 list-none p-0">
                                {tasks.map((task) => {
                                    const dates = plan.dates.get(task.id)!;
                                    const predecessors = (task.dependsOn ?? [])
                                        .map((id) => plan.titles.get(id)!);
                                    return <li key={task.id}
                                        className={"flex h-14 border-b " +
                                            "border-border last:border-b-0"}>
                                        <div className={"sticky left-0 z-20 w-[180px] " +
                                            "shrink-0 border-r border-border " +
                                            "bg-surface"}>
                                            <button type="button"
                                                aria-pressed={
                                                    selected?.id === task.id
                                                }
                                                onClick={() =>
                                                    setSelectedId(task.id)}
                                                className={"flex h-full w-full flex-col " +
                                                    "justify-center px-3 text-left " +
                                                    "hover:bg-surface-subtle " +
                                                    "focus-visible:outline-2 " +
                                                    "focus-visible:outline-focus " +
                                                    "aria-pressed:bg-surface-subtle"}>
                                                <span className={"truncate text-xs " +
                                                    "font-semibold"}>
                                                    {task.title}
                                                </span>
                                                <span className={"truncate text-[10px] " +
                                                    "text-muted"}>
                                                    {task.startDate} –
                                                    {` ${task.endDate}`}
                                                    {task.progress !== undefined
                                                        ? ` · ${task.progress}%`
                                                        : " · 진행률 미입력"}
                                                </span>
                                                {predecessors.length > 0 &&
                                                    <span className="sr-only">
                                                        선행 작업:
                                                        {` ${predecessors.join(", ")}`}
                                                    </span>}
                                            </button>
                                        </div>
                                        <div aria-hidden="true"
                                            onClick={() =>
                                                setSelectedId(task.id)}
                                            className="relative shrink-0 cursor-pointer"
                                            style={{
                                                width: chartWidth,
                                                backgroundImage:
                                                    "linear-gradient(to right, " +
                                                    "var(--border) 1px, " +
                                                    "transparent 1px)",
                                                backgroundSize:
                                                    `${tickDays * dayWidth}px 100%`,
                                            }}>
                                            <div className={cn(
                                                "absolute top-[18px] z-20 h-5 " +
                                                "overflow-hidden rounded-sm border " +
                                                "border-accent",
                                                selected?.id === task.id &&
                                                    "ring-2 ring-focus",
                                            )} style={{
                                                left: (dates.start - plan.first)
                                                    * dayWidth + 2,
                                                width: (dates.end - dates.start + 1)
                                                    * dayWidth - 4,
                                                background: "color-mix(in srgb, " +
                                                    "var(--accent) 14%, " +
                                                    "var(--surface))",
                                            }}>
                                                {task.progress !== undefined &&
                                                    <span className={"block h-full " +
                                                        "bg-accent"}
                                                        style={{
                                                            width:
                                                                `${task.progress}%`,
                                                        }} />}
                                            </div>
                                        </div>
                                    </li>;
                                })}
                            </ol>
                        </div>
                    </div>
                </div>
            </>}
        </div>
    );
}

export { Gantt, changeGanttTask };
export type { GanttTask, GanttOperation, GanttChange, GanttProps };
