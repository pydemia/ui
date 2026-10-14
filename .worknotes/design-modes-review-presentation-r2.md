# Presentation 독립 검토 — r2

- 입력: `.worknotes/browser-evidence/design-modes-presentation-r2`.
- revision: `design-modes-presentation-r2`, base `288b0838aec424f7c83686f3d3b00677d749fa4b`.
- manifest 34개 파일의 SHA-256을 읽기 전에 대조: 불일치 0개.
- 역할: 표현 CSS, 기본값/variant 보존, 지역 scope, 실제 조합 preview의
  의미와 레이아웃을 검토했다. 다른 reviewer 결과와 live source는 읽지 않았다.
- 적용 지침: persona-cross-review, frontend-development, software-engineering.
- router 추천/생성 요청은 부모 제공 정보상 gpt-6-astra/low.
  실제 실행 metadata는 확인 불가. 재위임하지 않았다.

## P-R2-01 — Spatial 상세 preview에서 격자 recipe의 breakpoint에 도달하지 못함

판정: 구현 검증 필요, P2. 고정 source의 너비 산술상 확인한 UX 불일치이며
브라우저 computed style 재현은 실행하지 않았다.

위치는 모두 위 snapshot 기준이다.

- `apps/docs/src/components/design-mode-picker.css:4`: picker 최대 1180px.
- 같은 파일 `:24`, `:37`, `:42`: 목록 200px, detail 좌우 22px,
  preview 좌우 20px와 border.
- `apps/docs/src/analytics-workspace.tsx:137`: 실제 sidebar를 포함하며
  `:138`에서 너비가 `@3xl:w-44`다.
- `packages/ui/src/components/app-shell.tsx:23`, `:51`: AppShell은 container이고
  넓어지면 sidebar/main을 가로 배치한다.
- `packages/ui/src/design-modes.css:84`: Spatial columns를 정의하지만
  `:155`의 48rem container 조건 안에서만 panels에 적용한다.
- 같은 파일 `:88`, `:90`: sidebar 좌우 margin 및 main padding 추가.
- `packages/ui/src/components/foundation/design-modes.ts:398`: Spatial의
  `--space-6`은 32px, 따라서 main 좌우 padding만 64px다.
- `packages/ui/src/components/dashboard.tsx:20`: 가장 가까운 Dashboard가
  별도 container이므로 바깥 AppShell 너비로 해당 조건을 만족하지 않는다.

Basic 페이지의 기본 root 14px에서 picker 최대 너비를 확보해도 대략
1180 - 200 - 44 - 42 - 154 - 32 - 64 = 644px 이하가 Dashboard에 남는다.
실제 border/scrollbar는 이를 더 줄인다. 48rem = 672px 조건을 충족하지
못한다. 16px root에서도 sidebar가 더 넓고 조건이 768px가 되어 해결되지
않는다. AppShell이 가로 배치 breakpoint보다 좁으면 Dashboard는 그보다
더 좁으므로 역시 조건을 만족하지 못한다.

결과: Spatial 후보에서 조합 화면을 펼쳐도 Spatial의 1.6:1 두 열 표현을
볼 수 없다. `design-mode-picker.tsx:166`은 펼치면 격자/패널 배치를
확인할 수 있다고 안내하지만, 이 preview에서는 좁은 단일 열 표현만
가능하다. 실제 적용한 넓은 페이지의 recipe를 비교할 수 없는 상태다.

반증 검토: 실제 AnalyticsWorkspace 재사용, 별도 idPrefix, 로컬 탐색,
CSS-only recipe는 확인했다. Bento와 Spatial을 동일 실패로 묶지 않았다.
Spatial의 추가 margin/padding 때문에 생기는 별도 제한이다. 모바일의
단일 열 자체는 정상적인 반응형 표현이며 문제로 세지 않았다.

최소 수정: preview 전용으로 sidebar를 위쪽에 유지하거나 상세 조합을
넓힐 수 있게 해 Dashboard가 48rem을 확보하도록 한다. 또는 실제 내용의
가독성을 확인한 뒤 recipe breakpoint를 조정한다. 전역 component tree를
모드별로 교체할 필요는 없다.

통과 사례: 1280px 이상 desktop에서 Basic applied 상태로 Spatial 후보를
선택하고 조합 상세를 연다. computed Dashboard 너비와 panels의
`grid-template-columns`가 2열 1.6:1임을 확인한다. 좁은 화면에서는
수평 page overflow 없이 한 열로 돌아가며 기존 preview 입력/행 선택을
유지해야 한다. 부모가 실제 브라우저에서 이 수치를 우선 확인하면 된다.

## 반증으로 제외한 의심

- 지역 scope가 부모 material/recipe를 그대로 상속한다는 의심:
  `design-modes.css:2`의 기본값 reset과 각 scope/portal의 data-design,
  data-recipe 적용이 있으므로 일반적인 nested Basic 경로는 배제했다.
- ghost/underline/subtle/fullscreen 표현이 일괄 덮이는 의심:
  관련 selector의 variant 제외와 fullscreen 제외를 확인했다.
- preview가 업무 Analytics의 id/hash/state를 공유한다는 의심:
  useId 기반 idPrefix, 독립 state, details의 로컬 hash 처리로 배제했다.
- 미출시 모드가 apply된다는 의심: candidate preview 허용과 commit의
  releaseStatus guard가 분리되어 있다.
- 전체 21종 release나 PRISM 작업이 아직 끝나지 않았다는 사실은 이
  presentation revision의 결함으로 세지 않았다.

## 확인 범위와 남은 검증

manifest, frozen goal/contract/plan, presentation CSS 전체, docs picker/preview,
AnalyticsWorkspace, app-shell/dashboard/button/input/card/dialog/popover,
ThemeScope/theme-dom을 읽었다. settings/tokens와 docs CSS/main은 관련
구간만 읽었다. 그 밖의 manifest 파일은 hash 대조만 했으며 전수 semantic
review로 표시하지 않는다.

브라우저, AT, shared build/dist, Git, publish를 실행하지 않았다.
실제 스타일/cascade, 작은 viewport의 높이, portal focus와 scroll 동작은
부모의 실행 검증 대상이다. 이 보고서는 release 승인이나 전체 coverage가
아니다. private repro는 만들지 않았다. terminal ownership released.
