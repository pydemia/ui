import { useRef } from "react";
import { Button } from "./button";
import {
    Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle,
} from "./dialog";
import { Image } from "./image";
import { cn } from "./utils";

type LightboxItem = {
    id: string;
    src: string;
    alt: string;
    caption?: string;
    aspectRatio?: number;
};

type LightboxProps = {
    title: string;
    items: readonly LightboxItem[];
    activeId: string | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onActiveIdChange: (id: string) => void;
    variant?: "frame" | "immersive";
    showThumbnails?: boolean;
    className?: string;
};

function Lightbox({
    title, items, activeId, open, onOpenChange, onActiveIdChange,
    variant = "frame", showThumbnails = true, className,
}: LightboxProps) {
    const opener = useRef<HTMLElement | null>(null);
    if (typeof title !== "string" || !title.trim()) {
        throw new Error("Lightbox requires a title.");
    }
    if (!Array.isArray(items)) {
        throw new Error("Lightbox requires an image list.");
    }
    if (variant !== "frame" && variant !== "immersive") {
        throw new Error("Lightbox variant is not supported.");
    }
    if (typeof onOpenChange !== "function" ||
        typeof onActiveIdChange !== "function") {
        throw new Error("Lightbox requires state change callbacks.");
    }
    const ids = new Set<string>();
    for (const item of items) {
        if (!item || typeof item.id !== "string" || !item.id.trim() ||
            ids.has(item.id) || typeof item.src !== "string" ||
            !item.src.trim() || typeof item.alt !== "string" ||
            !item.alt.trim() ||
            (item.caption !== undefined &&
                (typeof item.caption !== "string" ||
                    !item.caption.trim())) ||
            (item.aspectRatio !== undefined &&
                (!Number.isFinite(item.aspectRatio) ||
                    item.aspectRatio <= 0))) {
            throw new Error(
                "Lightbox images need unique IDs, sources, alt text, " +
                "and valid metadata.",
            );
        }
        ids.add(item.id);
    }
    const activeIndex = items.findIndex((item) => item.id === activeId);
    if (open && activeIndex < 0) {
        throw new Error("Lightbox open state requires a selected image.");
    }
    const active = items[activeIndex];

    function move(direction: -1 | 1) {
        const next = items[activeIndex + direction];
        if (next) onActiveIdChange(next.id);
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {active && <DialogContent
                className={cn(
                    "flex flex-col gap-3",
                    variant === "frame"
                        ? "max-w-5xl"
                        : "h-[100dvh] max-h-[100dvh] w-screen max-w-none " +
                            "rounded-none border-0 bg-background",
                    className,
                )}
                onOpenAutoFocus={() => {
                    opener.current = document.activeElement instanceof HTMLElement
                        ? document.activeElement : null;
                }}
                onCloseAutoFocus={(event) => {
                    event.preventDefault();
                    opener.current?.focus();
                    opener.current = null;
                }}
                onKeyDown={(event) => {
                    if (event.key === "ArrowLeft" ||
                        event.key === "ArrowRight") {
                        event.preventDefault();
                        move(event.key === "ArrowLeft" ? -1 : 1);
                    }
                }}>
                <div className="flex items-start justify-between gap-3">
                    <DialogTitle>{title}</DialogTitle>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            닫기
                        </Button>
                    </DialogClose>
                </div>
                <DialogDescription>
                    {activeIndex + 1} / {items.length}
                </DialogDescription>
                <Image key={active.id} src={active.src} alt={active.alt}
                    aspectRatio={active.aspectRatio ?? 16 / 9}
                    fit="contain" loading="eager"
                    fallbackText="이미지를 불러오지 못했습니다."
                    className={
                        "max-h-[calc(100dvh-14rem)] rounded-sm " +
                        "border border-border"
                    } />
                {active.caption && <p className="m-0 text-sm text-muted">
                    {active.caption}
                </p>}
                {items.length > 1 && <>
                    <nav aria-label="이미지 이동"
                        className="flex items-center justify-between gap-3">
                        <Button type="button" variant="outline"
                            onClick={() => move(-1)}
                            disabled={activeIndex === 0}>
                            이전 이미지
                        </Button>
                        <Button type="button" variant="outline"
                            onClick={() => move(1)}
                            disabled={activeIndex === items.length - 1}>
                            다음 이미지
                        </Button>
                    </nav>
                    {showThumbnails && <div role="group"
                        aria-label="이미지 선택"
                        className="flex gap-2 overflow-x-auto pb-1">
                        {items.map((item) => (
                            <button key={item.id} type="button"
                                aria-label={`${item.alt} 보기`}
                                aria-current={item.id === active.id
                                    ? "true" : undefined}
                                onClick={() => onActiveIdChange(item.id)}
                                className={
                                    "size-14 shrink-0 overflow-hidden " +
                                    "rounded-sm border border-border " +
                                    "bg-surface-subtle " +
                                    "aria-current:outline-2 " +
                                    "aria-current:outline-focus " +
                                    "focus-visible:outline-2 " +
                                    "focus-visible:outline-focus"
                                }>
                                <img src={item.src} alt="" loading="lazy"
                                    className="size-full object-cover" />
                            </button>
                        ))}
                    </div>}
                </>}
            </DialogContent>}
        </Dialog>
    );
}

export { Lightbox };
export type { LightboxItem, LightboxProps };
