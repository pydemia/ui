import assert from "node:assert/strict";
import test from "node:test";
import {createElement as h} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {JSDOM} from "jsdom";
import {PrismProfilePrintDocument,PrismProfilePrintDocuments,PrismPrintLeaderSummary,PrismPrintScoreEssays,preparePrismPrintProfile,paginatePrismPrintCareers} from "../dist/index.js";
const candidate={id:'synthetic',name:'김가상',company:'가상전자',position:'합성 직책'};
const base=()=>({id:'synthetic',candidate,leader:{name:'Good 리더',summary:'합성 요약',definition:'합성 정의'},basicInfo:[{label:'학위',value:['합성 A','합성 B']}],career:[{id:'career-1',period:'합성 기간',company:'가상전자',role:['합성 직무 A','합성 직무 B']}],compensation:{years:['2026'],rows:[{label:'보상',values:[0]}]}});
const documentOf=element=>new JSDOM(renderToStaticMarkup(element)).window.document;
const text=node=>node.textContent.replace(/\s+/g,' ').trim();
test('all seven print sections remain in source order for each SUMMARY/compensation option combination',()=>{
 for(const summary of [false,true])for(const compensation of [false,true]){
  const doc=documentOf(h(PrismProfilePrintDocument,{model:base(),options:{summary,compensation}}));
  assert.deepEqual([...doc.querySelectorAll('[data-print-section]')].map(node=>node.dataset.printSection),['total','expertise','success','design','agility','attitude','leadership']);
  assert.equal(doc.querySelectorAll('.prism-print-page').length,7);assert.equal(doc.querySelectorAll('.prism-print-summary').length,Number(summary));assert.equal(doc.querySelectorAll('.prism-compensation-grid').length,Number(compensation));
  assert.equal(doc.querySelectorAll('.prism-print-page[data-repeat-header]').length,6);assert.equal(doc.querySelectorAll('.prism-profile-print-tabs').length,7);
 }
});
test('provided continuation pages preserve every career record and compensation appears only on the last page',()=>{
 const model=base();model.career=[model.career[0],{id:'career-2',period:'다음 기간',company:'가상회사',role:'다음 직무'}];
 const doc=documentOf(h(PrismProfilePrintDocument,{model,careerPages:[[model.career[0]],[model.career[1]],[]]}));
 const pages=[...doc.querySelector('[data-print-section="total"]').querySelectorAll('.prism-print-page')];assert.equal(pages.length,3);
 assert.deepEqual([...doc.querySelectorAll('[data-career-id]')].map(node=>node.dataset.careerId),['career-1','career-2']);
 assert.deepEqual(pages.map(page=>page.querySelectorAll('.prism-compensation-grid').length),[0,0,1]);assert.equal(pages[1].querySelectorAll('.prism-print-career h3').length,0);
 assert.throws(()=>renderToStaticMarkup(h(PrismProfilePrintDocument,{model,careerPages:[[model.career[0]]]})),/preserve every/);
 assert.throws(()=>renderToStaticMarkup(h(PrismProfilePrintDocument,{model,careerPages:[[model.career[0],model.career[0]]]})),/unique/);
});
test('estimated career splitting retains row order and adds an empty final compensation page when necessary',()=>{
 const rows=Array.from({length:60},(_,i)=>({id:'career-'+i,period:'가상',company:'가상전자',role:['합성 역할','합성 기능']}));
 const snapshot=JSON.stringify(rows),pages=paginatePrismPrintCareers(rows,[{label:'학위',value:['합성 A','합성 B']}],{firstPageExtraPt:128,lastPageReservePt:660});
 assert.ok(pages.length>2);assert.deepEqual(pages.flat(),rows);assert.deepEqual(pages.at(-1),[]);assert.equal(JSON.stringify(rows),snapshot);
 assert.deepEqual(paginatePrismPrintCareers([],[],{lastPageReservePt:600}),[[],[]]);assert.throws(()=>paginatePrismPrintCareers(rows,[],{lastPageReservePt:NaN}),/reservations/);
});
test('every success topic including a missing topic index is printed; representative experiences sort first without mutating source',()=>{
 const model=base();model.success={summary:null,topics:['A'],essays:[{id:'second',topic:'A',title:'일반 경험',description:'일반 설명',keywords:[]},{id:'first',topic:'A',representative:true,title:'대표 경험',description:'대표 설명',keywords:['키워드'],interview:'대표 인터뷰'},{id:'unindexed',topic:'B',title:'다른 경험',description:'다른 설명',keywords:[],interview:'비대표 인터뷰'}],failures:[{id:'failure',title:'실패 제목',description:'실패 설명'},{id:'blank',title:'  ',description:'  '}]};
 const before=JSON.stringify(model),doc=documentOf(h(PrismProfilePrintDocument,{model}));const section=doc.querySelector('[data-print-section="success"]');
 assert.deepEqual([...section.querySelectorAll('.prism-print-experience')].map(node=>node.dataset.topic),['A','B']);assert.equal(section.querySelectorAll('h3').length>=3,true);
 assert.match(text(section.querySelector('[data-topic="A"]')),/대표 경험.*일반 경험/);assert.match(text(section),/다른 경험.*실패 제목.*실패 설명/);assert.ok(!text(section).includes('비대표 인터뷰'));assert.equal(JSON.stringify(model),before);
});
test('null scores/maxima stay missing while actual zero compensation, score and Survey values stay zero',()=>{
 const model=base();model.design={grade:null,description:null,essays:[{id:'zero',name:'실제 0',score:0,max:10,description:'가상 근거'},{id:'missing',name:'누락',score:null,max:null,description:null}],survey:[{id:'survey',category:'합성',bars:[{role:'boss',value:0,average:0},{role:'peer',value:null}]}],diversity:null};
 const doc=documentOf(h(PrismProfilePrintDocument,{model}));const scores=[...doc.querySelectorAll('.prism-profile-print-score article header span')].map(text);
 assert.deepEqual(scores,['0 / 10','-- / --']);assert.equal(text(doc.querySelector('.prism-survey-bar strong')),'0.0');assert.equal(doc.querySelectorAll('.prism-survey-bar').length,1);assert.equal(text(doc.querySelector('.prism-compensation-grid td')),'0');
 assert.throws(()=>renderToStaticMarkup(h(PrismPrintScoreEssays,{title:'가상',items:[{id:'bad',name:'잘못된 범위',score:3,max:2,description:null}]})),/valid supplied/);
 model.design.diversity={summary:[],columns:[],rows:[],position:{rowAxisLabel:'회사',columns:[{id:'function',label:'합성 기능'}],rows:[{id:'company',label:'1'}],current:{row:'company',column:'function'}}};
 const matrix=documentOf(h(PrismProfilePrintDocument,{model}));assert.equal(matrix.querySelectorAll('.prism-position-matrix td[data-current]').length,1);assert.equal(text(matrix.querySelector('.prism-position-matrix td[data-current]')),'현재 위치');
});
test('full text is default; reference limits copy only display fields and never split Unicode or alter host data',()=>{
 const model=base();model.expertise={summary:{title:'제목',description:'가'.repeat(400)},fields:[],survey:[]};model.design={grade:null,description:'A'.repeat(400),essays:[{id:'essay',name:'합성',score:null,max:null,description:'😀'.repeat(400)}],survey:[],diversity:null};
 const before=JSON.stringify(model);assert.equal(preparePrismPrintProfile(model).model,model);
 const limited=preparePrismPrintProfile(model,'reference-limits');assert.equal(limited.model.expertise.summary.description.length,350);assert.equal(Array.from(limited.model.design.essays[0].description).length,300);assert.deepEqual(limited.shortened,['expertise.summary','design.description','design.essays.0']);assert.equal(JSON.stringify(model),before);
 assert.equal(documentOf(h(PrismProfilePrintDocument,{model})).querySelector('.prism-profile-print-shortened'),null);assert.ok(documentOf(h(PrismProfilePrintDocument,{model,textPolicy:'reference-limits'})).querySelector('.prism-profile-print-shortened'));
});
test('empty profile sections render missing information; SUMMARY title is not duplicated and note stages are retained',()=>{
 const doc=documentOf(h(PrismProfilePrintDocument,{model:{id:'empty',candidate}}));assert.equal(doc.querySelectorAll('[data-print-section]').length,7);assert.equal(doc.querySelectorAll('.prism-print-page').length,7);assert.ok(doc.querySelectorAll('.prism-no-data').length>=7);
 assert.equal(documentOf(h(PrismPrintLeaderSummary,{})).querySelectorAll('h3').length,1);
 const summary=documentOf(h(PrismPrintLeaderSummary,{name:'Good 리더',summary:'합성 요약',definition:' 합성 정의 '}));assert.ok(summary.querySelector('.prism-print-leader-badge br'));assert.match(text(summary.body),/Good 리더 : 합성 정의.*Excellent > Good > Solid > Developing > Struggling/);
});
test('leadership detail survives all print options and both display text policies without changing host data',()=>{
 const model=base(),detail='상세 설명 😀\n'.repeat(100);
 model.leadership={summary:{items:[{label:'지',value:null},{label:'덕',value:null},{label:'용',value:null}],title:'',description:'',detail},survey:[],strengths:[],improvements:[],trend:null};
 const before=JSON.stringify(model);
 for(const textPolicy of ['full','reference-limits'])for(const summary of [false,true])for(const compensation of [false,true]){
  const prepared=preparePrismPrintProfile(model,textPolicy);
  assert.equal(prepared.model.leadership.summary.detail,detail);assert.ok(!prepared.shortened.includes('leadership.detail'));
  const doc=documentOf(h(PrismProfilePrintDocument,{model,textPolicy,options:{summary,compensation}}));
  const chapter=doc.querySelector('[data-print-section="leadership"]');
  assert.equal(chapter.querySelector('.prism-leadership-summary-detail').textContent,detail.trim());
  assert.ok(chapter.querySelector('.prism-leadership-summary[data-print="true"]'));
  assert.equal(chapter.querySelector('.prism-leadership-summary-empty'),null);
 }
 assert.equal(JSON.stringify(model),before);
});
test('multi-profile documents keep each candidate and all chapters separate, with unique identity validation',()=>{
 const one=base(),two={...base(),id:'two',candidate:{...candidate,id:'two',name:'이가상'}};const doc=documentOf(h(PrismProfilePrintDocuments,{documents:[one,two]}));
 assert.deepEqual([...doc.querySelectorAll('[data-profile-id]')].map(node=>node.dataset.profileId),['synthetic','two']);assert.equal(doc.querySelectorAll('[data-print-section]').length,14);assert.equal(doc.querySelectorAll('.prism-print-page').length,14);
 assert.throws(()=>renderToStaticMarkup(h(PrismProfilePrintDocuments,{documents:[one,one]})),/unique/);assert.match(text(documentOf(h(PrismProfilePrintDocuments,{documents:[]})).body),/출력할 프로필이 없습니다/);
});
