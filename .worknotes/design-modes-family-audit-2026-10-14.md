# Design modes component family source audit

2026-10-14 읽기 전용 조사. root가 통합·검증 중인 source를 조사했으며
source, dist, generated 파일은 수정하지 않았다. `/prism` source와 디자인은
제외했다. software-engineering, pydemia-coding-style, frontend-development의
최소 변경·실제 소비자 확인·미검증 구분 지침을 적용했다. leaf는 재위임,
build, Git, 공개, browser를 실행하지 않았다.

## 관측 기준

`apps/docs/src/catalog.tsx:5468`의 export 이후 각 entry의
`id/name/category`를 추출하면 144개다. 최상위 component TSX도 144개다.
아래는 실제 category별 전체 ID 목록이다. category는 이 문서에서 임의로
합치거나 새로 정의하지 않았다.

| Family | 수 | Catalog IDs |
| --- | ---: | --- |
| Actions | 8 | button, icon-button, button-group, copy-button, action-bar, toggle, toggle-group, favorite-toggle |
| AI & agent | 10 | message, conversation, citation-list, artifact-viewer, reasoning, tool-call, agent-status, approval-card, prompt-input, model-selector |
| Content | 6 | page-header, content-list, block-editor, carousel, board, thread |
| Data & analytics | 20 | metric-card, filter-bar, query-builder, sparkline, bar-list, bullet-chart, funnel-chart, waterfall-chart, box-plot-chart, histogram-chart, treemap-chart, radar-chart, sankey-chart, pivot-table, data-chart, donut-chart, calendar-heatmap, heatmap, scatter-chart, dashboard |
| Data display | 8 | badge, avatar, avatar-group, table, data-list, item-list, pagination, data-table |
| Date & time | 7 | calendar, date-picker, month-picker, year-picker, date-range-picker, time-picker, date-time-picker |
| Developer tools | 10 | snippet, code-block, code-editor-shell, diff-viewer, markdown, markdown-editor, log-console, log-viewer, terminal, json-viewer |
| Feedback | 9 | alert, progress, skeleton, empty, result-state, spinner, toast, notification-center, response-feedback |
| File & media | 6 | image, lightbox, image-cropper, avatar-uploader, dropzone, file-upload |
| Framework | 5 | master-detail, app-shell, scroll-area, resizable-panels, sidebar |
| Inputs | 14 | input, search-input, input-group, number-input, tags-input, color-input, password-input, pin-input, rating, label, textarea, affixed-input, field, editable |
| Layout | 2 | card, separator |
| Navigation | 8 | breadcrumb, tabs, tree, tree-nav, navigation, anchor-nav, navigation-menu, menubar |
| Overlays | 11 | dialog, command-palette, drawer, dropdown-menu, context-menu, tooltip, accordion, collapsible, popover, hover-card, alert-dialog |
| Selection | 13 | checkbox, native-select, switch, radio-group, segmented-control, slider, range-slider, select, combobox, autocomplete, multi-select, transfer-list, tree-select |
| Workflow | 7 | calendar-scheduler, stepper, form-wizard, timeline, kanban, gantt, node-canvas |

최상위 144개 TSX의 literal 검색 결과: rounded-sm 107개 파일,
rounded-md 2개 파일, control-height 20개 파일, density-row-block 2개 파일,
text-sm 116개 파일, text-xs 83개 파일, bg-surface 113개 파일,
data-ui 속성 6개 파일. 파일 수는 렌더·상태·시각 통과 수가 아니다.
`resolveThemeTokens`의 radius/text/color alias 덕분에 optional CSS hook이
없는 component도 공통 palette와 일부 형태를 상속한다.

조사 중 SHA256:

- packages/ui/src/design-modes.css:
  `5E9047EB0E0ED429F124400162AC3C7DA6ED05633025AA2048D9EEF33362BF4E`
- packages/ui/src/components/foundation/design-modes.ts:
  `6EBE6BE11BB2C40E4CA78EF8490D1783E5F9AB3FE73E88246F9ECF9F62618F7A`
- apps/docs/src/catalog.tsx:
  `442C5DAAE6C08EB20E6C9F16B8D5290F94D96036B4C679A2869EFACA85801A76`
- apps/docs/src/styles.css:
  `829968D44387037F452AFF642C65D2DC199A59DFF7D737174214081FFA01E44E`

## 확인한 누락과 최소 수정

1. **Bento/Spatial recipe 소비자가 없다.**
   `foundation/theme-dom.ts:25`는 data-recipe를 설정하지만 non-PRISM
   CSS/TSX에 이를 소비하는 규칙이 없다. `design-modes.css:60`은 두 모드에
   card shadow만 설정한다. `analytics-workspace.tsx:145–198`의
   DashboardMetrics/Panels, `review-workspace.tsx:101`의 세로 조합,
   `intake-workspace.tsx:158`의 고정 2열은 recipe를 읽지 않는다.
   최소 수정: 기존 조합 root/section에 명시적인 presentation hook을
   추가하고 data-recipe 아래에서 grid gap, panel shape/depth를 조절한다.
   component tree, key, 데이터 순서, 업무 state를 바꾸지 않는다.
   Bento와 Spatial이 같은 palette/card shadow만 가진 상태를 recipe 완료로
   기록하지 않는다.

2. **강한 border와 표면 표현이 대표 control/panel 사이에 다르다.**
   `design-modes.css:63–86`의 border-width는 Button/Input/Textarea/Badge에만
   적용된다. `card.tsx:37`, `select.tsx:31`, `native-select.tsx:23`,
   `dialog.tsx:37`, `popover.tsx:26`, `hover-card.tsx:25`는 고정 border다.
   Brutal/Skeuo/Retro/Pixel/Drawn이 2–3px border token을 제공해도 이들은
   1px로 남는다. Select/NativeSelect에 data-ui hook도 없다.
   또한 재질 fill/image/filter는 default Card에만 적용되고 실제
   Select/Popover/Dialog/menu panel은 기존 bg-surface와 shadow-float다.
   최소 수정: 기존 control/panel에 안정적인 역할 hook을 붙여 해당 token을
   선택 적용한다. underline, fullscreen border-0, subtle Card,
   featured MetricCard의 의미를 보존하는 selector가 필요하다.
   전체 border/background selector로 덮지 않는다.

3. **heading typography는 PageHeader만 소비한다.**
   `design-modes.css:80`의 heading hook은 `page-header.tsx:65`에 존재한다.
   그러나 `card.tsx:62` CardTitle, `dialog.tsx:93` DialogTitle,
   `alert-dialog.tsx:57` 제목, `analytics-workspace.tsx:202`,
   `review-workspace.tsx:150` 제목은 font-heading을 읽지 않는다.
   Editorial/Drawn의 serif, Cyber/Retro의 mono heading 선택이 일반 업무
   panel title에 나타나지 않는다. 최소 수정: 실제 제목인 곳에 heading
   family/weight hook 또는 직접 token utility를 추가한다. 값·코드·label의
   font-mono와 본문 font를 일괄 변경하지 않는다. docs intro/section은
   `styles.css:139,149`에서 이미 heading token을 소비한다.

4. **모드 형태를 따르지 않는 비원형 radius 두 곳이 있다.**
   `carousel.tsx:146`, `image.tsx:80`의 frame은 rounded-md를 사용한다.
   resolver는 radius-sm만 디자인 radius로 합성한다. Swiss/Pixel/Brutal의
   직각 형태에서도 이 두 frame은 Tailwind 기본 radius-md로 남는다.
   최소 수정: 이 frame의 Basic radius를 보존한 역할 token을 추가하거나
   디자인 scope에서 두 frame hook만 바꾼다. avatar/slider/dot의
   rounded-full은 의미가 있으므로 변경 대상이 아니다.

5. **문서 chrome의 일부 형태·간격이 mode token 밖에 있다.**
   `apps/docs/src/styles.css:190–229`의 swatch/colormap/reset/contrast와
   example-frame/usage panel의 3/4/5px radius는 literal이다.
   `styles.css:146`은 docs-section-space를 위 padding에만 사용하고 하단은
   50px이며, `styles.css:240` 모바일 section/intro 및 preview 간격이
   literal로 덮인다. 최소 수정: 필요한 표현 역할만 token으로 연결하고
   Basic fallback과 기존 mobile 값을 보존한다. 모든 작은 swatch까지
   강한 디자인 모양을 적용할지는 root가 실제 화면으로 판단한다.

## 상태 표현의 근거와 미검증 범위

- Focus는 `packages/ui/src/styles.css:215`에서 --focus를 사용한다.
  radius/text/color alias도 `foundation/design-mode-settings.ts` 말미에
  합성한다. local portal에 같은 token이 들어가는지는 root의 browser
  computed-style 검사 대상이다.
- Input/Select/NativeSelect의 invalid는 border-danger, disabled는 opacity
  및 cursor/pointer 규칙을 유지한다. Checkbox의 checked/indeterminate와
  invalid는 `checkbox.tsx:38–42`, Toggle selected는 `toggle.tsx:15–17`,
  Tabs active는 `tabs.tsx:41–49`, Select highlighted/disabled는
  `select.tsx:92–97`에 의미가 유지되어 있다. source만으로 상태 대비의
  실제 통과를 주장하지 않는다.
- Tabs pill selected의 `tabs.tsx:49` shadow-sm은 panel/control decoration을
  읽지 않는다. 모드가 selected relief까지 보장해야 한다면 해당 active
  shadow 역할만 token으로 연결하고 selected bg/text/focus는 보존한다.
  이는 선택 상태 오류라는 판정이 아니라 표현 coverage 누락이다.
- disabled opacity-50의 대비, 2–3px border의 크기 변화, serif/mono 한글
  fallback, modal/menu blur fallback, selected/error/focus 상태가 재질과
  함께 보이는지는 실행하지 않았다. font-mono 코드와 작은 chart tick은
  고정된 정보 표현으로 보아 일괄 token화 요청을 하지 않는다.
- manifest는 `foundation/design-modes.ts:407`에서 Basic만 released,
  나머지는 ready다. 144개 catalog 존재나 token 참조 수는 21개 출시
  인증이 아니다. mode × family × state × appearance coverage는 현재
  source 조사만으로 모두 미검증이다.

## 인계

root는 위 1–3의 최소 표현 누락을 우선 검토하고 기존 검증 실행에
대표 control/panel/title 및 recipe 조합을 포함할 수 있다. 재질 hook을
확장한다면 featured/subtle/underline/fullscreen 예외를 함께 확인한다.
별도 redundant unit test나 광범위한 component 재작성은 제안하지 않는다.
전체 catalog render, 실제 상태 대비, 320/390px recipe overflow, portal
style/focus, profile와 예시 입력 보존은 root 소유의 미실행 검증이다.

이 leaf는 이 기록만 작성했으며 source write ownership이 없다.
ownership released.
