import assert from "node:assert/strict";
import test from "node:test";
import { act, createElement as h } from "react";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "https://ui.example/", pretendToBeVisual: true,
});
for (const name of ["window", "document", "HTMLElement", "Element", "Event"]) {
    globalThis[name] = dom.window[name];
}
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
globalThis.requestAnimationFrame = (callback) => { callback(0); return 1; };
window.scrollTo = () => {};
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createRoot } = await import("react-dom/client");
const { useThemeController } = await import(
    "../../../.worknotes/browser-evidence/design-modes-docs-tests/controller.js"
);
const {
    colorProfileStorageKey, emptyColorProfiles, readColorProfiles,
    rememberColorProfile, restoreDesignProfile, writeColorProfiles,
} = await import("../../../.worknotes/browser-evidence/design-modes-docs-tests/storage.js");
const { resolveThemeSettings } = await import("@pydemia/ui");
const settings = (input) => resolveThemeSettings(input, { allowUnreleased: true }).settings;

async function mount(url = "https://ui.example/") {
    window.history.replaceState({}, "", url);
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    let api;
    function Probe() {
        api = useThemeController({ allowUnreleased: true });
        return h("input", { "aria-label": "Business draft", defaultValue: "initial" });
    }
    await act(async () => root.render(h(Probe)));
    return {
        get api() { return api; }, input: container.querySelector("input"), container,
        async change(operation) { await act(async () => operation(api)); },
        async close() { await act(async () => root.unmount()); container.remove(); },
    };
}

test("versioned storage rejects malformed data and unavailable storage", () => {
    for (const raw of ["{", '{"version":2,"designs":{}}', '{"version":1,"designs":[]}']) {
        const result = readColorProfiles({ getItem: () => raw });
        assert.deepEqual(result.store, emptyColorProfiles());
        assert.ok(result.issue);
    }
    assert.ok(readColorProfiles({ getItem() { throw new Error("denied"); } }).issue);
    assert.ok(writeColorProfiles({ setItem() { throw new Error("denied"); } }, emptyColorProfiles()));
});

test("design, palette and appearance color profiles remain isolated", () => {
    let store = rememberColorProfile(emptyColorProfiles(), settings({ design: "swiss", colormap: "ocean",
        overrides: { light: { "--accent": "#123456" }, dark: { "--accent": "#abcdef" } } }));
    store = rememberColorProfile(store, settings({ design: "editorial", colormap: "forest",
        overrides: { light: { "--accent": "#789abc" }, dark: {} } }));
    assert.equal(restoreDesignProfile(store, "swiss").overrides.dark["--accent"], "#abcdef");
    assert.equal(restoreDesignProfile(store, "editorial").overrides.light["--accent"], "#789abc");
    assert.deepEqual(restoreDesignProfile(store, "basic"), { colormap: "neutral", overrides: { light: {}, dark: {} } });
    const read = readColorProfiles({ getItem: () => JSON.stringify(store) });
    assert.deepEqual(read.store, store);
});

test("bare entry and explicit shared URL take precedence over saved profiles", async () => {
    window.localStorage.setItem(colorProfileStorageKey, JSON.stringify(
        rememberColorProfile(emptyColorProfiles(), settings({ design: "swiss", overrides: { light: { "--accent": "#123456" }, dark: {} } })),
    ));
    const bare = await mount();
    assert.equal(bare.api.settings.design, "basic");
    assert.equal(bare.api.settings.colormap, "neutral");
    await bare.close();
    const shared = await mount("https://ui.example/?design=swiss&colormap=ocean&light.accent=%23ABCDEF&component=input&keep=yes#tokens");
    assert.equal(shared.api.settings.overrides.light["--accent"], "#abcdef");
    await shared.change((api) => api.setAppearance("dark"));
    assert.equal(new URL(window.location.href).searchParams.get("keep"), "yes");
    assert.equal(new URL(window.location.href).searchParams.get("component"), "input");
    assert.equal(window.location.hash, "#tokens");
    await shared.close();
});

test("design commits preserve business node and restore saved profile on explicit selection", async () => {
    window.localStorage.clear();
    const mounted = await mount();
    mounted.input.value = "unsaved business draft";
    await mounted.change((api) => api.commitDesign("swiss"));
    await mounted.change((api) => api.setColormap("ocean"));
    await mounted.change((api) => api.setOverride("--accent", "#123456"));
    await mounted.change((api) => api.commitDesign("editorial"));
    assert.equal(mounted.api.settings.colormap, "design");
    await mounted.change((api) => api.commitDesign("swiss"));
    assert.equal(mounted.api.settings.colormap, "ocean");
    assert.equal(mounted.api.settings.overrides.light["--accent"], "#123456");
    assert.equal(mounted.container.querySelector("input"), mounted.input);
    assert.equal(mounted.input.value, "unsaved business draft");
    await mounted.close();
});

test("palette clears visible overrides while explicit restore retains the prior backup", async () => {
    window.localStorage.clear();
    const mounted = await mount();
    await mounted.change((api) => api.setOverride("--accent", "#123456"));
    await mounted.change((api) => api.setColormap("ocean"));
    await mounted.change((api) => api.setColormap("neutral"));
    assert.deepEqual(mounted.api.settings.overrides, { light: {}, dark: {} });
    await mounted.change((api) => api.restoreColorProfile());
    assert.equal(mounted.api.settings.overrides.light["--accent"], "#123456");
    await mounted.close();
});

test("history restores theme from URL and full reset returns to Basic", async () => {
    window.localStorage.clear();
    const mounted = await mount();
    await mounted.change((api) => api.commitDesign("dark-ui"));
    assert.equal(mounted.api.settings.appearance, "dark");
    await mounted.change((api) => api.setAppearance("light"));
    assert.equal(mounted.api.settings.design, "basic");
    await act(async () => {
        window.history.replaceState({}, "", "https://ui.example/?design=swiss&mode=dark&component=input#components");
        window.dispatchEvent(new Event("popstate"));
    });
    assert.equal(mounted.api.settings.design, "swiss");
    assert.equal(mounted.api.settings.appearance, "dark");
    await mounted.change((api) => api.resetTheme());
    assert.equal(mounted.api.settings.design, "basic");
    assert.equal(mounted.api.settings.appearance, "light");
    assert.equal(window.localStorage.getItem(colorProfileStorageKey), null);
    assert.equal(new URL(window.location.href).searchParams.get("component"), "input");
    await mounted.close();
});

test("candidate prediction uses the same saved profile as commit without side effects", async () => {
    window.localStorage.clear();
    const mounted = await mount();
    await mounted.change((api) => api.commitDesign("swiss"));
    await mounted.change((api) => api.setColormap("ocean"));
    await mounted.change((api) => api.setOverride("--accent", "#123456"));
    await mounted.change((api) => api.commitDesign("basic"));
    const before = structuredClone(mounted.api.settings);
    const revision = mounted.api.revision;
    const original = dom.window.Storage.prototype.setItem;
    let writes = 0;
    dom.window.Storage.prototype.setItem = function (...args) {
        writes += 1;
        return original.apply(this, args);
    };
    try {
        const candidate = mounted.api.previewDesign("swiss");
        assert.equal(candidate.colormap, "ocean");
        assert.equal(candidate.overrides.light["--accent"], "#123456");
        assert.equal(writes, 0);
        assert.deepEqual(mounted.api.settings, before);
        assert.equal(mounted.api.revision, revision);
        await mounted.change((api) => api.commitDesign("swiss"));
        assert.deepEqual(mounted.api.settings, candidate);
    } finally {
        dom.window.Storage.prototype.setItem = original;
        await mounted.close();
    }
});

test("resetting visible colors retains a storage failure notice and business input", async () => {
    window.localStorage.clear();
    const mounted = await mount();
    await mounted.change((api) => api.setOverride("--accent", "#123456"));
    mounted.input.value = "keep me";
    const original = dom.window.Storage.prototype.setItem;
    dom.window.Storage.prototype.setItem = () => { throw new Error("denied"); };
    try {
        await mounted.change((api) => api.resetOverrides());
        assert.deepEqual(mounted.api.settings.overrides, { light: {}, dark: {} });
        assert.match(mounted.api.notice, /저장/);
        assert.equal(mounted.input.value, "keep me");
    } finally {
        dom.window.Storage.prototype.setItem = original;
        await mounted.close();
    }
});
