import type { CSSProperties, ReactNode } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { PrismCheckbox } from "./prism-selection";
import { PrismSkeletonGroup, PrismSkeleton, PrismFavoriteToggle } from "./prism-primitives";
import { PrismProfileChip } from "./prism-display";
import { PrismButton } from "./prism-button";
import { PrismEmptyState } from "./prism-feedback";
import { PrismIcon } from "./prism-icon";
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
export type PrismCandidateDirectoryProps = {
    rows: readonly PrismDirectoryCandidate[]; selected: readonly string[]; onSelectionChange: (value: string[]) => void;
    sort: { column: string; direction: "asc" | "desc" } | null; onSortChange: (sort: { column: string; direction: "asc" | "desc" }) => void;
    onOpen: (row: PrismDirectoryCandidate) => void; loading?: boolean; readOnly?: boolean;
};
export function PrismCandidateDirectory({ rows, selected, onSelectionChange, sort, onSortChange, onOpen, loading = false, readOnly = false }: PrismCandidateDirectoryProps) {
    const selectedHere = rows.filter(row => selected.includes(row.id));
    const all = rows.length > 0 && selectedHere.length === rows.length;
    const headers = [{ id: "name", label: "후보자", direction: "asc" }, { id: "series", label: "계열", direction: "asc" },
        { id: "company", label: "회사", direction: "asc" }, { id: "position", label: "직책", direction: "desc" }] as const;
    return <div className="prism-candidate-directory" role="region" aria-label="후보자 목록" tabIndex={0} aria-busy={loading || undefined}>
        <table><caption className="prism-sr-only">후보자 목록</caption><thead><tr>
            <th scope="col" className="prism-candidate-check"><PrismCheckbox label="현재 목록 전체 선택" hideLabel checked={all ? true : selectedHere.length ? "indeterminate" : false} disabled={loading || readOnly || !rows.length}
                onCheckedChange={() => onSelectionChange(selectedHere.length ? [] : [...new Set([...selected, ...rows.map(row => row.id)])])}/></th>
            {headers.map(column => { const active = sort?.column === column.id, direction = active ? sort.direction : column.direction;
                return <th scope="col" key={column.id} aria-sort={active ? direction === "asc" ? "ascending" : "descending" : "none"}>
                    <span className="prism-candidate-sort"><span>{column.label}</span><button type="button" aria-label={`${column.label} 정렬`} disabled={loading || readOnly}
                        onClick={() => onSortChange({ column: column.id, direction: active ? direction === "asc" ? "desc" : "asc" : column.direction })}>
                        <PrismIcon name={direction === "asc" ? "ChevronUpFillIcon" : "ChevronDownFillIcon"} size={16} style={{ color: "var(--prism-neutral-400)" }}/></button></span>
                </th>;
            })}<th scope="col" className="prism-candidate-check"><span className="prism-sr-only">즐겨찾기</span></th>
        </tr></thead><tbody>
            {loading ? Array.from({ length: 4 }, (_, index) => <tr key={index}><td/><td><PrismSkeleton width={100} height={30} radius={15}/></td>
                {[0, 1, 2].map(key => <td key={key}><PrismSkeleton height={20}/></td>)}<td/></tr>) : rows.length ? rows.map(row => <tr key={row.id} onClick={() => onOpen(row)}>
                <td className="prism-candidate-check" onClick={event => event.stopPropagation()}><PrismCheckbox label={`${row.name} 선택`} hideLabel checked={selected.includes(row.id)} disabled={readOnly}
                    onCheckedChange={next => onSelectionChange(next ? [...new Set([...selected, row.id])] : selected.filter(id => id !== row.id))}/></td>
                <td><PrismProfileChip name={row.name} src={row.photo} onClick={event => { event.stopPropagation(); onOpen(row); }}/></td>
                <td className="prism-candidate-directory-text" title={row.series}>{row.series ?? "-"}</td><td className="prism-candidate-directory-text" title={row.company}>{row.company}</td>
                <td className="prism-candidate-directory-text" title={row.position}>{row.position}</td><td className="prism-candidate-check" onClick={event => event.stopPropagation()}>
                    <PrismFavoriteToggle name={row.name} checked={!!row.favorite} disabled onCheckedChange={() => {}}/></td>
            </tr>) : <tr><td colSpan={6} className="prism-candidate-empty"><PrismEmptyState title="검색 결과가 없습니다" description="검색 조건을 변경해 다시 시도해 주세요"/></td></tr>}
        </tbody></table>
    </div>;
}
