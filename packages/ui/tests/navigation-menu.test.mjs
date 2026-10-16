import assert from "node:assert/strict";
import test from "node:test";
import { act, createElement as h } from "react";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/", pretendToBeVisual: true,
});
for (const key of ["window", "document", "HTMLElement", "Element", "Node",
    "NodeFilter", "MutationObserver", "Event", "CustomEvent", "HTMLInputElement"])
    globalThis[key] = dom.window[key];
globalThis.getComputedStyle = dom.window.getComputedStyle;
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createRoot } = await import("react-dom/client");
const {
    NavigationMenu, NavigationMenuList, NavigationMenuItem,
    NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink,
} = await import("../dist/index.js");

test("root refs preserve cleanup and remain stable across content renders", async () => {
    const host = document.createElement("div");
    document.body.append(host);
    const root = createRoot(host);
    let attached = 0;
    let cleaned = 0;
    const ref = (node) => {
        assert.ok(node instanceof HTMLElement);
        attached++;
        return () => cleaned++;
    };
    try {
        await act(async () => root.render(h(NavigationMenu,
            { "aria-label": "Products", ref }, "First")));
        await act(async () => root.render(h(NavigationMenu,
            { "aria-label": "Products", ref }, "Updated")));
        assert.equal(attached, 1);
        assert.equal(cleaned, 0);
    } finally {
        await act(async () => root.unmount());
        host.remove();
    }
    assert.equal(cleaned, 1);
});

test("default open content stays in its enclosing modal accessibility boundary", async () => {
    const host = document.createElement("div");
    document.body.append(host);
    const root = createRoot(host);
    try {
        await act(async () => root.render(h("div", { role: "dialog" },
            h(NavigationMenu, { "aria-label": "Products", defaultValue: "products" },
                h(NavigationMenuList, null,
                    h(NavigationMenuItem, { value: "products" },
                        h(NavigationMenuTrigger, null, "Products"),
                        h(NavigationMenuContent, null,
                            h(NavigationMenuLink, { href: "#details" }, "Details"))))))));
        const link = document.querySelector('a[href="#details"]');
        assert.ok(link);
        assert.equal(link.closest('[role="dialog"]'), host.firstElementChild);
    } finally {
        await act(async () => root.unmount());
        host.remove();
    }
});
