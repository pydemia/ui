import {
    useEffect, useId, useRef, useState,
    type ComponentProps, type FormEvent,
} from "react";
import { Button } from "./button";
import { Textarea } from "./textarea";
import { cn } from "./utils";

type ThreadComment = {
    id: string;
    parentId: string | null;
    author: string;
    content: string;
    createdAt: string;
};

type ThreadProps = Omit<ComponentProps<"section">, "children"> & {
    label: string;
    comments: readonly ThreadComment[];
    onReply?: (parentId: string | null, content: string) =>
        void | Promise<void>;
    disabled?: boolean;
    emptyMessage?: string;
};

function orderComments(comments: readonly ThreadComment[]) {
    const byId = new Map<string, ThreadComment>();
    for (const comment of comments) {
        if (!comment.id.trim() || !comment.author.trim() ||
            !comment.content.trim() || !comment.createdAt.trim() ||
            byId.has(comment.id)) {
            throw new Error("Thread comments need unique IDs and required text.");
        }
        byId.set(comment.id, comment);
    }
    for (const comment of comments) {
        if (comment.parentId !== null && !byId.has(comment.parentId)) {
            throw new Error("Thread comment parent was not found.");
        }
    }

    const depths = new Map<string, number>();
    for (const comment of comments) {
        const path: ThreadComment[] = [];
        const seen = new Set<string>();
        let current: ThreadComment | undefined = comment;
        while (current && !depths.has(current.id)) {
            if (seen.has(current.id)) {
                throw new Error("Thread comments contain a parent cycle.");
            }
            seen.add(current.id);
            path.push(current);
            current = current.parentId === null
                ? undefined : byId.get(current.parentId);
        }
        let depth = current ? depths.get(current.id)! : -1;
        for (let index = path.length - 1; index >= 0; index -= 1) {
            depth += 1;
            depths.set(path[index].id, depth);
        }
    }

    const children = new Map<string | null, ThreadComment[]>();
    for (const comment of comments) {
        const siblings = children.get(comment.parentId) ?? [];
        siblings.push(comment);
        children.set(comment.parentId, siblings);
    }
    const ordered: { comment: ThreadComment; depth: number }[] = [];
    const stack = [...(children.get(null) ?? [])].reverse();
    while (stack.length > 0) {
        const comment = stack.pop()!;
        ordered.push({ comment, depth: depths.get(comment.id)! });
        const replies = children.get(comment.id) ?? [];
        for (let index = replies.length - 1; index >= 0; index -= 1) {
            stack.push(replies[index]);
        }
    }
    return { ordered, byId };
}

function Thread({
    label, comments, onReply, disabled = false,
    emptyMessage = "아직 댓글이 없습니다.", className, ...props
}: ThreadProps) {
    if (!label.trim()) throw new Error("Thread requires a label.");
    const { ordered, byId } = orderComments(comments);
    const textareaId = useId();
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const returnFocusRef = useRef<HTMLButtonElement | null>(null);
    const [replyTo, setReplyTo] = useState<string | null>(null);
    const [draft, setDraft] = useState("");
    const [pending, setPending] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");
    const activeReplyTo = replyTo && byId.has(replyTo) ? replyTo : null;

    useEffect(() => {
        if (activeReplyTo) textareaRef.current?.focus();
    }, [activeReplyTo]);

    useEffect(() => {
        if (replyTo !== null && !byId.has(replyTo)) {
            setReplyTo(null);
            setDraft("");
            setError("");
            setNotice("답글 대상이 제거되었습니다.");
        }
    }, [replyTo, comments]);

    function openReply(id: string, button: HTMLButtonElement) {
        returnFocusRef.current = button;
        setReplyTo(id);
        setDraft("");
        setError("");
        setNotice("");
    }

    function closeReply() {
        setReplyTo(null);
        setDraft("");
        setError("");
        requestAnimationFrame(() => returnFocusRef.current?.focus());
    }

    async function submitReply(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const content = draft.trim();
        if (replyTo !== null && activeReplyTo === null) return;
        if (!onReply || disabled || pending || !content) return;
        setPending(true);
        setError("");
        setNotice("");
        try {
            await onReply(activeReplyTo, content);
            setDraft("");
            setReplyTo(null);
            setNotice("댓글을 등록했습니다.");
            if (activeReplyTo) {
                requestAnimationFrame(() => returnFocusRef.current?.focus());
            }
        } catch {
            setError("댓글을 등록하지 못했습니다. 다시 시도해 주세요.");
        } finally {
            setPending(false);
        }
    }

    function composer(parentId: string | null) {
        const parent = parentId ? byId.get(parentId) : undefined;
        const composerLabel = parent
            ? `${parent.author}에게 답글` : "댓글 작성";
        return (
            <form onSubmit={submitReply} className="grid gap-2">
                <label htmlFor={textareaId}
                    className="text-sm font-medium">{composerLabel}</label>
                <Textarea id={textareaId} ref={textareaRef} required
                    value={draft} onChange={(event) =>
                        setDraft(event.target.value)}
                    disabled={disabled || pending} rows={3} />
                {error && <p role="alert" className="m-0 text-sm text-danger">
                    {error}
                </p>}
                <div className="flex flex-wrap gap-2">
                    <Button type="submit" disabled={disabled || pending ||
                        !draft.trim()}>
                        {pending ? "등록 중" : "등록"}
                    </Button>
                    {parent && <Button variant="outline" type="button"
                        disabled={pending} onClick={closeReply}>취소</Button>}
                </div>
            </form>
        );
    }

    const indent = ["0px", "16px", "32px", "48px", "64px"];
    return (
        <section aria-label={label} className={cn("min-w-0", className)}
            {...props}>
            <h3 className="mb-3 text-base font-semibold">{label}</h3>
            {notice && <p role="status" className="text-sm text-muted">
                {notice}
            </p>}
            {onReply && activeReplyTo === null && composer(null)}
            {ordered.length === 0 ? (
                <p className="text-sm text-muted">{emptyMessage}</p>
            ) : (
                <ol className="mt-4 grid list-none gap-3 p-0">
                    {ordered.map(({ comment, depth }) => {
                        const parent = comment.parentId
                            ? byId.get(comment.parentId) : undefined;
                        return (
                            <li key={comment.id}
                                style={{ marginInlineStart: indent[
                                    Math.min(depth, indent.length - 1)] }}
                                className={
                                    "min-w-0 border-s-2 border-border " +
                                    "ps-[var(--space-3)]"
                                }>
                                <article className="grid min-w-0 gap-1">
                                    <div className={
                                        "flex flex-wrap items-center gap-x-2 " +
                                        "text-xs text-muted"
                                    }>
                                        <strong className="text-foreground">
                                            {comment.author}
                                        </strong>
                                        <time dateTime={comment.createdAt}>
                                            {comment.createdAt}
                                        </time>
                                    </div>
                                    {parent && <span className="text-xs text-muted">
                                        {parent.author}에게 답글
                                    </span>}
                                    <p className={
                                        "m-0 whitespace-pre-wrap break-words " +
                                        "text-sm text-foreground"
                                    }>{comment.content}</p>
                                    {onReply && <Button variant="ghost"
                                        className="justify-self-start"
                                        disabled={disabled || pending}
                                        onClick={(event) => openReply(
                                            comment.id, event.currentTarget,
                                        )}>답글</Button>}
                                    {activeReplyTo === comment.id &&
                                        onReply && composer(comment.id)}
                                </article>
                            </li>
                        );
                    })}
                </ol>
            )}
        </section>
    );
}

export { Thread };
export type { ThreadComment, ThreadProps };
