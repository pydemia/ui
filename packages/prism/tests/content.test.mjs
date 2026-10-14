import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: "http://localhost/", pretendToBeVisual: true });
for (const key of ["window", "document", "HTMLElement", "Element", "Node", "Event", "MouseEvent"]) globalThis[key] = dom.window[key];
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createElement: h, act, useState } = await import("react");
const { createRoot } = await import("react-dom/client");
const { PrismSuggestions, PrismGenerationStatus, PrismMarkdown } = await import("../dist/index.js");

async function withRoot(run) {
    const host = document.createElement("div");
    host.dataset.prism = "light";
    document.body.append(host);
    const root = createRoot(host);
    try { await run(root, host); }
    finally { await act(async () => root.unmount()); host.remove(); }
}
async function click(element) { await act(async () => element.click()); }

test("a selected follow-up cannot send another intent, while explicit repeatable prompts can", async () => {
    await withRoot(async (root, host) => {
        const calls = [];
        const options = [{ id: "profile", label: "**프로필**\n보기" }, { id: "compare", label: "6-frame 비교" }];
        await act(async () => root.render(h(PrismSuggestions, { title: "추가 확인", options, onSelect: id => calls.push(id) })));
        const buttons = host.querySelectorAll("button");
        assert.equal(host.querySelector("button strong")?.textContent, "프로필");
        assert.equal(host.querySelector("button br") !== null, true);
        await click(buttons[0]);
        assert.deepEqual(calls, ["profile"]);
        assert.equal(buttons[0].getAttribute("aria-pressed"), "true");
        assert.equal(buttons[0].disabled, false);
        assert.equal(buttons[0].getAttribute("aria-disabled"), "true");
        assert.equal(buttons[1].disabled, true);
        await click(buttons[0]);
        await click(buttons[1]);
        assert.deepEqual(calls, ["profile"]);

        await act(async () => root.render(h(PrismSuggestions, { key: "repeatable", title: "입력 채우기", options, noLockOnSelect: true, onSelect: id => calls.push(id) })));
        const repeatButtons = host.querySelectorAll("button");
        await click(repeatButtons[0]);
        await click(repeatButtons[1]);
        assert.deepEqual(calls, ["profile", "profile", "compare"]);

        await act(async () => root.render(h(PrismSuggestions, { key: "empty-selection", title: "선택 전", options, selected: "", onSelect: id => calls.push(id) })));
        assert.equal([...host.querySelectorAll("button")].every(button => !button.disabled), true);
        await click(host.querySelector("button"));
        assert.deepEqual(calls, ["profile", "profile", "compare", "profile"]);
    });
});

test("generation stages keep a stop intent separate from the stopped display", async () => {
    await withRoot(async (root, host) => {
        let stopCalls = 0;
        function Host() {
            const [step, setStep] = useState("analyzing");
            return h(PrismGenerationStatus, { status: step, showLabel: true, onStop: () => { stopCalls++; setStep("stopped"); } });
        }
        await act(async () => root.render(h(Host)));
        assert.match(host.textContent, /요청 분석 단계/);
        assert.match(host.textContent, /요청을 분석하고 있습니다/);
        await click(host.querySelector('button[aria-label="답변 생성 중단"]'));
        assert.equal(stopCalls, 1);
        assert.match(host.textContent, /답변 생성이 중단되었습니다/);
        assert.equal(host.querySelector("button"), null);
        await act(async () => root.render(h(PrismGenerationStatus, { status: "fetching", showLabel: true })));
        assert.match(host.textContent, /관련 자료 조회 단계/);
        await act(async () => root.render(h(PrismGenerationStatus, { status: "error" })));
        assert.equal(host.querySelector('[role="alert"]') !== null, true);
    });
});

test("answer markdown preserves GFM structure without executable HTML or remote images", async () => {
    await withRoot(async (root, host) => {
        await act(async () => root.render(h(PrismMarkdown, { source: "| 항목 | 값 |\n| --- | --- |\n| A | 0 |\n\n<img src=x onerror=alert(1)>\n\n![remote](https://example.org/pic.png)" })));
        assert.equal(host.querySelectorAll("table tbody tr").length, 1);
        assert.equal(host.querySelector("img"), null);
        assert.equal(host.querySelector("[onerror]"), null);
        assert.match(host.textContent, /remote/);
    });
});
