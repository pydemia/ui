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
const { PrismFavoriteProfile, PrismProfile, PrismCandidatePortrait, PrismFavoriteCandidateCard, PrismCandidateCollection,
    PrismEvaluationHistory, preparePrismEvaluationHistory, PrismProfilePrintDocument } = await import("../dist/index.js");
const root = createRoot(document.getElementById("root"));
afterEach(async () => { await act(async () => root.render(null)); });
const candidate = { id: "synthetic-a", name: "김가상", company: "가상전자", position: "기술전략담당", affiliation: "ICT 계열", jobFunction: "R&D/기술", birthDate: "1980.01", executiveYears: 0, elp: "ELP", expertAreas: ["기술", "전략"], recentEvaluations: [{ year: "2023", grade: "B" }, { year: "2025", grade: "(A)" }, { year: "2024", grade: null }] };
const click = async label => {
    const button = [...document.querySelectorAll("button")].find(node => node.getAttribute("aria-label") === label || node.textContent === label);
    assert.ok(button, `Missing button:${label}`); await act(async () => button.click());
};

test("evaluation formatting sorts available years, preserves zero/unknown labels and never mutates input or exposes sort state", () => {
    const items = [{ year: "2023", grade: " B " }, { year: "unknown year", grade: "C" }, { year: "2025", grade: "(A)" }, { year: "2024", grade: "0" }, { year: "2022", grade: "(D)", active: false }, { year: "2021", grade: null }, { year: "2020", grade: " " }];
    const before = JSON.stringify(items), values = preparePrismEvaluationHistory(items);
    assert.deepEqual(values.map(item => item.year), ["2025", "2024", "2023", "2022", "unknown year"]);
    assert.deepEqual(values.map(item => item.grade), ["A", "0", "B", "D", "C"]);
    assert.equal(values[0].active, true); assert.equal(values[3].active, false);
    assert.equal(values.some(item => "index" in item), false); assert.equal(JSON.stringify(items), before);
});

test("source history groups years and omits absent records while explicit history retains each unknown value", () => {
    const doc = new JSDOM(renderToStaticMarkup(h(PrismEvaluationHistory, { items: candidate.recentEvaluations }))).window.document;
    assert.equal(doc.querySelector(".prism-evaluation-years").textContent, "('25년/'23년)");
    assert.equal(doc.querySelectorAll(".prism-evaluation-badge").length, 2); assert.match(doc.querySelector('[data-active]').textContent, /2025 평가 A/);
    assert.equal(renderToStaticMarkup(h(PrismEvaluationHistory, { items: [{ year: "2024", grade: null }] })), "");
    const explicit = renderToStaticMarkup(h(PrismEvaluationHistory, { items: [{ year: "2024", grade: null }], variant: "explicit" }));
    assert.match(explicit, /--/); assert.match(explicit, /2024/);
});

test("profile keeps source identity fields and separates top print/favorite from the memo action", async () => {
    let prints = 0, memos = 0;
    await act(async () => root.render(h(PrismFavoriteProfile, { candidate, onPrint: () => prints++, onComments: () => memos++, onFavoriteChange() {}, commentCount: 0 })));
    assert.equal(document.querySelector(".prism-profile-department").textContent, "ICT 계열R&D/기술");
    assert.equal(document.querySelector(".prism-profile-position").textContent, "가상전자기술전략담당");
    assert.match(document.querySelector(".prism-favorite-tags").textContent, /임원 0년차/);
    assert.ok(document.querySelector('.prism-favorite-name [aria-label="프로필 인쇄"]'));
    assert.equal(document.querySelector(".prism-favorite-actions .prism-profile-memo-button"), null);
    await click("프로필 인쇄"); await click("메모 0"); assert.equal(prints, 1); assert.equal(memos, 1);
});

test("profile controls preserve host favorite state and busy/readonly protect only their relevant actions", async () => {
    let next, prints = 0, memos = 0;
    const props = { candidate, favorite: false, onFavoriteChange: value => next = value, onPrint: () => prints++, onComments: () => memos++ };
    await act(async () => root.render(h(PrismFavoriteProfile, props))); await click("김가상 즐겨찾기");
    assert.equal(next, true); assert.equal(document.querySelector('.prism-favorite-toggle').getAttribute("aria-pressed"), "false");
    await act(async () => root.render(h(PrismFavoriteProfile, { ...props, favorite: true, readOnly: true, printBusy: true })));
    assert.equal(document.querySelector('.prism-favorite-toggle').disabled, true); await click("프로필 인쇄"); await click("메모 0"); assert.equal(prints, 0); assert.equal(memos, 1);
    await act(async () => root.render(h(PrismFavoriteProfile, { ...props, favoriteBusy: true, readOnly: false }))); assert.equal(document.querySelector('.prism-favorite-toggle').disabled, true);
});

test("loading hides stale identity and actions through the full profile and explicit empty fields override legacy aliases", async () => {
    await act(async () => root.render(h(PrismProfile, { candidate, activeTab: "total", onTabChange() {}, sections: {}, loading: true, onPrint() {}, onComments() {}, onFavoriteChange() {} })));
    assert.equal(document.querySelector('[aria-label="프로필 인쇄"]'), null); assert.equal(document.querySelector('.prism-favorite-toggle'), null);
    assert.doesNotMatch(document.querySelector('.prism-profile-skeleton').textContent, /김가상|가상전자/);
    await act(async () => root.render(h(PrismFavoriteProfile, { candidate: { ...candidate, affiliation: "", jobFunction: "", companyField: "legacy affiliation", domain: "legacy function" } })));
    assert.equal(document.querySelector('.prism-profile-department'), null);
});

test("portrait failure has an honest fallback and a new subject/source retries without accepting the old image error", async () => {
    const props = { name: "김가상", subjectId: "a", src: "https://example.invalid/a.png", fallback: "initials" };
    await act(async () => root.render(h(PrismCandidatePortrait, props))); const old = document.querySelector("img");
    await act(async () => old.dispatchEvent(new Event("error"))); assert.equal(document.querySelector("img"), null); assert.equal(document.querySelector('[role="img"]').getAttribute("aria-label"), "김가상 프로필 사진 없음");
    await act(async () => root.render(h(PrismCandidatePortrait, { ...props, subjectId: "b", name: "이예시" }))); assert.equal(document.querySelector("img").alt, "이예시 프로필");
    await act(async () => old.dispatchEvent(new Event("error"))); assert.ok(document.querySelector("img"));
    await act(async () => document.querySelector("img").dispatchEvent(new Event("error")));
    await act(async () => root.render(h(PrismCandidatePortrait, { ...props, subjectId: "b", src: "https://example.invalid/b.png" }))); assert.match(document.querySelector("img").src, /b\.png$/);
});

test("favorite card exposes sibling native actions and extra actions never open the profile", async () => {
    let opens = 0, favorites = 0, extras = 0;
    await act(async () => root.render(h(PrismFavoriteCandidateCard, { candidate, onOpen: value => { assert.equal(value, candidate); opens++; }, onFavoriteChange: next => { assert.equal(next, false); favorites++; }, children: h("button", { onClick: () => extras++ }, "추가 동작") })));
    assert.equal(document.querySelectorAll('button button,[role="button"] button').length, 0);
    await click("김가상 즐겨찾기"); await click("추가 동작"); assert.equal(opens, 0); assert.equal(favorites, 1); assert.equal(extras, 1);
    await act(async () => document.querySelector('.prism-favorite-candidate-open').click()); assert.equal(opens, 1);
    assert.deepEqual([...document.querySelectorAll('.prism-favorite-candidate-expertise h3')].map(node => node.textContent), ["전문 분야", "최근 평가 이력"]);
});

test("collection favorite variant propagates controlled values and loading omits stale cards", async () => {
    let next;
    const props = { title: "즐겨찾기", candidates: [candidate], view: "cards", onViewChange() {}, onOpen() {}, cardVariant: "favorite", favorites: [candidate.id], onFavoriteChange: (item, value) => next = [item.id, value] };
    await act(async () => root.render(h(PrismCandidateCollection, props))); await click("김가상 즐겨찾기"); assert.deepEqual(next, [candidate.id, false]);
    await act(async () => root.render(h(PrismCandidateCollection, { ...props, favoriteBusyIds: [candidate.id] }))); assert.equal(document.querySelector('.prism-favorite-toggle').disabled, true);
    await act(async () => root.render(h(PrismCandidateCollection, { ...props, status: "loading" }))); assert.equal(document.querySelector('.prism-favorite-candidate-card'), null); assert.equal(document.querySelectorAll('.prism-favorite-candidate-skeleton').length, 6); assert.doesNotMatch(document.getElementById("root").textContent, /김가상/); assert.equal(document.querySelectorAll('[role="status"]').length, 1);
});

test("print profile retains source header fields and evaluation order without application action controls", () => {
    const doc = new JSDOM(renderToStaticMarkup(h(PrismProfilePrintDocument, { model: { id: "print-a", candidate, career: [] } }))).window.document;
    assert.equal(doc.querySelector('.prism-favorite-actions'), null); assert.equal(doc.querySelector('.prism-profile-memo-button'), null);
    assert.match(doc.querySelector('.prism-profile-department').textContent, /ICT 계열/); assert.equal(doc.querySelector('.prism-evaluation-years').textContent, "('25년/'23년)");
    assert.equal(doc.querySelectorAll('[data-print-section]').length, 7);
});
