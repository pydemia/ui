import { useEffect, useRef, useState } from "react";
import { PrismCandidateList, PrismPdfDownloadHost, createPrismImagePdf, PrismDialog, PrismPrintPage, PrismPrintCareer, PrismButton,
    type PrismCandidateFilters, type PrismDirectoryCandidate, type PrismCandidateOutputRequest, type PrismPdfExportJob } from "@pydemia/prism";
import type { FixtureState } from "./catalog";

type DemoProfile = { name: string; company: string; position: string; options: readonly string[] };
const allRows: PrismDirectoryCandidate[] = Array.from({ length: 1100 }, (_, index) => ({ id: `demo-${index + 1}`, name: `가상후보 ${index + 1}`,
    company: index % 2 ? "예시사업" : "가상전자", position: "가상 기술전략담당", series: "제조", favorite: index === 0 }));
export function CandidateListDemo({ state }: { state: FixtureState }) {
    const [selected, setSelected] = useState<string[]>(state === "long" ? allRows.slice(0, 99).map(row => row.id) : []);
    const [filters, setFilters] = useState<PrismCandidateFilters>({ series: "all", companies: [], name: "" });
    const [sort, setSort] = useState<{ column: string; direction: "asc" | "desc" } | null>(null);
    const [page, setPage] = useState(state === "long" ? 2 : 1), [pageSize, setPageSize] = useState(state === "long" ? 100 : 10);
    const [width, setWidth] = useState(1000), [height, setHeight] = useState(650);
    const [pause, setPause] = useState(false), release = useRef(new Map<string, () => void>()), [waiting, setWaiting] = useState(false);
    const [fail, setFail] = useState(false), [shown, setShown] = useState(true), [error, setError] = useState(state === "error");
    const [exclude, setExclude] = useState(false), [status, setStatus] = useState("");
    const [jobs, setJobs] = useState<PrismPdfExportJob<DemoProfile>[]>([]), [print, setPrint] = useState<DemoProfile[]>([]);
    const [files, setFiles] = useState<{ name: string; href: string }[]>([]);
    useEffect(() => { if (print.length) void document.fonts.ready.then(() => window.print()); }, [print]);
    const total = state === "empty" ? 0 : state === "long" ? 1100 : 40;
    const rows = state === "loading" ? [] : allRows.slice((page - 1) * pageSize, Math.min(page * pageSize, total)).map(row => state === "long" ? { ...row,
        name: `${row.name} 긴 이름 표시`, company: `${row.company} 조직과 계열사의 긴 명칭`.repeat(8), position: "여러 조직과 업무를 담당하는 긴 가상 직책".repeat(4) } : row);
    const prepare = async (request: PrismCandidateOutputRequest) => {
        setStatus(`${request.kind} 준비 ${request.candidateIds.length}명`);
        if (pause) { setWaiting(true); await new Promise<void>(resolve => { release.current.set(request.id, resolve); }); release.current.delete(request.id); setWaiting(release.current.size > 0); }
        if (fail) throw new Error("Synthetic preparation failure");
        const records = allRows.filter(row => request.candidateIds.includes(row.id));
        const omitted = exclude && records.length > 1 ? 1 : 0;
        const documents = records.slice(omitted).map(row => ({ filename: row.name, data: { name: row.name, company: row.company, position: row.position, options: request.options } }));
        if (request.kind === "download" && documents.length) setJobs(value => [...value, { id: request.id, archiveName: "가상 후보자 프로필", documents }]);
        if (request.kind === "print") setPrint(documents.map(document => document.data));
        return { preparedCount: documents.length, excludedCount: request.candidateIds.length - documents.length };
    };
    return <div className="prism-demo-stack">
        <div className="prism-demo-row"><label>목록 너비 <input type="number" aria-label="목록 너비" min={140} max={1280} value={width} onChange={event => setWidth(Math.max(140, Math.min(1280, Number(event.target.value) || 140)))}/></label>
            <label>목록 높이 <input type="number" aria-label="목록 높이" min={240} max={1000} value={height} onChange={event => setHeight(Math.max(240, Math.min(1000, Number(event.target.value) || 240)))}/></label></div>
        <div className="prism-demo-row"><label><input type="checkbox" checked={pause} onChange={event => setPause(event.target.checked)}/> 출력 준비 대기</label>
            <label><input type="checkbox" checked={fail} onChange={event => setFail(event.target.checked)}/> 준비 실패</label>
            <label><input type="checkbox" checked={exclude} onChange={event => setExclude(event.target.checked)}/> 일부 대상 제외</label>
            <label><input type="checkbox" checked={shown} onChange={event => setShown(event.target.checked)}/> 목록 표시</label>
            {waiting && <PrismButton onClick={() => release.current.forEach(resolve => resolve())}>준비 계속</PrismButton>}</div>
        {shown && <div style={{ width: "100%", maxWidth: width }}><PrismCandidateList rows={rows} selected={selected} onSelectionChange={setSelected} sort={sort} onSortChange={setSort}
            onOpen={row => setStatus(`${row.name} 상세 조회 의도`)} filters={{ value: filters, onValueChange: setFilters, seriesOptions: [{ value: "all", label: "전체" }, { value: "manufacturing", label: "제조" }],
                companyOptions: [{ value: "a", label: "가상전자" }, { value: "b", label: "예시사업" }], onSearch: () => { setPage(1); setStatus("가상 조회 의도"); }, onReset: () => { setPage(1); setFilters({ series: "all", companies: [], name: "" }); setStatus("가상 초기화 의도"); } }}
            total={total} page={page} pageCount={Math.max(1, Math.ceil(total / pageSize))} onPageChange={setPage} rowsPerPage={pageSize} onRowsPerPageChange={value => { setPage(1); setPageSize(value); }}
            height={height} status={error ? "error" : state === "loading" ? "loading" : "ready"} onRetry={() => setError(false)} readOnly={state === "readonly"} onOutput={prepare}/></div>}
        <p role="status">{status}</p>
        {files.length > 0 && <div className="prism-demo-stack">{files.map((file, index) => <a key={index} href={file.href} download={file.name}>완료된 파일: {file.name}</a>)}</div>}
        <PrismPdfDownloadHost jobs={jobs} renderPdf={async (profile, { signal }) => {
            await document.fonts.ready; signal.throwIfAborted();
            const canvas = document.createElement("canvas"); canvas.width = 800; canvas.height = 1100;
            const ctx = canvas.getContext("2d"); if (!ctx) throw new Error("Canvas unavailable");
            ctx.fillStyle = "white"; ctx.fillRect(0, 0, 800, 1100); ctx.fillStyle = "#363636"; ctx.font = '24px "Pretendard Variable", sans-serif';
            [profile.name, profile.company, profile.position, ...profile.options.map(value => value === "summary" ? "가상 종합 요약 정보" : "가상 보상 정보")].forEach((line, index) => ctx.fillText(line, 50, 80 + index * 40));
            return createPrismImagePdf([{ jpeg: canvas.toDataURL("image/jpeg"), width: 210, height: 297 }], { signal, title: profile.name });
        }} onProgress={(_, progress) => setStatus(`PDF 생성 ${progress.done}/${progress.total}`)} onComplete={(id, result) => { setStatus(`${result.filename} 다운로드 시작`); setJobs(value => value.filter(job => job.id !== id));
            if (result.blob) { const reader = new FileReader(); reader.onload = () => { if (typeof reader.result === "string") setFiles(value => [...value, { name: result.filename, href: reader.result as string }]); }; reader.readAsDataURL(result.blob); } }}
            onError={id => { setStatus("가상 PDF 생성 실패"); setJobs(value => value.filter(job => job.id !== id)); }}/>
        <PrismDialog open={print.length > 0} onOpenChange={open => { if (!open) setPrint([]); }} title="후보자 프로필 출력 미리보기" description="합성 프로필입니다. 네이티브 인쇄는 소비자가 연결합니다." width={900}
            footer={<><PrismButton variant="line" onClick={() => setPrint([])}>닫기</PrismButton><PrismButton onClick={() => window.print()}>인쇄</PrismButton></>}>
            <div style={{ overflow: "auto" }}>{print.map(profile => <PrismPrintPage key={profile.name} name={profile.name} jobTitle={profile.position}>
                <PrismPrintCareer items={[{ id: "example", period: "2024 ~ 현재", company: profile.company, role: profile.position }]}/></PrismPrintPage>)}</div>
        </PrismDialog>
    </div>;
}
