import type { ReactNode } from "react";
import { PrismDetailList } from "./prism-detail";
import { PrismAffiliateLogo, PrismSkeleton } from "./prism-primitives";
import { PrismRequestState } from "./prism-feedback";

export type PrismRequirementGroup = { id: string; title: string; items: readonly { id: string; title?: string; content: string | null }[] };
export function PrismPositionHeader({ company, brand, role, items }: { company: string; brand?: string; role: string; items: readonly { label: string; value: ReactNode }[] }) {
    return <header className="prism-position-header"><div><PrismAffiliateLogo brand={brand} affiliate={company} size={16} /><h2>{role}</h2></div><PrismDetailList items={items} /></header>;
}
export function PrismPositionRequirements({ group }: { group: PrismRequirementGroup }) {
    return <article className="prism-requirement"><header><h3>{group.title}</h3></header><div>{group.items.length ? group.items.map(item => <section key={item.id}>{item.title && <h4>{item.title}</h4>}<p className={item.content?.trim() ? undefined : "prism-no-data"}>{item.content?.trim() ? item.content : "관련 데이터 없음"}</p></section>) : <p className="prism-no-data">관련 데이터 없음</p>}</div></article>;
}

export const prismPositionFootnote = "※ 역량(Design 역량, Learning Agility)과 자질(Attitude, Leadership)은 모든 임원 포지션에 공통적으로 요구되는 기본 요소로 포지션별로 구체화/차별화하여 기술하지 않음. 다만, 후보 추천 시, 후보자가 보유한 역량 등급 및 후보자가 보유한 Derailment Risk에 따라 포지션 적합 우선순위 판정에 활용함.";
export type PrismPositionDetailProps = {
    company: string; role: string; brand?: string;
    items: readonly { label: string; value: ReactNode }[];
    definition?: string | null; businessContext?: string | null;
    groups: readonly PrismRequirementGroup[];
    footnote?: ReactNode;
    status?: "ready" | "loading" | "error"; onRetry?: () => void;
};
function PositionSummary({ title, text, context }: { title: string; text?: string | null; context?: boolean }) {
    return <section className="prism-position-section"><h3>{title}</h3>{text?.trim()
        ? <div className={`prism-position-summary ${context ? "prism-position-context" : ""}`}><p>{text}</p></div>
        : <div className="prism-position-summary-empty"><p className="prism-no-data">관련 데이터 없음</p></div>}</section>;
}
export function PrismPositionDetailSkeleton() {
    return <div className="prism-position-skeleton" role="status" aria-label="포지션 정보를 불러오고 있습니다."><div className="prism-position-header" aria-hidden="true">
        <PrismSkeleton width={120} height={22}/><div className="prism-position-skeleton-infos">{[0, 1, 2].map(index => <PrismSkeleton key={index} height={47} radius={8}/>)}</div>
    </div><div className="prism-position-scroll" aria-hidden="true">{[0, 1, 2].map(index => <section key={index} className="prism-position-skeleton-section">
        <PrismSkeleton width={index === 2 ? 160 : 100} height={20}/><PrismSkeleton height={index === 2 ? 180 : 120} radius={12}/>
        {index === 2 && <PrismSkeleton height={180} radius={12}/>}
    </section>)}</div></div>;
}
/** Data, LIVE/draft selection and stale-request cancellation belong to the host. */
export function PrismPositionDetail({ company, role, brand, items, groups, definition, businessContext,
    footnote = prismPositionFootnote, status = "ready", onRetry }: PrismPositionDetailProps) {
    const emptyGroups: readonly PrismRequirementGroup[] = [{ id: "expertise", title: "전문성", items: [] }, { id: "experience", title: "성공경험", items: [] }];
    return <div className="prism-position-detail">{status === "loading" ? <PrismPositionDetailSkeleton/>
        : status === "error" ? <div className="prism-position-fallback"><PrismRequestState status="error" onRetry={onRetry}/></div>
        : <><PrismPositionHeader company={company} brand={brand} role={role} items={items}/><div className="prism-position-scroll">
            <PositionSummary title="포지션 정의" text={definition}/>
            <PositionSummary title="Business Context" text={businessContext} context/>
            <section className="prism-position-section"><h3>전문성・성공경험 요구사항</h3><div className="prism-position-groups">
                {(groups.length ? groups : emptyGroups).map(group => <PrismPositionRequirements key={group.id} group={group}/>)}</div></section>
            {footnote && <p className="prism-position-footnote">{footnote}</p>}
        </div></>}</div>;
}
