import assert from "node:assert/strict";
import { designModes, releasedDesignModes } from "./design-modes.js";
import {
    defaultThemeSettings, parseThemeUrl, resolveThemeSettings,
    resolveThemeTokens, writeThemeUrl,
} from "./design-mode-settings.js";

assert.equal(designModes.length, 21);
assert.equal(releasedDesignModes.some((mode) => mode.id === "basic"), true);
assert.deepEqual(parseThemeUrl(new URL("https://consumer.test/")).settings,
    defaultThemeSettings);
for (const mode of designModes) {
    const strict = resolveThemeSettings({ design: mode.id });
    assert.equal(strict.settings.design,
        mode.releaseStatus === "released" ? mode.id : "basic");
    if (mode.releaseStatus !== "released") {
        assert(strict.issues.some((issue) => issue.includes("Unreleased")));
    }
    const options = { allowUnreleased: true };
    const preview = resolveThemeSettings({ design: mode.id }, options);
    assert.equal(preview.settings.design, mode.id);
    const tokens = resolveThemeTokens(preview.settings, options);
    assert.equal(typeof tokens["--radius"], "string");
    assert.equal(typeof tokens["--palette-background"], "string");
    const url = new URL("https://consumer.test/?component=button#example");
    const shared = writeThemeUrl(url, preview.settings, options);
    assert.equal(shared.searchParams.get("component"), "button");
    assert.equal(shared.hash, "#example");
    assert.deepEqual(parseThemeUrl(shared, options).settings, preview.settings);
}
console.log(JSON.stringify({
    strictReleaseGate: "passed", definitions: designModes.length,
    released: releasedDesignModes.map((mode) => mode.id),
    ready: designModes.filter((mode) => mode.releaseStatus === "ready")
        .map((mode) => mode.id),
    browserVerified: false,
}));
