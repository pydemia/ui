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
const { PrismUserManagement, normalizePrismUserFilters, createPrismUserFilterDraft } = await import("../dist/index.js");
const root = createRoot(document.getElementById("root")), render = node => act(async () => root.render(node)), clear = () => render(null), click = node => act(async () => node.click());
const options = { companies: [{ value: "a", label: "가상 회사" }, { value: "b", label: "예시 회사" }], companyGroups: [{ value: "g", label: "가상 그룹" }, { value: "h", label: "예시 그룹" }], roles: [{ value: "member", label: "멤버", needsCompanyGroup: true }, { value: "admin", label: "운영자" }] };
const rows = [{ id: "a", active: true, name: "가상 A", company: "가상 회사", email: "a@example.com", role: "멤버", companyGroup: { name: "가상 그룹", active: false } }, { id: "b", active: false, name: null, company: null, email: null, role: null }];
let config, state, calls;
function Host() {
    const [filters, setFilters] = useState(createPrismUserFilterDraft(options)), [selected, setSelected] = useState(config.selected ?? ["a"]), [page, setPage] = useState(2), [sort, setSort] = useState({ column: "name", direction: "asc" });
    state = { filters, selected, page, sort, setFilters, setSelected };
    return h(PrismUserManagement, { ...options, rows, filters, onFiltersChange: setFilters, total: 12, page, pageCount: 2, onPageChange: value => { calls.pages.push(value); setPage(value); },
        onSearch: value => calls.search.push(value), selected, onSelectionChange: value => { calls.selection.push(value); setSelected(value); }, sort, onSortChange: value => { calls.sort.push(value); setSort(value); },
        onOpen: row => calls.open.push(row.id), onCreate: () => calls.create++, scopeKey: "one", onStatusChange: async request => calls.status.push(request), ...config, selected });
}
async function start(overrides = {}) { config = overrides; calls = { pages: [], search: [], selection: [], sort: [], open: [], create: 0, status: [] }; await render(h(Host)); }
const button = label => [...document.querySelectorAll('button')].find(node => node.textContent === label);
const checkbox = label => [...document.querySelectorAll('label.prism-choice')].find(node => node.textContent === label)?.querySelector('[role="checkbox"]');
const field = label => [...document.querySelectorAll('.prism-field')].find(node => node.querySelector('label')?.textContent === label);
const tick = () => new Promise(resolve => setTimeout(resolve, 5));
async function typeKeyword(value) { await act(async () => { const input = field("검색어").querySelector('input'); Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, 'value').set.call(input, value); input.dispatchEvent(new Event('input', { bubbles: true })); }); }
async function submit() { await act(async () => document.querySelector('.prism-user-filter-bar').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))); }
test("user query normalizes all/none and role-specific groups without mutating or leaking draft fields", () => {
    const initial = createPrismUserFilterDraft(options), all = normalizePrismUserFilters(initial, options); assert.deepEqual(all, { isActive: [], companyIds: [], roleCode: "", companyGroupIds: [], keyword: "" });
    const partial = { ...initial, statuses: ["inactive"], companyIds: ["a"], roleCode: "member", companyGroupIds: ["g"], keyword: "  가상  ", privateField: "synthetic-private" }, before = JSON.stringify(partial);
    assert.deepEqual(normalizePrismUserFilters(partial, options), { isActive: [false], companyIds: ["a"], roleCode: "member", companyGroupIds: ["g"], keyword: "가상" }); assert.equal(JSON.stringify(partial), before);
    assert.deepEqual(normalizePrismUserFilters({ ...partial, roleCode: "admin" }, options).companyGroupIds, []);
    assert.deepEqual(normalizePrismUserFilters({ ...initial, statuses: [], companyIds: [] }, options).isActive, []);
});
test("draft typing waits for apply and reset clears the query/page/selection using current options", async () => {
    await start(); await typeKeyword("  가상  "); assert.equal(calls.search.length, 0); assert.equal(state.page, 2);
    await submit(); assert.equal(calls.search[0].keyword, "가상"); assert.equal(state.page, 1); assert.deepEqual(state.selected, []); assert.equal(state.filters.keyword, "  가상  ");
    await click(button("초기화")); assert.equal(state.filters.keyword, ""); assert.deepEqual(state.filters.companyIds, ["a", "b"]); assert.deepEqual(calls.search[1], normalizePrismUserFilters(createPrismUserFilterDraft(options), options)); await clear();
});
test("six user columns expose status/group absence and email cannot sort; sort keeps selected IDs", async () => {
    await start(); assert.deepEqual([...document.querySelectorAll('thead th')].slice(1).map(node => node.textContent), ["상태", "이름", "소속 회사", "이메일", "Role", "회사 그룹"]);
    assert.equal([...document.querySelectorAll('thead th')].find(node => node.textContent === "이메일").querySelector('button'), null);
    assert.equal(document.querySelectorAll('tbody tr')[1].querySelectorAll('td')[1].textContent, "비활성"); assert.equal(document.querySelectorAll('tbody tr')[1].querySelectorAll('td')[2].textContent, "-");
    await click([...document.querySelectorAll('thead button')].find(node => node.textContent === "상태")); assert.deepEqual(calls.sort[0], { column: "status", direction: "asc" }); assert.equal(state.page, 1); assert.deepEqual(state.selected, ["a"]); await clear();
});
test("administrator any-selection header clears all pages and checkbox clicks never open a row", async () => {
    await start({ selected: ["a", "other-page"] }); await click(checkbox("현재 목록 전체 선택")); assert.deepEqual(calls.selection[0], []); assert.deepEqual(calls.open, []);
    await click(checkbox("현재 목록 전체 선택")); assert.deepEqual(calls.selection[1], ["a", "b"]);
    await click(document.querySelector('tbody tr td:nth-child(3) button')); assert.deepEqual(calls.open, ["a"]); await clear();
});
test("company-group filter follows role metadata without erasing its staged selection", async () => {
    await start(); assert.equal(field("회사 그룹").querySelector('button').disabled, true);
    await act(async () => state.setFilters({ ...state.filters, roleCode: "member", companyGroupIds: ["g"] })); assert.equal(field("회사 그룹").querySelector('button').disabled, false);
    await submit(); assert.deepEqual(calls.search[0].companyGroupIds, ["g"]);
    await act(async () => state.setFilters({ ...state.filters, roleCode: "admin" })); assert.equal(field("회사 그룹").querySelector('button').disabled, true); assert.deepEqual(state.filters.companyGroupIds, ["g"]);
    await submit(); assert.deepEqual(calls.search[1].companyGroupIds, []); await clear();
});
test("confirmation captures immutable public IDs, fences duplicate requests and preserves later selections", async () => {
    let resolve, captured, signal;
    await start({ onStatusChange: (request, context) => { captured = request; signal = context.signal; return new Promise(done => { resolve = done; }); } });
    await click(button("비활성화")); assert.ok(document.querySelector('[role="dialog"]')); const confirm = [...document.querySelectorAll('[role="dialog"] button')].find(node => node.textContent === "비활성화");
    await act(async () => { confirm.click(); confirm.click(); }); assert.deepEqual(captured, { ids: ["a"], active: false }); assert.equal(Object.isFrozen(captured.ids), true); assert.equal(signal.aborted, false);
    assert.ok(button("처리 중")); assert.ok([...document.querySelectorAll('thead button')].every(node => node.disabled)); await act(async () => state.setSelected(["a", "new-selection"])); await act(async () => { resolve(); await tick(); }); assert.deepEqual(state.selected, ["new-selection"]); assert.equal(document.querySelector('[role="dialog"]'), null); await clear();
});
test("a rejected status mutation retains draft/selection and retries the same confirmation", async () => {
    let count = 0; await start({ onStatusChange: async () => { if (++count === 1) throw new Error("synthetic"); }, getStatusErrorMessage: () => "합성 요청 실패" }); await typeKeyword("보존할 검색어");
    await click(button("활성화")); const confirm = () => [...document.querySelectorAll('[role="dialog"] button')].find(node => node.textContent === "활성화");
    await click(confirm()); assert.match(document.querySelector('[role="alert"]').textContent, /합성 요청 실패/); assert.deepEqual(state.selected, ["a"]); assert.equal(state.filters.keyword, "보존할 검색어");
    await click(confirm()); assert.equal(count, 2); assert.deepEqual(state.selected, []); assert.equal(document.querySelector('[role="dialog"]'), null); await clear();
});
test("scope replacement and permission changes abort old mutations and ignore late completion", async () => {
    for (const change of [{ scopeKey: "two" }, { readOnly: true }]) {
        let resolve, signal; await start({ onStatusChange: (_request, context) => { signal = context.signal; return new Promise(done => { resolve = done; }); } });
        await click(button("비활성화")); await click([...document.querySelectorAll('[role="dialog"] button')].find(node => node.textContent === "비활성화"));
        config = { ...config, ...change }; await render(h(Host)); assert.equal(signal.aborted, true); assert.equal(document.querySelector('[role="dialog"]'), null);
        await act(async () => { resolve(); await tick(); }); assert.deepEqual(state.selected, ["a"]); assert.deepEqual(calls.selection, []); await clear();
    }
});
test("unmount cancels the status callback and cannot clear a replacement host", async () => {
    let resolve, signal; await start({ onStatusChange: (_request, context) => { signal = context.signal; return new Promise(done => { resolve = done; }); } });
    await click(button("활성화")); await click([...document.querySelectorAll('[role="dialog"] button')].find(node => node.textContent === "활성화")); await clear(); assert.equal(signal.aborted, true);
    await start(); await act(async () => { resolve(); await tick(); }); assert.deepEqual(state.selected, ["a"]); assert.deepEqual(calls.selection, []); await clear();
});
test("default 500-user limit and read-only mode block mutation while keeping detail navigation", async () => {
    await start({ selected: Array.from({ length: 501 }, (_, index) => String(index)) }); await click(button("활성화")); assert.match(document.querySelector('[role="alert"]').textContent, /최대 500명/); assert.equal(document.querySelector('[role="dialog"]'), null); await clear();
    await start({ readOnly: true }); assert.equal(button("활성화").disabled, true); assert.equal(button("등록").disabled, true); assert.equal(checkbox("현재 목록 전체 선택").disabled, true);
    await click(document.querySelector('tbody tr td:nth-child(3) button')); assert.deepEqual(calls.open, ["a"]); await clear();
});
test("loading has ten skeleton rows; empty omits pages and list errors expose retry", async () => {
    await start({ loading: true }); assert.equal(document.querySelectorAll('tbody tr').length, 10); assert.equal(checkbox("현재 목록 전체 선택").disabled, true); await clear();
    await start({ rows: [] }); assert.match(document.querySelector('tbody').textContent, /검색 조건을 변경/); assert.equal(document.querySelector('.prism-pagination'), null); await clear();
    let retries = 0; await start({ error: "합성 조회 오류", onRetry: () => retries++ }); await click(button("다시 조회")); assert.equal(retries, 1); await clear();
});
const source = await readFile(new URL('../../../apps/docs/src/prism/admin-users-demo.tsx', import.meta.url), 'utf8');
const compiled = await transform(source, { loader: 'tsx', jsx: 'automatic', format: 'esm' });
const portable = compiled.code.replace(/\bfrom\s+["']([^"']+)["']/g, (_match, specifier) => { assert.ok(['react', 'react/jsx-runtime', '@pydemia/prism'].includes(specifier)); return 'from ' + JSON.stringify(import.meta.resolve(specifier)); });
const { UserManagementExample } = await import('data:text/javascript;base64,' + Buffer.from(portable).toString('base64'));
test("complete portable example applies staged filtering and a confirmed synthetic status change", async () => {
    await render(h(UserManagementExample)); assert.match(document.querySelector('.prism-user-summary').textContent, /총 23건/); await typeKeyword("synthetic23@example.com"); assert.equal(document.querySelectorAll('tbody tr').length, 10);
    await submit(); assert.equal(document.querySelectorAll('tbody tr').length, 1); await click(checkbox("현재 목록 전체 선택")); await click(button("비활성화"));
    await click([...document.querySelectorAll('[role="dialog"] button')].find(node => node.textContent === "비활성화")); await act(async () => new Promise(resolve => setTimeout(resolve, 130)));
    assert.match(document.body.textContent, /합성 1명 비활성화 완료/); assert.equal(document.querySelector('tbody tr td:nth-child(2)').textContent, "비활성"); await clear();
});
