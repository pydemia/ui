import type { ComponentProps, ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage, DataTable, type DataTableProps } from "@pydemia/ui";

export type PrismAvatarProps = { name: string; team?: string; description?: string; src?: string; className?: string; showInfo?: boolean };
export function PrismAvatar({ name, team, description, src, className = "", showInfo = true }: PrismAvatarProps) {
    return <div className={`prism-avatar ${className}`}><Avatar className="prism-avatar-image">
        {src && <AvatarImage src={src} alt="" />}<AvatarFallback>{name.trim().slice(0, 1) || "?"}</AvatarFallback></Avatar>
        {showInfo ? <div className="prism-avatar-text"><div><strong title={name}>{name}</strong>{team && <><span className="prism-avatar-divider" aria-hidden="true" /><span title={team}>{team}</span></>}</div>
            {description && <p title={description}>{description}</p>}</div> : <span className="prism-sr-only">{name}</span>}</div>;
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
