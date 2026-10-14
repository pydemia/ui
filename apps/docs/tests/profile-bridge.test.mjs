import assert from "node:assert/strict";
import test from "node:test";
import { act, createElement as h } from "react";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><body><div id='root'></div><iframe></iframe>", {
    url: "http://localhost/", pretendToBeVisual: true,
});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createRoot } = await import("react-dom/client");
const { useProfileBridge } = await import(
    "../../../.worknotes/browser-evidence/design-modes-docs-tests/profile-bridge.js"
);
const settings = {
    version: 1, design: "basic", appearance: "light", colormap: "neutral",
    overrides: { light: {}, dark: {} },
};

test("bridge rejects foreign/stale messages and recovers with fresh retry revisions", async (context) => {
    context.mock.timers.enable({ apis: ["setTimeout"] });
    const frame = document.querySelector("iframe");
    const frameRef = { current: frame };
    const sent = [];
    frame.contentWindow.postMessage = (data, origin) => sent.push({ data, origin });
    let bridge;
    function Harness({ revision = 0, theme = settings }) {
        bridge = useProfileBridge(frameRef, theme, revision);
        return h("output", null, bridge.status);
    }
    const root = createRoot(document.getElementById("root"));
    async function receive(type, revision, extra = {}) {
        await act(async () => window.dispatchEvent(new window.MessageEvent("message", {
            origin: window.location.origin, source: frame.contentWindow,
            data: { type: `pydemia-ui-theme-${type}`, version: 1, revision }, ...extra,
        })));
    }
    try {
        await act(async () => root.render(h(Harness)));
        const first = sent.at(-1).data.revision;
        assert.equal(sent.at(-1).origin, window.location.origin);
        await receive("applied", first, { origin: "https://foreign.test" });
        await receive("applied", first, { source: window });
        await receive("applied", first, { data: { type: "pydemia-ui-theme-applied", version: 2, revision: first } });
        assert.equal(bridge.status, "waiting");
        await receive("applied", first);
        assert.equal(bridge.status, "applied");
        await receive("invalidated", first, { source: window });
        await receive("invalidated", first, { origin: "https://foreign.test" });
        assert.equal(bridge.status, "applied");
        await receive("invalidated", first);
        assert.equal(bridge.status, "changed");
        await receive("applied", first);
        assert.equal(bridge.status, "changed");
        await act(async () => bridge.send());
        const retry = sent.at(-1).data.revision;
        assert.ok(retry > first);
        assert.deepEqual(sent.at(-1).data.settings, settings);
        await receive("invalidated", first);
        await receive("applied", first);
        assert.equal(bridge.status, "waiting");
        await act(async () => context.mock.timers.tick(3000));
        assert.equal(bridge.status, "unavailable");
        await receive("applied", retry);
        assert.equal(bridge.status, "applied");
        const dark = { ...settings, appearance: "dark" };
        await act(async () => root.render(h(Harness, { revision: 1, theme: dark })));
        assert.ok(sent.at(-1).data.revision > retry);
        assert.equal(sent.at(-1).data.settings.appearance, "dark");
        const previous = sent.at(-1).data.revision;
        await act(async () => bridge.send());
        assert.ok(sent.at(-1).data.revision > previous);
        await receive("applied", previous);
        assert.equal(bridge.status, "waiting");
        await receive("applied", sent.at(-1).data.revision);
        assert.equal(bridge.status, "applied");
        frameRef.current = null;
        await act(async () => bridge.send());
        assert.equal(bridge.status, "unavailable");
        frameRef.current = frame;
        const beforeReconnect = sent.at(-1).data.revision;
        await act(async () => bridge.send());
        assert.ok(sent.at(-1).data.revision > beforeReconnect);
    } finally {
        await act(async () => root.unmount());
        dom.window.close();
    }
});
