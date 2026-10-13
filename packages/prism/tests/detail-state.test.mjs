import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { transform } from "esbuild";
import { JSDOM } from "jsdom";
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "http://localhost/", pretendToBeVisual: true });
for (const key of ["window", "document", "HTMLElement", "Element", "Node", "Event", "MouseEvent", "KeyboardEvent", "MutationObserver", "DocumentFragment", "CustomEvent", "NodeFilter", "HTMLInputElement", "HTMLButtonElement"]) globalThis[key] = dom.window[key];
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
globalThis.getComputedStyle = dom.window.getComputedStyle;
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createElement: h, act, StrictMode } = await import("react"), { createRoot } = await import("react-dom/client");
const { usePrismDetailSelection, PrismPanel, PrismSidebar, createPrismAdminMenu } = await import("../dist/index.js");
const root = createRoot(document.getElementById("root"));
const render = node => act(async () => root.render(node)), clear = () => render(null);
const profile = { id: "a", name: "가상 후보", company: "가상 회사", position: "담당", executiveYears: 1 };
let api;
function Host({ initial = null, guard = false }) {
    api = usePrismDetailSelection(initial);
    return api.selection && h(PrismPanel, { title: "상세", open: api.open, onOpenChange: open => { if (!open) api.close(); }, onCloseRequest: guard ? () => {} : undefined },
        h("p", { "data-private-subject": true }, api.selection.kind === "profile" ? api.selection.candidate.name : api.selection.reference.id));
}
test("profile and position selection are exclusive and closing removes subject content", async () => {
    await render(h(Host)); assert.equal(api.selection, null); assert.equal(api.captureRequest(), null);
    await act(async () => api.selectProfile(profile)); assert.equal(api.selection.candidate, profile); assert.equal(document.querySelectorAll('aside').length, 1);
    await act(async () => api.selectPosition({ id: "p", source: "card", version: 2 })); assert.equal(api.selection.kind, "position"); assert.equal(document.body.textContent.includes(profile.name), false);
    await act(async () => api.close()); assert.equal(api.selection, null); assert.equal(api.open, false); assert.equal(document.querySelector('[data-private-subject]'), null); await clear();
});
test("classified global 403 and 404 clear the selected kind and unmount even a manually guarded panel", async () => {
    for (const [status, selection] of [[403, { kind: "profile", candidate: profile }], [404, { kind: "position", reference: { id: "p", source: "link" } }]]) {
        await render(h(StrictMode, null, h(Host, { initial: selection, guard: true })));
        await act(async () => document.querySelector('[aria-label="패널 닫기"]').click()); assert.ok(api.selection);
        await act(async () => assert.equal(api.handleAccessError(status), true)); assert.equal(api.selection, null); assert.equal(document.querySelector('aside'), null);
        assert.equal(api.handleAccessError(status), false, "duplicate delivery does not clear twice"); await clear();
    }
});
test("unclassified statuses and an explicit missing ticket retain the active detail", async () => {
    await render(h(Host, { initial: { kind: "profile", candidate: profile } })); const selected = api.selection;
    for (const status of [400, 401, 429, 500]) assert.equal(api.handleAccessError(status), false);
    assert.equal(api.handleAccessError(403, null), false); assert.equal(api.selection, selected); assert.ok(document.querySelector('[data-private-subject]')); await clear();
});
test("tickets captured synchronously in one event reject a preceding selection", async () => {
    await render(h(Host)); let first, second;
    await act(async () => { api.selectProfile(profile); first = api.captureRequest(); api.selectPosition({ id: "p", source: "link" }); second = api.captureRequest(); });
    assert.equal(api.isRequestCurrent(first), false); assert.equal(api.isRequestCurrent(second), true);
    assert.equal(Object.isFrozen(second), true); assert.deepEqual(Object.keys(second), ["generation"]); assert.equal(JSON.stringify(second).includes("p"), false);
    await act(async () => assert.equal(api.handleAccessError(403, first), false)); assert.equal(api.selection.kind, "position");
    await act(async () => assert.equal(api.handleAccessError(404, second), true)); assert.equal(api.selection, null); await clear();
});
test("same subject reopens, version changes and card to LIVE changes invalidate previous tickets", async () => {
    await render(h(Host)); const select = async value => act(async () => api.selectPosition(value));
    await select({ id: "p", source: "card", version: 2 }); let ticket = api.captureRequest();
    await select({ id: "p", source: "card", version: 3 }); assert.equal(api.handleAccessError(403, ticket), false);
    ticket = api.captureRequest(); await select({ id: "p", source: "link" }); assert.equal(api.handleAccessError(404, ticket), false);
    ticket = api.captureRequest(); await act(async () => api.close()); await select({ id: "p", source: "link" }); assert.equal(api.handleAccessError(403, ticket), false);
    ticket = api.captureRequest(); await select({ id: "p", source: "link" }); assert.equal(api.handleAccessError(403, ticket), false); assert.equal(api.open, true); await clear();
});
test("tickets are scoped to a hook instance and callbacks cannot update an unmounted host", async () => {
    const instances = {}; function Two({ name }) { instances[name] = usePrismDetailSelection({ kind: "profile", candidate: profile }); return null; }
    await render(h("div", null, h(Two, { name: "one" }), h(Two, { name: "two" })));
    const ticket = instances.one.captureRequest(); assert.equal(instances.two.isRequestCurrent(ticket), false); assert.equal(instances.two.handleAccessError(403, ticket), false);
    const old = instances.one; await clear(); assert.equal(old.captureRequest(), null); assert.equal(old.isRequestCurrent(ticket), false); assert.equal(old.handleAccessError(403), false); old.selectProfile(profile);
    await render(h(Host)); assert.equal(api.open, false); await clear();
});
test("invalid position versions do not replace or mutate a valid selection", async () => {
    await render(h(Host, { initial: { kind: "profile", candidate: profile } })); const ticket = api.captureRequest();
    assert.throws(() => api.selectPosition({ id: "p", source: "card", version: 0 }), /version/); assert.equal(api.isRequestCurrent(ticket), true);
    const reference = Object.freeze({ id: "p", source: "card", version: 2 }); await act(async () => api.selectPosition(reference));
    assert.deepEqual(api.selection.reference, reference); assert.notEqual(api.selection.reference, reference); await clear();
});
const sidebarProps = { collapsed: false, onCollapsedChange() {}, onNewChat() {}, expandedIds: ["admin"] };
test("administrator capability omits the menu or supplies the source's five actions", async () => {
    assert.equal(createPrismAdminMenu(false), null); const menu = createPrismAdminMenu(true);
    assert.equal(menu.label, "Admin"); assert.deepEqual(menu.children.map(item => item.label), ["사용자 관리", "회사 그룹 관리", "포지션 블럭 관리", "포지션 관리", "공지사항 관리"]);
    const calls = []; await render(h(PrismSidebar, { ...sidebarProps, items: [menu], activeId: "/chat/admin/users/one", onNavigate: id => calls.push(id) }));
    const users = [...document.querySelectorAll('.prism-nav-child')].find(button => button.textContent === "사용자 관리"); assert.equal(users.getAttribute('aria-current'), 'page');
    await act(async () => users.click()); assert.deepEqual(calls, ["/chat/admin/users"]);
    await render(h(PrismSidebar, { ...sidebarProps, items: [], activeId: "/chat/admin/users/one", onNavigate() {} })); assert.equal(document.querySelector('[aria-label="Admin"]'), null); await clear();
});
test("descendant route matching is opt-in and cannot match a similarly named path", async () => {
    const menu = createPrismAdminMenu(true, "/custom/admin/"); Object.freeze(menu.children); const before = JSON.stringify(menu.children);
    const items = [menu, { id: "/legacy", label: "legacy" }];
    await render(h(PrismSidebar, { ...sidebarProps, items, activeId: "/custom/admin/users-extra", onNavigate() {} })); assert.equal(document.querySelector('[aria-current="page"]'), null);
    await render(h(PrismSidebar, { ...sidebarProps, items, activeId: "/legacy/child", onNavigate() {} })); assert.equal(document.querySelector('[aria-current="page"]'), null);
    await render(h(PrismSidebar, { ...sidebarProps, items, activeId: "/custom/admin/users/one", onNavigate() {} })); assert.equal(document.querySelector('[aria-current="page"]').textContent, "사용자 관리"); assert.equal(JSON.stringify(menu.children), before); await clear();
});
const source = await readFile(new URL('../../../apps/docs/src/prism/detail-state-demo.tsx', import.meta.url), 'utf8');
const compiled = await transform(source, { loader: 'tsx', jsx: 'automatic', format: 'esm' });
const portable = compiled.code.replace(/\bfrom\s+["']([^"']+)["']/g, (_match, specifier) => {
    assert.ok(['react', 'react/jsx-runtime', '@pydemia/prism'].includes(specifier)); return 'from ' + JSON.stringify(import.meta.resolve(specifier));
});
const { DetailSelectionExample } = await import('data:text/javascript;base64,' + Buffer.from(portable).toString('base64'));
const button = label => [...document.querySelectorAll('button')].find(node => node.textContent === label);
const click = node => act(async () => node.click());
test("the portable workspace example ignores stale errors and removes actual profile/position panel DOM", async () => {
    await render(h(DetailSelectionExample));
    const admin = document.querySelector('[aria-label="Admin"]'); assert.equal(admin.getAttribute('aria-expanded'), 'true');
    await click(admin); assert.equal(admin.getAttribute('aria-expanded'), 'false');
    await click(admin); assert.equal(admin.getAttribute('aria-expanded'), 'true');
    await click(button("현재 요청 보관")); await click(button("포지션 과거 버전 2"));
    await click(button("보관한 요청의 늦은 403")); assert.match(document.querySelector('.prism-panel').textContent, /과거 버전 2/);
    await click(button("상세 API 500")); assert.ok(document.querySelector('.prism-panel'));
    await click(button("상세 API 403")); assert.equal(document.querySelector('.prism-panel'), null);
    assert.match(document.body.textContent, /선택된 상세 없음/); await click(button("포지션 현재 운영본")); assert.match(document.querySelector('.prism-panel').textContent, /현재 운영본/);
    await click(button("상세 API 404")); assert.equal(document.querySelector('.prism-panel'), null);
    await click(document.querySelector('input[type="checkbox"]')); assert.equal(document.querySelector('[aria-label="Admin"]'), null); await clear();
});
test("published detail-selection example keeps a previous request from closing the switched panel", async () => {
    const manifest = JSON.parse(await readFile(new URL("../../../apps/docs/public/prism/components.json", import.meta.url), "utf8"));
    const usage = manifest.components.find(item => item.id === "prism-detail-state")?.usage;
    assert.ok(usage);
    const published = (await transform(usage, { loader: "tsx", jsx: "automatic", format: "esm" })).code
        .replace(/\bfrom\s+["']([^"']+)["']/g, (_match, specifier) => {
            assert.ok(["react", "react/jsx-runtime", "@pydemia/prism"].includes(specifier));
            return "from " + JSON.stringify(import.meta.resolve(specifier));
        });
    const { DetailSelectionExample: PublishedExample } = await import("data:text/javascript;base64," + Buffer.from(published).toString("base64"));
    await render(h(PublishedExample));
    await click(button("현재 요청 보관"));
    await click(button("포지션 과거 버전 2"));
    await click(button("보관한 요청의 늦은 403"));
    assert.match(document.body.textContent, /합성 403: 현재 상세 유지/);
    assert.match(document.querySelector(".prism-panel").textContent, /과거 버전 2/);
    await click(button("상세 API 403"));
    assert.equal(document.querySelector(".prism-panel"), null);
    await clear();
});
