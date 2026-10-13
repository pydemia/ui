import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { transform } from "esbuild";
import { JSDOM } from "jsdom";
const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "http://localhost/", pretendToBeVisual: true });
for (const key of ["window", "document", "HTMLElement", "Element", "Node", "Event", "MouseEvent", "KeyboardEvent", "MutationObserver", "DocumentFragment", "CustomEvent", "NodeFilter", "HTMLInputElement", "HTMLButtonElement", "HTMLFormElement"]) globalThis[key] = dom.window[key];
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
globalThis.getComputedStyle = dom.window.getComputedStyle; globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window); globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} }; globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createElement: h, act } = await import("react"), { createRoot } = await import("react-dom/client"), { flushSync } = await import("react-dom");
const { renderToStaticMarkup } = await import("react-dom/server");
const { PrismBlockEditor, PrismBlockDeletionDialog, PrismPositionBlockManagement, PrismCriteriaTag, preparePrismBlockSubmission, validatePrismBlockDraft, hasPrismBlockChanges, preparePrismBlockRemap } = await import("../dist/index.js");
const root = createRoot(document.getElementById("root")), render = node => act(async () => root.render(node)), clear = () => render(null);
const click = node => { assert.ok(node, "Expected control"); return act(async () => node.click()); };
const button = text => [...document.querySelectorAll('button')].find(node => node.textContent === text);
const wait = ms => act(async () => new Promise(resolve => setTimeout(resolve, ms)));
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
const categories = [{ id: "tech", name: "가상 기술" }], initial = { id: "i1", name: "가상 산업", description: "기존 합성 설명" };
const job = { id: "j1", name: "가상 직무", description: "기존 합성 직무 설명", categoryId: "tech", subJobs: [{ id: "s1", name: "가상 소직무", description: "가상 소직무 설명" }] };
const candidates = [job, { ...job, id: "j2", name: "대체 A" }, { ...job, id: "j3", name: "대체 B" }, { ...job, id: "deleted", change: "deleted" }, { ...job, id: "applying", change: "applying" }];
const affected = [{ id: "p1", company: "가상 회사", name: "가상 주직무 포지션", mapping: "primary", otherCriteria: { id: "j2", name: "대체 A" } }, { id: "p2", company: "가상 회사", name: "가상 보조직무 포지션", mapping: "secondary", otherCriteria: { id: "j3", name: "대체 B" } }];
let config, calls;
function editor() { return h(PrismBlockEditor, config); }
async function start(overrides = {}) { await clear(); calls = { submit: [], closed: [], name: [] }; config = { open: true, kind: "industry", mode: "edit", initial, categories, scopeKey: "one", checkDelayMs: 0,
    onOpenChange: value => calls.closed.push(value), onCheckName: async request => { calls.name.push(request); return true; }, onGenerateDescription: async () => "새 합성 설명", onLoadAffected: async () => [{ id: "p1", name: "가상 포지션", company: "가상 회사" }], onSubmit: async request => calls.submit.push(request), ...overrides }; await render(editor()); }
async function input(label, value) { const node = [...document.querySelectorAll('input,textarea')].find(node => node.getAttribute('aria-label') === label || document.querySelector('label[for="' + node.id + '"]')?.textContent.replace(/\*|필수/g, '') === label); assert.ok(node, label); await act(async () => { Object.getOwnPropertyDescriptor(node.tagName === "TEXTAREA" ? dom.window.HTMLTextAreaElement.prototype : dom.window.HTMLInputElement.prototype, "value").set.call(node, value); node.dispatchEvent(new Event('input', { bubbles: true })); }); }
async function select(label, option) { const node = [...document.querySelectorAll('[role="combobox"]')].find(node => document.querySelector('label[for="' + node.id + '"]')?.textContent.replace('*', '') === label); assert.ok(node, label);
    await act(async () => node.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })));
    const find = () => [...document.getElementById(node.getAttribute('aria-controls'))?.querySelectorAll('[role="option"]') ?? []].find(item => item.textContent === option);
    for (let attempt = 0; !find() && attempt < 20; attempt++) await wait(5);
    await click(find()); }
async function deletion(overrides = {}) { await clear(); calls = { submit: [], closed: [] }; config = { open: true, kind: "job", target: job, candidates, scopeKey: "one", onOpenChange: value => calls.closed.push(value), onLoadAffected: async () => affected, onConfirm: async request => calls.submit.push(request), ...overrides }; await render(h(PrismBlockDeletionDialog, config)); }
test.afterEach(clear);

test("block submission validates job descriptions and copies only public fields", () => {
    assert.match(validatePrismBlockDraft("job", { ...job, subJobs: [{ ...job.subJobs[0], description: " " }] }, categories), /이름과 설명/);
    assert.match(validatePrismBlockDraft("job", { ...job, categoryId: "missing" }, categories), /대분류/);
    assert.match(validatePrismBlockDraft("job", { ...job, subJobs: [job.subJobs[0], job.subJobs[0]] }, categories), /식별자/);
    const privateDraft = { ...job, name: "  가상 직무  ", secret: "must-not-copy", subJobs: [{ ...job.subJobs[0], name: "  소직무  ", description: "  설명  ", private: "omit" }] };
    assert.deepEqual(preparePrismBlockSubmission("job", privateDraft, categories, "j1"), { kind: "job", targetId: "j1", name: "가상 직무", description: job.description, categoryId: "tech", subJobs: [{ name: "소직무", description: "설명" }] });
    assert.equal(hasPrismBlockChanges({ ...job, subJobs: [{ ...job.subJobs[0], id: "different-ui-id" }] }, job), false);
});
test("job remap requires primary, permits secondary clear and rejects duplicate or stale options", () => {
    const result = preparePrismBlockRemap("job", "j1", affected, candidates, { p1: "j3", extra: "omit" }); assert.deepEqual(result, { p1: "j3" }); assert.equal(Object.isFrozen(result), true);
    for (const value of [{ p2: "j2" }, { p1: "j2" }, { p1: "deleted" }, { p1: "applying" }, { p1: "j1" }, { p1: "j3", p2: "j3" }]) assert.throws(() => preparePrismBlockRemap("job", "j1", affected, candidates, value));
    assert.throws(() => preparePrismBlockRemap("job", "j1", [{ ...affected[0], mapping: undefined }], candidates, {}), /구분/);
    assert.deepEqual(preparePrismBlockRemap("industry", "i1", [], candidates, {}), {});
    assert.throws(() => preparePrismBlockRemap("industry", "i1", affected, candidates, { p1: "j3" }), /각 포지션/);
});
test("version lists keep roles view-only, deleted counts excluded and scheduled/running locked", async () => {
    const opened = [], deleted = []; const props = { source: "TEMP", onSourceChange: () => {}, industries: [initial, { ...initial, id: "del", name: "삭제 산업", change: "deleted" }, { ...initial, id: "apply", name: "반영 산업", change: "applying" }], positions: [{ ...initial, id: "role", name: "직책" }], jobs: [job], categories, sync: { status: "editing", date: "2026.10.13" }, onOpen: request => opened.push(request), onDelete: (...args) => deleted.push(args) };
    await render(h(PrismPositionBlockManagement, props)); assert.match(document.querySelector('.prism-block-section h3').textContent, /산업 기준2/); await click(button("직책")); assert.equal(opened.at(-1).mode, "view"); await click(button("반영 산업반영중")); assert.equal(opened.at(-1).mode, "view"); assert.equal(button("삭제 산업삭제됨").disabled, true); assert.equal(document.querySelectorAll('.prism-criteria-delete').length, 2);
    for (const status of ["scheduled", "running"]) { await render(h(PrismPositionBlockManagement, { ...props, sync: { ...props.sync, status } })); assert.equal([...document.querySelectorAll('.prism-block-tags button')].every(node => node.disabled), true); assert.equal(document.querySelectorAll('.prism-criteria-delete').length, 0); }
    await render(h(PrismPositionBlockManagement, { ...props, source: "LIVE", sync: { ...props.sync, status: "synced" } })); assert.equal(document.querySelector('.prism-block-section header button'), null); await click(button("가상 산업")); assert.equal(opened.at(-1).mode, "view");
});
test("deleted/applying tags expose only permitted actions", () => {
    for (const change of ["deleted", "applying"]) { const html = renderToStaticMarkup(h(PrismCriteriaTag, { label: "가상", change, onEdit: () => {}, onDelete: () => {} })); assert.doesNotMatch(html, /aria-label="가상 삭제"/); if (change === "deleted") assert.match(html, /disabled/); }
});
test("unchanged edit skips name checking and cannot submit, role detail stays read-only", async () => {
    await start(); assert.equal(calls.name.length, 0); assert.equal(button("영향 포지션 확인").disabled, true);
    await start({ kind: "position", mode: "create" }); assert.equal(document.querySelector('input').readOnly, true); assert.ok(button("닫기")); assert.equal(button("생성"), undefined); assert.equal(button("AI로 다시 생성"), undefined);
    for (const change of ["applying", "deleted"]) { await start({ initial: { ...initial, change } }); assert.equal(document.querySelector('input').readOnly, true); assert.equal(button("영향 포지션 확인"), undefined); }
});
test("out-of-order name responses never authorize a different name", async () => {
    const first = deferred(), second = deferred(); const requests = [];
    await start({ mode: "create", initial: null, onCheckName: (request, context) => { requests.push({ request, context }); return request.name === "첫 이름" ? first.promise : second.promise; } });
    await input("기준 명", "첫 이름"); await wait(5); await input("기준 명", "둘째 이름"); await wait(5); assert.equal(requests[0].context.signal.aborted, true);
    await act(async () => first.resolve(true)); assert.equal(button("AI로 설명 생성").disabled, true);
    await act(async () => second.resolve(false)); assert.match(document.querySelector('.prism-block-check').textContent, /이미 등록/); assert.equal(button("AI로 설명 생성").disabled, true);
});
test("name-check errors can retry the same name without losing the draft", async () => {
    let count = 0; await start({ mode: "create", initial: null, onCheckName: async () => { if (++count === 1) throw new Error("Synthetic"); return true; } }); await input("기준 명", "새 기준"); await wait(8); assert.ok(button("다시 확인")); await click(button("다시 확인")); await wait(8); assert.equal(document.querySelector('input').value, "새 기준"); assert.equal(button("AI로 설명 생성").disabled, false);
});
test("create enables description only after successful generation and retains it on failure", async () => {
    let count = 0; await start({ mode: "create", initial: null, onGenerateDescription: async () => { if (++count === 2) throw new Error("Synthetic"); return "생성된 설명"; } }); assert.equal(document.querySelector('textarea').disabled, true);
    await input("기준 명", "새 기준"); await wait(8); await click(button("AI로 설명 생성")); await input("설명", "직접 수정한 설명"); await click(button("AI로 다시 생성")); assert.equal(document.querySelector('textarea').value, "직접 수정한 설명"); assert.match(document.querySelector('[role="alert"]').textContent, /생성하지 못/); await click(button("생성")); assert.equal(calls.submit[0].description, "직접 수정한 설명");
});
test("job editing requires at least one complete sub-job and supports adding/removing descriptions", async () => {
    await start({ kind: "job", initial: job }); await input("소직무 1 설명", ""); assert.equal(button("영향 포지션 확인").disabled, true); await input("소직무 1 설명", "변경 설명"); assert.equal(button("영향 포지션 확인").disabled, false);
    await click([...document.querySelectorAll('button')].find(node => node.getAttribute('aria-label') === "소직무 1 삭제")); assert.equal(button("영향 포지션 확인").disabled, true); await click(button("소직무 추가")); await input("소직무 1 명", "추가 직무"); await input("소직무 1 설명", "추가 설명"); assert.equal(button("영향 포지션 확인").disabled, false);
});
test("description generation overlays only its input and keeps the native textarea mounted", async () => {
    const pending = deferred(); await start({ onGenerateDescription: () => pending.promise }); const textarea = document.querySelector('textarea');
    await click(button("AI로 다시 생성")); const overlay = document.querySelector('.prism-textarea-overlay-area .prism-block-generation-overlay');
    assert.match(overlay.textContent, /설명을 생성하는 중/); assert.equal(overlay.getAttribute('role'), 'status'); assert.equal(document.querySelector('textarea'), textarea); assert.equal(textarea.value, initial.description); assert.equal(textarea.disabled, true); assert.equal(button('영향 포지션 확인').disabled, true);
    await act(async () => pending.resolve('생성 완료 설명')); assert.equal(document.querySelector('.prism-block-generation-overlay'), null); assert.equal(document.querySelector('textarea'), textarea); assert.equal(textarea.value, '생성 완료 설명'); assert.equal(textarea.disabled, false);
});
test("sub-job generation shows an empty placeholder or covers retained records without replacing them on failure", async () => {
    for (const empty of [true, false]) {
        const pending = deferred(); await start({ kind: 'job', initial: { ...job, subJobs: empty ? [] : job.subJobs }, onGenerateSubJobs: () => pending.promise });
        await click(document.querySelector('.prism-block-field .prism-block-generate button'));
        const overlay = document.querySelector('.prism-block-generate-area .prism-block-generation-overlay'); assert.ok(overlay); assert.equal(overlay.hasAttribute('data-empty'), empty); assert.equal(document.querySelector('.prism-textarea-overlay-area .prism-block-generation-overlay'), null);
        assert.equal(document.querySelectorAll('.prism-block-sub-job').length, empty ? 0 : 1); await act(async () => pending.reject(new Error('Synthetic generation failure'))); assert.equal(document.querySelector('.prism-block-generation-overlay'), null); assert.equal(document.querySelectorAll('.prism-block-sub-job').length, empty ? 0 : 1); if (!empty) assert.equal(document.querySelector('input[aria-label="소직무 1 설명"]').value, job.subJobs[0].description); assert.match(document.querySelector('[role="alert"]').textContent, /소직무를 생성하지 못/);
    }
});
test("editing reviews affected positions and can return before confirming immutable public fields", async () => {
    await start(); await input("설명", "변경 설명"); await click(button("영향 포지션 확인")); assert.ok(button("수정 확정")); assert.equal(calls.submit.length, 0); assert.match(document.querySelector('.prism-block-summary').textContent, /영향 포지션1건/);
    await click(button("이전")); assert.equal(document.querySelector('textarea').value, "변경 설명"); await input("설명", "다시 변경"); await click(button("영향 포지션 확인")); await click(button("수정 확정")); assert.deepEqual(calls.submit, [{ kind: "industry", targetId: "i1", name: initial.name, description: "다시 변경" }]); assert.deepEqual(calls.closed, [false]);
});
test("failed impact lookup preserves input and cannot become zero affected success", async () => {
    let count = 0; await start({ onLoadAffected: async () => { if (++count === 1) throw new Error("Synthetic"); return []; } }); await input("설명", "변경 설명"); await click(button("영향 포지션 확인")); assert.equal(button("수정 확정"), undefined); assert.equal(document.querySelector('textarea').value, "변경 설명"); assert.match(document.querySelector('[role="alert"]').textContent, /불러오지 못/);
    await click(button("영향 포지션 확인")); assert.match(document.querySelector('tbody').textContent, /영향 받는 포지션이 없습니다/); await click(button("수정 확정")); assert.equal(calls.submit.length, 1);
});
test("save failure keeps confirmation and retry uses the reviewed draft", async () => {
    let count = 0; await start({ onSubmit: async request => { calls.submit.push(request); if (++count === 1) throw new Error("Synthetic"); } }); await input("설명", "변경 설명"); await click(button("영향 포지션 확인")); await click(button("수정 확정")); assert.ok(button("수정 확정")); assert.deepEqual(calls.closed, []); await click(button("수정 확정")); assert.equal(calls.submit.length, 2); assert.deepEqual(calls.submit[0], calls.submit[1]); assert.deepEqual(calls.closed, [false]);
});
test("generation, impact and submission are fenced across scope, permission and unmount", async () => {
    for (const phase of ["generation", "impact", "submit"]) for (const change of [{ scopeKey: "two" }, { readOnly: true }, null]) {
        const pending = deferred(); let signal; const service = (_request, context) => { signal = context.signal; return pending.promise; };
        await start({ ...(phase === "generation" ? { onGenerateDescription: service } : phase === "impact" ? { onLoadAffected: service } : { onSubmit: service }) });
        if (phase === "generation") await click(button("AI로 다시 생성")); else { await input("설명", "변경 설명"); await click(button("영향 포지션 확인")); if (phase === "submit") await click(button("수정 확정")); }
        if (change) { config = { ...config, ...change }; await render(editor()); } else await clear(); assert.equal(signal.aborted, true);
        await act(async () => pending.resolve(phase === "generation" ? "옛 생성" : phase === "impact" ? [] : undefined)); assert.deepEqual(calls.closed, []); assert.equal(button("수정 확정"), undefined); if (change) assert.notEqual(document.querySelector('textarea')?.value, "옛 생성");
    }
});
test("duplicate submission and close while pending cannot bypass the frozen confirmation", async () => {
    const pending = deferred(); let count = 0; await start({ onSubmit: async () => { count++; return pending.promise; } }); await input("설명", "변경 설명"); await click(button("영향 포지션 확인")); const confirm = button("수정 확정"); await act(async () => { confirm.click(); confirm.click(); document.querySelector('.prism-dialog-close').click(); }); assert.equal(count, 1); assert.deepEqual(calls.closed, []); await act(async () => pending.resolve()); assert.deepEqual(calls.closed, [false]);
});
test("completion callback replacing scope cannot close or error the new editor", async () => {
    await start({ onSubmitted: () => { config = { ...config, scopeKey: "replacement" }; flushSync(() => root.render(editor())); throw new Error("Synthetic callback"); } }); await input("설명", "변경 설명"); await click(button("영향 포지션 확인")); await click(button("수정 확정")); assert.deepEqual(calls.closed, []); assert.equal(document.querySelector('[role="alert"]'), null); assert.equal(document.querySelector('textarea').value, initial.description);
});
test("deletion impact failure blocks confirmation and supports explicit retry", async () => {
    let count = 0; await deletion({ onLoadAffected: async () => { if (++count === 1) throw new Error("Synthetic"); return []; } }); assert.equal(button("삭제 및 재매핑").disabled, true); assert.equal(document.querySelector('tbody'), null); await click(button("다시 조회")); assert.equal(button("삭제 및 재매핑").disabled, false); await click(button("삭제 및 재매핑")); assert.deepEqual(calls.submit, [{ kind: "job", targetId: "j1", remap: {} }]);
});
test("job deletion rejects other-job conflicts, omits cleared secondary and excludes stale candidates", async () => {
    await deletion(); await select("가상 주직무 포지션 재매핑 기준", "대체 A"); assert.equal(button("삭제 및 재매핑").disabled, true); assert.match(document.querySelector('[role="alert"]').textContent, /중복/);
    await select("가상 주직무 포지션 재매핑 기준", "대체 B"); assert.equal(button("삭제 및 재매핑").disabled, false); await select("가상 보조직무 포지션 재매핑 기준", "대체 A"); await click(button("보조직무 해제")); await click(button("삭제 및 재매핑")); assert.deepEqual(calls.submit[0].remap, { p1: "j3" });
});
test("no replacement options is a blocked mapping, not an impact lookup failure", async () => {
    await deletion({ candidates: [job] }); assert.equal(document.querySelectorAll('tbody tr').length, 2); assert.equal(button("삭제 및 재매핑").disabled, true); assert.equal(button("다시 조회"), undefined);
});
test("pending deletion aborts changed targets and cannot notify a new scope", async () => {
    const pending = deferred(); let signal, count = 0; await deletion({ onConfirm: (_request, context) => { signal = context.signal; count++; return pending.promise; } }); await select("가상 주직무 포지션 재매핑 기준", "대체 B"); const confirm = button("삭제 및 재매핑"); await act(async () => { confirm.click(); confirm.click(); }); assert.equal(count, 1);
    config = { ...config, target: candidates[1] }; await render(h(PrismBlockDeletionDialog, config)); assert.equal(signal.aborted, true); await act(async () => pending.resolve()); assert.deepEqual(calls.closed, []); assert.match(document.querySelector('.prism-block-summary').textContent, /대체 A/);
});
const compiled = await transform(await readFile(new URL('../../../apps/docs/src/prism/position-blocks-demo.tsx', import.meta.url), 'utf8'), { loader: 'tsx', jsx: 'automatic', format: 'esm' });
const portable = compiled.code.replace(/\bfrom\s+["']([^"']+)["']/g, (_match, specifier) => { assert.ok(['react', 'react/jsx-runtime', '@pydemia/prism'].includes(specifier)); return 'from ' + JSON.stringify(import.meta.resolve(specifier)); });
const { PositionBlocksExample } = await import('data:text/javascript;base64,' + Buffer.from(portable).toString('base64'));
test("complete synthetic example edits a job after impact review and remaps a deleted job", async () => {
    await render(h(PositionBlocksExample, { initialMode: "job" })); await input("소직무 1 설명", "검증한 합성 변경"); await click(button("영향 포지션 확인")); await wait(80); await click(button("수정 확정")); await wait(80); assert.match(document.body.textContent, /합성 직무 기준 수정 완료/);
    await clear(); await render(h(PositionBlocksExample, { initialMode: "remap" })); await wait(80); await select("가상 기술전략담당 재매핑 기준", "사업 운영"); await click(button("삭제 및 재매핑")); await wait(80); assert.match(document.body.textContent, /합성 기준 삭제 및 1건 재매핑 완료/); assert.equal(button("기술 전략삭제됨").disabled, true);
});
