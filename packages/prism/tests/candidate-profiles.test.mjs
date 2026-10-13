import assert from "node:assert/strict";
import test, { afterEach } from "node:test";
import { JSDOM } from "jsdom";

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "http://localhost/", pretendToBeVisual: true });
for (const key of ["window", "document", "HTMLElement", "Element", "Node", "Event", "MutationObserver", "DocumentFragment"]) globalThis[key] = dom.window[key];
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createElement: h, act } = await import("react");
const { createRoot } = await import("react-dom/client");
const { PrismCandidateProfiles, PrismCandidateAssessmentTable } = await import("../dist/index.js");
const root = createRoot(document.getElementById("root"));
afterEach(async () => { await act(async () => root.render(null)); });

const people = Array.from({ length: 6 }, (_, index) => ({ id: `candidate-${index}`, name: `가상 후보 ${index + 1}`, company: "가상전자", position: "담당", rank: index + 1 }));
const render = props => act(async () => root.render(h(PrismCandidateProfiles, { candidates: people, onOpen() {}, ...props })));
const cards = () => [...document.querySelectorAll(".prism-candidate-profiles .prism-candidate-card")];
const click = selector => act(async () => { const node = document.querySelector(selector); assert.ok(node, selector); node.click(); });

test("profile answers choose card layout from total count and reveal panel rows", async () => {
    await render({ candidates: people.slice(0, 1) });
    assert.equal(document.querySelector(".prism-candidate-profiles").dataset.variant, "stack");
    await render({ candidates: people.slice(0, 2) });
    assert.equal(document.querySelector(".prism-candidate-profiles").dataset.variant, "pair");
    await render({ candidates: people, panel: true });
    assert.equal(document.querySelector(".prism-candidate-profiles").dataset.variant, "grid");
    assert.equal(cards().length, 3);
    assert.equal(document.querySelector(".prism-candidate-profiles-more").textContent, "후보자 2명 더 보기");
    await click(".prism-candidate-profiles-more"); assert.equal(cards().length, 5);
    await click(".prism-candidate-profiles-more"); assert.equal(cards().length, 6);
    assert.equal(document.querySelector(".prism-candidate-profiles-more").textContent, "후보자 접기");
    await click(".prism-candidate-profiles-more"); assert.equal(cards().length, 3);
    await render({ candidates: people.slice(1), panel: true }); assert.equal(cards().length, 3);
});

test("profile selection and bookmark intents remain separate and controlled", async () => {
    const calls = [];
    await render({ candidates: people.slice(0, 2), selectedId: people[1].id, favorites: { [people[0].id]: true },
        onOpen: candidate => calls.push(["open", candidate.id]), onFavoriteChange: (candidate, value) => calls.push(["favorite", candidate.id, value]) });
    assert.equal(cards()[1].getAttribute("data-selected"), "true");
    assert.equal(cards()[0].querySelector(".prism-favorite-toggle").getAttribute("aria-pressed"), "true");
    await click(".prism-favorite-toggle"); assert.deepEqual(calls, [["favorite", people[0].id, false]]);
    await click(".prism-candidate-open"); assert.deepEqual(calls[1], ["open", people[0].id]);
    await render({ candidates: [], onFavoriteChange: undefined });
    assert.equal(cards().length, 0);
    assert.match(document.querySelector(".prism-candidate-profiles-empty").textContent, /표시할 후보자가 없습니다/);
});

test("chat assessment table keeps supplied labels, comments and unknown results", async () => {
    const rows = [{ id: "one", frame: "전문성", content: "근거 문장", result: "적합", level: "적합" },
        { id: "two", frame: "Leadership", content: "자료 없음", result: "판단 보류", level: "판단 보류" }];
    await act(async () => root.render(h(PrismCandidateAssessmentTable, { title: "후보 평가", rows })));
    assert.equal(document.querySelectorAll("thead th").length, 3);
    assert.equal(document.querySelectorAll("tbody th[scope=row]").length, 2);
    assert.equal(document.querySelectorAll("tbody .prism-chip").length, 1);
    assert.match(document.querySelector("tbody").textContent, /판단 보류/);
    await act(async () => root.render(h(PrismCandidateAssessmentTable, { title: "후보 평가", rows, layout: "detail" })));
    assert.equal(document.querySelectorAll("thead th").length, 2);
    assert.equal(document.querySelectorAll("tbody .prism-chip").length, 1);
    assert.match(document.querySelector("tbody tr:first-child td").textContent, /적합근거 문장/);
    await act(async () => root.render(h(PrismCandidateAssessmentTable, { title: "후보 평가", rows: [], layout: "detail" })));
    assert.match(document.querySelector("tbody").textContent, /표시할 평가가 없습니다/);
});
