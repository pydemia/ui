import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "http://localhost/", pretendToBeVisual: true });
for (const key of ["window", "document", "HTMLElement", "Element", "Node", "Event", "MouseEvent", "MutationObserver"]) globalThis[key] = dom.window[key];
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const { createElement: h, act } = await import("react");
const { createRoot } = await import("react-dom/client");
const { PrismCompensationTable, PrismValidationList, PrismCommentEditor } = await import("../dist/index.js");
const root = createRoot(document.getElementById("root"));
const render = element => act(async () => root.render(element));
test.afterEach(async () => { await render(null); });

test("normalized records retain actual zero, distinguish missing pay and show an explicit empty validation state", async () => {
    await render(h("div", null,
        h(PrismCompensationTable, { rows: [{ id: "one", year: "2026", cash: 0, stock: null, total: 0 }] }),
        h(PrismValidationList, { title: "전문성 검증", items: [] })));
    const table = document.querySelector(".prism-compensation table");
    assert.equal(document.querySelector(".prism-compensation h3").textContent, "보상 정보");
    assert.deepEqual([...table.querySelectorAll("tbody tr > *")].map(cell => cell.textContent), ["2026", "0", "정보 없음", "0"]);
    assert.equal(table.querySelector("caption").textContent, "연도별 보상 정보");
    assert.equal(document.querySelector(".prism-validation-list").textContent, "검증 자료가 없습니다.");
});

test("controlled comment submits trimmed content once and rejects blank or busy submissions", async () => {
    const saves = [];
    const show = (value, busy = false) => render(h(PrismCommentEditor, { value, busy, onValueChange: () => {}, onSave: value => saves.push(value) }));
    const submit = () => act(async () => document.querySelector("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
    await show("   "); await submit(); assert.deepEqual(saves, []);
    await show("  가상 의견  "); await submit(); assert.deepEqual(saves, ["가상 의견"]);
    await show("다른 의견", true); await submit(); assert.deepEqual(saves, ["가상 의견"]);
    assert.equal(document.querySelector('button[type="submit"]').disabled, true);
});
