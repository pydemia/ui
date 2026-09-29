# TimePicker 작업

2026-09-29. Date & time 범주에 `TimePicker`를 추가했습니다. 로컬 작업
트리는 81개 component, 83개 registry item입니다.

## 구현

- `value`는 `HH:mm` 또는 `null`인 controlled 입력입니다. 표시 방식은
  locale에 맞춰 12/24시간제로 바꾸되 form에는 하나의 `HH:mm` 값을
  전달합니다.
- `fieldset`·`legend`와 각 native select의 이름을 제공합니다. 필수값이
  비었거나 일부만 선택된 경우 브라우저의 기본 form 검증을 사용합니다.
- `minuteStep`은 60의 양의 약수여야 합니다. 값의 형식과 step, label,
  `hourCycle`, callback을 검사해 잘못된 설정을 조용히 표시하지 않습니다.
- 공통 token과 기존 `NativeSelect`를 사용합니다. 패키지의 새 의존성은
  없습니다. registry item은 `pyd-native-select`, `pyd-utils`에 의존합니다.
- 문서 사이트에 12/24시간 전환, 필수 form 제출 preview와 사용 코드를
  추가했습니다. source·license·접근성 기록은 `research/`와
  `registry/provenance.json`에 있습니다.

React의 select 문서, MDN의 time 입력 및 `Intl.DateTimeFormat` 문서,
W3C WAI의 form grouping 문서를 동작 기준으로 확인했습니다. 기존
`NativeSelect`의 shadcn/ui 문서, 같은 revision의 source와 MIT LICENSE,
소비자에 설치된 `lucide-react@0.468.0`의 ISC LICENSE도 확인했습니다.
외부 TimePicker 구현 코드는 가져오지 않았습니다.

## 검증

- `npm test -w @pydemia/ui`: 15개 검사 통과. 24시간 form 값,
  12시간 자정과 locale 표시, 잘못된 설정을 포함합니다.
- `npm run typecheck`, `npm run build`, `npm run registry:check` 통과.
  기본 공개 URL로 83개 registry item을 생성했습니다.
- 문서 Chromium에서 빈 필수값 제출 차단, 24시간 `21:35`, 12시간
  오전 `09:35`와 자정 `00:35`의 form 값, 부분 선택의 제출 차단,
  밝은·어두운 모드를 확인했습니다.
- 별도 Vite 소비자에 로컬 `shadcn add`로 `pyd-time-picker`와
  `pyd-tokens`를 설치했습니다. TimePicker, NativeSelect, utils, tokens,
  MIT 고지 파일이 생성됐습니다. 설치된 TimePicker의 SHA256은 원본과
  같습니다. 소비자 typecheck·build와 `npm audit --audit-level=high`가
  통과했고 취약점은 0건입니다.
- 소비자 Chromium에서 빈 필수값 제출 차단, 정오 `12:45`와 자정
  `00:45` 변환, 방향키로 `01:45` 선택·제출을 확인했습니다.
  console error는 0건입니다.

소비자 fixture 경로:
`C:\Users\pydemia\AppData\Local\Temp\pydemia-ui-time-picker-consumer-20260929`.

좁은 화면을 위한 viewport 변경은 브라우저에 실제 적용되지 않아 검증하지
못했습니다. 실제 screen reader·touch·RTL·다른 브라우저, 전체 83개
item의 새 동시 설치와 공개 배포도 확인하지 않았습니다.

## 로고 테두리 재확인

같은 날 문서 사이트 상단 로고의 사각 box border 제거 요청을 받았습니다.
현재 `.wordmark`, `.brand-mark`, `.topbar`의 계산된 border는 `0px`이고
로고 링크·이미지는 투명 배경입니다. 로컬 화면에도 사각 테두리가
보이지 않았습니다. 키보드 초점 outline을 아래쪽 선으로 바꾼 기록은
`brand-logo-flat-2026-09-29.md`에 있습니다. 이번 요청에 따른 추가
로고 CSS 변경은 없습니다.
