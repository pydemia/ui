import { isValidElement, type ReactElement } from "react";
import { Button, type ButtonProps } from "./button";

type IconButtonProps = Omit<
    ButtonProps,
    "aria-label" | "aria-labelledby" | "children" | "size"
> & {
    label: string;
    icon: ReactElement | string;
};

function IconButton({
    label, icon, variant = "ghost", ...props
}: IconButtonProps) {
    if (typeof label !== "string" || !label.trim()) {
        throw new Error("IconButton requires a label.");
    }
    if (typeof icon === "string" ? !icon.trim() : !isValidElement(icon)) {
        throw new Error("IconButton requires an icon.");
    }

    return (
        <Button {...props} variant={variant} size="icon" aria-label={label}>
            <span aria-hidden="true" className="inline-flex items-center">
                {icon}
            </span>
        </Button>
    );
}

export { IconButton };
export type { IconButtonProps };
