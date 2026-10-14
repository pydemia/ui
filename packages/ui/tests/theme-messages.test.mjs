import assert from "node:assert/strict";
import test from "node:test";
import {
    createThemeMessage, readThemeMessage,
    createThemeAppliedMessage, readThemeAppliedMessage,
    createThemeInvalidatedMessage, readThemeInvalidatedMessage,
    releasedDesignModes, resolveThemeSettings,
} from "../dist/index.js";

const settings = {
    version: 1, design: "basic", appearance: "light", colormap: "neutral",
    overrides: { light: {}, dark: {} },
};

test("theme messages accept complete settings and strictly increasing revisions", () => {
    const message = createThemeMessage(settings, 0);
    assert.deepEqual(readThemeMessage(message, -1), message);
    assert.equal(readThemeMessage(message, 0), null);
    assert.equal(readThemeMessage(message, 10), null);
    assert.equal(readThemeMessage(createThemeMessage(settings, 11), 10).revision, 11);
    message.settings.overrides.light["--accent"] = "#123456";
    assert.deepEqual(settings.overrides.light, {});
});

test("invalidation requires a complete supported schema and current revision", () => {
    const message = createThemeInvalidatedMessage(5);
    assert.deepEqual(readThemeInvalidatedMessage(message, 5), message);
    for (const invalid of [
        null, [], {}, { ...message, version: 2 },
        { ...message, type: "pydemia-ui-theme-applied" },
        ...[-1, 4, 6, 0.5, NaN, Infinity, "5", undefined].map(
            (revision) => ({ ...message, revision }),
        ),
        { type: message.type, revision: 5 },
        { version: 1, revision: 5 },
    ]) assert.equal(readThemeInvalidatedMessage(invalid, 5), null);
    assert.throws(() => createThemeInvalidatedMessage(-1), TypeError);
});

test("partial or malformed messages never silently apply fallback settings", () => {
    const message = createThemeMessage(settings, 2);
    for (const key of Object.keys(settings)) {
        const partial = { ...settings };
        delete partial[key];
        assert.equal(readThemeMessage({ ...message, settings: partial }, -1), null, key);
    }
    for (const invalid of [
        null, [], { ...message, version: 2 }, { ...message, type: "other" },
        ...[-1, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1, "2"].map(
            (revision) => ({ ...message, revision }),
        ),
        ...[
            { design: "unknown" }, { appearance: "sepia" }, { colormap: "unknown" },
            { overrides: { light: {} } },
            { overrides: { light: {}, dark: {}, surprise: {} } },
            { overrides: { light: { "--accent": "red" }, dark: {} } },
            { overrides: { light: { "--untrusted": "#112233" }, dark: {} } },
        ].map((patch) => ({ ...message, settings: { ...settings, ...patch } })),
    ]) assert.equal(readThemeMessage(invalid, -1), null);
    assert.throws(() => createThemeMessage(settings, -1), TypeError);
});

test("all released modes synchronize without QA and unsupported appearances are rejected", () => {
    const swiss = { ...settings, design: "swiss", colormap: "design" };
    const message = createThemeMessage(swiss, 1);
    assert.equal(readThemeMessage(message, -1).settings.design, "swiss");
    for (const mode of releasedDesignModes) {
        for (const appearance of mode.appearances) {
            const value = resolveThemeSettings({ design: mode.id, appearance }).settings;
            assert.deepEqual(readThemeMessage(createThemeMessage(value, 1), -1).settings, value);
        }
    }
    assert.equal(readThemeMessage({ ...message, settings: {
        ...settings, design: "dark-ui", appearance: "light",
    } }, -1, { allowUnreleased: true }), null);
});

test("acknowledgements identify only the current revision with supported schema", () => {
    const ack = createThemeAppliedMessage(5);
    assert.deepEqual(readThemeAppliedMessage(ack, 5), ack);
    assert.equal(readThemeAppliedMessage(ack, 4), null);
    assert.equal(readThemeAppliedMessage(ack, 6), null);
    assert.equal(readThemeAppliedMessage({ ...ack, version: 2 }, 5), null);
    assert.equal(readThemeAppliedMessage({ ...ack, revision: "5" }, 5), null);
    assert.throws(() => createThemeAppliedMessage(Infinity), TypeError);
});
