import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const script = fileURLToPath(new URL("./registry-release.mjs", import.meta.url));
const publicBase = "https://pydemia-ui.vercel.app/r/";
const durableBase =
    "https://raw.githubusercontent.com/pydemia/ui/main/docs/r/";

function digest(content) {
    return createHash("sha256").update(content).digest("hex");
}

function run(cwd, command, id) {
    return spawnSync(process.execPath, [script, command, id].filter(Boolean), {
        cwd, encoding: "utf8",
    });
}

test("registry snapshots retain one dependency set across builds", async () => {
    const root = await mkdtemp(join(tmpdir(), "pydemia-registry-release-"));
    assert(resolve(root).startsWith(`${resolve(tmpdir())}${sep}`));
    try {
        const output = join(root, "apps/profile-demo/public/r");
        await mkdir(output, { recursive: true });
        await writeFile(join(root, "registry.json"), JSON.stringify({
            items: [{ name: "pyd-button" }, { name: "pyd-utils" }],
        }));
        await writeFile(join(output, "pyd-utils.json"), JSON.stringify({
            name: "pyd-utils", files: [{ content: "old utility" }],
        }));
        await writeFile(join(output, "pyd-button.json"), JSON.stringify({
            name: "pyd-button",
            registryDependencies: [`${publicBase}pyd-utils.json`],
            files: [{ content: "old button" }],
        }));
        await writeFile(join(output, "registry.json"), "generated index");
        await mkdir(join(root, "docs/r"), { recursive: true });
        for (const name of ["registry", "pyd-button", "pyd-utils"]) {
            await cp(join(output, `${name}.json`),
                join(root, "docs/r", `${name}.json`));
        }

        const created = run(root, "create");
        assert.equal(created.status, 0, created.stderr);
        const id = created.stdout.match(/sha256-[a-f0-9]{64}/)?.[0];
        assert(id);
        const release = join(root, "registry/releases", id);
        const button = JSON.parse(await readFile(
            join(release, "pyd-button.json"), "utf8",
        ));
        const manifest = JSON.parse(await readFile(
            join(release, "manifest.json"), "utf8",
        ));
        assert.equal(manifest.schemaVersion, 2);
        assert.equal(manifest.baseUrl,
            `${durableBase}releases/${id}/`);
        assert.deepEqual(button.registryDependencies,
            [`${durableBase}releases/${id}/pyd-utils.json`]);

        const published = join(root, "docs/r/releases", id);
        await mkdir(join(root, "docs/r/releases"), { recursive: true });
        await cp(release, published, { recursive: true });
        assert.equal(run(root, "verify").status, 0);
        assert.equal(run(root, "verify-current", id).status, 0);
        assert.equal(run(root, "verify-current").status, 0);

        await writeFile(join(output, "pyd-button.json"), JSON.stringify({
            name: "pyd-button",
            registryDependencies: [`${publicBase}pyd-utils.json`],
            files: [{ content: "new button" }],
        }));
        assert.equal(run(root, "verify").status, 0);
        assert.notEqual(run(root, "verify-current", id).status, 0);
        assert.notEqual(run(root, "verify-current").status, 0);
        const next = run(root, "create");
        assert.equal(next.status, 0, next.stderr);
        assert(!next.stdout.includes(id));
        const nextId = next.stdout.match(/sha256-[a-f0-9]{64}/)?.[0];
        assert(nextId);
        await cp(join(root, "registry/releases", nextId),
            join(root, "docs/r/releases", nextId), { recursive: true });
        await cp(join(output, "pyd-button.json"),
            join(root, "docs/r/pyd-button.json"));
        assert.equal(run(root, "verify").status, 0);
        assert.equal(run(root, "verify-current", nextId).status, 0);
        assert.equal(run(root, "verify-current").status, 0);

        await writeFile(join(root, "docs/r/pyd-button.json"), "stale item");
        assert.notEqual(run(root, "verify-current", nextId).status, 0);
        assert.notEqual(run(root, "verify-current").status, 0);
        await cp(join(output, "pyd-button.json"),
            join(root, "docs/r/pyd-button.json"));

        await writeFile(join(release, "pyd-button.json"),
            JSON.stringify({ ...button, files: [{ content: "tampered" }] }));
        assert.notEqual(run(root, "verify").status, 0);
        await writeFile(join(output, "pyd-button.json"), JSON.stringify({
            name: "pyd-button",
            registryDependencies: [`${publicBase}pyd-utils.json`],
            files: [{ content: "old button" }],
        }));
        assert.notEqual(run(root, "create").status, 0);
    } finally {
        await rm(root, { recursive: true, force: true });
    }
});

test("previous Vercel-hosted snapshots remain valid", async () => {
    const root = await mkdtemp(join(tmpdir(), "pydemia-legacy-release-"));
    assert(resolve(root).startsWith(`${resolve(tmpdir())}${sep}`));
    try {
        const item = { name: "pyd-utils",
            files: [{ content: "legacy utility" }] };
        const content = `${JSON.stringify(item, null, 2)}\n`;
        const sourceDigest = digest(JSON.stringify([
            { name: "pyd-utils", item },
        ]));
        const id = `sha256-${sourceDigest}`;
        const release = join(root, "registry/releases", id);
        const published = join(root, "docs/r/releases", id);
        await mkdir(release, { recursive: true });
        await mkdir(published, { recursive: true });
        const manifest = {
            schemaVersion: 1, id,
            baseUrl: `${publicBase}releases/${id}/`,
            sourceDigest, itemCount: 1,
            files: [{ name: "pyd-utils", sha256: digest(content) }],
        };
        for (const directory of [release, published]) {
            await writeFile(join(directory, "pyd-utils.json"), content);
            await writeFile(join(directory, "manifest.json"),
                `${JSON.stringify(manifest, null, 2)}\n`);
        }
        const result = run(root, "verify");
        assert.equal(result.status, 0, result.stderr);
    } finally {
        await rm(root, { recursive: true, force: true });
    }
});
