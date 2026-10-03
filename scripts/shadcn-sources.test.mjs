import assert from "node:assert/strict";
import test from "node:test";
import { shadcnSourceRecords } from "./shadcn-sources.mjs";

test("original records do not change the adapted source list", () => {
    const adapted = {
        name: "pyd-button",
        source: { provider: "shadcn/ui", upstream: "pinned-source" },
    };
    const base = shadcnSourceRecords({ items: [adapted] });
    const withOriginal = shadcnSourceRecords({ items: [
        { name: "pyd-chart", source: {
            provider: "pydemia/ui", upstream: null,
        } },
        adapted,
    ] });
    assert.deepEqual(withOriginal, base);
});

test("adapted source changes are part of the pinned list", () => {
    const first = shadcnSourceRecords({ items: [{
        name: "pyd-button",
        source: { provider: "shadcn/ui", upstream: "revision-a" },
    }] });
    const changed = shadcnSourceRecords({ items: [{
        name: "pyd-button",
        source: { provider: "shadcn/ui", upstream: "revision-b" },
    }] });
    assert.notDeepEqual(changed, first);
});
