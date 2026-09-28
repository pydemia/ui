import type { ComponentProps } from "react";
import { cn } from "./utils";

function Table({ className, ...props }: ComponentProps<"table">) {
    return <table className={cn("w-full border-collapse text-sm", className)} {...props} />;
}

function TableHead({ className, ...props }: ComponentProps<"th">) {
    return (
        <th
            className={cn(
                "border-b border-border px-[var(--space-3)] py-2 text-left font-medium text-muted",
                className,
            )}
            {...props}
        />
    );
}

function TableCell({ className, ...props }: ComponentProps<"td">) {
    return (
        <td
            className={cn("border-b border-border px-[var(--space-3)] py-[var(--density-row-block)]", className)}
            {...props}
        />
    );
}

export { Table, TableHead, TableCell };
