import { useId, useMemo, type ComponentProps } from "react";
import { cn } from "./utils";

type DiffView = "unified" | "split";
type DiffKind = "context" | "added" | "removed";
type DiffLine = {
    kind: DiffKind;
    text: string;
    beforeLine?: number;
    afterLine?: number;
};
type DiffViewerProps = Omit<
    ComponentProps<"figure">, "children" | "aria-label" | "aria-labelledby"
> & {
    label: string;
    before: string;
    after: string;
    view?: DiffView;
    wrap?: boolean;
    beforeLabel?: string;
    afterLabel?: string;
};

const maxComparisonCells = 1_000_000;
const lineTone: Record<DiffKind, string> = {
    context: "bg-surface",
    added: "bg-success/10",
    removed: "bg-danger/10",
};
const kindLabel: Record<DiffKind, string> = {
    context: "변경 없음",
    added: "추가",
    removed: "삭제",
};

function splitLines(value: string) {
    const normalized = value.replace(/\r\n?/g, "\n");
    if (!normalized) return { lines: [], finalNewline: false };
    const finalNewline = normalized.endsWith("\n");
    const lines = normalized.split("\n");
    if (finalNewline) lines.pop();
    return { lines, finalNewline };
}

function compareLines(before: string, after: string) {
    const oldText = splitLines(before);
    const newText = splitLines(after);
    const oldLines = oldText.lines;
    const newLines = newText.lines;
    let prefix = 0;
    while (prefix < oldLines.length && prefix < newLines.length &&
        oldLines[prefix] === newLines[prefix]) prefix++;
    let suffix = 0;
    while (suffix < oldLines.length - prefix &&
        suffix < newLines.length - prefix &&
        oldLines[oldLines.length - suffix - 1] ===
            newLines[newLines.length - suffix - 1]) suffix++;

    const oldMiddle = oldLines.slice(prefix, oldLines.length - suffix);
    const newMiddle = newLines.slice(prefix, newLines.length - suffix);
    const operations: { kind: DiffKind; text: string }[] = oldLines
        .slice(0, prefix).map((text) => ({ kind: "context", text }));
    const coarse = oldMiddle.length * newMiddle.length >
        maxComparisonCells;

    if (coarse || oldMiddle.length === 0 || newMiddle.length === 0) {
        for (const text of oldMiddle) {
            operations.push({ kind: "removed", text });
        }
        for (const text of newMiddle) {
            operations.push({ kind: "added", text });
        }
    } else {
        const width = newMiddle.length + 1;
        const scores = new Uint32Array(
            (oldMiddle.length + 1) * width,
        );
        for (let old = oldMiddle.length - 1; old >= 0; old--) {
            for (let next = newMiddle.length - 1; next >= 0; next--) {
                const current = old * width + next;
                scores[current] = oldMiddle[old] === newMiddle[next]
                    ? scores[current + width + 1] + 1
                    : Math.max(scores[current + width], scores[current + 1]);
            }
        }
        let old = 0;
        let next = 0;
        while (old < oldMiddle.length || next < newMiddle.length) {
            if (old < oldMiddle.length && next < newMiddle.length &&
                oldMiddle[old] === newMiddle[next]) {
                operations.push({ kind: "context", text: oldMiddle[old] });
                old++;
                next++;
            } else if (old < oldMiddle.length && (
                next === newMiddle.length ||
                scores[(old + 1) * width + next] >=
                    scores[old * width + next + 1]
            )) {
                operations.push({ kind: "removed", text: oldMiddle[old] });
                old++;
            } else {
                operations.push({ kind: "added", text: newMiddle[next] });
                next++;
            }
        }
    }
    for (let index = oldLines.length - suffix;
        index < oldLines.length; index++) {
        operations.push({ kind: "context", text: oldLines[index] });
    }

    let beforeLine = 1;
    let afterLine = 1;
    let added = 0;
    let removed = 0;
    const lines: DiffLine[] = operations.map(({ kind, text }) => {
        if (kind === "added") added++;
        if (kind === "removed") removed++;
        return {
            kind, text,
            beforeLine: kind === "added" ? undefined : beforeLine++,
            afterLine: kind === "removed" ? undefined : afterLine++,
        };
    });

    return {
        lines, added, removed, coarse,
        finalNewlineChange: oldText.finalNewline === newText.finalNewline
            ? null : newText.finalNewline ? "추가" : "제거",
    };
}

function splitRows(lines: readonly DiffLine[]) {
    const rows: { before?: DiffLine; after?: DiffLine }[] = [];
    let position = 0;
    while (position < lines.length) {
        if (lines[position].kind === "context") {
            rows.push({ before: lines[position], after: lines[position] });
            position++;
            continue;
        }
        const removed: DiffLine[] = [];
        const added: DiffLine[] = [];
        while (position < lines.length && lines[position].kind !== "context") {
            const line = lines[position++];
            if (line.kind === "removed") removed.push(line);
            else added.push(line);
        }
        for (let index = 0; index < Math.max(removed.length, added.length);
            index++) {
            rows.push({ before: removed[index], after: added[index] });
        }
    }
    return rows;
}

function LineText({ line, wrap }: { line: DiffLine; wrap: boolean }) {
    return (
        <code className={cn(
            "block font-mono text-xs text-foreground",
            wrap ? "whitespace-pre-wrap break-all" : "whitespace-pre",
        )}>
            <span className="sr-only">{kindLabel[line.kind]}: </span>
            <span aria-hidden="true" className={cn(
                "inline-block w-3",
                line.kind === "added" ? "text-success" :
                    line.kind === "removed" ? "text-danger" : "text-muted",
            )}>
                {line.kind === "added" ? "+" :
                    line.kind === "removed" ? "−" : " "}
            </span>
            {line.text || <span aria-hidden="true">{"\u00a0"}</span>}
            {!line.text && <span className="sr-only">빈 줄</span>}
        </code>
    );
}

function DiffViewer({
    label, before, after, view = "unified", wrap = false,
    beforeLabel = "이전", afterLabel = "이후", className, ...props
}: DiffViewerProps) {
    const captionId = useId();
    if (typeof label !== "string" || !label.trim()) {
        throw new Error("DiffViewer requires a label.");
    }
    if (typeof before !== "string" || typeof after !== "string") {
        throw new TypeError("DiffViewer before and after must be strings.");
    }
    if (view !== "unified" && view !== "split") {
        throw new Error("DiffViewer view must be unified or split.");
    }
    if (typeof beforeLabel !== "string" || !beforeLabel.trim() ||
        typeof afterLabel !== "string" || !afterLabel.trim()) {
        throw new Error("DiffViewer column labels must not be empty.");
    }

    const comparison = useMemo(
        () => compareLines(before, after), [before, after],
    );
    const hasChanges = comparison.added > 0 || comparison.removed > 0 ||
        comparison.finalNewlineChange !== null;
    const tableClass = cn(
        "border-collapse text-left font-mono text-xs text-foreground",
        wrap ? view === "split"
            ? "w-full min-w-[40rem] table-fixed"
            : "w-full table-fixed"
            : "w-max min-w-full",
    );
    const numberClass = "border-r border-border px-[var(--space-2)] " +
        "py-[var(--space-1)] text-right text-muted tabular-nums";
    const codeClass = "min-w-0 px-[var(--space-2)] py-[var(--space-1)] " +
        "align-top";

    return (
        <figure {...props} aria-labelledby={captionId}
            data-view={view} data-comparison={comparison.coarse
                ? "coarse" : "full"}
            className={cn(
                "m-0 min-w-0 overflow-hidden rounded-sm border " +
                "border-border bg-surface", className,
            )}>
            <figcaption id={captionId}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface-subtle px-[var(--space-3)] py-[var(--space-2)] text-sm">
                <span className="font-medium text-foreground">{label}</span>
                <span className="text-muted">
                    추가 {comparison.added}줄 · 삭제 {comparison.removed}줄
                </span>
            </figcaption>
            {comparison.coarse && (
                <p className="m-0 border-b border-border px-[var(--space-3)] py-[var(--space-2)] text-xs text-muted">
                    큰 변경 구간은 공통 줄 매칭 없이 삭제·추가로 표시합니다.
                </p>
            )}
            {comparison.lines.length === 0 ? (
                <p className="m-0 p-[var(--space-3)] text-sm text-muted">
                    비교할 줄이 없습니다.
                </p>
            ) : (
                <div role="region" tabIndex={0}
                    aria-label={`${label} 변경 내용 스크롤`}
                    className="max-h-96 max-w-full overflow-auto">
                    {view === "unified" ? (
                        <table className={tableClass}>
                            <caption className="sr-only">
                                {label} 통합 비교
                            </caption>
                            <thead className="bg-surface-subtle">
                                <tr>
                                    <th scope="col" className={numberClass}>
                                        {beforeLabel} 줄
                                    </th>
                                    <th scope="col" className={numberClass}>
                                        {afterLabel} 줄
                                    </th>
                                    <th scope="col" className={codeClass}>
                                        변경 내용
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparison.lines.map((line, index) => (
                                    <tr key={index} data-kind={line.kind}
                                        className={lineTone[line.kind]}>
                                        <td className={numberClass}>
                                            {line.beforeLine ?? ""}
                                        </td>
                                        <td className={numberClass}>
                                            {line.afterLine ?? ""}
                                        </td>
                                        <td className={codeClass}>
                                            <LineText line={line} wrap={wrap} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <table className={tableClass}>
                            <caption className="sr-only">
                                {label} 좌우 비교
                            </caption>
                            <thead className="bg-surface-subtle">
                                <tr>
                                    <th scope="col" className={numberClass}>
                                        {beforeLabel} 줄
                                    </th>
                                    <th scope="col" className={codeClass}>
                                        {beforeLabel} 내용
                                    </th>
                                    <th scope="col" className={numberClass}>
                                        {afterLabel} 줄
                                    </th>
                                    <th scope="col" className={codeClass}>
                                        {afterLabel} 내용
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {splitRows(comparison.lines).map((row, index) => (
                                    <tr key={index} data-kind={
                                        row.before?.kind === "context"
                                            ? "context" : "change"
                                    }>
                                        <td className={cn(numberClass,
                                            row.before &&
                                                lineTone[row.before.kind])}>
                                            {row.before?.beforeLine ?? ""}
                                        </td>
                                        <td className={cn(codeClass,
                                            row.before ? lineTone[row.before.kind]
                                                : "bg-surface-subtle")}>
                                            {row.before ? (
                                                <LineText line={row.before}
                                                    wrap={wrap} />
                                            ) : <span className="sr-only">
                                                해당 없음
                                            </span>}
                                        </td>
                                        <td className={cn(numberClass,
                                            row.after && lineTone[row.after.kind])}>
                                            {row.after?.afterLine ?? ""}
                                        </td>
                                        <td className={cn(codeClass,
                                            row.after ? lineTone[row.after.kind]
                                                : "bg-surface-subtle")}>
                                            {row.after ? (
                                                <LineText line={row.after}
                                                    wrap={wrap} />
                                            ) : <span className="sr-only">
                                                해당 없음
                                            </span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
            {comparison.finalNewlineChange && (
                <p className="m-0 border-t border-border px-[var(--space-3)] py-[var(--space-2)] text-xs text-muted">
                    끝 줄바꿈 {comparison.finalNewlineChange}
                </p>
            )}
            {!hasChanges && comparison.lines.length > 0 && (
                <p className="m-0 border-t border-border px-[var(--space-3)] py-[var(--space-2)] text-xs text-muted">
                    변경된 줄이 없습니다.
                </p>
            )}
        </figure>
    );
}

export { DiffViewer };
export type { DiffViewerProps, DiffView };
