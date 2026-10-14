import { useState } from "react";
import { PrismUserManagement, createPrismUserFilterDraft, normalizePrismUserFilters, type PrismUserAppliedFilters, type PrismUserFilterOptions, type PrismUserListRow, type PrismUserListSort, type PrismUserStatusRequest } from "@pydemia/prism";

const options: PrismUserFilterOptions = {
    companies: [{ value: "demo", label: "가상전자" }, { value: "example", label: "예시사업" }],
    companyGroups: [{ value: "group-a", label: "가상 회사 그룹" }, { value: "group-b", label: "예시 회사 그룹" }],
    roles: [{ value: "SYSTEM_ADMIN", label: "시스템 운영자" }, { value: "GROUP_HR", label: "그룹 HR 담당자" }, { value: "GROUP_USER", label: "그룹 일반 사용자" },
        { value: "GENERAL_HR", label: "멤버사 HR 담당자", needsCompanyGroup: true }, { value: "GENERAL_USER", label: "멤버사 일반 사용자", needsCompanyGroup: true }],
};
type SyntheticUser = PrismUserListRow & { companyId: string; roleCode: string; groupId: string };
const initialRows: SyntheticUser[] = Array.from({ length: 23 }, (_, index) => ({ id: `synthetic-${index + 1}`, active: index % 3 !== 0,
    name: `김가상${String(index + 1).padStart(2, "0")}`, company: index % 2 ? "예시사업" : "가상전자", companyId: index % 2 ? "example" : "demo",
    email: `synthetic${index + 1}@example.com`, role: "멤버사 일반 사용자", roleCode: "GENERAL_USER", groupId: index % 2 ? "group-b" : "group-a",
    companyGroup: { name: index % 2 ? "예시 회사 그룹" : "가상 회사 그룹", active: index % 2 === 0 } }));
/** Synthetic provider only. Supply authenticated mutation and host-owned cache refresh in your application. */
async function applySyntheticStatus(_request: PrismUserStatusRequest, signal: AbortSignal) {
    signal.throwIfAborted();
    await new Promise<void>((resolve, reject) => {
        const abort = () => { clearTimeout(timer); reject(signal.reason); };
        const timer = setTimeout(() => { signal.removeEventListener("abort", abort); resolve(); }, 100);
        signal.addEventListener("abort", abort, { once: true });
    });
    signal.throwIfAborted();
}
export function UserManagementExample({ initialMode = "default", applyStatus = applySyntheticStatus, requestScope = "synthetic" }: {
    initialMode?: "default" | "empty" | "loading" | "error" | "readonly" | "long";
    applyStatus?: (request: PrismUserStatusRequest, signal: AbortSignal) => Promise<void>; requestScope?: string;
}) {
    const [records, setRecords] = useState(() => initialMode === "empty" ? [] : initialRows.map(row => initialMode === "long" ? { ...row, name: row.name + " 매우 긴 가상 이름", companyGroup: { ...row.companyGroup!, name: "매우 긴 가상 회사 그룹 이름과 독립적인 표시 목적의 합성 정보" } } : row));
    const [filters, setFilters] = useState(() => createPrismUserFilterDraft(options));
    const [applied, setApplied] = useState<PrismUserAppliedFilters>(() => normalizePrismUserFilters(filters, options));
    const [page, setPage] = useState(1), [sort, setSort] = useState<PrismUserListSort | null>({ column: "name", direction: "asc" });
    const [selected, setSelected] = useState<string[]>([]), [message, setMessage] = useState("");
    const [readOnly, setReadOnly] = useState(initialMode === "readonly"), [fail, setFail] = useState(initialMode === "error");
    const [loading, setLoading] = useState(initialMode === "loading"), [error, setError] = useState(initialMode === "error" ? "합성 목록 조회 오류" : "");
    const filtered = records.filter(row => (!applied.isActive.length || applied.isActive.includes(row.active)) && (!applied.companyIds.length || applied.companyIds.includes(row.companyId))
        && (!applied.roleCode || applied.roleCode === row.roleCode) && (!applied.companyGroupIds.length || applied.companyGroupIds.includes(row.groupId))
        && (!applied.keyword || `${row.name} ${row.email} ${row.company}`.toLocaleLowerCase().includes(applied.keyword.toLocaleLowerCase())));
    const value = (row: SyntheticUser) => sort?.column === "status" ? String(row.active) : sort?.column === "companyGroup" ? row.companyGroup?.name ?? "" : String(row[sort?.column ?? "name"] ?? "");
    const ordered = sort ? [...filtered].sort((a, b) => value(a).localeCompare(value(b)) * (sort.direction === "asc" ? 1 : -1)) : filtered;
    const pageCount = Math.max(1, Math.ceil(ordered.length / 10)), currentPage = Math.min(page, pageCount);
    return <div data-prism="light" style={{ minWidth: 0 }}>
        <p>합성 사용자 목록입니다. 필터는 조회할 때 적용하며 실제 계정·권한을 변경하지 않습니다.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}><label><input type="checkbox" checked={readOnly} onChange={event => setReadOnly(event.target.checked)}/>읽기 전용</label>
            <label><input type="checkbox" checked={fail} onChange={event => setFail(event.target.checked)}/>일괄 변경 실패 예시</label>
            {loading&&<button type="button" onClick={() => setLoading(false)}>합성 로딩 종료</button>}</div>
        <PrismUserManagement {...options} filters={filters} onFiltersChange={setFilters} onSearch={setApplied}
            rows={ordered.slice((currentPage - 1) * 10, currentPage * 10)} total={ordered.length} page={currentPage} pageCount={pageCount} onPageChange={setPage}
            selected={selected} onSelectionChange={setSelected} sort={sort} onSortChange={setSort} readOnly={readOnly} loading={loading} error={error || undefined} onRetry={() => setError("")}
            scopeKey={JSON.stringify([requestScope, applied, currentPage, sort])} onOpen={row => setMessage(`상세 열기 의도: ${row.id}`)} onCreate={() => setMessage("사용자 등록 의도")}
            onStatusChange={async (request, { signal }) => { await applyStatus(request, signal); signal.throwIfAborted(); if (fail) throw new Error("Synthetic status failure"); }}
            onStatusApplied={request => { setRecords(current => current.map(row => request.ids.includes(row.id) ? { ...row, active: request.active } : row)); setMessage(`합성 ${request.ids.length}명 ${request.active ? "활성화" : "비활성화"} 완료`); }}/>
        <p role="status">{message}</p>
    </div>;
}
