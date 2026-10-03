import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage, DataTable, TooltipProvider, Tooltip, TooltipTrigger, type DataTableProps } from "@pydemia/ui";
import { PrismTooltipContent } from "./prism-utility";

export type PrismAvatarProps = Omit<ComponentProps<"div">, "children"> & { name: string; team?: string; description?: string; src?: string; showInfo?: boolean };
type AvatarLayout = "natural" | "name-truncate" | "team-truncate" | "both-truncate";
function AvatarText({ as: Tag, text, className, truncated, elementRef }: { as: "strong" | "span"; text: string; className: string; truncated: boolean; elementRef: (element: HTMLElement | null) => void }) {
    const [open, setOpen] = useState(false);
    useEffect(() => { if (!truncated) setOpen(false); }, [truncated]);
    const label = <Tag ref={elementRef} className={className} tabIndex={truncated ? 0 : undefined}>{text}</Tag>;
    return <Tooltip open={truncated && open} onOpenChange={next => setOpen(truncated && next)}><TooltipTrigger asChild>{label}</TooltipTrigger><PrismTooltipContent side="top" align="start">{text}</PrismTooltipContent></Tooltip>;
}
export function PrismAvatar({ name, team, description, src, className = "", showInfo = true, ...props }: PrismAvatarProps) {
    const info = useRef<HTMLDivElement>(null);
    const nameText = useRef<HTMLElement>(null); const teamText = useRef<HTMLElement>(null);
    const [layout, setLayout] = useState<{ mode: AvatarLayout; name: boolean; team: boolean }>({ mode: "natural", name: false, team: false });
    useEffect(() => {
        if (!showInfo || !info.current || !nameText.current) return;
        let active = true;
        const measure = () => {
            if (!active || !info.current || !nameText.current) return;
            const nameWidth = nameText.current.scrollWidth; const teamWidth = teamText.current?.scrollWidth ?? 0;
            const available = Math.max(0, info.current.clientWidth - (team ? 13 : 0)); // 1px divider and two 6px gaps.
            let mode: AvatarLayout = "natural";
            if (team && nameWidth + teamWidth > available) {
                mode = Math.min(nameWidth, teamWidth) > available / 2 ? "both-truncate" : nameWidth > teamWidth ? "name-truncate" : "team-truncate";
            }
            const next = { mode, name: nameWidth > nameText.current.clientWidth, team: teamWidth > (teamText.current?.clientWidth ?? 0) };
            setLayout(previous => previous.mode === next.mode && previous.name === next.name && previous.team === next.team ? previous : next);
        };
        const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(measure);
        for (const element of [info.current, nameText.current, teamText.current]) if (element) observer?.observe(element);
        window.addEventListener("resize", measure);
        document.fonts?.addEventListener("loadingdone", measure);
        void document.fonts?.ready.then(measure);
        measure();
        return () => { active = false; observer?.disconnect(); window.removeEventListener("resize", measure); document.fonts?.removeEventListener("loadingdone", measure); };
    }, [name, team, description, showInfo]);
    return <TooltipProvider><div {...props} className={`prism-avatar ${className}`}><Avatar className="prism-avatar-image" aria-hidden="true">
        {src && <AvatarImage src={src} alt="" />}<AvatarFallback>{name.trim().slice(0, 1) || "?"}</AvatarFallback></Avatar>
        {showInfo ? <div className="prism-avatar-text"><div ref={info} data-info-layout={layout.mode}><AvatarText as="strong" text={name} className="prism-avatar-name" truncated={layout.name} elementRef={element => { nameText.current = element; }} />{team && <><span className="prism-avatar-divider" aria-hidden="true" /><AvatarText as="span" text={team} className="prism-avatar-team" truncated={layout.team} elementRef={element => { teamText.current = element; }} /></>}</div>
            {description && <p title={description}>{description}</p>}</div> : <span className="prism-sr-only">{name}</span>}</div></TooltipProvider>;
}
export function PrismProfileChip({ name, src, small, readOnly, ...props }: ComponentProps<"button"> & { name: string; src?: string; small?: boolean; readOnly?: boolean }) {
    return <button {...props} disabled={props.disabled || readOnly} type={props.type ?? "button"} className={`prism-profile-chip ${props.className ?? ""}`} data-small={small || undefined} data-readonly={readOnly || undefined}>
        <Avatar className="prism-profile-chip-image" aria-hidden="true">{src && <AvatarImage src={src} alt="" />}<AvatarFallback /></Avatar>{name}</button>;
}
export function PrismAnchorChip({ selected, small, interactive=true, children, ...props }: ComponentProps<"button"> & { selected: boolean; small?: boolean;interactive?:boolean }) {
    if(!interactive)return <span className={`prism-anchor-chip ${props.className??""}`} data-small={small||undefined} data-static="true" data-selected={selected||undefined}>{children}</span>;
    return <button {...props} type={props.type ?? "button"} className={`prism-anchor-chip ${props.className ?? ""}`} data-small={small||undefined} aria-pressed={selected}>{children}</button>;
}
export function PrismTable({ caption, children, className = "", ...props }: ComponentProps<"table"> & { caption: string }) {
    return <div className="prism-table-scroll" role="region" aria-label={caption} tabIndex={0}><table {...props} className={`prism-table ${className}`}>
        <caption>{caption}</caption>{children}</table></div>;
}
export function PrismDataTable<Row>(props: DataTableProps<Row>) {
    return <DataTable {...props} className={`prism-data-table ${props.className ?? ""}`} />;
}
export function PrismSection({ title, children, actions }: { title: string; children: ReactNode; actions?: ReactNode }) {
    return <section className="prism-section"><header><h3>{title}</h3>{actions}</header>{children}</section>;
}
