import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";
const dom = new JSDOM('<!doctype html><div id="root"></div>', { url: "http://localhost/", pretendToBeVisual: true });
for (const key of ["window", "document", "HTMLElement", "Element", "Node", "Event", "KeyboardEvent", "MouseEvent", "MutationObserver", "DocumentFragment", "CustomEvent", "NodeFilter"]) globalThis[key] = dom.window[key];
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
globalThis.getComputedStyle = dom.window.getComputedStyle;
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createElement: h, act } = await import("react");
const { createRoot } = await import("react-dom/client");
const { PrismTooltip, PrismSummaryBadge } = await import("../dist/index.js");
const { renderToStaticMarkup } = await import("react-dom/server");
const root = createRoot(document.getElementById("root"));
const tooltip = () => document.querySelector('[role="tooltip"]');
test("summary omits empty explanations and the no-data state has no help control", () => {
    for (const note of [undefined, null, false, "", "  \n"]) {
        const html = renderToStaticMarkup(h(PrismSummaryBadge, { label: "가상", summary: "가상 내용", note }));
        assert.doesNotMatch(html, /prism-summary-info/);
    }
    const empty = renderToStaticMarkup(h(PrismSummaryBadge, { label: "가상", summary: null, note: "미표시 내용" }));
    assert.doesNotMatch(empty, /prism-summary-info/);
    assert.match(empty, /관련 데이터 없음/);
    const present = renderToStaticMarkup(h(PrismSummaryBadge, { label: "가상", summary: "가상 내용", note: "본문" }));
    assert.match(present, /aria-label="가상 설명"/);
    assert.match(present, /aria-expanded="false"/);
});
test("a controlled tooltip emits close intent without changing owner-supplied open state", async () => {
    let next;
    await act(async () => root.render(h(PrismTooltip, { content: "호스트 도움말", open: true, onOpenChange: value => { next = value; }, arrow: false }, h("button", null, "도움말"))));
    assert.equal(tooltip().textContent, "호스트 도움말");
    await act(async () => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
    assert.equal(next, false);
    assert.equal(tooltip().textContent, "호스트 도움말");
    assert.equal(document.querySelector(".prism-tooltip-arrow"), null);
});
test.after(async () => { await act(async () => root.unmount()); dom.window.close(); });
