import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Badge } from "../dist/index.js";

function renderBadge(variant) {
    return renderToStaticMarkup(createElement(
        Badge,
        variant ? { variant } : null,
        "실패",
    ));
}

test("default badge keeps its previous neutral treatment", () => {
    const markup = renderBadge();
    assert.match(markup, /bg-surface-subtle/);
    assert.match(markup, /border-border/);
    assert.match(markup, />실패<\/span>/);
});

test("status variants retain text and use semantic tokens", () => {
    assert.match(renderBadge("outline"), /bg-transparent/);
    assert.match(renderBadge("accent"), /bg-accent/);
    const danger = renderBadge("danger");
    assert.match(danger, /border-danger/);
    assert.match(danger, /text-danger/);
    assert.match(danger, />실패<\/span>/);
});

test("unsupported badge variant fails clearly", () => {
    assert.throws(() => renderBadge("unknown"),
        /Badge variant is not supported/);
});
