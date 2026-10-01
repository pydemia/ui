# 공급·품질 체크리스트 적용 범위 재검토

이 문서의 `CalendarScheduler` 미검증 상태는 당시 draft 기준입니다.
후속 검증과 공개 결과는
[편입 작업 기록](calendar-scheduler-2026-10-02.md)을 참고하세요.

2026-10-02. 공개 기준은 113개 component·115개 registry item·32개
snapshot입니다. 이 검토는 출시 판단 문구만 조정합니다. 기능·검사
코드·배포 결과를 바꾸지 않으며 goal 관리용 추정은 약 88%입니다.

## 확인한 경직성

기존 판정에는 새 component의 `상태 소유`와 focus·실제 배치의
브라우저 실행이 넓게 적혀 있습니다. 상태가 없는 표시 component도
독립 사용처가 있을 수 있습니다. 기존 `Calendar`·`Button`을 조합한
component가 focus 동작을 바꾸지 않았다면 그 상속된 동작을 매번
브라우저에서 다시 확인할 이유는 없습니다. 반면 callback을 추가한
component의 SSR 출력 검사만으로 날짜 선택·event 선택이 실제로
작동한다고 판단할 수는 없습니다.

`Verify UI`는 PR과 `main` push에서 typecheck, UI 테스트, build,
`registry:release-check`, 생성된 `docs/` diff를 검사합니다. 이 결과를
인정하고, 추가 실행은 변경된 동작의 위험에 맞춥니다. handoff의 QA
목록도 각 component에 **가능한 범위**에서 적용한다고 명시합니다.

## 적용 기준

- 공통: 새 component의 실제 사용처·기존 API 중복 여부, 적용되는
  동작·기본 접근성, export·registry·출처·동작하는 preview·Usage를
  확인합니다.
  코드·registry 변경은 공개할 commit의 CI를 확인합니다. 외부 코드의
  공식 문서·동일 revision 소스·LICENSE·의존성은 실제로 도입할 때
  확인하며 기존 조사 결과를 재사용합니다.
- 핵심 상호작용: 값·callback·form·keyboard가 바뀌면 그 흐름을
  **실제로 실행하는** 자동 테스트 또는 브라우저 검사를 하나 둡니다.
  정적 SSR은 출력만 검증합니다. 회귀 결함은 실패를 재현한 경로를
  수정판에서 다시 확인합니다.
- 브라우저 의존 동작: 새 focus 이동, pointer 좌표, browser API,
  component의 핵심 반응형 배치를 바꾸면 해당 환경에서 검사합니다.
  기존 component의 검증된 동작을 그대로 사용하는 경우에는
  반복하지 않습니다. 시각 변경은 사용성에 영향을 주는 폭·theme만
  확인합니다.
- 공급: 설치 형식·target·의존 경로가 새로우면 별도 소비자 설치를
  검사합니다. registry 공개 시에는 릴리스 묶음의 snapshot과 변경
  item URL을 확인합니다. 표준 item마다 설치하거나 같은 동작을
  로컬·공개 사이트에서 반복하지 않습니다.

CI 실패, 필수 고지·설치 실패, 확인된 값 손실·제출 오류·keyboard
접근 불가, 변경한 핵심 흐름의 실행 증거 부재는 공급 완료를
막습니다. browser 의존 동작이 component의 핵심인데 실행하지
못한 경우도 같습니다. 실제 screen reader·touch·Safari·RTL 등
적용되지 않는 환경은 미검증으로 구분하고 지원을 주장하지 않습니다.

## 현재 draft에 적용

`CalendarScheduler`의 SSR 3건은 날짜별 건수·시간순 목록·잘못된
입력 거부를 확인했습니다. 날짜 선택, 월 탐색, event 선택·추가
callback은 실행하지 못했습니다. 이 핵심 흐름은 client DOM 테스트
또는 브라우저 검사로 확인해야 합니다. 390px 시각 배치와 실제
focus는 미검증으로 남기되, 기존 `Calendar`의 focus 동작을 그대로
사용하는 이 조합에서 별도의 차단 조건으로 세지 않습니다.
draft PR #56의 CI가 통과했어도
현재는 공급 완료로 계산하지 않습니다. 기준 조정으로 기존
미검증 항목을 통과로 바꾸지 않았습니다.
