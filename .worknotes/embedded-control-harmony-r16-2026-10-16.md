# 내부 조작 버튼의 테마 조화 R16

- 요청: 첨부 41795~41791의 사례를 기준으로 전체 컴포넌트를 다시 검토하고, 펼침 화살표·이동·내부 조작 버튼의 불필요한 배경·테두리·여백을 덜어 자연스럽게 통합.
- 기준: main 05ac09a328f0ac5ce5c2677ec1200e8fc7a99815, 작업 branch codex/embedded-control-harmony. R15 완료 기록과 현재 변경 상태를 먼저 읽음.
- 원본 첨부 5개를 실제 이미지로 확인. Tree의 흰색 disclosure 원, TreeNav의 분리된 큰 화살표 pill, NavigationMenu의 흰색 현재 항목, 내부 제목 선택기의 독립 field 표현을 개선 대상으로 조사. AnchorNav 내용 예시의 아래쪽 잘림도 확인.
- 주 동작 버튼·독립 입력 필드·선택 상태는 각 역할을 보존하고, 컴포넌트 내부 조작의 기본 표면만 투명하게 통합. hit area, focus-visible, expanded/current/selected, disabled, danger 상태 유지.
- source inventory 144종을 53/28/63으로 나눠 읽기 전용 leaf 검토. 루트가 모든 제품 코드·공유 CSS·브라우저·build·Git·배포를 소유.
- codex-auto-model-router 실행 결과에 따라 leaf 요청 gpt-6-luna/high/fork none. 실제 주·leaf runtime metadata는 unavailable이며 추천/요청과 실행 관찰을 구분.
- 기존 dirty 기록 9개와 첨부 보존. 제품 API·기능·PRISM 변경은 이 요청에 포함하지 않음.

## 상태

- source 검토: 144종 개별 판정 완료. controls 53 / navigation 28 / surfaces 63의 별도 검토 기록 참조.
- 구현: 내부 surface-action, Gantt/달력 이동, Tree/TreeNav disclosure의 기본 표면 제거. 인라인 선택기·편집기/미디어/캔버스 조작·표 확장/정렬에 역할 hook 적용. hover/pressed/focus/disabled 유지.
- Glass/Aurora/Spatial의 Tree 및 rail TreeNav 현재 항목은 불투명 표면·그림자 대신 투명 accent로 표시. 명시적 filled TreeNav는 accent/대비 글자색 보존을 실제 상태에서 확인.
- AnchorNav 예시: 내부 scroll 영역의 최소 높이·padding·scroll 여백 확장. 실제 scroll/current 기능 유지.
- 회귀 검증: UI 303 / docs 15 통과. 전체 typecheck 및 정식 전체 build 통과. registry release-check 및 최신 snapshot parity 통과.
- 독립 설치: local registry 40종 CLI install/source equality/typecheck/build/21개 release gate 통과. 실제 설치 앱의 21개 root 모드 전환 및 draft 보존 확인. 내부 선택기 32px/투명, disabled opacity .5 및 cursor, Lightbox portal 닫기의 투명 배경/테두리·그림자 없음 확인.
- 운영 반영: 미완료.

## 구현 결정

- 일반 Button/NativeSelect의 공개 API와 Basic, PRISM은 변경하지 않음. 내부 슬롯으로 비-Basic 선택적 CSS에만 적용.
- 단순히 ghost로 바꾸면 Basic/소비자 동작도 바뀌므로 기존 variant는 유지하고 `surface-action`을 추가.
- NativeSelect 내부 형식 선택기는 `data-presentation="inline"`으로 식별. 기존 `:not([data-appearance="underline"])`의 specificity를 맞춰 field height/padding이 다시 적용되지 않도록 처리.
- unlayered mode CSS가 layered Tailwind보다 우선함. navigation leaf의 초기 cascade 가설은 정정 후 반영하지 않음.
- 기존 ghost aria-pressed shadow에는 이미 비-Basic 예외가 있으므로 전체 Button 규칙은 수정하지 않음.
- React 검토: 렌더링/상태/hook/effect/의존성/이벤트 코드는 유지. 의미 있는 aria-label/expanded/controls 및 disabled 속성 보존. table-sort 키보드 포커스만 보강.
- independent registry fixture는 34→40종으로 확장하여 TreeNav/NavigationMenu/BlockEditor/Carousel/NodeCanvas/DataTable의 실제 설치 경로를 검증.

## 브라우저 검증

- `.worknotes/browser-evidence/controls-r16/geometry-final.json`: 320px에서 39개 지원 theme/brightness 조합 + 1440px에서 21개 기본 조합, 각 144종, 합계 8,640개 초기 화면 geometry. 렌더링 오류/컴포넌트 가로 넘침/페이지 가로 넘침 0건.
- 실제 모든 상호작용의 전수 검증을 의미하지 않음. 초기 geometry와 컴포넌트별 source role 검토, 대표 실제 조작을 구분.
- Tree 키보드 collapse/expand/select, TreeNav 키보드 collapse/expand 및 filled variant, 편집기 native kind 변경/reorder/undo, 표 상세/정렬 키보드 focus-visible, Carousel next, Calendar next month, Canvas zoom, LogViewer/알림 filter pressed 상태, AnchorNav PageDown/목차 링크의 current 변경 확인.
- 표 정렬 버튼 focus-visible의 실제 accent outline 확인. surface-action hover와 pressed의 투명 accent, 그림자 없음 확인. 일반 primary/outline과 standalone fields는 원래 장식 보존.
- 독립 Basic 37개 예시의 버튼/select/disclosure paint·padding·border·min-height·height가 외부 모드 변경 후 유지됨을 320px에서 확인. 화면 폭이 바뀐 경우 image/row 높이가 달라져 별도 비교 필요.
- 최초 빠른 측정에서 Basic ScrollArea 16px transient overflow 및 일부 버튼의 150ms 전환 중 이전 흰 배경이 관찰됨. 안정된 재관찰에서 해소. 원본 sweep/실패 관찰은 보존하고 최종 geometry를 별도 저장. 초기 JSON 비교의 object key 순서와 viewport 변경 height 차이는 비교 로직에서 구분.
- local consumer attempt-Ipa3F9: built JS index-CnLUrGO2.js / CSS index-BuUkRK8l.css. CLI의 browserVerified:false는 별도 실제 CUA 검증으로 대체하지 않고, `consumer-local-browser.json`과 실제 조작 기록을 별도 증거로 보존.
- source review `.worknotes/embedded-control-review-r16.md`: inline+filled 잠재 충돌은 outline 전용 selector로 축소, disabled 인지성은 scoped opacity/cursor로 보완. 두 항목 모두 반영 후 실제 disabled 동작 확인.

## 릴리스 준비

- 새 snapshot 98: `sha256-fff46df17f2152882811d45ebac5fe8a29c3800daa487838b6b19ca8a2283ad5`, 148 registry items. 기존 97개 immutable release 보존.
- source freeze 후 공식 build → snapshot → 공식 전체 rebuild 수행. generated docs와 최신 registry 동기화.
- 원본 첨부·기존 dirty 기록 9개는 staging 제외 예정. 증거 디렉터리는 ignored 상태로 로컬 보존.
- 이 기록 시점에는 PR 생성·CI·병합·운영 배포 검증 미완료.

## 검증 범위

- 144개 ID별 버튼 역할과 개선 여부를 기록. 초기 화면 검사와 실제 조작 상태를 구분.
- 대표 첨부 사례와 동일한 theme/state/viewport에서 전후 비교.
- 투명 기본 상태, hover/pressed, 키보드 focus, disabled, 선택/확장 상태, 내부 Basic 격리 및 좁은 화면 검사.
- library 변경 시 정식 registry 생성·immutable 릴리스 보존·독립 설치·실제 공개 사이트 검증.
