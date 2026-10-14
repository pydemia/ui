import { Component, useLayoutEffect, useState, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import {
    applyThemeToElement, Badge, Button, Card, CardContent, CardHeader,
    CardTitle, Checkbox, Dashboard, DashboardPanels, designModes, Dialog, DialogClose, DialogContent,
    DialogDescription, DialogTitle, DialogTrigger, Input, NativeSelect,
    resolveThemeSettings, Select, SelectContent, SelectItem, SelectTrigger,
    SelectValue, Spinner, ThemeScope, Toggle, type Appearance, type DesignModeId,
} from "@pydemia/ui";
import { catalog } from "./catalog";
import { AnalyticsWorkspace } from "./analytics-workspace";
import { ReviewWorkspace } from "./review-workspace";
import { IntakeWorkspace } from "./intake-workspace";
import "./styles.css";
import "@pydemia/ui/design-modes.css";

// Repeatable browser fixture; Vite's production input excludes this HTML.
const options = { allowUnreleased: true };
class PreviewBoundary extends Component<
    { children: ReactNode; name: string }, { error: string }
> {
    state = { error: "" };
    static getDerivedStateFromError(error: Error) {
        return { error: error.message };
    }
    render() {
        return this.state.error
            ? <p role="alert" data-qa-error={this.props.name}>
                {this.props.name}: {this.state.error}
            </p> : this.props.children;
    }
}

function App() {
    const [design, setDesign] = useState<DesignModeId>("basic");
    const [appearance, setAppearance] = useState<Appearance>("light");
    const [draft, setDraft] = useState("업무 초안 유지");
    const [selected, setSelected] = useState(true);
    const [pressed, setPressed] = useState(false);
    const settings = resolveThemeSettings({ design, appearance }, options).settings;
    useLayoutEffect(() => applyThemeToElement(
        document.documentElement, settings, options,
    ), [design, appearance]);

    function controls(prefix: string) {
        return <div className="flex flex-wrap gap-3">
            <label className="grid gap-1">{prefix} 디자인
                <NativeSelect aria-label={`${prefix} 디자인`} value={design}
                    onChange={(event) => setDesign(event.target.value as DesignModeId)}>
                    {designModes.map((mode) => <option key={mode.id} value={mode.id}>
                        {mode.name}
                    </option>)}
                </NativeSelect>
            </label>
            <label className="grid gap-1">{prefix} 밝기
                <NativeSelect aria-label={`${prefix} 밝기`} value={appearance}
                    onChange={(event) => setAppearance(event.target.value as Appearance)}>
                    <option value="light">Light</option><option value="dark">Dark</option>
                </NativeSelect>
            </label>
        </div>;
    }

    return <ThemeScope settings={settings} options={options}>
        <main className="mx-auto max-w-6xl p-5">
            <header className="grid gap-3 border-b border-border pb-5">
                <h1 data-ui="heading" className="text-2xl">Design mode browser QA</h1>
                <p>개발 전용 · 실제 catalog 144개 · 업무 상태와 공개 검증을 분리합니다.</p>
                {controls("페이지")}
                <output aria-label="실제 설정">{JSON.stringify(settings)}</output>
            </header>
            <section className="my-5 grid gap-3" aria-label="대표 상태">
                <div className="flex flex-wrap gap-3">
                    <Button>기본 동작</Button><Button variant="outline">외곽 동작</Button>
                    <Button variant="ghost">보조 동작</Button><Button disabled>사용 불가</Button>
                    <Badge variant="accent">선택됨</Badge><Badge variant="danger">오류</Badge>
                    <Checkbox aria-label="검수 선택" checked={selected}
                        onCheckedChange={(value) => setSelected(value === true)} />
                    <Toggle aria-label="검수 눌림" pressed={pressed}
                        onPressedChange={setPressed}>눌림 상태</Toggle>
                    <Button disabled aria-busy="true" data-qa-state="loading">
                        <Spinner aria-label="검수 로딩" className="text-current" />처리 중
                    </Button>
                </div>
                <label className="grid gap-1">유지할 초안
                    <Input aria-label="유지할 초안" value={draft}
                        onChange={(event) => setDraft(event.target.value)} />
                </label>
                <label className="grid gap-1">사용 불가 입력
                    <Input aria-label="사용 불가 입력" disabled value="보존된 값" />
                </label>
                <label className="grid gap-1">오류 입력
                    <Input aria-label="오류 입력" aria-invalid="true"
                        aria-describedby="qa-error" defaultValue="team@" />
                    <span id="qa-error" className="text-danger">입력 형식을 확인하세요.</span>
                </label>
                <Select defaultValue="ready">
                    <SelectTrigger aria-label="검수 상태"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="ready">Ready</SelectItem>
                        <SelectItem value="disabled" disabled>Disabled</SelectItem>
                    </SelectContent>
                </Select>
                <Card><CardHeader><CardTitle>대표 패널 제목</CardTitle></CardHeader>
                    <CardContent>동일한 본문과 상태를 유지합니다.</CardContent></Card>
                <Dialog><DialogTrigger asChild><Button>업무 Dialog 열기</Button></DialogTrigger>
                    <DialogContent><DialogTitle>업무 Dialog</DialogTitle>
                        <DialogDescription>디자인 전환 중 입력과 열린 상태를 유지합니다.</DialogDescription>
                        {controls("Dialog")}
                        <Input aria-label="Dialog 초안" value={draft}
                            onChange={(event) => setDraft(event.target.value)} />
                        <DialogClose asChild><Button>업무 Dialog 닫기</Button></DialogClose>
                    </DialogContent>
                </Dialog>
            </section>
            <ThemeScope settings={{ design: "basic", appearance: "light", colormap: "forest" }}
                className="w-full max-w-[640px]">
                <Card><CardContent>독립 Basic Light Forest scope</CardContent></Card>
                <Dashboard><DashboardPanels aria-label="독립 Basic 배치">
                    <Card><CardContent>Basic panel A</CardContent></Card>
                    <Card><CardContent>Basic panel B</CardContent></Card>
                </DashboardPanels></Dashboard>
            </ThemeScope>
            <div className="my-5 grid gap-5">
                <section aria-label="QA Operations"><AnalyticsWorkspace /></section>
                <section aria-label="QA Review"><ReviewWorkspace /></section>
                <section aria-label="QA Intake"><IntakeWorkspace /></section>
            </div>
            <section aria-label="전체 catalog" className="grid gap-5">
                {catalog.map((item) => <section key={item.id}
                    data-qa-component={item.id} data-qa-family={item.category}
                    className="min-w-0 rounded-sm border border-border bg-surface p-4">
                    <h2 data-ui="heading" className="mb-3 text-lg">{item.name}</h2>
                    <PreviewBoundary name={item.id}>{item.preview()}</PreviewBoundary>
                </section>)}
            </section>
        </main>
    </ThemeScope>;
}

const root = createRoot(document.getElementById("root")!);
import.meta.hot?.dispose(() => root.unmount());
if (import.meta.env.DEV) root.render(<App />);
