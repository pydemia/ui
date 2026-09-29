import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Alert, AlertTitle, Toast } from "../dist/index.js";

function renderAlert(variant) {
    return renderToStaticMarkup(createElement(Alert, { variant },
        createElement(AlertTitle, null, "상태 안내")));
}

test("alert keeps advisory and urgent announcements distinct", () => {
    assert.match(renderAlert(undefined), /role="status"/);
    assert.match(renderAlert("info"), /role="status"/);
    assert.match(renderAlert("success"), /text-success/);
    assert.match(renderAlert("warning"), /text-warning/);
    const urgent = renderAlert("destructive");
    assert.match(urgent, /role="alert"/);
    assert.match(urgent, /상태 안내/);
});

test("toast maps each status to its semantic border color", () => {
    for (const [variant, color, role] of [
        ["info", "accent", "status"],
        ["success", "success", "status"],
        ["warning", "warning", "status"],
        ["error", "danger", "alert"],
    ]) {
        const markup = renderToStaticMarkup(createElement(Toast, {
            open: true,
            onOpenChange: () => {},
            title: "상태 안내",
            variant,
        }));
        assert.match(markup, new RegExp(`border-l-${color}`));
        assert.match(markup, new RegExp(`role="${role}"`));
        assert.match(markup, /상태 안내/);
    }
});
