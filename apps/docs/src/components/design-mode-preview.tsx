import { useId, useState } from "react";
import {
    Badge, Button, Input, Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue, Table, TableCell, TableHead,
    ThemeScope, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, getDesignMode,
    type ThemeSettings,
} from "@pydemia/ui";
import { AnalyticsWorkspace } from "../analytics-workspace";

const previewRows = [
    { id: "DS-104", name: "Component library", owner: "Mina", status: "Ready" },
    { id: "DS-105", name: "Settings review", owner: "Alex", status: "Review" },
    { id: "DS-106", name: "Release notes", owner: "Jin", status: "Draft" },
];

export function DesignModePreview({ settings }: { settings: ThemeSettings }) {
    const id = useId();
    const [selected, setSelected] = useState("DS-104");
    const [status, setStatus] = useState("all");
    const [notice, setNotice] = useState("");
    const [workspaceExpanded, setWorkspaceExpanded] = useState(false);
    const composition = getDesignMode(settings.design).recipe !== "standard";
    const workspaceVisible = composition || workspaceExpanded;

    return (
        <ThemeScope settings={settings} options={{ allowUnreleased: true }}
            className="design-mode-preview-scene">
            <div className="design-mode-preview" data-composition={composition}>
                <header className="design-mode-preview-heading">
                    <div>
                        <p className="design-mode-eyebrow">WORKSPACE / DESIGN</p>
                        <h3>Project overview</h3>
                        <p>같은 데이터와 컴포넌트로 디자인을 비교합니다.</p>
                    </div>
                    <Badge variant="accent">Live preview</Badge>
                </header>
                <div className="design-mode-preview-actions">
                    <Button onClick={() => setNotice("미리보기 변경을 저장했습니다.")}>
                        Save changes
                    </Button>
                    <Button variant="outline" onClick={() => setNotice("미리보기 보고서를 준비했습니다.")}>
                        Export
                    </Button>
                    <Button disabled>Disabled</Button>
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" aria-label="Preview help">Help</Button>
                            </TooltipTrigger>
                            <TooltipContent>현재 후보의 Tooltip 스타일입니다.</TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
                <div className="design-mode-preview-fields">
                    <label htmlFor={`${id}-name`}>
                        Project name
                        <Input id={`${id}-name`} defaultValue="Design system" />
                    </label>
                    <label htmlFor={`${id}-email`}>
                        Email · error
                        <Input id={`${id}-email`} defaultValue="team@"
                            aria-invalid="true" aria-describedby={`${id}-error`} />
                        <span id={`${id}-error`} className="design-mode-error">
                            올바른 이메일 주소를 입력하세요.
                        </span>
                    </label>
                </div>
                <div className="design-mode-preview-table-heading">
                    <h4>Projects <Badge>{previewRows.length}</Badge></h4>
                    <Select value={status} onValueChange={setStatus}>
                        <SelectTrigger aria-label="Preview project status">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All statuses</SelectItem>
                            <SelectItem value="Ready">Ready</SelectItem>
                            <SelectItem value="Review">Review</SelectItem>
                            <SelectItem value="Draft">Draft</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="design-mode-preview-table" tabIndex={0}
                    role="region" aria-label="Preview projects table">
                    <Table>
                        <caption className="design-mode-sr-only">Sample projects</caption>
                        <thead><tr>
                            <TableHead scope="col">Select</TableHead>
                            <TableHead scope="col">Project</TableHead>
                            <TableHead scope="col">Owner</TableHead>
                            <TableHead scope="col">Status</TableHead>
                        </tr></thead>
                        <tbody>{previewRows.filter((row) =>
                            status === "all" || row.status === status,
                        ).map((row) => (
                            <tr key={row.id} data-selected={selected === row.id}>
                                <TableCell>
                                    <input type="radio" name={`${id}-selection`}
                                        aria-label={`Select ${row.name}`}
                                        checked={selected === row.id}
                                        onChange={() => setSelected(row.id)} />
                                </TableCell>
                                <TableCell>{row.name}</TableCell>
                                <TableCell>{row.owner}</TableCell>
                                <TableCell><Badge variant={row.status === "Ready" ? "accent" : "outline"}>
                                    {row.status}
                                </Badge></TableCell>
                            </tr>
                        ))}</tbody>
                    </Table>
                </div>
                <p className="design-mode-preview-note" role="status">
                    {notice || "입력·필터·선택은 이 미리보기 안에서만 변경됩니다."}
                </p>
                <section className="design-mode-workspace-preview"
                    onClickCapture={(event) => {
                        const anchor = event.target instanceof Element
                            ? event.target.closest("a") : null;
                        if (!anchor?.hash) return;
                        event.preventDefault();
                        const target = document.getElementById(anchor.hash.slice(1));
                        if (target && event.currentTarget.contains(target)) {
                            target.scrollIntoView({ block: "nearest", behavior: "instant" });
                        }
                    }}>
                    {composition ? <h4>업무 화면 미리보기</h4> :
                        <button type="button" aria-expanded={workspaceVisible}
                            aria-controls={`${id}-workspace`}
                            onClick={() => setWorkspaceExpanded((value) => !value)}>
                            조합 화면 상세 미리보기
                        </button>}
                    <div id={`${id}-workspace`} hidden={!workspaceVisible}>
                        <AnalyticsWorkspace idPrefix={`design-preview-${id}`} />
                    </div>
                </section>
            </div>
        </ThemeScope>
    );
}
