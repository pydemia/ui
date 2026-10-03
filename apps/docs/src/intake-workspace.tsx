import { useRef, useState } from "react";
import {
    Badge, DataList, DataTable, DateRangePicker, Field, FileUpload,
    FormWizard, Input, NativeSelect, PageHeader,
    type DataTableColumn, type DateRangeValue, type FileUploadItem,
    type FormWizardStep,
} from "@pydemia/ui";

type IntakeRequest = {
    id: string;
    title: string;
    owner: string;
    priority: "normal" | "high";
    period: string;
    attachments: number;
};

const initialRequests: IntakeRequest[] = [
    { id: "REQ-1042", title: "월간 사용량 검토", owner: "운영팀",
        priority: "normal", period: "2026-10-05 — 2026-10-09",
        attachments: 1 },
    { id: "REQ-1041", title: "접근 권한 점검", owner: "보안팀",
        priority: "high", period: "2026-10-06 — 2026-10-08",
        attachments: 0 },
];

const columns: DataTableColumn<IntakeRequest>[] = [
    { id: "id", header: "번호", cell: (request) => request.id,
        sortValue: (request) => request.id },
    { id: "title", header: "요청", cell: (request) => request.title,
        sortValue: (request) => request.title },
    { id: "owner", header: "담당", cell: (request) => request.owner,
        sortValue: (request) => request.owner },
    { id: "priority", header: "우선순위", cell: (request) => (
        <Badge variant={request.priority === "high" ? "accent" : "default"}>
            {request.priority === "high" ? "높음" : "보통"}
        </Badge>
    ), sortValue: (request) => request.priority },
    { id: "period", header: "예정 기간",
        cell: (request) => request.period },
];

function IntakeWorkspace() {
    const nextRequest = useRef(1042);
    const nextFile = useRef(0);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [title, setTitle] = useState("");
    const [owner, setOwner] = useState("");
    const [priority, setPriority] = useState<"normal" | "high">("normal");
    const [period, setPeriod] = useState<DateRangeValue>(null);
    const [files, setFiles] = useState<FileUploadItem[]>([]);
    const [requests, setRequests] = useState(initialRequests);
    const [result, setResult] = useState("");
    const [submitError, setSubmitError] = useState("");

    const steps: FormWizardStep[] = [
        {
            id: "details", label: "요청 정보",
            description: "요청을 찾고 담당자를 확인할 수 있는 정보를 적습니다.",
            content: <>
                <Field label="요청 제목" required>
                    {(control) => <Input {...control} required
                        value={title} placeholder="예: 주간 보고서 검토"
                        onChange={(event) => setTitle(
                            event.currentTarget.value,
                        )} />}
                </Field>
                <Field label="담당 팀" required>
                    {(control) => <Input {...control} required
                        value={owner} placeholder="예: 운영팀"
                        onChange={(event) => setOwner(
                            event.currentTarget.value,
                        )} />}
                </Field>
                <Field label="우선순위">
                    {(control) => <NativeSelect {...control}
                        value={priority} onChange={(event) =>
                            setPriority(event.currentTarget.value as
                                "normal" | "high")}>
                        <option value="normal">보통</option>
                        <option value="high">높음</option>
                    </NativeSelect>}
                </Field>
            </>,
        },
        {
            id: "schedule", label: "기간과 첨부",
            description: "시작일과 종료일을 정하고 필요한 파일을 선택합니다.",
            content: <>
                <div className="grid gap-2">
                    <span className="text-sm font-medium">요청 기간</span>
                    <DateRangePicker value={period} onValueChange={setPeriod}
                        aria-label={`요청 기간: ${period
                            ? `${period.from}부터 ${period.to ?? "종료일 미선택"}`
                            : "미선택"}`}
                        startName="periodStart" endName="periodEnd" />
                </div>
                <FileUpload label="참고 파일" items={files}
                    description="선택한 파일은 실제로 전송하지 않습니다."
                    onFilesSelected={(selected) => setFiles((current) => [
                        ...current,
                        ...selected.map((file) => ({
                            id: `file-${++nextFile.current}`,
                            name: file.name,
                            status: "pending" as const,
                        })),
                    ])}
                    onRemove={(id) => setFiles((current) =>
                        current.filter((file) => file.id !== id))} />
            </>,
        },
        {
            id: "review", label: "확인",
            description: "입력한 내용을 확인한 뒤 요청 목록에 추가합니다.",
            content: <DataList label="접수할 요청" items={[
                { id: "title", label: "제목", value: title },
                { id: "owner", label: "담당", value: owner },
                { id: "priority", label: "우선순위",
                    value: priority === "high" ? "높음" : "보통" },
                { id: "period", label: "기간",
                    value: period?.to
                        ? `${period.from} — ${period.to}` : "미완성" },
                { id: "files", label: "첨부 예정",
                    value: files.length ? `${files.length}개` : "없음" },
            ]} />,
        },
    ];

    function finish() {
        if (!title.trim() || !owner.trim()) {
            setSubmitError("요청 제목과 담당 팀을 입력하세요.");
            return;
        }
        if (!period?.to) {
            setSubmitError("시작일과 종료일을 선택하세요.");
            return;
        }
        const id = `REQ-${++nextRequest.current}`;
        setRequests((current) => [{
            id, title: title.trim(), owner: owner.trim(), priority,
            period: `${period.from} — ${period.to}`,
            attachments: files.length,
        }, ...current]);
        setResult(`${id} 요청을 목록에 추가했습니다.`);
        setSubmitError("");
        setCurrentIndex(0);
        setTitle("");
        setOwner("");
        setPriority("normal");
        setPeriod(null);
        setFiles([]);
    }

    return (
        <div className="grid min-w-0 gap-5 p-[var(--space-4)]">
            <PageHeader level={2} size="compact" title="요청 접수"
                subtitle="단계별 입력을 마치면 아래 목록에 즉시 반영됩니다." />
            <div className="grid min-w-0 items-start gap-5 xl:grid-cols-2">
                <FormWizard label="새 요청" steps={steps}
                    currentIndex={currentIndex}
                    onStepChange={(index) => {
                        setSubmitError("");
                        setCurrentIndex(index);
                    }}
                    validateStep={(index) => {
                        if (index === 0 &&
                            (!title.trim() || !owner.trim())) {
                            throw new Error(
                                "요청 제목과 담당 팀을 입력하세요.",
                            );
                        }
                        if (index === 1 && !period?.to) {
                            throw new Error(
                                "시작일과 종료일을 선택하세요.",
                            );
                        }
                        return true;
                    }}
                    onFinish={finish} error={submitError}
                    finishLabel="요청 추가" />
                <section className="grid min-w-0 gap-3"
                    aria-label="접수된 요청">
                    <p role="status" className="m-0 min-h-5 text-sm text-accent">
                        {result}
                    </p>
                    <DataTable caption="접수된 요청" rows={requests}
                        columns={columns} getRowId={(request) => request.id}
                        getRowLabel={(request) => request.title}
                        getSearchText={(request) =>
                            `${request.id} ${request.title} ${request.owner}`}
                        searchPlaceholder="요청 또는 담당 팀 검색"
                        defaultPageSize={5} pageSizeOptions={[5, 10]}
                        density="compact"
                        renderRowDetails={(request) => (
                            <p className="m-0 text-sm text-muted">
                                첨부 예정 {request.attachments}개
                            </p>
                        )} />
                </section>
            </div>
            <p className="m-0 text-xs text-muted">
                예시 데이터입니다. 파일 전송과 서버 저장은 실행하지 않습니다.
            </p>
        </div>
    );
}

export { IntakeWorkspace };
