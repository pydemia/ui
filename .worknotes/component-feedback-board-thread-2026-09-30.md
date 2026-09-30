# 답변 평가·즐겨찾기·게시판·대댓글 편입

요청 범위: 답변의 👍/👎 평가, 이진 즐겨찾기, 글 게시판,
댓글의 대댓글을 재사용 가능한 UI와 registry item으로 제공합니다.
중앙 modal은 기존 `Dialog`, 파괴적 확인은 기존 `AlertDialog`를 사용합니다.
`Rating`의 별점 점수와 이진 즐겨찾기는 별도 상태로 유지합니다.

## 설계

- `ResponseFeedback`: controlled `up | down | null`과 선택·취소,
  선택 사항인 집계 수. 답변 저장과 집계 갱신은 소비자가 소유합니다.
- `FavoriteToggle`: controlled/uncontrolled 이진 상태와 선택 사항인 수.
  저장·로그인·실패 처리는 소비자가 소유합니다.
- `Board`: 게시글 목록, 제목·요약·작성자·시각·분류·댓글 수와
  선택·새 글 action. 게시글 데이터·검색·페이지·저장은 소비자가 소유합니다.
- `Thread`: flat `id`/`parentId` 목록에서 대댓글 계층을 만들고 답글을
  작성합니다. 중복·고아·순환 parent를 거부하고 비동기 실패 때 초안을
  보존합니다. 저장과 삭제·수정 권한은 소비자가 소유합니다.
- 문서에서는 `Board`+기존 `Dialog`의 글 작성·선택과 `Thread`의
  답글 작성 흐름을 각각 실제 preview와 사용 코드로 보여 줍니다.

모든 신규 소스는 프로젝트에서 작성합니다. 기존 `Button`, `Toggle`,
`Textarea`, `Dialog`, `lucide-react`만 사용합니다. 외부 구현은 복사하지
않습니다. 공식 shadcn Dialog 문서와 현재 registry의 고정 revision
소스·LICENSE, W3C 접근성 명명·목록 지침은 참고 자료로 확인합니다.

## 검증 상태

- `npm run typecheck` 통과.
- `npm test -w @pydemia/ui` 96/96 통과. 접근성 집계 설명 변경 뒤
  새 테스트 5개를 다시 통과했습니다.
- 최종 `npm run build`·`npm run registry:release-check` 통과:
  registry item 103개·component 101개·tracked snapshot 17개, 현재
  내용과 새 snapshot ID 일치.
- 로컬 Chromium에서 Board 선택·Dialog 작성·게시, Thread 부모 답글
  작성·반영, 평가의 배타적 선택, 즐겨찾기의 Space 조작을 확인했습니다.
  390px Thread의 문서 너비는 viewport 390px 안에 머뭅니다. Dialog
  Escape 뒤 글쓰기 버튼으로 포커스 복귀도 확인했습니다.
- 별도 Vite 소비자에 신규 item 4개·Dialog·token을 로컬 registry URL로
  설치해 11개 파일을 받았습니다. 소비자 typecheck·build와 390px
  Chromium의 평가·즐겨찾기·글 작성·대댓글을 확인했습니다.
- 새 불변 snapshot은
  `sha256-0239890bb7dd6954e44e658d21a4c490e4d4c93a0ff48f80aaeaed0be01a0034`입니다.
  tracked 이전 snapshot은 16개였고 이번 추가로 17개입니다. 기존
  `.worknotes/NEXT_SESSION.md`의 18개 집계에는 원 checkout에만 있는
  미추적 draft 2개가 포함된 것으로 보이며 이 worktree에는 복사하지
  않았습니다. 원 checkout의 draft 네 디렉터리는 그대로 보존했습니다.
- PR·공개 사이트·공개 URL 소비자 설치, 실제 screen reader·touch·
  Safari·RTL은 아직 검증하지 않았습니다.
