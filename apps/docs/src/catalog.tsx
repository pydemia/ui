import {
    Accordion, AccordionContent, AccordionItem, AccordionTrigger,
    AffixedInput, Alert, AlertDescription, AlertTitle,
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
    AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
    AlertDialogTitle, AlertDialogTrigger, Avatar, AvatarFallback, Badge,
    Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
    BreadcrumbPage, BreadcrumbSeparator, Button, Collapsible,
    CollapsibleContent, CollapsibleTrigger,
    Calendar, Card, CardContent, CardDescription, CardFooter, CardHeader,
    CardTitle,
    Checkbox, DatePicker, Dialog, DialogClose, DialogContent,
    DialogDescription, DialogFooter, DialogHeader, DialogTitle,
    DialogTrigger, Dropzone, Empty, EmptyContent, EmptyDescription,
    EmptyMedia, EmptyTitle, Field, Input, Label,
    Message, MessageContent, MetricCard, NativeSelect, Popover,
    PopoverClose, PopoverContent, PopoverTrigger, Progress, PromptInput,
    RadioGroup, RadioGroupItem, Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue, Separator, Skeleton, Slider,
    Snippet, SnippetContent, SnippetCopyButton, SnippetHeader, Spinner,
    SnippetTabsList, SnippetTabsTrigger, Switch, Table, TableCell,
    TableHead, Tabs, TabsContent, TabsList, TabsTrigger, Textarea, Toggle,
    Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@pydemia/ui";
import { Inbox } from "lucide-react";
import { ko } from "react-day-picker/locale";
import { useState, type ReactNode } from "react";

export type ComponentEntry = {
    id: string;
    name: string;
    category: string;
    description: string;
    code: string;
    preview: () => ReactNode;
};

function SnippetPreview() {
    const [active, setActive] = useState("npm");
    const snippets: Record<string, string> = {
        npm: "npm run registry:build",
        usage: 'import { Snippet } from "@pydemia/ui";',
    };
    return <div className="preview-snippet"><Snippet value={active} onValueChange={setActive}><SnippetHeader><SnippetTabsList aria-label="코드 종류"><SnippetTabsTrigger value="npm">Registry</SnippetTabsTrigger><SnippetTabsTrigger value="usage">Usage</SnippetTabsTrigger></SnippetTabsList><SnippetCopyButton value={snippets[active]} /></SnippetHeader><SnippetContent value="npm">{snippets.npm}</SnippetContent><SnippetContent value="usage">{snippets.usage}</SnippetContent></Snippet></div>;
}

function CheckboxPreview() {
    const [checked, setChecked] = useState(false);

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
        </div>
    );
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

function AlertPreview() {
    const [showError, setShowError] = useState(false);

    return (
        <div className="preview-alerts">
            <Alert>
                <AlertTitle>저장되었습니다</AlertTitle>
                <AlertDescription>변경 사항을 확인할 수 있습니다.</AlertDescription>
            </Alert>
            <Button variant="outline" onClick={() => setShowError(!showError)}>
                {showError ? "오류 숨기기" : "오류 표시"}
            </Button>
            {showError && (
                <Alert variant="destructive">
                    <AlertTitle>저장하지 못했습니다</AlertTitle>
                    <AlertDescription>입력값을 확인하고 다시 시도하세요.</AlertDescription>
                </Alert>
            )}
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
        </div>
    );
}

function ProgressPreview() {
    const [progress, setProgress] = useState(30);

    return (
        <div className="preview-stack">
            <div>업로드 진행률: {progress}%</div>
            <Progress aria-label="업로드 진행률" value={progress} />
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
                    <>
                        <span className="sr-only">내용을 불러오는 중</span>
                        <Skeleton className="mb-2 h-4 w-40" />
                        <Skeleton className="h-4 w-64 max-w-full" />
                    </>
                ) : "불러온 내용입니다."}
            </div>
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

    return (
        <div className="preview-stack">
            <div>음량: {value[0]}%</div>
            <Slider aria-label="음량" value={value} onValueChange={setValue} />
        </div>
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

function CalendarPreview() {
    const [date, setDate] = useState<Date | undefined>(
        new Date(2026, 8, 15),
    );

    return (
        <div className="preview-stack">
            <Calendar
                mode="single"
                defaultMonth={new Date(2026, 8, 1)}
                locale={ko}
                selected={date}
                onSelect={setDate}
            />
            <p role="status">
                선택한 날짜: {date ? date.toLocaleDateString("ko-KR") : "없음"}
            </p>
        </div>
    );
}

function MetricCardPreview() {
    const [count, setCount] = useState(24);

    return (
        <div className="preview-stack">
            <MetricCard
                label="검토 완료"
                value={count}
                change={`지난주보다 ${count - 20}건 증가`}
                detail="이번 주"
            />
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

export const catalog: ComponentEntry[] = [
    {
        id: "button", name: "Button", category: "Actions",
        description: "Primary, outline, ghost 변형과 disabled 상태를 지원하는 기본 동작 컴포넌트입니다.",
        code: `import { Button } from "@pydemia/ui";

<Button>저장하기</Button>
<Button variant="outline">취소</Button>
<Button variant="ghost" disabled>사용 불가</Button>`,
        preview: () => <div className="preview-row"><Button>저장하기</Button><Button variant="outline">취소</Button><Button variant="ghost">자세히 보기</Button><Button disabled>사용 불가</Button></div>,
    },
    {
        id: "input", name: "Input", category: "Inputs",
        description: "기본 HTML input을 토큰에 맞춰 정리했습니다. Label과 함께 사용합니다.",
        code: `import { Input, Label } from "@pydemia/ui";

<Label htmlFor="project-name">프로젝트 이름</Label>
<Input id="project-name" placeholder="예: design-system" />`,
        preview: () => <div className="preview-field"><Label htmlFor="demo-project">프로젝트 이름</Label><Input id="demo-project" placeholder="예: design-system" /></div>,
    },
    {
        id: "label", name: "Label", category: "Inputs",
        description: "form control과 직접 연결되는 native label입니다.",
        code: `import { Input, Label } from "@pydemia/ui";

<Label htmlFor="email">이메일</Label>
<Input id="email" type="email" placeholder="you@example.com" />`,
        preview: () => <div className="preview-field"><Label htmlFor="demo-email">이메일</Label><Input id="demo-email" type="email" placeholder="you@example.com" /></div>,
    },
    {
        id: "badge", name: "Badge", category: "Data display",
        description: "상태를 텍스트로 명시하는 작고 절제된 표시 요소입니다.",
        code: `import { Badge } from "@pydemia/ui";

<Badge>Foundation</Badge>
<Badge>Review pending</Badge>`,
        preview: () => <div className="preview-row"><Badge>Foundation</Badge><Badge>Normalized</Badge><Badge>Review pending</Badge></div>,
    },
    {
        id: "checkbox", name: "Checkbox", category: "Selection",
        description: "선택·비활성 상태를 공통 token으로 표시합니다. Label을 연결해 사용합니다.",
        code: `import { Checkbox, Label } from "@pydemia/ui";

<div>
  <Checkbox id="notifications" defaultChecked />
  <Label htmlFor="notifications">알림 받기</Label>
</div>
<Checkbox aria-label="일부 선택" defaultChecked="indeterminate" />
<Checkbox aria-label="사용할 수 없는 옵션" disabled />`,
        preview: () => <CheckboxPreview />,
    },
    {
        id: "dialog", name: "Dialog", category: "Overlays",
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
        id: "alert", name: "Alert", category: "Feedback",
        description: "일반 안내는 status, 오류 안내는 alert로 알립니다. 메시지는 색상과 함께 텍스트로 적습니다.",
        code: `import { Alert, AlertTitle, AlertDescription } from "@pydemia/ui";

<Alert>
  <AlertTitle>저장되었습니다</AlertTitle>
  <AlertDescription>변경 사항을 확인할 수 있습니다.</AlertDescription>
</Alert>
<Alert variant="destructive">
  <AlertTitle>저장하지 못했습니다</AlertTitle>
  <AlertDescription>입력값을 확인하세요.</AlertDescription>
</Alert>`,
        preview: () => <AlertPreview />,
    },
    {
        id: "textarea", name: "Textarea", category: "Inputs",
        description: "여러 줄 입력에 쓰는 native textarea입니다. label과 오류 상태는 사용하는 form에서 연결합니다.",
        code: `import { Label, Textarea } from "@pydemia/ui";

<Label htmlFor="notes">메모</Label>
<Textarea id="notes" rows={3} placeholder="메모를 입력하세요" />`,
        preview: () => <div className="preview-stack"><Label htmlFor="demo-notes">메모</Label><Textarea id="demo-notes" rows={3} placeholder="메모를 입력하세요" /></div>,
    },
    {
        id: "native-select", name: "NativeSelect", category: "Selection",
        description: "브라우저의 native select 동작을 유지하면서 입력 높이와 색상을 맞췄습니다.",
        code: `import { Label, NativeSelect } from "@pydemia/ui";

<Label htmlFor="density">화면 밀도</Label>
<NativeSelect id="density" defaultValue="standard">
  <option value="standard">기본</option>
  <option value="compact">좁게</option>
</NativeSelect>`,
        preview: () => <NativeSelectPreview />,
    },
    {
        id: "switch", name: "Switch", category: "Selection",
        description: "즉시 적용되는 설정에 쓰는 switch입니다. 현재 상태를 화면에도 텍스트로 표시합니다.",
        code: `import { Label, Switch } from "@pydemia/ui";

<Switch id="email-alerts" defaultChecked />
<Label htmlFor="email-alerts">이메일 알림</Label>`,
        preview: () => <SwitchPreview />,
    },
    {
        id: "radio-group", name: "RadioGroup", category: "Selection",
        description: "한 옵션을 선택하는 radio group입니다. 방향키 이동과 그룹 이름을 지원합니다.",
        code: `import { Label, RadioGroup, RadioGroupItem } from "@pydemia/ui";

<RadioGroup aria-label="화면 밀도" defaultValue="standard">
  <div>
    <RadioGroupItem id="standard" value="standard" />
    <Label htmlFor="standard">기본</Label>
  </div>
  <div>
    <RadioGroupItem id="compact" value="compact" />
    <Label htmlFor="compact">좁게</Label>
  </div>
</RadioGroup>`,
        preview: () => <RadioGroupPreview />,
    },
    {
        id: "card", name: "Card", category: "Layout",
        description: "제목·설명·본문·동작을 한 표면에 묶는 조합 요소입니다.",
        code: `import {
  Badge, Card, CardContent, CardDescription,
  CardFooter, CardHeader, CardTitle,
} from "@pydemia/ui";

<Card>
  <CardHeader>
    <CardTitle>검토 대기</CardTitle>
    <CardDescription>새 component 3개</CardDescription>
  </CardHeader>
  <CardContent>등록 전 확인이 필요합니다.</CardContent>
  <CardFooter><Badge>검토 대기</Badge></CardFooter>
</Card>`,
        preview: () => <div className="preview-stack"><Card><CardHeader><CardTitle>검토 대기</CardTitle><CardDescription>새 component 3개</CardDescription></CardHeader><CardContent>등록 전 확인이 필요합니다.</CardContent><CardFooter><Badge>검토 대기</Badge></CardFooter></Card></div>,
    },
    {
        id: "separator", name: "Separator", category: "Layout",
        description: "콘텐츠 구획을 가르는 가로·세로 선입니다. 기본값은 장식적 분리선입니다.",
        code: `import { Separator } from "@pydemia/ui";

<div>프로젝트 정보</div>
<Separator className="my-3" />
<div>권한 정보</div>`,
        preview: () => <div className="preview-stack"><span>프로젝트 정보</span><Separator /><span>권한 정보</span></div>,
    },
    {
        id: "progress", name: "Progress", category: "Feedback",
        description: "진행 수치를 표시하는 progressbar입니다. 접근 가능한 이름을 함께 지정합니다.",
        code: `import { Progress } from "@pydemia/ui";

<Progress aria-label="업로드 진행률" value={30} />`,
        preview: () => <ProgressPreview />,
    },
    {
        id: "skeleton", name: "Skeleton", category: "Feedback",
        description: "불러오는 동안 자리만 표시합니다. 로딩 상태 텍스트는 상위 요소가 제공합니다.",
        code: `import { Skeleton } from "@pydemia/ui";

<div role="status">
  <span className="sr-only">내용을 불러오는 중</span>
  <Skeleton className="h-4 w-40" />
</div>`,
        preview: () => <SkeletonPreview />,
    },
    {
        id: "tooltip", name: "Tooltip", category: "Overlays",
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
        id: "alert-dialog", name: "AlertDialog", category: "Overlays",
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
        preview: () => <div className="preview-row"><Avatar><AvatarFallback>김하나</AvatarFallback></Avatar><Avatar><AvatarFallback>박지민</AvatarFallback></Avatar></div>,
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
        description: "항목이 없는 상태와 다음 동작을 제목, 설명, 버튼으로 전달합니다.",
        code: `import { Empty, EmptyTitle, EmptyDescription, EmptyContent, Button } from "@pydemia/ui";

<Empty>
  <EmptyTitle>아직 항목이 없습니다</EmptyTitle>
  <EmptyDescription>새 항목을 추가해 시작하세요.</EmptyDescription>
  <EmptyContent><Button>항목 추가</Button></EmptyContent>
</Empty>`,
        preview: () => <Empty><EmptyMedia><Inbox /></EmptyMedia><EmptyTitle>아직 항목이 없습니다</EmptyTitle><EmptyDescription>새 항목을 추가해 시작하세요.</EmptyDescription><EmptyContent><Button variant="outline">항목 추가</Button></EmptyContent></Empty>,
    },
    {
        id: "spinner", name: "Spinner", category: "Feedback",
        description: "진행 중 상태를 이름과 함께 표시합니다. reduced motion 설정에서는 회전을 줄입니다.",
        code: `import { Spinner } from "@pydemia/ui";

<Spinner aria-label="불러오는 중" />`,
        preview: () => <div className="preview-row"><Spinner aria-label="불러오는 중" /><span>불러오는 중</span></div>,
    },
    {
        id: "toggle", name: "Toggle", category: "Actions",
        description: "눌림 상태를 유지하는 동작 버튼입니다. aria-pressed 상태를 사용합니다.",
        code: `import { Toggle } from "@pydemia/ui";

<Toggle aria-label="굵게" defaultPressed>굵게</Toggle>`,
        preview: () => <TogglePreview />,
    },
    {
        id: "slider", name: "Slider", category: "Selection",
        description: "단일 값 또는 범위 값을 조절합니다. 각 thumb에 접근 가능한 이름을 지정합니다.",
        code: `import { Slider } from "@pydemia/ui";

<Slider aria-label="음량" defaultValue={[40]} min={0} max={100} />`,
        preview: () => <SliderPreview />,
    },
    {
        id: "calendar", name: "Calendar", category: "Date & time",
        description: "React DayPicker의 날짜 선택과 키보드 이동을 공통 token으로 표시합니다.",
        code: `import { Calendar } from "@pydemia/ui";
import { ko } from "react-day-picker/locale";
import { useState } from "react";

function DateExample() {
  const [date, setDate] = useState<Date | undefined>();
  return <Calendar mode="single" locale={ko} selected={date} onSelect={setDate} />;
}`,
        preview: () => <CalendarPreview />,
    },
    {
        id: "metric-card", name: "MetricCard", category: "Data & analytics",
        description: "수치, 변화, 기간을 텍스트로 함께 전달하는 분석 카드입니다. 차트 없이도 값을 읽을 수 있습니다.",
        code: `import { MetricCard } from "@pydemia/ui";

<MetricCard
  label="검토 완료"
  value={24}
  change="지난주보다 4건 증가"
  detail="이번 주"
/>`,
        preview: () => <MetricCardPreview />,
    },
    {
        id: "dropzone", name: "Dropzone", category: "File & media",
        description: "파일 선택과 drag-and-drop을 받습니다. 형식·개수 오류를 텍스트로 알리고, 업로드는 소비자가 처리합니다.",
        code: `import { Dropzone } from "@pydemia/ui";

<Dropzone
  label="이미지 선택"
  description="PNG 또는 JPEG, 최대 1MB"
  accept={{ "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] }}
  maxSize={1024 * 1024}
  onFilesSelected={(files) => console.log(files)}
/>`,
        preview: () => <Dropzone label="이미지 선택" description="PNG 또는 JPEG, 최대 1MB" accept={{ "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] }} maxSize={1024 * 1024} />,
    },
    {
        id: "message", name: "Message", category: "AI & agent",
        description: "사용자 메시지는 어두운 배경과 밝은 글씨로, 응답은 기본 표면으로 구분합니다.",
        code: `import { Message, MessageContent } from "@pydemia/ui";

<Message from="user">
  <MessageContent>배포 상태를 알려주세요.</MessageContent>
</Message>
<Message from="assistant">
  <MessageContent>로컬 빌드가 완료됐습니다.</MessageContent>
</Message>`,
        preview: () => <MessagePreview />,
    },
    {
        id: "prompt-input", name: "PromptInput", category: "AI & agent",
        description: "Enter로 전송하고 Shift+Enter로 줄을 바꾸는 메시지 입력입니다. 빈 내용은 전송하지 않습니다.",
        code: `import { PromptInput } from "@pydemia/ui";

<PromptInput onSend={(text) => console.log(text)} />`,
        preview: () => <PromptInputPreview />,
    },
    {
        id: "tabs", name: "Tabs", category: "Navigation",
        description: "탭 전환, 키보드 이동, 선택 상태를 제공합니다.",
        code: `import { Tabs, TabsList, TabsTrigger, TabsContent } from "@pydemia/ui";

<Tabs defaultValue="overview">
  <TabsList aria-label="항목 보기">
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="details">Details</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">개요</TabsContent>
  <TabsContent value="details">상세 내용</TabsContent>
</Tabs>`,
        preview: () => <Tabs defaultValue="overview"><TabsList aria-label="항목 보기"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="details">Details</TabsTrigger></TabsList><TabsContent value="overview"><p className="preview-tabs-content">프로젝트의 주요 정보입니다.</p></TabsContent><TabsContent value="details"><p className="preview-tabs-content">선택한 항목의 상세 내용입니다.</p></TabsContent></Tabs>,
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
        id: "field", name: "Field", category: "Inputs",
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
        id: "date-picker", name: "DatePicker", category: "Date & time",
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
];
