import assert from "node:assert/strict";
import test from "node:test";
import { act, createElement as h, createRef } from "react";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/", pretendToBeVisual: true,
});
for (const name of [
    "window", "document", "HTMLElement", "HTMLButtonElement", "Element",
    "Node", "MutationObserver", "CustomEvent", "Event",
]) globalThis[name] = dom.window[name];
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
test.after(() => dom.window.close());
const { createRoot } = await import("react-dom/client");
const { Accordion, AccordionItem, AccordionTrigger, AccordionContent } =
    await import("../dist/index.js");

for (const type of ["single", "multiple"]) {
    test(`accordion ${type} keeps its root ref and native disclosure contract`, async () => {
        const container = document.createElement("div");
        document.body.append(container);
        const root = createRoot(container);
        const ref = createRef();
        const values = [];
        await act(async () => root.render(h(Accordion, {
            ref, type, defaultValue: type === "single" ? "one" : ["one"],
            ...(type === "single" ? { collapsible: true } : {}),
            onValueChange: (value) => values.push(value),
        }, ...["one", "two"].map((value) => h(AccordionItem, {
            key: value, value,
        }, h(AccordionTrigger, null, value),
        h(AccordionContent, null, `${value} content`))))));
        try {
            assert.equal(ref.current, container.firstElementChild);
            assert.ok(ref.current instanceof HTMLElement);
            const [first, second] = container.querySelectorAll("button");
            assert.equal(first.getAttribute("aria-expanded"), "true");
            assert.equal(second.getAttribute("aria-expanded"), "false");
            await act(async () => second.click());
            assert.equal(second.getAttribute("aria-expanded"), "true");
            assert.equal(first.getAttribute("aria-expanded"),
                type === "single" ? "false" : "true");
            assert.deepEqual(values.at(-1),
                type === "single" ? "two" : ["one", "two"]);
        } finally {
            await act(async () => root.unmount());
            container.remove();
        }
        assert.equal(ref.current, null);
    });
}
