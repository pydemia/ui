import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "http://localhost/", pretendToBeVisual: true });
for (const key of ["window", "document", "HTMLElement", "Element", "Node", "Event", "KeyboardEvent", "MouseEvent"]) globalThis[key] = dom.window[key];
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createElement: h, act } = await import("react");
const { createRoot } = await import("react-dom/client");
const { PrismChatInput, PrismTag } = await import("../dist/index.js");
const root = createRoot(document.getElementById("root"));

test("composer respects IME, shift-enter, length limits, busy and draft ownership", async () => {
    const calls = [];
    const props = { value: "  가상 질문  ", onValueChange() {}, onSubmit: text => calls.push(text) };
    await act(async () => root.render(h(PrismChatInput, props)));
    const input = document.querySelector("textarea");
    await act(async () => input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, isComposing: true })));
    assert.deepEqual(calls, []);
    await act(async () => input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true, shiftKey: true })));
    assert.deepEqual(calls, []);
    await act(async () => input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true })));
    assert.deepEqual(calls, ["가상 질문"]);
    assert.equal(input.value, props.value, "consumer owns when the draft clears");
    await act(async () => root.render(h(PrismChatInput, { ...props, maxLength: 2 })));
    assert.equal(document.querySelector('[aria-label="메시지 전송"]').disabled, true);
    await act(async () => document.querySelector("form").dispatchEvent(new Event("submit", { bubbles: true, cancelable: true })));
    assert.equal(calls.length, 1);
    let stopped = 0;
    await act(async () => root.render(h(PrismChatInput, { ...props, busy: true, onStop: () => stopped++ })));
    assert.equal(document.querySelector("textarea").disabled, true);
    await act(async () => document.querySelector('[aria-label="생성 중단"]').click());
    assert.equal(stopped, 1);
});
test("a removable condition emits only the named remove intent", async () => {
    let removed = 0;
    await act(async () => root.render(h(PrismTag, { label: "재무", onRemove: () => removed++, children: "재무" })));
    await act(async () => document.querySelector('[aria-label="재무 삭제"]').click());
    assert.equal(removed, 1);
});
test.after(async () => { await act(async () => root.unmount()); dom.window.close(); });
