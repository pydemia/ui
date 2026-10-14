import { useEffect, useRef, useState, type ReactNode } from "react";
import { PrismAffiliateLogo } from "./prism-primitives";
import { PrismNoData, type PrismRiskItem } from "./prism-assessment";
import { PrismOutline } from "./prism-profile";
import { PrismChip } from "./prism-badge";
import { PrismButton } from "./prism-button";
import { createPrismHtmlDocument, type PrismHtmlExportOptions } from "./prism-html-export";

export type PrismPrintSessionOptions = PrismHtmlExportOptions & {
    readyTimeoutMs?: number;
    /** A browser event, not confirmation that pages were printed or a PDF was saved. */
    onAfterPrint?: () => void;
};
export type PrismPrintSession = {
    readonly html: string;
    readonly embeddedAssets: number;
    readonly requested: boolean;
    readonly disposed: boolean;
    print: () => void;
    dispose: () => void;
};

/** An isolated static document. Keep it alive until afterprint or explicit disposal. */
export async function preparePrismPrintSession(root: HTMLElement, { readyTimeoutMs = 30_000, onAfterPrint, ...options }: PrismPrintSessionOptions): Promise<PrismPrintSession> {
    const doc = root.ownerDocument, view = doc.defaultView;
    if (!view || !root.isConnected) throw new Error("A connected print document is required.");
    if (!Number.isFinite(readyTimeoutMs) || readyTimeoutMs < 100 || readyTimeoutMs > 360_000) throw new RangeError("Print preparation timeout must be 100..360000ms.");
    options.signal?.throwIfAborted();
    const controller = new view.AbortController(), signal = controller.signal;
    const abort = () => controller.abort(options.signal?.reason);
    options.signal?.addEventListener("abort", abort, { once: true });
    const timeout = view.setTimeout(() => controller.abort(new view.DOMException("Print resources did not become ready.", "TimeoutError")), readyTimeoutMs);
    let frame: HTMLIFrameElement | undefined, printWindow: Window | null = null, disposed = false, requested = false;
    const previousFocus = doc.activeElement;
    const dispose = () => {
        if (disposed) return; disposed = true;
        view.clearTimeout(timeout); options.signal?.removeEventListener("abort", abort);
        printWindow?.removeEventListener("afterprint", afterPrint);
        controller.abort();
        const restoreFocus = frame && doc.activeElement === frame;
        frame?.remove();
        if (restoreFocus && previousFocus instanceof view.HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
    const afterPrint = () => { dispose(); onAfterPrint?.(); };
    const wait = <T,>(promise: Promise<T>): Promise<T> => new Promise((resolve, reject) => {
        const aborted = () => { signal.removeEventListener("abort", aborted); reject(signal.reason); };
        signal.addEventListener("abort", aborted, { once: true });
        promise.then(value => { signal.removeEventListener("abort", aborted); resolve(value); }, error => { signal.removeEventListener("abort", aborted); reject(error); });
        if (signal.aborted) aborted();
    });
    try {
        const result = await createPrismHtmlDocument(root, { ...options, signal }); signal.throwIfAborted();
        frame = doc.createElement("iframe"); frame.dataset.prismPrintFrame = ""; frame.title = `${options.title} 인쇄 문서`;
        frame.setAttribute("aria-hidden", "true"); frame.tabIndex = -1;
        // No child scripts or external resources; allow-modals permits this frame's print().
        frame.setAttribute("sandbox", "allow-same-origin allow-modals");
        frame.style.cssText = "position:fixed;left:-10000px;top:0;width:190mm;height:280mm;border:0;pointer-events:none";
        const loaded = new Promise<void>((resolve, reject) => {
            const clear = () => { frame?.removeEventListener("load", load); frame?.removeEventListener("error", error); signal.removeEventListener("abort", cancel); };
            const load = () => { try { if (!frame?.contentDocument?.querySelector("[data-prism-export-root]")) return; clear(); resolve(); } catch { clear(); reject(new Error("The isolated print document could not be accessed.")); } };
            const error = () => { clear(); reject(new Error("The isolated print document could not be loaded.")); };
            const cancel = () => { clear(); reject(signal.reason); };
            frame!.addEventListener("load", load); frame!.addEventListener("error", error); signal.addEventListener("abort", cancel, { once: true });
        });
        // A Trusted Types assignment or append failure may occur before awaiting load.
        void loaded.catch(() => {});
        doc.body.append(frame); frame.srcdoc = result.html;
        await loaded; signal.throwIfAborted();
        const printed = frame.contentDocument; printWindow = frame.contentWindow;
        if (!printed || !printWindow) throw new Error("The isolated print document is unavailable.");
        await wait(printed.fonts.ready);
        if ([...printed.fonts].some(face => face.status === "error")) throw new Error("A print font could not be loaded.");
        await Promise.all([...printed.images].map(image => wait(image.decode())));
        await wait(new Promise<void>(resolve => view.requestAnimationFrame(() => view.requestAnimationFrame(() => resolve()))));
        signal.throwIfAborted(); view.clearTimeout(timeout);
        printWindow.addEventListener("afterprint", afterPrint);
        // Abort after preparation also releases the owned frame; it cannot cancel a printer job.
        signal.addEventListener("abort", dispose, { once: true });
        return { html: result.html, embeddedAssets: result.embeddedAssets,
            get requested() { return requested; }, get disposed() { return disposed; }, dispose,
            print() {
                signal.throwIfAborted();
                if (disposed || !frame?.isConnected) throw new Error("The print document has been disposed.");
                if (requested) throw new Error("This print session was already requested.");
                requested = true;
                try { printWindow!.focus(); printWindow!.print(); } catch (error) { dispose(); throw error; }
            },
        };
    } catch (error) { dispose(); throw error; }
}

export type PrismPrintButtonProps = Omit<PrismPrintSessionOptions, "signal"> & {
    getRoot: () => HTMLElement | null; disabled?: boolean;
    /** Invocation returned; the browser may still ignore printing or show a nonblocking dialog. */
    onRequested?: () => void; onError?: (error: unknown) => void;
};
export function PrismPrintButton({ getRoot, disabled = false, onRequested, onError, onAfterPrint, ...options }: PrismPrintButtonProps) {
    const [busy, setBusy] = useState(false), controller = useRef<AbortController | null>(null), session = useRef<PrismPrintSession | null>(null);
    const callbacks = useRef({ onRequested, onError, onAfterPrint }); callbacks.current = { onRequested, onError, onAfterPrint };
    useEffect(() => () => { controller.current?.abort(); session.current?.dispose(); }, []);
    const run = async () => {
        if (controller.current) return;
        session.current?.dispose(); session.current = null;
        const current = new AbortController(); controller.current = current; setBusy(true);
        try {
            const root = getRoot(); if (!root) throw new Error("The print document is unavailable.");
            const ready = await preparePrismPrintSession(root, { ...options, signal: current.signal,
                onAfterPrint: () => { session.current = null; callbacks.current.onAfterPrint?.(); } });
            current.signal.throwIfAborted(); session.current = ready; ready.print();
            if (!ready.disposed) callbacks.current.onRequested?.();
        } catch (error) { if (!current.signal.aborted) callbacks.current.onError?.(error); }
        finally { if (controller.current === current) { controller.current = null; if (!current.signal.aborted) setBusy(false); } }
    };
    return <span className="prism-native-print-actions" data-prism-export-exclude><PrismButton disabled={disabled || busy} onClick={() => void run()}>{busy ? "인쇄 준비 중" : "인쇄"}</PrismButton>
        {busy && <PrismButton variant="line" onClick={() => { controller.current?.abort(); controller.current = null; setBusy(false); }}>준비 취소</PrismButton>}</span>;
}

export function PrismPrintPage({name,company,companyLogo,jobTitle,tabBar,repeatHeader=false,children}: {name:string;company?:{brand:string;affiliate:string};companyLogo?:ReactNode;jobTitle?:string;tabBar?:ReactNode;repeatHeader?:boolean;children:ReactNode}) {
    const header=<><header className="prism-print-page-header" data-print-repeat-part><small>Profile</small><div>{companyLogo ?? (company && <PrismAffiliateLogo {...company} size={10}/>)}{jobTitle && <span>{jobTitle}</span>}<strong>{name}</strong></div></header>{tabBar}</>;
    return <section className="prism-print-page" data-print-page data-repeat-header={repeatHeader||undefined}>{repeatHeader ? <table className="prism-print-repeat"><thead><tr><td>{header}</td></tr></thead><tbody><tr><td>{children}</td></tr></tbody></table> : <>{header}<div className="prism-print-page-body">{children}</div></>}</section>;
}
export function PrismPrintLeaderSummary({name,summary,definition}: {name?:string|null;summary?:string|null;definition?:string|null}) {
    const label=name??"",index=Math.max(label.lastIndexOf("리더"),label.toLowerCase().lastIndexOf("leader")),note=definition?.trim();
    return <div className="prism-print-summary"><h3>SUMMARY</h3>{summary?.trim() ? <div><div className="prism-print-leader-badge-wrap"><span className="prism-print-leader-badge">{index>0 ? <>{label.slice(0,index).trimEnd()}<br/>{label.slice(index)}</> : label}</span></div><section><p>{summary}</p>{note && <small>※ {name?.trim() ? `${name.trim()} : ` : ""}{note}<br/>(리더 유형 단계 : Excellent &gt; Good &gt; Solid &gt; Developing &gt; Struggling)</small>}</section></div> : <PrismOutline><PrismNoData/></PrismOutline>}</div>;
}
export type PrismPrintCareerItem={id:string;period:string;company:string;role:string|readonly string[]};
export function PrismPrintCareer({items,showTitle=true,continuation=false}: {items:readonly PrismPrintCareerItem[];showTitle?:boolean;continuation?:boolean}) {
    return <div className="prism-print-career" data-continuation={continuation||undefined}>{showTitle && <h3>경력</h3>}{items.length ? <ol>{items.map(item=>{const role=typeof item.role==="string"?item.role:item.role.join(", ");return <li key={item.id} data-career-id={item.id}><span>{item.period}</span><strong>{item.company}</strong>{role && <><i aria-hidden="true"/><span>{role}</span></>}</li>;})}</ol> : <PrismNoData/>}</div>;
}
export function PrismPrintRisk({items}: {items:readonly PrismRiskItem[]}) {
    const merged={latent:items.length>0&&items.every(i=>i.latent===null),manifest:items.length>0&&items.every(i=>i.manifest===null)};
    return <div className="prism-print-risk"><h3>Derailment Risk</h3><table><thead><tr><th scope="col">항목</th><th scope="col">잠재 Risk<br/>성격가치검사</th><th scope="col">발현 Risk<br/>6Frame Survey 결과</th></tr></thead><tbody>{items.length ? items.map((item,index)=><tr key={item.id}><th scope="row">{item.label}</th>{(["latent","manifest"] as const).map(key=>merged[key] ? index===0&&<td key={key} rowSpan={items.length}>관련 데이터 없음</td> : <td key={key}>{item[key]===null ? "관련 데이터 없음" : item[key] ? "✓" : "-"}</td>)}</tr>) : <tr><td colSpan={3}>관련 데이터 없음</td></tr>}</tbody></table></div>;
}
export type PrismPrintExperienceItem={id:string;topic:string;representative?:boolean;title:string|null;description:string|null;keywords:readonly string[];interview?:string|null};
export function PrismPrintExperience({topics,activeTopic,items,showTitle=true}: {topics:readonly string[];activeTopic:string;items:readonly PrismPrintExperienceItem[];showTitle?:boolean}) {
    const visible=[...items].filter(i=>i.topic===activeTopic&&(i.title?.trim()||i.description?.trim())).sort((a,b)=>Number(!!b.representative)-Number(!!a.representative));
    return <div className="prism-print-experience" data-topic={activeTopic}>{showTitle&&<h3>성공경험 Essay</h3>}{topics.length>0&&<div className="prism-print-topics">{topics.map(topic=><span key={topic} data-active={topic===activeTopic||undefined}>{topic}{items.some(i=>i.topic===topic&&i.representative)&&<span className="prism-print-topic-star" aria-label="대표 성공경험">★</span>}</span>)}</div>}{visible.length ? visible.map(item=><PrismOutline key={item.id}><div className="prism-print-experience-body"><strong>{item.representative&&<PrismChip color="#FA7C39">대표</PrismChip>}{item.title?.trim()?item.title:"해당 내용 미작성"}</strong><p>{item.description?.trim()?item.description:"해당 내용 미작성"}</p></div>{item.keywords.length>0&&<div className="prism-print-experience-tags">{item.keywords.map((keyword,index)=><PrismChip key={index} color="#363636">{keyword}</PrismChip>)}</div>}{item.representative&&item.interview?.trim()&&<aside><strong>AI 인터뷰 분석</strong><p>{item.interview}</p></aside>}</PrismOutline>) : <PrismOutline><PrismNoData/></PrismOutline>}</div>;
}
