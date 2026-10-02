import assert from "node:assert/strict";
import test from "node:test";
import { act, createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/",
});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const frames = [];
window.requestAnimationFrame = (callback) => frames.push(callback);
window.cancelAnimationFrame = () => {};

const { AnchorNav } = await import("../dist/index.js");
const { createRoot } = await import("react-dom/client");
const items = [
    { id: "intro", label: "소개" },
    { id: "metrics", label: "지표", depth: 2 },
    { id: "method", label: "방법" },
];

test("named native links expose the two designs and section hierarchy", () => {
    const rail = renderToStaticMarkup(createElement(AnchorNav, {
        label: "보고서 목차", items,
    }));
    const inline = renderToStaticMarkup(createElement(AnchorNav, {
        label: "보고서 목차", items, variant: "inline",
    }));

    assert.match(rail, /<nav aria-label="보고서 목차" data-variant="rail"/);
    assert.match(rail, /href="#metrics"/);
    assert.match(rail, /pl-6/);
    assert.match(inline, /data-variant="inline"/);
    assert.match(inline, /overflow-x-auto/);
});

test("invalid section identities and navigation settings fail explicitly", () => {
    const props = { label: "목차", items };
    assert.throws(() => renderToStaticMarkup(createElement(AnchorNav, {
        ...props, label: " ",
    })), /label/);
    assert.throws(() => renderToStaticMarkup(createElement(AnchorNav, {
        ...props, items: [items[0], items[0]],
    })), /unique IDs/);
    assert.throws(() => renderToStaticMarkup(createElement(AnchorNav, {
        ...props, items: [{ id: "bad id", label: "항목" }],
    })), /unique IDs/);
    assert.throws(() => renderToStaticMarkup(createElement(AnchorNav, {
        ...props, offset: -1,
    })), /offset/);
});

test("scroll position changes the current link once per section", async () => {
    const scrollRoot = document.createElement("div");
    scrollRoot.id = "report-scroll";
    document.body.append(scrollRoot);
    scrollRoot.getBoundingClientRect = () => ({ top: 100 });
    Object.defineProperties(scrollRoot, {
        scrollHeight: { value: 600 },
        clientHeight: { value: 200 },
    });
    items.forEach((item, index) => {
        const section = document.createElement("section");
        section.id = item.id;
        section.getBoundingClientRect = () => ({
            top: 110 + index * 180 - scrollRoot.scrollTop,
        });
        scrollRoot.append(section);
    });
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    const changes = [];

    async function flush() {
        await act(async () => {
            while (frames.length) frames.shift()();
        });
    }

    try {
        await act(async () => root.render(createElement(AnchorNav, {
            label: "보고서 목차", items, scrollRootId: "report-scroll",
            offset: 16, onCurrentIdChange: (id) => changes.push(id),
        })));
        await flush();
        assert.equal(container.querySelector('[aria-current="location"]')
            .getAttribute("href"), "#intro");

        scrollRoot.scrollTop = 200;
        await act(async () => scrollRoot.dispatchEvent(new window.Event(
            "scroll",
        )));
        await flush();
        assert.equal(container.querySelector('[aria-current="location"]')
            .getAttribute("href"), "#metrics");
        await act(async () => container.querySelector('a[href="#metrics"]')
            .click());
        assert.deepEqual(changes, ["intro", "metrics"]);

        scrollRoot.scrollTop = 400;
        await act(async () => scrollRoot.dispatchEvent(new window.Event(
            "scroll",
        )));
        await flush();
        assert.equal(container.querySelector('[aria-current="location"]')
            .getAttribute("href"), "#method");
        assert.deepEqual(changes, ["intro", "metrics", "method"]);
    } finally {
        await act(async () => root.unmount());
        scrollRoot.remove();
        container.remove();
    }
});

test.after(() => dom.window.close());
