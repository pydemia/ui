import { useId, useState, type ComponentProps } from "react";
import { Button } from "./button";
import { CopyButton } from "./copy-button";
import { DiffViewer } from "./diff-viewer";
import { Markdown } from "./markdown";
import { cn } from "./utils";

type ArtifactKind = "markdown" | "code" | "text";
type ArtifactView = "content" | "source" | "diff";

type ArtifactRevision = {
    id: string;
    label: string;
    content: string;
};

type ArtifactViewerProps = Omit<
    ComponentProps<"section">,
    "children" | "dangerouslySetInnerHTML" | "onChange"
> & {
    label: string;
    kind: ArtifactKind;
    revisions: readonly ArtifactRevision[];
    revisionId: string | null;
    onRevisionChange: (id: string) => void;
    description?: string;
    language?: string;
    emptyText?: string;
    onClose?: () => void;
    appearance?: "panel" | "plain";
};

function ArtifactViewer({
    label,
    kind,
    revisions,
    revisionId,
    onRevisionChange,
    description,
    language,
    emptyText = "아직 결과물이 없습니다.",
    onClose,
    appearance = "panel",
    className,
    ...props
}: ArtifactViewerProps) {
    const titleId = useId();
    const [view, setView] = useState<ArtifactView>("content");

    if (typeof label !== "string" || !label.trim()) {
        throw new Error("ArtifactViewer requires a label.");
    }
    if (kind !== "markdown" && kind !== "code" && kind !== "text") {
        throw new RangeError("ArtifactViewer kind is not supported.");
    }
    if (appearance !== "panel" && appearance !== "plain") {
        throw new RangeError("ArtifactViewer appearance is not supported.");
    }
    if (!Array.isArray(revisions)) {
        throw new TypeError("ArtifactViewer revisions must be an array.");
    }
    if (typeof onRevisionChange !== "function") {
        throw new TypeError("ArtifactViewer requires onRevisionChange.");
    }
    if (language !== undefined &&
        (typeof language !== "string" || !language.trim())) {
        throw new Error("ArtifactViewer language must not be empty.");
    }
    if (language !== undefined && kind !== "code") {
        throw new Error("ArtifactViewer language requires code kind.");
    }
    if (onClose !== undefined && typeof onClose !== "function") {
        throw new TypeError("ArtifactViewer onClose must be a function.");
    }

    const ids = new Set<string>();
    for (const revision of revisions) {
        if (!revision || typeof revision.id !== "string" ||
            !revision.id.trim() || ids.has(revision.id) ||
            typeof revision.label !== "string" ||
            !revision.label.trim() ||
            typeof revision.content !== "string") {
            throw new Error(
                "ArtifactViewer revisions need unique IDs, labels, and text.",
            );
        }
        ids.add(revision.id);
    }
    const selectedIndex = revisions.findIndex(
        (revision) => revision.id === revisionId,
    );
    if (revisions.length === 0 ? revisionId !== null :
        selectedIndex < 0) {
        throw new Error("ArtifactViewer revisionId must match revisions.");
    }

    const selected = revisions[selectedIndex];
    const previous = selectedIndex > 0 ? revisions[selectedIndex - 1] : null;
    const activeView = (view === "diff" && !previous) ||
        (view === "source" && kind !== "markdown")
        ? "content" : view;
    const viewLabel = activeView === "diff" ? "변경 비교" :
        activeView === "source" ? "원문" : "내용";

    return (
        <section {...props} aria-labelledby={titleId}
            data-kind={kind} data-view={activeView}
            data-appearance={appearance}
            className={cn(
                "min-w-0 text-foreground",
                appearance === "panel" &&
                    "overflow-hidden rounded-sm border border-border " +
                    "bg-surface",
                className,
            )}>
            <div className={cn(
                "flex flex-wrap items-start justify-between gap-3 " +
                "px-[var(--space-4)] py-[var(--space-3)]",
                appearance === "panel" && "border-b border-border",
            )}>
                <div className="min-w-0 flex-1">
                    <h3 id={titleId}
                        className="m-0 break-words text-base font-semibold">
                        {label}
                    </h3>
                    {language && <span className="text-xs text-muted">
                        {language}
                    </span>}
                    {description && <p className="mb-0 mt-1 text-sm text-muted">
                        {description}
                    </p>}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {selected && <CopyButton value={selected.content}
                        label={`${label} 원문 복사`}
                        appearance="text" disabled={!selected.content} />}
                    {onClose && <Button variant="ghost"
                        className="h-8 px-2 text-xs"
                        onClick={onClose} aria-label={`${label} 닫기`}>
                        닫기
                    </Button>}
                </div>
            </div>
            {selected ? (
                <>
                    <div className={
                        "flex flex-wrap items-center justify-between gap-3 " +
                        "border-b border-border bg-surface-subtle " +
                        "px-[var(--space-4)] py-[var(--space-2)]"
                    }>
                        {revisions.length > 1 ? (
                            <select aria-label={`${label} revision`}
                                value={revisionId ?? ""}
                                onChange={(event) => {
                                    setView("content");
                                    onRevisionChange(event.currentTarget.value);
                                }}
                                className={
                                    "h-8 max-w-full rounded-sm border " +
                                    "border-border bg-surface px-2 text-sm " +
                                    "focus-visible:outline-2 " +
                                    "focus-visible:outline-focus"
                                }>
                                {revisions.map((revision) => (
                                    <option key={revision.id}
                                        value={revision.id}>
                                        {revision.label}
                                    </option>
                                ))}
                            </select>
                        ) : <span className="text-sm text-muted">
                            {selected.label}
                        </span>}
                        <div role="group" aria-label="보기 방식"
                            className="flex flex-wrap items-center gap-1">
                            <Button variant="ghost" aria-pressed={
                                activeView === "content"
                            } className="h-8 px-2 text-xs"
                                onClick={() => setView("content")}>내용</Button>
                            {kind === "markdown" && <Button variant="ghost"
                                aria-pressed={activeView === "source"}
                                className="h-8 px-2 text-xs"
                                onClick={() => setView("source")}>원문</Button>}
                            {previous && <Button variant="ghost"
                                aria-pressed={activeView === "diff"}
                                className="h-8 px-2 text-xs"
                                onClick={() => setView("diff")}>
                                변경 비교
                            </Button>}
                        </div>
                    </div>
                    <div role="region" aria-label={`${label} ${viewLabel}`}
                        className="min-w-0 p-[var(--space-4)]">
                        {activeView === "diff" && previous ? (
                            <DiffViewer label={`${label} 변경 비교`}
                                before={previous.content}
                                after={selected.content}
                                beforeLabel={previous.label}
                                afterLabel={selected.label} />
                        ) : kind === "markdown" &&
                            activeView === "content" ? (
                                <Markdown source={selected.content} />
                            ) : (
                                <pre tabIndex={0}
                                    aria-label={`${label} 원문`}
                                    className={cn(
                                        "m-0 max-w-full overflow-auto " +
                                        "whitespace-pre text-sm leading-6",
                                        kind === "code" && "font-mono",
                                    )}>
                                    {kind === "code"
                                        ? <code>{selected.content}</code>
                                        : selected.content}
                                </pre>
                            )}
                    </div>
                </>
            ) : <p className={
                "m-0 px-[var(--space-4)] py-[var(--space-5)] " +
                "text-sm text-muted"
            }>
                {emptyText}
            </p>}
        </section>
    );
}

export { ArtifactViewer };
export type {
    ArtifactKind, ArtifactRevision, ArtifactView, ArtifactViewerProps,
};
