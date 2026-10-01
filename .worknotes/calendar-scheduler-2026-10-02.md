# CalendarScheduler 편입 작업

## 후속 브라우저 검증과 snapshot 정리

2026-10-02. commit `3cc7d4b`의 Vercel preview를 390px Chromium에서
확인했습니다. 월 이동 버튼과 월 이름이 한 줄에 놓입니다. 날짜 선택,
일정 선택·추가, 빈 날짜, 다음 달의 건수, ArrowRight·Enter 선택과
선택 뒤 상태 문구 갱신을 실행했습니다. light·dark를 보던 중
`Calendar`의 DayPicker chevron SVG가 dark에서 검게 렌더링되는
결함을 발견해 `fill-current`를 적용했습니다. 이 마지막 색상 수정은
아직 새 preview에서 시각 확인하지 않았습니다.

수정 전 draft의 중간 snapshot 세 개는 `main`에 공개된 적이
없습니다. 소스 수정 뒤 provenance 고지를 commit `67ba3c2`와
metadata SHA-256으로 다시 고정했습니다. 최종 내용의
`sha256-fd8ec05551fcbcbd9b62148bbf3e926af4025719d0ecf30290130adf1ee52529`
하나만 PR diff에 남기도록 중간 경로를 정리했습니다. 공개 기준
32개에 새 후보 하나를 더한 33개입니다. `npm run typecheck`, UI 테스트
143/143, `npm run build`, `registry:release-check`가 통과했습니다.
116개 item·114개 export/catalog, 33개 snapshot을 확인했습니다.
수정 commit의 CI·새
preview와 production 공개는 아직 미검증입니다.
공개 기준 113개 component·115개 item, goal 약 88%를 유지합니다.

2026-10-02. 공개 기준은 113개 component·115개 registry item·
32개 snapshot, goal 관리용 추정 약 88%입니다. 로컬에는
`CalendarScheduler`를 더해 114개 component·116개 item이 있습니다.
실제 브라우저 표시와 공개 검증 전까지 goal 추정은 유지합니다.

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
- UI 테스트 143/143, 신규 SSR 3건과 client DOM 2건 통과.
- client DOM에서 날짜·월 이동, 일정 선택·추가 callback, controlled
  날짜 갱신을 실행했습니다. `jsdom@26.1.0`은 테스트 전용 의존성이고
  Node.js 18 이상을 지원해 README의 Node.js 22 이상 범위에 맞습니다.
- `npm run build` 통과, 116개 registry item과 문서 preview 생성.
- 첫 `npm run registry:check`는 provenance 고지의 이전 SHA-256으로
  실패했습니다. 소스 commit `390d9bb`에 고지 commit·해시를 고정한
  뒤 통과했습니다.
- 33번째 snapshot
  `sha256-d5b1be19e7e59cb89730fbb44ff2feea7487d1a7e775d37720c4a1ad65f5a119`을
  만들고 재빌드 뒤 `registry:release-check`가 116개 item·114개
  export/catalog와 현재 산출물을 확인했습니다.
- Browser Use의 localhost 탐색은 이번에도 `ERR_BLOCKED_BY_CLIENT`로
  차단됐습니다. 앞선 Windows Computer Use는 현재 URL 확인 불가로
  종료됐습니다. 다른 경로로 UI 조작을 우회하지 않았습니다.

날짜·월 탐색과 일정 선택·추가의 client DOM 동작은 확인했습니다.
390px 배치·실제 focus·실제 브라우저 preview는 미검증입니다.
원래 goal에 포함된 관련 브라우저 검증과 공개 검증이 남아 있으므로
공급 완료로 표시하지 않습니다.
실제 screen reader·touch·Safari·RTL, 개별 소비자 CLI 설치,
공개 URL과 rollback 뒤 snapshot URL 보존도 미검증입니다.

## Draft PR

[PR #56](https://github.com/pydemia/ui/pull/56)을 draft로 열었습니다.
source·snapshot commit은 `390d9bb`·`4ee1f99`입니다. PR Verify UI
run 36926628773이 당시 typecheck·UI 테스트·build·release 검사와
생성 `docs/` 일치를 통과했습니다. client DOM 테스트 commit
`5fbe530`의 Verify UI run 36929134624도 통과했습니다. 실제 브라우저
동작이 미검증이므로 ready 전환·병합·production 공개는 보류합니다.
