import { useId, type ReactNode } from "react";
import { PrismIcon } from "./prism-icon";
import { PrismElpBadge, PrismChip } from "./prism-badge";
import { PrismTable } from "./prism-display";
import { PrismFavoriteToggle, PrismAffiliateLogo } from "./prism-primitives";
import { PrismEvaluationHistory } from "./prism-record";

export type PrismCandidate = { id: string; name: string; company: string; position: string; executiveYears?: number;
    elp?: "ELP" | "s-ELP"; photo?: string; speciality?: string; summary?: string;
    birthDate?: string; appointmentDate?: string; groupJoinDate?: string; education?: string;
    brand?: string; companyField?: string; domain?: string; presidentPromotionDate?: string; groupJoinYears?: number;
    recentEvaluations?: readonly {year:string;grade:string|null;active?:boolean}[]; compensationText?: string | null };
export type PrismCandidateCardProps = { candidate: PrismCandidate; rank?: number; selected?: boolean; favorite?: boolean;
    onOpen: (candidate: PrismCandidate) => void; onFavoriteChange?: (value: boolean) => void; children?: ReactNode;
    variant?: "stack" | "pair" | "grid"; panel?: boolean; showDetails?: boolean };
export function PrismCandidateCard({ candidate, rank, selected, favorite, onOpen, onFavoriteChange, children, variant = "stack", panel, showDetails }: PrismCandidateCardProps) {
    const nameId=useId();
    return <article className="prism-candidate-card" data-selected={selected || undefined} data-variant={variant} data-panel={panel || undefined}>
        <button type="button" className="prism-candidate-open" aria-labelledby={nameId} onClick={()=>onOpen(candidate)}/>
        {rank !== undefined && <span className="prism-rank">{rank}순위</span>}
        <div className="prism-candidate-header"><div className="prism-candidate-photo" aria-hidden="true">
            {candidate.photo && <img src={candidate.photo} alt="" />}</div>
            <div className="prism-candidate-info"><div className="prism-candidate-name"><span id={nameId} className="prism-candidate-label">{candidate.name}</span>
                {candidate.elp && <PrismElpBadge type={candidate.elp} />}</div><div className="prism-candidate-categories">{candidate.companyField&&<b>{candidate.companyField}</b>}{(candidate.domain??candidate.speciality)&&<span>{candidate.domain??candidate.speciality}</span>}</div><p><PrismAffiliateLogo brand={candidate.brand} affiliate={candidate.company} size={12}/></p><p>{candidate.position}</p></div>
            {onFavoriteChange && <PrismFavoriteToggle name={candidate.name} checked={!!favorite} onCheckedChange={onFavoriteChange}/>}</div>
        <PrismCandidateBrief candidate={candidate} compact={variant==="grid"} single={variant==="stack"&&!panel}/>
        {candidate.summary && <p className="prism-candidate-summary">{candidate.summary}</p>}{children&&<div className="prism-candidate-extra">{children}</div>}
        {(showDetails??(variant==="stack"&&!panel)) && <button type="button" className="prism-candidate-detail-button" onClick={() => onOpen(candidate)}>상세 프로필 보기<PrismIcon name="ChevronRightIcon" size={16}/></button>}</article>;
}
/** Values are prepared by the consumer; no currency conversion or evaluation rules run here. */
export function PrismCandidateBrief({candidate,compact=false,single=true}:{candidate:PrismCandidate;compact?:boolean;single?:boolean}) {
    const fields:readonly [string,ReactNode][]=[["생년월일",candidate.birthDate??"-"],["임원 선임일",candidate.appointmentDate ? `${candidate.appointmentDate}${candidate.executiveYears===undefined ? "" : ` (${candidate.executiveYears}년차)`}` : "-"],
        ...(candidate.presidentPromotionDate?.trim() ? [["사장 승진일",candidate.presidentPromotionDate] as [string,ReactNode]] : []),["그룹 입사일",candidate.groupJoinDate ? `${candidate.groupJoinDate}${candidate.groupJoinYears===undefined ? "" : ` (${candidate.groupJoinYears}년차)`}` : "-"],...(!compact ? [["최종 학위",candidate.education??"-"] as [string,ReactNode]] : [])];
    return <dl className="prism-candidate-brief">{fields.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
        {!compact&&<><div><dt>최근 평가 이력</dt><dd><PrismEvaluationHistory items={candidate.recentEvaluations??[]}/></dd></div>{single&&<><hr/><div><dt>최근 보상 정보<small>단위 : 백만원</small></dt><dd>{candidate.compensationText??"-"}</dd></div></>}</>}</dl>;
}
export function PrismCandidateTable({ candidates, onOpen, caption = "후보자 목록" }: { candidates: readonly PrismCandidate[];
    onOpen: (candidate: PrismCandidate) => void; caption?: string }) {
    return <PrismTable caption={caption}><thead><tr><th scope="col">이름 (임원 경력 / ELP)</th><th scope="col">회사명 / 현재 직책</th></tr></thead>
        <tbody>{candidates.length ? candidates.map(candidate => <tr key={candidate.id}><td><div className="prism-candidate-cell">
            <button type="button" onClick={() => onOpen(candidate)}>{candidate.name}</button>
            {candidate.executiveYears !== undefined && <PrismChip>임원 {candidate.executiveYears}년차</PrismChip>}
            {candidate.elp && <PrismElpBadge type={candidate.elp} />}</div></td><td>{candidate.company} / {candidate.position}</td></tr>)
            : <tr><td colSpan={2}>표시할 후보자가 없습니다.</td></tr>}</tbody></PrismTable>;
}
export type PrismAssessment = { id: string; area: string; score: number | null; evidence: string };
export function PrismEvaluationTable({ assessments, caption = "적합성 평가" }: { assessments: readonly PrismAssessment[]; caption?: string }) {
    for (const item of assessments) if (item.score !== null && (!Number.isFinite(item.score) || item.score < 0 || item.score > 5)) throw new RangeError("Assessment score must be null or within 0–5.");
    return <PrismTable caption={caption}><thead><tr><th scope="col">평가 영역</th><th scope="col">평가 점수</th><th scope="col">판단 근거</th></tr></thead>
        <tbody>{assessments.map(item => <tr key={item.id}><th scope="row">{item.area}</th><td><PrismChip tone={item.score === null ? "warning" : "primary"}>
            {item.score === null ? "근거 부족" : `${item.score} / 5`}</PrismChip></td><td>{item.evidence}</td></tr>)}</tbody></PrismTable>;
}
