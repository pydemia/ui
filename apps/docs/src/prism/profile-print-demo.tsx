import { useState } from "react";
import { PrismProfilePrintDocument, PrismProfilePrintViewport, type PrismProfilePrintModel, type PrismPrintTextPolicy } from "@pydemia/prism";
import type { FixtureState } from "./catalog";
export function createPrintFixture(long=false,empty=false):PrismProfilePrintModel {
    const candidate={id:"synthetic",name:"김가상",company:"가상전자",position:"기술전략담당",executiveYears:0,birthDate:"1990.01.01"};
    if(empty)return {id:"synthetic-empty",candidate};
    const description=long?"매우 긴 합성 설명과 검증되지 않은 가상 근거입니다. ".repeat(60):"합성 표시 예시이며 실제 평가가 아닙니다.";
    const survey=[{id:"survey",category:"가상 Survey",bars:[{role:"boss" as const,value:0,average:6.1},{role:"peer" as const,value:null,average:null},{role:"member" as const,value:7.5,average:6.3}]}];
    return {id:"synthetic",candidate,leader:{name:"Good 리더",summary:description,definition:"합성 유형 정의"},basicInfo:[{label:"최종 학위",value:["합성 학위 A","합성 학위 B"]},{label:"추가 정보",value:null}],
        career:Array.from({length:long?48:3},(_,index)=>({id:`career-${index}`,period:`합성 기간 ${index+1}`,company:"가상전자",role:[`가상 역할 ${index+1}`,"합성 업무"]})),
        compensation:{years:["2026","2025"],rows:[{label:"현금",values:[0,null]},{label:"기타",values:[{won:0,foreign:{currency:"USD",amount:0}},null]}]},
        expertise:{summary:{title:"합성 전문성",description},fields:[{id:"field",field:"합성 분야",years:"3년",title:"합성 업적",description}],survey},
        success:{summary:{title:"합성 성공경험",description},topics:["합성 경험 A","합성 경험 B"],essays:[{id:"essay-a",topic:"합성 경험 A",representative:true,title:"합성 대표 경험",description,keywords:["합성","예시"],interview:"합성 인터뷰 근거"},{id:"essay-b",topic:"합성 경험 B",title:"합성 다른 경험",description:"합성 경험 B의 내용",keywords:[]}],failures:[{id:"failure",title:"합성 실패 경험",description}]},
        design:{grade:"상",description,essays:[{id:"zero",name:"실제0 합성 예시",score:0,max:10,description},{id:"missing",name:"근거 없음",score:null,max:null,description:null}],survey,diversity:{summary:[{label:"회사",values:["가상전자"]},{label:"Function",values:["합성 기능"]}],columns:[],rows:[],position:{rowAxisLabel:"회사",columns:[{id:"f1",label:"Function 1"},{id:"f2",label:"Function 2"},{id:"f3",label:"Function 3"}],rows:[{id:"c3",label:"3+"},{id:"c2",label:"2"},{id:"c1",label:"1"}],current:{row:"c1",column:"f1"}}}},
        agility:{grade:"중",description,essays:[],survey,experiences:[{id:"global",label:"Globality",hasExperience:null},{id:"ax",label:"AX 혁신",hasExperience:true,description:"합성 경험"}]},
        attitude:{summary:{title:"합성 Attitude",description},diagnosis:{title:"성격가치관 진단",axes:["합성 축1","합성 축2","합성 축3","합성 축4","합성 축5"],values:[0,2,null,8,10],description,shares:[{label:"합성 가치 A",percent:0},{label:"합성 가치 B",percent:30},{label:"합성 가치 C",percent:70}],valueDescription:description},risk:[{id:"risk",label:"합성 Risk",latent:null,manifest:false}],survey},
        leadership:{summary:{items:[{label:"지",value:33},{label:"덕",value:32},{label:"용",value:35}],title:"합성 리더십",description},survey,strengths:[{id:"boss",role:"상사",text:"합성 강점"}],improvements:[{id:"peer",role:"동료",text:null}],trend:{chart:{title:"합성 추이",labels:["2025","2026"],series:[{id:"score",label:"합성 점수",values:[0,null]}]},rows:[{year:"2026",evaluators:0,respondents:0,score:null,groupAverage:null,percentile:null}]}}
    };
}
export function ProfilePrintDemo({state}:{state:FixtureState}) {
    const [summary,setSummary]=useState(true),[compensation,setCompensation]=useState(true),[policy,setPolicy]=useState<PrismPrintTextPolicy>("full"),[auto,setAuto]=useState(true),[scale,setScale]=useState(100);
    return <div className="prism-demo-stack"><div data-prism-export-exclude className="prism-demo-row"><label><input type="checkbox" checked={summary} onChange={event=>setSummary(event.target.checked)}/>종합 SUMMARY</label><label><input type="checkbox" checked={compensation} onChange={event=>setCompensation(event.target.checked)}/>보상 정보</label><label>설명 분량 <select value={policy} onChange={event=>setPolicy(event.target.value as PrismPrintTextPolicy)}><option value="full">원문 전체</option><option value="reference-limits">원본 표시 제한</option></select></label><label><input type="checkbox" checked={auto} onChange={event=>setAuto(event.target.checked)}/>너비 맞춤</label><label>미리보기 배율 <input type="number" min={20} max={200} value={scale} disabled={auto} onChange={event=>setScale(Math.max(20,Math.min(200,Number(event.target.value)||20)))}/>%</label></div>
        <PrismProfilePrintViewport scale={auto?"auto":scale/100} resize="both" style={{height:800}}><PrismProfilePrintDocument model={createPrintFixture(state==="long",state==="empty")} options={{summary,compensation}} textPolicy={policy}/></PrismProfilePrintViewport>
    </div>;
}
