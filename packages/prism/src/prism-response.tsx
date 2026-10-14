import { type ReactNode, type ComponentProps } from "react";
import { PrismCriteria, PrismMessage } from "./prism-chat";
import { PrismCandidateCard, type PrismCandidate } from "./prism-candidate";
import { PrismSuggestions, PrismGenerationStatus } from "./prism-content";
import { PrismSixFrame, type PrismFrameColumn } from "./prism-six-frame";
import { PrismProfileAnalysis, type PrismProfileAnalysisProps } from "./prism-assessment";

import { PrismFormattedText } from "./prism-rich-text";
import { PrismPositionRecommendations, createPrismPositionReference, type PrismPositionRecommendationItem, type PrismPositionReference } from "./prism-position-recommendations";

/** Preserves the response module entry point for existing consumers. */
export function PrismRichText(props: ComponentProps<typeof PrismFormattedText>) { return <PrismFormattedText {...props}/>; }
export type PrismResponseBlock = { id: string } & (
    { type:"text"; content:string } | { type:"criteria"; items:readonly string[] } |
    { type:"candidates"; candidates:readonly PrismCandidate[] } |
    { type:"positions"; positions:readonly PrismPositionRecommendationItem[] } |
    { type:"six-frame"; title:string; columns:readonly PrismFrameColumn[] } |
    { type:"table"; title:string; columns:readonly string[]; rows:readonly { id:string; cells:readonly (string | number | null)[] }[] } |
    { type:"options"; title:string; options:readonly { id:string; label:string }[]; selected?:string } |
    { type:"list"; ordered?:boolean; items:readonly string[] } |
    { type:"quote" | "code"; content:string } | { type:"callout"; tone:"gray" | "red" | "yellow" | "green" | "blue"; content:string } |
    ({ type:"analysis"; candidate:PrismCandidate } & Pick<PrismProfileAnalysisProps,"leader" | "factors">)
);
/** Keep the source conversation's text-plus-following-block rhythm without merging block identities. */
function groupResponseBlocks(blocks: readonly PrismResponseBlock[]): PrismResponseBlock[][] {
    const groups: PrismResponseBlock[][] = [];
    for (let index = 0; index < blocks.length; index++) {
        const block = blocks[index], next = blocks[index + 1];
        if (block.type === "text" && next && next.type !== "text") {
            groups.push([block, next]);
            index++;
        } else groups.push([block]);
    }
    return groups;
}
export function PrismResponse({ blocks, panel = false, status = "complete", onCandidateOpen, onPositionOpen, onOptionSelect, onAction, selectedPositionId, selectedPositionReference }: {
    blocks:readonly PrismResponseBlock[]; panel?:boolean; status?:"generating" | "complete" | "error";
    onCandidateOpen?: (candidate:PrismCandidate) => void; onPositionOpen?: (id:string, reference:PrismPositionReference) => void; onOptionSelect?: (id:string) => void;
    selectedPositionId?: string; selectedPositionReference?: PrismPositionReference | null;
    /** Position links include a versionless live reference; other actions retain their two arguments. */
    onAction?: (kind:"profile" | "position" | "document",id:string, reference?:PrismPositionReference) => void;
}) {
    const richAction = onAction ? (kind:"profile" | "position" | "document",id:string) => {
        if (kind === "position") onAction(kind,id,createPrismPositionReference({id},"link")); else onAction(kind,id);
    } : undefined;
    const rich = (content:string) => <PrismRichText source={content} panel={panel} onAction={richAction} />;
    const render = (block:PrismResponseBlock):ReactNode => {
        switch(block.type) {
            case "text": return rich(block.content);
            case "criteria": return <PrismCriteria items={block.items} />;
            case "candidates": return <div className="prism-response-candidates">{block.candidates.map(c => <PrismCandidateCard candidate={c} key={c.id} panel={panel} variant={block.candidates.length >= 3 ? "grid" : block.candidates.length === 2 ? "pair" : "stack"} onOpen={onCandidateOpen ?? (() => {})} showDetails={!!onCandidateOpen} />)}</div>;
            case "positions": return <PrismPositionRecommendations items={block.positions} selectedId={selectedPositionId} selectedReference={selectedPositionReference} onSelect={onPositionOpen ? (item,reference) => onPositionOpen(item.id,reference) : undefined}/>;
            case "six-frame": return <PrismSixFrame title={block.title} columns={block.columns} panel={panel} onAction={richAction} />;
            case "table": return <section className="prism-response-table"><h3>{block.title}</h3><div className="prism-response-table-scroll" data-sticky={block.columns.length >= (panel ? 3 : 5) || undefined} role="region" aria-label={block.title || "답변 표"} tabIndex={0}><table><caption className="prism-sr-only">{block.title}</caption><thead><tr>{block.columns.map((c,i) => <th scope="col" key={i}><PrismRichText source={c} inline panel={panel} onAction={richAction} /></th>)}</tr></thead>
                <tbody>{block.rows.map(row => <tr key={row.id}>{block.columns.map((_,i) => <td key={i}><PrismRichText source={String(row.cells[i] ?? "정보 없음")} inline panel={panel} onAction={richAction} /></td>)}</tr>)}</tbody></table></div></section>;
            case "options": return <PrismSuggestions title={block.title} options={block.options} selected={block.selected} disabled={!onOptionSelect} onSelect={onOptionSelect ?? (() => {})} />;
            case "list": { const List = block.ordered ? "ol" : "ul"; return <List>{block.items.map((item,i) => <li key={i}>{rich(item)}</li>)}</List>; }
            case "quote": return <blockquote>{rich(block.content)}</blockquote>;
            case "code": return <pre><code>{block.content}</code></pre>;
            case "callout": return <aside className="prism-response-callout" data-tone={block.tone}>{rich(block.content)}</aside>;
            case "analysis": return <PrismCandidateCard candidate={block.candidate} panel={panel} onOpen={onCandidateOpen ?? (()=>{})}><PrismProfileAnalysis leader={block.leader} factors={block.factors} panel={panel} onAction={richAction}/></PrismCandidateCard>;
        }
    };
    return <div className="prism-response" data-panel={panel || undefined} aria-busy={status === "generating"}>
        <div className="prism-response-blocks">{groupResponseBlocks(blocks).map(group => <div className="prism-response-group" data-paired={group.length === 2 || undefined} key={group[0].id}>
            {group.map(block => <div className="prism-response-block" key={block.id}>{render(block)}</div>)}
        </div>)}</div>
        <PrismGenerationStatus status={status}>{status === "complete" ? "답변 완료" : status === "generating" ? "답변 생성 중" : "답변을 표시하지 못했습니다."}</PrismGenerationStatus>
    </div>;
}
export function PrismConversation({ messages }: { messages:readonly { id:string; role:"user" | "assistant"; content:ReactNode; status?:"complete" | "generating" | "error" }[] }) {
    return <div className="prism-conversation" role="log" aria-label="대화 내용" aria-live="polite">{messages.map(message => <PrismMessage key={message.id} role={message.role} status={message.status}>{message.content}</PrismMessage>)}</div>;
}
