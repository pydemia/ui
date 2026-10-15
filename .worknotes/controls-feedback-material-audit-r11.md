# Controls and feedback material audit R11

## Scope and method

- Read-only source audit of the assigned 77 catalog entries in `.worknotes/browser-evidence/component-material-r11/inventory.json` on `codex/design-navigation-schedule-harmony` at source HEAD `742e4574805d29c5473a9b6463c61c9d03ae7941`.
- Inspected the shared material adapter in `packages/ui/src/design-modes.css`, component source roots/painted subparts, and existing contract tests where relevant. This is source evidence; no new browser capture or rendered 39-mode assertion was made in this leaf task.
- Verdicts: **Adapted** means the current generic field/control/overlay/navigation/schedule adapter reaches the paint or the implementation already uses theme tokens. **Semantic paint** means the color/state intentionally communicates meaning and should be retained; it can coexist with an uncovered material seam. **Seam** means a structural painted surface has no reliable component/slot hook for mode-specific finish. A seam is a recommendation, not an implemented change.
- No product source, build output, Git state, registry, or browser state was changed. Only this work note was added.

## Per-ID checklist

### Actions (8)

| ID | Verdict | Source observation |
|---|---|---|
| `button` | Adapted | `data-ui="button"`; shared control image, border, radius, relief, press and focus tokens apply. Keep ghost variant light. |
| `icon-button` | Adapted | Delegates paint and state to Button; no separate surface contract needed. |
| `button-group` | Adapted | `data-ui="button-group"`; shared adapter joins adjacent button borders/radii and suppresses inner duplicate relief. |
| `copy-button` | Adapted | Uses Button for interaction; confirmation text remains muted status copy. |
| `action-bar` | Hook added | Root bar is marked `data-ui="action-bar" data-surface="panel"`; selection count is `surface-meta`. |
| `toggle` | Adapted | `data-ui="toggle"`, pressed/on shared selectors apply mode control and selected relief. Preserve `aria-pressed` and disabled. |
| `toggle-group` | Adapted | Shared group and item selectors style its container and selected items. |
| `favorite-toggle` | Semantic paint | Button state is exposed through `aria-pressed`; keep the favorite/accent signal and use Button’s control finish. |

### Inputs (14)

| ID | Verdict | Source observation |
|---|---|---|
| `input` | Adapted | `data-ui="input"` receives scoped field fill, border, radius, focus, disabled, invalid, and appearance treatment. |
| `search-input` | Adapted | Composition uses field/input hooks; search controls wrap and follow the shared field gap. |
| `input-group` | Adapted | Field frame/addon/control slots share the field material adapter. |
| `number-input` | Adapted | Uses the shared Field and button/input controls; preserve numeric stepping contract. |
| `tags-input` | Adapted | Uses `field-frame[data-field="tags"]`, field chips, and nested control selectors. |
| `color-input` | Semantic paint | Field shell uses mode variables; the swatch is the user-selected color and must retain its literal data color. |
| `password-input` | Adapted | Shared input selector and password action placement are covered. |
| `pin-input` | Adapted | Field frame and `data-slot="pin-cell"` get shared focus/material styling. |
| `rating` | Semantic paint | Selected stars/score use accent as rating state; keep native state contrast and keyboard labels. No shell material seam established by source. |
| `label` | Adapted | Text-only label; inherits type tokens and does not introduce a painted surface. |
| `textarea` | Adapted | `data-ui="textarea"` receives the field adapter and sizing. |
| `affixed-input` | Adapted | Composes Field and Input; shared field/addon slots cover its painted parts. |
| `field` | Adapted | `data-ui="field"` plus field-frame slots cover control, help, error, disabled, and focus treatments. |
| `editable` | Adapted | Uses shared Input/Button when editing; read view is unpainted text. Pending/error remain status semantics. |

### Selection (13)

| ID | Verdict | Source observation |
|---|---|---|
| `checkbox` | Adapted | `checkbox-control` card/default selectors supply mode shape/relief; checked and disabled semantics remain native. |
| `native-select` | Adapted | `data-ui="native-select"` receives shared field treatment and retains native selection/keyboard behavior. |
| `switch` | Adapted | Native role/state and shared switch-thumb selector; preserve checked/disabled state and focus ring. |
| `radio-group` | Adapted | Card radio controls have selected-state field relief; accent remains the checked indicator. |
| `segmented-control` | Adapted | Root/item selectors apply the group shell and selected decoration. |
| `slider` | Adapted | Shared slider track/thumb slots cover mode finish; value and focus remain native. |
| `range-slider` | Adapted | Same track/thumb adapter; retain the distinct low/high values and keyboard semantics. |
| `select` | Adapted | Trigger uses field selector; popup uses `overlay-panel`; selected item state remains accessible. |
| `combobox` | Adapted | Trigger is a field; popup uses `overlay-panel`, options expose active/selected and disabled states. |
| `autocomplete` | Adapted | Shared field and `overlay-panel` paint; preserve active option, error, empty and loading announcements. |
| `multi-select` | Adapted | Shared trigger/overlay materials; chips and option checkbox state use surface/accent tokens. |
| `transfer-list` | Hooks added | Root is `data-ui="transfer-list"`; each fieldset is `data-surface="well"` and each item label is `transfer-option`. Native checked/disabled state is preserved. |
| `tree-select` | Adapted | Trigger uses tokenized field styling and popup contains Tree; the nested Tree’s nonembedded/embedded material path applies. Preserve tree keyboard/selection behavior. |

### Date & time (7)

| ID | Verdict | Source observation |
|---|---|---|
| `calendar` | Adapted | R10 provides month caption, nav, date cell, selected/range/today/focus/disabled selectors and schedule tokens. |
| `date-picker` | Adapted | Field trigger plus the R10 Calendar and shared overlay panel. |
| `month-picker` | Hooks added | Trigger carries `data-ui="month-picker"`/`period-trigger`; existing overlay panel also carries `period-panel`; month cells carry `period-option` and retain `aria-pressed`. |
| `year-picker` | Hooks added | Trigger carries `data-ui="year-picker"`/`period-trigger`; existing overlay panel also carries `period-panel`; year cells carry `period-option` and retain `aria-pressed`. |
| `date-range-picker` | Adapted | Shared field trigger, overlay and R10 Calendar; range endpoints and middle-day semantics stay distinct. |
| `time-picker` | Adapted / no change | The source is a borderless fieldset containing NativeSelect controls; there is no custom time-option grid. NativeSelect already receives the shared field adapter, so no extra hook is needed. |
| `date-time-picker` | Adapted | `data-ui="field"` wraps shared date/time fields; the calendar child uses R10 adapter. |

### Overlays (11)

| ID | Verdict | Source observation |
|---|---|---|
| `dialog` | Adapted | `overlay-panel` receives the scoped surface, image/filter, border, radius and shadow tokens; overlay scrim is semantic. |
| `command-palette` | Hooks added | Listbox carries `data-ui="command-palette"`; options carry `command-option` and preserve selected/disabled/active-descendant state. |
| `drawer` | Adapted | `drawer-panel` has a dedicated shared adapter; retain side/height and focus behavior. |
| `dropdown-menu` | Adapted | Content/subcontent use `overlay-panel`; Radix highlighted/disabled and checkbox/radio indicators preserve native state meaning. |
| `context-menu` | Adapted | Same overlay panel and Radix item state path as DropdownMenu. |
| `tooltip` | Semantic paint | Tooltip is an intentionally inverted, compact label surface; preserve its foreground/background contrast. No component root hook is needed unless source inspection identifies a separate decorative layer. |
| `accordion` | Hooks added | Root/item/trigger/content carry their individual `data-ui` names; root forwards its ref to the Radix primitive. Existing state/keyboard behavior remains in the primitive. |
| `collapsible` | Seam | No component hook; disclosure is currently unpainted text. Add a root/trigger/content hook only if a themed control affordance is intended; keep its current low-chrome disclosure behavior. |
| `popover` | Adapted | Portal content uses `overlay-panel` and theme surface tokens. |
| `hover-card` | Adapted | Portal content uses `overlay-panel` and theme surface tokens. |
| `alert-dialog` | Adapted | Uses shared `overlay-panel`, heading, and semantic scrim. Keep action/status semantics. |

### Feedback (9)

| ID | Verdict | Source observation |
|---|---|---|
| `alert` | Hook added / semantic paint | Root carries `data-ui="alert"`, existing variant/appearance attributes, and `data-surface="status"` only for nonplain appearances. Severity fills/inks/borders remain unchanged. |
| `progress` | Adapted | Shared role=progressbar selector decorates the indicator; progress color communicates completion and should remain. |
| `skeleton` | Semantic paint | `border/60` pulse is a loading placeholder; preserve motion-reduction behavior. No painted panel wrapper is implied. |
| `empty` | Hook added | Root carries `data-ui="empty"`; panel marks `data-surface="panel"`, dashed marks `drop-target`, and plain has no surface marker. |
| `result-state` | Adapted | Composes Empty and semantic status content; inherits Empty’s current variants. If Empty gains a panel hook, ResultState benefits without a separate adapter. |
| `spinner` | Semantic paint | Motion/size variants do not create a surface; preserve animation and reduced-motion handling. |
| `toast` | Hook added / semantic paint | Root carries `data-ui="toast"`, existing variant and `data-surface="status"`; header/title/meta/close action carry surface slots. Severity edge colors remain. |
| `notification-center` | Hooks added / semantic paint | Root exposes appearance and panel surface; header/title/meta/actions and notification rows have hooks. Unread accents and pressed filter states remain. |
| `response-feedback` | Semantic paint | Selected up/down uses accent and Button’s outline; preserve polarity and pressed-state semantics. |

### Navigation (8)

| ID | Verdict | Source observation |
|---|---|---|
| `breadcrumb` | Adapted / preserve | Existing reviewed appearance is praised; keep unchanged. |
| `tabs` | Adapted | Shared tabs-list/tab selectors support contained controls; line variant remains its own visual language. |
| `tree` | Adapted / preserve | R10 adds scoped root/row/selected/focus/disabled/branch treatments; preserve Basic rail and avoid new selection stripes. |
| `tree-nav` | Adapted / preserve | R10 row, selected, disclosure and focus treatments; retain current tree navigation contracts. |
| `navigation` | Adapted / preserve | R10 covers global/side/bottom nav, current links, filled and dock variants. Keep public link semantics and selected accent surface. |
| `anchor-nav` | Adapted / preserve | R10 row/current/focus treatment; preserve the praised/approved navigation behavior and current-location state. |
| `navigation-menu` | Adapted | Shared navigation-menu container/trigger selectors and `overlay-panel` content cover the painted parts. |
| `menubar` | Adapted | Root/items use theme tokens and dropdown/submenu panels use `overlay-panel`; preserve highlighted, disabled, checked/radio and keyboard states. |

### Workflow (7)

| ID | Verdict | Source observation |
|---|---|---|
| `calendar-scheduler` | Adapted / preserve | R10 maps schedule header, agenda, events, cell fill, borders and hover to schedule/navigation tokens. Preserve event status colors and interaction. |
| `stepper` | Hooks added / semantic paint | Standalone root carries `data-ui="stepper"`; marker and connector carry slots. Current/completed/error paint and `aria-current="step"` remain. |
| `form-wizard` | Adapted / preserve | Existing `data-ui="form-wizard"` maps to shared editor/panel tokens; user-approved/praised design stays unchanged. |
| `timeline` | Semantic paint / preserve | Existing presentation is praised; tone/status and chronology are meaningful. Keep unchanged unless a separately evidenced structural surface is found. |
| `kanban` | Hooks added | Root carries `data-ui="kanban"`; columns are panel surfaces, cards are row surfaces, empty columns are drop targets, and column header/meta and move actions carry surface slots. Drag/drop/focus/announcement behavior remains. |
| `gantt` | Adapted / preserve | R10 adds schedule root/header/label/track/bar/progress/selection/action hooks; preserve task/status colors, selection and range behavior. |
| `node-canvas` | Adapted | Root is included in shared editor shell; header/footer/editor-pane slots map to shared editor tokens. Keep node/data colors and controls semantic. |

## Prioritized recommendations for the shared owner

1. **High: connect the added hooks in shared CSS.** The follow-up added hooks to the identified painted seams: ActionBar, TransferList, MonthPicker, YearPicker, CommandPalette, Accordion, Alert, Empty, Toast, NotificationCenter, standalone Stepper, and Kanban. TimePicker is already covered through NativeSelect and was left unchanged. These markers currently have no new CSS in this leaf task.
2. **Use existing variables before introducing new mode vocabulary.** Reuse `--overlay-fill/image/filter`, `--surface-fill/image`, `--panel-radius-material`, `--card-decoration`, `--field-fill/image/decoration/radius`, `--control-image/decoration/radius`, `--selection-decoration/radius`, `--navigation-fill/hover-fill/selected-fill`, `--title-fill/ink`, and `--panel-border-style`. Keep additions scoped in the nearest non-Basic ThemeScope, as R10 does.
3. **Preserve meaning and interaction contracts.** Status colors (alert severity, toast severity, unread state, workflow errors), data/user colors, checked/selected/current states, disabled opacity, and focus indication stay visible. Selection should use surface/ink/weight/relief; do not add left-edge selection rails. Preserve native/radix keyboard and ARIA contracts and existing event/drag behavior.
4. **Keep low-chrome components low-chrome.** Labels, spinners, skeletons, inline feedback, Breadcrumb, FormWizard, Timeline and Thread need no extra panel wrapper or ornamental card solely to make the theme visible. Exclude Stepper embedded within FormWizard from root-owned Stepper decoration. Preserve praised Breadcrumb/FormWizard/Timeline/Thread and Basic/PRISM.

## Handoff limits

This note is a bounded source audit and hook implementation record. It does not claim rendered cross-mode verification for these 77 items, and it does not change the root-owned shared CSS. After connecting the hooks to scoped material, verify representative status/current/selected/focus/disabled/keyboard states and nested Basic parity.

## Hook implementation handoff

The follow-up source-only change added the requested semantic attributes on actual painted seams. ActionBar now marks its bar as a panel; TransferList marks its field wells, titles, and item options; MonthPicker/YearPicker expose trigger/panel/option and panel header/title/action slots while retaining the existing overlay hook; CommandPalette exposes its option list, title, and rows; Accordion exposes root/item/trigger/content hooks; Alert/Empty/Toast expose their surface and existing status variants; NotificationCenter exposes its panel, header/title/meta/action and row hooks; standalone Stepper exposes root/marker/connector hooks; Kanban exposes its root, panel columns, drop target, card rows and controls. TimePicker was left unchanged after confirming it has no custom option grid. These markers do not implement CSS or change behavior. Browser verification and mode styling remain with the root owner.
