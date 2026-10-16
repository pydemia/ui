# Controls / overflow source audit R17

- 범위: `.worknotes/browser-evidence/geometry-r14/inventory.json`에서 Actions, Inputs, Selection, Date & time, Overlays에 속한 53개 ID.
- 방법: `packages/ui/src/components/` 구현과 관련 `apps/docs/src/catalog.tsx` 예시를 읽고, `packages/ui/src/design-modes.css`의 unlayered override 및 geometry 관련 규칙을 확인. 제품 파일·브라우저·build·Git 상태는 건드리지 않음.
- 한계: 아래 항목은 source-only 후보이다. 실제 viewport/theme에서 paint나 경계 침범을 확인한 것은 아니며, 주 에이전트의 브라우저 재현 전에는 결함으로 확정하지 않는다. R16의 정적 geometry 8,640건 무오류 결과와 모순되지 않도록 조건부 상태를 적었다.

## 우선 재현할 후보

1. **TagsInput의 긴 토큰이 chip/frame을 밀어낼 가능성** — `packages/ui/src/components/tags-input.tsx:157-167, 189-194`, `data-ui="field-frame"` / `data-slot="field-chip"`. chip은 flex-wrap 목록 안에 있지만 chip 안의 `{tag}`에 폭 제한이나 word-break가 없고 `li`도 `inline-flex`라, 공백 없는 긴 파일명·URL을 태그로 추가하면 해당 chip의 min-content 폭이 field frame보다 커질 수 있다. 320px 또는 좁은 카드에서 긴 단일 토큰을 추가하고 focus 상태로 좌우 paint/outline 경계를 재현한다. 재현되면 chip text를 `min-w-0` 및 `overflow-wrap:anywhere`로 제한하고 삭제 버튼은 `shrink-0`로 보존하는 쪽이 좁은 수정이다. 기본 짧은 태그 사례는 `catalog.tsx:831-855`의 React/Tailwind뿐이라 현재 예시는 놓친다.

2. **Tooltip의 무공백 내용이 max-width를 넘어 paint될 가능성** — `packages/ui/src/components/tooltip.tsx:16-35`, `TooltipContent`의 `max-w-xs`. 폭 상한은 있으나 내용에 줄바꿈 규칙이 없다. 긴 URL/hash/공백 없는 식별자를 tooltip에 넣고 trigger를 viewport 양끝에서 hover 및 keyboard focus하면 bubble box 안쪽 텍스트가 잘리거나 viewport 밖으로 그려지는지 확인한다. 재현되면 `overflow-wrap:anywhere`를 기본 content에 더하는 방향을 검토한다. 문서 예시는 짧은 한글 안내라 해당 경계를 시험하지 않는다 (`catalog.tsx:6234-6250`).

3. **ButtonGroup의 긴 가로 그룹이 좁은 부모를 넘길 가능성** — `packages/ui/src/components/button-group.tsx:29-47`, `data-ui="button-group"`. horizontal 기본값은 `inline-flex w-fit max-w-full`이지만 wrap/scroll containment가 없고 direct button들을 한 줄로 둔다. 좁은 카드/320px에서 버튼 4개 이상 또는 긴 label로 재현하며 group border와 마지막 child가 부모 폭을 침범하는지 확인한다. 버튼 그룹은 조작 전체를 보존할 수 있도록 재현 시 `overflow-x-auto` 같은 지역 경계 처리를 우선 검토한다. 예시는 짧은 label 두 개라 기본 폭 sweep에서 재현되지 않을 수 있다 (`catalog.tsx:582-620`).

4. **TabsList의 긴/다수 탭이 좁은 부모를 밀어낼 가능성** — `packages/ui/src/components/tabs.tsx:12-33`, `data-ui="tabs-list"`. list는 `inline-flex gap-1`만 지정되어 max-width, wrap 또는 가로 스크롤 경계가 없다. 좁은 카드에서 탭 수를 늘리거나 각 label을 길게 하고, line/default/contained 세 variant에서 list와 focus ring이 부모 밖으로 나오는지 재현한다. 재현되면 list 내부의 가로 스크롤 또는 명시적 줄바꿈을 variant 의미와 keyboard focus visibility를 확인하며 추가한다. catalog 예시는 2개의 짧은 label만 사용한다 (`catalog.tsx:5484-5493, 6887-6896`).

5. **RadioGroup card의 무공백 label/description이 카드에서 나올 가능성** — `packages/ui/src/components/radio-group.tsx:35-64`, `[data-variant="card"]`. 텍스트 래퍼에는 `min-w-0`가 있으나 label/description span에 `break-words`/`overflow-wrap`이 없다. 320px 폭 카드에 공백 없는 URL 또는 긴 ID를 label/description으로 전달했을 때 card/focus outline 경계를 넘는지 확인한다. 재현되면 두 text node에만 임의 줄바꿈을 적용하고 control indicator의 shrink 방지는 유지한다. catalog 예시 문구는 모두 짧다 (`catalog.tsx:1180-1185`).

6. **DropdownMenu 항목의 긴 토큰과 panel 가로 경계** — `packages/ui/src/components/dropdown-menu.tsx:13-21, 24-35`. content는 min-width와 max-height/vertical scrolling을 지정하지만 max-width를 별도로 제한하지 않고, `itemStyle`은 긴 text wrapping을 규정하지 않는다. 열린 메뉴에 무공백의 긴 항목 label을 넣고 viewport 가장자리에서 Radix collision 후 panel과 텍스트가 화면 안에 남는지 재현한다. 실제 경계 침범이 확인되면 available-width 기반 max-width와 item text wrapping을 제한 범위 내에서 검토한다. 일반 짧은 메뉴 예시는 `catalog.tsx:5946-5995`.

## 범주별 검사 결과

- **Actions (8/8)**: `button`, `icon-button`, `button-group`, `copy-button`, `action-bar`, `toggle`, `toggle-group`, `favorite-toggle`. ButtonGroup을 우선 후보로 기록. ToggleGroup은 horizontal일 때 이미 `overflow-x-auto`와 `shrink-0` item을 사용해 의도적인 내부 스크롤로 분류; ActionBar는 `flex-wrap`을 사용.
- **Inputs (14/14)**: `input`, `search-input`, `input-group`, `number-input`, `tags-input`, `color-input`, `password-input`, `pin-input`, `rating`, `label`, `textarea`, `affixed-input`, `field`, `editable`. TagsInput을 긴 chip 후보로 기록. InputGroup control은 `min-w-0 flex-1`; affixed frame은 `overflow-hidden`으로 containment 명시.
- **Selection (13/13)**: `checkbox`, `native-select`, `switch`, `radio-group`, `segmented-control`, `slider`, `range-slider`, `select`, `combobox`, `autocomplete`, `multi-select`, `transfer-list`, `tree-select`. RadioGroup card 긴 토큰을 후보로 기록. SegmentedControl, ToggleGroup은 가로 scroll; Select/Combobox/Autocomplete/MultiSelect/TreeSelect의 list 영역은 max-height 및 vertical scroll이 있다. TreeSelect panel의 `min-w-64 max-w-[calc(100vw-2rem)]`는 최소 viewport 사례에서 실측 확인 대상으로 남김.
- **Date & time (7/7)**: `calendar`, `date-picker`, `month-picker`, `year-picker`, `date-range-picker`, `time-picker`, `date-time-picker`. 캘린더 기본 월 폭은 15.75rem, max-width가 적용되고 일자 버튼은 9단위 고정 크기다. unlayered material CSS는 `.rdp-month`를 280px/max-width 100% 및 줄바꿈 가능한 month container로 덮고, 일자 열을 7개 flexible track으로 둔다 (`design-modes.css:806-826`). CSS에서 명백한 잘림은 확정하지 않았으며, 두 달 range picker/320px 열린 상태 및 focus 경계를 브라우저에서 확인 필요.
- **Overlays (11/11)**: `dialog`, `command-palette`, `drawer`, `dropdown-menu`, `context-menu`, `tooltip`, `accordion`, `collapsible`, `popover`, `hover-card`, `alert-dialog`. DropdownMenu와 Tooltip을 후보로 기록. Dialog/AlertDialog는 viewport 기준 max-height와 vertical scroll, Popover/HoverCard는 `max-w-[calc(100vw-2rem)]`, CommandPalette는 Dialog 내부에 배치. 의도된 overlay shadow/portal 및 스크롤은 결함으로 보지 않음.

## 디자인 모드 cascade 메모

`design-modes.css`의 mode 규칙은 unlayered이고 Tailwind layer보다 우선한다. 해당 파일의 calendar 규칙(806-826)은 320px 기준 month 폭을 유연화하므로 단순히 TSX의 고정 15.75rem만 보고 overflow로 판정하지 말 것. 이번 후보들에서 mode 전용 override가 직접 원인이라는 소스 근거는 발견하지 못했다. Skeuo/Clay/Bento/Swiss의 `--calendar-gap` 값(602, 613, 635, 638행)은 mode별 의도적인 시각 간격이며, 그 자체를 정렬 버그로 보지 않는다.
