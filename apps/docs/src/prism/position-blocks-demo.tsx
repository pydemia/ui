import { useRef, useState } from "react";
import { PrismPositionBlockManagement, PrismBlockEditor, PrismBlockDeletionDialog, type PrismBlockItem, type PrismBlockKind, type PrismBlockOpenRequest,
    type PrismBlockAffectedPosition, type PrismPositionSource, type PrismPositionSyncStatus } from "@pydemia/prism";

type Mode = "default" | "edit" | "create" | "job" | "remap" | "empty" | "loading" | "error" | "scheduled" | "running" | "readonly" | "long";
const categories = [{ id: "tech", name: "기술·연구개발" }, { id: "business", name: "사업·운영" }, { id: "support", name: "경영지원" }];
const industries: PrismBlockItem[] = [
    { id: "industry-1", name: "전자·제조", description: "합성 산업 기준입니다. 실제 추천이나 인사 판단에 사용하지 않습니다." },
    { id: "industry-2", name: "서비스", description: "합성 서비스 산업 기준입니다.", change: "added" },
    { id: "industry-3", name: "에너지", description: "합성 에너지 산업 기준입니다.", change: "modified" },
    { id: "industry-4", name: "삭제 예시", description: "합성 삭제 상태입니다.", change: "deleted" },
    { id: "industry-5", name: "반영 예시", description: "합성 반영 상태입니다.", change: "applying" },
    { id: "industry-6", name: "실패 예시", description: "합성 실패 상태입니다.", change: "failed" },
];
const roles: PrismBlockItem[] = [{ id: "role-1", name: "총괄", description: "직책 기준은 읽기 전용으로 제공합니다." }, { id: "role-2", name: "담당", description: "합성 직책 기준입니다." }];
const jobs: PrismBlockItem[] = [
    { id: "job-1", categoryId: "tech", name: "기술 전략", description: "합성 기술 전략 직무 기준입니다.", subJobs: [{ id: "sub-1", name: "전략 수립", description: "합성 소직무의 이름과 설명을 모두 편집할 수 있습니다." }] },
    { id: "job-2", categoryId: "tech", name: "연구 개발", description: "합성 연구 개발 직무 기준입니다.", subJobs: [{ id: "sub-2", name: "연구 기획", description: "합성 연구 기획 설명입니다." }], change: "modified" },
    { id: "job-3", categoryId: "business", name: "사업 운영", description: "합성 사업 운영 직무 기준입니다.", subJobs: [{ id: "sub-3", name: "운영 관리", description: "합성 운영 관리 설명입니다." }] },
    { id: "job-4", categoryId: "support", name: "삭제 직무", description: "삭제 직무는 대체 후보에서 제외됩니다.", subJobs: [], change: "deleted" },
    { id: "job-5", categoryId: "support", name: "반영 직무", description: "반영 중인 직무는 대체 후보에서 제외됩니다.", subJobs: [], change: "applying" },
];
function delay(signal: AbortSignal) {
    return new Promise<void>((resolve, reject) => {
        if (signal.aborted) { reject(new Error("Synthetic request aborted")); return; }
        const abort = () => { clearTimeout(timer); reject(new Error("Synthetic request aborted")); };
        const timer = setTimeout(() => { signal.removeEventListener("abort", abort); resolve(); }, 60);
        signal.addEventListener("abort", abort, { once: true });
    });
}
/** All records and provider responses are synthetic. The consuming application supplies real services. */
export function PositionBlocksExample({ initialMode = "default" }: { initialMode?: Mode }) {
    const editable = initialMode !== "default" && initialMode !== "readonly";
    const [source, setSource] = useState<PrismPositionSource>(editable ? "TEMP" : "LIVE");
    const [syncStatus, setSyncStatus] = useState<PrismPositionSyncStatus>(initialMode === "scheduled" || initialMode === "running" ? initialMode : editable ? "editing" : "synced");
    const [lists, setLists] = useState({ industry: industries, position: roles, job: jobs });
    const [fault, setFault] = useState<"none" | "name" | "generation" | "impact" | "save" | "delete">("none");
    const [editor, setEditor] = useState<PrismBlockOpenRequest | null>(() => initialMode === "create" ? { kind: "industry", mode: "create" } : initialMode === "job" ? { kind: "job", mode: "edit", initial: jobs[0] } : null);
    const [deletion, setDeletion] = useState<{ kind: "industry" | "job"; item: PrismBlockItem } | null>(() => initialMode === "remap" ? { kind: "job", item: jobs[0] } : null);
    const [result, setResult] = useState(""); const sequence = useRef(0);
    const scopeKey = `synthetic-blocks:${source}:${syncStatus}:${initialMode === "readonly"}`;
    const loadAffected = async (request: { kind: PrismBlockKind; targetId: string }, { signal }: { signal: AbortSignal }): Promise<PrismBlockAffectedPosition[]> => {
        await delay(signal); if (fault === "impact") { setFault("none"); throw new Error("Synthetic impact failure"); }
        const common = [{ id: "position-1", company: "가상전자", name: "가상 기술전략담당" }, { id: "position-2", company: "예시사업", name: "가상 운영담당" }];
        return request.kind === "job" ? [{ ...common[0], mapping: "primary", otherCriteria: { id: "job-2", name: "연구 개발" } }, { ...common[1], mapping: "secondary", otherCriteria: { id: "job-3", name: "사업 운영" } }] : common;
    };
    return <section data-prism="light" className="prism-demo-stack">
        <div className="prism-demo-row"><label>합성 동기화 상태 <select aria-label="합성 동기화 상태" value={syncStatus} onChange={event => { setSyncStatus(event.target.value as PrismPositionSyncStatus); setEditor(null); setDeletion(null); }}><option value="editing">편집 중</option><option value="scheduled">예정</option><option value="running">진행 중</option><option value="synced">완료</option><option value="failed">실패</option></select></label>
            <label>합성 실패 예시 (다음 요청) <select aria-label="합성 실패 예시" value={fault} onChange={event => setFault(event.target.value as typeof fault)}><option value="none">없음</option><option value="name">이름 검사</option><option value="generation">AI 생성</option><option value="impact">영향 조회</option><option value="save">저장</option><option value="delete">삭제</option></select></label></div>
        <PrismPositionBlockManagement source={source} onSourceChange={value => { setEditor(null); setDeletion(null); setSource(value); setSyncStatus(value === "LIVE" ? "synced" : "editing"); }}
            industries={initialMode === "empty" ? [] : initialMode === "long" ? lists.industry.map(item => ({ ...item, name: item.name.repeat(12) })) : lists.industry} positions={initialMode === "empty" ? [] : lists.position} jobs={initialMode === "empty" ? [] : lists.job} categories={categories}
            sync={{ status: syncStatus, date: "2026.10.13" }} loading={initialMode === "loading"} readOnly={initialMode === "readonly"} error={initialMode === "error" ? "합성 블록 목록을 불러오지 못했습니다." : undefined}
            onRetry={() => setResult("합성 목록 재조회 요청")} onOpen={setEditor} onDelete={(kind, item) => setDeletion({ kind, item })}/>
        {editor && <PrismBlockEditor open scopeKey={scopeKey} kind={editor.kind} mode={editor.mode} initial={editor.initial} categories={categories} readOnly={initialMode === "readonly"} onOpenChange={open => { if (!open) setEditor(null); }}
            onCheckName={async (request, { signal }) => { await delay(signal); if (fault === "name") { setFault("none"); throw new Error("Synthetic name failure"); } return !lists[request.kind].some(item => item.id !== request.excludeId && item.name.trim() === request.name); }}
            onGenerateDescription={async (request, { signal }) => { await delay(signal); if (fault === "generation") { setFault("none"); throw new Error("Synthetic generation failure"); } return `${request.name}의 합성 설명입니다. 생성된 내용을 직접 수정할 수 있습니다.`; }}
            onGenerateSubJobs={async (request, { signal }) => { await delay(signal); if (fault === "generation") { setFault("none"); throw new Error("Synthetic generation failure"); } return [{ name: `${request.name} 기획`, description: "합성 기획 직무 설명입니다." }, { name: `${request.name} 운영`, description: "합성 운영 직무 설명입니다." }]; }}
            onLoadAffected={loadAffected} onSubmit={async (request, { signal }) => {
                await delay(signal); if (fault === "save") { setFault("none"); throw new Error("Synthetic save failure"); }
                const id = request.targetId ?? `synthetic-${++sequence.current}`;
                const next: PrismBlockItem = { id, name: request.name, description: request.description, change: request.targetId ? "modified" : "added", ...(request.kind === "job" ? { categoryId: request.categoryId, subJobs: request.subJobs.map(job => ({ ...job, id: `synthetic-sub-${++sequence.current}` })) } : {}) };
                setLists(previous => ({ ...previous, [request.kind]: request.targetId ? previous[request.kind].map(item => item.id === id ? next : item) : [...previous[request.kind], next] }));
            }} onSubmitted={request => setResult(`합성 ${request.kind === "job" ? "직무" : "산업"} 기준 ${request.targetId ? "수정" : "생성"} 완료`)}/>}
        {deletion && <PrismBlockDeletionDialog open scopeKey={scopeKey} kind={deletion.kind} target={deletion.item} candidates={lists[deletion.kind]} onOpenChange={open => { if (!open) setDeletion(null); }} onLoadAffected={loadAffected}
            onConfirm={async (request, { signal }) => { await delay(signal); if (fault === "delete") { setFault("none"); throw new Error("Synthetic deletion failure"); } setLists(previous => ({ ...previous, [request.kind]: previous[request.kind].map(item => item.id === request.targetId ? { ...item, change: "deleted" } : item) })); }}
            onDeleted={request => setResult(`합성 기준 삭제 및 ${Object.keys(request.remap).length}건 재매핑 완료${request.kind === "job" ? " (미선택 보조직무 해제)" : ""}`)}/>}
        <p role="status">{result}</p>
    </section>;
}
