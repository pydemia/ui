import type { ReactNode } from "react";
import { PrismAffiliateLogo } from "./prism-primitives";
import { PrismNoData, type PrismRiskItem } from "./prism-assessment";
import { PrismOutline } from "./prism-profile";
import { PrismChip } from "./prism-badge";

export function PrismPrintPage({name,company,jobTitle,tabBar,repeatHeader=false,children}: {name:string;company?:{brand:string;affiliate:string};jobTitle?:string;tabBar?:ReactNode;repeatHeader?:boolean;children:ReactNode}) {
    const header=<><header className="prism-print-page-header"><small>Profile</small><div>{company && <PrismAffiliateLogo {...company} size={10}/>}<span>{jobTitle}</span><strong>{name}</strong></div></header>{tabBar}</>;
    return <section className="prism-print-page" data-print-page data-repeat-header={repeatHeader||undefined}>{repeatHeader ? <table className="prism-print-repeat"><thead><tr><td>{header}</td></tr></thead><tbody><tr><td>{children}</td></tr></tbody></table> : <>{header}<div className="prism-print-page-body">{children}</div></>}</section>;
}
export function PrismPrintLeaderSummary({name,summary,definition}: {name?:string|null;summary?:string|null;definition?:string|null}) {
    return <div className="prism-print-summary"><h3>SUMMARY</h3>{summary ? <div><span className="prism-print-leader-badge">{name}</span><section><p>{summary}</p>{definition && <small>※ {name ? `${name} : ` : ""}{definition}</small>}</section></div> : <PrismOutline title="SUMMARY"><PrismNoData/></PrismOutline>}</div>;
}
export function PrismPrintCareer({items,showTitle=true,continuation=false}: {items:readonly {id:string;period:string;company:string;role:string}[];showTitle?:boolean;continuation?:boolean}) {
    return <div className="prism-print-career" data-continuation={continuation||undefined}>{showTitle && <h3>경력</h3>}{items.length ? <ol>{items.map(item=><li key={item.id}><span>{item.period}</span><strong>{item.company}</strong>{item.role && <><i aria-hidden="true"/><span>{item.role}</span></>}</li>)}</ol> : <PrismNoData/>}</div>;
}
export function PrismPrintRisk({items}: {items:readonly PrismRiskItem[]}) {
    const merged={latent:items.length>0&&items.every(i=>i.latent===null),manifest:items.length>0&&items.every(i=>i.manifest===null)};
    return <div className="prism-print-risk"><h3>Derailment Risk</h3><table><thead><tr><th scope="col">항목</th><th scope="col">잠재 Risk<br/>성격가치검사</th><th scope="col">발현 Risk<br/>6Frame Survey 결과</th></tr></thead><tbody>{items.length ? items.map((item,index)=><tr key={item.id}><th scope="row">{item.label}</th>{(["latent","manifest"] as const).map(key=>merged[key] ? index===0&&<td key={key} rowSpan={items.length}>관련 데이터 없음</td> : <td key={key}>{item[key]===null ? "관련 데이터 없음" : item[key] ? "✓" : "-"}</td>)}</tr>) : <tr><td colSpan={3}>관련 데이터 없음</td></tr>}</tbody></table></div>;
}
export type PrismPrintExperienceItem={id:string;topic:string;representative?:boolean;title:string|null;description:string|null;keywords:readonly string[];interview?:string|null};
export function PrismPrintExperience({topics,activeTopic,items}: {topics:readonly string[];activeTopic:string;items:readonly PrismPrintExperienceItem[]}) {
    const visible=[...items].filter(i=>i.topic===activeTopic&&(i.title?.trim()||i.description?.trim())).sort((a,b)=>Number(!!b.representative)-Number(!!a.representative));
    return <div className="prism-print-experience"><h3>성공경험 Essay</h3><div className="prism-print-topics">{topics.map(topic=><span key={topic} data-active={topic===activeTopic||undefined}>{topic}{items.some(i=>i.topic===topic&&i.representative)&&" ★"}</span>)}</div>{visible.length ? visible.map(item=><PrismOutline key={item.id} title={item.title??"해당 내용 미작성"} actions={item.representative&&<PrismChip color="#FA7C39">대표</PrismChip>}><p>{item.description??"해당 내용 미작성"}</p><div>{item.keywords.map(keyword=><PrismChip key={keyword} color="#363636">{keyword}</PrismChip>)}</div>{item.representative&&item.interview&&<aside><strong>AI 인터뷰 분석</strong><p>{item.interview}</p></aside>}</PrismOutline>) : <PrismNoData/>}</div>;
}
