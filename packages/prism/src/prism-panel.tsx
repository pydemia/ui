import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { PrismMaximize2Glyph as Maximize2, PrismMinimize2Glyph as Minimize2, PrismXGlyph as X } from "./prism-icon";
import { PrismButton } from "./prism-button";

export type PrismPanelProps = {
    title: string; open: boolean; onOpenChange: (open: boolean) => void;
    expanded?: boolean; onExpandedChange?: (expanded: boolean) => void;
    children: ReactNode;
    resizable?: boolean; width?: number; defaultWidth?: number; minWidth?: number; maxWidth?: number;
    onWidthChange?: (width: number) => void; responsive?: boolean;
};
/** Render inside a position:relative flex container. The surrounding view stays usable. */
export function PrismPanel({ title, open, onOpenChange, expanded = false, onExpandedChange, children,
    resizable = false, width, defaultWidth = 440, minWidth = 320, maxWidth = 800, onWidthChange, responsive = true }: PrismPanelProps) {
    if([minWidth,maxWidth,defaultWidth,width??defaultWidth].some(value=>!Number.isFinite(value)||value<=0)||minWidth>maxWidth)throw new RangeError("Panel widths must be positive with minWidth <= maxWidth.");
    const id = useId();const panel=useRef<HTMLElement>(null);const [internalWidth,setInternalWidth]=useState(defaultWidth);const [containerWidth,setContainerWidth]=useState<number|null>(null);
    const drag=useRef<{pointerId:number;x:number;width:number}|null>(null);
    useEffect(()=>{const parent=panel.current?.parentElement;if(!parent)return;const measure=()=>{const next=parent.getBoundingClientRect().width;if(next>0)setContainerWidth(next);};measure();const observer=new ResizeObserver(measure);observer.observe(parent);return()=>observer.disconnect();},[]);
    const compact=responsive&&containerWidth!==null&&containerWidth<640;const upper=Math.min(maxWidth,containerWidth??maxWidth);const lower=Math.min(minWidth,upper);
    const currentWidth=Math.max(lower,Math.min(upper,width??internalWidth));
    const changeWidth=(next:number)=>{const clamped=Math.round(Math.max(lower,Math.min(upper,next)));if(width===undefined)setInternalWidth(clamped);if(clamped!==currentWidth)onWidthChange?.(clamped);};
    const style={"--prism-panel-width":`${currentWidth}px`} as CSSProperties;
    const close = () => { onExpandedChange?.(false); onOpenChange(false); };
    return <><div className="prism-panel-placeholder" style={style} data-open={open || undefined} data-compact={compact||undefined} aria-hidden="true" />
        <aside ref={panel} id={`${id}-panel`} style={style} className="prism-panel" hidden={!open} aria-labelledby={id} data-expanded={expanded || undefined} data-compact={compact||undefined}
            onKeyDown={e => { if (e.key === "Escape" && !e.defaultPrevented) { e.stopPropagation(); close(); } }}>
            {resizable&&!expanded&&!compact&&<div className="prism-panel-resizer" role="separator" aria-label={`${title} 패널 너비`} aria-controls={`${id}-panel`} aria-orientation="vertical" aria-valuemin={lower} aria-valuemax={upper} aria-valuenow={currentWidth} aria-valuetext={`${currentWidth}px`} tabIndex={0}
                onPointerDown={e=>{if(e.button!==0)return;e.preventDefault();e.currentTarget.focus();e.currentTarget.setPointerCapture(e.pointerId);drag.current={pointerId:e.pointerId,x:e.clientX,width:currentWidth};}}
                onPointerMove={e=>{if(drag.current?.pointerId===e.pointerId)changeWidth(drag.current.width+drag.current.x-e.clientX);}}
                onPointerUp={e=>{if(drag.current?.pointerId!==e.pointerId)return;drag.current=null;e.currentTarget.releasePointerCapture(e.pointerId);}}
                onPointerCancel={()=>{if(drag.current)changeWidth(drag.current.width);drag.current=null;}}
                onLostPointerCapture={()=>{drag.current=null;}} onDoubleClick={()=>changeWidth(defaultWidth)}
                onKeyDown={e=>{const step=e.shiftKey ? 50 : 16;const next=e.key==="ArrowLeft" ? currentWidth+step : e.key==="ArrowRight" ? currentWidth-step : e.key==="Home" ? lower : e.key==="End" ? upper : undefined;
                    if(next!==undefined){e.preventDefault();changeWidth(next);}if(e.key==="Escape"&&drag.current){e.preventDefault();changeWidth(drag.current.width);drag.current=null;}}}/>}
            <header><h2 id={id}>{title}</h2><div>{onExpandedChange && <PrismButton variant="shape" iconOnly
                aria-label={expanded ? "패널 축소" : "패널 확대"} icon={expanded ? <Minimize2 /> : <Maximize2 />}
                onClick={() => onExpandedChange(!expanded)} />}
                <PrismButton variant="shape" iconOnly aria-label="패널 닫기" icon={<X />} onClick={close} /></div></header>
            <div className="prism-panel-content">{children}</div>
        </aside></>;
}
