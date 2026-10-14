import test from "node:test";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

const dom = new JSDOM('<!doctype html><html><body><div id="root" data-prism="light"></div></body></html>', { url: "http://localhost/", pretendToBeVisual: true });
for (const key of ["window", "document", "HTMLElement", "Element", "Node", "Event", "KeyboardEvent", "MouseEvent"]) globalThis[key] = dom.window[key];
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createElement: h, act, useState } = await import("react");
const { createRoot } = await import("react-dom/client");
const { PrismChatIntro } = await import("../dist/index.js");
const root = createRoot(document.getElementById("root"));

test("intro prompt selects a controlled draft and focuses the composer without sending", async () => {
    let opened = 0, sent = 0;
    function Host() {
        const [value, setValue] = useState("");
        return h(PrismChatIntro, {
            name: "가상 사용자", cards: [{ id: "favorite", title: "후보자 즐겨찾기", description: "합성 카드", onOpen() { opened++; } }],
            questions: ["합성 질문 1", "합성 질문 2", "합성 질문 3", "합성 질문 4", "합성 질문 5", "합성 질문 6"],
            onPromptSelect: setValue, composer: { value, onValueChange: setValue, onSubmit() { sent++; } },
        });
    }
    await act(async () => root.render(h(Host)));
    assert.equal(document.querySelectorAll(".prism-intro-input section button").length, 5);
    await act(async () => document.querySelector(".prism-intro-input section button").click());
    assert.equal(document.querySelector("textarea").value, "합성 질문 1");
    assert.equal(document.activeElement, document.querySelector("textarea"));
    assert.equal(sent, 0);
    await act(async () => document.querySelector(".prism-intro-card").click());
    assert.equal(opened, 1);
    assert.equal(sent, 0);
});

test("loading replaces navigation cards with source-shaped skeletons", async () => {
    await act(async () => root.render(h(PrismChatIntro, {
        name: "가상 사용자", cards: [{ id: "favorite", title: "후보자 즐겨찾기", description: "합성 카드", onOpen() { throw new Error("card must be locked"); } }],
        questions: [], onPromptSelect() {}, loading: true,
        composer: { value: "", onValueChange() {}, onSubmit() {} },
    })));
    assert.equal(document.querySelectorAll(".prism-intro-card-skeleton .prism-skeleton").length, 3);
    assert.equal(document.querySelector(".prism-intro-cards button"), null);
    assert.equal(document.querySelector('[role="status"][aria-label="후보자 즐겨찾기 불러오는 중"]') !== null, true);
});
