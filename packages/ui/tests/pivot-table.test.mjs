import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PivotTable } from "../dist/index.js";

const rows = [
    { id: "east", label: "동부" },
    { id: "west", label: "서부" },
];
const columns = [
    { id: "web", label: "웹" },
    { id: "api", label: "API" },
];
const records = [
    { rowId: "east", columnId: "web", value: 12 },
    { rowId: "east", columnId: "web", value: 3 },
    { rowId: "east", columnId: "api", value: 9 },
    { rowId: "west", columnId: "api", value: -2 },
];

function renderTable(props = {}) {
    return renderToStaticMarkup(createElement(PivotTable, {
        title: "지역별 요청", rowLabel: "지역", columnLabel: "채널",
        rows, columns, records, unit: "건", ...props,
    }));
}

test("aggregates repeated intersections and both axes without sorting", () => {
    const markup = renderTable();
    const body = markup.match(/<tbody>(.*?)<\/tbody>/s)?.[1];
    const bodyRows = [...body.matchAll(/<tr[^>]*>(.*?)<\/tr>/gs)]
        .map((match) => match[1]);
    assert.match(markup, /<figcaption[^>]*>.*지역별 요청/s);
    assert.match(markup, /<th scope="col"[^>]*>웹<\/th>/);
    assert.match(markup, /<th scope="row"[^>]*>동부<\/th>/);
    assert.match(bodyRows[0], /동부.*15건.*9건.*24건/s);
    assert.match(bodyRows[1], /서부.*0건.*-2건.*-2건/s);
    assert.match(markup, /<tfoot>.*15건.*7건.*22건/s);
    assert.match(markup, /tabindex="0"/);
});

test("unknown input remains distinct from an absent zero-valued cell", () => {
    const markup = renderTable({ records: [
        ...records,
        { rowId: "west", columnId: "api", value: null },
    ] });
    assert.match(markup, /data-missing="true"[^>]*>미수집<\/td>/);
    const west = markup.match(/<th scope="row"[^>]*>서부<\/th>(.*?)<\/tr>/s)?.[1];
    assert.match(west, /0건.*미수집.*미수집/s);
    assert.match(markup, /<tfoot>.*15건.*미수집.*미수집/s);
});

test("empty axes and zero-event input are different states", () => {
    const empty = renderTable({ rows: [], columns: [], records: [] });
    assert.match(empty, /role="status"/);
    assert.doesNotMatch(empty, /<table/);

    const zero = renderTable({ records: [], appearance: "plain" });
    assert.match(zero, /<table/);
    assert.match(zero, /<tfoot>.*0건.*0건.*0건/s);
    assert.doesNotMatch(zero, /rounded-sm border border-border bg-surface/);
});

test("rejects malformed axes, records and overflowing sums", () => {
    assert.throws(() => renderTable({ rowLabel: " " }),
        /needs title and axis labels/);
    assert.throws(() => renderTable({ rows: [rows[0], rows[0]] }),
        /unique IDs and labels/);
    assert.throws(() => renderTable({ records: undefined }),
        /axes and records must be arrays/);
    assert.throws(() => renderTable({ columns: [] }),
        /empty axes cannot contain data/);
    assert.throws(() => renderTable({ records: [
        { rowId: "missing", columnId: "web", value: 1 },
    ] }), /unknown axis ID/);
    assert.throws(() => renderTable({ records: [
        { rowId: "east", columnId: "web", value: Infinity },
    ] }), /finite numbers or null/);
    assert.throws(() => renderTable({ records: [
        { rowId: "east", columnId: "web", value: Number.MAX_VALUE },
        { rowId: "east", columnId: "web", value: Number.MAX_VALUE },
    ] }), /cell total must be finite/);
    assert.throws(() => renderTable({ records: [
        { rowId: "east", columnId: "web", value: Number.MAX_VALUE },
        { rowId: "east", columnId: "api", value: Number.MAX_VALUE },
    ] }), /total must be finite/);
});

test("validates display formatting and appearance", () => {
    assert.throws(() => renderTable({ formatValue: () => " " }),
        /formatted values must be text/);
    assert.throws(() => renderTable({ appearance: "unknown" }),
        /appearance is not supported/);
    assert.match(renderTable({ formatValue: (value) => `${value} requests`,
        unit: "" }), /15 requests/);
});
