import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "http://localhost/", pretendToBeVisual: true });
for (const key of ["window", "document", "HTMLElement", "Element", "Node", "Event", "MouseEvent", "MutationObserver"]) globalThis[key] = dom.window[key];
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const { createElement: h, act } = await import("react");
const { createRoot } = await import("react-dom/client");
const { PrismAccessGate, PrismBlankLayout, PrismErrorContent, PrismServiceContact } = await import("../dist/index.js");
const root = createRoot(document.getElementById("root"));

test("access gate only renders approved content when ready and gives denied users a default message", async () => {
    const content = h("p", { id: "protected" }, "보호된 내용");
    await act(async () => root.render(h(PrismAccessGate, { status: "loading" }, content)));
    assert.match(document.querySelector('[role="status"]').textContent, /확인하는 중/);
    assert.equal(document.querySelector("#protected"), null);

    await act(async () => root.render(h(PrismAccessGate, { status: "denied" }, content)));
    assert.match(document.querySelector('[role="alert"]').textContent, /접근 권한/);
    assert.equal(document.querySelector("#protected"), null);

    await act(async () => root.render(h(PrismAccessGate, { status: "ready" }, content)));
    assert.equal(document.querySelector("#protected").textContent, "보호된 내용");
    assert.equal(document.querySelector('[role="alert"]'), null);
});

test("host fallback action and service contact remain usable", async () => {
    let retries = 0;
    await act(async () => root.render(h(PrismBlankLayout, null,
        h(PrismAccessGate, { status: "denied", fallback: h(PrismErrorContent, { code: "403", message: "접근 권한이 없습니다.", buttonLabel: "다시 확인", onAction: () => retries++ }) }, h("p", null, "비공개")),
        h(PrismServiceContact, { email: "support@example.com", className: "host-contact" }))));
    assert.equal(document.querySelector('[aria-label="오류 403"] .prism-error-code').textContent, "403");
    assert.equal(document.body.textContent.includes("비공개"), false);
    await act(async () => document.querySelector("button").click());
    assert.equal(retries, 1);
    const contact = document.querySelector(".host-contact a");
    assert.equal(contact.textContent, "support@example.com");
    assert.equal(contact.getAttribute("href"), "mailto:support@example.com");
    await act(async () => root.render(null));
});
