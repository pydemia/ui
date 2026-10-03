import { Tabs, TabsList, TabsTrigger, TabsContent } from "@pydemia/ui";
import type { ComponentProps } from "react";

export function PrismTabs({className="",...props}:ComponentProps<typeof Tabs>) {
    return <Tabs {...props} className={`prism-tabs-root ${className}`}/>;
}
export function PrismTabsContent({className="",...props}:ComponentProps<typeof TabsContent>) {
    return <TabsContent {...props} className={`prism-tabs-content ${className}`}/>;
}
export function PrismTabsList({ variant = "line", className = "", ...props }: Omit<ComponentProps<typeof TabsList>, "variant"> & { variant?: "line" | "fill" }) {
    return <TabsList {...props} variant={variant === "line" ? "line" : "contained"} className={`prism-tabs ${className}`} data-prism-variant={variant} />;
}
export function PrismTabsTrigger({ className = "", ...props }: ComponentProps<typeof TabsTrigger>) {
    return <TabsTrigger {...props} className={`prism-tab ${className}`} />;
}
