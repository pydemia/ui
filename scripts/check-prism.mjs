import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import ts from "typescript";
const read = path => readFileSync(new URL(`../${path}`, import.meta.url), "utf8").replace(/\r\n/g, "\n");
const manifest = JSON.parse(read("apps/docs/public/prism/components.json"));
const index = JSON.parse(read("apps/docs/public/prism/r/registry.json"));
const generic = new Set(JSON.parse(read("registry.json")).items.map(item => item.name));
const names = new Set(index.items.map(item => item.name));
const components = readdirSync(new URL("../packages/prism/src/",import.meta.url)).filter(file => file.endsWith(".tsx"));
const prismDependencies = new Map(index.items.map(item => [item.name, item.registryDependencies.filter(value => new URL(value).pathname.includes("/prism/r/")).map(value => new URL(value).pathname.split("/").pop().replace(".json", ""))]));
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
    let hasJsx = false;
    function inspect(node) { if (ts.isJsxElement(node) || ts.isJsxSelfClosingElement(node)) hasJsx = true; ts.forEachChild(node, inspect); }
    inspect(code); assert.ok(hasJsx, `Missing concrete JSX example: ${entry.id}`);
    assert.ok(["component-example", "integration-fragment"].includes(entry.usageKind));
    assert.ok(!entry.registryUsage.includes('from "@pydemia/prism"'), "Installed examples must use local registry modules");
    const portableCode = ts.createSourceFile("installed-usage.tsx",entry.registryUsage,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
    assert.deepEqual(portableCode.parseDiagnostics,[]);
    const installed = new Set();
    function include(id) { if (installed.has(id)) return; installed.add(id); for (const dependency of prismDependencies.get(id) ?? []) include(dependency); }
    include(entry.id);
    for (const statement of portableCode.statements) {
        if (!ts.isImportDeclaration(statement)) continue;
        const specifier = statement.moduleSpecifier.text;
        assert.ok(!specifier.startsWith("@pydemia/"), "Private workspace imports must not leak into installed examples");
        if (specifier.startsWith("@/components/ui/")) assert.ok(installed.has(specifier.split("/").pop()), `Example import is missing from ${entry.id}'s installation dependencies: ${specifier}`);
    }
}
// Check complete examples against public workspace declarations on every CI run.
// The isolated consumer verifier separately checks emitted registry imports.
const virtualPath = path => path.replaceAll("\\", "/");
const examples = new Map(manifest.components.filter(entry => entry.usageKind === "component-example").map(entry => [virtualPath(fileURLToPath(new URL(`../apps/docs/src/prism/.usage-${entry.id}.tsx`, import.meta.url))), entry.usage]));
const options = { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler, jsx: ts.JsxEmit.ReactJSX, strict: true, skipLibCheck: true, noEmit: true };
const host = ts.createCompilerHost(options);
const sourceFile = host.getSourceFile.bind(host);
host.getSourceFile = (path, languageVersion, onError, shouldCreateNewSourceFile) => examples.has(virtualPath(path))
    ? ts.createSourceFile(path, examples.get(virtualPath(path)), languageVersion, true, ts.ScriptKind.TSX)
    : sourceFile(path, languageVersion, onError, shouldCreateNewSourceFile);
const diagnostics = ts.getPreEmitDiagnostics(ts.createProgram([...examples.keys()], options, host));
assert.equal(diagnostics.length, 0, ts.formatDiagnostics(diagnostics, { getCanonicalFileName: path => path, getCurrentDirectory: () => fileURLToPath(new URL("../", import.meta.url)), getNewLine: () => "\n" }));
assert.ok(read("scripts/build-site.mjs").includes('apps/docs/dist/prism/index.html'));
console.log(`Verified ${components.length} source groups, contracts and portable PRISM registry dependencies; typechecked ${examples.size} complete usage examples.`);
