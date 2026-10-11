import { useRef, useState } from "react";
import { PrismCandidateList, PrismPdfDownloadHost, renderPrismProfilePdf, PrismDialog, PrismProfilePrintDocument, PrismProfilePrintViewport, PrismButton, PrismPrintButton,
    type PrismProfilePrintModel, type PrismCandidateFilters, type PrismDirectoryCandidate, type PrismCandidateOutputRequest, type PrismPdfExportJob } from "@pydemia/prism";
import type { FixtureState } from "./catalog";
import { createPrintFixture } from "./profile-print-demo";

type DemoProfile = { model: PrismProfilePrintModel; options: readonly string[] };
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
    const [files, setFiles] = useState<{ name: string; href: string }[]>([]), [printMessage, setPrintMessage] = useState("");
    const printRoot = useRef<HTMLDivElement>(null);
    const total = state === "empty" ? 0 : state === "long" ? 1100 : 40;
    const rows = state === "loading" ? [] : allRows.slice((page - 1) * pageSize, Math.min(page * pageSize, total)).map(row => state === "long" ? { ...row,
        name: `${row.name} 긴 이름 표시`, company: `${row.company} 조직과 계열사의 긴 명칭`.repeat(8), position: "여러 조직과 업무를 담당하는 긴 가상 직책".repeat(4) } : row);
    const prepare = async (request: PrismCandidateOutputRequest) => {
        setStatus(`${request.kind} 준비 ${request.candidateIds.length}명`);
        if (pause) { setWaiting(true); await new Promise<void>(resolve => { release.current.set(request.id, resolve); }); release.current.delete(request.id); setWaiting(release.current.size > 0); }
        if (fail) throw new Error("Synthetic preparation failure");
        const records = allRows.filter(row => request.candidateIds.includes(row.id));
        const omitted = exclude && records.length > 1 ? 1 : 0;
        const documents = records.slice(omitted).map(row => ({ filename: row.name, data: { model: {...createPrintFixture(false,false),id:row.id,candidate:row}, options: request.options } }));
        if (request.kind === "download" && documents.length) setJobs(value => [...value, { id: request.id, archiveName: "가상 후보자 프로필", documents }]);
        if (request.kind === "print") { setPrintMessage(""); setPrint(documents.map(document => document.data)); }
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
            const result=await renderPrismProfilePdf(profile.model,{signal,options:{summary:profile.options.includes("summary"),compensation:profile.options.includes("compensation")}});
            return result.blob;
        }} onProgress={(_, progress) => setStatus(`PDF 생성 ${progress.done}/${progress.total}`)} onComplete={(id, result) => { setStatus(`${result.filename} 다운로드 시작`); setJobs(value => value.filter(job => job.id !== id));
            if (result.blob) { const reader = new FileReader(); reader.onload = () => { if (typeof reader.result === "string") setFiles(value => [...value, { name: result.filename, href: reader.result as string }]); }; reader.readAsDataURL(result.blob); } }}
            onError={id => { setStatus("가상 PDF 생성 실패"); setJobs(value => value.filter(job => job.id !== id)); }}/>
        <PrismDialog open={print.length > 0} onOpenChange={open => { if (!open) setPrint([]); }} title="후보자 프로필 출력 미리보기" description="선택한 출력 옵션을 적용한 합성 프로필입니다." width={900}
            footer={<><PrismButton variant="line" onClick={() => setPrint([])}>닫기</PrismButton><PrismPrintButton getRoot={()=>printRoot.current} title="가상 후보자 프로필" onRequested={()=>setPrintMessage("인쇄를 요청했습니다.")} onAfterPrint={()=>setPrintMessage("인쇄 요청 처리가 끝났습니다.")} onError={()=>setPrintMessage("인쇄 문서 준비 실패")}/></>}>
            <p role="status" data-prism-export-exclude>{printMessage}</p><PrismProfilePrintViewport style={{height:650}}><div ref={printRoot}>{print.map(profile => <PrismProfilePrintDocument key={profile.model.id} model={profile.model} options={{summary:profile.options.includes("summary"),compensation:profile.options.includes("compensation")}}/>)}</div></PrismProfilePrintViewport>
        </PrismDialog>
    </div>;
}
