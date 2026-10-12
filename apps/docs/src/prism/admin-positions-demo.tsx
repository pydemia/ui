import { useEffect, useRef, useState } from "react";
import { PrismPositionManagement, capturePrismPositionListSnapshot, restorePrismPositionListSnapshot, createPrismPositionListState, initializePrismPositionOptions, createPrismPositionListQuery, paginatePrismPositions,
    type PrismPositionListState, type PrismPositionListRow, type PrismPositionFilterOptions, type PrismPositionSource, type PrismPositionListSnapshot, type PrismPositionSyncStatus, type PrismPositionAction, type PrismPositionActionResult } from "@pydemia/prism";

type Mode = "default" | "edit" | "scheduled" | "running" | "failed" | "empty" | "error" | "loading" | "readonly" | "long";
const emptyOptions: PrismPositionFilterOptions = { companies: [], industries: [], jobs: [], roles: [] };
const options: PrismPositionFilterOptions = {
    companies: [{ value: "demo", label: "가상전자" }, { value: "example", label: "예시사업" }],
    industries: [{ value: "manufacturing", label: "가상 제조업" }, { value: "service", label: "예시 서비스업" }],
    jobs: [{ value: "planning", label: "가상 기획" }, { value: "sales", label: "예시 영업" }],
    roles: [{ value: "manager", label: "가상 팀장" }, { value: "director", label: "예시 본부장" }],
};
type SyntheticPosition = PrismPositionListRow & { companyId: string; industryId: string; jobId: string; roleId: string };
const initialRows: SyntheticPosition[] = Array.from({ length: 23 }, (_, index) => ({ id: `synthetic-${index + 1}`, name: `가상 포지션 ${String(index + 1).padStart(2, "0")}`,
    isKeyPosition: index % 2 === 0, company: index % 2 ? "예시사업" : "가상전자", companyId: index % 2 ? "example" : "demo",
    industry: "가상 제조업", industryId: "manufacturing", mainJob: "가상 기획", subJob: index % 2 ? "예시 영업" : null, jobId: "planning", role: "가상 팀장", roleId: "manager",
    changeStatus: index === 0 ? "PROGRESS" : index % 3 === 0 ? "UPDATE" : "CREATE", updatedAt: `2026.10.${String(index + 1).padStart(2, "0")}` }));
async function delay(signal: AbortSignal) {
    signal.throwIfAborted();
    await new Promise<void>((resolve, reject) => {
        const abort = () => { clearTimeout(timer); reject(signal.reason); };
        const timer = setTimeout(() => { signal.removeEventListener("abort", abort); resolve(); }, 80);
        signal.addEventListener("abort", abort, { once: true });
    });
    signal.throwIfAborted();
}
type ListProps = { source: PrismPositionSource; mode: Mode; contextKey: string; snapshot: PrismPositionListSnapshot | null; restore: boolean; records: SyntheticPosition[];
    syncStatus: PrismPositionSyncStatus; onSyncStatus: (status: PrismPositionSyncStatus) => void; onRecords: (records: SyntheticPosition[]) => void; onLeave: (state: PrismPositionListState, id: string) => void };
function PositionListExample({ source, mode, contextKey, snapshot, restore, records, syncStatus, onSyncStatus, onRecords, onLeave }: ListProps) {
    const [restored] = useState(() => restorePrismPositionListSnapshot(snapshot, { contextKey, locationKey: "synthetic-history", source, routeState: { restoreList: restore } }));
    const [state, setState] = useState(() => restored ?? createPrismPositionListState(source, emptyOptions));
    const keepRestored = useRef(!!restored);
    const [metadata, setMetadata] = useState(emptyOptions), [optionsLoading, setOptionsLoading] = useState(true);
    const [message, setMessage] = useState(""), [readOnly, setReadOnly] = useState(mode === "readonly"), [failAction, setFailAction] = useState(false);
    const [selected, setSelected] = useState<string[]>([]), [loading, setLoading] = useState(mode === "loading"), [error, setError] = useState(mode === "error" ? "합성 목록 조회 오류" : "");
    // Replace this timer with an authenticated metadata provider, retaining the cancellation and first-load guard.
    useEffect(() => {
        setOptionsLoading(true);
        const timer = setTimeout(() => {
            const preserve = keepRestored.current;
            setMetadata(options); setState(current => initializePrismPositionOptions(current, options, preserve));
            keepRestored.current = false; setOptionsLoading(false);
        }, 20);
        return () => clearTimeout(timer);
    }, [state.source, contextKey]);
    const applied = state.applied;
    const filtered = records.filter(row => (applied.isKeyPosition === undefined || row.isKeyPosition === applied.isKeyPosition)
        && (!applied.companyIds.length || applied.companyIds.includes(row.companyId)) && (!applied.industryBlockIds.length || applied.industryBlockIds.includes(row.industryId))
        && (!applied.jobBlockIds.length || applied.jobBlockIds.includes(row.jobId)) && (!applied.roleBlockIds.length || applied.roleBlockIds.includes(row.roleId))
        && (!applied.keyword || row.name.toLocaleLowerCase().includes(applied.keyword.toLocaleLowerCase())));
    const sortValue = (row: SyntheticPosition) => state.sort?.column === "kind" ? String(row.isKeyPosition) : String(row[state.sort?.column === "job" ? "mainJob" : state.sort?.column ?? "updatedAt"] ?? "");
    const ordered = state.sort ? [...filtered].sort((a, b) => sortValue(a).localeCompare(sortValue(b)) * (state.sort!.direction === "asc" ? 1 : -1)) : filtered;
    // The provider returns all matching rows when change-status filtering requests unpaged data.
    const query = createPrismPositionListQuery(state);
    const view = paginatePrismPositions(query.unpaged ? { kind: "all", rows: ordered } : {
        kind: "page", rows: ordered.slice((Math.min(state.page, Math.max(1, Math.ceil(ordered.length / 10))) - 1) * 10, Math.min(state.page, Math.max(1, Math.ceil(ordered.length / 10))) * 10), total: ordered.length, pageCount: Math.max(1, Math.ceil(ordered.length / 10)),
    }, state);
    useEffect(() => { if (view.page !== state.page) setState(current => ({ ...current, page: view.page })); }, [view.page, state.page]);
    const act = async (request: PrismPositionAction, signal: AbortSignal): Promise<PrismPositionActionResult> => {
        await delay(signal);
        if (failAction) throw new Error("Synthetic action failure");
        return { outcome: request.type === "schedule" && !records.some(row => row.changeStatus !== "UNCHANGED") ? "no-changes" : "applied" };
    };
    return <>
        <div className="prism-example-controls"><label><input type="checkbox" checked={readOnly} onChange={event => setReadOnly(event.target.checked)}/>읽기 전용</label>
            <label><input type="checkbox" checked={failAction} onChange={event => setFailAction(event.target.checked)}/>요청 실패 예시</label>
            {loading&&<button type="button" onClick={() => setLoading(false)}>합성 로딩 종료</button>}</div>
        <PrismPositionManagement {...metadata} state={{ ...state, page: view.page }} onStateChange={setState} rows={view.rows} total={view.total} pageCount={view.pageCount}
            selected={selected} onSelectionChange={setSelected} sync={{ status: syncStatus, date: "2026.10.12" }} readOnly={readOnly} loading={loading} optionsLoading={optionsLoading} error={error || undefined} onRetry={() => setError("")}
            scopeKey={JSON.stringify([contextKey, state.source, state.applied, state.page, state.sort])} onOpen={(row, current) => onLeave(current, row.id)} onCreate={current => onLeave(current, "new")}
            onAction={(request, { signal }) => act(request, signal)} onActionApplied={(request, result) => {
                if (result.outcome === "no-changes") { setMessage("동기화할 변경사항이 없습니다."); return; }
                if (request.type === "delete") { onRecords(records.filter(row => !request.ids.includes(row.id))); setMessage(`합성 포지션 ${request.ids.length}개 삭제 완료`); }
                else if (request.type === "schedule") { onSyncStatus("scheduled"); setMessage("합성 동기화 예약 완료"); }
                else { onSyncStatus("editing"); setMessage("합성 동기화 취소 완료"); }
            }}/>
        <p role="status">{message}</p>
    </>;
}
/** Complete synthetic host: routing snapshot, asynchronous metadata, unpaged filtering, actions and version locks. */
export function PositionManagementExample({ initialMode = "default", contextKey = "synthetic-account" }: { initialMode?: Mode; contextKey?: string }) {
    const [records, setRecords] = useState(() => initialMode === "empty" ? [] : initialRows.map(row => initialMode === "long" ? { ...row, name: row.name + " 매우 긴 포지션 이름으로 줄임 표시와 좁은 화면을 검증합니다.", subJob: "긴 보조 직무 이름을 가진 합성 정보" } : row));
    const [syncStatus, setSyncStatus] = useState<PrismPositionSyncStatus>(initialMode === "scheduled" || initialMode === "running" || initialMode === "failed" ? initialMode : "editing");
    const snapshot = useRef<PrismPositionListSnapshot | null>(null);
    const [route, setRoute] = useState<{ source: PrismPositionSource; detail?: string; restore: boolean }>({ source: initialMode === "default" ? "LIVE" : "TEMP", restore: false });
    return <div data-prism="light" style={{ minWidth: 0 }}>
        <p>합성 포지션 목록입니다. 상세에서 목록으로 돌아오면 필터·페이지·정렬을 복원합니다. 서비스 호출은 예시 데이터에만 적용됩니다.</p>
        {route.detail ? <section aria-label="합성 포지션 상세"><h2>{route.detail === "new" ? "가상 포지션 등록" : `가상 포지션 상세: ${route.detail}`}</h2>
            <button type="button" onClick={() => setRoute({ source: route.source, restore: true })}>목록으로 이동</button></section> : <PositionListExample key={contextKey} mode={initialMode} source={route.source} contextKey={contextKey}
            snapshot={snapshot.current} restore={route.restore} records={records} onRecords={setRecords} syncStatus={syncStatus} onSyncStatus={setSyncStatus}
            onLeave={(state, id) => { snapshot.current = capturePrismPositionListSnapshot(state, { contextKey, locationKey: "synthetic-history" }); setRoute({ source: state.source, detail: id, restore: false }); }}/>}
    </div>;
}
