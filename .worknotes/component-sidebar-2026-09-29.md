# 접힘식 Sidebar

2026-09-29. `AppSidebar`의 정적 영역과 `SideNav`의 링크 표시,
`Drawer`의 modal 동작을 조합해 바로 쓸 수 있는 `Sidebar`를
추가했습니다. 현재 56개 component, 58개 registry item입니다.

## 구현 결정

- `label`과 `items`가 필수입니다. 각 item은 고유 `id`, 표시 이름,
  `href`, 선택적 icon과 현재 페이지 상태를 받습니다. 빈 이름·링크와
  중복 id는 오류로 처리합니다. 현재 페이지는 소비자가 `current`로
  지정하고 링크에는 `aria-current="page"`가 붙습니다.
- 넓은 container에서는 측면 영역을 아이콘 폭으로 접습니다. 접힌
  링크에도 전체 이름이 접근성 트리에 남습니다. `side="right"`는
  영역을 본문 오른쪽으로 배치하고 오른쪽 drawer를 엽니다.
- 좁은 container에서는 trigger로 modal Drawer를 엽니다. Radix
  Dialog가 modal focus와 Escape·focus 복귀를 처리합니다. 항목을
  선택하면 drawer를 닫습니다. 열린 상태와 접힘 상태는 각각
  controlled 또는 uncontrolled로 사용할 수 있습니다.
- 반응형 전환은 상위 `@container` 폭을 따릅니다. `AppShell`은 이미
  `@container`를 제공하며, 단독 사용 시 부모에 `@container`를
  지정해야 합니다. 화면 크기가 열린 Drawer 상태에서 바뀌는 경우의
  자동 닫힘은 구현하지 않았습니다.
- 외부 Sidebar source를 복사하지 않았습니다. 기존 Radix Dialog
  의존성을 `pyd-drawer`를 통해 사용하며 새 npm dependency는
  없습니다.

## 검증

- Chromium 문서 preview에서 Enter로 데스크톱 Sidebar를 접고,
  접힌 링크의 전체 이름과 `aria-current` 및 현재 영역 갱신을
  확인했습니다. 오른쪽 배치에서는 aside가 본문 뒤에 놓였습니다.
- 390px viewport에서 데스크톱 탐색이 숨고 모바일 trigger가
  보였습니다. Drawer를 Enter로 열고 Escape로 닫았으며 focus가
  trigger로 돌아왔습니다. 링크 선택도 drawer를 닫고 현재 영역을
  갱신했습니다. 오른쪽 drawer의 경계는 x=70–390px으로 viewport
  안쪽이었습니다. 문서의 가로 overflow는 없었습니다.
- 서버 렌더링에서 현재 페이지 속성과 빈 이름·중복 id 거부를
  확인했습니다. 별도 Vite 소비자 fixture에 `shadcn add`로 설치하고
  import·render한 뒤 typecheck·build가 통과했습니다.
- `npm run typecheck`, `npm run build`, `npm run registry:check` 및
  `git diff --check`를 실행했습니다. 최종 상태는 아래 verification
  기록과 일치해야 합니다.

실제 screen reader 발표, touch 조작, route 전환·history 연동,
열린 상태에서 container 크기를 바꾸는 동작, 빈 새 소비자에 전체
registry 설치 및 공개 배포는 확인하지 않았습니다.
