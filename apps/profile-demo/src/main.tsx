import React from "react";
import { createRoot } from "react-dom/client";
import {
    AffixedInput,
    Badge,
    Button,
    Input,
    Label,
    Snippet,
    SnippetContent,
    SnippetCopyButton,
    SnippetHeader,
    SnippetTabsList,
    SnippetTabsTrigger,
    Table,
    TableCell,
    TableHead,
} from "@pydemia/ui";
import { ArrowRight, Check, Moon, Search, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import "./app.css";

const requests = [
    { title: "초대 화면", owner: "제품팀", category: "계정", status: "검토 중" },
    { title: "검색 필터", owner: "운영팀", category: "데이터", status: "승인" },
    { title: "알림 설정", owner: "디자인팀", category: "설정", status: "검토 중" },
    { title: "사용량 요약", owner: "제품팀", category: "분석", status: "대기" },
];

const registryBase = import.meta.env.BASE_URL.replace(/examples\/profile\/$/, "");
const registryUrl = new URL(`${registryBase}r/pyd-snippet.json`, window.location.origin).href;

const commands = {
    npm: `npx shadcn@latest add ${registryUrl}`,
    api: 'import { Snippet, SnippetContent } from "@pydemia/ui";\nimport "@pydemia/ui/styles.css";',
};

function App() {
    const [dark, setDark] = useState(false);
    const [query, setQuery] = useState("");
    const [scope, setScope] = useState("registry");
    const [reviewed, setReviewed] = useState(false);
    const [activeSnippet, setActiveSnippet] = useState<keyof typeof commands>("npm");
    const results = requests.filter((request) =>
        [request.title, request.owner, request.category].some((value) =>
            value.toLowerCase().includes(query.toLowerCase().trim()),
        ),
    );

    useEffect(() => {
        document.documentElement.classList.toggle("dark", dark);
        return () => document.documentElement.classList.remove("dark");
    }, [dark]);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="border-b border-border bg-surface">
                <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
                    <div className="flex items-center gap-3">
                        <span className="flex size-8 items-center justify-center rounded-sm bg-accent text-sm font-semibold text-accent-foreground" aria-hidden="true">p</span>
                        <span className="text-sm font-semibold">pydemia / ui</span>
                        <span className="hidden border-l border-border pl-3 text-xs text-muted sm:inline">Component intake</span>
                    </div>
                    <Button variant="ghost" size="icon" aria-label={dark ? "라이트 모드" : "다크 모드"} onClick={() => setDark(!dark)}>
                        {dark ? <Sun aria-hidden size={17} /> : <Moon aria-hidden size={17} />}
                    </Button>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-5 py-8 md:py-12">
                <div className="mb-8 border-b border-border pb-6">
                    <p className="mb-2 text-xs font-medium uppercase tracking-[0.12em] text-accent">Developer tool / prototype</p>
                    <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Registry review</h1>
                    <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
                        제품 화면에 필요한 컴포넌트 요청을 검토하고 내부 registry에
                        추가하는 흐름의 예시입니다. 아래 요청과 상태는 데모 데이터입니다.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(300px,1fr)]">
                    <section aria-labelledby="inventory-heading" className="min-w-0">
                        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                            <div>
                                <h2 id="inventory-heading" className="text-lg font-semibold">요청 목록</h2>
                                <p className="mt-1 text-sm text-muted">예시 요청 4건을 표시합니다.</p>
                            </div>
                            <Badge>{results.length}개 표시</Badge>
                        </div>
                        <div className="mb-3 grid gap-2">
                            <Label htmlFor="request-search">요청 검색</Label>
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden size={16} />
                                <Input id="request-search" type="search" className="pl-9" placeholder="요청, 담당, 범주" value={query} onChange={(event) => setQuery(event.target.value)} />
                            </div>
                        </div>
                        <div className="overflow-x-auto rounded-sm border border-border bg-surface">
                            <Table>
                                <caption className="sr-only">컴포넌트 요청 목록</caption>
                                <thead><tr><TableHead scope="col">요청</TableHead><TableHead scope="col">담당</TableHead><TableHead scope="col">범주</TableHead><TableHead scope="col">상태</TableHead></tr></thead>
                                <tbody>
                                    {results.map((request) => (
                                        <tr key={request.title}>
                                            <TableCell className="font-medium">{request.title}</TableCell>
                                            <TableCell>{request.owner}</TableCell>
                                            <TableCell>{request.category}</TableCell>
                                            <TableCell><Badge>{request.status}</Badge></TableCell>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                            {results.length === 0 && <p className="p-5 text-sm text-muted" role="status">일치하는 요청이 없습니다.</p>}
                        </div>
                        <div className="mt-7">
                            <h2 className="mb-3 text-lg font-semibold">Registry 설치 코드</h2>
                            <Snippet value={activeSnippet} onValueChange={(value) => setActiveSnippet(value as keyof typeof commands)}>
                                <SnippetHeader>
                                    <SnippetTabsList aria-label="코드 종류">
                                        <SnippetTabsTrigger value="npm">Registry</SnippetTabsTrigger>
                                        <SnippetTabsTrigger value="api">Package</SnippetTabsTrigger>
                                    </SnippetTabsList>
                                    <SnippetCopyButton value={commands[activeSnippet]} />
                                </SnippetHeader>
                                <SnippetContent value="npm">{commands.npm}</SnippetContent>
                                <SnippetContent value="api">{commands.api}</SnippetContent>
                            </Snippet>
                            <p className="mt-2 text-xs leading-5 text-muted">게시된 registry 항목의 설치 명령 예시입니다. 컴포넌트는 자동 설치되지 않으며 token stylesheet를 별도로 연결해야 합니다.</p>
                        </div>
                    </section>

                    <section aria-labelledby="profile-heading" className="min-w-0 space-y-5">
                        <div>
                            <h2 id="profile-heading" className="text-lg font-semibold">Normalization preview</h2>
                            <p className="mt-1 text-sm text-muted">Neutral Product / compact density</p>
                        </div>
                        <div className="space-y-5 rounded-sm border border-border bg-surface p-5 shadow-[var(--shadow-float)]">
                            <div className="flex items-start justify-between gap-3 border-b border-border pb-4">
                                <div>
                                    <h3 className="font-semibold">새 registry 항목</h3>
                                    <p className="mt-1 text-xs leading-5 text-muted">고정 접두어가 있는 입력과 복사 가능한 코드 블록을 함께 사용합니다.</p>
                                </div>
                                <Badge>Draft</Badge>
                            </div>
                            <AffixedInput
                                label="Registry 경로 (@pydemia/ 이후 이름)"
                                prefix="@pydemia/"
                                suffix=".json"
                                value={scope}
                                onChange={(event) => { setScope(event.target.value); setReviewed(false); }}
                                aria-describedby="scope-hint"
                            />
                            <p id="scope-hint" className="-mt-3 text-xs text-muted">입력값은 배포나 저장에 사용되지 않습니다.</p>
                            <div className="border-t border-border pt-4">
                                <p className="text-xs font-medium text-muted">Preview path</p>
                                <p className="mt-1 break-all font-mono text-sm">@pydemia/{scope || "…"}.json</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button disabled={!scope.trim()} onClick={() => setReviewed(true)}>
                                    <Check aria-hidden size={16} /> 검토 완료 표시
                                </Button>
                                <Button variant="outline" onClick={() => { setScope("registry"); setReviewed(false); }}>초기화</Button>
                            </div>
                            <p role="status" aria-live="polite" className="min-h-5 text-xs text-muted">
                                {reviewed ? `데모 상태: @pydemia/${scope}.json 검토 완료` : "검토 대기 중"}
                            </p>
                        </div>
                        <div className="rounded-sm border border-border bg-surface-subtle p-4 text-sm leading-6">
                            <p className="font-medium">다음 확장 기준</p>
                            <p className="mt-1 text-muted">실제 제품 요구와 component별 라이선스·의존성·접근성 검토를 마친 항목만 registry에 추가합니다.</p>
                            <ArrowRight className="mt-3 text-accent" aria-hidden size={16} />
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

createRoot(document.getElementById("root")!).render(
    <React.StrictMode><App /></React.StrictMode>,
);
