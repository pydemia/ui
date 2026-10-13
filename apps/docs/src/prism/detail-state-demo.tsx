import { useState } from "react";
import { PrismButton, PrismCandidateCard, PrismDetailList, PrismPanel, PrismPositionDetail, PrismSidebar, PrismWorkspace, createPrismAdminMenu, usePrismDetailSelection, type PrismCandidate, type PrismDetailRequestTicket, type PrismDetailSelection } from "@pydemia/prism";

const candidate: PrismCandidate = { id: "synthetic-profile", name: "김가상", company: "가상전자", position: "기술전략담당", executiveYears: 3 };

/** Synthetic host integration. Call handleAccessError only for your service's classified detail errors. */
export function DetailSelectionExample({ initialMode = "profile" }: { initialMode?: "profile" | "position" | "closed" }) {
    const initial: PrismDetailSelection | null = initialMode === "profile" ? { kind: "profile", candidate }
        : initialMode === "position" ? { kind: "position", reference: { id: "synthetic-position", source: "card", version: 2 } } : null;
    const detail = usePrismDetailSelection(initial);
    const [canManage, setCanManage] = useState(true), [collapsed, setCollapsed] = useState(false);
    const [menus, setMenus] = useState(["admin"]);
    const [route, setRoute] = useState("/chat/admin/users/synthetic-user"), [message, setMessage] = useState("");
    const [ticket, setTicket] = useState<PrismDetailRequestTicket | null>(null);
    const [expanded, setExpanded] = useState(false);
    const admin = createPrismAdminMenu(canManage);
    const selection = detail.selection;
    function applyError(status: number, request?: PrismDetailRequestTicket | null) {
        const cleared = detail.handleAccessError(status, request);
        if (cleared) setExpanded(false);
        setMessage(cleared ? `합성 ${status}: 상세 선택 해제` : `합성 ${status}: 현재 상세 유지`);
    }
    const panel = selection && <PrismPanel open title={selection.kind === "profile" ? "프로필" : "포지션"}
        onOpenChange={open => { if (!open) detail.close(); }} resizable expanded={expanded} onExpandedChange={setExpanded}
        contentStyle={{ padding: 20, overflow: "auto" }}>
        {selection.kind === "profile" ? <PrismDetailList items={[
            { label: "성명", value: selection.candidate.name }, { label: "회사", value: selection.candidate.company }, { label: "직책", value: selection.candidate.position },
        ]}/> : <PrismPositionDetail company="가상전자" role="가상 기술전략담당" items={[
            { label: "조회 대상", value: selection.reference.source === "card" ? `과거 버전 ${selection.reference.version}` : "현재 운영본" },
        ]} definition="합성 포지션 정의입니다." groups={[]}/>}
    </PrismPanel>;
    return <div data-prism="light" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <label><input type="checkbox" checked={canManage} onChange={event => setCanManage(event.target.checked)}/>관리자 메뉴 표시</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            <PrismButton variant="line" onClick={() => { setTicket(detail.captureRequest()); setMessage("합성 요청 식별자 보관"); }} disabled={!detail.open}>현재 요청 보관</PrismButton>
            <PrismButton variant="line" onClick={() => applyError(403)}>상세 API 403</PrismButton>
            <PrismButton variant="line" onClick={() => applyError(404)}>상세 API 404</PrismButton>
            <PrismButton variant="line" onClick={() => applyError(500)}>상세 API 500</PrismButton>
            <PrismButton variant="line" disabled={!ticket} onClick={() => applyError(403, ticket)}>보관한 요청의 늦은 403</PrismButton>
            <PrismButton variant="line" onClick={() => { setExpanded(false); detail.selectPosition({ id: "synthetic-position", source: "card", version: 2 }); }}>포지션 과거 버전 2</PrismButton>
            <PrismButton variant="line" onClick={() => { setExpanded(false); detail.selectPosition({ id: "synthetic-position", source: "link" }); }}>포지션 현재 운영본</PrismButton>
        </div>
        <p role="status">{message || "합성 데이터로 상세 선택과 접근 오류를 확인합니다."}</p>
        <PrismWorkspace height={560} sidebar={<PrismSidebar items={admin ? [admin] : []} expandedIds={menus} onExpandedIdsChange={setMenus}
            activeId={route} onNavigate={setRoute} collapsed={collapsed} onCollapsedChange={setCollapsed} onNewChat={detail.close}/>}
            header={<span>선택한 메뉴: {route}</span>} panel={panel}>
            <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12 }}>
                <PrismCandidateCard candidate={candidate} selected={selection?.kind === "profile"} onOpen={value => { setExpanded(false); detail.selectProfile(value); }}/>
                <p role="status">{selection ? `${selection.kind}: ${selection.kind === "profile" ? selection.candidate.id : selection.reference.id}` : "선택된 상세 없음"}</p>
            </div>
        </PrismWorkspace>
    </div>;
}
