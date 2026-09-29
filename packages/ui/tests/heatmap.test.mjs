import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Heatmap } from "../dist/index.js";

const columns = ["09시", "10시", "11시"];
const rows = [
    { id: "mon", label: "월", values: [0, null, 4] },
    { id: "tue", label: "화", values: [2, 3, 8] },
];

function renderHeatmap(props = {}) {
    return renderToStaticMarkup(createElement(Heatmap, {
        title: "요일별 요청", columns, rows, unit: "건", ...props,
    }));
}

test("native table keeps both headers, zero and missing values", () => {
    const markup = renderHeatmap();
    assert.match(markup, /<caption[^>]*>요일별 요청<\/caption>/);
    assert.match(markup, /<th scope="col"[^>]*>09시<\/th>/);
    assert.match(markup, /<th scope="row"[^>]*>월<\/th>/);
    assert.match(markup, /data-value="0"[^>]*>0건<\/td>/);
    assert.match(markup, /data-missing="true"[^>]*>—<\/td>/);
    assert.match(markup, /tabindex="0"/);
    assert.match(markup, /8건/);
});

test("empty rows and all missing cells remain different states", () => {
    const empty = renderHeatmap({ rows: [] });
    assert.match(empty, /role="status"/);
    assert.doesNotMatch(empty, /<table/);

    const missing = renderHeatmap({
        rows: [{ id: "mon", label: "월", values: [null, null, null] }],
    });
    assert.match(missing, /<table/);
    assert.match(missing, /값 없음/);
    assert.doesNotMatch(missing, /role="status"/);
});

test("rejects malformed axes, values and explicit ranges", () => {
    assert.throws(() => renderHeatmap({ columns: ["A", "A"] }),
        /unique, nonempty labels/);
    assert.throws(() => renderHeatmap({ rows: [
        { id: "mon", label: "월", values: [1] },
    ] }), /one value per column/);
    assert.throws(() => renderHeatmap({ rows: [
        { id: "mon", label: "월", values: [1, 2, Infinity] },
    ] }), /finite numbers or null/);
    assert.throws(() => renderHeatmap({ minValue: 0 }),
        /minValue below maxValue/);
    assert.throws(() => renderHeatmap({ minValue: 0, maxValue: 7 }),
        /outside the range/);
});

test("large finite extremes keep intensity finite", () => {
    const markup = renderHeatmap({
        columns: ["Low", "High"],
        rows: [{ id: "limits", label: "Limits",
            values: [-Number.MAX_VALUE, Number.MAX_VALUE] }],
    });
    assert.doesNotMatch(markup, /NaN|Infinity/);
    assert.match(markup, /52%/);
});
