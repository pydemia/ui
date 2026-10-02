# Dashboard 배치 선택

2026-10-03. 지표가 3개일 때 기존 `DashboardMetrics`의 4열 배치에는
빈 칸이 남고, 차트와 로그를 같은 폭으로 놓으면 차트가 좁아집니다.
`columns={2|3|4}`와 `DashboardPanels layout="primary"`를 추가했습니다.
기본값 4열·균등 2열은 유지하며 container가 좁으면 한 열로 쌓입니다.
별도 component·registry item이나 npm dependency는 추가하지 않았습니다.
`Dashboard`는 pydemia/ui 원본 구현이므로 새 upstream 코드 도입은
없습니다.

문서의 Dashboard preview에서 균형 배치와 분석 중심 배치를 전환하고,
Usage에는 3열 지표·차트+로그 조합을 넣었습니다. 설치 목록에 예시가
실제로 쓰는 `log-console`도 포함했습니다.

`npm run typecheck`, `npm run build`, `npm run registry:check`,
`npm run registry:release-check`가 통과했습니다. 새 61번째 snapshot은
`sha256-af13b7586eec2658f753cdee20bf904f998b264c628b13725c45eadac01dc010`이고
현재 135개 registry item과 일치합니다. 이전 snapshot과 파일 본문을
대조하면 변경된 item은 `pyd-dashboard`뿐입니다.
나머지 JSON의 release URL 차이는 새 snapshot ID를 가리키기 때문입니다.
문서 preview의 852px container에서
기본 4열 지표·균등 2열과 분석 중심 3열 지표·약 2:1 panel 폭을
브라우저의 실제 계산값으로 확인했습니다. 390px에서는 모두 한 열이며
문서 전체의 가로 넘침이 없었습니다. page error와 Vite overlay는
없었습니다.

실제 screen reader 발표와 다른 브라우저는 검증하지 않았습니다.
PR #107의 Verify UI run `37058414243`과 preview 배포는 성공했습니다.
Preview의 문서 HTML·현재 `pyd-dashboard.json`·61번째 snapshot
manifest는 HTTP 200입니다. PR은 `main`의 `f3a01620992d9979df3688f96e28b392f0365577`로
병합됐고 Pages run `37058835322`와 `main` Verify UI run
`37058836209`는 성공했습니다.

Vercel은 병합 commit의 production 빌드를 배포 횟수 제한으로
거절했습니다. 사용자 도메인의 `pyd-dashboard.json`은 기존 구현이고
앞서 추가한 분석 item 세 개는 각각 HTTP 404입니다. 저장소는
133개 component·135개 item·61개 snapshot이며 마지막 공개 확인
기준 사이트는 130개·132개·58개입니다. 배포 제한 해제 뒤 공개
manifest와 `pyd-dashboard.json`, 분석 item 세 개, 61번째 snapshot의
대표 URL을 확인해야 합니다.
Goal 관리용 추정은 약 97%로 유지합니다.
