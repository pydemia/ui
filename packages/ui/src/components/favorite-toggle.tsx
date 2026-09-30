import { Star } from "lucide-react";
import { useId, type ComponentProps } from "react";
import { Toggle } from "./toggle";
import { cn } from "./utils";

type FavoriteToggleProps = Omit<
    ComponentProps<typeof Toggle>, "children" | "aria-label"
> & {
    label?: string;
    count?: number;
};

function FavoriteToggle({
    label = "즐겨찾기", count, className, ...props
}: FavoriteToggleProps) {
    const countId = useId();
    if (!label.trim()) throw new Error("FavoriteToggle requires a label.");
    if (count !== undefined &&
        (!Number.isSafeInteger(count) || count < 0)) {
        throw new RangeError("FavoriteToggle count must be a nonnegative integer.");
    }

    return (
        <Toggle aria-label={label}
            aria-describedby={count !== undefined ? countId : undefined}
            className={cn(
                "gap-2 data-[state=on]:[&_svg]:fill-current",
                className,
            )}
            {...props}>
            <Star aria-hidden="true" className="size-4" />
            {count !== undefined && <span id={countId}>{count}명 선택</span>}
        </Toggle>
    );
}

export { FavoriteToggle };
export type { FavoriteToggleProps };
