import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { DataList } from "../dist/index.js";

function renderList(props = {}) {
    return renderToStaticMarkup(createElement(DataList, {
        label: "실행 정보",
        items: [
            { id: "period", label: "기간", value: "최근 7일" },
            { id: "owner", label: "담당", value: null },
        ],
        ...props,
    }));
}

test("pairs retain description-list semantics and explicit missing text", () => {
    const markup = renderList();
    assert.match(markup, /role="group" aria-labelledby=/);
    assert.match(markup, /<dl[^>]*>/);
    assert.match(markup, /<dt[^>]*>기간<\/dt>/);
    assert.match(markup, /<dd[^>]*>최근 7일<\/dd>/);
    assert.match(markup, /<dt[^>]*>담당<\/dt>/);
    assert.match(markup, /<dd[^>]*>값 없음<\/dd>/);
});

test("grid layout and empty state do not invent a value", () => {
    const grid = renderList({ layout: "grid", items: [
        { id: "empty", label: "메모", value: "" },
    ] });
    assert.match(grid, /@xs:grid-cols-2/);
    assert.doesNotMatch(grid, /값 없음/);
    const empty = renderList({ items: [], emptyText: "아직 없음" });
    assert.match(empty, /아직 없음/);
    assert.doesNotMatch(empty, /<dl/);
});

test("ambiguous or unsupported item data fails", () => {
    assert.throws(() => renderList({ label: " " }), /requires a label/);
    assert.throws(() => renderList({ items: null }), /must be an array/);
    assert.throws(() => renderList({ layout: "table" }),
        /layout is not supported/);
    assert.throws(() => renderList({ items: [
        { id: "same", label: "A", value: "1" },
        { id: "same", label: "B", value: "2" },
    ] }), /duplicated/);
    assert.throws(() => renderList({ items: [
        { id: "missing", label: "A" },
    ] }), /need id, label and value/);
});
