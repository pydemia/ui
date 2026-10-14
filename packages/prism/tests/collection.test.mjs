import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "http://localhost/" });
for (const key of ["window", "document", "HTMLElement", "HTMLButtonElement", "HTMLTextAreaElement", "Element", "Node", "Event", "KeyboardEvent", "MouseEvent", "MutationObserver"]) globalThis[key] = dom.window[key];
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
globalThis.getComputedStyle = dom.window.getComputedStyle;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createElement: h, act } = await import("react");
const { createRoot } = await import("react-dom/client");
const { renderToStaticMarkup } = await import("react-dom/server");
const { PrismCandidateCollection, PrismMemoComposer } = await import("../dist/index.js");

const candidate = { id: "demo", name: "김가상", company: "가상전자", position: "기술전략담당" };
const collection = props => new JSDOM(renderToStaticMarkup(h(PrismCandidateCollection, {
    title: "후보자 목록", candidates: [candidate], total: 12, view: "cards", onViewChange: () => {}, onOpen: () => {}, ...props,
}))).window.document;

test("a retained candidate stays readable during refresh while an initial load uses a skeleton", () => {
    const refreshing = collection({ status: "loading" });
    assert.equal(refreshing.querySelector(".prism-candidate-collection").getAttribute("aria-busy"), "true");
    assert.match(refreshing.querySelector(".prism-section-title").textContent, /12/);
    assert.match(refreshing.body.textContent, /김가상/);
    assert.equal(refreshing.querySelector(".prism-skeleton-group"), null);
    const initial = collection({ candidates: [], status: "loading" });
    assert.doesNotMatch(initial.body.textContent, /김가상/);
    assert.ok(initial.querySelector(".prism-skeleton-group"));
});

test("memo submission preserves nonblank user text, including surrounding whitespace", async () => {
    const submissions = [];
    const root = createRoot(document.getElementById("root"));
    const props = { value: "  보존할 메모\n  ", onValueChange: () => {}, onSubmit: value => submissions.push(value) };
    await act(async () => root.render(h(PrismMemoComposer, props)));
    const textarea = document.querySelector("textarea");
    await act(async () => textarea.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", shiftKey: true, bubbles: true })));
    assert.equal(submissions.length, 0);
    await act(async () => textarea.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", isComposing: true, bubbles: true })));
    assert.equal(submissions.length, 0);
    await act(async () => textarea.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })));
    assert.deepEqual(submissions, ["  보존할 메모\n  "]);
    await act(async () => root.unmount());
});
