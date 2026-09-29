# Navigation 표시 형태 확장

2026-09-29. 전역 탐색 링크의 기존 표면형과 측면 탐색 링크의 기존
선형을 기본값으로 유지했습니다. `GlobalNavLink variant="underline"`는
현재 페이지를 accent 밑줄로, `SideNavLink variant="filled"`는
accent 배경과 accent foreground로 표시합니다. 두 경우 모두 native
`<a>`와 호출자가 지정한 `aria-current="page"`를 유지합니다. 링크의
대상, 라우터 상태, 키보드 동작은 변경하지 않았습니다.

`@pydemia/ui`의 두 props type을 export하고 문서 Usage와 전환 가능한
preview를 갱신했습니다. 브라우저에서 문서의 unlayered `a` 색상 규칙이
component의 현재 페이지 색상을 덮는 것을 확인해 해당 일반 규칙만
CSS base layer로 옮겼습니다. 변경 후 밝은 모드의 채움형은
`rgb(36, 93, 112)` 배경과 흰 글자, 어두운 모드는
`rgb(131, 191, 210)` 배경과 `rgb(19, 35, 45)` 글자로 계산됐습니다.
밑줄형의 하단 테두리는 2px이고 accent 글자색이 적용됐습니다.

`npm run test -w @pydemia/ui`의 45개, `npm run typecheck`,
`npm run build`, `npm run registry:check`가 통과했습니다. 문서 Chromium
preview에서 두 전환 버튼과 밝은·어두운 모드를 조작했고 console
error·warning은 0건이었습니다. 기존 격리 소비자
`C:\Users\pydemia\AppData\Local\Temp\pydemia-ui-bottom-navigation-consumer-20260929`
에 CLI 4.21.0 `--overwrite`로 현재 `pyd-navigation`을 설치했습니다.
생성 `navigation.tsx`의 SHA-256은 원본과 같았고 새 variant 사용 코드의
typecheck·Vite build가 통과했습니다.

새 로컬 snapshot ID:
`sha256-a1cd11bae6654a55136729439cd7b437a507d59896271b7c0950745a9e61bf21`.
이전 두 snapshot은 보존했습니다. 실제 screen reader 발표, touch,
라우터 연동, 공개 snapshot URL 설치와 배포는 확인하지 않았습니다.
