import assert from "node:assert/strict";
import test from "node:test";
import { act, createElement, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { QueryBuilder } from "../dist/index.js";

const fields = [
    { id: "owner", label: "담당자", type: "text" },
    { id: "severity", label: "심각도", type: "number" },
    { id: "date", label: "발생일", type: "date" },
    { id: "status", label: "상태", type: "select", options: [
        { value: "failed", label: "실패" },
        { value: "done", label: "완료" },
    ] },
];
const empty = { kind: "group", id: "root", combinator: "all",
    children: [] };

function renderQuery(value = empty, extra = {}) {
    return renderToStaticMarkup(createElement(QueryBuilder, {
        label: "감사 검색 조건", fields, value,
        onValueChange: () => {}, onApply: () => {}, ...extra,
    }));
}

test("nested groups and native controls keep names and values", () => {
    const value = { ...empty, children: [
        { kind: "condition", id: "first", fieldId: "status",
            operator: "equals", value: "failed" },
        { kind: "group", id: "nested", combinator: "any", children: [
            { kind: "condition", id: "second", fieldId: "severity",
                operator: "greater-than", value: "3" },
        ] },
    ] };
    const markup = renderQuery(value);
    assert.match(markup, /<form[^>]*aria-label="감사 검색 조건"/);
    assert.match(markup, /<fieldset[^>]*>.*<legend[^>]*>조건 규칙/s);
    assert.match(markup, /<legend[^>]*>조건 2 그룹/);
    assert.match(markup, /aria-label="조건 1 필드"/);
    assert.match(markup, /aria-label="조건 2\.1 값"/);
    assert.match(markup, /value="3"/);
    assert.match(markup, /2개 조건/);
    assert.match(markup, /aria-label="조건 1 아래로 이동"/);
    assert.match(renderQuery(value, { variant: "plain" }),
        /data-variant="plain"/);
});

test("invalid structure and field configuration fail visibly", () => {
    assert.throws(() => renderQuery({ ...empty, children: [
        { kind: "condition", id: "root", fieldId: "owner",
            operator: "contains", value: "운영" },
    ] }), /unique, nonempty IDs/);
    assert.throws(() => renderQuery({ ...empty, children: [
        { kind: "group", id: "nested", combinator: "all",
            children: [] },
    ] }, { maxDepth: 1 }), /invalid group/);
    assert.throws(() => renderQuery(empty, { fields: [
        { id: "status", label: "상태", type: "select", options: [
            { value: "same", label: "첫째" },
            { value: "same", label: "둘째" },
        ] },
    ] }), /unique options/);
    assert.throws(() => renderQuery(empty, { variant: "unknown" }),
        /unsupported variant/);
});

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

async function click(container, label) {
    const button = container.querySelector(`[aria-label="${label}"]`) ??
        [...container.querySelectorAll("button")].find(
            (item) => item.textContent === label,
        );
    assert.ok(button, `missing button ${label}`);
    await act(async () => button.click());
}

async function select(container, label, selected) {
    const input = container.querySelector(`[aria-label="${label}"]`);
    assert.ok(input, `missing select ${label}`);
    await act(async () => {
        input.value = selected;
        input.dispatchEvent(new dom.window.Event("change", {
            bubbles: true,
        }));
    });
}

async function fill(container, label, text) {
    const input = container.querySelector(`[aria-label="${label}"]`);
    assert.ok(input, `missing input ${label}`);
    const setter = Object.getOwnPropertyDescriptor(
        dom.window.HTMLInputElement.prototype, "value",
    ).set;
    await act(async () => {
        setter.call(input, text);
        input.dispatchEvent(new dom.window.Event("input", {
            bubbles: true,
        }));
    });
}

test("editing, validation, grouping, moving, and apply stay controlled",
    async () => {
        const container = document.createElement("div");
        document.body.append(container);
        const root = createRoot(container);
        const applied = [];
        const changes = [];

        function Harness() {
            const [value, setValue] = useState(empty);
            return createElement(QueryBuilder, {
                label: "감사 검색 조건", fields, value,
                onValueChange: (next) => {
                    changes.push(next);
                    setValue(next);
                },
                onApply: (query) => applied.push(query),
            });
        }

        try {
            await act(async () => root.render(createElement(Harness)));
            await click(container, "조건 적용");
            assert.equal(applied.length, 1);
            assert.deepEqual(applied[0].children, []);

            await click(container, "조건에 조건 추가");
            await click(container, "조건 적용");
            assert.equal(applied.length, 1);
            assert.match(container.textContent, /필드를 선택하세요/);
            await select(container, "조건 1 필드", "owner");
            await fill(container, "조건 1 값", "운영");
            await click(container, "조건 적용");
            assert.equal(applied.length, 2);
            assert.deepEqual(applied[1].children.map((node) =>
                [node.fieldId, node.operator, node.value]),
            [["owner", "contains", "운영"]]);

            await click(container, "조건에 그룹 추가");
            await click(container, "조건 적용");
            assert.equal(applied.length, 2);
            await select(container, "조건 2.1 필드", "severity");
            await fill(container, "조건 2.1 값", "Infinity");
            await click(container, "조건 적용");
            assert.match(container.textContent, /유한한 숫자/);
            assert.equal(applied.length, 2);
            await fill(container, "조건 2.1 값", "4");
            await select(container, "조건 2 결합 방식", "any");
            await click(container, "조건 2 그룹 위로 이동");
            await click(container, "조건 적용");
            assert.equal(applied.length, 3);
            assert.equal(applied[2].children[0].kind, "group");
            assert.equal(applied[2].children[0].combinator, "any");
            assert.equal(applied[2].children[0].children[0].value, "4");
            assert.ok(changes.length >= 6);

            await click(container, "조건 1 그룹 제거");
            assert.equal(container.querySelectorAll("fieldset").length, 1);
        } finally {
            await act(async () => root.unmount());
            container.remove();
        }
    });

test("date, select, and valueless operators require repair before apply",
    async () => {
        const container = document.createElement("div");
        document.body.append(container);
        const root = createRoot(container);
        const applied = [];
        const initial = { ...empty, children: [
            { kind: "condition", id: "date-row", fieldId: "date",
                operator: "equals", value: "2026-02-30" },
            { kind: "condition", id: "status-row", fieldId: "status",
                operator: "equals", value: "unknown" },
            { kind: "condition", id: "owner-row", fieldId: "owner",
                operator: "is-empty", value: "stale" },
        ] };

        function Harness() {
            const [value, setValue] = useState(initial);
            return createElement(QueryBuilder, {
                label: "감사 검색 조건", fields, value,
                onValueChange: setValue,
                onApply: (query) => applied.push(query),
            });
        }

        try {
            await act(async () => root.render(createElement(Harness)));
            await click(container, "조건 적용");
            assert.equal(applied.length, 0);
            assert.match(container.textContent, /올바른 날짜/);
            assert.match(container.textContent, /선택지에 없는 값/);
            assert.match(container.textContent, /값이 없는 연산자/);
            await fill(container, "조건 1 값", "2026-02-28");
            await select(container, "조건 2 값", "failed");
            await click(container, "값 지우기");
            await click(container, "조건 적용");
            assert.equal(applied.length, 1);
            assert.deepEqual(applied[0].children.map((node) => node.value),
                ["2026-02-28", "failed", ""]);
        } finally {
            await act(async () => root.unmount());
            container.remove();
        }
    });

test.after(() => dom.window.close());
