import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { SankeyChart } from "../dist/index.js";

const stages = ["유입", "방문", "결과"];
const nodes = [
    { id: "direct", label: "직접 방문", stage: 0 },
    { id: "home", label: "홈", stage: 1 },
    { id: "product", label: "제품 페이지", stage: 1 },
    { id: "signup", label: "가입", stage: 2 },
];
const links = [
    { id: "direct-home", source: "direct", target: "home", value: 40 },
    { id: "direct-product", source: "direct", target: "product", value: 20 },
    { id: "home-signup", source: "home", target: "signup", value: 25 },
    { id: "product-signup", source: "product", target: "signup", value: 15 },
];

function renderChart(props = {}) {
    return renderToStaticMarkup(createElement(SankeyChart, {
        title: "가입 경로", stages, nodes, links, unit: "명", ...props,
    }));
}

test("renders multi-stage ribbons and exact native flow table", () => {
    const markup = renderChart();
    assert.match(markup, /data-variant="ribbon"/);
    assert.match(markup, /data-link-id="direct-home"/);
    assert.match(markup, /data-node-id="signup"/);
    assert.match(markup, /<svg aria-hidden="true"/);
    assert.match(markup, /<table/);
    assert.match(markup, /<th scope="row"[^>]*>유입 · 직접 방문<\/th>/);
    assert.match(markup, /<td[^>]*>방문 · 홈<\/td>/);
    assert.match(markup, /<td[^>]*>40명<\/td>/);
    assert.match(markup, /aria-label="가입 경로 흐름 그림"/);
});

test("line design preserves proportional stroke widths", () => {
    const markup = renderChart({ variant: "line", appearance: "plain" });
    const first = markup.match(
        /data-link-id="direct-home"[^>]*stroke-width="([^"]+)"/,
    );
    const second = markup.match(
        /data-link-id="direct-product"[^>]*stroke-width="([^"]+)"/,
    );
    assert.ok(first && second);
    assert.equal(Number(first[1]) / Number(second[1]), 2);
    assert.match(markup, /data-appearance="plain"/);
    assert.doesNotMatch(markup, /rounded-sm border border-border bg-surface/);
});

test("finite extreme values retain finite link geometry", () => {
    for (const value of [1e-320, 1e308]) {
        const markup = renderChart({ variant: "line", links: [
            { ...links[0], value },
        ] });
        const width = markup.match(
            /data-link-id="direct-home"[^>]*stroke-width="([^"]+)"/,
        )?.[1];
        assert.ok(width && Number.isFinite(Number(width)) &&
            Number(width) > 0);
        assert.doesNotMatch(markup, /NaN|Infinity/);
    }
});

test("distinguishes missing, zero and empty flows", () => {
    const markup = renderChart({ links: [
        { ...links[0], value: null },
        { ...links[1], value: 0 },
    ] });
    assert.match(markup, /미수집 경로는 그림에서 생략했습니다/);
    assert.match(markup, /데이터 없음/);
    assert.match(markup, /<td[^>]*>0명<\/td>/);
    assert.doesNotMatch(markup, /data-link-id=/);

    const empty = renderChart({ nodes: [], links: [] });
    assert.match(empty, /표시할 경로가 없습니다/);
    assert.doesNotMatch(empty, /<table/);
});

test("rejects invalid stages, nodes, links, totals and formats", () => {
    assert.throws(() => renderChart({ stages: ["하나"] }),
        /two to six named stages/);
    assert.throws(() => renderChart({ nodes: [nodes[0], nodes[0]] }),
        /unique IDs, labels and valid stages/);
    assert.throws(() => renderChart({ nodes: [
        { ...nodes[0], stage: 3 }, ...nodes.slice(1),
    ] }), /unique IDs, labels and valid stages/);
    assert.throws(() => renderChart({ links: [
        { id: "skip", source: "direct", target: "signup", value: 3 },
    ] }), /adjacent stages/);
    assert.throws(() => renderChart({ links: [links[0], links[0]] }),
        /unique IDs and adjacent stages/);
    assert.throws(() => renderChart({ links: [
        { ...links[0], value: -1 },
    ] }), /finite, nonnegative or null/);
    assert.throws(() => renderChart({ links: [
        { ...links[0], value: Infinity },
    ] }), /finite, nonnegative or null/);
    assert.throws(() => renderChart({ links: [
        { ...links[0], value: 1e308 },
        { ...links[0], id: "other", value: 1e308 },
    ] }), /flow totals must be finite/);
    assert.throws(() => renderChart({ formatValue: () => " " }),
        /formatted values must be text/);
});
