import { useLayoutEffect, useRef, useState } from "react";
import {
    applyThemeToElement, colorTokens, getDesignMode, parseThemeUrl,
    resolveThemeSettings, writeThemeUrl,
    type Appearance, type ColorToken, type DesignModeId,
    type PaletteId, type ThemeSettings, type ThemeResolutionOptions,
} from "@pydemia/ui";
import {
    emptyColorProfiles, readColorProfiles, rememberColorProfile,
    restoreDesignProfile, writeColorProfiles, colorProfileStorageKey,
    type ColorProfileStore,
} from "./storage";

function readStorage() {
    try { return readColorProfiles(window.localStorage); }
    catch { return { store: emptyColorProfiles(), issue: "저장소에 접근할 수 없어 현재 탭에서 계속합니다." }; }
}

export function useThemeController(options: ThemeResolutionOptions = {}) {
    const initial = useRef(parseThemeUrl(new URL(window.location.href), options));
    const [settings, setSettings] = useState(initial.current.settings);
    const [notice, setNotice] = useState(initial.current.issues.join(" "));
    const [revision, setRevision] = useState(0);
    const [values, setValues] = useState<Record<string, string>>({});
    const [profiles] = useState(readStorage);
    const store = useRef<ColorProfileStore>(profiles.store);
    const current = useRef(settings);
    current.current = settings;

    useLayoutEffect(() => {
        const clean = applyThemeToElement(document.documentElement, settings, options);
        const computed = getComputedStyle(document.documentElement);
        setValues(Object.fromEntries(colorTokens.map(({ token }) => [token, computed.getPropertyValue(token).trim()])));
        return clean;
    }, [settings, options.allowUnreleased]);

    useLayoutEffect(() => {
        const handleHistory = () => {
            const result = parseThemeUrl(new URL(window.location.href), options);
            current.current = result.settings;
            setSettings(result.settings);
            setNotice(result.issues.join(" "));
            setRevision((value) => value + 1);
            normalizeUrl(result.settings);
        };
        normalizeUrl(initial.current.settings);
        if (profiles.issue) setNotice((value) => [value, profiles.issue].filter(Boolean).join(" "));
        window.addEventListener("popstate", handleHistory);
        return () => window.removeEventListener("popstate", handleHistory);
    }, [options.allowUnreleased]);

    function normalizeUrl(value: ThemeSettings) {
        const url = writeThemeUrl(new URL(window.location.href), value, options);
        if (url.href !== window.location.href) window.history.replaceState(window.history.state, "", url);
    }

    function persist(value: ThemeSettings, replaceEmpty = false) {
        store.current = rememberColorProfile(store.current, value, replaceEmpty);
        try {
            const issue = writeColorProfiles(window.localStorage, store.current);
            if (issue) setNotice(issue);
            return issue;
        } catch {
            const issue = "색상 프로필을 저장할 수 없습니다. 현재 탭에서 계속합니다.";
            setNotice(issue);
            return issue;
        }
    }

    function apply(input: unknown, announcement = "") {
        const result = resolveThemeSettings(input, options);
        const position = { x: window.scrollX, y: window.scrollY };
        current.current = result.settings;
        setSettings(result.settings);
        setRevision((value) => value + 1);
        setNotice([announcement, ...result.issues].filter(Boolean).join(" "));
        normalizeUrl(result.settings);
        requestAnimationFrame(() => window.scrollTo({ left: position.x, top: position.y, behavior: "instant" }));
        return result.settings;
    }

    function designSelection(id: DesignModeId, appearance: Appearance,
        resolutionOptions = options) {
        const definition = getDesignMode(id);
        const supported = definition.appearances.includes(appearance);
        const remembered = rememberColorProfile(store.current, current.current);
        return resolveThemeSettings({
            version: 1, design: id,
            appearance: supported ? appearance : definition.defaultAppearance,
            ...restoreDesignProfile(remembered, id),
        }, resolutionOptions);
    }

    function previewDesign(id: DesignModeId) {
        return designSelection(id, current.current.appearance,
            { allowUnreleased: true }).settings;
    }

    function commitDesign(id: DesignModeId, appearance = current.current.appearance) {
        const result = designSelection(id, appearance);
        const definition = getDesignMode(id);
        const savedIssue = persist(current.current);
        const next = apply(result.settings, [
            ...result.issues, savedIssue,
            definition.appearances.includes(appearance) ? "" :
                `${definition.name}의 지원 밝기 ${definition.defaultAppearance}를 적용했습니다.`,
        ].filter(Boolean).join(" "));
        persist(next);
    }

    function setAppearance(appearance: Appearance) {
        if (current.current.design === "dark-ui" && appearance === "light") {
            commitDesign("basic", appearance);
        } else {
            apply({ ...current.current, appearance });
        }
    }

    function setColormap(colormap: PaletteId) {
        persist(current.current);
        const next = apply({ ...current.current, colormap, overrides: { light: {}, dark: {} } });
        persist(next);
    }

    function setOverride(token: ColorToken, value: string) {
        const previous = current.current;
        const result = resolveThemeSettings({ ...previous, overrides: {
            ...previous.overrides,
            [previous.appearance]: { ...previous.overrides[previous.appearance], [token]: value },
        } }, options);
        if (result.issues.length) { setNotice(result.issues.join(" ")); return; }
        persist(apply(result.settings), true);
    }

    function resetOverrides() {
        const issue = persist(current.current);
        apply({ ...current.current, overrides: { light: {}, dark: {} } }, issue);
    }

    function restoreColorProfile() {
        const previous = current.current;
        const overrides = store.current.designs[previous.design]?.palettes[previous.colormap];
        if (!overrides) { setNotice("이 팔레트에 저장한 색상 조정이 없습니다."); return; }
        apply({ ...previous, overrides }, "저장한 색상 조정을 복원했습니다.");
    }

    function resetTheme() {
        store.current = emptyColorProfiles();
        apply(undefined);
        try { window.localStorage.removeItem(colorProfileStorageKey); }
        catch { setNotice("기기에 저장한 프로필을 삭제할 수 없습니다."); }
    }

    return {
        settings, revision, notice, values, commitDesign, previewDesign, setAppearance,
        setColormap, setOverride, resetOverrides, restoreColorProfile, resetTheme,
    };
}
