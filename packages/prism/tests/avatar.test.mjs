import assert from "node:assert/strict";
import test from "node:test";
import { JSDOM } from "jsdom";

// Geometry is supplied by the test; these assertions do not establish browser layout.
const dom = new JSDOM('<!doctype html><div id="root"></div>', { url: "http://localhost/", pretendToBeVisual: true });
for (const key of ["window", "document", "HTMLElement", "Element", "Node", "Event", "KeyboardEvent", "MouseEvent", "MutationObserver", "DocumentFragment", "CustomEvent", "NodeFilter"]) globalThis[key] = dom.window[key];
Object.defineProperty(globalThis, "navigator", { configurable: true, value: dom.window.navigator });
globalThis.getComputedStyle = dom.window.getComputedStyle;
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(dom.window);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(dom.window);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const observers = new Set();
globalThis.ResizeObserver = class {
    constructor(callback) { this.callback = callback; this.targets = new Set(); }
    observe(target) { this.targets.add(target); observers.add(this); }
    unobserve(target) { this.targets.delete(target); if (!this.targets.size) observers.delete(this); }
    disconnect() { this.targets.clear(); observers.delete(this); }
};
let geometry = { available: 400, name: 80, team: 50, shownName: 80, shownTeam: 50 };
Object.defineProperty(dom.window.HTMLElement.prototype, "clientWidth", { configurable: true, get() {
    if (this.hasAttribute("data-info-layout")) return geometry.available + 13;
    if (this.classList.contains("prism-avatar-name")) return geometry.shownName;
    if (this.classList.contains("prism-avatar-team")) return geometry.shownTeam;
    return 0;
} });
Object.defineProperty(dom.window.HTMLElement.prototype, "scrollWidth", { configurable: true, get() {
    if (this.classList.contains("prism-avatar-name")) return geometry.name;
    if (this.classList.contains("prism-avatar-team")) return geometry.team;
    return this.clientWidth;
} });
const { createElement: h, act } = await import("react");
const { createRoot } = await import("react-dom/client");
const { PrismAvatar } = await import("../dist/index.js");
const root = createRoot(document.getElementById("root"));
const resize = async next => { geometry = next; await act(async () => { for (const observer of [...observers]) observer.callback([]); }); };
const info = () => document.querySelector("[data-info-layout]");

await test("avatar allocation follows available space, text updates and font completion", async () => {
    let fontReady;
    const fonts = new dom.window.EventTarget();
    fonts.ready = new Promise(resolve => { fontReady = resolve; });
    Object.defineProperty(document, "fonts", { configurable: true, value: fonts });
    const props = { name: "김가상", team: "가상 팀", description: "demo@example.com", style: { width: 180 } };
    await act(async () => root.render(h(PrismAvatar, props)));
    assert.equal(document.querySelector(".prism-avatar").style.width, "180px");
    assert.equal(info().dataset.infoLayout, "natural");
    assert.equal(document.querySelector(".prism-avatar-name").tabIndex, -1);
    await resize({ available: 110, name: 200, team: 40, shownName: 70, shownTeam: 40 });
    assert.equal(info().dataset.infoLayout, "name-truncate");
    assert.equal(document.querySelector(".prism-avatar-name").tabIndex, 0);
    assert.equal(document.querySelector(".prism-avatar-team").tabIndex, -1);
    await resize({ available: 110, name: 90, team: 120, shownName: 55, shownTeam: 55 });
    assert.equal(info().dataset.infoLayout, "both-truncate");
    await resize({ available: 110, name: 40, team: 200, shownName: 40, shownTeam: 70 });
    assert.equal(info().dataset.infoLayout, "team-truncate");
    geometry = { available: 110, name: 35, team: 40, shownName: 35, shownTeam: 40 };
    await act(async () => root.render(h(PrismAvatar, { ...props, name: "이예시", team: "짧은 팀" })));
    assert.equal(info().dataset.infoLayout, "natural");
    geometry = { available: 110, name: 160, team: 40, shownName: 70, shownTeam: 40 };
    await act(async () => fontReady());
    assert.equal(info().dataset.infoLayout, "name-truncate");
    geometry = { available: 400, name: 160, team: 40, shownName: 160, shownTeam: 40 };
    await act(async () => fonts.dispatchEvent(new Event("loadingdone")));
    assert.equal(info().dataset.infoLayout, "natural");
});

await test("avatar reveals full truncated text on focus and retains its name without visible info", async () => {
    await resize({ available: 110, name: 200, team: 40, shownName: 70, shownTeam: 40 });
    const name = document.querySelector(".prism-avatar-name");
    await act(async () => name.focus());
    assert.equal(document.querySelector('[role="tooltip"]').textContent, "이예시");
    await act(async () => document.activeElement.blur());
    geometry = { available: 400, name: 200, team: 40, shownName: 200, shownTeam: 40 };
    await act(async () => document.fonts.dispatchEvent(new Event("loadingdone")));
    await act(async () => name.focus());
    assert.equal(document.querySelector('[role="tooltip"]'), null);
    await act(async () => name.blur());
    geometry = { available: 110, name: 200, team: 40, shownName: 70, shownTeam: 40 };
    await act(async () => document.fonts.dispatchEvent(new Event("loadingdone")));
    assert.equal(document.querySelector('[role="tooltip"]'), null);
    await act(async () => root.render(h(PrismAvatar, { name: "김가상", showInfo: false })));
    assert.equal(info(), null);
    assert.equal(document.querySelector(".prism-sr-only").textContent, "김가상");
    assert.equal(document.querySelector(".prism-avatar-image").getAttribute("aria-hidden"), "true");
    await act(async () => root.unmount());
    assert.equal(observers.size, 0);
    assert.equal(document.querySelector('[role="tooltip"]'), null);
});
