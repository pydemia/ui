import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MonthPicker } from "../dist/index.js";

function renderPicker(props = {}) {
    return renderToStaticMarkup(createElement(MonthPicker, {
        value: null,
        onValueChange() {},
        name: "reportMonth",
        "aria-label": "보고 월",
        ...props,
    }));
}

test("month value is a controlled form value", () => {
    const markup = renderPicker({ value: "2026-09" });
    assert.match(markup, /name="reportMonth" value="2026-09"/);
    assert.match(markup, /aria-label="보고 월"/);
    assert.match(markup, />2026-09<\/span>/);
    assert.match(renderPicker(), /name="reportMonth" value=""/);
    assert.match(renderPicker({ disabled: true }),
        /type="hidden" disabled="" name="reportMonth" value=""/);
});

test("invalid month values and reversed bounds fail visibly", () => {
    for (const value of ["2026-00", "2026-13", "0000-01", "26-01"])
        assert.throws(() => renderPicker({ value }), /YYYY-MM/);
    assert.throws(() => renderPicker({ min: "2026-09", max: "2026-08" }),
        /min exceeds max/);
    assert.throws(() => renderPicker({ value: "2026-07", min: "2026-08" }),
        /outside min\/max/);
});
