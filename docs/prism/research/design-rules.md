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

The deployed chat body and answer/table cells use `word-break: keep-all` with `overflow-wrap: anywhere`, matching the latest frontend reset at `d677e551`. The independent PRISM light root carries those inherited values within its own scope, so Korean word units remain together where possible and oversized tokens can still wrap in narrow containers.

## Notice list and detail

The authenticated list dialog measures 560px wide with a 500px content region, a 40px list heading and a 412px scrolling body at desktop size. Its three table columns use the remaining title width plus 100px author and date columns; rows are about 40px high. The detail dialog keeps a 300px minimum content region and offers both a header back control and a footer list action. Source list summaries omit the body and attachments, so the host supplies a separate detail response and loading/error state. `total` is the server's full result count and can exceed the displayed rows. The component sorts supplied timestamps locally without changing its input array. Requests, stale-result cancellation and access control remain host responsibilities.

## Leadership summary

The local dev revision `27c4fdbf3e73234b7ab5c46e379a04d083c12df8` changes the summary to a blue type tag, a bold summary and a separate explanation below a divider. `PrismLeadershipPieSummary.title` maps to `summary.title`; `description` maps to `summary.content`; `detail` maps to `summary.description`. Whitespace-only detail adds no divider. Detail alone is information, including when all percentages are missing or zero. The host supplies the values and interpretation.

The outer box uses 16px padding/gap and a 12px radius; its chart/comment row uses a 20px gap. Summary text is 14px/700/#222222; detail is 14px/400/#363636 with preserved line breaks. The type tag reuses the shared blue tag. The divider is 1px/#E3E5E5. Ordered 지·덕·용 colors are #327BB7/#42938A/#DDB77D. At 660px the caption spans stack; the independent component also stacks the main row at 480px and wraps type labels there without dropping detail. At wider sizes `wrapTitle` opts into multiline type labels; default tags keep the source 21px height.

Print uses 8pt padding/gap/radius, an 80pt minimum height, a 20pt main-row gap, a 2pt chart gap and a 6pt comment gap. Caption, summary and detail are 10pt. The default tag uses a 15pt height, 3.5pt 4pt .5pt padding, a 4pt radius and 8pt/11pt text. Full print text is the default. The optional reference limits shorten title/summary in a copied display model and retain all detail, matching the current source mapping. These rules were checked against local source; current deployed revision binding, rendered comparison and A4 pagination remain unverified.

## Administrator user list

The local `27c4fdbf` user list separates draft filters from the applied query. Apply/reset clears selection and returns to page1; sort returns to page1 while keeping selected IDs. All or no status/company/group choices omit that filter. Group filters are submitted only when the selected role metadata has `needsCompanyGroup`; map source GENERAL_HR/GENERAL_USER accordingly. The host maps source role codes/names and serializes normalized `isActive/companyIds/roleCode/companyGroupIds/keyword` into its API request. The UI does not copy the source service or authorization store.

The source's status/name/company/role/companyGroup sort columns map to `is_active/name/company_name/role_name/company_group_name`. Email is not sortable. Rows carry display names, labels and optional group status; the source name joins last_name and first_name without a separator. Missing display values are dashes. Status chips use the source soft22px style and #009A93/#363636 colors.

The admin directory variant uses fixed table geometry,44px checkbox,16px source sort icons,10 loading rows and a400px empty region. Its whole-page checkbox clears every page if this page has any selected row; default generic directory behavior stays page-scoped. A name-column button adds keyboard opening without changing cell dimensions. The user recipe preserves64px header,18px600 title,14px breadcrumbs,140/140/170/140/226px filter columns with20px gaps and20px/12px filter padding/radius. Small containers wrap filters and horizontally scroll the full table.

Bulk status changes default to500 IDs, freeze the confirmation request and pass `AbortSignal` to the host mutation. Change `scopeKey` when applied query, account/permission context or provider changes. Scope/readOnly/unmount invalidates pending work; failed requests keep drafts/selection and remain retryable. Success removes processed IDs while preserving later selections. The host owns persistence, actual permission checks, API error formatting, cache refresh and notices. The complete example uses synthetic23 rows,10-row pages and a synthetic mutation; it does not modify actual accounts.

## Admin account forms

Local dev `27c4fdbf` uses the seven-field `PrismUserAccountDraft`: email, lastName, firstName, companyId, team, roleCode and companyGroupId. The account recipe is selected by roleCode. Its company is optional; create email defaults to the source @sk.com rule. Detail locks email while names, company and team stay editable. initialValue or the first controlled draft supplies the dirty baseline, including create mode. Valid creation does not imply dirty cancellation. onCancel receives dirty; onSubmit receives a copied, trimmed public model with the group omitted only for a known role that does not require one. Unknown role metadata never erases a stored group. The older roleId/division registration and three-field models remain available.

Map source role_code/role_name/requires_company_group to option value/label/needsCompanyGroup. The host supplies role options and disabledRoleCodes. Restricted options are hidden unless already selected, then stay disabled. Group company tags accept stable `{id,name}` records and legacy strings. The basic heading remains 18px; Role is the source input label's 14px/20px. Default company tags retain 21px height; compact containers wrap them. Empty notices are caller-owned. Authorization and actual account mutations remain server/host responsibilities.

The current company add-picker supports name search and keeps the regular input border after a successful name check. Name validation, selected company IDs and the host draft remain independent. PositionForm's explicit view mode delivers current-company 403/404 errors through onAccessError once per request, including StrictMode. Supply companyContextRequestId to mask mismatched error.requestId values even for the same company; the host still owns cancellation. Stale-company errors, callback rerenders, create/edit and other error codes do not exit the form. The host owns context requests, error reset, retry and list restoration; the UI preserves editable drafts and exposes an inline error/retry surface.

## Chat detail selection and administrator navigation

Local dev `27c4fdbf` clears both detail panels and selected subjects when axios reports 403/404 for its classified candidate subresource, position/history, company-context, memo-create or candidate-delete APIs. The library exposes host-owned `usePrismDetailSelection` rather than copying the source HTTP/session singleton. Only call `handleAccessError` after your host classifies that error. Other statuses leave the detail selected. A request ticket optionally binds the callback to its hook instance and selection generation, including same-ID reopen and historical/LIVE changes. This UI identity contains no subject data and does not authorize a server request. The host owns cancellation and error notices.

Access revocation must remove the subject and its draft content. `PrismPanel` normally keeps closed children mounted; render it conditionally from `selection` for this path. Do not defer revocation through an ordinary unsaved-edit leave guard. The complete workspace example removes its panel DOM, while continuing to use the existing responsive workspace and panel resizing.

`createPrismAdminMenu(canManage,basePath)` supplies the source's Admin label and user, company-group, position-block, position and notice links. The host supplies `canManage`; menu visibility is not server authorization. Opt-in `matchDescendants` uses a slash boundary; existing custom navigation items keep exact matching. The integration references for ChatMain/axios are recorded separately from the component inventory and do not increase its purpose-mapping count.

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
- The new-chat button uses the source 28px AddIcon and default `새로운 대화` label in a 40px, 8px-radius gradient control. Its disabled state has no border. Keep the icon at 28px despite the generic large-button 16px icon rule; the button fills the width supplied by its host container.
- Input medium/small: 32/28px, radius 6px, padding 12px horizontal. Preserve required, invalid, readOnly, disabled independently.
- Tag 21px/radius 4px, chip 22px/radius 4px, ELP 16px/radius 10px, count 14px.
- Count overlays a 24px AlarmIcon at +13px horizontally and -2px vertically in the deployed sample. Keep source-style icon anchoring in the demo; standalone counts are a separate library usage. Explicit-color soft Chips measure 52×22px for the sample `Status` label. Product callers supply `color`; the library `tone` default is an extension.
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
- The Candidate Common SUMMARY circle is 88×88px with `10px 4px` internal padding and the `#44689f`→`#284d85` diagonal gradient. The surrounding badge wrapper owns separate `10px 16px` spacing.


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

## Position-block management audit 2026-10-13

Current workspace:57 install groups/58 registry items/38 complete examples/244 canonical fixture states;252 full PRISM tests passed. This is not a completion denominator. Non-vector source files remain186; current purpose mapping uses49 primary/50 total non-vector groups, and final independent target total remains unestablished.

Position-block list/editor/deletion follow current source27c4fdbf: LIVE/TEMP, role view-only, sync lock, deleted counts, debounced duplicate check, description+sub-job generation and manual editing, dirty guard, impact review before edit confirmation, required primary/optional secondary remap and other-job conflict. Services are typed host callbacks with cancellation; failed requests retain input or selection for retry. Twelve new states at1280/320 and legacy tag/default320 were checked; document/dialog overflow and nested buttons0 after containing hidden labels within remap fields. Actual create/edit/save/remap flows are synthetic. The original authenticated administrator page is blank, and real service/RBAC/sync/full visual/font/A4 parity remains pending.

Current source fingerprint:24f6875e7f3aa078e2c927100585b52274d7788c75207ae70c9352506239d1b6 from82 inputs. Corrected57 TSX/CSS and38 examples passed actual shadcn installation,TypeScript/Vite/font/notices. Source common-control CSS values and label/helper/generation/textarea order were measured. Fourteen current unique states were checked (12 new plus tag/field regressions); authenticated source and full busy/visual comparison remain pending. Corrected installed mobile/order/red notice/edit-impact-save were checked with console0. Full site and generic checks passed; latest review publication pending.

## Chat-log and generation-state audit 2026-10-13

Current source:58 install groups/59 registry items/39 complete examples/252 canonical fixture states. The independent final target total remains unestablished;186 source files are not a completion denominator.

The source chat-log pages are placeholders with100 mock rows,no-op search/reset,header/page-only sort and a fixed archive. The portable list has typed host-owned query/page/sort/records and confirmed copy success/failure. The readonly archive preserves context-nudge question omission and selected responses. Public examples use23 synthetic rows/4turns and never change the system clipboard.

34 target and266 full PRISM tests passed. Real shadcn installation,58 exact module sources/CSS,39 complete examples typecheck,Vite,font/notices and full site build passed. The generic registry still matches immutable snapshot sha256-25ca4393b38b8fcebbbd34ca3d8c73475e773a766e971da004f94e40728bc896.

IAB recovered. All8 log states rendered at1280/320 with no document horizontal overflow or nested buttons. Browser interactions proved copy failure/retry,invalid-date submit rejection,page2/detail/back,readonly choices and context-nudge omission. Six dynamic generation checks at1280/320 proved input-only bounds,retained values,Base0.6,24px CSS spinner and48px empty subjob loader. They are not extra canonical states. Installed list/archive rendered atboth widths and retained generation at1280.

Current9 of252 canonical states have scoped browser evidence. Full source/installed state coverage,authenticated original font/pixel/A4 and deployed revision comparison remain incomplete. The source-defined /chat/admin/chat-logs route is document complete but visibly blank in IAB;the existing Chrome source tab displays /admin-login. These observations do not establish an authentication or implementation cause. Review branch CI/preview readback is pending;production is not published.

Current source fingerprint:31cf20034ffccb9e397b17dc3e8f5d30621c0ae0d5bdb2155fab556927b933e7/84 inputs.

## User position directory, 2026-10-13

The `/chat/positions` page serves the LIVE position source. Its list is a separate user purpose from administrator position editing and synchronization. Keep a staged company, industry and position-name filter; Search applies a trimmed name and resets the page, and Reset clears both staged and applied filters. An empty or all-selected industry filter sends no restriction. Sort each of the five columns through the host API and reset to page 1; page sizes are 10, 20, 50 and 100. The host owns authorized options, records, total count, pagination, request cancellation, errors and detail loading.

At the observed 800px content width, the list has a 50px filter bar, a 24px gap before the toolbar, a 10px gap before the table, 20/35/15/15/15% columns and 60px rows. The sticky header uses the cool-100 surface and 14px Pretendard. Initial loading without rows shows four skeleton rows; a refresh with existing rows keeps them visible and usable. An empty result shows its message in a 400px table region. Horizontal table scrolling stays inside the component on narrow screens. Tabs reuse a position ID, display the full active label and truncate inactive labels; closing the active tab selects its predecessor or the list. Keep opened detail panels mounted and hide inactive panels, so switching tabs does not restart their component state or data loading. A route change returns to the list without discarding open detail tabs. Consumer code supplies the actual detail content, normally with `PrismPositionDetail`.

The authenticated deployment exposed the default list with 1,023 records on 2026-10-13. The deployed revision was not bound to the local checkout, and direct deployed detail-tab input timed out. Local synthetic flows and geometry checks do not prove full deployed behavior or visual parity.

## 개인정보처리방침 표시, 2026-10-13

원본은 620px 대화상자, 최대 663px 스크롤 본문, 140px 버전 선택기와 닫기 footer를 사용합니다. 소비자가 버전·현재 HTML·로딩 상태를 공급하고 요청 순서와 오류 복구를 관리합니다. 독립 `PrismPrivacyPolicyDialog`는 HTML을 script 실행 권한이 없는 sandbox iframe에 넣고 문서의 실제 너비·높이에 맞춰 iframe을 늘립니다. 긴 문서는 대화상자 본문에서 세로로, 넓은 문서는 본문 안에서 가로로 스크롤합니다. 320px 화면에서도 footer는 보이도록 유지합니다. 배포 화면과 로컬 소스의 revision 일치는 확인되지 않았으며 원본의 모든 버전과 상태를 비교한 것은 아닙니다.

`InquiryHistoryDialog`는 현재 frontend에서 mount되지만 사이드바의 문의 내역 메뉴 버튼은 주석 처리되어 있습니다. 접근 가능한 배포 화면의 구현 목표 수를 셀 때 이 화면을 별도 진입 목적처럼 더하지 않습니다.

## 새 대화 인트로, 2026-10-13

인사말·카드·시작 질문·대화 입력을 한 폭 800px의 세로 흐름에 둡니다. 원본의 카드는 48px 아이콘과 제목·설명 본문 사이에 14px 간격을 두며 제목과 설명 사이에는 별도 카드 간격이 없습니다. 카드는 호스트가 제공한 열기 callback을 실행하고 질문은 최대 5개를 표시해 선택한 문구를 controlled 입력 값으로 전달한 뒤 textarea에 포커스를 둡니다. 질문 선택만으로 전송하지 않습니다. 로딩 상태는 카드 안의 아이콘과 두 문구를 각각 skeleton으로 표시합니다. 좁은 폭에서는 줄바꿈을 허용하고 문서 가로 넘침 없이 배치합니다. 원본 배포의 로딩·모바일 상태와 실제 라우팅은 별도 검증이 필요합니다.

## 대화 입력창, 2026-10-13

원본 빈 입력창의 외곽은 800×110px이고, 내부 입력 영역 60px·첫 글줄 20px·동작 영역 48px·전송 버튼 28px입니다. 입력은 최대 2000자이고 값이 있을 때만 `현재/2000자`를 표시합니다. Enter는 전송, Shift+Enter는 줄바꿈이며 IME 조합 중 전송하지 않습니다. 생성 중에는 입력을 잠그고 placeholder·spinner·중단 버튼을 표시합니다. 호스트가 입력 값, 실제 전송과 중단 결과를 관리합니다.

독립 입력창은 가용 폭에 맞춰 줄바꿈하고 최대 5줄까지 높이를 늘린 뒤 textarea 안에서 스크롤합니다. 320px 합성 입력에서 문서 가로 넘침은 없었습니다. 생성 중단 시 버튼이 전송 버튼으로 전환되어도 브라우저의 기본 제출 동작이 실행되지 않도록 전송 버튼은 명시적 클릭으로 처리합니다. 독립 설치본에서 중단 후 초안 유지·전송 0회를 확인했습니다. 파일 첨부 버튼은 현재 배포 원본에서 숨겨져 있으며 독립 컴포넌트의 `onAttach`는 소비자가 명시적으로 제공할 때만 표시되는 확장 기능입니다. 배포된 생성 중·첨부 상태와 실제 API 동작은 별도 검증이 필요합니다.

## Goal 완료 판정 범위, 2026-10-13

기준 원본 `dev` `2eeb26ff`에서 독립 구현 목표는 **58개 UI 컴포넌트 그룹**입니다. 원본 비벡터 UI의 목적별 대응 50개와 프로필 HTML export·별도 기능 7개를 합산했습니다. `prism-icon` 벡터 자산 그룹과 디자인 토큰은 필수 지원 자산이지만 개수에서 제외합니다. 그룹별 원본 목적과 적용 가능한 상태의 디자인·동작, 독립 설치, 반응형·크기 조절·접근성 개선을 확인해야 완료로 셉니다. 현재 catalog 등록 수가 곧 검증 완료 수는 아닙니다. 대상 ID는 [컴포넌트 목록](/prism/components.json)에서 `prism-icon`을 제외한 전체 항목입니다.
