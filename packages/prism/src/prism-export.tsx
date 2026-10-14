import { useEffect, useRef } from "react";
import type { Zip } from "fflate";
import type { jsPDF } from "jspdf";
import type { Options as CanvasOptions } from "html2canvas-pro";

export type PrismPdfExportDocument<T> = { filename: string; data: T };
export type PrismPdfExportJob<T> = { id: string; documents: readonly PrismPdfExportDocument<T>[]; archiveName?: string };
export type PrismPdfExportProgress = { done: number; total: number };
export type PrismDownloadSink = {
    write: (chunk: Uint8Array) => void | Promise<void>;
    close: () => void | Promise<void>;
    abort: (reason: unknown) => void | Promise<void>;
};
export type PrismPdfExportResult = { filename: string; mimeType: "application/pdf" | "application/zip"; bytes: number; blob?: Blob };
export type PrismPdfRenderer<T> = (data: T, context: { signal: AbortSignal }) => Promise<Blob>;
export type PrismOpenDownload = (file: { filename: string; mimeType: string; signal: AbortSignal }) => Promise<PrismDownloadSink | null>;

function checkAbort(signal: AbortSignal) { signal.throwIfAborted(); }
function withAbort<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
    return new Promise((resolve, reject) => {
        const abort = () => { signal.removeEventListener("abort", abort); reject(signal.reason); };
        signal.addEventListener("abort", abort, { once: true });
        promise.then(value => { signal.removeEventListener("abort", abort); resolve(value); }, error => { signal.removeEventListener("abort", abort); reject(error); });
        if (signal.aborted) abort();
    });
}
function fileBase(value: string, fallback: string) {
    const base = value.normalize("NFC").replace(/\.(pdf|zip)$/i, "").replace(/[\u0000-\u001f\u007f<>:"/\\|?*]/g, "_").replace(/[.\s]+$/g, "").trim();
    const bounded = Array.from(base).slice(0, 160).join("") || fallback;
    return /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(bounded) ? `_${bounded}` : bounded;
}

/** PDFs are already compressed; ZIP stores each PDF without another compression pass. */
export async function runPrismPdfExport<T>({ documents, renderPdf, archiveName = "프로필", signal = new AbortController().signal, onProgress, openDownload }: {
    documents: readonly PrismPdfExportDocument<T>[]; renderPdf: PrismPdfRenderer<T>; archiveName?: string;
    signal?: AbortSignal; onProgress?: (progress: PrismPdfExportProgress) => void; openDownload?: PrismOpenDownload;
}): Promise<PrismPdfExportResult> {
    if (!documents.length) throw new RangeError("At least one PDF document is required.");
    checkAbort(signal);
    const used = new Set<string>();
    const filenames = documents.map((item, index) => {
        const base = fileBase(item.filename, `프로필_${index + 1}`);
        let name = `${base}.pdf`;
        for (let n = 2; used.has(name.toLocaleLowerCase("en-US")); n++) name = `${base} (${n}).pdf`;
        used.add(name.toLocaleLowerCase("en-US")); return name;
    });
    const mimeType = documents.length === 1 ? "application/pdf" : "application/zip";
    const filename = documents.length === 1 ? filenames[0] : `${fileBase(archiveName, "프로필")}.zip`;
    let sink: PrismDownloadSink | null = null;
    let zip: Zip | undefined;
    let bytes = 0;
    const chunks: BlobPart[] = [];
    let pendingWrite = Promise.resolve();
    let writeError: unknown;
    const output = (chunk: Uint8Array) => {
        bytes += chunk.byteLength;
        if (sink) pendingWrite = pendingWrite.then(() => { if (writeError !== undefined) throw writeError; checkAbort(signal); return sink!.write(chunk); }).catch(error => { writeError = error; });
        else chunks.push(new Uint8Array(chunk).buffer);
    };
    const drain = async () => { await pendingWrite; if (writeError !== undefined) throw writeError; checkAbort(signal); };
    try {
        sink = await openDownload?.({ filename, mimeType, signal }) ?? null;
        checkAbort(signal);
        let add: ((name: string, data: Uint8Array) => void) | undefined;
        if (documents.length > 1) {
            const { Zip, ZipPassThrough } = await import("fflate");
            checkAbort(signal);
            zip = new Zip((error, data) => { if (error) writeError = error; else output(data); });
            add = (name, data) => { const entry = new ZipPassThrough(name); zip!.add(entry); entry.push(data, true); };
        }
        onProgress?.({ done: 0, total: documents.length });
        for (const [index, item] of documents.entries()) {
            const pdf = await withAbort(renderPdf(item.data, { signal }), signal);
            checkAbort(signal);
            const data = new Uint8Array(await pdf.arrayBuffer());
            checkAbort(signal);
            if (data.length < 8 || new TextDecoder().decode(data.subarray(0, 5)) !== "%PDF-") throw new TypeError("The PDF renderer returned a non-PDF document.");
            if (add) add(filenames[index], data); else output(data);
            await drain();
            onProgress?.({ done: index + 1, total: documents.length });
        }
        zip?.end();
        await drain();
        if (sink) { await sink.close(); checkAbort(signal); }
        return { filename, mimeType, bytes, ...(sink ? {} : { blob: new Blob(chunks, { type: mimeType }) }) };
    } catch (error) {
        zip?.terminate();
        // Let an in-flight write settle before aborting the same writer.
        await pendingWrite;
        try { await sink?.abort(error); } catch { /* Preserve the original failure. */ }
        throw error;
    }
}

export type PrismImagePdfPage = { jpeg: string; width: number; height: number };
/** Supply already paginated JPEG images. Capture, page breaks and source data belong to the consumer. */
export async function createPrismImagePdf(pages: readonly PrismImagePdfPage[], { signal = new AbortController().signal, title = "프로필" }: { signal?: AbortSignal; title?: string } = {}): Promise<Blob> {
    if (!pages.length || pages.some(page => !page.jpeg.startsWith("data:image/jpeg;base64,") || !Number.isFinite(page.width) || !Number.isFinite(page.height) || page.width <= 0 || page.height <= 0)) throw new RangeError("Provide nonempty JPEG pages with positive dimensions.");
    checkAbort(signal);
    const { jsPDF: Pdf } = await import("jspdf");
    checkAbort(signal);
    let pdf: jsPDF | undefined;
    for (const page of pages) {
        checkAbort(signal);
        const orientation = page.width > page.height ? "landscape" : "portrait";
        if (!pdf) pdf = new Pdf({ unit: "mm", format: [page.width, page.height], orientation, compress: true });
        else pdf.addPage([page.width, page.height], orientation);
        pdf.addImage(page.jpeg, "JPEG", 0, 0, page.width, page.height);
    }
    pdf!.setProperties({ title });
    return pdf!.output("blob");
}

export type PrismPrintInterval = readonly [number, number];
export type PrismPrintPdfSlice = { parts: readonly PrismPrintInterval[]; heightMm: number; forcedBreak: boolean };
/** Measures are unscaled CSS pixels. Every body interval is retained, including oversized cards. */
export function planPrismPrintPdfPage({ width, height, headerHeight = 0, headerParts, avoid = [], keepWithNext = [], lines = [] }: {
    width: number; height: number; headerHeight?: number; headerParts?: readonly PrismPrintInterval[]; avoid?: readonly PrismPrintInterval[];
    keepWithNext?: readonly PrismPrintInterval[]; lines?: readonly PrismPrintInterval[];
}): PrismPrintPdfSlice[] {
    const capacity = width * 280 / 190;
    const headers: readonly PrismPrintInterval[] = headerParts ?? (headerHeight ? [[0, headerHeight]] : []);
    const repeatedHeight = headers.reduce((sum, [start, end]) => sum + end - start, 0);
    if (![width, height, headerHeight, repeatedHeight].every(Number.isFinite) || width <= 0 || height <= 0 || headerHeight < 0 || repeatedHeight >= capacity)
        throw new RangeError("Provide positive unscaled page dimensions and a header smaller than the A4 content area.");
    for (const [start, end] of [...headers, ...avoid, ...keepWithNext, ...lines]) if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end < start || end > height + 1)
        throw new RangeError("Print intervals must be ordered and inside their source page.");
    if (headers.some(([start], index) => index > 0 && start < headers[index - 1][1])) throw new RangeError("Repeated header parts must be ordered and must not overlap.");
    const cutBefore = (limit: number, intervals: readonly PrismPrintInterval[]) => {
        let cut = limit, previous: number;
        do { previous = cut; for (const [start, end] of intervals) if (start < cut && cut < end) cut = Math.max(0, start - .5); } while (cut < previous);
        return cut;
    };
    const result: PrismPrintPdfSlice[] = [];
    let offset = 0;
    while (offset < height - .01) {
        const repeated = offset > 0 ? repeatedHeight : 0, available = capacity - repeated;
        const limit = Math.min(height, offset + available);
        let end = limit, forcedBreak = false;
        if (limit < height) {
            const intact = avoid.filter(([a, b]) => b - a <= available && b > offset && a < limit);
            const cardCut = cutBefore(limit, intact);
            const paired = keepWithNext.filter(([a, b]) => b - a <= available && b > offset && a < limit);
            const headingCut = cutBefore(limit, paired);
            if (cardCut < limit && cardCut > offset + .5) end = cardCut;
            else if (headingCut < limit && headingCut - offset >= available * .4) end = headingCut;
            else end = cutBefore(limit, lines.filter(([, b]) => b > offset));
            if (end <= offset + .5) { end = limit; forcedBreak = true; }
            forcedBreak ||= [...avoid, ...keepWithNext, ...lines].some(([a, b]) => a < end && end < b);
        }
        const parts: PrismPrintInterval[] = repeated ? [...headers, [offset, end]] : [[offset, end]];
        result.push({ parts, heightMm: parts.reduce((sum, [a, b]) => sum + b - a, 0) * 190 / width, forcedBreak });
        offset = end;
    }
    return result;
}

export type PrismPrintPdfCapture = (page: HTMLElement, context: { signal: AbortSignal; scale: number; range: PrismPrintInterval; width: number }) => Promise<HTMLCanvasElement>;
export type PrismPrintPdfResult = { blob: Blob; pageCount: number; captures: number; forcedBreaks: readonly { sourcePage: number; outputPage: number }[] };
/** An A4 raster PDF from connected, unscaled print pages; no automatic download or source DOM mutation. */
export async function createPrismPrintPdf(root: HTMLElement, { title = "프로필", signal = new AbortController().signal, scale = 2, capture, onProgress }: {
    title?: string; signal?: AbortSignal; scale?: number; capture?: PrismPrintPdfCapture;
    onProgress?: (progress: PrismPdfExportProgress) => void;
} = {}): Promise<PrismPrintPdfResult> {
    const doc = root.ownerDocument, view = doc.defaultView;
    if (!view || !root.isConnected) throw new Error("A connected print document is required.");
    if (!Number.isFinite(scale) || scale < .5 || scale > 4) throw new RangeError("Capture scale must be between .5 and 4.");
    checkAbort(signal);
    await withAbort(doc.fonts.ready, signal);
    await Promise.all([...root.querySelectorAll("img")].map(async image => {
        if (!image.getAttribute("src") && !image.currentSrc) throw new Error("A profile image is unavailable.");
        try { await withAbort(image.decode(), signal); } catch { checkAbort(signal); throw new Error("A profile image could not be decoded."); }
    }));
    await withAbort(new Promise<void>(resolve => view.requestAnimationFrame(() => view.requestAnimationFrame(() => resolve()))), signal);
    const pages = [...root.querySelectorAll<HTMLElement>("[data-print-page]")];
    if (!pages.length) throw new Error("No print pages were found.");
    const planned = pages.map(page => {
        const rect = page.getBoundingClientRect(), intervals: PrismPrintInterval[] = [], keepWithNext: PrismPrintInterval[] = [], lines: PrismPrintInterval[] = [];
        // Preview zoom is deliberately excluded: the same content must paginate at physical paper size.
        if (Math.abs(rect.width - page.offsetWidth) > 2) throw new Error("Render an unscaled print root before PDF capture.");
        const interval = (r: DOMRect) => [Math.min(rect.height, Math.max(0, r.top - rect.top)), Math.max(0, Math.min(rect.height, r.bottom - rect.top))] as const;
        const walker = doc.createTreeWalker(page, 4), range = doc.createRange();
        for (let node = walker.nextNode(); node; node = walker.nextNode()) if (node.textContent?.trim()) {
            range.selectNodeContents(node); for (const r of range.getClientRects()) if (r.height > 0) lines.push(interval(r));
        }
        for (const element of page.querySelectorAll<HTMLElement>("*")) {
            const r = element.getBoundingClientRect(); if (r.height <= 0) continue;
            if (element.matches("img,canvas,svg")) lines.push(interval(r));
            const style = view.getComputedStyle(element);
            if (style.breakInside.startsWith("avoid") || style.pageBreakInside === "avoid") intervals.push(interval(r));
            // A heading and its first content block travel together when they fit on one page.
            const heading = element.matches("h3,h4") || (element.localName === "header" && !!element.querySelector("h3,h4"));
            if (heading && element.nextElementSibling) {
                const next = element.nextElementSibling.getBoundingClientRect();
                if (next.height > 0) keepWithNext.push([Math.max(0, r.top - rect.top), Math.min(rect.height, next.bottom - rect.top)]);
            }
            if (style.breakAfter.startsWith("avoid") || style.pageBreakAfter === "avoid") {
                const next = element.nextElementSibling?.getBoundingClientRect();
                intervals.push([Math.max(0, r.top - rect.top), Math.min(rect.height, Math.max(r.bottom, (next?.top ?? r.bottom) + .5) - rect.top)]);
            }
        }
        const head = page.querySelector("thead")?.getBoundingClientRect();
        // The first profile has a photo between its title and tabs. Repeat only the marked
        // title/tabs on continuation, preserving that first-page order and the photo once.
        const headerParts: PrismPrintInterval[] = head ? [[0, head.bottom - rect.top]] : [...page.querySelectorAll<HTMLElement>("[data-print-repeat-part]")].map(element => {
            const r = element.getBoundingClientRect();
            const gap = element.parentElement ? Math.max(0, parseFloat(view.getComputedStyle(element.parentElement).rowGap) || 0) : 0;
            return [Math.max(0, r.top - rect.top), Math.min(rect.height, r.bottom - rect.top + gap)];
        });
        return { page, width: rect.width, slices: planPrismPrintPdfPage({ width: rect.width, height: rect.height, headerParts, avoid: intervals, keepWithNext, lines }) };
    });
    const defaultCapture: PrismPrintPdfCapture = async (page, context) => {
        const { default: render } = await import("html2canvas-pro"); checkAbort(context.signal);
        let resourceError: Error | undefined;
        const captureFrame = doc.createElement("div"); captureFrame.dataset.prismCaptureFrames = "";
        captureFrame.style.cssText = "position:fixed;left:-10000px;top:0;pointer-events:none"; doc.body.append(captureFrame);
        const options: Partial<CanvasOptions> = { signal: context.signal, scale: context.scale, width: context.width,
            y: context.range[0], height: context.range[1] - context.range[0], backgroundColor: "#ffffff", logging: false, useCORS: true,
            iframeContainer: captureFrame,
            windowWidth: Math.max(1024, context.width), scrollX: 0, scrollY: 0,
            ignoreElements: element => !(element === page || page.contains(element) || element.contains(page) || !!element.closest("head")),
            onError: error => { resourceError ??= error; },
            onclone: async (clonedDoc, clonedPage) => {
                // Normalize only the clone; the host can keep its capture root off-screen.
                for (let element: HTMLElement | null = clonedPage; element; element = element.parentElement) {
                    for (const [property, value] of Object.entries({ position: "static", inset: "auto", transform: "none", zoom: "1", overflow: "visible" })) element.style.setProperty(property, value, "important");
                }
                clonedPage.style.width = `${context.width}px`;
                for (const element of clonedPage.querySelectorAll<HTMLElement>("*")) { element.style.animation = "none"; element.style.transition = "none"; }
                // Canvas graphs retain their actual pixels instead of an empty clone.
                const source = page.querySelectorAll("canvas");
                clonedPage.querySelectorAll("canvas").forEach((target, index) => { const original = source[index]; if (!original) return;
                    target.width = original.width; target.height = original.height; const painter = target.getContext("2d");
                    if (!painter) throw new Error("A chart canvas could not be cloned."); painter.drawImage(original, 0, 0); });
                void clonedPage.offsetHeight; await withAbort(clonedDoc.fonts.ready, context.signal);
            },
        };
        try {
            const canvas = await render(page, options); checkAbort(context.signal);
            if (resourceError) { canvas.width = canvas.height = 0; throw new Error("A capture resource could not be loaded.", { cause: resourceError }); }
            return canvas;
        } finally { captureFrame.remove(); }
    };
    const renderer = capture ?? defaultCapture, { jsPDF: Pdf } = await import("jspdf"); checkAbort(signal);
    const pdf = new Pdf({ unit: "mm", format: "a4", compress: true });
    const total = planned.reduce((sum, page) => sum + page.slices.length, 0);
    const forcedBreaks: { sourcePage: number; outputPage: number }[] = [];
    let done = 0, captures = 0;
    onProgress?.({ done, total });
    for (const [sourcePage, { page, width, slices }] of planned.entries()) for (const slice of slices) {
        checkAbort(signal);
        const canvas = doc.createElement("canvas"); canvas.width = Math.ceil(width * scale);
        canvas.height = Math.ceil(slice.parts.reduce((sum, [a, b]) => sum + b - a, 0) * scale);
        const context = canvas.getContext("2d"); if (!context) throw new Error("Canvas capture is unavailable.");
        context.fillStyle = "#ffffff"; context.fillRect(0, 0, canvas.width, canvas.height);
        try {
            let y = 0;
            for (const part of slice.parts) {
                const captured = await withAbort(renderer(page, { signal, scale, width, range: part }).then(value => {
                    if (signal.aborted) { value.width = value.height = 0; checkAbort(signal); } return value;
                }), signal); captures++;
                try { checkAbort(signal); if (!captured.width || !captured.height) throw new Error("The capture renderer returned an empty canvas.");
                    const height = (part[1] - part[0]) * scale; context.drawImage(captured, 0, y, canvas.width, height); y += height;
                } finally { captured.width = captured.height = 0; }
            }
            if (done) pdf.addPage();
            pdf.addImage(canvas.toDataURL("image/jpeg", .95), "JPEG", 10, 7, 190, slice.heightMm);
            if (slice.forcedBreak) forcedBreaks.push({ sourcePage: sourcePage + 1, outputPage: done + 1 });
            done++; onProgress?.({ done, total });
        } finally { canvas.width = canvas.height = 0; }
    }
    checkAbort(signal);
    for (let i = 1; i <= total; i++) { pdf.setPage(i); pdf.setFontSize(8); pdf.setTextColor(34, 34, 34); pdf.text(`${i}/${total}`, 105, 292, { align: "center" }); }
    pdf.setProperties({ title });
    return { blob: pdf.output("blob"), pageCount: total, captures, forcedBreaks };
}

/** Starts a browser download. It does not report completion of the OS file save. */
export function downloadPrismBlob(blob: Blob, filename: string) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a"); link.href = url; link.download = filename;
    link.hidden = true; document.body.append(link);
    try { link.click(); } finally { link.remove(); setTimeout(() => URL.revokeObjectURL(url), 60_000); }
}

export type PrismPdfDownloadHostProps<T> = {
    jobs: readonly PrismPdfExportJob<T>[]; renderPdf: PrismPdfRenderer<T>; openDownload?: PrismOpenDownload;
    onProgress?: (id: string, progress: PrismPdfExportProgress) => void;
    onComplete: (id: string, result: PrismPdfExportResult) => void;
    onError: (id: string, error: unknown) => void;
    warnBeforeUnload?: boolean;
};
function DownloadJob<T>({ job, host }: { job: PrismPdfExportJob<T>; host: Omit<PrismPdfDownloadHostProps<T>, "jobs"> }) {
    const callbacks = useRef(host); callbacks.current = host;
    // Each key is one immutable job. Callback identity changes must not restart it.
    const snapshot = useRef(job);
    const renderer = useRef(host.renderPdf);
    const opener = useRef(host.openDownload);
    useEffect(() => {
        const controller = new AbortController(); let active = true;
        void runPrismPdfExport({ ...snapshot.current, renderPdf: renderer.current, openDownload: opener.current, signal: controller.signal,
            onProgress: progress => { if (active) callbacks.current.onProgress?.(snapshot.current.id, progress); },
        }).then(result => {
            if (!active) return;
            if (result.blob) downloadPrismBlob(result.blob, result.filename);
            callbacks.current.onComplete(snapshot.current.id, result);
        }).catch(error => { if (active) callbacks.current.onError(snapshot.current.id, error); });
        return () => { active = false; controller.abort(); };
    }, []);
    return null;
}

/** Mount above routing; remove a job to cancel it. Completed/failed jobs remain inert until the owner removes them. */
export function PrismPdfDownloadHost<T>({ jobs, warnBeforeUnload = true, ...host }: PrismPdfDownloadHostProps<T>) {
    const ids = new Set(jobs.map(job => job.id));
    if (ids.size !== jobs.length || jobs.some(job => !job.id.trim())) throw new RangeError("Download jobs require unique nonempty IDs.");
    const active = jobs.length > 0 && warnBeforeUnload;
    useEffect(() => {
        if (!active) return;
        const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = ""; };
        window.addEventListener("beforeunload", warn);
        return () => window.removeEventListener("beforeunload", warn);
    }, [active]);
    return <>{jobs.map(job => <DownloadJob key={job.id} job={job} host={host} />)}</>;
}
