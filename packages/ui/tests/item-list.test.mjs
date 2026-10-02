import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ItemList } from "../dist/index.js";

const items = [
    {
        id: "report", title: "일일 지표 집계",
        description: "운영 지표를 갱신했습니다.", meta: "오늘 09:20",
        href: "/jobs/report", leading: "●",
        trailing: createElement("button", { type: "button" }, "자세히"),
    },
    { id: "queue", title: "대기열 점검", meta: "대기 0건", trailing: 0 },
];

function renderList(props = {}) {
    return renderToStaticMarkup(createElement(ItemList, {
        label: "최근 작업", items, ...props,
    }));
}

test("named native list keeps link and trailing action separate", () => {
    const markup = renderList();
    assert.match(markup, /<section[^>]*aria-labelledby=/);
    assert.match(markup, /<h3[^>]*>최근 작업<\/h3>/);
    assert.match(markup, /<ul[^>]*>/);
    assert.match(markup, /<li[^>]*>.*?<a href="\/jobs\/report"[^>]*>일일 지표 집계<\/a>/);
    assert.match(markup, /운영 지표를 갱신했습니다/);
    assert.match(markup, /오늘 09:20/);
    assert.match(markup, /<\/a>.*?<button type="button">자세히<\/button>/);
    assert.match(markup, /대기 0건/);
    assert.match(markup, /<div[^>]*>0<\/div>/);
});

test("compact plain layout and empty state preserve the list boundary", () => {
    const compact = renderList({ appearance: "plain", density: "compact" });
    assert.match(compact, /data-appearance="plain" data-density="compact"/);
    assert.doesNotMatch(compact, /overflow-hidden rounded-sm border/);
    const empty = renderList({ items: [], emptyText: "작업 없음" });
    assert.match(empty, /작업 없음/);
    assert.doesNotMatch(empty, /<ul/);
});

test("ambiguous entries and unsafe links are rejected", () => {
    assert.throws(() => renderList({ label: " " }), /requires a label/);
    assert.throws(() => renderList({ items: null }), /must be an array/);
    assert.throws(() => renderList({ appearance: "card" }),
        /appearance is not supported/);
    assert.throws(() => renderList({ density: "tight" }),
        /density is not supported/);
    assert.throws(() => renderList({ items: [items[0], items[0]] }),
        /unique IDs/);
    assert.throws(() => renderList({ items: [
        { id: "bad", title: " ", href: "/jobs" },
    ] }), /unique IDs and text/);
    assert.throws(() => renderList({ items: [
        { id: "unsafe", title: "링크", href: "javascript:alert(1)" },
    ] }), /must use HTTP\(S\)/);
    assert.throws(() => renderList({ items: [
        { id: "missing", title: "링크", href: " " },
    ] }), /nonempty URL/);
});
