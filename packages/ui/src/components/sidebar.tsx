import { useId, useState, type ReactNode } from "react";
import { Button } from "./button";
import { IconButton } from "./icon-button";
import {
    Drawer, DrawerClose, DrawerContent, DrawerDescription,
    DrawerTitle, DrawerTrigger,
} from "./drawer";
import { SideNav, SideNavLink } from "./navigation";
import { cn } from "./utils";

type SidebarItem = {
    id: string;
    label: string;
    href: string;
    icon?: ReactNode;
    current?: boolean;
};

type SidebarSection = {
    id: string;
    label: string;
    items: readonly SidebarItem[];
};

type SidebarProps = ({
    items: readonly SidebarItem[];
    sections?: never;
} | {
    items?: never;
    sections: readonly SidebarSection[];
}) & {
    label: string;
    side?: "left" | "right";
    collapsed?: boolean;
    defaultCollapsed?: boolean;
    onCollapsedChange?: (collapsed: boolean) => void;
    mobileOpen?: boolean;
    defaultMobileOpen?: boolean;
    onMobileOpenChange?: (open: boolean) => void;
    onNavigate?: (id: string) => void;
    className?: string;
};

function Sidebar({
    label,
    items,
    sections,
    side = "left",
    collapsed,
    defaultCollapsed = false,
    onCollapsedChange,
    mobileOpen,
    defaultMobileOpen = false,
    onMobileOpenChange,
    onNavigate,
    className,
}: SidebarProps) {
    if (typeof label !== "string" || !label.trim()) {
        throw new Error("Sidebar requires a label and named links.");
    }
    if ((items === undefined) === (sections === undefined) ||
        (items !== undefined && !Array.isArray(items)) ||
        (sections !== undefined && !Array.isArray(sections))) {
        throw new Error("Sidebar requires items or sections, not both.");
    }
    if (sections?.some((section) =>
        !section || typeof section.id !== "string" || !section.id.trim() ||
        typeof section.label !== "string" || !section.label.trim() ||
        !Array.isArray(section.items) || section.items.length === 0
    ) || (sections && new Set(sections.map((section) => section.id)).size !==
        sections.length)) {
        throw new Error("Sidebar sections need unique IDs, labels, and links.");
    }
    const links = items ?? sections!.flatMap((section) => section.items);
    if (links.some((item) =>
        !item || typeof item.id !== "string" || !item.id.trim() ||
        typeof item.label !== "string" || !item.label.trim() ||
        typeof item.href !== "string" || !item.href.trim()
    )) {
        throw new Error("Sidebar requires a label and named links.");
    }
    if (new Set(links.map((item) => item.id)).size !== links.length) {
        throw new Error("Sidebar item ids must be unique.");
    }

    const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
    const [internalMobileOpen, setInternalMobileOpen] = useState(
        defaultMobileOpen,
    );
    const navId = useId();
    const isCollapsed = collapsed ?? internalCollapsed;
    const isMobileOpen = mobileOpen ?? internalMobileOpen;

    function changeCollapsed(next: boolean) {
        if (collapsed === undefined) setInternalCollapsed(next);
        onCollapsedChange?.(next);
    }

    function changeMobileOpen(next: boolean) {
        if (mobileOpen === undefined) setInternalMobileOpen(next);
        onMobileOpenChange?.(next);
    }

    function link(item: SidebarItem, compact: boolean, mobile = false) {
        return (
            <SideNavLink
                key={item.id}
                href={item.href}
                aria-current={item.current ? "page" : undefined}
                title={compact ? item.label : undefined}
                className={cn(
                    "flex items-center gap-3 whitespace-nowrap",
                    compact && "justify-center px-2",
                )}
                onClick={() => {
                    onNavigate?.(item.id);
                    if (mobile) changeMobileOpen(false);
                }}
            >
                <span aria-hidden="true" className={
                    "grid size-5 shrink-0 place-items-center text-xs font-semibold"
                }>
                    {item.icon ?? Array.from(item.label)[0]}
                </span>
                <span className={compact ? "sr-only" : undefined}>
                    {item.label}
                </span>
            </SideNavLink>
        );
    }

    function navigation(compact: boolean, mobile = false) {
        if (!sections) return links.map((item) => link(item, compact, mobile));
        return sections.map((section, index) => {
            const headingId = `${navId}-${mobile ? "mobile" : "desktop"}-${index}`;
            return (
                <div key={section.id} role="group" aria-labelledby={headingId}
                    className={cn("grid gap-1", index > 0 && "mt-2 border-t border-border pt-2")}>
                    <h3 id={headingId} className={cn(
                        "m-0 px-3 pb-1 pt-2 text-xs font-semibold text-muted",
                        compact && "sr-only",
                    )}>
                        {section.label}
                    </h3>
                    {section.items.map((item) => link(item, compact, mobile))}
                </div>
            );
        });
    }

    return (
        <>
            <aside className={cn(
                "hidden min-h-0 shrink-0 flex-col border-border " +
                "bg-surface-subtle text-foreground " +
                "transition-[width] duration-[var(--motion-fast)] " +
                "motion-reduce:transition-none @3xl:flex",
                isCollapsed ? "w-16" : "w-56",
                side === "left" ? "border-r" : "border-l",
                side === "right" && "order-last",
                className,
            )}>
                <div className={cn(
                    "flex min-h-14 items-center gap-2 border-b border-border p-2",
                    isCollapsed ? "justify-center" : "justify-between",
                )}>
                    {!isCollapsed && (
                        <strong className="min-w-0 truncate px-2 text-sm">
                            {label}
                        </strong>
                    )}
                    <IconButton
                        variant="ghost"
                        label={isCollapsed ? "탐색 펼치기" : "탐색 접기"}
                        icon={<span className="text-lg leading-none">
                            {side === "left"
                                ? isCollapsed ? "»" : "«"
                                : isCollapsed ? "«" : "»"}
                        </span>}
                        aria-expanded={!isCollapsed}
                        aria-controls={navId}
                        onClick={() => changeCollapsed(!isCollapsed)}
                    />
                </div>
                <SideNav id={navId} aria-label={label}
                    className="min-h-0 flex-1 content-start overflow-y-auto p-2">
                    {navigation(isCollapsed)}
                </SideNav>
            </aside>
            <div className="p-2 @3xl:hidden">
                <Drawer open={isMobileOpen} onOpenChange={changeMobileOpen}>
                    <DrawerTrigger asChild>
                        <Button variant="outline" aria-label={`${label} 열기`}>
                            <span aria-hidden="true">☰</span> 탐색
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent side={side}
                        className="flex w-[min(20rem,calc(100vw-2rem))] flex-col p-0">
                        <div className={
                            "flex items-center justify-between gap-2 " +
                            "border-b border-border p-[var(--space-3)]"
                        }>
                            <DrawerTitle className="text-sm font-semibold">
                                {label}
                            </DrawerTitle>
                            <DrawerDescription className="sr-only">
                                페이지 탐색 링크를 선택합니다.
                            </DrawerDescription>
                            <DrawerClose asChild>
                                <Button variant="ghost" aria-label="탐색 닫기">
                                    닫기
                                </Button>
                            </DrawerClose>
                        </div>
                        <SideNav aria-label={label}
                            className="content-start overflow-y-auto p-2">
                            {navigation(false, true)}
                        </SideNav>
                    </DrawerContent>
                </Drawer>
            </div>
        </>
    );
}

export { Sidebar };
export type { SidebarItem, SidebarSection, SidebarProps };
