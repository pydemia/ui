import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url:"http://localhost/",pretendToBeVisual:true });
for(const key of ["window","document","HTMLElement","Element","Node","Event","MouseEvent","KeyboardEvent","MutationObserver","DocumentFragment","CustomEvent","NodeFilter","HTMLInputElement","HTMLTextAreaElement","HTMLButtonElement"])globalThis[key]=dom.window[key];
Object.defineProperty(globalThis,"navigator",{configurable:true,value:dom.window.navigator});globalThis.getComputedStyle=dom.window.getComputedStyle;
globalThis.requestAnimationFrame=dom.window.requestAnimationFrame.bind(dom.window);globalThis.cancelAnimationFrame=dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.ResizeObserver=class{observe(){}unobserve(){}disconnect(){}};globalThis.IS_REACT_ACT_ENVIRONMENT=true;
const {createElement:h,act}=await import("react"),{createRoot}=await import("react-dom/client");
const {copyPrismPdfBytes,loadPrismPdfBytes,prismPdfFilename,PrismPdfViewer,PrismDiagnosis,PrismValueShares,PrismSurveyValidation,PrismAttitudeReport}=await import("../dist/index.js");
const root=createRoot(document.getElementById("root"));const render=node=>act(async()=>root.render(node));const clear=()=>render(null);const click=node=>act(async()=>node.click());
const deferred=()=>{let resolve,reject;const promise=new Promise((yes,no)=>{resolve=yes;reject=no;});return{promise,resolve,reject};};
const header=new TextEncoder().encode("%PDF-1.7\nHeader validation fixture; not a full document.");

test("PDF header copies a typed view without transferring or including its surrounding bytes",()=>{
    const buffer=new Uint8Array(header.length+6);buffer.set(header,3);const view=buffer.subarray(3,3+header.length),copy=copyPrismPdfBytes(view);
    assert.deepEqual(copy,header);copy[0]=0;assert.equal(view[0],0x25);assert.equal(buffer.byteLength,header.length+6);
    assert.throws(()=>copyPrismPdfBytes(new TextEncoder().encode('<html>login</html>')),/PDF 형식/);assert.throws(()=>copyPrismPdfBytes(new Uint8Array(3)),/PDF 형식/);
});
test("whole-response PDF loading rejects HTTP and HTML then uses only the host's captured fallback destinations",async()=>{
    const first=deferred(),urls=['first','html','valid'],calls=[],signal=new AbortController().signal;
    const task=loadPrismPdfBytes(urls,{signal,fetcher:async(url,options)=>{calls.push({url,signal:options.signal});return url==='first'?first.promise:url==='html'?new Response('<html>login</html>'):new Response(header);}});
    urls.splice(1,2,'unexpected');first.resolve(new Response('failure',{status:503}));assert.deepEqual(await task,header);
    assert.deepEqual(calls.map(call=>call.url),['first','html','valid']);assert.ok(calls.every(call=>call.signal===signal));
});
test("abort rejects a loader that ignores cancellation and never starts a fallback",async()=>{
    const waiting=deferred(),controller=new AbortController();let calls=0;
    const task=loadPrismPdfBytes(['first','second'],{signal:controller.signal,fetcher:async()=>{calls++;return waiting.promise;}});controller.abort();
    await assert.rejects(task,error=>error.name==='AbortError');waiting.resolve(new Response(header));await Promise.resolve();assert.equal(calls,1);
});
test("PDF filename excludes URL queries and path separators while preserving readable Unicode",()=>{
    assert.equal(prismPdfFilename('/reports/%EA%B0%80%EC%83%81.pdf?download=1#part'),'가상.pdf');assert.equal(prismPdfFilename('/reports/a%2Fb.pdf'),'a_b.pdf');assert.equal(prismPdfFilename('/'),'문서.pdf');
});
test("source changes abort old byte loading; callback rerenders do not restart a document; late completions stay ignored",async()=>{
    const first=deferred(),second=deferred(),calls=[];const load=(url,context)=>{calls.push({url,signal:context.signal});return url==='first'?first.promise:second.promise;};
    await render(h(PrismPdfViewer,{url:'first',workerUrl:'/worker',title:'합성 문서',loadPdf:load}));
    await render(h(PrismPdfViewer,{url:'first',workerUrl:'/worker',title:'합성 문서',loadPdf:(...args)=>load(...args)}));assert.equal(calls.length,1);
    await render(h(PrismPdfViewer,{url:'second',workerUrl:'/worker',title:'다른 합성 문서',loadPdf:load}));assert.equal(calls[0].signal.aborted,true);assert.equal(calls.length,2);
    await clear();assert.equal(calls[1].signal.aborted,true);await act(async()=>{first.resolve(header);second.resolve(header);});assert.equal(document.querySelector('.prism-pdf'),null);
});
test("download captures metadata once, gates duplicate work and ignores UI feedback after source replacement",async()=>{
    const waiting=deferred(),job=deferred(),downloads=[];const load=()=>waiting.promise;
    const props={url:'first.pdf?x=1',workerUrl:'/worker',title:'합성 문서',loadPdf:load,onDownload:context=>{downloads.push(context);return job.promise;}};
    await render(h(PrismPdfViewer,props));const button=[...document.querySelectorAll('button')].find(button=>button.textContent==='다운로드');await click(button);await click(button);
    assert.equal(downloads.length,1);assert.equal(downloads[0].filename,'first.pdf');assert.equal(downloads[0].data,null);assert.equal(Object.isFrozen(downloads[0]),true);assert.equal(button.disabled,true);
    await render(h(PrismPdfViewer,{...props,url:'second.pdf'}));await act(async()=>job.reject(new Error('late')));assert.equal(document.querySelector('footer [role="alert"]'),null);await clear();
});
test("rejected download remains retryable without accepting a second pending request",async()=>{
    const waiting=deferred();let attempts=0;
    await render(h(PrismPdfViewer,{url:'document.pdf',workerUrl:'/worker',title:'합성 문서',loadPdf:()=>waiting.promise,onDownload:async()=>{if(++attempts===1)throw new Error('failure');}}));
    const button=[...document.querySelectorAll('button')].find(button=>button.textContent==='다운로드');await click(button);assert.match(document.querySelector('footer [role="alert"]').textContent,/다운로드하지 못/);assert.equal(button.disabled,false);
    await click(button);assert.equal(attempts,2);assert.equal(document.querySelector('footer [role="alert"]'),null);await clear();
});
test("diagnosis title-only comments and empty share descriptions preserve source no-data boundaries",async()=>{
    await render(h(PrismDiagnosis,{title:'진단',axes:['A','B','C'],values:[],heading:' 제목만 ',description:'  ',shares:[{label:'first',percent:0}],valueDescription:'숨기기'}));
    assert.equal(document.querySelector('.prism-diagnosis-comment strong').textContent,'제목만');assert.equal(document.querySelector('.prism-diagnosis-comment .prism-no-data'),null);
    assert.equal(document.querySelector('.prism-radar figcaption'),null);assert.equal(document.querySelector('.prism-radar summary').hidden,true);assert.equal(document.querySelector('.prism-radar summary').tabIndex,-1);
    assert.equal(document.querySelector('.prism-diagnosis').textContent.includes('숨기기'),false);await clear();
});
test("positive value-share filtering retains the original color index and zero categories are not visible legends",async()=>{
    await render(h(PrismValueShares,{items:[{label:'zero',percent:0},{label:'second',percent:40},{label:'third',percent:60}]}));
    assert.equal(document.querySelectorAll('.prism-value-shares li').length,2);assert.equal(document.querySelector('.prism-value-shares li').textContent.includes('zero'),false);
    assert.equal(document.querySelector('.prism-share-bar span').style.background,'rgb(46, 142, 217)');await clear();
});
test("survey preserves actual zero, omits null bars and exposes missing values separately from average lines",async()=>{
    await render(h(PrismSurveyValidation,{columns:2,items:[{id:'one',category:'가상',bars:[{role:'boss',value:0,average:6.45},{role:'peer',value:null,average:8},{role:'member',value:10,average:null}]}]}));
    assert.equal(document.querySelectorAll('.prism-survey-bar').length,2);assert.equal(document.querySelector('.prism-survey-bar strong').textContent,'0.0');assert.equal(document.querySelector('.prism-survey-fill').style.height,'0px');
    assert.equal(document.querySelectorAll('.prism-survey-average').length,1);assert.match(document.querySelector('table').textContent,/동료정보 없음8/);await clear();
});
test("report action belongs to the diagnosis header and subject changes close and abort its open document",async()=>{
    const waiting=deferred();let signal;const props={subjectId:'one',summary:{},diagnosis:{title:'진단',axes:['A','B','C'],values:[0,null,5]},risk:{items:[]},report:{url:'report.pdf',workerUrl:'/worker',loadPdf:(_,context)=>{signal=context.signal;return waiting.promise;}}};
    await render(h(PrismAttitudeReport,props));const button=document.querySelector('.prism-diagnosis-recipe>.prism-profile-section-header button');assert.equal(button.textContent,'심리적강인함 결과 보기');await click(button);assert.ok(document.querySelector('[role="dialog"]'));
    await render(h(PrismAttitudeReport,{...props,subjectId:'two'}));assert.equal(document.querySelector('[role="dialog"]'),null);assert.equal(signal.aborted,true);
    await render(h(PrismAttitudeReport,{...props,report:{...props.report,url:'   '}}));assert.equal(document.querySelector('.prism-diagnosis-recipe>.prism-profile-section-header button'),null);await clear();
});
