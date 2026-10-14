import { useId, useRef, type ReactNode } from "react";
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription, DrawerClose } from "@pydemia/ui";
import { PrismXGlyph as X } from "./prism-icon";
import { PrismAvatar } from "./prism-display";

export function PrismSidePanel({ title, description, open, onOpenChange, children }: { title: string; description: string;
    open: boolean; onOpenChange: (open: boolean) => void; children: ReactNode }) {
    const returnFocus = useRef<HTMLElement | null>(null);
    return <Drawer open={open} onOpenChange={onOpenChange}><DrawerContent data-prism="light" className="prism-side-panel"
        onOpenAutoFocus={() => { const active = document.activeElement; returnFocus.current = active instanceof HTMLElement ? active : null; }}
        onCloseAutoFocus={event => { const target = returnFocus.current; returnFocus.current = null; if (target?.isConnected) { event.preventDefault(); target.focus(); } }}>
        <header><DrawerTitle>{title}</DrawerTitle><DrawerClose asChild><button type="button" className="prism-panel-icon-button" aria-label="패널 닫기"><X /></button></DrawerClose></header>
        <div className="prism-side-panel-body"><DrawerDescription className="prism-help">{description}</DrawerDescription>{children}</div>
    </DrawerContent></Drawer>;
}
export function PrismDetailList({ items }: { items: readonly { label: string; value: ReactNode }[] }) {
    return <dl className="prism-detail-list">{items.map((item, index) => <div key={`${item.label}-${index}`}><dt>{item.label}</dt><dd>{item.value ?? "정보 없음"}</dd></div>)}</dl>;
}
/** Previous author-header recipe. Current personal memos use PrismProfileMemoCard. */
export function PrismMemoCard({ author, date, children, actions }: { author: string; date: string; children: ReactNode; actions?: ReactNode }) {
    const id = useId();
    return <article className="prism-memo" aria-labelledby={id}><header><div id={id}><PrismAvatar name={author} description={date} /></div>{actions}</header>
        <div>{children}</div></article>;
}
