import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Drawer, DrawerTrigger, DrawerContent, DrawerTitle, DrawerDescription, DrawerClose } from "@pydemia/ui";
import { PrismButton } from "./prism-button";
import { PrismIcon } from "./prism-icon";

export type PrismWorkspaceProps = {
    sidebar: ReactNode; header: ReactNode; children: ReactNode; panel?: ReactNode; className?: string;
    height?: CSSProperties["height"]; minHeight?: CSSProperties["minHeight"];
    responsive?: boolean; breakpoint?: number; navigationOpen?: boolean; onNavigationOpenChange?: (open: boolean) => void;
};
export function PrismWorkspace({ sidebar, header, children, panel, className, height = 760, minHeight = 440,
    responsive = true, breakpoint = 768, navigationOpen, onNavigationOpenChange }: PrismWorkspaceProps) {
    if(!Number.isFinite(breakpoint)||breakpoint<=0)throw new RangeError("Workspace breakpoint must be positive.");
    const shell=useRef<HTMLDivElement>(null);const headerElement=useRef<HTMLElement>(null);const [compact,setCompact]=useState(false);const [internalOpen,setInternalOpen]=useState(false);
    const menuOpen=navigationOpen??internalOpen;
    const setMenuOpen=(next:boolean)=>{if(navigationOpen===undefined)setInternalOpen(next);onNavigationOpenChange?.(next);};
    useEffect(()=>{const element=shell.current;if(!element)return;const measure=()=>setCompact(responsive&&element.getBoundingClientRect().width<breakpoint);measure();const observer=new ResizeObserver(measure);observer.observe(element);return()=>observer.disconnect();},[responsive,breakpoint]);
    useEffect(()=>{if(!compact&&menuOpen){setMenuOpen(false);headerElement.current?.focus();}},[compact,menuOpen]);
    return <div ref={shell} className={`prism-workspace ${className ?? ""}`} data-compact={compact||undefined} style={{height,minHeight}}>
        <div className="prism-workspace-sidebar" hidden={compact}>{sidebar}</div>
        <div className="prism-workspace-main"><header ref={headerElement} tabIndex={-1} className="prism-workspace-header">
            {compact&&<Drawer open={menuOpen} onOpenChange={setMenuOpen}><DrawerTrigger asChild><PrismButton variant="shape" iconOnly aria-label="탐색 메뉴 열기" icon={<PrismIcon name="AdminIcon" size={20}/>} /></DrawerTrigger>
                <DrawerContent side="left" data-prism="light" className="prism-mobile-navigation"><header><DrawerTitle>PRISM 탐색</DrawerTitle><DrawerClose asChild><PrismButton variant="shape" iconOnly aria-label="탐색 메뉴 닫기" icon={<PrismIcon name="CloseIcon" size={20}/>} /></DrawerClose></header>
                    <DrawerDescription className="prism-sr-only">메뉴를 선택하거나 Escape로 닫을 수 있습니다.</DrawerDescription><div>{sidebar}</div></DrawerContent></Drawer>}
            {header}</header><div className="prism-workspace-body"><div className="prism-workspace-content">{children}</div>{panel}</div></div></div>;
}
