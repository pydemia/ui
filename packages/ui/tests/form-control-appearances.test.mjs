import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
    NativeSelect, Select, SelectTrigger, SelectValue, Textarea,
} from "../dist/index.js";

const appearances = ["outline", "filled", "underline"];

function renderTextarea(appearance) {
    return renderToStaticMarkup(createElement(Textarea, {
        name: "notes",
        defaultValue: "다음 작업",
        required: true,
        "aria-invalid": true,
        ...(appearance ? { appearance } : {}),
    }));
}

function renderNativeSelect(appearance) {
    return renderToStaticMarkup(createElement(
        NativeSelect,
        {
            name: "density",
            defaultValue: "compact",
            required: true,
            "aria-invalid": true,
            ...(appearance ? { appearance } : {}),
        },
        createElement("option", { value: "standard" }, "기본"),
        createElement("option", { value: "compact" }, "좁게"),
    ));
}

function renderSelectTrigger(appearance) {
    return renderToStaticMarkup(createElement(
        Select,
        { name: "role", defaultValue: "editor" },
        createElement(
            SelectTrigger,
            {
                "aria-label": "담당 역할",
                "aria-invalid": true,
                ...(appearance ? { appearance } : {}),
            },
            createElement(SelectValue, { placeholder: "역할 선택" }),
        ),
    ));
}

test("textarea appearances preserve native input and error state", () => {
    for (const appearance of appearances) {
        const markup = renderTextarea(appearance);
        assert.match(markup, new RegExp(`data-appearance="${appearance}"`));
        assert.match(markup, /name="notes"/);
        assert.match(markup, /required=""/);
        assert.match(markup, /aria-invalid="true"/);
        assert.match(markup, />다음 작업<\/textarea>/);
    }
});

test("native select appearances preserve selected value and error state", () => {
    for (const appearance of appearances) {
        const markup = renderNativeSelect(appearance);
        assert.match(markup, new RegExp(`data-appearance="${appearance}"`));
        assert.match(markup, /name="density"/);
        assert.match(markup, /required=""/);
        assert.match(markup, /aria-invalid="true"/);
        assert.match(markup, /value="compact" selected=""/);
    }
});

test("select trigger appearances preserve combobox semantics", () => {
    for (const appearance of appearances) {
        const markup = renderSelectTrigger(appearance);
        assert.match(markup, new RegExp(`data-appearance="${appearance}"`));
        assert.match(markup, /role="combobox"/);
        assert.match(markup, /aria-label="담당 역할"/);
        assert.match(markup, /aria-invalid="true"/);
        assert.match(markup, /name="role"/);
    }
});

test("form controls keep outline defaults and distinct token surfaces", () => {
    for (const render of [
        renderTextarea, renderNativeSelect, renderSelectTrigger,
    ]) {
        assert.match(render(), /data-appearance="outline"/);
        assert.match(render("outline"), /border-border bg-surface/);
        assert.match(render("filled"), /bg-surface-subtle/);
        assert.match(render("underline"), /border-x-0 border-t-0/);
        assert.throws(() => render("raised"), RangeError);
    }
});
