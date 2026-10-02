import assert from "node:assert/strict";
import test from "node:test";
import { act, createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { ModelSelector } from "../dist/index.js";

const models = [
    { id: "quick", label: "빠른 응답", provider: "예시 제공자",
        description: "짧은 질문에 사용합니다.",
        capabilities: ["텍스트", "요약"], costLabel: "표준 사용량" },
    { id: "analysis", label: "문서 분석", provider: "예시 제공자",
        description: "긴 문서에 사용합니다.", costLabel: "확장 사용량" },
    { id: "image", label: "이미지 검토", provider: "예시 제공자",
        description: "이미지를 살펴봅니다.",
        disabledReason: "권한이 없습니다." },
];

function renderSelector(props = {}) {
    return renderToStaticMarkup(createElement(ModelSelector, {
        label: "응답 모델", name: "model", models,
        defaultValue: "quick", ...props,
    }));
}

test("selected model keeps a named form value and explains its use", () => {
    const markup = renderSelector();
    assert.match(markup, /<label[^>]*>응답 모델<\/label>/);
    assert.match(markup, /role="combobox"/);
    assert.match(markup, /name="model" value="quick"/);
    assert.match(markup, /짧은 질문에 사용합니다/);
    assert.match(markup, /지원 기능/);
    assert.match(markup, /사용량: 표준 사용량/);

    const compact = renderSelector({ variant: "compact" });
    assert.match(compact, /예시 제공자 · 표준 사용량/);
    assert.doesNotMatch(compact, /지원 기능/);
});

test("an unavailable selected model cannot be submitted as available", () => {
    const markup = renderSelector({ value: "image" });
    assert.match(markup, /name="model" value=""/);
    assert.match(markup, /role="alert"[^>]*>이미지 검토: 권한이 없습니다/);
    assert.doesNotMatch(markup, /이미지를 살펴봅니다/);
});

test("a loading refresh does not submit a model missing from the list", () => {
    const markup = renderSelector({ models: [], value: "quick",
        loading: true });
    assert.match(markup, /name="model" value=""/);
    assert.match(markup, /모델을 불러오는 중입니다/);
});

test("invalid metadata and unknown selections fail explicitly", () => {
    assert.throws(() => renderSelector({ label: " " }), /label/);
    assert.throws(() => renderSelector({ name: " " }), /form name/);
    assert.throws(() => renderSelector({ variant: "menu" }), /variant/);
    assert.throws(() => renderSelector({ loading: true,
        errorMessage: "연결 실패" }), /load and show an error/);
    assert.throws(() => renderSelector({ value: "missing" }), /match a model/);
    assert.throws(() => renderSelector({ models: [models[0], models[0]] }),
        /unique IDs/);
    assert.throws(() => renderSelector({ models: [
        { ...models[0], capabilities: ["텍스트", "텍스트"] },
    ] }), /valid metadata/);
    assert.throws(() => renderSelector({ models: [
        { ...models[0], disabledReason: " " },
    ] }), /valid metadata/);
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

test("selection, disabled choices, and form reset keep one model value", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    const changes = [];

    try {
        await act(async () => root.render(createElement("form", null,
            createElement(ModelSelector, {
                label: "응답 모델", name: "model", models,
                defaultValue: "quick", onValueChange: (id) => changes.push(id),
            }),
        )));
        const form = container.querySelector("form");
        const input = container.querySelector('[role="combobox"]');
        assert.equal(new dom.window.FormData(form).get("model"), "quick");

        await act(async () => input.focus());
        const options = [...container.querySelectorAll('[role="option"]')];
        await act(async () => options[2].click());
        assert.deepEqual(changes, []);
        assert.equal(new dom.window.FormData(form).get("model"), "quick");

        await act(async () => options[1].click());
        assert.deepEqual(changes, ["analysis"]);
        assert.equal(new dom.window.FormData(form).get("model"), "analysis");

        await act(async () => form.reset());
        assert.equal(new dom.window.FormData(form).get("model"), "quick");
    } finally {
        await act(async () => root.unmount());
        container.remove();
    }
});

test.after(() => dom.window.close());
