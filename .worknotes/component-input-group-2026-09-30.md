# InputGroup 편입과 모바일 SNB 후속 보정

## 결정과 구현

`AffixedInput`은 문자열 affix만 지원하므로, 요청 ID 입력 옆의 조회
버튼과 메모 textarea 아래 저장 작업을 한 테두리 안에 놓는
`InputGroup`을 편입했습니다. 공개 API는 `InputGroup`,
`InputGroupInput`, `InputGroupTextarea`, `InputGroupAddon`,
`InputGroupText`, `InputGroupButton`입니다. 기존 `Input`·`Textarea`·
`Button`·`cn`을 조합하며 새 npm runtime dependency는 없습니다.
addon의 `align`은 네 방향만 허용합니다. control과 버튼은 별도
native 요소이고 form 값은 control만 제공합니다.

모바일 문서 SNB는 이미 명시적 본문 이동을 생략했으나 component
preview 높이가 바뀌면 현재 위치가 조금 달라질 수 있었습니다.
선택 직전 문서 `scrollTop`과 SNB `scrollLeft`를 저장하고 React
화면 갱신 직후 복원합니다. 850px 초과의 기존 `#components` 이동은
그대로 둡니다. 모바일에서 페이지와 SNB를 별도 스크롤 영역으로
만들지 않아 중첩 스크롤을 늘리지 않습니다.

## 출처와 검증

공식 문서, 고정 revision 소스, 같은 revision의 MIT LICENSE와
upstream 의존성을 `research/source-inventory.md`에 기록했습니다.
수정한 source의 MIT 소비자 고지는 `registry/SHADCN_UI_LICENSE.md`로
전달합니다.

- `npm run typecheck` 통과.
- `npm test -w @pydemia/ui` 68/68 통과.
- 로컬 Chromium에서 390px InputGroup의 ID `2050` Enter 제출,
  메모 6/120·저장, 입력→조회 버튼 Tab 순서, dark token과 가로
  overflow 없음을 확인했습니다.
- 390px에서 모바일 SNB 선택 전후 `scrollY=844`, SNB
  `scrollLeft=1875`가 유지됐습니다. URL의 `#components`를
  제거하고 버튼 focus가 선택한 항목에 남았습니다.
- 1280px에서 SNB 선택 후 `#components` 위치가 84px 부근으로
  이동하는 기존 동작을 확인했습니다.

실제 touch·Safari·screen reader·RTL은 검증하지 않았습니다.
registry snapshot·독립 소비자·공개 배포는 진행 후 이 파일에
결과를 추가합니다. 기존 미공개 draft snapshot 네 디렉터리는
이번 변경에 포함하지 않습니다.
