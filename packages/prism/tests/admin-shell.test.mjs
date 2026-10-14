import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "http://localhost/", pretendToBeVisual: true });
for (const key of ["window", "document", "HTMLElement", "Element", "Node", "Event", "MouseEvent", "MutationObserver"]) globalThis[key] = dom.window[key];
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const { createElement: h, act } = await import("react");
const { createRoot } = await import("react-dom/client");
const { PrismAdminLayout, PrismAdminFilterBar, PrismAdminTableToolbar, PrismAdminSyncStatusBar, PrismPositionSyncBar, PrismAttachmentList, PrismTruncatedText } = await import("../dist/index.js");
const root = createRoot(document.getElementById("root"));
const button = label => [...document.querySelectorAll("button")].find(node => node.textContent === label);

test("administrator shell keeps navigation, filter and selected-row actions host-owned", async () => {
    let backs = 0, resets = 0, searches = 0, deletes = 0;
    const render = async (selectedCount, busy = false) => act(async () => root.render(h(PrismAdminLayout, {
        title: "포지션 관리", breadcrumbs: ["Admin", "포지션 관리"], onBack: () => backs++,
        filters: h(PrismAdminFilterBar, { busy, onReset: () => resets++, onSearch: () => searches++ }, h("input", { "aria-label": "검색어" })),
        toolbar: h(PrismAdminTableToolbar, { total: 12, selectedCount, busy, actions: [{ label: "삭제", onClick: () => deletes++ }] }),
    }, h("p", null, "목록"))));
    await render(0);
    assert.match(document.querySelector('[aria-label="현재 위치"]').textContent, /Admin.*포지션 관리/);
    await act(async () => document.querySelector('[aria-label="이전 페이지"]').click());
    await act(async () => button("초기화").click());
    await act(async () => button("조회").click());
    assert.deepEqual([backs, resets, searches], [1, 1, 1]);
    assert.match(document.querySelector(".prism-admin-table-toolbar").textContent, /총 12건.*선택 0건/);
    assert.equal(button("삭제").disabled, true);
    await render(2);
    await act(async () => button("삭제").click());
    assert.equal(deletes, 1);
    await render(2, true);
    assert.equal(button("조회").disabled, true);
    assert.equal(button("삭제").disabled, true);
    await act(async () => root.render(null));
});

test("attachment actions never turn an invalid URL into a link", async () => {
    const downloads = [], removals = [];
    await act(async () => root.render(h(PrismAttachmentList, {
        files: [{ id: "safe", name: "공개.pdf", href: "/files/public.pdf" }, { id: "private", name: "인증.pdf", href: "javascript:alert(1)", status: "error" }],
        onDownload: file => downloads.push(file.id), onRemove: id => removals.push(id),
    })));
    assert.equal(document.querySelector('a[href="/files/public.pdf"]').textContent, "공개.pdf");
    assert.equal(document.querySelectorAll("a").length, 1);
    await act(async () => button("인증.pdf").click());
    await act(async () => document.querySelector('[aria-label="인증.pdf 제거"]').click());
    assert.deepEqual(downloads, ["private"]);
    assert.deepEqual(removals, ["private"]);
    assert.match(document.querySelector('[role="alert"]').textContent, /첨부하지 못했습니다/);
    await act(async () => root.render(null));
});

test("source sync states expose the right action and position management uses the shared implementation", async () => {
    let synced = 0, canceled = 0;
    const common = { date: "2026-10-14", onSync: () => synced++, onCancelSync: () => canceled++ };
    await act(async () => root.render(h(PrismAdminSyncStatusBar, { ...common, status: "editing" })));
    assert.match(document.querySelector(".prism-admin-sync").textContent, /편집 중.*최종 수정 일자/);
    await act(async () => button("동기화").click());
    assert.equal(synced, 1);
    await act(async () => root.render(h(PrismAdminSyncStatusBar, { ...common, status: "scheduled" })));
    await act(async () => button("동기화 취소").click());
    assert.equal(canceled, 1);
    await act(async () => root.render(h(PrismAdminSyncStatusBar, { ...common, status: "running" })));
    assert.equal(button("동기화").disabled, true);
    await act(async () => root.render(h(PrismAdminSyncStatusBar, { ...common, status: "failed" })));
    assert.match(document.querySelector('[role="alert"]').textContent, /동기화에 실패/);
    await act(async () => root.render(h(PrismAdminSyncStatusBar, { ...common, status: "editing", loading: true })));
    assert.equal(document.querySelectorAll("button").length, 0);
    assert.equal(document.querySelector(".prism-admin-sync").getAttribute("aria-busy"), "true");
    await act(async () => root.render(h(PrismPositionSyncBar, { status: "scheduled", date: "2026-10-14", onCancel: () => canceled++ })));
    assert.ok(document.querySelector(".prism-admin-sync"));
    await act(async () => button("동기화 취소").click());
    assert.equal(canceled, 2);
    await act(async () => root.render(null));
});

test("long truncated administrator text can receive keyboard focus for its full tooltip", async () => {
    const full = "사업 전환과 글로벌 연구개발 전략을 함께 담당하는 매우 긴 가상 포지션 이름";
    await act(async () => root.render(h(PrismTruncatedText, { text: full, maxLength: 20 })));
    const trigger = document.querySelector(".prism-truncated");
    assert.equal(trigger.textContent, full);
    assert.equal(trigger.getAttribute("tabindex"), "0");
    await act(async () => root.render(null));
});
