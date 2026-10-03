import { mkdtemp, mkdir, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createServer } from "node:http";
import { spawn } from "node:child_process";

// An isolated Vite consumer proves the emitted sources, not workspace package exports.
const repo = new URL("../",import.meta.url);
const workdir = await mkdtemp(join(tmpdir(),"prism-consumer-"));
const prism = JSON.parse(await readFile(new URL("apps/docs/public/prism/r/registry.json",repo),"utf8"));
const generic = JSON.parse(await readFile(new URL("registry.json",repo),"utf8"));
const sources = new Map();
for (const item of generic.items) sources.set(`/r/${item.name}.json`,new URL(`apps/profile-demo/public/r/${item.name}.json`,repo));
for (const item of prism.items) sources.set(`/prism/r/${item.name}.json`,new URL(`apps/docs/public/prism/r/${item.name}.json`,repo));
let base;
const server = createServer(async (request,response) => {
    try {
        const url = new URL(request.url,base); const file = sources.get(url.pathname);
        if (!file) { response.writeHead(404).end(); return; }
        const item = JSON.parse(await readFile(file,"utf8"));
        item.registryDependencies = item.registryDependencies?.map(dep => new URL(dep).pathname.includes("/prism/r/")
            ? `${base}/prism/r/${new URL(dep).pathname.split("/").pop()}` : `${base}/r/${new URL(dep).pathname.split("/").pop()}`);
        response.writeHead(200,{"Content-Type":"application/json"}).end(JSON.stringify(item));
    } catch { response.writeHead(500).end(); }
});
await new Promise(resolve => server.listen(0,"127.0.0.1",resolve));
base = `http://127.0.0.1:${server.address().port}`;
const run = (command,args) => new Promise((resolve,reject) => {
    const child = spawn(command,args,{cwd:workdir,stdio:"inherit"});
    child.once("error",reject); child.once("exit",code => code === 0 ? resolve() : reject(new Error(`${command} exited ${code}`)));
});
try {
    await mkdir(join(workdir,"src"));
    await writeFile(join(workdir,"package.json"),JSON.stringify({name:"prism-isolated-consumer",private:true,type:"module",
        dependencies:{react:"19.2.0","react-dom":"19.2.0"},devDependencies:{"@types/react":"^19.2.0","@types/react-dom":"^19.2.0",typescript:"5.9.3",vite:"^7.3.0",tailwindcss:"^4.1.0","@tailwindcss/vite":"^4.1.0"}},null,2));
    await writeFile(join(workdir,"components.json"),JSON.stringify({"$schema":"https://ui.shadcn.com/schema.json",style:"new-york",rsc:false,tsx:true,
        tailwind:{config:"",css:"src/style.css",baseColor:"neutral",cssVariables:true},aliases:{components:"@/components",ui:"@/components/ui",utils:"@/components/ui/utils",lib:"@/lib",hooks:"@/hooks"}},null,2));
    await writeFile(join(workdir,"tsconfig.json"),JSON.stringify({compilerOptions:{target:"ES2022",module:"ESNext",moduleResolution:"Bundler",jsx:"react-jsx",strict:true,skipLibCheck:true,noEmit:true,lib:["ES2022","DOM","DOM.Iterable"],baseUrl:".",paths:{"@/*":["./src/*"]}},include:["src"]},null,2));
    await writeFile(join(workdir,"vite.config.mjs"),'import {defineConfig} from "vite"; import tailwind from "@tailwindcss/vite"; import {fileURLToPath} from "node:url"; export default defineConfig({plugins:[tailwind()],resolve:{alias:{"@":fileURLToPath(new URL("./src",import.meta.url))}}});');
    await writeFile(join(workdir,"index.html"),'<html><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>');
    await writeFile(join(workdir,"src/style.css"),'@import "tailwindcss";\n@import "./components/ui/tokens.css";\n@import "./components/ui/prism.css";');
    await run("npm",["install","--no-fund","--no-audit"]);
    console.log(`Installing all ${prism.items.length} PRISM registry items into ${workdir}`);
    await run(new URL("node_modules/.bin/shadcn",repo).pathname,["add","--yes","--overwrite",...prism.items.map(item => `${base}/prism/r/${item.name}.json`)]);
    await writeFile(join(workdir,"src/main.tsx"),`import {createRoot} from "react-dom/client"; import "./style.css";\n${prism.items.filter(item => item.name !== "prism-tokens").map(item => `import * as ${item.name.replaceAll("-","_")} from "./components/ui/${item.name}";`).join("\n")}\nconst installed = {${prism.items.filter(item => item.name !== "prism-tokens").map(item => item.name.replaceAll("-","_")).join(",")}};\ncreateRoot(document.getElementById("root")!).render(<main data-prism="light">Installed {Object.keys(installed).length} PRISM modules<prism_button.PrismButton>저장</prism_button.PrismButton></main>);`);
    await run(join(workdir,"node_modules/.bin/tsc"),["--noEmit"]);
    await run(join(workdir,"node_modules/.bin/vite"),["build"]);
    console.log(`PASS: isolated install, TypeScript and Vite build. Consumer preserved at ${workdir}`);
} finally { await new Promise(resolve => server.close(resolve)); }
