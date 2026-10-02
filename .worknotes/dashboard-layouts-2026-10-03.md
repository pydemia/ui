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
PR CI·preview 배포·production 공급은 아직 확인하지 않았습니다.
저장소는 133개 component·135개 item·61개 snapshot의 후보이고,
마지막 공개 확인 기준 사이트는 130개·132개·58개입니다.
Goal 관리용 추정은 약 97%로 유지합니다.
