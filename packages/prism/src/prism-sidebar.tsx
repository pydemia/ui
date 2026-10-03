import { useId, useRef, useState, type ReactNode } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@pydemia/ui";
import { PrismIcon } from "./prism-icon";
import { PrismNewChatButton } from "./prism-button";
import { PrismSidebarProfile } from "./prism-primitives";
import { PrismAvatar } from "./prism-display";

export type PrismNavItem = { id: string; label: string; icon?: ReactNode; disabled?: boolean; children?: readonly PrismNavItem[] };
export type PrismHistoryItem = { id:string;title:string;generating?:boolean;editable?:boolean };
export type PrismProfileAction = { id:string;label:string;icon?:ReactNode;tone?:"default"|"muted"|"danger";disabled?:boolean };
export type PrismSidebarProps = { items: readonly PrismNavItem[]; activeId: string; onNavigate: (id: string) => void;
    collapsed: boolean; onCollapsedChange: (value: boolean) => void; onNewChat: () => void;
    history?: readonly PrismHistoryItem[]; user?: { name: string; description?: string; team?:string };
    expandedIds?:readonly string[];onExpandedIdsChange?:(ids:string[])=>void;
    historyOpen?:boolean;onHistoryOpenChange?:(open:boolean)=>void;
    onHistoryRename?:(id:string,title:string)=>void;onHistoryDeleteRequest?:(id:string)=>void;
    profileActions?:readonly PrismProfileAction[];onProfileAction?:(id:string)=>void;onPrivacyPolicy?:()=>void;copyright?:string;
};
export function PrismSidebar({items,activeId,onNavigate,collapsed,onCollapsedChange,onNewChat,history=[],user,expandedIds,onExpandedIdsChange,
    historyOpen:controlledHistoryOpen,onHistoryOpenChange,onHistoryRename,onHistoryDeleteRequest,profileActions=[],onProfileAction,onPrivacyPolicy,copyright}:PrismSidebarProps) {
    const id=useId();const [internalExpanded,setInternalExpanded]=useState<string[]>([]);const expanded=expandedIds??internalExpanded;
    const [internalHistoryOpen,setInternalHistoryOpen]=useState(true);const historyOpen=controlledHistoryOpen??internalHistoryOpen;
    const [profileOpen,setProfileOpen]=useState(false);const [more,setMore]=useState<string|null>(null);const [editing,setEditing]=useState<string|null>(null);const [draft,setDraft]=useState("");
    const renameComposing=useRef(false);const renameCancelled=useRef(false);const renameInput=useRef<HTMLInputElement>(null);
    const toggleMenu=(key:string)=>{const next=expanded.includes(key) ? expanded.filter(v=>v!==key) : [...expanded,key];if(expandedIds===undefined)setInternalExpanded(next);onExpandedIdsChange?.(next);if(collapsed)onCollapsedChange(false);};
    const toggleHistory=()=>{const next=collapsed||!historyOpen;if(controlledHistoryOpen===undefined)setInternalHistoryOpen(next);onHistoryOpenChange?.(next);if(collapsed)onCollapsedChange(false);};
    const submitRename=(item:PrismHistoryItem)=>{if(!renameCancelled.current&&draft.trim()&&draft.trim()!==item.title)onHistoryRename?.(item.id,draft.trim());setEditing(null);renameCancelled.current=false;};
    return <aside className="prism-sidebar" data-collapsed={collapsed} aria-label="PRISM 탐색">
        <header>{!collapsed&&<button className="prism-wordmark" type="button" onClick={onNewChat} aria-label="PRISM 새 대화"><PrismIcon name="LogoHorizontalIcon" size={32} style={{width:110}}/></button>}
            <button className="prism-sidebar-toggle" type="button" aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"} onClick={()=>onCollapsedChange(!collapsed)}><PrismIcon name="ExpandedIcon" size={24}/></button></header>
        <div className="prism-sidebar-new"><PrismNewChatButton icon={<PrismIcon name="PlusIcon" size={28}/>} iconOnly={collapsed} aria-label="새로운 대화" onClick={onNewChat}>새로운 대화</PrismNewChatButton></div>
        <hr className="prism-sidebar-divider"/>
        <nav className="prism-sidebar-nav" aria-label="주요 메뉴">{items.map(item=><div className="prism-sidebar-nav-group" key={item.id}>
            <button className="prism-nav-item" type="button" aria-label={item.label} disabled={item.disabled} aria-current={activeId===item.id ? "page" : undefined}
                aria-expanded={item.children ? !collapsed&&expanded.includes(item.id) : undefined} aria-controls={item.children ? `${id}-menu-${item.id}` : undefined} onClick={()=>item.children ? toggleMenu(item.id) : onNavigate(item.id)}>
                <span aria-hidden="true">{item.icon??<PrismIcon name="ChatIcon" size={24}/>}</span>{!collapsed&&<><span>{item.label}</span>{item.children&&<PrismIcon name="ChevronDownIcon" size={16} style={{marginLeft:"auto",transform:expanded.includes(item.id) ? "rotate(180deg)" : undefined}}/>}</>}</button>
            {item.children&&<div className="prism-sidebar-submenu" id={`${id}-menu-${item.id}`} hidden={collapsed||!expanded.includes(item.id)}>{item.children.map(child=><button className="prism-nav-child" type="button" key={child.id} disabled={child.disabled} aria-current={activeId===child.id ? "page" : undefined} onClick={()=>onNavigate(child.id)}>{child.label}</button>)}</div>}
        </div>)}
        <div className="prism-sidebar-nav-group"><button className="prism-nav-item" type="button" aria-label="대화기록" aria-expanded={!collapsed&&historyOpen} aria-controls={`${id}-history`} onClick={toggleHistory}><PrismIcon name="HistoryIcon" size={24}/>{!collapsed&&<><span>대화기록</span><PrismIcon name="ChevronDownIcon" size={16} style={{marginLeft:"auto",transform:historyOpen ? "rotate(180deg)" : undefined}}/></>}</button></div>
        <div className="prism-history" id={`${id}-history`} hidden={collapsed||!historyOpen}>{!history.length&&<p className="prism-history-empty">대화 기록이 없어요.</p>}{history.map(item=><div className="prism-history-row" key={item.id} data-selected={activeId===item.id||undefined} data-editing={editing===item.id||undefined} data-menu-open={more===item.id||undefined}>
            {editing===item.id ? <input ref={renameInput} autoFocus aria-label={`${item.title} 대화 이름`} value={draft} onChange={e=>setDraft(e.target.value)} onCompositionStart={()=>{renameComposing.current=true;}} onCompositionEnd={()=>{renameComposing.current=false;}} onBlur={()=>submitRename(item)} onKeyDown={e=>{
                if(e.key==="Enter"&&!renameComposing.current&&!e.nativeEvent.isComposing){e.preventDefault();e.currentTarget.blur();}if(e.key==="Escape"){e.preventDefault();renameCancelled.current=true;e.currentTarget.blur();}
            }}/> : <><button type="button" className="prism-history-link" aria-current={activeId===item.id ? "page" : undefined} onClick={()=>onNavigate(item.id)}>{item.title}</button>
                {item.generating ? <PrismIcon name="GeneratingSpinnerIcon" size={16} label="답변 생성 중"/> : item.editable!==false&&(onHistoryRename||onHistoryDeleteRequest)&&<Popover open={more===item.id} onOpenChange={next=>setMore(next ? item.id : null)}><PopoverTrigger asChild><button type="button" className="prism-history-more" aria-label={`${item.title} 메뉴 열기`}><PrismIcon name="MoreIcon" size={16}/></button></PopoverTrigger>
                    <PopoverContent data-prism="light" className="prism-history-menu" align="end" onCloseAutoFocus={e=>{if(editing===item.id){e.preventDefault();renameInput.current?.focus();}}}>
                        {onHistoryRename&&<button type="button" onClick={()=>{setDraft(item.title);renameCancelled.current=false;setEditing(item.id);setMore(null);}}>이름변경<PrismIcon name="DepthIcon" size={16}/></button>}
                        {onHistoryDeleteRequest&&<button type="button" data-danger onClick={()=>{setMore(null);onHistoryDeleteRequest(item.id);}}>채팅 삭제<PrismIcon name="TrashIcon" size={16}/></button>}
                    </PopoverContent></Popover>}</>}
        </div>)}</div></nav>
        {user&&<footer>{profileActions.length ? <Popover open={profileOpen} onOpenChange={setProfileOpen}><PopoverTrigger asChild><button className="prism-sidebar-user" type="button" aria-label={`${user.name} 사용자 메뉴`}><PrismSidebarProfile name={user.name} email={user.description??""} collapsed={collapsed}/></button></PopoverTrigger>
            <PopoverContent data-prism="light" className="prism-sidebar-profile-menu" side="right" align="center"><div><PrismAvatar name={user.name} description={user.description} team={user.team}/></div><hr/>{profileActions.map(action=><button type="button" key={action.id} disabled={action.disabled} data-tone={action.tone} onClick={()=>{setProfileOpen(false);onProfileAction?.(action.id);}}>{action.label}{action.icon}</button>)}</PopoverContent></Popover> : <PrismSidebarProfile name={user.name} email={user.description??""} collapsed={collapsed}/>}
            {!collapsed&&(onPrivacyPolicy||copyright)&&<div className="prism-sidebar-copyright">{onPrivacyPolicy&&<button type="button" onClick={onPrivacyPolicy}>개인정보처리방침</button>}{copyright&&<span>{onPrivacyPolicy ? "| " : ""}{copyright}</span>}</div>}
        </footer>}
    </aside>;
}
