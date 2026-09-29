import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { DateTimePicker } from "../dist/index.js";

function renderPicker(props = {}) {
    return renderToStaticMarkup(createElement(DateTimePicker, {
        label: "시작 시각",
        name: "startsAt",
        timeZone: "Asia/Seoul",
        value: { date: null, time: null },
        onValueChange: () => {},
        hourCycle: "h23",
        ...props,
    }));
}

test("complete selection submits local time and its time zone together", () => {
    const markup = renderPicker({
        value: { date: "2026-09-29", time: "13:35" },
    });
    assert.match(markup,
        /name="startsAt" value="2026-09-29T13:35"/);
    assert.match(markup,
        /name="startsAtTimeZone" value="Asia\/Seoul"/);
    assert.match(markup, /시간대: Asia\/Seoul/);
    assert.match(markup, /aria-label="시작 시각 날짜"/);
    assert.match(markup, /<legend[^>]*>시작 시각 시간/);
});

test("partial selections do not submit a false complete time", () => {
    for (const value of [
        { date: null, time: null },
        { date: "2026-09-29", time: null },
        { date: null, time: "13:35" },
    ]) {
        const markup = renderPicker({ value });
        assert.match(markup, /name="startsAt" value=""/);
        assert.match(markup, /name="startsAtTimeZone" value=""/);
    }
});

test("invalid zone, calendar date, form names and time fail clearly", () => {
    assert.throws(() => renderPicker({ value: { date: null } }),
        /requires date and time values/);
    assert.throws(() => renderPicker({ timeZone: "No/Such_Zone" }),
        /timeZone is not supported/);
    assert.throws(() => renderPicker({
        value: { date: "2026-02-30", time: null },
    }), /Invalid calendar date/);
    assert.throws(() => renderPicker({
        minDate: "2026-10-01", maxDate: "2026-09-01",
    }), /minDate exceeds maxDate/);
    assert.throws(() => renderPicker({
        value: { date: "2026-09-29", time: null },
        maxDate: "2026-09-28",
    }), /outside its allowed range/);
    assert.throws(() => renderPicker({
        value: { date: null, time: "25:00" },
    }), /HH:mm/);
    assert.throws(() => renderPicker({ timeZoneName: "startsAt" }),
        /distinct form names/);
});
