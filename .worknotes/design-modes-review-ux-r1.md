# Design modes UX/verification independent review — r1

- Responsibility: user workflow, candidate/applied fidelity, verification sufficiency. Terminal status: review complete; release decision belongs to root.
- Input: `.worknotes/browser-evidence/design-modes-review-r1/`, revision `design-modes-review-r1`, base HEAD `288b0838aec424f7c83686f3d3b00677d749fa4b`. All manifest entries were SHA-256 checked against snapshot files; no mismatches. All source references below are relative to that frozen directory, not live source.
- Skills read: installed persona-cross-review, frontend-development, product-planning-with-ui; root AGENTS.md and snapshot goal, contract, implementation-plan relevant sections read. No other reviewer report read. No delegation, source edits, build, tests, Git, deployment, browser interaction performed.
- Router recommendation supplied by coordinator: gpt-6-astra/low; execution metadata unavailable. Recommendation is not claimed as observed execution configuration.

## Findings

### UX-01 — Medium / fix before releasing design switching: preview does not show the settings that commit will apply

Evidence: `apps/docs/src/components/design-mode-picker.tsx:51`–54 constructs another design's preview with `colormap: "design"` and empty overrides. `apps/docs/src/theme/controller.ts:79`–88 commits with `restoreDesignProfile(store.current, id)`; `apps/docs/src/theme/storage.ts:82`–88 returns that design's saved palette and overrides. Plan lines 113–115 require profile restoration and one resolved result for page/preview/iframe.

Trigger → impact: in the internal candidate, apply Swiss, select Ocean and set accent #123456; apply Editorial; open picker and inspect Swiss. The preview shows Swiss default colors. Confirm Swiss and controller instead restores Ocean/#123456. The large preview therefore cannot predict the actual result, on desktop and explicit mobile Apply. Current production release gating prevents non-Basic switching, so this is a W05/W06 candidate defect to resolve before mode release, not a claim that unreleased modes should already be public. It also affects reselecting the same design after clearing overrides: preview uses currently cleared overrides but commit can resurrect the backed-up override.

Counterevidence: appearance fallback is correctly shared in intent; currently applied design normally previews its live settings; saved profiles are deliberately isolated and restored. These protections do not resolve the disagreement because picker receives neither the profile store nor a candidate-settings resolver. Existing controller test explicitly expects profile restoration, while picker tests use fixed default settings and record IDs only, so neither checks integrated preview-to-commit fidelity.

Minimal fix: provide a pure candidate-settings preparation path owned by the controller, and use its exact normalized result for both preview and commit. Preserve saved profiles and candidate-only behavior; do not fix by discarding user customization.

Pass case: save different palettes and light/dark overrides for two modes, return to each through hover/arrows/mobile tap, record preview tokens/settings, commit and compare to root and profile settings. Include same-design reselect after reset, first-time Basic return, and unsupported appearance fallback. Exploration must leave root/URL/storage unchanged.

### UX-02 — Low / error feedback: reset hides storage failure raised during backup

Evidence: `apps/docs/src/theme/controller.ts:115` calls `persist(current.current)` before `apply(...)`; persist sets a failure notice at lines 61/63, and apply overwrites notice with an empty string at line 73 for a valid reset. `apps/docs/src/main.tsx:361` renders only the resulting notice.

Trigger → impact: storage becomes unavailable and user resets direct overrides; backup persistence fails, but the subsequent apply clears the failure message during the same action. User sees successful current-tab reset without knowing the backup was not persisted for a future session.

Counterevidence: settings remain usable and an in-memory backup survives; initial storage read errors are shown. commitDesign/setColormap have a second persist after apply, so their persistent storage failures do leave a notice. This finding is specifically resetOverrides, not a blanket storage failure claim. Existing tests check helper-returned errors and successful controller transitions, but do not drive a failing storage write through resetOverrides.

Minimal fix: return persistence issues to the caller and combine them with apply's validation/transition notice, or set the reset notice after apply. Keep current-tab settings intact.

Pass case: make setItem throw, reset nonempty overrides, assert overrides clear, business input/DOM remain, in-memory restore still works, and visible status states that persistence failed.

## Confirmed safeguards and excluded suspicions

- Candidate is local picker state; hover/focus/navigation do not call commit. Release gating exists in both picker commit and resolver. The 20 ready/1 released stage is intentional, not a missing-feature finding.
- Preview uses actual Button/Input/Table/Badge/Select/Tooltip and stable ThemeScope children. It includes disabled button, explicitly labelled error field/message, native checked row control, selected-row treatment, candidate/applied labels and applied check mark. Actual contrast/legibility across presets was not assessed from source.
- Mobile width/coarse-pointer path separates row click from Apply; actual touch pointer also prevents immediate commit. Search has explicit empty state; Escape/focus restoration use Popover and explicit trigger focus. Existing picker tests cover synthetic click, narrow viewport flag, Escape, search, node preservation. They do not constitute physical mobile or screen-reader verification.
- Basic/Light/Neutral defaults are explicit in resolver; initial URL parsing does not silently load saved profiles. replaceState for theme changes is the approved contract, not a history bug.
- Root bootstrap is inside the non-PRISM branch (`apps/docs/src/main.tsx:587` onward); PRISM redesign is excluded.
- Profile iframe src remains stable in main.tsx, and parent bridge checks origin, source, sent/latest revision with timeout/retry status. No browser execution of bridge was performed; W08 remains ongoing.

## Verification still required for release

Root should own actual browser coverage at 320/390/768/1280px: usable preview height, nested scrolling, footer reachability, search keyboard with mouse hover transitions, real Enter/Space activation, touch and keyboard on hybrid devices, Escape from nested Select/Tooltip, and candidate/applied announcements with assistive technology. Source tests dispatch keydown only for arrows/Escape; native button Enter activation and focus transitions across portals require browser evidence.

Run integrated picker+controller profile-fidelity and reset-failure cases above. Preserve real business drafts, filters, row selections, open business Dialog and component identity while switching through actual docs rather than only an isolated input Probe. Include URL Back after component navigation, reload, failed persistence and iframe latest-revision recovery. None of these are asserted passed by this review.

Read scope: full picker/preview/CSS, picker/controller tests, controller/storage, ThemeScope/Popover, profile bridge/message contracts; resolver first 140 lines; main.tsx relevant integration excerpts and bootstrap; goal/contract and implementation-plan state/URL/picker/verification sections. Hash verification covered manifest files but is not a claim that every component source was reviewed.

No source changes or shared artifacts were made. Only this report was written. W07–W14 implementation, mode coverage, PRISM regression, consumer installation and final publish remain coordinator-owned; this review does not authorize release or declare the overall goal complete.
