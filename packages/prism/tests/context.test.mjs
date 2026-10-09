import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "http://localhost/", pretendToBeVisual: true });
for (const key of ["window","document","HTMLElement","Element","Node","Event","KeyboardEvent","MouseEvent","MutationObserver","HTMLInputElement","HTMLTextAreaElement","HTMLButtonElement","DocumentFragment","CustomEvent"]) globalThis[key] = dom.window[key];
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
globalThis.getComputedStyle = dom.window.getComputedStyle; globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window); globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }; globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createElement: h, act, useState } = await import("react"), { createRoot } = await import("react-dom/client");
const { PrismContextForm, PrismContextSection, createPrismContextResponse } = await import("../dist/index.js");
const root = createRoot(document.getElementById("root"));
const required = { key: "issue", label: "현안", type: "textarea", required: true };
const props = { fields: [required], defaultOpenFields: ["issue"], onValueChange() {}, onSubmit() {} };
const save = () => document.querySelector('button[type=submit]');
const render = async value => act(async () => root.render(value));
const clear = async () => render(null);

test("required context uses trimmed 50-unit length but preserves internal whitespace and raw count", async () => {
    for (const value of ["", " ".repeat(60), "가".repeat(49), `  ${"가".repeat(49)}  `]) {
        await render(h(PrismContextForm, { ...props, values: { issue: value } })); assert.equal(save().disabled, true);
    }
    const value = `  ${"가".repeat(48)} 나  `;
    await render(h(PrismContextForm, { ...props, values: { issue: value } })); assert.equal(save().disabled, false); assert.equal(document.querySelector('textarea').rows, 11);
    assert.equal(document.querySelector('.prism-context-char-count').textContent, `${value.length} / 800`); assert.equal(document.querySelector('[role=alert]'), null);
    await clear();
});

test("optional short text and the exact 800 boundary warn without blocking a valid source submission", async () => {
    const fields = [required, { key: "optional", label: "선택 내용", type: "textarea" }];
    await render(h(PrismContextForm, { ...props, fields, defaultOpenFields: ["issue", "optional"], values: { issue: "가".repeat(50), optional: "짧은 입력" } }));
    assert.equal(save().disabled, false); assert.match(document.querySelector('[role=alert]').textContent, /최소 50/);
    await render(h(PrismContextForm, { ...props, values: { issue: "가".repeat(800) } })); assert.equal(save().disabled, false); assert.match(document.querySelector('[role=alert]').textContent, /800자 이내/);
    await render(h(PrismContextForm, { ...props, values: { issue: "가".repeat(801) } })); assert.equal(save().disabled, true); await clear();
});

test("structured response preserves service keys, option order and descriptors without leaking extra state", () => {
    const fields = [required, { key: "empty", label: "빈 내용", type: "textarea" }, { key: "expertise:job-1", label: "전문성", type: "options", options: [{ value: "first", label: "첫 항목", description: "원래 설명" }, { value: "second", label: "둘째 항목" }] }];
    const values = { issue: "  원문 유지  ", empty: "   ", "expertise:job-1": ["second", "first", "unknown"], internal: "분리할 내부 값" };
    assert.deepEqual(createPrismContextResponse(fields, values), { action: "submit", values: { issue: "  원문 유지  ", empty: "", "expertise:job-1": [{ value: "first", label: "첫 항목", description: "원래 설명" }, { value: "second", label: "둘째 항목", description: "" }] } });
});

test("clicked submit labels and close/cancel actions produce the matching intent once", async () => {
    const calls = [], actions = [{ value: "cancel", label: "돌아가기" }, { value: "submit", label: "등록" }, { value: "submit", label: "계속하기" }];
    await render(h(PrismContextForm, { fields: [required], values: { issue: "가".repeat(50) }, onValueChange() {}, actions, onAction: (...args) => calls.push(args) }));
    await act(async () => [...document.querySelectorAll('button')].find(button => button.textContent === "계속하기").click()); assert.equal(calls.length, 1); assert.equal(calls[0][1], "계속하기");
    await act(async () => document.querySelector('[aria-label="맥락 정보 닫기"]').click()); assert.deepEqual(calls[1], [{ action: "cancel", label: "돌아가기" }, "돌아가기"]); await clear();
});

test("collapsed sections preserve controlled values and description clicks toggle a card only once", async () => {
    let calls = 0;
    function Demo() {
        const [values, setValues] = useState({ issue: "가".repeat(50), areas: [] });
        return h(PrismContextForm, { fields: [required, { key: "areas", label: "분야", type: "options", maxSelections: 1, options: [{ value: "a", label: "항목 A", description: "설명 A" }, { value: "b", label: "항목 B" }] }], values, onValueChange: value => { calls++; setValues(value); }, onSubmit() {} });
    }
    await render(h(Demo)); assert.equal(document.querySelector('textarea'), null);
    const headers = [...document.querySelectorAll('.prism-context-section-header')]; await act(async () => headers[0].click()); assert.equal(document.querySelector('textarea').value.length, 50);
    await act(async () => { headers[0].click(); headers[1].click(); });
    await act(async () => document.querySelector('.prism-context-option p').click()); assert.equal(calls, 1); assert.equal(document.querySelectorAll('[role=checkbox]')[1].disabled, true);
    await act(async () => document.querySelectorAll('[role=checkbox]')[0].click()); assert.equal(calls, 2); assert.equal(document.querySelectorAll('[role=checkbox]')[1].disabled, false);
    await act(async () => headers[0].click()); assert.equal(document.querySelector('textarea').value.length, 50); await clear();
});

test("busy/read-only protect input and submit while a controlled section leaves expansion with its owner", async () => {
    await render(h(PrismContextForm, { ...props, values: { issue: "가".repeat(50) }, readOnly: true })); assert.equal(document.querySelector('textarea').readOnly, true); assert.equal(save().disabled, true);
    await render(h(PrismContextForm, { ...props, values: { issue: "가".repeat(50) }, busy: true })); assert.equal(document.querySelector('textarea').disabled, true); assert.equal(save().disabled, true); await clear();
    const changes = [];
    await render(h(PrismContextSection, { number: 1, title: "항목", required: true, open: false, onOpenChange: value => changes.push(value), children: h('p', null, "본문") }));
    await act(async () => document.querySelector('button').click()); assert.deepEqual(changes, [true]); assert.equal(document.querySelector('button').getAttribute('aria-expanded'), "false"); await clear();
});
