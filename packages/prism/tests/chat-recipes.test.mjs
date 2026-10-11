import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>',{url:"http://localhost/",pretendToBeVisual:true});
for(const key of ["window","document","HTMLElement","Element","Node","Event","MouseEvent","KeyboardEvent","MutationObserver","DocumentFragment","CustomEvent","NodeFilter","HTMLInputElement","HTMLButtonElement"])globalThis[key]=dom.window[key];
Object.defineProperty(globalThis,"navigator",{configurable:true,value:dom.window.navigator});globalThis.getComputedStyle=dom.window.getComputedStyle;
globalThis.requestAnimationFrame=dom.window.requestAnimationFrame.bind(dom.window);globalThis.cancelAnimationFrame=dom.window.cancelAnimationFrame.bind(dom.window);globalThis.IS_REACT_ACT_ENVIRONMENT=true;
let width=800;const observers=[];
Object.defineProperty(dom.window.HTMLElement.prototype,"clientWidth",{configurable:true,get:()=>width});
globalThis.ResizeObserver=class{constructor(callback){this.callback=callback;this.closed=false;observers.push(this);}observe(node){this.node=node;}unobserve(){}disconnect(){this.closed=true;}};
const {createElement:h,act,StrictMode}=await import("react"),{createRoot}=await import("react-dom/client");
const {PrismAnalysis,PrismProfileAnalysis,PrismFormattedText,PrismPositionRecommendations,PrismResponse}=await import("../dist/index.js");
const root=createRoot(document.getElementById("root")),render=node=>act(async()=>root.render(node)),clear=()=>render(null),click=node=>act(async()=>node.click());
const items=count=>Array.from({length:count},(_,index)=>({id:`p-${index}`,company:"가상전자",title:`가상 포지션 ${index+1}`,reasons:["합성 전문성","합성 경험"]}));
const cards=()=>[...document.querySelectorAll('.prism-position-recommendation')],more=()=>document.querySelector('.prism-position-reveal');
const resize=async value=>{width=value;await act(async()=>{for(const observer of observers.filter(o=>!o.closed&&o.node?.classList.contains('prism-position-recommendations')))observer.callback([{contentRect:{width:value}}]);});};
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
