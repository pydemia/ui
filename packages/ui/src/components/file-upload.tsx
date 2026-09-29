import type { ReactNode } from "react";
import { Dropzone, type DropzoneProps } from "./dropzone";
import { Progress } from "./progress";
import { cn } from "./utils";

type FileUploadStatus =
    "pending" | "uploading" | "completed" | "failed" | "canceled";

type FileUploadItem = {
    id: string;
    name: string;
    status: FileUploadStatus;
    progress?: number | null;
    error?: string;
};

type FileUploadProps = Omit<
    DropzoneProps,
    "className" | "onFilesSelected" | "showSelectedFiles"
> & {
    items: readonly FileUploadItem[];
    onFilesSelected: (files: File[]) => void;
    onCancel?: (id: string) => void;
    onRetry?: (id: string) => void;
    onRemove?: (id: string) => void;
    emptyMessage?: ReactNode;
    className?: string;
};

const statusLabels: Record<FileUploadStatus, string> = {
    pending: "대기 중",
    uploading: "전송 중",
    completed: "완료",
    failed: "실패",
    canceled: "취소됨",
};

function FileUpload({
    items,
    onFilesSelected,
    onCancel,
    onRetry,
    onRemove,
    emptyMessage = "선택한 파일이 없습니다.",
    className,
    label,
    ...dropzoneProps
}: FileUploadProps) {
    const ids = new Set(items.map((item) => item.id));
    if (!label.trim() || ids.size !== items.length || items.some((item) =>
        !item.id.trim() || !item.name.trim() ||
        statusLabels[item.status] === undefined ||
        (item.progress !== undefined && item.progress !== null && (
            !Number.isFinite(item.progress) ||
            item.progress < 0 || item.progress > 100
        ))
    )) {
        throw new Error(
            "FileUpload requires unique, named items and valid progress.",
        );
    }

    return (
        <div className={cn("grid min-w-0 gap-3", className)}>
            <Dropzone
                {...dropzoneProps}
                label={label}
                showSelectedFiles={false}
                onFilesSelected={onFilesSelected}
            />
            {items.length === 0 ? (
                <p className="m-0 text-sm text-muted">{emptyMessage}</p>
            ) : (
                <ul aria-label={`${label} 목록`}
                    className="m-0 grid list-none gap-2 p-0">
                    {items.map((item) => (
                        <li key={item.id} className={
                            "min-w-0 rounded-sm border border-border " +
                            "bg-surface p-[var(--space-3)]"
                        }>
                            <div className={
                                "flex flex-wrap items-start justify-between " +
                                "gap-2"
                            }>
                                <div className="min-w-0 flex-1">
                                    <strong className={
                                        "block break-all text-sm " +
                                        "font-medium " +
                                        "text-foreground"
                                    }>{item.name}</strong>
                                    <span aria-live="polite" className={cn(
                                        "text-xs",
                                        item.status === "failed"
                                            ? "text-danger" : "text-muted",
                                    )}>{statusLabels[item.status]}</span>
                                </div>
                                <div className="flex flex-wrap gap-1">
                                    {item.status === "uploading" &&
                                        onCancel && (
                                        <button type="button"
                                            onClick={() => onCancel(item.id)}
                                            className={
                                                "rounded-sm px-2 py-1 " +
                                                "text-xs text-muted " +
                                                "hover:bg-surface-subtle " +
                                                "focus-visible:outline-2 " +
                                                "focus-visible:outline-focus"
                                            } aria-label={`${item.name} 취소`}>
                                            취소
                                        </button>
                                    )}
                                    {(item.status === "failed" ||
                                        item.status === "canceled") &&
                                        onRetry && (
                                            <button type="button"
                                                onClick={() =>
                                                    onRetry(item.id)}
                                                className={
                                                    "rounded-sm px-2 py-1 " +
                                                    "text-xs text-accent " +
                                                    "hover:bg-surface-subtle " +
                                                    "focus-visible:outline-2 " +
                                                    "focus-visible:outline-focus"
                                                } aria-label={
                                                    `${item.name} 다시 시도`
                                                }>
                                                다시 시도
                                            </button>
                                        )}
                                    {item.status !== "uploading" &&
                                        onRemove && (
                                            <button type="button"
                                                onClick={() =>
                                                    onRemove(item.id)}
                                                className={
                                                    "rounded-sm px-2 py-1 " +
                                                    "text-xs text-muted " +
                                                    "hover:bg-surface-subtle " +
                                                    "focus-visible:outline-2 " +
                                                    "focus-visible:outline-focus"
                                                } aria-label={
                                                    `${item.name} 제거`
                                                }>
                                                제거
                                            </button>
                                        )}
                                </div>
                            </div>
                            {item.status === "uploading" && (
                                <div className="mt-2 grid gap-1">
                                    <Progress
                                        aria-label={`${item.name} 전송 진행률`}
                                        value={item.progress ?? null}
                                    />
                                    <span className="text-xs text-muted">
                                        {item.progress === undefined ||
                                            item.progress === null
                                            ? "진행률 확인 중"
                                            : `${item.progress}%`}
                                    </span>
                                </div>
                            )}
                            {item.status === "failed" && item.error && (
                                <p role="alert" className={
                                    "mb-0 mt-1 text-xs text-danger"
                                }>{item.error}</p>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export { FileUpload };
export type { FileUploadItem, FileUploadProps, FileUploadStatus };
