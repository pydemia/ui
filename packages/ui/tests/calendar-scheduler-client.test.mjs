import assert from "node:assert/strict";
import test from "node:test";
import { act, createElement } from "react";
import { JSDOM } from "jsdom";
import { CalendarScheduler } from "../dist/index.js";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/",
});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
Object.defineProperty(globalThis, "navigator", {
    configurable: true,
    value: dom.window.navigator,
});
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { createRoot } = await import("react-dom/client");

const events = [
    { id: "review", date: "2026-10-07", title: "권한 검토" },
    { id: "report", date: "2026-10-12", title: "월간 보고" },
];

function click(element) {
    assert.ok(element, "expected an interactive element");
    return act(async () => {
        element.dispatchEvent(new dom.window.MouseEvent("click", {
            bubbles: true,
        }));
    });
}

test("date, month, event, and create actions run in the client", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    const selectedDates = [];
    const selectedEvents = [];
    const createdDates = [];

    try {
        await act(async () => root.render(createElement(CalendarScheduler, {
            label: "팀 일정",
            initialDate: "2026-10-07",
            events,
            onSelectedDateChange: (date) => selectedDates.push(date),
            onEventSelect: (event) => selectedEvents.push(event.id),
            onCreateEvent: (date) => createdDates.push(date),
        })));

        await click(container.querySelector(
            '[data-day="2026-10-12"] button',
        ));
        assert.deepEqual(selectedDates, ["2026-10-12"]);
        assert.ok(container.querySelector(
            '[role="region"][aria-label="2026-10-12 일정"]',
        ));

        const eventButton = [...container.querySelectorAll("button")].find(
            (button) => button.textContent.includes("월간 보고"),
        );
        await click(eventButton);
        assert.deepEqual(selectedEvents, ["report"]);

        const createButton = [...container.querySelectorAll("button")].find(
            (button) => button.textContent === "일정 추가",
        );
        await click(createButton);
        assert.deepEqual(createdDates, ["2026-10-12"]);

        await click(container.querySelector(
            'button[aria-label="Go to the Next Month"]',
        ));
        assert.match(container.textContent, /2026-11 · 0건/);
        await click(container.querySelector(
            'button[aria-label="Go to the Previous Month"]',
        ));
        assert.match(container.textContent, /2026-10 · 2건/);
    } finally {
        await act(async () => root.unmount());
        container.remove();
    }
});

test("controlled selection waits for the caller to update its value", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    const selectedDates = [];
    const props = {
        label: "팀 일정",
        initialDate: "2026-10-07",
        events,
        onSelectedDateChange: (date) => selectedDates.push(date),
    };

    try {
        await act(async () => root.render(createElement(CalendarScheduler, {
            ...props, selectedDate: "2026-10-07",
        })));
        await click(container.querySelector(
            '[data-day="2026-10-12"] button',
        ));
        assert.deepEqual(selectedDates, ["2026-10-12"]);
        assert.ok(container.querySelector(
            '[role="region"][aria-label="2026-10-07 일정"]',
        ));

        await act(async () => root.render(createElement(CalendarScheduler, {
            ...props, selectedDate: "2026-10-12",
        })));
        assert.ok(container.querySelector(
            '[role="region"][aria-label="2026-10-12 일정"]',
        ));
    } finally {
        await act(async () => root.unmount());
        container.remove();
    }
});

test.after(() => dom.window.close());
