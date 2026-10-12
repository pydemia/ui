import { useState } from "react";
import { PrismProfile, PrismFavoriteCandidateCard, PrismFavoriteCandidateGrid, PrismFavoriteCandidateSkeleton,
    PrismEvaluationHistory, PrismRequestState, PrismBasicInfo, PrismCareerTimeline, PrismEvidence, PrismSummaryBadge, PrismCompetenceMatrix,
    type PrismCandidate, type PrismProfileTab } from "@pydemia/prism";
import type { FixtureState } from "./catalog";

const syntheticPhoto = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="132" height="180" viewBox="0 0 132 180"><rect width="132" height="180" fill="#d9d9d9"/><circle cx="66" cy="43" r="25" fill="#adb5bf"/><path d="M20 138v-23a46 46 0 0 1 92 0v23" fill="#adb5bf"/></svg>');
const base: PrismCandidate = { id: "synthetic-profile", name: "김가상", company: "가상전자", position: "기술전략담당", photo: syntheticPhoto,
    affiliation: "ICT 계열", jobFunction: "R&D/기술", birthDate: "1980.01", executiveYears: 3, elp: "ELP", expertAreas: ["기술", "전략"],
    recentEvaluations: [{ year: "2023", grade: "B" }, { year: "2025", grade: "(A)" }, { year: "2024", grade: null }] };

export function ProfileHeaderDemo({ state }: { state: FixtureState }) {
    const [tab, setTab] = useState<PrismProfileTab>("total"), [favorite, setFavorite] = useState(false), [result, setResult] = useState("");
    const [photo, setPhoto] = useState("present"), [favoriteBusy, setFavoriteBusy] = useState(state === "disabled"), [printBusy, setPrintBusy] = useState(state === "disabled");
    const [retried, setRetried] = useState(false);
    if (state === "error" && !retried) return <PrismRequestState status="error" onRetry={() => setRetried(true)}/>;
    const candidate: PrismCandidate = state === "empty" ? { id: base.id, name: base.name, company: "", position: "" }
        : { ...base, name: state === "long" ? "긴 이름을 가진 가상 후보자 프로필 확인 예시" : base.name, tenure: state === "long" ? "호스트가 제공한 임원 경력 표시" : undefined,
            position: state === "long" ? "긴 직책과 여러 조직명을 함께 제공한 가상 데이터입니다." : base.position,
            photo: photo === "present" ? syntheticPhoto : photo === "failed" ? "https://example.invalid/synthetic-photo.png" : undefined };
    return <div className="prism-demo-stack"><div className="prism-demo-row"><label>합성 사진 <select value={photo} onChange={event => setPhoto(event.target.value)}>
        <option value="present">제공됨</option><option value="missing">없음</option><option value="failed">로드 오류</option></select></label>
        <label><input type="checkbox" checked={favoriteBusy} onChange={event => setFavoriteBusy(event.target.checked)}/> 즐겨찾기 처리 중</label>
        <label><input type="checkbox" checked={printBusy} onChange={event => setPrintBusy(event.target.checked)}/> 출력 처리 중</label></div>
        <PrismProfile candidate={candidate} activeTab={tab} onTabChange={setTab} favorite={favorite} onFavoriteChange={setFavorite}
            loading={state === "loading"} readOnly={state === "readonly"} favoriteBusy={favoriteBusy} printBusy={printBusy}
            onComments={() => setResult("메모 열기 intent")} commentCount={0} onPrint={() => setResult("프로필 인쇄 intent")}
            sections={{ total: <div className="prism-demo-stack"><PrismBasicInfo items={[{ label: "최종 학력", value: "가상대학교 공학 석사" }]}/>
                <PrismCareerTimeline entries={[{ id: "synthetic-career", period: "2023~현재", company: "가상전자", role: "기술전략담당" }]}/></div>,
                expertise: <PrismEvidence title="전문성" grade={state === "empty" ? null : "A"}>합성 근거를 표시합니다.</PrismEvidence>,
                design: <div className="prism-demo-stack"><PrismSummaryBadge label="합성 등급" summary={state === "empty" ? null : "호스트가 제공한 역량 요약입니다."}/>
                    <PrismCompetenceMatrix columns={["전략", "기술"]} rows={[{ id: "synthetic-matrix", label: "합성 조직", values: [state === "empty" ? null : "A", null] }]}/></div> }}/>
        <p role="status">{result || "호스트 동작 대기"}</p>
    </div>;
}

export function FavoriteCandidateDemo({ state }: { state: FixtureState }) {
    const [favorites, setFavorites] = useState(["synthetic-0", "synthetic-1", "synthetic-2"]), [selected, setSelected] = useState("");
    const [width, setWidth] = useState(840), [busy, setBusy] = useState(false);
    const items: PrismCandidate[] = Array.from({ length: state === "empty" ? 0 : 3 }, (_, index) => ({ ...base, id: `synthetic-${index}`, name: state === "long" ? `가상 후보 ${index + 1}의 긴 이름과 상세 정보` : `${base.name} ${index + 1}`,
        expertAreas: state === "long" ? ["합성 전문 분야의 긴 설명을 제공한 검증 예시입니다.".repeat(8)] : base.expertAreas }));
    return <div className="prism-demo-stack"><div className="prism-demo-row"><label>그리드 너비 <input type="number" min={140} max={1200} value={width} onChange={event => setWidth(Math.max(140, Math.min(1200, Number(event.target.value) || 140)))}/></label>
        <label><input type="checkbox" checked={busy} onChange={event => setBusy(event.target.checked)}/> 즐겨찾기 처리 중</label></div>
        <PrismFavoriteCandidateGrid resize="both" style={{ width, height: state === "long" ? 320 : 440 }}>
            {state === "loading" ? [0,1,2].map(index => <PrismFavoriteCandidateSkeleton key={index}/>) : !items.length ? <p>호스트가 제공한 즐겨찾기 후보가 없습니다.</p>
                : items.map(candidate => <PrismFavoriteCandidateCard key={candidate.id} candidate={candidate} favorite={favorites.includes(candidate.id)} selected={selected === candidate.id}
                    favoriteBusy={busy} readOnly={state === "readonly"} onOpen={item => setSelected(item.id)} onFavoriteChange={next => setFavorites(ids => next ? [...ids, candidate.id] : ids.filter(id => id !== candidate.id))}/>)}</PrismFavoriteCandidateGrid>
        <p role="status">{selected ? `상세 열기 intent: ${selected}` : "호스트 동작 대기"}</p>
    </div>;
}

export function EvaluationHistoryDemo({ state }: { state: FixtureState }) {
    const [variant, setVariant] = useState<"source" | "explicit">("source");
    const items = state === "empty" ? [{ year: "2024", grade: null }] : state === "long" ? Array.from({ length: 12 }, (_, index) => ({ year: String(2014 + index), grade: index === 10 ? "(A)" : "B" })) : base.recentEvaluations!;
    return <div className="prism-demo-stack"><label>이력 표시 <select value={variant} onChange={event => setVariant(event.target.value as typeof variant)}><option value="source">원본 배지·연도 묶음</option><option value="explicit">연도별 개별값</option></select></label>
        <PrismEvaluationHistory items={items} variant={variant}/></div>;
}
