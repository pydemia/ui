import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { WaterfallChart } from "../dist/index.js";

const changes = [
    { id: "expansion", label: "신규 계약", value: 30 },
    { id: "discount", label: "할인", value: -12 },
    { id: "steady", label: "기타", value: 0 },
];

function renderChart(props = {}) {
    return renderToStaticMarkup(createElement(WaterfallChart, {
        title: "매출 변화", startValue: 100, changes, unit: "건",
        ...props,
    }));
}

test("shows starting, floating changes and final totals as a table", () => {
    const markup = renderChart();
    assert.match(markup, /<figure[^>]*data-variant="panel"/);
    assert.match(markup, /<figcaption/);
    assert.match(markup, /<svg[^>]*viewBox=/);
    assert.match(markup, /aria-hidden="true"/);
    assert.match(markup, /<caption[^>]*>매출 변화 상세 값<\/caption>/);
    assert.match(markup, /<th scope="row"[^>]*>신규 계약<\/th>/);
    assert.match(markup, /\+30건/);
    assert.match(markup, /130건/);
    assert.match(markup, /-12건/);
    assert.match(markup, /118건/);
    assert.match(markup, /0건/);
    assert.match(markup, /fill="var\(--success\)"/);
    assert.match(markup, /fill="var\(--danger\)"/);
});

test("negative running totals and empty changes remain distinct", () => {
    const negative = renderChart({
        startValue: 20,
        changes: [{ id: "loss", label: "손실", value: -40 }],
        variant: "plain",
    });
    assert.match(negative, /-40건/);
    assert.match(negative, /-20건/);
    assert.match(negative, /<figure[^>]*data-variant="plain"/);
    const empty = renderChart({ changes: [], emptyText: "변화 없음" });
    assert.match(empty, /변화 없음/);
    assert.doesNotMatch(empty, /<svg/);
    assert.doesNotMatch(empty, /<table/);
});

test("invalid or incomplete contributions cannot imply a false total", () => {
    assert.throws(() => renderChart({ title: " " }), /requires a title/);
    assert.throws(() => renderChart({ startValue: Infinity }),
        /startValue must be finite/);
    assert.throws(() => renderChart({ changes: null }),
        /must be an array/);
    assert.throws(() => renderChart({ changes: [
        changes[0], { ...changes[0], label: "중복" },
    ] }), /duplicated/);
    assert.throws(() => renderChart({ changes: [
        { id: "missing", label: "미수집", value: null },
    ] }), /finite value/);
    assert.throws(() => renderChart({ changes: [
        { id: "bad", label: "무한", value: Infinity },
    ] }), /finite value/);
    assert.throws(() => renderChart({
        startValue: 1e308,
        changes: [{ id: "overflow", label: "증가", value: 1e308 }],
    }), /overflowed/);
    assert.throws(() => renderChart({ variant: "card" }),
        /variant is not supported/);
    assert.throws(() => renderChart({ formatValue: () => " " }),
        /formatted values must be text/);
});
