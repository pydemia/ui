import * as TabsPrimitive from "@radix-ui/react-tabs";
import type { ComponentProps } from "react";
import { cn } from "./utils";

const Tabs = TabsPrimitive.Root;

function TabsList({ className, ...props }: ComponentProps<typeof TabsPrimitive.List>) {
    return (
        <TabsPrimitive.List
            className={cn("inline-flex gap-1", className)}
            {...props}
        />
    );
}

function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
    return (
        <TabsPrimitive.Trigger
            className={cn(
                "rounded-sm px-3 py-1.5 text-sm text-muted " +
                "hover:text-foreground data-[state=active]:bg-surface " +
                "data-[state=active]:font-medium data-[state=active]:text-foreground",
                className,
            )}
            {...props}
        />
    );
}

function TabsContent({ className, ...props }: ComponentProps<typeof TabsPrimitive.Content>) {
    return <TabsPrimitive.Content className={cn(className)} {...props} />;
}

export { Tabs, TabsList, TabsTrigger, TabsContent };
