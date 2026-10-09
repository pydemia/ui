import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "http://localhost/", pretendToBeVisual: true });
for (const key of ["window","document","HTMLElement","HTMLInputElement","HTMLButtonElement","HTMLTextAreaElement","Element","Node","Event","FocusEvent","KeyboardEvent","MouseEvent","MutationObserver","DocumentFragment","CustomEvent","NodeFilter"]) globalThis[key] = dom.window[key];
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
globalThis.getComputedStyle = dom.window.getComputedStyle;
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window); globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }; globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createElement: h, act, useState } = await import("react"), { createRoot } = await import("react-dom/client");
const { PrismProfileMemoCard, PrismProfileMemoCollection, PrismProfileMemoComposer } = await import("../dist/index.js");
const root = createRoot(document.getElementById("root"));
const own = { id: "one", content: "첫 메모", createdAt: "2026-10-08", updatedAt: "2026-10-09", isMine: true };
const tick = () => new Promise(resolve => setTimeout(resolve, 10));
const buttons = name => [...document.querySelectorAll('button')].filter(button => button.textContent === name || button.getAttribute('aria-label') === name);
async function click(button) { await act(async () => button.click()); }
async function enter(element, value) { await act(async () => { Object.getOwnPropertyDescriptor(dom.window.HTMLTextAreaElement.prototype, "value").set.call(element, value); element.dispatchEvent(new Event("input", { bubbles: true })); }); }
const unmount = async () => act(async () => root.render(null));

test("personal memo collection excludes non-own records and preserves updated or unparseable dates", async () => {
    await act(async () => root.render(h(PrismProfileMemoCollection, { items: [own, { ...own, id: "other", content: "다른 소유 기록", isMine: false }, { ...own, id: "unconfirmed", content: "불명확한 소유 기록", isMine: "false" }], editingId: null, onEditingChange() {} })));
    assert.equal(document.querySelectorAll('article').length, 1); assert.ok(!document.body.textContent.includes("다른 소유 기록"));
    assert.ok(!document.body.textContent.includes("불명확한 소유 기록"));
    assert.equal(document.querySelector('.prism-profile-memo-total').textContent, "전체 1"); assert.match(document.querySelector('time').textContent, /2026\.10\.09/); assert.match(document.querySelector('article').textContent, /수정됨/);
    assert.equal(document.querySelector('.prism-avatar'), null, "current memo has no author/avatar header");
    await act(async () => root.render(h(PrismProfileMemoCollection, { items: [{ ...own, createdAt: "확인되지 않은 날짜", updatedAt: undefined }], editingId: null, onEditingChange() {} })));
    assert.equal(document.querySelector('.prism-profile-memo-date').textContent, "확인되지 않은 날짜"); assert.equal(document.querySelector('time'), null); await unmount();
});

test("one controlled editor locks other cards and saves an immutable draft once", async () => {
    let resolveSave, update; const calls = [];
    function Demo() {
        const [items, setItems] = useState([own, { ...own, id: "two", content: "두 번째 메모" }]), [editingId, setEditingId] = useState(null); update = setItems;
        return h(PrismProfileMemoCollection, { items, editingId, onEditingChange: setEditingId, onSave: (id, content, context) => { calls.push({ id, content, context }); return new Promise(resolve => { resolveSave = resolve; }); }, onDelete() {} });
    }
    await act(async () => root.render(h(Demo))); await click(buttons("메모 수정")[0]); assert.equal(buttons("메모 수정")[0].disabled, true); assert.equal(buttons("메모 삭제")[0].disabled, true);
    await enter(document.querySelector('textarea'), "  새 메모\n둘째 줄  ");
    await act(async () => update([ { ...own, content: "외부 새 버전" }, { ...own, id: "two", content: "두 번째 메모" } ]));
    assert.equal(document.querySelector('textarea').value, "  새 메모\n둘째 줄  ");
    const save = buttons("등록")[0]; await act(async () => { save.click(); save.click(); }); assert.equal(calls.length, 1); assert.equal(calls[0].id, "one"); assert.equal(calls[0].content, "  새 메모\n둘째 줄  ");
    assert.equal(document.querySelector('textarea').disabled, true); assert.equal(buttons("취소")[0].disabled, true);
    await act(async () => { resolveSave(); await tick(); }); assert.equal(document.querySelector('textarea'), null); assert.equal(buttons("메모 수정").length, 2); assert.ok(buttons("메모 수정").every(button => !button.disabled)); await unmount();
});

test("failed save retains the editor draft and permits retry", async () => {
    let calls = 0, errors = 0, closed = 0;
    const props = { memo: own, editing: true, onEditStart() {}, onEditCancel: () => closed++, onMutationError: () => errors++, onSave: async () => { if (++calls === 1) throw Error("synthetic failure"); } };
    await act(async () => root.render(h(PrismProfileMemoCard, props))); await enter(document.querySelector('textarea'), "보존할 수정 내용"); await click(buttons("등록")[0]);
    assert.equal(closed, 0); assert.equal(errors, 1); assert.equal(document.querySelector('textarea').value, "보존할 수정 내용"); assert.match(document.querySelector('[role=alert]').textContent, /저장하지 못/);
    assert.equal(buttons("등록")[0].disabled, false); await click(buttons("등록")[0]); assert.equal(closed, 1); assert.equal(document.querySelector('[role=alert]'), null); await unmount();
});

test("deletion requires confirmation, locks close while pending and preserves failed records", async () => {
    let rejectDelete, calls = 0;
    const props = { memo: own, editing: false, onEditStart() {}, onEditCancel() {}, onDelete: () => { calls++; return new Promise((_, reject) => { rejectDelete = reject; }); } };
    await act(async () => root.render(h(PrismProfileMemoCard, props))); await click(buttons("메모 삭제")[0]); assert.equal(calls, 0);
    const dialog = document.querySelector('[role=dialog]'); assert.ok(dialog); assert.match(dialog.textContent, /되돌릴 수 없습니다/);
    await click(buttons("삭제")[0]); assert.equal(calls, 1); assert.equal(buttons("닫기")[0].disabled, true); assert.equal(buttons("취소")[0].disabled, true);
    await act(async () => { dialog.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })); }); assert.ok(document.querySelector('[role=dialog]'));
    await act(async () => { rejectDelete(Error("synthetic deletion failure")); await tick(); }); assert.ok(document.querySelector('article')); assert.match(document.querySelector('[role=alert]').textContent, /삭제하지 못/); assert.equal(buttons("삭제")[0].disabled, false);
    await click(buttons("취소")[0]); assert.equal(document.querySelector('[role=dialog]'), null); await unmount();
});

test("switching or unmounting a memo aborts pending work and ignores its late completion", async () => {
    let resolveSave, context, cancelled = 0;
    const props = { memo: own, editing: true, onEditStart() {}, onEditCancel: () => cancelled++, onSave: (_, ctx) => { context = ctx; return new Promise(resolve => { resolveSave = resolve; }); } };
    await act(async () => root.render(h(PrismProfileMemoCard, props))); await click(buttons("등록")[0]);
    await act(async () => root.render(h(PrismProfileMemoCard, { ...props, memo: { ...own, id: "new", content: "새 후보자의 메모" } })));
    assert.equal(context.signal.aborted, true); await act(async () => { resolveSave(); await tick(); }); assert.equal(cancelled, 0); assert.equal(document.querySelector('textarea').value, "새 후보자의 메모");
    await click(buttons("등록")[0]); await unmount(); assert.equal(context.signal.aborted, true); await act(async () => { resolveSave(); await tick(); }); assert.equal(cancelled, 0);
});

test("composer preserves whitespace and owner draft, blocks IME/shift-enter submission and guards async duplicates", async () => {
    let rejectSave; const calls = [];
    const props = { value: "  가상 메모\n둘째 줄  ", onValueChange() {}, onSubmit: (content, context) => { calls.push({ content, context }); return new Promise((_, reject) => { rejectSave = reject; }); } };
    await act(async () => root.render(h(PrismProfileMemoComposer, props))); const textarea = document.querySelector('textarea');
    await act(async () => { textarea.dispatchEvent(new KeyboardEvent('keydown', { key: "Enter", bubbles: true, isComposing: true })); textarea.dispatchEvent(new KeyboardEvent('keydown', { key: "Enter", bubbles: true, shiftKey: true })); }); assert.equal(calls.length, 0);
    await act(async () => { textarea.dispatchEvent(new KeyboardEvent('keydown', { key: "Enter", bubbles: true })); document.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })); });
    assert.equal(calls.length, 1); assert.equal(calls[0].content, props.value); assert.equal(textarea.disabled, true);
    await act(async () => { rejectSave(Error("synthetic create failure")); await tick(); }); assert.equal(textarea.value, props.value); assert.equal(textarea.disabled, false); assert.match(document.querySelector('[role=alert]').textContent, /등록하지 못/); await unmount();
});

test("read-only actions stay unavailable and an absent controlled editor is released only after ready data", async () => {
    const changes = [], props = { items: [own], editingId: "missing", onEditingChange: id => changes.push(id), onSave() {}, onDelete() {}, readOnly: true };
    await act(async () => root.render(h(PrismProfileMemoCollection, { ...props, status: "loading" }))); assert.deepEqual(changes, []);
    await act(async () => root.render(h(PrismProfileMemoCollection, props))); assert.deepEqual(changes, [null]); assert.equal(buttons("메모 수정").length, 0); assert.equal(buttons("메모 삭제").length, 0); await unmount();
});
