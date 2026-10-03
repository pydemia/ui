import type { ReactNode } from "react";
import { PrismDetailList } from "./prism-detail";
import { PrismAffiliateLogo } from "./prism-primitives";
import { PrismRequestState } from "./prism-feedback";

export type PrismRequirementGroup = { id: string; title: string; items: readonly { id: string; title?: string; content: string | null }[] };
export function PrismPositionHeader({ company, brand, role, items }: { company: string; brand?: string; role: string; items: readonly { label: string; value: ReactNode }[] }) {
    return <header className="prism-position-header"><div><PrismAffiliateLogo brand={brand} affiliate={company} size={16} /><h2>{role}</h2></div><PrismDetailList items={items} /></header>;
}
export function PrismPositionRequirements({ group }: { group: PrismRequirementGroup }) {
    return <article className="prism-requirement"><header><h3>{group.title}</h3></header><div>{group.items.length ? group.items.map(item => <section key={item.id}>{item.title && <h4>{item.title}</h4>}<p>{item.content ?? "관련 데이터 없음"}</p></section>) : <p className="prism-no-data">관련 데이터 없음</p>}</div></article>;
}
export function PrismPositionDetail({ company, role, brand, items, groups, status = "ready", onRetry }: { company: string; role: string; brand?: string; items: readonly { label: string; value: ReactNode }[];
    groups: readonly PrismRequirementGroup[]; status?: "ready" | "loading" | "error"; onRetry?: () => void }) {
    if (status !== "ready") return <PrismRequestState status={status} onRetry={onRetry} />;
    return <div className="prism-position-detail"><PrismPositionHeader company={company} brand={brand} role={role} items={items} /><div>{groups.map(group => <PrismPositionRequirements key={group.id} group={group} />)}</div></div>;
}
