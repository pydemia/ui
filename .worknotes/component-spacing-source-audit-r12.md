# Component example spacing source audit R12

## Scope

Read-only source audit at baseline `b496b8ca0cebadcea4a4fc407d85dfa07661d829`. Read `AGENTS.md`, R12 kickoff, and R11 source/material handoff notes. Inspected the catalog stage, docs CSS, generic mode surface/header selectors, and panel/layout component owners. No product, CSS, build, Git, or browser actions were performed. This note is the only file written by this audit.

## Prioritized findings

### P1 — The docs stage decorates every direct preview child and replaces its own padding

`apps/docs/src/styles.css:159-160` sets `padding: 18px`, a border, radius, background, filter and shadow on `.preview-stage > *`. The catalog mounts each `selected.preview()` directly under that stage (`apps/docs/src/main.tsx:380`). The docs stylesheet imports Tailwind before its own rules (`apps/docs/src/styles.css:1-3`) and is imported after design-modes in `main.tsx:20-21`; the direct-child selector has the same class specificity as a component padding utility and is later in the cascade. Therefore a direct preview component's own root padding can resolve to 18px regardless of its `p-*` contract. The broad selector also adds a demo frame to the component itself, making the displayed outer inset depend on whether its preview function returns a fragment/component or a wrapper div.

Concrete unwrapped case: `ArtifactViewerPreview` returns `ArtifactViewer` directly (`apps/docs/src/catalog.tsx:520-527`). The component already owns a panel root and separately padded title, controls, and reading body (`packages/ui/src/components/artifact-viewer.tsx:108-138, 164-170`). The stage adds a second 18px root inset around these internal insets. `CodeBlockPreview` is another direct-root candidate; verify its exact rendered root before changing it.

Owning-layer correction: in docs only, restrict the demo frame/decorator to an explicit preview scaffold/wrapper class. Do not apply it to arbitrary direct component roots. Keep stage canvas padding as the stage's own responsibility. Review any fragment preview so each intended preview group receives a deliberate scaffold.

### P2 — Mode panel paint intentionally does not supply body padding

The shared adapter at `packages/ui/src/design-modes.css:785-795` paints `[data-surface="panel"]` with radius, border, fill, filter and shadow but assigns no padding. That is the right generic boundary: many panels already own different content insets, and blanket padding would damage data/editor layouts. Source spot-check of the explicit panel owners found body/header spacing already specified by the component: Board header/rows (`board.tsx:48-73`), MasterDetail list/header/detail (`master-detail.tsx:124-203`), ResizablePanels panes (`resizable-panels.tsx:105-106, 193-195`), chart figures (`data-chart.tsx:356-372`, `scatter-chart.tsx:174-180`; same `p-[var(--space-4)]` pattern in the chart-family sources), ArtifactViewer (`artifact-viewer.tsx:114-138, 164-170`), and CodeBlock/Snippet header and reading plane (`code-block.tsx:46-68`, `snippet.tsx:17-35`). I found no source-backed case in this pass where a panel's actual content body is flush solely because the generic mode adapter lacks padding.

Owning-layer correction: do not add padding to the generic `data-surface="panel"` selector. If runtime evidence identifies an actual flush body, add the inset to that component's body slot/variant. The docs stage decorator above is currently a more concrete source of inconsistent external insets.

### P3 — Header padding is local and should stay aligned to each panel's structure

The shared `surface-header` rule supplies a 12px/16px baseline (`design-modes.css:813-826`), while component utility classes own more specific spacing contracts in normal CSS. In the inspected examples, headers either carry explicit padding or are intentionally flush against a surrounding content inset: Board header is edge-aligned while rows have their own inset; Kanban column headings use a targeted negative margin to align with the column frame (`design-modes.css:884`); MasterDetail headings and list rows each own their insets. A rule that pads all descendants or grid children would double-inset these cases. Grid children stretch to their track width by default; that alone is not evidence of a spacing defect.

Owning-layer correction: adjust only an identified header slot whose own component lacks appropriate padding. Retain flush table headers, schedule axes, editor panes, and other edge-aligned structural headers.

## Already balanced / intentional

- `AppMain`, inset/attached `AppSidebar`, `AppBottomPanel`, and floating panel provide explicit `space-*` padding; mode CSS preserves or tokenizes those layouts (`app-shell.tsx:74-103, 124-154`, `design-modes.css:487-489`).
- Board, MasterDetail, ResizablePanels and panel chart bodies have explicit internal spacing; their nested panels do not need a second universal padding layer.
- Code/content reading planes own their insets. Tables, chart axes, calendars and schedules retain flush grid/axis geometry by design.
- Plain/flat variants and plain semantic groups should not acquire panel-body padding merely because they contain a `div` or grid.

## Limits and handoff

This is source evidence only: no browser measurement or rendered comparison was run. Root owns the actual preview review and any CSS/source change. Start with removing arbitrary direct-child decoration from preview roots, then inspect representative fragment, direct component, and wrapper previews before deciding whether any component-specific internal inset is missing. Do not extrapolate this finding into universal padding on all 144 components.
