import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

function run(args) {
    const npmCli = process.env.npm_execpath;
    if (!npmCli) throw new Error("Run this script through npm run build.");
    execFileSync(process.execPath, [npmCli, ...args], { stdio: "inherit" });
}

await rm("apps/docs/public/examples", { recursive: true, force: true });
await mkdir("apps/docs/public/examples", { recursive: true });
await rm("apps/profile-demo/dist", { recursive: true, force: true });
run(["run", "build", "-w", "@pydemia/profile-demo", "--", "--base", "/examples/profile/"]);
await rm("apps/profile-demo/dist/r", { recursive: true, force: true });
await cp("apps/profile-demo/dist", "apps/docs/public/examples/profile", { recursive: true });
await rm("apps/docs/public/r", { recursive: true, force: true });
await cp("apps/profile-demo/public/r", "apps/docs/public/r", { recursive: true });
if (existsSync("registry/releases")) {
    await cp("registry/releases", "apps/docs/public/r/releases", {
        recursive: true,
    });
}
await rm("apps/docs/dist", { recursive: true, force: true });
run(["run", "build", "-w", "@pydemia/docs"]);
await mkdir("apps/docs/dist/prism", { recursive: true });
await cp("apps/docs/dist/index.html", "apps/docs/dist/prism/index.html");
await rm("docs", { recursive: true, force: true });
await cp("apps/docs/dist", "docs", { recursive: true });
for (const file of [
    "docs/index.html",
    "docs/prism/index.html",
    "docs/examples/profile/index.html",
]) {
    const html = await readFile(file, "utf8");
    await writeFile(file, html.replace(/\r+\n/g, "\n"));
}
await writeFile("docs/.nojekyll", "");
await writeFile("docs/CNAME", "ui.pydemia.ai\n");
console.log("Built GitHub Pages output in docs/.");
