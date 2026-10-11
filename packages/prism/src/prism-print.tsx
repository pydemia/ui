import type { ReactNode } from "react";
import { PrismAffiliateLogo } from "./prism-primitives";
import { PrismNoData, type PrismRiskItem } from "./prism-assessment";
import { PrismOutline } from "./prism-profile";
import { PrismChip } from "./prism-badge";

export function PrismPrintPage({name,company,companyLogo,jobTitle,tabBar,repeatHeader=false,children}: {name:string;company?:{brand:string;affiliate:string};companyLogo?:ReactNode;jobTitle?:string;tabBar?:ReactNode;repeatHeader?:boolean;children:ReactNode}) {
    const header=<><header className="prism-print-page-header"><small>Profile</small><div>{companyLogo ?? (company && <PrismAffiliateLogo {...company} size={10}/>)}{jobTitle && <span>{jobTitle}</span>}<strong>{name}</strong></div></header>{tabBar}</>;
    return <section className="prism-print-page" data-print-page data-repeat-header={repeatHeader||undefined}>{repeatHeader ? <table className="prism-print-repeat"><thead><tr><td>{header}</td></tr></thead><tbody><tr><td>{children}</td></tr></tbody></table> : <>{header}<div className="prism-print-page-body">{children}</div></>}</section>;
}
export function PrismPrintLeaderSummary({name,summary,definition}: {name?:string|null;summary?:string|null;definition?:string|null}) {
    const label=name??"",index=Math.max(label.lastIndexOf("리더"),label.toLowerCase().lastIndexOf("leader")),note=definition?.trim();
    return <div className="prism-print-summary"><h3>SUMMARY</h3>{summary?.trim() ? <div><div className="prism-print-leader-badge-wrap"><span className="prism-print-leader-badge">{index>0 ? <>{label.slice(0,index).trimEnd()}<br/>{label.slice(index)}</> : label}</span></div><section><p>{summary}</p>{note && <small>※ {name?.trim() ? `${name.trim()} : ` : ""}{note}<br/>(리더 유형 단계 : Excellent &gt; Good &gt; Solid &gt; Developing &gt; Struggling)</small>}</section></div> : <PrismOutline><PrismNoData/></PrismOutline>}</div>;
}
export type PrismPrintCareerItem={id:string;period:string;company:string;role:string|readonly string[]};
export function PrismPrintCareer({items,showTitle=true,continuation=false}: {items:readonly PrismPrintCareerItem[];showTitle?:boolean;continuation?:boolean}) {
    return <div className="prism-print-career" data-continuation={continuation||undefined}>{showTitle && <h3>경력</h3>}{items.length ? <ol>{items.map(item=>{const role=typeof item.role==="string"?item.role:item.role.join(", ");return <li key={item.id} data-career-id={item.id}><span>{item.period}</span><strong>{item.company}</strong>{role && <><i aria-hidden="true"/><span>{role}</span></>}</li>;})}</ol> : <PrismNoData/>}</div>;
}
export function PrismPrintRisk({items}: {items:readonly PrismRiskItem[]}) {
    const merged={latent:items.length>0&&items.every(i=>i.latent===null),manifest:items.length>0&&items.every(i=>i.manifest===null)};
    return <div className="prism-print-risk"><h3>Derailment Risk</h3><table><thead><tr><th scope="col">항목</th><th scope="col">잠재 Risk<br/>성격가치검사</th><th scope="col">발현 Risk<br/>6Frame Survey 결과</th></tr></thead><tbody>{items.length ? items.map((item,index)=><tr key={item.id}><th scope="row">{item.label}</th>{(["latent","manifest"] as const).map(key=>merged[key] ? index===0&&<td key={key} rowSpan={items.length}>관련 데이터 없음</td> : <td key={key}>{item[key]===null ? "관련 데이터 없음" : item[key] ? "✓" : "-"}</td>)}</tr>) : <tr><td colSpan={3}>관련 데이터 없음</td></tr>}</tbody></table></div>;
}
export type PrismPrintExperienceItem={id:string;topic:string;representative?:boolean;title:string|null;description:string|null;keywords:readonly string[];interview?:string|null};
export function PrismPrintExperience({topics,activeTopic,items,showTitle=true}: {topics:readonly string[];activeTopic:string;items:readonly PrismPrintExperienceItem[];showTitle?:boolean}) {
    const visible=[...items].filter(i=>i.topic===activeTopic&&(i.title?.trim()||i.description?.trim())).sort((a,b)=>Number(!!b.representative)-Number(!!a.representative));
    return <div className="prism-print-experience" data-topic={activeTopic}>{showTitle&&<h3>성공경험 Essay</h3>}{topics.length>0&&<div className="prism-print-topics">{topics.map(topic=><span key={topic} data-active={topic===activeTopic||undefined}>{topic}{items.some(i=>i.topic===topic&&i.representative)&&<span className="prism-print-topic-star" aria-label="대표 성공경험">★</span>}</span>)}</div>}{visible.length ? visible.map(item=><PrismOutline key={item.id}><div className="prism-print-experience-body"><strong>{item.representative&&<PrismChip color="#FA7C39">대표</PrismChip>}{item.title?.trim()?item.title:"해당 내용 미작성"}</strong><p>{item.description?.trim()?item.description:"해당 내용 미작성"}</p></div>{item.keywords.length>0&&<div className="prism-print-experience-tags">{item.keywords.map((keyword,index)=><PrismChip key={index} color="#363636">{keyword}</PrismChip>)}</div>}{item.representative&&item.interview?.trim()&&<aside><strong>AI 인터뷰 분석</strong><p>{item.interview}</p></aside>}</PrismOutline>) : <PrismOutline><PrismNoData/></PrismOutline>}</div>;
}
