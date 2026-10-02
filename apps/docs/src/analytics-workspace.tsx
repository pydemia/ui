import { useId, useRef, useState } from "react";
import {
    AppBody, AppBottomPanel, AppFloatingBubble, AppFloatingPanel,
    AppHeader, AppMain, AppShell, AppSidebar, Badge, Button,
    ContentList, Dashboard, DashboardMetrics, DashboardPanels,
    DataChart, DataList, DataTable, GlobalNav, GlobalNavLink, LogConsole,
    MetricCard, NativeSelect, PageHeader, SideNav, SideNavLink,
    type DataTableColumn, type LogEntry,
} from "@pydemia/ui";

type RunStatus = "completed" | "running" | "failed";
type Run = {
    id: string;
    name: string;
    team: string;
    status: RunStatus;
    duration: number;
};

const initialRuns: Run[] = [
    { id: "r-1042", name: "일일 사용량 집계", team: "데이터",
        status: "completed", duration: 42 },
    { id: "r-1041", name: "이벤트 정합성 검사", team: "제품",
        status: "failed", duration: 18 },
    { id: "r-1040", name: "알림 발송 준비", team: "운영",
        status: "running", duration: 27 },
    { id: "r-1039", name: "전환율 보고서", team: "분석",
        status: "completed", duration: 64 },
    { id: "r-1038", name: "권한 변경 감사", team: "보안",
        status: "completed", duration: 31 },
    { id: "r-1037", name: "보존 기간 점검", team: "운영",
        status: "failed", duration: 15 },
];

const statusLabel: Record<RunStatus, string> = {
    completed: "완료",
    running: "실행 중",
    failed: "실패",
};

const statusVariant: Record<RunStatus, "default" | "accent" | "danger"> = {
    completed: "default",
    running: "accent",
    failed: "danger",
};

const columns: DataTableColumn<Run>[] = [
    { id: "name", header: "작업", cell: (run) => run.name,
        sortValue: (run) => run.name },
    { id: "team", header: "담당", cell: (run) => run.team,
        sortValue: (run) => run.team },
    { id: "status", header: "상태", cell: (run) => (
        <Badge variant={statusVariant[run.status]}>
            {statusLabel[run.status]}
        </Badge>
    ), sortValue: (run) => statusLabel[run.status] },
    { id: "duration", header: "소요", cell: (run) => `${run.duration}초`,
        sortValue: (run) => run.duration },
];

const periodData = {
    week: {
        label: "최근 7일",
        metrics: ["1,284", "1,216", "52", "16"],
        points: [
            { label: "월", value: 146 }, { label: "화", value: 172 },
            { label: "수", value: 161 }, { label: "목", value: 188 },
            { label: "금", value: 194 }, { label: "토", value: 177 },
            { label: "일", value: 178 },
        ],
    },
    month: {
        label: "최근 4주",
        metrics: ["5,031", "4,842", "143", "46"],
        points: [
            { label: "1주", value: 1128 }, { label: "2주", value: 1214 },
            { label: "3주", value: 1268 }, { label: "4주", value: 1232 },
        ],
    },
} as const;

const initialLogs: LogEntry[] = [
    { id: "log-1", level: "info", timestamp: "10:42",
        message: "일일 사용량 집계 완료" },
    { id: "log-2", level: "error", timestamp: "10:35",
        message: "이벤트 정합성 검사 실패" },
    { id: "log-3", level: "warn", timestamp: "10:24",
        message: "알림 발송 준비 지연" },
];

const rowId = (run: Run) => run.id;
const rowLabel = (run: Run) => run.name;
const searchText = (run: Run) => `${run.name} ${run.team} ${run.id}`;

function AnalyticsWorkspace() {
    const periodId = useId();
    const helpPanelId = useId();
    const helpBubbleRef = useRef<HTMLButtonElement>(null);
    const nextLogId = useRef(3);
    const [period, setPeriod] = useState<"week" | "month">("week");
    const [runs, setRuns] = useState(initialRuns);
    const [logs, setLogs] = useState(initialLogs);
    const [helpOpen, setHelpOpen] = useState(false);
    const [lastAction, setLastAction] = useState("최근 실행을 확인하세요.");
    const data = periodData[period];

    function closeHelp() {
        setHelpOpen(false);
        helpBubbleRef.current?.focus();
    }

    function retryRuns(selected: readonly Run[], clearSelection: () => void) {
        const ids = new Set(selected.map(rowId));
        setRuns((current) => current.map((run) =>
            ids.has(run.id) ? { ...run, status: "running" } : run,
        ));
        setLogs((current) => [{
            id: `log-${++nextLogId.current}`,
            level: "info",
            timestamp: "지금",
            message: `${selected.length}개 작업 재실행 요청`,
        }, ...current]);
        setLastAction(`${selected.length}개 작업을 실행 중 상태로 바꿨습니다.`);
        clearSelection();
    }

    return (
        <AppShell appearance="canvas" className="min-h-[42rem]">
            <AppHeader className="flex-wrap justify-between py-2">
                <strong className="text-sm">pydemia / operations</strong>
                <GlobalNav aria-label="작업 공간 전역 탐색">
                    <GlobalNavLink href="#analytics-overview"
                        aria-current="page">개요</GlobalNavLink>
                    <GlobalNavLink href="#analytics-runs">실행</GlobalNavLink>
                </GlobalNav>
            </AppHeader>
            <AppBody>
                <AppSidebar aria-label="분석 영역 탐색"
                    className="@3xl:w-44">
                    <SideNav aria-label="분석 영역">
                        <SideNavLink href="#analytics-overview"
                            aria-current="page">운영 현황</SideNavLink>
                        <SideNavLink href="#analytics-runs">
                            최근 실행</SideNavLink>
                    </SideNav>
                </AppSidebar>
                <AppMain as="div" className="min-w-0 space-y-6">
                    <Dashboard>
                        <div id="analytics-overview" className="space-y-4">
                            <PageHeader level={2} size="compact"
                                title="운영 현황"
                                subtitle="작업 실행과 처리 결과를 확인합니다." />
                            <div className="flex items-center gap-2">
                                <label className="text-sm" htmlFor={periodId}>
                                    기간
                                </label>
                                <div className="w-36">
                                    <NativeSelect id={periodId}
                                        value={period}
                                        onChange={(event) => setPeriod(
                                            event.target.value as "week" | "month",
                                        )}>
                                        <option value="week">최근 7일</option>
                                        <option value="month">최근 4주</option>
                                    </NativeSelect>
                                </div>
                            </div>
                        </div>
                        <DashboardMetrics aria-label="기간별 주요 지표">
                            {(["요청", "완료", "대기", "오류"] as const)
                                .map((label, index) => (
                                    <MetricCard key={label} label={label}
                                        value={data.metrics[index]}
                                        detail={data.label}
                                        variant={index === 0 ? "featured"
                                            : index > 1 ? "compact" : "default"} />
                                ))}
                        </DashboardMetrics>
                        <DashboardPanels aria-label="추세와 최근 로그">
                            <DataChart title="기간별 완료 작업"
                                description="선택한 기간의 처리 추세입니다."
                                points={data.points} unit="건"
                                variant="area" inspectable />
                            <LogConsole label="최근 실행 로그"
                                entries={logs} />
                        </DashboardPanels>
                    </Dashboard>
                    <section id="analytics-runs" className="space-y-3"
                        aria-labelledby="analytics-runs-heading">
                        <h3 id="analytics-runs-heading"
                            className="text-lg font-semibold">최근 실행</h3>
                        <DataTable caption="최근 작업 실행"
                            rows={runs} columns={columns}
                            getRowId={rowId} getRowLabel={rowLabel}
                            getSearchText={searchText}
                            searchPlaceholder="작업 또는 담당 검색"
                            filter={{ label: "상태",
                                getValue: (run) => run.status,
                                options: [
                                    { value: "completed", label: "완료" },
                                    { value: "running", label: "실행 중" },
                                    { value: "failed", label: "실패" },
                                ] }}
                            selectable defaultPageSize={5}
                            pageSizeOptions={[5, 10]}
                            renderActions={(selected, clear) => (
                                <Button onClick={() => retryRuns(selected, clear)}>
                                    선택 작업 재실행
                                </Button>
                            )} />
                    </section>
                </AppMain>
            </AppBody>
            <AppBottomPanel aria-label="작업 상태"
                className="text-xs text-muted">
                <span role="status">{lastAction}</span>
                <span className="ml-2">데모 데이터 · 서버 요청 없음</span>
            </AppBottomPanel>
            <AppFloatingBubble ref={helpBubbleRef}
                aria-label="작업 공간 도움말"
                aria-expanded={helpOpen} aria-controls={helpPanelId}
                onClick={() => setHelpOpen((open) => !open)}>
                ?
            </AppFloatingBubble>
            <AppFloatingPanel id={helpPanelId} hidden={!helpOpen}
                aria-label="작업 공간 도움말"
                className={
                    "bottom-[calc(var(--space-4)+2.5rem+var(--space-2))] " +
                    "max-h-[calc(100%-6rem)] w-64 overflow-y-auto text-sm"
                }
                onKeyDown={(event) => {
                    if (event.key === "Escape") closeHelp();
                }}>
                <strong>작업 공간 사용법</strong>
                <ContentList className="mt-2">
                    <li>기간을 바꿔 지표와 추세를 비교합니다.</li>
                    <li>실행 목록을 검색하거나 상태로 거릅니다.</li>
                    <li>행을 선택해 재실행 상태를 확인합니다.</li>
                </ContentList>
                <DataList label="현재 보기" className="mt-4" items={[
                    { id: "period", label: "기간", value: data.label },
                    { id: "runs", label: "실행",
                        value: `${runs.length}건` },
                    { id: "logs", label: "로그",
                        value: `${logs.length}건` },
                ]} />
                <Button variant="outline" className="mt-3"
                    onClick={closeHelp}>닫기</Button>
            </AppFloatingPanel>
        </AppShell>
    );
}

export { AnalyticsWorkspace };
