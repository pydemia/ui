import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { PrismCandidateFilterBar, type PrismCandidateFilterBarProps } from "./prism-collection";
import { PrismCandidateDirectory, type PrismCandidateDirectoryProps } from "./prism-directory";
import { PrismButton } from "./prism-button";
import { PrismSelect } from "./prism-field";
import { PrismPagination } from "./prism-selection";
import { PrismPrintOptions } from "./prism-document";
import { PrismConfirmDialog } from "./prism-dialog";
import { PrismRequestState, PrismToast } from "./prism-feedback";
import { PrismIcon } from "./prism-icon";
import type { PrismPdfExportDocument, PrismPdfExportJob } from "./prism-export";

export type PrismCandidateOutputKind = "download" | "print";
export type PrismCandidateOutputOption = "summary" | "compensation";
export type PrismCandidateOutputRequest = {
    readonly id: string;
    readonly kind: PrismCandidateOutputKind;
    readonly candidateIds: readonly string[];
    readonly options: readonly PrismCandidateOutputOption[];
};
export type PrismCandidateOutputResult = { preparedCount: number; excludedCount?: number };
export function createPrismCandidateDownloadJob<T>(request: PrismCandidateOutputRequest, documents: readonly PrismPdfExportDocument<T>[], archiveName = "후보자 프로필"): PrismPdfExportJob<T> {
    if (request.kind !== "download" || !documents.length || documents.length > request.candidateIds.length) throw new RangeError("A candidate download job requires prepared documents for its selected candidates.");
    return Object.freeze({ id: request.id, archiveName, documents: Object.freeze(documents.map(document => Object.freeze({ ...document }))) });
}
export type PrismCandidateListProps = Omit<PrismCandidateDirectoryProps, "loading"> & {
    filters: PrismCandidateFilterBarProps;
    total: number; page: number; pageCount: number; onPageChange: (page: number) => void;
    rowsPerPage: number; onRowsPerPageChange: (size: number) => void; rowsPerPageOptions?: readonly number[];
    maxSelected?: number; status?: "ready" | "loading" | "error"; onRetry?: () => void;
    onOutput: (request: PrismCandidateOutputRequest) => Promise<PrismCandidateOutputResult>;
    height?: CSSProperties["height"]; style?: CSSProperties; className?: string;
};
type Feedback = { message: string; tone: "info" | "error"; retry?: PrismCandidateOutputRequest };
const outputSections = [{ id: "summary", label: "종합 요약 정보", content: null }, { id: "compensation", label: "보상 정보", content: null }] as const;

/** The application owns preparation and output jobs; unmount only stops local feedback. */
export function PrismCandidateList({ filters, total, page, pageCount, onPageChange, rowsPerPage, onRowsPerPageChange,
    rowsPerPageOptions = [10, 20, 50, 100], maxSelected = 100, status = "ready", onRetry, onOutput,
    readOnly = false, height = "100%", style, className = "", ...directory }: PrismCandidateListProps) {
    if (!Number.isSafeInteger(total) || total < 0 || !Number.isSafeInteger(maxSelected) || maxSelected < 1 ||
        !rowsPerPageOptions.length || rowsPerPageOptions.some(size => !Number.isSafeInteger(size) || size < 1) || !rowsPerPageOptions.includes(rowsPerPage)) {
        throw new RangeError("Candidate counts, selection limit and page sizes must be valid positive integers.");
    }
    const instance = useId(), sequence = useRef(0), mounted = useRef(false);
    const pending = useRef({ download: false, print: false });
    const [busy, setBusy] = useState({ download: false, print: false });
    const [mode, setMode] = useState<PrismCandidateOutputKind | null>(null);
    const [options, setOptions] = useState<PrismCandidateOutputOption[]>([]);
    const [confirmation, setConfirmation] = useState<{ kind: "limit" } | { kind: "preparing"; output: PrismCandidateOutputKind } | null>(null);
    const [feedback, setFeedback] = useState<Feedback | null>(null);
    useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
    const showLimit = () => setConfirmation({ kind: "limit" });
    const changeSelection = (next: string[]) => {
        if (readOnly) return;
        const unique = [...new Set(next)];
        if (unique.length > maxSelected) showLimit(); else directory.onSelectionChange(unique);
    };
    const openOptions = (kind: PrismCandidateOutputKind) => {
        if (readOnly || pending.current[kind]) return;
        if (!directory.selected.length) { setFeedback({ message: "선택된 후보자 없음", tone: "error" }); return; }
        if (new Set(directory.selected).size > maxSelected) { showLimit(); return; }
        setOptions([]); setMode(kind);
    };
    const execute = async (request: PrismCandidateOutputRequest) => {
        if (readOnly || pending.current[request.kind]) return;
        pending.current[request.kind] = true;
        setBusy(value => ({ ...value, [request.kind]: true })); setFeedback(null);
        setConfirmation({ kind: "preparing", output: request.kind });
        const action = request.kind === "download" ? "다운로드" : "인쇄";
        try {
            const result = await onOutput(request), excluded = result.excludedCount ?? 0;
            if (!Number.isSafeInteger(result.preparedCount) || result.preparedCount < 0 || !Number.isSafeInteger(excluded) || excluded < 0 || result.preparedCount + excluded > request.candidateIds.length) {
                throw new RangeError("Output counts must describe the requested candidates.");
            }
            if (!mounted.current) return;
            if (!result.preparedCount) setFeedback({ message: `${action}할 프로필 데이터를 찾을 수 없습니다.`, tone: "error", retry: request });
            else if (excluded) setFeedback({ message: `일부 후보자(${excluded}명)는 ${action} 대상에서 제외되었습니다.`, tone: "info" });
        } catch {
            if (mounted.current) setFeedback({ message: `${action} 프로필을 불러오는 중 오류가 발생했습니다.`, tone: "error", retry: request });
        } finally {
            pending.current[request.kind] = false;
            if (mounted.current) setBusy(value => ({ ...value, [request.kind]: false }));
        }
    };
    const submit = () => {
        if (!mode || readOnly || pending.current[mode]) return;
        const ids = [...new Set(directory.selected)];
        setMode(null);
        if (!ids.length) { setFeedback({ message: "선택된 후보자 없음", tone: "error" }); return; }
        if (ids.length > maxSelected) { showLimit(); return; }
        const request: PrismCandidateOutputRequest = Object.freeze({ id: `${instance}-${++sequence.current}`, kind: mode,
            candidateIds: Object.freeze(ids), options: Object.freeze(outputSections.filter(section => options.includes(section.id)).map(section => section.id)) });
        void execute(request);
    };
    const retry = (request: PrismCandidateOutputRequest) => {
        void execute(Object.freeze({ ...request, id: `${instance}-${++sequence.current}` }));
    };
    return <section className={`prism-candidate-list ${className}`} style={{ height, ...style }} tabIndex={0} aria-label="후보 목록 작업">
        <PrismCandidateFilterBar {...filters} disabled={filters.disabled || readOnly}
            onSearch={value => { directory.onSelectionChange([]); filters.onSearch(value); }}
            onReset={() => { directory.onSelectionChange([]); filters.onReset(); }}/>
        <div className="prism-candidate-toolbar"><div className="prism-candidate-toolbar-info">
            <div className="prism-candidate-summary"><span>총 {total}건</span><span aria-hidden="true">·</span><span>선택 {new Set(directory.selected).size}건</span></div>
            <div className="prism-candidate-page-size"><PrismSelect label="페이지당 후보자 수" size="small" value={String(rowsPerPage)} readOnly={readOnly}
                options={rowsPerPageOptions.map(size => ({ value: String(size), label: `${size} / page` }))} onChange={event => onRowsPerPageChange(Number(event.target.value))}/></div>
        </div><div className="prism-candidate-toolbar-actions">
            <PrismButton variant="line" size="small" icon={<PrismIcon name="DownloadIcon" size={20}/>} disabled={readOnly || busy.download} onClick={() => openOptions("download")}>다운로드</PrismButton>
            <PrismButton size="small" icon={<PrismIcon name="PrintIcon" size={20}/>} disabled={readOnly || busy.print} onClick={() => openOptions("print")}>프린트</PrismButton>
        </div></div>
        {feedback && <div className="prism-candidate-feedback"><PrismToast tone={feedback.tone} title={feedback.message} onClose={() => setFeedback(null)}>
            {feedback.retry && <PrismButton variant="shape" size="small" disabled={readOnly || busy[feedback.retry.kind]} onClick={() => retry(feedback.retry!)}>다시 시도</PrismButton>}
        </PrismToast></div>}
        {status === "error" ? <PrismRequestState status="error" onRetry={onRetry}/> : <PrismCandidateDirectory {...directory} readOnly={readOnly}
            loading={status === "loading" && !directory.rows.length} onSelectionChange={changeSelection}/>}
        {total > 0 && <div className="prism-candidate-pagination"><PrismPagination page={page} pageCount={Math.max(1, pageCount)} onPageChange={onPageChange} disabled={readOnly} pageButtonCount={10}/></div>}
        <PrismPrintOptions sections={outputSections} value={options} onValueChange={next => setOptions(next.filter((value): value is PrismCandidateOutputOption => value === "summary" || value === "compensation"))}
            onConfirm={submit} open={mode !== null} onOpenChange={open => { if (!open) setMode(null); }} title={mode === "download" ? "다운로드 정보 선택" : "출력 정보 선택"}
            description={mode === "download" ? "다운로드할 정보를 선택해 주세요." : "출력할 정보를 선택해 주세요."} confirmLabel={mode === "download" ? "다운로드" : "출력"}/>
        <PrismConfirmDialog open={confirmation !== null} onOpenChange={open => { if (!open) setConfirmation(null); }} onConfirm={() => setConfirmation(null)} showCancel={false}
            contentMinHeight={confirmation?.kind === "limit" ? 50 : 123} content={confirmation?.kind === "limit" ? `후보자는 최대 ${maxSelected}명까지 선택할 수 있습니다.` : <>
                선택한 후보자 프로필 파일을 생성하고 있습니다.<br/>파일 생성이 완료되면, 자동으로 {confirmation?.kind === "preparing" && confirmation.output === "download" ? "다운로드" : "프린트"}가 시작됩니다.
                <span className="prism-candidate-confirm-note">※ 선택한 인원이 많은 경우, 시간이 다소 소요될 수 있습니다.</span>
            </>}/>
    </section>;
}
