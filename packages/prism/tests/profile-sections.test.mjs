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
const { createElement: h, act } = await import("react");
const { createRoot } = await import("react-dom/client");
const { renderToStaticMarkup } = await import("react-dom/server");
const { PrismSuccessExperienceSection, PrismDesignSection, PrismExpertiseSection, PrismAgilitySection, PrismTotalSection, PrismCompensationGrid, PrismLeadershipTrend } = await import("../dist/index.js");
const root = createRoot(document.getElementById("root"));
afterEach(async () => { await act(async () => root.render(null)); });

const experience = {
    summary: { title: "가상 성과", description: "합성 요약" }, topics: ["전환", "성장"],
    essays: [
        { id: "other", topic: "성장", title: "성장 사례", description: "두 번째 영역" },
        { id: "ordinary", topic: "전환", title: "일반 사례", description: "후순위" },
        { id: "representative", topic: "전환", representative: true, title: "대표 사례", description: "우선 표시", keywords: ["협업"], aiInterview: "합성 면담 근거" },
    ], failures: [{ id: "failure", title: "실패 원인", description: "후속 조치" }],
};
test("success experience selects the representative topic, keeps essay evidence and changes only the visible topic", async () => {
    await act(async () => root.render(h(PrismSuccessExperienceSection, experience)));
    const essayList = document.querySelector(".prism-success-essay-list");
    assert.match(essayList.textContent, /대표 사례/); assert.match(essayList.textContent, /합성 면담 근거/);
    assert.ok(essayList.textContent.indexOf("대표 사례") < essayList.textContent.indexOf("일반 사례"));
    assert.equal(document.querySelector('[aria-label="경험 영역 선택"] [aria-pressed="true"]').textContent.includes("전환"), true);
    await act(async () => document.querySelector('[aria-label="경험 영역 선택"] button:last-child').click());
    assert.equal(document.querySelector('[aria-label="경험 영역 선택"] [aria-pressed="true"]').textContent, "성장");
    assert.match(document.querySelector(".prism-success-essay-list").textContent, /성장 사례/);
    assert.doesNotMatch(document.querySelector(".prism-success-essay-list").textContent, /대표 사례/);
    assert.match(document.body.textContent, /실패 원인.*후속 조치/);
});

test("controlled topic selection emits an intent without replacing the owner's selection", async () => {
    let next;
    await act(async () => root.render(h(PrismSuccessExperienceSection, { ...experience, activeTopic: "전환", onTopicChange: value => next = value })));
    await act(async () => document.querySelector('[aria-label="경험 영역 선택"] button:last-child').click());
    assert.equal(next, "성장");
    assert.match(document.querySelector(".prism-success-essay-list").textContent, /대표 사례/);
});

test("source profile recipes retain survey zero and distinct Design essay and diversity position", () => {
    const survey = { items: [{ id: "score", category: "협업", bars: [{ role: "boss", value: 0, average: 6.1 }, { role: "peer", value: null, average: null }] }] };
    const expertise = new JSDOM(renderToStaticMarkup(h(PrismExpertiseSection, { summary: { heading: "전문성" }, fields: { items: [] }, survey }))).window.document;
    assert.equal(expertise.querySelector(".prism-survey-bar strong").textContent, "0.0");
    assert.equal(expertise.querySelector(".prism-survey-grid").getAttribute("data-columns"), "2");
    assert.equal(expertise.querySelectorAll(".prism-validation-list").length, 0);
    const design = new JSDOM(renderToStaticMarkup(h(PrismDesignSection, { grade: { grade: "A", summary: "합성 요약" }, essay: { title: "Design 역량 Essay", items: [{ id: "essay", name: "전략", score: 0, max: 10, description: "합성 근거" }] }, survey,
        diversity: { companies: ["가상전자", "예시사업"], functions: ["전략"], matrix: { rowAxisLabel: "회사", columns: [{ key: "one", label: "Function 1" }], rows: [{ key: "two", label: "2" }], currentPosition: { rowKey: "two", columnKey: "one" } } } }))).window.document;
    assert.match(design.querySelector(".prism-score-essays").textContent, /전략0 \/ 10/);
    assert.equal(design.querySelectorAll(".prism-survey").length, 1);
    assert.equal(design.querySelector(".prism-design-diversity-summary dt").textContent, "회사 2개");
    assert.equal(design.querySelectorAll("td[data-current]").length, 1);
    const agility = new JSDOM(renderToStaticMarkup(h(PrismAgilitySection, { grade: { grade: "B", summary: "합성 요약" }, essay: { title: "Learning Agility Essay", items: [] }, survey, experience: { title: "관련 성공경험", items: [] } }))).window.document;
    assert.equal(agility.querySelectorAll(".prism-survey").length, 1);
    assert.equal(agility.querySelector(".prism-survey-grid").getAttribute("data-columns"), "2");
});

test("empty compensation keeps the supplied years and source row structure without inventing year values", () => {
    const doc = new JSDOM(renderToStaticMarkup(h(PrismCompensationGrid, { years: ["24년", "25년"], rows: [] }))).window.document;
    assert.deepEqual([...doc.querySelectorAll("thead th")].map(node => node.textContent), ["구분", "24년", "25년"]);
    assert.deepEqual([...doc.querySelectorAll("tbody th")].map(node => node.textContent), ["총보상", "연봉", "IB"]);
    assert.equal(doc.querySelectorAll("tbody td").length, 6);
    assert.ok([...doc.querySelectorAll("tbody td")].every(node => node.textContent === "-"));
});

test("total and empty grade recipes keep one SUMMARY heading each", () => {
    const total = new JSDOM(renderToStaticMarkup(h(PrismTotalSection, { leader: { label: "가상 리더", summary: null }, basic: { items: [] }, career: { entries: [] }, compensation: { years: [], rows: [] } }))).window.document;
    assert.equal([...total.querySelectorAll("h3")].filter(node => node.textContent === "SUMMARY").length, 1);
    const grade = new JSDOM(renderToStaticMarkup(h(PrismDesignSection, { grade: { grade: null, summary: null }, essay: { title: "Design 역량 Essay", items: [] }, survey: { items: [] }, diversity: { companies: [], functions: [], matrix: { rowAxisLabel: "회사", columns: [], rows: [] } } }))).window.document;
    assert.equal([...grade.querySelectorAll("h3")].filter(node => node.textContent === "SUMMARY").length, 1);
    assert.match(grade.querySelector(".prism-summary-field").textContent, /관련 데이터 없음/);
});

test("empty leadership trend shows one message without a chart or empty table", () => {
    const doc = new JSDOM(renderToStaticMarkup(h(PrismLeadershipTrend, { chart: { title: "추이", labels: [], series: [] }, rows: [] }))).window.document;
    assert.match(doc.querySelector(".prism-leadership-trend").textContent, /관련 데이터 없음/);
    assert.equal(doc.querySelectorAll(".prism-trend, .prism-leadership-trend table").length, 0);
});
