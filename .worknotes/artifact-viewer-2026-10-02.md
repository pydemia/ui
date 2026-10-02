# ArtifactViewer 작업 기록

## 사용처와 경계

AI 초안·코드 결과물을 revision별로 검토하고 직전 revision과 비교하는
사용처입니다. `ToolCall`의 한 번의 실행 결과와 `CodeBlock`의 단일
소스 보기로는 선택 상태와 비교를 반복해서 조합해야 합니다.
`ArtifactViewer`는 오래된 것부터 배열로 받은 revision을 표시하고
선택 변경을 호출자에게 전달합니다. 저장·실행·다운로드는 하지
않습니다. `RichTextEditor`의 편집 기능을 대신하지 않습니다.

## 출처와 구현

pydemia/ui의 원본 React·Tailwind 구현입니다. 기존 `Button`·
`CopyButton`·`DiffViewer`·`Markdown`·`utils`를 조합하고 새 npm
의존성을 추가하지 않았습니다. WAI-ARIA APG Button Pattern은 native
버튼·`aria-pressed` 상태의 참고 자료이며 source를 복사하지
않았습니다. Markdown은 저장소의 안전한 부분집합으로만 표시하고
원문·코드·일반 텍스트는 HTML로 해석하지 않습니다.

## 로컬 검증 상태

public export, registry item·provenance, 문서 preview·Usage와
세 대상 테스트를 추가했습니다. `npm run typecheck`와 `npm run build`,
UI 테스트 199/199가 통과했습니다. 전체 UI 테스트 첫 실행은 새 테스트의
제목 기대값이 기존 Markdown의 h2 매핑과 달라 198/199였고, 기대값을
고친 뒤 전체 테스트를 재실행해 통과했습니다.

로컬 Chromium에서 v3와 v2의 line diff, v1 선택 때 비교 표시 해제,
원문 표시와 Enter 키의 내용 복귀를 실행했습니다. 390px 화면에서
문서 가로 넘침은 없고 console error는 0건이었습니다.
`registry:check`는 provenance SHA-256 고지 pin이 이전 revision을
가리켜 현재 실패합니다. source commit 이후 고지·snapshot을 만들고
재검사해야 합니다. 공개 PR CI·배포·URL과 실제 screen reader·touch·
Safari·RTL은 아직 확인하지 않았습니다.

공개 수량은 128개 component·130개 item·53개 snapshot입니다.
로컬 후보는 129개 component·131개 item이며 goal 관리용 추정은
약 97%로 유지합니다.
