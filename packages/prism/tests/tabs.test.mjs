import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "http://localhost/", pretendToBeVisual: true });
for (const key of ["window", "document", "HTMLElement", "HTMLButtonElement", "Element", "Node", "Event", "MouseEvent", "KeyboardEvent", "MutationObserver", "DocumentFragment", "CustomEvent", "NodeFilter"]) globalThis[key] = dom.window[key];
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
globalThis.getComputedStyle = dom.window.getComputedStyle;
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const { createElement: h, useState, act } = await import("react");
const { createRoot } = await import("react-dom/client");
const { PrismTabs, PrismTabsList, PrismTabsTrigger, PrismClosableTabTrigger, PrismTabsContent } = await import("../dist/index.js");
const root = createRoot(document.getElementById("root"));

test("closing an active detail tab preserves the host-selected neighbor and keyboard focus", async () => {
    const closed = [];
    function Demo() {
        const [open, setOpen] = useState(["first", "second"]);
        const [active, setActive] = useState("second");
        const close = value => {
            closed.push(value);
            setOpen(current => current.filter(item => item !== value));
            if (active === value) setActive("first");
        };
        return h(PrismTabs, { value: active, onValueChange: setActive },
            h(PrismTabsList, { variant: "fill", "aria-label": "열린 후보자" },
                h(PrismTabsTrigger, { value: "list" }, "목록"),
                ...open.map(item => h(PrismClosableTabTrigger, { key: item, value: item, label: item, onClose: close }))),
            h(PrismTabsContent, { value: "list" }, "목록 내용"),
            ...open.map(item => h(PrismTabsContent, { key: item, value: item }, `${item} 내용`)));
    }
    await act(async () => root.render(h(Demo)));
    assert.equal(document.querySelectorAll("button button").length, 0);
    assert.equal(document.querySelector('[role="tab"][data-state="active"]').textContent, "second");
    const close = document.querySelector('button[aria-label="second 닫기"]');
    await act(async () => close.click());
    await act(async () => new Promise(resolve => setTimeout(resolve, 25)));
    assert.deepEqual(closed, ["second"]);
    assert.equal(document.querySelector('button[aria-label="second 닫기"]'), null);
    assert.equal(document.querySelector('[role="tab"][data-state="active"]').textContent, "first");
    assert.equal(document.activeElement.textContent, "first");
    assert.equal(document.querySelector('[role="tabpanel"][data-state="active"]').textContent, "first 내용");
    await act(async () => root.render(null));
});

test("disabled detail tabs cannot be selected or closed", async () => {
    let closes = 0;
    await act(async () => root.render(h(PrismTabs, { defaultValue: "list" },
        h(PrismTabsList, { variant: "fill", "aria-label": "상세" },
            h(PrismTabsTrigger, { value: "list" }, "목록"),
            h(PrismClosableTabTrigger, { value: "locked", label: "잠김", disabled: true, onClose: () => closes++ })),
        h(PrismTabsContent, { value: "list" }, "목록 내용"),
        h(PrismTabsContent, { value: "locked" }, "잠김 내용"))));
    const close = document.querySelector('button[aria-label="잠김 닫기"]');
    assert.equal(close.disabled, true);
    assert.equal(document.querySelector('[role="tab"][data-state="inactive"]').disabled, true);
    await act(async () => close.click());
    assert.equal(closes, 0);
    assert.equal(document.querySelector('[role="tab"][data-state="active"]').textContent, "목록");
    await act(async () => root.render(null));
});
