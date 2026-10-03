import type { ComponentProps, ReactNode } from "react";
import { Button } from "@pydemia/ui";

export type PrismButtonProps = Omit<ComponentProps<typeof Button>, "variant" | "size"> & {
    variant?: "solid" | "line" | "shape";
    size?: "large" | "medium" | "small" | "x-small";
    tone?: "neutral" | "primary" | "danger";
    icon?: ReactNode;
    iconOnly?: boolean;
    iconPosition?: "left" | "right";
};

/** HRXBtn 규격. Native button 동작과 ref는 pydemia Button에 위임합니다. */
export function PrismButton({ variant = "solid", size = "medium", tone = variant === "solid" ? "primary" : "neutral",
    icon, iconOnly, iconPosition = "left", children, className = "", ...props }: PrismButtonProps) {
    if (iconOnly && !props["aria-label"] && !props["aria-labelledby"]) {
        throw new Error("PrismButton iconOnly requires an accessible name.");
    }
    return <Button {...props} variant={variant === "solid" ? "primary" : variant === "line" ? "outline" : "ghost"}
        className={`prism-button ${className}`} data-size={size} data-variant={variant}
        data-tone={tone} data-icon-only={iconOnly || undefined} data-icon-position={iconPosition}>
        {icon && <span className="prism-button-icon" aria-hidden="true">{icon}</span>}
        {!iconOnly && children}
    </Button>;
}

export function PrismNewChatButton(props: Omit<PrismButtonProps, "variant" | "size">) {
    return <PrismButton {...props} size="large" className={`prism-new-chat ${props.className ?? ""}`} />;
}
