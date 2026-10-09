import { useEffect, useRef, useState } from "react";
import { PrismAttitudeReport, PrismSurveyValidation, loadPrismPdfBytes, type PrismSurveyItem } from "@pydemia/prism";
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";
import type { FixtureState } from "./catalog";
const items: PrismSurveyItem[] = [
    { id:"trust",category:"신뢰",bars:[{role:"boss",value:0,average:6.1},{role:"peer",value:7.2,average:6.3},{role:"member",value:null,average:null}] },
    { id:"respect",category:"존중",bars:[{role:"boss",value:8.1,average:7.45},{role:"peer",value:7.7,average:null},{role:"member",value:9.2,average:8.2}] },
    { id:"courage",category:"도전",bars:[{role:"boss",value:null},{role:"peer",value:null},{role:"member",value:null}] },
];
export function SurveyDemo({state}:{state:FixtureState}) {
    const [width,setWidth]=useState(800),[height,setHeight]=useState(100),[columns,setColumns]=useState<2|3>(3),[printStyle,setPrintStyle]=useState(false);
    return <div className="prism-demo-stack"><div className="prism-demo-row"><label>Survey 너비 <input type="number" aria-label="Survey 너비" min={140} max={1280} value={width} onChange={event=>setWidth(Math.max(140,Math.min(1280,Number(event.target.value)||140)))}/></label>
        <label>막대 높이 <input type="number" aria-label="막대 높이" min={20} max={320} value={height} onChange={event=>setHeight(Math.max(20,Math.min(320,Number(event.target.value)||20)))}/></label>
        <label>표시 열 <select aria-label="표시 열" value={columns} onChange={event=>setColumns(Number(event.target.value) as 2|3)}><option value={2}>2</option><option value={3}>3</option></select></label>
        <label><input type="checkbox" checked={printStyle} onChange={event=>{setPrintStyle(event.target.checked);if(event.target.checked)setHeight(70);}}/> 인쇄 스타일</label></div>
        <div className={printStyle?"candidate-profile-print":undefined} style={{width:"100%",maxWidth:width}}><PrismSurveyValidation items={state==="empty"?[]:state==="long"?items.map(item=>({...item,category:item.category+" 가상 진단 분야의 긴 제목 ".repeat(8)})):items} columns={columns} barMaxHeight={height}/></div></div>;
}
export function AttitudeReportDemo({state}:{state:FixtureState}) {
    const [width,setWidth]=useState(800),[dialogWidth,setDialogWidth]=useState(1200),[dialogHeight,setDialogHeight]=useState(700),[sized,setSized]=useState(false),[pause,setPause]=useState(false),[failure,setFailure]=useState(state==="error"),[subject,setSubject]=useState("synthetic-a");
    const failures=useRef(failure);failures.current=failure;
    const switchTimer=useRef<number|undefined>(undefined);useEffect(()=>()=>window.clearTimeout(switchTimer.current),[]);
    const [result,setResult]=useState(""),[file,setFile]=useState<{name:string;href:string}>();
    return <div className="prism-demo-stack"><div className="prism-demo-row"><label>진단 너비 <input type="number" aria-label="진단 너비" min={140} max={1280} value={width} onChange={event=>setWidth(Math.max(140,Math.min(1280,Number(event.target.value)||140)))}/></label>
        <label><input type="checkbox" checked={sized} onChange={event=>setSized(event.target.checked)}/> 보고서 크기 지정</label>
        <label>보고서 너비 <input type="number" aria-label="보고서 너비" min={140} max={1280} value={dialogWidth} onChange={event=>setDialogWidth(Math.max(140,Math.min(1280,Number(event.target.value)||140)))}/></label>
        <label>보고서 높이 <input type="number" aria-label="보고서 높이" min={240} max={1000} value={dialogHeight} onChange={event=>setDialogHeight(Math.max(240,Math.min(1000,Number(event.target.value)||240)))}/></label>
        <label><input type="checkbox" checked={pause} onChange={event=>setPause(event.target.checked)}/> 문서 요청 5초 대기</label>
        <label><input type="checkbox" checked={failure} onChange={event=>setFailure(event.target.checked)}/> 첫 요청에 PDF 대신 HTML 응답</label>
        <button type="button" onClick={()=>setSubject(value=>value==="synthetic-a"?"synthetic-b":"synthetic-a")}>다른 가상 후보</button>
        <button type="button" onClick={()=>{window.clearTimeout(switchTimer.current);switchTimer.current=window.setTimeout(()=>setSubject(value=>value==="synthetic-a"?"synthetic-b":"synthetic-a"),3000);}}>3초 후 다른 가상 후보</button></div>
        <div style={{width:"100%",maxWidth:width}}><PrismAttitudeReport subjectId={subject} summary={{heading:state==="empty"?null:"가상 Attitude 요약",description:state==="empty"?null:"제공한 가상 근거의 표시 예시입니다."}}
            diagnosis={{title:"성격·가치관 진단 결과",axes:["개방성","성실성","외향성","우호성","정서 안정"],values:state==="empty"?[]:[8,7,5,6,8],heading:state==="empty"?undefined:"가상 성격 해석",description:state==="long"?"가상 진단의 긴 해석을 표시합니다. ".repeat(15):state==="empty"?undefined:"소비자가 제공한 가상 성격 해석입니다.",shares:state==="empty"?[]:[{label:"자기초월",percent:30},{label:"안정",percent:0},{label:"개방",percent:40},{label:"자기증진",percent:30}],valueDescription:state==="empty"?undefined:"가상 가치관 비중의 설명입니다."}}
            risk={{items:[{id:"one",label:"가상 Risk 항목",latent:state==="empty"?null:false,manifest:null}]}} survey={{items:state==="empty"?[]:items,columns:3}}
            report={state==="empty"?undefined:{url:"/prism/fixtures/report.pdf",workerUrl,title:"가상 심리적강인함 결과",filename:"가상 심리적강인함 결과.pdf",width:sized?dialogWidth:undefined,height:sized?dialogHeight:undefined,
                loadPdf:async(url,{signal})=>{if(pause)await new Promise<void>((resolve,reject)=>{const done=()=>{signal.removeEventListener("abort",abort);resolve();};const timer=window.setTimeout(done,5000);const abort=()=>{window.clearTimeout(timer);reject(signal.reason);};signal.addEventListener("abort",abort,{once:true});if(signal.aborted)abort();});signal.throwIfAborted();const requested=failures.current?"/prism/fixtures/not-a-pdf.html":url;if(failures.current){failures.current=false;setFailure(false);}return loadPrismPdfBytes([requested],{signal});},
                onDownload:async context=>{if(!context.data){setResult("원본 파일 다운로드 의도");return;}const reader=new FileReader();await new Promise<void>((resolve,reject)=>{reader.onload=()=>{setFile({name:context.filename,href:String(reader.result)});setResult("가상 PDF 다운로드 바이트 준비 완료");resolve();};reader.onerror=()=>reject(reader.error);reader.readAsDataURL(new Blob([context.data!.buffer as ArrayBuffer],{type:"application/pdf"}));});}}}/></div>
        <p role="status">{result}</p>{file&&<a href={file.href} download={file.name}>완료된 파일: {file.name}</a>}
    </div>;
}
