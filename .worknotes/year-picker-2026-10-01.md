# YearPicker

시작 기준: 105개 component·107개 registry item·24개 snapshot,
goal 관리용 추정 약 80%, 라이브러리 과제 완료 5·부분 4·미검증 1.

연간 보고·예산의 연도 하나를 선택해 제출하는 용례로 판정했습니다.
기존 `MonthPicker`는 월까지 고르게 하므로 연도만의 값·범위·탐색
규칙을 가진 별도 `YearPicker`를 추가합니다. 내부에서는 기존
`Popover`와 token을 사용합니다. 상태·입출력 규칙은
[design contract](../research/design-contract.md)에, upstream·LICENSE·
의존성 검토는 [source inventory](../research/source-inventory.md)에
기록했습니다.

로컬 구현의 typecheck와 SSR 테스트 2/2가 통과했습니다. 390px
Chromium에서 2020·2030년대 이동, min/max 밖 연도·이동 버튼의
비활성화, Enter·Space 선택, form 제출 `2033`, 초기화 후 빈 값
오류를 확인했습니다. 선택과 Escape 뒤 trigger focus 복귀, light/dark
표시, 가로 overflow 없음, page error 0건도 확인했습니다.

최종 코드의 UI 테스트 118/118과 전체 build도 통과했습니다. MIT
고지의 provenance revision·SHA-256을 source commit
`fa92dbafb8a7d4ea9f9cebeaa41818f9616aec3b`에 고정했습니다.
`registry:check`가 108개 item·106개 export/catalog와 기존 24개
snapshot을 확인했습니다. 새 25번째 snapshot ID는
`sha256-9359658dc14d7054deddfe546fefde00b784bb50c163c93de8a883ab1610d9a8`입니다.
재빌드 뒤 `registry:release-check`가 현재 빌드와 ID 일치를
확인했습니다. 공개 소비자 설치는 배포 후 확인합니다.
실제 screen reader·touch·Safari·RTL은 미검증입니다.
