# AppShell 반응형 탐색 조합

2026-10-03. 기존 AppShell preview의 왼쪽 `AppSidebar`는 좁은
화면에서 본문 위에 쌓였습니다. 별도 탐색 component를 만들지 않고
`Sidebar`를 결합했습니다. 넓은 화면의 접기와 좁은 화면의 modal
drawer는 기존 `Sidebar`가 담당합니다. 오른쪽 상세 영역은
`AppSidebar`, 하단 상태는 `Collapsible` 조합을 유지합니다.

문서 preview와 Usage를 같은 조합으로 바꾸고 설치 목록에
`sidebar`를 추가했습니다. component·registry item·snapshot 수는
변하지 않습니다.

문서 typecheck와 build가 통과했습니다. 로컬 Chromium 390px에서
탐색 버튼의 클릭·Enter로 drawer를 열고 Escape로 닫을 때 focus가
버튼으로 돌아왔습니다. 링크 선택 후 drawer가 닫히고 주소 fragment가
바뀌는 것도 확인했습니다. viewport와 document scroll width는
모두 390px였습니다. 1280px에서는 측면 탐색과 본문·오른쪽 패널을
화면으로 확인했습니다. 실제 screen reader 발표와 touch 조작은
검증하지 않았습니다.

이 조합은 [PR #106](https://github.com/pydemia/ui/pull/106)에 병합한
문서 변경입니다. 최신 commit `e37d7d8`의 Verify UI run
`37054845942`가 성공하고 Vercel preview가 READY입니다. Preview
문서 HTML은 HTTP 200이며 로컬 build와 같은 JS asset을 가리킵니다.
사용자 production에는 Vercel 배포 제한으로 아직 반영되지 않았습니다.
Goal 관리용 추정은 약 97%로 유지합니다.
