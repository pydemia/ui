import assert from "node:assert/strict";
import test from "node:test";
import { unzipSync } from "fflate";
import { runPrismPdfExport } from "../dist/index.js";

const pdf = text => new Blob([`%PDF-1.7\n${text}\n%%EOF`], { type: "application/pdf" });
const renderPdf = async data => pdf(data);
const document = (filename, data = filename) => ({ filename, data });
test("a single PDF retains bytes, progress and a filesystem-safe filename", async () => {
    const progress = [];
    const result = await runPrismPdfExport({ documents: [document("CON.pdf", "single")], renderPdf, onProgress: value => progress.push(value) });
    assert.equal(result.filename, "_CON.pdf"); assert.equal(result.mimeType, "application/pdf");
    assert.equal(result.bytes, result.blob.size); assert.equal(await result.blob.text(), await pdf("single").text());
    assert.deepEqual(progress, [{ done: 0, total: 1 }, { done: 1, total: 1 }]);
});
test("multi-document ZIP keeps every PDF and disambiguates normalized/case-insensitive names", async () => {
    const result = await runPrismPdfExport({ documents: [document("가상/후보", "one"), document("가상_후보.pdf", "two"), document("SAME", "three"), document("same", "four")], archiveName: "가상 프로필.zip", renderPdf });
    assert.equal(result.filename, "가상 프로필.zip"); assert.equal(result.mimeType, "application/zip");
    const files = unzipSync(new Uint8Array(await result.blob.arrayBuffer()));
    assert.deepEqual(Object.keys(files), ["가상_후보.pdf", "가상_후보 (2).pdf", "SAME.pdf", "same (2).pdf"]);
    for (const [index, bytes] of Object.values(files).entries()) assert.equal(new TextDecoder().decode(bytes), await pdf(["one", "two", "three", "four"][index]).text());
});
test("stream sink honors async backpressure and closes only after all valid PDF writes", async () => {
    const chunks = [], events = [];
    const result = await runPrismPdfExport({ documents: [document("first"), document("second")], renderPdf,
        openDownload: async () => ({ write: async bytes => { events.push("start"); await new Promise(resolve => setTimeout(resolve, 1)); chunks.push(bytes); events.push("end"); }, close: () => events.push("close"), abort: () => events.push("abort") }),
    });
    assert.equal(result.blob, undefined); assert.equal(events.at(-1), "close"); assert.ok(!events.includes("abort"));
    const all = new Uint8Array(await new Blob(chunks).arrayBuffer()); assert.equal(all.length, result.bytes);
    assert.deepEqual(Object.keys(unzipSync(all)), ["first.pdf", "second.pdf"]);
    assert.deepEqual(events.slice(0, -1), Array.from({ length: (events.length - 1) / 2 }, () => ["start", "end"]).flat());
});
test("renderer failure and invalid PDF abort the sink without a completed archive", async () => {
    for (const render of [async () => { throw new Error("render failed"); }, async () => new Blob(["not a pdf"])]) {
        const events = [];
        await assert.rejects(runPrismPdfExport({ documents: [document("bad")], renderPdf: render, openDownload: async () => ({ write: () => events.push("write"), close: () => events.push("close"), abort: () => events.push("abort") }) }));
        assert.deepEqual(events, ["abort"]);
    }
    await assert.rejects(runPrismPdfExport({ documents: [], renderPdf }), /At least one/);
});
test("cancellation stops a pending renderer promptly and never renders the next profile", async () => {
    const controller = new AbortController(), events = []; let called = 0, resolveRender;
    const running = runPrismPdfExport({ documents: [document("one"), document("two")], signal: controller.signal,
        renderPdf: async () => { called++; return new Promise(resolve => { resolveRender = resolve; }); },
        openDownload: async () => ({ write: () => events.push("write"), close: () => events.push("close"), abort: () => events.push("abort") }),
    });
    while (!resolveRender) await new Promise(resolve => setTimeout(resolve, 1));
    controller.abort(); await assert.rejects(running, { name: "AbortError" });
    assert.equal(called, 1); assert.deepEqual(events, ["abort"]);
    resolveRender(pdf("late")); await new Promise(resolve => setTimeout(resolve, 1)); assert.deepEqual(events, ["abort"]);
});
test("a failed sink does not receive subsequent writes or close", async () => {
    const events = [];
    await assert.rejects(runPrismPdfExport({ documents: [document("one"), document("two")], renderPdf,
        openDownload: async () => ({ write: () => { events.push("write"); throw new Error("disk unavailable"); }, close: () => events.push("close"), abort: () => events.push("abort") }),
    }), /disk unavailable/);
    assert.deepEqual(events, ["write", "abort"]);
});
