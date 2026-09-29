# DataChart 구간 선택기

2026-09-29. 기존 `DataChart`에 선택 범주의 계열 값을 화면에 표시하는
`inspectable` 옵션을 추가했습니다. component·registry item 수는
77개·79개로 같습니다.

## 구현 결정

- 기본값은 `false`로 기존 정적 차트의 DOM과 동작을 유지합니다.
  `true`면 첫 범주를 선택합니다. 그래프의 투명한 범주 영역에 pointer를
  올리거나 클릭하거나, 이름이 연결된 native `<select>`를 조작해
  선택을 바꿉니다. keyboard·touch에는 `<select>` 경로가 있습니다.
- 선택한 범주의 각 계열 값과 단위를 보이는 `<dl>`에 표시합니다.
  `null`은 0과 구분해 `데이터 없음`으로 표시합니다. SVG는 기존처럼
  `aria-hidden`이고 전체 값은 숨겨진 `<table>`에 남깁니다.
- 빈 범주에는 선택기를 표시하지 않습니다. 범주가 있지만 모든 값이
  `null`이면 빈 그래프 안내와 선택기를 모두 표시합니다.
- 차트·구간 패널의 surface·border·text·focus 색은 공통 token입니다.
  부유 tooltip이나 별도 chart dependency는 추가하지 않았습니다.
  shadcn/ui Chart는 구성 reference이며 Recharts/source는 편입하지
  않았습니다. 원본 코드는 이 저장소가 소유합니다.

## 검증

- `npm run typecheck`, `npm test -w @pydemia/ui`, `npm run build`,
  `npm run registry:check` 통과. SSR 회귀 검사는 선택기의 값·결측,
  기본 정적 모드, 빈 범주와 전부 결측인 입력을 확인합니다.
- 문서 Chromium에서 native select의 ArrowDown, pointer 구간 이동과
  클릭, 단일·다중 계열, 누적 막대의 원본 값, 빈 데이터, dark token을
  확인했습니다. console error는 0건입니다.
- 새 Vite 소비자
  `%TEMP%/pydemia-ui-chart-inspector-consumer-20260929`에 shadcn CLI로
  DataChart·utils·tokens를 설치했습니다. 설치 source가 원본과 같고
  소비자 typecheck·build가 통과했습니다. 소비자 Chromium에서
  `null`과 음수 값을 구분했고 console error는 0건입니다. 직접
  의존성은 clsx·tailwind-merge이며 runtime high 이상 audit 0건입니다.
- 임시 localhost registry URL 빌드 후 기본 공개 URL로 복원했습니다.

실제 screen reader 발표, 실제 touch 기기, 작은 viewport, 다른
브라우저와 공개 배포는 검증하지 않았습니다. 전체 79개 registry item의
새 동시 설치도 이번에는 반복하지 않았습니다.
