# Navigation and schedule material harmony R10

## 현재 상태

- 진행 중: Tree / Navigation / AnchorNav / Gantt / Calendar의 테마 표현 개선.
- 기준 main `754331240cf4ca7e275dd48ce7c34bc5e98b0918` (fresh fetch 일치), release91 보존.
- branch `codex/design-navigation-schedule-harmony`.
- 사용자가 만족한 Breadcrumb / FormWizard / Timeline / Thread 표현과 Basic / PRISM 보존.
- 기존 사용자 미커밋 세션 기록과 첨부·시안 보존.

## 요구와 결정

- R1: 고정 흰색 면을 외곽만 덮지 않고 실제 탐색 행·선택·헤더·날짜 셀·일정 막대까지 mode material에 연결.
- R2: 각 mode의 투명/입체/종이/터미널 등 재질, 모서리, 경계와 간격을 적용하되 정보 위계와 읽기 유지.
- R3: 기존 공개 props, tree keyboard/expanded/selected, nav current/native links, calendar 날짜/월 이동, Gantt 선택·스크롤 계약 보존.
- C1: 새 규칙은 nearest non-Basic ThemeScope 안으로 제한. nested Basic 및 PRISM 변경 금지.
- C2: 탐색 선택 표시를 새로운 왼쪽 stripe로 표현하지 않음. 배경·문자·weight와 focus 사용.
- C3: 기존 immutable registry snapshots 수정 금지. source 확정·시각 검수 후 새 snapshot 생성.
- 현재 승인된 디자인 방향 내에서 agent-selected 구체화. 계획만 작성하는 요청이 아니며 구현·검수·기존 승인된 공개 적용까지 진행.

## 실행과 검수

- frontend-design-workflow / frontend-development / codex-auto-model-router 적용. 주 model/effort runtime metadata 확인 불가.
- 코드와 실제 개별 화면 audit → scoped material 구현 → 상태·키보드·responsive·Basic/칭찬한 component 회귀 → build/tests/registry/consumer → CI/공개 readback.
- 아직 새 구현·검수·배포 완료 아님. 실행 결과와 미확인 범위는 여기 갱신.

## 구현 중

- 현재 도구 모델 목록으로 router 실행: ordinary240/deterministic → gpt-6-luna/high/fork none 권고. 두 새 leaf 생성 후 audit와 disjoint component hook 추가를 같은 요청 안에서 순차 위임; root가 diff 수용. 요청 설정과 실제 runtime metadata 관찰은 구분.
- `.worknotes/navigation-material-audit-r10.md`, `.worknotes/schedule-material-audit-r10.md` 검토. 후자는 첫 읽기에 허용 범위 밖 read-only git status를 포함했음을 보고; mutation 없음.
- 10개 component의 root/painted slot hooks, Gantt inline grid/bar CSS 변수 연결. 공개 API·handler·native state 변경 없음.
- nearest nonBasic scope 안에 실제 행·날짜·일정 표면 스타일과 mode별 재질 추가. standalone/embedded Tree 구분. Basic의 기존 rail class는 유지하고 nonBasic 표현에서만 stripe 제거.
- 문서 preview 중복 외곽 제거, navigation device/anchor article 예시 면도 material 연결. 개발 QA nested Basic에 7종 추가; 독립 consumer Tree/Navigation/Gantt/Calendar 추가.
- typecheck pass. 초기 실제 Clay Calendar에서 입체 날짜 셀·월 헤더·여백 표시 확인. 전체 모드/상태/모바일 검수는 남음. source 최종 후 snapshot 생성.

## source 최종 검수

- UI301 / docs15 / PRISM363 pass, typecheck pass. React best-practices 적용: 새 hook/state/effect/의존성 없음, 기존 TS props·ARIA·native handler 유지.
- independent reviewer: Calendar/Scheduler의 schedule-fill 명시 제안 수용. Gantt/Scheduler wrapper 중복 지적은 실제 두 preview가 `preview-workspace`이고 기존 reset 대상임을 확인해 root 반증; 불필요한 selector 추가 안 함. 자세한 검토는 `.worknotes/navigation-schedule-review-r10.md`.
- 실제39 지원 조합(요청=실제 설정 일치),144 catalog/error0, Tree App.tsx 선택 유지. nestedBasic15 component tree computed styles39/39 일정. 최종 evidence `component-material-r10/modes-final-39.json`.
- root 독립 Basic vs 운영12종 비교: Gantt inline 새변수가 Basic에서도 해석되던 차이를 발견해 Basic에서 initial/fallback 처리. 최종12종 시각 속성 동일. 배경 image none의 position 직렬화0px/0%만 정규화했으며 문자열 완전동일로 보고하지 않음. `basic-parity-final.json`.
- 사용자 칭찬4종 Breadcrumb/FormWizard/Timeline/Thread: 운영Clay vs 후보Clay의 computed 표현 동일 (`praised-clay-parity.json`).
- 새 월·Gantt 헤더의 배경색/글자색39조합 측정: nonBasic에서4.5 미만0. Skeuo Light 초기4.457을 전용 foreground로 수정. gradient까지 모든 픽셀의 대비를 측정한 것은 아님.
- 320/390×21 QA42: 대상7종 root/calendar grid bounds 넘침0/errors0 (`mobile-final-42.json`). 초기 Calendar min-width auto 확장 문제를 min-width0으로 수정. 다른144개 전체 wrapper overflow0을 주장하지 않음.
- 실제문서 Clay7종×320/390: page/preview/calendar-grid overflow0 (`main-mobile-14.json`).
- 실제 Tree ArrowLeft/Right/Down/Space 펼침·선택, Gantt 선택/1일 미루기/일·주 보기, Calendar range9/10–9/14 월왕복 보존, Scheduler10/12 선택/안건 선택/추가, AnchorNav 내부scroll/current, Navfilled/dock/current 동작 확인 (`behaviors.json` 및 실제 tool 결과).
- source final 후 build/단일 새 snapshot/registry consumer/CI/공개 적용 남음. 브라우저 engine Edge 한 종, 실제 screen reader/physical forced colors 미실행.

## 릴리스 후보

- 최종 build pass, registry:release-check pass.
- 단일 새 snapshot92 `sha256-e2bd6e9e41623e4d8f9d313a0aa0f110dbd405c7d77e57cdded4dfe5c5d7d896` /148items. 기존91 이하 immutable 내용 보존.
- local CLI 소비자 attempt-fJQN57: shadcn4.21 실제18 items+dependencies 설치, mode9 source/CSS 일치, tsc/Tailwind/Vite/strict21 release gate pass. verification.json의 browserVerified=false 보존.
- 별도 browser-verification-r10.json: 설치된 Tree Schedule 선택, Calendar2026-10-12, 업무 초안이21회 mode 전환 중 유지. rootDark/regionalLight 독립 scope 확인. DarkUI Light→BasicLight, Cyber/Terminal→Dark 기존 정규화 보존.
- 새 filled/dock는 accent 면과 대비 글자색으로 surface/rail variant와 구별. Gantt 선택 행은 진한 nav 역상색을 사용하지 않고 조용한 tint/pressed 면으로 데이터 가독성 유지.
- CI exact head와 운영배포/public registry 재검수는 아직 남음.
