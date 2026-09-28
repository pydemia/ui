import { ChevronRight, MoreHorizontal } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "./utils";

function Breadcrumb({ className, ...props }: ComponentProps<"nav">) {
    return <nav aria-label="breadcrumb" className={cn("text-sm", className)} {...props} />;
}

function BreadcrumbList({ className, ...props }: ComponentProps<"ol">) {
    return (
        <ol
            className={cn("flex flex-wrap items-center gap-2", className)}
            {...props}
        />
    );
}

function BreadcrumbItem({ className, ...props }: ComponentProps<"li">) {
    return <li className={cn("inline-flex items-center", className)} {...props} />;
}

function BreadcrumbLink({ className, ...props }: ComponentProps<"a">) {
    return (
        <a
            className={cn("text-muted underline-offset-4 hover:underline", className)}
            {...props}
        />
    );
}

function BreadcrumbPage({ className, ...props }: ComponentProps<"span">) {
    return (
        <span
            aria-current="page"
            className={cn("font-medium text-foreground", className)}
            {...props}
        />
    );
}

function BreadcrumbSeparator({
    className,
    children,
    ...props
}: ComponentProps<"li">) {
    return (
        <li
            role="presentation"
            aria-hidden="true"
            className={cn("text-muted [&_svg]:size-4", className)}
            {...props}
        >
            {children ?? <ChevronRight className="rtl:rotate-180" />}
        </li>
    );
}

function BreadcrumbEllipsis({ className, ...props }: ComponentProps<"span">) {
    return (
        <span
            aria-hidden="true"
            className={cn("inline-flex text-muted", className)}
            {...props}
        >
            <MoreHorizontal className="size-4" />
        </span>
    );
}

export {
    Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink,
    BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis,
};
