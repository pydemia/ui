import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";

const dom=new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>',{url:"http://localhost/",pretendToBeVisual:true});
for(const key of ["window","document","HTMLElement","Element","Node","Event","KeyboardEvent","MouseEvent","MutationObserver","HTMLInputElement","HTMLFormElement","DocumentFragment","CustomEvent","NodeFilter"])globalThis[key]=dom.window[key];
Object.defineProperty(globalThis,"navigator",{configurable:true,value:dom.window.navigator});
globalThis.getComputedStyle=dom.window.getComputedStyle;globalThis.requestAnimationFrame=dom.window.requestAnimationFrame.bind(dom.window);globalThis.cancelAnimationFrame=dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.ResizeObserver=class {observe(){}unobserve(){}disconnect(){}};
globalThis.IS_REACT_ACT_ENVIRONMENT=true;
const {createElement:h,act,useState}=await import("react");const {createRoot}=await import("react-dom/client");const {renderToStaticMarkup}=await import("react-dom/server");
const {PrismRichText,PrismRiskTable,PrismCompensationGrid,PrismContextForm,PrismDirectoryTable,PrismNoticeForm,PrismUserForm,PrismAutocomplete,PrismChipAutocomplete,PrismPanel,PrismInput,PrismSelect}=await import("../dist/index.js");
const root=createRoot(document.getElementById("root"));
const render=(Component,props)=>renderToStaticMarkup(h(Component,props));

test("select participates in native form validation and successful controls",async()=>{
    const options=[{value:"tech",label:"기술"},{value:"finance",label:"재무"}];
    const props={label:"분야",name:"field",required:true,options};
    await act(async()=>root.render(h("form",{},h(PrismSelect,props))));
    const form=document.querySelector('form');const trigger=document.querySelector('[role="combobox"]');
    await act(async()=>assert.equal(form.checkValidity(),false));assert.equal(document.activeElement,trigger);assert.equal(trigger.getAttribute('aria-invalid'),'true');assert.match(document.querySelector('[role="alert"]').textContent,/선택/);
    await act(async()=>root.render(h("form",{},h(PrismSelect,{...props,value:"finance",readOnly:true}))));
    assert.equal(form.checkValidity(),true);assert.equal(new dom.window.FormData(form).get("field"),"finance");
    await act(async()=>trigger.click());assert.equal(document.querySelector('[role="listbox"]'),null);
    await act(async()=>root.render(h("form",{},h(PrismSelect,{...props,value:"finance",disabled:true}))));
    assert.equal(new dom.window.FormData(form).has("field"),false);
});

test("select reset restores uncontrolled default and preserves controlled ownership",async()=>{
    const options=[{value:"tech",label:"기술"},{value:"finance",label:"재무"}];
    await act(async()=>root.render(h("form",{},h(PrismSelect,{key:"uncontrolled",label:"분야",name:"field",defaultValue:"tech",options}))));
    await act(async()=>document.querySelector('[role="combobox"]').click());
    await act(async()=>document.querySelector('[role="option"]:last-of-type').click());
    assert.equal(new dom.window.FormData(document.querySelector('form')).get("field"),"finance");
    await act(async()=>document.querySelector('form').reset());
    assert.equal(new dom.window.FormData(document.querySelector('form')).get("field"),"tech");
    await act(async()=>root.render(h("form",{},h(PrismSelect,{key:"controlled",label:"분야",name:"field",defaultValue:"tech",value:"finance",options}))));
    await act(async()=>document.querySelector('form').reset());
    assert.equal(document.querySelector('[role="combobox"]').textContent,"재무");
    assert.equal(new dom.window.FormData(document.querySelector('form')).get("field"),"finance");
});

test("rich text removes executable HTML and unsafe URLs while preserving allowed marks",()=>{
    const source='<script>alert(1)</script><img src="https://invalid.test/x" onerror="alert(2)" /><span onclick="alert(3)" style="background:url(x)">Safe</span><color-blue>Blue</color><highlight-yellow>Yellow</highlight> [unsafe](javascript:alert(4)) [profile](profile://demo)';
    const html=render(PrismRichText,{source,onAction(){}});const doc=new JSDOM(html).window.document;
    assert.equal(doc.querySelectorAll('script,img,[onclick],[onerror],[style]').length,0);
    assert.equal(doc.querySelector('.prism-rich-color-blue').textContent,"Blue");assert.equal(doc.querySelector('.prism-rich-highlight-yellow').textContent,"Yellow");
    assert.equal(doc.querySelectorAll('a[href^="javascript:"]').length,0);
    const action=new JSDOM(render(PrismRichText,{source:'[profile](profile://demo)',onAction(){}})).window.document;assert.equal(action.querySelector('button').textContent,"profile");
    const panel=render(PrismRichText,{source:'[profile](profile://demo)',panel:true,onAction(){}});assert.doesNotMatch(panel,/<button/);assert.match(panel,/<strong>profile<\/strong>/);
});
test("risk absence merges only wholly missing columns and zero compensation is preserved",()=>{
    const doc=new JSDOM(render(PrismRiskTable,{items:[{id:"a",label:"A",latent:true,manifest:null},{id:"b",label:"B",latent:false,manifest:null},{id:"c",label:"C",latent:null,manifest:null}]})).window.document;
    assert.equal(doc.querySelectorAll('td[rowspan="3"]').length,1);assert.equal(doc.querySelectorAll('tbody td').length,4);assert.equal(doc.querySelectorAll('[aria-label="해당 없음"]').length,1);
    const table=new JSDOM(render(PrismCompensationGrid,{years:["24년","25년"],rows:[{label:"총보상",values:[0,{won:null,foreign:{currency:"USD",amount:"1,000"}}]}]})).window.document;
    assert.equal(table.querySelector('tbody td').textContent,"0");assert.match(table.querySelector('tbody').textContent,/USD 1,000/);
});
test("context limits block new options but allow deselection and require text before submit",async()=>{
    let next;const fields=[{key:"issue",label:"현안",type:"textarea",required:true},{key:"options",label:"분야",type:"options",maxSelections:1,options:[{value:"a",label:"A"},{value:"b",label:"B"}]}];
    const props={fields,values:{issue:"",options:["a"]},onValueChange:v=>next=v,onSubmit(){throw new Error("invalid submission");}};
    await act(async()=>root.render(h(PrismContextForm,props)));
    assert.equal(document.querySelector('button[type="submit"]').disabled,true);const checkbox=[...document.querySelectorAll('[role="checkbox"]')];assert.equal(checkbox[0].disabled,false);assert.equal(checkbox[1].disabled,true);
    await act(async()=>checkbox[0].click());assert.deepEqual(next.options,[]);
    await act(async()=>root.render(h(PrismContextForm,{...props,values:{issue:"현안 입력",options:[]}})));assert.equal(document.querySelector('button[type="submit"]').disabled,false);
});
test("directory select-all preserves other pages and cannot select locked rows",async()=>{
    let selected;const rows=[{id:"a",name:"A"},{id:"b",name:"B",locked:true},{id:"c",name:"C"}];
    const props={title:"목록",rows,columns:[{id:"name",label:"이름",cell:r=>r.name,sortable:true}],getRowId:r=>r.id,getRowLabel:r=>r.name,selected:["off-page"],onSelectionChange:v=>selected=v,isRowSelectable:r=>!r.locked,onSortChange(){}};
    await act(async()=>root.render(h(PrismDirectoryTable,props)));await act(async()=>document.querySelector('[role="checkbox"]').click());assert.deepEqual(selected,["off-page","a","c"]);
    const controls=[...document.querySelectorAll('tbody [role="checkbox"]')];assert.equal(controls[1].disabled,true);
    await act(async()=>root.render(h(PrismDirectoryTable,{...props,selected})));await act(async()=>document.querySelector('[role="checkbox"]').click());assert.deepEqual(selected,["off-page"]);
});
test("notice popup switch clears dates and role change clears inapplicable group",async()=>{
    let next;const value={title:"제목",content:"본문",companyIds:[],allCompanies:true,popup:true,start:"2026-10-01",end:"2026-10-31"};
    await act(async()=>root.render(h(PrismNoticeForm,{value,onValueChange:v=>next=v,companies:[],files:[],onFilesSelected(){},onSubmit(){},onCancel(){}})));
    await act(async()=>document.querySelector('[role="switch"]').click());assert.equal(next.popup,false);assert.equal(next.start,null);assert.equal(next.end,null);
    await act(async()=>root.render(h(PrismUserForm,{value:{email:"demo@example.com",roleId:"member",companyGroupId:"demo"},onValueChange:v=>next=v,roles:[{value:"all",label:"그룹 담당"},{value:"member",label:"멤버 담당",needsCompanyGroup:true}],companyGroups:[{id:"demo",name:"가상 그룹",companies:["가상 회사"]}],onSubmit(){},onCancel(){}})));
    await act(async()=>document.querySelector('input[value="all"]').click());assert.equal(next.roleId,"all");assert.equal(next.companyGroupId,"");
});
test("autocomplete skips disabled options, ignores composing Enter and accepts free text only when enabled",async()=>{
    let chosen;const props={label:"분야",options:[{value:"locked",label:"잠긴 분야",disabled:true},{value:"allowed",label:"허용 분야"}],value:null,onValueChange:v=>chosen=v};
    await act(async()=>root.render(h(PrismAutocomplete,props)));
    const input=document.querySelector('[role="combobox"]');
    await act(async()=>input.dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowDown",bubbles:true})));
    assert.match(input.getAttribute("aria-activedescendant"),/option-1$/);
    await act(async()=>input.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",isComposing:true,bubbles:true})));
    assert.equal(chosen,undefined);
    await act(async()=>input.dispatchEvent(new KeyboardEvent("keydown",{key:"Enter",bubbles:true})));
    assert.equal(chosen,"allowed");
    const plain=render(PrismAutocomplete,{...props,value:"목록 밖",freeSolo:true});assert.match(plain,/value="목록 밖"/);
    const restricted=render(PrismAutocomplete,{...props,value:"목록 밖"});assert.doesNotMatch(restricted,/value="목록 밖"/);
});
test("clearing a selected chip restores its labelled search input and emits null",async()=>{
    function Demo(){const [value,setValue]=useState("one");return h(PrismChipAutocomplete,{label:"후보",options:[{value:"one",label:"가상 후보"}],value,onValueChange:setValue});}
    await act(async()=>root.render(h(Demo)));
    assert.equal(document.querySelector('[role="group"]').getAttribute("aria-labelledby"),document.querySelector('label').id);
    await act(async()=>document.querySelector('button[aria-label="가상 후보 선택 해제"]').click());
    const input=document.querySelector('[role="combobox"]');assert.ok(input);assert.equal(document.activeElement,input);
    assert.equal(document.querySelector('label').htmlFor,input.id);
});
test("resizing a controlled panel emits bounded intent and waits for its owner",async()=>{
    let next;const props={title:"상세",open:true,onOpenChange(){},resizable:true,width:440,minWidth:320,maxWidth:600,onWidthChange:value=>next=value,children:"본문"};
    await act(async()=>root.render(h(PrismPanel,props)));
    const separator=document.querySelector('[role="separator"]');
    await act(async()=>separator.dispatchEvent(new KeyboardEvent("keydown",{key:"ArrowLeft",bubbles:true})));
    assert.equal(next,456);assert.equal(separator.getAttribute("aria-valuenow"),"440");
    await act(async()=>root.render(h(PrismPanel,{...props,width:next})));
    assert.equal(separator.getAttribute("aria-valuenow"),"456");
    await act(async()=>separator.dispatchEvent(new KeyboardEvent("keydown",{key:"End",bubbles:true})));assert.equal(next,600);
    await act(async()=>separator.dispatchEvent(new KeyboardEvent("keydown",{key:"Home",bubbles:true})));assert.equal(next,320);
    await act(async()=>root.render(h(PrismPanel,{...props,expanded:true})));assert.equal(document.querySelector('[role="separator"]'),null);
});
test("input clear retains focus and never mutates a consumer-owned value",async()=>{
    let count=0;const props={label:"검색",value:"가상",onChange(){},onClear:()=>count++};
    await act(async()=>root.render(h(PrismInput,props)));
    await act(async()=>document.querySelector('button[aria-label="검색 지우기"]').click());
    const input=document.querySelector('input');assert.equal(count,1);assert.equal(input.value,"가상");assert.equal(document.activeElement,input);
    await act(async()=>root.render(h(PrismInput,{...props,readOnly:true})));assert.equal(document.querySelector('button'),null);
});
test.after(async()=>{await act(async()=>root.unmount());dom.window.close();});
