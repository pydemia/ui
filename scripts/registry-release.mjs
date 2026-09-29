import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const publicBase = "https://pydemia-ui.vercel.app/r/";
const releaseRoot = "registry/releases";
const publishedRoot = "docs/r/releases";
const releaseIdPattern = /^sha256-[a-f0-9]{64}$/;

function digest(content) {
    return createHash("sha256").update(content).digest("hex");
}

function canonicalItem(item, base, names) {
    assert(names.has(item.name), `Unknown release item: ${item.name}`);
    const result = structuredClone(item);
    if (result.registryDependencies !== undefined) {
        assert(Array.isArray(result.registryDependencies),
            `Invalid registry dependencies: ${item.name}`);
        result.registryDependencies = result.registryDependencies.map(
            (address) => {
                assert(typeof address === "string" &&
                    address.startsWith(base) && address.endsWith(".json"),
                `Dependency escapes release ${item.name}: ${address}`);
                const name = address.slice(base.length, -5);
                assert(names.has(name) && address === `${base}${name}.json`,
                    `Unknown release dependency ${item.name}: ${address}`);
                return `./${name}.json`;
            },
        );
    }
    return result;
}

function releaseDigest(items, base, names) {
    return digest(JSON.stringify(items.map((item) => ({
        name: item.name,
        item: canonicalItem(item, base, names),
    }))));
}

async function registryNames() {
    const registry = JSON.parse(await readFile("registry.json", "utf8"));
    const names = registry.items.map((item) => item.name).sort();
    assert(names.every((name) => /^pyd-[a-z0-9-]+$/.test(name)));
    assert.equal(new Set(names).size, names.length,
        "Registry item names must be unique");
    return names;
}

async function currentRegistryItems() {
    const names = await registryNames();
    const items = await Promise.all(names.map(async (name) => {
        const item = JSON.parse(await readFile(
            `apps/profile-demo/public/r/${name}.json`, "utf8",
        ));
        assert.equal(item.name, name);
        return item;
    }));
    return { names, items };
}

async function checkRelease(id, checkPublished) {
    assert(releaseIdPattern.test(id), `Invalid release ID: ${id}`);
    const directory = join(releaseRoot, id);
    const manifest = JSON.parse(await readFile(
        join(directory, "manifest.json"), "utf8",
    ));
    const base = `${publicBase}releases/${id}/`;
    assert.equal(manifest.schemaVersion, 1);
    assert.equal(manifest.id, id);
    assert.equal(manifest.baseUrl, base);
    assert.equal(manifest.sourceDigest, id.slice("sha256-".length));
    assert(Array.isArray(manifest.files) && manifest.files.length > 0);
    const names = manifest.files.map((file) => file.name);
    assert.deepEqual(names, [...names].sort(),
        `Release files must be sorted: ${id}`);
    assert.equal(new Set(names).size, names.length);
    const expectedFiles = ["manifest.json",
        ...names.map((name) => `${name}.json`)].sort();
    assert.deepEqual((await readdir(directory)).sort(), expectedFiles,
        `Release file list differs: ${id}`);
    const nameSet = new Set(names);
    const items = [];
    for (const file of manifest.files) {
        assert(/^pyd-[a-z0-9-]+$/.test(file.name));
        const name = `${file.name}.json`;
        const content = await readFile(join(directory, name));
        assert.equal(digest(content), file.sha256,
            `Release file changed: ${id}/${name}`);
        const item = JSON.parse(content.toString("utf8"));
        assert.equal(item.name, file.name);
        items.push(item);
        if (checkPublished) {
            const published = await readFile(join(publishedRoot, id, name));
            assert.deepEqual(published, content,
                `Published release file differs: ${id}/${name}`);
        }
    }
    assert.equal(manifest.itemCount, items.length);
    assert.equal(releaseDigest(items, base, nameSet),
        manifest.sourceDigest, `Release content changed: ${id}`);
    if (checkPublished) {
        assert.deepEqual(
            (await readdir(join(publishedRoot, id))).sort(), expectedFiles,
            `Published release file list differs: ${id}`,
        );
        assert.deepEqual(
            await readFile(join(publishedRoot, id, "manifest.json")),
            await readFile(join(directory, "manifest.json")),
            `Published release manifest differs: ${id}`,
        );
    }
    return manifest;
}

async function createRelease() {
    const { names, items } = await currentRegistryItems();
    const nameSet = new Set(names);
    const sourceDigest = releaseDigest(items, publicBase, nameSet);
    const id = `sha256-${sourceDigest}`;
    const base = `${publicBase}releases/${id}/`;
    const directory = join(releaseRoot, id);
    if (existsSync(directory)) {
        await checkRelease(id, false);
        console.log(`Registry release already exists: ${id}`);
        return;
    }
    const files = [];
    const contents = [];
    for (const item of items) {
        const snapshot = canonicalItem(item, publicBase, nameSet);
        if (snapshot.registryDependencies !== undefined) {
            snapshot.registryDependencies =
                snapshot.registryDependencies.map((dependency) =>
                    `${base}${dependency.slice(2)}`);
        }
        const content = `${JSON.stringify(snapshot, null, 2)}\n`;
        files.push({ name: item.name, sha256: digest(content) });
        contents.push([`${item.name}.json`, content]);
    }
    const manifest = {
        schemaVersion: 1, id, baseUrl: base, sourceDigest,
        itemCount: names.length, files,
    };
    await mkdir(directory, { recursive: true });
    for (const [name, content] of contents) {
        await writeFile(join(directory, name), content, { flag: "wx" });
    }
    await writeFile(join(directory, "manifest.json"),
        `${JSON.stringify(manifest, null, 2)}\n`, { flag: "wx" });
    await checkRelease(id, false);
    console.log(`Created ${id} with ${names.length} registry items.`);
}

async function verifyCurrent(id) {
    assert(releaseIdPattern.test(id), `Invalid release ID: ${id}`);
    const { names, items } = await currentRegistryItems();
    const currentId = `sha256-${releaseDigest(
        items, publicBase, new Set(names),
    )}`;
    assert.equal(id, currentId,
        `Release ${id} differs from the current built registry ${currentId}`);
    const manifest = await checkRelease(id, true);
    assert.deepEqual(manifest.files.map((file) => file.name), names);
    for (const name of ["registry", ...names]) {
        assert.deepEqual(
            await readFile(join("docs/r", `${name}.json`)),
            await readFile(join("apps/profile-demo/public/r", `${name}.json`)),
            `Published latest registry differs: ${name}`,
        );
    }
    console.log(`Verified current built registry against ${id}.`);
}

async function verifyReleases() {
    if (!existsSync(releaseRoot)) {
        console.log("Verified 0 immutable registry releases.");
        return;
    }
    const entries = await readdir(releaseRoot, { withFileTypes: true });
    for (const entry of entries) {
        assert(entry.isDirectory(), `Unexpected release entry: ${entry.name}`);
        await checkRelease(entry.name, true);
    }
    console.log(`Verified ${entries.length} immutable registry releases.`);
}

const command = process.argv[2];
if (command === "create") await createRelease();
else if (command === "verify") await verifyReleases();
else if (command === "verify-current") await verifyCurrent(process.argv[3]);
else throw new Error(
    "Use registry-release.mjs create, verify, or verify-current <id>.",
);
