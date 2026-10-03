import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { HistogramChart } from "../dist/index.js";

const bins = [
    { start: 0, end: 10, count: 2 },
    { start: 10, end: 20, count: 4 },
    { start: 20, end: 30, count: 0 },
];

function renderChart(props = {}) {
    return renderToStaticMarkup(createElement(HistogramChart, {
        title: "응답 시간 분포", bins, unit: "ms", countUnit: "건",
        ...props,
    }));
}

test("renders equal-width bins, total and exact accessible counts", () => {
    const markup = renderChart();
    assert.match(markup, /총 6건/);
    assert.match(markup, /<table/);
    assert.match(markup, /<th scope="col"[^>]*>빈도<\/th>/);
    assert.match(markup, /<th scope="row"[^>]*>0ms 이상 10ms 미만<\/th>/);
    assert.match(markup, /<th scope="row"[^>]*>20ms 이상 30ms 이하<\/th>/);
    assert.match(markup, /<td[^>]*>0건<\/td>/);
    assert.match(markup, /height:50\.0000%/);
    assert.match(markup, /height:100\.0000%/);
    assert.match(markup, /aria-hidden="true"/);
});

test("distinguishes no bins from bins with zero counts", () => {
    const empty = renderChart({ bins: [], emptyText: "아직 집계 없음" });
    assert.match(empty, /아직 집계 없음/);
    assert.doesNotMatch(empty, /<table/);

    const zero = renderChart({ bins: bins.map((bin) => ({
        ...bin, count: 0,
    })), appearance: "plain" });
    assert.match(zero, /총 0건 · 모든 구간의 빈도 0/);
    assert.match(zero, /<table/);
    assert.doesNotMatch(zero, /rounded-sm border border-border bg-surface/);
});

test("rejects invalid intervals, counts and unsafe totals", () => {
    assert.throws(() => renderChart({ title: " " }), /requires a title/);
    assert.throws(() => renderChart({ bins: undefined }),
        /must be an array/);
    assert.throws(() => renderChart({ bins: [
        { start: 0, end: 0, count: 1 },
    ] }), /finite bounds/);
    assert.throws(() => renderChart({ bins: [
        { start: 0, end: 10, count: 1.5 },
    ] }), /non-negative integer/);
    assert.throws(() => renderChart({ bins: [
        bins[0], { start: 11, end: 21, count: 1 },
    ] }), /contiguous and equal width/);
    assert.throws(() => renderChart({ bins: [
        bins[0], { start: 10, end: 25, count: 1 },
    ] }), /contiguous and equal width/);
    assert.throws(() => renderChart({ bins: [
        { start: -1e308, end: 1e308, count: 1 },
    ] }), /width is not finite/);
    assert.throws(() => renderChart({ bins: [
        { start: 0, end: 10, count: Number.MAX_SAFE_INTEGER },
        { start: 10, end: 20, count: 1 },
    ] }), /total count is too large/);
});

test("accepts decimal boundaries and rejects empty formatting", () => {
    const markup = renderChart({ bins: [
        { start: 0.1, end: 0.2, count: 1 },
        { start: 0.2, end: 0.3, count: 2 },
    ] });
    assert.match(markup, /0\.1ms 이상 0\.2ms 미만/);
    assert.throws(() => renderChart({
        formatBoundary: (value) => value === 0 ? " " : String(value),
    }), /formatted boundaries must be text/);
});
