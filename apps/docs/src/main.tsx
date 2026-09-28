import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
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
    { name: "Focus", token: "--focus" },
    { name: "Danger", token: "--danger" },
] as const;

function App() {
    const [selectedId, setSelectedId] = useState(() => {
        const fromUrl = new URLSearchParams(window.location.search).get("component");
        return catalog.some((entry) => entry.id === fromUrl) ? fromUrl! : "button";
    });
    const [dark, setDark] = useState(false);
    const [values, setValues] = useState<Record<string, string>>({});
    const selected = catalog.find((entry) => entry.id === selectedId)!;
    const record = provenance.items.find((item) => item.name === `pyd-${selectedId}`)!;
    const registryUrl = new URL(`${import.meta.env.BASE_URL}r/pyd-button.json`, window.location.origin).href;

    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle("dark", dark);
        const styles = getComputedStyle(root);
        setValues(Object.fromEntries(colorTokens.map(({ token }) => [token, styles.getPropertyValue(token).trim()])));
        return () => root.classList.remove("dark");
    }, [dark]);

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

    return (
        <div className="site-shell">
            <a className="skip-link" href="#main">본문으로 이동</a>
            <header className="topbar">
                <div className="topbar-inner">
                    <a href="#overview" className="wordmark" aria-label="pydemia UI 개요">
                        <span className="monogram" aria-hidden="true">p</span>
                        <span>pydemia <span className="wordmark-light">/ ui</span></span>
                    </a>
                    <span className="version">v0.1.0 · prototype</span>
                    <nav className="top-nav" aria-label="상단 탐색">
                        <a href="#components">Components</a>
                        <a href="#tokens">Tokens</a>
                        <a href="#examples">Examples</a>
                        <a className="github-link" href="https://github.com/pydemia/ui" target="_blank" rel="noreferrer"><Github size={17} aria-hidden="true" /> GitHub <ArrowUpRight size={14} aria-hidden="true" /></a>
                    </nav>
                    <button className="theme-button" type="button" aria-label={dark ? "라이트 모드로 전환" : "다크 모드로 전환"} onClick={() => setDark(!dark)}>{dark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}</button>
                </div>
            </header>

            <div className="layout">
                <aside className="sidebar" aria-label="컴포넌트 목록">
                    <div className="sidebar-inner">
                        <a href="#overview" className="sidebar-overview">Overview</a>
                        <p className="sidebar-label">FOUNDATION</p>
                        {catalog.filter((entry) => !["affixed-input", "snippet"].includes(entry.id)).map((entry) =>
                            <button key={entry.id} type="button" aria-current={entry.id === selectedId ? "page" : undefined} className={`sidebar-item${entry.id === selectedId ? " selected" : ""}`} onClick={() => selectComponent(entry.id)}>{entry.name}</button>,
                        )}
                        <p className="sidebar-label">CURATED</p>
                        {catalog.filter((entry) => ["affixed-input", "snippet"].includes(entry.id)).map((entry) =>
                            <button key={entry.id} type="button" aria-current={entry.id === selectedId ? "page" : undefined} className={`sidebar-item${entry.id === selectedId ? " selected" : ""}`} onClick={() => selectComponent(entry.id)}>{entry.name}</button>,
                        )}
                        <div className="sidebar-lower"><a href="#tokens">Color & tokens</a><a href="#examples">Profile example</a><a href="#installation">Using the source</a></div>
                    </div>
                </aside>

                <main id="main" className="main-content">
                    <section id="overview" className="intro" aria-labelledby="page-heading">
                        <div className="eyebrow"><span className="eyebrow-line" /> DESIGN SYSTEM / OPEN CODE</div>
                        <div className="intro-head"><div><h1 id="page-heading">pydemia UI</h1><p>소스 코드를 직접 관리하는 React 컴포넌트와 검토된 내부 registry입니다.<br className="desktop-break" /> 같은 토큰을 쓰는 컴포넌트, 코드, 실제 사용 예시를 한곳에서 확인할 수 있습니다.</p></div><div className="intro-count"><strong>08</strong><span>COMPONENTS<br />IN THE PROTOTYPE</span></div></div>
                        <div className="intro-meta"><span>React 19</span><span>Tailwind CSS 4</span><span>shadcn registry</span><span>source owned</span></div>
                    </section>

                    <section id="components" className="doc-section" aria-labelledby="component-heading">
                        <div className="section-lead"><div><p className="section-index">01 / COMPONENT LIBRARY</p><h2 id="component-heading">{selected.name}</h2><p>{selected.description}</p></div><Badge>{selected.category}</Badge></div>
                        <div className="component-grid">
                            <div className="preview-panel"><div className="panel-caption"><span>LIVE PREVIEW</span><span>Neutral Product</span></div><div className="preview-stage">{selected.preview()}</div></div>
                            <div className="code-panel"><div className="panel-caption"><span>REACT / TSX</span><span>Copy ready</span></div><Snippet className="docs-snippet" defaultValue="usage"><SnippetHeader><SnippetTabsList aria-label="코드 예시"><SnippetTabsTrigger value="usage">Usage</SnippetTabsTrigger></SnippetTabsList><SnippetCopyButton value={selected.code} /></SnippetHeader><SnippetContent value="usage">{selected.code}</SnippetContent></Snippet></div>
                        </div>
                        <div className="component-meta"><div><span className="meta-label">SOURCE</span><a href={record.source.upstream ?? "https://github.com/pydemia/ui"} target="_blank" rel="noreferrer">{record.source.provider} <ArrowUpRight size={13} aria-hidden="true" /></a></div><div><span className="meta-label">LICENSE</span><strong>{record.source.license}</strong></div><div><span className="meta-label">ACCESSIBILITY</span><span>{record.accessibility.keyboard === "pending browser check" ? "키보드·스크린리더 검증 대기" : record.accessibility.semantics}</span></div></div>
                        <p className="section-note">예시는 실제 <code>@pydemia/ui</code> 컴포넌트를 사용합니다. 접근성 상태는 <a href="https://github.com/pydemia/ui/blob/main/registry/provenance.json" target="_blank" rel="noreferrer">provenance metadata</a>에 기록합니다.</p>
                    </section>

                    <section id="tokens" className="doc-section tokens-section" aria-labelledby="tokens-heading"><div className="section-lead"><div><p className="section-index">02 / DESIGN TOKENS</p><h2 id="tokens-heading">Color & density</h2><p>컴포넌트와 예시 화면이 공유하는 semantic token입니다. 상단의 테마 버튼으로 light/dark 값을 비교할 수 있습니다.</p></div></div>
                        <div className="swatch-grid">{colorTokens.map(({ name, token }) => <div className="swatch" key={token}><div className="swatch-color" style={{ background: `var(${token})` }} /><div className="swatch-info"><strong>{name}</strong><code>{token}</code><span>{values[token] ?? "—"}</span></div></div>)}</div>
                        <div className="token-detail"><div><span className="meta-label">RADIUS</span><strong>5px</strong><span>컴포넌트 기본 radius</span></div><div><span className="meta-label">CONTROL</span><strong>36px</strong><span>기본 입력 및 버튼 높이</span></div><div><span className="meta-label">SHADOW</span><strong>0 4px 16px</strong><span>부유 표면에만 사용</span></div><div><span className="meta-label">MOTION</span><strong>150ms</strong><span>reduced motion 설정 존중</span></div></div>
                    </section>

                    <section id="examples" className="doc-section" aria-labelledby="examples-heading"><div className="section-lead"><div><p className="section-index">03 / COMPOSED EXAMPLE</p><h2 id="examples-heading">Registry review</h2><p>Button, Input, Badge, Table, Origin AffixedInput, Kibo Snippet을 조합한 실제 데모입니다. 데이터와 검토 상태는 예시용입니다.</p></div><a className="text-link" href={`${import.meta.env.BASE_URL}examples/profile/`} target="_blank" rel="noreferrer">전체 화면으로 열기 <ArrowUpRight size={16} aria-hidden="true" /></a></div><div className="example-frame"><iframe title="pydemia UI registry review 예시 화면" src={`${import.meta.env.BASE_URL}examples/profile/`} loading="lazy" /></div></section>

                    <section id="installation" className="doc-section usage-section" aria-labelledby="usage-heading"><div className="section-lead"><div><p className="section-index">04 / USING THE SOURCE</p><h2 id="usage-heading">코드 사용</h2><p>현재 패키지는 이 저장소의 private workspace package이며 npm registry에 게시되지 않았습니다. 소스에서 실행하거나 필요한 컴포넌트를 registry로 복사할 수 있습니다.</p></div></div><div className="usage-columns"><div><h3>Repository</h3><p>소스를 내려받아 문서와 예시 화면을 실행합니다.</p><pre><code>git clone https://github.com/pydemia/ui.git{"\n"}cd ui &amp;&amp; npm ci{"\n"}npm run build &amp;&amp; npm run dev</code></pre></div><div><h3>Registry</h3><p>게시된 registry 항목을 프로젝트의 shadcn 구성에 복사합니다. 소비자 프로젝트에는 토큰 stylesheet도 연결해야 합니다.</p><pre><code>npx shadcn@latest add{"\n"}  {registryUrl}</code></pre></div></div><p className="section-note">DNS와 HTTPS가 활성화되면 위 registry URL을 사용할 수 있습니다. 패키지 설치 방식과 registry 복사 방식은 별개입니다.</p></section>
                    <footer className="footer"><span>pydemia UI · prototype v0.1.0</span><a href="https://github.com/pydemia/ui/blob/main/THIRD_PARTY_NOTICES.md" target="_blank" rel="noreferrer">Third-party notices</a></footer>
                </main>
            </div>
        </div>
    );
}

createRoot(document.getElementById("root")!).render(<App />);
