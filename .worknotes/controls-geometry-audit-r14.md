# R14 controls/forms/editors geometry source audit

- 기준: main `80ab668902c7a194e1334942172b4b3c4b48f850`, snapshot94. R13 notes establish Material `--radius:12px`, `--control-radius:999px`, `--selection-radius:12px`, `--field-radius:12px 12px 3px 3px`, and Drawn panel radius `12px 6px 14px 8px`.
- 범위: `packages/ui/src/design-modes.css`의 control/field/selection/editor role rules와 해당 selector를 내보내는 UI components 및 docs catalog caller를 source-only로 확인. Browser, build, Git, and product files were not touched.
- 결론: 두 개의 직접 근거가 있는 geometry defects를 기록한다. 그 외 inspected token paths distinguish action, field, selection, and panel geometry; Basic remains outside design adapter scope. 이번 audit는 컴포넌트 모든 상호작용이나 런타임 viewport를 검증하지 않는다.

## Findings

### 1. Vertical ButtonGroup inherits the short-action 999px pill radius

- Evidence: `design-modes.css:143-149` assigns Material `--control-radius:999px` and separately defines `--selection-radius:12px`. The shared `:where([data-ui="button-group"])` rule at `design-modes.css:1087` applies `border-radius:var(--control-radius)` to every orientation. At `1098-1100`, the first and last buttons inherit the group's end radii for vertical stacks.
- A real vertical use exists in `apps/docs/src/catalog.tsx:598-607` (`ButtonGroup label="문서 작업" orientation="vertical"` with Preview/Export actions). The component emits `data-orientation` and uses `w-fit max-w-full` in `packages/ui/src/components/button-group.tsx:22-44`; the CSS adapter has no orientation-specific root radius.
- Effect: Material vertical button stacks receive a capsule-shaped outer shell and capsule ends, even though the same mode explicitly separates selection/container geometry from short action pills. Clay also sets `--control-radius:999px` (`design-modes.css:167-175`), so the same selector affects vertical groups in Clay.
- Recommendation: preserve the horizontal grouped-action pill if that is the chosen visual treatment; override only `[data-ui="button-group"][data-orientation="vertical"]` to an appropriate finite group radius (`--selection-radius` or a field/group token), allowing the existing child `inherit` rules to follow it. Keep Basic unchanged through the existing design scope.

### 2. PinInput's radius cap is invalid for Material's four-corner field token

- Evidence: Material sets `--field-radius:12px 12px 3px 3px` at `design-modes.css:149`. `design-modes.css:995-999` sets square pin cells' radius with `border-radius:min(12px, var(--field-radius))`. CSS `min()` takes math values, while substituting this four-value border-radius list makes the argument invalid; the declaration therefore cannot cap or apply Material's field geometry. The preceding shared pin-cell rule at `929-935` also applies `var(--field-radius)`, but the later cap declaration is the final matching source declaration.
- The component uses this slot for each visual code cell (`packages/ui/src/components/pin-input.tsx:90-112`), and catalog coverage renders six cells grouped 3+3 (`apps/docs/src/catalog.tsx:861-885`). The base `rounded-sm` utility is present too, so exact browser fallback appearance depends on the generated cascade; source evidence establishes the invalid adapter declaration, not a measured rendered defect.
- Recommendation: use a single-value field/cell token or an explicit four-corner cap that remains valid CSS (for example, cap each corner separately). Do not reuse `--control-radius` for the cells. Preserve intended circular avatar/marker shapes and leave Basic outside the adapter.

## Inspected token paths and preserved geometry

- Button actions: `--control-radius` feeds ordinary `data-ui="button"` at `design-modes.css:363-371`; standalone buttons, carousel indicators (`880`), file-selector actions (`885`), and scroll thumbs (`887`) are short actions/marks. Their pill or track geometry is intentional and should remain separate from compound group geometry.
- Fields and multiline controls: `input`, `textarea`, `select-trigger`, `native-select` use `--field-radius` (`385-392`, `894-909`). Textarea has an explicit min-height and vertical resize (`903-906`). InputGroup's wrapper/control/addon treatment is in `929-980`; the textarea receives top-only inherited corners (`960-965`). No source evidence of a control pill leaking onto multiline surfaces was found.
- Selection: contained Tabs, ToggleGroup, and SegmentedControl wrappers use `--field-radius` (`1063-1075`) and children use `--selection-radius`. Material overrides selection radius to12; Clay provides its own16px selection token. This separation is correct. Radio/checkbox cards use field radius (`1081-1084`); compact checkbox default remains a scalar cap.
- Editors and compound forms: prompt input, markdown/code editors, panel BlockEditor, FormWizard, ApprovalCard, NodeCanvas, panel FilterBar, and panel QueryBuilder receive panel radius (`design-modes.css:1010-1045`). Editor blocks/query groups use field radius (`1056-1060`). No `--control-radius` assignment was found on multiline editor shells.
- Multi-value preservation: Drawn's asymmetric control radius (`design-modes.css:303-310`) is consumed directly by button controls; its panel radius remains asymmetric. The proposed PinInput correction should retain these deliberate shapes rather than normalize every mode.
- Responsive source review: the audited fields set `min-width:0`, `max-width:100%`, wrapping or horizontal scrolling where visible in component/CSS sources. No additional source-only overflow defect was strong enough to report without runtime evidence.

## Audited component IDs / coverage

- Direct component/caller review: `button-group`, `pin-input`, `input-group`, `tags-input`, `affixed-input`, `textarea`, `field`, `tabs`, `toggle-group`, `segmented-control`, `query-builder`.
- Selector/token source coverage in `design-modes.css`: `button`, `input`, `textarea`, `select-trigger`, `native-select`, `field-frame`, `field-chip`, `pin-cell`, `color-input`, `password-input`, `prompt-input`, `markdown-editor`, `code-editor`, `block-editor`, `form-wizard`, `approval-card`, `node-canvas`, `filter-bar`, `query-builder`, `tabs-list`/`tab`, `toggle`/`toggle-group`, `segmented-control`/`segment`, `radio-control`, `checkbox-control`, `button-group`, `carousel-indicator`, file-selector button, and `scroll-thumb`.
- Related catalog IDs checked for inventory/callers: `search-input`, `number-input`, `color-input`, `password-input`, `checkbox`, `radio-group`, `native-select`, `select`, `combobox`, `autocomplete`, `multi-select`, `prompt-input`, `tabs`, `markdown-editor`, `editable`, `form-wizard`, `filter-bar`, `query-builder`, and `block-editor`.

## Handoff

- Root owns any implementation, runtime/browser validation, build, Git, release, and user-facing handoff. This note is the only file created by this audit.
- Runtime fallback/cascade for the invalid PinInput declaration and visual impact of the vertical group radius remain unmeasured; verify these in the product browser if implementing the recommendations.
