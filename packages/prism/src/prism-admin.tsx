import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { RefreshCw } from "lucide-react";
import { PrismFileTextGlyph as FileText } from "./prism-icon";
import { PrismTooltip } from "./prism-utility";
import { PrismButton } from "./prism-button";

export function PrismAdminLayout({ title, description, actions, filters, toolbar, children, pagination }: {
    title: string; description?: string; actions?: ReactNode; filters?: ReactNode; toolbar?: ReactNode; children: ReactNode; pagination?: ReactNode;
}) {
    return <section className="prism-admin"><header className="prism-admin-header"><div><h1>{title}</h1>{description && <p>{description}</p>}</div>{actions}</header>
        <div className="prism-admin-body">{filters && <div className="prism-admin-filters">{filters}</div>}{toolbar && <div className="prism-admin-toolbar">{toolbar}</div>}
            <div className="prism-admin-content">{children}</div>{pagination}</div></section>;
}
export type PrismAttachment = { id: string; name: string; href?: string; sizeLabel?: string; status?: "ready" | "uploading" | "error"; error?: string };
export function PrismAttachmentList({ files, onRemove, onDownload }: { files: readonly PrismAttachment[]; onRemove?: (id: string) => void; onDownload?: (file: PrismAttachment) => void }) {
    return <ul className="prism-attachments">{files.length ? files.map(file => <li key={file.id}><FileText aria-hidden="true" /><div>
        {file.href && /^(https?:\/\/|\/[^/])/.test(file.href) ? <a href={file.href} download>{file.name}</a> : onDownload ? <button type="button" onClick={() => onDownload(file)}>{file.name}</button> : <span>{file.name}</span>}
        {file.sizeLabel && <small>{file.sizeLabel}</small>}{file.status === "uploading" && <span role="status">업로드 중</span>}{file.status === "error" && <p role="alert" className="prism-error">{file.error ?? "첨부하지 못했습니다."}</p>}</div>
        {onRemove && <PrismButton variant="shape" size="small" aria-label={`${file.name} 제거`} onClick={() => onRemove(file.id)}>제거</PrismButton>}</li>) : <li className="prism-help">첨부파일이 없습니다.</li>}</ul>;
}
export function PrismSyncStatus({ status, updatedAt, onRefresh }: { status: "idle" | "syncing" | "error"; updatedAt?: string; onRefresh?: () => void }) {
    return <div className="prism-sync-status"><span role={status === "error" ? "alert" : "status"}>{status === "syncing" ? "동기화 중입니다." : status === "error" ? "동기화에 실패했습니다." : `최근 갱신: ${updatedAt ?? "기록 없음"}`}</span>
        {onRefresh && <PrismButton variant="shape" size="small" icon={<RefreshCw />} disabled={status === "syncing"} onClick={onRefresh}>새로고침</PrismButton>}</div>;
}
export function PrismTruncatedText({ text, maxLength = 60 }: { text: string; maxLength?: number }) {
    const ref=useRef<HTMLSpanElement>(null); const [truncated,setTruncated]=useState(false);
    useLayoutEffect(() => {const node=ref.current;if(!node)return;const measure=()=>setTruncated(node.scrollWidth>node.clientWidth);measure();const observer=new ResizeObserver(measure);observer.observe(node);return ()=>observer.disconnect();},[text,maxLength]);
    const content=<span ref={ref} className="prism-truncated" style={{maxWidth:`${maxLength}ch`}} tabIndex={truncated ? 0 : undefined}>{text}</span>;
    return truncated ? <PrismTooltip content={text}>{content}</PrismTooltip> : content;
}
