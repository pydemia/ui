import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "http://localhost/", pretendToBeVisual: true });
for (const key of ["window", "document", "HTMLElement", "Element", "Node", "Event", "KeyboardEvent", "MouseEvent", "MutationObserver", "HTMLInputElement", "HTMLTextAreaElement", "HTMLButtonElement", "DocumentFragment", "CustomEvent", "NodeFilter"]) globalThis[key] = dom.window[key];
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
globalThis.getComputedStyle = dom.window.getComputedStyle; globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window); globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }; globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createElement: h, act, useState } = await import("react"), { createRoot } = await import("react-dom/client");
const { PrismMgmtComments, PrismMgmtCommentCard, PrismCeoCommentForm, PrismSummaryBadge, isPrismCeoCommentDraftValid, createPrismCeoCommentPayload } = await import("../dist/index.js");
const root = createRoot(document.getElementById("root"));
const mine = { id: "one", year: 2026, category: "가상 회의체", author: "가상 발화자", comment: "기존 원문\n둘째 줄", isMine: true };
const other = { ...mine, id: "other", isMine: false };
const base = { subjectId: "subject-a", ceoComments: [mine, other], elpComments: [{ id: "elp", year: null, category: null, author: null, comment: "ELP 원문" }] };
const draft = { year: "2026", meeting: "가상 회의", speaker: "가상 발화자", content: "새 원문" };
const render = node => act(async () => root.render(node)), clear = () => render(null);
const click = node => act(async () => node.click());
const textButton = text => [...document.querySelectorAll("button")].find(button => button.textContent === text);
const ariaButton = label => document.querySelector(`button[aria-label="${label}"]`);
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
const fill = async (element, value) => act(async () => {
    const setter = Object.getOwnPropertyDescriptor(element.tagName === "TEXTAREA" ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype, "value").set;
    setter.call(element, value); element.dispatchEvent(new Event("input", { bubbles: true }));
});
async function fillForm(value = draft) {
    const fields = [...document.querySelectorAll('.prism-ceo-form input')];
    await fill(fields[0], value.year); await fill(fields[1], value.meeting); await fill(fields[2], value.speaker); await fill(document.querySelector('.prism-ceo-form textarea'), value.content);
}

test("comment cards preserve zero year and raw body but omit empty metadata, with owner-only CEO actions", async () => {
    await render(h(PrismMgmtCommentCard, { item: { ...mine, year: 0, category: "  ", author: " " } }));
    assert.equal(document.querySelector('header').textContent, "0년"); assert.equal(document.querySelector('h4'), null); assert.equal(document.querySelector('.prism-mgmt-author'), null);
    assert.equal(document.querySelector('.prism-mgmt-text').textContent, mine.comment); await clear();
    await render(h(PrismMgmtComments, { ...base, onUpdate: async () => {}, onDelete: async () => {} }));
    assert.equal(document.querySelectorAll('.prism-mgmt-card').length, 3); assert.equal(document.querySelectorAll('[aria-label="코멘트 수정"]').length, 1); assert.equal(document.querySelectorAll('[aria-label="코멘트 삭제"]').length, 1); await clear();
});

test("source validation trims boundaries, retains internal whitespace and separates interactive year filtering", async () => {
    assert.equal(isPrismCeoCommentDraftValid({ ...draft, year: " 0000 " }), true);
    assert.equal(isPrismCeoCommentDraftValid({ ...draft, year: "12345" }), true);
    for (const year of ["", "20x6", "-1", "1.5"]) assert.equal(isPrismCeoCommentDraftValid({ ...draft, year }), false);
    assert.equal(isPrismCeoCommentDraftValid({ ...draft, meeting: `  ${"가".repeat(100)}  `, content: "가".repeat(2000) }), true);
    assert.equal(isPrismCeoCommentDraftValid({ ...draft, speaker: "가".repeat(101) }), false); assert.equal(isPrismCeoCommentDraftValid({ ...draft, content: "가".repeat(2001) }), false);
    assert.deepEqual(createPrismCeoCommentPayload({ year: " 0026 ", meeting: " A B ", speaker: " C D ", content: "  첫 줄\n둘째 줄  " }), { year: 26, category: "A B", author: "C D", comment: "첫 줄\n둘째 줄" });
    function Demo() { const [value, setValue] = useState(draft); return h(PrismCeoCommentForm, { value, onValueChange: setValue, onSubmit() {} }); }
    await render(h(Demo)); await fill(document.querySelector('input'), "년도20x26123"); assert.equal(document.querySelector('input').value, "2026");
    assert.equal(document.querySelector('textarea').rows, 5); assert.equal(document.querySelector('textarea').maxLength, 2000); assert.equal(document.querySelectorAll('input')[1].maxLength, 100); await clear();
});

test("source standalone submitting gates only submit and optional Enter submission respects IME", async () => {
    const calls = [];
    await render(h(PrismCeoCommentForm, { value: draft, onValueChange() {}, onSubmit: value => calls.push(value), submitting: true }));
    assert.equal(document.querySelector('input').disabled, false); assert.equal(textButton('등록').disabled, true);
    await render(h(PrismCeoCommentForm, { value: draft, onValueChange() {}, onSubmit: value => calls.push(value) }));
    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }); await act(async () => document.querySelector('input').dispatchEvent(event)); assert.equal(event.defaultPrevented, true); assert.equal(calls.length, 0);
    await render(h(PrismCeoCommentForm, { value: draft, onValueChange() {}, onSubmit: value => calls.push(value), submitOnEnter: true }));
    const composing = new KeyboardEvent('keydown', { key: 'Enter', isComposing: true, bubbles: true, cancelable: true }); await act(async () => document.querySelector('input').dispatchEvent(composing)); assert.equal(composing.defaultPrevented, true);
    await click(textButton('등록')); assert.equal(calls.length, 1); assert.equal(Object.isFrozen(calls[0]), true); await clear();
});

test("create captures normalized payload once and locks fields while the collection transaction is pending", async () => {
    const job = deferred(), calls = [];
    await render(h(PrismMgmtComments, { ...base, onCreate: (payload, context) => { calls.push({ payload, context }); return job.promise; } }));
    await click(textButton('추가')); await fillForm({ ...draft, meeting: " 가상 회의 ", content: " 새 원문 " }); await click(textButton('등록'));
    assert.equal(calls.length, 1); assert.equal(calls[0].payload.comment, "새 원문"); assert.equal(calls[0].context.subjectId, "subject-a"); assert.equal(document.querySelector('textarea').disabled, true); assert.equal(textButton('취소').disabled, true);
    await click(textButton('등록')); assert.equal(calls.length, 1); await act(async () => job.resolve()); assert.equal(document.querySelector('.prism-ceo-form'), null); await clear();
});

test("detail failure retries, edit stays above its card and a rejected update retains the draft", async () => {
    let attempts = 0;
    await render(h(PrismMgmtComments, { ...base, loadDetail: async () => { if (++attempts === 1) throw new Error('detail'); return draft; }, onUpdate: async () => { throw new Error('save'); } }));
    await click(ariaButton('코멘트 수정')); assert.equal(document.querySelector('.prism-ceo-form'), null); assert.match(document.querySelector('.prism-toast').textContent, /불러오지 못/);
    await click(ariaButton('코멘트 수정')); assert.equal(document.querySelector('.prism-mgmt-record').firstElementChild.className, "prism-ceo-form"); assert.equal(document.querySelectorAll('.prism-mgmt-card').length, 3);
    await fill(document.querySelector('textarea'), "재시도할 원문"); await click(textButton('수정')); assert.equal(document.querySelector('textarea').value, "재시도할 원문"); assert.match(document.querySelector('.prism-toast').textContent, /수정하지 못/); await clear();
});

test("subject transition and unmount abort stale operations without opening an old editor", async () => {
    const detail = deferred(); let signal;
    const props = { ...base, loadDetail: (_, context) => { signal = context.signal; return detail.promise; }, onUpdate: async () => {} };
    await render(h(PrismMgmtComments, props)); await click(ariaButton('코멘트 수정'));
    await render(h(PrismMgmtComments, { ...props, subjectId: "subject-b" })); assert.equal(signal.aborted, true); await act(async () => detail.resolve(draft)); assert.equal(document.querySelector('.prism-ceo-form'), null);
    const save = deferred(); let mutationSignal;
    await render(h(PrismMgmtComments, { ...base, onCreate: (_, context) => { mutationSignal = context.signal; return save.promise; } })); await click(textButton('추가')); await fillForm(); await click(textButton('등록')); await clear();
    assert.equal(mutationSignal.aborted, true); await act(async () => save.resolve()); assert.equal(document.querySelector('.prism-toast'), null);
});

test("refresh failure after successful create closes the editor and retries only the refresh", async () => {
    let writes = 0, refreshes = 0;
    await render(h(PrismMgmtComments, { ...base, onCreate: async () => { writes++; }, onReload: async () => { if (++refreshes === 1) throw new Error('refresh'); } }));
    await click(textButton('추가')); await fillForm(); await click(textButton('등록')); assert.equal(writes, 1); assert.equal(document.querySelector('.prism-ceo-form'), null); assert.match(document.querySelector('.prism-toast').textContent, /목록을 다시/);
    await click(textButton('목록 다시 불러오기')); assert.equal(writes, 1); assert.equal(refreshes, 2); assert.equal(document.querySelector('.prism-toast'), null); await clear();
});

test("delete confirms the owner record, guards pending close and retains a failed deletion for retry", async () => {
    const job = deferred(); let attempts = 0;
    await render(h(PrismMgmtComments, { ...base, onDelete: () => ++attempts === 1 ? job.promise : Promise.resolve() })); await click(ariaButton('코멘트 삭제'));
    const confirm = document.querySelector('.prism-confirm-dialog'); assert.match(confirm.textContent, /해당 코멘트를 삭제/); await click([...confirm.querySelectorAll('button')].find(button => button.textContent === "삭제"));
    assert.equal(confirm.querySelector('[aria-label="닫기"]').disabled, true); await act(async () => job.reject(new Error('delete'))); assert.match(document.querySelector('.prism-confirm-dialog').textContent, /삭제하지 못/);
    await click([...document.querySelector('.prism-confirm-dialog').querySelectorAll('button')].find(button => button.textContent === "삭제")); assert.equal(attempts, 2); assert.equal(document.querySelector('.prism-confirm-dialog'), null); await clear();
});

test("readonly, absent subject and disappeared owner records cannot leave writable actions", async () => {
    const callbacks = { onCreate: async () => {}, onUpdate: async () => {}, onDelete: async () => {} };
    await render(h(PrismMgmtComments, { ...base, ...callbacks, readOnly: true })); assert.equal(textButton('추가'), undefined); assert.equal(ariaButton('코멘트 수정'), null);
    await render(h(PrismMgmtComments, { ...base, ...callbacks, subjectId: undefined })); assert.equal(textButton('추가').disabled, true); assert.equal(ariaButton('코멘트 수정').disabled, true);
    await render(h(PrismMgmtComments, { ...base, ...callbacks })); await click(ariaButton('코멘트 수정')); assert.ok(document.querySelector('.prism-ceo-form'));
    await render(h(PrismMgmtComments, { ...base, ...callbacks, ceoComments: [other] })); assert.equal(document.querySelector('.prism-ceo-form'), null); await clear();
    await render(h(PrismMgmtComments, { ...base, onUpdate: async () => {} })); assert.equal(textButton('추가'), undefined);
    await click(ariaButton('코멘트 수정')); await click(textButton('취소')); assert.equal(document.querySelector('.prism-ceo-form'), null); await clear();
});

test("summary consumer classes and styles apply to tooltip content without changing trigger or empty semantics", async () => {
    await render(h(PrismSummaryBadge, { label: "가상 유형", summary: "요약", note: "도움말", tooltipClassName: "consumer-note", tooltipStyle: { fontSize: 12 } }));
    await click(ariaButton('가상 유형 설명')); const content = document.querySelector('.consumer-note'); assert.ok(content); assert.equal(content.textContent, "도움말"); assert.equal(content.style.fontSize, "12px");
    await render(h(PrismSummaryBadge, { label: "가상 유형", summary: null, note: "도움말", tooltipClassName: "consumer-note" })); assert.equal(ariaButton('가상 유형 설명'), null); await clear();
});

test("deletion rechecks the current owner record and a failed refresh never repeats a successful deletion", async () => {
    let deletes = 0, reloads = 0;
    const callbacks = { onDelete: async () => { deletes++; }, onReload: async () => { if (++reloads === 1) throw new Error('refresh'); } };
    await render(h(PrismMgmtComments, { ...base, ...callbacks })); await click(ariaButton('코멘트 삭제'));
    await render(h(PrismMgmtComments, { ...base, ...callbacks, ceoComments: [other] }));
    assert.equal(document.querySelector('.prism-confirm-dialog'), null); assert.equal(deletes, 0);
    await render(h(PrismMgmtComments, { ...base, ...callbacks })); await click(ariaButton('코멘트 삭제'));
    await click([...document.querySelector('.prism-confirm-dialog').querySelectorAll('button')].find(button => button.textContent === '삭제'));
    assert.equal(deletes, 1); assert.equal(document.querySelector('.prism-confirm-dialog'), null);
    await click(textButton('목록 다시 불러오기')); assert.equal(deletes, 1); assert.equal(reloads, 2); await clear();
});
