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
확인했습니다. 첫 `registry:check`는 metadata 수정에 따른 소비자
고지의 SHA-256 불일치로 실패했습니다. source commit `6569c24`의
provenance SHA-256 `6743ba15e28074fa3a129295cc645a3e37e7b8f02c40df0f5226dd661304f45b`를
고지에 고정한 뒤 다시 빌드했습니다. `registry:check`는 126개
item·124개 export/catalog를 확인했고 45번째 snapshot
`sha256-cc579f24116bf186bc851b49eceaf7a29f37afc11b36e33728a54e0265c941c6`을
생성했습니다. 재빌드 후 `registry:release-check`가 통과했습니다.
공개 PR·CI·URL은 미검증이므로
공개 123개 component·125개 item·44개 snapshot, goal 추정 약 97%를
유지합니다.
