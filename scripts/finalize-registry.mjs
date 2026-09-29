import { readFile, writeFile } from "node:fs/promises";
import { basename } from "node:path";

const registry = JSON.parse(await readFile("registry.json", "utf8"));
const base = new URL(
    process.env.PYDEMIA_REGISTRY_BASE_URL ??
        "https://pydemia-ui.vercel.app/r/",
);
if (!["http:", "https:"].includes(base.protocol)) {
    throw new Error("PYDEMIA_REGISTRY_BASE_URL must be an HTTP URL.");
}
if (!base.pathname.endsWith("/")) base.pathname += "/";

for (const { name } of registry.items) {
    const file = `apps/profile-demo/public/r/${name}.json`;
    const item = JSON.parse(await readFile(file, "utf8"));
    item.registryDependencies = item.registryDependencies?.map((dependency) => {
        if (!/^\.\/pyd-[\w-]+\.json$/.test(dependency)) {
            throw new Error(`Unexpected registry dependency: ${dependency}`);
        }
        return new URL(dependency.slice(2), base).href;
    });
    for (const entry of item.files) {
        if (entry.path === "packages/ui/src/styles.css") {
            if (entry.target !== "@ui/tokens.css") {
                throw new Error(`Unexpected token target: ${entry.target}`);
            }
        } else if (entry.path === "registry/SHADCN_UI_LICENSE.md") {
            if (entry.target !== "@ui/SHADCN_UI_LICENSE.md") {
                throw new Error(`Unexpected license target: ${entry.target}`);
            }
        } else if (entry.path.startsWith("packages/ui/src/components/")) {
            entry.target = `@ui/${basename(entry.path)}`;
        } else {
            throw new Error(`Unexpected registry file: ${entry.path}`);
        }
        entry.content = entry.content.replace(/\r\n/g, "\n");
    }
    await writeFile(file, JSON.stringify(item, null, 2));
}

console.log(`Finalized ${registry.items.length} registry items for ${base.href}`);
