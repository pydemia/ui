import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, join, posix } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import { shadcnSourceRecords } from "./shadcn-sources.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const registry = JSON.parse(readFileSync(join(root, "registry.json"), "utf8"));
const provenanceContent = readFileSync(
    join(root, "registry/provenance.json"), "utf8",
).replace(/\r\n/g, "\n");
const provenance = JSON.parse(provenanceContent);
const sourceManifestContent = readFileSync(
    join(root, "registry/shadcn-sources.json"), "utf8",
).replace(/\r\n/g, "\n");
const sourceManifest = JSON.parse(sourceManifestContent);
assert.deepEqual(
    sourceManifest.items,
    shadcnSourceRecords(provenance),
    "Adapted shadcn source manifest differs from current provenance",
);
const output = join(root, "apps/profile-demo/public/r");
const noticePath = "registry/SHADCN_UI_LICENSE.md";
const noticeTarget = "@ui/SHADCN_UI_LICENSE.md";
const noticeContent = readFileSync(join(root, noticePath), "utf8")
    .replace(/\r\n/g, "\n");
const noticeRevision = noticeContent.match(
    /from shadcn\/ui at revision\n`([a-f0-9]{40})`/,
);
assert(noticeRevision, "Consumer notice needs an upstream revision");
for (const { name, source } of sourceManifest.items) {
    assert(source.upstream?.includes(`/blob/${noticeRevision[1]}/`),
        `Consumer notice revision differs for ${name}`);
    assert.equal(source.license, "MIT",
        `Consumer notice license differs for ${name}`);
}
const pinnedSourceManifest = noticeContent.match(
    /github\.com\/pydemia\/ui\/blob\/([a-f0-9]{40})\/registry\/shadcn-sources\.json>/,
);
assert(pinnedSourceManifest,
    "Consumer notice must link to a pinned source manifest");
assert(noticeContent.includes(`commit \`${pinnedSourceManifest[1]}\``),
    "Consumer notice revision and link differ");
const sourceHash = noticeContent.match(
    /SHA-256 of that file with LF line endings:\n`([a-f0-9]{64})`/,
);
assert(sourceHash, "Consumer notice needs a source manifest SHA-256");
assert.equal(
    sourceHash[1],
    createHash("sha256").update(sourceManifestContent).digest("hex"),
    "Consumer notice source SHA-256 differs from current manifest",
);
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

const sourceOwners = new Map();
const missingDependencies = [];
for (const item of registry.items) {
    for (const file of item.files) {
        if (!file.path.startsWith("packages/ui/src/components/")) continue;
        const owners = sourceOwners.get(file.path) ?? new Set();
        owners.add(item.name);
        sourceOwners.set(file.path, owners);
    }
}

for (const item of registry.items) {
    const itemDependencies = new Set(
        (item.registryDependencies ?? []).map((entry) => entry.slice(2, -5)),
    );
    for (const file of item.files) {
        if (!file.path.startsWith("packages/ui/src/components/")) continue;
        const source = ts.createSourceFile(
            file.path, readFileSync(join(root, file.path), "utf8"),
            ts.ScriptTarget.Latest, true,
        );
        for (const statement of source.statements) {
            if (!ts.isImportDeclaration(statement) &&
                !ts.isExportDeclaration(statement)) continue;
            const module = statement.moduleSpecifier;
            if (!module || !ts.isStringLiteral(module)) continue;
            const specifier = module.text;
            if (specifier.startsWith(".")) {
                const target = posix.normalize(posix.join(
                    posix.dirname(file.path), specifier,
                ));
                const owners = sourceOwners.get(`${target}.tsx`) ??
                    sourceOwners.get(`${target}.ts`);
                assert(owners?.size,
                    `Unregistered import in ${item.name}: ${file.path} -> ${specifier}`);
                if (!owners.has(item.name) &&
                    ![...owners].some((owner) => itemDependencies.has(owner))) {
                    missingDependencies.push(
                        `${item.name}: registry dependency for ${specifier}`,
                    );
                }
                continue;
            }
            const packageName = specifier.startsWith("@")
                ? specifier.split("/").slice(0, 2).join("/")
                : specifier.split("/")[0];
            if (packageName === "react" || packageName === "react-dom") {
                continue;
            }
            if (!(item.dependencies ?? []).some((dependency) =>
                dependency === packageName ||
                dependency.startsWith(`${packageName}@`))) {
                missingDependencies.push(
                    `${item.name}: npm dependency for ${specifier}`,
                );
            }
        }
    }
}
assert.deepEqual(missingDependencies, [], "Registry imports need declared dependencies");

assert.deepEqual(
    [...names].sort(),
    provenance.items.map((item) => item.name).sort(),
    "Every registry item needs provenance metadata",
);

for (const item of registry.items) {
    const record = provenance.items.find((entry) => entry.name === item.name);
    assert(record?.source?.license, `Missing license for ${item.name}`);
    if (record.source.provider === "pydemia/ui") {
        assert.equal(record.source.implementation, "original");
        assert.equal(record.source.upstream, null);
        assert.equal(record.source.license, "project-owned");
    } else {
        assert.equal(
            record.source.provider,
            "shadcn/ui",
            `Unsupported implementation source for ${item.name}`,
        );
    }
    if (record.reference) {
        assert(record.reference.provider, `Missing reference name for ${item.name}`);
        assert(
            record.reference.url.startsWith("https://"),
            `Invalid reference URL for ${item.name}`,
        );
    }
    assert(record.profiles?.length, `Missing intended profile for ${item.name}`);
    assert(Array.isArray(record.dependencies), `Missing dependencies for ${item.name}`);
    assert(record.accessibility?.semantics, `Missing accessibility state for ${item.name}`);
    if (record.source.implementation === "modified") {
        assert(record.source.upstream?.includes("/blob/"), `Unpinned source for ${item.name}`);
        assert(record.source.notice, `Missing third-party notice for ${item.name}`);
        assert.equal(record.source.consumer_notice, noticePath);
        assert.equal(
            item.files.filter((entry) => entry.path === noticePath).length,
            1,
            `Missing consumer license file for ${item.name}`,
        );
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
        compiled.files.map((entry) => entry.path).sort(),
        item.files.map((entry) => entry.path).sort(),
        `Compiled file list differs for ${item.name}`,
    );
    assert.deepEqual(
        compiled.registryDependencies,
        item.registryDependencies?.map((dependency) =>
            new URL(dependency.slice(2), base).href,
        ),
        `Unresolved registry dependencies for ${item.name}`,
    );
    assert(compiled.files?.every((entry) => entry.content?.length > 0));
    for (const entry of compiled.files) {
        const sourceContent = readFileSync(join(root, entry.path), "utf8")
            .replace(/\r\n/g, "\n");
        assert.equal(
            entry.content,
            sourceContent,
            `Compiled source differs for ${item.name}: ${entry.path}`,
        );
        let target;
        if (entry.path === "packages/ui/src/styles.css") {
            target = "@ui/tokens.css";
        } else if (entry.path === noticePath) {
            target = noticeTarget;
        } else {
            target = `@ui/${basename(entry.path)}`;
        }
        assert.equal(entry.target, target);
        if (entry.path === noticePath) {
            assert.equal(entry.content, noticeContent);
        }
    }
}

const componentPath = "packages/ui/src/components/";
const sourceIds = readdirSync(join(root, componentPath))
    .filter((name) => name.endsWith(".tsx"))
    .map((name) => name.slice(0, -4)).sort();
const registryComponents = registry.items.flatMap((item) =>
    item.files.filter((entry) =>
        entry.path.startsWith(componentPath) && entry.path.endsWith(".tsx"),
    ).map((entry) => ({ id: basename(entry.path, ".tsx"), name: item.name })),
);
const registryIds = registryComponents.map((entry) => entry.id).sort();
for (const entry of registryComponents) {
    assert.equal(entry.name, `pyd-${entry.id}`,
        `Registry item name differs for ${entry.id}`);
}
const indexPath = join(root, "packages/ui/src/index.ts");
const index = ts.createSourceFile(indexPath, readFileSync(indexPath, "utf8"),
    ts.ScriptTarget.Latest, true);
const exportIds = [...new Set(index.statements
    .filter(ts.isExportDeclaration)
    .flatMap((statement) => {
        const specifier = statement.moduleSpecifier;
        if (!specifier || !ts.isStringLiteral(specifier) ||
            !specifier.text.startsWith("./components/")) return [];
        return [specifier.text.slice("./components/".length)];
    }))].sort();
const exportOwners = new Map();
for (const statement of index.statements) {
    if (!ts.isExportDeclaration(statement) ||
        !statement.moduleSpecifier ||
        !ts.isStringLiteral(statement.moduleSpecifier) ||
        !statement.moduleSpecifier.text.startsWith("./components/") ||
        !statement.exportClause ||
        !ts.isNamedExports(statement.exportClause)) continue;
    const owner = `pyd-${statement.moduleSpecifier.text.slice(
        "./components/".length,
    )}`;
    for (const symbol of statement.exportClause.elements) {
        assert(!exportOwners.has(symbol.name.text),
            `Duplicate public export: ${symbol.name.text}`);
        exportOwners.set(symbol.name.text, owner);
    }
}
const registryItems = new Map(registry.items.map((item) =>
    [item.name, item],
));
const catalogPath = join(root, "apps/docs/src/catalog.tsx");
const catalog = ts.createSourceFile(
    catalogPath, readFileSync(catalogPath, "utf8"),
    ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX,
);
let entries;
function findCatalog(node) {
    if (ts.isVariableDeclaration(node) &&
        node.name.getText(catalog) === "catalog") {
        entries = node.initializer;
    }
    ts.forEachChild(node, findCatalog);
}
findCatalog(catalog);
assert(entries && ts.isArrayLiteralExpression(entries),
    "Catalog must be a statically declared array");
const catalogIds = entries.elements.map((entry) => {
    assert(ts.isObjectLiteralExpression(entry));
    const id = entry.properties.find((property) =>
        ts.isPropertyAssignment(property) &&
        property.name.getText(catalog) === "id");
    assert(id && ts.isPropertyAssignment(id) &&
        ts.isStringLiteral(id.initializer), "Catalog entry needs a literal ID");
    const code = entry.properties.find((property) =>
        ts.isPropertyAssignment(property) &&
        property.name.getText(catalog) === "code");
    assert(code && ts.isPropertyAssignment(code) &&
        ts.isNoSubstitutionTemplateLiteral(code.initializer),
        `Catalog usage needs a static code block: ${id.initializer.text}`);
    const usage = ts.createSourceFile(
        `${id.initializer.text}.tsx`, code.initializer.text,
        ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX,
    );
    assert.equal(usage.parseDiagnostics.length, 0,
        `Catalog usage has TSX syntax errors: ${id.initializer.text}`);
    const installProperty = entry.properties.find((property) =>
        ts.isPropertyAssignment(property) &&
        property.name.getText(catalog) === "installItems");
    let installIds = [id.initializer.text];
    if (installProperty) {
        assert(ts.isPropertyAssignment(installProperty) &&
            ts.isArrayLiteralExpression(installProperty.initializer),
            `Catalog installItems must be a literal array: ${id.initializer.text}`);
        installIds = installProperty.initializer.elements.map((element) => {
            assert(ts.isStringLiteral(element),
                `Catalog installItems need literal IDs: ${id.initializer.text}`);
            return element.text;
        });
    }
    assert(installIds.includes(id.initializer.text),
        `Catalog installItems omit ${id.initializer.text}`);
    const installed = new Set();
    function includeItem(name) {
        assert(registryItems.has(name),
            `Catalog ${id.initializer.text} installs unknown item ${name}`);
        if (installed.has(name)) return;
        installed.add(name);
        for (const dependency of registryItems.get(name).registryDependencies ?? []) {
            includeItem(dependency.slice(2, -5));
        }
    }
    installIds.forEach((installId) => includeItem(`pyd-${installId}`));
    for (const statement of usage.statements) {
        if (!ts.isImportDeclaration(statement) ||
            !ts.isStringLiteral(statement.moduleSpecifier) ||
            statement.moduleSpecifier.text !== "@pydemia/ui") continue;
        const imports = statement.importClause?.namedBindings;
        assert(imports && ts.isNamedImports(imports),
            `Catalog usage needs named UI imports: ${id.initializer.text}`);
        for (const symbol of imports.elements) {
            const name = symbol.propertyName?.text ?? symbol.name.text;
            const owner = exportOwners.get(name);
            assert(owner, `Unknown UI import in ${id.initializer.text}: ${name}`);
            assert(installed.has(owner),
                `Catalog ${id.initializer.text} must install ${owner} for ${name}`);
        }
    }
    return id.initializer.text;
}).sort();
assert.equal(new Set(registryIds).size, registryIds.length,
    "Component registry paths must be unique");
assert.equal(new Set(catalogIds).size, catalogIds.length,
    "Catalog IDs must be unique");
assert.deepEqual(registryIds, sourceIds,
    "Component source and registry items differ");
assert.deepEqual(exportIds, sourceIds,
    "Component source and public exports differ");
assert.deepEqual(catalogIds, sourceIds,
    "Component source and catalog entries differ");

console.log(`Verified ${names.size} registry items, provenance records, ` +
    `and ${sourceIds.length} component exports/catalog entries.`);
