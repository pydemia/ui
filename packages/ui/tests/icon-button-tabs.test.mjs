import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
    IconButton, Tabs, TabsList, TabsTrigger, TabsContent,
} from "../dist/index.js";

test("icon button keeps a native action and a required accessible name", () => {
    const markup = renderToStaticMarkup(createElement(IconButton, {
        label: "항목 추가",
        icon: createElement("svg", { "data-icon": "plus" }),
        "aria-pressed": true,
    }));

    assert.match(markup, /<button\b[^>]*type="button"/);
    assert.match(markup, /aria-label="항목 추가"/);
    assert.match(markup, /aria-pressed="true"/);
    assert.match(markup, /<span aria-hidden="true"/);
    assert.match(markup, /data-icon="plus"/);
    assert.throws(() => renderToStaticMarkup(createElement(IconButton, {
        label: " ", icon: "+",
    })), /requires a label/);
    assert.throws(() => renderToStaticMarkup(createElement(IconButton, {
        label: "항목 추가", icon: null,
    })), /requires an icon/);
    assert.throws(() => renderToStaticMarkup(createElement(IconButton, {
        label: "항목 추가", icon: 0,
    })), /requires an icon/);
});

function renderTabs(variant) {
    return renderToStaticMarkup(createElement(Tabs, {
        defaultValue: "overview",
    }, createElement(TabsList, {
        "aria-label": "항목 보기",
        variant,
    }, createElement(TabsTrigger, { value: "overview" }, "개요"),
    createElement(TabsTrigger, { value: "details" }, "상세")),
    createElement(TabsContent, { value: "overview" }, "개요 내용")));
}

test("tabs variants change appearance without changing tab semantics", () => {
    for (const variant of ["default", "line", "contained"]) {
        const markup = renderTabs(variant);
        assert.match(markup, new RegExp(`data-variant="${variant}"`));
        assert.match(markup, /role="tablist"/);
        assert.match(markup, /role="tab"/);
        assert.match(markup, /aria-selected="true"/);
        assert.match(markup, /role="tabpanel"/);
    }
    assert.match(renderTabs("line"), /border-b-2/);
    assert.match(renderTabs("contained"), /bg-surface-subtle/);
    assert.throws(() => renderTabs("raised"), RangeError);
});
