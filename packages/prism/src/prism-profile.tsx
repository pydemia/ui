import { useId, useState, type ReactNode, type CSSProperties } from "react";
import { PrismTabs, PrismTabsList, PrismTabsTrigger, PrismTabsContent } from "./prism-tabs";
import { PrismCandidateCard, type PrismCandidate } from "./prism-candidate";
import { PrismButton } from "./prism-button";
import { PrismElpBadge, PrismTag } from "./prism-badge";
import { PrismFavoriteToggle } from "./prism-primitives";
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
export function PrismProfile({ candidate, activeTab, onTabChange, sections, favorite, onFavoriteChange }: {
    candidate: PrismCandidate; activeTab: PrismProfileTab; onTabChange: (tab: PrismProfileTab) => void;
    sections: Partial<Record<PrismProfileTab, ReactNode>>; favorite?: boolean; onFavoriteChange?: (favorite: boolean) => void;
}) {
    return <div className="prism-profile"><PrismFavoriteProfile candidate={candidate} favorite={favorite} onFavoriteChange={onFavoriteChange} />
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
export function PrismFavoriteProfile({ candidate, favorite, onFavoriteChange, onComments, onPrint, commentCount = 0, children }: {
    candidate: PrismCandidate; favorite?: boolean; onFavoriteChange?: (favorite: boolean) => void; onComments?: () => void; onPrint?: () => void; commentCount?: number; children?: ReactNode;
}) {
    return <div className="prism-favorite-profile"><div className="prism-favorite-photo" aria-hidden="true">{candidate.photo ? <img src={candidate.photo} alt="" /> : candidate.name.slice(0,1)}</div><div className="prism-favorite-info">
        <div className="prism-favorite-name"><strong>{candidate.name}</strong>{candidate.elp && <PrismElpBadge type={candidate.elp} />}{onFavoriteChange && <PrismFavoriteToggle name={candidate.name} checked={!!favorite} onCheckedChange={onFavoriteChange} />}</div>
        <p>{candidate.company} · {candidate.position}</p><div className="prism-favorite-tags">{candidate.birthDate && <PrismTag>{candidate.birthDate}</PrismTag>}{candidate.executiveYears !== undefined && <PrismTag>임원 {candidate.executiveYears}년차</PrismTag>}{candidate.speciality && <PrismTag>{candidate.speciality}</PrismTag>}</div>
        {children}<div className="prism-favorite-actions">{onComments && <PrismButton variant="line" size="small" onClick={onComments}>메모 {commentCount}</PrismButton>}{onPrint && <PrismButton variant="line" size="small" onClick={onPrint}>출력</PrismButton>}</div></div></div>;
}
