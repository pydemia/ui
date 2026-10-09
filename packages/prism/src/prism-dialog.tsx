import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@pydemia/ui";
import { PrismIcon } from "./prism-icon";
import { PrismButton } from "./prism-button";

function useReturnFocus(trigger: ReactNode, open: boolean | undefined) {
    const previous=useRef<HTMLElement|null>(null);
    useLayoutEffect(()=>{if(open&&!trigger)previous.current=document.activeElement instanceof HTMLElement ? document.activeElement : null;},[open,trigger]);
    return {onOpenAutoFocus:()=>{if(!previous.current)previous.current=document.activeElement instanceof HTMLElement ? document.activeElement : null;},
        onCloseAutoFocus:(event:Event)=>{if(!trigger&&previous.current?.isConnected){event.preventDefault();previous.current.focus();}}};
}

export type PrismDialogProps = { title: string; description: string; children: ReactNode; trigger?: ReactNode;
    footer?: ReactNode; open?: boolean; onOpenChange?: (open: boolean) => void; className?: string; width?: number; style?: CSSProperties };
export function PrismDialog({ title, description, children, trigger, footer, open, onOpenChange, className, width = 620, style }: PrismDialogProps) {
    const returnFocus=useReturnFocus(trigger,open);
    if(!Number.isFinite(width)||width<=0)throw new RangeError("Dialog width must be positive.");
    return <Dialog open={open} onOpenChange={onOpenChange}>
        {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent {...returnFocus} data-prism="light" style={{"--prism-dialog-width":`${width}px`,...style} as CSSProperties} className={`prism-dialog ${className ?? ""}`}>
            <header><DialogTitle title={title}>{title}</DialogTitle><DialogClose asChild><button type="button" className="prism-dialog-close" aria-label="닫기"><PrismIcon name="ModalCloseIcon" size={24}/></button></DialogClose></header>
            <div className="prism-dialog-body"><DialogDescription>{description}</DialogDescription>{children}</div>
            {footer && <footer>{footer}</footer>}
        </DialogContent></Dialog>;
}

export type PrismConfirmDialogProps={open:boolean;onOpenChange:(open:boolean)=>void;title?:string;content?:ReactNode;type?:"success"|"error";
    showIcon?:boolean;showCancel?:boolean;cancelLabel?:string;confirmLabel?:string;contentMinHeight?:number;confirmTone?:"primary"|"danger";
    busy?:boolean;error?:string;onConfirm:()=>void;onCancel?:()=>void;trigger?:ReactNode;};
export function PrismConfirmDialog({open,onOpenChange,title,content,type="success",showIcon=true,showCancel=true,cancelLabel="취소",confirmLabel="확인",contentMinHeight,confirmTone="primary",busy,error,onConfirm,onCancel,trigger}:PrismConfirmDialogProps) {
    const returnFocus=useReturnFocus(trigger,open);
    const cancel=()=>{if(busy)return;onCancel?.();onOpenChange(false);};
    return <Dialog open={open} onOpenChange={next=>{if(!next)cancel();else onOpenChange(true);}}>{trigger&&<DialogTrigger asChild>{trigger}</DialogTrigger>}
        <DialogContent {...returnFocus} data-prism="light" className="prism-dialog prism-confirm-dialog" data-no-title={!title||undefined} style={{"--prism-dialog-width":"440px"} as CSSProperties} onEscapeKeyDown={e=>{if(busy)e.preventDefault();}} onPointerDownOutside={e=>{if(busy)e.preventDefault();}}>
            <header><DialogTitle className={!title ? "prism-sr-only" : undefined}>{title ? <>{showIcon&&<PrismIcon name={type==="error" ? "WarningPopupIcon" : "CheckPopupIcon"} size={24}/>}<span>{title}</span></> : confirmLabel}</DialogTitle><button type="button" className="prism-dialog-close" aria-label="닫기" onClick={cancel} disabled={busy}><PrismIcon name="CloseIcon" size={24}/></button></header>
            <div className="prism-dialog-body" style={contentMinHeight===undefined ? undefined : {minHeight:contentMinHeight}}><DialogDescription asChild><div>{content}</div></DialogDescription>{error&&<p className="prism-error" role="alert">{error}</p>}</div>
            <footer>{showCancel&&<PrismButton variant="line" disabled={busy} onClick={cancel}>{cancelLabel}</PrismButton>}<PrismButton tone={confirmTone} disabled={busy} onClick={onConfirm}>{busy ? "처리 중" : confirmLabel}</PrismButton></footer>
        </DialogContent></Dialog>;
}
