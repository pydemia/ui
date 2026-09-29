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
- `npm run build`와 `npm run registry:release-check` 통과. 94개
  registry item과 92개 component의 대응을 확인했습니다. 새 snapshot은
  `sha256-d8219d9053fecc606f6219a9ec4ed62d4d47b0d682ec6411dfe77114280da271`입니다.
- 별도 Vite 소비자에 `shadcn@4.21.0`으로 InputGroup·Field·tokens와
  전이 의존성을 설치했습니다. typecheck·build가 통과했고 390px
  Chromium에서 ID `3077` 제출, 메모 저장, 가로 overflow 없음과
  공유 focus 테두리를 확인했습니다.

실제 touch·Safari·screen reader·RTL은 검증하지 않았습니다.
기존 미공개 draft snapshot 네 디렉터리는 이번 변경에 포함하지
않았습니다.

## 공개 배포

[PR #12](https://github.com/pydemia/ui/pull/12)의 Verify UI job이
성공한 뒤 `f7dc7fcc8904abee2c748b6596d556da4c9436d9`로
병합했습니다. `main`의 Verify UI와 Pages CI가 통과했고 Vercel
production `dpl_nMLXwMs66nUFLxCGorxD5Nf3nmJo`가 READY입니다.
공개 `https://ui.pydemia.ai/?component=input-group`에서 92개
component와 InputGroup preview·Usage를 확인했습니다. 공개
`pyd-input-group.json`과 snapshot manifest는 HTTP 200이며 manifest의
item 수는 94개입니다. 공개 사이트 390px에서 InputGroup →
NumberInput → TagsInput을 선택할 때 `scrollY=844`, SNB
`scrollLeft=1875`가 유지되고 focus는 선택한 버튼으로 이동했습니다.
