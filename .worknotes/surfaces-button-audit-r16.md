# Embedded button surface audit R16

## 범위와 근거

`inventory.json`의 요청된 여섯 family에서 63개 ID를 추렸고(8 + 20 + 6 + 10 + 10 + 9), 실제 `packages/ui/src/components/*.tsx` JSX와 호출부, `packages/ui/src/design-modes.css`를 읽었다. 지정된 ID 모두를 아래 표에서 개별 판정했다. 소스 읽기 전용 감사이며 제품/공유 CSS, 빌드, 브라우저, Git은 건드리지 않았다. Tree/TreeNav/Navmenu 스크린샷은 root가 대표 관찰 대상으로 제공했으나, 이번 범위의 코드는 브라우저로 확인하지 않았다.

`design-modes.css:372-392`에서 공통 `data-ui="button"`의 비-ghost variant에만 테마 border/radius/decoration/image가 들어가고, ghost는 그 공통 장식에서 제외된다. `:focus-visible` outline은 공통 Button에 유지된다. 그러나 `design-modes.css:874-885`의 `[data-slot="surface-action"]` 규칙은 슬롯에 태그된 엘리먼트 종류나 역할과 무관하게 `--surface` 배경, control 이미지, secondary 장식, control radius, `6px 10px` padding, 32px 최소 높이를 준다. 이 때문에 panel header/row 안의 close/copy/retry/toggle 액션이 독립 outline 버튼처럼 부각될 수 있다. 같은 규칙의 hover/pressed 상태는 네비게이션 선택색을 쓰므로 선택 상태를 보존해야 한다. `design-modes.css:1024`의 `field-action`은 입력 frame에 붙은 버튼의 높이/폭을 맞추는 별도 역할이므로 함께 평탄화하면 안 된다.

## 우선순위가 높은 수정 후보

1. **Surface action의 역할별 중립 기본값** — `design-modes.css:875-885`가 원인이다. surface에 통합된 action만 투명 배경, 이미지 없음, 장식 없음, 불필요한 border/padding 제거로 시작하고, hover는 약한 surface-hover, `aria-pressed="true"`/`aria-selected`/`data-selected`는 현재 선택 토큰을 남기는 좁은 selector가 적절하다. `data-slot="surface-action"` 실제 호출부 중 대상 63개 안의 ID는 `file-upload`, `json-viewer`, `log-viewer`, `notification-center`, `toast`다. `file-upload` retry의 accent 텍스트와 failed 상태 의미를 보존하고, 알림 필터와 로그 tail-follow의 pressed 구분을 없애지 않는다. 공통 슬롯은 범위 밖 `app-shell`, `kanban` 등에서도 사용되므로 해당 적용 범위는 모두 확인해야 한다.
2. **행/목록 안의 확장 disclosure** — `data-table.tsx:442`의 상세 열기/닫기 `size-7` 버튼과 `tree-nav.tsx:191`의 36px branch disclosure는 인접한 행/링크에 결합된 동작이다. border/background/image/shadow는 투명하게 두고 hover만 약하게 유지할 후보이다. `tree-nav`의 선택 페이지 링크와 분리된 disclosure를 구별한다. `tree.tsx`의 `data-slot="tree-disclosure"`는 `<button>`이 아니라 roving-focus `treeitem` 안의 16px `span`이며 click/키보드 처리를 treeitem에서 한다. button 스타일 대상으로 바꾸거나 focus/tab 흐름을 옮기지 않는다.
3. **촘촘한 오버레이/미디어 헤더** — `lightbox.tsx:109,131,136`은 닫기/이전/다음에 `variant="outline"`을 쓴다. overlay header와 이동열에 통합된 secondary 조작이므로 compact ghost/IconButton 또는 명시적 inline slot로 정리할 후보이다. 비활성 처음/끝 상태, 접근 가능한 이름, focus ring은 유지한다. `avatar-uploader`와 `image-cropper`의 labeled reset/upload/crop 버튼은 실제 작업 CTA이므로 이 후보에 포함하지 않는다.
4. **Agent 상태의 취소/재시도** — `agent-status.tsx:109-114`의 좁은 버튼 그룹이 두 `outline` 버튼을 쓴다. 상태 카드 내부의 보조 조작은 inline action 후보지만, 실패 재시도와 실행 취소를 색/텍스트/활성도로 식별 가능하게 남겨야 한다. `approval-card` 결정, prompt 제출, crop/export 같은 승인/완료 CTA는 유지한다.
5. **Sortable header** — `data-table.tsx:374` column sort 버튼은 테두리/표면은 이미 없지만 `focus-visible` 규칙이 JSX class에 없다. 표면 제거 대상이 아니라 키보드 focus-visible 표식 보완 후보이다.

## ID별 JSX 판정

| Family / ID | 실제 JSX hook, variant, 상태 및 액션 판정 |
|---|---|
| Data display / `badge` | `data-ui="badge"`, variant를 표시하는 비인터랙티브 텍스트 표식. 버튼 액션 없음; 상태색/의미 보존. |
| Data display / `avatar` | `data-ui="avatar"`, 이미지 대체/초기값과 선택적 status 점 표현. 소유 버튼 없음; 원형 미디어/상태 표시 유지. |
| Data display / `avatar-group` | 중첩 avatar와 최대표시 수 이후 overflow count. 소유 버튼 없음; count를 임의의 조작 버튼처럼 스타일링하지 않음. |
| Data display / `table` | `data-ui="table"`, appearance 및 table row/cell 구조. 단독 primitive에는 버튼 없음; 소비자 제공 cell content는 제외. |
| Data display / `data-list` | group label과 rows/grid layout을 출력하는 definition list. action slot 없음. |
| Data display / `item-list` | `data-ui="item-list"`, panel/plain, comfortable/compact. href는 anchor이며 `trailing`은 호출자 임의 ReactNode; 컴포넌트 소유 버튼 없음. |
| Data display / `pagination` | 페이지 크기 NativeSelect와 `Button variant="outline"` 이전/다음. pagination은 자체적인 분리 내비게이션이므로 기본적으로 유지; outline이 과하면 텍스트/ghost 표현만 별도 검토. first/last disabled 상태 유지. |
| Data display / `data-table` | `data-ui="table-frame"`, sort/reset, 선택 ActionBar, remote loading/error/empty, retry, 선택 행 상세 disclosure. reset은 ghost; sort는 unframed지만 focus ring 없음; retry는 오류 해결 작업이므로 outline 보존 가능; 28px row disclosure만 투명 inline 후보. |
| Data & analytics / `metric-card` | Card의 default/subtle/elevated와 metric value/trend presentation. CTA/button 없음. |
| Data & analytics / `filter-bar` | `data-ui="filter-bar"`; submit(primary), reset(outline), dirty/pending/disabled. 실제 form actions이므로 테마 버튼 유지. |
| Data & analytics / `query-builder` | `data-ui="query-builder"`, inline/panel group, validation, disabled/attempted/error. 조건/group 추가와 적용은 별도 labeled actions; 조건/그룹 이동·제거 ghost는 이미 투명. outline 추가/값 지우기는 조작 의미가 있는 secondary action이어서 전역 평탄화 대상 아님. |
| Data & analytics / `sparkline` | `figure[data-ui="sparkline"]` SVG trend mark; 소유 버튼 없음. |
| Data & analytics / `bar-list` | `figure[data-ui="bar-list"]`, variant/density 기반 bar/label 표시; 소유 버튼 없음. |
| Data & analytics / `bullet-chart` | `figure[data-ui="bullet-chart"]`와 range/target mark. 소유 버튼 없음. |
| Data & analytics / `funnel-chart` | `figure[data-ui="funnel-chart"]` segment/chart rendering. 소유 버튼 없음. |
| Data & analytics / `waterfall-chart` | `figure[data-ui="waterfall-chart"]` 데이터 mark/connector. 소유 버튼 없음. |
| Data & analytics / `box-plot-chart` | `figure[data-ui="box-plot-chart"]` plot marks. 소유 버튼 없음. |
| Data & analytics / `histogram-chart` | `figure[data-ui="histogram-chart"]` bins/axis presentation. 소유 버튼 없음. |
| Data & analytics / `treemap-chart` | `figure[data-ui="treemap-chart"]` nested data marks. 소유 버튼 없음. |
| Data & analytics / `radar-chart` | `figure[data-ui="radar-chart"]` polygon/axis SVG. 소유 버튼 없음. |
| Data & analytics / `sankey-chart` | `figure[data-ui="sankey-chart"]` link/node visualization. 소유 버튼 없음. |
| Data & analytics / `pivot-table` | `figure[data-ui="pivot-table"]`, tabular aggregate rendering. 소유 버튼 없음. |
| Data & analytics / `data-chart` | `data-ui="data-chart"`, chart/legend/series visualizer. 컴포넌트 source에 직접 Button/`button` callsite 없음; shell/series marks 유지. |
| Data & analytics / `donut-chart` | `figure[data-ui="donut-chart"]` arc/center summary. 소유 버튼 없음. |
| Data & analytics / `calendar-heatmap` | `figure[data-ui="calendar-heatmap"]`, density/level cell grid. 소유 버튼 없음. |
| Data & analytics / `heatmap` | `data-ui="heatmap"`, panel surface와 grid cell/status 표현. 소유 버튼 없음. |
| Data & analytics / `scatter-chart` | `figure[data-ui="scatter-chart"]`, panel surface, scatter marks. 소유 버튼 없음. |
| Data & analytics / `dashboard` | layout regions/children 조립; 자식 content가 제공하는 action만 가능, Dashboard 소유 버튼 없음. |
| File & media / `image` | `data-ui="image"`, fit/aspect/loading/fallback의 미디어 frame. 소유 버튼 없음. |
| File & media / `lightbox` | Dialog 내 `surface-header`; 닫기/이전/다음은 outline, thumbnails는 border/bg surface + current/focus outline. 헤더·이동 outline을 inline/ghost 후보로 검토; thumbnail의 선택/current 표시와 focus는 유지. |
| File & media / `image-cropper` | `data-ui="image-cropper"` header, zoom/position input, disabled 조건. Reset(outline)과 PNG 자르기(primary)는 명시적 편집/완료 작업이라 유지. |
| File & media / `avatar-uploader` | 업로드/기존 이미지 상태에서 변경·제거용 outline actions 및 disabled. 별도 이미지 작업 CTA; 유지. |
| File & media / `dropzone` | drop target 자체가 `button`, keyboard click와 dragging/disabled 상태. 이것은 입력/업로드 진입 surface이므로 투명 액션 규칙을 적용하지 않음. |
| File & media / `file-upload` | uploading은 취소, failed/canceled는 retry, non-uploading은 remove. 각 raw button에 `data-slot="surface-action"`; 진행/오류/취소 상태에 붙은 inline 액션이라 우선 투명 후보. Retry accent 의미와 disabled/available 조건 보존. |
| Developer tools / `snippet` | `data-ui="snippet"`, frame/plain 예시에서 `surface-header`; 내부 `CopyButton`은 기본 ghost/icon. 복사 액션은 이미 ghost이며 header 안에서 그대로 유지. |
| Developer tools / `code-block` | panel `surface-header`의 `CopyButton` 기본 ghost/icon. 배경 없는 inline 액션으로 이미 적합. |
| Developer tools / `code-editor-shell` | editor shell variant/disabled 상태, 자체 Button JSX 없음. |
| Developer tools / `diff-viewer` | `data-ui="diff-viewer"`, panel variant의 surface header와 diff rows; 자체 Button JSX 없음. |
| Developer tools / `markdown` | content/inline-code renderer. 자체 버튼 없음; consumer-supplied links/code children 제외. |
| Developer tools / `markdown-editor` | preview 전환 native button, `aria-expanded`/`aria-controls`, selected preview state. text/segmented disclosure 역할이며 현재 직접 배경/테두리 선언 없음; focus ring/selected 표식 유지. |
| Developer tools / `log-console` | console/list content와 filtering/presentation props; 자체 Button JSX 없음. |
| Developer tools / `log-viewer` | header의 follow-tail raw button이 `data-slot="surface-action"`, `aria-pressed`. inline toolbar candidate이며 pressed 상태 색/선택 장식 보존. |
| Developer tools / `terminal` | prompt/input과 primary submit Button. 실제 실행 submit; 유지. |
| Developer tools / `json-viewer` | frame header의 `surface-action` 복사 button. copy action이 header에 통합되어 최우선 투명 후보; focus와 copy 완료 status 보존. |
| AI & agent / `message` | `data-ui="message"`, role/author/content/status presentation. 소유 버튼 없음. |
| AI & agent / `conversation` | log region과 composer/turn state. 자체 raw button은 대화 action callback 상태에 따라 보임; inline icon actions는 surface-action hook 없이 locally styled. 현재 control 표면 과잉 후보 없음. |
| AI & agent / `citation-list` | citation links와 source metadata. anchor navigation이지 button 아님; link affordance 유지. |
| AI & agent / `artifact-viewer` | panel/header의 close, view mode, source, previous version 모두 `variant="ghost"`, mode actions `aria-pressed`. 표면은 이미 투명; mode 선택 표식 유지. copy는 CopyButton text/ghost. |
| AI & agent / `reasoning` | CollapsibleTrigger disclosure, ChevronRight, inline/card variant와 open state. trigger는 텍스트/화살표에 직접 hover text만 주며 background/border 없음; 현상 적합. |
| AI & agent / `tool-call` | disclosure/collapsible state와 inline/card variant. 별도 Button JSX 없음; trigger의 disclosure state 유지. |
| AI & agent / `agent-status` | running/failed/complete status와 progress. cancel/retry 2개 outline Button이 작은 상태 row 안에 배치됨; inline action 투명 후보, 실패 의미·disabled pending 유지. |
| AI & agent / `approval-card` | approve(primary) / reject(outline), pending disabled. 판단 CTA라 버튼 계층 유지. |
| AI & agent / `prompt-input` | prompt/composer shell과 primary submit; disabled/empty state. 제출 CTA이므로 유지. |
| AI & agent / `model-selector` | combobox/select-trigger field shell과 expanded/selected option state. 입력 필드/선택 trigger이므로 테마 field appearance 유지. |
| Feedback / `alert` | `data-ui="alert"`, variant/status severity. 소유 dismiss button 없음. |
| Feedback / `progress` | determinate/indeterminate progress primitive. 소유 버튼 없음. |
| Feedback / `skeleton` | loading placeholder geometry. 소유 버튼 없음. |
| Feedback / `empty` | empty message/optional children presentation. 자체 CTA 없음; supplied content 제외. |
| Feedback / `result-state` | error/success/empty status 및 retry 등 callback action은 outline Button. 오류 해결 CTA이며 표면 제거는 별도 compact treatment가 명확할 때만. |
| Feedback / `spinner` | status spinner/density presentation. 소유 버튼 없음. |
| Feedback / `toast` | dismissible close `surface-action`, top-level notification card 안에 있음. × 액션은 우선 투명 후보; hover와 focus 표시 보존. |
| Feedback / `notification-center` | all/unread `surface-action` filters(aria-pressed), mark-all-read, 각 row mark-read actions. panel 내 필터/행 조작의 배경·장식 중복은 줄일 수 있으나 선택 필터의 pressed fill/ink, unread 상태, label을 유지. |
| Feedback / `response-feedback` | thumbs up/down을 `Button variant="outline" aria-pressed`로 표현하고 선택 시 accent fill/border 사용. 사용자의 직접 rating/feedback 선택이므로 선택 상태색을 보존; 일괄 transparent override 금지. |

## 판정 요약과 제약

- **63개 ID 전체 source 판정 완료**. 표 내 컴포넌트 소유 button/action이 확인된 ID는 `pagination`, `data-table`, `filter-bar`, `query-builder`, `lightbox`, `image-cropper`, `avatar-uploader`, `dropzone`, `file-upload`, `snippet`, `code-block`, `markdown-editor`, `log-viewer`, `terminal`, `json-viewer`, `conversation`, `artifact-viewer`, `reasoning`, `tool-call`, `agent-status`, `approval-card`, `prompt-input`, `model-selector`, `result-state`, `toast`, `notification-center`, `response-feedback`다. 나머지는 개별 JSX에서 소유 button 없음 또는 호출자 제공 content로 확인했다.
- 우선 후보는 5개 target ID의 공통 `[data-slot="surface-action"]` surface/background treatment와 2개의 row disclosure(표 상세, TreeNav disclosure)다. `surface-action`은 5개 target ID에서 다수 인스턴스로 쓰이며, 상태/pressed 역할별 정리가 필요하다.
- 실제 테마와 대조할 때 primary submit/approval, field trigger/field action, selected/pressed, danger/status, disabled, keyboard focus, Tree의 roving-focus/keyboard contract를 보존한다. 공통 `button` 전체를 transparent 처리하거나 status/selection fill을 지우는 변경은 근거가 없다.
- 전체 63개를 화면으로 렌더링하거나 hover/focus/pressed/disabled 상태별로 검증한 것은 아니다. 이번 결과는 실제 JSX/callsite와 CSS 규칙에 근거한 정적 audit이며, 대표 screenshot 확인 및 구현 후 시각 검수는 root 소유 후속 작업이다.
