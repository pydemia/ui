# PRISM ground rules

Reference: PRISM-DEV, `skccmygit/skax-successionX-frontend` dev `7ecfc9af072d9f4aeb0f4d7706f16bd1a73f2ef9`. Observed 2026-10-03.

## Scope

Independent UI materials for AI-assisted frontend maintenance. Reproduce design, user interactions and feature purposes; API/auth/RBAC/persistence/LLM/ranking rules remain application responsibilities. Examples use synthetic names, companies and evidence.

## Color and typography

| Role | Value | Reference |
| --- | --- | --- |
| Primary | #2F548C | _variables.scss and deployed DOM |
| Secondary | #FA7C39 | _variables.scss and deployed DOM |
| Base | #FDFDFD | _variables.scss and deployed DOM |
| LNB | #F9FAFC | _variables.scss and deployed DOM |
| Panel | #EEF1F8 | _variables.scss and deployed DOM |
| Border | #E3E5E5 | _variables.scss and deployed DOM |
| Control border | #D4D8DD | _variables.scss |
| Text primary | #222222 | _variables.scss |
| Text sub / caption | #868686 / #9AA3AF | _variables.scss |
| Table header | #EEF2FA | _table.scss |
| ELP | #F4ECFA, #E5D9F2, #68127A | _badge.scss |
| s-ELP | #F6FCD6, #D2DAAA, #6A7B00 | _badge.scss |

Pretendard is verified in deployed computed styles. The standalone site uses official Pretendard 1.3.9 variable font (OFL-1.1); original uses static weights. Docs, embedded previews and SVG charts use the declared "Pretendard Variable" family through --font-ui; using only "Pretendard" would select a fallback. Font-metric equality with the original static font still requires comparison. Use 400 for body, 500 for supporting content, 600 for controls and sections, 700 for emphasized names/headings. General body is 14px; chat answer and criteria use 16px/1.6; micro badge uses 10px.

## Geometry

- Button large/medium/small/x-small heights: 40/32/28/26px. Padding 12px (x-small 8px). Radius 6px large, 4px other sizes. Icon-only widths follow 40/32/28/26px sizes; small uses radius 6px.
- Input medium/small: 32/28px, radius 6px, padding 12px horizontal. Preserve required, invalid, readOnly, disabled independently.
- Tag 21px/radius 4px, chip 22px/radius 4px, ELP 16px/radius 10px, count 14px.
- Avatar 40px; candidate photo 70px/radius 8px. Profile chip 30px (small 27px).
- Tabs line 44px with 24px gap; fill tabs use 32px triggers and top padding 14px.
- Table header padding 6px 10px; cells 10px; 14px type; neutral-200 row/column dividers. Keep native table and internal overflow rather than clipping content.
- LNB expanded/collapsed 280/72px, header 64px. Right profile panel 440px. Source content frame max 860px; standalone catalog layout is separate from product layout.
- Question bubble max 540px, padding 8px 16px, radius 20px 0 20px 20px. Composer radius 12px, text padding 16px, action bar 48px.
- Dialog radius 8px, title 18px/600, header/footer padding 20px, content padding 24px. Candidate and memo radius 12px/padding 16px.

## Interaction and ownership

Prefer pydemia/shadcn/Radix primitives for focus, keyboard and semantic state. Wrappers retain PRISM geometry. Do not recreate Material internals or backend hooks. Native buttons default to type=button. Icon-only controls have names. Labels and errors have stable associated IDs. Tabs use roving focus; dialogs contain focus, close with Escape and restore focus. Chat Enter sends, Shift+Enter adds a newline, composing IME never submits. Consumers clear a submitted draft only according to their own success policy.

Loading, empty, error and insufficient evidence are distinct. Assessment null remains null; displayed 0 is real zero. A candidate click or favorite toggle emits intent and does not compute any HR outcome.

## Extensions and explicit differences

The general pydemia catalog runs under the PRISM semantic token profile. These are additional functional components and are not claimed to have matching original PRISM geometry. Complex components require purpose-specific fixtures before production use.

- No source dark theme was found; standalone reference is light only.
- The 87 original vector assets preserve source artwork. The React adapter scopes SVG IDs per instance. CurrentColor, host placement and scaling need runtime comparison; retaining artwork alone does not prove page-level parity.
- Source minimum-width constraints can overflow mobile. Standalone table scroll, parent-width panel clamping and a container-aware Workspace navigation Drawer preserve function; these are explicit responsive adaptations. Workspace breakpoint defaults to 768px and can be configured. Resizing preserves consumer-owned drafts; growing from compact navigation closes the Drawer and focuses the header.
- Original caption colors can have low contrast on white. The shared semantic muted token is #626A75 for readable documentation; exact original caption is retained where referenced. Do not conflate accessibility adaptation with visual equality.
- PrismSelect and MultiSelect use shadcn/Radix Popover with original dropdown geometry. Values remain consumer-owned. Select name/required participate in native FormData and constraint validation. Invalid submission focuses the visible trigger. Uncontrolled form reset restores defaultValue; controlled values remain owned by the consumer. Custom business validation remains a host responsibility. Search inputs support IME and keyboard selection. DatePicker defaults to a calendar-only readonly field, with a 320px calendar, 36px circular day cells and year selection. Optional inputEditable enables text entry and strict date validation. Autocomplete freeSolo is opt-in; default mode commits known options only.
- PrismPanel is a nonmodal inline panel with close/expand intent callbacks. PrismSidePanel is a separate modal drawer adapter for contexts that require focus containment. Manual resizing is opt-in via resizable. Pointer drag, Left/Right (16px), Shift (50px), Home/End and double click share bounded controlled width intent. Compact parent containers use full width and hide the handle.

## Source ownership

PRISM component code is a design/behavior reference; independent implementations compose pydemia/shadcn primitives. The original vector artwork is retained separately to preserve the supplied design, with its owners and pinned revision documented in THIRD_PARTY_NOTICES.md. Portraits and source HR content are not published; all fixtures are synthetic. No artwork reuse license is inferred. Registry dependencies retain upstream MIT notices; Pretendard OFL is at /prism/fonts/LICENSE.txt. Installed prism.css imports the npm Pretendard variable font, so independent consumers do not depend on the catalog font URL. Registry vector installs also include PRISM_ASSET_NOTICES.md.

## Sizing extensions

Workspace height/minHeight and Panel width/defaultWidth/minWidth/maxWidth are consumer configuration. Width is clamped to its actual parent without overwriting a consumer preference. PDF viewer supports configurable height and manual zoom bounds; defaults stay 30–100 percent. Page/width fit uses client bounds minus one 16px padding on each side, and an enlarged canvas scrolls inside its own viewport. The Responsive catalog view uses a real 320–1200px iframe, so media/container queries run at the displayed width. It is not a screenshot scaled to look mobile.

Print previews retain the source 190mm width and 280mm minimum screen height. Print media removes that minimum height so short content does not create a blank trailing page. repeatHeader uses a table header group; host print settings still determine paper and margins. Headless Chromium Letter output verified a one-page short fixture and two-page long fixture with repeated headers and all 36 synthetic career rows. This does not verify every paper size or native print dialog.
