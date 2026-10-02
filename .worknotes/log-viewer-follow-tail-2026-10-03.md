# LogViewer 최신 로그 따라가기

2026-10-03. 기존 `LogViewer`에 `followTail`을 추가했습니다. 기본값은
`false`여서 기존 스크롤 동작과 버튼 표시는 유지됩니다. 활성화하면
새로 보이는 로그 뒤로 스크롤하고, 토글을 끄면 현재 위치를 유지합니다.
다시 켜면 최신 항목으로 이동합니다. 토글은 native `button`과
`aria-pressed`·`aria-controls`를 사용하며 공통 token으로 표시합니다.
추가 dependency나 외부 upstream 코드는 없습니다. 기존
`pydemia/ui` 원본 구현을 확장했습니다.

문서 preview에서 5개씩 로그를 추가하며 자동 스크롤·일시정지·재개를
확인할 수 있습니다. Usage에는 React 상태로 로그를 추가하는 코드를
넣고 예시에서 사용하는 `button` item을 설치 목록에 포함했습니다.

대상 테스트 3/3, `npm run typecheck`, `npm run build`,
`npm run registry:release-check`, `git diff --check`가 통과했습니다.
Chromium의 390px 문서 preview에서 새 항목을 두 번 추가하자
`scrollTop=80`, `scrollHeight=336`, `clientHeight=256`이었습니다.
따라가기를 끈 뒤 다섯 항목을 더 추가해도 `scrollTop=80`을
유지했고, 다시 켜자 최대값 `200`으로 이동했습니다. 로그 ID와
버튼의 `aria-controls`가 일치했고 가로 넘침은 없었습니다.
native 버튼에 focus를 둔 뒤 Space로 `aria-pressed=false`가 되는
것도 확인했습니다.

62번째 snapshot은
`sha256-2e4fde9098e359a1be6506393e229e2aed327b2c6be3899d9b16784958d03d18`입니다.
이전 snapshot과 비교해 파일 본문이 바뀐 item은
`pyd-log-viewer.json`뿐입니다. 실제 screen reader 발표와 다른
브라우저, production 배포는 확인하지 않았습니다. 공개 수량은
마지막 확인 기준 130개 component·132개 registry item·58개
snapshot이고, 저장소 후보는 133개·135개·62개입니다.
Goal 관리용 추정은 약 97%로 유지합니다.
