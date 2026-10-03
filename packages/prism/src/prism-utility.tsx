import { useId, useRef, type ComponentProps, type ReactNode } from "react";
import { Switch, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, Dropzone } from "@pydemia/ui";
import { PrismPaperclipGlyph as Paperclip } from "./prism-icon";
import { PrismButton } from "./prism-button";
import { PrismAttachmentList, type PrismAttachment } from "./prism-admin";

export function PrismSwitch({ label, ...props }: ComponentProps<typeof Switch> & { label: string }) {
    const id = useId(); return <label className="prism-choice" htmlFor={props.id ?? id}><Switch {...props} id={props.id ?? id} className="prism-switch" />{label}</label>;
}
export function PrismTooltip({ content, children, side = "top", align = "center", panel = false, arrow = true, small = false, open, onOpenChange }: { content: ReactNode; children: ReactNode; side?: "top" | "bottom" | "left" | "right"; align?: "start" | "center" | "end"; panel?: boolean; arrow?: boolean; small?: boolean; open?:boolean; onOpenChange?:(open:boolean)=>void }) {
    return <TooltipProvider><Tooltip open={open} onOpenChange={onOpenChange}><TooltipTrigger asChild>{children}</TooltipTrigger><TooltipContent data-prism="light" side={side} align={align} sideOffset={side==="left"||side==="right" ? 8 : 4} className="prism-tooltip" data-panel={panel || undefined} data-arrow={arrow||undefined} data-small={small||undefined}>{content}</TooltipContent></Tooltip></TooltipProvider>;
}
export function PrismProgress({ value, label = "진행률", showPercent = false, displayValue, color }: { value: number | null; label?: string; showPercent?: boolean; displayValue?: string | number; color?: string }) {
    if (value !== null && (!Number.isFinite(value) || value < 0 || value > 100)) throw new RangeError("Progress must be null or 0..100.");
    return <div className="prism-progress"><div className="prism-progress-track" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value ?? undefined}>
        <div className="prism-progress-fill" data-indeterminate={value === null || undefined} style={{width:value === null ? "30%" : `${value}%`,background:color}} /></div>{value!==null&&(displayValue!==undefined||showPercent)&&<span aria-hidden="true">{displayValue ?? `${Math.round(value)}%`}</span>}</div>;
}
export function PrismFileDropzone({ files, onRemove, maxSize = 10*1024*1024, accept = {"application/pdf":[".pdf"],"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":[".xlsx"],"text/csv":[".csv"],"application/vnd.ms-excel":[".csv"],"image/png":[".png"],"image/jpeg":[".jpg"]}, ...props }: ComponentProps<typeof Dropzone> & { files: readonly PrismAttachment[]; onRemove?: (id: string) => void }) {
    return <div className="prism-filezone"><Dropzone {...props} accept={accept} maxSize={maxSize} showSelectedFiles={false} className="prism-dropzone" /><div className="prism-filetiles"><PrismAttachmentList files={files} onRemove={onRemove} /></div></div>;
}
export function PrismFileAttach({ label = "첨부파일", accept, disabled, onFilesSelected, children }: { label?: string; accept?: string; disabled?: boolean; onFilesSelected: (files: File[]) => void; children?: ReactNode }) {
    const ref = useRef<HTMLInputElement>(null); const id = useId();
    return <div className="prism-file-attach"><div><label htmlFor={id}>{label}</label><PrismButton variant="line" size="small" icon={<Paperclip />} disabled={disabled} onClick={() => ref.current?.click()}>파일 선택</PrismButton>
        <input id={id} hidden aria-hidden="true" tabIndex={-1} ref={ref} type="file" multiple accept={accept} disabled={disabled} onChange={e => { const files = [...(e.target.files ?? [])]; if (files.length) onFilesSelected(files); e.target.value=""; }} /></div>{children}</div>;
}
