import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { PrismAdminLayout } from "./prism-admin";
import { PrismPositionSyncBar, type PrismPositionSource, type PrismPositionSyncStatus } from "./prism-position-management";
import { PrismCriteriaTag, type PrismCriteriaChange } from "./prism-management-tools";
import { PrismButton } from "./prism-button";
import { PrismInput, PrismTextarea, PrismSelect } from "./prism-field";
import { PrismDialog } from "./prism-dialog";
import { PrismTable } from "./prism-display";
import { PrismSkeleton } from "./prism-primitives";
import { PrismIcon } from "./prism-icon";
import { PrismTabs, PrismTabsList, PrismTabsTrigger, PrismTabsContent } from "./prism-tabs";

export type PrismBlockKind = "industry" | "position" | "job";
export type PrismBlockMode = "view" | "create" | "edit";
export type PrismBlockCategory = { id: string; name: string };
export type PrismBlockSubJob = { id: string; name: string; description: string };
export type PrismBlockDraft = { name: string; description: string; categoryId?: string; subJobs?: readonly PrismBlockSubJob[] };
export type PrismBlockItem = PrismBlockDraft & { id: string; change?: PrismCriteriaChange };
export type PrismBlockAffectedPosition = { id: string; company: string; name: string; mapping?: "primary" | "secondary"; otherCriteria?: { id: string; name: string } | null };
export type PrismBlockTaskContext = { signal: AbortSignal; scopeKey: string };
export type PrismBlockSubmitRequest = { kind: Exclude<PrismBlockKind, "job">; targetId?: string; name: string; description: string } |
    { kind: "job"; targetId?: string; name: string; description: string; categoryId: string; subJobs: readonly { name: string; description: string }[] };
export type PrismBlockNameRequest = { kind: PrismBlockKind; name: string; excludeId?: string };
export type PrismBlockImpactRequest = { kind: PrismBlockKind; targetId: string };
export type PrismBlockDeleteRequest = { kind: "industry" | "job"; targetId: string; remap: Readonly<Record<string, string>> };
const labels: Record<PrismBlockKind, string> = { industry: "산업 기준", position: "직책 기준", job: "직무 기준" };
const copyDraft = (value?: PrismBlockDraft | null): PrismBlockDraft => ({ name: value?.name ?? "", description: value?.description ?? "",
    ...(value?.categoryId !== undefined ? { categoryId: value.categoryId } : {}), ...(value?.subJobs ? { subJobs: value.subJobs.map(job => ({ id: job.id, name: job.name, description: job.description })) } : {}) });
const copyPositions = (rows: readonly PrismBlockAffectedPosition[]): PrismBlockAffectedPosition[] => rows.map(row => ({ id: row.id, company: row.company, name: row.name,
    ...(row.mapping ? { mapping: row.mapping } : {}), ...(row.otherCriteria ? { otherCriteria: { id: row.otherCriteria.id, name: row.otherCriteria.name } } : {}) }));
export function validatePrismBlockDraft(kind: PrismBlockKind, value: PrismBlockDraft, categories: readonly PrismBlockCategory[] = []): string | null {
    if (!value.name.trim()) return "기준 명을 입력해 주세요.";
    if (!value.description.trim()) return "설명을 입력해 주세요.";
    if (kind === "job") {
        if (!categories.some(category => category.id === value.categoryId)) return "직무 대분류를 선택해 주세요.";
        if (!value.subJobs?.length || value.subJobs.some(job => !job.name.trim() || !job.description.trim())) return "모든 소직무의 이름과 설명을 입력해 주세요.";
        if (value.subJobs.some(job => !job.id) || new Set(value.subJobs.map(job => job.id)).size !== value.subJobs.length) return "소직무 식별자가 중복되거나 비어 있습니다.";
    }
    return null;
}
export function hasPrismBlockChanges(value: PrismBlockDraft, initial: PrismBlockDraft): boolean {
    return value.name.trim() !== initial.name.trim() || value.description !== initial.description || value.categoryId !== initial.categoryId ||
        (value.subJobs?.length ?? 0) !== (initial.subJobs?.length ?? 0) || !!value.subJobs?.some((job, index) => job.name !== initial.subJobs?.[index]?.name || job.description !== initial.subJobs?.[index]?.description);
}
/** Copies only public form fields; IDs used for editing sub-jobs are not service payload fields. */
export function preparePrismBlockSubmission(kind: PrismBlockKind, value: PrismBlockDraft, categories: readonly PrismBlockCategory[] = [], targetId?: string): PrismBlockSubmitRequest {
    const error = validatePrismBlockDraft(kind, value, categories); if (error) throw new Error(error);
    const common = { name: value.name.trim(), description: value.description, ...(targetId ? { targetId } : {}) };
    return Object.freeze(kind === "job" ? { ...common, kind, categoryId: value.categoryId!, subJobs: Object.freeze(value.subJobs!.map(job => Object.freeze({ name: job.name.trim(), description: job.description.trim() }))) } : { ...common, kind });
}
export function preparePrismBlockRemap(kind: "industry" | "job", targetId: string, positions: readonly PrismBlockAffectedPosition[], candidates: readonly PrismBlockItem[], value: Readonly<Record<string, string>>): Readonly<Record<string, string>> {
    if (!targetId || positions.some(row => !row.id) || new Set(positions.map(row => row.id)).size !== positions.length) throw new Error("영향 포지션 식별자를 확인해 주세요.");
    const available = candidates.filter(item => item.id !== targetId && item.change !== "deleted" && item.change !== "applying");
    const entries: [string, string][] = [];
    for (const row of positions) {
        if (kind === "job" && row.mapping !== "primary" && row.mapping !== "secondary") throw new Error("직무의 매핑 구분을 확인해 주세요.");
        const replacement = Object.hasOwn(value, row.id) ? value[row.id] : "";
        if (!replacement && (kind !== "job" || row.mapping === "primary")) throw new Error("각 포지션의 기준을 다시 지정해 주세요.");
        if (!replacement) continue;
        if (!available.some(item => item.id === replacement)) throw new Error("사용 가능한 재매핑 기준을 선택해 주세요.");
        if (kind === "job" && row.otherCriteria?.id === replacement) throw new Error("주직무와 보조직무에 같은 기준을 지정할 수 없습니다.");
        entries.push([row.id, replacement]);
    }
    return Object.freeze(Object.fromEntries(entries));
}

function useBlockTask(key: string) {
    const controller = useRef<AbortController | null>(null), generation = useRef(0), mounted = useRef(false);
    const [busy, setBusy] = useState<string | null>(null), [error, setError] = useState<string | null>(null);
    useLayoutEffect(() => {
        mounted.current = true; setBusy(null); setError(null);
        return () => { mounted.current = false; generation.current++; controller.current?.abort(); controller.current = null; };
    }, [key]);
    const run = async <T,>(name: string, work: (signal: AbortSignal) => Promise<T>, apply: (value: T, current: () => boolean) => void, message: string) => {
        if (controller.current || !mounted.current) return;
        const active = new AbortController(), token = generation.current; controller.current = active; setBusy(name); setError(null);
        const current = () => mounted.current && !active.signal.aborted && controller.current === active && generation.current === token;
        try { const result = await work(active.signal); if (current()) apply(result, current); }
        catch { if (current()) setError(message); }
        finally { if (current()) { controller.current = null; setBusy(null); } }
    };
    return { busy, error, run, isPending: () => controller.current !== null };
}
function BlockSummary({ label, name, count }: { label: string; name: string; count: number }) {
    return <div className="prism-block-summary"><div><span>{label}</span><strong>{name}</strong></div><div><span>영향 포지션</span><strong>{count}건</strong></div></div>;
}
function ImpactTable({ positions }: { positions: readonly PrismBlockAffectedPosition[] }) {
    return <PrismTable caption="영향 포지션 목록"><thead><tr><th scope="col" style={{ width: 120 }}>회사</th><th scope="col">포지션 명</th></tr></thead><tbody>{positions.length ? positions.map(row => <tr key={row.id}><td>{row.company}</td><td>{row.name}</td></tr>) : <tr><td colSpan={2}>영향 받는 포지션이 없습니다.</td></tr>}</tbody></PrismTable>;
}
function GenerateControl({ label, generated, busy, disabled, onGenerate, notice }: { label: string; generated: boolean; busy: boolean; disabled: boolean; onGenerate: () => void; notice: string }) {
    return <div className="prism-block-generate"><PrismButton variant="line" size="small" disabled={disabled || busy} onClick={onGenerate}>{busy ? "생성 중..." : generated ? "AI로 다시 생성" : label}</PrismButton>{generated && <p><PrismIcon name="InfoIcon" size={14}/>{notice}</p>}</div>;
}
function GenerationOverlay({ label, empty = false }: { label: string; empty?: boolean }) {
    return <div className="prism-block-generation-overlay" data-empty={empty || undefined} role="status"><PrismIcon name="GeneratingSpinnerIcon" size={24}/><span className="prism-sr-only">{label}</span></div>;
}
export type PrismBlockEditorProps = { open: boolean; onOpenChange: (open: boolean) => void; scopeKey: string; kind: PrismBlockKind; mode: PrismBlockMode;
    initial?: PrismBlockItem | null; categories?: readonly PrismBlockCategory[]; readOnly?: boolean; checkDelayMs?: number;
    onCheckName?: (request: PrismBlockNameRequest, context: PrismBlockTaskContext) => Promise<boolean>;
    onGenerateDescription?: (request: PrismBlockNameRequest, context: PrismBlockTaskContext) => Promise<string>;
    onGenerateSubJobs?: (request: { name: string; description: string; categoryId: string }, context: PrismBlockTaskContext) => Promise<readonly { name: string; description: string }[]>;
    onLoadAffected?: (request: PrismBlockImpactRequest, context: PrismBlockTaskContext) => Promise<readonly PrismBlockAffectedPosition[]>;
    onSubmit: (request: PrismBlockSubmitRequest, context: PrismBlockTaskContext) => Promise<void>; onSubmitted?: (request: PrismBlockSubmitRequest) => void };
/** A source-specific block workflow. The host supplies services and refreshes authoritative records. */
export function PrismBlockEditor(props: PrismBlockEditorProps) {
    const { open, scopeKey, kind, mode, initial, categories = [], readOnly = false, checkDelayMs = 600 } = props;
    if (!Number.isFinite(checkDelayMs) || checkDelayMs < 0) throw new RangeError("Invalid name-check delay.");
    const view = mode === "view" || readOnly || kind === "position" || initial?.change === "applying" || initial?.change === "deleted";
    const key = JSON.stringify([scopeKey, open, kind, mode, initial?.id, view]);
    const latest = useRef(props), baseline = useRef(copyDraft(initial)), sequence = useRef(0), subId = useId();
    const [draft, setDraft] = useState<PrismBlockDraft>(() => copyDraft(initial));
    const [descriptionGenerated, setDescriptionGenerated] = useState(!!initial?.description), [subGenerated, setSubGenerated] = useState(!!initial?.subJobs?.length);
    const [confirmation, setConfirmation] = useState<{ draft: PrismBlockDraft; positions: PrismBlockAffectedPosition[] } | null>(null);
    const [check, setCheck] = useState<{ name: string; status: "idle" | "checking" | "available" | "duplicate" | "error" }>({ name: "", status: "idle" });
    const [checkAttempt, setCheckAttempt] = useState(0);
    const task = useBlockTask(key);
    useLayoutEffect(() => { latest.current = props; });
    useLayoutEffect(() => { baseline.current = copyDraft(initial); setDraft(copyDraft(initial)); setDescriptionGenerated(!!initial?.description); setSubGenerated(!!initial?.subJobs?.length); setConfirmation(null); setCheck({ name: "", status: "idle" }); }, [key]);
    const name = draft.name.trim(), unchangedName = mode === "edit" && !!initial?.id && name === baseline.current.name.trim();
    const status = !name ? "idle" : unchangedName ? "available" : check.name === name ? check.status : "checking";
    useLayoutEffect(() => {
        if (!open || view || !name || unchangedName) return;
        const active = new AbortController(); let canceled = false;
        setCheck({ name, status: "checking" });
        const timer = setTimeout(async () => {
            const service = latest.current.onCheckName;
            if (!service) { if (!canceled) setCheck({ name, status: "error" }); return; }
            try { const available = await service({ kind, name, ...(mode === "edit" && initial?.id ? { excludeId: initial.id } : {}) }, { scopeKey, signal: active.signal }); if (typeof available !== "boolean") throw new Error("Invalid name result"); if (!canceled) setCheck({ name, status: available ? "available" : "duplicate" }); }
            catch { if (!canceled) setCheck({ name, status: "error" }); }
        }, checkDelayMs);
        return () => { canceled = true; active.abort(); clearTimeout(timer); };
    }, [key, name, unchangedName, checkDelayMs, checkAttempt]);
    const valid = !validatePrismBlockDraft(kind, draft, categories), dirty = mode === "create" || hasPrismBlockChanges(draft, baseline.current);
    const canSubmit = !view && (mode === "create" || !!initial?.id) && status === "available" && valid && dirty && !task.busy;
    const canGenerate = !view && !!name && status === "available" && (kind !== "job" || categories.some(category => category.id === draft.categoryId)) && !task.busy;
    const context = (signal: AbortSignal): PrismBlockTaskContext => ({ scopeKey, signal });
    const nameRequest = (): PrismBlockNameRequest => ({ kind, name, ...(mode === "edit" && initial?.id ? { excludeId: initial.id } : {}) });
    const generateDescription = () => { const service = latest.current.onGenerateDescription; if (!canGenerate || !service) return;
        void task.run("description", signal => service(nameRequest(), context(signal)), result => { if (typeof result !== "string" || !result.trim()) throw new Error("Empty generation"); setDraft(value => ({ ...value, description: result })); setDescriptionGenerated(true); }, "설명을 생성하지 못했습니다. 다시 시도해 주세요."); };
    const generateSubJobs = () => { const service = latest.current.onGenerateSubJobs; if (!canGenerate || !draft.description.trim() || !service) return;
        void task.run("subJobs", signal => service({ name, description: draft.description.trim(), categoryId: draft.categoryId! }, context(signal)), result => {
            if (!Array.isArray(result) || !result.length || result.some(job => typeof job.name !== "string" || typeof job.description !== "string")) throw new Error("Invalid generation");
            setDraft(value => ({ ...value, subJobs: result.map(job => ({ id: `${subId}-${++sequence.current}`, name: job.name, description: job.description })) })); setSubGenerated(true);
        }, "소직무를 생성하지 못했습니다. 다시 시도해 주세요."); };
    const loadImpact = () => { const service = latest.current.onLoadAffected; if (!canSubmit || !initial?.id || !service) return;
        const captured = copyDraft(draft);
        void task.run("impact", signal => service({ kind, targetId: initial.id }, context(signal)), rows => {
            if (rows.some(row => !row.id) || new Set(rows.map(row => row.id)).size !== rows.length) throw new Error("Invalid impact IDs");
            setConfirmation({ draft: captured, positions: copyPositions(rows) });
        }, "영향 포지션을 불러오지 못했습니다. 다시 시도해 주세요."); };
    const submit = () => {
        if (view || task.isPending() || (!confirmation && (!canSubmit || mode !== "create"))) return;
        const request = preparePrismBlockSubmission(kind, confirmation?.draft ?? draft, categories, mode === "edit" ? initial?.id : undefined);
        void task.run("submit", signal => latest.current.onSubmit(request, context(signal)), (_result, current) => { latest.current.onSubmitted?.(request); if (current()) latest.current.onOpenChange(false); }, "저장하지 못했습니다. 입력 내용을 확인하고 다시 시도해 주세요.");
    };
    const close = (next: boolean) => { if (!task.isPending()) latest.current.onOpenChange(next); };
    const footer = view ? <PrismButton variant="line" onClick={() => close(false)}>닫기</PrismButton> : confirmation ? <><PrismButton variant="line" disabled={!!task.busy} onClick={() => { if (!task.isPending()) setConfirmation(null); }}>이전</PrismButton><PrismButton disabled={!!task.busy} onClick={submit}>{task.busy === "submit" ? "처리 중..." : "수정 확정"}</PrismButton></> : mode === "edit" ?
        <PrismButton variant="line" disabled={!canSubmit || !props.onLoadAffected} onClick={loadImpact}>{task.busy === "impact" ? "확인 중..." : "영향 포지션 확인"}</PrismButton> : <PrismButton disabled={!canSubmit} onClick={submit}>{task.busy === "submit" ? "생성 중..." : "생성"}</PrismButton>;
    const checkText = { idle: "기준 명을 입력하면 중복 여부를 확인합니다", checking: "중복 여부를 확인하고 있습니다", available: "등록 가능한 기준입니다", duplicate: "이미 등록된 기준입니다", error: "중복 여부를 확인하지 못했습니다. 다시 시도해 주세요." };
    return <PrismDialog open={open} onOpenChange={close} width={confirmation ? 520 : kind === "job" ? 720 : 480} className="prism-block-dialog" title={confirmation ? "영향 포지션 목록 확인" : `${labels[kind]} ${view ? "상세" : mode === "edit" ? "수정" : "생성"}`} description={confirmation ? "수정을 확정하기 전에 영향 받는 포지션을 확인해 주세요." : `${labels[kind]}의 이름과 설명을 확인합니다.`} footer={footer}>
        {confirmation ? <div className="prism-block-confirm"><p>수정하려는 기준이 아래 포지션에 매핑되어 있습니다.<br/>기준 정보 변경 시 해당 포지션의 Requirement도 변경된 기준을 바탕으로 다시 반영됩니다.<br/>수정을 확정하기 전에 영향 받는 포지션을 확인해 주세요.</p><BlockSummary label="수정 대상 기준" name={baseline.current.name} count={confirmation.positions.length}/><ImpactTable positions={confirmation.positions}/></div> :
            <div className="prism-block-form" aria-busy={!!task.busy}>{task.busy === "impact" && <p role="status">영향 포지션을 확인하는 중...</p>}
                {kind === "job" && <PrismSelect label="직무 대분류" size="small" required value={draft.categoryId ?? ""} options={categories.map(category => ({ value: category.id, label: category.name }))} placeholder="직무 대분류 선택" readOnly={view} disabled={view || !!task.busy} onValueChange={categoryId => setDraft({ ...draft, categoryId })}/>}
                <div><PrismInput label="기준 명" size="small" required value={draft.name} placeholder="기준 명 입력" readOnly={view} disabled={!!task.busy} onChange={event => setDraft({ ...draft, name: event.target.value })} onClear={view ? undefined : () => setDraft({ ...draft, name: "" })}/>{!view && <p className="prism-block-check" data-status={status} role={status === "error" ? "alert" : "status"}>{status === "checking" ? <PrismIcon name="GeneratingSpinnerIcon" size={16}/> : status === "available" ? <PrismIcon name="ToastCheckIcon" size={16}/> : status === "duplicate" || status === "error" ? <PrismIcon name="ToastErrorIcon" size={16}/> : null}{checkText[status]}</p>}{!view && status === "error" && <PrismButton variant="line" size="small" disabled={!!task.busy} onClick={() => setCheckAttempt(value => value + 1)}>다시 확인</PrismButton>}</div>
                <PrismTextarea label="설명" required rows={kind === "job" ? 4 : 5} value={draft.description} placeholder="AI로 설명을 생성해 주세요." readOnly={view} disabled={!!task.busy || (!view && !descriptionGenerated)}
                    inputOverlay={task.busy === "description" ? <GenerationOverlay label="설명을 생성하는 중입니다."/> : null}
                    beforeInput={!view ? <><p className="prism-block-helper">기준명을 바탕으로 설명을 AI가 생성합니다. 생성된 내용은 직접 수정할 수 있습니다.</p><GenerateControl label="AI로 설명 생성" generated={descriptionGenerated} busy={task.busy === "description"} disabled={!canGenerate || !props.onGenerateDescription} onGenerate={generateDescription} notice="다시 생성하면 현재 등록된 설명이 AI 생성 결과로 대체됩니다."/></> : undefined}
                    onChange={event => setDraft({ ...draft, description: event.target.value })}/>
                {kind === "job" && <section className="prism-block-field"><h3>소직무<span aria-hidden="true">*</span></h3>{!view && <><p className="prism-block-helper">직무 대분류와 기준 명을 바탕으로 관련 소직무를 생성합니다.</p><GenerateControl label="AI로 소직무 생성" generated={subGenerated} busy={task.busy === "subJobs"} disabled={!canGenerate || !draft.description.trim() || !props.onGenerateSubJobs} onGenerate={generateSubJobs} notice="다시 생성하면 현재 등록된 소직무가 AI 생성 결과로 대체됩니다."/></>}
                    <div className="prism-block-generate-area">{task.busy === "subJobs" && <GenerationOverlay label="소직무를 생성하는 중입니다." empty={!draft.subJobs?.length}/>}
                        <div className="prism-block-sub-jobs">{draft.subJobs?.map((job, index) => <div className="prism-block-sub-job" key={job.id}><div><PrismInput label="소직무 명" aria-label={`소직무 ${index + 1} 명`} size="small" value={job.name} readOnly={view} disabled={!!task.busy} onChange={event => setDraft({ ...draft, subJobs: draft.subJobs?.map(item => item.id === job.id ? { ...item, name: event.target.value } : item) })}/><PrismInput label="설명" aria-label={`소직무 ${index + 1} 설명`} size="small" value={job.description} readOnly={view} disabled={!!task.busy} onChange={event => setDraft({ ...draft, subJobs: draft.subJobs?.map(item => item.id === job.id ? { ...item, description: event.target.value } : item) })}/></div>{!view && <button type="button" className="prism-block-sub-job-delete" disabled={!!task.busy} aria-label={`소직무 ${index + 1} 삭제`} onClick={() => { if (!task.isPending()) setDraft({ ...draft, subJobs: draft.subJobs?.filter(item => item.id !== job.id) }); }}>삭제</button>}</div>)}</div>
                    </div>
                    {!view && subGenerated && <PrismButton variant="line" size="small" disabled={!!task.busy} onClick={() => setDraft({ ...draft, subJobs: [...draft.subJobs ?? [], { id: `${subId}-${++sequence.current}`, name: "", description: "" }] })}>소직무 추가</PrismButton>}
                </section>}
            </div>}{task.error && <p className="prism-error" role="alert">{task.error}</p>}
    </PrismDialog>;
}

export type PrismBlockDeletionDialogProps = { open: boolean; onOpenChange: (open: boolean) => void; scopeKey: string; kind: "industry" | "job"; target: PrismBlockItem;
    candidates: readonly PrismBlockItem[]; readOnly?: boolean; onLoadAffected: (request: PrismBlockImpactRequest, context: PrismBlockTaskContext) => Promise<readonly PrismBlockAffectedPosition[]>;
    onConfirm: (request: PrismBlockDeleteRequest, context: PrismBlockTaskContext) => Promise<void>; onDeleted?: (request: PrismBlockDeleteRequest) => void };
export function PrismBlockDeletionDialog(props: PrismBlockDeletionDialogProps) {
    const { open, scopeKey, kind, target, candidates, readOnly = false } = props;
    const key = JSON.stringify([scopeKey, open, kind, target.id, readOnly, target.change]);
    const latest = useRef(props), [positions, setPositions] = useState<PrismBlockAffectedPosition[] | null>(null), [remap, setRemap] = useState<Readonly<Record<string, string>>>({});
    const task = useBlockTask(key), locked = readOnly || target.change === "deleted" || target.change === "applying";
    useLayoutEffect(() => { latest.current = props; });
    useLayoutEffect(() => { setPositions(null); setRemap({}); }, [key]);
    const load = () => { if (!open || locked) return;
        void task.run("load", signal => latest.current.onLoadAffected({ kind, targetId: target.id }, { scopeKey, signal }), rows => {
            const copied = copyPositions(rows);
            if (copied.some(row => !row.id || kind === "job" && row.mapping !== "primary" && row.mapping !== "secondary") || new Set(copied.map(row => row.id)).size !== copied.length) throw new Error("Invalid impact rows");
            if (kind === "job") copied.sort((a, b) => a.mapping === b.mapping ? 0 : a.mapping === "primary" ? -1 : 1);
            setPositions(copied);
        }, "영향 포지션을 불러오지 못했습니다. 다시 시도해 주세요."); };
    useEffect(() => { load(); }, [key]);
    const options = candidates.filter(item => item.id !== target.id && item.change !== "deleted" && item.change !== "applying");
    let payload: Readonly<Record<string, string>> | null = null;
    if (positions) { try { payload = preparePrismBlockRemap(kind, target.id, positions, candidates, remap); } catch { /* Incomplete or conflicting selections must not submit. */ } }
    const submit = () => { if (locked || task.isPending() || !positions || !payload) return;
        const request = Object.freeze({ kind, targetId: target.id, remap: payload });
        void task.run("delete", signal => latest.current.onConfirm(request, { scopeKey, signal }), (_result, current) => { latest.current.onDeleted?.(request); if (current()) latest.current.onOpenChange(false); }, "삭제 및 재매핑을 완료하지 못했습니다. 선택을 확인하고 다시 시도해 주세요."); };
    return <PrismDialog open={open} onOpenChange={next => { if (!task.isPending()) latest.current.onOpenChange(next); }} width={kind === "job" ? 820 : 720} className="prism-block-dialog prism-block-delete-dialog" title="기준 삭제 및 재매핑" description="삭제를 진행하려면 각 포지션의 기준을 다시 지정해 주세요." footer={<><PrismButton variant="line" disabled={!!task.busy} onClick={() => { if (!task.isPending()) latest.current.onOpenChange(false); }}>취소</PrismButton><PrismButton tone="danger" disabled={locked || !!task.busy || !payload} onClick={submit}>{task.busy === "delete" ? "처리 중..." : "삭제 및 재매핑"}</PrismButton></>}>
        <div className="prism-block-confirm"><p>삭제하려는 기준이 아래 포지션에 매핑되어 있습니다.<br/>삭제를 진행하려면 각 포지션의 기준을 다시 지정해 주세요.</p><BlockSummary label="삭제 대상 기준" name={target.name} count={positions?.length ?? 0}/>
            {locked ? <p role="status">현재 기준은 삭제할 수 없습니다.</p> : task.busy === "load" ? <p role="status">영향 포지션을 불러오는 중...</p> : positions ? <div className="prism-block-remap-table"><PrismTable caption="기준 재매핑"><thead><tr><th scope="col">회사</th><th scope="col">포지션 명</th>{kind === "job" ? <><th scope="col">매핑 구분</th><th scope="col">현재 다른 기준</th></> : <th scope="col">현재 기준</th>}<th scope="col">재매핑 기준</th></tr></thead><tbody>{positions.length ? positions.map(row => {
                const conflict = kind === "job" && !!remap[row.id] && remap[row.id] === row.otherCriteria?.id;
                return <tr key={row.id}><td>{row.company}</td><td>{row.name}</td>{kind === "job" ? <><td>{row.mapping === "primary" ? "주직무" : "보조직무"}</td><td>{row.otherCriteria ? `${row.mapping === "primary" ? "보조직무" : "주직무"} : ${row.otherCriteria.name}` : "-"}</td></> : <td>{target.name}</td>}<td><PrismSelect label={`${row.name} 재매핑 기준`} size="small" value={remap[row.id] ?? ""} disabled={!!task.busy} placeholder={kind === "job" && row.mapping === "secondary" ? "보조직무 해제" : "블럭 선택"} error={conflict ? "다른 직무 기준과 중복됩니다." : undefined} options={options.map(item => ({ value: item.id, label: item.name }))} onValueChange={value => setRemap(previous => ({ ...previous, [row.id]: value }))}/>{kind === "job" && row.mapping === "secondary" && !!remap[row.id] && <PrismButton variant="shape" size="small" disabled={!!task.busy} onClick={() => setRemap(previous => ({ ...previous, [row.id]: "" }))}>보조직무 해제</PrismButton>}</td></tr>;
            }) : <tr><td colSpan={kind === "job" ? 5 : 4}>영향 받는 포지션이 없습니다.</td></tr>}</tbody></PrismTable></div> : null}
            {task.error && <div><p className="prism-error" role="alert">{task.error}</p>{!positions && <PrismButton variant="line" size="small" disabled={!!task.busy || locked} onClick={load}>다시 조회</PrismButton>}</div>}
            {kind === "job" && positions?.some(row => row.mapping === "secondary") && <p className="prism-block-helper">주직무는 대체 기준이 필요합니다. 보조직무는 선택하지 않으면 해제됩니다.</p>}
        </div>
    </PrismDialog>;
}

export type PrismBlockOpenRequest = { kind: PrismBlockKind; mode: PrismBlockMode; initial?: PrismBlockItem };
export type PrismPositionBlockManagementProps = { source: PrismPositionSource; onSourceChange: (source: PrismPositionSource) => void;
    industries: readonly PrismBlockItem[]; positions: readonly PrismBlockItem[]; jobs: readonly PrismBlockItem[]; categories: readonly PrismBlockCategory[];
    sync: { status: PrismPositionSyncStatus; date: string; loading?: boolean }; loading?: boolean; readOnly?: boolean; error?: string; onRetry?: () => void;
    onOpen: (request: PrismBlockOpenRequest) => void; onDelete: (kind: "industry" | "job", item: PrismBlockItem) => void };
function BlockSection({ title, count, onCreate, disabled, children }: { title: string; count: number; onCreate?: () => void; disabled: boolean; children: ReactNode }) {
    return <section className="prism-block-section"><header><h3>{title}<span>{count}</span></h3>{onCreate && <PrismButton variant="line" size="small" disabled={disabled} onClick={onCreate}>생성</PrismButton>}</header>{children}</section>;
}
function BlockLoading() {
    const tags = (count: number) => <div className="prism-block-tags">{Array.from({ length: count }, (_, index) => <PrismSkeleton key={index} width={[64, 96, 80][index % 3]} height={26}/>)}</div>;
    return <div className="prism-block-loading" aria-label="포지션 블록 로딩 중">{[1, 2].map(id => <section className="prism-block-section" key={id}><header><PrismSkeleton width={100} height={20}/></header>{tags(8)}</section>)}<section className="prism-block-section"><header><PrismSkeleton width={100} height={20}/></header><div className="prism-block-category-grid">{Array.from({ length: 6 }, (_, index) => <div className="prism-block-category" key={index}><PrismSkeleton width={90} height={18}/>{tags(3)}</div>)}</div></section></div>;
}
export function PrismPositionBlockManagement({ source, onSourceChange, industries, positions, jobs, categories, sync, loading = false, readOnly = false, error, onRetry, onOpen, onDelete }: PrismPositionBlockManagementProps) {
    const edit = source === "TEMP", editable = edit && !readOnly && sync.status !== "scheduled" && sync.status !== "running" && !loading && !sync.loading;
    const openItem = (kind: PrismBlockKind, item?: PrismBlockItem) => {
        if (edit && (!editable || item?.change === "deleted")) return;
        onOpen({ kind, mode: !editable || kind === "position" || item?.change === "applying" ? "view" : item ? "edit" : "create", ...(item ? { initial: { id: item.id, ...copyDraft(item), ...(item.change ? { change: item.change } : {}) } } : {}) });
    };
    const tags = (kind: PrismBlockKind, items: readonly PrismBlockItem[]) => <div className="prism-block-tags">{items.map(item => <PrismCriteriaTag key={item.id} label={item.name} change={edit ? item.change : undefined} disabled={edit && !editable} onEdit={() => openItem(kind, item)} onDelete={editable && kind !== "position" ? () => onDelete(kind, { id: item.id, ...copyDraft(item), change: item.change }) : undefined}/>)}</div>;
    const count = (items: readonly PrismBlockItem[]) => items.filter(item => item.change !== "deleted").length;
    return <PrismAdminLayout title="포지션 블럭 관리" className="prism-admin-blocks"><PrismTabs value={source} onValueChange={value => onSourceChange(value as PrismPositionSource)}><PrismTabsList><PrismTabsTrigger value="LIVE">현재 반영 버전</PrismTabsTrigger><PrismTabsTrigger value="TEMP">편집 버전</PrismTabsTrigger></PrismTabsList><PrismTabsContent value={source}><div className="prism-block-content">
        <PrismPositionSyncBar status={sync.status} date={sync.date} loading={loading || sync.loading} note={edit && sync.status === "editing" ? "블록 수정 또는 삭제로 인해 포지션 정보가 변경되는 경우, 관련 데이터가 반영되기까지 일정 시간이 소요될 수 있습니다." : undefined}/>
        {loading ? <BlockLoading/> : error ? <div><p role="alert" className="prism-error">{error}</p>{onRetry && <PrismButton variant="line" onClick={onRetry}>다시 조회</PrismButton>}</div> : <>
            <BlockSection title={labels.industry} count={count(industries)} disabled={!editable} onCreate={edit ? () => openItem("industry") : undefined}>{tags("industry", industries)}</BlockSection>
            <BlockSection title={labels.position} count={count(positions)} disabled={!editable}>{tags("position", positions)}</BlockSection>
            <BlockSection title={labels.job} count={count(jobs)} disabled={!editable} onCreate={edit ? () => openItem("job") : undefined}><div className="prism-block-category-grid">{categories.map(category => <section className="prism-block-category" key={category.id}><h4>{category.name}</h4>{tags("job", jobs.filter(job => job.categoryId === category.id))}</section>)}</div>{!categories.length && <p className="prism-block-helper">등록된 직무 대분류가 없습니다.</p>}</BlockSection>
        </>}
    </div></PrismTabsContent></PrismTabs></PrismAdminLayout>;
}
