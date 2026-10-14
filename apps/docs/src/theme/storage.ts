import {
    designModes, resolveThemeSettings,
    type ColorOverrides, type DesignModeId, type PaletteId, type ThemeSettings,
} from "@pydemia/ui";

export const colorProfileStorageKey = "pydemia.ui.color-profiles.v1";
type DesignProfiles = {
    colormap: PaletteId;
    palettes: Partial<Record<PaletteId, ColorOverrides>>;
};
export type ColorProfileStore = {
    version: 1;
    designs: Partial<Record<DesignModeId, DesignProfiles>>;
};
type StorageAccess = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export const emptyColorProfiles = (): ColorProfileStore => ({ version: 1, designs: {} });

export function readColorProfiles(storage: StorageAccess): {
    store: ColorProfileStore; issue?: string;
} {
    try {
        const raw = storage.getItem(colorProfileStorageKey);
        if (!raw) return { store: emptyColorProfiles() };
        const input = JSON.parse(raw);
        if (!input || input.version !== 1 || !input.designs ||
            typeof input.designs !== "object" || Array.isArray(input.designs)) {
            throw new Error("Unsupported profiles.");
        }
        const store = emptyColorProfiles();
        for (const { id } of designModes) {
            const profile = input.designs[id];
            if (!profile || typeof profile !== "object") continue;
            const checked = resolveThemeSettings({ design: id, colormap: profile.colormap },
                { allowUnreleased: true });
            if (checked.issues.length) continue;
            const palettes: DesignProfiles["palettes"] = {};
            for (const colormap of ["design", "neutral", "pydemia", "ocean", "forest", "violet"] as const) {
                if (!profile.palettes?.[colormap]) continue;
                const colors = resolveThemeSettings({
                    design: id, colormap, overrides: profile.palettes[colormap],
                }, { allowUnreleased: true });
                if (!colors.issues.length) palettes[colormap] = colors.settings.overrides;
            }
            store.designs[id] = { colormap: checked.settings.colormap, palettes };
        }
        return { store };
    } catch {
        return { store: emptyColorProfiles(), issue: "저장한 색상 프로필을 읽을 수 없어 현재 탭에서 계속합니다." };
    }
}

export function writeColorProfiles(storage: StorageAccess, store: ColorProfileStore): string | undefined {
    try {
        storage.setItem(colorProfileStorageKey, JSON.stringify(store));
    } catch {
        return "색상 프로필을 저장할 수 없습니다. 현재 탭의 설정은 유지됩니다.";
    }
}

export function rememberColorProfile(
    store: ColorProfileStore, settings: ThemeSettings, replaceEmpty = false,
): ColorProfileStore {
    const previous = store.designs[settings.design];
    const existing = previous?.palettes[settings.colormap];
    const hasColors = Object.values(settings.overrides).some((values) => Object.keys(values).length);
    return {
        version: 1,
        designs: {
            ...store.designs,
            [settings.design]: {
                colormap: settings.colormap,
                palettes: {
                    ...previous?.palettes,
                    [settings.colormap]: !replaceEmpty && !hasColors && existing
                        ? existing : structuredClone(settings.overrides),
                },
            },
        },
    };
}

export function restoreDesignProfile(store: ColorProfileStore, design: DesignModeId): {
    colormap: PaletteId; overrides: ColorOverrides;
} {
    const profile = store.designs[design];
    const colormap = profile?.colormap ?? (design === "basic" ? "neutral" : "design");
    return { colormap, overrides: structuredClone(profile?.palettes[colormap] ?? { light: {}, dark: {} }) };
}
