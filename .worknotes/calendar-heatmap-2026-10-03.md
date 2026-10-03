# CalendarHeatmap 작업 기록

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
아직 확인하지 않았습니다. 적용한
[공급·품질 기준](quality-checklist-decision-2026-10-03.md)은
component별 수동
검사 횟수를 고정하지 않고 변경한 동작의 증거를 사용합니다.

Goal 관리용 추정은 약 98%로 유지합니다. 로컬 후보는 143개
component·145개 registry item이며 공개 확인은 142개·144개입니다.
