import { useCallback, useEffect, useRef, useState } from "react";
import type { PrismCandidate } from "./prism-candidate";
import { createPrismPositionReference, type PrismPositionReference } from "./prism-position-recommendations";

export type PrismDetailSelection = { kind: "profile"; candidate: PrismCandidate } | { kind: "position"; reference: PrismPositionReference };
const ticketScope: unique symbol = Symbol("prism-detail-request");
/** UI request identity only. It contains no subject data and is not a server authorization token. */
export type PrismDetailRequestTicket = Readonly<{ generation: number; [ticketScope]: symbol }>;
type Snapshot = { selection: PrismDetailSelection | null; generation: number };
function normalizeSelection(selection: PrismDetailSelection | null): PrismDetailSelection | null {
    if (!selection) return null;
    if (selection.kind === "position") return { kind: "position", reference: createPrismPositionReference(selection.reference, selection.reference.source) };
    if (!selection.candidate.id.trim()) throw new Error("A selected profile requires its identifier.");
    return { kind: "profile", candidate: selection.candidate };
}
/** Host-owned selection. API classification, loading, cancellation and notices stay outside this hook. */
export function usePrismDetailSelection(initialSelection: PrismDetailSelection | null = null) {
    const [snapshot, setSnapshot] = useState<Snapshot>(() => ({ selection: normalizeSelection(initialSelection), generation: 0 }));
    const current = useRef(snapshot), scope = useRef(Symbol("prism-detail-instance")), mounted = useRef(true);
    useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
    const select = useCallback((selection: PrismDetailSelection | null) => {
        if (!mounted.current) return;
        const next = { selection: normalizeSelection(selection), generation: current.current.generation + 1 };
        current.current = next;
        setSnapshot(next);
    }, []);
    const selectProfile = useCallback((candidate: PrismCandidate) => select({ kind: "profile", candidate }), [select]);
    const selectPosition = useCallback((reference: PrismPositionReference) => select({ kind: "position", reference }), [select]);
    const close = useCallback(() => { if (current.current.selection) select(null); }, [select]);
    const captureRequest = useCallback((): PrismDetailRequestTicket | null => {
        if (!mounted.current || !current.current.selection) return null;
        return Object.freeze({ generation: current.current.generation, [ticketScope]: scope.current });
    }, []);
    const isRequestCurrent = useCallback((ticket: PrismDetailRequestTicket): boolean =>
        mounted.current && current.current.selection !== null && ticket[ticketScope] === scope.current && ticket.generation === current.current.generation, []);
    const handleAccessError = useCallback((status: number, ticket?: PrismDetailRequestTicket | null): boolean => {
        if ((status !== 403 && status !== 404) || !mounted.current || !current.current.selection) return false;
        // No ticket reproduces the source's classified global detail-error event.
        if (ticket !== undefined && (!ticket || !isRequestCurrent(ticket))) return false;
        select(null);
        return true;
    }, [isRequestCurrent, select]);
    return { selection: snapshot.selection, open: snapshot.selection !== null, selectProfile, selectPosition, close, captureRequest, isRequestCurrent, handleAccessError };
}
