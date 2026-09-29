import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { RangeSlider, Slider } from "../dist/index.js";

function renderRange(props = {}) {
    return renderToStaticMarkup(createElement(RangeSlider, {
        label: "Price range",
        minLabel: "Minimum price",
        maxLabel: "Maximum price",
        minName: "minPrice",
        maxName: "maxPrice",
        defaultValue: [20, 80],
        ...props,
    }));
}

test("range slider names both thumbs and submits two ordered values", () => {
    const markup = renderRange({ form: "filters" });
    const groupLabelId = markup.match(/aria-labelledby="([^"]+)"/)?.[1];
    assert.ok(groupLabelId);
    assert.ok(markup.includes(`id="${groupLabelId}"`));
    assert.match(markup, /role="group"/);
    assert.equal((markup.match(/role="slider"/g) ?? []).length, 2);
    assert.match(markup, /aria-label="Minimum price"/);
    assert.match(markup, /aria-label="Maximum price"/);
    assert.match(markup, /name="minPrice" value="20"/);
    assert.match(markup, /name="maxPrice" value="80"/);
    assert.equal((markup.match(/form="filters"/g) ?? []).length, 4);
});

test("disabled range omits both values from native form submission", () => {
    const markup = renderRange({ disabled: true });
    assert.match(markup, /aria-disabled="true"/);
    assert.equal((markup.match(/type="hidden"[^>]*disabled=""/g) ?? [])
        .length, 2);
});

test("range rejects ambiguous names, values and bounds", () => {
    assert.throws(() => renderRange({ minName: "maxPrice" }), /differ/);
    assert.throws(() => renderRange({ minLabel: "Maximum price" }),
        /differ/);
    assert.throws(() => renderRange({ label: " " }), /labels/);
    assert.throws(() => renderRange({ min: 100 }), RangeError);
    assert.throws(() => renderRange({ step: 0 }), RangeError);
    assert.throws(() => renderRange({ defaultValue: [80, 20] }),
        RangeError);
    assert.throws(() => renderRange({ defaultValue: [20, 110] }),
        RangeError);
    assert.throws(() => renderRange({ defaultValue: [20] }), RangeError);
    assert.throws(() => renderRange({ minStepsBetweenThumbs: 2,
        defaultValue: [20, 21] }), RangeError);
    assert.throws(() => renderRange({ value: [20, 80],
        defaultValue: undefined }), /onValueChange/);
    assert.throws(() => renderRange({ value: [20, 80],
        onValueChange() {} }), /value and defaultValue/);
});

test("Slider accepts distinct thumb labels without changing its API", () => {
    const markup = renderToStaticMarkup(createElement(Slider, {
        "aria-label": "Price range",
        defaultValue: [20, 80],
        thumbLabels: ["Minimum price", "Maximum price"],
    }));
    assert.match(markup, /aria-label="Minimum price"/);
    assert.match(markup, /aria-label="Maximum price"/);
    assert.throws(() => renderToStaticMarkup(createElement(Slider, {
        "aria-label": "Price range",
        defaultValue: [20, 80],
        thumbLabels: ["Minimum price"],
    })), /one non-empty label per thumb/);
});
