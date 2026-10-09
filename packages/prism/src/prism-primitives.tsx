import { useId, type CSSProperties, type ReactNode } from "react";
import { PrismIcon } from "./prism-icon";
import { PrismChevronDownGlyph as ChevronDown, PrismStarGlyph as Star } from "./prism-icon";
import { Popover, PopoverTrigger, PopoverContent } from "@pydemia/ui";
import { PrismButton } from "./prism-button";
import { PrismInfoTooltip } from "./prism-utility";

export function PrismAffiliateLogo({ brand, affiliate, size = 48 }: { brand?: string; affiliate: string; size?: number | string }) {
    return <span className="prism-affiliate" style={{fontSize:size}}>{brand && <b>{brand}</b>}<span>{affiliate}</span></span>;
}
export function PrismSidebarProfile({ name, email, collapsed }: { name: string; email: string; collapsed?: boolean }) {
    return <div className="prism-sidebar-profile"><span aria-hidden="true">{name.trim().slice(0,1) || "?"}</span>{!collapsed && <div><strong>{name}</strong><small>{email}</small></div>}{collapsed && <span className="prism-sr-only">{name}</span>}</div>;
}
export type PrismInputLabelProps = {
    children: ReactNode; required?: boolean; htmlFor?: string; suffix?: ReactNode; tooltip?: string; tooltipLabel?: string;
    className?: string; style?: CSSProperties;
};
export function PrismInputLabel({ children, required, htmlFor, suffix, tooltip, tooltipLabel, className = "", style }: PrismInputLabelProps) {
    const text = <>{children}{required && <span className="prism-input-required" aria-hidden="true">*</span>}{required && <span className="prism-sr-only">필수</span>}{suffix}</>;
    if (!tooltip?.trim()) return <label className={`prism-input-label ${className}`} style={style} htmlFor={htmlFor}>{text}</label>;
    return <span className={`prism-input-label ${className}`} style={style}>
        <label className="prism-input-label-text" htmlFor={htmlFor}>{text}</label>
        <PrismInfoTooltip label={tooltipLabel ?? (typeof children === "string" ? `${children} 설명` : "입력 항목 설명")} content={tooltip}
            side="bottom" arrow={false} contentProps={{className:"prism-label-tooltip",sideOffset:14}}/>
    </span>;
}
export function PrismSkeleton({ width = "100%", height = 16, radius = 4 }: { width?: CSSProperties["width"]; height?: CSSProperties["height"]; radius?: number }) {
    return <span className="prism-skeleton" aria-hidden="true" style={{width,height,borderRadius:radius}} />;
}
export function PrismSkeletonGroup({ label = "불러오는 중", rows = 3, height = 120 }: { label?: string; rows?: number; height?: CSSProperties["height"] }) {
    return <div className="prism-skeleton-group" role="status" aria-label={label}>{Array.from({length:Math.max(1,Math.min(20,rows))},(_,i) => <PrismSkeleton key={i} width="100%" height={height} radius={8} />)}<span className="prism-sr-only">{label}</span></div>;
}
export function PrismPopover({ trigger, children, open, onOpenChange }: { trigger: ReactNode; children: ReactNode; open?: boolean; onOpenChange?: (open: boolean) => void }) {
    return <Popover open={open} onOpenChange={onOpenChange}><PopoverTrigger asChild>{trigger}</PopoverTrigger><PopoverContent data-prism="light" className="prism-popover">{children}</PopoverContent></Popover>;
}
export function PrismFavoriteToggle({ name, checked, onCheckedChange, disabled }: { name: string; checked: boolean; onCheckedChange: (checked: boolean) => void; disabled?: boolean }) {
    return <button type="button" className="prism-favorite-toggle" aria-label={`${name} 즐겨찾기`} aria-pressed={checked} disabled={disabled} onClick={() => onCheckedChange(!checked)}><Star aria-hidden="true" fill={checked ? "currentColor" : "none"} /></button>;
}
export function PrismShowMore({ expanded, hiddenCount, onExpandedChange, children, label = "더보기" }: { expanded: boolean; hiddenCount: number; onExpandedChange: (expanded: boolean) => void; children?: ReactNode; label?: string }) {
    const id = useId(); return <div className="prism-show-more">{children && <div id={id} hidden={!expanded}>{children}</div>}<PrismButton variant="line" size="large" aria-expanded={expanded} aria-controls={children ? id : undefined} icon={<ChevronDown style={{transform:expanded ? "rotate(180deg)" : undefined}} />} iconPosition="right" onClick={() => onExpandedChange(!expanded)}>{expanded ? "접기" : `${label} (${hiddenCount})`}</PrismButton></div>;
}
export function PrismFloatingChatButton({ onClick, right = 40, bottom = 40 }: { onClick: () => void; right?: CSSProperties["right"]; bottom?: CSSProperties["bottom"] }) {
    return <button className="prism-floating-chat" type="button" aria-label="대화 열기" style={{right,bottom}} onClick={onClick}><PrismIcon name="SymbolIcon" size={30} /></button>;
}
export function PrismDragOverlay({ active, label = "파일을 놓아 첨부하세요." }: { active: boolean; label?: string }) {
    return active ? <div className="prism-drag-overlay" role="status">{label}</div> : null;
}
