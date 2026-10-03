import { PrismIcon, prismIconNames, PrismTabs, PrismTabsList, PrismTabsTrigger, PrismTabsContent, PrismExpertiseSection, PrismExperienceSection, PrismDesignSection, PrismAgilitySection, PrismAttitudeSection, PrismLeadershipSection, PrismCommentsSection } from "@pydemia/prism";
import { useState } from "react";
import { PrismSummaryBadge, PrismNoData, PrismOutline } from "@pydemia/prism";
import { PrismNoticeForm, PrismCompanyGroupForm, PrismUserForm, PrismPositionForm, PrismSelect, PrismPrintPage, PrismPrintLeaderSummary, PrismPrintCareer, PrismPrintRisk, PrismPrintExperience, PrismChatIntro, PrismProfileSectionState, PrismTotalSection, type PrismNoticeDraft, type PrismCompanyGroupDraft, type PrismUserDraft, type PrismPositionDraft } from "@pydemia/prism";
import { PrismCriteriaEditor, PrismCriteriaRemapDialog, PrismCriteriaTag, PrismPositionCheckCard, PrismCompanyContextDialog, PrismCandidateDirectory, PrismDirectoryTable, PrismBlankLayout, PrismErrorContent, PrismServiceContact, type PrismCriteriaDraft, PrismResponse, PrismButton, PrismContextForm, PrismAffiliateLogo, PrismSidebarProfile, PrismSkeletonGroup, PrismPopover, PrismFavoriteToggle, PrismShowMore,
    PrismPositionDetail, PrismRiskTable, PrismDiagnosis, PrismScoreEssay, PrismExpertiseCards, PrismExperienceTopics, PrismExperienceEvidence, PrismLeadershipReasons, PrismPositionMatrix, PrismProfileAnalysis,
    PrismCandidateCollection, PrismCandidateFilterBar, PrismSuccessorBoard, PrismMemoComposer, PrismMemoCollection,
    PrismNoticeDialog, PrismNoticePopup, PrismInquiryHistory, PrismPolicyViewer, PrismDialog,
    type PrismContextValues, type PrismCandidateFilters, type PrismCandidate, type PrismNotice,
} from "@pydemia/prism";
import type { FixtureState } from "./catalog";
const demoCandidates: PrismCandidate[] = [{id:"one",name:"김가상",company:"가상전자",position:"기술전략담당",elp:"ELP",birthDate:"1980.01.01",executiveYears:3},{id:"two",name:"이예시",company:"예시사업",position:"운영총괄",elp:"s-ELP",executiveYears:5}];
export function ContextDemo({ state }: { state: FixtureState }) {
    const [values,setValues] = useState<PrismContextValues>({ issue:"",expertise:[] }); const [result,setResult] = useState("");
    return <><PrismContextForm fields={[{key:"issue",label:"핵심 현안·요구 사항",type:"textarea",required:true,description:"가상 포지션에 필요한 맥락을 입력해 주세요."},{key:"expertise",label:"전문 분야",type:"options",maxSelections:2,options:[{value:"tech",label:"기술",description:"기술 및 연구개발"},{value:"finance",label:"재무"},{value:"sales",label:"영업"},{value:"operations",label:"운영"}]}]}
        values={values} onValueChange={setValues} onSubmit={v => setResult(JSON.stringify(v))} onCancel={() => setResult("취소")} busy={state === "loading"} /><p role="status">{result}</p></>;
}
export function PrimitivesDemo({ state }: { state: FixtureState }) {
    const [favorite,setFavorite] = useState(false); const [expanded,setExpanded] = useState(false);
    return <div className="prism-demo-stack"><PrismAffiliateLogo brand="가상" affiliate="전자" /><PrismSidebarProfile name="김가상" email="demo@example.com" /><PrismFavoriteToggle name="김가상" checked={favorite} onCheckedChange={setFavorite} disabled={state === "disabled"} />
        <PrismPopover trigger={<PrismButton>추가 정보 열기</PrismButton>}><p>팝오버의 안내 내용입니다.</p></PrismPopover><PrismShowMore expanded={expanded} hiddenCount={3} onExpandedChange={setExpanded}><p>추가 항목의 내용입니다.</p></PrismShowMore>
        <PrismSummaryBadge label="가상 유형" summary={state==="empty" ? null : "가상 조직과 기술 경험을 요약한 표시 예시입니다."} note="호출자가 제공한 가상 유형의 설명입니다."/><PrismOutline><PrismNoData/></PrismOutline><PrismSkeletonGroup rows={3}/><PrismSkeletonGroup rows={2} height={60}/></div>;
}
export function PositionDemo({ state }: { state: FixtureState }) {
    return <PrismPositionDetail company="가상전자" role="기술전략담당" items={[{label:"계열",value:"ICT"},{label:"직무",value:"기술·연구개발"},{label:"조직",value:"기술전략실"}]} groups={[{id:"purpose",title:"포지션 Mission",items:state === "empty" ? [] : [{id:"mission",title:"미션",content:"가상 조직의 기술전략을 수립합니다."}]},{id:"requirements",title:"후보자 요구 사항",items:[{id:"expertise",title:"전문성",content:"기술·연구개발 경험"},{id:"design",title:"Design 역량",content:null}]}]} status={state === "loading" || state === "error" ? state : "ready"} />;
}
export function AssessmentDemo({ state }: { state: FixtureState }) {
    const [topic,setTopic] = useState("growth"); const empty = state === "empty";
    return <div className="prism-demo-stack"><PrismProfileAnalysis leader={{label:"전략 리더",description:"가상 데이터로 구성한 유형 표시"}} factors={[{id:"expertise",label:"전문성",results:["기술"],summary:empty ? null : "기술 경험 근거 표시"},{id:"experience",label:"성공경험",results:["사업 전환"],starred:["사업 전환"],summary:"예시 근거"}]} />
        <PrismRiskTable items={empty ? [] : [{id:"one",label:"자기 중심",latent:true,manifest:null},{id:"two",label:"충동성",latent:false,manifest:null},{id:"three",label:"낙관 편향",latent:null,manifest:null}]} />
        <PrismDiagnosis title="성격·가치관 진단 결과" axes={["개방성","성실성","외향성","우호성","정서 안정"]} values={empty ? [null,null,null,null,null] : [8,7,5,6,8]} heading="가상 진단" description="이미 제공된 값과 근거만 표시합니다." shares={empty ? [] : [{label:"자기초월",percent:30},{label:"안정",percent:20},{label:"개방",percent:25},{label:"자기증진",percent:25}]} valueDescription="가상 가치관 비중" />
        <PrismScoreEssay title="역량별 근거" items={[{id:"score",name:"문제 해결",score:empty ? null : 7,max:10,description:empty ? null : "가상 프로젝트의 문제 해결 경험"}]} />
        <PrismExpertiseCards items={empty ? [] : [{id:"one",field:"기술",years:"10년",title:"기술전략 수립",description:"공개 배포용 가상 사례"}]} />
        <PrismExperienceTopics topics={[{id:"growth",label:"성장",starred:true},{id:"change",label:"변화"}]} value={topic} onValueChange={setTopic} />
        <PrismExperienceEvidence title="관련 성공경험" items={[{id:topic,label:topic === "growth" ? "성장" : "변화",hasExperience:!empty,description:"새로운 역할을 맡은 가상 경험입니다."}]} />
        <PrismLeadershipReasons title="리더십 근거" items={[{id:"manager",role:"상사",text:empty ? null : "가상 동료 의견"}]} comment="가상 의견을 요약한 표시입니다." />
        <PrismPositionMatrix rowAxisLabel="회사" columns={[{id:"tech",label:"기술"},{id:"finance",label:"재무"}]} rows={[{id:"one",label:"가상전자"},{id:"two",label:"예시사업"}]} current={empty ? null : {row:"one",column:"tech"}} /></div>;
}
export function CollectionDemo({ state }: { state: FixtureState }) {
    const [view,setView] = useState<"cards" | "table">("cards"); const [filters,setFilters] = useState<PrismCandidateFilters>({series:"all",companies:[],name:""});
    const [result,setResult] = useState(""); const [draft,setDraft] = useState(""); const [memos,setMemos] = useState<string[]>([]); const [favorites,setFavorites] = useState<string[]>([]);
    const items = state === "empty" ? [] : demoCandidates;
    return <div className="prism-demo-stack"><PrismCandidateCollection title="후보자 목록" candidates={items} view={view} onViewChange={setView} onOpen={candidate => setResult(`${candidate.name} 선택`)} favorites={favorites}
        onFavoriteChange={(candidate,checked) => setFavorites(checked ? [...favorites,candidate.id] : favorites.filter(id => id !== candidate.id))} status={state === "loading" || state === "error" ? state : "ready"}
        filters={<PrismCandidateFilterBar value={filters} onValueChange={setFilters} seriesOptions={[{value:"all",label:"전체"},{value:"ICT",label:"ICT"}]} companyOptions={demoCandidates.map(c => ({value:c.company,label:c.company}))} onSearch={value => setResult(JSON.stringify(value))} onReset={() => setFilters({series:"all",companies:[],name:""})} disabled={state === "loading"} />} />
        <PrismSuccessorBoard rows={items.length ? [{id:"one",company:"가상전자",position:"기술전략담당",current:[demoCandidates[0]],ranks:[demoCandidates[1],null,null]}] : []} onOpen={candidate => setResult(`${candidate.name} 선택`)} loading={state === "loading"} />
        <PrismMemoCollection items={memos.map((content,index) => ({id:String(index),author:"김작성",date:"2026.10.03",content}))} composer={<PrismMemoComposer value={draft} onValueChange={setDraft} onSubmit={content => {setMemos([...memos,content]);setDraft("");}} busy={state === "loading"} />} /><p role="status">{result}</p></div>;
}
const notices: PrismNotice[] = [{id:"one",title:"가상 공지사항",date:"2026.10.03",author:"김작성",content:"실제 사내 공지나 인사 데이터를 포함하지 않는 UI 예시입니다."},{id:"two",title:"두 번째 가상 공지",date:"2026.10.02",author:"이작성",content:"비모달 공지의 다음 항목입니다."}];
export function NoticeDemo({ state }: { state: FixtureState }) {
    const [open,setOpen] = useState(false); const [popup,setPopup] = useState(false); const [selected,setSelected] = useState<string | null>(null); const [index,setIndex] = useState(0); const [order,setOrder] = useState<"latest" | "oldest">("latest");
    const [inquiry,setInquiry] = useState<string | null>(null); const [policy,setPolicy] = useState("one"); const [policyOpen,setPolicyOpen] = useState(false);
    return <div className="prism-demo-stack"><div className="prism-demo-row"><PrismButton onClick={() => setOpen(true)}>공지 목록 열기</PrismButton><PrismButton onClick={() => setPopup(true)}>공지 팝업 열기</PrismButton><PrismButton onClick={() => setPolicyOpen(true)}>방침 열기</PrismButton></div>
        <PrismNoticeDialog open={open} onOpenChange={setOpen} items={state === "empty" ? [] : order === "latest" ? notices : [...notices].reverse()} selectedId={selected} onSelect={setSelected} order={order} onOrderChange={setOrder} status={state === "loading" || state === "error" ? state : "ready"} />
        <PrismNoticePopup open={popup} notices={notices} index={index} onIndexChange={setIndex} onClose={() => setPopup(false)} />
        <PrismInquiryHistory items={state === "empty" ? [] : [{id:"one",title:"가상 문의",date:"2026.10.03",status:"답변 대기",content:"가상 문의 내용",answer:null}]} selectedId={inquiry} onSelect={setInquiry} />
        <PrismDialog title="개인정보처리방침" description="버전별 문서 표시 예시입니다." open={policyOpen} onOpenChange={setPolicyOpen}><PrismPolicyViewer versions={[{id:"one",label:"v1"},{id:"two",label:"v2"}]} value={policy} onValueChange={setPolicy} documentHtml={`<!doctype html><html lang="ko"><body><h1>가상 방침 ${policy === "one" ? "1" : "2"}</h1><p>법적 약관이 아닌 문서 표시용 가상 내용입니다.</p></body></html>`} /></PrismDialog></div>;
}

export function ResponseDemo({ state }: { state: FixtureState }) {
    const [result,setResult] = useState("");
    return <div className="prism-demo-stack"><PrismResponse status={state === "loading" ? "generating" : state === "error" ? "error" : "complete"} blocks={[
        {id:"text",type:"text",content:'<bold>Independent response</bold> <color-blue>Blue text</color> <highlight-yellow>Highlight</highlight> <badge-green>Evidence</badge>\n[Profile](profile://one) [Position](position://one)'},
        {id:"criteria",type:"criteria",items:["Synthetic fixture data only"]},
        {id:"candidates",type:"candidates",candidates:state === "empty" ? [] : demoCandidates},
        {id:"table",type:"table",title:"Comparison",columns:["Area","Value"],rows:[{id:"one",cells:["Evidence",null]},{id:"two",cells:["Score",0]}]},
        {id:"options",type:"options",title:"Next step",options:[{id:"profile",label:"Show profile"},{id:"position",label:"Show position"}]},
        {id:"callout",type:"callout",tone:"blue",content:"This example displays supplied data without running HR decisions."},
    ]} onCandidateOpen={c => setResult(c.name)} onOptionSelect={setResult} onAction={(kind,id) => setResult(`${kind}: ${id}`)} /><p role="status">{result}</p></div>;
}

export function ManagementToolsDemo({ state }: { state: FixtureState }) {
    const [open,setOpen] = useState(false); const [remove,setRemove] = useState(false); const [context,setContext] = useState(false); const [draft,setDraft] = useState<PrismCriteriaDraft>({name:"",description:"",categoryId:"",subJobs:[]});
    const [remap,setRemap] = useState<Readonly<Record<string,string>>>({}); const [checked,setChecked] = useState(false); const [status,setStatus] = useState<"idle" | "available" | "duplicate">(state === "error" ? "duplicate" : "idle"); const [result,setResult] = useState("");
    return <div className="prism-demo-stack"><div className="prism-demo-row"><PrismButton onClick={() => setOpen(true)}>Edit criteria</PrismButton><PrismButton variant="line" onClick={() => setRemove(true)}>Remap criteria</PrismButton><PrismButton variant="line" onClick={() => setContext(true)}>Company context</PrismButton></div>
        <div className="prism-demo-row">{(["new","modified","deleted","applying","failed"] as const).map(change => <PrismCriteriaTag key={change} label="Example criterion" change={change} onEdit={() => setOpen(true)} onDelete={() => setRemove(true)} />)}</div>
        <PrismPositionCheckCard id="one" title="Expertise" description="Synthetic option" checked={checked} onChange={setChecked} disabled={state === "loading"} />
        <PrismCriteriaEditor title="Job criteria" open={open} onOpenChange={setOpen} value={draft} onValueChange={value => {setDraft(value);setStatus("idle");}} categories={[{id:"tech",label:"Technology"},{id:"finance",label:"Finance"}]} checkStatus={status} onCheck={() => setStatus("available")} onGenerate={() => setDraft({...draft,description:"Generated synthetic definition"})} onSubmit={value => setResult(JSON.stringify(value))} busy={state === "loading"} positions={[{id:"one",name:"Example position",company:"Example company"}]} />
        <PrismCriteriaRemapDialog open={remove} onOpenChange={setRemove} targetId="old" targetName="Old criterion" positions={[{id:"one",name:"Example position",company:"Example company"}]} options={[{id:"old",label:"Old criterion"},{id:"new",label:"New criterion"}]} value={remap} onValueChange={setRemap} onConfirm={value => {setResult(JSON.stringify(value));setRemove(false);}} busy={state === "loading"} />
        <PrismCompanyContextDialog open={context} onOpenChange={setContext} company="Example company" content="Synthetic company context. No source internal content is included." onCopy={setResult} /><p role="status">{result}</p></div>;
}
export function DirectoryDemo({ state }: { state: FixtureState }) {
    const [selected,setSelected] = useState<string[]>([]); const [sort,setSort] = useState<{column:string;direction:"asc" | "desc"} | null>(null); const [opened,setOpened] = useState("");
    const rows = state === "empty" ? [] : demoCandidates.map(candidate => ({...candidate,series:"ICT",favorite:false}));
    return <div className="prism-demo-stack"><PrismCandidateDirectory rows={rows} selected={selected} onSelectionChange={setSelected} sort={sort} onSortChange={setSort} onOpen={candidate => setOpened(candidate.name)} loading={state === "loading"} />
        <PrismDirectoryTable title="Administration table" rows={[{id:"shared",name:"Shared criterion",locked:true},{id:"editable",name:"Editable criterion",locked:false}]} getRowId={r => r.id} getRowLabel={r => r.name} columns={[{id:"name",label:"Name",cell:r => r.name}]} selected={selected} onSelectionChange={setSelected} isRowSelectable={r => !r.locked} />
        <p role="status">Selection: {selected.join(", ")} | Sort: {sort?.column} {sort?.direction} | Open: {opened}</p></div>;
}
export function PageStateDemo() {
    const [count,setCount] = useState(0);
    return <div><div style={{height:500}}><PrismBlankLayout><PrismErrorContent code="404" message="Requested page was not found." buttonLabel="Return" onAction={() => setCount(count+1)} /></PrismBlankLayout></div><PrismServiceContact email="demo@example.com" /><p role="status">Action: {count}</p></div>;
}

export function DomainFormsDemo({state}:{state:FixtureState}) {
    const [kind,setKind]=useState("notice"); const [result,setResult]=useState(""); const disabled=state==="loading",readOnly=state==="readonly";
    const [notice,setNotice]=useState<PrismNoticeDraft>({title:"",content:"",companyIds:[],allCompanies:false,popup:false,start:null,end:null});
    const [group,setGroup]=useState<PrismCompanyGroupDraft>({name:"",companyIds:[]});
    const [user,setUser]=useState<PrismUserDraft>({email:"",roleId:"member",companyGroupId:""});
    const [position,setPosition]=useState<PrismPositionDraft>({name:"",companyId:"",industryId:"",roleId:"",mainJobId:"",subJobId:"",isCore:false,context:"",definition:"",expertise:"",experience:"",subExpertise:"",subExperience:"",expertiseIds:[],experienceIds:[]});
    const options=[{value:"sample",label:"가상전자"},{value:"example",label:"예시사업"}];
    const actions={onSubmit:()=>setResult("저장 의도 확인"),onCancel:()=>setResult("취소 의도 확인"),busy:disabled,readOnly,error:state==="error" ? "저장 요청을 처리하지 못했습니다." : undefined};
    return <div className="prism-demo-stack"><PrismSelect label="양식 종류" value={kind} onValueChange={setKind} options={[{value:"notice",label:"공지사항"},{value:"group",label:"회사 그룹"},{value:"user",label:"사용자"},{value:"position",label:"포지션"}]}/>
        {kind==="notice" ? <PrismNoticeForm {...actions} value={notice} onValueChange={setNotice} companies={options} files={[]} onFilesSelected={files=>setResult(files.map(f=>f.name).join(", "))} canChooseAllCompanies/> : kind==="group" ? <PrismCompanyGroupForm {...actions} value={group} onValueChange={setGroup} companies={options}/> : kind==="user" ? <PrismUserForm {...actions} value={user} onValueChange={setUser} roles={[{value:"group",label:"그룹 HR 담당자"},{value:"member",label:"멤버사 일반 사용자",needsCompanyGroup:true}]} companyGroups={[{id:"demo",name:"가상 회사 그룹",companies:["가상전자","예시사업"]}]}/> : <PrismPositionForm {...actions} value={position} onValueChange={setPosition} companies={options} industries={[{value:"ict",label:"ICT"}]} roles={[{value:"leader",label:"사업 책임"}]} jobs={[{value:"tech",label:"기술"},{value:"sales",label:"영업"}]} expertiseOptions={[{id:"a",label:"연구개발",description:"기술 및 제품 개발"},{id:"b",label:"재무",description:"재무 및 자본 관리"},{id:"c",label:"영업",description:"고객 및 시장 개발"},{id:"d",label:"생산",description:"생산 및 운영 관리"}]} experienceOptions={[{id:"one",label:"사업 성장",description:""},{id:"two",label:"사업 전환",description:""},{id:"three",label:"Globality",description:""}]} canEditCore onGenerate={()=>setResult("생성 의도 확인")}/>}
        <p role="status">{result}</p></div>;
}
export function PrintDemo({state}:{state:FixtureState}) {
    const career = state === "empty" ? [] : state === "long" ? Array.from({length:36},(_,index)=>({id:`career-${index}`,period:"2020 ~ 2023",company:"가상전자",role:`인쇄 검증용 가상 직무 ${index+1}`})) : [{id:"one",period:"2024 ~ 현재",company:"가상전자",role:"기술전략담당"},{id:"two",period:"2020 ~ 2023",company:"예시사업",role:"연구개발팀장"}];
    return <div style={{overflow:"auto"}}><PrismPrintPage name="김가상" company={{brand:"가상",affiliate:"전자"}} jobTitle="기술전략담당" repeatHeader><PrismPrintLeaderSummary name="전략 리더" summary="화면 및 출력 검증을 위한 가상 데이터입니다." definition="기술 및 사업 전략을 연결하는 유형 표시"/><PrismPrintCareer items={career}/><PrismPrintRisk items={[{id:"a",label:"자기 중심",latent:true,manifest:null},{id:"b",label:"충동성",latent:false,manifest:null}]}/><PrismPrintExperience topics={["사업 성장","사업 전환"]} activeTopic="사업 성장" items={state==="empty" ? [] : [{id:"one",topic:"사업 성장",representative:true,title:"가상 제품 개발",description:"가상 사례를 표시하는 예시입니다.",keywords:["기술","협업"],interview:"외부에서 전달한 근거 텍스트 표시"}]}/></PrismPrintPage></div>;
}
export function IntroDemo({state}:{state:FixtureState}) {
    const [value,setValue]=useState(""); const [result,setResult]=useState("");return <><PrismChatIntro name="김가상" loading={state==="loading"} questions={state==="empty" ? [] : ["기술 분야 후보자를 알려 주세요.","현재 포지션의 요구 사항을 확인해 주세요."]} onPromptSelect={setValue} cards={[{id:"favorite",title:"후보자 즐겨찾기",description:"저장한 후보자를 한곳에서 다시 확인해보세요",onOpen:()=>setResult("즐겨찾기 열기") }]} composer={{value,onValueChange:setValue,onSubmit:text=>{setResult(text);setValue("");},disabled:state==="disabled"}}/><p role="status">{result}</p></>;
}
export function ProfileSectionsDemo({state}:{state:FixtureState}) {
    const [tab,setTab]=useState("total");const [topic,setTopic]=useState("growth");const [draft,setDraft]=useState("");const [comments,setComments]=useState([{id:"one",author:"김작성",date:"2026.10.03",comment:"가상 프로젝트의 협업 사례를 확인했습니다."}]);const [retried,setRetried]=useState(false);
    const empty=state==="empty";const status=state==="loading"||state==="error"&&!retried ? state : "ready";
    const summary={heading:empty ? null : "가상 표시 결과",description:empty ? null : "소비자가 제공한 평가 근거를 표시하는 예시입니다."};
    const validation={title:"검증 자료",items:empty ? [] : [{id:"one",label:"가상 경력 기록",status:"confirmed" as const,evidence:"가상 프로젝트 기록"},{id:"two",label:"추가 근거",status:"missing" as const}]};
    const score={title:"SUMMARY",items:empty ? [] : [{id:"one",name:"문제 해결",score:7,max:10,description:"기술 및 조직 문제를 해결한 가상 경험입니다."},{id:"two",name:"사업 전환",score:null,max:10,description:null}]};
    const axes=["전략","실행","협업","육성","혁신"];const radar={title:"리더십 Survey",axes:axes.map((label,i)=>({id:String(i),label})),series:[{id:"candidate",label:"가상 후보",values:empty ? [null,null,null,null,null] : [4,3.5,4.2,3.8,4.1]}],max:5};
    const labels=["22년","23년","24년","25년","26년"];
    const sections=[
        {id:"total",label:"종합",content:<PrismTotalSection leader={{label:"전략 리더",summary:empty ? null : "가상 근거로 구성한 요약 표시",note:"실제 평가 결과가 아닙니다."}} basic={{items:[{label:"생년월일",value:empty ? null : "1980.01.01"},{label:"최종 학위",value:empty ? null : "가상 전공 석사"}]}} career={{entries:empty ? [] : [{id:"one",period:"2024 ~ 현재",company:"가상전자",role:"기술전략담당"}]}} compensation={{years:["24년","25년","26년"],rows:empty ? [] : [{label:"총보상",values:[null,"100",{won:"120",foreign:{currency:"USD",amount:"1,000"}}]},{label:"연봉",values:[null,"90","100"]},{label:"IB",values:[null,"10",0]}]}}/>},
        {id:"expertise",label:"전문성",content:<PrismExpertiseSection summary={summary} fields={{items:empty ? [] : [{id:"tech",field:"기술·연구개발",years:"10년",title:"가상 제품 개발",description:"기술 분야의 대표 업적을 표시합니다."}]}} validation={validation}/>},
        {id:"experience",label:"성공경험",content:<PrismExperienceSection summary={score} topics={{topics:[{id:"growth",label:"사업 성장",starred:true},{id:"change",label:"사업 전환"}],value:topic,onValueChange:setTopic}} experience={empty ? [] : [{title:topic==="growth" ? "가상 사업 성장" : "가상 사업 전환",area:topic==="growth" ? "사업 성장" : "사업 전환",company:"가상전자",period:"2024",grade:null,children:"제공한 경험과 근거를 표시합니다."}]} failure={{title:"실패경험",description:empty ? null : "실패 경험에 대한 가상 기록입니다."}}/>},
        {id:"design",label:"Design 역량",content:<PrismDesignSection summary={summary} matrix={<PrismPositionMatrix rowAxisLabel="회사" rows={[{id:"one",label:"가상전자"},{id:"two",label:"예시사업"}]} columns={[{id:"tech",label:"기술"},{id:"finance",label:"재무"}]} current={empty ? null : {row:"one",column:"tech"}}/>}/>},
        {id:"agility",label:"Learning Agility",content:<PrismAgilitySection summary={score} experience={{title:"관련 성공경험",items:empty ? [] : [{id:"one",label:"새로운 환경",hasExperience:true,description:"새로운 역할을 맡은 가상 경험입니다."},{id:"two",label:"학습 전환",hasExperience:null}]}}/>},
        {id:"attitude",label:"Attitude",content:<PrismAttitudeSection summary={summary} diagnosis={{title:"성격·가치관 진단 결과",axes:["개방성","성실성","외향성","우호성","정서 안정"],values:empty ? [null,null,null,null,null] : [8,7,5,6,8],description:empty ? undefined : "가상 진단의 해석을 표시합니다.",shares:empty ? [] : [{label:"자기초월",percent:30},{label:"안정",percent:20},{label:"개방",percent:25},{label:"자기증진",percent:25}],valueDescription:empty ? undefined : "가상 가치관 비중"}} risk={{items:[{id:"one",label:"자기 중심",latent:empty ? null : true,manifest:null},{id:"two",label:"충동성",latent:empty ? null : false,manifest:null}]}}/>},
        {id:"leadership",label:"리더십",content:<PrismLeadershipSection summary={summary} radar={radar} validation={validation} strength={{title:"강점",items:empty ? [] : [{id:"manager",role:"상사",text:"가상 동료 의견"}],comment:empty ? undefined : "강점에 대한 요약"}} improvement={{title:"보완할 점",items:empty ? [] : [{id:"colleague",role:"동료",text:null}]}} trend={{chart:{title:"과거 5개년 리더십 Survey 추이",labels,series:[{id:"candidate",label:"가상 후보",values:empty ? [null,null,null,null,null] : [3.8,null,4.1,3.9,4.2]}]},rows:empty ? [] : labels.map((year,i)=>({year,evaluators:10+i,respondents:i===1 ? null : 10+i,score:i===1 ? null : 3.8+i*.1,groupAverage:3.9,percentile:i===1 ? null : 20-i}))}}/>},
        {id:"comments",label:"Mgmt. Comments",content:<PrismCommentsSection items={empty ? [] : comments} editor={{value:draft,onValueChange:setDraft,onSave:comment=>{setComments([...comments,{id:String(comments.length+1),author:"김작성",date:"2026.10.03",comment}]);setDraft("");},onCancel:()=>setDraft("")}}/>},
    ];
    return <PrismTabs value={tab} onValueChange={setTab}><PrismTabsList aria-label="프로필 분류">{sections.map(section=><PrismTabsTrigger key={section.id} value={section.id}>{section.label}</PrismTabsTrigger>)}</PrismTabsList>{sections.map(section=><PrismTabsContent key={section.id} value={section.id}><PrismProfileSectionState status={status} onRetry={()=>setRetried(true)}>{section.content}</PrismProfileSectionState></PrismTabsContent>)}</PrismTabs>;
}

export function IconDemo() { return <div className="prism-icon-gallery">{prismIconNames.map(name=><figure key={name}><PrismIcon name={name} size={48}/><figcaption>{name}</figcaption></figure>)}</div>; }
