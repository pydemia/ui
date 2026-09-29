import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CitationList } from "../dist/index.js";

const sources = [
    {
        id: "pattern",
        title: "Button Pattern",
        href: "https://www.w3.org/WAI/ARIA/apg/patterns/button/",
        location: "Keyboard Interaction",
        excerpt: "Enter와 Space의 실행 방식",
    },
];

function renderList(props = {}) {
    return renderToStaticMarkup(createElement(CitationList, {
        label: "답변의 근거", sources, ...props,
    }));
}

test("sources retain list and descriptive link semantics", () => {
    const markup = renderList({ variant: "card" });
    assert.match(markup, /<section aria-labelledby=/);
    assert.match(markup, /<ol[^>]*><li/);
    assert.match(markup, /href="https:\/\/www\.w3\.org\/WAI\/ARIA\/apg\/patterns\/button\/"/);
    assert.match(markup, /target="_blank" rel="noopener noreferrer"/);
    assert.match(markup, /Button Pattern/);
    assert.match(markup, /Keyboard Interaction/);
    assert.match(markup, /새 탭/);
});

test("empty sources are distinct from an invalid list", () => {
    const markup = renderList({ sources: [], emptyText: "자료 없음" });
    assert.match(markup, /자료 없음/);
    assert.doesNotMatch(markup, /<ol/);
    assert.throws(() => renderList({ sources: null }),
        /must be an array/);
});

test("ambiguous sources and unsafe URL schemes fail", () => {
    assert.throws(() => renderList({ label: " " }), /requires a label/);
    assert.throws(() => renderList({ variant: "grid" }),
        /variant is not supported/);
    assert.throws(() => renderList({ sources: [
        sources[0], { ...sources[0], title: "Other" },
    ] }), /unique IDs/);
    assert.throws(() => renderList({ sources: [
        { ...sources[0], href: "javascript:alert(1)" },
    ] }), /must use HTTP\(S\)/);
    assert.throws(() => renderList({ sources: [
        { ...sources[0], href: "/relative" },
    ] }), /must be absolute/);
});
