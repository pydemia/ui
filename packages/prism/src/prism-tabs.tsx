import { Tabs, TabsList, TabsTrigger, TabsContent } from "@pydemia/ui";
import { X } from "lucide-react";
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

export type PrismClosableTabTriggerProps = Omit<ComponentProps<typeof TabsTrigger>, "children"> & {
    label: string;
    onClose: (value: string) => void;
    closeDisabled?: boolean;
};

export function PrismClosableTabTrigger({ label, value, onClose, closeDisabled = false, disabled = false, className = "", ...props }: PrismClosableTabTriggerProps) {
    return <span className="prism-tab-closable">
        <PrismTabsTrigger {...props} value={value} disabled={disabled} className={className} title={label}>{label}</PrismTabsTrigger>
        <button
            type="button"
            className="prism-tab-close"
            aria-label={`${label} 닫기`}
            disabled={disabled || closeDisabled}
            onClick={event => {
                const list = event.currentTarget.closest('[role="tablist"]');
                onClose(value);
                requestAnimationFrame(() => {
                    const active = list?.querySelector<HTMLElement>('[role="tab"][data-state="active"]');
                    active?.focus();
                });
            }}
        ><X size={16} aria-hidden="true" /></button>
    </span>;
}
