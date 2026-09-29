# PinInput 편입

2026-09-29. Inputs에 숫자 확인 코드를 입력하는 `PinInput`을 추가했습니다.
현재 로컬 작업 트리는 79개 component와 81개 registry item입니다.
입력의 실제 form 값은 하나의 native `<input>`이 소유하고, 여섯 칸은
장식 요소입니다. 별도 입력 라이브러리는 추가하지 않았습니다.

## Source와 결정

- shadcn/ui의 공식 Input OTP 문서, revision
  `98a1fe67b439324ddc857f47fbdce056600a4329`의 source와 같은
  revision의 MIT LICENSE를 확인했습니다. 해당 구현은 `input-otp`에
  의존하므로 코드는 사용하지 않고 칸으로 구분하는 표현만 참고했습니다.
- MDN의 OTP 입력 안내에 맞춰 `autocomplete="one-time-code"`,
  `inputmode="numeric"`, 길이에 따른 `pattern`을 native 입력에 둡니다.
  실제 SMS 자동완성은 확인하지 않았습니다.
- `length`와 `groupSize`, 초기·controlled 값은 범위를 검사합니다.
  숫자가 아닌 붙여넣기 내용은 걸러내고 최대 길이에서 자릅니다.
  완성된 코드의 칸을 클릭하면 그 숫자를 선택해 교체합니다.
- 색상과 크기는 공통 token, 클래스 결합은 기존 `utils`를 사용합니다.
  registry 직접 의존성은 `pyd-utils`이고 새 npm 의존성은 없습니다.

## 검증

- `npm test -w @pydemia/ui`의 6개 검사, `npm run typecheck`,
  `npm run build`, `npm run registry:check`가 통과했습니다. 문서 Vite
  빌드에는 500 kB 초과 chunk 경고가 있습니다.
- 문서 Chromium에서 필수 입력의 빈 제출 제한, 숫자 입력·삭제,
  숫자 아닌 문자가 섞인 붙여넣기, 여섯 칸 표시, Soft variant와
  form 제출을 확인했습니다. 완성된 `123456`의 둘째 칸을 `9`로
  교체했을 때 `193456`이 유지됐습니다.
- `%TEMP%/pydemia-ui-pin-input-consumer-20260929`에 shadcn CLI로
  `pyd-pin-input`과 token을 설치했습니다. 마지막 source 수정 뒤
  덮어 설치한 파일의 SHA256이 원본과 같고 typecheck·build가
  통과했습니다. 소비자 Chromium에서 같은 자리 교체와 제출을
  확인했습니다.
- 소비자 runtime 의존성 audit은 high 이상 0건이었습니다. 이는
  dev dependency를 제외한 결과입니다.

실제 SMS 자동완성, screen reader, touch, 좁은 화면, 다른 브라우저는
확인하지 못했습니다. 81개 item 전체를 한 번에 다시 설치하거나 공개
사이트에 게시하지 않았습니다. 문서 dev server는 빌드 중 HMR로
`createRoot()` 중복 오류가 나타난 적이 있어 console error 0건으로
판정하지 않습니다.

같은 날 상단 메인 로고의 사각 테두리 제거 요청을 다시 받았습니다.
로컬 문서 사이트의 밝은·어두운 화면에서 로고 주변 박스가 보이지
않았고, 이미지·링크의 border는 `0px`, SVG 배경은 투명합니다.
제거할 선이 로고 도형의 외곽인지 다른 요소인지 사용자에게
확인 요청했습니다. 답변 전에는 로고를 변경하지 않았습니다.
