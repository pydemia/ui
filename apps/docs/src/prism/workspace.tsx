import { useState } from "react";
import { PrismIcon, PrismWorkspace, PrismSidebar, PrismPanel, PrismButton, PrismInput, PrismMessage, PrismChatInput,
    PrismCandidateCard, PrismCandidateTable, PrismProfile, PrismSixFrame, PrismRequestState, PrismAdminLayout,
    type PrismCandidate, type PrismProfileTab } from "@pydemia/prism";
import { candidates, frameColumns, profileSections } from "./catalog";

export function WorkspaceDemo() {
    const [exampleWidth,setExampleWidth]=useState(1200);const [exampleHeight,setExampleHeight]=useState(760);const [navigationOpen,setNavigationOpen]=useState(false);
    const [nav,setNav] = useState("chat"); const [collapsed,setCollapsed] = useState(false); const [query,setQuery] = useState("");
    const [messages,setMessages] = useState<string[]>([]); const [busy,setBusy] = useState(false); const [error,setError] = useState(false);
    const [selected,setSelected] = useState<PrismCandidate | null>(null); const [panelType,setPanelType] = useState("profile"); const [expanded,setExpanded] = useState(false);
    const [tab,setTab] = useState<PrismProfileTab>("total"); const [favorites,setFavorites] = useState<string[]>([]); const [filter,setFilter] = useState("");
    const choose = (candidate: PrismCandidate) => { setSelected(candidate); setPanelType("profile"); setTab("total"); };
    const toggleFavorite = (candidate: PrismCandidate, favorite: boolean) => setFavorites(favorite ? [...new Set([...favorites,candidate.id])] : favorites.filter(id => id !== candidate.id));
    const list = candidates.filter(c => (nav !== "favorites" || favorites.includes(c.id)) && `${c.name} ${c.company} ${c.position}`.includes(filter));
    const newChat = () => { setNav("chat"); setMessages([]); setQuery(""); setBusy(false); setError(false); setSelected(null);setNavigationOpen(false); };
    return <div className="prism-demo-stack"><div className="prism-sizing-controls"><label>예시 너비 <input type="range" min={320} max={1200} step={20} value={exampleWidth} onChange={e=>setExampleWidth(Number(e.target.value))}/><output>{exampleWidth}px</output></label><label>예시 높이 <input type="range" min={440} max={900} step={20} value={exampleHeight} onChange={e=>setExampleHeight(Number(e.target.value))}/><output>{exampleHeight}px</output></label></div><div style={{width:`min(100%,${exampleWidth}px)`,minWidth:0}}><PrismWorkspace height={exampleHeight} navigationOpen={navigationOpen} onNavigationOpenChange={setNavigationOpen} sidebar={<PrismSidebar collapsed={collapsed} onCollapsedChange={setCollapsed} activeId={nav} onNavigate={id => { setNav(id === "demo-history" ? "chat" : id); if(id === "demo-history")setMessages(["가상 후보자 조회"]); setSelected(null);setNavigationOpen(false); }} onNewChat={newChat}
        items={[{id:"chat",label:"대화",icon:<PrismIcon name="ChatIcon" size={24}/>},{id:"candidates",label:"후보자 목록",icon:<PrismIcon name="UsersIcon" size={24}/>},{id:"favorites",label:"후보자 즐겨찾기",icon:<PrismIcon name="FavoriteLargeIcon" size={24}/>},{id:"admin",label:"Admin",icon:<PrismIcon name="AdminIcon" size={24}/>}]} history={[{id:"demo-history",title:"가상 후보자 조회"}]} user={{name:"demo-user",description:"demo@example.com"}} />}
        header={<><strong>{nav === "chat" ? "새로운 대화" : nav === "candidates" ? "후보자 목록" : nav === "favorites" ? "후보자 즐겨찾기" : "포지션 관리"}</strong><span className="prism-help">가상 데이터 · 로컬 동작</span></>}
        panel={<PrismPanel title={panelType === "compare" ? "6-frame 비교" : "후보자 상세"} open={selected !== null || panelType === "compare"} expanded={expanded} onExpandedChange={setExpanded} resizable
            onOpenChange={open => { if (!open) { setSelected(null); setPanelType("profile"); } }}>{panelType === "compare" ? <PrismSixFrame columns={frameColumns} panel /> : selected &&
                <PrismProfile candidate={selected} activeTab={tab} onTabChange={setTab} sections={profileSections()} favorite={favorites.includes(selected.id)} onFavoriteChange={next => toggleFavorite(selected,next)} />}</PrismPanel>}>
        {nav === "chat" ? <div className="prism-workspace-chat"><div className="prism-workspace-messages">
            {!messages.length && <div className="prism-chat-welcome"><h1>Leadership PRISM</h1><p>어떤 후보자 정보를 확인하시겠습니까?</p><PrismButton variant="line" onClick={() => setMessages(["가상 후보자 목록을 보여 주세요."])}>가상 후보자 조회</PrismButton></div>}
            {messages.map((text,index) => <div key={index} className="prism-demo-stack"><PrismMessage role="user">{text}</PrismMessage><PrismMessage role="assistant">다음은 카탈로그 검증용 가상 후보자입니다.</PrismMessage>
                <div className="prism-workspace-cards">{candidates.map(candidate => <PrismCandidateCard key={candidate.id} candidate={candidate} onOpen={choose} favorite={favorites.includes(candidate.id)} onFavoriteChange={next => toggleFavorite(candidate,next)} />)}</div>
                <PrismButton variant="line" onClick={() => { setSelected(null); setPanelType("compare"); }}>6-frame 비교</PrismButton></div>)}
            {error && <PrismRequestState status="error" error="검증을 위해 표시한 오류입니다." onRetry={() => setError(false)} />}{busy && <PrismRequestState status="loading" />}</div>
            <div className="prism-workspace-composer"><PrismChatInput value={query} onValueChange={setQuery} onSubmit={text => { setMessages([...messages,text]); setQuery(""); }} busy={busy} onStop={() => setBusy(false)} />
                <div className="prism-demo-row"><PrismButton variant="shape" size="small" onClick={() => setBusy(!busy)}>생성 중 상태</PrismButton><PrismButton variant="shape" size="small" onClick={() => setError(!error)}>오류 상태</PrismButton></div></div></div> :
            nav === "admin" ? <PrismAdminLayout title="포지션 관리" filters={<PrismInput label="포지션 검색" value={filter} onChange={e => setFilter(e.target.value)} />}
                toolbar={<span>총 {list.length}건</span>}><PrismCandidateTable candidates={list} onOpen={choose} caption="가상 포지션 목록" /></PrismAdminLayout> :
            <div className="prism-workspace-list"><PrismInput label="후보자 검색" placeholder="이름·회사·직책" value={filter} onChange={e => setFilter(e.target.value)} /><p>총 {list.length}명</p>
                {list.length ? list.map(candidate => <PrismCandidateCard key={candidate.id} candidate={candidate} onOpen={choose} favorite={favorites.includes(candidate.id)} onFavoriteChange={next => toggleFavorite(candidate,next)} />) : <PrismRequestState status="empty" />}</div>}
    </PrismWorkspace></div></div>;
}
