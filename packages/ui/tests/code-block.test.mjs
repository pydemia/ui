import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CodeBlock } from "../dist/index.js";

function renderBlock(props = {}) {
    return renderToStaticMarkup(createElement(CodeBlock, {
        label: "설정 예시",
        code: "const enabled = true;",
        language: "TypeScript",
        ...props,
    }));
}

test("named code preserves text and offers keyboard scrolling and copy", () => {
    const markup = renderBlock({ code: "<script>\n  & done" });
    assert.match(markup, /<figure[^>]*aria-labelledby=/);
    assert.match(markup, /<figcaption[^>]*>.*설정 예시/s);
    assert.match(markup, /<pre[^>]*tabindex="0"/);
    assert.match(markup, /&lt;script&gt;\n  &amp; done/);
    assert.match(markup, /aria-label="설정 예시 복사"/);
    assert.match(markup, /TypeScript/);
});

test("wrap and non-copyable states remain explicit", () => {
    const markup = renderBlock({ wrap: true, copyable: false });
    assert.match(markup, /whitespace-pre-wrap/);
    assert.doesNotMatch(markup, /설정 예시 복사/);
    const emptyMarkup = renderBlock({ code: "" });
    assert.match(emptyMarkup,
        /<button[^>]*disabled=""[^>]*aria-label="설정 예시 복사"/);
});

test("missing label, non-string code and empty language fail", () => {
    assert.throws(() => renderBlock({ label: " " }), /requires a label/);
    assert.throws(() => renderBlock({ code: null }), /must be a string/);
    assert.throws(() => renderBlock({ language: " " }),
        /language must not be empty/);
});
