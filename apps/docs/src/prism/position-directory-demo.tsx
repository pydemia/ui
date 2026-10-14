import { useState } from "react";
import { PrismPositionDirectory, PrismPositionDetail, createPrismPositionDirectoryQuery, createPrismPositionDirectoryState,
    type PrismPositionDirectoryRow, type PrismPositionDirectoryState } from "@pydemia/prism";

type Mode = "default" | "loading" | "refreshing" | "empty" | "error" | "long";
const companies = [{ value: "example", label: "가상전자" }, { value: "sample", label: "예시서비스" }];
const industries = [{ value: "technology", label: "기술" }, { value: "service", label: "서비스" }];
const sourceRows: PrismPositionDirectoryRow[] = Array.from({ length: 24 }, (_, index) => ({
    id: `synthetic-position-${index + 1}`,
    company: index % 2 ? "예시서비스" : "가상전자",
    name: index % 2 ? `서비스 운영 담당 ${index + 1}` : `기술전략 담당 ${index + 1}`,
    industry: index % 2 ? "서비스" : "기술",
    job: index % 2 ? "운영·기획" : "연구개발·전략",
    role: index % 3 ? "담당" : "본부장",
}));

/** Synthetic consumer with host-owned filtering, paging, sorting and detail content. */
export function PositionDirectoryExample({ initialMode = "default" }: { initialMode?: Mode }) {
    const [state, setState] = useState<PrismPositionDirectoryState>(createPrismPositionDirectoryState);
    const [mode, setMode] = useState<Mode>(initialMode);
    const query = createPrismPositionDirectoryQuery(state);
    const filtered = mode === "empty" ? [] : sourceRows.filter(row =>
        (!query.company_id?.length || row.company === companies.find(option => option.value === query.company_id?.[0])?.label) &&
        (!query.industry_block_id.length || query.industry_block_id.some(id => row.industry === industries.find(option => option.value === id)?.label)) &&
        (!query.name || row.name.includes(query.name)));
    const sorted = [...filtered];
    if (state.sort) {
        const { column, direction } = state.sort;
        sorted.sort((a, b) => (direction === "asc" ? 1 : -1) * a[column].localeCompare(b[column], "ko"));
    }
    const pageCount = Math.max(1, Math.ceil(sorted.length / query.size));
    const rows = sorted.slice((query.page - 1) * query.size, query.page * query.size).map(row => mode === "long" ? {
        ...row, name: `${row.name} · 아주 긴 합성 포지션 이름의 말줄임과 표 크기 조절 확인`,
    } : row);
    return <div data-prism="light" style={{ height: 620, minWidth: 0 }}>
        <PrismPositionDirectory state={state} onStateChange={setState} companies={companies} industries={industries}
            rows={mode === "loading" ? [] : rows} total={mode === "loading" ? 0 : sorted.length} pageCount={pageCount} status={mode === "loading" || mode === "refreshing" ? "loading" : mode === "error" ? "error" : "ready"}
            onRetry={() => { setState(createPrismPositionDirectoryState()); setMode("default"); }}
            renderDetail={tab => <PrismPositionDetail company={tab.company} role={tab.name}
                items={[{ label: "산업", value: "기술" }, { label: "직무", value: "연구개발·전략" }, { label: "직책", value: "담당" }]}
                definition="가상 포지션의 기술 전략을 수립합니다." businessContext="독립 설치 예제의 합성 데이터입니다."
                groups={[{ id: "expertise", title: "전문성", items: [{ id: "expertise-item", content: "기술 전략 수립" }] },
                    { id: "experience", title: "성공경험", items: [{ id: "experience-item", content: "협업 경험" }] }]}/>}/>
    </div>;
}
