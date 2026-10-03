import { useId, useRef, useEffect, useState } from "react";
import { PrismArrowLeftGlyph as ArrowLeft, PrismArrowDownUpGlyph as ArrowDownUp, PrismChevronLeftGlyph as ChevronLeft, PrismChevronRightGlyph as ChevronRight, PrismXGlyph as X } from "./prism-icon";
import { PrismDialog } from "./prism-dialog";
import { PrismButton } from "./prism-button";
import { PrismChip } from "./prism-badge";
import { PrismAttachmentList, type PrismAttachment } from "./prism-admin";
import { PrismSelect } from "./prism-field";
import { PrismRequestState } from "./prism-feedback";
import { PrismSkeletonGroup } from "./prism-primitives";

export type PrismNotice = { id: string; title: string; date: string; author: string; content: string; attachments?: readonly PrismAttachment[] };
export function PrismNoticeDetail({ notice, onDownload }: { notice: PrismNotice; onDownload?: (id: string) => void }) {
    return <article className="prism-notice-detail"><header><small>{notice.date}</small><h3>{notice.title}</h3></header><dl><div><dt>작성자</dt><dd>{notice.author}</dd></div></dl><hr /><p>{notice.content}</p>{notice.attachments?.length ? <><hr /><PrismAttachmentList files={notice.attachments} onDownload={onDownload ? file => onDownload(file.id) : undefined} /></> : null}</article>;
}
export function PrismNoticeDialog({ open, onOpenChange, items, selectedId, onSelect, order = "latest", onOrderChange, status = "ready", onRetry, onDownload }: {
    open: boolean; onOpenChange: (open: boolean) => void; items: readonly PrismNotice[]; selectedId: string | null; onSelect: (id: string | null) => void;
    order?: "latest" | "oldest"; onOrderChange?: (order: "latest" | "oldest") => void; status?: "ready" | "loading" | "error"; onRetry?: () => void; onDownload?: (id: string) => void;
}) {
    const selected = items.find(i => i.id === selectedId);
    return <PrismDialog className="prism-notice-dialog" title={selectedId ? "공지사항 상세" : "공지사항"} description="공지사항을 조회하고 첨부파일을 확인합니다." open={open} onOpenChange={onOpenChange}
        footer={<>{selectedId && <PrismButton variant="line" icon={<ArrowLeft />} onClick={() => onSelect(null)}>목록으로</PrismButton>}<PrismButton variant="line" onClick={() => onOpenChange(false)}>닫기</PrismButton></>}>
        {status === "loading" ? <PrismSkeletonGroup rows={8} /> : status === "error" ? <PrismRequestState status="error" onRetry={onRetry} /> : selectedId ? selected ? <PrismNoticeDetail notice={selected} onDownload={onDownload} /> : <PrismRequestState status="empty" /> :
            <div className="prism-notice-list"><header><span>Total {items.length}</span>{onOrderChange && <PrismButton variant="line" size="small" icon={<ArrowDownUp />} iconPosition="right" onClick={() => onOrderChange(order === "latest" ? "oldest" : "latest")}>{order === "latest" ? "등록 최신순" : "등록 오래된 순"}</PrismButton>}</header>
                <table><caption className="prism-sr-only">공지사항 목록</caption><tbody>{items.length ? items.map(item => <tr key={item.id}><td><button type="button" onClick={() => onSelect(item.id)}>{item.title}</button></td><td>{item.author}</td><td>{item.date}</td></tr>) : <tr><td colSpan={3}>등록된 공지사항이 없습니다.</td></tr>}</tbody></table></div>}
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
export function PrismPolicyViewer({ versions, value, onValueChange, documentHtml, loading = false }: { versions: readonly { id: string; label: string }[]; value: string; onValueChange: (value: string) => void; documentHtml: string; loading?: boolean }) {
    const frame = useRef<HTMLIFrameElement>(null); const observer = useRef<ResizeObserver | null>(null); const [height,setHeight] = useState(400);
    useEffect(() => () => observer.current?.disconnect(),[]);
    const measure = () => { observer.current?.disconnect(); const doc = frame.current?.contentDocument; if (!doc) return;
        const update = () => { const body=doc.body; if (!body) return; const style=doc.defaultView?.getComputedStyle(body); const margins=(parseFloat(style?.marginTop??"0")||0)+(parseFloat(style?.marginBottom??"0")||0);
            const next=Math.max(120,Math.ceil(Math.max(body.scrollHeight,body.getBoundingClientRect().height)+margins));setHeight(previous=>previous===next ? previous : next); };
        update(); observer.current = new ResizeObserver(update); observer.current.observe(doc.body ?? doc.documentElement); };
    return <div className="prism-policy"><PrismSelect label="방침 버전" value={value} onChange={e => onValueChange(e.target.value)} disabled={loading}>{versions.map(v => <option value={v.id} key={v.id}>{v.label}</option>)}</PrismSelect>
        {documentHtml ? <iframe ref={frame} title="개인정보처리방침" srcDoc={documentHtml} sandbox="allow-same-origin" onLoad={measure} style={{height,opacity:loading ? .5 : 1}} aria-busy={loading} /> : loading ? <PrismSkeletonGroup rows={12} /> : <PrismRequestState status="empty" />}</div>;
}
