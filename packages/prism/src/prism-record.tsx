import type { ReactNode } from "react";
import { PrismTable } from "./prism-display";
import { PrismOutline } from "./prism-profile";
import { PrismTextarea } from "./prism-field";
import { PrismButton } from "./prism-button";
import { PrismChip } from "./prism-badge";

export function PrismEvaluationHistory({ items }: { items: readonly { year: string; grade: string | null; active?: boolean }[] }) {
    return <div className="prism-evaluation-history">{items.length ? items.map((item,index) => <span key={`${item.year}-${index}`}><b data-active={item.active || undefined}>{item.grade ?? "--"}</b><small>{item.year}</small></span>) : <span>평가 이력이 없습니다.</span>}</div>;
}
export function PrismCompensationTable({ rows, unit = "백만원" }: { rows: readonly { id: string; year: string; cash: string | null; stock: string | null; total: string | null }[]; unit?: string }) {
    return <section className="prism-compensation"><header><h3>최근 보상 정보</h3><span>단위: {unit}</span></header><PrismTable caption="연도별 보상 정보"><thead><tr><th scope="col">연도</th><th scope="col">현금</th><th scope="col">주식</th><th scope="col">합계</th></tr></thead>
        <tbody>{rows.length ? rows.map(row => <tr key={row.id}><th scope="row">{row.year}</th><td>{row.cash ?? "정보 없음"}</td><td>{row.stock ?? "정보 없음"}</td><td>{row.total ?? "정보 없음"}</td></tr>) : <tr><td colSpan={4}>보상 정보가 없습니다.</td></tr>}</tbody></PrismTable></section>;
}
export function PrismValidationList({ title, items }: { title: string; items: readonly { id: string; label: string; status: "confirmed" | "conflicting" | "missing"; evidence?: ReactNode }[] }) {
    const labels = { confirmed:"확인",conflicting:"상충",missing:"근거 부족" };
    return <PrismOutline title={title}><ul className="prism-validation-list">{items.map(item => <li key={item.id}><div><strong>{item.label}</strong><PrismChip tone={item.status === "confirmed" ? "primary" : "warning"}>{labels[item.status]}</PrismChip></div>
        <p>{item.evidence ?? "검증 정보가 없습니다."}</p></li>)}</ul></PrismOutline>;
}
export function PrismExperienceCard({ title, area, period, company, children, grade }: { title: string; area: string; period?: string; company?: string; children: ReactNode; grade?: string | null }) {
    return <PrismOutline title={title} actions={<PrismChip>{area}</PrismChip>}><div className="prism-experience-meta">{company && <strong>{company}</strong>}{period && <span>{period}</span>}{grade !== undefined && <b>{grade ?? "미평가"}</b>}</div>
        <div className="prism-experience-body">{children}</div></PrismOutline>;
}
export function PrismCommentEditor({ label = "경영진 의견", value, onValueChange, onSave, onCancel, busy, error }: { label?: string; value: string;
    onValueChange: (value: string) => void; onSave: (value: string) => void; onCancel?: () => void; busy?: boolean; error?: string }) {
    return <form className="prism-comment-editor" onSubmit={e => { e.preventDefault(); if (!busy && value.trim()) onSave(value.trim()); }}>
        <PrismTextarea label={label} value={value} onChange={e => onValueChange(e.target.value)} disabled={busy} error={error} />
        <div>{onCancel && <PrismButton variant="line" disabled={busy} onClick={onCancel}>취소</PrismButton>}<PrismButton type="submit" disabled={busy || !value.trim()}>{busy ? "저장 중" : "저장"}</PrismButton></div></form>;
}
