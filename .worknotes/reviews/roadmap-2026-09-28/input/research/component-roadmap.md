# Ready-made component 확장 계획

기준: 2026-09-28. 현재 `@pydemia/ui`에는 35개 component가 있고,
registry에는 공용 `pyd-utils`를 포함해 36개 item이 있습니다. 현재 변경은
로컬 작업 트리에 있으며 새 component의 원격 배포와 소비자 프로젝트 설치는
확인하지 않았습니다. 따라서 35개를 모두 안정적으로 공급 중인 항목으로
간주하지 않습니다. 검증 상태는 [verification.md](verification.md)를 따릅니다.

목표는 제품 화면에서 반복되는 UI를 바로 가져다 쓸 수 있게 만들어 개발
속도와 시각·동작의 일관성을 높이는 것입니다. 약 100개는 계획 규모를
가늠하는 기준점입니다. 아래 65개는 **추가 후보**이며, 기존 component의
slot·variant·조합으로 충분하면 별도 component를 만들지 않습니다.
반대로 실제 사용처에서 독립적인 동작 규칙이 확인되면 후보를 추가합니다.
체크박스는 모두 미구현 상태를 뜻하며 완료율로 해석하지 않습니다.

## 먼저 닫을 공급·품질 공백

- [ ] 현재 35개의 public export, registry item, provenance, 문서 예시가
  서로 일치하는지 확인하고 변경을 검토 가능한 단위로 정리합니다.
- [ ] 별도 소비자 프로젝트에서 `shadcn add` 설치, token 적용, import,
  typecheck, build를 검증합니다. 현재는 JSON 생성과 수동 복사까지만
  확인했습니다.
- [ ] 기존 35개의 미검증 항목 중 실제 사용에 영향을 주는 상호작용을
  우선 재검사합니다. Dropzone의 drag·거부 조건, Calendar의 범위·시간대,
  Slider의 다중 thumb·터치, Avatar 이미지 fallback을 포함합니다.
- [ ] keyboard·focus·이름/상태 발표를 실제 보조기술로 점검할 대상과
  브라우저 범위를 정하고 결과를 `verification.md`에 기록합니다.
- [ ] registry item을 소비자가 재현 가능하게 설치할 수 있도록 버전 고정,
  변경 기록, 호환성 확인, 회귀 검사와 릴리스 절차를 마련합니다. 현재
  `@pydemia/ui`는 private workspace package이므로 npm 게시를 전제로
  계획하지 않습니다.

## 추가 component 후보 65개

순서는 구현 의존성과 재사용 빈도를 고려한 제안입니다. 각 묶음은 내부에서
4~6개씩 나눠 완성하고 소비자 설치를 확인한 뒤 다음 묶음으로 넘어갑니다.
수량을 맞추기 위해 미완성 API나 정적 mock을 component로 세지 않습니다.

### A. 일상적인 제품 화면과 폼 · 18개

기존 Input, Calendar, Popover, Table, Dropzone 등을 사용하지만, 제품마다
다시 구현하게 되는 상태와 상호작용을 우선 묶습니다.

- [ ] `Field` — label, 설명, 필수·오류 상태를 입력 control과 연결.
- [ ] `Select` — 검색 없는 사용자 정의 단일 선택과 form 값 연결.
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
- [ ] `DatePicker` — 기존 `Calendar`와 `Popover`의 단일 날짜 입력.
- [ ] `DateRangePicker` — 시작·종료·부분 선택·제한 날짜 처리.
- [ ] `FileUpload` — 기존 `Dropzone`에 업로드 진행·실패·재시도 연결.

### B. 복합 입력과 탐색 · 18개

A의 선택·날짜·탐색 기반이 소비자 화면에서 검증된 뒤 진행합니다.

- [ ] `ButtonGroup` — 연결된 action의 배치·분리선·disabled 규칙.
- [ ] `ToggleGroup` — 단일·다중 눌림 상태와 방향키 탐색.
- [ ] `SegmentedControl` — 소수의 상호 배타적 선택과 form 값.
- [ ] `PinInput` — 여러 칸 입력, 붙여넣기, 삭제, 자동완성.
- [ ] `ColorInput` — 값 입력과 색 선택, 형식 검증.
- [ ] `Rating` — 읽기 전용·입력 상태와 키보드 점수 변경.
- [ ] `TimePicker` — 시·분 선택, 12/24시간제와 locale.
- [ ] `DateTimePicker` — 날짜·시간 조합, 시간대와 유효성 정책.
- [ ] `NavigationMenu` — 계층 메뉴의 pointer·keyboard 탐색.
- [ ] `Stepper` — 단계 위치·완료·오류와 단계 이동 정책.
- [ ] `Sidebar` — 접힘, active 항목, 좁은 화면 전환.
- [ ] `ScrollArea` — 스크롤 가능한 영역의 focus·overflow 처리.
- [ ] `ResizablePanel` — pointer·keyboard 크기 조절과 최소 크기.
- [ ] `AvatarGroup` — 다수 사용자 표시와 남은 인원 요약.
- [ ] `DataList` — label/value 쌍의 의미 있는 배치.
- [ ] `Tree` — 확장·선택·방향키 탐색, 비동기 node 상태.
- [ ] `Timeline` — 시간순 사건, 상태와 연결선의 의미 구분.
- [ ] `StatusIndicator` — 색상 외 텍스트로 상태를 전달.

### C. 분석 화면과 정보 표시 · 17개

실제 analytics profile의 데이터·단위·범례를 먼저 정하고 구현합니다.

- [ ] `ChartContainer` — 공통 색상·label·반응형 크기와 데이터 설명.
- [ ] `BarChart` — 범주 비교, 축·단위·빈 데이터.
- [ ] `LineChart` — 시계열 추세, 누락 구간·다중 series.
- [ ] `AreaChart` — 누적/비누적 영역과 범례.
- [ ] `DonutChart` — 비율·총합과 작은 조각의 label 정책.
- [ ] `Sparkline` — 작은 영역의 추세와 수치 대체 텍스트.
- [ ] `Legend` — series 이름·색·표시 상태.
- [ ] `ChartTooltip` — 값·단위·시점과 keyboard 대안.
- [ ] `FilterBar` — 여러 필터의 선택·초기화·적용 상태.
- [ ] `DateRangeFilter` — 기간 preset과 사용자 지정 범위.
- [ ] `Stat` — 수치, 단위, 변화량의 일관된 표시.
- [ ] `CircularProgress` — 값 있는 원형 진행 상태.
- [ ] `Image` — 비율·loading·오류 fallback과 대체 텍스트.
- [ ] `Carousel` — 이전·다음·위치 표시와 자동 재생 정책.
- [ ] `CodeBlock` — 언어별 표시·복사·줄바꿈·overflow.
- [ ] `Markdown` — 허용한 문법의 렌더링과 안전한 링크 처리.
- [ ] `JsonViewer` — 큰 객체의 접기·펼치기와 복사.

### D. 전문 작업 화면 · 12개

반복 사용처와 데이터 구조를 확인한 뒤 진행합니다. 사용처가 없으면
후보를 보류하고 A~C의 품질 보강에 시간을 씁니다.

- [ ] `CopyButton` — Snippet 밖의 복사·성공·실패 알림.
- [ ] `ContextMenu` — pointer 우클릭과 keyboard 호출.
- [ ] `ActionBar` — 다중 선택 후 실행할 action과 선택 해제.
- [ ] `AppShell` — 공통 header·sidebar·content 배치와 반응형 규칙.
- [ ] `List` — 항목·보조 내용·action의 의미 있는 목록 조합.
- [ ] `Kbd` — 단축키 표기와 플랫폼별 modifier 표시.
- [ ] `Conversation` — Message 목록, 새 메시지 위치와 스크롤.
- [ ] `Reasoning` — 펼침 상태, streaming 상태와 접근 가능한 제목.
- [ ] `ToolCall` — 호출 입력·진행·결과·오류의 구분.
- [ ] `Citation` — 출처 링크, 위치 정보, 열람 동작.
- [ ] `Kanban` — 열·카드 이동과 keyboard 대안.
- [ ] `Gantt` — 시간축·의존 관계·이동과 대체 조작.

## 구현 순서와 완료 조건

첫 구현은 A를 아래처럼 나눕니다. 앞 묶음의 소비자 설치와 회귀 확인이
끝나야 다음 묶음의 public API를 확정합니다.

| 묶음 | 순서와 구성 | 확인할 조합 화면 |
| --- | --- | --- |
| A1 | Field → Select → Combobox, DropdownMenu, DatePicker | 기본 생성·편집 form |
| A2 | NumberInput, PasswordInput, SearchInput, MultiSelect, TagsInput | 검증 form |
| A3 | Drawer, HoverCard, Toast, Pagination, CommandPalette | 탐색과 비동기 결과 |
| A4 | DataTable, DateRangePicker, FileUpload | 밀도 높은 관리 화면 |

B는 A의 선택·탐색 상태를 이용한 enterprise 화면, C는 analytics와
developer-tool 화면, D는 AI workspace와 workflow 화면에서 실제 조합을
확인합니다. 한 화면에서 개별 component가 렌더링되는 것만으로 완료하지
않고, 여러 component가 같은 값·오류·focus 흐름을 공유하는지 확인합니다.

각 component는 아래 순서를 따릅니다. 특히 A의 `DataTable`은 `Pagination`,
`Field`는 입력류, `DatePicker`는 `Calendar`/`Popover`, C의 chart들은
`ChartContainer`, D의 `Conversation`은 `Message`/`PromptInput`에 의존합니다.
`FileUpload`의 실제 전송은 상위 앱이 제공하는 함수와 명시적인 오류/취소
상태로 연결하며, `Dropzone` 자체가 서버 전송을 수행한다고 표시하지 않습니다.

1. 실제 소비자 화면의 반복 용례를 확인합니다. 의미·상태·접근성
   동작이 기존 component 조합으로 충분한지 먼저 판단합니다.
2. 공식 문서, **동일 revision**의 upstream 소스와 LICENSE, 직접·전이
   의존성을 확인합니다. 참고만 한 코드와 복사·수정한 코드를 구분합니다.
3. controlled/uncontrolled 값, 상태, 오류, 이벤트, 빈 결과, disabled,
   locale·RTL, focus·keyboard 규칙을 짧은 명세로 정합니다. 필요 없는
   상태는 억지로 추가하지 않고 해당하지 않는다고 기록합니다.
4. 공통 token으로 구현하고 public export·registry·provenance·notice를
   동기화합니다. 문서에 실제 component를 사용한 preview, 상태 예시,
   사용 코드와 설치 명령을 제공합니다.
5. typecheck, build, `registry:check`, consumer 설치를 실행합니다.
   주요 pointer·keyboard 동작, 좁은 화면, light/dark, 접근성 이름·상태,
   오류 경로를 브라우저에서 확인하고 실행하지 못한 검사는 따로 기록합니다.
6. 묶음 단위로 API 변경과 회귀 여부를 검토합니다. 소비자에서 실제로
   사용하고 설치 경로가 재현될 때만 해당 묶음을 ready-made로 표시합니다.

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

`IconButton`은 현재 `Button size="icon"`을 먼저 사용하고 접근 가능한
이름을 문서·예시에서 강제합니다. `EmptyState`는 기존 `Empty`, `Sheet`는
`Drawer`, `InputGroup`은 `AffixedInput`, `RangeSlider`는 `Slider`의 다중
thumb으로 해결 가능한지 먼저 확인합니다. 별도 동작이 입증되기 전에는
추가 개수에 넣지 않습니다. `RichTextEditor`, `CodeEditorShell`,
`NodeCanvas`, `ImageCropper`, `CalendarScheduler`는 제품별 데이터·편집
요건과 유지 비용이 커서 이번 65개 기준 목록 밖에 둡니다.
