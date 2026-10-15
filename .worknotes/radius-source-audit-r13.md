# R13 radius source audit

## Scope

Read-only source review of the 21 design modes and the radius roles tied to
Registry review and Operations workspace. The shared worktree changed while
this audit was running; findings below describe the current source at handoff
and identify the original Material leak that the root owner has addressed.
I did not edit product files, build, use Git, or open a browser.

## Confirmed Material cause and current source

At the audit baseline, Material set `--radius: 999px` and
`--panel-radius: 24px` in `packages/ui/src/components/foundation/design-modes.ts`.
The generic token also feeds Tailwind's `--radius-sm`/`--radius-md` aliases
(`packages/ui/src/components/foundation/design-mode-settings.ts:176-178`;
`packages/ui/src/styles.css:204`). This made untagged `rounded-sm` container
utilities pills. Registry review is a separate iframe
(`apps/docs/src/main.tsx:501`) whose app loads package and mode CSS
(`apps/profile-demo/src/app.css:1-4`); the request table, normalization form,
and callout use untagged `rounded-sm` at
`apps/profile-demo/src/main.tsx:205,246,277`.

The root owner confirmed the before-render evidence: Operations frame
341×720px and featured/compact metric cards 292×135px / 292×70px all resolved
to 999px and were clipped into capsules at the narrow viewport. Source review
explains the separate roles: `.analytics-example-frame` used the generic
`var(--radius)`, and `MetricCard` variants did not match the original
default/elevated/subtle Card selectors. Both left container roots exposed to
the base radius.

The shared worktree now contains the role split:

- Material profile base is `12px`, panel is `24px`
  (`design-modes.ts:349-351`); Material CSS explicitly retains
  `--control-radius: 999px` and sets `--selection-radius: 12px`
  (`design-modes.css:143-149`). Button and badge selectors consume the
  control role (`design-modes.css:360-400`).
- The Operations outer frame now uses `--panel-radius-material`
  (`apps/docs/src/styles.css:460`). Non-Basic Card roots now receive panel
  radius across variants (`design-modes.css:853`), including featured and
  compact MetricCards.
- Material navigation selection is now 12px while schedule bars retain
  999px (`design-modes.css:570-574`). These keep short actions/bar silhouettes
  separate from panels and selected rows.

This current source addresses the confirmed leak without a blanket
`rounded-*` reset. Preserve circular avatars and indicators, progress/chart
marks, short Material action pills, and selected pills where a mode has an
explicit control/navigation role.

## Other-mode audit

`design-modes.ts:259-264` lists 21 modes; profile radius values are at
`:315-899`. I found no second source-backed case where a finite mode base
radius is incorrectly assigned to a panel role. The remaining larger values
are mode choices consumed by explicit surface recipes or controls; a source
scan alone does not establish that they need a global clamp.

| Mode | Base / panel radius | Source-grounded disposition |
| --- | --- | --- |
| Basic | 5px / 5px | Keep baseline. |
| Glass | 16px / 22px | Soft panels and controls are mode styling. |
| Material | 12px / 24px | Base/control split is explicit; use panel role for containers. |
| Fluent | 6px / 10px | Compact geometry. |
| Neumorphic | 16px / 22px | Soft surface geometry matches its tactile profile. |
| Flat | 3px / 3px | Keep square geometry. |
| Bento | 16px / 24px | Card geometry is intentional in the layout profile. |
| Brutal | 0 / 0 | Keep hard corners. |
| Clay | 28px / 34px | Plush surfaces are intentional; short control pills are explicit. |
| Skeuo | 7px / 9px | Keep compact device geometry. |
| Dark UI | 5px / 8px | Compact geometry. |
| Minimal | 5px / 7px | Restrained geometry. |
| Swiss | 0 / 0 | Keep grid geometry. |
| Editorial | 2px / 2px | Keep near-square geometry. |
| Aurora | 18px / 24px | Soft panel family is intentional. |
| Cyber | 0 / 2px | Keep sharp edges and clipping. |
| Terminal | 0 / 0 | Keep console geometry. |
| Retro | 0 / 0 | Keep window/bevel geometry. |
| Pixel | 0 / 0 | Keep pixel corners. |
| Drawn | `8px 4px 10px 5px` / `12px 6px 14px 8px` | Keep asymmetric hand-drawn corners. |
| Spatial | 20px / 28px | Floating panel geometry is part of this recipe. |

Role exceptions are already specific in CSS: Clay gives controls `999px` but
uses `16px` selection and `18px` fields (`design-modes.css:164-180`,
`:543`); Drawn supplies asymmetric control and panel values (`:300-310`).
Material navigation selection now uses 12px, and schedule bars keep their
pill role. These are useful boundaries to preserve while checking renderings.

## Handoff limit

This audit verifies source roles and the root owner's reported before-render
measurements. I did not independently verify the current rendering at mobile,
intermediate, or desktop widths. The root owner owns visual review and release.
