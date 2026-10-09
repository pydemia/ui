import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "http://localhost/", pretendToBeVisual: true });
for (const key of ["window", "document", "HTMLElement", "Element", "Node", "Event", "KeyboardEvent", "MouseEvent", "MutationObserver", "HTMLInputElement", "HTMLTextAreaElement", "HTMLButtonElement", "DocumentFragment", "CustomEvent", "NodeFilter", "HTMLSelectElement"]) globalThis[key] = dom.window[key];
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
globalThis.getComputedStyle = dom.window.getComputedStyle; globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window); globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }; globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createElement: h, act, useState } = await import("react"), { createRoot } = await import("react-dom/client");
const { PrismCandidateDirectory, PrismCandidateList, PrismPagination, createPrismCandidateDownloadJob } = await import("../dist/index.js");
const root = createRoot(document.getElementById("root"));
const rows = [{ id: "a", name: "김가상", company: "가상전자", position: "기술전략", series: "제조" }, { id: "b", name: "이예시", company: "예시사업", position: "연구개발", series: "제조" }];
const filters = { value: { series: "all", companies: [], name: "" }, seriesOptions: [{ value: "all", label: "전체" }], companyOptions: [{ value: "company", label: "가상전자" }], onValueChange() {}, onSearch() {}, onReset() {} };
const base = { rows, selected: ["a"], onSelectionChange() {}, sort: null, onSortChange() {}, onOpen() {}, filters, total: 40, page: 1, pageCount: 4, onPageChange() {}, rowsPerPage: 10, onRowsPerPageChange() {}, onOutput: async request => ({ preparedCount: request.candidateIds.length }) };
const render = value => act(async () => root.render(value));
const clear = () => render(null);
const byText = (label, scope = document) => [...scope.querySelectorAll("button")].find(button => button.textContent === label);
const byLabel = label => document.querySelector(`[aria-label="${label}"]`);
const click = node => act(async () => node.click());
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
const openOutput = async kind => {
    await click(byText(kind === "download" ? "다운로드" : "프린트", document.querySelector(".prism-candidate-toolbar")));
    return document.querySelector(".prism-print-options-dialog");
};
const confirmOutput = async kind => {
    const dialog = document.querySelector(".prism-print-options-dialog");
    await click(byText(kind === "download" ? "다운로드" : "출력", dialog));
};
const closeNotice = async () => {
    const dialog = document.querySelector(".prism-confirm-dialog");
    if (dialog) await click(byText("확인", dialog));
};

test("candidate chips open once without nested buttons and remote sort starts with source directions", async () => {
    const opens = [], sorts = [];
    function Demo() { const [sort, setSort] = useState(null); return h(PrismCandidateDirectory, { ...base, sort, onOpen: row => opens.push(row.id), onSortChange: value => { sorts.push(value); setSort(value); } }); }
    await render(h(Demo)); assert.equal(document.querySelectorAll("button button").length, 0);
    await click(document.querySelector(".prism-profile-chip")); assert.deepEqual(opens, ["a"]);
    await click(document.querySelector("tbody tr td:nth-child(3)")); assert.deepEqual(opens, ["a", "a"]);
    await click(byLabel("직책 정렬")); await click(byLabel("직책 정렬")); await click(byLabel("후보자 정렬"));
    assert.deepEqual(sorts, [{ column: "position", direction: "desc" }, { column: "position", direction: "asc" }, { column: "name", direction: "asc" }]); await clear();
});

test("candidate partial select-all clears other pages, while an unselected page adds its rows", async () => {
    const changes = [];
    function Demo() { const [selected, setSelected] = useState(["other", "a"]); return h(PrismCandidateDirectory, { ...base, selected, onSelectionChange: value => { changes.push(value); setSelected(value); } }); }
    await render(h(Demo)); assert.equal(byLabel("현재 목록 전체 선택")?.getAttribute("aria-checked") ?? document.querySelector('[role=checkbox]').getAttribute('aria-checked'), "mixed");
    await click(document.querySelector('[role=checkbox]')); assert.deepEqual(changes[0], []);
    await click(document.querySelector('[role=checkbox]')); assert.deepEqual(changes[1], ["a", "b"]);
    await click(document.querySelectorAll('[role=checkbox]')[1]); assert.deepEqual(changes[2], ["b"]); await clear();
});

test("selection limit rejects an entire excess change and search/reset clear controlled selection", async () => {
    const initial = Array.from({ length: 99 }, (_, index) => `other-${index}`), changes = [], intents = [];
    function Demo() { const [selected, setSelected] = useState(initial); return h(PrismCandidateList, { ...base, selected, onSelectionChange: value => { changes.push(value); setSelected(value); }, filters: { ...filters, onSearch: value => intents.push(["search", value]), onReset: () => intents.push(["reset"]) } }); }
    await render(h(Demo)); await click(document.querySelector('.prism-candidate-directory [role=checkbox]'));
    assert.equal(changes.length, 0); assert.match(document.querySelector('.prism-confirm-dialog').textContent, /최대 100명/); assert.equal(document.querySelector('.prism-confirm-dialog .prism-dialog-body').style.minHeight, "50px"); await closeNotice();
    await click(document.querySelectorAll('.prism-candidate-directory [role=checkbox]')[1]); assert.equal(changes[0].length, 100);
    await click(document.querySelectorAll('.prism-candidate-directory [role=checkbox]')[2]); assert.equal(changes.length, 1); await closeNotice();
    await click(byText("조회")); assert.deepEqual(changes.at(-1), []); assert.equal(intents[0][0], "search");
    await click(byLabel("검색 조건 초기화")); assert.deepEqual(changes.at(-1), []); assert.deepEqual(intents.at(-1), ["reset"]); await clear();
});

test("output snapshots selected IDs/options and suppresses duplicate preparation without cancelling on notice close", async () => {
    const job = deferred(), calls = [], selected = ["a", "b"];
    await render(h(PrismCandidateList, { ...base, selected, onOutput: request => { calls.push(request); return job.promise; } }));
    const dialog = await openOutput("download"); await click(dialog.querySelectorAll('[role=checkbox]')[1]); await confirmOutput("download");
    assert.equal(calls.length, 1); assert.deepEqual(calls[0].candidateIds, ["a", "b"]); assert.deepEqual(calls[0].options, ["compensation"]);
    assert.equal(Object.isFrozen(calls[0]), true); assert.equal(Object.isFrozen(calls[0].candidateIds), true); assert.equal(Object.isFrozen(calls[0].options), true);
    selected.push("later"); await closeNotice(); await click(byText("다운로드", document.querySelector(".prism-candidate-toolbar"))); assert.equal(calls.length, 1);
    await act(async () => job.resolve({ preparedCount: 1, excludedCount: 1 })); assert.match(document.querySelector('.prism-toast').textContent, /일부 후보자\(1명\).*다운로드/);
    const fresh = await openOutput("download"); assert.equal(fresh.querySelectorAll('[role=checkbox]')[1].getAttribute('aria-checked'), "false"); await clear();
});

test("failed output retries the original request after selection changes and empty preparation is not success", async () => {
    const calls = [];
    let current = ["a"];
    const output = async request => { calls.push(request); if (calls.length === 1) throw new Error("service failed"); return { preparedCount: 0 }; };
    await render(h(PrismCandidateList, { ...base, selected: current, onOutput: output })); await openOutput("print"); await confirmOutput("print"); await closeNotice();
    assert.match(document.querySelector('.prism-toast').textContent, /인쇄 프로필.*오류/);
    current = ["b"];
    await render(h(PrismCandidateList, { ...base, selected: current, onOutput: output })); await click(byText("다시 시도"));
    assert.deepEqual(calls.map(request => request.candidateIds), [["a"], ["a"]]); assert.notEqual(calls[0].id, calls[1].id); await closeNotice();
    assert.match(document.querySelector('.prism-toast').textContent, /인쇄할 프로필 데이터를 찾을 수 없습니다/); await clear();
});

test("unmount leaves application-owned output preparation running and ignores late local feedback", async () => {
    const job = deferred(); let completed = false;
    await render(h(PrismCandidateList, { ...base, onOutput: async () => { const result = await job.promise; completed = true; return result; } }));
    await openOutput("download"); await confirmOutput("download"); await clear();
    await act(async () => job.resolve({ preparedCount: 1 })); assert.equal(completed, true); assert.equal(document.querySelector('.prism-toast'), null);
});

test("empty selection does not prepare output, page changes retain selection, and readonly blocks mutations", async () => {
    const output = [], pages = [];
    await render(h(PrismCandidateList, { ...base, selected: [], onOutput: async request => { output.push(request); return { preparedCount: 0 }; } }));
    await click(byText("다운로드", document.querySelector('.prism-candidate-toolbar'))); assert.match(document.querySelector('.prism-toast').textContent, /선택된 후보자 없음/); assert.equal(output.length, 0);
    await render(h(PrismCandidateList, { ...base, selected: ["a", "other"], onPageChange: value => pages.push(value) })); await click(byLabel("다음 페이지")); assert.deepEqual(pages, [2]);
    await render(h(PrismCandidateList, { ...base, rows: [rows[1]], selected: ["a", "other"], page: 2 })); assert.match(document.querySelector('.prism-candidate-summary').textContent, /선택 2건/);
    await render(h(PrismCandidateList, { ...base, readOnly: true })); assert.equal(document.querySelector('.prism-candidate-directory [role=checkbox]').disabled, true); assert.equal(byText("프린트").disabled, true); assert.equal(byText("조회").disabled, true); await clear();
});

test("source candidate pagination uses ten visible page numbers and keeps the final page reachable", async () => {
    const pages = [];
    await render(h(PrismPagination, { page: 7, pageCount: 40, pageButtonCount: 10, onPageChange: value => pages.push(value) }));
    assert.deepEqual([...document.querySelectorAll('.prism-pagination-pages button')].map(button => Number(button.textContent)), [2, 3, 4, 5, 6, 7, 8, 9, 10, 11]);
    await click(byLabel("마지막 페이지")); assert.deepEqual(pages, [40]);
    await render(h(PrismPagination, { page: 40, pageCount: 40, pageButtonCount: 10, onPageChange() {} }));
    assert.deepEqual([...document.querySelectorAll('.prism-pagination-pages button')].map(button => Number(button.textContent)), [31, 32, 33, 34, 35, 36, 37, 38, 39, 40]); await clear();
});

test("page size uses scalar string options and emits numeric intent while preserving controlled ownership", async () => {
    const sizes = [];
    await render(h(PrismCandidateList, { ...base, onRowsPerPageChange: value => sizes.push(value) }));
    assert.equal(document.querySelector('.prism-candidate-page-size [role=combobox]').textContent, "10 / page");
    await click(document.querySelector('.prism-candidate-page-size [role=combobox]'));
    await click([...document.querySelectorAll('[role=option]')].find(option => option.textContent === "20 / page"));
    assert.deepEqual(sizes, [20]); assert.equal(document.querySelector('.prism-candidate-page-size [role=combobox]').textContent, "10 / page"); await clear();
});

test("prepared download jobs preserve the request ID and filenames when the caller mutates its document list", () => {
    const documents = [{ filename: "first", data: "first" }, { filename: "second", data: "second" }];
    const request = { id: "selection-one", kind: "download", candidateIds: ["a", "b"], options: [] };
    const job = createPrismCandidateDownloadJob(request, documents, "bundle");
    documents[0].filename = "changed"; documents.pop();
    assert.equal(job.id, "selection-one"); assert.equal(job.archiveName, "bundle"); assert.deepEqual(job.documents.map(document => document.filename), ["first", "second"]);
    assert.throws(() => createPrismCandidateDownloadJob({ ...request, kind: "print" }, job.documents), RangeError);
});
