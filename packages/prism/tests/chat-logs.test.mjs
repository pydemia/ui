import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { transform } from "esbuild";
import { JSDOM } from "jsdom";
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "http://localhost/", pretendToBeVisual: true });
for (const key of ["window", "document", "HTMLElement", "Element", "Node", "Event", "MouseEvent", "KeyboardEvent", "MutationObserver", "DocumentFragment", "CustomEvent", "NodeFilter", "HTMLInputElement", "HTMLButtonElement", "HTMLFormElement"]) globalThis[key] = dom.window[key];
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
globalThis.getComputedStyle = dom.window.getComputedStyle; globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window); globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }; globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createElement: h, act, useState } = await import("react"), { createRoot } = await import("react-dom/client"), { flushSync } = await import("react-dom");
const { renderToStaticMarkup } = await import("react-dom/server");
const { PrismChatLogManagement, PrismChatLogDetail, createPrismChatLogFilterDraft, preparePrismChatLogFilters, createPrismChatLogQuery, preparePrismChatLogTurns } = await import("../dist/index.js");
const root = createRoot(document.getElementById("root")), render = node => act(async () => root.render(node)), clear = () => render(null), click = node => { assert.ok(node, "Expected control"); return act(async () => node.click()); };
const button = text => [...document.querySelectorAll('button')].find(node => node.textContent === text || node.getAttribute('aria-label') === text), wait = ms => act(async () => new Promise(resolve => setTimeout(resolve, ms)));
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
const companies = [{ value: "a", label: "가상 회사" }, { value: "b", label: "예시 회사" }];
const row = { id: "log1", conversationId: "SYNTHETIC-ID-1", error: "Y", name: "가상 이름", company: "가상 회사", employeeNo: "DEMO-1", subject: "합성 주제", lastChatAt: "2026.10.13" };
let config, calls, state;
function Host() {
    const [filters, setFilters] = useState(() => createPrismChatLogFilterDraft(companies)), [applied, setApplied] = useState(() => preparePrismChatLogFilters(filters, companies).filters), [page, setPage] = useState(2), [sort, setSort] = useState(null);
    state = { filters, applied, page, setFilters, setApplied };
    return h(PrismChatLogManagement, { rows: [row], total: 11, pageCount: 2, companies, scopeKey: "one", onOpen: value => calls.open.push(value), onCopyConversation: async value => calls.copy.push(value), onCopied: value => calls.copied.push(value), ...config,
        filters, applied, page, sort, onFiltersChange: setFilters, onSearch: value => { calls.search.push(value); setApplied(value); }, onPageChange: value => { calls.page.push(value); setPage(value); }, onSortChange: value => { calls.sort.push(value); setSort(value); } });
}
async function start(overrides = {}) { await clear(); config = overrides; calls = { open: [], copy: [], copied: [], search: [], page: [], sort: [] }; await render(h(Host)); }
const copyButton = () => document.querySelector('.prism-chat-log-id button');
const submit = () => act(async () => document.querySelector('form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true })));
test.afterEach(clear);

test("log filters validate calendar dates and omit full/empty/unknown companies and private fields", () => {
    const draft = { ...createPrismChatLogFilterDraft(companies), companyIds: ["a", "a", "invalid"], dateFrom: "2024-02-29", keyword: "  검색  ", secret: "omit" };
    assert.deepEqual(preparePrismChatLogFilters(draft, companies).filters, { companyIds: ["a"], dateFrom: "2024-02-29", dateTo: null, keyword: "검색" });
    for (const dateFrom of ["2026-02-29", "2026-02-31", "0000-01-01", "2026.10.13"]) assert.ok(preparePrismChatLogFilters({ ...draft, dateFrom }, companies).error);
    assert.deepEqual(preparePrismChatLogFilters({ ...draft, companyIds: ["a", "b"] }, companies).filters.companyIds, []); assert.deepEqual(preparePrismChatLogFilters({ ...draft, companyIds: [] }, companies).filters.companyIds, []);
    assert.ok(preparePrismChatLogFilters({ ...draft, dateFrom: "2026-10-14", dateTo: "2026-10-13" }, companies).error);
});
test("application-neutral query copies only public fields and enforces real sortable columns", () => {
    const filters = { companyIds: ["a"], dateFrom: null, dateTo: "2026-10-13", keyword: "검색", private: "omit" };
    const query = createPrismChatLogQuery(filters, 2, { column: "name", direction: "asc" }); assert.deepEqual(query, { companyIds: ["a"], fromDate: null, toDate: "2026.10.13", keyword: "검색", page: 2, pageSize: 10, sort: { column: "name", direction: "asc" } }); query.companyIds.push("b"); assert.deepEqual(filters.companyIds, ["a"]);
    assert.throws(() => createPrismChatLogQuery(filters, 0, null)); assert.throws(() => createPrismChatLogQuery(filters, 1, { column: "subject", direction: "asc" }));
});
test("staged query/reset/sort reset page and invalid dates preserve applied state", async () => {
    await start(); await act(async () => state.setFilters({ ...state.filters, dateFrom: "2026-02-31" })); await submit(); assert.equal(calls.search.length, 0); assert.equal(state.page, 2);
    await act(async () => state.setFilters({ ...state.filters, dateFrom: "2026-10-01", dateTo: null, keyword: "  합성  " })); await submit(); assert.equal(state.page, 1); assert.equal(state.applied.keyword, "합성");
    await click(button('초기화')); assert.equal(state.applied.dateFrom, null); assert.deepEqual(state.filters.companyIds, ["a", "b"]);
    await click([...document.querySelectorAll('thead button')].find(node => node.textContent === "이름")); assert.deepEqual(calls.sort.at(-1), { column: "name", direction: "asc" }); assert.equal(state.page, 1); assert.equal([...document.querySelectorAll('thead button')].some(node => node.textContent === "대화 주제"), false);
});
test("visible invalid manual date cannot submit the previous valid model", async () => {
    await start({ dateInputEditable: true }); await act(async () => state.setFilters({ ...state.filters, dateFrom: "2026-10-01" })); const label = [...document.querySelectorAll('label')].find(node => node.textContent === "최근 대화일 시작일"), input = document.getElementById(label.htmlFor);
    await act(async () => { Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, 'value').set.call(input, "2026.02.31"); input.dispatchEvent(new Event('input', { bubbles: true })); input.dispatchEvent(new dom.window.FocusEvent('focusout', { bubbles: true })); }); await submit(); assert.equal(calls.search.length, 0); assert.equal(state.filters.dateFrom, "2026-10-01"); assert.equal(state.page, 2);
});
test("source seven columns expose sibling copy and keyboard-open buttons with public rows only", async () => {
    await start({ rows: [{ ...row, secret: 'omit' }] }); assert.equal(document.querySelectorAll('thead th').length, 7); assert.equal(document.querySelector('button button'), null);
    await click(copyButton()); assert.deepEqual(calls.copy, [row.conversationId]); assert.deepEqual(calls.open, []); assert.deepEqual(calls.copied, [row.conversationId]);
    await click(button(row.subject)); assert.deepEqual(calls.open, [row]); assert.match(document.querySelector('.prism-chat-log-error').textContent, /Y/);
});
test("empty onboarding, filtered empty and request failure are distinct", async () => {
    await start({ rows: [], total: 0, pageCount: 1 }); assert.equal(document.querySelector('form'), null); assert.match(document.body.textContent, /대화 로그가 없습니다/);
    await act(async () => state.setApplied({ ...state.applied, keyword: "없는 로그" })); assert.ok(document.querySelector('form')); assert.match(document.querySelector('tbody').textContent, /검색 결과/);
    let retry = 0; await start({ rows: [], total: 0, pageCount: 1, error: "합성 실패", onRetry: () => retry++ }); await click(button('다시 조회')); assert.equal(retry, 1); assert.doesNotMatch(document.body.textContent, /대화 로그가 없습니다/);
});
test("failed copy retains the row for retry and default clipboard absence never reports success", async () => {
    let count = 0; await start({ onCopyConversation: async () => { if (++count === 1) throw new Error('Synthetic'); } }); await click(copyButton()); assert.match(document.querySelector('[role="alert"]').textContent, /복사하지 못/); assert.equal(calls.copied.length, 0); await click(copyButton()); assert.equal(calls.copied.length, 1);
    await start({ onCopyConversation: undefined }); await click(copyButton()); assert.match(document.querySelector('[role="alert"]').textContent, /복사하지 못/); assert.equal(calls.copied.length, 0);
});
test("duplicate/pending copy is aborted by scope, permission or unmount without stale notification", async () => {
    for (const change of [{ scopeKey: "two" }, { allowCopy: false }, null]) {
        const pending = deferred(); let signal, count = 0; await start({ onCopyConversation: (_value, context) => { count++; signal = context.signal; return pending.promise; } }); const control = copyButton(); await act(async () => { control.click(); control.click(); }); assert.equal(count, 1);
        if (change) { config = { ...config, ...change }; await render(h(Host)); } else await clear(); assert.equal(signal.aborted, true); await act(async () => pending.resolve()); assert.equal(calls.copied.length, 0); assert.equal(document.querySelector('.prism-toast'), null);
    }
});
test("copy completion callback cannot post an old toast into a synchronously replaced scope", async () => {
    await start({ onCopied: () => { config = { ...config, scopeKey: "replacement" }; flushSync(() => root.render(h(Host))); throw new Error('Synthetic old callback'); } }); await click(copyButton()); assert.equal(document.querySelector('.prism-toast'), null);
});
test("archived options infer the next answer and hide context-add response questions without mutating records", () => {
    const turns = [{ id: "one", question: "보충", blocks: [{ id: "text", type: "text", content: "맥락을 추가해 주세요." }, { id: "options", type: "options", title: "선택", options: [{ id: "x", label: "가상 선택" }] }] }, { id: "two", question: "가상 선택", blocks: [{ id: "result", type: "text", content: "합성 결과" }] }], before = JSON.stringify(turns), result = preparePrismChatLogTurns(turns);
    assert.equal(result[1].hideQuestion, true); assert.equal(result[0].turn.blocks[1].selected, 'x'); assert.equal(JSON.stringify(turns), before);
    const explicit = preparePrismChatLogTurns([{ ...turns[0], blocks: [{ ...turns[0].blocks[1], selected: 'existing' }] }, turns[1]]); assert.equal(explicit[0].turn.blocks[0].selected, 'existing');
});
test("archive detail keeps readonly options, source heading/back and no new composer", async () => {
    let back = 0; const turns = [{ id: 'one', question: '합성 질문', blocks: [{ id: 'options', type: 'options', title: '합성 선택', options: [{ id: 'x', label: '선택' }] }] }]; await render(h(PrismChatLogDetail, { subject: '합성 주제', turns, onBack: () => back++ })); assert.match(document.querySelector('h1').textContent, /합성 주제/); assert.equal(document.querySelector('textarea'), null); assert.equal(button('선택').disabled, true); await click(document.querySelector('button[aria-label="이전 페이지"]')); assert.equal(back, 1);
    const html = renderToStaticMarkup(h(PrismChatLogDetail, { subject: '합성', turns, loading: true })); assert.doesNotMatch(html, /합성 질문/);
});
const compiled = await transform(await readFile(new URL('../../../apps/docs/src/prism/chat-logs-demo.tsx', import.meta.url), 'utf8'), { loader: 'tsx', jsx: 'automatic', format: 'esm' });
const portable = compiled.code.replace(/\bfrom\s+["']([^"']+)["']/g, (_match, specifier) => { assert.ok(['react', 'react/jsx-runtime', '@pydemia/prism'].includes(specifier)); return 'from ' + JSON.stringify(import.meta.resolve(specifier)); });
const { ChatLogsExample } = await import('data:text/javascript;base64,' + Buffer.from(portable).toString('base64'));
test("complete synthetic example retries copy, opens archived detail and retains host page on back", async () => {
    await render(h(ChatLogsExample)); await click(button('다음 페이지')); assert.equal(button('2').getAttribute('aria-current'), 'page');
    await click(document.querySelector('input[type="checkbox"]')); await click(copyButton()); await wait(60); assert.match(document.querySelector('[role="alert"]').textContent, /복사하지 못/);
    await click(copyButton()); await wait(60); assert.match(document.body.textContent, /합성 Conversation ID 확인/);
    const subject = document.querySelector('.prism-directory tbody tr td:nth-child(6) button').textContent; await click(button(subject)); assert.ok(!document.querySelector('.prism-directory')); assert.match(document.body.textContent, /보관된 추가 맥락/); assert.doesNotMatch(document.body.textContent, /추가 맥락 응답 \(원본 규칙/);
    await click(document.querySelector('button[aria-label="이전 페이지"]')); assert.equal(button('2').getAttribute('aria-current'), 'page'); assert.equal(document.querySelector('.prism-directory tbody tr td:nth-child(6) button').textContent, subject);
});
