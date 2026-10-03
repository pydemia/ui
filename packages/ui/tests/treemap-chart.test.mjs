import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { TreemapChart } from "../dist/index.js";

const nodes = [
    { id: "operations", label: "운영", children: [
        { id: "search", label: "검색", value: 30 },
        { id: "reports", label: "보고서", value: 20 },
    ] },
    { id: "product", label: "제품", children: [
        { id: "editor", label: "편집기", value: 50 },
        { id: "unused", label: "미사용", value: 0 },
    ] },
];

function renderChart(props = {}) {
    return renderToStaticMarkup(createElement(TreemapChart, {
        title: "서비스별 사용량", nodes, unit: "건", ...props,
    }));
}

test("preserves hierarchy, exact values and total shares", () => {
    const markup = renderChart();
    assert.match(markup, /전체 100건/);
    assert.match(markup, /<table/);
    assert.match(markup, /<th scope="row"[^>]*>운영<\/th>/);
    assert.match(markup, /<th scope="row"[^>]*>운영 › 검색<\/th>/);
    assert.match(markup, /<th scope="row"[^>]*>제품 › 미사용<\/th>/);
    assert.match(markup, /<td[^>]*>30건<\/td><td[^>]*>30%<\/td>/);
    assert.match(markup, /<td[^>]*>0건<\/td><td[^>]*>0%<\/td>/);
    assert.match(markup, /aria-hidden="true"/);
    assert.doesNotMatch(markup, /title="제품 › 미사용/);
});

test("allocates nested rectangles in input order with proportional area", () => {
    const markup = renderChart({ nodes: [
        { id: "a", label: "A", value: 25 },
        { id: "b", label: "B", value: 25 },
        { id: "c", label: "C", value: 50 },
    ] });
    assert.match(markup, /title="A: 25건"[^>]*left:0%;top:0%;width:50%;height:50%/);
    assert.match(markup, /title="B: 25건"[^>]*left:0%;top:50%;width:50%;height:50%/);
    assert.match(markup, /title="C: 50건"[^>]*left:50%;top:0%;width:50%;height:100%/);
});

test("distinguishes empty input from zero-valued hierarchy", () => {
    const empty = renderChart({ nodes: [] });
    assert.match(empty, /표시할 항목이 없습니다/);
    assert.doesNotMatch(empty, /<table/);

    const zero = renderChart({ nodes: [
        { id: "a", label: "A", value: 0 },
    ], appearance: "plain" });
    assert.match(zero, /모든 항목의 값이 0입니다/);
    assert.match(zero, /<td[^>]*>0건<\/td>/);
    assert.doesNotMatch(zero, /rounded-sm border border-border bg-surface/);
});

test("rejects malformed values, duplicate siblings and cycles", () => {
    assert.throws(() => renderChart({ title: " " }), /requires a title/);
    assert.throws(() => renderChart({ nodes: undefined }), /must be an array/);
    assert.throws(() => renderChart({ nodes: [
        { id: "a", label: "A", value: -1 },
    ] }), /finite and non-negative/);
    assert.throws(() => renderChart({ nodes: [
        { id: "a", label: "A", value: Infinity },
    ] }), /finite and non-negative/);
    assert.throws(() => renderChart({ nodes: [
        { id: "a", label: "A", value: 1 },
        { id: "a", label: "B", value: 1 },
    ] }), /unique sibling IDs/);
    assert.throws(() => renderChart({ nodes: [
        { id: "a", label: "A", value: 1, children: [] },
    ] }), /no value/);
    assert.throws(() => renderChart({ nodes: [
        { id: "a", label: "A", value: Number.MAX_VALUE },
        { id: "b", label: "B", value: Number.MAX_VALUE },
    ] }), /total must be finite/);
    const cycle = { id: "cycle", label: "순환", children: [] };
    cycle.children.push(cycle);
    assert.throws(() => renderChart({ nodes: [cycle] }), /contain a cycle/);
});

test("rejects empty formatted values and unsupported appearance", () => {
    assert.throws(() => renderChart({
        formatValue: () => " ",
    }), /formatted values must be text/);
    assert.throws(() => renderChart({
        appearance: "unknown",
    }), /appearance is not supported/);
});
