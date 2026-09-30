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
96개 component와 98개 registry item이 있습니다. 2026-09-30에
`Kanban`, `InputGroup`, `RangeSlider`, `Heatmap`, `Gantt`,
`ScatterChart`를 순차
편입했습니다.
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
세부 검증 상태는 [verification.md](../research/verification.md)에 있습니다.

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

- [ ] 현재 90개 component의 public export와 registry item,
  provenance, 문서 예시가 서로 일치하는지 확인하고 변경을 검토
  가능한 단위로 정리합니다. 현재 90개 component 모듈·public export·
  registry·catalog ID의 1:1 대응을 `registry:check`에 넣고
  통과했습니다. `AvatarGroup`과 `ButtonGroup`은 각각 별도 설치했고
  provenance 92개도 검사했습니다. 직전 사용 코드 89개는 tarball
  소비자와 registry 소스 경로에서 각각 typecheck했습니다.
  확장안을 기능·문서·생성 산출물의 세 커밋으로 정리하고 깨끗한
  체크아웃의 build·typecheck·테스트·registry 검사를 통과했습니다.
  [릴리스 검토 기록](component-release-review-2026-09-29.md)에 범위를
  남겼습니다. 이후 독립 검토에서 문서 설치 명령과 Usage의 불일치,
  차트 극단값·행 이름, 배포 rollback 시 snapshot 주소 손실 가능성을
  확인했습니다. [후속 검토](component-followup-review-2026-09-29.md)의
  미완료 항목을 닫은 뒤 완료 처리합니다.
  DataTable의 390px 열 압축은 표 내부 가로 scroll로 수정했습니다.
  [검증 기록](component-data-table-responsive-2026-09-29.md)에 범위가
  있습니다.
- [x] 별도 소비자 프로젝트에서 현재 92개 registry item을
  `shadcn@4.21.0 add`로 설치했습니다. token·MIT 고지를 포함한
  94개 파일이 생성된 JSON 내용과 일치했고 90개 모듈의 typecheck·
  build·Chromium 로딩(212개 값 export, console error 0건)을 확인했습니다.
  직전 사용 코드 89개의 package·registry 직접 import typecheck도
  수행했습니다. 새 Markdown 사용 코드는 별도 package tarball
  소비자에서 typecheck했습니다.
  새 `CitationList` item도 별도 빈 소비자에 설치해 확인했습니다.
  개별 item 전체의 격리 설치와 상호작용 검사도 남았습니다.
- [ ] 기존 35개에서 남은 미검증 항목 중 실제 사용에 영향을 주는 상호작용을
  우선 재검사합니다. Dropzone의 drag·거부 조건, Calendar의 범위·시간대,
  Slider의 다중 thumb·터치, Avatar 이미지 fallback을 포함합니다.
  파일 선택의 형식·크기·개수 거부, 기간의 부분·완료 선택, 다중 thumb의
  키보드 변경, 이미지 로드·fallback은 Chromium에서 확인했습니다.
  실제 파일 drag/drop·touch·다른 호스트 시간대·screen reader 검사가
  남아 있어 완료 처리하지 않았습니다.
  [재검사 기록](component-foundation-interactions-2026-09-29.md)에
  범위를 구분했습니다.
- [ ] keyboard·focus·이름/상태 발표를 실제 보조기술로 점검할 대상과
  브라우저 범위를 정하고 결과를 `verification.md`에 기록합니다.
- [ ] registry item을 소비자가 재현 가능하게 설치할 수 있도록 버전 고정,
  변경 기록, 호환성 확인, 회귀 검사와 릴리스 절차를 마련합니다. 현재
  `@pydemia/ui`는 private workspace package이므로 npm 게시를 전제로
  계획하지 않습니다. 내용 해시 snapshot과 변조 회귀 검사, 직전 공개
  버전 소비자의 갱신 시험을 추가했습니다. `CHANGELOG.md`의 미공개
  변경 기록과 `registry:release-check`의 로컬 릴리스 검사도 마련했습니다.
  PR·`main` push의 CI workflow에 typecheck·테스트·빌드·현재 snapshot·
  생성 파일 검사도 추가했고 PR #1의 원격 실행이 통과했습니다.
  PR #1의 `main` 병합, production 배포와 공개 URL 설치는 확인했습니다.
  독립 검토에서 발견한 문서 설치 명령·rollback·provenance 문제는
  [후속 검토](component-followup-review-2026-09-29.md)에 기록했습니다.
  새 고지는 provenance의 commit·SHA-256을 고정합니다. 과거
  snapshot의 `main` 링크와 rollback 문제는 남아 있습니다.
- [ ] 릴리스마다 component JSON, `registryDependencies`, token을 같은
  식별자로 묶고 불변 주소를 보존합니다. 현재 91개 item의 로컬
  `sha256-48f182bbf4fafa4e209bb89acebf7e77b722f6aac842e1a3c90d974399d9ac93`
  snapshot과 `docs/r/releases/` 복사본을 검사했습니다. `/r/`은 최신
  경로로 유지합니다. production에서 현재·이전 snapshot의 manifest와
  Button JSON을 내려받아 저장소 파일과 해시를 비교했고 두 ID의
  item을 각각 새 소비자에 설치해 typecheck·build를 확인했습니다.
  이전 배포로 Instant Rollback하면 새 snapshot 파일이 배포에서 빠져
  주소가 404가 될 수 있습니다. rollback 복구 절차 또는 별도 보존
  저장소를 마련해야 완료입니다. 장기간의 URL 보존과 모든 item의
  개별 공개 설치도 미검증입니다.
  [배포 기록](component-production-release-2026-09-29.md)을 참고하세요.
- [x] `pyd-tokens` item으로 token stylesheet를 전달하고 소비자 CSS에서
  import하는 절차를 별도 Vite 프로젝트에서 검증했습니다.
- [x] 복사·수정한 shadcn/ui source 27개 item을 각각 새 소비자에
  `shadcn@4.21.0 add`로 설치했습니다. 각 설치물의 component 소스와
  `SHADCN_UI_LICENSE.md`가 저장소 원본과 일치했습니다. npm 의존성의
  별도 license와 실제 상호작용·접근성 검사는 이 항목의 범위가 아닙니다.
  [검증 기록](component-license-notice-individual-2026-09-29.md)에
  대상과 방법을 남겼습니다.
- [x] 직전 공개 40개 item을 설치한 소비자를 현재 91개 item으로
  갱신했습니다. 93개 파일 일치·typecheck·전체 모듈 build·Chromium
  로딩을 확인했습니다. 수정한 Badge·Button의 기본 설치는 파일을
  보존하고, 명시적 덮어쓰기는 수정을 지웠습니다. Badge의 수정 한 줄을
  새 소스에 재적용해 typecheck·build·브라우저 표시를 확인했습니다.
  [충돌·복구 기록](component-registry-upgrade-2026-09-29.md)에 범위가
  있습니다. 제품별 변경의 자동 병합을 제공한다는 뜻은 아닙니다.
- [x] private package의 `@pydemia/ui` 경로와 registry 설치 파일별
  import 경로를 구분했습니다. catalog 사용 코드 89개를 현재 package
  tarball 소비자와 직접 설치한 registry 소스 소비자에서 각각
  typecheck했습니다. README와 문서 설치 안내에 경로 차이를
  명시했습니다. 개별 preview의 브라우저 동작 검사는 별도 범위입니다.

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
- [x] `Pagination` — 전체 건수·범위·페이지 크기·0건 표시와 이동.
- [x] `CommandPalette` — 검색 가능한 command, Ctrl/Cmd+K 단축키,
  그룹·disabled·빈 결과와 keyboard 실행. 실제 screen reader 발표는
  남았습니다.
- [x] `DataTable` — 기존 `Table` 위에 client-side 검색·필터·정렬·
  선택·페이지 상태. 서버 데이터 요청은 사용처가 소유합니다.
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
- [x] `NavigationMenu` — 상단 그룹 탐색의 pointer 열기·링크 이동,
  키보드 진입·Escape 닫기. Hover·touch·screen reader 검사는 남았습니다.
- [x] `BottomNav` — 기존 `pyd-navigation`에 하단 주요 목적지 링크를
  추가했습니다. 각 링크의 이름을 항상 표시하고 현재 페이지는 호출자가
  `aria-current`로 지정합니다. 별도 component 수는 늘리지 않습니다.
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
- [ ] `ChartTooltip` — `DataChart`에 포인터·native select로 조작하는
  구간별 값 패널을 추가했습니다. 부유 tooltip 필요성은 사용 사례로 판정.
- [x] `FilterBar` — 여러 필터의 입력·적용·초기화와 적용된 조건 표시.
  데이터 필터링과 draft/applied 상태는 소비자가 관리합니다.
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
- [x] `Carousel` — 이전·다음·위치·선택 버튼과 터치 넘김을 구현했습니다.
  자동 재생은 제공하지 않으며 비활성 슬라이드는 DOM에서 제거합니다.
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

- [ ] `CopyButton` — Snippet 밖의 반복 사용을 확인하고 복사·성공·
  실패 알림을 공통화할지 판정.
- [x] `ContextMenu` — pointer 우클릭과 Shift+F10 호출, 항목·체크·
  라디오·서브메뉴·disabled 및 focus 복귀. screen reader 검사는 남았습니다.
- [ ] `ActionBar` — `DataTable`의 선택 action slot으로 충분한지
  확인하고 독립적인 다중 선택 화면이 있으면 분리.
- [x] `AppShell` — 공통 header·좌우 panel·content·하단·floating 영역의
  조합 골격. floating 도움말의 열림 상태·focus 복귀 조합을 문서와
  분석 화면에서 확인했습니다. 접히는 sidebar와 좁은 화면 drawer는
  별도 범위입니다.
- [ ] `List` — native 목록과 기존 component 조합으로 해결되지 않는
  반복 항목·보조 내용·action 규칙이 있는지 판정.
- [ ] `Kbd` — native `kbd`와 token 사용 예시 이상이 필요한지 판정.
- [x] `Conversation` — Message 목록, 새 메시지 위치와 스크롤.
- [x] `Reasoning` — 펼침 상태, streaming 상태와 접근 가능한 제목.
- [x] `ToolCall` — 호출 입력·진행·결과·오류의 구분.
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
- [x] `InputGroup`: 입력 옆의 버튼과 textarea 아래 작업을 독립된
  focus 대상과 native form 동작으로 구성했습니다. 선택기 결합은
  사용 사례와 키보드 순서를 별도로 확인해야 합니다.
- [ ] `Sheet`·`Drawer`: 배치뿐 아니라 제스처·focus·닫기 동작이
  다른지 비교합니다.
- [x] `RangeSlider`: 기존 `Slider`를 사용하며 각 endpoint 이름과
  별도 form 값을 제공합니다. SSR과 Chromium에서 thumb 이름, 키보드,
  값 제출·초기화를 확인했습니다. 실제 touch·screen reader·Safari는
  미검증이며 [작업 기록](component-range-slider-2026-09-30.md)에 남겼습니다.
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
