# 상단 Components 계층 메뉴

2026-09-30. 문서 사이트의 상단 `Components` 링크를
`Components → category → component` 메뉴로 바꿨습니다. 메뉴의 16개
category와 90개 component는 기존 `catalog`에서 가져옵니다. 왼쪽 목록과
별도의 항목 목록을 유지하지 않습니다.

상단 trigger는 기존 `@pydemia/ui`의 `Popover`를 사용합니다. 처음 검토한
`NavigationMenu`는 hover로 열린 직후 클릭하면 닫혀, 항목 선택 후 다시
여는 첫 클릭이 일관되지 않았습니다. `Popover`는 클릭으로 열고,
외부 클릭과 Escape로 닫습니다. category button을 선택하면 오른쪽
component link 목록이 바뀝니다. link는 실제 `?component=...#components`
주소를 제공하며, 일반 클릭에서는 기존 `selectComponent`로 URL·preview·
왼쪽 목록을 함께 갱신합니다. 브라우저 뒤로가기도 같은 category와
component를 복원합니다. 좁은 화면에서는 category와 component 목록을
각각 스크롤할 수 있습니다. 새 library나 component는 추가하지 않았습니다.

## 검증

- `npm run typecheck`, `npm run build`, `npm run registry:check` 통과.
- Chromium 문서 사이트에서 category 변경, component 선택 후 URL·preview·
  왼쪽 목록 갱신, 선택 후 첫 클릭 재열기, 키보드 category 선택과 Escape
  닫기, 브라우저 뒤로가기를 확인했습니다.
- 390px viewport에서 메뉴 배치와 component 선택을 확인했습니다.

실제 screen reader의 발표, 다른 브라우저·기기의 touch 동작은
검증하지 않았습니다. component·registry item 수와 goal 진행률은
변하지 않습니다.
