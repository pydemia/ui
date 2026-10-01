import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MasterDetail } from "../dist/index.js";

const items = [
    { id: "first", title: "첫 번째 요청", description: "검토 대기" },
    { id: "second", title: "두 번째 요청", meta: "오늘", disabled: true },
];

function renderMasterDetail(props = {}) {
    return renderToStaticMarkup(createElement(MasterDetail, {
        label: "요청 목록",
        items,
        renderDetail: (item) => createElement("p", null, item.title),
        ...props,
    }));
}

test("named list, selected item, and detail remain distinct", () => {
    const markup = renderMasterDetail({ defaultSelectedId: "first" });
    assert.match(markup, /<section[^>]*aria-label="요청 목록"/);
    assert.match(markup, /role="region" aria-label="요청 목록 목록"/);
    assert.match(markup, /<button[^>]*aria-current="true"[^>]*>.*첫 번째 요청/s);
    assert.match(markup, /<section[^>]*aria-label="첫 번째 요청 상세"/);
    assert.match(markup, /<p>첫 번째 요청<\/p>/);
    assert.match(markup, /<button[^>]*disabled=""[^>]*>.*두 번째 요청/s);
    assert.match(markup, /목록으로/);
});

test("controlled null and stale selection do not choose another item", () => {
    const empty = renderMasterDetail({
        selectedId: null, defaultSelectedId: "first",
    });
    assert.doesNotMatch(empty, /aria-current="true"/);
    assert.match(empty, /항목을 선택하세요/);

    const stale = renderMasterDetail({ selectedId: "removed" });
    assert.doesNotMatch(stale, /aria-current="true"/);
    assert.match(stale, /항목을 선택하세요/);

    const noItems = renderMasterDetail({ items: [] });
    assert.match(noItems, /항목이 없습니다/);
});

test("invalid labels, item IDs, and renderer fail clearly", () => {
    assert.throws(() => renderMasterDetail({ label: " " }),
        /requires a label/);
    assert.throws(() => renderMasterDetail({ backLabel: " " }),
        /requires a back label/);
    assert.throws(() => renderMasterDetail({ renderDetail: null }),
        /requires items and renderDetail/);
    assert.throws(() => renderMasterDetail({ items: [items[0], items[0]] }),
        /unique IDs and titles/);
    assert.throws(() => renderMasterDetail({ items: [
        { id: "", title: "제목" },
    ] }), /unique IDs and titles/);
});
