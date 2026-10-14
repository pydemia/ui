import assert from "node:assert/strict";
import test from "node:test";
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
const { PrismCriteriaEditor, PrismCriteriaRemapDialog, PrismCompanyContextDialog } = await import("../dist/index.js");
const root = createRoot(document.getElementById("root"));
const render = node => act(async () => root.render(node));
const click = node => { assert.ok(node, "Expected control"); return act(async () => node.click()); };
const button = label => [...document.querySelectorAll("button")].find(node => node.textContent === label);

test("name check authorizes only the exact current criterion name", async () => {
    const checked = [], submitted = [];
    const draft = { name: "첫 이름", description: "가상 기준 설명", categoryId: "tech" };
    const props = { title: "기준 편집", open: true, onOpenChange: () => {}, onValueChange: () => {}, onSubmit: value => submitted.push(value), categories: [{ id: "tech", label: "기술" }], checkStatus: "available", onCheck: name => checked.push(name), onGenerate: () => {} };
    await render(h(PrismCriteriaEditor, { ...props, value: draft, checkedName: "첫 이름" }));
    assert.equal(button("저장").disabled, false);
    await render(h(PrismCriteriaEditor, { ...props, value: { ...draft, name: "둘째 이름" }, checkedName: "첫 이름" }));
    assert.equal(button("저장").disabled, true);
    assert.equal(button("정의 생성").disabled, true);
    assert.match(document.querySelector(".prism-criteria-check").textContent, /중복 확인이 필요/);
    await click(button("중복 확인"));
    assert.deepEqual(checked, ["둘째 이름"]);
    await render(h(PrismCriteriaEditor, { ...props, value: { ...draft, name: " 둘째 이름 " }, checkedName: "둘째 이름" }));
    await click(button("저장"));
    assert.equal(submitted[0].name, "둘째 이름");
    await render(null);
});

test("remapping waits for a successful load and excludes unsafe replacements", async () => {
    const confirmed = [];
    const base = { open: true, onOpenChange: () => {}, targetId: "old", targetName: "이전 기준", positions: [{ id: "p1", name: "가상 포지션", company: "가상 회사" }], options: [{ id: "old", label: "이전 기준" }, { id: "next", label: "새 기준" }, { id: "pending", label: "반영 중", change: "applying" }], value: { p1: "pending" }, onValueChange: () => {}, onConfirm: value => confirmed.push(value), loadedTargetId: "old" };
    await render(h(PrismCriteriaRemapDialog, { ...base, loadState: "loading" }));
    assert.equal(button("삭제").disabled, true);
    assert.match(document.querySelector('[role="status"]').textContent, /불러오는 중/);
    await render(h(PrismCriteriaRemapDialog, { ...base, loadState: "error" }));
    assert.equal(button("삭제").disabled, true);
    assert.match(document.querySelector('[role="alert"]').textContent, /불러오지 못/);
    await render(h(PrismCriteriaRemapDialog, { ...base, loadState: "ready" }));
    assert.equal(button("삭제").disabled, true);
    await click(document.querySelector('[role="combobox"]'));
    assert.deepEqual([...document.querySelectorAll('[role="option"]')].map(node => node.dataset.value), ["", "next"]);
    await render(h(PrismCriteriaRemapDialog, { ...base, value: { p1: "next" }, loadState: "ready" }));
    assert.equal(button("삭제").disabled, false);
    await render(h(PrismCriteriaRemapDialog, { ...base, value: { p1: "next" }, loadState: "ready", targetId: "another" }));
    assert.equal(button("삭제").disabled, true);
    assert.match(document.querySelector('[role="status"]').textContent, /불러오는 중/);
    await render(h(PrismCriteriaRemapDialog, { ...base, value: { p1: "next" }, loadState: "ready" }));
    await click(button("삭제"));
    assert.deepEqual(confirmed, [{ p1: "next" }]);
    await render(null);
});

test("company context copy reports success and failure without changing supplied content", async () => {
    const contents = [];
    const base = { open: true, onOpenChange: () => {}, company: "가상 회사", content: "합성 과제\n둘째 줄" };
    await render(h(PrismCompanyContextDialog, { ...base, onCopy: async content => contents.push(content) }));
    await click(button("내용 복사"));
    assert.deepEqual(contents, [base.content]);
    assert.ok(button("복사 완료"));
    assert.equal(document.querySelector(".prism-company-context-body").textContent, base.content);
    await render(h(PrismCompanyContextDialog, { ...base, content: "새 내용", onCopy: async () => { throw new Error("synthetic copy failure"); } }));
    await click(button("내용 복사"));
    assert.match(document.querySelector('[role="alert"]').textContent, /복사하지 못/);
    await render(null);
});

test("company context default copy sends the supplied text to the Clipboard API", async () => {
    const writes = [];
    Object.defineProperty(window, "isSecureContext", { configurable: true, value: true });
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: async text => { writes.push(text); } } });
    await render(h(PrismCompanyContextDialog, { open: true, onOpenChange: () => {}, company: "가상 회사", content: "첫 줄\n둘째 줄" }));
    await click(button("내용 복사"));
    assert.deepEqual(writes, ["첫 줄\n둘째 줄"]);
    assert.ok(button("복사 완료"));
    await render(null);
});
