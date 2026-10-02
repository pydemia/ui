import assert from "node:assert/strict";
import test from "node:test";
import { act, createElement, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { AgentStatus } from "../dist/index.js";

const stages = [
    { id: "parse", label: "요청 해석", status: "completed" },
    { id: "lookup", label: "데이터 조회", status: "running" },
    { id: "answer", label: "답변 구성", status: "pending" },
];

function render(extra = {}) {
    return renderToStaticMarkup(createElement(AgentStatus, {
        label: "분석 요청", status: "running", stages, ...extra,
    }));
}

test("run and stages keep named native progress and ordered status", () => {
    const markup = render({ onCancelTask: () => {} });
    assert.match(markup, /<section[^>]*aria-label="분석 요청"/);
    assert.match(markup, /<progress[^>]*value="1"[^>]*max="3"/);
    assert.match(markup, /aria-valuetext="1\/3단계 처리"/);
    assert.match(markup, /<ol[^>]*aria-label="분석 요청 단계"/);
    assert.equal((markup.match(/<li /g) ?? []).length, 3);
    assert.match(markup, /요청 해석/);
    assert.match(markup, /데이터 조회/);
    assert.match(markup, /답변 구성/);
    assert.match(markup, /작업 취소/);
    assert.doesNotMatch(markup, /다시 시도/);
    assert.match(render({ variant: "compact" }), /data-variant="compact"/);
});

test("terminal actions and pending action follow controlled status", () => {
    const failed = render({ status: "failed", onRetryTask: () => {},
        onCancelTask: () => {}, actionPending: true });
    assert.match(failed, /다시 시도/);
    assert.match(failed, /<button[^>]*disabled=""/);
    assert.doesNotMatch(failed, /작업 취소/);
    assert.doesNotMatch(render({ status: "completed",
        onRetryTask: () => {}, onCancelTask: () => {} }), /<button/);
});

test("invalid names, identities, stages and statuses fail clearly", () => {
    for (const props of [
        { label: " " },
        { status: "toString" },
        { variant: "unknown" },
        { stages: [] },
        { stages: [...stages, { ...stages[0] }] },
        { stages: [{ ...stages[0], status: "toString" }] },
        { stages: [{ ...stages[0], label: " " }] },
    ]) {
        assert.throws(() => render(props), /AgentStatus/);
    }
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

test("cancel and retry call the owner and update its controlled run", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    const calls = [];

    function Preview() {
        const [status, setStatus] = useState("running");
        return createElement(AgentStatus, {
            label: "분석 요청", status, stages,
            onCancelTask: () => {
                calls.push("cancel");
                setStatus("cancelled");
            },
            onRetryTask: () => {
                calls.push("retry");
                setStatus("running");
            },
        });
    }

    await act(async () => root.render(createElement(Preview)));
    await act(async () => {
        [...container.querySelectorAll("button")].find(
            (button) => button.textContent === "작업 취소",
        ).click();
    });
    assert.equal(container.querySelector("section").dataset.status,
        "cancelled");
    await act(async () => {
        [...container.querySelectorAll("button")].find(
            (button) => button.textContent === "다시 시도",
        ).click();
    });
    assert.equal(container.querySelector("section").dataset.status,
        "running");
    assert.deepEqual(calls, ["cancel", "retry"]);
    await act(async () => root.unmount());
    container.remove();
});
