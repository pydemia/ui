import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { TimePicker } from "../dist/index.js";

function renderTime(props = {}) {
    return renderToStaticMarkup(createElement(TimePicker, {
        label: "Review time",
        name: "reviewTime",
        value: null,
        onValueChange: () => {},
        ...props,
    }));
}

test("24-hour selection exposes one form value and required selects", () => {
    const markup = renderTime({ value: "21:35", hourCycle: "h23",
        required: true });
    assert.match(markup, /<legend[^>]*>Review time/);
    assert.equal((markup.match(/<select\b/g) ?? []).length, 2);
    assert.equal((markup.match(/required=""/g) ?? []).length, 2);
    assert.match(markup, /type="hidden" name="reviewTime" value="21:35"/);
    assert.match(markup, /<option value="21" selected=""/);
    assert.match(markup, /<option value="35" selected=""/);
});

test("12-hour selection keeps canonical value and localized period", () => {
    const markup = renderTime({ value: "00:05", hourCycle: "h12",
        locale: "ko-KR" });
    assert.equal((markup.match(/<select\b/g) ?? []).length, 3);
    assert.match(markup, /type="hidden" name="reviewTime" value="00:05"/);
    assert.match(markup, /<option value="12" selected=""/);
    assert.match(markup, /<option value="am" selected=""/);
    assert.match(markup, /오전/);
});

test("invalid time, minute step and label fail explicitly", () => {
    assert.throws(() => renderTime({ value: "24:00" }), /HH:mm/);
    assert.throws(() => renderTime({ value: "10:03" }), /minuteStep/);
    assert.throws(() => renderTime({ minuteStep: 7 }), /minuteStep/);
    assert.throws(() => renderTime({ label: " " }), /label/);
    assert.throws(() => renderTime({ hourCycle: "h24" }), /hourCycle/);
    assert.throws(() => renderTime({ onValueChange: undefined }),
        /onValueChange/);
});
