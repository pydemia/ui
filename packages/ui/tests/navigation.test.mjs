import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
    BottomNav, BottomNavLink, FooterNav, FooterNavLink, GlobalNav, GlobalNavLink,
    LocalNav, LocalNavLink, NavigationShell, SideNav, SideNavLink,
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
    assert.match(markup, /data-appearance="bar"/);
    assert.match(markup, /href="\/overview"[^>]*aria-current="page"/);
    assert.match(markup, /<span aria-hidden="true"[^>]*>●<\/span>/);
    assert.match(markup, /<span>개요<\/span>/);
    assert.match(markup, /href="\/inbox"/);
    assert.match(markup, /<span>받은 편지함<\/span>/);
});

test("dock appearance preserves navigation links and labels", () => {
    const markup = renderToStaticMarkup(createElement(
        BottomNav,
        { "aria-label": "모바일 주요 탐색", appearance: "dock" },
        createElement(BottomNavLink, {
            href: "/overview", label: "개요", "aria-current": "page",
        }),
    ));

    assert.match(markup, /data-appearance="dock"/);
    assert.match(markup, /shadow-\[var\(--shadow-float\)\]/);
    assert.match(markup, /href="\/overview"[^>]*aria-current="page"/);
    assert.match(markup, /<span>개요<\/span>/);
    assert.throws(() => renderToStaticMarkup(createElement(
        BottomNav, { "aria-label": "탐색", appearance: "floating" },
    )), RangeError);
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

test("shell keeps named navigation areas in reading order around one main region", () => {
    const html = renderToStaticMarkup(createElement(NavigationShell, {
        globalNav: createElement(GlobalNav, { "aria-label": "앱 선택" }),
        sideNav: createElement(SideNav, { "aria-label": "프로젝트 탐색" }),
        localNav: createElement(LocalNav, { "aria-label": "작업 보기" },
            createElement(LocalNavLink, { href: "/tasks", "aria-current": "page" }, "목록")),
        rightPanel: { "aria-label": "작업 상세", children: "담당자" },
        mobileNav: createElement(BottomNav, { "aria-label": "모바일 업무" }),
        footerNav: createElement(FooterNav, { "aria-label": "이용 안내" },
            createElement(FooterNavLink, { href: "/help" }, "도움말")),
    }, "본문"));

    const labels = ["앱 선택", "프로젝트 탐색", "작업 보기", "본문", "작업 상세", "모바일 업무", "이용 안내"];
    let previous = -1;
    for (const label of labels) {
        const position = html.indexOf(label);
        assert(position > previous);
        previous = position;
    }
    assert.equal(html.match(/<main\b/g)?.length, 1);
    assert.match(html, /href="\/tasks"[^>]*aria-current="page"/);
    assert.match(html, /<aside[^>]*aria-label="작업 상세"/);
    assert.match(html, /<footer/);
});

test("a shell can omit navigation areas and embed inside an existing main", () => {
    const html = renderToStaticMarkup(createElement(
        NavigationShell, { mainProps: { as: "div" } }, "예시",
    ));
    assert.match(html, /data-ui="app-main"/);
    assert.doesNotMatch(html, /<(header|nav|aside|main|footer)\b/);
});
