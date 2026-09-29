import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PinInput } from "../dist/index.js";

function renderPin(props = {}) {
    return renderToStaticMarkup(createElement(PinInput, {
        label: "Verification code",
        name: "code",
        length: 6,
        required: true,
        ...props,
    }));
}

test("one native input owns the complete form value", () => {
    const markup = renderPin();
    assert.equal((markup.match(/<input\b/g) ?? []).length, 1);
    assert.equal((markup.match(/data-slot-index=/g) ?? []).length, 6);
    assert.match(markup, /name="code"/);
    assert.match(markup, /autoComplete="one-time-code"/);
    assert.match(markup, /pattern="\[0-9\]\{6\}"/);
    assert.match(markup, /required=""/);
});

test("invalid length, grouping and supplied code fail clearly", () => {
    assert.throws(() => renderPin({ length: 0 }), RangeError);
    assert.throws(() => renderPin({ groupSize: 7 }), RangeError);
    assert.throws(() => renderPin({ defaultValue: "123x" }), /digits/);
    assert.throws(() => renderPin({ defaultValue: "1234567" }), /digits/);
    assert.throws(() => renderPin({ value: "123" }), /onValueChange/);
});
