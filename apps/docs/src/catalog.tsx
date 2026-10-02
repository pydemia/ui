import {
    Accordion, AccordionContent, AccordionItem, AccordionTrigger, ActionBar,
    AnchorNav,
    AffixedInput, Alert, AlertDescription, AlertTitle,
    AppBody, AppBottomPanel, AppFloatingDisclosure,
    AppHeader, AppMain, AppShell, AppSidebar,
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
    AlertDialogTitle, AlertDialogTrigger, Avatar, AvatarFallback, AvatarImage,
    AgentStatus, ApprovalCard, ArtifactViewer,
    AvatarGroup, AvatarUploader, Badge,
    Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
    BreadcrumbPage, BreadcrumbSeparator, BlockDocument, BlockEditor,
    BarList, Board, BottomNav, BottomNavLink, BulletChart,
    Button, ButtonGroup, IconButton,
    ButtonGroupSeparator, Collapsible,
    CollapsibleContent, CollapsibleTrigger,
    Calendar, CalendarScheduler, Card, CardContent, CardDescription,
    CardFooter, CardHeader,
    CardTitle,
    Carousel, Checkbox, CitationList, CodeBlock, CodeEditorShell,
    ColorInput, Combobox,
    CopyButton,
    CommandPalette,
    ContentList,
    ContextMenu, ContextMenuCheckboxItem, ContextMenuContent,
    ContextMenuItem, ContextMenuLabel, ContextMenuRadioGroup,
    ContextMenuRadioItem, ContextMenuSeparator, ContextMenuSub,
    ContextMenuSubContent, ContextMenuSubTrigger, ContextMenuTrigger,
    Conversation, Dashboard, DashboardMetrics,
    DashboardPanels,
    DataChart, DataList, DataTable, DatePicker, DateRangePicker,
    DateTimePicker, DiffViewer,
    Dialog, DialogClose, DialogContent,
    DialogDescription, DialogFooter, DialogHeader, DialogTitle,
    DialogTrigger, DonutChart, Drawer, DrawerClose, DrawerContent,
    DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle,
    DrawerTrigger, DropdownMenu, DropdownMenuCheckboxItem,
    DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
    DropdownMenuRadioGroup, DropdownMenuRadioItem,
    DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent,
    DropdownMenuSubTrigger, DropdownMenuTrigger, Dropzone,
    Empty, EmptyContent, EmptyDescription,
    EmptyMedia, EmptyTitle, Editable, FavoriteToggle, Field, FileUpload,
    FilterBar, FormWizard, FunnelChart, Gantt,
    GlobalNav, GlobalNavLink, HoverCard, HoverCardContent,
    HoverCardTrigger, Heatmap, Image, ImageCropper, Input, InputGroup,
    InputGroupAddon,
    InputGroupButton, InputGroupInput, InputGroupText,
    InputGroupTextarea, JsonViewer, Kanban, NodeCanvas,
    Label, Lightbox, LogConsole, LogViewer, Markdown, MarkdownEditor,
    Menubar, MenubarCheckboxItem,
    MenubarContent, MenubarGroup, MenubarItem, MenubarLabel,
    MenubarMenu, MenubarRadioGroup, MenubarRadioItem,
    MenubarSeparator, MenubarSub, MenubarSubContent,
    MenubarSubTrigger, MenubarTrigger, MasterDetail,
    Message, MessageContent, MetricCard, ModelSelector,
    MonthPicker, MultiSelect, YearPicker,
    NavigationMenu, NavigationMenuContent, NavigationMenuItem,
    NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger,
    NativeSelect, NotificationCenter, NumberInput,
    PageHeader, Pagination, PasswordInput, PinInput, Popover,
    PopoverClose, PopoverContent, PopoverTrigger, Progress, PromptInput,
    QueryBuilder, RadioGroup, RadioGroupItem, RangeSlider, Rating, Reasoning,
    ResponseFeedback, ResultState,
    ResizablePanels, ScatterChart, ScrollArea,
    SearchInput,
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue, Separator, Skeleton, Slider,
    SegmentedControl, SegmentedControlItem,
    Snippet, SnippetContent, SnippetCopyButton, SnippetHeader, Spinner,
    SnippetTabsList, SnippetTabsTrigger, SideNav, SideNavLink, Sidebar,
    Sparkline, Stepper, Switch, Table, TableCell, TagsInput, Terminal,
    Timeline,
    Thread, TimePicker, ToolCall, Tree, TreeNav, TreeSelect,
    ToastQueue, useToastQueue,
    TableHead, Tabs, TabsContent, TabsList, TabsTrigger, Textarea, Toggle,
    ToggleGroup, ToggleGroupItem,
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@pydemia/ui";
import { FolderOpen, Gauge, Inbox, Plus, Settings2 } from "lucide-react";
import { TZDate, type DateRange } from "react-day-picker";
import { ko } from "react-day-picker/locale";
import {
    useEffect, useRef, useState, type FormEvent, type ReactNode,
} from "react";
import type {
    AgentRunStatus, AgentStage, AppliedFilter, ApprovalStatus,
    ArtifactRevision,
    BlockEditorBlock, BoardPost,
    CalendarSchedule,
    AnchorNavItem, ConversationMessage,
    DataTableColumn, DataTableView,
    DateRangeValue,
    DateTimeSelection,
    FileUploadItem, GanttTask, JsonValue, KanbanColumn,
    NodeCanvasEdge, NodeCanvasNode,
    LightboxItem, LogEntry, QueryField, QueryGroup, ReasoningStatus,
    ModelChoice, NotificationItem,
    ResponseFeedbackValue, ResultStatus, ThreadComment,
    TabsVariant, TerminalLine, ToolCallStatus, TreeNavItem, TreeNode,
    TreeSelectItem,
} from "@pydemia/ui";

export type ComponentEntry = {
    id: string;
    name: string;
    category: string;
    description: string;
    code: string;
    preview: () => ReactNode;
    installItems?: readonly string[];
};

function SnippetPreview() {
    const [active, setActive] = useState("npm");
    const snippets: Record<string, string> = {
        npm: "npm run registry:build",
        usage: 'import { Snippet } from "@pydemia/ui";',
    };
    return <div className="preview-snippet"><Snippet value={active} onValueChange={setActive}><SnippetHeader><SnippetTabsList aria-label="코드 종류"><SnippetTabsTrigger value="npm">Registry</SnippetTabsTrigger><SnippetTabsTrigger value="usage">Usage</SnippetTabsTrigger></SnippetTabsList><SnippetCopyButton value={snippets[active]} /></SnippetHeader><SnippetContent value="npm">{snippets.npm}</SnippetContent><SnippetContent value="usage">{snippets.usage}</SnippetContent></Snippet></div>;
}

function CodeBlockPreview() {
    const [wrap, setWrap] = useState(false);
    const code = [
        "export function formatRequest(request: Request) {",
        "  return `${request.method} ${request.url} ${request.headers.get(\"x-request-id\")}`;",
        "}",
    ].join("\n");

    return (
        <div className="preview-stack min-w-0">
            <Button variant="outline" onClick={() => setWrap(!wrap)}>
                긴 줄 {wrap ? "줄바꿈 해제" : "줄바꿈"}
            </Button>
            <CodeBlock label="request.ts" language="TypeScript"
                code={code} wrap={wrap} />
        </div>
    );
}

const initialKanbanColumns: KanbanColumn[] = [
    { id: "queued", title: "대기", cards: [
        { id: "request-1", title: "요청 분류", description: "새 요청의 담당 팀 지정" },
        { id: "request-2", title: "입력 검증", description: "누락된 필수값 확인" },
    ] },
    { id: "working", title: "진행 중", cards: [
        { id: "request-3", title: "접근 권한 검토", description: "승인 기록 확인" },
    ] },
    { id: "done", title: "완료", cards: [] },
];

function KanbanPreview() {
    const [columns, setColumns] = useState<KanbanColumn[]>(
        initialKanbanColumns,
    );

    return (
        <div className="preview-stack min-w-0">
            <p className="m-0 text-xs text-muted">
                카드를 끌거나 각 카드의 화살표 버튼으로 이동합니다.
            </p>
            <Kanban label="요청 처리 보드" columns={columns}
                onColumnsChange={setColumns} />
            <Button variant="outline" onClick={() =>
                setColumns(initialKanbanColumns)}>
                보드 초기화
            </Button>
        </div>
    );
}

const initialGanttTasks: GanttTask[] = [
    { id: "scope", title: "요구 정리", startDate: "2026-10-02",
        endDate: "2026-10-04", progress: 100 },
    { id: "design", title: "화면 설계", startDate: "2026-10-07",
        endDate: "2026-10-09", progress: 75, dependsOn: ["scope"] },
    { id: "build", title: "구현", startDate: "2026-10-12",
        endDate: "2026-10-16", progress: 30, dependsOn: ["design"] },
    { id: "release", title: "배포 검토", startDate: "2026-10-20",
        endDate: "2026-10-21", dependsOn: ["build"] },
];

function GanttPreview() {
    const [tasks, setTasks] = useState<GanttTask[]>(initialGanttTasks);
    const [scale, setScale] = useState<"day" | "week">("week");
    return (
        <div className="preview-workspace grid min-w-0 gap-3">
            <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setScale(
                    scale === "day" ? "week" : "day",
                )}>{scale === "day" ? "7일 단위" : "일 단위"} 보기</Button>
                <Button variant="outline" onClick={() =>
                    setTasks(initialGanttTasks)}>일정 초기화</Button>
            </div>
            <Gantt label="출시 일정" rangeStart="2026-10-01"
                rangeEnd="2026-10-25" tasks={tasks} scale={scale}
                onTasksChange={setTasks} />
        </div>
    );
}

const initialCanvasNodes: NodeCanvasNode[] = [
    { id: "request", title: "요청 접수",
        description: "입력과 기본값 확인", x: 72, y: 28 },
    { id: "review", title: "검토",
        description: "담당자 승인", x: 72, y: 202 },
    { id: "publish", title: "공개",
        description: "변경 사항 게시", x: 72, y: 376 },
];
const initialCanvasEdges: NodeCanvasEdge[] = [
    { id: "request-review", from: "request", to: "review" },
    { id: "review-publish", from: "review", to: "publish",
        label: "승인 후" },
];

function NodeCanvasPreview() {
    const [nodes, setNodes] = useState(initialCanvasNodes);
    const [edges, setEdges] = useState(initialCanvasEdges);
    const [variant, setVariant] = useState<"grid" | "plain">("grid");
    const nextEdgeId = useRef(0);

    return (
        <div className="preview-workspace grid min-w-0 gap-3">
            <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() =>
                    setVariant(variant === "grid" ? "plain" : "grid")}>
                    배경: {variant === "grid" ? "격자" : "평면"}
                </Button>
                <Button variant="outline" onClick={() => {
                    setNodes(initialCanvasNodes);
                    setEdges(initialCanvasEdges);
                }}>
                    흐름 초기화
                </Button>
            </div>
            <NodeCanvas label="요청 처리 흐름" nodes={nodes} edges={edges}
                width={320} height={500} variant={variant}
                onNodesChange={setNodes}
                onConnect={(from, to) => setEdges((current) => [
                    ...current, {
                        id: `added-${++nextEdgeId.current}`,
                        from, to,
                    },
                ])}
                onDisconnect={(id) => setEdges((current) =>
                    current.filter((edge) => edge.id !== id))} />
        </div>
    );
}

function MarkdownPreview() {
    const [source, setSource] = useState([
        "## 주간 검토",
        "",
        "**완료 12건**과 *대기 3건*을 확인했습니다.",
        "",
        "- 변경 내역 확인",
        "- [공식 문서](https://example.com/docs) 열기",
        "",
        "```ts",
        "const total = 15;",
        "```",
    ].join("\n"));

    return (
        <div className="preview-workspace grid gap-3">
            <Field label="Markdown 원문">
                {(control) => <Textarea {...control} rows={8}
                    value={source} onChange={(event) =>
                        setSource(event.target.value)} />}
            </Field>
            <Message from="assistant">
                <MessageContent>
                    <Markdown source={source} />
                </MessageContent>
            </Message>
        </div>
    );
}

function DataListPreview() {
    const [layout, setLayout] = useState<"rows" | "grid">("rows");
    return (
        <div className="preview-stack min-w-0">
            <Button variant="outline" onClick={() => setLayout(
                layout === "rows" ? "grid" : "rows",
            )}>
                {layout === "rows" ? "그리드로 보기" : "행으로 보기"}
            </Button>
            <DataList label="요청 세부 정보" layout={layout} items={[
                { id: "id", label: "요청 ID", value: "r-1042" },
                { id: "team", label: "담당 팀", value: "데이터" },
                { id: "status", label: "상태",
                    value: <Badge>검토 중</Badge> },
                { id: "reviewer", label: "검토자", value: null },
            ]} />
        </div>
    );
}

function NavigationPreview() {
    const [current, setCurrent] = useState("overview");
    const [globalVariant, setGlobalVariant] = useState<
        "surface" | "underline"
    >("surface");
    const [sideVariant, setSideVariant] = useState<
        "rail" | "filled"
    >("rail");
    const [bottomAppearance, setBottomAppearance] = useState<
        "bar" | "dock"
    >("bar");
    const destinations = [
        { id: "overview", label: "개요", icon: <Gauge className="size-5" /> },
        { id: "inbox", label: "받은 편지함", icon: <Inbox className="size-5" /> },
        { id: "settings", label: "설정", icon: <Settings2 className="size-5" /> },
    ];

    return (
        <div className="preview-stack">
            <Button variant="outline" onClick={() => setGlobalVariant(
                globalVariant === "surface" ? "underline" : "surface",
            )}>
                전역 탐색: {globalVariant === "surface" ? "표면형" : "밑줄형"}
            </Button>
            <GlobalNav aria-label="전역 탐색">
                <GlobalNavLink href="#overview" aria-current="page"
                    variant={globalVariant}>
                    개요
                </GlobalNavLink>
                <GlobalNavLink href="#examples" variant={globalVariant}>
                    예시
                </GlobalNavLink>
            </GlobalNav>
            <Button variant="outline" onClick={() => setSideVariant(
                sideVariant === "rail" ? "filled" : "rail",
            )}>
                측면 탐색: {sideVariant === "rail" ? "선형" : "채움형"}
            </Button>
            <SideNav aria-label="프로젝트 탐색">
                <SideNavLink href="#overview" aria-current="page"
                    variant={sideVariant}>
                    대시보드
                </SideNavLink>
                <SideNavLink href="#components" variant={sideVariant}>
                    컴포넌트
                </SideNavLink>
            </SideNav>
            <Button variant="outline" onClick={() => setBottomAppearance(
                bottomAppearance === "bar" ? "dock" : "bar",
            )}>
                하단 탐색: {bottomAppearance === "bar" ? "막대형" : "독형"}
            </Button>
            <div className={
                "w-full max-w-sm overflow-hidden rounded-sm border " +
                "border-border bg-background"
            }>
                <p className="grid min-h-20 place-items-center text-sm">
                    {destinations.find((item) => item.id === current)?.label}
                </p>
                <BottomNav aria-label="작업 공간 하단 탐색"
                    appearance={bottomAppearance}>
                    {destinations.map((item) => (
                        <BottomNavLink key={item.id}
                            href={`#${item.id}`} label={item.label}
                            icon={item.icon}
                            aria-current={current === item.id ? "page" : undefined}
                            onClick={(event) => {
                                event.preventDefault();
                                setCurrent(item.id);
                            }} />
                    ))}
                </BottomNav>
            </div>
        </div>
    );
}

function MarkdownEditorPreview() {
    const initial = "## 게시글 초안\n\n**검토할 내용**을 적어 주세요.";
    const [source, setSource] = useState(initial);
    const [submitted, setSubmitted] = useState("제출 전");

    return (
        <form className="preview-stack min-w-0" onSubmit={(event) => {
            event.preventDefault();
            const formValue = new FormData(event.currentTarget).get("body");
            setSubmitted(formValue === source
                ? `제출: ${source.length}자` : "제출 값이 다릅니다.");
        }} onReset={() => {
            setSource(initial);
            setSubmitted("제출 전");
        }}>
            <MarkdownEditor label="게시글 본문" name="body"
                value={source} onValueChange={setSource} rows={7}
                required description={
                    "제목·강조·목록·코드 문법을 입력하고 미리보기를 확인합니다."
                } />
            <div className="flex flex-wrap items-center gap-2">
                <Button type="submit">값 확인</Button>
                <Button type="reset" variant="outline">초기화</Button>
                <p role="status" className="m-0 text-sm">{submitted}</p>
            </div>
        </form>
    );
}

const initialBlockDocument: BlockEditorBlock[] = [
    { id: "title", kind: "heading", text: "운영 안내" },
    { id: "intro", kind: "paragraph", text: "다음 작업을 확인합니다." },
    { id: "first", kind: "bullet", text: "요청 검토" },
    { id: "second", kind: "bullet", text: "결과 공유" },
];

function BlockEditorPreview() {
    const [blocks, setBlocks] = useState(initialBlockDocument);
    const [saved, setSaved] = useState<BlockEditorBlock[]>([]);
    const [message, setMessage] = useState("제출 전");
    const [editorKey, setEditorKey] = useState(0);

    return (
        <form className="preview-stack min-w-0" onSubmit={(event) => {
            event.preventDefault();
            const value = new FormData(event.currentTarget).get("document");
            if (value !== JSON.stringify(blocks)) {
                setMessage("제출 값이 화면과 다릅니다.");
                return;
            }
            setSaved(JSON.parse(value) as BlockEditorBlock[]);
            setMessage(`${blocks.length}개 블록을 저장했습니다.`);
        }} onReset={(event) => {
            event.preventDefault();
            setBlocks(initialBlockDocument);
            setSaved([]);
            setMessage("제출 전");
            setEditorKey((key) => key + 1);
        }}>
            <BlockEditor key={editorKey} label="운영 문서" name="document"
                blocks={blocks} onBlocksChange={setBlocks}
                description="형식·순서를 바꾸고 구조 작업을 되돌려 보세요."
                appearance="panel" />
            <div className="flex flex-wrap items-center gap-2">
                <Button type="submit">문서 저장</Button>
                <Button type="reset" variant="outline">초기화</Button>
                <p role="status" className="m-0 text-sm">{message}</p>
            </div>
            <div className="rounded-sm border border-border p-4">
                <BlockDocument label="저장된 문서" blocks={saved} />
            </div>
        </form>
    );
}

const artifactRevisions: ArtifactRevision[] = [
    {
        id: "draft", label: "v1 · 초안",
        content: "# 점검 안내\n\n금요일에 점검합니다.",
    },
    {
        id: "review", label: "v2 · 검토",
        content: "# 점검 안내\n\n금요일 18:00에 점검합니다.\n\n담당: 운영팀",
    },
    {
        id: "final", label: "v3 · 확정",
        content: "# 점검 안내\n\n금요일 18:00에 점검합니다.\n\n" +
            "**담당: 운영팀**",
    },
];

function ArtifactViewerPreview() {
    const [revisionId, setRevisionId] = useState("final");

    return <ArtifactViewer label="점검 안내 결과물" kind="markdown"
        description="revision을 고르고 원문이나 직전 revision과의 차이를 확인하세요."
        revisions={artifactRevisions} revisionId={revisionId}
        onRevisionChange={setRevisionId} />;
}

const anchorSections: AnchorNavItem[] = [
    { id: "anchor-demo-overview", label: "요약" },
    { id: "anchor-demo-metrics", label: "핵심 지표", depth: 2 },
    { id: "anchor-demo-method", label: "분석 방법" },
    { id: "anchor-demo-next", label: "다음 작업" },
];

function AnchorNavPreview() {
    const [variant, setVariant] = useState<"rail" | "inline">("rail");
    const [current, setCurrent] = useState<string | null>(null);

    return (
        <div className="preview-stack">
            <Button variant="outline" onClick={() => setVariant(
                variant === "rail" ? "inline" : "rail",
            )}>
                표시: {variant === "rail" ? "측면 선형" : "가로형"}
            </Button>
            <div className="grid min-w-0 gap-4 md:grid-cols-[9rem_minmax(0,1fr)]">
                <div className="min-w-0">
                    <AnchorNav label="보고서 목차" items={anchorSections}
                        scrollRootId="anchor-nav-demo-scroll" offset={16}
                        variant={variant} onCurrentIdChange={setCurrent} />
                    <p role="status" className="text-xs text-muted">
                        현재: {anchorSections.find((item) =>
                            item.id === current)?.label ?? "없음"}
                    </p>
                </div>
                <div id="anchor-nav-demo-scroll" role="region"
                    aria-label="보고서 내용" tabIndex={0}
                    className={
                        "max-h-60 min-w-0 overflow-y-auto rounded-sm " +
                        "border border-border bg-surface p-4 " +
                        "focus-visible:outline-2 focus-visible:outline-focus"
                    }>
                    {anchorSections.map((item) => (
                        <section key={item.id} id={item.id}
                            className="min-h-40 scroll-mt-4 border-b border-border">
                            <h3 className="m-0 text-sm font-semibold">
                                {item.label}
                            </h3>
                            <p className="text-sm text-muted">
                                이 섹션을 읽거나 목차 링크로 이동해 보세요.
                                스크롤 위치에 따라 현재 항목이 바뀝니다.
                            </p>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ButtonGroupPreview() {
    const [quantity, setQuantity] = useState(1);
    const [lastAction, setLastAction] = useState("없음");
    const [reportAction, setReportAction] = useState("없음");

    return (
        <div className="preview-stack">
            <ButtonGroup label="수량 조정">
                <Button onClick={() => setQuantity((value) => value - 1)}
                    disabled={quantity === 0}>수량 줄이기</Button>
                <ButtonGroupSeparator />
                <Button onClick={() => setQuantity((value) => value + 1)}>
                    수량 늘리기
                </Button>
            </ButtonGroup>
            <p role="status">수량 {quantity}</p>
            <ButtonGroup label="문서 작업" orientation="vertical">
                <Button variant="outline"
                    onClick={() => setLastAction("미리보기")}>
                    미리보기
                </Button>
                <Button variant="outline"
                    onClick={() => setLastAction("내보내기")}>
                    내보내기
                </Button>
            </ButtonGroup>
            <p role="status">마지막 작업: {lastAction}</p>
            <ButtonGroup label="보고서 저장 작업">
                <Button onClick={() => setReportAction("저장")}>
                    보고서 저장
                </Button>
                <ButtonGroupSeparator />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon" aria-label="다른 저장 방법">
                            <span aria-hidden="true">▾</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onSelect={() =>
                            setReportAction("사본 저장")}>
                            사본 저장
                        </DropdownMenuItem>
                        <DropdownMenuItem onSelect={() =>
                            setReportAction("CSV 내보내기")}>
                            CSV 내보내기
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </ButtonGroup>
            <p role="status">보고서 작업: {reportAction}</p>
        </div>
    );
}

function CheckboxPreview() {
    const [checked, setChecked] = useState(false);
    const [digest, setDigest] = useState(true);
    const [submitted, setSubmitted] = useState("없음");

    return (
        <div className="preview-field">
            <div className="preview-checkbox-row">
                <Checkbox
                    id="demo-notifications"
                    checked={checked}
                    onCheckedChange={(value) => setChecked(value === true)}
                />
                <Label htmlFor="demo-notifications">알림 받기</Label>
            </div>
            <p role="status">알림 {checked ? "사용" : "사용 안 함"}</p>
            <div className="preview-checkbox-row">
                <Checkbox id="demo-partial" defaultChecked="indeterminate" />
                <Label htmlFor="demo-partial">일부 선택</Label>
            </div>
            <div className="preview-checkbox-row">
                <Checkbox id="demo-disabled" disabled />
                <Label htmlFor="demo-disabled">사용할 수 없는 옵션</Label>
            </div>
            <form className="grid gap-3" onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(String(new FormData(event.currentTarget)
                    .get("digest") ?? "없음"));
            }}>
                <Checkbox variant="card" label="일일 요약 받기"
                    description="매일 오전에 변경 사항을 보냅니다."
                    name="digest" value="daily" checked={digest}
                    onCheckedChange={(value) => setDigest(value === true)} />
                <Checkbox variant="card" label="관리자 전용 알림"
                    description="현재 사용할 수 없습니다." disabled />
                <Button type="submit" variant="outline">선택 제출</Button>
                <p role="status">제출값: {submitted}</p>
            </form>
        </div>
    );
}

function ColorInputPreview() {
    const [value, setValue] = useState("#ba365b");
    const [variant, setVariant] = useState<"card" | "inline">("card");
    const [submitted, setSubmitted] = useState<string | null>(null);

    return (
        <div className="preview-stack">
            <div className="flex gap-2">
                <Button variant={variant === "card" ? "primary" : "outline"}
                    onClick={() => setVariant("card")}>Card</Button>
                <Button variant={variant === "inline" ? "primary" : "outline"}
                    onClick={() => setVariant("inline")}>Inline</Button>
            </div>
            <form className="grid w-full gap-3" onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(String(
                    new FormData(event.currentTarget).get("accentColor"),
                ));
            }}>
                <ColorInput label="강조색" name="accentColor"
                    value={value} onValueChange={setValue}
                    variant={variant} />
                <Button type="submit">선택한 색 확인</Button>
            </form>
            <p role="status">제출 값: {submitted ?? "없음"}</p>
        </div>
    );
}

function SearchInputPreview() {
    const [query, setQuery] = useState("");
    const [applied, setApplied] = useState("");
    const [variant, setVariant] = useState<"field" | "toolbar">("field");
    const records = ["배포 로그", "디자인 토큰", "접근성 점검"];
    const visible = records.filter((record) =>
        record.includes(applied.trim()),
    );

    return (
        <div className="preview-stack">
            <div className="flex gap-2">
                <Button variant={variant === "field" ? "primary" : "outline"}
                    onClick={() => setVariant("field")}>Field</Button>
                <Button variant={variant === "toolbar" ? "primary" : "outline"}
                    onClick={() => setVariant("toolbar")}>Toolbar</Button>
            </div>
            <SearchInput label="프로젝트 검색" name="q"
                value={query} onValueChange={setQuery}
                onSearch={setApplied} variant={variant}
                placeholder="항목 이름" />
            <p role="status">검색 결과: {visible.length}건</p>
            <ul className="m-0 grid gap-1 pl-5 text-sm">
                {visible.map((record) => <li key={record}>{record}</li>)}
            </ul>
        </div>
    );
}

function InputGroupPreview() {
    const [requestId, setRequestId] = useState("1042");
    const [lookedUp, setLookedUp] = useState<string | null>(null);
    const [note, setNote] = useState("");
    const [savedNote, setSavedNote] = useState<string | null>(null);

    return (
        <div className="preview-stack">
            <form className="grid w-full gap-3" onSubmit={(event) => {
                event.preventDefault();
                setLookedUp(String(
                    new FormData(event.currentTarget).get("requestId"),
                ));
            }}>
                <Field label="요청 ID" description="입력값만 제출합니다.">
                    {(control) => (
                        <InputGroup>
                            <InputGroupInput {...control} name="requestId"
                                value={requestId}
                                onChange={(event) => setRequestId(event.target.value)} />
                            <InputGroupAddon align="inline-start">
                                <InputGroupText>REQ</InputGroupText>
                            </InputGroupAddon>
                            <InputGroupAddon align="inline-end" className="px-1">
                                <InputGroupButton type="submit">조회</InputGroupButton>
                            </InputGroupAddon>
                        </InputGroup>
                    )}
                </Field>
            </form>
            <p role="status" className="m-0 text-sm">
                조회한 ID: {lookedUp ?? "없음"}
            </p>
            <Field label="검토 메모">
                {(control) => (
                    <InputGroup>
                        <InputGroupTextarea {...control} name="note"
                            value={note} maxLength={120}
                            onChange={(event) => setNote(event.target.value)} />
                        <InputGroupAddon align="block-end"
                            className="justify-between py-1">
                            <InputGroupText>{note.length}/120</InputGroupText>
                            <InputGroupButton onClick={() => setSavedNote(note)}>
                                메모 저장
                            </InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>
                )}
            </Field>
            <p role="status" className="m-0 text-sm">
                저장한 메모: {savedNote === null ? "없음" : savedNote || "빈 메모"}
            </p>
        </div>
    );
}

function NumberInputPreview() {
    const [amount, setAmount] = useState<number | null>(1234.5);
    const [variant, setVariant] = useState<"field" | "stepper">("stepper");
    const [locale, setLocale] = useState("ko-KR");
    const [submitted, setSubmitted] = useState<string | null>(null);

    return (
        <div className="preview-stack">
            <div className="flex flex-wrap gap-2">
                <Button variant={variant === "stepper" ? "primary" : "outline"}
                    onClick={() => setVariant("stepper")}>Stepper</Button>
                <Button variant={variant === "field" ? "primary" : "outline"}
                    onClick={() => setVariant("field")}>Field</Button>
                <Button variant={locale === "ko-KR" ? "primary" : "outline"}
                    onClick={() => setLocale("ko-KR")}>한국어</Button>
                <Button variant={locale === "de-DE" ? "primary" : "outline"}
                    onClick={() => setLocale("de-DE")}>Deutsch</Button>
            </div>
            <form className="grid w-full gap-3" onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(String(
                    new FormData(event.currentTarget).get("amount"),
                ));
            }}>
                <NumberInput key={locale} label="월별 처리량" name="amount"
                    value={amount} onValueChange={setAmount} locale={locale}
                    min={0} max={10000} step={0.5} required
                    variant={variant} />
                <Button type="submit">제출 값 확인</Button>
            </form>
            <p role="status">
                확정 값: {amount ?? "비어 있음"} · 제출 값: {submitted ?? "없음"}
            </p>
        </div>
    );
}

function TagsInputPreview() {
    const [tags, setTags] = useState(["React", "Tailwind"]);
    const [variant, setVariant] = useState<"outline" | "soft">("outline");
    const [submitted, setSubmitted] = useState<string[] | null>(null);

    return (
        <div className="preview-stack">
            <div className="flex gap-2">
                <Button variant={variant === "outline" ? "primary" : "outline"}
                    onClick={() => setVariant("outline")}>Outline</Button>
                <Button variant={variant === "soft" ? "primary" : "outline"}
                    onClick={() => setVariant("soft")}>Soft</Button>
            </div>
            <form className="grid w-full gap-3" onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(new FormData(event.currentTarget)
                    .getAll("skills").map(String));
            }}>
                <TagsInput label="기술 태그" name="skills" value={tags}
                    onValueChange={setTags} maxTags={5} required
                    variant={variant} placeholder="태그 입력" />
                <Button type="submit">제출 값 확인</Button>
            </form>
            <p role="status">
                태그 {tags.length}개 · 제출 값: {submitted?.join(", ") ?? "없음"}
            </p>
        </div>
    );
}

function PinInputPreview() {
    const [code, setCode] = useState("");
    const [variant, setVariant] = useState<"outline" | "soft">("outline");
    const [submitted, setSubmitted] = useState<string | null>(null);

    return (
        <div className="preview-stack">
            <div className="flex gap-2">
                <Button variant={variant === "outline" ? "primary" : "outline"}
                    onClick={() => setVariant("outline")}>Outline</Button>
                <Button variant={variant === "soft" ? "primary" : "outline"}
                    onClick={() => setVariant("soft")}>Soft</Button>
            </div>
            <form className="grid gap-3" onSubmit={(event) => {
                event.preventDefault();
                const value = new FormData(event.currentTarget).get("code");
                setSubmitted(typeof value === "string"
                    ? `${value.length}자리 코드` : "제출 값 없음");
            }}>
                <PinInput label="확인 코드" name="code" length={6}
                    groupSize={3} value={code} onValueChange={(next) => {
                        setCode(next);
                        setSubmitted(null);
                    }}
                    variant={variant} required />
                <Button type="submit">제출 값 확인</Button>
            </form>
            <p role="status">
                입력: {code.length}/6자리 · 제출: {submitted ?? "없음"}
            </p>
        </div>
    );
}

function RatingPreview() {
    const [score, setScore] = useState(0);
    const [variant, setVariant] = useState<"stars" | "segments">("stars");
    const [submitted, setSubmitted] = useState<string | null>(null);

    return <div className="preview-stack">
        <div className="flex gap-2">
            <Button variant={variant === "stars" ? "primary" : "outline"}
                onClick={() => setVariant("stars")}>Stars</Button>
            <Button variant={variant === "segments" ? "primary" : "outline"}
                onClick={() => setVariant("segments")}>Segments</Button>
        </div>
        <form className="grid gap-3" onSubmit={(event) => {
            event.preventDefault();
            const result = new FormData(event.currentTarget).get("score");
            setSubmitted(typeof result === "string" ? result : "없음");
        }}>
            <Rating label="검토 점수" name="score" required
                value={score} onValueChange={(next) => {
                    setScore(next);
                    setSubmitted(null);
                }} variant={variant} />
            <Button type="submit">점수 제출</Button>
        </form>
        <Rating label="평균 점수" value={4} readOnly
            variant={variant} />
        <p role="status">현재 {score}/5점 · 제출: {submitted ?? "없음"}</p>
    </div>;
}

function DialogPreview() {
    return (
        <div className="preview-row">
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">설정 열기</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>알림 설정</DialogTitle>
                        <DialogDescription>
                            이 예시에서는 설정을 저장하지 않습니다.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">닫기</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

function CommandPalettePreview() {
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("");
    const commands = [
        { id: "overview", label: "개요로 이동", group: "탐색",
            keywords: ["home", "dashboard"] },
        { id: "requests", label: "요청 목록 열기", group: "탐색",
            keywords: ["list"] },
        { id: "logs", label: "로그 콘솔 열기", group: "도구",
            keywords: ["console"] },
        { id: "archive", label: "보관함 열기", group: "도구",
            disabled: true },
    ];

    return (
        <div className="preview-workspace grid gap-3">
            <CommandPalette commands={commands}
                trigger={<Button variant="outline">명령 검색 · Ctrl K</Button>}
                onSelect={setSelected} open={open}
                onOpenChange={setOpen} keyboardShortcut />
            <p role="status" className="m-0 text-sm text-muted">
                실행: {selected || "없음"}
            </p>
        </div>
    );
}

function AlertPreview() {
    const [showError, setShowError] = useState(false);
    const [appearance, setAppearance] = useState<
        "outline" | "soft" | "plain"
    >("outline");

    return (
        <div className="preview-alerts">
            <div className="flex flex-wrap gap-2" role="group"
                aria-label="알림 표시 형태">
                {(["outline", "soft", "plain"] as const).map((option) => (
                    <Button key={option} type="button"
                        variant={appearance === option ? "primary" : "outline"}
                        aria-pressed={appearance === option}
                        onClick={() => setAppearance(option)}>
                        {option}
                    </Button>
                ))}
            </div>
            <Alert appearance={appearance}>
                <AlertTitle>안내</AlertTitle>
                <AlertDescription>변경 사항을 확인할 수 있습니다.</AlertDescription>
            </Alert>
            <Alert variant="info" appearance={appearance}>
                <AlertTitle>새 기능이 준비됐습니다</AlertTitle>
                <AlertDescription>설정에서 사용할 수 있습니다.</AlertDescription>
            </Alert>
            <Alert variant="success" appearance={appearance}>
                <AlertTitle>저장되었습니다</AlertTitle>
                <AlertDescription>변경 사항이 반영됐습니다.</AlertDescription>
            </Alert>
            <Alert variant="warning" appearance={appearance}>
                <AlertTitle>확인이 필요합니다</AlertTitle>
                <AlertDescription>만료 예정 항목을 검토하세요.</AlertDescription>
            </Alert>
            <Button variant="outline" onClick={() => setShowError(!showError)}>
                {showError ? "오류 숨기기" : "오류 표시"}
            </Button>
            {showError && (
                <Alert variant="destructive" appearance={appearance}>
                    <AlertTitle>저장하지 못했습니다</AlertTitle>
                    <AlertDescription>입력값을 확인하고 다시 시도하세요.</AlertDescription>
                </Alert>
            )}
        </div>
    );
}

const reviewerMembers = [
    { id: "hana", name: "김하나", fallback: "김" },
    { id: "jimin", name: "박지민", fallback: "박" },
    { id: "soyeon", name: "이소연", fallback: "이" },
    { id: "eunji", name: "최은지", fallback: "최" },
    { id: "suhyeon", name: "정수현", fallback: "정" },
];

function AvatarGroupPreview() {
    const [range, setRange] = useState<"limited" | "all" | "empty">(
        "limited",
    );
    const [size, setSize] = useState<"sm" | "default">("default");
    const members = range === "empty" ? [] : reviewerMembers;
    const maxVisible = range === "all" ? 5 : 3;
    const hidden = members.slice(maxVisible);

    return (
        <div className="preview-stack">
            <div className="flex flex-wrap gap-2" role="group"
                aria-label="표시 범위">
                {(["limited", "all", "empty"] as const).map((option) => (
                    <Button key={option} type="button"
                        variant={range === option ? "primary" : "outline"}
                        aria-pressed={range === option}
                        onClick={() => setRange(option)}>
                        {{ limited: "3명", all: "전체", empty: "빈 목록" }[option]}
                    </Button>
                ))}
            </div>
            <div className="flex gap-2" role="group" aria-label="아바타 크기">
                {(["default", "sm"] as const).map((option) => (
                    <Button key={option} type="button"
                        variant={size === option ? "primary" : "outline"}
                        aria-pressed={size === option}
                        onClick={() => setSize(option)}>
                        {option === "sm" ? "작게" : "기본"}
                    </Button>
                ))}
            </div>
            <AvatarGroup label="검토 팀" members={members}
                maxVisible={maxVisible} size={size}
                emptyText="팀원이 없습니다."
                overflowLabel={
                    `추가 ${hidden.length}명: ${hidden.map(
                        (member) => member.name,
                    ).join(", ")}`
                } />
        </div>
    );
}

function NativeSelectPreview() {
    const [density, setDensity] = useState("standard");

    return (
        <div className="preview-stack">
            <Label htmlFor="demo-density">화면 밀도</Label>
            <NativeSelect
                id="demo-density"
                value={density}
                onChange={(event) => setDensity(event.target.value)}
            >
                <option value="standard">기본</option>
                <option value="compact">좁게</option>
            </NativeSelect>
            <p role="status">선택: {density === "standard" ? "기본" : "좁게"}</p>
        </div>
    );
}

function SwitchPreview() {
    const [enabled, setEnabled] = useState(false);

    return (
        <div className="preview-stack">
            <div className="preview-checkbox-row">
                <Switch
                    id="demo-switch"
                    checked={enabled}
                    onCheckedChange={setEnabled}
                />
                <Label htmlFor="demo-switch">이메일 알림</Label>
            </div>
            <p role="status">이메일 알림 {enabled ? "사용" : "사용 안 함"}</p>
        </div>
    );
}

function RadioGroupPreview() {
    const [value, setValue] = useState("standard");
    const [delivery, setDelivery] = useState("email");
    const [submitted, setSubmitted] = useState("없음");

    return (
        <div className="preview-stack">
            <RadioGroup
                aria-label="화면 밀도"
                value={value}
                onValueChange={setValue}
            >
                <div className="preview-checkbox-row">
                    <RadioGroupItem id="demo-radio-standard" value="standard" />
                    <Label htmlFor="demo-radio-standard">기본</Label>
                </div>
                <div className="preview-checkbox-row">
                    <RadioGroupItem id="demo-radio-compact" value="compact" />
                    <Label htmlFor="demo-radio-compact">좁게</Label>
                </div>
            </RadioGroup>
            <p role="status">선택: {value === "standard" ? "기본" : "좁게"}</p>
            <form className="grid gap-3" onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(String(new FormData(event.currentTarget)
                    .get("delivery") ?? "없음"));
            }}>
                <RadioGroup aria-label="보고서 수신 방식" name="delivery"
                    value={delivery} onValueChange={setDelivery}>
                    <RadioGroupItem variant="card" value="email"
                        label="이메일" description="완료 후 이메일로 받습니다." />
                    <RadioGroupItem variant="card" value="workspace"
                        label="작업 공간" description="화면에서 바로 확인합니다." />
                    <RadioGroupItem variant="card" value="sms"
                        label="문자 메시지" disabled />
                </RadioGroup>
                <Button type="submit" variant="outline">선택 제출</Button>
                <p role="status">제출값: {submitted}</p>
            </form>
        </div>
    );
}

function SegmentedControlPreview() {
    const [density, setDensity] = useState("standard");
    const [submitted, setSubmitted] = useState<string | null>(null);

    return (
        <form className="preview-stack" onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(String(
                new FormData(event.currentTarget).get("density"),
            ));
        }}>
            <SegmentedControl label="화면 밀도" name="density"
                value={density} onValueChange={setDensity}>
                <SegmentedControlItem value="standard">
                    기본
                </SegmentedControlItem>
                <SegmentedControlItem value="compact">
                    밀집
                </SegmentedControlItem>
                <SegmentedControlItem value="comfortable" disabled>
                    준비 중
                </SegmentedControlItem>
            </SegmentedControl>
            <Button type="submit">선택한 밀도 확인</Button>
            <p role="status">
                선택: {density === "standard" ? "기본" : "밀집"}
                {` · 제출: ${submitted ?? "없음"}`}
            </p>
        </form>
    );
}

function ProgressPreview() {
    const [progress, setProgress] = useState(30);

    return (
        <div className="preview-stack">
            <div>업로드 진행률: {progress}%</div>
            <Progress aria-label="업로드 진행률" value={progress} />
            <div className="flex items-center gap-4 py-2">
                <Progress aria-label="원형 업로드 진행률" value={progress}
                    variant="circular" showValue className="size-16" />
                <Progress aria-label="동기화 중" value={null}
                    variant="circular" className="size-12" />
                <span className="text-xs text-muted">원형 / 진행 중</span>
            </div>
            <Button
                variant="outline"
                onClick={() => setProgress((value) => value >= 100 ? 0 : value + 10)}
            >
                진행률 변경
            </Button>
        </div>
    );
}

function SkeletonPreview() {
    const [loading, setLoading] = useState(true);

    return (
        <div className="preview-stack">
            <Button variant="outline" onClick={() => setLoading(!loading)}>
                {loading ? "내용 표시" : "로딩 표시"}
            </Button>
            <div role="status">
                {loading ? (
                    <div className="flex flex-wrap items-center gap-3">
                        <span className="sr-only">내용을 불러오는 중</span>
                        <Skeleton shape="circle" />
                        <div className="grid min-w-32 gap-2">
                            <Skeleton shape="line" className="w-32" />
                            <Skeleton shape="line" className="w-24" />
                        </div>
                        <Skeleton shape="rectangle" className="h-12 w-20" />
                    </div>
                ) : "불러온 내용입니다."}
            </div>
        </div>
    );
}

function EmptyPreview() {
    const [appearance, setAppearance] = useState<
        "dashed" | "panel" | "plain"
    >("dashed");
    const [added, setAdded] = useState(false);

    return (
        <div className="preview-stack min-w-0">
            <div role="group" aria-label="빈 상태 표시 형태"
                className="flex flex-wrap gap-2">
                {(["dashed", "panel", "plain"] as const).map((option) => (
                    <Button key={option} type="button"
                        variant={appearance === option ? "primary" : "outline"}
                        aria-pressed={appearance === option}
                        onClick={() => setAppearance(option)}>
                        {option}
                    </Button>
                ))}
            </div>
            {added ? (
                <div role="status" className="grid gap-2 text-sm">
                    항목을 추가했습니다.
                    <Button variant="outline" onClick={() =>
                        setAdded(false)}>빈 상태로 돌아가기</Button>
                </div>
            ) : (
                <Empty appearance={appearance}>
                    <EmptyMedia><Inbox /></EmptyMedia>
                    <EmptyTitle>아직 항목이 없습니다</EmptyTitle>
                    <EmptyDescription>
                        새 항목을 추가해 시작하세요.
                    </EmptyDescription>
                    <EmptyContent>
                        <Button variant="outline" onClick={() =>
                            setAdded(true)}>항목 추가</Button>
                    </EmptyContent>
                </Empty>
            )}
        </div>
    );
}

function ResultStatePreview() {
    const [status, setStatus] = useState<ResultStatus>("error");
    const copy = {
        pending: {
            title: "자료를 저장하는 중입니다",
            description: "작업이 끝나면 결과가 이 자리에 표시됩니다.",
        },
        success: {
            title: "자료를 저장했습니다",
            description: "이제 다음 작업을 진행할 수 있습니다.",
        },
        error: {
            title: "자료를 저장하지 못했습니다",
            description: "연결을 확인하고 다시 시도해 주세요.",
        },
    };

    return (
        <div className="preview-stack min-w-0">
            <div role="group" aria-label="작업 결과 선택"
                className="flex flex-wrap gap-2">
                {(["pending", "success", "error"] as const)
                    .map((option) => (
                        <Button key={option} type="button"
                            variant={status === option ? "primary" : "outline"}
                            aria-pressed={status === option}
                            onClick={() => setStatus(option)}>
                            {option}
                        </Button>
                    ))}
            </div>
            <ResultState status={status} title={copy[status].title}
                description={copy[status].description}
                onRetry={() => setStatus("success")}
                actions={status === "success" ? (
                    <Button variant="outline" onClick={() =>
                        setStatus("error")}>다시 보기</Button>
                ) : undefined} />
        </div>
    );
}

function AlertDialogPreview() {
    const [deleted, setDeleted] = useState(false);

    return (
        <div className="preview-stack">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="outline">항목 삭제</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>항목을 삭제하시겠습니까?</AlertDialogTitle>
                        <AlertDialogDescription>
                            삭제하면 이 목록에서 항목이 사라집니다.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel asChild>
                            <Button variant="outline">취소</Button>
                        </AlertDialogCancel>
                        <AlertDialogAction asChild>
                            <Button onClick={() => setDeleted(true)}>삭제</Button>
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <p role="status">{deleted ? "항목이 삭제되었습니다." : "항목이 있습니다."}</p>
        </div>
    );
}

function CollapsiblePreview() {
    const [open, setOpen] = useState(false);

    return (
        <Collapsible open={open} onOpenChange={setOpen} className="preview-stack">
            <CollapsibleTrigger asChild>
                <Button variant="outline">{open ? "세부 정보 닫기" : "세부 정보 열기"}</Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
                <p>검토 대상 component 3개가 포함되어 있습니다.</p>
            </CollapsibleContent>
        </Collapsible>
    );
}

function SliderPreview() {
    const [value, setValue] = useState([40]);
    const [range, setRange] = useState([20, 80]);

    return (
        <div className="preview-stack">
            <p>음량: {value[0]}%</p>
            <Slider aria-label="음량" value={value} onValueChange={setValue} />
            <p>목표 구간: {range[0]}–{range[1]}%</p>
            <Slider aria-label="목표 구간" value={range}
                onValueChange={setRange} minStepsBetweenThumbs={1} />
        </div>
    );
}

function RangeSliderPreview() {
    const [applied, setApplied] = useState("가격 범위를 선택하세요.");

    return (
        <form className="preview-stack" onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.currentTarget);
            setApplied(`${data.get("minPrice")}–${data.get("maxPrice")}만원 적용`);
        }} onReset={() => setApplied("가격 범위를 선택하세요.")}>
            <RangeSlider
                label="월 이용료 범위"
                minLabel="최저 가격" maxLabel="최고 가격"
                minName="minPrice" maxName="maxPrice"
                min={0} max={100} step={5} defaultValue={[20, 80]}
                minStepsBetweenThumbs={1}
                formatValue={(amount) => `${amount}만원`}
            />
            <div className="flex gap-2">
                <Button type="submit">범위 적용</Button>
                <Button type="reset" variant="outline">초기화</Button>
            </div>
            <p role="status">{applied}</p>
        </form>
    );
}

function TogglePreview() {
    const [pressed, setPressed] = useState(false);

    return (
        <div className="preview-stack">
            <Toggle pressed={pressed} onPressedChange={setPressed}>
                굵게
            </Toggle>
            <p role="status">굵게 {pressed ? "사용" : "사용 안 함"}</p>
        </div>
    );
}

function ToggleGroupPreview() {
    const [view, setView] = useState("cards");
    const [details, setDetails] = useState<string[]>(["summary"]);

    return (
        <div className="preview-stack">
            <div>
                <p className="mb-2 text-sm">보기 방식</p>
                <ToggleGroup type="single" aria-label="보기 방식"
                    value={view} onValueChange={(next) => {
                        if (next) setView(next);
                    }}>
                    <ToggleGroupItem value="cards">카드</ToggleGroupItem>
                    <ToggleGroupItem value="list">목록</ToggleGroupItem>
                    <ToggleGroupItem value="compact" disabled>
                        간결하게
                    </ToggleGroupItem>
                </ToggleGroup>
            </div>
            <div>
                <p className="mb-2 text-sm">표시 정보</p>
                <ToggleGroup type="multiple" aria-label="표시 정보"
                    value={details} onValueChange={setDetails}>
                    <ToggleGroupItem value="summary">요약</ToggleGroupItem>
                    <ToggleGroupItem value="date">날짜</ToggleGroupItem>
                    <ToggleGroupItem value="owner">담당자</ToggleGroupItem>
                </ToggleGroup>
            </div>
            <p role="status">
                보기: {view === "cards" ? "카드" : "목록"} · 표시 정보:
                {details.length ? ` ${details.join(", ")}` : " 없음"}
            </p>
        </div>
    );
}

function CalendarPreview() {
    const [date, setDate] = useState<Date | undefined>(
        new TZDate(2026, 8, 15, "Asia/Seoul"),
    );
    const [range, setRange] = useState<DateRange | undefined>();
    const [mode, setMode] = useState<"single" | "range">("single");
    const formatDate = (value: Date) => new Intl.DateTimeFormat("ko-KR", {
        timeZone: "Asia/Seoul",
    }).format(value);

    return (
        <div className="preview-stack">
            <div className="flex gap-2">
                <Button variant="outline" aria-pressed={mode === "single"}
                    onClick={() => setMode("single")}>날짜</Button>
                <Button variant="outline" aria-pressed={mode === "range"}
                    onClick={() => setMode("range")}>기간</Button>
            </div>
            {mode === "single" ? (
                <Calendar mode="single" timeZone="Asia/Seoul"
                    defaultMonth={new TZDate(2026, 8, 1, "Asia/Seoul")}
                    locale={ko} selected={date} onSelect={setDate} />
            ) : (
                <Calendar mode="range" min={1} timeZone="Asia/Seoul"
                    defaultMonth={new TZDate(2026, 8, 1, "Asia/Seoul")}
                    locale={ko} selected={range} onSelect={setRange} />
            )}
            <p role="status">
                {mode === "single"
                    ? `선택한 날짜: ${date ? formatDate(date) : "없음"}`
                    : "선택한 기간: " + (
                        range?.from ? formatDate(range.from) : "없음"
                    ) + " – " + (
                        range?.to ? formatDate(range.to) : "미완료"
                    )}
            </p>
        </div>
    );
}

function AvatarPreview() {
    return (
        <div className="preview-row">
            <Avatar>
                <AvatarImage src={`${import.meta.env.BASE_URL}avatar-demo.svg`}
                    alt="김하나" />
                <AvatarFallback>김하나</AvatarFallback>
            </Avatar>
            <Avatar>
                <AvatarImage src="data:image/png;base64,broken" alt="박지민" />
                <AvatarFallback>박지민</AvatarFallback>
            </Avatar>
            <Avatar><AvatarFallback>이수진</AvatarFallback></Avatar>
        </div>
    );
}

function MetricCardPreview() {
    const [count, setCount] = useState(24);

    return (
        <div className="preview-stack">
            <div className="grid w-full gap-3 sm:grid-cols-2">
                {(["default", "compact", "featured"] as const).map(
                    (variant) => (
                        <div key={variant} className={
                            variant === "featured"
                                ? "min-w-0 sm:col-span-2" : "min-w-0"
                        }>
                            <p className="mb-2 text-xs text-muted">
                                {variant}
                            </p>
                            <MetricCard variant={variant} label="검토 완료"
                                value={count}
                                change={`지난주보다 ${count - 20}건 증가`}
                                detail="이번 주" />
                        </div>
                    ),
                )}
            </div>
            <Button variant="outline" onClick={() => setCount(count + 1)}>
                검토 완료 추가
            </Button>
        </div>
    );
}

function MessagePreview() {
    return (
        <div className="preview-stack">
            <Message from="user"><MessageContent>배포 상태를 알려주세요.</MessageContent></Message>
            <Message from="assistant"><MessageContent>로컬 빌드가 완료됐습니다. 원격 배포는 아직 확인하지 않았습니다.</MessageContent></Message>
        </div>
    );
}

function CitationListPreview() {
    const [variant, setVariant] = useState<"compact" | "card">("compact");
    const [showSources, setShowSources] = useState(true);
    const sources = [
        {
            id: "button-pattern", title: "WAI-ARIA Button Pattern",
            href: "https://www.w3.org/WAI/ARIA/apg/patterns/button/",
            location: "Keyboard Interaction",
            excerpt: "버튼의 Enter·Space 실행과 접근 가능한 이름을 설명합니다.",
        },
        {
            id: "link-pattern", title: "WAI-ARIA Link Pattern",
            href: "https://www.w3.org/WAI/ARIA/apg/patterns/link/",
            location: "Keyboard Interaction",
            excerpt: "링크의 목적과 native 키보드 이동을 설명합니다.",
        },
    ];

    return (
        <div className="preview-stack max-w-xl">
            <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setVariant(
                    variant === "compact" ? "card" : "compact"
                )}>표시: {variant === "compact" ? "간결" : "카드"}</Button>
                <Button variant="outline" onClick={() =>
                    setShowSources(!showSources)}>
                    {showSources ? "빈 상태 보기" : "출처 보기"}
                </Button>
            </div>
            <CitationList label="답변의 근거" variant={variant}
                sources={showSources ? sources : []} />
        </div>
    );
}

function PromptInputPreview() {
    const [messages, setMessages] = useState<string[]>([]);

    return (
        <div className="preview-stack">
            <PromptInput
                onSend={(text) => setMessages((current) => [...current, text])}
            />
            <div role="log" aria-label="보낸 메시지">
                {messages.map((message, index) => (
                    <Message key={index} from="user">
                        <MessageContent>{message}</MessageContent>
                    </Message>
                ))}
            </div>
        </div>
    );
}

function ConversationPreview() {
    const [messages, setMessages] = useState<ConversationMessage[]>([
        { id: "m1", from: "user", content: "이번 주 요청 현황을 알려주세요." },
        { id: "m2", from: "assistant", content: "전체 42건 중 31건을 완료했습니다." },
        { id: "m3", from: "user", content: "남은 작업의 우선순위는요?" },
        { id: "m4", from: "assistant", content: "먼저 접근성 검사를 마무리하겠습니다." },
        { id: "m5", from: "user", content: "registry 설치도 확인해 주세요." },
        { id: "m6", from: "assistant", content: "새 소비자 프로젝트에서 설치를 검사하겠습니다." },
        { id: "m7", from: "user", content: "결과를 기록해 주세요." },
        { id: "m8", from: "assistant", content: "검증 상태를 작업 기록에 남기겠습니다." },
    ]);
    const nextId = useRef(9);

    function append(from: ConversationMessage["from"], content: string) {
        const id = `m${nextId.current++}`;
        setMessages((current) => [...current, { id, from, content }]);
    }

    return (
        <div className="preview-workspace grid max-w-lg gap-3">
            <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => append(
                    "assistant", "추가된 검토 결과를 확인했습니다.",
                )}>응답 추가</Button>
                <Button variant="ghost" onClick={() => setMessages([])}>
                    대화 비우기
                </Button>
            </div>
            <Conversation label="요청 검토 대화" messages={messages}
                className="h-64" />
            <PromptInput onSend={(text) => append("user", text)} />
        </div>
    );
}

function ReasoningPreview() {
    const [status, setStatus] = useState<ReasoningStatus>("streaming");

    return (
        <div className="preview-workspace grid max-w-lg gap-3">
            <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setStatus("streaming")}>
                    작성 중
                </Button>
                <Button variant="outline" onClick={() => setStatus("complete")}>
                    완료
                </Button>
                <Button variant="outline" onClick={() => setStatus("failed")}>
                    중단
                </Button>
            </div>
            <Reasoning label="검토 과정" status={status} variant="card">
                <ol className="m-0 grid gap-1 pl-5">
                    <li>요청된 화면 상태를 확인했습니다.</li>
                    <li>registry 설치 결과와 접근성 상태를 비교합니다.</li>
                </ol>
            </Reasoning>
            <Reasoning label="간단한 과정" status="complete" variant="inline">
                기존 컴포넌트 조합을 먼저 검토했습니다.
            </Reasoning>
        </div>
    );
}

function ToolCallPreview() {
    const [status, setStatus] = useState<ToolCallStatus>("running");

    return (
        <div className="preview-workspace grid max-w-lg gap-3">
            <div className="flex flex-wrap gap-2">
                {(["pending", "running", "succeeded", "failed"] as const)
                    .map((next) => (
                        <Button key={next} variant="outline"
                            onClick={() => setStatus(next)}>
                            {{ pending: "대기", running: "실행 중",
                                succeeded: "완료", failed: "실패" }[next]}
                        </Button>
                    ))}
            </div>
            <ToolCall name="registry.check" status={status}
                input="{ item: 'pyd-conversation' }"
                output={status === "succeeded" ? "검사 66건 통과" : undefined}
                error={status === "failed" ? "의존성 파일을 찾지 못했습니다." : undefined} />
            <ToolCall name="cache.read" status="succeeded"
                output="캐시 적중" variant="compact" />
        </div>
    );
}

const exampleModels: ModelChoice[] = [
    {
        id: "quick", label: "빠른 응답", provider: "예시 제공자",
        description: "짧은 질문과 요약에 맞춘 모델입니다.",
        capabilities: ["텍스트", "요약"], costLabel: "표준 사용량",
    },
    {
        id: "analysis", label: "문서 분석", provider: "예시 제공자",
        description: "긴 문서와 표를 살펴보는 작업에 사용합니다.",
        capabilities: ["긴 문서", "표 분석"], costLabel: "확장 사용량",
    },
    {
        id: "image", label: "이미지 검토", provider: "예시 제공자",
        description: "이미지 내용을 검토합니다.",
        capabilities: ["이미지"],
        disabledReason: "이 작업 공간에서 사용할 수 없습니다.",
    },
];

function ModelSelectorPreview() {
    const [modelId, setModelId] = useState<string | null>("quick");
    const [variant, setVariant] = useState<"panel" | "compact">("panel");
    const [lastSent, setLastSent] = useState("");
    const selected = exampleModels.find((model) => model.id === modelId);

    return (
        <div className="preview-stack">
            <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setVariant(
                    variant === "panel" ? "compact" : "panel"
                )}>
                    표시: {variant === "panel" ? "상세" : "간결"}
                </Button>
                <Button variant="outline" onClick={() => setModelId("image")}>
                    사용 불가 모델 보기
                </Button>
            </div>
            <ModelSelector label="예시 모델" name="model"
                models={exampleModels} value={modelId}
                onValueChange={setModelId} variant={variant} required />
            <PromptInput disabled={!selected || !!selected.disabledReason}
                onSend={(text) => setLastSent(
                    `${selected?.label ?? "모델 없음"}: ${text}`,
                )} />
            {lastSent && <p role="status" className="m-0 text-sm">
                전송: {lastSent}
            </p>}
        </div>
    );
}

function AgentStatusPreview() {
    const [status, setStatus] = useState<AgentRunStatus>("running");
    const [variant, setVariant] = useState<"panel" | "compact">("panel");
    const stageStatus: Record<AgentRunStatus,
        AgentStage["status"][]> = {
        queued: ["pending", "pending", "pending"],
        running: ["completed", "running", "pending"],
        completed: ["completed", "completed", "completed"],
        failed: ["completed", "failed", "pending"],
        cancelled: ["completed", "pending", "pending"],
    };
    const labels = ["요청 해석", "데이터 조회", "답변 구성"];
    const stages: AgentStage[] = labels.map((label, index) => ({
        id: `stage-${index}`, label, status: stageStatus[status][index],
        detail: index === 1 ? "운영 지표를 확인합니다." : undefined,
    }));

    return (
        <div className="preview-workspace grid max-w-lg gap-3">
            <div className="flex flex-wrap gap-2">
                {(["queued", "running", "completed", "failed"] as const)
                    .map((next) => (
                        <Button key={next} variant={status === next
                            ? "primary" : "outline"}
                            aria-pressed={status === next}
                            onClick={() => setStatus(next)}>
                            {{ queued: "대기", running: "진행 중",
                                completed: "완료", failed: "실패" }[next]}
                        </Button>
                    ))}
                <Button variant="ghost" onClick={() => setVariant(
                    (current) => current === "panel" ? "compact" : "panel"
                )}>{variant === "panel" ? "Compact 보기" : "Panel 보기"}</Button>
            </div>
            <AgentStatus label="분석 요청" status={status} stages={stages}
                variant={variant}
                onCancelTask={() => setStatus("cancelled")}
                onRetryTask={() => setStatus("running")} />
        </div>
    );
}

function DiffViewerPreview() {
    const [view, setView] = useState<"unified" | "split">("unified");
    const [wrap, setWrap] = useState(false);
    const before = [
        "export const settings = {",
        "  region: 'west',",
        "  cache: false,",
        "  endpoint: 'https://example.test/api/v1/reports/monthly',",
        "};",
    ].join("\n");
    const after = [
        "export const settings = {",
        "  region: 'west',",
        "  cache: true,",
        "  endpoint: 'https://example.test/api/v2/reports/monthly',",
        "};",
    ].join("\n");

    return (
        <div className="preview-workspace grid min-w-0 gap-3">
            <div className="flex flex-wrap gap-2">
                <Button variant={view === "unified" ? "primary" : "outline"}
                    aria-pressed={view === "unified"}
                    onClick={() => setView("unified")}>통합 보기</Button>
                <Button variant={view === "split" ? "primary" : "outline"}
                    aria-pressed={view === "split"}
                    onClick={() => setView("split")}>좌우 보기</Button>
                <Button variant="outline" aria-pressed={wrap}
                    onClick={() => setWrap((value) => !value)}>
                    긴 줄 {wrap ? "줄바꿈 해제" : "줄바꿈"}
                </Button>
            </div>
            <DiffViewer label="settings.ts 변경" before={before}
                after={after} view={view} wrap={wrap} />
        </div>
    );
}

function ApprovalCardPreview() {
    const [requestNumber, setRequestNumber] = useState(1);
    const [status, setStatus] = useState<ApprovalStatus>("requested");
    const [failNext, setFailNext] = useState(false);
    const [attemptCount, setAttemptCount] = useState(0);

    return (
        <div className="preview-workspace grid max-w-lg gap-3">
            <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => {
                    setRequestNumber((number) => number + 1);
                    setStatus("requested");
                    setAttemptCount(0);
                }}>새 요청</Button>
                <Button variant="outline" disabled={status !== "requested"}
                    onClick={() => setStatus("expired")}>요청 만료</Button>
                <Button variant="outline" disabled={status !== "requested"}
                    aria-pressed={failNext}
                    onClick={() => setFailNext((value) => !value)}>
                    다음 결정 실패 {failNext ? "켜짐" : "꺼짐"}
                </Button>
            </div>
            <ApprovalCard requestId={`export-${requestNumber}`}
                title="보고서 내보내기 승인"
                description="이번 요청에서 요약 보고서를 외부 저장소로 내보냅니다."
                status={status}
                onDecision={async (decision) => {
                    setAttemptCount((count) => count + 1);
                    await new Promise((resolve) => setTimeout(resolve, 450));
                    if (failNext) {
                        setFailNext(false);
                        throw new Error("데모 전달 실패");
                    }
                    setStatus(decision === "approve" ? "approved" : "rejected");
                }} />
            <p className="m-0 text-xs text-muted">
                이 요청의 전달 시도 {attemptCount}회
            </p>
        </div>
    );
}

function FieldPreview() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    return (
        <form
            className="preview-stack"
            onSubmit={(event) => {
                event.preventDefault();
                setError(email.includes("@") ? "" : "이메일 주소를 확인하세요.");
            }}
        >
            <Field
                label="이메일"
                description="알림을 받을 주소입니다."
                error={error}
                required
            >
                {(control) => (
                    <Input
                        {...control}
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                )}
            </Field>
            <Button type="submit">입력 확인</Button>
        </form>
    );
}

function SelectPreview() {
    const [role, setRole] = useState("");
    const [submitted, setSubmitted] = useState<string | null>(null);
    const [tried, setTried] = useState(false);

    return (
        <form
            className="preview-stack"
            onSubmit={(event) => {
                event.preventDefault();
                setTried(true);
                setSubmitted(String(new FormData(event.currentTarget).get("role") ?? ""));
            }}
        >
            <Field
                label="담당 역할"
                error={tried && !role ? "역할을 선택하세요." : undefined}
                required
            >
                {(control) => (
                    <Select name="role" value={role} onValueChange={(value) => {
                        setRole(value);
                        setSubmitted(null);
                        setTried(false);
                    }}>
                        <SelectTrigger {...control}>
                            <SelectValue placeholder="역할 선택" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="reviewer">검토자</SelectItem>
                            <SelectItem value="editor">편집자</SelectItem>
                        </SelectContent>
                    </Select>
                )}
            </Field>
            <Button type="submit">폼 값 확인</Button>
            <p role="status">
                {submitted === null ? "아직 제출하지 않았습니다." :
                    submitted ? `제출한 값: ${submitted}` : "선택한 값이 없습니다."}
            </p>
        </form>
    );
}

function DatePickerPreview() {
    const [date, setDate] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState<string | null>(null);
    const [tried, setTried] = useState(false);

    return (
        <form
            className="preview-stack"
            onSubmit={(event) => {
                event.preventDefault();
                setTried(true);
                setSubmitted(String(new FormData(event.currentTarget).get("date") ?? ""));
            }}
        >
            <Field
                label="검토일"
                error={tried && !date ? "날짜를 선택하세요." : undefined}
                required
            >
                {(control) => (
                    <DatePicker
                        {...control}
                        name="date"
                        value={date}
                        onValueChange={(value) => {
                            setDate(value);
                            setSubmitted(null);
                            setTried(false);
                        }}
                        calendarLocale={ko}
                        required
                    />
                )}
            </Field>
            <Button type="submit">폼 값 확인</Button>
            <p role="status">
                {submitted === null ? "아직 제출하지 않았습니다." :
                    submitted ? `제출한 값: ${submitted}` : "선택한 값이 없습니다."}
            </p>
        </form>
    );
}

function MonthPickerPreview() {
    const [month, setMonth] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState<string | null>(null);
    const [tried, setTried] = useState(false);

    return (
        <form className="preview-stack" onSubmit={(event) => {
            event.preventDefault();
            setTried(true);
            setSubmitted(String(new FormData(event.currentTarget)
                .get("reportMonth") ?? ""));
        }}>
            <Field label="보고 월" required
                error={tried && !month ? "월을 선택하세요." : undefined}>
                {(control) => <MonthPicker {...control} name="reportMonth"
                    value={month} min="2025-11" max="2027-03"
                    onValueChange={(next) => {
                        setMonth(next);
                        setSubmitted(null);
                        setTried(false);
                    }} required />}
            </Field>
            <div className="flex gap-2">
                <Button type="submit">폼 값 확인</Button>
                <Button type="button" variant="outline" onClick={() => {
                    setMonth(null);
                    setSubmitted(null);
                    setTried(false);
                }}>초기화</Button>
            </div>
            <p role="status">
                {submitted === null ? "아직 제출하지 않았습니다." :
                    submitted ? `제출한 월: ${submitted}` :
                        "선택한 월이 없습니다."}
            </p>
        </form>
    );
}

function CalendarSchedulerPreview() {
    const [date, setDate] = useState("2026-10-07");
    const [events, setEvents] = useState<CalendarSchedule[]>([
        { id: "review", date: "2026-10-07", title: "권한 검토",
            startTime: "09:00", endTime: "09:30" },
        { id: "planning", date: "2026-10-07", title: "주간 계획",
            startTime: "14:00", description: "다음 릴리스 범위 확인" },
        { id: "report", date: "2026-10-12", title: "월간 보고" },
    ]);
    const [nextId, setNextId] = useState(1);
    const [lastAction, setLastAction] = useState("날짜나 일정을 선택하세요.");

    return (
        <div className="preview-workspace grid gap-3">
            <CalendarScheduler label="팀 일정" initialDate="2026-10-07"
                selectedDate={date} onSelectedDateChange={(nextDate) => {
                    setDate(nextDate);
                    setLastAction(`${nextDate} 선택`);
                }}
                events={events} timeZone="Asia/Seoul" calendarLocale={ko}
                onEventSelect={(event) =>
                    setLastAction(`${event.title} 선택`)}
                onCreateEvent={(selectedDate) => {
                    setEvents((current) => [...current, {
                        id: `draft-${nextId}`, date: selectedDate,
                        title: `새 일정 ${nextId}`,
                    }]);
                    setNextId((current) => current + 1);
                    setLastAction(`${selectedDate}에 일정 추가`);
                }} />
            <p role="status" className="m-0 text-sm">
                선택 날짜: {date} · {lastAction}
            </p>
        </div>
    );
}

function CodeEditorShellPreview() {
    const initialQuery = "SELECT request_id, status\nFROM requests;";
    const [query, setQuery] = useState(initialQuery);
    const [variant, setVariant] = useState<"panel" | "flat">("panel");
    const [submitted, setSubmitted] = useState("실행 전");

    return (
        <form className="preview-stack min-w-0" onSubmit={(event) => {
            event.preventDefault();
            const value = new FormData(event.currentTarget).get("query");
            setSubmitted(value === query ? `제출: ${query.split("\n").length}줄`
                : "제출 값이 다릅니다.");
        }} onReset={() => {
            setQuery(initialQuery);
            setSubmitted("실행 전");
        }}>
            <div className="flex flex-wrap gap-2">
                <Button type="button"
                    variant={variant === "panel" ? "primary" : "outline"}
                    onClick={() => setVariant("panel")}>Panel</Button>
                <Button type="button"
                    variant={variant === "flat" ? "primary" : "outline"}
                    onClick={() => setVariant("flat")}>Flat</Button>
                <Button type="reset" variant="ghost">초기화</Button>
            </div>
            <CodeEditorShell label="요청 조회 쿼리" language="SQL"
                description="일반 텍스트 편집기이며 구문 강조는 제공하지 않습니다."
                value={query} onValueChange={setQuery} name="query"
                rows={5} required variant={variant}
                error={query.trim() ? undefined : "쿼리를 입력하세요."}
                actions={<Button type="submit">값 확인</Button>} />
            <p role="status" className="m-0 text-sm">{submitted}</p>
        </form>
    );
}

function CopyButtonPreview() {
    const [value, setValue] = useState("REQ-2048");
    return <div className="preview-stack">
        <label className="grid gap-1 text-sm">
            복사할 요청 ID
            <Input value={value} onChange={(event) =>
                setValue(event.target.value)} />
        </label>
        <div className="flex flex-wrap items-center gap-3">
            <CopyButton value={value} label="요청 ID 복사" />
            <CopyButton value={value} label="요청 ID 텍스트 복사"
                appearance="text" />
        </div>
    </div>;
}

function ActionBarPreview() {
    const items = [
        { id: "req-1", label: "월간 보고서" },
        { id: "req-2", label: "접근 권한" },
        { id: "req-3", label: "알림 설정" },
    ];
    const [selected, setSelected] = useState<string[]>([]);
    const [placement, setPlacement] = useState<"inline" | "floating">(
        "inline",
    );
    const [lastAction, setLastAction] = useState("없음");
    const firstItem = useRef<HTMLInputElement>(null);

    function clearSelection() {
        setSelected([]);
        firstItem.current?.focus();
    }

    return <div className="preview-stack">
        <div className="flex flex-wrap gap-2">
            <Button variant={placement === "inline" ? "primary" : "outline"}
                onClick={() => setPlacement("inline")}>Inline</Button>
            <Button variant={placement === "floating" ? "primary" : "outline"}
                onClick={() => setPlacement("floating")}>Floating</Button>
        </div>
        <div className="grid gap-2 rounded-sm border border-border p-3">
            {items.map((item, index) => <label key={item.id}
                className="flex items-center gap-2 text-sm">
                <input ref={index === 0 ? firstItem : undefined}
                    type="checkbox" checked={selected.includes(item.id)}
                    onChange={(event) => setSelected((current) =>
                        event.target.checked
                            ? [...current, item.id]
                            : current.filter((id) => id !== item.id))} />
                {item.label}
            </label>)}
        </div>
        {selected.length > 0 && <ActionBar aria-label="요청 선택 작업"
            selectedCount={selected.length} placement={placement}
            onClear={clearSelection}>
            <Button variant="outline" onClick={() => {
                setLastAction(`${selected.length}건 보관`);
                clearSelection();
            }}>보관</Button>
        </ActionBar>}
        <p role="status" className="text-sm">마지막 작업: {lastAction}</p>
    </div>;
}

function YearPickerPreview() {
    const [year, setYear] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState<string | null>(null);
    const [tried, setTried] = useState(false);

    return (
        <form className="preview-stack" onSubmit={(event) => {
            event.preventDefault();
            setTried(true);
            setSubmitted(String(new FormData(event.currentTarget)
                .get("reportYear") ?? ""));
        }}>
            <Field label="보고 연도" required
                description="2022년부터 2033년까지 선택할 수 있습니다."
                error={tried && !year ? "연도를 선택하세요." : undefined}>
                {(control) => <YearPicker {...control} name="reportYear"
                    value={year} min="2022" max="2033"
                    onValueChange={(next) => {
                        setYear(next);
                        setSubmitted(null);
                        setTried(false);
                    }} required />}
            </Field>
            <div className="flex gap-2">
                <Button type="submit">폼 값 확인</Button>
                <Button type="button" variant="outline" onClick={() => {
                    setYear(null);
                    setSubmitted(null);
                    setTried(false);
                }}>초기화</Button>
            </div>
            <p role="status">
                {submitted === null ? "아직 제출하지 않았습니다." :
                    submitted ? `제출한 연도: ${submitted}` :
                        "선택한 연도가 없습니다."}
            </p>
        </form>
    );
}

function CardPreview() {
    const [variant, setVariant] = useState<
        "default" | "subtle" | "elevated"
    >("default");
    const [size, setSize] = useState<"default" | "compact">("default");

    return (
        <div className="preview-stack">
            <div className="flex flex-wrap gap-2" role="group"
                aria-label="카드 표면">
                {(["default", "subtle", "elevated"] as const).map((option) => (
                    <Button key={option} type="button"
                        variant={variant === option ? "primary" : "outline"}
                        aria-pressed={variant === option}
                        onClick={() => setVariant(option)}>
                        {option}
                    </Button>
                ))}
            </div>
            <div className="flex flex-wrap gap-2" role="group"
                aria-label="카드 밀도">
                {(["default", "compact"] as const).map((option) => (
                    <Button key={option} type="button"
                        variant={size === option ? "primary" : "outline"}
                        aria-pressed={size === option}
                        onClick={() => setSize(option)}>
                        {option}
                    </Button>
                ))}
            </div>
            <Card variant={variant} size={size}>
                <CardHeader>
                    <CardTitle>검토 대기</CardTitle>
                    <CardDescription>새 component 3개</CardDescription>
                </CardHeader>
                <CardContent>등록 전 확인이 필요합니다.</CardContent>
                <CardFooter><Badge>검토 대기</Badge></CardFooter>
            </Card>
        </div>
    );
}

function DateRangePickerPreview() {
    const [range, setRange] = useState<DateRangeValue>(null);
    const [submitted, setSubmitted] = useState<string | null>(null);
    const [tried, setTried] = useState(false);

    return (
        <form className="preview-stack" onSubmit={(event) => {
            event.preventDefault();
            setTried(true);
            const data = new FormData(event.currentTarget);
            const start = String(data.get("periodStart") ?? "");
            const end = String(data.get("periodEnd") ?? "");
            setSubmitted(start && end ? `${start} — ${end}` : "");
        }}>
            <Field label="조회 기간"
                error={tried && !range?.to ? "시작일과 종료일을 선택하세요." : undefined}
                required>
                {(control) => (
                    <DateRangePicker {...control}
                        startName="periodStart" endName="periodEnd"
                        value={range} onValueChange={(next) => {
                            setRange(next);
                            setSubmitted(null);
                            setTried(false);
                        }}
                        calendarLocale={ko}
                    />
                )}
            </Field>
            <Button type="submit">기간 적용</Button>
            <p role="status">
                {submitted === null ? "아직 적용하지 않았습니다." :
                    submitted ? `제출한 기간: ${submitted}` :
                        "완료된 기간이 없습니다."}
            </p>
        </form>
    );
}

function TimePickerPreview() {
    const [time, setTime] = useState<string | null>(null);
    const [cycle, setCycle] = useState<"h12" | "h23">("h23");
    const [submitted, setSubmitted] = useState<string | null>(null);

    return (
        <div className="preview-stack">
            <div className="flex gap-2">
                <Button type="button" variant={cycle === "h23"
                    ? "primary" : "outline"} onClick={() => setCycle("h23")}
                >24시간제</Button>
                <Button type="button" variant={cycle === "h12"
                    ? "primary" : "outline"} onClick={() => setCycle("h12")}
                >12시간제</Button>
            </div>
            <form className="grid w-full gap-3" onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(String(new FormData(event.currentTarget)
                    .get("reviewTime") ?? ""));
            }}>
                <TimePicker label="검토 시각" name="reviewTime"
                    value={time} onValueChange={(next) => {
                        setTime(next);
                        setSubmitted(null);
                    }}
                    locale="ko-KR" hourCycle={cycle} minuteStep={5}
                    required />
                <Button type="submit">시각 확인</Button>
            </form>
            <p role="status">제출 값: {submitted ?? "없음"}</p>
        </div>
    );
}

function DateTimePickerPreview() {
    const [value, setValue] = useState<DateTimeSelection>({
        date: null, time: null,
    });
    const [submitted, setSubmitted] = useState<string | null>(null);
    const [error, setError] = useState(false);

    return (
        <form className="preview-stack" onSubmit={(event) => {
            event.preventDefault();
            if (!value.date || !value.time) {
                setError(true);
                return;
            }
            const data = new FormData(event.currentTarget);
            setSubmitted(
                `${data.get("startsAt")} · ${data.get("startsAtTimeZone")}`,
            );
            setError(false);
        }}>
            <DateTimePicker label="예약 시작" name="startsAt"
                value={value} onValueChange={(next) => {
                    setValue(next);
                    setSubmitted(null);
                    setError(false);
                }}
                timeZone="Asia/Seoul" calendarLocale={ko}
                hourCycle="h23" minuteStep={5} />
            <Button type="submit">예약 값 확인</Button>
            {error && <p role="alert">날짜와 시각을 선택하세요.</p>}
            <p role="status">제출 값: {submitted ?? "없음"}</p>
        </form>
    );
}

function ImageCropperPreview() {
    const [file, setFile] = useState<File | null>(null);
    const [result, setResult] = useState<Blob | null>(null);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [sampleError, setSampleError] = useState("");
    const [aspectRatio, setAspectRatio] = useState(1);

    useEffect(() => {
        const controller = new AbortController();
        fetch("/favicon.png", { signal: controller.signal })
            .then((response) => {
                if (!response.ok) throw new Error("샘플 이미지를 읽지 못했습니다.");
                return response.blob();
            })
            .then((blob) => setFile((current) => current ??
                new File([blob], "pydemia-ui.png", { type: "image/png" })))
            .catch((error) => {
                if (!controller.signal.aborted) {
                    setSampleError(error instanceof Error
                        ? error.message : "샘플 이미지를 읽지 못했습니다.");
                }
            });
        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (!result) {
            setResultUrl(null);
            return;
        }
        const url = URL.createObjectURL(result);
        setResultUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [result]);

    return (
        <div className="preview-workspace grid max-w-xl gap-3">
            <Dropzone label="자를 이미지 선택"
                description="PNG, JPEG 또는 WebP 이미지"
                accept={{
                    "image/png": [".png"],
                    "image/jpeg": [".jpg", ".jpeg"],
                    "image/webp": [".webp"],
                }}
                onFilesSelected={(files) => {
                    setFile(files[0]);
                    setResult(null);
                }} />
            {sampleError && <p role="status">{sampleError}</p>}
            <div role="group" aria-label="자르기 비율"
                className="flex flex-wrap gap-2">
                {[{ label: "정사각형 1:1", ratio: 1 },
                    { label: "가로 16:9", ratio: 16 / 9 }].map((option) => (
                    <Button key={option.label}
                        variant={aspectRatio === option.ratio
                            ? "primary" : "outline"}
                        aria-pressed={aspectRatio === option.ratio}
                        onClick={() => {
                            setAspectRatio(option.ratio);
                            setResult(null);
                        }}>
                        {option.label}
                    </Button>
                ))}
            </div>
            <ImageCropper file={file} label="이미지 자르기"
                alt={file ? `${file.name} 자르기 미리보기`
                    : "이미지 자르기 미리보기"}
                aspectRatio={aspectRatio} outputWidth={256}
                onCrop={setResult} />
            {resultUrl && (
                <div className="grid gap-2">
                    <strong className="text-sm">잘린 결과</strong>
                    <img src={resultUrl} alt="잘린 이미지 결과"
                        className="size-28 rounded-sm border border-border" />
                    <span role="status" className="text-xs text-muted">
                        PNG 결과 {result?.size ?? 0}바이트
                    </span>
                </div>
            )}
        </div>
    );
}

function AvatarUploaderPreview() {
    const [change, setChange] = useState<Blob | null | undefined>(undefined);

    return (
        <div className="preview-workspace grid max-w-xl gap-3">
            <AvatarUploader label="프로필 사진" alt="김하나의 프로필 사진"
                fallback="김" src={`${import.meta.env.BASE_URL}avatar-demo.svg`}
                maxBytes={5 * 1024 * 1024} outputWidth={256}
                onImageChange={setChange} />
            <p role="status" className="m-0 text-sm text-muted">
                {change === undefined ? "변경 없음" : change === null
                    ? "사진 제거 요청" : `PNG ${change.size}바이트 준비됨`}
            </p>
        </div>
    );
}

function FileUploadPreview() {
    const nextId = useRef(0);
    const [items, setItems] = useState<FileUploadItem[]>([
        { id: "report", name: "quarterly-report.csv",
            status: "uploading", progress: 40 },
        { id: "notes", name: "review-notes.txt", status: "failed",
            error: "연결이 끊어졌습니다." },
    ]);

    function updateItem(id: string, patch: Partial<FileUploadItem>) {
        setItems((current) => current.map((item) =>
            item.id === id ? { ...item, ...patch } : item,
        ));
    }

    function advance() {
        setItems((current) => current.map((item) => {
            if (item.status !== "uploading") return item;
            const progress = Math.min(100, (item.progress ?? 0) + 25);
            return { ...item, progress,
                status: progress === 100 ? "completed" : "uploading" };
        }));
    }

    return (
        <div className="preview-workspace grid gap-3">
            <FileUpload
                label="파일 추가"
                description="텍스트 또는 CSV, 한 번에 최대 2개"
                accept={{ "text/plain": [".txt"],
                    "text/csv": [".csv"] }}
                maxFiles={2}
                items={items}
                onFilesSelected={(files) => setItems((current) => [
                    ...current,
                    ...files.map((file) => ({
                        id: `selected-${nextId.current++}`,
                        name: file.name,
                        status: "pending" as const,
                    })),
                ])}
                onCancel={(id) => updateItem(id, { status: "canceled" })}
                onRetry={(id) => updateItem(id,
                    { status: "uploading", progress: 0, error: undefined })}
                onRemove={(id) => setItems((current) =>
                    current.filter((item) => item.id !== id))}
            />
            <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() =>
                    setItems((current) => current.map((item) =>
                        item.status === "pending"
                            ? { ...item, status: "uploading", progress: 0 }
                            : item,
                    ))}>
                    대기 파일 시작
                </Button>
                <Button variant="outline" onClick={advance}>
                    진행 +25%
                </Button>
                <Button variant="outline" onClick={() => {
                    const uploading = items.find((item) =>
                        item.status === "uploading");
                    if (uploading) updateItem(uploading.id,
                        { status: "failed", error: "연결이 끊어졌습니다." });
                }}>
                    전송 실패
                </Button>
            </div>
        </div>
    );
}

const masterDetailRequests = [
    {
        id: "invoice-1042", title: "청구서 발행 확인",
        description: "9월 청구서의 수신 주소를 검토합니다.",
        meta: "재무 · 오늘",
    },
    {
        id: "access-238", title: "접근 권한 요청",
        description: "프로젝트 분석 화면의 편집 권한입니다.",
        meta: "관리 · 어제",
    },
    {
        id: "report-731", title: "주간 보고서 검토",
        description: "새 지표의 표시 단위를 확인합니다.",
        meta: "분석 · 2일 전",
    },
];

function MasterDetailPreview() {
    const [selectedId, setSelectedId] = useState<string | null>(
        "invoice-1042",
    );
    const [reviewedIds, setReviewedIds] = useState<string[]>([]);

    return (
        <div className="preview-workspace">
            <MasterDetail
                label="검토 요청"
                items={masterDetailRequests}
                selectedId={selectedId}
                onSelectedIdChange={setSelectedId}
                className="min-h-80"
                renderDetail={(item) => (
                    <div className="grid gap-[var(--space-3)] text-sm">
                        <div>
                            <h3 className="m-0 text-base font-semibold">
                                {item.title}
                            </h3>
                            <p className="mt-1 text-muted">{item.meta}</p>
                        </div>
                        <p className="m-0">{item.description}</p>
                        <Button
                            variant="outline"
                            disabled={reviewedIds.includes(item.id)}
                            onClick={() => setReviewedIds((current) =>
                                [...current, item.id])}
                        >
                            {reviewedIds.includes(item.id)
                                ? "검토 완료" : "검토 완료로 표시"}
                        </Button>
                        <p role="status" className="m-0 text-xs text-muted">
                            {reviewedIds.includes(item.id)
                                ? "이 요청을 검토했습니다."
                                : "검토 대기 중입니다."}
                        </p>
                    </div>
                )}
            />
        </div>
    );
}

function AppShellPreview() {
    const [appearance, setAppearance] = useState<"framed" | "canvas">(
        "framed",
    );
    const [bubbleAppearance, setBubbleAppearance] = useState<
        "circle" | "pill"
    >("circle");
    const [floatingSide, setFloatingSide] = useState<"left" | "right">(
        "right",
    );
    return (
        <div className="preview-workspace grid gap-3">
            <div className="flex flex-wrap gap-2">
                <div role="group" aria-label="화면 골격 표시"
                    className="flex gap-2">
                    {(["framed", "canvas"] as const).map((option) => (
                        <Button key={option} variant={
                            appearance === option ? "primary" : "outline"
                        } aria-pressed={appearance === option}
                            onClick={() => setAppearance(option)}>
                            {option}
                        </Button>
                    ))}
                </div>
                <div role="group" aria-label="도움말 버튼 표시"
                    className="flex gap-2">
                    {(["circle", "pill"] as const).map((option) => (
                        <Button key={option} variant={
                            bubbleAppearance === option
                                ? "primary" : "outline"
                        } aria-pressed={bubbleAppearance === option}
                            onClick={() => setBubbleAppearance(option)}>
                            {option}
                        </Button>
                    ))}
                </div>
                <div role="group" aria-label="도움말 위치"
                    className="flex gap-2">
                    {(["left", "right"] as const).map((option) => (
                        <Button key={option} variant={
                            floatingSide === option ? "primary" : "outline"
                        } aria-pressed={floatingSide === option}
                            onClick={() => setFloatingSide(option)}>
                            {option}
                        </Button>
                    ))}
                </div>
            </div>
            <AppShell appearance={appearance} className="min-h-72">
                <AppHeader>
                    <strong className="text-sm">Workspace</strong>
                    <GlobalNav aria-label="작업 공간 상단 탐색" className="ml-auto">
                        <GlobalNavLink href="#overview" aria-current="page">
                            개요
                        </GlobalNavLink>
                        <GlobalNavLink href="#examples">예시</GlobalNavLink>
                    </GlobalNav>
                </AppHeader>
                <AppBody>
                    <AppSidebar aria-label="프로젝트 탐색" className="@3xl:w-28">
                        <SideNav aria-label="프로젝트">
                            <SideNavLink href="#overview" aria-current="page">
                                대시보드
                            </SideNavLink>
                            <SideNavLink href="#components">목록</SideNavLink>
                        </SideNav>
                    </AppSidebar>
                    <AppMain as="div">
                        <h3 className="m-0 text-sm font-semibold">프로젝트 현황</h3>
                        <div className="mt-3 grid gap-2">
                            <MetricCard label="검토 항목" value="12" />
                            <div className={
                                "rounded-sm border border-border bg-surface p-3"
                            }>
                                <span className="text-xs text-muted">7일 추세</span>
                                <Sparkline label="7일 검토 항목 추세"
                                    values={[4, 6, 5, 8, 7, 10, 12]} />
                            </div>
                        </div>
                    </AppMain>
                    <AppSidebar side="right" aria-label="상세 정보"
                        className="@3xl:w-24">
                        <p className="m-0 text-xs text-muted">이번 주 변경 3건</p>
                    </AppSidebar>
                </AppBody>
                <Collapsible defaultOpen>
                    <AppBottomPanel aria-label="프로젝트 작업 상태" className={
                        floatingSide === "left"
                            ? "pl-28 text-xs" : "pr-28 text-xs"
                    }>
                        <CollapsibleTrigger asChild>
                            <Button variant="ghost">작업 상태</Button>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="mt-2 pb-1 text-xs">
                            <p className="m-0">모든 변경 사항이 저장되었습니다.</p>
                            <p className="m-0 mt-1 text-muted">
                                마지막 검토: 10:42 · 변경 3건
                            </p>
                        </CollapsibleContent>
                    </AppBottomPanel>
                </Collapsible>
                <AppFloatingDisclosure
                    appearance={bubbleAppearance}
                    side={floatingSide}
                    label="도움말" panelClassName="w-40 text-xs">
                    <p className="m-0">도움말 패널입니다.</p>
                </AppFloatingDisclosure>
            </AppShell>
        </div>
    );
}

function ScrollAreaPreview() {
    const events = Array.from({ length: 16 }, (_, index) =>
        `작업 ${String(index + 1).padStart(2, "0")} · 검토 완료`,
    );

    return (
        <div className="grid w-full max-w-md gap-4">
            <ScrollArea label="최근 작업" type="always"
                className="h-44 rounded-sm border border-border bg-surface">
                <ol className="m-0 space-y-2 p-3 text-sm text-foreground">
                    {events.map((event) => <li key={event}>{event}</li>)}
                </ol>
            </ScrollArea>
            <ScrollArea label="기간별 지표" orientation="horizontal"
                type="always"
                className="h-24 rounded-sm border border-border bg-surface">
                <div className="flex w-max gap-2 p-3">
                    {["월", "화", "수", "목", "금", "토", "일"].map(
                        (day, index) => (
                            <div key={day} className={
                                "w-20 rounded-sm border border-border " +
                                "bg-surface-subtle p-2 text-xs"
                            }>
                                <span className="text-muted">{day}</span>
                                <strong className="mt-1 block text-foreground">
                                    {index + 4}건
                                </strong>
                            </div>
                        ),
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}

function ResizablePanelsPreview() {
    const [size, setSize] = useState(42);
    const [orientation, setOrientation] = useState<"horizontal" | "vertical">(
        "horizontal",
    );

    return (
        <div className="preview-workspace grid gap-3">
            <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" onClick={() => setOrientation(
                    (value) => value === "horizontal" ? "vertical" : "horizontal",
                )}>
                    {orientation === "horizontal" ? "상하 배치" : "좌우 배치"}
                </Button>
                <span role="status" className="text-xs text-muted">
                    첫 패널 {size}%
                </span>
            </div>
            <ResizablePanels
                firstLabel="작업 목록"
                secondLabel="선택한 작업"
                first={<div className="text-sm">
                    <strong>작업 목록</strong>
                    <p className="text-muted">항목을 선택해 내용을 확인합니다.</p>
                </div>}
                second={<div className="text-sm">
                    <strong>선택한 작업</strong>
                    <p className="text-muted">구분선을 끌어 영역을 조절하세요.</p>
                </div>}
                orientation={orientation}
                size={size}
                minSize={20}
                maxSize={80}
                onSizeChange={setSize}
                className="h-60"
            />
        </div>
    );
}

function SidebarPreview() {
    const [active, setActive] = useState("overview");
    const [side, setSide] = useState<"left" | "right">("left");
    const [grouped, setGrouped] = useState(false);
    const items = [
        { id: "overview", label: "개요", href: "#components",
            icon: <Gauge size={16} />, current: active === "overview" },
        { id: "files", label: "파일", href: "#components",
            icon: <FolderOpen size={16} />, current: active === "files" },
        { id: "settings", label: "설정", href: "#components",
            icon: <Settings2 size={16} />, current: active === "settings" },
    ];
    const sections = [
        { id: "work", label: "작업", items: items.slice(0, 2) },
        { id: "manage", label: "관리", items: items.slice(2) },
    ];
    const activeLabel = items.find((item) => item.id === active)?.label;
    const content = grouped ? { sections } : { items };

    return (
        <div className="preview-workspace @container grid gap-3">
            <div className="flex flex-wrap gap-2">
                <Button variant="outline"
                    onClick={() => setSide((value) =>
                        value === "left" ? "right" : "left"
                    )}>
                    {side === "left" ? "오른쪽 배치" : "왼쪽 배치"}
                </Button>
                <Button variant="outline" aria-pressed={grouped}
                    onClick={() => setGrouped((value) => !value)}>
                    {grouped ? "단일 목록" : "섹션별 보기"}
                </Button>
            </div>
            <div className={
                "flex min-h-72 flex-col overflow-hidden rounded-sm " +
                "border border-border bg-background @3xl:flex-row"
            }>
                <Sidebar label="프로젝트 탐색" {...content} side={side}
                    onNavigate={setActive} />
                <div className="min-w-0 flex-1 p-[var(--space-4)]">
                    <h3 className="m-0 text-sm font-semibold">작업 공간</h3>
                    <p className="mt-2 text-sm text-muted">
                        탐색 항목을 선택하거나 측면 영역을 접어 보세요.
                    </p>
                    <p role="status" className="text-xs text-muted">
                        현재 영역: {activeLabel}
                    </p>
                </div>
            </div>
        </div>
    );
}

function TreePreview() {
    const [selectedId, setSelectedId] = useState<string | null>("overview");
    const [expandedIds, setExpandedIds] = useState(["workspace", "src"]);
    const [remoteState, setRemoteState] = useState<
        "unloaded" | "loading" | "error" | "loaded"
    >("unloaded");
    const [requestCount, setRequestCount] = useState(0);
    const remoteNode: TreeNode = remoteState === "loaded"
        ? { id: "remote", label: "Remote", children: [
            { id: "remote-report", label: "Report.csv" },
        ] }
        : remoteState === "error"
            ? { id: "remote", label: "Remote", childState: "error",
                errorMessage: "파일 목록을 불러오지 못했습니다." }
            : { id: "remote", label: "Remote", childState: remoteState };
    const items: TreeNode[] = [
        { id: "workspace", label: "Workspace", children: [
            { id: "overview", label: "Overview.md" },
            { id: "src", label: "src", children: [
                { id: "app", label: "App.tsx" },
                { id: "routes", label: "Routes.tsx" },
            ] },
        ] },
        { id: "research", label: "Research", children: [
            { id: "inventory", label: "Source inventory.md" },
            { id: "verification", label: "Verification.md" },
        ] },
        remoteNode,
        { id: "archive", label: "Archive", disabled: true,
            children: [{ id: "old", label: "Old report.md" }] },
    ];
    const labels: Record<string, string> = {
        workspace: "Workspace", overview: "Overview.md", src: "src",
        app: "App.tsx", routes: "Routes.tsx", research: "Research",
        inventory: "Source inventory.md", verification: "Verification.md",
        remote: "Remote", "remote-report": "Report.csv",
    };
    const selectedLabel = selectedId === null ? "없음" : labels[selectedId];

    return (
        <div className="preview-workspace grid max-w-sm gap-3">
            <Tree label="작업 파일" items={items} selectedId={selectedId}
                onSelectedIdChange={setSelectedId}
                expandedIds={expandedIds}
                onExpandedIdsChange={setExpandedIds}
                onLoadChildren={() => {
                    setRequestCount((count) => count + 1);
                    setRemoteState("loading");
                }} />
            {remoteState === "loading" && (
                <div className="flex flex-wrap gap-2">
                    <Button variant="outline" type="button"
                        onClick={() => setRemoteState("error")}>응답 실패</Button>
                    <Button type="button"
                        onClick={() => setRemoteState("loaded")}>응답 완료</Button>
                </div>
            )}
            <p role="status" className="m-0 text-xs text-muted">
                선택한 항목: {selectedLabel} · Remote 요청: {requestCount}회
            </p>
        </div>
    );
}

const treeNavPages: TreeNavItem[] = [
    { id: "overview", label: "개요", href: "#tree-nav-overview" },
    { id: "projects", label: "프로젝트", children: [
        { id: "atlas", label: "Atlas", href: "#tree-nav-atlas",
            children: [
                { id: "atlas-builds", label: "빌드 기록",
                    href: "#tree-nav-atlas-builds" },
                { id: "atlas-files", label: "파일",
                    href: "#tree-nav-atlas-files" },
            ] },
        { id: "beacon", label: "Beacon", href: "#tree-nav-beacon" },
    ] },
    { id: "settings", label: "설정", href: "#tree-nav-settings",
        children: [
            { id: "members", label: "구성원", href: "#tree-nav-members" },
            { id: "billing", label: "결제", href: "#tree-nav-billing" },
        ] },
];

function TreeNavPreview() {
    const [currentId, setCurrentId] = useState("atlas-builds");
    const [variant, setVariant] = useState<"rail" | "filled">("rail");
    const labels: Record<string, string> = {
        overview: "개요", atlas: "Atlas", "atlas-builds": "빌드 기록",
        "atlas-files": "파일", beacon: "Beacon", settings: "설정",
        members: "구성원", billing: "결제",
    };

    return (
        <div className="preview-stack">
            <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setVariant(
                    variant === "rail" ? "filled" : "rail",
                )}>
                    표시: {variant === "rail" ? "선형" : "채움형"}
                </Button>
                <Button variant="outline"
                    onClick={() => setCurrentId("billing")}>
                    설정 경로 열기
                </Button>
            </div>
            <div className="grid min-w-0 gap-4">
                <TreeNav label="프로젝트 페이지" items={treeNavPages}
                    currentId={currentId} variant={variant}
                    onNavigate={setCurrentId} />
                <section aria-label="선택한 페이지"
                    className={
                        "min-h-40 rounded-sm border border-border " +
                        "bg-surface p-4"
                    }>
                    <h3 className="m-0 text-base font-semibold">
                        {labels[currentId]}
                    </h3>
                    <p role="status" className="text-sm text-muted">
                        현재 페이지: {labels[currentId]}
                    </p>
                </section>
            </div>
        </div>
    );
}

const organizationItems: TreeSelectItem[] = [
    { id: "product", label: "제품", children: [
        { id: "design", label: "디자인" },
        { id: "frontend", label: "프론트엔드" },
    ] },
    { id: "operations", label: "운영", children: [
        { id: "support", label: "고객 지원" },
        { id: "finance", label: "재무", disabled: true },
    ] },
];

function TreeSelectPreview() {
    const [submitted, setSubmitted] = useState<string | null>(null);
    return (
        <form className="preview-workspace grid max-w-sm gap-3"
            onReset={() => setSubmitted(null)}
            onSubmit={(event) => {
                event.preventDefault();
                setSubmitted(String(new FormData(event.currentTarget)
                    .get("team") ?? ""));
            }}>
            <TreeSelect label="담당 조직" name="team"
                items={organizationItems} required
                requiredMessage="담당 조직을 선택하세요." />
            <div className="flex gap-2">
                <Button type="submit">제출</Button>
                <Button type="reset" variant="outline">초기화</Button>
            </div>
            <p role="status" className="m-0 text-xs text-muted">
                제출한 값: {submitted ?? "없음"}
            </p>
        </form>
    );
}

function StepperPreview() {
    const [currentIndex, setCurrentIndex] = useState(1);
    const [completedIds, setCompletedIds] = useState(["details"]);
    const [orientation, setOrientation] = useState<"horizontal" | "vertical">(
        "horizontal",
    );
    const [showError, setShowError] = useState(false);
    const steps = [
        { id: "details", label: "기본 정보", description: "이름과 설명" },
        { id: "review", label: "검토", description: "설정 확인" },
        { id: "publish", label: "게시", description: "최종 제출" },
    ];

    return (
        <div className="preview-workspace grid gap-4">
            <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setOrientation(
                    (value) => value === "horizontal" ? "vertical" : "horizontal",
                )}>
                    {orientation === "horizontal" ? "세로 배치" : "가로 배치"}
                </Button>
                <Button variant="outline" onClick={() => {
                    if (!showError) {
                        setCompletedIds((value) =>
                            value.filter((id) => id !== "review")
                        );
                    }
                    setShowError(!showError);
                }}>
                    {showError ? "오류 숨기기" : "오류 표시"}
                </Button>
                <Button onClick={() => {
                    setCompletedIds((value) => Array.from(new Set([
                        ...value, steps[currentIndex].id,
                    ])));
                    setCurrentIndex((value) =>
                        Math.min(value + 1, steps.length - 1)
                    );
                }} disabled={currentIndex === steps.length - 1 ||
                    (showError && steps[currentIndex].id === "review")}>
                    다음 단계
                </Button>
            </div>
            <Stepper aria-label="게시 절차" steps={steps}
                currentIndex={currentIndex}
                completedStepIds={completedIds}
                errorStepIds={showError ? ["review"] : []}
                orientation={orientation}
                navigation="completed"
                onStepChange={setCurrentIndex} />
            <p role="status" className="m-0 text-xs text-muted">
                현재 단계: {steps[currentIndex].label}
            </p>
        </div>
    );
}

function FormWizardPreview() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [saved, setSaved] = useState<string | null>(null);
    const [orientation, setOrientation] = useState<
        "horizontal" | "vertical"
    >("vertical");
    const [appearance, setAppearance] = useState<"panel" | "plain">(
        "panel",
    );
    const steps = [
        { id: "title", label: "기본 정보",
            description: "이름은 세 글자 이상 입력하세요.",
            content: <Field label="요청 이름" required>
                {(control) => <Input {...control} required value={title}
                    onChange={(event) => {
                        setTitle(event.target.value);
                        setSaved(null);
                    }} />}
            </Field> },
        { id: "description", label: "설명",
            content: <Field label="검토 내용">
                {(control) => <Textarea {...control} rows={3}
                    value={description} onChange={(event) => {
                        setDescription(event.target.value);
                        setSaved(null);
                    }} />}
            </Field> },
        { id: "confirm", label: "확인",
            content: <div className="grid gap-1 text-sm">
                <p className="m-0">요청: {title}</p>
                <p className="m-0">설명: {description || "없음"}</p>
            </div> },
    ];

    return <div className="preview-workspace grid gap-3">
        <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={() => setOrientation(
                (value) => value === "horizontal" ? "vertical" :
                    "horizontal",
            )}>
                {orientation === "horizontal" ? "세로 배치" : "가로 배치"}
            </Button>
            <Button variant="outline" onClick={() => setAppearance(
                (value) => value === "panel" ? "plain" : "panel",
            )}>
                {appearance === "panel" ? "Plain" : "Panel"}
            </Button>
        </div>
        <FormWizard label="화면 개선 요청" steps={steps}
            currentIndex={currentIndex} onStepChange={setCurrentIndex}
            orientation={orientation} appearance={appearance}
            validateStep={(index) => index !== 0 || title.trim().length >= 3}
            onFinish={() => setSaved(`${title} · ${description || "설명 없음"}`)}
            finishLabel="요청 저장" />
        <p role="status" className="m-0 text-sm text-muted">
            저장 결과: {saved ?? "없음"}
        </p>
    </div>;
}

function TimelinePreview() {
    const [empty, setEmpty] = useState(false);
    const entries = [
        { id: "done", title: "검토 완료", timestamp: "오늘 10:42",
            dateTime: "2026-09-29T10:42:00+09:00",
            description: "변경 사항 3건을 확인했습니다.",
            status: { label: "완료", tone: "accent" as const } },
        { id: "review", title: "설정 검토", timestamp: "오늘 09:18",
            dateTime: "2026-09-29T09:18:00+09:00",
            status: { label: "검토 필요", tone: "danger" as const } },
        { id: "created", title: "작업 생성", timestamp: "어제 17:05",
            dateTime: "2026-09-28T17:05:00+09:00" },
    ];

    return (
        <div className="preview-stack">
            <Button variant="outline" onClick={() => setEmpty(!empty)}>
                {empty ? "기록 표시" : "빈 상태 표시"}
            </Button>
            <Timeline aria-label="작업 활동" entries={empty ? [] : entries} />
        </div>
    );
}

function LogConsolePreview() {
    const [entries, setEntries] = useState<LogEntry[]>([
        { id: "1", timestamp: "10:42:01", level: "info",
            message: "빌드 시작" },
        { id: "2", timestamp: "10:42:03", level: "warn",
            message: "캐시를 다시 생성했습니다" },
    ]);

    return (
        <div className="preview-stack">
            <div className="preview-row">
                <Button variant="outline" onClick={() =>
                    setEntries((current) => [...current, {
                        id: String(current.length + 1),
                        timestamp: "10:42:04", level: "error",
                        message: "재시도할 수 있습니다",
                    }])}>
                    항목 추가
                </Button>
                <Button variant="ghost"
                    onClick={() => setEntries([])}>비우기</Button>
            </div>
            <LogConsole label="빌드 로그" entries={entries}
                emptyMessage="표시할 로그가 없습니다." />
        </div>
    );
}

function LogViewerPreview() {
    const [variant, setVariant] = useState<"panel" | "flat">("panel");
    const [entries, setEntries] = useState<LogEntry[]>([
        { id: "start", timestamp: "10:42:01", level: "info",
            message: "빌드 시작" },
        { id: "cache", timestamp: "10:42:03", level: "warn",
            message: "캐시를 다시 생성했습니다" },
        { id: "retry", timestamp: "10:42:04", level: "error",
            message: "배포를 재시도해야 합니다" },
    ]);

    return (
        <div className="preview-stack">
            <div className="preview-row" role="group"
                aria-label="로그 뷰어 표시">
                <Button variant={variant === "panel" ? "primary" : "outline"}
                    onClick={() => setVariant("panel")}>panel</Button>
                <Button variant={variant === "flat" ? "primary" : "outline"}
                    onClick={() => setVariant("flat")}>flat</Button>
                <Button variant="outline" onClick={() => setEntries((current) => [
                    ...current,
                    { id: `done-${current.length}`, timestamp: "10:42:08",
                        level: "info", message: "재시도 완료" },
                ])}>항목 추가</Button>
                <Button variant="ghost" onClick={() => setEntries([])}>
                    비우기
                </Button>
            </div>
            <LogViewer label="배포 로그" entries={entries} variant={variant} />
        </div>
    );
}

function TerminalPreview() {
    const [lines, setLines] = useState<TerminalLine[]>([
        { id: "welcome", kind: "notice",
            text: "예시 명령: help, status" },
    ]);
    const [variant, setVariant] = useState<"panel" | "flat">("panel");
    const nextId = useRef(0);

    function run(command: string) {
        const id = ++nextId.current;
        const response = command === "help"
            ? "help · status"
            : command === "status" ? "작업 3건 완료"
                : `지원하지 않는 예시 명령: ${command}`;
        setLines((current) => [...current,
            { id: `${id}-command`, kind: "command", text: command },
            { id: `${id}-response`,
                kind: command === "help" || command === "status"
                    ? "output" : "error", text: response },
        ]);
    }

    return (
        <div className="preview-stack">
            <Button type="button" variant="outline"
                onClick={() => setVariant(variant === "panel" ? "flat" : "panel")}>
                표시: {variant === "panel" ? "패널" : "평면"}
            </Button>
            <Terminal label="작업 명령" lines={lines} onCommand={run}
                variant={variant} />
        </div>
    );
}

function SparklinePreview() {
    const [empty, setEmpty] = useState(false);

    return (
        <div className="preview-stack">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="m-0 text-xs text-muted">일별 요청</p>
                    <strong className="text-xl tabular-nums">1,284</strong>
                </div>
                <Button variant="outline"
                    onClick={() => setEmpty(!empty)}>
                    {empty ? "데이터 표시" : "빈 데이터"}
                </Button>
            </div>
            <Sparkline label="일별 요청" unit="건"
                values={empty ? [] : [8, 12, 10, null, 15, 13, 19, 17]} />
        </div>
    );
}

function BarListPreview() {
    const [variant, setVariant] = useState<"panel" | "plain">("panel");
    const [empty, setEmpty] = useState(false);

    return (
        <div className="preview-stack">
            <div className="preview-row">
                <Button variant="outline" onClick={() => setVariant(
                    variant === "panel" ? "plain" : "panel",
                )}>
                    표시: {variant === "panel" ? "패널" : "평면"}
                </Button>
                <Button variant="outline" onClick={() => setEmpty(!empty)}>
                    {empty ? "데이터 표시" : "빈 데이터"}
                </Button>
            </div>
            <BarList title="작업별 처리 건수"
                description="범주별 수치와 길이를 함께 비교합니다."
                items={empty ? [] : [
                    { id: "usage", label: "일일 사용량 집계", value: 128 },
                    { id: "audit", label: "이벤트 정합성 검사", value: 86 },
                    { id: "notify", label: "알림 발송 준비", value: 0 },
                ]}
                unit="건" variant={variant} />
        </div>
    );
}

function BulletChartPreview() {
    const [value, setValue] = useState<number | null>(74);
    const [appearance, setAppearance] = useState<"panel" | "plain">(
        "panel",
    );

    return (
        <div className="preview-stack">
            <div className="preview-row">
                <Button variant="outline" onClick={() => setValue(
                    value === 74 ? 88 : 74,
                )}>
                    목표 {value === 88 ? "미달" : "초과"}
                </Button>
                <Button variant="outline" onClick={() => setValue(
                    value === null ? 74 : null,
                )}>
                    {value === null ? "값 표시" : "값 없음"}
                </Button>
                <Button variant="outline" onClick={() => setAppearance(
                    appearance === "panel" ? "plain" : "panel",
                )}>
                    표시: {appearance === "panel" ? "패널" : "평면"}
                </Button>
            </div>
            <BulletChart title="완료율" description="현재 값과 목표를 100% 척도에서 비교합니다."
                value={value} target={80} max={100} unit="%"
                appearance={appearance} />
        </div>
    );
}

function FunnelChartPreview() {
    const [variant, setVariant] = useState<"panel" | "plain">("panel");
    const [state, setState] = useState<"data" | "missing" | "empty">(
        "data",
    );
    const stages = [
        { id: "visit", label: "방문", value: 120 },
        { id: "signup", label: "가입", value: 96 },
        { id: "verify", label: "인증", value: state === "missing"
            ? null : 54 },
        { id: "first-use", label: "첫 사용", value: 23 },
    ];

    return (
        <div className="preview-stack">
            <div className="preview-row">
                <Button variant="outline" onClick={() => setState(
                    state === "data" ? "missing" : "data",
                )}>
                    {state === "missing" ? "인증값 표시" : "인증값 숨기기"}
                </Button>
                <Button variant="outline" onClick={() => setState(
                    state === "empty" ? "data" : "empty",
                )}>
                    {state === "empty" ? "데이터 표시" : "빈 데이터"}
                </Button>
                <Button variant="outline" onClick={() => setVariant(
                    variant === "panel" ? "plain" : "panel",
                )}>
                    표시: {variant === "panel" ? "패널" : "평면"}
                </Button>
            </div>
            <FunnelChart title="가입 전환 단계" unit="명"
                description="첫 방문부터 첫 사용까지의 도달률입니다."
                stages={state === "empty" ? [] : stages}
                variant={variant} />
        </div>
    );
}

const chartPoints = [
    { label: "월", value: 8 },
    { label: "화", value: 12 },
    { label: "수", value: 10 },
    { label: "목", value: null },
    { label: "금", value: 15 },
    { label: "토", value: 13 },
    { label: "일", value: 19 },
];
const chartCategories = chartPoints.map((point) => point.label);
const chartSeries = [
    {
        id: "completed", label: "완료",
        values: chartPoints.map((point) => point.value),
    },
    {
        id: "pending", label: "대기",
        values: [4, 6, 8, 7, 3, null, 5],
    },
];
const stackedAreaSeries = [
    chartSeries[0],
    { id: "pending", label: "대기", values: [4, 6, 8, 7, 3, 2, 5] },
];

function DataChartPreview() {
    const [variant, setVariant] = useState<
        "line" | "bar" | "area" | "stacked-bar" | "stacked-area"
    >("line");
    const [empty, setEmpty] = useState(false);
    const [multiple, setMultiple] = useState(false);
    const [hoverSummary, setHoverSummary] = useState(false);

    return (
        <div className="preview-workspace grid gap-3">
            <div className="preview-row">
                <Button variant={variant === "line" ? "primary" : "outline"}
                    onClick={() => setVariant("line")}>선형</Button>
                <Button variant={variant === "bar" ? "primary" : "outline"}
                    onClick={() => setVariant("bar")}>막대</Button>
                <Button
                    variant={variant === "stacked-bar" ? "primary" : "outline"}
                    onClick={() => {
                        setVariant("stacked-bar");
                        setMultiple(true);
                    }}>
                    누적 막대
                </Button>
                <Button variant={variant === "area" ? "primary" : "outline"}
                    onClick={() => setVariant("area")}>영역</Button>
                <Button
                    variant={variant === "stacked-area" ? "primary" : "outline"}
                    onClick={() => {
                        setVariant("stacked-area");
                        setMultiple(true);
                    }}>
                    누적 영역
                </Button>
                <Button variant={multiple ? "primary" : "outline"}
                    onClick={() => setMultiple(!multiple)}>
                    {multiple ? "단일 계열" : "계열 비교"}
                </Button>
                <Button variant={hoverSummary ? "primary" : "outline"}
                    onClick={() => setHoverSummary(!hoverSummary)}>
                    {hoverSummary ? "포인터 요약 켜짐" : "포인터 요약 꺼짐"}
                </Button>
                <Button variant="ghost" onClick={() => setEmpty(!empty)}>
                    {empty ? "데이터 표시" : "빈 데이터"}
                </Button>
            </div>
            {multiple ? (
                <DataChart title="요일별 요청 상태" unit="건"
                    description={
                        variant === "stacked-area"
                            ? "완료와 대기의 합계를 표시합니다. 한 계열이라도 " +
                                "누락된 구간에서는 영역을 끊습니다."
                            : "범례에서 계열을 선택해 완료와 대기를 비교합니다. " +
                                "결측값은 그래프에서 생략하고 표에 표시합니다."
                    }
                    categories={empty ? [] : chartCategories}
                    series={empty ? [] : variant === "stacked-area"
                        ? stackedAreaSeries : chartSeries}
                    variant={variant} inspectable hoverSummary={hoverSummary}
                    toggleableSeries />
            ) : (
                <DataChart title="요일별 검토 완료" unit="건"
                    description="목요일 데이터는 집계되지 않았습니다."
                    points={empty ? [] : chartPoints}
                    variant={variant} inspectable hoverSummary={hoverSummary} />
            )}
        </div>
    );
}

const donutSegments = [
    { label: "완료", value: 42 },
    { label: "검토 중", value: 23 },
    { label: "대기", value: 15 },
    { label: "보류", value: 0 },
];

function DonutChartPreview() {
    const [empty, setEmpty] = useState(false);

    return (
        <div className="preview-workspace grid gap-3">
            <Button variant="outline" className="justify-self-start"
                onClick={() => setEmpty((current) => !current)}>
                {empty ? "데이터 표시" : "빈 데이터"}
            </Button>
            <DonutChart title="요청 처리 상태"
                description="각 상태의 요청 수와 전체 비율입니다."
                totalLabel="전체 요청" unit="건"
                segments={empty ? [] : donutSegments} />
        </div>
    );
}

const heatmapColumns = [
    "09시", "10시", "11시", "12시", "13시",
    "14시", "15시", "16시", "17시", "18시",
];
const heatmapRows = [
    { id: "mon", label: "월", values: [3, 5, 9, 6, 2, 4, 8, 12, 7, 1] },
    { id: "tue", label: "화", values: [2, 4, 7, 5, 0, 6, 11, 15, 9, 3] },
    { id: "wed", label: "수", values: [1, 6, 10, 7, null, 8, 13, 17, 8, 2] },
    { id: "thu", label: "목", values: [4, 8, 12, 9, 3, 7, 16, 20, 11, 5] },
    { id: "fri", label: "금", values: [5, 9, 15, 11, 4, 10, 18, 24, 14, 6] },
];

function HeatmapPreview() {
    const [density, setDensity] = useState<"compact" | "comfortable">(
        "compact",
    );
    const [empty, setEmpty] = useState(false);

    return (
        <div className="preview-workspace grid gap-3">
            <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline"
                    onClick={() => setDensity((value) =>
                        value === "compact" ? "comfortable" : "compact"
                    )}>
                    {density === "compact" ? "넓게 보기" : "촘촘히 보기"}
                </Button>
                <Button type="button" variant="ghost"
                    onClick={() => setEmpty((value) => !value)}>
                    {empty ? "데이터 표시" : "빈 데이터"}
                </Button>
            </div>
            <Heatmap title="요일·시간별 요청" unit="건"
                description="각 칸에 요청 수를 표시합니다. 수요일 13시는 집계 전입니다."
                columns={heatmapColumns} rows={empty ? [] : heatmapRows}
                density={density} />
        </div>
    );
}

const scatterPoints = [
    { id: "mon", label: "월", x: 120, y: 96 },
    { id: "tue", label: "화", x: 220, y: 81 },
    { id: "wed", label: "수", x: 310, y: 62 },
    { id: "thu", label: "목", x: 410, y: 54 },
    { id: "fri", label: "금", x: 380, y: 60 },
    { id: "sat", label: "토", x: null, y: 70 },
];

function ScatterChartPreview() {
    const [mode, setMode] = useState<"data" | "missing" | "empty">("data");
    return <div className="preview-workspace grid gap-3">
        <div className="flex flex-wrap gap-2" role="group"
            aria-label="산점도 데이터 상태">
            <Button variant={mode === "data" ? "primary" : "outline"}
                aria-pressed={mode === "data"}
                onClick={() => setMode("data")}>집계 결과</Button>
            <Button variant={mode === "missing" ? "primary" : "outline"}
                aria-pressed={mode === "missing"}
                onClick={() => setMode("missing")}>결측만 보기</Button>
            <Button variant={mode === "empty" ? "primary" : "outline"}
                aria-pressed={mode === "empty"}
                onClick={() => setMode("empty")}>빈 데이터</Button>
        </div>
        <ScatterChart title="처리량과 평균 지연" xLabel="처리량"
            yLabel="평균 지연" xUnit="건/분" yUnit="ms"
            description="월~금의 관계를 확인합니다. 토요일 처리량은 집계 전입니다."
            points={mode === "empty" ? [] : mode === "missing"
                ? scatterPoints.slice(-1) : scatterPoints} />
    </div>;
}

function PageHeaderPreview() {
    const [size, setSize] = useState<"compact" | "default" | "hero">(
        "default",
    );
    const sizes = ["compact", "default", "hero"] as const;

    return (
        <div className="preview-stack">
            <div className="flex flex-wrap gap-2" role="group"
                aria-label="제목 크기">
                {sizes.map((option) => (
                    <Button key={option} type="button"
                        variant={size === option ? "primary" : "outline"}
                        aria-pressed={size === option}
                        onClick={() => setSize(option)}>
                        {option}
                    </Button>
                ))}
            </div>
            <PageHeader level={2} size={size} title="운영 대시보드"
                subtitle="오늘의 요청과 실행 상태를 확인합니다."
                eyebrow="Workspace"
                actions={<Button variant="outline">새 보고서</Button>} />
        </div>
    );
}

function DashboardPreview() {
    return (
        <div className="preview-workspace">
            <Dashboard>
                <PageHeader level={2} title="운영 대시보드"
                    subtitle="이번 주 요청과 실행 상태" />
                <DashboardMetrics aria-label="주요 지표">
                    <MetricCard label="요청" value="1,284" />
                    <MetricCard label="완료" value="1,216" />
                    <MetricCard label="대기" value="52" />
                    <MetricCard label="오류" value="16" />
                </DashboardMetrics>
                <DashboardPanels aria-label="추세와 로그">
                    <DataChart title="요일별 완료" points={chartPoints}
                        unit="건" variant="bar" />
                    <LogConsole label="최근 실행" entries={[
                        { id: "1", level: "info", message: "집계 완료" },
                        { id: "2", level: "warn", message: "재시도 2건" },
                    ]} />
                </DashboardPanels>
            </Dashboard>
        </div>
    );
}

function ToastPreview() {
    const { visible, pendingCount, enqueue, dismiss } = useToastQueue(2);
    const nextJob = useRef(0);

    return (
        <div className="preview-row">
            <Button onClick={() => enqueue({
                dedupeKey: "saved", variant: "success", statusLabel: "완료",
                title: "저장했습니다", closeLabel: "알림 닫기",
            })}>
                완료 알림
            </Button>
            <Button variant="outline"
                onClick={() => enqueue({
                    variant: "error", statusLabel: "오류",
                    title: "저장하지 못했습니다",
                    description: "잠시 후 다시 시도하세요.",
                    closeLabel: "알림 닫기",
                })}>
                오류 알림
            </Button>
            <Button variant="outline" onClick={() => {
                nextJob.current += 1;
                enqueue({
                    title: `작업 ${nextJob.current} 접수`,
                    statusLabel: "작업", closeLabel: "알림 닫기",
                });
            }}>
                작업 알림
            </Button>
            <Button variant="outline" onClick={() => enqueue({
                variant: "warning", statusLabel: "주의",
                title: "만료 예정 항목을 검토하세요",
                closeLabel: "알림 닫기",
            })}>
                주의 알림
            </Button>
            <span className="text-xs text-muted">
                대기 중 {pendingCount}건
            </span>
            <ToastQueue notices={visible} onDismiss={dismiss} />
        </div>
    );
}

type ReviewRow = {
    id: string;
    request: string;
    owner: string;
    status: "대기" | "진행" | "완료";
    detail: string;
};

const reviewColumns: DataTableColumn<ReviewRow>[] = [
    { id: "request", header: "요청", cell: (row) => row.request,
        sortValue: (row) => row.request },
    { id: "owner", header: "담당", cell: (row) => row.owner },
    { id: "status", header: "상태", cell: (row) => row.status,
        sortValue: (row) => row.status },
];

const reviewFilter = {
    label: "상태",
    getValue: (row: ReviewRow) => row.status,
    options: [
        { value: "대기", label: "대기" },
        { value: "진행", label: "진행" },
        { value: "완료", label: "완료" },
    ],
};

const initialReviewRows: ReviewRow[] = [
    { id: "1", request: "검색 필터", owner: "운영팀", status: "대기",
        detail: "담당자와 상태로 요청을 좁혀 확인합니다." },
    { id: "2", request: "초대 화면", owner: "제품팀", status: "진행",
        detail: "초대 링크 만료일을 안내합니다." },
    { id: "3", request: "설정 저장", owner: "개발팀", status: "완료",
        detail: "저장 실패 시 입력값을 유지합니다." },
    { id: "4", request: "상태 알림", owner: "제품팀", status: "대기",
        detail: "변경 결과와 다시 시도할 수 있는 작업을 표시합니다." },
    { id: "5", request: "내보내기", owner: "운영팀", status: "진행",
        detail: "선택한 기간과 파일 형식을 결과에 포함합니다." },
    { id: "6", request: "접근 권한", owner: "개발팀", status: "완료",
        detail: "변경 전후 권한을 검토 화면에서 비교합니다." },
];

function RemoteDataTablePreview({ density, striped }: {
    density: "compact" | "standard" | "comfortable";
    striped: boolean;
}) {
    const [view, setView] = useState<DataTableView>({
        query: "", filterValue: "", sort: null, page: 1, pageSize: 2,
    });
    const [status, setStatus] = useState<"ready" | "loading" | "error">(
        "ready",
    );
    const [lastAction, setLastAction] = useState("");
    const matching = initialReviewRows.filter((row) =>
        (!view.query || `${row.request} ${row.owner} ${row.status}`
            .includes(view.query)) &&
        (!view.filterValue || row.status === view.filterValue),
    );
    const ordered = [...matching].sort((first, second) => {
        const sortId = view.sort?.id;
        if (sortId !== "request" && sortId !== "status") return 0;
        const compared = first[sortId].localeCompare(second[sortId], "ko");
        return view.sort?.direction === "descending" ? -compared : compared;
    });
    const pageRows = ordered.slice(
        (view.page - 1) * view.pageSize, view.page * view.pageSize,
    );

    return (
        <div className="grid gap-3">
            <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setStatus("loading")}>
                    로딩 상태 보기
                </Button>
                <Button variant="outline" onClick={() => setStatus("error")}>
                    오류 상태 보기
                </Button>
                <Button variant="outline" onClick={() => setStatus("ready")}>
                    조회 결과 보기
                </Button>
            </div>
            <DataTable
                caption="원격 요청 목록"
                density={density} striped={striped}
                rows={pageRows}
                columns={reviewColumns}
                getRowId={(row) => row.id}
                getRowLabel={(row) => row.request}
                renderRowDetails={(row) => <p className="m-0 py-2">
                    {row.detail}
                </p>}
                filter={{ label: "상태", options: reviewFilter.options }}
                pageSizeOptions={[2, 3]}
                selectable
                renderActions={(selected, clear) => (
                    <Button variant="outline" onClick={() => {
                        setLastAction(`${selected.length}건을 선택했습니다.`);
                        clear();
                    }}>
                        선택 확인
                    </Button>
                )}
                remote={{
                    view, totalItems: matching.length, searchable: true,
                    status, onViewChange: (next) => {
                        setView(next);
                        setStatus("ready");
                    },
                    errorMessage: "요청 목록을 불러오지 못했습니다.",
                    onRetry: () => setStatus("ready"),
                }}
            />
            {lastAction && <p role="status">{lastAction}</p>}
        </div>
    );
}

const initialNotifications: NotificationItem[] = [
    { id: "review", title: "권한 변경 검토",
        message: "운영팀의 변경 요청을 확인해 주세요.",
        timestamp: "오늘 09:42", dateTime: "2026-10-02T09:42:00+09:00",
        read: false },
    { id: "report", title: "주간 보고서 준비 완료",
        message: "새 보고서를 열어 결과를 확인할 수 있습니다.",
        timestamp: "어제 16:20", dateTime: "2026-10-01T16:20:00+09:00",
        read: false },
    { id: "saved", title: "설정 저장 완료",
        timestamp: "9월 30일", dateTime: "2026-09-30", read: true },
];

function NotificationCenterPreview() {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [appearance, setAppearance] = useState<"panel" | "plain">(
        "panel",
    );
    const [opened, setOpened] = useState<string | null>(null);

    return (
        <div className="preview-workspace grid gap-3">
            <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setAppearance(
                    appearance === "panel" ? "plain" : "panel",
                )}>
                    {appearance === "panel" ? "테두리 없이" : "패널로"} 보기
                </Button>
                <Button variant="ghost" onClick={() => {
                    setNotifications(initialNotifications);
                    setOpened(null);
                }}>
                    알림 초기화
                </Button>
            </div>
            <NotificationCenter label="알림" notifications={notifications}
                appearance={appearance}
                onReadChange={(id, read) => setNotifications((current) =>
                    current.map((item) => item.id === id
                        ? { ...item, read } : item))}
                onMarkAllRead={() => setNotifications((current) =>
                    current.map((item) => ({ ...item, read: true })))}
                onOpen={(id) => setOpened(id)} />
            {opened && <p role="status" className="m-0 text-sm text-muted">
                {notifications.find((item) => item.id === opened)?.title}
                {" 열기를 요청했습니다."}
            </p>}
        </div>
    );
}

function DataTablePreview() {
    const [rows, setRows] = useState(initialReviewRows);
    const [lastAction, setLastAction] = useState("");
    const [mode, setMode] = useState<"local" | "remote">("local");
    const [density, setDensity] = useState<
        "compact" | "standard" | "comfortable"
    >("standard");
    const [striped, setStriped] = useState(false);

    return (
        <div className="preview-workspace">
            <div className="mb-3 flex flex-wrap gap-2">
                <Button variant="outline" aria-pressed={mode === "local"}
                    onClick={() => setMode("local")}>
                    전체 행
                </Button>
                <Button variant="outline" aria-pressed={mode === "remote"}
                    onClick={() => setMode("remote")}>
                    원격 페이지
                </Button>
            </div>
            <div className="mb-3 flex flex-wrap items-end gap-3">
                <div className="grid gap-1">
                    <label htmlFor="demo-table-density">행 밀도</label>
                    <NativeSelect id="demo-table-density" value={density}
                        onChange={(event) => setDensity(event.target.value as
                            typeof density)}>
                        <option value="compact">좁게</option>
                        <option value="standard">기본</option>
                        <option value="comfortable">넓게</option>
                    </NativeSelect>
                </div>
                <label className="flex min-h-9 items-center gap-2">
                    <input type="checkbox" checked={striped}
                        onChange={(event) => setStriped(event.target.checked)} />
                    줄무늬 행
                </label>
            </div>
            {mode === "remote" ? <RemoteDataTablePreview density={density}
                striped={striped} /> : <DataTable
                caption="화면 개선 요청"
                density={density} striped={striped}
                rows={rows}
                columns={reviewColumns}
                getRowId={(row) => row.id}
                getRowLabel={(row) => row.request}
                renderRowDetails={(row) => <p className="m-0 py-2">
                    {row.detail}
                </p>}
                getSearchText={(row) =>
                    `${row.request} ${row.owner} ${row.status}`}
                filter={reviewFilter}
                defaultPageSize={3}
                pageSizeOptions={[3, 6]}
                selectable
                renderActions={(selected, clear) => (
                    <Button variant="outline" onClick={() => {
                        const ids = new Set(selected.map((row) => row.id));
                        setRows((current) => current.filter(
                            (row) => !ids.has(row.id),
                        ));
                        setLastAction(`${selected.length}건 보관했습니다.`);
                        clear();
                    }}>
                        선택 항목 보관
                    </Button>
                )}
            />}
            {lastAction && <p role="status">{lastAction}</p>}
        </div>
    );
}

function RequestFilterPreview() {
    const [variant, setVariant] = useState<"bar" | "panel">("panel");
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("");
    const [applied, setApplied] = useState({ query: "", status: "" });
    const dirty = query.trim() !== applied.query ||
        status !== applied.status;
    const appliedFilters: AppliedFilter[] = [
        ...(applied.query ? [{ id: "query", label: "검색어",
            value: applied.query }] : []),
        ...(applied.status ? [{ id: "status", label: "상태",
            value: applied.status }] : []),
    ];
    const visibleRows = initialReviewRows.filter((row) =>
        (!applied.query || row.request.includes(applied.query)) &&
        (!applied.status || row.status === applied.status),
    );

    return (
        <div className="preview-workspace grid gap-3">
            <Button variant="outline" className="justify-self-start"
                onClick={() => setVariant((current) =>
                    current === "panel" ? "bar" : "panel")}>
                {variant === "panel" ? "바 형태 보기" : "패널 형태 보기"}
            </Button>
            <FilterBar label="요청 분석 필터" variant={variant}
                dirty={dirty} appliedFilters={appliedFilters}
                onApply={(values) => {
                    const nextQuery = String(values.get("query") ?? "").trim();
                    const nextStatus = String(values.get("status") ?? "");
                    setQuery(nextQuery);
                    setApplied({ query: nextQuery, status: nextStatus });
                }}
                onClear={() => {
                    setQuery("");
                    setStatus("");
                    setApplied({ query: "", status: "" });
                }}>
                <Field label="검색어">
                    {(control) => <Input {...control} type="search"
                        name="query" value={query}
                        onChange={(event) => setQuery(event.target.value)} />}
                </Field>
                <Field label="상태">
                    {(control) => <NativeSelect {...control} name="status"
                        value={status} onChange={(event) =>
                            setStatus(event.target.value)}>
                        <option value="">전체</option>
                        <option value="대기">대기</option>
                        <option value="진행">진행</option>
                        <option value="완료">완료</option>
                    </NativeSelect>}
                </Field>
            </FilterBar>
            <p role="status" className="m-0 text-sm text-muted">
                적용 결과 {visibleRows.length}건
            </p>
            <ul className="m-0 grid gap-1 pl-5 text-sm">
                {visibleRows.map((row) => (
                    <li key={row.id}>{row.request} · {row.status}</li>
                ))}
            </ul>
        </div>
    );
}

function DateRangeFilterPreview() {
    const [range, setRange] = useState<DateRangeValue>(null);
    const [applied, setApplied] = useState<DateRangeValue>(null);
    const [error, setError] = useState(false);
    const dirty = range?.from !== applied?.from || range?.to !== applied?.to;
    const rows = [
        { id: "review", date: "2026-09-23", name: "요청 검토" },
        { id: "export", date: "2026-09-26", name: "내보내기" },
        { id: "audit", date: "2026-09-29", name: "접근 기록 확인" },
    ];
    const appliedStart = applied?.from;
    const appliedEnd = applied?.to;
    const visibleRows = appliedStart && appliedEnd ? rows.filter((row) =>
        row.date >= appliedStart && row.date <= appliedEnd
    ) : rows;

    return (
        <div className="preview-workspace grid gap-3">
            <p className="m-0 text-sm text-muted">
                예제 데이터는 2026-09-23부터 29일까지의 달력 날짜입니다.
            </p>
            <FilterBar label="기록 기간 필터" dirty={dirty}
                appliedFilters={applied?.to ? [{
                    id: "period", label: "조회 기간",
                    value: `${applied.from} — ${applied.to}`,
                }] : []}
                onApply={(values) => {
                    const from = String(values.get("periodStart") ?? "");
                    const to = String(values.get("periodEnd") ?? "");
                    if (!from || !to) {
                        setError(true);
                        return;
                    }
                    setApplied({ from, to });
                    setError(false);
                }}
                onClear={() => {
                    setRange(null);
                    setApplied(null);
                    setError(false);
                }}>
                <Field label="조회 기간"
                    error={error ? "시작일과 종료일을 선택하세요." : undefined}>
                    {(control) => <DateRangePicker {...control}
                        startName="periodStart" endName="periodEnd"
                        value={range} onValueChange={(next) => {
                            setRange(next);
                            setError(false);
                        }} calendarLocale={ko} />}
                </Field>
            </FilterBar>
            <p role="status" className="m-0 text-sm text-muted">
                적용 결과 {visibleRows.length}건
            </p>
            <ul className="m-0 grid gap-1 pl-5 text-sm">
                {visibleRows.map((row) => (
                    <li key={row.id}>{row.date} · {row.name}</li>
                ))}
            </ul>
        </div>
    );
}

function FilterBarPreview() {
    const [period, setPeriod] = useState(true);
    return (
        <div className="grid gap-3">
            <Button variant="outline" className="justify-self-start"
                onClick={() => setPeriod((current) => !current)}>
                {period ? "검색·상태 필터 보기" : "기간 필터 보기"}
            </Button>
            {period ? <DateRangeFilterPreview /> : <RequestFilterPreview />}
        </div>
    );
}

const auditQueryFields: QueryField[] = [
    { id: "status", label: "상태", type: "select", options: [
        { value: "failed", label: "실패" },
        { value: "done", label: "완료" },
    ] },
    { id: "severity", label: "심각도", type: "number" },
    { id: "owner", label: "담당자", type: "text" },
    { id: "date", label: "발생일", type: "date" },
];

const initialAuditQuery: QueryGroup = {
    kind: "group", id: "audit-root", combinator: "all", children: [
        { kind: "condition", id: "audit-status", fieldId: "status",
            operator: "equals", value: "failed" },
        { kind: "group", id: "audit-alternatives", combinator: "any",
            children: [
                { kind: "condition", id: "audit-severity",
                    fieldId: "severity", operator: "greater-than",
                    value: "3" },
                { kind: "condition", id: "audit-owner",
                    fieldId: "owner", operator: "contains",
                    value: "운영" },
            ] },
    ],
};

function QueryBuilderPreview() {
    const [query, setQuery] = useState(initialAuditQuery);
    const [applied, setApplied] = useState<QueryGroup | null>(null);
    const [variant, setVariant] = useState<"panel" | "plain">("panel");

    return (
        <div className="preview-workspace grid gap-3">
            <Button variant="outline" className="justify-self-start"
                onClick={() => setVariant((current) => current === "panel"
                    ? "plain" : "panel")}>
                {variant === "panel" ? "Plain 형태 보기" :
                    "Panel 형태 보기"}
            </Button>
            <QueryBuilder label="감사 이벤트 조건" fields={auditQueryFields}
                value={query} onValueChange={setQuery}
                onApply={setApplied} variant={variant} />
            <div className="grid gap-1 text-sm">
                <p role="status" className="m-0 text-muted">
                    {applied ? "적용한 조건" : "조건을 적용해 보세요."}
                </p>
                {applied && <pre className={
                    "max-h-48 overflow-auto rounded-sm border border-border " +
                    "bg-surface p-[var(--space-3)] text-xs"
                }>{JSON.stringify(applied, null, 2)}</pre>}
            </div>
        </div>
    );
}

function PaginationPreview() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalItems, setTotalItems] = useState(23);

    return (
        <div className="preview-workspace grid gap-3">
            <Pagination
                page={page}
                pageSize={pageSize}
                totalItems={totalItems}
                onPageChange={setPage}
                pageSizeOptions={[5, 10]}
                onPageSizeChange={setPageSize}
            />
            <Button variant="ghost" className="justify-self-start"
                onClick={() => { setTotalItems(totalItems ? 0 : 23);
                    setPage(1); }}>
                {totalItems ? "0건 보기" : "23건 보기"}
            </Button>
        </div>
    );
}

function DrawerPreview() {
    return (
        <div className="preview-row">
            <Drawer>
                <DrawerTrigger asChild>
                    <Button variant="outline">상세 패널 열기</Button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>요청 상세</DrawerTitle>
                        <DrawerDescription>
                            선택한 요청의 상태와 담당자를 확인합니다.
                        </DrawerDescription>
                    </DrawerHeader>
                    <p>초대 화면 · 제품팀 · 진행 중</p>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline">닫기</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <Drawer>
                <DrawerTrigger asChild>
                    <Button variant="ghost">아래 패널 열기</Button>
                </DrawerTrigger>
                <DrawerContent side="bottom">
                    <DrawerHeader>
                        <DrawerTitle>빠른 작업</DrawerTitle>
                        <DrawerDescription>현재 화면에서 바로 실행합니다.</DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter>
                        <DrawerClose asChild><Button>확인</Button></DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
}

function DropdownMenuPreview() {
    const [showCompleted, setShowCompleted] = useState(true);
    const [density, setDensity] = useState("standard");
    const [lastAction, setLastAction] = useState("");

    return (
        <div className="preview-stack">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">요청 작업</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                    <DropdownMenuLabel>화면 개선 요청</DropdownMenuLabel>
                    <DropdownMenuItem onSelect={() =>
                        setLastAction("요청 상세를 열었습니다.")}>
                        상세 보기
                    </DropdownMenuItem>
                    <DropdownMenuCheckboxItem
                        checked={showCompleted}
                        onCheckedChange={(value) =>
                            setShowCompleted(value === true)}
                    >
                        완료 항목 표시
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuRadioGroup value={density}
                        onValueChange={setDensity}>
                        <DropdownMenuRadioItem value="standard">
                            기본 밀도
                        </DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="compact">
                            좁은 밀도
                        </DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                    <DropdownMenuSub>
                        <DropdownMenuSubTrigger>내보내기</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                            <DropdownMenuItem onSelect={() =>
                                setLastAction("CSV 내보내기를 선택했습니다.")}>
                                CSV
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>PDF 준비 중</DropdownMenuItem>
                        </DropdownMenuSubContent>
                    </DropdownMenuSub>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="danger" onSelect={() =>
                        setLastAction("보관 작업을 선택했습니다.")}>
                        보관
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <p role="status">
                완료 항목 {showCompleted ? "표시" : "숨김"}
                {` · ${density === "standard" ? "기본" : "좁은"} 밀도`}
                {lastAction && ` · ${lastAction}`}
            </p>
        </div>
    );
}

function MenubarPreview() {
    const [showGrid, setShowGrid] = useState(true);
    const [density, setDensity] = useState("standard");
    const [lastAction, setLastAction] = useState("아직 실행한 작업이 없습니다.");

    return (
        <div className="preview-stack w-full">
            <Menubar aria-label="편집기 명령">
                <MenubarMenu>
                    <MenubarTrigger>파일</MenubarTrigger>
                    <MenubarContent>
                        <MenubarGroup>
                            <MenubarLabel>문서</MenubarLabel>
                            <MenubarItem onSelect={() =>
                                setLastAction("새 문서 작업을 선택했습니다.")}>
                                새 문서
                            </MenubarItem>
                            <MenubarItem onSelect={() =>
                                setLastAction("사본 만들기를 선택했습니다.")}>
                                사본 만들기
                            </MenubarItem>
                            <MenubarItem disabled>인쇄 준비 중</MenubarItem>
                        </MenubarGroup>
                        <MenubarSeparator />
                        <MenubarSub>
                            <MenubarSubTrigger>내보내기</MenubarSubTrigger>
                            <MenubarSubContent>
                                <MenubarItem onSelect={() =>
                                    setLastAction("CSV 내보내기를 선택했습니다.")}>
                                    CSV
                                </MenubarItem>
                            </MenubarSubContent>
                        </MenubarSub>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>보기</MenubarTrigger>
                    <MenubarContent>
                        <MenubarCheckboxItem checked={showGrid}
                            onCheckedChange={(value) =>
                                setShowGrid(value === true)}>
                            격자 표시
                        </MenubarCheckboxItem>
                        <MenubarSeparator />
                        <MenubarRadioGroup value={density}
                            onValueChange={setDensity}>
                            <MenubarRadioItem value="standard">
                                기본 밀도
                            </MenubarRadioItem>
                            <MenubarRadioItem value="compact">
                                좁은 밀도
                            </MenubarRadioItem>
                        </MenubarRadioGroup>
                    </MenubarContent>
                </MenubarMenu>
                <MenubarMenu>
                    <MenubarTrigger>도움말</MenubarTrigger>
                    <MenubarContent>
                        <MenubarItem onSelect={() =>
                            setLastAction("명령 안내를 선택했습니다.")}>
                            명령 안내
                        </MenubarItem>
                    </MenubarContent>
                </MenubarMenu>
            </Menubar>
            <p role="status">
                {lastAction} 격자 {showGrid ? "표시" : "숨김"} ·
                {density === "standard" ? " 기본" : " 좁은"} 밀도
            </p>
        </div>
    );
}

function ContextMenuPreview() {
    const [showArchived, setShowArchived] = useState(false);
    const [density, setDensity] = useState("standard");
    const [lastAction, setLastAction] = useState("");

    return (
        <div className="preview-stack">
            <ContextMenu>
                <ContextMenuTrigger asChild>
                    <button type="button" className={
                        "min-h-32 w-full rounded-sm border border-dashed " +
                        "border-border bg-surface-subtle px-5 text-left " +
                        "text-sm text-foreground"
                    }>
                        요청 카드 · 우클릭 또는 Shift+F10
                    </button>
                </ContextMenuTrigger>
                <ContextMenuContent>
                    <ContextMenuLabel>화면 개선 요청</ContextMenuLabel>
                    <ContextMenuItem onSelect={() =>
                        setLastAction("요청 상세를 열었습니다.")}>
                        상세 보기
                    </ContextMenuItem>
                    <ContextMenuCheckboxItem checked={showArchived}
                        onCheckedChange={(value) =>
                            setShowArchived(value === true)}>
                        보관 항목 표시
                    </ContextMenuCheckboxItem>
                    <ContextMenuRadioGroup value={density}
                        onValueChange={setDensity}>
                        <ContextMenuRadioItem value="standard">
                            기본 밀도
                        </ContextMenuRadioItem>
                        <ContextMenuRadioItem value="compact">
                            좁은 밀도
                        </ContextMenuRadioItem>
                    </ContextMenuRadioGroup>
                    <ContextMenuSub>
                        <ContextMenuSubTrigger>내보내기</ContextMenuSubTrigger>
                        <ContextMenuSubContent>
                            <ContextMenuItem onSelect={() =>
                                setLastAction("CSV 내보내기를 선택했습니다.")}>
                                CSV
                            </ContextMenuItem>
                            <ContextMenuItem disabled>PDF 준비 중</ContextMenuItem>
                        </ContextMenuSubContent>
                    </ContextMenuSub>
                    <ContextMenuSeparator />
                    <ContextMenuItem variant="danger" onSelect={() =>
                        setLastAction("보관 작업을 선택했습니다.")}>
                        보관
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
            <p role="status">
                보관 항목 {showArchived ? "표시" : "숨김"}
                {` · ${density === "standard" ? "기본" : "좁은"} 밀도`}
                {lastAction && ` · ${lastAction}`}
            </p>
        </div>
    );
}

function PasswordInputPreview() {
    const [value, setValue] = useState("");

    return (
        <div className="preview-field">
            <Label htmlFor="demo-password">비밀번호</Label>
            <PasswordInput
                id="demo-password"
                name="password"
                autoComplete="current-password"
                value={value}
                onChange={(event) => setValue(event.target.value)}
            />
            <p role="status">입력 길이: {value.length}자</p>
            <PasswordInput aria-label="비활성 비밀번호" disabled
                placeholder="사용할 수 없음" />
        </div>
    );
}

const workspaceOptions = [
    { value: "studio", label: "Design Studio" },
    { value: "ops", label: "Operations" },
    { value: "archive", label: "Archive", disabled: true },
    { value: "research", label: "Research Lab" },
];

function EditablePreview() {
    const [name, setName] = useState("Operations workspace");
    const [failNext, setFailNext] = useState(false);

    return (
        <div className="preview-field">
            <Editable label="작업 공간 이름" value={name} required
                validate={(draft) => draft.trim().length < 2
                    ? "두 글자 이상 입력하세요." : null}
                onSave={async (draft) => {
                    await new Promise((resolve) => setTimeout(resolve, 400));
                    if (failNext) {
                        setFailNext(false);
                        throw new Error("Demo save failed");
                    }
                    setName(draft.trim());
                }} />
            <Button type="button" variant="outline"
                onClick={() => setFailNext(true)} disabled={failNext}>
                {failNext ? "다음 저장은 실패합니다" : "다음 저장 실패 시험"}
            </Button>
            <p role="status">현재 이름: {name}</p>
        </div>
    );
}

function ComboboxPreview() {
    const [value, setValue] = useState<string | null>(null);
    const [selectedOption, setSelectedOption] = useState<
        (typeof workspaceOptions)[number] | undefined
    >();
    const [options, setOptions] = useState(workspaceOptions);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState<string | null>(null);

    useEffect(() => {
        if (!query) {
            setOptions(workspaceOptions);
            setLoading(false);
            return;
        }
        const timer = window.setTimeout(() => {
            setOptions(workspaceOptions.filter((option) =>
                option.label.toLocaleLowerCase().includes(
                    query.toLocaleLowerCase(),
                ),
            ));
            setLoading(false);
        }, 300);
        return () => window.clearTimeout(timer);
    }, [query]);

    return (
        <form className="preview-field" onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(String(
                new FormData(event.currentTarget).get("workspace") ?? "",
            ));
        }}>
            <Field label="작업 공간" required>
                {(control) => <Combobox
                    {...control}
                    options={options}
                    selectedOption={selectedOption}
                    name="workspace"
                    value={value}
                    onValueChange={(next) => {
                        setValue(next);
                        if (next) {
                            setSelectedOption(options.find((option) =>
                                option.value === next,
                            ));
                        }
                    }}
                    onQueryChange={(next) => {
                        setQuery(next);
                        setLoading(Boolean(next));
                        setError(null);
                    }}
                    filterOptions={false}
                    loading={loading}
                    errorMessage={error}
                    placeholder="작업 공간 검색"
                    emptyMessage="일치하는 작업 공간이 없습니다."
                    requiredMessage="목록에서 작업 공간을 선택하세요."
                    required
                />}
            </Field>
            <Button type="submit">적용</Button>
            <Button type="button" variant="outline" disabled={!value}
                onClick={() => setOptions((current) => current.filter(
                    (option) => option.value !== value,
                ))}>
                선택 항목 없는 결과로 갱신
            </Button>
            <Button type="button" variant="outline"
                onClick={() => {
                    setOptions([]);
                    setLoading(false);
                    setError("검색 요청에 실패했습니다.");
                }}>
                검색 실패 시험
            </Button>
            <p role="status">
                선택: {value ?? "없음"} · 제출: {submitted ?? "없음"}
            </p>
        </form>
    );
}

function MultiSelectPreview() {
    const [values, setValues] = useState<string[]>([]);
    const [submitted, setSubmitted] = useState<string[]>([]);

    return (
        <form className="preview-field" onSubmit={(event) => {
            event.preventDefault();
            setSubmitted(new FormData(event.currentTarget)
                .getAll("workspace").map(String));
        }}>
            <Field label="작업 공간" required>
                {(control) => <MultiSelect
                    {...control}
                    aria-label="작업 공간"
                    options={workspaceOptions}
                    name="workspace"
                    value={values}
                    onValueChange={setValues}
                    maxSelections={2}
                    required
                    searchPlaceholder="작업 공간 검색"
                />}
            </Field>
            <div className="flex gap-2">
                <Button type="submit">적용</Button>
                <Button type="button" variant="outline" onClick={() => {
                    setValues([]);
                    setSubmitted([]);
                }}>초기화</Button>
            </div>
            <p role="status">
                선택: {values.join(", ") || "없음"} · 제출: {
                    submitted.join(", ") || "없음"}
            </p>
        </form>
    );
}

function CarouselPreview() {
    const [variant, setVariant] = useState<"card" | "plain">("card");
    const slides = [
        { id: "summary", label: "운영 요약", content:
            <div className="min-h-28 rounded-sm bg-surface-subtle p-4">
                <strong className="block text-lg">운영 요약</strong>
                <p className="mb-0 text-sm text-muted">
                    오늘 처리한 요청과 남은 작업을 확인합니다.
                </p>
            </div> },
        { id: "approval", label: "승인 현황", content:
            <div className="min-h-28 rounded-sm bg-surface-subtle p-4">
                <strong className="block text-lg">승인 현황</strong>
                <p className="mb-0 text-sm text-muted">
                    검토 대기 3건과 완료 8건이 있습니다.
                </p>
            </div> },
        { id: "activity", label: "실행 기록", content:
            <div className="min-h-28 rounded-sm bg-surface-subtle p-4">
                <strong className="block text-lg">실행 기록</strong>
                <p className="mb-0 text-sm text-muted">
                    최근 실행 결과를 순서대로 살펴봅니다.
                </p>
            </div> },
    ];

    return (
        <div className="preview-stack">
            <div className="flex gap-2">
                <Button variant={variant === "card" ? "primary" : "outline"}
                    onClick={() => setVariant("card")}>Card</Button>
                <Button variant={variant === "plain" ? "primary" : "outline"}
                    onClick={() => setVariant("plain")}>Plain</Button>
            </div>
            <Carousel label="업무 둘러보기" slides={slides}
                variant={variant} showIndicators />
        </div>
    );
}

function ImagePreview() {
    const [source, setSource] = useState<"ready" | "missing" | "error">(
        "ready",
    );
    const [fit, setFit] = useState<"cover" | "contain">("cover");
    const src = source === "ready"
        ? `${import.meta.env.BASE_URL}image-preview.svg`
        : source === "missing" ? null : "data:image/png;base64,a";

    return (
        <div className="preview-stack">
            <div className="flex flex-wrap gap-2">
                <Button variant={source === "ready" ? "primary" : "outline"}
                    onClick={() => setSource("ready")}>이미지</Button>
                <Button variant={source === "missing" ? "primary" : "outline"}
                    onClick={() => setSource("missing")}>없음</Button>
                <Button variant={source === "error" ? "primary" : "outline"}
                    onClick={() => setSource("error")}>오류</Button>
                <Button variant="ghost" onClick={() => setFit((current) =>
                    current === "cover" ? "contain" : "cover"
                )}>맞춤: {fit}</Button>
            </div>
            <Image src={src}
                alt="남색 산과 로즈색 태양을 그린 풍경 일러스트"
                aspectRatio="video" fit={fit} variant="frame"
                loading="eager" fallbackText="그림을 불러오지 못했습니다." />
        </div>
    );
}

const galleryImages: LightboxItem[] = [
    { id: "mountain", src: `${import.meta.env.BASE_URL}image-preview.svg`,
        alt: "남색 산과 로즈색 태양", caption: "산과 태양" },
    { id: "coast", src: `${import.meta.env.BASE_URL}gallery-coast.svg`,
        alt: "로즈색 하늘 아래 남색 해안", caption: "해안의 물결" },
    { id: "city", src: `${import.meta.env.BASE_URL}gallery-city.svg`,
        alt: "남색 도시 위의 로즈색 달", caption: "도시의 밤" },
];

function LightboxPreview() {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [open, setOpen] = useState(false);
    const [variant, setVariant] = useState<"frame" | "immersive">("frame");

    return (
        <div className="preview-stack">
            <Button variant="outline" onClick={() => setVariant((current) =>
                current === "frame" ? "immersive" : "frame"
            )}>
                보기: {variant === "frame" ? "프레임" : "전체 화면"}
            </Button>
            <div className="grid grid-cols-3 gap-2">
                {galleryImages.map((item) => (
                    <button key={item.id} type="button"
                        aria-label={`${item.alt} 확대 보기`}
                        className={
                            "overflow-hidden rounded-sm border border-border " +
                            "bg-surface-subtle focus-visible:outline-2 " +
                            "focus-visible:outline-focus"
                        }
                        onClick={() => {
                            setActiveId(item.id);
                            setOpen(true);
                        }}>
                        <img src={item.src} alt=""
                            className="aspect-video w-full object-cover" />
                    </button>
                ))}
            </div>
            <Lightbox title="작업 이미지" items={galleryImages}
                activeId={activeId} open={open}
                onOpenChange={setOpen}
                onActiveIdChange={setActiveId} variant={variant} />
        </div>
    );
}

const previewJsonValue: JsonValue = {
    status: "ready",
    total: 5,
    records: [
        { id: "r-101", score: 92, active: true },
        { id: "r-102", score: 87, active: false },
        { id: "r-103", score: 94, active: true },
        { id: "r-104", score: 78, active: true },
        { id: "r-105", score: 90, active: true },
    ],
    metadata: { owner: "운영팀", note: null },
};

function JsonViewerPreview() {
    const [variant, setVariant] = useState<"frame" | "plain">("frame");

    return (
        <div className="preview-stack">
            <div className="flex gap-2">
                <Button variant={variant === "frame" ? "primary" : "outline"}
                    onClick={() => setVariant("frame")}>Frame</Button>
                <Button variant={variant === "plain" ? "primary" : "outline"}
                    onClick={() => setVariant("plain")}>Plain</Button>
            </div>
            <JsonViewer label="요청 응답" value={previewJsonValue}
                defaultExpandedDepth={2} pageSize={2} variant={variant} />
        </div>
    );
}

function ResponseFeedbackPreview() {
    const [value, setValue] = useState<ResponseFeedbackValue>(null);
    return (
        <div className="preview-stack">
            <p>이 답변이 도움이 되었나요?</p>
            <ResponseFeedback label="답변 평가" value={value}
                onValueChange={setValue} counts={{ up: 12, down: 2 }} />
            <p role="status">선택: {value === "up" ? "좋아요" :
                value === "down" ? "싫어요" : "없음"}</p>
        </div>
    );
}

function FavoriteTogglePreview() {
    const [favorite, setFavorite] = useState(false);
    return (
        <div className="preview-stack">
            <FavoriteToggle label="이 글 즐겨찾기" count={24}
                pressed={favorite} onPressedChange={setFavorite} />
            <p role="status">{favorite ? "즐겨찾기에 추가됨" :
                "즐겨찾기에 추가되지 않음"}</p>
        </div>
    );
}

const initialBoardPosts: BoardPost[] = [
    { id: "guide", title: "컴포넌트 사용 가이드", author: "운영팀",
        createdAt: "2026-09-30", category: "공지", replyCount: 2,
        summary: "새 컴포넌트를 설치하고 적용하는 방법을 공유합니다." },
    { id: "question", title: "테마 설정 질문", author: "민지",
        createdAt: "2026-09-29", category: "질문", replyCount: 1,
        summary: "색상 token을 어디에서 바꾸나요?" },
];

function BoardPreview() {
    const [posts, setPosts] = useState(initialBoardPosts);
    const nextPostId = useRef(1);
    const createButtonRef = useRef<HTMLElement | null>(null);
    const [selected, setSelected] = useState("guide");
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [summary, setSummary] = useState("");

    function createPost(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const id = `post-${nextPostId.current++}`;
        setPosts((current) => [{ id, title: title.trim(),
            summary: summary.trim(), author: "나",
            createdAt: new Date().toISOString().slice(0, 10),
            replyCount: 0 }, ...current]);
        setSelected(id);
        setTitle("");
        setSummary("");
        setOpen(false);
    }

    return (
        <div className="preview-stack">
            <Board label="컴포넌트 게시판" posts={posts}
                selectedPostId={selected} onSelectPost={setSelected}
                onCreatePost={() => {
                    createButtonRef.current = document.activeElement as
                        HTMLElement;
                    setOpen(true);
                }} />
            <p role="status">선택한 글: {posts.find((post) =>
                post.id === selected)?.title}</p>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent onCloseAutoFocus={(event) => {
                    event.preventDefault();
                    createButtonRef.current?.focus();
                }}>
                    <DialogHeader>
                        <DialogTitle>글쓰기</DialogTitle>
                        <DialogDescription>제목과 내용을 입력하세요.</DialogDescription>
                    </DialogHeader>
                    <form className="grid gap-3" onSubmit={createPost}>
                        <Label htmlFor="board-post-title">제목</Label>
                        <Input id="board-post-title" required value={title}
                            onChange={(event) => setTitle(event.target.value)} />
                        <Label htmlFor="board-post-summary">내용</Label>
                        <Textarea id="board-post-summary" required
                            value={summary} onChange={(event) =>
                                setSummary(event.target.value)} />
                        <DialogFooter>
                            <Button type="submit" disabled={!title.trim() ||
                                !summary.trim()}>게시</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

const initialThreadComments: ThreadComment[] = [
    { id: "first", parentId: null, author: "민지",
        content: "테마 token은 어디에서 설정하나요?",
        createdAt: "2026-09-30" },
    { id: "reply", parentId: "first", author: "운영팀",
        content: "Colormap 메뉴에서 확인하실 수 있습니다.",
        createdAt: "2026-09-30" },
];

function ThreadPreview() {
    const [comments, setComments] = useState(initialThreadComments);
    const nextCommentId = useRef(1);
    return <Thread label="댓글" comments={comments}
        onReply={(parentId, content) => {
            const id = `comment-${nextCommentId.current++}`;
            setComments((current) => [...current, { id, parentId,
                author: "나", content,
                createdAt: new Date().toISOString().slice(0, 10) }]);
        }} />;
}

function IconButtonPreview() {
    const [count, setCount] = useState(0);
    return <div className="preview-row">
        <IconButton label="항목 추가" icon={<Plus size={16} />}
            variant="primary" onClick={() => setCount((value) => value + 1)} />
        <IconButton label="항목 추가" icon={<Plus size={16} />}
            variant="outline" onClick={() => setCount((value) => value + 1)} />
        <IconButton label="항목 추가" icon={<Plus size={16} />}
            variant="ghost" onClick={() => setCount((value) => value + 1)} />
        <span role="status">추가한 항목 {count}개</span>
    </div>;
}

function TabsVariantPreview() {
    const [variant, setVariant] = useState<TabsVariant>("default");
    return <div className="space-y-4">
        <div className="preview-row" aria-label="탭 표시 형태">
            <Button variant={variant === "default" ? "primary" : "outline"}
                onClick={() => setVariant("default")}>기본</Button>
            <Button variant={variant === "line" ? "primary" : "outline"}
                onClick={() => setVariant("line")}>밑줄</Button>
            <Button variant={variant === "contained" ? "primary" : "outline"}
                onClick={() => setVariant("contained")}>채움</Button>
        </div>
        <Tabs defaultValue="overview">
            <TabsList variant={variant} aria-label="항목 보기">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
                <p className="preview-tabs-content">프로젝트의 주요 정보입니다.</p>
            </TabsContent>
            <TabsContent value="details">
                <p className="preview-tabs-content">선택한 항목의 상세 내용입니다.</p>
            </TabsContent>
        </Tabs>
    </div>;
}

export const catalog: ComponentEntry[] = [
    {
        id: "button", name: "Button", category: "Actions",
        description: "Primary, outline, ghost 변형과 disabled 상태를 지원하는 기본 동작 컴포넌트입니다.",
        code: `import { Button } from "@pydemia/ui";

<>
  <Button>저장하기</Button>
  <Button variant="outline">취소</Button>
  <Button variant="ghost" disabled>사용 불가</Button>
</>;`,
        preview: () => <div className="preview-row"><Button>저장하기</Button><Button variant="outline">취소</Button><Button variant="ghost">자세히 보기</Button><Button disabled>사용 불가</Button></div>,
    },
    {
        id: "icon-button", name: "IconButton", category: "Actions",
        description: "아이콘 전용 작업에 필수 이름을 부여하고 세 가지 Button 표시 형태를 사용합니다.",
        code: `import { useState } from "react";
import { Plus } from "lucide-react";
import { IconButton } from "@pydemia/ui";

function AddItem() {
  const [count, setCount] = useState(0);
  return <>
    <IconButton label="항목 추가" icon={<Plus size={16} />}
      variant="outline" onClick={() => setCount((value) => value + 1)} />
    <span role="status">추가한 항목 {count}개</span>
  </>;
}`,
        preview: () => <IconButtonPreview />,
    },
    {
        id: "button-group", name: "ButtonGroup", category: "Actions",
        description: "서로 관련된 작업 버튼을 이름 있는 그룹으로 묶습니다. 가로·세로 배치와 분리선, DropdownMenu를 조합한 분할 작업 예시를 제공합니다.",
        code: `import { useState } from "react";
import {
  Button, ButtonGroup, ButtonGroupSeparator,
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger,
} from "@pydemia/ui";

function QuantityActions() {
  const [quantity, setQuantity] = useState(1);
  return <ButtonGroup label="수량 조정">
    <Button onClick={() => setQuantity((value) => value - 1)}
      disabled={quantity === 0}>수량 줄이기</Button>
    <ButtonGroupSeparator />
    <Button onClick={() => setQuantity((value) => value + 1)}>
      수량 늘리기
    </Button>
  </ButtonGroup>;
}

function ReportActions() {
  const [action, setAction] = useState("없음");
  return <>
    <ButtonGroup label="보고서 저장 작업">
      <Button onClick={() => setAction("저장")}>보고서 저장</Button>
      <ButtonGroupSeparator />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" aria-label="다른 저장 방법">
            <span aria-hidden="true">▾</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onSelect={() => setAction("사본 저장")}>
            사본 저장
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setAction("CSV 내보내기")}>
            CSV 내보내기
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
    <p role="status">보고서 작업: {action}</p>
  </>;
}`,
        installItems: ["button-group", "button", "dropdown-menu"],
        preview: () => <ButtonGroupPreview />,
    },
    {
        id: "copy-button", name: "CopyButton", category: "Actions",
        description: "임의의 텍스트를 클립보드에 복사하고 성공·실패를 상태로 알립니다. icon·text 표시를 선택할 수 있습니다.",
        code: `import { useState } from "react";
import { CopyButton, Input } from "@pydemia/ui";

function RequestIdCopy() {
  const [value, setValue] = useState("REQ-2048");
  return <div>
    <label htmlFor="request-id">요청 ID</label>
    <Input id="request-id" value={value}
      onChange={(event) => setValue(event.target.value)} />
    <CopyButton value={value} label="요청 ID 복사" />
    <CopyButton value={value} label="요청 ID 텍스트 복사"
      appearance="text" />
  </div>;
}`,
        installItems: ["copy-button", "input"],
        preview: () => <CopyButtonPreview />,
    },
    {
        id: "action-bar", name: "ActionBar", category: "Actions",
        description: "표·카드·파일 목록에서 선택 건수, 일괄 작업과 해제를 묶습니다. inline·floating 배치를 지원하며 선택 상태는 호출자가 소유합니다.",
        code: `import { useRef, useState } from "react";
import { ActionBar, Button } from "@pydemia/ui";

function SelectedRequests() {
  const [selected, setSelected] = useState<string[]>([]);
  const first = useRef<HTMLInputElement>(null);
  const ids = ["REQ-1", "REQ-2", "REQ-3"];
  const clear = () => {
    setSelected([]);
    first.current?.focus();
  };
  return <div>
    {ids.map((id, index) => <label key={id}>
      <input ref={index === 0 ? first : undefined}
        type="checkbox" checked={selected.includes(id)}
        onChange={(event) => setSelected((current) =>
          event.target.checked ? [...current, id] :
          current.filter((item) => item !== id))} />
      {id}
    </label>)}
    {selected.length > 0 && <ActionBar aria-label="요청 선택 작업"
      selectedCount={selected.length} placement="floating"
      onClear={clear}>
      <Button variant="outline" onClick={() => {
        console.log(selected);
        clear();
      }}>보관</Button>
    </ActionBar>}
  </div>;
}`,
        installItems: ["action-bar", "button"],
        preview: () => <ActionBarPreview />,
    },
    {
        id: "input", name: "Input", category: "Inputs",
        installItems: ["input", "label"],
        description: "기본 HTML input을 토큰에 맞춰 정리했습니다. Label과 함께 사용합니다.",
        code: `import { Input, Label } from "@pydemia/ui";

<>
  <Label htmlFor="project-name">프로젝트 이름</Label>
  <Input id="project-name" placeholder="예: design-system" />
</>;`,
        preview: () => <div className="preview-field"><Label htmlFor="demo-project">프로젝트 이름</Label><Input id="demo-project" placeholder="예: design-system" /></div>,
    },
    {
        id: "search-input", name: "SearchInput", category: "Inputs",
        description: "검색어 입력·제출·초기화를 묶습니다. onSearch가 있으면 callback을 실행하고, 없으면 native form을 제출합니다.",
        code: `import { useState } from "react";
import { SearchInput } from "@pydemia/ui";

function ProjectSearch() {
  const [query, setQuery] = useState("");
  const [applied, setApplied] = useState("");

  return <>
    <SearchInput label="프로젝트 검색" name="q"
      value={query} onValueChange={setQuery}
      onSearch={setApplied} placeholder="항목 이름" />
    <p role="status">적용한 검색어: {applied || "전체"}</p>
  </>;
}`,
        preview: () => <SearchInputPreview />,
    },
    {
        id: "input-group", name: "InputGroup", category: "Inputs",
        description: "텍스트·버튼을 입력 안쪽에 배치합니다. 입력과 버튼은 각각 native form·keyboard 동작을 유지하며 textarea 아래에도 작업을 놓을 수 있습니다.",
        installItems: ["input-group", "field"],
        code: `import {
  Field, InputGroup, InputGroupAddon, InputGroupButton,
  InputGroupInput, InputGroupText,
} from "@pydemia/ui";

<form action="/requests" method="get">
  <Field label="요청 ID">
    {(control) => <InputGroup>
      <InputGroupInput {...control} name="requestId" />
      <InputGroupAddon align="inline-start">
        <InputGroupText>REQ</InputGroupText>
      </InputGroupAddon>
      <InputGroupAddon align="inline-end">
        <InputGroupButton type="submit">조회</InputGroupButton>
      </InputGroupAddon>
    </InputGroup>}
  </Field>
</form>`,
        preview: () => <InputGroupPreview />,
    },
    {
        id: "number-input", name: "NumberInput", category: "Inputs",
        description: "범위와 step이 있는 숫자를 입력합니다. locale 형식으로 표시하고, 잘못된 입력은 확정 값과 분리해 알리며 form에는 표준 숫자 문자열을 제출합니다.",
        code: `import { useState } from "react";
import { NumberInput } from "@pydemia/ui";

function MonthlyVolume() {
  const [amount, setAmount] = useState<number | null>(1234.5);
  return <form onSubmit={(event) => {
    event.preventDefault();
    console.log(new FormData(event.currentTarget).get("amount"));
  }}>
    <NumberInput label="월별 처리량" name="amount"
      value={amount} onValueChange={setAmount}
      min={0} max={10000} step={0.5} locale="ko-KR"
      variant="stepper" required />
    <button type="submit">제출</button>
  </form>;
}`,
        preview: () => <NumberInputPreview />,
    },
    {
        id: "tags-input", name: "TagsInput", category: "Inputs",
        description: "자유 입력 태그를 Enter·쉼표로 추가합니다. 대소문자를 무시해 중복을 막고, 입력창의 Backspace와 삭제 버튼으로 제거합니다. form에는 같은 이름의 값을 여러 개 제출합니다.",
        code: `import { useState } from "react";
import { TagsInput } from "@pydemia/ui";

function SkillsField() {
  const [skills, setSkills] = useState(["React", "Tailwind"]);
  return <form onSubmit={(event) => {
    event.preventDefault();
    console.log(new FormData(event.currentTarget).getAll("skills"));
  }}>
    <TagsInput label="기술 태그" name="skills" value={skills}
      onValueChange={setSkills} maxTags={5} required
      placeholder="태그 입력" variant="outline" />
    <button type="submit">제출</button>
  </form>;
}`,
        preview: () => <TagsInputPreview />,
    },
    {
        id: "color-input", name: "ColorInput", category: "Inputs",
        description: "6자리 hex 입력과 native 색상 선택기를 함께 제공합니다. 유효하지 않은 입력은 저장하지 않고 해당 필드에 오류를 표시합니다.",
        code: `import { useState } from "react";
import { ColorInput } from "@pydemia/ui";

function AccentColorField() {
  const [accent, setAccent] = useState("#ba365b");

  return <ColorInput label="강조색" name="accentColor"
    value={accent} onValueChange={setAccent} variant="card" />;
}`,
        preview: () => <ColorInputPreview />,
    },
    {
        id: "password-input", name: "PasswordInput", category: "Inputs",
        description: "비밀번호의 표시 상태를 이름 있는 toggle button으로 바꿉니다. 입력값과 form 전송은 native input이 맡습니다.",
        code: `import { Label, PasswordInput } from "@pydemia/ui";

<>
  <Label htmlFor="account-password">비밀번호</Label>
  <PasswordInput id="account-password" name="password"
    autoComplete="current-password" required />
</>;`,
        installItems: ["password-input", "label"],
        preview: () => <PasswordInputPreview />,
    },
    {
        id: "pin-input", name: "PinInput", category: "Inputs",
        description: "하나의 native 입력값을 여러 칸으로 보여줍니다. 숫자 코드의 붙여넣기·삭제·form 제출을 지원하고 one-time-code 자동완성 속성을 설정합니다. Outline·Soft 표면을 고를 수 있습니다.",
        code: `import { PinInput } from "@pydemia/ui";

function CodeForm({ onVerify }: {
  onVerify: (code: string) => void;
}) {
  return <form onSubmit={(event) => {
    event.preventDefault();
    const code = new FormData(event.currentTarget).get("code");
    if (typeof code === "string") onVerify(code);
  }}>
    <PinInput label="확인 코드" name="code" length={6}
      groupSize={3} variant="outline" required />
    <button type="submit">확인</button>
  </form>;
}`,
        preview: () => <PinInputPreview />,
    },
    {
        id: "rating", name: "Rating", category: "Inputs",
        description: "Native radio로 1~5점 입력과 form 제출을 지원합니다. 별점과 숫자 segment 모양을 고르고, 읽기 전용 점수도 표시합니다.",
        code: `import { useState } from "react";
import { Rating } from "@pydemia/ui";

function ReviewForm() {
  const [score, setScore] = useState(0);
  return <form onSubmit={(event) => {
    event.preventDefault();
    console.log(new FormData(event.currentTarget).get("score"));
  }}>
    <Rating label="검토 점수" name="score" required
      value={score} onValueChange={setScore} variant="stars" />
    <button type="submit">제출</button>
    <Rating label="평균 점수" value={4}
      variant="segments" readOnly />
  </form>;
}`,
        preview: () => <RatingPreview />,
    },
    {
        id: "label", name: "Label", category: "Inputs",
        installItems: ["label", "input"],
        description: "form control과 직접 연결되는 native label입니다.",
        code: `import { Input, Label } from "@pydemia/ui";

<>
  <Label htmlFor="email">이메일</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</>;`,
        preview: () => <div className="preview-field"><Label htmlFor="demo-email">이메일</Label><Input id="demo-email" type="email" placeholder="you@example.com" /></div>,
    },
    {
        id: "badge", name: "Badge", category: "Data display",
        description: "텍스트 상태를 기본·외곽선·강조·위험 형태로 표시합니다. 색상만으로 의미를 전달하지 않습니다.",
        code: `import { Badge } from "@pydemia/ui";

<>
  <Badge>완료</Badge>
  <Badge variant="outline">검토 대기</Badge>
  <Badge variant="accent">실행 중</Badge>
  <Badge variant="danger">실패</Badge>
</>;`,
        preview: () => <div className="preview-row">
            <Badge>완료</Badge>
            <Badge variant="outline">검토 대기</Badge>
            <Badge variant="accent">실행 중</Badge>
            <Badge variant="danger">실패</Badge>
        </div>,
    },
    {
        id: "checkbox", name: "Checkbox", category: "Selection",
        installItems: ["checkbox", "label"],
        description: "작은 checkbox와 설명이 있는 카드형 checkbox를 선택합니다. 기본형은 Label을 연결합니다.",
        code: `import { Checkbox, Label } from "@pydemia/ui";

<>
  <div>
    <Checkbox id="notifications" defaultChecked />
    <Label htmlFor="notifications">알림 받기</Label>
  </div>
  <Checkbox variant="card" label="일일 요약 받기"
    description="매일 오전에 보냅니다." name="digest"
    value="daily" defaultChecked />
  <Checkbox aria-label="일부 선택" defaultChecked="indeterminate" />
  <Checkbox aria-label="사용할 수 없는 옵션" disabled />
</>;`,
        preview: () => <CheckboxPreview />,
    },
    {
        id: "dialog", name: "Dialog", category: "Overlays",
        installItems: ["dialog", "button"],
        description: "제목·설명과 닫기 동작을 명시하는 모달입니다. focus 이동과 복원을 처리합니다.",
        code: `import {
  Button, Dialog, DialogClose, DialogContent, DialogDescription,
  DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@pydemia/ui";

<Dialog>
  <DialogTrigger asChild><Button>설정 열기</Button></DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>알림 설정</DialogTitle>
      <DialogDescription>설정을 확인하세요.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild><Button variant="outline">닫기</Button></DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>`,
        preview: () => <DialogPreview />,
    },
    {
        id: "command-palette", name: "CommandPalette",
        category: "Overlays",
        description: "Ctrl/Cmd+K로 열고 명령을 검색합니다. 그룹·비활성 명령과 방향키·Enter 실행을 지원합니다.",
        code: `import { useState } from "react";
import { Button, CommandPalette } from "@pydemia/ui";

const commands = [
  { id: "overview", label: "개요로 이동", group: "탐색" },
  { id: "logs", label: "로그 콘솔 열기", group: "도구",
    keywords: ["console"] },
  { id: "archive", label: "보관함 열기", group: "도구",
    disabled: true },
];

function AppCommands() {
  const [selected, setSelected] = useState("");
  return <>
    <CommandPalette commands={commands}
      trigger={<Button variant="outline">명령 검색 · Ctrl K</Button>}
      onSelect={setSelected} keyboardShortcut />
    <p role="status">실행: {selected || "없음"}</p>
  </>;
}`,
        installItems: ["command-palette", "button"],
        preview: () => <CommandPalettePreview />,
    },
    {
        id: "drawer", name: "Drawer", category: "Overlays",
        description: "상세 정보나 빠른 작업을 화면 가장자리에 여는 modal 패널입니다. Escape와 닫기 버튼으로 닫고 열기 버튼으로 focus가 돌아갑니다.",
        code: `import {
  Button, Drawer, DrawerTrigger, DrawerContent,
  DrawerHeader, DrawerTitle, DrawerDescription,
  DrawerFooter, DrawerClose,
} from "@pydemia/ui";

<Drawer>
  <DrawerTrigger asChild>
    <Button variant="outline">상세 패널 열기</Button>
  </DrawerTrigger>
  <DrawerContent side="right">
    <DrawerHeader>
      <DrawerTitle>요청 상세</DrawerTitle>
      <DrawerDescription>상태와 담당자를 확인합니다.</DrawerDescription>
    </DrawerHeader>
    <p>초대 화면 · 제품팀 · 진행 중</p>
    <DrawerFooter>
      <DrawerClose asChild><Button variant="outline">닫기</Button></DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>`,
        installItems: ["drawer", "button"],
        preview: () => <DrawerPreview />,
    },
    {
        id: "dropdown-menu", name: "DropdownMenu", category: "Overlays",
        description: "요청 작업을 메뉴로 묶습니다. 항목 선택, checked 상태, submenu, disabled 상태와 방향키 탐색을 지원합니다.",
        code: `import {
  Button, DropdownMenu, DropdownMenuTrigger,
  DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuCheckboxItem, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuSeparator,
  DropdownMenuSub, DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@pydemia/ui";
import { useState } from "react";

function RequestActions() {
  const [showCompleted, setShowCompleted] = useState(true);
  const [density, setDensity] = useState("standard");
  return <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline">요청 작업</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="start">
      <DropdownMenuLabel>화면 개선 요청</DropdownMenuLabel>
      <DropdownMenuItem onSelect={() => console.log("상세 보기")}>
        상세 보기
      </DropdownMenuItem>
      <DropdownMenuCheckboxItem checked={showCompleted}
        onCheckedChange={(value) => setShowCompleted(value === true)}>
        완료 항목 표시
      </DropdownMenuCheckboxItem>
      <DropdownMenuRadioGroup value={density}
        onValueChange={setDensity}>
        <DropdownMenuRadioItem value="standard">기본 밀도</DropdownMenuRadioItem>
        <DropdownMenuRadioItem value="compact">좁은 밀도</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>내보내기</DropdownMenuSubTrigger>
        <DropdownMenuSubContent>
          <DropdownMenuItem onSelect={() => console.log("CSV")}>
            CSV
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuSub>
      <DropdownMenuSeparator />
      <DropdownMenuItem variant="danger"
        onSelect={() => console.log("보관")}>
        보관
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>;
}`,
        installItems: ["dropdown-menu", "button"],
        preview: () => <DropdownMenuPreview />,
    },
    {
        id: "context-menu", name: "ContextMenu", category: "Overlays",
        description: "카드와 목록 항목에서 우클릭 또는 Shift+F10으로 작업 메뉴를 엽니다. 선택, 상태 변경, submenu를 지원합니다.",
        code: `import {
  ContextMenu, ContextMenuTrigger, ContextMenuContent,
  ContextMenuItem, ContextMenuLabel, ContextMenuCheckboxItem,
  ContextMenuRadioGroup, ContextMenuRadioItem,
  ContextMenuSub, ContextMenuSubTrigger, ContextMenuSubContent,
  ContextMenuSeparator,
} from "@pydemia/ui";
import { useState } from "react";

function RequestContextMenu() {
  const [showArchived, setShowArchived] = useState(false);
  const [density, setDensity] = useState("standard");
  return <ContextMenu>
    <ContextMenuTrigger asChild>
      <button type="button">요청 카드 · 우클릭 또는 Shift+F10</button>
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuLabel>화면 개선 요청</ContextMenuLabel>
      <ContextMenuItem onSelect={() => console.log("상세 보기")}>
        상세 보기
      </ContextMenuItem>
      <ContextMenuCheckboxItem checked={showArchived}
        onCheckedChange={(value) => setShowArchived(value === true)}>
        보관 항목 표시
      </ContextMenuCheckboxItem>
      <ContextMenuRadioGroup value={density}
        onValueChange={setDensity}>
        <ContextMenuRadioItem value="standard">기본 밀도</ContextMenuRadioItem>
        <ContextMenuRadioItem value="compact">좁은 밀도</ContextMenuRadioItem>
      </ContextMenuRadioGroup>
      <ContextMenuSub>
        <ContextMenuSubTrigger>내보내기</ContextMenuSubTrigger>
        <ContextMenuSubContent>
          <ContextMenuItem onSelect={() => console.log("CSV")}>
            CSV
          </ContextMenuItem>
        </ContextMenuSubContent>
      </ContextMenuSub>
      <ContextMenuSeparator />
      <ContextMenuItem variant="danger"
        onSelect={() => console.log("보관")}>보관</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>;
}`,
        preview: () => <ContextMenuPreview />,
    },
    {
        id: "alert", name: "Alert", category: "Feedback",
        description: "기본·정보·성공·주의·오류 상태와 outline·soft·plain 표시를 독립적으로 선택합니다. 오류만 긴급한 alert 역할을 사용합니다.",
        code: `import { Alert, AlertTitle, AlertDescription } from "@pydemia/ui";

<>
  <Alert>
    <AlertTitle>안내</AlertTitle>
    <AlertDescription>변경 사항을 확인하세요.</AlertDescription>
  </Alert>
  <Alert variant="success" appearance="soft">
    <AlertTitle>저장되었습니다</AlertTitle>
    <AlertDescription>변경 사항이 반영됐습니다.</AlertDescription>
  </Alert>
  <Alert variant="warning" appearance="plain">
    <AlertTitle>확인이 필요합니다</AlertTitle>
    <AlertDescription>만료 예정 항목을 검토하세요.</AlertDescription>
  </Alert>
  <Alert variant="destructive">
    <AlertTitle>저장하지 못했습니다</AlertTitle>
    <AlertDescription>입력값을 확인하세요.</AlertDescription>
  </Alert>
</>;`,
        preview: () => <AlertPreview />,
    },
    {
        id: "textarea", name: "Textarea", category: "Inputs",
        installItems: ["textarea", "label"],
        description: "여러 줄 입력에 쓰는 native textarea입니다. label과 오류 상태는 사용하는 form에서 연결합니다.",
        code: `import { Label, Textarea } from "@pydemia/ui";

<>
  <Label htmlFor="notes">메모</Label>
  <Textarea id="notes" rows={3} placeholder="메모를 입력하세요" />
</>;`,
        preview: () => <div className="preview-stack"><Label htmlFor="demo-notes">메모</Label><Textarea id="demo-notes" rows={3} placeholder="메모를 입력하세요" /></div>,
    },
    {
        id: "native-select", name: "NativeSelect", category: "Selection",
        installItems: ["native-select", "label"],
        description: "브라우저의 native select 동작을 유지하면서 입력 높이와 색상을 맞췄습니다.",
        code: `import { Label, NativeSelect } from "@pydemia/ui";

<>
  <Label htmlFor="density">화면 밀도</Label>
  <NativeSelect id="density" defaultValue="standard">
    <option value="standard">기본</option>
    <option value="compact">좁게</option>
  </NativeSelect>
</>;`,
        preview: () => <NativeSelectPreview />,
    },
    {
        id: "switch", name: "Switch", category: "Selection",
        installItems: ["switch", "label"],
        description: "즉시 적용되는 설정에 쓰는 switch입니다. 현재 상태를 화면에도 텍스트로 표시합니다.",
        code: `import { Label, Switch } from "@pydemia/ui";

<>
  <Switch id="email-alerts" defaultChecked />
  <Label htmlFor="email-alerts">이메일 알림</Label>
</>;`,
        preview: () => <SwitchPreview />,
    },
    {
        id: "radio-group", name: "RadioGroup", category: "Selection",
        installItems: ["radio-group", "label"],
        description: "한 옵션을 선택하는 작은 radio와 설명이 있는 카드형 radio입니다. 방향키 이동과 form 값을 지원합니다.",
        code: `import { Label, RadioGroup, RadioGroupItem } from "@pydemia/ui";

<RadioGroup aria-label="화면 밀도" name="density"
  defaultValue="standard">
  <div>
    <RadioGroupItem id="standard" value="standard" />
    <Label htmlFor="standard">기본</Label>
  </div>
  <div>
    <RadioGroupItem id="compact" value="compact" />
    <Label htmlFor="compact">좁게</Label>
  </div>
  <RadioGroupItem variant="card" value="detailed"
    label="자세히" description="항목 설명까지 표시합니다." />
</RadioGroup>`,
        preview: () => <RadioGroupPreview />,
    },
    {
        id: "segmented-control", name: "SegmentedControl",
        category: "Selection",
        description: "한 값을 선택해 form에 제출하는 가로 분할 control입니다. 방향키 탐색과 비활성 항목을 지원합니다.",
        code: `import { useState } from "react";
import {
  Button, SegmentedControl, SegmentedControlItem,
} from "@pydemia/ui";

function DensitySetting() {
  const [density, setDensity] = useState("standard");
  return <form onSubmit={(event) => {
    event.preventDefault();
    console.log(new FormData(event.currentTarget).get("density"));
  }}>
    <SegmentedControl label="화면 밀도" name="density"
      value={density} onValueChange={setDensity}>
      <SegmentedControlItem value="standard">기본</SegmentedControlItem>
      <SegmentedControlItem value="compact">밀집</SegmentedControlItem>
    </SegmentedControl>
    <Button type="submit">적용</Button>
  </form>;
}`,
        installItems: ["segmented-control", "button"],
        preview: () => <SegmentedControlPreview />,
    },
    {
        id: "card", name: "Card", category: "Layout",
        installItems: ["card", "badge"],
        description: "제목·설명·본문·동작을 묶고 default·subtle·elevated 표면과 기본·compact 간격을 선택합니다.",
        code: `import {
  Badge, Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle,
} from "@pydemia/ui";

<Card variant="subtle" size="compact">
  <CardHeader>
    <CardTitle>검토 대기</CardTitle>
    <CardDescription>새 component 3개</CardDescription>
  </CardHeader>
  <CardContent>등록 전 확인이 필요합니다.</CardContent>
  <CardFooter><Badge>검토 대기</Badge></CardFooter>
</Card>`,
        preview: () => <CardPreview />,
    },
    {
        id: "separator", name: "Separator", category: "Layout",
        description: "콘텐츠 구획을 가르는 가로·세로 선입니다. 기본값은 장식적 분리선입니다.",
        code: `import { Separator } from "@pydemia/ui";

<>
  <div>프로젝트 정보</div>
  <Separator className="my-3" />
  <div>권한 정보</div>
</>;`,
        preview: () => <div className="preview-stack"><span>프로젝트 정보</span><Separator /><span>권한 정보</span></div>,
    },
    {
        id: "progress", name: "Progress", category: "Feedback",
        description: "선형·원형 진행 상태를 표시합니다. 접근 가능한 이름을 지정하고, 값이 없으면 진행 중으로 표현합니다.",
        code: `import { Progress } from "@pydemia/ui";

<>
  <Progress aria-label="업로드 진행률" value={30} />
  <Progress aria-label="원형 업로드 진행률" value={30}
    variant="circular" showValue />
  <Progress aria-label="동기화 중" value={null}
    variant="circular" />
</>;`,
        preview: () => <ProgressPreview />,
    },
    {
        id: "skeleton", name: "Skeleton", category: "Feedback",
        description: "불러오는 동안 직사각형·텍스트 줄·원형 자리를 표시합니다. 움직임 줄이기 설정을 따르며 로딩 상태 텍스트는 상위 요소가 제공합니다.",
        code: `import { Skeleton } from "@pydemia/ui";

<div role="status">
  <span className="sr-only">내용을 불러오는 중</span>
  <Skeleton shape="circle" />
  <Skeleton shape="line" className="w-40" />
  <Skeleton shape="rectangle" className="h-12 w-24" />
</div>`,
        preview: () => <SkeletonPreview />,
    },
    {
        id: "tooltip", name: "Tooltip", category: "Overlays",
        installItems: ["tooltip", "button"],
        description: "hover와 keyboard focus로 보이는 짧은 설명입니다. trigger는 자체 이름을 가져야 합니다.",
        code: `import {
  Button, Tooltip, TooltipContent,
  TooltipProvider, TooltipTrigger,
} from "@pydemia/ui";

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline">검토 상태</Button>
    </TooltipTrigger>
    <TooltipContent>등록 전 확인이 필요합니다.</TooltipContent>
  </Tooltip>
</TooltipProvider>`,
        preview: () => <div className="preview-row"><TooltipProvider><Tooltip><TooltipTrigger asChild><Button variant="outline">검토 상태</Button></TooltipTrigger><TooltipContent>등록 전 확인이 필요합니다.</TooltipContent></Tooltip></TooltipProvider></div>,
    },
    {
        id: "accordion", name: "Accordion", category: "Overlays",
        description: "여러 section을 펼쳐 내용을 확인합니다. 방향키 이동과 heading 구조를 사용합니다.",
        code: `import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@pydemia/ui";

<Accordion type="single" collapsible>
  <AccordionItem value="source">
    <AccordionTrigger>출처는 어디인가요?</AccordionTrigger>
    <AccordionContent>공식 upstream과 동일 revision의 소스를 확인합니다.</AccordionContent>
  </AccordionItem>
</Accordion>`,
        preview: () => <Accordion type="single" collapsible className="preview-stack"><AccordionItem value="source"><AccordionTrigger>출처는 어디인가요?</AccordionTrigger><AccordionContent>공식 upstream과 동일 revision의 소스를 확인합니다.</AccordionContent></AccordionItem><AccordionItem value="license"><AccordionTrigger>라이선스는 확인했나요?</AccordionTrigger><AccordionContent>동일 revision의 MIT LICENSE를 확인했습니다.</AccordionContent></AccordionItem></Accordion>,
    },
    {
        id: "collapsible", name: "Collapsible", category: "Overlays",
        installItems: ["collapsible", "button"],
        description: "한 영역의 부가 정보를 펼치거나 접습니다. trigger와 content의 연결을 유지합니다.",
        code: `import { Button, Collapsible, CollapsibleTrigger, CollapsibleContent } from "@pydemia/ui";

<Collapsible>
  <CollapsibleTrigger asChild><Button variant="outline">세부 정보</Button></CollapsibleTrigger>
  <CollapsibleContent>검토 대상 component 3개</CollapsibleContent>
</Collapsible>`,
        preview: () => <CollapsiblePreview />,
    },
    {
        id: "popover", name: "Popover", category: "Overlays",
        installItems: ["popover", "button"],
        description: "trigger에서 열리는 부가 설정 영역입니다. focus 이동, Escape 닫기와 복원을 처리합니다.",
        code: `import { Button, Popover, PopoverTrigger, PopoverContent, PopoverClose } from "@pydemia/ui";

<Popover>
  <PopoverTrigger asChild><Button variant="outline">표시 옵션</Button></PopoverTrigger>
  <PopoverContent aria-label="표시 옵션">
    <p>화면에 표시할 항목을 선택하세요.</p>
    <PopoverClose asChild><Button variant="outline">닫기</Button></PopoverClose>
  </PopoverContent>
</Popover>`,
        preview: () => <Popover><PopoverTrigger asChild><Button variant="outline">표시 옵션</Button></PopoverTrigger><PopoverContent aria-label="표시 옵션" className="preview-stack"><p>화면에 표시할 항목을 선택하세요.</p><PopoverClose asChild><Button variant="outline">닫기</Button></PopoverClose></PopoverContent></Popover>,
    },
    {
        id: "hover-card", name: "HoverCard", category: "Overlays",
        description: "링크 목적지의 보조 요약을 hover와 focus에서 미리 보여줍니다. 핵심 정보는 링크 목적지에 둡니다.",
        code: `import {
  HoverCard, HoverCardTrigger, HoverCardContent,
} from "@pydemia/ui";

<HoverCard openDelay={150} closeDelay={150}>
  <HoverCardTrigger asChild>
    <a href="#examples">프로필 예시</a>
  </HoverCardTrigger>
  <HoverCardContent side="bottom" align="start">
    <strong>프로필 예시</strong>
    <p>입력, 표, 코드 블록을 조합한 화면입니다.</p>
  </HoverCardContent>
</HoverCard>`,
        preview: () => <HoverCard openDelay={150} closeDelay={150}>
            <HoverCardTrigger asChild>
                <a href="#examples" className="text-sm font-medium text-accent underline underline-offset-4">프로필 예시 미리보기</a>
            </HoverCardTrigger>
            <HoverCardContent side="bottom" align="start">
                <strong className="text-sm">프로필 예시</strong>
                <p className="mb-0 mt-2 text-xs text-muted">입력, 표, 코드 블록을 조합한 화면입니다.</p>
            </HoverCardContent>
        </HoverCard>,
    },
    {
        id: "alert-dialog", name: "AlertDialog", category: "Overlays",
        installItems: ["alert-dialog", "button"],
        description: "되돌리기 어려운 동작을 확인합니다. 취소와 실행 동작을 모두 명시합니다.",
        code: `import { AlertDialog, AlertDialogTrigger, AlertDialogContent,
  AlertDialogHeader, AlertDialogTitle, AlertDialogDescription,
  AlertDialogFooter, AlertDialogCancel, AlertDialogAction, Button } from "@pydemia/ui";

<AlertDialog>
  <AlertDialogTrigger asChild><Button>항목 삭제</Button></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>항목을 삭제하시겠습니까?</AlertDialogTitle>
      <AlertDialogDescription>삭제하면 목록에서 사라집니다.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel asChild><Button variant="outline">취소</Button></AlertDialogCancel>
      <AlertDialogAction asChild><Button>삭제</Button></AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>`,
        preview: () => <AlertDialogPreview />,
    },
    {
        id: "avatar", name: "Avatar", category: "Data display",
        description: "사용자 이미지가 없거나 로드되지 않으면 읽을 수 있는 fallback을 표시합니다.",
        code: `import { Avatar, AvatarImage, AvatarFallback } from "@pydemia/ui";

<Avatar>
  <AvatarImage src="/profile.jpg" alt="김하나" />
  <AvatarFallback>김하나</AvatarFallback>
</Avatar>`,
        preview: () => <AvatarPreview />,
    },
    {
        id: "avatar-group", name: "AvatarGroup", category: "Data display",
        description: "이름이 있는 목록에 여러 사람을 겹쳐 표시하고, 초과 인원 수와 가려진 사람의 이름을 전달합니다. 크기·표시 인원·빈 목록을 설정합니다.",
        code: `import { AvatarGroup } from "@pydemia/ui";

const reviewers = [
  { id: "hana", name: "김하나", fallback: "김" },
  { id: "jimin", name: "박지민", fallback: "박" },
  { id: "soyeon", name: "이소연", fallback: "이" },
];

<AvatarGroup label="검토 팀" members={reviewers}
  maxVisible={2} size="sm"
  overflowLabel="추가 1명: 이소연" />`,
        preview: () => <AvatarGroupPreview />,
    },
    {
        id: "breadcrumb", name: "Breadcrumb", category: "Navigation",
        description: "현재 위치의 상위 경로를 nav와 순서 있는 목록으로 표시합니다.",
        code: `import { Breadcrumb, BreadcrumbList, BreadcrumbItem,
  BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "@pydemia/ui";

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem><BreadcrumbLink href="/">홈</BreadcrumbLink></BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem><BreadcrumbPage>컴포넌트</BreadcrumbPage></BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`,
        preview: () => <Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href="#components">컴포넌트</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>,
    },
    {
        id: "empty", name: "Empty", category: "Feedback",
        installItems: ["empty", "button"],
        description: "항목이 없는 상태와 다음 동작을 제목·설명·버튼으로 전달합니다. dashed·panel·plain 표시를 위치에 맞게 고를 수 있습니다.",
        code: `import { useState } from "react";
import { Empty, EmptyTitle, EmptyDescription, EmptyContent, Button } from "@pydemia/ui";

function ItemList() {
  const [items, setItems] = useState<string[]>([]);
  if (items.length) return <ul>{items.map((item) =>
    <li key={item}>{item}</li>)}</ul>;
  return <Empty appearance="plain">
    <EmptyTitle>아직 항목이 없습니다</EmptyTitle>
    <EmptyDescription>새 항목을 추가해 시작하세요.</EmptyDescription>
    <EmptyContent><Button onClick={() =>
      setItems(["새 항목"])}>항목 추가</Button></EmptyContent>
  </Empty>;
}`,
        preview: () => <EmptyPreview />,
    },
    {
        id: "result-state", name: "ResultState", category: "Feedback",
        installItems: ["result-state"],
        description: "한 작업의 진행·성공·실패 결과를 같은 위치에 표시하고 실패 시 재시도를 요청합니다. 상태와 실제 요청은 호출자가 관리합니다.",
        code: `import { useState } from "react";
import { ResultState, type ResultStatus } from "@pydemia/ui";

function SaveResult({ retrySave }: { retrySave: () => Promise<void> }) {
  const [status, setStatus] = useState<ResultStatus>("error");

  async function retry() {
    setStatus("pending");
    try {
      await retrySave();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return <ResultState status={status}
    title={{
      pending: "저장하는 중입니다",
      success: "저장했습니다",
      error: "저장하지 못했습니다",
    }[status]}
    description={status === "error"
      ? "연결을 확인하고 다시 시도해 주세요." : undefined}
    onRetry={retry} />;
}`,
        preview: () => <ResultStatePreview />,
    },
    {
        id: "spinner", name: "Spinner", category: "Feedback",
        description: "icon·ring·dots·bars·orbit 다섯 형태로 진행 중 상태를 표시합니다. 크기를 조절할 수 있고 움직임 줄이기 설정에서는 정지 형태로 남습니다.",
        code: `import { Spinner } from "@pydemia/ui";

<>
  <Spinner variant="icon" aria-label="불러오는 중" />
  <Spinner variant="ring" aria-label="불러오는 중" />
  <Spinner variant="dots" aria-label="불러오는 중" />
  <Spinner variant="bars" aria-label="불러오는 중" />
  <Spinner variant="orbit" className="size-6"
    aria-label="불러오는 중" />
</>;`,
        preview: () => <div className="preview-row">
            {(["icon", "ring", "dots", "bars", "orbit"] as const)
                .map((variant) => (
                    <span key={variant} className={
                        "inline-flex items-center gap-2 rounded-sm " +
                        "border border-border px-2 py-1.5 text-xs"
                    }>
                        <Spinner variant={variant} className="size-5"
                            aria-label={`${variant} 로딩`} />
                        <span aria-hidden="true">{variant}</span>
                    </span>
                ))}
        </div>,
    },
    {
        id: "toggle", name: "Toggle", category: "Actions",
        description: "눌림 상태를 유지하는 동작 버튼입니다. aria-pressed 상태를 사용합니다.",
        code: `import { Toggle } from "@pydemia/ui";

<Toggle aria-label="굵게" defaultPressed>굵게</Toggle>`,
        preview: () => <TogglePreview />,
    },
    {
        id: "toggle-group", name: "ToggleGroup", category: "Actions",
        description: "보기 모드 등 여러 토글을 한 그룹에서 조작합니다. 단일·복수 선택, 방향키 이동, 비활성 항목을 지원합니다. form 제출용 선택에는 RadioGroup을 사용합니다.",
        code: `import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@pydemia/ui";

function ViewMode() {
  const [view, setView] = useState("cards");
  return <ToggleGroup type="single" aria-label="보기 방식"
    value={view} onValueChange={(next) => {
      if (next) setView(next);
    }}>
    <ToggleGroupItem value="cards">카드</ToggleGroupItem>
    <ToggleGroupItem value="list">목록</ToggleGroupItem>
  </ToggleGroup>;
}

<ToggleGroup type="multiple" aria-label="표시 정보"
  defaultValue={["summary"]}>
  <ToggleGroupItem value="summary">요약</ToggleGroupItem>
  <ToggleGroupItem value="date">날짜</ToggleGroupItem>
</ToggleGroup>`,
        preview: () => <ToggleGroupPreview />,
    },
    {
        id: "slider", name: "Slider", category: "Selection",
        description: "단일 값 또는 범위 값을 조절합니다. 각 thumb에 접근 가능한 이름을 지정합니다.",
        code: `import { Slider } from "@pydemia/ui";

<>
  <Slider aria-label="음량" defaultValue={[40]} min={0} max={100} />
  <Slider aria-label="목표 구간" defaultValue={[20, 80]}
    min={0} max={100} minStepsBetweenThumbs={1} />
</>;`,
        preview: () => <SliderPreview />,
    },
    {
        id: "range-slider", name: "RangeSlider", category: "Selection",
        description: "두 thumb에 이름을 붙이고 최솟값과 최댓값을 각각 form에 제출합니다.",
        code: `import { RangeSlider } from "@pydemia/ui";

function PriceFilter() {
  return <form onSubmit={(event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log(data.get("minPrice"), data.get("maxPrice"));
  }}>
    <RangeSlider label="월 이용료 범위"
      minLabel="최저 가격" maxLabel="최고 가격"
      minName="minPrice" maxName="maxPrice"
      min={0} max={100} step={5} defaultValue={[20, 80]}
      minStepsBetweenThumbs={1}
      formatValue={(amount) => String(amount) + "만원"} />
    <button type="submit">범위 적용</button>
    <button type="reset">초기화</button>
  </form>;
}`,
        preview: () => <RangeSliderPreview />,
    },
    {
        id: "calendar", name: "Calendar", category: "Date & time",
        description: "React DayPicker의 날짜 선택과 키보드 이동을 공통 token으로 표시합니다.",
        code: `import { Calendar } from "@pydemia/ui";
import { TZDate, type DateRange } from "react-day-picker";
import { ko } from "react-day-picker/locale";
import { useState } from "react";

function DateExample() {
  const [range, setRange] = useState<DateRange | undefined>();
  return <Calendar mode="range" min={1} locale={ko} timeZone="Asia/Seoul"
    defaultMonth={new TZDate(2026, 8, 1, "Asia/Seoul")}
    selected={range} onSelect={setRange} />;
}`,
        preview: () => <CalendarPreview />,
    },
    {
        id: "metric-card", name: "MetricCard", category: "Data & analytics",
        description: "수치·변화·기간을 텍스트로 전달합니다. 기본·밀집·강조 배치에서 같은 정보를 유지합니다.",
        code: `import { MetricCard } from "@pydemia/ui";

<div className="grid gap-3">
  <MetricCard label="검토 완료" value={24}
    change="지난주보다 4건 증가" detail="이번 주" />
  <MetricCard variant="compact" label="검토 완료" value={24}
    change="지난주보다 4건 증가" detail="이번 주" />
  <MetricCard variant="featured" label="검토 완료" value={24}
    change="지난주보다 4건 증가" detail="이번 주" />
</div>`,
        preview: () => <MetricCardPreview />,
    },
    {
        id: "image", name: "Image", category: "File & media",
        description: "이미지 비율과 cover/contain 맞춤을 지정하고 로딩·누락·오류 상태를 표시합니다. alt는 정보 이미지에 필수이며 장식 이미지에는 빈 문자열을 사용합니다.",
        code: `import { Image } from "@pydemia/ui";

<>
  <Image
    src="/images/landscape.webp"
    alt="산과 해가 있는 풍경"
    aspectRatio="video"
    fit="cover"
    variant="frame"
    fallbackText="풍경 이미지를 불러오지 못했습니다."
  />

  <Image src={null} alt="산과 해가 있는 풍경"
    aspectRatio="square" />
</>;`,
        preview: () => <ImagePreview />,
    },
    {
        id: "lightbox", name: "Lightbox", category: "File & media",
        description: "이미지를 modal로 확대하고 이전·다음 이미지나 썸네일로 이동합니다. 방향키·Escape와 닫은 뒤 focus 복귀를 지원하며 프레임·전체 화면 표시를 선택할 수 있습니다.",
        code: `import { useState } from "react";
import { Lightbox, type LightboxItem } from "@pydemia/ui";

const images: LightboxItem[] = [
  { id: "mountain", src: "/images/mountain.webp",
    alt: "산과 태양", caption: "산과 태양" },
  { id: "coast", src: "/images/coast.webp",
    alt: "바다와 해안", caption: "해안의 물결" },
];

function Gallery() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  return <div>
    {images.map((image) => <button key={image.id} type="button"
      onClick={() => { setActiveId(image.id); setOpen(true); }}>
      <img src={image.src} alt={image.alt} width="160" />
    </button>)}
    <Lightbox title="여행 사진" items={images} activeId={activeId}
      open={open} onOpenChange={setOpen}
      onActiveIdChange={setActiveId} />
  </div>;
}`,
        preview: () => <LightboxPreview />,
    },
    {
        id: "image-cropper", name: "ImageCropper",
        category: "File & media",
        description: "선택한 PNG·JPEG·WebP를 고정 비율로 자릅니다. 끌기 또는 이름 있는 위치·확대 슬라이더로 조정하고, PNG Blob을 앱에 전달합니다.",
        installItems: ["image-cropper", "dropzone"],
        code: `import { useState } from "react";
import { Dropzone, ImageCropper } from "@pydemia/ui";

function CropProfileImage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Blob | null>(null);
  return <div>
    <Dropzone label="사진 선택"
      accept={{ "image/png": [".png"],
        "image/jpeg": [".jpg", ".jpeg"],
        "image/webp": [".webp"] }}
      onFilesSelected={(files) => {
        setFile(files[0]);
        setResult(null);
      }} />
    <ImageCropper file={file} label="프로필 사진 자르기"
      alt="선택한 프로필 사진의 자르기 미리보기"
      aspectRatio={1} outputWidth={512}
      onCrop={setResult} />
    {result && <p role="status">PNG {result.size}바이트 준비됨</p>}
  </div>;
}`,
        preview: () => <ImageCropperPreview />,
    },
    {
        id: "avatar-uploader", name: "AvatarUploader",
        category: "File & media",
        description: "프로필 사진 선택·정사각형 자르기·미리보기·제거를 한 흐름으로 제공합니다. PNG Blob 또는 제거 요청을 앱에 전달하며 저장은 앱이 담당합니다.",
        code: `import { useState } from "react";
import { AvatarUploader } from "@pydemia/ui";

function ProfilePhoto() {
  const [change, setChange] = useState<Blob | null | undefined>(undefined);

  return <div>
    <AvatarUploader label="프로필 사진"
      alt="김하나의 프로필 사진" fallback="김"
      src="/profile.jpg" maxBytes={5 * 1024 * 1024}
      onImageChange={setChange} />
    <p>{change === undefined ? "변경 없음" : change === null
      ? "사진 제거 요청" : "PNG " + change.size + "바이트 준비됨"}</p>
  </div>;
}`,
        preview: () => <AvatarUploaderPreview />,
    },
    {
        id: "dropzone", name: "Dropzone", category: "File & media",
        description: "파일 선택과 drag-and-drop을 받습니다. 형식·개수 오류를 텍스트로 알리고, 업로드는 소비자가 처리합니다.",
        code: `import { Dropzone } from "@pydemia/ui";

<Dropzone
  label="이미지 선택"
  description="PNG 또는 JPEG, 최대 128KB, 2개"
  accept={{ "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] }}
  maxFiles={2}
  maxSize={128 * 1024}
  onFilesSelected={(files) => console.log(files)}
/>`,
        preview: () => <Dropzone label="이미지 선택"
            description="PNG 또는 JPEG, 최대 128KB, 2개"
            accept={{ "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] }}
            maxFiles={2} maxSize={128 * 1024} />,
    },
    {
        id: "file-upload", name: "FileUpload", category: "File & media",
        description: "Dropzone의 선택·거부와 전송 대기·진행·완료·실패·취소 상태를 한 목록에 표시합니다. 실제 전송과 상태 변경은 호출자가 관리합니다.",
        code: `import { useState } from "react";
import { FileUpload, type FileUploadItem } from "@pydemia/ui";

function UploadQueue() {
  const [items, setItems] = useState<FileUploadItem[]>([]);
  return <FileUpload
    label="파일 추가"
    items={items}
    onFilesSelected={(files) => setItems((current) => [
      ...current,
      ...files.map((file) => ({
        id: crypto.randomUUID(), name: file.name,
        status: "pending" as const,
      })),
    ])}
    onRemove={(id) => setItems((current) =>
      current.filter((item) => item.id !== id))}
  />;
}

// 전송 코드는 앱이 실행하고 items의 status/progress를 갱신합니다.`,
        preview: () => <FileUploadPreview />,
    },
    {
        id: "message", name: "Message", category: "AI & agent",
        description: "사용자 메시지는 어두운 배경과 밝은 글씨로, 응답은 기본 표면으로 구분합니다.",
        code: `import { Message, MessageContent } from "@pydemia/ui";

<>
  <Message from="user">
    <MessageContent>배포 상태를 알려주세요.</MessageContent>
  </Message>
  <Message from="assistant">
    <MessageContent>로컬 빌드가 완료됐습니다.</MessageContent>
  </Message>
</>;`,
        preview: () => <MessagePreview />,
    },
    {
        id: "conversation", name: "Conversation", category: "AI & agent",
        description: "순서가 있는 메시지를 표시합니다. 끝을 볼 때만 새 내용에 맞춰 스크롤하고, 이전 내용을 읽는 동안에는 새 메시지 이동 버튼을 보여줍니다.",
        code: `import { useRef, useState } from "react";
import {
  Conversation, PromptInput, type ConversationMessage,
} from "@pydemia/ui";

function SupportChat() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const nextId = useRef(1);
  return <div className="grid gap-3">
    <Conversation label="지원 대화" messages={messages} className="h-80" />
    <PromptInput onSend={(text) => setMessages((current) => [
      ...current,
      { id: String(nextId.current++), from: "user", content: text },
    ])} />
  </div>;
}`,
        installItems: ["conversation", "prompt-input"],
        preview: () => <ConversationPreview />,
    },
    {
        id: "citation-list", name: "CitationList", category: "AI & agent",
        description: "답변의 출처를 제목·위치·원문 링크로 나열합니다. 간결·카드 표현과 빈 상태를 제공합니다.",
        code: `import { CitationList } from "@pydemia/ui";

<CitationList
  label="답변의 근거"
  variant="card"
  sources={[
    {
      id: "button-pattern",
      title: "WAI-ARIA Button Pattern",
      href: "https://www.w3.org/WAI/ARIA/apg/patterns/button/",
      location: "Keyboard Interaction",
      excerpt: "버튼의 이름과 실행 키를 확인할 수 있습니다.",
    },
  ]}
/>`,
        preview: () => <CitationListPreview />,
    },
    {
        id: "artifact-viewer", name: "ArtifactViewer",
        category: "AI & agent",
        description: "생성된 문서·코드·일반 텍스트를 revision별로 읽습니다. Markdown은 안전한 부분집합으로 미리 보고 원문·직전 revision과의 차이를 전환합니다. 실행 가능한 HTML은 렌더링하지 않습니다.",
        code: `import { useState } from "react";
import { ArtifactViewer } from "@pydemia/ui";
import type { ArtifactRevision } from "@pydemia/ui";

const revisions: ArtifactRevision[] = [
  { id: "draft", label: "초안", content: "# 점검 안내\\n\\n금요일 점검" },
  { id: "review", label: "검토", content: "# 점검 안내\\n\\n금요일 18:00 점검" },
];

function ReviewArtifact() {
  const [revisionId, setRevisionId] = useState("review");
  return <ArtifactViewer label="점검 안내" kind="markdown"
    revisions={revisions} revisionId={revisionId}
    onRevisionChange={setRevisionId} />;
}`,
        installItems: ["artifact-viewer"],
        preview: () => <ArtifactViewerPreview />,
    },
    {
        id: "reasoning", name: "Reasoning", category: "AI & agent",
        description: "생성 과정의 상태와 접을 수 있는 내용을 표시합니다. inline과 card 표현을 선택할 수 있습니다.",
        code: `import { Reasoning } from "@pydemia/ui";

<Reasoning label="검토 과정" status="complete" variant="card">
  <ol>
    <li>요청을 확인했습니다.</li>
    <li>registry 결과를 비교했습니다.</li>
  </ol>
</Reasoning>`,
        preview: () => <ReasoningPreview />,
    },
    {
        id: "tool-call", name: "ToolCall", category: "AI & agent",
        description: "도구 호출의 대기·실행·완료·실패와 입력·결과·오류를 구분해 표시합니다.",
        code: `import { ToolCall } from "@pydemia/ui";

<ToolCall
  name="registry.check"
  status="succeeded"
  input="{ item: 'pyd-conversation' }"
  output="검사 66건 통과"
/>`,
        preview: () => <ToolCallPreview />,
    },
    {
        id: "agent-status", name: "AgentStatus", category: "AI & agent",
        description: "AI 작업 전체 상태와 단계별 진행·실패·건너뜀을 함께 표시합니다. 작업 취소·재시도는 호출자 callback으로 전달하고 panel·compact 표시를 선택합니다.",
        code: `import {
  AgentStatus, type AgentStage,
} from "@pydemia/ui";

const stages: AgentStage[] = [
  { id: "parse", label: "요청 해석", status: "completed" },
  { id: "lookup", label: "데이터 조회", status: "running" },
  { id: "answer", label: "답변 구성", status: "pending" },
];

<AgentStatus label="분석 요청" status="running" stages={stages} />`,
        installItems: ["agent-status"],
        preview: () => <AgentStatusPreview />,
    },
    {
        id: "approval-card", name: "ApprovalCard", category: "AI & agent",
        description: "도구 실행 승인 요청의 승인·거절·만료와 중복 결정 방지, 실패 후 재시도를 제공합니다.",
        code: `import { useState } from "react";
import { ApprovalCard, type ApprovalStatus } from "@pydemia/ui";

function Example() {
  const [status, setStatus] = useState<ApprovalStatus>("requested");

  return <ApprovalCard
    requestId="export-37"
    title="보고서 내보내기 승인"
    description="요약 보고서를 외부 저장소로 내보냅니다."
    status={status}
    onDecision={(decision, requestId) => {
      // 서버에 requestId와 decision을 전달하고 결과로 status를 갱신합니다.
      console.log(requestId, decision);
      setStatus(decision === "approve" ? "approved" : "rejected");
    }}
  />;
}`,
        preview: () => <ApprovalCardPreview />,
    },
    {
        id: "prompt-input", name: "PromptInput", category: "AI & agent",
        description: "Enter로 전송하고 Shift+Enter로 줄을 바꾸는 메시지 입력입니다. 빈 내용은 전송하지 않습니다.",
        code: `import { PromptInput } from "@pydemia/ui";

<PromptInput onSend={(text) => console.log(text)} />`,
        preview: () => <PromptInputPreview />,
    },
    {
        id: "model-selector", name: "ModelSelector", category: "AI & agent",
        description: "검색 가능한 모델 선택과 제공자·기능·사용량 설명, 사용할 수 없는 이유를 한곳에 표시합니다. 모델 목록과 비용 문구는 앱이 제공하며 panel·compact 표시를 선택합니다.",
        code: `import { useState } from "react";
import {
  ModelSelector, PromptInput, type ModelChoice,
} from "@pydemia/ui";

const models: ModelChoice[] = [
  { id: "quick", label: "빠른 응답", provider: "예시 제공자",
    description: "짧은 질문과 요약에 사용합니다.",
    capabilities: ["텍스트", "요약"], costLabel: "표준 사용량" },
  { id: "analysis", label: "문서 분석", provider: "예시 제공자",
    description: "긴 문서와 표를 분석합니다.",
    capabilities: ["긴 문서", "표 분석"], costLabel: "확장 사용량" },
];

function Composer() {
  const [modelId, setModelId] = useState<string | null>("quick");
  const [lastSent, setLastSent] = useState("");
  return <div className="grid gap-3">
    <ModelSelector label="응답 모델" name="model" models={models}
      value={modelId} onValueChange={setModelId} required />
    <PromptInput disabled={!modelId} onSend={(text) =>
      setLastSent(modelId + ": " + text)} />
    <p role="status">{lastSent}</p>
  </div>;
}`,
        installItems: ["model-selector", "prompt-input"],
        preview: () => <ModelSelectorPreview />,
    },
    {
        id: "tabs", name: "Tabs", category: "Navigation",
        description: "탭 전환과 키보드 이동을 제공하며 기본·밑줄·채움 표시 형태를 선택할 수 있습니다.",
        code: `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@pydemia/ui";

<Tabs defaultValue="overview">
  <TabsList variant="line" aria-label="항목 보기">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="details">Details</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">개요</TabsContent>
  <TabsContent value="details">상세 내용</TabsContent>
</Tabs>`,
        preview: () => <TabsVariantPreview />,
    },
    {
        id: "table", name: "Table", category: "Data display",
        description: "caption과 열 머리글을 갖춘 데이터 표의 기본 뼈대입니다.",
        code: `import { Table, TableHead, TableCell } from "@pydemia/ui";

<Table>
  <caption className="sr-only">화면 개선 요청</caption>
  <thead><tr>
    <TableHead scope="col">요청</TableHead>
    <TableHead scope="col">담당</TableHead>
    <TableHead scope="col">상태</TableHead>
  </tr></thead>
  <tbody>
    <tr>
      <TableCell>초대 화면</TableCell>
      <TableCell>제품팀</TableCell>
      <TableCell>검토 중</TableCell>
    </tr>
    <tr>
      <TableCell>검색 필터</TableCell>
      <TableCell>운영팀</TableCell>
      <TableCell>승인</TableCell>
    </tr>
  </tbody>
</Table>`,
        preview: () => <div className="preview-table">
            <Table>
                <caption className="sr-only">화면 개선 요청</caption>
                <thead><tr>
                    <TableHead scope="col">요청</TableHead>
                    <TableHead scope="col">담당</TableHead>
                    <TableHead scope="col">상태</TableHead>
                </tr></thead>
                <tbody>
                    <tr><TableCell>초대 화면</TableCell><TableCell>제품팀</TableCell><TableCell>검토 중</TableCell></tr>
                    <tr><TableCell>검색 필터</TableCell><TableCell>운영팀</TableCell><TableCell>승인</TableCell></tr>
                </tbody>
            </Table>
        </div>,
    },
    {
        id: "data-list", name: "DataList", category: "Data display",
        description: "이름과 값의 짝을 native description list로 표시합니다. 행·그리드 배치와 값 없음·목록 없음 상태를 구분합니다.",
        code: `import { Badge, DataList } from "@pydemia/ui";

<DataList label="요청 세부 정보" layout="rows" items={[
  { id: "id", label: "요청 ID", value: "r-1042" },
  { id: "team", label: "담당 팀", value: "데이터" },
  { id: "status", label: "상태",
    value: <Badge>검토 중</Badge> },
  { id: "reviewer", label: "검토자", value: null },
]} />`,
        installItems: ["data-list", "badge"],
        preview: () => <DataListPreview />,
    },
    {
        id: "affixed-input", name: "AffixedInput", category: "Inputs",
        description: "입력 앞뒤에 고정 텍스트를 놓습니다. prefix와 suffix는 입력값에 포함되지 않습니다.",
        code: `import { AffixedInput } from "@pydemia/ui";

<AffixedInput
  label="Registry 경로"
  prefix="@pydemia/"
  suffix=".json"
  defaultValue="button"
/>`,
        preview: () => <div className="preview-field"><AffixedInput label="Registry 경로" prefix="@pydemia/" suffix=".json" defaultValue="button" /></div>,
    },
    {
        id: "snippet", name: "Snippet", category: "Developer tools",
        description: "탭형 코드 블록과 복사 버튼을 공통 token으로 표시합니다.",
        code: `import {
  Snippet, SnippetHeader, SnippetTabsList, SnippetTabsTrigger,
  SnippetCopyButton, SnippetContent,
} from "@pydemia/ui";

<Snippet defaultValue="npm">
  <SnippetHeader>
    <SnippetTabsList aria-label="설치 방식">
      <SnippetTabsTrigger value="npm">Registry</SnippetTabsTrigger>
    </SnippetTabsList>
    <SnippetCopyButton value="npm run registry:build" />
  </SnippetHeader>
  <SnippetContent value="npm">npm run registry:build</SnippetContent>
</Snippet>`,
        preview: () => <SnippetPreview />,
    },
    {
        id: "code-block", name: "CodeBlock", category: "Developer tools",
        description: "단일 코드 예시의 제목·언어·원본 줄바꿈을 표시하고, 긴 줄의 스크롤·줄바꿈과 복사 결과를 제공합니다.",
        code: `import { CodeBlock } from "@pydemia/ui";

<CodeBlock
  label="request.ts"
  language="TypeScript"
  code={'export const status = "ready";'}
  wrap={false}
/>`,
        installItems: ["code-block"],
        preview: () => <CodeBlockPreview />,
    },
    {
        id: "code-editor-shell", name: "CodeEditorShell",
        category: "Developer tools",
        description: "SQL·설정 조각을 편집하는 이름 있는 일반 텍스트 영역입니다. 줄 번호·언어·작업 slot과 panel·flat 표시를 제공하며, 값과 실행 결과는 호출자가 관리합니다. 구문 강조는 제공하지 않습니다.",
        code: `import { useState } from "react";
import { Button, CodeEditorShell } from "@pydemia/ui";

function QueryEditor() {
  const [query, setQuery] = useState("SELECT request_id\\nFROM requests;");
  const [submitted, setSubmitted] = useState("");

  return <form onSubmit={(event) => {
    event.preventDefault();
    setSubmitted(String(new FormData(event.currentTarget).get("query")));
  }}>
    <CodeEditorShell label="요청 조회 쿼리" language="SQL"
      name="query" value={query} onValueChange={setQuery}
      rows={6} required variant="panel"
      actions={<Button type="submit">값 확인</Button>} />
    <p role="status">제출 값: {submitted || "없음"}</p>
  </form>;
}`,
        installItems: ["code-editor-shell", "button"],
        preview: () => <CodeEditorShellPreview />,
    },
    {
        id: "diff-viewer", name: "DiffViewer", category: "Developer tools",
        description: "변경 전후의 줄 번호·추가·삭제·문맥을 통합 또는 좌우 표로 읽습니다. 큰 변경은 축약 비교임을 알립니다.",
        code: `import { DiffViewer } from "@pydemia/ui";

<DiffViewer
  label="settings.ts 변경"
  before={"region: 'west'\\ncache: false"}
  after={"region: 'west'\\ncache: true"}
  view="unified"
/>`,
        preview: () => <DiffViewerPreview />,
    },
    {
        id: "markdown", name: "Markdown", category: "Developer tools",
        description: "제목·문단·단층 목록·강조·인라인 코드·코드 블록과 절대 HTTP(S) 링크를 표시합니다. 원시 HTML과 지원하지 않는 문법은 텍스트로 남깁니다.",
        code: `import { Markdown, Message, MessageContent } from "@pydemia/ui";

const answer = [
  "## 검토 결과",
  "",
  "**완료 12건**과 *대기 3건*을 확인했습니다.",
  "",
  "- [공식 문서](https://example.com/docs)",
].join("\\n");

<Message from="assistant">
  <MessageContent><Markdown source={answer} /></MessageContent>
</Message>`,
        installItems: ["markdown", "message"],
        preview: () => <MarkdownPreview />,
    },
    {
        id: "markdown-editor", name: "MarkdownEditor",
        category: "Developer tools",
        description: "Markdown 원문을 입력하면서 결과를 함께 미리봅니다. native textarea의 선택·붙여넣기·undo·form 제출을 유지하며, 표시 문법은 Markdown component의 지원 범위를 따릅니다.",
        code: `import { useState } from "react";
import { MarkdownEditor } from "@pydemia/ui";

function ArticleForm() {
  const [body, setBody] = useState("## 새 글");
  const [saved, setSaved] = useState("");
  return <form onSubmit={(event) => {
    event.preventDefault();
    setSaved(String(new FormData(event.currentTarget).get("body")));
  }}>
    <MarkdownEditor label="본문" name="body" value={body}
      onValueChange={setBody} rows={10} required />
    <button type="submit">저장</button>
    <p role="status">저장 값: {saved || "없음"}</p>
  </form>;
}`,
        installItems: ["markdown-editor"],
        preview: () => <MarkdownEditorPreview />,
    },
    {
        id: "field", name: "Field", category: "Inputs",
        installItems: ["field", "input"],
        description: "label, 설명, 오류와 필수 상태를 입력 control에 연결합니다. 자체 label이 없는 control에 사용합니다.",
        code: `import { useState } from "react";
import { Field, Input } from "@pydemia/ui";

function EmailField() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      setError(email.includes("@") ? "" : "이메일 주소를 확인하세요.");
    }}>
      <Field label="이메일" description="알림을 받을 주소"
        error={error} required>
        {(control) => <Input {...control} value={email}
          onChange={(event) => setEmail(event.target.value)} />}
      </Field>
      <button type="submit">확인</button>
    </form>
  );
}`,
        preview: () => <FieldPreview />,
    },
    {
        id: "select", name: "Select", category: "Selection",
        installItems: ["select", "field"],
        description: "검색 없는 단일 선택입니다. option 탐색과 form 값을 관리합니다.",
        code: `import { useState } from "react";
import { Field, Select, SelectTrigger, SelectValue,
  SelectContent, SelectItem } from "@pydemia/ui";

function RoleSelect() {
  const [role, setRole] = useState("");
  return (
    <Field label="담당 역할" required>
      {(control) => (
        <Select name="role" value={role} onValueChange={setRole}>
          <SelectTrigger {...control}>
            <SelectValue placeholder="역할 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="reviewer">검토자</SelectItem>
            <SelectItem value="editor">편집자</SelectItem>
          </SelectContent>
        </Select>
      )}
    </Field>
  );
}`,
        preview: () => <SelectPreview />,
    },
    {
        id: "editable", name: "Editable", category: "Inputs",
        description: "이름·설정값을 자리에서 수정합니다. 저장·취소, 필수값 검사와 비동기 저장 실패 뒤 초안 보존을 제공합니다. 값 저장은 사용 측이 소유합니다.",
        code: `import { useState } from "react";
import { Editable } from "@pydemia/ui";

function WorkspaceName() {
  const [name, setName] = useState("Operations workspace");
  return <Editable label="작업 공간 이름" value={name} required
    validate={(draft) => draft.trim().length < 2
      ? "두 글자 이상 입력하세요." : null}
    onSave={setName} />;
}`,
        preview: () => <EditablePreview />,
    },
    {
        id: "combobox", name: "Combobox", category: "Selection",
        description: "단일 항목을 검색해 선택합니다. 원격 결과가 바뀌어도 선택값을 보존하고 loading·오류·빈 결과를 구분합니다.",
        code: `import { useEffect, useState } from "react";
import { Button, Combobox, Field } from "@pydemia/ui";

const allOptions = [
  { value: "studio", label: "Design Studio" },
  { value: "ops", label: "Operations" },
  { value: "archive", label: "Archive", disabled: true },
];

function WorkspaceForm() {
  const [value, setValue] = useState<string | null>(null);
  const [selectedOption, setSelectedOption] = useState<
    (typeof allOptions)[number] | undefined
  >();
  const [query, setQuery] = useState("");
  const [options, setOptions] = useState(allOptions);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setOptions(allOptions.filter((option) =>
        option.label.toLowerCase().includes(query.toLowerCase()),
      ));
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  return <form onSubmit={(event) => {
    event.preventDefault();
    const selected = new FormData(event.currentTarget).get("workspace");
    console.log(selected);
  }}>
    <Field label="작업 공간" required>
      {(control) => <Combobox {...control} options={options}
        selectedOption={selectedOption} filterOptions={false}
        loading={loading} name="workspace" value={value}
        onValueChange={(next) => {
          setValue(next);
          if (next) setSelectedOption(options.find(
            (option) => option.value === next,
          ));
        }}
        onQueryChange={(next) => {
          setQuery(next);
          setLoading(Boolean(next));
        }}
        required requiredMessage="목록에서 선택하세요." />}
    </Field>
    <Button type="submit">적용</Button>
  </form>;
}`,
        installItems: ["combobox", "field", "button"],
        preview: () => <ComboboxPreview />,
    },
    {
        id: "multi-select", name: "MultiSelect", category: "Selection",
        description: "검색 가능한 checkbox 목록에서 여러 항목을 고르고 chip으로 제거합니다. 선택한 값만 form에 전달합니다.",
        code: `import { useState } from "react";
import { Button, Field, MultiSelect } from "@pydemia/ui";

const options = [
  { value: "studio", label: "Design Studio" },
  { value: "ops", label: "Operations" },
  { value: "research", label: "Research Lab" },
];

function WorkspaceForm() {
  const [values, setValues] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState<string[]>([]);
  return <form onSubmit={(event) => {
    event.preventDefault();
    setSubmitted(new FormData(event.currentTarget)
      .getAll("workspace").map(String));
  }}>
    <Field label="작업 공간" required>
      {(control) => <MultiSelect {...control}
        aria-label="작업 공간" options={options}
        name="workspace" value={values}
        onValueChange={setValues} required />}
    </Field>
    <Button type="submit">적용</Button>
    <p role="status">제출: {submitted.join(", ") || "없음"}</p>
  </form>;
}`,
        installItems: ["multi-select", "field", "button"],
        preview: () => <MultiSelectPreview />,
    },
    {
        id: "date-picker", name: "DatePicker", category: "Date & time",
        installItems: ["date-picker", "field"],
        description: "달력 날짜를 YYYY-MM-DD 값으로 다룹니다. null은 미선택이며 hidden input으로 form에 전달합니다.",
        code: `import { useState } from "react";
import { ko } from "react-day-picker/locale";
import { DatePicker, Field } from "@pydemia/ui";

function ReviewDate() {
  const [date, setDate] = useState<string | null>(null);
  return (
    <Field label="검토일" required>
      {(control) => (
        <DatePicker {...control} name="date" value={date}
          onValueChange={setDate} calendarLocale={ko} required />
      )}
    </Field>
  );
}`,
        preview: () => <DatePickerPreview />,
    },
    {
        id: "month-picker", name: "MonthPicker", category: "Date & time",
        installItems: ["month-picker", "field", "button"],
        description: "월 단위 보고·필터 값을 YYYY-MM로 선택합니다. min/max는 선택 가능한 월을 제한하고 null은 미선택입니다.",
        code: `import { useState } from "react";
import { Button, Field, MonthPicker } from "@pydemia/ui";

function ReportMonth() {
  const [month, setMonth] = useState<string | null>(null);
  return <form onSubmit={(event) => {
    event.preventDefault();
    if (!month) return;
    console.log(new FormData(event.currentTarget).get("reportMonth"));
  }}>
    <Field label="보고 월" required>
      {(control) => <MonthPicker {...control} name="reportMonth"
        value={month} onValueChange={setMonth}
        min="2025-11" max="2027-03" required />}
    </Field>
    <Button type="submit">월 적용</Button>
  </form>;
}`,
        preview: () => <MonthPickerPreview />,
    },
    {
        id: "year-picker", name: "YearPicker", category: "Date & time",
        installItems: ["year-picker", "field", "button"],
        description: "연간 보고·예산의 YYYY 값을 10년 단위로 탐색합니다. min/max와 빈 값, form 제출을 구분합니다.",
        code: `import { useState } from "react";
import { Button, Field, YearPicker } from "@pydemia/ui";

function ReportYear() {
  const [year, setYear] = useState<string | null>(null);
  return <form onSubmit={(event) => {
    event.preventDefault();
    if (!year) return;
    console.log(new FormData(event.currentTarget).get("reportYear"));
  }}>
    <Field label="보고 연도" required>
      {(control) => <YearPicker {...control} name="reportYear"
        value={year} onValueChange={setYear}
        min="2022" max="2033" required />}
    </Field>
    <Button type="submit">연도 적용</Button>
  </form>;
}`,
        preview: () => <YearPickerPreview />,
    },
    {
        id: "date-range-picker", name: "DateRangePicker",
        category: "Date & time",
        description: "시작일과 종료일을 YYYY-MM-DD로 선택합니다. 부분 선택을 구분하고 두 값을 각각 form에 전달합니다.",
        code: `import { useState } from "react";
import { ko } from "react-day-picker/locale";
import {
  Button, DateRangePicker, Field,
  type DateRangeValue,
} from "@pydemia/ui";

function ReportPeriod() {
  const [range, setRange] = useState<DateRangeValue>(null);
  const [error, setError] = useState(false);
  return <form onSubmit={(event) => {
    event.preventDefault();
    if (!range?.to) { setError(true); return; }
    const data = new FormData(event.currentTarget);
    console.log(data.get("periodStart"), data.get("periodEnd"));
  }}>
    <Field label="조회 기간" required
      error={error ? "시작일과 종료일을 선택하세요." : undefined}>
      {(control) => <DateRangePicker {...control}
        startName="periodStart" endName="periodEnd"
        value={range} onValueChange={(next) => {
          setRange(next); setError(false);
        }}
        calendarLocale={ko} />}
    </Field>
    <Button type="submit">기간 적용</Button>
  </form>;
}`,
        installItems: ["date-range-picker", "field", "button"],
        preview: () => <DateRangePickerPreview />,
    },
    {
        id: "time-picker", name: "TimePicker", category: "Date & time",
        description: "시·분과 12/24시간 표시를 선택합니다. 값은 locale과 무관한 HH:mm으로 form에 제출합니다.",
        code: `import { useState } from "react";
import { Button, TimePicker } from "@pydemia/ui";

function ReviewTime() {
  const [time, setTime] = useState<string | null>(null);
  return <form onSubmit={(event) => {
    event.preventDefault();
    console.log(new FormData(event.currentTarget).get("reviewTime"));
  }}>
    <TimePicker label="검토 시각" name="reviewTime"
      value={time} onValueChange={setTime}
      locale="ko-KR" hourCycle="h12" minuteStep={5}
      required />
    <Button type="submit">시각 확인</Button>
  </form>;
}`,
        installItems: ["time-picker", "button"],
        preview: () => <TimePickerPreview />,
    },
    {
        id: "date-time-picker", name: "DateTimePicker",
        category: "Date & time",
        description: "날짜·시각의 부분 선택을 각각 보존하고, 둘 다 선택되면 로컬 날짜시각과 IANA 시간대 이름을 별도 form 값으로 전달합니다. UTC 시각 변환은 호출자가 맡습니다.",
        code: `import { useState } from "react";
import { ko } from "react-day-picker/locale";
import { Button, DateTimePicker } from "@pydemia/ui";
import type { DateTimeSelection } from "@pydemia/ui";

function ScheduleForm() {
  const [value, setValue] = useState<DateTimeSelection>({
    date: null, time: null,
  });
  const [error, setError] = useState(false);
  return <form onSubmit={(event) => {
    event.preventDefault();
    if (!value.date || !value.time) {
      setError(true);
      return;
    }
    const data = new FormData(event.currentTarget);
    console.log(data.get("startsAt"),
      data.get("startsAtTimeZone"));
  }}>
    <DateTimePicker label="예약 시작" name="startsAt"
      value={value} onValueChange={(next) => {
        setValue(next);
        setError(false);
      }}
      timeZone="Asia/Seoul" calendarLocale={ko}
      hourCycle="h23" minuteStep={5} />
    <Button type="submit">예약 값 확인</Button>
    {error && <p role="alert">날짜와 시각을 선택하세요.</p>}
  </form>;
}`,
        installItems: ["date-time-picker", "button"],
        preview: () => <DateTimePickerPreview />,
    },
    {
        id: "master-detail", name: "MasterDetail", category: "Framework",
        installItems: ["master-detail"],
        description: "목록 선택과 상세 표시를 묶습니다. 좁은 영역에서는 목록·상세를 전환하고 돌아갈 때 선택 항목으로 focus를 복원합니다.",
        code: `import { useState } from "react";
import { MasterDetail } from "@pydemia/ui";

const requests = [
  { id: "invoice", title: "청구서 확인", description: "수신 주소 검토" },
  { id: "access", title: "접근 권한", description: "편집 권한 요청" },
];

function RequestWorkspace() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  return <MasterDetail label="검토 요청" items={requests}
    selectedId={selectedId} onSelectedIdChange={setSelectedId}
    renderDetail={(item) => <article>
      <h3>{item.title}</h3><p>{item.description}</p>
    </article>} />;
}`,
        preview: () => <MasterDetailPreview />,
    },
    {
        id: "app-shell", name: "AppShell", category: "Framework",
        installItems: ["app-shell", "button", "collapsible"],
        description: "header, 좌우·하단 panel과 floating UI를 조합합니다. framed·canvas와 원형·pill 도움말을 선택하고, 하단 panel은 Collapsible로 접을 수 있습니다.",
        code: `import {
  AppShell, AppHeader, AppBody, AppSidebar, AppMain,
  AppBottomPanel, AppFloatingDisclosure,
  Button, Collapsible, CollapsibleTrigger, CollapsibleContent,
} from "@pydemia/ui";

function Workspace() {
  return <AppShell appearance="canvas">
    <AppHeader>제품 이름과 전역 탐색</AppHeader>
    <AppBody>
      <AppSidebar aria-label="프로젝트 탐색">...</AppSidebar>
      <AppMain>화면 본문</AppMain>
      <AppSidebar side="right" aria-label="상세 정보">...</AppSidebar>
    </AppBody>
    <Collapsible defaultOpen>
      <AppBottomPanel aria-label="프로젝트 작업 상태" className="pl-28">
        <CollapsibleTrigger asChild>
          <Button variant="ghost">작업 상태</Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-2">
          모든 변경 사항이 저장되었습니다.
        </CollapsibleContent>
      </AppBottomPanel>
    </Collapsible>
    <AppFloatingDisclosure appearance="pill" side="left"
      label="도움말">
      <p>도움말</p>
    </AppFloatingDisclosure>
  </AppShell>;
}`,
        preview: () => <AppShellPreview />,
    },
    {
        id: "scroll-area", name: "ScrollArea", category: "Framework",
        description: "이름이 있는 스크롤 영역에 공통 token의 스크롤바를 적용합니다. 세로·가로·양방향을 지원합니다.",
        code: `import { ScrollArea } from "@pydemia/ui";

const events = Array.from({ length: 20 }, (_, index) => ({
  id: index, title: "작업 " + (index + 1) + " · 검토 완료",
}));
const days = ["월", "화", "수", "목", "금", "토", "일"];

<>
  <ScrollArea label="최근 작업" type="always"
    className="h-48 rounded-sm border border-border">
    <ol className="p-3">
      {events.map((event) => <li key={event.id}>{event.title}</li>)}
    </ol>
  </ScrollArea>

  <ScrollArea label="기간별 지표" orientation="horizontal"
    className="h-24 w-full">
    <div className="flex w-max gap-2">
      {days.map((day) => <div key={day} className="w-20">{day}</div>)}
    </div>
  </ScrollArea>
</>;`,
        preview: () => <ScrollAreaPreview />,
    },
    {
        id: "resizable-panels", name: "ResizablePanels", category: "Framework",
        description: "좌우 또는 상하 작업 영역의 크기를 pointer와 키보드로 조절합니다. 최소·최대 비율을 지정할 수 있습니다.",
        code: `import { useState } from "react";
import { ResizablePanels } from "@pydemia/ui";

function Workspace() {
  const [size, setSize] = useState(42);
  return (
    <ResizablePanels
      firstLabel="작업 목록"
      secondLabel="선택한 작업"
      first={<div>작업 목록</div>}
      second={<div>선택한 작업</div>}
      size={size}
      minSize={20}
      maxSize={80}
      onSizeChange={setSize}
      className="h-60"
    />
  );
}`,
        preview: () => <ResizablePanelsPreview />,
    },
    {
        id: "sidebar", name: "Sidebar", category: "Framework",
        installItems: ["sidebar", "app-shell"],
        description: "현재 페이지 링크를 단일 목록이나 이름 있는 섹션으로 표시합니다. 넓은 화면에서는 아이콘 폭으로 접히고, 좁은 화면에서는 modal drawer로 열립니다.",
        code: `import { AppShell, AppBody, AppMain, Sidebar } from "@pydemia/ui";

const sections = [
  { id: "work", label: "작업", items: [
    { id: "overview", label: "개요", href: "/overview", current: true },
    { id: "files", label: "파일", href: "/files" },
  ] },
  { id: "manage", label: "관리", items: [
    { id: "settings", label: "설정", href: "/settings" },
  ] },
];

<AppShell>
  <AppBody>
    <Sidebar label="프로젝트 탐색" sections={sections} />
    <AppMain>작업 공간</AppMain>
  </AppBody>
</AppShell>`,
        preview: () => <SidebarPreview />,
    },
    {
        id: "tree", name: "Tree", category: "Navigation",
        description: "파일·리소스 계층을 확장하고 한 항목을 고릅니다. 원격 폴더의 로딩·실패·재시도를 표시하며 focus와 선택을 구분합니다.",
        code: `import { useState } from "react";
import { Tree, type TreeNode } from "@pydemia/ui";

function RemoteTree({ loadFiles }: {
  loadFiles: (id: string) => Promise<readonly TreeNode[]>;
}) {
  const [folder, setFolder] = useState<TreeNode>({
    id: "remote", label: "Remote", childState: "unloaded",
  });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  async function loadChildren(id: string) {
    setFolder({ id, label: "Remote", childState: "loading" });
    try {
      const children = await loadFiles(id);
      setFolder({ id, label: "Remote", children });
    } catch {
      setFolder({ id, label: "Remote", childState: "error",
        errorMessage: "파일 목록을 불러오지 못했습니다." });
    }
  }
  return <Tree label="작업 파일" items={[folder]}
    selectedId={selectedId} onSelectedIdChange={setSelectedId}
    onLoadChildren={loadChildren} />;
}`,
        preview: () => <TreePreview />,
    },
    {
        id: "tree-nav", name: "TreeNav", category: "Navigation",
        description: "여러 단계의 페이지 링크를 펼치고 현재 경로를 표시합니다. 링크와 하위 페이지 버튼을 분리하고 선형·채움형 표시를 제공합니다.",
        code: `import { TreeNav, type TreeNavItem } from "@pydemia/ui";

const pages: TreeNavItem[] = [
  { id: "overview", label: "개요", href: "/overview" },
  { id: "projects", label: "프로젝트", children: [
    { id: "atlas", label: "Atlas", href: "/projects/atlas",
      children: [
        { id: "builds", label: "빌드 기록",
          href: "/projects/atlas/builds" },
      ] },
  ] },
];

<TreeNav label="프로젝트 페이지" items={pages}
  currentId="builds" variant="rail" />`,
        preview: () => <TreeNavPreview />,
    },
    {
        id: "tree-select", name: "TreeSelect", category: "Selection",
        description: "계층의 한 항목을 골라 form 값으로 제출합니다. 경로를 표시하고 키보드 탐색·필수 선택·초기화를 지원합니다.",
        code: `import { TreeSelect } from "@pydemia/ui";

const teams = [
  { id: "product", label: "제품", children: [
    { id: "design", label: "디자인" },
    { id: "frontend", label: "프론트엔드" },
  ] },
  { id: "operations", label: "운영" },
];

<form onSubmit={(event) => {
  event.preventDefault();
  const team = new FormData(event.currentTarget).get("team");
  console.log(team);
}}>
  <TreeSelect label="담당 조직" name="team" items={teams} required />
  <button type="submit">제출</button>
</form>`,
        preview: () => <TreeSelectPreview />,
    },
    {
        id: "calendar-scheduler", name: "CalendarScheduler",
        category: "Workflow",
        description: "일정이 있는 날짜와 건수를 달력에서 찾고 날짜별 안건을 확인합니다. 일정 선택·추가는 호출자가 처리합니다.",
        code: `import { useState } from "react";
import { ko } from "react-day-picker/locale";
import { CalendarScheduler } from "@pydemia/ui";

const events = [
  { id: "review", date: "2026-10-07", title: "권한 검토",
    startTime: "09:00", endTime: "09:30" },
  { id: "report", date: "2026-10-12", title: "월간 보고" },
];

function TeamSchedule() {
  const [date, setDate] = useState("2026-10-07");
  return <CalendarScheduler label="팀 일정" initialDate="2026-10-07"
    selectedDate={date} onSelectedDateChange={setDate}
    events={events} timeZone="Asia/Seoul" calendarLocale={ko} />;
}`,
        preview: () => <CalendarSchedulerPreview />,
    },
    {
        id: "stepper", name: "Stepper", category: "Workflow",
        description: "순서가 있는 단계의 완료·현재·오류 상태와 이동 가능한 단계를 표시합니다.",
        code: `import { useState } from "react";
import { Stepper } from "@pydemia/ui";

const steps = [
  { id: "details", label: "기본 정보" },
  { id: "review", label: "검토" },
  { id: "publish", label: "게시" },
];

function PublishFlow() {
  const [currentIndex, setCurrentIndex] = useState(1);
  return <Stepper aria-label="게시 절차" steps={steps}
    currentIndex={currentIndex} completedStepIds={["details"]}
    navigation="completed"
    onStepChange={setCurrentIndex} />;
}`,
        preview: () => <StepperPreview />,
    },
    {
        id: "form-wizard", name: "FormWizard", category: "Workflow",
        installItems: ["form-wizard", "input"],
        description: "현재 단계의 native form 유효성 검사와 선택적 비동기 검증을 거쳐 다음 단계로 이동합니다. 입력값과 현재 단계는 호출자가 소유하고, 최종 단계에서 완료 요청을 전달합니다. 가로·세로 단계와 panel·plain 표시를 선택할 수 있습니다.",
        code: `import { useState } from "react";
import { FormWizard, Input } from "@pydemia/ui";

function RequestWizard() {
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [saved, setSaved] = useState("");
  const steps = [
    { id: "name", label: "이름", content:
      <label className="grid gap-1">요청 이름
        <Input required value={title}
          onChange={(event) => setTitle(event.target.value)} />
      </label> },
    { id: "review", label: "검토", content:
      <p>저장할 요청: {title}</p> },
  ];
  return <>
    <FormWizard label="요청 작성" steps={steps}
      currentIndex={step} onStepChange={setStep}
      validateStep={(index) => index !== 0 || title.trim().length >= 3}
      onFinish={() => setSaved(title)} finishLabel="저장" />
    <p role="status">저장 결과: {saved || "없음"}</p>
  </>;
}`,
        preview: () => <FormWizardPreview />,
    },
    {
        id: "timeline", name: "Timeline", category: "Workflow",
        description: "전달한 순서의 활동을 시간·상태와 함께 표시합니다. 상태 이름은 색상과 별도로 읽을 수 있습니다.",
        code: `import { Timeline } from "@pydemia/ui";

<Timeline aria-label="작업 활동" entries={[
  { id: "done", title: "검토 완료", timestamp: "오늘 10:42",
    dateTime: "2026-09-29T10:42:00+09:00",
    status: { label: "완료", tone: "accent" } },
  { id: "created", title: "작업 생성", timestamp: "어제 17:05",
    dateTime: "2026-09-28T17:05:00+09:00" },
]} />`,
        preview: () => <TimelinePreview />,
    },
    {
        id: "kanban", name: "Kanban", category: "Workflow",
        description: "상태별 작업 카드를 정렬하고 열 사이로 이동합니다. 마우스 끌기와 카드의 방향 버튼을 함께 제공하며, 빈 열에도 카드를 놓을 수 있습니다.",
        code: `import { useState } from "react";
import { Kanban, type KanbanColumn } from "@pydemia/ui";

const initialColumns: KanbanColumn[] = [
  { id: "queued", title: "대기", cards: [
    { id: "request-1", title: "요청 분류" },
    { id: "request-2", title: "입력 검증" },
  ] },
  { id: "working", title: "진행 중", cards: [] },
  { id: "done", title: "완료", cards: [] },
];

function RequestBoard() {
  const [columns, setColumns] = useState(initialColumns);
  return <Kanban label="요청 처리 보드" columns={columns}
    onColumnsChange={setColumns} />;
}`,
        preview: () => <KanbanPreview />,
    },
    {
        id: "gantt", name: "Gantt", category: "Workflow",
        description: "작업 기간·진행률과 선행 관계를 일 또는 7일 시간축에 표시합니다. 작업을 선택해 날짜를 하루씩 이동하거나 기간을 조정할 수 있습니다.",
        code: `import { useState } from "react";
import { Gantt, type GanttTask } from "@pydemia/ui";

const initialTasks: GanttTask[] = [
  { id: "scope", title: "요구 정리", startDate: "2026-10-02",
    endDate: "2026-10-04", progress: 100 },
  { id: "design", title: "화면 설계", startDate: "2026-10-07",
    endDate: "2026-10-09", progress: 75, dependsOn: ["scope"] },
  { id: "build", title: "구현", startDate: "2026-10-12",
    endDate: "2026-10-16", progress: 30, dependsOn: ["design"] },
];

function ReleaseSchedule() {
  const [tasks, setTasks] = useState(initialTasks);
  return <Gantt label="출시 일정" rangeStart="2026-10-01"
    rangeEnd="2026-10-25" tasks={tasks} scale="week"
    onTasksChange={setTasks} />;
}`,
        preview: () => <GanttPreview />,
    },
    {
        id: "node-canvas", name: "NodeCanvas", category: "Workflow",
        description: "노드와 연결을 배치하고, 노드 이동·연결 추가·제거를 수행합니다. 끌기 외에 방향키와 좌표 입력을 제공합니다.",
        code: `import { useRef, useState } from "react";
import {
  NodeCanvas, type NodeCanvasEdge, type NodeCanvasNode,
} from "@pydemia/ui";

const initialNodes: NodeCanvasNode[] = [
  { id: "request", title: "요청 접수", x: 64, y: 96 },
  { id: "review", title: "검토", x: 350, y: 96 },
];
const initialEdges: NodeCanvasEdge[] = [
  { id: "request-review", from: "request", to: "review" },
];

function RequestFlow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const nextEdgeId = useRef(0);
  return <NodeCanvas label="요청 처리 흐름" nodes={nodes} edges={edges}
    width={880} height={440} onNodesChange={setNodes}
    onConnect={(from, to) => setEdges((current) => [
      ...current, { id: "added-" + ++nextEdgeId.current,
        from, to },
    ])}
    onDisconnect={(id) => setEdges((current) =>
      current.filter((edge) => edge.id !== id))} />;
}`,
        preview: () => <NodeCanvasPreview />,
    },
    {
        id: "navigation", name: "Navigation", category: "Navigation",
        description: "전역·측면·하단 탐색을 현재 페이지 상태와 함께 표시합니다. 전역 링크는 표면형·밑줄형, 측면 링크는 선형·채움형, 하단 탐색은 막대형·독형을 고를 수 있습니다.",
        code: `import {
  GlobalNav, GlobalNavLink, SideNav, SideNavLink,
  BottomNav, BottomNavLink,
} from "@pydemia/ui";

<>
  <GlobalNav aria-label="전역 탐색">
    <GlobalNavLink href="/overview" aria-current="page"
      variant="underline">개요</GlobalNavLink>
    <GlobalNavLink href="/reports" variant="underline">보고서</GlobalNavLink>
  </GlobalNav>

  <SideNav aria-label="프로젝트 탐색">
    <SideNavLink href="/overview" aria-current="page"
      variant="filled">개요</SideNavLink>
    <SideNavLink href="/settings" variant="filled">설정</SideNavLink>
  </SideNav>

  <BottomNav aria-label="모바일 주요 탐색" appearance="dock">
    <BottomNavLink href="/overview" label="개요" aria-current="page" />
    <BottomNavLink href="/inbox" label="받은 편지함" />
    <BottomNavLink href="/settings" label="설정" />
  </BottomNav>
</>;`,
        preview: () => <NavigationPreview />,
    },
    {
        id: "anchor-nav", name: "AnchorNav", category: "Navigation",
        description: "긴 문서의 섹션으로 이동하고 스크롤 위치를 현재 링크에 반영합니다. 측면 선형·가로형 표시와 내부 스크롤 영역을 지원하며 focus는 이동시키지 않습니다.",
        code: `import { AnchorNav, type AnchorNavItem } from "@pydemia/ui";

const sections: AnchorNavItem[] = [
  { id: "summary", label: "요약" },
  { id: "metrics", label: "핵심 지표", depth: 2 },
  { id: "method", label: "분석 방법" },
];

<div className="grid grid-cols-[10rem_1fr] gap-4">
  <AnchorNav label="보고서 목차" items={sections}
    scrollRootId="report-scroll" offset={16} />
  <article id="report-scroll" className="max-h-96 overflow-y-auto">
    <section id="summary"><h2>요약</h2></section>
    <section id="metrics"><h2>핵심 지표</h2></section>
    <section id="method"><h2>분석 방법</h2></section>
  </article>
</div>`,
        preview: () => <AnchorNavPreview />,
    },
    {
        id: "navigation-menu", name: "NavigationMenu",
        category: "Navigation",
        description: "상단 탐색에서 링크를 그룹으로 열어 보여줍니다. Hover·click·키보드로 열고 Escape로 닫을 수 있습니다.",
        code: `import {
  NavigationMenu, NavigationMenuList, NavigationMenuItem,
  NavigationMenuTrigger, NavigationMenuContent, NavigationMenuLink,
} from "@pydemia/ui";

<NavigationMenu aria-label="제품 탐색">
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuLink variant="trigger" href="/overview"
        active>개요</NavigationMenuLink>
    </NavigationMenuItem>
    <NavigationMenuItem>
      <NavigationMenuTrigger>제품</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink href="/reports">보고서</NavigationMenuLink>
        <NavigationMenuLink href="/settings">설정</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>`,
        preview: () => <div className="preview-workspace min-h-52 w-full">
            <NavigationMenu aria-label="제품 탐색">
                <NavigationMenuList>
                    <NavigationMenuItem>
                        <NavigationMenuLink variant="trigger"
                            href="#overview" active>개요</NavigationMenuLink>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>제품</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <NavigationMenuLink href="#components">
                                컴포넌트
                            </NavigationMenuLink>
                            <NavigationMenuLink href="#tokens">
                                디자인 토큰
                            </NavigationMenuLink>
                            <NavigationMenuLink href="#installation">
                                사용 코드
                            </NavigationMenuLink>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
            </NavigationMenu>
        </div>,
    },
    {
        id: "menubar", name: "Menubar", category: "Navigation",
        description: "작업 화면의 파일·보기 명령을 상시 표시합니다. 상위 메뉴 사이의 방향키 이동과 항목·체크·라디오·서브메뉴 탐색을 지원합니다.",
        code: `import { useState } from "react";
import {
  Menubar, MenubarMenu, MenubarTrigger, MenubarContent,
  MenubarItem, MenubarCheckboxItem,
} from "@pydemia/ui";

function EditorCommands() {
  const [showGrid, setShowGrid] = useState(true);
  const [lastAction, setLastAction] = useState("");

  return <>
    <Menubar aria-label="편집기 명령">
      <MenubarMenu>
        <MenubarTrigger>파일</MenubarTrigger>
        <MenubarContent>
          <MenubarItem onSelect={() => setLastAction("새 문서")}>
            새 문서
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>보기</MenubarTrigger>
        <MenubarContent>
          <MenubarCheckboxItem checked={showGrid}
            onCheckedChange={(value) => setShowGrid(value === true)}>
            격자 표시
          </MenubarCheckboxItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
    <p role="status">{lastAction} 격자 {showGrid ? "표시" : "숨김"}</p>
  </>;
}`,
        preview: () => <MenubarPreview />,
    },
    {
        id: "pagination", name: "Pagination", category: "Data display",
        description: "전체 건수, 표시 범위, 페이지와 페이지당 건수를 controlled 값으로 표시합니다. 0건과 범위 밖 페이지도 처리합니다.",
        code: `import { Pagination } from "@pydemia/ui";
import { useState } from "react";

function RequestPages() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  return (
    <Pagination page={page} pageSize={pageSize} totalItems={23}
      onPageChange={setPage} pageSizeOptions={[5, 10]}
      onPageSizeChange={setPageSize} />
  );
}`,
        preview: () => <PaginationPreview />,
    },
    {
        id: "data-table", name: "DataTable", category: "Data display",
        description: "전체 행을 처리하는 기본 모드와 서버가 조회·정렬·페이지를 소유하는 remote 모드를 제공합니다. 행 밀도·줄무늬와 행별 상세 펼침을 선택할 수 있습니다. remote에서는 전달된 현재 페이지 행과 총건수·로딩·오류를 표시하며 선택 작업과 상세는 현재 페이지에 한정됩니다. 좁은 폭에서는 표만 가로로 스크롤합니다.",
        code: `import { Button, DataTable } from "@pydemia/ui";
import type { DataTableColumn } from "@pydemia/ui";

type Request = { id: string; name: string; status: string;
  detail: string };
const rows: Request[] = [
  { id: "1", name: "검색 필터", status: "대기",
    detail: "담당자와 상태로 요청을 좁힙니다." },
  { id: "2", name: "초대 화면", status: "완료",
    detail: "초대 링크의 만료일을 안내합니다." },
];
const columns: DataTableColumn<Request>[] = [
  { id: "name", header: "요청", cell: (row) => row.name,
    sortValue: (row) => row.name },
  { id: "status", header: "상태", cell: (row) => row.status },
];

<DataTable caption="화면 개선 요청" rows={rows} columns={columns}
  density="compact" striped
  getRowId={(row) => row.id} getRowLabel={(row) => row.name}
  renderRowDetails={(row) => <p>{row.detail}</p>}
  getSearchText={(row) => row.name}
  filter={{ label: "상태", getValue: (row) => row.status,
    options: [{ value: "대기", label: "대기" },
      { value: "완료", label: "완료" }] }}
  selectable renderActions={(selected, clear) => (
    <Button variant="outline" onClick={() => {
      console.log(selected.map((row) => row.id));
      clear();
    }}>선택 항목 처리</Button>
  )} />

// 서버 응답과 조회 상태를 소유하는 상위 화면에서 사용합니다.
// view가 바뀌면 해당 조건으로 다시 조회해 page를 갱신합니다.
import type { DataTableView } from "@pydemia/ui";
type RequestPage = {
  rows: Request[];
  totalItems: number;
  status: "ready" | "loading" | "error";
};
function RemoteRequests({ page, view, onViewChange, retry }: {
  page: RequestPage;
  view: DataTableView;
  onViewChange: (next: DataTableView) => void;
  retry: () => void;
}) {
  return <DataTable caption="원격 요청 목록" rows={page.rows}
    columns={columns} getRowId={(row) => row.id}
    renderRowDetails={(row) => <p>{row.detail}</p>}
    filter={{ label: "상태", options: [
      { value: "대기", label: "대기" },
      { value: "완료", label: "완료" },
    ] }}
    remote={{ view, totalItems: page.totalItems,
      status: page.status, searchable: true,
      onViewChange, onRetry: retry }} />;
}`,
        installItems: ["data-table", "button"],
        preview: () => <DataTablePreview />,
    },
    {
        id: "filter-bar", name: "FilterBar", category: "Data & analytics",
        description: "여러 입력의 적용·초기화와 현재 적용된 조건을 한곳에 표시합니다. 기간 필터는 DateRangePicker와 조합하며 데이터 필터링은 소비자가 맡습니다.",
        code: `import { useState } from "react";
import {
  DateRangePicker, Field, FilterBar, type DateRangeValue,
} from "@pydemia/ui";

function PeriodFilters() {
  const [draft, setDraft] = useState<DateRangeValue>(null);
  const [applied, setApplied] = useState<DateRangeValue>(null);
  const [error, setError] = useState(false);
  const dirty = draft?.from !== applied?.from ||
    draft?.to !== applied?.to;
  return <FilterBar label="기록 기간 필터" dirty={dirty}
    appliedFilters={applied?.to ? [{
      id: "period", label: "조회 기간",
      value: applied.from + " — " + applied.to,
    }] : []}
    onApply={(values) => {
      const from = String(values.get("periodStart") ?? "");
      const to = String(values.get("periodEnd") ?? "");
      if (!from || !to) { setError(true); return; }
      setApplied({ from, to });
      setError(false);
    }}
    onClear={() => {
      setDraft(null); setApplied(null); setError(false);
    }}>
    <Field label="조회 기간"
      error={error ? "시작일과 종료일을 선택하세요." : undefined}>
      {(control) => <DateRangePicker {...control}
        startName="periodStart" endName="periodEnd"
        value={draft} onValueChange={(next) => {
          setDraft(next); setError(false);
        }} />}
    </Field>
  </FilterBar>;
}`,
        installItems: ["filter-bar", "date-range-picker", "field"],
        preview: () => <FilterBarPreview />,
    },
    {
        id: "query-builder", name: "QueryBuilder",
        category: "Data & analytics",
        description: "필드·연산자·값을 AND/OR 그룹에 넣고 순서를 바꾸는 조건 편집기입니다. 미완성 조건은 보존하되 적용 callback에는 유효한 트리만 전달합니다. Panel·Plain 표시를 선택할 수 있으며 조회·저장은 호출자가 맡습니다.",
        code: `import { useState } from "react";
import {
  QueryBuilder, type QueryField, type QueryGroup,
} from "@pydemia/ui";

const fields: QueryField[] = [
  { id: "status", label: "상태", type: "select", options: [
    { value: "failed", label: "실패" },
    { value: "done", label: "완료" },
  ] },
  { id: "severity", label: "심각도", type: "number" },
  { id: "owner", label: "담당자", type: "text" },
];

function AuditRules() {
  const [query, setQuery] = useState<QueryGroup>({
    kind: "group", id: "root", combinator: "all", children: [],
  });
  const [applied, setApplied] = useState<QueryGroup | null>(null);
  return <div>
    <QueryBuilder label="감사 이벤트 조건" fields={fields}
      value={query} onValueChange={setQuery}
      onApply={setApplied} variant="panel" />
    {applied && <pre>{JSON.stringify(applied, null, 2)}</pre>}
  </div>;
}`,
        installItems: ["query-builder"],
        preview: () => <QueryBuilderPreview />,
    },
    {
        id: "log-console", name: "LogConsole", category: "Developer tools",
        description: "시간·수준·메시지를 읽을 수 있는 로그 영역입니다. 잦은 갱신의 음성 발표는 기본으로 끕니다.",
        code: `import { LogConsole } from "@pydemia/ui";

<LogConsole label="빌드 로그" entries={[
  { id: "1", timestamp: "10:42:01", level: "info",
    message: "빌드 시작" },
  { id: "2", timestamp: "10:42:03", level: "warn",
    message: "캐시를 다시 생성했습니다" },
]} />`,
        preview: () => <LogConsolePreview />,
    },
    {
        id: "log-viewer", name: "LogViewer", category: "Developer tools",
        description: "로그를 검색하고 수준별로 걸러 봅니다. 결과 건수와 빈 결과를 구분하고 panel·flat 표시를 선택합니다. 기록의 갱신과 삭제는 앱이 맡습니다.",
        code: `import { LogViewer } from "@pydemia/ui";

<LogViewer label="배포 로그" variant="panel" entries={[
  { id: "start", timestamp: "10:42:01", level: "info",
    message: "빌드 시작" },
  { id: "retry", timestamp: "10:42:04", level: "error",
    message: "배포를 재시도해야 합니다" },
]} />`,
        preview: () => <LogViewerPreview />,
    },
    {
        id: "terminal", name: "Terminal", category: "Developer tools",
        description: "명령 입력·실행 요청과 출력 기록을 한 곳에 둡니다. 위·아래 방향키로 이전 명령을 찾고, 실행과 결과 저장은 앱이 담당합니다.",
        code: `import { useRef, useState } from "react";
import { Terminal, type TerminalLine } from "@pydemia/ui";

function JobTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const nextId = useRef(0);

  function run(command: string) {
    const id = ++nextId.current;
    setLines((current) => [...current,
      { id: String(id) + "-command", kind: "command", text: command },
      { id: String(id) + "-output", kind: command === "status"
          ? "output" : "error", text: command === "status"
          ? "모든 작업 정상" : "지원하지 않는 명령" },
    ]);
  }

  return <Terminal label="작업 명령" lines={lines}
    onCommand={run} variant="panel" />;
}`,
        preview: () => <TerminalPreview />,
    },
    {
        id: "json-viewer", name: "JsonViewer",
        category: "Developer tools",
        description: "중첩 JSON을 접어 탐색합니다. 큰 배열·객체는 나누어 펼치고 원본 JSON을 복사할 수 있습니다.",
        code: `import { JsonViewer } from "@pydemia/ui";

<JsonViewer
  label="요청 응답"
  value={{
    status: "ready",
    records: [
      { id: "r-101", score: 92 },
      { id: "r-102", score: 87 },
    ],
  }}
  defaultExpandedDepth={2}
  pageSize={20}
  variant="frame"
/>`,
        preview: () => <JsonViewerPreview />,
    },
    {
        id: "sparkline", name: "Sparkline", category: "Data & analytics",
        description: "작은 시계열 추세를 SVG로 표시하고 시작·마지막·최저·최고 값을 이름으로 제공합니다. null은 결측 구간입니다.",
        code: `import { Sparkline } from "@pydemia/ui";

<Sparkline label="일별 요청" unit="건"
  values={[8, 12, 10, null, 15, 13, 19, 17]} />`,
        preview: () => <SparklinePreview />,
    },
    {
        id: "bar-list", name: "BarList", category: "Data & analytics",
        description: "범주별 음수가 없는 값을 가로 막대와 수치로 비교합니다. 긴 이름과 0건을 유지하며 기준 최댓값을 지정할 수 있습니다.",
        code: `import { BarList } from "@pydemia/ui";

<BarList title="작업별 처리 건수" unit="건"
  items={[
    { id: "usage", label: "일일 사용량 집계", value: 128 },
    { id: "audit", label: "이벤트 정합성 검사", value: 86 },
    { id: "notify", label: "알림 발송 준비", value: 0 },
  ]} />`,
        preview: () => <BarListPreview />,
    },
    {
        id: "bullet-chart", name: "BulletChart",
        category: "Data & analytics",
        description: "실제 값과 목표를 명시한 최대 범위 안에서 비교합니다. 실제 값이 없거나 0인 상태를 구분하고 세 수치를 텍스트로 보여 줍니다.",
        code: `import { BulletChart } from "@pydemia/ui";

<BulletChart title="완료율" value={74} target={80}
  max={100} unit="%" />`,
        preview: () => <BulletChartPreview />,
    },
    {
        id: "funnel-chart", name: "FunnelChart",
        category: "Data & analytics",
        description: "순서 있는 전환 단계의 건수와 첫 단계 대비 도달률을 표시합니다. 결측값·0건·빈 목록을 구분하고 증가하는 단계 수는 거부합니다.",
        code: `import { FunnelChart } from "@pydemia/ui";

<FunnelChart title="가입 전환 단계" unit="명"
  stages={[
    { id: "visit", label: "방문", value: 120 },
    { id: "signup", label: "가입", value: 96 },
    { id: "verify", label: "인증", value: 54 },
    { id: "first-use", label: "첫 사용", value: 23 },
  ]} />`,
        preview: () => <FunnelChartPreview />,
    },
    {
        id: "page-header", name: "PageHeader", category: "Content",
        installItems: ["page-header", "button"],
        description: "화면 제목, subtitle, 상위 맥락과 action을 한 영역에 배치합니다. compact·기본·hero 크기를 고르며 h1/h2 계층은 독립적으로 지정합니다.",
        code: `import { Button, PageHeader } from "@pydemia/ui";

<PageHeader
  size="hero"
  title="운영 대시보드"
  subtitle="오늘의 요청과 실행 상태를 확인합니다."
  eyebrow="Workspace"
  actions={<Button>새 보고서</Button>}
/>`,
        preview: () => <PageHeaderPreview />,
    },
    {
        id: "content-list", name: "ContentList", category: "Content",
        description: "bullet, 번호, 장식 없는 목록을 native list semantics와 공통 typography로 표시합니다.",
        code: `import { ContentList } from "@pydemia/ui";

<ContentList variant="bullet">
  <li>실행 로그 확인</li>
  <li>오류 상태 검토</li>
</ContentList>`,
        preview: () => <div className="preview-stack">
            <ContentList variant="bullet">
                <li>실행 로그 확인</li>
                <li>오류 상태 검토</li>
            </ContentList>
            <ContentList variant="numbered">
                <li>요청 선택</li>
                <li>결과 검토</li>
            </ContentList>
        </div>,
    },
    {
        id: "block-editor", name: "BlockEditor", category: "Content",
        description: "제목·문단·목록·인용·코드의 순서를 편집해 JSON 블록 배열로 제출합니다. 추가·삭제·이동·형식 변경은 구조 되돌리기·다시 실행으로 복구하고, 일반 텍스트 입력은 native textarea의 undo를 사용합니다. BlockDocument는 저장된 구조를 의미 있는 HTML로 표시합니다. HTML 붙여넣기와 인라인 서식은 제공하지 않습니다.",
        code: `import { useState } from "react";
import { BlockDocument, BlockEditor } from "@pydemia/ui";
import type { BlockEditorBlock } from "@pydemia/ui";

function ArticleForm() {
  const [blocks, setBlocks] = useState<BlockEditorBlock[]>([
    { id: "title", kind: "heading", text: "운영 안내" },
    { id: "body", kind: "paragraph", text: "검토 내용을 적습니다." },
  ]);
  const [saved, setSaved] = useState<BlockEditorBlock[]>([]);

  return <form onSubmit={(event) => {
    event.preventDefault();
    const value = new FormData(event.currentTarget).get("document");
    if (typeof value === "string") {
      setSaved(JSON.parse(value) as BlockEditorBlock[]);
    }
  }}>
    <BlockEditor label="문서 본문" name="document"
      blocks={blocks} onBlocksChange={setBlocks} />
    <button type="submit">저장</button>
    <BlockDocument label="저장된 본문" blocks={saved} />
  </form>;
}`,
        installItems: ["block-editor"],
        preview: () => <BlockEditorPreview />,
    },
    {
        id: "carousel", name: "Carousel", category: "Content",
        description: "한 번에 하나의 콘텐츠를 보여주고 이전·다음, 위치와 선택 버튼으로 이동합니다. 자동 재생 없이 터치 넘김과 카드·기본형을 제공합니다.",
        code: `import { Carousel } from "@pydemia/ui";

const slides = [
  { id: "summary", label: "운영 요약",
    content: <p>오늘 처리한 요청을 확인합니다.</p> },
  { id: "approval", label: "승인 현황",
    content: <p>검토 대기 3건이 있습니다.</p> },
  { id: "activity", label: "실행 기록",
    content: <p>최근 실행 결과를 살펴봅니다.</p> },
];

<>
  <Carousel label="업무 둘러보기" slides={slides} showIndicators />
  <Carousel label="업무 둘러보기" slides={slides}
    variant="plain" loop />
</>;`,
        preview: () => <CarouselPreview />,
    },
    {
        id: "data-chart", name: "DataChart", category: "Data & analytics",
        description: "단일·다중 계열을 선형·그룹 막대·누적 막대·영역·누적 영역으로 표시합니다. 선택형 범례로 계열을 숨기고 축·누적값을 다시 계산할 수 있습니다. 구간 선택기와 데이터 표로 값을 확인하며, 선택적으로 그래프 위에 포인터 구간의 요약을 띄울 수 있습니다.",
        code: `import { DataChart } from "@pydemia/ui";

const points = [
  { label: "월", value: 8 },
  { label: "화", value: 12 },
  { label: "수", value: null },
  { label: "목", value: 15 },
];

<>
  <DataChart title="요일별 완료" points={points}
    unit="건" inspectable hoverSummary />
  <DataChart title="요일별 완료" points={points}
    unit="건" variant="bar" />
  <DataChart title="요일별 완료" points={points}
    unit="건" variant="area" />
</>;

const series = [
  { id: "completed", label: "완료", values: [8, 12, null, 15] },
  { id: "pending", label: "대기", values: [4, 6, 7, 3] },
];

<>
  <DataChart title="요일별 요청" categories={["월", "화", "수", "목"]}
    series={series} unit="건" variant="line"
    toggleableSeries inspectable />
  <DataChart title="요일별 요청 구성"
    categories={["월", "화", "수", "목"]}
    series={series} unit="건" variant="stacked-bar"
    inspectable toggleableSeries />
  <DataChart title="요일별 요청 추이"
    categories={["월", "화", "수", "목"]}
    series={series} unit="건" variant="stacked-area"
    inspectable toggleableSeries />
</>;`,
        preview: () => <DataChartPreview />,
    },
    {
        id: "donut-chart", name: "DonutChart",
        category: "Data & analytics",
        description: "음수가 없는 범주별 수치를 비율로 표시합니다. 총합·값·비율을 텍스트로 함께 제공하고 0건을 구분합니다.",
        code: `import { DonutChart } from "@pydemia/ui";

const segments = [
  { label: "완료", value: 42 },
  { label: "검토 중", value: 23 },
  { label: "대기", value: 15 },
];

<DonutChart title="요청 처리 상태" segments={segments}
  unit="건" totalLabel="전체 요청" />`,
        preview: () => <DonutChartPreview />,
    },
    {
        id: "heatmap", name: "Heatmap", category: "Data & analytics",
        description: "두 범주의 수치를 색 농도와 숫자로 함께 표시합니다. 결측값·0·빈 목록을 구분하고 좁은 화면에서는 표만 가로로 스크롤합니다.",
        code: `import { Heatmap } from "@pydemia/ui";

const columns = ["09시", "10시", "11시", "12시"];
const rows = [
  { id: "mon", label: "월", values: [3, 5, 9, 6] },
  { id: "tue", label: "화", values: [2, 0, null, 5] },
];

<Heatmap title="요일·시간별 요청" unit="건"
  description="결측값은 —로 표시합니다."
  columns={columns} rows={rows} density="compact" />;`,
        preview: () => <HeatmapPreview />,
    },
    {
        id: "scatter-chart", name: "ScatterChart",
        category: "Data & analytics",
        description: "두 연속 수치의 관계를 점으로 표시합니다. 점 선택기와 데이터 표에서 정확한 값·결측값을 확인할 수 있습니다.",
        code: `import { ScatterChart } from "@pydemia/ui";

const points = [
  { id: "mon", label: "월", x: 120, y: 96 },
  { id: "tue", label: "화", x: 220, y: 81 },
  { id: "wed", label: "수", x: 310, y: 62 },
  { id: "sat", label: "토", x: null, y: 70 },
];

<ScatterChart title="처리량과 평균 지연" xLabel="처리량"
  yLabel="평균 지연" xUnit="건/분" yUnit="ms"
  points={points} />;`,
        preview: () => <ScatterChartPreview />,
    },
    {
        id: "dashboard", name: "Dashboard", category: "Data & analytics",
        installItems: [
            "dashboard", "page-header", "metric-card", "data-chart",
        ],
        description: "지표와 상세 panel을 container 폭에 따라 배치합니다. 각 영역에 이름을 주고 기존 카드·차트를 조합합니다.",
        code: `import {
  Dashboard, DashboardMetrics, DashboardPanels,
  MetricCard, DataChart, PageHeader,
} from "@pydemia/ui";

<Dashboard>
  <PageHeader title="운영 대시보드" />
  <DashboardMetrics aria-label="주요 지표">
    <MetricCard label="요청" value="1,284" />
    <MetricCard label="완료" value="1,216" />
  </DashboardMetrics>
  <DashboardPanels aria-label="상세 분석">
    <DataChart title="요일별 완료" unit="건"
      points={[{ label: "월", value: 8 },
        { label: "화", value: 12 }]} />
  </DashboardPanels>
</Dashboard>`,
        preview: () => <DashboardPreview />,
    },
    {
        id: "toast", name: "Toast", category: "Feedback",
        installItems: ["toast", "button"],
        description: "정보·성공·주의·오류를 텍스트와 상태색, live region으로 알립니다. Queue는 먼저 온 알림부터 최대 표시 수만큼 보여주며 자동으로 사라지지 않습니다.",
        code: `import { Button, ToastQueue, useToastQueue } from "@pydemia/ui";

function SaveNotice() {
  const { visible, pendingCount, enqueue, dismiss } = useToastQueue(2);
  return <>
    <Button onClick={() => enqueue({
      dedupeKey: "saved", variant: "success",
      title: "저장했습니다", closeLabel: "알림 닫기",
    })}>저장</Button>
    <Button onClick={() => enqueue({
      variant: "warning", statusLabel: "주의",
      title: "만료 예정 항목을 검토하세요",
      closeLabel: "알림 닫기",
    })}>주의 알림</Button>
    <span>대기 중 {pendingCount}건</span>
    <ToastQueue notices={visible} onDismiss={dismiss} />
  </>;
}`,
        preview: () => <ToastPreview />,
    },
    {
        id: "notification-center", name: "NotificationCenter",
        category: "Feedback",
        description: "읽음 상태를 호출자가 저장하는 알림 목록입니다. 전체·읽지 않음 필터, 항목별 읽음 변경, 전체 읽음과 panel·plain 표시를 제공합니다. Toast와 달리 화면을 닫아도 데이터는 호출자에게 남습니다.",
        code: `import { useState } from "react";
import { NotificationCenter, type NotificationItem } from "@pydemia/ui";

const initial: NotificationItem[] = [
  { id: "review", title: "검토 요청", message: "권한 변경을 확인하세요.",
    timestamp: "오늘 09:42", read: false },
  { id: "saved", title: "설정 저장 완료",
    timestamp: "어제", read: true },
];

function Notifications() {
  const [items, setItems] = useState(initial);
  const [opened, setOpened] = useState<string | null>(null);
  return <>
    <NotificationCenter label="알림" notifications={items}
      onReadChange={(id, read) => setItems((current) =>
        current.map((item) => item.id === id
          ? { ...item, read } : item))}
      onMarkAllRead={() => setItems((current) =>
        current.map((item) => ({ ...item, read: true })))}
      onOpen={setOpened} />
    {opened && <p>{opened} 열기를 요청했습니다.</p>}
  </>;
}`,
        preview: () => <NotificationCenterPreview />,
    },
    {
        id: "response-feedback", name: "ResponseFeedback",
        category: "Feedback",
        description: "답변의 좋아요·싫어요를 서로 배타적인 선택으로 받습니다. 선택과 집계 저장은 사용 측에서 처리합니다.",
        code: `import { useState } from "react";
import { ResponseFeedback, type ResponseFeedbackValue } from "@pydemia/ui";

function AnswerVote() {
  const [vote, setVote] = useState<ResponseFeedbackValue>(null);
  return <ResponseFeedback label="답변 평가" value={vote}
    onValueChange={setVote} counts={{ up: 12, down: 2 }} />;
}`,
        preview: () => <ResponseFeedbackPreview />,
    },
    {
        id: "favorite-toggle", name: "FavoriteToggle",
        category: "Actions",
        description: "글·항목을 즐겨찾기하는 별 모양 toggle입니다. 선택 상태와 집계는 사용 측에서 저장합니다.",
        code: `import { useState } from "react";
import { FavoriteToggle } from "@pydemia/ui";

function FavoritePost() {
  const [favorite, setFavorite] = useState(false);
  return <FavoriteToggle label="이 글 즐겨찾기" count={24}
    pressed={favorite} onPressedChange={setFavorite} />;
}`,
        preview: () => <FavoriteTogglePreview />,
    },
    {
        id: "board", name: "Board", category: "Content",
        installItems: ["board", "button", "dialog", "input", "label",
            "textarea"],
        description: "게시글 제목·요약·작성자·댓글 수를 목록으로 표시하고 글 선택과 작성 시작을 알립니다. 글 작성 modal은 Dialog로 구성합니다.",
        code: `import { useRef, useState } from "react";
import { Board, Button, Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, Input, Label, Textarea,
  type BoardPost } from "@pydemia/ui";

function NoticeBoard() {
  const createButtonRef = useRef<HTMLElement | null>(null);
  const [posts, setPosts] = useState<BoardPost[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  return <>
    <Board label="게시판" posts={posts} selectedPostId={selected}
      onSelectPost={setSelected} onCreatePost={() => {
        createButtonRef.current = document.activeElement as HTMLElement;
        setOpen(true);
      }} />
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onCloseAutoFocus={(event) => {
        event.preventDefault();
        createButtonRef.current?.focus();
      }}>
        <DialogHeader>
          <DialogTitle>글쓰기</DialogTitle>
          <DialogDescription>제목과 내용을 입력하세요.</DialogDescription>
        </DialogHeader>
        <form onSubmit={(event) => {
          event.preventDefault();
          const id = crypto.randomUUID();
          setPosts((current) => [{ id, title, summary, author: "나",
            createdAt: new Date().toISOString().slice(0, 10) },
            ...current]);
          setSelected(id);
          setOpen(false);
          setTitle("");
          setSummary("");
        }}>
          <Label htmlFor="post-title">제목</Label>
          <Input id="post-title" required value={title}
            onChange={(event) => setTitle(event.target.value)} />
          <Label htmlFor="post-summary">내용</Label>
          <Textarea id="post-summary" required value={summary}
            onChange={(event) => setSummary(event.target.value)} />
          <Button type="submit">게시</Button>
        </form>
      </DialogContent>
    </Dialog>
  </>;
}`,
        preview: () => <BoardPreview />,
    },
    {
        id: "thread", name: "Thread", category: "Content",
        description: "부모 댓글 ID로 대댓글을 표시하고 각 댓글에 답글을 작성합니다. 등록 실패 시 입력을 유지하며 저장은 onReply에서 처리합니다.",
        code: `import { useState } from "react";
import { Thread, type ThreadComment } from "@pydemia/ui";

function Discussion() {
  const [comments, setComments] = useState<ThreadComment[]>([]);
  return <Thread label="댓글" comments={comments}
    onReply={(parentId, content) => {
      setComments((current) => [...current, {
        id: crypto.randomUUID(), parentId, author: "나", content,
        createdAt: new Date().toISOString().slice(0, 10),
      }]);
    }} />;
}`,
        preview: () => <ThreadPreview />,
    },
];
