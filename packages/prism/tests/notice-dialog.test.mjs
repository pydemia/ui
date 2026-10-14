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
const { PrismNoticeDialog, PrismNoticePopup, PrismInquiryHistoryDialog, PrismPrivacyPolicyDialog } = await import("../dist/index.js");
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

test("policy dialog keeps a prior document while a version loads and isolates its HTML", async () => {
    let closed = false;
    const props = { open: true, onOpenChange: next => { closed = !next; }, versions: [{ id: "one", label: "v1" }], value: "one", onValueChange: () => {}, documentHtml: "<!doctype html><html><body><h1>Example policy</h1></body></html>" };
    await act(async () => root.render(h(PrismPrivacyPolicyDialog, props)));
    const frame = dialog().querySelector("iframe");
    assert.ok(frame);
    assert.equal(frame.getAttribute("sandbox"), "allow-same-origin allow-popups allow-popups-to-escape-sandbox");
    assert.doesNotMatch(frame.getAttribute("sandbox"), /allow-scripts/);
    assert.equal(dialog().querySelector('[role="combobox"]')?.textContent, "v1");
    await act(async () => root.render(h(PrismPrivacyPolicyDialog, { ...props, loading: true })));
    assert.equal(dialog().querySelector("iframe"), frame);
    assert.equal(frame.getAttribute("aria-busy"), "true");
    assert.equal(frame.style.opacity, "0.5");
    assert.equal(dialog().querySelector('[role="combobox"]').disabled, false);
    await click([...dialog().querySelectorAll("footer button")].find(node => node.textContent === "닫기"));
    assert.equal(closed, true);
});

test("policy dialog shows loading and failure states when no document is available", async () => {
    const props = { open: true, onOpenChange: () => {}, versions: [], value: "", onValueChange: () => {}, documentHtml: "", loading: true };
    await act(async () => root.render(h(PrismPrivacyPolicyDialog, props)));
    assert.equal(dialog().querySelector('[role="combobox"]'), null);
    assert.equal(dialog().querySelectorAll(".prism-policy-skeleton > span").length, 23);
    await act(async () => root.render(h(PrismPrivacyPolicyDialog, { ...props, loading: false })));
    assert.match(dialog().textContent, /개인정보처리방침을 불러오지 못했습니다/);
    assert.match(dialog().textContent, /잠시 후 다시 시도해 주세요/);
});

test("inquiry dialog orders records, opens detail and shows a result only for completed answers", async () => {
    const items = [
        { id: "waiting", title: "가상 대기 문의", date: "2026.10.02", status: "waiting", content: "확인 중", answer: null },
        { id: "done", title: "가상 완료 문의", date: "2026.10.03", status: "done", content: "처리 요청", answer: "처리했습니다." },
    ];
    let selectedId = null, order = "latest", closed = false;
    const renderInquiry = () => act(async () => root.render(h(PrismInquiryHistoryDialog, { open: true, onOpenChange: next => { closed = !next; }, items, total: 9, selectedId, onSelect: next => { selectedId = next; }, order, onOrderChange: next => { order = next; } })));
    await renderInquiry();
    assert.match(dialog().textContent, /Total 9/);
    assert.deepEqual([...dialog().querySelectorAll("tbody button")].map(node => node.textContent), ["가상 완료 문의", "가상 대기 문의"]);
    await click([...dialog().querySelectorAll("button")].find(node => node.textContent === "등록 최신순"));
    assert.equal(order, "oldest");
    await renderInquiry();
    assert.deepEqual([...dialog().querySelectorAll("tbody button")].map(node => node.textContent), ["가상 대기 문의", "가상 완료 문의"]);
    await click([...dialog().querySelectorAll("tbody button")].find(node => node.textContent === "가상 대기 문의"));
    assert.equal(selectedId, "waiting");
    await renderInquiry();
    assert.match(dialog().textContent, /문의내용/);
    assert.doesNotMatch(dialog().textContent, /문의결과|처리했습니다/);
    selectedId = "done";
    await renderInquiry();
    assert.match(dialog().textContent, /문의결과|처리했습니다/);
    await click([...dialog().querySelectorAll("footer button")].find(node => node.textContent === "목록으로"));
    assert.equal(selectedId, null);
    selectedId = "deleted";
    await renderInquiry();
    assert.equal(dialog().querySelector("h2")?.textContent, "문의내역");
    assert.match(dialog().textContent, /Total 9/);
    await click([...dialog().querySelectorAll("footer button")].find(node => node.textContent === "닫기"));
    assert.equal(closed, true);
});

test("notice popup cycles without a modal overlay and routes attachment intent", async () => {
    const items = [
        { id: "first", title: "첫 공지", date: "2026.10.03", author: "예시", content: "본문", attachments: [{ id: "file", name: "가상 파일.pdf" }] },
        { id: "second", title: "둘째 공지", date: "2026.10.02", author: "예시", content: "본문" },
    ];
    let index = 0, downloaded = "", closed = false;
    const renderPopup = () => act(async () => root.render(h(PrismNoticePopup, { open: true, notices: items, index, onIndexChange: next => { index = next; }, onClose: () => { closed = true; }, onDownload: id => { downloaded = id; } })));
    await renderPopup();
    const popup = document.querySelector(".prism-notice-popup");
    assert.equal(popup.getAttribute("role"), "dialog");
    assert.equal(document.querySelector('[data-state="open"][aria-hidden="true"]'), null);
    await click([...popup.querySelectorAll("button")].find(node => node.textContent === "가상 파일.pdf"));
    assert.equal(downloaded, "file");
    await click(popup.querySelector('[aria-label="다음 공지"]'));
    assert.equal(index, 1);
    await renderPopup();
    assert.match(document.querySelector(".prism-notice-popup").textContent, /둘째 공지|2\/2/);
    await act(async () => { document.querySelector(".prism-notice-popup").dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Escape", bubbles: true })); });
    assert.equal(closed, true);
});
