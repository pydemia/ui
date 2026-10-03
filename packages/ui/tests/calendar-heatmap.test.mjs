import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CalendarHeatmap } from "../dist/index.js";

const days = [
    { date: "2024-01-01", value: 0 },
    { date: "2024-02-29", value: 4 },
    { date: "2024-12-31", value: null },
];

function render(props = {}) {
    return renderToStaticMarkup(createElement(CalendarHeatmap, {
        title: "일별 요청", year: 2024, days, unit: "건", ...props,
    }));
}

test("leap year grid keeps exact dates, zero and missing values", () => {
    const markup = render();
    assert.match(markup, /날짜별 값 366일 보기/);
    assert.match(markup, /data-date="2024-02-29"[^>]*data-value="4"/);
    assert.match(markup, /data-date="2024-12-31"[^>]*data-missing="true"/);
    assert.match(markup, /<time dateTime="2024-01-01">2024-01-01<\/time>/);
    assert.match(markup, /<td>4건<\/td>/);
    assert.match(markup, /<td>미수집<\/td>/);
    assert.match(markup, /aria-label="일별 요청 날짜별 값 표"/);
    assert.doesNotMatch(markup, /2025-01-01/);
});

test("unlisted days are zero, while an empty collection has no grid", () => {
    const markup = render();
    assert.match(markup, /data-date="2024-01-02"[^>]*data-value="0"/);
    assert.match(markup, /목록에 없는 날짜는 0건/);
    const empty = render({ days: [] });
    assert.match(empty, /role="status"/);
    assert.doesNotMatch(empty, /data-date=/);
    assert.doesNotMatch(empty, /<table/);
});

test("non-leap year and display choices use a bounded grid", () => {
    const markup = render({
        year: 2025,
        days: [{ date: "2025-01-01", value: 2 }],
        density: "comfortable", appearance: "plain", maxValue: 8,
    });
    assert.match(markup, /날짜별 값 365일 보기/);
    assert.match(markup, /data-density="comfortable"/);
    assert.match(markup, /data-appearance="plain"/);
    assert.match(markup, /data-date="2025-01-01"/);
    assert.doesNotMatch(markup, /data-date="2025-02-29"/);
    assert.match(markup, /8건/);
});

test("rejects malformed dates, values, axes and scale", () => {
    assert.throws(() => render({ year: 0 }), /title, year, and days/);
    assert.throws(() => render({ days: [
        { date: "2024-02-29", value: 1 },
        { date: "2024-02-29", value: 2 },
    ] }), /unique dates/);
    assert.throws(() => render({ days: [
        { date: "2024-02-30", value: 1 },
    ] }), /unique dates/);
    assert.throws(() => render({ days: [
        { date: "2025-01-01", value: 1 },
    ] }), /unique dates/);
    assert.throws(() => render({ days: [
        { date: "2024-01-01", value: -1 },
    ] }), /finite nonnegative/);
    assert.throws(() => render({ days: [
        { date: "2024-01-01", value: Infinity },
    ] }), /finite nonnegative/);
    assert.throws(() => render({ maxValue: 2 }), /cover every known value/);
    assert.throws(() => render({ density: "small" }), /density/);
});

test("large finite values keep intensity finite", () => {
    const markup = render({ days: [
        { date: "2024-01-01", value: Number.MAX_VALUE },
    ] });
    assert.doesNotMatch(markup, /NaN|Infinity/);
    assert.match(markup, /60%/);
});
