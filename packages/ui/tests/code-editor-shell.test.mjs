import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CodeEditorShell } from "../dist/index.js";

function renderEditor(props = {}) {
    return renderToStaticMarkup(createElement(CodeEditorShell, {
        label: "쿼리",
        value: "SELECT id\nFROM requests;",
        onValueChange: () => {},
        name: "query",
        ...props,
    }));
}

test("editor keeps a named native form control and decorative line numbers", () => {
    const markup = renderEditor({ language: "SQL", required: true });
    const inputId = markup.match(/<textarea[^>]*\sid="([^"]+)"/)?.[1];
    assert.ok(inputId);
    assert.match(markup, new RegExp(`<label for="${inputId}"`));
    assert.match(markup, /<textarea[^>]*name="query"[^>]*required=""/);
    assert.match(markup, /<textarea[^>]*wrap="off"[^>]*dir="ltr"/);
    assert.match(markup, /aria-hidden="true"/);
    assert.match(markup, /<span[^>]*>1<\/span>.*<span[^>]*>2<\/span>/s);
    assert.match(markup, /SQL/);
});

test("error and description are linked to the control", () => {
    const markup = renderEditor({
        value: "",
        description: "한 줄에 한 명령을 적으세요.",
        error: "쿼리를 입력하세요.",
        variant: "flat",
    });
    assert.match(markup, /data-variant="flat"/);
    assert.match(markup, /<textarea[^>]*aria-describedby="[^"]+ [^"]+"/);
    assert.match(markup, /<textarea[^>]*aria-invalid="true"/);
    assert.match(markup, /role="alert"[^>]*>쿼리를 입력하세요/);
});

test("disabled, read-only and no-gutter states use native semantics", () => {
    const markup = renderEditor({
        disabled: true,
        readOnly: true,
        showLineNumbers: false,
    });
    assert.match(markup, /<textarea[^>]*disabled=""[^>]*readOnly=""/);
    assert.doesNotMatch(markup, /aria-hidden="true"/);
});

test("required input and supported variants reject invalid configuration", () => {
    assert.throws(() => renderEditor({ label: " " }), /requires a label/);
    assert.throws(() => renderEditor({ value: null }), /must be a string/);
    assert.throws(() => renderEditor({ onValueChange: null }),
        /requires onValueChange/);
    assert.throws(() => renderEditor({ rows: 0 }), /positive integer/);
    assert.throws(() => renderEditor({ variant: "floating" }),
        /variant is not supported/);
});
