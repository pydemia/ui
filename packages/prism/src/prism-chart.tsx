import { useEffect, useId, useRef, useState } from "react";
export type PrismChartAxis = { id: string; label: string; description?: string };
export type PrismChartSeries = { id: string; label: string; values: readonly (number | null)[]; color?: string };
export type PrismLeadershipPieItem = { label: string; value: number | null };
export type PrismLeadershipPieProps = {
    title: string; items: readonly PrismLeadershipPieItem[]; size?: number; labelFontSize?: number; animate?: boolean;
};
const leadershipColors = ["#706ee7", "#55c4ae", "#ff928a"];
const turn = Math.PI * 2;
function pieSector(cx: number, cy: number, radius: number, start: number, end: number) {
    const point = (angle: number) => `${cx+Math.cos(angle)*radius},${cy+Math.sin(angle)*radius}`;
    if (end-start >= turn-1e-6) return `M ${point(start)} A ${radius},${radius} 0 1 1 ${point(start+Math.PI)} A ${radius},${radius} 0 1 1 ${point(end)} Z`;
    return `M ${cx},${cy} L ${point(start)} A ${radius},${radius} 0 ${end-start > Math.PI ? 1 : 0} 1 ${point(end)} Z`;
}
/** Percentages are supplied by the host; the unassigned sector is never an assessment value. */
export function PrismLeadershipPie({ title, items, size = 120, labelFontSize = 11, animate = true }: PrismLeadershipPieProps) {
    const id = useId(); const root = useRef<HTMLElement>(null);
    const [measured,setMeasured] = useState<readonly number[]>([]); const [available,setAvailable] = useState<number | null>(null);
    const [progress,setProgress] = useState(1);
    const signature = JSON.stringify(items); const total = items.reduce((sum,item) => sum+(item.value ?? 0),0);
    const complete = items.every(item => item.value !== null);
    if (!title.trim() || !items.length || items.length > 3 || new Set(items.map(item => item.label.trim())).size !== items.length || items.some(item => !item.label.trim())) throw new Error("Leadership pie requires a title and one to three unique labels.");
    if (!Number.isFinite(size) || size < 40 || size > 640 || !Number.isFinite(labelFontSize) || labelFontSize < 8 || labelFontSize > 24) throw new RangeError("Pie size must be 40..640 and label font size 8..24.");
    if (items.some(item => item.value !== null && (!Number.isFinite(item.value) || item.value < 0 || item.value > 100)) || total > 100.2 || (complete && total > 0 && Math.abs(total-100) > .2)) throw new RangeError("Pie values must be null or percentages in 0..100; a complete positive distribution must total 100 within rounding tolerance.");
    useEffect(() => {
        const element = root.current; if (!element) return;
        const measure = () => {
            const canvas = document.createElement("canvas"); const context = canvas.getContext("2d");
            if (context) { context.font = `700 ${labelFontSize}px ${getComputedStyle(element).fontFamily}`; setMeasured(items.map(item => context.measureText(`${item.label} ${item.value}%`).width)); }
            const parent = element.parentElement;
            const style = parent ? getComputedStyle(parent) : null;
            setAvailable(parent && style ? Math.max(0,parent.clientWidth-parseFloat(style.paddingLeft)-parseFloat(style.paddingRight)) : null);
        };
        const observer = new ResizeObserver(measure); if (element.parentElement) observer.observe(element.parentElement);
        measure(); let disposed = false; void document.fonts.ready.then(() => { if (!disposed) measure(); }); document.fonts.addEventListener("loadingdone",measure);
        return () => { disposed = true; observer.disconnect(); document.fonts.removeEventListener("loadingdone",measure); };
    },[signature,labelFontSize]);
    useEffect(() => {
        if (!animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setProgress(1); return; }
        let frame: number; const start = performance.now(); setProgress(0);
        const tick = (now: number) => { const elapsed = Math.min(1,(now-start)/1000); setProgress(1-(1-elapsed)**4); if (elapsed < 1) frame=requestAnimationFrame(tick); };
        frame=requestAnimationFrame(tick); return () => cancelAnimationFrame(frame);
    },[signature,animate]);
    const renderedSize = Math.min(size,available === null ? size : Math.max(40,available-40));
    const radius = renderedSize/2; let accumulated = 0;
    const divisor = complete && total > 0 ? total : 100;
    const sectors = items.flatMap((item,index) => {
        if (item.value === null || item.value === 0) return [];
        const start = accumulated/divisor*turn-Math.PI/2; accumulated+=item.value; const end = accumulated/divisor*turn-Math.PI/2;
        const angle = (start+end)/2; const center = end-start >= turn-1e-6 ? 0 : radius*.55;
        const x = Math.cos(angle)*center, y = Math.sin(angle)*center; const text = `${item.label} ${item.value}%`;
        const width = measured[index] ?? text.length*labelFontSize*.65;
        const inside = end-start >= Math.PI || [-1,1].every(dx => [-1,1].every(dy => {
            const px=x+dx*width/2, py=y+dy*labelFontSize*.4; const a=(Math.atan2(py,px)-start+turn)%turn;
            return Math.hypot(px,py) <= radius-4 && a <= end-start;
        }));
        return [{...item,index,start,end,angle,x,y,text,width,inside}];
    });
    const external = sectors.filter(item => !item.inside).map(item => ({...item,right:Math.cos(item.angle)>=0,edgeX:Math.cos(item.angle)*radius,edgeY:Math.sin(item.angle)*radius,x:Math.cos(item.angle)*(radius+8),y:Math.sin(item.angle)*(radius+8)}));
    for (const right of [false,true]) {
        const labels = external.filter(item => item.right===right).sort((a,b) => a.y-b.y);
        for (let index=1;index<labels.length;index++) {
            labels[index].y=Math.max(labels[index].y,labels[index-1].y+labelFontSize+2);
            labels[index].x=(right ? 1 : -1)*Math.sqrt(Math.max(0,(radius+8)**2-labels[index].y**2));
        }
    }
    const pad = (right: boolean) => Math.max(20,...external.filter(item => item.right===right).map(item => Math.ceil(Math.abs(item.x)+14+item.width-radius)));
    const left = pad(false), right = pad(true); const intrinsic = renderedSize+left+right;
    const legend = available !== null && intrinsic > available+1;
    const side = legend ? 20 : left; const width = legend ? renderedSize+40 : intrinsic;
    const vertical = labelFontSize+8; const height = renderedSize+vertical*2; const cx=side+radius, cy=vertical+radius;
    const hasValues = total > 0;
    return <figure ref={root} className="prism-leadership-pie" data-label-mode={legend ? "legend" : "chart"} style={{width}}>
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-labelledby={`${id}-title ${id}-description`}>
            <title id={`${id}-title`}>{title}</title><desc id={`${id}-description`}>제공된 비중은 데이터 표에서 확인할 수 있습니다. 회색 영역은 미확정 비중입니다.</desc>
            {!complete && hasValues && total < 100 && <path className="prism-pie-unassigned" d={pieSector(cx,cy,radius,total/100*turn-Math.PI/2,turn-Math.PI/2)} fill="#eef1f8"/>}
            {sectors.map(item => <path key={item.label} className="prism-pie-slice" data-value={item.value} d={pieSector(cx,cy,radius,-Math.PI/2+(item.start+Math.PI/2)*progress,-Math.PI/2+(item.end+Math.PI/2)*progress)} fill={leadershipColors[item.index]}/>)}
            {!legend && sectors.filter(item => item.inside).map(item => <text key={item.label} x={cx+item.x} y={cy+item.y} textAnchor="middle" dominantBaseline="central" fontSize={labelFontSize} fontWeight={700} fill="#fff">{item.text}</text>)}
            {!legend && external.map(item => { const endX=cx+item.x+(item.right ? 10 : -10);return <g key={item.label}>
                <polyline points={`${cx+item.edgeX},${cy+item.edgeY} ${cx+item.x},${cy+item.y} ${endX},${cy+item.y}`} stroke={leadershipColors[item.index]} fill="none"/>
                <text x={endX+(item.right ? 4 : -4)} y={cy+item.y} textAnchor={item.right ? "start" : "end"} dominantBaseline="central" fontSize={labelFontSize} fontWeight={600}><tspan fill={leadershipColors[item.index]}>{item.label} </tspan><tspan fill="#222">{item.value}%</tspan></text>
            </g>;})}
            {!hasValues && <text x={cx} y={cy} textAnchor="middle" fill="#868686" fontSize={12}>{complete ? "비중 모두 0%" : "관련 데이터 없음"}</text>}
        </svg>
        {legend && <ul className="prism-pie-legend" style={{fontSize:labelFontSize}} aria-hidden="true">{items.map((item,index) => <li key={item.label}><i style={{background:leadershipColors[index]}}/><span>{item.label}</span><b>{item.value===null ? "정보 없음" : `${item.value}%`}</b></li>)}</ul>}
        <div className="prism-sr-only"><table><caption>{title} 데이터</caption><thead><tr><th scope="col">특성</th><th scope="col">비중</th></tr></thead><tbody>{items.map(item => <tr key={item.label}><th scope="row">{item.label}</th><td>{item.value===null ? "정보 없음" : `${item.value}%`}</td></tr>)}</tbody></table></div>
    </figure>;
}
function validate(values: readonly (number | null)[], count: number, max: number) {
    if (!Number.isFinite(max) || max <= 0 || values.length !== count || values.some(v => v !== null && (!Number.isFinite(v) || v < 0 || v > max))) throw new RangeError("Chart values must match labels and be null or in 0..max.");
}
export function PrismRadarChart({ title, axes, series, max = 10, showLegend = true, dataTable = "toggle", size, gridRings = 5, pointBorderWidth = 1 }: { title: string; axes: readonly PrismChartAxis[]; series: readonly PrismChartSeries[]; max?: number; showLegend?: boolean; dataTable?: "toggle" | "hidden"; size?: number; gridRings?: 4 | 5; pointBorderWidth?: number }) {
    const id = useId(); const [active,setActive] = useState<string | null>(null);
    if (axes.length < 3) throw new RangeError("Radar chart requires at least three axes.");
    if (size !== undefined && (!Number.isFinite(size) || size < 160 || size > 800) || ![4,5].includes(gridRings) || !Number.isFinite(pointBorderWidth) || pointBorderWidth < 0) throw new RangeError("Radar size, grid count or point border is invalid.");
    series.forEach(s => validate(s.values,axes.length,max));
    const centerX = size ? size/2 : 210, centerY = size ? size/2+5 : 130, radius = size ? size*.27 : 90, labelRadius = size ? size*.38 : 115;
    const point = (index: number, value: number, extent = radius) => { const angle = index/axes.length*Math.PI*2-Math.PI/2;
        return [centerX+Math.cos(angle)*extent*value/max,centerY+Math.sin(angle)*extent*value/max]; };
    const polygon = (values: readonly number[], extent = radius) => values.map((v,i) => point(i,v,extent).join(",")).join(" ");
    return <figure className="prism-radar" style={size ? {width:size,minWidth:size} : undefined}><svg viewBox={size ? `0 0 ${size} ${size}` : "0 0 420 280"} role="img" aria-labelledby={`${id}-title ${id}-description`}>
        <title id={`${id}-title`}>{title}</title><desc id={`${id}-description`}>값과 누락 정보는 아래 데이터 표에서도 확인할 수 있습니다.</desc>
        {Array.from({length:gridRings},(_,index)=>(index+1)/gridRings).map(fraction => <polygon key={fraction} points={polygon(axes.map(() => max*fraction))} fill="none" stroke="#E3E5E5" />)}
        {axes.map((axis,index) => { const [x,y] = point(index,max); const [lx,ly] = point(index,max,labelRadius); return <g key={axis.id}>
            <line x1={centerX} y1={centerY} x2={x} y2={y} stroke="#E3E5E5" /><text x={lx} y={ly-7} textAnchor="middle" className="prism-radar-value">{series[0]?.values[index] ?? "--"}</text>
            <text x={lx} y={ly+9} textAnchor="middle" className="prism-radar-label">{axis.label}</text></g>; })}
        {series.map(s => <g key={s.id}>{s.values.every(v => v !== null) && <polygon points={polygon(s.values as number[])} fill="rgba(27,100,218,0.15)" stroke={s.color ?? "#0072C6"} strokeWidth={2} />}
            {s.values.map((value,index) => { if (value === null) return null; const [x,y] = point(index,value); const key = `${s.id}-${axes[index].id}`;
                return <circle key={key} cx={x} cy={y} r={4} fill="#98D0F5" stroke={s.color ?? "#0072C6"} strokeWidth={pointBorderWidth} tabIndex={0}
                    aria-label={`${axes[index].label} ${s.label} ${value} / ${max}`} onFocus={() => setActive(key)} onBlur={() => setActive(null)} onMouseEnter={() => setActive(key)} onMouseLeave={() => setActive(null)}>
                    <title>{`${axes[index].description ?? axes[index].label}: ${value} / ${max}`}</title></circle>; })}</g>)}</svg>
        {showLegend && <figcaption>{series.map(s => <span key={s.id}><i style={{background:s.color ?? "#0072C6"}} />{s.label}</span>)}</figcaption>}
        {active && <p className="prism-chart-detail" role="status">{series.flatMap(s => axes.map((axis,index) => `${s.id}-${axis.id}` === active ? `${axis.label}: ${s.values[index]} / ${max} · ${axis.description ?? s.label}` : null)).find(Boolean)}</p>}
        <details className={dataTable === "hidden" ? "prism-sr-only" : undefined} open={dataTable === "hidden" || undefined}><summary hidden={dataTable === "hidden"} tabIndex={dataTable === "hidden" ? -1 : undefined}>차트 데이터</summary><table><caption className="prism-sr-only">{title} 데이터</caption><thead><tr><th scope="col">분류</th>{series.map(s => <th scope="col" key={s.id}>{s.label}</th>)}</tr></thead>
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
