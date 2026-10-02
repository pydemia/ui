import assert from "node:assert/strict";
import test from "node:test";
import { act, createElement, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/",
});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { Terminal } = await import("../dist/index.js");
const { createRoot } = await import("react-dom/client");

function markup(props = {}) {
    return renderToStaticMarkup(createElement(Terminal, {
        label: "작업 명령", lines: [], onCommand: () => {}, ...props,
    }));
}

test("terminal names its log and command form without executing code", () => {
    const view = new JSDOM(markup()).window.document;
    const section = view.querySelector("section");
    const input = section.querySelector('input[type="text"]');
    const log = section.querySelector('[role="log"]');

    assert.equal(section.getAttribute("aria-label"), "작업 명령");
    assert.equal(view.querySelector("label").htmlFor, input.id);
    assert.equal(view.querySelector("label").textContent.trim(),
        "작업 명령 입력");
    assert.equal(log.getAttribute("aria-label"), "작업 명령 출력");
    assert.equal(log.getAttribute("aria-live"), "off");
    assert.match(log.textContent, /실행 기록이 없습니다/);
    assert.match(markup({ variant: "flat", live: "polite" }),
        /data-variant="flat"/);
    assert.throws(() => markup({ label: " " }), /requires a label/);
    assert.throws(() => markup({ onCommand: null }),
        /requires onCommand/);
    assert.throws(() => markup({ lines: [
        { id: "same", kind: "command", text: "help" },
        { id: "same", kind: "output", text: "help" },
    ] }), /unique IDs/);
});

test("command submission and history use caller-owned lines", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    const sent = [];

    function Harness({ pending = false }) {
        const [lines, setLines] = useState([]);
        return createElement(Terminal, {
            label: "작업 명령", lines, pending,
            onCommand: (command) => {
                sent.push(command);
                const id = String(sent.length);
                setLines((current) => [...current,
                    { id: `${id}-command`, kind: "command",
                        text: command },
                    { id: `${id}-output`, kind: "output",
                        text: `완료: ${command}` },
                ]);
            },
        });
    }

    async function fill(input, value) {
        const setter = Object.getOwnPropertyDescriptor(
            dom.window.HTMLInputElement.prototype, "value",
        ).set;
        await act(async () => {
            setter.call(input, value);
            input.dispatchEvent(new dom.window.Event("input", {
                bubbles: true,
            }));
        });
    }

    async function key(input, name) {
        await act(async () => input.dispatchEvent(
            new dom.window.KeyboardEvent("keydown", {
                key: name, bubbles: true, cancelable: true,
            }),
        ));
    }

    try {
        await act(async () => root.render(createElement(Harness)));
        const input = container.querySelector("input");
        const button = container.querySelector('button[type="submit"]');
        assert.equal(button.disabled, true);
        await fill(input, "status");
        assert.equal(button.disabled, false);
        await act(async () => button.click());
        assert.deepEqual(sent, ["status"]);
        assert.equal(input.value, "");
        assert.match(container.querySelector('[role="log"]').textContent,
            /완료: status/);

        await fill(input, "draft");
        await key(input, "ArrowUp");
        assert.equal(input.value, "status");
        await key(input, "ArrowDown");
        assert.equal(input.value, "draft");
        await act(async () => root.render(createElement(Harness, {
            pending: true,
        })));
        assert.equal(button.disabled, true);
        assert.match(container.textContent, /실행 중/);
        await act(async () => container.querySelector("form").dispatchEvent(
            new dom.window.Event("submit", {
                bubbles: true, cancelable: true,
            }),
        ));
        assert.deepEqual(sent, ["status"]);
        assert.equal(input.value, "draft");
    } finally {
        await act(async () => root.unmount());
        container.remove();
    }
});

test.after(() => dom.window.close());
