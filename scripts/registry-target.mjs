const componentPrefix = "packages/ui/src/components/";

/** Preserve relative imports when component helpers live in a subdirectory. */
export function registryTarget(path) {
    if (path === "packages/ui/src/styles.css") return "@ui/tokens.css";
    if (path === "packages/ui/src/design-modes.css") return "@ui/design-modes.css";
    if (path === "packages/ui/src/design-fonts.css") return "@ui/design-fonts.css";
    if (path === "packages/ui/src/components/flow-canvas.css") return "@ui/flow-canvas.css";
    if (path === "registry/SHADCN_UI_LICENSE.md") return "@ui/SHADCN_UI_LICENSE.md";
    if (path.startsWith(componentPrefix)) {
        const relative = path.slice(componentPrefix.length);
        if (/^(?:[a-z][a-z0-9-]*\/)*[a-z][a-z0-9-]*\.tsx?$/.test(relative)) {
            return `@ui/${relative}`;
        }
    }
    throw new Error(`Unexpected registry file: ${path}`);
}
