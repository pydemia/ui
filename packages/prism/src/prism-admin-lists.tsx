import { useLayoutEffect, useRef, useState } from "react";
import { PrismAdminLayout, PrismTruncatedText } from "./prism-admin";
import { PrismDirectoryTable, type PrismDirectoryColumn } from "./prism-directory";
import { PrismButton } from "./prism-button";
import { PrismChip } from "./prism-badge";
import { PrismInput } from "./prism-field";
import { PrismMultiSelect, PrismDatePicker, PrismPagination, type PrismOption } from "./prism-selection";
import { PrismConfirmDialog } from "./prism-dialog";
import { PrismEmptyState } from "./prism-feedback";
import { PrismIcon } from "./prism-icon";

type PageProps<Row, Sort> = { rows: readonly Row[]; total: number; page: number; pageCount: number; onPageChange: (page: number) => void;
    selected: readonly string[]; onSelectionChange: (ids: string[]) => void; sort: Sort | null; onSortChange: (sort: Sort) => void;
    onOpen: (row: Row) => void; onCreate?: () => void; loading?: boolean; optionsLoading?: boolean; readOnly?: boolean; error?: string; onRetry?: () => void;
    /** Replace when account, permission, applied query, page or service provider changes. */
    scopeKey: string; companies: readonly PrismOption[];
};
const statusOptions: readonly PrismOption[] = [{ value: "active", label: "활성" }, { value: "inactive", label: "비활성" }];
const partial = (selected: readonly string[], count: number) => selected.length > 0 && selected.length < count ? [...selected] : [];
const display = (text?: string | null) => text?.trim() || "-";
const activeChip = (active: boolean) => <PrismChip color={active ? "#009A93" : "#363636"}>{active ? "활성" : "비활성"}</PrismChip>;
type BulkCompletion = { close: boolean; error?: string };
/** Requests are captured by each domain component; only the current scope may update its UI. */
function useScopedBulk<Request, Result>({ scopeKey, readOnly, run, complete, classifyError }: { scopeKey: string; readOnly: boolean;
    run?: (request: Request, context: { signal: AbortSignal }) => Result | Promise<Result>;
    complete: (request: Request, result: Result) => BulkCompletion;
    classifyError?: (cause: unknown, request: Request) => BulkCompletion;
}) {
    const [confirmation, setConfirmation] = useState<Request | null>(null), [pending, setPending] = useState(false), [error, setError] = useState<string | null>(null);
    const controller = useRef<AbortController | null>(null), generation = useRef(0), mounted = useRef(true), latest = useRef({ run, complete, classifyError });
    useLayoutEffect(() => { latest.current = { run, complete, classifyError }; });
    useLayoutEffect(() => {
        mounted.current = true; setConfirmation(null); setPending(false); setError(null);
        return () => { mounted.current = false; generation.current++; controller.current?.abort(); controller.current = null; };
    }, [scopeKey, readOnly]);
    const current = readOnly ? null : confirmation;
    const finish = (result: BulkCompletion) => { if (result.close) setConfirmation(null); setError(result.error ?? null); };
    const confirm = async () => {
        if (!current || readOnly || !latest.current.run || controller.current) return;
        const action = current, active = new AbortController(), token = ++generation.current;
        controller.current = active; setPending(true); setError(null);
        const valid = () => mounted.current && generation.current === token && controller.current === active && !active.signal.aborted;
        let result: Result;
        try { result = await latest.current.run(action, { signal: active.signal }); }
        catch (cause) {
            if (valid()) {
                let outcome: BulkCompletion;
                try { outcome = latest.current.classifyError?.(cause, action) ?? { close: false, error: "요청을 처리하지 못했습니다. 다시 시도해 주세요." }; }
                catch { outcome = { close: true, error: "오류 상태를 확인했지만 목록을 갱신하지 못했습니다." }; }
                if (valid()) { controller.current = null; setPending(false); finish(outcome); }
            }
            return;
        }
        if (!valid()) return;
        let outcome: BulkCompletion;
        try { outcome = latest.current.complete(action, result); }
        catch { outcome = { close: true, error: "요청은 완료됐지만 목록을 갱신하지 못했습니다." }; }
        if (valid()) { controller.current = null; setPending(false); finish(outcome); }
    };
    return { current, busy: pending && current !== null, error,
        begin: (request: Request) => { if (readOnly || controller.current || !run) return; setError(null); setConfirmation(request); },
        close: () => { if (!pending) { setConfirmation(null); setError(null); } }, confirm };
}

export type PrismCompanyGroupRow = { id: string; name: string; active: boolean; companies: readonly { id: string; name: string }[]; registrant?: string | null; createdAt?: string | null; updatedAt?: string | null };
export type PrismCompanyGroupFilterDraft = { statuses: readonly ("active" | "inactive")[]; companyIds: readonly string[]; keyword: string };
export type PrismCompanyGroupAppliedFilters = { isActive: boolean[]; companyIds: string[]; keyword: string };
export type PrismCompanyGroupSort = { column: "status" | "name" | "registrant" | "createdAt" | "updatedAt"; direction: "asc" | "desc" };
export type PrismCompanyGroupStatusRequest = { readonly ids: readonly string[]; readonly active: boolean };
export function createPrismCompanyGroupFilterDraft(companies: readonly PrismOption[]): PrismCompanyGroupFilterDraft {
    return { statuses: ["active", "inactive"], companyIds: companies.map(option => option.value), keyword: "" };
}
export function normalizePrismCompanyGroupFilters(draft: PrismCompanyGroupFilterDraft, companies: readonly PrismOption[]): PrismCompanyGroupAppliedFilters {
    return { isActive: partial(draft.statuses, 2).map(value => value === "active"), companyIds: partial(draft.companyIds, companies.length), keyword: draft.keyword.trim() };
}
export function createPrismCompanyGroupQuery(filters: PrismCompanyGroupAppliedFilters, page: number, sort: PrismCompanyGroupSort | null, size = 10) {
    if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(size) || size < 1) throw new RangeError("Page and size must be positive safe integers.");
    const fields = { status: "is_active", name: "name", registrant: "created_by", createdAt: "created_at", updatedAt: "updated_at" };
    return { page, size, keyword: filters.keyword.trim() || undefined, is_active: filters.isActive.length ? [...filters.isActive] : undefined, company_ids: filters.companyIds.length ? [...filters.companyIds] : undefined, sort: sort ? [`${fields[sort.column]}:${sort.direction}`] : undefined };
}
export type PrismCompanyGroupManagementProps = PageProps<PrismCompanyGroupRow, PrismCompanyGroupSort> & {
    filters: PrismCompanyGroupFilterDraft; onFiltersChange: (draft: PrismCompanyGroupFilterDraft) => void; onSearch: (filters: PrismCompanyGroupAppliedFilters) => void;
    onStatusChange?: (request: PrismCompanyGroupStatusRequest, context: { signal: AbortSignal }) => void | Promise<void>;
    onStatusApplied?: (request: PrismCompanyGroupStatusRequest) => void;
    classifyStatusError?: (cause: unknown) => { message: string; missing?: boolean };
    /** Reload after a host-classified missing-group response. No backend error shape is assumed. */
    onGroupsMissing?: (request: PrismCompanyGroupStatusRequest) => void;
};
const groupColumns: readonly PrismDirectoryColumn<PrismCompanyGroupRow>[] = [
    { id: "status", label: "상태", sortable: true, width: 80, cell: row => activeChip(row.active) },
    { id: "name", label: "회사 그룹명", sortable: true, width: 180, cell: row => <PrismTruncatedText text={row.name}/> },
    { id: "companies", label: "회사", cell: row => <PrismTruncatedText text={row.companies.map(company => company.name).join(", ") || "-"}/> },
    { id: "registrant", label: "등록자", sortable: true, width: 180, cell: row => <PrismTruncatedText text={display(row.registrant)}/> },
    { id: "createdAt", label: "등록일", sortable: true, width: 110, cell: row => display(row.createdAt) },
    { id: "updatedAt", label: "최근 수정일", sortable: true, width: 120, cell: row => display(row.updatedAt) },
];
export function PrismCompanyGroupManagement(props: PrismCompanyGroupManagementProps) {
    const { filters, onFiltersChange, onSearch, companies, rows, selected, onSelectionChange, page, pageCount, onPageChange, total, sort, onSortChange,
        onOpen, onCreate, scopeKey, onStatusChange, onStatusApplied, classifyStatusError, onGroupsMissing, loading = false, optionsLoading = false, readOnly = false, error, onRetry } = props;
    const selection = useRef(selected); useLayoutEffect(() => { selection.current = selected; }, [selected]);
    const removeProcessed = (ids: readonly string[]) => onSelectionChange(selection.current.filter(id => !ids.includes(id)));
    const bulk = useScopedBulk<PrismCompanyGroupStatusRequest, void>({ scopeKey, readOnly, run: onStatusChange,
        complete: request => { removeProcessed(request.ids); onStatusApplied?.(request); return { close: true }; },
        classifyError: (cause, request) => { const classified = classifyStatusError?.(cause); if (classified?.missing) { removeProcessed(request.ids); onGroupsMissing?.(request); return { close: true, error: classified.message }; }
            return { close: false, error: classified?.message || "회사 그룹 상태를 변경하지 못했습니다." }; } });
    const locked = loading || optionsLoading || bulk.busy;
    const update = (next: Partial<PrismCompanyGroupFilterDraft>) => onFiltersChange({ ...filters, ...next });
    const search = (draft: PrismCompanyGroupFilterDraft) => { onSelectionChange([]); onPageChange(1); onSearch(normalizePrismCompanyGroupFilters(draft, companies)); };
    const begin = (active: boolean) => { if (!locked && !error && !readOnly && selected.length) bulk.begin(Object.freeze({ ids: Object.freeze([...new Set(selected)]), active })); };
    const label = bulk.current?.active ? "활성화" : "비활성화";
    return <><PrismAdminLayout className="prism-admin-lists prism-admin-company-groups" title="회사 그룹 관리" breadcrumbs={["Admin", "회사 그룹 관리"]}
        filters={<form className="prism-admin-list-filter" onSubmit={event => { event.preventDefault(); if (!locked) search(filters); }}><div className="prism-admin-group-fields">
            <PrismMultiSelect label="상태" options={statusOptions} value={filters.statuses} onValueChange={statuses => update({ statuses: statuses as ("active" | "inactive")[] })} allToggleClearsSelection disabled={locked}/>
            <PrismMultiSelect label="회사" options={companies} value={filters.companyIds} onValueChange={companyIds => update({ companyIds })} searchable allToggleClearsSelection disabled={locked}/>
            <PrismInput label="검색어" value={filters.keyword} placeholder="검색어를 입력하세요" disabled={locked} onChange={event => update({ keyword: event.target.value })} onKeyDown={event => { if (event.key === "Enter" && (event.nativeEvent.isComposing || event.keyCode === 229)) event.preventDefault(); }}/>
        </div><div className="prism-admin-list-filter-actions"><PrismButton variant="line" disabled={locked} onClick={() => { const next = createPrismCompanyGroupFilterDraft(companies); onFiltersChange(next); search(next); }}>초기화</PrismButton><PrismButton type="submit" disabled={locked}>조회</PrismButton></div></form>}
        toolbar={<><div className="prism-admin-list-summary"><span>총 {total}건</span><span>·</span><span>선택 {selected.length}건</span>{onStatusChange&&<><PrismButton variant="line" disabled={!selected.length || readOnly || locked || !!error} onClick={() => begin(true)}>활성</PrismButton><PrismButton variant="line" disabled={!selected.length || readOnly || locked || !!error} onClick={() => begin(false)}>비활성</PrismButton></>}</div>{onCreate&&<PrismButton disabled={readOnly || locked} onClick={onCreate}>등록</PrismButton>}</>}
        pagination={!error && rows.length > 0 ? <PrismPagination page={page} pageCount={pageCount} pageButtonCount={10} disabled={bulk.busy} onPageChange={onPageChange}/> : undefined}>
        {!bulk.current&&bulk.error&&<p role="alert" className="prism-error">{bulk.error}</p>}
        {error ? <div role="alert" className="prism-admin-list-error">{error}{onRetry&&<PrismButton variant="line" onClick={onRetry}>다시 조회</PrismButton>}</div> : <PrismDirectoryTable title="회사 그룹 목록" variant="admin" columns={groupColumns} rows={rows} getRowId={row => row.id} getRowLabel={row => row.name} selected={selected} onSelectionChange={onSelectionChange}
            isRowSelectable={() => !readOnly && !locked} selectionBehavior="clear-all-if-any" openColumn="name" sort={sort} sortDisabled={locked} onSortChange={next => { onPageChange(1); onSortChange(next as PrismCompanyGroupSort); }} onOpen={bulk.busy ? undefined : onOpen} loading={loading}/>}
    </PrismAdminLayout><PrismConfirmDialog open={!!bulk.current} onOpenChange={open => { if (!open) bulk.close(); }} showIcon={false} title={`회사 그룹 ${label}`} confirmLabel={label} confirmTone={bulk.current?.active ? "primary" : "danger"}
        content={bulk.current?.active ? `선택한 회사 그룹 ${bulk.current.ids.length}개를 활성화하시겠습니까?` : <>회사 그룹을 비활성화 하면<br/>소속된 사용자가 모두 비활성화됩니다.<br/>선택한 회사 그룹 {bulk.current?.ids.length ?? 0}개를 비활성화하시겠습니까?</>} busy={bulk.busy} error={bulk.error ?? undefined} onConfirm={() => { void bulk.confirm(); }}/></>;
}

export type PrismNoticePopupStatus = "ACTIVE" | "INACTIVE" | "ENDED";
export type PrismNoticeListRow = { id: string; title: string; companies: readonly { id: string; name: string }[]; popupStatus: string | null;
    /** Host-normalized local dates, not UTC timestamps. */
    popupStartDate?: string | null; popupEndDate?: string | null; author?: { name?: string | null; company?: string | null; email?: string | null } | null; createdDate: string };
export type PrismNoticeFilterDraft = { companyIds: readonly string[]; popupStatus: readonly PrismNoticePopupStatus[]; popupFrom: string | null; popupTo: string | null; createdFrom: string | null; createdTo: string | null; keyword: string };
export type PrismNoticeAppliedFilters = Omit<PrismNoticeFilterDraft, "companyIds" | "popupStatus"> & { companyIds: string[]; popupStatus: PrismNoticePopupStatus[] };
export type PrismNoticeListSort = { column: "title" | "scope" | "popupStatus" | "popupPeriod" | "author" | "createdAt"; direction: "asc" | "desc" };
const popupLabels: Record<PrismNoticePopupStatus, string> = { ACTIVE: "노출", INACTIVE: "비노출", ENDED: "노출 종료" };
const popupLabel = (status: string | null) => status !== null && Object.hasOwn(popupLabels, status) ? popupLabels[status as PrismNoticePopupStatus] : "-";
const popupOptions: readonly PrismOption[] = Object.entries(popupLabels).map(([value, label]) => ({ value, label }));
export function createPrismNoticeFilterDraft(companies: readonly PrismOption[]): PrismNoticeFilterDraft { return { companyIds: companies.map(company => company.value), popupStatus: ["ACTIVE", "INACTIVE", "ENDED"], popupFrom: null, popupTo: null, createdFrom: null, createdTo: null, keyword: "" }; }
function validDate(value: string | null) { if (value === null) return true; if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false; const date = new Date(value + "T00:00:00.000Z"); return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value; }
export function preparePrismNoticeFilters(draft: PrismNoticeFilterDraft, companies: readonly PrismOption[]): { ok: true; filters: PrismNoticeAppliedFilters } | { ok: false; message: string } {
    if ([draft.popupFrom, draft.popupTo, draft.createdFrom, draft.createdTo].some(value => !validDate(value))) return { ok: false, message: "올바른 날짜를 입력해 주세요." };
    if (Boolean(draft.popupFrom) !== Boolean(draft.popupTo)) return { ok: false, message: "팝업 게시기간 검색 시작일과 종료일은 함께 입력해야 합니다" };
    if (draft.popupFrom && draft.popupTo && draft.popupFrom > draft.popupTo || draft.createdFrom && draft.createdTo && draft.createdFrom > draft.createdTo) return { ok: false, message: "종료일은 시작일 이후여야 합니다." };
    const date = (value: string | null) => value?.replaceAll("-", ".") ?? null;
    return { ok: true, filters: { companyIds: partial(draft.companyIds, companies.length), popupStatus: partial(draft.popupStatus, 3) as PrismNoticePopupStatus[],
        popupFrom: date(draft.popupFrom), popupTo: date(draft.popupTo), createdFrom: date(draft.createdFrom), createdTo: date(draft.createdTo), keyword: draft.keyword.trim() } };
}
export function hasPrismNoticeFilters(filters: PrismNoticeAppliedFilters) { return !!(filters.companyIds.length || filters.popupStatus.length || filters.popupFrom || filters.popupTo || filters.createdFrom || filters.createdTo || filters.keyword.trim()); }
export function createPrismNoticeListQuery(filters: PrismNoticeAppliedFilters, page: number, size = 10) {
    if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(size) || size < 1) throw new RangeError("Page and size must be positive safe integers.");
    return { page, size, company_ids: filters.companyIds.length ? [...filters.companyIds] : undefined, popup_status: filters.popupStatus.length ? [...filters.popupStatus] : undefined,
        popup_start_at: filters.popupFrom ?? undefined, popup_end_at: filters.popupTo ?? undefined, created_start_at: filters.createdFrom ?? undefined, created_end_at: filters.createdTo ?? undefined, keyword: filters.keyword.trim() || undefined };
}
const noticeScope = (row: PrismNoticeListRow) => row.companies.length ? row.companies.map(company => company.name).join(", ") : "전체 회사";
const noticeAuthor = (row: PrismNoticeListRow) => { const details = [row.author?.company, row.author?.email].filter(Boolean).join(", "); return details ? `${display(row.author?.name)}(${details})` : display(row.author?.name); };
/** Source API has no sort parameter: sort only the supplied page, preserving the host's total/page. */
export function sortPrismNoticePage<T extends PrismNoticeListRow>(rows: readonly T[], sort: PrismNoticeListSort | null): readonly T[] {
    if (!sort) return rows;
    const value = (row: PrismNoticeListRow) => ({ title: row.title, scope: noticeScope(row), popupStatus: popupLabel(row.popupStatus), popupPeriod: row.popupStartDate ?? "", author: row.author?.name ?? "", createdAt: row.createdDate })[sort.column];
    return [...rows].sort((a, b) => value(a).localeCompare(value(b), "ko") * (sort.direction === "asc" ? 1 : -1));
}
export type PrismNoticeDeleteRequest = { readonly ids: readonly string[] };
export type PrismNoticeDeleteResult = { deletedIds: readonly string[]; failures: readonly { id: string; message: string }[] };
export function validatePrismNoticeDeletion(request: PrismNoticeDeleteRequest, result: PrismNoticeDeleteResult): void {
    const expected = new Set(request.ids), received = [...result.deletedIds, ...result.failures.map(failure => failure.id)];
    if (received.length !== expected.size || new Set(received).size !== received.length || received.some(id => !expected.has(id))) throw new Error("삭제 결과의 항목을 확인하지 못했습니다. 목록을 다시 조회해 주세요.");
}
/** Bounded, abort-aware adapter for a per-notice service. Failed IDs are explicit, never counted as deleted. */
export async function settlePrismNoticeDeletion(request: PrismNoticeDeleteRequest, deleteOne: (id: string, context: { signal: AbortSignal }) => void | Promise<void>, context: { signal: AbortSignal; concurrency?: number; getErrorMessage?: (cause: unknown) => string }): Promise<PrismNoticeDeleteResult> {
    const { signal, concurrency = 4, getErrorMessage } = context;
    if (!Number.isSafeInteger(concurrency) || concurrency < 1) throw new RangeError("Concurrency must be a positive safe integer.");
    signal.throwIfAborted(); const ids = [...new Set(request.ids)], results = new Map<string, { deleted: boolean; message?: string }>(); let next = 0;
    const worker = async () => { while (next < ids.length) { signal.throwIfAborted(); const id = ids[next++]; try { await deleteOne(id, { signal }); results.set(id, { deleted: true }); } catch (cause) { signal.throwIfAborted(); results.set(id, { deleted: false, message: getErrorMessage?.(cause) || "삭제하지 못했습니다." }); } } };
    await Promise.all(Array.from({ length: Math.min(concurrency, ids.length) }, worker)); signal.throwIfAborted();
    return { deletedIds: ids.filter(id => results.get(id)?.deleted), failures: ids.filter(id => !results.get(id)?.deleted).map(id => ({ id, message: results.get(id)?.message || "삭제하지 못했습니다." })) };
}
export type PrismNoticeManagementProps = PageProps<PrismNoticeListRow, PrismNoticeListSort> & {
    filters: PrismNoticeFilterDraft; applied: PrismNoticeAppliedFilters; onFiltersChange: (draft: PrismNoticeFilterDraft) => void; onSearch: (filters: PrismNoticeAppliedFilters) => void;
    onDelete?: (request: PrismNoticeDeleteRequest, context: { signal: AbortSignal }) => PrismNoticeDeleteResult | Promise<PrismNoticeDeleteResult>;
    onDeletionApplied?: (request: PrismNoticeDeleteRequest, result: PrismNoticeDeleteResult) => void; getDeleteErrorMessage?: (cause: unknown) => string;
    dateInputEditable?: boolean;
};
const noticeColumns: readonly PrismDirectoryColumn<PrismNoticeListRow>[] = [
    { id: "title", label: "제목", sortable: true, cell: row => <PrismTruncatedText text={row.title}/> },
    { id: "scope", label: "노출 범위", sortable: true, width: 190, cell: row => row.companies.length ? <PrismTruncatedText text={noticeScope(row)}/> : <PrismChip color="#363636">전체 회사</PrismChip> },
    { id: "popupStatus", label: "팝업노출", sortable: true, width: 110, cell: row => <PrismChip color={row.popupStatus === "ACTIVE" ? "#009A93" : "#363636"}>{popupLabel(row.popupStatus)}</PrismChip> },
    { id: "popupPeriod", label: "팝업 게시 기간", sortable: true, width: 210, cell: row => row.popupStartDate && row.popupEndDate ? `${row.popupStartDate} ~ ${row.popupEndDate}` : "-" },
    { id: "author", label: "작성자", sortable: true, width: 200, cell: row => <PrismTruncatedText text={noticeAuthor(row)}/> },
    { id: "createdAt", label: "등록일", sortable: true, width: 120, cell: row => row.createdDate },
];
export function PrismNoticeManagement(props: PrismNoticeManagementProps) {
    const { filters, applied, onFiltersChange, onSearch, companies, rows, selected, onSelectionChange, page, pageCount, onPageChange, total, sort, onSortChange, onOpen, onCreate,
        scopeKey, onDelete, onDeletionApplied, getDeleteErrorMessage, loading = false, optionsLoading = false, readOnly = false, error, onRetry, dateInputEditable = false } = props;
    const [filterError, setFilterError] = useState<string | null>(null);
    const selection = useRef(selected); useLayoutEffect(() => { selection.current = selected; }, [selected]);
    useLayoutEffect(() => { setFilterError(null); }, [scopeKey]);
    const bulk = useScopedBulk<PrismNoticeDeleteRequest, PrismNoticeDeleteResult>({ scopeKey, readOnly,
        run: onDelete ? async (request, context) => { const result = await onDelete(request, context); validatePrismNoticeDeletion(request, result); return result; } : undefined,
        complete: (request, result) => {
            onSelectionChange(selection.current.filter(id => !result.deletedIds.includes(id)));
            if (result.deletedIds.length) { if (page > 1 && rows.length && rows.every(row => result.deletedIds.includes(row.id))) onPageChange(page - 1); onDeletionApplied?.(request, result); }
            return { close: result.deletedIds.length > 0 || result.failures.length === 0, error: result.failures.length ? `${result.deletedIds.length}건 삭제, ${result.failures.length}건 실패. ${result.failures.map(failure => failure.message).join(" ")}` : undefined };
        }, classifyError: cause => ({ close: false, error: getDeleteErrorMessage?.(cause) || "공지를 삭제하지 못했습니다. 다시 시도해 주세요." }) });
    const locked = loading || optionsLoading || bulk.busy;
    const update = (next: Partial<PrismNoticeFilterDraft>) => { setFilterError(null); onFiltersChange({ ...filters, ...next }); };
    const search = (draft: PrismNoticeFilterDraft) => { const result = preparePrismNoticeFilters(draft, companies); if (!result.ok) { setFilterError(result.message); return; } setFilterError(null); onSelectionChange([]); onPageChange(1); onSearch(result.filters); };
    const datePair = (label: string, from: "popupFrom" | "createdFrom", to: "popupTo" | "createdTo") => <fieldset className="prism-admin-list-date"><legend>{label}</legend><div>
        <PrismDatePicker label={`${label} 시작일`} value={filters[from]} displayFormat="YYYY.MM.DD" placeholder="시작일" disabled={locked} inputEditable={dateInputEditable} onValueChange={value => update({ [from]: value })}/><span aria-hidden="true">-</span>
        <PrismDatePicker label={`${label} 종료일`} value={filters[to]} displayFormat="YYYY.MM.DD" placeholder="종료일" disabled={locked} inputEditable={dateInputEditable} min={filters[from] && validDate(filters[from]) ? filters[from]! : undefined} onValueChange={value => update({ [to]: value })}/></div></fieldset>;
    if (!loading && !error && !bulk.current && total === 0 && !hasPrismNoticeFilters(applied)) return <PrismAdminLayout className="prism-admin-lists prism-admin-notices" title="공지사항 관리" breadcrumbs={["Admin", "공지사항 관리"]}>
        <div className="prism-admin-notice-empty"><PrismEmptyState title="등록된 공지사항이 없습니다" description="공지사항을 등록해 보세요." icon={<PrismIcon name="NoSearchResultIcon" size={140}/>}/>{bulk.error&&<p role="alert" className="prism-error">{bulk.error}</p>}{onCreate&&<PrismButton variant="line" disabled={readOnly} onClick={onCreate}>공지사항 등록</PrismButton>}</div></PrismAdminLayout>;
    return <><PrismAdminLayout className="prism-admin-lists prism-admin-notices" title="공지사항 관리" breadcrumbs={["Admin", "공지사항 관리"]}
        filters={<form className="prism-admin-list-filter" onSubmit={event => { event.preventDefault(); if (locked) return; if (event.currentTarget.querySelector('input[aria-invalid="true"]')) { setFilterError("올바른 날짜를 입력해 주세요."); return; } search(filters); }}><div className="prism-admin-notice-filter-stack"><div className="prism-admin-notice-fields">
            <PrismMultiSelect label="노출 범위" options={companies} value={filters.companyIds} onValueChange={companyIds => update({ companyIds })} searchable allToggleClearsSelection disabled={locked}/>
            <PrismMultiSelect label="팝업 노출" options={popupOptions} value={filters.popupStatus} onValueChange={popupStatus => update({ popupStatus: popupStatus as PrismNoticePopupStatus[] })} allToggleClearsSelection disabled={locked}/>
            {datePair("팝업 게시 기간", "popupFrom", "popupTo")}{datePair("등록일", "createdFrom", "createdTo")}</div>
            <div className="prism-admin-notice-keyword"><PrismInput label="검색어" value={filters.keyword} placeholder="검색어를 입력하세요" disabled={locked} onChange={event => update({ keyword: event.target.value })} onKeyDown={event => { if (event.key === "Enter" && (event.nativeEvent.isComposing || event.keyCode === 229)) event.preventDefault(); }}/></div>
            {filterError&&<p role="alert" className="prism-error">{filterError}</p>}</div><div className="prism-admin-list-filter-actions"><PrismButton variant="line" disabled={locked} onClick={() => { const next = createPrismNoticeFilterDraft(companies); onFiltersChange(next); search(next); }}>초기화</PrismButton><PrismButton type="submit" disabled={locked}>조회</PrismButton></div></form>}
        toolbar={<><div className="prism-admin-list-summary"><span>총 {total}건</span><span>·</span><span>선택 {selected.length}건</span>{onDelete&&<PrismButton variant="line" disabled={!selected.length || readOnly || locked || !!error} onClick={() => bulk.begin(Object.freeze({ ids: Object.freeze([...new Set(selected)]) }))}>삭제</PrismButton>}</div>{onCreate&&<PrismButton disabled={readOnly || locked} onClick={onCreate}>등록</PrismButton>}</>}
        pagination={!error && rows.length ? <PrismPagination page={page} pageCount={pageCount} pageButtonCount={10} disabled={bulk.busy} onPageChange={onPageChange}/> : undefined}>
        <p className="prism-admin-page-sort-note">정렬은 현재 페이지에 적용됩니다.</p>{!bulk.current&&bulk.error&&<p role="alert" className="prism-error">{bulk.error}</p>}
        {error ? <div role="alert" className="prism-admin-list-error">{error}{onRetry&&<PrismButton variant="line" onClick={onRetry}>다시 조회</PrismButton>}</div> : <PrismDirectoryTable title="공지사항 목록" variant="admin" rows={sortPrismNoticePage(rows, sort)} columns={noticeColumns}
            getRowId={row => row.id} getRowLabel={row => row.title} selected={selected} onSelectionChange={onSelectionChange} isRowSelectable={() => !readOnly && !locked} selectionBehavior="clear-all-if-any" openColumn="title"
            sort={sort} sortDisabled={locked} onSortChange={next => onSortChange(next as PrismNoticeListSort)} onOpen={bulk.busy ? undefined : onOpen} loading={loading}/>}
    </PrismAdminLayout><PrismConfirmDialog open={!!bulk.current} onOpenChange={open => { if (!open) bulk.close(); }} title="삭제" type="error" confirmTone="danger" confirmLabel="삭제"
        content={<>삭제 후 복구할 수 없습니다.<br/>선택한 공지 {bulk.current?.ids.length ?? 0}개를 삭제하시겠습니까?</>} busy={bulk.busy} error={bulk.error ?? undefined} onConfirm={() => { void bulk.confirm(); }}/></>;
}
