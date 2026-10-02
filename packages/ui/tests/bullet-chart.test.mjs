import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BulletChart } from "../dist/index.js";

function renderChart(props = {}) {
    return renderToStaticMarkup(createElement(BulletChart, {
        title: "완료 작업",
        value: 3,
        target: 5,
        max: 10,
        unit: "건",
        ...props,
    }));
}

test("shows actual, target and scale as text beside decorative marks", () => {
    const markup = renderChart();
    assert.match(markup, /<figure/);
    assert.match(markup, /<figcaption[^>]*>/);
    assert.match(markup, /<dl/);
    assert.match(markup, /<dt[^>]*>현재<\/dt>/);
    assert.match(markup, /<dd[^>]*>3건<\/dd>/);
    assert.match(markup, /<dt[^>]*>목표<\/dt>/);
    assert.match(markup, /<dd[^>]*>5건<\/dd>/);
    assert.match(markup, /<dd[^>]*>10건<\/dd>/);
    assert.match(markup, /aria-hidden="true"/);
    assert.match(markup, /width:30%/);
    assert.match(markup, /left:50%/);
});

test("missing and zero values remain distinct and text can be formatted", () => {
    const zero = renderChart({ value: 0, appearance: "plain" });
    assert.match(zero, /width:0%/);
    assert.match(zero, /0건/);
    assert.doesNotMatch(zero, /border-border/);

    const missing = renderChart({ value: null, missingText: "미수집" });
    assert.match(missing, /미수집/);
    assert.doesNotMatch(missing, /width:/);

    const formatted = renderChart({
        value: 1200, target: 1500, max: 2000, unit: "회",
        formatValue: (value) => value.toLocaleString("en-US"),
    });
    assert.match(formatted, /1,200회/);
    assert.match(formatted, /width:60%/);
});

test("out-of-range and ambiguous values are rejected", () => {
    assert.throws(() => renderChart({ title: " " }), /requires a title/);
    assert.throws(() => renderChart({ max: 0 }), /positive max/);
    assert.throws(() => renderChart({ target: 11 }), /positive max/);
    assert.throws(() => renderChart({ value: -1 }), /positive max/);
    assert.throws(() => renderChart({ value: Infinity }), /positive max/);
    assert.throws(() => renderChart({ value: undefined }), /positive max/);
    assert.throws(() => renderChart({ appearance: "card" }),
        /appearance is not supported/);
    assert.throws(() => renderChart({ valueLabel: " " }),
        /requires value and range labels/);
    assert.throws(() => renderChart({ valueLabel: "목표" }),
        /requires value and range labels/);
});
