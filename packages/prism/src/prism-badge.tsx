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
export function PrismTag({ children, variant = "gray", onRemove, label, wrap = false, className = "", ...props }: ComponentProps<"span"> & {
    variant?: "gray" | "blue" | "mainBlue"; onRemove?: () => void; label?: string; wrap?: boolean;
}) {
    if (onRemove && !label) throw new Error("Removable PrismTag requires label.");
    return <span {...props} className={`prism-tag ${className}`} data-variant={variant} data-wrap={wrap || undefined}>{children ?? label}
        {onRemove && <button type="button" aria-label={`${label} 삭제`} onClick={onRemove}><X size={16} aria-hidden="true" /></button>}</span>;
}
export function PrismChip({ children, label, tone = "primary", color, variant = "soft", wrap = false, ...props }: ComponentProps<"span"> & {
    label?: string; tone?: "neutral" | "primary" | "success" | "warning" | "danger"; color?: string; variant?: "soft" | "solid"; wrap?: boolean;
}) {
    return <span {...props} className={`prism-chip ${props.className ?? ""}`} data-variant={variant}
        data-wrap={wrap || undefined} data-tone={color ? undefined : tone}
        style={{ "--chip-tone": color ?? (tone === "neutral" ? "rgba(34,34,34,.14)" : `var(--${tone === "primary" ? "accent" : tone})`), ...props.style } as CSSProperties}>{children ?? label}</span>;
}
