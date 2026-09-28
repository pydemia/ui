import { createRoot } from "react-dom/client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Github, Moon, Sun } from "lucide-react";
import {
    Badge, Snippet, SnippetContent, SnippetCopyButton,
    SnippetHeader, SnippetTabsList, SnippetTabsTrigger,
} from "@pydemia/ui";
import provenance from "../../../registry/provenance.json";
import { catalog } from "./catalog";
import "./styles.css";

const colorTokens = [
    { name: "Background", token: "--background" },
    { name: "Surface", token: "--surface" },
    { name: "Surface subtle", token: "--surface-subtle" },
    { name: "Foreground", token: "--foreground" },
    { name: "Muted", token: "--muted" },
    { name: "Border", token: "--border" },
    { name: "Accent", token: "--accent" },
    { name: "Accent text", token: "--accent-foreground" },
    { name: "Focus", token: "--focus" },
    { name: "Danger", token: "--danger" },
    { name: "User message", token: "--message-user-background" },
    { name: "User message text", token: "--message-user-foreground" },
] as const;

const colormaps = [
    {
        id: "neutral", name: "Neutral", description: "기존 청록",
        colors: {
            light: ["#f7f8fa", "#245d70", "#103344"],
            dark: ["#131a21", "#83bfd2", "#245d70"],
        },
    },
    {
        id: "pydemia", name: "Pydemia", description: "로고 네이비·로즈",
        colors: {
            light: ["#f7f9fb", "#ba365b", "#103344"],
            dark: ["#111a24", "#f19ab1", "#20465d"],
        },
    },
    {
        id: "ocean", name: "Ocean", description: "선명한 파랑",
        colors: {
            light: ["#f5f8fc", "#205ca3", "#163f70"],
            dark: ["#111b2b", "#8fc0ff", "#285d96"],
        },
    },
    {
        id: "forest", name: "Forest", description: "차분한 초록",
        colors: {
            light: ["#f5f8f4", "#25684a", "#174a38"],
            dark: ["#121e19", "#91d4aa", "#276348"],
        },
    },
    {
        id: "violet", name: "Violet", description: "절제된 보라",
        colors: {
            light: ["#faf7fc", "#68438e", "#4e326e"],
            dark: ["#1d1726", "#d2a4f1", "#67418a"],
        },
    },
] as const;

type ColorToken = (typeof colorTokens)[number]["token"];
type ColormapId = (typeof colormaps)[number]["id"];
type ColorOverrides = Record<"light" | "dark", Partial<Record<ColorToken, string>>>;

const hexColor = /^#[0-9a-fA-F]{6}$/;
const contrastPairs = [
    { name: "본문", foreground: "--foreground", background: "--background" },
    { name: "Accent", foreground: "--accent-foreground", background: "--accent" },
    {
        name: "User message", foreground: "--message-user-foreground",
        background: "--message-user-background",
    },
] as const;

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

const curatedComponentIds = new Set([
    "affixed-input", "snippet", "metric-card", "dropzone",
    "message", "prompt-input",
]);

function App() {
    const [selectedId, setSelectedId] = useState(() => {
        const fromUrl = new URLSearchParams(window.location.search).get("component");
        return catalog.some((entry) => entry.id === fromUrl) ? fromUrl! : "button";
    });
    const [dark, setDark] = useState(false);
    const [colormap, setColormap] = useState<ColormapId>("neutral");
    const [overrides, setOverrides] = useState<ColorOverrides>({ light: {}, dark: {} });
    const [hexDrafts, setHexDrafts] = useState<Partial<Record<ColorToken, string>>>({});
    const [values, setValues] = useState<Record<string, string>>({});
    const exampleFrame = useRef<HTMLIFrameElement>(null);
    const mode = dark ? "dark" : "light";
    const hasOverrides = Object.values(overrides).some(
        (colors) => Object.keys(colors).length > 0,
    );
    const hasInvalidHex = Object.values(hexDrafts).some(
        (value) => value !== undefined && !hexColor.test(value),
    );
    const selected = catalog.find((entry) => entry.id === selectedId)!;
    const record = provenance.items.find((item) => item.name === `pyd-${selectedId}`)!;
    const implementationUrl = record.source.upstream ??
        `https://github.com/pydemia/ui/blob/main/packages/ui/src/components/${selected.id}.tsx`;
    const reference = "reference" in record ? record.reference : undefined;
    const registryUrl = new URL(`${import.meta.env.BASE_URL}r/pyd-${selected.id}.json`, window.location.origin).href;
    const tokensUrl = new URL(`${import.meta.env.BASE_URL}r/pyd-tokens.json`, window.location.origin).href;
    const exampleUrl = new URL(`${import.meta.env.BASE_URL}examples/profile/`, window.location.origin);
    exampleUrl.searchParams.set("colormap", colormap);
    if (dark) exampleUrl.searchParams.set("mode", "dark");
    for (const theme of ["light", "dark"] as const) {
        for (const [token, value] of Object.entries(overrides[theme])) {
            exampleUrl.searchParams.set(`${theme}.${token.slice(2)}`, value);
        }
    }

    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle("dark", dark);
        root.dataset.colormap = colormap;
        for (const { token } of colorTokens) {
            const paletteToken = token.replace("--", "--palette-");
            const override = overrides[mode][token];
            if (override) root.style.setProperty(paletteToken, override);
            else root.style.removeProperty(paletteToken);
        }
        const styles = getComputedStyle(root);
        setValues(Object.fromEntries(colorTokens.map(({ token }) => [
            token, expandHex(styles.getPropertyValue(token)),
        ])));
        return () => {
            root.classList.remove("dark");
            delete root.dataset.colormap;
            for (const { token } of colorTokens) {
                root.style.removeProperty(token.replace("--", "--palette-"));
            }
        };
    }, [dark, colormap, mode, overrides]);

    useEffect(() => {
        sendColormapToExample();
    }, [dark, colormap, overrides]);

    useEffect(() => {
        const handleHistory = () => {
            const id = new URLSearchParams(window.location.search).get("component");
            if (catalog.some((entry) => entry.id === id)) setSelectedId(id!);
        };
        window.addEventListener("popstate", handleHistory);
        return () => window.removeEventListener("popstate", handleHistory);
    }, []);

    function selectComponent(id: string) {
        setSelectedId(id);
        const url = new URL(window.location.href);
        url.searchParams.set("component", id);
        url.hash = "components";
        window.history.pushState({}, "", url);
        document.getElementById("components")?.scrollIntoView({ behavior: "smooth" });
    }

    function sendColormapToExample() {
        exampleFrame.current?.contentWindow?.postMessage(
            { type: "pydemia-ui-colormap", colormap, dark, overrides },
            window.location.origin,
        );
    }

    function selectColormap(id: ColormapId) {
        setColormap(id);
        resetOverrides();
    }

    function resetOverrides() {
        setOverrides({ light: {}, dark: {} });
        setHexDrafts({});
    }

    function toggleDark() {
        setDark((current) => !current);
        setHexDrafts({});
    }

    function clearHexDraft(token: ColorToken) {
        setHexDrafts((current) => {
            const next = { ...current };
            delete next[token];
            return next;
        });
    }

    function setColor(token: ColorToken, value: string) {
        setOverrides((current) => ({
            ...current,
            [mode]: { ...current[mode], [token]: value.toLowerCase() },
        }));
    }

    function updateHex(token: ColorToken, value: string) {
        setHexDrafts((current) => ({ ...current, [token]: value }));
        if (hexColor.test(value)) setColor(token, value);
    }

    function chooseColor(token: ColorToken, value: string) {
        setColor(token, value);
        clearHexDraft(token);
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
                        <a href="#components">Components</a>
                        <a href="#colormap">Colormap</a>
                        <a href="#tokens">Tokens</a>
                        <a href="#examples">Examples</a>
                        <a className="github-link" href="https://github.com/pydemia/ui" target="_blank" rel="noreferrer"><Github size={17} aria-hidden="true" /> GitHub <ArrowUpRight size={14} aria-hidden="true" /></a>
                    </nav>
                    <button className="theme-button" type="button" aria-label={dark ? "라이트 모드로 전환" : "다크 모드로 전환"} onClick={toggleDark}>{dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}</button>
                </div>
            </header>

            <div className="layout">
                <aside className="sidebar" aria-label="컴포넌트 목록">
                    <div className="sidebar-inner">
                        <a href="#overview" className="sidebar-overview">Overview</a>
                        <p className="sidebar-label">FOUNDATION</p>
                        {catalog.filter((entry) => !curatedComponentIds.has(entry.id)).map((entry) =>
                            <button key={entry.id} type="button" aria-current={entry.id === selectedId ? "page" : undefined} className={`sidebar-item${entry.id === selectedId ? " selected" : ""}`} onClick={() => selectComponent(entry.id)}>{entry.name}</button>,
                        )}
                        <p className="sidebar-label">CURATED</p>
                        {catalog.filter((entry) => curatedComponentIds.has(entry.id)).map((entry) =>
                            <button key={entry.id} type="button" aria-current={entry.id === selectedId ? "page" : undefined} className={`sidebar-item${entry.id === selectedId ? " selected" : ""}`} onClick={() => selectComponent(entry.id)}>{entry.name}</button>,
                        )}
                        <div className="sidebar-lower"><a href="#colormap">Colormap</a><a href="#tokens">Design tokens</a><a href="#examples">Profile example</a><a href="#installation">Using the source</a></div>
                    </div>
                </aside>

                <main id="main" className="main-content">
                    <section id="overview" className="intro" aria-labelledby="page-heading">
                        <div className="eyebrow"><span className="eyebrow-line" /> DESIGN SYSTEM / OPEN CODE</div>
                        <div className="intro-head"><div><h1 id="page-heading">pydemia UI</h1><p>소스 코드를 직접 관리하는 React 컴포넌트와 검토된 내부 registry입니다.<br className="desktop-break" /> 같은 토큰을 쓰는 컴포넌트, 코드, 실제 사용 예시를 한곳에서 확인할 수 있습니다.</p></div><div className="intro-count"><strong>{String(catalog.length).padStart(2, "0")}</strong><span>COMPONENTS<br />IN THE PROTOTYPE</span></div></div>
                        <div className="intro-meta"><span>React 19</span><span>Tailwind CSS 4</span><span>shadcn registry</span><span>source owned</span></div>
                    </section>

                    <section id="components" className="doc-section" aria-labelledby="component-heading">
                        <div className="section-lead"><div><p className="section-index">01 / COMPONENT LIBRARY</p><h2 id="component-heading">{selected.name}</h2><p>{selected.description}</p></div><Badge>{selected.category}</Badge></div>
                        <div className="component-grid">
                            <div className="preview-panel"><div className="panel-caption"><span>LIVE PREVIEW</span><span>Neutral Product</span></div><div className="preview-stage">{selected.preview()}</div></div>
                            <div className="code-panel"><div className="panel-caption"><span>REACT / TSX</span><span>Copy ready</span></div><Snippet className="docs-snippet" defaultValue="usage"><SnippetHeader><SnippetTabsList aria-label="코드 예시"><SnippetTabsTrigger value="usage">Usage</SnippetTabsTrigger></SnippetTabsList><SnippetCopyButton value={selected.code} /></SnippetHeader><SnippetContent value="usage">{selected.code}</SnippetContent></Snippet></div>
                        </div>
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
                        </div>
                        <div className="colormap-fields">
                            {colorTokens.map(({ name, token }) => {
                                const draft = hexDrafts[token];
                                const invalid = draft !== undefined && !hexColor.test(draft);
                                return <div className="colormap-field" key={token}>
                                    <label htmlFor={`hex-${token}`}>{name}</label>
                                    <input
                                        type="color"
                                        aria-label={`${name} 색상 선택`}
                                        value={values[token] ?? "#000000"}
                                        onChange={(event) => chooseColor(token, event.target.value)}
                                    />
                                    <input
                                        id={`hex-${token}`}
                                        type="text"
                                        inputMode="text"
                                        spellCheck={false}
                                        maxLength={7}
                                        value={draft ?? values[token] ?? ""}
                                        aria-invalid={invalid}
                                        aria-describedby={invalid ? "colormap-error" : undefined}
                                        onChange={(event) => updateHex(token, event.target.value)}
                                        onBlur={() => clearHexDraft(token)}
                                    />
                                    <code>{token} → {token.replace("--", "--palette-")}</code>
                                </div>;
                            })}
                        </div>
                        <p id="colormap-error" className="colormap-error" role="status">
                            {hasInvalidHex ? "색상은 #RRGGBB 형식으로 입력하세요." : ""}
                        </p>
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
                        <div className="token-detail"><div><span className="meta-label">RADIUS</span><strong>5px</strong><span>컴포넌트 기본 radius</span></div><div><span className="meta-label">CONTROL</span><strong>36px</strong><span>기본 입력 및 버튼 높이</span></div><div><span className="meta-label">SHADOW</span><strong>0 4px 16px</strong><span>부유 표면에만 사용</span></div><div><span className="meta-label">MOTION</span><strong>150ms</strong><span>reduced motion 설정 존중</span></div></div>
                    </section>

                    <section id="examples" className="doc-section" aria-labelledby="examples-heading"><div className="section-lead"><div><p className="section-index">04 / COMPOSED EXAMPLE</p><h2 id="examples-heading">Registry review</h2><p>입력, 표, 코드 블록을 조합한 요청 검토 화면입니다. 요청과 상태는 예시용이며 colormap도 위의 선택을 따릅니다.</p></div><a className="text-link" href={exampleUrl.href} target="_blank" rel="noreferrer">전체 화면으로 열기 <ArrowUpRight size={16} aria-hidden="true" /></a></div><div className="example-frame"><iframe ref={exampleFrame} title="pydemia UI registry review 예시 화면" src={`${import.meta.env.BASE_URL}examples/profile/`} loading="lazy" onLoad={sendColormapToExample} /></div></section>

                    <section id="installation" className="doc-section usage-section" aria-labelledby="usage-heading"><div className="section-lead"><div><p className="section-index">05 / USING THE SOURCE</p><h2 id="usage-heading">코드 사용</h2><p>현재 패키지는 이 저장소의 private workspace package이며 npm registry에 게시되지 않았습니다. 소스에서 실행하거나 필요한 컴포넌트를 registry로 복사할 수 있습니다.</p></div></div><div className="usage-columns"><div><h3>Repository</h3><p>소스를 내려받아 문서와 예시 화면을 실행합니다.</p><pre><code>git clone https://github.com/pydemia/ui.git{"\n"}cd ui &amp;&amp; npm ci{"\n"}npm run build &amp;&amp; npm run dev</code></pre></div><div><h3>Registry</h3><p>컴포넌트와 token stylesheet를 설치한 뒤 앱의 CSS에서 <code>tokens.css</code>를 import합니다.</p><pre><code>npx shadcn@latest add {registryUrl}{"\n"}npx shadcn@latest add {tokensUrl}</code></pre><pre><code>@import "./components/ui/tokens.css";</code></pre></div></div><p className="section-note">로컬 registry 설치 검사는 README의 base URL 설정 후 빌드해야 합니다. 공개 registry URL은 배포된 문서에서 사용할 수 있습니다.</p></section>
                    <footer className="footer"><span>pydemia UI · prototype v0.1.0</span><a href="https://github.com/pydemia/ui/blob/main/THIRD_PARTY_NOTICES.md" target="_blank" rel="noreferrer">Third-party notices</a></footer>
                </main>
            </div>
        </div>
    );
}

createRoot(document.getElementById("root")!).render(<App />);
