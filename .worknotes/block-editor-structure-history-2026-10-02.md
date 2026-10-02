# BlockEditor 구조 변경 이력

## 2026-10-03 공개 확인

PR #101을 `1172fc7`로 squash 병합했습니다. PR Verify UI run
`37022715201`, 병합 뒤 Verify UI run `37023888942`와 Pages run
`37023886621`이 성공했고 Vercel production deployment
`dpl_CFkMBZGnuxKucsAMiEHcB1cf7PXy`는 READY입니다. 공개
`BlockEditor` preview·Usage에 구조 이력 설명과 두 버튼이 표시됩니다.
현재 `pyd-block-editor` item, 55번째 snapshot manifest와 변경 item
URL은 HTTP 200이고 저장소 파일과 byte 단위로 일치합니다. 기존
설치 형식·의존 경로는 그대로여서 소비자 설치를 반복하지 않았습니다.
공개 수량은 129개 component·131개 item·55개 snapshot입니다.
Goal 관리용 추정은 약 97%입니다.

## 구현과 로컬 확인

기존 `BlockEditor`에 블록 추가·삭제·이동·형식 변경의 되돌리기와 다시
실행을 추가했습니다. 구조 이력은 최대 50건이며 텍스트 입력은 native
textarea의 undo에 둡니다. 구조를 복원할 때 현재 남아 있는 블록의
텍스트를 ID로 보존합니다. 삭제된 블록은 이력의 마지막 내용으로
돌아옵니다. 외부에서 구조를 바꾸면 이전 이력은 더 이상 실행되지
않으며, preview의 초기화는 editor를 remount해 이력을 비웁니다.

로컬 Chromium에서 블록 추가·문장 입력·구조 되돌리기·다시 실행으로
문장 복원을 확인했습니다. 기존 제목의 텍스트를 수정한 뒤 구조를
되돌려도 수정 내용이 남았습니다. 초기화에서 native form reset이
controlled 블록 형식 select의 표시값을 모두 문단으로 바꾸는 오류를
발견해 reset 기본 동작을 막았습니다. 수정 뒤 네 형식 값이
`heading`, `paragraph`, `bullet`, `bullet`로 돌아오고 구조 이력
버튼 둘 다 비활성화되는 것을 확인했습니다.

`npm run typecheck`, UI 테스트 200/200, `npm run build`,
`npm run registry:check`가 통과했습니다. registry 검사는 131개 item,
129개 export/catalog, 기존 snapshot 54개를 확인했습니다. 새 npm
의존성이나 provenance 변경은 없습니다. 55번째 snapshot
`sha256-a0fe54a8a6e26ece36967051aa1fcc725fd05a3af910050e8745daa50519f13f`을
생성한 뒤 재빌드했고 `registry:release-check`가 현재 빌드와 55개
snapshot을 확인했습니다. 이 시점에는 PR·공개 경로를 확인하지
않았습니다.
Goal 관리용 추정은 약 97%로 유지합니다.
