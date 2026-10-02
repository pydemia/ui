import assert from "node:assert/strict";
import test from "node:test";
import { act, createElement, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { BlockDocument, BlockEditor } from "../dist/index.js";

const initial = [
    { id: "title", kind: "heading", text: "작업 안내" },
    { id: "body", kind: "paragraph", text: "검토할 내용" },
];

test("stored blocks render as semantic text without interpreting HTML", () => {
    const html = renderToStaticMarkup(createElement(BlockDocument, {
        label: "저장된 문서",
        blocks: [
            ...initial,
            { id: "a", kind: "bullet", text: "첫 항목" },
            { id: "b", kind: "bullet", text: "<img src=x>" },
            { id: "c", kind: "number", text: "순서 있는 항목" },
            { id: "d", kind: "quote", text: "검토 인용" },
            { id: "e", kind: "code", text: "const x = 1;" },
        ],
    }));
    const page = new JSDOM(html).window.document;
    assert.equal(page.querySelector("section")?.getAttribute("aria-label"),
        "저장된 문서");
    assert.equal(page.querySelector("h2")?.textContent, "작업 안내");
    assert.deepEqual([...page.querySelectorAll("ul > li")].map(
        (item) => item.textContent), ["첫 항목", "<img src=x>"]);
    assert.equal(page.querySelectorAll("ol > li").length, 1);
    assert.equal(page.querySelector("blockquote")?.textContent, "검토 인용");
    assert.equal(page.querySelector("pre code")?.textContent,
        "const x = 1;");
    assert.equal(page.querySelector("img"), null);
});

test("invalid document data is rejected", () => {
    assert.throws(() => renderToStaticMarkup(createElement(BlockEditor, {
        label: "문서", blocks: [...initial, initial[0]],
        onBlocksChange: () => {},
    })), /unique IDs/);
    assert.throws(() => renderToStaticMarkup(createElement(BlockDocument, {
        label: "문서", blocks: [{ id: "x", kind: "html", text: "" }],
    })), /kinds/);
    assert.throws(() => renderToStaticMarkup(createElement(BlockEditor, {
        label: " ", blocks: [], onBlocksChange: () => {},
    })), /requires a label/);
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

test("insertion, ordering and deletion update the controlled form value", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    function Example() {
        const [blocks, setBlocks] = useState(initial);
        return createElement(BlockEditor, {
            label: "문서", name: "content", blocks,
            onBlocksChange: setBlocks,
        });
    }

    try {
        await act(async () => root.render(createElement(Example)));
        assert.deepEqual(JSON.parse(container.querySelector(
            'input[name="content"]').value), initial);

        await act(async () => container.querySelector(
            'button[aria-label="1번 블록 다음에 추가"]').click());
        let ids = [...container.querySelectorAll("[data-block-id]")].map(
            (block) => block.getAttribute("data-block-id"));
        assert.deepEqual(ids, ["title", "block-3", "body"]);
        assert.equal(document.activeElement,
            container.querySelector('[data-block-id="block-3"] textarea'));

        await act(async () => container.querySelector(
            'button[aria-label="2번 블록 아래로 이동"]').click());
        ids = [...container.querySelectorAll("[data-block-id]")].map(
            (block) => block.getAttribute("data-block-id"));
        assert.deepEqual(ids, ["title", "body", "block-3"]);

        await act(async () => container.querySelector(
            'button[aria-label="3번 블록 삭제"]').click());
        ids = [...container.querySelectorAll("[data-block-id]")].map(
            (block) => block.getAttribute("data-block-id"));
        assert.deepEqual(ids, ["title", "body"]);
        assert.equal(document.activeElement,
            container.querySelector('[data-block-id="body"] textarea'));
        assert.deepEqual(JSON.parse(container.querySelector(
            'input[name="content"]').value), initial);
    } finally {
        await act(async () => root.unmount());
        container.remove();
    }
});

test("disabled editor does not submit or expose active controls", () => {
    const html = renderToStaticMarkup(createElement(BlockEditor, {
        label: "문서", name: "content", blocks: initial,
        onBlocksChange: () => {}, disabled: true,
    }));
    const page = new JSDOM(html).window.document;
    assert.equal(page.querySelector('input[name="content"]')?.disabled, true);
    assert([...page.querySelectorAll("button, select, textarea")].every(
        (control) => control.disabled));
});
