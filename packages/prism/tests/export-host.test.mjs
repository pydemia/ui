import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "http://localhost/" });
for (const key of ["window", "document", "HTMLElement", "Element", "Node", "Event"]) globalThis[key] = dom.window[key];
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createElement: h, act, StrictMode } = await import("react");
const { createRoot } = await import("react-dom/client");
const { PrismPdfDownloadHost } = await import("../dist/index.js");
const root = createRoot(document.getElementById("root"));
const job = (id, data = id) => ({ id, documents: [{ filename: id, data }] });
const pdf = new Blob(["%PDF-1.7\nfixture\n%%EOF"]);
const tick = () => new Promise(resolve => setTimeout(resolve, 5));
const openDownload = async () => ({ write() {}, close() {}, abort() {} });
const unload = () => { const event = new Event("beforeunload", { cancelable: true }); window.dispatchEvent(event); return event.defaultPrevented; };
test("callback rerenders and route content changes keep the same immutable job running once", async () => {
    let resolvePdf, runs = 0; const completions = [], errors = [];
    const renderPdf = async data => { runs++; assert.equal(data, "original"); return new Promise(resolve => { resolvePdf = resolve; }); };
    const host = (route, complete) => h("div", null, h("main", null, route), h(PrismPdfDownloadHost, { jobs: [job("persist", "original")], renderPdf, openDownload, onComplete: complete, onError: error => errors.push(error) }));
    await act(async () => { root.render(host("first", () => completions.push("old"))); await tick(); });
    assert.equal(unload(), true);
    await act(async () => { root.render(host("another menu", () => completions.push("latest"))); await tick(); });
    assert.equal(runs, 1);
    await act(async () => { resolvePdf(pdf); await tick(); }); assert.deepEqual(completions, ["latest"]); assert.deepEqual(errors, []);
    await act(async () => { root.render(host("third", () => completions.push("duplicate"))); await tick(); }); assert.equal(runs, 1);
    await act(async () => root.render(null)); assert.equal(unload(), false);
});
test("removing a job aborts its renderer and suppresses late completion/error", async () => {
    let signal, resolvePdf; const completions = [], errors = [];
    await act(async () => { root.render(h(PrismPdfDownloadHost, { jobs: [job("cancel")], openDownload, renderPdf: async (_, context) => { signal = context.signal; return new Promise(resolve => { resolvePdf = resolve; }); }, onComplete: () => completions.push(true), onError: error => errors.push(error) })); await tick(); });
    assert.equal(signal.aborted, false);
    await act(async () => root.render(null)); assert.equal(signal.aborted, true); assert.equal(unload(), false);
    await act(async () => { resolvePdf(pdf); await tick(); }); assert.deepEqual(completions, []); assert.deepEqual(errors, []);
});
test("StrictMode replay starts only one committed download and leaves no unload handler", async () => {
    const completions = [], errors = []; let closed = 0;
    await act(async () => { root.render(h(StrictMode, null, h(PrismPdfDownloadHost, { jobs: [job("strict")], renderPdf: async () => pdf,
        openDownload: async () => ({ write() {}, close() { closed++; }, abort() {} }), onComplete: id => completions.push(id), onError: error => errors.push(error) }))); await tick(); });
    assert.equal(closed, 1); assert.deepEqual(completions, ["strict"]); assert.deepEqual(errors, []);
    await act(async () => root.render(null)); assert.equal(unload(), false);
});
