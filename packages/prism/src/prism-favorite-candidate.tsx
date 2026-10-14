import { useId, type CSSProperties, type ReactNode } from "react";
import { PrismCandidatePortrait, type PrismCandidate } from "./prism-candidate";
import { PrismElpBadge } from "./prism-badge";
import { PrismAffiliateLogo, PrismFavoriteToggle, PrismSkeleton } from "./prism-primitives";
import { PrismEvaluationHistory, preparePrismEvaluationHistory } from "./prism-evaluation-history";

export type PrismFavoriteCandidateCardProps = {
    candidate: PrismCandidate; favorite?: boolean; selected?: boolean;
    onOpen?: (candidate: PrismCandidate) => void;
    onFavoriteChange?: (favorite: boolean) => void;
    favoriteBusy?: boolean; readOnly?: boolean; children?: ReactNode;
};
export type PrismFavoriteCandidateGridProps = {
    children: ReactNode; resize?: "none" | "horizontal" | "both";
    className?: string; style?: CSSProperties;
};
export function PrismFavoriteCandidateGrid({ children, resize = "none", className = "", style }: PrismFavoriteCandidateGridProps) {
    return <div className={`prism-favorite-candidate-viewport ${className}`} style={style} data-resize={resize === "none" ? undefined : resize}>
        <div className="prism-favorite-candidate-grid">{children}</div>
    </div>;
}
export function PrismFavoriteCandidateSkeleton({ announce = true }: { announce?: boolean }) {
    return <div className="prism-favorite-candidate-skeleton" role={announce ? "status" : undefined} aria-label={announce ? "즐겨찾기 후보를 불러오고 있습니다." : undefined} aria-hidden={!announce || undefined}>
        <PrismSkeleton width={70} height={70}/><PrismSkeleton width="60%" height={20}/><PrismSkeleton height={20}/>
    </div>;
}
/** Independent sibling buttons replace the source's nested button-like card. */
export function PrismFavoriteCandidateCard({ candidate, favorite = true, selected, onOpen, onFavoriteChange,
    favoriteBusy = false, readOnly = false, children }: PrismFavoriteCandidateCardProps) {
    const nameId = useId();
    const affiliation = candidate.affiliation ?? candidate.companyField;
    const jobFunction = candidate.jobFunction ?? candidate.domain;
    const areas = candidate.expertAreas ?? (candidate.speciality ? [candidate.speciality] : []);
    const evaluations = preparePrismEvaluationHistory(candidate.recentEvaluations ?? []);
    return <article className="prism-favorite-candidate-card" data-selected={selected || undefined} data-actionable={!!onOpen || undefined} aria-labelledby={nameId}>
        {onOpen && <button type="button" className="prism-favorite-candidate-open" aria-labelledby={nameId} onClick={() => onOpen(candidate)}/>}
        <div className="prism-favorite-candidate-profile"><div className="prism-favorite-candidate-photo-row">
            <PrismCandidatePortrait name={candidate.name} subjectId={candidate.id} src={candidate.photo} size={70}/>
            <PrismFavoriteToggle name={candidate.name} checked={favorite} disabled={favoriteBusy || readOnly || !onFavoriteChange} onCheckedChange={next => onFavoriteChange?.(next)}/>
        </div><div className="prism-favorite-candidate-info"><div className="prism-favorite-candidate-name"><strong id={nameId}>{candidate.name}</strong>{candidate.elp && <PrismElpBadge type={candidate.elp}/>}</div>
            {(affiliation || jobFunction) && <div className="prism-profile-department">{affiliation && <b>{affiliation}</b>}{affiliation && jobFunction && <span className="prism-profile-divider"/>}{jobFunction}</div>}
            {(candidate.company || candidate.position) && <div className="prism-favorite-candidate-position">{candidate.company && <PrismAffiliateLogo brand={candidate.brand} affiliate={candidate.company} size={12}/>}{candidate.position && <span>{candidate.position}</span>}</div>}
        </div></div><div className="prism-favorite-candidate-expertise">
            {areas.length > 0 && <section><h3>전문 분야</h3><p>{areas.join(", ")}</p></section>}
            {evaluations.length > 0 && <section><h3>최근 평가 이력</h3><PrismEvaluationHistory items={candidate.recentEvaluations ?? []}/></section>}
            {children}
        </div>
    </article>;
}
