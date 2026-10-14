import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { PrismDragOverlay } from "../dist/index.js";

test("drag overlay is absent until active and keeps the host file preview optional", () => {
    assert.equal(renderToStaticMarkup(createElement(PrismDragOverlay, { active: false, fileName: "draft.pdf" })), "");
    const fallback = renderToStaticMarkup(createElement(PrismDragOverlay, { active: true, fileName: "draft.pdf" }));
    assert.match(fallback, /role="status"/);
    assert.match(fallback, /draft\.pdf/);
    assert.match(fallback, />PDF<\/small>/);
    assert.match(fallback, /파일을 드래그하여 대화에 추가하세요/);
    const preview = renderToStaticMarkup(createElement(PrismDragOverlay, { active: true, fileName: "draft.png", previewUrl: "data:image/png;base64,AAAA" }));
    assert.match(preview, /alt="draft\.png"/);
    assert.match(preview, /src="data:image\/png;base64,AAAA"/);
    assert.doesNotMatch(preview, /prism-icon/);
});
