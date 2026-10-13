import assert from "node:assert/strict";
import test, { afterEach } from "node:test";
import { JSDOM } from "jsdom";

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "http://localhost/", pretendToBeVisual: true });
for (const key of ["window", "document", "HTMLElement", "Element", "Node", "Event", "MutationObserver", "DocumentFragment"]) globalThis[key] = dom.window[key];
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createElement: h, act } = await import("react");
const { createRoot } = await import("react-dom/client");
const { PrismSixFrame, preparePrismSixFrameColumns } = await import("../dist/index.js");
const root = createRoot(document.getElementById("root"));
afterEach(async () => { await act(async () => root.render(null)); });

test("analysis rows map recognized frame names while preserving duplicate candidate headings", () => {
    const input = { columns: ["구분", "가상 후보", "가상 후보"], rows: [
        ["<b>리더 유형</b>", "전략형", "실행형"], ["Learning Agility (Global/AX)", "상", "중"],
        ["모르는 항목", "x", "y"], ["Derailment Risk", "위험 없음"],
    ] };
    const columns = preparePrismSixFrameColumns(input);
    assert.deepEqual(columns.map(column => column.id), ["candidate-0", "candidate-1"]);
    assert.deepEqual(columns.map(column => column.values.leaderType), ["전략형", "실행형"]);
    assert.deepEqual(columns.map(column => column.values.learningAgility), ["상", "중"]);
    assert.deepEqual(columns.map(column => column.values.derailmentRisk), ["위험 없음", null]);
    assert.equal(preparePrismSixFrameColumns({ columns: ["구분", "가상"], rows: [["알 수 없는 행", "값"]] }), null);
});

test("rich cells render safe actions in chat and labels in the panel", async () => {
    const columns = [{ id: "a", label: "**가상 후보**", values: {
        leaderType: "[프로필 보기](profile://demo-a)", expertise: "<bold>기술 전략</bold>",
        successExperience: null, designCapability: 0, learningAgility: "", derailmentRisk: "<script>bad()</script>안전",
    } }];
    const actions = [];
    await act(async () => root.render(h(PrismSixFrame, { columns, onAction: (kind, id) => actions.push([kind, id]) })));
    assert.equal(document.querySelectorAll("tbody tr").length, 6);
    assert.equal(document.querySelectorAll('th[scope="rowgroup"]').length, 3);
    assert.equal(document.querySelector("thead th:last-child strong").textContent, "가상 후보");
    const button = document.querySelector("tbody .prism-rich-action");
    assert.ok(button); await act(async () => button.click());
    assert.deepEqual(actions, [["profile", "demo-a"]]);
    assert.match(document.querySelector("tbody").textContent, /정보 없음/);
    assert.match(document.querySelector("tbody").textContent, /0/);
    assert.match(document.querySelector("tbody").textContent, /-/);
    assert.equal(document.querySelector("tbody script"), null);

    await act(async () => root.render(h(PrismSixFrame, { columns, panel: true, title: "", onAction: (kind, id) => actions.push([kind, id]) })));
    assert.equal(document.querySelector(".prism-six-frame h2"), null);
    assert.equal(document.querySelector(".prism-six-scroll").getAttribute("aria-label"), "6-frame 비교");
    assert.equal(document.querySelector("tbody .prism-rich-action"), null);
    assert.match(document.querySelector("tbody").textContent, /프로필 보기/);
});
