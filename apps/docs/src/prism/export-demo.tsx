import { useRef, useState } from "react";
import { createPrismImagePdf, PrismButton, PrismPdfDownloadHost, PrismPrintOptions, PrismProgress, type PrismPdfExportJob, type PrismPdfExportProgress } from "@pydemia/prism";
import type { FixtureState } from "./catalog";

type DemoProfile = { name: string; selected: readonly string[]; fail: boolean; delay: boolean; long: boolean };
const sections = [{ id: "summary", label: "종합 요약 정보", content: null }, { id: "compensation", label: "보상 정보", content: null }];
async function renderProfile(profile: DemoProfile, { signal }: { signal: AbortSignal }) {
    if (profile.delay) await new Promise<void>((resolve, reject) => {
        const abort = () => { clearTimeout(timer); reject(signal.reason); };
        const timer = setTimeout(() => { signal.removeEventListener("abort", abort); resolve(); }, 2_000);
        signal.addEventListener("abort", abort, { once: true }); if (signal.aborted) abort();
    });
    signal.throwIfAborted();
    if (profile.fail) throw new Error("가상 파일 생성 실패입니다.");
    await document.fonts.ready; signal.throwIfAborted();
    const lines = ["독립 다운로드 검증용 가상 프로필입니다."];
    if (profile.selected.includes("summary")) lines.push("종합 요약 정보", ...Array.from({ length: profile.long ? 70 : 2 }, (_, index) => `가상 요약 ${index + 1}: 기술과 조직 운영 경험을 확인하는 예시입니다.`));
    if (profile.selected.includes("compensation")) lines.push("보상 정보", "기본연봉 100 / 성과급 0 (가상 단위)");
    const pages = [];
    for (let start = 0; start < lines.length; start += 32) {
        const canvas = document.createElement("canvas"); canvas.width = 1240; canvas.height = 1754;
        const ctx = canvas.getContext("2d"); if (!ctx) throw new Error("Canvas를 사용할 수 없습니다.");
        ctx.fillStyle = "white"; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#FA7C39"; ctx.fillRect(72, 170, 1096, 2);
        ctx.fillStyle = "#363636"; ctx.font = '28px "Pretendard Variable", sans-serif';
        ctx.fillText("가상전자  ·  기술전략담당", 72, 84); ctx.fillText(profile.name, 72, 128);
        lines.slice(start, start + 32).forEach((line, index) => ctx.fillText(line, 72, 220 + index * 44));
        ctx.font = '20px "Pretendard Variable", sans-serif'; ctx.fillText(`${pages.length + 1}페이지 · 가상 데이터`, 72, 1680);
        pages.push({ jpeg: canvas.toDataURL("image/jpeg", .95), width: 210, height: 297 });
    }
    return createPrismImagePdf(pages, { signal, title: profile.name });
}

export function ExportDemo({ state }: { state: FixtureState }) {
    const [jobs, setJobs] = useState<PrismPdfExportJob<DemoProfile>[]>([]);
    const [open, setOpen] = useState(false), [selected, setSelected] = useState<string[]>([]), [count, setCount] = useState(1);
    const [progress, setProgress] = useState<PrismPdfExportProgress | null>(null), [message, setMessage] = useState("");
    const sequence = useRef(0);
    const busy = jobs.length > 0;
    const submit = (options: readonly string[]) => {
        setOpen(false); setMessage(""); setProgress({ done: 0, total: count });
        const id = `demo-${++sequence.current}`;
        setJobs(previous => [...previous, { id, archiveName: "가상 후보자 프로필", documents: Array.from({ length: count }, () => ({
            filename: "가상전자 기술전략담당 김가상", data: { name: "김가상", selected: [...options], fail: state === "error", delay: state === "loading", long: state === "long" },
        })) }]);
    };
    return <div className="prism-demo-stack">
        <p>가상 데이터를 실제 PDF로 생성합니다. 여러 명을 선택하면 ZIP 하나를 다운로드합니다.</p>
        <div className="prism-demo-row"><label>후보자 수 <select value={count} disabled={busy} onChange={event => setCount(Number(event.target.value))}><option value={1}>1명</option><option value={2}>2명 (같은 파일명)</option><option value={3}>3명 (같은 파일명)</option></select></label>
            <PrismButton disabled={busy} onClick={() => { setSelected([]); setOpen(true); }}>프로필 다운로드</PrismButton>
            {busy && <PrismButton variant="line" onClick={() => { setJobs([]); setProgress(null); setMessage("파일 생성을 취소했습니다."); }}>생성 취소</PrismButton>}</div>
        <PrismPrintOptions title="다운로드 정보 선택" description="다운로드할 정보를 선택해 주세요." confirmLabel="다운로드" sections={sections} value={selected} onValueChange={setSelected} open={open} onOpenChange={setOpen} onConfirm={submit} />
        {progress && <PrismProgress value={progress.done / progress.total * 100} label="프로필 파일 생성" displayValue={`${progress.done} / ${progress.total}`} />}
        <p role={message.includes("실패") ? "alert" : "status"}>{message || (busy ? "프로필 파일을 생성하고 있습니다." : "")}</p>
        <PrismPdfDownloadHost jobs={jobs} renderPdf={renderProfile} onProgress={(_, value) => setProgress(value)}
            onComplete={(id, result) => { setJobs(previous => previous.filter(job => job.id !== id)); setMessage(`${result.filename} 다운로드를 시작했습니다.`); }}
            onError={id => { setJobs(previous => previous.filter(job => job.id !== id)); setProgress(null); setMessage("프로필 PDF 생성에 실패했습니다. 다시 시도해 주세요."); }} />
    </div>;
}
