# Framework·Navigation·Workflow·Layout·Content 소스 경계 감사 R17

- 범위: `geometry-r14/inventory.json`의 해당 5개 family 28종. R16에서 초기 320px/1440px geometry 8,640건 오류·가로 넘침이 없었으므로, 일반 너비 측정보다 내부 경계, 긴 콘텐츠, 메뉴/선택/포커스 paint와 좁은 사용 조건을 소스에서 살폈다.
- 읽기 자료: 요청된 R16/R17 기록, inventory, `packages/ui/src/components`의 지정 컴포넌트, `packages/ui/src/design-modes.css`, `apps/docs/src/catalog.tsx`. 카탈로그 예시는 보통 길이 콘텐츠를 중심으로 정의되어 있어 긴 문자열·최소 폭 재현을 보장하지 않는다.
- 한계: 이 leaf는 읽기 전용 소스 검토만 수행했다. 후보는 실제 브라우저 재현이나 computed geometry 검증을 거치지 않았다. runtime/model 요청값에 관한 이 leaf의 관찰은 없다. 아래는 root가 재현 여부를 결정할 수 있는 가설이다.
- CSS 주의: `design-modes.css`의 theme adapter 규칙은 unlayered이며 layered Tailwind utility보다 우선한다. 구조 수정은 component 구조/기본 클래스에서 하거나, theme별 조정이 필요할 때는 적절한 unlayered `@scope` selector에서 해야 한다. 선택 색·focus·표면의 역할은 보존하고, 의도된 스크롤·shape·그림자·overlap은 넘침으로 취급하지 않는다.

## 우선 재현할 소스 후보

1. **Sidebar 긴 링크가 navigation 폭을 밀어냄 — 중간~높은 신뢰도, 미재현.** `packages/ui/src/components/sidebar.tsx:118`의 링크 자식 `flex items-center ... whitespace-nowrap`은 비접힘 데스크톱 14rem Sidebar와 모바일 Drawer에서 label의 최소 폭을 제한하지 않는다. 카탈로그 `Sidebar` 예시는 짧은 “개요/파일/설정”만 쓴다(카탈로그 약 7587행). 긴 한글/영문 항목명이나 공백 없는 긴 이름을 넣고 320px 및 접힘/모바일 변형에서 링크의 우측 경계와 부모의 scrollWidth를 비교한다. 좁은 수정은 label span에 `min-w-0`와 `truncate`(전체 이름을 접근 가능한 이름/title로 유지) 적용, 또는 의도된 줄바꿈을 택해 anchor의 flex 자식 폭을 제한하는 것이다. `whitespace-nowrap`를 단순 제거할지는 디자인 의도와 카탈로그에서 검증한다.

2. **TabsList가 작은 부모에서 탭을 밖으로 밀 수 있음 — 높은 신뢰도, 미재현.** `packages/ui/src/components/tabs.tsx:22`는 목록을 `inline-flex gap-1`로만 두고 wrapping, max-width, overflow 정책을 지정하지 않는다. 여러 긴 탭을 320px의 좁은 부모에 배치하고 default/line/contained 세 변형에서 마지막 탭의 경계와 키보드 focus가 잘리는지 확인한다. 내용의 자연 줄바꿈을 허용할지, 접근 가능한 가로 스크롤 탭 레일로 둘지 결정한 뒤 `TabsList`에 max-width 및 wrap/overflow를 적용한다. 브라우저에서 Roving focus와 스크롤 키보드 접근을 함께 확인한다.

3. **NavigationMenu 패널의 좁은 viewport/우측 가장자리 — 중간 신뢰도, 미재현.** `packages/ui/src/components/navigation-menu.tsx:94`의 content는 `absolute left-0 ... min-w-64`이고 viewport 기준 `max-width`가 없다. 폭 288px 미만 또는 우측에 놓인 trigger에서 열린 content의 좌우 경계를 확인한다. Radix가 실제 위치를 collision-adjust 하는지 먼저 관찰하고, 넘침이 재현될 때만 content를 available viewport width로 제한하고 긴 항목은 줄바꿈하도록 수정한다. 예상상 자동 collision이 처리할 수 있으므로 source만으로 결함이라고 단정하지 않는다.

4. **NodeCanvas 고정 카드가 긴 노드 제목을 자를 수 있음 — 중간 신뢰도, 미재현.** `packages/ui/src/components/node-canvas.tsx:355`의 각 노드 wrapper는 고정 `nodeWidth`/높이에서 `overflow-hidden`을 사용한다. 제목 버튼은 363행 부근에서 단일 텍스트이며 `min-w-0`, `break-words`, `truncate`가 없고 description만 393행에서 `line-clamp-2`다. 긴 제목(특히 공백 없는 값)으로 낮은 zoom과 좁은 작업창을 확인해 제목의 세로/가로 잘림 및 포커스 outline clipping을 구분한다. 잘림이면 제목을 허용된 노드 높이에서 두 줄로 제한하거나, 노드 높이를 내용에 맞게 조정하는 방향을 검토한다. 카드 경계의 `overflow-hidden`은 의도된 캔버스 노드 경계일 수 있어 재현 없이 제거하지 않는다.

## 나머지 inventory ID 검토

소스 및 카탈로그 등록 여부를 점검했고, 이 범위에서 위 네 가지 외에는 초기 후보로 올릴 명확한 비의도 경계 침범이 확인되지 않았다. 이 판정은 모든 데이터 길이/상태 조합에서 정상임을 입증하지 않는다.

- Framework (5): `master-detail`, `app-shell`, `scroll-area`, `resizable-panels`, `sidebar` — Sidebar만 후보. ScrollArea/ResizablePanels의 overflow는 명시적 스크롤·분할 기능으로 보존.
- Navigation (8): `breadcrumb`, `tabs`, `tree`, `tree-nav`, `navigation`, `anchor-nav`, `navigation-menu`, `menubar` — Tabs와 NavigationMenu 후보. Global/BottomNav, Menubar, AnchorNav의 명시적 가로 스크롤은 의도된 동작. Tree/TreeNav는 truncation·current/focus selector 및 disclosure 경계 확인.
- Workflow (7): `calendar-scheduler`, `stepper`, `form-wizard`, `timeline`, `kanban`, `gantt`, `node-canvas` — NodeCanvas 후보. Stepper/Kanban/Gantt의 가로 스크롤은 의도된 동작; Gantt 시간축, sticky 축 레이블 및 막대 경계는 clipping 오류로 세지 않음.
- Layout (2): `card`, `separator` — 검토, 별도 넘침 후보 없음.
- Content (6): `page-header`, `content-list`, `block-editor`, `carousel`, `board`, `thread` — 별도 확정 후보 없음. 편집기/Carousel/Board/Thread는 min-width, wrapping 또는 scroll 처리가 보이고, 호출자가 제공하는 임의 콘텐츠 자체는 범위 밖으로 남음.

## 인계

- root가 실제 UI 재현과 제품 변경을 소유한다. 우선순위는 좁은 viewport의 Tabs/Sidebar, 긴 노드 제목, 이어서 trigger 위치를 바꾼 NavigationMenu 순이다.
- `design-modes.css`의 navigation adapter는 padding/min-height/selected/focus paint를 바꾸므로 후보 확인 시 Basic과 비-Basic, 기본/채움 또는 line/contained 변형을 나누어 보되, theme의 의도된 장식은 보존한다.
- 이 기록은 source-only 판정이다. 재현이 확인되면 root가 이 노트와 R17 주 기록에 결과/구현/검증 상태를 갱신한다.
