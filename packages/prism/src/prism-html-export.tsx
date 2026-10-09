import { useEffect, useRef, useState } from "react";
import valueParser from "postcss-value-parser";
import { PrismButton } from "./prism-button";
import { downloadPrismBlob } from "./prism-export";

export type PrismHtmlAssetLoader = (url: URL, signal: AbortSignal) => Promise<Blob>;
export type PrismHtmlExportOptions = {
    title: string; signal?: AbortSignal; excludeSelector?: string; loadAsset?: PrismHtmlAssetLoader;
    /** Supply complete styles when CSSOM access to the consumer's stylesheets is unavailable. */
    cssText?: string;
};
export type PrismHtmlExportResult = { html: string; blob: Blob; embeddedAssets: number };

const decodeCss = (value: string) => value.replace(/\\([\da-f]{1,6})\s?|\\(.)/gi, (_, hex: string, char: string) => hex ? String.fromCodePoint(parseInt(hex, 16) || 0xfffd) : char);
function abortable<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
    return new Promise((resolve, reject) => {
        const abort = () => { signal.removeEventListener("abort", abort); reject(signal.reason); };
        signal.addEventListener("abort", abort, { once: true });
        promise.then(value => { signal.removeEventListener("abort", abort); resolve(value); }, error => { signal.removeEventListener("abort", abort); reject(error); });
        if (signal.aborted) abort();
    });
}
async function defaultAssetLoader(url: URL, signal: AbortSignal) {
    const response = await fetch(url, { signal, credentials: "same-origin" });
    if (!response.ok) throw new Error("An export asset could not be loaded.");
    return response.blob();
}

/** A static, self-contained document; failures never silently replace a photograph, font or chart. */
export async function createPrismHtmlDocument(root: HTMLElement, { title, signal = new AbortController().signal,
    excludeSelector = "[data-prism-export-exclude],.prism-print-actions", loadAsset = defaultAssetLoader, cssText }: PrismHtmlExportOptions): Promise<PrismHtmlExportResult> {
    signal.throwIfAborted();
    const doc = root.ownerDocument, view = doc.defaultView;
    if (!view || !root.isConnected) throw new Error("A connected document root is required.");
    await abortable(doc.fonts.ready, signal);
    const cache = new Map<string, Promise<string>>();
    const embed = (raw: string, base = doc.baseURI): Promise<string> => {
        if (!raw || raw.startsWith("#") || raw.startsWith("data:")) return Promise.resolve(raw);
        const url = new URL(raw, base);
        if (!["http:", "https:", "blob:"].includes(url.protocol)) throw new Error("Unsupported export asset protocol.");
        let pending = cache.get(url.href);
        if (!pending) {
            pending = abortable(loadAsset(url, signal), signal).then(blob => abortable(new Promise<string>((resolve, reject) => {
                const reader = new view.FileReader(); reader.onload = () => resolve(String(reader.result)); reader.onerror = () => reject(new Error("An export asset could not be read.")); reader.readAsDataURL(blob);
            }), signal));
            cache.set(url.href, pending);
        }
        return pending;
    };
    const inlineCss = async (text: string, base: string) => {
        const parsed = valueParser(text), pending: Promise<void>[] = [];
        const escapedUrl = async (raw: string) => (await embed(decodeCss(raw), base)).replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/[\r\n\f]/g, "\\a ");
        parsed.walk(node => {
            if (node.type !== "function") return;
            const name = decodeCss(node.value).toLowerCase();
            if (name === "url") {
                if (node.unclosed) throw new Error("An export stylesheet contains an unfinished URL.");
                const values = node.nodes.filter(value => value.type !== "space" && value.type !== "comment");
                const raw = values.length === 1 && values[0].type === "string" ? values[0].value : valueParser.stringify(node.nodes).trim();
                pending.push(escapedUrl(raw).then(value => { node.value = "url"; node.before = node.after = ""; node.nodes = [{ type: "string", quote: '"', value, sourceIndex: node.sourceIndex, sourceEndIndex: node.sourceEndIndex }]; }));
                return false;
            }
            if (name === "image-set" || name === "-webkit-image-set") for (const value of node.nodes) {
                if (value.type === "string") pending.push(escapedUrl(value.value).then(url => { value.value = url; value.quote = '"'; }));
            }
        });
        await Promise.all(pending); return parsed.toString();
    };
    const readSheet = async (sheet: CSSStyleSheet, parents = new Set<CSSStyleSheet>()): Promise<string> => {
        if (parents.has(sheet)) throw new Error("Cyclic stylesheet imports cannot be exported.");
        const chain = new Set([...parents, sheet]);
        let rules: CSSRuleList;
        try { rules = sheet.cssRules; } catch { throw new Error("Stylesheet access is unavailable; supply complete cssText."); }
        const base = sheet.href || doc.baseURI;
        const parts = await Promise.all(Array.from(rules).map(async rule => {
            if (rule.type !== 3) return inlineCss(rule.cssText, base);
            const imported = rule as CSSImportRule;
            if (!imported.styleSheet) throw new Error("An imported stylesheet is unavailable.");
            let text = await readSheet(imported.styleSheet, chain);
            if (imported.media.mediaText && imported.media.mediaText !== "all") text = `@media ${imported.media.mediaText}{${text}}`;
            if (imported.supportsText) text = `@supports ${imported.supportsText}{${text}}`;
            if (imported.layerName !== null && imported.layerName !== undefined) text = `@layer ${imported.layerName}{${text}}`;
            return text;
        }));
        let text = parts.join("\n");
        if (sheet.media?.mediaText && sheet.media.mediaText !== "all") text = `@media ${sheet.media.mediaText}{${text}}`;
        return text;
    };
    const cssPending = cssText === undefined
        ? Promise.all([...Array.from(doc.styleSheets), ...(doc.adoptedStyleSheets || [])].filter(sheet => !sheet.disabled).map(sheet => readSheet(sheet))).then(parts => parts.join("\n"))
        : inlineCss(cssText, doc.baseURI);
    // Pair source and clone nodes before replacing canvases, so image order cannot shift.
    let clone = root.cloneNode(true) as HTMLElement;
    const sources = [root, ...root.querySelectorAll<Element>("*")];
    const targets = [clone, ...clone.querySelectorAll<Element>("*")];
    const inherited = view.getComputedStyle(root.parentElement || root);
    const inheritedProperties = ["font-family", "font-size", "font-weight", "font-style", "line-height", "letter-spacing", "text-align", "text-transform", "color"].map(property => [property, inherited.getPropertyValue(property)]);
    const computed = view.getComputedStyle(root);
    const tokens = Array.from(computed).filter(property => property.startsWith("--")).map(property => [property, computed.getPropertyValue(property)]);
    const contentPending = Promise.all(sources.map(async (source, index) => {
        let target = targets[index];
        if (source.matches(excludeSelector) || source.closest(excludeSelector)) return;
        if (source.localName === "canvas") {
            const canvas = source as HTMLCanvasElement;
            const image = doc.createElement("img");
            try { image.src = canvas.toDataURL("image/png"); } catch { throw new Error("A chart canvas could not be exported."); }
            if (image.src === "data:,") throw new Error("An empty or oversized chart canvas could not be exported.");
            image.alt = canvas.getAttribute("aria-label") || ""; image.className = canvas.className;
            image.style.cssText = canvas.style.cssText; image.style.width = `${canvas.clientWidth}px`; image.style.height = `${canvas.clientHeight}px`;
            if (source === root) clone = image; else target.replaceWith(image);
            target = image;
        } else if (source.localName === "img") {
            const image = source as HTMLImageElement;
            if (!image.getAttribute("src") && !image.currentSrc) throw new Error("An export image is unavailable.");
            target.setAttribute("src", await embed(image.currentSrc || image.src)); target.removeAttribute("srcset"); target.removeAttribute("sizes");
            if (typeof (target as HTMLImageElement).decode === "function") {
                try { await abortable((target as HTMLImageElement).decode(), signal); } catch { signal.throwIfAborted(); throw new Error("An export image could not be decoded."); }
            }
        } else if (source.localName === "image") {
            const href = source.getAttribute("href") || source.getAttributeNS("http://www.w3.org/1999/xlink", "href") || "";
            target.removeAttributeNS("http://www.w3.org/1999/xlink", "href"); target.setAttribute("href", await embed(href));
        } else if (source.localName === "use" && !((source.getAttribute("href") || source.getAttributeNS("http://www.w3.org/1999/xlink", "href") || "").startsWith("#"))) {
            throw new Error("External SVG sprites must be expanded before export.");
        } else if (source.matches("iframe,object,embed,video,audio")) {
            throw new Error("Live media must be converted to a static document before export.");
        }
        if (source.localName === "input") { target.setAttribute("value", (source as HTMLInputElement).value); target.toggleAttribute("checked", (source as HTMLInputElement).checked); }
        if (source.localName === "textarea") target.textContent = (source as HTMLTextAreaElement).value;
        if (source.localName === "option") target.toggleAttribute("selected", (source as HTMLOptionElement).selected);
        if (source.hasAttribute("style")) {
            const style = await inlineCss(source.getAttribute("style")!, doc.baseURI);
            if (source.localName === "canvas") {
                (target as HTMLElement).style.cssText = style;
                (target as HTMLElement).style.width = `${(source as HTMLCanvasElement).clientWidth}px`;
                (target as HTMLElement).style.height = `${(source as HTMLCanvasElement).clientHeight}px`;
            } else target.setAttribute("style", style);
        }
    }));
    const [css] = await Promise.all([cssPending, contentPending]);
    signal.throwIfAborted();
    clone.querySelectorAll(`${excludeSelector},script,style,link,base,source`).forEach(element => element.remove());
    for (const element of [clone, ...clone.querySelectorAll("*")]) {
        for (const attribute of [...element.attributes]) if (/^on/i.test(attribute.name) || attribute.name === "autofocus") element.removeAttribute(attribute.name);
        for (const attribute of ["href", "action", "formaction"]) if (/^\s*javascript:/i.test(element.getAttribute(attribute) || "")) element.removeAttribute(attribute);
    }
    clone.removeAttribute("aria-hidden"); clone.setAttribute("data-prism-export-root", "");
    const output = doc.implementation.createHTMLDocument(title);
    output.documentElement.lang = "ko";
    const charset = output.createElement("meta"); charset.setAttribute("charset", "utf-8"); output.head.prepend(charset);
    const viewport = output.createElement("meta"); viewport.name = "viewport"; viewport.content = "width=device-width,initial-scale=1"; output.head.append(viewport);
    const policy = output.createElement("meta"); policy.httpEquiv = "Content-Security-Policy"; policy.content = "default-src 'none'; img-src data:; font-src data:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"; output.head.append(policy);
    const style = output.createElement("style");
    style.textContent = css.replace(/</g, "\\3c ") + "\nhtml,body{position:static!important;inset:auto!important;width:auto!important;height:auto!important;overflow:auto!important;margin:0} [data-prism-export-root]{position:static!important;inset:auto!important;transform:none!important;visibility:visible!important;pointer-events:auto!important;z-index:auto!important} [data-prism-export-viewer]{max-width:100%;overflow-x:auto} @media print{[data-prism-export-viewer]{max-width:none;overflow:visible}}";
    output.head.append(style);
    const scope = output.createElement("main"); scope.setAttribute("data-prism", "light"); scope.setAttribute("data-prism-export-viewer", "");
    // Retain consumer overrides of scoped design tokens.
    for (const [property, value] of [...inheritedProperties, ...tokens]) scope.style.setProperty(property, value);
    scope.style.cssText = await inlineCss(scope.style.cssText, doc.baseURI);
    signal.throwIfAborted();
    scope.append(output.adoptNode(clone)); output.body.append(scope);
    const html = `<!doctype html>\n${output.documentElement.outerHTML}`;
    return { html, blob: new Blob([html], { type: "text/html;charset=utf-8" }), embeddedAssets: cache.size };
}

export type PrismHtmlExportButtonProps = Omit<PrismHtmlExportOptions, "signal"> & {
    getRoot: () => HTMLElement | null; filename?: string; disabled?: boolean;
    onComplete?: (result: PrismHtmlExportResult) => void; onError?: (error: unknown) => void;
};
export function PrismHtmlExportButton({ getRoot, filename = "profile-template.html", disabled, onComplete, onError, ...options }: PrismHtmlExportButtonProps) {
    const [busy, setBusy] = useState(false); const controller = useRef<AbortController | null>(null);
    const callbacks = useRef({ onComplete, onError }); callbacks.current = { onComplete, onError };
    useEffect(() => () => controller.current?.abort(), []);
    const run = async () => {
        const current = new AbortController(); controller.current = current; setBusy(true);
        try {
            const root = getRoot(); if (!root) throw new Error("The export document is unavailable.");
            const result = await createPrismHtmlDocument(root, { ...options, signal: current.signal }); current.signal.throwIfAborted();
            const name = filename.replace(/[\u0000-\u001f\u007f<>:"/\\|?*]/g, "_").trim() || "profile-template.html";
            downloadPrismBlob(result.blob, /\.html$/i.test(name) ? name : `${name}.html`); callbacks.current.onComplete?.(result);
        } catch (error) { if (!current.signal.aborted) callbacks.current.onError?.(error); }
        finally { if (controller.current === current && !current.signal.aborted) { controller.current = null; setBusy(false); } }
    };
    return <><PrismButton variant="line" disabled={disabled || busy} onClick={() => void run()}>{busy ? "HTML 생성 중" : "HTML 다운로드"}</PrismButton>
        {busy && <PrismButton variant="line" onClick={() => { controller.current?.abort(); controller.current = null; setBusy(false); }}>생성 취소</PrismButton>}</>;
}
