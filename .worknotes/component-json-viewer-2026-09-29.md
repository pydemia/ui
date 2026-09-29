# JsonViewer 구현·검증 기록

2026-09-29. Developer tools 범주에 `JsonViewer`를 추가했습니다.
로컬 작업 트리는 70개 component, 72개 registry item입니다. 공개
배포는 확인하지 않았습니다.

`Snippet`은 코드 예시의 탭 전환·복사, `LogConsole`은 순서가 있는 로그
표시를 맡습니다. `JsonViewer`는 API 응답과 설정값의 중첩 구조를
탐색할 때 사용합니다. native `details`·`summary`를 사용하며 처음 펼칠
깊이와 한 번에 표시할 항목 수를 지정합니다. 접힌 하위 항목은 DOM에
렌더링하지 않습니다. 원본 JSON 복사 상태를 표시하고 frame/plain
표현을 제공합니다.

JSON 호환 값만 받습니다. `undefined`, 비유한 숫자, 순환 구조, 빈틈
있는 배열, class instance, getter는 오류로 알립니다. 동일 객체를
여러 위치에서 참조하는 것은 허용합니다. WHATWG HTML의 native
disclosure와 ECMA-404의 JSON 값 범위를 확인했습니다. 외부 구현
source는 복사하지 않았습니다. 새 npm dependency는 없고 직접 registry
의존성은 `pyd-utils`입니다.

## 검증

- `npm run typecheck`, `npm run build`, `npm run registry:check`,
  `git diff --check` 통과. 기본 공개 URL의 72개 registry item을
  생성했고 로컬 URL 잔존은 발견하지 못했습니다.
- server render에서 primitive·빈 객체·빈 배열·중첩 항목의 초기
  표시와 항목 제한, 위의 잘못된 입력과 잘못된 label·깊이·page size
  거부를 확인했습니다.
- 문서 Chromium에서 Enter·Space disclosure, 하위 항목 확장,
  항목 추가 표시, 복사 성공 상태, frame/plain과 다크 모드를 확인했습니다.
- 새 Vite 소비자 fixture에 JsonViewer·token을 shadcn CLI로 설치했습니다.
  JsonViewer·utils·token 3개 파일을 생성했고 JsonViewer source hash는
  저장소와 같습니다. 소비자 typecheck·build, Chromium의 키보드 확장·
  항목 추가·복사 성공 상태가 통과했습니다.
  `npm audit --omit=dev --audit-level=high`는 0건입니다.

실제 screen reader 발표, 아주 깊거나 큰 JSON의 성능, 브라우저별
native disclosure 동작, 실제 clipboard 내용의 별도 확인, 전체 registry
item의 새 소비자 설치와 공개 배포는 검증하지 않았습니다. 문서 개발
서버의 HMR 중 React `createRoot` 중복 경고를 한 차례 확인했으며
새 소비자 화면에서는 console error가 없었습니다.
