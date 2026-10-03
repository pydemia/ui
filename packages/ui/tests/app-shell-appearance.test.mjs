import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AppBottomPanel, AppSidebar } from "../dist/index.js";

test("AppShell panels keep attached as the default", () => {
    const sidebar = renderToStaticMarkup(createElement(AppSidebar, {
        "aria-label": "상세 정보", side: "right", children: "세부 내용",
    }));
    const bottom = renderToStaticMarkup(createElement(AppBottomPanel, {
        "aria-label": "작업 상태", children: "저장됨",
    }));

    assert.match(sidebar, /data-appearance="attached"/);
    assert.match(sidebar, /@3xl:border-l/);
    assert.match(bottom, /data-appearance="attached"/);
    assert.match(bottom, /border-t border-border/);
});

test("AppShell panels expose a distinct inset appearance", () => {
    for (const Panel of [AppSidebar, AppBottomPanel]) {
        const markup = renderToStaticMarkup(createElement(Panel, {
            "aria-label": "작업 정보", appearance: "inset", children: "내용",
        }));
        assert.match(markup, /data-appearance="inset"/);
        assert.match(markup, /m-\[var\(--space-3\)\]/);
        assert.match(markup, /shadow-\[var\(--shadow-float\)\]/);
        assert.match(markup, /aria-label="작업 정보"/);
        assert.doesNotMatch(markup, /@3xl:border-r|border-t border-border/);
    }
});

test("AppShell panels reject unsupported appearances", () => {
    for (const Panel of [AppSidebar, AppBottomPanel]) {
        assert.throws(() => renderToStaticMarkup(createElement(Panel, {
            "aria-label": "작업 정보", appearance: "glass",
        })), /appearance is not supported/);
    }
});
