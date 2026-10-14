import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "http://localhost/", pretendToBeVisual: true });
for (const key of ["window", "document", "HTMLElement", "Element", "Node", "Event", "MouseEvent", "MutationObserver", "HTMLInputElement"]) globalThis[key] = dom.window[key];
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const { createElement: h, act } = await import("react");
const { createRoot } = await import("react-dom/client");
const { PrismManagementForm, PrismAiGenerateButton } = await import("../dist/index.js");
const root = createRoot(document.getElementById("root"));
const fields = [
    { id: "companyIds", label: "회사 선택", kind: "multi", required: true, options: [{ value: "one", label: "가상전자" }] },
    { id: "date", label: "발표일", kind: "date", required: true },
];
const submit = () => act(async () => document.querySelector("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
test.afterEach(async () => { await act(async () => root.render(null)); });

test("required management fields report missing values and submit only the completed controlled draft", async () => {
    const saves = []; let generated = 0;
    const render = (values, busy = false, readOnly = false) => act(async () => root.render(h(PrismManagementForm, {
        title: "관리 정보", fields, values, busy, readOnly, onValueChange: () => {}, onSubmit: value => saves.push(value),
    }, h(PrismAiGenerateButton, { label: "AI 생성", disabled: readOnly, busy, onGenerate: () => generated++ }))));
    await render({ companyIds: [], date: null });
    assert.equal(document.querySelector('.prism-multi-select [role="combobox"]').getAttribute("aria-required"), "true");
    assert.equal(document.querySelector('.prism-date-input input').getAttribute("aria-required"), "true");
    await act(async () => [...document.querySelectorAll("button")].find(button => button.textContent === "AI 생성").click());
    assert.equal(generated, 1); assert.equal(saves.length, 0);
    await submit();
    assert.match(document.querySelector(".prism-management-form").textContent, /회사 선택을 입력해 주세요/);
    assert.match(document.querySelector(".prism-management-form").textContent, /발표일을 입력해 주세요/);
    assert.equal(saves.length, 0);
    const completed = { companyIds: ["one"], date: "2026-10-14" };
    await render(completed); await submit(); assert.deepEqual(saves, [completed]);
    await render(completed, true); await submit(); assert.equal(saves.length, 1);
    await render(completed, false, true); await submit(); assert.equal(saves.length, 1);
    assert.equal(document.querySelector('.prism-management-form > footer'), null);
    assert.equal([...document.querySelectorAll("button")].find(button => button.textContent === "AI 생성").disabled, true);
});
