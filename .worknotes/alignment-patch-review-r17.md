# R17 독립 patch 검토

- 검토 기준: `9c1530e66f760b5690c837c856b6ab500c7435e8` 대비
  현재 working tree. HEAD가 해당 기준과 같음을 확인.
- 범위: UI source 19종, `design-modes.css`, UI package/lock,
  `registry.json`, DataChart 회귀 테스트, docs QA stress fixture.
- 적용 지침: `software-engineering`, `pydemia-coding-style`.
- 요청 모델/effort: `gpt-6.1-sol` / `high`.
  실제 runtime metadata: unavailable.
- 제품 수정, build, 브라우저 조작, Git 변경 없음. 이 기록만 작성.

## 판정 갱신

- 2차 검토: root의 modal portal 위치 수정과 TagsInput grid/truncate
  변경을 독립 재검토. 제품 수정 및 브라우저 실행 없음.
- 기존 Dialog focus P2는 해결 판정. 새로운 root ref 병합에서
  callback-ref cleanup 보존 문제 1건 추가 확인.
- 3차 검토: `useCallback([ref])`와 반환 cleanup을 보존하는 최신
  composedRef 및 `navigation-menu.test.mjs` 2개 테스트를 재검토.
  두 P2 모두 해결 판정. 현재 source에서 추가 actionable finding 없음.

## 해결된 항목

### P2 · modal Dialog 안의 NavigationMenu focus 이동 회귀

- 최종 상태: 해결. root context의 nav DOM ref를 통해 가장 가까운
  `role="dialog"` / `role="alertdialog"`를 기본 container로 선택한다.
  명시한 container 및 null은 우선하며, 일반 페이지는 기존
  ThemeScope portal 경로를 유지한다.
- `usePortalContainer`의 mount 후 재렌더에서 설정된 root ref를 읽어
  modal container를 선택하므로 첫 render의 null ref도 후속 render로
  해소된다. Content가 Dialog의 DOM 자손으로 복귀하여 focus trap 및
  `hideOthers` 경계 원인을 함께 해결한다.
- root 전달 runtime 결과: 최신 build Clay 320px에서 클릭 → ArrowDown
  후 link focus, inDialog true, aria-hidden 없음, bounds fit 확인.
  이 leaf가 직접 실행한 결과와 구분한다.
- 아래는 최초 발견 당시의 근거 기록.

- 위치: `packages/ui/src/components/navigation-menu.tsx:101`.
- 발생 조건: 기본 modal `DialogContent` 내부에 기존 공개 API대로
  `NavigationMenu`를 넣고, 그룹을 연 뒤 ArrowDown 또는 Tab으로
  `NavigationMenuLink`에 진입.
- 이전에는 Content가 Item 아래에 있어 DialogContent의 DOM 자손이었다.
  이번 변경은 Content를 body 또는 ThemeScope의 body portal host로
  옮긴다. 따라서 DialogContent의 DOM 자손에서 벗어난다.
- 설치된 Radix Dialog 구현은 modal이 열려 있는 동안
  `trapFocus: context.open`을 사용한다
  (`node_modules/@radix-ui/react-dialog/dist/index.js:203`).
  해당 FocusScope는 자신의 container 밖으로 focus가 이동하면
  마지막 내부 element로 되돌린다
  (`node_modules/@radix-ui/react-focus-scope/dist/index.js:73`).
- NavigationMenu ContentImpl은 FocusGroup과 DismissableLayer를 쓰며
  별도 FocusScope를 만들지 않는다
  (`node_modules/@radix-ui/react-navigation-menu/dist/index.js:620`).
  따라서 새 menu를 열어도 바깥 Dialog의 focus trap이 일시 중지되지
  않아 링크에 진입한 focus가 trigger 쪽으로 돌아간다.
- Dialog의 `hideOthers(content)`도 존재하므로, dialog mount 당시
  이미 존재하는 닫힌 Popper wrapper는 dialog 밖 sibling으로 숨겨진다.
  이후 그 wrapper 아래 menu를 열면 접근성 tree에서도 숨겨질 수 있다.
- 권장 수정: collision 처리를 유지하면서 modal 내부에서 Content가
  올바른 DOM/focus 범위에 남도록 기본 portal 위치를 처리한다.
  `container`를 새로 전달해야만 기존 사용법이 동작하는 상태는
  공개 API 사용 회귀를 남긴다. 별도 FocusScope만 추가하면
  `hideOthers` 관계까지 해결되는지 함께 확인해야 한다.
- 판정 근거: 이전/현재 source와 설치된 Radix 구현에 근거한 확정
  경로. 브라우저 재현은 이번 read-only leaf에서 실행하지 않았으며
  root에 해당 조합의 runtime 검증을 요청함.

### P2 · 공개 root callback ref의 React 19 cleanup 유실

- 최종 상태: 해결. `useCallback([ref])`가 같은 consumer ref를 쓰는
  render 사이에 composedRef identity를 유지한다. detach 때 반환된
  consumer cleanup을 실행하고, 없으면 legacy callback의 null 호출
  또는 객체 ref 초기화를 수행한다. 내부 rootRef도 함께 정리한다.
- 새 회귀 테스트는 cleanup callback이 유효한 HTMLElement만 받는지,
  같은 ref로 content render 후 attach 1회/cleanup 0회인지, 최종
  unmount 후 cleanup이 정확히 1회인지 검사한다. 최초 회귀의 cleanup
  누락과 render마다 callback 교체 문제를 실제 React mount/update/
  unmount 경로에서 구분하므로 유의미한 검사다.
- 다른 테스트는 처음부터 열린 menu의 link가 enclosing dialog의
  DOM 자손인지 검사한다. fake role dialog를 사용하므로 실제 modal의
  focus trap 실행까지 검사하지는 않으며, 그 부분은 앞서 root가
  전달한 브라우저 검증 결과와 구분한다.
- 이번 leaf는 테스트 source를 검토했으며 build/test를 실행하지 않음.
  최종 source/test 대상 `git diff --check` 통과.
- 아래는 최초 발견 당시의 근거 기록.

- 위치: `packages/ui/src/components/navigation-menu.tsx:30`의 root ref
  callback에서 `if (typeof ref === "function") ref(node)`.
- 발생 조건: consumer가 `NavigationMenu`의 ref callback에서 observer,
  listener 등 해제 함수를 반환하는 React 19 사용법을 적용.
- 새 wrapper는 callback의 반환값을 버리므로 React/Radix에 cleanup이
  전달되지 않는다. 따라서 unmount 또는 ref 교체 때 해당 해제 함수가
  실행되지 않는다. ref callback은 매 render마다 새 함수라 평범한
  부모 render만으로도 재등록이 발생한다.
- 이전에는 ref가 Radix Root로 직접 전달되었다. 설치된
  `@radix-ui/react-navigation-menu` Root는 `useComposedRefs`를 쓰고,
  `@radix-ui/react-compose-refs/dist/index.js:47`부터 callback cleanup을
  모아 반환하므로 기존 공개 사용법에서 cleanup이 보존되었다.
  `packages/ui/package.json` peer는 React `^19.0.0`이므로 해당 사용법은
  지원 범위에 속한다.
- 권장 수정: rootRef와 consumer ref를 합치는 callback의 identity를
  안정화하고, consumer ref가 반환한 cleanup을 보존한다. callback이
  cleanup을 반환하는 경우 rootRef의 해제도 함께 처리한다.
- 판정: source로 확인한 회귀. 제품 변경 및 runtime 실행 없음.

## 수정 필요한 항목

- 현재 없음. 발견한 두 회귀 모두 최신 source에서 원인 해소 확인.

## 나머지 검토 결과

- NavigationMenu의 Item/Trigger ref 전달과 Radix의 value, 열림/닫힘,
  Escape, focus proxy 경로는 보존된다. 기본 페이지 사용에서 다른
  수정 필요 항목은 source에서 확인하지 못함.
- Popper/Portal 직접 import와 UI dependency, lockfile, navigation-menu
  registry dependency가 일치함. `foundation/portal-scope` 파일 의존성도
  registry에 추가됨. 기존 transitive dependency 버전을 그대로 사용.
- DataChart는 SVG 축만 축약하고 inspector option, 전체 데이터 table,
  접근 가능한 이름의 원문을 보존함. sr-only block wrapper로 table의
  intrinsic layout을 가두는 변경은 데이터 의미를 보존함.
- Select/Sidebar/NodeCanvas/TagsInput의 시각적 축약은 DOM text 또는
  접근 가능한 label을 남김. TagsInput은 title도 전체 tag를 보존하고,
  `grid-cols-1`과 내부 `min-w-0`가 암시적 grid track의 최소 너비를
  제한한다. radio card, Toast, Terminal,
  FileUpload, ModelSelector, tooltip/menu/popover의 wrap은 원문 보존.
- unlayered design CSS의 우선순위를 확인. ButtonGroup의 focus
  outline-offset은 non-basic 모드에서 기존 `-4px` 규칙이 utility의
  `-2px`보다 우선하지만 둘 다 내부 방향이므로 이번 overflow 처리의
  focus 목적과 충돌하지 않음. 공유 title/heading wrap은 non-basic
  scoped rule이고 Basic은 각 수정 component utility를 사용함.
- docs stress fixture는 dev QA 진입점에서만 사용되며 실제 공개
  production input은 기존처럼 제외됨.
- scoped `git diff --check` 통과. build/test/browser는 root 소유로
  실행하지 않았으며, root가 전달한 통과 결과를 이 검토의 자체 실행
  결과로 간주하지 않음.

## 최종 Menubar 국소 변경 추가 검토

- 추가 범위: `packages/ui/src/components/menubar.tsx`와 docs stress의
  기존 dropdown 항목에 추가한 Menubar 예시. 추가 탐색 및 제품 수정 없음.
- root 전달 재현: Clay 320px에서 긴 단일 항목의 panel 너비 807.6px.
  이번 leaf에서는 해당 browser 재현을 실행하지 않음.
- 공통 contentStyle의 최소 너비를 `min(11rem, available-width)`로
  제한하고 최대 너비를 같은 Radix available-width로 설정했다.
  기존 available-height와 세로 스크롤을 유지하며, shared itemStyle의
  `min-w-0` / `overflow-wrap:anywhere`가 원문을 보존하며 줄바꿈한다.
- 이 변경은 기존 Content/SubContent 및 item 변형에 같은 규칙을
  적용하며 primitive, 상태, 이벤트, ref, portal/container 경로를
  바꾸지 않는다. 새로운 dependency 및 registry 추가도 필요하지 않음.
- dev fixture는 이미 사용하던 identifier를 MenubarItem에 전달하므로
  DropdownMenu와 동일 내용으로 크기 경계를 비교할 수 있다.
- source 검토에서 추가 actionable finding 없음. Menubar 대상
  `git diff --check` 통과. build/test/browser 판정은 root 소유 유지.
