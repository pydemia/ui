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
const { createElement: h, act, useState } = await import("react"), { createRoot } = await import("react-dom/client");
const { renderToStaticMarkup } = await import("react-dom/server");
const { flushSync } = await import("react-dom");
const { PrismCompanyGroupManagement, PrismNoticeManagement, PrismDatePicker, createPrismCompanyGroupFilterDraft, normalizePrismCompanyGroupFilters, createPrismCompanyGroupQuery,
    createPrismNoticeFilterDraft, preparePrismNoticeFilters, createPrismNoticeListQuery, sortPrismNoticePage, validatePrismNoticeDeletion, settlePrismNoticeDeletion } = await import("../dist/index.js");
const root = createRoot(document.getElementById("root")), render = node => act(async () => root.render(node)), clear = () => render(null), click = node => { assert.ok(node, "Expected control"); return act(async () => node.click()); };
test.afterEach(clear);
const companies = [{ value: "a", label: "가상 회사" }, { value: "b", label: "예시 회사" }];
const groups = [{ id: "a", name: "가상 A", active: true, companies: [{ id: "a", name: "가상 회사" }], registrant: "가상 등록자", createdAt: "2026.10.01", updatedAt: "2026.10.12" }, { id: "b", name: "가상 B", active: false, companies: [], registrant: null }];
const notices = [{ id: "b", title: "Z 공지", companies: [], popupStatus: "ENDED", popupStartDate: "2026.10.01", popupEndDate: "2026.10.31", createdDate: "2026.10.12", author: null },
    { id: "a", title: "A 공지", companies: [{ id: "a", name: "가상 회사" }], popupStatus: "ACTIVE", createdDate: "2026.10.01", author: { name: "가상 작성자", company: "가상 회사", email: "synthetic@example.com" } }];
let config, state, calls, family;
function Host() {
    const [filters, setFilters] = useState(() => family === "groups" ? createPrismCompanyGroupFilterDraft(companies) : createPrismNoticeFilterDraft(companies));
    const [applied, setApplied] = useState(() => family === "groups" ? normalizePrismCompanyGroupFilters(filters, companies) : preparePrismNoticeFilters(filters, companies).filters);
    const [selected, setSelected] = useState(config.selected ?? ["a"]), [page, setPage] = useState(2), [sort, setSort] = useState(null);
    state = { filters, applied, selected, page, sort, setFilters, setSelected, setPage, setApplied };
    const props = { companies, filters, applied, onFiltersChange: setFilters, onSearch: value => { calls.search.push(value); setApplied(value); }, rows: family === "groups" ? groups : notices,
        total: 12, pageCount: 2, page, onPageChange: value => { calls.pages.push(value); setPage(value); }, selected, onSelectionChange: value => { calls.selections.push(value); setSelected(value); }, sort,
        onSortChange: value => { calls.sort.push(value); setSort(value); }, onOpen: row => calls.open.push(row.id), onCreate: () => calls.create++, scopeKey: "one",
        onStatusChange: async request => calls.status.push(request), onStatusApplied: request => calls.applied.push(request), onGroupsMissing: request => calls.missing.push(request),
        onDelete: async request => ({ deletedIds: request.ids, failures: [] }), onDeletionApplied: (request, result) => calls.applied.push({ request, result }), ...config, selected };
    return h(family === "groups" ? PrismCompanyGroupManagement : PrismNoticeManagement, props);
}
async function start(kind = "groups", overrides = {}) { await clear(); family = kind; config = overrides; calls = { search: [], pages: [], selections: [], sort: [], open: [], create: 0, status: [], applied: [], missing: [] }; await render(h(Host)); }
const button = label => [...document.querySelectorAll('button')].find(node => node.textContent === label);
const confirmation = () => [...document.querySelectorAll('[role="dialog"] button')].at(-1);
const checkbox = label => [...document.querySelectorAll('label.prism-choice')].find(node => node.textContent === label)?.querySelector('[role="checkbox"]');
const wait = ms => act(async () => new Promise(resolve => setTimeout(resolve, ms)));
async function inputText(input, value) { await act(async () => { Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, 'value').set.call(input, value); input.dispatchEvent(new Event('input', { bubbles: true })); }); }
async function typeKeyword(value) { await inputText([...document.querySelectorAll('.prism-field')].find(node => node.querySelector('label')?.textContent === "검색어").querySelector('input'), value); }
async function submit() { await act(async () => document.querySelector('.prism-admin-list-filter').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))); }

test("group filters omit all/none and private fields, while server query maps only sortable columns", () => {
    const all = createPrismCompanyGroupFilterDraft(companies), draft = { ...all, statuses: ["inactive"], companyIds: ["a"], keyword: "  가상  ", private: "exclude" }, before = JSON.stringify(draft);
    const filters = normalizePrismCompanyGroupFilters(draft, companies); assert.deepEqual(filters, { isActive: [false], companyIds: ["a"], keyword: "가상" }); assert.equal(JSON.stringify(draft), before);
    assert.deepEqual(normalizePrismCompanyGroupFilters(all, companies), { isActive: [], companyIds: [], keyword: "" }); assert.deepEqual(normalizePrismCompanyGroupFilters({ ...all, companyIds: [] }, companies).companyIds, []);
    assert.deepEqual(createPrismCompanyGroupQuery(filters, 2, { column: "updatedAt", direction: "desc" }), { page: 2, size: 10, keyword: "가상", is_active: [false], company_ids: ["a"], sort: ["updated_at:desc"] });
});
test("group query is staged; apply/reset/sort reset page while sorting preserves selected rows", async () => {
    await start(); await typeKeyword("  가상  "); assert.equal(calls.search.length, 0); assert.equal(state.page, 2); await submit(); assert.equal(state.page, 1); assert.equal(state.applied.keyword, "가상"); assert.deepEqual(state.selected, []);
    await act(async () => { state.setSelected(["a"]); state.setPage(2); }); await click([...document.querySelectorAll('thead button')].find(node => node.textContent === "최근 수정일")); assert.equal(state.page, 1); assert.deepEqual(state.selected, ["a"]);
    assert.equal([...document.querySelectorAll('thead th')].find(node => node.textContent === "회사").querySelector('button'), null); await click(button("초기화")); assert.equal(state.filters.keyword, ""); assert.deepEqual(state.filters.companyIds, ["a", "b"]); assert.deepEqual(state.selected, []);
});
test("group deactivation captures public IDs and displays the member impact before mutation", async () => {
    await start("groups", { selected: ["a", "a"] }); await click(button("비활성")); assert.match(document.querySelector('[role="dialog"]').textContent, /소속된 사용자가 모두 비활성화/); assert.equal(calls.status.length, 0); await click(confirmation());
    assert.deepEqual(calls.status[0], { ids: ["a"], active: false }); assert.ok(Object.isFrozen(calls.status[0].ids)); assert.deepEqual(state.selected, []); assert.equal(calls.applied.length, 1);
});
test("host-classified missing groups clear affected selection and request reload without success", async () => {
    await start("groups", { selected: ["a"], onStatusChange: async () => { throw new Error("synthetic"); }, classifyStatusError: () => ({ message: "합성 누락", missing: true }) }); await click(button("활성")); await act(async () => state.setSelected(["a", "later"])); await click(confirmation());
    assert.equal(document.querySelector('[role="dialog"]'), null); assert.deepEqual(state.selected, ["later"]); assert.equal(calls.missing.length, 1); assert.deepEqual(calls.applied, []); assert.match(document.querySelector('[role="alert"]').textContent, /합성 누락/);
});
test("group failures retry and readonly/loading block editing while preserving detail navigation", async () => {
    let count = 0; await start("groups", { onStatusChange: async () => { if (++count === 1) throw new Error("synthetic"); } }); await click(button("활성")); await click(confirmation()); assert.ok(document.querySelector('[role="dialog"]')); assert.deepEqual(state.selected, ["a"]); await click(confirmation()); assert.equal(count, 2); assert.deepEqual(state.selected, []);
    await start("groups", { readOnly: true }); assert.equal(button("활성").disabled, true); assert.equal(button("등록").disabled, true); assert.equal(checkbox("현재 목록 전체 선택").disabled, true); await click([...document.querySelectorAll('tbody button')].find(node => node.textContent === "가상 A")); assert.deepEqual(calls.open, ["a"]);
    await start("groups", { loading: true }); assert.equal(document.querySelectorAll('tbody tr').length, 10);
});
test("notice dates require a popup pair but allow a created bound and preserve public ISO draft", () => {
    const all = createPrismNoticeFilterDraft(companies), draft = { ...all, companyIds: ["a"], popupStatus: ["ACTIVE"], popupFrom: "2026-10-01", popupTo: "2026-10-31", createdFrom: "2026-10-12", keyword: "  공지  ", private: "exclude" }, before = JSON.stringify(draft);
    const result = preparePrismNoticeFilters(draft, companies); assert.equal(result.ok, true); assert.deepEqual(result.filters, { companyIds: ["a"], popupStatus: ["ACTIVE"], popupFrom: "2026.10.01", popupTo: "2026.10.31", createdFrom: "2026.10.12", createdTo: null, keyword: "공지" }); assert.equal(JSON.stringify(draft), before);
    assert.equal(preparePrismNoticeFilters({ ...draft, popupTo: null }, companies).ok, false); assert.equal(preparePrismNoticeFilters({ ...all, createdFrom: "2026-02-31" }, companies).ok, false); assert.equal(preparePrismNoticeFilters({ ...draft, popupTo: "2026-09-01" }, companies).ok, false);
    const query = createPrismNoticeListQuery(result.filters, 2); assert.equal(query.popup_start_at, "2026.10.01"); assert.equal(query.sort, undefined);
});
test("dotted DatePicker display retains ISO model, commits dotted edits and preserves the ISO default", async () => {
    const calls = []; function Dates() { const [date, setDate] = useState("2026-10-12"); return h(PrismDatePicker, { label: "날짜", value: date, displayFormat: "YYYY.MM.DD", inputEditable: true, onValueChange: next => { calls.push(next); setDate(next); } }); }
    await render(h(Dates)); const input = document.querySelector('input'); assert.equal(input.value, "2026.10.12"); await inputText(input, "2026.10.31"); await act(async () => input.dispatchEvent(new dom.window.FocusEvent('focusout', { bubbles: true }))); assert.deepEqual(calls, ["2026-10-31"]); assert.equal(input.value, "2026.10.31");
    assert.match(renderToStaticMarkup(h(PrismDatePicker, { label: "기본", value: "2026-10-12", onValueChange: () => {} })), /value="2026-10-12"/);
    assert.throws(() => renderToStaticMarkup(h(PrismDatePicker, { label: "날짜", value: null, displayFormat: "other", onValueChange: () => {} })), /Unsupported date/);
});
test("invalid notice search preserves applied query/page/selection and reset restores all options", async () => {
    await start("notices"); assert.equal(document.querySelectorAll('input[placeholder="시작일"]').length, 2); assert.equal(document.querySelectorAll('input[placeholder="종료일"]').length, 2); await act(async () => state.setFilters({ ...state.filters, popupFrom: "2026-10-01", popupTo: null })); await submit(); assert.equal(calls.search.length, 0); assert.equal(state.page, 2); assert.deepEqual(state.selected, ["a"]); assert.match(document.querySelector('[role="alert"]').textContent, /함께 입력/);
    await click(button("초기화")); assert.equal(state.page, 1); assert.deepEqual(state.selected, []); assert.equal(state.filters.popupFrom, null); assert.deepEqual(state.filters.popupStatus, ["ACTIVE", "INACTIVE", "ENDED"]);
});
test("an invalid visible manual date cannot silently submit the previous valid model", async () => {
    await start("notices", { dateInputEditable: true }); await act(async () => state.setFilters({ ...state.filters, popupFrom: "2026-10-01", popupTo: "2026-10-31" }));
    const input = document.querySelector('input[id="' + [...document.querySelectorAll('label')].find(node => node.textContent === "팝업 게시 기간 시작일").getAttribute('for') + '"]');
    await inputText(input, "2026.02.31"); await act(async () => input.dispatchEvent(new dom.window.FocusEvent('focusout', { bubbles: true }))); assert.equal(input.getAttribute('aria-invalid'), "true"); await submit();
    assert.equal(calls.search.length, 0); assert.equal(state.page, 2); assert.deepEqual(state.selected, ["a"]); assert.equal(state.filters.popupFrom, "2026-10-01");
});
test("notice sorting affects only the supplied page and keeps global count/page/selection", async () => {
    const before = JSON.stringify(notices); assert.deepEqual(sortPrismNoticePage(notices, { column: "title", direction: "asc" }).map(row => row.id), ["a", "b"]); assert.equal(JSON.stringify(notices), before);
    await start("notices"); await click([...document.querySelectorAll('thead button')].find(node => node.textContent === "제목")); assert.equal(state.page, 2); assert.deepEqual(state.selected, ["a"]); assert.equal(document.querySelector('tbody tr').querySelectorAll('td')[1].textContent, "A 공지"); assert.match(document.querySelector('.prism-admin-list-summary').textContent, /총 12건/); assert.match(document.querySelector('.prism-admin-page-sort-note').textContent, /현재 페이지/);
    assert.match(document.querySelector('tbody').textContent, /전체 회사/); assert.match(document.querySelector('tbody').textContent, /가상 작성자\(가상 회사, synthetic@example.com\)/);
    for (const popupStatus of [null, "unknown", "__proto__"]) { await start("notices", { rows: [{ ...notices[0], popupStatus }] }); assert.equal(document.querySelector('tbody tr').querySelectorAll('td')[3].textContent, "-"); assert.equal(sortPrismNoticePage([{ ...notices[0], popupStatus }], { column: "popupStatus", direction: "asc" }).length, 1); }
});
test("initial no-notice state offers create; filtered empty shows results and errors cannot become onboarding", async () => {
    await start("notices", { rows: [], total: 0, pageCount: 1 }); assert.match(document.body.textContent, /등록된 공지사항이 없습니다/); assert.equal(document.querySelector('form'), null); await click(button("공지사항 등록")); assert.equal(calls.create, 1);
    await start("notices", { rows: [], total: 0, pageCount: 1 }); await act(async () => state.setApplied({ ...state.applied, keyword: "없는 공지" })); assert.ok(document.querySelector('form')); assert.match(document.querySelector('tbody').textContent, /검색 조건을 변경/); assert.equal(document.querySelector('.prism-pagination'), null);
    let retry = 0; await start("notices", { rows: [], total: 0, pageCount: 1, error: "합성 조회 오류", onRetry: () => retry++ }); assert.equal(button("공지사항 등록"), undefined); await click(button("다시 조회")); assert.equal(retry, 1);
});
test("deletion adapter bounds concurrency, preserves result order and never hides partial failures", async () => {
    let active = 0, peak = 0; const request = { ids: ["a", "b", "c", "d", "e"] }, signal = new AbortController().signal;
    const result = await settlePrismNoticeDeletion(request, async id => { active++; peak = Math.max(peak, active); await new Promise(resolve => setTimeout(resolve, 3)); active--; if (id === "b") throw new Error("synthetic"); }, { signal, concurrency: 2, getErrorMessage: () => "합성 실패" });
    assert.equal(peak, 2); assert.deepEqual(result, { deletedIds: ["a", "c", "d", "e"], failures: [{ id: "b", message: "합성 실패" }] }); validatePrismNoticeDeletion(request, result);
    for (const invalid of [{ deletedIds: ["a"], failures: [] }, { deletedIds: request.ids, failures: [{ id: "a", message: "duplicate" }] }, { deletedIds: ["x", "b", "c", "d", "e"], failures: [] }]) assert.throws(() => validatePrismNoticeDeletion(request, invalid), /삭제 결과/);
});
test("abort stops queued per-ID deletion and cannot report the interrupted batch as successful", async () => {
    const controller = new AbortController(), invoked = []; let resolve;
    const result = settlePrismNoticeDeletion({ ids: ["a", "b", "c"] }, id => { invoked.push(id); return new Promise(done => { resolve = done; }); }, { signal: controller.signal, concurrency: 1 });
    controller.abort(); resolve(); await assert.rejects(result); assert.deepEqual(invoked, ["a"]);
});
test("partial deletion clears only confirmed IDs, retains failures/later selection and emits explicit result", async () => {
    await start("notices", { selected: ["a", "b"], onDelete: async () => ({ deletedIds: ["a"], failures: [{ id: "b", message: "합성 실패" }] }) }); await click(button("삭제")); await act(async () => state.setSelected(["a", "b", "later"])); await click(confirmation());
    assert.deepEqual(state.selected, ["b", "later"]); assert.equal(state.page, 2); assert.equal(document.querySelector('[role="dialog"]'), null); assert.match(document.querySelector('[role="alert"]').textContent, /1건 삭제, 1건 실패/); assert.deepEqual(calls.applied[0].result.deletedIds, ["a"]);
});
test("all failures keep confirmation for retry; success of an entire last page moves to the preceding page", async () => {
    let count = 0; await start("notices", { selected: ["a", "b"], onDelete: async request => ++count === 1 ? { deletedIds: [], failures: request.ids.map(id => ({ id, message: "합성 실패" })) } : { deletedIds: request.ids, failures: [] } });
    await click(button("삭제")); await click(confirmation()); assert.ok(document.querySelector('[role="dialog"]')); assert.deepEqual(state.selected, ["a", "b"]); assert.deepEqual(calls.applied, []); await click(confirmation()); assert.equal(count, 2); assert.equal(state.page, 1); assert.deepEqual(state.selected, []);
});
test("both list families fence duplicate work and abort stale scope, permission and unmount completions", async () => {
    for (const kind of ["groups", "notices"]) for (const replacement of [{ scopeKey: "two" }, { readOnly: true }, null]) {
        let resolve, signal, requests = 0; const run = (_request, context) => { signal = context.signal; requests++; return new Promise(done => { resolve = done; }); };
        await start(kind, kind === "groups" ? { onStatusChange: run } : { onDelete: run }); await click(button(kind === "groups" ? "활성" : "삭제")); await act(async () => { confirmation().click(); confirmation().click(); }); assert.equal(requests, 1);
        if (replacement) { config = { ...config, ...replacement }; await render(h(Host)); } else await clear(); assert.equal(signal.aborted, true); assert.equal(document.querySelector('[role="dialog"]'), null);
        await act(async () => resolve(kind === "groups" ? undefined : { deletedIds: ["a"], failures: [] })); assert.deepEqual(calls.applied, []); assert.deepEqual(calls.selections, []);
    }
});
test("completion callbacks cannot write an old failure into a synchronously replaced scope", async () => {
    await start("groups", { onStatusApplied: () => { config = { ...config, scopeKey: "replacement" }; flushSync(() => root.render(h(Host))); throw new Error("Synthetic old callback"); } });
    await click(button("활성")); await click(confirmation()); assert.equal(document.querySelector('[role="dialog"]'), null); assert.equal(document.querySelector('[role="alert"]'), null);
});
const compiled = await transform(await readFile(new URL('../../../apps/docs/src/prism/admin-lists-demo.tsx', import.meta.url), 'utf8'), { loader: 'tsx', jsx: 'automatic', format: 'esm' });
const portable = compiled.code.replace(/\bfrom\s+["']([^"']+)["']/g, (_match, specifier) => { assert.ok(['react', 'react/jsx-runtime', '@pydemia/prism'].includes(specifier)); return 'from ' + JSON.stringify(import.meta.resolve(specifier)); });
const { AdminListsExample } = await import('data:text/javascript;base64,' + Buffer.from(portable).toString('base64'));
test("complete synthetic example applies group status and retains a failed notice for a successful retry", async () => {
    await render(h(AdminListsExample)); await click(checkbox("현재 목록 전체 선택")); await click(button("비활성")); await click(confirmation()); await wait(70); assert.match(document.body.textContent, /합성 그룹 10개 비활성화 완료/);
    await clear(); await render(h(AdminListsExample, { initialMode: "partial" })); await click(checkbox("현재 목록 전체 선택")); await click(button("삭제")); await click(confirmation()); await wait(230); assert.match(document.body.textContent, /합성 공지 9개 삭제 완료, 1개 실패/); assert.match(document.querySelector('.prism-admin-list-summary').textContent, /선택 1건/);
    await click(document.querySelector('input[type="checkbox"]')); await click(button("삭제")); await click(confirmation()); await wait(70); assert.match(document.body.textContent, /합성 공지 1개 삭제 완료, 0개 실패/); assert.match(document.querySelector('.prism-admin-list-summary').textContent, /선택 0건/);
});
