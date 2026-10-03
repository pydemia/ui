import assert from "node:assert/strict";
import test from "node:test";
import { act, createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createRoot } from "react-dom/client";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/",
});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.HTMLInputElement = dom.window.HTMLInputElement;
globalThis.Element = dom.window.Element;
globalThis.Node = dom.window.Node;
globalThis.NodeFilter = dom.window.NodeFilter;
globalThis.MutationObserver = dom.window.MutationObserver;
globalThis.getComputedStyle = dom.window.getComputedStyle;
globalThis.Event = dom.window.Event;
globalThis.CustomEvent = dom.window.CustomEvent;
Object.defineProperty(globalThis, "navigator", {
    configurable: true, value: dom.window.navigator,
});
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const { Dialog, DialogContent, DialogTitle } =
    await import("../dist/index.js");

test("dialog sizes preserve a titled modal and the default", async () => {
    const host = document.createElement("div");
    document.body.append(host);
    const root = createRoot(host);

    try {
        for (const size of [undefined, "wide", "fullscreen"]) {
            await act(async () => root.render(createElement(Dialog, {
                open: true,
                children: createElement(DialogContent, {
                    size,
                    children: createElement(DialogTitle, null, "설정"),
                }),
            })));
            const modal = document.querySelector('[role="dialog"]');
            assert.ok(modal);
            assert.equal(modal.dataset.size, size ?? "default");
            assert.equal(document.getElementById(
                modal.getAttribute("aria-labelledby"),
            )?.textContent, "설정");
        }
    } finally {
        await act(async () => root.unmount());
        host.remove();
    }
});

test("dialog rejects an unsupported size", () => {
    assert.throws(() => renderToStaticMarkup(createElement(DialogContent, {
        size: "unknown",
    })), { name: "RangeError" });
});

test.after(() => dom.window.close());
