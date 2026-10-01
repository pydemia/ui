import { labelDayButton } from "react-day-picker";
import { useEffect, useState, type ComponentProps } from "react";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { formatCalendarDate, parseCalendarDate } from "./calendar-date";
import { cn } from "./utils";

type CalendarSchedule = {
    id: string;
    date: string;
    title: string;
    startTime?: string;
    endTime?: string;
    description?: string;
};

type CalendarSchedulerProps = Omit<
    ComponentProps<"section">, "children"
> & {
    label: string;
    initialDate: string;
    events: readonly CalendarSchedule[];
    selectedDate?: string;
    onSelectedDateChange?: (date: string) => void;
    onEventSelect?: (event: CalendarSchedule) => void;
    onCreateEvent?: (date: string) => void;
    timeZone?: string;
    calendarLocale?: ComponentProps<typeof Calendar>["locale"];
    emptyMessage?: string;
};

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

function CalendarScheduler({
    label,
    initialDate,
    events,
    selectedDate,
    onSelectedDateChange,
    onEventSelect,
    onCreateEvent,
    timeZone,
    calendarLocale,
    emptyMessage = "이 날짜에는 일정이 없습니다.",
    className,
    ...props
}: CalendarSchedulerProps) {
    if (typeof label !== "string" || !label.trim()) {
        throw new Error("CalendarScheduler requires a label.");
    }
    const initial = parseCalendarDate(initialDate);
    if (selectedDate !== undefined) parseCalendarDate(selectedDate);
    if (!Array.isArray(events)) {
        throw new Error("CalendarScheduler requires events.");
    }

    const eventCounts = new Map<string, number>();
    const ids = new Set<string>();
    for (const event of events) {
        if (!event || typeof event.id !== "string" ||
            !event.id.trim() || ids.has(event.id) ||
            typeof event.title !== "string" || !event.title.trim() ||
            typeof event.date !== "string") {
            throw new Error(
                "CalendarScheduler events need unique IDs, dates, and titles.",
            );
        }
        parseCalendarDate(event.date);
        if ((event.startTime !== undefined &&
                !timePattern.test(event.startTime)) ||
            (event.endTime !== undefined && (
                event.startTime === undefined ||
                !timePattern.test(event.endTime) ||
                event.endTime <= event.startTime
            ))) {
            throw new RangeError(
                `CalendarScheduler event has invalid time: ${event.id}`,
            );
        }
        ids.add(event.id);
        eventCounts.set(event.date, (eventCounts.get(event.date) ?? 0) + 1);
    }
    if (events.some((event) => event.startTime !== undefined) &&
        !timeZone) {
        throw new Error("CalendarScheduler timed events need a timeZone.");
    }
    if (timeZone) {
        new Intl.DateTimeFormat("en", { timeZone });
    }

    const [internalDate, setInternalDate] = useState(initialDate);
    const [visibleMonth, setVisibleMonth] = useState(
        selectedDate === undefined ? initial : parseCalendarDate(selectedDate),
    );
    const currentDate = selectedDate === undefined
        ? internalDate : selectedDate;
    const dailyEvents = events.filter((event) =>
        event.date === currentDate
    ).sort((a, b) => {
        const byTime = (a.startTime ?? "").localeCompare(
            b.startTime ?? "",
        );
        return byTime || a.id.localeCompare(b.id);
    });
    const monthPrefix = formatCalendarDate(visibleMonth).slice(0, 7);
    const monthCount = Array.from(eventCounts).reduce(
        (count, [date, total]) =>
            count + (date.startsWith(monthPrefix) ? total : 0), 0,
    );

    useEffect(() => {
        if (selectedDate !== undefined) {
            setVisibleMonth(parseCalendarDate(selectedDate));
        }
    }, [selectedDate]);

    function selectDate(date: Date | undefined) {
        if (!date) return;
        const next = formatCalendarDate(date);
        setVisibleMonth(date);
        if (next === currentDate) return;
        if (selectedDate === undefined) setInternalDate(next);
        onSelectedDateChange?.(next);
    }

    return (
        <section aria-label={label} className={cn(
            "@container min-w-0 rounded-sm border border-border " +
            "bg-surface p-[var(--space-4)] text-foreground",
            className,
        )} {...props}>
            <div className="mb-[var(--space-3)] flex flex-wrap items-baseline gap-2">
                <h3 className="m-0 text-base font-semibold">{label}</h3>
                <span className="text-xs text-muted">
                    {monthPrefix} · {monthCount}건
                </span>
            </div>
            <div className="grid min-w-0 gap-[var(--space-4)] @2xl:grid-cols-2">
                <Calendar
                    mode="single" required
                    aria-label={`${label} 날짜`}
                    locale={calendarLocale}
                    navLayout="around"
                    month={visibleMonth}
                    onMonthChange={setVisibleMonth}
                    selected={parseCalendarDate(currentDate)}
                    onSelect={selectDate}
                    modifiers={{ scheduled: Array.from(
                        eventCounts.keys(), parseCalendarDate,
                    ) }}
                    modifiersClassNames={{
                        scheduled: "[&_button]:font-semibold " +
                            "[&_button]:underline " +
                            "[&_button]:decoration-accent " +
                            "[&_button]:decoration-2 " +
                            "[&_button]:underline-offset-4",
                    }}
                    labels={{
                        labelDayButton: (date, modifiers, options, dateLib) => {
                            const base = labelDayButton(
                                date, modifiers, options, dateLib,
                            );
                            const count = eventCounts.get(
                                formatCalendarDate(date),
                            ) ?? 0;
                            return count ? `${base}, 일정 ${count}건` : base;
                        },
                    }}
                />
                <div role="region" aria-label={`${currentDate} 일정`}
                    className="min-w-0 rounded-sm border border-border p-[var(--space-3)]">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <h4 className="m-0 text-sm font-semibold">
                            {currentDate} 일정
                        </h4>
                        {onCreateEvent && (
                            <Button variant="outline"
                                onClick={() => onCreateEvent(currentDate)}>
                                일정 추가
                            </Button>
                        )}
                    </div>
                    {timeZone && (
                        <p className="m-0 mt-1 text-xs text-muted">
                            시간대: {timeZone}
                        </p>
                    )}
                    {dailyEvents.length === 0 ? (
                        <p role="status" className="my-[var(--space-4)] text-sm text-muted">
                            {emptyMessage}
                        </p>
                    ) : (
                        <ul className={
                            "m-0 mt-[var(--space-3)] list-none " +
                            "divide-y divide-border p-0"
                        }>
                            {dailyEvents.map((event) => {
                                const time = event.startTime
                                    ? `${event.startTime}${event.endTime
                                        ? `–${event.endTime}` : ""}`
                                    : "종일";
                                const content = (
                                    <>
                                        <span className="text-xs text-muted">
                                            {time}
                                        </span>
                                        <strong className={
                                            "min-w-0 break-words text-sm " +
                                            "font-medium"
                                        }>
                                            {event.title}
                                        </strong>
                                        {event.description && (
                                            <span className={
                                                "min-w-0 break-words text-xs " +
                                                "text-muted"
                                            }>
                                                {event.description}
                                            </span>
                                        )}
                                    </>
                                );
                                return (
                                    <li key={event.id}>
                                        {onEventSelect ? (
                                            <button type="button"
                                                onClick={() =>
                                                    onEventSelect(event)}
                                                className={
                                                    "grid w-full gap-1 rounded-sm " +
                                                    "px-2 py-3 text-left " +
                                                    "hover:bg-surface-subtle " +
                                                    "focus-visible:outline-2 " +
                                                    "focus-visible:outline-focus"
                                                }>
                                                {content}
                                            </button>
                                        ) : (
                                            <div className="grid gap-1 px-2 py-3">
                                                {content}
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </section>
    );
}

export { CalendarScheduler };
export type { CalendarSchedule, CalendarSchedulerProps };
