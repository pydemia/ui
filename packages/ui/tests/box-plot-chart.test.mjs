import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BoxPlotChart } from "../dist/index.js";

const summaries = [
    { id: "a", label: "검색 API", min: -5, q1: 0,
        median: 5, q3: 10, max: 15 },
    { id: "b", label: "보고서", min: 0, q1: 5,
        median: 10, q3: 12, max: 15 },
];

function renderChart(props = {}) {
    return renderToStaticMarkup(createElement(BoxPlotChart, {
        title: "응답 시간 분포", summaries, unit: "ms", ...props,
    }));
}

test("shows five exact values per group beside decorative plots", () => {
    const markup = renderChart();
    assert.match(markup, /<figcaption[^>]*>/);
    assert.match(markup, /<table/);
    assert.match(markup, /<th scope="col"[^>]*>1사분위<\/th>/);
    assert.match(markup, /<th scope="row"[^>]*>검색 API<\/th>/);
    assert.match(markup, /<td[^>]*>-5ms<\/td>/);
    assert.match(markup, /<td[^>]*>0ms<\/td>/);
    assert.match(markup, /<td[^>]*>15ms<\/td>/);
    assert.match(markup, /aria-hidden="true"/);
    assert.match(markup, /left:25\.0000%;width:50\.0000%/);
    assert.match(markup, /left:50\.0000%/);
});

test("keeps empty and identical distributions distinct", () => {
    const empty = renderChart({ summaries: [], emptyText: "아직 없음" });
    assert.match(empty, /아직 없음/);
    assert.doesNotMatch(empty, /<table/);

    const equal = renderChart({
        appearance: "plain",
        summaries: [{ id: "same", label: "고정", min: 0, q1: 0,
            median: 0, q3: 0, max: 0 }],
    });
    assert.match(equal, /left:50\.0000%/);
    assert.match(equal, /<td[^>]*>0ms<\/td>/);
    assert.doesNotMatch(equal, /border-border bg-surface/);
});

test("rejects ambiguous summaries and an overflowing range", () => {
    assert.throws(() => renderChart({ title: " " }), /requires a title/);
    assert.throws(() => renderChart({ summaries: undefined }),
        /must be an array/);
    assert.throws(() => renderChart({ summaries: [
        summaries[0], summaries[0],
    ] }), /id is duplicated/);
    assert.throws(() => renderChart({ summaries: [
        { ...summaries[0], q1: 6 },
    ] }), /finite and ordered/);
    assert.throws(() => renderChart({ summaries: [
        { ...summaries[0], max: Infinity },
    ] }), /finite and ordered/);
    assert.throws(() => renderChart({ summaries: [
        { ...summaries[0], min: -1e308, max: 1e308 },
    ] }), /range is not finite/);
    assert.throws(() => renderChart({ appearance: "card" }),
        /appearance is not supported/);
});

test("rejects blank formatted values before appending a unit", () => {
    assert.throws(() => renderChart({
        formatValue: (value) => value === 5 ? " " : String(value),
    }), /formatted values must be text/);
});
