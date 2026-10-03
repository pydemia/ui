import assert from "node:assert/strict";
import test from "node:test";
import { act, createElement, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { TransferList } from "../dist/index.js";

const items = [
    { value: "mina", label: "김민아" },
    { value: "june", label: "이준" },
    { value: "sora", label: "박소라", disabled: true },
];

function render(props = {}) {
    return renderToStaticMarkup(createElement(TransferList, {
        label: "검토 담당자", items, value: ["sora"],
        onValueChange: () => {}, name: "reviewer", ...props,
    }));
}

test("native groups and selected form values are explicit", () => {
    const markup = render();
    assert.match(markup, /role="group" aria-label="검토 담당자"/);
    assert.match(markup, /<legend[^>]*>사용 가능 \(2\)<\/legend>/);
    assert.match(markup, /<legend[^>]*>배정됨 \(1\)<\/legend>/);
    assert.match(markup, /name="reviewer" value="sora"/);
    assert.match(render({ appearance: "plain" }),
        /data-appearance="plain"/);
    assert.doesNotMatch(render({ disabled: true }), /name="reviewer"/);
});

test("invalid labels, items, values and appearance fail visibly", () => {
    assert.throws(() => render({ label: " " }), /requires labels/);
    assert.throws(() => render({ items: [items[0], items[0]] }),
        /unique named items/);
    assert.throws(() => render({ value: ["unknown"] }), /unknown/);
    assert.throws(() => render({ value: ["sora", "sora"] }),
        /duplicate/);
    assert.throws(() => render({ appearance: "other" }), /unsupported/);
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

test("bulk add and remove preserve controlled order and form values",
    async () => {
        const host = document.createElement("div");
        document.body.append(host);
        const root = createRoot(host);
        const changes = [];

        function Harness() {
            const [value, setValue] = useState(["sora"]);
            return createElement("form", {}, createElement(TransferList, {
                label: "검토 담당자", items, value, name: "reviewer",
                onValueChange: (next) => {
                    changes.push(next);
                    setValue(next);
                },
            }));
        }

        try {
            await act(async () => root.render(createElement(Harness)));
            const boxes = () => host.querySelectorAll('input[type="checkbox"]');
            const button = (text) => [...host.querySelectorAll("button")]
                .find((item) => item.textContent === text);
            await act(async () => {
                boxes()[0].click();
                boxes()[1].click();
            });
            await act(async () => button("추가 →").click());
            assert.deepEqual(changes.at(-1), ["sora", "mina", "june"]);
            assert.deepEqual(new dom.window.FormData(host.querySelector("form"))
                .getAll("reviewer"), ["sora", "mina", "june"]);
            assert.equal(button("추가 →").disabled, true);

            await act(async () => boxes()[1].click());
            await act(async () => button("← 제거").click());
            assert.deepEqual(changes.at(-1), ["sora", "june"]);
            assert.deepEqual(new dom.window.FormData(host.querySelector("form"))
                .getAll("reviewer"), ["sora", "june"]);
            assert.equal(boxes()[1].disabled, true);
        } finally {
            await act(async () => root.unmount());
            host.remove();
        }
    });
