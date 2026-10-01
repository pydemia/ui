import * as TabsPrimitive from "@radix-ui/react-tabs";
import { createContext, useContext, type ComponentProps } from "react";
import { cn } from "./utils";

const Tabs = TabsPrimitive.Root;
type TabsVariant = "default" | "line" | "contained";
type TabsListProps = ComponentProps<typeof TabsPrimitive.List> & {
    variant?: TabsVariant;
};
const TabsVariantContext = createContext<TabsVariant>("default");

function TabsList({ className, variant = "default", ...props }: TabsListProps) {
    if (variant !== "default" && variant !== "line" &&
        variant !== "contained") {
        throw new RangeError("TabsList variant is not supported.");
    }

    return (
        <TabsVariantContext.Provider value={variant}>
            <TabsPrimitive.List
                className={cn(
                    "inline-flex gap-1",
                    variant === "line" && "border-b border-border",
                    variant === "contained" &&
                        "rounded-sm bg-surface-subtle p-1",
                    className,
                )}
                {...props}
                data-variant={variant}
            />
        </TabsVariantContext.Provider>
    );
}

function TabsTrigger({ className, ...props }: ComponentProps<typeof TabsPrimitive.Trigger>) {
    const variant = useContext(TabsVariantContext);
    return (
        <TabsPrimitive.Trigger
            className={cn(
                "px-3 py-1.5 text-sm text-muted hover:text-foreground " +
                "data-[state=active]:font-medium",
                variant === "line"
                    ? "-mb-px border-b-2 border-transparent " +
                        "data-[state=active]:border-accent " +
                        "data-[state=active]:text-foreground"
                    : "rounded-sm data-[state=active]:bg-surface " +
                        "data-[state=active]:text-foreground",
                variant === "contained" &&
                    "data-[state=active]:shadow-sm",
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
export type { TabsListProps, TabsVariant };
