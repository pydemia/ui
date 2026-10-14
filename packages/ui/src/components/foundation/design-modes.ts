/** Pure design metadata; additional modes await visual release validation. */
export type Appearance = "light" | "dark";
export const colorTokens = [
    { name: "Background", token: "--background" },
    { name: "Surface", token: "--surface" },
    { name: "Surface subtle", token: "--surface-subtle" },
    { name: "Foreground", token: "--foreground" },
    { name: "Muted", token: "--muted" },
    { name: "Border", token: "--border" },
    { name: "Accent", token: "--accent" },
    { name: "Accent text", token: "--accent-foreground" },
    { name: "Focus", token: "--focus" },
    { name: "Danger", token: "--danger" },
    { name: "Success", token: "--success" },
    { name: "Warning", token: "--warning" },
    { name: "User message", token: "--message-user-background" },
    { name: "User message text", token: "--message-user-foreground" },
] as const;

export const colormaps = [
    {
        id: "neutral", name: "Neutral", description: "기존 청록",
        colors: {
            light: ["#f7f8fa", "#245d70", "#103344"],
            dark: ["#131a21", "#83bfd2", "#245d70"],
        },
    },
    {
        id: "pydemia", name: "Pydemia", description: "로고 네이비·로즈",
        colors: {
            light: ["#f7f9fb", "#ba365b", "#103344"],
            dark: ["#111a24", "#f19ab1", "#20465d"],
        },
    },
    {
        id: "ocean", name: "Ocean", description: "선명한 파랑",
        colors: {
            light: ["#f5f8fc", "#205ca3", "#163f70"],
            dark: ["#111b2b", "#8fc0ff", "#285d96"],
        },
    },
    {
        id: "forest", name: "Forest", description: "차분한 초록",
        colors: {
            light: ["#f5f8f4", "#25684a", "#174a38"],
            dark: ["#121e19", "#91d4aa", "#276348"],
        },
    },
    {
        id: "violet", name: "Violet", description: "절제된 보라",
        colors: {
            light: ["#faf7fc", "#68438e", "#4e326e"],
            dark: ["#1d1726", "#d2a4f1", "#67418a"],
        },
    },
] as const;

export type ColorToken = (typeof colorTokens)[number]["token"];
export type ColormapId = (typeof colormaps)[number]["id"];
export type PaletteId = "design" | ColormapId;
export type ColorOverrides = Record<Appearance, Partial<Record<ColorToken, string>>>;
export type ThemeTokenMap = Record<`--${string}`, string>;
export type ColorPalette = Record<ColorToken, string>;

export const paletteTokens: Record<ColormapId, Record<Appearance, ColorPalette>> = {
    "neutral": {
        "light": {
            "--background": "#f7f8fa",
            "--foreground": "#202a35",
            "--surface": "#ffffff",
            "--surface-subtle": "#f2f4f6",
            "--border": "#d6dce2",
            "--muted": "#52606d",
            "--accent": "#245d70",
            "--accent-foreground": "#ffffff",
            "--message-user-background": "#103344",
            "--message-user-foreground": "#ffffff",
            "--focus": "#176c8a",
            "--danger": "#a22c36",
            "--success": "#236645",
            "--warning": "#8b5a06"
        },
        "dark": {
            "--background": "#131a21",
            "--foreground": "#e9eef2",
            "--surface": "#1b242d",
            "--surface-subtle": "#25313b",
            "--border": "#46545f",
            "--muted": "#afbec9",
            "--accent": "#83bfd2",
            "--accent-foreground": "#13232d",
            "--message-user-background": "#245d70",
            "--message-user-foreground": "#ffffff",
            "--focus": "#9ad6eb",
            "--danger": "#ff9aa0",
            "--success": "#8dd9ac",
            "--warning": "#f2c46f"
        }
    },
    "pydemia": {
        "light": {
            "--background": "#f7f9fb",
            "--foreground": "#1d2d3a",
            "--surface": "#ffffff",
            "--surface-subtle": "#f1f4f7",
            "--border": "#d2dce5",
            "--muted": "#536473",
            "--accent": "#ba365b",
            "--accent-foreground": "#ffffff",
            "--message-user-background": "#103344",
            "--message-user-foreground": "#ffffff",
            "--focus": "#9f274c",
            "--danger": "#a22c36",
            "--success": "#236645",
            "--warning": "#8b5a06"
        },
        "dark": {
            "--background": "#111a24",
            "--foreground": "#edf2f7",
            "--surface": "#1b2734",
            "--surface-subtle": "#263544",
            "--border": "#465b6d",
            "--muted": "#b3c3d1",
            "--accent": "#f19ab1",
            "--accent-foreground": "#301722",
            "--message-user-background": "#20465d",
            "--message-user-foreground": "#ffffff",
            "--focus": "#f6aec1",
            "--danger": "#ff9aa0",
            "--success": "#8dd9ac",
            "--warning": "#f2c46f"
        }
    },
    "ocean": {
        "light": {
            "--background": "#f5f8fc",
            "--foreground": "#182b43",
            "--surface": "#ffffff",
            "--surface-subtle": "#edf3f9",
            "--border": "#cbd9e8",
            "--muted": "#4d6077",
            "--accent": "#205ca3",
            "--accent-foreground": "#ffffff",
            "--message-user-background": "#163f70",
            "--message-user-foreground": "#ffffff",
            "--focus": "#166bb4",
            "--danger": "#a52b3a",
            "--success": "#236645",
            "--warning": "#8b5a06"
        },
        "dark": {
            "--background": "#111b2b",
            "--foreground": "#e8f1fb",
            "--surface": "#19263a",
            "--surface-subtle": "#23334a",
            "--border": "#425873",
            "--muted": "#aebfd4",
            "--accent": "#8fc0ff",
            "--accent-foreground": "#10243d",
            "--message-user-background": "#285d96",
            "--message-user-foreground": "#ffffff",
            "--focus": "#add4ff",
            "--danger": "#ff9b9f",
            "--success": "#8dd9ac",
            "--warning": "#f2c46f"
        }
    },
    "forest": {
        "light": {
            "--background": "#f5f8f4",
            "--foreground": "#1c3027",
            "--surface": "#ffffff",
            "--surface-subtle": "#eef4ee",
            "--border": "#cadbce",
            "--muted": "#4b6455",
            "--accent": "#25684a",
            "--accent-foreground": "#ffffff",
            "--message-user-background": "#174a38",
            "--message-user-foreground": "#ffffff",
            "--focus": "#1a7a52",
            "--danger": "#a33438",
            "--success": "#236645",
            "--warning": "#8b5a06"
        },
        "dark": {
            "--background": "#121e19",
            "--foreground": "#e7f3eb",
            "--surface": "#1b2a22",
            "--surface-subtle": "#27382d",
            "--border": "#455e4d",
            "--muted": "#adc7b3",
            "--accent": "#91d4aa",
            "--accent-foreground": "#122c1f",
            "--message-user-background": "#276348",
            "--message-user-foreground": "#ffffff",
            "--focus": "#afe8c0",
            "--danger": "#ff9da0",
            "--success": "#8dd9ac",
            "--warning": "#f2c46f"
        }
    },
    "violet": {
        "light": {
            "--background": "#faf7fc",
            "--foreground": "#30233e",
            "--surface": "#ffffff",
            "--surface-subtle": "#f4eff8",
            "--border": "#ddd1e7",
            "--muted": "#675875",
            "--accent": "#68438e",
            "--accent-foreground": "#ffffff",
            "--message-user-background": "#4e326e",
            "--message-user-foreground": "#ffffff",
            "--focus": "#7a4ca7",
            "--danger": "#a8324c",
            "--success": "#236645",
            "--warning": "#8b5a06"
        },
        "dark": {
            "--background": "#1d1726",
            "--foreground": "#f3ecfa",
            "--surface": "#292035",
            "--surface-subtle": "#372c45",
            "--border": "#604c70",
            "--muted": "#cab8d8",
            "--accent": "#d2a4f1",
            "--accent-foreground": "#291838",
            "--message-user-background": "#67418a",
            "--message-user-foreground": "#ffffff",
            "--focus": "#e4c3fa",
            "--danger": "#ff9eb8",
            "--success": "#8dd9ac",
            "--warning": "#f2c46f"
        }
    }
};

export const basicShapeTokens: ThemeTokenMap = {
    "--radius": "5px",
    "--density-control-height": "36px",
    "--density-row-block": "10px",
    "--control-height": "var(--density-control-height)",
    "--type-body-size": "14px",
    "--type-caption-size": "12px",
    "--type-body-leading": "1.5",
    "--space-1": "4px",
    "--space-2": "8px",
    "--space-3": "12px",
    "--space-4": "16px",
    "--space-6": "24px",
    "--shadow-float": "0 4px 16px rgb(20 35 45 / 8%)",
    "--overlay": "rgb(13 25 32 / 45%)",
    "--motion-fast": "150ms",
    "--font-ui": "Inter, \"Noto Sans KR\", system-ui, sans-serif"
};

export const designModeIds = [
    "basic", "glass", "material", "fluent", "neumorphic", "flat",
    "bento", "brutal", "clay", "skeuo", "dark-ui", "minimal", "swiss",
    "editorial", "aurora", "cyber", "terminal", "retro", "pixel",
    "drawn", "spatial",
] as const;
export type DesignModeId = (typeof designModeIds)[number];
export type DesignModeDefinition = {
    id: DesignModeId;
    name: string;
    group: string;
    description: string;
    atlasCaseId: string | null;
    releaseStatus: "released" | "ready" | "draft";
    appearances: readonly Appearance[];
    defaultAppearance: Appearance;
    colormaps: readonly PaletteId[];
    recipe: "standard" | "bento" | "spatial";
    tokens: ThemeTokenMap;
    palettes: Record<Appearance, ColorPalette>;
};
export type ThemeSettings = {
    version: 1;
    design: DesignModeId;
    appearance: Appearance;
    colormap: PaletteId;
    overrides: ColorOverrides;
};

// These values match the existing documentation literals.
export const basicDocumentTokens: ThemeTokenMap = {
    "--font-heading": "var(--font-ui)",
    "--heading-size": "clamp(38px, 4.5vw, 56px)",
    "--section-heading-size": "clamp(26px, 3vw, 33px)",
    "--heading-weight": "650",
    "--section-heading-weight": "640",
    "--panel-shadow": "var(--shadow-float)",
    "--panel-radius": "5px",
    "--docs-section-space": "42px",
    "--docs-preview-padding": "22px",
    "--border-width": "1px",
};

const allPalettes: readonly PaletteId[] = [
    "design", "neutral", "pydemia", "ocean", "forest", "violet",
];
const mono = 'ui-monospace, "Noto Sans KR", monospace';
const serif = 'Georgia, "Noto Serif KR", serif';

type ModeProfile = [
    DesignModeId, string, string, string, ColormapId, ThemeTokenMap,
    Partial<Record<Appearance, Partial<ColorPalette>>>?,
];
const profiles: ModeProfile[] = [
    ["basic", "Basic", "기본", "현재 pydemia UI의 기본 표현", "neutral", {}],
    ["glass", "Glassmorphism", "표면", "유리 느낌의 층과 옅은 경계", "ocean", {
        "--radius": "14px", "--panel-radius": "18px",
        "--panel-shadow": "0 12px 32px rgb(25 55 85 / 14%)",
    }],
    ["material", "Material Inspired", "표면", "둥근 tonal 표면의 pydemia 해석", "violet", {
        "--radius": "16px", "--panel-radius": "24px",
        "--density-control-height": "40px",
    }],
    ["fluent", "Fluent Acrylic", "표면", "아크릴 층과 파란 강조의 pydemia 해석", "ocean", {
        "--radius": "8px", "--panel-radius": "12px",
        "--panel-shadow": "0 8px 24px rgb(20 45 75 / 16%)",
    }],
    ["neumorphic", "Neumorphism", "표면", "명시적 경계와 안팎 그림자", "neutral", {
        "--radius": "12px", "--panel-radius": "20px",
        "--panel-shadow": "6px 6px 16px rgb(0 0 0 / 12%), -4px -4px 12px rgb(255 255 255 / 12%)",
    }, { light: { "--background": "#e8edf2", "--surface": "#e8edf2" } }],
    ["flat", "Flat Design", "정돈", "평면 채움과 작은 모서리", "ocean", {
        "--radius": "2px", "--panel-radius": "2px",
        "--shadow-float": "none", "--panel-shadow": "none",
    }],
    ["bento", "Bento Grid", "조합", "기존 조합 화면의 카드 격자", "neutral", {
        "--radius": "12px", "--panel-radius": "20px",
        "--docs-preview-padding": "24px", "--space-6": "28px",
    }],
    ["brutal", "Neobrutalism", "개성", "굵은 선과 단단한 offset 그림자", "neutral", {
        "--radius": "0px", "--panel-radius": "0px",
        "--border-width": "2px", "--heading-weight": "800",
        "--shadow-float": "4px 4px 0 var(--border)",
        "--panel-shadow": "6px 6px 0 var(--border)",
    }, { light: { "--background": "#fff9e9", "--border": "#202a35", "--accent": "#904315" }, dark: { "--accent": "#ffbd7c" } }],
    ["clay", "Claymorphism", "표면", "큰 둥근 모서리와 부드러운 입체", "violet", {
        "--radius": "20px", "--panel-radius": "28px",
        "--panel-shadow": "inset 0 3px 5px rgb(255 255 255 / 25%), 0 8px 20px rgb(74 35 100 / 15%)",
    }],
    ["skeuo", "Skeuomorphism", "개성", "bevel 경계와 재질감을 주는 패널", "forest", {
        "--radius": "6px", "--panel-radius": "8px",
        "--border-width": "2px",
        "--panel-shadow": "inset 0 1px 0 rgb(255 255 255 / 35%), 0 3px 5px rgb(0 0 0 / 20%)",
    }],
    ["dark-ui", "Dark UI", "표면", "전용 중립 팔레트의 어두운 화면; Light는 Basic", "neutral", {}, {
        dark: { "--background": "#101114", "--surface": "#191b20", "--surface-subtle": "#24272e", "--accent": "#c4cbd6", "--accent-foreground": "#17191e" },
    }],
    ["minimal", "Minimalist SaaS UI", "정돈", "넉넉한 여백과 절제된 중립 강조", "neutral", {
        "--radius": "6px", "--panel-radius": "8px",
        "--panel-shadow": "none", "--docs-section-space": "52px",
    }, { light: { "--accent": "#303741" }, dark: { "--accent": "#cbd1db" } }],
    ["swiss", "Swiss Style", "정돈", "큰 제목과 엄격한 격자, 절제된 빨강", "neutral", {
        "--radius": "0px", "--panel-radius": "0px",
        "--panel-shadow": "none", "--heading-weight": "800",
        "--heading-size": "clamp(40px, 5vw, 64px)",
    }, { light: { "--accent": "#b52b2b", "--focus": "#b52b2b" }, dark: { "--accent": "#ffaaaa", "--focus": "#ffaaaa" } }],
    ["editorial", "Editorial UI", "정돈", "serif 제목과 얇은 구획선", "neutral", {
        "--radius": "1px", "--panel-radius": "1px",
        "--font-heading": serif, "--heading-weight": "600",
        "--panel-shadow": "none", "--docs-section-space": "48px",
    }, { light: { "--background": "#faf8f2", "--accent": "#725333" }, dark: { "--accent": "#dcc19a" } }],
    ["aurora", "Aurora Mesh", "표면", "조용한 콘텐츠 표면과 배경 gradient", "violet", {
        "--radius": "14px", "--panel-radius": "22px",
        "--panel-shadow": "0 10px 32px rgb(104 67 142 / 16%)",
    }],
    ["cyber", "Cyberpunk UI", "개성", "네온 경계와 발광; Dark만 지원", "ocean", {
        "--radius": "0px", "--panel-radius": "2px",
        "--font-heading": mono, "--panel-shadow": "0 0 16px color-mix(in srgb, var(--accent) 25%, transparent)",
    }, { dark: { "--background": "#0e1020", "--surface": "#171a2e", "--accent": "#74f5ed", "--focus": "#f6a0e7" } }],
    ["terminal", "Terminal UI", "개성", "고정폭 서체와 녹색 강조; Dark만 지원", "forest", {
        "--radius": "0px", "--panel-radius": "0px",
        "--font-ui": mono, "--panel-shadow": "none",
        "--density-row-block": "8px",
    }, { dark: { "--background": "#0c1510", "--surface": "#111f17", "--accent": "#9de8af", "--foreground": "#c7ecd0" } }],
    ["retro", "Retro Desktop UI", "개성", "제목 띠와 사각 bevel 경계", "ocean", {
        "--radius": "0px", "--panel-radius": "0px",
        "--border-width": "2px", "--font-heading": mono,
        "--panel-shadow": "inset 2px 2px 0 rgb(255 255 255 / 35%), 3px 3px 0 rgb(0 0 0 / 30%)",
    }],
    ["pixel", "Pixel Art UI", "개성", "사각 표면과 계단형 경계, 읽기 쉬운 본문", "violet", {
        "--radius": "0px", "--panel-radius": "0px",
        "--border-width": "3px", "--font-heading": mono,
        "--panel-shadow": "4px 4px 0 var(--border)",
    }],
    ["drawn", "Hand drawn UI", "개성", "불규칙 경계와 부드러운 제목", "forest", {
        "--radius": "8px 4px 10px 5px", "--panel-radius": "12px 6px 14px 8px",
        "--font-heading": serif, "--border-width": "2px",
        "--panel-shadow": "2px 3px 0 var(--border)",
    }, { light: { "--background": "#fbfaf3" } }],
    ["spatial", "Spatial UI", "조합", "웹 2D의 부유 패널과 깊이 있는 층", "ocean", {
        "--radius": "18px", "--panel-radius": "26px",
        "--space-6": "32px", "--docs-preview-padding": "28px",
        "--panel-shadow": "0 18px 48px rgb(15 35 65 / 22%)",
    }],
];

export const designModes: readonly DesignModeDefinition[] = profiles.map(
    ([id, name, group, description, palette, tokens, colors], index) => ({
        id, name, group, description,
        atlasCaseId: index === 0 ? null : String(index).padStart(2, "0"),
        releaseStatus: id === "basic" ? "released" : "ready",
        appearances: ["dark-ui", "cyber", "terminal"].includes(id)
            ? ["dark"] : ["light", "dark"],
        defaultAppearance: ["dark-ui", "cyber", "terminal"].includes(id)
            ? "dark" : "light",
        colormaps: allPalettes,
        recipe: id === "bento" || id === "spatial" ? id : "standard",
        tokens,
        palettes: {
            light: { ...paletteTokens[palette].light, ...colors?.light },
            dark: { ...paletteTokens[palette].dark, ...colors?.dark },
        },
    }),
);

export function isDesignModeId(value: unknown): value is DesignModeId {
    return typeof value === "string"
        && designModeIds.some((id) => id === value);
}

export function getDesignMode(id: DesignModeId): DesignModeDefinition {
    return designModes.find((mode) => mode.id === id)!;
}

export const releasedDesignModes = designModes.filter(
    (mode) => mode.releaseStatus === "released",
);

// Metadata is shared by scopes and controllers; callers must not mutate it.
function freezeMetadata(value: object): void {
    Object.freeze(value);
    for (const child of Object.values(value)) {
        if (child && typeof child === "object" && !Object.isFrozen(child)) {
            freezeMetadata(child);
        }
    }
}
for (const value of [
    colorTokens, colormaps, paletteTokens, basicShapeTokens,
    basicDocumentTokens, designModeIds, designModes, releasedDesignModes,
]) freezeMetadata(value);
