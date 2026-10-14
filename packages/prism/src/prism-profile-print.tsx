import { useLayoutEffect, useRef, useState, type ComponentProps, type CSSProperties, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { createPrismPrintPdf, type PrismPrintPdfCapture, type PrismPrintPdfResult, type PrismPdfExportProgress } from "./prism-export";
import { PrismPrintPage, PrismPrintLeaderSummary, PrismPrintCareer, PrismPrintRisk, PrismPrintExperience, type PrismPrintCareerItem, type PrismPrintExperienceItem } from "./prism-print";
import { PrismFavoriteProfile, PrismBasicInfo, PrismOutline, PrismSummaryBadge } from "./prism-profile";
import type { PrismCandidate } from "./prism-candidate";
import { PrismNoData, PrismAssessmentSummary, PrismExpertiseCards, PrismExperienceEvidence, PrismLeadershipReasons, PrismDesignDiversity, PrismDiagnosis } from "./prism-assessment";
import { PrismCompensationGrid, PrismLeadershipPieSummary, PrismLeadershipTrend } from "./prism-profile-sections";
import { PrismSurveyValidation, type PrismSurveyItem } from "./prism-survey";

export type PrismPrintScoreEssayItem={id:string;name:string;score:number|null;max:number|null;description:string|null};
export type PrismPrintSummaryData={title?:string|null;description?:string|null};
export type PrismPrintBasicInfoItem={label:string;value:string|readonly string[]|null};
export type PrismPrintGradeData={grade:string|null;description:string|null;essays:readonly PrismPrintScoreEssayItem[];survey:readonly PrismSurveyItem[]};
export type PrismProfilePrintModel={
    id:string;candidate:PrismCandidate;companyLogo?:ReactNode;
    leader?:ComponentProps<typeof PrismPrintLeaderSummary>|null;basicInfo?:readonly PrismPrintBasicInfoItem[];career?:readonly PrismPrintCareerItem[];
    compensation?:ComponentProps<typeof PrismCompensationGrid>|null;
    expertise?:{summary:PrismPrintSummaryData|null;fields:ComponentProps<typeof PrismExpertiseCards>["items"];survey:readonly PrismSurveyItem[]}|null;
    success?:{summary:PrismPrintSummaryData|null;topics:readonly string[];essays:readonly PrismPrintExperienceItem[];failures:readonly {id:string;title:string|null;description:string|null}[]}|null;
    design?:(PrismPrintGradeData&{diversity:ComponentProps<typeof PrismDesignDiversity>|null})|null;
    agility?:(PrismPrintGradeData&{experiences:ComponentProps<typeof PrismExperienceEvidence>["items"]})|null;
    attitude?:{summary:PrismPrintSummaryData|null;diagnosis:Omit<ComponentProps<typeof PrismDiagnosis>,"action"|"className"|"style">|null;risk:ComponentProps<typeof PrismPrintRisk>["items"];survey:readonly PrismSurveyItem[]}|null;
    leadership?:{summary:ComponentProps<typeof PrismLeadershipPieSummary>|null;survey:readonly PrismSurveyItem[];strengths:ComponentProps<typeof PrismLeadershipReasons>["items"];strengthsComment?:string;improvements:ComponentProps<typeof PrismLeadershipReasons>["items"];improvementsComment?:string;trend:ComponentProps<typeof PrismLeadershipTrend>|null}|null;
};
export type PrismProfilePrintOptions={summary?:boolean;compensation?:boolean};
export type PrismPrintTextPolicy="full"|"reference-limits";
export const prismPrintSections=[{id:"total",label:"종합"},{id:"expertise",label:"전문성"},{id:"success",label:"성공경험"},{id:"design",label:"Design 역량"},{id:"agility",label:"Learning Agility"},{id:"attitude",label:"Attitude"},{id:"leadership",label:"Leadership"}] as const;
export type PrismPrintSectionId=typeof prismPrintSections[number]["id"];
/** Display-only shortening copies the affected fields and never mutates the host's source model. */
export function preparePrismPrintProfile(model:PrismProfilePrintModel,policy:PrismPrintTextPolicy="full") {
    if(!["full","reference-limits"].includes(policy))throw new Error("Unknown print text policy.");
    const shortened:string[]=[];
    const cut=<T extends string|null|undefined>(value:T,max:number,path:string):T=>{if(typeof value!=="string"||Array.from(value).length<=max)return value;shortened.push(path);return Array.from(value).slice(0,max).join("") as T;};
    if(policy==="full")return {model,shortened};
    const grade=(value:PrismPrintGradeData,path:string)=>({...value,description:cut(value.description,350,path+".description"),essays:value.essays.map((item,index)=>({...item,description:cut(item.description,300,`${path}.essays.${index}`)}))});
    const result:PrismProfilePrintModel={...model,
        expertise:model.expertise?{...model.expertise,summary:model.expertise.summary?{...model.expertise.summary,description:cut(model.expertise.summary.description,350,"expertise.summary")}:null}:model.expertise,
        design:model.design?{...model.design,...grade(model.design,"design")}:model.design,
        agility:model.agility?{...model.agility,...grade(model.agility,"agility")}:model.agility,
        attitude:model.attitude?{...model.attitude,summary:model.attitude.summary?{title:cut(model.attitude.summary.title,70,"attitude.title"),description:cut(model.attitude.summary.description,250,"attitude.summary")}:null,
            diagnosis:model.attitude.diagnosis?{...model.attitude.diagnosis,description:cut(model.attitude.diagnosis.description,300,"attitude.personality"),valueDescription:cut(model.attitude.diagnosis.valueDescription,300,"attitude.values")}:null}:model.attitude,
        leadership:model.leadership?{...model.leadership,summary:model.leadership.summary?{...model.leadership.summary,title:cut(model.leadership.summary.title,100,"leadership.title"),description:cut(model.leadership.summary.description,350,"leadership.summary")}:null}:model.leadership,
    };return {model:result,shortened};
}
function textWidthPt(text:string){let width=0;for(const char of text)width+=' ,.·()/-'.includes(char)?3:char.codePointAt(0)!>0x2e80?11:6.2;return width;}
/** Source-based size estimate. Actual browser/font pagination remains a separate verification. */
export function paginatePrismPrintCareers(items:readonly PrismPrintCareerItem[],basicInfo:readonly PrismPrintBasicInfoItem[]=[],{firstPageExtraPt=0,lastPageReservePt=0}:{firstPageExtraPt?:number;lastPageReservePt?:number}={}) {
    if([firstPageExtraPt,lastPageReservePt].some(value=>!Number.isFinite(value)||value<0))throw new RangeError("Print page reservations must be finite and nonnegative.");
    const infoHeight=basicInfo.reduce((sum,item)=>{const lines=Array.isArray(item.value)?Math.max(1,item.value.length):1;return sum+lines*15.4+(lines-1)*3;},0)+Math.max(0,basicInfo.length-1)*8;
    let budget=Math.max(565-firstPageExtraPt-infoHeight,27.4),used=0,page:PrismPrintCareerItem[]=[];const pages:PrismPrintCareerItem[][]=[];
    for(const item of items){const role=typeof item.role==="string"?item.role:item.role.join(", ");const height=Math.max(1,Math.ceil(textWidthPt(role)/Math.max(538-178-textWidthPt(item.company),100)))*15.4+12;
        if(page.length&&used+height>budget){pages.push(page);page=[];used=0;budget=680;}page.push(item);used+=height;}
    if(page.length||!pages.length)pages.push(page);
    if(lastPageReservePt&&used+lastPageReservePt>budget)pages.push([]);
    return pages;
}
function summaryReserve(model:PrismProfilePrintModel){const leader=model.leader;if(!leader?.summary?.trim())return 128;
    const note=leader.definition?.trim()?`${leader.name?.trim()?leader.name.trim()+" : ":""}${leader.definition.trim()}`:"";
    const content=Math.max(1,Math.ceil(textWidthPt(leader.summary)/365))*15.4+(note?6+Math.max(1,Math.ceil(textWidthPt(note)*10/11/365))*14:0)+16;
    return 22+Math.max(94,content)+12;
}
export function PrismPrintScoreEssays({title,items}:{title:string;items:readonly PrismPrintScoreEssayItem[]}) {
    if(new Set(items.map(item=>item.id)).size!==items.length||items.some(item=>!item.id||item.max!==null&&(!Number.isFinite(item.max)||item.max<=0)||item.score!==null&&(!Number.isFinite(item.score)||item.score<0||item.max!==null&&item.score>item.max)))throw new RangeError("Print essays require unique IDs and null or valid supplied scores/maxima.");
    return <section className="prism-profile-print-score"><h3>{title}</h3><PrismOutline>{items.length?items.map(item=><article key={item.id}><header><strong>{item.name}</strong><span><b>{item.score??"--"}</b> / {item.max??"--"}</span></header><p>{item.description?.trim()?item.description:"관련 데이터 없음"}</p></article>):<PrismNoData/>}</PrismOutline></section>;
}
function Survey({items}:{items:readonly PrismSurveyItem[]}){return <PrismSurveyValidation items={items} columns={items.length>=3?3:2} barMaxHeight={65}/>;}
function Summary({data}:{data?:PrismPrintSummaryData|null}){return <PrismAssessmentSummary heading={data?.title??undefined} description={data?.description}/>;}
function Grade({data}:{data?:PrismPrintGradeData|null}){return <PrismSummaryBadge label={data?.grade??"-"} summary={data?.description}/>;}
export function PrismPrintTabBar({active}:{active:PrismPrintSectionId}){return <div className="prism-profile-print-tabs" data-print-repeat-part aria-label="프로필 인쇄 분류">{prismPrintSections.map(section=><span key={section.id} aria-current={section.id===active?"page":undefined}>{section.label}</span>)}</div>;}
export type PrismProfilePrintDocumentProps={model:PrismProfilePrintModel;options?:PrismProfilePrintOptions;textPolicy?:PrismPrintTextPolicy;careerPages?:readonly (readonly PrismPrintCareerItem[])[]};
export function PrismProfilePrintDocument({model:original,options={},textPolicy="full",careerPages}:PrismProfilePrintDocumentProps) {
    if(!original.id.trim()||!original.candidate.name.trim())throw new Error("A print profile requires its identity and candidate name.");
    const {model,shortened}=preparePrismPrintProfile(original,textPolicy),candidate=model.candidate;
    const withSummary=options.summary!==false,withCompensation=options.compensation!==false;
    const pages=careerPages??paginatePrismPrintCareers(model.career??[],model.basicInfo??[],{firstPageExtraPt:withSummary?summaryReserve(model):0,lastPageReservePt:withCompensation?87+Math.max(model.compensation?.rows.length??0,3)*34:0});
    const career=pages.length?pages:[[]];
    const records=career.flat();
    if(new Set(records.map(item=>item.id)).size!==records.length||records.some(item=>!item.id))throw new Error("Printed career record IDs must be unique.");
    if(careerPages&&model.career&&(records.length!==model.career.length||records.some((item,index)=>item.id!==model.career![index].id)))throw new Error("Provided career pages must preserve every supplied record in order.");
    const topics=[...new Set([...(model.success?.topics??[]),...(model.success?.essays.map(item=>item.topic)??[])])];
    const pageProps={name:candidate.name,jobTitle:candidate.position,company:candidate.company?{brand:candidate.brand??"",affiliate:candidate.company}:undefined,companyLogo:model.companyLogo};
    const compensation=withCompensation?<PrismCompensationGrid years={model.compensation?.years??[]} rows={model.compensation?.rows??[]} unit={model.compensation?.unit}/>:null;
    const frame=(id:Exclude<PrismPrintSectionId,"total">,content:ReactNode)=><section key={id} data-print-section={id} aria-label={prismPrintSections.find(section=>section.id===id)!.label}><PrismPrintPage {...pageProps} repeatHeader tabBar={<PrismPrintTabBar active={id}/>}><div className="prism-profile-print-content">{content}</div></PrismPrintPage></section>;
    return <article className="prism-profile-print-document candidate-profile-print" data-profile-id={model.id} data-pagination={careerPages?"host-provided":"estimated"} data-text-policy={textPolicy} aria-label={`${candidate.name} 프로필 인쇄 문서`}>
        <section data-print-section="total" aria-label="종합">{career.map((items,index)=><PrismPrintPage key={index} {...pageProps} repeatHeader={index>0} tabBar={index>0?<PrismPrintTabBar active="total"/>:undefined}>
            {index===0&&<><PrismFavoriteProfile candidate={candidate}/><PrismPrintTabBar active="total"/>{shortened.length>0&&<p className="prism-profile-print-shortened" role="note">일부 설명은 분량에 맞춰 줄여 표시했습니다.</p>}{withSummary&&<PrismPrintLeaderSummary {...model.leader}/>}<section><h3>기본 정보</h3>{model.basicInfo?.length?<PrismBasicInfo items={model.basicInfo.map(item=>({label:item.label,value:item.value===null?"관련 데이터 없음":typeof item.value==="string"?item.value:<div className="prism-profile-print-info-values">{item.value.map((value,i)=><span key={i}>{value}</span>)}</div>}))}/>:<PrismNoData/>}</section></>}
            {items.length>0&&<PrismPrintCareer items={items} showTitle={index===0} continuation={index>0}/>}{index===career.length-1&&compensation}
        </PrismPrintPage>)}</section>
        {frame("expertise",<><Summary data={model.expertise?.summary}/><PrismExpertiseCards items={model.expertise?.fields??[]}/><Survey items={model.expertise?.survey??[]}/></>)}
        {frame("success",<><Summary data={model.success?.summary}/>{topics.length?topics.map((topic,index)=><PrismPrintExperience key={topic} topics={topics} activeTopic={topic} items={model.success?.essays??[]} showTitle={index===0}/>):<PrismPrintExperience topics={[]} activeTopic="" items={[]}/>}<section className="prism-profile-print-failures"><h3>좌절・실패 경험 Essay</h3>{model.success?.failures.some(item=>item.title?.trim()||item.description?.trim())?model.success.failures.filter(item=>item.title?.trim()||item.description?.trim()).map(item=><PrismOutline key={item.id}><strong>{item.title?.trim()?item.title:"해당 내용 미작성"}</strong><p>{item.description?.trim()?item.description:"해당 내용 미작성"}</p></PrismOutline>):<PrismOutline><PrismNoData/></PrismOutline>}</section></>)}
        {frame("design",<><Grade data={model.design}/><PrismPrintScoreEssays title="Design 역량 Essay" items={model.design?.essays??[]}/><Survey items={model.design?.survey??[]}/>{model.design?.diversity?<PrismDesignDiversity {...model.design.diversity}/>:<PrismOutline title="다양성 Matrix"><PrismNoData/></PrismOutline>}</>)}
        {frame("agility",<><Grade data={model.agility}/><PrismPrintScoreEssays title="Learning Agility Essay" items={model.agility?.essays??[]}/><Survey items={model.agility?.survey??[]}/><PrismExperienceEvidence title="경험" items={model.agility?.experiences??[]}/></>)}
        {frame("attitude",<><Summary data={model.attitude?.summary}/>{model.attitude?.diagnosis?<PrismDiagnosis {...model.attitude.diagnosis}/>:<PrismOutline title="성격가치관 진단"><PrismNoData/></PrismOutline>}<PrismPrintRisk items={model.attitude?.risk??[]}/><Survey items={model.attitude?.survey??[]}/></>)}
        {frame("leadership",<>{model.leadership?.summary?<PrismLeadershipPieSummary {...model.leadership.summary} print animate={false}/>:<PrismOutline title="SUMMARY"><PrismNoData/></PrismOutline>}<Survey items={model.leadership?.survey??[]}/><PrismLeadershipReasons title="함께 일하고 싶은 이유" items={model.leadership?.strengths??[]} comment={model.leadership?.strengthsComment}/><PrismLeadershipReasons title="보완·개선 필요사항" items={model.leadership?.improvements??[]} comment={model.leadership?.improvementsComment} danger/>{model.leadership?.trend?<PrismLeadershipTrend {...model.leadership.trend}/>:<PrismOutline title="과거 5개년 리더십 Survey 추이"><PrismNoData/></PrismOutline>}</>)}
    </article>;
}
export function PrismProfilePrintDocuments({documents,options,textPolicy}:{documents:readonly PrismProfilePrintModel[];options?:PrismProfilePrintOptions;textPolicy?:PrismPrintTextPolicy}) {
    if(new Set(documents.map(item=>item.id)).size!==documents.length)throw new Error("Printed profile IDs must be unique.");
    return <div className="prism-profile-print-documents">{documents.length?documents.map(model=><PrismProfilePrintDocument key={model.id} model={model} options={options} textPolicy={textPolicy}/>):<PrismNoData message="출력할 프로필이 없습니다."/>}</div>;
}
/** One immutable display model, rendered at physical paper size; its temporary DOM is always removed. */
export async function renderPrismProfilePdf(model: PrismProfilePrintModel, { options, textPolicy, ...pdfOptions }: {
    options?: PrismProfilePrintOptions; textPolicy?: PrismPrintTextPolicy; title?: string; signal?: AbortSignal;
    scale?: number; capture?: PrismPrintPdfCapture; onProgress?: (progress: PrismPdfExportProgress) => void;
} = {}): Promise<PrismPrintPdfResult> {
    const signal = pdfOptions.signal ?? new AbortController().signal; signal.throwIfAborted();
    const stage = document.createElement("div"); stage.dataset.prism = "light"; stage.dataset.prismPdfCapture = ""; stage.setAttribute("aria-hidden", "true");
    stage.style.cssText = "position:fixed;left:-10000px;top:0;width:190mm;pointer-events:none;background:#fff";
    document.body.append(stage);
    let resolveReady!: () => void, rejectReady!: (error: unknown) => void;
    const ready = new Promise<void>((resolve, reject) => { resolveReady = resolve; rejectReady = reject; });
    const abort = () => rejectReady(signal.reason); signal.addEventListener("abort", abort, { once: true });
    const root = createRoot(stage, { onUncaughtError: rejectReady });
    function CaptureDocument() { useLayoutEffect(() => resolveReady(), []); return <PrismProfilePrintDocument model={model} options={options} textPolicy={textPolicy}/>; }
    try {
        root.render(<CaptureDocument/>); await ready; signal.throwIfAborted();
        return await createPrismPrintPdf(stage, { title: model.candidate.name, ...pdfOptions, signal });
    } finally { signal.removeEventListener("abort", abort); root.unmount(); stage.remove(); }
}
export function PrismProfilePrintViewport({children,scale="auto",resize,className="",style}:{children:ReactNode;scale?:"auto"|number;resize?:"horizontal"|"both";className?:string;style?:CSSProperties}) {
    const root=useRef<HTMLDivElement>(null),[width,setWidth]=useState<number|null>(null);
    if(scale!=="auto"&&(!Number.isFinite(scale)||scale<.2||scale>2))throw new RangeError("Print preview scale must be auto or .2..2.");
    useLayoutEffect(()=>{const node=root.current;if(!node)return;const measure=()=>setWidth(node.clientWidth);measure();const observer=new ResizeObserver(measure);observer.observe(node);return()=>observer.disconnect();},[]);
    const zoom=scale==="auto"?(width===null?1:Math.min(1,Math.max(.05,width/(190*96/25.4)))):scale;
    return <div ref={root} className={`prism-profile-print-viewport ${className}`} style={style} data-resize={resize} data-preview-scale={zoom}><div className="prism-profile-print-paper" style={{zoom}}>{children}</div></div>;
}
