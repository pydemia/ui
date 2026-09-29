# 크기 조절 패널·원형 진행 표시

2026-09-29. 기존 AppShell의 정적 영역에 크기 조절이 필요한 작업 화면을
만들 수 있도록 `ResizablePanels`를 추가했습니다. 원형 진행 상태는
별도 item 대신 기존 `Progress`의 `circular` variant로 편입했습니다.
현재 55개 component, 57개 registry item입니다.

## 구현

- `ResizablePanels`는 첫째·둘째 콘텐츠와 각 영역의 접근 가능한 이름을
  필수로 받습니다. 좌우 또는 상하 2분할, controlled·uncontrolled 크기,
  최소·최대 비율, disabled 상태를 지원합니다. 비율과 범위가 유효하지
  않으면 `RangeError`를 던집니다. 두 영역은 독립 스크롤됩니다.
- 구분선은 첫 영역을 가리키는 `role="separator"`와 값·범위·방향을
  제공합니다. 좌우에서는 Left/Right, 상하에서는 Up/Down, 양쪽 모두
  Home/End로 조절합니다. Shift를 누르면 10% 단위로 움직입니다.
  pointer capture로 drag 상태를 유지합니다. RTL 좌우 방향 처리는
  구현했지만 실제 브라우저에서는 아직 확인하지 않았습니다.
- 원형 `Progress`는 Radix Root의 `progressbar` 의미를 그대로 쓰고
  SVG ring만 추가했습니다. `value={null}`은 움직이는 부분 호로
  표시하며 값 텍스트와 `aria-valuenow`를 제공하지 않습니다.
  원형의 `showValue`는 시각적 텍스트이며 접근성 값은 Root가 소유합니다.
- 두 기능 모두 기존 semantic color token을 사용하며 새 npm
  dependency는 없습니다. `ResizablePanels`는 이 저장소의 원본
  구현입니다. WAI-ARIA Window Splitter 문서를 동작 reference로
  참고했고 upstream 코드를 복사하지 않았습니다.

## 검증

`npm run typecheck`, `npm run build`, `npm run registry:check`가
통과했습니다. 빌드는 기본 공개 registry base URL로 57개 item을
생성했습니다. 문서 사이트에서 다음을 확인했습니다.

- 좌우 separator 42%에서 Right 44%, Shift+Right 54%, End 80%,
  Home 20%로 바뀌었습니다. 상하 전환 후 Down 22%, pointer drag
  후 62.4%가 됐습니다. 방향·값과 두 named region이 접근성 트리에
  표시됐습니다.
- 선형·원형 `Progress`가 처음 30%, 버튼 클릭 후 40%로 함께
  갱신됐습니다. 원형 indeterminate는 `data-state="indeterminate"`이고
  `aria-valuenow`가 없습니다. 두 variant를 light/dark로 확인했습니다.
- 기존 Vite 소비자 fixture에 로컬 `shadcn add`로 두 item을 설치하고
  import·render했습니다. fixture의 `npm run typecheck`와
  `npm run build`가 통과했습니다. 완전히 빈 새 소비자와 전체 item
  설치는 확인하지 않았습니다.
- server render에서 최소·최대가 70–90%인데 기본 비율을 생략한 경우
  70%로 시작하는지 확인했습니다. 범위를 벗어난 기본값, 무한대인
  controlled 값, 빈 영역 이름은 오류가 나는 것을 확인했습니다.

실제 screen reader 발표, touch drag, RTL pointer 방향, 좁은
viewport의 긴 콘텐츠 및 공개 배포는 확인하지 않았습니다.
