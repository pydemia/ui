import assert from "node:assert/strict";
import test from "node:test";
import { act, createElement as h, createRef, StrictMode } from "react";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/", pretendToBeVisual: true,
});
for (const name of [
    "window", "document", "HTMLElement", "HTMLInputElement", "Element",
    "Node", "NodeFilter", "MutationObserver", "CustomEvent", "Event",
]) globalThis[name] = dom.window[name];
globalThis.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { renderToString } = await import("react-dom/server");
const { createRoot, hydrateRoot } = await import("react-dom/client");
const { createPortal } = await import("react-dom");
const {
    ThemeScope, PortalScope, usePortalContainer, applyThemeToElement,
    Dialog, DialogContent, DialogTitle, DialogDescription,
} = await import("../dist/index.js");

function Probe({ container, name }) {
    const target = usePortalContainer(container);
    return createPortal(h("span", { "data-probe": name }, name),
        target ?? document.body);
}

async function mount(children) {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    await act(async () => root.render(children));
    return {
        container,
        async render(next) { await act(async () => root.render(next)); },
        async unmount() {
            await act(async () => root.unmount());
            container.remove();
        },
    };
}

test("DOM adapter replaces the complete theme and restores owned values", () => {
    const element = document.createElement("div");
    element.className = "custom dark";
    element.setAttribute("data-design", "previous");
    element.style.setProperty("--accent", "#123456", "important");
    element.style.setProperty("font-family", "serif", "important");
    element.style.setProperty("margin", "7px");
    const restore = applyThemeToElement(element, { appearance: "light" });
    assert.equal(element.dataset.design, "basic");
    assert.equal(element.style.colorScheme, "light");
    assert.equal(element.classList.contains("dark"), false);
    assert.equal(element.style.getPropertyValue("--palette-accent"), "#245d70");
    for (const property of ["--color-accent", "--font-ui", "--control-height",
        "--shadow-float", "--overlay", "--radius"]) {
        assert.ok(element.style.getPropertyValue(property), property);
    }
    element.classList.add("added");
    element.style.setProperty("padding", "3px");
    restore();
    assert.equal(element.dataset.design, "previous");
    assert.equal(element.hasAttribute("data-appearance"), false);
    assert.equal(element.style.getPropertyValue("--accent"), "#123456");
    assert.equal(element.style.getPropertyPriority("font-family"), "important");
    assert.equal(element.style.getPropertyValue("--palette-accent"), "");
    assert.equal(element.style.fontFamily, "serif");
    assert.equal(element.style.margin, "7px");
    assert.equal(element.style.padding, "3px");
    assert.equal(element.className, "custom added dark");
});

test("light scopes and their body hosts isolate dark parent tokens", async () => {
    document.documentElement.classList.add("dark");
    const ref = createRef();
    const view = await mount(h(ThemeScope, {
        ref, id: "light-region", "aria-label": "Preview",
        settings: { appearance: "light", colormap: "ocean" },
    }, h(Probe, { name: "local" })));
    try {
        const region = ref.current;
        const host = document.querySelector('[data-probe="local"]').parentElement;
        assert.equal(region.id, "light-region");
        assert.equal(region.getAttribute("aria-label"), "Preview");
        assert.equal(host.parentElement, document.body);
        assert.equal(host.hasAttribute("data-theme-portal"), true);
        for (const target of [region, host]) {
            assert.equal(target.dataset.appearance, "light");
            assert.equal(target.style.colorScheme, "light");
            assert.equal(target.style.getPropertyValue("--palette-surface"), "#ffffff");
            assert.equal(target.style.getPropertyValue("--color-surface"), "var(--surface)");
            assert.equal(target.style.fontFamily, "var(--font-ui)");
        }
    } finally {
        await view.unmount();
        document.documentElement.classList.remove("dark");
    }
    assert.equal(ref.current, null);
    assert.equal(document.querySelector("[data-theme-portal]"), null);
});

test("nearest scopes, explicit containers and explicit null have priority", async () => {
    const explicit = document.createElement("div");
    document.body.append(explicit);
    const view = await mount(h(ThemeScope, { settings: { colormap: "ocean" } },
        h(Probe, { name: "outer" }),
        h(ThemeScope, { settings: { colormap: "forest" } },
            h(Probe, { name: "inner" }),
            h(Probe, { name: "explicit", container: explicit }),
            h(Probe, { name: "body", container: null }),
            h(PortalScope, {}, h(Probe, { name: "inherited" })))));
    try {
        const parent = (name) => document.querySelector(
            `[data-probe="${name}"]`,
        ).parentElement;
        assert.equal(parent("outer").dataset.colormap, "ocean");
        assert.equal(parent("inner").dataset.colormap, "forest");
        assert.equal(parent("inherited"), parent("inner"));
        assert.notEqual(parent("outer"), parent("inner"));
        assert.equal(parent("explicit"), explicit);
        assert.equal(parent("body"), document.body);
    } finally {
        await view.unmount();
        explicit.remove();
    }
    assert.equal(document.querySelector("[data-theme-portal]"), null);
});

test("open dialogs and input values keep identity across theme updates", async () => {
    function Preview({ appearance, design = "basic" }) {
        return h(ThemeScope, {
            settings: { appearance, design }, options: { allowUnreleased: true },
        }, h(Dialog, { open: true }, h(DialogContent, null,
            h(DialogTitle, null, "Persistent dialog"),
            h(DialogDescription, null, "Edit the value"),
            h("input", { "aria-label": "Value", defaultValue: "initial" }))));
    }
    const view = await mount(h(StrictMode, null,
        h(Preview, { appearance: "light" })));
    const dialog = document.querySelector('[role="dialog"]');
    const input = dialog.querySelector("input");
    const host = dialog.closest("[data-theme-portal]");
    input.value = "user edit";
    await view.render(h(StrictMode, null,
        h(Preview, { appearance: "dark", design: "glass" })));
    assert.equal(document.querySelector('[role="dialog"]'), dialog);
    assert.equal(dialog.querySelector("input"), input);
    assert.equal(input.value, "user edit");
    assert.equal(dialog.closest("[data-theme-portal]"), host);
    assert.equal(host.dataset.appearance, "dark");
    assert.equal(host.dataset.design, "glass");
    assert.equal(document.querySelectorAll("[data-theme-portal]").length, 1);
    await view.unmount();
    assert.equal(document.querySelector('[role="dialog"]'), null);
    assert.equal(document.querySelector("[data-theme-portal]"), null);
});

test("DialogContent forwards explicit container and defaults to body outside scopes", async () => {
    const explicit = document.createElement("div");
    document.body.append(explicit);
    const dialog = (container) => h(Dialog, { open: true },
        h(DialogContent, { container }, h(DialogTitle, null, "Container"),
            h(DialogDescription, null, "Description")));
    const view = await mount(h(ThemeScope, null, dialog(explicit)));
    assert.ok(explicit.querySelector('[role="dialog"]'));
    assert.equal(explicit.querySelector('[role="dialog"]').hasAttribute("container"), false);
    await view.unmount();
    const outside = await mount(dialog(undefined));
    assert.equal(document.querySelector('[role="dialog"]').parentElement, document.body);
    await outside.unmount();
    explicit.remove();
});

test("server rendering preserves scope children and hydration identity", async () => {
    const previousDocument = globalThis.document;
    delete globalThis.document;
    let markup;
    const content = h(ThemeScope, { settings: { appearance: "light" } },
        h("input", { "aria-label": "Server value", defaultValue: "server" }),
        h(Dialog, { open: true }, h(DialogContent, null,
            h(DialogTitle, null, "Server dialog"),
            h(DialogDescription, null, "Description"))));
    try { markup = renderToString(content); }
    finally { globalThis.document = previousDocument; }
    const container = document.createElement("div");
    container.innerHTML = markup;
    document.body.append(container);
    const input = container.querySelector("input");
    assert.ok(input);
    input.value = "before hydration";
    let root;
    const errors = [];
    await act(async () => { root = hydrateRoot(container, content,
        { onRecoverableError: (error) => errors.push(error) }); });
    assert.deepEqual(errors, []);
    assert.equal(container.querySelector("input"), input);
    assert.equal(input.value, "before hydration");
    await act(async () => root.unmount());
    container.remove();
});

test("unreleased and malformed settings stay on the strict default path", () => {
    const element = document.createElement("div");
    const restore = applyThemeToElement(element, {
        design: "glass", appearance: "light", colormap: "invalid",
        overrides: { light: { "--accent": "url(invalid)" }, dark: {} },
    });
    assert.equal(element.dataset.design, "basic");
    assert.equal(element.dataset.colormap, "neutral");
    assert.equal(element.style.getPropertyValue("--accent"),
        "var(--palette-accent)");
    restore();
});
