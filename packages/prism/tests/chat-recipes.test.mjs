import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { transform } from "esbuild";
import { JSDOM } from "jsdom";
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>',{url:"http://localhost/",pretendToBeVisual:true});
for(const key of ["window","document","HTMLElement","Element","Node","Event","MouseEvent","KeyboardEvent","MutationObserver","DocumentFragment","CustomEvent","NodeFilter","HTMLInputElement","HTMLButtonElement"])globalThis[key]=dom.window[key];
Object.defineProperty(globalThis,"navigator",{configurable:true,value:dom.window.navigator});globalThis.getComputedStyle=dom.window.getComputedStyle;
globalThis.requestAnimationFrame=dom.window.requestAnimationFrame.bind(dom.window);globalThis.cancelAnimationFrame=dom.window.cancelAnimationFrame.bind(dom.window);globalThis.IS_REACT_ACT_ENVIRONMENT=true;
let width=800;const observers=[];
Object.defineProperty(dom.window.HTMLElement.prototype,"clientWidth",{configurable:true,get:()=>width});
globalThis.ResizeObserver=class{constructor(callback){this.callback=callback;this.closed=false;observers.push(this);}observe(node){this.node=node;}unobserve(){}disconnect(){this.closed=true;}};
const {createElement:h,act,StrictMode}=await import("react"),{createRoot}=await import("react-dom/client");
const {PrismAnalysis,PrismProfileAnalysis,PrismFormattedText,PrismPositionRecommendations,PrismResponse,createPrismPositionReference}=await import("../dist/index.js");
const root=createRoot(document.getElementById("root")),render=node=>act(async()=>root.render(node)),clear=()=>render(null),click=node=>act(async()=>node.click());
const items=count=>Array.from({length:count},(_,index)=>({id:`p-${index}`,company:"가상전자",title:`가상 포지션 ${index+1}`,reasons:["합성 전문성","합성 경험"]}));
const cards=()=>[...document.querySelectorAll('.prism-position-recommendation')],more=()=>document.querySelector('.prism-position-reveal');
const resize=async value=>{width=value;await act(async()=>{for(const observer of observers.filter(o=>!o.closed&&o.node?.classList.contains('prism-position-recommendations')))observer.callback([{contentRect:{width:value}}]);});};
const exampleSource=await readFile(new URL('../../../apps/docs/src/prism/position-reference-demo.tsx',import.meta.url),'utf8');
const compiled=await transform(exampleSource,{loader:'tsx',jsx:'automatic',format:'esm'});
const portable=compiled.code.replace(/\bfrom\s+["']([^"']+)["']/g,(_match,specifier)=>{
    assert.ok(['react','react/jsx-runtime','@pydemia/prism'].includes(specifier),'Complete host example must not use private imports');
    return 'from '+JSON.stringify(import.meta.resolve(specifier));
});
const {PositionReferenceExample}=await import('data:text/javascript;base64,'+Buffer.from(portable).toString('base64'));
const positionData=label=>({company:'가상전자',role:label,items:[],groups:[],definition:label});
test("analysis preserves each factor's purpose and displays only representative stars and first Design/Learning result",async()=>{
    const kinds=['expertise','success','design','agility','attitude','leadership','other'];
    await render(h(PrismAnalysis,{leader:null,factors:kinds.map(kind=>({id:kind,kind,label:kind,title:'합성 제목',results:['A','B'],starred:['B'],summary:'<bullet depth=1>**합성 근거**</bullet>'}))}));
    assert.equal(document.querySelectorAll('.prism-analysis-factor').length,7);
    assert.equal(document.querySelectorAll('[data-kind="success"] .prism-analysis-star').length,1);
    assert.equal(document.querySelector('[data-kind="success"] .prism-analysis-star').parentElement.textContent,'B');
    for(const kind of ['design','agility'])assert.deepEqual([...document.querySelectorAll(`[data-kind="${kind}"] .prism-anchor-chip`)].map(n=>n.textContent),['A']);
    assert.equal(document.querySelectorAll('[data-kind="attitude"] .prism-analysis-derail-chip').length,2);
    assert.equal(document.querySelectorAll('[data-kind="leadership"] .prism-anchor-chip').length,0);
    assert.equal(document.querySelectorAll('[data-kind="expertise"] .prism-analysis-tag-divider').length,1);
    assert.ok(document.querySelector('.prism-analysis-description strong'));await clear();
});
test("leader nullish fallback preserves an empty AI comment; explanation toggle does not submit a form",async()=>{
    let submits=0;const props={leader:{label:'Good 리더',description:'합성 설명',aiComment:''},factors:[{id:'empty',kind:'other',label:'빈 근거',results:[],summary:'   '}]};
    await render(h('form',{onSubmit:e=>{e.preventDefault();submits++;}},h(PrismAnalysis,props)));
    assert.equal(document.querySelector('.prism-analysis-leader-comment').textContent,'');assert.ok(document.querySelector('.prism-analysis-leader-badge br'));
    assert.equal(document.querySelector('.prism-analysis-factor .prism-no-data').textContent,'관련 데이터 없음');
    const button=document.querySelector('.prism-analysis-info');await click(button);assert.equal(button.getAttribute('aria-expanded'),'true');
    assert.match(document.querySelector('[role="tooltip"]').textContent,/합성 설명[\s\S]*Excellent > Good > Solid > Developing > Struggling/);assert.equal(submits,0);
    await click(button);assert.equal(button.getAttribute('aria-expanded'),'false');
    await render(h(PrismAnalysis,{...props,leader:{...props.leader,aiComment:null}}));assert.equal(document.querySelector('.prism-analysis-leader-comment').textContent,'합성 설명');
    await render(h(PrismAnalysis,{...props,leader:{label:'Solid leader'}}));assert.equal(document.querySelector('.prism-analysis-info'),null);await clear();
});
test("standalone formatted text dispatches host actions once, makes panel labels inert and sanitizes raw markup",async()=>{
    const calls=[];const props={source:'[후보](profile://synthetic) <script>alert(1)</script><img src="secret" onerror="alert(2)"> <b>안전한 글</b>',onAction:(...args)=>calls.push(args)};
    await render(h(PrismFormattedText,props));await click(document.querySelector('button'));assert.deepEqual(calls,[['profile','synthetic']]);assert.equal(document.querySelector('script,img'),null);
    await render(h(PrismFormattedText,{...props,panel:true}));assert.equal(document.querySelector('button'),null);assert.match(document.body.textContent,/후보/);await clear();
});
test("formatted text keeps source heading, highlight and badge tags while limiting actions",async()=>{
    const calls=[];
    const source='<h1>합성 제목</h1> <h2>합성 소제목</h2> <highlight-yellow>강조</highlight> <badge-white>흰 배지</badge> <badge-black>검은 배지</badge> <bullet depth=2>근거</bullet> [문서](popup:/synthetic.pdf) [차단](javascript:alert(1))';
    await render(h(PrismFormattedText,{source,onAction:(...args)=>calls.push(args)}));
    assert.equal(document.querySelector('.prism-rich-h1').textContent,'합성 제목');
    assert.equal(document.querySelector('.prism-rich-h2').textContent,'합성 소제목');
    assert.equal(document.querySelector('mark.prism-rich-highlight-yellow').textContent,'강조');
    assert.equal(document.querySelector('.prism-rich-badge-white').textContent,'흰 배지');
    assert.equal(document.querySelector('.prism-rich-badge-black').textContent,'검은 배지');
    assert.equal(document.querySelector('.prism-rich-bullet-2').textContent,'근거');
    assert.equal(document.querySelectorAll('a[href^="javascript:"]').length,0);
    await click(document.querySelector('button.prism-rich-action'));
    assert.deepEqual(calls,[['document','/synthetic.pdf']]);
    await render(h(PrismFormattedText,{source,panel:true,onAction:(...args)=>calls.push(args)}));
    assert.equal(document.querySelectorAll('button.prism-rich-action').length,1);
    await clear();
});
test("wide recommendations disclose 3 of 4 and 6 of 7 then collapse, without inventing ranks",async()=>{
    width=800;
    for(const [count,initial] of [[0,0],[1,1],[2,2],[3,3],[4,3],[6,3],[7,6],[9,6]]){
        await render(h(PrismPositionRecommendations,{items:items(count)}));assert.equal(cards().length,initial);
        assert.equal(document.querySelector('[role="button"]'),null);assert.equal(document.querySelector('.prism-rank'),null);
        if(count>initial){assert.equal(more().textContent,`더보기 (${count-initial})`);await click(more());assert.equal(cards().length,count);assert.equal(more().textContent,'접기');await click(more());assert.equal(cards().length,initial);}
        else assert.equal(more(),null);
    }await clear();
});
test("400px recommendations reveal exactly the advertised final batch and keyboard selection is controlled",async()=>{
    width=400;const calls=[];const props={items:items(9),selectedId:'p-0',onSelect:item=>calls.push(item.id)};await render(h(PrismPositionRecommendations,props));
    assert.equal(cards().length,4);assert.equal(more().textContent,'포지션 2개 더보기 (5)');await click(more());assert.equal(cards().length,6);
    assert.equal(more().textContent,'포지션 3개 더보기 (3)');await click(more());assert.equal(cards().length,9);await click(more());assert.equal(cards().length,4);
    assert.equal(cards()[0].getAttribute('aria-pressed'),'true');
    await act(async()=>cards()[1].dispatchEvent(new KeyboardEvent('keydown',{key:' ',bubbles:true,cancelable:true})));assert.deepEqual(calls,['p-1']);assert.equal(cards()[1].getAttribute('aria-pressed'),'false');
    await render(h(PrismPositionRecommendations,{...props,selectedId:'p-1'}));assert.equal(cards()[1].getAttribute('aria-pressed'),'true');await clear();
});
test("same IDs retain disclosure on callback rerenders; dataset changes and crossing 400px reset it",async()=>{
    width=320;const values=items(9);await render(h(PrismPositionRecommendations,{items:values}));await click(more());assert.equal(cards().length,6);
    await render(h(PrismPositionRecommendations,{items:values.map(item=>({...item})),onSelect:()=>{}}));assert.equal(cards().length,6);
    await resize(401);assert.equal(cards().length,6);await click(more());assert.equal(cards().length,9);
    await resize(400);assert.equal(cards().length,4);await click(more());
    await render(h(PrismPositionRecommendations,{items:values.map(item=>({...item,id:'new-'+item.id}))}));assert.equal(cards().length,4);await click(more());
    await render(h(PrismPositionRecommendations,{items:values.map(item=>({...item,id:'new-'+item.id})),datasetKey:'changed'}));assert.equal(cards().length,4);await clear();
});
test("StrictMode observer cleanup leaves no live recommendation observer after unmount",async()=>{
    await render(h(StrictMode,null,h(PrismPositionRecommendations,{items:items(9)})));
    assert.equal(observers.filter(o=>!o.closed&&o.node?.classList.contains('prism-position-recommendations')).length,1);await clear();assert.ok(observers.filter(o=>o.node?.classList.contains('prism-position-recommendations')).every(o=>o.closed));
});
test("response panel uses the same recommendation recipe and legacy analysis adapts display kinds",async()=>{
    width=800;await render(h(PrismResponse,{blocks:[{id:'positions',type:'positions',positions:items(7)}],panel:true}));assert.equal(cards().length,6);assert.equal(document.querySelector('[role="button"]'),null);await clear();
    await render(h(PrismProfileAnalysis,{leader:{label:'Good 리더',description:'합성 설명',aiComment:'합성 요약'},factors:[{id:'a',label:'Attitude',results:['Risk'],summary:null},{id:'d',label:'Design',results:['A','B'],summary:null}]}));
    assert.ok(document.querySelector('[data-kind="attitude"] .prism-analysis-derail-chip'));assert.equal(document.querySelectorAll('[data-kind="design"] .prism-anchor-chip').length,1);await clear();
});
test("response keeps a text block with its following visual block in both conversation widths",async()=>{
    const blocks=[
        {id:'intro',type:'text',content:'합성 소개'},
        {id:'criteria',type:'criteria',items:['합성 기준']},
        {id:'followup',type:'text',content:'합성 후속 설명'},
        {id:'table',type:'table',title:'합성 표',columns:['항목','값'],rows:[{id:'one',cells:['점수',0]}]},
        {id:'closing',type:'text',content:'합성 마무리'},
    ];
    for(const panel of [false,true]){
        await render(h(PrismResponse,{blocks,panel}));
        const groups=[...document.querySelectorAll('.prism-response-group')];
        assert.deepEqual(groups.map(group=>group.querySelectorAll('.prism-response-block').length),[2,2,1]);
        assert.deepEqual(groups.map(group=>!!group.hasAttribute('data-paired')),[true,true,false]);
        assert.equal(document.querySelector('.prism-response-table tbody td:last-child').textContent,'0');
        assert.equal(document.querySelector('.prism-response > .prism-generation').textContent,'답변 완료');
    }
    await clear();
});
test("position references distinguish historical and legacy cards from live links without mutating input",()=>{
    const item={id:'same-position',version:3,company:'가상전자'},before=JSON.stringify(item);
    assert.deepEqual(createPrismPositionReference(item),{id:'same-position',source:'card',version:3});
    assert.deepEqual(createPrismPositionReference({id:item.id}),{id:item.id,source:'card',version:1});
    const link=createPrismPositionReference(item,'link');assert.deepEqual(link,{id:item.id,source:'link'});assert.equal(Object.hasOwn(link,'version'),false);
    for(const version of [0,-1,.5,NaN,Infinity,Number.MAX_SAFE_INTEGER+1])assert.throws(()=>createPrismPositionReference({id:item.id,version}),/positive safe integers/);
    assert.throws(()=>createPrismPositionReference({id:' '}),/identifier/);assert.equal(JSON.stringify(item),before);
});
test("recommendation callbacks retain host items and emit the clicked historical version once",async()=>{
    width=800;const values=[{...items(2)[0],version:3},items(2)[1]],before=JSON.stringify(values),calls=[];
    await render(h(PrismPositionRecommendations,{items:values,onSelect:(...args)=>calls.push(args)}));
    await click(cards()[0]);await act(async()=>cards()[1].dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true})));
    assert.equal(calls.length,2);assert.equal(calls[0][0],values[0]);assert.equal(calls[1][0],values[1]);
    assert.deepEqual(calls.map(call=>call[1]),[{id:'p-0',source:'card',version:3},{id:'p-1',source:'card',version:1}]);assert.equal(JSON.stringify(values),before);await clear();
});
test("same position in different response snapshots selects only the controlled matching version",async()=>{
    const position={...items(1)[0],id:'same-position'};const blocks=[{id:'old',type:'positions',positions:[{...position,version:2}]},{id:'new',type:'positions',positions:[{...position,version:3}]}],calls=[];
    const props={blocks,selectedPositionId:position.id,onPositionOpen:(...args)=>calls.push(args)};
    await render(h(PrismResponse,{...props,selectedPositionReference:{id:position.id,source:'card',version:2}}));
    assert.deepEqual(cards().map(card=>card.getAttribute('aria-pressed')),['true','false']);await click(cards()[1]);
    assert.deepEqual(calls,[[position.id,{id:position.id,source:'card',version:3}]]);assert.deepEqual(cards().map(card=>card.getAttribute('aria-pressed')),['true','false']);
    await render(h(PrismResponse,{...props,selectedPositionReference:{id:position.id,source:'card',version:3}}));assert.deepEqual(cards().map(card=>card.getAttribute('aria-pressed')),['false','true']);
    for(const selectedPositionReference of [null,{id:position.id,source:'link'}]){
        await render(h(PrismResponse,{...props,selectedPositionReference}));assert.deepEqual(cards().map(card=>card.getAttribute('aria-pressed')),['false','false']);
    }
    await render(h(PrismResponse,props));assert.deepEqual(cards().map(card=>card.getAttribute('aria-pressed')),['true','true']);await clear();
});
test("response text and table links remain live references independently of selected cards and preserve other actions",async()=>{
    const actions=[],cardsOpened=[];const blocks=[{id:'body',type:'text',content:'[현재 운영본](position://same-position) [프로필](profile://synthetic) [문서](popup:/fixture.pdf)'},
        {id:'table',type:'table',title:'합성 표',columns:['[포지션](position://same-position)'],rows:[{id:'row',cells:['[본문](position://same-position)']}]}];
    await render(h(PrismResponse,{blocks,selectedPositionReference:{id:'same-position',source:'card',version:3},onPositionOpen:(...args)=>cardsOpened.push(args),onAction:(...args)=>actions.push(args)}));
    for(const button of document.querySelectorAll('.prism-rich-action'))await click(button);
    assert.equal(actions.length,5);assert.deepEqual(actions.filter(call=>call[0]==='position'),Array.from({length:3},()=>['position','same-position',{id:'same-position',source:'link'}]));
    assert.deepEqual(actions.filter(call=>call[0]!=='position'),[['profile','synthetic'],['document','/fixture.pdf']]);assert.deepEqual(cardsOpened,[]);
    await render(h(PrismResponse,{blocks}));assert.equal(document.querySelector('.prism-rich-action'),null);await clear();
});
test("response six-frame cells route live position links and panel cells remain inert",async()=>{
    const calls=[],blocks=[{id:'frame',type:'six-frame',title:'합성 6 Frame',columns:[{id:'candidate',label:'김가상',values:{expertise:'[현재 포지션](position://synthetic-position)'}}]}];
    await render(h(PrismResponse,{blocks,onAction:(...args)=>calls.push(args)}));
    const action=document.querySelector('.prism-six-frame .prism-rich-action');assert.ok(action);await click(action);
    assert.deepEqual(calls,[['position','synthetic-position',{id:'synthetic-position',source:'link'}]]);
    await render(h(PrismResponse,{blocks,panel:true,onAction:(...args)=>calls.push(args)}));
    assert.equal(document.querySelector('.prism-six-frame .prism-rich-action'),null);
    assert.match(document.querySelector('.prism-six-frame').textContent,/현재 포지션/);await clear();
});
test("complete host example aborts old versions, ignores providers that finish late and keeps live links versionless",async()=>{
    const requests=[],loadPosition=(reference,signal)=>new Promise((resolve,reject)=>requests.push({reference,signal,resolve,reject}));
    await render(h(PositionReferenceExample,{loadPosition}));await click(cards()[0]);assert.deepEqual(requests[0].reference,{id:'synthetic-position',source:'card',version:2});
    await click(cards()[1]);assert.equal(requests[0].signal.aborted,true);assert.deepEqual(requests[1].reference,{id:'synthetic-position',source:'card',version:3});
    await act(async()=>requests[0].resolve(positionData('이전 버전 결과')));assert.equal(document.querySelector('.prism-position-header h2'),null);
    await act(async()=>requests[1].resolve(positionData('버전3 결과')));assert.equal(document.querySelector('.prism-position-header h2').textContent,'버전3 결과');
    await click(document.querySelector('.prism-rich-action'));assert.equal(requests[1].signal.aborted,true);assert.deepEqual(requests[2].reference,{id:'synthetic-position',source:'link'});assert.equal(Object.hasOwn(requests[2].reference,'version'),false);
    assert.equal(document.querySelector('.prism-position-header h2'),null);await act(async()=>requests[2].resolve(positionData('현재 운영본 결과')));
    assert.equal(document.querySelector('.prism-position-header h2').textContent,'현재 운영본 결과');await clear();assert.equal(requests[2].signal.aborted,true);
});
test("complete host example retries errors, replaces loader generations and cancels a dismissed selection",async()=>{
    const requests=[],loadPosition=(reference,signal)=>new Promise((resolve,reject)=>requests.push({reference,signal,resolve,reject}));
    await render(h(PositionReferenceExample,{loadPosition}));await click(cards()[2]);assert.equal(requests[0].reference.version,1);
    await act(async()=>requests[0].reject(new Error('synthetic provider failure')));assert.ok(document.querySelector('.prism-position-fallback'));assert.equal(document.querySelector('.prism-position-header h2'),null);
    const retryButton=[...document.querySelectorAll('.prism-position-fallback button')].find(button=>/다시|재시도/.test(button.textContent));assert.ok(retryButton);await click(retryButton);
    assert.equal(requests[0].signal.aborted,true);assert.deepEqual(requests[1].reference,requests[0].reference);await act(async()=>requests[1].resolve(positionData('재시도 결과')));
    const nextRequests=[],nextLoader=(reference,signal)=>new Promise(resolve=>nextRequests.push({reference,signal,resolve}));await render(h(PositionReferenceExample,{loadPosition:nextLoader}));
    assert.equal(requests[1].signal.aborted,true);assert.equal(document.querySelector('.prism-position-header h2'),null);assert.equal(nextRequests.length,1);
    const dismiss=[...document.querySelectorAll('button')].find(button=>button.textContent==='선택 해제');await click(dismiss);assert.equal(nextRequests[0].signal.aborted,true);
    await act(async()=>nextRequests[0].resolve(positionData('선택 해제 뒤 늦은 결과')));assert.equal(document.querySelector('.prism-position-detail'),null);await clear();
});
