# CalendarHeatmap 작업 기록

## 공개 확인

2026-10-03. 사용자 도메인의 현재 registry는 145개 item을 제공하고,
`pyd-calendar-heatmap.json`, 74번째 manifest와 해당 snapshot
item이 모두 HTTP 200입니다. 응답 JSON은 저장소의 게시 파일과
일치합니다. registry 의존 경로의 `pydemia-ui.vercel.app`
item도 HTTP 200입니다. 이전 절의 404는 당시 배포 상태입니다.
공개 확인 수량은 143개 component·145개 item입니다.
Goal 관리용 추정은 약 98%입니다.

## 병합 후 상태

PR #133은 `65e330c16253c614b5963675980ea7999869c983`로
`main`에 병합됐습니다. PR과 `main`의 Verify UI가 모두 통과했고
Pages도 성공했습니다. Vercel production은 배포 횟수 제한으로
실패했습니다. 현재 `ui.pydemia.ai`의 새 item과 74번째
manifest, `pydemia-ui.vercel.app`의 item은 HTTP 404입니다.
이는 공개 대기이며 새 component를 공개 공급 수량에 반영하지
않습니다. 공개 확인은 142개 component·144개 item이고
Goal 관리용 추정은 약 98%입니다.

날짜별 활동량은 임의의 두 범주를 비교하는 `Heatmap`으로 표현하기
어려워 별도 component로 편입했습니다. 연도와 희소 날짜 목록을 받아
주·요일 격자를 계산합니다. 빠진 날짜는 0, 명시적인 `null`은
미수집이며 빈 목록은 빈 상태입니다. `compact`·`comfortable`과
`panel`·`plain`은 같은 데이터의 표시 선택입니다. 정확한
365/366일 값은 펼칠 수 있는 native table로 제공합니다.

원본 React·Tailwind 구현입니다. 새 npm 의존성은 없고 registry는
기존 `pyd-utils`에 의존합니다. 외부 component 코드를 편입하지
않았습니다. W3C WAI의 complex image 안내를 참고했으며 소스는
복사하지 않았습니다. 색은 공통 token을 사용합니다.

## 확인한 범위

- 대상 SSR 테스트 5/5: 윤년, 0·미수집·희소 날짜, 빈 목록,
  평년·외형, 잘못된 날짜·값·척도, 큰 유한 값.
- UI 전체 테스트 265/265, `npm run typecheck`, `npm run build`,
  PRISM 25/25 및 Usage 예제 11개 typecheck 통과.
- 로컬 Chromium 408px: preview·Usage·metadata, 366개 셀,
  내부 방향키 가로 스크롤, `plain` 전환, 날짜별 값 표와 빈 상태.
  page error 0건, 문서 가로 넘침 없음.

실제 screen reader·touch·Safari·RTL은 실행하지 않았습니다.
registry 고지 hash 갱신, snapshot, PR CI와 공개 공급 경로는
처음 로컬 검사에서는 확인하지 않았습니다. source commit
`81d4c45e1497e38c983656ea472f6f2a1dcd42ae`를
provenance 고지에 고정한 뒤 `registry:release-check`가 145개
item·143개 export/catalog와 74개 snapshot의 현재 일치를
확인했습니다. 현재 ID는
`sha256-5b2308017e3b8a975e9ffdd15ed520e79b7640e079ba824eb30084e2b9537b76`입니다.
PR CI와 공개 공급 경로는 남았습니다. 적용한
[공급·품질 기준](quality-checklist-decision-2026-10-03.md)은
component별 수동
검사 횟수를 고정하지 않고 변경한 동작의 증거를 사용합니다.

Goal 관리용 추정은 약 98%로 유지합니다. 로컬 릴리스 후보는
143개 component·145개 registry item이며 공개 확인은
142개·144개입니다.
