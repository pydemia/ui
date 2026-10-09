import { useEffect, useRef, useState, type ReactNode } from "react";
import { PrismInput, PrismTextarea, PrismSelect } from "./prism-field";
import { PrismMultiSelect, PrismDateRange, PrismRadioGroup } from "./prism-selection";
import { PrismSwitch, PrismFileDropzone } from "./prism-utility";
import { PrismTag, PrismChip } from "./prism-badge";
import { PrismOutline } from "./prism-profile";
import { PrismButton } from "./prism-button";
import { PrismAiGenerateButton } from "./prism-management";
import { PrismContextOptionCard } from "./prism-context";
import type { PrismAttachment } from "./prism-admin";
import { PrismIcon } from "./prism-icon";

export type PrismFormActions = { onSubmit: () => void | Promise<void>; onCancel: () => void; onDelete?: () => void; busy?: boolean; readOnly?: boolean; submitLabel?: string; error?: string; onSubmitError?: (error:unknown)=>void };
function Actions({onSubmit,onCancel,onDelete,busy,readOnly,submitLabel="등록",error,valid,leftAction}:PrismFormActions & {valid:boolean;leftAction?:ReactNode}) {
    return <>{error && <p role="alert" className="prism-error">{error}</p>}<footer className="prism-domain-form-actions"><div><PrismButton variant="line" onClick={onCancel} disabled={busy}>취소</PrismButton>{leftAction}{onDelete && !readOnly && <PrismButton variant="line" onClick={onDelete} disabled={busy}>삭제</PrismButton>}</div>{!readOnly && <PrismButton type="submit" disabled={!valid || busy} aria-busy={busy}>{busy ? "저장 중" : submitLabel}</PrismButton>}</footer></>;
}
function useSubmission(onSubmit:PrismFormActions["onSubmit"],onError:PrismFormActions["onSubmitError"]) {
    const [busy,setBusy]=useState(false),[error,setError]=useState<string>();const mounted=useRef(true),running=useRef(false),callbacks=useRef({onSubmit,onError});callbacks.current={onSubmit,onError};
    useEffect(()=>{mounted.current=true;return()=>{mounted.current=false;};},[]);
    const submit=async()=>{if(running.current)return;running.current=true;setBusy(true);setError(undefined);try{await callbacks.current.onSubmit();}catch(error){if(mounted.current){setError("저장하지 못했습니다. 다시 시도해 주세요.");callbacks.current.onError?.(error);}}finally{running.current=false;if(mounted.current)setBusy(false);}};
    return {busy,error,submit};
}
const statusColor=(status:string)=>status==="활성" ? "#009A93" : "#363636";
const fieldError=(message:string)=><><PrismIcon name="ToastErrorIcon" size={14}/><span>{message}</span></>;
export type PrismNoticeDraft = {title:string;content:string;allCompanies:boolean;companyIds:readonly string[];popup:boolean;start:string|null;end:string|null};
export function PrismNoticeForm({value,onValueChange,companies,files,onFilesSelected,onRemoveFile,canChooseAllCompanies,canEdit=true,...actions}:PrismFormActions & {
    value:PrismNoticeDraft;onValueChange:(value:PrismNoticeDraft)=>void;companies:readonly {value:string;label:string}[]; files:readonly PrismAttachment[];
    onFilesSelected:(files:File[])=>void;onRemoveFile?:(id:string)=>void;canChooseAllCompanies?:boolean;canEdit?:boolean;
}) {
    const locked=actions.readOnly || !canEdit; const valid=!!value.title.trim()&&!!value.content.trim()&&(value.allCompanies || !!value.companyIds.length)&&(!value.popup || (!!value.start&&!!value.end&&value.start<=value.end));
    const update=(next:Partial<PrismNoticeDraft>)=>onValueChange({...value,...next});
    return <form className="prism-domain-form" onSubmit={e=>{e.preventDefault();if(valid&&!locked&&!actions.busy)actions.onSubmit();}}><h3>공지사항 {actions.submitLabel==="수정" ? "상세" : "등록"}</h3>
        <PrismOutline title="공지 내용"><PrismInput label="제목" value={value.title} required readOnly={locked} disabled={actions.busy} onChange={e=>update({title:e.target.value})}/><PrismTextarea label="본문" rows={15} value={value.content} required readOnly={locked} disabled={actions.busy} onChange={e=>update({content:e.target.value})}/><PrismFileDropzone label="첨부파일" files={files} onFilesSelected={onFilesSelected} onRemove={locked ? undefined : onRemoveFile} disabled={locked||actions.busy}/></PrismOutline>
        <PrismOutline title="노출 설정"><p className="prism-help">선택한 회사의 사용자에게 공지사항이 노출됩니다.</p><div className="prism-domain-form-row">{canChooseAllCompanies && <PrismSwitch label="전체 회사" checked={value.allCompanies} disabled={locked||actions.busy} onCheckedChange={allCompanies=>update({allCompanies})}/>}<PrismMultiSelect label="노출 범위" options={companies} value={value.companyIds} onValueChange={companyIds=>update({companyIds})} allToggleClearsSelection disabled={locked||actions.busy||value.allCompanies}/></div>
        <hr/><PrismSwitch label="팝업 노출" checked={value.popup} disabled={locked||actions.busy} onCheckedChange={popup=>update(popup ? {popup} : {popup,start:null,end:null})}/><p className="prism-help">서비스 메인 화면에 팝업으로 표시합니다.</p><PrismDateRange label="게시기간" start={value.start} end={value.end} onValueChange={update} disabled={!value.popup||locked||actions.busy}/></PrismOutline>
        {!canEdit && <p role="status">조회만 가능합니다.</p>}<Actions {...actions} readOnly={locked} valid={valid}/></form>;
}
export type PrismCompanyGroupDraft={name:string;companyIds:readonly string[]};
export type PrismGroupNameValidator=(name:string,context:{signal:AbortSignal})=>Promise<boolean>;
export type PrismCompanyGroupFormProps=PrismFormActions & {
    value:PrismCompanyGroupDraft;onValueChange:(value:PrismCompanyGroupDraft)=>void;companies:readonly {value:string;label:string}[];
    mode?:"create"|"detail";initialValue?:PrismCompanyGroupDraft;validateName?:PrismGroupNameValidator;nameCheckDelayMs?:number;
    nameStatus?:"idle"|"checking"|"available"|"duplicate";onCheckName?:()=>void;
    detail?:{status:string;registrant:string;registrantEmail?:string;createdAt:string;updatedAt:string|null};onToggleStatus?:()=>void;
};
export function PrismCompanyGroupForm({value,onValueChange,companies,nameStatus,onCheckName,detail,onToggleStatus,mode,initialValue,validateName,nameCheckDelayMs=600,...actions}:PrismCompanyGroupFormProps) {
    if(!Number.isFinite(nameCheckDelayMs)||nameCheckDelayMs<0)throw new RangeError("Name check delay must be nonnegative.");
    const firstValue=useRef(initialValue??value),validator=useRef(validateName),check=useRef<AbortController|null>(null);validator.current=validateName;
    const [result,setResult]=useState<{name:string;status:"idle"|"checking"|"available"|"duplicate"|"error"}>({name:"",status:"idle"});
    const [autoChecked,setAutoChecked]=useState("");const submission=useSubmission(actions.onSubmit,actions.onSubmitError);
    const currentName=value.name.trim(),baseline=initialValue??firstValue.current,initialName=baseline.name.trim();
    const detailMode=mode ? mode==="detail" : !!detail,modern=mode!==undefined||!!validateName;
    const busy=!!actions.busy||submission.busy,hasValidator=!!validateName;
    const runCheck=(name:string)=>{check.current?.abort();const controller=new AbortController(),validate=validator.current!;check.current=controller;setResult({name,status:"checking"});
        void Promise.resolve().then(()=>validate(name,{signal:controller.signal})).then(available=>{if(!controller.signal.aborted)setResult({name,status:available?"available":"duplicate"});}).catch(()=>{if(!controller.signal.aborted)setResult({name,status:"error"});});};
    useEffect(()=>{check.current?.abort();if(!hasValidator||!detailMode||!currentName||currentName===initialName||actions.readOnly)return;
        const timer=setTimeout(()=>runCheck(currentName),nameCheckDelayMs);return()=>{clearTimeout(timer);check.current?.abort();};
    },[currentName,initialName,detailMode,hasValidator,nameCheckDelayMs,actions.readOnly]);
    useEffect(()=>()=>check.current?.abort(),[]);
    const status=detailMode&&currentName&&currentName===initialName ? "available" : hasValidator ? (result.name===currentName ? result.status : detailMode&&currentName ? "checking" : "idle") : nameStatus??(modern ? (detailMode&&currentName||currentName&&autoChecked===currentName ? "available" : "idle") : "idle");
    const dirty=currentName!==initialName||value.companyIds.join()!==baseline.companyIds.join();
    const valid=!!currentName&&!!value.companyIds.length&&status!=="duplicate"&&status!=="checking"&&status!=="error"&&(!modern&&!onCheckName||status==="available")&&(!detailMode||!modern||dirty);
    const selectable=companies.filter(company=>!value.companyIds.includes(company.value));
    const selected=modern ? companies.filter(company=>value.companyIds.includes(company.value)).sort((a,b)=>value.companyIds.indexOf(a.value)-value.companyIds.indexOf(b.value)) : value.companyIds.map(id=>({value:id,label:companies.find(company=>company.value===id)?.label??id}));
    const error=status==="duplicate" ? fieldError("이미 등록된 회사 그룹명입니다.") : status==="error" ? fieldError("회사 그룹명을 확인하지 못했습니다. 다시 확인해 주세요.") : undefined;
    const blur=()=>{if(actions.readOnly||busy)return;if(modern&&detailMode)return;if(hasValidator&&currentName)runCheck(currentName);else if(onCheckName)onCheckName();else setAutoChecked(currentName);};
    return <form className={`prism-domain-form prism-company-form ${modern?"prism-company-current":""}`} data-has-detail={!!detail||undefined} aria-busy={busy||undefined} onSubmit={event=>{event.preventDefault();if(valid&&!busy&&!actions.readOnly)void submission.submit();}}>
        {detail&&<PrismOutline><PrismInput label="등록자" value={detail.registrantEmail?`${detail.registrant} (${detail.registrantEmail})`:detail.registrant} readOnly/><div className="prism-domain-form-grid"><PrismInput label="등록일" value={detail.createdAt} readOnly/><PrismInput label="최근 수정일" value={detail.updatedAt??"-"} readOnly/></div></PrismOutline>}
        <PrismOutline><div className="prism-group-name" data-validation={status} data-has-status={!!detail||undefined}><PrismInput label="회사 그룹명" required value={value.name} placeholder="회사 그룹명 입력" disabled={busy} readOnly={actions.readOnly} onChange={event=>onValueChange({...value,name:event.target.value})} onBlur={blur} error={error}/>{detail&&<PrismChip color={statusColor(detail.status)}>{detail.status}</PrismChip>}</div>
            {status==="checking"&&<span className="prism-sr-only" role="status">회사 그룹명을 확인하고 있습니다.</span>}
            {status==="error"&&hasValidator&&<PrismButton variant="line" size="small" disabled={busy||actions.readOnly} onClick={()=>runCheck(currentName)}>다시 확인</PrismButton>}<hr/>
            <div className="prism-company-select-area">
            {modern ? <PrismSelect label="회사 선택" placeholder="회사 선택" requiredIndicator value="" options={[...(selectable.length?[{value:"__all__",label:"전체"}]:[]),...selectable]} disabled={busy} readOnly={actions.readOnly}
                onValueChange={id=>onValueChange({...value,companyIds:id==="__all__"?companies.map(company=>company.value):[...new Set([...value.companyIds,id])]})}/>
                : <PrismMultiSelect label="회사 선택" options={companies} value={value.companyIds} onValueChange={companyIds=>onValueChange({...value,companyIds})} disabled={busy} readOnly={actions.readOnly}/>}
            {selected.length ? <div className="prism-domain-company-box"><span>총 {selected.length}개</span><div>{selected.map(company=><PrismTag key={company.value} label={company.label} onRemove={actions.readOnly||busy?undefined:()=>onValueChange({...value,companyIds:value.companyIds.filter(id=>id!==company.value)})}>{company.label}</PrismTag>)}</div></div> : <div className="prism-domain-role-notice">회사 그룹에 포함할 회사를 선택해 주세요.</div>}</div>
        </PrismOutline><Actions {...actions} onSubmit={submission.submit} busy={busy} error={actions.error??submission.error} submitLabel={actions.submitLabel??(detailMode?"수정":"등록")} valid={valid}
            leftAction={onToggleStatus&&<PrismButton variant="line" disabled={busy||actions.readOnly} onClick={onToggleStatus}>{detail?.status==="활성"?"비활성":"활성"}</PrismButton>}/>
    </form>;
}
/** Legacy three-field model; use PrismUserRegistrationDraft for the current create/detail recipe. */
export type PrismUserDraft={email:string;roleId:string;companyGroupId:string};
export type PrismUserRegistrationDraft=PrismUserDraft & {lastName:string;firstName:string;companyId:string;division:string};
export type PrismUserRoleOption={value:string;label:string;needsCompanyGroup?:boolean;notice?:ReactNode};
export type PrismUserCompanyGroup={id:string;name:string;status?:"활성"|"비활성";companies:readonly string[]};
type UserCommonProps<T extends PrismUserDraft>=PrismFormActions & {
    value:T;onValueChange:(value:T)=>void;roles:readonly PrismUserRoleOption[];companyGroups:readonly PrismUserCompanyGroup[];
    emailStatus?:"idle"|"checking"|"available"|"invalid"|"duplicate";onCheckEmail?:()=>void;onToggleStatus?:()=>void;
};
export type PrismLegacyUserFormProps=UserCommonProps<PrismUserDraft> & {mode?:undefined;detail?:{status:string;name:string;company:string;division:string;employeeNo:string}};
export type PrismUserRegistrationFormProps=UserCommonProps<PrismUserRegistrationDraft> & {
    companies:readonly {value:string;label:string}[];detail?:{status:string};
} & ({mode:"create";initialValue?:PrismUserRegistrationDraft}|{mode:"detail";initialValue:PrismUserRegistrationDraft});
export type PrismUserFormProps=PrismLegacyUserFormProps|PrismUserRegistrationFormProps;
function UserFormBody<T extends PrismUserDraft>({value,onValueChange,roles,companyGroups,emailStatus:providedStatus,onCheckEmail,onToggleStatus,basicFields,basicValid=true,dirty=true,detailStatus,emailReadOnly=false,modern=false,...actions}:UserCommonProps<T> & {
    basicFields?:ReactNode|((busy:boolean)=>ReactNode);basicValid?:boolean;dirty?:boolean;detailStatus?:string;emailReadOnly?:boolean;modern?:boolean;
}) {
    const submission=useSubmission(actions.onSubmit,actions.onSubmitError),busy=!!actions.busy||submission.busy;
    const emailInput=useRef<HTMLInputElement>(null),[autoEmail,setAutoEmail]=useState<{value:string;status:"available"|"invalid"}>();
    const emailStatus=providedStatus??(autoEmail?.value===value.email ? autoEmail.status : "idle");
    const role=roles.find(option=>option.value===value.roleId),selected=companyGroups.find(group=>group.id===value.companyGroupId);
    const valid=basicValid&&dirty&&!!role&&!!value.email.trim()&&emailStatus!=="invalid"&&emailStatus!=="duplicate"&&emailStatus!=="checking"&&(!modern&&!onCheckEmail||emailReadOnly||emailStatus==="available")&&(!role?.needsCompanyGroup||!!selected);
    const groupLabel=(id:string)=>{const group=companyGroups.find(item=>item.id===id);return group ? <span className="prism-user-group-option">{group.status&&<PrismChip color={statusColor(group.status)}>{group.status}</PrismChip>}<span>{group.name}</span></span> : "회사 그룹 선택";};
    const title=modern ? <span>기본 정보<span className="prism-input-required" aria-hidden="true">*</span></span> : "기본 정보";
    return <form className={`prism-domain-form prism-user-form ${modern?"prism-user-current":""}`} aria-busy={busy||undefined} onSubmit={event=>{event.preventDefault();if(valid&&!busy&&!actions.readOnly)void submission.submit();}}>
        <PrismOutline title={title} actions={detailStatus&&<PrismChip color={statusColor(detailStatus)}>{detailStatus}</PrismChip>}>
            <PrismInput ref={emailInput} label="이메일 (로그인 ID)" type="email" required value={value.email} placeholder={modern?"@sk.com 이메일 입력":"이메일 입력"} readOnly={actions.readOnly||emailReadOnly} disabled={busy}
                onChange={event=>onValueChange({...value,email:event.target.value})} onBlur={emailReadOnly?undefined:()=>{if(onCheckEmail)onCheckEmail();else if(modern)setAutoEmail({value:value.email,status:emailInput.current?.validity.valid?"available":"invalid"});}}
                error={emailStatus==="invalid"?fieldError("올바른 이메일 형식으로 입력해 주세요."):emailStatus==="duplicate"?fieldError("이미 등록된 이메일 주소입니다."):undefined}/>
            {(typeof basicFields==="function"?basicFields(busy):basicFields)??<p className="prism-help">이름 · 소속 회사 · 본부/팀 · 사번은 사용자 등록 후 반영됩니다.</p>}
        </PrismOutline>
        <PrismOutline title={modern?<span>Role<span className="prism-input-required" aria-hidden="true">*</span></span>:"Role"}>
            <div className="prism-user-role"><PrismRadioGroup label="Role" options={roles} value={value.roleId} disabled={busy||actions.readOnly}
                onValueChange={roleId=>onValueChange({...value,roleId,companyGroupId:roles.find(option=>option.value===roleId)?.needsCompanyGroup?(value.companyGroupId||(modern?companyGroups[0]?.id??"":"")):""})}/></div><hr/>
            {role?.needsCompanyGroup ? <div className="prism-user-group-field"><PrismSelect label="회사 그룹" required value={value.companyGroupId} placeholder="회사 그룹 선택" options={companyGroups.map(group=>({value:group.id,label:group.name}))} disabled={busy} readOnly={actions.readOnly}
                renderOption={option=>groupLabel(option.value)} renderValue={option=>option?groupLabel(option.value):"회사 그룹 선택"} onValueChange={companyGroupId=>onValueChange({...value,companyGroupId})}/>
                <div className="prism-domain-company-box"><span>총 {selected?.companies.length??0}개</span><div>{selected?.companies.map(company=><PrismTag key={company}>{company}</PrismTag>)}</div></div>
                <p className="prism-help">회사 그룹 생성 및 수정은 [회사 그룹 관리] 메뉴에서 할 수 있습니다.</p></div>
                : <div className="prism-domain-role-notice">{role?.notice??(role?`${role.label}는 별도의 회사 그룹 설정이 필요하지 않습니다.`:"역할을 선택해 주세요.")}</div>}
        </PrismOutline>
        <Actions {...actions} onSubmit={submission.submit} busy={busy} error={actions.error??submission.error} valid={valid}
            leftAction={onToggleStatus&&<PrismButton variant="line" disabled={busy||actions.readOnly} onClick={onToggleStatus}>{detailStatus==="활성"?"비활성":"활성"}</PrismButton>}/>
    </form>;
}
function RegistrationUserForm(props:PrismUserRegistrationFormProps) {
    const {value,onValueChange,companies,mode,initialValue,detail,...actions}=props;
    const locked=actions.readOnly||mode==="detail";
    const basicValid=!!value.lastName.trim()&&!!value.firstName.trim()&&!!value.companyId&&!!value.division.trim();
    const dirty=mode==="create"||Object.keys(value).some(key=>value[key as keyof PrismUserRegistrationDraft].trim()!==initialValue![key as keyof PrismUserRegistrationDraft].trim());
    const basics=(busy:boolean)=><><hr/><div className="prism-domain-form-grid">
        <PrismInput label="성" required value={value.lastName} placeholder="성 입력" readOnly={locked} disabled={busy} onChange={event=>onValueChange({...value,lastName:event.target.value})}/>
        <PrismInput label="이름" required value={value.firstName} placeholder="이름 입력" readOnly={locked} disabled={busy} onChange={event=>onValueChange({...value,firstName:event.target.value})}/>
        <PrismSelect label="소속 회사" required value={value.companyId} placeholder="회사 선택" options={companies} searchable searchPlaceholder="회사명 검색" readOnly={locked} disabled={busy} onValueChange={companyId=>onValueChange({...value,companyId})}/>
        <PrismInput label="본부/팀" required value={value.division} placeholder="본부/팀 입력" readOnly={locked} disabled={busy} onChange={event=>onValueChange({...value,division:event.target.value})}/>
    </div></>;
    return <UserFormBody {...actions} value={value} onValueChange={onValueChange} modern basicFields={basics} basicValid={basicValid} dirty={dirty} detailStatus={detail?.status} emailReadOnly={mode==="detail"} submitLabel={props.submitLabel??(mode==="detail"?"수정":"등록")}/>;
}
export function PrismUserForm(props:PrismUserFormProps) {
    if(props.mode) return <RegistrationUserForm {...props}/>;
    const {detail,...legacy}=props;
    const basics=detail&&<div className="prism-domain-form-grid">{[["이름",detail.name],["소속 회사",detail.company],["본부/팀",detail.division],["사번",detail.employeeNo]].map(([label,text])=><PrismInput key={label} label={label} value={text} readOnly/>)}</div>;
    return <UserFormBody {...legacy} basicFields={basics||undefined} detailStatus={detail?.status} emailReadOnly={!!detail}/>;
}
export type PrismPositionDraft={name:string;companyId:string;industryId:string;roleId:string;mainJobId:string;subJobId:string;isCore:boolean;context:string;definition:string;expertise:string;experience:string;subExpertise:string;subExperience:string;expertiseIds:readonly string[];experienceIds:readonly string[]};
export function PrismPositionForm({value,onValueChange,companies,industries,roles,jobs,expertiseOptions,experienceOptions,canEditCore,companyContext,onCompanyContext,onGenerate,generating,...actions}:PrismFormActions & {
    value:PrismPositionDraft;onValueChange:(value:PrismPositionDraft)=>void;companies:readonly {value:string;label:string}[];industries:readonly {value:string;label:string}[];roles:readonly {value:string;label:string}[];jobs:readonly {value:string;label:string}[];
    expertiseOptions:readonly {id:string;label:string;description:string}[];experienceOptions:readonly {id:string;label:string;description:string}[];canEditCore?:boolean;companyContext?:ReactNode;onCompanyContext?:()=>void;onGenerate?:(section:"definition"|"experience")=>void;generating?:"definition"|"experience"|null;
}) {
    const locked=actions.readOnly||actions.busy||!!generating; const update=(next:Partial<PrismPositionDraft>)=>onValueChange({...value,...next});
    const duplicate=!!value.subJobId&&value.mainJobId===value.subJobId; const valid=!!value.name.trim()&&!!value.companyId&&!!value.industryId&&!!value.roleId&&!!value.mainJobId&&!duplicate;
    return <form className="prism-domain-form" onSubmit={e=>{e.preventDefault();if(valid&&!locked)actions.onSubmit();}}><h3>포지션 {actions.readOnly||actions.submitLabel==="수정" ? "상세" : "등록"}</h3><PrismOutline title="포지션 기본 정보"><PrismSelect label="회사" value={value.companyId} options={companies} onValueChange={companyId=>update({companyId})} disabled={locked}/><div className="prism-domain-form-grid"><PrismInput label="포지션 명" value={value.name} required onChange={e=>update({name:e.target.value})} disabled={locked}/><PrismSwitch label="핵심 포지션" checked={value.isCore} onCheckedChange={isCore=>update({isCore})} disabled={locked||!canEditCore}/><PrismSelect label="산업" value={value.industryId} options={industries} disabled={locked} onValueChange={industryId=>update({industryId})}/><PrismSelect label="역할" value={value.roleId} options={roles} disabled={locked} onValueChange={roleId=>update({roleId})}/><PrismSelect label="주 직무" value={value.mainJobId} options={jobs} disabled={locked} onValueChange={mainJobId=>update({mainJobId})}/><PrismSelect label="부 직무" value={value.subJobId} options={[{value:"",label:"선택 안 함"},...jobs]} disabled={locked} error={duplicate ? "이미 선택된 직무입니다. 다른 직무를 선택해 주세요." : undefined} onValueChange={subJobId=>update({subJobId})}/></div></PrismOutline>
        <PrismOutline title="Business Context" actions={onCompanyContext && <PrismButton variant="line" size="small" onClick={onCompanyContext}>회사 Task 확인</PrismButton>}>{companyContext}<PrismTextarea label="Business Context" value={value.context} onChange={e=>update({context:e.target.value})} disabled={locked}/></PrismOutline>
        <PrismOutline title="포지션 정의" actions={onGenerate && <PrismAiGenerateButton label="정의 생성" busy={generating==="definition"} disabled={locked} onGenerate={()=>onGenerate("definition")}/>}><PrismTextarea label="Mission" value={value.definition} onChange={e=>update({definition:e.target.value})} disabled={locked}/></PrismOutline>
        <PrismOutline title="요구 역량" actions={onGenerate && <PrismAiGenerateButton label="경험 생성" busy={generating==="experience"} disabled={locked} onGenerate={()=>onGenerate("experience")}/>}><h4>전문성 · 최대 3개</h4><div className="prism-domain-form-grid">{expertiseOptions.map(o=><PrismContextOptionCard key={o.id} option={{value:o.id,label:o.label,description:o.description}} checked={value.expertiseIds.includes(o.id)} disabled={locked||(!value.expertiseIds.includes(o.id)&&value.expertiseIds.length>=3)} onCheckedChange={checked=>update({expertiseIds:checked ? [...value.expertiseIds,o.id] : value.expertiseIds.filter(id=>id!==o.id)})}/>)}</div><h4>성공경험 · 최대 2개</h4><div className="prism-domain-form-grid">{experienceOptions.map(o=><PrismContextOptionCard key={o.id} option={{value:o.id,label:o.label,description:o.description}} checked={value.experienceIds.includes(o.id)} disabled={locked||(!value.experienceIds.includes(o.id)&&value.experienceIds.length>=2)} onCheckedChange={checked=>update({experienceIds:checked ? [...value.experienceIds,o.id] : value.experienceIds.filter(id=>id!==o.id)})}/>)}</div>
        <div className="prism-domain-form-grid">{([['expertise','주 직무 전문성'],['experience','주 직무 성공경험'],...(value.subJobId ? [['subExpertise','부 직무 전문성'],['subExperience','부 직무 성공경험']] : [])] as ["expertise"|"experience"|"subExpertise"|"subExperience",string][]).map(([key,label])=><PrismTextarea key={key} label={label} value={value[key]} onChange={e=>update({[key]:e.target.value})} disabled={locked}/>)}</div></PrismOutline>{generating && <p role="status">요구 사항을 생성하는 중입니다.</p>}<Actions {...actions} busy={actions.busy||!!generating} valid={valid}/></form>;
}
