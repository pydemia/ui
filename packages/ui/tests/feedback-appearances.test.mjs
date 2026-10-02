import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
    Empty, EmptyContent, EmptyDescription, EmptyTitle,
    Skeleton,
} from "../dist/index.js";

function renderEmpty(appearance) {
    return renderToStaticMarkup(createElement(Empty, { appearance },
        createElement(EmptyTitle, null, "항목 없음"),
        createElement(EmptyDescription, null, "새 항목을 추가하세요."),
        createElement(EmptyContent, null,
            createElement("button", { type: "button" }, "추가")),
    ));
}

test("empty appearances preserve the same heading and native action", () => {
    const dashed = renderEmpty();
    const panel = renderEmpty("panel");
    const plain = renderEmpty("plain");

    for (const markup of [dashed, panel, plain]) {
        assert.match(markup, /<h3[^>]*>항목 없음<\/h3>/);
        assert.match(markup, /<button type="button">추가<\/button>/);
        assert.match(markup, /새 항목을 추가하세요/);
    }
    assert.match(dashed, /data-appearance="dashed"/);
    assert.match(dashed, /border-dashed/);
    assert.match(panel, /data-appearance="panel"/);
    assert.match(panel, /border-border bg-surface/);
    assert.match(plain, /data-appearance="plain"/);
    assert.match(plain, /bg-transparent/);
    assert.throws(() => renderEmpty("floating"), RangeError);
});

test("skeleton shapes remain decorative and respect reduced motion", () => {
    for (const shape of ["rectangle", "line", "circle"]) {
        const markup = renderToStaticMarkup(createElement(Skeleton, {
            shape,
        }));
        assert.match(markup, /aria-hidden="true"/);
        assert.match(markup, /motion-reduce:animate-none/);
        assert.match(markup, new RegExp(`data-shape="${shape}"`));
    }
    const defaultMarkup = renderToStaticMarkup(createElement(Skeleton));
    assert.match(defaultMarkup, /data-shape="rectangle"/);
    assert.match(renderToStaticMarkup(createElement(Skeleton, {
        shape: "circle",
    })), /size-10 rounded-full/);
    assert.throws(() => renderToStaticMarkup(createElement(Skeleton, {
        shape: "triangle",
    })), RangeError);
});
