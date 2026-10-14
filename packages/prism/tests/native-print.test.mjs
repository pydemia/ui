import assert from 'node:assert/strict';
import test from 'node:test';
import {JSDOM} from 'jsdom';
import {preparePrismPrintSession} from '../dist/index.js';

// JSDOM does not navigate srcdoc or open OS dialogs. Simulate navigation and
// native invocation only; live browser resource/print checks remain separate.
function fixture({fonts=Promise.resolve(),fontError=false,assignmentError=false}={}){
 const dom=new JSDOM('<!doctype html><html><head><title>Host application</title></head><body><h1>Host toolbar</h1><button id="focus">owner</button><article id="profile"><h2>Profile document</h2><p>Supplied text</p><button data-prism-export-exclude>UI control</button><script>bad()</script></article></body></html>',{url:'https://example.test/',pretendToBeVisual:true});
 const {document:doc}=dom.window;Object.defineProperty(doc,'fonts',{value:{ready:Promise.resolve()}});
 let calls=0;
 Object.defineProperty(dom.window.HTMLIFrameElement.prototype,'srcdoc',{configurable:true,set(html){
  if(assignmentError)throw new TypeError('Trusted Types assignment blocked');
  const frameDoc=this.contentDocument;frameDoc.open();frameDoc.write(html);
  Object.defineProperty(frameDoc,'fonts',{value:{ready:fonts,*[Symbol.iterator](){if(fontError)yield {status:'error'};}}});frameDoc.close();
  this.contentWindow.print=()=>{calls++;};this.contentWindow.focus=()=>this.focus();
  queueMicrotask(()=>this.dispatchEvent(new dom.window.Event('load')));
 }});
 return {dom,doc,root:doc.getElementById('profile'),calls:()=>calls,frame:()=>doc.querySelector('[data-prism-print-frame]')};
}
test('a prepared document excludes application chrome and scripts; explicit print and afterprint release only its frame',async()=>{
 const f=fixture(),before=f.root.outerHTML;f.doc.getElementById('focus').focus();let after=0;
 const session=await preparePrismPrintSession(f.root,{title:'Candidate print',cssText:'article{color:#222}',onAfterPrint:()=>after++});
 const frame=f.frame(),printed=frame.contentDocument;
 assert.equal(printed.title,'Candidate print');assert.equal(f.doc.title,'Host application');
 assert.equal(printed.querySelectorAll('script,[data-prism-export-exclude]').length,0);assert.ok(!printed.body.textContent.includes('Host toolbar'));
 assert.equal(frame.getAttribute('sandbox'),'allow-same-origin allow-modals');assert.equal(frame.getAttribute('aria-hidden'),'true');
 assert.equal(f.calls(),0);assert.equal(session.requested,false);session.print();assert.equal(f.calls(),1);assert.equal(session.requested,true);
 assert.throws(()=>session.print(),/already requested/);frame.contentWindow.dispatchEvent(new f.dom.window.Event('afterprint'));
 assert.equal(after,1);assert.equal(session.disposed,true);assert.equal(f.frame(),null);assert.equal(f.doc.activeElement.id,'focus');assert.equal(f.root.outerHTML,before);
 session.dispose();assert.equal(after,1);f.dom.window.close();
});
test('font readiness is awaited; cancellation removes the frame and late readiness cannot invoke printing',async()=>{
 let ready;const f=fixture({fonts:new Promise(resolve=>ready=resolve)}),controller=new AbortController();
 const running=preparePrismPrintSession(f.root,{title:'Candidate print',cssText:'',signal:controller.signal});
 while(!f.frame())await new Promise(resolve=>setTimeout(resolve,1));assert.equal(f.calls(),0);controller.abort();
 await assert.rejects(running,{name:'AbortError'});ready();await new Promise(resolve=>setTimeout(resolve,10));assert.equal(f.frame(),null);assert.equal(f.calls(),0);f.dom.window.close();
});
test('asset failures and preparation timeout never yield a session or native request',async()=>{
 const f=fixture();await assert.rejects(preparePrismPrintSession(f.root,{title:'Candidate',cssText:'article{background:url(photo.png)}',loadAsset:async()=>{throw new Error('asset denied');}}),/asset denied/);
 assert.equal(f.frame(),null);assert.equal(f.calls(),0);f.dom.window.close();
 const slow=fixture({fonts:new Promise(()=>{})});await assert.rejects(preparePrismPrintSession(slow.root,{title:'Candidate',cssText:'',readyTimeoutMs:100}),{name:'TimeoutError'});
 assert.equal(slow.frame(),null);assert.equal(slow.calls(),0);slow.dom.window.close();
});
test('failed font decoding and rejected srcdoc assignment clean up without changing parent content',async()=>{
 for(const options of [{fontError:true},{assignmentError:true}]){
  const f=fixture(options),before=f.root.outerHTML;
  await assert.rejects(preparePrismPrintSession(f.root,{title:'Candidate',cssText:''}),options.fontError?/font could not be loaded/:/Trusted Types/);
  assert.equal(f.frame(),null);assert.equal(f.calls(),0);assert.equal(f.root.outerHTML,before);f.dom.window.close();
 }
});
test('explicit disposal or later owner cancellation prevents reuse of a ready document',async()=>{
 for(const cancel of [false,true]){
  const f=fixture(),controller=new AbortController();const session=await preparePrismPrintSession(f.root,{title:'Candidate',cssText:'',signal:controller.signal});
  if(cancel)controller.abort();else session.dispose();assert.equal(session.disposed,true);assert.equal(f.frame(),null);assert.throws(()=>session.print());assert.equal(f.calls(),0);f.dom.window.close();
 }
});
