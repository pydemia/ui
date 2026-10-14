import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { PrismAdminLayout } from "./prism-admin";
import { PrismDirectoryTable, type PrismDirectoryColumn } from "./prism-directory";
import { PrismButton } from "./prism-button";
import { PrismInput } from "./prism-field";
import { PrismMultiSelect, PrismDatePicker, PrismPagination, type PrismOption } from "./prism-selection";
import { PrismEmptyState, PrismToast } from "./prism-feedback";
import { PrismSkeletonGroup } from "./prism-primitives";
import { PrismIcon } from "./prism-icon";
import { PrismMessage } from "./prism-chat";
import { PrismResponse, type PrismResponseBlock } from "./prism-response";

export type PrismChatLogRow = { id: string; conversationId: string; error: "Y" | "N"; name: string; company: string; employeeNo: string; subject: string; lastChatAt: string };
export type PrismChatLogFilterDraft = { companyIds: readonly string[]; dateFrom: string | null; dateTo: string | null; keyword: string };
export type PrismChatLogFilters = { companyIds: readonly string[]; dateFrom: string | null; dateTo: string | null; keyword: string };
export type PrismChatLogSort = { column: "conversationId" | "error" | "name" | "company" | "employeeNo" | "lastChatAt"; direction: "asc" | "desc" };
export function createPrismChatLogFilterDraft(companies: readonly PrismOption[]): PrismChatLogFilterDraft { return { companyIds: companies.map(company => company.value), dateFrom: null, dateTo: null, keyword: "" }; }
function validDate(value: string) { if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || Number(value.slice(0, 4)) < 1) return false; const date = new Date(value + "T00:00:00Z"); return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value; }
export function preparePrismChatLogFilters(draft: PrismChatLogFilterDraft, companies: readonly PrismOption[]): { filters: PrismChatLogFilters; error?: never } | { error: string; filters?: never } {
    if ([draft.dateFrom, draft.dateTo].some(value => value !== null && !validDate(value))) return { error: "최근 대화일을 올바른 날짜로 입력해 주세요." };
    if (draft.dateFrom && draft.dateTo && draft.dateFrom > draft.dateTo) return { error: "시작일은 종료일보다 늦을 수 없습니다." };
    const allowed = new Set(companies.map(company => company.value)), selected = [...new Set(draft.companyIds)].filter(id => allowed.has(id));
    return { filters: { companyIds: !selected.length || selected.length === allowed.size ? [] : selected, dateFrom: draft.dateFrom, dateTo: draft.dateTo, keyword: draft.keyword.trim() } };
}
/** Application-neutral query values; the original list has no real API contract yet. */
export function createPrismChatLogQuery(filters: PrismChatLogFilters, page: number, sort: PrismChatLogSort | null, pageSize = 10) {
    if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(pageSize) || pageSize < 1) throw new RangeError("Invalid chat-log pagination.");
    if ([filters.dateFrom, filters.dateTo].some(value => value !== null && !validDate(value)) || filters.dateFrom && filters.dateTo && filters.dateFrom > filters.dateTo) throw new RangeError("Invalid chat-log dates.");
    if (sort && (!["conversationId", "error", "name", "company", "employeeNo", "lastChatAt"].includes(sort.column) || !["asc", "desc"].includes(sort.direction))) throw new RangeError("Invalid chat-log sort.");
    return { companyIds: [...filters.companyIds], fromDate: filters.dateFrom?.replaceAll("-", ".") ?? null, toDate: filters.dateTo?.replaceAll("-", ".") ?? null, keyword: filters.keyword, page, pageSize, sort: sort ? { column: sort.column, direction: sort.direction } : null };
}
const publicRow = (row: PrismChatLogRow): PrismChatLogRow => ({ id: row.id, conversationId: row.conversationId, error: row.error, name: row.name, company: row.company, employeeNo: row.employeeNo, subject: row.subject, lastChatAt: row.lastChatAt });
export type PrismChatLogManagementProps = { rows: readonly PrismChatLogRow[]; total: number; page: number; pageCount: number; onPageChange: (page: number) => void;
    companies: readonly PrismOption[]; filters: PrismChatLogFilterDraft; applied: PrismChatLogFilters; onFiltersChange: (filters: PrismChatLogFilterDraft) => void; onSearch: (filters: PrismChatLogFilters) => void;
    sort: PrismChatLogSort | null; onSortChange: (sort: PrismChatLogSort) => void; onOpen: (row: PrismChatLogRow) => void; scopeKey: string;
    onCopyConversation?: (conversationId: string, context: { signal: AbortSignal }) => Promise<void>; onCopied?: (conversationId: string) => void;
    allowCopy?: boolean; loading?: boolean; error?: string; onRetry?: () => void; dateInputEditable?: boolean; className?: string };
export function PrismChatLogManagement(props: PrismChatLogManagementProps) {
    const { rows, total, page, pageCount, onPageChange, companies, filters, applied, onFiltersChange, onSearch, sort, onSortChange, onOpen, scopeKey, allowCopy = true, loading = false, error, onRetry, dateInputEditable = false, className = "" } = props;
    if (!Number.isSafeInteger(total) || total < 0 || !Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(pageCount) || pageCount < 1) throw new RangeError("Invalid chat-log counts.");
    const [filterError, setFilterError] = useState<string | null>(null), [notice, setNotice] = useState<{ title: string; tone: "success" | "error" } | null>(null), [copying, setCopying] = useState<string | null>(null);
    const latest = useRef(props), controller = useRef<AbortController | null>(null), generation = useRef(0), mounted = useRef(false);
    useLayoutEffect(() => { latest.current = props; });
    useLayoutEffect(() => { mounted.current = true; setNotice(null); setCopying(null); setFilterError(null); return () => { mounted.current = false; generation.current++; controller.current?.abort(); controller.current = null; }; }, [scopeKey, allowCopy]);
    const copy = async (row: PrismChatLogRow) => {
        if (!allowCopy || loading || controller.current) return;
        const value = row.conversationId, active = new AbortController(), token = generation.current; controller.current = active; setCopying(row.id); setNotice(null);
        const current = () => mounted.current && !active.signal.aborted && controller.current === active && generation.current === token;
        let copied = false;
        try {
            if (latest.current.onCopyConversation) await latest.current.onCopyConversation(value, { signal: active.signal });
            else { if (!globalThis.navigator?.clipboard?.writeText) throw new Error("Clipboard unavailable"); await navigator.clipboard.writeText(value); }
            copied = true;
            if (current()) { latest.current.onCopied?.(value); if (current()) setNotice({ title: "복사되었습니다", tone: "success" }); }
        } catch { if (current()) setNotice({ title: copied ? "복사는 완료됐지만 알림 상태를 갱신하지 못했습니다." : "복사하지 못했습니다. 다시 시도해 주세요.", tone: "error" }); }
        finally { if (current()) { controller.current = null; setCopying(null); } }
    };
    const columns: PrismDirectoryColumn<PrismChatLogRow>[] = [
        { id: "conversationId", label: "Conversation ID", sortable: true, width: 200, cell: row => <span className="prism-chat-log-id"><span>{row.conversationId}</span><button type="button" aria-label={`${row.conversationId} 복사`} disabled={!allowCopy || loading || !!copying} aria-busy={copying === row.id || undefined} onClick={event => { event.stopPropagation(); void copy(row); }}><PrismIcon name="CopyAltIcon" size={20}/></button></span> },
        { id: "error", label: "에러", sortable: true, width: 80, cell: row => <span className="prism-chat-log-error" data-error={row.error === "Y" || undefined}>{row.error}</span> },
        { id: "name", label: "이름", sortable: true, width: 120, cell: row => row.name }, { id: "company", label: "회사", sortable: true, width: 120, cell: row => row.company },
        { id: "employeeNo", label: "사번", sortable: true, width: 120, cell: row => row.employeeNo },
        { id: "subject", label: "대화 주제", cell: row => <span className="prism-chat-log-subject" title={row.subject}>{row.subject}</span> },
        { id: "lastChatAt", label: "최근 대화일", sortable: true, width: 120, cell: row => row.lastChatAt },
    ];
    const hasFilters = !!(applied.companyIds.length || applied.dateFrom || applied.dateTo || applied.keyword);
    const apply = (draft: PrismChatLogFilterDraft) => { const result = preparePrismChatLogFilters(draft, companies); if (result.error) { setFilterError(result.error); return; } setFilterError(null); onSearch(result.filters!); onPageChange(1); };
    return <PrismAdminLayout title="대화 로그 관리" className={`prism-admin-chat-logs ${className}`} breadcrumbs={["Admin", "대화 로그 관리"]}>
        {!loading && !error && total === 0 && !hasFilters ? <div className="prism-chat-log-empty"><PrismEmptyState title="대화 로그가 없습니다"/></div> : <>
            <form className="prism-chat-log-filter" onSubmit={event => { event.preventDefault(); if (event.currentTarget.querySelector('input[aria-invalid="true"]')) { setFilterError("최근 대화일을 올바른 날짜로 입력해 주세요."); return; } apply(filters); }}>
                <div className="prism-chat-log-filter-fields"><PrismMultiSelect label="회사" options={companies} value={filters.companyIds} onValueChange={companyIds => onFiltersChange({ ...filters, companyIds })} disabled={loading}/>
                    <fieldset className="prism-chat-log-dates"><legend>최근 대화일</legend><div><PrismDatePicker label="최근 대화일 시작일" value={filters.dateFrom} onValueChange={dateFrom => onFiltersChange({ ...filters, dateFrom })} displayFormat="YYYY.MM.DD" placeholder="시작일" inputEditable={dateInputEditable} disabled={loading}/><span aria-hidden="true">~</span><PrismDatePicker label="최근 대화일 종료일" value={filters.dateTo} onValueChange={dateTo => onFiltersChange({ ...filters, dateTo })} displayFormat="YYYY.MM.DD" placeholder="종료일" inputEditable={dateInputEditable} disabled={loading}/></div></fieldset>
                    <PrismInput label="검색어" placeholder="검색어를 입력하세요" value={filters.keyword} disabled={loading} onChange={event => onFiltersChange({ ...filters, keyword: event.target.value })}/></div>
                <div className="prism-chat-log-filter-actions"><PrismButton variant="line" disabled={loading} onClick={() => { const next = createPrismChatLogFilterDraft(companies); onFiltersChange(next); apply(next); }}>초기화</PrismButton><PrismButton type="submit" disabled={loading}>조회</PrismButton></div>
            </form>{filterError && <p className="prism-error" role="alert">{filterError}</p>}
            <div className="prism-chat-log-summary">총 {total}건</div>{error ? <div><p className="prism-error" role="alert">{error}</p>{onRetry && <PrismButton variant="line" onClick={onRetry}>다시 조회</PrismButton>}</div> : <>
                <PrismDirectoryTable title="대화 로그 목록" variant="admin" rows={rows} columns={columns} getRowId={row => row.id} getRowLabel={row => row.conversationId} sort={sort} onSortChange={value => { onSortChange(value as PrismChatLogSort); onPageChange(1); }} onOpen={row => onOpen(publicRow(row))} openColumn="subject" loading={loading}/>
                {!loading && rows.length > 0 && <PrismPagination page={Math.min(page, pageCount)} pageCount={pageCount} onPageChange={onPageChange} pageButtonCount={10}/>}</>}
        </>}{notice && <div className="prism-chat-log-copy-notice"><PrismToast {...notice} onClose={() => setNotice(null)}/></div>}
    </PrismAdminLayout>;
}
export type PrismChatLogTurn = { id: string; question: string; blocks: readonly PrismResponseBlock[]; status?: "complete" | "error" };
/** Preserves the source context-add nudge rule without changing the archived records. */
export function preparePrismChatLogTurns(turns: readonly PrismChatLogTurn[]) {
    const contextNudge = (blocks: readonly PrismResponseBlock[]) => blocks.some((block, index) => block.type === "options" && [block.title, blocks[index - 1]?.type === "text" ? (blocks[index - 1] as { content: string }).content : ""].some(text => text.includes("맥락") && text.includes("추가")));
    return turns.map((turn, index) => ({ turn: { ...turn, blocks: turn.blocks.map(block => {
        if (block.type !== "options" || block.selected !== undefined) return block;
        const next = turns[index + 1]?.question, selected = block.options.find(option => option.id === next || option.label === next)?.id;
        return selected ? { ...block, selected } : block;
    }) }, hideQuestion: index > 0 && contextNudge(turns[index - 1].blocks) }));
}
export function PrismChatLogDetail({ subject, turns, loading = false, error, onRetry, onBack, className = "", style }: {
    subject: string; turns: readonly PrismChatLogTurn[]; loading?: boolean; error?: string; onRetry?: () => void; onBack?: () => void; className?: string; style?: CSSProperties;
}) {
    return <section className={`prism-chat-log-detail ${className}`} style={style}><header><nav aria-label="현재 위치"><span>Admin</span><span>대화 로그 관리</span><span title={subject}>{subject}</span></nav><div>{onBack && <button type="button" aria-label="이전 페이지" onClick={onBack}><PrismIcon name="ChevronLeftIcon" size={20}/></button>}<h1 title={subject}>{subject}</h1></div></header>
        <div className="prism-chat-log-detail-body"><div className="prism-chat-log-detail-content">{loading ? <PrismSkeletonGroup/> : error ? <div><p role="alert" className="prism-error">{error}</p>{onRetry && <PrismButton variant="line" onClick={onRetry}>다시 조회</PrismButton>}</div> : turns.length ? <div role="region" aria-label="보관된 대화 내용">{preparePrismChatLogTurns(turns).map(({ turn, hideQuestion }) => <div key={turn.id}>{!hideQuestion && <PrismMessage role="user">{turn.question}</PrismMessage>}<PrismMessage role="assistant"><PrismResponse blocks={turn.blocks} status={turn.status ?? "complete"}/></PrismMessage></div>)}</div> : <PrismEmptyState title="보관된 대화 내용이 없습니다"/>}</div></div>
    </section>;
}
