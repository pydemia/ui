import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Rating } from "../dist/index.js";

function renderRating(props = {}) {
    return renderToStaticMarkup(createElement(Rating, {
        label: "Review score",
        name: "score",
        ...props,
    }));
}

test("editable rating uses one native radio group and form name", () => {
    const markup = renderRating({ defaultValue: 3, required: true });
    assert.match(markup, /<fieldset\b/);
    assert.match(markup, /<legend\b[^>]*>Review score/);
    assert.equal((markup.match(/type="radio"/g) ?? []).length, 5);
    assert.equal((markup.match(/name="score"/g) ?? []).length, 5);
    assert.equal((markup.match(/required=""/g) ?? []).length, 5);
    assert.equal((markup.match(/checked=""/g) ?? []).length, 1);
});

test("read-only score exposes a named value without form controls", () => {
    const markup = renderRating({ value: 4, readOnly: true, name: undefined });
    assert.doesNotMatch(markup, /<input\b/);
    assert.match(markup, /role="img"/);
    assert.match(markup, /Review score: 4\/5점/);
    assert.match(markup, /4\/5점/);
});

test("rating rejects invalid bounds and unwritable controlled values", () => {
    assert.throws(() => renderRating({ max: 0 }), RangeError);
    assert.throws(() => renderRating({ max: 11 }), RangeError);
    assert.throws(() => renderRating({ defaultValue: 6 }), RangeError);
    assert.throws(() => renderRating({ value: 2.5 }), RangeError);
    assert.throws(() => renderRating({ value: 3 }), /onValueChange/);
    assert.throws(() => renderRating({ readOnly: true }), /form value/);
    assert.throws(() => renderRating({
        readOnly: true, name: undefined, required: true,
    }), /form value/);
});
