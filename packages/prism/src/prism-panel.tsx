import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type Ref } from "react";
import { PrismIcon } from "./prism-icon";

export type PrismPanelProps = {
    title: ReactNode; open: boolean; onOpenChange: (open: boolean) => void;
    expanded?: boolean; onExpandedChange?: (expanded: boolean) => void;
    children: ReactNode; className?: string; style?: CSSProperties; ariaLabel?: string;
    contentClassName?: string; contentStyle?: CSSProperties; contentRef?: Ref<HTMLDivElement>;
    resizable?: boolean; width?: number; defaultWidth?: number; minWidth?: number; maxWidth?: number;
    onWidthChange?: (width: number) => void; responsive?: boolean;
};
/** Nonmodal, mounted while closed. The caller owns content padding and scrolling. */
export function PrismPanel({ title, open, onOpenChange, expanded = false, onExpandedChange, children,
    className = "", style, ariaLabel, contentClassName = "", contentStyle, contentRef,
    resizable = false, width, defaultWidth = 440, minWidth = 320, maxWidth = 800, onWidthChange, responsive = true }: PrismPanelProps) {
    if([minWidth,maxWidth,defaultWidth,width??defaultWidth].some(value=>!Number.isFinite(value)||value<=0)||minWidth>maxWidth)throw new RangeError("Panel widths must be positive with minWidth <= maxWidth.");
    const id = useId();
    const panel = useRef<HTMLElement>(null);
    const heading = useRef<HTMLDivElement>(null);
    const resetSent = useRef(false);
    const drag = useRef<{pointerId:number;x:number;width:number;preferredWidth:number;handle:HTMLDivElement}|null>(null);
    const [internalWidth,setInternalWidth] = useState(defaultWidth);
    const [containerWidth,setContainerWidth] = useState<number|null>(null);
    const [headerHeight,setHeaderHeight] = useState(64);
    const [dragging,setDragging] = useState(false);
    useLayoutEffect(()=>{const parent=panel.current?.parentElement;if(!parent)return;const measure=()=>{const next=parent.getBoundingClientRect().width;if(next>0)setContainerWidth(next);};measure();const observer=new ResizeObserver(measure);observer.observe(parent);return()=>observer.disconnect();},[]);
    useLayoutEffect(() => {
        const node=heading.current;if(!node||!open)return;
        const measure=()=>{const height=node.getBoundingClientRect().height;setHeaderHeight(height<=24?64:Math.ceil(height)+41);};
        measure();const observer=new ResizeObserver(measure);observer.observe(node);return()=>observer.disconnect();
    },[open]);
    const compact=responsive&&containerWidth!==null&&containerWidth<640;const upper=Math.min(maxWidth,containerWidth??maxWidth);const lower=Math.min(minWidth,upper);
    const currentWidth=Math.max(lower,Math.min(upper,width??internalWidth));
    const changeWidth=(next:number)=>{const clamped=Math.round(Math.max(lower,Math.min(upper,next)));if(width===undefined)setInternalWidth(clamped);if(clamped!==currentWidth)onWidthChange?.(clamped);};
    const cancelDrag=()=>{
        const active=drag.current;if(!active)return;drag.current=null;
        if(width===undefined)setInternalWidth(active.preferredWidth);
        if(active.preferredWidth!==(width??internalWidth))onWidthChange?.(active.preferredWidth);
        setDragging(false);
        if(active.handle.hasPointerCapture(active.pointerId))active.handle.releasePointerCapture(active.pointerId);
    };
    useEffect(()=>{if(!open||expanded||compact||!resizable)cancelDrag();},[open,expanded,compact,resizable]);
    useEffect(()=>{
        if(open||!expanded)resetSent.current=false;
        else if(!resetSent.current&&onExpandedChange){resetSent.current=true;onExpandedChange(false);}
    },[open,expanded,onExpandedChange]);
    const close=()=>{cancelDrag();resetSent.current=true;onExpandedChange?.(false);onOpenChange(false);};
    const panelStyle={"--prism-panel-width":`${currentWidth}px`,"--prism-panel-header-height":`${headerHeight}px`,...style} as CSSProperties;
    return <><div className="prism-panel-placeholder" style={{"--prism-panel-width":`${currentWidth}px`} as CSSProperties} data-open={open || undefined} data-compact={compact||undefined} aria-hidden="true" />
        <aside ref={panel} id={`${id}-panel`} style={panelStyle} className={`prism-panel ${className}`} inert={!open} aria-hidden={!open||undefined}
            aria-label={ariaLabel} aria-labelledby={ariaLabel?undefined:id} data-open={open||undefined} data-expanded={open&&expanded||undefined} data-compact={compact||undefined} data-resizable={resizable&&!expanded&&!compact||undefined} data-resizing={dragging||undefined}
            onKeyDown={e => { if (e.key === "Escape" && !e.defaultPrevented) { e.stopPropagation(); close(); } }}>
            {open&&resizable&&!expanded&&!compact&&<div className="prism-panel-resizer" role="separator" aria-labelledby={`${id} ${id}-width-label`} aria-controls={`${id}-panel`} aria-orientation="vertical" aria-valuemin={lower} aria-valuemax={upper} aria-valuenow={currentWidth} aria-valuetext={`${currentWidth}px`} tabIndex={0}
                onPointerDown={e=>{if(e.button!==0)return;e.preventDefault();e.currentTarget.focus();e.currentTarget.setPointerCapture(e.pointerId);drag.current={pointerId:e.pointerId,x:e.clientX,width:currentWidth,preferredWidth:width??internalWidth,handle:e.currentTarget};setDragging(true);}}
                onPointerMove={e=>{if(drag.current?.pointerId===e.pointerId)changeWidth(drag.current.width+drag.current.x-e.clientX);}}
                onPointerUp={e=>{if(drag.current?.pointerId!==e.pointerId)return;drag.current=null;setDragging(false);e.currentTarget.releasePointerCapture(e.pointerId);}}
                onPointerCancel={cancelDrag} onLostPointerCapture={cancelDrag} onDoubleClick={()=>changeWidth(defaultWidth)}
                onKeyDown={e=>{
                    if(e.key==="Escape"&&drag.current){e.preventDefault();e.stopPropagation();cancelDrag();return;}
                    const step=e.shiftKey ? 50 : 16;const next=e.key==="ArrowLeft" ? currentWidth+step : e.key==="ArrowRight" ? currentWidth-step : e.key==="Home" ? lower : e.key==="End" ? upper : undefined;
                    if(next!==undefined){e.preventDefault();changeWidth(next);}
                }}><span id={`${id}-width-label`} className="prism-sr-only">패널 너비</span></div>}
            <header><div ref={heading} id={id} className="prism-panel-title">{typeof title==="string"?<h2>{title}</h2>:title}</div><div className="prism-panel-actions">
                {open&&onExpandedChange&&<button type="button" className="prism-panel-icon-button" aria-label={expanded?"패널 축소":"패널 확대"}
                    onClick={()=>{cancelDrag();onExpandedChange(!expanded);}}><PrismIcon name={expanded?"CollapseIcon":"ExpandIcon"} size={24}/></button>}
                <button type="button" className="prism-panel-icon-button prism-panel-close" aria-label="패널 닫기" onClick={close}><PrismIcon name="CloseIcon" size={24}/></button></div></header>
            <div ref={contentRef} className={`prism-panel-content ${contentClassName}`} style={contentStyle}>{children}</div>
        </aside></>;
}
