import { useState } from "react";
import {
    Button, ButtonGroup, Combobox, DataChart, FileUpload, Lightbox,
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
    Popover, PopoverContent, PopoverTrigger, HoverCard, HoverCardContent, HoverCardTrigger,
    ModelSelector, NavigationMenu, NavigationMenuContent, NavigationMenuItem,
    Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem,
    NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger, NodeCanvas,
    RadioGroup, RadioGroupItem, Select, SelectContent, SelectItem, SelectTrigger,
    SelectValue, Sidebar, Tabs, TabsContent, TabsList, TabsTrigger, TagsInput,
    Terminal, Toast, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@pydemia/ui";

const identifier = "deployment_release_candidate_production_2026_10_16_".repeat(2);
const image = "data:image/svg+xml," + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180"><rect width="320" height="180" fill="#dce9f6"/></svg>',
);

function AlignmentStress() {
    const [gallery, setGallery] = useState(false);
    const [notice, setNotice] = useState(true);
    return <section aria-label="긴 내용과 정렬 검수" className="my-6 grid min-w-0 grid-cols-1 gap-6">
        <h2>Long content and open-state boundaries</h2>
        <p>개발 전용 · 파일명·식별자·여러 줄 제목과 열린 표면의 실제 경계 검수</p>
        <div data-qa-stress="select"><Select defaultValue="long">
            <SelectTrigger aria-label="긴 선택값"><SelectValue /></SelectTrigger>
            <SelectContent><SelectItem value="long">{identifier}</SelectItem>
                <SelectItem value="short">Short option</SelectItem></SelectContent>
        </Select></div>
        <div data-qa-stress="combobox"><Combobox aria-label="긴 검색 선택값"
            options={[{ value: "long", label: identifier }, { value: "short", label: "Short option" }]}
            defaultValue="long" /></div>
        <div data-qa-stress="tags-input"><TagsInput label="긴 태그" defaultValue={[identifier]} /></div>
        <div data-qa-stress="tabs"><Tabs defaultValue="first">
            <TabsList variant="contained" aria-label="긴 탭 목록">
                <TabsTrigger value="first">Deployment configuration</TabsTrigger>
                <TabsTrigger value="second">Execution history</TabsTrigger>
                <TabsTrigger value="third">Access permissions</TabsTrigger>
            </TabsList><TabsContent value="first">Deployment settings</TabsContent>
            <TabsContent value="second">Execution records</TabsContent>
            <TabsContent value="third">Access settings</TabsContent>
        </Tabs></div>
        <div data-qa-stress="button-group"><ButtonGroup label="긴 버튼 그룹">
            <Button variant="outline">Preview deployment</Button>
            <Button variant="outline">Export configuration</Button>
            <Button variant="outline">Review permissions</Button>
        </ButtonGroup></div>
        <div data-qa-stress="radio-group"><RadioGroup defaultValue="long" aria-label="긴 선택 카드">
            <RadioGroupItem value="long" variant="card" label={identifier} description={identifier} />
        </RadioGroup></div>
        <div data-qa-stress="sidebar"><Sidebar label="긴 사이드바" items={[
            { id: "long", label: identifier, href: "#long", current: true },
        ]} /></div>
        <div data-qa-stress="navigation-menu"><NavigationMenu aria-label="경계 메뉴">
            <NavigationMenuList><NavigationMenuItem><NavigationMenuLink variant="trigger" href="#home">Overview</NavigationMenuLink></NavigationMenuItem>
                <NavigationMenuItem><NavigationMenuTrigger>Boundary products</NavigationMenuTrigger>
                    <NavigationMenuContent><NavigationMenuLink href="#long">{identifier}</NavigationMenuLink></NavigationMenuContent>
                </NavigationMenuItem></NavigationMenuList>
        </NavigationMenu></div>
        <div data-qa-stress="node-canvas"><NodeCanvas label="긴 노드 제목" width={400} height={240}
            nodes={[{ id: "node", title: identifier, description: "Production release validation and approval", x: 16, y: 16 }]} edges={[]} /></div>
        <div data-qa-stress="terminal"><Terminal label={identifier} pending lines={[]} onCommand={() => undefined} /></div>
        <div data-qa-stress="toast"><Toast open={notice} onOpenChange={setNotice} title={identifier} description={identifier} /></div>
        <div data-qa-stress="file-upload"><FileUpload label="긴 파일 오류" onFilesSelected={() => undefined} items={[
            { id: "file", name: "release.json", status: "failed", error: identifier },
        ]} /></div>
        <div data-qa-stress="model-selector"><ModelSelector label="긴 모델 정보" name="stress-model"
            defaultValue="long" models={[{ id: "long", label: identifier, provider: identifier, description: identifier }]} /></div>
        <div data-qa-stress="data-chart"><DataChart title={identifier} unit="requests" inspectable
            categories={["North-America-Enterprise", "Central-Europe-Enterprise", "Asia-Pacific-Enterprise"]}
            series={[{ id: "requests", label: identifier, values: [10, 14, 12] }]} /></div>
        <div data-qa-stress="tooltip"><TooltipProvider delayDuration={0}><Tooltip>
            <TooltipTrigger asChild><Button variant="outline">긴 툴팁 확인</Button></TooltipTrigger>
            <TooltipContent>{identifier}</TooltipContent>
        </Tooltip></TooltipProvider></div>
        <div data-qa-stress="dropdown-menu"><DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="outline">긴 메뉴 확인</Button></DropdownMenuTrigger>
            <DropdownMenuContent><DropdownMenuItem>{identifier}</DropdownMenuItem></DropdownMenuContent>
        </DropdownMenu><Menubar aria-label="긴 명령 메뉴"><MenubarMenu>
            <MenubarTrigger>긴 명령 열기</MenubarTrigger>
            <MenubarContent><MenubarItem>{identifier}</MenubarItem></MenubarContent>
        </MenubarMenu></Menubar></div>
        <div data-qa-stress="popover"><Popover>
            <PopoverTrigger asChild><Button variant="outline">긴 팝오버 열기</Button></PopoverTrigger>
            <PopoverContent aria-label="긴 내용 팝오버">{Array.from({ length: 16 }, (_, index) =>
                <p key={index}>변경 요청과 검토 기록을 확인합니다. 긴 내용도 화면 안에서 스크롤할 수 있어야 합니다.</p>,
            )}</PopoverContent>
        </Popover></div>
        <div data-qa-stress="hover-card"><HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger asChild><a href="#profile">긴 프로필 보기</a></HoverCardTrigger>
            <HoverCardContent>{Array.from({ length: 16 }, (_, index) =>
                <p key={index}>담당자의 프로필과 검토 이력을 확인합니다. 긴 내용도 화면 안에서 스크롤할 수 있어야 합니다.</p>,
            )}</HoverCardContent>
        </HoverCard></div>
        <div data-qa-stress="lightbox"><Button onClick={() => setGallery(true)}>긴 제목 갤러리 열기</Button>
            <Lightbox title={identifier} open={gallery} onOpenChange={setGallery}
                activeId="image" onActiveIdChange={() => undefined}
                items={[{ id: "image", src: image, alt: "Boundary sample", caption: identifier }]} />
        </div>
    </section>;
}

export { AlignmentStress };
