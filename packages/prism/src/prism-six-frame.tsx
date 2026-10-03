import { useId, type CSSProperties, type ReactNode } from "react";

export type PrismFrameKey = "leaderType" | "expertise" | "successExperience" | "designCapability" | "learningAgility" | "derailmentRisk";
export type PrismFrameColumn = { id: string; label: ReactNode; values: Partial<Record<PrismFrameKey, ReactNode>> };
const rows: readonly { key: PrismFrameKey; label: string; group?: string; span?: number }[] = [
    { key: "leaderType", label: "리더 유형" }, { key: "expertise", label: "전문성", group: "경험", span: 2 },
    { key: "successExperience", label: "성공경험", group: "경험" }, { key: "designCapability", label: "Design 역량", group: "역량", span: 2 },
    { key: "learningAgility", label: "Learning Agility", group: "역량" }, { key: "derailmentRisk", label: "Derailment Risk", group: "자질", span: 1 },
];
export function PrismSixFrame({ columns, title = "6-frame 비교", panel = false }: { columns: readonly PrismFrameColumn[]; title?: string; panel?: boolean }) {
    const id = useId();
    if (new Set(columns.map(c => c.id)).size !== columns.length) throw new Error("Six-frame column IDs must be unique.");
    return <section className="prism-six-frame" data-panel={panel || undefined} aria-labelledby={id}>
        <h2 id={id}>{title}</h2><div className="prism-six-scroll" role="region" aria-label={title} tabIndex={0}>
            <table style={{ "--prism-cols": columns.length } as CSSProperties}><caption className="prism-sr-only">{title}</caption>
                <colgroup><col className="prism-six-group-col" /><col className="prism-six-label-col" />{columns.map(c => <col key={c.id} />)}</colgroup>
                <thead><tr><th colSpan={2} className="prism-six-fixed" scope="col">구분</th>{columns.map(c => <th scope="col" key={c.id}>{c.label}</th>)}</tr></thead>
                <tbody>{!columns.length ? <tr><td colSpan={2}>비교할 후보가 없습니다.</td></tr> : rows.map(row => <tr key={row.key}>{!row.group ? <th colSpan={2} scope="row" className="prism-six-fixed">{row.label}</th> : <>
                    {row.span && <th rowSpan={row.span} scope="rowgroup" className="prism-six-fixed">{row.group}</th>}
                    <th scope="row" className="prism-six-label">{row.label}</th></>}
                    {columns.map(c => <td key={c.id}>{c.values[row.key] ?? "정보 없음"}</td>)}</tr>)}</tbody>
            </table></div></section>;
}
