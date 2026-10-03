import type { CSSProperties, ReactNode } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { PrismCheckbox } from "./prism-selection";
import { PrismSkeletonGroup, PrismFavoriteToggle } from "./prism-primitives";
import { PrismProfileChip } from "./prism-display";
import { PrismButton } from "./prism-button";
import type { PrismCandidate } from "./prism-candidate";

export type PrismDirectoryColumn<T> = { id: string; label: string; cell: (row: T) => ReactNode; sortable?: boolean; width?: CSSProperties["width"]; align?: "left" | "center" | "right" };
export function PrismDirectoryTable<T>({ title, rows, columns, getRowId, getRowLabel, selected, onSelectionChange, isRowSelectable = () => true, sort, onSortChange, onOpen, loading }: {
    title: string; rows: readonly T[]; columns: readonly PrismDirectoryColumn<T>[]; getRowId: (row: T) => string; getRowLabel: (row: T) => string;
    selected?: readonly string[]; onSelectionChange?: (selected: string[]) => void; isRowSelectable?: (row: T) => boolean;
    sort?: { column: string; direction: "asc" | "desc" } | null; onSortChange?: (sort: {column:string;direction:"asc" | "desc"}) => void;
    onOpen?: (row: T) => void; loading?: boolean;
}) {
    const eligible = rows.filter(isRowSelectable).map(getRowId); const all = eligible.length > 0 && eligible.every(id => selected?.includes(id)); const some = eligible.some(id => selected?.includes(id));
    const toggle = (id:string,checked:boolean) => onSelectionChange?.(checked ? [...new Set([...(selected ?? []),id])] : (selected ?? []).filter(value => value !== id));
    return <div className="prism-directory-scroll" role="region" aria-label={title} tabIndex={0}><table className="prism-directory"><caption className="prism-sr-only">{title}</caption><thead><tr>
        {onSelectionChange && <th scope="col" className="prism-directory-check"><PrismCheckbox label="현재 목록 전체 선택" hideLabel checked={all ? true : some ? "indeterminate" : false} disabled={loading || !eligible.length}
            onCheckedChange={checked => onSelectionChange(checked ? [...new Set([...(selected ?? []),...eligible])] : (selected ?? []).filter(id => !eligible.includes(id)))} /></th>}
        {columns.map(column => <th scope="col" key={column.id} style={{width:column.width,textAlign:column.align}} aria-sort={sort?.column === column.id ? sort.direction === "asc" ? "ascending" : "descending" : column.sortable ? "none" : undefined}>
            {column.sortable && onSortChange ? <button type="button" disabled={loading} onClick={() => onSortChange({column:column.id,direction:sort?.column === column.id && sort.direction === "asc" ? "desc" : "asc"})}>{column.label}{sort?.column === column.id ? sort.direction === "asc" ? <ArrowUp aria-hidden="true" /> : <ArrowDown aria-hidden="true" /> : null}</button> : column.label}</th>)}</tr></thead>
        <tbody>{loading ? <tr><td colSpan={columns.length+(onSelectionChange ? 1 : 0)}><PrismSkeletonGroup rows={5} /></td></tr> : rows.length ? rows.map(row => { const id = getRowId(row); return <tr key={id} data-selected={selected?.includes(id) || undefined} onClick={() => onOpen?.(row)}>
            {onSelectionChange && <td className="prism-directory-check" onClick={e => e.stopPropagation()}><PrismCheckbox hideLabel label={`${getRowLabel(row)} 선택`} checked={selected?.includes(id) ?? false} disabled={!isRowSelectable(row)} onCheckedChange={checked => toggle(id,checked === true)} /></td>}
            {columns.map((column,index) => <td key={column.id} style={{textAlign:column.align}}>{index === 0 && onOpen ? <PrismButton variant="shape" size="small" onClick={e => { e.stopPropagation(); onOpen(row); }}>{column.cell(row)}</PrismButton> : column.cell(row)}</td>)}</tr>; }) : <tr><td colSpan={columns.length+(onSelectionChange ? 1 : 0)}><p className="prism-no-data">검색 결과가 없습니다.</p></td></tr>}</tbody></table></div>;
}
export type PrismDirectoryCandidate = PrismCandidate & { series?: string; favorite?: boolean };
export function PrismCandidateDirectory({ rows, selected, onSelectionChange, sort, onSortChange, onOpen, loading }: { rows: readonly PrismDirectoryCandidate[]; selected: readonly string[]; onSelectionChange: (value:string[]) => void;
    sort: {column:string;direction:"asc" | "desc"} | null; onSortChange: (sort:{column:string;direction:"asc" | "desc"}) => void; onOpen: (row:PrismDirectoryCandidate) => void; loading?:boolean }) {
    return <PrismDirectoryTable title="후보자 목록" rows={rows} getRowId={r => r.id} getRowLabel={r => r.name} selected={selected} onSelectionChange={onSelectionChange} sort={sort} onSortChange={onSortChange} loading={loading}
        columns={[{id:"name",label:"후보자",sortable:true,cell:r => <PrismProfileChip name={r.name} src={r.photo} onClick={() => onOpen(r)} />},{id:"series",label:"계열",sortable:true,cell:r => r.series ?? "-"},{id:"company",label:"회사",sortable:true,cell:r => r.company},{id:"position",label:"직책",sortable:true,cell:r => r.position},
            {id:"favorite",label:"즐겨찾기",width:48,cell:r => <PrismFavoriteToggle name={r.name} checked={!!r.favorite} disabled onCheckedChange={() => {}} />}]} />;
}
