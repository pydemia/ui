# Overflow / alignment source audit R17

## 범위와 근거

- `inventory.json`에서 지정된 Data display 8, Data & analytics 20, File & media 6, Developer tools 10, AI & agent 10, Feedback 9, 합계 63 ID를 선택했다. 63개 각각에 대해 `packages/ui/src/components/<id>.tsx`와 `apps/docs/src/catalog.tsx`의 등록이 존재함을 대조했다. R16의 ID별 JSX 역할표를 기초선으로 삼고, 이번에는 긴 텍스트의 최소 크기/줄바꿈, flex header shrink, SVG·plot label 경계, open 상태 경로와 panel/header radius 역할을 다시 스캔했다.
- source only. 제품 파일, 공유 CSS, build, Git, 브라우저에 접근하지 않았다. 아래 내용은 소스에서 유도한 재현 후보이며 화면에서 확인된 결함으로 단정하지 않는다. 실제 브라우저 재현·우선순위·수정은 root 소유다.
- R16 `.worknotes/embedded-control-harmony-r16-2026-10-16.md`에 기록된 초기 geometry 8,640건 오류·가로 넘침 0건은 그대로 참고했다. 이번에 page-wide overflow sweep를 반복하지 않았다.
- 소스 우선순위상 unlayered `@scope ([data-design]:not([data-design="basic"]))`의 `design-modes.css` 선언은 Tailwind utility layer보다 우선할 수 있다. 좁은 수정 시 mode-surface selector와 class utility가 동일 속성을 경합하는지 root가 확인해야 한다.
- 호출자가 슬롯에 넣는 임의 children/code와 의도된 scroll, chart plot clipping, chart/treemap marks, thumbnail crop, avatar 원형, shadow 및 overlap은 문제 후보로 처리하지 않았다.

## 우선 브라우저 재현 후보

아래 후보는 모두 “조건부 source gap”이다. 재현 조건은 긴 한글·영문 단일 토큰과 320px 근처의 좁은 panel, 명시된 열린 상태를 포함한다. root가 실제로 가장자리 침범·형제 압박·클리핑을 확인한 경우만 수정 대상으로 삼는다.

| ID | 소스 위치와 근거 | 재현 조건 | 좁은 수정 방향 / 보존 사항 |
|---|---|---|---|
| `lightbox` | `packages/ui/src/components/lightbox.tsx:106-113, 125-126`; `DialogTitle`(`dialog.tsx:69-78`)은 `text-base`만 지정. Lightbox header는 `flex items-start justify-between`; 제목에 `min-w-0`나 wrapping 규칙이 없고 닫기 버튼과 sibling이다. Caption도 일반 `<p>`에 강제 줄바꿈이 없다. Catalog 예시는 짧은 `여행 사진`/짧은 caption(`apps/docs/src/catalog.tsx:6581-6606`). | Frame lightbox를 열고 매우 긴 단일 토큰 제목 또는 caption을 준다. 좁은 dialog에서 제목이 close action을 밀거나 panel 안쪽/바깥쪽 경계를 넘는지 확인한다. | 제목만 shrink/wrap되게 하고 close action의 intrinsic hit area와 focus ring을 고정한다. Caption에는 필요한 곳에 `overflow-wrap:anywhere`를 좁게 적용한다. Immersive/fullscreen geometry·이미지 비율·썸네일의 intentional horizontal scroll은 유지한다. |
| `toast` | `packages/ui/src/components/toast.tsx:87-103`; content wrapper는 `min-w-0 flex-1`이나 title/description node 자체에는 break/truncate 규칙이 없다. Close button은 옆 flex item이다. CSS `design-modes.css:916-917`는 Toast header의 padding/min-height/radius를 reset할 뿐 text wrapping은 정하지 않는다. Catalog toast 제목은 짧은 문구(`catalog.tsx:4090-4105`). | 좁은 viewport에서 toast를 open 상태로 두고 title에 URL/hash 같은 공백 없는 긴 토큰, description에 긴 내용을 준다. 닫기 `×`와 텍스트가 서로 밀거나 카드 모서리 밖에 그려지는지 본다. | 긴 문자열 대응이 확인되면 visible title 및 plain text description에만 `overflow-wrap:anywhere` 또는 동등한 규칙을 준다. Close action의 shrink-0/focus/hit target, toast 위치와 표면 그림자는 보존한다. Description은 ReactNode이므로 임의 자식 전체에 제한을 걸지 않는다. |
| `terminal` | `packages/ui/src/components/terminal.tsx:111-120`; panel header는 `flex items-center justify-between`, label `<span>`은 min-width/wrap 없이, 오른쪽 `pending` status와 한 줄로 배치된다. Root `grid min-w-0 overflow-hidden`만으로 label의 min-content 폭이 줄어들지는 않는다. | panel Terminal을 좁게 열고 긴 단일 토큰 label을 넣는다. pending=true도 켜서 label과 status 사이에 header overflow 또는 overlap이 생기는지 재현한다. | label을 `min-w-0`로 줄이고 의미가 보이도록 break/wrap을 허용하거나, 좁은 폭에서 header가 wrap하도록 한다. pending status는 shrink-0로 분리하고 log 영역의 의도된 scroll을 유지한다. |
| `data-chart` | `packages/ui/src/components/data-chart.tsx:368-380, 239-265, 541-549, 588-608, 666-700`. Title/unit은 `justify-between` flex row에서 폭 처리가 없고, x축 SVG `<text>`는 모든 tick을 `textAnchor="middle"`로 그린다. chart width는 label 문자열 길이가 아니라 category 수와 slot width만 반영한다. 첫/마지막 tick은 SVG 양 끝 가까이 놓여 긴 값이 viewport edge에 잘릴 가능성이 있다. hover tooltip은 title과 dt에 wrapping이 없고 값 dd는 shrink하지 않는다. Legend는 flex-wrap을 하지만 label span에는 `min-w-0`/wrap이 없다. Catalog category labels는 짧은 요일이며 일반 title도 짧다(`catalog.tsx:3864-3883`). | narrow chart에 긴 첫/마지막 category와 긴 연속 label·series name을 넣는다. Hover summary는 양끝 tick을 번갈아 hover하고, inspector/legend가 켜진 경우도 확인한다. 축 문자열 overlap/edge clipping 및 tooltip의 label/value collision 여부를 본다. | 확인되는 가장자리 tick만 시작/끝 anchor 또는 필요한 좌우 inset으로 안전하게 두고, title/unit flex를 min-width 기준으로 정리한다. Tooltip의 label/value 폭 분배와 legend label wrap을 해당 자식에만 적용한다. Plot 자체의 horizontal scroll과 접근성용 숨은 data table, chart marks는 보존한다. labelStep가 현재 카테고리 수만 보므로 긴 category에 대한 간격 정책은 시각 재현 뒤 최소 변경으로 결정한다. |
| `file-upload` | `packages/ui/src/components/file-upload.tsx:77-89, 153-169`; row와 제목은 `min-w-0`/`break-all` 처리가 있으나 error `<p role="alert">`는 `mb-0 mt-1 text-xs text-danger`만 있어 임의 오류 문자열의 unbroken token은 줄바꿈 보장이 없다. | 좁은 upload row에서 failed item에 긴 URL/hash 등 공백 없는 `error`를 넣는다. Alert text가 row의 border/padding을 넘는지 확인한다. | 재현될 경우 role=alert 문단에만 overflow wrapping을 추가한다. `break-all`로 처리된 filename, 상태·progress, 액션 버튼의 배치는 유지한다. |
| `model-selector` | `packages/ui/src/components/model-selector.tsx:154-165`; selected model label/provider 행은 `flex flex-wrap justify-between`, `<strong data-slot="surface-title">`는 폭/줄바꿈 제한 없이 sibling provider와 정렬된다. Root는 `min-w-0`이지만 label child의 긴 단일 토큰을 자르지는 않는다. | 좁은 panel, selected state에서 매우 긴 model label/provider를 사용한다. 이름과 provider가 겹치거나 panel 안쪽 경계를 넘는지 확인한다. | 확인될 경우 label에 min-width 0 + wrap 또는 두 줄 레이아웃을 국소 적용하고 provider/status 의미를 보존한다. Trigger/field와 open combobox option 표면은 건드리지 않는다. |

## 나머지 지정 ID의 점검 여부

63개 중 위 6개 외 57개는 source/catalog 존재 대조 및 overflow/layout hook scan을 완료했으며, 이번 새 R17 후보로는 올리지 않았다. 이 판정은 모든 runtime state의 visual pass를 뜻하지 않는다.

| Family | 이번 후보 외 ID (source 확인, 추가 R17 후보 없음) |
|---|---|
| Data display (8) | `badge`, `avatar`, `avatar-group`, `table`, `data-list`, `item-list`, `pagination`, `data-table` |
| Data & analytics (19) | `metric-card`, `filter-bar`, `query-builder`, `sparkline`, `bar-list`, `bullet-chart`, `funnel-chart`, `waterfall-chart`, `box-plot-chart`, `histogram-chart`, `treemap-chart`, `radar-chart`, `sankey-chart`, `pivot-table`, `donut-chart`, `calendar-heatmap`, `heatmap`, `scatter-chart`, `dashboard` |
| File & media (4) | `image`, `image-cropper`, `avatar-uploader`, `dropzone` |
| Developer tools (9) | `snippet`, `code-block`, `code-editor-shell`, `diff-viewer`, `markdown`, `markdown-editor`, `log-console`, `log-viewer`, `json-viewer` |
| AI & agent (9) | `message`, `conversation`, `citation-list`, `artifact-viewer`, `reasoning`, `tool-call`, `agent-status`, `approval-card`, `prompt-input` |
| Feedback (8) | `alert`, `progress`, `skeleton`, `empty`, `result-state`, `spinner`, `notification-center`, `response-feedback` |

Family별 잔여 수는 Data display 8 + Data & analytics 19 + File & media 4 + Developer tools 9 + AI & agent 9 + Feedback 8 = 57이다. 6 candidate ID는 `lightbox`, `toast`, `terminal`, `data-chart`, `file-upload`, `model-selector`다.

No-additional-candidate scan notes:

- `data-table`, `pivot-table`, `histogram-chart`, `sankey-chart`, `treemap-chart`의 overflow containers는 긴 tabular/code/data 표현을 담기 위한 명시적 가로 scroll frame이다. page spill로 간주하지 않았다.
- `data-chart`, `scatter-chart`, `calendar-heatmap`, `heatmap`의 plot/grid scroll은 의도된 local navigation이다. `message`는 `[overflow-wrap:anywhere]`, `json-viewer`/`code-block`은 각각 long-value wrap 또는 title truncate/reading-plane scroll을 이미 가진다.
- `notification-center`는 제목·메시지에 `break-words`, row title/media metadata에 min-width 처리를 준다. `agent-status`, `approval-card`, `artifact-viewer`는 각각 wrap/`break-words`/`min-w-0` 또는 flex-wrap이 확인되어 새 gap으로 선택하지 않았다.
- charts의 figure title, short metrics, progress/avatar marks, selected/keyboard focus decoration은 현재 JSX/CSS에서 확인한 범위로는 의도적 role styling이다. 자동 radius/overflow clamp 후보를 발견하지 않았다. 실제 crop·overlap은 root visual review가 필요하다.
- shared CSS `design-modes.css:837-923`의 panel/well/header/media/status recipe는 panel radius, clipping/scroll과 selection/action roles를 분리한다. `overflow-hidden`이 있는 Conversation, cards, media frame은 shadow·thumbnail·message overlap을 먼저 재현하지 않고 제거 대상으로 삼지 않는다.

## 실행 환경과 인계

- Parent task에는 model/effort 선택 요청값이 명시되지 않았다. 이 정적 source pass에서 runtime model/effort metadata도 관찰하지 못했다. UI 브라우저 runtime 관찰은 없음.
- root는 위 여섯 후보를 열린 상태/긴 문자열/narrow panel로 재현하고, 실제로 보이는 경계 침범만 제품 수정으로 진행한다. 이 note는 source-leaf handoff이며 제품 수정은 미완료 상태다.
