import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { YearPicker } from "../dist/index.js";

function renderPicker(props = {}) {
    return renderToStaticMarkup(createElement(YearPicker, {
        value: null,
        onValueChange() {},
        name: "reportYear",
        "aria-label": "보고 연도",
        ...props,
    }));
}

test("year value is a controlled native form value", () => {
    const markup = renderPicker({ value: "2026" });
    assert.match(markup, /name="reportYear" value="2026"/);
    assert.match(markup, /aria-label="보고 연도"/);
    assert.match(markup, />2026<\/span>/);
    assert.match(renderPicker(), /name="reportYear" value=""/);
    assert.match(renderPicker({ disabled: true }),
        /type="hidden" disabled="" name="reportYear" value=""/);
});

test("invalid years and reversed or violated bounds fail visibly", () => {
    for (const value of ["0000", "26", "20260", "202A", "-001"])
        assert.throws(() => renderPicker({ value }), /YYYY/);
    assert.throws(() => renderPicker({ min: "2027", max: "2026" }),
        /min exceeds max/);
    assert.throws(() => renderPicker({ value: "2025", min: "2026" }),
        /outside min\/max/);
    assert.throws(() => renderPicker({ max: "20-6" }), /YYYY/);
});
