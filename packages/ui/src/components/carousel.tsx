import {
    useEffect, useId, useRef, useState,
    type ComponentProps, type PointerEvent, type ReactNode,
} from "react";
import { Button } from "./button";
import { cn } from "./utils";

const focusRingClass =
    "focus-visible:outline-2 focus-visible:outline-focus";

type CarouselSlide = {
    id: string;
    label: string;
    content: ReactNode;
};

type CarouselProps = Omit<
    ComponentProps<"section">,
    "aria-label" | "aria-labelledby" | "aria-roledescription" |
    "children" | "role"
> & {
    label: string;
    slides: readonly CarouselSlide[];
    activeId?: string;
    defaultActiveId?: string;
    onActiveIdChange?: (id: string) => void;
    loop?: boolean;
    showIndicators?: boolean;
    variant?: "card" | "plain";
    emptyMessage?: string;
};

function Carousel({
    label,
    slides,
    activeId,
    defaultActiveId,
    onActiveIdChange,
    loop = false,
    showIndicators = false,
    variant = "card",
    emptyMessage = "표시할 항목이 없습니다.",
    className,
    ...props
}: CarouselProps) {
    const [internalId, setInternalId] = useState<string | null>(
        defaultActiveId ?? slides[0]?.id ?? null,
    );
    const labelId = useId();
    const touchStart = useRef<{
        pointerId: number;
        x: number;
        y: number;
    } | null>(null);

    if (!label.trim()) throw new Error("Carousel requires a label.");
    if (activeId !== undefined && defaultActiveId !== undefined) {
        throw new Error(
            "Carousel cannot use activeId and defaultActiveId together.",
        );
    }
    if (activeId !== undefined && !onActiveIdChange) {
        throw new Error("Controlled Carousel requires onActiveIdChange.");
    }

    const ids = new Set<string>();
    for (const slide of slides) {
        if (!slide.id.trim() || !slide.label.trim() || ids.has(slide.id)) {
            throw new Error("Carousel slides need unique ids and labels.");
        }
        ids.add(slide.id);
    }
    if ((activeId !== undefined && !ids.has(activeId)) ||
        (defaultActiveId !== undefined && !ids.has(defaultActiveId))) {
        throw new Error("Carousel active id must identify a slide.");
    }

    useEffect(() => {
        if (activeId === undefined && internalId !== null &&
            !slides.some((slide) => slide.id === internalId)) {
            setInternalId(slides[0]?.id ?? null);
        }
    }, [activeId, internalId, slides]);

    // A removed uncontrolled slide yields to the first remaining slide.
    const currentId = activeId ?? (internalId && ids.has(internalId)
        ? internalId : slides[0]?.id);
    const currentIndex = slides.findIndex((slide) => slide.id === currentId);
    const currentSlide = slides[currentIndex];
    const currentSlideName = currentSlide &&
        `${currentSlide.label} (${currentIndex + 1}/${slides.length})`;

    function showSlide(id: string) {
        if (id === currentId) return;
        if (activeId === undefined) setInternalId(id);
        onActiveIdChange?.(id);
    }

    function moveBy(offset: number) {
        if (slides.length < 2) return;
        const nextIndex = currentIndex + offset;
        if (!loop && (nextIndex < 0 || nextIndex >= slides.length)) return;
        const wrappedIndex = (nextIndex + slides.length) % slides.length;
        showSlide(slides[wrappedIndex].id);
    }

    function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
        if (event.pointerType !== "touch" ||
            !(event.target instanceof Element)) {
            return;
        }
        if (event.target.closest(
            "a, button, input, select, textarea, [contenteditable='true']",
        )) return;
        touchStart.current = {
            pointerId: event.pointerId,
            x: event.clientX,
            y: event.clientY,
        };
    }

    function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
        const start = touchStart.current;
        touchStart.current = null;
        if (!start || start.pointerId !== event.pointerId) return;

        const deltaX = event.clientX - start.x;
        const deltaY = event.clientY - start.y;
        if (Math.abs(deltaX) < 48 ||
            Math.abs(deltaX) <= Math.abs(deltaY) * 1.2) return;
        const direction = getComputedStyle(event.currentTarget).direction ===
            "rtl"
            ? -1 : 1;
        moveBy(deltaX * direction > 0 ? -1 : 1);
    }

    return (
        <section
            role="region"
            aria-roledescription="carousel"
            aria-labelledby={labelId}
            className={cn(
                "min-w-0 text-foreground",
                variant === "card" &&
                    "rounded-md border border-border bg-surface p-4",
                className,
            )}
            {...props}
        >
            <div id={labelId} className="mb-3 text-sm font-semibold">
                {label}
            </div>
            {currentSlide ? (
                <>
                    <div
                        aria-live="polite"
                        aria-atomic="false"
                        className="min-w-0 touch-pan-y"
                        onPointerDown={handlePointerDown}
                        onPointerUp={handlePointerUp}
                        onPointerCancel={() => { touchStart.current = null; }}
                    >
                        <div
                            key={currentSlide.id}
                            role="group"
                            aria-roledescription="slide"
                            aria-label={currentSlideName}
                            className="min-w-0"
                        >
                            {currentSlide.content}
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                aria-label="이전 슬라이드"
                                disabled={slides.length < 2 ||
                                    (!loop && currentIndex === 0)}
                                className={focusRingClass}
                                onClick={() => moveBy(-1)}
                            >
                                <span aria-hidden="true">←</span>
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                aria-label="다음 슬라이드"
                                disabled={slides.length < 2 || (!loop &&
                                    currentIndex === slides.length - 1)}
                                className={focusRingClass}
                                onClick={() => moveBy(1)}
                            >
                                <span aria-hidden="true">→</span>
                            </Button>
                        </div>
                        <span className="text-xs tabular-nums text-muted">
                            {currentIndex + 1} / {slides.length}
                        </span>
                    </div>
                    {showIndicators && slides.length > 1 && (
                        <div
                            role="group"
                            aria-label="표시할 슬라이드 선택"
                            className="mt-2 flex flex-wrap justify-center gap-1"
                        >
                            {slides.map((slide) => {
                                const current = slide.id === currentId;
                                return (
                                    <button
                                        key={slide.id}
                                        type="button"
                                        aria-label={slide.label}
                                        aria-current={current
                                            ? "true" : undefined}
                                        aria-disabled={current}
                                        onClick={() => showSlide(slide.id)}
                                        className={cn(
                                            "grid size-7 place-items-center",
                                            "rounded-sm",
                                            focusRingClass,
                                        )}
                                    >
                                        <span aria-hidden="true" className={cn(
                                            "size-2.5 rounded-full",
                                            current
                                                ? "bg-accent" : "bg-border",
                                        )} />
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </>
            ) : (
                <p className="m-0 text-sm text-muted">{emptyMessage}</p>
            )}
        </section>
    );
}

export { Carousel };
export type { CarouselProps, CarouselSlide };
