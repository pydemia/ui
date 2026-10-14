import { resolveThemeSettings, type ThemeResolutionOptions } from "./design-mode-settings";
import type { ThemeSettings } from "./design-modes";

export type ThemeMessage = {
    type: "pydemia-ui-theme";
    version: 1;
    revision: number;
    settings: ThemeSettings;
};
export type ThemeAppliedMessage = {
    type: "pydemia-ui-theme-applied";
    version: 1;
    revision: number;
};
export type ThemeInvalidatedMessage = {
    type: "pydemia-ui-theme-invalidated";
    version: 1;
    revision: number;
};

function record(value: unknown): value is Record<string, unknown> {
    return value !== null && typeof value === "object" && !Array.isArray(value);
}

function revisionValid(value: unknown): value is number {
    return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

/** Source and origin must be checked by the caller before reading a message. */
export function readThemeMessage(
    data: unknown,
    lastRevision: number,
    options: ThemeResolutionOptions = {},
): ThemeMessage | null {
    if (!record(data) || data.type !== "pydemia-ui-theme" || data.version !== 1 ||
        !revisionValid(data.revision) || data.revision <= lastRevision ||
        !record(data.settings)) return null;
    const settings = data.settings;
    if (settings.version !== 1 || typeof settings.design !== "string" ||
        typeof settings.appearance !== "string" ||
        typeof settings.colormap !== "string" || !record(settings.overrides) ||
        !record(settings.overrides.light) || !record(settings.overrides.dark)) return null;
    const resolved = resolveThemeSettings(settings, options);
    if (resolved.issues.length) return null;
    return {
        type: "pydemia-ui-theme", version: 1,
        revision: data.revision, settings: resolved.settings,
    };
}

export function createThemeMessage(
    settings: ThemeSettings,
    revision: number,
    options: ThemeResolutionOptions = {},
): ThemeMessage {
    const message = readThemeMessage({
        type: "pydemia-ui-theme", version: 1, revision, settings,
    }, -1, options);
    if (!message) throw new TypeError("Invalid theme message settings or revision.");
    return message;
}

export function createThemeAppliedMessage(revision: number): ThemeAppliedMessage {
    if (!revisionValid(revision)) throw new TypeError("Invalid theme revision.");
    return { type: "pydemia-ui-theme-applied", version: 1, revision };
}

/** Only an acknowledgement for the latest sent revision is accepted. */
export function readThemeAppliedMessage(
    data: unknown,
    expectedRevision: number,
): ThemeAppliedMessage | null {
    if (!record(data) || data.type !== "pydemia-ui-theme-applied" ||
        data.version !== 1 || !revisionValid(data.revision) ||
        data.revision !== expectedRevision) return null;
    return createThemeAppliedMessage(data.revision);
}

export function createThemeInvalidatedMessage(revision: number): ThemeInvalidatedMessage {
    if (!revisionValid(revision)) throw new TypeError("Invalid theme revision.");
    return { type: "pydemia-ui-theme-invalidated", version: 1, revision };
}

/** A local change invalidates only the latest sent revision. */
export function readThemeInvalidatedMessage(
    data: unknown,
    expectedRevision: number,
): ThemeInvalidatedMessage | null {
    if (!record(data) || data.type !== "pydemia-ui-theme-invalidated" ||
        data.version !== 1 || !revisionValid(data.revision) ||
        data.revision !== expectedRevision) return null;
    return createThemeInvalidatedMessage(data.revision);
}
