import {
    useEffect, useId, useRef, useState,
    type PointerEvent,
} from "react";
import { Button } from "./button";
import { cn } from "./utils";

type ImageCropperProps = {
    file: File | null;
    label: string;
    alt: string;
    aspectRatio?: number;
    outputWidth?: number;
    disabled?: boolean;
    className?: string;
    onCrop: (blob: Blob) => void;
};

type LoadedImage = {
    file: File;
    image: HTMLImageElement;
};

type DragStart = {
    pointerId: number;
    clientX: number;
    clientY: number;
    horizontal: number;
    vertical: number;
};

function clamp(value: number, min: number, max: number) {
    return Math.min(max, Math.max(min, value));
}

function supportsImageFile(file: File) {
    if (["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
        return true;
    }
    return !file.type && /\.(png|jpe?g|webp)$/i.test(file.name);
}

function cropRectangle(
    image: HTMLImageElement,
    aspectRatio: number,
    zoom: number,
    horizontal: number,
    vertical: number,
) {
    const width = image.naturalWidth;
    const height = image.naturalHeight;
    const baseWidth = width / height > aspectRatio
        ? height * aspectRatio : width;
    const baseHeight = baseWidth / aspectRatio;
    const cropWidth = baseWidth / zoom;
    const cropHeight = baseHeight / zoom;
    return {
        x: (width - cropWidth) * horizontal / 100,
        y: (height - cropHeight) * vertical / 100,
        width: cropWidth,
        height: cropHeight,
        horizontalRange: width - cropWidth,
        verticalRange: height - cropHeight,
    };
}

function ImageCropper({
    file,
    label,
    alt,
    aspectRatio = 1,
    outputWidth = 512,
    disabled = false,
    className,
    onCrop,
}: ImageCropperProps) {
    if (typeof label !== "string" || !label.trim() ||
        typeof alt !== "string" || !alt.trim()) {
        throw new Error("ImageCropper requires a label and image description.");
    }
    if (!Number.isFinite(aspectRatio) || aspectRatio <= 0) {
        throw new RangeError("ImageCropper aspectRatio must be positive.");
    }
    const outputHeight = Math.round(outputWidth / aspectRatio);
    if (!Number.isInteger(outputWidth) || outputWidth < 1 ||
        outputWidth > 4096 || outputHeight < 1 || outputHeight > 4096) {
        throw new RangeError("ImageCropper output dimensions must be 1–4096px.");
    }
    if (typeof onCrop !== "function") {
        throw new Error("ImageCropper requires onCrop.");
    }

    const horizontalId = useId();
    const verticalId = useId();
    const zoomId = useId();
    const descriptionId = useId();
    const preview = useRef<HTMLCanvasElement>(null);
    const drag = useRef<DragStart | null>(null);
    const generation = useRef(0);
    const [loaded, setLoaded] = useState<LoadedImage | null>(null);
    const [loadError, setLoadError] = useState("");
    const [cropError, setCropError] = useState("");
    const [busy, setBusy] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [horizontal, setHorizontal] = useState(50);
    const [vertical, setVertical] = useState(50);
    const supportedFile = file === null || supportsImageFile(file);
    const ready = loaded?.file === file && supportedFile;
    const image = ready ? loaded.image : null;
    const region = image && cropRectangle(
        image, aspectRatio, zoom, horizontal, vertical,
    );
    const canEdit = Boolean(image) && !disabled && !busy;

    useEffect(() => {
        generation.current += 1;
        setLoaded(null);
        setLoadError("");
        setCropError("");
        setBusy(false);
        setZoom(1);
        setHorizontal(50);
        setVertical(50);
        if (!file || !supportedFile) return;

        let objectUrl: string;
        try {
            objectUrl = URL.createObjectURL(file);
        } catch {
            setLoadError("이미지를 읽을 수 없습니다.");
            return;
        }
        const image = new window.Image();
        image.onload = () => {
            if (image.naturalWidth && image.naturalHeight) {
                setLoaded({ file, image });
            } else {
                setLoadError("이미지 크기를 확인할 수 없습니다.");
            }
        };
        image.onerror = () => setLoadError("이미지를 열 수 없습니다.");
        image.src = objectUrl;
        return () => {
            generation.current += 1;
            image.onload = null;
            image.onerror = null;
            URL.revokeObjectURL(objectUrl);
        };
    }, [file, supportedFile]);

    useEffect(() => {
        const canvas = preview.current;
        if (!canvas || !image || !region) return;
        const width = 720;
        const height = Math.max(1, Math.round(width / aspectRatio));
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        if (!context) {
            setCropError("이미지 미리보기를 만들 수 없습니다.");
            return;
        }
        try {
            context.clearRect(0, 0, width, height);
            context.drawImage(
                image,
                region.x, region.y, region.width, region.height,
                0, 0, width, height,
            );
        } catch (error) {
            setCropError(error instanceof Error
                ? error.message : "이미지 미리보기를 만들 수 없습니다.");
        }
    }, [image, aspectRatio, region?.x, region?.y,
        region?.width, region?.height]);

    function startDrag(event: PointerEvent<HTMLCanvasElement>) {
        if (!canEdit || !region ||
            (event.pointerType === "mouse" && event.button !== 0)) return;
        drag.current = {
            pointerId: event.pointerId,
            clientX: event.clientX,
            clientY: event.clientY,
            horizontal,
            vertical,
        };
        event.currentTarget.setPointerCapture(event.pointerId);
    }

    function moveDrag(event: PointerEvent<HTMLCanvasElement>) {
        const start = drag.current;
        if (!start || start.pointerId !== event.pointerId ||
            !region || !canEdit) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (bounds.width > 0 && region.horizontalRange > 0) {
            const delta = (event.clientX - start.clientX) / bounds.width;
            setHorizontal(clamp(
                start.horizontal - delta * region.width /
                    region.horizontalRange * 100,
                0, 100,
            ));
        }
        if (bounds.height > 0 && region.verticalRange > 0) {
            const delta = (event.clientY - start.clientY) / bounds.height;
            setVertical(clamp(
                start.vertical - delta * region.height /
                    region.verticalRange * 100,
                0, 100,
            ));
        }
    }

    function endDrag(event: PointerEvent<HTMLCanvasElement>) {
        if (drag.current?.pointerId !== event.pointerId) return;
        drag.current = null;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    }

    function exportCrop() {
        if (!image || !region || !canEdit) return;
        setCropError("");
        setBusy(true);
        const currentGeneration = generation.current;
        try {
            const canvas = document.createElement("canvas");
            canvas.width = outputWidth;
            canvas.height = outputHeight;
            const context = canvas.getContext("2d");
            if (!context) {
                setCropError("이미지를 자를 수 없습니다.");
                setBusy(false);
                return;
            }
            context.drawImage(
                image,
                region.x, region.y, region.width, region.height,
                0, 0, outputWidth, outputHeight,
            );
            canvas.toBlob((blob) => {
                if (generation.current !== currentGeneration) return;
                setBusy(false);
                if (!blob) {
                    setCropError("이미지를 PNG로 저장할 수 없습니다.");
                    return;
                }
                onCrop(blob);
            }, "image/png");
        } catch (error) {
            setBusy(false);
            setCropError(error instanceof Error
                ? error.message : "이미지를 자를 수 없습니다.");
        }
    }

    const status = !file ? "이미지를 선택하세요." :
        !supportedFile ? "PNG, JPEG, WebP 이미지만 사용할 수 있습니다." :
        loadError || (!image ? "이미지를 불러오는 중입니다." : "");

    return (
        <section aria-label={label} aria-busy={busy || undefined}
            className={cn("grid min-w-0 gap-3", className)}>
            <div>
                <h3 className="m-0 text-sm font-semibold text-foreground">
                    {label}
                </h3>
                <p id={descriptionId} className="mb-0 mt-1 text-xs text-muted">
                    이미지를 끌거나 위치·확대 슬라이더로 조정하세요.
                </p>
            </div>
            <div className={
                "relative w-full overflow-hidden rounded-sm border " +
                "border-border bg-surface-subtle"
            }
                style={{ aspectRatio }}>
                {image ? (
                    <canvas ref={preview} role="img" aria-label={alt}
                        aria-describedby={descriptionId}
                        onPointerDown={startDrag}
                        onPointerMove={moveDrag}
                        onPointerUp={endDrag}
                        onPointerCancel={endDrag}
                        onLostPointerCapture={() => { drag.current = null; }}
                        className={cn(
                            "block size-full",
                            canEdit && "touch-none cursor-grab " +
                                "active:cursor-grabbing",
                        )} />
                ) : (
                    <p role={loadError || !supportedFile ? "alert" : "status"}
                        className={
                            "absolute inset-0 grid place-items-center " +
                            "p-4 text-center text-sm text-muted"
                        }>
                        {status}
                    </p>
                )}
            </div>
            {file && <p className="m-0 truncate text-xs text-muted">
                원본: {file.name}
            </p>}
            <div className="grid gap-3 sm:grid-cols-3">
                <div className="grid gap-1">
                    <label htmlFor={horizontalId} className="text-xs font-medium">
                        가로 위치 <output>{Math.round(horizontal)}%</output>
                    </label>
                    <input id={horizontalId} type="range" min={0} max={100}
                        value={horizontal} disabled={!canEdit ||
                            !region?.horizontalRange}
                        onChange={(event) => setHorizontal(
                            Number(event.currentTarget.value),
                        )}
                        className="w-full accent-accent" />
                </div>
                <div className="grid gap-1">
                    <label htmlFor={verticalId} className="text-xs font-medium">
                        세로 위치 <output>{Math.round(vertical)}%</output>
                    </label>
                    <input id={verticalId} type="range" min={0} max={100}
                        value={vertical} disabled={!canEdit ||
                            !region?.verticalRange}
                        onChange={(event) => setVertical(
                            Number(event.currentTarget.value),
                        )}
                        className="w-full accent-accent" />
                </div>
                <div className="grid gap-1">
                    <label htmlFor={zoomId} className="text-xs font-medium">
                        확대 <output>{Math.round(zoom * 100)}%</output>
                    </label>
                    <input id={zoomId} type="range" min={100} max={300}
                        step={10} value={zoom * 100} disabled={!canEdit}
                        onChange={(event) => setZoom(
                            Number(event.currentTarget.value) / 100,
                        )}
                        className="w-full accent-accent" />
                </div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-muted">
                    PNG {outputWidth} × {outputHeight}px
                </span>
                <div className="flex gap-2">
                    <Button type="button" variant="outline" disabled={!canEdit}
                        onClick={() => {
                            setZoom(1);
                            setHorizontal(50);
                            setVertical(50);
                            setCropError("");
                        }}>
                        초기화
                    </Button>
                    <Button type="button" disabled={!canEdit}
                        onClick={exportCrop}>
                        {busy ? "자르는 중" : "PNG 자르기"}
                    </Button>
                </div>
            </div>
            {cropError && <p role="alert" className="m-0 text-sm text-danger">
                {cropError}
            </p>}
        </section>
    );
}

export { ImageCropper };
export type { ImageCropperProps };
