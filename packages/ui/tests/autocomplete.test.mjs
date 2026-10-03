import assert from "node:assert/strict";
import test from "node:test";
import { act, createElement, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { Autocomplete } from "../dist/index.js";

const suggestions = ["운영", "디자인", "고객 지원"];

function renderAutocomplete(props = {}) {
    return renderToStaticMarkup(createElement(Autocomplete, {
        label: "담당 팀", name: "team", suggestions, ...props,
    }));
}

test("one labeled native input owns arbitrary form text", () => {
    const markup = renderAutocomplete({ defaultValue: "새 팀", required: true });
    assert.match(markup, /<label[^>]*>담당 팀<\/label>/);
    assert.match(markup, /role="combobox"/);
    assert.match(markup, /aria-autocomplete="list"/);
    assert.match(markup, /name="team"/);
    assert.match(markup, /value="새 팀"/);
    assert.match(markup, /required=""/);
    assert.doesNotMatch(markup, /type="hidden"/);
});

test("invalid values and contradictory result states fail clearly", () => {
    assert.throws(() => renderAutocomplete({ label: " " }), /visible label/);
    assert.throws(() => renderAutocomplete({ value: 3 }), /must be a string/);
    assert.throws(() => renderAutocomplete({ value: "운영" }),
        /requires onValueChange/);
    assert.throws(() => renderAutocomplete({ suggestions: ["운영", "운영"] }),
        /unique text/);
    assert.throws(() => renderAutocomplete({ suggestions: [""] }),
        /unique text/);
    assert.throws(() => renderAutocomplete({ loading: true,
        errorMessage: "검색 실패" }), /load and show an error/);
});

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/",
});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
Object.defineProperty(globalThis, "navigator", {
    configurable: true, value: dom.window.navigator,
});
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createRoot } = await import("react-dom/client");

async function type(input, text) {
    const setter = Object.getOwnPropertyDescriptor(
        dom.window.HTMLInputElement.prototype, "value",
    ).set;
    await act(async () => {
        setter.call(input, text);
        input.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
    });
}

async function press(input, key, isComposing = false) {
    let event;
    await act(async () => {
        event = new dom.window.KeyboardEvent("keydown", {
            key, isComposing, bubbles: true, cancelable: true,
        });
        input.dispatchEvent(event);
    });
    return event;
}

test("custom text, manual suggestion, IME, Escape, and reset keep form value",
    async () => {
        const container = document.createElement("div");
        document.body.append(container);
        const root = createRoot(container);
        const selected = [];
        const changes = [];

        try {
            await act(async () => root.render(createElement("form", null,
                createElement(Autocomplete, {
                    label: "담당 팀", name: "team", suggestions,
                    defaultValue: "기존 팀", onValueChange: (next) =>
                        changes.push(next),
                    onSuggestionSelect: (next) => selected.push(next),
                }),
            )));
            const form = container.querySelector("form");
            const input = container.querySelector('[role="combobox"]');
            assert.equal(new dom.window.FormData(form).get("team"), "기존 팀");

            await act(async () => input.focus());
            await type(input, "새 팀");
            assert.equal(new dom.window.FormData(form).get("team"), "새 팀");
            assert.deepEqual(selected, []);
            assert.equal((await press(input, "Enter")).defaultPrevented, false);

            await type(input, "운");
            assert.equal(container.querySelectorAll('[role="option"]').length, 1);
            await press(input, "ArrowDown");
            assert.ok(input.getAttribute("aria-activedescendant"));
            assert.equal((await press(input, "Enter", true)).defaultPrevented,
                false);
            assert.equal(new dom.window.FormData(form).get("team"), "운");
            assert.equal((await press(input, "Enter")).defaultPrevented, true);
            assert.equal(new dom.window.FormData(form).get("team"), "운영");
            assert.deepEqual(selected, ["운영"]);

            await type(input, "새 이름");
            assert.equal((await press(input, "Escape")).defaultPrevented,
                true);
            assert.equal(input.value, "새 이름");
            assert.equal(input.getAttribute("aria-expanded"), "false");

            await act(async () => form.reset());
            assert.equal(new dom.window.FormData(form).get("team"), "기존 팀");
            assert.ok(changes.includes("새 팀"));
        } finally {
            await act(async () => root.unmount());
            container.remove();
        }
    });

test("controlled values and remote loading preserve typed text", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    function Harness() {
        const [value, setValue] = useState("운");
        return createElement("form", null, createElement(Autocomplete, {
            label: "담당 팀", name: "team", suggestions,
            value, onValueChange: setValue, filterSuggestions: false,
        }));
    }

    try {
        await act(async () => root.render(createElement(Harness)));
        const input = container.querySelector('[role="combobox"]');
        const form = container.querySelector("form");
        await act(async () => input.focus());
        assert.equal(container.querySelectorAll('[role="option"]').length, 3);
        await type(input, "직접 입력");
        assert.equal(new dom.window.FormData(form).get("team"), "직접 입력");

        await act(async () => root.render(createElement("form", null,
            createElement(Autocomplete, {
                label: "담당 팀", name: "team", suggestions,
                value: "직접 입력", onValueChange: () => {}, loading: true,
            }),
        )));
        const loadingInput = container.querySelector('[role="combobox"]');
        await act(async () => loadingInput.focus());
        assert.equal(container.querySelectorAll('[role="option"]').length, 0);
        assert.match(container.textContent, /추천어를 불러오는 중/);
        assert.equal(new dom.window.FormData(container.querySelector("form"))
            .get("team"), "직접 입력");
    } finally {
        await act(async () => root.unmount());
        container.remove();
    }
});
