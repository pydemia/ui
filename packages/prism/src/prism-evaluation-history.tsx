import type { ReactNode } from "react";

export type PrismEvaluationRecord = { year: string; grade: string | null; active?: boolean };
export type PrismEvaluationHistoryProps = {
    items: readonly PrismEvaluationRecord[];
    variant?: "source" | "explicit";
    empty?: ReactNode;
    className?: string;
};
/** Source display formatting only; this does not calculate or rank evaluations. */
export function preparePrismEvaluationHistory(items: readonly PrismEvaluationRecord[]) {
    return items.flatMap((item, index) => {
        const raw = item.grade?.trim();
        if (!raw) return [];
        const wrapped = raw.startsWith("(") && raw.endsWith(")");
        const grade = wrapped ? raw.slice(1, -1).trim() : raw;
        if (!grade) return [];
        return [{ year: item.year, grade, active: item.active ?? wrapped, index }];
    }).sort((a, b) => {
        const ay = /^\d{4}$/.test(a.year) ? Number(a.year) : null;
        const by = /^\d{4}$/.test(b.year) ? Number(b.year) : null;
        return ay !== null && by !== null ? by - ay || a.index - b.index
            : ay !== null ? -1 : by !== null ? 1 : a.index - b.index;
    }).map(({ index, ...item }) => item);
}
export function PrismEvaluationHistory({ items, variant = "source", empty, className = "" }: PrismEvaluationHistoryProps) {
    const fallback = empty === undefined ? variant === "explicit" ? "평가 이력이 없습니다." : null : empty;
    if (variant === "explicit") return <div className={`prism-evaluation-history ${className}`} data-variant="explicit">{items.length
        ? items.map((item, index) => <span key={`${item.year}-${index}`}><b data-active={item.active || undefined}>{item.grade ?? "--"}</b><small>{item.year}</small></span>)
        : fallback}</div>;
    const visible = preparePrismEvaluationHistory(items);
    if (!visible.length) return fallback;
    const year = (value: string) => /^\d{4}$/.test(value) ? `'${value.slice(-2)}년` : value.trim() || "연도 미상";
    return <div className={`prism-evaluation-history ${className}`} data-variant="source"><div className="prism-evaluation-badges">
        {visible.map((item, index) => <span className="prism-evaluation-badge" key={`${item.year}-${index}`} data-active={item.active || undefined}>
            <span className="prism-sr-only">{item.year.trim() || "연도 미상"} 평가 </span>{item.grade}
        </span>)}</div><span className="prism-evaluation-years" aria-hidden="true">({visible.map(item => year(item.year)).join("/")})</span></div>;
}
