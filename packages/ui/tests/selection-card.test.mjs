import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Checkbox, RadioGroup, RadioGroupItem } from "../dist/index.js";

test("checkbox card names and describes the full form control", () => {
    const markup = renderToStaticMarkup(createElement(Checkbox, {
        variant: "card", label: "알림 받기",
        description: "하루 한 번 요약합니다.", name: "digest",
        "aria-describedby": "setting-help",
        defaultChecked: true,
    }));
    assert.match(markup, /role="checkbox" aria-checked="true"/);
    assert.match(markup, /aria-labelledby="([^"]+)-label"/);
    assert.match(markup,
        /aria-describedby="setting-help [^"]+-description"/);
    assert.match(markup, /id="[^"]+-label"[^>]*>알림 받기/);
    assert.match(markup, /id="[^"]+-description"[^>]*>하루 한 번/);
    assert.match(markup, /<input[^>]*type="checkbox"[^>]*name="digest"/);
    assert.match(markup, /min-h-16/);
});

test("radio cards retain one group, form value, and disabled state", () => {
    const markup = renderToStaticMarkup(createElement(RadioGroup, {
        name: "density", defaultValue: "standard", "aria-label": "화면 밀도",
    },
    createElement(RadioGroupItem, {
        variant: "card", value: "standard", label: "기본",
        description: "넉넉한 간격",
    }),
    createElement(RadioGroupItem, {
        variant: "card", value: "compact", label: "밀집",
        disabled: true,
    })));
    assert.match(markup, /role="radiogroup"/);
    assert.equal((markup.match(/role="radio"/g) ?? []).length, 2);
    assert.match(markup, /aria-labelledby="[^"]+-label"/);
    assert.match(markup, /aria-describedby="[^"]+-description"/);
    assert.match(markup,
        /<button(?=[^>]*value="compact")(?=[^>]*disabled="")[^>]*>/);
    assert.match(markup, /name="density"/);
});

test("default controls keep compact styles and cards require labels", () => {
    const checkbox = renderToStaticMarkup(createElement(Checkbox, {
        "aria-label": "확인",
    }));
    const radio = renderToStaticMarkup(createElement(RadioGroup, {
        "aria-label": "선택",
    }, createElement(RadioGroupItem, { value: "one" })));
    assert.match(checkbox, /size-5 justify-center/);
    assert.match(radio, /size-5 justify-center/);
    assert.throws(() => renderToStaticMarkup(createElement(Checkbox, {
        variant: "card", label: " ",
    })), /requires a label/);
    assert.throws(() => renderToStaticMarkup(createElement(RadioGroup,
        { "aria-label": "선택" }, createElement(RadioGroupItem, {
            variant: "card", value: "one", label: " ",
        }))), /requires a label/);
});
