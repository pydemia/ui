import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Kanban, moveKanbanCard } from "../dist/index.js";

const columns = [
    { id: "queued", title: "대기", cards: [
        { id: "a", title: "첫 작업" },
        { id: "b", title: "둘째 작업" },
        { id: "c", title: "셋째 작업" },
    ] },
    { id: "working", title: "진행 중", cards: [] },
];

test("moves cards within and across columns without mutating input", () => {
    const original = JSON.stringify(columns);
    const up = moveKanbanCard(columns, "c", "queued", "a");
    assert.deepEqual(up.columns[0].cards.map((card) => card.id),
        ["c", "a", "b"]);
    assert.deepEqual(up.move, {
        cardId: "c", fromColumnId: "queued", toColumnId: "queued",
        fromIndex: 2, toIndex: 0,
    });

    const across = moveKanbanCard(up.columns, "a", "working");
    assert.deepEqual(across.columns.map((column) =>
        column.cards.map((card) => card.id)), [["c", "b"], ["a"]]);
    assert.deepEqual(across.move, {
        cardId: "a", fromColumnId: "queued", toColumnId: "working",
        fromIndex: 1, toIndex: 0,
    });
    assert.equal(JSON.stringify(columns), original);
});

test("same position is a no-op and invalid targets fail distinctly", () => {
    assert.equal(moveKanbanCard(columns, "b", "queued", "c"), null);
    assert.equal(moveKanbanCard(columns, "b", "queued", "b"), null);
    assert.throws(() => moveKanbanCard(columns, "missing", "queued"),
        /card was not found/);
    assert.throws(() => moveKanbanCard(columns, "a", "missing"),
        /column was not found/);
    assert.throws(() => moveKanbanCard(columns, "a", "working", "c"),
        /target card was not found/);
});

test("board exposes named columns, actions and empty destination", () => {
    const markup = renderToStaticMarkup(createElement(Kanban, {
        label: "요청 보드", columns, onColumnsChange() {},
    }));
    assert.match(markup, /role="region" aria-label="요청 보드"/);
    assert.match(markup, /<h3[^>]*>.*대기.*3.*<\/h3>/);
    assert.match(markup, /aria-label="첫 작업 오른쪽 열로 이동"/);
    assert.match(markup, /aria-label="첫 작업 아래로 이동"/);
    assert.match(markup, /카드가 없습니다/);
});

test("duplicate and empty identities are rejected", () => {
    assert.throws(() => renderToStaticMarkup(createElement(Kanban, {
        label: " ", columns, onColumnsChange() {},
    })), /needs a board label/);
    assert.throws(() => moveKanbanCard([], "a", "queued"),
        /at least one column/);
    assert.throws(() => moveKanbanCard([...columns, columns[0]],
        "a", "working"), /unique IDs and titles/);
    assert.throws(() => moveKanbanCard([
        columns[0], { id: "working", title: "진행 중", cards: [
            { id: "a", title: "중복" },
        ] },
    ], "a", "working"), /cards need unique IDs/);
});
