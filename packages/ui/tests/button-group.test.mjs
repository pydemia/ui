import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Button, ButtonGroup, ButtonGroupSeparator } from "../dist/index.js";

function renderGroup(props = {}) {
    return renderToStaticMarkup(createElement(ButtonGroup, {
        label: "수량 조정",
        ...props,
    },
    createElement(Button, { disabled: true }, "수량 줄이기"),
    createElement(ButtonGroupSeparator),
    createElement(Button, null, "수량 늘리기")));
}

test("related actions keep native button semantics in a named group", () => {
    const markup = renderGroup();
    assert.match(markup, /role="group" aria-label="수량 조정"/);
    assert.match(markup, /data-orientation="horizontal"/);
    assert.equal((markup.match(/<button\b/g) ?? []).length, 2);
    assert.match(markup, /<button\b[^>]*disabled=""/);
    assert.match(markup, /data-slot="button-group-separator"/);
    assert.match(markup, /aria-hidden="true"/);
});

test("vertical group and invalid configuration remain distinct", () => {
    assert.match(renderGroup({ orientation: "vertical" }),
        /data-orientation="vertical"/);
    assert.throws(() => renderGroup({ label: " " }), /label/);
    assert.throws(() => renderGroup({ orientation: "diagonal" }),
        RangeError);
});
