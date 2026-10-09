import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const script = fileURLToPath(new URL(
    "./check-release-history.mjs", import.meta.url,
));

function git(root, ...args) {
    const result = spawnSync("git", args, { cwd: root, encoding: "utf8" });
    assert.equal(result.status, 0, result.stderr);
    return result.stdout.trim();
}

function commit(root, message) {
    git(root, "add", "-A");
    git(root, "-c", "user.name=Release test",
        "-c", "user.email=release@example.test",
        "commit", "-qm", message);
}

function check(root, base) {
    return spawnSync(process.execPath, [script, base], {
        cwd: root, encoding: "utf8",
    });
}

test("new releases are allowed; changed or deleted releases are rejected",
    async () => {
        const root = await mkdtemp(join(tmpdir(), "pydemia-release-history-"));
        assert(resolve(root).startsWith(`${resolve(tmpdir())}${sep}`));
        try {
            git(root, "init", "-q");
            const firstId = `sha256-${"1".repeat(64)}`;
            const nextId = `sha256-${"2".repeat(64)}`;
            const firstSource = join(root, "registry/releases", firstId);
            const firstPublic = join(root, "docs/r/releases", firstId);
            for (const directory of [firstSource, firstPublic]) {
                await mkdir(directory, { recursive: true });
                await writeFile(join(directory, "pyd-button.json"), "old\n");
            }
            commit(root, "first release");
            const base = git(root, "rev-parse", "HEAD");

            for (const directory of [
                join(root, "registry/releases", nextId),
                join(root, "docs/r/releases", nextId),
            ]) {
                await mkdir(directory, { recursive: true });
                await writeFile(join(directory, "pyd-button.json"), "new\n");
            }
            commit(root, "next release");
            assert.equal(check(root, base).status, 0);

            await writeFile(join(firstSource, "pyd-button.json"),
                "changed\n");
            commit(root, "change old release");
            const changed = check(root, base);
            assert.notEqual(changed.status, 0);
            assert.match(changed.stderr, /registry\/releases/);

            await writeFile(join(firstSource, "pyd-button.json"), "old\n");
            await rm(join(firstPublic, "pyd-button.json"));
            commit(root, "delete published release");
            const deleted = check(root, base);
            assert.notEqual(deleted.status, 0);
            assert.match(deleted.stderr, /docs\/r\/releases/);

            assert.notEqual(check(root, "").status, 0);
        } finally {
            await rm(root, { recursive: true, force: true });
        }
    });
