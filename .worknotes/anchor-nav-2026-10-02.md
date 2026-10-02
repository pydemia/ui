# AnchorNav 편입 작업

## 선택과 구현

기존 `SideNav`는 호출자가 현재 페이지를 지정하는 경로 탐색입니다.
긴 보고서의 같은 문서 섹션을 스크롤 위치에 따라 표시하는 API는
없었습니다. handoff의 Navigation 후보 `AnchorNav`를 별도
component로 선택했습니다. 외부 component 소스를 복사하지
않고 native nav·a, React와 기존 token·`pyd-utils`로 작성했습니다.
새 npm 의존성은 없습니다.

호출자가 문서 순서의 ID·이름과 대상 섹션을 제공합니다. window와
지정한 내부 스크롤 영역을 지원합니다. 내부 링크는 바깥 문서를
스크롤하지 않고 URL hash를 갱신하며, 뒤로 가기도 반영합니다.
현재 위치에 `aria-current="location"`을 붙이고 `rail`·`inline`
표시를 제공합니다. focus는 강제로 옮기지 않습니다.

## 로컬 검증

`npm run typecheck`와 전체 UI 테스트 166/166이 통과했습니다.
Chromium 문서 preview에서 첫 링크 표시, 내부 링크 이동,
스크롤 위치별 현재 항목, variant 전환, hash 뒤로 가기를
확인했습니다. 링크에 focus를 두고 Enter를 눌렀을 때 hash·현재
항목이 바뀌고 focus가 링크에 남았습니다. 390px dark 화면에서
가로 넘침과 page error가
없었습니다. 첫 브라우저 검사에서 native hash 링크가 바깥
문서까지 움직이고 경계의 소수 픽셀 차이로 이전 섹션이 현재로
남는 문제를 발견해 내부 스크롤과 2px 허용 오차로 수정했습니다.

`npm run build`와 `registry:check`·`registry:release-check`도
통과했습니다. 로컬 119개 component·121개 item의 40번째
snapshot은
`sha256-e191ffd3a0f29bf8f2b62df77be2f4dc0c6f58f0017b30bc23ae773767672980`입니다.

현재는 로컬 공개 후보입니다. PR·배포·공개 URL은 아직 확인하지
않았습니다. 공개 수량 118개 component·120개 item·39개
snapshot과 goal 관리용 추정 약 93%는 유지합니다. 실제 보조기술
발표는 확인하지 않았습니다.
