import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Combobox } from "../dist/index.js";

const studio = { value: "studio", label: "Design Studio" };
const operations = { value: "ops", label: "Operations" };

function renderCombobox(props = {}) {
    return renderToStaticMarkup(createElement(Combobox, {
        options: [studio, operations], name: "workspace", ...props,
    }));
}

test("retains a selected value when refreshed results omit it", () => {
    const markup = renderCombobox({
        options: [operations], value: "studio", selectedOption: studio,
    });
    assert.match(markup, /value="Design Studio"/);
    assert.match(markup, /name="workspace" value="studio"/);
});

test("still rejects an unknown or mismatched selected value", () => {
    assert.throws(() => renderCombobox({
        options: [operations], value: "studio",
    }), /value must match an option/);
    assert.throws(() => renderCombobox({
        options: [operations], value: "studio", selectedOption: operations,
    }), /value must match an option/);
    assert.throws(() => renderCombobox({
        options: [], value: "", selectedOption: { value: "", label: "Empty" },
    }), /value must match an option/);
});

test("loading and errors replace stale options without showing empty state", () => {
    const loading = renderCombobox({ loading: true });
    assert.match(loading, /aria-busy="true"/);
    assert.match(loading, /항목을 불러오는 중입니다/);
    assert.doesNotMatch(loading, /role="option"/);
    assert.doesNotMatch(loading, /일치하는 항목이 없습니다/);

    const error = renderCombobox({ errorMessage: "검색 실패" });
    assert.match(error, /role="alert"[^>]*>검색 실패/);
    assert.doesNotMatch(error, /role="option"/);
    assert.doesNotMatch(error, /일치하는 항목이 없습니다/);
});
