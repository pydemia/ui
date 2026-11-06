import type { ComponentPropsWithoutRef, ReactElement } from "react";

type SvgProps = Omit<ComponentPropsWithoutRef<"svg">,
    "children" | "width" | "height" | "viewBox" | "fill" | "stroke" | "strokeWidth">;

export type MonotoneIconProps<Size extends 16 | 20 | 24 = 16 | 24> =
    SvgProps & { size?: Size };

export function createMonotoneIcon(
    id: string,
    compact: readonly string[],
    regular: readonly string[],
): (props: MonotoneIconProps) => ReactElement;
export function createMonotoneIcon(
    id: string,
    compact: readonly string[],
    regular: readonly string[],
    emphasis: readonly string[],
): (props: MonotoneIconProps<16 | 20 | 24>) => ReactElement;
export function createMonotoneIcon(
    id: string,
    compact: readonly string[],
    regular: readonly string[],
    emphasis?: readonly string[],
) {
    function MonotoneIcon({
        size = 16, role, ...props
    }: MonotoneIconProps<16 | 20 | 24>): ReactElement {
        const paths = size === 16 ? compact : size === 24 ? regular : emphasis;
        if (!paths) throw new RangeError(`${id} has no 20px drawing.`);
        const named = Boolean(props["aria-label"] || props["aria-labelledby"]);
        return <svg {...props} role={role ?? (named ? "img" : undefined)}
            aria-hidden={props["aria-hidden"] ?? (named ? undefined : true)}
            data-icon={id} data-slot="monotone-icon" focusable="false"
            width={size} height={size} viewBox={`0 0 ${size} ${size}`}
            fill="none" stroke="currentColor"
            strokeWidth={size === 16 ? 1.5 : size === 20 ? 2.25 : 2}
            strokeLinecap="round" strokeLinejoin="round">
            {paths.map((d, index) => <path key={index} d={d} />)}
        </svg>;
    }
    MonotoneIcon.displayName = `${id}-icon`;
    return MonotoneIcon;
}
