import { useEffect, useId, useRef, type CSSProperties, type ReactNode } from "react";
import { PrismButton } from "./prism-button";
import { PrismInput, PrismSelect } from "./prism-field";
import { PrismEmptyState, PrismRequestState } from "./prism-feedback";
import { PrismIcon } from "./prism-icon";
import { PrismSkeleton } from "./prism-primitives";
import { PrismMultiSelect, PrismPagination, type PrismOption } from "./prism-selection";

export type PrismPositionDirectoryRow = { id: string; company: string; name: string; industry: string; job: string; role: string };
export type PrismPositionDirectorySortKey = Exclude<keyof PrismPositionDirectoryRow, "id">;
export type PrismPositionDirectoryFilter = { companyId: string | null; industryIds: readonly string[]; name: string };
export type PrismPositionDirectoryTab = { id: string; company: string; name: string };
export type PrismPositionDirectoryState = {
    draft: PrismPositionDirectoryFilter;
    applied: PrismPositionDirectoryFilter;
    page: number;
    rowsPerPage: number;
    sort: { column: PrismPositionDirectorySortKey; direction: "asc" | "desc" } | null;
    tabs: readonly PrismPositionDirectoryTab[];
    activeTabId: string | null;
};
export const prismPositionDirectoryPageSizes = [10, 20, 50, 100] as const;
const emptyFilter = (): PrismPositionDirectoryFilter => ({ companyId: null, industryIds: [], name: "" });
export function createPrismPositionDirectoryState(): PrismPositionDirectoryState {
    return { draft: emptyFilter(), applied: emptyFilter(), page: 1, rowsPerPage: 10, sort: null, tabs: [], activeTabId: null };
}
export function applyPrismPositionDirectoryFilters(state: PrismPositionDirectoryState, industryOptions: readonly PrismOption[]): PrismPositionDirectoryState {
    const industryIds = state.draft.industryIds.length > 0 && state.draft.industryIds.length < industryOptions.length ? [...state.draft.industryIds] : [];
    return { ...state, page: 1, applied: { companyId: state.draft.companyId, industryIds, name: state.draft.name.trim() } };
}
export function resetPrismPositionDirectoryFilters(state: PrismPositionDirectoryState): PrismPositionDirectoryState {
    return { ...state, draft: emptyFilter(), applied: emptyFilter(), page: 1 };
}
export function sortPrismPositionDirectory(state: PrismPositionDirectoryState, column: PrismPositionDirectorySortKey): PrismPositionDirectoryState {
    return { ...state, page: 1, sort: { column, direction: state.sort?.column === column && state.sort.direction === "asc" ? "desc" : "asc" } };
}
export function openPrismPositionDirectoryTab(state: PrismPositionDirectoryState, row: PrismPositionDirectoryRow): PrismPositionDirectoryState {
    return { ...state, activeTabId: row.id, tabs: state.tabs.some(tab => tab.id === row.id) ? state.tabs : [...state.tabs, { id: row.id, company: row.company, name: row.name }] };
}
export function closePrismPositionDirectoryTab(state: PrismPositionDirectoryState, id: string): PrismPositionDirectoryState {
    const index = state.tabs.findIndex(tab => tab.id === id);
    if (index < 0) return state;
    return { ...state, tabs: state.tabs.filter(tab => tab.id !== id), activeTabId: state.activeTabId === id ? state.tabs[index - 1]?.id ?? null : state.activeTabId };
}
const sortFields: Record<PrismPositionDirectorySortKey, string> = {
    company: "company_name", name: "name", industry: "industry_name", job: "main_job_name", role: "role_name",
};
/** The host fetches the LIVE result and owns cancellation, authorization and error reporting. */
export function createPrismPositionDirectoryQuery(state: PrismPositionDirectoryState) {
    if (!Number.isSafeInteger(state.page) || state.page < 1 || !prismPositionDirectoryPageSizes.some(size => size === state.rowsPerPage)) throw new RangeError("Invalid position directory pagination.");
    return { source: "LIVE" as const, page: state.page, size: state.rowsPerPage,
        name: state.applied.name || undefined,
        company_id: state.applied.companyId ? [state.applied.companyId] : undefined,
        industry_block_id: [...state.applied.industryIds],
        sort: state.sort ? [`${sortFields[state.sort.column]}:${state.sort.direction}`] : undefined };
}
export type PrismPositionDirectoryProps = {
    state: PrismPositionDirectoryState;
    onStateChange: (state: PrismPositionDirectoryState) => void;
    rows: readonly PrismPositionDirectoryRow[];
    total: number;
    pageCount: number;
    companies: readonly PrismOption[];
    industries: readonly PrismOption[];
    status?: "ready" | "loading" | "error";
    onRetry?: () => void;
    renderDetail: (tab: PrismPositionDirectoryTab) => ReactNode;
    /** Changes in the host route return to the list while retaining open tabs. */
    routeKey?: string;
    height?: CSSProperties["height"];
    className?: string;
    style?: CSSProperties;
};
const columns: readonly { key: PrismPositionDirectorySortKey; label: string }[] = [
    { key: "company", label: "회사" }, { key: "name", label: "포지션" }, { key: "industry", label: "산업" },
    { key: "job", label: "직무" }, { key: "role", label: "직책" },
];
const tabLabel = (tab: PrismPositionDirectoryTab) => `[${tab.company}] ${tab.name}`;
const shortLabel = (label: string) => label.length > 20 ? `${label.slice(0, 20)}…` : label;

/** Controlled, portable position browser. Rows and detail data always come from the consumer. */
export function PrismPositionDirectory({ state, onStateChange, rows, total, pageCount, companies, industries,
    status = "ready", onRetry, renderDetail, routeKey, height = "100%", className = "", style }: PrismPositionDirectoryProps) {
    if (!Number.isSafeInteger(total) || total < 0 || !Number.isSafeInteger(pageCount) || pageCount < 1 || state.page > pageCount) throw new RangeError("Invalid position directory result pagination.");
    const id = useId();
    const previousRouteKey = useRef(routeKey);
    useEffect(() => {
        if (previousRouteKey.current === routeKey) return;
        previousRouteKey.current = routeKey;
        if (state.activeTabId !== null) onStateChange({ ...state, activeTabId: null });
    }, [routeKey, state, onStateChange]);
    const updateDraft = (next: Partial<PrismPositionDirectoryFilter>) => onStateChange({ ...state, draft: { ...state.draft, ...next } });
    const apply = () => onStateChange(applyPrismPositionDirectoryFilters(state, industries));
    const active = state.tabs.find(tab => tab.id === state.activeTabId) ?? null;
    const busy = status === "loading";
    return <section data-prism="light" className={`prism-position-directory ${className}`} style={{ height, ...style }} aria-label="포지션 목록">
        <div className="prism-position-directory-title">포지션 목록</div>
        <div className="prism-position-directory-tabs" role="tablist" aria-label="포지션 상세 탭">
            <button type="button" role="tab" id={`${id}-list-tab`} aria-controls={`${id}-panel`} aria-selected={!active} onClick={() => onStateChange({ ...state, activeTabId: null })}>목록</button>
            {state.tabs.map(tab => <div className="prism-position-directory-tab" key={tab.id}>
                <button type="button" role="tab" id={`${id}-${tab.id}-tab`} aria-controls={`${id}-panel`} aria-selected={active?.id === tab.id}
                    title={tabLabel(tab)} onClick={() => onStateChange({ ...state, activeTabId: tab.id })}>{active?.id === tab.id ? tabLabel(tab) : shortLabel(tabLabel(tab))}</button>
                <button type="button" className="prism-position-directory-close" aria-label={`${tabLabel(tab)} 닫기`} onClick={() => onStateChange(closePrismPositionDirectoryTab(state, tab.id))}><PrismIcon name="CloseIcon" size={14}/></button>
            </div>)}
        </div>
        <div className="prism-position-directory-panel" role="tabpanel" id={`${id}-panel`} aria-labelledby={active ? `${id}-${active.id}-tab` : `${id}-list-tab`}>
            {active ? renderDetail(active) : <div className="prism-position-directory-list">
                <form className="prism-position-directory-filter" onSubmit={event => { event.preventDefault(); if (!busy) apply(); }}>
                    <div className="prism-position-directory-fields">
                        <PrismSelect label="회사" size="small" searchable searchPlaceholder="회사명 검색" value={state.draft.companyId ?? "ALL"}
                            options={[{ value: "ALL", label: "전체" }, ...companies]} onValueChange={value => updateDraft({ companyId: value === "ALL" ? null : value })} disabled={busy}/>
                        <PrismMultiSelect label="산업" size="small" options={industries} value={state.draft.industryIds}
                            onValueChange={industryIds => updateDraft({ industryIds })} placeholder="전체" searchable allToggleClearsSelection disabled={busy}/>
                        <PrismInput label="포지션 이름" className="prism-position-directory-name" size="small" value={state.draft.name}
                            placeholder="포지션 이름" onChange={event => updateDraft({ name: event.target.value })} disabled={busy}/>
                    </div><div className="prism-position-directory-actions">
                        <PrismButton type="button" size="small" variant="line" iconOnly aria-label="초기화" icon={<PrismIcon name="ResetIcon" size={16}/>}
                            disabled={busy} onClick={() => onStateChange(resetPrismPositionDirectoryFilters(state))}/>
                        <PrismButton type="submit" size="small" disabled={busy}>조회</PrismButton>
                    </div>
                </form>
                <div className="prism-position-directory-toolbar"><span>총 {total}건</span>
                    <PrismSelect label="페이지당 포지션 수" size="small" className="prism-position-directory-size" value={String(state.rowsPerPage)}
                        options={prismPositionDirectoryPageSizes.map(size => ({ value: String(size), label: `${size} / page` }))}
                        onValueChange={value => onStateChange({ ...state, page: 1, rowsPerPage: Number(value) })} disabled={busy}/>
                </div>
                {status === "error" ? <PrismRequestState status="error" onRetry={onRetry}/> : <div className="prism-position-directory-scroll" role="region" aria-label="포지션 검색 결과" tabIndex={0} aria-busy={busy || undefined}>
                    <table className="prism-position-directory-table"><caption className="prism-sr-only">포지션 목록</caption>
                        <colgroup><col style={{ width: "20%" }}/><col style={{ width: "35%" }}/><col style={{ width: "15%" }}/><col style={{ width: "15%" }}/><col style={{ width: "15%" }}/></colgroup>
                        <thead><tr>{columns.map(column => <th key={column.key} scope="col" aria-sort={state.sort?.column === column.key ? state.sort.direction === "asc" ? "ascending" : "descending" : "none"}>
                            <span>{column.label}</span><button type="button" aria-label={`${column.label} 정렬`} disabled={busy} onClick={() => onStateChange(sortPrismPositionDirectory(state, column.key))}>
                                <PrismIcon name={state.sort?.column === column.key && state.sort.direction === "asc" ? "ChevronUpFillIcon" : "ChevronDownFillIcon"} size={16}/></button>
                        </th>)}</tr></thead><tbody>{busy ? Array.from({ length: 4 }, (_, index) => <tr key={index}>{columns.map(column => <td key={column.key}><PrismSkeleton width="100%" height={20}/></td>)}</tr>)
                            : rows.length ? rows.map(row => <tr key={row.id} className="prism-position-directory-row" tabIndex={0} aria-label={`${row.company} ${row.name} 상세 열기`}
                                onClick={() => onStateChange(openPrismPositionDirectoryTab(state, row))}
                                onKeyDown={event => { if (event.target === event.currentTarget && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); onStateChange(openPrismPositionDirectoryTab(state, row)); } }}>
                                {columns.map((column, index) => <td key={column.key} title={row[column.key]}>{index === 0 ? <button type="button" className="prism-position-directory-open" aria-label={`${row.company} ${row.name} 상세 열기`}
                                    onClick={event => { event.stopPropagation(); onStateChange(openPrismPositionDirectoryTab(state, row)); }}>{row[column.key]}</button> : row[column.key]}</td>)}</tr>)
                            : <tr><td colSpan={5} className="prism-position-directory-empty"><PrismEmptyState title="검색 결과가 없습니다" description="검색 조건을 변경해 다시 시도해 주세요" icon={<PrismIcon name="NoSearchResultIcon" size={140}/>} /></td></tr>}
                        </tbody></table></div>}
                {status !== "error" && total > 0 && <div className="prism-position-directory-pagination"><PrismPagination page={state.page} pageCount={pageCount} pageButtonCount={10} disabled={busy}
                    onPageChange={page => onStateChange({ ...state, page })}/></div>}
            </div>}
        </div>
    </section>;
}
