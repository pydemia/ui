import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
    SegmentedControl, SegmentedControlItem,
} from "../dist/index.js";

function renderControl(props = {}) {
    return renderToStaticMarkup(createElement("form", null,
        createElement(SegmentedControl, {
            label: "화면 밀도",
            name: "density",
            defaultValue: "standard",
            ...props,
        },
        createElement(SegmentedControlItem,
            { value: "standard" }, "기본"),
        createElement(SegmentedControlItem,
            { value: "compact", disabled: true }, "밀집"))));
}

test("segmented choices retain radio and form semantics", () => {
    const markup = renderControl();
    assert.match(markup, /<fieldset\b/);
    assert.match(markup, /<legend\b[^>]*>화면 밀도<\/legend>/);
    assert.equal((markup.match(/type="radio"/g) ?? []).length, 2);
    assert.match(markup,
        /<input(?=[^>]*value="standard")(?=[^>]*checked="")[^>]*>/);
    assert.match(markup, /밀집/);
    assert.match(markup, /disabled=""/);
    assert.match(markup, /name="density"/);
});

test("the control requires a group label and form name", () => {
    assert.throws(() => renderControl({ label: " " }), /label/);
    assert.throws(() => renderControl({ name: " " }), /form name/);
    assert.throws(() => renderToStaticMarkup(createElement(
        SegmentedControl, { label: "밀도", name: "density" },
    )), /at least one item/);
    assert.throws(() => renderToStaticMarkup(createElement(
        SegmentedControl, { label: "밀도", name: "density" },
        createElement(SegmentedControlItem,
            { value: "same" }, "기본"),
        createElement(SegmentedControlItem,
            { value: "same" }, "밀집"),
    )), /unique/);
});
