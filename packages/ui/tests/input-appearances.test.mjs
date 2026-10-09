import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Input } from "../dist/index.js";

function renderInput(appearance) {
    return renderToStaticMarkup(createElement(Input, {
        id: "request-id",
        name: "requestId",
        defaultValue: "REQ-2048",
        required: true,
        "aria-invalid": true,
        ...(appearance ? { appearance } : {}),
    }));
}

test("input appearances preserve the native field and error state", () => {
    for (const appearance of ["outline", "filled", "underline"]) {
        const markup = renderInput(appearance);
        assert.match(markup, new RegExp(`data-appearance="${appearance}"`));
        assert.match(markup, /name="requestId"/);
        assert.match(markup, /value="REQ-2048"/);
        assert.match(markup, /required=""/);
        assert.match(markup, /aria-invalid="true"/);
        assert.match(markup, /aria-invalid:border-danger/);
    }
});

test("default and alternate surfaces use distinct token styles", () => {
    assert.match(renderInput(), /data-appearance="outline"/);
    assert.match(renderInput("outline"), /border-border bg-surface/);
    assert.match(renderInput("filled"), /bg-surface-subtle/);
    assert.match(renderInput("underline"), /border-x-0 border-t-0/);
    assert.throws(() => renderInput("raised"), RangeError);
});
