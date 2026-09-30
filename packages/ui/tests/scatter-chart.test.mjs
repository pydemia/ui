import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ScatterChart } from "../dist/index.js";

const points = [
    { id: "zero", label: "기준", x: 0, y: 0 },
    { id: "high", label: "최대", x: 12, y: 30 },
    { id: "missing", label: "집계 전", x: null, y: 8 },
];

function renderChart(props = {}) {
    return renderToStaticMarkup(createElement(ScatterChart, {
        title: "처리량과 지연", xLabel: "처리량", yLabel: "지연",
        xUnit: "건", yUnit: "ms", points, ...props,
    }));
}

test("continuous axes retain zero, exact values and missing coordinates", () => {
    const markup = renderChart();
    assert.match(markup, /<figcaption[^>]*>.*처리량과 지연/s);
    assert.match(markup, /<label[^>]*>데이터 확인<\/label>/);
    assert.match(markup, /<option value="zero" selected="">/);
    assert.match(markup, /data-point-id="zero"/);
    assert.match(markup, /data-point-id="high"/);
    assert.doesNotMatch(markup, /data-point-id="missing"/);
    assert.match(markup, /<th scope="col"[^>]*>처리량 \(건\)<\/th>/);
    assert.match(markup, /<th scope="row"[^>]*>집계 전<\/th>/);
    assert.match(markup, /데이터 없음/);
    assert.match(markup, /<details/);
});

test("empty and incomplete data stay distinct", () => {
    const empty = renderChart({ points: [] });
    assert.match(empty, /표시할 데이터가 없습니다/);
    assert.doesNotMatch(empty, /<select|<table/);

    const incomplete = renderChart({ points: [points[2]] });
    assert.match(incomplete, /두 좌표가 모두 있는 데이터가 없습니다/);
    assert.match(incomplete, /<table/);
    assert.doesNotMatch(incomplete, /<select/);
});

test("controlled selection requires a callback and a plotted point", () => {
    assert.throws(() => renderChart({ selectedId: "high" }),
        /needs onPointSelect/);
    assert.throws(() => renderChart({ selectedId: "missing",
        onPointSelect() {} }), /must name a plotted point/);
    const markup = renderChart({ selectedId: "high",
        onPointSelect() {} });
    assert.match(markup, /<option value="high" selected="">/);
    assert.match(markup, /aria-label="최대 값"/);
});

test("invalid points and domains fail before rendering a chart", () => {
    assert.throws(() => renderChart({ points: [points[0], points[0]] }),
        /unique IDs/);
    assert.throws(() => renderChart({ points: [
        { id: "bad", label: "무한", x: Infinity, y: 2 },
    ] }), /finite numbers or null/);
    assert.throws(() => renderChart({ xDomain: [2, 2] }),
        /increasing finite values/);
    assert.throws(() => renderChart({ yDomain: [1, 20] }),
        /points must fit the yDomain/);
});

test("finite extremes keep plot coordinates finite", () => {
    const markup = renderChart({ points: [
        { id: "low", label: "하한", x: -Number.MAX_VALUE,
            y: -Number.MAX_VALUE },
        { id: "high", label: "상한", x: Number.MAX_VALUE,
            y: Number.MAX_VALUE },
    ] });
    assert.match(markup, /data-point-id="low"/);
    assert.match(markup, /data-point-id="high"/);
    assert.doesNotMatch(markup, /(?:cx|cy|x1|x2|y1|y2)="(?:NaN|Infinity)/);
});
