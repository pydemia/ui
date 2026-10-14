import { useState } from "react";
import { PrismChatLogManagement, PrismChatLogDetail, createPrismChatLogFilterDraft, preparePrismChatLogFilters,
    type PrismChatLogRow, type PrismChatLogSort, type PrismChatLogTurn } from "@pydemia/prism";
type Mode = "default" | "loading" | "empty" | "error" | "long" | "filtered-empty" | "detail-only" | "access-error";
const companies = [{ value: "a", label: "가상전자" }, { value: "b", label: "예시사업" }];
const records: PrismChatLogRow[] = Array.from({ length: 23 }, (_, index) => ({ id: `synthetic-log-${index + 1}`, conversationId: `DEMO-CONVERSATION-${String(index + 1).padStart(3, "0")}`, error: index % 3 === 0 ? "Y" : "N",
    name: `가상 작성자 ${index + 1}`, company: companies[index % 2].label, employeeNo: `DEMO-${1000 + index}`, subject: `합성 대화 주제 ${index + 1}`, lastChatAt: `2026.10.${String(index + 1).padStart(2, "0")}` }));
const turns: PrismChatLogTurn[] = [
    { id: "one", question: "가상 보관 기록을 확인해 주세요.", blocks: [{ id: "options", type: "options", title: "가상 기록의 확인 항목", options: [{ id: "detail", label: "상세 확인" }, { id: "summary", label: "요약 확인" }], selected: "detail" }] },
    { id: "two", question: "상세 확인", blocks: [{ id: "text", type: "text", content: "합성 보관 기록입니다. 실제 사용자의 대화나 인사 분석 결과가 아닙니다." }, { id: "list", type: "list", ordered: true, items: ["기록의 표시 상태", "원본 대화 순서", "읽기 전용 옵션"] }, { id: "table", type: "table", title: "가상 기록 정보", columns: ["항목", "표시 값", "설명"], rows: [{ id: "row", cells: ["기록", "합성 데이터", "서비스 원본을 복사하지 않았습니다."] }] }] },
    { id: "three", question: "보충 내용", blocks: [{ id: "nudge", type: "options", title: "추가 맥락을 확인합니다.", options: [{ id: "context", label: "합성 맥락" }] }] },
    { id: "four", question: "추가 맥락 응답 (원본 규칙에 따라 숨김)", blocks: [{ id: "result", type: "text", content: "보관된 추가 맥락의 합성 응답입니다." }] },
];
/** This example owns synthetic query/route state; its copy adapter never changes the system clipboard. */
export function ChatLogsExample({ initialMode = "default" }: { initialMode?: Mode }) {
    const [filters, setFilters] = useState(() => ({ ...createPrismChatLogFilterDraft(companies), ...(initialMode === "filtered-empty" ? { keyword: "없는 합성 기록" } : {}) }));
    const [applied, setApplied] = useState(() => preparePrismChatLogFilters(filters, companies).filters!);
    const [sort, setSort] = useState<PrismChatLogSort | null>(null), [page, setPage] = useState(1);
    const [detail, setDetail] = useState<PrismChatLogRow | null>(initialMode === "detail-only" || initialMode === "access-error" ? records[0] : null);
    const [failed, setFailed] = useState(initialMode === "error" || initialMode === "access-error"), [copyFailure, setCopyFailure] = useState(false), [result, setResult] = useState("");
    const source = initialMode === "empty" ? [] : initialMode === "long" ? records.map(row => ({ ...row, subject: row.subject.repeat(18), name: row.name.repeat(3) })) : records;
    const filtered = source.filter(row => (!applied.companyIds.length || applied.companyIds.includes(row.company === companies[0].label ? "a" : "b")) && (!applied.dateFrom || row.lastChatAt >= applied.dateFrom.replaceAll("-", ".")) && (!applied.dateTo || row.lastChatAt <= applied.dateTo.replaceAll("-", ".")) && Object.values(row).join(" ").toLocaleLowerCase().includes(applied.keyword.toLocaleLowerCase()));
    const sorted = sort ? [...filtered].sort((a, b) => a[sort.column].localeCompare(b[sort.column], "ko") * (sort.direction === "asc" ? 1 : -1)) : filtered;
    const pageCount = Math.max(1, Math.ceil(sorted.length / 10)), current = Math.min(page, pageCount);
    return <section data-prism="light" className="prism-demo-stack"><p className="prism-block-helper">합성 대화 기록입니다. 예제의 복사 동작은 시스템 clipboard를 변경하지 않습니다.</p>
        {!detail && <label><input type="checkbox" checked={copyFailure} onChange={event => setCopyFailure(event.target.checked)}/> 다음 합성 복사 실패</label>}
        {detail ? <PrismChatLogDetail style={{ height: 640 }} subject={detail.subject} turns={turns} error={failed ? "합성 대화 내용을 불러오지 못했습니다." : undefined} onRetry={() => setFailed(false)} onBack={() => setDetail(null)}/> :
            <PrismChatLogManagement rows={sorted.slice((current - 1) * 10, current * 10)} total={sorted.length} page={current} pageCount={pageCount} onPageChange={setPage} companies={companies}
                filters={filters} applied={applied} onFiltersChange={setFilters} onSearch={value => { setApplied(value); setResult("합성 조회 조건 적용"); }} sort={sort} onSortChange={setSort}
                onOpen={setDetail} scopeKey={JSON.stringify([applied, current, sort])} loading={initialMode === "loading"} error={failed ? "합성 대화 로그 목록을 불러오지 못했습니다." : undefined} onRetry={() => setFailed(false)} dateInputEditable
                onCopyConversation={async (_value, { signal }) => { await new Promise(resolve => setTimeout(resolve, 40)); if (signal.aborted) throw new Error("Synthetic copy aborted"); if (copyFailure) { setCopyFailure(false); throw new Error("Synthetic copy failure"); } }}
                onCopied={value => setResult(`합성 Conversation ID 확인: ${value}`)}/>}
        <p role="status">{result}</p>
    </section>;
}
