import {
    useEffect, useRef, useState,
    type ComponentProps,
} from "react";
import { cn } from "./utils";

type ImageProps = Omit<
    ComponentProps<"img">,
    "alt" | "children" | "className" | "ref" | "src" | "style"
> & {
    src: string | null;
    alt: string;
    aspectRatio?: "square" | "video" | "portrait" | number;
    fit?: "cover" | "contain";
    variant?: "plain" | "frame";
    fallbackText?: string;
    className?: string;
    imageClassName?: string;
};

type ImageState = {
    request: string;
    status: "loading" | "loaded" | "error";
};

function Image({
    src,
    alt,
    aspectRatio = "video",
    fit = "cover",
    variant = "plain",
    fallbackText = "이미지를 표시할 수 없습니다.",
    className,
    imageClassName,
    srcSet,
    sizes,
    loading = "lazy",
    decoding = "async",
    onLoad,
    onError,
    ...imgProps
}: ImageProps) {
    const image = useRef<HTMLImageElement>(null);
    const request = JSON.stringify([src, srcSet, sizes]);
    const [state, setState] = useState<ImageState>({
        request,
        status: "loading",
    });
    const status = src === null ? "missing" :
        state.request === request ? state.status : "loading";
    const ratio = typeof aspectRatio === "number" ? aspectRatio :
        { square: 1, video: 16 / 9, portrait: 3 / 4 }[aspectRatio];

    if (typeof alt !== "string") {
        throw new Error("Image requires alt text or an empty decorative alt.");
    }
    if (src !== null && (typeof src !== "string" || !src.trim())) {
        throw new Error("Image src must be a nonempty URL or null.");
    }
    if (!Number.isFinite(ratio) || ratio <= 0) {
        throw new RangeError("Image aspectRatio must be positive and finite.");
    }

    useEffect(() => {
        if (src === null) {
            setState({ request, status: "loading" });
            return;
        }
        if (!image.current?.complete) return;
        setState({
            request,
            status: image.current.naturalWidth > 0 ? "loaded" : "error",
        });
    }, [request, src]);

    return (
        <div
            className={cn(
                "relative w-full overflow-hidden bg-surface-subtle",
                variant === "frame" && "rounded-md border border-border",
                className,
            )}
            style={{ aspectRatio: ratio }}
            aria-busy={status === "loading" || undefined}
        >
            {src !== null && (
                <img
                    key={request}
                    ref={image}
                    src={src}
                    srcSet={srcSet}
                    sizes={sizes}
                    alt={alt}
                    loading={loading}
                    decoding={decoding}
                    className={cn(
                        "absolute inset-0 size-full",
                        fit === "cover" ? "object-cover" : "object-contain",
                        status !== "loaded" && "opacity-0",
                        imageClassName,
                    )}
                    onLoad={(event) => {
                        setState({ request, status: "loaded" });
                        onLoad?.(event);
                    }}
                    onError={(event) => {
                        setState({ request, status: "error" });
                        onError?.(event);
                    }}
                    {...imgProps}
                    aria-hidden={status === "error" || undefined}
                />
            )}
            {status === "loading" && (
                <div aria-hidden="true" className={
                    "absolute inset-0 bg-surface-subtle " +
                    "motion-safe:animate-pulse"
                } />
            )}
            {(status === "error" || status === "missing") && (
                <div
                    role={src === null && alt ? "img" :
                        alt ? "status" : undefined}
                    aria-label={src === null && alt ? alt : undefined}
                    aria-hidden={!alt || undefined}
                    className={
                        "absolute inset-0 grid place-items-center p-4 " +
                        "text-center text-sm text-muted"
                    }
                >
                    {status === "missing"
                        ? "이미지가 없습니다."
                        : fallbackText}
                </div>
            )}
        </div>
    );
}

export { Image };
export type { ImageProps };
