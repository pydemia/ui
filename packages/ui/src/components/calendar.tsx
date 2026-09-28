import { DayPicker, getDefaultClassNames } from "react-day-picker";
import type { ComponentProps } from "react";
import { cn } from "./utils";

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: ComponentProps<typeof DayPicker>) {
    const defaults = getDefaultClassNames();

    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn(
                "relative w-fit rounded-sm border border-border bg-surface p-3",
                className,
            )}
            classNames={{
                months: cn("flex flex-col gap-4 sm:flex-row", defaults.months),
                month: cn("relative space-y-3", defaults.month),
                month_caption: cn("flex h-9 items-center justify-center", defaults.month_caption),
                caption_label: cn("text-sm font-medium", defaults.caption_label),
                nav: cn(
                    "flex h-9 items-center justify-between",
                    defaults.nav,
                ),
                button_previous: cn(
                    "flex size-9 items-center justify-center rounded-sm " +
                    "hover:bg-surface-subtle disabled:opacity-50",
                    defaults.button_previous,
                ),
                button_next: cn(
                    "flex size-9 items-center justify-center rounded-sm " +
                    "hover:bg-surface-subtle disabled:opacity-50",
                    defaults.button_next,
                ),
                month_grid: cn("w-full border-collapse", defaults.month_grid),
                weekdays: cn("flex", defaults.weekdays),
                weekday: cn("w-9 text-center text-xs text-muted", defaults.weekday),
                week: cn("flex", defaults.week),
                day: cn("size-9 p-0 text-center", defaults.day),
                day_button: cn(
                    "size-9 rounded-sm text-sm hover:bg-surface-subtle " +
                    "disabled:opacity-50",
                    defaults.day_button,
                ),
                selected: cn(
                    "[&_button]:bg-accent [&_button]:text-accent-foreground",
                    defaults.selected,
                ),
                today: cn("[&_button]:font-bold", defaults.today),
                outside: cn("[&_button]:text-muted", defaults.outside),
                disabled: cn("[&_button]:opacity-50", defaults.disabled),
                hidden: cn("invisible", defaults.hidden),
                ...classNames,
            }}
            {...props}
        />
    );
}

export { Calendar };
