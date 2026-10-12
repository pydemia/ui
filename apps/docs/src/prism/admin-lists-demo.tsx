import { useState } from "react";
import { PrismCompanyGroupManagement, PrismNoticeManagement, createPrismCompanyGroupFilterDraft, normalizePrismCompanyGroupFilters, createPrismNoticeFilterDraft, preparePrismNoticeFilters, settlePrismNoticeDeletion,
    type PrismCompanyGroupRow, type PrismCompanyGroupAppliedFilters, type PrismCompanyGroupSort, type PrismNoticeListRow, type PrismNoticeAppliedFilters, type PrismNoticeListSort } from "@pydemia/prism";

type Mode = "default" | "loading" | "empty" | "error" | "readonly" | "long" | "notice" | "partial" | "filtered-empty" | "missing";
const companies = [{ value: "demo", label: "가상전자" }, { value: "example", label: "예시사업" }];
const initialGroups: PrismCompanyGroupRow[] = Array.from({ length: 23 }, (_, index) => ({ id: `synthetic-group-${index + 1}`, name: `가상 그룹 ${String(index + 1).padStart(2, "0")}`,
    active: index % 3 !== 0, companies: [{ id: companies[index % 2].value, name: companies[index % 2].label }], registrant: "가상 관리자(가상전자)", createdAt: "2026.10.01", updatedAt: `2026.10.${String(index + 1).padStart(2, "0")}` }));
const initialNotices: PrismNoticeListRow[] = Array.from({ length: 23 }, (_, index) => ({ id: `synthetic-notice-${index + 1}`, title: `가상 공지 ${String(index + 1).padStart(2, "0")}`,
    companies: index % 2 ? [{ id: "demo", name: "가상전자" }] : [], popupStatus: index % 3 === 0 ? "ENDED" : index % 3 === 1 ? "ACTIVE" : "INACTIVE",
    popupStartDate: "2026.10.01", popupEndDate: "2026.10.31", author: { name: "가상 작성자", company: "가상전자", email: "synthetic@example.com" }, createdDate: `2026.10.${String(index + 1).padStart(2, "0")}` }));
async function delay(signal: AbortSignal) {
    signal.throwIfAborted();
    await new Promise<void>((resolve, reject) => {
        const abort = () => { clearTimeout(timer); reject(signal.reason); };
        const timer = setTimeout(() => { signal.removeEventListener("abort", abort); resolve(); }, 50);
        signal.addEventListener("abort", abort, { once: true });
    });
    signal.throwIfAborted();
}
function CompanyGroupExample({ mode, requestScope }: { mode: Mode; requestScope: string }) {
    const [records, setRecords] = useState(initialGroups), [filters, setFilters] = useState(() => createPrismCompanyGroupFilterDraft(companies));
    const [applied, setApplied] = useState<PrismCompanyGroupAppliedFilters>(() => normalizePrismCompanyGroupFilters(filters, companies));
    const [page, setPage] = useState(1), [sort, setSort] = useState<PrismCompanyGroupSort | null>({ column: "updatedAt", direction: "desc" }), [selected, setSelected] = useState<string[]>([]);
    const [message, setMessage] = useState(""), [loading, setLoading] = useState(mode === "loading"), [error, setError] = useState(mode === "error" ? "합성 회사 그룹 조회 오류" : "");
    const filtered = records.filter(row => (!applied.isActive.length || applied.isActive.includes(row.active)) && (!applied.companyIds.length || row.companies.some(company => applied.companyIds.includes(company.id))) && (!applied.keyword || row.name.includes(applied.keyword)));
    const value = (row: PrismCompanyGroupRow) => sort?.column === "status" ? String(row.active) : String(row[sort?.column ?? "updatedAt"] ?? "");
    const ordered = sort ? [...filtered].sort((a, b) => value(a).localeCompare(value(b), "ko") * (sort.direction === "asc" ? 1 : -1)) : filtered;
    const pageCount = Math.max(1, Math.ceil(ordered.length / 10)), currentPage = Math.min(page, pageCount);
    return <>
        {loading&&<button type="button" onClick={() => setLoading(false)}>합성 로딩 종료</button>}
        <PrismCompanyGroupManagement companies={companies} filters={filters} onFiltersChange={setFilters} onSearch={next => { setApplied(next); setError(""); }} rows={ordered.slice((currentPage - 1) * 10, currentPage * 10)} total={ordered.length}
            selected={selected} onSelectionChange={setSelected} page={currentPage} pageCount={pageCount} onPageChange={setPage} sort={sort} onSortChange={setSort} readOnly={mode === "readonly"} loading={loading} error={error || undefined} onRetry={() => setError("")}
            scopeKey={JSON.stringify([requestScope, applied, currentPage, sort])} onOpen={row => setMessage(`회사 그룹 상세 열기 의도: ${row.id}`)} onCreate={() => setMessage("회사 그룹 등록 의도")}
            onStatusChange={async (_request, { signal }) => { await delay(signal); if (mode === "missing") throw new Error("Synthetic missing groups"); }}
            classifyStatusError={() => ({ message: "합성 회사 그룹이 더 이상 존재하지 않습니다.", missing: mode === "missing" })}
            onGroupsMissing={request => { setRecords(current => current.filter(row => !request.ids.includes(row.id))); setMessage("누락된 합성 그룹을 목록에서 다시 확인했습니다."); }}
            onStatusApplied={request => { setRecords(current => current.map(row => request.ids.includes(row.id) ? { ...row, active: request.active } : row)); setMessage(`합성 그룹 ${request.ids.length}개 ${request.active ? "활성화" : "비활성화"} 완료`); }}/>
        <p role="status">{message}</p>
    </>;
}
function NoticeExample({ mode, requestScope }: { mode: Mode; requestScope: string }) {
    const [records, setRecords] = useState(() => mode === "empty" ? [] : initialNotices.map(row => mode === "long" ? { ...row, title: row.title + " 매우 긴 공지 제목과 안내 내용으로 좁은 화면에서도 정보가 유지되는지 확인합니다." } : row));
    const [filters, setFilters] = useState(() => ({ ...createPrismNoticeFilterDraft(companies), keyword: mode === "filtered-empty" ? "존재하지 않는 합성 공지" : "" }));
    const [applied, setApplied] = useState<PrismNoticeAppliedFilters>(() => { const result = preparePrismNoticeFilters(filters, companies); if (!result.ok) throw new Error(result.message); return result.filters; });
    const [page, setPage] = useState(1), [sort, setSort] = useState<PrismNoticeListSort | null>(null), [selected, setSelected] = useState<string[]>([]), [message, setMessage] = useState("");
    const [partialFailure, setPartialFailure] = useState(mode === "partial"), [readOnly, setReadOnly] = useState(mode === "readonly"), [loading, setLoading] = useState(mode === "loading"), [error, setError] = useState(mode === "error" ? "합성 공지 조회 오류" : "");
    const filtered = records.filter(row => (!applied.companyIds.length || !row.companies.length || row.companies.some(company => applied.companyIds.includes(company.id)))
        && (!applied.popupStatus.length || applied.popupStatus.some(status => status === row.popupStatus)) && (!applied.keyword || row.title.includes(applied.keyword))
        && (!applied.popupFrom || row.popupStartDate && row.popupStartDate >= applied.popupFrom) && (!applied.popupTo || row.popupEndDate && row.popupEndDate <= applied.popupTo)
        && (!applied.createdFrom || row.createdDate >= applied.createdFrom) && (!applied.createdTo || row.createdDate <= applied.createdTo));
    const pageCount = Math.max(1, Math.ceil(filtered.length / 10)), currentPage = Math.min(page, pageCount);
    return <>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}><label><input type="checkbox" checked={partialFailure} onChange={event => setPartialFailure(event.target.checked)}/>두 번째 공지 삭제 실패 예시</label>
            <label><input type="checkbox" checked={readOnly} onChange={event => setReadOnly(event.target.checked)}/>읽기 전용</label>{loading&&<button type="button" onClick={() => setLoading(false)}>합성 로딩 종료</button>}</div>
        <PrismNoticeManagement companies={companies} filters={filters} applied={applied} onFiltersChange={setFilters} onSearch={next => { setApplied(next); setError(""); }} rows={filtered.slice((currentPage - 1) * 10, currentPage * 10)} total={filtered.length}
            selected={selected} onSelectionChange={setSelected} page={currentPage} pageCount={pageCount} onPageChange={setPage} sort={sort} onSortChange={setSort} readOnly={readOnly} loading={loading} error={error || undefined} onRetry={() => setError("")}
            scopeKey={JSON.stringify([requestScope, applied, currentPage, partialFailure])} onOpen={row => setMessage(`공지 상세 열기 의도: ${row.id}`)} onCreate={() => setMessage("공지 등록 의도")} dateInputEditable
            onDelete={(request, { signal }) => settlePrismNoticeDeletion(request, async id => { await delay(signal); if (partialFailure && id === "synthetic-notice-2") throw new Error("Synthetic deletion failure"); }, { signal, concurrency: 3, getErrorMessage: () => "합성 공지2 삭제 실패" })}
            onDeletionApplied={(_request, result) => { setRecords(current => current.filter(row => !result.deletedIds.includes(row.id))); setMessage(`합성 공지 ${result.deletedIds.length}개 삭제 완료, ${result.failures.length}개 실패`); }}/>
        <p role="status">{message}</p>
    </>;
}
/** Self-contained examples; every service mutation applies only to synthetic records. */
export function AdminListsExample({ initialMode = "default", requestScope = "synthetic-account" }: { initialMode?: Mode; requestScope?: string }) {
    const [family, setFamily] = useState(["empty", "long", "notice", "partial", "filtered-empty"].includes(initialMode) ? "notices" : "groups");
    return <div data-prism="light" style={{ minWidth: 0 }}><p>합성 회사 그룹·공지 목록입니다. 실제 사용자·권한·공지를 변경하지 않습니다.</p>
        <label>관리 목록 예제 <select value={family} onChange={event => setFamily(event.target.value)}><option value="groups">회사 그룹</option><option value="notices">공지사항</option></select></label>
        {family === "groups" ? <CompanyGroupExample key={requestScope} mode={initialMode} requestScope={requestScope}/> : <NoticeExample key={requestScope} mode={initialMode} requestScope={requestScope}/>}
    </div>;
}
