# Ready-made component 확장 계획

기준: 2026-09-28. 당시 `@pydemia/ui`에는 38개 component가 있고,
registry에는 공용 `pyd-utils`와 `pyd-tokens`를 포함해 40개 item이
있었습니다. 2026-09-29에 AppShell, Navigation, LogConsole, Sparkline,
PageHeader, ContentList, DataChart, Dashboard, Toast, Drawer, Pagination,
DataTable, DropdownMenu, PasswordInput, Combobox, DonutChart,
ResizablePanels, Sidebar, Stepper, Timeline, FileUpload, MultiSelect,
CommandPalette, DateRangePicker, Tree, Conversation, Reasoning, ToolCall,
FilterBar, Carousel, Image, JsonViewer, ColorInput, SearchInput,
ContextMenu, NumberInput, TagsInput, NavigationMenu, HoverCard,
ToggleGroup, PinInput, Rating, TimePicker, ScrollArea, AvatarGroup,
ButtonGroup, DateTimePicker, CodeBlock, DataList, SegmentedControl,
Markdown을
추가하고 AI 출처 목록 `CitationList`를 편입했습니다. 현재 저장소에는
125개 component와 127개 registry item이 공개돼 있습니다.
2026-09-30에
`Kanban`, `InputGroup`, `RangeSlider`, `Heatmap`, `Gantt`,
`ScatterChart`, `MonthPicker`, `ResponseFeedback`, `FavoriteToggle`,
`Board`, `Thread`, `Editable`을 순차
편입했습니다.
2026-10-01에는 `ApprovalCard`와 `DiffViewer`를 편입했습니다.
`TreeSelect`도 계층 항목을 form 값으로 제출하는 독립 사용처로
편입했고 `YearPicker`를 추가했습니다. 2026-10-02에는 `Menubar`를
편집기·관리 화면의 여러 상위 명령에 편입했습니다. `ActionBar`와
`CopyButton`도 선택 작업·복사 상태의 반복 용례로 편입했습니다.
`IconButton`을 편입하고 기존 `Tabs`에 line·contained 표시를
추가했습니다. `CodeEditorShell`에는 줄 번호·form 값·오류 연결과
panel·flat 표시를 추가했습니다.
`ImageCropper`는 로컬 사진의 고정 비율 편집과 PNG 결과를 위한
별도 작업으로 편입했습니다.
`MasterDetail`은 요청·파일 목록에서 항목 선택과 상세 면을 함께
관리하고 좁은 화면에서 focus를 복원하는 작업으로 편입했습니다.
`CalendarScheduler`는 날짜별 일정 건수와 시간순 안건을 달력과 함께
표시하는 작업으로 편입했습니다. 390px·데스크톱 preview와
공개 registry 경로를 확인했습니다.
PR #1을 `main`에 병합해
production 배포와 현재·이전 snapshot의 공개 URL 설치를 확인했습니다.
현재 92개 item의 로컬 전체 설치는 새 소비자 fixture에서 확인했습니다.
새 Markdown과 snapshot도 PR #4 병합 뒤 production과 공개 URL 설치를
확인했습니다.
shadcn/ui source를 수정한 27개는
각각 격리 설치해 소스와 MIT 고지의 전달을 확인했습니다. 나머지
item의 개별 격리 설치·전체 동작은 미검증입니다.
기존 `Badge`에 네 가지 표시 형태를 추가해 상태 표시 용례를
확장했습니다. 별도 component 수는 늘리지 않았습니다.
`Navigation`의 전역 링크에는 밑줄형, 측면 링크에는 채움형을 더해
화면 구조에 맞는 표시를 선택할 수 있습니다. 총수는 늘리지 않았습니다.
`PageHeader`는 제목·부제목을 compact·기본·hero 크기로 선택할 수 있으며
기존 component의 API 확장이므로 총수는 늘리지 않았습니다.
문서의 Operations workspace는 기존 component로 분석 화면을 구성한
동작 예시입니다. 재실행은 로컬 상태만 바꾸며 새 component로 세지
않습니다. 검증 범위는
[분석 예시 기록](component-analytics-workspace-2026-09-29.md)에 있습니다.
문서의 Review workspace는 `MasterDetail`·`DiffViewer`·`Thread`·
`ApprovalCard`를 연결한 검토 흐름입니다. 기존 component를 조합한
예시여서 component 수에는 포함하지 않습니다. 검증 범위는
[작업 기록](review-workspace-2026-10-02.md)에 남겼습니다.
세부 검증 상태는 [verification.md](../research/verification.md)에 있습니다.

목표는 제품 화면에서 반복되는 UI를 바로 가져다 쓸 수 있게 만들어 개발
속도와 시각·동작의 일관성을 높이는 것입니다. 약 100개는 규모를
가늠하는 기준점이며 완료 조건이 아닙니다. 아래 목록은 taxonomy를
검토하기 위한 후보입니다. 체크박스는 **구현 확정이 아니라 판정 또는
구현이 남았음**을 뜻합니다. 실제 사용처와 기존 API의 중복 여부,
필요한 경우 상태·상호작용의 책임, 설치·유지 비용을 확인해 새
component, 기존 API 확장, 설치 가능한 조합 예시, 보류 중 하나로
판정합니다. 후보 수로 완료율을 계산하지 않습니다.

[persona 교차 검토](reviews/roadmap-2026-09-28/decision.md)에서 판정한
공급 조건과 API 경계를 아래 순서에 반영했습니다.

## 공급과 품질의 판정 단위

릴리스 판정에는 **변경분에 해당하는 증거만** 적용합니다. 새
component는 실제 사용처와 기존 API의 중복 여부를 먼저 판단하고,
export·registry·출처·동작하는 preview·Usage를 맞춥니다. 코드가
바뀌면 해당 commit의 CI(typecheck, 테스트, build, registry 검사)를
확인합니다. 변경한 핵심 사용 흐름은 자동 테스트 또는 브라우저에서
한 번 실행합니다. 정적 표시 component는 preview가 그 증거가 될 수
있습니다. 사이트의 Usage·preview를 바꾸면 해당 동작과 전체 CI를
확인합니다. 비렌더링 Markdown 기록만 바뀌면 변경한 링크·문구와
diff 공백 검사를 확인합니다.

| 변경으로 생긴 위험 | 추가 검사 |
| --- | --- |
| 외부 component 코드 도입 | 공식 문서, 같은 revision의 source·LICENSE, 의존성·접근성과 고지 전달 확인. 조사한 동일 revision은 재사용 |
| 새 focus 이동·pointer 좌표·browser API·핵심 반응형 배치 | 해당 브라우저 흐름 실행. 기존 component에서 물려받은 동작은 재검사하지 않음 |
| 색상·배치 변경 | 영향을 받는 상태·폭·theme의 preview 확인 |
| 설치 형식·target·의존 경로 변경 | 별도 소비자 설치·typecheck·build. 공개 URL 경로도 바뀌면 그 URL에서 설치 |
| registry 내용 공개 | 릴리스 묶음당 snapshot 검사와 공개 manifest·변경 item URL 확인 |

CI 결과는 같은 commit에 대해 재사용하고, 로컬에서 실행한 흐름을
공개 사이트에서 다시 조작하지 않습니다. 표준 registry 경로의 새
item마다 별도 소비자를 만들지 않습니다. 외부 코드를 쓰지 않은
원본 구현에는 upstream source·LICENSE 대조를 적용하지 않고,
참고 자료와 기존 의존 component의 출처를 기록합니다.
기존 component의 표시만 바꾸면 독립 사용처·새 upstream 조사처럼
새 component에 해당하는 항목을 다시 요구하지 않습니다. 기존
provenance가 여전히 정확하면 검증 문구를 위해 고정 metadata를
수정하지 않습니다. 릴리스 기록에는 적용한 증거와 실제 차단 결함만
적고, 적용되지 않는 검사를 나열하지 않습니다.

서로 독립적인 component도 검토 가능한 범위에서 한 릴리스로 묶을 수
있습니다. component마다 별도 PR이나 불변 snapshot을 만들 필요는
없습니다. 공개 manifest와 변경 item URL은 릴리스 묶음당 확인합니다.
묶음 크기를 맞추려고 완성된 component의 공개를 지연하거나 후보를
추가하지 않습니다.

확인된 값 손실·제출 오류·keyboard 접근 불가·필수 고지 누락·설치
실패, 적용되는 CI 실패는 수정판 확인 전까지 출시를 막습니다.
핵심 흐름을 아직 실행하지 않았다면 구현 완료와 공급 완료를
구분합니다. 실제 보조기술·touch·Safari·RTL, 전체 item의 개별
설치, rollback 뒤 snapshot 주소 보존은 해당 환경을 지원한다고
주장하거나 관련 경로를 변경할 때 검사합니다. 그 외에는 개별
릴리스의 미검증 목록에 반복해서 적지 않습니다. 과거 라이브러리
전체의 10개 운영·품질 과제는
[당시 조사 기록](quality-legacy-2026-09-29.md)에 남기며 릴리스
점수로 사용하지 않습니다.

전체 goal의 약 97%는 사용 사례 범위와 공개 검증을 함께 보는
관리용 추정치이며 component 수나 과거 체크박스 수로 계산하지
않습니다. 현재 적용 판단은
[체크리스트 검토](quality-checklist-current-review-2026-10-02.md)에
남겼습니다. 이전 검토와 변경 이력은 그 문서와 기존 작업 기록에서
확인할 수 있습니다.
[실무 기준 재검토](quality-checklist-practical-review-2026-10-02.md)는
릴리스 묶음과 검사 기록의 적용 범위를 정리했습니다.

## 추가 component 후보

아래 A~D는 범주별 조사 목록이며 순차 릴리스 약속이 아닙니다. 실제
소비자 화면의 완결성을 기준으로 구현 묶음을 만듭니다. 미완성 API나
정적 mock을 component로 세지 않습니다.

### A. 일상적인 제품 화면과 폼

기존 Input, Calendar, Popover, Table, Dropzone 등을 사용하지만, 제품마다
다시 구현하게 되는 상태와 상호작용을 우선 묶습니다.

- [x] `Field` — label, 설명, 필수·오류 상태를 입력 control과 연결.
- [x] `Select` — 검색 없는 사용자 정의 단일 선택과 form 값 연결.
- [x] `Combobox` — 입력 검색, option 탐색, 단일 선택, 빈 결과와
  선택값만의 form 제출. popup 위치 전환과 screen reader 검사는 남았습니다.
- [x] `NumberInput` — 범위·step·locale 표시와 잘못된 입력 구분.
- [x] `PasswordInput` — native 입력과 이름이 일정한 표시 toggle.
- [x] `SearchInput` — 검색·초기화·submit의 일관된 입력 동작.
- [x] `MultiSelect` — 다중 선택, 검색, 선택 제거, 스크롤 목록과
  여러 form 값 제출. 큰 데이터셋의 성능은 미검증입니다.
- [x] `TagsInput` — 자유 입력 token의 추가·삭제·중복 정책.
- [x] `DropdownMenu` — 항목·체크·라디오·서브메뉴·disabled와 키보드
  탐색. 실제 screen reader 발표는 남았습니다.
- [x] `Drawer` — 가장자리 modal 패널과 focus 복원. 좁은 화면 실측은
  남았습니다.
- [x] `HoverCard` — 실제 링크의 비필수 미리보기. pointer·focus 열기와
  Escape 닫기를 Chromium에서 확인했고 screen reader 검사는 남았습니다.
- [x] `Toast` — 단일 controlled 알림에 FIFO queue를 더했습니다.
  최대 표시 수와 선택적 중복 억제, 수동 닫기·focus 복귀를 확인했습니다.
  실제 screen reader 발표는 남았습니다.
- [x] `NotificationCenter` — 읽음 상태를 호출자가 소유하는 지속 알림
  목록입니다. 필터·개별/전체 읽음 변경·열기 요청을 제공합니다.
- [x] `Pagination` — 전체 건수·범위·페이지 크기·0건 표시와 이동.
- [x] `CommandPalette` — 검색 가능한 command, Ctrl/Cmd+K 단축키,
  그룹·disabled·빈 결과와 keyboard 실행. 실제 screen reader 발표는
  남았습니다.
- [x] `DataTable` — 기존 `Table` 위에 client-side 검색·필터·정렬·
  선택·페이지 상태. `remote` 모드는 호출자가 조회 조건과 서버 총건수·
  로딩·오류를 소유하고 현재 페이지 행만 전달합니다. 서버 데이터 요청은
  사용처가 소유합니다. 두 모드에서 행 밀도와 줄무늬 표시를 선택할 수
  있으며 기본 표시는 기존과 같습니다.
- [x] `DatePicker` — 기존 `Calendar`와 `Popover`의 단일 날짜 입력.
- [x] `DateRangePicker` — 시작·종료·부분 선택·제한 날짜와 기간 길이 처리.
  실제 screen reader·touch·RTL 검사는 남았습니다.
- [x] `FileUpload` — 기존 `Dropzone`의 선택·거부 상태와 소비자가
  소유하는 전송·취소·재시도 상태를 한 목록에 표시합니다. 실제 전송은
  소비자가 구현합니다.

### B. 복합 입력과 탐색

각 항목의 선행 동작이 검증되면 독립적인 묶음으로 진행할 수 있습니다.

- [x] `ButtonGroup` — 이름 있는 작업 그룹의 가로·세로 연결 배치,
  장식 분리선과 각 버튼의 native disabled·keyboard 동작.
- [x] `SplitButton` — 기존 `ButtonGroup`·`Button`·`DropdownMenu`의
  설치 가능한 조합 예시로 처리했습니다. 기본 실행과 대체 작업 메뉴를
  문서·소비자에서 확인했으며 별도 component/item은 세지 않습니다.
  [조합 기록](component-split-button-recipe-2026-09-29.md)에 범위가
  있습니다.
- [x] `ToggleGroup` — 단일·다중 눌림 상태와 방향키 탐색.
- [x] `SegmentedControl` — `ToggleGroup`과 달리 단일 값을 form에
  제출해야 하는 화면 밀도 설정에 사용합니다. 이름 있는 native radio
  그룹으로 선택·방향키·disabled·제출을 확인했습니다.
- [x] `PinInput` — 하나의 native 입력을 여러 칸으로 표시, 붙여넣기,
  삭제, `one-time-code` 속성과 form 값. 실제 SMS 자동완성은 미검증.
- [x] `ColorInput` — 값 입력과 색 선택, 형식 검증.
- [x] `Rating` — 읽기 전용·입력 상태, native radio의 키보드 점수 변경과
  form 제출. 실제 screen reader 발표는 미검증.
- [x] `TimePicker` — 시·분과 12/24시간제, locale별 숫자·오전/오후
  표시, `HH:mm` form 값과 부분 입력 제출 차단.
- [x] `DateTimePicker` — 제어되는 날짜·시각 선택 상태와 명시한 IANA
  시간대를 한 쌍의 form 값으로 전달합니다. 기존 DatePicker·TimePicker를
  조합하며 UTC 시각과 DST 중복·누락 시각의 해석은 호출자에게 둡니다.
  격리 registry 설치와 Chromium 제출 순서를 검증했습니다.
- [x] `MonthPicker` — 월별 보고·필터를 위한 `YYYY-MM` 값과 연도 이동,
  월 단위 min/max, form 값을 제공합니다. 실제 screen reader 검사는
  남았습니다.
- [x] `YearPicker` — 연간 보고·예산의 `YYYY` 값, 10년 탐색과
  min/max·form 제출을 구현했습니다. 공개 snapshot을 별도 소비자에
  설치해 경계 연도·선택 해제·제출을 확인했습니다. 실제 screen
  reader·touch·Safari·RTL은 남았습니다.
- [x] `NavigationMenu` — 상단 그룹 탐색의 pointer 열기·링크 이동,
  키보드 진입·Escape 닫기. Hover·touch·screen reader 검사는 남았습니다.
- [x] `Menubar` — 편집기·관리 화면의 여러 상위 명령을 상시 표시하고
  방향키로 이동합니다. 공개 snapshot을 별도 소비자에 설치해
  명령·체크 변경과 typecheck·build를 확인했습니다. 실제 screen
  reader·touch·Safari·RTL은 남았습니다.
- [x] `BottomNav` — 기존 `pyd-navigation`에 하단 주요 목적지 링크를
  추가했습니다. 각 링크의 이름을 항상 표시하고 현재 페이지는 호출자가
  `aria-current`로 지정합니다. 전체 너비 `bar`와 여백 있는 `dock`
  표시를 고를 수 있습니다. 별도 component 수는 늘리지 않습니다.
- [x] `AnchorNav` — 같은 문서의 섹션으로 이동하고 스크롤 위치를
  현재 링크에 반영합니다. 내부 스크롤 영역과 URL hash 뒤로 가기,
  rail·inline 표시를 제공합니다.
- [x] `TreeNav` — 중첩 페이지 링크와 별도의 disclosure 버튼,
  현재 경로의 자동 펼침, rail·filled 표시를 제공합니다.
  공개 preview·registry item과 41번째 snapshot URL을 확인했습니다.
- [x] `Stepper` — 단계 위치·완료·오류와 단계 이동 정책. 실제 screen
  reader 발표와 touch 동작은 검증하지 않았습니다.
- [x] `Sidebar` — `AppShell`의 container 폭에 따라 데스크톱
  접힘·현재 링크와 좁은 화면의 modal drawer를 전환합니다. 2026-09-30에
  이름 있는 섹션 목록을 기존 API에 추가했습니다. 새 component로
  세지 않습니다.
- [x] `ScrollArea` — 세로·가로·양방향 native 스크롤과 이름이 있는
  keyboard focus 영역, 공통 token 스크롤바. 실제 screen reader·touch·RTL
  검사는 남았습니다.
- [x] `ResizablePanel` — `ResizablePanels`의 좌우·상하 2분할,
  pointer·keyboard 크기 조절과 최소·최대 비율을 구현했습니다.
- [x] `AvatarGroup` — 이름 있는 사용자 목록, 표시 인원 제한과 남은
  인원·이름 요약, 빈 상태. 실제 screen reader 발표는 남았습니다.
- [x] `DataList` — native `dl`로 label/value 쌍을 표시하고 행·그리드,
  값 없음(`null`)·빈 목록을 구분합니다. 실제 screen reader 검사는
  남았습니다.
- [x] `Tree` — 계층 확장·단일 선택·방향키·이름 검색과 원격 자식의
  로딩·실패·재시도. 실제 screen reader·touch 검사는 미검증입니다.
- [x] `Timeline` — 전달된 순서의 사건, 시간과 텍스트 상태를 표시합니다.
  정렬은 호출자가 결정합니다. 실제 screen reader 발표는 남았습니다.
- [x] `StatusIndicator` — 별도 component 대신 기존 `Badge`의
  기본·외곽선·강조·위험 variant로 처리합니다. 상태 이름을 실제
  텍스트로 제공하고 색상만으로 구분하지 않습니다.

### C. 분석 화면과 정보 표시

실제 analytics profile의 데이터·단위·범례를 먼저 정하고 구현합니다.

- [ ] `ChartContainer` — 공통 색상·label·반응형 크기와 데이터 설명.
- [x] `BarChart` — `DataChart`의 막대 variant로 단일·그룹·누적 계열,
  범주·축·단위, 빈 데이터·결측값을 표시합니다. 누적값은 양수와 음수를
  0축 양쪽에 따로 쌓습니다.
- [x] `LineChart` — `DataChart`의 선형 variant로 다중 계열과 결측
  구간, 범례·데이터 표를 제공합니다.
- [x] `AreaChart` — `DataChart`의 단일·다중 비누적 영역과 범례,
  비음수 계열의 누적 영역을 구현했습니다. 누적 영역은 모든 계열의 값이
  있는 구간만 그리며 결측 구간을 건너뛰어 연결하지 않습니다.
- [x] `DonutChart` — 비율·총합과 0건, 0.1% 미만 조각을 텍스트로
  구분합니다. 긴 범주 이름의 full text는 title 속성으로 제공합니다.
- [x] `Sparkline` — 작은 영역의 추세와 수치 대체 텍스트. 소비자 설치와
  실제 screen reader 발표는 미검증.
- [x] `Heatmap` — 두 범주의 수치를 색 농도와 보이는 숫자로 함께
  표시합니다. 표 헤더·결측값·0·빈 목록과 내부 가로 스크롤을 제공합니다.
  실제 screen reader 발표는 미검증입니다.
- [x] `ScatterChart` — 두 연속 수치의 관계를 점으로 표시합니다.
  native 선택기와 데이터 표로 정확한 좌표·결측값을 확인합니다.
  실제 screen reader 발표는 미검증입니다.
- [x] `Legend` — 별도 component 대신 `DataChart`의 정적 범례와
  선택형 범례로 제공합니다. 선택형은 다중 계열의 표시·숨김에 따라
  축·누적값·구간 값·접근 가능한 데이터 표를 함께 갱신합니다.
- [x] `ChartTooltip` — 별도 component 대신 `DataChart`의 선택적
  `hoverSummary`로 그래프 위에 구간별 값을 표시합니다. 기존 native
  구간 선택기와 데이터 표는 keyboard·보조기술 경로로 유지합니다.
- [x] `FilterBar` — 여러 필터의 입력·적용·초기화와 적용된 조건 표시.
  데이터 필터링과 draft/applied 상태는 소비자가 관리합니다.
- [x] `QueryBuilder` — 필드·연산자·값을 AND/OR 그룹에 넣고 순서를
  바꿉니다. 미완성 조건은 적용하지 않고, 조회·저장은 호출자가 맡습니다.
- [x] `DateRangeFilter` — 별도 component는 만들지 않습니다.
  `DateRangePicker`의 controlled 값·form 입력과 `FilterBar`의 적용·초기화로
  현재 기간 필터 동작을 조합할 수 있습니다. 오늘·최근 7일 같은 preset은
  데이터의 기준일과 시간대를 아는 소비자 화면에서 계산합니다. 두
  component의 적용·초기화·부분 선택 오류와 결과 목록을 문서 preview에
  결합했습니다. 공개 registry에서 조합 설치 검증은 진행 중입니다.
- [ ] `Stat` — 기존 `MetricCard`에 compact·featured 표시 형태를
  추가했습니다. 독립된 값·상태 규칙이 필요한 사용처를 확인한 뒤 분리
  여부를 판정합니다.
- [x] `CircularProgress` — 기존 `Progress`의 `circular` variant로
  값 있는 상태와 indeterminate 상태를 구현했습니다.
- [x] `Image` — 비율·cover/contain, 로딩·누락·오류 화면을 구현했습니다.
  native 이미지의 `alt`·`srcSet`·`sizes`·`loading`을 사용합니다.
- [x] `AvatarUploader` — 프로필 사진을 선택·자르고 PNG로 미리 본 뒤
  제거할 수 있습니다. 결과 Blob·제거 요청의 저장은 앱이 담당합니다.
  공개 preview·Usage와 42번째 snapshot 경로를 확인했습니다.
- [x] `Carousel` — 이전·다음·위치·선택 버튼과 터치 넘김을 구현했습니다.
  자동 재생은 제공하지 않으며 비활성 슬라이드는 DOM에서 제거합니다.
- [x] `Lightbox` — 갤러리의 modal 확대·이전/다음·썸네일 이동과
  닫은 뒤 focus 복귀를 구현했습니다. 공개 snapshot 경로를 확인했습니다.
- [x] `CodeBlock` — 이름 있는 단일 코드 블록의 언어 표시, 복사
  상태, 긴 줄의 내부 scroll·줄바꿈을 구현했습니다. 실제 clipboard
  내용과 screen reader 발표는 검증하지 않았습니다.
- [x] `Markdown` — 제목·문단·단층 목록·강조·코드와 안전한 절대
  HTTP(S) 링크 부분집합을 구현했습니다. 원시 HTML은 텍스트로 남깁니다.
- [x] `JsonViewer` — 중첩 JSON의 접기·펼치기, 항목별 추가 표시와
  원본 복사. JSON 외 값과 순환 구조는 오류로 알립니다.

### D. 전문 작업 화면

반복 사용처와 데이터 구조를 확인한 뒤 진행합니다. 사용처가 없으면
후보를 보류하고 기존 component의 품질 보강에 시간을 씁니다.

- [x] `CopyButton` — `CodeBlock`·`Snippet`의 중복 복사 동작을
  공통화했습니다. 공개 snapshot 소비자에서 실제 복사값·상태와
  typecheck·build를 확인했습니다.
- [x] `ContextMenu` — pointer 우클릭과 Shift+F10 호출, 항목·체크·
  라디오·서브메뉴·disabled 및 focus 복귀. screen reader 검사는 남았습니다.
- [x] `ActionBar` — `DataTable` 밖의 카드·파일 목록에서도 선택 건수·
  일괄 작업·해제를 씁니다. 공개 snapshot 소비자에서 작업·focus
  복귀·typecheck·build를 확인했습니다.
- [x] `AppShell` — 공통 header·좌우 panel·content·하단·floating 영역의
  조합 골격. floating 도움말의 열림 상태·focus 복귀 조합을 문서와
  분석 화면에서 확인했습니다. `framed`·`canvas` 골격과 원형·pill
  도움말 버튼을 선택할 수 있습니다. 접히는 sidebar와 좁은 화면
  drawer는 별도 범위입니다.
- [x] `MasterDetail` — 목록 선택과 상세 표시, 좁은 영역에서 목록·
  상세 전환과 돌아갈 때 선택 항목 focus 복귀를 구현했습니다. 외부
  데이터 요청과 상세 내용은 호출자가 소유합니다.
- [ ] `List` — native 목록과 기존 component 조합으로 해결되지 않는
  반복 항목·보조 내용·action 규칙이 있는지 판정.
- [ ] `Kbd` — native `kbd`와 token 사용 예시 이상이 필요한지 판정.
- [x] `Conversation` — Message 목록, 새 메시지 위치와 스크롤.
- [x] `Reasoning` — 펼침 상태, streaming 상태와 접근 가능한 제목.
- [x] `ToolCall` — 호출 입력·진행·결과·오류의 구분.
- [x] `AgentStatus` — 전체 AI 작업의 상태, 여러 단계의 처리 수와
  취소·재시도 요청을 표시합니다. 실행과 상태 갱신은 호출자가 맡습니다.
- [x] `LogViewer` — 기존 `LogConsole`을 검색·수준 선택·결과 건수와
  결합했습니다. 로그 데이터의 갱신·삭제는 앱이 맡으며 원본이 빈
  상태와 필터 결과가 빈 상태를 구분합니다. panel·flat 표시를
  선택할 수 있습니다.
- [x] `Citation` — `CitationList`로 출처 제목·위치·절대 HTTP(S)
  링크와 빈 상태를 제공합니다. pointer·keyboard preview와 새 소비자
  설치를 확인했고 실제 screen reader 발표는 남았습니다.
- [x] `Kanban` — controlled 열·카드 데이터와 이동 순서를 구현하고
  drag 외에 키보드·touch용 방향 버튼을 제공합니다. 실제 drag와
  보조기술 발표는 미검증입니다.
- [x] `Gantt` — 1~366일의 일정·선행 관계를 일·7일 시간축에 표시하고,
  native 버튼으로 이동·기간 조정합니다. drag·marker·grouping은
  현재 범위 밖이며 실제 screen reader·touch는 미검증입니다.

## 구현 순서와 완료 조건

각 묶음에서 변경분에 해당하는 공급 조건을 확인합니다. 이후에는
숫자별로 자르는 대신 소비자 화면이 완결되는 단위로 묶습니다.
다른 묶음의 결과가 꼭 필요한 경우에만 순서를 고정합니다.

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

릴리스 판정은 위 [공급과 품질의 판정 단위](#공급과-품질의-판정-단위)를
적용합니다. Draft PR에서는 registry 정합성과 이미 공개한 snapshot을
검사합니다. Review 준비를 마친 PR과 `main`에서는 현재 빌드와 일치하는
불변 snapshot까지 확인합니다. 이때까지 새 snapshot을 만들지 않아도
초안의 CI 결과를 볼 수 있습니다. 소비자 갱신·충돌·복구와 rollback
뒤 URL 보존은 라이브러리 전체의 별도 품질 작업으로 추적합니다.

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

- [x] `IconButton`: `Button size="icon"`에는 필수 이름이 없으므로
  `label`·`icon`을 받는 원본 wrapper를 추가했습니다. PasswordInput,
  Carousel, Sidebar의 아이콘 전용 작업에도 사용합니다. 공개 검증은
  [작업 기록](icon-button-tabs-2026-10-02.md)에서 추적합니다.
- [x] `InputGroup`: 입력 옆의 버튼과 textarea 아래 작업을 독립된
  focus 대상과 native form 동작으로 구성했습니다. 선택기 결합은
  사용 사례와 키보드 순서를 별도로 확인해야 합니다.
- [ ] `Sheet`·`Drawer`: 배치뿐 아니라 제스처·focus·닫기 동작이
  다른지 비교합니다.
- [x] `RangeSlider`: 기존 `Slider`를 사용하며 각 endpoint 이름과
  별도 form 값을 제공합니다. SSR과 Chromium에서 thumb 이름, 키보드,
  값 제출·초기화를 확인했습니다. 실제 touch·screen reader·Safari는
  미검증이며 [작업 기록](component-range-slider-2026-09-30.md)에 남겼습니다.
- [x] `EmptyState`·`Empty`: 항목 부재에는 기존 `Empty`를 사용합니다.
  비동기 작업 결과와 재시도는 `ResultState`로 구분했습니다.
- [x] `ModelSelector`: AI 작성 화면에서 기존 `Combobox`로 검색·
  선택을 수행하고 제공자·기능·사용량 문구와 선택 불가 이유를
  표시합니다. 목록·권한·비용·실제 모델 호출은 앱이 소유합니다.
- [x] `ApprovalCard`·`AgentStatus`: 각각 승인 결정과 전체 작업 진행을
  별도 상태로 구현했습니다. 실제 실행·저장은 호출자가 맡습니다.
- [x] `CodeEditorShell`: SQL·설정 조각을 위한 이름 있는 일반 텍스트
  textarea에 줄 번호, 언어·작업 영역, 오류 연결을 결합했습니다.
  구문 강조·코드 실행은 이 component의 범위가 아닙니다.
- [x] `Terminal`: 명령 입력·순서 있는 출력·이력 탐색을 묶었습니다.
  실제 실행과 결과 저장은 호출자가 맡습니다. 공개 preview·Usage와
  43번째 snapshot 경로를 확인했습니다.
- [x] `ImageCropper`: 로컬 파일의 고정 비율 영역을 끌기·native
  슬라이더로 조정해 PNG Blob으로 전달합니다. 업로드와 저장은
  호출자가 담당하며 실제 touch·screen reader·Safari는 미검증입니다.
- [x] `CalendarScheduler`: 기존 Calendar에 날짜별 일정 건수와
  agenda를 결합했습니다. 날짜 선택·일정 선택·추가 callback을 제공하고
  저장·권한·시간대 변환은 호출자가 소유합니다. 브라우저 동작과
  공개 검증은 남았습니다.
- [x] `NodeCanvas`: 노드 위치·연결을 호출자 소유 데이터로
  편집합니다. 끌기·키보드·좌표 입력과 확대·연결 목록을 제공하고
  44번째 snapshot으로 공개했습니다.
- [x] `MarkdownEditor`: 원문 textarea·실시간 미리보기·form 값을
  결합했습니다. 서식 버튼의 undo 문제를 확인해 제외했고, native
  입력·붙여넣기·undo를 유지합니다. 45번째 snapshot으로 공개했습니다.
- [ ] `RichTextEditor`: 제품별 문서 모델, 붙여넣기·선택·undo
  동작과 유지 비용을 조사해 착수 여부를 판단합니다. 숫자를
  맞추기 위해 영구 제외하지 않습니다.

`Stat`·`MetricCard`, `StatusIndicator`·`Badge`, `SegmentedControl`·
`RadioGroup`/`ToggleGroup`, `CircularProgress`·`Progress`의 경계도
해당 범주에 착수할 때 결정합니다. `Legend`와 `ChartTooltip` 후보는
기존 `DataChart`의 API로 제공하기로 판정했습니다. 경계가 남은 후보는
결정 전까지 독립 구현 수로 확정하지 않습니다.
