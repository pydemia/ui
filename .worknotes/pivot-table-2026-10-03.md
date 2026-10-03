# PivotTable 작업 기록

2026-10-03. `Heatmap`은 호출자가 계산한 교차값을 색과 숫자로 표시하고,
`DataTable`은 원래 행을 검색·정렬합니다. 지역×채널처럼 원자료를 두
범주로 묶어 합계까지 읽는 화면에는 별도 `PivotTable`이 유용합니다.
단일 행·열 범주와 합계까지만 맡고, 축 선택·요청·저장은 호출자가
관리합니다. 신규 수량은 이름만 늘리기 위한 것이 아니라 집계 책임을
제공합니다.

입력 순서의 두 축과 기록을 받아 같은 교차점의 값을 더합니다. 없는
기록은 0, 명시적인 `null`은 미수집입니다. 미수집이 섞인 교차점과
관련 합계는 미수집으로 표시합니다. 잘못된 ID·중복 축·비유한 값·
합계 overflow는 거부합니다. native table의 행·열 머리글과 caption,
focus 가능한 가로 스크롤을 사용합니다. `panel`·`plain`은 같은 값을
표시합니다. 원본 React·Tailwind 코드이며 새 npm 의존성은 없습니다.

현재 로컬 139개 component·141개 registry item 후보입니다.
`npm run typecheck`, 대상 테스트 5/5, 전체 UI 테스트 247/247,
`npm run build`가 통과했습니다. Chromium 390px에서 실제 표의
15·9·24 합계, 미수집 전환과 합계 전파, 빈 상태·plain 전환,
문서 가로 넘침 없음과 page error 0건을 확인했습니다. 실제 screen
reader 발표·touch·Safari·RTL은 적용 범위 밖이며 실행하지 않았습니다.

첫 `registry:check`는 새 provenance SHA-256과 기존 소비자 고지가 달라
중단됐습니다. metadata를 포함한 commit
`3523fc1cba5d8a590a821567071ec5db0bfdb5ec`에 고지 링크를 고정하고
LF SHA-256을 갱신했습니다. 이후 `registry:check`와
`registry:release-check`가 통과했습니다. 70번째 snapshot은
`sha256-32c8c4110dd838fedd10716915c72849dd5e35f6977b0dbd010fe9a559d507b9`이며
141개 item·139개 export/catalog와 70개 불변 snapshot의 정합성을
확인했습니다. PR CI와 공개 배포는 아직 확인하지 않았습니다.
Goal 관리용 추정은 약 98%로 유지합니다.

`main`의 PRISM 공급 작업이 PR 작성 뒤 병합되어 작업 브랜치에
통합했습니다. Windows checkout의 CRLF가 PRISM registry 내용과
source hash를 바꾸던 부분은 생성기·검사기에서 LF로 읽게 했고,
복사한 PRISM 페이지의 HTML도 기존 페이지처럼 LF로 저장합니다.
통합 후 typecheck, UI 테스트 247/247, PRISM 테스트 23/23,
`registry:release-check`가 통과했습니다. 공개 준비 PR #125의 CI와
production 경로는 별도로 확인합니다. 이 줄바꿈 문제는
[체크리스트 판정](quality-checklist-decision-2026-10-03.md)에서
component 동작 품질과 구분했습니다.
