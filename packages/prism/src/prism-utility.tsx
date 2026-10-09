import { useEffect, useId, useRef, useState, type ComponentProps, type CSSProperties, type DragEvent, type ReactNode } from "react";
import { Button, Switch, TooltipProvider, Tooltip, TooltipTrigger, TooltipContent, type Dropzone } from "@pydemia/ui";
import { Arrow as TooltipArrow } from "@radix-ui/react-tooltip";
import { PrismIcon } from "./prism-icon";
import { PrismButton } from "./prism-button";
import type { PrismAttachment } from "./prism-admin";

export function PrismSwitch({ label, ...props }: ComponentProps<typeof Switch> & { label: string }) {
    const id = useId(); return <label className="prism-choice" htmlFor={props.id ?? id}><Switch {...props} id={props.id ?? id} className="prism-switch" />{label}</label>;
}
export type PrismTooltipContentProps = Omit<ComponentProps<typeof TooltipContent>, "asChild"> & { panel?: boolean; arrow?: boolean; small?: boolean };
export type PrismTooltipProps = Pick<PrismTooltipContentProps, "side" | "align" | "panel" | "arrow" | "small"> & {
    content: ReactNode; children: ReactNode; open?: boolean; onOpenChange?: (open: boolean) => void;
    delayDuration?: number;
    contentProps?: Omit<PrismTooltipContentProps, "children" | "side" | "align" | "panel" | "arrow" | "small">;
};
/** sideOffset measures the body gap; Radix also includes its measured arrow height. */
export function PrismTooltipContent({ children, side = "top", align = "center", panel = false, arrow = true, small = false,
    sideOffset = side === "left" || side === "right" ? 8 : 4, collisionPadding = 8, className = "", ...props }: PrismTooltipContentProps) {
    const arrowHeight = side === "left" || side === "right" ? 12 : 8.52;
    return <TooltipContent {...props} data-prism="light" side={side} align={align} collisionPadding={collisionPadding}
        sideOffset={sideOffset - (arrow ? arrowHeight : 0)} className={`prism-tooltip ${className}`}
        data-panel={panel || undefined} data-arrow={arrow || undefined} data-small={small || undefined}>
        <div className={panel ? "prism-tooltip-panel" : "prism-tooltip-text"}>{children}</div>
        {arrow && <TooltipArrow asChild><span className="prism-tooltip-arrow" aria-hidden="true" /></TooltipArrow>}
    </TooltipContent>;
}
export function PrismTooltip({ content, children, side, align, panel, arrow, small, open, onOpenChange, contentProps, delayDuration = 100 }: PrismTooltipProps) {
    return <TooltipProvider delayDuration={delayDuration}><Tooltip open={open} onOpenChange={onOpenChange}><TooltipTrigger asChild>{children}</TooltipTrigger>
        <PrismTooltipContent {...contentProps} side={side} align={align} panel={panel} arrow={arrow} small={small}>{content}</PrismTooltipContent>
    </Tooltip></TooltipProvider>;
}
export type PrismInfoTooltipProps = Omit<PrismTooltipProps, "children"> & { label: string; className?: string; icon?: ReactNode };
/** Hover/focus and an explicit toggle share one state; outside dismissal excludes the trigger. */
export function PrismInfoTooltip({ label, className = "", icon, open, onOpenChange, contentProps, ...props }: PrismInfoTooltipProps) {
    const [localOpen, setLocalOpen] = useState(false); const trigger = useRef<HTMLButtonElement>(null);
    if (!label.trim()) throw new Error("Info tooltip trigger requires a label.");
    const expanded = open ?? localOpen;
    function change(next: boolean) { if (open === undefined) setLocalOpen(next); onOpenChange?.(next); }
    return <PrismTooltip {...props} open={expanded} onOpenChange={change} contentProps={{...contentProps, onPointerDownOutside: event => {
        contentProps?.onPointerDownOutside?.(event);
        if (event.detail.originalEvent.target instanceof Node && trigger.current?.contains(event.detail.originalEvent.target)) event.preventDefault();
    }}}>
        <button ref={trigger} type="button" className={`prism-info-tooltip-trigger ${className}`} aria-label={label} aria-expanded={expanded}
            onPointerDown={event => event.preventDefault()} onClick={event => { event.preventDefault(); change(!expanded); }}>
            {icon ?? <PrismIcon name="InfoIcon" size={16}/>}
        </button>
    </PrismTooltip>;
}
export function PrismProgress({ value, label = "진행률", showPercent = false, displayValue, color }: { value: number | null; label?: string; showPercent?: boolean; displayValue?: string | number; color?: string }) {
    if (value !== null && (!Number.isFinite(value) || value < 0 || value > 100)) throw new RangeError("Progress must be null or 0..100.");
    return <div className="prism-progress"><div className="prism-progress-track" role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={100} aria-valuenow={value ?? undefined}>
        <div className="prism-progress-fill" data-indeterminate={value === null || undefined} style={{width:value === null ? "30%" : `${value}%`,background:color}} /></div>{value!==null&&(displayValue!==undefined||showPercent)&&<span aria-hidden="true">{displayValue ?? `${Math.round(value)}%`}</span>}</div>;
}
type DropzoneProps = ComponentProps<typeof Dropzone>;
export type PrismFileInvalidReason = "extension" | "size" | "partial" | "count";
export type PrismFileDropzoneProps = Omit<DropzoneProps, "label" | "showSelectedFiles"> & {
    label?: string;
    files: readonly PrismAttachment[];
    onRemove?: (id: string) => void;
    onDownload?: (file: PrismAttachment) => void;
    onInvalid?: (reason: PrismFileInvalidReason) => void;
    readOnly?: boolean;
    style?: CSSProperties;
    /** Accepted for compatibility; the controlled files prop always owns the list. */
    showSelectedFiles?: boolean;
};
export type PrismFileAttachProps = {
    label?: string;
    accept?: string;
    multiple?: boolean;
    disabled?: boolean;
    readOnly?: boolean;
    onFilesSelected: (files: File[]) => void;
    files?: readonly PrismAttachment[];
    onRemove?: (id: string) => void;
    onDownload?: (file: PrismAttachment) => void;
    className?: string;
    style?: CSSProperties;
    children?: ReactNode;
};

const defaultFileAccept = {
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
    "text/csv": [".csv"], "application/pdf": [".pdf"],
    "image/png": [".png"], "image/jpeg": [".jpg"],
};
const invalidMessages: Record<PrismFileInvalidReason, string> = {
    extension: "허용되지 않는 파일 형식입니다.",
    size: "파일 크기가 제한을 초과했습니다.",
    partial: "일부 파일만 첨부되었습니다.",
    count: "파일 개수가 제한을 초과했습니다.",
};

// PRISM accepts filename extensions even when the browser supplies a different MIME type.
function acceptsPrismFile(file: File, accept: NonNullable<DropzoneProps["accept"]>) {
    return !Object.keys(accept).length || Object.entries(accept).some(([type, extensions]) => {
        if (extensions.length) return extensions.some(extension => file.name.toLowerCase().endsWith(extension.toLowerCase()));
        const mime = file.type.toLowerCase(); const allowed = type.toLowerCase();
        return allowed.endsWith("/*") ? mime.startsWith(allowed.slice(0, -1)) : mime === allowed;
    });
}
function FileName({ file, className, onDownload }: { file: PrismAttachment; className: string; onDownload?: (file: PrismAttachment) => void }) {
    if (file.href && /^(https?:\/\/|\/[^/])/.test(file.href)) return <a className={className} href={file.href} download title={file.name}>{file.name}</a>;
    if (onDownload) return <button type="button" className={className} title={file.name} onClick={() => onDownload(file)}>{file.name}</button>;
    return <span className={className} title={file.name}>{file.name}</span>;
}
function FileStatus({ file }: { file: PrismAttachment }) {
    return file.status === "uploading" ? <span className="prism-sr-only" role="status">{file.name} 업로드 중</span> : null;
}
function FileRemove({ file, disabled, onRemove }: { file: PrismAttachment; disabled: boolean; onRemove?: (id: string) => void }) {
    return onRemove ? <Button variant="ghost" className="prism-file-remove" disabled={disabled} aria-label={`${file.name} 삭제`} onClick={() => onRemove(file.id)}>
        <PrismIcon name="CloseCircleIcon" size={16} />
    </Button> : null;
}

/** Selection emits native files; upload, completion, errors and persistence belong to the host. */
export function PrismFileDropzone({ files, onRemove, onDownload, onFilesSelected, onFilesRejected, onInvalid,
    maxSize = 10 * 1024 * 1024, maxFiles = Infinity, accept = defaultFileAccept,
    disabled = false, readOnly = false, label, description, className = "", style }: PrismFileDropzoneProps) {
    if (maxFiles !== Infinity && (!Number.isInteger(maxFiles) || maxFiles < 1)) throw new RangeError("maxFiles must be a positive integer.");
    if (!Number.isFinite(maxSize) || maxSize < 0) throw new RangeError("maxSize must be nonnegative bytes.");
    const input = useRef<HTMLInputElement>(null); const depth = useRef(0); const hintId = useId();
    const [dragging, setDragging] = useState(false); const [feedback, setFeedback] = useState("");
    const locked = disabled || readOnly;
    useEffect(() => { if (locked) { depth.current = 0; setDragging(false); } }, [locked]);
    const extensions = [...new Set(Object.values(accept).flat())];
    const acceptAttribute = Object.entries(accept).flatMap(([type, values]) => values.length ? values : [type]).join(",") || undefined;
    const hint = description ?? `${acceptAttribute ? `(${(extensions.length ? extensions : Object.keys(accept)).join(", ")}), ` : ""}최대 ${maxSize / 1024 / 1024}MB`;

    function selectFiles(picked: readonly File[]) {
        if (locked || !picked.length) return;
        const accepted: File[] = []; const rejected: Parameters<NonNullable<DropzoneProps["onFilesRejected"]>>[0] = [];
        for (const file of picked) {
            const errors = [];
            if (picked.length > maxFiles) errors.push({ code: "too-many-files", message: invalidMessages.count });
            if (!acceptsPrismFile(file, accept)) errors.push({ code: "file-invalid-type", message: invalidMessages.extension });
            if (file.size > maxSize) errors.push({ code: "file-too-large", message: invalidMessages.size });
            if (errors.length) rejected.push({ file, errors }); else accepted.push(file);
        }
        const reason: PrismFileInvalidReason | undefined = rejected.length ? accepted.length ? "partial"
            : picked.length > maxFiles ? "count" : picked.some(file => !acceptsPrismFile(file, accept)) ? "extension" : "size" : undefined;
        setFeedback(reason ? invalidMessages[reason] : "");
        if (reason) onInvalid?.(reason);
        if (rejected.length) onFilesRejected?.(rejected);
        if (accepted.length) onFilesSelected?.(accepted);
    }
    function enter(event: DragEvent<HTMLButtonElement>) {
        event.preventDefault();
        if (locked || !event.dataTransfer.types.includes("Files")) return;
        depth.current += 1; setDragging(true);
    }
    function leave(event: DragEvent<HTMLButtonElement>) {
        event.preventDefault(); depth.current = Math.max(0, depth.current - 1);
        if (!depth.current) setDragging(false);
    }

    return <div className={`prism-filezone ${className}`} style={style} data-readonly={readOnly || undefined}>
        <Button variant="outline" className="prism-dropzone" disabled={locked} data-dragging={dragging || undefined}
            aria-label={label ?? "파일 첨부"} aria-describedby={hintId} onClick={() => input.current?.click()}
            onDragEnter={enter} onDragLeave={leave} onDragOver={event => {
                event.preventDefault(); event.dataTransfer.dropEffect = locked ? "none" : "copy";
                if (!locked && event.dataTransfer.types.includes("Files")) setDragging(true);
            }} onDrop={event => {
                event.preventDefault(); depth.current = 0; setDragging(false); selectFiles(Array.from(event.dataTransfer.files));
            }}>
            <span className="prism-dropzone-icon"><PrismIcon name="FileUploadIcon" size={20} /></span>
            <span className="prism-dropzone-texts"><span className="prism-dropzone-guide">{label ?? <>파일을 여기에 끌어다 놓거나<br /><span className="prism-dropzone-link">여기</span>를 클릭하세요</>}</span>
                <span id={hintId} className="prism-dropzone-hint">{hint}</span></span>
        </Button>
        <input hidden aria-hidden="true" tabIndex={-1} ref={input} type="file" multiple={maxFiles > 1} accept={acceptAttribute} disabled={locked}
            onChange={event => { const picked = Array.from(event.currentTarget.files ?? []); event.currentTarget.value = ""; selectFiles(picked); }} />
        {feedback && <p role="alert" className={onInvalid || onFilesRejected ? "prism-sr-only" : "prism-error"}>{feedback}</p>}
        {!!files.length && <ul className="prism-filetiles" aria-label="첨부된 파일">{files.map(file => <li className="prism-filetile" key={file.id} data-status={file.status} aria-busy={file.status === "uploading" || undefined}>
            <span className="prism-filetile-icon"><PrismIcon name={file.status === "uploading" ? "GeneratingSpinnerIcon" : "FileTextIcon"} size={16} /></span>
            <span className="prism-filetile-texts"><FileName file={file} className="prism-filetile-name" onDownload={onDownload} />
                {file.status === "error" ? <span className="prism-filetile-size prism-error" role="alert" title={file.error}>{file.error ?? "첨부하지 못했습니다."}</span>
                    : file.sizeLabel && <span className="prism-filetile-size">{file.sizeLabel}</span>}</span>
            <FileStatus file={file} /><FileRemove file={file} disabled={locked} onRemove={onRemove} />
        </li>)}</ul>}
    </div>;
}
export function PrismFileAttach({ label = "첨부파일", accept, multiple = true, disabled = false, readOnly = false,
    onFilesSelected, files = [], onRemove, onDownload, className = "", style, children }: PrismFileAttachProps) {
    const ref = useRef<HTMLInputElement>(null); const id = useId(); const labelId = useId(); const locked = disabled || readOnly;
    return <div className={`prism-file-attach ${className}`} style={style} data-readonly={readOnly || undefined}>
        <div className="prism-file-attach-header"><label id={labelId} htmlFor={id}>{label}</label>
            <PrismButton variant="line" size="small" icon={<PrismIcon name="LinkIcon" size={20} />} disabled={locked} aria-describedby={labelId} onClick={() => ref.current?.click()}>파일추가</PrismButton>
            <input id={id} hidden aria-hidden="true" tabIndex={-1} ref={ref} type="file" multiple={multiple} accept={accept} disabled={locked}
                onChange={event => { const selected = Array.from(event.currentTarget.files ?? []); event.currentTarget.value = ""; if (!locked && selected.length) onFilesSelected(multiple ? selected : selected.slice(0, 1)); }} />
        </div>
        {!!files.length && <ul className="prism-file-attach-list" aria-label={`${label} 목록`}>{files.map(file => <li className="prism-file-attach-row" key={file.id} data-status={file.status} aria-busy={file.status === "uploading" || undefined}>
            <span className="prism-file-attach-main">{file.status === "uploading" && <PrismIcon name="GeneratingSpinnerIcon" size={16} />}
                <FileName file={file} className="prism-file-attach-name" onDownload={onDownload} />
                <FileStatus file={file} /></span>
            <FileRemove file={file} disabled={locked} onRemove={onRemove} />
            {file.status === "error" && <span className="prism-file-attach-error prism-error" role="alert">{file.error ?? "첨부하지 못했습니다."}</span>}
        </li>)}</ul>}{children}
    </div>;
}
