import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import { PrismZoomInGlyph as ZoomIn, PrismZoomOutGlyph as ZoomOut, PrismExpandGlyph as Expand } from "./prism-icon";
import { PrismButton } from "./prism-button";
import { PrismDialog } from "./prism-dialog";
import { PrismCheckbox } from "./prism-selection";

export type PrismPdfViewerProps={url:string;workerUrl:string;title:string;onDownload?:()=>void;height?:CSSProperties["height"];minZoom?:number;maxZoom?:number};
export function PrismPdfViewer({ url, workerUrl, title, onDownload, height, minZoom = 30, maxZoom = 100 }: PrismPdfViewerProps) {
    if(!Number.isFinite(minZoom)||!Number.isFinite(maxZoom)||minZoom<=0||minZoom>maxZoom)throw new RangeError("PDF zoom bounds must be positive with minZoom <= maxZoom.");
    const [pdf,setPdf] = useState<PDFDocumentProxy | null>(null); const [page,setPage] = useState(1); const [zoom,setZoom] = useState(100);
    const [fittedZoom,setFittedZoom] = useState(100);
    const [fit,setFit] = useState<"page" | "width" | null>("page"); const [status,setStatus] = useState<"loading" | "ready" | "error">("loading");
    const [bounds,setBounds] = useState({ width: 600,height: 500 }); const [retry,setRetry] = useState(0);
    const canvas = useRef<HTMLCanvasElement>(null); const viewport = useRef<HTMLDivElement>(null);
    useEffect(() => { const element = viewport.current; if (!element) return; const measure=()=>setBounds({width:element.clientWidth,height:element.clientHeight});
        measure();const observer = new ResizeObserver(measure);observer.observe(element);return () => observer.disconnect(); },[]);
    useEffect(() => { let disposed = false; let loading: ReturnType<typeof import("pdfjs-dist")["getDocument"]> | undefined;
        setStatus("loading"); setPdf(null); setPage(1);
        void import("pdfjs-dist").then(lib => { if (disposed) return; lib.GlobalWorkerOptions.workerSrc = workerUrl;
            loading = lib.getDocument({ url }); return loading.promise; }).then(document => {
                if (!disposed && document) { setPdf(document); } }).catch(() => { if (!disposed) setStatus("error"); });
        return () => { disposed = true; void loading?.destroy(); };
    },[url,workerUrl,retry]);
    useEffect(() => { if (!pdf || !canvas.current) return; let disposed = false; let task: RenderTask | undefined;
        const element = canvas.current; setStatus("loading");
        void pdf.getPage(page).then(documentPage => { if (disposed) return; const unscaled = documentPage.getViewport({ scale: 1 });
            const scale = fit ? Math.max(.1, fit === "width" ? (bounds.width-32)/unscaled.width : Math.min((bounds.width-32)/unscaled.width,(bounds.height-32)/unscaled.height)) : zoom/100;
            if (fit) setFittedZoom(Math.round(scale*100));
            const view = documentPage.getViewport({ scale }); const pixelRatio = window.devicePixelRatio || 1;
            element.width = Math.round(view.width*pixelRatio); element.height = Math.round(view.height*pixelRatio);
            element.style.width = `${view.width}px`; element.style.height = `${view.height}px`;
            task = documentPage.render({ canvas: element, viewport: view, transform: pixelRatio === 1 ? undefined : [pixelRatio,0,0,pixelRatio,0,0] });
            return task.promise;
        }).then(() => { if (!disposed) setStatus("ready"); }).catch(() => { if (!disposed) setStatus("error"); });
        return () => { disposed = true; task?.cancel(); };
    },[pdf,page,zoom,fit,bounds]);
    const changeZoom = (next: number) => { if(!Number.isFinite(next)||next<=0)return;setFit(null); setZoom(Math.max(minZoom,Math.min(maxZoom,next))); };
    return <section className="prism-pdf" aria-label={title} style={{height}}><div className="prism-pdf-toolbar"><label>페이지 <input type="number" min={1} max={pdf?.numPages ?? 1}
        value={page} disabled={!pdf} onChange={e => { const next = Number(e.target.value); if (Number.isInteger(next)) setPage(Math.max(1,Math.min(pdf?.numPages ?? 1,next))); }} /><span>/ {pdf?.numPages ?? 0}</span></label>
        <div><PrismButton variant="line" iconOnly aria-label="축소" icon={<ZoomOut />} onClick={() => changeZoom((fit ? fittedZoom : zoom)-10)} disabled={!pdf || (!fit && zoom <= minZoom)} />
            <label>배율 <input type="number" min={minZoom} max={maxZoom} value={fit ? fittedZoom : zoom} onChange={e => changeZoom(Number(e.target.value))} disabled={!pdf} />%</label>
            <PrismButton variant="line" iconOnly aria-label="확대" icon={<ZoomIn />} onClick={() => changeZoom((fit ? fittedZoom : zoom)+10)} disabled={!pdf || (!fit && zoom >= maxZoom)} /></div>
        <PrismButton variant="shape" icon={<Expand />} aria-label={fit === "width" ? "페이지 맞춤" : "너비 맞춤"} aria-pressed={fit === "width"}
            disabled={!pdf} onClick={() => setFit(fit === "width" ? "page" : "width")}>{fit === "width" ? "페이지 맞춤" : "너비 맞춤"}</PrismButton></div>
        <div className="prism-pdf-viewport" ref={viewport} aria-busy={status === "loading"}><canvas ref={canvas} role="img" aria-label={`${title} ${page}페이지`} hidden={status === "error"} />
            {status === "loading" && <p role="status">문서를 불러오는 중입니다.</p>}{status === "error" && <div role="alert"><p>문서를 표시하지 못했습니다.</p><PrismButton onClick={() => setRetry(retry+1)}>다시 시도</PrismButton></div>}</div>
        {onDownload && <footer><PrismButton onClick={onDownload}>다운로드</PrismButton></footer>}</section>;
}
export type PrismPrintSection = { id: string; label: string; content: ReactNode };
export function PrismPrintOptions({ sections, value, onValueChange, onConfirm, open, onOpenChange }: {
    sections: readonly PrismPrintSection[]; value: readonly string[]; onValueChange: (value: string[]) => void;
    onConfirm: (value: readonly string[]) => void; open: boolean; onOpenChange: (open: boolean) => void;
}) {
    return <PrismDialog title="출력 정보 선택" description="출력할 정보를 선택해 주세요." open={open} onOpenChange={onOpenChange}
        footer={<><PrismButton variant="line" onClick={() => onOpenChange(false)}>취소</PrismButton><PrismButton onClick={() => onConfirm(value)}>출력 미리보기</PrismButton></>}>
        <div className="prism-print-options">{sections.map(section => <PrismCheckbox key={section.id} label={section.label} checked={value.includes(section.id)}
            onCheckedChange={checked => onValueChange(checked ? [...new Set([...value,section.id])] : value.filter(id => id !== section.id))} />)}</div></PrismDialog>;
}
export function PrismPrintPreview({ title, sections, selected, onPrint }: { title: string; sections: readonly PrismPrintSection[]; selected: readonly string[]; onPrint?: () => void }) {
    return <div className="prism-print-preview">{onPrint && <div className="prism-print-actions"><PrismButton onClick={onPrint}>인쇄</PrismButton></div>}
        <article className="prism-print-document" aria-label={`${title} 출력 미리보기`}><h1>{title}</h1>{sections.filter(s => selected.includes(s.id)).map(section => <section key={section.id}>
            <h2>{section.label}</h2>{section.content}</section>)}{!selected.length && <p>출력할 정보를 선택해 주세요.</p>}</article></div>;
}
