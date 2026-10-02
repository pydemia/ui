# MarkdownEditor 작업 기록

## 사용처와 범위

게시글·문서 작성에서 Markdown 원문 입력, 실시간 미리보기와
form 제출을 한 component로 제공합니다. 기존 `Markdown` preview의
textarea 조합과 달리 오류 연결·미리보기 표시 상태를 함께 다룹니다.
서식 버튼은 browser undo로 되돌릴 수 없어 제거했습니다.
WYSIWYG 문서 모델을 요구하는
`RichTextEditor` 후보를 대체하지 않습니다.

## 구현 상태

`packages/ui/src/components/markdown-editor.tsx`를 원본 React·
Tailwind로 작성했습니다. public export·registry·provenance와 문서
preview·Usage·test를 추가했습니다. 외부 editor 코드를 복사하지
않았고 새 npm 의존성도 없습니다. 같은 저장소의 `Markdown`과
`Textarea`를 사용합니다.

전체 typecheck, UI 테스트 180/180, build가 통과했고 126개 registry
item이 생성됐습니다. 로컬 Chromium에서 원문 입력·`Ctrl+Z`·form 값·
미리보기 토글과 390px 어두운 화면을 확인했습니다. 서식 버튼으로
삽입한 값은 native undo에서 빠져 해당 버튼을 제거한 뒤 다시
확인했습니다. `registry:check`는 metadata 수정에 따른 소비자
고지의 SHA-256 불일치로 실패했습니다. source commit으로
provenance revision을 고정한 뒤 고지 hash를 갱신하고 snapshot을
만들어야 합니다. 공개 PR·CI·URL도 미검증이므로
공개 123개 component·125개 item·44개 snapshot, goal 추정 약 97%를
유지합니다.
