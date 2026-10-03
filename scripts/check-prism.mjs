import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import ts from "typescript";
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8").replace(/\r\n/g, "\n");
const manifest = JSON.parse(read("apps/docs/public/prism/components.json"));
const index = JSON.parse(read("apps/docs/public/prism/r/registry.json"));
const generic = new Set(JSON.parse(read("registry.json")).items.map(item => item.name));
const names = new Set(index.items.map(item => item.name));
const components = readdirSync(new URL("../packages/prism/src/",import.meta.url)).filter(file => file.endsWith(".tsx"));
assert.equal(names.size, index.items.length);
assert.equal(manifest.components.length, components.length);
for (const item of index.items) {
    assert.deepEqual(item, JSON.parse(read(`apps/docs/public/prism/r/${item.name}.json`)));
    for (const dep of item.registryDependencies) assert.ok(generic.has(new URL(dep).pathname.split("/").pop().replace(".json","")) || names.has(new URL(dep).pathname.split("/").pop().replace(".json","")), `Unresolved dependency ${dep}`);
    for (const file of item.files) {
        assert.ok(!file.content.includes('from "@pydemia/'), "Private workspace imports must not leak into consumer sources");
        if (item.meta) assert.equal(item.meta.fileSha256?.[file.path] ?? item.meta.sourceSha256, createHash("sha256").update(read(file.path)).digest("hex"));
        if (file.path.endsWith(".tsx")) {
            const tree = ts.createSourceFile(file.path,file.content,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
            assert.deepEqual(tree.parseDiagnostics,[]);
        } else assert.equal(file.content,read(file.path));
    }
}
for (const entry of manifest.components) {
    assert.ok(names.has(entry.id)); assert.ok(entry.states.length); assert.ok(entry.contract); assert.ok(entry.source.length);
    assert.equal(read(entry.sourcePath).includes("export "),true);
    const code = ts.createSourceFile("usage.tsx",entry.usage,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
    assert.deepEqual(code.parseDiagnostics,[]);
}
assert.ok(read("scripts/build-site.mjs").includes('apps/docs/dist/prism/index.html'));
console.log(`Verified ${components.length} source groups, contracts and portable PRISM registry dependencies.`);
