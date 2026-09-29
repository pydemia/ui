import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MetricCard } from "../dist/index.js";

function renderMetric(variant) {
    return renderToStaticMarkup(createElement(MetricCard, {
        label: "Completed reviews",
        value: 24,
        change: "4 more than last week",
        detail: "This week",
        variant,
    }));
}

test("all metric layouts keep the same named value and context", () => {
    for (const variant of ["default", "compact", "featured"]) {
        const markup = renderMetric(variant);
        assert.match(markup, /role="group" aria-label="Completed reviews"/);
        assert.match(markup, new RegExp(`data-variant="${variant}"`));
        assert.match(markup, />Completed reviews<\/p>/);
        assert.match(markup, />24<\/p>/);
        assert.match(markup, /4 more than last week/);
        assert.match(markup, /This week/);
    }
});

test("new layouts use distinct token based treatments", () => {
    assert.match(renderMetric("compact"), /grid-cols-\[minmax\(0,1fr\)_auto\]/);
    assert.match(renderMetric("featured"), /bg-accent/);
    assert.match(renderMetric("featured"), /text-accent-foreground/);
    assert.throws(() => renderMetric("outlined"), RangeError);
});
