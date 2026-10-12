import { useLayoutEffect, useRef, useState } from "react";
import { PrismAdminLayout } from "./prism-admin";
import { PrismDirectoryTable, type PrismDirectoryColumn } from "./prism-directory";
import { PrismButton } from "./prism-button";
import { PrismChip } from "./prism-badge";
import { PrismInput, PrismSelect } from "./prism-field";
import { PrismMultiSelect, PrismPagination, type PrismOption } from "./prism-selection";
import { PrismConfirmDialog } from "./prism-dialog";

export type PrismUserListRow = { id: string; active: boolean; name: string | null; company: string | null; email: string | null; role: string | null; companyGroup?: { name: string; active?: boolean | null } | null };
export type PrismUserFilterDraft = { statuses: readonly ("active" | "inactive")[]; companyIds: readonly string[]; roleCode: string; companyGroupIds: readonly string[]; keyword: string };
export type PrismUserAppliedFilters = { isActive: boolean[]; companyIds: string[]; roleCode: string; companyGroupIds: string[]; keyword: string };
export type PrismUserListRoleOption = PrismOption & { needsCompanyGroup?: boolean };
export type PrismUserFilterOptions = { companies: readonly PrismOption[]; companyGroups: readonly PrismOption[]; roles: readonly PrismUserListRoleOption[] };
export type PrismUserListSort = { column: "status" | "name" | "company" | "role" | "companyGroup"; direction: "asc" | "desc" };
export type PrismUserStatusRequest = { readonly ids: readonly string[]; readonly active: boolean };
/** All or none means an omitted filter, matching the source's submitted query. Draft values are untouched. */
export function normalizePrismUserFilters(draft: PrismUserFilterDraft, options: PrismUserFilterOptions): PrismUserAppliedFilters {
    const partial = (values: readonly string[], count: number) => values.length > 0 && values.length < count ? [...values] : [];
    return { isActive: partial(draft.statuses, 2).map(value => value === "active"), companyIds: partial(draft.companyIds, options.companies.length),
        roleCode: draft.roleCode, companyGroupIds: options.roles.some(role => role.value === draft.roleCode && role.needsCompanyGroup) ? partial(draft.companyGroupIds, options.companyGroups.length) : [], keyword: draft.keyword.trim() };
}
export function createPrismUserFilterDraft(options: PrismUserFilterOptions): PrismUserFilterDraft {
    return { statuses: ["active", "inactive"], companyIds: options.companies.map(option => option.value), roleCode: "", companyGroupIds: options.companyGroups.map(option => option.value), keyword: "" };
}
export type PrismUserManagementProps = PrismUserFilterOptions & {
    rows: readonly PrismUserListRow[]; filters: PrismUserFilterDraft; onFiltersChange: (filters: PrismUserFilterDraft) => void; onSearch: (filters: PrismUserAppliedFilters) => void;
    total: number; page: number; pageCount: number; onPageChange: (page: number) => void;
    sort: PrismUserListSort | null; onSortChange: (sort: PrismUserListSort) => void;
    selected: readonly string[]; onSelectionChange: (ids: string[]) => void; onOpen: (row: PrismUserListRow) => void; onCreate?: () => void;
    /** Change when applied query, account/permission context or request provider changes. */
    scopeKey: string; onStatusChange?: (request: PrismUserStatusRequest, context: { signal: AbortSignal }) => void | Promise<void>;
    onStatusApplied?: (request: PrismUserStatusRequest) => void; getStatusErrorMessage?: (error: unknown) => string;
    maxBulkCount?: number; loading?: boolean; readOnly?: boolean; error?: string; onRetry?: () => void;
};
const display = (value: string | null | undefined) => value?.trim() || "-";
const statusChip = (active: boolean) => <PrismChip color={active ? "var(--prism-user-active)" : "var(--prism-user-inactive)"}>{active ? "활성" : "비활성"}</PrismChip>;
const userColumns: readonly PrismDirectoryColumn<PrismUserListRow>[] = [
    { id: "status", label: "상태", sortable: true, width: 80, cell: row => statusChip(row.active) },
    { id: "name", label: "이름", sortable: true, width: 120, cell: row => <span className="prism-user-ellipsis">{display(row.name)}</span> },
    { id: "company", label: "소속 회사", sortable: true, width: 160, cell: row => <span className="prism-user-ellipsis">{display(row.company)}</span> },
    { id: "email", label: "이메일", width: 200, cell: row => <span className="prism-user-ellipsis">{display(row.email)}</span> },
    { id: "role", label: "Role", sortable: true, width: 180, cell: row => <span className="prism-user-ellipsis">{display(row.role)}</span> },
    { id: "companyGroup", label: "회사 그룹", sortable: true, cell: row => row.companyGroup?.name ? <span className="prism-user-group-cell">{row.companyGroup.active != null && statusChip(row.companyGroup.active)}<span className="prism-user-ellipsis">{row.companyGroup.name}</span></span> : "-" },
];
/** Independent list UI. Data loading, API serialization, authorization, mutation and reload are host callbacks. */
export function PrismUserManagement(props: PrismUserManagementProps) {
    const { rows, filters, onFiltersChange, onSearch, total, page, pageCount, onPageChange, sort, onSortChange, selected, onSelectionChange,
        onOpen, onCreate, scopeKey, onStatusChange, onStatusApplied, getStatusErrorMessage, maxBulkCount = 500, loading = false, readOnly = false, error, onRetry } = props;
    if (!Number.isSafeInteger(maxBulkCount) || maxBulkCount < 1) throw new RangeError("Bulk limit must be a positive safe integer.");
    if (!Number.isSafeInteger(total) || total < 0) throw new RangeError("User total must be a nonnegative safe integer.");
    const [confirmation, setConfirmation] = useState<{ scope: string; request: PrismUserStatusRequest } | null>(null);
    const [pending, setPending] = useState(false), [actionError, setActionError] = useState<string | null>(null);
    const operation = useRef<AbortController | null>(null), generation = useRef(0), mounted = useRef(true);
    const latestSelected = useRef(selected);
    useLayoutEffect(() => { latestSelected.current = selected; }, [selected]);
    useLayoutEffect(() => {
        mounted.current = true; setConfirmation(null); setPending(false); setActionError(null);
        return () => { mounted.current = false; generation.current++; operation.current?.abort(); operation.current = null; };
    }, [scopeKey, readOnly]);
    const current = !readOnly && confirmation?.scope === scopeKey ? confirmation : null;
    const busy = pending && !!current, locked = loading || busy || !!error;
    const groupEnabled = props.roles.some(role => role.value === filters.roleCode && role.needsCompanyGroup);
    const update = (change: Partial<PrismUserFilterDraft>) => onFiltersChange({ ...filters, ...change });
    const search = (next: PrismUserFilterDraft) => { onSelectionChange([]); onPageChange(1); onSearch(normalizePrismUserFilters(next, props)); };
    const requestStatus = (active: boolean) => {
        if (readOnly || locked || !onStatusChange || !selected.length) return;
        const ids = [...new Set(selected)];
        if (ids.length > maxBulkCount) { setActionError(`한 번에 최대 ${maxBulkCount}명까지 변경할 수 있습니다.`); return; }
        setActionError(null); setConfirmation({ scope: scopeKey, request: Object.freeze({ ids: Object.freeze(ids), active }) });
    };
    const confirm = async () => {
        if (!current || !onStatusChange || readOnly || operation.current) return;
        const controller = new AbortController(), token = ++generation.current, request = current.request;
        operation.current = controller; setPending(true); setActionError(null);
        const valid = () => mounted.current && generation.current === token && operation.current === controller && !controller.signal.aborted;
        let applied = false;
        try {
            await onStatusChange(request, { signal: controller.signal });
            applied = valid();
        } catch (cause) {
            if (valid()) setActionError(getStatusErrorMessage?.(cause) || "사용자 상태를 변경하지 못했습니다.");
        } finally {
            if (valid()) { operation.current = null; setPending(false); }
        }
        if (applied && mounted.current && generation.current === token && !controller.signal.aborted) {
            setConfirmation(null);
            try { onSelectionChange(latestSelected.current.filter(id => !request.ids.includes(id))); onStatusApplied?.(request); }
            catch { if (mounted.current && generation.current === token) setActionError("상태 변경은 완료됐지만 목록을 갱신하지 못했습니다."); }
        }
    };
    const label = current?.request.active ? "활성화" : "비활성화";
    return <><PrismAdminLayout className="prism-admin-users" title="사용자 관리" breadcrumbs={["Admin", "사용자 관리"]}
        filters={<form className="prism-user-filter-bar" onSubmit={event => { event.preventDefault(); if (!locked) search(filters); }}>
            <div className="prism-user-filter-fields">
                <PrismMultiSelect label="상태" options={[{ value: "active", label: "활성" }, { value: "inactive", label: "비활성" }]} value={filters.statuses} onValueChange={statuses => update({ statuses: statuses as ("active" | "inactive")[] })} searchable={false} allToggleClearsSelection disabled={locked}/>
                <PrismMultiSelect label="소속 회사" options={props.companies} value={filters.companyIds} onValueChange={companyIds => update({ companyIds })} searchable allToggleClearsSelection disabled={locked}/>
                <PrismSelect label="Role" options={[{ value: "", label: "전체" }, ...props.roles]} value={filters.roleCode} onValueChange={roleCode => update({ roleCode })} disabled={locked}/>
                <PrismMultiSelect label="회사 그룹" options={props.companyGroups} value={filters.companyGroupIds} onValueChange={companyGroupIds => update({ companyGroupIds })} searchable={false} allToggleClearsSelection disabled={locked || !groupEnabled}/>
                <PrismInput label="검색어" placeholder="검색어를 입력하세요" value={filters.keyword} onChange={event => update({ keyword: event.target.value })} disabled={locked} onKeyDown={event => { if (event.key === "Enter" && (event.nativeEvent.isComposing || event.keyCode === 229)) event.preventDefault(); }}/>
            </div>
            <div className="prism-user-filter-actions"><PrismButton variant="line" disabled={locked} onClick={() => { const next = createPrismUserFilterDraft(props); onFiltersChange(next); search(next); }}>초기화</PrismButton><PrismButton type="submit" disabled={locked}>조회</PrismButton></div>
        </form>}
        toolbar={<><div className="prism-user-summary"><span>총 {total}건</span><span>·</span><span>선택 {selected.length}건</span>{onStatusChange&&<><PrismButton variant="line" disabled={!selected.length || readOnly || locked} onClick={() => requestStatus(true)}>활성화</PrismButton><PrismButton variant="line" disabled={!selected.length || readOnly || locked} onClick={() => requestStatus(false)}>비활성화</PrismButton></>}</div>{onCreate&&<PrismButton disabled={readOnly || locked} onClick={onCreate}>등록</PrismButton>}</>}
        pagination={rows.length > 0 && <PrismPagination page={page} pageCount={pageCount} onPageChange={onPageChange} pageButtonCount={10} disabled={locked}/> }>
        {error&&<div role="alert" className="prism-user-list-error">{error}{onRetry&&<PrismButton variant="line" onClick={onRetry}>다시 조회</PrismButton>}</div>}
        {actionError&&!current&&<p role="alert" className="prism-error">{actionError}</p>}
        <PrismDirectoryTable title="사용자 목록" variant="admin" selectionBehavior="clear-all-if-any" openColumn="name" rows={rows} columns={userColumns}
            getRowId={row => row.id} getRowLabel={row => display(row.name)} selected={selected} onSelectionChange={onSelectionChange} isRowSelectable={() => !readOnly && !locked}
            sort={sort} sortDisabled={locked} onSortChange={next => { onPageChange(1); onSortChange(next as PrismUserListSort); }} onOpen={busy ? undefined : onOpen} loading={loading}/>
    </PrismAdminLayout><PrismConfirmDialog open={!!current} onOpenChange={open => { if (!open && !busy) { setConfirmation(null); setActionError(null); } }} showIcon={false}
        title={`사용자 ${label}`} content={`선택한 사용자 ${current?.request.ids.length ?? 0}명을 ${label}하시겠습니까?`} confirmLabel={label} busy={busy} error={actionError ?? undefined} onConfirm={() => { void confirm(); }}/></>;
}
