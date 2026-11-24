import type { ComponentProps, ReactNode } from "react";
import { AppBody, AppHeader, AppMain, AppShell } from "./app-shell";
import { RightPanel, type RightPanelProps } from "./right-panel";

type NavigationShellProps = Omit<ComponentProps<typeof AppShell>, "children"> & {
    globalNav?: ReactNode;
    localNav?: ReactNode;
    sideNav?: ReactNode;
    rightPanel?: RightPanelProps;
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
                    {rightPanel && <RightPanel {...rightPanel} />}
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
