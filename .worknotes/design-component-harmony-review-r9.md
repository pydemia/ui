# Component design harmony review R9

## Scope and method

Read-only source review of the frozen component styling changes in `packages/ui/src/design-modes.css`, the related component markup and `CodeEditorShell` sizing, and the nested Basic fixture in `apps/docs/src/design-qa.tsx`. Repository guidance and the design-mode contract were read first. No browser inspection, build, tests, or Git operations were performed; findings below are source-level conclusions.

## Actionable finding

### P2 — Flat CodeEditorShell still receives panel header/footer treatment

`packages/ui/src/design-modes.css:643-651` deliberately excludes `[data-ui="code-editor"][data-variant="flat"]` from the themed editor-shell surface. However, the following descendant rules at `665-674` apply unconditionally to every code editor: `editor-header` gets `padding: 16px var(--editor-inset)` and `background-color: var(--title-fill)`, and `editor-footer` gets panel-like padding and spacing. The component’s `flat` branch in `packages/ui/src/components/code-editor-shell.tsx:76-82` removes the outer panel surface and uses only a bottom border, while the catalog describes `panel` and `flat` as the two display variants (`apps/docs/src/catalog.tsx:6980-6982`). Consequently, switching to Flat still leaves a distinct title band and padded panel framing inside the editor, weakening the advertised flat distinction and producing a hybrid treatment.

Suggested correction: gate the panel header/footer styling under a non-flat editor ancestor, or add explicit flat descendant styling so the flat variant retains only the intended flat hierarchy. Check both with and without the optional description/error footer.

## Other requested areas

Static review found the code editor’s gutter and textarea use the same `1.5rem` line height and the same mode-driven block padding; the shell height calculation adds twice that padding around `rows * 1.5rem`, so the source declarations align. Grouped-button selectors join adjacent button borders and preserve the outside corners for both orientations. Field-frame selectors place the border, radius, focus outline, invalid border, and disabled opacity on the outer frame while clearing those treatments from the inner control. Filled and underline appearance selectors remain explicitly distinguished.

The `@scope` boundary excludes nested `[data-design]` scopes, including the Basic fixture in `apps/docs/src/design-qa.tsx:115-131`; this review did not identify a source-level rule crossing that boundary. These observations are not browser verification, and visual contrast/layout behavior remains unverified in a rendered page.

## Follow-up review of final adjustments

The previously reported P2 is resolved in the current source. `packages/ui/src/design-modes.css:676-677` now gives a flat CodeEditorShell a transparent header background and zero horizontal padding on its header/footer, while keeping the panel treatment under the `code-editor:not([data-variant="flat"])` selector. The remaining vertical spacing and title typography are consistent with a flat editor hierarchy; I found no source-level contradiction requiring another fix.

The latest FilterBar/QueryBuilder rule at `643-656` limits outer panel padding to `data-variant="panel"`, matching the same panel-only shell selector at `644`; inline/flat variants no longer inherit that panel inset. ColorInput now uses `data-ui="color-control"` for its hex text field and styles it only within the bounded `@scope` at `530-538` and `639`. The older unlayered generic input rules at `358-369` therefore do not match the hex field. Card/default Checkbox roots now have separate mode hooks at `719-720`; card relief/radius is limited to the card variant, with the default control retaining a compact radius.

I found no new actionable source-level regression in these adjustments or the requested compound-field, control-variant, editor-row, and button-group selectors. This remains a read-only source review: root’s in-progress Basic/nested-Basic parity checks and browser verification are not represented as completed by this report.

## Final theme adapter and disabled-frame review

Reviewed the final `packages/ui/src/components/foundation/theme-dom.ts` source and the updated disabled-frame selectors in `packages/ui/src/design-modes.css:585-586`.

The `font-size` value is selected by comparing the target element against `element.ownerDocument.documentElement`. This preserves a 14px document root (with an optional `--type-root-size` override) while regional scope/portal elements continue to use their resolved `--type-body-size`; using `ownerDocument` keeps the root check correct for an element belonging to a different document. The adapter already snapshots inline property values and priorities before applying tokens, and its returned cleanup restores the prior font-size in the same loop as the other inline properties. The change does not add module-level DOM access, and the React scope applies it from client effects, so the root-size branch introduces no SSR evaluation path. I found no source-level restoration or consumer-contract regression.

The disabled-frame selector now dims a field only when a descendant input or textarea is disabled. That avoids dimming a number field when only an increment/decrement button is disabled at its boundary; the follow-up selector restores the disabled input/textarea opacity inside a dimmed frame. I found no source-level issue in that narrowing.

This final source review adds no actionable finding. The parent-reported browser parity results remain external evidence and were not independently verified in this review.

## Responsive CSS follow-up

Reviewed the final responsive and documentation-wrapper changes only. The 96px tag-control minimum now targets `input[data-slot="field-control"]` inside the tags frame (`packages/ui/src/design-modes.css:619-624`), so it does not accidentally constrain button/action slots. The `max-width: 560px` custom-property overrides are nested in the non-Basic `@scope` and target `:scope` (`738-746`); these responsive properties are stylesheet-defined geometry variables rather than inline theme tokens, and the scoped declarations follow the mode defaults. A nested Basic scope therefore does not inherit the outer mode’s geometry override as its own declaration.

The docs wrapper reset at `apps/docs/src/styles.css:365-373` is limited to a direct `.preview-stage > .preview-stack` containing one of the listed editor/composer/panel/canvas components, and is itself under a non-Basic scope boundary. In the catalog, the matching BlockEditor preview explicitly uses `appearance="panel"`; the reset removes the docs-only decorative wrapper frame while the actual component remains responsible for its own surface. I found no source-level selector that strips a primitive’s own frame or crosses into nested Basic.

No actionable source-level regression found in this bounded follow-up. The reported 320/390px rendered results were not independently verified here.

## Cascade correction follow-up — code/composer controls

The earlier source review missed a real cascade defect that the Glass capture exposed. The unscoped generic field selector at `packages/ui/src/design-modes.css:359` places `:not([data-appearance="underline"])` outside `:where()`, so its specificity is one attribute `(0,1,0)`. The previous scoped `:where([data-slot="code-control"])` and `:where([data-slot="composer-control"])` had zero specificity; scope proximity could not make them beat the more-specific unscoped rule. As a result, the mode field border, radius, and shadow declarations could override the intended primitive resets for these controls.

The current source fixes only those two selectors, now plain `[data-slot="composer-control"]` at line 658 and `[data-slot="code-control"]` at line 681. Each has `(0,1,0)`, tying the generic selector; the component rule is scoped, so its finite scoping proximity beats the unscoped generic rule. This is a targeted tie that uses the already-required `@scope` boundary, not a broad specificity increase. Both selectors remain inside the non-Basic scope, whose `to ([data-design])` boundary keeps nested Basic controls outside the rule. No source-level regression is apparent in the correction, and the cascade defect is resolved in the current tree.

This supersedes the earlier blanket statement that the code/composer control reset had no issue. The reported 39-combination rendered result was not independently verified in this review.
