import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PrismEmptyState, PrismToast } from "../dist/index.js";

test("toast can contain an action without invalid paragraph or nested buttons", () => {
    const html = renderToStaticMarkup(h(PrismToast, { title: "다시 시도", tone: "warning", onClose() {} },
        h("button", { type: "button" }, "목록 다시 불러오기")));
    const document = new JSDOM(html).window.document;
    const toast = document.querySelector(".prism-toast");
    assert.equal(toast.getAttribute("role"), "status");
    assert.equal(toast.querySelectorAll(".prism-toast-text > button").length, 1);
    assert.equal(toast.querySelectorAll("p button, button button").length, 0);
    assert.equal(toast.querySelectorAll(":scope > .prism-toast-close").length, 1);
    assert.equal(toast.querySelector(".prism-toast-close").getAttribute("aria-label"), "알림 닫기");
});

test("empty state accepts a source-style image URL with an accessible name", () => {
    const document = new JSDOM(renderToStaticMarkup(h(PrismEmptyState, {
        title: "검색 결과가 없습니다", icon: "/illustrations/empty.svg", variant: "tab"
    }))).window.document;
    const image = document.querySelector(".prism-empty-icon img");
    assert.equal(image.getAttribute("src"), "/illustrations/empty.svg");
    assert.equal(image.getAttribute("alt"), "검색 결과가 없습니다");
    assert.equal(image.closest('[aria-hidden="true"]'), null);
});
