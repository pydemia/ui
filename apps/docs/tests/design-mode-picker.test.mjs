import assert from "node:assert/strict";
import test from "node:test";
import { act, createElement as h } from "react";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/", pretendToBeVisual: true,
});
for (const name of [
    "window", "document", "HTMLElement", "HTMLInputElement", "Element",
    "Node", "NodeFilter", "MutationObserver", "CustomEvent", "Event",
    "HTMLSelectElement", "HTMLFormElement", "HTMLButtonElement",
    "DocumentFragment", "SVGElement", "KeyboardEvent", "MouseEvent",
]) globalThis[name] = dom.window[name];
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
let narrow = false;
window.matchMedia = () => ({
    matches: narrow, addEventListener() {}, removeEventListener() {},
});
const { createRoot } = await import("react-dom/client");
const { defaultThemeSettings, designModes } = await import("@pydemia/ui");
const { DesignModePicker } = await import(
    "../../../.worknotes/browser-evidence/design-modes-docs-tests/design-mode-picker.js"
);

async function mount({ allowUnreleased = false, mobile = false } = {}) {
    narrow = mobile;
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    const commits = [];
    await act(async () => root.render(h(DesignModePicker, {
        settings: defaultThemeSettings, allowUnreleased,
        onCommit: (value) => commits.push(value),
    })));
    const trigger = container.querySelector("button");
    await act(async () => trigger.click());
    return {
        commits, trigger,
        async close() {
            await act(async () => root.unmount());
            container.remove();
        },
    };
}

const option = (name) => [...document.querySelectorAll(".design-mode-option")]
    .find((element) => element.textContent.includes(name));
async function key(element, value) {
    await act(async () => element.dispatchEvent(new KeyboardEvent("keydown", {
        key: value, bubbles: true, cancelable: true,
    })));
}

test("all manifest modes are visible; candidate navigation cancels without applying", async () => {
    const view = await mount();
    try {
        assert.equal(document.querySelectorAll(".design-mode-option").length, designModes.length);
        const search = document.querySelector('[aria-label="Search design modes"]');
        assert.equal(document.activeElement, search);
        await key(search, "ArrowDown");
        await key(document.activeElement, "End");
        assert.equal(view.commits.length, 0);
        assert.ok(document.activeElement.classList.contains("design-mode-option"));
        await key(document.activeElement, "Escape");
        assert.equal(document.querySelector(".design-mode-picker"), null);
        assert.equal(document.activeElement, view.trigger);
        assert.equal(view.commits.length, 0);
    } finally { await view.close(); }
});

test("production picker commits released modes and separates any prepared modes", async () => {
    const mode = designModes.find((item) => item.releaseStatus !== "released");
    for (const released of designModes.filter((item) => item.releaseStatus === "released")) {
        const view = await mount();
        try {
            assert.equal(option(released.name).getAttribute("aria-disabled"), "false");
            assert.equal(option(released.name).closest('[data-prepared="true"]'), null);
            await act(async () => option(released.name).click());
            assert.deepEqual(view.commits, [released.id]);
        } finally { await view.close(); }
    }
    if (!mode) return;
    const view = await mount();
    try {
        await act(async () => option(mode.name).click());
        assert.ok(option(mode.name).closest('[data-prepared="true"]'));
        assert.match(option(mode.name).closest("section").getAttribute("aria-label"), /^준비 중 · /);
        assert.equal(option("Basic").closest('[data-prepared="true"]'), null);
        assert.equal(view.commits.length, 0);
        assert.equal(document.querySelector(".design-mode-detail-heading h3").textContent, mode.name);
        assert.ok(document.querySelector(".design-mode-picker-footer button").disabled);
        assert.ok(document.querySelector(".design-mode-preview table"));
        assert.ok(document.querySelector('.design-mode-preview input[aria-invalid="true"]'));
    } finally { await view.close(); }
});

test("desktop click commits an allowed mode; narrow tap requires Apply", async () => {
    const mode = designModes.find((item) => item.id !== "basic");
    const desktop = await mount({ allowUnreleased: true });
    try {
        await act(async () => option(mode.name).click());
        assert.deepEqual(desktop.commits, [mode.id]);
        assert.equal(document.querySelector(".design-mode-picker"), null);
        assert.equal(document.activeElement, desktop.trigger);
    } finally { await desktop.close(); }
    const mobile = await mount({ allowUnreleased: true, mobile: true });
    try {
        await act(async () => option(mode.name).click());
        assert.deepEqual(mobile.commits, []);
        await act(async () => document.querySelector(".design-mode-picker-footer button").click());
        assert.deepEqual(mobile.commits, [mode.id]);
    } finally { await mobile.close(); }
});

test("candidate changes preserve preview DOM, local edits and selection", async () => {
    const view = await mount({ mobile: true });
    try {
        const field = document.querySelector('.design-mode-preview input:not([aria-invalid])');
        const table = document.querySelector(".design-mode-preview table");
        field.value = "Keep this edit";
        const selection = document.querySelectorAll('.design-mode-preview input[type="radio"]')[1];
        await act(async () => selection.click());
        const mode = designModes.find((item) => item.id !== "basic");
        await act(async () => option(mode.name).click());
        assert.equal(document.querySelector('.design-mode-preview input:not([aria-invalid])'), field);
        assert.equal(field.value, "Keep this edit");
        assert.equal(document.querySelector(".design-mode-preview table"), table);
        assert.ok(selection.checked);
        assert.deepEqual(view.commits, []);
    } finally { await view.close(); }
});

test("search filters candidates and announces an empty result", async () => {
    const view = await mount();
    try {
        const search = document.querySelector('[aria-label="Search design modes"]');
        const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
        await act(async () => {
            setValue.call(search, "not-a-real-design-name");
            search.dispatchEvent(new Event("input", { bubbles: true }));
        });
        assert.equal(document.querySelectorAll(".design-mode-option").length, 0);
        assert.ok(document.querySelector(".design-mode-empty"));
        await key(search, "ArrowDown");
        assert.equal(view.commits.length, 0);
    } finally { await view.close(); }
});
