# BlockEditor 작업 기록

## 사용처와 경계

공지·운영 문서의 제목·문단·목록을 ID 있는 배열로 저장하고 순서를
편집하는 사용처입니다. 문자열 원문을 작성하는 `MarkdownEditor`와
데이터 모델이 다릅니다. `BlockEditor`는 일곱 가지 블록 형식과
내용·순서 변경을 제공하고 `BlockDocument`는 저장된 배열을 native
heading·list·quote·code로 표시합니다. HTML을 해석하지 않습니다.
인라인 서식과 구조 변경의 undo는 제공하지 않으며, 로드맵의
`RichTextEditor` 후보를 완료 처리하지 않습니다.

## 구현과 로컬 검증

pydemia/ui 원본 React·Tailwind 구현입니다. 기존 `Button`·`Textarea`·
`utils`와 공통 token만 사용하며 새 npm 의존성은 없습니다. public
export, registry item·provenance, 문서 preview·Usage와 테스트를
추가했습니다. WHATWG의 native textarea 명세를 참고했고 외부
editor source는 복사하지 않았습니다.

`npm run typecheck`, UI 테스트 **196/196**, `npm run build`가
통과했습니다. 대상 테스트는 HTML 텍스트 이스케이프와 list 의미
구조, 잘못된 블록, controlled 추가·이동·삭제·focus·form 값과 disabled
상태를 확인합니다. 로컬 Chromium에서는 입력·형식 변경·추가·이동,
native 텍스트 undo와 JSON 제출, 저장된 목록 구조를 실행했습니다.
390px dark 화면에서 문서 가로 넘침은 없었고 console error는
0건이었습니다.

source commit `68f1786`의 provenance SHA-256
`e1bd8819e43f77014f29714c6bc053f6e99cd885252cf1eb53a948e06f405e6d`를
소비자 고지에 고정했습니다. `registry:check`는 130개 item·128개
export/catalog 대응을 확인했습니다. 53번째 snapshot
`sha256-7fa2055d71c6840ab5edc0e4e347e499aff36647b781bce81e7b15d1c36f62eb`을
만들고 다시 빌드한 뒤 `registry:release-check`가 현재 내용과
53개 snapshot을 통과했습니다.

새 Vite 소비자에서 로컬 URL의 `pyd-block-editor`와 `pyd-tokens`를
`shadcn@4.21.0`으로 설치했습니다. BlockEditor·Button·Textarea·utils·
token·고지 6개 파일이 생겼고 BlockEditor 소스는 줄바꿈을 제외하고
저장소 원본과 같았습니다. 소비자의 typecheck·build가 통과했습니다.
현재 item의 내부 의존성 URL은 기존 공개 경로를 가리켜 소비자에
설치된 Button·Textarea 고지는 직전 공개 revision입니다. 새 릴리스의
고지·snapshot 경로를 공개 소비자에서 확인한 것은 아닙니다.

PR CI·production·공개 URL은 아직 확인하지 않았습니다. 실제 screen
reader 발표와 구조 변경의 undo도 검증 범위가 아닙니다. 공개 수량은
127개 component·129개 item·52개 snapshot이며 로컬 후보는
128개 component·130개 item·53개 snapshot입니다. Goal 관리용 추정은
약 97%로 유지합니다.
