# NumberInput 추가

2026-09-29. Inputs 범주의 숫자 입력을 `@pydemia/ui`, 내부 registry,
문서 preview에 추가했습니다. 로컬 작업 트리는 74개 component와
공용 item 2개를 포함한 registry 76개 item입니다. 공개 배포는 하지
않았습니다.

## 구현 결정

- `number | null` 확정 값과 편집 중 문자열을 분리합니다. 잘못된 문자열은
  이전 확정 값을 바꾸지 않으며 오류를 표시하고 제출을 막습니다.
- locale 표시에는 `Intl.NumberFormat`을 쓰고 Latin 숫자를 입력받습니다.
  form 값은 locale과 무관한 숫자 문자열입니다. 지수 표기와 독자적인
  고정 소수점 정밀도는 지원 범위에 넣지 않았습니다.
- `step`은 버튼·방향키의 증감 폭이며 입력값을 step 배수로 반올림하지
  않습니다. min/max를 벗어난 입력은 확정하지 않습니다.
- 기존 `Input`을 재사용합니다. 신규 외부 package는 없고 registry는
  `pyd-input`을 의존성으로 설치합니다. 원본 소스와 MIT 고지는
  `research/source-inventory.md`에 구분해 기록했습니다.
- `field`와 `stepper`는 동일한 spinbutton·form 규칙을 사용합니다.

## 확인 결과

- 문서 Chromium에서 `ko-KR`·`de-DE` 형식, `1.234,5` 제출값
  `1234.5`, 잘못된 grouping·상한·하한·필수값 오류를 확인했습니다.
  유효하지 않은 값을 제출해도 이전 제출 상태가 유지됩니다.
- ArrowUp/Down은 0.5씩 이동하고 Home/End는 0·10000으로
  이동합니다. 상한에서 증가 버튼이 비활성화됩니다. `field` 변형은
  증감 버튼만 숨기고 같은 값이 제출됩니다.
- 새 Vite fixture
  `%TEMP%/pydemia-ui-number-input-consumer-20260929`에서 로컬
  registry URL로 설치했습니다. NumberInput·Input·utils·tokens·
  MIT 고지 5개 파일이 생성됐고 NumberInput 소스가 원본과 일치합니다.
  소비자 typecheck·build와 Chromium의 제출·무효값·ArrowUp 동작을
  확인했으며 console error는 없습니다. 소비자 runtime dependency의
  `npm audit --omit=dev --audit-level=high`는 0건입니다.
- `npm run typecheck`, 기본 공개 URL의 `npm run build`,
  `npm run registry:check`, `git diff --check`가 통과했습니다.
  두 registry 출력에 로컬 URL이 남지 않았습니다. 빌드의 큰 JS chunk
  경고는 남아 있습니다.

screen reader, 다른 브라우저, 모바일 숫자 키보드, 전체 registry item의
새 프로젝트 설치와 공개 배포는 검증하지 않았습니다.
