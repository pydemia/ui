import assert from "node:assert/strict";
import test from "node:test";
import {createElement as h} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {JSDOM} from "jsdom";
import {PrismLeadershipTrendBars} from "../dist/index.js";

const render = props => new JSDOM(renderToStaticMarkup(h(PrismLeadershipTrendBars, props))).window.document;

test("five-year chart keeps a missing year distinct from a real zero and drops older history", () => {
    const doc = render({title:"가상 리더십 추이",endYear:2026,rows:[
        {year:2020,candidateScore:99,companyName:"과거",positionTitle:"과거"},
        {year:2022,candidateScore:0,companyName:"가상 A",positionTitle:"팀장"},
        {year:2024,candidateScore:4.3,companyName:"가상 B",positionTitle:"본부장"},
    ]});
    const cells = [...doc.querySelectorAll("tbody tr")].map(row => [...row.cells].map(cell => cell.textContent));
    assert.deepEqual(cells.map(row => row[0]),["2022","2023","2024","2025","2026"]);
    assert.deepEqual(cells.map(row => row[1]),["0","정보 없음","4.3","정보 없음","정보 없음"]);
    assert.equal(doc.querySelectorAll(".prism-leadership-trend-trigger").length,2);
    assert.equal(doc.querySelectorAll(".prism-leadership-trend-na").length,3);
    assert.equal(doc.querySelectorAll(".prism-leadership-trend-cell").length,5);
});

test("source-style detail and accessible metadata remain host supplied", () => {
    const rows=[{year:2026,candidateScore:3.5,companyName:"가상 회사",positionTitle:"가상 직책"}];
    const doc=render({title:"5개년 리더십",rows,showDetail:true,disableTooltip:true});
    assert.match(doc.querySelector('button').getAttribute('aria-label'),/2026년 3.5점, 가상 회사 가상 직책/);
    assert.equal(doc.querySelector('.prism-leadership-trend-details > div:last-child').textContent,'가상 회사가상 직책');
    assert.deepEqual(rows,[{year:2026,candidateScore:3.5,companyName:"가상 회사",positionTitle:"가상 직책"}]);
    assert.throws(()=>render({title:"x",rows:[rows[0],rows[0]]}),/unique integer years/);
    assert.throws(()=>render({title:"x",rows:[{...rows[0],candidateScore:NaN}]}),/nonnegative finite/);
});
