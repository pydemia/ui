# Component 공급 Goal 범위 점검 — 2026-10-03

## 83번째 release 기준 재확인

2026-10-03 현재 `npm run registry:release-check`가 144개 component
export·catalog entry, 146개 registry item, 83개 불변 release와 현재
빌드의 일치를 확인했습니다. 공개 사이트에서 `AppShell`, `Navigation`,
`Sidebar`, `Dashboard`, `LogConsole`, `DataChart`, `PageHeader`,
`ContentList`, `AlertDialog`, `Spinner`의 현재 item이 모두 HTTP 200입니다.

공개 AppShell preview에는 전역 탐색, 측면·하단 패널과 floating 도움말,
골격·패널·버튼 형태 선택이 있습니다. 도움말을 열어 패널과 닫기
버튼이 표시되는 것을 확인했습니다. 공개 Spinner preview·Usage에는
icon·ring·dots·bars·orbit가 있고 MetricCard에는 기본·compact·
featured가 있습니다. Operations workspace에서 기간을 최근 7일에서
최근 4주로 바꾸자 요청 지표가 1,284→5,031, 완료 지표가
1,216→4,842로 바뀌고 차트 구간도 요일에서 주차로 바뀌었습니다.
따라서 Goal에 명시된 화면 범주와 대표 복합 화면은 현재 공개 상태에서
직접 확인했습니다.

최신 Dialog 크기 변경 PR #156은 `main`에 병합됐고 PR·`main`의
Verify UI와 Pages가 통과했습니다. 83번째 manifest는 GitHub raw에서
HTTP 200이지만 `ui.pydemia.ai`에서는 HTTP 404입니다. Vercel
production은 여전히 82번째 release의 `82b760b7`을 가리키며,
최신 Dialog preview의 공개 공급은 완료되지 않았습니다. 병합 commit
`78af088d`의 GitHub Vercel status는 `failure`이며 설명은
`Deployment rate limited — retry in 24 hours.`입니다. 계정 로그인은
필요하지 않습니다. 이 상태를 component 품질 실패로 세지 않습니다.
Goal 관리용 추정은 약 99%로 유지합니다. 실제 screen reader·touch·
Safari·RTL의 전수 동작은
이번 재확인에서 실행하지 않았습니다.

후속 판정: 아래 점검 당시에는 rollback 중 이전 snapshot URL 보존을
이유로 Goal 완료를 보류했습니다. 현재
[품질 판정](quality-gate-level-review-2026-10-03.md)은 이를 별도 운영
위험으로 추적하고 Goal 완료율의 필수 체크박스로
사용하지 않습니다. 아래 표의 실제 화면·공급 검증 결과는 유지합니다.

## 후속 공개 확인

75번째 릴리스가 Vercel production 배포
`dpl_7eqSffEpoZco4hUB1u7ofdyJgBTj`로 공개됐습니다. 현재 registry,
75번째 manifest, snapshot Button·token, 의존 도메인의 utils가
HTTP 200이고 저장소 JSON과 일치합니다. 아래의 404는 점검 당시
상태입니다. Goal 관리용 추정은 약 99%이며, 이전 배포로 rollback할
때 새 snapshot URL을 유지하는 방법은 남아 있습니다.

Goal은 중급 이상 복잡도의 frontend 화면을 pydemia/ui의 ready-made
component와 디자인으로 쉽게 구성하는 것입니다. 약 100개는 목표
수량이 아닙니다. 이번 점검은 현재 코드·생성물·공개 사이트를
대조했으며 새 component를 추가하지 않았습니다.

| 요구 범위 | 확인한 근거 | 판정 |
| --- | --- | --- |
| 다양한 범주 | `registry:release-check`가 143개 component export/catalog와 145개 registry item을 대조. 공개 catalog도 143개를 표시하며 component는 16개 범주에 분포 | 현재 사용 가능 |
| 전역·측면 탐색, 좌우·하단 panel, floating panel·bubble | `Navigation`·`Sidebar`·`AppShell` export와 공개 Usage·preview. 공개 AppShell에서 pill, inset 두 panel, 도움말 열기·Escape 닫기를 실행 | 현재 사용 가능 |
| 분석 화면, log console, graph, dashboard | `Dashboard`·`DataChart`·`LogConsole`과 20개 분석 범주의 catalog. 공개 Operations workspace에서 기간 변경 시 지표·chart 값이 함께 갱신됨 | 현재 사용 가능 |
| 제목·부제목·bullet·alert popup | `PageHeader`, `BulletChart`, `AlertDialog`의 export·registry 경로·Usage 확인 | 현재 사용 가능 |
| 여러 디자인과 spinner | Spinner의 icon·ring·dots·bars·orbit 다섯 형태를 공개 preview·Usage에서 확인. AppShell framed/canvas, attached/inset, bubble circle/pill 선택 제공 | 현재 사용 가능 |
| 복합 화면 조합 | 공개 snapshot의 13개 item을 설치한 별도 소비자에서 탐색·분석·게시판·대댓글·modal·floating 도움말의 typecheck·build와 Chromium 동작을 확인한 [기존 기록](public-composite-consumer-2026-10-03.md). 공개 Operations·Review workspace도 로딩됨 | 대표 사례 검증 |

이번 작업에서 `npm run typecheck`, UI 테스트 265/265,
`npm run build`, `npm run registry:release-check`를 실행해 통과했습니다.
공개 사용자 도메인의 `pyd-app-shell`, `pyd-navigation`,
`pyd-dashboard`, `pyd-log-console`, `pyd-bullet-chart`,
`pyd-page-header`, `pyd-alert-dialog`, `pyd-spinner` 현재 item은
각각 HTTP 200입니다. 공개 catalog의 AppShell과 Spinner preview,
Operations workspace의 기간 전환을 브라우저에서 확인했습니다.
빌드가 다시 생성한 추적 파일은 검사 후 원래 내용으로 복원했습니다.

점검 당시 공개 registry와 74번째 snapshot manifest는 HTTP 200,
75번째 snapshot manifest는 `ui.pydemia.ai`에서 HTTP 404였습니다.
이 snapshot은 component 추가가 아닌 shadcn 출처 고지 범위 변경을
담습니다. 이후 위의 production 배포로 공개됐습니다. 이전 배포로
rollback했을 때 새 불변 URL을
보존하는 방법도 [기존 조사](quality-legacy-2026-09-29.md)에
미완료로 남아 있습니다. 따라서 Goal 완료 판정은 보류합니다.

실제 screen reader·touch·Safari·RTL의 전수 동작도 검증하지
않았습니다. 이번 점검의 공개 브라우저 확인은 위에 적은 흐름에만
해당합니다. 다음 공급 작업은 불변 URL 보존 범위의 구체화입니다.
