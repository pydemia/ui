import assert from "node:assert/strict";
import test from "node:test";
import { act, createElement, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { ResultState } from "../dist/index.js";

function render(props = {}) {
    return renderToStaticMarkup(createElement(ResultState, {
        status: "pending", title: "자료를 저장하는 중입니다",
        ...props,
    }));
}

test("each result has visible status and a named live region", () => {
    const pending = render();
    assert.match(pending, /role="status"/);
    assert.match(pending, /data-status="pending"/);
    assert.match(pending, /진행 중/);
    assert.match(pending, /aria-labelledby="[^"]+ [^"]+"/);
    assert.doesNotMatch(pending, /다시 시도/);

    const success = render({ status: "success", title: "저장했습니다" });
    assert.match(success, /role="status"/);
    assert.match(success, /완료/);
    assert.doesNotMatch(success, /다시 시도/);

    const error = render({ status: "error", title: "저장 실패",
        description: "연결을 확인하세요.", onRetry: () => {} });
    assert.match(error, /role="alert"/);
    assert.match(error, /실패/);
    assert.match(error, /aria-describedby="[^"]+"/);
    assert.match(error, /type="button"[^>]*>다시 시도<\/button>/);
});

test("invalid result configuration fails clearly", () => {
    assert.throws(() => render({ status: "idle" }), RangeError);
    assert.throws(() => render({ title: " " }), /requires a title/);
    assert.throws(() => render({ appearance: "dashed" }), RangeError);
    assert.throws(() => render({ onRetry: true }), TypeError);
    assert.throws(() => render({ status: "error", onRetry: () => {},
        retryLabel: " " }), /retryLabel/);
});

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/",
});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: dom.window.navigator,
});
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createRoot } = await import("react-dom/client");

test("retry asks the caller to change the controlled result", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    let calls = 0;

    function Example() {
        const [status, setStatus] = useState("error");
        return createElement(ResultState, {
            status,
            title: status === "error" ? "저장 실패" : "저장 완료",
            onRetry: () => {
                calls += 1;
                setStatus("success");
            },
        });
    }

    try {
        await act(async () => root.render(createElement(Example)));
        assert.equal(container.querySelector('[role="alert"]')
            ?.getAttribute("data-status"), "error");
        await act(async () => {
            container.querySelector("button").click();
        });
        assert.equal(calls, 1);
        assert.equal(container.querySelector('[role="status"]')
            ?.getAttribute("data-status"), "success");
        assert.equal(document.activeElement,
            container.querySelector('[role="status"]'));
        assert.equal(container.querySelector("button"), null);
    } finally {
        await act(async () => root.unmount());
        container.remove();
    }
});
