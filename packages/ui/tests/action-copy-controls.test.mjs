import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ActionBar, CopyButton } from "../dist/index.js";

test("copy button keeps a named native action in icon and text forms", () => {
    const icon = renderToStaticMarkup(createElement(CopyButton, {
        value: "REQ-1", label: "요청 ID 복사",
    }));
    assert.match(icon, /role="status"/);
    assert.match(icon, /<button[^>]*aria-label="요청 ID 복사"/);
    assert.match(icon, /<svg[^>]*aria-hidden="true"/);

    const text = renderToStaticMarkup(createElement(CopyButton, {
        value: "REQ-1", label: "요청 ID 복사",
        appearance: "text", buttonText: "ID 복사",
    }));
    assert.match(text, /<button[^>]*>ID 복사<\/button>/);
});

test("copy button rejects missing names and non-text values", () => {
    assert.throws(() => renderToStaticMarkup(createElement(CopyButton, {
        value: "REQ-1", label: " ",
    })), /requires a label/);
    assert.throws(() => renderToStaticMarkup(createElement(CopyButton, {
        value: null, label: "복사",
    })), /must be a string/);
});

test("action bar names a selection group and keeps native actions", () => {
    const markup = renderToStaticMarkup(createElement(ActionBar, {
        "aria-label": "선택 작업", selectedCount: 2, onClear() {},
        placement: "floating",
    }, createElement("button", null, "보관")));
    assert.match(markup, /role="group"/);
    assert.match(markup, /aria-label="선택 작업"/);
    assert.match(markup, /2건 선택/);
    assert.match(markup, /role="status"/);
    assert.match(markup, /보관/);
    assert.match(markup, /선택 해제/);
    assert.match(markup, /sticky/);

    const empty = renderToStaticMarkup(createElement(ActionBar, {
        "aria-label": "선택 작업", selectedCount: 0, onClear() {},
    }));
    assert.match(empty, /<button[^>]*disabled=""/);
});

test("action bar rejects invalid counts and missing names", () => {
    assert.throws(() => renderToStaticMarkup(createElement(ActionBar, {
        "aria-label": "선택 작업", selectedCount: -1, onClear() {},
    })), /non-negative/);
    assert.throws(() => renderToStaticMarkup(createElement(ActionBar, {
        "aria-label": " ", selectedCount: 1, onClear() {},
    })), /accessible label/);
});
