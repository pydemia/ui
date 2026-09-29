import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AvatarGroup } from "../dist/index.js";

const members = [
    { id: "hana", name: "김하나", fallback: "김" },
    { id: "jimin", name: "박지민", fallback: "박" },
    { id: "soyeon", name: "이소연", fallback: "이" },
    { id: "eunji", name: "최은지", fallback: "최" },
];

function renderGroup(props = {}) {
    return renderToStaticMarkup(createElement(AvatarGroup, {
        label: "검토 팀",
        members,
        ...props,
    }));
}

test("group exposes visible members and hidden names in one list", () => {
    const markup = renderGroup({ maxVisible: 2 });
    assert.match(markup, /<ul\b[^>]*role="list"[^>]*aria-label="검토 팀"/);
    assert.equal((markup.match(/<li\b/g) ?? []).length, 3);
    assert.match(markup, /<li\b[^>]*aria-label="김하나"/);
    assert.match(markup, /<li\b[^>]*aria-label="박지민"/);
    assert.match(markup, /aria-label="2 more people: 이소연, 최은지"/);
    assert.match(markup, /aria-hidden="true">\+2<\/span>/);
    assert.doesNotMatch(markup, /aria-label="이소연"/);
});

test("empty group has a visible empty state", () => {
    const markup = renderGroup({ members: [], emptyText: "팀원이 없습니다." });
    assert.match(markup, /aria-label="검토 팀"/);
    assert.match(markup, /<li\b[^>]*>팀원이 없습니다\.<\/li>/);
});

test("group rejects ambiguous members and unsupported limits", () => {
    assert.throws(() => renderGroup({ label: " " }), /label/);
    assert.throws(() => renderGroup({ maxVisible: 0 }), RangeError);
    assert.throws(() => renderGroup({ maxVisible: 1.5 }), RangeError);
    assert.throws(() => renderGroup({ size: "huge" }), RangeError);
    assert.throws(() => renderGroup({
        members: [members[0], { ...members[1], id: "hana" }],
    }), /unique/);
    assert.throws(() => renderGroup({
        members: [{ ...members[0], fallback: "" }],
    }), /fallback/);
    assert.throws(() => renderGroup({
        maxVisible: 2, overflowLabel: "",
    }), /overflow/);
});
