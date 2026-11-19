import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Sidebar } from "../dist/index.js";

const sections = [
    { id: "work", label: "작업", items: [
        { id: "overview", label: "개요", href: "/overview", current: true },
        { id: "files", label: "파일", href: "/files" },
    ] },
    { id: "manage", label: "관리", items: [
        { id: "settings", label: "설정", href: "/settings" },
    ] },
];

function renderSidebar(props = {}) {
    return renderToStaticMarkup(createElement(Sidebar, {
        label: "프로젝트 탐색", sections, ...props,
    }));
}

test("sections group named links and retain current-page semantics", () => {
    const markup = renderSidebar();
    assert.match(markup, /<nav[^>]*aria-label="프로젝트 탐색"/);
    assert.equal((markup.match(/role="group" aria-labelledby=/g) ?? []).length, 2);
    assert.match(markup, /<h3[^>]*>작업<\/h3>/);
    assert.match(markup, /<h3[^>]*>관리<\/h3>/);
    assert.match(markup, /href="\/overview"[^>]*aria-current="page"/);
    assert.ok(markup.indexOf("개요") < markup.indexOf("설정"));
});

test("collapsed sections keep group and link names; flat items still work", () => {
    const collapsed = renderSidebar({ collapsed: true });
    assert.match(collapsed, /<h3[^>]*sr-only[^>]*>작업<\/h3>/);
    assert.match(collapsed, /<span class="sr-only">개요<\/span>/);

    const flat = renderSidebar({ sections: undefined, items: [
        { id: "overview", label: "개요", href: "/overview" },
    ] });
    assert.match(flat, /href="\/overview"/);
    assert.doesNotMatch(flat, /role="group"/);
});

test("link variant styles current items without changing navigation semantics", () => {
    const rail = renderSidebar();
    const filled = renderSidebar({ linkVariant: "filled", collapsed: true });

    assert.match(rail, /data-variant="rail"[^>]*href="\/overview"/);
    assert.match(filled, /data-variant="filled"[^>]*href="\/overview"/);
    assert.match(filled, /href="\/overview"[^>]*aria-current="page"/);
    assert.match(filled, /<span class="sr-only">개요<\/span>/);
    assert.throws(() => renderSidebar({ linkVariant: "other" }),
        /link variant is not supported/);
});

test("ambiguous or invalid sections fail before rendering", () => {
    assert.throws(() => renderSidebar({ items: [] }),
        /requires items or sections, not both/);
    assert.throws(() => renderSidebar({ sections: undefined }),
        /requires items or sections, not both/);
    assert.throws(() => renderSidebar({ sections: [sections[0], sections[0]] }),
        /sections need unique IDs/);
    assert.throws(() => renderSidebar({ sections: [
        { id: "empty", label: " ", items: [] },
    ] }), /sections need unique IDs/);
    assert.throws(() => renderSidebar({ sections: [
        sections[0], { id: "other", label: "기타", items: [
            { id: "files", label: "다른 파일", href: "/other" },
        ] },
    ] }), /item ids must be unique/);
});

test("desktop sidebars expose an accessible resize separator by default", () => {
    const markup = renderSidebar();
    assert.match(markup, /role="separator"[^>]*aria-label="프로젝트 탐색 너비"/);
    assert.match(markup, /aria-orientation="vertical"[^>]*aria-valuemin="160"[^>]*aria-valuemax="420"[^>]*aria-valuenow="224"/);
    assert.doesNotMatch(renderSidebar({ collapsed: true }), /role="separator"/);
    assert.doesNotMatch(renderSidebar({ resizable: false }), /role="separator"/);
    assert.match(renderSidebar({ side: "right" }), /left-0 before:left-0/);
});
