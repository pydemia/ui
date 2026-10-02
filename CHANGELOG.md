# 변경 기록

## 2026-10-02 — Lightbox

- `Lightbox`는 선택한 이미지를 제목이 있는 modal에 보여주고 방향키,
  이전·다음 버튼과 썸네일로 갤러리를 탐색합니다. 닫으면 열었던
  버튼으로 focus를 돌려줍니다.
- `frame`·`immersive` 표시를 제공하며 이미지 목록과 선택·열림
  상태는 호출자가 관리합니다. 기존 Dialog·Image·Button을 조합하고
  새 npm 의존성은 없습니다.

## 2026-10-02 — ModelSelector

- AI 작업 화면에서 검색 가능한 모델 선택과 제공자·기능·사용량 문구,
  선택 불가 이유를 표시하는 `ModelSelector`를 추가했습니다.
- 목록·권한·비용 문구·실제 모델 호출은 앱이 소유합니다. 사용할 수
  없는 모델 ID는 form 값으로 제출하지 않습니다.

## 2026-10-02 — DataTable 표시 선택

- `DataTable`에 `compact`·`standard`·`comfortable` 행 밀도와 선택형
  줄무늬 행을 추가했습니다. 기본 표시는 이전과 같습니다.
- 문서 preview에서 전체 행·원격 페이지 모두 같은 표시 설정을 바꿔
  비교할 수 있습니다.

## 2026-10-02 — AgentStatus

- `AgentStatus`는 AI 작업 전체 상태와 단계별 진행·완료·실패·건너뜀,
  처리한 단계 수를 표시합니다. 취소·재시도 요청은 호출자 callback으로
  전달하고 실제 작업 상태는 호출자가 소유합니다.
- `panel`·`compact` 표시와 native progress·ordered list·버튼을
  공통 token으로 제공합니다.

## 2026-10-02 — QueryBuilder

- 조건의 필드·연산자·값과 중첩 AND/OR 그룹을 편집하는
  `QueryBuilder`를 추가했습니다. 유효한 조건 트리만 적용 callback으로
  전달하며 조회·저장은 호출자가 맡습니다.
- `panel`·`plain` 표시와 키보드로 조작할 수 있는 순서 변경 버튼을
  제공합니다. 기존 Button·Input·NativeSelect·token을 사용합니다.

## 2026-10-02 — DataTable 원격 조회

- `DataTable.remote`로 조회 조건과 총건수, 로딩·오류 상태를 호출자가
  관리할 수 있습니다. 서버가 전달한 현재 페이지 행의 순서를 유지하며
  내부 검색·정렬·페이지 자르기를 적용하지 않습니다.
- 기존 전체 행 모드는 유지합니다. 원격 모드의 선택 작업은 현재 로드된
  페이지에 한정하고 조회 조건이나 로딩 상태가 바뀌면 선택을 해제합니다.

## 2026-10-02 — CalendarScheduler

- `CalendarScheduler`는 일정이 있는 날짜와 건수를 달력에 표시하고
  선택 날짜의 일정을 시간순으로 보여줍니다. 일정 선택·추가 callback은
  호출자가 저장·권한 검사를 처리하도록 분리했습니다.
- 날짜는 `YYYY-MM-DD`, 시간은 지정한 시간대의 `HH:mm` 값으로 받고
  자동 변환하지 않습니다. 기존 Calendar와 Button을 조합하며 새 npm
  의존성은 없습니다.

## 2026-10-02 — MasterDetail

- 목록 선택과 상세 표시를 묶는 `MasterDetail`을 추가했습니다. 넓은
  영역에서는 두 면을 함께 표시하고 좁은 영역에서는 선택·돌아가기로
  전환합니다. 선택값은 controlled 또는 내부 상태로 관리합니다.
- 항목이 사라졌을 때 다른 항목을 임의 선택하지 않으며, 모바일
  돌아가기에서는 선택한 버튼으로 focus를 복원합니다.

## 2026-10-02 — ImageCropper

- 로컬 PNG·JPEG·WebP 파일을 고정 비율로 자르는 `ImageCropper`를
  추가했습니다. 포인터 끌기와 native 위치·확대 슬라이더를 제공하고
  결과를 지정한 너비의 PNG Blob으로 호출자에게 전달합니다.
- 파일 전송은 수행하지 않으며 잘린 결과를 저장하거나 업로드하는
  작업은 호출자가 맡습니다.

## 2026-10-02 — CodeEditorShell

- SQL·설정 조각의 일반 텍스트 편집을 위한 `CodeEditorShell`을
  추가했습니다. native textarea의 form 값과 keyboard 동작을 유지하고
  줄 번호, 언어 표시, 작업 slot, 오류 연결을 제공합니다.
- `panel`·`flat` 표시를 공통 token으로 제공하며 구문 강조와
  코드 실행은 호출자가 선택한 별도 기능으로 둡니다.

## 2026-10-02 — IconButton·Tabs 표시 형태

- `IconButton`을 추가해 아이콘 전용 작업의 접근 가능한 이름을
  필수로 받습니다. PasswordInput·Carousel·Sidebar에서 사용합니다.
- `TabsList`에 `default`·`line`·`contained` 표시 형태를 추가했습니다.
  기본 표시와 Radix 탭 동작은 유지합니다.

## 2026-10-02 — Card·Alert 표시 형태

- `Card`에 `default`·`subtle`·`elevated` 표면과 기본·`compact`
  간격을 추가했습니다. `MetricCard`의 기존 variant API는 유지합니다.
- `Alert`에 상태와 독립적인 `outline`·`soft`·`plain` 표시를
  추가했습니다. 기본 모양과 상태별 발표 역할은 유지합니다.

## 2026-10-02 — 선택 작업·복사 control

- `ActionBar`를 추가해 표·카드·파일 목록의 선택 건수, 일괄 작업과
  해제를 inline 또는 floating 영역에 배치할 수 있습니다. 기존
  `DataTable.renderActions`는 이 영역을 사용하며 API는 유지합니다.
- `CopyButton`을 추가해 임의 문자열의 복사 성공·실패를 표시합니다.
  `CodeBlock`과 `SnippetCopyButton`의 복사 동작을 공통화했습니다.

## 2026-10-02 — Menubar

- 작업 화면에서 파일·보기 등 여러 상위 명령을 유지하는 `Menubar`를
  추가했습니다. 항목·체크·라디오·서브메뉴·disabled 상태를 제공하고
  Radix의 키보드 및 focus 동작을 사용합니다.
- 공통 token을 사용하며 문서 preview·사용 코드와 registry item을
  추가했습니다. `@radix-ui/react-menubar@1.1.24`를 사용합니다.

## 2026-10-01 — YearPicker

- 연간 보고·예산에서 `YYYY` 값을 고르는 `YearPicker`를 추가했습니다.
  10년 단위 탐색, 연도별 min/max, controlled 값과 form 제출을
  지원합니다.
- 문서 preview·사용 코드와 registry item을 추가했습니다. 기존
  Popover를 사용하며 새 runtime 의존성은 없습니다.

## 2026-10-01 — 선택 카드 표시 형태

- `Checkbox`와 `RadioGroupItem`에 `variant="card"`를 추가했습니다.
  보이는 이름·설명과 카드 전체 선택 면적을 제공하며 기존 선택기와
  form 값, 기본 표시 형태는 유지합니다.
- 문서의 선택·제출 preview와 사용 코드를 추가했습니다. 별도
  component나 runtime dependency는 늘리지 않았습니다.

## 2026-10-01 — TreeSelect

- 계층에서 한 항목을 골라 form 값으로 제출하는 `TreeSelect`를
  추가했습니다. 선택 경로, 필수 선택 오류, 비활성 후손, form reset을
  처리하며 기존 Tree·Popover를 조합합니다.
- 첫 snapshot에서 기본값을 지운 뒤 reset하면 표시와 제출값이
  달라지던 문제를 수정했습니다. 수정판에는 새 snapshot ID를
  사용합니다.

## 2026-10-01 — DiffViewer

- 변경 전후의 줄 번호, 추가·삭제·문맥을 통합·좌우 표로 보여 주는
  `DiffViewer`를 추가했습니다. 긴 줄의 내부 스크롤·줄바꿈, 빈 줄과
  끝 줄바꿈 차이를 표시합니다.
- 큰 변경은 축약 비교임을 명시합니다. 문서 preview·사용 코드와
  registry item을 추가했고, React Diff Viewer는 동작 참고 자료로만
  확인했습니다.

## 2026-10-01 — ApprovalCard

- AI 도구 실행의 승인 요청·승인·거절·만료를 표시하는 `ApprovalCard`를
  추가했습니다. 비동기 결정 중 중복 제출을 막고 실패하면 재시도할 수
  있습니다. 실제 도구 실행과 확정 상태는 소비자가 관리합니다.
- 문서의 동작 preview·사용 코드와 registry item을 추가했습니다.
  AI Elements는 동작 참고 자료로 확인했고 구현 코드는 새로 작성했습니다.

## 2026-10-01 — Combobox 원격 결과 갱신

- 현재 검색 결과에 선택 항목이 없어도 `selectedOption`으로 표시 이름과
  form 값을 유지합니다. 잘못된 선택값은 계속 오류로 알립니다.
- 원격 검색 결과를 그대로 보여 주는 `filterOptions=false`, 로딩·오류
  상태와 문서 preview·사용 코드를 추가했습니다.

## 2026-09-30 — Editable

- 자리에서 이름·설정값을 수정하는 `Editable`을 추가했습니다. 필수값과
  사용자 검사, 비동기 저장·실패 후 초안 보존, 저장 중 중복 요청 방지와
  편집 버튼으로 포커스 복귀를 제공합니다.
- 문서의 저장 실패 preview·사용 코드와 registry item을 추가했습니다.
  Chakra UI는 동작 reference로만 사용했고 코드는 새로 작성했습니다.

## 2026-09-30 — 답변 평가·즐겨찾기·게시판·대댓글

- `ResponseFeedback`, `FavoriteToggle`, `Board`, `Thread`를 원본
  컴포넌트와 registry item으로 추가했습니다. 글 작성 modal은 기존
  `Dialog`를 조합합니다.
- 문서에 선택·게시·대댓글 작성 preview와 사용 코드를 추가했습니다.

## 2026-09-30 — MonthPicker

- 월별 보고·필터에서 `YYYY-MM` 값을 고르는 `MonthPicker`를 추가했습니다.
  연도 이동, 월별 min/max, controlled 값과 form 제출을 지원합니다.
- 문서 preview·사용 코드와 registry item을 추가했습니다. MUI X는
  월 선택 동작의 참고 자료이며 구현 코드는 프로젝트에서 작성했습니다.

## 2026-09-30 — ScatterChart

- 두 연속 수치의 관계를 표시하는 `ScatterChart`를 추가했습니다. 정확한
  좌표·결측값은 native 선택기와 펼칠 수 있는 데이터 표에서도 확인합니다.
- 문서 preview와 사용 코드, registry item을 추가했습니다. Recharts는
  설계 reference로만 확인했고 새 runtime 의존성은 없습니다.

## 2026-09-30 — Gantt

- `Gantt`는 작업의 시작·끝, 진행률, 선행 관계를 일·7일 시간축에
  표시합니다. 일정 이동·기간 변경은 native 버튼으로도 조작하며
  범위·의존 조건을 깨는 변경은 막습니다.
- 문서에 동작하는 preview와 controlled 사용 코드를 추가했습니다.
  새 runtime 의존성 없이 원본 소스와 registry item을 편입했습니다.

## 2026-09-30 — Heatmap

- 요일·시간대처럼 두 범주의 값을 색 농도와 숫자로 보여 주는
  `Heatmap`을 추가했습니다. 0·결측값·빈 목록을 구분합니다.
- native 표 헤더와 이름 있는 가로 스크롤 영역을 제공하고, compact·
  comfortable 밀도를 선택할 수 있습니다. 새 runtime 의존성은 없습니다.

## 2026-09-30 — Tree 원격 하위 항목

- 원격 폴더의 대기·로딩·오류를 노드 데이터로 표시하고, 펼침과
  `ArrowRight` 재시도로 자식 요청을 전달합니다. 로드 후 자식 focus와
  선택은 기존 Tree 규칙을 따릅니다.
- 문서 preview에서 실패·재시도·완료를 직접 시험할 수 있습니다.
  새 npm runtime 의존성이나 registry item은 없습니다.

## 2026-09-30 — RangeSlider

- 기존 Slider의 다중 thumb를 사용해 이름 있는 가격 범위 필터를
  추가했습니다. 최솟값과 최댓값은 별도 native form 값으로 제출됩니다.
- 문서에 키보드 조작·제출·초기화를 시험할 수 있는 preview와 Usage를
  추가했습니다. 새 npm runtime 의존성은 없습니다.

## 2026-09-30 — InputGroup과 모바일 SNB 위치

- 입력·textarea에 텍스트와 버튼을 붙이는 `InputGroup`을 추가했습니다.
  입력값과 버튼은 native form·keyboard 동작을 유지합니다. 문서에
  요청 ID 제출과 메모 저장 preview, Usage 코드를 추가했습니다.
- 모바일 SNB 선택 시 React 갱신 후 문서·SNB 스크롤 위치를 복원합니다.
  데스크톱의 본문 이동은 유지합니다.

## 2026-09-30 — DataChart 계열 표시 선택

- 다중 계열 `DataChart`에 `toggleableSeries`를 추가했습니다.
  계열을 숨기면 축·누적값·구간 값·데이터 표를 표시 중인 계열로
  다시 계산하며 색과 선 모양은 원래 계열 순서를 유지합니다.
- 문서 preview와 Usage에 선택형 범례를 추가했습니다. 새 component,
  npm dependency, registry item은 없으며 새 내용 해시 snapshot을
  발행합니다.

## 2026-09-30 — 기간 필터 조합 예시

- `FilterBar` 문서에 `DateRangePicker`를 결합한 적용·부분 선택 오류·
  초기화·결과 목록 preview와 복사 가능한 사용 코드를 추가했습니다.
- 기존 component와 registry item을 그대로 사용합니다.

## 2026-09-30 — Sidebar 섹션 탐색

- `Sidebar`에 이름 있는 `sections` 입력을 추가했습니다. 기존 평면
  `items` 입력은 유지하며, 한 번에 한 방식만 지정할 수 있습니다.
- 접힌 상태와 모바일 Drawer에서도 섹션 이름을 접근성 트리에 남깁니다.
  문서 preview에서 평면 목록과 섹션 목록을 전환할 수 있습니다.
- 새 npm dependency나 component·registry item은 없습니다. 변경된
  registry 소스로 새 내용 해시 snapshot을 발행합니다.

## 2026-09-29 — Markdown 부분집합

- React와 native 요소로 작성한 `Markdown`을 추가했습니다. 제목·문단·
  단층 목록·강조·코드·절대 HTTP(S) 링크를 표시하며, 원시 HTML과
  허용하지 않은 링크는 텍스트로 남깁니다.
- registry item과 내용 해시 snapshot을 추가하고 기존 snapshot을
  보존했습니다. 문서에서 원문을 편집하는 preview와 사용 코드를
  제공합니다.

## 2026-09-29 — 출처 고지 고정

- 수정한 shadcn/ui source의 소비자 고지에서 provenance URL을 특정
  commit으로 고정하고 파일 SHA-256을 기록했습니다. registry 검사가
  현재 metadata와 고지의 해시를 대조합니다.
- 현재 source로 새 내용 해시 snapshot을 만들었습니다. 기존 공개
  snapshot의 파일은 변경하지 않았습니다.

## 2026-09-29 — 공개 component 후속 수정

- 19개 문서 Usage에 필요한 registry item을 설치 명령에 추가하고,
  Usage import와 설치 목록의 폐쇄 관계를 자동 검사합니다.
- DataChart의 동일 극단값 좌표와 빈 구간 이름, DataTable의 변경된
  필터 옵션 처리 방식을 수정했습니다.
- CI가 untracked 문서 생성 파일도 찾도록 했습니다. rollback 시
  snapshot 주소 보존과 과거 release의 provenance 연결은 계속
  검토합니다.

## 2026-09-29 — component registry 확장

[PR #1](https://github.com/pydemia/ui/pull/1)을 `main`에 병합해
문서 사이트와 registry를 production에 배포했습니다. 현재 내용 해시
snapshot은
`sha256-48f182bbf4fafa4e209bb89acebf7e77b722f6aac842e1a3c90d974399d9ac93`입니다.

- component 모듈을 38개에서 89개로, 공용 item을 포함한 내부 registry를
  40개에서 91개 item으로 확장했습니다. 화면 구조의 AppShell·Sidebar·
  Navigation, 분석 화면의 DataChart·DonutChart·Dashboard·LogConsole,
  복합 입력의 Combobox·MultiSelect·DateRangePicker, 작업 화면의
  DataTable·Tree·CommandPalette와 AI 대화 component를 포함합니다.
- Spinner에 다섯 표시 형태를, Badge·MetricCard·DataChart·Navigation에
  용례별 표시 형태를 추가했습니다. Navigation의 기존 링크 스타일은
  기본값으로 유지합니다.
- `pyd-tokens`로 공통 stylesheet를 전달하고 수정한 shadcn/ui source의
  MIT 고지를 해당 registry item에 포함했습니다. 내용 해시 snapshot과
  빌드된 최신 item의 일치 검사를 추가했습니다.
- 이전 공개 item을 설치한 소비자를 신규 item으로 갱신하고,
  수정된 Badge·Button 파일의 덮어쓰기와 수동 재적용을 시험했습니다.
- DataChart가 부호가 다른 큰 유한값을 받아도 SVG 좌표와 축 눈금을
  유한하게 계산하도록 고쳤습니다.

개별 component의 동작 범위와 미검증 항목은 `research/verification.md`,
진행·인계 기록은 `.worknotes/`에 있습니다. 현재 package는 private
workspace이며 npm에 게시하지 않았습니다.
