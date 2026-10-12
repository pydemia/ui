import { useId, useState, type ReactNode, type CSSProperties } from "react";
import { PrismTabs, PrismTabsList, PrismTabsTrigger, PrismTabsContent } from "./prism-tabs";
import { PrismCandidatePortrait, type PrismCandidate } from "./prism-candidate";
import { PrismButton } from "./prism-button";
import { PrismElpBadge, PrismTag } from "./prism-badge";
import { PrismFavoriteToggle, PrismAffiliateLogo, PrismSkeleton } from "./prism-primitives";
import { PrismEvaluationHistory } from "./prism-evaluation-history";
import { PrismDetailList } from "./prism-detail";
import { PrismIcon } from "./prism-icon";
import { PrismInfoTooltip } from "./prism-utility";

export const prismProfileTabs = [
    { id: "total", label: "종합" }, { id: "expertise", label: "전문성" }, { id: "experience", label: "성공경험" },
    { id: "design", label: "Design 역량" }, { id: "agility", label: "Learning Agility" }, { id: "attitude", label: "Attitude" },
    { id: "leadership", label: "Leadership" }, { id: "comments", label: "Mgmt. Comments" },
] as const;
export type PrismProfileTab = typeof prismProfileTabs[number]["id"];
export type PrismCareerEntry = { id: string; period: string; company: string; role: string };
export function PrismOutline({ title, children, actions }: { title?: ReactNode; children: ReactNode; actions?: ReactNode }) {
    const id = useId(); return <section className="prism-outline" aria-labelledby={title ? id : undefined}>{(title||actions)&&<header>{title&&<h3 id={id}>{title}</h3>}{actions}</header>}{children}</section>;
}
export function PrismCareerTimeline({ entries }: { entries: readonly PrismCareerEntry[] }) {
    return <ol className="prism-career">{entries.length ? entries.map(item => <li key={item.id}><strong>{item.period}</strong><div><b>{item.company}</b><p>{item.role}</p></div></li>) : <li>경력 정보가 없습니다.</li>}</ol>;
}
function SummaryHelp({label,note,tooltipClassName,tooltipStyle}:{label:string;note:ReactNode;tooltipClassName?:string;tooltipStyle?:CSSProperties}) {
    return <PrismInfoTooltip panel side="bottom" label={`${label} 설명`} className="prism-summary-info" content={<div className={`prism-summary-tooltip ${tooltipClassName ?? ""}`} style={tooltipStyle}>{note}</div>}/>;
}
export function PrismSummaryBadge({ label, summary, note, title="SUMMARY", tooltipClassName, tooltipStyle }: { label: string; summary: ReactNode; note?: ReactNode; title?: string; tooltipClassName?:string;tooltipStyle?:CSSProperties }) {
    const present=summary!==null&&summary!==undefined&&summary!==false&&(typeof summary!=="string"||!!summary.trim());
    const hasNote=note!==null&&note!==undefined&&note!==false&&(typeof note!=="string"||!!note.trim());
    return <section className="prism-summary-field"><h3 className="prism-summary-title">{title}</h3>{present ? <div className="prism-summary-badge">
        <div className="prism-summary-circle"><strong>{label}</strong>{hasNote&&<SummaryHelp label={label} note={note} tooltipClassName={tooltipClassName} tooltipStyle={tooltipStyle}/>}</div><div>{summary}</div>
    </div> : <div className="prism-outline prism-summary-empty"><p className="prism-no-data">관련 데이터 없음</p></div>}</section>;
}
export function PrismEvidence({ title, grade, children, source }: { title: string; grade?: string | null; children: ReactNode; source?: ReactNode }) {
    return <PrismOutline title={title} actions={grade !== undefined && <strong className="prism-evidence-grade">{grade ?? "미평가"}</strong>}>
        <div className="prism-evidence-body">{children ?? "근거 정보가 없습니다."}</div>{source && <footer className="prism-help">{source}</footer>}</PrismOutline>;
}
export function PrismProfile({ candidate, activeTab, onTabChange, sections, favorite, onFavoriteChange, onComments, onPrint, commentCount, loading, favoriteBusy, printBusy, readOnly }: {
    candidate: PrismCandidate; activeTab: PrismProfileTab; onTabChange: (tab: PrismProfileTab) => void;
    sections: Partial<Record<PrismProfileTab, ReactNode>>; favorite?: boolean; onFavoriteChange?: (favorite: boolean) => void;
    onComments?: () => void; onPrint?: () => void; commentCount?: number;
    loading?: boolean; favoriteBusy?: boolean; printBusy?: boolean; readOnly?: boolean;
}) {
    return <div className="prism-profile"><PrismFavoriteProfile candidate={candidate} favorite={favorite} onFavoriteChange={onFavoriteChange} onComments={onComments} onPrint={onPrint} commentCount={commentCount} loading={loading} favoriteBusy={favoriteBusy} printBusy={printBusy} readOnly={readOnly} />
        <PrismTabs value={activeTab} onValueChange={value => onTabChange(value as PrismProfileTab)}><PrismTabsList className="prism-profile-tabs" aria-label="후보자 상세 분류">
            {prismProfileTabs.map(tab => <PrismTabsTrigger value={tab.id} key={tab.id}>{tab.label}</PrismTabsTrigger>)}</PrismTabsList>
            {prismProfileTabs.map(tab => <PrismTabsContent value={tab.id} key={tab.id}><div className="prism-profile-section">
                {sections[tab.id] ?? <p className="prism-help">{tab.label} 정보가 없습니다.</p>}</div></PrismTabsContent>)}</PrismTabs></div>;
}
export function PrismBasicInfo({ items }: { items: readonly { label: string; value: ReactNode }[] }) {
    return <div className="prism-basic-info"><PrismDetailList items={items} /></div>;
}
export function PrismCompetenceMatrix({ columns, rows }: { columns: readonly string[]; rows: readonly { id: string; label: string; values: readonly (string | null)[] }[] }) {
    return <div className="prism-matrix-scroll" tabIndex={0} role="region" aria-label="Design 역량 매트릭스"><table className="prism-matrix"><caption className="prism-sr-only">Design 역량 매트릭스</caption>
        <thead><tr><th scope="col">역량</th>{columns.map(column => <th key={column} scope="col">{column}</th>)}</tr></thead>
        <tbody>{rows.map(row => <tr key={row.id}><th scope="row">{row.label}</th>{columns.map((column,index) => <td key={column} data-grade={row.values[index] ?? "missing"}>{row.values[index] ?? "정보 없음"}</td>)}</tr>)}</tbody></table></div>;
}
export type PrismFavoriteProfileProps = {
    candidate: PrismCandidate; favorite?: boolean; onFavoriteChange?: (favorite: boolean) => void;
    onComments?: () => void; onPrint?: () => void; commentCount?: number; children?: ReactNode;
    loading?: boolean; favoriteBusy?: boolean; printBusy?: boolean; readOnly?: boolean;
    className?: string; style?: CSSProperties;
};
export function PrismFavoriteProfile({ candidate, favorite, onFavoriteChange, onComments, onPrint, commentCount = 0,
    children, loading = false, favoriteBusy = false, printBusy = false, readOnly = false, className = "", style }: PrismFavoriteProfileProps) {
    const affiliation = candidate.affiliation ?? candidate.companyField;
    const jobFunction = candidate.jobFunction ?? candidate.domain;
    const tenure = candidate.tenure ?? (candidate.executiveYears === undefined ? undefined : `임원 ${candidate.executiveYears}년차`);
    if (loading) return <div className={`prism-favorite-profile prism-profile-skeleton ${className}`} style={style} role="status" aria-label="후보자 프로필 정보를 불러오고 있습니다.">
        <div className="prism-favorite-photo"><PrismSkeleton width="100%" height="100%" radius={8}/></div><div className="prism-favorite-info">
            <PrismSkeleton width={96} height={20}/><div className="prism-profile-skeleton-department"><PrismSkeleton height={20}/></div><div className="prism-profile-skeleton-position"><PrismSkeleton height={20}/></div>
        </div></div>;
    return <div className={`prism-favorite-profile ${className}`} style={style}>
        <PrismCandidatePortrait name={candidate.name} subjectId={candidate.id} src={candidate.photo} className="prism-favorite-photo" fallback="initials"/>
        <div className="prism-favorite-info"><div className="prism-favorite-name"><div className="prism-favorite-name-group">
            <div className="prism-favorite-name-badge"><strong>{candidate.name}</strong>{candidate.elp && <PrismElpBadge type={candidate.elp}/>}</div>
            {(candidate.birthDate || tenure) && <div className="prism-favorite-tags">{candidate.birthDate && <PrismTag>{candidate.birthDate}</PrismTag>}{tenure && <PrismTag>{tenure}</PrismTag>}</div>}
        </div>{(onPrint || onFavoriteChange) && <div className="prism-favorite-actions">
            {onPrint && <button type="button" className="prism-profile-print-button" aria-label="프로필 인쇄" aria-busy={printBusy || undefined} disabled={printBusy} onClick={onPrint}><PrismIcon name="PrintIcon" size={20}/></button>}
            {onFavoriteChange && <PrismFavoriteToggle name={candidate.name} checked={!!favorite} disabled={favoriteBusy || readOnly} onCheckedChange={onFavoriteChange}/>}</div>}
        </div>{(affiliation || jobFunction) && <div className="prism-profile-department">{affiliation && <b>{affiliation}</b>}{affiliation && jobFunction && <span className="prism-profile-divider"/>}{jobFunction}</div>}
        {(candidate.company || candidate.position) && <div className="prism-profile-position">{candidate.company && <PrismAffiliateLogo brand={candidate.brand} affiliate={candidate.company} size={12}/>}{candidate.position && <span>{candidate.position}</span>}</div>}
        <PrismEvaluationHistory items={candidate.recentEvaluations ?? []}/>{children}
        {onComments && <PrismButton variant="line" size="small" className="prism-profile-memo-button" icon={<PrismIcon name="ChatBubbleIcon" size={16}/>} onClick={onComments}>메모 <span className="prism-profile-memo-count">{commentCount}</span></PrismButton>}
        </div>
    </div>;
}
