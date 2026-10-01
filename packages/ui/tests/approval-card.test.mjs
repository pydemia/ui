import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ApprovalCard } from "../dist/index.js";

const baseProps = {
    requestId: "export-37",
    title: "Export report",
    description: "Send the report to storage.",
    status: "requested",
    onDecision: () => {},
};

function render(props) {
    return renderToStaticMarkup(createElement(ApprovalCard, props));
}

test("approval request has a name, description, status and two actions", () => {
    const markup = render(baseProps);
    assert.match(markup, /<section[^>]*aria-labelledby="[^"]+"/);
    assert.match(markup, /aria-describedby="[^"]+"/);
    assert.match(markup, /data-status="requested"/);
    assert.match(markup, /role="status"/);
    assert.match(markup, />승인</);
    assert.match(markup, />거절</);
    assert.equal((markup.match(/type="button"/g) ?? []).length, 2);
});

test("resolved and expired requests have no decision actions", () => {
    for (const [status, label] of [
        ["approved", "승인됨"],
        ["rejected", "거절됨"],
        ["expired", "요청 만료"],
    ]) {
        const markup = render({ ...baseProps, status });
        assert.match(markup, new RegExp(label));
        assert.doesNotMatch(markup, /<button/);
    }
});

test("approval request rejects missing identity and unsupported status", () => {
    for (const props of [
        { ...baseProps, requestId: " " },
        { ...baseProps, title: " " },
        { ...baseProps, description: "" },
        { ...baseProps, status: "running" },
        { ...baseProps, status: "toString" },
    ]) {
        assert.throws(() => render(props), /ApprovalCard/);
    }
});
