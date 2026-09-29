import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
    Field, InputGroup, InputGroupAddon, InputGroupButton,
    InputGroupInput, InputGroupText, InputGroupTextarea,
} from "../dist/index.js";

test("field labels the native input and addon action stays separate", () => {
    const markup = renderToStaticMarkup(createElement(Field, {
        label: "요청 ID",
        children: (control) => createElement(InputGroup, null,
            createElement(InputGroupInput, {
                ...control,
                name: "requestId",
                defaultValue: "r-1042",
            }),
            createElement(InputGroupAddon, { align: "inline-start" },
                createElement(InputGroupText, null, "REQ")),
            createElement(InputGroupAddon, { align: "inline-end" },
                createElement(InputGroupButton, null, "확인")),
        ),
    }));

    const controlId = markup.match(/<input\b[^>]*id="([^"]+)"/)?.[1];
    assert.ok(controlId);
    assert.ok(markup.includes(`for="${controlId}"`));
    assert.match(markup, /name="requestId"/);
    assert.match(markup, /value="r-1042"/);
    assert.match(markup, /<button\b[^>]*type="button"/);
    assert.ok(markup.indexOf("<input") < markup.indexOf("<button"));
    assert.match(markup, /data-align="inline-start"/);
    assert.match(markup, /data-align="inline-end"/);
});

test("textarea keeps native form semantics and block addons", () => {
    const markup = renderToStaticMarkup(createElement(InputGroup, null,
        createElement(InputGroupTextarea, {
            "aria-label": "작업 메모",
            "aria-invalid": true,
            name: "note",
            defaultValue: "검토 필요",
        }),
        createElement(InputGroupAddon, { align: "block-end" },
            createElement(InputGroupButton, { type: "submit" }, "저장")),
    ));

    assert.match(markup, /<textarea\b[^>]*name="note"/);
    assert.match(markup, /aria-invalid="true"/);
    assert.match(markup, /검토 필요<\/textarea>/);
    assert.match(markup, /data-align="block-end"/);
    assert.match(markup, /<button\b[^>]*type="submit"/);
    assert.throws(() => renderToStaticMarkup(createElement(
        InputGroupAddon, { align: "diagonal" }, "단위",
    )), RangeError);
});
