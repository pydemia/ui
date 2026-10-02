import assert from "node:assert/strict";
import test from "node:test";
import { act, createElement, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { FormWizard } from "../dist/index.js";

const steps = [
    { id: "name", label: "이름", content: createElement("input", {
        name: "name", required: true, defaultValue: "초안",
    }) },
    { id: "detail", label: "설명", content: createElement("textarea", {
        name: "detail", defaultValue: "검토 내용",
    }) },
];

test("wizard renders only the current step and names the form", () => {
    const html = renderToStaticMarkup(createElement(FormWizard, {
        label: "게시 절차", steps, currentIndex: 0,
        onStepChange: () => {}, onFinish: () => {},
    }));
    const page = new JSDOM(html).window.document;
    assert.equal(page.querySelector("form").getAttribute("aria-label"),
        "게시 절차");
    assert.equal(page.querySelector("ol").getAttribute("aria-label"),
        "게시 절차 단계");
    assert.equal(page.querySelector("h2").textContent, "이름");
    assert.equal(page.querySelector('input[name="name"]').required, true);
    assert.equal(page.querySelector('textarea[name="detail"]'), null);
    assert.throws(() => renderToStaticMarkup(createElement(FormWizard, {
        label: "게시 절차", steps, currentIndex: 2,
        onStepChange: () => {}, onFinish: () => {},
    })), /current step/);
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

function button(container, label) {
    return [...container.querySelectorAll("button")].find((item) =>
        item.textContent === label);
}

test("native validation gates steps and parent values survive back navigation",
    async () => {
        const container = document.createElement("div");
        document.body.append(container);
        const root = createRoot(container);
        let changeName;
        let finished;

        function Example() {
            const [index, setIndex] = useState(0);
            const [name, setName] = useState("");
            changeName = setName;
            const content = [
                { id: "name", label: "이름", content: createElement("input", {
                    name: "name", required: true, value: name,
                    onChange: (event) => setName(event.target.value),
                }) },
                steps[1],
            ];
            return createElement(FormWizard, {
                label: "게시 절차", steps: content, currentIndex: index,
                onStepChange: setIndex, onFinish: () => {
                    finished = name;
                },
            });
        }

        try {
            await act(async () => root.render(createElement(Example)));
            await act(async () => button(container, "다음").click());
            assert.equal(container.querySelector("h2").textContent, "이름");
            assert.equal(finished, undefined);

            await act(async () => changeName("검토 요청"));
            await act(async () => button(container, "다음").click());
            assert.equal(container.querySelector("h2").textContent, "설명");
            assert.equal(document.activeElement, container.querySelector("h2"));
            await act(async () => button(container, "이전").click());
            assert.equal(container.querySelector('input[name="name"]').value,
                "검토 요청");
            await act(async () => button(container, "다음").click());
            await act(async () => button(container, "완료").click());
            assert.equal(finished, "검토 요청");
        } finally {
            await act(async () => root.unmount());
            container.remove();
        }
    });

test("async validation blocks duplicate advance and reports rejection",
    async () => {
        const container = document.createElement("div");
        document.body.append(container);
        const root = createRoot(container);
        const checks = [];
        let finishCount = 0;

        function Example() {
            const [index, setIndex] = useState(0);
            return createElement(FormWizard, {
                label: "게시 절차", steps, currentIndex: index,
                onStepChange: setIndex,
                onFinish: () => { finishCount += 1; },
                validateStep: () => new Promise((resolve, reject) => {
                    checks.push({ resolve, reject });
                }),
            });
        }

        try {
            await act(async () => root.render(createElement(Example)));
            await act(async () => button(container, "다음").click());
            assert.equal(checks.length, 1);
            assert.equal(button(container, "확인 중…").disabled, true);
            await act(async () => checks[0].resolve(false));
            assert.match(container.querySelector('[role="alert"]').textContent,
                /입력 내용을 확인/);
            assert.equal(container.querySelector("h2").textContent, "이름");

            await act(async () => button(container, "다음").click());
            await act(async () => checks[1].reject(
                new Error("검증 서비스를 사용할 수 없습니다.")));
            assert.match(container.querySelector('[role="alert"]').textContent,
                /검증 서비스를 사용할 수 없습니다/);

            await act(async () => button(container, "다음").click());
            await act(async () => checks[2].resolve(true));
            assert.equal(container.querySelector("h2").textContent, "설명");
            await act(async () => button(container, "완료").click());
            assert.equal(finishCount, 1);
        } finally {
            await act(async () => root.unmount());
            container.remove();
        }
    });

test("late validation result cannot move an externally changed step",
    async () => {
        const container = document.createElement("div");
        document.body.append(container);
        const root = createRoot(container);
        let changeIndex;
        let resolveCheck;

        function Example() {
            const [index, setIndex] = useState(0);
            changeIndex = setIndex;
            return createElement(FormWizard, {
                label: "게시 절차", steps, currentIndex: index,
                onStepChange: setIndex, onFinish: () => {},
                validateStep: () => new Promise((resolve) => {
                    resolveCheck = resolve;
                }),
            });
        }

        try {
            await act(async () => root.render(createElement(Example)));
            await act(async () => button(container, "다음").click());
            await act(async () => changeIndex(1));
            await act(async () => resolveCheck(true));
            assert.equal(container.querySelector("h2").textContent, "설명");
            assert.equal(button(container, "완료").disabled, false);
        } finally {
            await act(async () => root.unmount());
            container.remove();
        }
    });

test.after(() => dom.window.close());
