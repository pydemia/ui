import type { ReactNode } from "react";
import { PrismIcon } from "./prism-icon";
import { PrismButton } from "./prism-button";

export function PrismBlankLayout({ gradient = true, children }: { gradient?: boolean; children: ReactNode }) { return <div className="prism-blank-layout" data-gradient={gradient || undefined}>{children}</div>; }
export function PrismErrorContent({ code, message, buttonLabel, onAction, icon }: { code?: string; message: string; buttonLabel: string; onAction: () => void; icon?: ReactNode }) {
    return <section className="prism-error-content" aria-label={code ? `오류 ${code}` : "접근 안내"}><div><div className="prism-error-illustration" aria-hidden="true">{icon ?? <PrismIcon name={code === "404" ? "NotFoundIcon" : code === "401" ? "UnauthorizedIcon" : "AccessDeniedIcon"} size={140} />}</div>{code && <p className="prism-error-code">{code}</p>}<p>{message}</p></div><PrismButton variant="line" onClick={onAction}>{buttonLabel}</PrismButton></section>;
}
export function PrismServiceContact({ label = "서비스 관련 문의", email }: { label?: string; email: string }) {
    return <div className="prism-service-contact"><span>{label}</span><span aria-hidden="true" />{email}</div>;
}
export function PrismAccessGate({ status, children, fallback }: { status:"ready" | "loading" | "denied"; children:ReactNode; fallback?:ReactNode }) {
    return status === "ready" ? children : status === "loading" ? <div className="prism-access-loading" role="status">접근 정보를 확인하는 중입니다.</div> : fallback;
}
