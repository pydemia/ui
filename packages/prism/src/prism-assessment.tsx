import { useId, type ReactNode, type CSSProperties } from "react";
import { PrismCheckGlyph as Check, PrismStarGlyph as Star } from "./prism-icon";
import { PrismOutline, PrismCompetenceMatrix } from "./prism-profile";
import { PrismChip } from "./prism-badge";
import { PrismRadarChart } from "./prism-chart";

export function PrismAssessmentSummary({ title = "SUMMARY", heading, description }: { title?: string; heading?: string | null; description?: string | null }) {
    return <PrismOutline title={title}><div className="prism-assessment-summary">{heading || description ? <>{heading && <strong>{heading}</strong>}{description && <p>{description}</p>}</> : <PrismNoData />}</div></PrismOutline>;
}
export function PrismNoData({ message = "관련 데이터 없음" }: { message?: string }) { return <p className="prism-no-data">{message}</p>; }
export type PrismRiskItem = { id: string; label: string; latent: boolean | null; manifest: boolean | null };
export function PrismRiskTable({ items }: { items: readonly PrismRiskItem[] }) {
    const merged = { latent: items.length > 0 && items.every(i => i.latent === null), manifest: items.length > 0 && items.every(i => i.manifest === null) };
    return <section className="prism-risk"><h3>Derailment Risk</h3><div className="prism-assessment-table-scroll"><table><caption className="prism-sr-only">잠재·발현 Risk</caption>
        <thead><tr><th scope="col">항목</th><th scope="col">잠재 Risk<small>성격가치검사</small></th><th scope="col">발현 Risk<small>6Frame Survey 결과</small></th></tr></thead>
        <tbody>{items.length ? items.map((item,index) => <tr key={item.id}><th scope="row">{item.label}</th>{(["latent","manifest"] as const).map(key => merged[key] ? index === 0 && <td key={key} rowSpan={items.length}>관련 데이터 없음</td> :
            <td key={key}>{item[key] === null ? "관련 데이터 없음" : item[key] ? <><Check aria-hidden="true" /><span className="prism-sr-only">해당</span></> : <span aria-label="해당 없음">-</span>}</td>)}</tr>) : <tr><td colSpan={3}>관련 데이터 없음</td></tr>}</tbody></table></div></section>;
}
export function PrismValueShares({ items }: { items: readonly { label: string; percent: number }[] }) {
    const colors = ["#2F548C","#2E8ED9","#98D0F5","#D7DCE3"];
    if (items.some(i => !Number.isFinite(i.percent) || i.percent < 0 || i.percent > 100) || items.reduce((sum,i) => sum+i.percent,0) > 100.01) throw new RangeError("Value shares must be 0..100 and total at most 100.");
    if (!items.some(i => i.percent > 0)) return <PrismNoData />;
    const visible = items.map((item,index) => ({ ...item, color: colors[index%4] })).filter(item => item.percent > 0);
    return <div className="prism-value-shares"><div className="prism-share-bar" aria-hidden="true">{visible.map(item => <span key={item.label} style={{width:`${item.percent}%`,background:item.color}} />)}</div>
        <ul>{visible.map(item => <li key={item.label}><span aria-hidden="true" style={{background:item.color}} />{item.label} <b>{item.percent}%</b></li>)}</ul></div>;
}
export function PrismDiagnosis({ title, axes, values, heading, description, shares, valueDescription, max = 10, action, className = "", style }: { title: string; axes: readonly string[]; values: readonly (number | null)[];
    heading?: string; description?: string; shares?: readonly { label: string; percent: number }[]; valueDescription?: string; max?: number; action?: ReactNode; className?: string; style?: CSSProperties }) {
    const id = useId(), commentTitle = heading?.trim(), comment = description?.trim(), valuesComment = valueDescription?.trim();
    const hasComment = !!commentTitle || !!comment, hasShares = shares?.some(item => item.percent > 0);
    return <section className={`prism-diagnosis-recipe ${className}`} style={style} aria-labelledby={id}><header className="prism-profile-section-header"><h3 id={id}>{title}</h3>{action}</header>
        <PrismOutline><div className="prism-diagnosis"><section><header><strong>성격</strong><span>Big 5 기반 · {max}점 만점</span></header><div className="prism-diagnosis-row"><div className="prism-diagnosis-chart"><PrismRadarChart title="성격 진단" axes={axes.map((label,index) => ({id:String(index),label}))} series={[{id:"personality",label:"성격",values:values.length ? values : axes.map(() => null)}]} max={max} size={180} gridRings={4} pointBorderWidth={0} showLegend={false} dataTable="hidden"/></div><div className="prism-diagnosis-comment">{hasComment ? <>{commentTitle && <strong>{commentTitle}</strong>}{comment && <p>{comment}</p>}</> : <PrismNoData/>}</div></div></section>
        {shares && <section><header><strong>가치관</strong><span>가치 지향 비중 · %</span></header><PrismValueShares items={shares}/>{hasShares && (valuesComment ? <p>{valuesComment}</p> : <PrismNoData/>)}</section>}</div></PrismOutline>
    </section>;
}
export function PrismScoreEssay({ title, items }: { title: string; items: readonly { id: string; name: string; score: number | null; max: number; description: string | null }[] }) {
    if (items.some(i => !Number.isFinite(i.max) || i.max <= 0 || (i.score !== null && (!Number.isFinite(i.score) || i.score < 0 || i.score > i.max)))) throw new RangeError("Essay score must be null or 0..max.");
    return <PrismOutline title={title}><div className="prism-score-essays">{items.length ? items.map(item => <article key={item.id}><header><span>{item.name}</span><strong>{item.score ?? "--"}<small> / {item.max}</small></strong></header><p>{item.description ?? "관련 데이터 없음"}</p></article>) : <PrismNoData />}</div></PrismOutline>;
}
export function PrismExpertiseCards({ items }: { items: readonly { id: string; field: string; years: string; title?: string; description?: string }[] }) {
    return <PrismOutline title="전문 분야 및 대표 업적"><div className="prism-expertise-cards">{items.length ? items.map(item => <article key={item.id}><header><strong>{item.field}</strong><PrismChip>{item.years}</PrismChip></header><div>{item.title && <strong>{item.title}</strong>}{item.description ? <p>{item.description}</p> : <PrismNoData message="해당 내용 미작성" />}</div></article>) : <PrismNoData message="해당 내용 미작성" />}</div></PrismOutline>;
}
export function PrismExperienceTopics({ topics, value, onValueChange }: { topics: readonly { id: string; label: string; starred?: boolean }[]; value: string; onValueChange: (value: string) => void }) {
    return <div className="prism-experience-topics" role="group" aria-label="경험 영역">{topics.map(topic => <button type="button" key={topic.id} aria-pressed={value === topic.id} onClick={() => onValueChange(topic.id)}>{topic.starred && <Star fill="currentColor" aria-hidden="true" />}{topic.label}</button>)}</div>;
}
export function PrismExperienceEvidence({ title, items }: { title: string; items: readonly { id: string; label: string; hasExperience: boolean | null; description?: string }[] }) {
    return <PrismOutline title={title}><div className="prism-experience-evidence">{items.map(item => <article key={item.id}><header><strong>{item.label}</strong><PrismChip tone={item.hasExperience ? "primary" : "warning"}>{item.hasExperience === null ? "정보 없음" : item.hasExperience ? "작성내용 있음" : "작성내용 없음"}</PrismChip></header>{item.description && item.hasExperience ? <p>{item.description}</p> : <PrismNoData />}</article>)}</div></PrismOutline>;
}
export function PrismLeadershipReasons({ title, danger, items, comment }: { title: string; danger?: boolean; items: readonly { id: string; role: string; text: string | null }[]; comment?: string }) {
    return <PrismOutline title={title}><div className="prism-leadership-reasons" data-danger={danger || undefined}><dl>{items.map(item => <div key={item.id}><dt>{item.role}</dt><dd>{item.text ?? "관련 데이터 없음"}</dd></div>)}</dl>{comment && <aside><strong>요약</strong><p>{comment}</p></aside>}</div></PrismOutline>;
}
export function PrismDesignDiversity({ summary, columns, rows }: { summary: readonly { label: string; values: readonly string[] }[]; columns: readonly string[]; rows: readonly { id: string; label: string; values: readonly (string | null)[] }[] }) {
    return <PrismOutline title="다양성 Matrix"><div className="prism-diversity-summary">{summary.map(item => <div key={item.label}><strong>{item.label}</strong><div>{item.values.length ? item.values.map(value => <PrismChip key={value}>{value}</PrismChip>) : <PrismNoData />}</div></div>)}</div><PrismCompetenceMatrix columns={columns} rows={rows} /></PrismOutline>;
}
export function PrismProfileSections({ children }: { children: ReactNode }) { return <div className="prism-profile-sections">{children}</div>; }
export function PrismPositionMatrix({ columns, rows, rowAxisLabel, current }: { columns: readonly { id: string; label: string }[]; rows: readonly { id: string; label: string }[]; rowAxisLabel: string; current?: { row: string; column: string } | null }) {
    return <div className="prism-position-matrix" role="region" aria-label="다양성 Matrix" tabIndex={0}><table><caption className="prism-sr-only">다양성 Matrix · 현재 위치</caption><thead><tr><th scope="col">{rowAxisLabel}</th>{columns.map(column => <th scope="col" key={column.id}>{column.label}</th>)}</tr></thead>
        <tbody>{rows.map(row => <tr key={row.id}><th scope="row">{rowAxisLabel} {row.label}</th>{columns.map(column => { const selected = current?.row === row.id && current?.column === column.id; return <td data-current={selected || undefined} key={column.id}>{selected ? "현재 위치" : <span className="prism-sr-only">해당 없음</span>}</td>; })}</tr>)}</tbody></table></div>;
}
export function PrismProfileAnalysis({ leader, factors }: { leader?: { label: string; description?: string }; factors: readonly { id: string; label: string; title?: string; results: readonly string[]; summary?: string | null; starred?: readonly string[] }[] }) {
    return <div className="prism-profile-analysis">{leader && <div className="prism-analysis-leader"><strong>{leader.label}</strong><p>{leader.description ?? "관련 데이터 없음"}</p></div>}{factors.map(factor => <section key={factor.id}><h4>{factor.label}</h4><div>{factor.title && <strong>{factor.title}</strong>}<div>{factor.results.map(result => <PrismChip key={result}>{factor.starred?.includes(result) && <Star size={14} aria-hidden="true" />}{result}</PrismChip>)}</div><p>{factor.summary ?? "관련 데이터 없음"}</p></div></section>)}</div>;
}
