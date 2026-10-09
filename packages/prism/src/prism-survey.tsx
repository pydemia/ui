import { useId, type CSSProperties, type ReactNode } from "react";
import { PrismNoData } from "./prism-assessment";
export type PrismSurveyBar = { role: "boss" | "peer" | "member"; value: number | null; average?: number | null };
export type PrismSurveyItem = { id: string; category: string; bars: readonly PrismSurveyBar[] };
const roleLabels = { boss: "상사", peer: "동료", member: "구성원" };
export function PrismSurveyValidation({ items, columns = 3, barMaxHeight = 100, action, title = "6 Frame Survey 결과", className = "", style }:
    { items: readonly PrismSurveyItem[]; columns?: 2 | 3; barMaxHeight?: number; action?: ReactNode; title?: string; className?: string; style?: CSSProperties }) {
    const id = useId();
    if (![2,3].includes(columns) || !Number.isFinite(barMaxHeight) || barMaxHeight <= 0) throw new RangeError("Survey columns must be 2 or 3 and bar height positive.");
    if (new Set(items.map(item => item.id)).size !== items.length || items.some(item => !item.id || !item.category.trim() || new Set(item.bars.map(bar => bar.role)).size !== item.bars.length ||
        item.bars.some(bar => bar.value === undefined || !Object.hasOwn(roleLabels,bar.role) || [bar.value,bar.average].some(value => value !== null && value !== undefined && (!Number.isFinite(value) || value < 0 || value > 10))))) throw new RangeError("Survey records require unique identifiers and roles with null or 0..10 values.");
    return <section className={`prism-survey ${className}`} style={style} aria-labelledby={id}>
        <header className="prism-profile-section-header"><h3 id={id}>{title}</h3>{action}</header>
        {items.length ? <><div className="prism-survey-grid" data-columns={columns}>{items.map(item => <article key={item.id} className="prism-survey-item">
            <h4>{item.category}</h4><div className="prism-survey-body">{item.bars.some(bar => bar.value !== null) ? <div className="prism-survey-chart">{item.bars.filter(bar => bar.value !== null).map(bar => <div key={bar.role} className="prism-survey-bar" data-role={bar.role}>
                <strong>{bar.value!.toFixed(1)}</strong><div className="prism-survey-track" style={{ height: barMaxHeight }} aria-hidden="true"><span className="prism-survey-fill" style={{ height: bar.value!/10*barMaxHeight }}/>
                    {bar.average !== null && bar.average !== undefined && <span className="prism-survey-average" style={{ bottom: Math.round(bar.average/10*barMaxHeight) }}/>}</div><span>{roleLabels[bar.role]}</span>
                {bar.average !== null && bar.average !== undefined && <span className="prism-sr-only">그룹 평균 {bar.average}</span>}
            </div>)}</div> : <div className="prism-survey-empty"><PrismNoData/></div>}</div>
            <div className="prism-sr-only"><table><caption>{item.category} 데이터</caption><thead><tr><th>응답자</th><th>점수</th><th>그룹 평균</th></tr></thead><tbody>{item.bars.map(bar => <tr key={bar.role}><th scope="row">{roleLabels[bar.role]}</th><td>{bar.value ?? "정보 없음"}</td><td>{bar.average ?? "정보 없음"}</td></tr>)}</tbody></table></div>
        </article>)}</div><div className="prism-survey-legend"><span aria-hidden="true"/>그룹 평균(10점 만점)</div></> : <div className="prism-survey-empty-outline"><PrismNoData/></div>}
    </section>;
}
