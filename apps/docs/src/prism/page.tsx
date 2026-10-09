import { useEffect, useState } from "react";
import type { Root } from "react-dom/client";
import { ChevronRight, Copy, ExternalLink, Search } from "lucide-react";
import { PrismButton } from "@pydemia/prism";
import { catalog } from "../catalog";
import { prismCatalog, type FixtureState } from "./catalog";
import { WorkspaceDemo } from "./workspace";
import manifest from "../../public/prism/components.json";
import "@pydemia/prism/styles.css";
import "./page.css";

const stateLabels: Record<FixtureState, string> = { default: "기본", disabled: "비활성", readonly: "읽기 전용", error: "오류", loading: "로딩", empty: "빈 결과", long: "긴 내용" };
const referenceBase = (revision: string) => `https://github.com/skccmygit/skax-successionX-frontend/blob/${revision}/src/`;
const genericEntries = catalog.map(entry => ({ ...entry, id: `pyd-${entry.id}` }));
const verificationLabels:Record<string,string>={pending:"미확인",partial:"부분 확인","source-artwork-retained":"원본 벡터 형상 보존","not-applicable":"해당 없음"};
function verificationLabel(value:string) {return verificationLabels[value]??value;}
function ResponsivePreview({component,state,onStateChange,onComponentChange}:{component:string;state:FixtureState;onStateChange:(state:FixtureState)=>void;onComponentChange:(id:string)=>void}) {
    const [width,setWidth]=useState(390);const [height,setHeight]=useState(760);const [target,setTarget]=useState("workspace");
    const entry=prismCatalog.find(entry=>entry.id===component);
    const source=target==="workspace" ? "/prism?view=workspace&embed=1" : `/prism?component=${encodeURIComponent(component)}&state=${state}&embed=1`;
    return <div className="prism-demo-stack"><div className="prism-sizing-controls"><label>미리보기 너비 <input type="range" min={320} max={1200} step={10} value={width} onChange={e=>setWidth(Number(e.target.value))}/><input type="number" aria-label="미리보기 너비 숫자" min={320} max={1200} value={width} onChange={e=>{const next=Number(e.target.value);if(next>0)setWidth(Math.max(320,Math.min(1200,next)));}}/>px</label><label>미리보기 높이 <input type="range" min={480} max={1000} step={20} value={height} onChange={e=>setHeight(Number(e.target.value))}/><output>{height}px</output></label><label>대상 <select value={target} onChange={e=>setTarget(e.target.value)}><option value="workspace">Workspace</option><option value="component">선택한 컴포넌트</option></select></label></div>
        {target==="component"&&<label className="prism-responsive-component">크기 확인 컴포넌트 <select value={component} onChange={e=>onComponentChange(e.target.value)}>{prismCatalog.map(entry=><option key={entry.id} value={entry.id}>{entry.name}</option>)}{genericEntries.some(entry=>entry.id===component)&&<option value={component}>{genericEntries.find(entry=>entry.id===component)?.name}</option>}</select></label>}
        {target==="component"&&entry&&<label className="prism-responsive-state">확인 상태 <select value={state} onChange={e=>onStateChange(e.target.value as FixtureState)}>{entry.states.map(value=><option key={value} value={value}>{stateLabels[value]}</option>)}</select></label>}
        <div className="prism-responsive-scroll"><iframe title="반응형 PRISM 미리보기" src={source} style={{width,height}} /></div><p>iframe의 실제 viewport 폭입니다. 320–1200px에서 탐색 메뉴, 상세 패널, 표 스크롤과 PDF 맞춤을 확인할 수 있습니다.</p></div>;
}
function PrismDocs() {
    const [selected, setSelected] = useState(() => new URLSearchParams(location.search).get("component") ?? "prism-button");
    const [query, setQuery] = useState(""); const [state, setState] = useState<FixtureState>(()=>{const value=new URLSearchParams(location.search).get("state");return value&&value in stateLabels ? value as FixtureState : "default";});
    const [section, setSection] = useState(() => new URLSearchParams(location.search).get("view") ?? "components"); const [copied, setCopied] = useState("");
    const [usageTarget, setUsageTarget] = useState<"registry" | "workspace">("registry");
    const knownSelection = prismCatalog.some(entry => entry.id === selected) || genericEntries.some(entry => entry.id === selected);
    const specific = prismCatalog.find(entry => entry.id === (knownSelection ? selected : "prism-button"));
    const generic = genericEntries.find(entry => entry.id === selected);
    const entry = specific ?? generic ?? prismCatalog[0];
    const contract = specific ? manifest.components.find(item => item.id === specific.id) : undefined;
    const usageCode = usageTarget === "registry" && contract ? contract.registryUsage : entry.code;
    const activeState=specific?.states.includes(state) ? state : "default";
    const embedded=new URLSearchParams(location.search).get("embed")==="1";
    const groups = [...new Set(prismCatalog.map(item => item.category))];
    const additionalGroups = [...new Set(genericEntries.map(item => item.category))];
    const matches = (name: string, id: string) => `${name} ${id}`.toLowerCase().includes(query.toLowerCase());
    useEffect(() => { document.documentElement.dataset.prism = "light"; document.title = "PRISM UI · pydemia";
        return () => { delete document.documentElement.dataset.prism; }; }, []);
    useEffect(() => { const listener = () => { const params=new URLSearchParams(location.search);setSelected(params.get("component") ?? "prism-button"); setSection(params.get("view") ?? "components"); const next=params.get("state");setState(next&&next in stateLabels ? next as FixtureState : "default"); };
        window.addEventListener("popstate", listener); return () => window.removeEventListener("popstate", listener); }, []);
    const navigate = (id: string) => { setSelected(id); setState("default"); setSection("components");
        const url = new URL(location.href); url.searchParams.set("component", id); url.searchParams.delete("view");url.searchParams.delete("state"); history.pushState(null, "", url); };
    const changeState=(next:FixtureState)=>{setState(next);const url=new URL(location.href);if(next==="default")url.searchParams.delete("state");else url.searchParams.set("state",next);history.replaceState(null,"",url);};
    const changeResponsiveComponent=(id:string)=>{setSelected(id);const url=new URL(location.href);url.searchParams.set("component",id);history.replaceState(null,"",url);};
    const navigateSection = (section: string) => { setSection(section); const url = new URL(location.href);
        if (section === "components") url.searchParams.delete("view"); else url.searchParams.set("view",section); history.pushState(null,"",url); };
    const copy = async (text: string) => { try { await navigator.clipboard.writeText(text); setCopied("복사했습니다."); } catch { setCopied("복사하지 못했습니다. 코드를 직접 선택해 주세요."); } };
    const install = `npx shadcn@4.21.0 add ${location.origin}/prism/r/${specific?.id ?? "prism-tokens"}.json`;
    if(embedded)return <main className="prism-embedded" data-component={entry.id} data-fixture-state={activeState}>{section==="workspace" ? <WorkspaceDemo/> : <><h1>{entry.name}</h1>{specific ? specific.render(activeState) : generic?.preview()}</>}</main>;
    return <div className="prism-docs"><a className="skip-link" href="#prism-main">본문으로 이동</a>
        <header className="prism-docs-header"><a href="/" className="prism-docs-brand">pydemia <span>UI</span></a><span className="prism-docs-divider" /><strong>PRISM</strong>
            <nav aria-label="문서 탐색">{[["components", "Components"], ["workspace", "Workspace"], ["responsive", "Responsive"], ["rules", "Ground rules"], ["coverage", "Coverage"]].map(([id,label]) => <button key={id} aria-current={section === id ? "page" : undefined} onClick={() => navigateSection(id)}>{label}</button>)}</nav>
            <a href="/prism/llms.txt">AI 문서 <ExternalLink size={14} /></a></header>
        <div className="prism-docs-layout"><aside className="prism-docs-rail" aria-label="컴포넌트 목록"><label className="prism-docs-search"><Search size={16} aria-hidden="true" /><span className="prism-sr-only">컴포넌트 검색</span><input type="search" value={query} onChange={e => setQuery(e.target.value)} placeholder="컴포넌트 검색" /></label>
            <p className="prism-rail-heading">PRISM 재현</p>{groups.map(group => <section key={group}><h2>{group}</h2>{prismCatalog.filter(item => item.category === group && matches(item.name,item.id)).map(item => <button key={item.id} aria-current={selected === item.id ? "page" : undefined} onClick={() => navigate(item.id)}>{item.name}</button>)}</section>)}
            <p className="prism-rail-heading">추가 기능 · pydemia profile</p>{additionalGroups.map(group => { const entries = genericEntries.filter(item => item.category === group && matches(item.name,item.id)); return entries.length > 0 && <details key={group} open={query ? true : undefined}><summary>{group} <span>{entries.length}</span></summary>{entries.map(item => <button key={item.id} aria-current={selected === item.id ? "page" : undefined} onClick={() => navigate(item.id)}>{item.name}</button>)}</details>; })}</aside>
            <main id="prism-main" className="prism-docs-main">
                {section === "components" ? <><div className="prism-docs-path">PRISM <ChevronRight size={14} /> {entry.category}</div><h1>{entry.name}</h1>
                    <p className="prism-docs-description">{specific?.purpose ?? generic?.description}</p>
                    <div className="prism-docs-reference"><span>{specific ? "PRISM source reference · 자체 구현" : "pydemia 공통 컴포넌트 · PRISM 토큰 적용"}</span>
                        <a href={`https://github.com/pydemia/ui/blob/main/${specific ? `packages/prism/src/${specific.id}.tsx` : `packages/ui/src/components/${generic?.id.replace("pyd-", "")}.tsx`}`} target="_blank" rel="noreferrer">Source <ExternalLink size={14} /></a></div>
                    <section className="prism-docs-specimen" aria-labelledby="preview-heading"><header><h2 id="preview-heading">Preview</h2>
                        {specific && <label>상태 <select value={activeState} onChange={e => changeState(e.target.value as FixtureState)}>{specific.states.map(value => <option key={value} value={value}>{stateLabels[value]}</option>)}</select></label>}</header>
                        <div className="prism-docs-preview" key={`${entry.id}-${activeState}`}>{specific ? specific.render(activeState) : generic?.preview()}</div></section>
                    <section className="prism-docs-contract"><h2>Contract</h2><p>{specific?.contract ?? "기존 pydemia의 props·상태·키보드 계약을 공유하며 PRISM의 색상·32px control·Pretendard profile을 적용합니다. PRISM 원본에 없는 기능의 확장 예시이며 원본과 같은 외관으로 검증된 항목은 아닙니다."}</p></section>
                    <section className="prism-docs-code"><header><h2>Usage</h2><div className="prism-docs-code-controls">{specific && <label>사용 경로 <select value={usageTarget} onChange={event => setUsageTarget(event.target.value as "registry" | "workspace")}><option value="registry">Registry 설치</option><option value="workspace">Workspace</option></select></label>}<PrismButton variant="shape" icon={<Copy />} onClick={() => copy(usageCode)}>복사</PrismButton></div></header>{contract && <p className="prism-docs-code-note">{contract.usageKind === "component-example" ? "합성 데이터와 상태를 포함한 React 컴포넌트 예시입니다. API 호출과 저장은 소비자 앱에서 연결합니다." : "연동 코드 일부입니다. 데이터·상태·callback은 Contract에 맞춰 소비자 앱에서 정의하세요."}</p>}<pre><code>{usageCode}</code></pre></section>
                    <section className="prism-docs-install"><h2>독립 설치</h2><pre><code>{specific ? install : `npx shadcn@4.21.0 add ${(generic?.installItems ?? [generic?.id.replace("pyd-", "")]).map(id => `${location.origin}/r/pyd-${id}.json`).join(" ")} ${location.origin}/prism/r/prism-tokens.json`}</code></pre>
                        <p><code>@pydemia/prism</code>은 workspace용 private import입니다. Registry 예시는 <code>@/components/ui/prism-*</code>를 사용합니다. 설치 경로를 바꿨다면 <code>components.json</code>의 <code>aliases.ui</code>에 맞춰 import를 수정하세요. CSS에 <code>tokens.css</code> 다음 <code>prism.css</code>를 연결하고 앱 root에 <code>data-prism="light"</code>를 지정하세요. Pretendard는 <code>prism.css</code>가 함께 로드합니다.</p></section>
                    {specific && <section className="prism-docs-sources"><h2>원본 대응</h2>{specific.source.map(path => <a key={path} target="_blank" rel="noreferrer" href={new URL(path.startsWith("../") ? path.slice(3) : `components/${path}`, referenceBase(contract?.referenceRevision ?? manifest.reference.sourceRevision)).href}>{path}</a>)}<p>소스에 근거한 규격과 배포 화면 검증 결과는 별도로 기록합니다. 현재 모든 컴포넌트의 시각 동일성을 확인한 상태는 아닙니다.</p></section>}
                </> : section === "workspace" ? <><h1>Workspace</h1><p>독립 컴포넌트를 조합한 동작 예시입니다. 가상 후보 조회·즐겨찾기·상세 분류·비교 패널을 실행할 수 있습니다.</p><WorkspaceDemo /></> : section === "responsive" ? <><h1>Responsive</h1><ResponsivePreview component={selected} state={activeState} onStateChange={changeState} onComponentChange={changeResponsiveComponent}/></> : section === "rules" ? <><h1>Ground rules</h1><p>PRISM-DEV의 light UI를 유지하는 디자인 규칙입니다.</p>
                    <table className="prism-rules-table"><thead><tr><th>역할</th><th>규칙</th><th>근거</th></tr></thead><tbody>
                        <tr><td>색상</td><td>Primary #2F548C · secondary #FA7C39<br />Base #FDFDFD · LNB #F9FAFC · panel #EEF1F8</td><td>배포 DOM + _variables.scss</td></tr>
                        <tr><td>타이포그래피</td><td>Pretendard 400·500·600·700. 본문 14px, caption 12px, dialog 18px.</td><td>_fonts.scss와 component SCSS</td></tr>
                        <tr><td>컨트롤</td><td>Button 40/32/28/26px. Input 32/28px, radius 6px. ELP 16px.</td><td>_btn.scss · _text-field.scss · _badge.scss</td></tr>
                        <tr><td>표·정보 밀도</td><td>Header 6px 10px, cell 10px. Cool-neutral header, 행·열 border.</td><td>_table.scss</td></tr>
                        <tr><td>레이아웃</td><td>LNB 280/72px, side panel 440px, message max 540px. 작은 화면의 표는 내부 스크롤.</td><td>_chat-sidebar.scss · SidePanel · ChatMessageQuestion</td></tr>
                        <tr><td>상태</td><td>기본·hover·focus·disabled·readOnly·selected·loading·empty·error를 분리합니다.</td><td>native semantics + Radix 계약</td></tr>
                        <tr><td>추가 기능</td><td>pydemia 컴포넌트의 동작은 공유하고 PRISM token profile을 적용합니다.</td><td>기존 pydemia component contract</td></tr>
                    </tbody></table><p>원본 dark theme의 근거가 없어 dark mode를 추가하지 않습니다. 원본 벡터 자산은 형상을 보존하고 React adapter와 SVG ID 처리를 추가했습니다. 실제 인사 데이터는 예시에 사용하지 않습니다.</p>
                    <a className="prism-text-link" href="/prism/research/design-rules.md">상세 규칙과 차이 기록</a></> : <><h1>Coverage</h1><p>디자인과 동작의 목적별 대응표입니다. 재현·확장·미검증을 구분합니다.</p><p>기존 디자인 기준: <code>{manifest.reference.sourceRevision.slice(0,8)}</code> ({manifest.reference.observedAt}). 최근 소스 감사: <code>{manifest.reference.latestSourceAudit.revision.slice(0,8)}</code> ({manifest.reference.latestSourceAudit.observedAt}). 원본 inventory는 {manifest.sourceCoverage.total}개이며 미대응 신규 항목은 {manifest.sourceCoverage.pending}개입니다. 기존 항목의 원본 상태·시각 비교도 진행 중입니다.</p>
                    <table className="prism-rules-table"><thead><tr><th>컴포넌트</th><th>기능 목적</th><th>검증 상태</th></tr></thead><tbody>{manifest.components.map(item => <tr key={item.id}><td><button onClick={() => navigate(item.id)}>{item.name}</button></td><td>{item.purpose}</td><td>시각: {verificationLabel(item.verification.visual)}<br/>동작: {verificationLabel(item.verification.interaction)}</td></tr>)}</tbody></table>
                    <p>공통 pydemia 카탈로그의 {genericEntries.length}개 항목을 PRISM profile에서 실행할 수 있습니다. 이 숫자는 원본 PRISM coverage 또는 시각 일치율을 뜻하지 않습니다.</p>
                    <p>후보 상세 전체·6-frame 비교·출력·PDF·관리 화면·복합 입력의 원본 대응과 상태별 검증은 계속 진행합니다.</p>
                    <div className="prism-demo-row"><a href="/prism/components.json">AI component manifest</a><a href="/prism/research/source-inventory.json">원본 inventory</a><a href="/prism/research/verification.md">검증 기록</a></div></>}
                <p className="prism-copy-status" role="status">{copied}</p><footer className="prism-docs-footer">PRISM UI reference · 가상 데이터로 실행되는 독립 컴포넌트 예시</footer>
            </main></div></div>;
}
export function mountPrism(root:Root) { root.render(<PrismDocs />); }
