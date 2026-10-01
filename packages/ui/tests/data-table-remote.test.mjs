import assert from "node:assert/strict";
import test from "node:test";
import { act, createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";
import { DataTable } from "../dist/index.js";

const rows = [
    { id: "3", name: "권한 검토", status: "대기" },
    { id: "4", name: "배포 확인", status: "완료" },
];
const columns = [
    { id: "name", header: "요청", cell: (row) => row.name,
        sortable: true },
    { id: "status", header: "상태", cell: (row) => row.status },
];
const initialView = {
    query: "검색어", filterValue: "대기", sort: null,
    page: 2, pageSize: 2,
};
const filter = {
    label: "상태", getValue: (row) => row.status,
    options: [
        { value: "대기", label: "대기" },
        { value: "완료", label: "완료" },
    ],
};

function renderTable(remote, extra = {}) {
    return renderToStaticMarkup(createElement(DataTable, {
        caption: "요청", rows, columns,
        getRowId: (row) => row.id,
        filter, remote, ...extra,
    }));
}

test("remote rows retain server order and use server totals", () => {
    const markup = renderTable({
        view: initialView, totalItems: 7, searchable: true,
        onViewChange: () => {},
    });
    assert.match(markup, /권한 검토/);
    assert.match(markup, /배포 확인/);
    assert.match(markup, /3–4 \/ 7건/);
    assert.match(markup, /<label[^>]*>요청 검색<\/label>/);
    assert.match(markup, /<button[^>]*>요청<span aria-hidden="true">↕/);
});

test("remote loading and failure replace stale rows", () => {
    const base = { view: initialView, totalItems: 7,
        onViewChange: () => {} };
    const loading = renderTable({ ...base, status: "loading" });
    assert.match(loading, /aria-busy="true"/);
    assert.match(loading, /role="status">불러오는 중/);
    assert.doesNotMatch(loading, /권한 검토/);

    const error = renderTable({ ...base, status: "error",
        errorMessage: "연결 실패", onRetry: () => {} });
    assert.match(error, /role="alert">연결 실패/);
    assert.match(error, /다시 시도/);
    assert.doesNotMatch(error, /권한 검토/);
});

test("remote view rejects invalid pagination values", () => {
    assert.throws(() => renderTable({ view: { ...initialView,
        pageSize: 0 }, totalItems: 7, onViewChange: () => {} }),
    /valid page, pageSize, and totalItems/);
    assert.throws(() => renderTable({ view: initialView,
        totalItems: -1, onViewChange: () => {} }),
    /valid page, pageSize, and totalItems/);
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

test("remote sort, page, filter, and reset report controlled view", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);
    const changes = [];
    const retry = [];

    try {
        await act(async () => root.render(createElement(DataTable, {
            caption: "요청", rows, columns,
            getRowId: (row) => row.id,
            filter,
            remote: { view: initialView, totalItems: 7,
                onViewChange: (next) => changes.push(next),
                onRetry: () => retry.push(true) },
        })));

        const buttons = () => [...container.querySelectorAll("button")];
        const click = async (label) => {
            const button = buttons().find((item) => item.textContent.includes(label));
            assert.ok(button, `missing button ${label}`);
            await act(async () => button.click());
        };
        await click("요청");
        assert.deepEqual(changes.at(-1), {
            ...initialView, sort: { id: "name", direction: "ascending" },
            page: 1,
        });
        await click("다음");
        assert.equal(changes.at(-1).page, 3);
        const select = container.querySelector("select");
        await act(async () => {
            select.value = "완료";
            select.dispatchEvent(new dom.window.Event("change", {
                bubbles: true,
            }));
        });
        assert.equal(changes.at(-1).filterValue, "완료");
        assert.equal(changes.at(-1).page, 1);
        const pageSize = container.querySelector(
            'select[aria-label="페이지당 항목 수"]',
        );
        await act(async () => {
            pageSize.value = "10";
            pageSize.dispatchEvent(new dom.window.Event("change", {
                bubbles: true,
            }));
        });
        assert.equal(changes.at(-1).pageSize, 10);
        assert.equal(changes.at(-1).page, 1);
        await click("보기 초기화");
        assert.deepEqual(changes.at(-1), {
            query: "", filterValue: "", sort: null,
            page: 1, pageSize: 10,
        });

        await act(async () => root.render(createElement(DataTable, {
            caption: "요청", rows, columns,
            getRowId: (row) => row.id, filter,
            remote: { view: initialView, totalItems: 7,
                status: "error", onViewChange: () => {},
                onRetry: () => retry.push(true) },
        })));
        await click("다시 시도");
        assert.deepEqual(retry, [true]);
    } finally {
        await act(async () => root.unmount());
        container.remove();
    }
});

test("local selection remains available after changing pages", async () => {
    const container = document.createElement("div");
    document.body.append(container);
    const root = createRoot(container);

    try {
        await act(async () => root.render(createElement(DataTable, {
            caption: "요청", rows, columns,
            getRowId: (row) => row.id,
            getRowLabel: (row) => row.name,
            defaultPageSize: 1, pageSizeOptions: [1], selectable: true,
            renderActions: (selected) => createElement("span", {
                "data-selected": selected.map((row) => row.id).join(","),
            }),
        })));
        await act(async () => {
            container.querySelector(
                '[aria-label="권한 검토 선택"]',
            ).click();
        });
        assert.ok(container.querySelector('[data-selected="3"]'));
        await act(async () => {
            [...container.querySelectorAll("button")].find(
                (button) => button.textContent === "다음",
            ).click();
        });
        assert.ok(container.querySelector('[data-selected="3"]'));
        assert.match(container.textContent, /배포 확인/);
    } finally {
        await act(async () => root.unmount());
        container.remove();
    }
});

test.after(() => dom.window.close());
