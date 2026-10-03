import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { DataTable, Table, TableCell, TableHead } from "../dist/index.js";

function renderTable(appearance) {
    return renderToStaticMarkup(createElement(Table, {
        ...(appearance ? { appearance } : {}),
    },
    createElement("caption", null, "요청 현황"),
    createElement("thead", null,
        createElement("tr", null,
            createElement(TableHead, { scope: "col" }, "요청"))),
    createElement("tbody", null,
        createElement("tr", null,
            createElement(TableCell, null, "초대 화면"))),
    ));
}

test("table appearances keep native caption and column scope", () => {
    for (const appearance of ["lined", "grid", "plain"]) {
        const markup = renderTable(appearance);
        assert.match(markup, new RegExp(`data-appearance="${appearance}"`));
        assert.match(markup, /<caption>요청 현황<\/caption>/);
        assert.match(markup, /<th[^>]*scope="col"/);
        assert.match(markup, /<td[^>]*>초대 화면<\/td>/);
    }
});

test("table border treatments are distinct and default stays lined", () => {
    assert.match(renderTable(), /data-appearance="lined"/);
    assert.match(renderTable("grid"), /\[&amp;&gt;\*&gt;tr&gt;\*\]:border/);
    assert.match(renderTable("plain"), /\[&amp;&gt;\*&gt;tr&gt;\*\]:border-0/);
    assert.throws(() => renderTable("cards"), RangeError);
});

test("data table forwards appearance without changing row content", () => {
    const props = {
        caption: "요청 현황",
        rows: [{ id: "1", name: "초대 화면" }],
        columns: [{ id: "name", header: "요청", cell: (row) => row.name }],
        getRowId: (row) => row.id,
    };
    for (const appearance of ["lined", "grid", "plain"]) {
        const markup = renderToStaticMarkup(createElement(
            DataTable, { ...props, appearance },
        ));
        assert.match(markup, new RegExp(`data-appearance="${appearance}"`));
        assert.match(markup, /초대 화면/);
        assert.match(markup, /<caption class="sr-only">요청 현황<\/caption>/);
    }
});
