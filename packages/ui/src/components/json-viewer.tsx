import {
    useMemo, useState, type ComponentProps,
} from "react";
import { cn } from "./utils";

type JsonValue =
    | null
    | boolean
    | number
    | string
    | JsonValue[]
    | { [key: string]: JsonValue };

type JsonViewerProps = Omit<
    ComponentProps<"section">,
    "aria-label" | "children"
> & {
    value: JsonValue;
    label: string;
    defaultExpandedDepth?: number;
    pageSize?: number;
    variant?: "plain" | "frame";
};

function assertJsonValue(value: JsonValue) {
    const active = new WeakSet<object>();
    const pending: { value: unknown; exiting?: boolean }[] = [{ value }];

    while (pending.length > 0) {
        const item = pending.pop()!;
        const current = item.value;
        if (current === null || typeof current === "string" ||
            typeof current === "boolean") continue;
        if (typeof current === "number" && Number.isFinite(current)) continue;
        if (typeof current !== "object") {
            throw new TypeError("JsonViewer requires JSON-compatible data.");
        }
        if (item.exiting) {
            active.delete(current);
            continue;
        }
        if (active.has(current)) {
            throw new TypeError("JsonViewer does not accept circular data.");
        }
        const prototype = Object.getPrototypeOf(current);
        if (!Array.isArray(current) && prototype !== Object.prototype &&
            prototype !== null) {
            throw new TypeError("JsonViewer requires plain JSON objects.");
        }
        const array = Array.isArray(current);
        const keys = Reflect.ownKeys(current);
        const expectedKeys = array ? current.length + 1 :
            Object.keys(current).length;
        if (keys.length !== expectedKeys) {
            throw new TypeError("JsonViewer requires JSON object entries.");
        }
        for (const key of keys) {
            if (array && key === "length") continue;
            const descriptor = Object.getOwnPropertyDescriptor(current, key);
            if (typeof key !== "string" || !descriptor?.enumerable ||
                !Object.hasOwn(descriptor, "value")) {
                throw new TypeError("JsonViewer requires JSON object entries.");
            }
        }
        if (array) {
            for (let index = 0; index < current.length; index++) {
                if (!Object.hasOwn(current, index)) {
                    throw new TypeError("JsonViewer requires dense JSON arrays.");
                }
            }
        }
        active.add(current);
        pending.push({ value: current, exiting: true });
        const entries = Object.entries(current);
        for (let index = entries.length - 1; index >= 0; index--) {
            pending.push({ value: entries[index][1] });
        }
    }
}

function JsonNode({
    name,
    arrayIndex = false,
    value,
    depth,
    defaultExpandedDepth,
    pageSize,
}: {
    name?: string;
    arrayIndex?: boolean;
    value: JsonValue;
    depth: number;
    defaultExpandedDepth: number;
    pageSize: number;
}) {
    const [expanded, setExpanded] = useState(depth < defaultExpandedDepth);
    const [visibleCount, setVisibleCount] = useState(pageSize);
    const prefix = name === undefined ? "" :
        arrayIndex ? `[${name}]: ` : `${JSON.stringify(name)}: `;

    if (value === null || typeof value !== "object") {
        return (
            <li className="min-w-0 whitespace-pre-wrap break-words py-0.5">
                <span className="text-muted">{prefix}</span>
                <span className={cn(
                    typeof value === "string" && "text-accent",
                    value === null && "text-muted",
                )}>
                    {JSON.stringify(value)}
                </span>
            </li>
        );
    }

    const array = Array.isArray(value);
    const entries: [string, JsonValue][] = array
        ? value.map((item, index) => [String(index), item])
        : Object.entries(value);
    const opening = array ? "[" : "{";
    const closing = array ? "]" : "}";

    if (entries.length === 0) {
        return (
            <li className="min-w-0 py-0.5">
                <span className="text-muted">{prefix}</span>
                {opening}{closing}
            </li>
        );
    }

    return (
        <li className="min-w-0 py-0.5">
            <details
                open={expanded}
                onToggle={(event) => setExpanded(event.currentTarget.open)}
            >
                <summary className={
                    "cursor-pointer rounded-sm text-foreground " +
                    "focus-visible:outline-none focus-visible:ring-2 " +
                    "focus-visible:ring-focus"
                }>
                    <span className="text-muted">{prefix}</span>
                    {expanded ? opening : `${opening}…${closing}`}
                    <span className="ml-2 text-muted">
                        {entries.length} {array ? "items" : "keys"}
                    </span>
                </summary>
                {expanded && (
                    <>
                        <ul className="ml-3 border-l border-border pl-4">
                            {entries.slice(0, Math.max(pageSize, visibleCount))
                                .map(([key, child]) => (
                                    <JsonNode
                                        key={key}
                                        name={key}
                                        arrayIndex={array}
                                        value={child}
                                        depth={depth + 1}
                                        defaultExpandedDepth={defaultExpandedDepth}
                                        pageSize={pageSize}
                                    />
                                ))}
                            {entries.length > Math.max(pageSize, visibleCount) && (
                                <li>
                                    <button
                                        type="button"
                                        className={
                                            "rounded-sm text-accent underline " +
                                            "focus-visible:outline-none " +
                                            "focus-visible:ring-2 " +
                                            "focus-visible:ring-focus"
                                        }
                                        onClick={() => setVisibleCount(
                                            (count) => count + pageSize,
                                        )}
                                    >
                                        다음 {Math.min(
                                            pageSize,
                                            entries.length - Math.max(
                                                pageSize, visibleCount,
                                            ),
                                        )}개 보기
                                    </button>
                                </li>
                            )}
                        </ul>
                        <span aria-hidden="true">{closing}</span>
                    </>
                )}
            </details>
        </li>
    );
}

function JsonViewer({
    value,
    label,
    defaultExpandedDepth = 1,
    pageSize = 40,
    variant = "frame",
    className,
    ...props
}: JsonViewerProps) {
    const [feedback, setFeedback] = useState<{
        value: JsonValue;
        message: string;
    } | null>(null);
    const message = feedback?.value === value ? feedback.message : "";
    const serialized = useMemo(() => {
        assertJsonValue(value);
        return JSON.stringify(value, null, 2);
    }, [value]);

    if (!label.trim()) {
        throw new Error("JsonViewer requires a label.");
    }
    if (!Number.isInteger(defaultExpandedDepth) || defaultExpandedDepth < 0) {
        throw new RangeError("JsonViewer expanded depth must be nonnegative.");
    }
    if (!Number.isInteger(pageSize) || pageSize < 1) {
        throw new RangeError("JsonViewer page size must be positive.");
    }

    async function copy() {
        try {
            await navigator.clipboard.writeText(serialized);
            setFeedback({ value, message: "JSON을 복사했습니다." });
        } catch {
            setFeedback({ value, message: "JSON을 복사하지 못했습니다." });
        }
    }

    return (
        <section
            aria-label={label}
            className={cn(
                "min-w-0 bg-surface text-foreground",
                variant === "frame" && "rounded-sm border border-border",
                className,
            )}
            {...props}
        >
            <div className={cn(
                "flex items-center justify-between gap-3 px-3 py-2",
                variant === "frame" && "border-b border-border",
            )}>
                <span className="min-w-0 truncate text-sm font-medium">
                    {label}
                </span>
                <div className="flex shrink-0 items-center gap-2">
                    <span role="status" className="text-xs text-muted">
                        {message}
                    </span>
                    <button
                        type="button"
                        className={
                            "rounded-sm border border-border px-2 py-1 " +
                            "text-xs hover:bg-surface-subtle " +
                            "focus-visible:outline-none focus-visible:ring-2 " +
                            "focus-visible:ring-focus"
                        }
                        onClick={copy}
                    >
                        JSON 복사
                    </button>
                </div>
            </div>
            <div className="max-h-96 overflow-auto px-3 py-2 font-mono text-xs">
                <ul>
                    <JsonNode
                        value={value}
                        depth={0}
                        defaultExpandedDepth={defaultExpandedDepth}
                        pageSize={pageSize}
                    />
                </ul>
            </div>
        </section>
    );
}

export { JsonViewer };
export type { JsonValue, JsonViewerProps };
