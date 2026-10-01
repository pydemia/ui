import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ImageCropper } from "../dist/index.js";

function renderCropper(props = {}) {
    return renderToStaticMarkup(createElement(ImageCropper, {
        file: null,
        label: "프로필 사진 자르기",
        alt: "프로필 사진 미리보기",
        onCrop: () => {},
        ...props,
    }));
}

test("empty cropper names controls and prevents export", () => {
    const markup = renderCropper();
    assert.match(markup, /<section[^>]*aria-label="프로필 사진 자르기"/);
    assert.match(markup, /이미지를 선택하세요/);
    assert.equal((markup.match(/type="range"/g) ?? []).length, 3);
    assert.equal((markup.match(/<input[^>]*disabled=""/g) ?? []).length, 3);
    assert.match(markup, /PNG 512 × 512px/);
    assert.match(markup, /<button[^>]*disabled=""[^>]*>PNG 자르기/);
});

test("unsupported file is distinguished from a missing file", () => {
    const file = new File(["text"], "notes.txt", { type: "text/plain" });
    const markup = renderCropper({ file });
    assert.match(markup, /role="alert"/);
    assert.match(markup, /PNG, JPEG, WebP 이미지만/);
    assert.match(markup, /원본: notes.txt/);
    const unknownMime = new File(["image"], "photo.PNG");
    const pending = renderCropper({ file: unknownMime });
    assert.match(pending, /이미지를 불러오는 중입니다/);
});

test("invalid output geometry and missing labels fail clearly", () => {
    assert.throws(() => renderCropper({ label: " " }), /requires a label/);
    assert.throws(() => renderCropper({ label: null }), /requires a label/);
    assert.throws(() => renderCropper({ alt: " " }), /image description/);
    assert.throws(() => renderCropper({ alt: null }), /image description/);
    assert.throws(() => renderCropper({ aspectRatio: 0 }),
        /aspectRatio must be positive/);
    assert.throws(() => renderCropper({ aspectRatio: 0.1,
        outputWidth: 512 }), /dimensions must be 1–4096px/);
    assert.throws(() => renderCropper({ outputWidth: 0 }),
        /dimensions must be 1–4096px/);
    assert.throws(() => renderCropper({ onCrop: null }), /requires onCrop/);
});
