import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import {
    Button, Input, Popover, PopoverContent, PopoverTrigger,
    designModes, getDesignMode, resolveThemeSettings, resolveThemeTokens,
    colormaps, type DesignModeId, type ThemeSettings,
} from "@pydemia/ui";
import { DesignModePreview } from "./design-mode-preview";
import "./design-mode-picker.css";

export interface DesignModePickerProps {
    settings: ThemeSettings;
    onCommit: (id: DesignModeId) => void;
    getCandidateSettings?: (id: DesignModeId) => ThemeSettings;
    allowUnreleased?: boolean;
}

export function DesignModePicker({
    settings, onCommit, getCandidateSettings, allowUnreleased = false,
}: DesignModePickerProps) {
    const id = useId();
    const trigger = useRef<HTMLButtonElement>(null);
    const search = useRef<HTMLInputElement>(null);
    const options = useRef(new Map<DesignModeId, HTMLButtonElement>());
    const pointerType = useRef("");
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [candidateId, setCandidateId] = useState(settings.design);
    const [explicitApply, setExplicitApply] = useState(false);
    useEffect(() => {
        const media = window.matchMedia("(max-width: 850px), (pointer: coarse)");
        const update = () => setExplicitApply(media.matches);
        update();
        media.addEventListener("change", update);
        return () => media.removeEventListener("change", update);
    }, []);

    const applied = getDesignMode(settings.design);
    const candidate = getDesignMode(candidateId);
    const filtered = designModes.filter((mode) =>
        `${mode.name} ${mode.group} ${mode.description}`
            .toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
    );
    const groups = [false, true].flatMap((prepared) => {
        const modes = filtered.filter((mode) =>
            (!allowUnreleased && mode.releaseStatus !== "released") === prepared,
        );
        return [...new Set(modes.map((mode) => mode.group))].map((group) => ({
            key: `${prepared ? "prepared" : "available"}-${group}`,
            title: prepared ? `준비 중 · ${group}` : group,
            prepared,
            modes: modes.filter((mode) => mode.group === group),
        }));
    });
    const ordered = groups.flatMap((group) => group.modes);
    const canApply = allowUnreleased || candidate.releaseStatus === "released";
    const defaultAppearance = candidate.appearances.some((value) =>
        value === settings.appearance,
    ) ? settings.appearance : candidate.defaultAppearance;
    const previewSettings = getCandidateSettings?.(candidateId) ?? resolveThemeSettings({
        ...settings, design: candidateId, appearance: defaultAppearance,
        colormap: candidateId === settings.design ? settings.colormap : "design",
        overrides: candidateId === settings.design ? settings.overrides : { light: {}, dark: {} },
    }, { allowUnreleased: true }).settings;
    const appearance = previewSettings.appearance;

    function changeOpen(next: boolean) {
        if (next) {
            setCandidateId(settings.design);
            setQuery("");
        }
        setOpen(next);
    }

    function commit(modeId: DesignModeId) {
        if (!allowUnreleased && getDesignMode(modeId).releaseStatus !== "released") return;
        onCommit(modeId);
        setOpen(false);
    }

    function navigate(event: KeyboardEvent, fromSearch = false) {
        if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
        if (fromSearch && (event.key === "Home" || event.key === "End")) return;
        if (!ordered.length) return;
        event.preventDefault();
        const index = ordered.findIndex((mode) => mode.id === candidateId);
        let next = index;
        if (event.key === "Home") next = 0;
        else if (event.key === "End") next = ordered.length - 1;
        else if (fromSearch) next = index < 0 ? 0 : index;
        else next = (index + (event.key === "ArrowDown" ? 1 : -1) + ordered.length) % ordered.length;
        const mode = ordered[next];
        setCandidateId(mode.id);
        options.current.get(mode.id)?.focus();
    }

    return <Popover open={open} onOpenChange={changeOpen} modal={false}>
        <PopoverTrigger asChild>
            <Button ref={trigger} variant="outline" className="design-mode-trigger"
                aria-label={`Design mode: ${applied.name}`}>
                <span>Design mode</span><strong>{applied.name}</strong>
                <ChevronDown aria-hidden="true" size={14} />
            </Button>
        </PopoverTrigger>
        <PopoverContent align="end" collisionPadding={8}
            className="design-mode-picker" aria-labelledby={`${id}-title`}
            onOpenAutoFocus={(event) => { event.preventDefault(); search.current?.focus(); }}
            onCloseAutoFocus={(event) => { event.preventDefault(); trigger.current?.focus(); }}>
            <header className="design-mode-picker-heading">
                <div><h2 id={`${id}-title`}>Design mode</h2>
                    <p>현재 적용: <strong>{applied.name}</strong></p></div>
                <Button variant="ghost" size="icon" aria-label="Close design mode picker"
                    onClick={() => setOpen(false)}><X size={18} aria-hidden="true" /></Button>
            </header>
            <div className="design-mode-picker-body">
                <div className="design-mode-list-pane">
                    <Input ref={search} aria-label="Search design modes"
                        placeholder="이름 또는 그룹 검색" value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        onKeyDown={(event) => navigate(event, true)} />
                    <div className="design-mode-list" aria-label="Design modes">
                        {!filtered.length && <p className="design-mode-empty" role="status">검색 결과가 없습니다.</p>}
                        {groups.map((group) => <section key={group.key} aria-label={group.title}
                            data-prepared={group.prepared || undefined}>
                            <h3>{group.title}</h3>
                            <ul>{group.modes.map((mode) => {
                                const selectable = allowUnreleased || mode.releaseStatus === "released";
                                const tokens = resolveThemeTokens({
                                    ...settings, design: mode.id,
                                    appearance: mode.appearances.some((value) => value === settings.appearance)
                                        ? settings.appearance : mode.defaultAppearance,
                                    colormap: "design", overrides: { light: {}, dark: {} },
                                }, { allowUnreleased: true });
                                return <li key={mode.id}>
                                    <button type="button" className="design-mode-option"
                                        ref={(element) => { if (element) options.current.set(mode.id, element); else options.current.delete(mode.id); }}
                                        tabIndex={mode.id === (filtered.some((item) => item.id === candidateId) ? candidateId : filtered[0]?.id) ? 0 : -1}
                                        aria-current={settings.design === mode.id ? "true" : undefined}
                                        aria-disabled={!selectable}
                                        aria-label={`${mode.name}${!selectable ? " · Preview only" : ""}`}
                                        data-candidate={candidateId === mode.id}
                                        onFocus={() => setCandidateId(mode.id)}
                                        onPointerEnter={(event) => { if (event.pointerType === "mouse") setCandidateId(mode.id); }}
                                        onPointerDown={(event) => { pointerType.current = event.pointerType; }}
                                        onKeyDown={(event) => { pointerType.current = ""; navigate(event); }}
                                        onClick={() => {
                                            setCandidateId(mode.id);
                                            if (!explicitApply && pointerType.current !== "touch") commit(mode.id);
                                            pointerType.current = "";
                                        }}>
                                        <span className="design-mode-swatch" aria-hidden="true"
                                            style={{ background: tokens["--background"], color: tokens["--foreground"], borderColor: tokens["--border"] }}>
                                            <span style={{ background: tokens["--accent"] }} />Aa
                                        </span>
                                        <span className="design-mode-option-copy"><strong>{mode.name}</strong>
                                            <small>{selectable ? mode.appearances.join(" / ") : "Preview only"}</small></span>
                                        {settings.design === mode.id && <Check size={15} aria-label="Applied" />}
                                    </button>
                                </li>;
                            })}</ul>
                        </section>)}
                    </div>
                </div>
                <section className="design-mode-detail" aria-labelledby={`${id}-candidate`}>
                    <div className="design-mode-detail-heading">
                        <p className="design-mode-eyebrow">CANDIDATE PREVIEW</p>
                        <h3 id={`${id}-candidate`}>{candidate.name}</h3>
                        <p>{candidate.description}</p>
                        <p>지원 밝기: {candidate.appearances.join(" / ")} · 미리보기: {appearance}</p>
                        <p>팔레트: {previewSettings.colormap === "design" ? "Design default" :
                            colormaps.find(({ id }) => id === previewSettings.colormap)?.name}
                            {Object.values(previewSettings.overrides).some((colors) => Object.keys(colors).length) && " · 직접 조정 반영"}</p>
                        {appearance !== settings.appearance && <p>이 디자인의 기본 밝기 {appearance}로 전환됩니다.</p>}
                        {!canApply && <p>검수 중인 디자인입니다. 미리보기만 사용할 수 있습니다.</p>}
                        {candidate.recipe !== "standard" && <p>조합 화면을 펼치면 격자와 패널 배치도 확인할 수 있습니다.</p>}
                    </div>
                    <DesignModePreview settings={previewSettings} />
                </section>
            </div>
            <footer className="design-mode-picker-footer">
                <p role="status" aria-live="polite" aria-atomic="true">
                    후보: {candidate.name} · 현재 적용: {applied.name}
                </p>
                <Button disabled={!canApply} onClick={() => commit(candidateId)}>
                    {candidate.name} 적용
                </Button>
            </footer>
        </PopoverContent>
    </Popover>;
}
