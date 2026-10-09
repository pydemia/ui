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
const { PrismTooltip, PrismInfoTooltip, PrismInputLabel, PrismSummaryBadge } = await import("../dist/index.js");
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
test("input label keeps its native control association separate from the help button", async () => {
    await act(async () => root.render(h("div", null,
        h(PrismInputLabel, { htmlFor: "labelled-input", required: true, tooltip: "입력 방법", tooltipLabel: "이름 입력 설명", suffix: h("span", { "data-suffix": true }, "선택 기준") }, "이름"),
        h("input", { id: "labelled-input", required: true }))));
    const input = document.getElementById("labelled-input");
    const label = input.labels[0];
    const help = document.querySelector('[aria-label="이름 입력 설명"]');
    assert.equal(input.labels.length, 1);
    assert.equal(label.contains(help), false);
    assert.equal(help.type, "button");
    assert.equal(help.getAttribute("aria-expanded"), "false");
    assert.equal(label.querySelector(".prism-input-required").getAttribute("aria-hidden"), "true");
    assert.equal(label.querySelector("[data-suffix]").textContent, "선택 기준");
    for (const tooltipText of [undefined, "", " \n "]) {
        await act(async () => root.render(h("div", null,
            h(PrismInputLabel, { htmlFor: "plain-input", tooltip: tooltipText }, "이름"), h("input", { id: "plain-input" }))));
        assert.equal(document.getElementById("plain-input").labels.length, 1);
        assert.equal(document.querySelector(".prism-info-tooltip-trigger"), null);
    }
});
test("an uncontrolled info button toggles without submitting its containing form", async () => {
    let submitted = 0;
    await act(async () => root.render(h("form", { onSubmit: event => { event.preventDefault(); submitted++; } },
        h(PrismInfoTooltip, { label: "입력 설명", content: "도움말", arrow: false }))));
    const help = document.querySelector('[aria-label="입력 설명"]');
    await act(async () => help.click());
    assert.equal(help.getAttribute("aria-expanded"), "true");
    assert.equal(tooltip().textContent, "도움말");
    await act(async () => help.click());
    assert.equal(help.getAttribute("aria-expanded"), "false");
    assert.equal(tooltip(), null);
    assert.equal(submitted, 0);
});
test("an info tooltip leaves controlled state with its owner", async () => {
    const changes = [];
    const render = open => h(PrismInfoTooltip, { label: "제어된 설명", content: "호스트 도움말", arrow: false, open, onOpenChange: value => changes.push(value) });
    await act(async () => root.render(render(true)));
    const help = document.querySelector('[aria-label="제어된 설명"]');
    await act(async () => help.click());
    assert.equal(changes.at(-1), false);
    assert.equal(help.getAttribute("aria-expanded"), "true");
    assert.equal(tooltip().textContent, "호스트 도움말");
    await act(async () => root.render(render(false)));
    assert.equal(help.getAttribute("aria-expanded"), "false");
    assert.equal(tooltip(), null);
    assert.throws(() => renderToStaticMarkup(h(PrismInfoTooltip, { label: "  ", content: "본문" })), /requires a label/);
});
test.after(async () => { await act(async () => root.unmount()); dom.window.close(); });
