import { useLayoutEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Button } from "./components/ui/button";
import { ButtonGroup } from "./components/ui/button-group";
import { PinInput } from "./components/ui/pin-input";
import { ColorInput } from "./components/ui/color-input";
import { Checkbox } from "./components/ui/checkbox";
import { Markdown } from "./components/ui/markdown";
import {
    Menubar, MenubarMenu, MenubarTrigger, MenubarContent,
    MenubarItem, MenubarCheckboxItem,
} from "./components/ui/menubar";
import {
    DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
    DropdownMenuCheckboxItem, DropdownMenuItem,
} from "./components/ui/dropdown-menu";
import {
    ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem,
} from "./components/ui/context-menu";
import { Lightbox } from "./components/ui/lightbox";
import { DiffViewer } from "./components/ui/diff-viewer";
import { CalendarScheduler } from "./components/ui/calendar-scheduler";
import {
    Drawer, DrawerTrigger, DrawerContent, DrawerTitle, DrawerDescription,
    DrawerClose,
} from "./components/ui/drawer";
import { Input } from "./components/ui/input";
import { Badge } from "./components/ui/badge";
import { Field } from "./components/ui/field";
import { InputGroup, InputGroupInput, InputGroupAddon, InputGroupText } from "./components/ui/input-group";
import { TagsInput } from "./components/ui/tags-input";
import { CodeEditorShell } from "./components/ui/code-editor-shell";
import { PromptInput } from "./components/ui/prompt-input";
import { Tree } from "./components/ui/tree";
import { TreeNav } from "./components/ui/tree-nav";
import {
    NavigationMenu, NavigationMenuList, NavigationMenuItem,
    NavigationMenuLink, NavigationMenuTrigger, NavigationMenuContent,
} from "./components/ui/navigation-menu";
import { BlockEditor, type BlockEditorBlock } from "./components/ui/block-editor";
import { Carousel } from "./components/ui/carousel";
import { NodeCanvas } from "./components/ui/node-canvas";
import { DataTable } from "./components/ui/data-table";
import { SideNav, SideNavLink } from "./components/ui/navigation";
import { Gantt } from "./components/ui/gantt";
import { Calendar } from "./components/ui/calendar";
import { Message, MessageContent } from "./components/ui/message";
import { BulletChart } from "./components/ui/bullet-chart";
import { LogConsole } from "./components/ui/log-console";
import {
    Accordion, AccordionItem, AccordionTrigger, AccordionContent,
} from "./components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import { Table, TableCell, TableHead } from "./components/ui/table";
import {
    Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle,
    DialogTrigger,
} from "./components/ui/dialog";
import {
    designModes, getDesignMode, releasedDesignModes, type DesignModeId,
} from "./components/ui/foundation/design-modes";
import {
    resolveThemeSettings, resolveThemeTokens, parseThemeUrl, writeThemeUrl,
} from "./components/ui/foundation/design-mode-settings";
import { applyThemeToElement } from "./components/ui/foundation/theme-dom";
import { ThemeScope } from "./components/ui/foundation/theme-scope";
import { PortalScope } from "./components/ui/foundation/portal-scope";
import "./style.css";

// Private QA can inspect ready modes; ordinary consumers remain release gated.
const allowUnreleased = new URL(location.href).searchParams.has("qa");
const options = { allowUnreleased };

function App() {
    const [design, setDesign] = useState<DesignModeId>("basic");
    const [draft, setDraft] = useState("Preserve this input while switching");
    const [open, setOpen] = useState(false);
    const [menuChecked, setMenuChecked] = useState(true);
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [galleryVariant, setGalleryVariant] = useState<"frame" | "immersive">("frame");
    const [blocks, setBlocks] = useState<BlockEditorBlock[]>([
        { id: "heading", kind: "heading", text: "Installed editor draft" },
        { id: "body", kind: "paragraph", text: "Keep this text when switching modes." },
    ]);
    const [editorDisabled, setEditorDisabled] = useState(false);
    const modes = allowUnreleased ? designModes : releasedDesignModes;
    const resolved = resolveThemeSettings({
        design, appearance: "light", colormap: "forest",
    }, options);
    const settings = resolved.settings;
    const definition = getDesignMode(settings.design);
    const tokens = resolveThemeTokens(settings, options);
    const shared = writeThemeUrl(new URL(location.href), settings, options);
    const roundTrip = parseThemeUrl(shared, options);
    useLayoutEffect(() => applyThemeToElement(document.documentElement, {
        design, appearance: "dark", colormap: "design",
    }, options), [design]);

    return (
        <main className="mx-auto grid min-w-0 max-w-4xl grid-cols-1 gap-6 p-6">
            <h1 className="text-2xl font-semibold">Independent registry consumer</h1>
            <p>Dark root / regional Light scope. Ready modes require private ?qa.</p>
            <label className="grid gap-2">
                Design mode
                <select aria-label="Design mode" value={design}
                    className="border border-border bg-surface p-2"
                    onChange={(event) => setDesign(event.target.value as DesignModeId)}>
                    {modes.map((mode) => <option key={mode.id} value={mode.id}>
                        {mode.name} ({mode.releaseStatus})
                    </option>)}
                </select>
            </label>
            <ThemeScope settings={settings} options={options}
                className="grid min-w-0 grid-cols-1 gap-4 border border-border bg-background p-6">
                <h2 className="text-lg font-semibold">{definition.name} scope</h2>
                <Badge>Installed source</Badge>
                <ButtonGroup label="Installed vertical actions" orientation="vertical">
                    <Button variant="outline">Preview</Button>
                    <Button variant="outline">Export</Button>
                </ButtonGroup>
                <PinInput label="Installed PIN" defaultValue="123456" />
                <ColorInput label="Installed color" defaultValue="#3b6d91" />
                <Checkbox aria-label="Installed checkbox" defaultChecked />
                <Markdown source="Installed `registry` content" />
                <DiffViewer label="Installed split comparison" view="split"
                    before={`Synthetic before ${"x".repeat(100)}`}
                    after={`Synthetic after ${"y".repeat(100)}`} />
                <CalendarScheduler label="Installed calendar schedule"
                    initialDate="2026-10-07" timeZone="Asia/Seoul"
                    events={[{ id: "sample", date: "2026-10-07",
                        title: "Synthetic schedule" }]} />
                <Menubar aria-label="Installed menubar">
                    <MenubarMenu><MenubarTrigger>Installed View</MenubarTrigger>
                        <MenubarContent>
                            <MenubarCheckboxItem checked={menuChecked}
                                onCheckedChange={setMenuChecked}>Installed grid</MenubarCheckboxItem>
                            <MenubarItem disabled>Installed unavailable</MenubarItem>
                            <MenubarItem variant="danger">Installed remove</MenubarItem>
                        </MenubarContent>
                    </MenubarMenu>
                </Menubar>
                <DropdownMenu><DropdownMenuTrigger asChild>
                    <Button>Installed dropdown</Button>
                </DropdownMenuTrigger><DropdownMenuContent>
                    <DropdownMenuCheckboxItem checked={menuChecked}
                        onCheckedChange={setMenuChecked}>Installed grid</DropdownMenuCheckboxItem>
                    <DropdownMenuItem disabled>Installed unavailable</DropdownMenuItem>
                    <DropdownMenuItem variant="danger">Installed remove</DropdownMenuItem>
                </DropdownMenuContent></DropdownMenu>
                <ContextMenu><ContextMenuTrigger asChild>
                    <Button>Installed context menu</Button>
                </ContextMenuTrigger><ContextMenuContent>
                    <ContextMenuItem>Installed context action</ContextMenuItem>
                    <ContextMenuItem variant="danger">Installed remove</ContextMenuItem>
                </ContextMenuContent></ContextMenu>
                {(["frame", "immersive"] as const).map((variant) => <Button
                    key={variant} onClick={() => {
                        setGalleryVariant(variant);
                        setGalleryOpen(true);
                    }}>Open {variant} gallery</Button>)}
                <Lightbox title="Installed gallery" variant={galleryVariant}
                    open={galleryOpen} onOpenChange={setGalleryOpen}
                    activeId="sample" onActiveIdChange={() => undefined}
                    items={[{ id: "sample", alt: "Synthetic geometry sample",
                        src: "data:image/svg+xml," + encodeURIComponent(
                            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 180"><rect width="320" height="180" fill="#dce9f6"/><circle cx="160" cy="90" r="48" fill="#2875ad"/></svg>',
                        ) }]} />
                {(["left", "right", "bottom"] as const).map((side) => (
                    <Drawer key={side}>
                        <DrawerTrigger asChild>
                            <Button>Open {side} drawer</Button>
                        </DrawerTrigger>
                        <DrawerContent side={side}>
                            <DrawerTitle>Installed {side} drawer</DrawerTitle>
                            <DrawerDescription>Exposed corners follow the regional theme.</DrawerDescription>
                            <label>Drawer design mode
                                <select aria-label="Drawer design mode" value={design}
                                    onChange={(event) => setDesign(event.target.value as DesignModeId)}>
                                    {modes.map((mode) => <option key={mode.id} value={mode.id}>
                                        {mode.name}
                                    </option>)}
                                </select>
                            </label>
                            <Input aria-label="Drawer draft" value={draft}
                                onChange={(event) => setDraft(event.target.value)} />
                            <DrawerClose asChild><Button>Close drawer</Button></DrawerClose>
                        </DrawerContent>
                    </Drawer>
                ))}
                <Input aria-label="Preserved draft" value={draft}
                    onChange={(event) => setDraft(event.target.value)} />
                <Field label="Installed compound draft" description="One field frame around an editable value.">
                    {(control) => <InputGroup>
                        <InputGroupAddon><InputGroupText>REQ</InputGroupText></InputGroupAddon>
                        <InputGroupInput {...control} value={draft}
                            onChange={(event) => setDraft(event.target.value)} />
                    </InputGroup>}
                </Field>
                <TagsInput label="Installed tags" defaultValue={["review"]} />
                <CodeEditorShell label="Installed code draft" value={draft}
                    onValueChange={setDraft} rows={4} />
                <PromptInput label="Installed prompt" onSend={setDraft} />
                <Tree label="Installed project tree" defaultExpandedIds={["project"]}
                    items={[{ id: "project", label: "Project", children: [
                        { id: "readme", label: "Readme" },
                        { id: "schedule", label: "Schedule" },
                    ] }]} />
                <SideNav aria-label="Installed navigation">
                    <SideNavLink href="#overview" aria-current="page">Overview</SideNavLink>
                    <SideNavLink href="#details">Details</SideNavLink>
                </SideNav>
                <TreeNav label="Installed page tree" currentId="builds"
                    defaultExpandedIds={["project", "atlas"]}
                    items={[{ id: "project", label: "Project", children: [
                        { id: "atlas", label: "Atlas", href: "#atlas", children: [
                            { id: "builds", label: "Build history", href: "#builds" },
                        ] },
                    ] }]} />
                <NavigationMenu aria-label="Installed product menu">
                    <NavigationMenuList>
                        <NavigationMenuItem>
                            <NavigationMenuLink href="#overview" variant="trigger" active>Overview</NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <NavigationMenuLink href="#details" variant="content">Details</NavigationMenuLink>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
                <Button variant="ghost" aria-pressed={editorDisabled}
                    onClick={() => setEditorDisabled(!editorDisabled)}>
                    Toggle installed editor disabled
                </Button>
                <BlockEditor label="Installed block editor" blocks={blocks}
                    disabled={editorDisabled}
                    onBlocksChange={setBlocks} />
                <Carousel label="Installed carousel" slides={[
                    { id: "first", label: "First", content: <p>First slide</p> },
                    { id: "second", label: "Second", content: <p>Second slide</p> },
                ]} />
                <NodeCanvas label="Installed node canvas" width={400} height={240}
                    nodes={[{ id: "source", title: "Source", x: 16, y: 16 }]}
                    edges={[]} />
                <DataTable caption="Installed expandable table"
                    rows={[{ id: "first", title: "First row" }]}
                    getRowId={(row) => row.id} getRowLabel={(row) => row.title}
                    columns={[{ id: "title", header: "Title",
                        cell: (row) => row.title, sortValue: (row) => row.title }]}
                    renderRowDetails={(row) => <p>{row.title} details</p>} />
                <Gantt label="Installed schedule" rangeStart="2026-10-01"
                    rangeEnd="2026-10-10" tasks={[
                        { id: "plan", title: "Plan", startDate: "2026-10-02",
                            endDate: "2026-10-05", progress: 60 },
                    ]} />
                <Calendar mode="single" defaultMonth={new Date(2026, 9, 1)} />
                <Message from="user"><MessageContent>Installed user message</MessageContent></Message>
                <Message from="assistant"><MessageContent>Installed assistant message</MessageContent></Message>
                <BulletChart title="Installed delivery" value={64} target={80} max={100} />
                <LogConsole label="Installed panel log" entries={[
                    { id: "error", level: "error", message: "Meaningful error color" },
                ]} />
                <LogConsole label="Installed flat log" variant="flat" entries={[
                    { id: "info", level: "info", message: "Transparent embedded output" },
                ]} />
                <Accordion type="single" collapsible defaultValue="details">
                    <AccordionItem value="details">
                        <AccordionTrigger>Installed disclosure</AccordionTrigger>
                        <AccordionContent>Persistent disclosure content</AccordionContent>
                    </AccordionItem>
                </Accordion>
                <Tabs defaultValue="overview">
                    <TabsList variant="contained" aria-label="Installed tabs">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="details">Details</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">Overview content</TabsContent>
                    <TabsContent value="details">Details content</TabsContent>
                </Tabs>
                <Table>
                    <thead><tr><TableHead>Mode</TableHead>
                        <TableHead>Appearance</TableHead></tr></thead>
                    <tbody><tr><TableCell>{settings.design}</TableCell>
                        <TableCell>{settings.appearance}</TableCell>
                    </tr></tbody>
                </Table>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild><Button>Open scoped Dialog</Button></DialogTrigger>
                    <DialogContent>
                        <DialogTitle>Stable scoped portal</DialogTitle>
                        <DialogDescription>Change the theme without replacing the host.</DialogDescription>
                        <label className="my-4 grid gap-2">Design while open
                            <select aria-label="Dialog design mode" value={design}
                                className="border border-border bg-surface p-2"
                                onChange={(event) => setDesign(event.target.value as DesignModeId)}>
                                {modes.map((mode) => <option key={mode.id} value={mode.id}>
                                    {mode.name}
                                </option>)}
                            </select>
                        </label>
                        <Input aria-label="Dialog draft" value={draft}
                            onChange={(event) => setDraft(event.target.value)} />
                        <InputGroup>
                            <InputGroupInput aria-label="Dialog compound draft" value={draft}
                                onChange={(event) => setDraft(event.target.value)} />
                            <InputGroupAddon><InputGroupText>REQ</InputGroupText></InputGroupAddon>
                        </InputGroup>
                        <DialogClose asChild><Button className="mt-4">Close</Button></DialogClose>
                    </DialogContent>
                </Dialog>
                <output aria-label="Resolved theme" className="[overflow-wrap:anywhere]">{JSON.stringify({
                    design: roundTrip.settings.design,
                    appearance: settings.appearance, radius: tokens["--radius"],
                    releaseStatus: definition.releaseStatus, issues: resolved.issues,
                })}</output>
            </ThemeScope>
            <PortalScope><p>PortalScope is separately installable.</p></PortalScope>
        </main>
    );
}

createRoot(document.getElementById("root")!).render(<App />);
