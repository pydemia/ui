import {
    useEffect, useId, useRef, useState,
    type ComponentProps, type ReactNode,
} from "react";
import { Button } from "./button";
import { cn } from "./utils";

type MasterDetailItem = {
    id: string;
    title: string;
    description?: string;
    meta?: string;
    disabled?: boolean;
};

type MasterDetailProps = Omit<ComponentProps<"section">, "children"> & {
    label: string;
    items: readonly MasterDetailItem[];
    selectedId?: string | null;
    defaultSelectedId?: string | null;
    onSelectedIdChange?: (id: string) => void;
    renderDetail: (item: MasterDetailItem) => ReactNode;
    emptyList?: ReactNode;
    emptyDetail?: ReactNode;
    backLabel?: string;
};

function MasterDetail({
    label,
    items,
    selectedId,
    defaultSelectedId = null,
    onSelectedIdChange,
    renderDetail,
    emptyList = "항목이 없습니다.",
    emptyDetail = "항목을 선택하세요.",
    backLabel = "목록으로",
    className,
    ...props
}: MasterDetailProps) {
    if (typeof label !== "string" || !label.trim()) {
        throw new Error("MasterDetail requires a label.");
    }
    if (typeof backLabel !== "string" || !backLabel.trim()) {
        throw new Error("MasterDetail requires a back label.");
    }
    if (!Array.isArray(items) || typeof renderDetail !== "function") {
        throw new Error("MasterDetail requires items and renderDetail.");
    }
    const ids = new Set<string>();
    for (const item of items) {
        if (!item || typeof item.id !== "string" || !item.id.trim() ||
            typeof item.title !== "string" || !item.title.trim() ||
            ids.has(item.id)) {
            throw new Error("MasterDetail items need unique IDs and titles.");
        }
        ids.add(item.id);
    }

    const [internalSelectedId, setInternalSelectedId] = useState(
        defaultSelectedId,
    );
    const [mobileDetailId, setMobileDetailId] = useState<string | null>(null);
    const activeId = selectedId === undefined
        ? internalSelectedId : selectedId;
    const activeItem = items.find((item) => item.id === activeId) ?? null;
    const mobileDetailVisible = activeItem !== null &&
        mobileDetailId === activeItem.id;
    const detailId = useId();
    const listRef = useRef<HTMLDivElement>(null);
    const detailRef = useRef<HTMLElement>(null);
    const selectedButtonRef = useRef<HTMLButtonElement>(null);
    const focusTarget = useRef<"detail" | "list" | null>(null);

    useEffect(() => {
        if (focusTarget.current === "detail" && mobileDetailVisible) {
            if (listRef.current?.getClientRects().length === 0) {
                detailRef.current?.focus();
            }
            focusTarget.current = null;
        } else if (focusTarget.current === "list" &&
            !mobileDetailVisible) {
            const selectedButton = selectedButtonRef.current;
            (selectedButton && !selectedButton.disabled
                ? selectedButton : listRef.current)?.focus();
            focusTarget.current = null;
        }
    }, [activeId, mobileDetailId, mobileDetailVisible]);

    function selectItem(id: string) {
        if (id !== activeId) {
            if (selectedId === undefined) setInternalSelectedId(id);
            onSelectedIdChange?.(id);
        }
        focusTarget.current = "detail";
        setMobileDetailId(id);
    }

    return (
        <section
            aria-label={label}
            className={cn(
                "@container min-w-0 overflow-hidden rounded-sm border " +
                "border-border bg-surface text-foreground",
                className,
            )}
            {...props}
        >
            <div className={
                "grid min-h-72 @2xl:grid-cols-[minmax(14rem,35%)_minmax(0,1fr)]"
            }>
                <div
                    ref={listRef}
                    tabIndex={-1}
                    role="region"
                    aria-label={`${label} 목록`}
                    className={cn(
                        "min-w-0 border-border @2xl:border-r",
                        mobileDetailVisible && "hidden @2xl:block",
                    )}
                >
                    <div className={
                        "border-b border-border p-[var(--space-3)]"
                    }>
                        <h3 className="m-0 text-sm font-semibold">{label}</h3>
                    </div>
                    {items.length === 0 ? (
                        <div className="p-[var(--space-4)] text-sm text-muted">
                            {emptyList}
                        </div>
                    ) : (
                        <ul className="m-0 list-none divide-y divide-border p-0">
                            {items.map((item) => (
                                <li key={item.id}>
                                    <button
                                        ref={item.id === activeId
                                            ? selectedButtonRef : undefined}
                                        type="button"
                                        disabled={item.disabled}
                                        aria-current={item.id === activeId
                                            ? "true" : undefined}
                                        aria-controls={detailId}
                                        onClick={() => selectItem(item.id)}
                                        className={cn(
                                            "grid w-full min-w-0 gap-1 px-[var(--space-3)] " +
                                            "py-[var(--space-3)] text-left text-sm " +
                                            "hover:bg-surface-subtle " +
                                            "focus-visible:outline-2 " +
                                            "focus-visible:outline-focus " +
                                            "disabled:cursor-not-allowed " +
                                            "disabled:opacity-50",
                                            item.id === activeId &&
                                                "bg-surface-subtle",
                                        )}
                                    >
                                        <span className="min-w-0 break-words font-medium">
                                            {item.title}
                                        </span>
                                        {item.description && (
                                            <span className={
                                                "min-w-0 break-words text-muted"
                                            }>
                                                {item.description}
                                            </span>
                                        )}
                                        {item.meta && (
                                            <span className="text-xs text-muted">
                                                {item.meta}
                                            </span>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <section
                    ref={detailRef}
                    id={detailId}
                    tabIndex={-1}
                    aria-label={activeItem
                        ? `${activeItem.title} 상세` : `${label} 상세`}
                    className={cn(
                        "min-w-0 outline-none focus-visible:ring-2 " +
                        "focus-visible:ring-inset focus-visible:ring-focus",
                        !mobileDetailVisible && "hidden @2xl:block",
                    )}
                >
                    <div className="border-b border-border p-[var(--space-3)] @2xl:hidden">
                        <Button variant="ghost" onClick={() => {
                            focusTarget.current = "list";
                            setMobileDetailId(null);
                        }}>
                            <span aria-hidden="true">←</span> {backLabel}
                        </Button>
                    </div>
                    <div className="min-w-0 p-[var(--space-4)]">
                        {activeItem ? renderDetail(activeItem) : emptyDetail}
                    </div>
                </section>
            </div>
        </section>
    );
}

export { MasterDetail };
export type { MasterDetailItem, MasterDetailProps };
