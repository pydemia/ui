import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PrismExperienceEvidence, PrismLeadershipReasons, PrismPositionMatrix, PrismScoreEssay } from "../dist/index.js";

const render = (Component, props) => new JSDOM(renderToStaticMarkup(h(Component, props))).window.document;

test("an empty experience list gives a readable result instead of an empty outline", () => {
    const document = render(PrismExperienceEvidence, { title: "관련 성공경험", items: [] });
    assert.equal(document.querySelectorAll(".prism-experience-evidence article").length, 0);
    assert.match(document.querySelector(".prism-experience-evidence").textContent, /관련 데이터 없음/);
});

test("leadership always shows its three source roles and distinguishes a missing answer", () => {
    const document = render(PrismLeadershipReasons, { title: "함께 일하고 싶은 이유", items: [{ id: "boss", role: "상사", text: "  가상 의견  " }] });
    assert.deepEqual([...document.querySelectorAll("dt")].map(node => node.textContent), ["상사", "동료", "구성원"]);
    assert.deepEqual([...document.querySelectorAll("dd")].map(node => node.textContent), ["  가상 의견  ", "응답 내용이 없습니다.", "응답 내용이 없습니다."]);
    const custom = render(PrismLeadershipReasons, { title: "근거", roles: ["멘토"], items: [{ id: "mentor", role: "멘토", text: null }] });
    assert.deepEqual([...custom.querySelectorAll("dt")].map(node => node.textContent), ["멘토"]);
});

test("a real zero score and the supplied matrix position remain explicit", () => {
    const score = render(PrismScoreEssay, { title: "역량", items: [{ id: "a", name: "문제 해결", score: 0, max: 10, description: null }] });
    assert.match(score.querySelector(".prism-score-essays strong").textContent, /^0\s*\/\s*10$/);
    const matrix = render(PrismPositionMatrix, { rowAxisLabel: "회사", rows: [{ id: "one", label: "가상 회사" }], columns: [{ id: "tech", label: "기술" }, { id: "finance", label: "재무" }], current: { row: "one", column: "finance" } });
    assert.equal(matrix.querySelectorAll("td[data-current]").length, 1);
    assert.equal(matrix.querySelector("td[data-current]").cellIndex, 2);
});
