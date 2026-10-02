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
source commit `2fabc8a`의 provenance SHA-256
`08bd431142b8305c537db768bee28101ee9d92ab8fcc48064f787a3d5b8ff8fc`를
소비자 고지에 고정했습니다. `registry:check`는 131개 item·129개
export/catalog 대응과 이전 53개 snapshot을 통과했습니다. 54번째
snapshot `sha256-0839190a80309cafbd4fc56123ef08601a8ee429792dfca5bf8e01bb8ad30d86`을
131개 item으로 만들고 다시 빌드했습니다. `registry:release-check`는
현재 빌드와 54개 snapshot의 일치를 확인했습니다.

새 Vite 소비자에서 로컬 item·token을 `shadcn@4.21.0`으로 설치해
8개 파일이 생겼고, ArtifactViewer 소스는 줄바꿈을 제외하고
저장소 원본과 같았습니다. 소비자의 typecheck·build가 통과했습니다.
하위 item URL이 이전 공개 경로를 가리켜 설치된 고지는 직전
revision입니다. 새 snapshot을 공개 소비자에서 확인해야 합니다.
PR CI·배포·공개 URL과 실제 screen reader·touch·Safari·RTL은
아직 확인하지 않았습니다.

공개 수량은 128개 component·130개 item·53개 snapshot입니다.
로컬 후보는 129개 component·131개 item·54개 snapshot이며 goal 관리용 추정은
약 97%로 유지합니다.
