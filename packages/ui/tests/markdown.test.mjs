import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Markdown } from "../dist/index.js";

function render(source) {
    return renderToStaticMarkup(createElement(Markdown, { source }));
}

test("renders the documented block and inline subset", () => {
    const markup = render([
        "# Summary", "", "**Done** and *pending* with `code`.", "",
        "- First", "- Second", "", "3. Third", "4. Fourth", "",
        "```ts", "const total = 4;", "```",
    ].join("\n"));

    assert.match(markup, /<h2[^>]*>Summary<\/h2>/);
    assert.match(markup, /<strong[^>]*>Done<\/strong>/);
    assert.match(markup, /<em>pending<\/em>/);
    assert.match(markup, /<code[^>]*>code<\/code>/);
    assert.match(markup, /<ul[^>]*><li[^>]*>First<\/li>/);
    assert.match(markup, /<ol start="3"[^>]*>/);
    assert.match(markup, /<pre[^>]*aria-label="ts 코드"[^>]*>/);
    assert.match(markup, /const total = 4;/);
});

test("only absolute HTTP(S) destinations become links", () => {
    const markup = render([
        "[secure](https://example.com/path)",
        "[plain](http://example.com)",
        "[script](javascript:alert(1))",
        "[relative](/admin)",
        "[credentials](https://name:secret@example.com)",
        "[backslash](https://example.com\\@evil.test)",
    ].join(" "));

    assert.match(markup, /href="https:\/\/example.com\/path"/);
    assert.match(markup, /href="http:\/\/example.com\/"/);
    assert.equal((markup.match(/<a /g) ?? []).length, 2);
    assert.match(markup, /\[script\]\(javascript:alert\(1\)\)/);
    assert.match(markup, /\[relative\]\(\/admin\)/);
});

test("raw HTML and image syntax remain escaped text", () => {
    const markup = render(
        '<script>alert("x")</script> ![image](https://example.com/a.png)',
    );
    assert.doesNotMatch(markup, /<script>|<img|<a /);
    assert.match(markup, /&lt;script&gt;/);
    assert.match(markup, /!\[image\]/);
});

test("unclosed code fence preserves the remaining source as code", () => {
    const markup = render("```\n<script>\n**bold**");
    assert.match(markup, /<pre[^>]*>/);
    assert.match(markup, /&lt;script&gt;/);
    assert.match(markup, /\*\*bold\*\*/);
    assert.doesNotMatch(markup, /<strong|<script>/);
});

test("empty, malformed and escaped syntax stays readable", () => {
    assert.doesNotMatch(render(""), /<p|<pre|<ul/);
    const markup = render("\\*literal\\* [broken](not-a-url) **open");
    assert.match(markup, /\*literal\*/);
    assert.match(markup, /\[broken\]\(not-a-url\)/);
    assert.match(markup, /\*\*open/);
    assert.doesNotMatch(markup, /<a |<strong/);
});

test("deeply nested emphasis has bounded parsing depth", () => {
    const source = "*a".repeat(20) + "*".repeat(20);
    const markup = render(source);
    assert.match(markup, /<em>/);
    assert.match(markup, /a/);
});

test("non-string source reports invalid input", () => {
    assert.throws(() => renderToStaticMarkup(createElement(Markdown, {
        source: null,
    })), {
        name: "TypeError", message: "Markdown source must be a string.",
    });
});

test("raw HTML injection prop is rejected at runtime", () => {
    assert.throws(() => renderToStaticMarkup(createElement(Markdown, {
        source: "safe", dangerouslySetInnerHTML: { __html: "<img>" },
    })), {
        name: "TypeError", message: "Markdown does not accept raw HTML.",
    });
});
