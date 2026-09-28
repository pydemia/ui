import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../", import.meta.url).pathname;
const registry = JSON.parse(readFileSync(join(root, "registry.json"), "utf8"));
const provenance = JSON.parse(readFileSync(join(root, "registry/provenance.json"), "utf8"));
const output = join(root, "apps/profile-demo/public/r");
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
    assert(compiled.files?.every((entry) => entry.content?.length > 0));
}

console.log(`Verified ${names.size} compiled registry items and provenance records.`);
