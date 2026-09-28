import { Upload } from "lucide-react";
import { useState } from "react";
import { useDropzone, type Accept, type FileRejection } from "react-dropzone";
import { cn } from "./utils";

type DropzoneProps = {
    label: string;
    description?: string;
    accept?: Accept;
    maxFiles?: number;
    maxSize?: number;
    disabled?: boolean;
    className?: string;
    onFilesSelected?: (files: File[]) => void;
    onFilesRejected?: (rejections: FileRejection[]) => void;
};

function Dropzone({
    label,
    description,
    accept,
    maxFiles = 1,
    maxSize,
    disabled,
    className,
    onFilesSelected,
    onFilesRejected,
}: DropzoneProps) {
    const [names, setNames] = useState<string[]>([]);
    const [error, setError] = useState("");
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept,
        maxFiles,
        maxSize,
        multiple: maxFiles > 1,
        disabled,
        onDrop: (accepted, rejected) => {
            if (rejected.length > 0) {
                const code = rejected[0].errors[0]?.code;
                if (code === "file-invalid-type") {
                    setError("허용되지 않는 파일 형식입니다.");
                } else if (code === "file-too-large") {
                    setError("파일 크기가 제한을 초과했습니다.");
                } else if (code === "too-many-files") {
                    setError("파일 개수가 제한을 초과했습니다.");
                } else {
                    setError("파일을 선택할 수 없습니다.");
                }
                onFilesRejected?.(rejected);
                return;
            }
            setError("");
            setNames(accepted.map((file) => file.name));
            onFilesSelected?.(accepted);
        },
    });

    return (
        <div className="min-w-0">
            <div
                {...getRootProps({
                    role: "button",
                    "aria-label": label,
                    className: cn(
                        "flex min-h-32 cursor-pointer flex-col items-center " +
                        "justify-center gap-2 rounded-sm border border-dashed " +
                        "border-border bg-surface-subtle p-[var(--space-4)] " +
                        "text-center text-sm focus-visible:outline-2 " +
                        "focus-visible:outline-focus",
                        isDragActive && "border-accent bg-surface",
                        disabled && "cursor-not-allowed opacity-50",
                        className,
                    ),
                })}
            >
                <Upload aria-hidden="true" className="size-5 text-muted" />
                <span className="font-medium">{label}</span>
                {description && <span className="text-xs text-muted">{description}</span>}
            </div>
            <input {...getInputProps({ "aria-label": `${label} 파일` })} />
            {error && <p role="alert" className="mt-2 text-sm text-danger">{error}</p>}
            {names.length > 0 && (
                <p role="status" className="mt-2 break-words text-sm">
                    선택한 파일: {names.join(", ")}
                </p>
            )}
        </div>
    );
}

export { Dropzone };
export type { DropzoneProps };
