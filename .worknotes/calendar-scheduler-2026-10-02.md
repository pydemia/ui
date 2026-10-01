# CalendarScheduler 편입 작업

2026-10-02. 공개 기준은 113개 component·115개 registry item·
32개 snapshot, goal 관리용 추정 약 88%입니다. 로컬에는
`CalendarScheduler`를 더해 114개 component·116개 item이 있습니다.
브라우저와 공개 검증 전까지 goal 추정은 유지합니다.

## 선정과 API

기존 `Calendar`는 날짜를 고르지만 날짜별 일정 건수와 당일 안건을
표시하지 않습니다. 팀 운영·예약·마감 화면에서는 이 조합과 선택·추가
callback이 반복되므로 handoff의 `CalendarScheduler` 후보를
원본 component로 구현했습니다. 외부 일정 component 코드는
복사하지 않았습니다. `Calendar`·`Button`·`utils`와 DayPicker의 공개
날짜 이름 함수를 사용합니다. 새 npm 의존성은 없습니다.

`initialDate`가 초기 날짜·월을 고정하며, `selectedDate`가 있으면
호출자가 날짜를 소유합니다. 일정은 고유 ID, `YYYY-MM-DD`, 제목을
필수로 받고 시간은 같은 시간대의 `HH:mm`으로 지정합니다. 시간이
있으면 IANA `timeZone`이 필요합니다. 일정 날짜의 버튼 이름에 건수를
추가하고, 선택 날짜의 목록을 시간·ID 순으로 표시합니다. 저장·권한·
시간대 변환은 호출자가 맡습니다. [출처](../research/source-inventory.md)와
[동작 규칙](../research/design-contract.md)을 함께 갱신했습니다.

## 검증과 인계

- `npm run typecheck` 통과.
- UI 테스트 141/141, 신규 SSR 3건 통과.
- `npm run build` 통과, 116개 registry item과 문서 preview 생성.
- `npm run registry:check`는 provenance 고지의 SHA-256이 이전 값이라
  실패. 소스 commit 이후 핀 갱신과 snapshot이 필요합니다.
- Browser Use의 localhost 탐색은 `ERR_BLOCKED_BY_CLIENT`, Windows
  Computer Use는 현재 URL 확인 불가로 종료됐습니다. 이 경로를
  우회해 UI 조작을 재시도하지 않았습니다.

다음 작업은 날짜·월 탐색, 일정 선택·추가, 390px와 focus의 실제
브라우저 검사입니다. 해당 검증 전에는 공급 완료로 표시하지 않습니다.
실제 screen reader·touch·Safari·RTL, 개별 소비자 CLI 설치,
공개 URL과 rollback 뒤 snapshot URL 보존도 미검증입니다.
