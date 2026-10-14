import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { RefreshCw } from "lucide-react";
import { PrismFileTextGlyph as FileText, PrismIcon } from "./prism-icon";
import { PrismTooltip } from "./prism-utility";
import { PrismButton } from "./prism-button";
import { PrismSkeleton } from "./prism-primitives";

export function PrismAdminLayout({ title, description, actions, filters, toolbar, children, pagination, className = "", breadcrumbs, onBack }: {
    title: string; description?: string; actions?: ReactNode; filters?: ReactNode; toolbar?: ReactNode; children: ReactNode; pagination?: ReactNode; className?: string; breadcrumbs?: readonly string[]; onBack?: () => void;
}) {
    return <section className={`prism-admin ${className}`}><header className="prism-admin-header"><div className="prism-admin-heading">{breadcrumbs&&<nav className="prism-admin-breadcrumb" aria-label="현재 위치">{breadcrumbs.map((crumb,index)=><span key={index}>{crumb}</span>)}</nav>}<div className="prism-admin-title-row">{onBack&&<button type="button" className="prism-admin-back" aria-label="이전 페이지" onClick={onBack}><PrismIcon name="ChevronLeftIcon" size={20}/></button>}<h1>{title}</h1></div>{description && <p>{description}</p>}</div>{actions}</header>
        <div className="prism-admin-body">{filters && <div className="prism-admin-filters">{filters}</div>}{toolbar && <div className="prism-admin-toolbar">{toolbar}</div>}
            <div className="prism-admin-content">{children}</div>{pagination}</div></section>;
}
export function PrismAdminFilterBar({ children, onReset, onSearch, busy = false }: { children: ReactNode; onReset?: () => void; onSearch?: () => void; busy?: boolean }) {
    return <div className="prism-admin-filter-bar"><div className="prism-admin-filter-fields">{children}</div>{(onReset || onSearch) && <div className="prism-admin-filter-actions">
        {onReset && <PrismButton type="button" variant="line" disabled={busy} onClick={onReset}>초기화</PrismButton>}
        {onSearch && <PrismButton type="button" disabled={busy} onClick={onSearch}>조회</PrismButton>}
    </div>}</div>;
}
export type PrismAdminToolbarAction = { label: string; onClick: () => void };
export function PrismAdminTableToolbar({ total, selectedCount, actions, children, busy = false }: { total: number; selectedCount?: number; actions?: readonly PrismAdminToolbarAction[]; children?: ReactNode; busy?: boolean }) {
    return <div className="prism-admin-table-toolbar"><div className="prism-admin-table-summary"><span>총 {total}건</span>{selectedCount != null && <><span aria-hidden="true">·</span><span>선택 {selectedCount}건</span>{actions?.map(action => <PrismButton key={action.label} type="button" variant="line" disabled={busy || selectedCount === 0} onClick={action.onClick}>{action.label}</PrismButton>)}</>}</div>{children}</div>;
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
export type PrismAdminSyncStatus = "editing" | "scheduled" | "running" | "synced" | "failed";
const adminSyncLabels: Record<PrismAdminSyncStatus, string> = { editing: "편집 중", scheduled: "동기화 예정", running: "동기화 진행 중", synced: "동기화 완료", failed: "동기화 실패" };
export function PrismAdminSyncStatusBar({ status, date, onSync, onCancelSync, loading = false, syncDisabled = false, note }: {
    status: PrismAdminSyncStatus; date: string; onSync?: () => void; onCancelSync?: () => void; loading?: boolean; syncDisabled?: boolean; note?: string;
}) {
    const canAct = !!(onSync || onCancelSync);
    const messages: Record<PrismAdminSyncStatus, string> = {
        editing: `현재 후보 추천에 반영되지 않은 편집 버전입니다. 후보 추천에 반영하려면 ${canAct ? "" : "포지션 관리에서 "}동기화를 진행해 주세요. (최종 수정 일자 : ${date})`,
        scheduled: `동기화 예정인 버전입니다. 수정이 필요한 경우 동기화를 취소한 후 편집해 주세요. (동기화 예정 일자 : ${date})`,
        running: `동기화가 진행 중입니다. 반영이 완료될 때까지 기다려 주세요. (동기화 예정 일자 : ${date})`,
        synced: `현재 후보자 추천에 반영 중인 버전입니다. (반영 일자 : ${date})`,
        failed: `동기화에 실패하여 변경사항이 후보 추천에 반영되지 않았습니다. 다시 동기화해 주세요. (동기화 실패 일자 : ${date})`,
    };
    return <div className="prism-position-sync prism-admin-sync" aria-busy={loading || undefined}><div className="prism-position-sync-info">{loading ? <><PrismSkeleton width={80} height={20}/><PrismSkeleton width="60%" height={18}/></> : <>
        <span className="prism-position-sync-label" data-status={status}><i aria-hidden="true"/>{adminSyncLabels[status]}</span><p role={status === "failed" ? "alert" : "status"}>{messages[status]}{note&&<><br/>{note}</>}</p></>}</div>
        {!loading && canAct && (status === "scheduled" ? <PrismButton type="button" variant="line" size="small" disabled={syncDisabled || !onCancelSync} onClick={onCancelSync}>동기화 취소</PrismButton> : <PrismButton type="button" size="small" disabled={syncDisabled || !onSync || status === "running" || status === "synced"} onClick={onSync}>동기화</PrismButton>)}</div>;
}
export function PrismTruncatedText({ text, maxLength = 60 }: { text: string; maxLength?: number }) {
    const ref=useRef<HTMLSpanElement>(null); const [truncated,setTruncated]=useState(false);
    useLayoutEffect(() => {
        const node=ref.current; if(!node) return;
        let active=true;
        const measure=()=>{if(active)setTruncated(node.scrollWidth>node.clientWidth+1);};
        measure();
        const observer=new ResizeObserver(measure); observer.observe(node);
        const frame=requestAnimationFrame(measure);
        window.addEventListener("resize",measure);
        document.fonts?.addEventListener("loadingdone",measure);
        void document.fonts?.ready.then(measure);
        return ()=>{active=false;cancelAnimationFrame(frame);observer.disconnect();window.removeEventListener("resize",measure);document.fonts?.removeEventListener("loadingdone",measure);};
    },[text,maxLength]);
    const showTooltip=truncated||text.length>maxLength;
    const content=<span ref={ref} className="prism-truncated" style={{maxWidth:`${maxLength}ch`}} tabIndex={showTooltip ? 0 : undefined} title={showTooltip ? undefined : text}>{text}</span>;
    return showTooltip ? <PrismTooltip content={text}>{content}</PrismTooltip> : content;
}
