# ToggleGroup 편입

2026-09-29. Actions에 `ToggleGroup`을 추가했습니다. 현재 로컬 작업
트리는 78개 component와 80개 registry item입니다. 기존 `Toggle`은
버튼 하나의 눌림 상태를, `RadioGroup`은 form의 단일 선택을 다룹니다.
새 그룹은 보기 모드와 표시 정보처럼 서로 관련된 토글의 focus와
단일·복수 상태를 함께 관리합니다. 별도 `SegmentedControl`은 만들지
않았습니다.

## Source와 결정

- shadcn/ui 공식 Toggle Group 문서, revision
  `98a1fe67b439324ddc857f47fbdce056600a4329`의 source와 같은
  revision의 MIT LICENSE를 확인했습니다. source는 복사하지 않고
  기존 토큰에 맞춘 얇은 wrapper를 직접 작성했습니다.
- Radix 공식 문서의 단일·복수 상태, roving focus, 방향키 동작을
  확인했습니다. `@radix-ui/react-toggle-group@1.1.19`의 설치된
  manifest, 구현과 MIT LICENSE를 확인했습니다.
- 단일 선택을 반드시 유지할 때는 preview처럼 빈 값을 거부합니다.
  복수 모드는 빈 배열도 유효합니다. form 제출 용도는 기존
  `RadioGroup`으로 안내했습니다.

## 검증

- `npm run typecheck`, `npm run build`, `npm run registry:check` 통과.
  문서 앱 빌드에는 기존 chunk size 경고가 있습니다.
- 로컬 문서 Chromium에서 단일 click·Space 선택, ArrowLeft focus
  이동, disabled 항목, 복수 click·Space 선택을 확인했습니다.
- `%TEMP%/pydemia-ui-toggle-group-consumer-20260929`에 shadcn CLI로
  `pyd-toggle-group`과 `pyd-tokens`를 설치했습니다. 소비자 component
  파일 해시가 원본과 같고 typecheck·build가 통과했습니다. Radix
  1.1.19와 utils 의존성, runtime high 이상 audit 0건을 확인했습니다.
- 소비자 Chromium에서 같은 선택·키보드 조작과 console error 0건을
  확인했습니다.

문서 dev server에서 전체 빌드 중 HMR이 발생한 뒤 기존 탭에
`createRoot()` 중복 호출 오류가 기록됐습니다. 새 소비자 탭에는 같은
오류가 없었고 문서 preview의 선택 동작도 유지됐습니다. 이 dev server
오류의 원인과 일반 재현 여부는 이번 변경에서 확인하지 않았습니다.

실제 screen reader, touch, 좁은 화면과 다른 브라우저는 확인하지
못했습니다. 전체 80개 item의 새 동시 설치와 공개 배포도 이번에는
반복하지 않았습니다. push·배포는 하지 않았습니다.
