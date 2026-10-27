import assert from "node:assert/strict";
import test from "node:test";
import { act, createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/",
});
for (const name of ["window", "document", "HTMLElement", "Element", "Node",
    "Event", "MouseEvent", "FormData", "getComputedStyle"]) {
    globalThis[name] = dom.window[name];
}
Object.defineProperty(globalThis, "navigator", {
    configurable: true, value: dom.window.navigator,
});
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createRoot } = await import("react-dom/client");
const { ColorPicker } = await import("../dist/index.js");

async function mount(component) {
    const host = document.createElement("div");
    document.body.append(host);
    const root = createRoot(host);
    await act(async () => root.render(component));
    return { host, async render(next) {
        await act(async () => root.render(next));
    }, async dispose() {
        await act(async () => root.unmount());
        host.remove();
    } };
}

test("picker normalizes hex and submits an alpha value through a native form", async () => {
    const changes = [];
    const view = await mount(h("form", null, h(ColorPicker, {
        label: "강조색", name: "accent", defaultValue: "#BA365B80",
        swatches: ["#237F98", "#6B59BD80"],
        onValueChange: (value) => changes.push(value),
    })));
    try {
        const form = view.host.querySelector("form");
        assert.equal(new FormData(form).get("accent"), "#ba365b80");
        assert.equal(view.host.querySelectorAll('input[type="range"]').length, 4);
        assert.equal(view.host.querySelector('[data-slot="color-area"]').getAttribute("aria-hidden"), "true");
        const alpha = view.host.querySelectorAll('input[type="range"]')[3];
        const alphaHint = view.host.querySelector(`#${alpha.getAttribute("aria-describedby")}`);
        assert.match(alphaHint.textContent, /255는 완전 불투명/);
        await act(async () => view.host.querySelector('[aria-label="#237f98 선택"]').click());
        assert.deepEqual(changes, ["#237f98"]);
        assert.equal(new FormData(form).get("accent"), "#237f98");
        await act(async () => view.host.querySelector('[aria-label="#6b59bd80 선택"]').click());
        assert.equal(new FormData(form).get("accent"), "#6b59bd80");
    } finally { await view.dispose(); }
});

test("controlled picker requests a change without changing its submitted value", async () => {
    const changes = [];
    const props = {
        label: "강조색", name: "accent", value: "#123456",
        onValueChange: (value) => changes.push(value), swatches: ["#fedcba"],
    };
    const view = await mount(h("form", null, h(ColorPicker, props)));
    try {
        await act(async () => view.host.querySelector('[aria-label="#fedcba 선택"]').click());
        assert.deepEqual(changes, ["#fedcba"]);
        assert.equal(new FormData(view.host.querySelector("form")).get("accent"), "#123456");
        await view.render(h("form", null, h(ColorPicker, {
            ...props, value: "#fedcba",
        })));
        assert.equal(new FormData(view.host.querySelector("form")).get("accent"), "#fedcba");
    } finally { await view.dispose(); }
});

test("channel sliders and complete hex text update the submitted color", async () => {
    const view = await mount(h("form", null, h(ColorPicker, {
        label: "색", name: "color", defaultValue: "#ff0000",
    })));
    try {
        const form = view.host.querySelector("form");
        const ranges = view.host.querySelectorAll('input[type="range"]');
        const setter = Object.getOwnPropertyDescriptor(
            dom.window.HTMLInputElement.prototype, "value",
        ).set;
        await act(async () => {
            setter.call(ranges[3], "128");
            ranges[3].dispatchEvent(new Event("input", { bubbles: true }));
            ranges[3].dispatchEvent(new Event("change", { bubbles: true }));
        });
        assert.equal(new FormData(form).get("color"), "#ff000080");

        const hex = view.host.querySelector('input[type="text"]');
        await act(async () => {
            setter.call(hex, "#12");
            hex.dispatchEvent(new Event("input", { bubbles: true }));
        });
        assert.equal(new FormData(form).get("color"), "#ff000080");
        assert.equal(hex.getAttribute("aria-invalid"), "true");
        await act(async () => {
            setter.call(hex, "#123456");
            hex.dispatchEvent(new Event("input", { bubbles: true }));
        });
        assert.equal(new FormData(form).get("color"), "#123456");
    } finally { await view.dispose(); }
});

test("invalid values fail early and disabled or read-only pickers retain the value", () => {
    for (const invalid of ["red", "#12345", "#1234567", "#123456789"]) {
        assert.throws(() => renderToStaticMarkup(h(ColorPicker, {
            label: "색", defaultValue: invalid,
        })), RangeError);
    }
    assert.throws(() => renderToStaticMarkup(h(ColorPicker, {
        label: "색", value: "#123456",
    })), /onValueChange/);
    const disabled = renderToStaticMarkup(h(ColorPicker, {
        label: "색", name: "color", defaultValue: "#12345680",
        disabled: true, swatches: ["#abcdef"],
    }));
    assert.match(disabled, /type="hidden"[^>]*disabled=""/);
    assert.match(disabled, /value="#12345680"/);
    const readOnly = renderToStaticMarkup(h(ColorPicker, {
        label: "색", name: "color", defaultValue: "#123456", readOnly: true,
    }));
    assert.match(readOnly, /readOnly=""/);
    assert.doesNotMatch(readOnly, /스포이드/);
});

test("eyedropper is optional and cancellation or failure preserves the form value", async () => {
    const view = await mount(h("form", null, h(ColorPicker, {
        label: "색", name: "color", defaultValue: "#12345680",
    })));
    try {
        assert.equal(view.host.querySelector("button"), null);
        let failure = "AbortError";
        dom.window.EyeDropper = class {
            async open() {
                const error = new Error("screen pick failed");
                error.name = failure;
                throw error;
            }
        };
        await view.render(h("form", null, h(ColorPicker, {
            label: "색", name: "color", defaultValue: "#12345680",
        })));
        const button = view.host.querySelector("button");
        assert.equal(button.textContent, "스포이드");
        await act(async () => button.click());
        assert.equal(new FormData(view.host.querySelector("form")).get("color"),
            "#12345680");
        assert.equal(view.host.querySelector('[role="alert"]'), null);
        failure = "NotAllowedError";
        await act(async () => button.click());
        assert.equal(new FormData(view.host.querySelector("form")).get("color"),
            "#12345680");
        assert.match(view.host.querySelector('[role="alert"]').textContent,
            /선택하지 못했습니다/);
    } finally {
        delete dom.window.EyeDropper;
        await view.dispose();
    }
});
