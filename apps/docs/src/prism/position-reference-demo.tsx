import { useEffect, useState } from "react";
import { PrismButton, PrismPositionDetail, PrismResponse, createPrismPositionReference, type PrismPositionDetailProps, type PrismPositionReference, type PrismResponseBlock } from "@pydemia/prism";

type PositionData = Omit<PrismPositionDetailProps, "status" | "onRetry">;
type PositionLoader = (reference: PrismPositionReference, signal: AbortSignal, simulateFailure: boolean) => Promise<PositionData>;
type PositionRequest = { key: string; loader: PositionLoader; status: "ready" | "loading" | "error"; data: PositionData | null };

/** Synthetic provider for this example. Supply your authenticated historical/LIVE loader instead. */
async function loadSyntheticPosition(reference: PrismPositionReference, signal: AbortSignal, fail: boolean): Promise<PositionData> {
    signal.throwIfAborted();
    await new Promise<void>((resolve, reject) => {
        const abort = () => { clearTimeout(timer); reject(signal.reason); };
        const timer = setTimeout(() => { signal.removeEventListener("abort", abort); resolve(); }, 100);
        signal.addEventListener("abort", abort, { once: true });
    });
    signal.throwIfAborted();
    if (fail) throw new Error("Synthetic request failure");
    const label = reference.source === "card" ? `과거 버전 ${reference.version}` : "현재 운영본";
    return { company: "가상전자", role: "가상 기술전략담당", items: [{ label: "조회 대상", value: label }],
        definition: `${label}의 합성 포지션 정의입니다. 실제 API 조회 결과가 아닙니다.`, businessContext: "합성 사업 환경입니다.",
        groups: [{ id: "expertise", title: "전문성", items: [{ id: "tech", content: "가상 기술전략 경험" }] }] };
}

/** Host-owned request example: aborts old id/version loads and hides stale data before the next effect. */
export function PositionReferenceExample({ loadPosition = loadSyntheticPosition }: {
    loadPosition?: PositionLoader;
}) {
    const [reference, setReference] = useState<PrismPositionReference | null>(null);
    const [fail, setFail] = useState(false), [retry, setRetry] = useState(0);
    const [result, setResult] = useState<PositionRequest | null>(null);
    const id = reference?.id, source = reference?.source, version = reference?.source === "card" ? reference.version : undefined;
    const key = JSON.stringify([id, source, version, fail, retry]);
    useEffect(() => {
        if (!id || !source) { setResult(null); return; }
        let active = true;
        const controller = new AbortController(), snapshot = createPrismPositionReference({ id, version }, source);
        const requestKey = JSON.stringify([id, source, version, fail, retry]);
        setResult({ key: requestKey, loader: loadPosition, status: "loading", data: null });
        void (async () => {
            try {
                const data = await loadPosition(snapshot, controller.signal, fail);
                if (active && !controller.signal.aborted) setResult({ key: requestKey, loader: loadPosition, status: "ready", data });
            } catch {
                if (active && !controller.signal.aborted) setResult({ key: requestKey, loader: loadPosition, status: "error", data: null });
            }
        })();
        return () => { active = false; controller.abort(); };
    }, [id, source, version, fail, retry, loadPosition]);
    const blocks: PrismResponseBlock[] = [
        { id: "current", type: "text", content: "[같은 포지션의 현재 운영본](position://synthetic-position)" },
        { id: "old", type: "positions", positions: [{ id: "synthetic-position", version: 2, company: "가상전자", title: "가상 기술전략담당", reasons: ["과거 대화의 합성 추천 근거"] }] },
        { id: "new", type: "positions", positions: [{ id: "synthetic-position", version: 3, company: "가상전자", title: "가상 기술전략담당", reasons: ["후속 대화의 합성 추천 근거"] }] },
        { id: "legacy", type: "positions", positions: [{ id: "synthetic-legacy", company: "가상회사", title: "버전이 없는 오래된 카드", reasons: ["합성 추천 근거"] }] },
    ];
    const current = result?.key === key && result.loader === loadPosition ? result : null;
    const empty: PositionData = { company: "", role: "", items: [], groups: [] };
    return <div data-prism="light" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <p>합성 조회 예시입니다. 카드는 과거 버전을, 본문 링크는 현재 운영본을 요청합니다.</p>
        <label><input type="checkbox" checked={fail} onChange={event => setFail(event.target.checked)}/>조회 실패 예시</label>
        <PrismResponse blocks={blocks} selectedPositionReference={reference} onPositionOpen={(_id, next) => setReference(next)}
            onAction={(kind, _id, next) => { if (kind === "position" && next) setReference(next); }}/>
        <PrismButton variant="line" onClick={() => setReference(null)}>선택 해제</PrismButton>
        <p role="status">{reference ? reference.source === "card" ? `요청: ${reference.id} 과거 버전 ${reference.version}` : `요청: ${reference.id} 현재 운영본` : "포지션을 선택해 주세요."}</p>
        {reference && <div style={{ height: 440, resize: "both", overflow: "auto", minWidth: 140, maxWidth: "100%" }}>
            <PrismPositionDetail {...(current?.data ?? empty)} status={current?.status ?? "loading"} onRetry={() => setRetry(value => value + 1)}/>
        </div>}
    </div>;
}
