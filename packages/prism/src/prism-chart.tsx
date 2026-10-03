import { useId, useState } from "react";
export type PrismChartAxis = { id: string; label: string; description?: string };
export type PrismChartSeries = { id: string; label: string; values: readonly (number | null)[]; color?: string };
function validate(values: readonly (number | null)[], count: number, max: number) {
    if (!Number.isFinite(max) || max <= 0 || values.length !== count || values.some(v => v !== null && (!Number.isFinite(v) || v < 0 || v > max))) throw new RangeError("Chart values must match labels and be null or in 0..max.");
}
export function PrismRadarChart({ title, axes, series, max = 10 }: { title: string; axes: readonly PrismChartAxis[]; series: readonly PrismChartSeries[]; max?: number }) {
    const id = useId(); const [active,setActive] = useState<string | null>(null);
    if (axes.length < 3) throw new RangeError("Radar chart requires at least three axes.");
    series.forEach(s => validate(s.values,axes.length,max));
    const point = (index: number, value: number, radius = 90) => { const angle = index/axes.length*Math.PI*2-Math.PI/2;
        return [210+Math.cos(angle)*radius*value/max,130+Math.sin(angle)*radius*value/max]; };
    const polygon = (values: readonly number[], radius = 90) => values.map((v,i) => point(i,v,radius).join(",")).join(" ");
    return <figure className="prism-radar"><svg viewBox="0 0 420 280" role="img" aria-labelledby={`${id}-title ${id}-description`}>
        <title id={`${id}-title`}>{title}</title><desc id={`${id}-description`}>값과 누락 정보는 아래 데이터 표에서도 확인할 수 있습니다.</desc>
        {[.2,.4,.6,.8,1].map(fraction => <polygon key={fraction} points={polygon(axes.map(() => max*fraction))} fill="none" stroke="#E3E5E5" />)}
        {axes.map((axis,index) => { const [x,y] = point(index,max); const [lx,ly] = point(index,max,115); return <g key={axis.id}>
            <line x1={210} y1={130} x2={x} y2={y} stroke="#E3E5E5" /><text x={lx} y={ly-7} textAnchor="middle" className="prism-radar-value">{series[0]?.values[index] ?? "--"}</text>
            <text x={lx} y={ly+9} textAnchor="middle" className="prism-radar-label">{axis.label}</text></g>; })}
        {series.map(s => <g key={s.id}>{s.values.every(v => v !== null) && <polygon points={polygon(s.values as number[])} fill="rgba(27,100,218,0.15)" stroke={s.color ?? "#0072C6"} strokeWidth={2} />}
            {s.values.map((value,index) => { if (value === null) return null; const [x,y] = point(index,value); const key = `${s.id}-${axes[index].id}`;
                return <circle key={key} cx={x} cy={y} r={4} fill="#98D0F5" stroke={s.color ?? "#0072C6"} tabIndex={0}
                    aria-label={`${axes[index].label} ${s.label} ${value} / ${max}`} onFocus={() => setActive(key)} onBlur={() => setActive(null)} onMouseEnter={() => setActive(key)} onMouseLeave={() => setActive(null)}>
                    <title>{`${axes[index].description ?? axes[index].label}: ${value} / ${max}`}</title></circle>; })}</g>)}</svg>
        <figcaption>{series.map(s => <span key={s.id}><i style={{background:s.color ?? "#0072C6"}} />{s.label}</span>)}</figcaption>
        {active && <p className="prism-chart-detail" role="status">{series.flatMap(s => axes.map((axis,index) => `${s.id}-${axis.id}` === active ? `${axis.label}: ${s.values[index]} / ${max} · ${axis.description ?? s.label}` : null)).find(Boolean)}</p>}
        <details><summary>차트 데이터</summary><table><caption className="prism-sr-only">{title} 데이터</caption><thead><tr><th scope="col">분류</th>{series.map(s => <th scope="col" key={s.id}>{s.label}</th>)}</tr></thead>
            <tbody>{axes.map((axis,index) => <tr key={axis.id}><th scope="row">{axis.label}</th>{series.map(s => <td key={s.id}>{s.values[index] ?? "정보 없음"}</td>)}</tr>)}</tbody></table></details></figure>;
}
export function PrismTrendChart({ title, labels, series, max = 5 }: { title: string; labels: readonly string[]; series: readonly PrismChartSeries[]; max?: number }) {
    const id = useId(); series.forEach(s => validate(s.values,labels.length,max));
    const x = (index: number) => 40+index*360/Math.max(1,labels.length-1); const y = (value: number) => 180-value/max*150;
    return <figure className="prism-trend"><svg viewBox="0 0 440 220" role="img" aria-labelledby={id}><title id={id}>{title}</title>
        {[0,1,2,3,4,5].map(step => <g key={step}><line x1={40} x2={400} y1={y(step*max/5)} y2={y(step*max/5)} stroke="#E3E5E5" /><text x={25} y={y(step*max/5)+4} textAnchor="end">{step*max/5}</text></g>)}
        {labels.map((label,index) => <text key={`${label}-${index}`} x={x(index)} y={203} textAnchor="middle">{label}</text>)}
        {series.map(s => <g key={s.id}>{s.values.map((value,index) => value === null ? null : <g key={index}>
            {index > 0 && s.values[index-1] !== null && <line x1={x(index-1)} x2={x(index)} y1={y(s.values[index-1]!)} y2={y(value)} stroke={s.color ?? "#0072C6"} strokeWidth={2} />}
            <circle cx={x(index)} cy={y(value)} r={4} fill={s.color ?? "#0072C6"} tabIndex={0} aria-label={`${labels[index]} ${s.label} ${value} / ${max}`}><title>{`${labels[index]}: ${value} / ${max}`}</title></circle></g>)}</g>)}</svg>
        <figcaption>{title}</figcaption><table className="prism-sr-only"><caption>{title} 데이터</caption><thead><tr><th scope="col">시점</th>{series.map(s => <th scope="col" key={s.id}>{s.label}</th>)}</tr></thead><tbody>{labels.map((label,index) => <tr key={`${label}-${index}`}><th scope="row">{label}</th>{series.map(s => <td key={s.id}>{s.values[index] ?? "정보 없음"}</td>)}</tr>)}</tbody></table></figure>;
}
