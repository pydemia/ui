import assert from "node:assert/strict";
import test from "node:test";
import { act, createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/",
});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { AvatarUploader } = await import("../dist/index.js");
const { createRoot } = await import("react-dom/client");

const baseProps = {
    label: "프로필 사진",
    alt: "김하나의 프로필 사진",
    fallback: "김",
    src: "/profile.png",
    onImageChange: () => {},
};

function staticMarkup(props = {}) {
    return renderToStaticMarkup(createElement(AvatarUploader, {
        ...baseProps, ...props,
    }));
}

test("avatar editor exposes its native picker and required actions", () => {
    const markup = staticMarkup();
    const view = new JSDOM(markup).window.document;
    const section = view.querySelector("section");
    const input = section.querySelector('input[type="file"]');

    assert.equal(section.getAttribute("aria-label"), "프로필 사진");
    assert.equal(view.querySelector("label").htmlFor, input.id);
    assert.equal(input.getAttribute("accept"),
        "image/png,image/jpeg,image/webp");
    assert.match(section.textContent, /김/);
    assert.match(section.textContent, /사진 제거/);
    assert.doesNotMatch(staticMarkup({ src: null }), /사진 제거/);

    assert.throws(() => staticMarkup({ label: " " }), /requires a label/);
    assert.throws(() => staticMarkup({ onImageChange: null }),
        /requires onImageChange/);
    assert.throws(() => staticMarkup({ maxBytes: 0 }),
        /maxBytes must be positive/);
    assert.throws(() => staticMarkup({ outputWidth: 0 }),
        /outputWidth must be 1–4096px/);
});

test("file validation rejects unsupported, empty and oversized images",
    async () => {
        const container = document.createElement("div");
        document.body.append(container);
        const root = createRoot(container);
        const changes = [];
        await act(async () => root.render(createElement(AvatarUploader, {
            ...baseProps, maxBytes: 3,
            onImageChange: (value) => changes.push(value),
        })));
        const input = container.querySelector('input[type="file"]');

        async function choose(file) {
            Object.defineProperty(input, "files", {
                configurable: true, value: [file],
            });
            await act(async () => input.dispatchEvent(new dom.window.Event(
                "change", { bubbles: true },
            )));
        }

        try {
            await choose(new dom.window.File(["a"], "notes.txt", {
                type: "text/plain",
            }));
            assert.match(container.querySelector('[role="alert"]').textContent,
                /PNG, JPEG, WebP/);
            await choose(new dom.window.File([], "empty.png", {
                type: "image/png",
            }));
            assert.match(container.querySelector('[role="alert"]').textContent,
                /빈 이미지/);
            await choose(new dom.window.File(["1234"], "large.png", {
                type: "image/png",
            }));
            assert.match(container.querySelector('[role="alert"]').textContent,
                /3바이트 이하/);
            assert.equal(container.querySelector("canvas"), null);
            assert.deepEqual(changes, []);
        } finally {
            await act(async () => root.unmount());
            container.remove();
        }
    });

test("cropping previews a PNG, returns focus, and removal clears it",
    async () => {
        const originalImage = dom.window.Image;
        const originalContext = dom.window.HTMLCanvasElement.prototype.getContext;
        const originalToBlob = dom.window.HTMLCanvasElement.prototype.toBlob;
        const originalCreate = URL.createObjectURL;
        const originalRevoke = URL.revokeObjectURL;
        const revoked = [];
        let nextUrl = 0;
        URL.createObjectURL = () => `blob:preview-${++nextUrl}`;
        URL.revokeObjectURL = (url) => revoked.push(url);
        dom.window.Image = class {
            complete = true;
            naturalWidth = 128;
            naturalHeight = 128;
            addEventListener() {}
            removeEventListener() {}
            set src(_value) { queueMicrotask(() => this.onload?.()); }
        };
        dom.window.HTMLCanvasElement.prototype.getContext = () => ({
            clearRect() {}, drawImage() {},
        });
        dom.window.HTMLCanvasElement.prototype.toBlob = (callback) =>
            callback(new dom.window.Blob(["png"], { type: "image/png" }));

        const container = document.createElement("div");
        document.body.append(container);
        const root = createRoot(container);
        const changes = [];

        try {
            await act(async () => root.render(createElement(AvatarUploader, {
                ...baseProps,
                onImageChange: (value) => changes.push(value),
            })));
            const input = container.querySelector('input[type="file"]');
            Object.defineProperty(input, "files", {
                configurable: true,
                value: [new dom.window.File(["image"], "photo.png", {
                    type: "image/png",
                })],
            });
            await act(async () => input.dispatchEvent(new dom.window.Event(
                "change", { bubbles: true },
            )));
            const crop = [...container.querySelectorAll("button")].find(
                (button) => button.textContent === "PNG 자르기",
            );
            assert.equal(crop.disabled, false);
            await act(async () => crop.click());
            assert.equal(changes.length, 1);
            assert.equal(changes[0].type, "image/png");
            assert.equal(container.querySelector("img")?.getAttribute("src"),
                "blob:preview-2");
            assert.equal(document.activeElement, input);
            assert.match(container.textContent, /새 사진 미리보기/);

            const remove = [...container.querySelectorAll("button")].find(
                (button) => button.textContent === "사진 제거",
            );
            await act(async () => remove.click());
            assert.deepEqual(changes, [changes[0], null]);
            assert.equal(container.querySelector("img"), null);
            assert.equal(document.activeElement, input);
            assert.match(container.textContent, /사진을 제거했습니다/);
            assert.ok(revoked.includes("blob:preview-2"));

            await act(async () => input.dispatchEvent(new dom.window.Event(
                "change", { bubbles: true },
            )));
            assert.doesNotMatch(container.textContent,
                /사진을 제거했습니다/);

            await act(async () => root.render(createElement(AvatarUploader, {
                ...baseProps, src: "/updated.png",
                onImageChange: (value) => changes.push(value),
            })));
            assert.equal(container.querySelector("img")?.getAttribute("src"),
                "/updated.png");
            assert.doesNotMatch(container.textContent, /사진을 제거했습니다/);
            assert.equal(changes.length, 2);
        } finally {
            await act(async () => root.unmount());
            container.remove();
            dom.window.Image = originalImage;
            dom.window.HTMLCanvasElement.prototype.getContext = originalContext;
            dom.window.HTMLCanvasElement.prototype.toBlob = originalToBlob;
            URL.createObjectURL = originalCreate;
            URL.revokeObjectURL = originalRevoke;
        }
    });

test.after(() => dom.window.close());
