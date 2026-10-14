import { useCallback, useLayoutEffect, useRef, useState, type RefObject } from "react";
import {
    createThemeMessage, readThemeAppliedMessage, readThemeInvalidatedMessage,
    type ThemeResolutionOptions, type ThemeSettings,
} from "@pydemia/ui";

export type ProfileBridgeStatus = "waiting" | "applied" | "changed" | "unavailable";

export function useProfileBridge(
    frameRef: RefObject<HTMLIFrameElement | null>,
    settings: ThemeSettings,
    revision: number,
    options: ThemeResolutionOptions = {},
) {
    const latest = useRef({ settings, revision, options });
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const sentRevision = useRef<number | null>(null);
    const wireRevision = useRef(-1);
    const invalidatedRevision = useRef<number | null>(null);
    const [status, setStatus] = useState<ProfileBridgeStatus>("waiting");
    const send = useCallback(() => {
        clearTimeout(timer.current);
        const target = frameRef.current?.contentWindow;
        if (!target) {
            sentRevision.current = null;
            setStatus("unavailable");
            return;
        }
        const current = latest.current;
        wireRevision.current = Math.max(current.revision, wireRevision.current + 1);
        const message = createThemeMessage(
            current.settings, wireRevision.current, current.options,
        );
        sentRevision.current = message.revision;
        invalidatedRevision.current = null;
        setStatus("waiting");
        target.postMessage(message, window.location.origin);
        timer.current = setTimeout(() => setStatus("unavailable"), 3000);
    }, [frameRef]);

    useLayoutEffect(() => {
        function receive(event: MessageEvent) {
            if (event.origin !== window.location.origin ||
                event.source !== frameRef.current?.contentWindow ||
                sentRevision.current === null) return;
            if (readThemeInvalidatedMessage(event.data, sentRevision.current)) {
                clearTimeout(timer.current);
                invalidatedRevision.current = sentRevision.current;
                setStatus("changed");
                return;
            }
            if (invalidatedRevision.current === sentRevision.current ||
                !readThemeAppliedMessage(event.data, sentRevision.current)) return;
            clearTimeout(timer.current);
            setStatus("applied");
        }
        window.addEventListener("message", receive);
        return () => {
            window.removeEventListener("message", receive);
            clearTimeout(timer.current);
        };
    }, [frameRef]);

    useLayoutEffect(() => {
        latest.current = { settings, revision, options };
        send();
    }, [settings, revision, options.allowUnreleased, send]);
    return { send, status };
}
