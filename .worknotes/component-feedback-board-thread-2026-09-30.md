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
- 문서에서는 `Board`+`Thread`+기존 `Dialog`의 글 작성·선택·답글
  흐름을 실제 preview와 사용 코드로 보여 줍니다.

모든 신규 소스는 프로젝트에서 작성합니다. 기존 `Button`, `Toggle`,
`Textarea`, `Dialog`, `lucide-react`만 사용합니다. 외부 구현은 복사하지
않습니다. 공식 shadcn Dialog 문서와 현재 registry의 고정 revision
소스·LICENSE, W3C 접근성 명명·목록 지침은 참고 자료로 확인합니다.

## 검증 상태

- `npm run typecheck` 통과.
- `npm test -w @pydemia/ui` 96/96 통과. 접근성 집계 설명 변경 뒤
  새 테스트 5개를 다시 통과했습니다.
- 첫 `npm run build` 통과: registry item 103개, 정적 문서 출력.
  이후 소스 변경을 반영한 최종 build·registry 검사와 snapshot은 진행 중.
- 로컬 Chromium에서 Board 선택·Dialog 작성·게시, Thread 부모 답글
  작성·반영, 평가의 배타적 선택, 즐겨찾기의 Space 조작을 확인했습니다.
  390px Thread의 문서 너비는 viewport 390px 안에 머뭅니다.
- 아직 별도 소비자 CLI 설치, 최종 registry release 검사, 공개 사이트,
  실제 screen reader·touch·Safari·RTL은 검증하지 않았습니다.
