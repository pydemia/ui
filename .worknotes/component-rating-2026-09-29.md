# Rating 편입

2026-09-29. Inputs에 `Rating`을 추가했습니다. 로컬 작업 트리는 80개
component와 82개 registry item입니다. 사용자 입력에서는 같은 이름의
native radio 1~5개가 한 값을 제출하고, 읽기 전용 상태는 값과 최대치를
텍스트로 표시합니다. `stars`와 `segments`는 같은 입력 동작을 공유합니다.

## Source와 결정

- [W3C WAI Rating Radio Group 예시](https://www.w3.org/WAI/ARIA/apg/patterns/radio/examples/radio-rating/)의
  점수 선택과 방향키 동작을 확인했습니다. 예시 source는 복사하지 않고
  native `<fieldset>`·`<legend>`·`<input type="radio">`로 직접
  구현했습니다. 외부 component revision·LICENSE 편입은 없습니다.
- [MDN radio 문서](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/radio)에서
  같은 `name`을 가진 radio의 form 값과 `required` 동작을 확인했습니다.
- 기본 최대치는 5점이며 1~10점으로 바꿀 수 있습니다. 0은 미선택
  상태입니다. 점수와 최대치는 정수 범위를 검사하고 controlled 값에는
  변경 callback을 요구합니다. 읽기 전용 상태는 form control을 만들지
  않으며 `name`·`required`와의 동시 사용을 거부합니다.
- 별점과 숫자 segment에 공통 색상·크기 token을 사용합니다. 직접
  registry 의존성은 `pyd-utils`이고 새 npm dependency는 없습니다.

## 검증

- `npm test -w @pydemia/ui`의 9개 검사, `npm run typecheck`,
  `npm run build`, `npm run registry:check`가 통과했습니다. 문서 앱
  빌드에는 500 kB 초과 chunk 경고가 있습니다.
- 문서 Chromium에서 필수값이 없는 제출의 차단, ArrowRight 점수 변경,
  label click, `FormData` 제출, 두 variant와 읽기 전용 표시를
  확인했습니다. 숨긴 radio 자체를 Playwright로 click했을 때는
  값이 바뀌지 않았으나 사용자가 누르는 시각 label click은 동작했습니다.
- `%TEMP%/pydemia-ui-rating-consumer-20260929`에 shadcn CLI로
  `pyd-rating`, `pyd-utils`, `pyd-tokens`를 설치했습니다. component
  source SHA256이 원본과 같고 typecheck·build가 통과했습니다.
  소비자 Chromium에서 빈 제출 차단, 방향키로 3점 선택, 제출 값 3과
  console error 0건을 확인했습니다.
- 소비자 fixture의 Vite를 7.3.6으로 갱신한 뒤 `npm audit`은 dev
  dependency까지 포함해 취약점 0건이었습니다. 갱신 전의 Vite
  7.1.3에는 high 취약점 1건이 있었습니다. 이 fixture의 버전 변경은
  저장소 의존성을 변경하지 않습니다.

실제 screen reader 발표, touch, 다른 브라우저, 좁은 화면은 확인하지
못했습니다. 82개 registry item의 새 동시 설치와 공개 배포도 이번에는
반복하지 않았습니다. push·배포는 하지 않았습니다.
