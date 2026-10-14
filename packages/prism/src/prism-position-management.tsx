import { useLayoutEffect, useRef, useState } from "react";
import { PrismAdminLayout, PrismAdminSyncStatusBar, PrismTruncatedText, type PrismAdminSyncStatus } from "./prism-admin";
import { PrismDirectoryTable, type PrismDirectoryColumn } from "./prism-directory";
import { PrismButton } from "./prism-button";
import { PrismTag } from "./prism-badge";
import { PrismInput } from "./prism-field";
import { PrismMultiSelect, PrismPagination, type PrismOption } from "./prism-selection";
import { PrismConfirmDialog } from "./prism-dialog";
import { PrismTabs, PrismTabsList, PrismTabsTrigger, PrismTabsContent } from "./prism-tabs";

export type PrismPositionSource = "LIVE" | "TEMP";
export type PrismPositionChangeFilter = "CREATE" | "UPDATE" | "DELETE" | "UNCHANGED";
export type PrismPositionChangeStatus = PrismPositionChangeFilter | "PROGRESS" | "FAILED";
export type PrismPositionSyncStatus = PrismAdminSyncStatus;
export type PrismPositionFilterOptions = { companies: readonly PrismOption[]; industries: readonly PrismOption[]; jobs: readonly PrismOption[]; roles: readonly PrismOption[] };
export type PrismPositionFilterDraft = { kinds: readonly ("key" | "normal")[]; companyIds: readonly string[]; industryBlockIds: readonly string[]; jobBlockIds: readonly string[]; roleBlockIds: readonly string[]; changeStatus: readonly PrismPositionChangeFilter[]; keyword: string };
export type PrismPositionAppliedFilters = { isKeyPosition?: boolean; companyIds: readonly string[]; industryBlockIds: readonly string[]; jobBlockIds: readonly string[]; roleBlockIds: readonly string[]; changeStatus: readonly PrismPositionChangeFilter[]; keyword: string };
export type PrismPositionListSort = { column: "kind" | "company" | "name" | "changeStatus" | "industry" | "role" | "job" | "updatedAt"; direction: "asc" | "desc" };
export type PrismPositionListState = { source: PrismPositionSource; filters: PrismPositionFilterDraft; applied: PrismPositionAppliedFilters; page: number; sort: PrismPositionListSort | null };
export type PrismPositionListRow = { id: string; name: string; isKeyPosition: boolean; company?: string | null; industry?: string | null; role?: string | null; mainJob?: string | null; subJob?: string | null; changeStatus?: PrismPositionChangeStatus | null; updatedAt?: string | null };
const kinds: readonly PrismOption[] = [{ value: "key", label: "핵심" }, { value: "normal", label: "일반" }];
const changes: readonly PrismOption[] = [{ value: "CREATE", label: "생성됨" }, { value: "UPDATE", label: "수정됨" }, { value: "DELETE", label: "삭제됨" }, { value: "UNCHANGED", label: "-" }];
const changeLabels: Record<PrismPositionChangeStatus, string> = { CREATE: "생성됨", UPDATE: "수정됨", DELETE: "삭제됨", UNCHANGED: "-", PROGRESS: "반영중", FAILED: "반영실패" };
const values = (options: readonly PrismOption[]) => options.map(option => option.value);
export function createPrismPositionFilterDraft(options: PrismPositionFilterOptions): PrismPositionFilterDraft {
    return { kinds: ["key", "normal"], companyIds: values(options.companies), industryBlockIds: values(options.industries), jobBlockIds: values(options.jobs), roleBlockIds: values(options.roles), changeStatus: ["CREATE", "UPDATE", "DELETE", "UNCHANGED"], keyword: "" };
}
export function normalizePrismPositionFilters(draft: PrismPositionFilterDraft, options: PrismPositionFilterOptions, source: PrismPositionSource): PrismPositionAppliedFilters {
    const partial = (selected: readonly string[], count: number) => selected.length > 0 && selected.length < count ? [...selected] : [];
    return { isKeyPosition: draft.kinds.length === 1 ? draft.kinds[0] === "key" : undefined, companyIds: partial(draft.companyIds, options.companies.length),
        industryBlockIds: partial(draft.industryBlockIds, options.industries.length), jobBlockIds: partial(draft.jobBlockIds, options.jobs.length), roleBlockIds: partial(draft.roleBlockIds, options.roles.length),
        changeStatus: source === "TEMP" ? partial(draft.changeStatus, changes.length) as PrismPositionChangeFilter[] : [], keyword: draft.keyword.trim() };
}
export function createPrismPositionListState(source: PrismPositionSource, options: PrismPositionFilterOptions): PrismPositionListState {
    const filters = createPrismPositionFilterDraft(options);
    return { source, filters, applied: normalizePrismPositionFilters(filters, options, source), page: 1, sort: { column: "updatedAt", direction: "desc" } };
}
/** Call once after each version's metadata load. A restored draft must survive that first load. */
export function initializePrismPositionOptions(state: PrismPositionListState, options: PrismPositionFilterOptions, restored: boolean): PrismPositionListState {
    if (restored) return state;
    const defaults = createPrismPositionFilterDraft(options);
    return { ...state, filters: { ...state.filters, companyIds: defaults.companyIds, industryBlockIds: defaults.industryBlockIds, jobBlockIds: defaults.jobBlockIds, roleBlockIds: defaults.roleBlockIds } };
}
const copyFilters = (filters: PrismPositionFilterDraft): PrismPositionFilterDraft => ({ kinds: [...filters.kinds], companyIds: [...filters.companyIds], industryBlockIds: [...filters.industryBlockIds], jobBlockIds: [...filters.jobBlockIds], roleBlockIds: [...filters.roleBlockIds], changeStatus: [...filters.changeStatus], keyword: filters.keyword });
const copyApplied = (filters: PrismPositionAppliedFilters): PrismPositionAppliedFilters => ({ isKeyPosition: filters.isKeyPosition, companyIds: [...filters.companyIds], industryBlockIds: [...filters.industryBlockIds], jobBlockIds: [...filters.jobBlockIds], roleBlockIds: [...filters.roleBlockIds], changeStatus: [...filters.changeStatus], keyword: filters.keyword });
const copyState = (state: PrismPositionListState): PrismPositionListState => ({ source: state.source, filters: copyFilters(state.filters), applied: copyApplied(state.applied), page: state.page, sort: state.sort ? { column: state.sort.column, direction: state.sort.direction } : null });
export type PrismPositionListSnapshot = { readonly contextKey: string; readonly locationKey: string; readonly state: PrismPositionListState };
/** Host-owned, in-memory snapshot. It contains no records, selected IDs, credentials or application internals. */
export function capturePrismPositionListSnapshot(state: PrismPositionListState, context: { contextKey: string; locationKey: string }): PrismPositionListSnapshot {
    return { contextKey: context.contextKey, locationKey: context.locationKey, state: copyState(state) };
}
export function restorePrismPositionListSnapshot(snapshot: PrismPositionListSnapshot | null | undefined, context: { contextKey: string; locationKey: string; source: PrismPositionSource; routeState?: unknown }): PrismPositionListState | null {
    const explicit = typeof context.routeState === "object" && context.routeState !== null && "restoreList" in context.routeState && context.routeState.restoreList === true;
    return snapshot && snapshot.contextKey === context.contextKey && snapshot.state.source === context.source && (explicit || snapshot.locationKey === context.locationKey) ? copyState(snapshot.state) : null;
}
const sortFields: Record<PrismPositionListSort["column"], string> = { kind: "is_key_position", company: "company_name", name: "name", changeStatus: "is_update", industry: "industry_name", role: "role_name", job: "main_job_name", updatedAt: "updated_at" };
export type PrismPositionListQuery = { source: PrismPositionSource; page?: number; size?: number; unpaged?: true; name?: string; is_key_position?: boolean; company_id: string[]; industry_block_id: string[]; job_block_id: string[]; role_block_id: string[]; sort?: string[] };
export function createPrismPositionListQuery(state: PrismPositionListState, size = 10): PrismPositionListQuery {
    if (!Number.isSafeInteger(size) || size < 1 || !Number.isSafeInteger(state.page) || state.page < 1) throw new RangeError("Page and size must be positive safe integers.");
    const filters = state.applied;
    return { source: state.source, ...(state.source === "TEMP" && filters.changeStatus.length ? { unpaged: true as const } : { page: state.page, size }),
        name: filters.keyword.trim() || undefined, is_key_position: filters.isKeyPosition, company_id: [...filters.companyIds], industry_block_id: [...filters.industryBlockIds], job_block_id: [...filters.jobBlockIds], role_block_id: [...filters.roleBlockIds],
        sort: state.sort ? [`${sortFields[state.sort.column]}:${state.sort.direction}`] : undefined };
}
export type PrismPositionListResult<T extends PrismPositionListRow = PrismPositionListRow> = { kind: "all"; rows: readonly T[] } | { kind: "page"; rows: readonly T[]; total: number; pageCount: number };
/** Preserve provider ordering. Client-only change filters require a complete result, never one server page. */
export function paginatePrismPositions<T extends PrismPositionListRow>(result: PrismPositionListResult<T>, state: PrismPositionListState, size = 10): { rows: readonly T[]; total: number; pageCount: number; page: number } {
    createPrismPositionListQuery(state, size);
    const changeFilter = state.source === "TEMP" ? state.applied.changeStatus : [];
    if (result.kind === "page") {
        if (changeFilter.length) throw new Error("Change-status filtering requires the complete unpaged result.");
        if (!Number.isSafeInteger(result.total) || result.total < 0 || !Number.isSafeInteger(result.pageCount) || result.pageCount < 1) throw new RangeError("Invalid server pagination.");
        return { rows: result.rows, total: result.total, pageCount: result.pageCount, page: Math.min(state.page, result.pageCount) };
    }
    const rows = changeFilter.length ? result.rows.filter(row => row.changeStatus != null && changeFilter.includes(row.changeStatus as PrismPositionChangeFilter)) : result.rows;
    const pageCount = Math.max(1, Math.ceil(rows.length / size)), page = Math.min(state.page, pageCount);
    return { rows: rows.slice((page - 1) * size, page * size), total: rows.length, pageCount, page };
}
export function PrismPositionSyncBar({ status, date, onSync, onCancel, loading = false, disabled = false, note }: {
    status: PrismPositionSyncStatus; date: string; onSync?: () => void; onCancel?: () => void; loading?: boolean; disabled?: boolean; note?: string;
}) {
    return <PrismAdminSyncStatusBar status={status} date={date} onSync={onSync} onCancelSync={onCancel} loading={loading} syncDisabled={disabled} note={note}/>;
}
export type PrismPositionAction = { readonly type: "delete"; readonly ids: readonly string[] } | { readonly type: "schedule" | "cancel" };
export type PrismPositionActionResult = { outcome: "applied" | "no-changes" };
export type PrismPositionManagementProps = PrismPositionFilterOptions & {
    state: PrismPositionListState; onStateChange: (state: PrismPositionListState) => void;
    rows: readonly PrismPositionListRow[]; total: number; pageCount: number; selected: readonly string[]; onSelectionChange: (ids: string[]) => void;
    onOpen: (row: PrismPositionListRow, state: PrismPositionListState) => void; onCreate?: (state: PrismPositionListState) => void;
    sync: { status: PrismPositionSyncStatus; date: string; loading?: boolean }; readOnly?: boolean; loading?: boolean; optionsLoading?: boolean; error?: string; onRetry?: () => void;
    /** Change for applied query, account/permission or provider replacement. */
    scopeKey: string; onAction?: (request: PrismPositionAction, context: { signal: AbortSignal; source: "TEMP" }) => PrismPositionActionResult | Promise<PrismPositionActionResult>;
    onActionApplied?: (request: PrismPositionAction, result: PrismPositionActionResult) => void; getActionErrorMessage?: (error: unknown) => string;
    /** Supply a host-owned schedule description when the deployment uses a different schedule. */
    scheduleDescription?: string;
};
const display = (value?: string | null) => value?.trim() || "-";
const columnsFor = (source: PrismPositionSource): readonly PrismDirectoryColumn<PrismPositionListRow>[] => [
    { id: "kind", label: "구분", sortable: true, width: 80, cell: row => <PrismTag variant={row.isKeyPosition ? "blue" : "gray"}>{row.isKeyPosition ? "핵심" : "일반"}</PrismTag> },
    { id: "company", label: "회사", sortable: true, width: "24%", cell: row => display(row.company) },
    { id: "name", label: "포지션 명", sortable: true, width: "34%", cell: row => <PrismTruncatedText text={row.name}/> },
    ...(source === "TEMP" ? [{ id: "changeStatus", label: "변경 상태", sortable: true, width: 100, cell: (row: PrismPositionListRow) => row.changeStatus ? changeLabels[row.changeStatus] : "-" }] : []),
    { id: "industry", label: "산업", sortable: true, width: "22%", cell: row => display(row.industry) },
    { id: "role", label: "직책", sortable: true, width: 110, cell: row => display(row.role) },
    { id: "job", label: "직무", sortable: true, width: "20%", cell: row => <PrismTruncatedText text={[row.mainJob, row.subJob].filter(Boolean).join(", ") || "-"}/> },
    { id: "updatedAt", label: "최근 수정일", sortable: true, width: 130, cell: row => display(row.updatedAt) },
];
const liveColumns = columnsFor("LIVE"), tempColumns = columnsFor("TEMP");
/** Controlled list composition. The host owns services, authorization, routing, metadata and cache refresh. */
export function PrismPositionManagement(props: PrismPositionManagementProps) {
    const { state, onStateChange, rows, total, pageCount, selected, onSelectionChange, onOpen, onCreate, sync, scopeKey, onAction, onActionApplied,
        getActionErrorMessage, readOnly = false, loading = false, optionsLoading = false, error, onRetry,
        scheduleDescription = "동기화한 내용은 포지션 정보와 함께 익일 새벽 3시에 시스템에 반영됩니다." } = props;
    if (!Number.isSafeInteger(total) || total < 0 || !Number.isSafeInteger(pageCount) || pageCount < 1) throw new RangeError("Invalid position pagination.");
    const editing = state.source === "TEMP", editable = editing && !readOnly && sync.status !== "scheduled" && sync.status !== "running";
    const [confirmation, setConfirmation] = useState<PrismPositionAction | null>(null), [pending, setPending] = useState(false), [actionError, setActionError] = useState<string | null>(null);
    const operation = useRef<AbortController | null>(null), generation = useRef(0), mounted = useRef(true), latestSelected = useRef(selected);
    useLayoutEffect(() => { latestSelected.current = selected; }, [selected]);
    useLayoutEffect(() => {
        mounted.current = true; setConfirmation(null); setPending(false); setActionError(null);
        return () => { mounted.current = false; generation.current++; operation.current?.abort(); operation.current = null; };
    }, [scopeKey, state.source, readOnly, sync.status]);
    const permitted = (type: PrismPositionAction["type"]) => editing && !readOnly && (type === "delete" ? editable : type === "cancel" ? sync.status === "scheduled" : sync.status === "editing" || sync.status === "failed");
    const current = confirmation && permitted(confirmation.type) ? confirmation : null;
    const busy = pending && !!current, locked = loading || optionsLoading || busy;
    const apply = (filters: PrismPositionFilterDraft) => { onSelectionChange([]); onStateChange({ ...state, filters, applied: normalizePrismPositionFilters(filters, props, state.source), page: 1 }); };
    const update = (filters: Partial<PrismPositionFilterDraft>) => onStateChange({ ...state, filters: { ...state.filters, ...filters } });
    const request = (type: PrismPositionAction["type"]) => {
        if (!onAction || !permitted(type) || locked || sync.loading) return;
        const ids = [...new Set(selected)].filter(id => !rows.some(row => row.id === id && row.changeStatus === "PROGRESS"));
        if (type === "delete" && !ids.length) return;
        setActionError(null); setConfirmation(type === "delete" ? Object.freeze({ type, ids: Object.freeze(ids) }) : Object.freeze({ type }));
    };
    const confirm = async () => {
        if (!current || !onAction || operation.current || !permitted(current.type)) return;
        const controller = new AbortController(), token = ++generation.current, action = current;
        operation.current = controller; setPending(true); setActionError(null);
        const valid = () => mounted.current && generation.current === token && operation.current === controller && !controller.signal.aborted;
        let result: PrismPositionActionResult | undefined;
        try { result = await onAction(action, { signal: controller.signal, source: "TEMP" }); }
        catch (cause) { if (valid()) setActionError(getActionErrorMessage?.(cause) || "요청을 처리하지 못했습니다. 다시 시도해 주세요."); }
        finally { if (valid()) { operation.current = null; setPending(false); } }
        if (result && mounted.current && generation.current === token && !controller.signal.aborted) {
            setConfirmation(null);
            try {
                if (result.outcome === "applied") {
                    if (action.type === "delete") {
                        onSelectionChange(latestSelected.current.filter(id => !action.ids.includes(id)));
                        if (state.page > 1 && rows.length > 0 && rows.every(row => action.ids.includes(row.id))) onStateChange({ ...state, page: state.page - 1 });
                    } else if (action.type === "schedule") onSelectionChange([]);
                }
                onActionApplied?.(action, result);
            } catch { if (mounted.current && generation.current === token) setActionError("요청은 완료됐지만 목록을 갱신하지 못했습니다."); }
        }
    };
    const title = current?.type === "delete" ? "삭제" : current?.type === "cancel" ? "동기화 취소" : "동기화 실행";
    const content = current?.type === "delete" ? <>삭제 후 복구할 수 없습니다.<br/>선택한 포지션 {current.ids.length}개를 삭제하시겠습니까?</> : current?.type === "cancel" ? <>예약된 동기화가 취소되며, 해당 버전은 다시 편집할 수 있습니다.<br/>취소된 버전은 후보 추천에 반영되지 않습니다.</> : <>{scheduleDescription}<br/>동기화 예정 상태에서는 포지션 블럭 및 관련 포지션 정보를 편집할 수 없습니다.</>;
    const draft = state.filters;
    const filters = <form className="prism-position-filter-bar" onSubmit={event => { event.preventDefault(); if (!locked) apply(draft); }}>
        <div className="prism-position-filter-fields" data-source={state.source}>
            <PrismMultiSelect label="구분" options={kinds} value={draft.kinds} onValueChange={next => update({ kinds: next as ("key" | "normal")[] })} allToggleClearsSelection disabled={locked}/>
            <PrismMultiSelect label="회사" options={props.companies} value={draft.companyIds} onValueChange={companyIds => update({ companyIds })} searchable allToggleClearsSelection disabled={locked}/>
            {editing&&<PrismMultiSelect label="변경 상태" options={changes} value={draft.changeStatus} onValueChange={next => update({ changeStatus: next as PrismPositionChangeFilter[] })} allToggleClearsSelection disabled={locked}/>}
            <PrismMultiSelect label="산업" options={props.industries} value={draft.industryBlockIds} onValueChange={industryBlockIds => update({ industryBlockIds })} searchable allToggleClearsSelection disabled={locked}/>
            <PrismMultiSelect label="직무" options={props.jobs} value={draft.jobBlockIds} onValueChange={jobBlockIds => update({ jobBlockIds })} searchable allToggleClearsSelection disabled={locked}/>
            <PrismMultiSelect label="직책" options={props.roles} value={draft.roleBlockIds} onValueChange={roleBlockIds => update({ roleBlockIds })} allToggleClearsSelection disabled={locked}/>
            <PrismInput className="prism-position-keyword" label="검색어" placeholder="검색어를 입력하세요" value={draft.keyword} onChange={event => update({ keyword: event.target.value })} disabled={locked} onKeyDown={event => { if (event.key === "Enter" && (event.nativeEvent.isComposing || event.keyCode === 229)) event.preventDefault(); }}/>
        </div><div className="prism-position-filter-actions"><PrismButton variant="line" disabled={locked} onClick={() => apply(createPrismPositionFilterDraft(props))}>초기화</PrismButton><PrismButton type="submit" disabled={locked}>조회</PrismButton></div>
    </form>;
    return <><PrismAdminLayout title="포지션 관리" className="prism-admin-positions" breadcrumbs={["Admin", "포지션 관리"]}>
        <PrismTabs value={state.source} onValueChange={value => { if (locked || value === state.source) return; const next = createPrismPositionListState(value as PrismPositionSource, props); onSelectionChange([]); onStateChange({ ...next, filters: { ...next.filters, kinds: [...draft.kinds], changeStatus: [...draft.changeStatus] }, sort: state.sort }); }}>
            <PrismTabsList variant="fill" aria-label="포지션 버전"><PrismTabsTrigger value="LIVE" disabled={busy}>현재 반영 버전</PrismTabsTrigger><PrismTabsTrigger value="TEMP" disabled={busy}>편집 버전</PrismTabsTrigger></PrismTabsList>
            <PrismTabsContent value={state.source}><div className="prism-position-content">
                <PrismPositionSyncBar {...sync} disabled={locked || readOnly} onSync={editing && onAction ? () => request("schedule") : undefined} onCancel={editing && onAction ? () => request("cancel") : undefined} loading={loading || sync.loading}/>
                {filters}<div className="prism-position-toolbar"><div className="prism-position-list-summary"><span>총 {total}건</span>{editing&&<><span>·</span><span>선택 {selected.length}건</span>{onAction&&<PrismButton variant="line" disabled={!selected.length || !editable || locked || !!sync.loading} onClick={() => request("delete")}>삭제</PrismButton>}</>}</div>
                    {editing && onCreate&&<PrismButton disabled={!editable || locked || !!sync.loading} onClick={() => onCreate(state)}>등록</PrismButton>}</div>
                {error ? <div role="alert" className="prism-position-error">{error}{onRetry&&<PrismButton variant="line" onClick={onRetry}>다시 조회</PrismButton>}</div> : <>
                    <PrismDirectoryTable title="포지션 목록" variant="admin" rows={rows} columns={editing ? tempColumns : liveColumns} getRowId={row => row.id} getRowLabel={row => row.name} selected={selected}
                        onSelectionChange={editable && !sync.loading ? onSelectionChange : undefined} isRowSelectable={row => !locked && row.changeStatus !== "PROGRESS"} selectionBehavior="clear-all-if-any" openColumn="name"
                        sort={state.sort} sortDisabled={locked} onSortChange={sort => onStateChange({ ...state, sort: sort as PrismPositionListSort, page: 1 })} onOpen={busy ? undefined : row => onOpen(row, state)} loading={loading}/>
                    {!!rows.length&&<PrismPagination page={state.page} pageCount={pageCount} pageButtonCount={10} disabled={busy} onPageChange={page => onStateChange({ ...state, page })}/>}</>}
                {!current&&actionError&&<p role="alert" className="prism-error">{actionError}</p>}
            </div></PrismTabsContent>
        </PrismTabs>
    </PrismAdminLayout><PrismConfirmDialog open={!!current} onOpenChange={open => { if (!open && !busy) { setConfirmation(null); setActionError(null); } }} title={title} content={content}
        confirmLabel={current?.type === "delete" ? "삭제" : current?.type === "cancel" ? "동기화 취소" : "동기화"} type={current?.type === "delete" ? "error" : "success"} confirmTone={current?.type === "delete" ? "danger" : "primary"} busy={busy} error={actionError ?? undefined} onConfirm={() => { void confirm(); }}/></>;
}
