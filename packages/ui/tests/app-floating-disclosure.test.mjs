import assert from "node:assert/strict";
import test from "node:test";
import { act, createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { AppFloatingDisclosure } from "../dist/index.js";

test("floating disclosure names its button and controlled region", () => {
    const html = renderToStaticMarkup(createElement(
        AppFloatingDisclosure, { label: "작업 도움말" },
        createElement("p", null, "작업 설명"),
    ));
    const page = new JSDOM(html).window.document;
    const trigger = page.querySelector("button");
    const panel = page.querySelector("section");
    assert.equal(trigger.getAttribute("aria-label"), "작업 도움말");
    assert.equal(trigger.getAttribute("aria-expanded"), "false");
    assert.equal(trigger.getAttribute("aria-controls"), panel.id);
    assert.equal(panel.getAttribute("aria-label"), "작업 도움말");
    assert.equal(panel.hidden, true);
    assert.throws(() => renderToStaticMarkup(createElement(
        AppFloatingDisclosure, { label: " " }, "내용",
    )), /button labels/);
});

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/",
});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
Object.defineProperty(globalThis, "navigator", {
    configurable: true, value: dom.window.navigator,
});
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createRoot } = await import("react-dom/client");

function renderDisclosure() {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    return { container, root };
}

test("close action and Escape restore focus to the bubble", async () => {
    const { container, root } = renderDisclosure();
    try {
        await act(async () => root.render(createElement(
            AppFloatingDisclosure, { label: "작업 도움말" },
            createElement("a", { href: "#details" }, "설명 읽기"),
        )));
        const bubble = container.querySelector("button");
        const panel = container.querySelector("section");
        const close = panel.querySelector("button");

        await act(async () => bubble.click());
        assert.equal(bubble.getAttribute("aria-expanded"), "true");
        assert.equal(panel.hidden, false);
        await act(async () => close.click());
        assert.equal(panel.hidden, true);
        assert.equal(document.activeElement, bubble);

        await act(async () => bubble.click());
        const link = panel.querySelector("a");
        await act(async () => link.focus());
        await act(async () => link.dispatchEvent(new window.KeyboardEvent(
            "keydown", { key: "Escape", bubbles: true, cancelable: true },
        )));
        assert.equal(panel.hidden, true);
        assert.equal(document.activeElement, bubble);
    } finally {
        await act(async () => root.unmount());
        container.remove();
    }
});

test("outside focus and pointer dismiss without stealing focus", async () => {
    const { container, root } = renderDisclosure();
    const outside = document.createElement("button");
    document.body.append(outside);
    try {
        await act(async () => root.render(createElement(
            AppFloatingDisclosure, { label: "작업 도움말" }, "설명",
        )));
        const bubble = container.querySelector("button");
        const panel = container.querySelector("section");
        await act(async () => bubble.click());
        await act(async () => outside.focus());
        assert.equal(panel.hidden, true);
        assert.equal(document.activeElement, outside);
        await act(async () => bubble.click());
        await act(async () => outside.dispatchEvent(new window.Event(
            "pointerdown", { bubbles: true },
        )));
        assert.equal(panel.hidden, true);
        assert.equal(document.activeElement, outside);
    } finally {
        await act(async () => root.unmount());
        container.remove();
        outside.remove();
    }
});

test.after(() => dom.window.close());
