# AppShell floating 도움말 조합

## 공개 확인

PR #104를 `7f40cc3d3df4bfd08fdc07eb89edd93908c783d8`로
병합했습니다. PR·`main` Verify UI, GitHub Pages와 Vercel
production이 성공했습니다. 공개 현재 `pyd-app-shell` item,
58번째 snapshot manifest·item과 문서 JS asset은 로컬 빌드와
byte 단위로 일치합니다. `ui.pydemia.ai`의 같은 asset도
일치합니다. 공개 사이트에서 상호작용은 재실행하지 않았고,
아래 로컬 Chromium 결과를 사용했습니다. 실제 screen reader·
touch·Safari는 미검증입니다. 공개 수량은 130개 component·
132개 registry item·58개 snapshot, goal 관리용 추정은 약
97%입니다.

## 사용처와 변경

문서 preview와 분석 화면은 `AppFloatingBubble`과
`AppFloatingPanel`의 열림 상태, ID 연결, Escape 닫기, focus 복귀를
각각 작성했습니다. `AppFloatingDisclosure`가 이 공통 동작을
제공하도록 `pyd-app-shell`에 추가했습니다. 별도 제어가 필요한
화면은 기존 bubble·panel을 계속 사용할 수 있습니다.

이 조합은 이름 있는 native button과 `aria-expanded`·
`aria-controls`, `hidden` panel, 닫기 버튼을 사용합니다. Escape와
닫기 버튼은 bubble로 focus를 돌리고, 외부 pointer·focus 이동은
focus를 옮기지 않고 panel만 닫습니다. 좌·우 위치와 원형·pill
표시를 제공합니다. 새로운 npm 또는 registry 의존성은 없습니다.

## 검증

`npm run typecheck`, UI 테스트 209/209, `npm run build`,
`npm run registry:check`가 통과했습니다. 추가한 3개 테스트는
이름과 상태 연결, 닫기·Escape focus 복귀, 외부 focus 이동을
검사합니다. 로컬 Chromium에서 AppShell preview의 Tab·Escape,
390px 왼쪽 pill, 밝은·어두운 모드를 확인했습니다. 문서의 가로
넘침·console error·Vite error overlay는 없었습니다.

WAI APG Disclosure Pattern을 참조했고 외부 source는 복사하지
않았습니다. 실제 screen reader·touch·Safari는 미검증입니다.
58번째 snapshot
`sha256-49c65531fef9d46184a53aba4baba657814d54bdfa27fc716e1914a595ccba2b`를
생성·재빌드하고 `registry:release-check`가 132개 item·58개
snapshot을 통과했습니다. 이 시점에는 PR CI·공개 URL 검사가
남아 있었습니다. 당시 공개 기준은 130개 component·132개
registry item·57개 snapshot이었고 goal 관리용 추정은 약
97%였습니다. 기존 registry item의 사용성이 늘었으므로
component 수는 증가하지 않습니다.
