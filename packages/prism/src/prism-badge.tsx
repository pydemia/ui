import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { PrismXGlyph as X } from "./prism-icon";

export function PrismElpBadge({ type, className = "", ...props }: ComponentProps<"span"> & { type: "ELP" | "s-ELP" }) {
    return <span {...props} className={`prism-elp ${className}`} data-type={type}>{type}</span>;
}
export function PrismCountBadge({ count, max = 99, children, showZero = false }: { count: number; max?: number; children?: ReactNode; showZero?: boolean }) {
    if (!Number.isSafeInteger(count) || count < 0 || !Number.isSafeInteger(max) || max < 1) throw new RangeError("Count must be a nonnegative integer and max a positive integer.");
    const badge = count || showZero ? <span className="prism-count" aria-label={`${count}건`}>{count > max ? `${max}+` : count}</span> : null;
    return children ? <span className="prism-count-anchor">{children}{badge}</span> : badge;
}
export function PrismTag({ children, variant = "gray", onRemove, label, className = "", ...props }: ComponentProps<"span"> & {
    variant?: "gray" | "blue" | "mainBlue"; onRemove?: () => void; label?: string;
}) {
    if (onRemove && !label) throw new Error("Removable PrismTag requires label.");
    return <span {...props} className={`prism-tag ${className}`} data-variant={variant}>{children}
        {onRemove && <button type="button" aria-label={`${label} 삭제`} onClick={onRemove}><X size={16} aria-hidden="true" /></button>}</span>;
}
export function PrismChip({ children, tone = "primary", color, variant = "soft", ...props }: ComponentProps<"span"> & {
    tone?: "primary" | "success" | "warning" | "danger"; color?: string; variant?: "soft" | "solid";
}) {
    return <span {...props} className={`prism-chip ${props.className ?? ""}`} data-variant={variant}
        style={{ "--chip-tone": color ?? `var(--${tone === "primary" ? "accent" : tone})`, ...props.style } as CSSProperties}>{children}</span>;
}
