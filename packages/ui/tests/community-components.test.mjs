import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
    Board, FavoriteToggle, ResponseFeedback, Thread,
} from "../dist/index.js";

const noop = () => {};
const render = (Component, props) =>
    renderToStaticMarkup(createElement(Component, props));

test("response feedback exposes two exclusive pressed choices", () => {
    const markup = render(ResponseFeedback, {
        label: "Answer feedback", value: "up", onValueChange: noop,
        counts: { up: 3, down: 1 },
    });
    assert.match(markup, /role="group" aria-label="Answer feedback"/);
    assert.equal((markup.match(/aria-pressed="true"/g) ?? []).length, 1);
    assert.equal((markup.match(/aria-pressed="false"/g) ?? []).length, 1);
    assert.match(markup, /3명 선택/);
    assert.match(markup, /aria-describedby="[^"]+-up"/);
    assert.throws(() => render(ResponseFeedback, {
        label: "Vote", value: "maybe", onValueChange: noop,
    }), RangeError);
    assert.throws(() => render(ResponseFeedback, {
        label: "Vote", value: null, onValueChange: noop,
        counts: { up: -1, down: 0 },
    }), RangeError);
});

test("favorite count is described and pressed state is accessible", () => {
    const markup = render(FavoriteToggle, {
        label: "Save article", pressed: true, count: 7,
    });
    assert.match(markup, /aria-label="Save article"/);
    assert.match(markup, /aria-pressed="true"/);
    assert.match(markup, /aria-describedby="[^"]+"/);
    assert.match(markup, /7명 선택/);
    assert.throws(() => render(FavoriteToggle, { count: -1 }), RangeError);
});

test("board identifies the selected post and rejects ambiguous IDs", () => {
    const post = { id: "a", title: "Release note", author: "Kim",
        createdAt: "2026-09-30", replyCount: 2 };
    const markup = render(Board, {
        label: "Posts", posts: [post], selectedPostId: "a",
        onSelectPost: noop, onCreatePost: noop,
    });
    assert.match(markup, /<section aria-label="Posts"/);
    assert.match(markup, /aria-current="true"/);
    assert.match(markup, /댓글 2/);
    assert.throws(() => render(Board, {
        label: "Posts", posts: [post, post], onSelectPost: noop,
    }), /unique IDs/);
});

test("thread keeps parent attribution when replies arrive before parents", () => {
    const parent = { id: "parent", parentId: null, author: "Kim",
        content: "Question", createdAt: "2026-09-30" };
    const reply = { id: "reply", parentId: "parent", author: "Lee",
        content: "Answer", createdAt: "2026-09-30" };
    const markup = render(Thread, {
        label: "Discussion", comments: [reply, parent], onReply: noop,
    });
    assert.ok(markup.indexOf("Question") < markup.indexOf("Answer"));
    assert.match(markup, /Kim에게 답글/);
    assert.match(markup, /<label[^>]+for="[^"]+"[^>]*>댓글 작성/);
});

test("thread rejects orphaned and cyclic parent relationships", () => {
    const comment = { id: "a", parentId: "missing", author: "Kim",
        content: "Question", createdAt: "2026-09-30" };
    assert.throws(() => render(Thread, {
        label: "Discussion", comments: [comment],
    }), /parent was not found/);
    assert.throws(() => render(Thread, {
        label: "Discussion", comments: [
            { ...comment, parentId: "b" },
            { ...comment, id: "b", parentId: "a" },
        ],
    }), /parent cycle/);
});
