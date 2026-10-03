import type { ReactNode } from "react";
import { PrismXGlyph as X, PrismPlusGlyph as Plus } from "./prism-icon";
import { PrismDialog } from "./prism-dialog";
import { PrismButton } from "./prism-button";
import { PrismInput, PrismTextarea, PrismSelect } from "./prism-field";
import { PrismAiGenerateButton, PrismAffectedPositions } from "./prism-management";
import { PrismTable } from "./prism-display";
import { PrismContextOptionCard } from "./prism-context";

export type PrismCriteriaChange = "new" | "modified" | "deleted" | "applying" | "failed";
export function PrismCriteriaTag({ label, change, disabled, onEdit, onDelete }: { label: string; change?: PrismCriteriaChange; disabled?: boolean; onEdit?: () => void; onDelete?: () => void }) {
    const labels = {new:"신규",modified:"수정",deleted:"삭제 예정",applying:"반영 중",failed:"반영 실패"};
    return <span className="prism-criteria-tag" data-change={change} data-disabled={disabled || undefined}><button type="button" disabled={disabled || !onEdit} onClick={onEdit}>{label}{change && <small>{labels[change]}</small>}</button>
        {onDelete && <button type="button" className="prism-criteria-delete" aria-label={`${label} 삭제`} disabled={disabled || change === "applying"} onClick={onDelete}><X aria-hidden="true" /></button>}</span>;
}
export type PrismCriteriaDraft = { name: string; description: string; categoryId?: string; subJobs?: readonly { id: string; name: string }[] };
export function PrismCriteriaEditor({ title, open, onOpenChange, value, onValueChange, onSubmit, categories, positions = [], checkStatus = "idle", onCheck, onGenerate, busy, error, children }: {
    title: string; open: boolean; onOpenChange: (open: boolean) => void; value: PrismCriteriaDraft; onValueChange: (value: PrismCriteriaDraft) => void;
    onSubmit: (value: PrismCriteriaDraft) => void; categories?: readonly { id: string; label: string }[];
    positions?: readonly { id: string; name: string; company: string }[]; checkStatus?: "idle" | "checking" | "available" | "duplicate"; onCheck?: () => void;
    onGenerate?: () => void; busy?: boolean; error?: string; children?: ReactNode;
}) {
    const valid = !!value.name.trim() && !!value.description.trim() && (!categories || !!value.categoryId) && checkStatus !== "duplicate" && checkStatus !== "checking" && (!onCheck || checkStatus === "available");
    return <PrismDialog title={title} description="기준의 정의와 영향 포지션을 확인합니다." open={open} onOpenChange={onOpenChange} className="prism-criteria-dialog"
        footer={<><PrismButton variant="line" disabled={busy} onClick={() => onOpenChange(false)}>취소</PrismButton><PrismButton disabled={busy || !valid} onClick={() => onSubmit(value)}>{busy ? "저장 중" : "저장"}</PrismButton></>}>
        <div className="prism-criteria-editor">{categories && <PrismSelect label="직무 유형" value={value.categoryId ?? ""} disabled={busy} onChange={e => onValueChange({...value,categoryId:e.target.value})}><option value="">선택해 주세요.</option>{categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</PrismSelect>}
            <div className="prism-criteria-name"><PrismInput label="기준명" required value={value.name} disabled={busy} onChange={e => onValueChange({...value,name:e.target.value})} />{onCheck && <PrismButton variant="line" disabled={busy || checkStatus === "checking" || !value.name.trim()} onClick={onCheck}>중복 확인</PrismButton>}</div>
            <p className="prism-criteria-check" data-status={checkStatus} role="status">{checkStatus === "available" ? "사용 가능한 이름입니다." : checkStatus === "duplicate" ? "이미 등록된 이름입니다." : checkStatus === "checking" ? "확인 중입니다." : ""}</p>
            <PrismTextarea label="기준 정의" required value={value.description} disabled={busy} onChange={e => onValueChange({...value,description:e.target.value})} />{onGenerate && <PrismAiGenerateButton label="정의 생성" onGenerate={onGenerate} busy={busy} />}
            {value.subJobs && <section><h3>세부 직무</h3>{value.subJobs.map(item => <div className="prism-sub-job" key={item.id}><PrismInput label="세부 직무명" value={item.name} disabled={busy} onChange={e => onValueChange({...value,subJobs:value.subJobs?.map(job => job.id === item.id ? {...job,name:e.target.value} : job)})} />
                <PrismButton variant="shape" iconOnly aria-label={`${item.name || "세부 직무"} 제거`} icon={<X />} disabled={busy} onClick={() => onValueChange({...value,subJobs:value.subJobs?.filter(job => job.id !== item.id)})} /></div>)}
                <PrismButton variant="line" size="small" icon={<Plus />} disabled={busy} onClick={() => onValueChange({...value,subJobs:[...value.subJobs!,{id:crypto.randomUUID(),name:""}]})}>세부 직무 추가</PrismButton></section>}
            {children}{error && <p role="alert" className="prism-error">{error}</p>}<PrismAffectedPositions positions={positions} /></div></PrismDialog>;
}
export function PrismCriteriaRemapDialog({ open, onOpenChange, targetId, targetName, positions, options, value, onValueChange, onConfirm, busy }: {
    open: boolean; onOpenChange: (open: boolean) => void; targetId: string; targetName: string; positions: readonly { id: string; name: string; company: string }[];
    options: readonly { id: string; label: string }[]; value: Readonly<Record<string,string>>; onValueChange: (value: Readonly<Record<string,string>>) => void;
    onConfirm: (value: Readonly<Record<string,string>>) => void; busy?: boolean;
}) {
    const available = options.filter(o => o.id !== targetId); const complete = positions.every(p => available.some(o => o.id === value[p.id]));
    return <PrismDialog className="prism-criteria-dialog" title="기준 삭제" description={`${targetName} 삭제에 영향을 받는 포지션의 대체 기준을 지정해 주세요.`} open={open} onOpenChange={onOpenChange}
        footer={<><PrismButton variant="line" disabled={busy} onClick={() => onOpenChange(false)}>취소</PrismButton><PrismButton tone="danger" disabled={busy || !complete} onClick={() => onConfirm(Object.fromEntries(positions.map(p => [p.id,value[p.id]])))}>삭제</PrismButton></>}>
        <div className="prism-criteria-remap"><p>{positions.length}개 포지션에 영향을 줍니다.</p><PrismTable caption="대체 기준 지정"><thead><tr><th scope="col">포지션</th><th scope="col">회사</th><th scope="col">대체 기준</th></tr></thead><tbody>{positions.map(p => <tr key={p.id}><th scope="row">{p.name}</th><td>{p.company}</td><td><PrismSelect label={`${p.name} 대체 기준`} value={value[p.id] ?? ""} disabled={busy} onChange={e => onValueChange({...value,[p.id]:e.target.value})}><option value="">선택해 주세요.</option>{available.map(o => <option value={o.id} key={o.id}>{o.label}</option>)}</PrismSelect></td></tr>)}</tbody></PrismTable></div></PrismDialog>;
}
export function PrismPositionCheckCard({ id, title, description, checked, disabled, onChange }: { id: string; title: string; description: string; checked: boolean; disabled?: boolean; onChange: (checked: boolean) => void }) {
    return <PrismContextOptionCard option={{value:id,label:title,description}} checked={checked} disabled={disabled} onCheckedChange={onChange} />;
}
export function PrismCompanyContextDialog({ open, onOpenChange, company, content, onCopy }: { open: boolean; onOpenChange: (open: boolean) => void; company: string; content: string; onCopy?: (content: string) => void }) {
    return <PrismDialog title={`${company} 핵심 현안`} description="회사 현안 정보를 확인합니다." open={open} onOpenChange={onOpenChange}
        footer={<PrismButton variant="line" onClick={() => onOpenChange(false)}>닫기</PrismButton>}><div className="prism-company-context">{onCopy && <PrismButton variant="shape" size="small" onClick={() => onCopy(content)}>내용 복사</PrismButton>}<div>{content || "등록된 현안이 없습니다."}</div></div></PrismDialog>;
}
