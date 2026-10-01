import { Eye, EyeOff } from "lucide-react";
import { useId, useState, type ComponentProps } from "react";
import { IconButton } from "./icon-button";
import { Input } from "./input";
import { cn } from "./utils";

type PasswordInputProps = Omit<ComponentProps<"input">, "type"> & {
    containerClassName?: string;
    visibilityLabel?: string;
};

function PasswordInput({
    id, className, containerClassName,
    visibilityLabel = "비밀번호 표시", disabled, ...props
}: PasswordInputProps) {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [visible, setVisible] = useState(false);

    return (
        <div className={cn("relative w-full", containerClassName)}>
            <Input
                id={inputId}
                type={visible ? "text" : "password"}
                disabled={disabled}
                className={cn("pr-11", className)}
                {...props}
            />
            <IconButton
                type="button"
                variant="ghost"
                disabled={disabled}
                label={visibilityLabel}
                icon={visible ? <EyeOff className="size-4" />
                    : <Eye className="size-4" />}
                aria-pressed={visible}
                aria-controls={inputId}
                className={
                    "absolute right-0 top-0 border-transparent text-muted " +
                    "hover:text-foreground"
                }
                onClick={() => setVisible((current) => !current)}
            />
        </div>
    );
}

export { PasswordInput };
export type { PasswordInputProps };
