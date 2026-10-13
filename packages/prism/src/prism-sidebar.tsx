import { useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@pydemia/ui";
import { PrismIcon } from "./prism-icon";
import { PrismNewChatButton } from "./prism-button";
import { PrismSidebarProfile } from "./prism-primitives";
import { PrismAvatar } from "./prism-display";

export type PrismNavItem = { id: string; label: string; icon?: ReactNode; disabled?: boolean; children?: readonly PrismNavItem[]; matchDescendants?: boolean };
/** The host decides whether the administrator menu is available; this does not authorize API calls. */
export function createPrismAdminMenu(canManage: boolean, basePath = "/chat/admin"): PrismNavItem | null {
    if (!canManage) return null;
    const base = basePath.replace(/\/+$/, "");
    return { id: "admin", label: "Admin", icon: <PrismIcon name="AdminIcon" size={24}/>, children:
        [["users","사용자 관리"],["company-groups","회사 그룹 관리"],["position-blocks","포지션 블럭 관리"],["positions","포지션 관리"],["notices","공지사항 관리"]]
            .map(([path,label]) => ({ id: `${base}/${path}`, label, matchDescendants: true })) };
}
function navItemActive(item: PrismNavItem, activeId: string) {
    return activeId === item.id || !!item.matchDescendants && activeId.startsWith(item.id.endsWith("/") ? item.id : item.id + "/");
}
/** id is a stable row key. Omitted conversationId preserves the legacy id-as-server-ID contract. */
export type PrismHistoryItem = { id:string;title:string;generating?:boolean;editable?:boolean;conversationId?:string|null;localDraftId?:string|null };
export type PrismHistoryOpenIntent = { kind:"conversation";rowId:string;conversationId:string } | { kind:"local-draft";rowId:string;localDraftId:string };
const conversationIdFor = (item:PrismHistoryItem) => { const id=item.conversationId===undefined ? item.id : item.conversationId; return id?.trim() ? id : null; };
function historyOpenIntent(item:PrismHistoryItem):PrismHistoryOpenIntent|null {
    const conversationId=conversationIdFor(item);
    if(conversationId)return {kind:"conversation",rowId:item.id,conversationId};
    return item.localDraftId?.trim() ? {kind:"local-draft",rowId:item.id,localDraftId:item.localDraftId} : null;
}
/** Matches source selection without conflating the current navigation page and the history row key. */
export function getPrismHistorySelectionId(history:readonly PrismHistoryItem[],context:{routeConversationId?:string|null;activeConversationId?:string|null;activeLocalDraftId?:string|null;isChatHome:boolean}):string|null {
    return history.find(item=>{const conversationId=conversationIdFor(item);return conversationId ? context.routeConversationId===conversationId || !context.routeConversationId&&context.activeConversationId===conversationId : context.isChatHome&&!context.routeConversationId&&!!item.localDraftId&&context.activeLocalDraftId===item.localDraftId;})?.id??null;
}
export type PrismHistoryDeletionAction = "navigate-intro" | "reset-intro-session" | "preserve-view";
/** Call after successful host deletion with the latest route/session IDs, not a request-time snapshot. */
export function getPrismHistoryDeletionAction(deletedId: string, context: { routeConversationId?: string | null; activeConversationId?: string | null }): PrismHistoryDeletionAction {
    if (!deletedId.trim()) throw new Error("A deleted conversation requires an identifier.");
    if (context.routeConversationId === deletedId) return "navigate-intro";
    if (!context.routeConversationId && context.activeConversationId === deletedId) return "reset-intro-session";
    return "preserve-view";
}
export type PrismProfileAction = { id:string;label:string;icon?:ReactNode;tone?:"default"|"muted"|"danger";disabled?:boolean };
export type PrismSidebarProps = { items: readonly PrismNavItem[]; activeId: string; onNavigate: (id: string) => void;
    collapsed: boolean; onCollapsedChange: (value: boolean) => void; onNewChat: () => void;
    history?: readonly PrismHistoryItem[]; user?: { name: string; description?: string; team?:string };
    activeHistoryId?:string|null;onHistoryOpen?:(intent:PrismHistoryOpenIntent)=>void;
    expandedIds?:readonly string[];defaultExpandedIds?:readonly string[];onExpandedIdsChange?:(ids:string[])=>void;
    historyOpen?:boolean;defaultHistoryOpen?:boolean;onHistoryOpenChange?:(open:boolean)=>void;
    onHistoryRename?:(id:string,title:string)=>void;onHistoryDeleteRequest?:(id:string)=>void;
    profileActions?:readonly PrismProfileAction[];onProfileAction?:(id:string)=>void;onPrivacyPolicy?:()=>void;copyright?:string;
};
export function PrismSidebar({items,activeId,onNavigate,collapsed,onCollapsedChange,onNewChat,history=[],user,activeHistoryId,onHistoryOpen,expandedIds,defaultExpandedIds=[],onExpandedIdsChange,
    historyOpen:controlledHistoryOpen,defaultHistoryOpen=false,onHistoryOpenChange,onHistoryRename,onHistoryDeleteRequest,profileActions=[],onProfileAction,onPrivacyPolicy,copyright}:PrismSidebarProps) {
    const id=useId();const [internalExpanded,setInternalExpanded]=useState<string[]>(()=>[...defaultExpandedIds]);const expanded=expandedIds??internalExpanded;
    const [internalHistoryOpen,setInternalHistoryOpen]=useState(defaultHistoryOpen);const historyOpen=controlledHistoryOpen??internalHistoryOpen;
    const [profileOpen,setProfileOpen]=useState(false);const [profileSide,setProfileSide]=useState<"right"|"top">("right");const [more,setMore]=useState<string|null>(null);const [editing,setEditing]=useState<string|null>(null);const [draft,setDraft]=useState("");
    const profileTrigger=useRef<HTMLButtonElement>(null);
    const renameComposing=useRef(false);const renameCancelled=useRef(false);const renameInput=useRef<HTMLInputElement>(null);
    const renameTarget=useRef<{rowId:string;conversationId:string}|null>(null);
    const menuTarget=useRef<{rowId:string;conversationId:string}|null>(null);
    const selectedHistory=activeHistoryId===undefined ? activeId : activeHistoryId;
    useLayoutEffect(()=>{
        if(!profileOpen||!profileTrigger.current)return;
        const trigger=profileTrigger.current;
        const boundary=trigger.closest(".prism-sidebar")?.parentElement;
        const update=()=>{
            const rightEdge=Math.min(window.innerWidth-8,boundary?.getBoundingClientRect().right??window.innerWidth);
            setProfileSide(rightEdge-trigger.getBoundingClientRect().right>=256+6+8 ? "right" : "top");
        };
        update();
        const observer=typeof ResizeObserver==="undefined" ? null : new ResizeObserver(update);
        if(boundary)observer?.observe(boundary);
        observer?.observe(trigger);
        window.addEventListener("resize",update);
        return ()=>{observer?.disconnect();window.removeEventListener("resize",update);};
    },[profileOpen]);
    useLayoutEffect(()=>{const target=renameTarget.current;if(!target)return;const row=history.find(item=>item.id===target.rowId);if(!row||conversationIdFor(row)!==target.conversationId||row.editable===false||row.generating){renameTarget.current=null;renameCancelled.current=true;setEditing(null);}},[history]);
    useLayoutEffect(()=>{const target=menuTarget.current;if(!target)return;const row=history.find(item=>item.id===target.rowId);if(!row||conversationIdFor(row)!==target.conversationId||row.editable===false||row.generating){menuTarget.current=null;setMore(null);}},[history]);
    const toggleMenu=(key:string)=>{if(collapsed){if(!expanded.includes(key)){const next=[...expanded,key];if(expandedIds===undefined)setInternalExpanded(next);onExpandedIdsChange?.(next);}onCollapsedChange(false);return;}const next=expanded.includes(key) ? expanded.filter(v=>v!==key) : [...expanded,key];if(expandedIds===undefined)setInternalExpanded(next);onExpandedIdsChange?.(next);};
    const toggleHistory=()=>{const next=collapsed||!historyOpen;if(controlledHistoryOpen===undefined)setInternalHistoryOpen(next);onHistoryOpenChange?.(next);if(collapsed)onCollapsedChange(false);};
    const submitRename=(item:PrismHistoryItem)=>{const target=renameTarget.current,id=conversationIdFor(item);if(target&&target.rowId===item.id&&target.conversationId===id&&!renameCancelled.current&&item.editable!==false&&!item.generating&&draft.trim()&&draft.trim()!==item.title)onHistoryRename?.(id!,draft.trim());renameTarget.current=null;setEditing(null);renameCancelled.current=false;};
    return <aside className="prism-sidebar" data-collapsed={collapsed} aria-label="PRISM 탐색">
        <header>{!collapsed&&<button className="prism-wordmark" type="button" onClick={onNewChat} aria-label="PRISM 새 대화"><PrismIcon name="LogoHorizontalIcon" size={32} style={{width:110}}/></button>}
            <button className="prism-sidebar-toggle" type="button" aria-label={collapsed ? "사이드바 펼치기" : "사이드바 접기"} onClick={()=>onCollapsedChange(!collapsed)}><PrismIcon name="ExpandedIcon" size={24}/></button></header>
        <div className="prism-sidebar-new"><PrismNewChatButton iconOnly={collapsed} aria-label="새로운 대화" onClick={onNewChat}/></div>
        <hr className="prism-sidebar-divider"/>
        <nav className="prism-sidebar-nav" aria-label="주요 메뉴">{items.map(item=><div className="prism-sidebar-nav-group" key={item.id}>
            <button className="prism-nav-item" type="button" aria-label={item.label} disabled={item.disabled} aria-current={navItemActive(item,activeId) ? "page" : undefined}
                aria-expanded={item.children ? !collapsed&&expanded.includes(item.id) : undefined} aria-controls={item.children ? `${id}-menu-${item.id}` : undefined} onClick={()=>item.children ? toggleMenu(item.id) : onNavigate(item.id)}>
                <span aria-hidden="true">{item.icon??<PrismIcon name="ChatIcon" size={24}/>}</span>{!collapsed&&<><span>{item.label}</span>{item.children&&<PrismIcon name="ChevronDownIcon" size={16} style={{marginLeft:"auto",transform:expanded.includes(item.id) ? "rotate(180deg)" : undefined}}/>}</>}</button>
            {item.children&&<div className="prism-sidebar-submenu" id={`${id}-menu-${item.id}`} hidden={collapsed||!expanded.includes(item.id)}>{item.children.map(child=><button className="prism-nav-child" type="button" key={child.id} disabled={child.disabled} aria-current={navItemActive(child,activeId) ? "page" : undefined} onClick={()=>onNavigate(child.id)}>{child.label}</button>)}</div>}
        </div>)}
        <div className="prism-sidebar-nav-group"><button className="prism-nav-item" type="button" aria-label="대화기록" aria-expanded={!collapsed&&historyOpen} aria-controls={`${id}-history`} onClick={toggleHistory}><PrismIcon name="HistoryIcon" size={24}/>{!collapsed&&<><span>대화기록</span><PrismIcon name="ChevronDownIcon" size={16} style={{marginLeft:"auto",transform:historyOpen ? "rotate(180deg)" : undefined}}/></>}</button></div>
        <div className="prism-history" id={`${id}-history`} hidden={collapsed||!historyOpen}>{!history.length&&<p className="prism-history-empty">대화 기록이 없어요.</p>}{history.map(item=>{const intent=historyOpenIntent(item),conversationId=conversationIdFor(item),selected=selectedHistory===item.id;return <div className="prism-history-row" key={item.id} data-selected={selected||undefined} data-editing={editing===item.id||undefined} data-menu-open={more===item.id||undefined}>
            {editing===item.id ? <input ref={renameInput} autoFocus aria-label={`${item.title} 대화 이름`} value={draft} onChange={e=>setDraft(e.target.value)} onCompositionStart={()=>{renameComposing.current=true;}} onCompositionEnd={()=>{renameComposing.current=false;}} onBlur={()=>submitRename(item)} onKeyDown={e=>{
                if(e.key==="Enter"&&!renameComposing.current&&!e.nativeEvent.isComposing){e.preventDefault();e.currentTarget.blur();}if(e.key==="Escape"){e.preventDefault();renameCancelled.current=true;e.currentTarget.blur();}
            }}/> : <><button type="button" className="prism-history-link" disabled={!intent||intent.kind==="local-draft"&&!onHistoryOpen} aria-current={selected&&(activeId===item.id||activeId===conversationId) ? "page" : undefined} onClick={()=>{if(!intent)return;if(onHistoryOpen)onHistoryOpen(intent);else if(intent.kind==="conversation")onNavigate(intent.conversationId);}}>{item.title}</button>
                {item.generating ? <PrismIcon name="GeneratingSpinnerIcon" size={16} label="답변 생성 중"/> : conversationId&&item.editable!==false&&(onHistoryRename||onHistoryDeleteRequest)&&<Popover open={more===item.id} onOpenChange={next=>{menuTarget.current=next ? {rowId:item.id,conversationId} : null;setMore(next ? item.id : null);}}><PopoverTrigger asChild><button type="button" className="prism-history-more" aria-label={`${item.title} 메뉴 열기`}><PrismIcon name="MoreIcon" size={16}/></button></PopoverTrigger>
                    <PopoverContent data-prism="light" className="prism-history-menu" align="end" onCloseAutoFocus={e=>{if(editing===item.id){e.preventDefault();renameInput.current?.focus();}}}>
                        {onHistoryRename&&<button type="button" onClick={()=>{renameTarget.current={rowId:item.id,conversationId};setDraft(item.title);renameCancelled.current=false;setEditing(item.id);setMore(null);}}>이름변경<PrismIcon name="DepthIcon" size={16}/></button>}
                        {onHistoryDeleteRequest&&<button type="button" data-danger onClick={()=>{setMore(null);onHistoryDeleteRequest(conversationId);}}>채팅 삭제<PrismIcon name="TrashIcon" size={16}/></button>}
                    </PopoverContent></Popover>}</>}
        </div>;})}</div></nav>
        {user&&<footer>{profileActions.length ? <Popover open={profileOpen} onOpenChange={setProfileOpen}><PopoverTrigger asChild><button ref={profileTrigger} className="prism-sidebar-user" type="button" aria-label={`${user.name} 사용자 메뉴`}><PrismSidebarProfile name={user.name} email={user.description??""} collapsed={collapsed}/></button></PopoverTrigger>
            <PopoverContent data-prism="light" className="prism-sidebar-profile-menu" side={profileSide} align="center"><div><PrismAvatar name={user.name} description={user.description} team={user.team}/></div><hr/>{profileActions.map(action=><button type="button" key={action.id} disabled={action.disabled} data-tone={action.tone} onClick={()=>{setProfileOpen(false);onProfileAction?.(action.id);}}>{action.label}{action.icon}</button>)}</PopoverContent></Popover> : <PrismSidebarProfile name={user.name} email={user.description??""} collapsed={collapsed}/>}
            {!collapsed&&(onPrivacyPolicy||copyright)&&<div className="prism-sidebar-copyright">{onPrivacyPolicy&&<button type="button" onClick={onPrivacyPolicy}>개인정보처리방침</button>}{copyright&&<span>{onPrivacyPolicy ? "| " : ""}{copyright}</span>}</div>}
        </footer>}
    </aside>;
}
