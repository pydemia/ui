import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import { designModes } from "../packages/ui/dist/index.js";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root));
const fonts = JSON.parse(await read("research/design-fonts.json"));
const css = (await read("packages/ui/src/design-fonts.css")).toString();
const notices = (await read("apps/docs/public/fonts/design/notices.txt")).toString();
const files = await readdir(new URL("apps/docs/public/fonts/design/", root));
assert.deepEqual(files.filter((file) => file.endsWith(".ttf")).sort(),
    fonts.assets.map((asset) => asset.filename).sort());
for (const asset of fonts.assets) {
    const bytes = await read(`apps/docs/public/fonts/design/${asset.filename}`);
    assert.equal(createHash("sha256").update(bytes).digest("hex"), asset.sha256);
    assert.equal(bytes.length, asset.bytes);
    assert.ok(css.includes(`https://ui.pydemia.ai/fonts/design/${asset.filename}`));
    assert.ok(notices.includes(asset.family));
    assert.equal(asset.license, "SIL OFL 1.1");
}
const semanticRoles = {
    background: "--background", text: "--foreground", surface: "--surface",
    textMuted: "--muted", primary: "--accent", onPrimary: "--accent-foreground",
    secondary: "--message-user-background", error: "--danger",
    success: "--success", warning: "--warning", focusRing: "--focus",
};
for (const mode of designModes.filter((mode) => mode.id !== "basic")) {
    assert.ok(mode.defaultColormap && mode.typography);
    for (const appearance of ["light", "dark"]) {
        const project = JSON.parse(await read(`apps/docs/public/colormaps/design/${mode.id}-${appearance}.json`));
        assert.equal(project.schemaVersion, 2);
        assert.equal(project.generatorVersion, "intent-2.0.0");
        const swatches = project.swatches.map((swatch) => swatch.hex);
        assert.deepEqual(swatches, mode.defaultColormap.swatches[appearance]);
        assert.equal(new Set(swatches).size, swatches.length);
        for (const seed of mode.defaultColormap.seeds) {
            assert.ok(swatches.includes(seed));
            assert.ok(project.studio.anchors.some((anchor) => anchor.locked && anchor.originalHex === seed));
        }
        for (const [role, token] of Object.entries(semanticRoles)) {
            assert.equal(project.roleSets.web[role].overrideHex, mode.palettes[appearance][token]);
        }
    }
}
assert.equal(designModes[0].defaultColormap, null);
assert.equal(designModes[0].typography, null);
console.log(`Design assets verified: ${fonts.assets.length} original fonts, 20 palettes and 40 editable Colors projects.`);
