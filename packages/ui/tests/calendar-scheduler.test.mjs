import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CalendarScheduler } from "../dist/index.js";

const events = [
    { id: "late", date: "2026-10-07", title: "오후 검토",
        startTime: "15:00", endTime: "15:30" },
    { id: "early", date: "2026-10-07", title: "아침 점검",
        startTime: "09:00", description: "접근 권한 확인" },
    { id: "other", date: "2026-10-12", title: "월간 계획" },
];

function renderScheduler(props = {}) {
    return renderToStaticMarkup(createElement(CalendarScheduler, {
        label: "팀 일정", initialDate: "2026-10-07",
        timeZone: "Asia/Seoul", events, ...props,
    }));
}

test("calendar day counts and selected agenda share one date", () => {
    const markup = renderScheduler();
    assert.match(markup, /aria-label="팀 일정"/);
    assert.match(markup, /aria-label="2026-10-07 일정"/);
    assert.match(markup, /일정 2건/);
    assert.match(markup, /2026-10 · 3건/);
    assert.ok(markup.indexOf("아침 점검") < markup.indexOf("오후 검토"));
    assert.match(markup, /09:00/);
    assert.match(markup, /15:00–15:30/);
    assert.match(markup, /시간대: Asia\/Seoul/);
});

test("controlled day and empty agenda are explicit", () => {
    const other = renderScheduler({ selectedDate: "2026-10-12" });
    assert.match(other, /aria-label="2026-10-12 일정"/);
    assert.match(other, /월간 계획/);
    assert.doesNotMatch(other, /아침 점검/);

    const empty = renderScheduler({ selectedDate: "2026-10-11" });
    assert.match(empty, /이 날짜에는 일정이 없습니다/);

    const nextMonth = renderScheduler({ selectedDate: "2026-11-01" });
    assert.match(nextMonth, /2026-11 · 0건/);
    assert.match(nextMonth, /aria-label="2026-11-01 일정"/);
});

test("invalid schedule identity, date, time, and zone fail clearly", () => {
    assert.throws(() => renderScheduler({ events: [events[0], events[0]] }),
        /unique IDs/);
    assert.throws(() => renderScheduler({ events: [
        { id: "bad", date: "2026-02-30", title: "잘못된 날짜" },
    ] }), /Invalid calendar date/);
    assert.throws(() => renderScheduler({ events: [
        { id: "bad", date: "2026-10-07", title: "잘못된 시간",
            startTime: "25:00" },
    ] }), /invalid time/);
    assert.throws(() => renderScheduler({ events: [
        { id: "bad", date: "2026-10-07", title: "역전된 시간",
            startTime: "15:00", endTime: "14:00" },
    ] }), /invalid time/);
    assert.throws(() => renderScheduler({ timeZone: undefined }),
        /need a timeZone/);
    assert.throws(() => renderScheduler({ timeZone: "Unknown/Place" }),
        RangeError);
});
