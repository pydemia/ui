import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Gantt, changeGanttTask } from "../dist/index.js";

const tasks = [
    { id: "scope", title: "요구 정리", startDate: "2026-10-02",
        endDate: "2026-10-04", progress: 100 },
    { id: "design", title: "화면 설계", startDate: "2026-10-07",
        endDate: "2026-10-09", progress: 75, dependsOn: ["scope"] },
    { id: "build", title: "구현", startDate: "2026-10-12",
        endDate: "2026-10-16", dependsOn: ["design"] },
];

function change(taskId, operation, items = tasks) {
    return changeGanttTask(items, "2026-10-01", "2026-10-25",
        taskId, operation);
}

function renderGantt(props = {}) {
    return renderToStaticMarkup(createElement(Gantt, {
        label: "출시 일정", rangeStart: "2026-10-01",
        rangeEnd: "2026-10-25", tasks, ...props,
    }));
}

test("moves and resizes only the selected task without mutating input", () => {
    const original = JSON.stringify(tasks);
    const earlier = change("design", "move-earlier");
    assert.deepEqual(earlier.change, {
        taskId: "design", operation: "move-earlier",
        startDate: "2026-10-06", endDate: "2026-10-08",
    });
    assert.deepEqual(earlier.tasks.map((task) => task.startDate),
        ["2026-10-02", "2026-10-06", "2026-10-12"]);
    assert.equal(change("design", "move-later").change.endDate,
        "2026-10-10");
    assert.equal(change("design", "extend").change.endDate,
        "2026-10-10");
    assert.equal(change("design", "shrink").change.endDate,
        "2026-10-08");
    assert.equal(JSON.stringify(tasks), original);
});

test("range, predecessor, successor and minimum duration disable changes", () => {
    const adjacent = [
        { id: "first", title: "첫 작업", startDate: "2026-10-01",
            endDate: "2026-10-04" },
        { id: "next", title: "다음 작업", startDate: "2026-10-05",
            endDate: "2026-10-09", dependsOn: ["first"] },
        { id: "last", title: "마지막 작업", startDate: "2026-10-10",
            endDate: "2026-10-10", dependsOn: ["next"] },
    ];
    assert.equal(change("first", "move-earlier", adjacent), null);
    assert.equal(change("next", "move-earlier", adjacent), null);
    assert.equal(change("next", "extend", adjacent), null);
    assert.equal(change("last", "shrink", adjacent), null);
    assert.throws(() => change("missing", "shrink"),
        /task was not found/);
});

test("chart exposes dates, progress, dependencies and native actions", () => {
    const markup = renderGantt({ onTasksChange() {} });
    assert.match(markup, /role="region" aria-label="출시 일정"/);
    assert.match(markup, /aria-label="출시 일정 작업"/);
    assert.match(markup, /화면 설계/);
    assert.match(markup, /선행 작업:.*요구 정리/);
    assert.match(markup, /2026-10-07/);
    assert.match(markup, /75%/);
    assert.match(markup, /1일 앞당기기/);
    assert.match(markup, /role="status" aria-live="polite"/);
    assert.match(renderGantt({ scale: "week" }), /7일 단위/);
    assert.doesNotMatch(renderGantt(), /1일 앞당기기/);
});

test("empty schedule is distinct from invalid schedule", () => {
    const markup = renderGantt({ tasks: [] });
    assert.match(markup, /표시할 작업이 없습니다/);
    assert.doesNotMatch(markup, /<ol/);
    assert.throws(() => renderGantt({ label: " " }),
        /needs a chart label/);
    assert.throws(() => renderGantt({ scale: "month" }),
        /scale must be day or week/);
});

test("rejects impossible dates, dependencies and progress", () => {
    assert.throws(() => renderGantt({ rangeEnd: "2026-02-30" }),
        /real calendar date/);
    assert.throws(() => renderGantt({ rangeStart: "2026-10-26" }),
        /range must span/);
    assert.throws(() => renderGantt({
        tasks: [...tasks, { ...tasks[0] }],
    }), /unique IDs and titles/);
    assert.throws(() => renderGantt({
        tasks: [{ ...tasks[0], progress: Infinity }, ...tasks.slice(1)],
    }), /progress must be/);
    assert.throws(() => renderGantt({
        tasks: [{ ...tasks[0], endDate: "2026-10-07" },
            ...tasks.slice(1)],
    }), /dependencies must finish/);
    assert.throws(() => renderGantt({
        tasks: [{ ...tasks[0], dependsOn: ["missing"] },
            ...tasks.slice(1)],
    }), /distinct existing task IDs/);
});
