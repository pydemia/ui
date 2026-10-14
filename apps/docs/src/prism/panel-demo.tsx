import { useState } from "react";
import { PrismButton, PrismInput, PrismPanel } from "@pydemia/prism";
import type { FixtureState } from "./catalog";

export function PanelDemo({state}:{state:FixtureState}) {
    const [open,setOpen]=useState(state!=="closed");
    const [expanded,setExpanded]=useState(state==="expanded");
    const [width,setWidth]=useState(440);
    const [exampleWidth,setExampleWidth]=useState(1000);
    const [exampleHeight,setExampleHeight]=useState(440);
    const long=state==="long";
    return <div className="prism-demo-stack">
        <div className="prism-sizing-controls">
            <label>예시 너비 <input type="range" min={240} max={1200} step={20} value={exampleWidth} onChange={e=>setExampleWidth(Number(e.target.value))}/><output>{exampleWidth}px</output></label>
            <label>예시 높이 <input type="range" min={240} max={720} step={20} value={exampleHeight} onChange={e=>setExampleHeight(Number(e.target.value))}/><output>{exampleHeight}px</output></label>
        </div>
        <p role="status">패널 선호 너비: {width}px · {open?expanded?"확대":"기본":"닫힘"}</p>
        <div className="prism-panel-demo" style={{width:`min(100%,${exampleWidth}px)`,height:exampleHeight,minHeight:240}}>
            <div className="prism-panel-demo-main"><p>패널이 열려 있어도 대화를 입력할 수 있습니다.</p><PrismInput label="대화 초안" defaultValue=""/><PrismButton onClick={()=>setOpen(true)}>패널 열기</PrismButton></div>
            <PrismPanel title={<h4>{long?"장기 후보자 검토 기록과 전문 분야별 경력 근거를 함께 확인하는 상세 정보 패널":"확대 가능 패널"}</h4>}
                open={open} onOpenChange={setOpen} expanded={expanded} onExpandedChange={setExpanded} resizable width={width} onWidthChange={setWidth}
                contentStyle={long?{padding:20,overflowY:"auto"}:undefined}>
                {long&&<><PrismInput label="패널 초안" defaultValue="검토 중인 가상 메모"/>{Array.from({length:18},(_,i)=><p key={i}>{i+1}. 가상 후보의 검토 기록입니다. 실제 인사 정보나 평가 결과를 포함하지 않습니다. 긴 본문의 내부 스크롤을 확인합니다.</p>)}<PrismButton>본문 마지막 동작</PrismButton></>}
            </PrismPanel>
        </div>
    </div>;
}
