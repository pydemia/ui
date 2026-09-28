import { Upload } from "lucide-react";
import {
    useId,
    useRef,
    useState,
    type ChangeEvent,
    type DragEvent,
} from "react";
import { cn } from "./utils";

type DropzoneAccept = Record<string, readonly string[]>;

type FileRejection = {
    file: File & { readonly path?: string };
    errors: readonly { code: string; message: string }[];
};

type DropzoneProps = {
    label: string;
    description?: string;
    accept?: DropzoneAccept;
    maxFiles?: number;
    maxSize?: number;
    disabled?: boolean;
    className?: string;
    onFilesSelected?: (files: File[]) => void;
    onFilesRejected?: (rejections: FileRejection[]) => void;
};

function acceptsFile(file: File, accept: DropzoneAccept) {
    const filename = file.name.toLowerCase();
    const mime = file.type.toLowerCase();
    const entries = Object.entries(accept);
    if (!entries.length) return true;

    return entries.some(([type, extensions]) => {
        const allowedType = type.toLowerCase();
        const typeMatches = allowedType.endsWith("/*")
            ? mime.startsWith(allowedType.slice(0, -1))
            : mime === allowedType;
        const extensionMatches = extensions.some((extension) =>
            filename.endsWith(extension.toLowerCase()),
        );
        return extensions.length
            ? extensionMatches && (!mime || typeMatches)
            : typeMatches;
    });
}

function Dropzone({
    label,
    description,
    accept,
    maxFiles = 1,
    maxSize,
    disabled = false,
    className,
    onFilesSelected,
    onFilesRejected,
}: DropzoneProps) {
    const descriptionId = useId();
    const input = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    const [names, setNames] = useState<string[]>([]);
    const [error, setError] = useState("");
    const acceptAttribute = accept && Object.keys(accept).length
        ? Object.entries(accept).flatMap(([type, extensions]) =>
            [type, ...extensions],
        ).join(",")
        : undefined;

    function selectFiles(files: FileList | null) {
        if (disabled || !files?.length) return;

        const selected = Array.from(files);
        const rejections: FileRejection[] = [];
        for (const file of selected) {
            const errors: FileRejection["errors"][number][] = [];
            if (selected.length > maxFiles) {
                errors.push({
                    code: "too-many-files",
                    message: "파일 개수가 제한을 초과했습니다.",
                });
            }
            if (accept && !acceptsFile(file, accept)) {
                errors.push({
                    code: "file-invalid-type",
                    message: "허용되지 않는 파일 형식입니다.",
                });
            }
            if (maxSize !== undefined && file.size > maxSize) {
                errors.push({
                    code: "file-too-large",
                    message: "파일 크기가 제한을 초과했습니다.",
                });
            }
            if (errors.length) rejections.push({ file, errors });
        }

        if (rejections.length) {
            setError(rejections[0].errors[0].message);
            onFilesRejected?.(rejections);
            return;
        }

        setError("");
        setNames(selected.map((file) => file.name));
        onFilesSelected?.(selected);
    }

    function handleInput(event: ChangeEvent<HTMLInputElement>) {
        selectFiles(event.currentTarget.files);
        event.currentTarget.value = "";
    }

    function handleDrag(event: DragEvent<HTMLButtonElement>) {
        event.preventDefault();
        if (!disabled && event.dataTransfer.types.includes("Files")) {
            setDragging(true);
        }
    }

    function handleDrop(event: DragEvent<HTMLButtonElement>) {
        event.preventDefault();
        setDragging(false);
        selectFiles(event.dataTransfer.files);
    }

    return (
        <div className="min-w-0">
            <input
                ref={input}
                type="file"
                tabIndex={-1}
                aria-hidden="true"
                className="sr-only"
                accept={acceptAttribute}
                multiple={maxFiles > 1}
                disabled={disabled}
                onChange={handleInput}
            />
            <button
                type="button"
                disabled={disabled}
                aria-label={label}
                aria-describedby={description ? descriptionId : undefined}
                onClick={() => input.current?.click()}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={cn(
                    "flex min-h-32 w-full cursor-pointer flex-col items-center " +
                    "justify-center gap-2 rounded-sm border border-dashed " +
                    "border-border bg-surface-subtle p-[var(--space-4)] " +
                    "text-center text-sm focus-visible:outline-2 " +
                    "focus-visible:outline-focus disabled:cursor-not-allowed " +
                    "disabled:opacity-50",
                    dragging && "border-accent bg-surface",
                    className,
                )}
            >
                <Upload aria-hidden="true" className="size-5 text-muted" />
                <span className="font-medium">{label}</span>
                {description && (
                    <span id={descriptionId} className="text-xs text-muted">
                        {description}
                    </span>
                )}
            </button>
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
