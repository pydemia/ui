import { useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { PrismButton } from "./prism-button";
import { PrismIcon } from "./prism-icon";

export type PrismPositionRecommendationItem = { id: string; title: string; company: string; reasons: readonly string[]; companyLogo?: ReactNode };
export type PrismPositionRecommendationProps = {
    item: PrismPositionRecommendationItem; selected?: boolean; onSelect?: (item: PrismPositionRecommendationItem) => void;
    headerMinHeight?: number; className?: string; style?: CSSProperties;
};
export function PrismPositionRecommendation({ item, selected, onSelect, headerMinHeight, className = "", style }: PrismPositionRecommendationProps) {
    if (headerMinHeight !== undefined && (!Number.isFinite(headerMinHeight) || headerMinHeight <= 0)) throw new RangeError("Position header minimum must be positive.");
    const action = () => onSelect?.(item);
    return <article className={`prism-position-recommendation ${className}`} style={style} data-selected={selected || undefined} role={onSelect ? "button" : undefined} tabIndex={onSelect ? 0 : undefined}
        aria-label={onSelect ? `${item.company} ${item.title}` : undefined} aria-pressed={onSelect ? !!selected : undefined} onClick={onSelect ? action : undefined}
        onKeyDown={onSelect ? event => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); action(); } } : undefined}>
        <header style={headerMinHeight ? {minHeight:headerMinHeight} : undefined}><span className="prism-position-company" title={item.company}>{item.companyLogo ?? item.company}</span><span className="prism-position-title" title={item.title}>{item.title}</span></header>
        <div className="prism-position-reason"><p title={item.reasons.join(", ")}>{item.reasons.join(", ")}</p></div>
    </article>;
}
export type PrismPositionRecommendationsProps = {
    items: readonly PrismPositionRecommendationItem[]; selectedId?: string; onSelect?: (item: PrismPositionRecommendationItem) => void;
    title?: string; datasetKey?: string | number; resize?: "horizontal" | "both"; className?: string; style?: CSSProperties;
};
export function PrismPositionRecommendations({ items, selectedId, onSelect, title = "추천 포지션", datasetKey, resize, className = "", style }: PrismPositionRecommendationsProps) {
    const id = useId(), element = useRef<HTMLDivElement>(null), [narrow,setNarrow] = useState(true);
    if (new Set(items.map(item => item.id)).size !== items.length || items.some(item => !item.id || !item.title.trim())) throw new Error("Position recommendations require unique identifiers and titles.");
    useLayoutEffect(() => { const node = element.current; if (!node) return;
        const measure = () => setNarrow(node.clientWidth <= 400); measure(); const observer = new ResizeObserver(entries => setNarrow(entries[0].contentRect.width <= 400));
        observer.observe(node); return () => observer.disconnect(); },[]);
    const initial = narrow ? Math.min(4,items.length) : items.length > 6 ? 6 : items.length > 3 ? 3 : items.length;
    const identity = JSON.stringify([datasetKey,narrow,items.map(item => item.id)]);
    const [reveal,setReveal] = useState({identity,count:initial});
    useLayoutEffect(() => setReveal({identity,count:initial}),[identity,initial]);
    const count = Math.min(items.length,reveal.identity === identity ? reveal.count : initial), hidden = items.length-count;
    const all = count > initial && hidden === 0, next = hidden <= 3 ? hidden : 2;
    return <div ref={element} className={`prism-position-recommendations ${className}`} style={style} data-resize={resize} data-narrow={narrow} aria-label={title}>
        <div id={id} className="prism-position-recommendation-list" data-layout={items.length === 1 ? "single" : items.length === 2 ? "pair" : "grid"}>
            {items.length ? items.slice(0,count).map(item => <PrismPositionRecommendation key={item.id} item={item} selected={selectedId === item.id} onSelect={onSelect}/>) : <p className="prism-no-data">관련 데이터 없음</p>}
        </div>
        {(hidden > 0 || all) && <PrismButton variant="line" size="large" className="prism-position-reveal" aria-controls={id} aria-expanded={count > initial}
            icon={<PrismIcon name="ChevronDownIcon" style={{transform:all ? "rotate(180deg)" : undefined}}/>} iconPosition="right"
            onClick={() => setReveal({identity,count:all ? initial : narrow ? Math.min(items.length,count+next) : items.length})}>
            {all ? "접기" : narrow ? `포지션 ${next}개 더보기 (${hidden})` : `더보기 (${hidden})`}
        </PrismButton>}
    </div>;
}
