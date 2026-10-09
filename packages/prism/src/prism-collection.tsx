import { type ReactNode } from "react";
import { RotateCcw, LayoutGrid, List } from "lucide-react";
import { PrismButton } from "./prism-button";
import { PrismInput, PrismSelect, PrismTextarea } from "./prism-field";
import { PrismMultiSelect, type PrismOption } from "./prism-selection";
import { PrismCandidateCard, PrismCandidateTable, type PrismCandidate } from "./prism-candidate";
import { PrismProfileChip } from "./prism-display";
import { PrismRequestState } from "./prism-feedback";
import { PrismSkeletonGroup } from "./prism-primitives";
import { PrismMemoCard } from "./prism-detail";

export function PrismChatHeader({ title, actions }: { title: string; actions?: ReactNode }) { return <header className="prism-chat-header"><span>{title}</span>{actions}</header>; }
export function PrismContentFrame({ children, fluid = false }: { children: ReactNode; fluid?: boolean }) { return <div className="prism-content-frame" data-fluid={fluid || undefined}>{children}</div>; }
export function PrismSectionTitle({ children, actions }: { children: ReactNode; actions?: ReactNode }) { return <div className="prism-section-title"><h3>{children}</h3>{actions}</div>; }
export type PrismCandidateFilters = { series: string; companies: readonly string[]; name: string };
export function PrismCandidateFilterBar({ value, onValueChange, seriesOptions, companyOptions, onSearch, onReset, disabled = false }: { value: PrismCandidateFilters;
    onValueChange: (value: PrismCandidateFilters) => void; seriesOptions: readonly PrismOption[]; companyOptions: readonly PrismOption[]; onSearch: (value: PrismCandidateFilters) => void; onReset: () => void; disabled?: boolean }) {
    return <form className="prism-candidate-filters" onSubmit={e => { e.preventDefault(); if (!disabled) onSearch(value); }}><div>
        <PrismSelect label="계열" size="small" value={value.series} disabled={disabled} onChange={e => onValueChange({...value,series:e.target.value})}>{seriesOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</PrismSelect>
        <PrismMultiSelect label="회사" options={companyOptions} value={value.companies} onValueChange={companies => onValueChange({...value,companies})} disabled={disabled} />
        <PrismInput label="이름" size="small" placeholder="이름" value={value.name} disabled={disabled} onChange={e => onValueChange({...value,name:e.target.value})} /></div><div>
        <PrismButton variant="line" size="small" iconOnly aria-label="검색 조건 초기화" icon={<RotateCcw />} disabled={disabled} onClick={onReset} /><PrismButton type="submit" size="small" disabled={disabled}>조회</PrismButton></div></form>;
}
export function PrismCandidateCollection({ title, candidates, view, onViewChange, onOpen, favorites = [], onFavoriteChange, filters, pagination, status = "ready", onRetry }: {
    title: string; candidates: readonly PrismCandidate[]; view: "cards" | "table"; onViewChange: (view: "cards" | "table") => void; onOpen: (candidate: PrismCandidate) => void;
    favorites?: readonly string[]; onFavoriteChange?: (candidate: PrismCandidate, favorite: boolean) => void; filters?: ReactNode; pagination?: ReactNode; status?: "ready" | "loading" | "error"; onRetry?: () => void;
}) {
    return <section className="prism-candidate-collection"><PrismSectionTitle actions={<div><PrismButton variant="shape" iconOnly aria-label="카드 보기" aria-pressed={view === "cards"} icon={<LayoutGrid />} onClick={() => onViewChange("cards")} /><PrismButton variant="shape" iconOnly aria-label="표 보기" aria-pressed={view === "table"} icon={<List />} onClick={() => onViewChange("table")} /></div>}>{title} <span>({candidates.length})</span></PrismSectionTitle>{filters}
        {status === "loading" ? <PrismSkeletonGroup rows={6} /> : status === "error" ? <PrismRequestState status="error" onRetry={onRetry} /> : !candidates.length ? <PrismRequestState status="empty" /> : view === "table" ? <PrismCandidateTable candidates={candidates} onOpen={onOpen} /> :
            <div className="prism-candidate-grid">{candidates.map(candidate => <PrismCandidateCard key={candidate.id} candidate={candidate} variant="grid" onOpen={onOpen} favorite={favorites.includes(candidate.id)} onFavoriteChange={onFavoriteChange ? next => onFavoriteChange(candidate,next) : undefined} showDetails />)}</div>}{pagination}</section>;
}
export type PrismBoardRow = { id: string; company: string; position: string; current: readonly PrismCandidate[]; ranks: readonly (PrismCandidate | null)[] };
export function PrismSuccessorBoard({ rows, onOpen, loading = false }: { rows: readonly PrismBoardRow[]; onOpen: (candidate: PrismCandidate) => void; loading?: boolean }) {
    const rowsFor = (row: PrismBoardRow) => Math.max(1,row.current.length);
    const companySpan = (index: number) => { let count = 0; for (let i=index;i<rows.length && rows[i].company === rows[index].company;i++) count += rowsFor(rows[i]); return count; };
    return <div className="prism-board-scroll" role="region" aria-label="Successor Board" tabIndex={0}><table className="prism-board"><caption className="prism-sr-only">Successor Board</caption><thead><tr>{["회사","직책","현재","1순위","2순위","3순위"].map(title => <th scope="col" key={title}>{title}</th>)}</tr></thead>
        <tbody>{loading ? <tr><td colSpan={6}><PrismSkeletonGroup rows={4} /></td></tr> : !rows.length ? <tr><td colSpan={6}>검색 결과가 없습니다.</td></tr> : rows.flatMap((row,index) => (row.current.length ? row.current : [null]).map((current,sub) => <tr key={`${row.id}-${sub}`}>
            {sub === 0 && (index === 0 || rows[index-1].company !== row.company) && <th scope="rowgroup" rowSpan={companySpan(index)}>{row.company}</th>}{sub === 0 && <th scope="rowgroup" rowSpan={rowsFor(row)}>{row.position}</th>}
            <td>{current ? <span className="prism-current-name">{current.name}</span> : "-"}</td>{sub === 0 && [0,1,2].map(rank => <td rowSpan={rowsFor(row)} key={rank}>{row.ranks[rank] ? <PrismProfileChip name={row.ranks[rank]!.name} small={rows.length >= 13} onClick={() => onOpen(row.ranks[rank]!)} /> : "-"}</td>)}</tr>))}</tbody></table></div>;
}
export function PrismMemoComposer({ value, onValueChange, onSubmit, busy = false }: { value: string; onValueChange: (value: string) => void; onSubmit: (value: string) => void; busy?: boolean }) {
    const submit = () => { if (!busy && value.trim()) onSubmit(value.trim()); };
    return <form className="prism-memo-composer" onSubmit={e => { e.preventDefault(); submit(); }}><PrismTextarea label="메모" placeholder="메모를 입력해 주세요." value={value} disabled={busy} onChange={e => onValueChange(e.target.value)} onKeyDown={e => {
        if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); submit(); }
    }} /><PrismButton type="submit" disabled={busy || !value.trim()}>등록</PrismButton></form>;
}
/** Previous author-header collection. Use PrismProfileMemoCollection for current personal memos. */
export function PrismMemoCollection({ items, composer, loading }: { items: readonly { id: string; author: string; date: string; content: string; actions?: ReactNode }[]; composer?: ReactNode; loading?: boolean }) {
    return <section className="prism-memo-collection"><PrismSectionTitle>메모 ({items.length})</PrismSectionTitle>{loading ? <PrismSkeletonGroup rows={6} /> : items.length ? items.map(item => <PrismMemoCard key={item.id} author={item.author} date={item.date} actions={item.actions}>{item.content}</PrismMemoCard>) : <PrismRequestState status="empty" />}{composer}</section>;
}
