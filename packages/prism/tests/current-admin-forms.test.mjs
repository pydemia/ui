import assert from "node:assert/strict";
import test from "node:test";
import {JSDOM} from "jsdom";
const dom=new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>',{url:"http://localhost/",pretendToBeVisual:true});
for(const key of ["window","document","HTMLElement","Element","Node","Event","FocusEvent","KeyboardEvent","MouseEvent","MutationObserver","HTMLInputElement","DocumentFragment","CustomEvent","NodeFilter"])globalThis[key]=dom.window[key];
Object.defineProperty(globalThis,"navigator",{configurable:true,value:dom.window.navigator});globalThis.getComputedStyle=dom.window.getComputedStyle;globalThis.requestAnimationFrame=dom.window.requestAnimationFrame.bind(dom.window);globalThis.cancelAnimationFrame=dom.window.cancelAnimationFrame.bind(dom.window);globalThis.ResizeObserver=class{observe(){}unobserve(){}disconnect(){}};globalThis.IS_REACT_ACT_ENVIRONMENT=true;
const {createElement:h,act,useState}=await import("react"),{createRoot}=await import("react-dom/client");
const {PrismCompanyGroupForm,PrismUserForm}=await import("../dist/index.js");
const root=createRoot(document.getElementById("root"));
const options=[{value:"one",label:"가상전자"},{value:"two",label:"예시사업"}];
const tick=()=>new Promise(resolve=>setTimeout(resolve,10));
const input=label=>[...document.querySelectorAll('.prism-field')].find(field=>field.querySelector('label')?.textContent.startsWith(label))?.querySelector('input');
const save=()=>document.querySelector('button[type="submit"]');
async function type(label,value){await act(async()=>{const element=input(label);Object.getOwnPropertyDescriptor(dom.window.HTMLInputElement.prototype,"value").set.call(element,value);element.dispatchEvent(new Event("input",{bubbles:true}));});}
async function blur(label){await act(async()=>{input(label).dispatchEvent(new FocusEvent("focusout",{bubbles:true}));await tick();});}
test("create group rejects stale name responses and waits for the current validated name",async()=>{
    const requests=[];function Demo(){const[value,setValue]=useState({name:"",companyIds:["one"]});return h(PrismCompanyGroupForm,{mode:"create",value,onValueChange:setValue,companies:options,validateName:(name,{signal})=>new Promise(resolve=>requests.push({name,signal,resolve})),onSubmit(){},onCancel(){}});}
    await act(async()=>root.render(h(Demo)));assert.equal(save().disabled,true);
    await type("회사 그룹명","first");await blur("회사 그룹명");assert.equal(requests[0].name,"first");assert.equal(save().disabled,true);
    await type("회사 그룹명","second");assert.equal(requests[0].signal.aborted,true);
    await act(async()=>{requests[0].resolve(true);await tick();});assert.equal(save().disabled,true);
    await blur("회사 그룹명");await act(async()=>{requests[1].resolve(false);await tick();});assert.ok(document.querySelector('[role="alert"]'));assert.equal(save().disabled,true);
    await type("회사 그룹명","third");await blur("회사 그룹명");await act(async()=>{requests[2].resolve(true);await tick();});assert.equal(save().disabled,false);assert.equal(document.querySelector('.prism-group-name').dataset.validation,"available");
    assert.equal(document.querySelector('form').checkValidity(),true,"empty add-picker is not the required collection value");
    await act(async()=>root.render(null));assert.equal(requests[2].signal.aborted,true);
});
test("detail group edits only companies without a name request and debounces a renamed value",async()=>{
    let update;const calls=[];const initial={name:"기준 그룹",companyIds:["one"]};function Demo(){const[value,setValue]=useState(initial);update=setValue;return h(PrismCompanyGroupForm,{mode:"detail",initialValue:initial,value,onValueChange:setValue,companies:options,nameCheckDelayMs:25,validateName:async name=>{calls.push(name);return true;},onSubmit(){},onCancel(){}});}
    await act(async()=>root.render(h(Demo)));assert.equal(save().disabled,true);
    await act(async()=>update({...initial,companyIds:["one","two"]}));assert.equal(save().disabled,false);assert.deepEqual(calls,[]);
    await type("회사 그룹명","새 이름");assert.equal(save().disabled,true);assert.deepEqual(calls,[]);
    await act(async()=>new Promise(resolve=>setTimeout(resolve,45)));assert.deepEqual(calls,["새 이름"]);assert.equal(save().disabled,false);
    await act(async()=>root.render(null));
});
test("a failed name request can be retried without changing the draft",async()=>{
    let calls=0;function Demo(){const[value,setValue]=useState({name:"재확인 그룹",companyIds:["one"]});return h(PrismCompanyGroupForm,{mode:"create",value,onValueChange:setValue,companies:options,validateName:async()=>{if(++calls===1)throw new Error("synthetic network failure");return true;},onSubmit(){},onCancel(){}});}
    await act(async()=>root.render(h(Demo)));await blur("회사 그룹명");assert.equal(save().disabled,true);assert.equal(document.querySelector('.prism-group-name').dataset.validation,"error");
    await act(async()=>{[...document.querySelectorAll('button')].find(button=>button.textContent==="다시 확인").click();await tick();});
    assert.equal(calls,2);assert.equal(input("회사 그룹명").value,"재확인 그룹");assert.equal(save().disabled,false);assert.equal(document.querySelector('[role="alert"]'),null);await act(async()=>root.render(null));
});
test("group submission stays busy, prevents duplicate work and reports a rejected save",async()=>{
    let rejectSave,calls=0;function Demo(){const[value,setValue]=useState({name:"확인된 그룹",companyIds:["one"]});return h(PrismCompanyGroupForm,{mode:"create",nameStatus:"available",value,onValueChange:setValue,companies:options,onSubmit:()=>{calls++;return new Promise((_,reject)=>{rejectSave=reject;});},onCancel(){}});}
    await act(async()=>root.render(h(Demo)));assert.equal(save().disabled,false);
    await act(async()=>{document.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));document.querySelector('form').dispatchEvent(new Event('submit',{bubbles:true,cancelable:true}));});
    assert.equal(calls,1);assert.equal(save().disabled,true);assert.equal(input("회사 그룹명").disabled,true);
    await act(async()=>{rejectSave(new Error("synthetic save failure"));await tick();});assert.equal(save().disabled,false);assert.match(document.querySelector('[role="alert"]').textContent,/저장하지 못/);
    await act(async()=>root.render(null));
});
test("current user requires all basic fields, validates email and retains the full model on role change",async()=>{
    let value,update;const roles=[{value:"member",label:"멤버 담당",needsCompanyGroup:true},{value:"system",label:"운영자"}];function Demo(){const[state,setState]=useState({email:"",lastName:"",firstName:"",companyId:"",division:"",roleId:"member",companyGroupId:"group"});value=state;update=setState;return h(PrismUserForm,{mode:"create",value:state,onValueChange:setState,companies:options,roles,companyGroups:[{id:"group",name:"가상 그룹",status:"활성",companies:["가상전자"]}],onSubmit(){},onCancel(){}});}
    await act(async()=>root.render(h(Demo)));for(const label of ["성","이름","본부/팀"])assert.ok(input(label));assert.equal(save().disabled,true);
    await type("이메일","demo@sk.com");await blur("이메일");await type("성","김");await type("이름","가상");await type("본부/팀","연구팀");assert.equal(save().disabled,true);
    await act(async()=>update({...value,companyId:"one"}));assert.equal(save().disabled,false);
    await act(async()=>document.querySelector('input[type="radio"][value="system"]').click());assert.equal(value.companyGroupId,"");assert.equal(value.lastName,"김");assert.equal(value.division,"연구팀");assert.equal(save().disabled,false);
    await type("본부/팀","  ");assert.equal(save().disabled,true);await act(async()=>root.render(null));
});
test("detail user locks current basic information and enables only a changed role or group",async()=>{
    let next;const initial={email:"demo@sk.com",lastName:"김",firstName:"가상",companyId:"one",division:"연구팀",roleId:"member",companyGroupId:"group"};
    const props={mode:"detail",initialValue:initial,value:initial,onValueChange:value=>{next=value;},companies:options,roles:[{value:"member",label:"멤버",needsCompanyGroup:true},{value:"system",label:"운영자"}],companyGroups:[{id:"group",name:"가상 그룹",status:"비활성",companies:["가상전자"]}],detail:{status:"활성"},onSubmit(){},onCancel(){}};
    await act(async()=>root.render(h(PrismUserForm,props)));assert.equal(save().disabled,true);for(const label of ["이메일","성","이름","본부/팀"])assert.equal(input(label).readOnly,true);
    const company=[...document.querySelectorAll('[role="combobox"]')].find(el=>el.id===document.querySelectorAll('.prism-domain-form-grid label')[2].htmlFor);assert.equal(company.getAttribute('aria-readonly'),"true");
    assert.match(document.querySelector('.prism-user-group-option').textContent,/비활성/);
    await act(async()=>document.querySelector('input[type="radio"][value="system"]').click());assert.equal(next.companyGroupId,"");
    await act(async()=>root.render(h(PrismUserForm,{...props,value:next})));assert.equal(save().disabled,false);await act(async()=>root.render(null));
});
