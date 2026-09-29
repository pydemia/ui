import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Tree } from "../dist/index.js";

function renderTree(items, props = {}) {
    return renderToStaticMarkup(createElement(Tree, {
        label: "작업 파일", items, ...props,
    }));
}

test("an expanded unloaded folder exposes a named pending branch", () => {
    const markup = renderTree([
        { id: "remote", label: "Remote", childState: "unloaded" },
    ], { defaultExpandedIds: ["remote"], onLoadChildren: () => {} });

    assert.match(markup, /role="treeitem"[^>]*aria-label="Remote"/);
    assert.match(markup, /aria-expanded="true"/);
    assert.match(markup, /aria-level="1"[^>]*aria-posinset="1"/);
    assert.match(markup, /aria-describedby="[^"]+-status-0"/);
    assert.match(markup, /role="status"[^>]*>항목 불러오기를 요청합니다/);
    assert.match(markup, /role="group"/);
});

test("loading and error remain distinct while a loaded child is navigable", () => {
    const load = () => {};
    const loading = renderTree([
        { id: "remote", label: "Remote", childState: "loading" },
    ], { defaultExpandedIds: ["remote"], onLoadChildren: load });
    assert.match(loading, /aria-busy="true"/);
    assert.match(loading, /항목을 불러오는 중입니다/);

    const error = renderTree([
        { id: "remote", label: "Remote", childState: "error",
            errorMessage: "파일 목록 오류" },
    ], { defaultExpandedIds: ["remote"], onLoadChildren: load });
    assert.match(error, /role="alert"[^>]*>파일 목록 오류/);
    assert.match(error, /오른쪽 화살표로 다시 시도합니다/);

    const loaded = renderTree([
        { id: "remote", label: "Remote", children: [
            { id: "report", label: "Report.csv" },
        ] },
    ], { defaultExpandedIds: ["remote"] });
    assert.match(loaded, /aria-level="2"[^>]*aria-posinset="1"/);
    assert.match(loaded, /aria-label="Report.csv"/);
    assert.doesNotMatch(loaded, /aria-busy/);
});

test("ambiguous and invalid load states fail before rendering", () => {
    const unloaded = { id: "remote", label: "Remote",
        childState: "unloaded" };
    assert.throws(() => renderTree([unloaded]), /invalid load state/);
    assert.throws(() => renderTree([
        { ...unloaded, children: [] },
    ], { onLoadChildren: () => {} }), /invalid load state/);
    assert.throws(() => renderTree([
        { ...unloaded, childState: "error", errorMessage: " " },
    ], { onLoadChildren: () => {} }), /invalid load state/);
    assert.throws(() => renderTree([
        { ...unloaded, childState: "complete" },
    ], { onLoadChildren: () => {} }), /invalid load state/);
});
