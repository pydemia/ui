import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { FunnelChart } from "../dist/index.js";

const stages = [
    { id: "visit", label: "방문", value: 120 },
    { id: "signup", label: "가입", value: 96 },
    { id: "confirm", label: "인증", value: 0 },
];

function renderChart(props = {}) {
    return renderToStaticMarkup(createElement(FunnelChart, {
        title: "가입 흐름", stages, unit: "명", ...props,
    }));
}

test("ordered stage values and conversion rates remain visible", () => {
    const markup = renderChart();
    assert.match(markup, /<figure/);
    assert.match(markup, /<figcaption/);
    assert.match(markup, /<ol/);
    assert.match(markup, /aria-hidden="true">1\. <\/span>방문/);
    assert.match(markup, /120명/);
    assert.match(markup, /80%/);
    assert.match(markup, /0명/);
    assert.match(markup, /width:0%/);
    assert.match(markup, /aria-hidden="true"/);
});

test("missing, zero baseline, empty and plain states stay distinct", () => {
    const missing = renderChart({ variant: "plain", stages: [
        stages[0], { id: "pending", label: "검증", value: null },
        stages[2],
    ] });
    assert.match(missing, /값 없음/);
    assert.match(missing, /비율 없음/);
    assert.doesNotMatch(missing, /border-border/);
    const zero = renderChart({ stages: [
        { id: "start", label: "시작", value: 0 },
        { id: "end", label: "완료", value: 0 },
    ] });
    assert.match(zero, /0명/);
    assert.match(zero, /비율 없음/);
    const empty = renderChart({ stages: [], emptyText: "아직 없음" });
    assert.match(empty, /아직 없음/);
    assert.doesNotMatch(empty, /<ol/);
});

test("invalid sequence and IDs cannot imply a false conversion", () => {
    assert.throws(() => renderChart({ stages: [
        stages[0], { id: "later", label: "나중", value: 121 },
    ] }), /must not increase/);
    assert.throws(() => renderChart({ stages: [
        stages[0], { id: "missing", label: "미수집", value: null },
        { id: "later", label: "나중", value: 121 },
    ] }), /must not increase/);
    assert.throws(() => renderChart({ stages: [
        stages[0], { ...stages[0], label: "중복" },
    ] }), /duplicated/);
    assert.throws(() => renderChart({ stages: [
        { id: "bad", label: "오류", value: -1 },
    ] }), /nonnegative value/);
    assert.throws(() => renderChart({ stages: [
        { id: "bad", label: "오류", value: Infinity },
    ] }), /nonnegative value/);
    assert.throws(() => renderChart({ stages: null }), /must be an array/);
});
