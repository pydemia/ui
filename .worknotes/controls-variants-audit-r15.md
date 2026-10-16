# R15 component variants and states: source audit

- Scope: 47 inventory IDs from Actions, Inputs, Selection, Date & time, and Overlays, excluding `button-group`, `pin-input`, `tags-input`, `color-input`, `checkbox`, `markdown`, and `drawer`. Inventory source: `.worknotes/browser-evidence/geometry-r14/inventory.json`.
- Method: reviewed each assigned component implementation and its declared variants plus state/disabled/error/open/selected hooks; located its catalog entry in `apps/docs/src/catalog.tsx`; checked directly matching component test sources where present and the shared design-mode selectors below.
- Decision: PASS means no concrete source-level theme, geometry, clipping, or invalid-radius defect was supported by this inspection. Runtime interaction in open/selected/error/disabled states remains UNVERIFIED for all 47 in this source-only audit. R14 initial-render geometry matrices passed all 144 inventory components, but do not establish state coverage.
- No product source, shared CSS, tests, docs, browser state, or Git state was changed.

## Shared theme evidence

- `packages/ui/src/design-modes.css:372-406` applies control and field radii and relief to button/input/textarea/select/native-select roles, with underline appearance handled separately.
- `packages/ui/src/design-modes.css:435-454` styles overlay panels and drawers; `[data-ui="overlay-panel"]` components use the panel role.
- `packages/ui/src/design-modes.css:803-823` applies panel/well geometry to `data-surface` roles, including ActionBar; `packages/ui/src/design-modes.css:907-995` styles non-Basic field frames, nested controls, add-ons, focus, invalid, and disabled states.
- `packages/ui/src/design-modes.css:1019-1020` wraps SearchInput controls and provides a shrinking input basis; `packages/ui/src/design-modes.css:1078-1101` styles active selection, card radio controls, slider tracks, and switch/slider thumbs.
- Four-corner mode values are used through `border-radius` declarations, which accept one to four values. The scoped `min()` values found at `design-modes.css:19-22` use scalar radius variables; the prior R14 repair reset compact/check/pin role variables before the multivalued Material overrides. No assigned component introduces an invalid `min()` over a four-corner value. Basic remains outside the non-Basic `@scope` at lines 907-1126.

## Per-component evidence

| ID | Component source reviewed | Catalog caller | Test source checked when directly matched | Source result |
|---|---|---|---|---|
| `button` | `packages/ui/src/components/button.tsx:1-45` | `apps/docs/src/catalog.tsx:5499` | — | PROVISIONAL static pass; runtime state unverified |
| `icon-button` | `packages/ui/src/components/icon-button.tsx:1-32` | `apps/docs/src/catalog.tsx:5511` | — | PROVISIONAL static pass; runtime state unverified |
| `copy-button` | `packages/ui/src/components/copy-button.tsx:1-86` | `apps/docs/src/catalog.tsx:5578` | — | PROVISIONAL static pass; runtime state unverified |
| `action-bar` | `packages/ui/src/components/action-bar.tsx:1-63` | `apps/docs/src/catalog.tsx:5598` | — | PROVISIONAL static pass; runtime state unverified |
| `input` | `packages/ui/src/components/input.tsx:1-37` | `apps/docs/src/catalog.tsx:5634` | — | PROVISIONAL static pass; runtime state unverified |
| `search-input` | `packages/ui/src/components/search-input.tsx:1-128` | `apps/docs/src/catalog.tsx:5667` | — | PROVISIONAL static pass; runtime state unverified |
| `input-group` | `packages/ui/src/components/input-group.tsx:1-119` | `apps/docs/src/catalog.tsx:5686` | [input-group.test.mjs](packages/ui/tests/input-group.test.mjs) | PROVISIONAL static pass; runtime state unverified |
| `number-input` | `packages/ui/src/components/number-input.tsx:1-281` | `apps/docs/src/catalog.tsx:5710` | — | PROVISIONAL static pass; runtime state unverified |
| `password-input` | `packages/ui/src/components/password-input.tsx:1-50` | `apps/docs/src/catalog.tsx:5765` | — | PROVISIONAL static pass; runtime state unverified |
| `rating` | `packages/ui/src/components/rating.tsx:1-142` | `apps/docs/src/catalog.tsx:5798` | [rating.test.mjs](packages/ui/tests/rating.test.mjs) | PROVISIONAL static pass; runtime state unverified |
| `label` | `packages/ui/src/components/label.tsx:1-13` | `apps/docs/src/catalog.tsx:5819` | — | PROVISIONAL static pass; runtime state unverified |
| `dialog` | `packages/ui/src/components/dialog.tsx:1-104` | `apps/docs/src/catalog.tsx:5868` | — | PROVISIONAL static pass; runtime state unverified |
| `command-palette` | `packages/ui/src/components/command-palette.tsx:1-212` | `apps/docs/src/catalog.tsx:5891` | — | PROVISIONAL static pass; runtime state unverified |
| `dropdown-menu` | `packages/ui/src/components/dropdown-menu.tsx:1-163` | `apps/docs/src/catalog.tsx:5945` | — | PROVISIONAL static pass; runtime state unverified |
| `context-menu` | `packages/ui/src/components/context-menu.tsx:1-162` | `apps/docs/src/catalog.tsx:5998` | — | PROVISIONAL static pass; runtime state unverified |
| `textarea` | `packages/ui/src/components/textarea.tsx:1-37` | `apps/docs/src/catalog.tsx:6072` | — | PROVISIONAL static pass; runtime state unverified |
| `native-select` | `packages/ui/src/components/native-select.tsx:1-46` | `apps/docs/src/catalog.tsx:6100` | — | PROVISIONAL static pass; runtime state unverified |
| `switch` | `packages/ui/src/components/switch.tsx:1-31` | `apps/docs/src/catalog.tsx:6116` | — | PROVISIONAL static pass; runtime state unverified |
| `radio-group` | `packages/ui/src/components/radio-group.tsx:1-76` | `apps/docs/src/catalog.tsx:6128` | — | PROVISIONAL static pass; runtime state unverified |
| `segmented-control` | `packages/ui/src/components/segmented-control.tsx:1-133` | `apps/docs/src/catalog.tsx:6149` | [segmented-control.test.mjs](packages/ui/tests/segmented-control.test.mjs) | PROVISIONAL static pass; runtime state unverified |
| `tooltip` | `packages/ui/src/components/tooltip.tsx:1-40` | `apps/docs/src/catalog.tsx:6233` | — | PROVISIONAL static pass; runtime state unverified |
| `accordion` | `packages/ui/src/components/accordion.tsx:1-69` | `apps/docs/src/catalog.tsx:6252` | [accordion.test.mjs](packages/ui/tests/accordion.test.mjs) | PROVISIONAL static pass; runtime state unverified |
| `collapsible` | `packages/ui/src/components/collapsible.tsx:1-20` | `apps/docs/src/catalog.tsx:6265` | — | PROVISIONAL static pass; runtime state unverified |
| `popover` | `packages/ui/src/components/popover.tsx:1-38` | `apps/docs/src/catalog.tsx:6277` | — | PROVISIONAL static pass; runtime state unverified |
| `hover-card` | `packages/ui/src/components/hover-card.tsx:1-36` | `apps/docs/src/catalog.tsx:6292` | — | PROVISIONAL static pass; runtime state unverified |
| `alert-dialog` | `packages/ui/src/components/alert-dialog.tsx:1-81` | `apps/docs/src/catalog.tsx:6318` | — | PROVISIONAL static pass; runtime state unverified |
| `toggle` | `packages/ui/src/components/toggle.tsx:1-26` | `apps/docs/src/catalog.tsx:6462` | — | PROVISIONAL static pass; runtime state unverified |
| `toggle-group` | `packages/ui/src/components/toggle-group.tsx:1-48` | `apps/docs/src/catalog.tsx:6470` | — | PROVISIONAL static pass; runtime state unverified |
| `slider` | `packages/ui/src/components/slider.tsx:1-71` | `apps/docs/src/catalog.tsx:6494` | — | PROVISIONAL static pass; runtime state unverified |
| `range-slider` | `packages/ui/src/components/range-slider.tsx:1-136` | `apps/docs/src/catalog.tsx:6506` | [range-slider.test.mjs](packages/ui/tests/range-slider.test.mjs) | PROVISIONAL static pass; runtime state unverified |
| `calendar` | `packages/ui/src/components/calendar.tsx:1-66` | `apps/docs/src/catalog.tsx:6529` | — | PROVISIONAL static pass; runtime state unverified |
| `affixed-input` | `packages/ui/src/components/affixed-input.tsx:1-61` | `apps/docs/src/catalog.tsx:6963` | — | PROVISIONAL static pass; runtime state unverified |
| `field` | `packages/ui/src/components/field.tsx:1-65` | `apps/docs/src/catalog.tsx:7089` | — | PROVISIONAL static pass; runtime state unverified |
| `select` | `packages/ui/src/components/select.tsx:1-110` | `apps/docs/src/catalog.tsx:7115` | — | PROVISIONAL static pass; runtime state unverified |
| `editable` | `packages/ui/src/components/editable.tsx:1-142` | `apps/docs/src/catalog.tsx:7143` | [editable.test.mjs](packages/ui/tests/editable.test.mjs) | PROVISIONAL static pass; runtime state unverified |
| `combobox` | `packages/ui/src/components/combobox.tsx:1-302` | `apps/docs/src/catalog.tsx:7158` | [combobox.test.mjs](packages/ui/tests/combobox.test.mjs) | PROVISIONAL static pass; runtime state unverified |
| `autocomplete` | `packages/ui/src/components/autocomplete.tsx:1-249` | `apps/docs/src/catalog.tsx:7217` | [autocomplete.test.mjs](packages/ui/tests/autocomplete.test.mjs) | PROVISIONAL static pass; runtime state unverified |
| `multi-select` | `packages/ui/src/components/multi-select.tsx:1-268` | `apps/docs/src/catalog.tsx:7242` | — | PROVISIONAL static pass; runtime state unverified |
| `transfer-list` | `packages/ui/src/components/transfer-list.tsx:1-149` | `apps/docs/src/catalog.tsx:7275` | [transfer-list.test.mjs](packages/ui/tests/transfer-list.test.mjs) | PROVISIONAL static pass; runtime state unverified |
| `date-picker` | `packages/ui/src/components/date-picker.tsx:1-102` | `apps/docs/src/catalog.tsx:7306` | — | PROVISIONAL static pass; runtime state unverified |
| `month-picker` | `packages/ui/src/components/month-picker.tsx:1-157` | `apps/docs/src/catalog.tsx:7327` | [month-picker.test.mjs](packages/ui/tests/month-picker.test.mjs) | PROVISIONAL static pass; runtime state unverified |
| `year-picker` | `packages/ui/src/components/year-picker.tsx:1-155` | `apps/docs/src/catalog.tsx:7351` | [year-picker.test.mjs](packages/ui/tests/year-picker.test.mjs) | PROVISIONAL static pass; runtime state unverified |
| `date-range-picker` | `packages/ui/src/components/date-range-picker.tsx:1-181` | `apps/docs/src/catalog.tsx:7375` | — | PROVISIONAL static pass; runtime state unverified |
| `time-picker` | `packages/ui/src/components/time-picker.tsx:1-193` | `apps/docs/src/catalog.tsx:7410` | [time-picker.test.mjs](packages/ui/tests/time-picker.test.mjs) | PROVISIONAL static pass; runtime state unverified |
| `date-time-picker` | `packages/ui/src/components/date-time-picker.tsx:1-136` | `apps/docs/src/catalog.tsx:7432` | [date-time-picker.test.mjs](packages/ui/tests/date-time-picker.test.mjs) | PROVISIONAL static pass; runtime state unverified |
| `tree-select` | `packages/ui/src/components/tree-select.tsx:1-222` | `apps/docs/src/catalog.tsx:7660` | [tree-select.test.mjs](packages/ui/tests/tree-select.test.mjs) | PROVISIONAL static pass; runtime state unverified |
| `favorite-toggle` | `packages/ui/src/components/favorite-toggle.tsx:1-38` | `apps/docs/src/catalog.tsx:8693` | — | PROVISIONAL static pass; runtime state unverified |

## Per-ID variant and state contracts

The contract summaries below are based on the component source ranges in the evidence table. They record code-level paths checked; runtime activation remains unverified here.

- **button** (`button.tsx:5-39`): primary/outline/ghost variants, default/icon sizes, disabled styling.
- **icon-button** (`icon-button.tsx:4-27`): inherits Button variants and disabled behavior; requires a non-empty accessible label and icon; defaults to ghost.
- **copy-button** (`copy-button.tsx:6-80`): icon/text appearances; inherited Button variant/size; success/failure status and described-by wiring after copy.
- **action-bar** (`action-bar.tsx:5-57`): inline/floating placement; clear action disables at selectedCount zero; panel role applies mode panel radius.
- **input** (`input.tsx:4-32`): outline/filled/underline appearances, invalid border, disabled state.
- **search-input** (`search-input.tsx:6-121`): field/toolbar variants; controlled/uncontrolled query; conditional clear control; disabled submit/clear.
- **input-group** (`input-group.tsx:7-112`): input/textarea and four addon alignments; field-frame focus/invalid states; textarea wraps to a separate row.
- **number-input** (`number-input.tsx:15-273`): field/stepper variants; bounds/step validation and invalid feedback; disabled/error gate step actions; stepper uses a field frame.
- **password-input** (`password-input.tsx:8-45`): masked/visible input toggled by a pressed icon button; disabled propagates to both controls.
- **rating** (`rating.tsx:4-138`): stars/segments; selected score; editable/read-only; disabled and required radio behavior.
- **label** (`label.tsx:4-9`): presentational label with caller-provided native label attributes; no geometry variant or state.
- **dialog** (`dialog.tsx:10-51`): default/wide/fullscreen sizes; open/close state delegated to Radix; bounded height and vertical scrolling, fullscreen fills viewport.
- **command-palette** (`command-palette.tsx:11-207`): controlled/default open; filtered and active command; disabled commands skipped; list scrolls at max height.
- **dropdown-menu** (`dropdown-menu.tsx:13-59`): default/danger items; Radix open/highlight/disabled states; menu surface scrolls within available height.
- **context-menu** (`context-menu.tsx:13-59`): default/danger items; Radix highlight/disabled state; menu surface scrolls within available height.
- **textarea** (`textarea.tsx:4-32`): outline/filled/underline appearances; invalid border and disabled state; vertical resizing.
- **native-select** (`native-select.tsx:4-41`): outline/filled/underline appearances; invalid and disabled states; mode-specific field height/padding hook.
- **switch** (`switch.tsx:5-25`): checked/unchecked state and disabled state; circular track and thumb are intentional.
- **radio-group** (`radio-group.tsx:10-70`): default/card variants; checked/invalid/disabled states; card variant requires a label.
- **segmented-control** (`segmented-control.tsx:10-123`): selected radio segment and disabled choices; max-width horizontal scrolling; state hook feeds selection styling.
- **tooltip** (`tooltip.tsx:9-37`): Radix open/placement behavior; tooltip text bounded to max width; no component geometry variant.
- **accordion** (`accordion.tsx:7-65`): single/multiple disclosure type (per test contract), open/closed items, disabled trigger; collapsed content clips vertically.
- **collapsible** (`collapsible.tsx:5-17`): Radix controlled/default open behavior; content has no extra clipping or geometry override.
- **popover** (`popover.tsx:9-34`): Radix open/placement behavior; content width capped against viewport.
- **hover-card** (`hover-card.tsx:9-30`): Radix open/placement behavior; content width capped against viewport.
- **alert-dialog** (`alert-dialog.tsx:11-35`): alert-dialog action/cancel and modal open state delegated to Radix; bounded height with vertical scrolling.
- **toggle** (`toggle.tsx:5-22`): on/off pressed state and disabled state; mode selector applies selection radius and active relief.
- **toggle-group** (`toggle-group.tsx:5-44`): orientation and Radix single/multiple selection; active item and disabled states; horizontal variant can scroll.
- **slider** (`slider.tsx:5-66`): orientation, one or more labeled thumbs, disabled state; track and thumb remain intentional pills/circles.
- **range-slider** (`range-slider.tsx:5-131`): ordered min/max values, configurable bounds/steps/gap, disabled state; two labeled thumbs and hidden form values.
- **calendar** (`calendar.tsx:5-61`): DayPicker selection mode supplied by caller; selected/today/outside/disabled day classes; month layout stacks below small breakpoint.
- **affixed-input** (`affixed-input.tsx:6-55`): optional prefix/suffix around Input; shared field-frame radius and focus hook; input can disable natively.
- **field** (`field.tsx:5-59`): required/description/error states and generated described-by/invalid props; children provide the actual control.
- **select** (`select.tsx:10-97`): outline/filled/underline trigger; Radix open/selected/highlighted/disabled states; bounded, scrollable options surface.
- **editable** (`editable.tsx:7-135`): preview/edit/pending/error states; disabled and validation paths; wraps action buttons and long preview text.
- **combobox** (`combobox.tsx:11-278`): selected option, open filtering, option disabled, read-only/disabled, loading/error states; bounded scrollable popup.
- **autocomplete** (`autocomplete.tsx:11-220`): arbitrary text and suggestion selection; open/active suggestion; read-only/disabled/loading/error; bounded scrollable popup.
- **multi-select** (`multi-select.tsx:10-257`): selected options as removable chips; required/invalid, disabled, and per-option disabled states; bounded scrollable options list.
- **transfer-list** (`transfer-list.tsx:8-145`): panel/plain appearance; selected, per-item disabled, and global disabled states; bounded scrollable lists and stacked narrow layout.
- **date-picker** (`date-picker.tsx:8-99`): controlled nullable date, min/max disabled dates, required, disabled, popover open/close, selected day.
- **month-picker** (`month-picker.tsx:8-151`): controlled nullable month, min/max years/months, required/disabled, open state, selected month and year paging.
- **year-picker** (`year-picker.tsx:8-149`): controlled nullable year, min/max, required/disabled, open state, selected year and bounded paging.
- **date-range-picker** (`date-range-picker.tsx:8-175`): nullable partial/complete range, bounds and night count, disabled state, open state; range completion closes popup and clear action resets it.
- **time-picker** (`time-picker.tsx:8-183`): 12/24-hour cycle, controlled value, required/disabled, native selects; responsive two/three-column control grid.
- **date-time-picker** (`date-time-picker.tsx:8-128`): combined date and time values with shared disabled state; date/time columns switch at container breakpoint.
- **tree-select** (`tree-select.tsx:8-210`): selected hierarchical path, required/invalid/disabled, inherited disabled nodes; selected label truncates and option surface scrolls within viewport width.
- **favorite-toggle** (`favorite-toggle.tsx:6-33`): inherits Toggle pressed/disabled states; optional validated count and selected icon fill.
## Findings

At the time of the baseline static source review, no concrete defect was found. This is a provisional baseline; use the follow-up section below for the current runtime findings and diff review.

**Baseline counts:** 47 provisional static source passes; 0 source-level improve candidates; runtime state was then unverified for all 47. The later runtime/diff review below supersedes the ActionBar row and adds Menubar/Lightbox review outside the assigned inventory.

## Root runtime and current diff follow-up (2026-10-16)

This follow-up reviews the current diff in `packages/ui/src/design-modes.css`, `packages/ui/src/components/menubar.tsx`, `packages/ui/src/components/lightbox.tsx`, and `apps/docs/src/catalog.tsx`. Root runtime evidence supersedes the provisional ActionBar source-only PASS above.

- **ActionBar preview frame:** root runtime observed the selection frame switch from 16px to 0px padding when items were selected because the style depends on a transient `:has(...)`/surface state. Catalog line 2195 now marks the frame `data-surface="panel"`, matching the stable panel contract styled at `design-modes.css:803-813`. This preserves the panel geometry across the selection state. This is a confirmed improvement in the current diff.
- **Menu panel radius cascade:** the new role rule at `design-modes.css:745-748` intends `--navigation-radius`, but the generic overlay rule at `design-modes.css:435-441` has greater specificity because `:not([data-size="fullscreen"])` contributes specificity. Both rules are unlayered; therefore the generic `border-radius: var(--panel-radius, var(--radius))` wins over the new zero-specificity `:where(...)` role rule. Menu items at lines 750-762 do receive compact navigation geometry/state styles, but the popup panel itself may retain panel radius. Candidate fix: exclude `[role="menu"]` from the generic panel rule or raise the role rule specificity while keeping the Basic scope boundary. No product edit was made by this audit.
- **Menu selection and disabled semantics:** the new checked paint at lines 755-759 follows Radix `data-state="checked"` for menu checkbox/radio items and preserves each item's foreground class, including danger text. Highlight paint at lines 760-762 explicitly excludes `[data-disabled]`; component item styles in DropdownMenu/ContextMenu/Menubar already mark disabled items with `data-disabled` and suppress pointer events (`dropdown-menu.tsx:13-17`, `context-menu.tsx:13-17`, `menubar.tsx:87-91`). The CSS is within the non-Basic scope opened at line 667 and closed before subsequent global rules, so nested Basic descendants are excluded by the scope limit. Menubar root/trigger hooks at `menubar.tsx:21-29,44-56` map to the scoped surface and navigation-trigger styling; submenu content uses the same overlay-panel hook at lines 76-82 and 208-214.
- **Lightbox immersive geometry:** `lightbox.tsx:79-89` now passes `size="fullscreen"` through DialogContent for immersive mode. `dialog.tsx:39-43` gives that size viewport bounds and zero radius/border. This avoids competing custom dimensions while retaining frame mode's bounded variant. The full-screen selector exclusion at `design-modes.css:435` preserves this geometry; image styling remains limited to the `[data-slot="lightbox"]` descendants at line 901. No semantic or Basic-scope regression found in this diff.
- **Current follow-up status:** ActionBar = improve applied; menu panel radius = candidate cascade defect to address/verify; menu checked/disabled/scope behavior = source pass; Lightbox immersive = source pass. Root owns browser verification and product changes.
## Handoff

The source inventory baseline and the focused root-runtime follow-up are recorded separately. The R14 matrices remain initial-geometry evidence, not a full state matrix.
