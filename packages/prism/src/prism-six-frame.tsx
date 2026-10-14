import { useId, useState, type CSSProperties, type ReactNode } from "react";
import { PrismFormattedText } from "./prism-rich-text";

export type PrismFrameKey = "leaderType" | "expertise" | "successExperience" | "designCapability" | "learningAgility" | "derailmentRisk";
export type PrismFrameColumn = { id: string; label: ReactNode; values: Partial<Record<PrismFrameKey, ReactNode>> };
export type PrismSixFrameTableInput = { columns: readonly string[]; rows: readonly (readonly string[])[] };
const frameKeys: Record<string, PrismFrameKey> = {
    리더유형: "leaderType", 전문성: "expertise", 성공경험: "successExperience",
    design역량: "designCapability", learningagility: "learningAgility",
    "learningagility(global/ax)": "learningAgility", derailmentrisk: "derailmentRisk",
};
/** Map a source-style AI table to stable candidate columns; null lets the host use a generic table. */
export function preparePrismSixFrameColumns({ columns, rows }: PrismSixFrameTableInput): PrismFrameColumn[] | null {
    const values: Partial<Record<PrismFrameKey, readonly string[]>> = {};
    for (const [label = "", ...cells] of rows) {
        const normalized = label.replace(/<[^>]+>/g, "").replace(/\*/g, "").replace(/\s+/g, "").toLowerCase();
        const key = frameKeys[normalized];
        if (key) values[key] = cells;
    }
    if (!Object.keys(values).length) return null;
    return columns.slice(1).map((label, index) => ({
        id: `candidate-${index}`, label,
        values: Object.fromEntries((Object.keys(values) as PrismFrameKey[]).map(key => [key, values[key]?.[index] ?? null])) as Partial<Record<PrismFrameKey, ReactNode>>,
    }));
}
const rows: readonly { key: PrismFrameKey; label: string; group?: string; span?: number }[] = [
    { key: "leaderType", label: "리더 유형" }, { key: "expertise", label: "전문성", group: "경험", span: 2 },
    { key: "successExperience", label: "성공경험", group: "경험" }, { key: "designCapability", label: "Design 역량", group: "역량", span: 2 },
    { key: "learningAgility", label: "Learning Agility", group: "역량" }, { key: "derailmentRisk", label: "Derailment Risk", group: "자질", span: 1 },
];
export function PrismSixFrame({ columns, title = "6-frame 비교", panel = false, onAction }: { columns: readonly PrismFrameColumn[]; title?: string; panel?: boolean;
    onAction?: (kind: "profile" | "position" | "document", id: string) => void }) {
    const id = useId();
    const [scrolled, setScrolled] = useState(false);
    if (new Set(columns.map(c => c.id)).size !== columns.length) throw new Error("Six-frame column IDs must be unique.");
    const display = (value: ReactNode) => value === "" ? "-" : typeof value === "string"
        ? <PrismFormattedText source={value} inline panel={panel} onAction={onAction}/>
        : value ?? "정보 없음";
    return <section className="prism-six-frame" data-panel={panel || undefined} data-scrolled={scrolled || undefined}
        aria-labelledby={title ? id : undefined} aria-label={title ? undefined : "6-frame 비교"}>
        {title && <h2 id={id}>{title}</h2>}<div className="prism-six-scroll" role="region" aria-label={title || "6-frame 비교"} tabIndex={0}
            onScroll={event => setScrolled(event.currentTarget.scrollLeft > 0)}>
            <table style={{ "--prism-cols": columns.length } as CSSProperties}><caption className="prism-sr-only">{title}</caption>
                <colgroup><col className="prism-six-group-col" /><col className="prism-six-label-col" />{columns.map(c => <col key={c.id} />)}</colgroup>
                <thead><tr><th colSpan={2} className="prism-six-fixed" scope="colgroup">구분</th>{columns.map(c => <th scope="col" key={c.id}>{display(c.label)}</th>)}</tr></thead>
                <tbody>{!columns.length ? <tr><td colSpan={2}>비교할 후보가 없습니다.</td></tr> : rows.map(row => <tr key={row.key}>{!row.group ? <th colSpan={2} scope="row" className="prism-six-fixed">{row.label}</th> : <>
                    {row.span && <th rowSpan={row.span} scope="rowgroup" className="prism-six-fixed">{row.group}</th>}
                    <th scope="row" className="prism-six-label">{row.label}</th></>}
                    {columns.map(c => <td key={c.id}>{display(c.values[row.key])}</td>)}</tr>)}</tbody>
            </table></div></section>;
}
