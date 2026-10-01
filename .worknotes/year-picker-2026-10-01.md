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

## 공개 검증

- PR #36의 Verify UI와 병합 commit
  `5ac0de7a34eb4477c301cf59a79b7e2d7ee9eaeb`의 Verify UI·Pages가
  통과했습니다. Vercel production
  `dpl_6epr2ERCA5VNw3MDwSayfgAnEkbW`는 READY입니다.
- 공개 25번째 snapshot의 manifest, YearPicker, Popover, tokens
  JSON이 HTTP 200으로 응답했습니다. `shadcn@4.0.0 add`로
  YearPicker와 tokens를 별도 Vite 소비자에 설치했습니다. 설치된
  YearPicker·Popover·utils·tokens·MIT 고지 5개 파일이 공개 JSON
  원본과 줄바꿈 정규화 뒤 일치합니다. 소비자 typecheck·build가
  통과했습니다.
- 소비자 390px Chromium에서 `0001`의 선택 상태와 이전 이동
  비활성화를 확인했습니다. 같은 연도를 다시 눌러 선택을 지우자
  FormData가 빈 문자열이 됐습니다. Space로 `0012`, Enter로
  `2028`을 고른 뒤 제출값이 `2028:0012`가 됐습니다. `0013` 이후는
  비활성화됐고 가로 overflow와 page error는 없었습니다.
- 공개 문서의 YearPicker preview와 Usage 코드가 표시되고 page
  error가 없었습니다.

소비자 fixture:
`C:\Users\pydemia\AppData\Local\Temp\pydemia-year-picker-public-consumer-20261001`.
완료 기준 goal 관리용 추정은 **약 80% → 약 81%**입니다. 연도만
선택·제출하는 독립 용례가 공개 설치까지 확인되어 Date & time의
남은 사용 사례 하나를 닫았습니다. 현재 106개 component·108개
registry item·25개 snapshot이며 라이브러리 과제 완료 5·부분 4·
미검증 1은 그대로입니다. 실제 screen reader·touch·Safari·RTL과
과거 배포 rollback은 실행하지 않았습니다.
