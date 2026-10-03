import { execFileSync } from "node:child_process";

const base = process.argv[2];
if (!/^[0-9a-f]{40}$/.test(base ?? "") || /^0+$/.test(base)) {
    throw new Error("A nonzero base commit SHA is required.");
}

const changed = execFileSync("git", [
    "diff", "--no-renames", "--name-only", "-z",
    "--diff-filter=DMT", base, "HEAD", "--",
    "registry/releases", "docs/r/releases",
], { encoding: "utf8" }).split("\0").filter(Boolean);

if (changed.length > 0) {
    throw new Error(
        "Published release files must remain unchanged:\n" +
        changed.map((path) => `- ${path}`).join("\n"),
    );
}

console.log("Published release history is unchanged.");
