import assert from "node:assert/strict";
import test, { afterEach } from "node:test";
import { JSDOM } from "jsdom";

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "http://localhost/", pretendToBeVisual: true });
for (const key of ["window", "document", "HTMLElement", "Element", "Node", "Event", "KeyboardEvent", "MouseEvent", "MutationObserver", "HTMLInputElement", "HTMLFormElement", "DocumentFragment", "CustomEvent", "NodeFilter"]) globalThis[key] = dom.window[key];
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
globalThis.getComputedStyle = dom.window.getComputedStyle;
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createElement: h, act, useState } = await import("react");
const { createRoot } = await import("react-dom/client");
const { renderToStaticMarkup } = await import("react-dom/server");
const { PrismProfilePanel, PrismMemoPanel, PrismChatPanel, PrismMemoLeaveDialog, PrismPositionDetail, PrismProfile, prismPositionFootnote } = await import("../dist/index.js");
const root = createRoot(document.getElementById("root"));
afterEach(async () => { await act(async () => root.render(null)); });
const click = async label => {
    const button = [...document.querySelectorAll("button")].find(node => node.getAttribute("aria-label") === label || node.textContent === label);
    assert.ok(button, `Missing button: ${label}`);
    await act(async () => button.click());
};
const profile = showMemo => h("button", { type: "button", onClick: showMemo }, "메모 보기");
const memo = h("label", null, "메모 초안", h("textarea", { defaultValue: "보존할 초안" }));
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };

test("denied back/close preserves memo draft and expanded panel; one request is pending at a time", async () => {
    const first = deferred(); let calls = 0, currentIntent, context, opens = [];
    await act(async () => root.render(h(PrismProfilePanel, { open: true, subjectId: "a", expanded: true, onOpenChange: value => opens.push(value),
        profile, memo, beforeLeave: (intent, next) => { calls++; currentIntent = intent; context = next; return first.promise; } })));
    await click("메모 보기"); await click("패널 닫기");
    await click("패널 닫기");
    await act(async () => document.querySelector("aside").dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
    assert.equal(calls, 1); assert.equal(currentIntent, "close"); assert.equal(context.subjectId, "a"); assert.equal(context.signal.aborted, false);
    assert.ok(document.querySelector("aside[data-expanded]")); assert.equal(document.querySelector('[aria-label="뒤로"]').disabled, true);
    await act(async () => first.resolve(false));
    assert.deepEqual(opens, []); assert.ok(document.querySelector("aside[data-expanded]"));
    assert.equal(document.querySelector("textarea").value, "보존할 초안"); assert.equal(document.querySelector(".prism-profile-panel-memo").hidden, false);
    await click("뒤로"); assert.equal(currentIntent, "back"); assert.equal(calls, 2);
    assert.equal(document.querySelector(".prism-profile-panel-memo").hidden, false);
});

test("accepted back retains mounted memo and accepted close resets expansion only after host commits", async () => {
    function Host() {
        const [open, setOpen] = useState(true), [expanded, setExpanded] = useState(true);
        return h("div", null, h("button", { onClick: () => setOpen(true) }, "다시 열기"), h(PrismProfilePanel, { open, onOpenChange: setOpen, expanded, onExpandedChange: setExpanded, subjectId: "a", profile, memo, beforeLeave: () => true }));
    }
    await act(async () => root.render(h(Host)));
    await click("메모 보기"); document.querySelector("textarea").value = "직접 수정한 초안";
    await click("뒤로"); assert.equal(document.querySelector(".prism-profile-panel-memo").hidden, true);
    await click("메모 보기"); assert.equal(document.querySelector("textarea").value, "직접 수정한 초안");
    await click("패널 닫기"); assert.equal(document.querySelector("aside").getAttribute("aria-hidden"), "true");
    await click("다시 열기"); assert.equal(document.querySelector("aside").hasAttribute("data-expanded"), false);
    assert.match(document.querySelector(".prism-panel-title").textContent, /프로필 정보/);
    await click("메모 보기"); assert.equal(document.querySelector("textarea").value, "직접 수정한 초안");
});

test("subject change aborts old leave request and cannot close or reveal another subject's memo", async () => {
    const decision = deferred(); let context, closes = 0;
    const props = { open: true, onOpenChange: () => closes++, profile, beforeLeave: (_, next) => { context = next; return decision.promise; } };
    await act(async () => root.render(h(PrismProfilePanel, { ...props, subjectId: "a", memo: h("textarea", { defaultValue: "A 초안" }) })));
    await click("메모 보기"); await click("패널 닫기");
    await act(async () => root.render(h(PrismProfilePanel, { ...props, subjectId: "b", memo: h("textarea", { defaultValue: "B 초안" }) })));
    assert.equal(context.signal.aborted, true);
    await act(async () => decision.resolve(true)); assert.equal(closes, 0);
    assert.equal(document.querySelector(".prism-profile-panel-memo").hidden, true);
    await click("메모 보기"); assert.equal(document.querySelector("textarea").value, "B 초안");
    await act(async () => root.render(h(PrismProfilePanel, { ...props, subjectId: "a", memo: h("textarea", { defaultValue: "A 새 초안" }) })));
    assert.equal(document.querySelector(".prism-profile-panel-memo").hidden, true);
});

test("guard rejection surfaces an error, allows retry, and external close/unmount cancels pending work", async () => {
    const failure = new Error("host confirmation failed"), next = deferred(); let calls = 0, context, reported;
    const props = { open: true, onOpenChange() {}, subjectId: "a", beforeLeave: (_, value) => { context = value; return ++calls === 1 ? Promise.reject(failure) : next.promise; }, onLeaveError: cause => reported = cause, children: memo };
    await act(async () => root.render(h(PrismMemoPanel, props))); await click("패널 닫기");
    assert.equal(reported, failure); assert.match(document.querySelector('[role="alert"]').textContent, /확인하지 못했습니다/);
    await click("패널 닫기"); assert.equal(calls, 2); assert.equal(document.querySelector('[role="alert"]'), null);
    await act(async () => root.render(h(PrismMemoPanel, { ...props, open: false }))); assert.equal(context.signal.aborted, true);
    await act(async () => next.resolve(true));
    const last = deferred();
    await act(async () => root.render(h(PrismMemoPanel, { ...props, open: true, beforeLeave: (_, value) => { context = value; return last.promise; } })));
    await click("패널 닫기"); await act(async () => root.render(null)); assert.equal(context.signal.aborted, true);
    await act(async () => last.resolve(true));
});

test("chat close unmounts content and bottom action is owned by the host", async () => {
    let bottoms = 0;
    const props = { open: true, onOpenChange() {}, messages: h("p", null, "가상 대화"), composer: h("textarea", { defaultValue: "초기 질문" }), atBottom: false, onScrollToBottom: () => bottoms++ };
    await act(async () => root.render(h(PrismChatPanel, props))); await click("대화 아래로 이동"); assert.equal(bottoms, 1);
    document.querySelector("textarea").value = "수정한 질문";
    await act(async () => root.render(h(PrismChatPanel, { ...props, open: false }))); assert.equal(document.querySelector("textarea"), null);
    await act(async () => root.render(h(PrismChatPanel, { ...props, open: true, atBottom: true })));
    assert.equal(document.querySelector("textarea").value, "초기 질문"); assert.equal(document.querySelector('[aria-label="대화 아래로 이동"]'), null);
});

test("profile memo action propagates through the full profile instead of only its header primitive", async () => {
    let requests = 0;
    await act(async () => root.render(h(PrismProfile, { candidate: { id: "a", name: "가상 후보", company: "가상 회사", position: "가상 직무" }, activeTab: "total", onTabChange() {}, sections: {}, onComments: () => requests++, commentCount: 2 })));
    await click("메모 2"); assert.equal(requests, 1);
});

test("source leave dialog cancel and Escape retain memo; confirm commits the host close", async () => {
    function Host() {
        const [open, setOpen] = useState(true), [confirm, setConfirm] = useState(false);
        const resolve = useState(() => ({ current: null }))[0];
        return h("div", null, h(PrismMemoPanel, { open, onOpenChange: setOpen, subjectId: "a", children: memo,
            beforeLeave: () => new Promise(decide => { resolve.current = allowed => { resolve.current = null; setConfirm(false); decide(allowed); }; setConfirm(true); }) }),
            h(PrismMemoLeaveDialog, { open: confirm, onOpenChange: next => { if (!next) resolve.current?.(false); }, onConfirm: () => resolve.current?.(true) }));
    }
    await act(async () => root.render(h(Host))); await click("패널 닫기");
    assert.match(document.querySelector('[role="dialog"]').textContent, /메모 작성 중/);
    await click("계속 작성"); assert.equal(document.querySelector('[role="dialog"]'), null);
    assert.equal(document.querySelector("aside").getAttribute("aria-hidden"), null); assert.equal(document.querySelector("textarea").value, "보존할 초안");
    await click("패널 닫기");
    await act(async () => document.activeElement.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true })));
    assert.equal(document.querySelector('[role="dialog"]'), null); assert.equal(document.querySelector("aside").getAttribute("aria-hidden"), null);
    await click("패널 닫기"); await click("나가기");
    assert.equal(document.querySelector('[role="dialog"]'), null); assert.equal(document.querySelector("aside").getAttribute("aria-hidden"), "true");
});

test("position renders definition, business context, two missing groups and source footnote without interpreting host text", () => {
    const doc = new JSDOM(renderToStaticMarkup(h(PrismPositionDetail, { company: "가상 회사", role: "기술전략", items: [], definition: "<script>host text</script>\n두 번째 줄", businessContext: " \n ", groups: [] }))).window.document;
    assert.deepEqual([...doc.querySelectorAll(".prism-position-section>h3")].map(node => node.textContent), ["포지션 정의", "Business Context", "전문성・성공경험 요구사항"]);
    assert.equal(doc.querySelectorAll("script").length, 0); assert.match(doc.querySelector(".prism-position-summary").textContent, /<script>host text<\/script>/);
    assert.equal(doc.querySelectorAll(".prism-no-data").length, 3);
    assert.deepEqual([...doc.querySelectorAll(".prism-requirement h3")].map(node => node.textContent), ["전문성", "성공경험"]);
    assert.equal(doc.querySelector(".prism-position-footnote").textContent, prismPositionFootnote);
});

test("position loading/error hide stale detail and error retry reaches host", async () => {
    let retries = 0;
    const props = { company: "STALE company", role: "STALE role", items: [], definition: "STALE definition", businessContext: "STALE context", groups: [], onRetry: () => retries++ };
    await act(async () => root.render(h(PrismPositionDetail, { ...props, status: "loading" })));
    assert.doesNotMatch(document.getElementById("root").textContent, /STALE/); assert.equal(document.querySelector('[role="status"]').getAttribute("aria-label"), "포지션 정보를 불러오고 있습니다.");
    await act(async () => root.render(h(PrismPositionDetail, { ...props, status: "error" })));
    assert.doesNotMatch(document.getElementById("root").textContent, /STALE/); await click("다시 시도"); assert.equal(retries, 1);
});
