import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { TreeSelect } from "../dist/index.js";

const items = [
    { id: "product", label: "제품", children: [
        { id: "design", label: "디자인" },
        { id: "frontend", label: "프론트엔드" },
    ] },
    { id: "archive", label: "보관", disabled: true,
        children: [{ id: "old", label: "이전 팀" }] },
];

function render(props = {}) {
    return renderToStaticMarkup(createElement(TreeSelect, {
        label: "담당 조직", items, name: "team", ...props,
    }));
}

test("selected path and native form value share one enabled id", () => {
    const markup = render({ defaultValue: "frontend", required: true });
    assert.match(markup, /담당 조직 \(필수\): 제품 \/ 프론트엔드/);
    assert.match(markup, /<label[^>]*for="[^\"]+"[^>]*>담당 조직/);
    assert.match(markup, /<select[^>]*name="team"[^>]*required=""/);
    assert.match(markup, /<select[^>]*aria-hidden="true"/);
    assert.match(markup, /<option value="frontend" selected="">/);
    assert.doesNotMatch(markup, /<option value="old"/);
    assert.doesNotMatch(markup, /선택 지우기/);
});

test("optional selection exposes a clear action and empty form value", () => {
    const selected = render({ value: "design" });
    assert.match(selected, /담당 조직 선택 지우기/);
    const empty = render();
    assert.match(empty, /담당 조직: 항목 선택/);
    assert.match(empty, /<option value="" selected="">/);
});

test("invalid, disabled, duplicate and missing values fail visibly", () => {
    for (const props of [
        { label: " " },
        { value: "missing" },
        { value: "archive" },
        { value: "old" },
        { items: [{ id: "x", label: "One" },
            { id: "x", label: "Two" }] },
        { items: [{ id: "", label: "Blank" }] },
    ]) {
        assert.throws(() => render(props), /TreeSelect/);
    }
});
