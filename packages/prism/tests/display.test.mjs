import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PrismAnchorChip, PrismGridTable, PrismProfileChip } from "../dist/index.js";

const documentFor = element => new JSDOM(renderToStaticMarkup(element)).window.document;

test("profile chips only expose a button when they have an enabled action", () => {
    const passive = documentFor(h(PrismProfileChip, { name: "이성민", "data-testid": "passive-profile" }));
    assert.equal(passive.querySelector(".prism-profile-chip").tagName, "SPAN");
    assert.equal(passive.querySelector(".prism-profile-chip").getAttribute("data-testid"), "passive-profile");
    assert.equal(passive.querySelectorAll("button").length, 0);
    const active = documentFor(h(PrismProfileChip, { name: "김가상", onClick() {} }));
    assert.equal(active.querySelector(".prism-profile-chip").tagName, "BUTTON");
    assert.equal(active.querySelector("button").getAttribute("type"), "button");
    const readOnly = documentFor(h(PrismProfileChip, { name: "이예시", readOnly: true, onClick() {} }));
    assert.equal(readOnly.querySelector(".prism-profile-chip").tagName, "SPAN");
});

test("source-style anchor props and grid rows retain semantic table structure", () => {
    const anchor = documentFor(h(PrismAnchorChip, { label: "전문성", active: true, interactive: false }));
    assert.equal(anchor.querySelector(".prism-anchor-chip").tagName, "SPAN");
    assert.equal(anchor.querySelector(".prism-anchor-chip").textContent, "전문성");
    const columns = [
        { id: "company", header: "회사명", cell: row => row.company },
        { id: "status", header: "상태", cell: row => h("strong", null, row.status) },
    ];
    const table = documentFor(h(PrismGridTable, { caption: "회사 목록", columns,
        rows: [{ id: "one", company: "가상전자", status: "완료" }], getRowId: row => row.id, height: 200 }));
    assert.equal(table.querySelector("caption").textContent, "회사 목록");
    assert.equal(table.querySelectorAll("thead th[scope=col]").length, 2);
    assert.equal(table.querySelectorAll("tbody tr").length, 1);
    assert.equal(table.querySelector("tbody strong").textContent, "완료");
    assert.equal(table.querySelector('.prism-grid-table-scroll').style.height, "200px");
    const empty = documentFor(h(PrismGridTable, { caption: "회사 목록", columns, rows: [], getRowId: row => row.id }));
    assert.equal(empty.querySelector(".prism-grid-table-empty").getAttribute("colspan"), "2");
    assert.match(empty.querySelector(".prism-grid-table-empty").textContent, /표시할 데이터가 없습니다/);
});
