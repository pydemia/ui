import {
    useEffect, useId, useRef, useState,
    type ChangeEvent,
} from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { ImageCropper } from "./image-cropper";
import { cn } from "./utils";

type AvatarUploaderProps = {
    label: string;
    alt: string;
    fallback: string;
    src?: string | null;
    outputWidth?: number;
    maxBytes?: number;
    disabled?: boolean;
    className?: string;
    onImageChange: (image: Blob | null) => void;
};

function supportsImage(file: File) {
    if (["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
        return true;
    }
    return !file.type && /\.(png|jpe?g|webp)$/i.test(file.name);
}

function AvatarUploader({
    label, alt, fallback, src = null, outputWidth = 512, maxBytes,
    disabled = false, className, onImageChange,
}: AvatarUploaderProps) {
    if (![label, alt, fallback].every((value) =>
        typeof value === "string" && value.trim()
    )) {
        throw new Error("AvatarUploader requires a label, alt and fallback.");
    }
    if (typeof onImageChange !== "function") {
        throw new Error("AvatarUploader requires onImageChange.");
    }
    if (!Number.isInteger(outputWidth) || outputWidth < 1 ||
        outputWidth > 4096) {
        throw new RangeError("AvatarUploader outputWidth must be 1–4096px.");
    }
    if (maxBytes !== undefined &&
        (!Number.isSafeInteger(maxBytes) || maxBytes < 1)) {
        throw new RangeError("AvatarUploader maxBytes must be positive.");
    }

    const inputId = useId();
    const inputRef = useRef<HTMLInputElement>(null);
    const previewUrlRef = useRef<string | null>(null);
    const previousSrc = useRef(src);
    const restoreInputFocus = useRef(false);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [removed, setRemoved] = useState(false);
    const [error, setError] = useState("");

    function clearPreview() {
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
            previewUrlRef.current = null;
        }
        setPreviewUrl(null);
    }

    useEffect(() => {
        if (previousSrc.current === src) return;
        previousSrc.current = src;
        clearPreview();
        setRemoved(false);
        setFile(null);
        setError("");
    }, [src]);

    useEffect(() => () => {
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
            previewUrlRef.current = null;
        }
    }, []);

    useEffect(() => {
        if (!file && restoreInputFocus.current) {
            restoreInputFocus.current = false;
            inputRef.current?.focus();
        }
    }, [file]);

    function chooseFile(event: ChangeEvent<HTMLInputElement>) {
        const selected = event.currentTarget.files?.[0];
        event.currentTarget.value = "";
        if (!selected) return;
        if (!supportsImage(selected)) {
            setError("PNG, JPEG, WebP 이미지만 사용할 수 있습니다.");
            setFile(null);
            return;
        }
        if (selected.size === 0) {
            setError("빈 이미지 파일은 사용할 수 없습니다.");
            setFile(null);
            return;
        }
        if (maxBytes !== undefined && selected.size > maxBytes) {
            setError(`이미지는 ${maxBytes}바이트 이하여야 합니다.`);
            setFile(null);
            return;
        }
        setError("");
        setFile(selected);
    }

    function applyCrop(blob: Blob) {
        let url: string;
        try {
            url = URL.createObjectURL(blob);
        } catch {
            setError("자른 이미지의 미리보기를 만들 수 없습니다.");
            return;
        }
        clearPreview();
        previewUrlRef.current = url;
        setPreviewUrl(url);
        setRemoved(false);
        setError("");
        restoreInputFocus.current = true;
        setFile(null);
        onImageChange(blob);
    }

    function removeImage() {
        clearPreview();
        setRemoved(true);
        setError("");
        restoreInputFocus.current = false;
        inputRef.current?.focus();
        setFile(null);
        onImageChange(null);
    }

    const imageSrc = removed ? null : previewUrl ?? src;
    const hasImage = Boolean(imageSrc);

    return (
        <section aria-label={label}
            className={cn("grid min-w-0 gap-4", className)}>
            <div className="flex flex-wrap items-center gap-4">
                <Avatar className="size-20">
                    {imageSrc && <AvatarImage src={imageSrc} alt={alt} />}
                    <AvatarFallback className="text-sm">
                        {fallback}
                    </AvatarFallback>
                </Avatar>
                <div className="grid min-w-0 flex-1 gap-2">
                    <label htmlFor={inputId}
                        className="text-sm font-medium text-foreground">
                        {label}
                    </label>
                    <input id={inputId} ref={inputRef} type="file"
                        accept="image/png,image/jpeg,image/webp"
                        disabled={disabled} onChange={chooseFile}
                        className={
                            "block max-w-full text-sm text-muted " +
                            "file:mr-3 file:rounded-sm file:border " +
                            "file:border-border file:bg-surface file:px-3 " +
                            "file:py-2 file:text-foreground " +
                            "focus-visible:outline-2 " +
                            "focus-visible:outline-focus"
                        } />
                    <p className="m-0 text-xs text-muted">
                        PNG, JPEG, WebP · 자른 결과는 PNG
                    </p>
                </div>
                {hasImage && <Button type="button" variant="outline"
                    disabled={disabled} onClick={removeImage}>
                    사진 제거
                </Button>}
            </div>
            {error && <p role="alert" className="m-0 text-sm text-danger">
                {error}
            </p>}
            {file && <div className="grid gap-2">
                <ImageCropper file={file} label={`${label} 자르기`}
                    alt={`${alt} 자르기 미리보기`} aspectRatio={1}
                    outputWidth={outputWidth} disabled={disabled}
                    onCrop={applyCrop} />
                <Button type="button" variant="outline" disabled={disabled}
                    onClick={() => {
                        restoreInputFocus.current = true;
                        setFile(null);
                    }}>
                    자르기 취소
                </Button>
            </div>}
            {previewUrl && <p role="status" className="m-0 text-sm text-muted">
                새 사진 미리보기
            </p>}
            {removed && !file && <p role="status"
                className="m-0 text-sm text-muted">
                사진을 제거했습니다.
            </p>}
        </section>
    );
}

export { AvatarUploader };
export type { AvatarUploaderProps };
