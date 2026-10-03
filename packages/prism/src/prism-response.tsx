import { Fragment, type ReactNode } from "react";
import ReactMarkdown, { defaultUrlTransform } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { PrismCriteria, PrismMessage } from "./prism-chat";
import { PrismCandidateCard, type PrismCandidate } from "./prism-candidate";
import { PrismSuggestions, PrismPositionCard, PrismGenerationStatus } from "./prism-content";
import { PrismSixFrame, type PrismFrameColumn } from "./prism-six-frame";
import { PrismProfileAnalysis } from "./prism-assessment";

const colors = "white|black|gray|red|orange|yellow|green|blue|purple|brown|pink";
const schema = { ...defaultSchema, tagNames:[...(defaultSchema.tagNames ?? []),"mark"], attributes:{...defaultSchema.attributes,
    span:[["className",/^prism-rich-(?:color|highlight|badge|size|bullet|bold|italic|underline|h1|h2)/]], mark:[["className",/^prism-rich-highlight/]],
}, protocols:{...defaultSchema.protocols,href:["http","https","mailto","profile","position","popup"]} };
function formatTags(source: string): string {
    let formatted = source.replace(new RegExp(`<(color|highlight|badge)-(${colors})>`,'g'),(_,kind,color) => `<span class="prism-rich-${kind}-${color}">`)
        .replace(/<\/(color|highlight|badge)>/g,"</span>")
        .replace(/<size-(extra-small|small|normal|large|extra-large)>/g,'<span class="prism-rich-size-$1">').replace(/<\/size>/g,"</span>")
        .replace(/<(bold|italic|underline)>/g,'<span class="prism-rich-$1">').replace(/<\/(bold|italic|underline)>/g,"</span>")
        .replace(/<bullet\s+depth=["']?([1-3])["']?>/g,'<span class="prism-rich-bullet-$1">').replace(/<\/bullet>/g,"</span>");
    return formatted;
}
function safeUrl(url: string): string { return /^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(url) ? url : ""; }
export function PrismRichText({ source, inline = false, panel = false, onAction }: { source: string; inline?: boolean; panel?: boolean; onAction?: (kind: "profile" | "position" | "document", id: string) => void }) {
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
export type PrismResponseBlock = { id: string } & (
    { type:"text"; content:string } | { type:"criteria"; items:readonly string[] } |
    { type:"candidates"; candidates:readonly PrismCandidate[] } |
    { type:"positions"; positions:readonly { id:string; title:string; company:string; reasons:readonly string[] }[] } |
    { type:"six-frame"; title:string; columns:readonly PrismFrameColumn[] } |
    { type:"table"; title:string; columns:readonly string[]; rows:readonly { id:string; cells:readonly (string | number | null)[] }[] } |
    { type:"options"; title:string; options:readonly { id:string; label:string }[]; selected?:string } |
    { type:"list"; ordered?:boolean; items:readonly string[] } |
    { type:"quote" | "code"; content:string } | { type:"callout"; tone:"gray" | "red" | "yellow" | "green" | "blue"; content:string } |
    { type:"analysis"; candidate:PrismCandidate; leader?:{label:string;description?:string}; factors:readonly {id:string;label:string;title?:string;results:readonly string[];summary?:string | null}[] }
);
export function PrismResponse({ blocks, panel = false, status = "complete", onCandidateOpen, onPositionOpen, onOptionSelect, onAction }: {
    blocks:readonly PrismResponseBlock[]; panel?:boolean; status?:"generating" | "complete" | "error";
    onCandidateOpen?: (candidate:PrismCandidate) => void; onPositionOpen?: (id:string) => void; onOptionSelect?: (id:string) => void;
    onAction?: (kind:"profile" | "position" | "document",id:string) => void;
}) {
    const rich = (content:string) => <PrismRichText source={content} panel={panel} onAction={onAction} />;
    const render = (block:PrismResponseBlock):ReactNode => {
        switch(block.type) {
            case "text": return rich(block.content);
            case "criteria": return <PrismCriteria items={block.items} />;
            case "candidates": return <div className="prism-response-candidates">{block.candidates.map(c => <PrismCandidateCard candidate={c} key={c.id} panel={panel} variant={block.candidates.length >= 3 ? "grid" : block.candidates.length === 2 ? "pair" : "stack"} onOpen={onCandidateOpen ?? (() => {})} showDetails={!!onCandidateOpen} />)}</div>;
            case "positions": return <div className="prism-profile-sections">{block.positions.map(p => <PrismPositionCard key={p.id} title={p.title} company={p.company} onOpen={() => onPositionOpen?.(p.id)}><ul>{p.reasons.map((reason,i) => <li key={i}>{rich(reason)}</li>)}</ul></PrismPositionCard>)}</div>;
            case "six-frame": return <PrismSixFrame title={block.title} columns={block.columns} panel={panel} />;
            case "table": return <section className="prism-response-table"><h3>{block.title}</h3><div className="prism-response-table-scroll" data-sticky={block.columns.length >= (panel ? 3 : 5) || undefined} role="region" aria-label={block.title || "답변 표"} tabIndex={0}><table><caption className="prism-sr-only">{block.title}</caption><thead><tr>{block.columns.map((c,i) => <th scope="col" key={i}><PrismRichText source={c} inline panel={panel} onAction={onAction} /></th>)}</tr></thead>
                <tbody>{block.rows.map(row => <tr key={row.id}>{block.columns.map((_,i) => <td key={i}><PrismRichText source={String(row.cells[i] ?? "정보 없음")} inline panel={panel} onAction={onAction} /></td>)}</tr>)}</tbody></table></div></section>;
            case "options": return <PrismSuggestions title={block.title} options={block.options} selected={block.selected} disabled={!onOptionSelect} onSelect={onOptionSelect ?? (() => {})} />;
            case "list": { const List = block.ordered ? "ol" : "ul"; return <List>{block.items.map((item,i) => <li key={i}>{rich(item)}</li>)}</List>; }
            case "quote": return <blockquote>{rich(block.content)}</blockquote>;
            case "code": return <pre><code>{block.content}</code></pre>;
            case "callout": return <aside className="prism-response-callout" data-tone={block.tone}>{rich(block.content)}</aside>;
            case "analysis": return <PrismCandidateCard candidate={block.candidate} panel={panel} onOpen={onCandidateOpen ?? (()=>{})}><PrismProfileAnalysis leader={block.leader} factors={block.factors} /></PrismCandidateCard>;
        }
    };
    return <div className="prism-response" data-panel={panel || undefined} aria-busy={status === "generating"}>{blocks.map(block => <div key={block.id}>{render(block)}</div>)}<PrismGenerationStatus status={status}>{status === "complete" ? "답변 완료" : status === "generating" ? "답변 생성 중" : "답변을 표시하지 못했습니다."}</PrismGenerationStatus></div>;
}
export function PrismConversation({ messages }: { messages:readonly { id:string; role:"user" | "assistant"; content:ReactNode; status?:"complete" | "generating" | "error" }[] }) {
    return <div className="prism-conversation" role="log" aria-label="대화 내용" aria-live="polite">{messages.map(message => <PrismMessage key={message.id} role={message.role} status={message.status}>{message.content}</PrismMessage>)}</div>;
}
