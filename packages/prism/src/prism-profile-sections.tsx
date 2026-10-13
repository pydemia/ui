import { useEffect, useState, type ComponentProps, type ReactNode } from "react";
import { PrismBasicInfo, PrismCareerTimeline, PrismDesignCompetenceMatrix, PrismOutline, PrismSummaryBadge, type PrismDesignCompetenceMatrixModel } from "./prism-profile";
import { PrismAssessmentSummary, PrismDiagnosis, PrismRiskTable, PrismExpertiseCards, PrismScoreEssay, PrismExperienceTopics, PrismExperienceEvidence, PrismLeadershipReasons, PrismNoData } from "./prism-assessment";
import { PrismSurveyValidation } from "./prism-survey";
import { PrismValidationList, PrismExperienceCard, PrismCommentEditor } from "./prism-record";
import { PrismTrendChart, PrismRadarChart, PrismLeadershipPie, type PrismLeadershipPieProps } from "./prism-chart";
import { PrismTable } from "./prism-display";
import { PrismRequestState } from "./prism-feedback";
import { PrismSkeletonGroup } from "./prism-primitives";
import { PrismChip, PrismTag } from "./prism-badge";

export type PrismProfileStatus="ready"|"loading"|"error"|"empty";
export function PrismProfileSectionState({status="ready",onRetry,children}: {status?:PrismProfileStatus;onRetry?:()=>void;children:ReactNode}) {
    return status==="ready" ? <div className="prism-domain-profile-section">{children}</div> : status==="loading" ? <PrismSkeletonGroup rows={10}/> : <PrismRequestState status={status} onRetry={onRetry}/>;
}
export type PrismCompensationValue=string|number|null|{won:string|number|null;foreign:{currency:string;amount:string|number}|null};
const emptyCompensationLabels = ["총보상", "연봉", "IB"] as const;
function Amount({value}:{value:PrismCompensationValue}) {
    if(value===null)return <>-</>;if(typeof value!=="object")return <>{value}</>;return <>{value.won??""}{value.won!==null&&value.foreign!==null&&<span>+ </span>}{value.foreign&&<span><small className="prism-currency">{value.foreign.currency}</small> {value.foreign.amount}</span>}{value.won===null&&value.foreign===null&&"-"}</>;
}
export function PrismCompensationGrid({years,rows,unit="백만원"}: {years:readonly string[];rows:readonly {label:string;values:readonly PrismCompensationValue[]}[];unit?:string}) {
    const displayRows = rows.length ? rows : years.length ? emptyCompensationLabels.map(label => ({label,values:years.map(() => null)})) : [];
    return <section className="prism-compensation-grid"><header><h3>보상 정보</h3><span>단위 : {unit}</span></header>{!rows.length && <span className="prism-sr-only">보상 정보가 없습니다.</span>}<PrismTable caption="연도별 보상 정보"><thead><tr><th scope="col">구분</th>{years.map(year=><th key={year} scope="col">{year}</th>)}</tr></thead><tbody>{displayRows.length ? displayRows.map(row=><tr key={row.label}><th scope="row">{row.label}</th>{years.map((year,i)=><td key={year}><Amount value={row.values[i]??null}/></td>)}</tr>) : <tr><td colSpan={years.length+1}>관련 데이터 없음</td></tr>}</tbody></PrismTable></section>;
}
export function PrismTotalSection({leader,basic,career,compensation}: {leader:{label:string;summary:string|null;note?:string};basic:ComponentProps<typeof PrismBasicInfo>;career:ComponentProps<typeof PrismCareerTimeline>;compensation:ComponentProps<typeof PrismCompensationGrid>}) {
    return <div className="prism-domain-profile-section"><PrismSummaryBadge {...leader}/><PrismOutline title="기본 정보"><PrismBasicInfo {...basic}/></PrismOutline><section><h3>경력</h3><PrismCareerTimeline {...career}/></section><PrismCompensationGrid {...compensation}/></div>;
}
export type PrismExpertiseSectionProps = { summary: ComponentProps<typeof PrismAssessmentSummary>; fields: ComponentProps<typeof PrismExpertiseCards> } & (
    { survey: ComponentProps<typeof PrismSurveyValidation>; validation?: never } | { validation: ComponentProps<typeof PrismValidationList>; survey?: never }
);
export function PrismExpertiseSection({summary,fields,survey,validation}: PrismExpertiseSectionProps) {
    return <div className="prism-domain-profile-section"><PrismAssessmentSummary {...summary}/><PrismExpertiseCards {...fields}/>{survey ? <PrismSurveyValidation {...survey} columns={survey.columns ?? (survey.items.length >= 3 ? 3 : 2)}/> : validation && <PrismValidationList {...validation}/>}</div>;
}
export function PrismExperienceSection({summary,topics,experience,failure}: {summary:ComponentProps<typeof PrismScoreEssay>;topics:ComponentProps<typeof PrismExperienceTopics>;experience:readonly ComponentProps<typeof PrismExperienceCard>[];failure?:ComponentProps<typeof PrismAssessmentSummary>}) {
    return <div className="prism-domain-profile-section"><PrismScoreEssay {...summary}/><section><h3>성공경험 Essay</h3><PrismExperienceTopics {...topics}/><div className="prism-domain-profile-section">{experience.length ? experience.map((item,i)=><PrismExperienceCard key={i} {...item}/>) : <PrismNoData/>}</div></section>{failure&&<PrismAssessmentSummary {...failure}/>}</div>;
}
export type PrismSuccessEssay = { id: string; topic: string; representative?: boolean; title?: string | null; description?: string | null; keywords?: readonly string[]; aiInterview?: string | null };
export type PrismFailureEssay = { id: string; title?: string | null; description?: string | null };
export type PrismSuccessExperienceSectionProps = {
    summary: { title?: string | null; description?: string | null };
    topics?: readonly string[];
    essays: readonly PrismSuccessEssay[];
    failures: readonly PrismFailureEssay[];
    activeTopic?: string;
    onTopicChange?: (topic: string) => void;
};
export function PrismSuccessExperienceSection({ summary, topics, essays, failures, activeTopic, onTopicChange }: PrismSuccessExperienceSectionProps) {
    const topicList = topics?.length ? [...new Set(topics.filter(topic => topic.trim()))] : [...new Set(essays.map(item => item.topic).filter(topic => topic.trim()))];
    const representative = essays.find(item => item.representative)?.topic;
    const defaultTopic = representative && topicList.includes(representative) ? representative : topicList[0] ?? "";
    const [localTopic, setLocalTopic] = useState(defaultTopic);
    const topicKey = topicList.join("\u0000");
    useEffect(() => { setLocalTopic(defaultTopic); }, [defaultTopic, topicKey]);
    const selected = activeTopic ?? (topicList.includes(localTopic) ? localTopic : defaultTopic);
    const visibleEssays = essays.filter(item => item.topic === selected && (item.title?.trim() || item.description?.trim())).sort((a,b) => Number(!!b.representative) - Number(!!a.representative));
    const visibleFailures = failures.filter(item => item.title?.trim() || item.description?.trim());
    return <div className="prism-domain-profile-section prism-success-experience-section">
        <section><h3>SUMMARY</h3><PrismOutline><div className="prism-success-summary">{summary.title?.trim() || summary.description?.trim() ? <>{summary.title?.trim() && <strong>{summary.title}</strong>}{summary.description?.trim() && <p>{summary.description}</p>}</> : <PrismNoData/>}</div></PrismOutline></section>
        <section><h3>성공경험 Essay</h3>{topicList.length > 0 && <div className="prism-experience-topics" role="group" aria-label="경험 영역 선택">{topicList.map(topic => <button type="button" aria-pressed={selected === topic} key={topic} onClick={() => { if (activeTopic === undefined) setLocalTopic(topic); onTopicChange?.(topic); }}>
            {topic === representative && <span aria-hidden="true">★ </span>}{topic}</button>)}</div>}
            <div className="prism-success-essay-list">{visibleEssays.length ? visibleEssays.map(item => <PrismOutline key={item.id}><article className="prism-success-essay">
                <div className="prism-success-essay-title">{item.representative && <PrismChip tone="warning">대표</PrismChip>}<strong>{item.title?.trim() || "해당 내용 미작성"}</strong></div>
                <p>{item.description?.trim() || "해당 내용 미작성"}</p>
                {!!item.keywords?.length && <div className="prism-success-essay-keywords">{item.keywords.map((keyword,index) => <PrismChip key={`${keyword}-${index}`} tone="neutral">{keyword}</PrismChip>)}</div>}
                {item.representative && item.aiInterview?.trim() && <div className="prism-success-essay-interview"><strong>AI 인터뷰 분석</strong><p>{item.aiInterview}</p></div>}
            </article></PrismOutline>) : <PrismOutline><PrismNoData/></PrismOutline>}</div></section>
        <section><h3>좌절・실패 경험 Essay</h3><div className="prism-success-essay-list">{visibleFailures.length ? visibleFailures.map(item => <PrismOutline key={item.id}><article className="prism-success-essay"><strong>{item.title?.trim() || "해당 내용 미작성"}</strong><p>{item.description?.trim() || "해당 내용 미작성"}</p></article></PrismOutline>) : <PrismOutline><PrismNoData/></PrismOutline>}</div></section>
    </div>;
}
export type PrismDesignDiversityModel = { companies: readonly string[]; functions: readonly string[]; matrix: PrismDesignCompetenceMatrixModel };
export function PrismDesignDiversitySection({ companies, functions, matrix }: PrismDesignDiversityModel) {
    const count = (value: number) => value >= 3 ? "3+" : `${value}개`;
    const current = matrix.currentPosition && matrix.rows.some(row => row.key === matrix.currentPosition?.rowKey) && matrix.columns.some(column => column.key === matrix.currentPosition?.columnKey);
    return <PrismOutline title="다양성 Matrix"><div className="prism-design-diversity">
        <div className="prism-design-diversity-summary">{current && <PrismChip tone="primary">현재 위치</PrismChip>}
            <dl><div><dt>회사 {count(companies.length)}</dt><dd>{companies.length ? companies.join(", ") : "관련 데이터 없음"}</dd></div>
                <div><dt>Function {count(functions.length)}</dt><dd>{functions.length ? functions.join(", ") : "관련 데이터 없음"}</dd></div></dl></div>
        <PrismDesignCompetenceMatrix matrix={matrix}/></div></PrismOutline>;
}
export type PrismDesignSectionProps =
    | { grade: ComponentProps<typeof PrismGradeSummary>; essay: ComponentProps<typeof PrismScoreEssay>; survey: ComponentProps<typeof PrismSurveyValidation>; diversity: PrismDesignDiversityModel; summary?: never; matrix?: never }
    | { summary: ComponentProps<typeof PrismAssessmentSummary>; matrix: ReactNode; grade?: never; essay?: never; survey?: never; diversity?: never };
export function PrismDesignSection(props: PrismDesignSectionProps) {
    if (props.grade) return <div className="prism-domain-profile-section"><PrismGradeSummary {...props.grade}/><PrismScoreEssay {...props.essay}/><PrismSurveyValidation {...props.survey} columns={props.survey.columns ?? 3}/><PrismDesignDiversitySection {...props.diversity}/></div>;
    return <div className="prism-domain-profile-section"><PrismAssessmentSummary {...props.summary}/><PrismOutline title="다양성 Matrix">{props.matrix??<PrismNoData/>}</PrismOutline></div>;
}
export type PrismAgilitySectionProps =
    | { grade: ComponentProps<typeof PrismGradeSummary>; essay: ComponentProps<typeof PrismScoreEssay>; survey: ComponentProps<typeof PrismSurveyValidation>; experience: ComponentProps<typeof PrismExperienceEvidence>; summary?: never }
    | { summary: ComponentProps<typeof PrismScoreEssay>; experience: ComponentProps<typeof PrismExperienceEvidence>; grade?: never; essay?: never; survey?: never };
export function PrismAgilitySection(props: PrismAgilitySectionProps) {
    if (props.grade) return <div className="prism-domain-profile-section"><PrismGradeSummary {...props.grade}/><PrismScoreEssay {...props.essay}/><PrismSurveyValidation {...props.survey} columns={props.survey.columns ?? (props.survey.items.length >= 3 ? 3 : 2)}/><PrismExperienceEvidence {...props.experience}/></div>;
    return <div className="prism-domain-profile-section"><PrismScoreEssay {...props.summary}/><PrismExperienceEvidence {...props.experience}/></div>;
}
export function PrismAttitudeSection({summary,diagnosis,risk,documentAction,survey}: {summary:ComponentProps<typeof PrismAssessmentSummary>;diagnosis:ComponentProps<typeof PrismDiagnosis>;risk:ComponentProps<typeof PrismRiskTable>;documentAction?:ReactNode;survey?:ComponentProps<typeof PrismSurveyValidation>}) {
    return <div className="prism-domain-profile-section"><PrismAssessmentSummary {...summary}/><PrismDiagnosis {...diagnosis}/>{documentAction}<PrismRiskTable {...risk}/>{survey && <PrismSurveyValidation columns={survey.items.length >= 3 ? 3 : 2} {...survey}/>}</div>;
}
export type PrismLeadershipTrendRow={year:string;evaluators:number|null;respondents:number|null;score:number|null;groupAverage:number|null;percentile:number|null};
export type PrismLeadershipPieSummaryProps = Omit<PrismLeadershipPieProps,"title"> & {
    /** Type label; maps to the source summary.title. */
    title?: string;
    /** Bold summary; maps to the source summary.content. */
    description?: string;
    /** Full explanation below the divider; maps to the source summary.description. */
    detail?: string;
    /** Allow multiline type labels; compact containers also wrap them automatically. */
    wrapTitle?: boolean;
    chartTitle?: string; print?: boolean;
};
export function PrismLeadershipPieSummary({ items, title = "", description = "", detail = "", wrapTitle = false, chartTitle = "리더십 특성", print = false, ...chart }: PrismLeadershipPieSummaryProps) {
    if (!chartTitle.trim() || !items.length || items.length>3 || new Set(items.map(item=>item.label.trim())).size!==items.length || items.some(item=>!item.label.trim())) throw new Error("Leadership summary requires a chart title and one to three unique labels.");
    const total = items.reduce((sum,item)=>sum+(item.value??0),0);
    if (items.some(item=>item.value!==null&&(!Number.isFinite(item.value)||item.value<0||item.value>100)) || total>100.2 || (items.every(item=>item.value!==null)&&total>0&&Math.abs(total-100)>.2)) throw new RangeError("Leadership summary values must be null or percentages with a complete positive total of100.");
    const commentTitle = title.trim(), commentDescription = description.trim(), commentDetail = detail.trim();
    const hasData = items.some(item => (item.value ?? 0)>0) || !!commentTitle || !!commentDescription || !!commentDetail;
    return <section className="prism-leadership-summary" data-print={print || undefined} data-wrap-title={wrapTitle || undefined}><h3>SUMMARY</h3>
        <div className="prism-leadership-summary-box">{hasData ? <>
            <div className="prism-leadership-summary-main">
                <div className="prism-leadership-summary-chart"><PrismLeadershipPie {...chart} items={items} title={chartTitle} animate={print ? false : chart.animate}/>
                    <p><span>{chartTitle}</span> <span>(지・덕・용 중 1위 득표수 비중)</span></p></div>
                <div className="prism-leadership-summary-comment">{commentTitle && <PrismTag variant="blue">{commentTitle}</PrismTag>}{commentDescription && <p>{commentDescription}</p>}</div>
            </div>
            {commentDetail && <><hr className="prism-leadership-summary-divider"/><p className="prism-leadership-summary-detail">{commentDetail}</p></>}
        </> : <div className="prism-leadership-summary-empty"><PrismNoData message={items.every(item=>item.value===0) ? "비중 모두 0%" : undefined}/>
            <div className="prism-sr-only"><table><caption>{chartTitle} 데이터</caption><tbody>{items.map(item => <tr key={item.label}><th scope="row">{item.label}</th><td>{item.value===null ? "정보 없음" : `${item.value}%`}</td></tr>)}</tbody></table></div>
        </div>}</div>
    </section>;
}
export function PrismLeadershipTrend({chart,rows}: {chart:ComponentProps<typeof PrismTrendChart>;rows:readonly PrismLeadershipTrendRow[]}) {
    const hasChartData = chart.series.some(series => series.values.some(value => value !== null));
    return <section className="prism-leadership-trend"><header><h3>과거 5개년 리더십 Survey 추이</h3><span>종합 평균 (5점 만점)</span></header>
        {!hasChartData && !rows.length && <PrismOutline><PrismNoData/></PrismOutline>}
        {hasChartData && <PrismTrendChart {...chart}/>} {rows.length > 0 && <PrismTable caption="리더십 Survey 추이"><thead><tr>{["연도","평가자수","응답자수","점수","그룹 평균 점수","백분율"].map(label=><th key={label} scope="col">{label}</th>)}</tr></thead><tbody>{rows.map(row=><tr key={row.year}><th scope="row">{row.year}</th><td>{row.evaluators??"-"}</td><td>{row.respondents??"-"}</td><td data-highlight>{row.score??"-"}</td><td>{row.groupAverage??"-"}</td><td data-highlight>{row.percentile===null ? "-" : `상위 ${row.percentile}%`}</td></tr>)}</tbody></PrismTable>}</section>;
}
export type PrismLeadershipSectionProps = {strength:ComponentProps<typeof PrismLeadershipReasons>;improvement:ComponentProps<typeof PrismLeadershipReasons>;trend:ComponentProps<typeof PrismLeadershipTrend>} & (
    {survey:ComponentProps<typeof PrismSurveyValidation>;radar?:never;validation?:never} | {radar:ComponentProps<typeof PrismRadarChart>;validation:ComponentProps<typeof PrismValidationList>;survey?:never}
) & (
    {summary:ComponentProps<typeof PrismAssessmentSummary>;pieSummary?:never} | {summary?:never;pieSummary:PrismLeadershipPieSummaryProps}
);
export function PrismLeadershipSection({summary,pieSummary,survey,radar,validation,strength,improvement,trend}: PrismLeadershipSectionProps) {
    return <div className="prism-domain-profile-section">{pieSummary ? <PrismLeadershipPieSummary {...pieSummary}/> : <PrismAssessmentSummary {...summary}/>}
        {survey ? <PrismSurveyValidation {...survey}/> : <><PrismRadarChart {...radar}/><PrismValidationList {...validation}/></>}
        <PrismLeadershipReasons {...strength}/><PrismLeadershipReasons {...improvement} danger/><PrismLeadershipTrend {...trend}/></div>;
}
export function PrismCommentsSection({items,editor}: {items:readonly {id:string;author:string;date:string;comment:string|null}[];editor?:ComponentProps<typeof PrismCommentEditor>}) {
    return <div className="prism-domain-profile-section"><PrismOutline title="Mgmt. Comments">{items.length ? items.map(item=><article key={item.id}><header><strong>{item.author}</strong> <time>{item.date}</time></header><p>{item.comment??"관련 데이터 없음"}</p></article>) : <PrismNoData/>}</PrismOutline>{editor&&<PrismCommentEditor {...editor}/>}</div>;
}

export function PrismProfileBrief({items,evaluations,compensation,compact=false,single=false}: {items:readonly {label:string;value:string|null}[];evaluations?:ReactNode;compensation?:string|null;compact?:boolean;single?:boolean}) {
    return <div className="prism-profile-brief">{items.map(item=><div key={item.label}><span>{item.label}</span><p>{item.value??"-"}</p></div>)}{!compact&&evaluations&&<><hr/><div><span>최근 평가 이력</span>{evaluations}</div></>}{single&&<><hr/><div><span>최근 보상 정보<small>단위 : 백만원</small></span><p>{compensation??"-"}</p></div></>}</div>;
}
export function PrismGradeSummary({grade,summary,note}: {grade:string|null;summary:string|null;note?:string}) {
    return <PrismSummaryBadge label={grade??"-"} summary={summary} note={note}/>;
}
