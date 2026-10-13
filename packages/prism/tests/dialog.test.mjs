import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "http://localhost/", pretendToBeVisual: true });
for (const key of ["window", "document", "HTMLElement", "HTMLButtonElement", "HTMLInputElement", "HTMLFormElement", "Element", "Node", "Event", "MouseEvent", "KeyboardEvent", "MutationObserver", "DocumentFragment", "CustomEvent", "NodeFilter"]) globalThis[key] = dom.window[key];
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
globalThis.getComputedStyle = dom.window.getComputedStyle;
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createElement: h, act } = await import("react");
const { createRoot } = await import("react-dom/client");
const { PrismConfirmDialog } = await import("../dist/index.js");
const root = createRoot(document.getElementById("root"));
const render = props => act(async () => root.render(h(PrismConfirmDialog, { open: true, onOpenChange() {}, onConfirm() {}, ...props })));

test("confirm defaults to the source content height and names a titleless dialog", async () => {
    await render({ content: "완료를 확인해 주세요." });
    const dialog = document.querySelector('[role="dialog"]');
    assert.equal(dialog.querySelector(".prism-dialog-body").style.minHeight, "123px");
    assert.equal(dialog.getAttribute("aria-labelledby"), dialog.querySelector(".prism-sr-only").id);
    assert.equal(dialog.querySelector(".prism-sr-only").textContent, "확인");
    assert.equal(dialog.querySelectorAll("button button").length, 0);
    await act(async () => root.render(null));
});

test("confirm accepts CSS-length body override and locks dismissal while busy", async () => {
    let confirms = 0, cancels = 0;
    await render({ title: "삭제 확인", content: "처리 중", contentMinHeight: "50px", busy: true, showCancel: false, error: "처리 중에는 닫을 수 없습니다.", onConfirm: () => confirms++, onCancel: () => cancels++ });
    const dialog = document.querySelector('[role="dialog"]');
    assert.equal(dialog.querySelector(".prism-dialog-body").style.minHeight, "50px");
    assert.equal(dialog.querySelector('button[aria-label="닫기"]').disabled, true);
    assert.equal(dialog.querySelectorAll("footer button").length, 1);
    assert.equal(dialog.querySelector("footer button").disabled, true);
    assert.match(dialog.querySelector('[role="alert"]').textContent, /닫을 수 없습니다/);
    await act(async () => dialog.querySelector("footer button").click());
    assert.equal(confirms, 0); assert.equal(cancels, 0);
    await act(async () => root.render(null));
});
