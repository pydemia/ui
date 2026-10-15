import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import {
    copyFile, mkdir, mkdtemp, readFile, readdir, writeFile,
} from "node:fs/promises";
import { createServer } from "node:http";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
const arguments_ = process.argv.slice(2);
const baseIndex = arguments_.indexOf("--registry-base");
assert(arguments_.every((value, index) => value === "--registry-base"
    || index === baseIndex + 1 && baseIndex >= 0),
"Usage: node scripts/check-design-modes-consumer.mjs [--registry-base URL]");
let registryBase;
if (baseIndex >= 0) {
    registryBase = new URL(arguments_[baseIndex + 1]);
    assert(["http:", "https:"].includes(registryBase.protocol));
    assert(!registryBase.username && !registryBase.password,
        "Registry URLs must not include credentials.");
    assert(!registryBase.search && !registryBase.hash,
        "Registry base must be a directory URL without query or hash.");
    if (!registryBase.pathname.endsWith("/")) registryBase.pathname += "/";
}
const evidenceRoot = join(root,
    ".worknotes/browser-evidence/design-modes-consumer-check");
await mkdir(evidenceRoot, { recursive: true });
const project = await mkdtemp(join(evidenceRoot, "attempt-"));
const fixture = join(root, "scripts/design-modes-consumer-fixture");
const lock = JSON.parse(await readFile(join(root, "package-lock.json"), "utf8"));
const version = (name) => {
    const value = lock.packages[`node_modules/${name}`]?.version;
    assert(value, `Missing installed version for ${name}`);
    return value;
};
const shadcnPackage = JSON.parse(await readFile(
    join(root, "node_modules/shadcn/package.json"), "utf8",
));
assert.equal(shadcnPackage.version, "4.21.0", "Install pinned shadcn 4.21.0 first.");
const cli = join(root, "node_modules/shadcn",
    typeof shadcnPackage.bin === "string"
        ? shadcnPackage.bin : shadcnPackage.bin.shadcn);
const npmCli = process.env.npm_execpath
    ?? join(dirname(process.execPath), "node_modules/npm/bin/npm-cli.js");
assert(existsSync(npmCli), "Run with npm's Node installation or npm exec.");
const items = [
    "pyd-design-modes", "pyd-tokens", "pyd-portal-scope", "pyd-button",
    "pyd-input", "pyd-table", "pyd-badge", "pyd-dialog",
    "pyd-input-group", "pyd-field", "pyd-tags-input", "pyd-code-editor-shell",
    "pyd-prompt-input", "pyd-tabs",
    "pyd-tree", "pyd-navigation", "pyd-gantt", "pyd-calendar",
    "pyd-message", "pyd-bullet-chart", "pyd-log-console", "pyd-accordion",
];
const commands = [];
const report = {
    project, registrySource: registryBase?.href ?? "local compiled JSON mirror",
    cliVersion: shadcnPackage.version, status: "running",
    browserVerified: false, commands,
};
let server;
let registryURL = registryBase;

async function run(label, executable, args) {
    const command = { label, executable, args, exitCode: null };
    commands.push(command);
    console.log(`${label}: ${project}`);
    let output = "";
    const exitCode = await new Promise((resolve, reject) => {
        const child = spawn(executable, args, {
            cwd: project, windowsHide: true,
            env: { ...process.env, CI: "true" },
            stdio: ["ignore", "pipe", "pipe"],
        });
        for (const stream of [child.stdout, child.stderr]) {
            stream.on("data", (data) => {
                output += data.toString();
                process.stdout.write(data);
            });
        }
        child.once("error", reject);
        child.once("exit", resolve);
    });
    command.exitCode = exitCode;
    await writeFile(join(project, `${label}.log`), output);
    assert.equal(exitCode, 0, `${label} failed; see preserved log.`);
    return output;
}

async function writeJSON(path, value) {
    await writeFile(join(project, path), JSON.stringify(value, null, 2) + "\n");
}

try {
    if (!registryBase) {
        server = createServer(async (request, response) => {
            try {
                const name = basename(new URL(request.url, registryURL).pathname);
                if (!/^pyd-[a-z0-9-]+\.json$/.test(name)) {
                    response.writeHead(404).end();
                    return;
                }
                const item = JSON.parse(await readFile(join(root,
                    "apps/profile-demo/public/r", name), "utf8"));
                item.registryDependencies = item.registryDependencies?.map(
                    (dependency) => new URL(
                        basename(new URL(dependency).pathname), registryURL,
                    ).href,
                );
                response.writeHead(200, { "Content-Type": "application/json" });
                response.end(JSON.stringify(item));
            } catch (error) {
                response.writeHead(500).end(String(error));
            }
        });
        await new Promise((resolve, reject) => {
            server.once("error", reject);
            server.listen(0, "127.0.0.1", resolve);
        });
        registryURL = new URL(`http://127.0.0.1:${server.address().port}/r/`);
    }
    await mkdir(join(project, "src"));
    await writeJSON("package.json", {
        name: "design-modes-independent-consumer", private: true, type: "module",
        scripts: { typecheck: "tsc --noEmit", build: "vite build" },
        dependencies: Object.fromEntries(["react", "react-dom"].map(
            (name) => [name, version(name)],
        )),
        devDependencies: Object.fromEntries([
            "@types/react", "@types/react-dom", "typescript", "vite",
            "tailwindcss", "@tailwindcss/vite",
        ].map((name) => [name, version(name)])),
    });
    await writeJSON("components.json", {
        $schema: "https://ui.shadcn.com/schema.json", style: "new-york",
        rsc: false, tsx: true,
        tailwind: {
            config: "", css: "src/style.css", baseColor: "neutral",
            cssVariables: true,
        },
        aliases: {
            components: "@/components", ui: "@/components/ui",
            utils: "@/components/ui/utils", lib: "@/lib", hooks: "@/hooks",
        },
    });
    await writeJSON("tsconfig.json", {
        compilerOptions: {
            target: "ES2022", module: "ESNext", moduleResolution: "Bundler",
            jsx: "react-jsx", strict: true, skipLibCheck: true, noEmit: true,
            lib: ["ES2022", "DOM", "DOM.Iterable"], baseUrl: ".",
            paths: { "@/*": ["./src/*"] },
        },
        include: ["src"],
    });
    await writeFile(join(project, "vite.config.mjs"),
        'import { defineConfig } from "vite";\n'
        + 'import tailwind from "@tailwindcss/vite";\n'
        + 'import { fileURLToPath } from "node:url";\n'
        + 'export default defineConfig({plugins:[tailwind()],resolve:{alias:{'
        + '"@":fileURLToPath(new URL("./src",import.meta.url))}}});\n');
    await writeFile(join(project, "index.html"),
        '<!doctype html><html lang="en"><head><meta charset="utf-8">'
        + '<meta name="viewport" content="width=device-width,initial-scale=1">'
        + '<title>Independent design mode consumer</title></head>'
        + '<body><div id="root"></div>'
        + '<script type="module" src="/src/main.tsx"></script></body></html>\n');
    await copyFile(join(fixture, "style.css"), join(project, "src/style.css"));
    await run("npm-install", process.execPath,
        [npmCli, "install", "--no-fund", "--no-audit"]);
    await run("shadcn-install", process.execPath, [cli, "add", "--yes",
        "--overwrite", ...items.map((item) => new URL(`${item}.json`, registryURL).href)]);
    await copyFile(join(fixture, "main.tsx"), join(project, "src/main.tsx"));
    const installed = join(project, "src/components/ui");
    const modeItem = await fetch(new URL("pyd-design-modes.json", registryURL));
    assert(modeItem.ok, "Registry design mode item must be readable.");
    const compiled = await modeItem.json();
    const printer = ts.createPrinter({ removeComments: true });
    const comparableSource = (path, content) => /\.tsx?$/.test(path)
        ? printer.printFile(ts.createSourceFile(path, content,
            ts.ScriptTarget.Latest, true))
        : content.replaceAll("\r\n", "\n");
    for (const file of compiled.files) {
        assert(file.target.startsWith("@ui/"));
        const target = join(installed, file.target.slice(4));
        // shadcn's TS transform drops leading comments, so compare parsed code.
        assert.equal(comparableSource(target, await readFile(target, "utf8")),
            comparableSource(target, file.content),
            `Installed file differs from registry: ${file.target}`);
    }
    const installedPackage = JSON.parse(await readFile(
        join(project, "package.json"), "utf8",
    ));
    assert(!installedPackage.dependencies["@pydemia/ui"]);
    const installedLock = JSON.parse(await readFile(
        join(project, "package-lock.json"), "utf8",
    ));
    report.installedVersions = {};
    for (const name of Object.keys({
        ...installedPackage.dependencies, ...installedPackage.devDependencies,
    })) {
        const installedVersion = installedLock.packages[`node_modules/${name}`].version;
        assert.equal(installedVersion, version(name),
            `Consumer dependency differs from repository lockfile: ${name}`);
        report.installedVersions[name] = installedVersion;
    }
    report.sourceComparison = {
        files: compiled.files.map((file) => file.target),
        typescript: "parsed code with comments excluded",
        css: "exact content after LF normalization",
    };
    await run("typecheck", process.execPath,
        [join(project, "node_modules/typescript/bin/tsc"), "--noEmit"]);
    await run("vite-build", process.execPath,
        [join(project, "node_modules/vite/bin/vite.js"), "build"]);
    await mkdir(join(project, "release-gate"));
    await writeJSON("release-gate/package.json", { type: "commonjs" });
    await run("release-gate-compile", process.execPath, [
        join(project, "node_modules/typescript/bin/tsc"),
        join(installed, "foundation/design-mode-settings.ts"),
        "--outDir", "release-gate", "--module", "commonjs",
        "--moduleResolution", "node", "--target", "ES2022", "--skipLibCheck",
    ]);
    await copyFile(join(fixture, "release-gate.mjs"),
        join(project, "release-gate/release-gate.mjs"));
    const gateOutput = await run("release-gate", process.execPath,
        [join(project, "release-gate/release-gate.mjs")]);
    report.releaseGate = JSON.parse(gateOutput.trim().split("\n").at(-1));
    const assetNames = await readdir(join(project, "dist/assets"));
    const cssName = assetNames.find((name) => name.endsWith(".css"));
    assert(cssName, "Tailwind build must emit CSS.");
    const css = await readFile(join(project, "dist/assets", cssName), "utf8");
    assert(css.includes("--palette-background"), "Token CSS must be bundled.");
    assert(css.includes("data-design"), "Optional design mode CSS must be bundled.");
    report.cssSha256 = createHash("sha256").update(css).digest("hex");
    report.status = "passed";
    console.log(`PASS: CLI install, source equality, typecheck, build, release gate. ${project}`);
    console.log(`Browser fixture: node "${join(project, "node_modules/vite/bin/vite.js")}" --host 127.0.0.1 (cwd ${project})`);
} catch (error) {
    report.status = "failed";
    report.error = String(error);
    throw error;
} finally {
    await writeJSON("verification.json", report);
    if (server) await new Promise((resolve) => server.close(resolve));
}
