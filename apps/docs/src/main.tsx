import { createRoot } from "react-dom/client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Github, Moon, Sun } from "lucide-react";
import {
    Badge, ColorInput, Snippet, SnippetContent, SnippetCopyButton,
    colorTokens, colormaps, getDesignMode, resolveThemeTokens, writeThemeUrl,
    applyThemeToElement, parseThemeUrl,
    type ColorToken, type PaletteId,
    SnippetHeader, SnippetTabsList, SnippetTabsTrigger,
    Popover, PopoverContent, PopoverTrigger,
} from "@pydemia/ui";
import provenance from "../../../registry/provenance.json";
import { AnalyticsWorkspace } from "./analytics-workspace";
import { IntakeWorkspace } from "./intake-workspace";
import { ReviewWorkspace } from "./review-workspace";
import { FlowWorkspace } from "./flow-workspace";
import { catalog } from "./catalog";
import { ComponentGuidePanel } from "./component-guides";
import { useThemeController } from "./theme/controller";
import { useProfileBridge } from "./theme/profile-bridge";
import { DesignModePicker } from "./components/design-mode-picker";
import "@pydemia/ui/design-modes.css";
import "./styles.css";

const hexColor = /^#[0-9a-fA-F]{6}$/;
const profilePath = import.meta.env.DEV ? "profile-qa.html" : "examples/profile/index.html";
const contrastPairs = [
    { name: "본문", foreground: "--foreground", background: "--background" },
    { name: "Accent", foreground: "--accent-foreground", background: "--accent" },
    { name: "Success", foreground: "--success", background: "--surface" },
    { name: "Warning", foreground: "--warning", background: "--surface" },
    {
        name: "User message", foreground: "--message-user-foreground",
        background: "--message-user-background",
    },
] as const;

const analyticsItems = [
    "app-shell", "navigation", "badge", "button", "content-list",
    "dashboard", "data-chart", "data-table", "log-console",
    "metric-card", "native-select", "page-header",
];

const reviewItems = [
    "approval-card", "badge", "diff-viewer", "master-detail",
    "native-select", "page-header", "search-input", "thread",
];

const intakeItems = [
    "badge", "data-list", "data-table", "date-range-picker", "field",
    "file-upload", "form-wizard", "input", "native-select", "page-header",
];

function expandHex(value: string) {
    const color = value.trim().toLowerCase();
    if (/^#[0-9a-f]{3}$/.test(color)) {
        return `#${[...color.slice(1)].map((digit) => digit + digit).join("")}`;
    }
    return color;
}

function contrastRatio(first: string, second: string) {
    if (!hexColor.test(first) || !hexColor.test(second)) return null;
    const luminance = (hex: string) => {
        const channels = [1, 3, 5].map((start) => {
            const value = parseInt(hex.slice(start, start + 2), 16) / 255;
            return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
        });
        return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    };
    const brighter = Math.max(luminance(first), luminance(second));
    const darker = Math.min(luminance(first), luminance(second));
    return (brighter + 0.05) / (darker + 0.05);
}

const categoryOrder = [
    "Framework", "Navigation", "Workflow", "Layout", "Content",
    "Actions", "Inputs",
    "Selection", "Date & time", "Overlays", "Feedback",
    "Data display", "Data & analytics", "File & media",
    "Developer tools", "AI & agent",
];
const sidebarCategories = [...new Set(catalog.map((entry) => entry.category))]
    .sort((first, second) => {
        const firstIndex = categoryOrder.indexOf(first);
        const secondIndex = categoryOrder.indexOf(second);
        const firstRank = firstIndex < 0 ? Infinity : firstIndex;
        const secondRank = secondIndex < 0 ? Infinity : secondIndex;
        return firstRank - secondRank || first.localeCompare(second);
    });

function App() {
    const [selectedId, setSelectedId] = useState(() => {
        const fromUrl = new URLSearchParams(window.location.search).get("component");
        return catalog.some((entry) => entry.id === fromUrl) ? fromUrl! : "button";
    });
    const [menuCategory, setMenuCategory] = useState(() =>
        catalog.find((entry) => entry.id === selectedId)?.category ??
        sidebarCategories[0],
    );
    const [componentMenuOpen, setComponentMenuOpen] = useState(false);
    const theme = useThemeController({ allowUnreleased: import.meta.env.DEV });
    const { settings, notice, resetOverrides } = theme;
    const { colormap, overrides, appearance: mode } = settings;
    const dark = mode === "dark";
    const values = Object.fromEntries(Object.entries(theme.values).map(([token, value]) => [token, expandHex(value)]));
    const shape = resolveThemeTokens(settings, { allowUnreleased: import.meta.env.DEV });
    const exampleFrame = useRef<HTMLIFrameElement>(null);
    const profileBridge = useProfileBridge(exampleFrame, settings, theme.revision,
        { allowUnreleased: import.meta.env.DEV });
    const sidebarInner = useRef<HTMLDivElement>(null);
    const mobileScroll = useRef<{ pageY: number; sidebarX: number } | null>(null);
    const mobileRestoreFrame = useRef<number | null>(null);
    const pointerScroll = useRef<{
        id: string; pageY: number; sidebarX: number;
    } | null>(null);
    const hasOverrides = Object.values(overrides).some(
        (colors) => Object.keys(colors).length > 0,
    );
    const selected = catalog.find((entry) => entry.id === selectedId)!;
    const menuItems = catalog.filter((entry) => entry.category === menuCategory);
    const record = provenance.items.find((item) => item.name === `pyd-${selectedId}`)!;
    const implementationUrl = record.source.upstream ??
        `https://github.com/pydemia/ui/blob/main/packages/ui/src/components/${selected.id}.tsx`;
    const reference = "reference" in record ? record.reference : undefined;
    const registryUrls = (selected.installItems ?? [selected.id])
        .map((item) => new URL(
            `${import.meta.env.BASE_URL}r/pyd-${item}.json`,
            window.location.origin,
        ).href)
        .join(" ");
    const tokensUrl = new URL(`${import.meta.env.BASE_URL}r/pyd-tokens.json`, window.location.origin).href;
    const designModesUrl = new URL(`${import.meta.env.BASE_URL}r/pyd-design-modes.json`, window.location.origin).href;
    const analyticsUrls = analyticsItems.map((item) => new URL(
        `${import.meta.env.BASE_URL}r/pyd-${item}.json`,
        window.location.origin,
    ).href).join(" ");
    const reviewUrls = reviewItems.map((item) => new URL(
        `${import.meta.env.BASE_URL}r/pyd-${item}.json`,
        window.location.origin,
    ).href).join(" ");
    const intakeUrls = intakeItems.map((item) => new URL(
        `${import.meta.env.BASE_URL}r/pyd-${item}.json`,
        window.location.origin,
    ).href).join(" ");
    const exampleUrl = writeThemeUrl(new URL(
        `${import.meta.env.BASE_URL}${profilePath}`,
        window.location.origin,
    ), settings, { allowUnreleased: import.meta.env.DEV });

    useEffect(() => {
        const handleHistory = () => {
            const id = new URLSearchParams(window.location.search).get("component");
            const entry = catalog.find((item) => item.id === id) ?? catalog.find((item) => item.id === "button")!;
            setSelectedId(entry.id);
            setMenuCategory(entry.category);
        };
        window.addEventListener("popstate", handleHistory);
        return () => window.removeEventListener("popstate", handleHistory);
    }, []);

    function restoreMobileScroll(position: { pageY: number; sidebarX: number }) {
        document.scrollingElement?.scrollTo({
            top: position.pageY, behavior: "instant",
        });
        sidebarInner.current?.scrollTo({
            left: position.sidebarX, behavior: "instant",
        });
    }

    function restoreMobileScrollNextFrame(position: {
        pageY: number; sidebarX: number;
    }) {
        if (mobileRestoreFrame.current !== null) {
            cancelAnimationFrame(mobileRestoreFrame.current);
        }
        mobileRestoreFrame.current = requestAnimationFrame(() => {
            mobileRestoreFrame.current = null;
            if (window.matchMedia("(max-width: 850px)").matches) {
                restoreMobileScroll(position);
            }
        });
    }

    useEffect(() => () => {
        if (mobileRestoreFrame.current !== null) {
            cancelAnimationFrame(mobileRestoreFrame.current);
        }
    }, []);

    useLayoutEffect(() => {
        const position = mobileScroll.current;
        if (!position) return;
        mobileScroll.current = null;
        restoreMobileScroll(position);
        restoreMobileScrollNextFrame(position);
    }, [selectedId]);

    function selectComponent(id: string, scrollToComponent = true) {
        if (!scrollToComponent) {
            const pointer = pointerScroll.current?.id === id
                ? pointerScroll.current : null;
            const position = {
                pageY: pointer?.pageY ??
                    (document.scrollingElement?.scrollTop ?? window.scrollY),
                sidebarX: pointer?.sidebarX ??
                    (sidebarInner.current?.scrollLeft ?? 0),
            };
            if (id !== selectedId) mobileScroll.current = position;
            else {
                restoreMobileScroll(position);
                restoreMobileScrollNextFrame(position);
            }
        }
        pointerScroll.current = null;
        setSelectedId(id);
        setMenuCategory(catalog.find((entry) => entry.id === id)!.category);
        setComponentMenuOpen(false);
        const url = new URL(window.location.href);
        url.searchParams.set("component", id);
        if (scrollToComponent) url.hash = "components";
        else if (url.hash === "#components") url.hash = "";
        window.history.pushState({}, "", url);
        if (scrollToComponent) {
            document.getElementById("components")?.scrollIntoView({ behavior: "smooth" });
        }
    }

    function captureMobilePointerScroll(id: string) {
        if (!window.matchMedia("(max-width: 850px)").matches) return;
        pointerScroll.current = {
            id,
            pageY: document.scrollingElement?.scrollTop ?? window.scrollY,
            sidebarX: sidebarInner.current?.scrollLeft ?? 0,
        };
    }

    function selectColormap(id: PaletteId) { theme.setColormap(id); }
    function toggleDark() { theme.setAppearance(dark ? "light" : "dark"); }
    function setColor(token: ColorToken, value: string) { theme.setOverride(token, value); }

    if (location.pathname === "/flows" || location.pathname.startsWith("/flows/")) {
        return <div className="site-shell">
            <a className="skip-link" href="#flow-main">본문으로 이동</a>
            <header className="topbar">
                <div className="topbar-inner">
                    <a href="/" className="wordmark" aria-label="pydemia UI 컴포넌트">
                        <img className="brand-mark" src="/favicon.svg" width="38" height="38" alt="" />
                        <span>pydemia <span className="wordmark-light">/ ui</span></span>
                    </a>
                    <span className="version">v0.1.0 · prototype</span>
                    <nav className="top-nav" aria-label="상단 탐색">
                        <a className="top-nav-flow" href="/">Components</a>
                        <a className="top-nav-flow" href="/flows/" aria-current="page">Flows</a>
                        <a className="top-nav-secondary" href="/prism">PRISM</a>
                        <a className="github-link" href="https://github.com/pydemia/ui"
                            target="_blank" rel="noreferrer">
                            <Github size={17} aria-hidden="true" /> GitHub
                            <ArrowUpRight size={14} aria-hidden="true" />
                        </a>
                    </nav>
                    <DesignModePicker settings={settings} onCommit={theme.commitDesign}
                        getCandidateSettings={theme.previewDesign} allowUnreleased={import.meta.env.DEV} />
                    <button className="theme-button" type="button"
                        aria-label={dark ? "라이트 모드로 전환" : "다크 모드로 전환"}
                        onClick={toggleDark}>{dark ? <Sun size={18} /> : <Moon size={18} />}</button>
                </div>
            </header>
            {notice && <p role="status" className="px-4 text-sm">{notice}</p>}
            <FlowWorkspace />
        </div>;
    }
    return (
        <div className="site-shell">
            <a className="skip-link" href="#main">본문으로 이동</a>
            <header className="topbar">
                <div className="topbar-inner">
                    <a href="#overview" className="wordmark" aria-label="pydemia UI 개요">
                        <img
                            className="brand-mark"
                            src={`${import.meta.env.BASE_URL}favicon.svg`}
                            width="38"
                            height="38"
                            alt=""
                        />
                        <span>pydemia <span className="wordmark-light">/ ui</span></span>
                    </a>
                    <span className="version">v0.1.0 · prototype</span>
                    <nav className="top-nav" aria-label="상단 탐색">
                        <Popover open={componentMenuOpen}
                            onOpenChange={setComponentMenuOpen}>
                            <PopoverTrigger asChild>
                                <button className="component-menu-trigger" type="button">
                                    Components
                                    <ChevronDown size={14} aria-hidden="true" />
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="component-menu" align="end"
                                sideOffset={10} aria-label="Components">
                                <div className="component-menu-categories"
                                    role="group" aria-label="컴포넌트 분류">
                                    {sidebarCategories.map((category) => (
                                        <button key={category} type="button"
                                            aria-current={menuCategory === category
                                                ? "true" : undefined}
                                            onClick={() => setMenuCategory(category)}>
                                            <span>{category}</span>
                                            <span className="component-menu-count">
                                                {catalog.filter((entry) =>
                                                    entry.category === category).length}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                <div className="component-menu-detail">
                                    <div className="component-menu-heading">
                                        <strong>{menuCategory}</strong>
                                        <span>{menuItems.length} components</span>
                                    </div>
                                    <div className="component-menu-items">
                                        {menuItems.map((entry) => (
                                            <a key={entry.id}
                                                href={`?component=${entry.id}#components`}
                                                aria-current={entry.id === selectedId
                                                    ? "page" : undefined}
                                                onClick={(event) => {
                                                    if (event.button !== 0 || event.metaKey ||
                                                        event.ctrlKey || event.shiftKey ||
                                                        event.altKey) return;
                                                    event.preventDefault();
                                                    selectComponent(entry.id);
                                                }}>
                                                {entry.name}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                        <a className="top-nav-flow" href="/flows/">Flows</a>
                        <a className="top-nav-secondary" href="/prism">PRISM</a>
                        <a className="top-nav-secondary" href="#colormap">Colormap</a>
                        <a className="top-nav-secondary" href="#tokens">Tokens</a>
                        <a className="top-nav-secondary" href="#examples">Examples</a>
                        <a className="github-link" href="https://github.com/pydemia/ui"
                            target="_blank" rel="noreferrer">
                            <Github size={17} aria-hidden="true" /> GitHub
                            <ArrowUpRight size={14} aria-hidden="true" />
                        </a>
                    </nav>
                    <DesignModePicker settings={settings} onCommit={theme.commitDesign}
                        getCandidateSettings={theme.previewDesign} allowUnreleased={import.meta.env.DEV} />
                    <button className="theme-button" type="button" aria-label={dark ? "라이트 모드로 전환" : "다크 모드로 전환"} onClick={toggleDark}>{dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}</button>
                </div>
            </header>

            <div className="layout">
                <aside className="sidebar" aria-label="컴포넌트 목록">
                    <div className="sidebar-inner" ref={sidebarInner}>
                        <a href="#overview" className="sidebar-overview">Overview</a>
                        {sidebarCategories.map((category) => (
                            <div key={category}>
                                <p className="sidebar-label">{category}</p>
                                {catalog.filter((entry) => entry.category === category)
                                    .map((entry) =>
                                        <button
                                            key={entry.id}
                                            type="button"
                                            aria-current={entry.id === selectedId ? "page" : undefined}
                                            className={`sidebar-item${entry.id === selectedId ? " selected" : ""}`}
                                            onPointerDown={() => captureMobilePointerScroll(entry.id)}
                                            onPointerCancel={() => { pointerScroll.current = null; }}
                                            onClick={(event) => {
                                                if (event.detail === 0) pointerScroll.current = null;
                                                const mobile = window.matchMedia(
                                                    "(max-width: 850px)",
                                                ).matches;
                                                // A pointer focus can scroll the page after selection.
                                                if (mobile &&
                                                    pointerScroll.current?.id === entry.id) {
                                                    event.currentTarget.blur();
                                                }
                                                selectComponent(
                                                    entry.id, !mobile,
                                                );
                                            }}>
                                            {entry.name}
                                        </button>,
                                    )}
                            </div>
                        ))}
                        <div className="sidebar-lower"><a href="#colormap">Colormap</a><a href="#tokens">Design tokens</a><a href="#examples">Profile example</a><a href="#analytics-example">Operations workspace</a><a href="#review-example">Review workspace</a><a href="#intake-example">Intake workspace</a><a href="#installation">Using the source</a></div>
                    </div>
                </aside>

                <main id="main" className="main-content">
                    {notice && <p className="theme-notice" role="status">{notice}</p>}
                    <section id="overview" className="intro" aria-labelledby="page-heading">
                        <div className="eyebrow"><span className="eyebrow-line" /> DESIGN SYSTEM / OPEN CODE</div>
                        <div className="intro-head"><div><h1 id="page-heading">pydemia UI</h1><p>소스 코드를 직접 관리하는 React 컴포넌트와 검토된 내부 registry입니다.<br className="desktop-break" /> 같은 토큰을 쓰는 컴포넌트, 코드, 실제 사용 예시를 한곳에서 확인할 수 있습니다.</p></div><div className="intro-count"><strong>{String(catalog.length).padStart(2, "0")}</strong><span>COMPONENTS<br />IN THE PROTOTYPE</span></div></div>
                        <div className="intro-meta"><span>React 19</span><span>Tailwind CSS 4</span><span>shadcn registry</span><span>source owned</span></div>
                    </section>

                    <section id="components" className="doc-section" aria-labelledby="component-heading">
                        <div className="section-lead"><div><p className="section-index">01 / COMPONENT LIBRARY</p><h2 id="component-heading">{selected.name}</h2><p>{selected.description}</p></div><Badge>{selected.category}</Badge></div>
                        <div className="component-grid"
                            data-wide={[
                                "app-shell", "data-chart", "dashboard",
                                "data-table", "gantt", "scatter-chart",
                                "calendar-heatmap", "sankey-chart",
                                "resizable-panels",
                                "sidebar", "stepper",
                            ].includes(selected.id) ? "true" : undefined}>
                            <div className="preview-panel"><div className="panel-caption"><span>LIVE PREVIEW</span><span>{getDesignMode(settings.design).name} · {mode}</span></div><div className="preview-stage"><div className="preview-content">{selected.preview()}</div></div></div>
                            <div className="code-panel"><div className="panel-caption"><span>REACT / TSX</span><span>Copy ready</span></div><Snippet className="docs-snippet" defaultValue="usage"><SnippetHeader><SnippetTabsList aria-label="코드 예시"><SnippetTabsTrigger value="usage">Usage</SnippetTabsTrigger></SnippetTabsList><SnippetCopyButton value={selected.code} /></SnippetHeader><SnippetContent value="usage">{selected.code}</SnippetContent></Snippet></div>
                        </div>
                        <ComponentGuidePanel id={selected.id} />
                        <div className="component-meta">
                            <div>
                                <span className="meta-label">SOURCE</span>
                                <a href={implementationUrl} target="_blank" rel="noreferrer">
                                    {record.source.provider}
                                    <ArrowUpRight size={13} aria-hidden="true" />
                                </a>
                            </div>
                            {reference && <div>
                                <span className="meta-label">DESIGN REFERENCE</span>
                                <a href={reference.url} target="_blank" rel="noreferrer">
                                    {reference.provider}
                                    <ArrowUpRight size={13} aria-hidden="true" />
                                </a>
                            </div>}
                            <div>
                                <span className="meta-label">LICENSE</span>
                                <strong>{record.source.license === "project-owned"
                                    ? "공개 사용 조건 미지정"
                                    : record.source.license}</strong>
                            </div>
                            <div>
                                <span className="meta-label">ACCESSIBILITY</span>
                                <span>{record.accessibility.keyboard === "pending browser check" ? "키보드·스크린리더 검증 대기" : record.accessibility.semantics}</span>
                            </div>
                        </div>
                        <p className="section-note">예시는 실제 <code>@pydemia/ui</code> 컴포넌트를 사용합니다. 접근성 상태는 <a href="https://github.com/pydemia/ui/blob/main/registry/provenance.json" target="_blank" rel="noreferrer">provenance metadata</a>에 기록합니다.</p>
                    </section>

                    <section id="colormap" className="doc-section" aria-labelledby="colormap-heading">
                        <div className="section-lead">
                            <div>
                                <p className="section-index">02 / COLORMAP</p>
                                <h2 id="colormap-heading">Color design</h2>
                                <p>Colormap을 선택하거나 hex 값을 바꾸면 문서와 컴포넌트 preview에 바로 적용됩니다. 밝은 모드와 어두운 모드의 직접 조정값은 각각 유지됩니다.</p>
                            </div>
                        </div>
                        <div className="colormap-grid" role="group" aria-label="Colormap 선택">
                            <button className="colormap-option" type="button"
                                aria-pressed={colormap === "design"} onClick={() => selectColormap("design")}>
                                <span className="colormap-preview" aria-hidden="true">
                                    {(getDesignMode(settings.design).defaultColormap?.swatches[mode]
                                        ?? ["--background", "--accent", "--message-user-background"].map((token) => getDesignMode(settings.design).palettes[mode][token as ColorToken]))
                                        .map((color, index) => <span key={index} style={{ background: color }} />)}
                                </span><strong>Design default</strong><small>{getDesignMode(settings.design).defaultColormap?.name ?? "기존 Neutral 팔레트"}</small>
                            </button>
                            {colormaps.map((option) => (
                                <button
                                    key={option.id}
                                    className="colormap-option"
                                    type="button"
                                    aria-pressed={colormap === option.id}
                                    onClick={() => selectColormap(option.id)}
                                >
                                    <span className="colormap-preview" aria-hidden="true">
                                        {option.colors[mode].map((color) => (
                                            <span key={color} style={{ background: color }} />
                                        ))}
                                    </span>
                                    <strong>{option.name}</strong>
                                    <small>{option.description}</small>
                                </button>
                            ))}
                        </div>
                        {getDesignMode(settings.design).defaultColormap && <p className="section-note">
                            {getDesignMode(settings.design).defaultColormap!.name} · 시안의 기준색에서 만든 디자인 전용 팔레트입니다. {" "}
                            <a className="text-link" href={`/colormaps/design/${settings.design}-${mode}.json`} download>Colors 프로젝트 JSON 받기</a>{" · "}
                            <a className="text-link" href="https://colors.pydemia.ai/" target="_blank" rel="noreferrer">Colors에서 다듬기 ↗</a>
                            {" · JSON 가져오기로 기준색·역할색을 그대로 이어서 편집할 수 있습니다."}
                        </p>}
                        <div className="colormap-editor">
                            <div>
                                <h3>Hex 직접 조정</h3>
                                <p>현재 {dark ? "어두운" : "밝은"} 모드의 색상을 편집합니다. 6자리 hex 값을 입력하거나 색상 선택기를 사용하세요.</p>
                            </div>
                            <button
                                className="colormap-reset"
                                type="button"
                                disabled={!hasOverrides}
                                onClick={resetOverrides}
                            >직접 조정 초기화</button>
                            <button className="colormap-reset" type="button" onClick={theme.restoreColorProfile}>저장한 색상 조정 복원</button>
                            <button className="colormap-reset" type="button" onClick={theme.resetTheme}>전체 테마 초기화</button>
                        </div>
                        <div className="colormap-fields">
                            {colorTokens.map(({ name, token }) => (
                                <ColorInput
                                    key={`${mode}-${token}`}
                                    label={name}
                                    value={values[token] ?? "#000000"}
                                    onValueChange={(next) => setColor(token, next)}
                                >
                                    <code className="col-span-2 break-all text-[10px] text-muted">
                                        {token} → {token.replace("--", "--palette-")}
                                    </code>
                                </ColorInput>
                            ))}
                        </div>
                        <div className="contrast-grid" aria-label="텍스트 대비">
                            {contrastPairs.map((pair) => {
                                const ratio = contrastRatio(
                                    values[pair.foreground] ?? "",
                                    values[pair.background] ?? "",
                                );
                                return <div key={pair.name}>
                                    <span>{pair.name}</span>
                                    <strong>{ratio === null ? "—" : `${ratio.toFixed(1)}:1`}</strong>
                                    {ratio !== null && ratio < 4.5 && <small>일반 텍스트 대비 부족</small>}
                                </div>;
                            })}
                        </div>
                    </section>

                    <section id="tokens" className="doc-section tokens-section" aria-labelledby="tokens-heading"><div className="section-lead"><div><p className="section-index">03 / DESIGN TOKENS</p><h2 id="tokens-heading">Color & density</h2><p>컴포넌트와 예시 화면이 공유하는 semantic token입니다. 상단의 테마 버튼으로 light/dark 값을 비교할 수 있습니다.</p></div></div>
                        <div className="swatch-grid">{colorTokens.map(({ name, token }) => <div className="swatch" key={token}><div className="swatch-color" style={{ background: `var(${token})` }} /><div className="swatch-info"><strong>{name}</strong><code>{token}</code><span>{values[token] ?? "—"}</span></div></div>)}</div>
                        <div className="token-detail"><div><span className="meta-label">RADIUS</span><strong>{shape["--radius"]}</strong><span>컴포넌트 기본 radius</span></div><div><span className="meta-label">CONTROL</span><strong>{shape["--density-control-height"]}</strong><span>기본 입력 및 버튼 높이</span></div><div><span className="meta-label">SHADOW</span><strong>{shape["--shadow-float"]}</strong><span>부유 표면에만 사용</span></div><div><span className="meta-label">MOTION</span><strong>{shape["--motion-fast"]}</strong><span>reduced motion 설정 존중</span></div></div>
                    </section>

                    <section id="examples" className="doc-section" aria-labelledby="examples-heading"><div className="section-lead"><div><p className="section-index">04 / COMPOSED EXAMPLE</p><h2 id="examples-heading">Registry review</h2><p>입력, 표, 코드 블록을 조합한 요청 검토 화면입니다. 요청과 상태는 예시용이며 colormap도 위의 선택을 따릅니다.</p></div><a className="text-link" href={exampleUrl.href} target="_blank" rel="noreferrer">전체 화면으로 열기 <ArrowUpRight size={16} aria-hidden="true" /></a></div><div className="example-frame"><iframe ref={exampleFrame} title="pydemia UI registry review 예시 화면" src={`${import.meta.env.BASE_URL}${profilePath}`} loading="lazy" onLoad={profileBridge.send} /></div><p className="section-note" role="status">{profileBridge.status === "applied" ? "예시에 현재 디자인을 적용했습니다." : profileBridge.status === "waiting" ? "예시의 디자인 적용을 확인하고 있습니다." : profileBridge.status === "changed" ? "예시에서 밝기를 바꿨습니다. 문서 설정을 다시 적용할 수 있습니다." : "예시의 디자인 적용을 확인하지 못했습니다."}{(profileBridge.status === "unavailable" || profileBridge.status === "changed") && <button type="button" className="colormap-reset" onClick={profileBridge.send}>다시 연결</button>}</p></section>
                    <section id="analytics-example" className="doc-section" aria-labelledby="analytics-heading">
                        <div className="section-lead">
                            <div>
                                <p className="section-index">05 / COMPOSED EXAMPLE</p>
                                <h2 id="analytics-heading">Operations workspace</h2>
                                <p>탐색, 지표, 차트, 로그와 실행 목록을 조합한
                                    분석 작업 화면입니다. 재실행은 로컬 상태만 바꿉니다.</p>
                            </div>
                            <a className="text-link" target="_blank" rel="noreferrer"
                                href="https://github.com/pydemia/ui/blob/main/apps/docs/src/analytics-workspace.tsx">
                                예시 코드 <ArrowUpRight size={16} aria-hidden="true" />
                            </a>
                        </div>
                        <div className="analytics-example-frame">
                            <AnalyticsWorkspace design={settings.design} />
                        </div>
                        <details className="analytics-install">
                            <summary>이 화면에 사용한 registry item 설치</summary>
                            <pre><code>npx shadcn@4.21.0 add {analyticsUrls} {tokensUrl}</code></pre>
                            <p>소비자 CSS에 <code>@import "./components/ui/tokens.css";</code>를
                                추가하세요. 예시 파일은 workspace package import를
                                사용하므로 registry 소비자는 설치된 component
                                경로로 import를 바꿔야 합니다.</p>
                        </details>
                    </section>

                    <section id="review-example" className="doc-section"
                        aria-labelledby="review-heading">
                        <div className="section-lead">
                            <div>
                                <p className="section-index">06 / COMPOSED EXAMPLE</p>
                                <h2 id="review-heading">Review workspace</h2>
                                <p>검색·선택·변경 비교·대댓글·승인을 연결한
                                    검토 화면입니다. 입력 결과는 로컬 상태로
                                    유지됩니다.</p>
                            </div>
                            <a className="text-link" target="_blank"
                                rel="noreferrer"
                                href="https://github.com/pydemia/ui/blob/main/apps/docs/src/review-workspace.tsx">
                                예시 코드 <ArrowUpRight size={16}
                                    aria-hidden="true" />
                            </a>
                        </div>
                        <div className="analytics-example-frame">
                            <ReviewWorkspace />
                        </div>
                        <details className="analytics-install">
                            <summary>이 화면에 사용한 registry item 설치</summary>
                            <pre><code>npx shadcn@4.21.0 add {reviewUrls} {tokensUrl}</code></pre>
                            <p>소비자 CSS에 <code>@import "./components/ui/tokens.css";</code>를
                                추가하세요. 예시 파일의 package import는 설치된
                                component 경로로 바꿔야 합니다.</p>
                        </details>
                    </section>

                    <section id="intake-example" className="doc-section"
                        aria-labelledby="intake-heading">
                        <div className="section-lead">
                            <div>
                                <p className="section-index">07 / COMPOSED EXAMPLE</p>
                                <h2 id="intake-heading">Intake workspace</h2>
                                <p>단계별 입력, 기간 선택, 파일 첨부 예정 목록과
                                    접수 표를 연결한 화면입니다. 전송·저장은
                                    실행하지 않습니다.</p>
                            </div>
                            <a className="text-link" target="_blank"
                                rel="noreferrer"
                                href="https://github.com/pydemia/ui/blob/main/apps/docs/src/intake-workspace.tsx">
                                예시 코드 <ArrowUpRight size={16}
                                    aria-hidden="true" />
                            </a>
                        </div>
                        <div className="analytics-example-frame">
                            <IntakeWorkspace />
                        </div>
                        <details className="analytics-install">
                            <summary>이 화면에 사용한 registry item 설치</summary>
                            <pre><code>npx shadcn@4.21.0 add {intakeUrls} {tokensUrl}</code></pre>
                            <p>소비자 CSS에 <code>@import "./components/ui/tokens.css";</code>를
                                추가하세요. 예시 파일의 package import는 설치된
                                component 경로로 바꿔야 합니다.</p>
                        </details>
                    </section>

                    <section id="installation" className="doc-section usage-section" aria-labelledby="usage-heading">
                        <div className="section-lead"><div>
                            <p className="section-index">08 / USING THE SOURCE</p>
                            <h2 id="usage-heading">코드 사용</h2>
                            <p>현재 패키지는 이 저장소의 private workspace package이며 npm registry에 게시되지 않았습니다. 소스에서 실행하거나 필요한 컴포넌트를 registry로 복사할 수 있습니다.</p>
                        </div></div>
                        <div className="usage-columns">
                            <div><h3>Repository</h3><p>소스를 내려받아 문서와 예시 화면을 실행합니다.</p>
                                <pre><code>git clone https://github.com/pydemia/ui.git{"\n"}cd ui &amp;&amp; npm ci{"\n"}npm run build &amp;&amp; npm run dev</code></pre>
                            </div>
                            <div><h3>Registry</h3>
                                <p>컴포넌트와 token stylesheet를 설치한 뒤 앱의 CSS에서 <code>tokens.css</code>를 import합니다.</p>
                                <pre><code>npx shadcn@4.21.0 add {registryUrls}{"\n"}npx shadcn@4.21.0 add {tokensUrl}</code></pre>
                                <pre><code>@import "./components/ui/tokens.css";</code></pre>
                            </div>
                        </div>
                        <div className="usage-columns">
                            <div><h3>Design mode 설치</h3>
                                <p>형태·재질·지역 테마를 쓰려면 디자인 항목도 설치하고 optional CSS를 연결합니다. 필요한 컴포넌트는 별도로 설치합니다.</p>
                                <pre><code>npx shadcn@4.21.0 add {designModesUrl}</code></pre>
                                <pre><code>{'@import "./components/ui/tokens.css";\n@import "./components/ui/design-modes.css";'}</code></pre>
                            </div>
                            <div><h3>지역 테마 사용</h3>
                                <p>출시된 ID를 <code>releasedDesignModes</code>에서 선택합니다. ThemeScope 안의 portal은 같은 설정을 따르며, 테마 전환 시 업무 화면의 key를 바꾸지 않습니다.</p>
                                <pre><code>{'import { ThemeScope } from "./components/ui/foundation/theme-scope";\n\n<ThemeScope settings={{ design: "basic", appearance: "light", colormap: "neutral" }}>\n  <YourWorkspace />\n</ThemeScope>'}</code></pre>
                            </div>
                        </div>
                        <p className="section-note">위 Usage 코드는 private package import입니다. registry 소비자는 설치된 파일 경로로 import를 바꿔야 합니다. 로컬 registry 설치 검사는 README의 base URL 설정 후 빌드해야 합니다.</p>
                    </section>
                    <footer className="footer"><span>pydemia UI · prototype v0.1.0</span><a href="https://github.com/pydemia/ui/blob/main/THIRD_PARTY_NOTICES.md" target="_blank" rel="noreferrer">Third-party notices</a></footer>
                </main>
            </div>
        </div>
    );
}

const root = createRoot(document.getElementById("root")!);
let disposed = false;
import.meta.hot?.dispose(() => { disposed = true; root.unmount(); });
if (location.pathname === "/prism" || location.pathname.startsWith("/prism/")) {
    import("./prism/page").then(({ mountPrism }) => { if (!disposed) mountPrism(root); });
} else {
    const bootOptions = { allowUnreleased: import.meta.env.DEV };
    const restoreBootstrap = applyThemeToElement(document.documentElement,
        parseThemeUrl(new URL(window.location.href), bootOptions).settings, bootOptions);
    import.meta.hot?.dispose(restoreBootstrap);
    root.render(<App />);
}
