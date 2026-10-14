import { build } from "esbuild";
import { mkdir } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../../../", import.meta.url));
const output = new URL("../../../.worknotes/browser-evidence/design-modes-docs-tests/", import.meta.url);
await mkdir(output, { recursive: true });
await build({
    absWorkingDir: root,
    entryPoints: {
        controller: "apps/docs/src/theme/controller.ts",
        storage: "apps/docs/src/theme/storage.ts",
        "design-mode-picker": "apps/docs/src/components/design-mode-picker.tsx",
        "profile-bridge": "apps/docs/src/theme/profile-bridge.ts",
        "profile-app": "apps/profile-demo/src/main.tsx",
    },
    outdir: fileURLToPath(output),
    bundle: true, packages: "external", format: "esm", platform: "node",
    jsx: "automatic", loader: { ".css": "empty" },
    define: {
        "import.meta.env.DEV": "true",
        "import.meta.env.BASE_URL": '"/examples/profile/"',
    },
});
const result = spawnSync(process.execPath, ["--test", "apps/docs/tests/*.test.mjs"], {
    cwd: root, stdio: "inherit", windowsHide: true,
});
process.exitCode = result.status ?? 1;
