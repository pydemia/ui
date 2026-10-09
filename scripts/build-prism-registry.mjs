import { readFileSync, readdirSync, mkdirSync, writeFileSync, copyFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { basename } from "node:path";
import ts from "typescript";

const root = new URL("../", import.meta.url);
const read = path => readFileSync(new URL(path, root), "utf8").replace(/\r\n/g, "\n");
const write = (path, text) => writeFileSync(new URL(path, root), text);
const publicRoot = new URL("apps/docs/public/prism/", root);
mkdirSync(new URL("r/", publicRoot), { recursive: true });
mkdirSync(new URL("fonts/", publicRoot), { recursive: true });
mkdirSync(new URL("vendor/", publicRoot), { recursive: true });
const genericBase = new URL(process.env.PYDEMIA_REGISTRY_BASE_URL ?? "https://ui.pydemia.ai/r/");
const prismBase = new URL(process.env.PRISM_REGISTRY_BASE_URL ?? "https://ui.pydemia.ai/prism/r/");
const exportOwners = new Map();
const prismPackage = JSON.parse(read("packages/prism/package.json"));
const verification = JSON.parse(read("apps/docs/public/prism/research/verification.json"));
const sourceInventory = JSON.parse(read("apps/docs/public/prism/research/source-inventory.json"));
const index = ts.createSourceFile("index.ts", read("packages/ui/src/index.ts"), ts.ScriptTarget.Latest, true);
for (const node of index.statements) {
    if (!ts.isExportDeclaration(node) || !node.moduleSpecifier || !ts.isStringLiteral(node.moduleSpecifier) || !node.exportClause || !ts.isNamedExports(node.exportClause)) continue;
    for (const symbol of node.exportClause.elements) exportOwners.set(symbol.name.text, node.moduleSpecifier.text.replace("./components/", ""));
}
const catalog = ts.createSourceFile("catalog.tsx", read("apps/docs/src/prism/catalog.tsx"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
let entries;
function visit(node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(catalog) === "prismCatalog") entries = node.initializer;
    ts.forEachChild(node, visit);
}
visit(catalog);
const metadata = entries.elements.map(entry => {
    const fields = new Map(entry.properties.filter(ts.isPropertyAssignment).map(prop => [prop.name.getText(catalog), prop.initializer]));
    const value = key => fields.get(key)?.text;
    return { id: value("id"), name: value("name"), category: value("category"), purpose: value("purpose"), contract: value("contract"),
        states: fields.get("states").elements.map(node => node.text), source: fields.get("source").elements.map(node => node.text),
        usage: value("code"), sourcePath: `packages/prism/src/${value("id")}.tsx`,
        previewUrl:`/prism?component=${value("id")}`,embedUrl:`/prism?component=${value("id")}&embed=1`,
        responsivePreviewUrl:`/prism?component=${value("id")}&view=responsive`,
        verification: verification.components[value("id")] ?? { visual: "pending", interaction: "pending" } };
});
for (const entry of metadata) {
    const tree = ts.createSourceFile(entry.sourcePath,read(entry.sourcePath),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
    entry.exports = tree.statements.flatMap(statement => {
        if (!statement.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword)) return [];
        if (ts.isVariableStatement(statement)) return statement.declarationList.declarations.map(declaration => ({name:declaration.name.getText(tree),kind:"value"}));
        if (statement.name) return [{name:statement.name.getText(tree),kind:ts.isTypeAliasDeclaration(statement) || ts.isInterfaceDeclaration(statement) ? "type" : "component"}];
        return [];
    });
}
const prismExportOwners = new Map(metadata.flatMap(entry => entry.exports.map(symbol => [symbol.name, entry.id])));
for (const entry of metadata) {
    const usageTree = ts.createSourceFile("example.tsx", entry.usage, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    entry.usageKind = usageTree.statements.some(statement => ts.isFunctionDeclaration(statement) && statement.modifiers?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword))
        ? "component-example" : "integration-fragment";
    const replacements = [];
    for (const statement of usageTree.statements) {
        if (!ts.isImportDeclaration(statement) || statement.moduleSpecifier.text !== "@pydemia/prism") continue;
        const owners = new Map();
        for (const symbol of statement.importClause.namedBindings.elements) {
            const imported = (symbol.propertyName ?? symbol.name).text;
            const owner = prismExportOwners.get(imported);
            if (!owner) throw new Error(`Missing PRISM example export: ${imported}`);
            const symbols = owners.get(owner) ?? [];
            symbols.push(symbol.getText(usageTree)); owners.set(owner, symbols);
        }
        replacements.push([statement.getStart(usageTree), statement.end, [...owners].map(([owner, symbols]) => `import { ${symbols.join(", ")} } from "@/components/ui/${owner}";`).join("\n")]);
    }
    entry.registryUsage = entry.usage;
    for (const [start, end, replacement] of replacements.reverse()) entry.registryUsage = entry.registryUsage.slice(0, start) + replacement + entry.registryUsage.slice(end);
}
const items = [];
for (const file of readdirSync(new URL("packages/prism/src/", root)).filter(file => file.endsWith(".tsx"))) {
    const name = basename(file, ".tsx");
    const sourcePath = `packages/prism/src/${file}`;
    const source = read(sourcePath);
    const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const registryDependencies = new Set([new URL("prism-tokens.json", prismBase).href]);
    const dependencies = new Set(); const replacements = [];
    for (const statement of tree.statements) {
        if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
        const specifier = statement.moduleSpecifier.text;
        if (specifier === "@pydemia/ui") {
            const owners = new Map();
            for (const symbol of statement.importClause.namedBindings.elements) {
                const imported = (symbol.propertyName ?? symbol.name).text;
                const owner = exportOwners.get(imported);
                if (!owner) throw new Error(`Missing public owner: ${imported}`);
                const symbols = owners.get(owner) ?? []; symbols.push(symbol.getText(tree)); owners.set(owner, symbols);
                registryDependencies.add(new URL(`pyd-${owner}.json`, genericBase).href);
            }
            replacements.push([statement.getStart(tree), statement.end, [...owners].map(([owner,symbols]) => `import { ${symbols.join(", ")} } from "./${owner}";`).join("\n")]);
        } else if (specifier.startsWith("./")) {
            registryDependencies.add(new URL(`${specifier.slice(2)}.json`, prismBase).href);
        } else if (specifier !== "react" && specifier !== "react/jsx-runtime") {
            const packageName = specifier.startsWith("@") ? specifier.split("/").slice(0,2).join("/") : specifier.split("/")[0];
            const version = prismPackage.dependencies?.[packageName];
            dependencies.add(packageName === "lucide-react" ? "lucide-react@0.468.0" : version ? `${packageName}@${version}` : packageName);
        }
    }
    let content = source;
    for (const [start,end,replacement] of replacements.reverse()) content = content.slice(0,start) + replacement + content.slice(end);
    const meta = metadata.find(entry => entry.id === name);
    const item = { $schema: "https://ui.shadcn.com/schema/registry-item.json", name, type: "registry:ui", title: meta.name,
        description: meta.purpose, dependencies: [...dependencies], registryDependencies: [...registryDependencies],
        files: [{ path: sourcePath, type: "registry:ui", target: `@ui/${file}`, content }],
        meta: { sourceRevision: "7ecfc9af072d9f4aeb0f4d7706f16bd1a73f2ef9", sourceSha256: createHash("sha256").update(source).digest("hex"), provenance: name === "prism-icon" ? "PRISM reference vector artwork retained with a typed adapter and instance-scoped SVG IDs. Rights remain with the original asset owners." : "Original implementation using pydemia/shadcn primitives; PRISM source used as design and behavior reference." } };
    if (name === "prism-icon") {
        const noticePath = "packages/prism/THIRD_PARTY_NOTICES.md";
        item.files.push({ path: noticePath, type: "registry:file", target: "@ui/PRISM_ASSET_NOTICES.md", content: read(noticePath) });
        item.meta.fileSha256 = Object.fromEntries(item.files.map(file => [file.path, createHash("sha256").update(read(file.path)).digest("hex")]));
    }
    write(`apps/docs/public/prism/r/${name}.json`, JSON.stringify(item,null,2)+"\n"); items.push(item);
}
const tokens = { $schema: "https://ui.shadcn.com/schema/registry-item.json", name: "prism-tokens", type: "registry:ui", title: "PRISM light tokens and component styles",
    registryDependencies: [new URL("pyd-tokens.json", genericBase).href], dependencies: ["pretendard@1.3.9"],
    files: [{ path: "packages/prism/src/styles.css", type: "registry:file", target: "@ui/prism.css", content: read("packages/prism/src/styles.css") }],
};
write("apps/docs/public/prism/r/prism-tokens.json", JSON.stringify(tokens,null,2)+"\n"); items.push(tokens);
write("apps/docs/public/prism/r/registry.json", JSON.stringify({ $schema: "https://ui.shadcn.com/schema/registry.json", name: "prism-ui", homepage: "https://ui.pydemia.ai/prism", items },null,2)+"\n");
write("apps/docs/public/prism/components.json", JSON.stringify({ schemaVersion: 1, title: "PRISM UI", reference: { url: "http://dev.prism.ai", sourceRevision: "7ecfc9af072d9f4aeb0f4d7706f16bd1a73f2ef9", observedAt: "2026-10-03", latestSourceAudit: sourceInventory.latestSourceAudit },
    sourceCoverage: { inventoryUrl: "/prism/research/source-inventory.json", ...sourceInventory.counts, claim: sourceInventory.coverageDefinition },
    theme: { mode: "light", scope: 'data-prism="light"', stylesheet: "/prism/r/prism-tokens.json", font: "Pretendard 1.3.9 (OFL-1.1)" },
    integration: { workspaceImport: "@pydemia/prism", registryImport: "@/components/ui/prism-* (adjust to components.json aliases.ui)", workspaceUsageField: "usage", registryUsageField: "registryUsage", usageKinds: { "component-example": "Self-contained exported React component with synthetic data; typechecked against installed registry sources.", "integration-fragment": "Integration excerpt; supply the state, data and callbacks shown in the component contract." }, stateOwnership: "Consumer owns API/auth/permissions/persistence; demos use synthetic data." }, components: metadata },null,2)+"\n");
copyFileSync(new URL("node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",root), new URL("fonts/PretendardVariable.woff2",publicRoot));
copyFileSync(new URL("node_modules/pretendard/dist/LICENSE.txt",root), new URL("fonts/LICENSE.txt",publicRoot));
copyFileSync(new URL("node_modules/pdfjs-dist/LICENSE",root), new URL("vendor/PDFJS-LICENSE.txt",publicRoot));
write("apps/docs/public/prism/llms.txt", `# PRISM UI\n\nIsolated PRISM-DEV design and interaction references using React 19, pydemia/ui and shadcn/Radix primitives.\n\nLatest source inventory: ${sourceInventory.counts.total} entries, ${sourceInventory.counts.pending} pending implementations. Purpose mapping and selected runtime checks do not prove all source states or visual parity.\n\n- [Contracts and source mapping](/prism/components.json)\n- [Ground rules](/prism/research/design-rules.md)\n- [Original inventory](/prism/research/source-inventory.json)\n- [Verification and known differences](/prism/research/verification.md)\n- [Registry](/prism/r/registry.json)\n\nUse data-prism="light" at the application root. Load pydemia tokens then prism.css; prism.css imports the installed Pretendard variable font. Keep the installed PRISM_ASSET_NOTICES.md. There is no verified source dark theme. The manifest registryUsage field uses @/components/ui/prism-*; adjust this path to components.json aliases.ui. The usage field is for the private @pydemia/prism workspace. usageKind=component-example identifies a self-contained exported React component; usageKind=integration-fragment requires consumer-owned data, state and callbacks. The isolated consumer check typechecks component examples against installed registry sources. Do not infer API, authorization, persistence or HR decision logic from a component demo. null assessment scores are insufficient evidence, never zero.\n\n${metadata.map(item => `## ${item.name}\n${item.purpose}\nContract: ${item.contract}\nStates: ${item.states.join(", ")}\nRegistry: /prism/r/${item.id}.json\nSource: ${item.sourcePath}\nUsage kind: ${item.usageKind}\nInstalled usage:\n\`\`\`tsx\n${item.registryUsage}\n\`\`\`\n`).join("\n")}\nVisual parity is pending until reference comparison has completed; read verification.md.\n`);
console.log(`Built ${items.length} PRISM registry items and ${metadata.length} contract groups.`);
