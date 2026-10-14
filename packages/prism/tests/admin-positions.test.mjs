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
const { PrismPositionManagement, normalizePrismPositionFilters, createPrismPositionListState, capturePrismPositionListSnapshot, restorePrismPositionListSnapshot, initializePrismPositionOptions, createPrismPositionListQuery, paginatePrismPositions } = await import("../dist/index.js");
const root = createRoot(document.getElementById("root")), render = node => act(async () => root.render(node)), clear = () => render(null), click = node => { assert.ok(node, "Expected control"); return act(async () => node.click()); };
const options = { companies: [{ value: "a", label: "가상 회사" }, { value: "b", label: "예시 회사" }], industries: [{ value: "i", label: "제조" }, { value: "j", label: "서비스" }], jobs: [{ value: "job", label: "기획" }, { value: "other", label: "영업" }], roles: [{ value: "r", label: "팀장" }, { value: "s", label: "본부장" }] };
const rows = [{ id: "a", name: "가상 A", isKeyPosition: true, company: "가상 회사", changeStatus: "CREATE", updatedAt: "2026.10.12" }, { id: "b", name: "가상 B", isKeyPosition: false, changeStatus: "PROGRESS" }];
let config, state, calls;
function Host() {
    const [list, setList] = useState(() => ({ ...createPrismPositionListState("TEMP", options), page: 2 })), [selected, setSelected] = useState(config.selected ?? ["a"]);
    state = { list, selected, setList, setSelected };
    return h(PrismPositionManagement, { ...options, rows, total: 12, pageCount: 2, state: list, onStateChange: value => { calls.states.push(value); setList(value); },
        selected, onSelectionChange: value => { calls.selections.push(value); setSelected(value); }, onOpen: row => calls.open.push(row.id), onCreate: () => calls.create++,
        sync: { status: "editing", date: "2026.10.12" }, scopeKey: "one", onAction: async request => { calls.actions.push(request); return { outcome: "applied" }; },
        onActionApplied: (request, result) => calls.applied.push({ request, result }), ...config, selected });
}
async function start(overrides = {}) { await clear(); config = overrides; calls = { states: [], selections: [], open: [], create: 0, actions: [], applied: [] }; await render(h(Host)); }
const button = label => [...document.querySelectorAll('button')].find(node => node.textContent === label);
const checkbox = label => [...document.querySelectorAll('label.prism-choice')].find(node => node.textContent === label)?.querySelector('[role="checkbox"]');
const field = label => [...document.querySelectorAll('.prism-field')].find(node => node.querySelector('label')?.textContent === label);
const wait = ms => act(async () => new Promise(resolve => setTimeout(resolve, ms)));
const confirmation = () => [...document.querySelectorAll('[role="dialog"] button')].at(-1);
async function typeKeyword(value) { await act(async () => { const input = field("검색어").querySelector('input'); Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, 'value').set.call(input, value); input.dispatchEvent(new Event('input', { bubbles: true })); }); }
async function submit() { await act(async () => document.querySelector('.prism-position-filter-bar').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))); }
async function selectTab(label) { await act(async () => button(label).dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))); }

test("position filters omit all/none, trim a public query, and change-status applies only to TEMP", () => {
    const state = createPrismPositionListState("TEMP", options), draft = { ...state.filters, kinds: ["normal"], companyIds: ["a"], changeStatus: ["UPDATE"], keyword: "  가상  ", private: "exclude" }, before = JSON.stringify(draft);
    const applied = normalizePrismPositionFilters(draft, options, "TEMP"); assert.equal(applied.isKeyPosition, false); assert.deepEqual(applied.companyIds, ["a"]); assert.deepEqual(applied.changeStatus, ["UPDATE"]); assert.equal(applied.keyword, "가상"); assert.equal(applied.private, undefined); assert.equal(JSON.stringify(draft), before);
    assert.deepEqual(normalizePrismPositionFilters(draft, options, "LIVE").changeStatus, []);
    assert.deepEqual(normalizePrismPositionFilters(state.filters, options, "TEMP").companyIds, []);
    assert.deepEqual(normalizePrismPositionFilters({ ...draft, companyIds: [] }, options, "TEMP").companyIds, []);
});
test("status filtering requires complete ordered results and computes global totals before pagination", () => {
    const state = createPrismPositionListState("TEMP", options); state.applied.changeStatus = ["UPDATE"]; state.page = 2;
    const all = Array.from({ length: 47 }, (_, i) => ({ id: String(i), name: String(i), isKeyPosition: true, changeStatus: i % 2 ? "CREATE" : "UPDATE" }));
    assert.deepEqual(createPrismPositionListQuery(state).sort, ["updated_at:desc"]); assert.equal(createPrismPositionListQuery(state).unpaged, true); assert.equal(createPrismPositionListQuery(state).page, undefined);
    const view = paginatePrismPositions({ kind: "all", rows: all }, state); assert.equal(view.total, 24); assert.equal(view.pageCount, 3); assert.deepEqual(view.rows.map(row => row.id), ["20", "22", "24", "26", "28", "30", "32", "34", "36", "38"]);
    assert.throws(() => paginatePrismPositions({ kind: "page", rows: all.slice(0, 10), total: 47, pageCount: 5 }, state), /complete unpaged/);
    state.page = 99; assert.equal(paginatePrismPositions({ kind: "all", rows: all }, state).page, 3);
    state.source = "LIVE"; assert.equal(createPrismPositionListQuery(state).unpaged, undefined); assert.equal(createPrismPositionListQuery(state).size, 10);
    assert.equal(paginatePrismPositions({ kind: "page", rows: [], total: 23, pageCount: 3 }, state).page, 3);
});
test("restoration requires same account/version and literal intent or same history; metadata preserves restored draft", () => {
    const state = createPrismPositionListState("TEMP", options); state.filters.companyIds = ["a"]; state.filters.keyword = "미적용"; state.applied.keyword = "applied"; state.page = 3; state.selected = ["private-id"]; state.private = "exclude";
    const snapshot = capturePrismPositionListSnapshot(state, { contextKey: "account-a", locationKey: "history-a" }); assert.equal(snapshot.state.selected, undefined); assert.equal(snapshot.state.private, undefined);
    state.filters.companyIds.push("b"); assert.deepEqual(snapshot.state.filters.companyIds, ["a"]);
    const context = { contextKey: "account-a", locationKey: "history-b", source: "TEMP", routeState: { restoreList: true } };
    const restored = restorePrismPositionListSnapshot(snapshot, context); assert.equal(restored.page, 3); assert.equal(restored.filters.keyword, "미적용"); assert.equal(restored.applied.keyword, "applied");
    assert.deepEqual(initializePrismPositionOptions(restored, options, true).filters.companyIds, ["a"]); assert.deepEqual(initializePrismPositionOptions(restored, options, false).filters.companyIds, ["a", "b"]);
    restored.filters.companyIds.push("other"); assert.deepEqual(snapshot.state.filters.companyIds, ["a"]);
    for (const change of [{ contextKey: "other" }, { source: "LIVE" }, { routeState: { restoreList: "true" } }, { routeState: null }]) assert.equal(restorePrismPositionListSnapshot(snapshot, { ...context, ...change }), null);
    assert.ok(restorePrismPositionListSnapshot(snapshot, { ...context, locationKey: "history-a", routeState: null }));
});
test("typing is staged; apply/reset clear selection and page, sorting preserves selected IDs", async () => {
    await start(); await typeKeyword("  가상  "); assert.equal(state.list.applied.keyword, ""); assert.equal(state.list.page, 2);
    await submit(); assert.equal(state.list.applied.keyword, "가상"); assert.equal(state.list.page, 1); assert.deepEqual(state.selected, []);
    await act(async () => state.setSelected(["a"])); await click([...document.querySelectorAll('thead button')].find(node => node.textContent === "회사")); assert.deepEqual(state.selected, ["a"]); assert.deepEqual(state.list.sort, { column: "company", direction: "asc" });
    await click(button("초기화")); assert.equal(state.list.filters.keyword, ""); assert.deepEqual(state.list.filters.companyIds, ["a", "b"]); assert.deepEqual(state.selected, []); await clear();
});
test("version changes reset query/selection/page and expose seven LIVE or eight TEMP columns", async () => {
    await start(); assert.equal(document.querySelectorAll('thead th').length, 9); await typeKeyword("가상"); await submit();
    await selectTab("현재 반영 버전"); assert.equal(state.list.source, "LIVE"); assert.equal(state.list.page, 1); assert.equal(state.list.filters.keyword, ""); assert.deepEqual(state.selected, []);
    assert.equal(field("변경 상태"), undefined); assert.equal(document.querySelectorAll('thead th').length, 7); assert.equal(button("등록"), undefined);
    await selectTab("편집 버전"); assert.equal(state.list.source, "TEMP"); assert.ok(field("변경 상태")); assert.equal(document.querySelectorAll('thead th').length, 9); await clear();
});
test("PROGRESS cannot be selected; header clears cross-page selection and row checkbox never opens detail", async () => {
    await start({ selected: ["a", "other-page"] }); assert.equal(checkbox("가상 B 선택").disabled, true);
    await click(checkbox("현재 목록 전체 선택")); assert.deepEqual(state.selected, []); assert.deepEqual(calls.open, []);
    await click(checkbox("현재 목록 전체 선택")); assert.deepEqual(state.selected, ["a"]);
    await click(document.querySelector('tbody tr td:nth-child(4) button')); assert.deepEqual(calls.open, ["a"]); await clear();
});
test("scheduled/running/read-only lock editing but preserve read navigation; sync labels and actions differ", async () => {
    for (const status of ["scheduled", "running", "synced", "failed"]) {
        await start({ sync: { status, date: "2026.10.12" } });
        if (status === "scheduled" || status === "running") { assert.equal(button("등록").disabled, true); assert.equal(checkbox("현재 목록 전체 선택"), undefined); }
        if (status === "scheduled") { assert.ok(button("동기화 취소")); assert.equal(button("동기화"), undefined); }
        if (status === "running" || status === "synced") assert.equal(button("동기화").disabled, true);
        if (status === "failed") { assert.equal(button("동기화").disabled, false); assert.match(document.querySelector('.prism-position-sync').textContent, /동기화에 실패/); }
        await click([...document.querySelectorAll('tbody button')].find(node => node.textContent === "가상 A")); assert.deepEqual(calls.open, ["a"]); await clear();
    }
    await start({ readOnly: true }); assert.equal(button("등록").disabled, true); assert.equal(button("삭제").disabled, true); assert.equal(button("동기화").disabled, true); await clear();
});
test("delete freezes IDs, fences duplicates, retains later selections and moves off a deleted last page", async () => {
    let resolve, captured, signal;
    await start({ rows: [rows[0]], onAction: (request, context) => { captured = request; signal = context.signal; return new Promise(done => { resolve = done; }); } });
    await click(button("삭제")); await act(async () => { confirmation().click(); confirmation().click(); }); assert.deepEqual(captured, { type: "delete", ids: ["a"] }); assert.ok(Object.isFrozen(captured.ids)); assert.equal(signal.aborted, false);
    assert.ok([...document.querySelectorAll('thead button')].every(node => node.disabled)); await act(async () => state.setSelected(["a", "later"])); await act(async () => resolve({ outcome: "applied" }));
    assert.deepEqual(state.selected, ["later"]); assert.equal(state.list.page, 1); assert.equal(calls.applied.length, 1); await clear();
});
test("failure retains selection/draft and retries; domain-wide schedule has no IDs and no-change retains selection", async () => {
    let count = 0; await start({ onAction: async request => { calls.actions.push(request); if (++count === 1) throw new Error("synthetic"); return { outcome: "no-changes" }; }, getActionErrorMessage: () => "합성 실패" });
    await typeKeyword("보존할 입력"); await click(button("동기화")); await click(confirmation()); assert.match(document.querySelector('[role="dialog"]').textContent, /합성 실패/); assert.deepEqual(state.selected, ["a"]);
    await click(confirmation()); assert.equal(count, 2); assert.deepEqual(calls.actions, [{ type: "schedule" }, { type: "schedule" }]); assert.deepEqual(state.selected, ["a"]); assert.equal(state.list.filters.keyword, "보존할 입력"); assert.equal(document.querySelector('[role="dialog"]'), null); await clear();
});
test("scope, permission, sync status and version replacement abort old actions; unmount also ignores completion", async () => {
    for (const change of [{ scopeKey: "two" }, { readOnly: true }, { sync: { status: "running", date: "-" } }, { state: createPrismPositionListState("LIVE", options) }, null]) {
        let resolve, signal; await start({ onAction: (_request, context) => { signal = context.signal; return new Promise(done => { resolve = done; }); } });
        await click(button("삭제")); await click(confirmation());
        if (change) { config = { ...config, ...change }; await render(h(Host)); } else await clear();
        assert.equal(signal.aborted, true); assert.equal(document.querySelector('[role="dialog"]'), null); await act(async () => resolve({ outcome: "applied" })); assert.deepEqual(calls.applied, []); assert.deepEqual(calls.selections, []); await clear();
    }
});
test("loading uses ten rows, empty hides pages, error offers retry and sync request waits for status loading", async () => {
    await start({ loading: true }); assert.equal(document.querySelectorAll('tbody tr').length, 10); assert.equal(button("동기화"), undefined); await clear();
    await start({ rows: [] }); assert.match(document.querySelector('tbody').textContent, /검색 조건을 변경/); assert.equal(document.querySelector('.prism-pagination'), null); await clear();
    let retries = 0; await start({ error: "합성 오류", onRetry: () => retries++ }); await click(button("다시 조회")); assert.equal(retries, 1); await clear();
    await start({ sync: { status: "editing", date: "-", loading: true } }); assert.equal(button("동기화"), undefined); assert.equal(button("등록").disabled, true); await clear();
});
const compiled = await transform(await readFile(new URL('../../../apps/docs/src/prism/admin-positions-demo.tsx', import.meta.url), 'utf8'), { loader: 'tsx', jsx: 'automatic', format: 'esm' });
const portable = compiled.code.replace(/\bfrom\s+["']([^"']+)["']/g, (_match, specifier) => { assert.ok(['react', 'react/jsx-runtime', '@pydemia/prism'].includes(specifier)); return 'from ' + JSON.stringify(import.meta.resolve(specifier)); });
const { PositionManagementExample } = await import('data:text/javascript;base64,' + Buffer.from(portable).toString('base64'));
test("complete example restores applied/draft/page/sort after detail and asynchronous metadata, with no selected rows", async () => {
    await render(h(PositionManagementExample, { initialMode: "edit" })); await wait(30); await typeKeyword("가상 포지션"); await submit();
    await click([...document.querySelectorAll('thead button')].find(node => node.textContent === "포지션 명")); await click(button("2")); await typeKeyword("미적용 입력");
    await click(checkbox("현재 목록 전체 선택")); await click([...document.querySelectorAll('tbody button')].find(node => node.textContent.includes("가상 포지션")));
    assert.ok(document.querySelector('section[aria-label="합성 포지션 상세"]')); await click(button("목록으로 이동")); await wait(30);
    assert.equal(field("검색어").querySelector('input').value, "미적용 입력"); assert.match(document.querySelector('.prism-position-list-summary').textContent, /총 23건.*선택 0건/); assert.equal(button("2").getAttribute('aria-current'), 'page');
    assert.equal([...document.querySelectorAll('thead th')].find(node => node.textContent === "포지션 명").getAttribute('aria-sort'), 'ascending'); assert.equal(document.querySelectorAll('tbody tr').length, 10); await clear();
});
test("complete example schedules and cancels through host state and actually locks editable controls", async () => {
    await render(h(PositionManagementExample, { initialMode: "edit" })); await wait(30); await click(button("동기화")); await click(confirmation()); await wait(100);
    assert.match(document.body.textContent, /합성 동기화 예약 완료/); assert.equal(button("등록").disabled, true); assert.equal(checkbox("현재 목록 전체 선택"), undefined);
    await click(button("동기화 취소")); await click(confirmation()); await wait(100); assert.match(document.body.textContent, /합성 동기화 취소 완료/); assert.equal(button("등록").disabled, false); assert.ok(checkbox("현재 목록 전체 선택")); await clear();
});
