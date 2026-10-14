import { Fragment, useState, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LoaderCircle, CheckCircle2, Info } from "lucide-react";

export function PrismMarkdown({ source }: { source: string }) {
    return <div className="prism-markdown"><ReactMarkdown remarkPlugins={[remarkGfm]} skipHtml
        components={{ img: ({ alt }) => <span className="prism-help">{alt || "이미지"}</span>,
            a: ({ href, children }) => <a href={href} rel="noreferrer">{children}</a>,
            table: ({ children }) => <div className="prism-markdown-table" tabIndex={0} role="region" aria-label="답변 표"><table>{children}</table></div>,
        }}>{source}</ReactMarkdown></div>;
}
function renderSuggestionText(value: string) {
    return value.split("\n").map((line, lineIndex) => <Fragment key={lineIndex}>
        {lineIndex > 0 && <br />}
        {line.split(/(\*\*[^*]+\*\*)/g).map((part, partIndex) => part.startsWith("**") && part.endsWith("**")
            ? <strong key={partIndex}>{part.slice(2, -2)}</strong> : <Fragment key={partIndex}>{part}</Fragment>)}
    </Fragment>);
}
export function PrismSuggestions({ title, options, selected, onSelect, disabled = false, noLockOnSelect = false, panel = false }: {
    title: string; options: readonly { id: string; label: string }[]; selected?: string | null;
    onSelect: (id: string) => void; disabled?: boolean; noLockOnSelect?: boolean; panel?: boolean;
}) {
    const [localSelected, setLocalSelected] = useState<string | null>(null);
    const hasHistoricalSelection = typeof selected === "string" && selected.length > 0;
    const effectiveSelected = hasHistoricalSelection ? selected : localSelected;
    const locked = hasHistoricalSelection || (!noLockOnSelect && localSelected != null);
    return <section className="prism-suggestions" data-panel={panel || undefined}><p>{renderSuggestionText(title)}</p><div>{options.map(option => {
        const isSelected = effectiveSelected === option.id || effectiveSelected === option.label;
        return <button key={option.id} type="button" aria-pressed={isSelected} aria-disabled={locked && isSelected || undefined}
            disabled={disabled || locked && !isSelected}
            onClick={() => { if (disabled || locked) return; if (!noLockOnSelect) setLocalSelected(option.id); onSelect(option.id); }}>{renderSuggestionText(option.label)}</button>;
    })}</div></section>;
}
export type PrismGenerationStep = "analyzing" | "fetching" | "generating" | "stopped" | "complete" | "error";
const generationCopy = {
    analyzing: { label: "요청 분석 단계", text: "요청을 분석하고 있습니다" },
    fetching: { label: "관련 자료 조회 단계", text: "관련 자료를 조회하고 있습니다" },
    generating: { label: "답변 생성 단계", text: "답변을 생성하고 있습니다" },
    stopped: { label: "", text: "답변 생성이 중단되었습니다" },
    complete: { label: "", text: "답변 완료" },
    error: { label: "", text: "답변을 표시하지 못했습니다" },
} satisfies Record<PrismGenerationStep, { label: string; text: string }>;
export function PrismGenerationStatus({ status, children, showLabel = false, onStop }: {
    status: PrismGenerationStep; children?: ReactNode; showLabel?: boolean; onStop?: () => void;
}) {
    const active = status === "analyzing" || status === "fetching" || status === "generating";
    return <div className="prism-generation" role={status === "error" ? "alert" : "status"} data-status={status}>
        {active && showLabel && <p className="prism-generation-label">{generationCopy[status].label}</p>}
        <div className="prism-generation-row">
            {active ? <LoaderCircle aria-hidden="true" className="prism-spin" /> : status === "complete" ? <CheckCircle2 aria-hidden="true" /> : status === "stopped" ? <Info aria-hidden="true" /> : null}
            <span>{children ?? generationCopy[status].text}</span>
            {active && onStop && <button type="button" onClick={onStop} aria-label="답변 생성 중단"><Info aria-hidden="true" />중단</button>}
        </div>
    </div>;
}
export function PrismPositionCard({ title, company, children, onOpen }: { title: string; company: string; children?: ReactNode; onOpen: () => void }) {
    return <article className="prism-position-card"><header><button type="button" onClick={onOpen}>{title}</button><p>{company}</p></header><div>{children}</div></article>;
}
