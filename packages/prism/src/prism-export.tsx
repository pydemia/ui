import { useEffect, useRef } from "react";
import type { Zip } from "fflate";
import type { jsPDF } from "jspdf";

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
