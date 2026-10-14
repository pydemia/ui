import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { transform } from "esbuild";
import { JSDOM } from "jsdom";

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "http://localhost/", pretendToBeVisual: true });
for (const key of ["window", "document", "HTMLElement", "Element", "Node", "Event", "MouseEvent", "KeyboardEvent", "MutationObserver", "DocumentFragment", "CustomEvent", "NodeFilter", "HTMLInputElement", "HTMLButtonElement", "HTMLFormElement"]) globalThis[key] = dom.window[key];
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
globalThis.getComputedStyle = dom.window.getComputedStyle;
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createElement: h, act } = await import("react");
const { createRoot } = await import("react-dom/client");
const { renderToStaticMarkup } = await import("react-dom/server");
const { PrismAnalysis, getPrismHistoryDeletionAction } = await import("../dist/index.js");

test("leadership results retain order, duplicates and plain text before the title/summary", () => {
    const factor = Object.freeze({ id: "lead", kind: "leadership", label: "리더십", title: "합성 제목", results: Object.freeze(["가상 강점", "가상 강점", '<img src=x onerror="bad">']), summary: "합성 요약" });
    const before = JSON.stringify(factor), doc = new JSDOM(renderToStaticMarkup(h(PrismAnalysis, { factors: [factor] }))).window.document;
    const content = doc.querySelector('[data-kind="leadership"] .prism-analysis-factor-content');
    assert.deepEqual([...content.querySelectorAll('.prism-tag[data-variant="blue"]')].map(node => node.textContent), [...factor.results]);
    assert.equal(content.children[3].textContent, "합성 제목");
    assert.equal(content.children[4].textContent, "합성 요약");
    assert.equal(content.querySelectorAll("img,button,a").length, 0);
    assert.equal(JSON.stringify(factor), before);
});
test("missing leadership results do not remove a title or missing-data message", () => {
    const doc = new JSDOM(renderToStaticMarkup(h(PrismAnalysis, { panel: true, factors: [{ id: "lead", kind: "leadership", label: "리더십", title: "확인 중", results: [], summary: null }] }))).window.document;
    assert.equal(doc.querySelectorAll('[data-kind="leadership"] .prism-tag').length, 0);
    assert.match(doc.querySelector('[data-kind="leadership"]').textContent, /확인 중.*관련 데이터 없음/);
});
test("linked current deletion navigates once while root current deletion resets the session", () => {
    assert.equal(getPrismHistoryDeletionAction("current", { routeConversationId: "current", activeConversationId: "current" }), "navigate-intro");
    assert.equal(getPrismHistoryDeletionAction("current", { routeConversationId: null, activeConversationId: "current" }), "reset-intro-session");
    assert.equal(getPrismHistoryDeletionAction("current", { activeConversationId: "current" }), "reset-intro-session");
});
test("deleting another record preserves the current route, including a stale store ID", () => {
    const context = Object.freeze({ routeConversationId: "other", activeConversationId: "current", privateField: "must-not-return" });
    assert.equal(getPrismHistoryDeletionAction("current", context), "preserve-view");
    assert.equal(getPrismHistoryDeletionAction("current", { routeConversationId: null, activeConversationId: "other" }), "preserve-view");
    assert.throws(() => getPrismHistoryDeletionAction(" ", context), /identifier/);
});
test("the host computes deletion effects from completion-time context", async () => {
    let resolve;
    const deleted = new Promise(yes => { resolve = yes; });
    let context = { routeConversationId: "current", activeConversationId: "current" };
    const completion = deleted.then(() => getPrismHistoryDeletionAction("current", context));
    context = { routeConversationId: "other", activeConversationId: "other" };
    resolve(); assert.equal(await completion, "preserve-view");
});

const compiled = await transform(await readFile(new URL('../../../apps/docs/src/prism/sidebar-history-demo.tsx', import.meta.url), 'utf8'), { loader: 'tsx', jsx: 'automatic', format: 'esm' });
const portable = compiled.code.replace(/\bfrom\s+["']([^"']+)["']/g, (_match, name) => { assert.ok(['react', 'react/jsx-runtime', '@pydemia/prism'].includes(name)); return 'from ' + JSON.stringify(import.meta.resolve(name)); });
const { SidebarHistoryExample } = await import('data:text/javascript;base64,' + Buffer.from(portable).toString('base64'));
const root = createRoot(document.getElementById("root"));
test.afterEach(async () => { await act(async () => root.render(null)); });
const button = name => [...document.querySelectorAll('button')].find(node => node.textContent === name || node.getAttribute('aria-label') === name);
const click = async name => { const node = button(name); assert.ok(node, name); await act(async () => node.click()); };
const waitFor = async predicate => { const deadline = Date.now() + 1500; while (!predicate() && Date.now() < deadline) await act(async () => new Promise(resolve => setTimeout(resolve, 10))); assert.ok(predicate(), "Expected completed UI condition"); };
async function deleteCurrent() { await click("현재 합성 대화 메뉴 열기"); await waitFor(() => button("채팅 삭제")); await click("채팅 삭제"); await click("삭제"); }
test("complete sidebar example preserves failed records and applies the route-specific success effect", async () => {
    await act(async () => root.render(h(SidebarHistoryExample)));
    const checkbox = document.querySelector('input[type="checkbox"]'); await act(async () => checkbox.click());
    await deleteCurrent(); await waitFor(() => document.querySelector('[role="alert"]'));
    assert.ok(button("현재 합성 대화")); assert.match(document.body.textContent, /선택한 화면: current · 세션 키: 0/);
    await click("삭제"); await waitFor(() => document.body.textContent.includes("navigate-intro"));
    assert.equal(button("현재 합성 대화"), undefined); assert.ok(button("다른 합성 대화")); assert.match(document.body.textContent, /선택한 화면: intro · 세션 키: 0/);
    await act(async () => { root.render(null); }); await act(async () => root.render(h(SidebarHistoryExample)));
    const select = document.querySelector('select'); await act(async () => { select.value = "root"; select.dispatchEvent(new Event('change', { bubbles: true })); });
    await deleteCurrent(); await waitFor(() => document.body.textContent.includes("reset-intro-session"));
    assert.match(document.body.textContent, /선택한 화면: intro · 세션 키: 1/);
});
