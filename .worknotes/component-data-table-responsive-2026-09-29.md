# DataTable 좁은 화면과 문서 예시 경로

2026-09-29. Operations workspace를 390px viewport에서 확인했습니다.
변경 전 표의 열이 292px 안에 모두 압축돼 한국어가 글자 단위로
줄바꿈됐습니다. `DataTable`의 표에 `min-w-max`를 적용하고, 표를 감싼
가로 scroll 영역에 이름과 keyboard focus를 부여했습니다. 전체 문서
너비는 유지하고 표 안에서 열을 옆으로 볼 수 있습니다. 기존 API와
component·registry item 수는 바뀌지 않았습니다.

같은 검사에서 문서 개발 서버의 Registry review iframe이
`/examples/profile/`을 문서 첫 화면으로 처리하는 문제를 확인했습니다.
iframe과 전체 화면 링크를 생성된
`/examples/profile/index.html`로 연결했습니다. 문서의 React root는
HMR dispose 시 unmount하도록 해 재평가 때 중복 root 경고를 막았습니다.

## 확인한 내용

- 390px Chromium에서 DataTable scroll 영역 너비 292px, 표 내용 너비
  약 408px, 첫 행 높이 44px였습니다. 문서 전체 너비는 viewport보다
  작았습니다. 수정 전에는 행의 텍스트가 여러 줄로 잘렸습니다.
- 가로 scroll 영역이 Tab 대상이며 ArrowRight 뒤 `scrollLeft`가
  0보다 커졌습니다. 기본 desktop 폭에서는 영역과 표 너비가 모두
  682px로 같았습니다.
- iframe의 경로가 `/examples/profile/index.html`이고 내부에
  `Component intake` 예시의 요청 4건·검색·코드·상태가 표시됐습니다.
  `GET /examples/profile/`은 개발 서버에서 문서 HTML을 반환했지만
  명시한 `index.html`은 예시 HTML을 반환했습니다.
- 새 개발 탭의 console error는 0건이었습니다. 이후 문서 모듈을
  한 번 변경해 HMR을 유발했을 때도 같은 탭의 error는 0건이었습니다.
- `npm test -w @pydemia/ui` 25개, `npm run typecheck`,
  `npm run build`, `npm run registry:check` 통과. 빌드는 86개 item과
  `docs/`를 생성했습니다. 문서 JS chunk의 500 kB 경고는 남았습니다.

## 남은 범위

표의 실제 screen reader 발표와 touch·Chromium 외 브라우저는
확인하지 않았습니다. 이번 수정본의 registry 소비자 별도 재설치,
commit·push·공개 배포도 확인하지 않았습니다.
