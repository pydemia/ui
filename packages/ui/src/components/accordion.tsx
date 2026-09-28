import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "./utils";

const Accordion = AccordionPrimitive.Root;

function AccordionItem({ className, ...props }: ComponentProps<typeof AccordionPrimitive.Item>) {
    return (
        <AccordionPrimitive.Item
            className={cn("border-b border-border", className)}
            {...props}
        />
    );
}

function AccordionTrigger({
    className,
    children,
    ...props
}: ComponentProps<typeof AccordionPrimitive.Trigger>) {
    return (
        <AccordionPrimitive.Header className="flex">
            <AccordionPrimitive.Trigger
                className={cn(
                    "group flex min-h-[var(--control-height)] flex-1 items-center " +
                    "justify-between gap-2 py-[var(--space-2)] text-left " +
                    "font-medium disabled:opacity-50",
                    className,
                )}
                {...props}
            >
                {children}
                <ChevronDown
                    aria-hidden="true"
                    className={"size-4 shrink-0 transition-transform " +
                        "duration-[var(--motion-fast)] " +
                        "group-data-[state=open]:rotate-180"}
                />
            </AccordionPrimitive.Trigger>
        </AccordionPrimitive.Header>
    );
}

function AccordionContent({
    className,
    ...props
}: ComponentProps<typeof AccordionPrimitive.Content>) {
    return (
        <AccordionPrimitive.Content
            className={cn("overflow-hidden pb-[var(--space-3)] text-sm", className)}
            {...props}
        />
    );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
