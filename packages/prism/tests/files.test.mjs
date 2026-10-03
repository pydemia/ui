import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: "http://localhost/", pretendToBeVisual: true });
for (const key of ["window", "document", "HTMLElement", "Element", "Node", "Event", "MouseEvent", "File"]) globalThis[key] = dom.window[key];
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createElement: h, act } = await import("react");
const { createRoot } = await import("react-dom/client");
const { PrismFileDropzone, PrismFileAttach } = await import("../dist/index.js");
const root = createRoot(document.getElementById("root"));
const file = (name, size = 10, type = "application/pdf") => new File([new Uint8Array(size)], name, { type });
async function select(files) {
    const input = document.querySelector('input[type="file"]');
    Object.defineProperty(input, "files", { configurable: true, value: files });
    await act(async () => input.dispatchEvent(new Event("change", { bubbles: true })));
    assert.equal(input.value, "", "same-file re-selection must remain possible");
}
async function drag(element, type, files = [], types = ["Files"]) {
    const event = new Event(type, { bubbles: true, cancelable: true });
    Object.defineProperty(event, "dataTransfer", { value: { files, types } });
    await act(async () => element.dispatchEvent(event));
    return event;
}

test("mixed selections accept valid extensions despite MIME mismatch and report each rejected file", async () => {
    const selected = [], rejected = [], invalid = [];
    await act(async () => root.render(h(PrismFileDropzone, { files: [], maxSize: 20,
        onFilesSelected: files => selected.push(files), onFilesRejected: files => rejected.push(files), onInvalid: reason => invalid.push(reason) })));
    const valid = file("valid.PDF", 20, "application/octet-stream"), badType = file("invalid.exe"), tooLarge = file("large.pdf", 21);
    await select([valid, badType, tooLarge]);
    assert.deepEqual(selected, [[valid]]); assert.deepEqual(invalid, ["partial"]);
    assert.deepEqual(rejected[0].map(item => [item.file.name, item.errors.map(error => error.code)]), [
        ["invalid.exe", ["file-invalid-type"]], ["large.pdf", ["file-too-large"]],
    ]);
    await select([tooLarge]); await select([badType]);
    assert.deepEqual(invalid, ["partial", "size", "extension"]);
    await select([]); assert.equal(invalid.length, 3, "cancelling the picker does not reject a file");
    await select([valid]); assert.equal(selected.length, 2); assert.equal(document.querySelector('[role="alert"]'), null);
});

test("unlimited default and explicit selection count do not silently discard files", async () => {
    const selected = [], invalid = [];
    const props = { files: [], onFilesSelected: files => selected.push(files), onInvalid: reason => invalid.push(reason) };
    await act(async () => root.render(h(PrismFileDropzone, props)));
    const files = [file("a.pdf"), file("b.pdf"), file("c.pdf")];
    await select(files); assert.deepEqual(selected, [files]); assert.equal(document.querySelector("input").multiple, true);
    await act(async () => root.render(h(PrismFileDropzone, { ...props, maxFiles: 1 })));
    assert.equal(document.querySelector("input").multiple, false);
    await select(files); assert.deepEqual(invalid, ["count"]); assert.equal(selected.length, 1);
});

test("nested file drag preserves highlighting, text drag is ignored, and drop emits the valid subset", async () => {
    const selected = [];
    await act(async () => root.render(h(PrismFileDropzone, { files: [], onFilesSelected: files => selected.push(files) })));
    const zone = document.querySelector(".prism-dropzone"), child = zone.querySelector(".prism-dropzone-guide");
    await drag(zone, "dragenter", [], ["text/plain"]); assert.equal(zone.hasAttribute("data-dragging"), false);
    await drag(zone, "dragenter"); await drag(child, "dragenter"); await drag(child, "dragleave");
    assert.equal(zone.hasAttribute("data-dragging"), true);
    const valid = file("drop.pdf"); const event = await drag(zone, "drop", [valid, file("bad.exe")]);
    assert.equal(event.defaultPrevented, true); assert.equal(zone.hasAttribute("data-dragging"), false);
    assert.deepEqual(selected, [[valid]]);
    await drag(zone, "dragenter"); await drag(zone, "dragleave"); assert.equal(zone.hasAttribute("data-dragging"), false);
});

test("disabled and readonly file controls block selection, drop and deletion intents", async () => {
    let changed = 0;
    for (const Component of [PrismFileDropzone, PrismFileAttach]) for (const state of [{ disabled: true }, { readOnly: true }]) {
        await act(async () => root.render(h(Component, { ...state, files: [{ id: "saved", name: "saved.pdf" }], onFilesSelected: () => changed++, onRemove: () => changed++ })));
        assert.equal(document.querySelector("input").disabled, true);
        await select([file("new.pdf")]);
        const remove = document.querySelector('[aria-label="saved.pdf 삭제"]'); assert.equal(remove.disabled, true);
        await act(async () => remove.click());
        if (Component === PrismFileDropzone) {
            const zone = document.querySelector(".prism-dropzone"); await drag(zone, "dragenter"); await drag(zone, "drop", [file("drop.pdf")]);
            assert.equal(zone.hasAttribute("data-dragging"), false);
        }
    }
    assert.equal(changed, 0);
});

test("host controls upload state and removal; attach single mode preserves children and clears selection", async () => {
    const selected = [], removed = [];
    const props = { files: [{ id: "saved", name: "saved.pdf", status: "uploading" }], onFilesSelected: files => selected.push(files), onRemove: id => removed.push(id), multiple: false, children: h("p", {}, "추가 설명") };
    await act(async () => root.render(h(PrismFileAttach, props)));
    assert.equal(document.querySelector("input").multiple, false); assert.match(document.querySelector('[role="status"]').textContent, /업로드 중/);
    assert.match(document.body.textContent, /추가 설명/);
    const picked = file("same.pdf"); await select([picked, file("ignored.pdf")]); await select([picked]);
    assert.deepEqual(selected, [[picked], [picked]]);
    await act(async () => document.querySelector('[aria-label="saved.pdf 삭제"]').click());
    assert.deepEqual(removed, ["saved"]); assert.equal(document.querySelectorAll(".prism-file-attach-row").length, 1, "the host owns removal");
    await act(async () => root.render(h(PrismFileAttach, { ...props, files: [{ ...props.files[0], status: "error", error: "Upload failed" }] })));
    assert.equal(document.querySelector('[role="status"]'), null); assert.equal(document.querySelector('[role="alert"]').textContent, "Upload failed");
    await act(async () => root.render(h(PrismFileAttach, { ...props, files: [] })));
    assert.equal(document.querySelector(".prism-file-attach-list"), null);
});
test.after(async () => { await act(async () => root.unmount()); dom.window.close(); });
