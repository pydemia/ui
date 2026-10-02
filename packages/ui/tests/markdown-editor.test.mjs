import assert from "node:assert/strict";
import test from "node:test";
import { act, createElement, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { MarkdownEditor } from "../dist/index.js";

function render(extra = {}) {
    return renderToStaticMarkup(createElement(MarkdownEditor, {
        label: "본문", value: "**검토**", name: "body",
        onValueChange: () => {}, ...extra,
    }));
}

test("native form control, preview and errors keep their semantics", () => {
    const markup = render({ required: true, error: "본문을 입력하세요." });
    const inputId = markup.match(/<textarea[^>]*\sid="([^"]+)"/)?.[1];
    assert.ok(inputId);
    assert.match(markup, new RegExp(`<label for="${inputId}"`));
    assert.match(markup, /<textarea[^>]*name="body"[^>]*required=""/);
    assert.match(markup, /<textarea[^>]*aria-invalid="true"/);
    assert.match(markup, /<strong[^>]*>검토<\/strong>/);
    assert.match(markup, /role="region"[^>]*aria-labelledby=/);
    assert.match(markup, /role="alert"[^>]*>본문을 입력하세요/);
});

test("invalid configuration and read-only input are distinct", () => {
    assert.throws(() => render({ label: " " }), /requires a label/);
    assert.throws(() => render({ value: null }), /must be a string/);
    assert.throws(() => render({ onValueChange: null }),
        /requires onValueChange/);
    assert.throws(() => render({ rows: 0 }), /positive integer/);
    assert.throws(() => render({ name: " " }), /name must not be empty/);
    const markup = render({ readOnly: true, defaultShowPreview: false });
    assert.match(markup, /<textarea[^>]*readOnly=""/);
    assert.match(markup, /hidden=""[^>]*role="region"/);
});

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/",
});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: dom.window.navigator,
});
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createRoot } = await import("react-dom/client");

test("preview toggle keeps the named input and its submitted value", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    function Preview() {
        const [value, setValue] = useState("**검토**");
        return createElement("form", null,
            createElement(MarkdownEditor, {
                label: "본문", name: "body", value,
                onValueChange: setValue,
            }));
    }
    try {
        await act(async () => root.render(createElement(Preview)));
        const input = container.querySelector("textarea");
        assert.equal(input.value, "**검토**");
        assert.equal(new dom.window.FormData(
            container.querySelector("form"),
        ).get("body"), "**검토**");
        assert.match(container.innerHTML, /<strong[^>]*>검토<\/strong>/);
        await act(async () => {
            container.querySelector('[aria-controls]').click();
        });
        assert.equal(input.isConnected, true);
        assert.equal(container.querySelector('[role="region"]').hidden,
            true);
    } finally {
        await act(async () => root.unmount());
        container.remove();
    }
});
