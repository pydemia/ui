import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { execFileSync } from "node:child_process";

function run(args) {
    execFileSync("npm", args, { stdio: "inherit" });
}

await rm("apps/docs/public/examples", { recursive: true, force: true });
await mkdir("apps/docs/public/examples", { recursive: true });
await rm("apps/profile-demo/dist", { recursive: true, force: true });
run(["run", "build", "-w", "@pydemia/profile-demo", "--", "--base", "/examples/profile/"]);
await rm("apps/profile-demo/dist/r", { recursive: true, force: true });
await cp("apps/profile-demo/dist", "apps/docs/public/examples/profile", { recursive: true });
await cp("apps/profile-demo/public/r", "apps/docs/public/r", { recursive: true });
await rm("apps/docs/dist", { recursive: true, force: true });
run(["run", "build", "-w", "@pydemia/docs"]);
await rm("docs", { recursive: true, force: true });
await cp("apps/docs/dist", "docs", { recursive: true });
await writeFile("docs/.nojekyll", "");
await writeFile("docs/CNAME", "ui.pydemia.ai\n");
console.log("Built GitHub Pages output in docs/.");
