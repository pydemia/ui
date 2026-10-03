import type { ComponentProps } from "react";
import { cn } from "./utils";

type CalendarHeatmapDay = {
    date: string;
    value: number | null;
};

type CalendarHeatmapProps = Omit<
    ComponentProps<"figure">, "children" | "title"
> & {
    title: string;
    year: number;
    days: readonly CalendarHeatmapDay[];
    description?: string;
    unit?: string;
    locale?: string;
    formatValue?: (value: number) => string;
    maxValue?: number;
    density?: "compact" | "comfortable";
    appearance?: "panel" | "plain";
    emptyMessage?: string;
};

const millisecondsPerDay = 86_400_000;

function isLeapYear(year: number) {
    return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function CalendarHeatmap({
    title,
    year,
    days,
    description,
    unit = "",
    locale = "ko-KR",
    formatValue = String,
    maxValue,
    density = "compact",
    appearance = "panel",
    emptyMessage = "표시할 활동 데이터가 없습니다.",
    className,
    ...props
}: CalendarHeatmapProps) {
    if (typeof title !== "string" || !title.trim() ||
        !Number.isInteger(year) || year < 1 || year > 9999 ||
        !Array.isArray(days)) {
        throw new Error("CalendarHeatmap requires a title, year, and days.");
    }
    if (density !== "compact" && density !== "comfortable") {
        throw new RangeError("CalendarHeatmap density is not supported.");
    }
    if (appearance !== "panel" && appearance !== "plain") {
        throw new RangeError("CalendarHeatmap appearance is not supported.");
    }

    const paddedYear = String(year).padStart(4, "0");
    const firstDay = new Date(`${paddedYear}-01-01T00:00:00.000Z`);
    const dayCount = isLeapYear(year) ? 366 : 365;
    const firstWeekday = (firstDay.getUTCDay() + 6) % 7;
    const weekCount = Math.ceil((firstWeekday + dayCount) / 7);
    const values = new Map<string, number | null>();
    let observedMax = 0;
    for (const day of days) {
        const parsed = typeof day?.date === "string" &&
            /^\d{4}-\d{2}-\d{2}$/.test(day.date)
            ? new Date(`${day.date}T00:00:00.000Z`) : null;
        if (!parsed || Number.isNaN(parsed.getTime()) ||
            parsed.toISOString().slice(0, 10) !== day.date ||
            parsed.getUTCFullYear() !== year || values.has(day.date) ||
            (day.value !== null &&
                (!Number.isFinite(day.value) || day.value < 0))) {
            throw new RangeError(
                "CalendarHeatmap needs unique dates in the year and " +
                "finite nonnegative values or null.",
            );
        }
        values.set(day.date, day.value);
        if (day.value !== null) {
            observedMax = Math.max(observedMax, day.value);
        }
    }
    if (maxValue !== undefined &&
        (!Number.isFinite(maxValue) || maxValue <= 0 ||
            maxValue < observedMax)) {
        throw new RangeError(
            "CalendarHeatmap maxValue must cover every known value.",
        );
    }
    const scaleMax = maxValue ?? Math.max(observedMax, 1);
    const formatter = new Intl.DateTimeFormat(locale, {
        month: "short", timeZone: "UTC",
    });
    const weekdayFormatter = new Intl.DateTimeFormat(locale, {
        weekday: "narrow", timeZone: "UTC",
    });
    const display = (value: number) => `${formatValue(value)}${unit}`;
    const dates = Array.from({ length: dayCount }, (_, index) => {
        const date = new Date(firstDay.getTime() +
            index * millisecondsPerDay);
        const iso = date.toISOString().slice(0, 10);
        return {
            date,
            iso,
            month: date.getUTCMonth(),
            day: date.getUTCDate(),
            week: Math.floor((firstWeekday + index) / 7) + 1,
            weekday: (firstWeekday + index) % 7 + 1,
            value: values.has(iso) ? values.get(iso)! : 0,
        };
    });
    const monthStarts = dates.filter((date) => date.day === 1);
    const hasMissing = dates.some((date) => date.value === null);
    const step = density === "compact" ? 16 : 20;
    const cell = step - 4;

    return (
        <figure {...props} data-density={density}
            data-appearance={appearance}
            className={cn(
                "m-0 min-w-0 text-foreground",
                appearance === "panel" &&
                    "rounded-sm border border-border bg-surface " +
                    "p-[var(--space-4)]",
                className,
            )}>
            <figcaption className="mb-[var(--space-3)]">
                <strong className="text-sm font-semibold">
                    {title} · {year}
                </strong>
                {description && <p className="mb-0 mt-1 text-xs text-muted">
                    {description}
                </p>}
            </figcaption>
            {days.length === 0 ? (
                <p role="status"
                    className="m-0 py-12 text-center text-sm text-muted">
                    {emptyMessage}
                </p>
            ) : (
                <>
                    <div role="region" tabIndex={0}
                        aria-label={`${title} ${year} 활동 격자`}
                        className="max-w-full overflow-x-auto pb-2">
                        <div className="flex gap-2"
                            style={{ width: 32 + weekCount * step }}>
                            <div aria-hidden="true"
                                className={
                                    "mt-5 grid w-6 shrink-0 " +
                                    "text-[10px] text-muted"
                                }
                                style={{ gridTemplateRows:
                                    `repeat(7, ${step}px)` }}>
                                {Array.from({ length: 7 }, (_, index) => {
                                    const monday = new Date(
                                        "2024-01-01T00:00:00.000Z",
                                    );
                                    monday.setUTCDate(1 + index);
                                    return <span key={index}>
                                        {weekdayFormatter.format(monday)}
                                    </span>;
                                })}
                            </div>
                            <div>
                                <div aria-hidden="true"
                                    className="grid h-5 text-[10px] text-muted"
                                    style={{ gridTemplateColumns:
                                        `repeat(${weekCount}, ${step}px)` }}>
                                    {monthStarts.map((start) => (
                                        <span key={start.month}
                                            className="whitespace-nowrap"
                                            style={{ gridColumnStart: start.week }}>
                                            {formatter.format(start.date)}
                                        </span>
                                    ))}
                                </div>
                                <div aria-hidden="true" className="grid"
                                    style={{
                                        gridTemplateColumns:
                                            `repeat(${weekCount}, ${step}px)`,
                                        gridTemplateRows:
                                            `repeat(7, ${step}px)`,
                                    }}>
                                    {dates.map((date) => {
                                        const ratio = date.value === null
                                            ? null : date.value / scaleMax;
                                        const fill = ratio === null ? undefined :
                                            `color-mix(in srgb, var(--accent) ${
                                                Math.round(8 + ratio * 52)
                                            }%, var(--surface-subtle))`;
                                        return <span key={date.iso}
                                            data-date={date.iso}
                                            data-value={date.value ?? undefined}
                                            data-missing={date.value === null ||
                                                undefined}
                                            title={`${date.iso}: ${
                                                date.value === null
                                                    ? "미수집" : display(date.value)
                                            }`}
                                            className={cn(
                                                "rounded-sm border border-border",
                                                date.value === null &&
                                                    "border-dashed bg-surface-subtle",
                                            )}
                                            style={{
                                                gridColumnStart: date.week,
                                                gridRowStart: date.weekday,
                                                width: cell,
                                                height: cell,
                                                backgroundColor: fill,
                                            }} />;
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={
                        "mt-2 flex flex-wrap items-center " +
                        "gap-2 text-xs text-muted"
                    }>
                        {observedMax > 0 || maxValue !== undefined ? <>
                            <span>0{unit}</span>
                            {[0, 1, 2, 3, 4].map((stepIndex) => (
                                <span key={stepIndex} aria-hidden="true"
                                    className={
                                        "size-3 rounded-sm border border-border"
                                    }
                                    style={{ backgroundColor:
                                        `color-mix(in srgb, var(--accent) ${
                                            8 + stepIndex * 13
                                        }%, var(--surface-subtle))`,
                                    }} />
                            ))}
                            <span>{display(maxValue ?? observedMax)}</span>
                        </> : <span>알려진 기록 0{unit}</span>}
                        {hasMissing && <span>· 미수집 —</span>}
                    </div>
                    <p className="mt-2 text-xs text-muted">
                        목록에 없는 날짜는 0{unit}으로 표시합니다.
                    </p>
                    <details className="mt-3 border-t border-border pt-3">
                        <summary className={
                            "cursor-pointer text-xs font-medium text-accent " +
                            "focus-visible:outline-2 focus-visible:outline-focus"
                        }>
                            날짜별 값 {dayCount}일 보기
                        </summary>
                        <div role="region" tabIndex={0}
                            aria-label={`${title} 날짜별 값 표`}
                            className="mt-2 max-h-48 overflow-auto">
                            <table className="w-full text-left text-xs">
                                <caption className="sr-only">
                                    {title} {year} 날짜별 값
                                </caption>
                                <thead><tr>
                                    <th scope="col" className="pr-4">날짜</th>
                                    <th scope="col">값</th>
                                </tr></thead>
                                <tbody>{dates.map((date) => (
                                    <tr key={date.iso}>
                                        <th scope="row" className="pr-4 font-normal">
                                            <time dateTime={date.iso}>
                                                {date.iso}
                                            </time>
                                        </th>
                                        <td>{date.value === null ? "미수집" :
                                            display(date.value)}</td>
                                    </tr>
                                ))}</tbody>
                            </table>
                        </div>
                    </details>
                </>
            )}
        </figure>
    );
}

export { CalendarHeatmap };
export type { CalendarHeatmapDay, CalendarHeatmapProps };
