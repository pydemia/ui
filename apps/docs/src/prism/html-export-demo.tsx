import { useRef, useState } from "react";
import { PrismHtmlExportButton, PrismPrintPage, PrismPrintCareer, PrismPrintRisk, PrismLeadershipPieSummary } from "@pydemia/prism";
import type { FixtureState } from "./catalog";

export function HtmlExportDemo({ state }: { state: FixtureState }) {
    const root = useRef<HTMLDivElement>(null), [message, setMessage] = useState("");
    const long = state === "long";
    const assets = state === "error" ? async () => { throw new Error("가상 자산 실패"); } : state === "loading" ? async (url: URL, signal: AbortSignal) => {
        await new Promise<void>((resolve, reject) => {
            const abort = () => { clearTimeout(timer); reject(signal.reason); };
            const timer = setTimeout(() => { signal.removeEventListener("abort", abort); resolve(); }, 1800);
            signal.addEventListener("abort", abort, { once: true }); if (signal.aborted) abort();
        });
        const response = await fetch(url, { signal }); if (!response.ok) throw new Error("자산 실패"); return response.blob();
    } : undefined;
    return <div className="prism-demo-stack">
        <div className="prism-demo-row"><PrismHtmlExportButton getRoot={() => root.current} title="가상 후보자 프로필" loadAsset={assets}
            onComplete={result => setMessage(`HTML 다운로드를 시작했습니다. 포함한 자산 ${result.embeddedAssets}개`)} onError={() => setMessage("자산을 포함하지 못해 HTML을 만들지 않았습니다.")} /></div>
        <p role={message.includes("못해") ? "alert" : "status"}>{message}</p>
        <div style={{ overflow: "auto" }}><div ref={root}>
            <div data-prism-export-exclude>내보내기에 포함하지 않는 화면 툴바입니다.</div>
            <PrismPrintPage name="김가상" company={{ brand: "가상", affiliate: "전자" }} jobTitle="기술전략담당" repeatHeader>
                <PrismLeadershipPieSummary print animate={false} items={[{ label: "지", value: 33 }, { label: "덕", value: 32 }, { label: "용", value: 35 }]} title="가상 리더십 유형" description="정적 HTML 파일에서도 글꼴과 차트를 유지하는 가상 프로필입니다." />
                <PrismPrintCareer items={Array.from({ length: long ? 48 : 3 }, (_, index) => ({ id: `career-${index}`, period: "2024 ~ 현재", company: "가상전자", role: `가상 경력 ${index + 1}` }))} />
                <PrismPrintRisk items={[{ id: "a", label: "자기 중심", latent: false, manifest: null }, { id: "b", label: "충동성", latent: true, manifest: null }]} />
            </PrismPrintPage>
        </div></div>
    </div>;
}
