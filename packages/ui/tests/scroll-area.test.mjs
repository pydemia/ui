import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ScrollArea } from "../dist/index.js";

test("scroll viewport is a named keyboard region", () => {
    const markup = renderToStaticMarkup(createElement(
        ScrollArea, { label: "Recent events", type: "always" },
        "Event list",
    ));
    assert.match(markup, /role="region" aria-label="Recent events"/);
    assert.match(markup, /tabindex="0"/);
    assert.match(markup, /data-orientation="vertical"/);
    assert.doesNotMatch(markup, /data-orientation="horizontal"/);
});

test("both orientations render their scrollbar tracks", () => {
    const markup = renderToStaticMarkup(createElement(
        ScrollArea, { label: "Metrics", orientation: "both",
            type: "always" }, "Data",
    ));
    assert.match(markup, /data-orientation="vertical"/);
    assert.match(markup, /data-orientation="horizontal"/);
});

test("unnamed or unsupported scroll areas fail explicitly", () => {
    assert.throws(() => renderToStaticMarkup(createElement(
        ScrollArea, { label: " " }, "Data",
    )), /label/);
    assert.throws(() => renderToStaticMarkup(createElement(
        ScrollArea, { label: "Data", orientation: "diagonal" }, "Data",
    )), /orientation/);
});
