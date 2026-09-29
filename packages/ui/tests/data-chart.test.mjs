import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { DataChart } from "../dist/index.js";

const categories = ["A", "B"];
const series = [
    { id: "one", label: "One", values: [4, -3] },
    { id: "two", label: "Two", values: [6, -2] },
    { id: "missing", label: "Missing", values: [null, 1] },
];

function renderChart(props = {}) {
    return renderToStaticMarkup(createElement(DataChart, {
        title: "Signed totals",
        categories,
        series,
        variant: "stacked-bar",
        ...props,
    }));
}

function seriesRects(markup, id) {
    const group = markup.match(
        new RegExp(`<g data-series="${id}">([\\s\\S]*?)<\\/g>`),
    );
    assert.ok(group, `Missing series ${id}`);
    return [...group[1].matchAll(/<rect\s+([^>]+)>/g)].map((match) => {
        const attributes = Object.fromEntries(
            [...match[1].matchAll(/([\w-]+)="([^"]*)"/g)]
                .map((attribute) => [attribute[1], attribute[2]]),
        );
        return {
            category: attributes["data-category"],
            value: Number(attributes["data-value"]),
            x: Number(attributes.x),
            y: Number(attributes.y),
            width: Number(attributes.width),
            height: Number(attributes.height),
        };
    });
}

function nearlyEqual(first, second) {
    assert.ok(Math.abs(first - second) < 1e-8,
        `${first} differs from ${second}`);
}

test("signed values stack on separate sides of zero", () => {
    const markup = renderChart();
    const first = seriesRects(markup, "one");
    const second = seriesRects(markup, "two");
    const missing = seriesRects(markup, "missing");

    assert.deepEqual(first.map((bar) => bar.value), [4, -3]);
    assert.deepEqual(second.map((bar) => bar.value), [6, -2]);
    assert.deepEqual(missing.map((bar) => bar.category), ["B"]);
    nearlyEqual(first[0].x, second[0].x);
    nearlyEqual(first[0].width, second[0].width);
    nearlyEqual(first[0].y, second[0].y + second[0].height);
    nearlyEqual(first[1].y + first[1].height, second[1].y);
    assert.match(markup, />-5<\/text>/);
    assert.match(markup, />10<\/text>/);
    assert.match(markup, /데이터 없음/);
});

test("stacked totals reject overflow and invalid variants", () => {
    assert.throws(() => renderChart({
        categories: ["A"],
        series: [
            { id: "one", label: "One", values: [Number.MAX_VALUE] },
            { id: "two", label: "Two", values: [Number.MAX_VALUE] },
        ],
    }), { name: "RangeError",
        message: "DataChart stacked totals must be finite." });
    assert.throws(() => renderChart({ variant: "unknown" }), {
        name: "RangeError",
        message: "DataChart variant is not supported.",
    });
});

test("finite values at opposite numeric limits keep SVG coordinates", () => {
    for (const variant of ["line", "bar", "area", "stacked-bar"]) {
        const markup = renderChart({
            variant,
            points: [
                { label: "Low", value: -Number.MAX_VALUE },
                { label: "High", value: Number.MAX_VALUE },
            ],
            categories: undefined,
            series: undefined,
        });
        assert.match(markup, /<svg[^>]*>/);
        assert.doesNotMatch(markup, /NaN|Infinity/);
    }
});

test("constant numeric limits keep finite SVG coordinates", () => {
    for (const value of [Number.MAX_VALUE, -Number.MAX_VALUE]) {
        for (const count of [1, 2]) {
            const markup = renderChart({
                variant: "line",
                points: Array.from({ length: count }, (_, index) => ({
                    label: `Point ${index + 1}`, value,
                })),
                categories: undefined,
                series: undefined,
            });
            assert.match(markup, /<svg[^>]*>/);
            assert.doesNotMatch(markup, /NaN|Infinity/);
        }
    }
});

test("unnamed points have accessible category names", () => {
    const markup = renderChart({
        variant: "line",
        points: [{ label: "  ", value: 3 }],
        categories: undefined,
        series: undefined,
    });
    assert.match(markup, /<th scope="row">\s*구간 1\s*<\/th>/);
    assert.doesNotMatch(markup, /<th scope="row">\s*<\/th>/);
});

test("empty stacked data keeps the empty state", () => {
    const markup = renderChart({ categories: [], series: [] });
    assert.match(markup, /표시할 데이터가 없습니다/);
    assert.doesNotMatch(markup, /data-category=/);
});

test("selectable legend remains available when every value is missing", () => {
    const markup = renderChart({
        categories: ["A"],
        series: [{ id: "one", label: "One", values: [null] }],
        toggleableSeries: true,
    });
    assert.match(markup, /표시할 데이터가 없습니다/);
    assert.match(markup, /aria-label="계열 표시"/);
    assert.match(markup, /<input[^>]*type="checkbox"[^>]*checked=""/);
    assert.match(markup, /<th scope="col">One<\/th>/);
    assert.doesNotMatch(renderChart(), /type="checkbox"/);
});

test("optional inspector exposes exact and missing category values", () => {
    const markup = renderChart({ inspectable: true });
    const inspector = markup.match(/<dl[^>]*>([\s\S]*?)<\/dl>/)?.[1];
    assert.ok(inspector);
    assert.match(markup, /<select[^>]*>/);
    assert.match(markup, /data-category-index="0"/);
    assert.match(markup, /data-category-index="1"/);
    assert.match(markup, /aria-label="A 값"/);
    assert.match(inspector, /<dt[^>]*>One<\/dt><dd[^>]*>4<\/dd>/);
    assert.match(inspector, /<dt[^>]*>Missing<\/dt><dd[^>]*>데이터 없음<\/dd>/);

    assert.doesNotMatch(renderChart(), /<select[^>]*>/);
    assert.doesNotMatch(renderChart({
        categories: [], series: [], inspectable: true,
    }), /<select[^>]*>/);

    const missingOnly = renderChart({
        categories: ["A"],
        series: [{ id: "one", label: "One", values: [null] }],
        inspectable: true,
    });
    assert.match(missingOnly, /표시할 데이터가 없습니다/);
    assert.match(missingOnly, /<select[^>]*>/);
    assert.match(missingOnly, /<dt[^>]*>One<\/dt><dd[^>]*>데이터 없음<\/dd>/);
});

test("stacked area uses complete non-negative categories and totals", () => {
    const markup = renderChart({
        variant: "stacked-area",
        categories: ["A", "B", "C", "D"],
        series: [
            { id: "one", label: "One", values: [2, 3, null, 4] },
            { id: "two", label: "Two", values: [1, 2, 5, 6] },
        ],
        inspectable: true,
    });
    assert.equal((markup.match(/data-start-category="A"/g) ?? []).length, 2);
    assert.match(markup, /data-end-category="B"/);
    assert.doesNotMatch(markup, /data-start-category="C"/);
    assert.doesNotMatch(markup, /data-category="C"/);
    assert.match(markup, /data-category="D"/);
    assert.match(markup, /<dt[^>]*>합계<\/dt><dd[^>]*>3<\/dd>/);
    assert.match(markup, /<th scope="row">C<\/th>[\s\S]*?<td>데이터 없음<\/td>/);
    assert.match(markup, /<th scope="row">D<\/th>[\s\S]*?<td>10<\/td>/);
});

test("stacked area does not turn missing data into zero", () => {
    const markup = renderChart({
        variant: "stacked-area",
        categories: ["A", "B"],
        series: [
            { id: "one", label: "One", values: [2, null] },
            { id: "two", label: "Two", values: [null, 3] },
        ],
        inspectable: true,
    });
    assert.match(markup, /완전한 구간이 없습니다/);
    assert.match(markup, /<th scope="col">합계<\/th>/);
    assert.doesNotMatch(markup, /data-start-category=/);
});

test("stacked area rejects negative values and overflow", () => {
    assert.throws(() => renderChart({
        variant: "stacked-area",
    }), /non-negative/);
    assert.throws(() => renderChart({
        variant: "stacked-area",
        categories: ["A"],
        series: [
            { id: "one", label: "One", values: [Number.MAX_VALUE] },
            { id: "two", label: "Two", values: [Number.MAX_VALUE] },
        ],
    }), /finite/);
});
