# Component 공급 Goal 범위 점검 — 2026-10-03

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
