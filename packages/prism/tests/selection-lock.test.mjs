import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "http://localhost/", pretendToBeVisual: true });
for (const key of ["window", "document", "HTMLElement", "HTMLButtonElement", "HTMLInputElement", "Element", "Node", "Event", "MouseEvent", "KeyboardEvent", "MutationObserver", "DocumentFragment", "CustomEvent", "NodeFilter"]) globalThis[key] = dom.window[key];
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
globalThis.getComputedStyle = dom.window.getComputedStyle;
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const { createElement: h, useState, act } = await import("react");
const { createRoot } = await import("react-dom/client");
const { PrismMultiSelect, PrismDatePicker, PrismDateRange } = await import("../dist/index.js");
const root = createRoot(document.getElementById("root"));
const render = node => act(async () => root.render(node));
const click = node => { assert.ok(node, "Expected control"); return act(async () => node.click()); };
test.afterEach(() => render(null));

test("multi-select keeps the source non-search default and closes an open menu when locked", async () => {
    let setLocked, setReadonly, selected = [], changes = [];
    const options = [{ value: "a", label: "가상 회사" }, { value: "b", label: "예시 회사" }];
    function Host() {
        const [value, onValueChange] = useState([]);
        const [disabled, disable] = useState(false);
        const [readOnly, makeReadonly] = useState(false);
        setLocked = disable; setReadonly = makeReadonly; selected = value;
        return h(PrismMultiSelect, { label: "회사", options, value, disabled, readOnly, onValueChange: next => { changes.push(next); onValueChange(next); } });
    }
    await render(h(Host));
    await click(document.querySelector('[role="combobox"]'));
    assert.ok(document.querySelector('.prism-dropdown'));
    assert.equal(document.querySelector('input[aria-label="회사 항목 검색"]'), null);
    await click(document.querySelector('.prism-dropdown [role="checkbox"]'));
    assert.deepEqual(selected, ["a", "b"]);
    await act(async () => setLocked(true));
    assert.equal(document.querySelector('.prism-dropdown'), null);
    assert.equal(document.querySelector('[role="combobox"]').disabled, true);
    assert.deepEqual(selected, ["a", "b"]);
    assert.equal(changes.length, 1);
    await act(async () => setLocked(false));
    assert.equal(document.querySelector('.prism-dropdown'), null);
    await click(document.querySelector('[role="combobox"]'));
    await act(async () => setReadonly(true));
    assert.equal(document.querySelector('.prism-dropdown'), null);
    assert.deepEqual(selected, ["a", "b"]);
    await render(h(PrismMultiSelect, { label: "회사", options, value: [], onValueChange() {}, searchable: true }));
    await click(document.querySelector('[role="combobox"]'));
    assert.ok(document.querySelector('input[aria-label="회사 항목 검색"]'));
});

test("date picker discards an uncommitted draft and closes its calendar when readonly or disabled", async () => {
    let setReadonly, setDisabled; const changes = [];
    function Host() {
        const [readOnly, makeReadonly] = useState(false);
        const [disabled, disable] = useState(false);
        setReadonly = makeReadonly; setDisabled = disable;
        return h(PrismDatePicker, { label: "기준일", value: "2026-10-12", inputEditable: true, readOnly, disabled, onValueChange: next => changes.push(next) });
    }
    await render(h(Host));
    await click(document.querySelector('button[aria-label="기준일 달력 열기"]'));
    assert.ok(document.querySelector('.prism-calendar-popover'));
    const input = document.querySelector('.prism-date-input input');
    await act(async () => { Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, "value").set.call(input, "2026-11-30"); input.dispatchEvent(new Event("input", { bubbles: true })); });
    assert.equal(input.value, "2026-11-30");
    await act(async () => setReadonly(true));
    assert.equal(document.querySelector('.prism-calendar-popover'), null);
    assert.equal(input.value, "2026-10-12");
    await act(async () => input.dispatchEvent(new dom.window.FocusEvent("focusout", { bubbles: true })));
    assert.deepEqual(changes, []);
    await act(async () => setReadonly(false));
    assert.equal(document.querySelector('.prism-calendar-popover'), null);
    await click(document.querySelector('button[aria-label="기준일 달력 열기"]'));
    assert.ok(document.querySelector('.prism-calendar-popover'));
    await act(async () => setDisabled(true));
    assert.equal(document.querySelector('.prism-calendar-popover'), null);
    assert.equal(document.querySelector('button[aria-label="기준일 달력 열기"]').disabled, true);
    assert.deepEqual(changes, []);
});

test("date range reports an inverted value once and blocks earlier end dates", async () => {
    await render(h(PrismDateRange, { label: "조회 기간", start: "2026-10-12", end: "2026-10-01", onValueChange() {} }));
    assert.equal(document.querySelectorAll('.prism-error').length, 1);
    assert.match(document.querySelector('.prism-error').textContent, /종료일은 시작일 이후/);
    await click(document.querySelector('button[aria-label="조회 기간 종료일 달력 열기"]'));
    assert.ok(document.querySelector('.prism-calendar-popover'));
    assert.equal(document.querySelector('button[aria-label="Sunday, October 11th, 2026"]')?.disabled, true);
    assert.equal(document.querySelector('button[aria-label="Monday, October 12th, 2026"]')?.disabled, false);
});
