import type { ComponentProps, ReactNode } from "react";
import { AppBody, AppHeader, AppMain, AppShell, AppSidebar } from "./app-shell";
import { cn } from "./utils";

type NavigationShellProps = Omit<ComponentProps<typeof AppShell>, "children"> & {
    globalNav?: ReactNode;
    localNav?: ReactNode;
    sideNav?: ReactNode;
    rightPanel?: Omit<ComponentProps<typeof AppSidebar>, "side">;
    footerNav?: ReactNode;
    mobileNav?: ReactNode;
    mainProps?: Omit<ComponentProps<typeof AppMain>, "children">;
    children: ReactNode;
};

function NavigationShell({
    globalNav, localNav, sideNav, rightPanel, footerNav, mobileNav,
    mainProps, children, ...props
}: NavigationShellProps) {
    return (
        <AppShell {...props}>
            {globalNav && <AppHeader data-slot="global-navigation" className="min-w-0 flex-wrap py-1.5">
                {globalNav}
            </AppHeader>}
            <AppBody>
                {sideNav}
                <div className="flex min-w-0 flex-1 flex-col @5xl:flex-row">
                    <div className="flex min-w-0 flex-1 flex-col">
                        {localNav}
                        <AppMain {...mainProps}>{children}</AppMain>
                    </div>
                    {rightPanel && (
                        <AppSidebar {...rightPanel} side="right" data-panel-side="right"
                            className={cn(
                                "@3xl:w-auto @5xl:w-52",
                                rightPanel.appearance !== "inset" &&
                                    "border-b-0 border-t @3xl:border-l-0 @5xl:border-t-0 @5xl:border-l",
                                rightPanel.className,
                            )} />
                    )}
                </div>
            </AppBody>
            {mobileNav && <div className="@3xl:hidden" data-slot="mobile-navigation">{mobileNav}</div>}
            {footerNav && <footer className="min-w-0 border-t border-border bg-surface"
                data-slot="footer-navigation">{footerNav}</footer>}
        </AppShell>
    );
}

export { NavigationShell };
export type { NavigationShellProps };
