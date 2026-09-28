import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const registry = JSON.parse(readFileSync(join(root, "registry.json"), "utf8"));
const provenance = JSON.parse(readFileSync(join(root, "registry/provenance.json"), "utf8"));
const output = join(root, "apps/profile-demo/public/r");
const base = new URL(
    process.env.PYDEMIA_REGISTRY_BASE_URL ??
        "https://pydemia-ui.vercel.app/r/",
);
if (!["http:", "https:"].includes(base.protocol)) {
    throw new Error("PYDEMIA_REGISTRY_BASE_URL must be an HTTP URL.");
}
if (!base.pathname.endsWith("/")) base.pathname += "/";
const names = new Set(registry.items.map((item) => item.name));
assert.equal(names.size, registry.items.length, "Registry item names must be unique");

assert.deepEqual(
    [...names].sort(),
    provenance.items.map((item) => item.name).sort(),
    "Every registry item needs provenance metadata",
);

for (const item of registry.items) {
    const record = provenance.items.find((entry) => entry.name === item.name);
    assert(record?.source?.license, `Missing license for ${item.name}`);
    assert(record.profiles?.length, `Missing intended profile for ${item.name}`);
    assert(Array.isArray(record.dependencies), `Missing dependencies for ${item.name}`);
    assert(record.accessibility?.semantics, `Missing accessibility state for ${item.name}`);
    if (record.source.implementation === "modified") {
        assert(record.source.upstream?.includes("/blob/"), `Unpinned source for ${item.name}`);
        assert(record.source.notice, `Missing third-party notice for ${item.name}`);
    }
    for (const dependency of item.registryDependencies ?? []) {
        assert(dependency.startsWith("./") && dependency.endsWith(".json"));
        assert(names.has(dependency.slice(2, -5)), `Unknown dependency ${dependency}`);
    }
    const file = join(output, `${item.name}.json`);
    assert(existsSync(file), `Missing compiled registry item ${item.name}`);
    const compiled = JSON.parse(readFileSync(file, "utf8"));
    assert.equal(compiled.name, item.name);
    assert.deepEqual(
        compiled.registryDependencies,
        item.registryDependencies?.map((dependency) =>
            new URL(dependency.slice(2), base).href,
        ),
        `Unresolved registry dependencies for ${item.name}`,
    );
    assert(compiled.files?.every((entry) => entry.content?.length > 0));
    for (const entry of compiled.files) {
        const target = entry.path === "packages/ui/src/styles.css"
            ? "@ui/tokens.css"
            : `@ui/${basename(entry.path)}`;
        assert.equal(entry.target, target);
    }
}

console.log(`Verified ${names.size} compiled registry items and provenance records.`);
