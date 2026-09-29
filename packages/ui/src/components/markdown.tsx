import type { ComponentProps, ReactNode } from "react";
import { cn } from "./utils";

type MarkdownProps = Omit<
    ComponentProps<"div">, "children" | "dangerouslySetInnerHTML"
> & {
    source: string;
};

function safeLink(href: string): string | null {
    if (!/^https?:\/\//i.test(href) || /[\u0000-\u0020\\]/.test(href)) {
        return null;
    }
    try {
        const url = new URL(href);
        return url.hostname && !url.username && !url.password
            ? url.href : null;
    } catch {
        return null;
    }
}

function inline(source: string, depth = 0): ReactNode[] {
    if (depth >= 8) return [source];
    const nodes: ReactNode[] = [];
    let text = "";
    let index = 0;

    function flush() {
        if (text) nodes.push(text);
        text = "";
    }

    while (index < source.length) {
        const char = source[index];
        if (char === "\\" && /[\\`*\[\]()!]/.test(source[index + 1] ?? "")) {
            text += source[index + 1];
            index += 2;
            continue;
        }
        if (char === "`") {
            const end = source.indexOf("`", index + 1);
            if (end > index + 1) {
                flush();
                nodes.push(<code key={index} className={
                    "rounded-sm bg-surface-subtle px-1 font-mono text-[0.9em]"
                }>{source.slice(index + 1, end)}</code>);
                index = end + 1;
                continue;
            }
        }
        if (source.startsWith("**", index)) {
            const end = source.indexOf("**", index + 2);
            if (end > index + 2) {
                flush();
                nodes.push(<strong key={index} className="font-semibold">
                    {inline(source.slice(index + 2, end), depth + 1)}
                </strong>);
                index = end + 2;
                continue;
            }
        }
        if (char === "*") {
            const end = source.indexOf("*", index + 1);
            if (end > index + 1) {
                flush();
                nodes.push(<em key={index}>
                    {inline(source.slice(index + 1, end), depth + 1)}
                </em>);
                index = end + 1;
                continue;
            }
        }
        if (char === "[" && source[index - 1] !== "!") {
            const labelEnd = source.indexOf("](", index + 1);
            const hrefEnd = labelEnd < 0 ? -1 :
                source.indexOf(")", labelEnd + 2);
            if (labelEnd > index + 1 && hrefEnd > labelEnd + 2) {
                const href = safeLink(source.slice(labelEnd + 2, hrefEnd));
                if (href) {
                    flush();
                    nodes.push(<a key={index} href={href}
                        className={
                            "text-accent underline underline-offset-2 " +
                            "focus-visible:outline-2 focus-visible:outline-focus"
                        }>{source.slice(index + 1, labelEnd)}</a>);
                    index = hrefEnd + 1;
                    continue;
                }
            }
        }
        text += char;
        index += 1;
    }
    flush();
    return nodes;
}

const heading = /^ {0,3}(#{1,3})[ \t]+(.+)$/;
const bullet = /^ {0,3}[-*+][ \t]+(.+)$/;
const numbered = /^ {0,3}(\d+)[.)][ \t]+(.+)$/;
const fence = /^ {0,3}(`{3,}|~{3,})([\w+-]*)[ \t]*$/;

function blockStart(line: string): boolean {
    return heading.test(line) || bullet.test(line) ||
        numbered.test(line) || fence.test(line);
}

function renderBlocks(source: string): ReactNode[] {
    const lines = source.replace(/\r\n?/g, "\n").split("\n");
    const blocks: ReactNode[] = [];
    let index = 0;

    while (index < lines.length) {
        const line = lines[index];
        if (!line.trim()) {
            index += 1;
            continue;
        }
        const openingFence = line.match(fence);
        if (openingFence) {
            const start = index++;
            const marker = openingFence[1];
            const language = openingFence[2];
            const code: string[] = [];
            const closing = new RegExp(
                `^ {0,3}${marker[0]}{${marker.length},}[ \\t]*$`,
            );
            while (index < lines.length && !closing.test(lines[index])) {
                code.push(lines[index++]);
            }
            if (index < lines.length) index += 1;
            blocks.push(<pre key={start} tabIndex={0}
                aria-label={language ? `${language} 코드` : "코드"}
                className={
                    "m-0 max-w-full overflow-auto rounded-sm border " +
                    "border-border bg-surface-subtle p-[var(--space-3)] " +
                    "text-xs leading-6"
                }><code>{code.join("\n")}</code></pre>);
            continue;
        }
        const title = line.match(heading);
        if (title) {
            const level = title[1].length;
            const content = inline(title[2].trim());
            blocks.push(level === 1
                ? <h2 key={index} className="m-0 text-lg font-semibold">
                    {content}</h2>
                : level === 2
                    ? <h3 key={index} className="m-0 text-base font-semibold">
                        {content}</h3>
                    : <h4 key={index} className="m-0 text-sm font-semibold">
                        {content}</h4>);
            index += 1;
            continue;
        }
        const list = line.match(bullet) ?? line.match(numbered);
        if (list) {
            const start = index;
            const ordered = !bullet.test(line);
            const items: ReactNode[] = [];
            while (index < lines.length) {
                const item = lines[index].match(ordered ? numbered : bullet);
                if (!item) break;
                items.push(<li key={index} className="pl-1">
                    {inline(item[ordered ? 2 : 1])}
                </li>);
                index += 1;
            }
            const className = "m-0 grid gap-1 pl-5";
            blocks.push(ordered
                ? <ol key={start} start={Number(list[1])}
                    className={className}>{items}</ol>
                : <ul key={start} className={className}>{items}</ul>);
            continue;
        }
        const start = index;
        const paragraph: string[] = [];
        while (index < lines.length && lines[index].trim() &&
            (index === start || !blockStart(lines[index]))) {
            paragraph.push(lines[index++].trim());
        }
        blocks.push(<p key={start} className="m-0 leading-relaxed">
            {inline(paragraph.join(" "))}
        </p>);
    }
    return blocks;
}

function Markdown({ source, className, ...props }: MarkdownProps) {
    if (typeof source !== "string") {
        throw new TypeError("Markdown source must be a string.");
    }
    if ("dangerouslySetInnerHTML" in props) {
        throw new TypeError("Markdown does not accept raw HTML.");
    }
    return <div className={cn(
        "grid min-w-0 gap-[var(--space-3)] [overflow-wrap:anywhere] " +
        "text-sm text-foreground",
        className,
    )} {...props}>{renderBlocks(source)}</div>;
}

export { Markdown };
export type { MarkdownProps };
