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

## Leadership summary

The local dev revision `27c4fdbf3e73234b7ab5c46e379a04d083c12df8` changes the summary to a blue type tag, a bold summary and a separate explanation below a divider. `PrismLeadershipPieSummary.title` maps to `summary.title`; `description` maps to `summary.content`; `detail` maps to `summary.description`. Whitespace-only detail adds no divider. Detail alone is information, including when all percentages are missing or zero. The host supplies the values and interpretation.

The outer box uses 16px padding/gap and a 12px radius; its chart/comment row uses a 20px gap. Summary text is 14px/700/#222222; detail is 14px/400/#363636 with preserved line breaks. The type tag reuses the shared blue tag. The divider is 1px/#E3E5E5. Ordered 지·덕·용 colors are #327BB7/#42938A/#DDB77D. At 660px the caption spans stack; the independent component also stacks the main row at 480px and wraps type labels there without dropping detail. At wider sizes `wrapTitle` opts into multiline type labels; default tags keep the source 21px height.

Print uses 8pt padding/gap/radius, an 80pt minimum height, a 20pt main-row gap, a 2pt chart gap and a 6pt comment gap. Caption, summary and detail are 10pt. The default tag uses a 15pt height, 3.5pt 4pt .5pt padding, a 4pt radius and 8pt/11pt text. Full print text is the default. The optional reference limits shorten title/summary in a copied display model and retain all detail, matching the current source mapping. These rules were checked against local source; current deployed revision binding, rendered comparison and A4 pagination remain unverified.

## Admin account forms

Local dev `27c4fdbf` uses the seven-field `PrismUserAccountDraft`: email, lastName, firstName, companyId, team, roleCode and companyGroupId. The account recipe is selected by roleCode. Its company is optional; create email defaults to the source @sk.com rule. Detail locks email while names, company and team stay editable. initialValue or the first controlled draft supplies the dirty baseline, including create mode. Valid creation does not imply dirty cancellation. onCancel receives dirty; onSubmit receives a copied, trimmed public model with the group omitted only for a known role that does not require one. Unknown role metadata never erases a stored group. The older roleId/division registration and three-field models remain available.

Map source role_code/role_name/requires_company_group to option value/label/needsCompanyGroup. The host supplies role options and disabledRoleCodes. Restricted options are hidden unless already selected, then stay disabled. Group company tags accept stable `{id,name}` records and legacy strings. The basic heading remains 18px; Role is the source input label's 14px/20px. Default company tags retain 21px height; compact containers wrap them. Empty notices are caller-owned. Authorization and actual account mutations remain server/host responsibilities.

The current company add-picker supports name search and keeps the regular input border after a successful name check. Name validation, selected company IDs and the host draft remain independent. PositionForm's explicit view mode delivers current-company 403/404 errors through onAccessError once per request, including StrictMode. Supply companyContextRequestId to mask mismatched error.requestId values even for the same company; the host still owns cancellation. Stale-company errors, callback rerenders, create/edit and other error codes do not exit the form. The host owns context requests, error reset, retry and list restoration; the UI preserves editable drafts and exposes an inline error/retry surface.

## Position references

The local dev `27c4fdbf` JSON/Markdown mappers preserve the card's position version; legacy cards without one use version 1. Body links have no version and open the current LIVE position. The detail view selects the historical or LIVE provider and restarts for id/version/retry changes. This is a local source audit; deployed revision binding is unverified.

`PrismPositionReference` distinguishes `{id, source:"card", version}` from `{id, source:"link"}`. `createPrismPositionReference` returns a separate minimal reference and never changes the item. Explicit versions must be positive safe integers; raw DTO conversion belongs to the host. Card callbacks preserve the existing first argument and add the reference. `PrismResponse.onAction` adds a versionless reference only for position links in text, tables and analysis; other actions retain their two arguments. It does not also dispatch the card callback.

Use controlled `selectedReference` or `selectedPositionReference` when different conversations contain the same id at different versions. Explicit null clears selection; undefined preserves legacy id selection. Version references do not change card geometry, disclose ranks or compute recommendations. The complete host example connects a typed loader, AbortSignal, late-response guard, retry and immediate stale-data masking. Its default provider is an identified synthetic fixture, not a real-service integration check. Authentication, history/LIVE services and persistence remain host-owned.

## Empty states and profile memos

The current source separates the base HRX empty state, the tab wrapper and the memo panel. Use `PrismEmptyState`'s explicit `variant` to preserve that distinction. The empty-state content has no outer padding; the caller provides layout spacing. `PrismRequestState` supplies the tab wrapper's 70px vertical padding.

| Variant | Icon | Title / description | Title gap | Source |
| --- | --- | --- | --- | --- |
| default | 140px | 18px 600 / 16px 500 | 10px | HRXEmptyState / _empty-state.scss |
| tab | 120px | 16px 600 / 14px 500 | 10px | TabPanelEmptyState.module.scss |
| panel | 140px | 16px 600 / 14px 500 | 6px | HRX panelMode, used by MemoContent |

The legacy `panel=true` prop retains its compact tab appearance; an explicit variant takes precedence. Description is optional. Memo collections omit the total row when permitted ready records are empty. A bounded memo list hides only its decorative empty-state illustration when the remaining space is short, keeping the message and composer visible. Natural-height collections keep their illustration and content-driven layout.

These rules use local dev `087811ff` and the observed deployed empty-state CSS. The authenticated memo panel's complete visual states remain unverified.


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

## Tooltip

- Dark body: #0c1f4d, 12px/500/1.4, radius 6px, padding 8px 16px, minimum width 90px/height 32px, maximum width 320px. Small uses minimum width 52px and horizontal padding 12px.
- Body gap is 4px for top/bottom and 8px for left/right. The clipped arrow is 12px × 8.52px, rotated for horizontal placement. Top/bottom start and end preserve the original 16px inset; centered arrows track the trigger when the body shifts.
- Panel body has no padding, minimum size or shadow inheritance. Its white surface has a #dee7fb border, radius 12px and 0 4px 16px rgba(0,0,0,.12) shadow. An inner container owns 12px padding and the original 507px maximum width. SUMMARY content uses 14px/500/1.4 and preserves newlines.
- `PrismTooltip` composes a trigger and content. `PrismTooltipContent` provides the same surface inside a consumer-owned Tooltip root/trigger; its `sideOffset` measures the body gap. Keep content informational. Interactive forms/actions belong in a Popover or Dialog.
- Viewport collision handling, an 8px boundary inset, width clamping and internal vertical scrolling extend the reference for long content. SUMMARY help retains hover/focus and adds touch/Space toggling, Escape and outside dismissal. Empty string explanations omit the trigger. These additions are explicit behavior improvements.


## Standalone document exports

Keep data and page selection in the consumer. `PrismHtmlExportButton` receives a connected static root. Mark screen-only actions with `data-prism-export-exclude`. The export embeds readable styles, images, fonts and canvas pixels, retains SVG IDs and form values, and freezes the document before pending resource loads. Supply a consumer asset loader when authentication or asset routing requires it. Complete `cssText` must already contain the full rules when CSSOM access is unavailable. Asset failures are errors; do not report a successful export with a missing photograph or chart. The HTML file is a static document and does not carry the application runtime. Narrow screen overflow remains inside the exported viewer; print media releases that overflow.

## Current administration recipes

Use `PrismUserForm mode="create"` with `PrismUserRegistrationDraft`: email, lastName, firstName, companyId, division, roleId and companyGroupId. The five basic fields are required. Company selection is searchable. `mode="detail"` requires a stable `initialValue`; basic information is read-only and the consumer changes roles or company groups. Supply group status to display the source active/inactive badge in both options and the selected value. The existing mode-less three-field model remains supported. Default email validation checks format on blur; the service owns allowed domains, duplicate checks, permissions and role notices through the controlled validation props.

For `PrismCompanyGroupForm`, supply `mode`, controlled draft and company choices. Pass a stable detail `initialValue` as the comparison baseline. Mount the form after its entity is loaded, and use a different React key when changing entities. `validateName(name,{signal})` runs on create blur or 600ms after a detail rename. Respect the signal when calling the service; the component also ignores stale results. The unchanged original name permits company-only edits. The company picker adds only unselected entries or all remaining companies, while the required collection is the selected company IDs. Its intentionally empty scalar picker is not a native required select.

User/group `onSubmit` may return a Promise. Inputs and actions stay disabled until it settles; duplicate submissions are suppressed, and a rejected save shows a retryable error. Connect `onSubmitError` for service error handling. Input label gap is 2px, user basic-card gap 12px and role-card gap 16px. At container widths up to 480px the basic grid becomes one column; action rows wrap and company tags grow with wrapped text. Business validation and persistence remain consumer-owned.


## Current personal memo recipe

Use prism-memo for the current personal profile memo UI. Load only authenticated, permitted records through the service; isMine is service data, not proof of authorization. Collection displays only isMine=true entries. Keep stable unique IDs and consumer-owned items/editingId. Source cards have no author header: body, then date and the edited marker, with one editor locking other edit/delete actions. Legacy author-header PrismMemoCard/Collection remain available for existing consumers.

Return the actual save/delete/create Promise, pass the supplied AbortSignal to the service and update data only after successful completion. Failed mutations retain their draft/dialog and expose retry. Cancellation suppresses late UI completion; the consumer still owns persistence, permissions and concurrency handling. Creation preserves whitespace and does not clear the controlled draft automatically.

Cards use padding16px/gap12px/radius12px, body14px400/1.4, date12px500/17px and20px edit/delete artwork. The delete confirmation uses the source error copy, red warning button and123px minimum content area. Provide a height for a bounded list with a separate composer; omit height for natural layout. Native editor resizing is limited by available container space. Footer wrapping and pre-wrap body text preserve narrow and multiline content. Source loading keeps its three skeleton cards with42px placeholders.

### Inline SidePanel baseline and sizing

Use a 440px panel and a 64px header with 20px padding. The header actions and Expand/Collapse/Close vectors are 24px. Use border-secondary #DDE5EB and shadow -4px 0 12px rgba(37,38,46,.06). Base panel text is 16px/black; header text is 18px/600, while the public rich h4 title is 18px/700. Expanded width is parent+1px at z-index1250. A closed panel remains mounted and inert with width0 and a0-width placeholder.

The base content has no padding and hides vertical overflow. Set contentStyle/contentClassName for the specific profile, memo or comparison layout; the workspace explicitly supplies20px and vertical scrolling. Long rich titles grow the header. Opt-in manual resizing applies width immediately so the handle does not move during keyboard/double-click input; the base panel retains the source 225ms width transition. Compact parents use full width and hide the handle while retaining the preferred width. Unexpected pointer cancellation/capture loss is covered by mocked lifecycle tests; native device behavior remains unverified.

Cancelling a drag restores the preferred width from before the gesture, including interruption by a compact parent. The panel still clamps its displayed width to the current parent; rollback does not erase a wider stored preference.

## Current panel caller contracts (2026-10-12)

Use PrismProfilePanel/PrismMemoPanel/PrismPositionPanel/PrismChatPanel for the source-specific caller layout. Profile and memo are expandable and cap their body at840px. Profile padding is20px20px0; its memo view is0 20px; a standalone memo uses20px20px0. Profile memo remains mounted while hidden, and a different subject resets the view/content boundary.

The base onCloseRequest does not mutate open or expanded. A guarded owner commits the close after beforeLeave(back/close,{subjectId,signal}) accepts. Denial and rejection preserve the current draft/view/expansion. Repeated pending requests are ignored; subject changes, external close and unmount abort stale confirmations. Hosts must decide about unsaved drafts before changing subjectId. PrismMemoLeaveDialog exposes the source confirmation text and controlled buttons without an application store.

Chat uses a22px symbol/gap6 title, #EEF1F8 surface,20px messages,320px/#D6DCEE user bubble,sticky composer with30px bottom padding and34px bottom-scroll action. Closed chat content unmounts, as in the source; chat/stream persistence and scroll detection remain host-owned.

Position detail displays definition, Business Context,expertise/experience groups and the source competency footnote. Preserve max840px,scroll gap20/padding20 and16px/radius12 summaries. Empty text is not a successful data load; loading/error hide stale content. Only the host selects LIVE data/main-job requirements and cancels stale requests. Stacking metadata below320px is an explicit responsive extension. These source-read rules await current rendered comparison.

## Source profile and favorite contracts (2026-10-12)

Use132px/gap12 for the profile photo/info header; keep name/ELP/birth/tenure together and20px print/favorite actions on the right. Display affiliation/jobFunction,12px affiliate/position and grouped evaluation history before the bottom memo button/blue count. Loading hides stale identity/actions with the source photo/name96px/department300px/position390px skeleton. The host owns bookmark/print pending state and services; readonly blocks bookmark mutation while memo/print reading remains available. Print keeps80pt portrait,10pt information and18pt tags. Current print geometry/pagination is not verified.

Favorite cards use16px padding/12px radius,70px portrait,121px minimum info and12px white expertise/history. Separate native overlay/open and favorite buttons; extra actions do not bubble to a synthetic card handler. The viewport owns its named container:3 columns/gap10 normally,2 below600px and1 below360px, with optional CSS resize/scroll. Wrapping/min-height preserve long content instead of clipping it.

Source evaluation history removes blank/null grades, sorts valid years descending and groups badge/year labels. Parentheses are display-only highlight markers; explicit active flags take priority. Do not infer evaluation or person ranking. Unknown year labels retain host text and order. explicit/empty props preserve alternative per-year unknown/absence display. Public formatting outputs contain no internal sort state.

Portraits retry on a new subject/source and expose missing-image fallback without rewriting protected URLs or credentials. Named fields and explicit empty aliases remain authoritative host values.
