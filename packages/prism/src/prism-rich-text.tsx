import { Fragment } from "react";
import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
const colors = "white|black|gray|red|orange|yellow|green|blue|purple|brown|pink";
const richClass = new RegExp(`^prism-rich-(?:color-(?:${colors})|highlight-(?:${colors})|badge-(?:${colors})|size-(?:extra-small|small|normal|large|extra-large)|bullet-[1-3]|bold|italic|underline|h[12])$`);
const schema = { ...defaultSchema, tagNames:[...(defaultSchema.tagNames ?? []),"mark"], attributes:{...defaultSchema.attributes,
    span:[["className",richClass]], mark:[["className",richClass]],
}, protocols:{...defaultSchema.protocols,href:["http","https","mailto","profile","position","popup"]} };
function formatTags(source: string): string {
    let formatted = source.replace(/<h([12])>([\s\S]*?)<\/h\1>/g,(_,level,content) => `<span class="prism-rich-h${level}">${content}</span>`)
        .replace(new RegExp(`<highlight-(${colors})>`,'g'),(_,color) => `<mark class="prism-rich-highlight-${color}">`)
        .replace(/<\/highlight>/g,"</mark>")
        .replace(new RegExp(`<(color|badge)-(${colors})>`,'g'),(_,kind,color) => `<span class="prism-rich-${kind}-${color}">`)
        .replace(/<\/(color|badge)>/g,"</span>")
        .replace(/<size-(extra-small|small|normal|large|extra-large)>/g,'<span class="prism-rich-size-$1">').replace(/<\/size>/g,"</span>")
        .replace(/<(bold|italic|underline)>/g,'<span class="prism-rich-$1">').replace(/<\/(bold|italic|underline)>/g,"</span>")
        .replace(/<bullet\s+depth=["']?([1-3])["']?>/g,'<span class="prism-rich-bullet-$1">').replace(/<\/bullet>/g,"</span>");
    return formatted;
}
function safeUrl(url: string): string { return /^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(url) ? url : ""; }
export function PrismFormattedText({ source, inline = false, panel = false, onAction }: { source: string; inline?: boolean; panel?: boolean; onAction?: (kind: "profile" | "position" | "document", id: string) => void }) {
    return <div className="prism-rich-text" data-panel={panel || undefined}><ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw,[rehypeSanitize,schema]]}
        urlTransform={url => /^(profile|position):\/\/[^\s]+$/.test(url) || /^popup:(https?:\/\/|\/(?!\/))/.test(url) ? url : defaultUrlTransform(safeUrl(url))}
        components={{ p: ({children}) => inline ? <Fragment>{children}</Fragment> : <p>{children}</p>, img:({alt}) => <span>{alt ?? "이미지"}</span>,
            a:({href,children}) => { const action = /^(profile|position):\/\/(.+)$/.exec(href ?? ""); const document = /^popup:(.+)$/.exec(href ?? "");
                if (action) return panel || !onAction ? <strong>{children}</strong> : <button type="button" className="prism-rich-action" onClick={() => onAction(action[1] as "profile" | "position",action[2])}>{children}</button>;
                if (document) return onAction && safeUrl(document[1]) ? <button type="button" className="prism-rich-action" onClick={() => onAction("document",document[1])}>{children}</button> : <span>{children}</span>;
                return <a href={safeUrl(href ?? "") || undefined} target="_blank" rel="noopener noreferrer">{children}</a>; },
            table:({children}) => <div className="prism-response-table-scroll" role="region" aria-label="답변 표" tabIndex={0}><table>{children}</table></div>,
        }}>{formatTags(source)}</ReactMarkdown></div>;
}
