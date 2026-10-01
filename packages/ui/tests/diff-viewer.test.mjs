import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { DiffViewer } from "../dist/index.js";

function render(props = {}) {
    return renderToStaticMarkup(createElement(DiffViewer, {
        label: "settings.ts 변경",
        before: "region: west\ncache: false\nend",
        after: "region: west\ncache: true\nend",
        ...props,
    }));
}

test("unified diff preserves context, numbers and change labels", () => {
    const markup = render();
    assert.match(markup, /<figure[^>]*aria-labelledby=/);
    assert.match(markup, /role="region" tabindex="0"/);
    assert.match(markup, /<th scope="col"[^>]*>이전 줄<\/th>/);
    assert.match(markup, /<th scope="col"[^>]*>이후 줄<\/th>/);
    assert.equal((markup.match(/data-kind="context"/g) ?? []).length, 2);
    assert.equal((markup.match(/data-kind="removed"/g) ?? []).length, 1);
    assert.equal((markup.match(/data-kind="added"/g) ?? []).length, 1);
    assert.match(markup, /삭제: <\/span>.*−<\/span>cache: false/s);
    assert.match(markup, /추가: <\/span>.*\+<\/span>cache: true/s);
    assert.match(markup, /추가 1줄 · 삭제 1줄/);
});

test("split diff pairs replacements and keeps long lines scrollable", () => {
    const markup = render({ view: "split", wrap: false });
    assert.match(markup, /data-view="split"/);
    assert.match(markup, /settings.ts 변경 좌우 비교/);
    assert.match(markup, /이전 내용/);
    assert.match(markup, /이후 내용/);
    assert.match(markup, /whitespace-pre/);
    assert.match(markup, /max-w-full overflow-auto/);
    assert.equal((markup.match(/data-kind="change"/g) ?? []).length, 1);
    assert.match(render({ view: "split", wrap: true }),
        /min-w-\[40rem\] table-fixed/);
});

test("empty, equal, blank and final-newline states stay distinct", () => {
    assert.match(render({ before: "", after: "" }), /비교할 줄이 없습니다/);
    assert.doesNotMatch(render({ before: "", after: "" }), /<table/);
    assert.match(render({ before: "a\n", after: "a\n" }),
        /변경된 줄이 없습니다/);
    const finalNewline = render({ before: "a\n", after: "a" });
    assert.match(finalNewline, /끝 줄바꿈 제거/);
    assert.doesNotMatch(finalNewline, /변경된 줄이 없습니다/);
    assert.match(render({ before: "a\n\nb", after: "a\n\nb" }),
        /빈 줄/);
    assert.match(render({ before: "a\r\nb", after: "a\nb" }),
        /변경된 줄이 없습니다/);
});

test("repeated lines use deterministic matching and large input is explicit", () => {
    const repeated = render({ before: "a\nb\na", after: "a\na\nb" });
    assert.match(repeated, /추가 1줄 · 삭제 1줄/);
    const before = Array.from({ length: 1001 }, (_, index) =>
        `old-${index}`).join("\n");
    const after = Array.from({ length: 1001 }, (_, index) =>
        `new-${index}`).join("\n");
    const coarse = render({ before, after });
    assert.match(coarse, /data-comparison="coarse"/);
    assert.match(coarse, /공통 줄 매칭 없이 삭제·추가/);
    assert.match(coarse, /추가 1001줄 · 삭제 1001줄/);
});

test("source lines render as text instead of HTML", () => {
    const markup = render({
        before: "<script>alert(1)</script>",
        after: "<strong>safe</strong>",
    });
    assert.match(markup, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
    assert.match(markup, /&lt;strong&gt;safe&lt;\/strong&gt;/);
    assert.doesNotMatch(markup, /<script>|<strong>/);
});

test("invalid names, values and view fail visibly", () => {
    for (const props of [
        { label: " " },
        { before: null },
        { after: null },
        { view: "sideways" },
        { beforeLabel: " " },
        { afterLabel: null },
    ]) {
        assert.throws(() => render(props), /DiffViewer/);
    }
});
