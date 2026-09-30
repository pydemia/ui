import { MessageCircle } from "lucide-react";
import type { ComponentProps } from "react";
import { Button } from "./button";
import { cn } from "./utils";

type BoardPost = {
    id: string;
    title: string;
    summary?: string;
    author: string;
    createdAt: string;
    category?: string;
    replyCount?: number;
};

type BoardProps = Omit<ComponentProps<"section">, "children" | "onSelect"> & {
    label: string;
    posts: readonly BoardPost[];
    selectedPostId?: string | null;
    onSelectPost: (id: string) => void;
    onCreatePost?: () => void;
    emptyMessage?: string;
};

function Board({
    label, posts, selectedPostId, onSelectPost, onCreatePost,
    emptyMessage = "게시글이 없습니다.", className, ...props
}: BoardProps) {
    if (!label.trim()) throw new Error("Board requires a label.");
    const ids = new Set<string>();
    for (const post of posts) {
        if (!post.id.trim() || !post.title.trim() ||
            !post.author.trim() || !post.createdAt.trim() ||
            ids.has(post.id)) {
            throw new Error("Board posts need unique IDs and required text.");
        }
        if (post.replyCount !== undefined &&
            (!Number.isSafeInteger(post.replyCount) || post.replyCount < 0)) {
            throw new RangeError("Board reply counts must be nonnegative integers.");
        }
        ids.add(post.id);
    }

    return (
        <section aria-label={label}
            className={cn("min-w-0 rounded-sm border border-border bg-surface",
                className)} {...props}>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border p-[var(--space-3)]">
                <h3 className="m-0 text-base font-semibold">{label}</h3>
                {onCreatePost && <Button variant="outline"
                    onClick={onCreatePost}>글쓰기</Button>}
            </div>
            {posts.length === 0 ? (
                <p className="m-0 p-[var(--space-4)] text-sm text-muted">
                    {emptyMessage}
                </p>
            ) : (
                <ul className="m-0 list-none divide-y divide-border p-0">
                    {posts.map((post) => (
                        <li key={post.id}>
                            <button type="button" onClick={() =>
                                onSelectPost(post.id)}
                                aria-current={selectedPostId === post.id
                                    ? "true" : undefined}
                                className={cn(
                                    "grid w-full min-w-0 gap-1 p-[var(--space-3)] " +
                                    "text-left text-foreground hover:bg-surface-subtle " +
                                    "focus-visible:outline-2 focus-visible:outline-focus",
                                    selectedPostId === post.id &&
                                        "bg-surface-subtle",
                                )}>
                                <span className="flex min-w-0 flex-wrap items-center gap-2">
                                    <strong className="min-w-0 break-words text-sm">
                                        {post.title}
                                    </strong>
                                    {post.category && <span className={
                                        "rounded-sm border border-border " +
                                        "px-1.5 text-xs text-muted"
                                    }>{post.category}</span>}
                                </span>
                                {post.summary && <span className={
                                    "break-words text-sm text-muted"
                                }>{post.summary}</span>}
                                <span className={
                                    "flex flex-wrap items-center gap-3 text-xs text-muted"
                                }>
                                    <span>{post.author}</span>
                                    <time dateTime={post.createdAt}>
                                        {post.createdAt}
                                    </time>
                                    {post.replyCount !== undefined && <span
                                        className="inline-flex items-center gap-1">
                                        <MessageCircle aria-hidden="true"
                                            className="size-3.5" />
                                        <span>댓글 {post.replyCount}</span>
                                    </span>}
                                </span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export { Board };
export type { BoardPost, BoardProps };
