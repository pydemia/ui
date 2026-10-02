import assert from "node:assert/strict";
import test from "node:test";
import { act, createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";

const images = [
    { id: "mountain", src: "/mountain.svg", alt: "산과 태양",
        caption: "첫 번째 풍경" },
    { id: "coast", src: "/coast.svg", alt: "바다와 해안",
        caption: "두 번째 풍경" },
];

const props = {
    title: "풍경 사진", items: images, activeId: "mountain",
    open: true, onOpenChange: () => {}, onActiveIdChange: () => {},
};

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
const { Lightbox } = await import("../dist/index.js");
const { createRoot } = await import("react-dom/client");

test("invalid gallery identity and content fail before display", () => {
    assert.throws(() => renderToStaticMarkup(createElement(Lightbox,
        { ...props, title: " " })), /title/);
    assert.throws(() => renderToStaticMarkup(createElement(Lightbox,
        { ...props, items: [images[0], images[0]] })), /unique IDs/);
    assert.throws(() => renderToStaticMarkup(createElement(Lightbox,
        { ...props, items: [{ ...images[0], alt: " " }] })), /alt text/);
    assert.throws(() => renderToStaticMarkup(createElement(Lightbox,
        { ...props, items: [{ ...images[0], aspectRatio: -1 }] })),
        /valid metadata/);
    assert.throws(() => renderToStaticMarkup(createElement(Lightbox,
        { ...props, activeId: "missing" })), /selected image/);
    assert.doesNotThrow(() => renderToStaticMarkup(createElement(Lightbox,
        { ...props, items: [], activeId: null, open: false })));
});

test("modal navigation updates the selected image and leaves edges disabled",
    async () => {
        const container = document.createElement("div");
        document.body.append(container);
        const root = createRoot(container);
        const changes = [];
        const closeChanges = [];

        function render(activeId) {
            root.render(createElement(Lightbox, {
                ...props, activeId,
                onActiveIdChange: (id) => changes.push(id),
                onOpenChange: (open) => closeChanges.push(open),
            }));
        }

        try {
            await act(async () => render("mountain"));
            let dialog = document.querySelector('[role="dialog"]');
            assert.ok(dialog);
            assert.match(dialog.textContent, /1 \/ 2/);
            assert.ok(dialog.querySelector('img[alt="산과 태양"]'));
            assert.equal([...dialog.querySelectorAll("button")].find(
                (button) => button.textContent === "이전 이미지",
            ).disabled, true);

            await act(async () => [...dialog.querySelectorAll("button")].find(
                (button) => button.textContent === "다음 이미지",
            ).click());
            assert.deepEqual(changes, ["coast"]);
            await act(async () => render("coast"));
            dialog = document.querySelector('[role="dialog"]');
            assert.match(dialog.textContent, /2 \/ 2/);
            assert.ok(dialog.querySelector('img[alt="바다와 해안"]'));
            assert.equal([...dialog.querySelectorAll("button")].find(
                (button) => button.textContent === "다음 이미지",
            ).disabled, true);

            await act(async () => dialog.querySelector(
                'button[aria-label="산과 태양 보기"]',
            ).click());
            assert.deepEqual(changes, ["coast", "mountain"]);
            await act(async () => [...dialog.querySelectorAll("button")].find(
                (button) => button.textContent === "닫기",
            ).click());
            assert.deepEqual(closeChanges, [false]);
        } finally {
            await act(async () => root.unmount());
            container.remove();
        }
    });

test.after(() => dom.window.close());
