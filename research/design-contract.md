# Prototype 설계 계약

대상은 제품별 API와 디자인 체계가 정해지기 전의 `@pydemia/ui` 첫 vertical
slice입니다. 기존 repository와 brand palette가 제공되지 않아 color는 임시
내부 선택이며 사용자 승인 색상으로 기록하지 않습니다.

| ID | 조건과 결정 | 구현 | 확인 방법 |
| --- | --- | --- | --- |
| R1 | source를 직접 runtime에 혼합하지 않고 검토한 코드만 내부 소유 | `packages/ui`, `registry.json` | 패키지 의존성, source 경로 검사 |
| R2 | shadcn foundation 5–10개와 Origin/Kibo 각 1개 | 6개 foundation, AffixedInput, Snippet | exports와 provenance 대응 |
| R3 | 출처·license·의존성·profile·접근성 상태 기록 | `registry/provenance.json` | `registry:check` |
| R4 | 공통 시각 규칙과 light/dark, 줄어든 motion | `packages/ui/src/styles.css` | CSS 빌드·브라우저 확인 |
| R5 | 대표 profile page에서 실제 조합·상태 확인 | `apps/profile-demo` | 검색·탭·복사·입력·theme 조작 |
| C1 | 외부 source bulk import 금지 | 소스별 선택한 한 파일만 변형 | component 파일 목록 |
| C2 | 과도한 radius/shadow/motion 금지 | 5px radius, 얇은 border, 작은 shadow, 150ms | token 검사·시각 검토 |

## 화면과 상태

선택된 Developer Tool profile page의 DOM 순서는 header → 설명 → 목록 및
코드 → 입력 preview입니다. 넓은 화면은 2열이고 좁은 화면은 한 열입니다.
목록은 이름/source/category를 찾고, 결과가 없으면 빈 결과 문장을
표시합니다. Snippet은 두 탭을 선택해 해당 문자열을 복사합니다. 우측의
경로 입력과 검토 버튼은 local React state만 변경합니다. 실제 등록·권한
변경·네트워크 요청은 없습니다.

| State owner | 상태 | 경계 |
| --- | --- | --- |
| 페이지 | 검색어, 경로 입력, 데모 검토 표시, 현재 코드 탭, theme | 새로고침 후 초기화 |
| SnippetCopyButton | 현재 value에 대한 성공/실패 메시지 | 탭 변경 시 이전 메시지 숨김 |
| Radix Tabs | tab roles, focus, keyboard movement | package dependency |
| CSS | color, typography, spacing, radius, border, shadow, focus, motion, density | 외부 source 색상 미사용 |

## Token과 컴포넌트 계약

- Typography: `--font-ui`, `--type-body-size`, `--type-caption-size`,
  `--type-body-leading`. 숫자 표기는 데모의 경로를 제외하고 tabular data가
  없어 별도 숫자 token을 두지 않았습니다.
- Spacing: `--space-1/2/3/4/6`. 컴포넌트 내부는 이에 대응하는 Tailwind
  utility와 control padding을 사용합니다.
- Surface: `--background`, `--surface`, `--surface-subtle`, `--border`,
  `--overlay`, `--radius`, `--shadow-float`; border 두께는 1px입니다.
- Semantics: `--foreground`, `--muted`, `--accent`, `--accent-foreground`,
  `--focus`, `--danger`를 light/dark에 각각 할당합니다.
- Message: `--message-user-background`와 `--message-user-foreground`는
  두 테마에서 사용자 발화의 어두운 배경과 밝은 글씨를 유지합니다.
- Motion/density: `--motion-fast`, `--density-control-height`,
  `--density-row-block`. `prefers-reduced-motion`에서는 transition과
  animation을 줄입니다.

`AffixedInput`의 `label`은 필수이고 prefix/suffix는 장식적인 표시만 맡습니다.
실제 저장값이 prefix/suffix를 포함해야 하는 제품은 상위 form에서
명시적으로 합쳐야 합니다. `Snippet`은 Tabs를 조합하며 모든 trigger는
keyboard focus를 받고 복사 버튼은 이름과 상태 텍스트를 갖습니다.

## 선택과 보류

| 결정 | 상태 | 이유 |
| --- | --- | --- |
| shadcn convention + Radix Tabs | user-specified foundation / agent-selected primitive | 키보드 탭 동작을 검증된 primitive에 맡김 |
| Origin `comp-13` | agent-selected | 의존성이 작고 일반 Input variation을 입증 |
| Kibo `Snippet` | agent-selected | code/developer category를 채우며 탭/복사 상호작용 검증 |
| neutral teal palette | agent-selected provisional | 원본 브랜드 token 부재; 의미색 대비를 확보 |
| 대상 Git repository 연결 | completed 2026-09-28 | `pydemia/ui`에 prototype과 문서 사이트 편입 |
| Tremor, AI Elements 코드 편입 | pending requirement | prototype 이후 product profile 필요 시 개별 선정 |

## 참고한 대표 사례

| Source | 확인한 특성 | 전이한 범위 |
| --- | --- | --- |
| [Origin comp-13](https://github.com/shadcn/originui/blob/f4f366ae39759248d46b1252c52fbdc0bc01c285/registry/default/components/comp-13.tsx) | 입력 앞·뒤 affix, Label과 Input 조합 | 시각 배치, label 관계. 화폐 문구와 고정 색상은 제외 |
| [Kibo Snippet](https://www.kibo-ui.com/components/snippet) | tabbed code, copy action, Radix Tabs | 구획과 상호작용. hover에만 보이는 copy 버튼은 제외 |
| [shadcn registry schema](https://ui.shadcn.com/docs/registry/registry-item-json) | source item과 dependency 선언 | 정규화된 내부 registry 원본 |

코드와 문서로 본 특성입니다. 브라우저가 로컬 주소를 열지 못해 pixel,
hover, 실제 responsive 화면의 시각 관찰은 수행하지 못했습니다.

## 2026-09-28 폼 입력 확장

- `Field`는 자체 label이 없는 control에 `id`, 설명·오류 ID,
  `aria-invalid`, `aria-required`를 전달합니다. 실제 필수값·형식 검사는
  소비자 form이 맡습니다.
- `Select`는 검색 없는 단일 선택입니다. Radix Select가 option 탐색과
  form 값을 관리하며, `Field`는 trigger에 이름을 연결합니다.
- `DatePicker`는 `YYYY-MM-DD` 달력 날짜 또는 `null`만 받습니다.
  시각·시간대 값은 이 API에 넣지 않습니다. hidden input의 빈 값은
  빈 문자열이며, 오류 표시는 소비자 form과 `Field`가 맡습니다.
- registry 설치는 `pyd-tokens` stylesheet를 함께 설치하고 소비자 CSS에서
  import해야 공통 token을 적용합니다. 배포 JSON의 내부 의존성은
  공개 URL로 변환하고 파일 target은 소비자의 `@ui/` 경로로 지정합니다.

## 2026-09-29 PageHeader 크기

`PageHeader`의 `size`는 compact·default·hero 중 제목과 부제목의 시각적
크기 및 간격만 선택합니다. 기본값은 기존 스타일입니다. 문서 계층은
별도 `level`(h1/h2)이 결정하며 크기로 heading 수준을 추론하지 않습니다.

## 2026-09-29 기간 선택

`DateRangePicker`는 `null`, `{ from, to: null }`, `{ from, to }`를
각각 미선택·부분 선택·완료 상태로 받습니다. 두 날짜는 `YYYY-MM-DD`
문자열이며 `startName`과 `endName`을 지정하면 별도 hidden input으로
제출합니다. 빈 값은 빈 문자열입니다. 완료된 기간의 필수값 검사는
소비자 form이 맡습니다. `minDate`·`maxDate`와 `minNights`·`maxNights`는
달력 선택과 전달된 값을 제한합니다. 완료 또는 초기화 시 popover를
닫고, 완료된 범위를 다시 선택하면 새 범위를 시작합니다.

## 2026-09-29 분석 필터

`FilterBar`는 이름 있는 form 안에 소비자가 제공한 필터 control을
배치합니다. `onApply`는 제출 시 `FormData`를 받고 기본 form 제출은
막습니다. `onClear`는 소비자의 draft/applied 상태를 지우며 native
form도 초기화합니다. `dirty=false`면 중복 적용을 막고, `pending` 중에는
두 동작을 비활성화합니다. 적용된 조건은 ID가 고유한 label·value
목록으로 표시합니다. bar·panel 표현은 같은 동작을 공유합니다.
실제 데이터 필터링은 소비자가 소유합니다.

## 2026-09-29 다중 계열 차트

`DataChart`의 기존 `points` 입력은 단일 계열로 유지합니다. 다중 계열은
공통 `categories`와 각 계열의 고유 `id`, 표시 `label`, 범주와 길이가
같은 `values`를 받습니다. 두 입력 방식은 함께 사용할 수 없습니다.
`null`은 0이 아닌 결측값으로, 선형·영역 경로를 끊고 막대는 생략합니다.
막대는 범주별로 그룹화하며 영역은 누적하지 않습니다. 모든 계열은
같은 Y축을 공유하고, 범례는 이름과 색을 표시합니다. 시각적인 선의
패턴도 계열별로 다르게 합니다. 숨겨진 데이터 표에는 범주별 모든
계열 값과 결측 상태가 포함됩니다. 계열 표시 toggle·tooltip·누적
영역은 현재 API에 포함하지 않습니다.

## 2026-09-29 콘텐츠 Carousel

`Carousel`은 고유 ID·이름·내용을 가진 슬라이드를 한 번에 하나씩
표시합니다. 처음에는 첫 항목을 선택하고 `activeId` 또는
`defaultActiveId`로 시작 위치를 지정할 수 있습니다. controlled
상태에는 변경 callback이 필요합니다. 선택 항목이 삭제된 uncontrolled
상태는 첫 남은 항목으로 돌아가며, 존재하지 않는 controlled ID는
오류로 알립니다. 빈 목록에는 메시지만 표시합니다.

이전·다음 버튼은 끝에서 비활성화하고 `loop`를 지정하면 순환합니다.
선택 버튼과 card/plain 변형은 선택 사항입니다. 터치의 수평 이동은
48px 이상이고 수직 이동보다 클 때만 처리하며, 슬라이드 안의 링크와
입력·버튼에서 시작한 동작은 가로채지 않습니다. 자동 재생과 시간 기반
전환은 제공하지 않습니다. 현재 슬라이드만 DOM에 있어 숨긴 내용의
focus 대상이 남지 않습니다.

## 2026-09-29 일반 이미지

`Image`는 `<img>`를 감싸 비율, cover/contain 맞춤, 선택적인 frame,
로딩·누락·오류 화면을 제공합니다. `src`는 비어 있지 않은 URL 또는
`null`입니다. `null`은 이미지가 아직 없음을 뜻하고 잘못된 URL의 로딩
실패와 구분합니다. `aspectRatio`는 square/video/portrait 또는 양의
유한한 숫자입니다. `srcSet`·`sizes`·`loading` 등 native 이미지 속성과
`onLoad`·`onError`는 이미지 요소로 전달합니다.

정보 이미지는 `alt`에 설명을, 장식 이미지는 빈 문자열을 전달합니다.
실패한 이미지는 접근성 트리에서 숨기고 오류 문구를 상태로 표시합니다.
로딩 화면은 장식 요소입니다. 이미지를 가져오는 일과 오류 복구는
브라우저와 소비자가 맡습니다.

## 2026-09-29 JSON 탐색

`JsonViewer`는 이름 있는 영역 안에서 JSON 값의 중첩 구조를
`details`·`summary`로 탐색합니다. `defaultExpandedDepth`는 최초
펼침 깊이, `pageSize`는 각 객체·배열에서 한 번에 추가할 항목 수입니다.
접힌 하위 항목은 DOM에 렌더링하지 않습니다. 원본 JSON 복사 성공·실패는
상태 문구로 표시합니다. frame/plain 표현은 공통 색상 token을 씁니다.

문자열, 유한한 숫자, boolean, null, 일반 객체, 빈틈 없는 배열만
받습니다. 순환 참조, `undefined`, `NaN`, class instance와 getter는
오류로 알립니다. 같은 객체를 여러 위치에서 참조하는 것은 허용합니다.
입력값은 React의 일반적인 불변 데이터 규칙에 따라 새 참조로 갱신합니다.

## 2026-09-29 색상 입력

`ColorInput`은 6자리 `#RRGGBB` 텍스트 필드와 native 색상 선택기를
한 값에 연결합니다. `value`·`onValueChange`로 제어하거나
`defaultValue`로 자체 상태를 사용합니다. 올바른 값은 소문자로
전달하고, 불완전하거나 잘못된 입력은 필드에만 남겨 오류를 알립니다.
blur 시 입력 전의 유효한 값으로 되돌립니다. form에는 텍스트 필드의
`name`으로 제출하며, 색상 선택기는 별도 값을 제출하지 않습니다.

표시 가능한 `label`이 필수이고 오류는 해당 텍스트 필드와 연결됩니다.
card/inline 표현은 공통 색상 token을 사용합니다. 문서 Colormap
편집기는 이 컴포넌트를 사용하며 밝은·어두운 모드의 값은 문서 앱에서
각각 관리합니다.

## 2026-09-29 검색 입력

`SearchInput`은 이름 있는 search landmark와 native `type=search`
필드, 제출·초기화 버튼을 묶습니다. `value`·`onValueChange`로 제어하거나
`defaultValue`를 사용합니다. `onSearch`가 있으면 form 제출을 막고
입력 문자열을 그대로 callback에 전달합니다. callback이 없으면
`action`·`method`·`name`에 따른 native form 제출을 유지합니다.

초기화 버튼과 Escape는 입력값을 비우고 `onSearch("")`를 호출한 뒤
입력 필드에 focus를 둡니다. field 표현은 label을 표시하고 toolbar
표현은 같은 label을 시각적으로만 숨깁니다. 제출·초기화 버튼의 문구는
각각 지정할 수 있습니다. 이 컴포넌트 자체가 form이므로
다른 form 안에 중첩하지 않습니다. 서버 검색 결과, 필터링과 URL 상태는
소비자가 관리합니다.

## 2026-09-29 계층형 리소스 탐색

`Tree`는 파일·리소스 계층의 정적 노드 배열을 받습니다. 선택 ID와
확장 ID 목록은 controlled 또는 default 값으로 관리하고 callback으로
변경을 전달합니다. keyboard focus와 선택값은 별개입니다. 방향키는
보이는 항목 사이를 이동하며 disabled 노드와 그 하위는 조작에서
제외합니다. `ArrowRight`·`ArrowLeft`는 계층을 열고 닫거나 부모·
자식으로 이동하고 Enter·Space가 선택합니다. 일반 사이트 메뉴에는
기존 `Navigation`·`Sidebar`를 사용합니다. 비동기 로딩·drag 이동·
다중 선택은 현재 API에 포함하지 않습니다.

## 2026-09-29 대화 목록

`Conversation`은 안정적인 ID·발신자·내용을 가진 메시지 배열을 받아
기존 `Message`로 표시합니다. ID가 비었거나 중복되면 렌더링 오류로
알립니다. 이름이 있는 `log` 영역은 처음에 최신 메시지를 보여주고,
끝을 읽고 있을 때 추가된 메시지와 내용 높이 변화를 따라갑니다.
이전 내용을 읽는 동안에는 스크롤을 유지하고 새 메시지 수를 표시하며,
이동 버튼은 끝으로 스크롤한 뒤 `log`에 focus를 돌립니다. 배열이
교체되면 새 대화로 보고 최신 위치로 이동합니다. 과거 메시지
prepend와 가상 스크롤은 현재 API에 포함하지 않습니다.

## 2026-09-29 AI 작업 상태

`Reasoning`은 필수 label과 선택적인 생성 상태를 가진 disclosure입니다.
기존 `Collapsible`의 controlled·default open 동작을 그대로 전달하고,
inline 또는 card로 표시합니다. 내용을 닫아도 streaming·complete·
failed 상태는 보입니다. 펼친 내용만 streaming 중 `aria-busy`를
설정합니다.

`ToolCall`은 도구 이름과 pending·running·succeeded·failed 상태를
표시합니다. 입력은 native `details`에서 펼치며, 결과는 성공 상태에서,
오류는 실패 상태에서만 표시합니다. 결과와 오류가 상태에 맞지 않으면
렌더링 오류로 알립니다. card 또는 compact로 배치합니다. 두 component는
`MessageContent` 안에 넣을 수 있지만 대화 저장과 도구 실행은
소비자가 맡습니다.

## 2026-09-29 Colormap preview

- `packages/ui/src/styles.css`의 semantic color token은 대응하는
  `--palette-*` 변수의 alias입니다. `data-colormap`과 `.dark`가 palette
  값을 정하며 attribute가 없는 소비자는 기존 Neutral 색상을 사용합니다.
  Pydemia preset은 승인된 로고의 네이비 `#103344`와 로즈 `#ba365b`를
  기준으로 합니다.
- 문서 사이트에는 별도 Colormap 영역을 둡니다. preset 선택은 직접
  조정값을 지우고, hex 입력은 현재 light/dark 모드의 palette 변수만
  덮어씁니다. 문서의 직접 조정값은 서버에 저장하지 않습니다.
- 문서의 조합 예시는 별도 iframe입니다. 같은 origin의 문서가 선택을
  `postMessage`로 전달하고, 예시는 허용된 palette 이름과 6자리 hex만
  적용합니다. 전체 화면 링크는 현재 선택을 URL query로 전달합니다.
- 본문, Accent, User message의 텍스트 대비를 화면에 표시합니다.
  사용자가 입력한 임의 색상의 대비를 자동 보정하지는 않습니다.

## 2026-09-29 source 표시와 구현 소유

- `registry/provenance.json`의 `source`는 현재 배포 코드의 구현
  출처입니다. `reference`는 디자인·동작 참고 자료를 가리킵니다.
  두 필드의 license를 합쳐 표시하지 않습니다.
- shadcn/ui source를 변형한 항목은 고정 revision, MIT notice를
  유지합니다. 기타 reference는 자체 구현으로 관리합니다.
- 문서의 SOURCE는 구현 코드로, DESIGN REFERENCE는 참고 자료로
  연결합니다. `project-owned` 항목은 공개 LICENSE가 아직 없어
  「공개 사용 조건 미지정」으로 표시합니다.

## 2026-09-29 ContextMenu

`ContextMenu`는 focus 가능한 trigger에서 우클릭과 `Shift+F10`으로
열리는 메뉴입니다. 일반 `DropdownMenu`처럼 클릭 버튼을 메뉴 호출의
기본 동작으로 삼지 않습니다. Root·Trigger·Content 외에 item,
checkbox, radio, group, separator, submenu를 제공하며 item의 `danger`
표현을 지원합니다. checked 값과 action 결과는 소비자가 소유합니다.
문서 preview에서는 native button을 trigger로 써 keyboard 호출 경로를
보장합니다. 메뉴 배경·경계·글자·그림자는 공통 semantic token을 씁니다.

## 2026-09-29 NumberInput

`NumberInput`은 `label`이 필수이며 `value`/`onValueChange` 또는
`defaultValue`로 `number | null`을 관리합니다. `null`은 빈 값입니다.
`min`·`max`는 허용 범위를, 양수 `step`은 증감 폭을 정합니다. 사용자가
입력한 유효한 수를 step 배수로 강제하지 않습니다. `locale`은 표시와
입력 구분자를 정하며 Latin 숫자를 사용합니다. `field`와 `stepper`
변형은 같은 값·검증 동작을 공유합니다.

입력 중인 문자열은 확정 값과 분리합니다. 잘못된 숫자, 범위 밖 값,
필수값 누락은 안내 문구와 `aria-invalid`로 표시하고 native form 제출을
막습니다. 유효한 값은 blur·Enter·증감 조작으로 확정합니다. 이름을
설정하면 form에는 locale과 무관한 표준 숫자 문자열을 제출합니다.
입력 필드는 이름이 연결된 `spinbutton`이고 현재 값·범위·표시 문자열을
ARIA 속성으로 노출합니다. 방향키는 step만큼 이동하고 Home/End는
각각 설정된 min/max로 이동합니다. 토큰으로 색상·경계·focus를
표시하며 server 저장이나 소수 정밀도 보존 API는 제공하지 않습니다.

## 2026-09-29 TagsInput

`TagsInput`은 보이는 `label`이 필수이고 문자열 배열을 controlled
`value`/`onValueChange` 또는 `defaultValue`로 관리합니다. 태그는 앞뒤
공백을 제거해 저장하며 대소문자를 무시해 중복을 거부합니다. `maxTags`는
추가 가능한 수를 제한합니다. Enter·쉼표로 현재 입력을 추가하고,
쉼표나 줄바꿈이 있는 붙여넣기는 여러 태그를 한 번에 추가합니다.
입력창이 비었을 때 Backspace는 마지막 태그를 삭제합니다. 각 태그의
삭제 버튼도 동일한 값을 변경하고 입력창으로 focus를 돌립니다.

`name`이 있으면 태그별 hidden input으로 같은 이름의 form 값을
반복 제출합니다. 미확정 입력 문자열은 제출값에 넣지 않고 native
validity 오류로 제출을 막습니다. `required`일 때 태그가 없으면
입력창의 validity와 오류 문구로 알립니다. 중복이나 개수 초과는
현재 draft를 유지해 사용자가 수정할 수 있습니다. `outline`과 `soft`
변형은 같은 상태·제출 동작을 사용하며 semantic token으로 표시합니다.

## 2026-09-29 Spinner 형태

`Spinner`는 `icon`, `ring`, `dots`, `bars`, `orbit`을 지원하며 기본값은
`icon`입니다. 모두 SVG의 `status`와 기본 접근 가능 이름을 가지며
소비자는 `aria-label`로 맥락에 맞는 이름을 지정합니다. `className`으로
크기를 바꿀 수 있고 색상은 공통 accent token을 따릅니다. 알 수 없는
variant를 런타임에 받으면 `RangeError`를 던집니다.

`icon`·`ring`·`orbit`은 회전하고 `dots`·`bars`는 opacity를 바꿉니다.
`prefers-reduced-motion: reduce`에서는 각 애니메이션을 중지하고
도형을 정적으로 표시합니다. 진행률 수치는 표현하지 않습니다.

## 2026-09-29 NavigationMenu

`NavigationMenu`는 이름이 필수인 가로 `nav`입니다. List·Item·Trigger·
Content·Link를 조합해 상단 링크와 그룹 popup을 만듭니다. `active`
Link는 `aria-current="page"`를 갖습니다. Link의 `trigger` 표현은
상단 단일 링크에, 기본 `content` 표현은 열린 그룹 안의 링크에 씁니다.
`value`·`defaultValue`·`onValueChange`는 Radix Root의 제어 경로를
그대로 전달합니다. 라우팅과 현재 페이지 상태는 소비자가 소유합니다.

가로 탐색만 제공하며 그룹 내용은 해당 trigger 아래에 표시합니다.
Radix primitive가 pointer 열기, 방향키·Home/End 이동, Escape 닫기와
focus 복귀를 처리합니다. 토큰은 surface·foreground·border·focus와
floating shadow를 사용합니다. 작은 화면의 별도 drawer 전환은 기존
`Sidebar`가 맡습니다.

## 2026-09-29 DataChart 누적 막대

`DataChart`의 `stacked-bar` variant는 기존 `categories`·`series` 또는
`points` 입력을 사용합니다. 같은 범주의 양수와 음수는 0축 양쪽에
따로 쌓으며, 축 범위는 각 범주의 양수 합계와 음수 합계로 정합니다.
결측값 `null`은 막대를 만들지 않고 숨겨진 데이터 표에
`데이터 없음`으로 남깁니다. 0은 표에 남기되 높이 0인 도형을
그리지 않습니다. 각 입력값은 유한해야 하며 합계가 수치 범위를
넘어가면 `RangeError`를 던집니다.

기존 선형·그룹 막대·영역 variant의 입력과 범례·데이터 표는
유지합니다. 문서 preview는 누적 막대를 다중 계열로 보여주고
빈 데이터 상태도 시험할 수 있습니다. 색상과 경계는 공통 token을
사용합니다.

## 2026-09-29 HoverCard

`HoverCard`는 실제 목적지가 있는 링크의 보조 미리보기를 표시합니다.
Trigger는 anchor를 `asChild`로 받아 링크 이동을 유지합니다.
내용은 목적지의 요약에 한정하며 필수 정보나 유일한 동작을 넣지
않습니다. 결정이 필요한 popup은 기존 `Popover`나 `Dialog`를 씁니다.

Radix Root의 `open`·`defaultOpen`·`onOpenChange`, 열림·닫힘 지연을
그대로 전달합니다. pointer 진입과 keyboard focus에서 열리고 이탈과
Escape에서 닫힙니다. Content는 Portal에 렌더링하고 `side`·`align` 등
Radix 위치 속성을 받습니다. 배경·글자·테두리·shadow는 공통 token을
사용합니다. screen reader에는 카드 내용이 숨겨지므로 링크의 접근
가능한 이름과 목적지 내용은 소비자 앱이 제공해야 합니다.

## 2026-09-29 Toast queue

기존 controlled `Toast`와 `ToastRegion` API를 유지합니다.
`useToastQueue(maxVisible)`은 기본 3건을 FIFO 순서로 표시하고 나머지
건수를 `pendingCount`로 돌려줍니다. `maxVisible`은 양의 정수여야
합니다. `enqueue`는 새 알림을 추가하며 `dedupeKey`가 기존 표시·대기
알림과 같으면 반복 추가를 무시합니다. 키가 없으면 같은 내용도 각각
별도 알림입니다. `dismiss(id)`는 그 알림만 제거하므로 대기 중인 첫
알림이 다음 빈 자리에 나타납니다.

`ToastQueue`는 hook의 `visible` 목록을 기존 `Toast`·`ToastRegion`으로
그립니다. 정보·성공·경고는 `status`, 오류는 `alert`이고 닫기 버튼은
접근 가능한 이름을 갖습니다. 열린 알림은 자동으로 사라지지 않습니다.
알림 내용과 대기열은 hook을 호출한 컴포넌트의 React state가 소유하며
페이지 이동이나 새로고침 뒤에는 복원하지 않습니다. 큐에 있던 알림은
실제로 표시될 때 DOM에 생성되므로 그 전에는 발표되지 않습니다.

## 2026-09-29 DataChart 구간 선택기

`DataChart`의 `inspectable`은 기본 `false`여서 기존 정적 차트 사용을
유지합니다. `true`면 첫 범주를 선택하고, 그래프의 범주 영역에
pointer를 올리거나 클릭하면 해당 범주를 선택합니다. 같은 선택은
이름이 연결된 native `<select>`에서 keyboard·touch로 바꿀 수
있습니다. 선택한 범주의 각 계열 원본 값·단위를 보이는 `<dl>`로
표시하며 `null`은 `데이터 없음`으로 구분합니다. 차트에는 선택 범주의
세로 안내선을 공통 focus token으로 그립니다.

SVG는 기존처럼 보조기술에서 숨기고, 전체 값은 숨겨진 의미 있는
`<table>`에 남깁니다. 빈 범주 목록에는 선택기를 그리지 않습니다.
모든 값이 `null`이지만 범주가 있으면 빈 그래프 안내와 값 선택기를
함께 표시합니다. 차트 값·범례·데이터 계산과 외부 `points`·`series`
입력 규칙은 유지합니다. 별도 부유 tooltip은 추가하지 않았습니다.

## 2026-09-29 ToggleGroup

`ToggleGroup`은 보기 모드처럼 즉시 적용되는 토글 묶음입니다.
`type="single"`은 한 문자열, `type="multiple"`은 문자열 배열을
사용합니다. Radix는 단일 항목을 radio, 복수 항목을 pressed button으로
노출하고 그룹 안의 focus를 방향키로 옮깁니다. 방향키 이동만으로
상태를 바꾸지 않으며 Space 또는 Enter로 선택합니다. 단일 모드도
기본적으로 다시 누르면 선택이 해제됩니다. 항상 하나가 필요하면
소비자가 빈 `onValueChange` 값을 거부해야 합니다.

Wrapper는 Radix의 `value`·`defaultValue`·`onValueChange`,
`orientation`, `disabled`, `rovingFocus`를 전달합니다. 색·간격·높이와
focus 표시에는 공통 token을 사용합니다. native form 값이 필요한
선택에는 기존 `RadioGroup`을 사용합니다.

## 2026-09-29 PinInput

`PinInput`은 숫자 확인 코드의 입력값 하나를 여러 칸으로 보여줍니다.
`label`은 필수이고 `name`, `required`, `disabled`, `readOnly` 등
native input 속성을 전달합니다. `length` 기본값은 6이며 양의
정수여야 합니다. `groupSize`는 1부터 `length`까지 허용합니다.
controlled `value`에는 `onValueChange`가 필요하고 uncontrolled
초기값은 `defaultValue`로 받습니다. 값은 길이 이하의 ASCII 숫자만
허용합니다.

하나의 `<input type="text">`가 focus, form 값, native 유효성 검사와
자동완성 속성을 소유합니다. 표시용 칸은 보조기술에서 숨깁니다.
붙여넣기에서 숫자 아닌 문자를 제거하고 최대 길이로 자릅니다.
완성된 코드의 칸을 클릭하면 해당 숫자를 교체할 수 있습니다.
`outline`·`soft`는 공통 색상·크기 token을 사용합니다. SMS 입력과
실제 보조기술 발화는 별도 검증 대상입니다.

## 2026-09-29 Rating

`Rating`은 하나의 점수를 입력하거나 표시합니다. 입력 모드는
`fieldset`의 `legend`로 그룹 이름을 표시하고, 같은 `name`을 가진
native radio를 1부터 `max`까지 만듭니다. `name`을 생략해도 인스턴스별
이름을 생성해 radio가 한 그룹으로 동작합니다. `required`는 미선택
상태의 form 제출을 막습니다. `value`·`onValueChange`는 controlled,
`defaultValue`는 uncontrolled 사용을 위한 속성입니다.

`max`는 1~10의 정수이고 기본값은 5입니다. 점수 0은 미선택을 뜻하며
입력값은 정수여야 합니다. 선택한 점수와 최대치를 화면에 숫자로도
표시합니다. `stars`와 `segments`는 시각적 모양만 바꿉니다.
`readOnly`는 radio와 form 값을 만들지 않고 현재 점수를 이름 있는
이미지와 보이는 숫자로 표시합니다. `name`·`required`와 함께 쓰면
오류로 알립니다. 색상·focus에는 공통 token을
사용합니다. 실제 screen reader 발표는 확인하지 않았습니다.

## 2026-09-29 DataChart 누적 영역

`stacked-area`는 기존 `DataChart`의 `points` 또는
`categories`·`series` 입력을 사용합니다. 모든 값은 0 이상인 유한한
수 또는 `null`이어야 합니다. 음수와 합계 overflow는 `RangeError`로
거부합니다. 각 범주의 계열을 입력 순서대로 더해 누적 경계를 만듭니다.
영역은 공통 색상 token에서 가져온 계열별 색으로 채웁니다.

범주의 계열 중 하나라도 `null`이면 그 범주의 전체 합계는 알 수
없습니다. 모든 계열의 영역을 그 범주에서 끊고, 인접한 완전한
구간끼리만 영역을 연결합니다. 완전한 범주가 하나만 고립되면 점은
표시하지만 넓이가 없는 영역 polygon은 만들지 않습니다. 값이 일부
있어도 완전한 범주가 없으면 그릴 수 없다는 상태를 표시합니다.
숨긴 데이터 표는 원본 계열 값과 완전한 범주의 합계를 함께 담습니다.
`inspectable` 선택기에도 합계를 표시하며, 불완전한 범주는
`데이터 없음`으로 표시합니다. SVG는 장식으로 숨기고 표와 선택기에
값을 남깁니다.

## 2026-09-29 TimePicker

`TimePicker`는 `value: string | null`과 `onValueChange`로 제어합니다.
완성 값은 날짜·시간대 정보가 없는 로컬 시각 `HH:mm`입니다. `null`은
미선택이며 빈 문자열은 유효한 값으로 취급하지 않습니다. `name`을
주면 하나의 hidden input이 완성 값을 form에 전달합니다.
`null`은 form에서 빈 문자열로 직렬화합니다.

시·분·필요하면 오전/오후를 각각 이름 있는 native `<select>`에서
고릅니다. 일부만 고른 상태는 내부 draft로 유지하고 값으로 전달하지
않습니다. 이전 완성 값에서 한 부분을 지우면 `onValueChange(null)`로
form 값을 지웁니다. `required`이거나 부분 입력이 있으면 빈 select가
native form 제출을 막습니다. `fieldset`의 `legend`가 전체 이름을
제공하고, disabled 상태에서는 select와 form 값이 비활성화됩니다.

`hourCycle`은 `h12` 또는 `h23`이며 생략하면 locale의 기본값에서
결정합니다. `locale`은 숫자와 오전/오후 표시를 바꾸지만 form 값은
ASCII `HH:mm`으로 유지합니다. segment 이름은 한국어·영어 기본값을
두고 다른 언어는 `segmentLabels`로 지정할 수 있습니다.
`minuteStep`은 60의 양의 정수 약수이고 기본값은 5입니다. 입력값이
형식이나 step에 맞지 않으면 오류로 알립니다. 다른 시간대로의 변환과
날짜를 포함한 유효성 정책은 이 component의 범위가 아닙니다.

## 2026-09-29 ScrollArea

`ScrollArea`는 높이·너비가 정해진 부모 또는 자신의 `className` 안에서
내용을 스크롤합니다. `orientation`은 `vertical`(기본값), `horizontal`,
`both` 중 하나이며 대응하는 Radix scrollbar만 렌더링합니다. `type`은
Radix의 표시 정책을 그대로 받고 기본값은 `auto`입니다. 지원하지 않는
orientation과 비어 있는 label은 오류로 알립니다.

필수 `label`은 스크롤되는 viewport에 `aria-label`로 전달합니다.
viewport는 이름이 있는 `region`이고 `tabIndex=0`으로 키보드에서
초점을 받을 수 있습니다. focus ring과 scrollbar thumb는 공통 token을
사용합니다. `viewportRef`로 실제 스크롤 DOM을 참조할 수 있고 `dir`은
Radix root에 전달됩니다. 이 component는 스크롤 위치를 소유하지
않습니다. 내부 대화형 요소의 focus와 내용 순서는 소비자가 관리합니다.

## 2026-09-29 ButtonGroup

`ButtonGroup`은 별개의 작업 버튼을 하나의 이름 있는 그룹으로 묶습니다.
필수 `label`을 `aria-label`로 사용하고, `orientation`은 가로(기본값)와
세로만 허용합니다. 각 `Button`은 native click·Tab·Enter/Space·
disabled 동작을 유지합니다. 그룹은 선택값이나 실행 상태를 소유하지
않습니다. `ButtonGroupSeparator`는 시각적 구분선으로 `aria-hidden`을
사용합니다. 연결된 모서리·테두리와 focus 순서는 배치 방향에 맞춥니다.

## 2026-09-29 DateTimePicker

`DateTimePicker`는 `DateTimeSelection`의 `date`·`time`을 각각
`string | null`로 받는 controlled 조합입니다. 필수 `timeZone`은
`Intl.DateTimeFormat`이 지원하는 IANA 이름이어야 합니다. 이름이 있는
그룹 안에 기존 `DatePicker`와 `TimePicker`를 놓고 각 부분의 변경은
다른 부분의 값을 보존한 채 `onValueChange`로 전달합니다.

`name`을 주면 두 부분이 모두 완성됐을 때만 `YYYY-MM-DDTHH:mm`과
시간대 이름을 별도 hidden input에 씁니다. 일부만 선택됐으면 두 값은
모두 빈 문자열입니다. 두 번째 이름은 기본적으로 `${name}TimeZone`이며
`timeZoneName`으로 지정할 수 있습니다. disabled 상태에서는 두 form
값도 비활성화됩니다. 날짜 범위와 시각 형식·minute step은 기존 두
control의 규칙을 따릅니다.

이 값은 특정 UTC instant가 아니라 시간대가 명시된 로컬 날짜시각입니다.
DST 때문에 존재하지 않거나 둘로 해석되는 시각을 자동 보정하지
않습니다. 제출을 받는 앱이 해당 시간대의 날짜시각을 해석·검증하고
필요하면 중복 시각의 선택 정책을 정해야 합니다. 실제 screen reader
발표와 전체 keyboard 탐색은 별도 검증 대상입니다.

## 2026-09-29 CodeBlock

`CodeBlock`은 탭 없이 하나의 코드 문자열을 표시합니다. 필수 `label`은
보이는 `figcaption`과 코드 영역의 이름에 쓰며, `language`는
보이는 텍스트로만 표시합니다. 문자열은 React 텍스트 노드로 렌더링해
HTML로 해석하지 않습니다. 빈 코드는 허용하지만 복사 버튼은
비활성화합니다.

`wrap={false}`(기본값)는 `pre`의 공백·줄바꿈을 보존하고 긴 줄을
블록 안에서 가로 스크롤합니다. `wrap={true}`는 공백을 보존하면서
긴 줄을 접습니다. `pre`는 focus를 받아 키보드로 스크롤할 수
있습니다. `copyable={false}`면 복사 버튼과 상태 메시지를 렌더링하지
않습니다. 복사 요청의 성공·실패는 이름 있는 버튼 옆의 `role=status`로
알립니다. Clipboard API가 없는 환경도 실패 상태로 처리합니다.

`Snippet`은 여러 코드 탭을 조합할 때 사용하고 `CodeBlock`은 단일
코드·파일·응답 본문을 보여줄 때 사용합니다. syntax highlighting과
코드 실행은 현재 API에 포함하지 않습니다.

## 2026-09-29 Markdown

`Markdown`은 필수 `source` 문자열을 받아 안전한 문법 부분집합을
표시합니다. `#`~`###` 제목은 문서·메시지 안에 들어갈 수 있도록
`h2`~`h4`로 렌더링합니다. 빈 줄로 문단을 나누고, 연속한 줄의
`-`·`*`·`+` 또는 숫자 목록은 단층 목록으로 묶습니다. `**굵게**`,
`*강조*`, 단일 백틱 인라인 코드, 세 개 이상의 백틱·물결표 코드
블록과 `[이름](절대 URL)` 링크를 지원합니다. 코드 블록의 줄바꿈을
보존하고 키보드 스크롤을 위해 `pre`에 focus를 허용합니다.

링크는 사용자 정보와 제어 문자·역슬래시가 없는 절대 HTTP(S) 주소만
실제 `a` 요소로 만듭니다. 그 외 링크 문법, 이미지, 원시 HTML과
미지원 문법은 텍스트로 표시합니다. React가 텍스트를 escape하며
HTML 문자열을 직접 삽입하지 않고 `dangerouslySetInnerHTML` prop도
타입과 실행 시점에서 거부합니다. 상대 링크·복잡한 괄호가
있는 URL·중첩 목록·표·인용·reference link·HTML 렌더링은 지원하지
않습니다. 닫히지 않은 코드 fence는 남은 원문을 코드로 표시합니다.
강조의 재귀 깊이는 8단계로 제한합니다.

## 2026-09-29 MetricCard 표시 형태

`MetricCard`의 `variant`는 `default`, `compact`, `featured` 중 하나이며
기본값은 이전 배치를 유지합니다. `compact`는 label과 수치를 한 행에
놓고 보조 설명을 다음 행에 표시합니다. `featured`는 accent 배경과
큰 수치로 대표 지표를 구분합니다. 색상은 `--accent`와
`--accent-foreground` token을 사용합니다. 어느 형태든 label, 값,
변화, 기간의 텍스트와 이름 있는 group을 유지합니다. 지원하지 않는
variant는 `RangeError`로 알립니다. 값의 단위·변화 방향·기간의
의미는 호출자가 명시하며 component가 문자열에서 추론하지 않습니다.

## 2026-09-29 DataList

`DataList`는 필수 `label`로 이름 붙인 그룹 안에 전달 순서 그대로
`dl`의 `dt`/`dd` 쌍을 표시합니다. `items`의 각 항목은 고유한
`id`, 비어 있지 않은 `label`, 명시한 `value`가 필요합니다. 값은
ReactNode이며 `null`이면 `missingText`(기본 `값 없음`)로
표시합니다. 빈 문자열은 누락값으로 바꾸지 않습니다. 빈 목록은
`emptyText`(기본 `표시할 정보가 없습니다.`)를 표시하며 `dl`은
렌더링하지 않습니다. 중복 ID, 누락 필드, 지원하지 않는 layout은
오류로 알립니다.

`layout="rows"`(기본값)는 이름과 값을 한 행의 두 열에 놓습니다.
`layout="grid"`는 container 너비 320px부터 항목을 두 열로 놓고,
그보다 좁으면 한 열로 표시합니다. 순서·값·단위의 의미와 갱신 상태는
호출자가 소유합니다. 이 component 자체는 조작 요소가 없어 keyboard
interaction을 추가하지 않습니다. 실제 screen reader 발표는
확인하지 않았습니다.

## 2026-09-29 Badge 표시 형태

`Badge`는 기존 native `span`과 전달된 텍스트를 유지합니다.
`variant`의 기본값 `default`는 기존 중립색 class를 사용합니다.
`outline`은 투명 배경, `accent`는 accent 배경과 대응 foreground,
`danger`는 surface 배경과 danger 텍스트·테두리를 사용합니다.
지원하지 않는 variant는 `RangeError`입니다. variant는 시각 표현만
정하고 상태 이름은 호출자가 텍스트로 제공해야 합니다. component는
상태를 추론하거나 `role=status`를 임의로 추가하지 않습니다.

Operations workspace는 완료·실행 중·실패 각각에 기본·강조·위험
variant를 지정하며 모든 셀에 상태 이름을 표시합니다. 별도
`StatusIndicator` component는 만들지 않습니다. 실제 screen reader
발표와 모든 colormap의 대비는 별도로 검사해야 합니다.

## 2026-09-29 하단 탐색

`BottomNav`는 기존 `Navigation` item에 포함된 이름 있는 `<nav>`입니다.
`BottomNavLink`는 실제 `href`와 항상 보이는 `label`을 필수로 받는
native `<a>`입니다. icon은 선택적 장식으로 접근성 트리에서 숨깁니다.
현재 경로를 아는 호출자가 해당 링크에 `aria-current="page"`를
지정합니다. `BottomNav`는 URL, route 상태, fixed positioning을 소유하지
않으며 `AppBottomPanel` 안이나 화면 하단에 배치할 수 있습니다.
좁은 영역에서 목적지가 많으면 링크를 숨기지 않고 내부 가로 scroll을
사용합니다. Tab·Enter는 native 링크 동작입니다. label 또는 href가
공백이면 오류로 알립니다. 실제 화면 판독기와 touch 조작은 별도
검증 대상입니다.

## 2026-09-29 Navigation 링크 표시 형태

`GlobalNavLink`의 기본 `surface`와 선택적 `underline`,
`SideNavLink`의 기본 `rail`과 선택적 `filled`는 같은 native 링크에
적용하는 표시 형태입니다. 현재 페이지는 호출자가
`aria-current="page"`로 지정합니다. 밑줄형은 accent 테두리와 글자,
채움형은 accent 배경과 accent foreground를 사용합니다. variant는
목적지나 현재 route를 바꾸지 않습니다.

## 2026-09-29 SegmentedControl

`SegmentedControl`은 `label`, `name`, text가 있는 item과 고유한
`value`를 받습니다. `fieldset`·`legend`가 그룹 이름을 제공하고 각
item의 native radio가 선택값을 form에 전달합니다. item은 그룹의 직접
자식이어야 하며 빈 그룹과 중복 값은 오류입니다. controlled `value`와
uncontrolled `defaultValue`를 지원하며 선택 시 `onValueChange`를
호출합니다. `required`와 그룹·item의 `disabled`는 native 입력 규칙을
따릅니다. `name`을 생략하거나 공백으로 주면 오류로 알립니다.

기존 `RadioGroup`은 원형 표시와 별도 `Label` 조합을 유지하고,
`ToggleGroup`은 누름 상태를 다룹니다. 화면 밀도처럼 가로로 붙은
선택지를 form에 제출하는 경우에 이 component를 사용합니다. 그룹이
서버 저장이나 제출 결과를 소유하지 않습니다. 좁은 공간에서는
항목을 숨기지 않고 그룹 내부를 가로로 스크롤합니다. 실제 screen
reader 발표와 RTL은 아직 검증하지 않았습니다.

## 2026-09-29 SplitButton 조합 예시

`ButtonGroup`의 기본 `Button`은 즉시 실행합니다. `DropdownMenuTrigger`
안의 두 번째 `Button`은 대체 작업 메뉴를 열고 고유한 접근성 이름을
가집니다. `ButtonGroupSeparator`는 장식이며 메뉴 항목은 대체 작업을
실행합니다. 실행 상태와 결과 메시지는 예시 화면의 React state가
소유합니다. 그룹이나 메뉴가 해당 상태를 저장하지 않습니다.
별도의 `SplitButton` public API나 registry item은 만들지 않습니다.

## 2026-09-29 CitationList

`CitationList`는 필수 `label`로 section 이름을 정하고 전달된
`sources` 순서대로 native ordered list를 표시합니다. 출처마다 고유
`id`, 비어 있지 않은 `title`, 절대 HTTP(S) `href`가 필요합니다.
`location`·`excerpt`는 선택적이며 title·location·`새 탭` 문구가
링크 안에 보입니다. 링크는 `noopener noreferrer`와 함께 새 탭에서
열립니다. 빈 배열은 `emptyText`를 표시하고 목록을 만들지 않습니다.
`compact`·`card`는 표현만 다르며 출처의 내용과 순서는 같습니다.
잘못된 URL scheme·중복 ID·빈 이름은 오류로 알립니다. 네트워크
확인, 출처의 신뢰도 판단, 답변 문장과 인용의 연결은 호출자가
소유합니다. 실제 screen reader 발표는 별도 검증 대상입니다.

## 2026-09-30 Sidebar 섹션 탐색

`Sidebar`는 기존 `items` 평면 목록 또는 `sections` 목록 중 하나를
받습니다. `SidebarSection`은 고유 `id`, 비어 있지 않은 `label`, 최소
한 개의 `SidebarItem`을 가집니다. 항목 `id`는 섹션을 넘어 고유해야
합니다. 두 입력을 함께 주거나 둘 다 생략하면 오류로 알립니다.

각 섹션은 제목이 연결된 `role="group"`으로 표시됩니다. 데스크톱
Sidebar를 접어도 제목은 화면 판독기용 텍스트로 남고, 모바일 Drawer에는
제목을 보여줍니다. 링크의 `current`와 `onNavigate`, 접힘·Drawer
제어 방식은 기존과 같습니다. 라우팅과 현재 항목 상태는 호출자가
소유합니다. `items` 사용 코드는 수정할 필요가 없습니다.
