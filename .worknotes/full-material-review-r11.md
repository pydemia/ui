# Independent full material review R11

- Reviewed 2026-10-15 against `742e4574805d29c5473a9b6463c61c9d03ae7941`, branch `codex/design-navigation-schedule-harmony`.
- Read `AGENTS.md`, `.worknotes/design-all-component-audit-r11-2026-10-15.md`, the complete component/CSS/docs/consumer working diff, surrounding component implementations, relevant prior selectors and token definitions. The owning agent was still editing, so line numbers identify the source observed during review.
- Read-only source review. No browser, build, tests, Git mutation, deployment, delegation or product edits. Findings below are source-proven selector/token conflicts; rendered impact still needs the owning agent's browser verification.

## Findings

1. **P1 — User message background references an undefined token.** `packages/ui/src/design-modes.css:851` sets the user `MessageContent` background to `var(--message-user)`. The actual token is `--message-user-background` (`packages/ui/src/styles.css:25`), with Tailwind's `--color-message-user` mapping to that token (`styles.css:198`). No `--message-user` definition exists in the inspected source. The new unlayered declaration wins over `group-data-[from=user]:bg-message-user`, then becomes invalid at computed-value time, yielding a transparent background rather than falling back to the earlier utility. The same rule keeps `--message-user-foreground` (white in the default palettes). In a non-Basic light design this can produce white user text on the light conversation canvas. Change the new background reference to `--message-user-background`; verify user/assistant messages in a light and dark material scope. Root was notified immediately.

2. **P2 — Flat and plain variants receive unconditional painted planes/header chrome.** `packages/ui/src/components/log-console.tsx:50` always emits `data-slot="reading-plane"`, including `variant="flat"`, whose existing class explicitly requests `bg-transparent` (`log-console.tsx:61`). The new `design-modes.css:796-801` selector applies an opaque/tinted background, field radius and field shadow based solely on that slot, overriding the flat utility. The same pattern appears in `Terminal` (`terminal.tsx:111,121`) and `LogViewer` (`log-viewer.tsx:99`): their flat variants get a painted `surface-header` through `design-modes.css:813-823`, while `NotificationCenter` plain (`notification-center.tsx:88`) and `ArtifactViewer` plain (`artifact-viewer.tsx:118`) get the same header despite only the panel variant owning a panel surface. This removes the intended unframed, transparent embedding option in the newly covered modes; Clay/Neumorphic are useful probes because field decoration is visible. Gate painted slot hooks by the panel/frame variant or separate semantic reading/header slots from painted material slots. Keep scrolling semantics independent. `JsonViewer` and the inline agent/tool/reasoning hooks already demonstrate variant-gated headers and are useful patterns.

## Additional checks and limits

- Accordion's new `forwardRef` wrapper forwards the actual root ref. Its `ComponentPropsWithoutRef` uses React's distributive `PropsWithoutRef`, preserving the Radix single/multiple discriminated prop union; no source defect found there. Browser keyboard/ref behavior was not executed.
- New R11 painted selectors are enclosed in `@scope ([data-design]:not([data-design="basic"])) to ([data-design])`. That is the correct boundary structure for nested Basic scopes; no new unscoped painted selector was found in the R11 diff. This is source evidence, not a rendered Basic/PRISM pass.
- FormWizard's `data-embedded="true"` is forwarded by Stepper, and the new step-marker selector excludes embedded steppers. Breadcrumb, Timeline and Thread received no source edits or matching new generic material hooks in their own normal structure. Their nested/custom children still need normal runtime regression coverage.
- Series SVG fill/stroke, image pixels, diff line colors and status variants retain their explicit encoding in the reviewed patch. The exact user-message exception is finding 1; marker presence alone does not establish rendered color preservation.
- Month/YearPicker panels still use existing `PopoverContent` portal handling; CommandPalette and Lightbox still use existing Dialog portal handling. R11 adds slots without replacing that infrastructure. Portal inheritance was not executed.
- Consumer fixture's `grid-cols-1` plus `min-w-0` on both grid ancestors is a plausible correction for min-content expansion. No browser width assertion was run by this reviewer.
- No purely stylistic findings, invented coverage claims, or recommendations to add a second generic card wrapper.

## Handoff

- Root owns remediation and actual browser verification of the two findings, then final immutable snapshot, CI, PR and deployment work.
- This note is the only file written by this independent reviewer.
