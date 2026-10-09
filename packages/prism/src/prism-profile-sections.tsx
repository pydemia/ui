import type { ComponentProps, ReactNode } from "react";
import { PrismBasicInfo, PrismCareerTimeline, PrismOutline, PrismSummaryBadge } from "./prism-profile";
import { PrismAssessmentSummary, PrismDiagnosis, PrismRiskTable, PrismExpertiseCards, PrismScoreEssay, PrismExperienceTopics, PrismExperienceEvidence, PrismLeadershipReasons, PrismNoData } from "./prism-assessment";
import { PrismSurveyValidation } from "./prism-survey";
import { PrismValidationList, PrismExperienceCard, PrismCommentEditor } from "./prism-record";
import { PrismTrendChart, PrismRadarChart, PrismLeadershipPie, type PrismLeadershipPieProps } from "./prism-chart";
import { PrismTable } from "./prism-display";
import { PrismRequestState } from "./prism-feedback";
import { PrismSkeletonGroup } from "./prism-primitives";

export type PrismProfileStatus="ready"|"loading"|"error"|"empty";
export function PrismProfileSectionState({status="ready",onRetry,children}: {status?:PrismProfileStatus;onRetry?:()=>void;children:ReactNode}) {
    return status==="ready" ? <div className="prism-domain-profile-section">{children}</div> : status==="loading" ? <PrismSkeletonGroup rows={10}/> : <PrismRequestState status={status} onRetry={onRetry}/>;
}
export type PrismCompensationValue=string|number|null|{won:string|number|null;foreign:{currency:string;amount:string|number}|null};
function Amount({value}:{value:PrismCompensationValue}) {
    if(value===null)return <>-</>;if(typeof value!=="object")return <>{value}</>;return <>{value.won??""}{value.won!==null&&value.foreign!==null&&<span>+ </span>}{value.foreign&&<span><small className="prism-currency">{value.foreign.currency}</small> {value.foreign.amount}</span>}{value.won===null&&value.foreign===null&&"-"}</>;
}
export function PrismCompensationGrid({years,rows,unit="백만원"}: {years:readonly string[];rows:readonly {label:string;values:readonly PrismCompensationValue[]}[];unit?:string}) {
    return <section className="prism-compensation-grid"><header><h3>보상 정보</h3><span>단위 : {unit}</span></header><PrismTable caption="연도별 보상 정보"><thead><tr><th scope="col">구분</th>{years.map(year=><th key={year} scope="col">{year}</th>)}</tr></thead><tbody>{rows.length ? rows.map(row=><tr key={row.label}><th scope="row">{row.label}</th>{years.map((year,i)=><td key={year}><Amount value={row.values[i]??null}/></td>)}</tr>) : <tr><td colSpan={years.length+1}>관련 데이터 없음</td></tr>}</tbody></PrismTable></section>;
}
export function PrismTotalSection({leader,basic,career,compensation}: {leader:{label:string;summary:string|null;note?:string};basic:ComponentProps<typeof PrismBasicInfo>;career:ComponentProps<typeof PrismCareerTimeline>;compensation:ComponentProps<typeof PrismCompensationGrid>}) {
    return <div className="prism-domain-profile-section"><section><h3>SUMMARY</h3>{leader.summary ? <PrismSummaryBadge {...leader}/> : <PrismNoData/>}</section><PrismOutline title="기본 정보"><PrismBasicInfo {...basic}/></PrismOutline><section><h3>경력</h3><PrismCareerTimeline {...career}/></section><PrismCompensationGrid {...compensation}/></div>;
}
export function PrismExpertiseSection({summary,fields,validation}: {summary:ComponentProps<typeof PrismAssessmentSummary>;fields:ComponentProps<typeof PrismExpertiseCards>;validation:ComponentProps<typeof PrismValidationList>}) {
    return <div className="prism-domain-profile-section"><PrismAssessmentSummary {...summary}/><PrismExpertiseCards {...fields}/><PrismValidationList {...validation}/></div>;
}
export function PrismExperienceSection({summary,topics,experience,failure}: {summary:ComponentProps<typeof PrismScoreEssay>;topics:ComponentProps<typeof PrismExperienceTopics>;experience:readonly ComponentProps<typeof PrismExperienceCard>[];failure?:ComponentProps<typeof PrismAssessmentSummary>}) {
    return <div className="prism-domain-profile-section"><PrismScoreEssay {...summary}/><section><h3>성공경험 Essay</h3><PrismExperienceTopics {...topics}/><div className="prism-domain-profile-section">{experience.length ? experience.map((item,i)=><PrismExperienceCard key={i} {...item}/>) : <PrismNoData/>}</div></section>{failure&&<PrismAssessmentSummary {...failure}/>}</div>;
}
export function PrismDesignSection({summary,matrix}: {summary:ComponentProps<typeof PrismAssessmentSummary>;matrix:ReactNode}) {
    return <div className="prism-domain-profile-section"><PrismAssessmentSummary {...summary}/><PrismOutline title="다양성 Matrix">{matrix??<PrismNoData/>}</PrismOutline></div>;
}
export function PrismAgilitySection({summary,experience}: {summary:ComponentProps<typeof PrismScoreEssay>;experience:ComponentProps<typeof PrismExperienceEvidence>}) {
    return <div className="prism-domain-profile-section"><PrismScoreEssay {...summary}/><PrismExperienceEvidence {...experience}/></div>;
}
export function PrismAttitudeSection({summary,diagnosis,risk,documentAction,survey}: {summary:ComponentProps<typeof PrismAssessmentSummary>;diagnosis:ComponentProps<typeof PrismDiagnosis>;risk:ComponentProps<typeof PrismRiskTable>;documentAction?:ReactNode;survey?:ComponentProps<typeof PrismSurveyValidation>}) {
    return <div className="prism-domain-profile-section"><PrismAssessmentSummary {...summary}/><PrismDiagnosis {...diagnosis}/>{documentAction}<PrismRiskTable {...risk}/>{survey && <PrismSurveyValidation columns={survey.items.length >= 3 ? 3 : 2} {...survey}/>}</div>;
}
export type PrismLeadershipTrendRow={year:string;evaluators:number|null;respondents:number|null;score:number|null;groupAverage:number|null;percentile:number|null};
export type PrismLeadershipPieSummaryProps = Omit<PrismLeadershipPieProps,"title"> & {
    title?: string; description?: string; chartTitle?: string; print?: boolean;
};
export function PrismLeadershipPieSummary({ items, title = "", description = "", chartTitle = "리더십 특성", print = false, ...chart }: PrismLeadershipPieSummaryProps) {
    if (!chartTitle.trim() || !items.length || items.length>3 || new Set(items.map(item=>item.label.trim())).size!==items.length || items.some(item=>!item.label.trim())) throw new Error("Leadership summary requires a chart title and one to three unique labels.");
    const total = items.reduce((sum,item)=>sum+(item.value??0),0);
    if (items.some(item=>item.value!==null&&(!Number.isFinite(item.value)||item.value<0||item.value>100)) || total>100.2 || (items.every(item=>item.value!==null)&&total>0&&Math.abs(total-100)>.2)) throw new RangeError("Leadership summary values must be null or percentages with a complete positive total of100.");
    const commentTitle = title.trim(), commentDescription = description.trim();
    const hasData = items.some(item => (item.value ?? 0)>0) || !!commentTitle || !!commentDescription;
    return <section className="prism-leadership-summary" data-print={print || undefined}><h3>SUMMARY</h3>
        <div className="prism-leadership-summary-box">{hasData ? <>
            <div className="prism-leadership-summary-chart"><PrismLeadershipPie {...chart} items={items} title={chartTitle} animate={print ? false : chart.animate}/>
                <p>리더십 특성 (지・덕・용 중 1위 득표수 비중)</p></div>
            <div className="prism-leadership-summary-comment">{commentTitle && <strong>{commentTitle}</strong>}{commentDescription && <p>{commentDescription}</p>}</div>
        </> : <div className="prism-leadership-summary-empty"><PrismNoData message={items.every(item=>item.value===0) ? "비중 모두 0%" : undefined}/>
            <div className="prism-sr-only"><table><caption>{chartTitle} 데이터</caption><tbody>{items.map(item => <tr key={item.label}><th scope="row">{item.label}</th><td>{item.value===null ? "정보 없음" : `${item.value}%`}</td></tr>)}</tbody></table></div>
        </div>}</div>
    </section>;
}
export function PrismLeadershipTrend({chart,rows}: {chart:ComponentProps<typeof PrismTrendChart>;rows:readonly PrismLeadershipTrendRow[]}) {
    return <section className="prism-leadership-trend"><header><h3>과거 5개년 리더십 Survey 추이</h3><span>종합 평균 (5점 만점)</span></header><PrismTrendChart {...chart}/><PrismTable caption="리더십 Survey 추이"><thead><tr>{["연도","평가자수","응답자수","점수","그룹 평균 점수","백분율"].map(label=><th key={label} scope="col">{label}</th>)}</tr></thead><tbody>{rows.length ? rows.map(row=><tr key={row.year}><th scope="row">{row.year}</th><td>{row.evaluators??"-"}</td><td>{row.respondents??"-"}</td><td data-highlight>{row.score??"-"}</td><td>{row.groupAverage??"-"}</td><td data-highlight>{row.percentile===null ? "-" : `상위 ${row.percentile}%`}</td></tr>) : <tr><td colSpan={6}>관련 데이터 없음</td></tr>}</tbody></PrismTable></section>;
}
export type PrismLeadershipSectionProps = {radar:ComponentProps<typeof PrismRadarChart>;validation:ComponentProps<typeof PrismValidationList>;strength:ComponentProps<typeof PrismLeadershipReasons>;improvement:ComponentProps<typeof PrismLeadershipReasons>;trend:ComponentProps<typeof PrismLeadershipTrend>} & (
    {summary:ComponentProps<typeof PrismAssessmentSummary>;pieSummary?:never} | {summary?:never;pieSummary:PrismLeadershipPieSummaryProps}
);
export function PrismLeadershipSection({summary,pieSummary,radar,validation,strength,improvement,trend}: PrismLeadershipSectionProps) {
    return <div className="prism-domain-profile-section">{pieSummary ? <PrismLeadershipPieSummary {...pieSummary}/> : <PrismAssessmentSummary {...summary}/>}<PrismRadarChart {...radar}/><PrismValidationList {...validation}/><PrismLeadershipReasons {...strength}/><PrismLeadershipReasons {...improvement} danger/><PrismLeadershipTrend {...trend}/></div>;
}
export function PrismCommentsSection({items,editor}: {items:readonly {id:string;author:string;date:string;comment:string|null}[];editor?:ComponentProps<typeof PrismCommentEditor>}) {
    return <div className="prism-domain-profile-section"><PrismOutline title="Mgmt. Comments">{items.length ? items.map(item=><article key={item.id}><header><strong>{item.author}</strong> <time>{item.date}</time></header><p>{item.comment??"관련 데이터 없음"}</p></article>) : <PrismNoData/>}</PrismOutline>{editor&&<PrismCommentEditor {...editor}/>}</div>;
}

export function PrismProfileBrief({items,evaluations,compensation,compact=false,single=false}: {items:readonly {label:string;value:string|null}[];evaluations?:ReactNode;compensation?:string|null;compact?:boolean;single?:boolean}) {
    return <div className="prism-profile-brief">{items.map(item=><div key={item.label}><span>{item.label}</span><p>{item.value??"-"}</p></div>)}{!compact&&evaluations&&<><hr/><div><span>최근 평가 이력</span>{evaluations}</div></>}{single&&<><hr/><div><span>최근 보상 정보<small>단위 : 백만원</small></span><p>{compensation??"-"}</p></div></>}</div>;
}
export function PrismGradeSummary({grade,summary,note}: {grade:string|null;summary:string|null;note?:string}) {
    return summary ? <PrismSummaryBadge label={grade??"-"} summary={summary} note={note}/> : <PrismNoData/>;
}
