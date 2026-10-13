import { useState } from "react";
import { PrismAnalysis, PrismFormattedText, PrismPositionRecommendations, type PrismAnalysisFactor, type PrismPositionRecommendationItem } from "@pydemia/prism";
import type { FixtureState } from "./catalog";
const kinds = ["expertise","success","design","agility","attitude","leadership","other"] as const;
const labels = ["전문성","성공경험","Design","Learning Agility","Attitude","Leadership","추가 항목"];
export function AnalysisDemo({ state }: {state:FixtureState}) {
    const [width,setWidth] = useState(800),[ai,setAi] = useState(true),[action,setAction] = useState("");
    const long = state === "long";
    const factors: PrismAnalysisFactor[] = state === "empty" ? [] : kinds.map((kind,index) => ({id:kind,kind,label:labels[index],title:"가상 근거 제목",results:index === 5 ? [long ? "가상 리더십 강점의 긴 표시 값 ".repeat(12) : "가상 리더십 강점 A", "가상 리더십 강점 B"] : ["합성 결과 A","합성 결과 B"],starred:["합성 결과 A"],summary:long ? "매우 긴 합성 자료의 설명과 근거를 원문대로 표시합니다. ".repeat(12) : index===1 ? "<bullet depth=1>합성 근거</bullet> [후보 확인](profile://synthetic)" : index===6 ? "   " : "합성 데이터이며 실제 평가가 아닙니다."}));
    return <div className="prism-demo-stack"><label>분석 폭 <input aria-label="분석 폭" type="number" min={140} max={1280} value={width} onChange={event=>setWidth(Math.max(140,Math.min(1280,Number(event.target.value)||140)))}/></label>
        <label><input type="checkbox" checked={ai} onChange={event=>setAi(event.target.checked)}/>AI comment 사용</label>
        <PrismAnalysis style={{width,maxWidth:"100%"}} leader={state === "empty" ? null : {label:"Good 리더",description:"합성 리더 유형 설명입니다.",aiComment:ai ? "AI 합성 요약문입니다." : null}} factors={factors} onAction={(kind,id)=>setAction(`${kind}: ${id}`)}/><p role="status">{action}</p></div>;
}
export function RecommendationsDemo({ state }: {state:FixtureState}) {
    const [width,setWidth] = useState(800),[count,setCount] = useState(9),[selected,setSelected] = useState(""),[dataset,setDataset] = useState(0);
    const items: PrismPositionRecommendationItem[] = state === "empty" ? [] : Array.from({length:count},(_,index)=>({id:`${dataset}-${index}`,company:"가상전자",title:state === "long" ? `긴 조직 이름을 포함한 가상 기술 전략 및 연구 개발 담당 ${index+1}` : `가상 포지션 ${index+1}`,reasons:state === "long" ? ["매우 긴 합성 추천 근거를 보존하고 세 줄로 표시합니다. ".repeat(10)] : ["합성 전문성 근거","합성 경험 근거"]}));
    return <div className="prism-demo-stack"><div className="prism-demo-row"><label>추천 폭 <input aria-label="추천 폭" type="number" min={140} max={1280} value={width} onChange={event=>setWidth(Math.max(140,Math.min(1280,Number(event.target.value)||140)))}/></label><label>포지션 수 <input aria-label="포지션 수" type="number" min={0} max={20} value={count} onChange={event=>setCount(Math.max(0,Math.min(20,Number(event.target.value)||0)))}/></label><button type="button" onClick={()=>{setDataset(value=>value+1);setSelected("");}}>데이터 전환</button></div>
        <PrismPositionRecommendations items={items} selectedId={selected} onSelect={state === "readonly" ? undefined : item=>setSelected(item.id)} resize="both" style={{width,maxWidth:"100%"}}/><p role="status">{selected ? `선택: ${selected}` : "선택 없음"}</p></div>;
}
export function FormattedTextDemo({state}: {state:FixtureState}) {
    const [panel,setPanel]=useState(false),[action,setAction]=useState("");
    const source=state==="empty" ? "" : state==="long" ? "**합성 근거**와 긴 문장을 줄바꿈해 표시합니다. ".repeat(50) : "<color-blue>합성 근거</color>와 [후보 확인](profile://synthetic), [포지션 확인](position://synthetic-position)\n\n<bullet depth=1>**합성 설명**입니다.</bullet>";
    return <div className="prism-demo-stack"><label><input type="checkbox" checked={panel} onChange={event=>setPanel(event.target.checked)}/>패널 모드</label><PrismFormattedText source={source} panel={panel} onAction={(kind,id)=>setAction(`${kind}: ${id}`)}/><p role="status">{action}</p></div>;
}
