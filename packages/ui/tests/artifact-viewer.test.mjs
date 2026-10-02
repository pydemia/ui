import assert from "node:assert/strict";
import test from "node:test";
import { act, createElement, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { ArtifactViewer } from "../dist/index.js";

const revisions = [
    { id: "first", label: "초안", content: "# 운영 안내\n\n초안" },
    {
        id: "second", label: "수정안",
        content: "# 운영 안내\n\n<b>확정</b>",
    },
];

test("markdown revision renders text without interpreting raw HTML", () => {
    const html = renderToStaticMarkup(createElement(ArtifactViewer, {
        label: "운영 안내", kind: "markdown", revisions,
        revisionId: "second", onRevisionChange: () => {},
    }));
    const page = new JSDOM(html).window.document;
    assert.equal(page.querySelector("section")?.getAttribute("aria-label"),
        null);
    assert.equal(page.querySelector("h3")?.textContent, "운영 안내");
    assert.equal(page.querySelector("h2")?.textContent, "운영 안내");
    assert.match(page.querySelector('[role="region"]')?.textContent ?? "",
        /<b>확정<\/b>/);
    assert.equal(page.querySelector("b"), null);
    assert.equal(page.querySelector('select[aria-label="운영 안내 revision"]')
        ?.value, "second");
});

test("empty revisions and invalid selected revisions stay distinct", () => {
    const empty = renderToStaticMarkup(createElement(ArtifactViewer, {
        label: "결과물", kind: "code", revisions: [],
        revisionId: null, onRevisionChange: () => {},
    }));
    assert.match(empty, /아직 결과물이 없습니다/);
    assert.throws(() => renderToStaticMarkup(createElement(
        ArtifactViewer, {
            label: "결과물", kind: "code", revisions,
            revisionId: "missing", onRevisionChange: () => {},
        },
    )), /revisionId must match/);
    assert.throws(() => renderToStaticMarkup(createElement(
        ArtifactViewer, {
            label: "결과물", kind: "code",
            revisions: [...revisions, revisions[0]],
            revisionId: "first", onRevisionChange: () => {},
        },
    )), /unique IDs/);
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

test("revision selection and comparison use the adjacent prior revision", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    let closed = false;

    function Example() {
        const [revisionId, setRevisionId] = useState("first");
        return createElement(ArtifactViewer, {
            label: "운영 안내", kind: "markdown", revisions,
            revisionId, onRevisionChange: setRevisionId,
            onClose: () => { closed = true; },
        });
    }

    try {
        await act(async () => root.render(createElement(Example)));
        assert.equal(container.querySelector(
            'button[aria-label="변경 비교"]'), null);

        const select = container.querySelector("select");
        await act(async () => {
            select.value = "second";
            select.dispatchEvent(new dom.window.Event("change", {
                bubbles: true,
            }));
        });
        assert.equal(select.value, "second");
        await act(async () => container.querySelector(
            'button[aria-pressed="false"]:last-child').click());
        assert.equal(container.querySelector("section")?.dataset.view, "diff");
        assert.match(container.textContent, /초안/);
        assert.match(container.textContent, /수정안/);
        assert.match(container.textContent, /<b>확정<\/b>/);

        await act(async () => container.querySelector(
            'button[aria-label="운영 안내 닫기"]').click());
        assert.equal(closed, true);
    } finally {
        await act(async () => root.unmount());
        container.remove();
    }
});
