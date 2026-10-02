import assert from "node:assert/strict";
import test from "node:test";
import { act, createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/",
});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { TreeNav } = await import("../dist/index.js");
const { createRoot } = await import("react-dom/client");

const pages = [
    { id: "overview", label: "개요", href: "/overview" },
    { id: "projects", label: "프로젝트", children: [
        { id: "atlas", label: "Atlas", href: "/atlas", children: [
            { id: "builds", label: "빌드", href: "/atlas/builds" },
        ] },
    ] },
    { id: "settings", label: "설정", href: "/settings", children: [
        { id: "billing", label: "결제", href: "/settings/billing" },
    ] },
];

function renderNav(props = {}) {
    return renderToStaticMarkup(createElement(TreeNav, {
        label: "프로젝트 페이지", items: pages, currentId: "builds", ...props,
    }));
}

test("nested page links keep current page and disclose its path", () => {
    const markup = renderNav();
    const document = new JSDOM(markup).window.document;
    const nav = document.querySelector("nav");

    assert.equal(nav.getAttribute("aria-label"), "프로젝트 페이지");
    assert.equal(nav.dataset.variant, "rail");
    assert.equal(nav.querySelectorAll("ul").length, 4);
    assert.equal(nav.querySelector('a[aria-current="page"]')
        .getAttribute("href"), "/atlas/builds");
    assert.equal(nav.querySelector("button[aria-expanded='true']")
        .textContent.includes("프로젝트"), true);
    assert.equal(nav.querySelector('a[href="/atlas"] + button')
        .getAttribute("aria-expanded"), "true");
    assert.equal(nav.querySelector('a[href="/settings"] + button')
        .getAttribute("aria-expanded"), "false");
    assert.ok(nav.querySelector('a[href="/settings/billing"]')
        .closest("ul").hidden);
    assert.match(renderNav({ variant: "filled" }),
        /data-variant="filled"/);
});

test("invalid pages, URLs, and controlled state fail explicitly", () => {
    assert.throws(() => renderNav({ items: [pages[0], pages[0]] }),
        /unique/);
    assert.throws(() => renderNav({ items: [
        { id: "group", label: "빈 그룹", children: [] },
    ], currentId: null }), /link or child/);
    assert.throws(() => renderNav({ items: [
        { id: "bad", label: "실행", href: "javascript:alert(1)" },
    ], currentId: null }), /unsupported/);
    assert.throws(() => renderNav({ currentId: "missing" }),
        /currentId/);
    assert.throws(() => renderNav({ expandedIds: ["projects"] }),
        /requires a callback/);
    assert.throws(() => renderNav({ defaultExpandedIds: ["builds"] }),
        /expanded IDs/);
    const cycle = { id: "loop", label: "순환" };
    cycle.children = [cycle];
    assert.throws(() => renderNav({ items: [cycle], currentId: null }),
        /cycle/);
});

test("disclosure is independent from links and a new route opens its path",
    async () => {
        const container = document.createElement("div");
        document.body.append(container);
        const root = createRoot(container);
        const changes = [];

        function render(currentId, extra = {}) {
            root.render(createElement(TreeNav, {
                label: "프로젝트 페이지", items: pages, currentId,
                onExpandedIdsChange: (ids) => changes.push(ids),
                ...extra,
            }));
        }

        try {
            await act(async () => render("builds"));
            const projects = [...container.querySelectorAll("button")].find(
                (button) => button.textContent.includes("프로젝트"),
            );
            await act(async () => projects.click());
            assert.equal(projects.getAttribute("aria-expanded"), "false");
            assert.ok(container.querySelector('a[href="/atlas"]')
                .closest("ul").hidden);
            assert.deepEqual(changes, [["atlas"]]);

            await act(async () => render("billing"));
            assert.equal(container.querySelector('a[href="/settings"] + button')
                .getAttribute("aria-expanded"), "true");
            assert.equal(container.querySelector('a[aria-current="page"]')
                .getAttribute("href"), "/settings/billing");

            await act(async () => render("billing", {
                expandedIds: ["projects"],
            }));
            const atlas = container.querySelector('a[href="/atlas"] + button');
            await act(async () => atlas.click());
            assert.deepEqual(changes.at(-1), ["projects", "atlas"]);
            assert.equal(atlas.getAttribute("aria-expanded"), "false");
        } finally {
            await act(async () => root.unmount());
            container.remove();
        }
    });

test.after(() => dom.window.close());
