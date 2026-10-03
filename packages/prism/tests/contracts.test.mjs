import assert from "node:assert/strict";
import test from "node:test";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { PrismButton, PrismInput, PrismCountBadge, PrismCandidateCard, PrismEvaluationTable, PrismRequestState, PrismRadarChart, PrismTrendChart, PrismSixFrame, PrismPagination, PrismProgress } from "../dist/index.js";

const render = (component, props) => renderToStaticMarkup(h(component, props));
test("form labels connect to separate descriptions and errors", () => {
    const doc = new JSDOM(render(PrismInput, { label: "이름", description: "후보 성명", error: "입력 필요", required: true })).window.document;
    const input = doc.querySelector("input");
    assert.equal(doc.querySelector("label").htmlFor, input.id);
    assert.equal(input.getAttribute("aria-invalid"), "true");
    assert.ok(input.required);
    const descriptions = input.getAttribute("aria-describedby").split(" ").map(id => doc.getElementById(id).textContent);
    assert.deepEqual(descriptions, ["후보 성명", "입력 필요"]);
});
test("icon-only actions must be named and buttons do not submit implicitly", () => {
    assert.throws(() => render(PrismButton, { iconOnly: true }), /accessible name/);
    const doc = new JSDOM(render(PrismButton, { children: "저장" })).window.document;
    assert.equal(doc.querySelector("button").type, "button");
});
test("insufficient assessment evidence and real zero remain different", () => {
    const doc = new JSDOM(render(PrismEvaluationTable, { assessments: [
        { id: "missing", area: "리더십", score: null, evidence: "자료 없음" },
        { id: "zero", area: "경험", score: 0, evidence: "관측된 0" },
    ] })).window.document;
    assert.match(doc.querySelector("tbody").textContent, /근거 부족/);
    assert.match(doc.querySelector("tbody").textContent, /0 \/ 5/);
    assert.throws(() => render(PrismEvaluationTable, { assessments: [{ id: "bad", area: "경험", score: NaN, evidence: "" }] }), /0–5/);
});
test("candidate profile and favorite actions are sibling controls", () => {
    const doc = new JSDOM(render(PrismCandidateCard, { candidate: { id: "a", name: "가상 후보", company: "가상 회사", position: "담당" }, onOpen() {}, onFavoriteChange() {}, favorite: true })).window.document;
    assert.equal(doc.querySelectorAll("button button").length, 0);
    assert.equal(doc.querySelector('[aria-label="가상 후보 즐겨찾기"]').getAttribute("aria-pressed"), "true");
});
test("empty, loading and failed requests have distinct messages", () => {
    assert.match(render(PrismRequestState, { status: "loading" }), /불러오는 중/);
    assert.match(render(PrismRequestState, { status: "empty" }), /표시할 데이터가 없습니다/);
    const error = render(PrismRequestState, { status: "error", error: "조회 실패", onRetry() {} });
    assert.match(error, /조회 실패/); assert.match(error, /다시 시도/);
    assert.doesNotMatch(error, /표시할 정보가 없습니다/);
});
test("overflowing counts retain their exact accessible value", () => {
    const markup = render(PrismCountBadge, { count: 120 });
    assert.match(markup, /120건/); assert.match(markup, /99\+/);
    assert.throws(() => render(PrismCountBadge, { count: -1 }), /nonnegative/);
});
test("chart gaps do not draw zero or interpolate missing evidence", () => {
    const axes = [{id:"a",label:"A"},{id:"b",label:"B"},{id:"c",label:"C"}];
    const doc = new JSDOM(render(PrismRadarChart, {title:"진단",axes,series:[{id:"x",label:"예시",values:[0,null,5]}],max:5})).window.document;
    assert.equal(doc.querySelectorAll("circle").length,2);
    assert.match(doc.querySelector("table").textContent,/정보 없음/);
    assert.equal(doc.querySelectorAll('polygon[stroke-width="2"]').length,0);
    const trend = new JSDOM(render(PrismTrendChart, {title:"추이",labels:["a","b","c"],series:[{id:"x",label:"예시",values:[1,null,2]}]})).window.document;
    assert.equal(trend.querySelectorAll('line[stroke-width="2"]').length,0);
    assert.throws(() => render(PrismRadarChart,{title:"x",axes,series:[{id:"x",label:"x",values:[1,2,NaN]}]}),/Chart values/);
});
test("six-frame table keeps grouped row and column semantics", () => {
    const doc = new JSDOM(render(PrismSixFrame,{columns:[{id:"a",label:"가상",values:{expertise:null,learningAgility:0}}]})).window.document;
    assert.equal(doc.querySelectorAll('th[rowspan="2"]').length,2);
    assert.equal(doc.querySelectorAll('tbody tr').length,6);
    assert.equal(doc.querySelectorAll('td').length,6);
    assert.match(doc.querySelector('tbody').textContent,/정보 없음/);
    assert.match(doc.querySelector('tbody').textContent,/0/);
    assert.throws(() => render(PrismSixFrame,{columns:[{id:"a",label:"a",values:{}},{id:"a",label:"b",values:{}}]}),/unique/);
});
test("pagination and progress reject invalid ranges instead of inventing a value", () => {
    assert.throws(() => render(PrismPagination,{page:2,pageCount:1,onPageChange(){}}),/Pagination/);
    assert.throws(() => render(PrismProgress,{value:NaN}),/Progress/);
    const doc = new JSDOM(render(PrismProgress,{value:null})).window.document;
    assert.equal(doc.querySelector('[role="progressbar"]').hasAttribute('aria-valuenow'),false);
});

test("repeated vector assets preserve accessible labels and cannot collide in SVG IDs", async () => {
    const {PrismIcon,prismIconNames}=await import("../dist/index.js");
    const markup=renderToStaticMarkup(h("div",{},...prismIconNames.flatMap(name=>[h(PrismIcon,{key:name+"a",name,size:20}),h(PrismIcon,{key:name+"b",name,size:20,label:name})])));
    const doc=new JSDOM(markup).window.document;assert.equal(prismIconNames.length,87);assert.equal(doc.querySelectorAll('svg').length,174);assert.equal(doc.querySelectorAll('[role="img"]').length,87);
    const ids=[...doc.querySelectorAll('svg [id]')].map(element=>element.id);assert.equal(new Set(ids).size,ids.length);
    for(const element of doc.querySelectorAll('svg *'))for(const attribute of element.attributes){const match=/^url\(#(.+)\)$/.exec(attribute.value);if(match)assert.ok(doc.getElementById(match[1]),`Missing SVG target ${match[1]}`);}
});
