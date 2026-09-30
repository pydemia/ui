import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Editable } from "../dist/index.js";

test("editable preview has a named edit action and no form submit", () => {
    const markup = renderToStaticMarkup(createElement(Editable, {
        label: "Workspace name", value: "Operations", onSave: () => {},
    }));
    assert.match(markup, /role="group" aria-label="Workspace name"/);
    assert.match(markup, /aria-label="Workspace name 수정"/);
    assert.match(markup, /type="button"/);
    assert.match(markup, />Operations</);
});

test("editable rejects missing names and disables editing when requested", () => {
    assert.throws(() => renderToStaticMarkup(createElement(Editable, {
        label: " ", value: "Value", onSave: () => {},
    })), /requires a label/);
    const markup = renderToStaticMarkup(createElement(Editable, {
        label: "Workspace name", value: "", onSave: () => {},
        disabled: true, placeholder: "Untitled",
    }));
    assert.match(markup, /Untitled/);
    assert.match(markup, /disabled=""/);
});
