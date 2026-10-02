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
const { LogConsole, LogViewer } = await import("../dist/index.js");
const { createRoot } = await import("react-dom/client");

const entries = [
    { id: "start", level: "info", timestamp: "10:42", message: "Started" },
    { id: "cache", level: "warn", timestamp: "10:43", message: "Cache miss" },
    { id: "retry", level: "error", timestamp: "10:44", message: "Retry" },
];

test("viewer exposes named filters, count, and separate empty states", () => {
    const markup = renderToStaticMarkup(createElement(LogViewer, {
        label: "Build log", entries,
    }));
    const view = new JSDOM(markup).window.document;
    const group = view.querySelector('[role="group"]');
    const search = view.querySelector('input[type="search"]');
    const level = view.querySelector("select");
    const log = view.querySelector('[role="log"]');

    assert.equal(group.getAttribute("aria-labelledby"),
        view.querySelector("span.text-sm.font-medium").id);
    assert.equal(view.querySelector(`label[for="${search.id}"]`).textContent,
        "로그 검색");
    assert.equal(view.querySelector(`label[for="${level.id}"]`).textContent,
        "수준");
    assert.equal(search.getAttribute("aria-controls"), log.id);
    assert.equal(level.getAttribute("aria-controls"), log.id);
    assert.equal(log.getAttribute("aria-live"), "off");
    assert.match(view.querySelector('[role="status"]').textContent, /3 \/ 3건/);
    assert.match(log.textContent, /Started.*Cache miss.*Retry/s);

    const empty = renderToStaticMarkup(createElement(LogViewer, {
        label: "Build log", entries: [], emptyMessage: "No records",
    }));
    assert.match(empty, /No records/);
    assert.throws(() => renderToStaticMarkup(createElement(LogViewer, {
        label: " ", entries,
    })), /requires a label/);
    assert.throws(() => renderToStaticMarkup(createElement(LogViewer, {
        label: "Build log", entries, variant: "unknown",
    })), { name: "RangeError" });
    assert.throws(() => renderToStaticMarkup(createElement(LogViewer, {
        label: "Build log", entries: [entries[0], entries[0]],
    })), /unique IDs/);
    assert.match(renderToStaticMarkup(createElement(LogConsole, {
        label: "Raw log", entries, variant: "flat",
    })), /data-variant="flat"/);
});

test("search and level filters update visible rows without changing input", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    async function searchFor(value) {
        const input = container.querySelector('input[type="search"]');
        const setter = Object.getOwnPropertyDescriptor(
            dom.window.HTMLInputElement.prototype, "value",
        ).set;
        await act(async () => {
            setter.call(input, value);
            input.dispatchEvent(new dom.window.Event("input", {
                bubbles: true,
            }));
        });
    }

    async function selectLevel(value) {
        const select = container.querySelector("select");
        await act(async () => {
            select.value = value;
            select.dispatchEvent(new dom.window.Event("change", {
                bubbles: true,
            }));
        });
    }

    try {
        await act(async () => root.render(createElement(LogViewer, {
            label: "Build log", entries,
        })));
        await searchFor("retry");
        assert.match(container.querySelector('[role="log"]').textContent,
            /Retry/);
        assert.doesNotMatch(container.querySelector('[role="log"]').textContent,
            /Started|Cache miss/);
        assert.match(container.querySelector('[role="status"]').textContent,
            /1 \/ 3건/);

        await selectLevel("warn");
        assert.match(container.querySelector('[role="log"]').textContent,
            /일치하는 로그가 없습니다/);
        assert.match(container.querySelector('[role="status"]').textContent,
            /0 \/ 3건/);

        await searchFor("");
        assert.match(container.querySelector('[role="log"]').textContent,
            /Cache miss/);
        assert.doesNotMatch(container.querySelector('[role="log"]').textContent,
            /Started|Retry/);
    } finally {
        await act(async () => root.unmount());
        container.remove();
    }
});
