import { useId, useRef, useEffect } from "react";
import { PrismArrowLeftGlyph as ArrowLeft, PrismArrowDownUpGlyph as ArrowDownUp, PrismChevronLeftGlyph as ChevronLeft, PrismChevronRightGlyph as ChevronRight, PrismXGlyph as X } from "./prism-icon";
import { PrismDialog } from "./prism-dialog";
import { PrismButton } from "./prism-button";
import { PrismChip } from "./prism-badge";
import { PrismAttachmentList, type PrismAttachment } from "./prism-admin";
import { PrismSelect } from "./prism-field";
import { PrismEmptyState, PrismRequestState } from "./prism-feedback";

export type PrismNotice = { id: string; title: string; date: string; author: string; content: string; attachments?: readonly PrismAttachment[] };
export type PrismNoticeListItem = Pick<PrismNotice, "id" | "title" | "date" | "author"> & { createdAt?: string };
export function PrismNoticeDetail({ notice, onDownload }: { notice: PrismNotice; onDownload?: (id: string) => void }) {
    return <article className="prism-notice-detail"><header><small>{notice.date}</small><h3>{notice.title}</h3></header><dl><div><dt>작성자</dt><dd>{notice.author}</dd></div></dl><hr /><p>{notice.content}</p>{notice.attachments?.length ? <><hr /><PrismAttachmentList files={notice.attachments} onDownload={onDownload ? file => onDownload(file.id) : undefined} /></> : null}</article>;
}
export function PrismNoticeDialog({ open, onOpenChange, items, total, selectedId, onSelect, detail, detailStatus = "ready", onDetailRetry, order = "latest", onOrderChange, status = "ready", onRetry, onDownload }: {
    open: boolean; onOpenChange: (open: boolean) => void; items: readonly PrismNoticeListItem[]; total?: number; selectedId: string | null; onSelect: (id: string | null) => void;
    detail?: PrismNotice | null; detailStatus?: "ready" | "loading" | "error"; onDetailRetry?: () => void;
    order?: "latest" | "oldest"; onOrderChange?: (order: "latest" | "oldest") => void; status?: "ready" | "loading" | "error"; onRetry?: () => void; onDownload?: (id: string) => void;
}) {
    const fallback = items.find(i => i.id === selectedId);
    const selected = detail === undefined ? fallback && "content" in fallback ? fallback as PrismNotice : null : detail?.id === selectedId ? detail : null;
    const ordered = [...items].sort((a, b) => {
        const date = (item: PrismNoticeListItem) => Date.parse((item.createdAt ?? item.date).replace(/^(\d{4})\.(\d{2})\.(\d{2})/, "$1-$2-$3"));
        const aDate = date(a), bDate = date(b);
        return Number.isFinite(aDate) && Number.isFinite(bDate) ? aDate - bDate : 0;
    });
    if (order === "latest") ordered.reverse();
    const goList = () => onSelect(null);
    return <PrismDialog className={`prism-notice-dialog prism-notice-dialog--${selectedId ? "detail" : "list"}`} title={selectedId ? "공지사항 상세" : "공지사항"}
        titlePrefix={selectedId ? <button type="button" className="prism-notice-back" aria-label="목록으로" onClick={goList}><ChevronLeft /></button> : undefined}
        description="공지사항을 조회하고 첨부파일을 확인합니다." open={open} onOpenChange={onOpenChange}
        footer={<><PrismButton variant="line" onClick={() => onOpenChange(false)}>닫기</PrismButton>{selectedId && <PrismButton variant="line" onClick={goList}>목록으로</PrismButton>}</>}>
        {selectedId ? detailStatus === "loading" ? <div className="prism-notice-detail-skeleton" aria-label="공지사항 상세 불러오는 중"><span /><span /><span /><span /><span /></div>
            : detailStatus === "error" || !selected ? <div className="prism-notice-detail-state"><PrismEmptyState variant="tab" title="공지사항을 불러오지 못했습니다" description="잠시 후 다시 시도해 주세요." action={onDetailRetry && <PrismButton variant="line" onClick={onDetailRetry}>다시 시도</PrismButton>} /></div>
            : <PrismNoticeDetail notice={selected} onDownload={onDownload} />
            : <div className="prism-notice-list"><header><span>Total {status === "loading" ? 0 : total ?? items.length}</span>{onOrderChange && <PrismButton variant="line" size="small" icon={<ArrowDownUp />} iconPosition="right" disabled={status === "loading"} onClick={() => onOrderChange(order === "latest" ? "oldest" : "latest")}>{order === "latest" ? "등록 최신순" : "등록 오래된 순"}</PrismButton>}</header>
                <div className="prism-notice-list-body">{status === "error" ? <PrismRequestState status="error" onRetry={onRetry} /> : status === "ready" && items.length === 0 ? <PrismEmptyState variant="tab" title="등록된 공지사항이 없습니다" /> : <table><caption className="prism-sr-only">공지사항 목록</caption><colgroup><col /><col /><col /></colgroup><tbody>{status === "loading" ? Array.from({ length: 6 }, (_, row) => <tr key={row} className="prism-notice-skeleton-row" aria-hidden="true"><td><span /></td><td><span /></td><td><span /></td></tr>) : ordered.map(item => <tr key={item.id}><td><button type="button" onClick={() => onSelect(item.id)}>{item.title}</button></td><td>{item.author}</td><td>{item.date}</td></tr>)}</tbody></table>}</div></div>}
    </PrismDialog>;
}
export function PrismNoticePopup({ open, notices, index, onIndexChange, onClose }: { open: boolean; notices: readonly PrismNotice[]; index: number; onIndexChange: (index: number) => void; onClose: () => void }) {
    const id = useId(); const item = notices[index]; if (!open || !item) return null;
    return <section data-prism="light" className="prism-notice-popup" role="dialog" aria-labelledby={id} onKeyDown={e => { if (e.key === "Escape") { e.stopPropagation(); onClose(); } }}>
        <header><span id={id} className="prism-sr-only">공지사항</span><PrismButton variant="shape" iconOnly aria-label="공지 팝업 닫기" icon={<X />} onClick={onClose} /></header><div><PrismNoticeDetail notice={item} /></div>
        <footer><PrismButton variant="shape" iconOnly aria-label="이전 공지" icon={<ChevronLeft />} onClick={() => onIndexChange((index-1+notices.length)%notices.length)} /><span>{index+1}/{notices.length}</span>
            <PrismButton variant="shape" iconOnly aria-label="다음 공지" icon={<ChevronRight />} onClick={() => onIndexChange((index+1)%notices.length)} /></footer></section>;
}
export type PrismInquiry = { id: string; title: string; date: string; status: string; content: string; answer: string | null; attachments?: readonly PrismAttachment[] };
export function PrismInquiryHistory({ items, selectedId, onSelect }: { items: readonly PrismInquiry[]; selectedId: string | null; onSelect: (id: string | null) => void }) {
    const selected = items.find(i => i.id === selectedId);
    return selected ? <div className="prism-inquiry-detail"><PrismButton variant="line" icon={<ArrowLeft />} onClick={() => onSelect(null)}>목록으로</PrismButton><PrismNoticeDetail notice={{...selected,author:"문의자"}} /><PrismChip>{selected.status}</PrismChip><section><h3>답변</h3><p>{selected.answer ?? "답변 대기 중입니다."}</p></section></div> :
        <div className="prism-notice-list"><table><caption className="prism-sr-only">문의 내역</caption><tbody>{items.length ? items.map(item => <tr key={item.id}><td><PrismChip>{item.status}</PrismChip></td><td><button type="button" onClick={() => onSelect(item.id)}>{item.title}</button></td><td>{item.date}</td></tr>) : <tr><td colSpan={3}>등록된 문의가 없습니다.</td></tr>}</tbody></table></div>;
}
export type PrismPolicyViewerProps = { versions: readonly { id: string; label: string }[]; value: string; onValueChange: (value: string) => void; documentHtml: string; loading?: boolean };
export function PrismPolicyViewer({ versions, value, onValueChange, documentHtml, loading = false }: PrismPolicyViewerProps) {
    const frame = useRef<HTMLIFrameElement>(null); const observer = useRef<ResizeObserver | null>(null);
    useEffect(() => () => observer.current?.disconnect(), []);
    const measure = () => {
        observer.current?.disconnect();
        const element = frame.current; const doc = element?.contentDocument;
        if (!element || !doc) return;
        const guard = doc.createElement("style"); guard.textContent = "html{overflow:hidden}"; doc.head.appendChild(guard);
        const update = () => {
            element.style.height = "0px";
            element.style.minWidth = "0px";
            const width = doc.documentElement.scrollWidth;
            element.style.minWidth = width > element.clientWidth ? `${width}px` : "";
            element.style.height = `${doc.documentElement.scrollHeight}px`;
        };
        update();
        observer.current = new ResizeObserver(update);
        observer.current.observe(doc.documentElement);
    };
    return <div className="prism-policy">
        {versions.length > 0 && <div className="prism-policy-version"><PrismSelect label="방침 버전" value={value} onChange={e => onValueChange(e.target.value)}>{versions.map(v => <option value={v.id} key={v.id}>{v.label}</option>)}</PrismSelect></div>}
        {documentHtml ? <iframe ref={frame} title="개인정보처리방침" srcDoc={documentHtml} sandbox="allow-same-origin allow-popups allow-popups-to-escape-sandbox" onLoad={measure} style={{height:0,opacity:loading ? .5 : 1}} aria-busy={loading} />
            : loading ? <div className="prism-policy-skeleton" aria-label="개인정보처리방침 불러오는 중"><span />{Array.from({length:22},(_,index)=><span key={index} />)}</div>
            : <div className="prism-policy-empty"><PrismEmptyState variant="tab" title="개인정보처리방침을 불러오지 못했습니다" description="잠시 후 다시 시도해 주세요" /></div>}
    </div>;
}
export function PrismPrivacyPolicyDialog({ open, onOpenChange, ...viewerProps }: PrismPolicyViewerProps & { open: boolean; onOpenChange: (open: boolean) => void }) {
    return <PrismDialog className="prism-policy-dialog" title="개인정보처리방침" description="버전별 개인정보처리방침 문서를 확인합니다." open={open} onOpenChange={onOpenChange}
        footer={<PrismButton onClick={() => onOpenChange(false)}>닫기</PrismButton>}><PrismPolicyViewer {...viewerProps} /></PrismDialog>;
}
