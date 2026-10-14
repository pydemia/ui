import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { transform } from "esbuild";
import { JSDOM } from "jsdom";
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "http://localhost/", pretendToBeVisual: true });
for (const key of ["window", "document", "HTMLElement", "Element", "Node", "Event", "MouseEvent", "KeyboardEvent", "MutationObserver", "DocumentFragment", "CustomEvent", "NodeFilter", "HTMLInputElement", "HTMLButtonElement", "HTMLFormElement"]) globalThis[key] = dom.window[key];
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
globalThis.getComputedStyle = dom.window.getComputedStyle;
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createElement: h, act, useState } = await import("react");
const { createRoot } = await import("react-dom/client");
const { renderToStaticMarkup } = await import("react-dom/server");
const { PrismSidebar, getPrismHistorySelectionId } = await import("../dist/index.js");
const history = [{ id: "row-a", title: "합성 A", conversationId: "server-a" }, { id: "row-b", title: "합성 B", conversationId: "server-b" }, { id: "draft-row", title: "합성 초안", conversationId: null, localDraftId: "draft-a" }];
const base = { items: [{ id: "favorites", label: "즐겨찾기" }], activeId: "favorites", collapsed: false, onCollapsedChange() {}, onNewChat() {}, onNavigate() {} };
const root = createRoot(document.getElementById("root"));
const render = node => act(async () => root.render(node));
test.afterEach(() => render(null));
const button = name => [...document.querySelectorAll('button')].find(n => n.textContent === name || n.getAttribute('aria-label') === name);
const click = async name => { const n = button(name); assert.ok(n, name); await act(async () => n.click()); };
const waitFor = async predicate => { const until = Date.now() + 1500; while (!predicate() && Date.now() < until) await act(async () => new Promise(resolve => setTimeout(resolve, 10))); assert.ok(predicate()); };

test("source selection resolves route/store IDs to row keys and restricts local drafts to chat home", () => {
    const before = JSON.stringify(history);
    assert.equal(getPrismHistorySelectionId(history, { routeConversationId: "server-b", activeConversationId: "server-a", isChatHome: false }), "row-b");
    assert.equal(getPrismHistorySelectionId(history, { activeConversationId: "server-a", isChatHome: false }), "row-a");
    assert.equal(getPrismHistorySelectionId(history, { activeLocalDraftId: "draft-a", isChatHome: true }), "draft-row");
    assert.equal(getPrismHistorySelectionId(history, { activeLocalDraftId: "draft-a", isChatHome: false }), null);
    assert.equal(getPrismHistorySelectionId(history, { routeConversationId: "missing", activeLocalDraftId: "draft-a", isChatHome: true }), null);
    assert.equal(JSON.stringify(history), before);
});
test("independent history selection retains legacy fallback and explicit null clears selection", () => {
    const doc = props => new JSDOM(renderToStaticMarkup(h(PrismSidebar, { ...base, ...props }))).window.document;
    const independent = doc({ history, activeHistoryId: "row-a" });
    assert.equal(independent.querySelector('.prism-history-row[data-selected] .prism-history-link').textContent, "합성 A");
    assert.equal(independent.querySelectorAll('[aria-current="page"]').length, 1);
    assert.equal(independent.querySelector('[aria-current="page"]').textContent, "즐겨찾기");
    const legacy = [{ id: "legacy", title: "기존 기록" }];
    assert.ok(doc({ history: legacy, activeId: "legacy" }).querySelector('.prism-history-row[data-selected]'));
    assert.equal(doc({ history: legacy, activeId: "legacy", activeHistoryId: null }).querySelector('.prism-history-row[data-selected]'), null);
});
test("sidebar initial disclosure state follows explicit host defaults and controlled overrides", () => {
    const admin = { id: "admin", label: "Admin", children: [{ id: "users", label: "사용자 관리" }] };
    const doc = props => new JSDOM(renderToStaticMarkup(h(PrismSidebar, { ...base, items: [admin], ...props }))).window.document;
    const initial = doc({ defaultExpandedIds: ["admin"] });
    assert.equal(initial.querySelector('button[aria-label="Admin"]').getAttribute("aria-expanded"), "true");
    assert.equal(initial.querySelector('.prism-sidebar-submenu').hidden, false);
    assert.equal(initial.querySelector('button[aria-label="대화기록"]').getAttribute("aria-expanded"), "false");
    const loginReturn = doc({ defaultExpandedIds: ["admin"], defaultHistoryOpen: true });
    assert.equal(loginReturn.querySelector('button[aria-label="대화기록"]').getAttribute("aria-expanded"), "true");
    const controlled = doc({ defaultExpandedIds: ["admin"], expandedIds: [], defaultHistoryOpen: true, historyOpen: false });
    assert.equal(controlled.querySelector('button[aria-label="Admin"]').getAttribute("aria-expanded"), "false");
    assert.equal(controlled.querySelector('button[aria-label="대화기록"]').getAttribute("aria-expanded"), "false");
});
test("opening a collapsed sidebar from an expanded administrator menu keeps that menu open", async () => {
    const admin = { id: "admin", label: "Admin", children: [{ id: "users", label: "사용자 관리" }] };
    function Host() {
        const [collapsed, setCollapsed] = useState(false);
        return h(PrismSidebar, { ...base, items: [admin], collapsed, onCollapsedChange: setCollapsed, defaultExpandedIds: ["admin"] });
    }
    await render(h(Host));
    assert.equal(button("Admin").getAttribute("aria-expanded"), "true");
    await click("사이드바 접기");
    assert.equal(document.querySelector('.prism-sidebar').getAttribute("data-collapsed"), "true");
    await click("Admin");
    assert.equal(document.querySelector('.prism-sidebar').getAttribute("data-collapsed"), "false");
    assert.equal(button("Admin").getAttribute("aria-expanded"), "true");
    assert.equal(document.querySelector('.prism-sidebar-submenu').hidden, false);
    await click("Admin");
    await click("사이드바 접기");
    await click("Admin");
    assert.equal(button("Admin").getAttribute("aria-expanded"), "true");
});
test("persisted open/delete actions use server IDs while the public intent omits private fields", async () => {
    const opened = [], deleted = [];
    await render(h(PrismSidebar, { ...base, history: [{ ...history[0], privateField: "omit" }], onHistoryOpen: v => opened.push(v), onHistoryDeleteRequest: id => deleted.push(id) }));
    await click("합성 A"); assert.deepEqual(opened, [{ kind: "conversation", rowId: "row-a", conversationId: "server-a" }]);
    await click("합성 A 메뉴 열기"); await waitFor(() => button("채팅 삭제")); await click("채팅 삭제"); assert.deepEqual(deleted, ["server-a"]);
    const navigated = []; await render(null); await render(h(PrismSidebar, { ...base, history: [history[0]], onNavigate: id => navigated.push(id) })); await click("합성 A"); assert.deepEqual(navigated, ["server-a"]);
});
test("local drafts have no server actions and cannot be misrouted without a typed open handler", async () => {
    const opened = [], serverActions = [];
    const props = { ...base, history: [history[2]], onNavigate: id => serverActions.push(id), onHistoryRename: () => serverActions.push("rename"), onHistoryDeleteRequest: () => serverActions.push("delete") };
    await render(h(PrismSidebar, props)); assert.equal(button("합성 초안").disabled, true); assert.equal(document.querySelector('.prism-history-more'), null);
    await render(h(PrismSidebar, { ...props, onHistoryOpen: v => opened.push(v) })); await click("합성 초안");
    assert.deepEqual(opened, [{ kind: "local-draft", rowId: "draft-row", localDraftId: "draft-a" }]); assert.deepEqual(serverActions, []);
});
test("changed conversation identity cancels an old rename and closes its menu", async () => {
    const renamed = [], props = { ...base, history: [history[0]], onHistoryRename: (...args) => renamed.push(args) };
    await render(h(PrismSidebar, props)); await click("합성 A 메뉴 열기"); await waitFor(() => button("이름변경")); await click("이름변경");
    const input = document.querySelector('.prism-history-row input'); await act(async () => { Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype, "value").set.call(input, "오래된 초안"); input.dispatchEvent(new Event('input', { bubbles: true })); });
    await render(h(PrismSidebar, { ...props, history: [{ ...history[0], conversationId: "replacement", title: "새 대상" }] }));
    assert.equal(document.querySelector('.prism-history-row input'), null); assert.deepEqual(renamed, []);
    await click("새 대상 메뉴 열기"); await waitFor(() => button("이름변경"));
    await render(h(PrismSidebar, { ...props, history: [{ ...history[0], conversationId: "third", title: "다른 대상" }] })); assert.equal(document.querySelector('.prism-history-menu'), null);
});
test("draft persistence preserves the row/button while changing the typed open intent", async () => {
    const opened = [], props = { ...base, history: [history[2]], activeHistoryId: "draft-row", onHistoryOpen: intent => opened.push(intent) };
    await render(h(PrismSidebar, props)); const original = button("합성 초안"); await click("합성 초안");
    await render(h(PrismSidebar, { ...props, history: [{ ...history[2], conversationId: "saved", title: "저장된 기록" }] }));
    assert.equal(button("저장된 기록"), original); assert.ok(document.querySelector('.prism-history-row[data-selected]')); await click("저장된 기록");
    assert.deepEqual(opened.map(value => value.kind), ["local-draft", "conversation"]); assert.equal(opened[1].conversationId, "saved");
});

const compiled = await transform(await readFile(new URL('../../../apps/docs/src/prism/sidebar-history-demo.tsx', import.meta.url), 'utf8'), { loader: 'tsx', jsx: 'automatic', format: 'esm' });
const code = compiled.code.replace(/\bfrom\s+["']([^"']+)["']/g, (_match, name) => { assert.ok(['react', 'react/jsx-runtime', '@pydemia/prism'].includes(name)); return 'from ' + JSON.stringify(import.meta.resolve(name)); });
const { SidebarHistoryExample } = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
test("profile menu keeps administrator access separate from logout availability", async () => {
    await render(h(SidebarHistoryExample));
    assert.ok(button("Admin"));
    await click("demo-user 사용자 메뉴");
    await waitFor(() => button("공지사항"));
    assert.equal(button("로그아웃"), undefined);
    await render(null);
    await render(h(SidebarHistoryExample, { initialMode: "admin-login" }));
    assert.ok(button("Admin"));
    await click("demo-user 사용자 메뉴");
    await waitFor(() => button("로그아웃"));
    await render(null);
    await render(h(SidebarHistoryExample, { initialMode: "restricted" }));
    assert.equal(button("Admin"), undefined);
});
test("complete example separates favorites and history selection, and promotes a local draft", async () => {
    await render(h(SidebarHistoryExample)); await click("후보자 즐겨찾기");
    assert.equal(button("대화기록").getAttribute("aria-expanded"), "false");
    assert.equal(button("Admin").getAttribute("aria-expanded"), "true");
    await click("대화기록");
    assert.equal(document.querySelector('.prism-nav-item[aria-current="page"]').textContent, "후보자 즐겨찾기");
    assert.equal(document.querySelector('.prism-history-row[data-selected] .prism-history-link').textContent, "현재 합성 대화");
    await click("저장 전 합성 대화"); assert.match(document.body.textContent, /선택한 화면: draft · 세션 키: 1/);
    const original = button("저장 전 합성 대화"); await click("저장 완료 예시"); assert.equal(button("저장된 합성 대화"), original);
    assert.equal(document.querySelector('.prism-history-row[data-selected] .prism-history-link').textContent, "저장된 합성 대화");
    await click("저장된 합성 대화"); assert.match(document.body.textContent, /선택한 화면: draft-row · 세션 키: 1/);
    await render(null); await render(h(SidebarHistoryExample)); await click("후보자 즐겨찾기"); await click("대화기록");
    await click("현재 합성 대화 메뉴 열기"); await waitFor(() => button("채팅 삭제")); await click("채팅 삭제"); await click("삭제");
    await waitFor(() => document.body.textContent.includes("reset-intro-session"));
    assert.match(document.body.textContent, /선택한 화면: favorites · 세션 키: 1/);
    assert.equal(document.querySelector('.prism-nav-item[aria-current="page"]').textContent, "후보자 즐겨찾기");
});

test("long example opens all history rows and candidate navigation clears the active conversation", async () => {
    await render(h(SidebarHistoryExample, { initialMode: "long" }));
    assert.equal(document.querySelectorAll('.prism-history-row').length, 100);
    await click("후보자 즐겨찾기");
    assert.equal(document.querySelectorAll('.prism-history-row[data-selected]').length, 1);
    await click("후보자 목록");
    assert.equal(document.querySelectorAll('.prism-history-row[data-selected]').length, 0);
    assert.equal(document.querySelector('.prism-nav-item[aria-current="page"]').textContent, "후보자 목록");
    assert.equal(document.querySelector('select[aria-label="현재 대화 위치"]').value, "candidates");
    const last = [...document.querySelectorAll('.prism-history-link')].at(-1);
    await click(last.textContent);
    assert.equal(document.querySelector('.prism-history-row[data-selected] .prism-history-link'), last);
    assert.match(document.body.textContent, /선택한 화면: synthetic-history-100/);
    await click("포지션 목록");
    assert.equal(document.querySelectorAll('.prism-history-row[data-selected]').length, 0);
    assert.equal(document.querySelector('.prism-nav-item[aria-current="page"]').textContent, "포지션 목록");
    assert.equal(document.querySelector('select[aria-label="현재 대화 위치"]').value, "positions");
});
