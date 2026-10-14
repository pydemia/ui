import { useEffect, useRef, useState, type ReactNode } from "react";
import { PrismIcon, PrismXGlyph as X, PrismPlusGlyph as Plus } from "./prism-icon";
import { PrismDialog } from "./prism-dialog";
import { PrismButton } from "./prism-button";
import { PrismInput, PrismTextarea, PrismSelect } from "./prism-field";
import { PrismAiGenerateButton, PrismAffectedPositions } from "./prism-management";
import { PrismTable } from "./prism-display";
import { PrismContextOptionCard } from "./prism-context";

export type PrismCriteriaChange = "new" | "added" | "modified" | "deleted" | "applying" | "failed";
export function PrismCriteriaTag({ label, change, disabled, onEdit, onDelete }: { label: string; change?: PrismCriteriaChange; disabled?: boolean; onEdit?: () => void; onDelete?: () => void }) {
    const labels = {new:"신규",added:"추가됨",modified:"수정됨",deleted:"삭제됨",applying:"반영중",failed:"실패"};
    const deletable = onDelete && !disabled && change !== "deleted" && change !== "applying";
    return <span className="prism-criteria-tag" data-change={change} data-disabled={disabled || undefined}><button type="button" disabled={disabled || !onEdit || change === "deleted"} onClick={onEdit}><span className="prism-criteria-tag-name" title={label}>{label}</span>{change && <small>{labels[change]}</small>}</button>
        {deletable && <button type="button" className="prism-criteria-delete" aria-label={`${label} 삭제`} onClick={onDelete}><PrismIcon name="ChipCloseIcon" size={16}/></button>}</span>;
}
export type PrismCriteriaDraft = { name: string; description: string; categoryId?: string; subJobs?: readonly { id: string; name: string }[] };
export function PrismCriteriaEditor({ title, open, onOpenChange, value, onValueChange, onSubmit, categories, positions = [], checkStatus = "idle", checkedName, onCheck, onGenerate, busy, error, children }: {
    title: string; open: boolean; onOpenChange: (open: boolean) => void; value: PrismCriteriaDraft; onValueChange: (value: PrismCriteriaDraft) => void;
    onSubmit: (value: PrismCriteriaDraft) => void; categories?: readonly { id: string; label: string }[];
    positions?: readonly { id: string; name: string; company: string }[]; checkStatus?: "idle" | "checking" | "available" | "duplicate";
    checkedName?: string; onCheck?: (name: string) => void;
    onGenerate?: () => void; busy?: boolean; error?: string; children?: ReactNode;
}) {
    const name = value.name.trim();
    const currentCheckStatus = onCheck && checkedName?.trim() !== name ? "idle" : checkStatus;
    const valid = !!name && !!value.description.trim() && (!categories || !!value.categoryId) && (!onCheck || currentCheckStatus === "available");
    const changeOpen = (next: boolean) => { if (!busy || next) onOpenChange(next); };
    return <PrismDialog title={title} description="기준의 정의와 영향 포지션을 확인합니다." open={open} onOpenChange={changeOpen} className="prism-criteria-dialog"
        footer={<><PrismButton variant="line" disabled={busy} onClick={() => changeOpen(false)}>취소</PrismButton><PrismButton disabled={busy || !valid} onClick={() => onSubmit({...value,name})}>{busy ? "저장 중" : "저장"}</PrismButton></>}>
        <div className="prism-criteria-editor">{categories && <PrismSelect label="직무 유형" value={value.categoryId ?? ""} disabled={busy} onChange={e => onValueChange({...value,categoryId:e.target.value})}><option value="">선택해 주세요.</option>{categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</PrismSelect>}
            <div className="prism-criteria-name"><PrismInput label="기준명" required value={value.name} disabled={busy} onChange={e => onValueChange({...value,name:e.target.value})} />{onCheck && <PrismButton variant="line" disabled={busy || currentCheckStatus === "checking" || !name} onClick={() => onCheck(name)}>중복 확인</PrismButton>}</div>
            {onCheck && <p className="prism-criteria-check" data-status={currentCheckStatus} role="status">{currentCheckStatus === "available" ? "사용 가능한 이름입니다." : currentCheckStatus === "duplicate" ? "이미 등록된 이름입니다." : currentCheckStatus === "checking" ? "확인 중입니다." : name ? "중복 확인이 필요합니다." : ""}</p>}
            <PrismTextarea label="기준 정의" required value={value.description} disabled={busy} onChange={e => onValueChange({...value,description:e.target.value})} />{onGenerate && <PrismAiGenerateButton label="정의 생성" onGenerate={onGenerate} busy={busy} disabled={!name || (!!onCheck && currentCheckStatus !== "available")} />}
            {value.subJobs && <section><h3>세부 직무</h3>{value.subJobs.map(item => <div className="prism-sub-job" key={item.id}><PrismInput label="세부 직무명" value={item.name} disabled={busy} onChange={e => onValueChange({...value,subJobs:value.subJobs?.map(job => job.id === item.id ? {...job,name:e.target.value} : job)})} />
                <PrismButton variant="shape" iconOnly aria-label={`${item.name || "세부 직무"} 제거`} icon={<X />} disabled={busy} onClick={() => onValueChange({...value,subJobs:value.subJobs?.filter(job => job.id !== item.id)})} /></div>)}
                <PrismButton variant="line" size="small" icon={<Plus />} disabled={busy} onClick={() => onValueChange({...value,subJobs:[...value.subJobs!,{id:crypto.randomUUID(),name:""}]})}>세부 직무 추가</PrismButton></section>}
            {children}{error && <p role="alert" className="prism-error">{error}</p>}<PrismAffectedPositions positions={positions} /></div></PrismDialog>;
}
export function PrismCriteriaRemapDialog({ open, onOpenChange, targetId, targetName, positions, options, value, onValueChange, onConfirm, loadState, loadedTargetId, onRetry, busy }: {
    open: boolean; onOpenChange: (open: boolean) => void; targetId: string; targetName: string; positions: readonly { id: string; name: string; company: string }[];
    options: readonly { id: string; label: string; change?: PrismCriteriaChange }[]; value: Readonly<Record<string,string>>; onValueChange: (value: Readonly<Record<string,string>>) => void;
    onConfirm: (value: Readonly<Record<string,string>>) => void; loadState: "loading" | "ready" | "error"; loadedTargetId: string | null; onRetry?: () => void; busy?: boolean;
}) {
    const available = options.filter(o => o.id !== targetId && o.change !== "deleted" && o.change !== "applying");
    const currentLoad = targetId && loadedTargetId !== targetId ? "loading" : loadState;
    const complete = currentLoad === "ready" && !!targetId && positions.every(p => available.some(o => o.id === value[p.id]));
    const changeOpen = (next: boolean) => { if (!busy || next) onOpenChange(next); };
    return <PrismDialog className="prism-criteria-dialog" title="기준 삭제" description={`${targetName} 삭제에 영향을 받는 포지션의 대체 기준을 지정해 주세요.`} open={open} onOpenChange={changeOpen}
        footer={<><PrismButton variant="line" disabled={busy} onClick={() => changeOpen(false)}>취소</PrismButton><PrismButton tone="danger" disabled={busy || !complete} onClick={() => onConfirm(Object.fromEntries(positions.map(p => [p.id,value[p.id]])))}>삭제</PrismButton></>}>
        <div className="prism-criteria-remap"><p>{currentLoad === "ready" ? `${positions.length}개 포지션에 영향을 줍니다.` : "영향 포지션을 확인합니다."}</p>
            {currentLoad === "loading" ? <p role="status">영향 포지션을 불러오는 중입니다.</p> : currentLoad === "error" ? <div><p role="alert">영향 포지션을 불러오지 못했습니다.</p>{onRetry && <PrismButton variant="line" onClick={onRetry}>다시 시도</PrismButton>}</div> :
            <PrismTable caption="대체 기준 지정"><thead><tr><th scope="col">포지션</th><th scope="col">회사</th><th scope="col">대체 기준</th></tr></thead><tbody>{positions.length ? positions.map(p => <tr key={p.id}><th scope="row">{p.name}</th><td>{p.company}</td><td><PrismSelect label={`${p.name} 대체 기준`} value={value[p.id] ?? ""} disabled={busy} onChange={e => onValueChange({...value,[p.id]:e.target.value})}><option value="">선택해 주세요.</option>{available.map(o => <option value={o.id} key={o.id}>{o.label}</option>)}</PrismSelect></td></tr>) : <tr><td colSpan={3}>영향을 받는 포지션이 없습니다.</td></tr>}</tbody></PrismTable>}</div></PrismDialog>;
}
export function PrismPositionCheckCard({ id, title, description, checked, disabled, onChange }: { id: string; title: string; description: string; checked: boolean; disabled?: boolean; onChange: (checked: boolean) => void }) {
    return <PrismContextOptionCard option={{value:id,label:title,description}} checked={checked} disabled={disabled} onCheckedChange={onChange} />;
}
async function copyCompanyContext(content: string) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(content);
    const textarea = document.createElement("textarea");
    textarea.value = content;
    textarea.readOnly = true;
    textarea.style.cssText = "position:fixed;left:-9999px;top:0";
    document.body.appendChild(textarea);
    try {
        textarea.select();
        if (!document.execCommand("copy")) throw new Error("Clipboard copy failed");
    } finally {
        textarea.remove();
    }
}
export function PrismCompanyContextDialog({ open, onOpenChange, company, content, onCopy }: { open: boolean; onOpenChange: (open: boolean) => void; company: string; content: string; onCopy?: (content: string) => void | Promise<void> }) {
    const [copyState, setCopyState] = useState<"idle" | "copying" | "copied" | "error">("idle");
    const copyGeneration = useRef(0);
    useEffect(() => { copyGeneration.current++; setCopyState("idle"); return () => { copyGeneration.current++; }; }, [open, content]);
    const copy = async () => {
        if (!open || copyState === "copying") return;
        const generation = copyGeneration.current;
        setCopyState("copying");
        try {
            await (onCopy ? onCopy(content) : copyCompanyContext(content));
            if (generation === copyGeneration.current) setCopyState("copied");
        } catch {
            if (generation === copyGeneration.current) setCopyState("error");
        }
    };
    return <PrismDialog title="회사 주요 과제 보기" description="회사 현안 정보를 확인합니다." open={open} onOpenChange={onOpenChange}
        footer={<PrismButton variant="line" onClick={() => onOpenChange(false)}>닫기</PrismButton>}><div className="prism-company-context">
            <div className="prism-company-context-head"><strong>{company}</strong><PrismButton variant="shape" size="small" disabled={!content || copyState === "copying"} onClick={copy}>{copyState === "copied" ? "복사 완료" : copyState === "copying" ? "복사 중" : "내용 복사"}</PrismButton></div>
            {copyState === "error" && <p role="alert">복사하지 못했습니다. 다시 시도해 주세요.</p>}
            <div className="prism-company-context-body">{content || "등록된 현안이 없습니다."}</div>
        </div></PrismDialog>;
}
