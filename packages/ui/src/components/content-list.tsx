import type { ComponentProps } from "react";
import { cn } from "./utils";

type ContentListProps = Omit<ComponentProps<"ul">, "type" | "ref"> & {
    variant?: "bullet" | "numbered" | "plain";
};

function ContentList({
    variant = "bullet",
    className,
    ...props
}: ContentListProps) {
    const Element = variant === "numbered" ? "ol" : "ul";

    return (
        <Element
            className={cn(
                "my-0 space-y-1 text-sm leading-relaxed text-foreground",
                variant === "bullet" &&
                    "list-outside list-disc pl-5 marker:text-accent",
                variant === "numbered" &&
                    "list-outside list-decimal pl-5 marker:text-accent",
                variant === "plain" && "list-none pl-0",
                className,
            )}
            {...props}
        />
    );
}

export { ContentList };
export type { ContentListProps };
