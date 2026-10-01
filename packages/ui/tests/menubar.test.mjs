import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
    Menubar, MenubarMenu, MenubarTrigger,
} from "../dist/index.js";

test("menubar names the command region and exposes separate triggers", () => {
    const markup = renderToStaticMarkup(createElement(
        Menubar,
        { "aria-label": "편집기 명령" },
        createElement(MenubarMenu, null,
            createElement(MenubarTrigger, null, "파일")),
        createElement(MenubarMenu, null,
            createElement(MenubarTrigger, null, "보기")),
    ));

    assert.match(markup, /role="menubar"[^>]*aria-label="편집기 명령"/);
    assert.match(markup, /role="menuitem"[^>]*>파일<\/button>/);
    assert.match(markup, /role="menuitem"[^>]*>보기<\/button>/);
});

test("menubar rejects an empty accessible name", () => {
    assert.throws(() => renderToStaticMarkup(createElement(
        Menubar, { "aria-label": " " },
    )), /requires an accessible name/);
});
