# Component 확장 작업 인계

2026-10-03 registry schema 2 공개 상태: PR #144를 병합했고 `main`
`ff0bcae7`의 Verify UI·Pages가 통과했습니다. 77번째 raw manifest·
TransferList·token·utils는 HTTP 200이고 게시 파일과 일치합니다.
새 raw URL을 별도 Vite 소비자에 설치한 5개 파일의 typecheck·build도
통과했습니다. Vercel preview는 READY지만 production은 이전 배포를
가리키고 사용자 도메인의 77번째 manifest는 404입니다. 사이트
게시 확인은 남아 있습니다. [공급 기록](registry-durable-snapshot-2026-10-03.md)을
참고하세요. Goal 관리용 추정은 약 99%입니다.

2026-10-03 공급·품질 수준 재검토: 수동 판정은 이미 변경분 중심입니다.
경직성은 draft PR의 전체 검사와 76개 release의 이중 저장
(각 9,064개 파일), 과거 운영 과제의 미완료 표기가 품질 점수처럼
읽히는 데 있습니다. 변경 유형별 최소 증거와 실제 출시 차단 조건을
[재검토 기록](quality-gate-level-review-2026-10-03.md)에 정리했습니다.
CI는 변경하지 않았고 Goal 관리용 추정은 약 99%입니다.

2026-10-03 registry snapshot 공급 형식 개선 후보: Vercel Instant Rollback
중 새 snapshot URL 손실을 줄이기 위해 77번째부터 manifest와 전이
의존성을 GitHub raw의 `main/docs/r/releases`로 고정합니다. 이전
76개 release는 수정하지 않았습니다. 새 형식 후보는 146개 item이고
로컬 release 테스트·생성·현재 빌드 일치 검사가 통과했습니다.
전이 의존성 245개가 모두 raw 경로를 가리킵니다. PR CI·공개 raw
소비자 설치는 확인 전입니다. Goal 관리용 추정은 약 99%입니다.
[작업 기록](registry-durable-snapshot-2026-10-03.md)을 참고하세요.

2026-10-03 `TransferList` 공개: PR #142와 병합 commit
`d1938377`의 Verify UI, Pages가 성공했고 Vercel production은
READY입니다. `ui.pydemia.ai`의 새 JS, 현재 item과 76번째 snapshot
manifest가 HTTP 200이며 manifest는 146개 item을 담습니다. 공개
수량은 144개 component·146개 registry item입니다. 공개 사이트의
키보드·form 조작은 로컬에서 확인한 동작을 반복하지 않았습니다.
Goal 관리용 추정은 약 99%입니다.
[작업 기록](transfer-list-2026-10-03.md)을 참고하세요.

2026-10-03 `TransferList` 구현 검토 당시: Selection의 두 목록 배정 용례를
원본 구현으로 추가했습니다. export·registry·provenance·Usage·preview와
76번째 snapshot 후보를 준비했습니다. typecheck·전체 UI 테스트
268/268·build·registry snapshot 검사와 로컬 Chromium의 keyboard,
form 제출, 390px 표시와 PRISM 32/32를 확인했습니다.
`registry:release-check`도 통과했습니다. PR CI·공개 공급은 아직
확인 전입니다. 공개 수량 143개 component·145개 item은 그대로이며,
후보는 144개·146개입니다. Goal 관리용 추정은 약 99%입니다.
[작업 기록](transfer-list-2026-10-03.md)을 참고하세요.

2026-10-03 Intake workspace 공개: 기존 10개 component로 단계별
요청 입력·기간·첨부 예정 목록과 접수 표를 연결했습니다. 공백 제목과
기간 누락 차단, 파일 선택·제출·표 반영·390px 내부 스크롤을 로컬
Chromium에서 확인했습니다. typecheck·build·registry release 검사가
통과했습니다. 새 public item은 없고 Goal 관리용 추정은 약 99%입니다.
PR #139와 병합 commit의 Verify UI·Pages, Vercel production, 사용자
도메인의 새 JS 접근을 확인했습니다. 공개 사이트의 입력·제출은
다시 조작하지 않았습니다.
[작업 기록](intake-workspace-2026-10-03.md)을 참고하세요.
같은 날 공급·품질 판정에서 개발 중 Usage·preview 완성 조건을 공개
후보 단계로 옮겼습니다.
[판정 기록](quality-checklist-decision-2026-10-03.md)을 참고하세요.

2026-10-03 release 이력 보존 검사 병합·공개: PR #137과 `main` Verify UI,
Pages가 통과했고 Vercel production 배포가 READY입니다. 공개 도메인의
75번째 manifest·Button item이 HTTP 200입니다. 과거 파일의 수정·삭제
거부는 임시 Git 저장소에서 확인했으며 실제 Instant Rollback은
시험하지 않았습니다. [공급 기록](release-history-guard-2026-10-03.md)을
참고하세요. Goal 관리용 추정은 약 99%입니다.

2026-10-03 release 이력 보존 검사 후보: 기존 snapshot 파일의 수정·삭제를
PR·`main`에서 거부하는 작은 자동 검사를 추가했습니다. 신규 release
추가·기존 원본 수정·게시 복사본 삭제를 임시 Git 저장소에서 검증했고,
typecheck·UI 테스트 265/265·build·PRISM 검사 30/30·registry release
검사가 통과했습니다. README에 새 커밋으로 복구하면서 release 파일을
유지하는 절차를 적었습니다. PR CI·실제 복구 배포는 미검증입니다.
[작업 기록](release-history-guard-2026-10-03.md)을 참고하세요.
Goal 관리용 추정은 약 99%입니다.

2026-10-03 75번째 snapshot 공개: Vercel preview와 `main`의 파일
내용을 대조하고 production 승격 배포
`dpl_7eqSffEpoZco4hUB1u7ofdyJgBTj`의 READY를 확인했습니다.
현재 registry·75번째 manifest·대표 snapshot item·token과 의존
도메인 utils가 HTTP 200이며 로컬 JSON과 일치합니다. 공개 수량은
143개 component·145개 item입니다. Rollback 시 새 불변 URL 보존은
남아 있고 Goal 관리용 추정은 약 99%입니다.
[공개 기록](shadcn-provenance-scope-2026-10-03.md)을 참고하세요.

2026-10-03 Goal 범위 점검: 143개 component·145개 item, 주요
framework·navigation·analytics·feedback 범주와 공개 복합 화면의
동작을 대조했습니다. 현재 typecheck·UI 테스트 265/265·build·
registry release 검사가 통과했고 공개 대표 item 8개는 HTTP
200입니다. 75번째 snapshot은 사용자 도메인에서 404이며 이전
배포 rollback의 URL 보존도 미완료라 Goal 완료 판정은 보류합니다.
[점검 기록](goal-scope-audit-2026-10-03.md)을 참고하세요.
Goal 관리용 추정은 약 98%입니다.

2026-10-03 공급·품질 체크리스트 경직성 재검토: 사람 검토 범위는
이미 변경분 중심이지만, review 준비 PR과 `main`의 최신 snapshot
요구 및 전체 snapshot 복제가 게시 비용을 키웁니다. 구현 검증과
게시 검증을 별도 상태로 보고하고, 관련 component를 릴리스 묶음으로
검토합니다. workflow는 변경하지 않았습니다.
[재검토 기록](quality-checklist-stiffness-review-2026-10-03.md)을
참고하세요. Goal 관리용 추정은 약 98%입니다.

2026-10-03 shadcn/ui 출처 고지 범위 조정 병합·공개 대기:
PR #135와 `main`의 Verify UI·Pages가 통과했습니다. 고정 source
manifest는 공개 GitHub URL에서 hash가 일치하지만, Vercel 배포
제한으로 75번째 manifest는 사용자 도메인에서 404입니다.
기존 공개 수량은 143개 component·145개 item이며 Goal 관리용
추정은 약 98%입니다.
[작업 기록](shadcn-provenance-scope-2026-10-03.md)에 있습니다.

2026-10-03 `CalendarHeatmap` 공개 확인: 사용자 도메인의 현재
registry 145개 item, component item, 74번째 manifest·snapshot
item과 의존 도메인 item이 HTTP 200입니다. 응답 JSON은 게시
파일과 일치합니다. 공개 확인 수량은 143개 component·145개 item,
Goal 관리용 추정은 약 98%입니다.
[작업 기록](calendar-heatmap-2026-10-03.md)에 근거가 있습니다.

2026-10-03 shadcn/ui 출처 고지 범위 조정 후보: 원본 component의
provenance 변경이 28개 수정 소스 item의 고지까지 바꾸던 연결을
분리했습니다. build와 75번째 snapshot의 registry 검사는
통과했고 PR CI·이 변경의 공개 경로는 남았습니다.
[작업 기록](shadcn-provenance-scope-2026-10-03.md)에 근거가
있습니다. component·item 수량과 Goal 관리용 추정 약 98%는
바뀌지 않았습니다.

2026-10-03 `CalendarHeatmap` 병합·공개 대기: PR #133과
`main` Verify UI, Pages가 통과했습니다. Vercel production은
배포 횟수 제한으로 실패했고 새 item·74번째 manifest가 사용자
도메인에서 404입니다. 공개 확인은 142개 component·144개 item,
저장소 후보는 143개·145개·74개 snapshot입니다.
[작업 기록](calendar-heatmap-2026-10-03.md)에 URL과 미검증
범위가 있습니다. Goal 관리용 추정은 약 98%입니다.

2026-10-03 공급·품질 체크리스트 재검토: 고정된 수동 검사 조합이나
component별 PR·snapshot을 요구하지 않습니다. 구현 증거와 릴리스
묶음의 CI·snapshot, 공개 URL 판정을 분리해
[현행 기준](quality-checklist-decision-2026-10-03.md)을 간결하게
정리했습니다. 공개 수량과 Goal 관리용 추정 약 98%는 바뀌지
않았습니다.

2026-10-03 `CalendarHeatmap` 릴리스 후보: 원본 날짜 활동 격자와
정확한 값 표의 대상 테스트·전체 UI·typecheck·build·로컬 Chromium
경로를 확인했습니다. source commit 고지와 74번째 snapshot도
`registry:release-check`를 통과했습니다. PR CI·공개 URL은 남았습니다.
[작업 기록](calendar-heatmap-2026-10-03.md)에 검증 범위가 있습니다.
로컬 후보 143개 component·145개 item, 공개 확인 142개·144개,
Goal 관리용 추정 약 98%입니다.

2026-10-03 `SankeyChart` PR #131 병합·공개 확인: `main` Verify UI와
Pages, Vercel production이 성공했고 공개 registry는 144개 item입니다.
현재·73번째 snapshot item과 manifest, RadarChart 대기 경로가
HTTP 200입니다. 공개 확인 수량은 142개 component·144개 item입니다.
[작업 기록](sankey-chart-2026-10-03.md)에 검증 범위가 있습니다.
Goal 관리용 추정은 약 98%입니다.

2026-10-03 공급·품질 운영 범위 재평가: 후보 선정과 품질 확인, 공개
공급을 별도로 판정합니다. 변경한 동작의 증거 한 가지와 preview·Usage를
기본 수동 범위로 삼고, CI·snapshot은 릴리스 묶음에 적용합니다.
[판정 기록](quality-checklist-decision-2026-10-03.md)에 상세 기준이
있습니다. `SankeyChart`의 PR·배포 확인은 계속 남았고 Goal 관리용
추정은 약 98%입니다.

2026-10-03 `SankeyChart` 릴리스 후보: 고지를 source commit에 고정하고
73번째 snapshot과 공개용 복사본을 만들었습니다.
`registry:release-check`는 144개 item·142개 export/catalog와 현재
snapshot 일치를 확인했습니다. PR CI·공개 URL은 남았습니다.
[작업 기록](sankey-chart-2026-10-03.md)에 검증 범위와 ID가 있습니다.
Goal 관리용 추정은 약 98%입니다.

2026-10-03 `SankeyChart` 로컬 후보: 인접 단계의 수량 이동을 원본
React·SVG로 추가했습니다. 대상 테스트 5/5, typecheck·build,
로컬 Chromium의 넓은 화면과 390px preview, 방향키 스크롤을
확인했습니다. 전체 UI 260/260·PRISM 25/25가 통과했습니다.
이 단계에서는 registry 고지 고정·snapshot·전체 CI·공개 배포가
남았습니다.
[작업 기록](sankey-chart-2026-10-03.md)에 범위가 있습니다.
로컬 후보 142개 component·144개 item, 공개 확인 140개·142개,
Goal 관리용 추정 약 98%입니다.

2026-10-03 `RadarChart` PR #129 병합·공개 대기: PR과 `main`의
Verify UI·Pages가 통과했습니다. Vercel은 배포 횟수 제한으로
실패했고 72번째 manifest와 현재 item은 공개 도메인에서 HTTP
404입니다. 저장소는 141개 component·143개 item·72개 snapshot,
공개 확인은 140개·142개입니다. 앞서 대기였던 PivotTable·
Autocomplete의 현재 item과 70·71번째 manifest는 HTTP 200으로
다시 확인했습니다. 배포 뒤 RadarChart의 현재·snapshot item과
manifest를 확인하세요. [작업 기록](radar-chart-2026-10-03.md)에
근거와 미검증 범위가 있습니다. Goal 관리용 추정은 약 98%입니다.

2026-10-03 `RadarChart` 로컬 릴리스 후보: 동일 척도의 차원을 여러 계열로
비교하는 원본 component를 추가했습니다. 대상 4/4·전체 UI
255/255, typecheck·build·PRISM 23/23과 로컬 Chromium 390px
preview를 확인했습니다. provenance 고지를 source commit에 고정했고
72번째 snapshot의 release 검사가 통과했습니다. PR CI·공개 URL은
남았습니다. 로컬
141개 component·143개 item, 공개 확인은 138개·140개입니다.
[작업 기록](radar-chart-2026-10-03.md)에 검증 범위를 남겼습니다.
Goal 관리용 추정은 약 98%입니다.

2026-10-03 `Autocomplete` 병합·공개 대기: PR #127을 `main`에 병합했고
PR·`main` Verify UI와 Pages가 통과했습니다. Vercel 배포 제한으로 현재
item과 71번째 manifest는 사용자 도메인에서 HTTP 404입니다.
저장소는 140개 component·142개 registry item·71개 snapshot,
확인된 공개 수량은 138개·140개입니다. 제한 해제 뒤 배포와 공개
item·manifest를 확인하세요.
[작업 기록](autocomplete-2026-10-03.md)에 증거와 미검증 범위가
있습니다. Goal 관리용 추정은 약 98%입니다.

2026-10-03 PR #127 최신 `main` 통합: PRISM 게시 변경을 반영하고 문서
산출물을 다시 만들었습니다. Windows의 가상 Usage 경로 비교를 고쳐
PRISM 23/23·예제 10개 typecheck, 전체 typecheck·build·registry
release 검사가 통과했습니다. Vercel PR 상태는 배포 제한 실패이며,
PR Verify UI와 공개 URL은 계속 확인합니다.
[작업 기록](autocomplete-2026-10-03.md)을 참고하세요. Goal 관리용
추정은 약 98%입니다.

2026-10-03 `Autocomplete` 로컬 릴리스 후보: 자유 텍스트의 native form
제출과 manual 추천어 선택을 추가했습니다. 대상 테스트 4/4, 전체 UI
251/251, typecheck·build·PRISM 23/23, 390px Chromium preview,
`registry:release-check`가 통과했습니다. 140개 component·142개 item·
71번째 snapshot 후보입니다. PR CI와 공개 URL은 아직 확인하지
않았습니다. [작업 기록](autocomplete-2026-10-03.md)을 참고하세요.
Goal 관리용 추정은 약 98%입니다.

2026-10-03 공급·품질 체크리스트 재검토: 과거 `5/10` 운영 조사와
component 릴리스 판정을 분리했습니다. component마다 PR·snapshot을
만드는 관행과 로컬·CI 검사의 반복이 실제 경직성입니다. 관련 변경은
릴리스 후보로 묶고 후보 commit의 CI를 재사용합니다. 차단 결함과
공개 배포 대기 상태는 구분합니다.
[판정 기록](quality-checklist-decision-2026-10-03.md)을 참고하세요.
Goal 관리용 추정은 약 98%입니다.

2026-10-03 `PivotTable`은 PR #125로 병합됐고 PR·`main` Verify UI와
Pages가 통과했습니다. Vercel production은 배포 횟수 제한으로 실패해
현재 item과 70번째 manifest가 공개 도메인에서 404입니다. 제한 해제
뒤 production 배포와 manifest·현재 item·snapshot item을 확인하세요.
공개 확인은 138개 component·140개 registry item, 저장소 후보는
139개·141개입니다. [작업 기록](pivot-table-2026-10-03.md)에
증거와 미검증 범위를 남겼습니다. 체크리스트의 변경 위험별 적용은
[판정 기록](quality-checklist-decision-2026-10-03.md)을 따릅니다.
Goal 관리용 추정은 약 98%입니다.

2026-10-03 `PivotTable` 공개 준비: 두 범주의 원자료를 교차 집계하고
행·열·전체 합계를 제공하는 원본 component를 추가했습니다. typecheck·
대상/전체 테스트·build, 390px Chromium preview, provenance 고지와
70번째 snapshot을 확인했습니다. PR CI와 공개 URL은 남았습니다.
[작업 기록](pivot-table-2026-10-03.md)을 참고하세요. 로컬 139개
component·141개 item, 공개 138개·140개이며 Goal 관리용 추정은
약 98%입니다.

2026-10-03 공급·품질 재검토: 독립적인 표시 변경에 폭·theme·브라우저
검사를 일괄 반복하지 않고, 영향받은 핵심 동작의 증거 하나와 API·Usage
일치를 사람 검토의 기본 범위로 삼았습니다. CI·snapshot은 릴리스 묶음
조건이며 현재 자동화 비용은 그대로입니다.
[판정 기록](quality-checklist-decision-2026-10-03.md)을 참고하세요.
Goal 관리용 추정은 약 98%입니다.

2026-10-03 `TreemapChart` 공개 확인: PR #123 병합 뒤 CI·Pages·Vercel
production이 성공했고 69번째 manifest와 현재·snapshot item이 공개
URL에서 일치합니다. 138개 component·140개 item입니다. 기존
`AppShell` 68번째 manifest도 현재 HTTP 200입니다. 근거와 미검증
범위는 [차트 기록](treemap-chart-2026-10-03.md)과
[AppShell 기록](app-shell-panel-appearances-2026-10-03.md)에 있습니다.
Goal 관리용 추정은 약 98%입니다.

2026-10-03 `TreemapChart` 공개 준비: 계층별 구성비와 정확한 값 표를
추가하고 69번째 snapshot과 provenance 고지를 검증했습니다. PR CI와
공개 경로는 남아 있습니다. 검증 범위는
[작업 기록](treemap-chart-2026-10-03.md)을 참고하세요. Goal 관리용
추정은 약 98%입니다.

2026-10-03 공급·품질 수준 재판정: 개발 중 구현 검토와 공개 준비·확인의
최소 증거를 [로드맵](component-roadmap.md#공급과-품질의-판정-단위)에
간결하게 정리했습니다. 실제 반복 비용은 전체 CI와 snapshot 복제이며
품질 점수로 세지 않습니다. 제품 코드·workflow·공개 수량은 바뀌지
않았습니다. [판정 근거](quality-checklist-decision-2026-10-03.md)를
참고하세요. Goal 관리용 추정은 약 98%입니다.

2026-10-03 PR #120 병합·공개 대기: AppShell 측면·하단의 `inset` 표시와
68번째 snapshot이 `main`에 들어갔습니다. PR·`main` Verify UI와 Pages는
성공했으나 Vercel production 배포 제한으로 새 manifest는 404이고
현재 AppShell item은 옛 내용입니다. [작업 기록](app-shell-panel-appearances-2026-10-03.md)에
근거와 재확인 대상을 남겼습니다. Goal 관리용 추정은 약 98%입니다.

2026-10-03 AppShell panel 표시 형태 로컬 후보: 측면·하단에 기본
`attached`와 안쪽 여백형 `inset`을 추가했습니다. typecheck·대상 테스트·
390px/1280px preview·build·68번째 snapshot 검사는 통과했고 공개는
진행 중입니다.
[작업 기록](app-shell-panel-appearances-2026-10-03.md)을 참고하세요.
Goal 관리용 추정은 약 98%입니다.

2026-10-03 PR #118 병합·공개 확인: `HistogramChart`의 PR·`main` Verify UI,
Pages와 Vercel production이 성공했습니다. 공개 item과 67번째 snapshot
manifest는 HTTP 200이며 로컬 생성물과 SHA-256이 같습니다. 137개
component·139개 item입니다. 공급·품질 체크리스트의 실제 부담은
snapshot 전체 복제이며 [작업 기록](histogram-chart-2026-10-03.md)에
남겼습니다. Goal 관리용 추정은 약 98%입니다.

2026-10-03 `HistogramChart` 로컬 릴리스 준비: 137개 component·139개
registry item·67번째 snapshot의 typecheck·대상 테스트·build·
`registry:release-check`와 Chromium preview를 확인했습니다. PR CI와
공개 URL은 아직 미확인입니다. [작업 기록](histogram-chart-2026-10-03.md)을
참고하세요. 공급·품질 체크리스트는 해당 변경 위험에만 적용했고 Goal
관리용 추정은 약 98%입니다.

2026-10-03 `HistogramChart` 로컬 구현 후보: 연속된 동일 너비 구간의
빈도를 검증하고 막대·정확한 값 표로 표시합니다. 대상 테스트와
typecheck는 통과했으며 build·registry·browser·공개 검증은 이어서
확인해야 합니다. [작업 기록](histogram-chart-2026-10-03.md)을
참고하세요. Goal 관리용 추정은 약 98%입니다.

2026-10-03 PR #116 병합: `BoxPlotChart`와 66번째 snapshot, 체크리스트
재검토가 `main`에 들어갔습니다. PR·`main` Verify UI와 Pages는
성공했지만 Vercel production은 배포 제한으로 실패했고 새 item과
manifest URL은 404입니다. [작업 기록](box-plot-chart-2026-10-03.md)을
참고해 제한 해제 뒤 공개 경로를 다시 확인하세요. Goal 관리용 추정은
약 98%입니다.

2026-10-03 `BoxPlotChart` 공개 준비: 원본 component, catalog와
registry를 추가하고 로컬 preview·typecheck·대상 테스트·build·
`registry:release-check`를 확인했습니다. 66번째 snapshot을 생성했으며
공개 CI와 production URL은 남았습니다. [작업 기록](box-plot-chart-2026-10-03.md)을
참고하세요. Goal 관리용 추정은 약 98%입니다.

2026-10-03 공급·품질 체크리스트 적용 재검토: 구현 검토·공개 준비·
공개 확인의 증거를 분리했습니다. 이미 확인된 문서 전용 `main` CI
개선을 남은 비용에서 제외하고, provenance hash 전파와 snapshot 전체
복제를 별도 개선 과제로 남겼습니다. [판정 기록](quality-checklist-decision-2026-10-03.md)을
참고하세요. Goal 관리용 추정은 약 98%입니다. `BoxPlotChart`는 아직
로컬 후보이며 작업 브랜치의 검증·릴리스를 이어가야 합니다.

2026-10-03 문서 전용 CI 실측: PR #115와 병합 뒤 `main` Verify UI가
diff 검사만 실행하고 UI·registry 검사를 생략해 성공했습니다. Pages도
통과했고 Vercel production은 배포 횟수 제한으로 확인하지 못했습니다.
새 component 수는 없으며 Goal 추정은 약 98%입니다.
[검증 기록](main-ci-scope-2026-10-03.md)을 참고하세요.

2026-10-03 PR #114 병합: 변경 경로별 Verify UI를 `main`에 반영했고
PR·`main` Verify UI와 Pages가 통과했습니다. workflow 변경이므로
`main`은 전체 검사를 실행했습니다. 문서 전용 `main` push의 단계
생략은 남은 검증이며 Vercel은 배포 횟수 제한 상태입니다. Goal 추정은
약 98%입니다. [작업 기록](main-ci-scope-2026-10-03.md)을 참고하세요.

2026-10-03 `main` CI 범위 조정 후보: 문서 전용 push는 diff 공백 검사만
실행하고 코드·생성물 변경이나 기준 commit 확인 실패 시 전체 검사를
유지하도록 workflow를 수정했습니다. 로컬 분기 시험은 통과했고
PR·`main` Actions 결과는 아직 확인하지 않았습니다. Goal 추정은
약 98%입니다. [작업 기록](main-ci-scope-2026-10-03.md)을 참고하세요.

2026-10-03 공급·품질 기준 재검토: 현행 릴리스 하한은 변경분 중심이며,
반복 비용은 `main`의 문서 전용 전체 CI와 snapshot 전체 복제에 있습니다.
운영 개선을 릴리스 점수와 분리했습니다. 코드·workflow는 바꾸지 않았고
Goal 추정은 약 98%입니다.
[현재 기준과 근거](quality-checklist-current-review-2026-10-02.md)를
참고하세요.

2026-10-03 PR #113 병합 후 상태: 공개 snapshot 소비자 조합 검사와
`Thread`의 게시글별 `key` 안내가 `main`에 들어갔습니다. PR·`main`
Verify UI와 Pages가 통과했습니다. Vercel은 배포 횟수 제한으로 실패해
새 catalog 설명의 production 공개는 대기 중입니다. 기존 65번째
snapshot의 소비자 설치·동작 검증은 완료했고 Goal 추정은 약 98%입니다.
[검사·배포 기록](public-composite-consumer-2026-10-03.md)을 참고하세요.

2026-10-03 공개 registry 조합 소비자: 65번째 snapshot의 13개 item을
새 Vite 프로젝트에 설치하고 20개 생성 파일의 typecheck·build와
390px·1280px 화면의 탐색·분석·게시판·대댓글 흐름을 확인했습니다.
게시글 전환 시 `Thread`에 `key={postId}`가 필요한 조합 규칙을 catalog에
추가했습니다. 문서 PR·공개 반영은 남았으며 Goal 추정 약 98%입니다.
[소비자 검사 기록](public-composite-consumer-2026-10-03.md)을 참고하세요.

2026-10-03 PR #111 배포: 두 chart의 `plain` 표시와 65번째 snapshot을
`main`에 병합했습니다. PR·`main` Verify UI와 Pages, Vercel production이
성공했고 공개 JSON·manifest의 내용이 로컬 생성물과 일치합니다.
이전에 404였던 `ItemList`도 현재 공개 URL에서 HTTP 200입니다.
[차트 작업 기록](chart-appearances-2026-10-03.md)에 근거를 남겼습니다.
Goal 관리용 추정은 약 98%입니다.

2026-10-03 공급·품질 기준 재검토: 차트의 작은 표시 변경에도 276개
snapshot 파일이 생성됐습니다. 변경분의 사람 검토와 자동 릴리스
비용을 분리하고, CI·snapshot·고지 생성의 고정 비용을 개선 대상으로
기록했습니다. [판단 근거](quality-checklist-review-2026-10-03.md)를
참고하세요. Goal 관리용 추정은 약 98%입니다.

2026-10-03 DataChart·DonutChart 표시 형태 로컬 후보: 상위 panel에
중첩할 때 chart 자체의 테두리·배경·외곽 여백을 제거하는 `plain`을
추가했습니다. 기존 `panel`은 기본값입니다. typecheck·UI 테스트
226/226·build·65번째 registry snapshot 검사와 두 preview의 전환을
확인했습니다. 새 component/item 수는 없고 공개 CI·URL은 미검증입니다.
`ItemList`는 PR #110으로 `main`에 병합됐으나 마지막 확인에서
production item과 snapshot manifest는 404였습니다. Goal 관리용
추정은 약 98%입니다.
[차트 작업 기록](chart-appearances-2026-10-03.md)을 참고하세요.

2026-10-03 `ItemList` 로컬 후보: 제목·설명·메타 정보·별도 작업을
같은 native 목록에 배치하고 panel/plain·comfortable/compact를
선택합니다. typecheck·전체 UI 테스트 226/226, Chromium 390px·1280px
preview와 작업 버튼·디자인 전환을 확인했습니다. build·registry
release 검사가 64번째 snapshot과 135개 component·137개 item의
정합성을 확인했습니다. PR·공개 경로는 남았습니다. production은
134개·136개·63개이며 Goal 추정 약 98%입니다.
[작업 기록](item-list-2026-10-03.md)을 참고하세요.

2026-10-03 체크리스트 재검토와 `WaterfallChart` 공개: 정적 원본
차트에는 정확한 값 표·경계값 테스트·preview를 적용하고 일반 개념
참고를 외부 코드 편입 검사로 취급하지 않습니다. 현행 draft PR은
현재 snapshot 검사를 생략하지만 공개 후보와 `main`은 확인합니다.
판단은 [체크리스트 기록](quality-checklist-review-2026-10-03.md)에
있습니다. PR #109를 `main`에 병합했고 PR·main Verify UI, Pages,
Vercel production과 새 item·snapshot·문서 JS의 공개 일치를
확인했습니다. 공개 134개 component·136개 item·63개 snapshot,
Goal 관리용 추정은 약 98%입니다.
[차트 작업 기록](waterfall-chart-2026-10-03.md)을 참고하세요.

2026-10-03 `LogViewer` 최신 로그 따라가기: 기존 component에
선택형 자동 스크롤과 일시정지·재개를 추가했습니다. PR #108을
`main`에 병합했고 CI·Pages·Vercel production과 공개 registry
경로를 확인했습니다. 133개 component·135개 item·62개 snapshot이
공개됐으며 Goal 관리용 추정은 약 98%입니다. 로컬 동작과 공급
근거는 [작업 기록](log-viewer-follow-tail-2026-10-03.md)에 있습니다.
체크리스트의 실제 고정 비용은
[추가 검토](quality-checklist-review-2026-10-03.md)에 기록했습니다.

2026-10-03 Dashboard 배치 선택: 3열 지표와 2:1 상세 panel을
기존 API에 추가했습니다. typecheck·build·registry release 검사와
852px·390px 문서 preview를 확인했습니다. PR #107을 `main`에
병합했고 61번째 snapshot을 포함했습니다. Vercel production은 배포
제한으로 이전 버전입니다. Goal 추정 약 97%이며 검증 상태와 공개
재확인 범위는 [작업 기록](dashboard-layouts-2026-10-03.md)에 있습니다.

2026-10-03 PR #106 병합·공개 상태: `main`의 Verify UI와 Pages는
성공했지만 Vercel production은 배포 제한으로 이전 버전입니다.
새 item 세 개의 공개 URL은 404이며 goal 추정 약 97%입니다.
배포 재확인 범위는 [릴리스 기록](release-pr106-2026-10-03.md)에
남겼습니다.

2026-10-03 AppShell 반응형 탐색: 기존 `Sidebar`의 desktop 접기·
mobile drawer를 AppShell preview와 Usage에 연결했습니다. 문서
typecheck·build, Chromium의 390px·1280px 배치와 열기·닫기·링크
선택·focus 복귀를 확인했습니다. 새 component·snapshot은 없고
goal 추정 약 97%입니다. 세부 범위는
[작업 기록](app-shell-sidebar-recipe-2026-10-03.md)에 있습니다.
PR #106 최신 commit의 Verify UI와 preview 배포가 성공했습니다.

2026-10-03 PR #106 리뷰 수정: `BulletChart`의 빈 formatter 결과가
단위만 표시되던 문제를 고쳤습니다. 대상 테스트 4/4,
typecheck·build·registry release 검사가 통과했고 미공개
60번째 snapshot을 교체했습니다. 새 ID와 남은 검증은
[작업 기록](bullet-chart-2026-10-03.md)에 있습니다. 최신 PR CI는
성공했고 preview의 현재 item·snapshot manifest는 HTTP 200입니다.
production 공급은 아직 확인하지 않았습니다. Goal 추정 약 97%입니다.
사용자 도메인의 세 새 item은 각각 HTTP 404였습니다. 이 CI·URL
결과를 반영한 문서 수정은 로컬 작업 트리에만 있습니다.

2026-10-03 체크리스트 후속 재검토: 개발 중 후보에는 영향받은 검사만
적용하고, 공개 후보에서 공급물·CI·snapshot을 판정하도록
[기준](component-roadmap.md#공급과-품질의-판정-단위)을 명확히 했습니다.
같은 검증을 여러 문서에 복제하지 않는 기록 원칙과 확인 근거는
[재판정 기록](quality-checklist-review-2026-10-03.md)에 있습니다.
PR #106 최신 commit의 Verify UI는 성공, preview는 READY이며
production은 이전 배포입니다. 공개 130개·132개, 브랜치
133개·135개, goal 관리용 추정 약 97%입니다.

2026-10-03 AppShell 하단 패널 예시: 기존 `AppBottomPanel`·
`Collapsible`·`Button`으로 접히는 상태 패널의 preview·Usage를
작성했습니다. typecheck·build·registry release 검사와 Chromium
클릭·Enter·focus·390px, 해당 영역 axe violation 0건을 확인했습니다.
새 component·registry item은 없고 goal 추정 약 97%도 그대로입니다.
공개 preview와 실제 screen reader 발표는 미검증입니다.
[작업 기록](app-bottom-disclosure-recipe-2026-10-03.md)을 참고하세요.

2026-10-03 `FunnelChart` 로컬 후보: 전환 단계의 값·첫 단계 대비
도달률·결측값·0건을 별도 원본 component로 구현했습니다.
typecheck·UI 테스트 218/218·build·registry(135개 item, 133개
export/catalog)가 통과했고 Chromium의 기본·미수집·빈 목록·390px
표시와 차트 axe violation 0건을 확인했습니다. 표시 번호 조정 뒤
대상 테스트 3/3이 통과했습니다. `BulletChart`와 60번째 snapshot을
함께 묶어 `registry:release-check`가 통과했습니다. PR #106의
검토 준비 Verify UI run `37049005305`도 성공했습니다. Vercel
preview는 READY, 사용자 production의 세 새 item은 404입니다.
브랜치는 133개 component·135개 item, 공개 사이트는 130개·
132개이며 goal 추정은 약 97%입니다.
[작업 기록](funnel-chart-2026-10-03.md)을 참고하세요.

2026-10-03 공급·품질 체크리스트 재검토: 현행 변경분 중심 하한은
유지하고 구현·공개 후보·공개 공급을 별도 상태로 보고합니다.
`BarList`는 품질 검사 후 Vercel 제한으로 공개 대기, `BulletChart`는
로컬·draft PR #106 CI를 통과한 구현 후보입니다. CI 중복·snapshot
전체 복제·공통 고지 hash 전파는 품질 체크박스를 줄이는 대신 별도
구현 과제로 분류했습니다. 제품 코드·공개 수량과 goal 추정 약 97%는
그대로입니다.
[판정 기록](quality-checklist-review-2026-10-03.md)을 참고하세요.

2026-10-03 `BulletChart` 로컬 후보: 목표 대비 실적을 명시한 상한과
함께 표시합니다. 0·미수집을 구분하고 Operations workspace의 완료
건수에 연결했습니다. typecheck·UI 테스트 215/215·build·registry와
로컬 Chromium 표시·상태 갱신을 확인했습니다. Vercel 제한 중에는
추가 snapshot을 만들지 않았습니다. `main` 131개 component·133개
item·59개 snapshot, 로컬 132개·134개, goal 추정 약 97%입니다.
[draft PR #106](https://github.com/pydemia/ui/pull/106)의 Verify UI
run `37045189665`는 성공했습니다. 새 snapshot·production 공급은
아직 확인하지 않았습니다.
[작업 기록](bullet-chart-2026-10-03.md)을 참고하세요.

2026-10-03 `BarList`를 PR #105로 `main`에 병합했습니다. PR·main
Verify UI와 Pages는 성공했습니다. Vercel의 24시간 배포 제한으로
production 배포가 없고 공개 `pyd-bar-list.json`은 404입니다.
저장소 131개 component·133개 item·59개 snapshot, 사용자 사이트
130개·132개·58개입니다. 제한 해제 뒤 production 배포와 공개
item·snapshot URL을 확인하고 로드맵 완료 표시를 갱신하세요.
이번 검토로 goal 관리용 추정 약 97%는 올리지 않았습니다.
[작업 기록](bar-list-2026-10-03.md)을 참고하세요.

2026-10-03 `BarList` 로컬 후보: 범주별 값·0건·빈 목록을 가로
막대와 정확한 텍스트로 표시합니다. Operations workspace의 실행
상태와 연결했고 typecheck·UI 테스트 212/212·build, 로컬 Chromium의
390px 표시·상태 갱신을 확인했습니다. registry 검사·59번째
snapshot·release check가 통과했고 PR CI·공개 URL은 진행 중입니다.
공개 130개 component·132개
item·58개 snapshot, 로컬 131개·133개, goal 추정 약 97%입니다.
[작업 기록](bar-list-2026-10-03.md)을 참고하세요.

2026-10-03 공급·품질 체크리스트 재검토: 기존 설치 경로의 새 item에
매 릴리스 대표 소비자 설치를 요구하던 로드맵 문구를 고쳤습니다.
API·preview·Usage·출처, 변경한 핵심 동작, 적용 CI·공개 경로의
증거는 유지합니다. 검사 코드·snapshot 형식은 그대로이며 공개
130개 component·132개 item·58개 snapshot, goal 추정 약 97%입니다.
[현재 기준](quality-checklist-current-review-2026-10-02.md)을 참고하세요.

2026-10-03 `AppFloatingDisclosure` 공개 확인: PR #104를
`7f40cc3d3`로 병합했습니다. PR·`main` Verify UI, Pages,
Vercel production이 성공했고 현재 item·58번째 snapshot
manifest·item·문서 JS asset이 로컬 빌드와 일치합니다. 공개
130개 component·132개 item·58개 snapshot, goal 추정 약
97%입니다. 공개 뒤 기록은 별도 문서 commit에 두었으므로 다음
제품 변경에 포함하세요.
[작업 기록](app-floating-disclosure-2026-10-03.md)을 참고하세요.

2026-10-03 `AppFloatingDisclosure` 로컬 후보: `AppShell`의 floating
bubble·panel에 열림 상태, 닫기·Escape의 focus 복귀와 외부 이동
닫기를 묶었습니다. typecheck·UI 테스트 209/209·build·registry
검사, 로컬 Chromium의 Tab·Escape·390px·light/dark를 확인했습니다.
58번째 snapshot을 생성·재빌드하고 release check가 통과했습니다.
PR CI·공개 URL은 남았습니다. 공개 130개 component·132개 item·
57개 snapshot, 로컬 58개 snapshot이며 goal 추정 약 97%입니다.
[작업 기록](app-floating-disclosure-2026-10-03.md)을 참고하세요.

2026-10-03 `FormWizard` 공개 확인: PR #103을 `e921800e8`로
병합했고 PR·`main` Verify UI, Pages, Vercel production이
성공했습니다. 공개 item·57번째 snapshot manifest·item·사이트
JS asset이 로컬과 일치합니다. 공개 130개 component·132개 item·
57개 snapshot, goal 추정 약 97%입니다. 공개 뒤 기록은 이번
제품 변경에 포함합니다.
[작업 기록](form-wizard-2026-10-03.md)을 참고하세요.

2026-10-03 공급·품질 체크리스트를 다시 검토했습니다. 현행 필수
증거는 변경분 중심이며, 과도한 비용은 snapshot 전체 복제와
출처 고지 hash의 전파에서 발생합니다. README의 매 릴리스 별도
소비자 설치 문장을 설치 경로 변경 시 검사로 고쳤습니다. 검사
코드·snapshot 형식과 goal 추정 약 97%는 바꾸지 않았습니다.
[현재 판정](quality-checklist-current-review-2026-10-02.md)을 참고하세요.

2026-10-03 `FormWizard` 로컬 후보: 단계별 native·비동기 검증,
이전·다음·완료 작업과 가로·세로, panel·plain 표시를 추가했습니다.
typecheck·UI 테스트 206/206·build·registry 검사와 로컬 Chromium
핵심 흐름·390px 배치를 확인했습니다. 57번째 snapshot 생성·재빌드·
release check도 통과했습니다. PR CI·공개 URL은 남았습니다.
공개 129개 component·131개 item·56개 snapshot, 로컬
130개·132개·57개이며 goal 추정은 약 97%입니다.
[작업 기록](form-wizard-2026-10-03.md)을 참고하세요.

2026-10-03 `DataTable` 행 상세 공개 확인: PR #102를 `3c2fa29`로
병합했습니다. PR·`main` Verify UI, Pages와 Vercel production이
성공했습니다. 공개 item과 56번째 snapshot의 manifest·item, 사이트
JS asset이 로컬 빌드와 일치합니다. 공개 브라우저 시각 동작은 도구
응답 실패로 미검증이며 로컬 Chromium 동작은 확인했습니다. 공개
129개 component·131개 item·56개 snapshot, goal 추정 약 97%입니다.
[작업 기록](data-table-details-2026-10-03.md)을 참고하세요.

2026-10-03 공급·품질 체크리스트의 현재 적용 문서를 간결하게 정리했습니다.
릴리스 판정은 변경분의 API·Usage·preview·고지 일치, 핵심 동작의
테스트 또는 브라우저 증거, 적용 CI와 공개 경로 확인으로 합니다.
위험별 추가 검사를 구분하고, 반복 CI·snapshot 복제 비용은 별도
구현 과제로 기록했습니다. 공개 수량과 goal 추정 약 97%는 그대로입니다.
[현재 기준](quality-checklist-current-review-2026-10-02.md)을 참고하세요.

2026-10-03 `DataTable` 행 상세 로컬 후보: `renderRowDetails`를 추가하고
로컬·remote preview와 Usage를 갱신했습니다. typecheck, UI 테스트
202/202, build, registry:check와 로컬 Chromium 동작·390px 배치를
확인했습니다. 56번째 snapshot 생성·재빌드·release check를 마쳤고
PR CI·공개 URL 확인은 남았습니다. 새 component 수는 없습니다.
공개 수량은 129개 component·131개 item·55개 snapshot이며 goal
관리용 추정은 약 97%입니다.
[작업 기록](data-table-details-2026-10-03.md)을 참고하세요.

2026-10-03 `BlockEditor` 구조 이력 공개 확인: PR #101을 `1172fc7`로
병합했습니다. PR·`main` Verify UI, Pages와 Vercel production이
성공했습니다. 공개 preview·Usage, 현재 item과 55번째 snapshot의
manifest·변경 item URL이 저장소 파일과 일치합니다. 공개 수량은
129개 component·131개 item·55개 snapshot이며 goal 관리용 추정은
약 97%입니다. 이번 공개 확인 기록은 배포 중복을 피하기 위해 다음
제품 변경에 포함하세요.
[작업 기록](block-editor-structure-history-2026-10-02.md)을 참고하세요.

2026-10-02 `BlockEditor` 구조 이력 로컬 후보: 추가·삭제·이동·형식
변경의 되돌리기·다시 실행을 구현했습니다. 초기화 뒤 형식 select가
잘못 표시되던 preview 오류도 수정했습니다. typecheck·UI 테스트
200/200·build·registry:check와 로컬 Chromium의 텍스트 보존·초기화
흐름을 확인했습니다. 55번째 snapshot을 생성·재빌드해
`registry:release-check`를 통과했습니다. PR·공개 경로는 남았습니다.
공개 129개 component·131개 item·54개 snapshot, 로컬 55개,
goal 관리용 추정
약 97%는 그대로입니다.
[작업 기록](block-editor-structure-history-2026-10-02.md)을 참고하세요.

2026-10-02 공급·품질 판정 범위를 다시 검토했습니다. 개발 중에는
영향받은 검사만 실행하고, 공개 후보 commit에서 적용 CI를 확인합니다.
focus·pointer·browser API 변경도 관련 자동 테스트가 실제 흐름을
검증하면 별도 브라우저 재실행을 요구하지 않습니다. CI와 snapshot의
반복 비용은 별도 구현 과제로 남겼습니다. 제품·배포 상태와 goal
관리용 추정 약 97%는 그대로입니다.
[검토 기록](quality-checklist-scope-2026-10-02.md)을 참고하세요.

2026-10-02 `ArtifactViewer` 공개 확인: PR #100을 `026378c`로
병합했습니다. PR·`main` Verify UI, Pages와 Vercel production이
성공했습니다. 공개 preview·Usage와 현재 item, 54번째 snapshot의
manifest·대표 item이 저장소 파일과 byte 단위로 일치합니다. 공개
snapshot의 소비자 설치·typecheck·build, provenance 고지 pin도
확인했습니다. 공개 129개 component·131개 item·54개 snapshot이며
goal 관리용 추정은 약 97%입니다. [작업 기록](artifact-viewer-2026-10-02.md)을
참고하세요.

2026-10-02 공급·품질 재판정: 자동 검사가 전체 item을 대조한 경우
공개 URL은 manifest와 의존 경로별 대표 변경 item을 확인합니다.
`ArtifactViewer`의 공통 고지 pin은 기존 item 29개를 바꾸고 새
snapshot을 두 위치에 각각 132개 파일씩 만듭니다. 사람의 중복
검사 범위만 줄였고 CI·생성 방식은 바꾸지 않았습니다. 공개 후보
검증과 goal 추정 약 97%는 그대로입니다.
[검토 기록](quality-checklist-reassessment-2026-10-02.md)을 참고하세요.

2026-10-02 `ArtifactViewer` 로컬 후보: revision 선택·Markdown 표시·
원문·직전 revision 비교를 구현했습니다. typecheck·build·UI
테스트 199/199와 로컬 Chromium 핵심 흐름, 390px 가로 넘침·console
error 0건을 확인했습니다. 고지 pin과 54번째 snapshot, 로컬
대표 소비자 설치·typecheck·build와 현재 빌드의
`registry:release-check`를 확인했습니다. PR·공개 검증은 남았습니다.
공개 128개 component·
130개 item·53개 snapshot, 로컬 129개·131개·54개이며 goal 추정은
약 97%입니다. [작업 기록](artifact-viewer-2026-10-02.md)을 보세요.

2026-10-02 공개 검증 기록 PR #99를 `0e3ba12`로 병합했습니다.
비렌더링 문서 PR의 경량 Verify UI와 병합 뒤 Verify UI·Pages는
성공했습니다. Vercel은 이 문서 전용 commit의 새 배포를 24시간
횟수 제한으로 거부했습니다. 제품 PR #98의 공개 배포·preview·
registry URL 검증은 완료된 상태입니다. 이 기록은 배포를 다시
유발하지 않도록 다음 제품 변경에 포함하세요. goal 추정은 약
97%입니다.

2026-10-02 `BlockEditor` 공개 확인: PR #98을 `d7aba59`로 병합했고
Verify UI·Pages·Vercel production이 성공했습니다. 공개 preview·
Usage와 현재 item·53번째 snapshot URL의 byte 일치, 대표 소비자의
공개 snapshot CLI 설치·typecheck·build를 확인했습니다. 공개 수량은
128개 component·130개 item·53개 snapshot이며 goal 관리용 추정은
약 97%입니다. 실제 screen reader·touch·Safari·RTL은 미검증입니다.
[작업 기록](block-editor-2026-10-02.md)을 참고하세요.

2026-10-02 `BlockEditor` 로컬 후보를 구현했습니다. 일곱 블록 형식의
편집·이동·JSON 제출과 `BlockDocument`의 의미 구조 렌더링입니다.
typecheck·UI 테스트 196/196·build, 로컬 Chromium과 격리 소비자
CLI 설치·typecheck·build, 고지 pin 및 53번째 snapshot의
`registry:release-check`를 확인했습니다. PR CI·공개 URL은 남았고
공개 수량은 127개 component·129개 item·52개 snapshot입니다.
로컬은 128개·130개·53개, goal 관리용 추정은 약 97%입니다.
[작업 기록](block-editor-2026-10-02.md)을 참고하세요.

2026-10-02 공급·품질 체크리스트를 재검토했습니다. 현행 변경 위험별
기준은 유지하되 실제로 반복한 로컬·공개 상호작용 검사, 52개
snapshot의 전체 복제와 문서 전용 병합의 CI·배포 비용을 구분했습니다.
다음 릴리스에는 적용한 증거와 차단 결함만 기록하고, 공개 사이트에서
같은 상호작용을 재실행하지 않습니다. 제품·CI·게시 형식은 변경하지
않았고 goal 관리용 추정은 약 97%입니다.
[검토 기록](quality-checklist-reassessment-2026-10-02.md)을 참고하세요.

2026-10-02 ResultState 공개 확인: PR #97을 병합한 `65e2dac`의
Verify UI·Pages와 Vercel production이 성공했습니다. 공개
preview·Usage, Enter 재시도·focus, 현재 item과 52번째 snapshot
manifest·item URL을 확인했습니다. 공개 127개 component·129개 item·
52개 snapshot이며 goal 관리용 추정은 약 97%입니다.
[작업 기록](result-state-2026-10-02.md)을 참고하세요.

2026-10-02 `ResultState` 로컬 후보를 구현했습니다. `Empty`·`Spinner`·
`Button` 조합으로 진행·완료·실패와 실패 재시도를 제공합니다.
typecheck·UI 테스트 192/192·build, Chromium의 Enter 재시도·focus와
390px dark 배치를 확인했습니다. provenance 고지 pin과 52번째
snapshot의 `registry:release-check`를 통과했습니다. PR CI·공개 URL은
남았습니다. 공개 수량 126개 component·128개 item·51개
snapshot, goal 관리용 추정 약 97%를 유지합니다.
[작업 기록](result-state-2026-10-02.md)을 참고하세요.

2026-10-02 공급·품질 기준을 다시 대조했습니다. 현행 변경 위험별
판정은 유지합니다. 부담은 51개 snapshot의 두 위치 전체 복제
(각 5,613개 파일), 제품 PR과 `main`의 전체 CI 반복, 배포 횟수에
집중됩니다. 독립 항목은 검토 가능한 릴리스 묶음으로 공개하고,
표준 item마다 별도 설치·PR·snapshot을 요구하지 않습니다.
제품 코드·CI는 이번에 바꾸지 않았고 goal 추정은 약 97%입니다.
[현재 판정](quality-checklist-current-review-2026-10-02.md)을 참고하세요.

2026-10-02 CI scope 기록 배포 상태: PR #96의 기록을 `f178553`으로
병합했고 Verify UI·Pages가 성공했습니다. Vercel은 PR #95·#96의
기록 전용 병합 commit을 24시간 배포 횟수 제한으로 거부했습니다.
production은 PR #94의 READY deployment를 가리키며 제품 산출물은
같습니다. 다음 제품 변경의 Vercel 배포는 다시 확인해야 합니다.
goal 관리용 추정 약 97%입니다.
[작업 기록](ci-scope-2026-10-02.md)을 참고하세요.

2026-10-02 문서 PR 경량 검사 확인: PR #94와 병합 `75db345`에서
전체 CI가 통과했습니다. 기록 전용 PR #95는 diff 검사만 통과하고
npm·UI·registry 단계가 생략됐습니다. 병합 `c858cdf`의 `main`
Verify UI·Pages도 성공했습니다. snapshot 방식은 그대로이며 goal
관리용 추정 약 97%를 유지합니다.
[작업 기록](ci-scope-2026-10-02.md)을 참고하세요.

2026-10-02 문서 PR 검사 분기 병합: PR #94의 전체 Verify UI가 통과해
`75db345`로 병합했습니다. `main` CI와 기록 전용 PR의 단계 생략은
확인 중입니다. goal 관리용 추정 약 97%를 유지합니다.
[작업 기록](ci-scope-2026-10-02.md)을 참고하세요.

2026-10-02 문서 PR 검사 범위 초안: 비렌더링 Markdown 기록만 바뀐 PR은
`Verify UI`의 diff 공백 검사만 실행하고 제품·설치 경로 변경과
`main` push는 전체 검사를 유지하도록 workflow를 수정했습니다.
PR·문서 전용 PR·`main` 실행 결과는 아직 확인하지 않았습니다.
goal 관리용 추정 약 97%는 유지합니다.
[작업 기록](ci-scope-2026-10-02.md)을 참고하세요.

2026-10-02 NotificationCenter 공개 확인: PR #93을 병합한 `130da82`의
Verify UI·Pages와 Vercel production이 성공했습니다. 공개 preview·
Usage와 현재 item·51번째 snapshot manifest·변경 item URL을
확인했습니다. 공개 126개 component·128개 item·51개 snapshot이며
goal 관리용 추정 약 97%입니다.
[작업 기록](notification-center-2026-10-02.md)을 참고하세요.

2026-10-02 NotificationCenter 로컬 후보: 지속 알림의 읽음 상태·필터와
열기 요청을 추가했습니다. typecheck·대상 테스트·build 및 Chromium의
핵심 흐름·390px dark 배치를 확인했습니다. provenance 고지를 고정하고
51번째 snapshot의 registry 검사를 통과했습니다. PR CI·공개 확인은
남았습니다. 공개 125개 component·127개
item·50개 snapshot과 goal 관리용 추정 약 97%는 유지합니다.
[작업 기록](notification-center-2026-10-02.md)을 참고하세요.

2026-10-02 DataChart 포인터 요약 공개 확인: PR #92를 병합한
`893ab26`의 Verify UI·Pages와 Vercel production이 성공했습니다.
공개 preview의 요약 전환·결측값·Usage와 현재 chart item,
50번째 snapshot manifest·chart item URL을 확인했습니다. 공개
125개 component·127개 item·50개 snapshot이며 goal 관리용 추정은
약 97%입니다. [작업 기록](data-chart-hover-summary-2026-10-02.md)을
참고하세요.

2026-10-02 DataChart 포인터 요약 로컬 검증: 기존 `DataChart`에
`hoverSummary`를 추가하고 단일·다중 계열과 누적 영역의 현재 값을
그래프 위에 표시했습니다. 390px 가로 스크롤 좌표를 고쳤고 native
선택기·데이터 표는 유지합니다. typecheck·대상 테스트 12/12·build·
`registry:release-check`와 Chromium의 결측·범례·390px dark 동작을
확인했습니다. 50번째 snapshot은 로컬 생성 상태이며 PR·공개 확인은
남았습니다. 공개 수량 125개 component·127개 item·49개 snapshot과
goal 추정 약 97%는 유지합니다.
[작업 기록](data-chart-hover-summary-2026-10-02.md)을 참고하세요.

2026-10-02 BottomNav 표시 선택 공개 확인: PR #91을 병합한
`fc12a8f`의 Verify UI·Pages와 Vercel production이 성공했습니다.
공개 Navigation preview의 `dock` 전환·Usage, 현재 navigation item,
49번째 snapshot manifest·navigation item URL을 확인했습니다.
공개 125개 component·127개 item·49개 snapshot이며 goal 추정은
약 97%입니다. [작업 기록](navigation-dock-2026-10-02.md)을
참고하세요.

2026-10-02 BottomNav 디자인 선택 초안: 기존 `pyd-navigation`의 하단
탐색에 `bar`·`dock` 표시를 추가했습니다. 기본값은 `bar`입니다.
typecheck·UI 테스트 185/185·build·`registry:release-check`가
통과했고 390px Chromium에서 클릭·Enter·dark·가로 넘침을
확인했습니다. 49번째 snapshot을 만들었으며 PR·공개 배포는 아직
확인하지 않았습니다. component/item 수는 125/127, goal 관리용 추정은
약 97%입니다. [작업 기록](navigation-dock-2026-10-02.md)을
참고하세요.

2026-10-02 Review workspace 공개 확인: PR #90을 병합한
`024038e`의 Verify UI·Pages와 Vercel production이 성공했습니다.
공개 사이트에서 예시와 설치 명령을 확인했고 기존 registry item·token,
48번째 manifest 표본 URL은 HTTP 200입니다. 공개 수량은 125개
component·127개 item·48개 snapshot으로 같고 goal 추정 약 97%를
유지합니다. [작업 기록](review-workspace-2026-10-02.md)을
참고하세요.

2026-10-02 Review workspace 로컬 예시: 요청 검색·상태 필터,
`MasterDetail` 선택, `DiffViewer` 비교, `Thread` 대댓글과
`ApprovalCard` 결정을 연결했습니다. 브라우저에서 요청 전환 시
댓글 중복을 발견해 고쳤고 핵심 흐름과 좁은 화면을 확인했습니다.
수정판 docs typecheck·전체 build·registry 검사와 새 브라우저 탭의 오류 0건을
확인했습니다. 공개는 진행 중이며 goal 추정 약 97%를 유지합니다.
[작업 기록](review-workspace-2026-10-02.md)을 참고하세요.

2026-10-02 공급·품질 체크리스트의 경직성을 재검토했습니다. 현재
판정은 이미 변경분 중심이지만 문서 PR에도 전체 CI를 실행하고 새
snapshot마다 전체 registry item을 복제하는 절차 비용이 남아 있습니다.
사람 검토는 사용처·공개 API와 예시의 일치, 바뀐 핵심 동작의 증거,
적용되는 CI·공개 경로 세 질문으로 정리합니다. 경로가 그대로라면
공개 manifest와 대표 item URL을 표본 확인합니다. CI·snapshot 구조는
바꾸지 않았고 goal 관리용 추정 약 97%를 유지합니다.
[검토 기록](quality-checklist-stiffness-2026-10-02.md)을 참고하세요.

2026-10-02 LogViewer 공개 확인: PR #88와 병합 commit `de243eb`의
Verify UI·Pages, Vercel production이 성공했습니다. 공개
preview·Usage, 현재 item과 48번째 snapshot manifest·item URL을
확인했습니다. 공개 125개 component·127개 item·48개 snapshot,
goal 관리용 추정 약 97%입니다. 실제 keyboard-only·screen reader·
touch·Safari·RTL과 별도 소비자 설치는 미검증입니다.
[작업 기록](log-viewer-2026-10-02.md)을 참고하세요.

2026-10-02 LogViewer 로컬 후보: 로그 검색·수준 선택·결과 건수와
panel·flat 표시를 기존 LogConsole 위에 구현했습니다. 로컬
typecheck·build·UI 테스트 184/184와 Chromium의 검색·빈 결과·390px
dark 배치를 확인했습니다. 125개 component·127개 registry item을
로컬에서 만들고 provenance 고지와 48번째 snapshot을 고정했습니다.
`registry:release-check`가 통과했고 PR·공개 공급은 남았습니다.
공개 기준 124개·126개·47개 snapshot과 goal 관리용
추정 약 97%는 유지합니다.
[작업 기록](log-viewer-2026-10-02.md)을 참고하세요.

2026-10-02 AppShell 표시 확장 공개 확인: PR #86과 병합 commit
`802831d`의 Verify UI·Pages, Vercel production이 성공했습니다.
공개 preview·Usage, 현재 item과 47번째 snapshot manifest·item
URL을 확인했습니다. 공개 124개 component·126개 item·47개
snapshot, goal 관리용 추정 약 97%입니다.
[작업 기록](app-shell-appearances-2026-10-02.md)을 참고하세요.

2026-10-02 공급·품질 체크리스트를 다시 줄였습니다. 릴리스마다
같은 commit의 자동 검사, 변경한 핵심 흐름 한 번 실행, 공개 묶음의
배포·경로 확인만 요구합니다. 외부 코드·브라우저 동작·설치 경로
변경에는 해당 검사만 추가하고 과거 10개 누적 과제는 점수로 세지
않습니다. 현재 workflow의 문서 PR 전체 UI 검사와 snapshot 복제는
별도 구현 과제입니다. 기준 변경만으로 goal 추정 약 97%는 그대로입니다.
[현재 기준](quality-checklist-current-review-2026-10-02.md)을
참고하세요.

2026-10-02 AppShell 표시 확장 로컬 초안: `framed`·`canvas` 골격과
원형·pill floating bubble을 구현했습니다. Operations 예시에서
canvas를 사용하고 문서 preview에서 세 표시 축을 전환합니다.
로컬 Chromium의 기본·변형, 좌측 도움말 열기·Escape·focus 복귀,
390px dark와 하단 상태 문구 간격을 확인했습니다. typecheck·build·
registry release 검사는 47번째 snapshot으로 통과했습니다. PR CI·
공개 배포는 아직 남았습니다. 공개 수량 124개 component·126개 item·
46개 snapshot과 goal 관리용 추정 약 97%는 유지합니다.
[작업 기록](app-shell-appearances-2026-10-02.md)을 참고하세요.

2026-10-02 Empty·Skeleton 표시 확장 공개 확인: PR #84와 병합
commit `95a1d3e`의 Verify UI·Pages, Vercel production이
성공했습니다. 공개 preview·Usage, 현재 두 registry item과 46번째
snapshot manifest·item URL을 확인했습니다. 공개 124개 component·
126개 item·46개 snapshot, goal 관리용 추정 약 97%입니다.
[작업 기록](feedback-appearances-2026-10-02.md)을 참고하세요.

2026-10-02 Empty·Skeleton 표시 확장 로컬 후보: 점선·panel·plain
빈 상태와 직사각형·줄·원형 loading 자리를 한 릴리스로 묶었습니다.
typecheck·대상 테스트 2/2·build·registry release 검사와 로컬
Chromium의 preview 동작·390px dark를 확인했습니다. 공개 수량은
124개 component·126개 item·45개 snapshot, goal 관리용 추정은
약 97%입니다. 로컬 46번째 snapshot은 공개 전이므로 수량에 넣지
않습니다. PR CI·배포·공개 URL은 남았습니다.
[작업 기록](feedback-appearances-2026-10-02.md)을 참고하세요.

2026-10-02 공급·품질 체크리스트 재판정: 변경 유형별 증거와 실제
차단 결함만 릴리스 기록에 남기고, 동일 revision의 조사와 같은
commit의 CI 검사를 반복하지 않도록 정리했습니다. 기준 변경만으로
goal 관리용 추정 약 97%는 유지합니다.
[현재 적용 검토](quality-checklist-current-review-2026-10-02.md)를
참고하세요.

2026-10-02 MarkdownEditor 공개 확인: PR #82와 병합 commit `e898927`의
Verify UI·Pages, Vercel production이 성공했습니다. 공개
preview·Usage, 현재 item과 45번째 snapshot manifest·item URL을
확인했습니다. 공개 124개 component·126개 item·45개 snapshot,
goal 관리용 추정 약 97%입니다. 원문 편집과 반응형 미리보기를
공급했지만 RichTextEditor의 문서 모델·서식 편집은 남았습니다.
[작업 기록](markdown-editor-2026-10-02.md)을 참고하세요.

2026-10-02 MarkdownEditor 로컬 후보: 원문 textarea·미리보기·form 값을
묶었습니다. typecheck·UI 테스트 180/180·build, Chromium의 입력·
undo·제출·390px dark를 확인했습니다. provenance 고지와 45번째
snapshot을 고정하고 `registry:release-check`도 통과했습니다. PR·공개
URL은 아직 확인하지 않아 공개 기준 123개 component·125개
item·44개 snapshot, goal 관리용 추정 약 97%는 유지합니다.
[작업 기록](markdown-editor-2026-10-02.md)을 참고하세요.

2026-10-02 NodeCanvas 공개 확인: PR #80과 병합 commit `772d988`의
Verify UI·Pages, Vercel production이 성공했습니다. 공개
preview·Usage, 현재 item과 44번째 snapshot manifest·item URL을
확인했습니다. 공개 123개 component·125개 item·44개 snapshot,
goal 관리용 추정 약 97%입니다. 노드·연결의 위치 편집과
키보드·좌표 대체 조작을 공급했습니다. 실제 screen reader·touch·
Safari·RTL과 별도 소비자 설치는 미검증입니다.
[작업 기록](node-canvas-2026-10-02.md)을 참고하세요.

2026-10-02 Terminal 공개 확인: PR #78과 병합 commit `c3f5269`의
Verify UI·Pages, Vercel production이 성공했습니다. 공개
preview·Usage와 현재 item, 43번째 snapshot manifest·item URL을
확인했습니다. 공개 122개 component·124개 item·43개 snapshot,
goal 관리용 추정 약 96%입니다. 이력·명령 실행은 로컬 브라우저에서
확인했고 실제 backend·screen reader는 검사하지 않았습니다.
[작업 기록](terminal-2026-10-02.md)을 참고하세요.

2026-10-02 Terminal 로컬 초안: 개발 도구용 명령 입력·이력·순서 있는
출력을 원본 component로 추가했습니다. typecheck·UI 테스트 174/174,
로컬 Chromium의 Enter 실행·이력 방향키·390px dark를 확인했습니다.
build는 124개 registry item을 생성해 통과했습니다. provenance
고지 pin 뒤 registry 검사와 43번째 snapshot의 release 검사도
통과했습니다. 공개 CI·URL은 남았습니다. 로컬 122개
component·124개 item, 공개 121개·123개·42개 snapshot이며
goal 관리용 추정은 약 96% 그대로입니다.
[작업 기록](terminal-2026-10-02.md)을 참고하세요.

2026-10-02 AvatarUploader 공개 확인: PR #76, 병합 commit `413c081`의
Verify UI·Pages, Vercel production이 성공했습니다. 공개
preview·Usage, 현재 item과 42번째 snapshot manifest·item URL을
확인했습니다. 공개 121개 component·123개 item·42개 snapshot이며
goal 관리용 추정은 약 95%에서 약 96%로 조정했습니다.
[작업 기록](avatar-uploader-2026-10-02.md)을 참고하세요.

2026-10-02 공급·품질 체크리스트 후속 검토: 공개 120개 component·
122개 item·41개 snapshot과 goal 관리용 추정 약 95%는 그대로입니다.
변경한 흐름의 한 번 실행, 같은 commit의 CI, 릴리스 묶음의 공개
경로만 공통 근거로 사용합니다. 확인된 주요 결함은 차단하고
적용되지 않는 환경은 매 릴리스의 미검증 결함처럼 적지 않습니다.
[현재 적용 검토](quality-checklist-current-review-2026-10-02.md)를
참고하세요.

2026-10-02 AvatarUploader 로컬 초안: 사진 선택·정사각형 crop·PNG
미리보기·제거를 원본 component로 조합했습니다. typecheck와 UI
테스트 172/172, 로컬 Chromium의 파일 선택·crop·focus·390px dark를
확인했습니다. build도 123개 registry item을 생성해 통과했습니다.
source commit `86cb975`의 provenance hash를 고지에 고정한 뒤
registry 검사와 42번째 snapshot의 release 검사가 통과했습니다.
PR·공개 경로는 남았습니다.
로컬 121개 component·123개 item, 공개 120개·122개·41개
snapshot이며 goal 관리용 추정 약 95%는 그대로입니다.
[작업 기록](avatar-uploader-2026-10-02.md)을 참고하세요.

2026-10-02 TreeNav 공개 확인: PR #74와 병합 commit `64a1f1a`의
Verify UI·Pages가 성공했고 Vercel production
`dpl_FhfpDXVez9LDZR7KAcFo6Prafbcd`는 READY입니다. 공개
preview·Usage, 현재 registry item과 41번째 snapshot manifest·item
URL을 확인했습니다. 공개 120개 component·122개 item·41개
snapshot이며 goal 관리용 추정은 약 94%에서 약 95%로
올렸습니다. [작업 기록](tree-nav-2026-10-02.md)을 참고하세요.

2026-10-02 공급·품질 체크리스트 실무 재검토: 변경 흐름은 테스트 또는
브라우저에서 확인하고, 추가 검사는 변경 위험에만 적용합니다.
component마다 별도 PR·snapshot을 요구하지 않고 검토 가능한
범위에서 묶음 릴리스를 허용합니다. CI와 출시 차단 결함은 그대로이며
새 공개 공급이 없어 goal 관리용 추정 약 94%입니다.
[검토 기록](quality-checklist-practical-review-2026-10-02.md)을
참고하세요.

2026-10-02 TreeNav 로컬 초안: 중첩 페이지 링크의 펼침·현재 경로
표시와 rail·filled 형태를 원본 component로 구현했습니다.
targeted 테스트 3/3, 전체 UI 테스트 169/169, typecheck와 로컬
Chromium의 Enter·Space·경로 변경·390px dark를 확인했습니다.
build·registry 검사와 로컬 120개 component·122개 item의 41번째
snapshot도 통과했습니다. 공개 공급은 남아 있습니다. 공개 119개 component·
121개 item·40개 snapshot, goal 관리용 추정 약 94%입니다.
[작업 기록](tree-nav-2026-10-02.md)을 참고하세요.

2026-10-02 AnchorNav 공개 확인: PR #72와 병합 commit `2803fcb`의
Verify UI·Pages가 성공했고 Vercel production
`dpl_ocsnTecZBSVwP4URqrFLeeSYPaM9`은 READY입니다. 공개
preview·Usage, 현재 item, 40번째 snapshot manifest·item
URL을 확인했습니다. 공개 119개 component·121개 item·40개
snapshot, goal 관리용 추정 약 94%입니다.
[작업 기록](anchor-nav-2026-10-02.md)을 참고하세요.

2026-10-02 AnchorNav 로컬 공개 후보: 같은 문서의 섹션 목차와
현재 위치 표시를 원본 component로 구현했습니다. typecheck·UI
테스트 166/166, build·release 검사와 로컬 Chromium의 내부
스크롤·hash 뒤로 가기·390px dark를 확인했습니다. 로컬 119개
component·121개 item·40번째 snapshot을 만들었습니다.
공개 후보 PR #72의 CI와 배포·공개 URL은 아직 확인하지
않았습니다. 공개 118개·120개·39개,
goal 관리용 추정 약 93%입니다.
[작업 기록](anchor-nav-2026-10-02.md)을 참고하세요.

2026-10-02 공급·품질 체크리스트 현재 적용 검토: PR #70으로 draft
snapshot 강제는 해결됐습니다. 남은 부담은 문서 변경에도 전체
UI 검사를 실행하는 CI와 적용되지 않는 환경까지 릴리스마다
`미검증`으로 열거하는 기록 방식입니다. 기준 검토만으로 goal
관리용 추정 약 93%를 올리지 않았습니다.
[검토 기록](quality-checklist-current-review-2026-10-02.md)을
참고하세요.

2026-10-02 registry draft 검사 공개 확인: PR #70 병합 commit
`331dcb5`의 Verify UI run `36958691424`에서 기존 snapshot과
현재 빌드 snapshot 검사가 모두 통과했습니다. Pages run
`36958690442`도 성공했고 Vercel production
`dpl_CpFu4uJfGLVF3vw3qhrxtY6Ej6om`은 READY입니다. Draft PR에서는
현재 snapshot 단계가 건너뛰어지고 ready 전환에서 실행되는 것을
별도로 확인했습니다. 공개 component 118개·item 120개·snapshot
39개, goal 관리용 추정 약 93%는 그대로입니다.
[작업 기록](registry-draft-gate-2026-10-02.md)을 참고하세요.

2026-10-02 registry draft 검사 개선: 초안 PR은 registry 정합성과
이미 공개한 snapshot만 검사하고, ready PR·main에서 현재 빌드의
불변 snapshot을 요구하도록 `Verify UI` workflow를 조정했습니다.
로드맵의 중복된 여섯 단계도 앞의 위험별 기준으로 합쳤습니다.
PR #70의 draft run `36958128057`에서 현재 snapshot 검사가
`skipped`, ready 전환 run `36958306206`에서는 통과했습니다.
병합과 `main` push 검사는 남아 있습니다. Goal 관리용 진척은
약 93% 그대로입니다.
[작업 기록](registry-draft-gate-2026-10-02.md)을 참고하세요.

2026-10-02 Lightbox 공개 확인: PR #68과 병합 commit `3657163`의
Verify UI·Pages, Vercel production이 성공했습니다. 공개 사이트,
현재 item, 39번째 snapshot manifest·Lightbox item URL이 HTTP 200이며
manifest의 `itemCount`는 120입니다. 공개 118개 component·120개
item·39개 snapshot, goal 관리용 추정 약 93%입니다. 로컬 Chromium의
방향키·Escape·focus 복귀·390px dark는 확인했고 실제 screen reader·
touch·Safari·RTL과 개별 소비자 설치는 미검증입니다.
[작업 기록](lightbox-2026-10-02.md)을 참고하세요.

2026-10-02 공급·품질 체크리스트 후속 검토: 공개 117개 component·
119개 item·38개 snapshot 기준으로, 검사 하한보다 로드맵의 중복된
여섯 단계와 모든 PR의 전체 snapshot 생성이 실제 경직성입니다.
현재 릴리스 기준은 유지하고 초안 검사·공개 후보 snapshot 분리와
provenance 고정 정보·검증 문구 분리를 후속 도구 작업으로 지정했습니다.
기준 해석만으로 goal 관리용 진척 약 92%를 올리지 않았습니다.
[검토 기록](quality-checklist-level-2026-10-02.md)을 참고하세요.

2026-10-02 Lightbox 로컬 작업: 원본 갤러리 modal과 프레임·전체 화면
표시, 이미지 이동, Escape·focus 복귀를 구현했습니다. Chromium에서
방향키 1→2→3, 끝 버튼 비활성화, 닫은 뒤 opener focus 복귀,
390px dark의 가로 넘침 없음과 브라우저 오류 0건을 확인했습니다.
배포 전 draft이며 공개 수량과 goal 추정에는 포함하지 않습니다.
[작업 기록](lightbox-2026-10-02.md)을 참고하세요.

2026-10-02 ModelSelector 공개 확인: PR #66의 Verify UI와 병합 commit
`64282d6`의 Verify UI·Pages가 통과했고 Vercel production
`dpl_5NBbmMoRN7m7q1gHubVZPTJMcEYd`는 READY입니다. 공개
preview·Usage와 현재 registry item, 38번째 snapshot manifest·item
URL을 확인했습니다. 공개 117개 component·119개 item·38개
snapshot, goal 관리용 추정 약 92%입니다. 실제 screen reader·touch·
Safari·RTL, 개별 소비자 설치는 미검증입니다.
[작업 기록](model-selector-2026-10-02.md)을 참고하세요.

2026-10-02 ModelSelector 로컬 검증: 기존 Combobox에 제공자·기능·
사용량 문구와 사용 불가 이유를 결합했습니다. typecheck·UI 테스트
161/161·build·release 검사가 통과했고 로컬 Chromium에서 모델
변경·form 값·PromptInput 전송·사용 불가 차단·390px dark를
확인했습니다. 로컬 117개 component·119개 item, 38번째 snapshot
`sha256-d2020273e3a064ac334ce6628d09e4cfbc01b4fc007209d660ffc49d2502465c`입니다.
공개는 남아 있어 공개 116개·118개, goal 약 91%를 유지합니다.
[작업 기록](model-selector-2026-10-02.md)을 참고하세요.

2026-10-02 공급·품질 체크리스트 수준 재검토: 품질 하한은 유지하고
중복된 여섯 단계와 PR마다 전체 snapshot을 다시 만드는 절차를
경직성의 원인으로 확인했습니다. 기본 판정은 변경한 핵심 흐름,
export·registry·preview·Usage 및 공개 경로, 해당 commit CI로
읽고 위험이 생긴 경우에만 검사를 추가합니다. CI·출시 판정은
변경하지 않았습니다. 공개 116개 component·118개 item·37개
snapshot, goal 추정 약 91%입니다.
[검토 기록](quality-checklist-level-2026-10-02.md)을 참고하세요.

2026-10-02 DataTable 표시 선택 공개 확인: PR #64를 병합한
`adccef5`의 Verify UI·Pages와 Vercel production이 성공했습니다.
공개 preview·Usage, 현재 registry item과 37번째 snapshot
manifest/item URL을 확인했습니다. 공개 116개 component·118개
item·37개 snapshot, goal 관리용 추정 약 91%입니다. 실제
screen reader·touch·Safari·RTL 및 개별 소비자 설치는 미검증입니다.
[작업 기록](data-table-presentation-2026-10-02.md)을 참고하세요.

2026-10-02 DataTable 표시 선택 로컬 구현: 전체 행·원격 페이지에
`compact`·`standard`·`comfortable` 행 밀도와 줄무늬를 추가했습니다.
typecheck·UI 테스트 156/156·build·release 검사, Chromium의
10/4/16px 여백과 390px·dark 표시를 확인했습니다. 37번째 snapshot은
`sha256-72ff812680d65d8deb1063f8e571d2c4d649813668343209e631f8800b1cb0ab`입니다.
공개는 남아 있으며 공개 116개 component·118개 item·36개
snapshot, goal 약 91%를 유지합니다.
[작업 기록](data-table-presentation-2026-10-02.md)을 참고하세요.

2026-10-02 공급·품질 체크리스트 부담 재검토: 적용 기준은 이미
위험별 검사이며, 남은 경직성은 로드맵의 중복된 여섯 단계와
PR마다 전체 현재 snapshot을 요구하는 CI 절차에 있습니다.
검사 상태를 `통과`·`해당 없음`·`미검증`·`차단`으로 구분하고,
CI 절차 변경은 공개 후보의 snapshot 검사 보존과 함께 설계할 것을
권장합니다. 코드·CI·공개 판정은 변경하지 않았습니다. 공개
116개 component·118개 item·36개 snapshot, goal 약 91%입니다.
[검토 기록](quality-checklist-friction-2026-10-02.md)을 참고하세요.

2026-10-02 AgentStatus 공개 확인: PR #62 병합 commit `3411490`의
Verify UI·Pages와 Vercel production이 성공했습니다. 공개 preview·
Usage, 현재 registry item과 36번째 snapshot manifest/item URL을
확인했습니다. 공개 116개 component·118개 item·36개 snapshot,
goal 관리용 추정 약 91%입니다. 실제 backend 취소·재시도, screen
reader·touch·Safari·RTL과 개별 소비자 설치는 미검증입니다.
[작업 기록](agent-status-2026-10-02.md)을 참고하세요.

2026-10-02 AgentStatus 로컬 작업: 전체 AI 작업과 단계별 상태·진행률,
취소·재시도 callback을 원본 component로 구현했습니다. typecheck·
UI 테스트 156/156·build, Chromium 390px·light/dark·취소→재시도를
확인했습니다. 로컬 116개 component·118개 item과 36번째
snapshot의 릴리스 검사가 통과했습니다. 공개 배포는 남아 있습니다.
공개 115개 component·117개 item·35개 snapshot,
goal 추정 약 90%입니다.
[작업 기록](agent-status-2026-10-02.md)을 참고하세요.

2026-10-02 QueryBuilder 공개 확인: PR #60 병합 commit `9e39afd`의
Verify UI·Pages와 Vercel production이 성공했습니다. 공개 preview·
Usage, 현재 registry item과 35번째 snapshot manifest/item URL을
확인했습니다. 공개 115개 component·117개 item·35개 snapshot,
goal 관리용 추정 약 90%입니다. 실제 서버 조회·screen reader·touch·
Safari·RTL과 개별 소비자 설치는 미검증입니다.
[작업 기록](query-builder-2026-10-02.md)을 참고하세요.

2026-10-02 QueryBuilder는 조건 트리 편집·적용, 원본 source와
registry·문서 preview·Usage를 로컬에 구현했습니다. typecheck·UI
테스트 152/152·build·release 검사와 Chromium 390px 배치·오류
복구·적용을 확인했습니다. 35번째 snapshot은
`sha256-3773dda79971f256f5d45dd8b4593f64b92063147ab2311f25a9c903bcaf5f94`입니다.
PR·공개 배포는 아직 확인하지 않았고 goal 추정 약 89%입니다.
[작업 기록](query-builder-2026-10-02.md)을 참고하세요.

2026-10-02 공급·품질 체크리스트를 다시 검토해 로드맵의 적용 기준을
간결하게 정리했습니다. 기본 확인은 적용되는 CI, 변경한 핵심 사용
흐름, export·registry·Usage·공개 경로입니다. 추가 검사는 외부 코드,
browser 의존 동작, 새 설치 경로 등 실제 변경 위험에만 적용합니다.
PR마다 전체 snapshot을 재생성하는 CI 절차와 provenance 고정 정보·
검증 상태의 결합은 별도 개선 과제로 남겼습니다. 검사 코드·배포는
바꾸지 않았고 goal 추정 약 89%를 유지합니다.
[검토 기록](quality-checklist-lean-2026-10-02.md)을 참고하세요.

2026-10-02 DataTable 원격 조회 공개 확인: 기존 전체 행 모드를 유지하고
호출자가 조회 조건·총건수·로딩·오류를 소유하는 `remote` 모드를
추가했습니다. UI 테스트 148/148, typecheck·build·release 검사가
통과했고 로컬 Chromium 390px와 주요 조회·선택 흐름을 확인했습니다.
새 snapshot은
`sha256-73ea6b31c38dfa074a5ad87dd94804ae8cc1217e15cf0adfaa14322ec569b303`입니다.
PR #58과 병합 commit `d89c304`의 Verify UI·Pages, Vercel
production이 통과했습니다. 공개 preview·Usage, 현재 registry item과
34번째 snapshot URL을 확인했습니다. 공개 component 114개·item
116개, goal 추정 약 89%입니다. 실제 HTTP 경합·보조기술·touch·
Safari·RTL은 미검증입니다.
[작업 기록](data-table-remote-2026-10-02.md)을 참고하세요.

2026-10-02 CalendarScheduler 공개 확인: PR #56 병합 commit `57749fe`의
Verify UI, Vercel production과 Pages 배포가 성공했습니다. 공개 사이트에
114개 component가 표시되고 `CalendarScheduler` preview·Usage, 현재
item, 33번째 snapshot manifest/item URL이 응답합니다. manifest에는
116개 item이 있습니다. Goal 관리용 추정은 약 89%입니다.
[작업 기록](calendar-scheduler-2026-10-02.md)을
참고하세요.

2026-10-02 체크리스트 부담을 다시 검토했습니다. 현행 위험별 검사는
대체로 적절하지만 10개 옛 체크박스를 같은 로드맵에 두는 표현과
PR마다 미공개 전체 snapshot을 누적하는 절차가 과합니다. 공개
릴리스 묶음당 snapshot 하나로 조정하려면 CI와 정리 절차를 함께
바꿔야 합니다. 이번에는 판정·코드·배포를 바꾸지 않았고 goal 약
88%를 유지합니다. [검토 기록](quality-checklist-overhead-review-2026-10-02.md)을
참고하세요.

2026-10-02 공급·품질 체크리스트의 브라우저 조건을 좁혔습니다.
새 focus 이동·pointer 좌표·browser API·핵심 반응형 배치에 해당
환경 검사를 적용하고, 값·callback·form·keyboard의 핵심 흐름은
실행하는 자동 테스트나 브라우저 검사로 확인합니다. 상태 없는
표시 component에 상태 소유를 요구하지 않습니다. draft PR #56의
`CalendarScheduler`는 callback 흐름이 아직 실행되지 않아 공급
완료로 세지 않습니다. 공개 113개 component·115개 item·32개
snapshot, goal 관리용 추정 약 88%는 그대로입니다.
[검토 기록](quality-checklist-pragmatic-2026-10-02.md)을 참고하세요.

2026-10-02 CalendarScheduler Vercel preview를 390px Chromium에서
확인했습니다. 월 탐색 배치와 날짜·일정 선택, 일정 추가, 빈 상태,
ArrowRight·Enter 및 상태 문구가 동작했습니다. dark에서 기존
`Calendar` 화살표 SVG의 색상 결함을 발견해 `fill-current`로
수정했습니다. 미공개 draft snapshot 셋은 PR diff에서 정리하고 최종
후보 하나만 남겼습니다. provenance 고지도 소스 commit `67ba3c2`에
고정했습니다. typecheck·UI 테스트 143/143·build·최종 snapshot의
release 검사와 PR head `eef5938`의 Verify UI가 통과했습니다.
최종 Vercel preview의 390px·데스크톱 dark에서 화살표 fill과
console error 0건을 확인했습니다. production 확인은 남았습니다.
공개 113개 component·115개 item·32개 snapshot,
goal 약 88%입니다. [작업 기록](calendar-scheduler-2026-10-02.md)을
참고하세요.

2026-10-02 CalendarScheduler 핵심 동작 검증: client DOM 테스트 2건을
추가해 날짜·월 이동, 일정 선택·추가 callback, controlled 날짜 갱신을
실행했습니다. 테스트 전용 `jsdom@26.1.0`은 README의 Node 22+
범위를 지원합니다. UI 테스트 143/143, typecheck·build·
`registry:release-check`와 commit `5fbe530`의 PR Verify UI run
36929134624가 통과했습니다. 브라우저 preview는 이번에도
`ERR_BLOCKED_BY_CLIENT`로 차단돼 390px·실제 focus가 미검증입니다.
PR #56은 draft로 남고 공개 기준 113개 component·115개 item·32개
snapshot, goal 약 88%는 그대로입니다.
[작업 기록](calendar-scheduler-2026-10-02.md)을 참고하세요.

2026-10-02 CalendarScheduler 로컬 작업: 기존 Calendar와 일정 목록을
결합해 로컬 114개 component·116개 item이 됐습니다. typecheck·
UI 테스트 141/141·build가 통과했습니다. provenance 고지를 source
commit `390d9bb`에 고정하고 33번째 snapshot과 release 검사를
통과했습니다. Browser Use의 localhost
탐색이 차단되고 Windows Computer Use가 URL 확인 불가로 종료돼
날짜·월·일정 조작과 390px/focus는 미검증입니다. draft PR #56의
Verify UI run 36926628773은 통과했으나 ready 전환·병합·공개는
보류했습니다. 공급 완료와 goal 추정 약 88%는 유지합니다.
[작업 기록](calendar-scheduler-2026-10-02.md)을 참고하세요.

2026-10-02 공급·품질 기준을 다시 검토했습니다. 값·keyboard 흐름의
자동 테스트와 브라우저 검사를 모든 변경에 함께 요구하지 않습니다.
대표 흐름을 한 방식으로 실행하되 focus·실제 배치는 브라우저에서
확인합니다. CI 실패, 확인된 주요 결함, 필수 고지·공개 URL 실패는
공급 완료를 막습니다. 기준 조정만으로 goal 추정은 올리지 않았습니다.
[검토 기록](quality-gates-risk-review-2026-10-02.md)을 참고하세요.

2026-10-02 MasterDetail 공개 확인: PR #54 병합 commit `4007bb2`의
Verify UI·Pages와 Vercel 상태가 성공했습니다. 공개 preview,
현재 `pyd-master-detail.json`, 32번째 snapshot manifest/item URL이
응답하며 manifest에 115개 item이 있습니다. 현재 113개 component·
115개 registry item·32개 snapshot, goal 관리용 추정 약 88%입니다.
공개 브라우저 동작은 반복하지 않았습니다.
[작업 기록](master-detail-2026-10-02.md)을 참고하세요.

2026-10-02 MasterDetail 로컬 검증: 목록 선택과 좁은 화면의 상세
전환·focus 복귀를 원본 component로 편입해 로컬 113개 component·
115개 registry item이 됐습니다. typecheck·UI 테스트 138/138·build와
브라우저의 데스크톱 선택, 390px 목록→상세→돌아가기, Enter 선택,
light/dark를 확인했습니다. provenance 핀과 32번째 snapshot,
`registry:release-check`도 통과했습니다. PR·공개 확인은 남았습니다.
공개 기준 112개·114개·31 snapshot, goal 약 87%입니다.
[작업 기록](master-detail-2026-10-02.md)을 참고하세요.

2026-10-02 ImageCropper 공개 확인: PR #52 병합 commit `ffe9312`의
Verify UI·Pages와 Vercel 상태가 성공했습니다. 공개 preview,
현재 `pyd-image-cropper.json`, 31번째 snapshot manifest/item URL이
HTTP 200으로 응답하며 manifest에 114개 item이 있습니다. 공개
브라우저 동작은 반복하지 않았습니다. 현재 112개 component·114개
registry item·31개 snapshot, goal 관리용 추정 약 87%입니다.
[작업 기록](image-cropper-2026-10-02.md)을 참고하세요.

2026-10-02 체크리스트 추가 재검토: 변경 흐름의 로컬 브라우저 검증을
공개 사이트에서 반복하지 않고 배포·변경 URL을 확인합니다. 외부
component 코드를 편입하지 않은 원본 구현에는 upstream 코드·LICENSE
대조를 적용하지 않습니다. 공개 기준과 goal 약 86%는 그대로입니다.
[검토 기록](quality-checklist-recalibration-2026-10-02.md)을 참고하세요.

2026-10-02 ImageCropper 로컬 검증: 파일 선택 뒤 고정 비율로 자르는
원본 component를 추가해 로컬 112개 component·114개 registry item이
됐습니다. typecheck·UI 테스트 135/135·build와 Chromium의 1:1·
16:9 PNG export, 키보드 확대·포인터 이동, 390px light/dark를
확인했습니다. provenance 고지 핀과 31번째 snapshot,
`registry:release-check`도 통과했습니다. PR·공개 확인은 남았습니다.
공개 기준
111개·113개·30 snapshot, goal 추정 약 86%를 유지합니다.
[작업 기록](image-cropper-2026-10-02.md)을 참고하세요.

2026-10-02 공급·품질 체크리스트 재검토: 릴리스에 적용되는 검사를
변경 시점별로 정리하고, 기존 10개 체크박스를 당시 조사 기록으로
명시했습니다. 표준 item별 소비자 설치와 동일 commit의 반복 실행은
기본 조건이 아닙니다. 출처·LICENSE, 확인된 주요 결함 차단과
미검증 환경 표기는 유지합니다. 코드·registry·실행 검증은 바뀌지
않았습니다. 공개 기준 111개 component·113개 item·30개 snapshot,
goal 관리용 추정 약 86%입니다.
[검토 기록](quality-checklist-recalibration-2026-10-02.md)을 참고하세요.

CodeEditorShell 공개 검증 기록 PR #50도 `7a80070`에 병합됐고,
병합 commit의 Verify UI·Pages와 Vercel 상태가 성공했습니다.

2026-10-02 CodeEditorShell 공개 확인: PR #49 병합 commit `b99b242`의
Verify UI·Pages와 Vercel 상태가 성공했습니다. 공개 사이트에서
`flat` 전환·form 제출·page error 없음, 30번째 snapshot manifest의
113개 item과 새 item JSON·의존 URL을 확인했습니다. 공개 기준
111개 component·113개 item·30개 snapshot, goal 관리용 추정은
약 86%입니다. 실제 screen reader·touch·Safari·RTL과 새 item의
개별 소비자 CLI 설치는 미검증입니다.
[작업 기록](code-editor-shell-2026-10-02.md)을 참고하세요.

2026-10-02 CodeEditorShell 로컬 구현: SQL·설정 조각의 일반 텍스트
편집을 위한 이름 있는 textarea·줄 번호·form 값·오류 연결·panel/flat
표시를 추가했습니다. typecheck·UI 테스트 132/132·build와 로컬
Chromium의 입력·제출·스크롤·390px dark 동작을 확인했습니다.
source commit `40f93b4`의 provenance 고지 핀을 갱신하고
30번째 snapshot을 생성해 `registry:release-check`가 통과했습니다.
PR·공개 확인이 남았습니다. 로컬 111개 component·113개 item·
30 snapshot, 공개 110개·112개·29 snapshot, goal 추정 약 85%입니다.
[작업 기록](code-editor-shell-2026-10-02.md)을 참고하세요.

2026-10-02 체크리스트 정합성 문서 공개: PR #47을 병합한 `6a9056d`의
Verify UI·Pages와 Vercel 상태가 성공했습니다. 제품 코드·사이트 화면은
바뀌지 않았고 브라우저 동작 검사는 적용하지 않았습니다. 공개 기준
110개 component·112개 item·29개 snapshot, goal 약 85%는 그대로입니다.
[검토 기록](quality-checklist-alignment-2026-10-02.md)을 참고하세요.

2026-10-02 공급·품질 체크리스트 문구 정합성: 로드맵 하단의
깨끗한 소비자 설치·직전 버전 갱신을 모든 구현 묶음의 완료 조건으로
적은 오래된 문구를 수정했습니다. 표준 registry 경로는 CI 검사와
변경 preview·동작으로 판정하고, 새로운 설치 형식·target·의존 경로에
소비자 CLI 설치를 적용합니다. 이전 기준 문서에는 최신 기준 링크를
추가했습니다. 코드·registry·검사 실행 변경은 없습니다. 공개 기준
110개 component·112개 item·29개 snapshot, goal 추정 약 85%는
그대로입니다. [검토 기록](quality-checklist-alignment-2026-10-02.md)을
참고하세요.

2026-10-02 IconButton·Tabs 공개 검증 완료: PR #45와 병합 commit
`adffdc0`의 Verify UI, Pages가 통과했고 Vercel 배포가 성공했습니다.
공개 preview의 IconButton 클릭·Tabs contained 전환, 두 페이지의
page error 없음, 29번째 snapshot manifest의 112개 item과 변경
JSON의 공개 URL을 확인했습니다. 현재 110개 component·112개 item·
29개 snapshot, goal 관리용 추정 약 85%입니다. 실제 screen reader·
touch·Safari·RTL과 rollback 뒤 URL 보존은 미검증입니다.
[작업 기록](icon-button-tabs-2026-10-02.md)을 참고하세요.

2026-10-02 IconButton·Tabs 로컬 구현: 이름이 필수인 원본 IconButton을
추가해 PasswordInput·Carousel·Sidebar에 연결하고 Tabs의 line·
contained 표시를 추가했습니다. typecheck·UI 테스트 128/128·build가
통과했고 390px dark Chromium과 기존 세 소비자의 키보드 흐름을
검사했습니다. 새 Vite 소비자에 변경 item과 전이 의존성 12개 파일을
CLI로 설치해 변경 source 5개 일치·typecheck·build를 확인했습니다.
source commit `2a48e96`의 provenance 고지 핀과 29번째 snapshot,
`registry:release-check`도 통과했습니다. 로컬 110개 component·
112개 item·29개 snapshot이며 PR·공개 검증은 남았습니다. 공개 기준 goal
추정은 약 84%입니다.
[작업 기록](icon-button-tabs-2026-10-02.md)을 참고하세요.

2026-10-02 공급·품질 기준 추가 재검토: 표준 registry 경로의 신규
component마다 소비자 CLI 설치를 필수로 두지 않습니다. 저장소 검사와
변경 preview·Usage로 판정하며 별도 설치를 하지 않은 item은 미검증으로
기록합니다. 새 설치 형식·의존 경로·target·CLI/배포 경로에는 소비자
설치와 typecheck·build를 적용합니다. 릴리스 묶음의 snapshot과
공개 manifest·변경 item URL을 확인합니다. 누적 과제 10개는 공급률
점수로 사용하지 않습니다. 이번에는 코드·검사·배포 변경이 없어
109개 component·111개 item·28개 snapshot, goal 추정 약 84%입니다.
[판정 기록](quality-criteria-simplification-2026-10-02.md)을 참고하세요.

2026-10-02 Card·Alert 공개 검증 완료: PR #43의 Verify UI와 병합
commit `a112a5f`의 Verify UI·Pages가 통과했고 Vercel production은
READY입니다. 공개 28번째 snapshot manifest는 111개 item이며,
Card·Alert JSON에서 새 표시 속성을 확인했습니다. 문서 URL은
HTTP 200입니다. 표시·역할·390px 동작은 로컬 Chromium에서
검사했고 공개 소비자 CLI 재설치와 공개 브라우저 동작은 이번
변경의 출시 조건에 포함하지 않았습니다. 109개 component·111개
item·28개 snapshot, goal 관리용 추정 약 84%입니다. 실제 screen
reader·touch·Safari·RTL과 rollback 뒤 URL 보존은 미검증입니다.
[작업 기록](card-alert-appearances-2026-10-02.md)을 참고하세요.

2026-10-02 공급·품질 기준 재조정: CI가 이미 검사하는 항목과 소비자
설치를 릴리스마다 중복하지 않도록 [판정 기준](quality-criteria-reassessment-2026-10-02.md)을
갱신했습니다. 기존 component의 표시·타입 변경은 typecheck·관련
테스트·build·registry 검사와 변경 preview를 확인하며, 새 소비자
설치는 새 component·설치 경로·의존성 체인에 적용합니다. registry
변경의 공개 URL 도달 여부는 확인하되, 매번 공개 snapshot을 새
소비자에 재설치하지 않습니다. 출처·LICENSE와 확인된 주요 결함의
출시 차단 기준은 유지합니다. 이번 검토는 구현·배포를 추가하지 않아
goal 약 83%, 109개 component·111개 item·27개 snapshot입니다.
Card·Alert 표시 형태 확장은 로컬 typecheck·테스트 126/126·build·
registry 검사와 390px Chromium을 통과했습니다. 28번째 snapshot을
생성했습니다. 당시에는 PR·공개 URL 확인이 남아 있었습니다.
[작업 기록](card-alert-appearances-2026-10-02.md)을 참고하세요.

2026-10-02 ActionBar·CopyButton 공개 검증 완료: PR #41과 병합 commit
`5f0fc5b`의 Verify UI·Pages, Vercel production이 통과했습니다.
공개 preview·Usage와 27번째 snapshot의 변경 item·token·manifest
7개 파일이 저장소 SHA-256과 일치합니다. 별도 Vite 소비자에 변경
item 5개와 의존 item을 함께 설치해 15개 파일 원본 일치·typecheck·
build·390px Chromium 복사값·일괄 작업·focus를 확인했습니다.
현재 109개 component·111개 item·27개 snapshot, goal 관리용 추정
약 83%입니다. 실제 screen reader·touch·Safari·RTL과 rollback 뒤
snapshot URL은 미검증입니다.
[작업 기록](action-copy-controls-2026-10-02.md)을 참고하세요.

2026-10-02 ActionBar·CopyButton 로컬 구현: 표 밖의 선택 작업과
중복된 복사 동작을 공통 control로 편입했습니다. `DataTable`,
`CodeBlock`, `Snippet` 소비자도 연결했습니다. typecheck·UI 테스트
124/124·build, 문서와 새 소비자의 390px Chromium·CLI 설치가
통과했습니다. source commit `3bfed76`에 맞춰 소비자 고지를 갱신해
`registry:check`가 통과했습니다. 27번째 snapshot과
`registry:release-check`도 통과했으며 PR·공개 검증이 남았습니다.
공개 기준 goal 약 82%를
유지합니다. [작업 기록](action-copy-controls-2026-10-02.md)을
참고하세요.

2026-10-02 Menubar 공개 검증 완료: PR #39와 병합 commit
`9ce19fc`의 Verify UI·Pages, Vercel production이 통과했습니다.
공개 preview·Usage, 현재·26번째 snapshot JSON과 manifest의
저장소 파일 SHA-256 일치를 확인했습니다. 공개 snapshot을 새 Vite
소비자에 설치해 3개 파일 원본 일치·typecheck·build·390px Chromium
명령과 체크 변경을 확인했습니다. 현재 107개 component·109개 item·
26개 snapshot, goal 관리용 추정 약 82%입니다. 실제 screen reader·
touch·Safari·RTL, rollback 뒤 snapshot URL은 미검증입니다.
[작업 기록](menubar-2026-10-02.md)을 참고하세요.

2026-10-02 Menubar 진행: 작업 화면의 여러 상위 명령을 위한 Radix 기반
`Menubar`를 직접 작성하고 public export·registry metadata·문서
preview·Usage를 추가했습니다. shadcn/ui 고정 revision과 Radix 1.1.24의
source·LICENSE·의존성을 확인했습니다. typecheck와 Menubar 서버 렌더
테스트 120/120, build가 통과했습니다. 문서와 새 Vite 소비자의 390px
Chromium 동작, 소비자 설치 파일 3개 원본 일치·typecheck·build도
확인했습니다. source commit `a7a3d71`에 맞춰 소비자 고지를 갱신해
`registry:check`가 통과했습니다. 26번째 snapshot을 만들고
`registry:release-check`도 통과했습니다. PR·공개 검증이 남았습니다.
시작 goal 약 81%를 유지합니다.
[작업 기록](menubar-2026-10-02.md)을 참고하세요.

2026-10-01 공급·품질 기준 후속 재검토: 10개 누적 과제를 새 component의
릴리스 게이트나 품질 점수로 사용하지 않습니다. 변경분의 source·
LICENSE·의존성, export·registry·문서, 관련 테스트·브라우저 동작은
확인하되, 새 소비자 설치는 같은 릴리스의 변경 item과 의존 item을
묶어 검증합니다. 새 의존성 체인이나 설치 target에만 별도 검사를
추가합니다.
rollback 뒤 snapshot URL 보존과 보조기술·touch 등은 전체 품질
과제로 계속 추적합니다. 새 구현·검증은 없어 goal 추정 약 81%,
106개 component·108개 item·25개 snapshot, 전체 과제 완료 5·부분 4·
미검증 1은 그대로입니다.
[후속 재검토](quality-criteria-followup-2026-10-01.md)를 참고하세요.

2026-10-01 YearPicker 공개 검증 완료: PR #36이 병합됐고 병합
Verify UI·Pages·Vercel production이 통과했습니다. 공개 25번째
snapshot을 별도 Vite 소비자에 설치해 5개 파일 원본 일치·typecheck·
build와 390px Chromium의 `0001` 해제·`0012`·`2028` 선택·제출을
확인했습니다. 공개 preview·Usage도 표시됩니다. 현재 106개
component·108개 registry item·25개 snapshot, goal 관리용 추정
약 81%, 라이브러리 과제 완료 5·부분 4·미검증 1입니다. 실제
screen reader·touch·Safari·RTL과 rollback은 미검증입니다.
[작업 기록](year-picker-2026-10-01.md)을 참고하세요.

2026-10-01 YearPicker 작업 중: 연간 보고·예산을 위한 `YYYY` 단일
선택, 10년 탐색, min/max와 form 값을 기존 Popover로 구현합니다.
시작 기준 105개 component·107개 item·24개 snapshot, goal 약 80%,
라이브러리 과제 완료 5·부분 4·미검증 1입니다. 초기 typecheck·
UI 테스트 118/118과 전체 build가 통과했습니다. 390px Chromium에서
경계·선택·제출·focus·light/dark를 확인했습니다. 25번째 snapshot
`sha256-9359658dc14d7054deddfe546fefde00b784bb50c163c93de8a883ab1610d9a8`과
`registry:release-check`가 통과했습니다. 공개 소비자 검증이
남았습니다. [작업 기록](year-picker-2026-10-01.md)을
참고하세요.

2026-10-01 선택 카드 표시 형태 공개 검증 완료: PR #34가 병합됐고
병합 CI·Pages·Vercel production이 통과했습니다. 공개 24번째
snapshot을 별도 Vite 소비자에 설치해 6개 파일 원본 일치·typecheck·
build와 390px Chromium의 클릭·Space·제출을 확인했습니다. 공개
preview·Usage도 표시됩니다. 카드 방향키 자동 선택, 실제 screen
reader·touch·Safari·RTL과 rollback은 미검증입니다. 현재 105개
component·107개 registry item·24개 snapshot, goal 약 80%,
라이브러리 과제 완료 5·부분 4·미검증 1입니다.
[작업 기록](selection-card-variants-2026-10-01.md)을 참고하세요.

2026-10-01 선택 카드 표시 형태 작업 중: `Checkbox`·`RadioGroupItem`의
`variant="card"`를 기존 item에 추가합니다. 별도 component 수는
늘리지 않습니다. 시작 기준은 105개 component·107개 item·23개
snapshot, goal 약 80%, 라이브러리 과제 완료 5·부분 4·미검증 1입니다.
고정 upstream·MIT·Radix 의존성을 확인했고 최종 소스의 typecheck·
UI 테스트 116/116·build가 통과했습니다. 390px Chromium의 카드
선택·제출·light/dark를 확인했습니다. 자동화 방향키는 focus 이동만
관찰해 선택 변경을 미검증으로 남겼습니다. provenance 변경에 따라
소비자용 고지 hash를 source commit `3392144`로 고정했습니다.
`registry:release-check`는 24번째 snapshot
`sha256-1889f7c9f938bea5019bba5e20d480efc8a17244036c881451a616ceed14b68d`와
현재 빌드의 일치를 확인했습니다. 공개 소비자 검증이 남았습니다.
[작업 기록](selection-card-variants-2026-10-01.md)을 참고하세요.

2026-10-01 공급·품질 기준 재검토: 기존 체크리스트는 완료 5·부분 4·
미검증 1로 구분합니다. `5/10`은 완전히 닫힌 라이브러리 과제 수이며
새 component 공급률이 아닙니다. 새 component의 ready-made 출시
검증과 전체 환경·rollback 검사를 분리했습니다. 새 구현이 없는
이번 검토의 goal 추정은 약 80% 그대로입니다.
[기준 재검토](quality-criteria-review-2026-10-01.md)를 참고하세요.

2026-10-01 TreeSelect 수정판 공개 검증 완료: 현재 105개 component·
107개 registry item·23개 불변 snapshot입니다. 수정판 ID는
`sha256-b133e29e04962cce50921b2f92a4921c18fb90f061abf0d52d284777ac0ef14f`입니다.
PR #31의 Verify UI와 병합 commit의 Verify UI·Pages가 통과했고
Vercel production은 READY입니다. 공개 snapshot을 별도 소비자에
설치해 6개 파일 원본 일치·typecheck·build·390px Chromium의
반복 reset·필수 오류·키보드 선택·제출을 확인했습니다. 공개 preview와
JSON·manifest도 확인했습니다. 실제 screen reader·touch·Safari·RTL,
rollback 시험은 미검증입니다. Goal 약 80%, 공급·품질 5/10입니다.
[작업 기록](component-tree-select-2026-10-01.md)을 참고하세요.

2026-10-01 TreeSelect reset 수정 당시: 첫 공개 snapshot
`sha256-9a66acf0b0dea05be3123e7c613e2d384c5e9bf58662579357bfdfbeb980b690`의
별도 소비자에서 기본값을 지운 뒤 reset하자 표시와 native form 값이
달랐습니다. option의 기본 선택을 동기화해 수정했고 동일 소비자
fixture의 390px Chromium에서 reset 2회, typecheck·build를 다시
확인했습니다. 수정판 새 snapshot ID는
`sha256-b133e29e04962cce50921b2f92a4921c18fb90f061abf0d52d284777ac0ef14f`이며
공개 배포·설치를 준비했습니다. Goal 약 80%, 공급·품질 5/10입니다.
[작업 기록](component-tree-select-2026-10-01.md)을 참고하세요.

2026-10-01 TreeSelect 최초 편입 기록: 정적 조직 계층의 단일 항목 선택,
선택 경로·form 값·필수 선택·reset을 기존 Tree·Popover로
구성합니다. Ant Design 고정 revision의 공식 문서·source·manifest·
MIT LICENSE를 확인했고 코드는 복사하지 않았습니다. 시작 기준은
104개 component·106개 item·21개 snapshot, goal 약 80%, 공급·품질
조건 5/10입니다. 로컬 typecheck·패키지 테스트 113/113·build와
390px Chromium 동작, registry 22번째 snapshot 생성이 통과했습니다.
현재 source는 105개 component·107개 item입니다. 새 snapshot은
`sha256-9a66acf0b0dea05be3123e7c613e2d384c5e9bf58662579357bfdfbeb980b690`입니다.
당시 공개 소비자와 배포는 진행 전이었으며, 최종 검증 상태는
[작업 기록](component-tree-select-2026-10-01.md)을 확인하세요.

2026-10-01 DiffViewer 공개 완료: 변경 전후 줄 번호·추가·삭제·문맥을
통합·좌우 표로 읽는 원본 component를 편입했습니다. 현재 104개
component·106개 registry item이며 21번째 불변 snapshot ID는
`sha256-f2fbab67bddc01492523191362957921e38db65775b20a3ae9e37949dbf20f89`입니다.
typecheck, 패키지 테스트 110/110, build, registry release 검사와
로컬 390px Chromium의 두 보기·줄바꿈·내부 키보드 스크롤을
확인했습니다. PR #28 및 병합 commit의 Verify UI, Pages CI와 Vercel
production READY를 확인했습니다. 공개 390px preview의 보기 전환·
줄바꿈·dark·키보드 스크롤, 현재·snapshot JSON과 manifest 원본 일치,
새 소비자 CLI 설치 3개 파일·typecheck·build·390px Chromium도
통과했습니다. 실제 screen reader·touch·Safari·RTL, 전체 item별
격리 설치, rollback 뒤 snapshot URL 보존은 미검증입니다.
goal 관리용 진척도는 약 80%, 공급·품질 조건 완료 5/10입니다.
[작업 기록](component-diff-viewer-2026-10-01.md)을 참고하세요.

2026-10-01 ApprovalCard 공개 완료: 원본 React·기존 Button·token으로
승인 요청·승인·거절·만료와 비동기 중복 결정 방지·실패 후 재시도를
구현했습니다. 103개 component·105개 registry item·20개 snapshot입니다.
PR #26 head·병합 CI와 Vercel production READY를 확인했습니다. 공개
390px preview, 현재·snapshot JSON/manifest 원본 일치, 새 소비자
CLI 설치 5개 파일·typecheck·build·390px Chromium 동작이 통과했습니다.
현재 snapshot은
`sha256-08426c9a767fdc4c69eba32819484ce7ef920d00de9999c3b85c2efe8772ebcc`
입니다. 목표 관리용 진척도는 시작·종료 모두 약 80%, 공급·품질 조건
5/10입니다. 실제 screen reader·touch·Safari·RTL, backend 중복 승인
방지, 전체 item별 공개 격리 설치, rollback 뒤 snapshot URL 보존은
미검증입니다. [작업 기록](component-approval-card-2026-10-01.md)을
참고하세요. 다음 후보는 TreeSelect·DiffViewer이며 실제 소비자 용례와
기존 Tree/CodeBlock과의 경계를 먼저 확인하세요.


2026-10-01 goal 재개·Combobox 원격 결과 갱신: 102개 component·104개
registry item을 유지하며 선택값이 현재 검색 결과에서 빠져도
`selectedOption`으로 label·form 값을 보존합니다. `filterOptions=false`와
loading·error 상태를 추가했습니다. 로컬 typecheck·테스트 101/101·
build·registry release 검사(19개 snapshot)·Chromium과 별도 소비자
설치·typecheck·build·390px Chromium이 통과했습니다. 새 ID는
`sha256-89e9ec939dea43db48bdacdd4c3555cc2072a5131be074c65eae592ec14ef7c1`
입니다. PR #24 병합 commit `7f0af30`의 Verify UI·Pages CI가 통과했고
Vercel production `dpl_3gHxcLVuf8hqBWgHMH1NGk3KmPE9`가 READY입니다.
공개 390px preview의 값 보존·제출·오류, 현재·snapshot JSON/manifest
원본 일치, 새 소비자의 공개 snapshot 설치 5개 파일·원본 일치·typecheck·
build·390px Chromium도 확인했습니다. 실제 screen reader·touch·Safari·
RTL과 과거 배포 rollback 뒤 URL 보존은 미검증입니다.
[작업 기록](combobox-remote-results-2026-10-01.md)을 참고하세요.

2026-09-30 goal 재개·Editable 진행: goal은 완료되지 않았습니다.
`Editable`을 이름·설정값의 인라인 수정에 필요한 별도 상태 소유로
판정하고 원본 React·token 구현, public export, registry item과
provenance, 문서 preview·Usage를 추가했습니다. 102개 component·
104개 item입니다. Chakra UI 공식 문서와 고정 revision source·
manifest·MIT LICENSE를 확인했고 코드는 복사하지 않았습니다.
typecheck·테스트 98/98·build·registry release 검사(18개 snapshot),
로컬 문서와 격리 소비자의 Chromium 실패·재시도·포커스 동작이
통과했습니다. 현재 snapshot은
`sha256-821598f3f128f4f00c0f44da23a3abdee79c1c6041f977b185ffc8fb0d34f890`입니다.
PR #22를 병합했고 PR·병합 commit의 Verify UI, Pages CI와 Vercel
production READY를 확인했습니다. 공개 390px preview의 저장 실패·
재시도·포커스 복귀, 현재·snapshot JSON/manifest의 저장소 파일 일치,
새 소비자의 공개 snapshot 6개 파일 설치·원본 일치·typecheck·build·
Chromium 상호작용도 확인했습니다.
실제 screen reader·touch·Safari·RTL, 과거 배포 rollback 뒤 URL
보존과 item별 공개 격리 설치는 남았습니다.
[작업 기록](component-editable-2026-09-30.md)을 참고하세요.


2026-09-30 답변 평가·즐겨찾기·게시판·대댓글 진행:
`ResponseFeedback`, `FavoriteToggle`, `Board`, `Thread`를 원본 소스로
추가했습니다. 기존 `Dialog`로 글 작성 modal을 구성하며 Escape로 닫으면
글쓰기 버튼에 포커스가 돌아옵니다. 101개 component·103개 registry
item입니다. typecheck, 패키지 테스트 96/96, build,
`registry:release-check`가 통과했고 새 불변 snapshot은
`sha256-0239890bb7dd6954e44e658d21a4c490e4d4c93a0ff48f80aaeaed0be01a0034`입니다.
로컬 Chromium의 글 선택·게시·대댓글·평가·즐겨찾기와 별도 소비자
`shadcn add` 11개 파일·typecheck·build·390px 상호작용을 확인했습니다.
tracked snapshot은 이전 16개에서 17개가 됐습니다. 기존 작업 기록의
18개는 원 checkout의 미추적 draft 두 개를 포함한 집계로 보입니다.
해당 draft 디렉터리는 건드리지 않았습니다. PR #21과 병합 commit
`c5dfccd`의 Verify UI·Pages workflow가 통과했고 Vercel production
`dpl_DYDDLwfeCxaQJc1EfHM9peoUyuFg`가 READY입니다. 공개 390px
preview의 글쓰기 Dialog 초점 복귀·두 번째 단계 대댓글·평가·즐겨찾기,
새 item 4개의 현재·snapshot JSON과 manifest의 로컬 파일 일치를
확인했습니다. 공개 snapshot을 새 소비자에 설치해 11개 파일의 로컬
설치본 일치·typecheck·build를 확인했습니다. 공개 snapshot 소비자의
브라우저 동작과 실제 screen reader·touch·Safari·RTL은 미검증입니다.
[작업 기록](component-feedback-board-thread-2026-09-30.md)을 참고하세요.

2026-09-30 MonthPicker 진행: 월별 보고·필터용 `YYYY-MM` controlled 값을
연도 이동·min/max·form 입력과 함께 구현했습니다. MUI X 공식 문서와
고정 revision의 소스·manifest·MIT LICENSE를 확인했고 코드는 새로
작성했습니다. typecheck·패키지 테스트 91/91, 로컬 Chromium의
경계·키보드·제출·390px·dark/Pydemia colormap이 통과했습니다.
별도 Vite 소비자 CLI 설치 5개 파일, 4개 원본 일치와 typecheck·build·
Chromium 제출도 확인했습니다. `registry:release-check`는 99개 item·
97개 component·18개 snapshot, 현재
`sha256-cf9756bda03bc7dc75f4c9c0f496b1f83ac0d5c0808557b21ff543e9fd408de4`를
확인했습니다. PR #20 수정 CI와 병합 commit `14830a6`의 Verify UI·
Pages CI가 통과했습니다. Vercel 공개 사이트의 390px preview와 현재·
snapshot JSON을 확인했고, 새 소비자에 공개 snapshot을 설치해 5개
파일 생성·4개 원본 일치·typecheck·build·Chromium 월 제출을 검증했습니다.
PR #20 첫 CI는 Windows CRLF가 `ScatterChart`의 여러 줄 className에
들어가 Linux 생성 bundle과 달라 실패했습니다. 해당 파일을 LF로 고정해
두 환경의 JS SHA-256 일치를 확인했고 수정 CI가 통과했습니다.
실제 screen reader·touch·Safari·RTL은 미검증입니다.
[작업 기록](component-month-picker-2026-09-30.md)을 참고하세요.
기존 미공개 draft snapshot 네 디렉터리는 stage하지 마세요.

2026-09-30 ScatterChart 진행: 두 연속 수치의 산점도, 결측값·0·빈 상태,
native 선택기·데이터 표와 registry metadata, 문서 preview·Usage를
작성했습니다. Recharts 공식 문서와 고정 revision의 소스·manifest·
MIT LICENSE를 확인했으며 코드는 복사하지 않았습니다. typecheck와
초기 패키지 테스트의 SVG `<title>` 경고를 수정해 전체 89/89를
경고 없이 다시 통과했습니다. 로컬 Chromium의 1280px·390px 선택·
표·결측/빈 상태·dark/colormap을 확인했습니다. axe preview는
violation 0건, contrast incomplete 1건입니다. build·registry release
검사(98개 item·96개 component, 17개 snapshot)와 별도 소비자
CLI 설치·typecheck·build·390px Chromium이 통과했습니다. 새 snapshot은
`sha256-5038d4cd248ea483b2cb492095fbdbea06038c0ec48a17618be610eae83c1b01`입니다.
PR #19를 `main`에 병합했고 PR·병합 commit Verify UI와 Pages CI가
통과했습니다. Vercel production
`dpl_5x7EvjnwyP8kG2awetmwnzXwYHwd`는 READY입니다. 공개
390px preview의 키보드·점 선택, 결측·빈 상태와 현재·snapshot JSON,
공개 snapshot의 별도 소비자 설치·typecheck·build·Chromium 동작을
확인했습니다. 실제 screen reader·touch·Safari·RTL은 미검증입니다.
[작업 기록](component-scatter-chart-2026-09-30.md)을
참고하세요. 기존 미공개 draft snapshot 네 디렉터리는 stage하지 마세요.

2026-09-30 Gantt 진행: 원본 React·Tailwind 일정 시간축, 선행 관계와
하루 단위 변경 버튼, 일·7일 표시, registry metadata 및 동작하는 문서
preview·Usage를 추가했습니다. Kibo 공식 문서·고정 revision 소스·MIT
LICENSE와 의존성을 확인했습니다. typecheck·패키지 테스트 84/84,
로컬 Chromium의 1280px·390px·키보드·dark/colormap 동작을 확인했습니다.
axe preview는 violation 0건, contrast incomplete 1건입니다. build·
registry release 검사(97개 item·95개 component, 16개 snapshot)와
별도 소비자 CLI 설치·typecheck·build·390px Chromium이 통과했습니다.
새 snapshot은
`sha256-2946399b798e993844ba16ee444830619c7284631f9e661a331af2c26cae8ea9`입니다.
PR #18을 `main`에 병합했고 PR·병합 commit의 Verify UI와 Pages CI가
통과했습니다. Vercel production
`dpl_6WQVzFaSZMYp6R87Q7Ux3pboMf6H`가 READY입니다. 공개 390px
preview의 작업 이동·내부 스크롤과 현재·snapshot JSON 일치, 공개
snapshot의 별도 소비자 설치·typecheck·build·Chromium 동작도
확인했습니다. 실제 touch·Safari·screen reader·RTL,
서버 저장 실패 후 복구는 미검증입니다.
[Gantt 기록](component-gantt-2026-09-30.md)을 참고하세요. 기존 미공개
draft snapshot 네 디렉터리는 stage하지 마세요.

2026-09-30 모바일 SNB 포커스 후속 수정: 사용자가 선택 시 본문으로
이동한다고 보고했습니다. 로컬 393px Chromium 마우스 클릭에서는 기존
코드로 재현되지 않았습니다. 모바일 포인터 선택 후 버튼 포커스를
해제하고, 다음 animation frame에도 문서·SNB 스크롤 위치를 복원하도록
보강했습니다. 키보드 포커스와 데스크톱 본문 이동은 유지됩니다.
typecheck·패키지 테스트 79/79·build·registry 검사와 393px 포인터·
Chromium DevTools touch 입력, 키보드, 1280px 이동을 확인했습니다.
실제 touch 기기·Safari·screen reader는 미검증입니다.
[작업 기록](mobile-snb-focus-stability-2026-09-30.md)을 참고하세요.
PR #17을 병합했고 PR Verify UI와 Vercel production
`dpl_D55T5PnjzkGaRPTZeYMqBEQHYQ3p`가 통과했습니다. 공개 393px
Chromium 선택에서도 스크롤·포커스·새 JS 파일을 확인했습니다. 병합
commit의 GitHub Actions 결과는 미확인입니다.
기존 미공개 draft snapshot 네 디렉터리는 stage하지 마세요.

2026-09-30 Heatmap 진행: 두 범주의 값·결측값·빈 목록을 native 표와
색 농도로 표시하는 새 component와 registry item, 문서 preview·Usage를
추가했습니다. Kibo 공식 문서와 고정 revision 소스·MIT LICENSE를
참고했으며 소스는 복사하지 않았습니다. typecheck·패키지 테스트
79/79가 통과했습니다. 로컬 Chromium의 390px 표 내부 스크롤·행 이름
고정·밀도·빈 상태·light/dark·colormap도 확인했습니다. build·
registry release 검사와 별도 소비자 CLI 설치·typecheck·build·Chromium
표시가 통과했습니다. 새 snapshot은
`sha256-34e05c67026d4eafde4bba89993145eef2718414d4312c4ff87c7b33a4cc6481`입니다.
[PR #16](https://github.com/pydemia/ui/pull/16)을 병합했고 PR·`main`
Verify UI 및 Pages CI, Vercel production
`dpl_6jtrE2RfShByxNXGhmWA3JRYB18P`가 통과했습니다. 공개 390px
preview와 현재·snapshot item, 공개 snapshot의 별도 소비자 설치·
typecheck·build·Chromium 표시도 확인했습니다. 실제 screen reader·
touch·Safari·RTL은 미검증입니다.
[Heatmap 기록](component-heatmap-2026-09-30.md)을
참고하세요. 기존 미공개 draft snapshot 네 디렉터리는 stage하지 마세요.

2026-09-30 Tree 원격 하위 항목 진행: `childState`와
`onLoadChildren(id)`로 원격 폴더의 대기·로딩·오류·재시도를 추가했습니다.
typecheck·테스트 75/75와 로컬 Chromium의 오류·재시도·자식 focus·
390px light/dark 표시를 확인했습니다. 95개 item·14개 release 검사와
별도 소비자 CLI 설치·typecheck·build·Chromium 동작도 통과했습니다.
새 snapshot은 `sha256-5ff46dc370f8d49e297550557af2d0cc42d5ec7c90bd0a80ee458ac72e5c8e59`입니다.
[PR #15](https://github.com/pydemia/ui/pull/15)를 `main`에 병합했습니다.
PR·`main` Verify UI와 Pages CI가 통과했고 Vercel production
`dpl_4y2PiCHhaQF9wL4VwYziAHByJszW`가 READY입니다. 공개 preview의
실패·키보드 재시도·완료와 현재·snapshot item을 확인했습니다. 공개
snapshot URL의 별도 소비자 설치·typecheck·build도 통과했습니다.
실제 screen reader·touch·Safari·RTL과 공개 소비자 브라우저는
미검증입니다.
[Tree 작업 기록](component-tree-lazy-2026-09-30.md)을
참고하세요. 이전 Tree WIP stash는 작업 브랜치에 적용했으며 원본 stash는
안전하게 남겨 두었습니다. 미공개 draft snapshot 네 디렉터리는
stage하지 마세요.

2026-09-30 모바일 SNB의 pointer 이전 위치 보정: 터치 focus가
`click`보다 먼저 문서를 이동시킬 수 있어 `pointerdown`에서 문서·SNB
좌표를 저장하고 즉시 복원하도록 변경했습니다. 390px Chromium의
MetricCard 선택·재선택에서 `scrollY=844`, SNB `scrollLeft=6200`이
유지됐고 1280px의 본문 이동도 유지됐습니다. typecheck·테스트 72/72·
build·registry 검사가 통과했습니다. 실제 touch·Safari·screen reader는
미검증입니다. [모바일 SNB 기록](mobile-snb-pointer-scroll-2026-09-30.md)을
참고하세요. [PR #14](https://github.com/pydemia/ui/pull/14) 병합 뒤
`main` Verify UI·Pages CI와 Vercel production이 성공했습니다. 공개
393px Chromium 선택에서도 두 스크롤 위치와 버튼 focus를 확인했습니다.
Tree 지연 로딩 WIP는 위 기록대로 작업 브랜치에 복원했습니다.
기존 미공개 draft snapshot 네 디렉터리는 stage하지 마세요.

2026-09-30 RangeSlider 진행: 기존 Slider에 `thumbLabels`를 추가하고
두 endpoint의 이름·form 값을 갖춘 `RangeSlider`를 작성했습니다.
93개 component, 95개 registry item입니다. SSR 테스트, 문서 preview와
Usage를 추가했으며 package test 72/72·typecheck 및 Chromium의 키보드·
제출·초기화·390px 배치를 확인했습니다. 고정 provenance 고지와
`sha256-4405ce202eb10a7cb865a7609676349ed6e002ae1b49676d06f4438dd31c5449`
snapshot, 95개 item release 검사도 통과했습니다. 별도 소비자에서
CLI 설치 파일 5개 내용 일치와 typecheck·build를 확인했습니다.
PR #13을 `main`에 병합했습니다. PR·`main` Verify UI와 Pages CI,
Vercel production `dpl_Ag1DjmuWRKQ7FdZWq2oANPyiTkJu`가 통과했습니다.
공개 RangeSlider preview의 키보드·제출, 현재 item·95개 item snapshot
URL과 공개 URL의 독립 소비자 CLI 설치·typecheck·build를 확인했습니다.
실제 touch·Safari·screen reader·RTL과 독립 소비자 브라우저는 미검증입니다.
[RangeSlider 작업 기록](component-range-slider-2026-09-30.md)을 보세요.
기존 미공개 draft snapshot 네 디렉터리는 stage하지 마세요.

2026-09-30 InputGroup과 모바일 SNB 후속 보정 진행:
`InputGroup`을 기존 Input·Textarea·Button으로 구성하고 문서 preview·
Usage·registry metadata·SSR 테스트를 추가했습니다. 92개 component,
94개 registry item입니다. package 테스트 68/68과 typecheck·build·
registry release 검사, 로컬 Chromium의 form 제출·Tab·390px 배치·
dark token을 확인했습니다. 새 snapshot은
`sha256-d8219d9053fecc606f6219a9ec4ed62d4d47b0d682ec6411dfe77114280da271`입니다.
모바일 SNB는 선택 직전의 문서·가로 스크롤 위치를 화면 갱신 후
복원합니다. 390px 선택에서 위치·버튼 focus가 유지되고 1280px의
기존 본문 이동도 확인했습니다. source·license·의존성 기록은
`research/source-inventory.md`에 있으며 세부 사항은
[InputGroup 작업 기록](component-input-group-2026-09-30.md)을 보세요.
독립 소비자 CLI 설치·typecheck·build·390px Chromium 동작은
통과했습니다. [PR #12](https://github.com/pydemia/ui/pull/12)를
`main`에 병합했고 PR·main Verify UI, Pages CI와 Vercel production
`dpl_nMLXwMs66nUFLxCGorxD5Nf3nmJo`가 성공했습니다. 공개
`ui.pydemia.ai`의 InputGroup preview, 새 item·snapshot URL과
390px SNB 연속 선택의 문서·가로 위치 및 버튼 focus를 확인했습니다.
실제 touch·Safari·screen reader·RTL은 미검증입니다.
기존 미공개 draft snapshot 네 디렉터리는 stage하지 마세요.

2026-09-30 [PR #11](https://github.com/pydemia/ui/pull/11) 배포:
Spinner 다섯 형태는 기존 구현으로 확인했습니다. Alert에
info·success·warning을 추가하고
Toast 상태색을 맞췄습니다. `--success`·`--warning`은 light/dark
palette alias와 문서 Colormap에 연결했습니다. 테스트 66/66,
typecheck·build·registry release 검사와 독립 소비자 CLI 설치·
typecheck·build·Chromium 동작이 통과했습니다. 새 snapshot은
`sha256-6315cfe1a0a88ffa25cd36cbfaa57dc5e278e800f8c257b387c4159aa58d1d6f`
입니다. 같은 branch에서 모바일 SNB 선택 시 `#components` 해시를
제거해 본문 앵커 이동을 막았습니다. 390px의 문서·SNB 위치와
1280px의 기존 본문 이동을 확인했습니다.
[Feedback 상태 기록](feedback-status-variants-2026-09-30.md)과
[모바일 SNB 앵커 기록](mobile-snb-hash-2026-09-30.md)을 참고하세요.
PR·`main` CI와 Vercel production이 통과했고 공개 Alert·Toast preview,
모바일 SNB와 snapshot URL을 확인했습니다. 실제 touch·Safari·
screen reader는 미검증입니다. 기존 미공개 draft snapshot 네
디렉터리는 stage하지 마세요.

2026-09-30 [PR #10](https://github.com/pydemia/ui/pull/10) 배포:
Workflow에 `Kanban`을 추가해 component 91개·registry item 93개입니다.
공식 Kibo 문서·고정 revision 소스·MIT license를 확인하고 원본
React·Tailwind 구현으로 작성했습니다. 패키지 테스트·typecheck·build,
registry release 검사, 로컬 Chromium과 독립 소비자 설치·동작이
통과했습니다. native drag, 실제 touch·Safari·screen reader는
미검증입니다. [Kanban 기록](component-kanban-2026-09-30.md)을
참고하세요. 새 snapshot은
`sha256-ebeff129d8be2a68593c6bf8fbeca82380bd1c6c037fab4567cdb2e4c4400764`입니다.
같은 PR에서 모바일 SNB의 scroll anchoring 보정을 막았습니다.
390px 실제 클릭에서 문서·SNB 위치와 버튼 focus가 유지되고 1280px
본문 이동은 유지됐습니다. [모바일 focus 기록](mobile-snb-focus-2026-09-30.md)을
참고하세요. PR·`main` Verify UI와 Pages CI가 통과했고 Vercel
production `dpl_nw6dEJ5pQ3xtyud6LBqBvnHM5Kbm`은 READY입니다.
공개 사이트의 390px SNB 연속 선택·Kanban 카드 이동·새 registry
item과 snapshot URL도 확인했습니다. 전체 goal의 관리용 추정은
약 70%로 유지합니다. 기존 미공개 draft snapshot 네 디렉터리는
stage하지 마세요.

2026-09-30 모바일 문서 SNB: 항목 선택의 명시적인 `#components`
자동 스크롤을 850px 이하에서 생략했습니다. 선택·URL·버튼 focus는
유지하고 상단 메뉴와 데스크톱 SNB의 본문 이동은 유지합니다.
390px·1280px Chromium 동작, typecheck·build·registry release 검사가
통과했습니다. [PR #9](https://github.com/pydemia/ui/pull/9) 병합 뒤
`main` CI, Vercel production READY와 공개 사이트의 390px SNB
연속 선택도 확인했습니다. 실제 touch 기기와 Safari는 미검증입니다.
[모바일 SNB 기록](mobile-snb-scroll-2026-09-30.md)을 참고하세요.
component 90개·item 92개, 전체 goal 관리용 추정 약 70%는 유지합니다.
기존 미공개 draft snapshot 네 디렉터리는 포함하지 마세요.

2026-09-30 DataChart 계열 표시 선택 진행: `toggleableSeries`를 추가해
다중 계열의 축·누적값·구간 값·데이터 표를 현재 표시 계열로
계산합니다. 정적 범례는 기본값으로 유지합니다. 패키지 테스트
60/60, typecheck·build·registry release 검사와 Chromium
로컬 문서·독립 소비자 설치·typecheck·build·상호작용이 통과했습니다.
새 snapshot은
`sha256-212e10face340c8a0d867de1ea5ace2c1490e102dfec7d09f8ca97e999cae331`입니다.
[PR #8](https://github.com/pydemia/ui/pull/8)의 PR·main CI와
Vercel production READY, 운영 preview와 공개 URL 독립 소비자
설치·typecheck·build도 확인했습니다.
[계열 표시 기록](component-data-chart-series-visibility-2026-09-30.md)을
참고하세요. component 90개·item 92개, 관리용 전체 goal 약 70%는
유지합니다. 이전 미공개 draft snapshot 네 디렉터리는 포함하지
마세요.

2026-09-30 기간 필터 조합 진행: `FilterBar` 문서에 기존
`DateRangePicker`의 draft·applied 상태, 부분 선택 오류, 초기화와
결과 목록을 연결했습니다. 새 component·registry item은 없습니다.
typecheck·build·registry release 검사, Chromium 적용·오류·초기화,
공개 snapshot의 독립 Vite 소비자 설치가 통과했습니다.
[PR #7](https://github.com/pydemia/ui/pull/7)을 병합했고 PR·main CI,
production 배포와 운영 picker 열림도 확인했습니다.
[기간 필터 기록](component-date-range-filter-recipe-2026-09-30.md)을
참고하세요. 목표 수 90개·92개, 관리용 약 70%는 유지합니다.

2026-09-30 Sidebar 섹션 탐색 진행: 기존 `items`와 호환되는 이름 있는
`sections` 입력, 데스크톱·모바일 그룹, 문서 preview를 구현했습니다.
`build`·`typecheck`·패키지 테스트 59/59와 registry release 검사가
통과했습니다. 소비자 MIT 고지의 commit·SHA-256을 갱신하고 새
snapshot을 만들었습니다. Chromium 데스크톱·390px Drawer, 공개
snapshot의 독립 Vite 소비자 설치·typecheck·build를 확인했습니다.
[PR #6](https://github.com/pydemia/ui/pull/6)의 PR·main CI와
production 배포도 통과했습니다. 자세한 상태와 미검증 범위는
[Sidebar 섹션 기록](component-sidebar-groups-2026-09-30.md)을 참고하세요.
component 90개·item 92개, goal 관리용 추정 약 70%는 유지합니다.

2026-09-30 상단 GNB: `Components → category → component` 메뉴를
기존 catalog와 `Popover`로 구현했습니다. [PR #5](https://github.com/pydemia/ui/pull/5)
병합 뒤 main CI와 production READY, 운영 category·component 선택을
확인했습니다. 로컬 데스크톱·390px Chromium 동작도 확인했으며 새
component·registry item은 없습니다. 상세 설계와
미검증 범위는 [상단 메뉴 기록](top-gnb-components-2026-09-30.md)에
남겼습니다. 공급·품질 조건 5/10과 전체 goal 관리용 추정 약 70%는
유지합니다.

2026-09-29 Markdown 배포: 90번째 component와 92번째 registry item을
[PR #4](https://github.com/pydemia/ui/pull/4)로 `main`에 병합했습니다.
공개 snapshot은
`sha256-70c4a56811508257fe1131e7ab65e3ab3836e60934bba5a16f58c0e8a66fe000`
입니다. PR·main CI와 Vercel production READY, 공개 Markdown preview,
snapshot의 manifest·JSON 일치, 공개 URL 소비자 설치·typecheck·build를
확인했습니다. 로컬 package 테스트·typecheck·build·release 검사와
92개 item 전체 소비자 typecheck·build·브라우저 로딩도 통과했습니다.
상세 범위는
[Markdown 기록](component-markdown-2026-09-29.md)을 참고하세요.
공급·품질 조건 5/10, 전체 goal의 관리용 추정 약 70%입니다. 이전
미공개 draft snapshot 네 디렉터리는 계속 untracked로 둡니다.

2026-09-29 작업 마감: `DateRangeFilter` 후보를 현재 코드와 문서 preview로
검토해 기존 `DateRangePicker`·`FilterBar` 조합으로 판정했습니다. 새
component나 registry item은 추가하지 않았습니다. 두 component를 결합한
설치 예시와 기간 preset의 기준일·시간대 동작은 아직 검증하지
않았습니다. 이번 마감은 새 릴리스가 아닙니다. 89개 component·91개
item, 공급·품질 조건 5/10, 전체 goal의 관리용 추정 약 70%입니다.
미공개 draft snapshot 네 디렉터리는 untracked로 두었습니다.

2026-09-29: [PR #3](https://github.com/pydemia/ui/pull/3)에서 registry
소비자 고지의 provenance 링크를 `a84b26f` commit으로 고정하고
SHA-256 검사를 추가했습니다. 병합 커밋 `dd29b56`의 CI와 Vercel
production 배포가 통과했습니다. 현재 snapshot은
`sha256-d6ac442e615afdf7bda064ed424685038b48ac2ff063bc5726e354494ba29fee`
입니다. build·typecheck·패키지 테스트 48개·release 검사가 통과했고
새 ID의 공개 Button 설치·MIT 고지·소비자 typecheck·build도
확인했습니다.
[기록](component-provenance-pin-2026-09-29.md)을 먼저 읽으세요.
과거 snapshot의 `main` 링크와 rollback 문제는 남아 있어 조건 5/10,
전체 goal의 관리용 추정 약 70%입니다.

2026-09-29 후속 검토: [PR #2](https://github.com/pydemia/ui/pull/2)를
`main`에 병합했고, Verify UI CI와 Vercel production 배포가
통과했습니다. 문서 설치 명령 19개, DataChart·DataTable 경계 동작,
CI의 untracked 생성 파일 검사를 수정했습니다. 현재 snapshot은
`sha256-a3db94852dbdea79f551fa350fdf314cbf43b274b235fb76fb313a1008489a28`
입니다. 로컬 build·typecheck·패키지 테스트 48개·registry release
검사와 공개 Sidebar·AppShell 설치 후 소비자 typecheck·build가
통과했습니다. [후속 검토](component-followup-review-2026-09-29.md)를
먼저 읽으세요. rollback 시 신규 snapshot 주소가 사라질 수 있어
불변 주소 조건을 미완료로 돌렸습니다. 공급·품질 조건 **5/10**,
goal 관리용 추정 **약 70%**입니다. 두 미공개 draft snapshot은
untracked이며 일괄 `git add`에 포함하지 마세요.

2026-09-29 production 배포: PR #1을 `main`에 병합한 커밋은 `092b748`이고
Vercel production은 READY입니다. `main` push CI와 공개 URL의 현재·이전
snapshot CLI 설치, 소비자 typecheck·build를 확인했습니다. 89개
component·91개 registry item, 공급·품질 조건 6/10, 관리용 goal 추정
약 75%입니다. [배포·미검증 기록](component-production-release-2026-09-29.md)을
먼저 읽으세요. 독립 review와 실제 보조기술·touch·drag/drop·다른 시간대
검사는 계속 남아 있습니다. 두 미공개 draft snapshot은 untracked이며
일괄 `git add`에 포함하지 마세요.

2026-09-29 작업 정리: [PR #1](https://github.com/pydemia/ui/pull/1)의
코드·CI 변경 커밋 `2b41cfe`에 대한
[GitHub Actions run](https://github.com/pydemia/ui/actions/runs/36572361755)은
성공했습니다. PR은 draft·미병합이고 제출된 review나 review thread가
없습니다. production의 현재 snapshot 공개 설치는 확인하지 못했습니다.
다음 작업에서는 [진행률 기록](goal-progress-2026-09-29.md)의 약 70%를
관리용 추정으로만 취급하고 [로드맵](component-roadmap.md)의 미완료
공급 조건을 먼저 확인하세요. 작업 트리의 두 미공개 draft snapshot은
untracked 상태로 남겨 두었으므로 일괄 `git add`에 포함하지 마세요.

2026-09-29: 현재 registry ID를 빌드 내용에서 계산하는
`npm run registry:release-check` 기본 동작을 추가했습니다. ID를 명시하는
기존 방식도 유지하며 fixture에서 현재·변경·게시 JSON 누락을 재검사했습니다.
`.github/workflows/verify.yml`은 PR과 `main` push에서 Node 24로
typecheck, package 테스트, build, 현재 snapshot 검사, 생성된 `docs/`
diff를 확인합니다. 로컬 검사와 PR #1의
[GitHub Actions run](https://github.com/pydemia/ui/actions/runs/36572011594)이
통과했습니다. 단계별 범위는
[CI 기록](component-ci-gate-2026-09-29.md)에 있습니다.

2026-09-29: draft PR 검토 중 DataChart의 유한한 양·음 극값에서 SVG 좌표가
`NaN`이 되는 문제를 고쳤습니다. 현재 새 내용 해시 후보는
`sha256-48f182bbf4fafa4e209bb89acebf7e77b722f6aac842e1a3c90d974399d9ac93`이며
처음 PR 후보 ID는 보존했습니다. package 테스트 46/46, typecheck,
build, `registry:check`, 새 ID의 `registry:release-check`가 커밋 파일만
복원한 환경에서 통과했습니다. 수정은 `d6713b4`·`9195662`로 PR #1에
push했습니다.
[검토 기록](component-release-review-2026-09-29.md)에 변경 범위를
남겼습니다. 공개 URL 설치와 실제 보조기술·touch 검사는 남았습니다.

2026-09-29: 변경안을 [draft PR #1](https://github.com/pydemia/ui/pull/1)로
열었습니다. head `193d98c`의 Vercel preview는 READY이고 인증된
브라우저에서 89개 목록과 Navigation variant 전환을 확인했습니다.
preview registry JSON은 인증 302, 현재 production의 새 snapshot은
404여서 공개 URL 소비자 설치는 아직 미검증입니다.
[PR·preview 기록](component-release-review-2026-09-29.md)을 참고하세요.
독립 검토 후 공개 배포와 설치 검증이 남았습니다.

2026-09-29: `codex/ui-component-release`에서 확장안을 세 커밋으로
정리했습니다. 깨끗한 Git archive 체크아웃에서 `npm ci`, build,
typecheck, package 테스트 45개, `registry:check`, 현재 내용 해시 ID의
`registry:release-check`가 통과했습니다. Windows ZIP 복원 시 snapshot
JSON의 줄바꿈 변환으로 검사에 실패한 뒤 `.gitattributes`로 LF를 고정하고
재검사했습니다. 미공개 이전 draft snapshot 두 개는 커밋하지 않았습니다.
작업 커밋은 `origin/codex/ui-component-release`로 push했습니다. 현재
head와 배포 상태, 검토 범위는
[릴리스 검토 기록](component-release-review-2026-09-29.md)에 있습니다.
대규모 변경의 독립 검토, 공개 URL 설치와 배포는 남아 있으며 89개
component·91개 registry item, 공급·품질 조건 5/10, 관리용 추정 약 70%입니다.

2026-09-29: 릴리스 후보 ID가 현재 빌드의 registry JSON과 일치하는지
확인하는 `npm run registry:release-check -- <ID>`를 추가했습니다.
`registry:check` 이후 현재 91개 item의 내용 해시, 선택한 snapshot,
`docs/r/`의 최신 JSON을 대조합니다. 회귀 시험에서 현재 item 변경과
게시용 최신 JSON 누락을 각각 탐지했습니다. README에 릴리스 검사
순서를, `CHANGELOG.md`에 미공개 변경을 기록했습니다. 현 로컬 ID
`sha256-a1cd11bae6654a55136729439cd7b437a507d59896271b7c0950745a9e61bf21`
검사는 통과했습니다. [기록](component-release-check-2026-09-29.md)에
검증과 미완료 범위를 남겼습니다. component·item 89개·91개, 공급·품질
조건 5/10, goal 추정 약 70%는 그대로입니다. 공개 URL 설치·실제
릴리스는 확인하지 않았습니다.

2026-09-29: `Navigation`에 전역 링크 밑줄형과 측면 링크 채움형을
추가했습니다. 기본 표면형·선형은 유지합니다. 문서 preview의 전환 버튼,
사용 코드, public type export와 registry 소스를 갱신했습니다. 문서의
전역 `a` 색상 규칙을 base layer로 옮겨 component의 현재 페이지 색상이
적용되게 했습니다. package 45개 테스트, 저장소 typecheck·build·
registry:check와 브라우저의 밝은·어두운 모드 계산 색상, 별도 소비자의
registry 갱신·typecheck·build를 확인했습니다. 새 로컬 snapshot ID는
`sha256-a1cd11bae6654a55136729439cd7b437a507d59896271b7c0950745a9e61bf21`
입니다. [기록](component-navigation-variants-2026-09-29.md)에 검사와
미검증 범위를 남겼습니다. 수량 89개·91개, 공급 조건 5/10, goal의
관리용 추정 약 70%는 그대로입니다. 공개 배포는 확인하지 않았습니다.

2026-09-29: registry item의 TypeScript import를 metadata의 직접
의존성과 비교하는 검사를 추가했습니다. `pyd-search-input`과
`pyd-number-input`에 빠져 있던 `pyd-utils` 직접 의존성을 보완했고,
현재 91개 item의 정적 import 선언 검사가 통과합니다. 변경된 item을
포함한 새 로컬 snapshot ID는
`sha256-9f61dbbe414ff6749e1f47757a9f17baceb35a0b2b4826f1d6a4d390ca168555`
입니다. 이전 snapshot은 보존했습니다. build·typecheck·registry:check·
diff 검사가 통과했으며, 이번 metadata 변경의 개별 CLI 설치와 공개
snapshot URL 설치는 미검증입니다.
[검증 기록](component-registry-import-audit-2026-09-29.md)을 참고하세요.
89개 component·91개 item, 공급·품질 조건 5/10, 전체 goal의 관리용
추정 약 70%는 변하지 않았습니다.

2026-09-29: 직전 공개 40개 registry item을 설치한 별도 소비자를 현재
91개 item으로 갱신했습니다. 93개 파일 일치·typecheck·전체 모듈
build·Chromium 로딩을 확인했고, Badge·Button 수정 파일의 충돌과
Badge 변경 재적용도 시험했습니다. [기록](component-registry-upgrade-2026-09-29.md)에
fixture와 미검증 범위가 있습니다. 공급·품질 조건은 **5/10**으로
갱신했습니다. 로컬 **89개 component·91개 item**이므로 약 100개 규모
비율 89%와 조건 50%를 같은 비중으로 본 goal 관리용 추정은
**약 70%**입니다. 현재 snapshot 공개 설치와 릴리스는 남았습니다.

2026-09-29: 현재 91개 registry item의 내용 해시 snapshot을
`registry/releases/`에 만들고 빌드 결과 `docs/r/releases/`와 동일한지
검사했습니다. 내부 의존성은 같은 snapshot ID를 가리킵니다. 로컬
HTTP 200, typecheck·build·registry:check와 변조·새 ID 회귀 시험을
확인했습니다. [기록](component-registry-release-2026-09-29.md)에 ID와
미검증 범위를 남겼습니다. 로컬 **89개 component·91개 item**, 공급·
품질 조건 **4/10**, goal 관리용 추정 **약 65%**입니다. 공개 URL 설치,
이전 소비자 갱신, commit·push·배포는 확인하지 않았습니다.

2026-09-29: AppShell의 floating 도움말 조합을 수정했습니다. 도움말을
열어도 bubble을 유지하고 panel의 표시 상태를 연결했으며 Escape·닫기
버튼에서 bubble로 focus가 돌아옵니다. 문서 Usage 코드와 Operations
workspace에도 같은 동작을 적용했습니다. typecheck·build·registry:check,
89개 catalog 사용 코드의 package·registry 소비자 typecheck와 Chromium
pointer·keyboard 동작을 확인했습니다. component·item 수는
**89개·91개**, 공급·품질 조건은 **4/10**, 전체 goal 관리용 추정은
**약 65%**로 유지합니다. [검증 기록](component-floating-help-2026-09-29.md)에
미검증 항목을 남겼습니다. 현재 변경은 공개 배포하지 않았습니다.

2026-09-29: 문서 사용 코드 89개를 현재 package tarball과 91개 item을
설치한 registry 소스 경로에서 각각 독립 TSX로 typecheck했습니다.
나란한 JSX 때문에 복사 시 문법 오류가 나던 20개 예시를 fragment로
수정하고 `registry:check`에 TSX 구문 검사를 추가했습니다. 저장소
typecheck·build·registry:check와 Button·DataChart 문서 표시를
확인했습니다. 로컬 **89개 component·91개 registry item**, 공급·품질
조건 **4/10**, goal 관리용 추정 **약 65%**입니다.
[검증 기록](component-catalog-usage-2026-09-29.md)에 범위와 미검증
항목을 남겼습니다. 현재 변경의 commit·push·공개 배포는 확인하지
않았습니다.

2026-09-29: AI 응답의 출처 목록 `CitationList`를 프로젝트 소유 코드로
추가했습니다. 로컬 **89개 component·91개 registry item**, 공급·품질
조건 **4/10**, goal 관리용 추정 **약 65%**입니다. package 44개 테스트,
typecheck·build·registry:check, 문서의 pointer·Enter·390px·light/dark,
새 소비자 설치·typecheck·build·Chromium을 확인했습니다.
현재 91개 item의 별도 동시 설치에서도 93개 파일 일치·typecheck·
build·208개 export 브라우저 로딩을 확인했습니다.
[구현·검증 기록](component-citation-list-2026-09-29.md)에 upstream
revision·LICENSE·의존성과 미검증 항목을 남겼습니다. 현재 변경의
commit·push·공개 배포는 확인하지 않았습니다.

2026-09-29: `SplitButton` 후보는 기존 `ButtonGroup`·`Button`·
`DropdownMenu`의 설치 가능한 조합으로 마무리했습니다. 문서 preview와
사용 코드의 기본 실행·대체 메뉴를 Chromium과 90개 item 소비자에서
확인했습니다. 새 component/item은 없어 **88개/90개**, 공급·품질
조건 **4/10**, 전체 goal 관리용 추정 **약 65%**입니다. 검사 범위와
미검증 항목은 [조합 기록](component-split-button-recipe-2026-09-29.md)에
있습니다. 현재 변경의 commit·push·공개 배포는 확인하지 않았습니다.

2026-09-29: form 값을 제출하는 `SegmentedControl`을 프로젝트 소유
native radio로 추가했습니다. 88개 component·90개 registry item입니다.
새 item의 click·방향키·제출, 밝은/어두운 모드·390px 화면과 개별
소비자 설치를 확인했습니다. 현재 90개 item을 새 소비자에 함께
설치해 92개 파일 일치·typecheck·build·Chromium 로딩도 확인했습니다.
[구현·검증 기록](component-segmented-control-2026-09-29.md)에 범위와
미검증 항목이 있습니다. 공급·품질 조건 4/10, 전체 goal 관리용
추정 약 65%는 유지합니다. 현재 변경의 commit·push·공개 배포는
확인하지 않았습니다.

2026-09-29: 기존 Dropzone·Calendar·Slider·Avatar의 문서 preview를
확장하고 Chromium에서 파일 선택·거부, 기간 부분/완료 선택,
두 thumb 키보드 변경, 이미지 로드·fallback을 확인했습니다.
typecheck·build·registry:check와 diff 검사도 통과했습니다. 실제
drag/drop·touch·screen reader·다른 호스트 시간대는 남아 있습니다.
[상호작용 재검사 기록](component-foundation-interactions-2026-09-29.md)에
결과가 있습니다. 87개 component·89개 registry item, 공급·품질 조건
4/10, 전체 goal 관리용 추정 약 65%는 그대로입니다. 이번 변경의
commit·push·공개 배포는 확인하지 않았습니다.

2026-09-29: 기존 `Navigation` item에 `BottomNav`·`BottomNavLink`를
추가했습니다. 주요 목적지의 하단 배치, 항상 보이는 이름과
`aria-current`를 문서 preview에서 확인했습니다. 390px Chromium,
격리 소비자 설치·typecheck·build와 저장소 검사 결과는
[하단 탐색 기록](component-bottom-navigation-2026-09-29.md)에 있습니다.
87개 component·89개 registry item과 공급·품질 조건 4/10은 그대로여서
전체 goal 관리용 추정치도 약 65%입니다. 실제 screen reader·touch,
5개 이상 목적지 scroll, 라우터 연동과 공개 배포는 미검증입니다.
현재 변경의 commit·push·공개 배포는 확인하지 않았습니다.

2026-09-29: shadcn/ui source를 수정한 registry item 27개를 각각 새
소비자에 `shadcn@4.21.0 add`로 설치했습니다. 설치된 MIT 고지
27개와 직접 component 소스 27개가 저장소 원본과 일치했습니다.
로컬 작업 트리는 87개 component·89개 registry item이고 공급·품질
조건은 4/10입니다. 전체 goal의 관리용 추정치는 약 65%이며 공개
배포 준비율은 아닙니다. 대상·fixture·미검증 항목은
[item별 고지 기록](component-license-notice-individual-2026-09-29.md)과
[진행률](goal-progress-2026-09-29.md)에 있습니다. 현재 변경의
commit·push·공개 배포는 확인하지 않았습니다.

2026-09-29: 현재 89개 registry item을 `shadcn@4.21.0`으로 새
소비자에 동시 설치했습니다. 원본 91개 파일 일치, 87개 catalog 사용
코드의 package tarball·registry 직접 import typecheck, 전체 모듈
build·Chromium 로딩을 확인했습니다. 공급·품질 조건은 3/10으로
늘었고 전체 goal 관리용 추정치는 약 60%입니다. CLI 4.0.0과 4.21.0의
설치 경로 차이, fixture와 미검증 범위는
[공급 경로 검사](component-catalog-supply-2026-09-29.md)에 있습니다.
현재 변경의 commit·push·공개 배포는 확인하지 않았습니다.

2026-09-29: 기존 `Badge`에 네 가지 token 기반 variant를 추가했습니다.
Operations workspace의 상태 텍스트와 함께 적용했고 독립 소비자에
Badge·utils·tokens를 설치해 원본 일치·typecheck·build를 확인했습니다.
로컬 component 87개·registry item 89개, goal 관리용 추정 약 50%는
변경되지 않습니다. 검증과 남은 범위는
[Badge 기록](component-badge-variants-2026-09-29.md)에 있습니다.

2026-09-29: Data display에 `DataList`를 추가했습니다. 로컬 작업 트리는
87개 component·89개 registry item입니다. native `dl`의 행·그리드,
`null` 값과 빈 목록을 구분합니다. 패키지 테스트, 문서 Chromium의
2열 전환과 Operations workspace 기간 갱신, 독립 소비자 registry
설치·typecheck·build를 확인했습니다. 전체 goal의 관리용 추정치는
약 50%입니다. 검사·미검증 범위는
[DataList 기록](component-data-list-2026-09-29.md)과
[진행률 기록](goal-progress-2026-09-29.md)에 있습니다. 현재 89개
item 전체 동시 설치와 공개 배포는 확인하지 않았습니다.

2026-09-29: Developer tools에 `CodeBlock`을 추가했습니다. 로컬
작업 트리는 86개 component·88개 registry item입니다. 단일 코드의
언어·줄바꿈·복사 상태를 문서 preview와 격리 소비자에서 확인했습니다.
검증과 미검증 범위는
[CodeBlock 기록](component-code-block-2026-09-29.md)에 있습니다.
전체 goal의 관리용 약 50% 추정치는 그대로이며 현재 변경의 공개
배포는 확인하지 않았습니다.

2026-09-29: 현재 87개 registry item을 새 소비자에 동시에 설치했습니다.
89개 파일 원본 일치, 87개 모듈 typecheck·build와 production audit
0건을 확인했습니다. 기본 공개 URL 빌드와 `registry:check`도
통과했습니다. 이번 fixture의 브라우저 실행과 갱신 충돌·복구는
검사하지 않았습니다. 범위와 경로는
[전체 설치 기록](component-full-registry-consumer-2026-09-29.md)에 있습니다.
component 수는 85개이며 [진행률 기록](goal-progress-2026-09-29.md)의
관리용 약 50% 추정치는 그대로입니다.

2026-09-29: `DateTimePicker`를 마무리했습니다. 로컬 작업 트리는 85개
component·87개 registry item입니다. 날짜·시각의 부분 선택을 보존하고
완성 시 로컬 날짜시각과 IANA 시간대를 한 쌍으로 제출합니다. 패키지
테스트 28개, 격리 소비자 설치·typecheck·build, 로컬 Chromium의
날짜/시각 양쪽 선택 순서와 제출을 확인했습니다. 저장소 최종
typecheck·build·registry:check 결과와 미검증 범위는
[구현 기록](component-date-time-picker-2026-09-29.md)에 있습니다.
[진행률 기록](goal-progress-2026-09-29.md)의 전체 goal 관리용 추정치는
약 50%입니다. 현재 대규모 변경은 미배포 상태입니다.

2026-09-29: Operations workspace의 390px 검사에서 DataTable 열 압축을
발견해 표 내부 가로 scroll과 이름 있는 keyboard focus 영역으로
고쳤습니다. 문서 개발 서버의 Registry review iframe 경로와 HMR root
중복 경고도 고쳤습니다. 25개 패키지 테스트, typecheck·build·
registry:check와 Chromium 결과·미검증 범위는
[좁은 표 기록](component-data-table-responsive-2026-09-29.md)에 있습니다.
84개 component·86개 item, goal 관리용 약 50% 추정은 그대로입니다.


2026-09-29: 문서에 Operations workspace 조합 예시를 추가했습니다.
84개 component·86개 registry item 수는 그대로입니다. 기간 전환,
검색·필터·선택 재실행·로그·도움말을 Chromium에서 확인했고,
typecheck·build·registry:check가 통과했습니다. 개발 서버 HMR 오류와
미검증 범위는 [분석 예시 기록](component-analytics-workspace-2026-09-29.md)에
남겼습니다. 전체 goal의 관리용 추정 완료율은 여전히 약 50%입니다.


2026-09-29: 기존 `MetricCard`에 `compact`·`featured` 형태를 추가하고
기본 배치를 유지했습니다. 문서의 세 형태 preview·사용 코드, 새 소비자
설치·typecheck·build·light/dark 브라우저 동작을 확인했습니다.
84개 component·86개 registry item으로 총수는 같습니다. 출처와
미검증 범위는 [MetricCard 기록](component-metric-card-variants-2026-09-29.md)에
남겼습니다. 기본 공개 URL 빌드와 `registry:check`가 통과했으며 공개
배포는 확인하지 않았습니다.

2026-09-29: `AppShell`의 floating panel·bubble과 `Spinner`의 5가지
형태가 이미 있는 것을 확인했습니다. 현재 catalog 사용 코드 84개를
package tarball을 설치한 소비자에서 typecheck했고, 84개 원본·public
export·registry·catalog의 1:1 대응을 `registry:check`에 추가해
통과했습니다. 범위와 fixture는
[문서 사용 코드 검사](component-catalog-consumer-2026-09-29.md)에
기록했습니다. review 가능한 변경 묶음 정리와 실제 상호작용 검사는
남았습니다.

2026-09-29: 현재 86개 registry item을 새 Vite 소비자에 동시에
설치했습니다. 88개 파일의 원본 일치, 86개 모듈의 typecheck·build·
브라우저 로딩(206개 값 export, console error 0건), production audit
0건을 확인했습니다. 기본 공개 URL 빌드로 복원하고 저장소 typecheck와
`registry:check`도 통과했습니다. 검사 범위와 미검증 항목은
[전체 소비자 기록](component-full-registry-consumer-2026-09-29.md)에,
goal의 관리용 완료율 추정과 근거는
[진행 상태](goal-progress-2026-09-29.md)에 남겼습니다. 현재 변경의
commit·push·공개 배포는 확인하지 않았습니다.

2026-09-29: Actions에 `ButtonGroup`을 추가해 로컬 작업 트리는 84개
component, 86개 registry item입니다. 사용처 판정, 공식 source·LICENSE,
문서 preview, 격리 소비자 설치와 미검증 범위는
[ButtonGroup 기록](component-button-group-2026-09-29.md)에 남겼습니다.
기본 공개 URL로 빌드를 복원했고 `registry:check`도 통과했습니다.

2026-09-29: 사용자 요청에 따라 현재 목표의 수량 기준과 공급 조건을
[진행 상태](goal-progress-2026-09-29.md)에 정리했습니다. 83개 component는
100개 규모 기준의 83%이나 목표 전체 완료율은 아닙니다. 로고의 사각
border는 현재 로컬 계산 스타일과 화면에서 재현되지 않아 추가 수정하지
않았습니다.

2026-09-29: `AvatarGroup`을 추가해 로컬 작업 트리는 83개 component,
85개 registry item입니다. 이름 있는 목록, 남은 인원 요약, 빈 상태와
별도 소비자 설치·typecheck·build를 확인했습니다. 검증과 남은 범위는
[AvatarGroup 기록](component-avatar-group-2026-09-29.md)에 있습니다.
85개 전체 동시 재설치는 하지 않았고 공개 배포도 확인하지 않았습니다.

2026-09-29: `PageHeader`에 compact·기본·hero 크기를 추가했습니다.
기존 기본 스타일과 heading 계층 선택은 유지합니다. 문서 preview의
크기 전환, 새 소비자 설치·typecheck·build, 밝은·어두운 브라우저
표시와 미검증 범위는
[PageHeader 기록](component-page-header-sizes-2026-09-29.md)에
남겼습니다. component 82개, registry item 84개로 총수는 같습니다.
기본 공개 URL 빌드와 `registry:check`를 다시 통과했습니다.

2026-09-29: 현재 84개 registry item 전체를 새 Vite 소비자에 한 번에
설치했습니다. 86개 파일이 원본과 일치했고 84개 모듈의 typecheck·build·
브라우저 로딩(203개 값 export, console error 0건)이 통과했습니다.
기본 공개 URL 빌드로 복원하고 저장소 typecheck·registry:check도
통과했습니다. 같은 소비자에 현재 tarball을 설치해 catalog 사용 코드
82개의 typecheck도 통과했습니다. 개별 설치, 갱신 충돌과 전체
상호작용은 미검증입니다. 범위와 fixture는
[전체 registry 소비자 기록](component-full-registry-consumer-2026-09-29.md)에
남겼습니다. 로고 테두리 위치 확인 요청도 별도로 대기 중입니다.

2026-09-29: Framework에 `ScrollArea`를 추가했습니다. 로컬 작업 트리는
82개 component, 84개 registry item입니다. 세로·가로 scroll, focus,
격리 소비자 설치와 MIT 고지 전달, 미검증 항목은
[ScrollArea 기록](component-scroll-area-2026-09-29.md)에 남겼습니다.
typecheck·build·registry:check·패키지 테스트와 소비자 typecheck·build가
통과했습니다. 공개 배포는 확인하지 않았습니다.

2026-09-29: Date & time에 `TimePicker`를 추가했습니다. 로컬 작업 트리는
81개 component, 83개 registry item입니다. 시·분의 native 입력과
12/24시간 표시, `HH:mm` form 값, 문서와 격리 소비자 검증은
[TimePicker 기록](component-time-picker-2026-09-29.md)에 남겼습니다.
typecheck·build·registry:check·패키지 테스트와 소비자 typecheck·build가
통과했습니다. 좁은 화면·실제 보조기술은 검증하지 않았고 공개 배포도
확인하지 않았습니다. 상단 로고의 사각 테두리는 현재 로컬 화면과 계산된
스타일에서 보이지 않았으며 추가 CSS 변경은 없습니다.

2026-09-29: `DataChart`에 `stacked-area`를 추가했습니다. 로컬 작업
트리는 80개 component, 82개 registry item입니다. 결측 범주 처리,
합계, 문서와 격리 소비자 검증, 미검증 항목은
[누적 영역 기록](component-data-chart-stacked-area-2026-09-29.md)에
남겼습니다. typecheck·build·registry:check·패키지 테스트와 소비자
typecheck·build가 통과했습니다. 공개 배포는 확인하지 않았습니다.


2026-09-29: 사이트 상단 로고의 사각 테두리는 키보드 초점 상태에서
공통 `focus-visible` outline으로 재현했습니다. 로고 링크의 초점
표시를 아래쪽 선으로 바꾸고 밝은·어두운 로컬 화면에서 확인했습니다.
[flat 로고 기록](brand-logo-flat-2026-09-29.md)에 원인과 변경 범위를
남겼습니다. 공개 배포는 확인하지 않았습니다.

2026-09-29: Inputs에 `Rating`을 추가했습니다. 로컬 작업 트리는 80개
component, 82개 registry item입니다. native radio의 키보드 선택,
form 제출, 별점·segment 표시와 읽기 전용 점수, 소비자 설치 및
미검증 범위는 [Rating 기록](component-rating-2026-09-29.md)에
남겼습니다. typecheck, build, registry:check, 패키지 테스트와
소비자 typecheck·build가 통과했습니다. push·배포는 하지 않았습니다.

2026-09-29: Inputs에 `PinInput`을 추가했습니다. 로컬 작업 트리는 79개
component, 81개 registry item입니다. native 단일 입력의 붙여넣기·삭제·
완성 코드의 자리 교체·form 유효성, 별도 소비자 설치와 미검증 범위는
[PinInput 기록](component-pin-input-2026-09-29.md)에 남겼습니다.
`npm test -w @pydemia/ui`, typecheck, build, registry:check와 별도
소비자 typecheck·build가 통과했습니다. 기본 공개 URL 빌드로
복원했으며 push·배포는 하지 않았습니다.

앞선 정적 화면 조사에서는 로고 이미지와 링크의 border가 `0px`라
사각 테두리를 찾지 못했습니다. 이후 키보드 초점 상태에서 원인을
재현하고 위의 링크 초점 스타일을 수정했습니다.

2026-09-29: Actions에 `ToggleGroup`을 추가했습니다. 현재 로컬 작업
트리는 78개 component, 80개 registry item입니다. 공식 source·license,
문서 preview, 격리 소비자 설치와 브라우저 검증은
[ToggleGroup 기록](component-toggle-group-2026-09-29.md)에 남깁니다.
push·배포는 하지 않았습니다. 상단 로고의 사각 테두리는 로컬 계산값에서
확인되지 않아 제거할 정확한 위치를 사용자에게 요청한 상태입니다.

2026-09-29: DataChart에 선택 범주의 값을 확인하는 `inspectable` 옵션을
추가했습니다. 포인터·native select, 결측값, 다중 계열과 새 소비자
설치 결과, 미검증 범위는
[DataChart 구간 기록](component-data-chart-inspector-2026-09-29.md)에
있습니다. 총수는 77개 component, 79개 registry item으로 같고
기본 공개 URL 빌드로 복원했습니다. push·배포는 하지 않았습니다.

2026-09-29: 기존 Toast에 FIFO queue, 선택적 중복 억제와 표시 한도를
추가했습니다. 단일 controlled API는 유지합니다. 문서 preview·새
소비자 설치와 키보드 닫기, 미검증 범위는
[Toast 대기열 기록](component-toast-queue-2026-09-29.md)에 있습니다.
총수는 77개 component, 79개 registry item이며 로컬 변경입니다.
기본 공개 URL로 빌드를 복원했고 push·배포는 하지 않았습니다.

2026-09-29: Overlays에 HoverCard를 추가했습니다. 로컬 작업 트리는
77개 component, 79개 registry item입니다. 공식 source·license,
키보드·pointer 동작과 새 소비자 격리 설치, 미검증 범위는
[HoverCard 기록](component-hover-card-2026-09-29.md)에 있습니다.
기본 공개 URL로 빌드를 복원했고 push·배포는 하지 않았습니다.
사이트 로고 사각 테두리 요청은 현재 로컬 CSS와 SVG에서 해당 선이
없어 지칭한 부분을 사용자에게 확인 중입니다.

2026-09-29: 새 Vite 소비자에 78개 registry item을 한 번에 설치해
80개 파일의 원본 일치, 78개 모듈의 import·typecheck·build·브라우저
로딩을 확인했습니다. `registry:check`는 생성 JSON의 소스 일치도
검사합니다. 개별 item 격리 설치와 전체 상호작용은 남았습니다.
[전체 설치 기록](component-full-registry-consumer-2026-09-29.md)에
검사 범위가 있습니다. 기본 공개 URL 빌드로 복원했고 아직 배포하지
않았습니다. 이어서 catalog·index·registry의 component ID 76개가
대응하는지 확인했고, package tarball을 설치한 소비자에서 문서 사용
코드 76개를 typecheck했습니다.

2026-09-29: 사이트 로고 박스의 테두리 요청을 다시 조사했습니다.
로컬 문서 사이트의 로고·링크·헤더에는 CSS border가 없고 SVG에도
사각형 경로가 없습니다. 로고 도형의 외곽을 뜻하는지 확인 요청한
상태입니다. [flat 로고 기록](brand-logo-flat-2026-09-29.md)에
계산된 스타일과 판단 근거를 남겼습니다.

2026-09-29: `DataChart`에 누적 막대 variant를 추가했습니다. 양수·음수
분리 누적, 결측값 표, 소비자 설치·브라우저 검증과 미검증 범위는
[DataChart 기록](component-data-chart-stacked-2026-09-29.md)에 있습니다.
총수는 76개 component, 78개 registry item으로 같습니다. 로컬
변경이며 공개 배포는 확인하지 않았습니다.

2026-09-29: Navigation 범주에 `NavigationMenu`를 추가해 로컬 작업
트리는 76개 component, 78개 registry item입니다. 그룹 링크,
키보드 조작, 소비자 설치와 미검증 범위는
[NavigationMenu 기록](component-navigation-menu-2026-09-29.md)에
남겼습니다. 로컬 변경이며 공개 배포는 확인하지 않았습니다.

2026-09-29: Spinner를 icon·ring·dots·bars·orbit 다섯 형태로
확장했습니다. 총수는 75개 component, 77개 registry item으로
같습니다. 문서 preview·소비자 설치·빌드와 남은 검증 범위는
[Spinner 기록](component-spinner-variants-2026-09-29.md)에 있습니다.
로컬 변경이며 공개 배포는 확인하지 않았습니다.

2026-09-29: 사이트 상단 로고의 사각 테두리 요청에 맞춰 헤더에 남아 있던
아래쪽 1px 구분선을 제거했습니다. 로고 이미지와 링크는 이미 border가
없었습니다. 로컬 화면·문서 앱 빌드 검증 결과는
[flat 로고 작업](brand-logo-flat-2026-09-29.md)에 기록했습니다.
공개 배포는 확인하지 않았습니다.

2026-09-29: Inputs 범주에 `TagsInput`을 추가해 로컬 작업 트리는
75개 component, 77개 registry item입니다. 추가·삭제·중복·개수 제한,
반복 form 값과 미확정 draft의 제출 차단, 소비자 설치 결과를
[TagsInput 기록](component-tags-input-2026-09-29.md)에 남깁니다.
기존 `AppShell`이 좌우·하단·floating panel과 bubble을 이미
제공하므로 같은 역할의 item을 별도로 늘리지 않았습니다.
로컬 변경이며 공개 배포는 확인하지 않았습니다.

2026-09-29: Inputs 범주에 `NumberInput`을 추가해 로컬 작업 트리는
74개 component, 76개 registry item입니다. locale 숫자 표시, 범위,
키보드 조작과 native form 제출을 확인했습니다. 자세한 검증과 제한은
[NumberInput 기록](component-number-input-2026-09-29.md)에 남깁니다.
같은 날 Profile 예시 헤더의 사각형 `p` 로고를 flat SVG로 교체했습니다.
[flat 로고 작업](brand-logo-flat-2026-09-29.md)에 기록했습니다.
두 변경 모두 로컬 작업이며 공개 배포는 확인하지 않았습니다.

2026-09-29: Overlays 범주에 `ContextMenu`를 추가해 로컬 작업 트리는
73개 component, 75개 registry item입니다. 우클릭·Shift+F10,
submenu와 소비자 설치 결과, 미검증 범위는
[ContextMenu 기록](component-context-menu-2026-09-29.md)에 있습니다.
로컬 변경이며 공개 배포는 확인하지 않았습니다.

2026-09-29: Inputs 범주에 `SearchInput`을 추가해 로컬 작업 트리는
72개 component, 74개 registry item입니다. 검색 제출·초기화,
새 소비자 설치와 전이 MIT 고지 전달을 확인했습니다. 처음 설치할 때
기본 공개 URL이 이전 의존성으로 이어진 점과 미검증 범위는
[SearchInput 기록](component-search-input-2026-09-29.md)에 있습니다.
로컬 변경이며 공개 배포는 확인하지 않았습니다.

2026-09-29: Inputs 범주에 `ColorInput`을 추가해 로컬 작업 트리는
71개 component, 73개 registry item입니다. 문서 Colormap 편집기에
연결했고 새 소비자 설치·빌드·브라우저 동작을 확인했습니다. native
picker 등 미검증 범위는
[ColorInput 기록](component-color-input-2026-09-29.md)에 있습니다.
로컬 변경이며 공개 배포는 확인하지 않았습니다.

2026-09-29: 사이트 상단 로고의 사각 테두리 요청을 재확인했습니다.
로고 이미지·링크는 이미 border가 없었고, 헤더에서 테두리가 남은
테마 전환 버튼의 border를 제거했습니다. 로컬 화면과 계산된 스타일은
[flat 로고 작업](brand-logo-flat-2026-09-29.md)에 기록했습니다.

2026-09-29: Developer tools 범주에 `JsonViewer`를 추가해 로컬 작업
트리는 70개 component, 72개 registry item입니다. 중첩 탐색·항목별
추가 표시·복사와 새 소비자 설치, 미검증 범위는
[JsonViewer 기록](component-json-viewer-2026-09-29.md)에 있습니다.
로컬 변경이며 공개 배포는 확인하지 않았습니다.

2026-09-29: File & media 범주에 `Image`를 추가해 로컬 작업 트리는
69개 component, 71개 registry item입니다. 정상·누락·오류 상태와
소비자 설치, 검증하지 못한 범위는
[Image 기록](component-image-2026-09-29.md)에 있습니다.
로컬 변경이며 공개 배포는 확인하지 않았습니다.

같은 날 사이트 왼쪽 상단 로고의 사각 테두리 요청을 재확인했습니다.
로컬 밝은/어두운 모드에서 로고 이미지·링크·버전 표식의 계산된 border와
배경은 모두 0/투명입니다. 화면 상단에서 사각 테두리가 보이는 요소는
오른쪽 테마 전환 버튼입니다. 어느 요소를 지칭하는지 사용자에게
확인을 요청했고 답변을 기다리고 있습니다. 로고 CSS는 변경하지
않았습니다.

2026-09-29: Content 범주에 `Carousel`을 추가해 로컬 작업 트리는 68개
component, 70개 registry item입니다. 수동 이동·선택·card/plain과
소비자 설치 결과 및 미검증 범위는
[Carousel 기록](component-carousel-2026-09-29.md)에 있습니다.
로컬 변경이며 공개 배포는 확인하지 않았습니다.

2026-09-29: 사이트 상단 로고 링크와 이미지에 `border: 0`을 명시했습니다.
로컬 화면과 문서 앱 빌드를 확인했습니다. 변경 전 공개 사이트에도
시각적인 사각 테두리는 없었으며, 이번 CSS는 아직 게시하지 않았습니다.
기록은 [flat 로고 작업](brand-logo-flat-2026-09-29.md)에 있습니다.

2026-09-29: `DataChart`에 공통 범주의 다중 계열 선형·그룹 막대·영역
표현과 범례를 추가했습니다. 총수는 67개 component, 69개 registry
item으로 같습니다. API·설치·검증 범위는
[다중 계열 차트 기록](component-data-chart-multi-series-2026-09-29.md)에
있습니다. 로컬 변경이며 공개 배포는 확인하지 않았습니다.

2026-09-29: `FilterBar`를 추가해 로컬 작업 트리는 67개 component,
69개 registry item입니다. 적용·초기화와 새 소비자 설치 결과는
[분석 필터 기록](component-filter-bar-2026-09-29.md)에 있습니다.
로컬 변경이며 공개 배포는 확인하지 않았습니다.

2026-09-29: `Reasoning`과 `ToolCall`을 추가해 로컬 작업 트리는
66개 component, 68개 registry item입니다. AI 생성 과정과 도구
실행 상태의 구현·소비자 설치·미검증 범위는
[AI 작업 상태 기록](component-agent-workflow-2026-09-29.md)에 있습니다.
로컬 변경이며 공개 배포는 확인하지 않았습니다.

2026-09-29: `Conversation`을 추가해 로컬 작업 트리는 64개 component,
66개 registry item입니다. 새 메시지 위치·스크롤·입력·비움과 남은
검증 범위는 [대화 목록 기록](component-conversation-2026-09-29.md)에
있습니다. 로컬 변경이며 공개 배포는 확인하지 않았습니다.

같은 날 상단 로고의 사각 테두리 요청을 재확인했습니다. 로컬·새로 연
공개 사이트의 밝은 모드와 어두운 모드에서 로고 이미지와 링크의
계산된 border는 `0px`, 배경은 투명입니다. SVG에도 사각형 경로가
없습니다. 다른 요소를 지칭했을 가능성이 있어 화면 위치 확인을
요청했습니다. 추가 CSS 변경은 하지 않았습니다.

2026-09-29: 계층형 리소스 선택용 `Tree`를 추가해 현재 63개
component, 65개 registry item입니다. 방향키·이름 검색·선택·확장,
소비자 설치와 미검증 범위는
[Tree 기록](component-tree-2026-09-29.md)에 있습니다. 로컬 변경이며
공개 배포는 확인하지 않았습니다.

2026-09-29: `DateRangePicker`를 추가해 현재 62개 component,
64개 registry item입니다. 부분·완료 선택, 제한 날짜·기간, form 제출,
소비자 설치와 미검증 범위는
[기간 선택 기록](component-date-range-picker-2026-09-29.md)에 있습니다.
로컬 변경이며 공개 배포는 확인하지 않았습니다.

상단 로고의 border·흰 사각 배경 제거는 공개 사이트에서 다시 확인했습니다.
밝은 모드의 `.brand-mark`와 상위 링크의 계산된 border는 모두 `0px`,
이미지 배경은 투명합니다. 공개 사이트에는 기존 38개 component가
표시되므로 아래 component 확장은 아직 게시되지 않았습니다.

2026-09-29: shadcn/ui 기반 26개 registry item의 MIT 고지를 소비자
설치 파일로 전달하도록 수정했습니다. 직접·전이 설치와 빌드 결과,
남은 개별 설치 검사는
[registry 고지 전달 기록](registry-license-delivery-2026-09-29.md)에
있습니다. 이 변경은 로컬에만 있습니다. 상단 로고의 사각 테두리 제거는
별도 commit `bfec10d`로 공개 사이트에 게시됐습니다.

2026-09-29: `CommandPalette`를 추가해 현재 61개 component,
63개 registry item입니다. 단축키·검색·그룹·disabled·focus·소비자
설치와 미검증 범위는
[명령 팔레트 기록](component-command-palette-2026-09-29.md)에 있습니다.

2026-09-29: `MultiSelect`를 추가해 현재 60개 component,
62개 registry item입니다. 검색·다중 값 제출·선택 제거·필수값 검증과
소비자 설치 상태는
[다중 선택 기록](component-multi-select-2026-09-29.md)에 있습니다.

2026-09-29: `FileUpload`를 추가해 현재 59개 component,
61개 registry item입니다. 기존 `Dropzone`·`Progress`를 조합하며
전송은 소비자가 소유합니다. 동작·설치·미검증 범위는
[파일 전송 상태](component-file-upload-2026-09-29.md)에 기록했습니다.

2026-09-29: `Stepper`와 `Timeline`을 추가해 현재 58개 component,
60개 registry item입니다. 동작·소비자 설치·미검증 범위는
[단계·활동 표시](component-workflow-2026-09-29.md)에 기록했습니다.

2026-09-29: 접힘식·모바일 `Sidebar`를 추가했습니다. 현재 56개
component, 58개 registry item입니다. 반응형·키보드·소비자 검증과
미검증 범위는 [Sidebar](component-sidebar-2026-09-29.md)에 기록했습니다.

2026-09-29: `ResizablePanels`와 `Progress`의 원형 variant를
추가했습니다. 당시 55개 component, 57개 registry item이었습니다.
키보드·pointer·진행 상태 및 소비자 설치 확인은
[크기 조절 패널·원형 진행 표시](component-resizable-progress-2026-09-29.md)에
기록했습니다.

문서 사이트 상단 로고의 흰 사각 배경과 옆 버전 표식의 테두리를
제거했습니다. 밝은 모드와 어두운 모드의 표시 및 저장소 검증은
[flat 로고 기록](brand-logo-flat-2026-09-29.md)에 있습니다.

2026-09-29 현황: 로컬 작업 트리에 AppShell, Navigation, LogConsole,
Sparkline, PageHeader, ContentList, DataChart, Dashboard, Toast, Drawer,
Pagination, DataTable, DropdownMenu, PasswordInput, Combobox,
DonutChart, ResizablePanels, Sidebar, Stepper, Timeline, FileUpload,
MultiSelect, CommandPalette와
Spinner 변형을 추가했습니다.
DataChart에는 영역형, Progress에는 원형 variant도 있습니다. 현재
61개 component, 63개 registry item입니다.
작업·검증·미검증 범위는
[화면 골격 확장](component-expansion-2026-09-29.md)과
[차트·대시보드·알림](component-analytics-toast-2026-09-29.md)에 있습니다.
목록·패널 묶음은
[목록·패널 확장](component-list-drawer-2026-09-29.md)에 기록했습니다.
메뉴·입력·차트 변형은
[메뉴·입력·차트 확장](component-menu-input-chart-2026-09-29.md)에 있습니다.
검색 선택과 구성비 차트는
[Combobox·DonutChart](component-combobox-donut-2026-09-29.md)에 기록합니다.
아래 2026-09-28 기준 수치와 원격 배포 상태는 당시 기록입니다.

기준: 2026-09-28, `main`의 `b122cb6`에서 확장한 작업 트리. 새 세션에서는
먼저 최신 `main`과
`git status`를 확인하세요. 이 문서는 현재 prototype에서 다음 component를
편입하기 위한 작업 맥락이며, 최신 상태는 저장소의 코드와 metadata가 우선합니다.

세션 계획과 검토 기록은 `.worknotes/`에 보관합니다. 기록 위치와 지침 점검
결과는 [session-instructions-audit-2026-09-28.md](session-instructions-audit-2026-09-28.md)에
있습니다.

## 목표와 현재 범위

목표는 Mantine/MUI에 견줄 만한 component coverage를 점진적으로 확보하면서
shadcn/ui의 Open Code, source ownership, 디자인 자유도를 유지하는 것입니다.
외부 registry들을 runtime에 합치는 대신, 필요한 소스를 개별 검토하고
`@pydemia/ui`와 내부 shadcn registry에 정규화해 편입합니다. bulk import나
범용 추상화를 먼저 만들지 마세요.

현재 React 19, TypeScript, Tailwind CSS 4, Vite 7, npm workspaces를 사용합니다.
`components.json`은 shadcn `new-york`, `rsc: false`, CSS variables 설정입니다.
`@pydemia/ui`는 private workspace package이며 npm에 게시되지 않았습니다.

| 위치 | 내용 |
| --- | --- |
| `packages/ui/src/components/`, `index.ts` | 배포할 component 원본과 public export |
| `packages/ui/src/styles.css` | light/dark color, type, spacing, radius, border, shadow, focus, motion, density token |
| `registry.json` | shadcn item의 파일과 직접·registry 의존성 |
| `registry/provenance.json` | 출처, 고정 upstream revision, license, 의존성, profile, 접근성 상태 |
| `THIRD_PARTY_NOTICES.md` | 편입한 제3자 source의 notice |
| `apps/docs/src/catalog.tsx` | component별 preview, 설명, 사용 코드 |
| `apps/profile-demo` | foundation과 curated component를 함께 쓰는 예시 |
| `research/source-inventory.md` | MUI/Mantine taxonomy, source별 coverage·gap·license 조사 |
| `research/design-contract.md` | 첫 prototype의 시각·상호작용 결정 |
| `research/verification.md` | 실행한 검증과 미검증 항목 |

현재 40개 registry item은 `pyd-utils`, `pyd-tokens`와 38개
component입니다. Foundation
29개에 Origin UI의 AffixedInput, Kibo UI의 Snippet·Dropzone, AI Elements
기반 Message·PromptInput, Tremor를 참고한 원본 MetricCard가 포함됩니다.
이번 작업 트리에는 Selection의 Checkbox·NativeSelect·Switch·RadioGroup,
Overlays의 Dialog·Tooltip, Feedback의 Alert·Progress·Skeleton,
Inputs의 Textarea, Layout의 Card·Separator가 추가됐습니다.
이어 Accordion·Collapsible·Popover·AlertDialog, Avatar·Breadcrumb,
Empty·Spinner·Toggle·Slider도 편입했습니다.
빈 범주에서는 Date & time의 Calendar, Data & analytics의 MetricCard,
File & media의 Dropzone, AI & agent의 Message·PromptInput을 추가했습니다.
폼 입력 묶음의 Field·Select·DatePicker도 편입했습니다. `pyd-tokens`는
component 개수에 포함하지 않는 설치용 stylesheet item입니다.
게시된 문서 사이트는 <https://pydemia-ui.vercel.app/>, 조합 예시는
<https://pydemia-ui.vercel.app/examples/profile/>에서 볼 수 있습니다.
이번 로컬 변경의 원격 배포는 확인하지 않았습니다.

## 다음 편입 범위

추가 후보의 범주, 판정 기준, 소비자 설치와 품질 조건은
[`component-roadmap.md`](component-roadmap.md)에 정리했습니다.
현재 38개는 로컬 구현이며 안정적인 공급이 검증된 38개로
표현하지 마세요.

`research/source-inventory.md`의 gap을 기준으로 실제 사용처가 있는
component를 단계적으로 고르세요. Charts, Editor, Tree & hierarchy,
Workflow에는 아직 내부 구현이 없습니다. Date & time, File & media,
AI & agent에는 첫 항목만 편입한 상태입니다.
Selection, Overlays, Feedback에도 기능별 gap이 남아 있습니다. 의존성,
접근성, 문서 예시의 필요를 함께 검토하세요. 약 100개는 장기 기준점이며
숫자를 채우기 위한 중복 component를 만들지 않습니다.

shadcn/ui는 일반 foundation, Origin UI는 선택한 일반 UI 변형, Kibo UI는
특정 기능 component의 주력 source입니다. Tremor는 analytics 화면에,
AI Elements는 AI interface에 실제 요구가 생기면 item 단위로 확장합니다.
Magic UI, Motion Primitives, Cult UI, Aceternity UI는 visual/reference로만
취급합니다. 특히 Aceternity Pro 코드를 공개 registry로 재배포하지 마세요.

새 component마다 다음 순서로 작업하세요.

1. upstream 공식 docs, 동일 revision의 코드와 LICENSE 원문을 다시 확인하고
   직접·전이 의존성, 유지 상태, 키보드/focus/screen reader 동작을 평가합니다.
   기존 조사 날짜나 검색 결과만으로 license를 확정하지 않습니다.
2. 기존 API와 중복을 확인하고 `packages/ui/src/components/`에 필요한 코드만
   편입합니다. 색상·간격·radius·shadow·focus·motion은 공통 token을 사용하고,
   접근성에 필요한 semantics와 상태를 보존합니다.
3. `packages/ui/src/index.ts`, `registry.json`, `registry/provenance.json`,
   필요 시 `THIRD_PARTY_NOTICES.md`를 함께 수정합니다. registry dependency는
   명시하고 source의 license와 npm dependency의 license를 구분합니다.
4. `apps/docs/src/catalog.tsx`에 동작하는 preview와 사용 코드를 추가합니다.
   필요할 때만 `apps/profile-demo`에 실제 조합을 추가합니다. 단순 카드나
   모형이 아니라 구현된 component를 사용합니다.
5. 키보드·focus·상태 발표·light/dark·좁은 화면을 확인하고
   `research/verification.md`에 실행한 검사와 미검증 항목을 구분해 기록합니다.

기본 시각 방향은 낮거나 중간 radius, 얇고 분명한 border, 절제된 shadow,
compact–moderate density, semantic color token, 짧고 절제된 motion입니다.
현재 `--radius: 5px`, `--density-control-height: 36px`,
`--motion-fast: 150ms`이며 색상은 브랜드 확정값이 아닌 임시 선택입니다.

## 설치·검증·배포

```bash
npm ci
npm run typecheck
npm run build
npm run registry:check
npm run dev
```

`npm run build`는 `docs/`의 정적 사이트와 `docs/r/`의 registry JSON을
생성합니다. 빌드 후 생성물 diff를 확인하고 필요한 변경만 commit하세요.
Field, Select, DatePicker, `pyd-tokens`는 별도 Vite 소비자에서 실제
`shadcn add`, import, typecheck, build를 확인했습니다. 빌드 산출물의
`registryDependencies`는 `PYDEMIA_REGISTRY_BASE_URL`을 기준으로 URL로
바뀌며 기본값은 공개 Vercel 주소입니다. 로컬 소비자 검사는 이 환경
변수를 `http://127.0.0.1:5173/r/`로 지정해 빌드한 뒤 실행했습니다.
나머지 35개에 대한 소비자 설치는 아직 실행하지 않았습니다.
이번 확장에서 390px 화면과 주요 키보드·focus 동작을 Chromium으로
확인했습니다. 실제 screen reader 검증과 전체 WCAG audit은 남아 있습니다.

GitHub `pydemia/ui`의 `main`에 push하면 Vercel 프로젝트 `pydemia-ui`가
`vercel.json`에 따라 `npm ci`, `npm run build`를 실행해 `docs/`를 게시합니다.
`ui.pydemia.ai`는 Vercel에 등록했으나 Squarespace DNS 전환이 아직 확인되지
않았습니다. 기존 GitHub Pages 설정과 `docs/CNAME`은 전환 전 상태로 남아
있으므로 component 확장 작업에서 도메인 설정을 임의로 변경하지 마세요.

작업 시작 시 저장소의 `README.md`, 위 `research/` 문서, 관련 component 및
registry metadata를 먼저 읽으세요. 새 source를 편입할 때는
`software-engineering`, `reference-research`, `product-ui-ux-design`,
`frontend-design-workflow`, `frontend-development` 중 해당 작업에 필요한
pydemia skill의 실제 원문도 확인하세요.
