import { useId, type ReactNode } from "react";
import { Drawer, DrawerContent, DrawerTitle, DrawerDescription, DrawerClose } from "@pydemia/ui";
import { PrismXGlyph as X } from "./prism-icon";
import { PrismButton } from "./prism-button";
import { PrismAvatar } from "./prism-display";

export function PrismSidePanel({ title, description, open, onOpenChange, children }: { title: string; description: string;
    open: boolean; onOpenChange: (open: boolean) => void; children: ReactNode }) {
    return <Drawer open={open} onOpenChange={onOpenChange}><DrawerContent data-prism="light" className="prism-side-panel">
        <header><DrawerTitle>{title}</DrawerTitle><DrawerClose asChild><PrismButton iconOnly variant="shape" aria-label="패널 닫기" icon={<X />} /></DrawerClose></header>
        <div className="prism-side-panel-body"><DrawerDescription className="prism-help">{description}</DrawerDescription>{children}</div>
    </DrawerContent></Drawer>;
}
export function PrismDetailList({ items }: { items: readonly { label: string; value: ReactNode }[] }) {
    return <dl className="prism-detail-list">{items.map(item => <div key={item.label}><dt>{item.label}</dt><dd>{item.value ?? "정보 없음"}</dd></div>)}</dl>;
}
export function PrismMemoCard({ author, date, children, actions }: { author: string; date: string; children: ReactNode; actions?: ReactNode }) {
    const id = useId();
    return <article className="prism-memo" aria-labelledby={id}><header><div id={id}><PrismAvatar name={author} description={date} /></div>{actions}</header>
        <div>{children}</div></article>;
}
