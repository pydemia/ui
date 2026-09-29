# Sidebar 섹션 탐색

2026-09-30. 상단 Components 메뉴의 category 계층을 반영한 뒤,
제품 화면의 `Sidebar`도 여러 업무 영역을 이름 있는 섹션으로
표시할 수 있도록 기존 API를 확장했습니다. 새 component나 registry
item은 추가하지 않습니다. 목표 수는 90개 component·92개 item입니다.

## 결정과 변경

- `items` 평면 목록과 `sections` 목록 중 하나를 받습니다. 섹션에는
  고유 id, 표시 이름, 한 개 이상의 링크가 필요하며 링크 id는 전체
  Sidebar에서 고유해야 합니다. 모호하거나 잘못된 입력은 오류입니다.
- 데스크톱과 모바일에서 섹션을 제목이 있는 그룹으로 표시합니다.
  접힌 Sidebar의 제목은 시각적으로 숨겨도 접근성 트리에 남습니다.
  기존 현재 페이지·선택·접힘·Drawer 상태 API는 유지합니다.
- 문서 preview에 섹션·평면 목록 전환을 넣고 Usage를 섹션 예시로
  바꿨습니다. `SidebarSection` 타입을 public export에 추가했습니다.
- shadcn/ui Sidebar 공식 문서의 그룹 개념만 참고했습니다. 원본
  구현에 직접 작성했고 새 npm dependency는 없습니다. 기존 Radix
  Dialog 의존성과 LICENSE 확인 기록을 유지합니다.

## 진행 상태

- `npm run build`, `npm run typecheck`, `npm test -w @pydemia/ui`
  59/59, `git diff --check` 통과.
- registry metadata를 수정해 `registry:check`가 고정 출처 해시
  불일치로 중단됐습니다. metadata commit을 고정한 뒤 소비자 고지의
  commit·SHA-256을 갱신하고 새 snapshot을 만들어 다시 검사합니다.
- 브라우저의 섹션 전환·접힘·모바일 Drawer, 공개 URL 소비자 설치,
  새 snapshot 배포는 아직 검증하지 않았습니다. 실제 screen reader
  발표·touch·RTL도 검증하지 않았습니다.

미공개 draft snapshot 네 디렉터리는 기존 작업의 untracked 파일로
유지합니다. 이번 릴리스에 포함하지 않습니다.
