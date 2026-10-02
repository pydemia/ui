# AppShell 표시 확장

## 공개 확인

PR #86과 병합 commit `802831d`의 Verify UI run `36981731971`,
Pages run `36981731150`이 성공했습니다. Vercel production
`dpl_5fSdHa4KhYLRLwSrbGSfwrHjUz3T`는 READY입니다. 공개
사이트에서 AppShell preview의 표시 선택과 Usage를 확인했습니다.
현재 `pyd-app-shell.json`, 47번째 snapshot의 manifest·item URL은
HTTP 200입니다. Manifest에는 126개 item이 있으며 현재·snapshot
item 모두 `canvas` 소스를 포함합니다. 공개 수량은 124개 component·
126개 item·47개 snapshot입니다. Goal 관리용 추정은 약 97%를
유지합니다. 변경한 상호작용은 로컬 Chromium에서 실행했고 공개
사이트에서 같은 동작을 반복하지 않았습니다.

## 로컬 구현과 검증

시작 기준은 공개 124개 component·126개 registry item·46개
snapshot, goal 관리용 추정 약 97%입니다. 이 작업은 component를
추가하지 않고 기존 framework 재료의 표시 선택을 늘립니다.

Operations 예시에서 `AppShell`의 border·radius를 직접 제거하던
사용처를 확인해 `canvas`를 추가했습니다. 기존 `framed`는 기본값으로
유지합니다. `AppFloatingBubble`에는 텍스트가 보이는 `pill`을
추가하고 기존 원형을 기본값으로 유지했습니다. 좌우 위치는 기존
`side`를 사용합니다. 문서 preview에서 골격·bubble·위치를
바꿔 비교할 수 있습니다.

로컬 Chromium에서 두 골격의 border·radius, pill의 크기, 왼쪽
bubble과 panel의 위치, 열기·Escape·focus 복귀를 확인했습니다.
390px에서 pill이 bottom panel의 상태 문구를 가리는 것을 발견해
문서 예시가 floating UI 쪽 여백을 확보하도록 수정하고 계산된
간격을 다시 확인했습니다. dark 화면에서 `canvas`의 배경 token과
좁은 배치를 확인했습니다.

`AppShell`은 기존 pydemia/ui 원본이며 새 외부 source나 의존성은
없습니다. 기존 provenance는 여전히 정확해 수정하지 않았습니다.

`npm run typecheck`와 `npm run build`, `npm run registry:release-check`가
통과했습니다. 126개 item·124개 export/catalog와 47번째 snapshot
`sha256-7859cbc5c103067747d27f285f0ad97a9fe4b16f991a1bc4ec11b2332aeaceee`을
확인했습니다. 전체 UI 테스트는 로컬에서 반복하지 않고 PR CI에서
확인합니다. PR·공개 URL은 아직 확인하지 않았으므로 공개 수량과
goal 추정 약 97%는 유지합니다.
