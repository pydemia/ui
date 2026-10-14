import { Fragment, useId, type CSSProperties } from "react";
import { PrismAnchorChip } from "./prism-display";
import { PrismTag } from "./prism-badge";
import { PrismIcon } from "./prism-icon";
import { PrismInfoTooltip } from "./prism-utility";
import { PrismFormattedText } from "./prism-rich-text";

export type PrismAnalysisFactorKind = "expertise" | "success" | "design" | "agility" | "attitude" | "leadership" | "other";
export type PrismAnalysisFactor = { id: string; kind: PrismAnalysisFactorKind; label: string; title?: string | null; results: readonly string[]; summary?: string | null; starred?: readonly string[] };
export type PrismAnalysisLeader = { label: string; description?: string | null; aiComment?: string | null };
export type PrismAnalysisProps = {
    leader?: PrismAnalysisLeader | null; factors: readonly PrismAnalysisFactor[]; title?: string;
    panel?: boolean; onAction?: (kind: "profile" | "position" | "document", id: string) => void;
    className?: string; style?: CSSProperties;
};
const levels = "(※ 리더 유형의 단계: Excellent > Good > Solid > Developing > Struggling)";
function badgeName(label: string) {
    const index = Math.max(label.lastIndexOf("리더"),label.toLowerCase().lastIndexOf("leader"));
    return index > 0 ? <>{label.slice(0,index).trimEnd()}<br/>{label.slice(index)}</> : label;
}
export function PrismAnalysis({ leader, factors, title = "6 Frame 분석 결과 요약", panel, onAction, className = "", style }: PrismAnalysisProps) {
    const id = useId();
    if (new Set(factors.map(factor => factor.id)).size !== factors.length || factors.some(factor => !factor.id || !factor.label.trim() || !["expertise","success","design","agility","attitude","leadership","other"].includes(factor.kind))) throw new Error("Analysis factors require unique identifiers, nonempty labels and a supported kind.");
    const summary = (value?: string | null) => value?.trim() ? <div className="prism-analysis-description"><PrismFormattedText source={value} inline panel={panel} onAction={onAction}/></div> : <p className="prism-no-data">관련 데이터 없음</p>;
    const chip = (value: string, index: number, selected = false, starred = false) => <PrismAnchorChip key={index} selected={selected} small interactive={false}>{starred && <PrismIcon name="FavoriteOnIcon" size={14} className="prism-analysis-star"/>}{value}</PrismAnchorChip>;
    function content(factor: PrismAnalysisFactor) {
        const heading = factor.title?.trim() ? <strong className="prism-analysis-factor-title">{factor.title.trim()}</strong> : null;
        const description = summary(factor.summary);
        switch (factor.kind) {
            case "expertise": return <>{heading}{factor.results.length > 0 && <div className="prism-analysis-tags">{factor.results.map((value,index) => <Fragment key={index}>{index > 0 && <span className="prism-analysis-tag-divider" aria-hidden="true"/>}<span>{value}</span></Fragment>)}</div>}{description}</>;
            case "success": return <>{factor.results.length > 0 && <div className="prism-analysis-chips">{factor.results.map((value,index) => chip(value,index,false,!!factor.starred?.includes(value)))}</div>}{description}</>;
            case "design": case "agility": return <>{factor.results.length > 0 && chip(factor.results[0],0,true)}{description}</>;
            case "attitude": return <>{heading}{description}{factor.results.length > 0 && <div className="prism-analysis-derail"><span>Derailment:</span><div className="prism-analysis-chips">{factor.results.map((value,index) => <span key={index} className="prism-analysis-derail-chip">{value}</span>)}</div></div>}</>;
            case "leadership": return <>{factor.results.map((value,index) => <PrismTag key={index} variant="blue" className="prism-analysis-leadership-result" title={value}><span>{value}</span></PrismTag>)}{heading}{description}</>;
            case "other": return <>{factor.results.length > 0 && <div className="prism-analysis-chips">{factor.results.map((value,index) => chip(value,index))}</div>}{description}</>;
        }
    }
    return <div className={`prism-analysis ${className}`} style={style}>
        <section className="prism-analysis-block prism-analysis-leader-block" aria-label="리더 유형"><h3>리더 유형</h3>{leader ? <div className="prism-analysis-leader-row">
            <span className="prism-analysis-leader-badge" title={leader.label} aria-label={leader.label}><span>{badgeName(leader.label)}</span>{leader.description && <PrismInfoTooltip label="리더 유형 설명" className="prism-analysis-info" icon={<PrismIcon name="InfoIcon" size={10}/>}
                side="bottom" panel content={<span className="prism-analysis-leader-note">{leader.description}{"\n"}{levels}</span>} contentProps={{className:"prism-analysis-tooltip"}}/>}</span>
            <span className="prism-analysis-leader-divider" aria-hidden="true"/><p className="prism-analysis-leader-comment">{leader.aiComment ?? leader.description}</p>
        </div> : <p className="prism-no-data">관련 데이터 없음</p>}</section>
        <section className="prism-analysis-block prism-analysis-frame" aria-labelledby={id}><h3 id={id}>{title}</h3>{factors.length ? factors.map(factor => <section key={factor.id} className="prism-analysis-factor" data-kind={factor.kind}>
            <h4>{factor.label}</h4><div className="prism-analysis-factor-content">{content(factor)}</div>
        </section>) : <p className="prism-no-data">관련 데이터 없음</p>}</section>
    </div>;
}
