import {
    useCallback, useEffect, useId, useRef, useState,
    type KeyboardEvent, type PointerEvent, type ReactNode,
} from "react";
import type { DesignModeId } from "@pydemia/ui";
import "./design-concept-experience.css";

type DesignConceptFrameProps = {
    design: DesignModeId;
    children: ReactNode;
    label: string;
    onSearch?: () => void;
    onOverview?: () => void;
    onRuns?: () => void;
    onHelp?: () => void;
};

const navKeys: Record<string, keyof Pick<DesignConceptFrameProps,
    "onSearch" | "onOverview" | "onRuns" | "onHelp">> = {
    "/": "onSearch",
    "1": "onOverview",
    "2": "onRuns",
    "?": "onHelp",
};

function isEditableTarget(target: EventTarget | null) {
    return target instanceof HTMLElement && (
        target.isContentEditable ||
        target.matches("input, textarea, select, [role='textbox'], [role='combobox']")
    );
}

function DesignConceptFrame({
    design, children, label, onSearch, onOverview, onRuns, onHelp,
}: DesignConceptFrameProps) {
    const frameRef = useRef<HTMLDivElement>(null);
    const pointer = useRef<{ id: number; x: number; y: number; left: number; top: number } | null>(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [narrow, setNarrow] = useState(false);
    const [windowState, setWindowState] = useState<"normal" | "minimized" | "closed" | "maximized">("normal");
    const [focusStatus, setFocusStatus] = useState("작업 공간에 포커스를 두면 단축키를 사용할 수 있습니다.");

    useEffect(() => {
        const node = frameRef.current?.parentElement;
        if (!node || typeof ResizeObserver === "undefined") return;
        const observer = new ResizeObserver(([entry]) => {
            const width = entry.contentRect.width;
            setNarrow(width <= 560);
        });
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    const finishPointer = useCallback((event: PointerEvent<HTMLElement>) => {
        if (pointer.current?.id !== event.pointerId) return;
        pointer.current = null;
        if (event.currentTarget.hasPointerCapture(event.pointerId)) {
            event.currentTarget.releasePointerCapture(event.pointerId);
        }
    }, []);

    function moveFrame(event: PointerEvent<HTMLElement>) {
        const drag = pointer.current;
        if (!drag || drag.id !== event.pointerId || narrow || windowState !== "normal") return;
        const x = drag.left + event.clientX - drag.x;
        const y = drag.top + event.clientY - drag.y;
        // The frame reserves 32px on each side; movement stays inside that gutter.
        setOffset({ x: Math.max(-24, Math.min(24, x)), y: Math.max(-24, Math.min(24, y)) });
    }

    function moveByKeyboard(event: KeyboardEvent<HTMLElement>) {
        if (narrow || event.ctrlKey || event.metaKey || event.altKey || windowState !== "normal" || isEditableTarget(event.target) ||
            (event.target instanceof Element && event.target.closest("button")) ||
            !["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
        event.preventDefault();
        const step = event.shiftKey ? 32 : 12;
        const dx = event.key === "ArrowLeft" ? -step : event.key === "ArrowRight" ? step : 0;
        const dy = event.key === "ArrowUp" ? -step : event.key === "ArrowDown" ? step : 0;
        setOffset((current) => ({
            x: Math.max(-24, Math.min(24, current.x + dx)),
            y: Math.max(-24, Math.min(24, current.y + dy)),
        }));
    }

    function terminalKeys(event: KeyboardEvent<HTMLDivElement>) {
        if (event.ctrlKey || event.metaKey || event.altKey || isEditableTarget(event.target)) return;
        const callbackKey = navKeys[event.key];
        const callback = callbackKey ? { onSearch, onOverview, onRuns, onHelp }[callbackKey] : undefined;
        if (!callback) return;
        event.preventDefault();
        callback();
    }

    const retro = design === "retro";
    const terminal = design === "terminal";
    const hidden = retro && (windowState === "minimized" || windowState === "closed");
    // Keep children on this exact React path across all modes and window states.
    return (
        <div ref={frameRef} className="concept-frame" data-concept={design}
            data-window-state={windowState} data-narrow={narrow || undefined}
            tabIndex={terminal ? 0 : undefined}
            aria-label={terminal ? label : undefined}
            role={terminal ? "region" : undefined}
            onKeyDown={terminal ? terminalKeys : undefined}
            onFocusCapture={terminal ? (event) => {
                const target = event.target;
                const fieldLabel = target instanceof HTMLInputElement
                    || target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement
                    ? target.labels?.[0]?.textContent?.trim() : undefined;
                const text = target instanceof HTMLElement
                    ? target.getAttribute("aria-label") || fieldLabel
                        || target.textContent?.trim().slice(0, 48) || "작업 공간 컨트롤"
                    : label;
                setFocusStatus(`현재 포커스: ${text}`);
            } : undefined}>
            <section className="concept-frame-window"
                aria-label={retro ? label : undefined}
                style={{ transform: retro && !narrow && windowState === "normal"
                    ? `translate(${offset.x}px, ${offset.y}px)` : undefined }}>
                    <header className="concept-retro-titlebar" hidden={!retro}
                        role="group" tabIndex={!retro || narrow ? -1 : 0}
                        aria-label={`${label} 창 이동`} aria-keyshortcuts="ArrowUp ArrowDown ArrowLeft ArrowRight"
                        onPointerDown={(event) => {
                            if (narrow || windowState !== "normal" || event.button !== 0 ||
                                (event.target instanceof Element && event.target.closest("button"))) return;
                            pointer.current = { id: event.pointerId, x: event.clientX, y: event.clientY, left: offset.x, top: offset.y };
                            event.currentTarget.setPointerCapture(event.pointerId);
                        }} onPointerMove={moveFrame} onPointerUp={finishPointer} onPointerCancel={finishPointer}
                        onKeyDown={moveByKeyboard}>
                        <span className="concept-retro-title-icon" aria-hidden="true">▣</span>
                        <span className="concept-retro-title">{label}</span>
                        <div className="concept-retro-controls">
                            <button type="button" aria-label={hidden ? "창 펼치기" : "창 최소화"} title={hidden ? "펼치기" : "최소화"}
                                onClick={() => setWindowState(hidden ? "normal" : "minimized")}>_</button>
                            <button type="button" aria-label={windowState === "maximized" ? "창 복원" : "창 최대화"}
                                title={windowState === "maximized" ? "복원" : "최대화"}
                                onClick={() => setWindowState(windowState === "maximized" ? "normal" : "maximized")}>□</button>
                            <button type="button" aria-label={hidden ? "창 다시 열기" : "창 닫기"}
                                title={hidden ? "다시 열기" : "닫기"}
                                onClick={() => setWindowState(hidden ? "normal" : "closed")}>{hidden ? "↗" : "×"}</button>
                        </div>
                    </header>
                    <div className="concept-retro-move-help" hidden={!retro}>
                        {narrow ? "좁은 화면에서는 고정된 창으로 탐색합니다." : "제목 표시줄을 끌거나 포커스 후 방향키로 이동"}
                    </div>
                    <div className="concept-frame-content" hidden={hidden}>{children}</div>
                    <p className="concept-retro-hidden-status" role="status" hidden={!hidden}>
                        창 콘텐츠가 {windowState === "minimized" ? "최소화" : "닫힘"} 상태입니다.
                    </p>
            <footer className="concept-terminal-status" hidden={!terminal}>
                <span>{focusStatus}</span>
                <span className="concept-terminal-hints"><kbd>/</kbd> 검색 <kbd>1</kbd> 개요 <kbd>2</kbd> 실행 <kbd>?</kbd> 도움말</span>
            </footer>
            </section>
        </div>
    );
}

type SkeuomorphicPeriodDialProps = {
    value: "week" | "month";
    onChange: (value: "week" | "month") => void;
};

function SkeuomorphicPeriodDial({ value, onChange }: SkeuomorphicPeriodDialProps) {
    const month = value === "month";
    const id = useId();
    return <section className="concept-skeuo-dial" aria-label="기간 다이얼">
        <div className="concept-skeuo-gauge" aria-hidden="true">
            <svg viewBox="0 0 160 160" role="presentation">
                <defs>
                    <radialGradient id={`${id}-metal`} cx="35%" cy="25%">
                        <stop offset="0" stopColor="#fff9df" />
                        <stop offset=".56" stopColor="#d8c8a4" />
                        <stop offset="1" stopColor="#75694f" />
                    </radialGradient>
                </defs>
                <circle cx="80" cy="80" r="73" className="concept-skeuo-rim" />
                <circle cx="80" cy="80" r="65" className="concept-skeuo-face" />
                {[...Array(9)].map((_, index) => {
                    const angle = (135 + index * 33.75) * Math.PI / 180;
                    const x1 = 80 + Math.cos(angle) * 51;
                    const y1 = 80 + Math.sin(angle) * 51;
                    const x2 = 80 + Math.cos(angle) * 59;
                    const y2 = 80 + Math.sin(angle) * 59;
                    return <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} className="concept-skeuo-tick" />;
                })}
                <text x="28" y="118" className="concept-skeuo-mark">7D</text>
                <text x="118" y="118" className="concept-skeuo-mark">28D</text>
                <g className="concept-skeuo-needle" transform={`rotate(${month ? 135 : -135} 80 80)`}>
                    <path d="M80 36 L75 82 L80 91 L85 82 Z" fill="#9b3024" />
                </g>
                <circle cx="80" cy="80" r="10" fill={`url(#${id}-metal)`} className="concept-skeuo-hub" />
            </svg>
        </div>
        <p className="concept-skeuo-value" aria-live="polite">{month ? "최근 4주 · 28일" : "최근 7일 · 7일"}</p>
        <label className="concept-skeuo-range-label" htmlFor={id}>기간 다이얼</label>
        <input id={id} className="concept-skeuo-range" type="range" min="7" max="28" step="21"
            value={month ? 28 : 7} aria-label="기간 다이얼" aria-valuetext={month ? "최근 4주, 28일" : "최근 7일, 7일"}
            onChange={(event) => onChange(event.currentTarget.value === "28" ? "month" : "week")} />
        <div className="concept-skeuo-range-labels" aria-hidden="true"><span>최근 7일</span><span>최근 4주</span></div>
    </section>;
}

type PixelQuestProgressProps = {
    completed: number;
    total: number;
    running: number;
    failed: number;
};

function TerminalActivityTable({ points }: {
    points: readonly { label: string; value: number }[];
}) {
    const peak = Math.max(1, ...points.map((point) => point.value));
    return <figure className="concept-terminal-plot" aria-label="기간별 문자 그래프">
        <figcaption>기간별 완료 작업 / 건</figcaption>
        <div className="concept-terminal-plot-scroll" tabIndex={0}
            role="region" aria-label="문자 그래프 가로 스크롤">
            <table aria-label="기간별 작업 수">
                <thead><tr><th scope="col">구간</th><th scope="col">추세</th><th scope="col">건수</th></tr></thead>
                <tbody>{points.map((point) => <tr key={point.label}>
                    <th scope="row">{point.label}</th>
                    <td><span aria-hidden="true">{"#".repeat(Math.round(point.value / peak * 24))}</span></td>
                    <td>{point.value.toLocaleString()}</td>
                </tr>)}</tbody>
            </table>
        </div>
    </figure>;
}

function PixelQuestProgress({ completed, total, running, failed }: PixelQuestProgressProps) {
    const safeTotal = Math.max(0, Math.floor(total));
    const safeCompleted = Math.max(0, Math.min(safeTotal, Math.floor(completed)));
    const safeRunning = Math.max(0, Math.floor(running));
    const safeFailed = Math.max(0, Math.floor(failed));
    const percent = safeTotal ? Math.round((safeCompleted / safeTotal) * 100) : 0;
    return <section className="concept-pixel-quest" aria-label="작업 진행 현황">
        <div className="concept-pixel-quest-heading">
            <svg className="concept-pixel-sprite" viewBox="0 0 32 32" role="img" aria-label="작업 탐험가">
                <path shapeRendering="crispEdges" fill="#17283d" d="M8 2h16v4h4v8h-4v4h4v10h-6v-6h-4v10h-6v-10h-4v6H6V18h4v-4H6V6h2z" />
                <path shapeRendering="crispEdges" fill="#f1c75b" d="M10 6h12v8H10zM12 8h2v2h-2zm6 0h2v2h-2z" />
                <path shapeRendering="crispEdges" fill="#4a9b72" d="M10 18h12v4H10zM12 26h2v4h-2zm8 0h2v4h-2z" />
            </svg>
            <div><p className="concept-pixel-kicker">작업 진행 지도</p><h3>최근 실행 퀘스트</h3></div>
        </div>
        <div className="concept-pixel-count"><strong>{safeCompleted}</strong><span> / {safeTotal} 완료</span><span className="concept-pixel-percent">{percent}%</span></div>
        <div className="concept-pixel-progress" role="progressbar" aria-label="완료된 작업"
            aria-valuemin={0} aria-valuemax={safeTotal} aria-valuenow={safeCompleted}
            aria-valuetext={`${safeCompleted} / ${safeTotal}개 완료`}>
            <svg viewBox="0 0 120 12" preserveAspectRatio="none" aria-hidden="true">
                <rect x="0" y="0" width="120" height="12" fill="#29394b" />
                {Array.from({ length: 12 }, (_, index) => {
                    const filled = index < Math.round(percent / (100 / 12));
                    return <rect key={index} x={index * 10 + 1} y="1" width="8" height="10"
                        fill={filled ? "#9be26c" : "#46576b"} shapeRendering="crispEdges" />;
                })}
            </svg>
        </div>
        <div className="concept-pixel-statuses">
            <span><i className="concept-pixel-dot" data-status="running" aria-hidden="true" />실행 중 <strong>{safeRunning}</strong></span>
            <span><i className="concept-pixel-dot" data-status="failed" aria-hidden="true" />실패 <strong>{safeFailed}</strong></span>
        </div>
        <p className="concept-pixel-note">최근 실행의 상태를 반영합니다.</p>
    </section>;
}

export { DesignConceptFrame, PixelQuestProgress, SkeuomorphicPeriodDial, TerminalActivityTable };
