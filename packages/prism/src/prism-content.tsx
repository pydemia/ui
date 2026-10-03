import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LoaderCircle, CheckCircle2 } from "lucide-react";

export function PrismMarkdown({ source }: { source: string }) {
    return <div className="prism-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml
        components={{ img: ({ alt }) => <span className="prism-help">{alt || "이미지"}</span>,
            a: ({ href, children }) => <a href={href} rel="noreferrer">{children}</a>,
            table: ({ children }) => <div className="prism-markdown-table" tabIndex={0} role="region" aria-label="답변 표"><table>{children}</table></div>,
        }}>{source}</ReactMarkdown></div>;
}
export function PrismSuggestions({ title, options, selected, onSelect, disabled }: { title: string; options: readonly { id: string; label: string }[];
    selected?: string; onSelect: (id: string) => void; disabled?: boolean }) {
    return <section className="prism-suggestions"><p>{title}</p><div>{options.map(option => <button key={option.id} type="button"
        aria-pressed={selected === option.id} disabled={disabled || selected === option.id} onClick={() => onSelect(option.id)}>{option.label}</button>)}</div></section>;
}
export function PrismGenerationStatus({ status, children }: { status: "generating" | "complete" | "error"; children: ReactNode }) {
    return <p className="prism-generation" role={status === "error" ? "alert" : "status"} data-status={status}>
        {status === "generating" ? <LoaderCircle aria-hidden="true" className="prism-spin" /> : status === "complete" ? <CheckCircle2 aria-hidden="true" /> : null}{children}</p>;
}
export function PrismPositionCard({ title, company, children, onOpen }: { title: string; company: string; children?: ReactNode; onOpen: () => void }) {
    return <article className="prism-position-card"><header><button type="button" onClick={onOpen}>{title}</button><p>{company}</p></header><div>{children}</div></article>;
}
