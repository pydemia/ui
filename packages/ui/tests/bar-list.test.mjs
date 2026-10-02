import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BarList } from "../dist/index.js";

const items = [
    { id: "alpha", label: "성공", value: 4 },
    { id: "beta", label: "실패", value: 0 },
];

function renderList(props = {}) {
    return renderToStaticMarkup(createElement(BarList, {
        title: "실행 상태",
        items,
        unit: "건",
        ...props,
    }));
}

test("categorical values stay visible while bars are decorative", () => {
    const markup = renderList();
    assert.match(markup, /<figure/);
    assert.match(markup, /<figcaption[^>]*>/);
    assert.match(markup, /<ul/);
    assert.match(markup, /성공<\/span>/);
    assert.match(markup, /4건<\/span>/);
    assert.match(markup, /실패<\/span>/);
    assert.match(markup, /0건<\/span>/);
    assert.match(markup, /aria-hidden="true"/);
    assert.match(markup, /width:100%/);
    assert.match(markup, /width:0%/);
});

test("explicit scale, text override, plain layout and empty state", () => {
    const markup = renderList({
        max: 8,
        variant: "plain",
        items: [{ id: "one", label: "대기", value: 2,
            valueText: "2 of 8" }],
    });
    assert.match(markup, /width:25%/);
    assert.match(markup, /2 of 8/);
    assert.doesNotMatch(markup, /border-border/);

    const zero = renderList({ items: [items[1]] });
    assert.match(zero, /width:0%/);
    const empty = renderList({ items: [], emptyText: "아직 없음" });
    assert.match(empty, /아직 없음/);
    assert.doesNotMatch(empty, /<ul/);
});

test("invalid values cannot produce misleading bar lengths", () => {
    assert.throws(() => renderList({ title: " " }), /requires a title/);
    assert.throws(() => renderList({ items: null }), /must be an array/);
    assert.throws(() => renderList({ max: 0 }), /max must be positive/);
    assert.throws(() => renderList({ max: 3 }), /max cannot be below/);
    assert.throws(() => renderList({ items: [
        { id: "a", label: "A", value: -1 },
    ] }), /nonnegative finite/);
    assert.throws(() => renderList({ items: [
        { id: "a", label: "A", value: Infinity },
    ] }), /nonnegative finite/);
    assert.throws(() => renderList({ items: [items[0],
        { ...items[0], label: "duplicate" },
    ] }), /duplicated/);
});
