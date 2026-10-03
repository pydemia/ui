import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { RadarChart } from "../dist/index.js";

const axes = [
    { id: "speed", label: "속도" },
    { id: "quality", label: "품질" },
    { id: "scope", label: "범위" },
    { id: "support", label: "지원" },
];
const series = [
    { id: "current", label: "현재", values: [0, 3, 4, 2] },
    { id: "target", label: "목표", values: [4, 4, 5, 5] },
];

function renderChart(props = {}) {
    return renderToStaticMarkup(createElement(RadarChart, {
        title: "제품 평가", axes, series, max: 5, unit: "점",
        ...props,
    }));
}

test("renders exact values and distinct line and filled designs", () => {
    const filled = renderChart({ variant: "filled" });
    assert.match(filled, /data-variant="filled"/);
    assert.match(filled, /data-series-id="current"><polygon/);
    assert.match(filled, /<td[^>]*>0점<\/td>/);
    assert.match(filled, /<th scope="row"[^>]*>속도<\/th>/);
    assert.match(filled, /<table/);
    assert.match(filled, /aria-hidden="true"/);
    assert.match(filled, /color-mix\(in srgb, var\(--accent\) 18%, transparent\)/);

    const line = renderChart({ appearance: "plain" });
    assert.match(line, /data-appearance="plain"/);
    assert.match(line, /data-variant="line"/);
    assert.doesNotMatch(line, /rounded-sm border border-border bg-surface/);
});

test("does not bridge or fill missing values", () => {
    const markup = renderChart({ series: [{
        id: "current", label: "현재", values: [0, null, 4, 2],
    }], variant: "filled" });
    const plot = markup.match(/data-series-id="current">(.*?)<\/g>/s)?.[1];
    assert.ok(plot);
    assert.doesNotMatch(plot, /<polygon/);
    assert.equal((plot.match(/<line/g) ?? []).length, 2);
    assert.match(markup, /<td[^>]*>데이터 없음<\/td>/);
    assert.match(markup, /<td[^>]*>0점<\/td>/);
});

test("distinguishes empty axes from missing measurements", () => {
    const empty = renderChart({ axes: [], series: [] });
    assert.match(empty, /표시할 차원이 없습니다/);
    assert.doesNotMatch(empty, /<table/);

    const missing = renderChart({ series: [{
        id: "current", label: "현재", values: [null, null, null, null],
    }] });
    assert.match(missing, /측정값이 없습니다/);
    assert.match(missing, /<table/);
    assert.doesNotMatch(missing, /data-series-id="current"><polygon/);
});

test("rejects invalid dimensions, values and formatting", () => {
    assert.throws(() => renderChart({ title: " " }), /requires a title/);
    assert.throws(() => renderChart({ axes: axes.slice(0, 2) }),
        /at least three axes/);
    assert.throws(() => renderChart({ axes: [axes[0], axes[0], axes[2]] }),
        /unique IDs and labels/);
    assert.throws(() => renderChart({ max: Infinity }),
        /finite and positive/);
    assert.throws(() => renderChart({ series: [
        { id: "short", label: "짧음", values: [1] },
    ] }), /match the axes/);
    assert.throws(() => renderChart({ series: [
        { id: "bad", label: "초과", values: [1, 2, 3, 6] },
    ] }), /in range, or null/);
    assert.throws(() => renderChart({ series: [
        { id: "bad", label: "무한", values: [1, Infinity, 3, 4] },
    ] }), /in range, or null/);
    assert.throws(() => renderChart({
        formatValue: () => " ",
    }), /formatted values must be text/);
});
