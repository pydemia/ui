import {
    useEffect, useId, useRef, type ComponentProps, type ReactNode,
} from "react";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { cn } from "./utils";

type BlockKind =
    "paragraph" | "heading" | "subheading" | "bullet" |
    "number" | "quote" | "code";

type BlockEditorBlock = {
    id: string;
    kind: BlockKind;
    text: string;
};

type BlockEditorProps = Omit<
    ComponentProps<"section">, "children" | "onChange"
> & {
    label: string;
    blocks: readonly BlockEditorBlock[];
    onBlocksChange: (blocks: BlockEditorBlock[]) => void;
    createBlockId?: (blocks: readonly BlockEditorBlock[]) => string;
    name?: string;
    description?: string;
    error?: string;
    disabled?: boolean;
    appearance?: "panel" | "plain";
};

type BlockDocumentProps = Omit<
    ComponentProps<"section">, "children"
> & {
    label: string;
    blocks: readonly BlockEditorBlock[];
    emptyMessage?: string;
};

const kindLabels: Record<BlockKind, string> = {
    paragraph: "문단",
    heading: "제목",
    subheading: "소제목",
    bullet: "글머리 목록",
    number: "번호 목록",
    quote: "인용",
    code: "코드",
};

function checkBlocks(blocks: readonly BlockEditorBlock[]) {
    if (!Array.isArray(blocks)) {
        throw new TypeError("BlockEditor blocks must be an array.");
    }
    const ids = new Set<string>();
    for (const block of blocks) {
        if (!block || typeof block.id !== "string" ||
            !block.id.trim() || ids.has(block.id) ||
            !Object.hasOwn(kindLabels, block.kind) ||
            typeof block.text !== "string") {
            throw new Error(
                "BlockEditor blocks need unique IDs, kinds, and text.",
            );
        }
        ids.add(block.id);
    }
}

function nextBlockId(blocks: readonly BlockEditorBlock[]) {
    const ids = new Set(blocks.map((block) => block.id));
    let sequence = blocks.length + 1;
    while (ids.has(`block-${sequence}`)) sequence += 1;
    return `block-${sequence}`;
}

function BlockEditor({
    label,
    blocks,
    onBlocksChange,
    createBlockId = nextBlockId,
    name,
    description,
    error,
    disabled = false,
    appearance = "panel",
    className,
    ...props
}: BlockEditorProps) {
    const titleId = useId();
    const descriptionId = useId();
    const errorId = useId();
    const inputs = useRef(new Map<string, HTMLTextAreaElement>());
    const addButton = useRef<HTMLButtonElement>(null);
    const pendingFocus = useRef<{ id: string | null } | null>(null);

    if (typeof label !== "string" || !label.trim()) {
        throw new Error("BlockEditor requires a label.");
    }
    if (typeof onBlocksChange !== "function") {
        throw new TypeError("BlockEditor requires onBlocksChange.");
    }
    if (typeof createBlockId !== "function") {
        throw new TypeError("BlockEditor createBlockId must be a function.");
    }
    if (name !== undefined &&
        (typeof name !== "string" || !name.trim())) {
        throw new Error("BlockEditor name must not be empty.");
    }
    if (appearance !== "panel" && appearance !== "plain") {
        throw new RangeError("BlockEditor appearance is not supported.");
    }
    checkBlocks(blocks);

    useEffect(() => {
        const request = pendingFocus.current;
        if (!request) return;
        if (request.id === null && blocks.length === 0) {
            addButton.current?.focus({ preventScroll: true });
            pendingFocus.current = null;
        } else if (request.id && blocks.some((block) =>
            block.id === request.id)) {
            inputs.current.get(request.id)?.focus({ preventScroll: true });
            pendingFocus.current = null;
        }
    }, [blocks]);

    function replaceBlock(id: string, change: Partial<BlockEditorBlock>) {
        onBlocksChange(blocks.map((block) =>
            block.id === id ? { ...block, ...change } : block
        ));
    }

    function insertBlock(afterId?: string) {
        const id = createBlockId(blocks);
        if (typeof id !== "string" || !id.trim() ||
            blocks.some((block) => block.id === id)) {
            throw new Error("BlockEditor createBlockId returned a duplicate ID.");
        }
        const index = afterId === undefined
            ? blocks.length : blocks.findIndex((block) => block.id === afterId) + 1;
        const next = [...blocks];
        next.splice(index, 0, { id, kind: "paragraph", text: "" });
        pendingFocus.current = { id };
        onBlocksChange(next);
    }

    function removeBlock(id: string, index: number) {
        const next = blocks.filter((block) => block.id !== id);
        pendingFocus.current = { id: next[Math.min(index, next.length - 1)]
            ?.id ?? null };
        onBlocksChange(next);
    }

    function moveBlock(index: number, offset: number) {
        const next = [...blocks];
        const [block] = next.splice(index, 1);
        next.splice(index + offset, 0, block);
        onBlocksChange(next);
    }

    const describedBy = [
        description ? descriptionId : null,
        error ? errorId : null,
    ].filter(Boolean).join(" ") || undefined;

    return (
        <section {...props} aria-labelledby={titleId}
            data-appearance={appearance}
            className={cn(
                "min-w-0 text-foreground",
                appearance === "panel" &&
                    "rounded-sm border border-border bg-surface",
                className,
            )}>
            {name && <input type="hidden" name={name}
                value={JSON.stringify(blocks)} disabled={disabled} />}
            <div className={cn(
                "grid gap-1 px-[var(--space-4)] py-[var(--space-3)]",
                appearance === "panel" && "border-b border-border",
            )}>
                <h3 id={titleId} className="m-0 text-base font-semibold">
                    {label}
                </h3>
                {description && <p id={descriptionId}
                    className="m-0 text-xs text-muted">{description}</p>}
                {error && <p id={errorId} role="alert"
                    className="m-0 text-xs text-danger">{error}</p>}
            </div>
            <ol className={
                "m-0 grid list-none gap-[var(--space-3)] " +
                "p-[var(--space-3)]"
            }>
                {blocks.map((block, index) => (
                    <li key={block.id} data-block-id={block.id}
                        className={
                            "min-w-0 rounded-sm border border-border " +
                            "bg-surface-subtle p-[var(--space-3)]"
                        }>
                        <div className={
                            "mb-2 flex flex-wrap items-center " +
                            "gap-[var(--space-2)]"
                        }>
                            <span className="mr-auto text-xs text-muted">
                                블록 {index + 1}
                            </span>
                            <select value={block.kind} disabled={disabled}
                                aria-label={`${index + 1}번 블록 형식`}
                                onChange={(event) => replaceBlock(block.id, {
                                    kind: event.currentTarget.value as BlockKind,
                                })}
                                className={
                                    "h-8 rounded-sm border border-border " +
                                    "bg-surface px-2 text-xs text-foreground " +
                                    "focus-visible:outline-2 " +
                                    "focus-visible:outline-focus"
                                }>
                                {Object.entries(kindLabels).map(
                                    ([kind, text]) => <option key={kind}
                                        value={kind}>{text}</option>
                                )}
                            </select>
                            <Button variant="outline" disabled={disabled ||
                                index === 0} className="h-8 px-2 text-xs"
                                aria-label={`${index + 1}번 블록 위로 이동`}
                                onClick={() => moveBlock(index, -1)}>위로</Button>
                            <Button variant="outline" disabled={disabled ||
                                index === blocks.length - 1}
                                className="h-8 px-2 text-xs"
                                aria-label={`${index + 1}번 블록 아래로 이동`}
                                onClick={() => moveBlock(index, 1)}>아래로</Button>
                            <Button variant="outline" disabled={disabled}
                                className="h-8 px-2 text-xs"
                                aria-label={`${index + 1}번 블록 다음에 추가`}
                                onClick={() => insertBlock(block.id)}>추가</Button>
                            <Button variant="ghost" disabled={disabled}
                                className="h-8 px-2 text-xs"
                                aria-label={`${index + 1}번 블록 삭제`}
                                onClick={() => removeBlock(block.id, index)}>
                                삭제
                            </Button>
                        </div>
                        <Textarea value={block.text} disabled={disabled}
                            rows={block.kind === "code" ? 6 : 3}
                            ref={(node) => {
                                if (node) inputs.current.set(block.id, node);
                                else inputs.current.delete(block.id);
                            }}
                            aria-label={
                                `${index + 1}번 ${kindLabels[block.kind]} 내용`
                            }
                            aria-describedby={describedBy}
                            aria-invalid={!!error}
                            onChange={(event) => replaceBlock(block.id, {
                                text: event.currentTarget.value,
                            })}
                            className={cn(
                                "min-h-20 resize-y bg-surface",
                                block.kind === "code" && "font-mono",
                            )} />
                    </li>
                ))}
            </ol>
            <div className="px-[var(--space-3)] pb-[var(--space-3)]">
                <Button ref={addButton} variant="outline"
                    disabled={disabled} onClick={() => insertBlock()}>
                    블록 추가
                </Button>
            </div>
        </section>
    );
}

function BlockDocument({
    label, blocks, emptyMessage = "내용이 없습니다.", className, ...props
}: BlockDocumentProps) {
    if (typeof label !== "string" || !label.trim()) {
        throw new Error("BlockDocument requires a label.");
    }
    checkBlocks(blocks);

    const content: ReactNode[] = [];
    let index = 0;
    while (index < blocks.length) {
        const block = blocks[index];
        if (block.kind === "bullet" || block.kind === "number") {
            const kind = block.kind;
            const items: ReactNode[] = [];
            while (index < blocks.length && blocks[index].kind === kind) {
                const item = blocks[index++];
                items.push(<li key={item.id}
                    className="whitespace-pre-wrap break-words">
                    {item.text}
                </li>);
            }
            content.push(kind === "bullet"
                ? <ul key={block.id} className="m-0 grid gap-1 pl-5">
                    {items}</ul>
                : <ol key={block.id} className="m-0 grid gap-1 pl-5">
                    {items}</ol>);
            continue;
        }
        if (block.kind === "heading") {
            content.push(<h2 key={block.id}
                className="m-0 break-words text-xl font-semibold">
                {block.text}</h2>);
        } else if (block.kind === "subheading") {
            content.push(<h3 key={block.id}
                className="m-0 break-words text-lg font-semibold">
                {block.text}</h3>);
        } else if (block.kind === "quote") {
            content.push(<blockquote key={block.id}
                className={
                    "m-0 border-l-2 border-accent pl-3 " +
                    "whitespace-pre-wrap break-words text-muted"
                }>{block.text}</blockquote>);
        } else if (block.kind === "code") {
            content.push(<pre key={block.id} tabIndex={0}
                aria-label="코드 블록"
                className={
                    "m-0 max-w-full overflow-auto rounded-sm border " +
                    "border-border bg-surface-subtle p-3 text-xs"
                }><code>{block.text}</code></pre>);
        } else {
            content.push(<p key={block.id}
                className="m-0 whitespace-pre-wrap break-words">
                {block.text}</p>);
        }
        index += 1;
    }

    return (
        <section {...props} aria-label={label}
            className={cn("grid min-w-0 gap-[var(--space-3)]", className)}>
            {content.length ? content : (
                <p className="m-0 text-sm text-muted">{emptyMessage}</p>
            )}
        </section>
    );
}

export { BlockDocument, BlockEditor };
export type {
    BlockDocumentProps, BlockEditorBlock, BlockEditorProps, BlockKind,
};
