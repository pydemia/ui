import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import type { PDFViewer as NativePdfViewer } from "pdfjs-dist/web/pdf_viewer.mjs";
import { PrismIcon } from "./prism-icon";
import { PrismButton } from "./prism-button";
import { PrismDialog } from "./prism-dialog";
import { PrismCheckbox } from "./prism-selection";
import { PrismTooltip } from "./prism-utility";

export type PrismPdfBytes = ArrayBuffer | Uint8Array;
export type PrismPdfLoadContext = Readonly<{ signal: AbortSignal }>;
export type PrismPdfLoader = (url: string, context: PrismPdfLoadContext) => Promise<PrismPdfBytes>;
export type PrismPdfDownloadContext = Readonly<{ url?: string; filename: string; data: Uint8Array | null; status: "loading" | "ready" | "error" }>;
/** Copies the view's exact byte range; PDF.js may transfer its input buffer. */
export function copyPrismPdfBytes(value: PrismPdfBytes): Uint8Array {
    const bytes = value instanceof Uint8Array ? Uint8Array.from(value) : new Uint8Array(value.slice(0));
    if (bytes.length < 4 || bytes[0] !== 0x25 || bytes[1] !== 0x50 || bytes[2] !== 0x44 || bytes[3] !== 0x46) throw new Error("PDF 형식이 아닙니다.");
    return bytes;
}
function abortable<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
    if (signal.aborted) return Promise.reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
    return new Promise((resolve, reject) => {
        const abort = () => reject(signal.reason ?? new DOMException("Aborted", "AbortError"));
        signal.addEventListener("abort", abort, { once: true });
        promise.then(resolve, reject).finally(() => signal.removeEventListener("abort", abort));
    });
}
/** Fallback destinations and authenticated fetch behavior are chosen by the host. */
export async function loadPrismPdfBytes(urls: readonly string[], { signal, fetcher = fetch }: { signal: AbortSignal; fetcher?: typeof fetch }): Promise<Uint8Array> {
    if (!urls.length || urls.some(url => !url.trim())) throw new Error("PDF 주소가 필요합니다.");
    let failure: unknown;
    for (const url of [...urls]) {
        signal.throwIfAborted();
        try { const response = await abortable(fetcher(url, { signal }), signal); if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const bytes = await abortable(response.arrayBuffer(), signal); signal.throwIfAborted(); return copyPrismPdfBytes(bytes);
        } catch (error) { signal.throwIfAborted(); failure = error; }
    }
    throw failure ?? new Error("PDF를 불러오지 못했습니다.");
}
export function prismPdfFilename(url: string) {
    const tail = url.split("?")[0].split("#")[0].split("/").pop();
    let name = tail || "문서.pdf"; try { name = decodeURIComponent(name); } catch { /* Preserve an undecodable display name. */ }
    name = name.replace(/[\u0000-\u001f\u007f/\\:*?"<>|]/g, "_").trim();
    return name || "문서.pdf";
}
export function startPrismPdfDownload({ data, url, filename }: PrismPdfDownloadContext) {
    if (data) { const blob = new Blob([Uint8Array.from(data).buffer], { type: "application/pdf" }), href = URL.createObjectURL(blob);
        const anchor = document.createElement("a"); anchor.href = href; anchor.download = filename; document.body.append(anchor); anchor.click(); anchor.remove();
        window.setTimeout(() => URL.revokeObjectURL(href), 60_000); return; }
    if (!url) throw new Error("다운로드할 문서가 없습니다.");
    const href = new URL(url, window.location.href);
    if (!["http:", "https:", "blob:"].includes(href.protocol)) throw new Error("문서 주소를 확인해 주세요.");
    const anchor = document.createElement("a"); anchor.href = href.href; anchor.target = "_blank"; anchor.rel = "noopener noreferrer"; document.body.append(anchor); anchor.click(); anchor.remove();
}
export type PrismPdfViewerProps = { workerUrl: string; title: string; filename?: string;
    onDownload?: (context: PrismPdfDownloadContext) => void | Promise<void>; height?: CSSProperties["height"]; minZoom?: number; maxZoom?: number;
    reloadKey?: string | number; className?: string; getErrorMessage?: (error: unknown, fallback: string) => string;
} & ({ url: string; data?: never; loadPdf?: PrismPdfLoader } | { data: PrismPdfBytes; url?: never; loadPdf?: never });
export function PrismPdfViewer({ url, data, loadPdf, workerUrl, title, filename, onDownload, height, minZoom = 30, maxZoom = 100, reloadKey, className = "", getErrorMessage }: PrismPdfViewerProps) {
    if (!Number.isFinite(minZoom) || !Number.isFinite(maxZoom) || minZoom <= 0 || minZoom > maxZoom) throw new RangeError("PDF zoom bounds must be positive with minZoom <= maxZoom.");
    const [pdf,setPdf] = useState<PDFDocumentProxy | null>(null); const [page,setPage] = useState(1); const [zoom,setZoom] = useState(100);
    const [fittedZoom,setFittedZoom] = useState(100);
    const [fit,setFit] = useState<"page" | "width" | null>("page"); const [status,setStatus] = useState<"loading" | "ready" | "error">("loading");
    const [bounds,setBounds] = useState({ width: 600,height: 500 }); const [retry,setRetry] = useState(0);
    const [pageDraft,setPageDraft] = useState<string | null>(null), [scaleDraft,setScaleDraft] = useState<string | null>(null), [downloadBusy,setDownloadBusy] = useState(false), [downloadError,setDownloadError] = useState("");
    const [loadError,setLoadError] = useState("");
    const describeLoadError = (error: unknown) => getErrorMessage?.(error,"문서를 표시하지 못했습니다.") || (error instanceof Error && (error.message === "PDF 형식이 아닙니다." || /^HTTP \d{3}$/.test(error.message)) ? `불러오지 못했습니다: ${error.message}` : "문서를 표시하지 못했습니다.");
    const bytes = useRef<Uint8Array | null>(null), loader = useRef(loadPdf), download = useRef<Promise<void> | null>(null), generation = useRef(0);
    useLayoutEffect(() => { loader.current = loadPdf; }, [loadPdf]);
    const pages = useRef<HTMLDivElement>(null), viewport = useRef<HTMLDivElement>(null), native = useRef<NativePdfViewer | null>(null);
    useEffect(() => { const element = viewport.current; if (!element) return; const measure=()=>setBounds({width:element.clientWidth,height:element.clientHeight});
        measure();const observer = new ResizeObserver(measure);observer.observe(element);return () => observer.disconnect(); },[]);
    useLayoutEffect(() => { let disposed = false; const controller = new AbortController(); let loading: ReturnType<typeof import("pdfjs-dist")["getDocument"]> | undefined;
        let viewer: NativePdfViewer | undefined; let removeEvents: (() => void) | undefined;
        generation.current++; bytes.current = null; download.current = null; setDownloadBusy(false); setDownloadError("");
        setStatus("loading"); setLoadError(""); setPdf(null); setPage(1); setFit("page"); setPageDraft(null); setScaleDraft(null);
        void (async () => {
            const loaded = data ?? await abortable(loader.current ? loader.current(url!, { signal: controller.signal }) : loadPrismPdfBytes([url!], { signal: controller.signal }), controller.signal);
            if (disposed) return; const copy = copyPrismPdfBytes(loaded); bytes.current = copy;
            const lib = await import("pdfjs-dist"); if (disposed) return; lib.GlobalWorkerOptions.workerSrc = workerUrl;
            loading = lib.getDocument({ data: Uint8Array.from(copy), disableRange: true, disableStream: true });
            const document = await loading.promise; if (disposed || !viewport.current || !pages.current) return;
            const web = await import("pdfjs-dist/web/pdf_viewer.mjs"); if (disposed) return;
            const bus = new web.EventBus(), links = new web.PDFLinkService({ eventBus: bus, externalLinkTarget: 2, externalLinkRel: "noopener noreferrer" });
            // Installed PDF.js supports abortSignal although its options declaration omits it.
            const options = { container: viewport.current, viewer: pages.current, eventBus: bus, linkService: links, abortSignal: controller.signal };
            viewer = new web.PDFViewer(options); native.current = viewer; links.setViewer(viewer); links.setDocument(document);
            const initialized = () => { if (!disposed && viewer) viewer.currentScaleValue = "page-fit"; };
            const rendered = (event: { error?: unknown }) => { if (!disposed) { if (event.error) setLoadError(describeLoadError(event.error)); setStatus(event.error ? "error" : "ready"); } };
            const pageChanged = (event: { pageNumber: number }) => { if (!disposed) setPage(event.pageNumber); };
            const scaleChanged = (event: { scale: number; presetValue?: string }) => { if (!disposed) { setFittedZoom(Math.round(event.scale*100)); setZoom(Math.round(event.scale*100)); setFit(event.presetValue === "page-width" ? "width" : event.presetValue === "page-fit" ? "page" : null); } };
            bus.on("pagesinit", initialized); bus.on("pagerendered", rendered); bus.on("pagechanging", pageChanged); bus.on("scalechanging", scaleChanged);
            removeEvents = () => { bus.off("pagesinit", initialized); bus.off("pagerendered", rendered); bus.off("pagechanging", pageChanged); bus.off("scalechanging", scaleChanged); };
            setPdf(document); viewer.setDocument(document);
        })().catch(error => { if (!disposed) { setLoadError(describeLoadError(error)); setStatus("error"); } });
        return () => { disposed = true; generation.current++; removeEvents?.();
            // Clearing a document with null is supported by the installed viewer runtime.
            viewer?.setDocument(null as unknown as PDFDocumentProxy); native.current = null; controller.abort(); bytes.current = null; void loading?.destroy().catch(() => {}); };
    },[url,data,workerUrl,retry,reloadKey]);
    useEffect(() => { if (native.current && fit) native.current.currentScaleValue = fit === "width" ? "page-width" : "page-fit"; },[bounds,fit]);
    const changeZoom = (next: number) => { if (!Number.isFinite(next) || !native.current) return; native.current.currentScale = Math.max(minZoom,Math.min(maxZoom,next))/100; };
    const commitPage = () => { if (pageDraft !== null) { const next = Number.parseInt(pageDraft,10); if (Number.isFinite(next) && pdf && native.current) native.current.currentPageNumber = Math.max(1,Math.min(pdf.numPages,next)); setPageDraft(null); } };
    const commitScale = () => { if (scaleDraft !== null) { const next = Number.parseInt(scaleDraft,10); if (Number.isFinite(next)) changeZoom(next); setScaleDraft(null); } };
    const percent = fit ? fittedZoom : zoom;
    const startDownload = () => {
        if (!onDownload || download.current) return; const started = generation.current; setDownloadBusy(true); setDownloadError("");
        const snapshot = Object.freeze({ url, filename: filename || prismPdfFilename(url ?? ""), data: bytes.current ? Uint8Array.from(bytes.current) : null, status });
        const job = Promise.resolve().then(() => onDownload(snapshot)); download.current = job;
        job.catch(error => { if (generation.current === started) setDownloadError(getErrorMessage?.(error, "다운로드하지 못했습니다.") || "다운로드하지 못했습니다."); })
            .finally(() => { if (generation.current === started && download.current === job) { download.current = null; setDownloadBusy(false); } });
    };
    return <section className={`prism-pdf ${className}`} aria-label={title} style={{height}} data-status={status}><div className="prism-pdf-toolbar">
        <div><input className="prism-pdf-page-field" type="text" inputMode="numeric" aria-label="페이지" value={pageDraft ?? String(page)} disabled={!pdf} onChange={e => setPageDraft(e.target.value)} onBlur={commitPage}
            onKeyDown={e => { if (e.key === "Enter" && !e.nativeEvent.isComposing) { e.preventDefault(); e.currentTarget.blur(); } }}/><span>/{pdf?.numPages ?? 0}</span></div>
        <div><PrismButton variant="line" size="small" iconOnly aria-label="축소" icon={<PrismIcon name="ZoomOutIcon"/>} onClick={() => changeZoom(percent % 10 === 0 ? percent-10 : Math.floor(percent/10)*10)} disabled={!pdf}/>
            <input className="prism-pdf-scale-field" type="text" inputMode="numeric" aria-label="배율" value={scaleDraft ?? `${percent}%`} onChange={e => setScaleDraft(e.target.value)} onBlur={commitScale} disabled={!pdf}
                onKeyDown={e => { if (e.key === "Enter" && !e.nativeEvent.isComposing) { e.preventDefault(); e.currentTarget.blur(); } }}/>
            <PrismButton variant="line" size="small" iconOnly aria-label="확대" icon={<PrismIcon name="ZoomInIcon"/>} onClick={() => changeZoom(percent % 10 === 0 ? percent+10 : Math.ceil(percent/10)*10)} disabled={!pdf}/></div>
        <PrismTooltip content={fit === "width" ? "너비 맞춤" : "페이지 맞춤"}><PrismButton variant="shape" size="small" iconOnly icon={<PrismIcon name={fit === "width" ? "FitWidthIcon" : "FitHeightIcon"}/>} aria-label="맞춤 전환" aria-pressed={fit === "width"}
            disabled={!pdf} onClick={() => { if (native.current) native.current.currentScaleValue = fit === "width" ? "page-fit" : "page-width"; }}/></PrismTooltip></div>
        <div className="prism-pdf-stage"><div className="prism-pdf-viewport" ref={viewport} tabIndex={0} role="region" aria-label={`${title} 페이지`} aria-busy={status === "loading"}><div ref={pages} className="pdfViewer" hidden={status === "error"}/>
            {status === "loading" && <p role="status">문서를 불러오는 중입니다.</p>}{status === "error" && <div role="alert"><p>{loadError || "문서를 표시하지 못했습니다."}</p><PrismButton onClick={() => setRetry(retry+1)}>다시 시도</PrismButton></div>}</div></div>
        {onDownload && <footer>{downloadError && <p role="alert" className="prism-error">{downloadError}</p>}<PrismButton disabled={downloadBusy} onClick={startDownload}>{downloadBusy ? "처리 중" : "다운로드"}</PrismButton></footer>}</section>;
}
export type PrismPdfDialogProps = PrismPdfViewerProps & { open: boolean; onOpenChange: (open: boolean) => void; width?: number; description?: string };
export function PrismPdfDialog({ open, onOpenChange, width = 1200, height, description = "PDF 문서를 확인하고 다운로드할 수 있습니다.", ...viewer }: PrismPdfDialogProps) {
    return <PrismDialog title={viewer.title} description={description} open={open} onOpenChange={onOpenChange} width={width} style={height === undefined ? undefined : {height}} className="prism-pdf-dialog">
        {open && <PrismPdfViewer {...viewer} height="100%" onDownload={viewer.onDownload ?? startPrismPdfDownload}/>}
    </PrismDialog>;
}
export type PrismPrintSection = { id: string; label: string; content: ReactNode };
export type PrismPrintOptionsProps = {
    sections: readonly PrismPrintSection[]; value: readonly string[]; onValueChange: (value: string[]) => void;
    onConfirm: (value: readonly string[]) => void; open: boolean; onOpenChange: (open: boolean) => void;
    title?: string; description?: string; confirmLabel?: string; busy?: boolean;
};
export function PrismPrintOptions({ sections, value, onValueChange, onConfirm, open, onOpenChange, title = "출력 정보 선택", description = "출력할 정보를 선택해 주세요.", confirmLabel = "출력 미리보기", busy = false }: PrismPrintOptionsProps) {
    return <PrismDialog title={title} description={description} width={440} className="prism-print-options-dialog" open={open} onOpenChange={next => { if (!busy) onOpenChange(next); }}
        footer={<><PrismButton variant="line" disabled={busy} onClick={() => onOpenChange(false)}>취소</PrismButton><PrismButton disabled={busy} onClick={() => onConfirm(value)}>{busy ? "처리 중" : confirmLabel}</PrismButton></>}>
        <div className="prism-print-options">{sections.map(section => <PrismCheckbox key={section.id} label={section.label} disabled={busy} checked={value.includes(section.id)}
            onCheckedChange={checked => onValueChange(checked ? [...new Set([...value,section.id])] : value.filter(id => id !== section.id))} />)}</div></PrismDialog>;
}
export function PrismPrintPreview({ title, sections, selected, onPrint }: { title: string; sections: readonly PrismPrintSection[]; selected: readonly string[]; onPrint?: () => void }) {
    return <div className="prism-print-preview">{onPrint && <div className="prism-print-actions"><PrismButton onClick={onPrint}>인쇄</PrismButton></div>}
        <article className="prism-print-document" aria-label={`${title} 출력 미리보기`}><h1>{title}</h1>{sections.filter(s => selected.includes(s.id)).map(section => <section key={section.id}>
            <h2>{section.label}</h2>{section.content}</section>)}{!selected.length && <p>출력할 정보를 선택해 주세요.</p>}</article></div>;
}
