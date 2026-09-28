# Ready-made component 확장 계획

기준: 2026-09-28. 현재 `@pydemia/ui`에는 38개 component가 있고,
registry에는 공용 `pyd-utils`와 `pyd-tokens`를 포함해 40개 item이
있습니다. 현재 변경은 로컬 작업 트리에 있으며 원격 배포는 확인하지
않았습니다. 소비자 설치는 이번에 추가한 3개와 token item만 확인했으므로
38개 모두를 안정적으로 공급 중인 항목으로 간주하지 않습니다. 검증 상태는
[verification.md](../research/verification.md)를 따릅니다.

목표는 제품 화면에서 반복되는 UI를 바로 가져다 쓸 수 있게 만들어 개발
속도와 시각·동작의 일관성을 높이는 것입니다. 약 100개는 규모를
가늠하는 기준점이며 완료 조건이 아닙니다. 아래 목록은 taxonomy를
검토하기 위한 후보입니다. 체크박스는 **구현 확정이 아니라 판정 또는
구현이 남았음**을 뜻합니다. 실제 사용처, 독립된 상태·상호작용,
설치·유지 비용을 확인해 새 component, 기존 API 확장, 설치 가능한
조합 예시, 보류 중 하나로 판정합니다. 후보 수로 완료율을 계산하지
않습니다.

[persona 교차 검토](reviews/roadmap-2026-09-28/decision.md)에서 판정한
공급 조건과 API 경계를 아래 순서에 반영했습니다.

## 먼저 닫을 공급·품질 공백

- [ ] 현재 38개의 public export, registry item, provenance, 문서 예시가
  서로 일치하는지 확인하고 변경을 검토 가능한 단위로 정리합니다.
- [ ] 별도 소비자 프로젝트에서 `shadcn add` 설치, token 적용, import,
  typecheck, build를 전체 항목으로 확대합니다. Field, Select,
  DatePicker와 token item은 별도 Vite 소비자에서 확인했습니다.
- [ ] 기존 35개에서 남은 미검증 항목 중 실제 사용에 영향을 주는 상호작용을
  우선 재검사합니다. Dropzone의 drag·거부 조건, Calendar의 범위·시간대,
  Slider의 다중 thumb·터치, Avatar 이미지 fallback을 포함합니다.
- [ ] keyboard·focus·이름/상태 발표를 실제 보조기술로 점검할 대상과
  브라우저 범위를 정하고 결과를 `verification.md`에 기록합니다.
- [ ] registry item을 소비자가 재현 가능하게 설치할 수 있도록 버전 고정,
  변경 기록, 호환성 확인, 회귀 검사와 릴리스 절차를 마련합니다. 현재
  `@pydemia/ui`는 private workspace package이므로 npm 게시를 전제로
  계획하지 않습니다.
- [ ] 릴리스마다 component JSON, `registryDependencies`, token을 같은
  식별자로 묶고 불변 주소를 보존합니다. 현재 `/r/` 경로와 예전 버전을
  되돌리는 경로는 각각 명시합니다. 현재 빌드는 `docs/`를 다시 만들므로
  기존 URL이 과거 내용을 계속 제공한다고 가정하지 않습니다.
- [x] `pyd-tokens` item으로 token stylesheet를 전달하고 소비자 CSS에서
  import하는 절차를 별도 Vite 프로젝트에서 검증했습니다.
- [ ] 복사·수정한 source의 license와 notice가 registry 설치 소비자에게
  어떻게 전달되는지 item별로 확인합니다. 저장소 안의 고지 파일만으로
  설치 결과에 고지가 포함된다고 가정하지 않습니다.
- [ ] 최초 설치뿐 아니라 직전 공개 버전의 설치물을 갱신·복구하는
  경로를 검증합니다. 소비자가 수정한 파일과 충돌할 때의 동작을
  기록합니다.
- [ ] private package와 registry 소스 설치에서 지원할 공개 심볼·type,
  import 경로를 구분하고 두 경로의 문서 예시를 typecheck합니다.

## 추가 component 후보

아래 A~D는 범주별 조사 목록이며 순차 릴리스 약속이 아닙니다. 실제
소비자 화면의 완결성을 기준으로 구현 묶음을 만듭니다. 미완성 API나
정적 mock을 component로 세지 않습니다.

### A. 일상적인 제품 화면과 폼

기존 Input, Calendar, Popover, Table, Dropzone 등을 사용하지만, 제품마다
다시 구현하게 되는 상태와 상호작용을 우선 묶습니다.

- [x] `Field` — label, 설명, 필수·오류 상태를 입력 control과 연결.
- [x] `Select` — 검색 없는 사용자 정의 단일 선택과 form 값 연결.
- [ ] `Combobox` — 입력 검색, option 탐색, 단일 선택, 빈 결과.
- [ ] `NumberInput` — 범위·step·locale 표시와 잘못된 입력 구분.
- [ ] `PasswordInput` — 표시 전환과 이름 있는 제어 버튼.
- [ ] `SearchInput` — 검색·초기화·submit의 일관된 입력 동작.
- [ ] `MultiSelect` — 다중 선택, 검색, 선택 제거, 긴 목록 처리.
- [ ] `TagsInput` — 자유 입력 token의 추가·삭제·중복 정책.
- [ ] `DropdownMenu` — 메뉴 항목·체크·서브메뉴의 키보드 탐색.
- [ ] `Drawer` — 좁은 화면의 보조 작업면과 focus 복원.
- [ ] `HoverCard` — hover와 focus로 여는 비필수 정보 패널.
- [ ] `Toast` — 비동기 결과·오류 알림, 중복·대기열·닫기 정책.
- [ ] `Pagination` — 전체 건수와 현재 페이지, 이전·다음 이동.
- [ ] `CommandPalette` — 검색 가능한 command, 단축키, 그룹, 빈 결과.
- [ ] `DataTable` — 기존 `Table` 위에 정렬·필터·선택·페이지 상태.
- [x] `DatePicker` — 기존 `Calendar`와 `Popover`의 단일 날짜 입력.
- [ ] `DateRangePicker` — 시작·종료·부분 선택·제한 날짜 처리.
- [ ] `FileUpload` — 기존 `Dropzone`의 선택·거부 상태와 앱의 전송·취소·
  재시도 상태를 명확히 연결.

### B. 복합 입력과 탐색

각 항목의 선행 동작이 검증되면 독립적인 묶음으로 진행할 수 있습니다.

- [ ] `ButtonGroup` — 연결된 action의 배치·분리선·disabled 규칙.
- [ ] `ToggleGroup` — 단일·다중 눌림 상태와 방향키 탐색.
- [ ] `SegmentedControl` — `RadioGroup`·`ToggleGroup`과 다른 form 동작이
  필요한지 판정한 뒤 구현.
- [ ] `PinInput` — 여러 칸 입력, 붙여넣기, 삭제, 자동완성.
- [ ] `ColorInput` — 값 입력과 색 선택, 형식 검증.
- [ ] `Rating` — 읽기 전용·입력 상태와 키보드 점수 변경.
- [ ] `TimePicker` — 시·분 선택, 12/24시간제와 locale.
- [ ] `DateTimePicker` — 날짜·시간 조합에 독립 상태가 필요한지 판정하고
  시간대·유효성 정책을 명시.
- [ ] `NavigationMenu` — 계층 메뉴의 pointer·keyboard 탐색.
- [ ] `Stepper` — 단계 위치·완료·오류와 단계 이동 정책.
- [ ] `Sidebar` — 접힘, active 항목, 좁은 화면 전환.
- [ ] `ScrollArea` — 스크롤 가능한 영역의 focus·overflow 처리.
- [ ] `ResizablePanel` — pointer·keyboard 크기 조절과 최소 크기.
- [ ] `AvatarGroup` — 다수 사용자 표시와 남은 인원 요약.
- [ ] `DataList` — label/value 쌍의 의미 있는 배치.
- [ ] `Tree` — 확장·선택·방향키 탐색, 비동기 node 상태.
- [ ] `Timeline` — 시간순 사건, 상태와 연결선의 의미 구분.
- [ ] `StatusIndicator` — 기존 `Badge` 확장으로 충분한지 판정하고
  색상 외 텍스트로 상태를 전달.

### C. 분석 화면과 정보 표시

실제 analytics profile의 데이터·단위·범례를 먼저 정하고 구현합니다.

- [ ] `ChartContainer` — 공통 색상·label·반응형 크기와 데이터 설명.
- [ ] `BarChart` — 범주 비교, 축·단위·빈 데이터.
- [ ] `LineChart` — 시계열 추세, 누락 구간·다중 series.
- [ ] `AreaChart` — 누적/비누적 영역과 범례.
- [ ] `DonutChart` — 비율·총합과 작은 조각의 label 정책.
- [ ] `Sparkline` — 작은 영역의 추세와 수치 대체 텍스트.
- [ ] `Legend` — series 이름·색·표시 상태; chart의 slot인지 판정.
- [ ] `ChartTooltip` — 값·단위·시점과 keyboard 대안; chart의 slot인지 판정.
- [ ] `FilterBar` — 여러 필터의 선택·초기화·적용 상태.
- [ ] `DateRangeFilter` — `FilterBar`·`DateRangePicker` 조합으로
  충분한지 판정하고 기간 preset을 검토.
- [ ] `Stat` — 기존 `MetricCard`와 표현·값 규칙을 비교한 뒤 판정.
- [ ] `CircularProgress` — 기존 `Progress`의 표현 variant로 충분한지
  판정하고 값 있는 원형 진행 상태를 검토.
- [ ] `Image` — 비율·loading·오류 fallback과 대체 텍스트.
- [ ] `Carousel` — 이전·다음·위치 표시; 자동 재생은 기본 off로 두고
  필요 시 중지·재시작 제어, focus/hover 중지, 숨긴 내용의 focus를 명세.
- [ ] `CodeBlock` — 언어별 표시·복사·줄바꿈·overflow.
- [ ] `Markdown` — 허용한 문법의 렌더링과 안전한 링크 처리.
- [ ] `JsonViewer` — 큰 객체의 접기·펼치기와 복사.

### D. 전문 작업 화면

반복 사용처와 데이터 구조를 확인한 뒤 진행합니다. 사용처가 없으면
후보를 보류하고 기존 component의 품질 보강에 시간을 씁니다.

- [ ] `CopyButton` — Snippet 밖의 반복 사용을 확인하고 복사·성공·
  실패 알림을 공통화할지 판정.
- [ ] `ContextMenu` — pointer 우클릭과 keyboard 호출.
- [ ] `ActionBar` — `DataTable`의 선택 action slot으로 충분한지
  확인하고 독립적인 다중 선택 화면이 있으면 분리.
- [ ] `AppShell` — 공통 header·sidebar·content recipe를 먼저 제공하고
  반복되는 독립 동작이 확인되면 component로 분리.
- [ ] `List` — native 목록과 기존 component 조합으로 해결되지 않는
  반복 항목·보조 내용·action 규칙이 있는지 판정.
- [ ] `Kbd` — native `kbd`와 token 사용 예시 이상이 필요한지 판정.
- [ ] `Conversation` — Message 목록, 새 메시지 위치와 스크롤.
- [ ] `Reasoning` — 펼침 상태, streaming 상태와 접근 가능한 제목.
- [ ] `ToolCall` — 호출 입력·진행·결과·오류의 구분.
- [ ] `Citation` — 출처 링크, 위치 정보, 열람 동작.
- [ ] `Kanban` — 실제 열·카드 데이터 구조와 반복 작업을 확인한 뒤
  이동·keyboard 대안을 구현할지 판정.
- [ ] `Gantt` — 실제 일정·의존 관계 모델과 반복 작업을 확인한 뒤
  시간축·이동·대체 조작을 구현할지 판정.

## 구현 순서와 완료 조건

공급 조건을 먼저 닫습니다. 이후에는 숫자별로 자르는 대신 소비자 화면이
완결되는 단위로 묶습니다. 다른 묶음의 결과가 꼭 필요한 경우에만
순서를 고정합니다.

| 묶음 | 선행 결정과 구현 범위 | 소비자 수용 사례 |
| --- | --- | --- |
| 폼 입력 | `Field`의 label·오류 연결, 날짜 값 명세 → `Select`, `Combobox`, `DatePicker` | 필수값 누락·잘못된 값·비동기 제출 오류 후 값을 유지하고 재제출 |
| 관리 목록 | 페이지·행 ID·선택 유지 규칙 → `Pagination`, `DataTable`, 선택 action slot | 검색·필터·페이지 이동·다중 선택·action·선택 해제를 한 화면에서 완료 |
| 파일 작업 | 선택·전송 상태 소유 결정 → 기존 `Dropzone`과 `FileUpload` | 거부·전송 실패·취소·재시도와 같은 파일 재선택 |
| 탐색·알림 | `DropdownMenu`, `Drawer`, `Toast` 등 실제 반복 동작 | focus 복원, 결과 알림, 좁은 화면 전환 |

목록 묶음은 `HoverCard`나 `CommandPalette` 완료를 기다리지 않습니다.
`ActionBar`가 필요하면 목록과 함께 검증하되 별도 component가 아닌
`DataTable`의 action slot이나 조합 예시일 수 있습니다. `FileUpload`의
전송은 소비자 앱이 제공하는 함수가 시작하며 `Dropzone`은 서버 전송을
수행하지 않습니다. B의 복합 입력, C의 analytics·developer tool,
D의 AI·workflow는 실제 제품 용례와 선행 component의 상태를 확인해
착수합니다. 반복되는 화면 골격은 설치 가능한 recipe로 먼저 검증합니다.

첫 폼 묶음에서 native 입력, 기존 `AffixedInput`·`Dropzone`처럼 자체
label을 가진 control, 새 trigger 기반 선택기의 label 소유자와
`id`/`aria-labelledby`·오류 ID·`aria-invalid`·form 값 경로를 정합니다.
`DatePicker`의 값은 달력 날짜와 시각을 구분하고 빈 값, 변경 이벤트,
직렬화, 시간대 처리 원칙을 명시합니다. `DateRangePicker`와
`DateTimePicker`는 이 명세와 호환되는지 후속 검증합니다.

목록 묶음에서 `Pagination`의 페이지 번호 기준, 0건, 크기 변경,
범위 밖 페이지 처리와 `DataTable`의 안정적인 행 ID, 정렬·필터·페이지
변경 후 선택 유지 범위를 함께 정합니다. 서버 요청은 앱이 소유합니다.
파일 묶음에서는 `Dropzone`의 선택·거부와 전송의 진행·실패·취소·
재시도 발표가 서로 모순되지 않도록 상태 소유와 우선순위를 정합니다.

1. 실제 소비자 화면의 반복 용례를 확인합니다. 후보마다 새 component,
   기존 API 확장, 설치 가능한 조합 예시, 보류 중 하나를 근거와 함께
   기록합니다. 별도 이름이 주는 편의와 유지 비용을 비교합니다.
2. 공식 문서, **동일 revision**의 upstream 소스와 LICENSE, 직접·전이
   의존성을 확인합니다. 참고만 한 코드와 복사·수정한 코드를 구분합니다.
3. controlled/uncontrolled 값, 상태, 오류, 이벤트, 빈 결과, disabled,
   locale·RTL, focus·keyboard 규칙을 짧은 명세로 정합니다. 필요 없는
   상태는 억지로 추가하지 않고 해당하지 않는다고 기록합니다.
4. 공통 token으로 구현하고 공개 경로별 export·registry·provenance·
   notice를 동기화합니다. 문서에 실제 component를 사용한 preview,
   상태 예시, 사용 코드와 설치 명령을 제공합니다.
5. typecheck, build, `registry:check`, 깨끗한 consumer 설치를 실행합니다.
   주요 pointer·keyboard 동작, 좁은 화면, light/dark, 접근성 이름·상태,
   오류 경로를 브라우저에서 확인하고 실행하지 못한 검사는 따로 기록합니다.
6. 직전 공개 버전을 설치한 소비자의 갱신·충돌·복구를 확인합니다.
   소비자에서 조합 흐름과 설치 경로가 재현될 때만 ready-made로
   표시합니다. 미검증 항목은 따로 남깁니다.

`DataTable`은 단순 `Table`과 다르게 상태 소유가 핵심입니다. headless
엔진을 채택할 경우 버전의 실제 API와 license를 확인하고 기본 제공 범위
(정렬·필터·선택·페이지)와 앱이 소유할 서버 데이터 요청을 분리합니다.
chart는 시각 표현과 별도로 값·단위·추세를 읽을 수 있는 요약 또는 표를
제공해야 합니다. `Kanban`·`Gantt`는 drag만으로 조작을 끝내지 않습니다.

## 참고 범위와 보류 후보

일반 UI는 [shadcn component 목록](https://ui.shadcn.com/docs/components),
[MUI 전체 목록](https://mui.com/material-ui/all-components/),
[Chakra 목록](https://chakra-ui.com/docs/components/concepts/overview),
[Mantine](https://mantine.dev/)의 실제 동작과 사용 예를 비교합니다.
분석 UI는 [Tremor 목록](https://npm.tremor.so/components)을 참고합니다.
[React DayPicker의 range 명세](https://daypicker.dev/selections/selection-modes)와
[TanStack Table의 headless 범위](https://tanstack.com/table/latest/docs/overview)는
각각 날짜 선택과 표 상태의 책임을 정할 때 참고합니다. 이 링크는 계획
근거이며 아직 각 후보의 source·LICENSE 검증을 마쳤다는 뜻이 아닙니다.
[shadcn registry item 명세](https://ui.shadcn.com/docs/registry/registry-item-json)는
token 전달 방식을 정할 때,
[W3C Carousel 패턴](https://www.w3.org/WAI/ARIA/apg/patterns/carousel/)은
자동 재생의 중지 동작을 정할 때 확인합니다.

다음은 이전 목록에서 제외하거나 묶었던 항목의 **미결정 경계**입니다.
개수에서 제외했다는 이유로 이미 해결됐다고 취급하지 않습니다.

- [ ] `IconButton`: `Button size="icon"`이 accessible name을 보장하는지
  확인하고 이름을 필수화할 wrapper가 필요한지 판정합니다.
- [ ] `InputGroup`: 현재 `AffixedInput`은 문자열·비상호작용 affix만
  지원합니다. 버튼·선택기 등 focus 가능한 요소를 붙이는 실제 용례를
  확인합니다.
- [ ] `Sheet`·`Drawer`: 배치뿐 아니라 제스처·focus·닫기 동작이
  다른지 비교합니다.
- [ ] `RangeSlider`: 현재 `Slider`의 다중 thumb 코드는 있으나 조작
  검증이 남아 있습니다. 범위 값·thumb 이름·키보드·터치를 확인합니다.
- [ ] `EmptyState`·`Empty`: 결과별 독립 상태가 필요한지 비교합니다.
- [ ] `ModelSelector`·`ApprovalCard`·`AgentStatus`: AI workspace에서
  실제 반복 작업과 독립 상태가 확인되면 D 후보로 올립니다.
- [ ] `RichTextEditor`·`CodeEditorShell`·`NodeCanvas`·`ImageCropper`·
  `CalendarScheduler`: 제품별 데이터·편집 모델과 유지 비용을 조사해
  착수 여부를 판단합니다. 숫자를 맞추기 위해 영구 제외하지 않습니다.

`Stat`·`MetricCard`, `StatusIndicator`·`Badge`, `SegmentedControl`·
`RadioGroup`/`ToggleGroup`, `CircularProgress`·`Progress`, `Legend`·
`ChartTooltip`·chart 본체의 경계도 해당 범주에 착수할 때 결정합니다.
결정 전에는 어느 쪽도 독립 구현 수로 확정하지 않습니다.
