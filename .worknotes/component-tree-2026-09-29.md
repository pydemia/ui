# Tree 편입

2026-09-29. 파일·리소스처럼 계층 자체를 탐색하고 한 항목을 고르는
화면에 `Tree`를 제공합니다. 일반 사이트 메뉴는 기존 `Navigation`과
`Sidebar`를 사용합니다. W3C APG도 일반 사이트 탐색에는 disclosure
패턴이 대체로 적합하다고 설명합니다.

`Tree`는 이 저장소의 원본 React 구현입니다. 새 외부 runtime
dependency나 upstream component source를 추가하지 않습니다.
[W3C Tree View Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/)의
tree·treeitem·group 관계, 선택과 focus의 구분, 방향키·Home·End·
Enter·Space, typeahead를 설계 기준으로 삼습니다. 실제 보조기술
검사는 별도로 기록합니다.

입력은 ID·label·children·disabled를 가진 정적 노드 배열입니다.
단일 선택과 확장 상태는 controlled 또는 default 값으로 관리하며
선택 callback과 확장 callback으로 소비자에게 변경을 알립니다.
disabled 노드와 그 하위는 조작 대상에서 제외합니다. 비동기 노드
로딩·drag 이동·체크박스 다중 선택은 이 API에 포함하지 않습니다.

## 구현과 검증

`packages/ui/src/components/tree.tsx`를 package export, `pyd-tree`
registry item과 provenance에 연결했습니다. 문서 catalog에는 파일
계층 preview와 controlled 사용 코드를 추가했습니다. 노드 ID·label의
공백과 중복 ID는 명시적으로 거부합니다. 열린 노드만 DOM에 렌더하고
treeitem에 level·위치·형제 수를 지정합니다. 접힌 하위의 선택값은
유지하되 focus는 보이는 부모 또는 다른 조작 가능한 노드로 둡니다.

- UI·문서·profile demo typecheck 통과.
- 기본 공개 URL의 `npm run build`와 `npm run registry:check`가
  통과했습니다. 65개 registry item을 생성했고 `git diff --check`도
  통과했습니다. 생성 JSON에 로컬 registry URL이 남지 않았습니다.
- server render에서 group·level·선택 상태, 빈 목록, 공백 label,
  중복·빈 ID 거부를 확인했습니다.
- 문서 사이트 Chromium에서 방향키가 선택을 바꾸지 않고 focus만
  옮기는지 확인했습니다. Right·Left로 확장·접힘 및 자식·부모 이동,
  Enter·Space 선택, 연속 두 글자 이름 검색, Home·End 이동, disabled 제외, pointer
  접기와 2px focus outline을 확인했습니다.
- 밝은 모드와 어두운 모드에서 preview의 선택 배경·텍스트를 화면으로
  확인했습니다. 어두운 모드 확인 뒤 밝은 모드로 복원했습니다.
- 새 Vite 소비자 fixture에 `shadcn add`로 `pyd-tree`와 `pyd-tokens`를
  설치해 `tree.tsx`, `utils.ts`, `tokens.css` 3개 파일을 생성했습니다.
  소비자 typecheck·build가 통과했고 설치본의 선택·방향키 동작을
  Chromium에서 확인했습니다. 첫 build는 fixture의 `@/` Vite alias가
  없어서 실패했습니다. fixture import를 상대 경로로 고쳐 재실행했습니다.
- 소비자 fixture의 `npm audit --omit=dev`는 취약점 0건이었습니다.
  전체 `npm audit`는 이 fixture가 복사해 사용한 개발 의존성
  `vite@7.1.3`의 high advisory 1건을 보고했습니다. 저장소 빌드는
  `vite@7.3.6`으로 실행됐으며 해당 fixture 경고를 새 Tree 의존성의
  검증 결과로 해석하지 않습니다.

실제 screen reader 발표, touch, RTL, 매우 깊은 계층·대량 노드 성능,
비동기 데이터 교체, 전체 registry item의 새 프로젝트 설치는 확인하지
않았습니다. 현재 변경은 로컬 작업 트리에 있으며 공개 배포는
확인하지 않았습니다.
