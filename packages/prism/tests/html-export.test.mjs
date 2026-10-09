import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";
import { createPrismHtmlDocument } from "../dist/index.js";
const make = html => {
    const dom = new JSDOM(`<!doctype html><html><body>${html}</body></html>`, { url: "https://example.test/report/" });
    Object.defineProperty(dom.window.document, "fonts", { value: { ready: Promise.resolve() } });
    return { dom, root: dom.window.document.body.firstElementChild };
};
test("a static snapshot preserves live form values, removes marked toolbar and executable nodes, and never mutates the source", async () => {
    const { dom, root } = make('<div style="visibility:hidden"><div data-prism-export-exclude>toolbar</div><input value="old"><textarea>old</textarea><select><option>A</option><option>B</option></select><script>execute()</script><p onclick="execute()">body</p></div>');
    root.querySelector("input").value = "current"; root.querySelector("textarea").value = "current text"; root.querySelector("select").selectedIndex = 1;
    const result = await createPrismHtmlDocument(root, { title: 'Title < & "', cssText: "p{color:red}" });
    const saved = new JSDOM(result.html).window.document;
    assert.equal(saved.title, 'Title < & "'); assert.equal(saved.querySelector("input").value, "current");
    assert.equal(saved.querySelector("textarea").value, "current text"); assert.equal(saved.querySelector("select").value, "B");
    assert.equal(saved.querySelectorAll("script,[onclick],[data-prism-export-exclude]").length, 0);
    assert.ok(saved.querySelector('meta[http-equiv="Content-Security-Policy"]')); assert.equal(result.blob.type, "text/html;charset=utf-8");
    assert.equal(root.style.visibility, "hidden"); assert.equal(root.querySelectorAll("script,[onclick],[data-prism-export-exclude]").length, 3);
    dom.window.close();
});
test("canvas replacement cannot shift photo correspondence and shared CSS/image assets are fetched once", async () => {
    const { dom, root } = make('<div><canvas aria-label="chart"></canvas><img src="../photo.png"><canvas aria-label="second chart"></canvas><img src="../photo.png"></div>');
    for (const [index, canvas] of [...root.querySelectorAll("canvas")].entries()) canvas.toDataURL = () => `data:image/png;base64,chart${index}`;
    const requested = [];
    const result = await createPrismHtmlDocument(root, { title: "snapshot", cssText: 'div{background-image:url("../photo.png")}', loadAsset: async url => { requested.push(url.href); return new dom.window.Blob(["photo"], { type: "image/png" }); } });
    const images = [...new JSDOM(result.html).window.document.images];
    assert.equal(images[0].alt, "chart"); assert.equal(images[0].src, "data:image/png;base64,chart0");
    assert.equal(images[1].src, "data:image/png;base64,cGhvdG8="); assert.equal(images[2].alt, "second chart"); assert.equal(images[3].src, images[1].src);
    assert.deepEqual(requested, ["https://example.test/photo.png"]); assert.equal(result.embeddedAssets, 1);
    assert.equal(root.querySelectorAll("canvas").length, 2); dom.window.close();
});
test("unreadable and missing assets fail without a partial successful document; excluded canvases are not captured", async () => {
    const { dom, root } = make('<div><section data-prism-export-exclude><canvas></canvas></section><img src="photo.png"></div>');
    root.querySelector("canvas").toDataURL = () => { throw new Error("must be excluded"); };
    await assert.rejects(createPrismHtmlDocument(root, { title: "snapshot", cssText: "", loadAsset: async () => { throw new Error("unreadable"); } }), /unreadable/);
    root.querySelector("img").removeAttribute("src"); await assert.rejects(createPrismHtmlDocument(root, { title: "snapshot", cssText: "" }), /unavailable/);
    root.querySelector("img").remove(); const result = await createPrismHtmlDocument(root, { title: "snapshot", cssText: "" }); assert.ok(!result.html.includes("<canvas"));
    dom.window.close();
});
test("cancellation rejects a pending resource loader promptly and a late result cannot produce a document", async () => {
    const { dom, root } = make('<div><img src="photo.png"></div>'); const controller = new AbortController(); let resolveAsset;
    const exportPromise = createPrismHtmlDocument(root, { title: "snapshot", signal: controller.signal, cssText: "", loadAsset: () => new Promise(resolve => { resolveAsset = resolve; }) });
    while (!resolveAsset) await new Promise(resolve => setTimeout(resolve, 1));
    controller.abort(); await assert.rejects(exportPromise, { name: "AbortError" }); resolveAsset(new dom.window.Blob(["late"])); dom.window.close();
});
test("CSSOM access failures require explicit complete CSS, and CSS text cannot terminate the HTML style element", async () => {
    const { dom, root } = make('<div><p>body</p></div>');
    Object.defineProperty(dom.window.document, "adoptedStyleSheets", { value: [{ get cssRules() { throw new Error("cross-origin"); } }] });
    await assert.rejects(createPrismHtmlDocument(root, { title: "snapshot" }), /cssText/);
    const result = await createPrismHtmlDocument(root, { title: "snapshot", cssText: 'p::before{content:"</style><script>"}' });
    const saved = new JSDOM(result.html).window.document; assert.equal(saved.querySelectorAll("style").length, 1); assert.equal(saved.querySelectorAll("script").length, 0);
    dom.window.close();
});
test("slow stylesheet assets do not mix a later edited profile into the cloned document", async () => {
    const { dom, root } = make('<div><p>original profile</p><input value="original"></div>'); let resolveAsset;
    const running = createPrismHtmlDocument(root, { title: "snapshot", cssText: 'div{background:url("photo.png")}', loadAsset: () => new Promise(resolve => { resolveAsset = resolve; }) });
    while (!resolveAsset) await new Promise(resolve => setTimeout(resolve, 1));
    root.querySelector("p").textContent = "later profile"; root.querySelector("input").value = "later";
    resolveAsset(new dom.window.Blob(["photo"], { type: "image/png" }));
    const saved = new JSDOM((await running).html).window.document;
    assert.equal(saved.querySelector("p").textContent, "original profile"); assert.equal(saved.querySelector("input").value, "original");
    assert.equal(root.querySelector("p").textContent, "later profile"); dom.window.close();
});
test("CSS asset rewriting preserves literal URL text and comments while embedding image-set candidates", async () => {
    const { dom, root } = make('<div><p>body</p></div>'); const requests = [];
    const cssText = '/* url("comment.png") */ p::before{content:"url(literal.png)"} div{background:image-set("photo.png" 1x,url("photo.png") 2x)}';
    const result = await createPrismHtmlDocument(root, { title: "snapshot", cssText, loadAsset: async url => { requests.push(url.pathname); return new dom.window.Blob(["photo"], { type: "image/png" }); } });
    const css = new JSDOM(result.html).window.document.querySelector("style").textContent;
    assert.ok(css.includes('/* url("comment.png") */')); assert.ok(css.includes('content:"url(literal.png)"'));
    assert.equal(css.match(/data:image\/png;base64,cGhvdG8=/g).length, 2); assert.deepEqual(requests, ["/report/photo.png"]); dom.window.close();
});
