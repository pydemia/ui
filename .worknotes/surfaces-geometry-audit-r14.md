# R14 data/content/media/navigation/overlay/layout source audit

## Scope and evidence

Read-only source audit after the R13 Material fix, at the requested baseline `80ab6689` / snapshot 94. I inspected the UI component source, the design-mode radius and surface rules, the docs responsive recipes, and the catalog registrations for representative data, content, media, navigation, overlay, AI, and layout families. This note records source evidence; I did not edit product files, run a build, or inspect browser rendering. The root owner has browser and implementation ownership.

Catalog IDs checked directly against `apps/docs/src/catalog.tsx`: `dialog`, `command-palette`, `drawer`, `popover`, `calendar`, `image-cropper`, `avatar-uploader`, `conversation`, `prompt-input`, `calendar-scheduler`, `kanban`, `node-canvas`, `navigation-menu`, and `data-table`. Related source cross-checks included media/image, app-shell, data/chart surfaces, file-upload/dropzone, tree and navigation, editors, AI status/tool/reasoning, resizable-panels, and surface primitives.

## Actionable geometry gap

**Drawer panels have no mode-aware corner role.** `packages/ui/src/components/drawer.tsx:34-43` renders `data-ui="drawer-panel"`, chooses left/right/bottom placement, and has no radius utility. The only matching presentation rule in `packages/ui/src/design-modes.css:434-440` styles border width, overlay fill/image/filter, and shadow, but never sets `border-radius`. Thus drawers stay square in every non-Basic mode, while dialogs/popovers use the shared `data-ui="overlay-panel"` recipe at `design-modes.css:426-432` and receive the mode panel radius. This leaves a concrete variant gap for all three drawer sides. If visual review confirms that an exposed edge should follow the panel role, add side-aware exposed-corner radii: left/right drawers round only their interior-facing corners; bottom drawers round their top corners; retain flush viewport edges. The current component does not emit a side data attribute, so a CSS recipe needs that variant signal. Fullscreen dialogs correctly remain square by explicit `data-size="fullscreen"` exclusion and are an intentional exception.

## Responsive and role findings that should be preserved

- Data table has a dedicated `data-ui="table-frame"` wrapper with horizontal scrolling and `min-w-0` (`packages/ui/src/components/data-table.tsx:327-336`); the non-Basic surface recipe assigns the panel radius (`design-modes.css:1061`). This is a deliberate scroll frame, not evidence for flattening table corners.
- Calendar, calendar scheduler, Gantt, tree/navigation, and panel calendar-heatmap have named shell selectors that assign panel radius. Calendar cells/navigation controls use separate navigation/field radii. Preserve the split between shell and interaction geometry (`design-modes.css:653-662`, `750-778`).
- Kanban intentionally scrolls its columns horizontally (`kanban.tsx:206-208`); each column has its own panel surface (`:214-220`). Do not treat the horizontal strip as accidental page overflow or round its cards with a generic clamp.
- Image and cropper preview surfaces are tagged `data-surface="media"`; the media recipe applies the mode panel radius, while placeholders inherit their frame (`image-cropper.tsx:273-290`, `design-modes.css:858-859`). Circular avatars, chart marks, slider tracks/thumbs, and progress bars retain their own shape roles.
- AI/content panels expose variant state or `data-surface` where needed: Conversation is panel-backed; PromptInput has a composer shell; ToolCall, Reasoning, and AgentStatus opt into card/panel variants. Preserve their compact reading planes and controls instead of applying panel radius to every nested element.
- Material panel, control, navigation, and selection roles remain intentionally distinct after R13: panel is 24px, base is 12px, control is 999px, and selected navigation rows are 12px. Short action pills and schedule bars may remain pill-shaped. Basic is excluded from the design-mode scope; keep its baseline geometry. Preserve Drawn asymmetric corners and square/hard-edged profiles.

## Render follow-up

The drawer gap is source-confirmed but its visual severity depends on the expected flush-edge treatment. The root owner should inspect left, right, and bottom drawer variants at narrow and desktop widths before choosing the side-aware CSS. No source-backed blanket radius correction surfaced in the sampled component families. The R13 source audit already found no second mode-level 999px panel leak; this audit does not expand that into proof that every interactive state in all 144 catalog entries was visually rendered.
