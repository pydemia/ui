import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { NotificationCenter } from "../dist/index.js";

const items = [
    { id: "review", title: "검토 요청", message: "권한 변경",
        timestamp: "오늘", dateTime: "2026-10-02T09:00:00+09:00",
        read: false },
    { id: "saved", title: "저장 완료", timestamp: "어제",
        read: true, href: "/saved" },
];
const render = (props) => renderToStaticMarkup(createElement(
    NotificationCenter, { label: "알림", notifications: items,
        onReadChange: () => {}, ...props },
));

test("notification center exposes count, status, controls and links", () => {
    const markup = render({ onMarkAllRead: () => {} });
    assert.match(markup, /<section[^>]*aria-labelledby="[^"]+"/);
    assert.match(markup, /읽지 않음 1건/);
    assert.match(markup, /role="group" aria-label="알림 필터"/);
    assert.match(markup, /aria-pressed="true"/);
    assert.match(markup, /새 알림/);
    assert.match(markup, /<time dateTime="2026-10-02T09:00:00\+09:00"/);
    assert.match(markup, /href="\/saved"/);
    assert.match(markup, /검토 요청 읽음으로 표시/);
    assert.match(markup, /저장 완료 읽지 않음으로 표시/);
    assert.match(markup, /모두 읽음으로 표시/);
});

test("empty and read-only lists keep their distinct messages", () => {
    assert.match(render({ notifications: [] }), /알림이 없습니다/);
    const markup = render({ notifications: items.map((item) => ({
        ...item, read: true,
    })), onMarkAllRead: () => {} });
    assert.match(markup, /읽지 않음 0건/);
    assert.doesNotMatch(markup, /모두 읽음으로 표시/);
});

test("notification center rejects ambiguous and incomplete items", () => {
    assert.throws(() => render({ notifications: [null] }),
        /unique IDs/);
    assert.throws(() => render({ notifications: [...items, items[0]] }),
        /unique IDs/);
    assert.throws(() => render({ notifications: [
        { ...items[0], read: undefined },
    ] }), /read state/);
    assert.throws(() => render({ label: " " }), /requires a label/);
    assert.throws(() => render({ appearance: "floating" }), RangeError);
});
