import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { JSDOM } from "jsdom";
import {
    colorTokens, colormaps, designModes, paletteTokens, releasedDesignModes,
} from "../dist/index.js";
import {
    defaultThemeSettings, parseThemeUrl, resolveThemeSettings,
    resolveThemeTokens, writeThemeUrl,
} from "../dist/index.js";

const preview = { allowUnreleased: true };
const resolve = (input, options = preview) => resolveThemeSettings(input, options).settings;

test("accessibility media policies outrank applied inline theme tokens", () => {
    const css = readFileSync(new URL("../src/design-modes.css",
        import.meta.url), "utf8");
    const mediaStart = css.indexOf("@media (prefers-reduced-motion");
    assert.notEqual(mediaStart, -1);
    const dom = new JSDOM(`<style>${css.slice(mediaStart)}</style>`);
    const mediaRules = [...dom.window.document.styleSheets[0].cssRules];
    assert.equal(mediaRules.length, 2);
    const collisions = new Set();
    for (const mode of designModes) {
        for (const appearance of mode.appearances) {
            const inline = resolveThemeTokens(resolve({
                design: mode.id, appearance,
            }), preview);
            for (const media of mediaRules) {
                for (const rule of media.cssRules) {
                    for (let index = 0; index < rule.style.length; index++) {
                        const name = rule.style[index];
                        if (!(name in inline)) continue;
                        collisions.add(name);
                        assert.equal(rule.style.getPropertyPriority(name),
                            "important", `${mode.id}/${appearance}: ${name}`);
                    }
                }
            }
        }
    }
    assert.deepEqual([...collisions].sort(),
        ["--motion-fast", "--panel-shadow"]);
    dom.window.close();
});

test("manifest has 21 unique modes, atlas cases and explicit support", () => {
    assert.equal(designModes.length, 21);
    assert.equal(new Set(designModes.map(({ id }) => id)).size, 21);
    assert.equal(new Set(designModes.slice(1).map(({ atlasCaseId }) => atlasCaseId)).size, 20);
    assert.deepEqual(releasedDesignModes.map(({ id }) => id), ["basic"]);
    for (const mode of designModes) {
        assert.ok(mode.appearances.includes(mode.defaultAppearance));
        assert.ok(Object.isFrozen(mode.tokens));
        assert.equal(Object.keys(mode.palettes.light).length, 14);
    }
    assert.throws(() => { designModes[0].tokens["--radius"] = "99px"; });
    assert.throws(() => { defaultThemeSettings.overrides.light["--accent"] = "#000000"; });
});

test("source Basic and all five palettes preserve every original color", () => {
    const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");
    const blocks = [...css.matchAll(/([^{}]+)\{([^{}]+)\}/g)];
    const declarations = (body) => Object.fromEntries(
        [...body.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((m) => [m[1], m[2]]),
    );
    const basic = resolveThemeTokens(defaultThemeSettings);
    for (const [token, value] of Object.entries(declarations(blocks[0][2]))) {
        assert.equal(basic[token], value, `Basic preserves ${token}`);
    }
    for (const palette of colormaps) {
        for (const appearance of ["light", "dark"]) {
            const selector = `:root${appearance === "dark" ? ".dark" : ""}[data-colormap="${palette.id}"]`;
            const block = blocks.find(([_, key]) => key.trim() === selector);
            const expected = {
                ...declarations(blocks[0][2]),
                ...(appearance === "dark" ? declarations(blocks[1][2]) : {}),
                ...(block ? declarations(block[2]) : {}),
            };
            for (const { token } of colorTokens) {
                assert.equal(paletteTokens[palette.id][appearance][token], expected[`--palette-${token.slice(2)}`]);
            }
            assert.deepEqual(palette.colors[appearance], ["--background", "--accent", "--message-user-background"].map((key) => paletteTokens[palette.id][appearance][key]));
        }
    }
});

test("release gate, invalid schema and unsupported appearance report fallback", () => {
    assert.deepEqual(resolve(undefined), defaultThemeSettings);
    assert.equal(resolveThemeSettings({ design: "swiss" }).settings.design, "basic");
    assert.ok(resolveThemeSettings({ design: "swiss" }).issues.length);
    assert.equal(resolve({ design: "swiss" }).design, "swiss");
    assert.deepEqual(resolve({ version: 2, design: "swiss" }), defaultThemeSettings);
    assert.ok(resolveThemeSettings({ design: "unknown", appearance: "sepia", colormap: "bad" }).issues.length >= 3);
    assert.equal(resolve({ design: "dark-ui", appearance: "light" }).design, "basic");
    for (const design of ["cyber", "terminal"]) {
        assert.equal(resolve({ design, appearance: "light" }).appearance, "dark");
    }
});

test("overrides admit only known tokens and six-digit hex", () => {
    const result = resolveThemeSettings({ overrides: {
        light: { "--accent": "#AB12CD", "--radius": "100px", "--danger": "red", "--focus": "#fff" },
        dark: { "--accent": "url(javascript:alert(1))" },
        other: {},
    } });
    assert.deepEqual(result.settings.overrides, { light: { "--accent": "#ab12cd" }, dark: {} });
    assert.equal(result.issues.length, 5);
    assert.equal(resolve('{"design":"swiss"}').design, "basic");
});

test("URL roundtrip preserves unrelated query, component, hash and input URL", () => {
    const url = new URL("https://example.test/?component=button&x=1&x=2&light.custom=keep#usage");
    const original = url.href;
    const value = resolve({ design: "swiss", appearance: "dark", colormap: "forest", overrides: { light: { "--accent": "#ABCDEF" }, dark: {} } });
    const written = writeThemeUrl(url, value, preview);
    assert.equal(url.href, original);
    assert.equal(written.searchParams.get("component"), "button");
    assert.deepEqual(written.searchParams.getAll("x"), ["1", "2"]);
    assert.equal(written.searchParams.get("light.custom"), "keep");
    assert.equal(written.hash, "#usage");
    assert.deepEqual(parseThemeUrl(written, preview).settings, value);
    assert.equal(parseThemeUrl(written).settings.design, "basic");
    assert.equal(writeThemeUrl(url, value).searchParams.has("design"), false);
    assert.equal(writeThemeUrl(new URL("https://example.test/"), defaultThemeSettings).search, "");
});

test("legacy URL and malformed owned values normalize without injecting CSS", () => {
    const url = new URL("https://example.test/?mode=dark&colormap=ocean&light.accent=%23ABCDEF&dark.focus=red&mode=light");
    const parsed = parseThemeUrl(url);
    assert.equal(parsed.settings.design, "basic");
    assert.equal(parsed.settings.appearance, "dark");
    assert.equal(parsed.settings.overrides.light["--accent"], "#abcdef");
    assert.ok(parsed.issues.length >= 2);
    const cleaned = writeThemeUrl(url, parsed.settings);
    assert.equal(cleaned.searchParams.has("dark.focus"), false);
    assert.equal(cleaned.searchParams.getAll("mode").length, 1);
});

test("scope maps redeclare complete Basic shape, semantic aliases and composition", () => {
    const basic = resolveThemeTokens(defaultThemeSettings);
    assert.equal(basic["--radius"], "5px");
    assert.equal(basic["--density-control-height"], "36px");
    assert.equal(basic["--overlay"], "rgb(13 25 32 / 45%)");
    assert.equal(basic["--docs-section-space"], "42px");
    assert.equal(basic["--font-sans"], "var(--font-ui)");
    for (const { token } of colorTokens) {
        assert.equal(basic[token], `var(--palette-${token.slice(2)})`);
        assert.ok(basic[`--palette-${token.slice(2)}`]);
    }
    const value = resolve({ design: "brutal", appearance: "dark", colormap: "ocean", overrides: { dark: { "--accent": "#123456" } } });
    const tokens = resolveThemeTokens(value, preview);
    assert.equal(tokens["--radius"], "0px");
    assert.equal(tokens["--palette-accent"], paletteTokens.ocean.dark["--accent"]);
    assert.equal(tokens["--accent"], "#123456");
    assert.equal(tokens["--color-accent"], "var(--accent)");
    assert.equal(tokens["--overlay"], "rgb(0 0 0 / 65%)");
    assert.equal(resolveThemeTokens(value)["--radius"], "5px");
    const profiles = designModes.map((mode) => resolveThemeTokens(resolve({ design: mode.id }), preview));
    assert.equal(new Set(profiles.map((tokens) => JSON.stringify(tokens))).size, 21);
});
