import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
    BottomNav, BottomNavLink, GlobalNavLink, SideNavLink,
} from "../dist/index.js";

test("navigation link designs retain current-page semantics", () => {
    const global = renderToStaticMarkup(createElement(GlobalNavLink, {
        href: "/overview", variant: "underline", "aria-current": "page",
    }, "개요"));
    const side = renderToStaticMarkup(createElement(SideNavLink, {
        href: "/overview", variant: "filled", "aria-current": "page",
    }, "개요"));

    assert.match(global, /data-variant="underline"/);
    assert.match(global, /border-b-2/);
    assert.match(global, /aria-current="page"/);
    assert.match(side, /data-variant="filled"/);
    assert.match(side, /aria-\[current=page\]:bg-accent/);
    assert.match(side, /aria-current="page"/);
    assert.doesNotMatch(global + side, /\svariant="/);
});

test("bottom navigation keeps destination links and current page semantics", () => {
    const markup = renderToStaticMarkup(createElement(
        BottomNav,
        { "aria-label": "모바일 주요 탐색" },
        createElement(BottomNavLink, {
            href: "/overview", label: "개요", icon: "●",
            "aria-current": "page",
        }),
        createElement(BottomNavLink, {
            href: "/inbox", label: "받은 편지함",
        }),
    ));

    assert.match(markup, /<nav[^>]*aria-label="모바일 주요 탐색"/);
    assert.match(markup, /href="\/overview"[^>]*aria-current="page"/);
    assert.match(markup, /<span aria-hidden="true"[^>]*>●<\/span>/);
    assert.match(markup, /<span>개요<\/span>/);
    assert.match(markup, /href="\/inbox"/);
    assert.match(markup, /<span>받은 편지함<\/span>/);
});

test("bottom destination requires a visible name and a real href", () => {
    assert.throws(() => renderToStaticMarkup(createElement(
        BottomNavLink, { href: "/overview" },
    )), /requires a label and href/);
    assert.throws(() => renderToStaticMarkup(createElement(
        BottomNavLink, { href: "/overview", label: " " },
    )), /requires a label and href/);
    assert.throws(() => renderToStaticMarkup(createElement(
        BottomNavLink, { label: "개요" },
    )), /requires a label and href/);
    assert.throws(() => renderToStaticMarkup(createElement(
        BottomNavLink, { href: " ", label: "개요" },
    )), /requires a label and href/);
});
