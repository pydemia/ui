import assert from "node:assert/strict";
import test, { afterEach } from "node:test";
import { JSDOM } from "jsdom";

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "http://localhost/", pretendToBeVisual: true });
for (const key of ["window", "document", "HTMLElement", "Element", "Node", "Event", "MouseEvent", "KeyboardEvent", "MutationObserver", "DocumentFragment", "CustomEvent", "NodeFilter", "HTMLInputElement", "HTMLButtonElement", "HTMLFormElement"]) globalThis[key] = dom.window[key];
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
globalThis.getComputedStyle = dom.window.getComputedStyle;
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createElement: h, act } = await import("react");
const { createRoot } = await import("react-dom/client");
const { PrismNoticeDialog } = await import("../dist/index.js");
const root = createRoot(document.getElementById("root"));
afterEach(async () => { await act(async () => root.render(null)); });
const rows = [
    { id: "earlier", title: "이전 공지", date: "2026.10.02", createdAt: "2026-10-02T09:00:00+09:00", author: "가상 작성자" },
    { id: "later", title: "새 공지", date: "2026.10.03", createdAt: "2026-10-03T09:00:00+09:00", author: "가상 작성자" },
];
const detail = { ...rows[1], content: "목록 응답에는 없는 상세 본문" };
const render = props => act(async () => root.render(h(PrismNoticeDialog, { open: true, onOpenChange: () => {}, items: rows, selectedId: null, onSelect: () => {}, ...props })));
const dialog = () => document.querySelector('[role="dialog"]');
const click = node => { assert.ok(node); return act(async () => node.click()); };

test("notice list keeps server total separate and sorts supplied timestamps without mutating rows", async () => {
    const before = JSON.stringify(rows); let order = "latest";
    const onOrderChange = next => { order = next; };
    await render({ total: 120, order, onOrderChange });
    assert.match(dialog().textContent, /Total 120/);
    assert.deepEqual([...dialog().querySelectorAll("tbody button")].map(node => node.textContent), ["새 공지", "이전 공지"]);
    await click([...dialog().querySelectorAll("button")].find(node => node.textContent === "등록 최신순"));
    assert.equal(order, "oldest");
    await render({ total: 120, order, onOrderChange });
    assert.deepEqual([...dialog().querySelectorAll("tbody button")].map(node => node.textContent), ["이전 공지", "새 공지"]);
    assert.equal(JSON.stringify(rows), before);
});

test("selected detail has its own loading, stale-response and retry states", async () => {
    let selected = null, retries = 0;
    await render({ onSelect: id => { selected = id; } });
    await click([...dialog().querySelectorAll("tbody button")].find(node => node.textContent === "새 공지"));
    assert.equal(selected, "later");
    await render({ selectedId: selected, detail: null, detailStatus: "loading" });
    assert.ok(dialog().querySelector(".prism-notice-detail-skeleton"));
    assert.doesNotMatch(dialog().textContent, /목록 응답에는 없는 상세 본문/);
    await render({ selectedId: selected, detail: { ...detail, id: "earlier" } });
    assert.match(dialog().textContent, /공지사항을 불러오지 못했습니다/);
    await render({ selectedId: selected, detail, detailStatus: "ready" });
    assert.match(dialog().textContent, /목록 응답에는 없는 상세 본문/);
    await render({ selectedId: selected, detailStatus: "error", onDetailRetry: () => { retries += 1; } });
    await click([...dialog().querySelectorAll("button")].find(node => node.textContent === "다시 시도"));
    assert.equal(retries, 1);
});

test("loading list uses six table skeleton rows and locks ordering", async () => {
    await render({ status: "loading", onOrderChange: () => { throw new Error("sorting should be locked"); } });
    assert.match(dialog().textContent, /Total 0/);
    assert.equal(dialog().querySelectorAll(".prism-notice-skeleton-row").length, 6);
    assert.equal([...dialog().querySelectorAll("button")].find(node => node.textContent === "등록 최신순").disabled, true);
    await render({ items: [], total: 0 });
    assert.match(dialog().textContent, /등록된 공지사항이 없습니다/);
});
