# 모바일 SNB 선택 시 문서 위치

## 원인과 변경

이전 수정은 모바일 SNB의 명시적인 `scrollIntoView()`만 생략했습니다.
390px Chromium에서 본문을 `scrollY=844`까지 내린 뒤 컴포넌트를
바꾸면, preview 높이 변화에 대한 브라우저의 scroll anchoring으로
`scrollY`가 794.5로 이동했습니다. DOM focus는 선택한 SNB 버튼에
남아 있었습니다.

850px 이하에서 `.main-content`의 `overflow-anchor`를 `none`으로
설정했습니다. 컴포넌트를 바꿀 때 문서의 현재 스크롤 위치와 SNB의
가로 탐색 위치를 유지합니다. URL의 `component` 값과 `#components`,
선택 상태는 기존대로 갱신합니다. 데스크톱의 본문 자동 이동은
유지합니다.

## 확인

- 390px Chromium에서 `scrollY=794.5`, SNB `scrollLeft=6167.5`인
  상태로 Sparkline → DataChart → DonutChart를 실제 클릭했습니다.
  두 값이 유지됐고 DOM focus는 매번 선택한 SNB 버튼이었습니다.
- 1280px에서는 `overflow-anchor: auto`이며 데스크톱 SNB 선택 후
  `#components`가 상단으로 이동했습니다.
- 패키지 테스트 64/64, 전체 typecheck·build·registry release 검사와
  `git diff --check`가 통과했습니다. registry 내용은 변하지 않았습니다.
- 실제 touch 기기와 Safari는 검증하지 않았습니다. 검증 도구의
  locator click은 클릭 전 자동 스크롤을 수행해 실제 클릭과 다른
  결과가 나왔으므로 위 비교에는 브라우저의 실제 클릭 경로를
  사용했습니다.

이 변경은 [PR #10](https://github.com/pydemia/ui/pull/10)으로
병합했습니다. PR·`main` Verify UI와 Pages CI가 통과했고 Vercel
production `dpl_nw6dEJ5pQ3xtyud6LBqBvnHM5Kbm`은 READY입니다.
공개 사이트의 390px Chromium에서 `scrollY=844`, SNB
`scrollLeft=6375`인 상태로 DonutChart → DataChart를 실제
클릭했습니다. 문서·SNB 위치가 유지되고 focus와 제목이 선택에 맞춰
바뀌었습니다. 기존 미공개 draft snapshot 네 디렉터리는 포함하지
않았습니다.
