# Joined row corner audit R19

Date: 2026-10-16
Scope: read-only source audit of `packages/ui/src/components` and
`packages/ui/src/design-modes.css` for joined row backgrounds with per-row
corner radii. No product files, build, Git, or browser were touched.

## Primary matches

`design-modes.css:896-904` styles `[data-slot="surface-row"]` on hover and
selected states. The selected-state rule at `:897-903` assigns
`border-radius: var(--navigation-radius)` to each selected row. This hook is
used by exactly two components:

- `components/board.tsx:46` is the rounded panel. It renders its heading at
  `:48-51`, then a `ul.divide-y` whose children are full-width
  `button[data-slot="surface-row"]` at `:58-98`. The selected button fills the
  entire row at `:73-75`. Siblings touch at the dividers, so the selected
  button's rounded corners create an inset pill/card inside one continuous
  list. The panel does not currently set `overflow-hidden`; a selected final
  row can therefore paint square into the panel's bottom outer corners.
- `components/master-detail.tsx:102` is the rounded, clipped panel; its list
  pane has a header at `:117-123` and a `ul.divide-y` with full-width selected
  buttons at `:130-174`. The same selected row radius is visible against
  adjacent rows. The panel already clips overflow (`:105`), preserving its
  outside corners. The details pane is a separate surface at `:176-202`.

Both rows also have a base hover class in JSX. The non-Basic scoped CSS applies
the row hover fill; selected rows additionally get selected typography and
shadow. The style rule lives inside
`@scope ([data-design]:not([data-design="basic"])) to ([data-design])`
beginning at `design-modes.css:842`, so Basic mode does not receive this
theme-level radius or selected shadow. Any fix should remain inside this
existing scope and respect nested `[data-design]` boundaries.

## Related patterns and boundaries

- `components/tree.tsx:286-300` uses a rounded `tree-row` with hover and
  selected fill. It is intentionally an inset tree option: tree rows are
  indented and have `margin-block: 2px` in `design-modes.css:702`; selected
  state comes from the enclosing treeitem. Keep this radius.
- `components/tree-nav.tsx:152-161` rounds navigation links and gives them
  hover/current-page fill. `design-modes.css:669-686` applies a panel inset,
  navigation gap, and mode-specific navigation radius; these are separate
  navigation options. Keep the radius.
- `components/accordion.tsx:20-64` exposes contiguous disclosure items.
  `design-modes.css:927-930` gives every trigger a field radius and hover/open
  fill, so it is a secondary candidate for visual review. It is not using
  `surface-row`, and expanded content changes the item's overall height.
  If addressed, preserve the trigger's keyboard focus state and keep
  `accordion-content` padding/content outside any trigger-only corner reset;
  do not round or square the entire expanded item indiscriminately.
- `components/notification-center.tsx:162-174` uses full-width list rows,
  but the row element's unread marker/background represents notification
  state and `design-modes.css:896` only changes its hover fill. It does not
  receive the selected-row radius rule, so there is no matching corner
  mismatch in this source.
- `components/data-table.tsx:417-520` has selected records represented by
  checkboxes and an action bar, not full-row selected backgrounds. Expanded
  detail rows use their own `bg-surface-subtle`. `design-modes.css:1114`
  rounds the `table-frame` container; do not apply list-row corner selectors
  to `tr`/`td` or alter table-frame corners. Native table border painting and
  `border-collapse` also make table-row radius behavior a separate concern.
- `components/item-list.tsx:100-151` has divider-separated rows, but each
  `li` is inset by panel padding and only a title link is interactive; rows
  have no full-row hover/selected background. It is not the same case.
- `components/calendar-scheduler.tsx:236-260` applies a radius to individual
  schedule events that occupy an agenda list. Events are independent entries,
  and the slot also styles calendar bars elsewhere; preserve its radius.
- Autocomplete/combobox/select/command/transfer options are padded inside
  bordered popover/list surfaces and have list-option semantics. They are
  inset independent choices, not full-width rows flush against panel edges;
  preserve their radii.

## Minimal implementation direction

The narrow shared hook is `surface-row`, but a global `border-radius: 0` on
all selected rows would also flatten any future standalone use of that slot.
Prefer marking the two contiguous list groups or their rows explicitly (for
example a `data-row-layout="joined"` hook on the two list roots), then scope
the selected background radius behavior to those joined rows. Keep the panel
radius and the inherited header top corners. Ensure the final row's painted
background stays clipped to the panel's outer bottom corners; Board currently
lacks the clipping already present on MasterDetail. If clipping the panel,
check focus-visible outlines at the first and last row so clipping does not
hide keyboard focus.

If the intended rule is group-edge rounding, use structural list-edge
selectors (first/last `li`), not visual row height assumptions: Board and
MasterDetail row heights vary with title/summary/meta wrapping, and MasterDetail
items may have descriptions. Avoid selectors based on a fixed height or
position. Keep rounded independent options and nested Basic modes unchanged.

## Evidence limit

Findings are source-based only; this audit did not inspect rendered pixels.
The owning agent should verify the actual selected first, middle, and final
rows at multiple widths, including long wrapped entries and keyboard focus.
