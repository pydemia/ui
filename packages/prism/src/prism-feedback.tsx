import type { ReactNode } from "react";
import { PrismIcon } from "./prism-icon";
import { PrismInfoGlyph as Info, PrismXGlyph as X } from "./prism-icon";
import { PrismButton } from "./prism-button";
import { PrismSkeletonGroup } from "./prism-primitives";

export function PrismToast({ title, children, tone = "info", onClose }: { title: string; children?: ReactNode; tone?: "info" | "success" | "error"; onClose?: () => void }) {
    const iconName = tone === "success" ? "ToastCheckIcon" : tone === "error" ? "ToastErrorIcon" : "ToastInfoIcon";
    return <div className="prism-toast" role={tone === "error" ? "alert" : "status"}><PrismIcon name={iconName} size={20} />
        <div><strong>{title}</strong>{children && <p>{children}</p>}</div>{onClose && <button type="button" onClick={onClose} aria-label="알림 닫기"><X size={20} aria-hidden="true" /></button>}</div>;
}
export function PrismEmptyState({ title, description, panel = false, action, icon }: { title: string; description: string; panel?: boolean; action?: ReactNode; icon?: ReactNode }) {
    return <div className="prism-empty" data-panel={panel || undefined}><div className="prism-empty-icon" aria-hidden="true">{icon ?? <PrismIcon name="NoSearchResultIcon" size={panel ? 120 : 140} />}</div>
        <h3>{title}</h3><p>{description}</p>{action}</div>;
}
export function PrismRequestState({ status, error, onRetry, variant="panel" }: { status: "loading" | "empty" | "error"; error?: string; onRetry?: () => void; variant?:"panel"|"generic" }) {
    if(variant==="panel"){
        if(status==="loading")return <PrismSkeletonGroup/>;
        if(status==="empty")return <div className="prism-request-empty"><PrismEmptyState panel title="표시할 데이터가 없습니다" description="데이터가 준비되면 여기서 확인할 수 있어요."/></div>;
        return <div className="prism-request-error" role="alert"><p>{error??<>데이터를 불러오지 못했습니다.<br/>다시 시도해 주세요.</>}</p>{onRetry&&<PrismButton variant="line" icon={<PrismIcon name="ResetIcon" size={20}/>} onClick={onRetry}>다시 시도</PrismButton>}</div>;
    }
    if (status === "loading") return <div className="prism-loading" role="status" aria-live="polite"><span className="prism-spinner" aria-hidden="true" />불러오는 중입니다.</div>;
    return <PrismEmptyState panel title={status === "error" ? "정보를 불러오지 못했습니다." : "표시할 정보가 없습니다."}
        description={status === "error" ? error ?? "다시 시도해 주세요." : "검색 조건을 변경해 주세요."}
        action={status === "error" && onRetry && <PrismButton variant="line" onClick={onRetry}>다시 시도</PrismButton>} />;
}
