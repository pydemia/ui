# Toast 대기열 확장

2026-09-29. 기존 `Toast`의 controlled API를 유지하면서
`useToastQueue`와 `ToastQueue`를 같은 registry item에 추가했습니다.
component와 registry item 수는 각각 77개, 79개로 같습니다.

## 동작 결정

- 기본 표시 한도는 3건이며 양의 정수로 바꿀 수 있습니다. 먼저 들어온
  알림부터 표시하고 초과분은 대기시킵니다. 한 건을 닫으면 대기 중인
  첫 알림이 보입니다. 자동 닫기는 하지 않습니다.
- `dedupeKey`가 같은 알림이 표시 중이거나 대기 중이면 반복 추가를
  무시합니다. 키가 없는 알림은 내용이 같아도 별도 건으로 남습니다.
- `ToastQueue`는 기존 `Toast`를 재사용합니다. 오류는 `alert`, 그 외에는
  `status`이며 각 알림을 이름 있는 버튼으로 닫습니다. 대기 중인
  알림은 DOM에 렌더링하지 않습니다. queue state는 호출 컴포넌트가
  소유하고 새로고침 뒤 복원되지 않습니다.
- WAI Alert Pattern의 focus 비간섭, 너무 빠른 자동 소멸과 잦은 발표
  경고를 확인했습니다. 외부 UI source나 새 npm dependency는 없습니다.

## 실행한 검사

- `npm run typecheck`, `npm run build`, `npm run registry:check` 통과.
  Vite는 문서 bundle의 500kB 초과 경고를 표시합니다.
- server render에서 `maxVisible=0`을 전달하면 예상한 `RangeError`가
  발생함을 확인했습니다.
- 문서 Chromium에서 완료 알림을 두 번 눌러 한 건만 남는 것을 확인했습니다.
  작업 알림 두 건과 오류 알림을 추가했을 때 표시 2건·대기 2건이었고,
  앞 건을 닫자 FIFO 순서로 다음 건이 나타났습니다. 오류는 `alert`,
  완료·작업은 `status`였습니다. Enter로 닫은 뒤 focus가 알림이
  나타날 때 활성화돼 있던 버튼으로 돌아왔습니다.
- 별도 Vite 소비자
  `%TEMP%/pydemia-ui-toast-queue-consumer-20260929`에 shadcn CLI로
  Toast·Button·tokens를 설치했습니다. Toast source가 저장소 원본과
  일치하고 소비자 typecheck·build가 통과했습니다. 직접 의존성은
  class-variance-authority, clsx, tailwind-merge이며 runtime high 이상
  audit 0건입니다. 소비자 Chromium에서 중복 억제, 대기·표시 전환,
  `status`·`alert`, Enter 닫기와 console error 0건을 확인했습니다.
- 임시 localhost URL 빌드를 마치고 기본 공개 URL로 다시 빌드했습니다.

실제 screen reader의 연속 발표, touch, 좁은 화면과 다른 브라우저는
검증하지 않았습니다. 전체 79개 item을 다시 동시 설치하지 않았고,
원격 push·배포도 하지 않았습니다.
