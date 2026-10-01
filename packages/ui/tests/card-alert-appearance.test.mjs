import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
    Alert, AlertDescription, AlertTitle,
    Card, CardContent, CardHeader, CardTitle,
} from "../dist/index.js";

function renderCard(props = {}) {
    return renderToStaticMarkup(createElement(Card, props,
        createElement(CardHeader, null,
            createElement(CardTitle, null, "Review")),
        createElement(CardContent, null, "Three items"),
    ));
}

function renderAlert(props = {}) {
    return renderToStaticMarkup(createElement(Alert, props,
        createElement(AlertTitle, null, "Saved"),
        createElement(AlertDescription, null, "Changes are available"),
    ));
}

test("card keeps the default surface and varies its spacing", () => {
    const standard = renderCard();
    const compact = renderCard({ variant: "subtle", size: "compact" });
    const elevated = renderCard({ variant: "elevated" });

    assert.match(standard, /data-variant="default" data-size="default"/);
    assert.match(standard, /border-border bg-surface/);
    assert.match(compact, /data-variant="subtle" data-size="compact"/);
    assert.match(compact, /bg-surface-subtle/);
    assert.match(compact, /--card-spacing:var\(--space-3\)/);
    assert.match(elevated, /shadow-\[var\(--shadow-float\)\]/);
    assert.throws(() => renderCard({ variant: "unknown" }), RangeError);
    assert.throws(() => renderCard({ size: "unknown" }), RangeError);
});

test("alert appearance does not change announcement priority", () => {
    const outlined = renderAlert({ variant: "success" });
    const soft = renderAlert({ variant: "success", appearance: "soft" });
    const plainError = renderAlert({
        variant: "destructive", appearance: "plain",
    });

    assert.match(outlined, /role="status"/);
    assert.match(outlined, /border-success/);
    assert.match(soft, /role="status"/);
    assert.match(soft, /bg-success\/10/);
    assert.match(soft, /data-appearance="soft"/);
    assert.match(plainError, /role="alert"/);
    assert.match(plainError, /bg-transparent/);
    assert.match(plainError, /Saved/);
});
