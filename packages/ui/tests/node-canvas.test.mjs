import assert from "node:assert/strict";
import test from "node:test";
import { act, createElement, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
    url: "http://localhost/",
});
globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
const { NodeCanvas } = await import("../dist/index.js");
const { createRoot } = await import("react-dom/client");

const initialNodes = [
    { id: "request", title: "요청", x: 20, y: 30 },
    { id: "review", title: "검토", x: 300, y: 160 },
];
const initialEdges = [
    { id: "route", from: "request", to: "review", label: "승인" },
];

function markup(props = {}) {
    return renderToStaticMarkup(createElement(NodeCanvas, {
        label: "요청 흐름", nodes: initialNodes, edges: initialEdges,
        width: 700, height: 380, ...props,
    }));
}

test("canvas exposes graph, node controls and connection text", () => {
    const view = new JSDOM(markup()).window.document;
    assert.equal(view.querySelector("section").getAttribute("aria-label"),
        "요청 흐름");
    assert.equal(view.querySelectorAll("[data-node-id]").length, 2);
    assert.equal(view.querySelectorAll("svg path[stroke]").length, 1);
    assert.match(view.body.textContent, /요청 → 검토 · 승인/);
    assert.match(markup({ onConnect() {} }), /이미 연결됨/);
    assert.equal(view.querySelectorAll("input[type=number]").length, 0);
    assert.match(markup({ variant: "plain" }), /요청 흐름/);
    assert.match(markup({ nodes: [], edges: [] }), /노드가 없습니다/);
});

test("rejects ambiguous graph identifiers and out-of-bounds positions", () => {
    assert.throws(() => markup({ label: " " }), /requires a label/);
    assert.throws(() => markup({ width: 200 }), /dimensions/);
    assert.throws(() => markup({ nodes: [
        initialNodes[0], { ...initialNodes[0] },
    ] }), /unique IDs/);
    assert.throws(() => markup({ nodes: [
        { ...initialNodes[0], x: -1 }, initialNodes[1],
    ] }), /inside the canvas/);
    assert.throws(() => markup({ nodes: [
        { ...initialNodes[0], description: {} }, initialNodes[1],
    ] }), /inside the canvas/);
    assert.throws(() => markup({ edges: [
        { id: "orphan", from: "request", to: "missing" },
    ] }), /distinct nodes/);
    assert.throws(() => markup({ edges: [
        { id: "loop", from: "request", to: "request" },
    ] }), /distinct nodes/);
});

test("keyboard, coordinate and connection actions update caller-owned data",
    async () => {
        const container = document.createElement("div");
        document.body.append(container);
        const root = createRoot(container);
        const moves = [];
        const connects = [];
        const disconnects = [];

        function Harness() {
            const [nodes, setNodes] = useState(initialNodes);
            const [edges, setEdges] = useState([]);
            return createElement(NodeCanvas, {
                label: "요청 흐름", nodes, edges,
                width: 700, height: 380,
                onNodesChange: (next, move) => {
                    moves.push(move);
                    setNodes(next);
                },
                onConnect: (from, to) => {
                    connects.push([from, to]);
                    setEdges((current) => [...current,
                        { id: String(current.length + 1), from, to },
                    ]);
                },
                onDisconnect: (id) => {
                    disconnects.push(id);
                    setEdges((current) =>
                        current.filter((edge) => edge.id !== id));
                },
            });
        }

        async function fill(input, value) {
            const setter = Object.getOwnPropertyDescriptor(
                dom.window.HTMLInputElement.prototype, "value",
            ).set;
            await act(async () => {
                setter.call(input, value);
                input.dispatchEvent(new dom.window.Event("input", {
                    bubbles: true,
                }));
            });
        }

        try {
            await act(async () => root.render(createElement(Harness)));
            const request = container.querySelector(
                '[aria-label="요청 노드 선택"]',
            );
            await act(async () => request.dispatchEvent(
                new dom.window.KeyboardEvent("keydown", {
                    key: "ArrowRight", bubbles: true, cancelable: true,
                }),
            ));
            assert.deepEqual(moves[0], {
                nodeId: "request", x: 30, y: 30, source: "keyboard",
            });
            assert.equal(container.querySelector(
                '[data-node-id="request"]',
            ).style.left, "30px");

            const inputs = container.querySelectorAll(
                'input[type="number"]',
            );
            await fill(inputs[0], "500");
            await fill(inputs[1], "120");
            const apply = [...container.querySelectorAll("button")]
                .find((button) => button.textContent === "좌표 적용");
            await act(async () => apply.click());
            assert.deepEqual(moves[1], {
                nodeId: "request", x: 500, y: 120,
                source: "coordinates",
            });

            const connect = [...container.querySelectorAll("button")]
                .find((button) => button.textContent === "연결 추가");
            await act(async () => connect.click());
            assert.deepEqual(connects, [["request", "review"]]);
            assert.match(container.textContent, /요청 → 검토/);
            assert.equal([...container.querySelectorAll("button")]
                .find((button) => button.textContent === "이미 연결됨")
                .disabled, true);

            const disconnect = [...container.querySelectorAll("button")]
                .find((button) => button.textContent.includes("연결 제거"));
            await act(async () => disconnect.click());
            assert.deepEqual(disconnects, ["1"]);
            assert.doesNotMatch(container.textContent, /요청 → 검토/);
        } finally {
            await act(async () => root.unmount());
            container.remove();
        }
    });

test.after(() => dom.window.close());
