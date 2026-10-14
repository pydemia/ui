import { readFile, writeFile } from "node:fs/promises";
import { registryTarget } from "./registry-target.mjs";

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
        const target = registryTarget(entry.path);
        if (entry.type === "registry:file" && entry.target !== target) {
            throw new Error(`Unexpected registry target: ${entry.target}`);
        }
        entry.target = target;
        entry.content = entry.content.replace(/\r\n/g, "\n");
    }
    await writeFile(file, JSON.stringify(item, null, 2));
}

console.log(`Finalized ${registry.items.length} registry items for ${base.href}`);
