import assert from "node:assert/strict";
import test from "node:test";
import { act } from "react";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body><div id='root'></div></body></html>", {
    url: "http://localhost/examples/profile/", pretendToBeVisual: true,
});
for (const name of [
    "window", "document", "HTMLElement", "HTMLInputElement", "Element",
    "Node", "NodeFilter", "MutationObserver", "CustomEvent", "Event",
    "DocumentFragment", "SVGElement", "KeyboardEvent", "MouseEvent",
]) globalThis[name] = dom.window[name];
globalThis.getComputedStyle = window.getComputedStyle.bind(window);
globalThis.requestAnimationFrame = window.requestAnimationFrame.bind(window);
globalThis.cancelAnimationFrame = window.cancelAnimationFrame.bind(window);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const sent = [];
const parent = { postMessage(data, origin) {
    sent.push({ data, origin, appearance: document.documentElement.dataset.appearance });
} };
Object.defineProperty(window, "parent", { configurable: true, value: parent });
const settings = {
    version: 1, design: "basic", appearance: "light", colormap: "neutral",
    overrides: { light: {}, dark: {} },
};
async function receive(data, extra = {}) {
    await act(async () => window.dispatchEvent(new window.MessageEvent("message", {
        origin: window.location.origin, source: parent, data, ...extra,
    })));
}
const modern = (revision, appearance = "light") => ({
    type: "pydemia-ui-theme", version: 1, revision,
    settings: { ...settings, appearance },
});
async function input(element, value) {
    await act(async () => {
        Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")
            .set.call(element, value);
        element.dispatchEvent(new window.Event("input", { bubbles: true }));
    });
}

test("profile invalidates after local DOM change and restores without losing work", async () => {
    try {
        await act(async () => import(
            "../../../.worknotes/browser-evidence/design-modes-docs-tests/profile-app.js"
        ));
        await act(async () => document.querySelector('[aria-label="다크 모드"]').click());
        assert.equal(sent.length, 0);
        await receive({ type: "pydemia-ui-colormap", colormap: "ocean", dark: false });
        assert.equal(document.documentElement.dataset.colormap, "ocean");
        await receive(modern(0), { origin: "https://foreign.test" });
        await receive(modern(0), { source: window });
        await receive({ ...modern(0), version: 2 });
        await receive({ ...modern(0), settings: { appearance: "dark" } });
        assert.equal(sent.length, 0);
        await receive(modern(0));
        assert.deepEqual(sent.at(-1).data, {
            type: "pydemia-ui-theme-applied", version: 1, revision: 0,
        });
        assert.equal(sent.at(-1).appearance, "light");
        const search = document.getElementById("request-search");
        const scope = document.querySelector('input:not([type="search"])');
        await input(search, "제품팀");
        await input(scope, "retained");
        await act(async () => [...document.querySelectorAll("button")]
            .find((button) => button.textContent.includes("검토 완료 표시")).click());
        assert.equal(document.querySelectorAll("tbody tr").length, 2);
        await act(async () => document.querySelector('[aria-label="다크 모드"]').click());
        assert.deepEqual(sent.at(-1).data, {
            type: "pydemia-ui-theme-invalidated", version: 1, revision: 0,
        });
        assert.equal(sent.at(-1).appearance, "dark");
        const count = sent.length;
        await receive(modern(0));
        await receive({ type: "pydemia-ui-colormap", colormap: "forest", dark: false });
        assert.equal(sent.length, count);
        assert.equal(document.documentElement.dataset.appearance, "dark");
        await receive(modern(1));
        assert.equal(sent.at(-1).appearance, "light");
        assert.equal(sent.at(-1).data.revision, 1);
        assert.equal(document.getElementById("request-search"), search);
        assert.equal(document.querySelector('input:not([type="search"])'), scope);
        assert.equal(search.value, "제품팀");
        assert.equal(scope.value, "retained");
        assert.equal(document.querySelectorAll("tbody tr").length, 2);
        assert.ok(document.body.textContent.includes("@pydemia/retained.json 검토 완료"));
        await receive(modern(0, "dark"));
        assert.equal(document.documentElement.dataset.appearance, "light");
        await act(async () => {
            for (const data of [modern(3, "dark"), modern(2)]) {
                window.dispatchEvent(new window.MessageEvent("message", {
                    origin: window.location.origin, source: parent, data,
                }));
            }
        });
        assert.equal(sent.at(-1).data.revision, 3);
        assert.equal(sent.at(-1).appearance, "dark");
        const beforeStandalone = sent.length;
        Object.defineProperty(window, "parent", { value: window });
        await act(async () => document.querySelector('[aria-label="라이트 모드"]').click());
        assert.equal(document.documentElement.dataset.appearance, "light");
        assert.equal(sent.length, beforeStandalone);
    } finally { dom.window.close(); }
});
