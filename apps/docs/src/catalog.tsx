import {
    AffixedInput, Badge, Button, Input, Label, Snippet, SnippetContent,
    SnippetCopyButton, SnippetHeader, SnippetTabsList, SnippetTabsTrigger,
    Table, TableCell, TableHead, Tabs, TabsContent, TabsList, TabsTrigger,
} from "@pydemia/ui";
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
        id: "tabs", name: "Tabs", category: "Navigation",
        description: "Radix Tabs를 기반으로 탭 전환, 키보드 이동, 선택 상태를 제공합니다.",
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
  <caption className="sr-only">컴포넌트 목록</caption>
  <thead><tr><TableHead scope="col">이름</TableHead></tr></thead>
  <tbody><tr><TableCell>Button</TableCell></tr></tbody>
</Table>`,
        preview: () => <div className="preview-table"><Table><caption className="sr-only">컴포넌트 목록</caption><thead><tr><TableHead scope="col">이름</TableHead><TableHead scope="col">출처</TableHead><TableHead scope="col">상태</TableHead></tr></thead><tbody><tr><TableCell>Button</TableCell><TableCell>shadcn/ui</TableCell><TableCell>Foundation</TableCell></tr><tr><TableCell>Snippet</TableCell><TableCell>Kibo UI</TableCell><TableCell>Normalized</TableCell></tr></tbody></Table></div>,
    },
    {
        id: "affixed-input", name: "AffixedInput", category: "Inputs",
        description: "Origin UI 패턴을 조정했습니다. prefix와 suffix는 입력값에 포함되지 않습니다.",
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
        description: "Kibo UI 패턴을 토큰에 맞춰 정리한 탭형 코드 블록과 복사 버튼입니다.",
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
];
